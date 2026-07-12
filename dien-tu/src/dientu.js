// Logic 3 game Điện Tử Xưa — thuần, tick-based, test được.
// Bắn vịt trời / Đập gạch bóng nảy (nhặt chữ) / Đua xe 3 làn (cổng đáp án toán).

const randInt = (lo, hi, rng) => lo + Math.floor(rng() * (hi - lo + 1));

/* ===== 1. Bắn vịt trời ===== */

export const DUCK_ROUND = 45; // giây

/** @param {'classic'|'even'} mode - even: chỉ bắn vịt mang số CHẴN */
export function makeDuck(mode, rng = Math.random) {
  const dir = rng() < 0.5 ? 1 : -1;
  const n = randInt(1, 20, rng);
  return {
    x: dir > 0 ? -50 : 690,
    y: 70 + rng() * 300,
    vx: dir * (2 + rng() * 2.4),
    wob: rng() * Math.PI * 2,
    label: mode === 'even' ? String(n) : null,
    isTarget: mode === 'even' ? n % 2 === 0 : true,
    falling: false,
    gone: false,
  };
}

/** Điểm khi bắn trúng. */
export function duckScore(duck) {
  return duck.isTarget ? { delta: 10, good: true } : { delta: -5, good: false };
}

/** Một tick bay: lượn sóng sin; vịt trúng đạn rơi thẳng. */
export function stepDucks(ducks) {
  for (const d of ducks) {
    if (d.gone) continue;
    if (d.falling) {
      d.y += 9;
      if (d.y > 700) d.gone = true;
      continue;
    }
    d.x += d.vx;
    d.wob += 0.08;
    d.y += Math.sin(d.wob) * 1.4;
    if (d.x < -70 || d.x > 710) d.gone = true;
  }
}

/* ===== 2. Đập gạch bóng nảy (gạch chữ rơi xuống nhặt = học chữ) ===== */

export const BK = { W: 640, H: 640, PADDLE_W: 110, PADDLE_Y: 596, BALL_R: 9 };

export function createBreakout(letters, rng = Math.random) {
  const bricks = [];
  const cols = 8;
  const rows = 5;
  const colors = ['#e05c4a', '#ee9f2e', '#e8c832', '#57a85c', '#4a7fd4'];
  // rải ~8 viên gạch mang chữ cái
  const letterSpots = new Set();
  while (letterSpots.size < 8) letterSpots.add(randInt(0, cols * rows - 1, rng));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      bricks.push({
        x: 24 + c * 74, y: 60 + r * 34, w: 68, h: 28,
        color: colors[r],
        letter: letterSpots.has(i) ? letters[randInt(0, letters.length - 1, rng)] : null,
        alive: true,
      });
    }
  }
  return {
    bricks,
    ball: { x: 320, y: 430, vx: 3.4, vy: -5, r: BK.BALL_R, stuck: false },
    paddleX: 320,
    pickups: [],      // chữ đang rơi
    caught: [],       // chữ đã nhặt được
    lives: 3,
    won: false,
    over: false,
  };
}

/**
 * Một tick. @returns {{broke:boolean, caught:string|null, lostLife:boolean}}
 */
export function stepBreakout(s) {
  const ev = { broke: false, caught: null, lostLife: false };
  if (s.won || s.over) return ev;
  const b = s.ball;
  b.x += b.vx;
  b.y += b.vy;
  if (b.x < b.r) { b.x = b.r; b.vx = Math.abs(b.vx); }
  if (b.x > BK.W - b.r) { b.x = BK.W - b.r; b.vx = -Math.abs(b.vx); }
  if (b.y < b.r) { b.y = b.r; b.vy = Math.abs(b.vy); }

  // Đỡ bằng thanh trượt: góc nảy theo vị trí chạm
  if (b.vy > 0 && b.y + b.r >= BK.PADDLE_Y && b.y + b.r <= BK.PADDLE_Y + 16
    && Math.abs(b.x - s.paddleX) <= BK.PADDLE_W / 2 + b.r) {
    const off = (b.x - s.paddleX) / (BK.PADDLE_W / 2); // -1..1
    const speed = Math.hypot(b.vx, b.vy);
    const angle = off * 1.05; // tối đa ~60°
    b.vx = Math.sin(angle) * speed;
    b.vy = -Math.abs(Math.cos(angle) * speed);
    b.y = BK.PADDLE_Y - b.r;
  }

  // Rơi đáy → mất 1 tim
  if (b.y > BK.H + b.r) {
    s.lives--;
    ev.lostLife = true;
    if (s.lives <= 0) { s.over = true; return ev; }
    b.x = s.paddleX;
    b.y = 430;
    b.vx = 3.4 * (Math.random() < 0.5 ? 1 : -1);
    b.vy = -5;
  }

  // Vỡ gạch (1 viên mỗi tick là đủ mượt)
  for (const brick of s.bricks) {
    if (!brick.alive) continue;
    if (b.x + b.r > brick.x && b.x - b.r < brick.x + brick.w
      && b.y + b.r > brick.y && b.y - b.r < brick.y + brick.h) {
      brick.alive = false;
      ev.broke = true;
      // nảy theo phía chạm nông hơn
      const fromSide = Math.min(Math.abs(b.x - brick.x), Math.abs(b.x - brick.x - brick.w))
        < Math.min(Math.abs(b.y - brick.y), Math.abs(b.y - brick.y - brick.h));
      if (fromSide) b.vx = -b.vx; else b.vy = -b.vy;
      if (brick.letter) {
        s.pickups.push({ x: brick.x + brick.w / 2, y: brick.y, letter: brick.letter, vy: 2.6 });
      }
      break;
    }
  }
  if (s.bricks.every((brick) => !brick.alive)) s.won = true;

  // Chữ rơi: nhặt bằng thanh trượt
  for (const p of s.pickups) {
    p.y += p.vy;
    if (p.y >= BK.PADDLE_Y - 6 && p.y <= BK.PADDLE_Y + 20 && Math.abs(p.x - s.paddleX) <= BK.PADDLE_W / 2 + 14) {
      s.caught.push(p.letter);
      ev.caught = p.letter;
      p.y = 9999;
    }
  }
  s.pickups = s.pickups.filter((p) => p.y < BK.H + 30);
  return ev;
}

/* ===== 3. Đua xe 3 làn ===== */

export const RC = { LANES: 3, CAR_Y: 552, SPAWN_EVERY: 52 };
const OBSTACLES = ['🚧', '🛢️', '🚗', '🐄'];

/** @param {'classic'|'math'} mode - math: có cổng 3 biển đáp án, đâm biển đúng */
export function createRacer(mode, rng = Math.random) {
  return {
    mode, rng,
    lane: 1,
    tick: 0,
    speed: 4,
    items: [],       // {kind:'rock'|'gate', lane, y, icon, value?, good?}
    lives: 3,
    score: 0,
    over: false,
    question: null,  // {text, answer} của cổng đang lăn tới
    spawned: 0,
  };
}

function spawnRow(s) {
  s.spawned++;
  // chế độ toán: cứ 3 đợt thì 1 đợt là cổng đáp án
  if (s.mode === 'math' && s.spawned % 3 === 0) {
    const a = randInt(1, 8, s.rng);
    const b = randInt(1, 9 - a, s.rng);
    const answer = a + b;
    s.question = { text: `${a} + ${b} = ?`, answer };
    const wrongs = new Set();
    while (wrongs.size < 2) {
      const w = randInt(1, 9, s.rng);
      if (w !== answer) wrongs.add(w);
    }
    const values = [answer, ...wrongs];
    // xáo vị trí 3 biển vào 3 làn
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(s.rng() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }
    values.forEach((v, lane) => {
      s.items.push({ kind: 'gate', lane, y: -60, value: v, good: v === answer });
    });
    return;
  }
  // chướng ngại: 1–2 làn (luôn chừa ít nhất 1 làn trống; 2 làn thưa thôi cho bé kịp né)
  const blocked = s.rng() < 0.22 ? 2 : 1;
  const lanes = [0, 1, 2];
  for (let i = lanes.length - 1; i > 0; i--) {
    const j = Math.floor(s.rng() * (i + 1));
    [lanes[i], lanes[j]] = [lanes[j], lanes[i]];
  }
  for (const lane of lanes.slice(0, blocked)) {
    s.items.push({ kind: 'rock', lane, y: -60, icon: OBSTACLES[randInt(0, OBSTACLES.length - 1, s.rng)] });
  }
}

/**
 * Một tick đường chạy. @returns {{crash:boolean, gate:'ok'|'bad'|null}}
 */
export function stepRacer(s) {
  const ev = { crash: false, gate: null };
  if (s.over) return ev;
  s.tick++;
  s.score++;
  s.speed = Math.min(7, 4 + s.tick / 800); // trần tốc độ vừa sức bé
  if (s.tick % Math.max(42, Math.round(RC.SPAWN_EVERY - s.speed * 2)) === 0) spawnRow(s);

  for (const item of s.items) {
    item.y += s.speed;
    // chạm hàng xe
    if (!item.hitDone && item.y >= RC.CAR_Y - 26 && item.y <= RC.CAR_Y + 26) {
      if (item.kind === 'rock' && item.lane === s.lane) {
        item.hitDone = true;
        s.lives--;
        ev.crash = true;
      } else if (item.kind === 'gate' && item.lane === s.lane) {
        // đánh dấu cả 3 biển của cổng này đã xử lý
        for (const g of s.items) if (g.kind === 'gate' && Math.abs(g.y - item.y) < 4) g.hitDone = true;
        if (item.good) {
          s.score += 30;
          ev.gate = 'ok';
        } else {
          s.lives--;
          ev.gate = 'bad';
        }
        s.question = null;
      }
    }
  }
  s.items = s.items.filter((item) => item.y < 700);
  if (s.lives <= 0) s.over = true;
  return ev;
}

export const changeLane = (s, dir) => {
  s.lane = Math.max(0, Math.min(RC.LANES - 1, s.lane + dir));
};
