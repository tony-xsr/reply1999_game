// Logic Cờ ca-rô — thuần, test được.
// 3×3 = tic-tac-toe (3 thẳng hàng), 9×9 = ca-rô giấy vở (5 thẳng hàng).

const LINES = [[1, 0], [0, 1], [1, 1], [1, -1]];

export function createBoard(n) {
  return Array(n * n).fill(null);
}

/** Tìm người thắng: dãy k quân liên tiếp. @returns {player, line:[idx...]} | 'draw' | null */
export function winner(cells, n, k) {
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const p = cells[y * n + x];
      if (!p) continue;
      for (const [dx, dy] of LINES) {
        const line = [];
        for (let i = 0; i < k; i++) {
          const cx = x + dx * i;
          const cy = y + dy * i;
          if (cx < 0 || cx >= n || cy < 0 || cy >= n) break;
          if (cells[cy * n + cx] !== p) break;
          line.push(cy * n + cx);
        }
        if (line.length === k) return { player: p, line };
      }
    }
  }
  return cells.every(Boolean) ? 'draw' : null;
}

/** Nước này có thắng ngay không? */
function winsAt(cells, n, k, idx, player) {
  cells[idx] = player;
  const w = winner(cells, n, k);
  cells[idx] = null;
  return w && w !== 'draw' && w.player === player;
}

/** Điểm heuristic 1 ô: tổng dãy liên tiếp của player quanh ô theo 4 hướng. */
function cellScore(cells, n, idx, player) {
  const x = idx % n;
  const y = Math.floor(idx / n);
  let score = 0;
  for (const [dx, dy] of LINES) {
    let run = 0;
    for (const sign of [1, -1]) {
      for (let i = 1; i < 5; i++) {
        const cx = x + dx * i * sign;
        const cy = y + dy * i * sign;
        if (cx < 0 || cx >= n || cy < 0 || cy >= n) break;
        if (cells[cy * n + cx] !== player) break;
        run++;
      }
    }
    score += run * run;
  }
  return score;
}

/**
 * Nước đi của máy (đủ thông minh để vui, đủ "hiền" để bé thắng được):
 * 1) thắng ngay nếu có; 2) chặn đối thủ sắp thắng;
 * 3) chấm điểm ô trống theo dãy của cả 2 bên (ưu tiên gần quân + giữa bàn).
 */
export function aiMove(cells, n, k, ai, human, rng = Math.random) {
  const empties = [];
  for (let i = 0; i < cells.length; i++) if (!cells[i]) empties.push(i);
  if (!empties.length) return -1;

  for (const i of empties) if (winsAt(cells, n, k, i, ai)) return i;
  for (const i of empties) if (winsAt(cells, n, k, i, human)) return i;

  const mid = (n - 1) / 2;
  let best = [];
  let bestScore = -Infinity;
  for (const i of empties) {
    const centerBias = -(Math.abs((i % n) - mid) + Math.abs(Math.floor(i / n) - mid)) * 0.3;
    const score = cellScore(cells, n, i, ai) * 1.1 + cellScore(cells, n, i, human) + centerBias;
    if (score > bestScore + 1e-9) { bestScore = score; best = [i]; }
    else if (Math.abs(score - bestScore) < 1e-9) best.push(i);
  }
  return best[Math.floor(rng() * best.length)];
}
