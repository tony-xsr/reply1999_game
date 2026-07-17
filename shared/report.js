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
