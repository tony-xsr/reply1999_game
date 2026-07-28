import assert from 'node:assert';
import { getThemePref, effectiveMode } from './theme.js';

// getThemePref — không có DOM/localStorage (Node) -> luôn về mặc định an toàn
assert.deepStrictEqual(getThemePref(), { palette: 'warm', mode: 'auto' });

// effectiveMode — chế độ tường minh (light/dark) thì bỏ qua isDark
assert.strictEqual(effectiveMode({ palette: 'warm', mode: 'light' }, true), 'light');
assert.strictEqual(effectiveMode({ palette: 'warm', mode: 'dark' }, false), 'dark');

// effectiveMode — "auto" tra theo isDark truyền vào (mô phỏng prefers-color-scheme)
assert.strictEqual(effectiveMode({ palette: 'soft', mode: 'auto' }, true), 'dark');
assert.strictEqual(effectiveMode({ palette: 'soft', mode: 'auto' }, false), 'light');

console.log('theme.test.js: all assertions passed');
