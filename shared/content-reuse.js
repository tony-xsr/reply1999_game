// Tái sử dụng nội dung Luyện Dịch/Trắc Nghiệm Ngữ Pháp ĐÃ CÓ trong CẢ NHÀ
// (không riêng 1 bé) thay vì luôn gọi AI sinh mới mỗi ngày mỗi bé — 2 lợi
// ích: (1) tiết kiệm chi phí AI khi nhiều bé cùng nhà học cùng cấp độ ("1
// bài thi có thể có nhiều học sinh làm"), (2) anh/chị/em cùng ngày KHÔNG bị
// trùng y hệt bài của nhau (dễ chép bài) vì loại trừ nội dung sibling khác
// đang dùng HÔM NAY. Đồng thời là cơ chế giúp bé "ôn lại" nội dung cũ một
// cách tự nhiên (nội dung cũ có thể trồi lại sau một thời gian — spaced
// repetition). Hàm THUẦN — phần đọc dữ liệu thật (translation_passages/
// grammar_quizzes của CẢ NHÀ trong REUSE_WINDOW_DAYS ngày gần đây) nằm ở
// shared/api.js (familyPassagesForReuse/familyGrammarQuizzesForReuse).

export const REUSE_WINDOW_DAYS = 45;

/**
 * Chọn 1 mục nội dung phù hợp để DÙNG LẠI cho bé `profileId` hôm nay, hoặc
 * null nếu không có mục nào phù hợp (bên gọi tự sinh mới bằng AI).
 * @param {Array<{id:string, day:string, profile_id:string}>} items nội dung
 *   của CẢ NHÀ cùng cấp độ (+loại, nếu có) trong REUSE_WINDOW_DAYS ngày gần
 *   đây — CHƯA lọc gì, hàm này tự lọc.
 * @param {{profileId:string, todayKey:string, doneIds:Set<string>}} ctx
 * @returns mục phù hợp CŨ NHẤT trước (đã "nguội" lâu nhất — ôn lại tốt nhất).
 */
export function pickReusableContent(items, { profileId, todayKey, doneIds }) {
  const eligible = (items || []).filter((it) => {
    if (doneIds && doneIds.has(it.id)) return false; // bé NÀY đã làm bài này rồi
    if (it.day === todayKey && it.profile_id !== profileId) return false; // sibling khác đang dùng HÔM NAY -> tránh chép bài
    return true;
  });
  if (!eligible.length) return null;
  return eligible.slice().sort((a, b) => (a.day < b.day ? -1 : a.day > b.day ? 1 : 0))[0];
}
