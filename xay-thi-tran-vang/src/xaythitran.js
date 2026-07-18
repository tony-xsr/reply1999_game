// Xây Thị Trấn Vàng: 2 pha xen kẽ — lái XE GOÒNG trong hầm mỏ hứng vàng rơi (né đá),
// rồi mang vàng về XÂY thị trấn: mỗi công trình nâng dần nhiều cấp, xây đủ hết là mở
// thị trấn mới to hơn. Tiến độ LƯU LẠI, chơi tiếp hôm sau vẫn còn. Cơ chế "kiếm tài nguyên
// → xây dựng" thuộc thể loại chung; toàn bộ công trình tự thiết kế/tự vẽ. Thuần logic.

export const FIELD_W = 640;
export const FIELD_H = 640;
export const CART_Y = FIELD_H - 70;
export const CART_W = 96;
export const CART_H = 46;
export const RUN_MS = 45000; // mỗi chuyến xe 45 giây
export const GRAVITY = 0.16;
export const STUN_MS = 1200;

/** Vật rơi trong hầm: xu, túi vàng, kim cương — và đá phải né. */
export const DROPS = {
  coin: { value: 5, r: 16 },
  bag: { value: 15, r: 20 },
  gem: { value: 40, r: 16 },
  rock: { value: 0, r: 22 },
};

/** Các công trình của thị trấn — mỗi cái nhiều cấp, giá tăng dần. */
export const BUILDINGS = [
  { id: 'nha', name: 'Nhà Dân', costs: [60, 150, 320] },
  { id: 'cuahang', name: 'Cửa Hàng', costs: [100, 240, 480] },
  { id: 'daiphun', name: 'Đài Phun Nước', costs: [120, 300] },
  { id: 'thapdongho', name: 'Tháp Đồng Hồ', costs: [200, 420, 800] },
  { id: 'vuoncay', name: 'Vườn Cây', costs: [80, 180] },
  { id: 'congthanh', name: 'Cổng Thành Vàng', costs: [500, 1000] },
];

/** Giá nhân theo thị trấn thứ mấy (level). */
export function costOf(building, currentLevel, townLevel) {
  return Math.round(building.costs[currentLevel] * (1 + townLevel * 0.5));
}

export function makeTown(townLevel = 0) {
  const built = {};
  for (const b of BUILDINGS) built[b.id] = 0; // 0 = chưa xây
  return { townLevel, gold: 0, built, trips: 0 };
}

/** Mua/nâng cấp 1 công trình. Trả về cấp mới hoặc -1 nếu không đủ vàng/đã tối đa. */
export function buyUpgrade(town, buildingId) {
  const def = BUILDINGS.find((b) => b.id === buildingId);
  if (!def) return -1;
  const cur = town.built[buildingId];
  if (cur >= def.costs.length) return -1; // đã tối đa
  const cost = costOf(def, cur, town.townLevel);
  if (town.gold < cost) return -1;
  town.gold -= cost;
  town.built[buildingId] = cur + 1;
  return cur + 1;
}

/** Thị trấn hoàn thành khi MỌI công trình đạt cấp tối đa. */
export function townComplete(town) {
  return BUILDINGS.every((b) => town.built[b.id] >= b.costs.length);
}

/** Sang thị trấn mới: giữ vàng dư, công trình xây lại từ đầu (to đẹp hơn, giá cao hơn). */
export function nextTown(town) {
  const fresh = makeTown(town.townLevel + 1);
  fresh.gold = town.gold;
  fresh.trips = town.trips;
  return fresh;
}

export function serializeTown(town) {
  return JSON.stringify(town);
}

export function deserializeTown(text) {
  try {
    const raw = JSON.parse(text);
    const town = makeTown(Number.isInteger(raw.townLevel) ? Math.max(0, raw.townLevel) : 0);
    town.gold = Math.max(0, Number(raw.gold) || 0);
    town.trips = Math.max(0, Number(raw.trips) || 0);
    for (const b of BUILDINGS) {
      const v = raw.built?.[b.id];
      if (Number.isInteger(v)) town.built[b.id] = Math.max(0, Math.min(b.costs.length, v));
    }
    return town;
  } catch {
    return makeTown(0);
  }
}

/* ===== Pha chạy xe goòng ===== */

export function makeRun(townLevel = 0) {
  return {
    townLevel,
    cartX: FIELD_W / 2,
    items: [], // {kind, x, y, vy}
    timeLeftMs: RUN_MS,
    spawnTimer: 0,
    spawnEveryMs: Math.max(380, 620 - townLevel * 40),
    rockChance: Math.min(0.4, 0.22 + townLevel * 0.03),
    carried: 0, // vàng đang chở trên xe
    stunMs: 0,
    over: false,
  };
}

export function moveCart(run, x) {
  run.cartX = Math.max(CART_W / 2, Math.min(FIELD_W - CART_W / 2, x));
}

/**
 * Một bước mô phỏng chuyến xe. Trả về sự kiện:
 * { caught: [{kind, value}], hitRock, done }
 */
export function stepRun(run, dtMs, rng = Math.random) {
  const ev = { caught: [], hitRock: false, done: false };
  if (run.over) return ev;
  const dt = dtMs / 16.67;

  run.stunMs = Math.max(0, run.stunMs - dtMs);
  run.spawnTimer += dtMs;
  if (run.spawnTimer >= run.spawnEveryMs) {
    run.spawnTimer = 0;
    const roll = rng();
    let kind;
    if (roll < run.rockChance) kind = 'rock';
    else if (roll < run.rockChance + 0.38) kind = 'coin';
    else if (roll < run.rockChance + 0.58) kind = 'bag';
    else kind = 'gem';
    run.items.push({
      kind,
      x: 40 + rng() * (FIELD_W - 80),
      y: -20,
      vy: 2 + rng() * 1.5 + run.townLevel * 0.2,
    });
  }

  for (const it of run.items) {
    it.vy += GRAVITY * dt;
    it.y += it.vy * dt;
    // rơi vào lòng xe goòng?
    if (!it.done && it.y > CART_Y - CART_H / 2 && it.y < CART_Y + CART_H
      && Math.abs(it.x - run.cartX) < CART_W / 2 + DROPS[it.kind].r * 0.5) {
      it.done = true;
      if (it.kind === 'rock') {
        if (run.stunMs <= 0) {
          // đá rơi trúng xe: văng mất 30% vàng đang chở + choáng
          run.carried = Math.floor(run.carried * 0.7);
          run.stunMs = STUN_MS;
          ev.hitRock = true;
        }
      } else if (run.stunMs <= 0) {
        run.carried += DROPS[it.kind].value;
        ev.caught.push({ kind: it.kind, value: DROPS[it.kind].value });
      }
    }
  }
  run.items = run.items.filter((it) => !it.done && it.y < FIELD_H + 40);

  run.timeLeftMs -= dtMs;
  if (run.timeLeftMs <= 0) {
    run.timeLeftMs = 0;
    run.over = true;
    ev.done = true;
  }
  return ev;
}

/** Kết thúc chuyến: đổ vàng vào kho thị trấn. */
export function bankRun(town, run) {
  if (!run.over) return 0;
  town.gold += run.carried;
  town.trips++;
  return run.carried;
}
