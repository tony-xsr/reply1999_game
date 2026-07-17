// Luật thưởng SAO ⭐ & QUÀ 🎁 — hàm THUẦN, không đụng DOM/mạng, test độc lập.
// Luật đã chốt với phụ huynh (07/2026):
// - MỌI game đều có thưởng (không riêng Nghe & Đoán).
// - Kết thúc mỗi chuỗi học 10–20 câu sẽ có quà: cứ mỗi GIFT_EVERY câu đã trả
//   lời (cộng dồn trong ngày, mọi game) bé nhận 1 hộp quà nhỏ.
// - Chống lạm phát: trần sao mỗi ngày.

export const DAILY_STAR_CAP = 50;
export const GIFT_EVERY = 15; // giữa khoảng 10–20 câu bạn yêu cầu
export const STARS_PER_10_POINTS = 1;
export const SESSION_STAR_CAP = 15;

/** Sao kiếm được từ điểm của 1 ván (10 điểm = 1 sao, trần 15 sao/ván). */
export function starsFromScore(score) {
  const s = Math.floor(Math.max(0, score | 0) / 10) * STARS_PER_10_POINTS;
  return Math.min(SESSION_STAR_CAP, s);
}

/**
 * Áp trần sao NGÀY: đã kiếm `earnedToday`, muốn cộng thêm `want` — trả về số
 * thật sự được cộng (0 nếu đã chạm trần).
 */
export function capDailyStars(earnedToday, want, cap = DAILY_STAR_CAP) {
  const room = Math.max(0, cap - Math.max(0, earnedToday | 0));
  return Math.max(0, Math.min(room, want | 0));
}

/**
 * Số hộp quà bé ĐƯỢC THÊM khi tổng số câu đã trả lời trong ngày tăng từ
 * `prevAnswered` lên `newAnswered` (mỗi GIFT_EVERY câu = 1 quà).
 * Ví dụ 14 → 31 câu: qua các mốc 15 và 30 → 2 quà.
 */
export function newGiftCount(prevAnswered, newAnswered, every = GIFT_EVERY) {
  const a = Math.max(0, prevAnswered | 0);
  const b = Math.max(a, newAnswered | 0);
  return Math.floor(b / every) - Math.floor(a / every);
}

/** Danh mục quà đổi bằng sao trong "Tủ quà của bé". */
export const CATALOG = [
  { id: 'candy1', icon: '🍬', name: 'Kẹo ngọt', cost: 5, type: 'candy' },
  { id: 'candy2', icon: '🍭', name: 'Kẹo mút', cost: 8, type: 'candy' },
  { id: 'candy3', icon: '🍫', name: 'Sô-cô-la', cost: 12, type: 'candy' },
  { id: 'flower1', icon: '🌸', name: 'Hoa anh đào', cost: 20, type: 'flower' },
  { id: 'flower2', icon: '🌻', name: 'Hoa hướng dương', cost: 20, type: 'flower' },
  { id: 'flower3', icon: '🌷', name: 'Hoa tulip', cost: 25, type: 'flower' },
  { id: 'flower4', icon: '🌹', name: 'Hoa hồng', cost: 30, type: 'flower' },
  { id: 'flower5', icon: '🪷', name: 'Hoa sen', cost: 35, type: 'flower' },
  { id: 'pet1', icon: '🐣', name: 'Gà con', cost: 80, type: 'pet' },
  { id: 'pet2', icon: '🐰', name: 'Thỏ con', cost: 100, type: 'pet' },
  { id: 'pet3', icon: '🐼', name: 'Gấu trúc', cost: 150, type: 'pet' },
  { id: 'badge1', icon: '👑', name: 'Danh hiệu Vua Từ Vựng', cost: 200, type: 'badge' },
];

/** Quà ngẫu nhiên loại kẹo cho hộp quà "học đủ 15 câu" (không tốn sao). */
export function randomSmallGift(rng = Math.random) {
  const candies = CATALOG.filter((c) => c.type === 'candy');
  return candies[Math.floor(rng() * candies.length)];
}

/** Tìm quà theo id (null nếu không có). */
export function catalogItem(id) {
  return CATALOG.find((c) => c.id === id) || null;
}
