import assert from 'node:assert';
import { resolveProvider } from './ai-provider.js';
import { DEFAULT_GROQ_MODEL } from './groq.js';
import { DEFAULT_DEEPSEEK_MODEL } from './deepseek.js';

// Chưa chọn provider (settings rỗng/null) -> mặc định Groq
{
  const r = resolveProvider(null);
  assert.strictEqual(r.name, 'groq');
  assert.strictEqual(r.model, DEFAULT_GROQ_MODEL);
  assert.strictEqual(r.apiKey, undefined);
}
{
  const r = resolveProvider({ ai_api_key: 'gk_abc' });
  assert.strictEqual(r.name, 'groq');
  assert.strictEqual(r.apiKey, 'gk_abc');
  assert.strictEqual(r.model, DEFAULT_GROQ_MODEL);
}

// Chọn DeepSeek -> đúng key/model riêng của DeepSeek, không lẫn key Groq
{
  const r = resolveProvider({ ai_provider: 'deepseek', ai_api_key: 'gk_abc', deepseek_api_key: 'ds_xyz' });
  assert.strictEqual(r.name, 'deepseek');
  assert.strictEqual(r.apiKey, 'ds_xyz');
  assert.strictEqual(r.model, DEFAULT_DEEPSEEK_MODEL);
}

// DeepSeek với model tuỳ chỉnh do phụ huynh đặt riêng -> dùng đúng model đó, không phải mặc định
{
  const r = resolveProvider({ ai_provider: 'deepseek', deepseek_api_key: 'ds_xyz', deepseek_model: 'deepseek-chat' });
  assert.strictEqual(r.model, 'deepseek-chat');
}

// Giá trị ai_provider lạ (vd gõ nhầm) -> vẫn rơi về Groq an toàn, không vỡ
{
  const r = resolveProvider({ ai_provider: 'bing', ai_api_key: 'gk_abc' });
  assert.strictEqual(r.name, 'groq');
}

console.log('ai-provider.test.js: all assertions passed');
