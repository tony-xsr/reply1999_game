// Tay Đua Nhí: đua xe nhìn từ trên xuống 4 làn — chạm/lái để đổi làn, né xe chậm phía
// trước, nhặt bình nitro tăng tốc có vệt sáng, chạy đủ quãng đường tới VẠCH ĐÍCH là qua màn.
// Thể loại đua né làn kinh điển; xe dùng Kenney Racing Pack (CC0), không logo hãng thật.
// Toàn bộ file này thuần logic (không đụng canvas/DOM), test được độc lập.

export const FIELD_W = 480;
export const FIELD_H = 640;
export const LANES = 4;
export const ROAD_X = 40; // mép đường trái
export const ROAD_W = FIELD_W - 80;
export const CAR_W = 52;
export const CAR_H = 88;
export const PLAYER_Y = 500; // tâm xe của bé
export const START_LIVES = 3;
export const BASE_SPEED = 5; // px/khung — tốc độ cuộn đường cơ bản
export const NITRO_SPEED = 9;
export const NITRO_MS = 2200;
export const LANE_LERP = 0.22; // xe trườn mượt sang làn mới

export function laneX(lane) {
  return ROAD_X + (ROAD_W / LANES) * (lane + 0.5);
}

/** Mỗi màn: quãng đường dài hơn, xe đông hơn. */
export function makeLevel(levelIndex) {
  return {
    level: levelIndex,
    lane: 1,
    x: laneX(1),
    lives: START_LIVES,
    invincibleMs: 0,
    speed: BASE_SPEED,
    nitroMs: 0,
    distance: 0,
    target: 5000 + levelIndex * 2500, // quãng đường cần chạy
    traffic: [], // {lane, y, kind: 'car'|'cone', color, passed}
    pickups: [], // {lane, y, done} — bình nitro
    spawnGapPx: Math.max(190, 300 - levelIndex * 15), // xe càng màn cao càng dày
    spawnAcc: 0,
    score: 0,
    over: false,
    won: false,
    finishY: null, // vạch đích xuất hiện khi gần tới nơi
  };
}

/** Chuyển làn (kẹp trong 0..3). */
export function steer(game, dir) {
  game.lane = Math.max(0, Math.min(LANES - 1, game.lane + dir));
}

/** Chọn thẳng làn theo vị trí chạm (giao diện đưa x đã quy về tọa độ sân). */
export function steerTo(game, x) {
  const lane = Math.floor(((x - ROAD_X) / ROAD_W) * LANES);
  game.lane = Math.max(0, Math.min(LANES - 1, lane));
}

/** Sinh 1 lượt xe phía trước: 1–2 xe ở các làn KHÁC nhau, luôn chừa ít nhất 2 làn trống. */
export function spawnTraffic(game, rng = Math.random) {
  const count = 1 + (rng() < 0.45 ? 1 : 0);
  const lanes = [0, 1, 2, 3].sort(() => rng() - 0.5).slice(0, count);
  for (const lane of lanes) {
    game.traffic.push({
      lane,
      y: -CAR_H - rng() * 60,
      kind: rng() < 0.2 ? 'cone' : 'car',
      color: Math.floor(rng() * 5),
      passed: false,
    });
  }
  if (rng() < 0.22) {
    const used = new Set(lanes);
    const free = [0, 1, 2, 3].filter((l) => !used.has(l));
    game.pickups.push({ lane: free[Math.floor(rng() * free.length)], y: -160, done: false });
  }
  return lanes;
}

/**
 * Một bước mô phỏng. Trả về sự kiện:
 * { crash, overtake, nitro, finishVisible, won }
 */
export function stepGame(game, dtMs, rng = Math.random) {
  const ev = { crash: false, overtake: 0, nitro: false, finishVisible: false, won: false };
  if (game.over) return ev;
  const dt = dtMs / 16.67;

  game.invincibleMs = Math.max(0, game.invincibleMs - dtMs);
  game.nitroMs = Math.max(0, game.nitroMs - dtMs);
  game.speed = game.nitroMs > 0 ? NITRO_SPEED : BASE_SPEED;

  // xe của bé trườn mượt về tâm làn
  game.x += (laneX(game.lane) - game.x) * Math.min(1, LANE_LERP * dt);

  const scroll = game.speed * dt;
  game.distance += scroll;

  // vạch đích ló ra khi sắp đủ quãng đường
  if (game.finishY === null && game.distance >= game.target) {
    game.finishY = -60;
    ev.finishVisible = true;
  }
  if (game.finishY !== null) {
    game.finishY += scroll;
    if (game.finishY >= PLAYER_Y) {
      game.over = true;
      game.won = true;
      game.score += 100 + game.lives * 30;
      ev.won = true;
      return ev;
    }
  } else {
    // chỉ sinh thêm xe khi chưa thấy vạch đích (đoạn cuối để trống ăn mừng)
    game.spawnAcc += scroll;
    if (game.spawnAcc >= game.spawnGapPx) {
      game.spawnAcc = 0;
      spawnTraffic(game, rng);
    }
  }

  // xe khác trôi xuống (mình chạy nhanh hơn họ)
  for (const c of game.traffic) {
    c.y += (c.kind === 'cone' ? scroll : scroll * 0.55);
    if (!c.passed && c.y > PLAYER_Y + CAR_H) {
      c.passed = true;
      game.score += 5;
      ev.overtake++;
    }
    // va chạm cùng làn
    if (game.invincibleMs <= 0
      && c.lane === game.lane
      && Math.abs(c.y - PLAYER_Y) < CAR_H * 0.82
      && Math.abs(laneX(c.lane) - game.x) < CAR_W * 0.6) {
      game.lives--;
      game.invincibleMs = 1800;
      game.nitroMs = 0;
      ev.crash = true;
      if (game.lives <= 0) {
        game.over = true;
        game.won = false;
        return ev;
      }
    }
  }
  game.traffic = game.traffic.filter((c) => c.y < FIELD_H + CAR_H);

  for (const p of game.pickups) {
    p.y += scroll;
    if (!p.done && p.lane === game.lane && Math.abs(p.y - PLAYER_Y) < CAR_H * 0.7) {
      p.done = true;
      game.nitroMs = NITRO_MS;
      game.score += 15;
      ev.nitro = true;
    }
  }
  game.pickups = game.pickups.filter((p) => !p.done && p.y < FIELD_H + 40);

  return ev;
}
