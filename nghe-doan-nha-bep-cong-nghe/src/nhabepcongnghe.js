// Nghe & Đoán: Nhà Bếp & Công Nghệ — giai đoạn 9 (MẢNG MỚI thứ 4 ngoài kế
// hoạch 5×1000 ban đầu): chế biến món ăn & đồ dùng nhà bếp, hương vị & cảm
// nhận, rau củ, thiết bị công nghệ (~54 mục). Toàn bộ từ đã đối chiếu với cả
// 8 game trước để KHÔNG dạy trùng (cook/tomato/phone/laptop/camera... đã có ở
// game khác nên bị loại; chỉ giữ từ mới hoàn toàn). Lặp lại khuôn mẫu đã kiểm
// chứng: mỗi mục có TỪ ĐƠN + CÂU NGẮN, mỗi vòng chọn ngẫu nhiên 1 trong 2
// kiểu (ưu tiên từ đơn), câu dài đọc chậm hơn hẳn, sai lần đầu được gợi ý
// chọn lại 1 lần. File thuần logic, không đụng DOM, test độc lập.

export const TOPICS = [
  { id: 'cook', label: 'Chế biến & nhà bếp', icon: '🍳' },
  { id: 'taste', label: 'Hương vị & cảm nhận', icon: '😋' },
  { id: 'veggie', label: 'Rau củ', icon: '🥕' },
  { id: 'tech', label: 'Công nghệ', icon: '💻' },
];

export const WORD_BANK = [
  // ===== Chế biến & nhà bếp (19) =====
  { id: 'cut', word: 'cut', emoji: '🔪', vi: 'cắt', topic: 'cook', sentence: 'I cut the vegetables.', sentenceVi: 'Tôi cắt rau củ.' },
  { id: 'mix', word: 'mix', emoji: '🥣', vi: 'trộn', topic: 'cook', sentence: 'Mix the salad well.', sentenceVi: 'Trộn đều món rau nhé.' },
  { id: 'pour', word: 'pour', emoji: '🫗', vi: 'rót', topic: 'cook', sentence: 'I pour the water.', sentenceVi: 'Tôi rót nước.' },
  { id: 'boil', word: 'boil', emoji: '🍲', vi: 'luộc, đun sôi', topic: 'cook', sentence: 'Mom boils the eggs.', sentenceVi: 'Mẹ luộc trứng.' },
  { id: 'bake', word: 'bake', emoji: '🧁', vi: 'nướng bánh', topic: 'cook', sentence: 'We bake a cake.', sentenceVi: 'Chúng tôi nướng bánh.' },
  { id: 'fry', word: 'fry', emoji: '🍟', vi: 'chiên', topic: 'cook', sentence: 'Dad fries the potatoes.', sentenceVi: 'Bố chiên khoai tây.' },
  { id: 'grill', word: 'grill', emoji: '🍖', vi: 'nướng thịt', topic: 'cook', sentence: 'We grill meat outside.', sentenceVi: 'Chúng tôi nướng thịt ngoài trời.' },
  { id: 'stir', word: 'stir', emoji: '🥄', vi: 'khuấy', topic: 'cook', sentence: 'Stir the soup slowly.', sentenceVi: 'Khuấy nồi canh từ từ nhé.' },
  { id: 'freeze', word: 'freeze', emoji: '🧊', vi: 'làm đông lạnh', topic: 'cook', sentence: 'We freeze the juice.', sentenceVi: 'Chúng tôi làm đông nước ép.' },
  { id: 'heat', word: 'heat', emoji: '🔥', vi: 'hâm nóng', topic: 'cook', sentence: 'Heat the milk, please.', sentenceVi: 'Hâm nóng sữa giúp mình nhé.' },
  { id: 'pan', word: 'pan', emoji: '🥘', vi: 'cái chảo', topic: 'cook', sentence: 'The pan is hot.', sentenceVi: 'Cái chảo đang nóng.' },
  { id: 'kettle', word: 'kettle', emoji: '🫖', vi: 'ấm đun nước', topic: 'cook', sentence: 'The kettle is boiling.', sentenceVi: 'Ấm nước đang sôi.' },
  { id: 'chopsticks', word: 'chopsticks', emoji: '🥢', vi: 'đôi đũa', topic: 'cook', sentence: 'I eat with chopsticks.', sentenceVi: 'Tôi ăn bằng đũa.' },
  { id: 'plate', word: 'plate', emoji: '🍽️', vi: 'cái đĩa', topic: 'cook', sentence: 'The food is on the plate.', sentenceVi: 'Thức ăn ở trên đĩa.' },
  { id: 'jar', word: 'jar', emoji: '🫙', vi: 'cái lọ', topic: 'cook', sentence: 'The jar is full of candy.', sentenceVi: 'Cái lọ đầy kẹo.' },
  { id: 'lunchbox', word: 'lunchbox', emoji: '🍱', vi: 'hộp cơm', topic: 'cook', sentence: 'I bring my lunchbox to school.', sentenceVi: 'Tôi mang hộp cơm đến trường.' },
  { id: 'straw', word: 'straw', emoji: '🥤', vi: 'ống hút', topic: 'cook', sentence: 'I drink milk with a straw.', sentenceVi: 'Tôi uống sữa bằng ống hút.' },
  { id: 'roast', word: 'roast', emoji: '🍗', vi: 'quay, nướng lò', topic: 'cook', sentence: 'We roast a chicken.', sentenceVi: 'Chúng tôi quay một con gà.' },
  { id: 'steam', word: 'steam', emoji: '♨️', vi: 'hấp', topic: 'cook', sentence: 'Mom steams the fish.', sentenceVi: 'Mẹ hấp cá.' },

  // ===== Hương vị & cảm nhận (8) =====
  { id: 'sweet', word: 'sweet', emoji: '🍬', vi: 'ngọt', topic: 'taste', sentence: 'Candy is sweet.', sentenceVi: 'Kẹo có vị ngọt.' },
  { id: 'sour', word: 'sour', emoji: '🍋', vi: 'chua', topic: 'taste', sentence: 'Lemons are sour.', sentenceVi: 'Chanh có vị chua.' },
  { id: 'salty', word: 'salty', emoji: '🧂', vi: 'mặn', topic: 'taste', sentence: 'The sea water is salty.', sentenceVi: 'Nước biển có vị mặn.' },
  { id: 'spicy', word: 'spicy', emoji: '🌶️', vi: 'cay', topic: 'taste', sentence: 'The chili is spicy.', sentenceVi: 'Ớt rất cay.' },
  { id: 'bitter', word: 'bitter', emoji: '☕', vi: 'đắng', topic: 'taste', sentence: 'Coffee is bitter.', sentenceVi: 'Cà phê có vị đắng.' },
  { id: 'fresh', word: 'fresh', emoji: '🥗', vi: 'tươi', topic: 'taste', sentence: 'The salad is fresh.', sentenceVi: 'Món rau trộn rất tươi.' },
  { id: 'taste', word: 'taste', emoji: '👅', vi: 'nếm', topic: 'taste', sentence: 'Taste the soup.', sentenceVi: 'Nếm thử món canh nhé.' },
  { id: 'smell', word: 'smell', emoji: '👃', vi: 'ngửi', topic: 'taste', sentence: 'I smell the food.', sentenceVi: 'Tôi ngửi thức ăn.' },

  // ===== Rau củ (18) =====
  { id: 'carrot', word: 'carrot', emoji: '🥕', vi: 'cà rốt', topic: 'veggie', sentence: 'Rabbits love carrots.', sentenceVi: 'Thỏ rất thích cà rốt.' },
  { id: 'potato', word: 'potato', emoji: '🥔', vi: 'khoai tây', topic: 'veggie', sentence: 'I like potato soup.', sentenceVi: 'Tôi thích súp khoai tây.' },
  { id: 'sweetpotato', word: 'sweet potato', emoji: '🍠', vi: 'khoai lang', topic: 'veggie', sentence: 'The sweet potato is yummy.', sentenceVi: 'Khoai lang ngon quá.' },
  { id: 'corn', word: 'corn', emoji: '🌽', vi: 'bắp ngô', topic: 'veggie', sentence: 'The corn is yellow.', sentenceVi: 'Bắp ngô màu vàng.' },
  { id: 'onion', word: 'onion', emoji: '🧅', vi: 'củ hành', topic: 'veggie', sentence: 'Onions make me cry.', sentenceVi: 'Củ hành làm tôi chảy nước mắt.' },
  { id: 'garlic', word: 'garlic', emoji: '🧄', vi: 'củ tỏi', topic: 'veggie', sentence: 'Garlic smells strong.', sentenceVi: 'Tỏi có mùi rất nồng.' },
  { id: 'mushroom', word: 'mushroom', emoji: '🍄', vi: 'cây nấm', topic: 'veggie', sentence: 'The mushroom soup is good.', sentenceVi: 'Súp nấm rất ngon.' },
  { id: 'pumpkin', word: 'pumpkin', emoji: '🎃', vi: 'quả bí đỏ', topic: 'veggie', sentence: 'The pumpkin is big.', sentenceVi: 'Quả bí đỏ rất to.' },
  { id: 'cucumber', word: 'cucumber', emoji: '🥒', vi: 'quả dưa chuột', topic: 'veggie', sentence: 'The cucumber is green.', sentenceVi: 'Quả dưa chuột màu xanh.' },
  { id: 'broccoli', word: 'broccoli', emoji: '🥦', vi: 'bông cải xanh', topic: 'veggie', sentence: 'Eat your broccoli.', sentenceVi: 'Ăn bông cải xanh nhé.' },
  { id: 'eggplant', word: 'eggplant', emoji: '🍆', vi: 'quả cà tím', topic: 'veggie', sentence: 'The eggplant is purple.', sentenceVi: 'Quả cà tím màu tím.' },
  { id: 'peas', word: 'peas', emoji: '🫛', vi: 'đậu Hà Lan', topic: 'veggie', sentence: 'Peas are small and green.', sentenceVi: 'Đậu Hà Lan nhỏ và xanh.' },
  { id: 'pepper', word: 'pepper', emoji: '🫑', vi: 'quả ớt chuông', topic: 'veggie', sentence: 'The pepper is green.', sentenceVi: 'Quả ớt chuông màu xanh.' },
  { id: 'lettuce', word: 'lettuce', emoji: '🥬', vi: 'rau xà lách', topic: 'veggie', sentence: 'Lettuce is good for salad.', sentenceVi: 'Xà lách rất hợp làm rau trộn.' },
  { id: 'beans', word: 'beans', emoji: '🫘', vi: 'hạt đậu', topic: 'veggie', sentence: 'I eat rice and beans.', sentenceVi: 'Tôi ăn cơm với đậu.' },
  { id: 'olive', word: 'olive', emoji: '🫒', vi: 'quả ô liu', topic: 'veggie', sentence: 'Olives are small.', sentenceVi: 'Quả ô liu nhỏ xíu.' },
  { id: 'peanut', word: 'peanut', emoji: '🥜', vi: 'hạt lạc', topic: 'veggie', sentence: 'I like peanut butter.', sentenceVi: 'Tôi thích bơ lạc.' },
  { id: 'chestnut', word: 'chestnut', emoji: '🌰', vi: 'hạt dẻ', topic: 'veggie', sentence: 'The chestnut is brown.', sentenceVi: 'Hạt dẻ màu nâu.' },

  // ===== Công nghệ (9) =====
  { id: 'email', word: 'email', emoji: '📧', vi: 'thư điện tử', topic: 'tech', sentence: 'I send an email.', sentenceVi: 'Tôi gửi thư điện tử.' },
  { id: 'wifi', word: 'wifi', emoji: '📶', vi: 'mạng wifi', topic: 'tech', sentence: 'The wifi is fast.', sentenceVi: 'Mạng wifi rất nhanh.' },
  { id: 'lightbulb', word: 'lightbulb', emoji: '💡', vi: 'bóng đèn', topic: 'tech', sentence: 'The lightbulb is bright.', sentenceVi: 'Bóng đèn rất sáng.' },
  { id: 'charger', word: 'charger', emoji: '🔌', vi: 'bộ sạc', topic: 'tech', sentence: 'I need a charger.', sentenceVi: 'Tôi cần bộ sạc.' },
  { id: 'screen', word: 'screen', emoji: '🖥️', vi: 'màn hình', topic: 'tech', sentence: 'The screen is big.', sentenceVi: 'Màn hình rất to.' },
  { id: 'internet', word: 'internet', emoji: '🌐', vi: 'mạng internet', topic: 'tech', sentence: 'I learn on the internet.', sentenceVi: 'Tôi học trên mạng internet.' },
  { id: 'videogame', word: 'video game', emoji: '🎮', vi: 'trò chơi điện tử', topic: 'tech', sentence: 'We play a video game.', sentenceVi: 'Chúng tôi chơi trò chơi điện tử.' },
  { id: 'speaker', word: 'speaker', emoji: '🔊', vi: 'cái loa', topic: 'tech', sentence: 'The speaker is loud.', sentenceVi: 'Cái loa kêu rất to.' },
  { id: 'smartwatch', word: 'smartwatch', emoji: '⌚', vi: 'đồng hồ thông minh', topic: 'tech', sentence: 'My smartwatch shows the time.', sentenceVi: 'Đồng hồ thông minh cho tôi xem giờ.' },
];

function shuffle(arr, rng) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Toàn bộ ngân hàng, hoặc lọc theo 1 chủ đề ('all' = tất cả). */
export function wordsForTopic(topicId) {
  return topicId === 'all' ? WORD_BANK : WORD_BANK.filter((w) => w.topic === topicId);
}

/**
 * Màn cao hơn: nhiều câu hỏi hơn mỗi vòng, và tỉ lệ vòng-CÂU (thay vì
 * vòng-TỪ ĐƠN) tăng dần — nhưng luôn ưu tiên TỪ ĐƠN nhiều hơn để bé không bị
 * "ngợp" vì câu dài xuất hiện quá dày, kể cả ở màn cao.
 */
export function tuningFor(levelIndex) {
  return {
    rounds: Math.min(10, 6 + Math.floor(levelIndex / 2)),
    choices: 4,
    sentenceChance: Math.min(0.45, 0.2 + levelIndex * 0.05),
  };
}

/** Tốc độ đọc phù hợp: câu dài đọc CHẬM hơn hẳn so với từ đơn ngắn. */
export function rateFor(mode) {
  return mode === 'sentence' ? 0.64 : 0.78;
}

/** Nội dung để đọc to (TTS) cho 1 vòng, theo đúng `mode` của vòng đó. */
export function promptFor(round) {
  return round.mode === 'sentence' ? round.target.sentence : round.target.word;
}

/** Chọn 1 câu hỏi: mục tiêu + (choices-1) mồi nhử, không trùng nhau, thứ tự xáo trộn. */
export function pickRound(pool, usedIds, choices, rng) {
  const avail = pool.filter((w) => !usedIds.has(w.id));
  const source = avail.length ? avail : pool;
  const target = source[Math.floor(rng() * source.length)];
  const distractorPool = pool.filter((w) => w.id !== target.id);
  const distractors = shuffle(distractorPool, rng).slice(0, Math.max(0, choices - 1));
  const options = shuffle([target, ...distractors], rng);
  return { target, options };
}

/** Khởi tạo 1 lượt chơi cho 1 chủ đề (hoặc 'all') ở màn levelIndex. */
export function makeGame(topicId, levelIndex, rng = Math.random) {
  const pool = wordsForTopic(topicId);
  const tune = tuningFor(levelIndex);
  const usedIds = new Set();
  const rounds = [];
  for (let i = 0; i < tune.rounds; i++) {
    const r = pickRound(pool, usedIds, tune.choices, rng);
    r.mode = rng() < tune.sentenceChance ? 'sentence' : 'word';
    usedIds.add(r.target.id);
    rounds.push(r);
  }
  return {
    topic: topicId,
    level: levelIndex,
    rounds,
    roundIndex: 0,
    score: 0,
    streak: 0,
    bestStreak: 0,
    correctCount: 0,
    over: false,
    won: false,
  };
}

export function currentRound(game) {
  return game.rounds[game.roundIndex];
}

/**
 * Bé chạm 1 lựa chọn `wordId`. Trả về sự kiện mô tả kết quả — không throw,
 * không làm gì nếu ván đã kết thúc hoặc không còn câu hỏi.
 *
 * Luật CHỌN LẠI: sai lần ĐẦU trong 1 câu → ev.retry = true, câu KHÔNG qua —
 * app đọc gợi ý (từ + nghĩa tiếng Việt) rồi cho bé chọn lại đúng 1 lần. Đúng
 * sau gợi ý vẫn được điểm (ít hơn, không tính chuỗi). Sai lần 2 mới lộ đáp án,
 * đọc giải thích đầy đủ rồi qua câu mới.
 */
export function chooseOption(game, wordId) {
  const ev = { correct: false, retry: false, gain: 0, streakBonus: 0, roundDone: false, gameDone: false, won: false };
  if (game.over) return ev;
  const round = currentRound(game);
  if (!round) return ev;

  if (wordId === round.target.id) {
    ev.correct = true;
    game.correctCount++;
    if (round.retried) {
      // Đúng sau khi được gợi ý: vẫn có điểm nhưng ít hơn, không tính chuỗi.
      game.score += 5;
      ev.gain = 5;
    } else {
      game.streak++;
      game.bestStreak = Math.max(game.bestStreak, game.streak);
      let gain = 10;
      if (game.streak > 0 && game.streak % 3 === 0) {
        gain += 10;
        ev.streakBonus = 10;
      }
      game.score += gain;
      ev.gain = gain;
    }
  } else if (!round.retried) {
    // Sai lần ĐẦU: đánh dấu để cho bé chọn lại, chuỗi về 0, câu KHÔNG qua.
    round.retried = true;
    game.streak = 0;
    ev.retry = true;
    return ev;
  }
  // (Sai lần 2: chuỗi đã về 0 từ lần sai đầu — chỉ việc lộ đáp án và qua câu.)

  ev.roundDone = true;
  game.roundIndex++;
  if (game.roundIndex >= game.rounds.length) {
    game.over = true;
    game.won = game.correctCount >= Math.ceil(game.rounds.length * 0.6);
    ev.gameDone = true;
    ev.won = game.won;
  }
  return ev;
}
