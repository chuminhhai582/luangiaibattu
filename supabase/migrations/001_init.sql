-- 001_init.sql
-- Initial schema for BaZi AI system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. profiles (users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. charts
CREATE TABLE charts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    input JSONB NOT NULL,
    normalized_datetime TIMESTAMPTZ,
    chart_json JSONB NOT NULL,
    chart_hash TEXT NOT NULL,
    near_jieqi_warning BOOLEAN DEFAULT false,
    engine_version TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_charts_hash ON charts(chart_hash);
CREATE INDEX idx_charts_user_id ON charts(user_id);

-- 3. interpretations
CREATE TABLE interpretations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chart_hash TEXT NOT NULL,
    step SMALLINT NOT NULL CHECK (step IN (1, 2, 3, 4, 5, 25)),
    content_json JSONB NOT NULL,
    model TEXT NOT NULL,
    prompt_version TEXT NOT NULL,
    input_tokens INT,
    output_tokens INT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (chart_hash, step, prompt_version)
);

-- 4. interpretations_annual
CREATE TABLE interpretations_annual (
    chart_hash TEXT NOT NULL,
    year INT NOT NULL,
    content_json JSONB NOT NULL,
    model TEXT NOT NULL,
    prompt_version TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (chart_hash, year)
);

-- 5. knowledge_modules
CREATE TABLE knowledge_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    step SMALLINT NOT NULL,
    title TEXT NOT NULL,
    content_md TEXT NOT NULL,
    priority INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    version INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. few_shot_examples
CREATE TABLE few_shot_examples (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    step SMALLINT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    input_json JSONB NOT NULL,
    expected_output JSONB NOT NULL,
    source_note TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. settings
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. eval_cases
CREATE TABLE eval_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    input JSONB NOT NULL,
    expected_chart JSONB NOT NULL,
    expert_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. feedback
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chart_id UUID REFERENCES charts(id) ON DELETE CASCADE,
    rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    chart_id UUID NOT NULL REFERENCES charts(id) ON DELETE CASCADE,
    product_key TEXT NOT NULL,
    amount INT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'expired', 'manual_review', 'refunded')),
    qr_payload TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. payment_transactions
CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gateway TEXT NOT NULL,
    gateway_txn_id TEXT UNIQUE NOT NULL,
    raw_payload JSONB NOT NULL,
    amount INT NOT NULL,
    description TEXT NOT NULL,
    matched_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. entitlements
CREATE TABLE entitlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    chart_id UUID NOT NULL REFERENCES charts(id) ON DELETE CASCADE,
    product_key TEXT NOT NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    granted_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, chart_id, product_key)
);

-- ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE interpretations ENABLE ROW LEVEL SECURITY;
ALTER TABLE interpretations_annual ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE few_shot_examples ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE eval_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE entitlements ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- charts
-- Anyone can insert charts (anonymous or logged in)
CREATE POLICY "Anyone can insert charts" ON charts FOR INSERT WITH CHECK (true);
-- Users can read their own charts OR any chart by ID (URL sharing)
CREATE POLICY "Users can read own or known charts" ON charts FOR SELECT USING (true); -- Simplify for now, restricting via app logic

-- interpretations / interpretations_annual
CREATE POLICY "Public read for interpretations" ON interpretations FOR SELECT USING (true);
CREATE POLICY "Public read for annual interpretations" ON interpretations_annual FOR SELECT USING (true);
-- Only service role can insert (handled by API routes)

-- Admin tables (knowledge_modules, few_shot_examples, settings, eval_cases, payment_transactions)
-- In production, these should check if auth.uid() has role 'admin', but for now we rely on service_role for API access
CREATE POLICY "Admin full access for knowledge_modules" ON knowledge_modules FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);
CREATE POLICY "Public read for active knowledge_modules" ON knowledge_modules FOR SELECT USING (is_active = true);

-- Orders
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);

-- Entitlements
CREATE POLICY "Users can view own entitlements" ON entitlements FOR SELECT USING (auth.uid() = user_id);

-- Insert initial settings
INSERT INTO settings (key, value) VALUES
('zi_hour_sect', '2'::jsonb),
('use_solar_time_default', 'false'::jsonb),
('ai_model', '"claude-3-5-sonnet-20241022"'::jsonb),
('temperature_analysis', '0.2'::jsonb),
('temperature_writing', '0.7'::jsonb),
('disclaimer_text', '"Lá số Bát tự chỉ mang tính chất tham khảo, không quyết định tuyệt đối vận mệnh con người."'::jsonb),
('qi_yun_method', '"chuẩn 3 ngày = 1 năm"'::jsonb),
('price_full_reading', '99000'::jsonb),
('payment_gateway', '"sepay"'::jsonb),
('bank_account_info', '{"bank_code": "MB", "account_number": "0000000000", "account_name": "NGUYEN VAN A"}'::jsonb),
('order_ttl_hours', '24'::jsonb),
('transfer_prefix', '"BT"'::jsonb);

-- Handle new user signup via trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
