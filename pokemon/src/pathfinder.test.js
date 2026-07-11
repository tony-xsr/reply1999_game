// Unit test nhanh cho pathfinder + mô phỏng chơi hết ván.
// Chạy: node src/pathfinder.test.js (trong thư mục pokemon/)

import { findPath, findAnyMove } from './pathfinder.js';
import { generateBoard, removePair, remainingCount, shuffleRemaining, ensurePlayable, ROWS, COLS } from './board.js';

let passed = 0;
let failed = 0;

function check(name, cond) {
  if (cond) {
    passed++;
    console.log(`  ✅ ${name}`);
  } else {
    failed++;
    console.error(`  ❌ ${name}`);
  }
}

// Dựng bàn từ chuỗi: '.' = trống, chữ cái = loại icon
function makeBoard(lines) {
  return lines.map((line) => [...line].map((ch) => (ch === '.' ? null : ch.charCodeAt(0))));
}

// Đếm số lần rẽ của một đường đi (path gồm các điểm gấp khúc)
function turns(path) {
  return path.length - 2;
}

console.log('— findPath: các ca cơ bản —');

// 1. Nối thẳng kề nhau
{
  const b = makeBoard(['AA']);
  const p = findPath(b, { r: 0, c: 0 }, { r: 0, c: 1 });
  check('thẳng kề nhau', p && turns(p) === 0);
}

// 2. Nối thẳng qua ô trống
{
  const b = makeBoard(['A..A']);
  const p = findPath(b, { r: 0, c: 0 }, { r: 0, c: 3 });
  check('thẳng qua ô trống', p && turns(p) === 0);
}

// 3. Nối thẳng bị chặn → phải vòng (vẫn nối được nhờ vành đai ngoài)
{
  const b = makeBoard(['ABA']);
  const p = findPath(b, { r: 0, c: 0 }, { r: 0, c: 2 });
  check('bị chặn giữa → vòng ra ngoài mép (2 rẽ)', p && turns(p) === 2);
}

// 4. Nối 1 lần rẽ (hình L)
{
  const b = makeBoard([
    'A.',
    '.A',
  ]);
  // (0,0) → phải → xuống (1,1): 1 rẽ
  const p = findPath(b, { r: 0, c: 0 }, { r: 1, c: 1 });
  check('1 lần rẽ (L)', p && turns(p) === 1);
}

// 5. Nối 2 lần rẽ (hình U) — trực tiếp bị chặn, không có đường L
{
  const b = makeBoard([
    'AXA',
    '...',
  ]);
  const p = findPath(b, { r: 0, c: 0 }, { r: 0, c: 2 });
  check('2 lần rẽ (U)', p && turns(p) === 2);
}

// 6. Quá 2 lần rẽ → không nối được
{
  // A ở giữa bị bọc kín hoàn toàn, A kia ở góc
  const b = makeBoard([
    'XXX..',
    'XAX.A',
    'XXX..',
  ]);
  const p = findPath(b, { r: 1, c: 1 }, { r: 1, c: 4 });
  check('bị bọc kín → null', p === null);
}

// 7. Vòng ra ngoài mép bàn
{
  const b = makeBoard([
    'AXA',
    'XXX',
  ]);
  // 2 ô A ở hàng trên, giữa bị chặn, dưới bị chặn → phải vòng lên trên ngoài bàn
  const p = findPath(b, { r: 0, c: 0 }, { r: 0, c: 2 });
  check('vòng ra ngoài mép trên', p && turns(p) === 2 && p.some((pt) => pt.r === -1));
}

// 8. Không được xuyên qua ô có icon
{
  const b = makeBoard([
    'XXXXX',
    'XAXAX',
    'XXXXX',
  ]);
  const p = findPath(b, { r: 1, c: 1 }, { r: 1, c: 3 });
  check('không xuyên qua ô có icon', p === null);
}

// 9. Cùng một ô → null
{
  const b = makeBoard(['AA']);
  check('cùng một ô → null', findPath(b, { r: 0, c: 0 }, { r: 0, c: 0 }) === null);
}

console.log('— findAnyMove & sinh bàn —');

// 10. Bàn sinh ra luôn có nước đi
{
  let ok = true;
  for (let i = 0; i < 20; i++) {
    const b = generateBoard();
    if (!findAnyMove(b)) ok = false;
    // đủ 144 ô, mỗi loại chẵn lần
    const count = new Map();
    for (const row of b) for (const v of row) count.set(v, (count.get(v) || 0) + 1);
    for (const n of count.values()) if (n % 2 !== 0) ok = false;
  }
  check('20 bàn sinh ra đều có nước đi + icon theo cặp', ok);
}

// 11. Bàn bế tắc → findAnyMove trả null
{
  const b = makeBoard([
    'AB',
    'BA',
  ]);
  check('bàn bế tắc → null', findAnyMove(b) === null);
}

console.log('— Mô phỏng chơi hết ván (end-to-end logic) —');

// 12. Chơi tự động đến khi sạch bàn (dùng shuffle khi bế tắc như game thật)
{
  let ok = true;
  for (let g = 0; g < 5; g++) {
    const b = generateBoard();
    let guard = ROWS * COLS + 1000; // đủ cho 72 cặp + các lần shuffle
    let shuffles = 0;
    while (remainingCount(b) > 0 && guard-- > 0) {
      let move = findAnyMove(b);
      if (!move) {
        shuffleRemaining(b);
        if (!ensurePlayable(b)) { ok = false; break; }
        shuffles++;
        if (shuffles > 500) { ok = false; break; }
        continue;
      }
      removePair(b, move.a, move.b);
    }
    if (remainingCount(b) !== 0) ok = false;
  }
  check('5 ván mô phỏng đều chơi đến sạch bàn', ok);
}

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
process.exit(failed ? 1 : 0);
