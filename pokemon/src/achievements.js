// Thành tích — lưu localStorage, mở khóa 1 lần, hiện toast khi đạt.

const KEY = 'pika.ach';

export const ACHIEVEMENTS = [
  { id: 'first_clear',   icon: '🌟', key: 'pika.ach.first_clear',   vi: 'Qua level đầu tiên' },
  { id: 'combo5',        icon: '🔥', key: 'pika.ach.combo5',        vi: 'Đạt combo x5' },
  { id: 'fast_clear',    icon: '⚡', key: 'pika.ach.fast_clear',    vi: 'Qua level khi còn hơn nửa thời gian' },
  { id: 'no_hint_level', icon: '🧠', key: 'pika.ach.no_hint_level', vi: 'Qua level không dùng gợi ý' },
  { id: 'champion',      icon: '🏆', key: 'pika.ach.champion',      vi: 'Hoàn thành cả 7 level Cổ điển' },
  { id: 'zen_master',    icon: '🧘', key: 'pika.ach.zen_master',    vi: 'Hoàn thành cả 7 level Zen' },
  { id: 'daily_done',    icon: '📅', key: 'pika.ach.daily_done',    vi: 'Hoàn thành 1 bàn Daily' },
  { id: 'duel_win',      icon: '⚔️', key: 'pika.ach.duel_win',      vi: 'Thắng 1 ván 2 Người' },
];

export function getUnlocked() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

/** @returns {object|null} định nghĩa thành tích nếu VỪA mở khóa, null nếu đã có/không tồn tại */
export function unlock(id) {
  const def = ACHIEVEMENTS.find((a) => a.id === id);
  if (!def) return null;
  const unlocked = getUnlocked();
  if (unlocked.includes(id)) return null;
  unlocked.push(id);
  try { localStorage.setItem(KEY, JSON.stringify(unlocked)); } catch { /* private mode */ }
  return def;
}
