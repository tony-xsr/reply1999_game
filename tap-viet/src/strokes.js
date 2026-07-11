// Dữ liệu nét viết cho tập viết chữ in hoa + số nét cơ bản.
// Tọa độ chuẩn hóa trong khung 0..100 (y hướng xuống). Mỗi ký tự = danh sách
// nét theo ĐÚNG THỨ TỰ viết; mỗi nét = polyline [[x,y], ...] để bé rê theo.

/** Lấy mẫu cung ellipse: tâm (cx,cy), bán trục rx/ry, góc a0→a1 (độ, y xuống). */
export function arc(cx, cy, rx, ry, a0, a1, steps = 18) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const a = ((a0 + ((a1 - a0) * i) / steps) * Math.PI) / 180;
    pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
  }
  return pts;
}

const line = (...pts) => pts;

/* ===== 26 chữ in hoa A–Z (kiểu chữ in đơn giản cho bé) ===== */

export const BASE_GLYPHS = {
  A: [line([50, 10], [22, 90]), line([50, 10], [78, 90]), line([33, 62], [67, 62])],
  B: [line([27, 10], [27, 90]), arc(27, 31, 34, 21, -90, 90), arc(27, 69, 40, 21, -90, 90)],
  C: [arc(52, 50, 29, 40, -55, -305)],
  D: [line([27, 10], [27, 90]), arc(27, 50, 48, 40, -90, 90)],
  E: [line([27, 10], [27, 90]), line([27, 10], [73, 10]), line([27, 50], [66, 50]), line([27, 90], [73, 90])],
  F: [line([27, 10], [27, 90]), line([27, 10], [73, 10]), line([27, 50], [64, 50])],
  G: [arc(52, 50, 29, 40, -55, -300), line([80, 58], [56, 58])],
  H: [line([25, 10], [25, 90]), line([75, 10], [75, 90]), line([25, 50], [75, 50])],
  I: [line([50, 10], [50, 90])],
  J: [[...line([62, 10], [62, 72]), ...arc(46, 72, 16, 17, 0, 180)]],
  K: [line([27, 10], [27, 90]), line([72, 10], [29, 53]), line([42, 40], [75, 90])],
  L: [[...line([27, 10], [27, 90]), ...line([27, 90], [72, 90]).slice(1)]],
  M: [line([22, 90], [22, 10]), line([22, 10], [50, 62]), line([78, 10], [50, 62]), line([78, 10], [78, 90])],
  N: [line([25, 90], [25, 10]), line([25, 10], [75, 90]), line([75, 90], [75, 10])],
  O: [arc(50, 50, 29, 40, -90, -450)],
  P: [line([27, 10], [27, 90]), arc(27, 33, 38, 23, -90, 90)],
  Q: [arc(50, 50, 29, 40, -90, -450), line([58, 66], [80, 92])],
  R: [line([27, 10], [27, 90]), arc(27, 33, 38, 23, -90, 90), line([30, 56], [75, 90])],
  S: [line([73, 22], [60, 11], [40, 12], [29, 26], [36, 42], [50, 50], [64, 58], [71, 73], [61, 87], [40, 89], [27, 79])],
  T: [line([22, 10], [78, 10]), line([50, 10], [50, 90])],
  U: [[...line([25, 10], [25, 55]), ...arc(50, 55, 25, 33, 180, 360).slice(1), ...line([75, 55], [75, 10]).slice(1)]],
  V: [line([25, 10], [50, 90], [75, 10])],
  W: [line([18, 10], [34, 90], [50, 36], [66, 90], [82, 10])],
  X: [line([27, 10], [73, 90]), line([73, 10], [27, 90])],
  Y: [line([25, 10], [50, 48]), line([75, 10], [50, 48], [50, 90])],
  Z: [line([27, 10], [73, 10], [27, 90], [73, 90])],
};

/* ===== Chữ có dấu tiếng Việt: nén chữ gốc xuống, thêm nét dấu phía trên ===== */

// Nén vùng chữ (y 10..90) xuống y 26..90 để chừa chỗ cho dấu
function squish(strokes) {
  return strokes.map((s) => s.map(([x, y]) => [x, 26 + ((y - 10) * 64) / 80]));
}

const MARKS = {
  breve: [line([37, 8], [44, 16], [56, 16], [63, 8])],        // ˘ (Ă)
  hat: [line([38, 18], [50, 5], [62, 18])],                    // ˆ (Â Ê Ô)
  hornO: [line([80, 26], [90, 14], [86, 28])],                 // móc của Ơ
  hornU: [line([76, 16], [88, 5], [83, 19])],                  // móc của Ư
};

export const GLYPHS = {
  ...BASE_GLYPHS,
  'Ă': [...squish(BASE_GLYPHS.A), ...MARKS.breve],
  'Â': [...squish(BASE_GLYPHS.A), ...MARKS.hat],
  'Đ': [...BASE_GLYPHS.D, line([14, 50], [42, 50])],
  'Ê': [...squish(BASE_GLYPHS.E), ...MARKS.hat],
  'Ô': [...squish(BASE_GLYPHS.O), ...MARKS.hat],
  'Ơ': [...BASE_GLYPHS.O, ...MARKS.hornO],
  'Ư': [...BASE_GLYPHS.U, ...MARKS.hornU],
};

/* ===== Nét cơ bản (khởi động trước khi viết chữ) ===== */

export const BASIC_STROKES = [
  { ch: '−', name: 'nét ngang', strokes: [line([18, 50], [82, 50])] },
  { ch: '|', name: 'nét sổ thẳng', strokes: [line([50, 12], [50, 88])] },
  { ch: '/', name: 'nét xiên trái', strokes: [line([72, 15], [28, 85])] },
  { ch: '\\', name: 'nét xiên phải', strokes: [line([28, 15], [72, 85])] },
  { ch: 'C', name: 'nét cong hở phải', strokes: [arc(52, 50, 27, 36, -60, -300)] },
  { ch: 'Ɔ', name: 'nét cong hở trái', strokes: [arc(48, 50, 27, 36, -120, 120)] },
  { ch: 'O', name: 'nét cong kín', strokes: [arc(50, 50, 27, 36, -90, -450)] },
  { ch: 'J', name: 'nét móc', strokes: [[...line([60, 12], [60, 70]), ...arc(45, 70, 15, 16, 0, 180)]] },
];

/* ===== Từ vựng tiếng Anh cho tab ABC ===== */

export const EN_WORDS = {
  A: { word: 'Apple', emoji: '🍎' }, B: { word: 'Ball', emoji: '⚽' },
  C: { word: 'Cat', emoji: '🐱' }, D: { word: 'Dog', emoji: '🐶' },
  E: { word: 'Egg', emoji: '🥚' }, F: { word: 'Fish', emoji: '🐟' },
  G: { word: 'Goat', emoji: '🐐' }, H: { word: 'Hat', emoji: '🎩' },
  I: { word: 'Ice cream', emoji: '🍦' }, J: { word: 'Juice', emoji: '🧃' },
  K: { word: 'Kite', emoji: '🪁' }, L: { word: 'Lion', emoji: '🦁' },
  M: { word: 'Moon', emoji: '🌙' }, N: { word: 'Nose', emoji: '👃' },
  O: { word: 'Orange', emoji: '🍊' }, P: { word: 'Pig', emoji: '🐷' },
  Q: { word: 'Queen', emoji: '👸' }, R: { word: 'Rabbit', emoji: '🐰' },
  S: { word: 'Sun', emoji: '☀️' }, T: { word: 'Tiger', emoji: '🐯' },
  U: { word: 'Umbrella', emoji: '☂️' }, V: { word: 'Violin', emoji: '🎻' },
  W: { word: 'Whale', emoji: '🐳' }, X: { word: 'X-ray', emoji: '🩻' },
  Y: { word: 'Yo-yo', emoji: '🪀' }, Z: { word: 'Zebra', emoji: '🦓' },
};

/* ===== Chuẩn hóa tên bé → dãy chữ viết được =====
   Bỏ dấu THANH (sắc huyền hỏi ngã nặng) nhưng giữ dấu CHỮ (ă â ê ô ơ ư đ):
   "Bống" → B, Ô, N, G. Ký tự không viết được thì bỏ qua. */

const TONE_MARKS = /[\u0300\u0301\u0303\u0309\u0323]/g; // huyen, sac, nga, hoi, nang

export function nameToGlyphs(name) {
  const out = [];
  for (const raw of String(name || '').toUpperCase()) {
    const ch = raw.normalize('NFD').replace(TONE_MARKS, '').normalize('NFC');
    if (GLYPHS[ch]) out.push(ch);
  }
  return out;
}
