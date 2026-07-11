// Cấu hình 7 level + luật dồn ô sau mỗi lần xóa cặp (đặc trưng Pikachu cổ điển).

export const LEVELS = [
  { gravity: 'none',   time: 240, types: 24 }, // Level 1: tĩnh
  { gravity: 'down',   time: 225, types: 26 }, // Level 2: dồn xuống
  { gravity: 'up',     time: 210, types: 28 }, // Level 3: dồn lên
  { gravity: 'left',   time: 195, types: 30 }, // Level 4: dồn trái
  { gravity: 'right',  time: 180, types: 32 }, // Level 5: dồn phải
  { gravity: 'center', time: 165, types: 34 }, // Level 6: dồn vào giữa (ngang)
  { gravity: 'split',  time: 150, types: 36 }, // Level 7: tách ra 2 phía
];

// Nén một dãy giá trị về phía đầu dãy, giữ nguyên thứ tự
function compact(values) {
  const filled = values.filter((v) => v != null);
  while (filled.length < values.length) filled.push(null);
  return filled;
}

function readCol(board, c) { return board.map((row) => row[c]); }
function writeCol(board, c, vals) { vals.forEach((v, r) => { board[r][c] = v; }); }

/**
 * Dồn các ô còn lại theo luật của level.
 * @returns {boolean} true nếu có ô bị dịch chuyển (cần vẽ lại)
 */
export function applyGravity(board, mode) {
  if (mode === 'none') return false;
  const rows = board.length;
  const cols = board[0].length;
  const mid = Math.floor(cols / 2);
  const before = JSON.stringify(board);

  switch (mode) {
    case 'down':
      for (let c = 0; c < cols; c++) {
        writeCol(board, c, compact(readCol(board, c).reverse()).reverse());
      }
      break;
    case 'up':
      for (let c = 0; c < cols; c++) {
        writeCol(board, c, compact(readCol(board, c)));
      }
      break;
    case 'left':
      for (let r = 0; r < rows; r++) board[r] = compact(board[r]);
      break;
    case 'right':
      for (let r = 0; r < rows; r++) board[r] = compact(board[r].reverse()).reverse();
      break;
    case 'center':
      // Nửa trái dồn về sát tâm, nửa phải dồn về sát tâm
      for (let r = 0; r < rows; r++) {
        const left = compact(board[r].slice(0, mid).reverse()).reverse();
        const right = compact(board[r].slice(mid));
        board[r] = left.concat(right);
      }
      break;
    case 'split':
      // Nửa trái dồn ra mép trái, nửa phải dồn ra mép phải
      for (let r = 0; r < rows; r++) {
        const left = compact(board[r].slice(0, mid));
        const right = compact(board[r].slice(mid).reverse()).reverse();
        board[r] = left.concat(right);
      }
      break;
    default:
      return false;
  }
  return JSON.stringify(board) !== before;
}
