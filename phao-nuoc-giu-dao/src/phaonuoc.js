// Pháo Nước Giữ Đảo: bé ngồi ụ PHÁO NƯỚC giữa đảo cát, thuyền giấy + robot đồ chơi
// tinh nghịch ập vào từ mọi hướng đòi phá lâu đài cát — chạm đâu pháo phun bóng nước
// tới đó, trúng thì robot ướt sũng bung thành kẹo. Đạn có hạn, phải bấm nút NẠP NƯỚC.
// "Hiền hóa" từ thể loại phòng thủ ụ súng cố định: không súng thật, không phe quân sự,
// toàn bộ hình tự vẽ. File thuần logic (không đụng canvas/DOM), test được độc lập.

export const FIELD_W = 640;
export const FIELD_H = 640;
export const CX = FIELD_W / 2;
export const CY = FIELD_H / 2;
export const R_ISLAND = 105; // mép cát — địch chạm tới đây là "quậy" lâu đài
export const SPAWN_R = 380; // địch xuất hiện ngoài rìa màn
export const CASTLE_HP = 3;
export const MAX_AMMO = 8;
export const RELOAD_MS = 1500;
export const FIRE_COOLDOWN = 260;
export const SHOT_SPEED = 11; // bóng nước bay px/khung
export const SPLASH_R = 52; // bán kính nước bắn tung tóe

/** Các loại khách không mời: thuyền giấy nhanh mà mềm, robot đồ chơi lì đòn hơn. */
export const ENEMY_TYPES = {
  boat: { hp: 1, speed: 1.5, score: 10 },
  robot: { hp: 2, speed: 1.0, score: 20 },
  bigbot: { hp: 4, speed: 0.7, score: 40 },
};

/** Mỗi màn nhiều đợt sóng; đợt sau đông và lì hơn. */
export function wavesFor(levelIndex) {
  const waves = [];
  const count = 2 + Math.min(3, levelIndex);
  for (let w = 0; w < count; w++) {
    waves.push({
      boats: 4 + w * 2 + levelIndex,
      robots: w >= 1 ? 2 + w + Math.floor(levelIndex / 2) : 0,
      bigbots: w >= 2 ? 1 + Math.floor(levelIndex / 2) : 0,
      spawnEveryMs: Math.max(450, 1000 - w * 150 - levelIndex * 50),
    });
  }
  return waves;
}

export function makeLevel(levelIndex, rng = Math.random) {
  return {
    level: levelIndex,
    waves: wavesFor(levelIndex),
    waveIndex: 0,
    spawnQueue: [], // loại địch còn chờ ra trong đợt hiện tại
    spawnTimer: 0,
    wavePauseMs: 0, // nghỉ giữa 2 đợt
    enemies: [],
    shots: [], // bóng nước đang bay: {x, y, tx, ty, vx, vy}
    ammo: MAX_AMMO,
    reloadingMs: 0,
    cooldownMs: 0,
    aimAngle: -Math.PI / 2,
    castleHp: CASTLE_HP,
    score: 0,
    over: false,
    won: false,
    _waveLoaded: false,
  };
}

function loadWave(game, rng) {
  const w = game.waves[game.waveIndex];
  const queue = [];
  for (let i = 0; i < w.boats; i++) queue.push('boat');
  for (let i = 0; i < w.robots; i++) queue.push('robot');
  for (let i = 0; i < w.bigbots; i++) queue.push('bigbot');
  // xáo trộn để các loại ra xen kẽ
  for (let i = queue.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [queue[i], queue[j]] = [queue[j], queue[i]];
  }
  game.spawnQueue = queue;
  game.spawnTimer = 0;
  game._waveLoaded = true;
}

/** Sinh 1 địch ở rìa màn theo hướng ngẫu nhiên, nhắm thẳng vào đảo. */
export function spawnEnemy(game, type, rng = Math.random) {
  const a = rng() * Math.PI * 2;
  const def = ENEMY_TYPES[type];
  const e = {
    type,
    x: CX + Math.cos(a) * SPAWN_R,
    y: CY + Math.sin(a) * SPAWN_R,
    hp: def.hp,
    speed: def.speed * (1 + game.level * 0.05),
    wobble: rng() * Math.PI * 2,
  };
  game.enemies.push(e);
  return e;
}

/** Chạm để bắn: pháo quay theo hướng chạm rồi phun 1 bóng nước bay tới điểm đó. */
export function fire(game, tx, ty) {
  if (game.over || game.ammo <= 0 || game.reloadingMs > 0 || game.cooldownMs > 0) return false;
  // không bắn vào chính giữa đảo (điểm chạm quá gần pháo)
  const d = Math.hypot(tx - CX, ty - CY);
  if (d < 40) return false;
  game.aimAngle = Math.atan2(ty - CY, tx - CX);
  const vx = ((tx - CX) / d) * SHOT_SPEED;
  const vy = ((ty - CY) / d) * SHOT_SPEED;
  game.shots.push({ x: CX, y: CY, tx, ty, vx, vy });
  game.ammo--;
  game.cooldownMs = FIRE_COOLDOWN;
  return true;
}

/** Bấm nút NẠP NƯỚC: đổ đầy lại bình sau RELOAD_MS (đang nạp thì không bắn được). */
export function reload(game) {
  if (game.over || game.reloadingMs > 0 || game.ammo === MAX_AMMO) return false;
  game.reloadingMs = RELOAD_MS;
  return true;
}

/**
 * Một bước mô phỏng. Trả về sự kiện:
 * { splash: [{x,y}], killed, castleHit, waveStart, reloaded }
 */
export function stepGame(game, dtMs, rng = Math.random) {
  const ev = { splash: [], killed: 0, castleHit: false, waveStart: false, reloaded: false };
  if (game.over) return ev;
  const dt = dtMs / 16.67;

  game.cooldownMs = Math.max(0, game.cooldownMs - dtMs);
  if (game.reloadingMs > 0) {
    game.reloadingMs -= dtMs;
    if (game.reloadingMs <= 0) {
      game.reloadingMs = 0;
      game.ammo = MAX_AMMO;
      ev.reloaded = true;
    }
  }

  // ===== Đợt sóng & sinh địch =====
  if (game.wavePauseMs > 0) {
    game.wavePauseMs -= dtMs;
    if (game.wavePauseMs <= 0) {
      loadWave(game, rng);
      ev.waveStart = true;
    }
  } else if (!game._waveLoaded) {
    loadWave(game, rng);
    ev.waveStart = true;
  } else if (game.spawnQueue.length > 0) {
    game.spawnTimer += dtMs;
    if (game.spawnTimer >= game.waves[game.waveIndex].spawnEveryMs) {
      game.spawnTimer = 0;
      spawnEnemy(game, game.spawnQueue.pop(), rng);
    }
  } else if (game.enemies.length === 0) {
    // sạch đợt hiện tại
    if (game.waveIndex >= game.waves.length - 1) {
      game.over = true;
      game.won = true;
      game.score += 50 + game.castleHp * 30;
      return ev;
    }
    game.waveIndex++;
    game._waveLoaded = false;
    game.wavePauseMs = 2000;
  }

  // ===== Địch bơi vào đảo (lượn sóng nhẹ cho sống động) =====
  for (const e of game.enemies) {
    const d = Math.hypot(CX - e.x, CY - e.y);
    if (d > 1) {
      const drift = Math.sin(e.wobble + d * 0.02) * 0.35;
      const ux = (CX - e.x) / d;
      const uy = (CY - e.y) / d;
      e.x += (ux * e.speed - uy * drift) * dt;
      e.y += (uy * e.speed + ux * drift) * dt;
    }
    if (Math.hypot(CX - e.x, CY - e.y) <= R_ISLAND) {
      e.gone = true; // quậy xong lâu đài rồi chuồn
      game.castleHp--;
      ev.castleHit = true;
    }
  }
  game.enemies = game.enemies.filter((e) => !e.gone);
  if (game.castleHp <= 0) {
    game.over = true;
    game.won = false;
    return ev;
  }

  // ===== Bóng nước bay tới điểm chạm rồi TÙM — nước văng trúng cả cụm =====
  for (const s of game.shots) {
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    const remain = Math.hypot(s.tx - s.x, s.ty - s.y);
    if (remain <= SHOT_SPEED * dt + 1) {
      s.done = true;
      ev.splash.push({ x: s.tx, y: s.ty });
      for (const e of game.enemies) {
        if (Math.hypot(e.x - s.tx, e.y - s.ty) <= SPLASH_R) {
          e.hp--;
          if (e.hp <= 0) {
            e.gone = true;
            game.score += ENEMY_TYPES[e.type].score;
            ev.killed++;
          }
        }
      }
    }
  }
  game.shots = game.shots.filter((s) => !s.done);
  game.enemies = game.enemies.filter((e) => !e.gone);

  return ev;
}
