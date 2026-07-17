// Unit test cho Võ Đài Thú Nhí. Chạy: node src/vodai.test.js

import {
  START_HP, RAGE_MAX, CUE_GAP_MS, CUES, CUE_TYPES, FIGHTERS, FIGHTER_IDS,
  windowFor, makeMatch, tick, act, makeCampaign, advanceCampaign,
} from './vodai.js';

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

/** Chạy tick tới khi tín hiệu mới xuất hiện. */
function waitCue(m, rng) {
  for (let i = 0; i < 400; i++) {
    if (tick(m, 16.67, rng || seeded(i + 1)).cueStart) return m.cue;
  }
  return null;
}

/** Ép tín hiệu theo ý test. */
function forceCue(m, type) {
  m.cue = { type, t: 0, windowMs: windowFor(m.level, m.round) };
  m.gapMs = 0;
  return m.cue;
}

console.log('— Dữ liệu & tín hiệu —');

check('4 bạn thú: đủ tên thường + tên biến hình; 3 loại tín hiệu có nút đúng', (() => {
  return FIGHTER_IDS.length === 4
    && FIGHTER_IDS.every((id) => FIGHTERS[id].name && FIGHTERS[id].bigName)
    && CUE_TYPES.every((c) => ['dam', 'do', 'ne'].includes(CUES[c].correct));
})());

check('cửa sổ phản ứng ngắn dần theo màn/hiệp, có sàn 900ms', (() => {
  return windowFor(0, 0) > windowFor(2, 0) && windowFor(0, 0) > windowFor(0, 2)
    && windowFor(99, 99) === 900;
})());

check('tick đủ lâu thì tín hiệu tự xuất hiện với đủ thông tin', (() => {
  const m = makeMatch('gau', 'tho', 0, 0);
  const cue = waitCue(m);
  return cue && CUE_TYPES.includes(cue.type) && cue.windowMs === windowFor(0, 0);
})());

console.log('— Phản ứng đúng —');

check('sơ hở + ĐẤM → địch mất bông, tích 1 nộ', (() => {
  const m = makeMatch('gau', 'tho', 0, 0);
  forceCue(m, 'open');
  const ev = act(m, 'dam', seeded());
  return ev.result === 'hit' && ev.dmg >= 7 && m.foeHp === START_HP - ev.dmg && m.rage === 1;
})());

check('đòn cao + ĐỠ → chặn được không mất bông; đòn thấp + NÉ → né được', (() => {
  const m = makeMatch('gau', 'tho', 0, 0);
  forceCue(m, 'high');
  const a = act(m, 'do', seeded());
  forceCue(m, 'low');
  const b = act(m, 'ne', seeded());
  return a.result === 'block' && b.result === 'dodge'
    && m.playerHp === START_HP && m.rage === 2;
})());

console.log('— Phản ứng sai / trễ —');

check('bấm sai nút → mình dính đòn + tuột nộ', (() => {
  const m = makeMatch('gau', 'tho', 0, 0);
  m.rage = 2;
  forceCue(m, 'high');
  const ev = act(m, 'dam', seeded()); // địch đấm cao mà mình lao vào đấm
  return ev.result === 'wrong' && m.playerHp < START_HP && m.rage === 1;
})());

check('để lỡ đòn cao/thấp → dính đòn; lỡ sơ hở thì chỉ tuột cơ hội', (() => {
  const m = makeMatch('gau', 'tho', 0, 0);
  forceCue(m, 'high');
  let ev = { foeHit: false };
  for (let i = 0; i < 200 && !ev.late; i++) ev = tick(m, 16.67, seeded(i + 1));
  const hurt = ev.foeHit && m.playerHp < START_HP;
  const hp1 = m.playerHp;
  forceCue(m, 'open');
  ev = { late: false };
  for (let i = 0; i < 200 && !ev.late; i++) ev = tick(m, 16.67, seeded(i + 1));
  return hurt && ev.foeHit === false && m.playerHp === hp1;
})());

check('không có tín hiệu thì bấm nút không có gì xảy ra', (() => {
  const m = makeMatch('gau', 'tho', 0, 0);
  const ev = act(m, 'dam', seeded());
  return ev.result === null && m.foeHp === START_HP;
})());

console.log('— Nộ khí & biến hình —');

check('đủ 5 lần đúng → BIẾN HÌNH: hồi bông + đấm đau GẤP ĐÔI', (() => {
  const m = makeMatch('gau', 'tho', 0, 0);
  m.playerHp = 20;
  let transformed = false;
  for (let i = 0; i < RAGE_MAX; i++) {
    forceCue(m, 'high');
    transformed = act(m, 'do', seeded()).transformed || transformed;
  }
  if (!transformed || !m.transformed || m.playerHp !== 30) return false;
  forceCue(m, 'open');
  const ev = act(m, 'dam', seeded(3));
  return ev.dmg >= 14 && ev.dmg % 2 === 0; // base 7-12 nhân đôi
})());

console.log('— KO & chuỗi trận —');

check('địch hết bông → thắng trận', (() => {
  const m = makeMatch('gau', 'tho', 0, 0);
  m.foeHp = 5;
  forceCue(m, 'open');
  const ev = act(m, 'dam', seeded());
  return ev.ko && m.over && m.won;
})());

check('mình hết bông (bấm sai) → thua trận', (() => {
  const m = makeMatch('gau', 'tho', 0, 0);
  m.playerHp = 3;
  forceCue(m, 'high');
  act(m, 'dam', seeded());
  return m.over === true && m.won === false;
})());

check('chuỗi trận: thắng → hồi 40% bông đấu bạn kế; thắng hết → chuỗi thắng', (() => {
  const c = makeCampaign('gau', 0, seeded());
  if (c.foes.length !== 2 || c.foes.includes('gau')) return false;
  c.match.foeHp = 0; c.match.over = true; c.match.won = true;
  c.match.playerHp = 10;
  const next = advanceCampaign(c);
  if (!next || next.playerHp !== 10 + Math.round(START_HP * 0.4)) return false;
  next.foeHp = 0; next.over = true; next.won = true;
  return advanceCampaign(c) === null && c.over && c.won;
})());

check('thua 1 trận → cả chuỗi thua', (() => {
  const c = makeCampaign('tho', 0, seeded());
  c.match.over = true; c.match.won = false;
  return advanceCampaign(c) === null && c.over && c.won === false;
})());

check('trận kết thúc thì tick/act không làm gì', (() => {
  const m = makeMatch('gau', 'tho', 0, 0);
  m.over = true;
  const a = tick(m, 99999, seeded());
  const b = act(m, 'dam', seeded());
  return a.cueStart === false && b.result === null;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
