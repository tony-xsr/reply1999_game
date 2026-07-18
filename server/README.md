# Hướng dẫn dựng server (Supabase) — 10 phút, làm 1 lần

Hệ thống Quản lý bé + Thưởng + Trang Phụ Huynh lưu dữ liệu trên Supabase
(Postgres + Auth). Trang web gọi thẳng API của Supabase — KHÔNG cần server
riêng, không cần build.

> ⚠️ KHÔNG ghi mật khẩu database vào bất kỳ file nào trong repo — mật khẩu đó
> chỉ dùng khi kết nối Postgres trực tiếp, ứng dụng này không cần đến. Nếu lỡ
> ghi/commit, hãy đổi mật khẩu trong Supabase → Project Settings → Database.
lythong12A@
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

## Lưu ý vận hành
- **Free tier tự tạm dừng** project sau ~1 tuần không truy cập — vào dashboard
  bấm Restore là chạy lại (dữ liệu còn nguyên). Dùng lâu dài nên cân nhắc gói Pro.
- **Mất mạng**: game vẫn mở được (file tĩnh đã cache) nhưng điểm/sao/sổ từ yếu
  của ván đó KHÔNG được lưu — đây là hệ quả đã chốt khi chọn kiến trúc server thuần.
- **Backup**: Supabase Dashboard → Database → Backups (bản trả phí), hoặc nút
  "Xuất JSON" trong Trang Phụ Huynh.
- **Xóa toàn bộ dữ liệu**: nút trong Trang Phụ Huynh (gọi hàm `delete_my_family()`).
