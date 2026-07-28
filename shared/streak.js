// Chuỗi ngày đăng nhập liên tục ("streak") — thưởng sao khi bé vào chơi đều
// đặn nhiều ngày liên tiếp, tính từ bảng kid_logins (ghi mỗi lần bé chọn hồ
// sơ ở /chon-be/). Mốc & sao thưởng đã chốt với phụ huynh: 5 ngày = 5 sao,
// 10 ngày = 10 sao, 20 ngày = 20 sao, 50 ngày = 50 sao (thêm mốc mới chỉ cần
// nối dài STREAK_MILESTONES, không cần đổi công thức). Hàm THUẦN — phần đọc
// kid_logins thật + ghi sổ "đã nhận mốc nào" nằm ở shared/api.js.

export const STREAK_MILESTONES = [5, 10, 20, 50];

/** Số sao thưởng cho 1 mốc ngày — hiện tại bằng đúng số ngày của mốc đó. */
export function starsForMilestone(milestone) {
  return milestone;
}

/** Rút gọn danh sách thời điểm đăng nhập thô -> danh sách ngày (YYYY-MM-DD) duy nhất, tăng dần. */
export function uniqueLoginDays(loginTimestamps) {
  const days = new Set((loginTimestamps || []).map((ts) => String(ts).slice(0, 10)));
  return [...days].sort();
}

function dayKeyOffset(dayKey, offsetDays) {
  const d = new Date(`${dayKey}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

/**
 * Streak hiện tại tính đến `todayKey` — số ngày liên tục có đăng nhập, đếm
 * lùi từ HÔM NAY nếu hôm nay đã đăng nhập, hoặc từ HÔM QUA nếu hôm nay CHƯA
 * đăng nhập nhưng hôm qua có (streak vẫn "sống" cho tới hết hôm nay, chưa
 * tính là đứt). Nghỉ liền 2 ngày (hôm qua VÀ hôm nay đều không đăng nhập)
 * mới coi là đứt streak (về 0).
 */
export function computeCurrentStreak(loginDays, todayKey) {
  const daySet = new Set(loginDays);
  let anchor = todayKey;
  if (!daySet.has(anchor)) {
    const yesterday = dayKeyOffset(todayKey, -1);
    if (!daySet.has(yesterday)) return 0;
    anchor = yesterday;
  }
  let streak = 0;
  let cursor = anchor;
  while (daySet.has(cursor)) {
    streak++;
    cursor = dayKeyOffset(cursor, -1);
  }
  return streak;
}

/** Mốc MỚI bé vừa đủ điều kiện nhận (streak đã tới nhưng chưa nhận) — null nếu chưa có mốc mới nào. */
export function nextClaimableMilestone(currentStreak, claimedMax) {
  const next = STREAK_MILESTONES.find((m) => m > claimedMax && currentStreak >= m);
  return next ?? null;
}
