// Xác thực "đúng là admin" — dùng CHUNG cho mọi Vercel Function trong /api/
// cần quyền admin (admin-stats.js, admin-backup.js). Hỏi THẲNG Supabase Auth
// bằng access token THẬT của người gọi, KHÔNG bao giờ tin email do client tự
// gửi kèm request — nếu tin, ai đó chỉ cần sửa request là giả làm admin được.
//
// CHỈ import từ code chạy trên SERVER (file trong /api/) — không phải file
// dành cho trình duyệt.

/**
 * @param {Request} req Vercel Function request (đọc req.headers.authorization)
 * @param {{supabaseUrl:string, serviceKey:string, adminEmail:string}} cfg
 * @returns {Promise<boolean>}
 */
export async function verifyAdminToken(req, { supabaseUrl, serviceKey, adminEmail }) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token || !adminEmail) return false;
  const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return false;
  const user = await res.json();
  return !!user?.email && user.email.toLowerCase() === adminEmail.toLowerCase();
}
