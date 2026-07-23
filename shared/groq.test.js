// Unit test cho phần THUẦN LOGIC của client Groq (không gọi mạng thật).
// Chạy: node shared/groq.test.js

import {
  parseQuestionsResponse, parsePassagesResponse, parseGradeResponse,
  parseGrammarQuizResponse, parseGrammarGradeResponse,
} from './groq.js';

let passed = 0;
let failed = 0;

function check(name, cond) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.error(`  ❌ ${name}`); }
}

console.log('— parseQuestionsResponse —');

check('JSON hợp lệ: bóc đúng số câu, gắn id/type/explain đầy đủ', (() => {
  const content = JSON.stringify({
    questions: [
      { prompt: 'I ___ happy.', options: ['am', 'is', 'are', 'be'], answer: 0, explain: 'I -> am' },
      { prompt: 'She ___ a doctor.', options: ['am', 'is', 'are', 'be'], answer: 1, explain: 'She -> is' },
    ],
  });
  const qs = parseQuestionsResponse(content, 5);
  return qs.length === 2
    && qs.every((q) => q.id.startsWith('ai-') && q.type === 'grammar' && q.options.length === 4)
    && qs[0].prompt === 'I ___ happy.' && qs[0].answer === 0 && qs[1].explain === 'She -> is';
})());

check('model bọc thêm ```json ... ``` quanh JSON vẫn bóc được', (() => {
  const raw = '```json\n' + JSON.stringify({ questions: [{ prompt: 'X ___ Y.', options: ['a', 'b', 'c', 'd'], answer: 2, explain: 'vì X' }] }) + '\n```';
  const qs = parseQuestionsResponse(raw, 5);
  return qs.length === 1 && qs[0].answer === 2;
})());

check('giới hạn đúng count, dù AI trả về nhiều hơn', (() => {
  const many = Array.from({ length: 8 }, (_, i) => ({ prompt: `Q${i} ___`, options: ['a', 'b', 'c', 'd'], answer: 0, explain: '' }));
  const qs = parseQuestionsResponse(JSON.stringify({ questions: many }), 3);
  return qs.length === 3;
})());

check('lọc bỏ câu sai khuôn dạng (thiếu options/answer ngoài phạm vi/không đủ 4 lựa chọn), giữ câu hợp lệ', (() => {
  const content = JSON.stringify({
    questions: [
      { prompt: 'Đủ 4', options: ['a', 'b', 'c', 'd'], answer: 3, explain: '' },
      { prompt: 'Thiếu lựa chọn', options: ['a', 'b'], answer: 0, explain: '' },
      { prompt: 'answer ngoài phạm vi', options: ['a', 'b', 'c', 'd'], answer: 9, explain: '' },
      { prompt: '', options: ['a', 'b', 'c', 'd'], answer: 0, explain: '' }, // prompt rỗng
    ],
  });
  const qs = parseQuestionsResponse(content, 10);
  return qs.length === 1 && qs[0].prompt === 'Đủ 4';
})());

check('id sinh ra không trùng nhau trong cùng 1 lần gọi', (() => {
  const many = Array.from({ length: 4 }, (_, i) => ({ prompt: `Q${i} ___`, options: ['a', 'b', 'c', 'd'], answer: 0, explain: '' }));
  const qs = parseQuestionsResponse(JSON.stringify({ questions: many }), 4);
  return new Set(qs.map((q) => q.id)).size === qs.length;
})());

check('không có câu nào hợp lệ (mảng rỗng/JSON hỏng khuôn dạng) → ném lỗi rõ ràng', (() => {
  try {
    parseQuestionsResponse(JSON.stringify({ questions: [] }), 5);
    return false;
  } catch (e) {
    return /không đúng khuôn dạng/.test(e.message);
  }
})());

check('không tìm thấy khối JSON nào trong câu trả lời → ném lỗi rõ ràng', (() => {
  try {
    parseQuestionsResponse('xin lỗi, tôi không thể trả lời', 5);
    return false;
  } catch (e) {
    return /định dạng JSON/.test(e.message);
  }
})());

console.log('— parsePassagesResponse —');

const sampleVocab = [
  { word: 'garden', vi: 'khu vườn' }, { word: 'water', vi: 'tưới nước' }, { word: 'flower', vi: 'bông hoa' },
];

check('JSON hợp lệ: bóc đúng số đoạn văn, giữ nguyên title/passage_en/vocab', (() => {
  const content = JSON.stringify({
    passages: [
      { title: 'Khu vườn', passage_en: 'I water the garden every morning.', vocab: sampleVocab },
      { title: 'Bữa sáng', passage_en: 'She eats breakfast at 7am.', vocab: sampleVocab },
    ],
  });
  const ps = parsePassagesResponse(content, 3);
  return ps.length === 2 && ps[0].title === 'Khu vườn' && ps[0].vocab.length === 3 && ps[0].vocab[0].word === 'garden';
})());

check('giới hạn đúng count, dù AI trả về nhiều đoạn hơn', (() => {
  const many = Array.from({ length: 5 }, (_, i) => ({ title: `T${i}`, passage_en: `Passage ${i}.`, vocab: sampleVocab }));
  const ps = parsePassagesResponse(JSON.stringify({ passages: many }), 3);
  return ps.length === 3;
})());

check('lọc bỏ đoạn thiếu vocab/title rỗng/không đủ 3 từ vựng, giữ đoạn hợp lệ', (() => {
  const content = JSON.stringify({
    passages: [
      { title: 'Đủ điều kiện', passage_en: 'Valid passage.', vocab: sampleVocab },
      { title: '', passage_en: 'No title.', vocab: sampleVocab },
      { title: 'Thiếu vocab', passage_en: 'Too few words.', vocab: [{ word: 'a', vi: 'a' }] },
      { title: 'Không có passage_en', vocab: sampleVocab },
    ],
  });
  const ps = parsePassagesResponse(content, 10);
  return ps.length === 1 && ps[0].title === 'Đủ điều kiện';
})());

check('không có đoạn nào hợp lệ → ném lỗi rõ ràng', (() => {
  try {
    parsePassagesResponse(JSON.stringify({ passages: [] }), 3);
    return false;
  } catch (e) {
    return /không đúng khuôn dạng/.test(e.message);
  }
})());

console.log('— parseGradeResponse —');

check('JSON hợp lệ: lấy đúng score (làm tròn) + feedback', (() => {
  const g = parseGradeResponse(JSON.stringify({ score: 87.6, feedback: 'Bé dịch đúng ý chính, giỏi lắm!' }));
  return g.score === 88 && g.feedback === 'Bé dịch đúng ý chính, giỏi lắm!';
})());

check('feedback rỗng/thiếu → dùng câu khích lệ mặc định', (() => {
  const g = parseGradeResponse(JSON.stringify({ score: 60, feedback: '' }));
  return g.score === 60 && /cố gắng/.test(g.feedback);
})());

check('score ngoài phạm vi 0-100 → ném lỗi rõ ràng', (() => {
  try {
    parseGradeResponse(JSON.stringify({ score: 150, feedback: 'x' }));
    return false;
  } catch (e) {
    return /điểm không hợp lệ/.test(e.message);
  }
})());

check('score không phải số → ném lỗi rõ ràng', (() => {
  try {
    parseGradeResponse(JSON.stringify({ score: 'giỏi', feedback: 'x' }));
    return false;
  } catch (e) {
    return /điểm không hợp lệ/.test(e.message);
  }
})());

console.log('— parseGrammarQuizResponse —');

const sampleExplanations = ['Đúng vì chủ ngữ số ít.', 'Sai vì dùng cho số nhiều.', 'Sai vì đây là dạng quá khứ.', 'Sai vì thiếu trợ động từ.'];

check('JSON hợp lệ: bóc đúng số câu, giữ nguyên prompt/options/answer/explanations (đủ 4 phần tử)', (() => {
  const content = JSON.stringify({
    questions: [
      { prompt: 'She ___ happy.', options: ['is', 'are', 'was', 'be'], answer: 0, explanations: sampleExplanations },
      { prompt: 'They ___ students.', options: ['is', 'are', 'was', 'be'], answer: 1, explanations: sampleExplanations },
    ],
  });
  const qs = parseGrammarQuizResponse(content, 5);
  return qs.length === 2 && qs[0].prompt === 'She ___ happy.' && qs[0].answer === 0
    && qs[0].explanations.length === 4 && qs[0].explanations[0] === 'Đúng vì chủ ngữ số ít.';
})());

check('giới hạn đúng count, dù AI trả về nhiều câu hơn', (() => {
  const many = Array.from({ length: 8 }, (_, i) => ({ prompt: `Q${i} ___`, options: ['a', 'b', 'c', 'd'], answer: 0, explanations: sampleExplanations }));
  const qs = parseGrammarQuizResponse(JSON.stringify({ questions: many }), 5);
  return qs.length === 5;
})());

check('lọc bỏ câu thiếu explanations/không đủ 4 phần tử/answer ngoài phạm vi, giữ câu hợp lệ', (() => {
  const content = JSON.stringify({
    questions: [
      { prompt: 'Đủ điều kiện', options: ['a', 'b', 'c', 'd'], answer: 2, explanations: sampleExplanations },
      { prompt: 'Thiếu explanations', options: ['a', 'b', 'c', 'd'], answer: 0, explanations: ['chỉ 1 câu'] },
      { prompt: 'Không có explanations', options: ['a', 'b', 'c', 'd'], answer: 0 },
      { prompt: 'answer ngoài phạm vi', options: ['a', 'b', 'c', 'd'], answer: 9, explanations: sampleExplanations },
    ],
  });
  const qs = parseGrammarQuizResponse(content, 10);
  return qs.length === 1 && qs[0].prompt === 'Đủ điều kiện';
})());

check('không có câu nào hợp lệ → ném lỗi rõ ràng', (() => {
  try {
    parseGrammarQuizResponse(JSON.stringify({ questions: [] }), 5);
    return false;
  } catch (e) {
    return /không đúng khuôn dạng/.test(e.message);
  }
})());

console.log('— parseGrammarGradeResponse —');

check('JSON hợp lệ: lấy đúng suggestion', (() => {
  const g = parseGrammarGradeResponse(JSON.stringify({ suggestion: 'Bé làm tốt, nên ôn lại thì quá khứ đơn.' }));
  return g.suggestion === 'Bé làm tốt, nên ôn lại thì quá khứ đơn.';
})());

check('suggestion rỗng/thiếu → dùng câu khích lệ mặc định', (() => {
  const g = parseGrammarGradeResponse(JSON.stringify({ suggestion: '' }));
  return /cố gắng/.test(g.suggestion);
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
