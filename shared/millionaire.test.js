import assert from 'node:assert';
import {
  TOTAL_QUESTIONS, MILESTONES, isMilestone, blockTotal, computeStarsEarned, buildLadder, formatStars,
} from './millionaire.js';

assert.strictEqual(TOTAL_QUESTIONS, 15);
assert.deepStrictEqual(MILESTONES, [5, 10, 15]);

// isMilestone
assert.strictEqual(isMilestone(5), true);
assert.strictEqual(isMilestone(10), true);
assert.strictEqual(isMilestone(15), true);
assert.strictEqual(isMilestone(4), false);
assert.strictEqual(isMilestone(11), false);

// blockTotal — đúng theo luật đã chốt: mốc 1 = 5 sao, mốc 2 = 9 sao, mốc 3 = 18 sao
assert.strictEqual(blockTotal(0), 5);
assert.strictEqual(blockTotal(1), 9);
assert.strictEqual(blockTotal(2), 18);

// computeStarsEarned — theo đúng ví dụ phụ huynh đưa ra
assert.strictEqual(computeStarsEarned(0), 0); // sai ngay câu 1
assert.strictEqual(computeStarsEarned(4), 0); // đúng 1-4 nhưng sai câu mốc 5 -> mất hết mốc 1
assert.strictEqual(computeStarsEarned(5), 5); // hoàn thành trọn mốc 1
assert.strictEqual(computeStarsEarned(9), 5); // qua được 6-9 nhưng sai câu mốc 10 -> vẫn giữ 5 sao mốc 1
assert.strictEqual(computeStarsEarned(10), 14); // hoàn thành trọn mốc 1+2 = 5+9
assert.strictEqual(computeStarsEarned(14), 14); // sai câu mốc 15 -> giữ nguyên 14
assert.strictEqual(computeStarsEarned(15), 32); // thắng trọn vẹn 15/15 = 5+9+18

// buildLadder — đúng 15 giá trị, khớp thang điểm đã tính tay
assert.deepStrictEqual(buildLadder(), [0.5, 1, 1.5, 2, 5, 6, 7, 8, 9, 14, 16, 18, 20, 22, 32]);
assert.strictEqual(buildLadder().length, TOTAL_QUESTIONS);

// formatStars — số nguyên giữ nguyên, số lẻ .5 hiện dạng "X½" thân thiện với bé
assert.strictEqual(formatStars(5), '5');
assert.strictEqual(formatStars(0.5), '½');
assert.strictEqual(formatStars(1.5), '1½');
assert.strictEqual(formatStars(32), '32');

console.log('millionaire.test.js: all assertions passed');
