import assert from 'node:assert';
import { buildWeakPointsSummary, buildTargetedInstruction } from './weak-points.js';

// Không có gì cả -> rỗng
assert.strictEqual(buildWeakPointsSummary([], []), '');
assert.strictEqual(buildWeakPointsSummary(), '');

// Chỉ có từ vựng hay sai
{
  const text = buildWeakPointsSummary([{ word: 'apple', misses: 5 }, { word: 'difficult', misses: 3 }], []);
  assert.ok(text.includes('apple'));
  assert.ok(text.includes('difficult'));
  assert.ok(!text.includes('điểm ngữ pháp sau'));
}

// Chỉ có cấu trúc ngữ pháp hay sai
{
  const text = buildWeakPointsSummary([], [{ structure: 'Câu điều kiện loại 2', misses: 4 }]);
  assert.ok(text.includes('Câu điều kiện loại 2'));
  assert.ok(!text.includes('từ vựng sau'));
}

// Có cả 2 -> gộp cả 2 đoạn
{
  const text = buildWeakPointsSummary(
    [{ word: 'apple', misses: 5 }],
    [{ structure: 'Thì hiện tại hoàn thành', misses: 2 }],
  );
  assert.ok(text.includes('apple'));
  assert.ok(text.includes('Thì hiện tại hoàn thành'));
}

// Giới hạn số lượng mỗi loại (limit)
{
  const words = Array.from({ length: 20 }, (_, i) => ({ word: `w${i}`, misses: 20 - i }));
  const text = buildWeakPointsSummary(words, [], 3);
  assert.ok(text.includes('w0') && text.includes('w1') && text.includes('w2'));
  assert.ok(!text.includes('w3'));
}

// buildTargetedInstruction — phụ huynh tự chọn, diễn đạt CHẮC CHẮN (BẮT BUỘC)
assert.strictEqual(buildTargetedInstruction([], []), '');
{
  const text = buildTargetedInstruction(['went', 'hold'], []);
  assert.ok(text.includes('went') && text.includes('hold'));
  assert.ok(text.includes('BẮT BUỘC'));
  assert.ok(!text.includes('điểm ngữ pháp'));
}
{
  const text = buildTargetedInstruction([], ['Câu điều kiện loại 2']);
  assert.ok(text.includes('Câu điều kiện loại 2'));
  assert.ok(!text.includes('từ vựng'));
}
{
  const text = buildTargetedInstruction(['went'], ['Câu điều kiện loại 2']);
  assert.ok(text.includes('went'));
  assert.ok(text.includes('Câu điều kiện loại 2'));
}

console.log('weak-points.test.js: all assertions passed');
