import assert from 'node:assert/strict';
import {
  FROG_ROWS, FROG_COLS, makeCarLane, shiftLane, makeFrogGame, tickFrogGame, checkFrogHit, moveFrog,
  isJumpOnTime, nextJumpInterval,
  oscillatePower, isBasketShot,
  stepPongBall, bouncePongWalls, hitPongPaddle, movePongAi,
  makePins, knockPins, countStanding, countDown,
} from './vandongvui.js';

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

/* ===== Frogger ===== */

check('makeCarLane: repeating car/gap pattern, deterministic with rng offset', () => {
  const lane = makeCarLane(10, 2, 2, () => 0);
  assert.deepEqual(lane, [true, true, false, false, true, true, false, false, true, true]);
});

check('shiftLane: circular shift right/left by exactly 1, no cars lost or duplicated', () => {
  const lane = [true, false, false, false];
  const right = shiftLane(lane, 1);
  assert.deepEqual(right, [false, true, false, false]);
  const left = shiftLane(lane, -1);
  assert.deepEqual(left, [false, false, false, true]);
  assert.equal(right.filter(Boolean).length, 1, 'car count preserved after shift');
});

check('makeFrogGame: frog starts centered on the bottom (start) row, not over', () => {
  const g = makeFrogGame(() => 0.5);
  assert.equal(g.frog.row, FROG_ROWS - 1);
  assert.equal(g.frog.col, Math.floor(FROG_COLS / 2));
  assert.equal(g.over, false);
  assert.equal(g.lanes.length, FROG_ROWS);
});

check('moveFrog: reaching row 0 wins, out-of-bounds moves are ignored', () => {
  const g = makeFrogGame(() => 0.9); // offset high enough to dodge cars in this test
  const before = { ...g.frog };
  moveFrog(g, 0, 10); // ra ngoài bien phai
  assert.deepEqual(g.frog, before, 'out-of-bounds move is a no-op');
  for (let i = 0; i < FROG_ROWS - 1; i++) moveFrog(g, -1, 0);
  assert.equal(g.frog.row, 0);
  assert.equal(g.won, true);
  assert.equal(g.over, true);
});

check('checkFrogHit: frog on an occupied road cell ends the game as a loss', () => {
  const g = makeFrogGame(() => 0);
  g.frog.row = 1; // hang duong dau tien
  g.frog.col = 0; // occupied=true theo pattern rng=0 o test tren
  checkFrogHit(g);
  assert.equal(g.over, true);
  assert.equal(g.won, false);
});

check('tickFrogGame: advances lanes and re-checks collision without moving the frog', () => {
  const g = makeFrogGame(() => 0);
  const frogBefore = { ...g.frog };
  tickFrogGame(g);
  assert.deepEqual(g.frog, frogBefore, 'ticking traffic never moves the frog itself');
});

/* ===== Nhảy dây ===== */

check('isJumpOnTime: true only within the window around the pass time', () => {
  assert.equal(isJumpOnTime(1000, 1100, 250), true);
  assert.equal(isJumpOnTime(1000, 1400, 250), false);
  assert.equal(isJumpOnTime(1000, 750, 250), true, 'symmetric window before the pass');
});

check('nextJumpInterval: shrinks with streak but never below minMs', () => {
  assert.equal(nextJumpInterval(0, 1100, 480, 40), 1100);
  assert.equal(nextJumpInterval(5, 1100, 480, 40), 900);
  assert.equal(nextJumpInterval(100, 1100, 480, 40), 480, 'floors at minMs');
});

/* ===== Ném rổ ===== */

check('oscillatePower: stays within [0,100], starts at 50 at t=0', () => {
  assert.equal(oscillatePower(0, 1200), 50);
  for (let t = 0; t < 2000; t += 50) {
    const p = oscillatePower(t, 1200);
    assert.ok(p >= 0 && p <= 100, `power ${p} out of range at t=${t}`);
  }
});

check('isBasketShot: true only inside the target power window', () => {
  assert.equal(isBasketShot(50, 40, 60), true);
  assert.equal(isBasketShot(39, 40, 60), false);
  assert.equal(isBasketShot(61, 40, 60), false);
});

/* ===== Bóng bàn ===== */

check('stepPongBall: moves position by current velocity exactly once', () => {
  const ball = { x: 10, y: 10, vx: 3, vy: -2 };
  stepPongBall(ball);
  assert.equal(ball.x, 13);
  assert.equal(ball.y, 8);
});

check('bouncePongWalls: reflects off left/right walls only, leaves y alone', () => {
  const r = 5;
  const left = { x: -2, y: 50, vx: -4, vy: 1 };
  bouncePongWalls(left, 200, r);
  assert.equal(left.x, r);
  assert.ok(left.vx > 0);
  const right = { x: 203, y: 50, vx: 4, vy: 1 };
  bouncePongWalls(right, 200, r);
  assert.equal(right.x, 200 - r);
  assert.ok(right.vx < 0);
});

check('hitPongPaddle: true only when ball is within paddle width and crossing paddle Y, flips vy', () => {
  const ball = { x: 50, y: 96, vx: 0, vy: 5 };
  const hit = hitPongPaddle(ball, 50, 100, 40, 5, true);
  assert.equal(hit, true);
  assert.ok(ball.vy < 0, 'vy flips upward after hitting the bottom paddle');

  const miss = hitPongPaddle({ x: 5, y: 96, vx: 0, vy: 5 }, 50, 100, 40, 5, true);
  assert.equal(miss, false, 'outside paddle width — no hit');
});

check('hitPongPaddle: hitting near the paddle edge adds horizontal spin away from center', () => {
  const ballRight = { x: 68, y: 96, vx: 0, vy: 5 };
  hitPongPaddle(ballRight, 50, 100, 40, 5, true);
  assert.ok(ballRight.vx > 0, 'hitting the right side of the paddle sends the ball rightward');
});

check('movePongAi: chases the ball but never exceeds its max speed or goes out of bounds', () => {
  assert.equal(movePongAi(50, 200, 5, 300), 55, 'moves at most `speed` toward the ball');
  assert.equal(movePongAi(50, 52, 5, 300), 52, 'stops exactly at the ball if closer than speed');
  assert.equal(movePongAi(2, -100, 5, 300), 0, 'clamped to the left bound');
  assert.equal(movePongAi(298, 9999, 5, 300), 300, 'clamped to the right bound');
});

/* ===== Bowling ===== */

check('makePins: triangular formation with the correct total pin count per row count', () => {
  const pins = makePins(4, 30, 0);
  assert.equal(pins.length, 1 + 2 + 3 + 4);
  assert.ok(pins.every((p) => p.down === false));
});

check('knockPins: only knocks down pins within radius, never double-counts an already-down pin', () => {
  const pins = makePins(2, 30, 0); // 1 + 2 = 3 pin
  const first = knockPins(pins, pins[0].x, pins[0].y, 5);
  assert.equal(first, 1);
  assert.equal(countDown(pins), 1);
  const second = knockPins(pins, pins[0].x, pins[0].y, 5);
  assert.equal(second, 0, 'already-down pin is not re-counted');
  assert.equal(countStanding(pins), 2);
});

console.log(`\n${passed} checks passed`);
