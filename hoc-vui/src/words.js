// Từ vựng song ngữ theo chủ đề + bộ sinh câu hỏi cho 3 chế độ
// (ghép chữ–hình, đếm & so sánh, nghe & tìm). Hàm sinh đều thuần → test được.

export const TOPICS = [
  {
    id: 'animals',
    vi: 'Động vật',
    en: 'Animals',
    icon: '🐱',
    items: [
      { vi: 'con mèo', en: 'Cat', emoji: '🐱' },
      { vi: 'con chó', en: 'Dog', emoji: '🐶' },
      { vi: 'con gà', en: 'Chicken', emoji: '🐔' },
      { vi: 'con cá', en: 'Fish', emoji: '🐟' },
      { vi: 'con voi', en: 'Elephant', emoji: '🐘' },
      { vi: 'con thỏ', en: 'Rabbit', emoji: '🐰' },
      { vi: 'con khỉ', en: 'Monkey', emoji: '🐵' },
      { vi: 'con gấu', en: 'Bear', emoji: '🐻' },
      { vi: 'con vịt', en: 'Duck', emoji: '🦆' },
      { vi: 'con ong', en: 'Bee', emoji: '🐝' },
      { vi: 'con bò', en: 'Cow', emoji: '🐄' },
      { vi: 'con heo', en: 'Pig', emoji: '🐷' },
    ],
  },
  {
    id: 'fruits',
    vi: 'Trái cây',
    en: 'Fruits',
    icon: '🍎',
    items: [
      { vi: 'quả táo', en: 'Apple', emoji: '🍎' },
      { vi: 'quả chuối', en: 'Banana', emoji: '🍌' },
      { vi: 'quả cam', en: 'Orange', emoji: '🍊' },
      { vi: 'chùm nho', en: 'Grapes', emoji: '🍇' },
      { vi: 'dưa hấu', en: 'Watermelon', emoji: '🍉' },
      { vi: 'dâu tây', en: 'Strawberry', emoji: '🍓' },
      { vi: 'quả xoài', en: 'Mango', emoji: '🥭' },
      { vi: 'quả dứa', en: 'Pineapple', emoji: '🍍' },
      { vi: 'quả dừa', en: 'Coconut', emoji: '🥥' },
      { vi: 'quả đào', en: 'Peach', emoji: '🍑' },
    ],
  },
  {
    id: 'things',
    vi: 'Đồ vật',
    en: 'Things',
    icon: '🚗',
    items: [
      { vi: 'ô tô', en: 'Car', emoji: '🚗' },
      { vi: 'máy bay', en: 'Plane', emoji: '✈️' },
      { vi: 'ngôi nhà', en: 'House', emoji: '🏠' },
      { vi: 'cái ghế', en: 'Chair', emoji: '🪑' },
      { vi: 'cái mũ', en: 'Hat', emoji: '🎩' },
      { vi: 'quả bóng', en: 'Ball', emoji: '⚽' },
      { vi: 'quyển sách', en: 'Book', emoji: '📖' },
      { vi: 'đồng hồ', en: 'Clock', emoji: '⏰' },
      { vi: 'cái kéo', en: 'Scissors', emoji: '✂️' },
      { vi: 'cái ô', en: 'Umbrella', emoji: '☂️' },
    ],
  },
  {
    id: 'colors',
    vi: 'Màu sắc',
    en: 'Colors',
    icon: '🌈',
    items: [
      { vi: 'màu đỏ', en: 'Red', emoji: '🔴' },
      { vi: 'màu cam', en: 'Orange', emoji: '🟠' },
      { vi: 'màu vàng', en: 'Yellow', emoji: '🟡' },
      { vi: 'màu xanh lá', en: 'Green', emoji: '🟢' },
      { vi: 'màu xanh dương', en: 'Blue', emoji: '🔵' },
      { vi: 'màu tím', en: 'Purple', emoji: '🟣' },
      { vi: 'màu nâu', en: 'Brown', emoji: '🟤' },
      { vi: 'màu đen', en: 'Black', emoji: '⚫' },
      { vi: 'màu trắng', en: 'White', emoji: '⚪' },
    ],
  },
];

export const ALL_ITEMS = TOPICS.flatMap((topic) => topic.items);

// Trò đếm & cộng trừ chỉ dùng vật ĐẾM ĐƯỢC ("3 con mèo" ổn, "3 màu đỏ" thì kỳ)
export const COUNTABLE_ITEMS = TOPICS.filter((topic) => topic.id !== 'colors')
  .flatMap((topic) => topic.items);

function shuffle(arr, rng = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr, n, rng = Math.random) {
  return shuffle(arr, rng).slice(0, n);
}

const randInt = (lo, hi, rng = Math.random) => lo + Math.floor(rng() * (hi - lo + 1));

/* ===== Chế độ 1: Ghép chữ với hình =====
   1 vòng = 4 hình + 4 thẻ chữ xáo trộn. */
export function makeMatchRound(items, rng = Math.random) {
  const four = pick(items, 4, rng);
  return { pictures: four, words: shuffle(four, rng) };
}

/* ===== Chế độ 2: Đếm & so sánh =====
   3 dạng: đếm (1–10) / bên nào nhiều hơn / cộng trừ trong phạm vi 10. */

export function makeCountQuestion(items, rng = Math.random) {
  const item = pick(items, 1, rng)[0];
  const n = randInt(1, 10, rng);
  const options = shuffle([n, ...pick(
    Array.from({ length: 10 }, (_, i) => i + 1).filter((v) => v !== n), 2, rng,
  )], rng);
  return { type: 'count', item, n, answer: n, options };
}

export function makeCompareQuestion(items, rng = Math.random) {
  const [a, b] = pick(items, 2, rng);
  const na = randInt(1, 9, rng);
  let nb = randInt(1, 9, rng);
  if (nb === na) nb = na < 9 ? na + 1 : na - 1; // không cho hòa
  return { type: 'compare', sides: [{ item: a, n: na }, { item: b, n: nb }], answer: na > nb ? 0 : 1 };
}

export function makeMathQuestion(items, rng = Math.random) {
  const item = pick(items, 1, rng)[0];
  const plus = rng() < 0.5;
  let a;
  let b;
  if (plus) {
    a = randInt(1, 8, rng);
    b = randInt(1, 9 - a, rng); // tổng ≤ 9 để đếm được bằng mắt
  } else {
    a = randInt(2, 9, rng);
    b = randInt(1, a - 1, rng); // hiệu ≥ 1
  }
  const answer = plus ? a + b : a - b;
  const wrongs = pick(
    Array.from({ length: 10 }, (_, i) => i + 1).filter((v) => v !== answer), 2, rng,
  );
  return { type: 'math', item, a, b, plus, answer, options: shuffle([answer, ...wrongs], rng) };
}

/** Trộn đề 1 lượt chơi: đếm → so sánh → cộng trừ tăng dần độ khó. */
export function makeCountSet(items, total = 8, rng = Math.random) {
  const makers = [makeCountQuestion, makeCompareQuestion, makeMathQuestion];
  const set = [];
  for (let i = 0; i < total; i++) {
    const maker = makers[Math.min(makers.length - 1, Math.floor((i / total) * makers.length))];
    set.push(maker(items, rng));
  }
  return set;
}

/* ===== Chế độ 3: Nghe & tìm =====
   1 câu = 1 từ mục tiêu + lưới 6 hình (có mục tiêu). */
export function makeListenQuestion(items, gridSize = 6, rng = Math.random) {
  const grid = pick(items, gridSize, rng);
  const target = grid[Math.floor(rng() * grid.length)];
  return { target, grid };
}
