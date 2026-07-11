// Điểm số, combo và bảng xếp hạng TOP (localStorage).

const TOP_KEY = 'pika.top';
const COMBO_WINDOW_MS = 3000;
const MAX_COMBO = 5;
export const PAIR_SCORE = 10;

export class Score {
  constructor() {
    this.value = 0;
    this.combo = 0;
    this._lastMatch = 0;
  }

  /** Cộng điểm cho 1 cặp; xóa liên tiếp trong 3s thì nhân combo (tối đa x5). */
  addPair(now = Date.now()) {
    this.combo = now - this._lastMatch <= COMBO_WINDOW_MS
      ? Math.min(this.combo + 1, MAX_COMBO)
      : 1;
    this._lastMatch = now;
    const gained = PAIR_SCORE * this.combo;
    this.value += gained;
    return { gained, combo: this.combo };
  }

  addBonus(points) {
    this.value += Math.max(0, Math.round(points));
  }
}

/** @returns {{score:number, level:number, date:string}[]} top 10 điểm cao */
export function getTop() {
  try {
    const list = JSON.parse(localStorage.getItem(TOP_KEY));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

/** Lưu điểm vào bảng TOP; trả về danh sách mới. */
export function saveTop(score, level) {
  const top = getTop();
  top.push({ score, level, date: new Date().toISOString().slice(0, 10) });
  top.sort((a, b) => b.score - a.score);
  const cut = top.slice(0, 10);
  try { localStorage.setItem(TOP_KEY, JSON.stringify(cut)); } catch { /* private mode */ }
  return cut;
}
