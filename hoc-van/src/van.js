// Logic Học Vần tiếng Việt — thuần, test được.
// Tách tiếng thành PHỤ ÂM ĐẦU + VẦN + THANH và sinh câu đánh vần kiểu lớp 1:
//   "bò" → bờ - o - bo - huyền - bò

/* ===== Kho từ: tiếng 1 âm tiết quen thuộc, có hình minh họa ===== */

export const WORDS = [
  { word: 'bò', emoji: '🐄' }, { word: 'gà', emoji: '🐔' }, { word: 'cá', emoji: '🐟' },
  { word: 'mèo', emoji: '🐱' }, { word: 'chó', emoji: '🐶' }, { word: 'vịt', emoji: '🦆' },
  { word: 'voi', emoji: '🐘' }, { word: 'thỏ', emoji: '🐰' }, { word: 'gấu', emoji: '🐻' },
  { word: 'khỉ', emoji: '🐵' }, { word: 'dê', emoji: '🐐' }, { word: 'heo', emoji: '🐷' },
  { word: 'cua', emoji: '🦀' }, { word: 'tôm', emoji: '🦐' }, { word: 'sao', emoji: '⭐' },
  { word: 'hoa', emoji: '🌸' }, { word: 'lá', emoji: '🍃' }, { word: 'nấm', emoji: '🍄' },
  { word: 'táo', emoji: '🍎' }, { word: 'cam', emoji: '🍊' }, { word: 'nho', emoji: '🍇' },
  { word: 'dừa', emoji: '🥥' }, { word: 'xoài', emoji: '🥭' }, { word: 'chuối', emoji: '🍌' },
  { word: 'mưa', emoji: '🌧️' }, { word: 'trăng', emoji: '🌙' }, { word: 'mây', emoji: '☁️' },
  { word: 'nhà', emoji: '🏠' }, { word: 'xe', emoji: '🚗' }, { word: 'thuyền', emoji: '⛵' },
  { word: 'diều', emoji: '🪁' }, { word: 'kẹo', emoji: '🍬' }, { word: 'bánh', emoji: '🍰' },
  { word: 'sữa', emoji: '🥛' }, { word: 'trứng', emoji: '🥚' }, { word: 'đèn', emoji: '💡' },
  { word: 'sách', emoji: '📖' }, { word: 'bút', emoji: '✏️' }, { word: 'mũ', emoji: '🎩' },
  { word: 'giày', emoji: '👟' },
];

/* ===== Tách tiếng ===== */

// Phụ âm đầu — thử khớp dài trước (ngh trước ng, gh trước g...)
const INITIALS = ['ngh', 'gh', 'kh', 'ng', 'nh', 'ph', 'th', 'tr', 'gi', 'qu', 'ch',
  'b', 'c', 'd', 'đ', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'x'];

// Tên âm khi đánh vần
const SOUND = {
  b: 'bờ', c: 'cờ', ch: 'chờ', d: 'dờ', đ: 'đờ', g: 'gờ', gh: 'gờ', gi: 'giờ',
  h: 'hờ', k: 'ca', kh: 'khờ', l: 'lờ', m: 'mờ', n: 'nờ', ng: 'ngờ', ngh: 'ngờ',
  nh: 'nhờ', p: 'pờ', ph: 'phờ', qu: 'quờ', r: 'rờ', s: 'sờ', t: 'tờ', th: 'thờ',
  tr: 'trờ', v: 'vờ', x: 'xờ',
};

const TONE_NAMES = { '̀': 'huyền', '́': 'sắc', '̃': 'ngã', '̉': 'hỏi', '̣': 'nặng' };
const TONE_RE = /[̣̀́̃̉]/;

/** Tách phụ âm đầu + vần (vần còn nguyên thanh). "trăng" → {initial:'tr', rim:'ăng'} */
export function splitSyllable(word) {
  const w = word.toLowerCase();
  // "gi" đặc biệt: "giày" = gi + ày, nhưng "gà" = g + à
  for (const ini of INITIALS) {
    if (w.startsWith(ini) && w.length > ini.length) {
      return { initial: ini, rim: w.slice(ini.length) };
    }
  }
  return { initial: '', rim: w };
}

/** Bỏ thanh: "ằng" → {tone:'huyền', base:'ăng'}; không thanh → tone null. */
export function stripTone(s) {
  const nfd = s.normalize('NFD');
  const m = nfd.match(TONE_RE);
  return {
    tone: m ? TONE_NAMES[m[0]] : null,
    base: nfd.replace(TONE_RE, '').normalize('NFC'),
  };
}

/**
 * Câu đánh vần lớp 1. "bò" → ['bờ','o','bo','huyền','bò']; "ba" → ['bờ','a','ba'];
 * tiếng không phụ âm đầu ("ong") → đọc cả tiếng.
 */
export function spellParts(word) {
  const { initial, rim } = splitSyllable(word);
  if (!initial) return [word];
  const { tone, base } = stripTone(rim);
  const noTone = initial + base;
  const parts = [SOUND[initial], base, noTone];
  if (tone) {
    parts.push(tone, word.toLowerCase());
  }
  return parts;
}

/* ===== Sinh câu hỏi ===== */

function shuffle(arr, rng = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const pick = (arr, n, rng) => shuffle(arr, rng).slice(0, n);

/**
 * Ghép vần: giấu phụ âm đầu hoặc vần, chọn mảnh đúng trong 4 thẻ.
 * @returns {{item, hide:'initial'|'rim', shown:string, answer:string, options:string[]}}
 */
export function makeGhepVan(items, rng = Math.random, forceHide = null) {
  const withInitial = items.filter((it) => splitSyllable(it.word).initial);
  const item = pick(withInitial, 1, rng)[0];
  const { initial, rim } = splitSyllable(item.word);
  const hide = forceHide || (rng() < 0.5 ? 'initial' : 'rim');
  const answer = hide === 'initial' ? initial : rim;
  const pool = new Set();
  for (const other of shuffle(withInitial, rng)) {
    const p = splitSyllable(other.word);
    const cand = hide === 'initial' ? p.initial : p.rim;
    if (cand !== answer) pool.add(cand);
    if (pool.size >= 3) break;
  }
  return {
    item,
    hide,
    shown: hide === 'initial' ? rim : initial,
    answer,
    options: shuffle([answer, ...pool], rng),
  };
}

// Nhóm chữ dễ lẫn cho trò điền chữ
export const CONFUSABLE = [
  ['o', 'ô', 'ơ'], ['a', 'ă', 'â'], ['e', 'ê', 'o'], ['u', 'ư', 'ô'],
  ['d', 'đ', 'b'], ['s', 'x', 'ch'], ['n', 'm', 'nh'], ['t', 'th', 'tr'],
];

/**
 * Điền chữ còn thiếu: giấu 1 chữ cái thuộc nhóm dễ lẫn, chọn trong 3 đáp án.
 * @returns {{item, display:string, answer:string, options:string[]}|null}
 */
export function makeDienChu(items, rng = Math.random) {
  for (const item of shuffle(items, rng)) {
    const chars = [...item.word.toLowerCase()];
    const spots = [];
    chars.forEach((chr, i) => {
      const group = CONFUSABLE.find((grp) => grp[0] === chr); // chỉ giấu chữ "gốc" của nhóm
      if (group) spots.push({ i, group });
    });
    if (!spots.length) continue;
    const spot = pick(spots, 1, rng)[0];
    const answer = chars[spot.i];
    const display = chars.map((chr, i) => (i === spot.i ? '_' : chr)).join('').toUpperCase();
    return { item, display, answer, options: shuffle(spot.group, rng) };
  }
  return null;
}

/**
 * Nghe – viết: đọc từ, bé gõ lại từng chữ trên bàn phím rút gọn.
 * @returns {{item, letters:string[], keys:string[]}}
 */
export function makeNgheViet(items, rng = Math.random, maxLen = 5) {
  const easy = items.filter((it) => [...it.word].length <= maxLen);
  const item = pick(easy, 1, rng)[0];
  const letters = [...item.word.toUpperCase()];
  const decoyPool = 'AĂÂBCDĐEÊGHIKLMNOÔƠPQRSTUƯVXY'.split('').filter((c) => !letters.includes(c));
  const keys = shuffle([...new Set(letters), ...pick(decoyPool, 3, rng)], rng);
  return { item, letters, keys };
}
