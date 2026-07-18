import assert from 'node:assert/strict';
import {
  SIMON_COLORS, nextSimonStep, checkSimonInput,
  makeGrid2048, move2048, spawnTile2048, canMove2048, has2048, slideMergeRow,
  MEMORY_WORDS, makeMemoryDeck, isMemoryMatch,
  stepBall, wallBounce, ballsOverlap, resolveCollision, isPocketed, allStopped,
  makeEmptyGrid, dropBlock, findGroup, clearGroups, collapseColumns, isColumnFull, randomColor,
} from './rentrinao.js';

let passed = 0;
function check(name, fn) {
  try {
    fn();
    passed++;
    console.log(`✅ ${name}`);
  } catch (e) {
    console.log(`❌ ${name}: ${e.message}`);
    process.exitCode = 1;
  }
}

/* ===== Simon ===== */

check('nextSimonStep: appends exactly 1 valid color index, deterministic with rng', () => {
  const seq = nextSimonStep(nextSimonStep([], () => 0.1), () => 0.9);
  assert.equal(seq.length, 2);
  for (const s of seq) assert.ok(s >= 0 && s < SIMON_COLORS.length);
});

check('checkSimonInput: ok while prefix matches, wrong on mismatch, complete when full', () => {
  const seq = [0, 1, 2];
  assert.equal(checkSimonInput(seq, [0]), 'ok');
  assert.equal(checkSimonInput(seq, [0, 1]), 'ok');
  assert.equal(checkSimonInput(seq, [0, 1, 2]), 'complete');
  assert.equal(checkSimonInput(seq, [0, 2]), 'wrong');
  assert.equal(checkSimonInput(seq, []), 'ok', 'empty input never wrong');
});

/* ===== 2048 ===== */

check('slideMergeRow: slides left, merges once per pair, tracks gained score', () => {
  assert.deepEqual(slideMergeRow([2, 2, 0, 0]).row, [4, 0, 0, 0]);
  assert.equal(slideMergeRow([2, 2, 0, 0]).gained, 4);
  assert.deepEqual(slideMergeRow([2, 2, 2, 2]).row, [4, 4, 0, 0], 'merges pairs left-to-right, not triple-merge');
  assert.deepEqual(slideMergeRow([0, 0, 2, 0]).row, [2, 0, 0, 0]);
  assert.equal(slideMergeRow([2, 0, 0, 0]).moved, false, 'already-slid row reports no move');
});

check('move2048: moving spawns a new tile only when something actually moved', () => {
  const grid = makeGrid2048(4);
  grid[0] = 2; grid[1] = 2; // trượt trái sẽ gộp -> có chỗ trống mới
  const res = move2048(grid, 4, 'left', () => 0.01);
  assert.ok(res.moved);
  assert.equal(res.grid.filter((v) => v !== 0).length, 2, '4 (merged) + 1 spawned tile');
});

check('move2048: no-op move (nothing to slide) does not spawn a tile', () => {
  const grid = makeGrid2048(4);
  grid[0] = 2; grid[4] = 4; grid[8] = 8; grid[12] = 16; // cot 0 da day, khac nhau -> trai khong doi
  const before = grid.filter((v) => v !== 0).length;
  const res = move2048(grid, 4, 'left', () => 0.01);
  assert.equal(res.moved, false);
  assert.equal(res.grid.filter((v) => v !== 0).length, before, 'no spawn when nothing moved');
});

check('spawnTile2048: fills an empty cell with 2 or 4, never touches a full grid', () => {
  const grid = makeGrid2048(2);
  spawnTile2048(grid, () => 0.5);
  assert.equal(grid.filter((v) => v !== 0).length, 1);
  const full = [2, 2, 2, 2];
  spawnTile2048(full, () => 0.5);
  assert.deepEqual(full, [2, 2, 2, 2], 'full grid unchanged');
});

check('canMove2048: true if any empty cell or adjacent equal pair, false when fully stuck', () => {
  assert.equal(canMove2048(makeGrid2048(2), 2), true, 'empty grid always movable');
  assert.equal(canMove2048([2, 2, 4, 8], 2), true, 'top row has an adjacent equal pair');
  assert.equal(canMove2048([2, 4, 8, 2], 2), false, 'full + no orthogonally-adjacent equal neighbors');
});

check('has2048: true once any tile reaches 2048', () => {
  assert.equal(has2048([2, 4, 8, 16]), false);
  assert.equal(has2048([2, 4, 2048, 16]), true);
});

/* ===== Memory deck ===== */

check('makeMemoryDeck: exactly 2 of each of N pairs, all matched keys exist in MEMORY_WORDS', () => {
  const deck = makeMemoryDeck(6, () => 0.3);
  assert.equal(deck.length, 12);
  const counts = {};
  for (const c of deck) counts[c.key] = (counts[c.key] || 0) + 1;
  assert.equal(Object.keys(counts).length, 6);
  for (const k of Object.keys(counts)) assert.equal(counts[k], 2);
  assert.ok(deck.every((c) => MEMORY_WORDS.some((w) => w.emoji === c.key)));
});

check('isMemoryMatch: true only for same key (emoji), ignores id', () => {
  const deck = makeMemoryDeck(3, () => 0.1);
  const [a, b] = deck;
  assert.equal(isMemoryMatch(a, a), true);
  const sameKeyOther = deck.find((c) => c.key === a.key && c.id !== a.id);
  assert.equal(isMemoryMatch(a, sameKeyOther), true);
  const differentKey = deck.find((c) => c.key !== a.key);
  assert.equal(isMemoryMatch(a, differentKey), false);
  void b;
});

/* ===== Billiards physics ===== */

check('stepBall: moves by velocity then applies friction, snaps to 0 below min speed', () => {
  const ball = { x: 0, y: 0, vx: 10, vy: 0 };
  stepBall(ball);
  assert.equal(ball.x, 10);
  assert.ok(ball.vx < 10 && ball.vx > 9, 'friction slightly reduces speed');
  const slow = { x: 0, y: 0, vx: 0.01, vy: 0 };
  stepBall(slow);
  assert.equal(slow.vx, 0, 'below min speed snaps to a full stop');
});

check('wallBounce: reflects velocity and clamps position at each of the 4 walls', () => {
  const r = 10;
  const left = { x: -5, y: 50, vx: -3, vy: 0 };
  wallBounce(left, 200, 200, r);
  assert.equal(left.x, r);
  assert.ok(left.vx > 0, 'bounced off left wall moves right now');

  const right = { x: 205, y: 50, vx: 3, vy: 0 };
  wallBounce(right, 200, 200, r);
  assert.equal(right.x, 200 - r);
  assert.ok(right.vx < 0);

  const top = { x: 50, y: -5, vx: 0, vy: -3 };
  wallBounce(top, 200, 200, r);
  assert.equal(top.y, r);
  assert.ok(top.vy > 0);

  const bottom = { x: 50, y: 205, vx: 0, vy: 3 };
  wallBounce(bottom, 200, 200, r);
  assert.equal(bottom.y, 200 - r);
  assert.ok(bottom.vy < 0);
});

check('ballsOverlap: true only when centers closer than 2r and not exactly coincident-checked as touching', () => {
  const r = 10;
  assert.equal(ballsOverlap({ x: 0, y: 0 }, { x: 15, y: 0 }, r), true);
  assert.equal(ballsOverlap({ x: 0, y: 0 }, { x: 25, y: 0 }, r), false);
});

check('resolveCollision: separates overlapping balls and conserves total momentum (elastic, equal mass)', () => {
  const a = { x: 0, y: 0, vx: 5, vy: 0 };
  const b = { x: 15, y: 0, vx: 0, vy: 0 };
  const totalBefore = a.vx + b.vx;
  resolveCollision(a, b, 10);
  assert.ok(!ballsOverlap(a, b, 10), 'no longer overlapping after separation');
  assert.ok(Math.abs((a.vx + b.vx) - totalBefore) < 1e-9, 'momentum conserved on the collision axis');
  assert.ok(a.vx < 5, 'moving ball slows down after hitting a stationary ball head-on');
  assert.ok(b.vx > 0, 'stationary ball now moves forward');
});

check('isPocketed: true when a ball center is within a pocket radius', () => {
  const pockets = [{ x: 0, y: 0, r: 20 }, { x: 300, y: 300, r: 20 }];
  assert.equal(isPocketed({ x: 5, y: 5 }, pockets), true);
  assert.equal(isPocketed({ x: 150, y: 150 }, pockets), false);
});

check('allStopped: true only when every ball has zero velocity', () => {
  assert.equal(allStopped([{ vx: 0, vy: 0 }, { vx: 0, vy: 0 }]), true);
  assert.equal(allStopped([{ vx: 0, vy: 0 }, { vx: 1, vy: 0 }]), false);
});

/* ===== Falling block match ===== */

check('dropBlock: lands on the lowest empty cell of the chosen column, reports full column', () => {
  const cols = 3; const rows = 4;
  const grid = makeEmptyGrid(cols, rows);
  const r1 = dropBlock(grid, cols, rows, 1, 2);
  assert.equal(r1.row, rows - 1);
  assert.equal(grid[r1.row * cols + 1], 2);
  const r2 = dropBlock(grid, cols, rows, 1, 3);
  assert.equal(r2.row, rows - 2, 'stacks on top of the first block');
  for (let i = 0; i < rows - 2; i++) dropBlock(grid, cols, rows, 1, 1);
  const full = dropBlock(grid, cols, rows, 1, 1);
  assert.equal(full.landed, false, 'column full — cannot drop more');
});

check('findGroup: flood-fills only same-colored 4-directionally-connected cells', () => {
  const cols = 3; const rows = 3;
  // grid:
  // 1 1 2
  // 1 2 2
  // 2 2 2
  const grid = [1, 1, 2, 1, 2, 2, 2, 2, 2];
  const group = findGroup(grid, cols, rows, 0);
  assert.equal(group.length, 3, 'the three 1s at top-left form one connected group');
  assert.ok(group.every((i) => grid[i] === 1));
});

check('clearGroups: clears groups of >= minGroup, leaves smaller groups untouched', () => {
  const cols = 3; const rows = 3;
  const grid = [1, 1, 2, 1, 2, 2, 2, 2, 2]; // 1s: 3-group, 2s: 6-group
  const clearedCount = clearGroups(grid, cols, rows, 3);
  assert.equal(clearedCount, 9, 'both groups reach the threshold and get cleared');
  assert.ok(grid.every((v) => v === 0));
});

check('clearGroups: a lone pair below the threshold survives', () => {
  const cols = 3; const rows = 1;
  const grid = [1, 1, 2];
  const clearedCount = clearGroups(grid, cols, rows, 3);
  assert.equal(clearedCount, 0);
  assert.deepEqual(grid, [1, 1, 2]);
});

check('collapseColumns: blocks above an emptied cell fall down to fill the gap', () => {
  const cols = 2; const rows = 3;
  // col0 top->bottom: 3, 0, 1  =>  sau khi roi: 0, 3, 1
  const grid = [3, 0, 0, 0, 1, 0];
  collapseColumns(grid, cols, rows);
  assert.equal(grid[0 * cols + 0], 0);
  assert.equal(grid[1 * cols + 0], 3);
  assert.equal(grid[2 * cols + 0], 1);
});

check('isColumnFull: true only when the top row of that column is occupied', () => {
  const cols = 2; const rows = 2;
  const grid = makeEmptyGrid(cols, rows);
  assert.equal(isColumnFull(grid, cols, 0), false);
  grid[0] = 1;
  assert.equal(isColumnFull(grid, cols, 0), true);
});

check('randomColor: always within [1, BLOCK_COLORS]', () => {
  for (let i = 0; i < 20; i++) {
    const c = randomColor(() => i / 20);
    assert.ok(c >= 1 && c <= 5);
  }
});

console.log(`\n${passed} checks passed`);
