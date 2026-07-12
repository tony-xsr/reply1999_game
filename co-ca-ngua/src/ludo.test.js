// Unit test cho luật Cờ Cá Ngựa. Chạy: node src/ludo.test.js

import {
  RING, STARTS, HOME_PATH, STABLE_SPOTS, GOAL,
  createLudo, legalPieces, applyMove, aiPick, cellOf, ringIndex, rollDie,
} from './ludo.js';

let passed = 0;
let failed = 0;

function check(name, cond) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.error(`  ❌ ${name}`); }
}

const mk2 = () => createLudo([{ color: 'r', ai: false }, { color: 'y', ai: true }]);

console.log('— Bàn cờ —');

check('vòng chạy đúng 52 ô, không trùng, ô kề chạm nhau (kể cả rẽ chéo ở góc trong)', (() => {
  if (RING.length !== 52) return false;
  if (new Set(RING.map(([r, c]) => `${r},${c}`)).size !== 52) return false;
  for (let i = 0; i < 52; i++) {
    const [r1, c1] = RING[i];
    const [r2, c2] = RING[(i + 1) % 52];
    if (Math.max(Math.abs(r1 - r2), Math.abs(c1 - c2)) !== 1) return false;
  }
  return true;
})());

check('4 cửa ra cách nhau đúng 13 ô', (() => {
  const s = Object.values(STARTS);
  return s[1] - s[0] === 13 && s[2] - s[1] === 13 && s[3] - s[2] === 13;
})());

check('cầu thang 5 ô + chuồng 4 chỗ cho đủ 4 màu', ['r', 'g', 'y', 'b'].every(
  (color) => HOME_PATH[color].length === 5 && STABLE_SPOTS[color].length === 4,
));

check('p=50 của mỗi màu đứng ngay trước cầu thang nhà mình', ['r', 'g', 'y', 'b'].every((color) => {
  const [r, c] = RING[ringIndex(color, 50)];
  const [hr, hc] = HOME_PATH[color][0];
  return Math.abs(r - hr) + Math.abs(c - hc) === 1;
}));

console.log('— Luật chơi —');

check('trong chuồng chỉ ra được khi gieo 6', (() => {
  const g = mk2();
  return legalPieces(g, 5).length === 0 && legalPieces(g, 6).length === 4;
})());

check('gieo 6 ra chuồng → đứng ở cửa ra, được đi thêm lượt', (() => {
  const g = mk2();
  const r = applyMove(g, 0, 6);
  return g.players[0].pieces[0] === 0 && r.extra && g.turn === 0;
})());

check('về đích phải đúng bước: thừa bước thì con đó không đi được', (() => {
  const g = mk2();
  g.players[0].pieces = [54, GOAL, GOAL, GOAL];
  return legalPieces(g, 3).length === 0 // 54+3=57 > 56: kẹt
    && legalPieces(g, 2).length === 1;  // 54+2=56: vừa đúng
})());

check('đá ngựa: đè lên ngựa địch → địch về chuồng + được đi thêm', (() => {
  const g = mk2();
  // ngựa vàng đứng ở ô tuyệt đối = ringIndex(r, 10)
  const target = ringIndex('r', 10);
  const yP = (target - STARTS.y + 52) % 52;
  g.players[0].pieces = [5, -1, -1, -1];
  g.players[1].pieces = [yP, -1, -1, -1];
  const r = applyMove(g, 0, 5); // đỏ 5→10, trúng ngựa vàng
  return r.captured.length === 1 && g.players[1].pieces[0] === -1 && r.extra;
})());

check('ô cửa ra là ô an toàn — không bị đá', (() => {
  const g = mk2();
  const yStartAbs = STARTS.y;
  const rP = (yStartAbs - STARTS.r + 52) % 52; // ngựa đỏ sẽ đứng đúng cửa ra của vàng
  g.players[0].pieces = [rP - 4, -1, -1, -1];
  g.players[1].pieces = [0, -1, -1, -1]; // vàng đậu ở cửa ra của mình
  const r = applyMove(g, 0, 4);
  return r.captured.length === 0 && g.players[1].pieces[0] === 0;
})());

check('đủ 4 ngựa về đích là thắng', (() => {
  const g = mk2();
  g.players[0].pieces = [GOAL, GOAL, GOAL, 53];
  const r = applyMove(g, 3, 3);
  return r.finished && g.winner === 0;
})());

check('máy ưu tiên nước đá ngựa', (() => {
  const g = createLudo([{ color: 'y', ai: true }, { color: 'r', ai: false }]);
  const target = ringIndex('y', 8);
  const rP = (target - STARTS.r + 52) % 52;
  g.players[0].pieces = [5, 20, -1, -1];
  g.players[1].pieces = [rP, -1, -1, -1];
  const pick = aiPick(g, 3, legalPieces(g, 3), () => 0);
  return pick === 0; // con số 0 đi 5→8 đá được ngựa đỏ
})());

check('xúc xắc luôn 1..6', (() => {
  let seed = 7;
  const rng = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  return Array.from({ length: 200 }, () => rollDie(rng)).every((v) => v >= 1 && v <= 6);
})());

check('cellOf: chuồng/vòng/cầu thang/đích', (() => {
  const stable = cellOf('r', -1, 2);
  const ring0 = cellOf('r', 0);
  const home = cellOf('r', 51);
  const goal = cellOf('r', GOAL);
  return stable.join() === STABLE_SPOTS.r[2].join()
    && ring0.join() === RING[STARTS.r].join()
    && home.join() === HOME_PATH.r[0].join()
    && goal.join() === '7,7';
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
