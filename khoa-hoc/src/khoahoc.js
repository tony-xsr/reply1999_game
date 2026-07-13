// Logic Khoa Học Khám Phá Vui — thuần, nhận rng để test tất định.
// 3 trò: vòng đời con vật/cây + 4 mùa / pha màu / chìm-nổi.

function shuffle(arr, rng = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const pick = (arr, n, rng) => shuffle(arr, rng).slice(0, n);

/* ===== 1. Vòng Đời & Thiên Nhiên ===== */

export const LIFE_CYCLES = [
  {
    id: 'frog', name: 'Vòng đời con ếch', icon: '🐸',
    stages: [
      { text: 'Trứng ếch', icon: '🥚' },
      { text: 'Nòng nọc', icon: '🐟' },
      { text: 'Ếch con', icon: '🐸' },
    ],
  },
  {
    id: 'butterfly', name: 'Vòng đời con bướm', icon: '🦋',
    stages: [
      { text: 'Trứng bướm', icon: '🥚' },
      { text: 'Sâu bướm', icon: '🐛' },
      { text: 'Kén (nhộng)', icon: '🌰' },
      { text: 'Bướm', icon: '🦋' },
    ],
  },
  {
    id: 'chicken', name: 'Vòng đời con gà', icon: '🐔',
    stages: [
      { text: 'Trứng gà', icon: '🥚' },
      { text: 'Gà con', icon: '🐤' },
      { text: 'Gà trưởng thành', icon: '🐔' },
    ],
  },
  {
    id: 'plant', name: 'Vòng đời cây xanh', icon: '🌸',
    stages: [
      { text: 'Hạt giống', icon: '🫘' },
      { text: 'Mầm cây', icon: '🌱' },
      { text: 'Cây con', icon: '🌿' },
      { text: 'Cây ra hoa', icon: '🌸' },
    ],
  },
];

/** 1 vòng chơi: chọn 1 vòng đời + xáo các giai đoạn, giữ correctIndex để chấm. */
export function makeLifeCycleRound(cycle, rng = Math.random) {
  const shuffled = shuffle(cycle.stages.map((s, i) => ({ ...s, correctIndex: i })), rng);
  return { cycle, shuffled };
}

export const SEASONS = [
  { id: 'spring', name: 'mùa xuân', icon: '🌸' },
  { id: 'summer', name: 'mùa hè', icon: '☀️' },
  { id: 'autumn', name: 'mùa thu', icon: '🍂' },
  { id: 'winter', name: 'mùa đông', icon: '❄️' },
];

export const SEASON_ITEMS = [
  { text: 'Mặc áo len ấm áp', emoji: '🧥', season: 'winter' },
  { text: 'Quàng khăn cổ', emoji: '🧣', season: 'winter' },
  { text: 'Đắp chăn bông', emoji: '🛏️', season: 'winter' },
  { text: 'Mặc đồ bơi', emoji: '🩱', season: 'summer' },
  { text: 'Ăn kem que giải nhiệt', emoji: '🍦', season: 'summer' },
  { text: 'Bật quạt máy', emoji: '🪭', season: 'summer' },
  { text: 'Ngắm lá vàng rụng', emoji: '🍁', season: 'autumn' },
  { text: 'Thả diều', emoji: '🪁', season: 'autumn' },
  { text: 'Rước đèn Trung Thu', emoji: '🏮', season: 'autumn' },
  { text: 'Ngắm hoa đào hoa mai nở', emoji: '🌸', season: 'spring' },
  { text: 'Đi chúc Tết ông bà', emoji: '🧧', season: 'spring' },
  { text: 'Đi xem mưa xuân lất phất', emoji: '🌦️', season: 'spring' },
];

/** Cho hoạt động, đoán mùa phù hợp (4 lựa chọn — đúng số mùa trong năm). */
export function makeSeasonFromItem(rng = Math.random) {
  const item = pick(SEASON_ITEMS, 1, rng)[0];
  const correct = SEASONS.find((s) => s.id === item.season);
  const wrongPool = SEASONS.filter((s) => s.id !== item.season);
  const options = shuffle([correct, ...pick(wrongPool, 3, rng)], rng);
  return { type: 'i2s', item, answer: correct.id, options };
}

/** Cho mùa, đoán hoạt động phù hợp (4 lựa chọn hoạt động). */
export function makeItemFromSeason(rng = Math.random) {
  const season = pick(SEASONS, 1, rng)[0];
  const correctItem = pick(SEASON_ITEMS.filter((it) => it.season === season.id), 1, rng)[0];
  const wrongPool = SEASON_ITEMS.filter((it) => it.season !== season.id);
  const options = shuffle([correctItem, ...pick(wrongPool, 3, rng)], rng);
  return { type: 's2i', season, answer: correctItem, options };
}

/** Bộ 1 lượt: nửa đầu = 1 vòng đời/vòng (không lặp lại 4 vòng đời), nửa sau = đố mùa. */
export function makeNatureSet(total = 8, rng = Math.random) {
  const halfCycle = Math.floor(total / 2);
  const cycles = shuffle(LIFE_CYCLES, rng).slice(0, halfCycle)
    .map((cycle) => ({ kind: 'cycle', ...makeLifeCycleRound(cycle, rng) }));
  const seasons = [];
  for (let i = 0; i < total - halfCycle; i++) {
    seasons.push({ kind: 'season', ...(rng() < 0.5 ? makeSeasonFromItem(rng) : makeItemFromSeason(rng)) });
  }
  return [...cycles, ...seasons];
}

/* ===== 2. Pha Màu Diệu Kỳ ===== */

export const COLORS = {
  red: { name: 'đỏ', hex: '#e53935' },
  yellow: { name: 'vàng', hex: '#fdd835' },
  blue: { name: 'xanh dương', hex: '#1e88e5' },
  white: { name: 'trắng', hex: '#ffffff' },
  black: { name: 'đen', hex: '#241e2e' },
  orange: { name: 'cam', hex: '#fb8c00' },
  green: { name: 'xanh lá', hex: '#43a047' },
  purple: { name: 'tím', hex: '#8e24aa' },
  pink: { name: 'hồng', hex: '#ec407a' },
  gray: { name: 'xám', hex: '#9e9e9e' },
};

export const MIXES = [
  { a: 'red', b: 'yellow', result: 'orange' },
  { a: 'blue', b: 'yellow', result: 'green' },
  { a: 'red', b: 'blue', result: 'purple' },
  { a: 'red', b: 'white', result: 'pink' },
  { a: 'black', b: 'white', result: 'gray' },
];

export const pairKey = (pair) => [...pair].sort().join('+');

/** Cho 2 giọt màu, đoán màu ra (3 lựa chọn màu đơn). */
export function makePredictQuestion(rng = Math.random) {
  const mix = pick(MIXES, 1, rng)[0];
  const wrongPool = Object.keys(COLORS).filter((id) => id !== mix.result && id !== mix.a && id !== mix.b);
  const options = shuffle([mix.result, ...pick(wrongPool, 2, rng)], rng);
  return { type: 'predict', mix, answer: mix.result, options };
}

/** Cho màu ra, đoán 2 màu gốc (3 lựa chọn cặp màu). */
export function makeReverseQuestion(rng = Math.random) {
  const mix = pick(MIXES, 1, rng)[0];
  const correctPair = [mix.a, mix.b];
  const wrongPairs = pick(MIXES.filter((m) => m.result !== mix.result), 2, rng).map((m) => [m.a, m.b]);
  const options = shuffle([correctPair, ...wrongPairs], rng);
  return { type: 'reverse', mix, answer: correctPair, options };
}

/** Bộ 1 lượt: nửa đầu đoán màu ra, nửa sau đoán 2 màu gốc. */
export function makeMixSet(total = 8, rng = Math.random) {
  const set = [];
  for (let i = 0; i < total; i++) {
    set.push(i < total / 2 ? makePredictQuestion(rng) : makeReverseQuestion(rng));
  }
  return set;
}

/* ===== 3. Chìm Hay Nổi? ===== */

export const FLOAT_ITEMS = [
  { name: 'Viên đá', emoji: '🪨', floats: false, explain: 'Đá rất nặng nên chìm xuống đáy!' },
  { name: 'Quả bóng bay', emoji: '🎈', floats: true, explain: 'Bóng bay nhẹ và chứa khí nên nổi trên mặt nước!' },
  { name: 'Chiếc lá', emoji: '🍃', floats: true, explain: 'Lá cây mỏng và nhẹ nên nổi được!' },
  { name: 'Đồng xu', emoji: '🪙', floats: false, explain: 'Kim loại nặng nên đồng xu chìm xuống!' },
  { name: 'Khúc gỗ', emoji: '🪵', floats: true, explain: 'Gỗ nhẹ hơn nước nên nổi lên!' },
  { name: 'Quả bóng nhựa', emoji: '⚽', floats: true, explain: 'Bóng nhựa rỗng ruột, chứa khí nên nổi!' },
  { name: 'Cái đinh sắt', emoji: '🔩', floats: false, explain: 'Sắt rất nặng nên đinh chìm xuống đáy!' },
  { name: 'Chiếc lông vũ', emoji: '🪶', floats: true, explain: 'Lông vũ siêu nhẹ nên nổi bồng bềnh!' },
  { name: 'Cái muỗng kim loại', emoji: '🥄', floats: false, explain: 'Muỗng kim loại nặng nên chìm xuống!' },
  { name: 'Miếng bọt biển', emoji: '🧽', floats: true, explain: 'Bọt biển rất nhẹ nên nổi trên mặt nước!' },
  { name: 'Quả táo', emoji: '🍎', floats: true, explain: 'Táo có nhiều không khí bên trong nên nổi được!' },
  { name: 'Viên bi sắt', emoji: '⚫', floats: false, explain: 'Bi sắt đặc và nặng nên chìm xuống đáy!' },
];

/** Bộ câu hỏi chìm-nổi: lấy ngẫu nhiên không trùng. */
export function makeFloatSet(total = 8, rng = Math.random) {
  return pick(FLOAT_ITEMS, total, rng);
}
