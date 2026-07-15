// Vườn Rau Thần Kỳ: trồng cây phòng thủ theo 5 hàng ngang để xua đuổi côn trùng phá hoại
// đang bò từ mép phải sang. Cơ chế tower-defense theo làn (lấy cảm hứng, không sao chép
// thiết kế/tên gọi của bất kỳ game thương mại nào). Toàn bộ file này thuần logic, test độc lập.

export const ROWS = 5;
export const COLS = 8;
export const START_LIVES = 3;
// Đủ để trồng ngay 2 cây bắn (Đậu Xanh, mỗi cây chỉ bắn được côn trùng CÙNG HÀNG với nó) —
// tránh tình trạng bé mới vào đã không đủ nước tưới phòng thủ nổi 1 hàng nào.
export const START_WATER = 90;

export const PLANTS = {
  hoa_nang: { name: 'Hoa Mặt Trời', emoji: '🌻', cost: 25, hp: 20, kind: 'generator', cooldownMs: 6000, genAmount: 20 },
  dau_xanh: { name: 'Đậu Xanh', emoji: '🌱', cost: 40, hp: 25, kind: 'shooter', cooldownMs: 1400, damage: 8 },
  xuong_rong: { name: 'Xương Rồng Gai', emoji: '🌵', cost: 60, hp: 90, kind: 'wall' },
};

export const BUGS = {
  small: { name: 'Sâu Nhỏ', emoji: '🐛', hp: 20, speed: 0.5, dmgToPlant: 4 },
  big: { name: 'Bọ To', emoji: '🦗', hp: 50, speed: 0.3, dmgToPlant: 8 },
};

export function makeLevel(levelIndex, rng = Math.random) {
  return {
    level: levelIndex,
    grid: Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
    bugs: [],
    water: START_WATER,
    lives: START_LIVES,
    bugsPerWave: 8 + levelIndex * 2,
    spawnedThisWave: 0,
    spawnEveryMs: Math.max(900, 2200 - levelIndex * 80),
    spawnTimer: 0,
    score: 0,
    over: false,
    won: false,
  };
}

/** Trồng cây tại (row,col) nếu ô trống và đủ nước tưới. Trả true nếu trồng thành công. */
export function plantAt(game, row, col, type) {
  if (game.over) return false;
  if (game.grid[row][col]) return false;
  const def = PLANTS[type];
  if (!def || game.water < def.cost) return false;
  game.water -= def.cost;
  game.grid[row][col] = { type, hp: def.hp, cooldown: 0 };
  return true;
}

function checkEnd(game) {
  if (game.lives <= 0) { game.over = true; game.won = false; return; }
  if (game.spawnedThisWave >= game.bugsPerWave && game.bugs.length === 0) {
    game.over = true;
    game.won = true;
  }
}

/** Một bước mô phỏng. dtMs = số mili-giây trôi qua kể từ bước trước. */
export function stepGame(game, dtMs, rng = Math.random) {
  if (game.over) return game;

  // Cây tạo nước tưới theo nhịp
  for (const row of game.grid) {
    for (const cell of row) {
      if (!cell || PLANTS[cell.type].kind !== 'generator') continue;
      cell.cooldown -= dtMs;
      if (cell.cooldown <= 0) {
        game.water += PLANTS[cell.type].genAmount;
        cell.cooldown = PLANTS[cell.type].cooldownMs;
      }
    }
  }

  // Sinh côn trùng theo đợt (mỗi hàng ngẫu nhiên)
  game.spawnTimer += dtMs;
  if (game.spawnedThisWave < game.bugsPerWave && game.spawnTimer >= game.spawnEveryMs) {
    game.spawnTimer = 0;
    const row = Math.floor(rng() * ROWS);
    const type = rng() < 0.7 ? 'small' : 'big';
    game.bugs.push({ row, x: COLS, hp: BUGS[type].hp, type, attackCooldown: 0 });
    game.spawnedThisWave++;
  }

  // Côn trùng: bò sang trái, hoặc cắn phá cây đang chắn đường
  for (const bug of game.bugs) {
    const blockCol = Math.floor(bug.x);
    const blocking = blockCol >= 0 && blockCol < COLS ? game.grid[bug.row][blockCol] : null;
    if (blocking) {
      bug.attackCooldown -= dtMs;
      if (bug.attackCooldown <= 0) {
        blocking.hp -= BUGS[bug.type].dmgToPlant;
        bug.attackCooldown = 500;
        if (blocking.hp <= 0) game.grid[bug.row][blockCol] = null;
      }
    } else {
      bug.x -= BUGS[bug.type].speed * (dtMs / 1000);
    }
  }

  // Cây bắn tấn công côn trùng gần nhất còn trong tầm ở đúng hàng
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = game.grid[r][c];
      if (!cell || PLANTS[cell.type].kind !== 'shooter') continue;
      cell.cooldown -= dtMs;
      if (cell.cooldown > 0) continue;
      const targets = game.bugs.filter((b) => b.row === r && b.x >= c).sort((a, b) => a.x - b.x);
      if (targets.length) {
        targets[0].hp -= PLANTS[cell.type].damage;
        cell.cooldown = PLANTS[cell.type].cooldownMs;
      }
    }
  }

  // Côn trùng bị hạ → cộng điểm, loại khỏi sân
  for (const b of game.bugs) if (b.hp <= 0) game.score += 10;
  game.bugs = game.bugs.filter((b) => b.hp > 0);

  // Côn trùng lọt tới nhà → mất mạng
  const reached = game.bugs.filter((b) => b.x <= 0).length;
  if (reached) game.lives -= reached;
  game.bugs = game.bugs.filter((b) => b.x > 0);

  checkEnd(game);
  return game;
}
