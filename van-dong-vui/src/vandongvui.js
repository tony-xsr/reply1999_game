// Logic 5 trò "Vận Động Vui" (Đợt 3 — arcade vận động hồi xưa) — thuần,
// nhận rng/thời gian để test tất định. Cùng phong cách tách file với
// tu-duy/src/tuduy.js và ren-tri-nao/src/rentrinao.js.

/* ===== 1. Ếch Qua Đường An Toàn (Frogger dạng lưới rời rạc) ===== */

export const FROG_ROWS = 7;
export const FROG_COLS = 7;
// Hàng 0 = đích, hàng cuối = vạch xuất phát, xen kẽ hàng đường xe + 1 hàng an toàn giữa.
export const FROG_LANE_TYPES = ['goal', 'road', 'road', 'safe', 'road', 'road', 'start'];

/** Tạo 1 hàng xe: mảng boolean độ dài `cols`, xe dài `carLen` cách nhau `gap`. */
export function makeCarLane(cols, carLen, gap, rng = Math.random) {
  const occupied = new Array(cols).fill(false);
  const period = carLen + gap;
  const offset = Math.floor(rng() * period);
  for (let c = 0; c < cols; c++) {
    if ((c + offset) % period < carLen) occupied[c] = true;
  }
  return occupied;
}

/** Trượt 1 hàng xe theo hướng dir (+1 phải, -1 trái), có vòng lại (circular). */
export function shiftLane(occupied, dir) {
  const a = occupied.slice();
  if (dir > 0) a.unshift(a.pop());
  else a.push(a.shift());
  return a;
}

/** Khởi tạo ván chơi mới: mọi hàng xe + vị trí ếch ở vạch xuất phát. */
export function makeFrogGame(rng = Math.random) {
  const lanes = FROG_LANE_TYPES.map((type, i) => {
    if (type !== 'road') return null;
    return { dir: i % 2 === 0 ? 1 : -1, occupied: makeCarLane(FROG_COLS, 2, 2, rng) };
  });
  return {
    lanes,
    frog: { row: FROG_ROWS - 1, col: Math.floor(FROG_COLS / 2) },
    over: false,
    won: false,
  };
}

/** 1 nhịp thời gian: mọi hàng xe trượt đi 1 ô, rồi kiểm tra ếch có bị đụng không. */
export function tickFrogGame(game) {
  game.lanes = game.lanes.map((lane) => (lane ? { ...lane, occupied: shiftLane(lane.occupied, lane.dir) } : null));
  checkFrogHit(game);
  return game;
}

export function checkFrogHit(game) {
  if (game.over) return game.over;
  const lane = game.lanes[game.frog.row];
  if (lane && lane.occupied[game.frog.col]) { game.over = true; game.won = false; }
  return game.over;
}

/** Di chuyển ếch 1 ô theo (dr, dc). Tới hàng 0 (đích) là thắng. */
export function moveFrog(game, dr, dc) {
  if (game.over) return game;
  const nr = game.frog.row + dr;
  const nc = game.frog.col + dc;
  if (nr < 0 || nr >= FROG_ROWS || nc < 0 || nc >= FROG_COLS) return game;
  game.frog.row = nr;
  game.frog.col = nc;
  if (nr === 0) { game.over = true; game.won = true; } else checkFrogHit(game);
  return game;
}

/* ===== 2. Nhảy Dây Đếm Nhịp — nhảy đúng lúc dây quét qua chân ===== */

/** Nhảy đúng nhịp nếu bấm cách thời điểm dây quét qua chân (`passTime`) không quá `windowMs`. */
export function isJumpOnTime(passTime, tapTime, windowMs = 250) {
  return Math.abs(tapTime - passTime) <= windowMs;
}

/** Nhịp dây ngày càng nhanh theo chuỗi nhảy đúng liên tiếp, không nhanh hơn `minMs`. */
export function nextJumpInterval(streak, baseMs = 1100, minMs = 480, stepMs = 40) {
  return Math.max(minMs, baseMs - streak * stepMs);
}

/* ===== 3. Ném Rổ Đếm Giờ — bấm đúng lúc thanh lực nằm trong vùng ăn điểm ===== */

/** Thanh lực dao động hình sin 0-100 theo thời gian t (ms) với chu kỳ `period` (ms). */
export function oscillatePower(t, period = 1200) {
  const phase = (t % period) / period;
  return Math.round(50 + 50 * Math.sin(phase * Math.PI * 2));
}

/** Ném vào rổ nếu lực nằm trong khoảng [targetMin, targetMax]. */
export function isBasketShot(power, targetMin = 40, targetMax = 60) {
  return power >= targetMin && power <= targetMax;
}

/* ===== 4. Bóng Bàn Đối Kháng — bóng nảy tường trái/phải + vợt trên/dưới ===== */

export const PONG_FRICTION = 1; // bong ban khong giam toc, chi doi huong khi cham

/** 1 bước di chuyển bóng theo vận tốc hiện tại. */
export function stepPongBall(ball) {
  ball.x += ball.vx;
  ball.y += ball.vy;
}

/** Nảy lại khi chạm 2 cạnh trái/phải của bàn (trên/dưới là khung thành, không nảy). */
export function bouncePongWalls(ball, w, r) {
  if (ball.x - r < 0) { ball.x = r; ball.vx = Math.abs(ball.vx); }
  if (ball.x + r > w) { ball.x = w - r; ball.vx = -Math.abs(ball.vx); }
}

/**
 * Bóng chạm vợt (đoạn ngang tại `paddleY`, tâm `paddleX`, rộng `paddleW`)?
 * Nếu chạm, đổi hướng dọc + lệch góc theo điểm chạm (gần mép vợt bật càng lệch).
 */
export function hitPongPaddle(ball, paddleX, paddleY, paddleW, r, goingDown) {
  const withinY = goingDown ? ball.y + r >= paddleY && ball.y - r <= paddleY : ball.y - r <= paddleY && ball.y + r >= paddleY;
  const withinX = ball.x >= paddleX - paddleW / 2 && ball.x <= paddleX + paddleW / 2;
  if (!withinY || !withinX) return false;
  const offset = (ball.x - paddleX) / (paddleW / 2); // -1..1
  ball.vy = -ball.vy;
  ball.vx += offset * 2;
  return true;
}

/** AI đuổi theo bóng với tốc độ tối đa `speed`, không vượt biên [0, w]. */
export function movePongAi(paddleX, ballX, speed, w) {
  const dx = ballX - paddleX;
  const step = Math.max(-speed, Math.min(speed, dx));
  return Math.max(0, Math.min(w, paddleX + step));
}

/* ===== 5. Bowling Ảo — lăn bóng, đếm ki đổ trong tầm ===== */

/** Xếp `rows` hàng ki hình tam giác, hàng cuối rộng nhất, đáy tại y = baseY. */
export function makePins(rows = 4, spacing = 30, baseY = 0) {
  const pins = [];
  let id = 0;
  for (let r = 0; r < rows; r++) {
    const count = r + 1;
    const y = baseY - (rows - 1 - r) * spacing * 0.86;
    const startX = -((count - 1) * spacing) / 2;
    for (let k = 0; k < count; k++) {
      pins.push({ id: id++, x: startX + k * spacing, y, down: false });
    }
  }
  return pins;
}

/** Đánh đổ mọi ki (chưa đổ) trong bán kính `radius` quanh vị trí bóng. @returns số ki vừa đổ thêm. */
export function knockPins(pins, ballX, ballY, radius) {
  let knocked = 0;
  for (const p of pins) {
    if (p.down) continue;
    if (Math.hypot(p.x - ballX, p.y - ballY) <= radius) { p.down = true; knocked++; }
  }
  return knocked;
}

export const countStanding = (pins) => pins.filter((p) => !p.down).length;
export const countDown = (pins) => pins.filter((p) => p.down).length;
