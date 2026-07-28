// Vercel Function — Admin bật/tắt cron sinh bài AI mỗi ngày
// (api/generate-daily-content.js) mà không cần vào tận Vercel Dashboard xoá
// lịch cron. Vercel Cron VẪN gọi route đó đúng giờ mỗi ngày như cũ — route đó
// tự đọc cờ này (bảng system_settings, xem migrate-17-cron-toggle.sql) và
// thoát ngay nếu đang TẮT, không sinh gì/không tốn quota AI.
//
// CHỈ chạy ở server (Vercel Function), dùng SERVICE ROLE KEY — giống hệt mẫu
// api/admin-stats.js. Cần chạy server/migrate-17-cron-toggle.sql trước.

import { verifyAdminToken } from '../shared/admin-auth.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const SETTING_KEY = 'cron_generate_daily_content_enabled';

async function sb(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Supabase ${res.status}: ${text.slice(0, 200)}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export default async function handler(req, res) {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(500).json({ error: 'Thiếu biến môi trường SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY trên Vercel' });
  }
  if (!ADMIN_EMAIL) {
    return res.status(500).json({ error: 'Chưa cấu hình biến môi trường ADMIN_EMAIL trên Vercel' });
  }

  let isAdmin = false;
  try {
    isAdmin = await verifyAdminToken(req, { supabaseUrl: SUPABASE_URL, serviceKey: SERVICE_KEY, adminEmail: ADMIN_EMAIL });
  } catch { isAdmin = false; }
  if (!isAdmin) return res.status(403).json({ error: 'Chỉ tài khoản admin mới thao tác được mục này.' });

  try {
    if (req.method === 'GET') {
      const rows = await sb(`system_settings?select=value,updated_at&key=eq.${SETTING_KEY}`);
      const enabled = rows?.[0] ? rows[0].value !== false : true; // chưa chạy migrate-17 -> coi như đang BẬT (giữ hành vi cũ)
      return res.status(200).json({ enabled, updatedAt: rows?.[0]?.updated_at || null });
    }
    if (req.method === 'POST') {
      const enabled = !!req.body?.enabled;
      await sb('system_settings', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify({ key: SETTING_KEY, value: enabled, updated_at: new Date().toISOString() }),
      });
      return res.status(200).json({ enabled });
    }
    return res.status(405).json({ error: 'Method không hỗ trợ' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
