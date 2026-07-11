// Logic Toán Lớp 1 — thuần, nhận rng để test. 5 dạng bài:
// cộng trừ ≤20 (+ điền khuyết) / so sánh > < = / xem giờ / hình khối & quy luật / đi chợ.

function shuffle(arr, rng = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const randInt = (lo, hi, rng) => lo + Math.floor(rng() * (hi - lo + 1));
const pick = (arr, rng) => arr[Math.floor(rng() * arr.length)];

/** 3 lựa chọn: đáp án + 2 số nhiễu gần kề, không trùng, không âm. */
function numOptions(answer, rng, max = 20) {
  const opts = new Set([answer]);
  while (opts.size < 3) {
    const delta = randInt(1, 3, rng) * (rng() < 0.5 ? -1 : 1);
    const w = answer + delta;
    if (w >= 0 && w <= max) opts.add(w);
  }
  return shuffle([...opts], rng);
}

/* ===== 1. Cộng trừ phạm vi 20 (+ điền số còn thiếu) ===== */

/**
 * @param {'basic'|'missing'} kind
 * @returns {{a,b,op,result, blank:'a'|'b'|'result', answer, options}}
 */
export function makeAddSub(rng = Math.random, kind = 'basic') {
  const plus = rng() < 0.55;
  let a;
  let b;
  if (plus) {
    a = randInt(1, 18, rng);
    b = randInt(1, 20 - a, rng);
  } else {
    a = randInt(2, 20, rng);
    b = randInt(1, a - 1, rng);
  }
  const result = plus ? a + b : a - b;
  const blank = kind === 'missing' ? pick(['a', 'b'], rng) : 'result';
  const answer = { a, b, result }[blank];
  return { a, b, op: plus ? '+' : '−', result, blank, answer, options: numOptions(answer, rng) };
}

/* ===== 2. So sánh > < = ===== */

/**
 * 2 vế: số, hoặc phép tính nhỏ (câu khó). @returns {{left, right, answer:'>'|'<'|'='}}
 * left/right = {text:string, value:number}
 */
export function makeCompare(rng = Math.random, hard = false) {
  const side = () => {
    if (hard && rng() < 0.5) {
      const plus = rng() < 0.5;
      const x = randInt(plus ? 1 : 3, plus ? 9 : 10, rng);
      const y = plus ? randInt(1, 10 - x, rng) : randInt(1, x - 1, rng);
      return { text: `${x} ${plus ? '+' : '−'} ${y}`, value: plus ? x + y : x - y };
    }
    const n = randInt(0, hard ? 20 : 10, rng);
    return { text: String(n), value: n };
  };
  const left = side();
  // 1/4 số câu ép bằng nhau để bé gặp dấu "="
  const right = rng() < 0.25 ? { text: String(left.value), value: left.value } : side();
  const answer = left.value > right.value ? '>' : left.value < right.value ? '<' : '=';
  return { left, right, answer };
}

/* ===== 3. Xem giờ (giờ đúng + giờ rưỡi — chuẩn lớp 1) ===== */

export function timeLabel(hour, half) {
  return half ? `${hour} giờ rưỡi` : `${hour} giờ`;
}

/** @returns {{hour:1..12, half:boolean, label, options:string[]}} */
export function makeClock(rng = Math.random, allowHalf = true) {
  const hour = randInt(1, 12, rng);
  const half = allowHalf && rng() < 0.5;
  const label = timeLabel(hour, half);
  const opts = new Set([label]);
  while (opts.size < 3) {
    const h = randInt(1, 12, rng);
    const wrong = timeLabel(h, allowHalf && rng() < 0.5);
    if (wrong !== label) opts.add(wrong);
  }
  return { hour, half, label, options: shuffle([...opts], rng) };
}

/* ===== 4. Hình khối & quy luật dãy ===== */

export const SHAPES = [
  { id: 'circle', name: 'hình tròn', icon: '🔴' },
  { id: 'square', name: 'hình vuông', icon: '🟥' },
  { id: 'triangle', name: 'hình tam giác', icon: '🔺' },
];

export const SHAPE_OBJECTS = [
  { name: 'bánh xe', emoji: '🛞', shape: 'circle' },
  { name: 'quả bóng', emoji: '⚽', shape: 'circle' },
  { name: 'đồng hồ treo tường', emoji: '🕐', shape: 'circle' },
  { name: 'mặt trời', emoji: '☀️', shape: 'circle' },
  { name: 'chiếc pizza', emoji: '🍕', shape: 'triangle' },
  { name: 'mái nhà', emoji: '🏠', shape: 'triangle' },
  { name: 'cây thông', emoji: '🎄', shape: 'triangle' },
  { name: 'hộp quà', emoji: '🎁', shape: 'square' },
  { name: 'ô cửa sổ', emoji: '🪟', shape: 'square' },
  { name: 'viên xúc xắc', emoji: '🎲', shape: 'square' },
];

/** Đồ vật này hình gì? @returns {{obj, answer:shapeId, options:SHAPES}} */
export function makeShape(rng = Math.random) {
  const obj = pick(SHAPE_OBJECTS, rng);
  return { obj, answer: obj.shape, options: shuffle(SHAPES, rng) };
}

const PATTERN_TOKENS = [['🔴', '🔵'], ['⭐', '🌙'], ['🍎', '🍌'], ['🐶', '🐱'], ['🟥', '🟡', '🟦']];

/** Dãy quy luật ABAB / AABB / ABC, đoán phần tử tiếp theo. */
export function makePattern(rng = Math.random) {
  const tokens = pick(PATTERN_TOKENS, rng);
  const kind = tokens.length === 3 ? 'abc' : pick(['abab', 'aabb'], rng);
  const unit = kind === 'aabb' ? [tokens[0], tokens[0], tokens[1], tokens[1]] : tokens;
  const seq = [];
  while (seq.length < 6) seq.push(unit[seq.length % unit.length]);
  const answer = unit[seq.length % unit.length];
  const wrongs = [...new Set(tokens.filter((tk) => tk !== answer))];
  while (wrongs.length < 2) {
    const extra = pick(PATTERN_TOKENS.flat().filter((tk) => tk !== answer && !wrongs.includes(tk)), rng);
    wrongs.push(extra);
  }
  return { seq, answer, options: shuffle([answer, ...wrongs.slice(0, 2)], rng) };
}

/* ===== 5. Đi chợ (tiền nghìn đồng: 1k 2k 5k 10k) ===== */

export const BILLS = [
  { value: 1, label: '1 nghìn', color: '#8a9a5b' },
  { value: 2, label: '2 nghìn', color: '#b0679a' },
  { value: 5, label: '5 nghìn', color: '#3f7fbf' },
  { value: 10, label: '10 nghìn', color: '#c9962b' },
];

export const SHOP_ITEMS = [
  { name: 'quả táo', emoji: '🍎' }, { name: 'cây kẹo', emoji: '🍭' },
  { name: 'hộp sữa', emoji: '🥛' }, { name: 'cái bánh', emoji: '🍰' },
  { name: 'quả chuối', emoji: '🍌' }, { name: 'cây kem', emoji: '🍦' },
  { name: 'quyển vở', emoji: '📓' }, { name: 'cây bút', emoji: '✏️' },
  { name: 'quả bóng', emoji: '⚽' }, { name: 'chiếc diều', emoji: '🪁' },
];

/** @returns {{items:[{...item, price}], total}} 1–2 món, tổng 2..18 nghìn */
export function makeShopping(rng = Math.random) {
  const count = rng() < 0.4 ? 2 : 1;
  const chosen = shuffle(SHOP_ITEMS, rng).slice(0, count);
  const items = chosen.map((it) => ({ ...it, price: randInt(2, count === 2 ? 9 : 15, rng) }));
  return { items, total: items.reduce((sum, it) => sum + it.price, 0) };
}

/** Trả tiền: cộng dồn các tờ đã chạm. @returns 'paid'|'over'|'more' */
export function payState(total, tapped) {
  const sum = tapped.reduce((a, b) => a + b, 0);
  if (sum === total) return 'paid';
  return sum > total ? 'over' : 'more';
}
