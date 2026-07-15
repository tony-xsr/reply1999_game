// Gộp Số Vui: vuốt 4 hướng để trượt các ô số, 2 ô cùng số chạm nhau gộp thành gấp đôi.
// Kiểu chơi "2048" kinh điển — thể loại đã bị nhân bản hàng nghìn lần, không gắn 1 thương hiệu
// cụ thể nên an toàn để tự viết lại. Toàn bộ file này thuần logic, test được độc lập.

export const SIZE = 4;

function emptyGrid() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

/** Thêm 1 ô mới (90% ra số 2, 10% ra số 4) vào 1 ô trống ngẫu nhiên. Trả false nếu bàn đã đầy. */
export function spawnTile(grid, rng = Math.random) {
  const empties = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === 0) empties.push([r, c]);
    }
  }
  if (!empties.length) return false;
  const [r, c] = empties[Math.floor(rng() * empties.length)];
  grid[r][c] = rng() < 0.9 ? 2 : 4;
  return true;
}

/** Trượt 1 hàng về bên trái: dồn các ô có số lại, gộp 2 ô liền kề cùng số (mỗi ô chỉ gộp 1 lần/lượt). */
function slideLeftRow(row) {
  const vals = row.filter((v) => v !== 0);
  const merged = [];
  let gained = 0;
  let i = 0;
  while (i < vals.length) {
    if (i + 1 < vals.length && vals[i] === vals[i + 1]) {
      const newVal = vals[i] * 2;
      merged.push(newVal);
      gained += newVal;
      i += 2;
    } else {
      merged.push(vals[i]);
      i += 1;
    }
  }
  while (merged.length < row.length) merged.push(0);
  return { row: merged, gained };
}

function transpose(grid) {
  const n = grid.length;
  const out = Array.from({ length: n }, () => Array(n).fill(0));
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) out[c][r] = grid[r][c];
  return out;
}

function reverseRows(grid) {
  return grid.map((row) => [...row].reverse());
}

/** Trượt toàn bộ bàn theo hướng chỉ định. Không đụng gì tới việc sinh ô mới hay kiểm tra thắng/thua. */
export function slideGrid(grid, direction) {
  let g = grid.map((row) => [...row]);
  const transformed = direction === 'up' || direction === 'down';
  const reversed = direction === 'right' || direction === 'down';
  if (transformed) g = transpose(g);
  if (reversed) g = reverseRows(g);

  let gained = 0;
  let moved = false;
  const result = g.map((row) => {
    const { row: newRow, gained: g2 } = slideLeftRow(row);
    gained += g2;
    if (!moved && newRow.some((v, i) => v !== row[i])) moved = true;
    return newRow;
  });

  let out = result;
  if (reversed) out = reverseRows(out);
  if (transformed) out = transpose(out);
  return { grid: out, gained, moved };
}

/** Còn nước đi nào không (còn ô trống, hoặc còn 2 ô số giống nhau liền kề)? */
export function hasMoves(grid) {
  const n = grid.length;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 0) return true;
      if (c + 1 < n && grid[r][c] === grid[r][c + 1]) return true;
      if (r + 1 < n && grid[r][c] === grid[r + 1][c]) return true;
    }
  }
  return false;
}

export function makeGame(target = 2048, rng = Math.random) {
  const grid = emptyGrid();
  spawnTile(grid, rng);
  spawnTile(grid, rng);
  return { grid, score: 0, target, level: 0, over: false, won: false };
}

/** Màn cao hơn có mục tiêu cao hơn (nhân đôi mỗi màn), chặn trần ở 2048 như bản gốc. */
export function makeLevel(levelIndex, rng = Math.random) {
  const target = 64 * 2 ** Math.min(5, levelIndex);
  const game = makeGame(target, rng);
  game.level = levelIndex;
  return game;
}

function checkEnd(game) {
  if (game.grid.some((row) => row.some((v) => v >= game.target))) {
    game.over = true;
    game.won = true;
    return;
  }
  if (!hasMoves(game.grid)) {
    game.over = true;
    game.won = false;
  }
}

/** Trượt bàn theo hướng, sinh thêm ô mới NẾU có ô nào thật sự di chuyển/gộp, rồi kiểm tra thắng/thua. */
export function applyMove(game, direction, rng = Math.random) {
  if (game.over) return { moved: false, gained: 0 };
  const result = slideGrid(game.grid, direction);
  if (result.moved) {
    game.grid = result.grid;
    game.score += result.gained;
    spawnTile(game.grid, rng);
    checkEnd(game);
  }
  return result;
}
