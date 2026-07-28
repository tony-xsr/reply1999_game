// Client DeepSeek — lựa chọn THỨ 2 bên cạnh Groq (xem shared/groq.js) cho
// mọi tính năng AI (câu hỏi/đoạn dịch luyện dịch/chấm điểm/trắc nghiệm ngữ
// pháp). API của DeepSeek tương thích khuôn dạng OpenAI Chat Completions
// giống Groq nên tái dùng NGUYÊN VẸN các hàm phân tích/kiểm tra khuôn dạng
// JSON đã có ở groq.js (parseQuestionsResponse, parsePassagesResponse...) —
// chỉ khác URL/model/tên biến môi trường key. Gọi THẲNG từ trình duyệt như
// Groq (xem cảnh báo an toàn ở shared/groq.js) — phụ huynh tự nhập
// DEEPSEEK_API_KEY của mình ở Trang Phụ Huynh > Cài đặt > 🤖 Trợ Lý AI.
//
// Model mặc định để 'deepseek-v4-flash' theo yêu cầu dùng DeepSeek-V4-Flash —
// NẾU DeepSeek đổi tên slug API chính thức khác đi, chỉnh lại ở
// Trang Phụ Huynh > Cài đặt (ô "Model DeepSeek"), không cần sửa code.

import {
  parseQuestionsResponse, parsePassagesResponse, parseGradeResponse,
  parseGrammarQuizResponse, parseGrammarGradeResponse, parseSocialPostResponse,
} from './groq.js';

const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';
export const DEFAULT_DEEPSEEK_MODEL = 'deepseek-v4-flash';

/** Kiểm tra key hợp lệ bằng 1 lệnh gọi tối giản — trả về true/false, không ném lỗi. */
export async function testDeepSeekKey(apiKey, model = DEFAULT_DEEPSEEK_MODEL) {
  if (!apiKey) return false;
  try {
    const res = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: 'Trả lời đúng 1 từ: OK' }],
        max_tokens: 5,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Gọi DeepSeek Chat Completions — cùng khuôn dạng request/response với Groq
 * (OpenAI-compatible), chỉ khác URL. Mọi lỗi ném Error tiếng Việt như groq.js. */
async function callDeepSeek({ apiKey, model = DEFAULT_DEEPSEEK_MODEL, sys, user, temperature = 0.7 }) {
  if (!apiKey) throw new Error('Chưa cấu hình key DeepSeek — vào Trang Phụ Huynh > Cài đặt > 🤖 Trợ Lý AI');
  let res;
  try {
    res = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: sys }, { role: 'user', content: user }],
        temperature,
        response_format: { type: 'json_object' },
      }),
    });
  } catch {
    throw new Error('Không gọi được AI — kiểm tra kết nối mạng');
  }
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    if (res.status === 401) throw new Error('Key DeepSeek không hợp lệ hoặc đã hết hạn');
    if (res.status === 429) throw new Error('DeepSeek đang quá tải/hết lượt miễn phí, thử lại sau');
    throw new Error(`AI lỗi ${res.status}: ${body.slice(0, 150)}`);
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('AI không trả về nội dung');
  return content;
}

export async function generateQuestions({
  apiKey, model = DEFAULT_DEEPSEEK_MODEL, levelLabel, topic, grammarPoints = [], count = 5, avoidPrompts = [],
}) {
  const avoidList = avoidPrompts.slice(0, 30).join(' | ');
  const sys = 'Bạn là giáo viên tiếng Anh soạn câu hỏi trắc nghiệm luyện thi chứng chỉ quốc tế cho học sinh Việt Nam 6-15 tuổi. LUÔN trả lời bằng đúng 1 khối JSON hợp lệ, không thêm chữ nào khác ngoài JSON.';
  const user = `Cấp độ: ${levelLabel}. Chủ điểm: ${topic}.${grammarPoints.length ? ` Trọng tâm ngữ pháp: ${grammarPoints.join(', ')}.` : ''}
Soạn ĐÚNG ${count} câu hỏi trắc nghiệm tiếng Anh MỚI (không trùng ý các câu sau: ${avoidList || '(chưa có)'}).
Mỗi câu có prompt tiếng Anh (chỗ trống dùng "___" nếu là câu điền từ), đúng 4 lựa chọn (options), đúng 1 đáp án đúng (answer, chỉ số 0-3), và explain giải thích ngắn bằng tiếng Việt tại sao đáp án đó đúng.
Trả về DUY NHẤT JSON dạng: {"questions":[{"prompt":"...","options":["...","...","...","..."],"answer":0,"explain":"..."}]}`;

  const content = await callDeepSeek({ apiKey, model, sys, user });
  return parseQuestionsResponse(content, count);
}

/** @param {string} [weakSummary] xem shared/groq.js generatePassages() cho cùng logic. */
export async function generatePassages({ apiKey, model = DEFAULT_DEEPSEEK_MODEL, levelLabel, count = 3, weakSummary = '' }) {
  const sys = 'Bạn là giáo viên tiếng Anh soạn đoạn văn ngắn cho học sinh Việt Nam luyện dịch Anh-Việt, đúng độ khó cấp độ được yêu cầu. LUÔN trả lời bằng đúng 1 khối JSON hợp lệ, không thêm chữ nào khác ngoài JSON.';
  const user = `Cấp độ: ${levelLabel}. Soạn ĐÚNG ${count} đoạn văn tiếng Anh NGẮN (3-5 câu), chủ đề đời thường gần gũi học sinh, KHÁC NHAU HOÀN TOÀN về nội dung, độ khó từ vựng/ngữ pháp phù hợp đúng cấp độ trên.
Mỗi đoạn kèm 1 tiêu đề ngắn bằng tiếng Việt (title) và 5 từ tiếng Anh QUAN TRỌNG xuất hiện trong đoạn kèm nghĩa tiếng Việt (vocab) — để học sinh ôn lại sau khi dịch.${weakSummary ? `\n${weakSummary}` : ''}
Trả về DUY NHẤT JSON dạng: {"passages":[{"title":"...","passage_en":"...","vocab":[{"word":"...","vi":"..."},{"word":"...","vi":"..."},{"word":"...","vi":"..."},{"word":"...","vi":"..."},{"word":"...","vi":"..."}]}]}`;

  const content = await callDeepSeek({ apiKey, model, sys, user, temperature: 0.9 });
  return parsePassagesResponse(content, count);
}

/** @returns {Promise<{score:number, feedback:string, referenceVi:string}>} */
export async function gradeTranslation({ apiKey, model = DEFAULT_DEEPSEEK_MODEL, passageEn, submittedVi }) {
  const sys = 'Bạn là giáo viên tiếng Anh CHẤM ĐIỂM bài dịch Anh-Việt của học sinh Việt Nam. Chấm theo mức độ HIỂU ĐÚNG Ý nội dung, KHÔNG bắt buộc dịch đúng nguyên văn từng từ — miễn học sinh hiểu đúng ý chính là cho điểm cao. LUÔN trả lời bằng đúng 1 khối JSON hợp lệ, không thêm chữ nào khác ngoài JSON.';
  const user = `Đoạn văn tiếng Anh gốc:\n"""${passageEn}"""\n\nBản dịch tiếng Việt của học sinh:\n"""${submittedVi || '(bé chưa viết gì)'}"""\n\nChấm điểm 0-100 dựa trên mức độ hiểu đúng ý nội dung (không trừ điểm vì cách diễn đạt khác bản dịch mẫu). Viết nhận xét ngắn gọn bằng tiếng Việt, giọng khích lệ, nêu 1-2 điểm bé làm tốt và 1 điểm có thể cải thiện nếu có. Viết thêm 1 bản dịch tiếng Việt MẪU của riêng đoạn văn gốc (tự nhiên, dễ hiểu) để học sinh so sánh lại với bài của mình.
Trả về DUY NHẤT JSON dạng: {"score": 85, "feedback": "...", "reference_vi": "..."}`;

  const content = await callDeepSeek({ apiKey, model, sys, user, temperature: 0.4 });
  return parseGradeResponse(content);
}

/** @param {'grammar'|'vocab'} quizType @param {string} [weakSummary] xem shared/groq.js generateGrammarQuiz() cho cùng logic. */
export async function generateGrammarQuiz({ apiKey, model = DEFAULT_DEEPSEEK_MODEL, levelLabel, count = 5, quizType = 'grammar', weakSummary = '' }) {
  const isVocab = quizType === 'vocab';
  const sys = isVocab
    ? 'Bạn là giáo viên tiếng Anh soạn đề trắc nghiệm TỪ VỰNG cho học sinh Việt Nam luyện thi chứng chỉ quốc tế, đúng độ khó cấp độ được yêu cầu. LUÔN trả lời bằng đúng 1 khối JSON hợp lệ, không thêm chữ nào khác ngoài JSON.'
    : 'Bạn là giáo viên tiếng Anh soạn đề trắc nghiệm ngữ pháp cho học sinh Việt Nam luyện thi chứng chỉ quốc tế, đúng độ khó cấp độ được yêu cầu. LUÔN trả lời bằng đúng 1 khối JSON hợp lệ, không thêm chữ nào khác ngoài JSON.';
  const weakLine = weakSummary ? `\n${weakSummary}` : '';
  const user = isVocab
    ? `Cấp độ: ${levelLabel}. Soạn ĐÚNG ${count} câu hỏi trắc nghiệm TỪ VỰNG tiếng Anh MỚI, chủ đề từ vựng KHÁC NHAU, đúng độ khó cấp độ trên — kiểm tra NGHĨA CỦA TỪ (chọn đúng nghĩa/từ đồng nghĩa/điền đúng từ theo ngữ cảnh câu), KHÔNG kiểm tra ngữ pháp.
Mỗi câu có prompt tiếng Anh (câu có 1 từ để trống dùng "___" hoặc hỏi thẳng nghĩa của 1 từ), đúng 4 lựa chọn (options), đúng 1 đáp án đúng (answer, chỉ số 0-3), "explanations" — mảng ĐÚNG 4 chuỗi giải thích bằng tiếng Việt, MỖI PHẦN TỬ ứng với ĐÚNG 1 lựa chọn theo thứ tự trong options: với lựa chọn ĐÚNG thì giải thích nghĩa của từ/vì sao hợp ngữ cảnh; với các lựa chọn SAI thì giải thích vì sao nghĩa không phù hợp, "structure" — 1 câu tiếng Việt nêu rõ TỪ/CỤM TỪ đang kiểm tra thuộc loại gì (danh từ/động từ/tính từ/thành ngữ...) và vì sao dùng đúng chỗ đó trong câu, và "translation" — dịch NGUYÊN CÂU tiếng Anh (đã điền đáp án đúng vào chỗ trống) sang tiếng Việt.${weakLine}
Trả về DUY NHẤT JSON dạng: {"questions":[{"prompt":"...","options":["...","...","...","..."],"answer":0,"explanations":["vì sao đúng...","vì sao sai...","vì sao sai...","vì sao sai..."],"structure":"...","translation":"..."}]}`
    : `Cấp độ: ${levelLabel}. Soạn ĐÚNG ${count} câu hỏi trắc nghiệm ngữ pháp tiếng Anh MỚI, chủ điểm ngữ pháp KHÁC NHAU, đúng độ khó cấp độ trên.
Mỗi câu có prompt tiếng Anh (chỗ trống dùng "___"), đúng 4 lựa chọn (options), đúng 1 đáp án đúng (answer, chỉ số 0-3), "explanations" — mảng ĐÚNG 4 chuỗi giải thích bằng tiếng Việt, MỖI PHẦN TỬ ứng với ĐÚNG 1 lựa chọn theo thứ tự trong options: với lựa chọn ĐÚNG thì giải thích vì sao nó đúng; với các lựa chọn SAI thì giải thích cụ thể vì sao KHÔNG NÊN chọn đáp án đó (sai ở điểm ngữ pháp gì), "structure" — 1-2 câu tiếng Việt nêu rõ TÊN cấu trúc/thì ngữ pháp đang kiểm tra (vd "Câu điều kiện loại 2", "Thì hiện tại hoàn thành") và GIẢI THÍCH vì sao ngữ cảnh câu này phải dùng đúng cấu trúc/thì đó, và "translation" — dịch NGUYÊN CÂU tiếng Anh (đã điền đáp án đúng vào chỗ trống) sang tiếng Việt.${weakLine}
Trả về DUY NHẤT JSON dạng: {"questions":[{"prompt":"...","options":["...","...","...","..."],"answer":0,"explanations":["vì sao đúng...","vì sao sai...","vì sao sai...","vì sao sai..."],"structure":"...","translation":"..."}]}`;

  const content = await callDeepSeek({ apiKey, model, sys, user, temperature: 0.7 });
  return parseGrammarQuizResponse(content, count);
}

export async function gradeGrammarQuiz({ apiKey, model = DEFAULT_DEEPSEEK_MODEL, results }) {
  const total = results.length;
  const correctCount = results.filter((r) => r.correct).length;
  const wrong = results.filter((r) => !r.correct).map((r) => r.prompt);
  const sys = 'Bạn là giáo viên tiếng Anh nhận xét kết quả đề trắc nghiệm ngữ pháp của học sinh Việt Nam, giọng khích lệ, tích cực. LUÔN trả lời bằng đúng 1 khối JSON hợp lệ, không thêm chữ nào khác ngoài JSON.';
  const user = `Học sinh làm đúng ${correctCount}/${total} câu.${wrong.length ? ` Các câu làm SAI: ${wrong.join(' | ')}.` : ' Làm đúng hết!'}
Viết 1 đoạn nhận xét ngắn gọn bằng tiếng Việt (2-4 câu), khích lệ, và nếu có câu sai thì gợi ý cụ thể nên ôn lại chủ điểm ngữ pháp nào.
Trả về DUY NHẤT JSON dạng: {"suggestion": "..."}`;

  const content = await callDeepSeek({ apiKey, model, sys, user, temperature: 0.6 });
  return parseGrammarGradeResponse(content);
}

/** Xem shared/groq.js generateSocialPosts() cho cùng logic — dùng chung parseSocialPostResponse. */
export async function generateSocialPosts({ apiKey, model = DEFAULT_DEEPSEEK_MODEL, topic, count = 2 }) {
  const sys = 'Bạn soạn nội dung bài tập tiếng Anh cho học sinh Việt Nam dưới dạng GIẢ LẬP bài đăng mạng xã hội (như TikTok/Instagram) — vui nhộn, hài hước, PHÙ HỢP TRẺ EM, để in ra giấy cho bé dịch. LUÔN trả lời bằng đúng 1 khối JSON hợp lệ, không thêm chữ nào khác ngoài JSON.';
  const user = `Chủ đề: ${topic || 'đời sống hằng ngày vui nhộn, phù hợp trẻ em'}. Soạn ĐÚNG ${count} bài đăng mạng xã hội tiếng Anh GIẢ LẬP (KHÔNG dùng tên người thật/nhân vật có bản quyền), MỖI bài gồm:
- username: tên tài khoản ảo vui nhộn
- emoji: 1 emoji đại diện chủ đề bài đăng
- caption: 1 câu tiêu đề/chú thích tiếng Anh ngắn, hài hước, phù hợp trẻ em
- likes: 1 số lượt thích ngẫu nhiên hợp lý (vd 1234)
- comments: mảng ĐÚNG 5 bình luận tiếng Anh NGẮN, HÀI HƯỚC, phù hợp trẻ em, có thể kèm emoji, mỗi bình luận có "username" (tên ảo), "text" (nội dung tiếng Anh), và "vi" (nghĩa tiếng Việt CHÍNH XÁC để làm đáp án cho bé dịch)
Trả về DUY NHẤT JSON dạng: {"posts":[{"username":"...","emoji":"🎬","caption":"...","likes":1234,"comments":[{"username":"...","text":"...","vi":"..."}]}]}`;

  const content = await callDeepSeek({ apiKey, model, sys, user, temperature: 0.95 });
  return parseSocialPostResponse(content, count);
}

/** Xem shared/groq.js generateMillionaireQuiz() cho cùng logic. */
export async function generateMillionaireQuiz({ apiKey, model = DEFAULT_DEEPSEEK_MODEL, levelLabel, count = 15 }) {
  const sys = 'Bạn là giáo viên tiếng Anh soạn đề trắc nghiệm kiểu gameshow "Ai Là Triệu Phú" cho học sinh Việt Nam luyện thi chứng chỉ quốc tế. LUÔN trả lời bằng đúng 1 khối JSON hợp lệ, không thêm chữ nào khác ngoài JSON.';
  const user = `Cấp độ: ${levelLabel}. Soạn ĐÚNG ${count} câu hỏi tiếng Anh, XẾP THEO THỨ TỰ TỪ DỄ NHẤT (câu 1) ĐẾN KHÓ NHẤT (câu cuối) — độ khó tăng dần rõ rệt qua từng câu, đúng tinh thần gameshow "càng về sau càng khó". Trộn đều 3 DẠNG câu hỏi xen kẽ trong suốt đề: (1) ngữ pháp, (2) từ vựng (nghĩa từ/đồng nghĩa), (3) đọc hiểu — với dạng đọc hiểu thì NHÚNG THẲNG 1 đoạn văn tiếng Anh RẤT NGẮN (2-3 câu) vào ngay trong "prompt" rồi hỏi 1 câu hỏi về đoạn đó.
Mỗi câu có "prompt" (câu hỏi tiếng Anh, nếu là câu điền từ thì chỗ trống dùng "___"), đúng 4 lựa chọn (options), đúng 1 đáp án đúng (answer, chỉ số 0-3), "explanations" — mảng ĐÚNG 4 chuỗi giải thích bằng tiếng Việt, MỖI PHẦN TỬ ứng với ĐÚNG 1 lựa chọn theo thứ tự trong options: với lựa chọn ĐÚNG thì giải thích vì sao đúng; với các lựa chọn SAI thì giải thích cụ thể vì sao không nên chọn, "structure" — 1-2 câu tiếng Việt nêu rõ ĐIỂM KIẾN THỨC đang kiểm tra (tên cấu trúc/thì ngữ pháp nếu là câu ngữ pháp, hoặc loại từ/ngữ cảnh nếu là câu từ vựng) và vì sao ngữ cảnh câu này cần dùng đúng như vậy, và "translation" — dịch NGUYÊN CÂU/đoạn văn tiếng Anh trong prompt (đã điền đáp án đúng nếu có chỗ trống) sang tiếng Việt.
Trả về DUY NHẤT JSON dạng: {"questions":[{"prompt":"...","options":["...","...","...","..."],"answer":0,"explanations":["vì sao đúng...","vì sao sai...","vì sao sai...","vì sao sai..."],"structure":"...","translation":"..."}]}`;

  const content = await callDeepSeek({ apiKey, model, sys, user, temperature: 0.8 });
  return parseGrammarQuizResponse(content, count);
}
