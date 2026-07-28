// Thưởng "hoàn thành hết chỉ tiêu hôm nay" cho Luyện Dịch + Trắc Nghiệm Ngữ
// Pháp (dùng chung cho exam-prep + 4 bản khoá cấp độ ket/pet/toefl-junior/
// toeic) — mỗi phần +5 sao khi bé làm xong HẾT chỉ tiêu của phần đó trong
// ngày (không tính đúng/sai bao nhiêu, chỉ cần LÀM HẾT), tối đa 1 lần/ngày/
// phần. Hàm THUẦN ở đây chỉ tính "đã đủ điều kiện thưởng chưa" — phần đọc/
// ghi mốc "đã thưởng ngày nào" (chống thưởng trùng) nằm ở shared/api.js.

export const DAILY_PRACTICE_BONUS_STARS = 5;

/** Bé đã làm xong ĐỦ chỉ tiêu hôm nay chưa (vd 3/3 bài dịch, hoặc 1/1 bài trắc nghiệm). */
export function isQuotaComplete(doneCount, totalCount) {
  return totalCount > 0 && doneCount >= totalCount;
}

/** Đủ điều kiện thưởng: làm xong hết chỉ tiêu VÀ hôm nay CHƯA được thưởng phần này rồi. */
export function isBonusDue(doneCount, totalCount, lastRewardedDay, todayKey) {
  return isQuotaComplete(doneCount, totalCount) && lastRewardedDay !== todayKey;
}

/** Tỉ lệ hoàn thành (0..1), dùng vẽ progress bar. */
export function quotaProgress(doneCount, totalCount) {
  if (totalCount <= 0) return 0;
  return Math.max(0, Math.min(1, doneCount / totalCount));
}
