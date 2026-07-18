import assert from 'node:assert/strict';
import {
  PAC_WORDS, pickPacWord, makePacGame, movePacPlayer, stepGhost, checkPacCaught, tickPacGhosts,
  stepObstacles, spawnObstacle, speedForScore, jumpArc, isRunnerHit,
  FISH_VALUES, spawnFish, stepFish, isFishOffscreen, isFishHit,
  makeBricks, stepBreakoutBall, bounceBreakoutWalls, hitBreakoutPaddle, hitBrick, countAliveBricks,
  CANDY_TYPES, makeCandyGrid, areAdjacent, swapCandies, findMatches, clearMatches, collapseCandyColumns, refillCandyGrid,
} from './arcadexua.js';

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

/* ===== Pac-Man ghép chữ ===== */

check('pickPacWord: always returns a word from PAC_WORDS', () => {
  for (let i = 0; i < 10; i++) {
    const w = pickPacWord(() => i / 10);
    assert.ok(PAC_WORDS.some((p) => p.word === w.word));
  }
});

check('makePacGame: places exactly 1 letter per word char, none overlapping the player start', () => {
  const g = makePacGame(9, 9, 'CAT', 2, () => 0.3);
  assert.equal(g.letters.length, 3);
  assert.deepEqual(g.letters.map((l) => l.ch), ['C', 'A', 'T']);
  for (const l of g.letters) assert.ok(!(l.x === g.player.x && l.y === g.player.y));
  assert.equal(g.ghosts.length, 2);
  assert.equal(g.over, false);
});

check('movePacPlayer: clamps to bounds, eats the NEXT letter in order only', () => {
  const g = makePacGame(9, 9, 'CAT', 0, () => 0.3);
  // dat chu 'C' ngay canh nguoi choi de kiem tra an dung thu tu
  g.letters[0].x = g.player.x + 1;
  g.letters[0].y = g.player.y;
  movePacPlayer(g, 1, 0);
  assert.equal(g.letters[0].eaten, true);
  assert.equal(g.nextIndex, 1);

  // ra ngoai bien phai khong lam gi (kep bien)
  const before = { ...g.player };
  movePacPlayer(g, 999, 0);
  assert.equal(g.player.x, g.cols - 1);
  void before;
});

check('movePacPlayer: eating all letters in order wins the game', () => {
  const g = makePacGame(9, 9, 'CAT', 0, () => 0.3);
  // dat 3 chu tai x=1,2,3 (khong bao gio la 0) de luon co the dat nguoi choi
  // ngay o o BEN TRAI moi chu (x-1 >= 0 va khac o cua chu) truoc khi buoc vao.
  g.letters.forEach((l, i) => { l.x = i + 1; l.y = 0; });
  for (let i = 0; i < g.letters.length; i++) {
    g.player = { x: g.letters[i].x - 1, y: g.letters[i].y };
    movePacPlayer(g, 1, 0);
  }
  assert.equal(g.won, true);
  assert.equal(g.over, true);
});

check('stepGhost: moves exactly 1 cell toward the target, clamped to the board', () => {
  const g1 = stepGhost({ x: 0, y: 0 }, { x: 5, y: 0 }, 9, 9);
  assert.deepEqual(g1, { x: 1, y: 0 });
  const g2 = stepGhost({ x: 8, y: 8 }, { x: 20, y: 20 }, 9, 9);
  assert.equal(g2.x <= 8, true, 'never exceeds board bounds');
});

check('checkPacCaught / tickPacGhosts: player on the same cell as a ghost ends the game as a loss', () => {
  const g = makePacGame(9, 9, 'CAT', 1, () => 0.3);
  g.ghosts[0] = { ...g.player };
  checkPacCaught(g);
  assert.equal(g.over, true);
  assert.equal(g.won, false);
});

/* ===== Endless Runner ===== */

check('stepObstacles: shifts left by speed, drops obstacles once off-screen', () => {
  const list = [{ x: 100, width: 20 }, { x: -55, width: 20 }];
  const res = stepObstacles(list, 10);
  assert.equal(res.length, 1);
  assert.equal(res[0].x, 90);
});

check('spawnObstacle: appears at the given x with a reasonable width', () => {
  const o = spawnObstacle(800, () => 0.5);
  assert.equal(o.x, 800);
  assert.ok(o.width >= 18 && o.width <= 32);
});

check('speedForScore: increases with score but never exceeds max', () => {
  assert.equal(speedForScore(0, 4, 0.0025, 12), 4);
  assert.ok(speedForScore(1000, 4, 0.0025, 12) > 4);
  assert.equal(speedForScore(999999, 4, 0.0025, 12), 12);
});

check('jumpArc: zero at both ends of the jump, negative (upward) at the peak', () => {
  assert.equal(jumpArc(0, 500, 80), 0);
  assert.equal(jumpArc(500, 500, 80), 0);
  assert.equal(jumpArc(250, 500, 80), -80, 'peak height reached exactly at the midpoint');
  assert.ok(jumpArc(600, 500, 80) === 0, 'past the jump duration returns to 0 (on the ground)');
});

check('isRunnerHit: true only when the player AABB overlaps the obstacle and is not jumped high enough', () => {
  const obstacle = { x: 100, width: 20 };
  const hitOnGround = isRunnerHit(90, 30, 300, 40, 0, obstacle, 300);
  assert.equal(hitOnGround, true, 'standing still overlapping the obstacle x-range is a hit');
  const clearedByJump = isRunnerHit(90, 30, 300, 40, -80, obstacle, 300);
  assert.equal(clearedByJump, false, 'jumping high enough clears the obstacle');
  const farAway = isRunnerHit(0, 30, 300, 40, 0, obstacle, 300);
  assert.equal(farAway, false, 'no x-overlap — no hit');
});

/* ===== Bắn cá ===== */

check('spawnFish: starts off-screen on the side matching its direction, value from FISH_VALUES', () => {
  const right = spawnFish(5, 60, 800, () => 0.1); // rng<0.5 -> dir=1 -> x=-40
  assert.equal(right.dir, 1);
  assert.equal(right.x, -40);
  assert.ok(FISH_VALUES.includes(right.value));
});

check('stepFish: advances x by dir*speed, leaves y unchanged', () => {
  const f = { x: 0, y: 100, dir: 1, speed: 3, value: 1 };
  const f2 = stepFish(f);
  assert.equal(f2.x, 3);
  assert.equal(f2.y, 100);
});

check('isFishOffscreen: true only once fully past either edge', () => {
  assert.equal(isFishOffscreen({ x: -70 }, 800), true);
  assert.equal(isFishOffscreen({ x: 400 }, 800), false);
  assert.equal(isFishOffscreen({ x: 870 }, 800), true);
});

check('isFishHit: true only within the hit radius of the fish center', () => {
  const fish = { x: 100, y: 100 };
  assert.equal(isFishHit(fish, 110, 100, 24), true);
  assert.equal(isFishHit(fish, 200, 100, 24), false);
});

/* ===== Breakout ===== */

check('makeBricks: correct total count, all alive initially, correct row/col addressing', () => {
  const bricks = makeBricks(3, 5);
  assert.equal(bricks.length, 15);
  assert.ok(bricks.every((b) => b.alive));
  assert.equal(bricks[7].row, 1);
  assert.equal(bricks[7].col, 2);
});

check('stepBreakoutBall: moves by current velocity exactly once', () => {
  const ball = { x: 10, y: 10, vx: 2, vy: -3 };
  stepBreakoutBall(ball);
  assert.equal(ball.x, 12);
  assert.equal(ball.y, 7);
});

check('bounceBreakoutWalls: reflects off left/right/top, never off the bottom (that is a life-loss zone)', () => {
  const r = 5;
  const left = { x: -1, y: 50, vx: -3, vy: 1 };
  bounceBreakoutWalls(left, 300, r);
  assert.equal(left.x, r);
  assert.ok(left.vx > 0);
  const top = { x: 50, y: -1, vx: 0, vy: -3 };
  bounceBreakoutWalls(top, 300, r);
  assert.equal(top.y, r);
  assert.ok(top.vy > 0);
  const bottom = { x: 50, y: 305, vx: 0, vy: 3 };
  bounceBreakoutWalls(bottom, 300, r);
  assert.equal(bottom.y, 305, 'bottom edge is intentionally NOT bounced — that is how a life is lost');
});

check('hitBreakoutPaddle: only registers while the ball travels downward into the paddle strip', () => {
  const ball = { x: 100, y: 396, vx: 0, vy: 5 };
  const hit = hitBreakoutPaddle(ball, 100, 400, 60, 5);
  assert.equal(hit, true);
  assert.ok(ball.vy < 0);
  const movingAway = hitBreakoutPaddle({ x: 100, y: 396, vx: 0, vy: -5 }, 100, 400, 60, 5);
  assert.equal(movingAway, false, 'ball moving upward never counts as a paddle hit');
});

check('hitBrick: only breaks a brick once (alive check), reflects vy', () => {
  const ball = { x: 55, y: 55, vx: 1, vy: 2 };
  const brick = { alive: true };
  const hit = hitBrick(ball, brick, 40, 40, 30, 20, 5);
  assert.equal(hit, true);
  assert.equal(brick.alive, false);
  assert.ok(ball.vy < 0);
  const secondHit = hitBrick({ x: 55, y: 55, vx: 1, vy: 2 }, brick, 40, 40, 30, 20, 5);
  assert.equal(secondHit, false, 'already-broken brick cannot be hit again');
});

check('countAliveBricks: counts only bricks still alive', () => {
  const bricks = makeBricks(2, 2);
  bricks[0].alive = false;
  assert.equal(countAliveBricks(bricks), 3);
});

/* ===== Match-3 ===== */

check('makeCandyGrid: never contains a pre-existing 3-in-a-row match', () => {
  // rng CO THUC SU thay doi moi lan goi (khac hang so) — vong lap "thu lai
  // cho toi khi khong tao match" trong makeCandyGrid can 1 nguon bien thien
  // that, dung hang so se lap vo han vi luon ra cung 1 mau.
  let seed = 7;
  const varyingRng = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const grid = makeCandyGrid(6, 6, varyingRng);
  assert.equal(findMatches(grid, 6, 6).size, 0);
  assert.ok(grid.every((v) => v >= 1 && v <= CANDY_TYPES));
});

check('areAdjacent: true only for orthogonal neighbors, false for diagonal or far cells', () => {
  const cols = 5;
  assert.equal(areAdjacent(cols, 6, 7), true, 'horizontal neighbors');
  assert.equal(areAdjacent(cols, 6, 11), true, 'vertical neighbors');
  assert.equal(areAdjacent(cols, 6, 12), false, 'diagonal is not adjacent');
  assert.equal(areAdjacent(cols, 0, 20), false, 'far apart');
});

check('swapCandies: exchanges exactly the 2 given cells', () => {
  const grid = [1, 2, 3, 4];
  swapCandies(grid, 0, 3);
  assert.deepEqual(grid, [4, 2, 3, 1]);
});

check('findMatches: detects horizontal and vertical runs of >=3, ignores runs of 2', () => {
  const cols = 4; const rows = 4;
  // hang 0: 1 1 1 2  -> match ngang 0,1,2
  // cot 3 hang 0-2: 2 2 2 -> match doc (idx 3,7,11)
  const grid = [
    1, 1, 1, 2,
    3, 4, 5, 2,
    2, 3, 4, 2,
    1, 1, 2, 3,
  ];
  const matched = findMatches(grid, cols, rows);
  assert.ok(matched.has(0) && matched.has(1) && matched.has(2), 'horizontal run of three 1s');
  assert.ok(matched.has(3) && matched.has(7) && matched.has(11), 'vertical run of three 2s');
  assert.ok(!matched.has(12) && !matched.has(13), 'a run of only two (bottom-left 1s) is not a match');
});

check('clearMatches: zeroes out exactly the matched cells and returns their count', () => {
  const grid = [1, 1, 1, 2, 3, 4];
  const cleared = clearMatches(grid, new Set([0, 1, 2]));
  assert.equal(cleared, 3);
  assert.deepEqual(grid, [0, 0, 0, 2, 3, 4]);
});

check('collapseCandyColumns: candies fall down within their own column to fill gaps', () => {
  const cols = 2; const rows = 3;
  const grid = [3, 0, 0, 0, 1, 0];
  collapseCandyColumns(grid, cols, rows);
  assert.equal(grid[0 * cols + 0], 0);
  assert.equal(grid[1 * cols + 0], 3);
  assert.equal(grid[2 * cols + 0], 1);
});

check('refillCandyGrid: fills every empty cell with a valid candy type, leaves existing candies untouched', () => {
  const grid = [1, 0, 2, 0];
  refillCandyGrid(grid, () => 0.9);
  assert.equal(grid[0], 1);
  assert.equal(grid[2], 2);
  assert.ok(grid[1] >= 1 && grid[1] <= CANDY_TYPES);
  assert.ok(grid[3] >= 1 && grid[3] <= CANDY_TYPES);
});

console.log(`\n${passed} checks passed`);
