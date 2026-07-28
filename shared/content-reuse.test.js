import assert from 'node:assert';
import { REUSE_WINDOW_DAYS, pickReusableContent } from './content-reuse.js';

assert.strictEqual(REUSE_WINDOW_DAYS, 45);

const ctx = (overrides = {}) => ({ profileId: 'kid-A', todayKey: '2026-07-28', doneIds: new Set(), ...overrides });

// Không có mục nào -> null
assert.strictEqual(pickReusableContent([], ctx()), null);
assert.strictEqual(pickReusableContent(null, ctx()), null);

// Có 1 mục hợp lệ (không phải của mình hôm nay, chưa làm) -> chọn nó
{
  const items = [{ id: 'p1', day: '2026-07-20', profile_id: 'kid-B' }];
  assert.strictEqual(pickReusableContent(items, ctx()).id, 'p1');
}

// Bé NÀY đã làm bài đó rồi -> loại, dù còn trong hạn
{
  const items = [{ id: 'p1', day: '2026-07-20', profile_id: 'kid-B' }];
  assert.strictEqual(pickReusableContent(items, ctx({ doneIds: new Set(['p1']) })), null);
}

// Sibling KHÁC đang dùng bài này HÔM NAY -> loại (tránh chép bài)
{
  const items = [{ id: 'p1', day: '2026-07-28', profile_id: 'kid-B' }];
  assert.strictEqual(pickReusableContent(items, ctx()), null);
}

// Nhiều mục hợp lệ -> chọn mục CŨ NHẤT (nguội lâu nhất) trước
{
  const items = [
    { id: 'p-new', day: '2026-07-25', profile_id: 'kid-B' },
    { id: 'p-old', day: '2026-06-20', profile_id: 'kid-C' },
    { id: 'p-mid', day: '2026-07-10', profile_id: 'kid-B' },
  ];
  assert.strictEqual(pickReusableContent(items, ctx()).id, 'p-old');
}

// Bài của CHÍNH sibling nhưng KHÔNG PHẢI hôm nay (ngày cũ) -> vẫn hợp lệ để dùng lại (ôn tập)
{
  const items = [{ id: 'p1', day: '2026-06-01', profile_id: 'kid-B' }];
  assert.strictEqual(pickReusableContent(items, ctx()).id, 'p1');
}

console.log('content-reuse.test.js: all assertions passed');
