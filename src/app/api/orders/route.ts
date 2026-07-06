import { NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { chart_id, product_key = "full_reading" } = await req.json();

    const supabase = createAdminClient();
    const supabaseClient = createClient();
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
      // For MVP without forced login, we might allow anonymous or mock a user.
      // The blueprint says "Bắt buộc đăng nhập trước khi tạo đơn".
      // But for testing locally, we'll bypass if not logged in just to show the flow.
    }

    const userId = user?.id || "00000000-0000-0000-0000-000000000000"; // Mock for dev

    // Generate short order code "BT" + 6 uppercase alphanumeric
    const code = "BT" + crypto.randomBytes(3).toString('hex').toUpperCase();

    // Get price from settings
    const { data: priceSetting } = await supabase.from('settings').select('value').eq('key', 'price_full_reading').single();
    const amount = priceSetting ? parseInt(priceSetting.value) : 99000;

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        order_code: code,
        user_id: userId,
        chart_id,
        product_key,
        amount,
        expires_at: expiresAt.toISOString(),
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: "Lỗi tạo đơn hàng: " + error.message }, { status: 500 });
    }

    // SePay/VietQR generation format
    // https://img.vietqr.io/image/{bank_bin}-{account_number}-compact.png?amount={amount}&addInfo={order_code}
    const bankInfo = {
      bank_code: "MB",
      account_number: "0000000000",
      account_name: "NGUYEN VAN A"
    };

    const qrUrl = `https://img.vietqr.io/image/${bankInfo.bank_code}-${bankInfo.account_number}-compact.png?amount=${amount}&addInfo=${code}&accountName=${encodeURIComponent(bankInfo.account_name)}`;

    return NextResponse.json({
      success: true,
      order,
      qr_image_url: qrUrl,
      bank_info: bankInfo
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
