// Logic 3 trò sân chơi ngày xưa — thuần, test được.
// Oẳn tù tì / Bắn bi (vật lý va chạm tròn) / Ném lon (đạn bay + lon đổ).

/* ===== 1. Oẳn tù tì ===== */

export const RPS = [
  { id: 'rock', icon: '✊', vi: 'búa' },
  { id: 'paper', icon: '✋', vi: 'bao' },
  { id: 'scissors', icon: '✌️', vi: 'kéo' },
];

const BEATS = { rock: 'scissors', paper: 'rock', scissors: 'paper' };

/** @returns 1 nếu a thắng b, -1 nếu thua, 0 hòa */
export function rpsResult(a, b) {
  if (a === b) return 0;
  return BEATS[a] === b ? 1 : -1;
}

export function rpsExplain(winner, loser) {
  const names = { rock: 'búa', paper: 'bao', scissors: 'kéo' };
  const verbs = { 'rock>scissors': 'đập', 'scissors>paper': 'cắt', 'paper>rock': 'bọc' };
  return `${names[winner]} ${verbs[`${winner}>${loser}`]} ${names[loser]}`;
}

export const rpsAi = (rng = Math.random) => RPS[Math.floor(rng() * 3)].id;

/* ===== 2. Bắn bi: vật lý 2D tròn (ma sát + va chạm đàn hồi cùng khối lượng) ===== */

export const RING_R = 150;         // bán kính vòng tròn giữa sân (tọa độ sân 640×640)
export const MARBLE_R = 16;

/** Tạo sân: 5 bi mục tiêu trong vòng + bi cái của bé ở dưới. */
export function makeMarbleBoard(rng = Math.random) {
  const balls = [{ x: 320, y: 560, vx: 0, vy: 0, r: MARBLE_R + 3, player: true, out: false }];
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + rng() * 0.5;
    const d = rng() * (RING_R - 60);
    balls.push({
      x: 320 + Math.cos(a) * d,
      y: 320 + Math.sin(a) * d,
      vx: 0,
      vy: 0,
      r: MARBLE_R,
      player: false,
      out: false,
    });
  }
  return { balls, shots: 3, won: 0 };
}

/** Một bước mô phỏng (dt chuẩn hóa =1 khung 60fps). Trả true nếu còn bi đang lăn. */
export function stepMarbles(board, friction = 0.985) {
  let moving = false;
  const { balls } = board;
  for (const ball of balls) {
    if (ball.out) continue;
    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.vx *= friction;
    ball.vy *= friction;
    if (Math.hypot(ball.vx, ball.vy) < 0.05) { ball.vx = 0; ball.vy = 0; } else moving = true;
    // tường sân 640×640
    if (ball.x < ball.r) { ball.x = ball.r; ball.vx = Math.abs(ball.vx) * 0.7; }
    if (ball.x > 640 - ball.r) { ball.x = 640 - ball.r; ball.vx = -Math.abs(ball.vx) * 0.7; }
    if (ball.y < ball.r) { ball.y = ball.r; ball.vy = Math.abs(ball.vy) * 0.7; }
    if (ball.y > 640 - ball.r) { ball.y = 640 - ball.r; ball.vy = -Math.abs(ball.vy) * 0.7; }
  }
  // va chạm đàn hồi từng cặp (khối lượng bằng nhau: hoán đổi thành phần pháp tuyến)
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      const a = balls[i];
      const b = balls[j];
      if (a.out || b.out) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy);
      const minD = a.r + b.r;
      if (dist === 0 || dist >= minD) continue;
      const nx = dx / dist;
      const ny = dy / dist;
      // tách 2 bi dính nhau
      const push = (minD - dist) / 2;
      a.x -= nx * push; a.y -= ny * push;
      b.x += nx * push; b.y += ny * push;
      // hoán đổi vận tốc theo phương pháp tuyến
      const va = a.vx * nx + a.vy * ny;
      const vb = b.vx * nx + b.vy * ny;
      a.vx += (vb - va) * nx; a.vy += (vb - va) * ny;
      b.vx += (va - vb) * nx; b.vy += (va - vb) * ny;
      moving = true;
    }
  }
  // bi mục tiêu văng khỏi vòng → ăn được
  for (const ball of balls) {
    if (!ball.player && !ball.out && Math.hypot(ball.x - 320, ball.y - 320) > RING_R + ball.r) {
      ball.out = true;
      ball.vx = 0;
      ball.vy = 0;
      board.won++;
    }
  }
  return moving;
}

/* ===== Nhảy dây: game nhịp điệu — dây quét qua chân thì phải đang ở trên không ===== */

export function makeRope() {
  // phase 0.6: dây vừa qua chân — bé có gần trọn 1 vòng làm quen trước nhịp đầu
  return { period: 1500, phase: 0.6, count: 0, airborne: 0, alive: true };
}

/** Bé bật nhảy: lơ lửng 460ms. */
export function ropeJump(s) {
  if (s.alive && s.airborne <= 0) s.airborne = 460;
}

/**
 * Một bước mô phỏng (dtMs). Dây ở vị trí chân khi phase vượt 0.5.
 * @returns 'pass' (nhảy qua) | 'hit' (vướng dây) | null
 */
export function stepRope(s, dtMs) {
  if (!s.alive) return null;
  const prev = s.phase;
  s.phase = (s.phase + dtMs / s.period) % 1;
  if (s.airborne > 0) s.airborne -= dtMs;
  const crossed = prev < 0.5 && s.phase >= 0.5;
  if (!crossed) return null;
  if (s.airborne > 0) {
    s.count++;
    s.period = Math.max(760, s.period - 28); // quay nhanh dần
    return 'pass';
  }
  s.alive = false;
  return 'hit';
}

/* ===== 3. Ném lon: đạn bay parabol + lon văng khỏi bàn ===== */

export const GRAVITY = 0.5;
export const TABLE_Y = 470;         // mặt bàn (sân 640×640)
export const TABLE_X = [340, 620];  // mép bàn

/** Chồng lon tháp 3-2-1 trên bàn. */
export function makeCans() {
  const cans = [];
  const w = 34;
  const h = 46;
  const baseX = 452;
  const rows = [[0, 1, 2], [0.5, 1.5], [1]];
  rows.forEach((cols, level) => {
    for (const c of cols) {
      cans.push({
        x: baseX + c * (w + 4),
        y: TABLE_Y - h / 2 - level * h,
        vx: 0, vy: 0, w, h,
        down: false,
      });
    }
  });
  return { cans, throws: 3, knocked: 0 };
}

export function throwBall(power, angleDeg) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: 60, y: TABLE_Y - 10, vx: Math.cos(a) * power, vy: -Math.sin(a) * power, r: 14, live: true };
}

export const GROUND_Y = 600; // mặt đất

/** Cao độ chỗ tựa của lon: nóc lon bên dưới (chồng nhau) / mặt bàn / mặt đất. */
function restY(state, can) {
  const onTable = can.x > TABLE_X[0] - can.w / 2 && can.x < TABLE_X[1] + can.w / 2;
  let floor = (onTable ? TABLE_Y : GROUND_Y) - can.h / 2;
  for (const other of state.cans) {
    if (other === can || other.down) continue;
    if (Math.abs(other.x - can.x) < can.w * 0.8 && other.y > can.y) {
      floor = Math.min(floor, other.y - can.h);
    }
  }
  return { floor, onTable };
}

/** Một bước mô phỏng ném lon. Trả true nếu còn chuyển động. */
export function stepCans(state, ball) {
  let moving = false;
  if (ball && ball.live) {
    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.vy += GRAVITY;
    if (ball.y > 700 || ball.x > 700) ball.live = false;
    else moving = true;
    // trúng lon → truyền đà mạnh
    for (const can of state.cans) {
      if (can.down) continue;
      if (Math.abs(ball.x - can.x) < can.w / 2 + ball.r && Math.abs(ball.y - can.y) < can.h / 2 + ball.r) {
        can.vx += ball.vx * 0.9;
        can.vy += ball.vy * 0.3 - 3;
        ball.vx *= 0.3;
        ball.live = ball.vx > 1;
      }
    }
  }
  for (const can of state.cans) {
    if (can.down) continue;
    const { floor, onTable } = restY(state, can);
    // mất chỗ tựa (lon dưới văng đi) → rơi theo
    if (!can.vx && !can.vy && can.y < floor - 0.5) can.vy = 0.1;
    if (!can.vx && !can.vy) continue;
    can.x += can.vx;
    can.y += can.vy;
    can.vy += GRAVITY;
    can.vx *= 0.995;
    moving = true;
    const rest = restY(state, can);
    if (can.y >= rest.floor && can.vy >= 0) {
      can.y = rest.floor;
      can.vy = 0;
      can.vx *= 0.82;
      if (Math.abs(can.vx) < 0.3) can.vx = 0;
      if (!rest.onTable && !can.down) { can.down = true; state.knocked++; }
    }
  }
  return moving;
}
