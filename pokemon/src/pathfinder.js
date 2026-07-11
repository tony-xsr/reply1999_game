// Thuật toán lõi: tìm đường nối 2 ô với tối đa 2 lần rẽ (3 đoạn thẳng).
// Bàn được bao quanh bởi vành đai ô trống rộng 1 ô (tọa độ -1 và rows/cols)
// nên đường nối được phép vòng ra ngoài mép bàn.

const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

/**
 * Tìm đường nối từ ô a đến ô b (chỉ xét hình học, không so sánh icon).
 * @param {(number|null)[][]} board - ma trận, null = ô trống
 * @param {{r:number,c:number}} a - ô xuất phát (phải có icon)
 * @param {{r:number,c:number}} b - ô đích (phải có icon)
 * @returns {{r:number,c:number}[]|null} danh sách điểm gấp khúc (gồm cả a, b), hoặc null
 */
export function findPath(board, a, b) {
  const rows = board.length;
  const cols = board[0].length;
  if (a.r === b.r && a.c === b.c) return null;

  const W = cols + 2;
  const key = (r, c) => (r + 1) * W + (c + 1);

  // Ô đi qua được: ô trống trong bàn, hoặc vành đai ngoài mép (rộng 1 ô)
  const isFree = (r, c) => {
    if (r < -1 || r > rows || c < -1 || c > cols) return false;
    if (r < 0 || r >= rows || c < 0 || c >= cols) return true;
    return board[r][c] == null;
  };

  // BFS theo lớp: mỗi lớp = 1 đoạn thẳng. Đến đích trong ≤3 lớp là hợp lệ.
  // parent lưu điểm-gấp-khúc trước đó để dựng lại đường đi.
  const parent = new Map();
  const startKey = key(a.r, a.c);
  parent.set(startKey, -1);
  let frontier = [{ r: a.r, c: a.c, k: startKey }];

  for (let seg = 0; seg < 3; seg++) {
    const next = [];
    for (const p of frontier) {
      for (const [dr, dc] of DIRS) {
        let r = p.r + dr;
        let c = p.c + dc;
        while (true) {
          if (r === b.r && c === b.c) {
            // Đến đích — dựng lại đường đi từ chuỗi parent
            const path = [{ r, c }];
            let cur = p.k;
            while (cur !== -1) {
              path.push({ r: Math.floor(cur / W) - 1, c: (cur % W) - 1 });
              cur = parent.get(cur);
            }
            return path.reverse();
          }
          if (!isFree(r, c)) break;
          const k = key(r, c);
          if (!parent.has(k)) {
            parent.set(k, p.k);
            next.push({ r, c, k });
          }
          r += dr;
          c += dc;
        }
      }
    }
    frontier = next;
  }
  return null;
}

/**
 * Tìm một nước đi bất kỳ trên bàn (cặp ô cùng icon nối được).
 * Dùng cho: gợi ý, kiểm tra bế tắc.
 * @returns {{a:{r,c}, b:{r,c}, path:Array}|null}
 */
export function findAnyMove(board) {
  const rows = board.length;
  const cols = board[0].length;
  // Gom vị trí theo loại icon để giảm số cặp phải thử
  const groups = new Map();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = board[r][c];
      if (v == null) continue;
      if (!groups.has(v)) groups.set(v, []);
      groups.get(v).push({ r, c });
    }
  }
  for (const cells of groups.values()) {
    for (let i = 0; i < cells.length; i++) {
      for (let j = i + 1; j < cells.length; j++) {
        const path = findPath(board, cells[i], cells[j]);
        if (path) return { a: cells[i], b: cells[j], path };
      }
    }
  }
  return null;
}
