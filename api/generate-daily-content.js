// Vercel Cron (xem "crons" trong /vercel.json, chạy 1 lần/ngày) — DỒN TRƯỚC
// bài Luyện Dịch + Trắc Nghiệm Ngữ Pháp cho tới BUFFER_DAYS ngày kể từ hôm
// nay, cho MỖI bé đã được phụ huynh cấu hình
// (profiles.settings.translationLevel/grammarQuizLevel), CHO MỌI GIA ĐÌNH
// cùng lúc — khác hẳn cách "sinh khi cần" trước đây (bé tự gọi AI lúc mở
// game, xem shared/translate-ui.js / shared/grammar-quiz-ui.js / hàm
// checkDailyAiContent() trong shared/kid-bar.js — cả 3 nơi đó VẪN CÒN, dùng
// làm phương án dự phòng nếu cron lỡ trễ/lỗi ngày nào đó, không xoá).
//
// Mỗi lần chạy chỉ sinh THÊM tối đa MAX_NEW_DAYS_PER_RUN ngày MỚI cho MỖI
// loại nội dung (dịch/trắc nghiệm) — để không vượt giới hạn tốc độ gọi Groq
// hay thời gian chạy tối đa của 1 hàm serverless. Bé MỚI cấu hình (chưa có
// ngày nào) sẽ mất khoảng BUFFER_DAYS/MAX_NEW_DAYS_PER_RUN đêm để "cửa sổ"
// đầy đủ 60 ngày; sau đó mỗi đêm chỉ cần sinh đúng 1 ngày mới (ngày thứ 60
// tính từ đêm đó) để giữ cửa sổ luôn đầy — nhanh, ổn định lâu dài.
//
// CHỈ chạy ở server (Vercel Function), KHÔNG BAO GIỜ đưa file này vào trình
// duyệt — dùng Supabase SERVICE ROLE KEY (bỏ qua Row Level Security, đọc/ghi
// được CHO MỌI gia đình) chứ không phải anon key. Cấu hình 3 biến môi trường
// sau trong Vercel → Project Settings → Environment Variables (KHÔNG BAO GIỜ
// ghi vào file trong repo) — xem hướng dẫn chi tiết ở server/README.md:
//   SUPABASE_URL               — giống Project URL đã điền ở /server-config.js
//   SUPABASE_SERVICE_ROLE_KEY  — Project Settings → API → service_role key
//   CRON_SECRET                — chuỗi bất kỳ do bạn tự đặt, Vercel tự gửi
//                                 kèm mỗi lần gọi cron, dùng để chặn người lạ
//                                 gọi thẳng route này gây tốn quota AI.

import { generatePassages, generateGrammarQuiz } from '../shared/groq.js';
import { EXAM_LEVEL_LABELS } from '../shared/report.js';
import { vnDateKey } from '../shared/vn-date.js';
import { dateRange, missingDays } from '../shared/day-buffer.js';

const BUFFER_DAYS = 60;
const MAX_NEW_DAYS_PER_RUN = 5;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function sb(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Supabase ${res.status}: ${text.slice(0, 200)}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function ensureTranslationBuffer(profile, apiKey, wantDays, tally) {
  const level = profile.settings?.translationLevel;
  if (!level) return;
  try {
    const existingRows = await sb(`translation_passages?select=day&profile_id=eq.${profile.id}&day=gte.${wantDays[0]}&day=lte.${wantDays[wantDays.length - 1]}`);
    const existingDays = [...new Set(existingRows.map((r) => r.day))];
    const missingAll = missingDays(wantDays, existingDays);
    const toGenerate = missingAll.slice(0, MAX_NEW_DAYS_PER_RUN);
    const levelLabel = EXAM_LEVEL_LABELS[level] || level;
    for (const day of toGenerate) {
      // eslint-disable-next-line no-await-in-loop -- chạy tuần tự để không dồn dập gọi Groq cùng lúc (tránh 429)
      const passages = await generatePassages({ apiKey, levelLabel, count: 3 });
      // eslint-disable-next-line no-await-in-loop
      await sb('translation_passages', {
        method: 'POST',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify(passages.map((p) => ({
          family_id: profile.family_id, profile_id: profile.id, day, level, ...p,
        }))),
      });
      tally.translation.generated++;
    }
    tally.translation.alreadyBuffered += existingDays.length;
    tally.translation.remaining += missingAll.length - toGenerate.length;
  } catch (e) {
    tally.translation.errors.push(`${profile.id}: ${e.message}`);
  }
}

async function ensureGrammarQuizBuffer(profile, apiKey, wantDays, tally) {
  const level = profile.settings?.grammarQuizLevel;
  if (!level) return;
  try {
    const existingRows = await sb(`grammar_quizzes?select=day&profile_id=eq.${profile.id}&day=gte.${wantDays[0]}&day=lte.${wantDays[wantDays.length - 1]}`);
    const existingDays = [...new Set(existingRows.map((r) => r.day))];
    const missingAll = missingDays(wantDays, existingDays);
    const toGenerate = missingAll.slice(0, MAX_NEW_DAYS_PER_RUN);
    const levelLabel = EXAM_LEVEL_LABELS[level] || level;
    for (const day of toGenerate) {
      // eslint-disable-next-line no-await-in-loop
      const questions = await generateGrammarQuiz({ apiKey, levelLabel, count: 5 });
      // eslint-disable-next-line no-await-in-loop
      await sb('grammar_quizzes', {
        method: 'POST',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ family_id: profile.family_id, profile_id: profile.id, day, level, questions }),
      });
      tally.grammar.generated++;
    }
    tally.grammar.alreadyBuffered += existingDays.length;
    tally.grammar.remaining += missingAll.length - toGenerate.length;
  } catch (e) {
    tally.grammar.errors.push(`${profile.id}: ${e.message}`);
  }
}

export default async function handler(req, res) {
  if (!process.env.CRON_SECRET || req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(500).json({ error: 'Thiếu biến môi trường SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY trên Vercel' });
  }

  const wantDays = dateRange(vnDateKey(), BUFFER_DAYS);
  const tally = {
    translation: { generated: 0, alreadyBuffered: 0, remaining: 0, errors: [] },
    grammar: { generated: 0, alreadyBuffered: 0, remaining: 0, errors: [] },
  };

  try {
    const [settingsRows, profiles] = await Promise.all([
      sb('settings?select=family_id,ai_api_key'),
      sb('profiles?select=id,family_id,settings'),
    ]);
    const keyByFamily = new Map(settingsRows.filter((s) => s.ai_api_key).map((s) => [s.family_id, s.ai_api_key]));

    for (const profile of profiles) {
      const apiKey = keyByFamily.get(profile.family_id);
      if (!apiKey) continue; // gia đình chưa cấu hình key AI -> bỏ qua bé này
      // eslint-disable-next-line no-await-in-loop
      await ensureTranslationBuffer(profile, apiKey, wantDays, tally);
      // eslint-disable-next-line no-await-in-loop
      await ensureGrammarQuizBuffer(profile, apiKey, wantDays, tally);
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }

  return res.status(200).json({ from: wantDays[0], to: wantDays[wantDays.length - 1], bufferDays: BUFFER_DAYS, ...tally });
}
