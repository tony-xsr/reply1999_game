// Đường Hầm Săn Vàng: đập vỡ đá để lấy vàng ẩn bên trong, khéo léo tránh đá phía trên
// rơi trúng người. Toàn bộ file này thuần logic, test được độc lập.

export const ROWS = 10;
export const COLS = 7;
export const START_LIVES = 3;

/** Dựng bàn: 2 hàng trên cùng luôn trống (cửa hầm), phần còn lại là đá/tảng đá to chứa vàng. */
export function makeGrid(rows, cols, levelIndex, rng = Math.random) {
  const boulderChance = Math.min(0.32, 0.14 + levelIndex * 0.02);
  const goldChance = 0.4;
  const grid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      if (r < 2) {
        row.push({ type: 'empty', hp: 0, gold: 0 });
        continue;
      }
      const isBoulder = rng() < boulderChance;
      const hasGold = rng() < goldChance;
      row.push({
        type: 'rock',
        hp: isBoulder ? 2 : 1,
        gold: hasGold ? 10 + Math.floor(rng() * 3) * 10 : 0,
      });
    }
    grid.push(row);
  }
  return grid;
}

export function makeLevel(levelIndex, rng = Math.random) {
  const grid = makeGrid(ROWS, COLS, levelIndex, rng);
  return {
    level: levelIndex,
    grid,
    rows: ROWS,
    cols: COLS,
    player: { r: 0, c: Math.floor(COLS / 2) },
    gold: 0,
    goal: 120 + levelIndex * 60,
    lives: START_LIVES,
    over: false,
    won: false,
  };
}

const DIRS = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };

function checkEnd(game) {
  if (game.gold >= game.goal) { game.over = true; game.won = true; return; }
  if (game.lives <= 0) { game.over = true; game.won = false; }
}

/** Di chuyển hoặc đập đá theo hướng `dir`. Trả về mô tả hành động đã xảy ra. */
export function act(game, dir) {
  if (game.over) return { type: 'none' };
  const [dr, dc] = DIRS[dir] || [0, 0];
  const tr = game.player.r + dr;
  const tc = game.player.c + dc;
  if (tr < 0 || tr >= game.rows || tc < 0 || tc >= game.cols) return { type: 'none' };

  const cell = game.grid[tr][tc];
  if (cell.type === 'empty') {
    game.player = { r: tr, c: tc };
    return { type: 'move' };
  }

  // đá/tảng đá: đập 1 nhát, giảm máu
  cell.hp--;
  if (cell.hp > 0) return { type: 'dig', broken: false };

  const gold = cell.gold;
  cell.type = 'empty';
  cell.gold = 0;
  game.gold += gold;
  game.player = { r: tr, c: tc };
  checkEnd(game);
  return { type: 'dig', broken: true, gold };
}

/** 1 nhịp trọng lực: đá không có điểm tựa rơi xuống 1 ô. Trả true nếu còn đá đang rơi. */
export function stepGravity(game) {
  if (game.over) return false;
  let moving = false;
  // Quét từ hàng gần đáy lên trên để tránh 1 viên đá rơi 2 lần trong cùng 1 nhịp.
  for (let r = game.rows - 2; r >= 0; r--) {
    for (let c = 0; c < game.cols; c++) {
      const cell = game.grid[r][c];
      if (cell.type !== 'rock') continue;
      const below = game.grid[r + 1][c];
      if (below.type !== 'empty') continue;
      // Đá rơi trúng người chơi → mất 1 mạng, đá vỡ tan (không tính vàng)
      if (game.player.r === r + 1 && game.player.c === c) {
        game.lives--;
        cell.type = 'empty';
        cell.hp = 0;
        cell.gold = 0;
        checkEnd(game);
        moving = true;
        continue;
      }
      game.grid[r + 1][c] = cell;
      game.grid[r][c] = { type: 'empty', hp: 0, gold: 0 };
      moving = true;
    }
  }
  return moving;
}
