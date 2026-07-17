// Ném Banh Đổ Tháp: kéo ná căng lực rồi thả để phóng quả banh theo parabol vào công trình
// gỗ/đá/kính, làm sập tháp đè trúng các chú quái tròn tinh nghịch. Cơ chế "slingshot vật lý"
// thuộc thể loại phổ biến (có từ trước các game thương mại nổi tiếng); đạn là quả banh,
// KHÔNG dùng chim/heo hay bất kỳ asset nào của Angry Birds — khối và quái dùng Kenney
// Physics Assets (CC0). Toàn bộ file này thuần logic, test được độc lập.

export const FIELD_W = 960;
export const FIELD_H = 640;
export const GROUND_Y = 560;
export const SLING_X = 130;
export const SLING_Y = 470;
export const BALL_R = 16;
export const CRITTER_R = 20;
export const GRAVITY = 0.34;
export const MAX_POWER = 22; // vận tốc phóng tối đa
export const POWER_PER_PX = 0.14; // kéo 1px = thêm bấy nhiêu vận tốc

/** Vật liệu: kính vỡ ngay, gỗ chịu 2 nhát nhẹ, đá phải banh thật nhanh mới vỡ. */
export const MATERIALS = {
  glass: { hp: 1, score: 15 },
  wood: { hp: 2, score: 10 },
  stone: { hp: 4, score: 20 },
};

// Mỗi màn: số banh + danh sách khối {x, y, w, h, mat} + danh sách quái {x, y}.
// y của khối là mép TRÊN; quái đứng trên mặt phẳng đỡ (y là tâm).
export const LEVELS = [
  { // Màn 1 — căn nhà gỗ đơn giản, 1 quái trong nhà 1 quái trên nóc
    shots: 3,
    blocks: [
      { x: 620, y: 464, w: 48, h: 96, mat: 'wood' },
      { x: 764, y: 464, w: 48, h: 96, mat: 'wood' },
      { x: 596, y: 416, w: 240, h: 48, mat: 'wood' },
    ],
    critters: [{ x: 716, y: 540 }, { x: 716, y: 396 }],
  },
  { // Màn 2 — tháp kính dễ vỡ + mái đá nặng
    shots: 3,
    blocks: [
      { x: 640, y: 512, w: 48, h: 48, mat: 'glass' },
      { x: 640, y: 464, w: 48, h: 48, mat: 'glass' },
      { x: 640, y: 416, w: 48, h: 48, mat: 'glass' },
      { x: 760, y: 512, w: 48, h: 48, mat: 'glass' },
      { x: 760, y: 464, w: 48, h: 48, mat: 'glass' },
      { x: 760, y: 416, w: 48, h: 48, mat: 'glass' },
      { x: 616, y: 368, w: 240, h: 48, mat: 'stone' },
    ],
    critters: [{ x: 724, y: 540 }, { x: 724, y: 348 }],
  },
  { // Màn 3 — 2 tháp gỗ, tường kính chắn giữa
    shots: 4,
    blocks: [
      { x: 560, y: 464, w: 48, h: 96, mat: 'wood' },
      { x: 560, y: 416, w: 48, h: 48, mat: 'wood' },
      { x: 700, y: 512, w: 48, h: 48, mat: 'glass' },
      { x: 700, y: 464, w: 48, h: 48, mat: 'glass' },
      { x: 700, y: 416, w: 48, h: 48, mat: 'glass' },
      { x: 840, y: 464, w: 48, h: 96, mat: 'wood' },
      { x: 816, y: 416, w: 96, h: 48, mat: 'wood' },
    ],
    critters: [{ x: 640, y: 540 }, { x: 775, y: 540 }, { x: 864, y: 396 }],
  },
  { // Màn 4 — lâu đài đá phải phá bằng banh nhanh hoặc lật đổ trụ
    shots: 4,
    blocks: [
      { x: 600, y: 464, w: 48, h: 96, mat: 'stone' },
      { x: 800, y: 464, w: 48, h: 96, mat: 'stone' },
      { x: 576, y: 416, w: 144, h: 48, mat: 'wood' },
      { x: 728, y: 416, w: 144, h: 48, mat: 'wood' },
      { x: 660, y: 368, w: 48, h: 48, mat: 'glass' },
      { x: 740, y: 368, w: 48, h: 48, mat: 'glass' },
      { x: 636, y: 320, w: 176, h: 48, mat: 'wood' },
    ],
    critters: [{ x: 724, y: 540 }, { x: 724, y: 300 }],
  },
  { // Màn 5 — thành phố 3 nhà, 4 quái
    shots: 5,
    blocks: [
      { x: 520, y: 512, w: 48, h: 48, mat: 'wood' },
      { x: 520, y: 464, w: 48, h: 48, mat: 'glass' },
      { x: 496, y: 416, w: 96, h: 48, mat: 'wood' },
      { x: 660, y: 464, w: 48, h: 96, mat: 'stone' },
      { x: 780, y: 464, w: 48, h: 96, mat: 'stone' },
      { x: 636, y: 416, w: 240, h: 48, mat: 'wood' },
      { x: 700, y: 368, w: 48, h: 48, mat: 'glass' },
      { x: 676, y: 320, w: 96, h: 48, mat: 'wood' },
      { x: 880, y: 512, w: 48, h: 48, mat: 'glass' },
    ],
    critters: [{ x: 544, y: 396 }, { x: 730, y: 540 }, { x: 724, y: 300 }, { x: 928, y: 540 }],
  },
];

export function makeLevel(levelIndex) {
  const def = LEVELS[levelIndex % LEVELS.length];
  return {
    level: levelIndex,
    shotsLeft: def.shots,
    shotsTotal: def.shots,
    blocks: def.blocks.map((b, i) => ({
      ...b, id: i, hp: MATERIALS[b.mat].hp, maxHp: MATERIALS[b.mat].hp, falling: false, vy: 0,
    })),
    critters: def.critters.map((c, i) => ({ ...c, id: i, falling: false, vy: 0, fellFrom: c.y })),
    ball: null,
    score: 0,
    stars: 0,
    over: false,
    won: false,
  };
}

/** Phóng banh với vận tốc (vx, vy). Chỉ phóng được khi banh trước đã nằm yên. */
export function launch(game, vx, vy) {
  if (game.over || game.ball || game.shotsLeft <= 0) return false;
  const speed = Math.hypot(vx, vy);
  const k = speed > MAX_POWER ? MAX_POWER / speed : 1;
  game.ball = { x: SLING_X, y: SLING_Y, vx: vx * k, vy: vy * k };
  game.shotsLeft--;
  return true;
}

function circleRectHit(cx, cy, r, b) {
  const px = Math.max(b.x, Math.min(cx, b.x + b.w));
  const py = Math.max(b.y, Math.min(cy, b.y + b.h));
  const dx = cx - px;
  const dy = cy - py;
  if (dx * dx + dy * dy > r * r) return null;
  return { px, py, dx, dy };
}

function xOverlap(ax, aw, bx, bw) {
  return Math.min(ax + aw, bx + bw) - Math.max(ax, bx);
}

/** Khối/quái còn được đỡ không? (chạm đất, hoặc đứng trên 1 khối khác chưa rơi) */
function blockSupported(game, b) {
  if (b.y + b.h >= GROUND_Y - 0.5) return true;
  return game.blocks.some((o) => o !== b && !o.falling
    && Math.abs(o.y - (b.y + b.h)) <= 6 && xOverlap(b.x, b.w, o.x, o.w) >= 8);
}

function critterSupported(game, c) {
  if (c.y + CRITTER_R >= GROUND_Y - 0.5) return true;
  return game.blocks.some((o) => !o.falling
    && Math.abs(o.y - (c.y + CRITTER_R)) <= 6 && xOverlap(c.x - CRITTER_R, CRITTER_R * 2, o.x, o.w) >= 8);
}

/** Đánh dấu mọi thứ vừa mất chỗ đỡ là "đang rơi" (lan truyền dần qua các bước). */
function refreshSupports(game) {
  for (const b of game.blocks) if (!b.falling && !blockSupported(game, b)) b.falling = true;
  for (const c of game.critters) {
    if (!c.falling && !critterSupported(game, c)) {
      c.falling = true;
      c.fellFrom = c.y;
    }
  }
}

function popCritter(game, c, events) {
  c.popped = true;
  game.score += 50;
  events.popped++;
}

function destroyBlock(game, b, events) {
  b.dead = true;
  game.score += MATERIALS[b.mat].score;
  events.destroyed++;
}

/**
 * Một bước mô phỏng. Trả về sự kiện cho giao diện:
 * { hit, destroyed, popped, landed, ballDone, settledEnd }
 */
export function stepGame(game, dtMs) {
  const events = { hit: 0, destroyed: 0, popped: 0, landed: 0, ballDone: false, settledEnd: false };
  if (game.over) return events;
  const dt = dtMs / 16.67;

  // ===== Banh bay =====
  const ball = game.ball;
  if (ball) {
    ball.vy += GRAVITY * dt;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    // trúng quái → nổ bụp
    for (const c of game.critters) {
      if (!c.popped && Math.hypot(c.x - ball.x, c.y - ball.y) < CRITTER_R + BALL_R) {
        popCritter(game, c, events);
      }
    }
    // trúng khối → trừ máu theo tốc độ, banh nảy/xuyên
    for (const b of game.blocks) {
      if (b.dead) continue;
      const hit = circleRectHit(ball.x, ball.y, BALL_R, b);
      if (!hit) continue;
      const speed = Math.hypot(ball.vx, ball.vy);
      const dmg = 1 + Math.floor(speed / 8);
      b.hp -= dmg;
      events.hit++;
      if (b.hp <= 0) {
        destroyBlock(game, b, events);
        ball.vx *= 0.72; // xuyên qua khối vừa vỡ, mất đà
        ball.vy *= 0.72;
      } else if (Math.abs(hit.dx) > Math.abs(hit.dy)) {
        ball.vx = -ball.vx * 0.35;
        ball.vy *= 0.7;
        ball.x += hit.dx > 0 ? 3 : -3;
      } else {
        ball.vy = -Math.abs(ball.vy) * 0.35 * Math.sign(ball.vy || 1);
        ball.vy = hit.dy > 0 ? Math.abs(ball.vy) : -Math.abs(ball.vy);
        ball.vx *= 0.7;
        ball.y += hit.dy > 0 ? 3 : -3;
      }
    }
    // chạm đất → nảy tắt dần
    if (ball.y + BALL_R > GROUND_Y) {
      ball.y = GROUND_Y - BALL_R;
      ball.vy = -ball.vy * 0.4;
      ball.vx *= 0.8;
    }
    // banh hết đà hoặc bay khỏi sân → xong lượt
    const slow = Math.hypot(ball.vx, ball.vy) < 1.2 && ball.y + BALL_R > GROUND_Y - 2;
    if (slow || ball.x < -40 || ball.x > FIELD_W + 40) {
      game.ball = null;
      events.ballDone = true;
    }
  }

  game.blocks = game.blocks.filter((b) => !b.dead);
  refreshSupports(game);

  // ===== Khối & quái đang rơi =====
  let anyFalling = false;
  for (const b of game.blocks) {
    if (!b.falling) continue;
    anyFalling = true;
    b.vy += GRAVITY * dt;
    b.y += b.vy * dt;
    // đè trúng quái trong lúc rơi
    for (const c of game.critters) {
      if (!c.popped && circleRectHit(c.x, c.y, CRITTER_R, b)) popCritter(game, c, events);
    }
    // chạm đất hoặc đậu lên khối khác
    let restY = GROUND_Y;
    for (const o of game.blocks) {
      if (o === b || o.falling) continue;
      if (xOverlap(b.x, b.w, o.x, o.w) >= 8 && o.y >= b.y + b.h - 20) restY = Math.min(restY, o.y);
    }
    if (b.y + b.h >= restY) {
      b.y = restY - b.h;
      b.falling = false;
      b.vy = 0;
      events.landed++;
    }
  }
  for (const c of game.critters) {
    if (c.popped || !c.falling) continue;
    anyFalling = true;
    c.vy += GRAVITY * dt;
    c.y += c.vy * dt;
    let restY = GROUND_Y;
    for (const o of game.blocks) {
      if (o.falling) continue;
      if (xOverlap(c.x - CRITTER_R, CRITTER_R * 2, o.x, o.w) >= 8 && o.y >= c.y + CRITTER_R - 20) {
        restY = Math.min(restY, o.y);
      }
    }
    if (c.y + CRITTER_R >= restY) {
      c.y = restY - CRITTER_R;
      c.falling = false;
      c.vy = 0;
      // ngã từ trên cao xuống → choáng váng nổ bụp luôn
      if (c.y - c.fellFrom > 70) popCritter(game, c, events);
    }
  }

  // ===== Kết màn (chỉ xét khi thế giới đã yên) =====
  if (!game.ball && !anyFalling) {
    const alive = game.critters.filter((c) => !c.popped).length;
    if (alive === 0) {
      game.over = true;
      game.won = true;
      game.stars = game.shotsLeft >= 2 ? 3 : game.shotsLeft === 1 ? 2 : 1;
      game.score += game.shotsLeft * 30;
      events.settledEnd = true;
    } else if (game.shotsLeft <= 0) {
      game.over = true;
      game.won = false;
      events.settledEnd = true;
    }
  }
  return events;
}
