// Cấu hình kết nối Supabase — xem hướng dẫn tạo project trong server/README.md.
// Khi 2 giá trị dưới còn rỗng: toàn bộ game chạy như cũ (lưu tạm trên máy),
// trang Phụ Huynh sẽ hiện hướng dẫn cài đặt thay vì form đăng nhập.
//
// LƯU Ý: chỉ dán "anon public key" (khóa công khai, an toàn khi nằm trong web).
// KHÔNG BAO GIỜ dán service_role key vào đây.
window.SERVER_CONFIG = {
  url: 'https://ggamsoybaylxglqiszlr.supabase.co',      // ví dụ: 'https://abcdefgh.supabase.co'
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnYW1zb3liYXlseGdscWlzemxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMzcxNjUsImV4cCI6MjA5OTgxMzE2NX0.8LDc1SG3-14PrjclYLHuIrOq1_CGU1875P2kEnF-IlY',  // ví dụ: 'eyJhbGciOiJIUzI1NiIs...'
};
