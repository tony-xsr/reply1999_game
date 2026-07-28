// Gộp "từ vựng hay sai" (weak_words, có sẵn từ trước — nhiều mini-game từ
// vựng cùng ghi vào) + "cấu trúc ngữ pháp hay sai" (weak_grammar_points, xem
// migrate-15-grammar-miss.sql) thành 1 đoạn văn bản thuần tiếng Việt, dùng
// làm NGỮ CẢNH THÊM khi nhờ AI soạn bài dịch/trắc nghiệm mới — để AI ưu tiên
// ra thêm câu/đoạn văn liên quan tới đúng những điểm bé đang yếu, thay vì ra
// đề hoàn toàn ngẫu nhiên. Hàm THUẦN (không gọi mạng) để dễ test.

/**
 * @param {{word:string,misses:number}[]} weakWords đã sắp xếp misses giảm dần
 * @param {{structure:string,misses:number}[]} weakGrammarPoints đã sắp xếp misses giảm dần
 * @param {number} limit lấy tối đa bấy nhiêu mục MỖI loại (tránh prompt quá dài)
 * @returns {string} rỗng nếu không có gì để nói
 */
export function buildWeakPointsSummary(weakWords = [], weakGrammarPoints = [], limit = 8) {
  const words = weakWords.slice(0, limit).map((w) => w.word).filter(Boolean);
  const points = weakGrammarPoints.slice(0, limit).map((g) => g.structure).filter(Boolean);
  if (!words.length && !points.length) return '';

  const parts = [];
  if (words.length) parts.push(`Bé hay nhớ/dịch SAI các từ vựng sau: ${words.join(', ')}.`);
  if (points.length) parts.push(`Bé hay làm SAI các điểm ngữ pháp sau: ${points.join('; ')}.`);
  parts.push('Hãy ƯU TIÊN lồng ghép ôn lại các từ vựng/điểm ngữ pháp trên trong đề lần này khi hợp lý (không bắt buộc dùng hết, không cần liệt kê lại nguyên văn danh sách này cho bé thấy).');
  return parts.join(' ');
}

/**
 * Phụ huynh TỰ CHỌN vài từ/điểm ngữ pháp trong "🎯 Từ hay sai" rồi bấm "Tạo
 * bài từ AI" — khác `buildWeakPointsSummary` (chỉ "ưu tiên nếu hợp lý", tự
 * động chạy nền), ở đây là yêu cầu TRỰC TIẾP của phụ huynh nên diễn đạt chắc
 * chắn hơn (BẮT BUỘC) thay vì gợi ý.
 * @param {string[]} words
 * @param {string[]} structures
 * @returns {string} rỗng nếu không chọn gì
 */
export function buildTargetedInstruction(words = [], structures = []) {
  const parts = [];
  if (words.length) parts.push(`Phụ huynh yêu cầu: BẮT BUỘC dùng CHÍNH XÁC các từ vựng sau ít nhất 1 lần trong bài này: ${words.join(', ')}.`);
  if (structures.length) parts.push(`Phụ huynh yêu cầu: BẮT BUỘC ra nội dung liên quan ĐÚNG các điểm ngữ pháp sau: ${structures.join('; ')}.`);
  return parts.join(' ');
}
