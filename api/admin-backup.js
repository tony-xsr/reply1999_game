// Vercel Function — Admin: sao lưu (GET) và khôi phục (POST) TOÀN BỘ dữ liệu
// server (mọi gia đình, mọi bảng) — chỉ tài khoản admin gọi được (xem
// shared/admin-auth.js + api/admin-stats.js cho cùng cơ chế xác thực).
//
// ⚠️ RẤT QUAN TRỌNG — KHÔI PHỤC (POST) LÀ THAO TÁC HUỶ DIỆT:
// nó XOÁ SẠCH toàn bộ dữ liệu HIỆN TẠI trên server rồi nạp lại ĐÚNG NHƯ
// trong file backup — bất kỳ dữ liệu nào được tạo SAU thời điểm backup mà
// không có trong file sẽ MẤT VĨNH VIỄN. Không có "hoàn tác" cho thao tác
// này. Dùng đúng lúc bạn thật sự muốn đưa cả hệ thống về đúng 1 thời điểm
// trong quá khứ (vd lỡ tay xoá nhầm dữ liệu quan trọng).
//
// CHỈ chạy ở server (Vercel Function), KHÔNG BAO GIỜ đưa file này vào trình
// duyệt — dùng SERVICE ROLE KEY (bỏ qua Row Level Security, đọc/ghi được
// CHO MỌI gia đình). Cần các biến môi trường trên Vercel giống hệt
// api/admin-stats.js: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL.
//
// Thứ tự bảng dưới đây tôn trọng khoá ngoại: cha trước, con sau khi NẠP LẠI
// (families -> profiles/settings/devices -> sessions/... -> translation_
// submissions/grammar_quiz_submissions). Bước XOÁ xoá `families` (mọi bảng
// có family_id đều `on delete cascade` theo đó — tự động xoá sạch mọi bảng
// con), CỘNG THÊM xoá riêng 3 bảng KHÔNG có family_id — passage_pool/
// quiz_pool (kho nội dung dùng CHUNG mọi gia đình) và system_settings (cờ
// bật/tắt cron) — vì chúng đứng độc lập, families cascade KHÔNG động tới.

import { verifyAdminToken } from '../shared/admin-auth.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// Thứ tự NẠP LẠI khi restore (cha trước, con sau).
const TABLE_ORDER = [
  'families', 'profiles', 'settings', 'devices',
  'sessions', 'miss_events', 'grammar_miss_events', 'reward_ledger', 'purchases', 'manual_rewards', 'kid_logins',
  'translation_passages', 'grammar_quizzes', 'ai_call_log',
  'translation_submissions', 'grammar_quiz_submissions',
  // 3 bảng KHÔNG có family_id (dùng CHUNG cho mọi gia đình / toàn hệ thống,
  // xem migrate-18-content-pool.sql + migrate-17-cron-toggle.sql) — KHÔNG bị
  // xoá tự động bởi cascade khi xoá `families` lúc restore, nên phải tự xoá
  // riêng trong restoreAll() bên dưới trước khi nạp lại.
  'passage_pool', 'quiz_pool', 'system_settings',
];

// 3 bảng đứng độc lập ở trên — restoreAll() phải XOÁ RIÊNG các bảng này
// (không nằm trong cascade của `families`) trước khi nạp lại dữ liệu.
const STANDALONE_TABLES = ['passage_pool', 'quiz_pool', 'system_settings'];

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
  if (!res.ok && res.status !== 206) {
    const text = await res.text().catch(() => '');
    throw new Error(`Supabase ${path.split('?')[0]} ${res.status}: ${text.slice(0, 200)}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// settings dùng family_id làm khoá chính (không có cột id) — mọi bảng khác
// đều có id. Phải ORDER theo 1 cột ổn định khi phân trang Range, nếu không
// Postgres không đảm bảo thứ tự giống nhau giữa các trang -> có thể sót/lặp
// dòng, làm backup THIẾU DỮ LIỆU mà không hề báo lỗi.
const ORDER_COLUMN = { settings: 'family_id', system_settings: 'key' };

/** Tải TOÀN BỘ dòng của 1 bảng bằng cách phân trang Range — không giới hạn
 * ngầm ở 1000 dòng như mặc định PostgREST (bản backup phải đủ TẤT CẢ). */
async function fetchAllRows(table) {
  const pageSize = 1000;
  const orderCol = ORDER_COLUMN[table] || 'id';
  let offset = 0;
  let all = [];
  for (;;) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&order=${orderCol}.asc`, {
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        Range: `${offset}-${offset + pageSize - 1}`,
        Prefer: 'count=exact',
      },
    });
    if (!res.ok && res.status !== 206) {
      const text = await res.text().catch(() => '');
      throw new Error(`Supabase ${table} ${res.status}: ${text.slice(0, 200)}`);
    }
    const rows = await res.json();
    all = all.concat(rows);
    const range = res.headers.get('content-range') || '';
    const total = Number(range.split('/')[1]);
    offset += pageSize;
    if (!rows.length || (Number.isFinite(total) && all.length >= total)) break;
  }
  return all;
}

function validateBackupShape(body) {
  if (!body || typeof body !== 'object' || !body.tables || typeof body.tables !== 'object') {
    throw new Error('File backup không đúng định dạng (thiếu "tables").');
  }
  for (const t of TABLE_ORDER) {
    if (!Array.isArray(body.tables[t])) {
      throw new Error(`File backup thiếu hoặc sai định dạng bảng "${t}" — có thể file bị hỏng hoặc không phải backup của hệ thống này.`);
    }
  }
}

async function insertRows(table, rows) {
  const CHUNK = 500;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    if (!chunk.length) continue;
    await sb(table, { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(chunk) });
  }
}

/** XOÁ SẠCH (families cascade xoá hết bảng con, + xoá riêng 3 bảng đứng độc
 * lập không có family_id) rồi NẠP LẠI đúng thứ tự khoá ngoại. */
async function restoreAll(tables) {
  await sb('families?id=not.is.null', { method: 'DELETE' });
  for (const t of STANDALONE_TABLES) {
    const col = ORDER_COLUMN[t] || 'id';
    // eslint-disable-next-line no-await-in-loop
    await sb(`${t}?${col}=not.is.null`, { method: 'DELETE' });
  }
  const counts = {};
  for (const t of TABLE_ORDER) {
    const rows = tables[t] || [];
    await insertRows(t, rows);
    counts[t] = rows.length;
  }
  return counts;
}

export default async function handler(req, res) {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(500).json({ error: 'Thiếu biến môi trường SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY trên Vercel' });
  }
  if (!ADMIN_EMAIL) {
    return res.status(500).json({ error: 'Chưa cấu hình biến môi trường ADMIN_EMAIL trên Vercel — xem hướng dẫn trong api/admin-stats.js' });
  }

  let isAdmin = false;
  try {
    isAdmin = await verifyAdminToken(req, { supabaseUrl: SUPABASE_URL, serviceKey: SERVICE_KEY, adminEmail: ADMIN_EMAIL });
  } catch { isAdmin = false; }
  if (!isAdmin) return res.status(403).json({ error: 'Chỉ tài khoản admin mới dùng được sao lưu/khôi phục.' });

  if (req.method === 'GET') {
    try {
      const tables = {};
      for (const t of TABLE_ORDER) tables[t] = await fetchAllRows(t);
      return res.status(200).json({ exportedAt: new Date().toISOString(), tables });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Nội dung gửi lên không phải JSON hợp lệ.' }); }
    }
    try {
      validateBackupShape(body);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      const counts = await restoreAll(body.tables);
      return res.status(200).json({ restoredAt: new Date().toISOString(), counts });
    } catch (e) {
      return res.status(500).json({
        error: `Khôi phục LỖI GIỮA CHỪNG (${e.message}) — dữ liệu trên server có thể đang THIẾU. `
          + 'Hãy thử bấm Khôi Phục LẠI NGAY bằng đúng file backup này để nạp lại đầy đủ.',
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
