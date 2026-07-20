import assert from 'node:assert/strict';
import {
  _setStorage, _setProfileIdGetter, markLearned, learnedCount, progressPercent,
} from './progress.js';

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

function fakeStorage() {
  return {
    data: {},
    getItem(k) { return Object.prototype.hasOwnProperty.call(this.data, k) ? this.data[k] : null; },
    setItem(k, v) { this.data[k] = String(v); },
  };
}

check('markLearned rồi learnedCount đếm đúng, đánh dấu trùng index không tăng thêm', () => {
  _setStorage(fakeStorage());
  _setProfileIdGetter(() => 'kid-1');
  assert.equal(learnedCount('timemachine'), 0);
  markLearned('timemachine', 0);
  markLearned('timemachine', 2);
  markLearned('timemachine', 0);
  assert.equal(learnedCount('timemachine'), 2);
});

check('progressPercent tính đúng %, làm tròn, không vượt quá 100', () => {
  _setStorage(fakeStorage());
  _setProfileIdGetter(() => 'kid-2');
  markLearned('modal', 0);
  markLearned('modal', 1);
  markLearned('modal', 2);
  assert.equal(progressPercent('modal', 8), 38); // 3/8 = 37.5 -> làm tròn 38
  assert.equal(progressPercent('modal', 0), 0); // tổng = 0 -> không chia cho 0
  markLearned('modal', 3);
  markLearned('modal', 3); // trùng, không tính thêm
  assert.equal(progressPercent('modal', 4), 100);
});

check('mỗi hồ sơ bé có tiến độ RIÊNG BIỆT, không lẫn vào nhau', () => {
  _setStorage(fakeStorage());
  _setProfileIdGetter(() => 'kid-a');
  markLearned('conditional', 0);
  markLearned('conditional', 1);
  _setProfileIdGetter(() => 'kid-b');
  assert.equal(learnedCount('conditional'), 0, 'hồ sơ khác không thấy tiến độ của hồ sơ kia');
  markLearned('conditional', 5);
  assert.equal(learnedCount('conditional'), 1);
  _setProfileIdGetter(() => 'kid-a');
  assert.equal(learnedCount('conditional'), 2, 'quay lại hồ sơ cũ vẫn giữ đúng tiến độ');
});

check('mỗi TRÒ có sổ tiến độ riêng, không lẫn giữa các trò của cùng 1 hồ sơ', () => {
  _setStorage(fakeStorage());
  _setProfileIdGetter(() => 'kid-3');
  markLearned('passive', 0);
  markLearned('reported', 0);
  markLearned('reported', 1);
  assert.equal(learnedCount('passive'), 1);
  assert.equal(learnedCount('reported'), 2);
});

check('markLearned bỏ qua index null/âm, không làm hỏng sổ', () => {
  _setStorage(fakeStorage());
  _setProfileIdGetter(() => 'kid-4');
  markLearned('goingtowill', -1);
  markLearned('goingtowill', null);
  assert.equal(learnedCount('goingtowill'), 0);
});

check('hỏng storage (getItem/setItem ném lỗi) không làm crash, coi như tiến độ rỗng', () => {
  _setStorage({
    getItem() { throw new Error('private mode'); },
    setItem() { throw new Error('private mode'); },
  });
  _setProfileIdGetter(() => 'kid-5');
  assert.equal(learnedCount('sentencebuilder'), 0);
  assert.doesNotThrow(() => markLearned('sentencebuilder', 0));
  assert.equal(progressPercent('sentencebuilder', 10), 0);
});

check('gộp tiến độ NHIỀU trò (đúng công thức renderOverallProgress dùng): cộng dồn learnedCount/tổng total của từng trò', () => {
  _setStorage(fakeStorage());
  _setProfileIdGetter(() => 'kid-6');
  const sources = { timemachine: 6, modal: 10, conditional: 8 };
  markLearned('timemachine', 0);
  markLearned('timemachine', 1);
  markLearned('modal', 0);
  markLearned('conditional', 0);
  markLearned('conditional', 1);
  markLearned('conditional', 2);
  let learned = 0;
  let total = 0;
  for (const [key, t] of Object.entries(sources)) {
    total += t;
    learned += learnedCount(key);
  }
  assert.equal(learned, 6); // 2 + 1 + 3
  assert.equal(total, 24);
  assert.equal(Math.round((learned / total) * 100), 25);
});

console.log(`\n${passed} passed`);
