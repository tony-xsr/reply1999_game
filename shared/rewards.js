// Luật thưởng SAO ⭐ & QUÀ 🎁 — hàm THUẦN, không đụng DOM/mạng, test độc lập.
// Luật đã chốt với phụ huynh (07/2026):
// - MỌI game đều có thưởng (không riêng Nghe & Đoán).
// - Kết thúc mỗi chuỗi học 10–20 câu sẽ có quà: cứ mỗi GIFT_EVERY câu đã trả
//   lời (cộng dồn trong ngày, mọi game) bé nhận 1 hộp quà nhỏ.
// - Chống lạm phát: trần sao mỗi ngày.

export const DAILY_STAR_CAP = 50;
export const GIFT_EVERY = 15; // giữa khoảng 10–20 câu bạn yêu cầu
export const STARS_PER_10_POINTS = 1;
// Giảm 5→3 (07/2026, yêu cầu phụ huynh): áp dụng ĐỒNG THỜI cho MỌI game
// (kể cả toàn bộ khu Thi Chứng Chỉ Anh — exam-prep/luyen-thi-ket/pet/
// toefl-junior/toeic/nguphap-truc-quan đều tính sao qua ĐÚNG hàm
// starsFromScore() này, không có luồng tính điểm riêng) — "tối đa 3 sao/bài
// học" và "tối đa 5 sao giảm còn 3" là CÙNG 1 thay đổi, không phải 2 việc.
export const SESSION_STAR_CAP = 3;

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
  // troxua/ tách thành 4 game riêng (07/2026) — giữ đúng flat-reward như
  // game gộp cũ, mỗi game con vẫn chỉ 1 sao/lượt bất kể thắng thua.
  'oantuti', 'banbi', 'nemlonxua', 'nhaydayxua',
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

// Quà loại "voucher"/"drink" là đồ THẬT quy đổi theo giá trị tiền mặt ước
// lượng, không hợp lý nếu nhân thêm hệ số đổi quà chung (multiplier) như
// kẹo/hoa/thú/danh hiệu — nên đánh dấu `fixedCost: true`: `cost` ở đây LÀ
// giá sao cuối cùng bé phải trả, effectiveCost() sẽ không nhân hệ số nữa.
// Neo giá theo 2 mốc phụ huynh cho: phiếu 20k=400 sao, phiếu 50k=900 sao
// (~16-20 sao/1.000đ) — nội suy cùng tỉ lệ cho nước ngọt/trà xanh/trà sữa.
// Phụ huynh có thể tự chỉnh lại TỪNG giá này riêng cho gia đình mình ở
// Trang Phụ Huynh (xem `custom_item_costs` trong `settings`).
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
  { id: 'drink1', icon: '🥤', name: 'Nước ngọt', cost: 270, type: 'drink', fixedCost: true },
  { id: 'drink2', icon: '🍵', name: 'Trà xanh', cost: 320, type: 'drink', fixedCost: true },
  { id: 'drink3', icon: '🧋', name: 'Trà sữa', cost: 480, type: 'drink', fixedCost: true },
  { id: 'voucher20k', icon: '🧸', name: 'Phiếu mua đồ chơi 20k', cost: 400, type: 'voucher', fixedCost: true },
  { id: 'voucher50k', icon: '🎮', name: 'Phiếu mua đồ chơi 50k', cost: 900, type: 'voucher', fixedCost: true },
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
// Tăng x6→x12→x36 (07/2026, 2 đợt liên tiếp: "tăng x2" rồi "tăng thêm x3
// nữa trên mức đang có" để chống lạm phát) — chống lạm phát từ CẢ 2 phía:
// hạ tốc độ kiếm (trần sao/ván 15→5) VÀ nâng chi phí tiêu (hệ số đổi quà).
export const DEFAULT_REWARD_COST_MULTIPLIER = 36;

/**
 * Giá đổi THỰC TẾ 1 món quà — có 3 tầng ưu tiên, tầng trên đè tầng dưới:
 * 1. `overrides[item.id]` — giá phụ huynh TỰ CHỈNH riêng cho gia đình mình
 *    (lưu ở `settings.custom_item_costs`), luôn thắng nếu có đặt.
 * 2. `item.fixedCost` — quà quy đổi theo giá trị tiền mặt thật (phiếu mua
 *    đồ chơi, nước uống...) thì `item.cost` CHÍNH LÀ giá sao cuối cùng,
 *    không nhân thêm hệ số chung.
 * 3. Mặc định: `item.cost` × hệ số chung (làm tròn, tối thiểu 1 sao).
 */
export function effectiveCost(item, multiplier = DEFAULT_REWARD_COST_MULTIPLIER, overrides = null) {
  if (overrides && Object.prototype.hasOwnProperty.call(overrides, item.id)) {
    const custom = Number(overrides[item.id]);
    if (custom > 0) return Math.max(1, Math.round(custom));
  }
  if (item.fixedCost) return Math.max(1, Math.round(item.cost));
  const m = Number(multiplier) > 0 ? Number(multiplier) : DEFAULT_REWARD_COST_MULTIPLIER;
  return Math.max(1, Math.round(item.cost * m));
}
