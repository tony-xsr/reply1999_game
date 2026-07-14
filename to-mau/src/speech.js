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

// Một số trình duyệt nạp danh sách giọng bất đồng bộ
try { speechSynthesis?.getVoices(); } catch { /* ignore */ }
