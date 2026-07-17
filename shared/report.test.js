import assert from 'node:assert/strict';
import {
  weekStart, buildWeeklyReport, formatReportVi,
  groupOfMode, minutesByGroup, minutesByTimeOfDay, dailyMinutes, weeklyWinRate,
} from './report.js';

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

const NOW = new Date('2026-07-17T20:00:00+07:00');
const iso = (daysAgo, h = 10) =>
  new Date(NOW.getTime() - daysAgo * 86400000 - (20 - h) * 3600000).toISOString();

check('weekStart: 00:00 of six days ago', () => {
  const s = weekStart(NOW);
  assert.equal(s.getHours(), 0);
  assert.ok(NOW.getTime() - s.getTime() < 7 * 86400000);
  assert.ok(NOW.getTime() - s.getTime() > 6 * 86400000);
});

check('buildWeeklyReport: only counts data inside the last 7 days', () => {
  const r = buildWeeklyReport({
    sessions: [
      { played_at: iso(0), seconds: 300, result: 'win', score: 80 },
      { played_at: iso(2), seconds: 600, result: 'loss', score: 20 },
      { played_at: iso(10), seconds: 900, result: 'win', score: 90 }, // ngoài tuần
    ],
    ledger: [
      { ts: iso(1), delta: 8 },
      { ts: iso(3), delta: -5 },  // tiêu sao: không tính "kiếm được"
      { ts: iso(9), delta: 20 },  // ngoài tuần
    ],
    purchases: [
      { ts: iso(1), item_id: 'flower1', cost: 20 },
      { ts: iso(1), item_id: 'candy1', cost: 0 }, // quà chăm học miễn phí
      { ts: iso(8), item_id: 'candy2', cost: 8 }, // ngoài tuần
    ],
    weakWords: [{ word: 'zero', misses: 3 }, { word: 'run', misses: 1 }],
  }, NOW);
  assert.equal(r.games, 2);
  assert.equal(r.wins, 1);
  assert.equal(r.minutes, 15);
  assert.equal(r.starsEarned, 8);
  assert.equal(r.giftsBought, 1);
  assert.equal(r.freeGifts, 1);
  assert.equal(r.weakCount, 2);
  assert.deepEqual(r.topWeak, ['zero', 'run']);
  assert.equal(r.winRate, 0.5);
});

check('buildWeeklyReport: activeDays counts distinct study days', () => {
  const r = buildWeeklyReport({
    sessions: [
      { played_at: iso(0, 9), seconds: 60, result: 'win' },
      { played_at: iso(0, 15), seconds: 60, result: 'win' },
      { played_at: iso(3), seconds: 60, result: 'loss' },
    ],
  }, NOW);
  assert.equal(r.activeDays, 2);
});

check('buildWeeklyReport: empty data gives a calm zero report', () => {
  const r = buildWeeklyReport({}, NOW);
  assert.equal(r.games, 0);
  assert.equal(r.minutes, 0);
  assert.equal(r.winRate, null);
  assert.equal(r.weakCount, 0);
});

check('formatReportVi: mentions kid name, days, stars; celebrates zero weak words', () => {
  const text = formatReportVi('Bin', buildWeeklyReport({
    sessions: [{ played_at: iso(0), seconds: 120, result: 'win' }],
    ledger: [{ ts: iso(0), delta: 7 }],
  }, NOW));
  assert.ok(text.includes('Bin'));
  assert.ok(text.includes('1/7 ngày'));
  assert.ok(text.includes('7 ⭐'));
  assert.ok(text.includes('tuyệt vời') || text.includes('Không còn từ nào'));
});

check('formatReportVi: lists top weak words when present', () => {
  const text = formatReportVi('Na', buildWeeklyReport({
    weakWords: [{ word: 'zero', misses: 2 }],
  }, NOW));
  assert.ok(text.includes('1 từ cần ôn'));
  assert.ok(text.includes('zero'));
});

check('groupOfMode: English games / learning games / fun games sorted correctly', () => {
  assert.equal(groupOfMode('nghedoan9'), 'Tiếng Anh');
  assert.equal(groupOfMode('nghedoanontap'), 'Tiếng Anh');
  assert.equal(groupOfMode('xepchu'), 'Tiếng Anh');
  assert.equal(groupOfMode('toan-lop-1'), 'Học & tư duy');
  assert.equal(groupOfMode('tuduy'), 'Học & tư duy');
  assert.equal(groupOfMode('pika'), 'Game vui');
  assert.equal(groupOfMode(undefined), 'Game vui');
});

check('minutesByGroup: sums seconds into minutes per group, descending, drops zero', () => {
  const rows = minutesByGroup([
    { mode: 'nghedoan1', seconds: 300 },
    { mode: 'nghedoan2', seconds: 300 },
    { mode: 'toan', seconds: 120 },
    { mode: 'pika', seconds: 10 }, // 10s ~ 0 phút -> bị loại
  ]);
  assert.deepEqual(rows, [
    { group: 'Tiếng Anh', minutes: 10 },
    { group: 'Học & tư duy', minutes: 2 },
  ]);
});

check('minutesByTimeOfDay: buckets by local hour incl. the wrap-around late-night bucket', () => {
  const mk = (h) => new Date(new Date('2026-07-15T00:00:00').setHours(h, 30)).toISOString();
  const rows = minutesByTimeOfDay([
    { played_at: mk(8), seconds: 600 },   // sáng
    { played_at: mk(19), seconds: 300 },  // tối
    { played_at: mk(23), seconds: 300 },  // khuya
    { played_at: mk(2), seconds: 300 },   // khuya (sau nửa đêm)
  ]);
  const get = (label) => rows.find((r) => r.label.includes(label)).minutes;
  assert.equal(get('Sáng'), 10);
  assert.equal(get('Tối'), 5);
  assert.equal(get('Khuya'), 10);
});

check('dailyMinutes: exactly N entries, old to new, zero-filled', () => {
  const rows = dailyMinutes([{ played_at: iso(0), seconds: 600 }], 14, NOW);
  assert.equal(rows.length, 14);
  assert.equal(rows[13].minutes, 10);
  assert.equal(rows[0].minutes, 0);
});

check('weeklyWinRate: 4 weeks old to new, null when no decided games', () => {
  const rows = weeklyWinRate([
    { played_at: iso(1), result: 'win' },
    { played_at: iso(2), result: 'loss' },
    { played_at: iso(10), result: 'win' },
  ], 4, NOW);
  assert.equal(rows.length, 4);
  assert.equal(rows[3].label, 'Tuần này');
  assert.equal(rows[3].rate, 0.5);
  assert.equal(rows[2].rate, 1, 'ván 10 ngày trước thuộc tuần thứ 2');
  assert.equal(rows[0].rate, null);
});

console.log(`\n${passed} checks passed`);
