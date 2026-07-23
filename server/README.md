# Hướng dẫn dựng server (Supabase) — 10 phút, làm 1 lần

Hệ thống Quản lý bé + Thưởng + Trang Phụ Huynh lưu dữ liệu trên Supabase
(Postgres + Auth). Trang web gọi thẳng API của Supabase — KHÔNG cần server
riêng, không cần build.

> ⚠️ KHÔNG ghi mật khẩu database vào bất kỳ file nào trong repo — mật khẩu đó
> chỉ dùng khi kết nối Postgres trực tiếp, ứng dụng này không cần đến. Nếu lỡ
> ghi/commit, hãy đổi mật khẩu trong Supabase → Project Settings → Database.
...12A@
## Bước 1 — Tạo project
1. Vào https://supabase.com → đăng ký/đăng nhập (miễn phí).
2. **New project** → đặt tên (ví dụ `reply1999-games`), chọn region `Southeast Asia (Singapore)`, đặt mật khẩu database (giữ kỹ) → **Create**.
3. Chờ ~2 phút cho project khởi tạo.

## Bước 2 — Dán schema
1. Menu trái → **SQL Editor** → **New query**.
2. Mở file [`schema.sql`](schema.sql) trong thư mục này, copy TOÀN BỘ, dán vào, bấm **Run**.
3. Thấy `Success. No rows returned` là xong (chạy lại lần 2 cũng không sao).

## Bước 3 — Lấy khóa và điền config
1. Menu trái → **Project Settings → API**.
2. Copy 2 giá trị: **Project URL** (dạng `https://xxxx.supabase.co`) và **anon public key** (chuỗi dài `eyJ...`).

3. Mở file [`/server-config.js`](../server-config.js) ở gốc repo, điền 2 giá trị đó vào.

> Anon key là khóa CÔNG KHAI (nằm trong trang web là bình thường) — dữ liệu
> được bảo vệ bằng Row Level Security trong schema, không phải bằng việc giấu
> key. TUYỆT ĐỐI không dán `service_role key` vào bất kỳ file nào của repo.

## Bước 4 — Tạo tài khoản phụ huynh
1. (Khuyến nghị) Supabase → **Authentication → Providers → Email**: tắt
   "Confirm email" nếu muốn đăng ký xong dùng ngay không cần bấm link xác nhận.
2. Mở trang web → **Trang Phụ Huynh** (`/phu-huynh/`) → Đăng ký bằng email +
   mật khẩu → tạo hồ sơ cho từng bé.

## Bước 5 — (Tuỳ chọn) Bật tự động DỒN TRƯỚC 60 ngày Luyện Dịch + Trắc Nghiệm Ngữ Pháp

Mặc định, bài Luyện Dịch/Trắc Nghiệm Ngữ Pháp được sinh "khi cần" theo 2 lớp:
(1) mỗi khi bé/phụ huynh vào BẤT KỲ trang nào của site, tự âm thầm kiểm tra +
sinh sẵn bài của HÔM NAY và NGÀY MAI trong nền (không hiện gì); (2) nếu cả 2
lớp đó đều lỡ, bé tự mở mục đó vẫn tự sinh (có hiện "AI đang soạn..."). Nếu
muốn bài có sẵn TỪ TRƯỚC XA HƠN (tới 60 ngày, không chỉ 1-2 ngày) và cho MỌI
gia đình cùng lúc mà không cần đợi ai vào site trước, bật thêm **Vercel Cron**
chạy 1 lần/đêm (`api/generate-daily-content.js`, xem `vercel.json` mục
`crons`) — cron này DỒN TRƯỚC (không chỉ sinh đúng 1 ngày) tới 60 ngày kể từ
hôm đó cho mỗi bé, mỗi đêm chỉ sinh thêm tối đa 5 ngày mới/loại nội dung (để
không vượt giới hạn tốc độ Groq) — bé mới cấu hình sẽ mất khoảng 12 đêm để
"cửa sổ" đầy đủ 60 ngày, sau đó mỗi đêm chỉ cần sinh đúng 1 ngày mới để giữ
cửa sổ luôn đầy.

> ⚠️ Bước này cần **service_role key** — khoá CÓ TOÀN QUYỀN đọc/ghi, bỏ qua
> mọi Row Level Security. Chỉ dán vào **Vercel Environment Variables**
> (server-side, không lộ ra trình duyệt) — TUYỆT ĐỐI không dán vào bất kỳ
> file nào trong repo, không dán vào `/server-config.js`.

1. Supabase → **Project Settings → API** → copy **service_role key** (KHÁC
   anon key đã dùng ở Bước 3 — cẩn thận đừng lấy nhầm 2 khoá).
2. Vercel Dashboard → project này → **Settings → Environment Variables** →
   thêm 3 biến (áp dụng cho môi trường Production, và Preview nếu cần test):
   - `SUPABASE_URL` = giống Project URL đã điền ở Bước 3.
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role key vừa copy.
   - `CRON_SECRET` = 1 chuỗi bất kỳ do bạn tự nghĩ ra (vd chạy
     `openssl rand -hex 24` hoặc bất kỳ chuỗi dài ngẫu nhiên nào) — Vercel tự
     động gửi kèm khi gọi cron, dùng để chặn người lạ gọi thẳng route này gây
     tốn quota AI của bạn.
3. Deploy lại (hoặc Redeploy) để Vercel áp dụng cron + biến môi trường mới.
4. Kiểm tra: Vercel Dashboard → project → tab **Cron Jobs** — xem lịch sử
   chạy + log (mỗi lần chạy trả về số bài đã sinh/bỏ qua/lỗi cho từng bé).

Lịch mặc định `0 17 * * *` (UTC) = **0h hằng đêm giờ Việt Nam** — sửa trong
`vercel.json` nếu muốn giờ khác. Gói Vercel **Hobby (miễn phí)** giới hạn cron
chạy tối đa 1 lần/ngày — đúng nhu cầu ở đây nên không cần nâng cấp gói.

> Cơ chế "sinh khi cần" cũ **vẫn còn nguyên**, không bị thay thế — nếu cron
> lỡ chạy trễ/lỗi 1 ngày nào đó, bé mở mục Luyện Dịch/Trắc Nghiệm vẫn tự sinh
> bài như trước, không bị đứng game.

## Lưu ý vận hành
- **Free tier tự tạm dừng** project sau ~1 tuần không truy cập — vào dashboard
  bấm Restore là chạy lại (dữ liệu còn nguyên). Dùng lâu dài nên cân nhắc gói Pro.
- **Mất mạng**: game vẫn mở được (file tĩnh đã cache) nhưng điểm/sao/sổ từ yếu
  của ván đó KHÔNG được lưu — đây là hệ quả đã chốt khi chọn kiến trúc server thuần.
- **Backup**: Supabase Dashboard → Database → Backups (bản trả phí), hoặc nút
  "Xuất JSON" trong Trang Phụ Huynh.
- **Xóa toàn bộ dữ liệu**: nút trong Trang Phụ Huynh (gọi hàm `delete_my_family()`).
