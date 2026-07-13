// Logic Nhảy Lò Cò — thuần, test được.
// 3 chế độ đếm: 1→10 (từng số), cách 2 (2→20), cách 5 (5→50).

export const MODES = {
  step1: { step: 1, count: 10, label: '1 → 10' },
  step2: { step: 2, count: 10, label: 'Cách 2' },
  step5: { step: 5, count: 10, label: 'Cách 5' },
};

/** Dãy số của sân theo chế độ (10 ô). */
export function makeCourse(mode) {
  const { step, count } = MODES[mode];
  return Array.from({ length: count }, (_, i) => (i + 1) * step);
}

/**
 * Bố cục sân lò cò cổ điển từ dưới lên: đơn–đôi xen kẽ, ô cuối là "trời".
 * @returns {number[][]} mỗi phần tử = 1 hàng, chứa chỉ số ô (0..9)
 */
export const COURT_ROWS = [[0], [1, 2], [3], [4, 5], [6], [7, 8], [9]];

/** Đọc số 1..50 bằng tiếng Việt. */
export function viNumber(n) {
  const digits = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  if (n < 10) return digits[n];
  if (n === 10) return 'mười';
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  const tensWord = tens === 1 ? 'mười' : `${digits[tens]} mươi`;
  if (ones === 0) return tensWord;
  const onesWord = ones === 1 && tens > 1 ? 'mốt' : ones === 5 ? 'lăm' : digits[ones];
  return `${tensWord} ${onesWord}`;
}
