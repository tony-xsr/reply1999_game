// Unit test cho Hang Kim Cương Bí Ẩn. Chạy: node src/hangkim.test.js

import {
  START_LIVES, LEVELS, makeLevel, exitOpen, move, tickPhysics,
} from './hangkim.js';

let passed = 0;
let failed = 0;

function check(name, cond) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.error(`  ❌ ${name}`); }
}

/** Màn thử tự dựng — không phụ thuộc thiết kế màn thật. */
function testLevel(rows) {
  const backup = LEVELS[0];
  LEVELS[0] = rows;
  const g = makeLevel(0);
  LEVELS[0] = backup;
  return g;
}

/** Chạy vật lý tới khi mọi thứ đứng yên. */
function settle(g, max = 100) {
  let hurtAny = false;
  for (let i = 0; i < max; i++) {
    const r = tickPhysics(g);
    hurtAny = hurtAny || r.hurt;
    if (!r.moved) break;
  }
  return hurtAny;
}

console.log('— Dựng màn —');

check('4 màn thật: có xuất phát, kim cương, cửa thoát, viền tường kín', (() => {
  for (let i = 0; i < LEVELS.length; i++) {
    const g = makeLevel(i);
    const flat = g.grid.flat();
    if (g.gemsTotal < 1 || !flat.includes('X')) return false;
    // viền 4 cạnh phải toàn tường
    if (!g.grid[0].every((ch) => ch === '#')) return false;
    if (!g.grid[g.rows - 1].every((ch) => ch === '#')) return false;
    for (const row of g.grid) if (row[0] !== '#' || row[g.cols - 1] !== '#') return false;
  }
  return true;
})());

check('mở màn không có gì tự rơi lung tung (đá đều được đất/tường đỡ)', (() => {
  for (let i = 0; i < LEVELS.length; i++) {
    const g = makeLevel(i);
    if (tickPhysics(g).moved) return false;
  }
  return true;
})());

console.log('— Di chuyển & đào —');

check('đào đất: bước vào ô đất → đất biến mất, người đứng đó', (() => {
  const g = testLevel(['#####', '#Sd.#', '#####']);
  const ev = move(g, 'right');
  return ev.moved && ev.dug && g.grid[1][2] === '.' && g.player.c === 2;
})());

check('tường chặn: không đi xuyên được', (() => {
  const g = testLevel(['#####', '#S#.#', '#####']);
  const ev = move(g, 'right');
  return ev.moved === false && g.player.c === 1;
})());

check('nhặt kim cương: đếm giảm, cộng điểm', (() => {
  const g = testLevel(['#####', '#Sg.#', '#####']);
  const ev = move(g, 'right');
  return ev.gem && g.gemsLeft === g.gemsTotal - 1 && g.score === 25;
})());

check('đẩy đá ngang: đá lùi 1 ô, người tiến 1 ô; sau lưng đá bị chặn thì không đẩy được', (() => {
  const g = testLevel(['######', '#Sr..#', '######']);
  const ev = move(g, 'right');
  const blocked = testLevel(['#####', '#Sr##', '#####']);
  const ev2 = blocked.player && move(blocked, 'right');
  return ev.pushed && g.grid[1][3] === 'r' && g.player.c === 2
    && ev2.pushed === false && blocked.player.c === 1;
})());

check('không đẩy đá theo chiều dọc', (() => {
  const g = testLevel(['#####', '#.r.#', '#.S.#', '#...#', '#####']);
  const ev = move(g, 'up');
  return ev.moved === false && g.grid[1][2] === 'r';
})());

console.log('— Vật lý đá rơi —');

check('đào ô dưới đá → đá rơi xuống từng nấc tới khi chạm đáy', (() => {
  const g = testLevel(['#####', '#.r.#', '#.d.#', '#S..#', '#####']);
  // đào ô đất dưới đá bằng cách bước vào rồi bước ra
  move(g, 'right'); // vào (3,2)? S ở (3,1) → right = (3,2) trống
  move(g, 'up'); // vào (2,2) là 'd' → đào
  move(g, 'left'); // né sang (2,1)
  settle(g);
  return g.grid[3][2] === 'r' && g.grid[1][2] === '.';
})());

check('đá ĐANG rơi trúng đầu người → mất mạng, về điểm xuất phát', (() => {
  const g = testLevel(['#####', '#.r.#', '#.d.#', '#.d.#', '#S..#', '#####']);
  move(g, 'right'); // (4,2)
  move(g, 'up'); // đào (3,2)
  tickPhysics(g); // đá chưa rơi được (dưới nó còn 'd' ở (2,2))?? — đào tiếp
  move(g, 'up'); // đào (2,2), người đứng (2,2) ngay dưới đá
  move(g, 'down'); // lùi xuống (3,2) — đá bắt đầu rơi vào (2,2)
  const hurt = settle(g);
  return hurt && g.lives === START_LIVES - 1
    && g.player.r === g.spawn.r && g.player.c === g.spawn.c;
})());

check('đứng YÊN ngay dưới đá đứng yên thì không sao (đá tựa đầu không rơi)', (() => {
  const g = testLevel(['#####', '#.r.#', '#.S.#', '#####']);
  const hurt = settle(g);
  return hurt === false && g.lives === START_LIVES && g.grid[1][2] === 'r';
})());

check('đá chồng trên đá → lăn chéo sang ô trống', (() => {
  const g = testLevel(['#####', '#.r.#', '#.r.#', '#S..#', '#####']);
  settle(g);
  // viên trên phải lăn sang cột 1 hoặc 3 rồi rơi xuống hàng dưới
  const flat = [];
  for (let r = 0; r < g.rows; r++) for (let c = 0; c < g.cols; c++) if (g.grid[r][c] === 'r') flat.push([r, c]);
  return flat.length === 2 && !(flat[0][1] === 2 && flat[1][1] === 2);
})());

check('kim cương cũng rơi như đá — rơi xong vẫn nhặt được', (() => {
  const g = testLevel(['#####', '#.g.#', '#.d.#', '#S..#', '#####']);
  move(g, 'right');
  move(g, 'up'); // đào (2,2)
  move(g, 'down'); // né xuống
  settle(g);
  if (g.grid[3][2] !== 'g') return false;
  const ev = move(g, 'right');
  return ev.gem === true;
})());

console.log('— Cửa thoát & thắng/thua —');

check('cửa khóa khi chưa gom đủ kim cương — bước vào không được', (() => {
  const g = testLevel(['#####', '#SXg#', '#####']);
  const ev = move(g, 'right');
  return ev.moved === false && exitOpen(g) === false;
})());

check('gom đủ kim cương → cửa mở → bước vào là thắng + thưởng theo mạng', (() => {
  const g = testLevel(['#####', '#SgX#', '#####']);
  move(g, 'right'); // nhặt viên cuối
  const ev = move(g, 'right'); // vào cửa
  return exitOpen(g) && ev.won && g.over && g.won
    && g.score === 25 + 50 + START_LIVES * 20;
})());

check('mất hết 3 mạng → thua', (() => {
  const g = testLevel(['#####', '#.r.#', '#.d.#', '#.d.#', '#S..#', '#####']);
  g.lives = 1;
  move(g, 'right');
  move(g, 'up');
  move(g, 'up');
  move(g, 'down');
  settle(g);
  return g.over === true && g.won === false && g.lives === 0;
})());

check('game kết thúc thì move/tickPhysics không làm gì', (() => {
  const g = testLevel(['#####', '#S.g#', '#####']);
  g.over = true;
  const ev = move(g, 'right');
  const r = tickPhysics(g);
  return ev.moved === false && r.moved === false;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
