// Nhà Thám Hiểm Tí Hon: platformer chạy-nhảy cuộn ngang — dậm đầu quái, ăn xu, tới cờ đích.
// Cơ chế platformer thuộc thể loại chung; nhân vật/màn chơi hoàn toàn tự thiết kế
// (sprite Kenney Pixel Platformer CC0 — không dùng bất kỳ dấu hiệu nhận diện nào của
// game thương mại). Có coyote-time + jump-buffer để trẻ nhỏ bấm nhảy "dễ ăn" hơn.
// Toàn bộ file này thuần logic (không đụng canvas/DOM), test được độc lập.

export const TILE = 32;
export const VIEW_W = 640; // khung nhìn 20×15 ô, camera cuộn ngang
export const VIEW_H = 480;
export const START_LIVES = 3;
export const PLAYER_W = 22;
export const PLAYER_H = 28;
export const ENEMY_W = 26;
export const ENEMY_H = 24;
export const GRAVITY = 0.5;
export const JUMP_V = -10.5; // nhảy cao ~3.4 ô
export const STOMP_BOUNCE = -6;
export const ACCEL = 0.3;
export const MAX_VX = 3;
export const ENEMY_SPEED = 0.8;
export const COYOTE_MS = 100; // rời mép vẫn nhảy được trong 100ms
export const JUMP_BUFFER_MS = 120; // bấm nhảy sớm 120ms trước khi chạm đất vẫn tính

// Ký hiệu bản đồ: '#' đất/gạch, 'c' xu, 'E' quái tuần tra, 'S' xuất phát, 'F' cờ đích.
export const LEVELS = [
  [ // Màn 1 — làm quen: chạy, nhảy bậc, ăn xu, 1 quái, 1 hố nhỏ
    '', '', '', '', '', '', '', '',
    '..........c...............c',
    '.........###..........c..###',
    '................c.....###',
    '.S..c.......c......................E.......c...F',
    '#################..##############################',
    '#################..##############################',
    '#################..##############################',
  ],
  [ // Màn 2 — bậc thang lên xuống + 2 quái
    '', '', '', '', '',
    '.....................c.c.c',
    '....................#####',
    '..............c..............c.........c',
    '.............###.........................',
    '........c............###.........###',
    '.......###....................E.........E....c..F',
    '#############...####################..############',
    '#############...####################..############',
    '#############...####################..############',
  ],
  [ // Màn 3 — hố rộng phải lấy đà + xu trên cao
    '', '', '', '', '',
    '............c...c...c',
    '...........#########',
    '', '',
    '......c.............c.....E......c....E......c..F',
    '######....########....############....############',
    '######....########....############....############',
    '######....########....############....############',
  ],
  [ // Màn 4 — tổng hợp: tháp xu, 3 quái, hố liên tiếp
    '', '', '',
    '..............c.c.c',
    '.............#####',
    '.........c.............c.........c...c',
    '........###...........###.......#####',
    '',
    '....c.......E......c........E...............E...F',
    '########..######........####....#######..#########',
    '########..######........####....#######..#########',
    '########..######........####....#######..#########',
  ],
];

/** Dựng màn từ bản đồ ký tự: hàng ngắn tự đệm '.', quái tách khỏi lưới thành thực thể. */
export function makeLevel(levelIndex) {
  const raw = LEVELS[levelIndex % LEVELS.length];
  const cols = Math.max(1, ...raw.map((row) => row.length));
  const tiles = [];
  const enemies = [];
  let spawn = { x: TILE * 1.5, y: TILE * 2 };
  let coins = 0;
  for (let r = 0; r < raw.length; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      let ch = raw[r][c] || '.';
      if (ch === ' ') ch = '.';
      if (ch === 'S') {
        spawn = { x: c * TILE + TILE / 2, y: r * TILE + TILE - PLAYER_H / 2 };
        ch = '.';
      }
      if (ch === 'E') {
        enemies.push({
          x: c * TILE + TILE / 2, y: r * TILE + TILE - ENEMY_H / 2,
          vx: -ENEMY_SPEED, dead: false,
        });
        ch = '.';
      }
      if (ch === 'c') coins++;
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
    // player.x/y là TÂM hộp va chạm
    player: { x: spawn.x, y: spawn.y, vx: 0, vy: 0, grounded: false, facing: 1 },
    enemies,
    lives: START_LIVES,
    coinsTotal: coins,
    coinsGot: 0,
    score: 0,
    coyoteMs: 0,
    jumpBufferMs: 0,
    prevJumpHeld: false,
    over: false,
    won: false,
  };
}

function solidAt(game, tx, ty) {
  if (tx < 0 || tx >= game.cols) return true; // 2 mép là tường
  if (ty < 0) return false; // trần mở (nhảy cao thoải mái)
  if (ty >= game.rows) return false; // đáy hở — rơi hố là ngã
  return game.tiles[ty][tx] === '#';
}

function tileRange(v0, v1) {
  return [Math.floor(v0 / TILE), Math.floor((v1 - 0.001) / TILE)];
}

/** Di chuyển 1 hộp (tâm x,y, cỡ w,h) theo từng trục, trả về thông tin chạm. */
function moveBox(game, ent, w, h, dt) {
  const res = { hitWall: false, landed: false, hitCeil: false };
  ent.x += ent.vx * dt;
  {
    const [ty0, ty1] = tileRange(ent.y - h / 2, ent.y + h / 2);
    const [tx0, tx1] = tileRange(ent.x - w / 2, ent.x + w / 2);
    outer: for (let ty = ty0; ty <= ty1; ty++) {
      for (let tx = tx0; tx <= tx1; tx++) {
        if (!solidAt(game, tx, ty)) continue;
        if (ent.vx > 0) ent.x = tx * TILE - w / 2;
        else if (ent.vx < 0) ent.x = (tx + 1) * TILE + w / 2;
        res.hitWall = true;
        break outer;
      }
    }
  }
  ent.y += ent.vy * dt;
  {
    const [tx0, tx1] = tileRange(ent.x - w / 2, ent.x + w / 2);
    const [ty0, ty1] = tileRange(ent.y - h / 2, ent.y + h / 2);
    outer: for (let ty = ty0; ty <= ty1; ty++) {
      for (let tx = tx0; tx <= tx1; tx++) {
        if (!solidAt(game, tx, ty)) continue;
        if (ent.vy > 0) {
          ent.y = ty * TILE - h / 2;
          res.landed = true;
        } else if (ent.vy < 0) {
          ent.y = (ty + 1) * TILE + h / 2;
          res.hitCeil = true;
        }
        ent.vy = 0;
        break outer;
      }
    }
  }
  return res;
}

/** Quái quay đầu khi đụng tường hoặc sắp bước hụt mép vực. */
function enemyShouldTurn(game, e) {
  const aheadX = e.x + Math.sign(e.vx) * (ENEMY_W / 2 + 2);
  const wallTx = Math.floor(aheadX / TILE);
  const bodyTy = Math.floor(e.y / TILE);
  if (solidAt(game, wallTx, bodyTy)) return true;
  const footTy = Math.floor((e.y + ENEMY_H / 2 + 4) / TILE);
  return !solidAt(game, wallTx, footTy);
}

function respawn(game) {
  game.lives--;
  game.player.x = game.spawn.x;
  game.player.y = game.spawn.y;
  game.player.vx = 0;
  game.player.vy = 0;
  if (game.lives <= 0) {
    game.over = true;
    game.won = false;
  }
}

function boxesOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return Math.abs(ax - bx) < (aw + bw) / 2 && Math.abs(ay - by) < (ah + bh) / 2;
}

/**
 * Một bước mô phỏng. input = { left, right, jump } (jump = ĐANG GIỮ nút).
 * Trả về sự kiện: { coin, stomp, hurt, jumped, won }
 */
export function stepGame(game, input, dtMs) {
  const ev = { coin: false, stomp: false, hurt: false, jumped: false, won: false };
  if (game.over) return ev;
  const dt = dtMs / 16.67;
  const p = game.player;

  // Lái ngang + ma sát
  if (input.left) { p.vx -= ACCEL * dt; p.facing = -1; }
  else if (input.right) { p.vx += ACCEL * dt; p.facing = 1; }
  else p.vx -= p.vx * Math.min(1, 0.25 * dt);
  p.vx = Math.max(-MAX_VX, Math.min(MAX_VX, p.vx));

  // Nhảy: buffer khi vừa BẤM, thực thi khi có đất (hoặc còn coyote)
  const jumpPressed = input.jump && !game.prevJumpHeld;
  game.prevJumpHeld = input.jump;
  if (jumpPressed) game.jumpBufferMs = JUMP_BUFFER_MS;
  else game.jumpBufferMs = Math.max(0, game.jumpBufferMs - dtMs);
  game.coyoteMs = p.grounded ? COYOTE_MS : Math.max(0, game.coyoteMs - dtMs);

  if (game.jumpBufferMs > 0 && game.coyoteMs > 0) {
    p.vy = JUMP_V;
    p.grounded = false;
    game.jumpBufferMs = 0;
    game.coyoteMs = 0;
    ev.jumped = true;
  }

  p.vy += GRAVITY * dt;
  const res = moveBox(game, p, PLAYER_W, PLAYER_H, dt);
  p.grounded = res.landed;
  if (res.hitWall) p.vx = 0; // chỉ người chơi — quái quay đầu bằng enemyShouldTurn

  // Rơi lọt đáy màn → ngã
  if (p.y - PLAYER_H / 2 > game.rows * TILE + 40) {
    ev.hurt = true;
    respawn(game);
    return ev;
  }

  // Quái tuần tra
  for (const e of game.enemies) {
    if (e.dead) continue;
    if (enemyShouldTurn(game, e)) e.vx = -e.vx;
    e.vy = (e.vy || 0) + GRAVITY * dt;
    moveBox(game, e, ENEMY_W, ENEMY_H, dt);
    // chạm người chơi?
    if (boxesOverlap(p.x, p.y, PLAYER_W, PLAYER_H, e.x, e.y, ENEMY_W, ENEMY_H)) {
      const stomping = p.vy > 0 && (p.y + PLAYER_H / 2) < e.y + 4;
      if (stomping) {
        e.dead = true;
        p.vy = STOMP_BOUNCE;
        game.score += 30;
        ev.stomp = true;
      } else {
        ev.hurt = true;
        respawn(game);
        return ev;
      }
    }
  }

  // Nhặt xu / chạm cờ — quét các ô hộp người chơi đè lên
  const [ptx0, ptx1] = tileRange(p.x - PLAYER_W / 2, p.x + PLAYER_W / 2);
  const [pty0, pty1] = tileRange(p.y - PLAYER_H / 2, p.y + PLAYER_H / 2);
  for (let ty = Math.max(0, pty0); ty <= Math.min(game.rows - 1, pty1); ty++) {
    for (let tx = Math.max(0, ptx0); tx <= Math.min(game.cols - 1, ptx1); tx++) {
      const ch = game.tiles[ty][tx];
      if (ch === 'c') {
        game.tiles[ty][tx] = '.';
        game.coinsGot++;
        game.score += 10;
        ev.coin = true;
      } else if (ch === 'F') {
        game.over = true;
        game.won = true;
        game.score += 50 + game.lives * 20;
        ev.won = true;
        return ev;
      }
    }
  }
  return ev;
}
