import assert from 'node:assert/strict';
import {
  starsFromScore, capDailyStars, newGiftCount, randomSmallGift, catalogItem,
  CATALOG, DAILY_STAR_CAP, GIFT_EVERY, effectiveCost, DEFAULT_REWARD_COST_MULTIPLIER,
  isFlatRewardMode, starsForSession, FLAT_REWARD_MODES, FLAT_REWARD_STARS, mergeCatalog,
} from './rewards.js';

let passed = 0;
function check(name, fn) {
  try {
    fn();
    passed++;
    console.log(`✅ ${name}`);
  } catch (e) {
    console.log(`❌ ${name}: ${e.message}`);
    process.exitCode = 1;
  }
}

check('starsFromScore: 10 points = 1 star, capped per session', () => {
  assert.equal(starsFromScore(0), 0);
  assert.equal(starsFromScore(9), 0);
  assert.equal(starsFromScore(10), 1);
  assert.equal(starsFromScore(25), 2);
  assert.equal(starsFromScore(30), 3, 'exactly at session cap');
  assert.equal(starsFromScore(999), 3, 'session cap');
  assert.equal(starsFromScore(-50), 0, 'negative score never grants stars');
});

check('capDailyStars: respects the daily cap and never returns negative', () => {
  assert.equal(capDailyStars(0, 10), 10);
  assert.equal(capDailyStars(45, 10), 5, 'only room left up to the cap');
  assert.equal(capDailyStars(DAILY_STAR_CAP, 10), 0, 'cap reached');
  assert.equal(capDailyStars(60, 10), 0, 'over cap somehow — still 0');
  assert.equal(capDailyStars(0, -5), 0, 'negative want clamps to 0');
});

check('newGiftCount: one gift each GIFT_EVERY answered questions, crossing boundaries', () => {
  assert.equal(newGiftCount(0, GIFT_EVERY - 1), 0);
  assert.equal(newGiftCount(0, GIFT_EVERY), 1);
  assert.equal(newGiftCount(GIFT_EVERY - 1, GIFT_EVERY + 1), 1);
  assert.equal(newGiftCount(14, 31), 2, 'crossing 15 and 30 grants 2 gifts');
  assert.equal(newGiftCount(20, 20), 0, 'no new answers, no gift');
  assert.equal(newGiftCount(30, 25), 0, 'never negative even with weird input');
});

check('CATALOG: ids unique, costs positive, has all 6 gift types', () => {
  const ids = new Set(CATALOG.map((c) => c.id));
  assert.equal(ids.size, CATALOG.length);
  for (const c of CATALOG) {
    assert.ok(c.cost > 0, `cost must be positive for ${c.id}`);
    assert.ok(c.icon && c.name, `icon+name required for ${c.id}`);
  }
  const types = new Set(CATALOG.map((c) => c.type));
  for (const t of ['candy', 'flower', 'pet', 'badge', 'voucher', 'drink']) assert.ok(types.has(t), `missing type ${t}`);
});

check('randomSmallGift: always returns a candy from the catalog', () => {
  for (let i = 0; i < 20; i++) {
    const g = randomSmallGift(() => i / 20);
    assert.equal(g.type, 'candy');
    assert.ok(catalogItem(g.id), 'gift must exist in catalog');
  }
});

check('catalogItem: finds by id, null for unknown', () => {
  assert.equal(catalogItem('flower1').icon, '🌸');
  assert.equal(catalogItem('nope'), null);
});

check('CATALOG: 5 mốc Robux/phiếu mới đúng giá đã chốt, đều fixedCost', () => {
  const prices = { robux55: 600, robux145: 1100, voucher100k: 1600, robux300: 1750, voucher200k: 2800 };
  for (const [id, cost] of Object.entries(prices)) {
    const item = catalogItem(id);
    assert.ok(item, `thiếu món ${id}`);
    assert.equal(item.cost, cost);
    assert.equal(item.fixedCost, true);
    assert.equal(effectiveCost(item), cost, `${id} không được nhân hệ số chung`);
  }
});

check('mergeCatalog: không có quà tự thêm -> trả về đúng CATALOG gốc', () => {
  assert.deepEqual(mergeCatalog([]), CATALOG);
  assert.deepEqual(mergeCatalog(), CATALOG);
});

check('mergeCatalog: thêm quà mới, giá luôn fixedCost (không nhân hệ số)', () => {
  const merged = mergeCatalog([{ id: 'custom1', icon: '🎁', name: 'Vé xem phim', cost: 500 }]);
  const item = merged.find((c) => c.id === 'custom1');
  assert.ok(item);
  assert.equal(item.type, 'voucher');
  assert.equal(effectiveCost(item, 36), 500);
});

check('mergeCatalog: trùng id với CATALOG gốc -> quà tự thêm thắng (ghi đè)', () => {
  const merged = mergeCatalog([{ id: 'flower1', icon: '🌺', name: 'Hoa tự chỉnh', cost: 999 }]);
  const item = merged.find((c) => c.id === 'flower1');
  assert.equal(item.name, 'Hoa tự chỉnh');
  assert.equal(merged.length, CATALOG.length); // không tăng số lượng, chỉ thay thế
});

check('mergeCatalog: bỏ qua mục thiếu tên/giá không hợp lệ', () => {
  const merged = mergeCatalog([{ id: 'bad1', icon: '🎁', name: '', cost: 100 }, { id: 'bad2', icon: '🎁', name: 'X', cost: 0 }]);
  assert.equal(merged.length, CATALOG.length);
});

check('effectiveCost: applies default x36 multiplier, rounds, floors at 1', () => {
  assert.equal(DEFAULT_REWARD_COST_MULTIPLIER, 36);
  assert.equal(effectiveCost({ cost: 5 }), 180);
  assert.equal(effectiveCost({ cost: 200 }), 7200);
  assert.equal(effectiveCost({ cost: 5 }, 2), 10, 'parent-adjusted multiplier overrides default');
  assert.equal(effectiveCost({ cost: 1 }, 0), 36, 'zero/invalid multiplier falls back to default');
  assert.equal(effectiveCost({ cost: 1 }, -3), 36, 'negative multiplier falls back to default');
  assert.ok(effectiveCost({ cost: 1 }, 0.1) >= 1, 'never rounds down to 0');
});

check('effectiveCost: fixedCost items ignore the multiplier entirely', () => {
  const voucher = { id: 'voucher20k', cost: 400, fixedCost: true };
  assert.equal(effectiveCost(voucher, 36), 400, 'fixedCost items are NOT multiplied');
  assert.equal(effectiveCost(voucher, 1), 400);
  assert.equal(effectiveCost(voucher), 400, 'still 400 with default multiplier');
});

check('effectiveCost: per-item override (phụ huynh tự chỉnh) wins over multiplier AND fixedCost', () => {
  const candy = { id: 'candy1', cost: 5 };
  const voucher = { id: 'voucher20k', cost: 400, fixedCost: true };
  assert.equal(effectiveCost(candy, 36, { candy1: 50 }), 50, 'override wins over multiplier');
  assert.equal(effectiveCost(voucher, 36, { voucher20k: 350 }), 350, 'override wins over fixedCost too');
  assert.equal(effectiveCost(candy, 36, { candy1: 0 }), 180, 'override of 0/invalid falls back to normal calc');
  assert.equal(effectiveCost(candy, 36, { flower1: 999 }), 180, 'override for a DIFFERENT item id is ignored');
  assert.equal(effectiveCost(candy, 36, null), 180, 'no overrides object at all still works (back-compat)');
});

check('isFlatRewardMode: pure entertainment games (đào vàng, khủng long, arcade cổ...) are flagged flat-reward', () => {
  assert.ok(isFlatRewardMode('daovang'));
  assert.ok(isFlatRewardMode('khunglong'));
  assert.ok(isFlatRewardMode('cocaro'));
  assert.ok(isFlatRewardMode('classic'), 'Pikachu Classic/Onet dùng thẳng state.mode');
  assert.ok(isFlatRewardMode('arcadexua-whack'), 'arcade-xua ghép tên minigame con vào mode');
  assert.ok(isFlatRewardMode('vandongvui-jump'), 'van-dong-vui ghép tên minigame con vào mode');
  assert.ok(isFlatRewardMode('rentrinao-simon'), 'ren-tri-nao ghép tên minigame con vào mode, thuần arcade');
  assert.ok(isFlatRewardMode('gopsovui'), 'Gộp Số Vui là bản 2048, không có nội dung học');
  assert.ok(isFlatRewardMode('tuduy'), 'Luyện Tư Duy là các trò giải đố thuần, không có nội dung học');
  assert.ok(!isFlatRewardMode('nghedoan5'), 'game Nghe & Đoán vẫn thưởng theo điểm');
  assert.ok(!isFlatRewardMode('banbongtuvung'), 'game từ vựng vẫn thưởng theo điểm');
  assert.ok(!isFlatRewardMode('nguphap-goingtowill'), 'game ngữ pháp vẫn thưởng theo điểm');
});

check('starsForSession: flat 1 sao cho game giải trí thuần bất kể điểm số, theo điểm cho game có học', () => {
  assert.equal(starsForSession('daovang', 0), FLAT_REWARD_STARS, 'chơi xong dù thua/điểm thấp vẫn được 1 sao');
  assert.equal(starsForSession('daovang', 999), FLAT_REWARD_STARS, 'điểm cao cũng chỉ 1 sao, không ăn theo điểm');
  assert.equal(starsForSession('khunglong', 5), FLAT_REWARD_STARS);
  assert.equal(starsForSession('nghedoan5', 95), starsFromScore(95), 'game có học vẫn thưởng theo điểm như cũ');
  assert.equal(starsForSession('nghedoan5', 5), 0, 'game có học điểm quá thấp vẫn 0 sao như cũ');
});

check('FLAT_REWARD_MODES: không rỗng và không lẫn mode nào rõ ràng là game học', () => {
  assert.ok(FLAT_REWARD_MODES.size >= 30);
  for (const m of FLAT_REWARD_MODES) {
    assert.ok(!m.includes('tuvung') && !m.includes('nghedoan') && !m.includes('nguphap'), `mode "${m}" nghe như game học, không nên nằm trong danh sách giải trí thuần`);
  }
});

console.log(`\n${passed} checks passed`);
