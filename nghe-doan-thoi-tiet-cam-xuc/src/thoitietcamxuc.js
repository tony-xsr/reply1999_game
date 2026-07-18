// Nghe & Đoán: Thời Tiết, Màu Sắc & Cảm Xúc — giai đoạn 6 (MẢNG MỚI, ngoài kế
// hoạch 5×1000 ban đầu): thời tiết & mùa, màu sắc, cảm xúc, tính từ đối lập
// (~84 mục). Lặp lại đúng khuôn mẫu đã kiểm chứng ở giai đoạn 1–5: mỗi mục có
// TỪ ĐƠN + CÂU NGẮN đi kèm, mỗi VÒNG chỉ chọn ngẫu nhiên 1 trong 2 kiểu —
// TRỘN LẪN, ưu tiên từ đơn nhiều hơn để bé không bị ngợp vì câu dài xuất hiện
// quá dày. Câu dài đọc chậm hơn hẳn so với từ đơn.
//
// Lưu ý thiết kế riêng: đã CHỦ ĐỘNG bỏ "tomorrow"/"yesterday" (không có emoji
// nào diễn tả nổi khái niệm thời gian trừu tượng này — thử dùng mũi tên ⏮️⏭️
// nhưng bé không thể đoán nghĩa chỉ từ hình, phá vỡ mục đích của trò "nghe rồi
// đoán hình"), thà thiếu còn hơn nhồi 1 mục không thể đoán được bằng hình ảnh.
// File thuần logic, không đụng DOM, test độc lập.

export const TOPICS = [
  { id: 'weather', label: 'Thời tiết', icon: '🌦️' },
  { id: 'season', label: 'Mùa & Thời gian', icon: '📅' },
  { id: 'color', label: 'Màu sắc', icon: '🎨' },
  { id: 'emotion', label: 'Cảm xúc', icon: '😊' },
  { id: 'opposite', label: 'Tính từ đối lập', icon: '⚖️' },
];

export const WORD_BANK = [
  // ===== Thời tiết (17) =====
  { id: 'sun', word: 'sun', emoji: '☀️', vi: 'mặt trời', topic: 'weather', sentence: 'The sun is shining today.', sentenceVi: 'Hôm nay mặt trời đang chiếu sáng.' },
  { id: 'rain', word: 'rain', emoji: '🌧️', vi: 'mưa', topic: 'weather', sentence: 'It is raining outside.', sentenceVi: 'Bên ngoài trời đang mưa.' },
  { id: 'cloud', word: 'cloud', emoji: '☁️', vi: 'đám mây', topic: 'weather', sentence: 'The cloud is fluffy.', sentenceVi: 'Đám mây bồng bềnh.' },
  { id: 'snow', word: 'snow', emoji: '❄️', vi: 'tuyết', topic: 'weather', sentence: 'The snow is falling.', sentenceVi: 'Tuyết đang rơi.' },
  { id: 'wind', word: 'wind', emoji: '💨', vi: 'gió', topic: 'weather', sentence: 'The wind is blowing hard.', sentenceVi: 'Gió đang thổi mạnh.' },
  { id: 'storm', word: 'storm', emoji: '⛈️', vi: 'cơn bão', topic: 'weather', sentence: 'The storm is coming.', sentenceVi: 'Cơn bão đang tới.' },
  { id: 'rainbow', word: 'rainbow', emoji: '🌈', vi: 'cầu vồng', topic: 'weather', sentence: 'I see a rainbow in the sky.', sentenceVi: 'Tôi thấy cầu vồng trên bầu trời.' },
  { id: 'lightning', word: 'lightning', emoji: '⚡', vi: 'tia chớp', topic: 'weather', sentence: 'The lightning is bright.', sentenceVi: 'Tia chớp rất sáng.' },
  { id: 'fog', word: 'fog', emoji: '🌫️', vi: 'sương mù', topic: 'weather', sentence: 'The fog is thick this morning.', sentenceVi: 'Sương mù dày đặc sáng nay.' },
  { id: 'hot', word: 'hot', emoji: '🥵', vi: 'nóng', topic: 'weather', sentence: 'It is very hot today.', sentenceVi: 'Hôm nay trời rất nóng.' },
  { id: 'cold', word: 'cold', emoji: '🥶', vi: 'lạnh', topic: 'weather', sentence: 'It is very cold outside.', sentenceVi: 'Bên ngoài trời rất lạnh.' },
  { id: 'umbrella', word: 'umbrella', emoji: '☂️', vi: 'cái dù', topic: 'weather', sentence: 'I use an umbrella in the rain.', sentenceVi: 'Tôi dùng dù khi trời mưa.' },
  { id: 'thermometer', word: 'thermometer', emoji: '🌡️', vi: 'nhiệt kế', topic: 'weather', sentence: 'The thermometer shows the temperature.', sentenceVi: 'Nhiệt kế cho biết nhiệt độ.' },
  { id: 'tornado', word: 'tornado', emoji: '🌪️', vi: 'lốc xoáy', topic: 'weather', sentence: 'The tornado is dangerous.', sentenceVi: 'Lốc xoáy rất nguy hiểm.' },
  { id: 'humid', word: 'humid', emoji: '💦', vi: 'ẩm ướt', topic: 'weather', sentence: 'The air feels humid.', sentenceVi: 'Không khí cảm giác ẩm ướt.' },
  { id: 'sunrise', word: 'sunrise', emoji: '🌅', vi: 'bình minh', topic: 'weather', sentence: 'I watch the sunrise.', sentenceVi: 'Tôi ngắm bình minh.' },
  { id: 'sunset', word: 'sunset', emoji: '🌇', vi: 'hoàng hôn', topic: 'weather', sentence: 'The sunset is beautiful.', sentenceVi: 'Hoàng hôn rất đẹp.' },

  // ===== Mùa & Thời gian (14) =====
  { id: 'spring', word: 'spring', emoji: '🌸', vi: 'mùa xuân', topic: 'season', sentence: 'Flowers bloom in spring.', sentenceVi: 'Hoa nở vào mùa xuân.' },
  { id: 'summer', word: 'summer', emoji: '🏖️', vi: 'mùa hè', topic: 'season', sentence: 'I swim in summer.', sentenceVi: 'Tôi bơi vào mùa hè.' },
  { id: 'autumn', word: 'autumn', emoji: '🍂', vi: 'mùa thu', topic: 'season', sentence: 'Leaves fall in autumn.', sentenceVi: 'Lá rụng vào mùa thu.' },
  { id: 'winter', word: 'winter', emoji: '⛄', vi: 'mùa đông', topic: 'season', sentence: 'It snows in winter.', sentenceVi: 'Trời có tuyết vào mùa đông.' },
  { id: 'morning', word: 'morning', emoji: '☕', vi: 'buổi sáng', topic: 'season', sentence: 'I eat breakfast in the morning.', sentenceVi: 'Tôi ăn sáng vào buổi sáng.' },
  { id: 'afternoon', word: 'afternoon', emoji: '🌞', vi: 'buổi chiều', topic: 'season', sentence: 'I play in the afternoon.', sentenceVi: 'Tôi chơi vào buổi chiều.' },
  { id: 'evening', word: 'evening', emoji: '🌆', vi: 'buổi tối', topic: 'season', sentence: 'We eat dinner in the evening.', sentenceVi: 'Chúng tôi ăn tối vào buổi tối.' },
  { id: 'night', word: 'night', emoji: '🌃', vi: 'ban đêm', topic: 'season', sentence: 'I sleep at night.', sentenceVi: 'Tôi ngủ vào ban đêm.' },
  { id: 'today', word: 'today', emoji: '📆', vi: 'hôm nay', topic: 'season', sentence: 'Today is a nice day.', sentenceVi: 'Hôm nay là một ngày đẹp trời.' },
  { id: 'week', word: 'week', emoji: '🗓️', vi: 'tuần', topic: 'season', sentence: 'I have school five days a week.', sentenceVi: 'Tôi đi học năm ngày một tuần.' },
  { id: 'month', word: 'month', emoji: '📅', vi: 'tháng', topic: 'season', sentence: 'There are twelve months in a year.', sentenceVi: 'Một năm có mười hai tháng.' },
  { id: 'midnight', word: 'midnight', emoji: '🌙', vi: 'nửa đêm', topic: 'season', sentence: 'I sleep before midnight.', sentenceVi: 'Tôi ngủ trước nửa đêm.' },
  { id: 'weekend', word: 'weekend', emoji: '🎉', vi: 'cuối tuần', topic: 'season', sentence: 'I rest on the weekend.', sentenceVi: 'Tôi nghỉ ngơi vào cuối tuần.' },
  { id: 'birthday', word: 'birthday', emoji: '🎂', vi: 'sinh nhật', topic: 'season', sentence: 'It is my birthday today!', sentenceVi: 'Hôm nay là sinh nhật của tôi!' },

  // ===== Màu sắc (10) =====
  { id: 'red', word: 'red', emoji: '🔴', vi: 'màu đỏ', topic: 'color', sentence: 'The apple is red.', sentenceVi: 'Quả táo màu đỏ.' },
  { id: 'orange', word: 'orange', emoji: '🟠', vi: 'màu cam', topic: 'color', sentence: 'The pumpkin is orange.', sentenceVi: 'Quả bí ngô màu cam.' },
  { id: 'yellow', word: 'yellow', emoji: '🟡', vi: 'màu vàng', topic: 'color', sentence: 'The banana is yellow.', sentenceVi: 'Quả chuối màu vàng.' },
  { id: 'green', word: 'green', emoji: '🟢', vi: 'màu xanh lá', topic: 'color', sentence: 'The grass is green.', sentenceVi: 'Cỏ có màu xanh lá.' },
  { id: 'blue', word: 'blue', emoji: '🔵', vi: 'màu xanh dương', topic: 'color', sentence: 'The sky is blue.', sentenceVi: 'Bầu trời màu xanh dương.' },
  { id: 'purple', word: 'purple', emoji: '🟣', vi: 'màu tím', topic: 'color', sentence: 'The grapes are purple.', sentenceVi: 'Quả nho màu tím.' },
  { id: 'brown', word: 'brown', emoji: '🟤', vi: 'màu nâu', topic: 'color', sentence: 'The chocolate is brown.', sentenceVi: 'Sô-cô-la màu nâu.' },
  { id: 'black', word: 'black', emoji: '⚫', vi: 'màu đen', topic: 'color', sentence: 'The night sky is black.', sentenceVi: 'Bầu trời đêm màu đen.' },
  { id: 'white', word: 'white', emoji: '⚪', vi: 'màu trắng', topic: 'color', sentence: 'The snow is white.', sentenceVi: 'Tuyết có màu trắng.' },
  { id: 'pink', word: 'pink', emoji: '🩷', vi: 'màu hồng', topic: 'color', sentence: 'The flower is pink.', sentenceVi: 'Bông hoa màu hồng.' },
  { id: 'gray', word: 'gray', emoji: '🩶', vi: 'màu xám', topic: 'color', sentence: 'The elephant is gray.', sentenceVi: 'Con voi màu xám.' },
  { id: 'lightblue', word: 'light blue', emoji: '🩵', vi: 'màu xanh nhạt', topic: 'color', sentence: 'The sky is light blue.', sentenceVi: 'Bầu trời màu xanh nhạt.' },

  // ===== Cảm xúc (20) =====
  { id: 'happy', word: 'happy', emoji: '😀', vi: 'vui vẻ', topic: 'emotion', sentence: 'I am happy today.', sentenceVi: 'Hôm nay tôi vui vẻ.' },
  { id: 'sad', word: 'sad', emoji: '😢', vi: 'buồn', topic: 'emotion', sentence: 'She feels sad.', sentenceVi: 'Cô ấy cảm thấy buồn.' },
  { id: 'angry', word: 'angry', emoji: '😠', vi: 'tức giận', topic: 'emotion', sentence: 'He is angry now.', sentenceVi: 'Anh ấy đang tức giận.' },
  { id: 'scared', word: 'scared', emoji: '😱', vi: 'sợ hãi', topic: 'emotion', sentence: 'The child is scared.', sentenceVi: 'Đứa trẻ đang sợ hãi.' },
  { id: 'surprised', word: 'surprised', emoji: '😲', vi: 'ngạc nhiên', topic: 'emotion', sentence: 'I am surprised!', sentenceVi: 'Tôi ngạc nhiên quá!' },
  { id: 'excited', word: 'excited', emoji: '🤩', vi: 'hào hứng', topic: 'emotion', sentence: 'We are excited to play.', sentenceVi: 'Chúng tôi hào hứng đi chơi.' },
  { id: 'tired', word: 'tired', emoji: '😴', vi: 'mệt mỏi', topic: 'emotion', sentence: 'I am tired now.', sentenceVi: 'Tôi đang mệt mỏi.' },
  { id: 'sleepy', word: 'sleepy', emoji: '🥱', vi: 'buồn ngủ', topic: 'emotion', sentence: 'The baby is sleepy.', sentenceVi: 'Em bé đang buồn ngủ.' },
  { id: 'bored', word: 'bored', emoji: '😑', vi: 'chán', topic: 'emotion', sentence: 'I feel bored.', sentenceVi: 'Tôi cảm thấy chán.' },
  { id: 'proud', word: 'proud', emoji: '🥹', vi: 'tự hào', topic: 'emotion', sentence: 'Mom is proud of me.', sentenceVi: 'Mẹ tự hào về tôi.' },
  { id: 'shy', word: 'shy', emoji: '😳', vi: 'ngại ngùng', topic: 'emotion', sentence: 'The girl is shy.', sentenceVi: 'Cô bé ngại ngùng.' },
  { id: 'worried', word: 'worried', emoji: '😟', vi: 'lo lắng', topic: 'emotion', sentence: 'Mom is worried.', sentenceVi: 'Mẹ đang lo lắng.' },
  { id: 'brave', word: 'brave', emoji: '🦁', vi: 'dũng cảm', topic: 'emotion', sentence: 'The little boy is brave.', sentenceVi: 'Cậu bé rất dũng cảm.' },
  { id: 'calm', word: 'calm', emoji: '😌', vi: 'bình tĩnh', topic: 'emotion', sentence: 'Stay calm, please.', sentenceVi: 'Hãy giữ bình tĩnh nhé.' },
  { id: 'confused', word: 'confused', emoji: '😕', vi: 'bối rối', topic: 'emotion', sentence: 'I am confused.', sentenceVi: 'Tôi đang bối rối.' },
  { id: 'love', word: 'love', emoji: '🥰', vi: 'yêu thương', topic: 'emotion', sentence: 'I love my family.', sentenceVi: 'Tôi yêu thương gia đình.' },
  { id: 'laugh', word: 'laugh', emoji: '😂', vi: 'cười lớn', topic: 'emotion', sentence: 'We laugh together.', sentenceVi: 'Chúng tôi cùng cười lớn.' },
  { id: 'cry', word: 'cry', emoji: '😭', vi: 'khóc', topic: 'emotion', sentence: 'The baby starts to cry.', sentenceVi: 'Em bé bắt đầu khóc.' },
  { id: 'nervous', word: 'nervous', emoji: '😬', vi: 'hồi hộp, lo lắng', topic: 'emotion', sentence: 'I feel nervous before the test.', sentenceVi: 'Tôi thấy hồi hộp trước bài kiểm tra.' },
  { id: 'silly', word: 'silly', emoji: '🤪', vi: 'ngộ nghĩnh, hài hước', topic: 'emotion', sentence: 'The clown is silly.', sentenceVi: 'Chú hề thật ngộ nghĩnh.' },

  // ===== Tính từ đối lập (21) =====
  { id: 'big', word: 'big', emoji: '🐘', vi: 'to lớn', topic: 'opposite', sentence: 'The elephant is big.', sentenceVi: 'Con voi to lớn.' },
  { id: 'small', word: 'small', emoji: '🐜', vi: 'nhỏ bé', topic: 'opposite', sentence: 'The ant is small.', sentenceVi: 'Con kiến nhỏ bé.' },
  { id: 'fast', word: 'fast', emoji: '🐆', vi: 'nhanh', topic: 'opposite', sentence: 'The cheetah is fast.', sentenceVi: 'Con báo chạy nhanh.' },
  { id: 'slow', word: 'slow', emoji: '🐢', vi: 'chậm', topic: 'opposite', sentence: 'The turtle is slow.', sentenceVi: 'Con rùa đi chậm.' },
  { id: 'long', word: 'long', emoji: '🐍', vi: 'dài', topic: 'opposite', sentence: 'The snake is long.', sentenceVi: 'Con rắn dài.' },
  { id: 'heavy', word: 'heavy', emoji: '🏋️', vi: 'nặng', topic: 'opposite', sentence: 'The rock is heavy.', sentenceVi: 'Tảng đá rất nặng.' },
  { id: 'light', word: 'light', emoji: '🪶', vi: 'nhẹ', topic: 'opposite', sentence: 'The feather is light.', sentenceVi: 'Chiếc lông rất nhẹ.' },
  { id: 'full', word: 'full', emoji: '🥤', vi: 'đầy', topic: 'opposite', sentence: 'The cup is full.', sentenceVi: 'Cái ly đầy nước.' },
  { id: 'empty', word: 'empty', emoji: '🕳️', vi: 'trống rỗng', topic: 'opposite', sentence: 'The box is empty.', sentenceVi: 'Cái hộp trống rỗng.' },
  { id: 'clean', word: 'clean', emoji: '🧼', vi: 'sạch sẽ', topic: 'opposite', sentence: 'The room is clean.', sentenceVi: 'Căn phòng sạch sẽ.' },
  { id: 'dirty', word: 'dirty', emoji: '🐷', vi: 'bẩn', topic: 'opposite', sentence: 'The pig is dirty.', sentenceVi: 'Con lợn bị bẩn.' },
  { id: 'wet', word: 'wet', emoji: '💧', vi: 'ướt', topic: 'opposite', sentence: 'My clothes are wet.', sentenceVi: 'Quần áo của tôi bị ướt.' },
  { id: 'dry', word: 'dry', emoji: '🏜️', vi: 'khô', topic: 'opposite', sentence: 'The desert is dry.', sentenceVi: 'Sa mạc rất khô.' },
  { id: 'new', word: 'new', emoji: '✨', vi: 'mới', topic: 'opposite', sentence: 'I have a new toy.', sentenceVi: 'Tôi có một món đồ chơi mới.' },
  { id: 'old', word: 'old', emoji: '👴', vi: 'cũ', topic: 'opposite', sentence: 'The book is old.', sentenceVi: 'Quyển sách này cũ.' },
  { id: 'strong', word: 'strong', emoji: '💪', vi: 'khỏe mạnh', topic: 'opposite', sentence: 'He is very strong.', sentenceVi: 'Anh ấy rất khỏe mạnh.' },
  { id: 'weak', word: 'weak', emoji: '🥀', vi: 'yếu ớt', topic: 'opposite', sentence: 'The flower looks weak.', sentenceVi: 'Bông hoa trông yếu ớt.' },
  { id: 'open', word: 'open', emoji: '🔓', vi: 'mở', topic: 'opposite', sentence: 'The door is open.', sentenceVi: 'Cánh cửa đang mở.' },
  { id: 'closed', word: 'closed', emoji: '🔒', vi: 'đóng', topic: 'opposite', sentence: 'The shop is closed.', sentenceVi: 'Cửa hàng đã đóng cửa.' },
  { id: 'loud', word: 'loud', emoji: '📢', vi: 'ồn ào', topic: 'opposite', sentence: 'The music is too loud.', sentenceVi: 'Nhạc to quá.' },
  { id: 'quiet', word: 'quiet', emoji: '🤫', vi: 'yên lặng', topic: 'opposite', sentence: 'Please be quiet.', sentenceVi: 'Xin hãy giữ yên lặng.' },
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
