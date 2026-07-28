import assert from 'node:assert';
import { DAILY_PRACTICE_BONUS_STARS, isQuotaComplete, isBonusDue, quotaProgress } from './daily-bonus.js';

assert.strictEqual(DAILY_PRACTICE_BONUS_STARS, 5);

// isQuotaComplete
assert.strictEqual(isQuotaComplete(0, 0), false); // chưa có chỉ tiêu -> không tính là xong
assert.strictEqual(isQuotaComplete(2, 3), false);
assert.strictEqual(isQuotaComplete(3, 3), true);
assert.strictEqual(isQuotaComplete(4, 3), true); // dư ra vẫn tính xong (an toàn)
assert.strictEqual(isQuotaComplete(1, 1), true); // trắc nghiệm: 1/1 bài

// isBonusDue
assert.strictEqual(isBonusDue(3, 3, null, '2026-07-28'), true); // chưa từng thưởng
assert.strictEqual(isBonusDue(3, 3, '2026-07-27', '2026-07-28'), true); // thưởng hôm qua -> hôm nay vẫn được
assert.strictEqual(isBonusDue(3, 3, '2026-07-28', '2026-07-28'), false); // đã thưởng đúng hôm nay -> không thưởng nữa
assert.strictEqual(isBonusDue(2, 3, null, '2026-07-28'), false); // chưa làm xong

// quotaProgress
assert.strictEqual(quotaProgress(0, 3), 0);
assert.strictEqual(quotaProgress(1, 3), 1 / 3);
assert.strictEqual(quotaProgress(3, 3), 1);
assert.strictEqual(quotaProgress(5, 3), 1); // không vượt quá 100%
assert.strictEqual(quotaProgress(0, 0), 0); // không chia cho 0

console.log('daily-bonus.test.js: all assertions passed');
