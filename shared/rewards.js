// Luật thưởng SAO ⭐ & QUÀ 🎁 — hàm THUẦN, không đụng DOM/mạng, test độc lập.
// Luật đã chốt với phụ huynh (07/2026):
// - MỌI game đều có thưởng (không riêng Nghe & Đoán).
// - Kết thúc mỗi chuỗi học 10–20 câu sẽ có quà: cứ mỗi GIFT_EVERY câu đã trả
//   lời (cộng dồn trong ngày, mọi game) bé nhận 1 hộp quà nhỏ.
// - Chống lạm phát: trần sao mỗi ngày.

export const DAILY_STAR_CAP = 50;
export const GIFT_EVERY = 15; // giữa khoảng 10–20 câu bạn yêu cầu
export const STARS_PER_10_POINTS = 1;
export const SESSION_STAR_CAP = 5;

/** Sao kiếm được từ điểm của 1 ván (10 điểm = 1 sao, trần 5 sao/ván). */
export function starsFromScore(score) {
  const s = Math.floor(Math.max(0, score | 0) / 10) * STARS_PER_10_POINTS;
  return Math.min(SESSION_STAR_CAP, s);
}

// Các game GIẢI TRÍ THUẦN TÚY — không có nội dung từ vựng/ngữ pháp/kiến thức
// nào (đào vàng, đua xe, cờ dân gian, arcade cổ điển...). Thưởng sao theo
// ĐIỂM SỐ như game học sẽ không hợp lý vì bé không học được gì khi chơi.
// Theo yêu cầu phụ huynh (07/2026): các game này chỉ thưởng CỐ ĐỊNH 1 sao
// mỗi lần chơi xong (không phụ thuộc điểm số/thắng thua). Danh sách khớp
// đúng chuỗi `mode` mà mỗi game truyền vào recordSession().
export const FLAT_REWARD_MODES = new Set([
  'daovang', 'khunglong', 'dapvang', 'daohamvang', 'duonghham', 'consot',
  'hangkim', 'kimcuong', 'vivuavang', 'xaytt', 'batvit', 'ransanmoi',
  'xepgach', 'ghephinh', 'lathinh', 'thamhiem', 'chimnon', 'rongcon',
  'calon', 'phidoinhi', 'gavutru', 'bongdo', 'nembanh', 'phaonuoc',
  'vudieu', 'taydua', 'thucung', 'vodai', 'pokedaichien', 'vuonrau',
  'behai', 'betimban', 'stylist', 'phongxinh', 'oanquan', 'cangua',
  'coganh', 'cocaro', 'dientu', 'troxua',
  // Rà lại 07/2026 (yêu cầu giảm lạm phát sao): 2 game này KHÔNG có nội dung
  // từ vựng/kiến thức nào dù trước đó bị xếp nhầm vào diện "học theo điểm" —
  // "Gộp Số Vui" là bản sao game 2048 thuần túy, "Luyện Tư Duy" là 6 trò
  // mê cung/sudoku/tìm khác biệt/nối hình thuần giải đố, không có giọng đọc
  // dạy từ/kiến thức gì. Chuyển về diện giải trí thuần 1 sao/lượt.
  'gopsovui', 'tuduy',
  // Pikachu Classic/Onet (pokemon/) truyền thẳng state.mode làm mode:
  'classic', 'zen', 'daily', 'duel',
]);
// arcade-xua/, van-dong-vui/ và ren-tri-nao/ ghép thêm tên minigame con vào
// mode, vd "arcadexua-whack" — so khớp theo tiền tố thay vì so khớp đúng
// chuỗi. ren-tri-nao/ (Simon nhớ màu, 2048, bi-a mini, khối rơi...) đa số là
// arcade cổ điển thuần giải trí — riêng 1/5 trò con (lật bài nhớ hình có
// nghe từ tiếng Anh) bị xếp CHUNG vào diện flat luôn cho đơn giản/nhất
// quán, chấp nhận đánh đổi nhỏ này giống cách arcade-xua/van-dong-vui đã
// làm trước đó.
const FLAT_REWARD_MODE_PREFIXES = ['arcadexua-', 'vandongvui-', 'rentrinao-'];

export const FLAT_REWARD_STARS = 1;

/** Game này có phải giải trí thuần (không học) không? */
export function isFlatRewardMode(mode) {
  return FLAT_REWARD_MODES.has(mode) || FLAT_REWARD_MODE_PREFIXES.some((p) => mode.startsWith(p));
}

/** Sao kiếm được từ 1 ván: game giải trí thuần → cố định 1 sao; game có học → theo điểm. */
export function starsForSession(mode, score) {
  return isFlatRewardMode(mode) ? FLAT_REWARD_STARS : starsFromScore(score);
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

// Giá gốc trong CATALOG quá rẻ so với tốc độ kiếm sao (trần 5 sao/ván, 50
// sao/ngày) khiến bé đổi được quà gần như ngay lập tức — nhân hệ số mặc định
// để mỗi món quà thành mục tiêu dài hơi hơn. Phụ huynh chỉnh được số này
// qua Trang Phụ Huynh (lưu trong settings.reward_cost_multiplier).
// Tăng x6→x12 (07/2026, yêu cầu "tăng x2 sao cần đổi quà" để chống lạm phát
// sau khi đã giảm trần sao/ván 15→5) — chống lạm phát từ CẢ 2 phía: hạ tốc
// độ kiếm (trần sao/ván) VÀ nâng chi phí tiêu (hệ số đổi quà).
export const DEFAULT_REWARD_COST_MULTIPLIER = 12;

/** Giá đổi THỰC TẾ = giá gốc × hệ số (làm tròn, tối thiểu 1 sao). */
export function effectiveCost(item, multiplier = DEFAULT_REWARD_COST_MULTIPLIER) {
  const m = Number(multiplier) > 0 ? Number(multiplier) : DEFAULT_REWARD_COST_MULTIPLIER;
  return Math.max(1, Math.round(item.cost * m));
}
