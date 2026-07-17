// Rồng Con Bắn Trứng: bắn trứng màu lên lưới lục giác treo trên trần hang — cụm ≥3 trứng
// cùng màu thì nổ, trứng bị hở chân (không còn nối về trần) rơi theo. Cứ sau vài phát bắn,
// trần hang tụt xuống thêm 1 hàng; thua khi trứng chạm vạch dưới, thắng khi dọn sạch lưới.
// Cơ chế bubble-shooter thuộc thể loại phổ biến (từ Puzzle Bobble 1994). Trứng tự vẽ canvas.
// Toàn bộ file này thuần logic (không đụng canvas/DOM), test được độc lập.

export const COLS = 10; // hàng "đầy" 10 trứng, hàng lệch 9 trứng
export const R = 24; // bán kính trứng
export const ROW_H = R * Math.sqrt(3);
export const FIELD_W = COLS * R * 2; // 480
export const FIELD_H = 640;
export const DEATH_ROW = 11; // trứng chiếm hàng ≥ 11 → thua
export const SHOOTER_X = FIELD_W / 2;
export const SHOOTER_Y = FIELD_H - 46;
export const SHOT_SPEED = 14; // px mỗi bước mô phỏng
export const MAX_ANGLE = 1.31; // ~75° — không cho bắn ngang sát đất
export const ADD_ROW_EVERY = 6; // sau mỗi 6 phát bắn, trần tụt 1 hàng

/** Hàng r "đầy" (10 ô) hay "lệch" (9 ô) — phụ thuộc parity đổi mỗi lần trần tụt. */
export function rowCols(r, parity) {
  return (r + parity) % 2 === 0 ? COLS : COLS - 1;
}

export function cellCenter(r, c, parity) {
  return {
    x: R + c * 2 * R + ((r + parity) % 2 === 0 ? 0 : R),
    y: R + r * ROW_H,
  };
}

/** 6 ô kề của ô lục giác (r,c) — offset khác nhau giữa hàng đầy/hàng lệch. */
export function neighbors(game, r, c) {
  const offsets = (r + game.parity) % 2 === 0
    ? [[0, -1], [0, 1], [-1, -1], [-1, 0], [1, -1], [1, 0]]
    : [[0, -1], [0, 1], [-1, 0], [-1, 1], [1, 0], [1, 1]];
  const out = [];
  for (const [dr, dc] of offsets) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr < 0 || nc < 0 || nc >= rowCols(nr, game.parity)) continue;
    out.push([nr, nc]);
  }
  return out;
}

function colorAt(game, r, c) {
  return game.grid[r] ? game.grid[r][c] : null;
}

function colorsInGrid(game) {
  const set = new Set();
  for (const row of game.grid) for (const v of row) if (v !== null) set.add(v);
  return set;
}

function pickColor(game, rng) {
  const present = [...colorsInGrid(game)];
  if (!present.length) return 0;
  return present[Math.floor(rng() * present.length)];
}

export function makeLevel(levelIndex, rng = Math.random) {
  const numColors = Math.min(6, 4 + Math.floor(levelIndex / 2));
  const initRows = Math.min(6, 4 + Math.floor(levelIndex / 3));
  const game = {
    level: levelIndex,
    numColors,
    parity: 0,
    grid: [],
    score: 0,
    shotsSinceRow: 0,
    nextColor: 0,
    queueColor: 0,
    over: false,
    won: false,
  };
  for (let r = 0; r < initRows; r++) {
    game.grid.push(Array.from({ length: rowCols(r, 0) }, () => Math.floor(rng() * numColors)));
  }
  game.nextColor = pickColor(game, rng);
  game.queueColor = pickColor(game, rng);
  return game;
}

/**
 * Mô phỏng đường bay của trứng từ họng pháo theo góc (radian, 0 = thẳng lên, dương = phải),
 * nảy tường 2 bên, dừng khi chạm trần hoặc chạm trứng. KHÔNG thay đổi game — dùng chung
 * cho cả phát bắn thật lẫn đường ngắm chấm chấm.
 */
export function tracePath(game, angleRad) {
  const a = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, angleRad));
  let x = SHOOTER_X;
  let y = SHOOTER_Y;
  let vx = Math.sin(a) * SHOT_SPEED;
  let vy = -Math.cos(a) * SHOT_SPEED;
  const path = [{ x, y }];
  for (let step = 0; step < 500; step++) {
    x += vx;
    y += vy;
    if (x < R) { x = R + (R - x); vx = -vx; }
    else if (x > FIELD_W - R) { x = (FIELD_W - R) - (x - (FIELD_W - R)); vx = -vx; }
    path.push({ x, y });
    if (y <= R) break; // chạm trần
    let hit = false;
    for (let r = 0; r < game.grid.length && !hit; r++) {
      for (let c = 0; c < game.grid[r].length; c++) {
        if (game.grid[r][c] === null) continue;
        const cc = cellCenter(r, c, game.parity);
        if (Math.hypot(cc.x - x, cc.y - y) < 2 * R * 0.9) { hit = true; break; }
      }
    }
    if (hit) break;
  }
  return path;
}

/** Ô trống hợp lệ gần điểm (x,y) nhất để trứng "dính" vào: hàng trần, hoặc kề 1 trứng có sẵn. */
export function findSnapCell(game, x, y) {
  let best = null;
  let bestDist = Infinity;
  const maxRow = game.grid.length; // cho phép mở hàng mới ngay dưới hàng cuối
  for (let r = 0; r <= maxRow; r++) {
    for (let c = 0; c < rowCols(r, game.parity); c++) {
      if (colorAt(game, r, c) !== null) continue;
      if (r !== 0) {
        const touching = neighbors(game, r, c).some(([nr, nc]) => colorAt(game, nr, nc) !== null);
        if (!touching) continue;
      }
      const cc = cellCenter(r, c, game.parity);
      const d = Math.hypot(cc.x - x, cc.y - y);
      if (d < bestDist) { bestDist = d; best = { r, c }; }
    }
  }
  return best;
}

/** Cụm cùng màu dính liền chứa ô (r,c); nếu ≥3 thì gỡ khỏi lưới và trả về danh sách. */
export function popMatches(game, r, c) {
  const color = colorAt(game, r, c);
  if (color === null) return [];
  const seen = new Set([`${r},${c}`]);
  const stack = [[r, c]];
  const cluster = [];
  while (stack.length) {
    const [cr, cc] = stack.pop();
    cluster.push({ r: cr, c: cc, color });
    for (const [nr, nc] of neighbors(game, cr, cc)) {
      const key = `${nr},${nc}`;
      if (!seen.has(key) && colorAt(game, nr, nc) === color) {
        seen.add(key);
        stack.push([nr, nc]);
      }
    }
  }
  if (cluster.length < 3) return [];
  for (const cell of cluster) game.grid[cell.r][cell.c] = null;
  return cluster;
}

/** Trứng không còn đường nối về hàng trần (hàng 0) → rơi. Trả về danh sách trứng rơi. */
export function dropOrphans(game) {
  const seen = new Set();
  const stack = [];
  if (game.grid[0]) {
    for (let c = 0; c < game.grid[0].length; c++) {
      if (game.grid[0][c] !== null) { seen.add(`0,${c}`); stack.push([0, c]); }
    }
  }
  while (stack.length) {
    const [r, c] = stack.pop();
    for (const [nr, nc] of neighbors(game, r, c)) {
      const key = `${nr},${nc}`;
      if (!seen.has(key) && colorAt(game, nr, nc) !== null) {
        seen.add(key);
        stack.push([nr, nc]);
      }
    }
  }
  const dropped = [];
  for (let r = 0; r < game.grid.length; r++) {
    for (let c = 0; c < game.grid[r].length; c++) {
      if (game.grid[r][c] !== null && !seen.has(`${r},${c}`)) {
        dropped.push({ r, c, color: game.grid[r][c] });
        game.grid[r][c] = null;
      }
    }
  }
  return dropped;
}

/** Trần hang tụt xuống: thêm 1 hàng trứng mới lên đỉnh, các hàng cũ tụt 1 nấc, parity đổi. */
export function addRow(game, rng = Math.random) {
  game.parity ^= 1;
  game.grid.unshift(Array.from({ length: rowCols(0, game.parity) }, () => Math.floor(rng() * game.numColors)));
}

function isEmpty(game) {
  return game.grid.every((row) => row.every((v) => v === null));
}

function touchesDeathRow(game) {
  for (let r = DEATH_ROW; r < game.grid.length; r++) {
    if (game.grid[r].some((v) => v !== null)) return true;
  }
  return false;
}

/**
 * Bắn 1 phát theo góc. Trả về mọi thứ phần giao diện cần để diễn hoạt:
 * { color, path, landed, popped, dropped, addedRow } — hoặc null nếu game đã kết thúc.
 */
export function fireShot(game, angleRad, rng = Math.random) {
  if (game.over) return null;
  const color = game.nextColor;
  const path = tracePath(game, angleRad);
  const end = path[path.length - 1];
  const snap = findSnapCell(game, end.x, end.y);
  if (!snap) return null; // không còn chỗ trống nào (thực tế đã thua trước đó)

  while (game.grid.length <= snap.r) {
    game.grid.push(Array.from({ length: rowCols(game.grid.length, game.parity) }, () => null));
  }
  game.grid[snap.r][snap.c] = color;

  const popped = popMatches(game, snap.r, snap.c);
  const dropped = popped.length ? dropOrphans(game) : [];
  game.score += popped.length * 10 + dropped.length * 20;

  let addedRow = false;
  if (isEmpty(game)) {
    game.over = true;
    game.won = true;
  } else {
    game.shotsSinceRow++;
    if (game.shotsSinceRow >= ADD_ROW_EVERY) {
      game.shotsSinceRow = 0;
      addRow(game, rng);
      addedRow = true;
    }
    if (touchesDeathRow(game)) {
      game.over = true;
      game.won = false;
    }
  }

  game.nextColor = game.queueColor;
  game.queueColor = pickColor(game, rng);
  return { color, path, landed: snap, popped, dropped, addedRow };
}
