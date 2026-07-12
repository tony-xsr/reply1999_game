// Unit test cho luật Cờ Gánh. Chạy: node src/coganh.test.js

import { createGame, neighbors, legalMoves, play, aiMove, count, N } from './coganh.js';

let passed = 0;
let failed = 0;

function check(name, cond) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.error(`  ❌ ${name}`); }
}

const idx = (r, c) => r * N + c;

console.log('— Cờ Gánh —');

check('bàn mới: mỗi bên 8 quân, Đỏ đi trước', (() => {
  const g = createGame();
  return count(g, 'r') === 8 && count(g, 'b') === 8 && g.turn === 'r' && !g.winner;
})());

check('kề cạnh: điểm chẵn 8 hướng, điểm lẻ 4 hướng, góc 3 hướng', (() => {
  return neighbors(idx(2, 2)).length === 8   // giữa bàn, (2+2) chẵn
    && neighbors(idx(2, 1)).length === 4     // (2+1) lẻ → chỉ ngang dọc
    && neighbors(idx(0, 0)).length === 3;    // góc chẵn: E, S, SE
})());

check('gánh: đứng giữa 2 quân địch thẳng hàng → cả 2 đổi màu', (() => {
  const g = createGame();
  g.cells.fill(null);
  g.cells[idx(2, 1)] = 'b';
  g.cells[idx(2, 3)] = 'b';
  g.cells[idx(3, 2)] = 'r';
  g.cells[idx(4, 4)] = 'b'; // để b còn quân, chưa kết thúc
  g.turn = 'r';
  const r = play(g, idx(3, 2), idx(2, 2)); // đỏ bước vào giữa
  return r.flipped.length === 2 && g.cells[idx(2, 1)] === 'r' && g.cells[idx(2, 3)] === 'r';
})());

check('gánh tư: 2 trục cùng lúc lật 4 quân', (() => {
  const g = createGame();
  g.cells.fill(null);
  g.cells[idx(2, 1)] = 'b'; g.cells[idx(2, 3)] = 'b'; // trục ngang
  g.cells[idx(1, 2)] = 'b'; g.cells[idx(3, 2)] = 'b'; // trục dọc
  g.cells[idx(4, 2)] = 'r';
  g.cells[idx(0, 0)] = 'b';
  g.turn = 'r';
  // (4,2)→(3,2) bị chiếm, đặt đỏ ở (2,2)? phải đi từ điểm kề: dùng (2,2) kề (2,1)?
  // đặt quân đỏ ở (3,3) ((3+3) chẵn → có chéo tới (2,2))
  g.cells[idx(4, 2)] = null;
  g.cells[idx(3, 3)] = 'r';
  const r = play(g, idx(3, 3), idx(2, 2));
  return r.flipped.length === 4;
})());

check('không gánh khi 2 đầu là 1 địch + 1 mình', (() => {
  const g = createGame();
  g.cells.fill(null);
  g.cells[idx(2, 1)] = 'b';
  g.cells[idx(2, 3)] = 'r';
  g.cells[idx(3, 2)] = 'r';
  g.cells[idx(0, 0)] = 'b';
  g.turn = 'r';
  const r = play(g, idx(3, 2), idx(2, 2));
  return r.flipped.length === 0 && g.cells[idx(2, 1)] === 'b';
})());

check('chẹt: cụm địch hết đường đi bị đổi màu cả cụm', (() => {
  const g = createGame();
  g.cells.fill(null);
  // b ở góc (0,0); đỏ chặn (0,1),(1,0) — (1,1) trống là lối thoát chéo duy nhất
  g.cells[idx(0, 0)] = 'b';
  g.cells[idx(0, 1)] = 'r';
  g.cells[idx(1, 0)] = 'r';
  g.cells[idx(4, 4)] = 'b';
  g.cells[idx(2, 2)] = 'r';
  g.turn = 'r';
  const r = play(g, idx(2, 2), idx(1, 1)); // bịt nốt lối chéo → b(0,0) bị chẹt
  return r.flipped.includes(idx(0, 0)) && g.cells[idx(0, 0)] === 'r';
})());

check('thắng khi địch hết quân', (() => {
  const g = createGame();
  g.cells.fill(null);
  g.cells[idx(2, 1)] = 'b';
  g.cells[idx(2, 3)] = 'b';
  g.cells[idx(3, 2)] = 'r';
  g.turn = 'r';
  play(g, idx(3, 2), idx(2, 2));
  return g.winner === 'r';
})());

check('máy chọn nước gánh được quân', (() => {
  const g = createGame();
  g.cells.fill(null);
  g.cells[idx(2, 1)] = 'r'; g.cells[idx(2, 3)] = 'r';
  g.cells[idx(3, 2)] = 'b';
  g.cells[idx(4, 0)] = 'r';
  g.turn = 'b';
  const mv = aiMove(g, () => 0);
  return mv.to === idx(2, 2); // vào giữa để gánh 2 quân đỏ
})());

check('bàn đầu: Đỏ có nước đi hợp lệ', legalMoves(createGame()).length > 0);

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
