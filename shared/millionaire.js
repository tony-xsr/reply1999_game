// "🏆 Ai Là Triệu Phú" — 15 câu trắc nghiệm tăng dần độ khó, mỗi ngày chơi 1
// lần. Chia 3 mốc "an toàn" (câu 5/10/15) — trả lời đúng LIÊN TỤC từ câu 1,
// sai bất kỳ câu nào (kể cả câu mốc) thì dừng game và CHỈ giữ lại số sao của
// những mốc đã hoàn thành TRỌN VẸN trước đó (giống "mức tiền an toàn" của
// gameshow gốc). Luật sao đã chốt với phụ huynh:
//   Mốc 1 (câu 1-5):  mỗi câu 1-4 đúng +0.5 sao, câu 5 đúng +3 sao thêm
//                      → hoàn thành trọn mốc 1 = 5 sao.
//   Mốc 2 (câu 6-10): mỗi câu 6-9 đúng +1 sao, câu 10 đúng +5 sao thêm
//                      → hoàn thành trọn mốc 2 = 9 sao (cộng dồn mốc 1 = 14).
//   Mốc 3 (câu 11-15): mỗi câu 11-14 đúng +2 sao, câu 15 đúng +10 sao thêm
//                      → hoàn thành trọn mốc 3 = 18 sao (cộng dồn = 32 sao trọn vẹn).
// Hàm THUẦN — phần gọi AI soạn câu hỏi (shared/groq.js generateMillionaireQuiz)
// và ghi sổ thưởng (shared/api.js claimMillionaireResult) nằm ở nơi khác.

export const TOTAL_QUESTIONS = 15;

const BLOCKS = [
  { last: 5, perQuestion: 0.5, bonus: 3 },
  { last: 10, perQuestion: 1, bonus: 5 },
  { last: 15, perQuestion: 2, bonus: 10 },
];

export const MILESTONES = BLOCKS.map((b) => b.last); // [5, 10, 15]

function blockStart(idx) {
  return idx === 0 ? 1 : BLOCKS[idx - 1].last + 1;
}

function roundHalf(n) {
  return Math.round(n * 2) / 2;
}

/** Câu số `qNum` (1-based) có phải câu MỐC (an toàn) không. */
export function isMilestone(qNum) {
  return MILESTONES.includes(qNum);
}

/** Tổng sao NẾU trả lời đúng TRỌN VẸN mốc thứ `idx` (0-based: 0=mốc 1, 1=mốc 2, 2=mốc 3). */
export function blockTotal(idx) {
  const b = BLOCKS[idx];
  const start = blockStart(idx);
  return roundHalf((b.last - start) * b.perQuestion + b.bonus);
}

/**
 * Sao THỰC NHẬN dựa trên số câu bé đã trả lời ĐÚNG LIÊN TỤC từ câu 1
 * (`correctStreak`) trước khi sai hoặc làm hết bài. Chỉ tính các mốc đã
 * hoàn thành TRỌN VẸN — sai ở bất kỳ câu nào trong 1 mốc (kể cả câu mốc)
 * thì KHÔNG được thêm sao của mốc đó, dù đã đúng vài câu đầu mốc.
 */
export function computeStarsEarned(correctStreak) {
  if (correctStreak <= 0) return 0;
  let completed = 0;
  for (let i = 0; i < BLOCKS.length; i++) {
    if (correctStreak >= BLOCKS[i].last) completed = i + 1;
    else break;
  }
  let sum = 0;
  for (let i = 0; i < completed; i++) sum += blockTotal(i);
  return roundHalf(sum);
}

/**
 * Thang điểm hiển thị UI (15 giá trị, ứng với câu 1..15) — tăng dần đều
 * trong 1 mốc, nhảy vọt đúng câu mốc (giống bảng tiền của gameshow gốc).
 * Đây là giá trị "đang đứng ở đâu", KHÁC với computeStarsEarned() (số sao
 * THỰC SỰ an toàn nếu sai ngay sau đó) — bên gọi UI tự làm rõ 2 khái niệm
 * này cho bé (xem shared/millionaire-ui.js).
 */
export function buildLadder() {
  const ladder = [];
  let secured = 0;
  for (let b = 0; b < BLOCKS.length; b++) {
    const start = blockStart(b);
    for (let q = start; q < BLOCKS[b].last; q++) {
      ladder.push(roundHalf(secured + (q - start + 1) * BLOCKS[b].perQuestion));
    }
    secured = roundHalf(secured + blockTotal(b));
    ladder.push(secured);
  }
  return ladder;
}

/** "½" cho 0.5, số nguyên bình thường cho các giá trị khác — hiển thị thân thiện với bé. */
export function formatStars(n) {
  if (Number.isInteger(n)) return String(n);
  const whole = Math.floor(n);
  return whole > 0 ? `${whole}½` : '½';
}
