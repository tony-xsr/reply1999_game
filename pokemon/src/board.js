// Sinh bàn chơi, xáo trộn, xóa cặp — logic thuần không dính DOM.

import { findAnyMove } from './pathfinder.js';

export const ROWS = 9;
export const COLS = 16;

// 3 bộ icon, mỗi bộ 36 loại — chọn trong menu (lưu localStorage)
export const ICON_SETS = {
  animals: [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
    '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆',
    '🦅', '🦉', '🐴', '🦄', '🐝', '🦋', '🐌', '🐢', '🐍', '🦎',
    '🐙', '🦀', '🐠', '🐬', '🐳', '🐘',
  ],
  fruits: [
    '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑',
    '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥒', '🌽',
    '🥕', '🥔', '🍠', '🥐', '🍞', '🥨', '🧀', '🍄', '🌰', '🍯',
    '🍪', '🍩', '🍰', '🧁', '🍭', '🍬',
  ],
  faces: [
    '😀', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
    '😘', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫',
    '🤔', '🤐', '😐', '😏', '😴', '🤠', '🥳', '😎', '🤓', '🧐',
    '😲', '😱', '😡', '🥶', '🥵', '🤖',
  ],
  // 36 icon Pokémon (ảnh PNG trong images/ — renderer nhận diện qua đuôi .png)
  pokemon: [
    'images/trimmed/pm0025_00_00_00_big.png', // Pikachu
    'images/trimmed/pm0001_00_00_00_big.png', // Bulbasaur
    'images/trimmed/pm0004_00_00_00_big.png', // Charmander
    'images/trimmed/pm0007_00_00_00_big.png', // Squirtle
    'images/trimmed/pm0006_00_00_00_big.png', // Charizard
    'images/trimmed/pm0009_00_00_00_big.png', // Blastoise
    'images/trimmed/pm0003_00_00_00_big.png', // Venusaur
    'images/trimmed/pm0133_00_00_00_big.png', // Eevee
    'images/trimmed/pm0039_00_00_00_big.png', // Jigglypuff
    'images/trimmed/pm0052_00_00_00_big.png', // Meowth
    'images/trimmed/pm0054_00_00_00_big.png', // Psyduck
    'images/trimmed/pm0094_00_00_00_big.png', // Gengar
    'images/trimmed/pm0143_00_00_00_big.png', // Snorlax
    'images/trimmed/pm0131_00_00_00_big.png', // Lapras
    'images/trimmed/pm0130_00_00_00_big.png', // Gyarados
    'images/trimmed/pm0129_00_00_00_big.png', // Magikarp
    'images/trimmed/pm0150_00_00_00_big.png', // Mewtwo
    'images/trimmed/pm0151_00_00_00_big.png', // Mew
    'images/trimmed/pm0149_00_00_00_big.png', // Dragonite
    'images/trimmed/pm0148_00_00_00_big.png', // Dragonair
    'images/trimmed/pm0058_00_00_00_big.png', // Growlithe
    'images/trimmed/pm0059_00_00_00_big.png', // Arcanine
    'images/trimmed/pm0113_00_00_00_big.png', // Chansey
    'images/trimmed/pm0123_00_00_00_big.png', // Scyther
    'images/trimmed/pm0134_00_00_00_big.png', // Vaporeon
    'images/trimmed/pm0135_00_00_00_big.png', // Jolteon
    'images/trimmed/pm0136_00_00_00_big.png', // Flareon
    'images/trimmed/pm0196_00_00_00_big.png', // Espeon
    'images/trimmed/pm0197_00_00_00_big.png', // Umbreon
    'images/trimmed/pm0035_00_00_00_big.png', // Clefairy
    'images/trimmed/pm0037_00_00_00_big.png', // Vulpix
    'images/trimmed/pm0038_00_00_00_big.png', // Ninetales
    'images/trimmed/pm0026_00_00_00_big.png', // Raichu
    'images/trimmed/pm0448_00_00_00_big.png', // Lucario
    'images/trimmed/pm0445_00_00_00_big.png', // Garchomp
    'images/trimmed/pm0147_00_00_00_big.png', // Dratini
  ],
};

// Bộ TRỘN: 18 emoji động vật + 18 ảnh Pokémon trên cùng một bàn
// (renderer tự nhận diện từng icon là emoji hay ảnh)
ICON_SETS.mix = [
  ...ICON_SETS.animals.slice(0, 18),
  ...ICON_SETS.pokemon.slice(0, 18),
];

/** Icon là ảnh (đường dẫn .png) hay ký tự emoji? */
export function isImageIcon(icon) {
  return typeof icon === 'string' && icon.endsWith('.png');
}

// Bộ mặc định — giữ tương thích với code/test hiện có
export const ICONS = ICON_SETS.animals;

/** RNG có seed (mulberry32) — dùng cho Daily challenge để mọi người chung 1 bàn. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleArray(arr, rng = Math.random) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Sinh bàn rows×cols: mỗi icon xuất hiện theo cặp, xáo trộn,
 * đảm bảo bàn khởi đầu luôn có ít nhất một nước đi.
 * @returns {(number|null)[][]} ma trận chỉ số icon
 */
export function generateBoard(rows = ROWS, cols = COLS, typeCount = ICONS.length, rng = Math.random) {
  const total = rows * cols;
  if (total % 2 !== 0) throw new Error('Tổng số ô phải chẵn');

  // Phân bổ đều theo cặp: lặp vòng qua các loại icon
  const values = [];
  let t = 0;
  while (values.length < total) {
    const v = t % typeCount;
    values.push(v, v);
    t++;
  }
  shuffleArray(values, rng);

  const board = [];
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) row.push(values[idx++]);
    board.push(row);
  }

  ensurePlayable(board, rng);
  return board;
}

/**
 * Xáo trộn các ô còn lại trên bàn (giữ nguyên vị trí ô trống).
 */
export function shuffleRemaining(board, rng = Math.random) {
  const positions = [];
  const values = [];
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[0].length; c++) {
      if (board[r][c] != null) {
        positions.push({ r, c });
        values.push(board[r][c]);
      }
    }
  }
  shuffleArray(values, rng);
  positions.forEach((p, i) => { board[p.r][p.c] = values[i]; });
}

/**
 * Đảm bảo bàn có nước đi — nếu bế tắc thì xáo trộn lại (tối đa 200 lần).
 * @returns {boolean} true nếu bàn chơi được
 */
export function ensurePlayable(board, rng = Math.random) {
  for (let tries = 0; tries < 200; tries++) {
    if (findAnyMove(board)) return true;
    shuffleRemaining(board, rng);
  }
  return false;
}

/** Xóa một cặp ô khỏi bàn. */
export function removePair(board, a, b) {
  board[a.r][a.c] = null;
  board[b.r][b.c] = null;
}

/** Số ô còn lại trên bàn. */
export function remainingCount(board) {
  let n = 0;
  for (const row of board) {
    for (const v of row) if (v != null) n++;
  }
  return n;
}
