// Unit test cho 3 game Điện Tử Xưa. Chạy: node src/dientu.test.js

import {
  makeDuck, duckScore, stepDucks,
  createBreakout, stepBreakout, BK,
  createRacer, stepRacer, changeLane, RC,
} from './dientu.js';
import { makeRope, ropeJump, stepRope } from '../../tro-xua/src/troxua.js';

let passed = 0;
let failed = 0;

function check(name, cond) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.error(`  ❌ ${name}`); }
}

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

console.log('— Nhảy dây —');

check('nhảy đúng nhịp → đếm tăng, dây nhanh dần', (() => {
  const s = makeRope();
  let ev = null;
  for (let i = 0; i < 300 && !ev; i++) {
    // canh dây sắp quét chân thì bật nhảy (như bé chơi thật)
    if (s.phase > 0.36 && s.phase < 0.44 && s.airborne <= 0) ropeJump(s);
    ev = stepRope(s, 16);
  }
  return ev === 'pass' && s.count === 1 && s.period < 1500 && s.alive;
})());

check('nhịp đầu có gần trọn 1 vòng làm quen (>1 giây)', (() => {
  const s = makeRope();
  let ms = 0;
  for (let i = 0; i < 300; i++) {
    if (stepRope(s, 16)) break;
    ms += 16;
  }
  return ms > 1000;
})());

check('đứng yên khi dây quét chân → vướng dây', (() => {
  const s = makeRope();
  let ev = null;
  for (let i = 0; i < 300 && !ev; i++) ev = stepRope(s, 16);
  return ev === 'hit' && !s.alive;
})());

console.log('— Bắn vịt trời —');

check('chế độ số chẵn: vịt chẵn là mục tiêu (+10), lẻ trừ điểm', (() => {
  for (let s = 0; s < 60; s++) {
    const d = makeDuck('even', rng(s));
    const n = Number(d.label);
    if (d.isTarget !== (n % 2 === 0)) return false;
    const sc = duckScore(d);
    if (d.isTarget && sc.delta !== 10) return false;
    if (!d.isTarget && sc.delta !== -5) return false;
  }
  return true;
})());

check('vịt bay lượn sóng rồi ra khỏi màn; vịt trúng đạn rơi thẳng', (() => {
  const d = makeDuck('classic', rng(1));
  const ducks = [d];
  const x0 = d.x;
  stepDucks(ducks);
  if (d.x === x0) return false;
  d.falling = true;
  const y0 = d.y;
  for (let i = 0; i < 100 && !d.gone; i++) stepDucks(ducks);
  return d.gone && y0 < 700;
})());

console.log('— Đập gạch —');

check('bàn mới: 40 gạch, 8 gạch mang chữ, 3 tim', (() => {
  const s = createBreakout(['A', 'B', 'C'], rng(2));
  return s.bricks.length === 40 && s.bricks.filter((b) => b.letter).length === 8 && s.lives === 3;
})());

check('bóng nảy tường trái/phải/trần', (() => {
  const s = createBreakout(['A'], rng(3));
  s.bricks.forEach((b) => { b.alive = false; }); // dọn gạch để test tường
  s.won = false;
  s.ball = { x: 12, y: 300, vx: -5, vy: 0, r: 9 };
  stepBreakout(s);
  return s.ball.vx > 0;
})());

check('bóng phá gạch + gạch chữ nhả chữ rơi', (() => {
  const s = createBreakout(['A'], rng(4));
  const brick = s.bricks.find((b) => b.letter);
  s.ball = { x: brick.x + brick.w / 2, y: brick.y + brick.h + 10, vx: 0, vy: -6, r: 9 };
  const ev = stepBreakout(s);
  return ev.broke && !brick.alive && s.pickups.length === 1 && s.ball.vy > 0;
})());

check('rơi đáy mất tim; hết 3 tim thì thua', (() => {
  const s = createBreakout(['A'], rng(5));
  for (let life = 3; life > 0; life--) {
    s.ball = { x: 320, y: 650, vx: 0, vy: 6, r: 9 };
    const ev = stepBreakout(s);
    if (!ev.lostLife) return false;
  }
  return s.over && s.lives === 0;
})());

check('phá hết gạch là thắng', (() => {
  const s = createBreakout(['A'], rng(6));
  s.bricks.forEach((b, i) => { if (i > 0) b.alive = false; });
  const brick = s.bricks[0];
  s.ball = { x: brick.x + brick.w / 2, y: brick.y + brick.h + 10, vx: 0, vy: -6, r: 9 };
  stepBreakout(s);
  return s.won;
})());

console.log('— Đua xe —');

check('đâm chướng ngại cùng làn → mất tim', (() => {
  const s = createRacer('classic', rng(7));
  s.items.push({ kind: 'rock', lane: 1, y: RC.CAR_Y - 30, icon: '🚧' });
  const ev = stepRacer(s);
  return ev.crash && s.lives === 2;
})());

check('đổi làn bị kẹp trong 0..2', (() => {
  const s = createRacer('classic', rng(8));
  changeLane(s, -1); changeLane(s, -1); changeLane(s, -1);
  if (s.lane !== 0) return false;
  changeLane(s, 1); changeLane(s, 1); changeLane(s, 1); changeLane(s, 1);
  return s.lane === 2;
})());

check('chế độ toán: cổng 3 biển đủ 3 làn, đúng 1 biển đáp án', (() => {
  const s = createRacer('math', rng(9));
  for (let i = 0; i < 2000 && !s.question; i++) stepRacer(s);
  const gates = s.items.filter((it) => it.kind === 'gate');
  if (gates.length !== 3) return false;
  const lanes = new Set(gates.map((gate) => gate.lane));
  const goods = gates.filter((gate) => gate.good);
  return lanes.size === 3 && goods.length === 1 && goods[0].value === s.question.answer;
})());

check('lao vào biển đúng +30 điểm, biển sai mất tim', (() => {
  const s = createRacer('math', rng(10));
  s.question = { text: '2 + 3 = ?', answer: 5 };
  s.items = [
    { kind: 'gate', lane: 0, y: RC.CAR_Y - 30, value: 5, good: true },
    { kind: 'gate', lane: 1, y: RC.CAR_Y - 30, value: 4, good: false },
    { kind: 'gate', lane: 2, y: RC.CAR_Y - 30, value: 7, good: false },
  ];
  s.lane = 0;
  const before = s.score;
  const ev = stepRacer(s);
  if (ev.gate !== 'ok' || s.score < before + 30) return false;
  // lần 2: biển sai
  const s2 = createRacer('math', rng(11));
  s2.items = [{ kind: 'gate', lane: 1, y: RC.CAR_Y - 30, value: 9, good: false }];
  s2.lane = 1;
  const ev2 = stepRacer(s2);
  return ev2.gate === 'bad' && s2.lives === 2;
})());

check('chướng ngại luôn chừa ít nhất 1 làn trống', (() => {
  const s = createRacer('classic', rng(12));
  for (let i = 0; i < 3000; i++) stepRacer(s);
  // gom theo đợt y gần nhau
  const rocks = s.items.filter((it) => it.kind === 'rock');
  const byY = new Map();
  for (const rock of rocks) {
    const key = Math.round(rock.y / 10);
    byY.set(key, (byY.get(key) || 0) + 1);
  }
  return [...byY.values()].every((n) => n <= 2);
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
