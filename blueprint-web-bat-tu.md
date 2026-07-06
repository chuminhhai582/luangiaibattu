# BÁT TỰ AI — BẢN ĐẶC TẢ HỆ THỐNG HOÀN CHỈNH (BLUEPRINT CHO AI CODE)

> Tài liệu này đủ chi tiết để dán vào Google Antigravity / Claude Code / Cursor và AI tự code toàn bộ hệ thống. Đọc theo thứ tự: Phần 0 → 8. Phần 9 là prompt mẫu tổng hợp.

---

## PHẦN 0 — TỔNG QUAN DỰ ÁN

- **Tên dự án:** Bát Tự AI (đặt tên thương hiệu sau, dùng biến env `NEXT_PUBLIC_BRAND_NAME`)
- **Mục tiêu:** Người dùng nhập thông tin sinh → hệ thống lập lá số bát tự chính xác 100% bằng thuật toán → AI luận giải chuyên sâu → hiển thị + lưu lại
- **Đối tượng:** Người Việt quan tâm mệnh lý, dùng mobile là chính (ưu tiên mobile-first)
- **Ngôn ngữ:** Tiếng Việt
- **Nguyên tắc kiến trúc số 1 (BẤT DI BẤT DỊCH):** `CODE TÍNH — AI VIẾT`. Mọi phép tính can chi, thập thần, đại vận, vượng nhược do code deterministic thực hiện. AI chỉ nhận JSON kết quả và viết bài luận. AI KHÔNG BAO GIỜ được tự tính toán can chi.

### Tech stack (đã chốt)
| Thành phần | Công nghệ | Ghi chú |
|---|---|---|
| Frontend + API | Next.js 14 App Router + TypeScript + Tailwind CSS + shadcn/ui | API routes chạy Node.js runtime (KHÔNG dùng Edge runtime cho route lập lá số) |
| Engine lập lá số | npm package `lunar-typescript` (tác giả 6tail) | Thư viện lịch vạn niên chuẩn, có sẵn class EightChar, Yun, DaYun, LiuNian |
| Database + Auth + Storage | Supabase (PostgreSQL + RLS) | |
| AI luận giải | Anthropic API — Claude Sonnet (chain 5 bước) | Streaming response cho bước viết bài |
| Hosting | Vercel | Deploy tự động từ GitHub |
| Repo | GitHub | Branch: main (production), dev (preview) |

### Bản đồ Stability Gradient (tầng nào đầu tư kỹ)
```
🔒 CỐ ĐỊNH (thiết kế kỹ, sửa sau rất đau):
   - Schema bảng charts, interpretations (Phần 3)
   - JSON schema lá số — đây là CONTRACT giữa engine và AI (Phần 5)
   - Hàm hash lá số (đổi hash = mất toàn bộ cache)
🔄 LINH HOẠT (cứ làm, sửa dễ):
   - UI components, layout trang kết quả
   - Văn phong prompt bước 3-4
📦 TÁCH RIÊNG (sửa qua admin/DB, không cần deploy):
   - Nội dung knowledge base (bảng knowledge_modules)
   - Few-shot examples (bảng few_shot_examples)
   - Cấu hình trường phái, model AI, disclaimer (bảng settings)
```

---

## PHẦN 1 — KIẾN TRÚC & LUỒNG XỬ LÝ

```
Người dùng nhập: ngày giờ sinh (dương/âm), giới tính, nơi sinh (tỉnh/thành)
        │
        ▼
[1. NORMALIZE] lib/time/normalize.ts
   - Nếu nhập âm lịch → convert sang dương (lunar-typescript)
   - Áp múi giờ lịch sử VN (data/vn-timezone-history.json)
   - (Tùy chọn) hiệu chỉnh giờ mặt trời thực theo kinh độ tỉnh
   - Detect sinh sát giao tiết khí (±2h) → cờ cảnh báo
        │
        ▼
[2. ENGINE] lib/bazi/engine.ts (bọc lunar-typescript)
   - Lập tứ trụ, tàng can, thập thần, nạp âm, đại vận, lưu niên
   - lib/bazi/relations.ts: quét hợp/xung/hình/hại/phá
   - lib/bazi/shensha.ts: tra thần sát (data/shensha-rules.json)
   - lib/bazi/strength.ts: chấm điểm vượng nhược
   - Output: BaziChartJSON (contract — Phần 5)
        │
        ▼
[3. HASH] lib/bazi/hash.ts
   - key = sha256(tứ trụ 8 chữ + giới tính + tuổi khởi vận + chiều vận + version engine)
        │
        ▼
[4. CACHE CHECK] bảng interpretations (Supabase)
   ├── HIT  → trả bài luận ngay (chi phí AI = 0)
   └── MISS → [5. AI CHAIN] 5 bước (Phần 6) → lưu cache → trả kết quả
```

**Quy tắc runtime:** route `/api/chart` phản hồi < 200ms (thuần tính toán). Route `/api/interpret` stream kết quả bước 3-4 về client bằng Vercel AI SDK.

---

## PHẦN 2 — SITEMAP

```
WEBSITE BÁT TỰ AI
│
├── TRANG NGƯỜI DÙNG (Public)
│   ├── / ......................... Trang chủ: giới thiệu + form nhập nhanh
│   ├── /lap-la-so ................ Form nhập đầy đủ (ngày giờ, giới tính, nơi sinh, tùy chọn nâng cao)
│   ├── /la-so/[id] ............... Trang kết quả: lá số trực quan + bài luận (share được qua link)
│   ├── /kien-thuc ................ Blog kiến thức bát tự (SEO)
│   │   └── /kien-thuc/[slug]
│   ├── /gioi-thieu ............... Về phương pháp, độ chính xác, disclaimer
│   └── /chinh-sach ............... Chính sách bảo mật dữ liệu sinh
│
├── TÀI KHOẢN (Supabase Auth — email/Google)
│   ├── /dang-nhap, /dang-ky
│   └── /tai-khoan
│       └── /tai-khoan/la-so ...... Danh sách lá số đã lập của tôi
│
└── ADMIN (/admin/* — role = admin)
    ├── /admin .................... Dashboard: số lá số lập/ngày, cache hit rate, chi phí API
    ├── /admin/kien-thuc-nen ...... CRUD knowledge_modules (nội dung luận giải theo bước)
    ├── /admin/vi-du-mau .......... CRUD few_shot_examples
    ├── /admin/cau-hinh ........... settings: trường phái giờ Tý, model AI, temperature, disclaimer
    ├── /admin/eval ............... Chạy bộ eval_cases, xem kết quả regression
    └── /admin/phan-hoi ........... Feedback người dùng về bài luận
```

---

## PHẦN 3 — DATABASE SCHEMA (Supabase / PostgreSQL)

> 🔒 Tầng CỐ ĐỊNH. Tạo bằng SQL migration file trong repo (`supabase/migrations/`). Bật RLS trên TẤT CẢ các bảng.

### Bảng `profiles`
| Trường | Kiểu | Mô tả |
|---|---|---|
| id | UUID (PK, = auth.users.id) | |
| display_name | Text | |
| role | Enum: user / admin | Mặc định user |
| created_at | Timestamptz | |

### Bảng `charts` — mỗi lần lập lá số
| Trường | Kiểu | Mô tả |
|---|---|---|
| id | UUID PK | Dùng làm URL /la-so/[id] |
| user_id | UUID FK profiles, nullable | Null nếu khách vãng lai |
| input | JSONB | Input gốc: {birth_date, birth_time, calendar_type, gender, province_code, use_solar_time, zi_hour_sect} |
| normalized_datetime | Timestamptz | Sau khi chuẩn hóa múi giờ + giờ mặt trời |
| chart_json | JSONB | BaziChartJSON đầy đủ (Phần 5) |
| chart_hash | Text, index | Khóa liên kết sang interpretations |
| near_jieqi_warning | Boolean | Sinh sát giao tiết khí |
| engine_version | Text | Ví dụ "1.0.0" — đổi logic engine thì bump |
| created_at | Timestamptz | |

### Bảng `interpretations` — cache bài luận (TÀI SẢN QUAN TRỌNG NHẤT)
| Trường | Kiểu | Mô tả |
|---|---|---|
| id | UUID PK | |
| chart_hash | Text, UNIQUE index cùng (step, prompt_version) | |
| step | Smallint 1-5 | 1=cường nhược, 2=dụng thần, 3=lĩnh vực, 4=đại vận, 5=verification |
| content_json | JSONB | Output structured của bước (bước 3-4 chứa cả markdown bài viết) |
| model | Text | claude-sonnet-4-6... |
| prompt_version | Text | Đổi prompt thì bump — cache cũ vẫn giữ để so sánh |
| input_tokens / output_tokens | Int | Theo dõi chi phí |
| created_at | Timestamptz | |

### Bảng `interpretations_annual` — luận lưu niên (cache theo năm)
| Trường | Kiểu | Mô tả |
|---|---|---|
| chart_hash + year | Composite unique | |
| content_json | JSONB | |
| model, prompt_version, created_at | | |

### Bảng `knowledge_modules` — kiến thức nền cho AI (sửa qua admin, không cần deploy)
| Trường | Kiểu | Mô tả |
|---|---|---|
| id | UUID PK | |
| step | Smallint 1-5 | Module nạp cho bước nào |
| title | Text | Vd: "Quy tắc định cường nhược nhật chủ" |
| content_md | Text | Nội dung markdown |
| priority | Int | Thứ tự ghép vào prompt |
| is_active | Boolean | |
| version | Int | |

### Bảng `few_shot_examples`
| Trường | Kiểu | Mô tả |
|---|---|---|
| id, step, is_active | | |
| input_json | JSONB | BaziChartJSON (hoặc output bước trước) |
| expected_output | JSONB | Output chuẩn do người soạn |
| source_note | Text | Vd: "Mệnh án Trích Thiên Tủy quyển 2" |

### Bảng `settings` (1 dòng, key-value JSONB)
Các key bắt buộc: `zi_hour_sect` (1=giờ Tý muộn tính ngày hôm sau, 2=ngày hiện tại — mặc định 2), `use_solar_time_default` (bool), `ai_model`, `temperature_analysis` (0.2), `temperature_writing` (0.7), `disclaimer_text`, `qi_yun_method` (chuẩn 3 ngày = 1 năm).

### Bảng `eval_cases` — bộ test regression
| Trường | Kiểu | Mô tả |
|---|---|---|
| id, name | | Vd: "Giờ Tý muộn 23:30 ngày 31/12" |
| input | JSONB | |
| expected_chart | JSONB | Tứ trụ + khởi vận đúng, đối chiếu từ bazi-mcp / phần mềm uy tín |
| expert_notes | Text | Chấm điểm luận giải |

### Bảng `feedback`
chart_id FK, rating (1-5), comment, created_at.

### RLS policies (mô tả cho AI code)
- `charts`: user chỉ SELECT dòng của mình hoặc dòng có id mình đang cầm link (dùng id UUID làm capability); INSERT cho mọi người (kể cả anon). Admin full.
- `interpretations`, `interpretations_annual`: SELECT public theo chart_hash; INSERT chỉ từ service role (API server).
- `knowledge_modules`, `few_shot_examples`, `settings`, `eval_cases`: chỉ admin đọc/ghi qua dashboard; API server đọc bằng service role.

---

## PHẦN 4 — DỮ LIỆU ĐẦU VÀO: CẦN GÌ, LẤY Ở ĐÂU, TỰ SOẠN THẾ NÀO

> Đây là phần trả lời câu hỏi "lấy dữ liệu gì ở đâu". Chia 2 nhóm: (A) có sẵn trong thư viện — không cần làm gì; (B) phải tự chuẩn bị thành file JSON trong repo tại thư mục `data/`.

### NHÓM A — Đã có sẵn trong `lunar-typescript` (npm install là xong)
| Dữ liệu | Nguồn trong thư viện | Ghi chú |
|---|---|---|
| Lịch âm ↔ dương, tiết khí theo thiên văn | class Solar, Lunar, JieQi | Tính theo Thọ Tinh thiên văn lịch (sxwnl) — chuẩn được công nhận |
| Tứ trụ can chi (đổi năm theo Lập Xuân, đổi tháng theo 12 Tiết) | class EightChar | Có tham số sect cho giờ Tý sớm/muộn: `eightChar.setSect(1 hoặc 2)` |
| Tàng can, thập thần theo can và chi, nạp âm, xun không | EightChar.getXxxHideGan / getXxxShiShenGan / getXxxNaYin | Đủ cho cả 4 trụ |
| Đại vận (chiều thuận/nghịch theo âm dương can năm × giới tính), tuổi khởi vận, lưu niên, tiểu vận | class Yun, DaYun, LiuNian, XiaoYun | `eightChar.getYun(gender)` — KHÔNG tự viết lại logic này |
| 12 trường sinh (trạng thái nhật chủ tại từng chi) | EightChar.getDiShi() | Nguyên liệu cho module vượng nhược |

**Đối chiếu kiểm chứng:** dùng repo `cantian-ai/bazi-mcp` (GitHub) làm nguồn thứ hai để cross-check output trong bộ eval — đây là MCP server sinh ra để cấp dữ liệu bát tự chính xác cho AI. Repo `tommitoan/bazica` (Go, tác giả Việt) có sẵn file JSON `solar-term.json`, chu kỳ 60 hoa giáp trong thư mục `data/` — tải về đối chiếu thêm nếu cần.

### NHÓM B — Tự chuẩn bị (5 file, đặt trong `data/` của repo)

#### B1. `data/vn-timezone-history.json` — múi giờ lịch sử Việt Nam ⚠️ QUAN TRỌNG NHẤT
Nguồn: IANA Time Zone Database (zone `Asia/Ho_Chi_Minh` + tài liệu lịch sử đổi giờ VN). Cấu trúc và dữ liệu khởi điểm (AI code: nhúng nguyên bảng này, cho phép admin bổ sung sau):
```json
[
  { "region": "all",   "from": "1906-07-01", "to": "1911-04-30", "utc_offset": "+07:06:40", "note": "Giờ Đông Dương theo kinh tuyến Phù Liễn" },
  { "region": "all",   "from": "1911-05-01", "to": "1942-12-31", "utc_offset": "+07:00" },
  { "region": "all",   "from": "1943-01-01", "to": "1945-09-01", "utc_offset": "+08:00", "note": "Thời Nhật chiếm đóng" },
  { "region": "all",   "from": "1945-09-02", "to": "1947-03-31", "utc_offset": "+07:00" },
  { "region": "north", "from": "1947-04-01", "to": "9999-12-31", "utc_offset": "+07:00" },
  { "region": "south", "from": "1947-04-01", "to": "1959-12-31", "utc_offset": "+07:00" },
  { "region": "south", "from": "1960-01-01", "to": "1975-06-12", "utc_offset": "+08:00", "note": "VNCH dùng GMT+8" },
  { "region": "south", "from": "1975-06-13", "to": "9999-12-31", "utc_offset": "+07:00" }
]
```
Logic áp dụng: từ `province_code` suy ra region (bắc/nam theo vĩ tuyến 17 giai đoạn 1954–1975), tra offset theo ngày sinh, convert giờ người dùng nhập → giờ GMT+7 chuẩn trước khi đưa vào engine. LƯU Ý CHO AI CODE: các mốc trên cần được kiểm chứng lại với IANA tzdata khi implement; viết unit test cho từng khoảng.

#### B2. `data/vn-provinces.json` — kinh độ 63 tỉnh/thành (giờ mặt trời thực)
Nguồn: Wikipedia "Danh sách đơn vị hành chính Việt Nam" / dataset simplemaps.com/data/vn-cities (free) / GADM. Chỉ cần kinh độ trung tâm tỉnh:
```json
[
  { "code": "HN",  "name": "Hà Nội",   "longitude": 105.85, "region_1954_1975": "north" },
  { "code": "SG",  "name": "TP.HCM",   "longitude": 106.70, "region_1954_1975": "south" },
  { "code": "DB",  "name": "Điện Biên","longitude": 103.02, "region_1954_1975": "north" }
]
```
Công thức hiệu chỉnh: `phút_lệch = (longitude − 105) × 4`. Điện Biên ≈ −8 phút. Đây là tùy chọn bật/tắt (`use_solar_time`), kết quả phải ghi rõ đã hiệu chỉnh hay chưa.

#### B3. `data/shensha-rules.json` — bảng tra thần sát
Nguồn: bảng tra cổ điển (thống nhất giữa các sách nhập môn tử bình — Tử Bình Chân Thuyên, các bảng thần sát phổ thông). Tự soạn dạng rule tra bảng, mỗi thần sát là 1 object:
```json
[
  { "name": "Thiên Ất quý nhân", "lookup_by": "day_gan",
    "rules": { "Giáp": ["Sửu","Mùi"], "Mậu": ["Sửu","Mùi"], "Canh": ["Sửu","Mùi"],
               "Ất": ["Tý","Thân"], "Kỷ": ["Tý","Thân"], "Bính": ["Hợi","Dậu"],
               "Đinh": ["Hợi","Dậu"], "Nhâm": ["Mão","Tỵ"], "Quý": ["Mão","Tỵ"],
               "Tân": ["Dần","Ngọ"] },
    "match_against": ["year_zhi","month_zhi","day_zhi","hour_zhi"] },
  { "name": "Đào hoa", "lookup_by": "day_zhi_group",
    "rules": { "Thân-Tý-Thìn": "Dậu", "Dần-Ngọ-Tuất": "Mão",
               "Tỵ-Dậu-Sửu": "Ngọ", "Hợi-Mão-Mùi": "Tý" },
    "match_against": ["year_zhi","month_zhi","day_zhi","hour_zhi"] }
]
```
Danh sách tối thiểu cho MVP (12 thần sát): Thiên Ất quý nhân, Văn Xương, Đào Hoa, Dịch Mã, Kình Dương, Lộc Thần, Kiếp Sát, Vong Thần, Cô Thần, Quả Tú, Hoa Cái, Không Vong. Mỗi rule PHẢI có unit test.

#### B4. `data/strength-weights.json` — trọng số chấm điểm vượng nhược
Tự định nghĩa (đây là "bí quyết" của sản phẩm, chỉnh được qua admin sau):
```json
{
  "de_lenh":  { "weight": 0.4, "desc": "Nhật chủ được lệnh tháng sinh/trợ (trạng thái trường sinh tại nguyệt lệnh)" },
  "de_dia":   { "weight": 0.3, "desc": "Thông căn tại các chi (tàng can cùng hành nhật chủ)" },
  "de_the":   { "weight": 0.3, "desc": "Số can chi sinh/trợ nhật chủ trên toàn cục" },
  "labels":   [ {"min": 0.7, "label": "vượng"}, {"min": 0.55, "label": "hơi vượng"},
                {"min": 0.45, "label": "trung hòa"}, {"min": 0.3, "label": "hơi nhược"},
                {"min": 0, "label": "nhược"} ]
}
```

#### B5. Knowledge base luận giải — seed cho bảng `knowledge_modules` (KHÔNG phải file code, là NỘI DUNG)
Nguồn tự biên soạn từ 3 sách nền (đều có bản dịch tiếng Việt): **Tử Bình Chân Thuyên Bình Chú** (khung cách cục + thập thần), **Cùng Thông Bảo Giám** (dụng thần điều hậu theo nhật chủ × tháng sinh — sách này gần như là "bảng tra", rất hợp để cấu trúc hóa), **Trích Thiên Tủy Xiển Vi** (mệnh án mẫu cho few-shot). Cấu trúc seed tối thiểu 8 module:
| step | Module | Nội dung cần soạn |
|---|---|---|
| 1 | Quy tắc cường nhược | Diễn giải 3 tiêu chí đắc lệnh/địa/thế, cách đọc score từ engine |
| 2 | Dụng thần phù ức | Vượng → ức (Quan Sát/Thực Thương/Tài); nhược → phù (Ấn/Tỷ Kiếp) |
| 2 | Dụng thần điều hậu | Bảng nhật chủ × 12 tháng từ Cùng Thông Bảo Giám (10×12 = 120 dòng) |
| 2 | Cách cục đặc biệt | Điều kiện tòng cách (tòng tài/sát/nhi), hóa cách |
| 3 | Thập thần theo cung vị | 10 thập thần × 4 trụ: ý nghĩa tính cách, lục thân, sự nghiệp |
| 3 | Hợp xung hình hại | Hệ quả từng tổ hợp theo cung vị xuất hiện |
| 3 | Thần sát | Ý nghĩa 12 thần sát MVP |
| 4 | Luận đại vận lưu niên | Quy tắc: vận kích hoạt dụng thần = thuận, kích hoạt kỵ thần = nghịch; xung nguyệt lệnh, xung nhật chi |

---

## PHẦN 5 — JSON SCHEMA LÁ SỐ (CONTRACT ENGINE → AI) 🔒

AI code tạo file `lib/bazi/types.ts` theo đúng cấu trúc này. Đây là hợp đồng cứng — mọi thay đổi phải bump `engine_version`.

```jsonc
{
  "engine_version": "1.0.0",
  "meta": {
    "solar_datetime": "1990-12-23T08:37:00+07:00",
    "lunar_date": "ngày 7 tháng 11 năm Canh Ngọ",
    "solar_time_corrected": false,
    "timezone_rule_applied": "+07:00 (1975→nay)",
    "zi_hour_sect": 2,
    "near_jieqi_warning": false,
    "gender": "nam"
  },
  "pillars": {
    "year":  { "gan": "Canh", "zhi": "Ngọ",  "hide_gan": ["Đinh","Kỷ"], "na_yin": "Lộ Bàng Thổ",
               "shi_shen_gan": "Chính Quan", "shi_shen_zhi": ["Thực Thần","Thiên Tài"] },
    "month": { "gan": "Mậu",  "zhi": "Tý",   "hide_gan": ["Quý"], "na_yin": "...",
               "shi_shen_gan": "Chính Tài", "shi_shen_zhi": ["Thiên Ấn"] },
    "day":   { "gan": "Ất",   "zhi": "Dậu",  "hide_gan": ["Tân"], "na_yin": "...",
               "shi_shen_gan": "NHẬT CHỦ",  "shi_shen_zhi": ["Thất Sát"] },
    "hour":  { "gan": "Canh", "zhi": "Thìn", "hide_gan": ["Mậu","Ất","Quý"], "na_yin": "...",
               "shi_shen_gan": "Chính Quan", "shi_shen_zhi": ["Chính Tài","Tỷ Kiên","Thiên Ấn"] }
  },
  "day_master": { "gan": "Ất", "element": "Mộc", "yin_yang": "âm" },
  "five_elements": {
    "count": { "Mộc": 2, "Hỏa": 1, "Thổ": 3, "Kim": 3, "Thủy": 2 },
    "season_state": "Nhật chủ Ất Mộc sinh tháng Tý (Thủy vượng) — trạng thái: tướng"
  },
  "strength": { "score": 0.42, "label": "hơi nhược",
    "detail": { "de_lenh": 0.5, "de_dia": 0.35, "de_the": 0.4 } },
  "relations": [
    { "type": "lục hợp", "between": ["Thìn(giờ)", "Dậu(ngày)"], "result": "hóa Kim" },
    { "type": "xung",    "between": ["Tý(tháng)", "Ngọ(năm)"] }
  ],
  "shen_sha": [ { "name": "Thiên Ất quý nhân", "position": "chi năm" } ],
  "da_yun": {
    "direction": "nghịch", "start_age": 4, "start_year": 1994,
    "list": [ { "index": 0, "gan_zhi": "Đinh Hợi", "from_age": 4, "to_age": 13,
                "shi_shen": "Thực Thần", "from_year": 1994, "to_year": 2003 } ]
  },
  "liu_nian_current": { "year": 2026, "gan_zhi": "Bính Ngọ", "shi_shen": "Thương Quan" }
}
```

**Hàm hash (lib/bazi/hash.ts):**
`sha256( [8 chữ can chi] + gender + da_yun.start_age + da_yun.direction + engine_version )`

---

## PHẦN 6 — TẦNG AI LUẬN GIẢI: CHAIN 5 BƯỚC

Mỗi bước = 1 API call riêng đến Anthropic API, output JSON, làm input bước sau. File: `lib/ai/chain.ts`, prompts trong `lib/ai/prompts/step{1-5}.ts` (template — phần kiến thức nạp động từ bảng `knowledge_modules`).

**Quy tắc chung ghi trong MỌI system prompt:**
```
- Bạn CHỈ được sử dụng dữ kiện có trong JSON lá số được cung cấp.
- TUYỆT ĐỐI KHÔNG tự tính toán, suy luận thêm bất kỳ can chi, thập thần, tổ hợp nào.
- Nếu JSON không chứa thông tin cần thiết, ghi rõ "không đủ dữ kiện" thay vì suy đoán.
- Mỗi nhận định phải dẫn chiếu field JSON làm căn cứ (trong trường "evidence").
- Không phán đoán tuyệt đối về sinh tử, bệnh tật, tai nạn. Dùng ngôn ngữ xu hướng.
```

| Bước | Nhiệm vụ | Input | Output JSON | Temperature |
|---|---|---|---|---|
| 1 | Xác nhận cường nhược + nhận diện cách cục | chart_json + KB step 1 | { strength_conclusion, geju, reasoning, evidence[] } | 0.2 |
| 2 | Chọn dụng thần / hỷ thần / kỵ thần | chart_json + output B1 + KB step 2 | { yong_shen, xi_shen, ji_shen, method: "phù ức/điều hậu/thông quan", reasoning, evidence[] } | 0.2 |
| 3 | Luận 5 lĩnh vực: tính cách, sự nghiệp, tài lộc, hôn nhân, sức khỏe | chart_json + output B1+B2 + KB step 3 | { sections: [{topic, content_md, evidence[]}] } — STREAM về client | 0.7 |
| 4 | Luận đại vận 10 vận + lưu niên 3 năm tới | chart_json + output B2 + KB step 4 | { da_yun_analysis[], liu_nian_analysis[] } — STREAM | 0.7 |
| 5 | Verification: đối chiếu bài luận với JSON + checklist mâu thuẫn | toàn bộ output B1-B4 + chart_json | { passed: bool, issues: [{location, problem, severity}] } | 0 |

Nếu bước 5 trả `passed=false` với severity cao → tự động chạy lại bước lỗi 1 lần (max retry = 1), đính kèm issues vào prompt. Vẫn fail → lưu kèm cờ `needs_review`, hiện bài luận kèm ghi chú thận trọng.

**Checklist bước 5 (nhúng trong prompt):**
1. Dụng thần trong bước 3, 4 có khớp kết luận bước 2 không?
2. Có can chi / thập thần nào được nhắc mà KHÔNG tồn tại trong JSON không?
3. Có cặp nhận định mâu thuẫn giữa các mục không?
4. Có câu phán tuyệt đối về sinh tử / bệnh tật không?

**Few-shot:** mỗi bước nạp 2-3 ví dụ active từ bảng `few_shot_examples` (ưu tiên mệnh án soạn từ Trích Thiên Tủy).

---

## PHẦN 7 — API ROUTES & CẤU TRÚC THƯ MỤC

```
app/
├── api/
│   ├── chart/route.ts          POST: input → normalize → engine → lưu charts → trả {chart_id, chart_json, cache_status}
│   ├── interpret/route.ts      POST {chart_id}: check cache → chạy chain → stream (Vercel AI SDK) → lưu interpretations
│   ├── interpret/annual/route.ts  POST {chart_id, year}: luận lưu niên theo năm
│   └── admin/... (CRUD knowledge_modules, few_shot, settings, eval-run)
├── (public)/  ... các trang theo sitemap
lib/
├── time/normalize.ts           múi giờ lịch sử + giờ mặt trời + detect giao tiết
├── bazi/engine.ts | relations.ts | shensha.ts | strength.ts | hash.ts | types.ts
├── ai/chain.ts | prompts/step1-5.ts | client.ts (Anthropic SDK)
└── supabase/ (client, server, service-role)
data/  vn-timezone-history.json | vn-provinces.json | shensha-rules.json | strength-weights.json
supabase/migrations/  001_init.sql ...
tests/
├── engine.test.ts              chạy toàn bộ eval_cases đối chiếu expected_chart
└── shensha.test.ts | normalize.test.ts
```

**Env vars (.env.example):** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `NEXT_PUBLIC_BRAND_NAME`.

**Deploy:** GitHub repo → import vào Vercel → set env vars → branch main auto-deploy production, PR tạo preview. Route /api/interpret set `maxDuration = 120` (Vercel function config) vì chain 5 bước.

---

## PHẦN 8 — GIAO DIỆN TRANG KẾT QUẢ /la-so/[id] (mô tả cho AI code)

1. **Header lá số:** thông tin sinh đã chuẩn hóa + badge cảnh báo nếu near_jieqi_warning ("Lá số nhạy cảm với sai số giờ sinh — sinh gần thời điểm giao tiết khí").
2. **Bảng tứ trụ:** 4 cột (Năm-Tháng-Ngày-Giờ) × các hàng: Can (màu theo ngũ hành: Mộc xanh lá, Hỏa đỏ, Thổ nâu vàng, Kim xám trắng, Thủy xanh dương) / Chi / Tàng can / Thập thần / Nạp âm / Thần sát. Nhật chủ highlight.
3. **Biểu đồ ngũ hành:** radar hoặc bar 5 hành + label cường nhược.
4. **Dòng thời gian đại vận:** horizontal scroll 10 vận, vận hiện tại highlight, click vận → cuộn đến phần luận vận đó.
5. **Bài luận:** accordion 5 mục (tính cách / sự nghiệp / tài lộc / hôn nhân / sức khỏe) + phần đại vận. Stream hiển thị dần khi AI đang viết (skeleton + typewriter).
6. **Footer:** disclaimer (từ settings) + nút feedback 1-5 sao + nút chia sẻ link.
7. Mobile-first; bảng tứ trụ mobile chuyển thành 4 card cuộn ngang.

---

## PHẦN 9 — LỘ TRÌNH TRIỂN KHAI & PROMPT MẪU

### Lộ trình 4 giai đoạn
| Giai đoạn | Phạm vi | Định nghĩa hoàn thành |
|---|---|---|
| 1. Engine (tuần 1) | lib/time + lib/bazi + data/ + tests | 100% eval_cases khớp tứ trụ + khởi vận; test giờ Tý muộn, ngày Lập Xuân, múi giờ 1965 miền Nam PASS |
| 2. Chain AI (tuần 2) | lib/ai + seed knowledge_modules + few_shot | Chạy trọn chain 5 bước cho 5 lá số mẫu, bước 5 passed |
| 3. Web (tuần 3) | Form nhập + trang kết quả + auth + cache | E2E: nhập → lá số → bài luận stream → reload lấy từ cache |
| 4. Admin + Eval (tuần 4) | Admin panel + eval runner + feedback | Sửa KB qua admin không cần deploy; chạy regression 1 nút |

### PROMPT CHÍNH (dán toàn bộ file này vào Antigravity kèm đoạn sau)

```
Hãy xây dựng hệ thống web lập và luận giải lá số bát tự theo ĐÚNG bản đặc tả trên.

Stack: Next.js 14 App Router + TypeScript + Tailwind CSS + shadcn/ui + Supabase + Vercel.
Engine: npm package lunar-typescript — KHÔNG tự viết thuật toán lịch.

Nguyên tắc tối thượng: CODE TÍNH — AI VIẾT. Không có bất kỳ phép tính can chi nào trong prompt AI.

Thứ tự thực hiện:
1. Khởi tạo repo: cấu trúc thư mục Phần 7, migration SQL Phần 3, .env.example
2. Tạo 4 file data/ theo đúng Phần 4 nhóm B (nhúng dữ liệu mẫu đã cho, TODO cho phần cần bổ sung)
3. Code lib/time/normalize.ts + unit tests (các ca: giờ Tý muộn, miền Nam 1965, giao tiết khí)
4. Code lib/bazi/* trả về đúng JSON schema Phần 5 + tests đối chiếu 5 case mẫu
5. Code lib/ai/chain.ts với 5 prompt template Phần 6, nạp KB từ Supabase
6. Code API routes + trang /lap-la-so và /la-so/[id] theo Phần 8
7. Admin panel + eval runner

Sau mỗi bước, chạy test rồi mới sang bước tiếp. Hỏi tôi khi đặc tả chưa đủ rõ thay vì tự giả định.
```

### VIỆC CỦA BẠN (không phải của AI code) — checklist chuẩn bị nội dung
- [ ] Soạn 8 module knowledge base (Phần 4-B5) từ 3 sách nền — đây là việc tốn thời gian nhất và giá trị nhất
- [ ] Soạn 10-15 few-shot examples (mệnh án + lời luận chuẩn)
- [ ] Lập 20-30 eval_cases: lấy lá số từ phần mềm/chuyên gia uy tín làm expected_chart
- [ ] Kiểm chứng bảng múi giờ lịch sử B1 với nguồn IANA
- [ ] Viết disclaimer pháp lý + chính sách bảo mật dữ liệu ngày sinh (dữ liệu cá nhân nhạy cảm)

---

## PHẦN 10 — MÔ HÌNH FREEMIUM (BỔ SUNG/SỬA ĐỔI CÁC PHẦN TRƯỚC)

### Trải nghiệm người dùng theo 3 trạng thái của trang /la-so/[id]

**Trạng thái 1 — Lá số (FREE, tức thì, không AI):**
Nhập thông tin → hiển thị ngay toàn bộ lá số trực quan (bảng tứ trụ, ngũ hành, timeline đại vận theo Phần 8). Đây là "mồi câu" — miễn phí vĩnh viễn vì chi phí = 0. Cuối trang: nút lớn **"Xem luận giải"**.

**Trạng thái 2 — Tổng quan (FREE, 1 call AI nhỏ):**
Bấm "Xem luận giải" → chạy chain bước 1 + 2 (định cường nhược + dụng thần — vốn là JSON ngắn, rẻ) + 1 call mini sinh **đoạn tổng quan 6-8 dòng**: nhật chủ là gì, mệnh vượng hay nhược, dụng thần hành gì, 2-3 câu chấm phá về tính cách và giai đoạn vận hiện tại. Kết thúc bằng câu dẫn tự nhiên sang bản đầy đủ. Cache theo chart_hash như thiết kế cũ — mỗi lá số chỉ tốn tiền 1 lần cho cả free lẫn paid.
Bên dưới đoạn tổng quan: **paywall card** liệt kê nội dung bản đầy đủ (5 lĩnh vực chi tiết + 10 đại vận + lưu niên 3 năm + file PDF) + giá + nút "Mở khóa".

**Trạng thái 3 — Đầy đủ (PAID):**
Sau khi thanh toán xác nhận → chạy tiếp chain bước 3, 4, 5 (stream) → hiển thị giao diện đầy đủ theo Phần 8 + nút **"Tải PDF"**. Quyền xem gắn với lá số (mua 1 lần xem vĩnh viễn lá số đó), yêu cầu đăng nhập trước khi thanh toán để không mất quyền khi đổi thiết bị.

### Thay đổi chain AI (sửa Phần 6)
- Thêm **bước 2.5 (FREE_SUMMARY):** input = chart_json + output bước 1, 2; output = { summary_md (6-8 dòng), teaser_points[] }; temperature 0.7; max_tokens thấp. Cache vào interpretations với step = 25.
- Bước 3, 4, 5 chỉ được kích hoạt khi tồn tại entitlement hợp lệ (kiểm tra server-side, KHÔNG tin client).

### Bảng bổ sung vào Phần 3

**Bảng `orders`**
| Trường | Kiểu | Mô tả |
|---|---|---|
| id | UUID PK | |
| order_code | Text UNIQUE | Mã ngắn in trong nội dung CK, vd "BT" + 6 ký tự A-Z0-9 (vd BT7K2M9X). KHÔNG dùng ký tự dễ nhầm (O/0, I/1) |
| user_id | UUID FK profiles NOT NULL | Bắt buộc đăng nhập trước khi tạo đơn |
| chart_id | UUID FK charts | Lá số được mở khóa |
| product_key | Text | "full_reading" (sau này thêm "annual_2027"...) |
| amount | Int | VND, snapshot từ settings tại thời điểm tạo đơn |
| status | Enum | pending / paid / expired / manual_review / refunded |
| qr_payload | Text | Chuỗi QR đã sinh (để render lại) |
| expires_at | Timestamptz | pending quá 24h → expired (cron/route check) |
| paid_at, created_at | Timestamptz | |

**Bảng `payment_transactions`** — log thô mọi webhook nhận được
| Trường | Kiểu | Mô tả |
|---|---|---|
| id | UUID PK | |
| gateway | Text | "sepay" / "payos" |
| gateway_txn_id | Text **UNIQUE** | ⚠️ Chống xử lý trùng: webhook có thể bắn lại nhiều lần, INSERT vi phạm unique → bỏ qua (idempotency) |
| raw_payload | JSONB | Lưu nguyên văn để đối soát |
| amount | Int | |
| description | Text | Nội dung CK ngân hàng trả về |
| matched_order_id | UUID FK orders, nullable | Null = chưa khớp được đơn nào |
| created_at | Timestamptz | |

**Bảng `entitlements`** — quyền truy cập
| Trường | Kiểu | Mô tả |
|---|---|---|
| user_id + chart_id + product_key | Composite UNIQUE | |
| order_id | UUID FK | |
| granted_at | Timestamptz | |

**Thêm key vào `settings`:** `price_full_reading` (vd 99000), `payment_gateway` ("sepay"), `bank_account_info` (JSONB: bank_code, account_number, account_name), `order_ttl_hours` (24), `transfer_prefix` ("BT").

**RLS:** orders/entitlements — user chỉ SELECT của mình; INSERT orders qua API route (service role); payment_transactions chỉ service role + admin.

---

## PHẦN 11 — LUỒNG THANH TOÁN CHUYỂN KHOẢN TỰ ĐỘNG

### Lựa chọn gateway
Dùng dịch vụ trung gian đọc biến động số dư + bắn webhook: **SePay** hoặc **payOS (Casso)**. Cả hai đều: sinh QR động chuẩn VietQR theo đơn hàng, phát hiện tiền vào tài khoản ngân hàng của bạn và gọi webhook về hệ thống trong ~15 giây, có xác thực chữ ký/API key. SePay có sandbox miễn phí để test toàn bộ quy trình. Code phải viết theo **adapter pattern** (`lib/payment/gateway.ts` interface + `sepay.ts`, `payos.ts` implementations) để đổi gateway không sửa business logic.

### API routes bổ sung (Phần 7)
```
app/api/
├── orders/route.ts            POST {chart_id}: auth check → tạo order pending + order_code
│                              → sinh QR động (số tiền + nội dung "BT7K2M9X") → trả {order_id, qr_image_url, bank_info, expires_at}
├── orders/[id]/status/route.ts GET: client polling trạng thái (kèm Supabase Realtime subscribe bảng orders làm kênh chính)
└── webhooks/payment/route.ts  POST: nhận webhook từ gateway
```

### Xử lý webhook — QUY TRÌNH BẮT BUỘC (route /api/webhooks/payment)
1. **Xác thực nguồn:** verify chữ ký HMAC / API key theo header của gateway. Sai → 401, không xử lý.
2. **Idempotency:** INSERT vào payment_transactions với gateway_txn_id UNIQUE. Trùng → trả 200, dừng (đã xử lý rồi).
3. **Khớp đơn:** parse order_code từ trường description bằng regex prefix "BT" (nội dung CK có thể bị ngân hàng chèn thêm text — regex tìm pattern BT[A-Z0-9]{6} ở bất kỳ vị trí nào).
4. **Đối chiếu:** tìm order status=pending, chưa hết hạn, amount ≤ số tiền nhận (khách chuyển dư vẫn chấp nhận, chuyển thiếu → manual_review).
5. **Cập nhật giao dịch (transaction SQL):** order → paid, ghi matched_order_id, tạo entitlement.
6. **Kích hoạt hậu thanh toán:** gọi nội bộ chạy chain bước 3-5 (fire-and-forget qua route riêng có maxDuration=120, hoặc trigger từ client khi thấy status=paid) + sinh PDF.
7. Không khớp được đơn nào → lưu transaction với matched_order_id=null, hiện ở /admin/thanh-toan để khớp tay.
8. Luôn trả 200 nhanh (< 5s) — mọi việc nặng đẩy sang bước 6, tránh gateway retry.

### UI trang thanh toán (modal hoặc /thanh-toan/[order_id])
- Hiển thị: QR động (ảnh) + thông tin CK dự phòng gõ tay (bank, STK, số tiền, nội dung BẮT BUỘC "BT7K2M9X" — nút copy từng trường) + đồng hồ đếm ngược hết hạn.
- Trạng thái chờ: subscribe Supabase Realtime bảng orders → khi status đổi sang paid, tự động chuyển sang trang lá số đầy đủ với animation "Thanh toán thành công". Fallback: polling 5s/lần.
- Trường hợp lỗi hiển thị: "Đã chuyển nhưng chưa xác nhận sau 2 phút" → nút "Tôi đã thanh toán" gửi ticket (đơn chuyển manual_review, admin xử lý).

### Admin bổ sung: /admin/thanh-toan
Danh sách orders (filter trạng thái) + danh sách payment_transactions chưa khớp + nút khớp tay (chọn transaction ↔ order) + nút cấp quyền thủ công (comp/refund).

---

## PHẦN 12 — XUẤT PDF BẢN LUẬN GIẢI ĐẦY ĐỦ

- **Công nghệ:** `@react-pdf/renderer` chạy trong API route Node.js (KHÔNG dùng Puppeteer trên Vercel — nặng và dễ vượt giới hạn serverless). Nhúng font **Be Vietnam Pro** (file .ttf đặt trong repo `assets/fonts/`) — bắt buộc để tiếng Việt không lỗi dấu.
- **Route:** `app/api/pdf/[chart_id]/route.ts` — kiểm tra entitlement → render PDF → upload Supabase Storage bucket `pdfs` (private) → trả **signed URL** hết hạn 1 giờ. Cache: đã có file + prompt_version không đổi → trả signed URL luôn, không render lại.
- **Nội dung PDF (theo thứ tự):** Trang bìa (brand + thông tin sinh đã chuẩn hóa + ngày lập) → Bảng tứ trụ (bảng màu theo ngũ hành) → Biểu đồ ngũ hành + kết luận cường nhược, dụng thần → 5 lĩnh vực luận giải → 10 đại vận + lưu niên 3 năm → Trang cuối: disclaimer + link xem online.
- **Bảo mật:** bucket private, không bao giờ public URL — PDF chứa dữ liệu ngày sinh là dữ liệu cá nhân nhạy cảm.

### Cập nhật lộ trình (Phần 9): thêm Giai đoạn 5 (tuần 5)
| Phạm vi | Định nghĩa hoàn thành |
|---|---|
| Freemium + thanh toán + PDF | E2E trên sandbox gateway: lập lá số → xem tổng quan free → tạo đơn → chuyển khoản test → webhook xác nhận < 30s → chain đầy đủ chạy → tải PDF mở đúng font tiếng Việt. Test webhook trùng lặp (bắn 2 lần cùng txn_id) không tạo 2 entitlement |

### Cập nhật checklist VIỆC CỦA BẠN
- [ ] Đăng ký tài khoản SePay hoặc payOS, liên kết tài khoản ngân hàng nhận tiền, lấy API key + webhook secret
- [ ] Quyết định giá bán full_reading (khuyến nghị test A/B 2 mức giá qua settings)
- [ ] Chuẩn bị nội dung paywall card (copy bán hàng) — sửa được qua settings
