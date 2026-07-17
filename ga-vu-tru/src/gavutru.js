// Gà Vũ Trụ Xâm Lăng: đàn gà cưỡi UFO bay VÀO ĐỘI HÌNH rồi lắc lư thả trứng xuống —
// bé kéo máy bay né trứng, súng tự bắn, nhặt sao nâng cấp lên 3 nòng, hạ hết đội hình
// thì TRÙM UFO khổng lồ xuất hiện. Cơ chế "bắn đội hình xâm lăng" là thể loại kinh điển
// từ thập niên 78-81; theme gà-cưỡi-UFO + toàn bộ mã tự thiết kế, sprite Kenney CC0.
// Khác Phi Đội Nhí (vật cản rơi thẳng): ở đây địch BAY VÀO SLOT đội hình rồi mới tấn công.
// Toàn bộ file này thuần logic, test được độc lập.

export const FIELD_W = 640;
export const FIELD_H = 640;
export const PLANE_Y = FIELD_H - 60;
export const PLANE_R = 22;
export const BULLET_SPEED = 9;
export const EGG_SPEED = 3.2;
export const FIRE_COOLDOWN = 300;
export const START_LIVES = 3;
export const ENTER_SPEED = 5; // tốc độ bay vào slot đội hình
export const SWAY_AMP = 46; // biên độ lắc ngang của cả đội hình
export const MAX_WEAPON = 3;

/** Đội hình theo màn: cột × hàng tăng dần, trứng thả dày dần. */
export function formationFor(levelIndex) {
  return {
    cols: Math.min(8, 5 + Math.floor(levelIndex / 2)),
    rows: Math.min(4, 2 + Math.floor(levelIndex / 3)),
    eggEveryMs: Math.max(500, 1000 - levelIndex * 60),
    bossHp: 14 + levelIndex * 5,
  };
}

/** Vị trí slot (i-th) trong đội hình — căn giữa phía trên sân. */
export function slotPos(form, index) {
  const col = index % form.cols;
  const row = Math.floor(index / form.cols);
  const spacing = Math.min(70, (FIELD_W - 120) / form.cols);
  const x0 = FIELD_W / 2 - ((form.cols - 1) * spacing) / 2;
  return { x: x0 + col * spacing, y: 80 + row * 58 };
}

export function makeLevel(levelIndex, rng = Math.random) {
  const form = formationFor(levelIndex);
  const enemies = [];
  for (let i = 0; i < form.cols * form.rows; i++) {
    const slot = slotPos(form, i);
    const fromLeft = i % 2 === 0;
    enemies.push({
      slot,
      x: fromLeft ? -40 - (i % form.cols) * 30 : FIELD_W + 40 + (i % form.cols) * 30,
      y: 40 + rng() * 80,
      hp: Math.floor(i / form.cols) === 0 ? 2 : 1, // hàng đầu (gần nhất) cứng hơn
      entered: false,
    });
  }
  return {
    level: levelIndex,
    form,
    phase: 'formation', // 'formation' → 'boss'
    plane: { x: FIELD_W / 2 },
    weapon: 1,
    bullets: [],
    eggs: [],
    stars: [],
    enemies,
    boss: null,
    lives: START_LIVES,
    invincibleMs: 0,
    score: 0,
    swayT: 0,
    eggTimer: 0,
    fireTimer: 0,
    over: false,
    won: false,
  };
}

export function movePlane(game, dx) {
  game.plane.x = Math.max(PLANE_R, Math.min(FIELD_W - PLANE_R, game.plane.x + dx));
}

/** Súng tự bắn: 1–3 viên tùy cấp vũ khí. */
function autoFire(game) {
  if (game.fireTimer > 0) return;
  game.fireTimer = FIRE_COOLDOWN;
  const spread = [[0], [-10, 10], [-16, 0, 16]][game.weapon - 1];
  for (const off of spread) {
    game.bullets.push({ x: game.plane.x + off, y: PLANE_Y - PLANE_R });
  }
}

function hurtPlayer(game) {
  if (game.invincibleMs > 0) return false;
  game.lives--;
  game.invincibleMs = 1800;
  game.weapon = Math.max(1, game.weapon - 1); // trúng đòn tụt 1 cấp súng
  if (game.lives <= 0) {
    game.over = true;
    game.won = false;
  }
  return true;
}

/**
 * Một bước mô phỏng. Trả về sự kiện:
 * { killed, hit: trúng đòn?, star: nhặt sao?, bossSpawned, bossHit }
 */
export function stepGame(game, dtMs, rng = Math.random) {
  const ev = { killed: 0, hit: false, star: false, bossSpawned: false, bossHit: false };
  if (game.over) return ev;
  const dt = dtMs / 16.67;
  game.fireTimer = Math.max(0, game.fireTimer - dtMs);
  game.invincibleMs = Math.max(0, game.invincibleMs - dtMs);
  game.swayT += dtMs / 1000;
  autoFire(game);

  for (const b of game.bullets) b.y -= BULLET_SPEED * dt;
  game.bullets = game.bullets.filter((b) => !b.hit && b.y > -20);
  for (const e2 of game.eggs) e2.y += EGG_SPEED * dt;
  for (const s of game.stars) s.y += 2 * dt;

  const sway = Math.sin(game.swayT * 1.5) * SWAY_AMP;

  if (game.phase === 'formation') {
    // gà bay vào slot, vào rồi thì lắc lư theo đội hình
    for (const e of game.enemies) {
      if (!e.entered) {
        const tx = e.slot.x;
        const ty = e.slot.y;
        const d = Math.hypot(tx - e.x, ty - e.y);
        if (d < ENTER_SPEED * dt + 1) {
          e.x = tx;
          e.y = ty;
          e.entered = true;
        } else {
          e.x += ((tx - e.x) / d) * ENTER_SPEED * dt;
          e.y += ((ty - e.y) / d) * ENTER_SPEED * dt;
        }
      } else {
        e.x = e.slot.x + sway;
        e.y = e.slot.y + Math.sin(game.swayT * 2 + e.slot.x * 0.05) * 6;
      }
    }
    // thả trứng từ 1 con đã vào đội hình
    game.eggTimer += dtMs;
    if (game.eggTimer >= game.form.eggEveryMs) {
      game.eggTimer = 0;
      const settled = game.enemies.filter((e) => e.entered);
      if (settled.length) {
        const e = settled[Math.floor(rng() * settled.length)];
        game.eggs.push({ x: e.x, y: e.y + 18 });
      }
    }
    // đạn trúng gà
    for (const e of game.enemies) {
      for (const b of game.bullets) {
        if (b.hit) continue;
        if (Math.hypot(e.x - b.x, e.y - b.y) < 26) {
          b.hit = true;
          e.hp--;
        }
      }
    }
    const killedNow = game.enemies.filter((e) => e.hp <= 0);
    for (const e of killedNow) {
      game.score += 15;
      ev.killed++;
      if (rng() < 0.18) game.stars.push({ x: e.x, y: e.y }); // sao nâng cấp rơi ra
    }
    game.enemies = game.enemies.filter((e) => e.hp > 0);
    // sạch đội hình → trùm xuất hiện
    if (game.enemies.length === 0) {
      game.phase = 'boss';
      game.boss = {
        x: FIELD_W / 2, y: -60, hp: game.form.bossHp, maxHp: game.form.bossHp, vx: 2.2,
      };
      ev.bossSpawned = true;
    }
  } else if (game.boss) {
    const boss = game.boss;
    if (boss.y < 110) boss.y += 2 * dt; // trùm hạ xuống sân khấu
    boss.x += boss.vx * dt;
    if (boss.x < 70 || boss.x > FIELD_W - 70) boss.vx = -boss.vx;
    game.eggTimer += dtMs;
    if (game.eggTimer >= Math.max(360, game.form.eggEveryMs - 250)) {
      game.eggTimer = 0;
      game.eggs.push({ x: boss.x - 26, y: boss.y + 24 });
      game.eggs.push({ x: boss.x + 26, y: boss.y + 24 });
    }
    for (const b of game.bullets) {
      if (b.hit) continue;
      if (Math.hypot(boss.x - b.x, boss.y - b.y) < 52) {
        b.hit = true;
        boss.hp--;
        ev.bossHit = true;
      }
    }
    if (boss.hp <= 0) {
      game.score += 150 + game.lives * 30;
      game.over = true;
      game.won = true;
      return ev;
    }
  }
  game.bullets = game.bullets.filter((b) => !b.hit);

  // trứng rơi trúng máy bay
  for (const e2 of game.eggs) {
    if (!e2.done && Math.hypot(e2.x - game.plane.x, e2.y - PLANE_Y) < PLANE_R + 9) {
      e2.done = true;
      if (hurtPlayer(game)) ev.hit = true;
    }
  }
  game.eggs = game.eggs.filter((e2) => !e2.done && e2.y < FIELD_H + 20);

  // nhặt sao → nâng cấp súng
  for (const s of game.stars) {
    if (!s.done && Math.hypot(s.x - game.plane.x, s.y - PLANE_Y) < PLANE_R + 14) {
      s.done = true;
      game.weapon = Math.min(MAX_WEAPON, game.weapon + 1);
      game.score += 20;
      ev.star = true;
    }
  }
  game.stars = game.stars.filter((s) => !s.done && s.y < FIELD_H + 20);

  return ev;
}
