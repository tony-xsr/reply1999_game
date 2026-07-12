// Logic ghép hình trượt (n×n, 1 ô trống) — thuần, nhận rng để test.
// Xáo trộn bằng cách đi ngẫu nhiên từ thế đã giải → LUÔN giải được.

/** Tạo bàn đã giải: tiles[vịtrí] = mảnh; mảnh cuối (n²-1) là ô trống. */
export function createPuzzle(n) {
  return { n, tiles: Array.from({ length: n * n }, (_, i) => i) };
}

export const blankIndex = (p) => p.tiles.indexOf(p.n * p.n - 1);

/** Ô idx có trượt được không (cùng hàng hoặc cùng cột với ô trống)? */
export function canSlide(p, idx) {
  const b = blankIndex(p);
  if (idx === b) return false;
  const { n } = p;
  return Math.floor(idx / n) === Math.floor(b / n) || idx % n === b % n;
}

/** Trượt: dồn cả dãy ô giữa idx và ô trống về phía ô trống. @returns true nếu đi được */
export function slide(p, idx) {
  if (!canSlide(p, idx)) return false;
  const b = blankIndex(p);
  const { n } = p;
  const step = Math.floor(idx / n) === Math.floor(b / n) ? (idx > b ? 1 : -1) : (idx > b ? n : -n);
  for (let cur = b; cur !== idx; cur += step) {
    p.tiles[cur] = p.tiles[cur + step];
  }
  p.tiles[idx] = p.n * p.n - 1;
  return true;
}

export function isSolved(p) {
  return p.tiles.every((v, i) => v === i);
}

/** Xáo trộn bằng k bước đi lẻ hợp lệ (không đi ngược lại bước vừa rồi). */
export function scramble(p, moves = 120, rng = Math.random) {
  let prevBlank = -1;
  for (let i = 0; i < moves; i++) {
    const b = blankIndex(p);
    const { n } = p;
    const neighbors = [];
    if (b % n > 0) neighbors.push(b - 1);
    if (b % n < n - 1) neighbors.push(b + 1);
    if (b >= n) neighbors.push(b - n);
    if (b < n * n - n) neighbors.push(b + n);
    const options = neighbors.filter((x) => x !== prevBlank);
    const pick = options[Math.floor(rng() * options.length)];
    prevBlank = b;
    slide(p, pick);
  }
  if (isSolved(p)) scramble(p, moves, rng); // hi hữu xáo xong vẫn đúng chỗ
  return p;
}

/** Kiểm chứng giải được (đếm nghịch thế + hàng của ô trống) — dùng cho test. */
export function isSolvable(p) {
  const { n } = p;
  const arr = p.tiles.filter((v) => v !== n * n - 1);
  let inv = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) if (arr[i] > arr[j]) inv++;
  }
  if (n % 2 === 1) return inv % 2 === 0;
  const blankRowFromBottom = n - Math.floor(blankIndex(p) / n);
  return (inv + blankRowFromBottom) % 2 === 1;
}
