// Logic Ô Ăn Quan — thuần, test được.
//
// Bàn 12 ô xếp vòng tròn: ô 0 = QUAN trái, ô 1..5 = dân của người chơi A (hàng dưới),
// ô 6 = QUAN phải, ô 7..11 = dân của người chơi B (hàng trên).
// Khởi đầu: mỗi ô dân 5 quân; mỗi ô quan có 1 QUAN (giá trị 10 điểm) + 0 dân.
//
// Luật (bản phổ thông):
//  - Tới lượt: chọn 1 ô dân CỦA MÌNH còn quân + hướng đi, bốc hết rải từng quân.
//  - Rải xong: ô kế tiếp còn quân (ô dân) → bốc tiếp rải tiếp.
//  - Ô kế tiếp TRỐNG mà ô liền sau có quân → ăn ô đó (ăn cả quan nếu là ô quan);
//    sau đó nếu lại gặp cặp (trống, có quân) → ăn chuỗi tiếp.
//  - Ô kế tiếp trống + ô sau cũng trống, hoặc ô kế tiếp là ô quan → mất lượt.
//  - Đầu lượt mà 5 ô của mình đều trống → phải rải lại 5 quân từ điểm của mình
//    (mỗi ô 1 quân); không đủ 5 điểm → hết cờ.
//  - Cả 2 quan bị ăn → tàn cuộc: "hết quan, tàn dân" — dân còn trên hàng ai người ấy hưởng.

export const QUAN_VALUE = 10;
const QUAN_CELLS = [0, 6];
export const SIDES = { A: [1, 2, 3, 4, 5], B: [7, 8, 9, 10, 11] };

export function createGame() {
  const stones = Array(12).fill(5);
  stones[0] = 0;
  stones[6] = 0;
  return {
    stones,                 // số dân trong từng ô
    quan: [true, true],     // quan trái (ô 0) / phải (ô 6) còn trên bàn?
    scores: { A: 0, B: 0 },
    turn: 'A',
    finished: false,
  };
}

export const isQuanCell = (i) => QUAN_CELLS.includes(i);
const quanIdx = (cell) => (cell === 0 ? 0 : 1);
const next = (i, dir) => (i + dir + 12) % 12;

/** Các nước đi hợp lệ của người chơi hiện tại. */
export function legalMoves(game) {
  return SIDES[game.turn]
    .filter((c) => game.stones[c] > 0)
    .flatMap((c) => [{ cell: c, dir: 1 }, { cell: c, dir: -1 }]);
}

/**
 * Đi 1 nước: rải từ ô cell theo hướng dir (+1/-1).
 * @returns {{captures:{cell:number, gained:number}[], path:number[]}} để app vẽ animation
 */
export function play(game, cell, dir) {
  if (game.finished || !SIDES[game.turn].includes(cell) || game.stones[cell] === 0) return null;
  const path = [];
  const captures = [];
  let hand = game.stones[cell];
  game.stones[cell] = 0;
  let cur = cell;

  for (;;) {
    // Rải hết quân trên tay
    while (hand > 0) {
      cur = next(cur, dir);
      game.stones[cur]++;
      hand--;
      path.push(cur);
    }
    const n1 = next(cur, dir);
    // Ô kế là ô quan → mất lượt
    if (isQuanCell(n1)) break;
    // Ô kế còn quân → bốc rải tiếp
    if (game.stones[n1] > 0) {
      hand = game.stones[n1];
      game.stones[n1] = 0;
      cur = n1;
      path.push(-n1 - 1); // đánh dấu "bốc" cho animation (số âm)
      continue;
    }
    // Ô kế trống → xét ăn chuỗi
    let eatAt = next(n1, dir);
    while (true) {
      const quanHere = isQuanCell(eatAt) && game.quan[quanIdx(eatAt)];
      if (game.stones[eatAt] === 0 && !quanHere) break; // ô sau cũng trống → thôi
      let gained = game.stones[eatAt];
      game.stones[eatAt] = 0;
      if (quanHere) {
        game.quan[quanIdx(eatAt)] = false;
        gained += QUAN_VALUE;
      }
      game.scores[game.turn] += gained;
      captures.push({ cell: eatAt, gained });
      const gap = next(eatAt, dir);
      if (game.stones[gap] > 0 || isQuanCell(gap)) break; // không còn cặp (trống, có quân)
      eatAt = next(gap, dir);
    }
    break;
  }

  endOrPass(game);
  return { captures, path };
}

/** Chuyển lượt + xử lý tàn cuộc / rải lại dân. */
function endOrPass(game) {
  // Hết cả 2 quan → tàn cuộc: dân bên nào bên ấy hưởng
  if (!game.quan[0] && !game.quan[1]) {
    for (const side of ['A', 'B']) {
      for (const c of SIDES[side]) {
        game.scores[side] += game.stones[c];
        game.stones[c] = 0;
      }
    }
    game.finished = true;
    return;
  }
  game.turn = game.turn === 'A' ? 'B' : 'A';
  // Hàng trống → rải lại 5 quân từ điểm; không đủ → hết cờ
  if (SIDES[game.turn].every((c) => game.stones[c] === 0)) {
    if (game.scores[game.turn] >= 5) {
      game.scores[game.turn] -= 5;
      for (const c of SIDES[game.turn]) game.stones[c] = 1;
    } else {
      game.finished = true;
    }
  }
}

/** Máy chọn nước: thử hết nước đi, lấy nước ăn được nhiều điểm nhất. */
export function aiMove(game, rng = Math.random) {
  const moves = legalMoves(game);
  if (!moves.length) return null;
  let best = [];
  let bestGain = -1;
  for (const mv of moves) {
    const clone = structuredClone(game);
    const r = play(clone, mv.cell, mv.dir);
    const gain = clone.scores[game.turn] - game.scores[game.turn]
      - (r?.captures.length ? 0 : 0.1); // ưu tiên nước có ăn
    if (gain > bestGain + 1e-9) { bestGain = gain; best = [mv]; }
    else if (Math.abs(gain - bestGain) < 1e-9) best.push(mv);
  }
  return best[Math.floor(rng() * best.length)];
}

/** Tổng điểm + quân trên bàn phải luôn = 70 (bảo toàn — dùng cho test). */
export function totalValue(game) {
  return game.stones.reduce((a, b) => a + b, 0)
    + game.scores.A + game.scores.B
    + (game.quan[0] ? QUAN_VALUE : 0) + (game.quan[1] ? QUAN_VALUE : 0);
}
