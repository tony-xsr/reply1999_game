// Kim Cương Lấp Lánh: kéo nối 2 viên kim cương cùng màu thành 1 đường liền mạch,
// các đường không được cắt/đè lên nhau — cơ chế "nối đường" (kiểu Flow Free), CỐ TÌNH
// khác hẳn 2 game nối màu đã có (Vị Vua Vàng đổi chỗ tạo hàng 3, Đập Vàng bấm đập cụm).
// Toàn bộ file này thuần logic (không đụng DOM), test được độc lập.

/** Kích thước bàn theo màn — chặn trần 6×6 để số cặp không vượt quá bảng màu. */
export const SIZES = [4, 5, 5, 6, 6, 6];

/** Số cặp tối đa có thể sinh ra: bàn 6×6 với mỗi đường dài ≥3 ô → tối đa 12 cặp. */
export const MAX_PAIRS = 12;

function neighborIdx(idx, size) {
  const r = Math.floor(idx / size);
  const c = idx % size;
  const out = [];
  if (r > 0) out.push(idx - size);
  if (r < size - 1) out.push(idx + size);
  if (c > 0) out.push(idx - 1);
  if (c < size - 1) out.push(idx + 1);
  return out;
}

/**
 * Chia kín bàn size×size thành các đường đi dài ≥3 ô — mỗi đường trở thành 1 cặp kim cương
 * (2 đầu đường), nên màn nào cũng CHẮC CHẮN có lời giải: các đường không bao giờ đè nhau.
 * Mẹo sinh: luôn bắt đầu/lan sang ô trống "bí" nhất (ít ô trống kề nhất) để không bỏ sót
 * ô lẻ loi; nếu lỡ kẹt lại đường ngắn hơn 3 ô thì làm lại từ đầu (rất hiếm khi phải thử lâu).
 */
export function generatePaths(size, rng = Math.random) {
  for (let attempt = 0; attempt < 500; attempt++) {
    const owner = new Array(size * size).fill(-1);
    let freeLeft = size * size;
    const paths = [];
    let stuck = false;
    while (freeLeft > 0 && !stuck) {
      let starts = [];
      let fewest = 9;
      for (let i = 0; i < owner.length; i++) {
        if (owner[i] !== -1) continue;
        const n = neighborIdx(i, size).filter((j) => owner[j] === -1).length;
        if (n < fewest) { fewest = n; starts = [i]; }
        else if (n === fewest) starts.push(i);
      }
      const start = starts[Math.floor(rng() * starts.length)];
      const maxLen = 4 + Math.floor(rng() * 3); // mỗi đường dài 3–6 ô, thiên về 4–6
      const path = [start];
      owner[start] = paths.length;
      freeLeft--;
      while (path.length < maxLen) {
        const frees = neighborIdx(path[path.length - 1], size).filter((j) => owner[j] === -1);
        if (!frees.length) break;
        let nexts = [];
        let best = 9;
        for (const j of frees) {
          const n = neighborIdx(j, size).filter((k) => owner[k] === -1).length;
          if (n < best) { best = n; nexts = [j]; }
          else if (n === best) nexts.push(j);
        }
        const cell = nexts[Math.floor(rng() * nexts.length)];
        path.push(cell);
        owner[cell] = paths.length;
        freeLeft--;
      }
      if (path.length < 3) stuck = true;
      else paths.push(path);
    }
    if (!stuck && paths.length <= MAX_PAIRS) {
      return paths.map((p) => p.map((idx) => [Math.floor(idx / size), idx % size]));
    }
  }
  return null; // thực tế không xảy ra với size 4–6
}

export function makeGame(levelIndex, rng = Math.random) {
  const size = SIZES[Math.min(levelIndex, SIZES.length - 1)];
  const solution = generatePaths(size, rng);
  const pairs = solution.map((p) => ({ a: p[0], b: p[p.length - 1] }));
  return {
    level: levelIndex,
    size,
    pairs,
    solution, // chỉ dùng cho test/gợi ý — người chơi có thể nối theo cách khác cũng được
    paths: pairs.map(() => []),
    done: pairs.map(() => false),
    won: false,
  };
}

function samePos(p, r, c) { return p[0] === r && p[1] === c; }

/** Ô (r,c) có viên kim cương của cặp nào? Trả về chỉ số cặp hoặc -1. */
export function endpointAt(game, r, c) {
  return game.pairs.findIndex((p) => samePos(p.a, r, c) || samePos(p.b, r, c));
}

/** Ô (r,c) đang nằm trên đường vẽ của cặp nào (bỏ qua cặp `except`)? */
export function pathAt(game, r, c, except = -1) {
  for (let i = 0; i < game.paths.length; i++) {
    if (i === except) continue;
    if (game.paths[i].some((p) => samePos(p, r, c))) return i;
  }
  return -1;
}

/**
 * Đặt tay xuống ô (r,c): chạm viên kim cương → vẽ lại đường của cặp đó từ đầu;
 * chạm giữa đường đã vẽ → cắt ngắn đường tới đúng ô đó rồi vẽ tiếp.
 * Trả về chỉ số cặp đang vẽ, hoặc -1 nếu ô không bắt đầu được.
 */
export function startPath(game, r, c) {
  if (game.won) return -1;
  const pi = endpointAt(game, r, c);
  if (pi !== -1) {
    game.paths[pi] = [[r, c]];
    game.done[pi] = false;
    return pi;
  }
  const onPath = pathAt(game, r, c);
  if (onPath !== -1) {
    const at = game.paths[onPath].findIndex((p) => samePos(p, r, c));
    game.paths[onPath] = game.paths[onPath].slice(0, at + 1);
    game.done[onPath] = false;
    return onPath;
  }
  return -1;
}

/**
 * Kéo dài đường của cặp i sang ô (r,c) KỀ BÊN (không chéo). Trả true nếu nước kéo hợp lệ.
 * Quay lại ô cũ của chính đường mình → cắt ngắn tới đó. Chạm viên kim cương còn lại
 * của cặp mình → nối xong; nối đủ mọi cặp → thắng màn.
 */
export function extendPath(game, i, r, c) {
  if (game.won || i < 0 || i >= game.paths.length || game.done[i]) return false;
  const path = game.paths[i];
  if (!path.length) return false;
  const [lr, lc] = path[path.length - 1];
  if (Math.abs(lr - r) + Math.abs(lc - c) !== 1) return false;
  const revisit = path.findIndex((p) => samePos(p, r, c));
  if (revisit !== -1) {
    game.paths[i] = path.slice(0, revisit + 1);
    return true;
  }
  const ep = endpointAt(game, r, c);
  if (ep !== -1 && ep !== i) return false; // kim cương của cặp khác chắn đường
  if (pathAt(game, r, c, i) !== -1) return false; // không được đè lên đường cặp khác
  path.push([r, c]);
  if (ep === i) {
    // path[0] luôn là 1 trong 2 viên của cặp; tới đây (r,c) chưa từng nằm trên đường
    // nên chắc chắn là viên CÒN LẠI → nối xong cặp này.
    game.done[i] = true;
    if (game.done.every(Boolean)) game.won = true;
  }
  return true;
}

/** Đã nối xong bao nhiêu cặp? */
export function connectedCount(game) {
  return game.done.filter(Boolean).length;
}
