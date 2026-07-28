// Chọn nhà cung cấp AI (Groq mặc định, hoặc DeepSeek nếu phụ huynh chọn ở
// Trang Phụ Huynh > Cài đặt > 🤖 Trợ Lý AI) — mọi nơi cần gọi AI sinh nội
// dung/chấm bài (exam-prep, shared/translate-ui.js, shared/grammar-quiz-
// ui.js) dùng CHUNG các hàm ở đây thay vì import thẳng groq.js/deepseek.js,
// để không phải lặp lại logic "đọc settings.ai_provider rồi chọn đúng
// key/model" ở từng nơi gọi. Gọi vẫn THẲNG từ trình duyệt (chưa qua server
// riêng) — mỗi gia đình dùng key AI của chính mình.
//
// Đây cũng là điểm DUY NHẤT ghi log mỗi lượt gọi AI (logAiCall) — dùng cho
// Admin Dashboard đếm tổng lượt gọi/ngày (xem api/admin-stats.js) — nhờ tập
// trung ở đây nên không cần rải lệnh ghi log ở từng nơi gọi AI.

import * as api from './api.js';
import * as groq from './groq.js';
import * as deepseek from './deepseek.js';

/**
 * Chọn client + key + model tương ứng dựa trên cài đặt gia đình (mặc định
 * Groq nếu chưa chọn provider nào) — hàm THUẦN, test được không cần mạng.
 */
export function resolveProvider(settings) {
  const name = settings?.ai_provider === 'deepseek' ? 'deepseek' : 'groq';
  if (name === 'deepseek') {
    return { name, client: deepseek, apiKey: settings?.deepseek_api_key, model: settings?.deepseek_model || deepseek.DEFAULT_DEEPSEEK_MODEL };
  }
  return { name, client: groq, apiKey: settings?.ai_api_key, model: groq.DEFAULT_GROQ_MODEL };
}

async function callAndLog(purpose, name, fn) {
  try {
    const result = await fn();
    api.logAiCall(name, purpose, true).catch(() => {});
    return result;
  } catch (e) {
    api.logAiCall(name, purpose, false).catch(() => {});
    throw e;
  }
}

export async function generateQuestions(settings, args) {
  const { client, apiKey, model, name } = resolveProvider(settings);
  return callAndLog('on-them-cau-hoi', name, () => client.generateQuestions({ ...args, apiKey, model }));
}

export async function generatePassages(settings, args) {
  const { client, apiKey, model, name } = resolveProvider(settings);
  return callAndLog('luyen-dich:soan-bai', name, () => client.generatePassages({ ...args, apiKey, model }));
}

export async function gradeTranslation(settings, args) {
  const { client, apiKey, model, name } = resolveProvider(settings);
  return callAndLog('luyen-dich:cham-bai', name, () => client.gradeTranslation({ ...args, apiKey, model }));
}

export async function generateGrammarQuiz(settings, args) {
  const { client, apiKey, model, name } = resolveProvider(settings);
  return callAndLog('trac-nghiem:soan-de', name, () => client.generateGrammarQuiz({ ...args, apiKey, model }));
}

export async function gradeGrammarQuiz(settings, args) {
  const { client, apiKey, model, name } = resolveProvider(settings);
  return callAndLog('trac-nghiem:goi-y', name, () => client.gradeGrammarQuiz({ ...args, apiKey, model }));
}

export async function generateSocialPosts(settings, args) {
  const { client, apiKey, model, name } = resolveProvider(settings);
  return callAndLog('in-bai-tap:mxh', name, () => client.generateSocialPosts({ ...args, apiKey, model }));
}

export async function generateMillionaireQuiz(settings, args) {
  const { client, apiKey, model, name } = resolveProvider(settings);
  return callAndLog('trieu-phu:soan-de', name, () => client.generateMillionaireQuiz({ ...args, apiKey, model }));
}

/** Kiểm tra key hợp lệ của nhà cung cấp đang chọn — trả về true/false, không ném lỗi. */
export async function testProviderKey(settings) {
  const { name, apiKey, model } = resolveProvider(settings);
  if (!apiKey) return false;
  return name === 'deepseek' ? deepseek.testDeepSeekKey(apiKey, model) : groq.testGroqKey(apiKey, model);
}
