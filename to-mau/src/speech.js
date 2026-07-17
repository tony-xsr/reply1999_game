// Đọc to bằng Web Speech API (không cần file âm thanh, hoạt động offline
// với giọng hệ thống). Không có giọng tiếng Việt thì im lặng — game vẫn chơi được.

let mutedFn = () => false;

/** Cho phép app gắn điều kiện tắt tiếng chung (dùng chung nút 🔊 với sfx). */
export function bindMute(fn) { mutedFn = fn; }

/** Đọc 1 câu tiếng Việt; câu mới sẽ ngắt câu đang đọc. */
export function speak(text, { rate = 0.9, lang = 'vi-VN' } = {}) {
  try {
    if (mutedFn() || !window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = rate;
    const prefix = lang.split('-')[0];
    const voice = speechSynthesis.getVoices().find((v) => v.lang?.startsWith(prefix));
    if (voice) u.voice = voice;
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
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = rate;
      const prefix = lang.split('-')[0];
      const voice = speechSynthesis.getVoices().find((v) => v.lang?.startsWith(prefix));
      if (voice) u.voice = voice;
      u.onend = speakNext;
      u.onerror = speakNext;
      speechSynthesis.speak(u);
    };
    speakNext();
  } catch { finish(); }
}

// Một số trình duyệt nạp danh sách giọng bất đồng bộ
try { speechSynthesis?.getVoices(); } catch { /* ignore */ }
