// Logic Học Tiếng Anh Qua Toán — thuần, test được.
// Hiện phép cộng/trừ dạng "1 + 1 = ?", máy đọc TOÀN BỘ câu bằng tiếng Anh KÈM
// đáp án ("1 plus 1 equals 2" → giọng en-US tự đọc số thành từ) — bé chỉ cần
// NGHE và chọn đúng con số đã nghe trong các lựa chọn. Khác game Toán Lớp 1
// (toan-lop-1/src/toan.js) vốn không hé lộ đáp án khi đọc để bé tự giải toán,
// game này ưu tiên dạy TỪ VỰNG SỐ ĐẾM tiếng Anh qua ngữ cảnh phép tính.

function shuffle(arr, rng = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const randInt = (lo, hi, rng) => lo + Math.floor(rng() * (hi - lo + 1));

export const QUESTIONS = 8;
export const POINTS_PER_CORRECT = 10;

/** 3 lựa chọn: đáp án + 2 số nhiễu gần kề, không trùng, không âm, không vượt max. */
function numOptions(answer, rng, max) {
  const opts = new Set([answer]);
  while (opts.size < 3) {
    const delta = randInt(1, 3, rng) * (rng() < 0.5 ? -1 : 1);
    const w = answer + delta;
    if (w >= 0 && w <= max) opts.add(w);
  }
  return shuffle([...opts], rng);
}

/**
 * Sinh 1 phép cộng/trừ. hard=false: chỉ cộng, phạm vi 0..10 (4 câu đầu).
 * hard=true: cộng lẫn trừ, phạm vi 0..20 (4 câu sau, khó dần).
 * @returns {{a:number, b:number, op:'+'|'−', result:number, options:number[]}}
 */
export function makeProblem(rng = Math.random, hard = false) {
  const max = hard ? 20 : 10;
  const plus = !hard || rng() < 0.6;
  let a;
  let b;
  if (plus) {
    a = randInt(0, max - 1, rng);
    b = randInt(0, max - a, rng);
  } else {
    a = randInt(1, max, rng);
    b = randInt(0, a, rng);
  }
  const result = plus ? a + b : a - b;
  return { a, b, op: plus ? '+' : '−', result, options: numOptions(result, rng, max) };
}

/** Chuỗi hiển thị trực quan, đáp án luôn ẩn: "1 + 1 = ?". */
export function equationDisplay(problem) {
  return `${problem.a} ${problem.op} ${problem.b} = ?`;
}

/**
 * Câu tiếng Anh ĐẦY ĐỦ máy sẽ đọc, gồm cả đáp án — viết bằng CHỮ SỐ + từ nối
 * tiếng Anh ("1 plus 1 equals 2"), để giọng đọc en-US tự đọc số thành từ
 * đúng phát âm (không cần tự soạn bảng từ số tiếng Anh).
 */
export function equationSpeech(problem) {
  const opWord = problem.op === '+' ? 'plus' : 'minus';
  return `${problem.a} ${opWord} ${problem.b} equals ${problem.result}`;
}
