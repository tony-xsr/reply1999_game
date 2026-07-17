// Cơn Sốt Tìm Vàng: 60 giây đào cuồng nhiệt! BẤM 1 viên để gom cả cụm cùng màu dính liền,
// hoặc KÉO ngón tay lướt qua nhiều viên cùng màu liền kề để gom đúng đường kéo đó — đá mới
// liên tục rơi xuống lấp đầy (khác Đập Vàng: theo lượt, không lấp lại). Gom cụm to liên tiếp
// thật nhanh để nối COMBO, combo cao bùng thành CƠN SỐT VÀNG nhân đôi điểm.
// Cơ chế "bấm/kéo cụm cùng màu" thuộc thể loại kinh điển. File thuần logic, test độc lập.

export const COLS = 9;
export const ROWS = 10;
export const NUM_COLORS = 5; // vàng, đỏ, xanh dương, xanh lá, tím
export const ROUND_MS = 60000;
export const COMBO_WINDOW_MS = 2500; // gom cụm ≥4 trong 2.5s kể từ lần gom trước → nối combo
export const COMBO_MIN_SIZE = 4;
export const FEVER_AT = 3; // combo đạt mốc này → CƠN SỐT
export const FEVER_MS = 6000;

export function makeLevel(levelIndex, rng = Math.random) {
  return {
    level: levelIndex,
    grid: Array.from({ length: ROWS }, () => (
      Array.from({ length: COLS }, () => Math.floor(rng() * NUM_COLORS))
    )),
    timeLeftMs: ROUND_MS,
    target: 400 + levelIndex * 250,
    score: 0,
    combo: 0,
    maxCombo: 0,
    feverMs: 0,
    sinceClearMs: 999999, // thời gian từ lần gom trước (để xét nối combo)
    over: false,
    won: false,
  };
}

/** Cụm cùng màu dính liền (4 hướng) chứa ô (r,c). */
export function findCluster(grid, r, c) {
  const color = grid[r][c];
  if (color === null) return [];
  const seen = new Set([`${r},${c}`]);
  const stack = [[r, c]];
  const out = [];
  while (stack.length) {
    const [cr, cc] = stack.pop();
    out.push([cr, cc]);
    for (const [nr, nc] of [[cr - 1, cc], [cr + 1, cc], [cr, cc - 1], [cr, cc + 1]]) {
      const key = `${nr},${nc}`;
      if (nr < 0 || nc < 0 || nr >= ROWS || nc >= COLS || seen.has(key)) continue;
      if (grid[nr][nc] === color) {
        seen.add(key);
        stack.push([nr, nc]);
      }
    }
  }
  return out;
}

/** Cột sụp xuống rồi đá mới rơi từ trên lấp đầy — sân KHÔNG bao giờ vơi. */
function collapseAndRefill(grid, rng) {
  for (let c = 0; c < COLS; c++) {
    const stack = [];
    for (let r = ROWS - 1; r >= 0; r--) {
      if (grid[r][c] !== null) stack.push(grid[r][c]);
    }
    for (let r = ROWS - 1; r >= 0; r--) {
      grid[r][c] = stack.length ? stack.shift() : Math.floor(rng() * NUM_COLORS);
    }
  }
}

/**
 * Gom đúng danh sách ô `cells` đã cho (không tự dò cụm) — dùng chung cho cả tapAt (cụm
 * dò tự động) lẫn dragTo (đường kéo tay bé tự chọn). Tính điểm/combo/fever/thắng thua
 * giống hệt nhau ở cả 2 cách chơi. Trả về sự kiện:
 * { cleared, gained, combo, fever: vừa bùng sốt?, won }
 */
function applyClear(game, cells, rng) {
  const ev = { cleared: 0, gained: 0, combo: game.combo, fever: false, won: false };
  const n = cells.length;
  if (n < 2) return ev;

  // nối combo: cụm đủ to VÀ gom đủ nhanh sau lần trước
  if (n >= COMBO_MIN_SIZE && game.sinceClearMs <= COMBO_WINDOW_MS) {
    game.combo++;
  } else if (n >= COMBO_MIN_SIZE) {
    game.combo = 1;
  } else {
    game.combo = 0;
  }
  game.maxCombo = Math.max(game.maxCombo, game.combo);
  if (game.combo >= FEVER_AT && game.feverMs <= 0) {
    game.feverMs = FEVER_MS;
    ev.fever = true;
  }

  // điểm: cụm càng to càng lời (n²), nhân combo, CƠN SỐT nhân đôi
  let gained = n * n;
  gained = Math.round(gained * (1 + game.combo * 0.5));
  if (game.feverMs > 0) gained *= 2;
  game.score += gained;

  for (const [cr, cc] of cells) game.grid[cr][cc] = null;
  collapseAndRefill(game.grid, rng);
  game.sinceClearMs = 0;

  ev.cleared = n;
  ev.gained = gained;
  ev.combo = game.combo;
  if (game.score >= game.target) {
    game.over = true;
    game.won = true;
    game.score += Math.round(game.timeLeftMs / 1000) * 5; // thưởng giây còn dư
    ev.won = true;
  }
  return ev;
}

/**
 * Bấm ô (r,c): tự dò VÀ gom cả cụm cùng màu dính liền (4 hướng) chứa ô đó.
 * Trả về sự kiện: { cleared, gained, combo, fever, won } (0 nếu cụm < 2 viên).
 */
export function tapAt(game, r, c, rng = Math.random) {
  if (game.over || r < 0 || c < 0 || r >= ROWS || c >= COLS) {
    return { cleared: 0, gained: 0, combo: game.combo, fever: false, won: false };
  }
  const cluster = findCluster(game.grid, r, c);
  return applyClear(game, cluster, rng);
}

/**
 * Kéo tay lướt qua đúng dãy ô `cells` (mảng [r,c] theo thứ tự ngón tay đi qua) — CHỈ gom
 * đúng những ô đó (không tự lan ra cả cụm). Tự lọc: loại ô trùng lặp/ngoài bàn/khác màu
 * với ô đầu tiên trong dãy — nên giao diện có thể đưa cả đường kéo thô mà không cần lọc trước.
 * Trả về sự kiện giống tapAt.
 */
export function dragTo(game, cells, rng = Math.random) {
  const empty = { cleared: 0, gained: 0, combo: game.combo, fever: false, won: false };
  if (game.over || !Array.isArray(cells) || cells.length < 2) return empty;
  const [r0, c0] = cells[0];
  if (r0 < 0 || c0 < 0 || r0 >= ROWS || c0 >= COLS) return empty;
  const color = game.grid[r0][c0];
  if (color === null) return empty;

  const seen = new Set();
  const unique = [];
  for (const [r, c] of cells) {
    if (r < 0 || c < 0 || r >= ROWS || c >= COLS) continue;
    const key = `${r},${c}`;
    if (seen.has(key)) continue;
    if (game.grid[r][c] !== color) continue;
    seen.add(key);
    unique.push([r, c]);
  }
  return applyClear(game, unique, rng);
}

/** Trôi thời gian. Trả về { timeout } khi hết giờ (thua nếu chưa đạt mục tiêu). */
export function tick(game, dtMs) {
  const ev = { timeout: false };
  if (game.over) return ev;
  game.timeLeftMs -= dtMs;
  game.sinceClearMs += dtMs;
  game.feverMs = Math.max(0, game.feverMs - dtMs);
  if (game.feverMs <= 0 && game.combo >= FEVER_AT) game.combo = 0; // hết sốt thì combo về 0
  if (game.timeLeftMs <= 0) {
    game.timeLeftMs = 0;
    game.over = true;
    game.won = false;
    ev.timeout = true;
  }
  return ev;
}
