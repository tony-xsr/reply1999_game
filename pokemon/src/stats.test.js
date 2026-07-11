// Unit test cho stats.js (hồ sơ người chơi + tổng hợp thắng/thua/giờ chơi).
// Chạy: node src/stats.test.js

// stats.js dùng localStorage — giả lập bằng Map trước khi import
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};

const {
  getDeviceId, getProfiles, addProfile, setCurrentProfile, currentProfile,
  recordSession, getSessions, summarize, last7Days, dateKey,
} = await import('./stats.js');

let passed = 0;
let failed = 0;

function check(name, cond) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.error(`  ❌ ${name}`); }
}

console.log('— Device id & hồ sơ —');

check('getDeviceId: tạo 1 lần, gọi lại trả cùng id', getDeviceId() === getDeviceId());

check('currentProfile: lần đầu tự tạo hồ sơ Khách', (() => {
  const p = currentProfile('Khách');
  return p && p.name === 'Khách' && getProfiles().current === p.id;
})());

check('addProfile: thêm tên mới và chuyển sang hồ sơ đó', (() => {
  const p = addProfile('Bống');
  return p.name === 'Bống' && getProfiles().current === p.id && getProfiles().list.length === 2;
})());

check('addProfile: trùng tên (hoa/thường) → dùng lại hồ sơ cũ', (() => {
  const before = getProfiles().list.length;
  const p = addProfile('bống');
  return p.name === 'Bống' && getProfiles().list.length === before;
})());

check('addProfile: tên rỗng → null, không tạo', (() => {
  const before = getProfiles().list.length;
  return addProfile('   ') === null && getProfiles().list.length === before;
})());

check('setCurrentProfile: đổi người chơi hiện tại', (() => {
  const guest = getProfiles().list[0];
  setCurrentProfile(guest.id);
  return currentProfile().id === guest.id;
})());

console.log('— Ghi ván & tổng hợp —');

check('recordSession: ghi vào hồ sơ hiện tại', (() => {
  recordSession({ mode: 'classic', result: 'win', score: 120, level: 3, seconds: 90.6 });
  const list = getSessions(currentProfile().id);
  return list.length === 1 && list[0].seconds === 91 && list[0].date === dateKey();
})());

check('recordSession: hồ sơ khác không bị lẫn dữ liệu', (() => {
  const other = getProfiles().list.find((u) => u.id !== currentProfile().id);
  return getSessions(other.id).length === 0;
})());

check('summarize: đếm thắng/thua/quit, cộng giây, tỷ lệ thắng', (() => {
  const s = summarize([
    { result: 'win', seconds: 60 },
    { result: 'win', seconds: 30 },
    { result: 'loss', seconds: 10 },
    { result: 'quit', seconds: 5 },
    { result: 'duel', seconds: 20 },
  ]);
  return s.games === 5 && s.wins === 2 && s.losses === 1 && s.quits === 1
    && s.seconds === 125 && Math.abs(s.winRate - 2 / 3) < 1e-9;
})());

check('summarize: chưa có ván thắng/thua → winRate null', summarize([{ result: 'quit', seconds: 9 }]).winRate === null);

check('last7Days: đủ 7 ngày, cũ → mới, gộp đúng ngày', (() => {
  const now = new Date('2026-07-09T20:00:00');
  const days = last7Days([
    { date: '2026-07-09', result: 'win', seconds: 120 },
    { date: '2026-07-09', result: 'loss', seconds: 60 },
    { date: '2026-07-03', result: 'win', seconds: 30 },
    { date: '2026-07-01', result: 'win', seconds: 999 }, // ngoài cửa sổ 7 ngày → bỏ
  ], now);
  const first = days[0];
  const today = days[6];
  return days.length === 7
    && first.date === '2026-07-03' && first.seconds === 30
    && today.date === '2026-07-09' && today.seconds === 180 && today.games === 2 && today.wins === 1
    && days[1].seconds === 0;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
