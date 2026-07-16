// Cá Lớn Biển Xanh: điều khiển chú cá bơi theo ngón tay, ăn cá NHỎ HƠN mình để lớn lên,
// né cá to hơn hoặc bằng mình. Lớn đủ 3 cấp là thắng màn. Cơ chế "cá lớn nuốt cá bé"
// thuộc thể loại phổ biến, hình cá dùng Kenney Fish Pack (CC0) — xem images/CREDITS.md.
// Toàn bộ file này thuần logic (không đụng canvas/DOM), test được độc lập.

export const FIELD_W = 960;
export const FIELD_H = 640;
export const START_LIVES = 3;
export const MAX_STAGE = 3; // lớn đủ 3 cấp → thắng màn
export const GROW_NEED = [5, 8, 12]; // số cá phải ăn để lên cấp tiếp theo
export const MAX_FISH_SIZE = 5;

/** Cỡ cá 1–5 → bán kính va chạm. Cá người chơi bắt đầu cỡ 2 (luôn có cá 1 để ăn). */
export function radiusOf(size) {
  return 12 + size * 9;
}

/** Cỡ hiện tại của cá người chơi theo cấp lớn (stage 0..2 → cỡ 2..4). */
export function playerSize(stage) {
  return stage + 2;
}

export function makeLevel(levelIndex, rng = Math.random) {
  return {
    level: levelIndex,
    player: { x: FIELD_W / 2, y: FIELD_H / 2, stage: 0, eaten: 0, invincibleMs: 0 },
    fish: [],
    lives: START_LIVES,
    score: 0,
    spawnTimer: 0,
    spawnEveryMs: Math.max(450, 800 - levelIndex * 50),
    dangerChance: Math.min(0.5, 0.3 + levelIndex * 0.04), // màn cao gặp cá dữ nhiều hơn
    over: false,
    won: false,
  };
}

/** Tung 1 con cá AI từ mép trái/phải: 65% cá nhỏ hơn (ăn được), còn lại cá ≥ mình (phải né). */
export function spawnFish(game, rng = Math.random) {
  const p = playerSize(game.player.stage);
  let size;
  if (rng() >= game.dangerChance) {
    size = 1 + Math.floor(rng() * (p - 1)); // 1 .. p-1
  } else {
    size = p + Math.floor(rng() * (MAX_FISH_SIZE - p + 1)); // p .. 5
  }
  const r = radiusOf(size);
  const fromLeft = rng() < 0.5;
  const speed = (2.7 - size * 0.35) * (1 + game.level * 0.06);
  const baseY = r + 20 + rng() * (FIELD_H - r * 2 - 40);
  game.fish.push({
    size,
    x: fromLeft ? -r - 4 : FIELD_W + r + 4,
    baseY,
    y: baseY,
    vx: fromLeft ? speed : -speed,
    wobblePhase: rng() * Math.PI * 2,
    wobbleAmp: 6 + rng() * 12,
  });
  return game.fish[game.fish.length - 1];
}

/** Cá người chơi bơi về phía điểm chạm (tx, ty) với tốc độ giới hạn, kẹp trong sân. */
export function movePlayer(game, tx, ty, dtMs) {
  const p = game.player;
  const maxStep = 0.34 * dtMs;
  const dx = tx - p.x;
  const dy = ty - p.y;
  const dist = Math.hypot(dx, dy);
  if (dist > 0.5) {
    const step = Math.min(maxStep, dist);
    p.x += (dx / dist) * step;
    p.y += (dy / dist) * step;
  }
  const r = radiusOf(playerSize(p.stage));
  p.x = Math.max(r, Math.min(FIELD_W - r, p.x));
  p.y = Math.max(r, Math.min(FIELD_H - r, p.y));
}

/**
 * Một bước mô phỏng. Trả về sự kiện cho phần giao diện:
 * { ate: số cá vừa ăn, ateSize, grew: vừa lên cấp?, hit: vừa bị cắn? }
 */
export function stepGame(game, dtMs, rng = Math.random) {
  const events = { ate: 0, ateSize: 0, grew: false, hit: false };
  if (game.over) return events;
  const dt = dtMs / 16.67;
  const p = game.player;
  p.invincibleMs = Math.max(0, p.invincibleMs - dtMs);

  game.spawnTimer += dtMs;
  if (game.spawnTimer >= game.spawnEveryMs) {
    game.spawnTimer = 0;
    spawnFish(game, rng);
  }

  // Cá AI bơi ngang + lượn sóng nhẹ theo quãng đường (deterministic, không cần rng)
  for (const f of game.fish) {
    f.x += f.vx * dt;
    f.y = f.baseY + Math.sin(f.wobblePhase + f.x * 0.02) * f.wobbleAmp;
  }
  // Ra khỏi mép đối diện thì biến mất
  game.fish = game.fish.filter((f) => {
    const r = radiusOf(f.size);
    return f.x > -r - 30 && f.x < FIELD_W + r + 30;
  });

  const pSize = playerSize(p.stage);
  const pR = radiusOf(pSize);
  for (const f of game.fish) {
    if (f.gone) continue;
    const fR = radiusOf(f.size);
    if (Math.hypot(f.x - p.x, f.y - p.y) >= (pR + fR) * 0.72) continue; // chạm "miệng" mới tính
    if (f.size < pSize) {
      // ăn được!
      f.gone = true;
      p.eaten++;
      game.score += f.size * 10;
      events.ate++;
      events.ateSize = f.size;
      if (p.eaten >= GROW_NEED[p.stage]) {
        p.stage++;
        p.eaten = 0;
        events.grew = true;
        if (p.stage >= MAX_STAGE) {
          game.over = true;
          game.won = true;
        }
      }
    } else if (p.invincibleMs <= 0) {
      // cá to hơn/bằng mình cắn trúng → mất 1 mạng + bất tử nhấp nháy 2 giây
      game.lives--;
      p.invincibleMs = 2000;
      events.hit = true;
      if (game.lives <= 0) {
        game.over = true;
        game.won = false;
      }
    }
  }
  game.fish = game.fish.filter((f) => !f.gone);
  return events;
}
