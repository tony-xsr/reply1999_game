import assert from 'node:assert';
import {
  STREAK_MILESTONES, starsForMilestone, uniqueLoginDays, computeCurrentStreak, nextClaimableMilestone,
} from './streak.js';

assert.deepStrictEqual(STREAK_MILESTONES, [5, 10, 20, 50]);
assert.strictEqual(starsForMilestone(5), 5);
assert.strictEqual(starsForMilestone(50), 50);

// uniqueLoginDays — gộp nhiều lượt đăng nhập cùng ngày, sắp xếp tăng dần
assert.deepStrictEqual(
  uniqueLoginDays(['2026-07-26T08:00:00Z', '2026-07-26T20:00:00Z', '2026-07-25T09:00:00Z']),
  ['2026-07-25', '2026-07-26'],
);
assert.deepStrictEqual(uniqueLoginDays([]), []);

// computeCurrentStreak
assert.strictEqual(computeCurrentStreak([], '2026-07-28'), 0);
assert.strictEqual(computeCurrentStreak(['2026-07-28'], '2026-07-28'), 1); // chỉ hôm nay
assert.strictEqual(
  computeCurrentStreak(['2026-07-26', '2026-07-27', '2026-07-28'], '2026-07-28'), 3,
); // 3 ngày liên tục tính đến hôm nay
assert.strictEqual(
  computeCurrentStreak(['2026-07-26', '2026-07-27'], '2026-07-28'), 2,
); // chưa đăng nhập hôm nay nhưng hôm qua có -> streak vẫn "sống", đếm tới hôm qua
assert.strictEqual(
  computeCurrentStreak(['2026-07-25'], '2026-07-28'), 0,
); // nghỉ 2 ngày liền (26,27 đều thiếu) -> đứt hẳn
assert.strictEqual(
  computeCurrentStreak(['2026-07-20', '2026-07-26', '2026-07-27', '2026-07-28'], '2026-07-28'), 3,
); // có khoảng đứt ở giữa (20) -> chỉ tính đoạn liên tục gần nhất (26-27-28)

// nextClaimableMilestone
assert.strictEqual(nextClaimableMilestone(4, 0), null); // chưa đủ 5 ngày
assert.strictEqual(nextClaimableMilestone(5, 0), 5); // vừa đủ mốc đầu tiên
assert.strictEqual(nextClaimableMilestone(5, 5), null); // đã nhận mốc 5 rồi
assert.strictEqual(nextClaimableMilestone(12, 5), 10); // đã nhận 5, streak 12 -> mốc tiếp là 10
assert.strictEqual(nextClaimableMilestone(60, 20), 50); // nhảy cóc nhiều mốc cùng lúc -> vẫn lấy mốc kế tiếp theo THỨ TỰ, không bỏ qua
assert.strictEqual(nextClaimableMilestone(60, 50), null); // đã nhận hết mốc hiện có

console.log('streak.test.js: all assertions passed');
