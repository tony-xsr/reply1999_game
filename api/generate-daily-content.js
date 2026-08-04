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

import * as aiProvider from '../shared/ai-provider.js';
import { EXAM_LEVEL_LABELS } from '../shared/report.js';
import { vnDateKey } from '../shared/vn-date.js';
import { dateRange, missingDays } from '../shared/day-buffer.js';
import { pickReusableContent, REUSE_WINDOW_DAYS } from '../shared/content-reuse.js';
import { buildWeakPointsSummary } from '../shared/weak-points.js';

const BUFFER_DAYS = 60;
const MAX_NEW_DAYS_PER_RUN = 5;

function daysAgoKey(days) {
  return new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
}

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

/** Như `sb()` GET nhưng LẤY HẾT mọi dòng bằng phân trang qua header `Range`,
 * không bị cắt bởi giới hạn mặc định 1000 dòng của PostgREST — kho dùng
 * chung (`passage_pool`) đã vượt mốc này, nếu không phân trang sẽ mất vĩnh
 * viễn các bài thêm SAU dòng thứ 1000 (xem cùng lỗi đã sửa ở
 * server/bulk-insert-content.js `sbAll()` và shared/api.js `getAll()`). */
async function sbAll(path, pageSize = 1000) {
  let all = [];
  let offset = 0;
  for (;;) {
    const page = (await sb(path, { headers: { Range: `${offset}-${offset + pageSize - 1}` } })) || [];
    all = all.concat(page);
    if (page.length < pageSize) break;
    offset += pageSize;
  }
  return all;
}

// Pool nội dung của CẢ NHÀ trong REUSE_WINDOW_DAYS ngày gần đây, cache theo
// "family:level[:quizType]" — dùng chung giữa các bé CÙNG NHÀ CÙNG CẤP ĐỘ
// trong 1 lượt chạy cron, để anh/chị/em không được gán trùng 1 bài trong
// cùng lượt (xem shared/content-reuse.js pickReusableContent()).
const passagePoolCache = new Map();
const quizPoolCache = new Map();

async function familyPassagePool(familyId, level, sinceDay) {
  const key = `${familyId}:${level}`;
  if (!passagePoolCache.has(key)) {
    passagePoolCache.set(key, await sb(`translation_passages?select=id,day,profile_id,title,passage_en,vocab&family_id=eq.${familyId}&level=eq.${level}&day=gte.${sinceDay}&order=day.asc`));
  }
  return passagePoolCache.get(key);
}

async function familyQuizPool(familyId, level, quizType, sinceDay) {
  const key = `${familyId}:${level}:${quizType}`;
  if (!quizPoolCache.has(key)) {
    quizPoolCache.set(key, await sb(`grammar_quizzes?select=id,day,profile_id,questions&family_id=eq.${familyId}&level=eq.${level}&quiz_type=eq.${quizType}&day=gte.${sinceDay}&order=day.asc`));
  }
  return quizPoolCache.get(key);
}

// Kho nội dung DÙNG CHUNG cho MỌI gia đình (xem migrate-18-content-pool.sql,
// server/bulk-insert-content.js) — cache theo "level[:quizType]" (KHÔNG theo
// family, vì kho không gắn family_id), dùng chung giữa MỌI gia đình/bé cùng
// cấp độ trong 1 lượt chạy cron. Chỉ dùng khi bé KHÔNG còn bài nào để tái sử
// dụng trong chính nhà mình — ưu tiên trước AI generation để đỡ tốn quota.
const passagePoolAllCache = new Map();
const quizPoolAllCache = new Map();

// Nếu chưa chạy migrate-18-content-pool.sql thì 2 bảng này chưa tồn tại —
// coi như kho rỗng (fallback AI như trước), KHÔNG chặn cron chạy tiếp.
async function sharedPassagePool(level) {
  if (!passagePoolAllCache.has(level)) {
    passagePoolAllCache.set(level, await sbAll(`passage_pool?select=id,title,passage_en,vocab&level=eq.${level}&order=created_at.asc`).catch(() => []));
  }
  return passagePoolAllCache.get(level);
}

async function sharedQuizPool(level, quizType) {
  const key = `${level}:${quizType}`;
  if (!quizPoolAllCache.has(key)) {
    quizPoolAllCache.set(key, await sbAll(`quiz_pool?select=id,questions&level=eq.${level}&quiz_type=eq.${quizType}&order=created_at.asc`).catch(() => []));
  }
  return quizPoolAllCache.get(key);
}

// Từ vựng/cấu trúc ngữ pháp bé hay sai (xem shared/weak-points.js) — dùng làm
// ngữ cảnh thêm để AI ưu tiên củng cố đúng chỗ yếu khi soạn bài mới.
async function weakSummaryFor(profileId) {
  const [words, points] = await Promise.all([
    sb(`weak_words?select=word,misses&profile_id=eq.${profileId}&order=misses.desc`),
    sb(`weak_grammar_points?select=structure,misses&profile_id=eq.${profileId}&order=misses.desc`),
  ]);
  return buildWeakPointsSummary(words, points);
}

async function ensureTranslationBuffer(profile, settings, wantDays, tally, weakSummary) {
  const level = profile.settings?.translationLevel;
  if (!level) return;
  try {
    const [existingRows, doneRows, myTitleRows] = await Promise.all([
      sb(`translation_passages?select=day&profile_id=eq.${profile.id}&day=gte.${wantDays[0]}&day=lte.${wantDays[wantDays.length - 1]}`),
      sb(`translation_submissions?select=passage_id&profile_id=eq.${profile.id}`),
      sb(`translation_passages?select=title&profile_id=eq.${profile.id}&level=eq.${level}`), // toàn bộ lịch sử (không chỉ wantDays) -> biết bé đã "mượn" bài nào trong kho chung rồi
    ]);
    const existingDays = [...new Set(existingRows.map((r) => r.day))];
    const doneIds = new Set(doneRows.map((r) => r.passage_id));
    const myTitles = new Set(myTitleRows.map((r) => r.title));
    const missingAll = missingDays(wantDays, existingDays);
    const toGenerate = missingAll.slice(0, MAX_NEW_DAYS_PER_RUN);
    const levelLabel = EXAM_LEVEL_LABELS[level] || level;
    const sinceDay = daysAgoKey(REUSE_WINDOW_DAYS);
    for (const day of toGenerate) {
      // eslint-disable-next-line no-await-in-loop -- chạy tuần tự để không dồn dập gọi AI cùng lúc (tránh 429)
      const pool = await familyPassagePool(profile.family_id, level, sinceDay);
      // Lọc bỏ trước bằng TIÊU ĐỀ (myTitles — toàn bộ lịch sử của CHÍNH bé
      // này, không chỉ bài ĐÃ NỘP) chứ không chỉ dựa vào doneIds: nếu không,
      // bài của ngày X trong CÙNG lượt buffer (chưa kịp nộp) vẫn bị coi là
      // "còn mới" và bị `pickReusableContent` chọn lại y hệt cho ngày X+1.
      const eligiblePool = pool.filter((p) => !myTitles.has(p.title));
      const picked = pickReusableContent(eligiblePool, { profileId: profile.id, todayKey: day, doneIds });
      let passages;
      let source;
      if (picked) {
        passages = [{ title: picked.title, passage_en: picked.passage_en, vocab: picked.vocab }];
        pool.push({ ...picked, day, profile_id: profile.id }); // đánh dấu đã gán hôm nay -> sibling khác không trùng
        doneIds.add(picked.id);
        myTitles.add(picked.title); // không mượn lại ĐÚNG bài này nữa cho CHÍNH bé này ở các ngày khác trong CÙNG lượt buffer
        source = 'reused';
      } else {
        // eslint-disable-next-line no-await-in-loop
        const shared = await sharedPassagePool(level);
        const fromShared = shared.find((p) => !myTitles.has(p.title));
        if (fromShared) {
          passages = [{ title: fromShared.title, passage_en: fromShared.passage_en, vocab: fromShared.vocab }];
          myTitles.add(fromShared.title); // không mượn lại đúng bài này lần nữa trong CÙNG lượt buffer nhiều ngày
          source = 'fromPool';
        } else {
          // eslint-disable-next-line no-await-in-loop
          passages = await aiProvider.generatePassages(settings, { levelLabel, count: 3, weakSummary });
          source = 'generated';
        }
      }
      // eslint-disable-next-line no-await-in-loop
      await sb('translation_passages', {
        method: 'POST',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify(passages.map((p) => ({
          family_id: profile.family_id, profile_id: profile.id, day, level, ...p,
        }))),
      });
      tally.translation[source] = (tally.translation[source] || 0) + 1;
    }
    tally.translation.alreadyBuffered += existingDays.length;
    tally.translation.remaining += missingAll.length - toGenerate.length;
  } catch (e) {
    tally.translation.errors.push(`${profile.id}: ${e.message}`);
  }
}

async function ensureGrammarQuizBuffer(profile, settings, wantDays, tally, weakSummary) {
  const level = profile.settings?.grammarQuizLevel;
  if (!level) return;
  const quizType = profile.settings?.grammarQuizType || 'grammar';
  try {
    const [existingRows, doneRows, myQuizRows] = await Promise.all([
      sb(`grammar_quizzes?select=day&profile_id=eq.${profile.id}&quiz_type=eq.${quizType}&day=gte.${wantDays[0]}&day=lte.${wantDays[wantDays.length - 1]}`),
      sb(`grammar_quiz_submissions?select=quiz_id&profile_id=eq.${profile.id}`),
      sb(`grammar_quizzes?select=questions&profile_id=eq.${profile.id}&level=eq.${level}&quiz_type=eq.${quizType}`), // toàn bộ lịch sử -> biết bé đã "mượn" đề nào trong kho chung rồi
    ]);
    const existingDays = [...new Set(existingRows.map((r) => r.day))];
    const doneIds = new Set(doneRows.map((r) => r.quiz_id));
    const donePrompts = new Set(myQuizRows.flatMap((r) => (r.questions || []).map((q) => q.prompt)));
    const missingAll = missingDays(wantDays, existingDays);
    const toGenerate = missingAll.slice(0, MAX_NEW_DAYS_PER_RUN);
    const levelLabel = EXAM_LEVEL_LABELS[level] || level;
    const sinceDay = daysAgoKey(REUSE_WINDOW_DAYS);
    for (const day of toGenerate) {
      // eslint-disable-next-line no-await-in-loop
      const pool = await familyQuizPool(profile.family_id, level, quizType, sinceDay);
      // Lọc bỏ trước bằng PROMPT (donePrompts — toàn bộ lịch sử của CHÍNH bé
      // này) — cùng lý do như ensureTranslationBuffer() phía trên.
      const eligiblePool = pool.filter((qz) => !(qz.questions || []).some((q) => donePrompts.has(q.prompt)));
      const picked = pickReusableContent(eligiblePool, { profileId: profile.id, todayKey: day, doneIds });
      let questions;
      let source;
      if (picked) {
        questions = picked.questions;
        pool.push({ ...picked, day, profile_id: profile.id });
        doneIds.add(picked.id);
        picked.questions.forEach((q) => donePrompts.add(q.prompt)); // không mượn lại ĐÚNG đề này nữa cho CHÍNH bé này ở các ngày khác trong CÙNG lượt buffer
        source = 'reused';
      } else {
        // eslint-disable-next-line no-await-in-loop
        const shared = await sharedQuizPool(level, quizType);
        const fromShared = shared.find((qz) => !(qz.questions || []).some((q) => donePrompts.has(q.prompt)));
        if (fromShared) {
          questions = fromShared.questions;
          questions.forEach((q) => donePrompts.add(q.prompt)); // không mượn lại đúng đề này lần nữa trong CÙNG lượt buffer nhiều ngày
          source = 'fromPool';
        } else {
          // eslint-disable-next-line no-await-in-loop
          questions = await aiProvider.generateGrammarQuiz(settings, { levelLabel, count: 5, quizType, weakSummary });
          source = 'generated';
        }
      }
      // eslint-disable-next-line no-await-in-loop
      await sb('grammar_quizzes', {
        method: 'POST',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ family_id: profile.family_id, profile_id: profile.id, day, level, quiz_type: quizType, questions }),
      });
      tally.grammar[source] = (tally.grammar[source] || 0) + 1;
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

  // Admin có thể TẮT cron này từ /admin/ (xem api/admin-cron.js) mà không cần
  // xoá lịch cron trên Vercel Dashboard — chưa chạy migrate-17 thì coi như
  // đang BẬT (giữ đúng hành vi trước khi có cờ này).
  try {
    const settingRows = await sb(`system_settings?select=value&key=eq.cron_generate_daily_content_enabled`);
    if (settingRows?.[0]?.value === false) {
      return res.status(200).json({ skipped: true, reason: 'Cron đang TẮT — bật lại ở trang Admin (⏯️ Cron sinh bài AI mỗi ngày).' });
    }
  } catch { /* bảng chưa tồn tại (chưa chạy migrate-17) -> coi như đang BẬT, chạy tiếp bình thường */ }

  const wantDays = dateRange(vnDateKey(), BUFFER_DAYS);
  const tally = {
    translation: { generated: 0, reused: 0, fromPool: 0, alreadyBuffered: 0, remaining: 0, errors: [] },
    grammar: { generated: 0, reused: 0, fromPool: 0, alreadyBuffered: 0, remaining: 0, errors: [] },
  };

  try {
    const [settingsRows, profiles] = await Promise.all([
      sb('settings?select=family_id,ai_provider,ai_api_key,deepseek_api_key,deepseek_model'),
      sb('profiles?select=id,family_id,settings'),
    ]);
    const settingsByFamily = new Map(settingsRows.map((s) => [s.family_id, s]));

    for (const profile of profiles) {
      const settings = settingsByFamily.get(profile.family_id);
      if (!aiProvider.resolveProvider(settings).apiKey) continue; // gia đình chưa cấu hình key AI -> bỏ qua bé này
      // eslint-disable-next-line no-await-in-loop
      const weakSummary = await weakSummaryFor(profile.id).catch(() => '');
      // eslint-disable-next-line no-await-in-loop
      await ensureTranslationBuffer(profile, settings, wantDays, tally, weakSummary);
      // eslint-disable-next-line no-await-in-loop
      await ensureGrammarQuizBuffer(profile, settings, wantDays, tally, weakSummary);
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }

  return res.status(200).json({ from: wantDays[0], to: wantDays[wantDays.length - 1], bufferDays: BUFFER_DAYS, ...tally });
}
