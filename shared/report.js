// Báo cáo tuần của bé — hàm THUẦN (không mạng/DOM, test độc lập): nhận dữ liệu
// thô đã tải từ server (sessions, sổ sao, quà, từ yếu) và trả về bản tổng kết
// 7 ngày + bản văn bản tiếng Việt để bố mẹ sao chép gửi Zalo/tin nhắn.

/** Mốc đầu tuần: 00:00 của (hôm nay - 6 ngày) theo giờ máy. */
export function weekStart(now = new Date()) {
  const d = new Date(now.getTime() - 6 * 86400000);
  d.setHours(0, 0, 0, 0);
  return d;
}

const inWeek = (iso, start) => iso && new Date(iso) >= start;

/**
 * Tổng kết 7 ngày gần nhất.
 * @param {{sessions:object[], ledger:object[], purchases:object[], weakWords:object[]}} data
 *   sessions: [{played_at, seconds, result, score}], ledger: [{ts, delta}],
 *   purchases: [{ts, item_id, cost}], weakWords: [{word, misses}] (hiện tại).
 * @returns bản tổng kết số liệu tuần
 */
export function buildWeeklyReport(data, now = new Date()) {
  const start = weekStart(now);
  const sessions = (data.sessions || []).filter((s) => inWeek(s.played_at, start));
  const earned = (data.ledger || [])
    .filter((r) => r.delta > 0 && inWeek(r.ts, start))
    .reduce((sum, r) => sum + r.delta, 0);
  const bought = (data.purchases || []).filter((p) => p.cost > 0 && inWeek(p.ts, start)).length;
  const freeGifts = (data.purchases || []).filter((p) => p.cost === 0 && inWeek(p.ts, start)).length;

  const wins = sessions.filter((s) => s.result === 'win').length;
  const decided = sessions.filter((s) => s.result === 'win' || s.result === 'loss').length;
  const minutes = Math.round(sessions.reduce((sum, s) => sum + (s.seconds || 0), 0) / 60);

  // Số NGÀY có học trong tuần (chuỗi chăm chỉ).
  const days = new Set(sessions.map((s) => (s.played_at || '').slice(0, 10)));

  const topWeak = (data.weakWords || []).slice(0, 5).map((w) => w.word);

  return {
    minutes,
    games: sessions.length,
    wins,
    winRate: decided ? wins / decided : null,
    activeDays: days.size,
    starsEarned: earned,
    giftsBought: bought,
    freeGifts,
    weakCount: (data.weakWords || []).length,
    topWeak,
  };
}

/* ===== Phân tích cho biểu đồ (hàm thuần) ===== */

/** Nhóm mode game thành 3 nhóm thân thiện để vẽ biểu đồ "bé chơi gì nhiều". */
export function groupOfMode(mode = '') {
  const m = String(mode).toLowerCase();
  if (m.startsWith('nghedoan') || m.startsWith('xepchu') || m.includes('tienganh') || m === 'ontap') return 'Tiếng Anh';
  if (/^(toan|van|hocvan|hocvui|tuduy|khoahoc|kynang|vanhoa|dientu|tomau|tapviet)/.test(m)) return 'Học & tư duy';
  return 'Game vui';
}

/** Phút chơi theo nhóm game (cho biểu đồ tròn). @returns [{group, minutes}] giảm dần */
export function minutesByGroup(sessions) {
  const map = new Map();
  for (const s of sessions || []) {
    const g = groupOfMode(s.mode);
    map.set(g, (map.get(g) || 0) + (s.seconds || 0));
  }
  return [...map.entries()]
    .map(([group, sec]) => ({ group, minutes: Math.round(sec / 60) }))
    .filter((x) => x.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes);
}

/** Phút chơi theo khung giờ trong ngày (bé hay chơi lúc nào). */
export function minutesByTimeOfDay(sessions) {
  const buckets = [
    { label: '🌅 Sáng', from: 5, to: 11, minutes: 0 },
    { label: '☀️ Trưa', from: 11, to: 14, minutes: 0 },
    { label: '🌤 Chiều', from: 14, to: 18, minutes: 0 },
    { label: '🌙 Tối', from: 18, to: 22, minutes: 0 },
    { label: '😴 Khuya', from: 22, to: 5, minutes: 0 },
  ];
  for (const s of sessions || []) {
    if (!s.played_at) continue;
    const h = new Date(s.played_at).getHours();
    const b = buckets.find((x) => (x.from < x.to ? h >= x.from && h < x.to : h >= x.from || h < x.to));
    if (b) b.minutes += (s.seconds || 0) / 60;
  }
  return buckets.map((b) => ({ label: b.label, minutes: Math.round(b.minutes) }));
}

/** Phút chơi từng ngày trong N ngày gần nhất (cũ → mới) cho biểu đồ cột. */
export function dailyMinutes(sessions, days = 14, now = new Date()) {
  const byDate = new Map();
  for (const s of sessions || []) {
    const key = (s.played_at || '').slice(0, 10);
    byDate.set(key, (byDate.get(key) || 0) + (s.seconds || 0));
  }
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const p = (n) => String(n).padStart(2, '0');
    const key = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
    out.push({ date: key, minutes: Math.round((byDate.get(key) || 0) / 60) });
  }
  return out;
}

/** Tỷ lệ thắng theo TUẦN trong 4 tuần gần nhất (cũ → mới) — thấy tiến bộ. */
export function weeklyWinRate(sessions, weeks = 4, now = new Date()) {
  const out = [];
  for (let w = weeks - 1; w >= 0; w--) {
    const end = now.getTime() - w * 7 * 86400000;
    const start = end - 7 * 86400000;
    let wins = 0;
    let decided = 0;
    for (const s of sessions || []) {
      const t = s.played_at ? new Date(s.played_at).getTime() : 0;
      if (t <= start || t > end) continue;
      if (s.result === 'win') { wins++; decided++; }
      else if (s.result === 'loss') decided++;
    }
    out.push({ label: w === 0 ? 'Tuần này' : `${w} tuần trước`, rate: decided ? wins / decided : null });
  }
  return out;
}

// Tất cả session của khu "Thi Chứng Chỉ Anh" đều có mode bắt đầu bằng
// "exam-<levelId>-..." (exam-prep + 4 mục luyen-thi-ket/pet/toefl-junior/
// toeic, cùng dùng chung engine shared/../exam-prep/src/examprep.js) hoặc
// "nguphap-<trò>" (nguphap-truc-quan/). unitId của mỗi câu hỏi LUÔN được đặt
// tên bắt đầu bằng chính levelId (vd "movers-possessives-imperatives"), nên
// không thể tách level bằng cách chẻ theo dấu "-" đơn giản — phải so khớp
// với danh sách levelId đã biết (kiểm tra dài nhất trước để "toefl-junior"
// không bị nhầm cắt cụt).
const EXAM_LEVELS = ['toefl-junior', 'starters', 'movers', 'flyers', 'toeic', 'ket', 'pet'];

export const EXAM_LEVEL_LABELS = {
  starters: 'Starters', movers: 'Movers', flyers: 'Flyers', ket: 'KET', pet: 'PET',
  'toefl-junior': 'TOEFL Junior', toeic: 'TOEIC', nguphap: 'Ngữ Pháp Trực Quan',
};

/** Cấp độ Thi Chứng Chỉ Anh của 1 mode, hoặc null nếu không thuộc khu này. */
export function examLevelOfMode(mode) {
  if (!mode) return null;
  if (mode.startsWith('nguphap-')) return 'nguphap';
  if (!mode.startsWith('exam-')) return null;
  const rest = mode.slice(5);
  for (const lvl of EXAM_LEVELS) {
    if (rest === lvl || rest.startsWith(`${lvl}-`)) return lvl;
  }
  return null;
}

/**
 * Theo dõi tiến độ khu Thi Chứng Chỉ Anh — gộp theo TỪNG cấp độ: tổng phút
 * học, số ván, lần chơi gần nhất (mấy ngày trước), và xu hướng HIỆU QUẢ
 * (so tỷ lệ thắng nửa ĐẦU với nửa SAU các ván gần đây — cần ít nhất 6 ván
 * mới đủ tin cậy để kết luận, ít hơn thì trả về 'not-enough-data' thay vì
 * đoán bừa). Trả về mảng đã sắp theo tổng phút học giảm dần.
 */
export function examProgressReport(sessions, now = new Date()) {
  const byLevel = new Map();
  for (const s of sessions || []) {
    const lvl = examLevelOfMode(s.mode);
    if (!lvl) continue;
    if (!byLevel.has(lvl)) byLevel.set(lvl, []);
    byLevel.get(lvl).push(s);
  }
  const winRate = (arr) => {
    const decided = arr.filter((s) => s.result === 'win' || s.result === 'loss');
    if (!decided.length) return null;
    return decided.filter((s) => s.result === 'win').length / decided.length;
  };
  const out = [];
  for (const [lvl, list] of byLevel) {
    const sorted = [...list].sort((a, b) => new Date(a.played_at || 0) - new Date(b.played_at || 0));
    const minutes = Math.round(sorted.reduce((sum, s) => sum + (s.seconds || 0), 0) / 60);
    const lastPlayed = sorted[sorted.length - 1]?.played_at || null;
    const daysSinceLast = lastPlayed ? Math.floor((now.getTime() - new Date(lastPlayed).getTime()) / 86400000) : null;
    let trend = 'not-enough-data';
    if (sorted.length >= 6) {
      const mid = Math.floor(sorted.length / 2);
      const before = winRate(sorted.slice(0, mid));
      const after = winRate(sorted.slice(mid));
      if (before !== null && after !== null) {
        const diff = after - before;
        if (diff >= 0.1) trend = 'improving';
        else if (diff <= -0.1) trend = 'declining';
        else trend = 'stable';
      }
    }
    out.push({
      level: lvl, label: EXAM_LEVEL_LABELS[lvl] || lvl, minutes, sessions: sorted.length,
      lastPlayed, daysSinceLast, trend,
    });
  }
  return out.sort((a, b) => b.minutes - a.minutes);
}

/** Bản văn bản tiếng Việt để bố mẹ sao chép/chia sẻ. */
export function formatReportVi(kidName, r) {
  const lines = [
    `📈 Báo cáo tuần của bé ${kidName}`,
    `• Học ${r.activeDays}/7 ngày, tổng ${r.minutes} phút (${r.games} ván)`,
  ];
  if (r.winRate !== null) lines.push(`• Tỷ lệ thắng: ${Math.round(r.winRate * 100)}%`);
  lines.push(`• Kiếm được ${r.starsEarned} ⭐, nhận ${r.freeGifts} quà chăm học, đổi ${r.giftsBought} quà`);
  lines.push(r.weakCount
    ? `• Còn ${r.weakCount} từ cần ôn${r.topWeak.length ? ` (hay sai nhất: ${r.topWeak.join(', ')})` : ''}`
    : '• Không còn từ nào cần ôn — tuyệt vời! 🎉');
  return lines.join('\n');
}
