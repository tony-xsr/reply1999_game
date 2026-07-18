// Hang Kim Cương Bí Ẩn: đào đất trong hang ô lưới, nhặt đủ kim cương để mở cửa thoát.
// Tảng đá tuân theo trọng lực: đào ô dưới đá thì đá RƠI, đá chồng lên nhau thì LĂN chéo —
// bị đá rơi trúng đầu là ngã. Thể loại "hang đá rơi" ô lưới đã phổ biến từ thập niên 80;
// toàn bộ màn chơi + mã đều tự thiết kế. File thuần logic, test được độc lập.

export const TILE = 32;
export const START_LIVES = 3;
export const TICK_MS = 130; // nhịp vật lý đá rơi (giao diện gọi đều đặn)

// Ký hiệu: '#' tường, 'd' đất đào được, 'r' đá, 'g' kim cương, 'X' cửa thoát,
// 'S' xuất phát, '.' trống.
export const LEVELS = [
  [ // Màn 1 — làm quen: đào đất, nhặt kim cương, 2 tảng đá dễ né
    '####################',
    '#S.ddddddddddddddd.#',
    '#dddddd.r.ddddddddd#',
    '#dd.g.ddddddd.g.ddd#',
    '#ddddddddd.r.dddddd#',
    '#d.g.dddddddddd.gdd#',
    '#dddddddddddddddddd#',
    '#dddd.g.ddddddddd.X#',
    '####################',
  ],
  [ // Màn 2 — hành lang hẹp, đá chắn lối phải đào vòng
    '####################',
    '#Sdddddddddddddddgd#',
    '#d####.r.####ddddd.#',
    '#ddddd.d.dddddd.r.d#',
    '#g.dddddddddd##dddd#',
    '#ddd.r.dd.g.dd#dg.d#',
    '#dd.ddd.dddddd#dddd#',
    '#g.ddddddd.g.dddd.X#',
    '####################',
  ],
  [ // Màn 3 — hàng đá 3 viên + đá rải rác: đào bên dưới là cả cụm sập
    '####################',
    '#Sddddddddddddddddd#',
    '#ddd.rrr.ddddd.g.dd#',
    '#dddddddddd.r.ddddd#',
    '#g.dddddddddddddd.g#',
    '#ddddd.g.dddddrdddd#',
    '#dd.r.ddddddddddgdd#',
    '#dddddd.g.ddddddd.X#',
    '####################',
  ],
  [ // Màn 4 — tổng hợp: nhiều đá, kim cương nằm gần đá phải dụ đá rơi trước
    '####################',
    '#Sdddddd.r.ddddddgd#',
    '#dd.r.ddddddddddddd#',
    '#dddddddddg.dd.r.dd#',
    '#g.dd.r.ddddddddddd#',
    '#dddddddddd.r.dgddd#',
    '#d.r.dddddddddddddd#',
    '#dddd.g.ddddddddd.X#',
    '####################',
  ],
];

export function makeLevel(levelIndex) {
  const raw = LEVELS[levelIndex % LEVELS.length];
  const grid = [];
  let spawn = { r: 1, c: 1 };
  let gems = 0;
  for (let r = 0; r < raw.length; r++) {
    const row = [];
    for (let c = 0; c < raw[r].length; c++) {
      let ch = raw[r][c];
      if (ch === 'S') {
        spawn = { r, c };
        ch = '.';
      }
      if (ch === 'g') gems++;
      row.push(ch);
    }
    grid.push(row);
  }
  return {
    level: levelIndex,
    grid,
    rows: grid.length,
    cols: grid[0].length,
    spawn,
    player: { r: spawn.r, c: spawn.c },
    lives: START_LIVES,
    gemsTotal: gems,
    gemsLeft: gems,
    score: 0,
    falling: new Set(), // "r,c" của đá/kim cương ĐANG rơi — rơi trúng đầu mới tính
    over: false,
    won: false,
  };
}

export function exitOpen(game) {
  return game.gemsLeft === 0;
}

function playerAt(game, r, c) {
  return game.player.r === r && game.player.c === c;
}

function respawn(game) {
  game.lives--;
  game.player.r = game.spawn.r;
  game.player.c = game.spawn.c;
  // dọn vật ngay tại chỗ xuất phát nếu có gì rơi vào (bảo đảm hồi sinh không kẹt)
  if (game.grid[game.spawn.r][game.spawn.c] !== '.') game.grid[game.spawn.r][game.spawn.c] = '.';
  if (game.lives <= 0) {
    game.over = true;
    game.won = false;
  }
}

const DIRS = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };

/**
 * Người chơi bước 1 ô. Trả về sự kiện: { moved, dug, gem, pushed, won }
 */
export function move(game, dir) {
  const ev = { moved: false, dug: false, gem: false, pushed: false, won: false };
  if (game.over || !DIRS[dir]) return ev;
  const [dr, dc] = DIRS[dir];
  const nr = game.player.r + dr;
  const nc = game.player.c + dc;
  if (nr < 0 || nc < 0 || nr >= game.rows || nc >= game.cols) return ev;
  const ch = game.grid[nr][nc];

  if (ch === '#') return ev;
  if (ch === 'r') {
    // đẩy đá theo chiều ngang nếu ô sau lưng đá còn trống
    if (dr !== 0) return ev;
    const br = nr;
    const bc = nc + dc;
    if (bc < 0 || bc >= game.cols || game.grid[br][bc] !== '.' || playerAt(game, br, bc)) return ev;
    game.grid[br][bc] = 'r';
    game.grid[nr][nc] = '.';
    game.falling.delete(`${nr},${nc}`);
    ev.pushed = true;
  } else if (ch === 'X') {
    if (!exitOpen(game)) return ev; // cửa còn khóa
    game.player.r = nr;
    game.player.c = nc;
    game.over = true;
    game.won = true;
    game.score += 50 + game.lives * 20;
    ev.moved = true;
    ev.won = true;
    return ev;
  } else if (ch === 'd') {
    game.grid[nr][nc] = '.';
    ev.dug = true;
  } else if (ch === 'g') {
    game.grid[nr][nc] = '.';
    game.falling.delete(`${nr},${nc}`);
    game.gemsLeft--;
    game.score += 25;
    ev.gem = true;
  }
  game.player.r = nr;
  game.player.c = nc;
  ev.moved = true;
  return ev;
}

function isRolly(ch) {
  return ch === 'r' || ch === 'g' || ch === '#'; // mặt tròn/cứng → vật ở trên lăn chéo được
}

/**
 * Một nhịp vật lý: mọi đá/kim cương rơi 1 ô hoặc lăn chéo 1 ô. Gọi đều đặn mỗi TICK_MS.
 * Trả về: { moved: còn thứ đang chuyển động?, hurt: người chơi vừa bị đè? }
 */
export function tickPhysics(game) {
  const res = { moved: false, hurt: false };
  if (game.over) return res;
  const nextFalling = new Set();

  for (let r = game.rows - 2; r >= 0; r--) {
    for (let c = 0; c < game.cols; c++) {
      const ch = game.grid[r][c];
      if (ch !== 'r' && ch !== 'g') continue;
      const key = `${r},${c}`;
      const below = game.grid[r + 1][c];

      // rơi thẳng xuống ô trống (không phải chỗ người chơi đứng)
      if (below === '.' && !playerAt(game, r + 1, c)) {
        game.grid[r][c] = '.';
        game.grid[r + 1][c] = ch;
        nextFalling.add(`${r + 1},${c}`);
        res.moved = true;
        continue;
      }
      // rơi trúng đầu người chơi — chỉ khi ĐANG rơi từ trước (đứng dưới vật đứng yên thì không sao)
      if (below === '.' && playerAt(game, r + 1, c) && game.falling.has(key)) {
        game.grid[r][c] = '.';
        game.grid[r + 1][c] = ch;
        res.moved = true;
        res.hurt = true;
        respawn(game);
        continue;
      }
      // đậu trên mặt tròn/cứng → thử lăn chéo trái rồi phải
      if (isRolly(below)) {
        let rolled = false;
        for (const side of [-1, 1]) {
          const sc = c + side;
          if (sc < 0 || sc >= game.cols) continue;
          if (game.grid[r][sc] === '.' && game.grid[r + 1][sc] === '.'
            && !playerAt(game, r, sc) && !playerAt(game, r + 1, sc)) {
            game.grid[r][c] = '.';
            game.grid[r][sc] = ch;
            nextFalling.add(`${r},${sc}`);
            res.moved = true;
            rolled = true;
            break;
          }
        }
        if (rolled) continue;
      }
    }
  }
  game.falling = nextFalling;
  return res;
}
