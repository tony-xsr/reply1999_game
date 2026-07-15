// Phi Đội Nhí: máy bay của bé bay lên bầu trời, né/bắn vật cản (thiên thạch, ong, mây giông
// — không phải "phe địch", giữ tinh thần giải trí lành mạnh), nhặt sao thưởng điểm.
// Toàn bộ file này thuần logic (không đụng canvas/DOM), test được độc lập.

export const FIELD_W = 640;
export const FIELD_H = 640;
export const PLANE_Y = FIELD_H - 60;
export const PLANE_R = 22;
export const BULLET_SPEED = 9;
export const BULLET_R = 6;
export const FIRE_COOLDOWN = 260;
export const START_LIVES = 3;

export const OBSTACLE_TYPES = {
  meteor: { r: 24, hp: 1, speed: 2.2, score: 10 },
  wasp: { r: 18, hp: 1, speed: 3.0, score: 15 },
  cloud: { r: 30, hp: 2, speed: 1.6, score: 20 },
  boss: { r: 46, hp: 6, speed: 1.0, score: 100 },
};

function pickType(spawnedCount, totalObstacles, rng) {
  if (spawnedCount === totalObstacles - 1) return 'boss'; // vật cản cuối màn luôn là "trùm"
  const roll = rng();
  if (roll < 0.4) return 'meteor';
  if (roll < 0.75) return 'wasp';
  return 'cloud';
}

export function makeLevel(levelIndex, rng = Math.random) {
  return {
    level: levelIndex,
    plane: { x: FIELD_W / 2 },
    bullets: [],
    obstacles: [],
    powerups: [],
    score: 0,
    lives: START_LIVES,
    totalObstacles: 12 + levelIndex * 3,
    spawnedCount: 0,
    spawnEveryMs: Math.max(500, 1100 - levelIndex * 40),
    spawnTimer: 0,
    fireTimer: 0,
    over: false,
    won: false,
  };
}

export function movePlane(game, dx) {
  game.plane.x = Math.max(PLANE_R, Math.min(FIELD_W - PLANE_R, game.plane.x + dx));
}

export function fireBullet(game) {
  if (game.over || game.fireTimer > 0) return false;
  game.bullets.push({ x: game.plane.x, y: PLANE_Y - PLANE_R });
  game.fireTimer = FIRE_COOLDOWN;
  return true;
}

function checkEnd(game) {
  if (game.lives <= 0) { game.over = true; game.won = false; return; }
  if (game.spawnedCount >= game.totalObstacles && game.obstacles.length === 0) {
    game.over = true;
    game.won = true;
  }
}

/** Một bước mô phỏng. dtMs = số mili-giây trôi qua kể từ bước trước. */
export function stepGame(game, dtMs, rng = Math.random) {
  if (game.over) return game;
  const dt = dtMs / 16.67;
  game.fireTimer = Math.max(0, game.fireTimer - dtMs);

  // Sinh vật cản mới theo nhịp thời gian
  game.spawnTimer += dtMs;
  if (game.spawnedCount < game.totalObstacles && game.spawnTimer >= game.spawnEveryMs) {
    game.spawnTimer = 0;
    const type = pickType(game.spawnedCount, game.totalObstacles, rng);
    const def = OBSTACLE_TYPES[type];
    game.obstacles.push({
      type, x: def.r + rng() * (FIELD_W - def.r * 2), y: -def.r, r: def.r, hp: def.hp, speed: def.speed,
    });
    game.spawnedCount++;
  }

  for (const b of game.bullets) b.y -= BULLET_SPEED * dt;
  for (const o of game.obstacles) o.y += o.speed * dt;
  for (const p of game.powerups) p.y += 2 * dt;

  // Đạn trúng vật cản
  for (const o of game.obstacles) {
    for (const b of game.bullets) {
      if (b.hit) continue;
      if (Math.hypot(o.x - b.x, o.y - b.y) < o.r + BULLET_R) {
        b.hit = true;
        o.hp--;
      }
    }
  }
  game.bullets = game.bullets.filter((b) => !b.hit && b.y > -20);

  // Vật cản bị bắn vỡ → cộng điểm, có cơ hội rơi vật phẩm thưởng
  for (const o of game.obstacles) {
    if (o.hp <= 0) {
      game.score += OBSTACLE_TYPES[o.type].score;
      if (rng() < 0.2) game.powerups.push({ x: o.x, y: o.y, r: 14 });
    }
  }
  game.obstacles = game.obstacles.filter((o) => o.hp > 0);

  // Máy bay va chạm vật cản còn sống → mất 1 mạng, vật cản biến mất không tính điểm
  for (const o of game.obstacles) {
    if (Math.hypot(o.x - game.plane.x, o.y - PLANE_Y) < o.r + PLANE_R) {
      game.lives--;
      o.hp = 0;
    }
  }
  game.obstacles = game.obstacles.filter((o) => o.hp > 0 && o.y - o.r < FIELD_H + 20);

  // Nhặt vật phẩm thưởng
  for (const p of game.powerups) {
    if (!p.collected && Math.hypot(p.x - game.plane.x, p.y - PLANE_Y) < p.r + PLANE_R) {
      p.collected = true;
      game.score += 30;
    }
  }
  game.powerups = game.powerups.filter((p) => !p.collected && p.y < FIELD_H + 20);

  checkEnd(game);
  return game;
}
