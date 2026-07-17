import assert from 'node:assert/strict';
import {
  starsFromScore, capDailyStars, newGiftCount, randomSmallGift, catalogItem,
  CATALOG, DAILY_STAR_CAP, GIFT_EVERY,
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
  assert.equal(starsFromScore(95), 9);
  assert.equal(starsFromScore(999), 15, 'session cap');
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

check('CATALOG: ids unique, costs positive, has all 4 gift types', () => {
  const ids = new Set(CATALOG.map((c) => c.id));
  assert.equal(ids.size, CATALOG.length);
  for (const c of CATALOG) {
    assert.ok(c.cost > 0, `cost must be positive for ${c.id}`);
    assert.ok(c.icon && c.name, `icon+name required for ${c.id}`);
  }
  const types = new Set(CATALOG.map((c) => c.type));
  for (const t of ['candy', 'flower', 'pet', 'badge']) assert.ok(types.has(t), `missing type ${t}`);
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

console.log(`\n${passed} checks passed`);
