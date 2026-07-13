// Daily challenge — mỗi ngày 1 bàn cố định (seed theo ngày), luật dồn ô theo thứ.

import { mulberry32 } from './board.js';

const BEST_KEY = 'pika.daily';

// Chủ nhật → thứ bảy: 7 luật dồn ô, mỗi ngày một luật
export const DAILY_GRAVITY = ['none', 'down', 'up', 'left', 'right', 'center', 'split'];

export function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD (UTC — chung toàn cầu)
}

export function dailySeed(d = new Date()) {
  return Number(todayKey(d).replaceAll('-', ''));
}

export function dailyRng(d = new Date()) {
  return mulberry32(dailySeed(d));
}

export function dailyGravity(d = new Date()) {
  return DAILY_GRAVITY[d.getUTCDay()];
}

/** @returns {number|null} điểm cao nhất của ngày hôm nay */
export function getDailyBest(d = new Date()) {
  try {
    const rec = JSON.parse(localStorage.getItem(BEST_KEY));
    return rec && rec.date === todayKey(d) ? rec.score : null;
  } catch {
    return null;
  }
}

/** Lưu nếu cao hơn kỷ lục hôm nay; trả về kỷ lục mới. */
export function saveDailyBest(score, d = new Date()) {
  const best = getDailyBest(d);
  const top = best == null ? score : Math.max(best, score);
  try {
    localStorage.setItem(BEST_KEY, JSON.stringify({ date: todayKey(d), score: top }));
  } catch { /* private mode */ }
  return top;
}
