// Unit test cho Kim Cương Lấp Lánh. Chạy: node src/kimcuong.test.js

import {
  SIZES, MAX_PAIRS, generatePaths, makeGame, endpointAt, pathAt,
  startPath, extendPath, connectedCount,
} from './kimcuong.js';

let passed = 0;
let failed = 0;

function check(name, cond) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.error(`  ❌ ${name}`); }
}

function seeded(seed = 1) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
}

function adjacent(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 1;
}

console.log('— Sinh màn (chia kín bàn thành các đường) —');

check('phủ kín bàn: mỗi ô thuộc đúng 1 đường, không sót không trùng', (() => {
  for (const seed of [1, 7, 42]) {
    for (const size of [4, 5, 6]) {
      const paths = generatePaths(size, seeded(seed));
      const seen = new Set(paths.flat().map(([r, c]) => r * size + c));
      if (seen.size !== size * size) return false;
      if (paths.flat().length !== size * size) return false;
    }
  }
  return true;
})());

check('mỗi đường dài ≥3 ô và các ô liên tiếp phải kề nhau', (() => {
  for (const seed of [1, 7, 42]) {
    const paths = generatePaths(6, seeded(seed));
    for (const p of paths) {
      if (p.length < 3) return false;
      for (let k = 1; k < p.length; k++) if (!adjacent(p[k - 1], p[k])) return false;
    }
  }
  return true;
})());

check('số cặp không vượt quá bảng màu (MAX_PAIRS)', (() => {
  for (const seed of [1, 7, 42, 99]) {
    if (generatePaths(6, seeded(seed)).length > MAX_PAIRS) return false;
  }
  return true;
})());

console.log('— Khởi tạo game —');

check('màn 0 dùng bàn nhỏ nhất, kim cương đặt đúng 2 đầu mỗi đường lời giải', (() => {
  const g = makeGame(0, seeded());
  return g.size === SIZES[0] && !g.won
    && g.pairs.every((p, i) => {
      const sol = g.solution[i];
      return p.a === sol[0] && p.b === sol[sol.length - 1];
    })
    && g.paths.every((p) => p.length === 0);
})());

check('màn rất cao vẫn chặn trần kích thước bàn', (() => {
  const g = makeGame(99, seeded());
  return g.size === SIZES[SIZES.length - 1];
})());

console.log('— Bắt đầu vẽ (startPath) —');

check('chạm viên kim cương → bắt đầu đường mới của đúng cặp đó', (() => {
  const g = makeGame(0, seeded());
  const [r, c] = g.pairs[0].a;
  const i = startPath(g, r, c);
  return i === 0 && g.paths[0].length === 1 && g.paths[0][0][0] === r && g.paths[0][0][1] === c;
})());

check('chạm ô trống (không kim cương, không đường) → không bắt đầu được', (() => {
  const g = makeGame(0, seeded());
  // tìm 1 ô không phải endpoint của cặp nào
  for (let r = 0; r < g.size; r++) {
    for (let c = 0; c < g.size; c++) {
      if (endpointAt(g, r, c) === -1) return startPath(g, r, c) === -1;
    }
  }
  return false;
})());

check('chạm giữa đường đã vẽ → cắt ngắn đường tới đúng ô đó', (() => {
  const g = makeGame(0, seeded());
  const sol = g.solution[0];
  startPath(g, sol[0][0], sol[0][1]);
  for (let k = 1; k < sol.length - 1; k++) extendPath(g, 0, sol[k][0], sol[k][1]);
  const mid = sol[1];
  const i = startPath(g, mid[0], mid[1]);
  return i === 0 && g.paths[0].length === 2;
})());

console.log('— Kéo dài đường (extendPath) —');

check('kéo theo đúng lời giải: từng bước hợp lệ, tới viên còn lại thì cặp hoàn thành', (() => {
  const g = makeGame(0, seeded());
  const sol = g.solution[0];
  startPath(g, sol[0][0], sol[0][1]);
  for (let k = 1; k < sol.length; k++) {
    if (!extendPath(g, 0, sol[k][0], sol[k][1])) return false;
  }
  return g.done[0] === true && connectedCount(g) === 1;
})());

check('không cho kéo sang ô KHÔNG kề bên (nhảy cóc/đi chéo)', (() => {
  const g = makeGame(0, seeded());
  const [r, c] = g.pairs[0].a;
  startPath(g, r, c);
  const far = [r + 2 < g.size ? r + 2 : r - 2, c];
  const diag = [r + 1 < g.size ? r + 1 : r - 1, c + 1 < g.size ? c + 1 : c - 1];
  return extendPath(g, 0, far[0], far[1]) === false
    && extendPath(g, 0, diag[0], diag[1]) === false;
})());

check('viên kim cương của CẶP KHÁC chắn đường → không đi vào được', (() => {
  const g = makeGame(0, seeded());
  // tìm 1 endpoint cặp j có ô kề là endpoint cặp k ≠ j
  for (let j = 0; j < g.pairs.length; j++) {
    for (const end of [g.pairs[j].a, g.pairs[j].b]) {
      for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
        const r = end[0] + dr;
        const c = end[1] + dc;
        if (r < 0 || c < 0 || r >= g.size || c >= g.size) continue;
        const other = endpointAt(g, r, c);
        if (other !== -1 && other !== j) {
          startPath(g, end[0], end[1]);
          return extendPath(g, j, r, c) === false;
        }
      }
    }
  }
  return true; // màn này không có 2 kim cương khác cặp kề nhau — bỏ qua
})());

check('không được đè lên đường cặp khác đã vẽ', (() => {
  const g = makeGame(0, seeded());
  const sol0 = g.solution[0];
  startPath(g, sol0[0][0], sol0[0][1]);
  for (let k = 1; k < sol0.length; k++) extendPath(g, 0, sol0[k][0], sol0[k][1]);
  // tìm cặp j có endpoint kề với 1 ô GIỮA đường của cặp 0
  for (let j = 1; j < g.pairs.length; j++) {
    for (const end of [g.pairs[j].a, g.pairs[j].b]) {
      for (let k = 1; k < sol0.length - 1; k++) {
        if (Math.abs(end[0] - sol0[k][0]) + Math.abs(end[1] - sol0[k][1]) === 1) {
          startPath(g, end[0], end[1]);
          return extendPath(g, j, sol0[k][0], sol0[k][1]) === false;
        }
      }
    }
  }
  return true; // không có thế cờ như vậy trong màn này — bỏ qua
})());

check('kéo ngược lại ô cũ của chính mình → cắt ngắn đường (đi lùi để sửa)', (() => {
  const g = makeGame(0, seeded());
  const sol = g.solution[0];
  startPath(g, sol[0][0], sol[0][1]);
  extendPath(g, 0, sol[1][0], sol[1][1]);
  extendPath(g, 0, sol[2][0], sol[2][1]);
  const ok = extendPath(g, 0, sol[1][0], sol[1][1]); // lùi về ô thứ 2
  return ok === true && g.paths[0].length === 2 && g.done[0] === false;
})());

console.log('— Thắng màn —');

check('nối đủ MỌI cặp theo lời giải → won=true', (() => {
  const g = makeGame(0, seeded());
  for (let i = 0; i < g.pairs.length; i++) {
    const sol = g.solution[i];
    startPath(g, sol[0][0], sol[0][1]);
    for (let k = 1; k < sol.length; k++) {
      if (!extendPath(g, i, sol[k][0], sol[k][1])) return false;
    }
  }
  return g.won === true && connectedCount(g) === g.pairs.length;
})());

check('đã thắng rồi thì startPath/extendPath không làm gì nữa', (() => {
  const g = makeGame(0, seeded());
  for (let i = 0; i < g.pairs.length; i++) {
    const sol = g.solution[i];
    startPath(g, sol[0][0], sol[0][1]);
    for (let k = 1; k < sol.length; k++) extendPath(g, i, sol[k][0], sol[k][1]);
  }
  const [r, c] = g.pairs[0].a;
  return g.won && startPath(g, r, c) === -1;
})());

check('vẽ lại từ kim cương của cặp ĐÃ nối xong → cặp đó tính lại từ đầu', (() => {
  const g = makeGame(0, seeded());
  const sol = g.solution[0];
  startPath(g, sol[0][0], sol[0][1]);
  for (let k = 1; k < sol.length; k++) extendPath(g, 0, sol[k][0], sol[k][1]);
  startPath(g, sol[0][0], sol[0][1]);
  return g.done[0] === false && g.paths[0].length === 1 && connectedCount(g) === 0;
})());

check('pathAt tìm đúng đường chứa ô, và biết bỏ qua cặp except', (() => {
  const g = makeGame(0, seeded());
  const sol = g.solution[0];
  startPath(g, sol[0][0], sol[0][1]);
  extendPath(g, 0, sol[1][0], sol[1][1]);
  return pathAt(g, sol[1][0], sol[1][1]) === 0
    && pathAt(g, sol[1][0], sol[1][1], 0) === -1;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
