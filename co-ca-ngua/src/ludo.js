// Logic Cờ Cá Ngựa (Ludo) — thuần, test được.
// Vòng 52 ô trên lưới 15×15; mỗi ngựa đi 51 ô vòng + 5 ô cầu thang + 1 ô đích (p=56).
// Gieo 6 mới được ra chuồng; 6 hoặc đá ngựa được đi thêm lượt; về đích phải ĐÚNG bước.

export const COLORS = ['r', 'g', 'y', 'b'];
export const COLOR_INFO = {
  r: { name: 'Đỏ', emoji: '🔴', hex: '#d84343' },
  g: { name: 'Xanh lá', emoji: '🟢', hex: '#3d9e4e' },
  y: { name: 'Vàng', emoji: '🟡', hex: '#d9a520' },
  b: { name: 'Xanh dương', emoji: '🔵', hex: '#3f74d1' },
};

// Vòng chạy 52 ô [hàng, cột] theo chiều kim đồng hồ, ô 0 = cửa ra của Đỏ
export const RING = [
  [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
  [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],
  [0, 7], [0, 8],
  [1, 8], [2, 8], [3, 8], [4, 8], [5, 8],
  [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14],
  [7, 14], [8, 14],
  [8, 13], [8, 12], [8, 11], [8, 10], [8, 9],
  [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8],
  [14, 7], [14, 6],
  [13, 6], [12, 6], [11, 6], [10, 6], [9, 6],
  [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0],
  [7, 0], [6, 0],
];

export const STARTS = { r: 0, g: 13, y: 26, b: 39 };

// Cầu thang về đích (5 ô) của từng màu
export const HOME_PATH = {
  r: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]],
  g: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]],
  y: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9]],
  b: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]],
};

// Chỗ đậu trong chuồng (4 góc)
export const STABLE_SPOTS = {
  r: [[2, 2], [2, 3], [3, 2], [3, 3]],
  g: [[2, 11], [2, 12], [3, 11], [3, 12]],
  y: [[11, 11], [11, 12], [12, 11], [12, 12]],
  b: [[11, 2], [11, 3], [12, 2], [12, 3]],
};

export const GOAL = 56;    // p = 56 là về đích
const RING_END = 50;       // p ≤ 50 còn trên vòng chạy

/** Ô tuyệt đối trên vòng của ngựa (chỉ khi p ≤ 50). */
export const ringIndex = (color, p) => (STARTS[color] + p) % 52;

/** Ô [hàng, cột] hiện tại của 1 con ngựa (null nếu trong chuồng). */
export function cellOf(color, p, pieceIdx = 0) {
  if (p < 0) return STABLE_SPOTS[color][pieceIdx];
  if (p <= RING_END) return RING[ringIndex(color, p)];
  if (p < GOAL) return HOME_PATH[color][p - RING_END - 1];
  return [7, 7];
}

const SAFE_CELLS = new Set(Object.values(STARTS).map((s) => s)); // 4 ô cửa ra là ô an toàn

/**
 * @param {{color, ai}[]} configs
 */
export function createLudo(configs) {
  return {
    players: configs.map(({ color, ai }) => ({ color, ai, pieces: [-1, -1, -1, -1] })),
    turn: 0,
    winner: null,
  };
}

export const rollDie = (rng = Math.random) => 1 + Math.floor(rng() * 6);

/** Các con ngựa đi được với nước gieo này. */
export function legalPieces(state, roll) {
  const player = state.players[state.turn];
  const legal = [];
  player.pieces.forEach((p, i) => {
    if (p === GOAL) return;
    if (p === -1) {
      if (roll === 6) legal.push(i);
      return;
    }
    if (p + roll <= GOAL) legal.push(i); // vào đích phải vừa ĐÚNG bước
  });
  return legal;
}

/**
 * Đi 1 con ngựa. @returns {{captured:{player:number,piece:number}[], extra:boolean, finished:boolean}}
 */
export function applyMove(state, pieceIdx, roll) {
  const player = state.players[state.turn];
  const p0 = player.pieces[pieceIdx];
  const p1 = p0 === -1 ? 0 : p0 + roll;
  player.pieces[pieceIdx] = p1;

  // Đá ngựa: đè lên ngựa địch trên vòng chạy (trừ ô cửa ra an toàn)
  const captured = [];
  if (p1 <= RING_END) {
    const abs = ringIndex(player.color, p1);
    if (!SAFE_CELLS.has(abs)) {
      state.players.forEach((other, oi) => {
        if (oi === state.turn) return;
        other.pieces.forEach((op, opi) => {
          if (op >= 0 && op <= RING_END && ringIndex(other.color, op) === abs) {
            other.pieces[opi] = -1;
            captured.push({ player: oi, piece: opi });
          }
        });
      });
    }
  }

  const finished = player.pieces.every((p) => p === GOAL);
  if (finished) state.winner = state.turn;
  const extra = !finished && (roll === 6 || captured.length > 0);
  if (!extra && !finished) state.turn = (state.turn + 1) % state.players.length;
  return { captured, extra, finished };
}

/** Hết nước đi → sang lượt người kế. */
export function passTurn(state) {
  state.turn = (state.turn + 1) % state.players.length;
}

/** Máy chọn ngựa: đá được > vào đích > ra chuồng > tiến xa nhất. */
export function aiPick(state, roll, legal, rng = Math.random) {
  const player = state.players[state.turn];
  let best = [];
  let bestScore = -Infinity;
  for (const i of legal) {
    const clone = structuredClone(state);
    const r = applyMove(clone, i, roll);
    const p1 = clone.players[state.turn].pieces[i];
    let score = r.captured.length * 100 + p1;
    if (p1 === GOAL) score += 60;
    if (player.pieces[i] === -1) score += 30;
    if (score > bestScore + 1e-9) { bestScore = score; best = [i]; }
    else if (Math.abs(score - bestScore) < 1e-9) best.push(i);
  }
  return best[Math.floor(rng() * best.length)];
}
