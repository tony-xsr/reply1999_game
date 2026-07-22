// Đọc to bằng Web Speech API (không cần file âm thanh, hoạt động offline
// với giọng hệ thống). Không có giọng tiếng Việt thì im lặng — game vẫn chơi được.

let mutedFn = () => false;

/** Cho phép app gắn điều kiện tắt tiếng chung (dùng chung nút 🔊 với sfx). */
export function bindMute(fn) { mutedFn = fn; }

/** Đọc 1 câu tiếng Việt; câu mới sẽ ngắt câu đang đọc. */
export function speak(text, { rate = 0.9, lang = 'vi-VN' } = {}) {
  try {
    if (mutedFn() || !window.speechSynthesis) return;
    const prefix = lang.split('-')[0];
    const voice = speechSynthesis.getVoices().find((v) => v.lang?.startsWith(prefix));
    // Một số máy (vài dòng Samsung) KHÔNG có gói giọng đúng ngôn ngữ cài sẵn —
    // nếu cứ đọc mà không gán `voice` thì máy tự lấy giọng mặc định (thường
    // là tiếng Anh) để đọc chữ tiếng Việt, nghe sai hoàn toàn. Im lặng còn
    // hơn đọc sai giọng như vậy — đúng như thiết kế ban đầu của file này.
    if (!voice) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = rate;
    u.voice = voice;
    speechSynthesis.speak(u);
  } catch { /* trình duyệt không hỗ trợ */ }
}

/**
 * Đọc LẦN LƯỢT nhiều đoạn (mỗi đoạn có thể khác ngôn ngữ/tốc độ) — dùng để
 * xen kẽ từ tiếng Anh (đọc đúng giọng) với lời giải thích tiếng Việt trong
 * cùng 1 chuỗi, ví dụ: "Drink" (en-US) → "có nghĩa là uống." (vi-VN). Gọi
 * `onDone` khi đọc xong TOÀN BỘ chuỗi — dùng việc này để biết lúc nào mới
 * được chuyển sang câu hỏi kế tiếp, thay vì đoán 1 khoảng chờ cố định.
 * Luôn gọi `onDone` kể cả khi tắt tiếng/trình duyệt không hỗ trợ/gặp lỗi,
 * để màn chơi không bao giờ bị kẹt chờ mãi.
 */
export function speakSequence(parts, onDone) {
  const finish = () => { try { onDone?.(); } catch { /* ignore */ } };
  try {
    if (mutedFn() || !window.speechSynthesis || !parts?.length) { finish(); return; }
    speechSynthesis.cancel();
    let done = false;
    const settle = () => { if (done) return; done = true; clearTimeout(safetyTimer); finish(); };
    const totalChars = parts.reduce((sum, p) => sum + (p.text?.length || 0), 0);
    const safetyTimer = setTimeout(settle, 1500 + totalChars * 90);
    let i = 0;
    const speakNext = () => {
      if (i >= parts.length) { settle(); return; }
      const { text, lang = 'vi-VN', rate = 0.9 } = parts[i++];
      const prefix = lang.split('-')[0];
      const voice = speechSynthesis.getVoices().find((v) => v.lang?.startsWith(prefix));
      // Không có giọng đúng ngôn ngữ cho ĐOẠN NÀY (vd máy thiếu giọng tiếng
      // Việt) -> bỏ qua im lặng, đọc tiếp đoạn sau, thay vì đọc sai giọng.
      if (!voice) { speakNext(); return; }
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = rate;
      u.voice = voice;
      u.onend = speakNext;
      u.onerror = speakNext;
      speechSynthesis.speak(u);
    };
    speakNext();
  } catch { finish(); }
}

// Một số trình duyệt nạp danh sách giọng bất đồng bộ
try { speechSynthesis?.getVoices(); } catch { /* ignore */ }
