// Đào Vàng: cần câu đu qua lại như con lắc quanh 1 trục cố định.
// Bấm để thả mỏ xuống — mỏ chạm vật gì thì tự cuốn về mang theo vật đó,
// vật càng nặng (đá to) thì cuốn càng chậm, kim cương nhẹ thì cuốn rất nhanh.
// Toàn bộ file này thuần logic (không đụng DOM/canvas) để test được độc lập.

export const FIELD_W = 640;
export const FIELD_H = 640;
export const GROUND_Y = 150; // đất bắt đầu từ đây trở xuống
export const ORIGIN = { x: FIELD_W / 2, y: 70 }; // trục quay cần câu

export const TYPES = {
  gold_s: { value: 20, weight: 1.0, r: 15 },
  gold_m: { value: 50, weight: 1.6, r: 21 },
  gold_l: { value: 90, weight: 2.4, r: 28 },
  diamond: { value: 150, weight: 0.7, r: 17 },
  rock: { value: 5, weight: 3.2, r: 32 },
  skull: { value: 15, weight: 1.0, r: 17 },
  pig: { value: 35, weight: 1.2, r: 19 },
  rabbit: { value: 25, weight: 0.9, r: 17 },
  dynamite: { value: 0, weight: 1.0, r: 15, blast: true },
};

export const SHOP_ITEMS = {
  dynamite: { cost: 80, label: 'Thuốc nổ' },
  strength: { cost: 60, label: 'Nước tăng lực' },
  clover: { cost: 70, label: 'Cỏ 3 lá may mắn' },
  book: { cost: 100, label: 'Sách sưu tầm đá' },
  polish: { cost: 120, label: 'Đánh bóng kim cương' },
};

const BASE_P = {
  diamond: 0.05, dynamite: 0.07, rock: 0.10, gold_l: 0.10, gold_m: 0.18,
  gold_s: 0.18, skull: 0.12, pig: 0.10, rabbit: 0.10,
};
const GOOD = ['diamond', 'gold_l', 'gold_m'];
const BAD = ['rock', 'skull'];

/** Cỏ 3 lá may mắn dịch bớt xác suất từ đá/xương sang kim cương/vàng lớn. */
function weightedProbs(luck) {
  const p = { ...BASE_P };
  const shift = Math.min(3, luck) * 0.03;
  let taken = 0;
  for (const k of BAD) {
    const take = Math.min(p[k] * 0.5, shift / BAD.length);
    p[k] -= take;
    taken += take;
  }
  for (const k of GOOD) p[k] += taken / GOOD.length;
  return p;
}

function pickType(rng, upgrades, probOverride) {
  const p = probOverride || weightedProbs(upgrades.clover || 0);
  const roll = rng();
  let acc = 0;
  for (const type of Object.keys(p)) {
    acc += p[type];
    if (roll < acc) return type;
  }
  return 'rabbit';
}

function spawnItem(rng, upgrades, id, opts = {}) {
  const type = pickType(rng, upgrades, opts.probOverride);
  const def = TYPES[type];
  const x = def.r + 4 + rng() * (FIELD_W - (def.r + 4) * 2);
  const y = GROUND_Y + def.r + rng() * (FIELD_H - GROUND_Y - def.r - 40);
  // Biến thể "Cuộc Săn Vàng": vật phẩm bò qua lại như chuột tha đồ, phải đón đầu
  const vx = opts.drift ? (rng() < 0.5 ? -1 : 1) * (0.5 + rng() * 0.6) : 0;
  return { id, type, x, y, r: def.r, alive: true, vx };
}

/** Sách sưu tầm đá / đánh bóng kim cương tăng giá trị 2 loại vật này. */
export function itemValue(type, upgrades = {}) {
  const base = TYPES[type].value;
  if (type === 'rock') return base + (upgrades.book || 0) * 15;
  if (type === 'diamond') return base + (upgrades.polish || 0) * 40;
  return base;
}

export function makeWallet() {
  return { bank: 0, strength: 0, clover: 0, book: 0, polish: 0, dynamiteCharges: 0 };
}

export function makeLevel(levelIndex, rng = Math.random, upgrades = makeWallet(), opts = {}) {
  const n = Math.min(18, 9 + levelIndex);
  const items = [];
  for (let i = 0; i < n; i++) items.push(spawnItem(rng, upgrades, i, opts));
  return {
    level: levelIndex,
    items,
    goal: 180 + levelIndex * 110,
    timeLeft: 55,
    money: 0,
    dynamiteCount: upgrades.dynamiteCharges || 0,
    upgrades,
    // angle đo trong hệ toạ độ màn hình (y tăng xuống dưới): π/2 = thẳng đứng xuống đất
    hook: { angle: Math.PI / 2 - 0.05, dir: 1, len: 0, state: 'swing', caught: null },
    over: false,
    won: false,
  };
}

export function hookTip(game) {
  const h = game.hook;
  return { x: ORIGIN.x + Math.cos(h.angle) * h.len, y: ORIGIN.y + Math.sin(h.angle) * h.len };
}

export function fireHook(game) {
  if (game.hook.state === 'swing' && !game.over) game.hook.state = 'extend';
}

function blast(game, center) {
  center.alive = false;
  for (const it of game.items) {
    if (it.alive && it !== center && Math.hypot(it.x - center.x, it.y - center.y) < 95) {
      it.alive = false;
      game.money += Math.round(itemValue(it.type, game.upgrades) * 0.6);
    }
  }
}

/** Mìn cầm tay mua ở cửa hàng: nổ ngay quanh vị trí mỏ hiện tại, không cần câu trúng. */
export function useDynamite(game) {
  if (game.dynamiteCount <= 0 || game.hook.state !== 'swing' || game.over) return false;
  game.dynamiteCount--;
  const tip = hookTip(game);
  let hit = false;
  for (const it of game.items) {
    if (it.alive && Math.hypot(it.x - tip.x, it.y - tip.y) < 110) {
      it.alive = false;
      game.money += Math.round(itemValue(it.type, game.upgrades) * 0.6);
      hit = true;
    }
  }
  return hit;
}

function checkEnd(game) {
  if (game.money >= game.goal) { game.over = true; game.won = true; return; }
  if (game.timeLeft <= 0) { game.over = true; game.won = false; return; }
  if (game.hook.state === 'swing' && game.items.every((it) => !it.alive)) {
    game.over = true;
    game.won = false;
  }
}

/** Một bước mô phỏng. dtMs = số mili-giây trôi qua kể từ bước trước. */
export function stepGame(game, dtMs) {
  if (game.over) return game;
  const h = game.hook;
  const dt = dtMs / 16.67; // chuẩn hoá theo khung ~60fps
  const strengthMul = 1 + (game.upgrades.strength || 0) * 0.18;

  // Biến thể "Cuộc Săn Vàng": vật phẩm có vx sẽ bò qua lại, dội tường khi chạm mép sân
  for (const it of game.items) {
    if (!it.alive || !it.vx || it === h.caught) continue;
    it.x += it.vx * dt;
    if (it.x - it.r < 0) { it.x = it.r; it.vx = Math.abs(it.vx); }
    if (it.x + it.r > FIELD_W) { it.x = FIELD_W - it.r; it.vx = -Math.abs(it.vx); }
  }

  if (h.state === 'swing') {
    h.angle += h.dir * 0.026 * dt;
    if (h.angle >= Math.PI - 0.12) { h.angle = Math.PI - 0.12; h.dir = -1; }
    if (h.angle <= 0.12) { h.angle = 0.12; h.dir = 1; }
  } else if (h.state === 'extend') {
    h.len += 15 * strengthMul * dt;
    const tip = hookTip(game);
    for (const it of game.items) {
      if (!it.alive) continue;
      if (Math.hypot(tip.x - it.x, tip.y - it.y) < it.r + 7) {
        if (TYPES[it.type].blast) {
          // Mìn nổ NGAY tại chỗ chạm — không cuốn về, mỏ thu lại tay không
          blast(game, it);
        } else {
          h.caught = it;
        }
        h.state = 'retract';
        break;
      }
    }
    if (h.len > 640 || tip.y > FIELD_H + 20) h.state = 'retract';
  } else if (h.state === 'retract') {
    const w = h.caught ? TYPES[h.caught.type].weight : 1;
    const speed = (h.caught ? 11 / w : 22) * strengthMul;
    h.len = Math.max(0, h.len - speed * dt);
    if (h.caught) {
      const tip = hookTip(game);
      h.caught.x = tip.x;
      h.caught.y = tip.y;
    }
    if (h.len <= 0) {
      if (h.caught) {
        game.money += itemValue(h.caught.type, game.upgrades);
        h.caught.alive = false;
        h.caught = null;
      }
      h.state = 'swing';
    }
  }

  game.timeLeft = Math.max(0, game.timeLeft - dtMs / 1000);
  checkEnd(game);
  return game;
}

export function buyUpgrade(wallet, key) {
  const def = SHOP_ITEMS[key];
  if (!def || wallet.bank < def.cost) return false;
  wallet.bank -= def.cost;
  if (key === 'dynamite') wallet.dynamiteCharges = (wallet.dynamiteCharges || 0) + 1;
  else wallet[key] = (wallet[key] || 0) + 1;
  return true;
}

export function bankLevelMoney(game, wallet) {
  wallet.bank += game.money;
  return wallet;
}
