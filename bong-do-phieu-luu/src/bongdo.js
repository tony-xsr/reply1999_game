// Bóng Đỏ Phiêu Lưu: quả bóng TỰ nảy liên tục, bé chỉ lái trái/phải — thu thập đủ vòng
// rồi chạm cờ để qua màn. Bóng phồng to nảy cao hơn nhưng không chui lọt đường hầm thấp,
// bóng xì nhỏ thì ngược lại. Cơ chế "bóng nảy platformer" thuộc thể loại phổ biến;
// toàn bộ màn chơi + hình đều tự thiết kế. File thuần logic, test được độc lập.

export const TILE = 32;
export const VIEW_W = 640; // khung nhìn 20×18 ô, camera cuộn ngang theo bóng
export const VIEW_H = 576;
export const START_LIVES = 3;
export const R_SMALL = 13;
export const R_BIG = 20;
export const BOUNCE_SMALL = 9.2; // nảy ~100px (3 ô)
export const BOUNCE_BIG = 12; // nảy ~170px (5 ô) — với lên được bệ cao
export const GRAVITY = 0.42;
export const ACCEL = 0.22;
export const MAX_VX = 2.8;

// Ký hiệu bản đồ: '#' tường/đất, '^' gai, 'o' vòng, '+' phồng to, '-' xì nhỏ,
// 'F' cờ đích, 'S' điểm xuất phát, '.' hoặc ' ' = trống.
export const LEVELS = [
  [ // Màn 1 — làm quen: lái + nhặt vòng + né 1 cụm gai
    '', '', '', '', '', '', '', '', '', '', '', '',
    '........o.........o...............o',
    '...............................####',
    '.S..o.......o........^^................o......F',
    '################################################',
    '################################################',
    '################################################',
  ],
  [ // Màn 2 — quả phồng to: nảy cao lên bệ cao mới lấy được vòng trên
    '', '', '', '', '', '', '', '', '',
    '...........................o',
    '',
    '..........................###',
    '...............o.....................o',
    '',
    '.S...o...+..........^^.........o..........^^...o..F',
    '####################################################',
    '####################################################',
    '####################################################',
  ],
  [ // Màn 3 — xì nhỏ để chui đường hầm thấp (bóng to bị chắn lại)
    '', '', '', '', '', '', '', '', '', '', '',
    '.....................................o',
    '....................................###',
    '..................###########',
    '.S..o..+....-.....o..o..o....o........o....^^....o..F',
    '######################################################',
    '######################################################',
    '######################################################',
  ],
  [ // Màn 4 — tổng hợp: hố sâu phải nhảy qua + bệ cao + gai
    '', '', '', '', '', '', '', '', '',
    '.....................o....................o',
    '',
    '....................###...................###',
    '',
    '',
    '.S..o...+..............o.........^^........o.....o..F',
    '#########..####..#####################################',
    '#########..####..#####################################',
    '#########..####..#####################################',
  ],
];

export function radiusOf(ball) {
  return ball.big ? R_BIG : R_SMALL;
}

export function bounceOf(ball) {
  return ball.big ? BOUNCE_BIG : BOUNCE_SMALL;
}

/** Dựng màn từ bản đồ ký tự: hàng ngắn tự đệm '.' cho đủ chiều rộng. */
export function makeLevel(levelIndex) {
  const raw = LEVELS[levelIndex % LEVELS.length];
  const cols = Math.max(1, ...raw.map((row) => row.length));
  const tiles = [];
  let spawn = { x: TILE * 1.5, y: TILE * 14 };
  let rings = 0;
  for (let r = 0; r < raw.length; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      let ch = raw[r][c] || '.';
      if (ch === ' ') ch = '.';
      if (ch === 'S') {
        spawn = { x: c * TILE + TILE / 2, y: r * TILE + TILE / 2 };
        ch = '.';
      }
      if (ch === 'o') rings++;
      row.push(ch);
    }
    tiles.push(row);
  }
  return {
    level: levelIndex,
    tiles,
    rows: tiles.length,
    cols,
    spawn,
    ball: { x: spawn.x, y: spawn.y, vx: 0, vy: 0, big: false },
    lives: START_LIVES,
    ringsTotal: rings,
    ringsLeft: rings,
    score: 0,
    over: false,
    won: false,
  };
}

function solidAt(game, tx, ty) {
  if (tx < 0 || tx >= game.cols || ty < 0) return true; // 2 mép + trần là tường
  if (ty >= game.rows) return false; // đáy hở — rơi xuống hố là ngã
  return game.tiles[ty][tx] === '#';
}

function tileRange(v0, v1) {
  return [Math.floor(v0 / TILE), Math.floor((v1 - 0.001) / TILE)];
}

/** Bóng về điểm xuất phát sau khi ngã/trúng gai (vòng đã nhặt vẫn giữ). */
function respawn(game) {
  game.lives--;
  game.ball.x = game.spawn.x;
  game.ball.y = game.spawn.y;
  game.ball.vx = 0;
  game.ball.vy = 0;
  if (game.lives <= 0) {
    game.over = true;
    game.won = false;
  }
}

/**
 * Một bước mô phỏng. input = { left, right }. Trả về sự kiện cho giao diện:
 * { bounced, ring, grew, shrank, hurt, won }
 */
export function stepGame(game, input, dtMs) {
  const ev = { bounced: false, ring: false, grew: false, shrank: false, hurt: false, won: false };
  if (game.over) return ev;
  const dt = dtMs / 16.67;
  const b = game.ball;
  const r = radiusOf(b);

  // Lái trái/phải + ma sát khi thả tay
  if (input.left) b.vx -= ACCEL * dt;
  else if (input.right) b.vx += ACCEL * dt;
  else b.vx -= b.vx * Math.min(1, 0.06 * dt);
  b.vx = Math.max(-MAX_VX, Math.min(MAX_VX, b.vx));
  b.vy += GRAVITY * dt;

  // Trục X trước: đụng tường thì dừng sát mép.
  // LƯU Ý: xử lý xong 1 ô là dừng ngay (label break) — nếu chạy tiếp với vùng ô cũ,
  // ô kề bên sẽ bị hiểu nhầm hướng va chạm sau khi vận tốc vừa đổi dấu.
  b.x += b.vx * dt;
  xResolve: {
    const [ty0, ty1] = tileRange(b.y - r, b.y + r);
    const [tx0, tx1] = tileRange(b.x - r, b.x + r);
    for (let ty = ty0; ty <= ty1; ty++) {
      for (let tx = tx0; tx <= tx1; tx++) {
        if (!solidAt(game, tx, ty)) continue;
        if (b.vx > 0) b.x = tx * TILE - r;
        else if (b.vx < 0) b.x = (tx + 1) * TILE + r;
        b.vx = 0;
        break xResolve;
      }
    }
  }

  // Trục Y sau: chạm đất thì NẢY LÊN tự động, chạm trần thì dội nhẹ xuống
  b.y += b.vy * dt;
  yResolve: {
    const [tx0, tx1] = tileRange(b.x - r, b.x + r);
    const [ty0, ty1] = tileRange(b.y - r, b.y + r);
    for (let ty = ty0; ty <= ty1; ty++) {
      for (let tx = tx0; tx <= tx1; tx++) {
        if (!solidAt(game, tx, ty)) continue;
        if (b.vy > 0) {
          b.y = ty * TILE - r;
          b.vy = -bounceOf(b);
          ev.bounced = true;
        } else if (b.vy < 0) {
          b.y = (ty + 1) * TILE + r;
          b.vy = 1;
        }
        break yResolve;
      }
    }
  }

  // Rơi lọt đáy màn → ngã
  if (b.y - r > game.rows * TILE + 40) {
    ev.hurt = true;
    respawn(game);
    return ev;
  }

  // Nhặt/chạm vật phẩm — dùng hộp thu nhỏ cho dễ tính với bé (gai không quá "nhạy")
  const inset = r * 0.6;
  const [ptx0, ptx1] = tileRange(b.x - inset, b.x + inset);
  const [pty0, pty1] = tileRange(b.y - inset, b.y + inset);
  for (let ty = Math.max(0, pty0); ty <= Math.min(game.rows - 1, pty1); ty++) {
    for (let tx = Math.max(0, ptx0); tx <= Math.min(game.cols - 1, ptx1); tx++) {
      const ch = game.tiles[ty][tx];
      if (ch === 'o') {
        game.tiles[ty][tx] = '.';
        game.ringsLeft--;
        game.score += 10;
        ev.ring = true;
      } else if (ch === '+') {
        game.tiles[ty][tx] = '.';
        if (!b.big) { b.big = true; ev.grew = true; }
      } else if (ch === '-') {
        game.tiles[ty][tx] = '.';
        if (b.big) { b.big = false; ev.shrank = true; }
      } else if (ch === '^') {
        ev.hurt = true;
        respawn(game);
        return ev;
      } else if (ch === 'F' && game.ringsLeft === 0) {
        game.over = true;
        game.won = true;
        game.score += 50;
        ev.won = true;
        return ev;
      }
    }
  }
  return ev;
}
