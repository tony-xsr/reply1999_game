import assert from 'node:assert';
import {
  GARDEN_DAILY_RATE, DAY_MS,
  gardenFlowers, gardenValue, daysElapsed, pendingYield,
  todayProgress, claimGardenYield, sellBackValue,
} from './garden.js';

const catalog = {
  flower1: { id: 'flower1', type: 'flower' },
  pet1: { id: 'pet1', type: 'pet' },
  candy1: { id: 'candy1', type: 'candy' },
};
const catalogItem = (id) => catalog[id];

// GARDEN_DAILY_RATE đúng bằng 0.1%/ngày (36.5%/năm chia 365)
assert.strictEqual(GARDEN_DAILY_RATE, 0.001);

// gardenFlowers / gardenValue — chỉ tính hoa CHƯA bán
{
  const purchases = [
    { item_id: 'flower1', cost: 20, sold_at: null },
    { item_id: 'flower1', cost: 30, sold_at: null },
    { item_id: 'pet1', cost: 100, sold_at: null },
    { item_id: 'flower1', cost: 25, sold_at: '2026-01-01' }, // đã bán -> không tính
  ];
  assert.strictEqual(gardenFlowers(purchases, catalogItem).length, 2);
  assert.strictEqual(gardenValue(purchases, catalogItem), 50);
}
assert.strictEqual(gardenValue([], catalogItem), 0);

// daysElapsed — làm tròn xuống, không âm
assert.strictEqual(daysElapsed(0, DAY_MS - 1), 0);
assert.strictEqual(daysElapsed(0, DAY_MS), 1);
assert.strictEqual(daysElapsed(0, DAY_MS * 3.9), 3);
assert.strictEqual(daysElapsed(1000, 0), 0); // lùi thời gian -> không âm

// pendingYield — đúng ví dụ của phụ huynh: 1000 sao hoa -> 1 sao/ngày, 365 sao/năm
assert.strictEqual(pendingYield(1000, 1), 1);
assert.strictEqual(pendingYield(1000, 365), 365);
assert.strictEqual(pendingYield(0, 10), 0);
assert.strictEqual(pendingYield(1000, 0), 0);
assert.strictEqual(pendingYield(500, 2), 1); // 500*0.001*2 = 1

// todayProgress — 0 ngay sau khi thu lãi, ~0.5 ở nửa ngày, quay vòng qua ngày mới
assert.strictEqual(todayProgress(0, 0), 0);
assert.strictEqual(todayProgress(0, DAY_MS / 2), 0.5);
assert.strictEqual(todayProgress(0, DAY_MS), 0); // vừa tròn 1 ngày -> vòng lại 0
assert.ok(Math.abs(todayProgress(0, DAY_MS * 2.25) - 0.25) < 1e-9);
assert.strictEqual(todayProgress(1000, 500), 0); // nowMs lùi hơn mốc cuối -> không âm

// claimGardenYield — chỉ nhảy theo ngày trọn vẹn, giữ phần lẻ cho lần sau
{
  const r = claimGardenYield(1000, 0, DAY_MS * 2.5);
  assert.strictEqual(r.days, 2);
  assert.strictEqual(r.stars, 2);
  assert.strictEqual(r.newLastYieldAtMs, DAY_MS * 2);
}
{
  // chưa đủ 1 ngày -> chưa cộng gì, mốc không đổi
  const r = claimGardenYield(1000, 0, DAY_MS - 1);
  assert.strictEqual(r.days, 0);
  assert.strictEqual(r.stars, 0);
  assert.strictEqual(r.newLastYieldAtMs, 0);
}
{
  const r = claimGardenYield(0, 0, DAY_MS * 5);
  assert.strictEqual(r.stars, 0); // chưa trồng hoa -> không có lãi
}

// sellBackValue — đúng ví dụ: hoa 10 sao bán lại được 9 sao
assert.strictEqual(sellBackValue(10), 9);
assert.strictEqual(sellBackValue(1), 0);
assert.strictEqual(sellBackValue(0), 0); // không cho âm

console.log('garden.test.js: all assertions passed');
