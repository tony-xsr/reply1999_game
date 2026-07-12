// Logic Cờ Gánh (cờ dân gian VN, bàn Alquerque 5×5) — thuần, test được.
//
// - Bàn 25 giao điểm; đường ngang dọc ở mọi điểm, đường CHÉO chỉ ở điểm có (r+c) chẵn.
// - Mỗi bên 8 quân. Đi 1 bước theo đường kẻ tới điểm trống.
// - GÁNH: quân vừa đi đứng giữa 2 quân địch thẳng hàng (2 đầu 1 trục) → 2 quân đó
//   đổi màu; có thể gánh nhiều trục cùng lúc (gánh tư).
// - CHẸT: cụm quân địch dính nhau mà không còn nước đi nào → đổi màu cả cụm.
// - Thắng khi đối thủ hết quân.

export const N = 5;
const idx = (r, c) => r * N + c;
const inBoard = (r, c) => r >= 0 && r < N && c >= 0 && c < N;

const ORTHO = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const DIAG = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

/** Các điểm kề (theo đường kẻ) của giao điểm i. */
export function neighbors(i) {
  const r = Math.floor(i / N);
  const c = i % N;
  const dirs = (r + c) % 2 === 0 ? [...ORTHO, ...DIAG] : ORTHO;
  return dirs
    .map(([dr, dc]) => [r + dr, c + dc])
    .filter(([nr, nc]) => inBoard(nr, nc))
    .map(([nr, nc]) => idx(nr, nc));
}

/** Bàn khởi đầu: Xanh (b) chiếm phía trên, Đỏ (r) phía dưới, mỗi bên 8 quân. */
export function createGame() {
  const cells = Array(N * N).fill(null);
  for (let c = 0; c < N; c++) { cells[idx(0, c)] = 'b'; cells[idx(4, c)] = 'r'; }
  cells[idx(1, 0)] = 'b'; cells[idx(1, 4)] = 'b'; cells[idx(2, 0)] = 'b';
  cells[idx(3, 0)] = 'r'; cells[idx(3, 4)] = 'r'; cells[idx(2, 4)] = 'r';
  return { cells, turn: 'r', winner: null };
}

export const count = (game, player) => game.cells.filter((v) => v === player).length;

/** Mọi nước đi hợp lệ của người chơi. */
export function legalMoves(game, player = game.turn) {
  const moves = [];
  game.cells.forEach((v, i) => {
    if (v !== player) return;
    for (const to of neighbors(i)) {
      if (game.cells[to] === null) moves.push({ from: i, to });
    }
  });
  return moves;
}

/** Các trục qua điểm i (mỗi trục = cặp điểm đối xứng 2 phía, đi theo đường kẻ). */
function axesAt(i) {
  const r = Math.floor(i / N);
  const c = i % N;
  const axes = [];
  // Trục = 1 hướng + hướng ngược lại; điểm lẻ chỉ có 2 trục ngang/dọc
  const use = (r + c) % 2 === 0 ? [[1, 0], [0, 1], [1, 1], [1, -1]] : [[1, 0], [0, 1]];
  for (const [dr, dc] of use) {
    const p1 = [r + dr, c + dc];
    const p2 = [r - dr, c - dc];
    if (inBoard(...p1) && inBoard(...p2)) axes.push([idx(...p1), idx(...p2)]);
  }
  return axes;
}

/** Tìm các cụm quân player dính nhau không còn nước đi (bị chẹt). */
function stuckGroups(game, player) {
  const seen = new Set();
  const groups = [];
  game.cells.forEach((v, i) => {
    if (v !== player || seen.has(i)) return;
    const group = [];
    const queue = [i];
    seen.add(i);
    let canMove = false;
    while (queue.length) {
      const cur = queue.pop();
      group.push(cur);
      for (const nb of neighbors(cur)) {
        if (game.cells[nb] === null) canMove = true;
        else if (game.cells[nb] === player && !seen.has(nb)) {
          seen.add(nb);
          queue.push(nb);
        }
      }
    }
    if (!canMove) groups.push(group);
  });
  return groups;
}

/**
 * Đi quân + xử lý gánh/chẹt/thắng thua.
 * @returns {{flipped:number[]}|null} các quân địch bị đổi màu
 */
export function play(game, from, to) {
  const player = game.turn;
  const enemy = player === 'r' ? 'b' : 'r';
  if (game.winner || game.cells[from] !== player || game.cells[to] !== null) return null;
  if (!neighbors(from).includes(to)) return null;

  game.cells[from] = null;
  game.cells[to] = player;
  const flipped = [];

  // GÁNH: 2 đầu trục qua điểm vừa đứng đều là quân địch
  for (const [p1, p2] of axesAt(to)) {
    if (game.cells[p1] === enemy && game.cells[p2] === enemy) {
      game.cells[p1] = player;
      game.cells[p2] = player;
      flipped.push(p1, p2);
    }
  }
  // CHẸT: cụm địch hết đường đi → đổi màu cả cụm
  for (const group of stuckGroups(game, enemy)) {
    for (const i of group) {
      game.cells[i] = player;
      flipped.push(i);
    }
  }

  if (count(game, enemy) === 0) game.winner = player;
  game.turn = enemy;
  // Đối thủ tới lượt mà không còn nước đi → thua nốt
  if (!game.winner && legalMoves(game).length === 0) game.winner = player;
  return { flipped };
}

/** Máy: thử mọi nước, ưu tiên lật được nhiều quân nhất (né bớt nước bị gánh lại). */
export function aiMove(game, rng = Math.random) {
  const moves = legalMoves(game);
  if (!moves.length) return null;
  const me = game.turn;
  let best = [];
  let bestScore = -Infinity;
  for (const mv of moves) {
    const clone = structuredClone(game);
    const r = play(clone, mv.from, mv.to);
    let score = r.flipped.length * 10;
    if (clone.winner === me) score += 1000;
    // trừ điểm nếu đối thủ có thể gánh lại ngay
    let worst = 0;
    for (const op of legalMoves(clone).slice(0, 24)) {
      const clone2 = structuredClone(clone);
      const r2 = play(clone2, op.from, op.to);
      worst = Math.max(worst, r2 ? r2.flipped.length : 0);
    }
    score -= worst * 6;
    if (score > bestScore + 1e-9) { bestScore = score; best = [mv]; }
    else if (Math.abs(score - bestScore) < 1e-9) best.push(mv);
  }
  return best[Math.floor(rng() * best.length)];
}
