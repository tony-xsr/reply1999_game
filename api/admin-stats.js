// Vercel Function — Admin Dashboard: thống kê TOÀN BỘ hệ thống (mọi gia
// đình), CHỈ cho đúng 1 tài khoản admin xem được (email cố định qua biến
// môi trường ADMIN_EMAIL) — không tin email do trình duyệt tự khai, mà hỏi
// THẲNG Supabase Auth bằng access token thật của người gọi.
//
// CHỈ chạy ở server (Vercel Function), KHÔNG BAO GIỜ đưa file này vào trình
// duyệt — dùng Supabase SERVICE ROLE KEY (bỏ qua Row Level Security, đọc
// được CHO MỌI gia đình) chứ không phải anon key — giống hệt mẫu đã dùng ở
// api/generate-daily-content.js. Cần chạy server/migrate-12-admin-stats.sql
// trước (thêm bảng ai_call_log + hàm admin_db_stats()).
//
// Cấu hình biến môi trường trên Vercel → Project Settings → Environment
// Variables (KHÔNG BAO GIỜ ghi vào file trong repo):
//   SUPABASE_URL               — đã có sẵn từ api/generate-daily-content.js
//   SUPABASE_SERVICE_ROLE_KEY  — đã có sẵn từ api/generate-daily-content.js
//   ADMIN_EMAIL                — MỚI: email tài khoản phụ huynh CỦA BẠN
//                                 (đúng email dùng đăng nhập Trang Phụ
//                                 Huynh) — chỉ email này xem được /admin/.

import { verifyAdminToken } from '../shared/admin-auth.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

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

/** Đếm số dòng 1 bảng bằng HEAD + Prefer:count=exact — không tải dữ liệu, rẻ. */
async function countTable(table, extraQuery = '') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=id${extraQuery}`, {
    method: 'HEAD',
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, Prefer: 'count=exact' },
  });
  const range = res.headers.get('content-range') || '';
  const total = range.split('/')[1];
  return total && total !== '*' ? Number(total) : 0;
}

export default async function handler(req, res) {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(500).json({ error: 'Thiếu biến môi trường SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY trên Vercel' });
  }
  if (!ADMIN_EMAIL) {
    return res.status(500).json({ error: 'Chưa cấu hình biến môi trường ADMIN_EMAIL trên Vercel — xem hướng dẫn đầu file api/admin-stats.js' });
  }

  let isAdmin = false;
  try {
    isAdmin = await verifyAdminToken(req, { supabaseUrl: SUPABASE_URL, serviceKey: SERVICE_KEY, adminEmail: ADMIN_EMAIL });
  } catch { isAdmin = false; }
  if (!isAdmin) return res.status(403).json({ error: 'Chỉ tài khoản admin mới xem được thống kê này.' });

  try {
    const since7d = new Date(Date.now() - 7 * 86400000).toISOString();
    const since5m = new Date(Date.now() - 5 * 60000).toISOString();
    const todayDate = new Date().toISOString().slice(0, 10);

    const pingStart = Date.now();
    const [families, profiles, sessionsWeek, sessionsToday, aiCallsWeek, onlineNow, dbStatsList] = await Promise.all([
      countTable('families'),
      countTable('profiles'),
      countTable('sessions', `&played_at=gte.${since7d}`),
      countTable('sessions', `&played_at=gte.${todayDate}`),
      sb(`ai_call_log?select=provider,ok,created_at&created_at=gte.${since7d}&order=created_at.asc&limit=5000`),
      countTable('devices', `&last_seen=gte.${since5m}`),
      sb('rpc/admin_db_stats', { method: 'POST', body: JSON.stringify({}) }),
    ]);
    const pingMs = Date.now() - pingStart;
    const dbStats = Array.isArray(dbStatsList) ? dbStatsList[0] : dbStatsList;

    // Gộp lượt gọi AI theo ngày + theo provider để vẽ chart phía client.
    const byDay = new Map();
    let aiOk = 0;
    let aiFail = 0;
    for (const c of aiCallsWeek || []) {
      const day = (c.created_at || '').slice(0, 10);
      const bucket = byDay.get(day) || { day, groq: 0, deepseek: 0, fail: 0 };
      if (c.ok) bucket[c.provider === 'deepseek' ? 'deepseek' : 'groq']++;
      else bucket.fail++;
      byDay.set(day, bucket);
      if (c.ok) aiOk++; else aiFail++;
    }

    return res.status(200).json({
      generatedAt: new Date().toISOString(),
      pingMs,
      families,
      profiles,
      sessionsWeek,
      sessionsToday,
      onlineNow,
      ai: { ok: aiOk, fail: aiFail, byDay: [...byDay.values()].sort((a, b) => a.day.localeCompare(b.day)) },
      db: dbStats,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
