import assert from 'node:assert';
import { FUN_GAMES, pickRandomFunGames } from './fun-games.js';

// Danh sách hợp lệ: đủ nhiều, mỗi game có href/icon/title, không trùng href
assert.ok(FUN_GAMES.length >= 60, `cần ít nhất 60 game, có ${FUN_GAMES.length}`);
for (const g of FUN_GAMES) {
  assert.ok(g.href.startsWith('/') && g.href.endsWith('/'), `href sai định dạng: ${g.href}`);
  assert.ok(g.icon.length > 0, `icon rỗng: ${g.href}`);
  assert.ok(g.title.length > 0, `title rỗng: ${g.href}`);
}
assert.strictEqual(new Set(FUN_GAMES.map((g) => g.href)).size, FUN_GAMES.length, 'có href bị trùng');

// pickRandomFunGames — trả đúng số lượng, không trùng
{
  const picked = pickRandomFunGames(FUN_GAMES, 5);
  assert.strictEqual(picked.length, 5);
  assert.strictEqual(new Set(picked.map((g) => g.href)).size, 5);
}

// n lớn hơn danh sách -> trả về hết, không lỗi
{
  const small = FUN_GAMES.slice(0, 3);
  const picked = pickRandomFunGames(small, 10);
  assert.strictEqual(picked.length, 3);
}

// rng cố định -> kết quả xác định (không phụ thuộc Math.random thật)
{
  const list = [{ href: 'a' }, { href: 'b' }, { href: 'c' }, { href: 'd' }];
  const seq = [0, 0, 0]; // luôn chọn phần tử đầu tiên còn lại của "pool"
  let i = 0;
  const rng = () => seq[i++];
  const picked = pickRandomFunGames(list, 3, rng);
  assert.deepStrictEqual(picked.map((g) => g.href), ['a', 'b', 'c']);
}

console.log('fun-games.test.js: all assertions passed');
