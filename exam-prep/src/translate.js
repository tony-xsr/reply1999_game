// Luyện Dịch — hàm THUẦN cho bài tập nối từ vựng sau khi bé nộp bản dịch (bản
// dịch tự nó được chấm riêng bằng AI qua shared/groq.js gradeTranslation()).
// Tách khỏi app.js để test được không cần DOM.

/** Trộn ngẫu nhiên độc lập 2 cột (từ tiếng Anh + nghĩa tiếng Việt) để bé nối —
 * tránh lộ thứ tự thẳng hàng dễ đoán mò không cần đọc nghĩa. */
export function shuffleVocabColumns(vocab, rng = Math.random) {
  const shuffle = (arr) => {
    const out = [...arr];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };
  return {
    words: shuffle(vocab.map((v) => v.word)),
    meanings: shuffle(vocab.map((v) => v.vi)),
  };
}

/** Bảng tra cứu cặp đúng word→vi từ danh sách vocab gốc của 1 đoạn văn. */
export function vocabAnswerKey(vocab) {
  return new Map(vocab.map((v) => [v.word, v.vi]));
}

/** Bé chọn đúng nghĩa cho 1 từ chưa nối hay chưa — dùng bởi UI để tô đúng/sai. */
export function isCorrectMatch(vocab, word, meaning) {
  return vocabAnswerKey(vocab).get(word) === meaning;
}
