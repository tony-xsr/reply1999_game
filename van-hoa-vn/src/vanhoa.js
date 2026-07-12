// Logic Văn Hóa & Địa Lý Việt Nam — thuần, nhận rng để test tất định.
// 4 trò: bản đồ 3 miền / món ăn ba miền / trang trí Tết (tự do) / đèn lồng Trung Thu.

import { makeMatchRound } from '../../hoc-vui/src/words.js';

function shuffle(arr, rng = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const pick = (arr, n, rng) => shuffle(arr, rng).slice(0, n);

/* ===== 1. Bản Đồ Việt Nam Bé ===== */

export const REGIONS = [
  { id: 'bac', name: 'Miền Bắc', landmark: { name: 'Hà Nội', icon: '🐢', desc: 'Hồ Gươm' } },
  { id: 'trung', name: 'Miền Trung', landmark: { name: 'Huế', icon: '🏯', desc: 'Kinh thành Huế' } },
  { id: 'nam', name: 'Miền Nam', landmark: { name: 'TP. Hồ Chí Minh', icon: '🏛️', desc: 'Chợ Bến Thành' } },
];

/** 1 câu: đố tìm miền, hoặc đố "địa danh này ở miền nào" — cả hai đều chạm thẳng lên bản đồ. */
export function makeMapQuestion(rng = Math.random) {
  const region = pick(REGIONS, 1, rng)[0];
  return { type: rng() < 0.5 ? 'landmark' : 'region', region };
}

export function makeMapSet(total = 8, rng = Math.random) {
  const set = [];
  for (let i = 0; i < total; i++) set.push(makeMapQuestion(rng));
  return set;
}

/* ===== 2. Món Ăn Ba Miền ===== */

export const FOOD_ITEMS = [
  { vi: 'phở', en: 'Pho', emoji: '🍜', region: 'bac' },
  { vi: 'bánh cuốn', en: 'Banh Cuon', emoji: '🥟', region: 'bac' },
  { vi: 'chả cá', en: 'Cha Ca', emoji: '🐟', region: 'bac' },
  { vi: 'cốm', en: 'Com', emoji: '🌾', region: 'bac' },
  { vi: 'bún bò Huế', en: 'Bun Bo Hue', emoji: '🍲', region: 'trung' },
  { vi: 'mì Quảng', en: 'Mi Quang', emoji: '🍝', region: 'trung' },
  { vi: 'bánh khoái', en: 'Banh Khoai', emoji: '🥞', region: 'trung' },
  { vi: 'nem lụi', en: 'Nem Lui', emoji: '🍢', region: 'trung' },
  { vi: 'bánh xèo', en: 'Banh Xeo', emoji: '🥘', region: 'nam' },
  { vi: 'cơm tấm', en: 'Com Tam', emoji: '🍛', region: 'nam' },
  { vi: 'chả giò', en: 'Cha Gio', emoji: '🌯', region: 'nam' },
  { vi: 'bánh mì', en: 'Banh Mi', emoji: '🥖', region: 'nam' },
];

/** Cho món ăn, đoán thuộc miền nào (3 lựa chọn — đúng số miền). */
export function makeFoodRegionQuestion(rng = Math.random) {
  const item = pick(FOOD_ITEMS, 1, rng)[0];
  const correct = REGIONS.find((r) => r.id === item.region);
  const wrongPool = REGIONS.filter((r) => r.id !== item.region);
  const options = shuffle([correct, ...wrongPool], rng);
  return { item, answer: correct.id, options };
}

/** Bộ 1 lượt: nửa đầu ghép chữ-hình (dùng lại engine hoc-vui), nửa sau đố miền. */
export function makeFoodSet(total = 8, rng = Math.random) {
  const half = Math.floor(total / 2);
  const matches = [];
  for (let i = 0; i < half; i++) matches.push({ kind: 'match', ...makeMatchRound(FOOD_ITEMS, rng) });
  const quizzes = [];
  for (let i = 0; i < total - half; i++) quizzes.push({ kind: 'quiz', ...makeFoodRegionQuestion(rng) });
  return [...matches, ...quizzes];
}

/* ===== 3. Lễ Hội & Ngày Tết ===== */

export const TET_STICKERS = ['🌸', '🧧', '🏮', '🎊', '🍊', '🎇'];
export const LANTERN_ITEMS = ['🏮', '🥮', '🐇', '🌕', '🎑', '🦁'];

/** Tháng 1–2 là mùa Tết, tháng 8–9 là mùa Trung Thu, còn lại chơi tự do quanh năm. */
export function currentFestivalSeason(date = new Date()) {
  const m = date.getMonth() + 1;
  if (m === 1 || m === 2) return 'tet';
  if (m === 8 || m === 9) return 'trungthu';
  return null;
}

/** Bộ 6 cặp thẻ lồng đèn Trung Thu (giống pattern lat-hinh nhưng chủ đề riêng). */
export function makeLanternDeck(rng = Math.random) {
  let cards = [];
  for (const icon of LANTERN_ITEMS) {
    cards.push({ face: icon, pairKey: icon }, { face: icon, pairKey: icon });
  }
  cards = shuffle(cards, rng);
  cards.forEach((c, i) => { c.id = i; });
  return cards;
}
