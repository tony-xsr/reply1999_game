// Giải Cứu Khủng Long Con: chạy tự động qua rừng, chạm để NHẢY qua đá và hố — bế các
// bé khủng long con lạc đường về tổ với khủng long mẹ đang chờ ở cuối chặng. KHÔNG đánh
// nhau — chỉ chạy, nhảy và giải cứu. Chặng đường sinh ngẫu nhiên nhưng LUÔN công bằng
// (chướng ngại cách nhau đủ xa để nhảy kịp). File thuần logic, test được độc lập.

export const FIELD_W = 640;
export const FIELD_H = 480;
export const GROUND_Y = 400; // mặt đất
export const RUNNER_X = 130; // nhân vật đứng cố định, thế giới trôi qua
export const RUNNER_R = 20;
export const GRAVITY = 0.55;
export const JUMP_V = -12.5; // nhảy cao ~140px, xa ~2 nhịp đá
export const START_LIVES = 3;
export const BASE_SPEED = 4.2;
export const MIN_GAP = 260; // 2 chướng ngại cách nhau tối thiểu — luôn nhảy kịp
export const PIT_W = 90; // hố rộng vừa 1 cú nhảy

/** Mỗi màn: chặng dài hơn, chạy nhanh hơn, chướng ngại dày hơn (vẫn giữ MIN_GAP). */
export function makeLevel(levelIndex, rng = Math.random) {
  const target = 4200 + levelIndex * 1600;
  const speed = BASE_SPEED * (1 + levelIndex * 0.08);
  // dựng sẵn cả chặng: đi từ trái sang, chèn chướng ngại + bé khủng long xen kẽ
  const items = [];
  let x = 700; // đoạn đầu để trống cho bé lấy đà
  while (x < target - 500) {
    const roll = rng();
    if (roll < 0.42) items.push({ type: 'rock', x });
    else if (roll < 0.62) items.push({ type: 'pit', x }); // hố bắt đầu tại x, rộng PIT_W
    else items.push({ type: 'baby', x, saved: false });
    x += MIN_GAP + rng() * 220;
  }
  // bảo đảm có ít nhất 2 bé khủng long để cứu
  if (items.filter((it) => it.type === 'baby').length < 2) {
    items.push({ type: 'baby', x: target - 700, saved: false });
    items.push({ type: 'baby', x: target - 450, saved: false });
  }
  return {
    level: levelIndex,
    target,
    speed,
    dist: 0, // quãng đường đã trôi qua
    y: GROUND_Y - RUNNER_R,
    vy: 0,
    grounded: true,
    items,
    lives: START_LIVES,
    invincibleMs: 0,
    saved: 0,
    score: 0,
    over: false,
    won: false,
  };
}

/** Chạm để nhảy (chỉ khi đang chạm đất). */
export function jump(game) {
  if (game.over || !game.grounded) return false;
  game.vy = JUMP_V;
  game.grounded = false;
  return true;
}

/** Nhân vật có đang đứng trên miệng hố không? (hố = không có đất đỡ) */
function overPit(game) {
  const wx = game.dist + RUNNER_X;
  return game.items.some((it) => it.type === 'pit' && wx > it.x && wx < it.x + PIT_W);
}

/**
 * Một bước mô phỏng. Trả về sự kiện: { hit, fell, saved, won }
 */
export function stepGame(game, dtMs) {
  const ev = { hit: false, fell: false, saved: 0, won: false };
  if (game.over) return ev;
  const dt = dtMs / 16.67;

  game.invincibleMs = Math.max(0, game.invincibleMs - dtMs);
  game.dist += game.speed * dt;

  // trọng lực + đáp đất (chỉ đáp khi không lơ lửng trên hố)
  game.vy += GRAVITY * dt;
  game.y += game.vy * dt;
  const floorY = GROUND_Y - RUNNER_R;
  if (game.y >= floorY) {
    if (overPit(game)) {
      // rơi xuống hố → mất 1 tim, nhấc lên đặt lại sau miệng hố
      if (game.y > GROUND_Y + 60) {
        ev.fell = true;
        game.lives--;
        game.invincibleMs = 1500;
        const pit = game.items.find((it) => it.type === 'pit'
          && game.dist + RUNNER_X > it.x && game.dist + RUNNER_X < it.x + PIT_W);
        if (pit) game.dist = pit.x + PIT_W + 10 - RUNNER_X;
        game.y = floorY;
        game.vy = 0;
        game.grounded = true;
      }
    } else {
      game.y = floorY;
      game.vy = 0;
      game.grounded = true;
    }
  } else {
    game.grounded = false;
  }

  // va chạm đá + cứu bé khủng long
  const wx = game.dist + RUNNER_X;
  for (const it of game.items) {
    if (it.type === 'rock' && game.invincibleMs <= 0
      && Math.abs(wx - (it.x + 18)) < RUNNER_R + 16
      && game.y + RUNNER_R > GROUND_Y - 30) {
      ev.hit = true;
      game.lives--;
      game.invincibleMs = 1500;
    } else if (it.type === 'baby' && !it.saved && Math.abs(wx - it.x) < RUNNER_R + 20) {
      it.saved = true;
      game.saved++;
      game.score += 30;
      ev.saved++;
    }
  }

  if (game.lives <= 0) {
    game.over = true;
    game.won = false;
    return ev;
  }
  // về tới tổ
  if (game.dist + RUNNER_X >= game.target) {
    game.over = true;
    game.won = true;
    game.score += 50 + game.saved * 20 + game.lives * 15;
    ev.won = true;
  }
  return ev;
}
