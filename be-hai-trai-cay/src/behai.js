// Bé Hái Trái Cây: trái cây tung lên từ mép dưới theo quỹ đạo parabol thật, bé vuốt tay
// ngang qua để "hái" (tính giao điểm đoạn vuốt × vị trí trái cây). Cơ chế "vuốt chém vật bay"
// là thể loại phổ biến — tự viết lại với hình ảnh "bàn tay hái" thân thiện, không lưỡi kiếm,
// vật cấm là chú ong (chạm phải bị chích, mất tim) thay cho bom. Toàn bộ file thuần logic.

export const FIELD_W = 640;
export const FIELD_H = 640;
export const GRAVITY = 0.22; // gia tốc rơi mỗi khung hình 60fps (giống Ném Lon trong Trò Xưa)
export const START_LIVES = 3;
export const FRUIT_SCORE = 10;

export const FRUITS = [
  { key: 'tao', icon: '🍎', name: 'quả táo', color: '#ff6b6b' },
  { key: 'cam', icon: '🍊', name: 'quả cam', color: '#ffa94d' },
  { key: 'chuoi', icon: '🍌', name: 'quả chuối', color: '#ffe066' },
  { key: 'duahau', icon: '🍉', name: 'quả dưa hấu', color: '#ff8787' },
  { key: 'dau', icon: '🍓', name: 'quả dâu', color: '#f06595' },
  { key: 'nho', icon: '🍇', name: 'chùm nho', color: '#b197fc' },
  { key: 'xoai', icon: '🥭', name: 'quả xoài', color: '#ffc078' },
  { key: 'dua', icon: '🍍', name: 'quả dứa', color: '#fcc419' },
];

export function makeLevel(levelIndex, rng = Math.random) {
  return {
    level: levelIndex,
    score: 0,
    target: 120 + levelIndex * 80,
    lives: START_LIVES,
    objects: [],
    tossTimer: 600, // đợt tung đầu tiên đến sớm cho bé khỏi chờ
    tossEveryMs: Math.max(1200, 2200 - levelIndex * 120),
    tossMax: Math.min(4, 2 + Math.floor(levelIndex / 2)),
    beeChance: Math.min(0.3, levelIndex * 0.06), // màn đầu chưa có ong
    lastGesture: -1,
    gestureHits: 0,
    over: false,
    won: false,
  };
}

/** Tung 1 đợt 1–tossMax vật từ mép dưới, vận tốc tính ngược từ độ cao đỉnh parabol mong muốn. */
export function spawnToss(game, rng = Math.random) {
  const count = 1 + Math.floor(rng() * game.tossMax);
  for (let k = 0; k < count; k++) {
    const isBee = rng() < game.beeChance;
    const x = 70 + rng() * (FIELD_W - 140);
    const apexY = 90 + rng() * 180; // đỉnh quỹ đạo cách mép trên 90–270px
    const vy = -Math.sqrt(2 * GRAVITY * (FIELD_H + 30 - apexY));
    const vx = ((FIELD_W / 2 - x) / FIELD_W) * 3 + (rng() - 0.5) * 1.6;
    game.objects.push({
      kind: isBee ? 'bee' : 'fruit',
      fruitIndex: Math.floor(rng() * FRUITS.length),
      x,
      y: FIELD_H + 30,
      vx,
      vy,
      r: isBee ? 20 : 26,
      sliced: false,
    });
  }
  return count;
}

/**
 * Một bước mô phỏng. dtMs = số mili-giây trôi qua kể từ bước trước.
 * Trả về số trái cây bị rơi lọt đáy mà chưa hái được (mỗi trái mất 1 tim; ong bay mất thì thôi).
 */
export function stepGame(game, dtMs, rng = Math.random) {
  if (game.over) return 0;
  const dt = dtMs / 16.67;

  game.tossTimer -= dtMs;
  if (game.tossTimer <= 0) {
    game.tossTimer = game.tossEveryMs;
    spawnToss(game, rng);
  }

  for (const o of game.objects) {
    o.x += o.vx * dt;
    o.y += o.vy * dt;
    o.vy += GRAVITY * dt;
  }

  let dropped = 0;
  for (const o of game.objects) {
    if (o.vy > 0 && o.y - o.r > FIELD_H + 40) {
      o.gone = true;
      if (o.kind === 'fruit') {
        dropped++;
        game.lives--;
      }
    }
  }
  game.objects = game.objects.filter((o) => !o.gone);

  if (game.lives <= 0) {
    game.over = true;
    game.won = false;
  }
  return dropped;
}

/** Đoạn thẳng (x1,y1)→(x2,y2) có chạm hình tròn tâm (cx,cy) bán kính r không? */
export function segmentHitsCircle(x1, y1, x2, y2, cx, cy, r) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  let tt = 0;
  if (len2 > 0) tt = Math.max(0, Math.min(1, ((cx - x1) * dx + (cy - y1) * dy) / len2));
  return Math.hypot(cx - (x1 + tt * dx), cy - (y1 + tt * dy)) <= r;
}

/**
 * Vuốt 1 đoạn: hái mọi trái cây đoạn này chạm phải. `gestureId` là số thứ tự của LẦN vuốt
 * (đặt tay xuống → nhấc tay lên) — trái thứ 2 trở đi trong CÙNG 1 lần vuốt được thưởng combo
 * gấp đôi điểm. Chạm phải ong thì bị chích, mất 1 tim. Trả về danh sách vật vừa chạm.
 */
export function slice(game, x1, y1, x2, y2, gestureId = 0) {
  if (game.over) return { fruits: [], bees: 0, gained: 0 };
  if (gestureId !== game.lastGesture) {
    game.lastGesture = gestureId;
    game.gestureHits = 0;
  }
  const fruits = [];
  let bees = 0;
  let gained = 0;
  for (const o of game.objects) {
    if (o.sliced) continue;
    if (segmentHitsCircle(x1, y1, x2, y2, o.x, o.y, o.r + 6)) {
      o.sliced = true;
      if (o.kind === 'fruit') {
        fruits.push(o);
        game.gestureHits++;
        gained += game.gestureHits > 1 ? FRUIT_SCORE * 2 : FRUIT_SCORE;
      } else {
        bees++;
        game.lives--;
      }
    }
  }
  game.score += gained;
  game.objects = game.objects.filter((o) => !o.sliced);
  if (game.score >= game.target) {
    game.over = true;
    game.won = true;
  } else if (game.lives <= 0) {
    game.over = true;
    game.won = false;
  }
  return { fruits, bees, gained };
}
