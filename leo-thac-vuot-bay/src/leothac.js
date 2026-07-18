// Leo Thác Vượt Bẫy: máy đọc to 1 từ tiếng Anh, bé chọn ĐÚNG lối đi (trái/phải)
// mang hình vật đó để leo lên 1 bậc thác. Chọn NHẦM lối là "sập bẫy" — mất 1
// trái tim (5 tim/màn), được thử lại NGAY bậc đó với 1 cặp từ MỚI; hết sạch
// tim mới thực sự thua. File thuần logic, không đụng DOM, test độc lập.

import { WORDS } from '../../shared/fruit-object-words.js';

export const TOTAL_STEPS = 10;
export const POINTS_PER_STEP = 10;
export const START_HEARTS = 5;

function shuffle(arr, rng) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Sinh 1 bậc thang: từ mục tiêu (đọc to) đặt ngẫu nhiên vào lối trái/phải,
 * lối còn lại là 1 từ mồi nhử (bẫy) khác hẳn từ mục tiêu. */
function makeStep(rng) {
  const pool = shuffle(WORDS, rng);
  const target = pool[0];
  const decoy = pool[1];
  const correctSide = rng() < 0.5 ? 'left' : 'right';
  return {
    target,
    left: correctSide === 'left' ? target : decoy,
    right: correctSide === 'right' ? target : decoy,
    correctSide,
  };
}

/** Khởi tạo 1 lượt leo thác gồm `totalSteps` bậc, `START_HEARTS` trái tim. */
export function makeGame(totalSteps = TOTAL_STEPS, rng = Math.random) {
  return {
    totalSteps,
    rng,
    stepIndex: 0,
    hearts: START_HEARTS,
    score: 0,
    over: false,
    won: false,
    step: makeStep(rng),
  };
}

export function currentStep(game) {
  return game.step;
}

/**
 * Bé chọn lối 'left' hoặc 'right'.
 * - Đúng: leo lên bậc kế tiếp (được điểm); hết bậc thang thì THẮNG, lên tới đỉnh.
 * - Sai: SẬP BẪY, mất 1 trái tim. Còn tim thì được thử lại NGAY bậc này với 1
 *   cặp từ MỚI (tránh học vẹt nhớ vị trí trái/phải thay vì nghe từ thật). Hết
 *   sạch tim (0) mới thực sự THUA, ván kết thúc.
 * Gọi khi ván đã kết thúc thì không làm gì, trả về trạng thái hiện tại.
 */
export function choosePath(game, side) {
  if (game.over) {
    return {
      correct: false, fell: false, gameDone: true, won: game.won, hearts: game.hearts,
    };
  }
  const step = currentStep(game);
  const correct = side === step.correctSide;
  if (!correct) {
    game.hearts--;
    if (game.hearts <= 0) {
      game.over = true;
      game.won = false;
      return {
        correct: false, fell: true, gameDone: true, won: false, hearts: game.hearts, correctSide: step.correctSide,
      };
    }
    game.step = makeStep(game.rng);
    return {
      correct: false, fell: true, gameDone: false, won: false, hearts: game.hearts, correctSide: step.correctSide,
    };
  }
  game.score += POINTS_PER_STEP;
  game.stepIndex++;
  if (game.stepIndex >= game.totalSteps) {
    game.over = true;
    game.won = true;
    return {
      correct: true, fell: false, gameDone: true, won: true, hearts: game.hearts,
    };
  }
  game.step = makeStep(game.rng);
  return {
    correct: true, fell: false, gameDone: false, won: false, hearts: game.hearts,
  };
}
