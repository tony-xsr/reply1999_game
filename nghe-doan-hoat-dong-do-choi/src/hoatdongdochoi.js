// Nghe & Đoán: Hoạt Động, Đồ Chơi & Nơi Vui Chơi — giai đoạn 8 (MẢNG MỚI thứ
// 3 ngoài kế hoạch 5×1000 ban đầu): hoạt động thể chất (động từ), đồ chơi,
// sở thích & hoạt động ngoài trời, địa điểm công cộng, nhạc cụ, giới từ vị trí
// (~77 mục). Trọng tâm
// vào ĐỘNG TỪ hành động và cụm từ giao tiếp thường dùng — đúng tinh thần gốc
// "quen các câu ngắn, cụm từ thường dùng" của toàn dự án. Lặp lại đúng khuôn
// mẫu đã kiểm chứng ở giai đoạn 1–7: mỗi mục có TỪ ĐƠN + CÂU NGẮN đi kèm, mỗi
// VÒNG chỉ chọn ngẫu nhiên 1 trong 2 kiểu — TRỘN LẪN, ưu tiên từ đơn nhiều
// hơn để bé không bị ngợp vì câu dài xuất hiện quá dày. Câu dài đọc chậm hơn
// hẳn so với từ đơn.
//
// Giới từ vị trí ban đầu bị bỏ vì "không vẽ được bằng 1 emoji" — nay đã bổ
// sung bằng SVG tự vẽ 2 vật thể (xem chủ đề Vị trí bên dưới). File thuần
// logic, không đụng DOM, test độc lập.

export const TOPICS = [
  { id: 'action', label: 'Hoạt động thể chất', icon: '🏃' },
  { id: 'toy', label: 'Đồ chơi', icon: '🧸' },
  { id: 'hobby', label: 'Sở thích ngoài trời', icon: '🏕️' },
  { id: 'place', label: 'Địa điểm công cộng', icon: '🏛️' },
  { id: 'music', label: 'Nhạc cụ', icon: '🎵' },
  { id: 'position', label: 'Vị trí', icon: '📦' },
];

export const WORD_BANK = [
  // ===== Hoạt động thể chất (20) =====
  { id: 'run', word: 'run', emoji: '🏃', vi: 'chạy', topic: 'action', sentence: 'I run in the park.', sentenceVi: 'Tôi chạy trong công viên.' },
  { id: 'jump', word: 'jump', emoji: '🐸', vi: 'nhảy', topic: 'action', sentence: 'The frog can jump high.', sentenceVi: 'Con ếch có thể nhảy rất cao.' },
  { id: 'swim', word: 'swim', emoji: '🏊', vi: 'bơi', topic: 'action', sentence: 'I swim every summer.', sentenceVi: 'Tôi bơi vào mỗi mùa hè.' },
  { id: 'climb', word: 'climb', emoji: '🧗', vi: 'leo trèo', topic: 'action', sentence: 'He can climb a tree.', sentenceVi: 'Cậu ấy có thể leo cây.' },
  { id: 'throw', word: 'throw', emoji: '🤾', vi: 'ném', topic: 'action', sentence: 'I throw the ball.', sentenceVi: 'Tôi ném quả bóng.' },
  { id: 'catch', word: 'catch', emoji: '🧤', vi: 'bắt', topic: 'action', sentence: 'I catch the ball.', sentenceVi: 'Tôi bắt quả bóng.' },
  { id: 'kick', word: 'kick', emoji: '⚽', vi: 'đá', topic: 'action', sentence: 'I kick the ball.', sentenceVi: 'Tôi đá quả bóng.' },
  { id: 'crawl', word: 'crawl', emoji: '🐛', vi: 'bò', topic: 'action', sentence: 'The baby can crawl.', sentenceVi: 'Em bé biết bò.' },
  { id: 'hop', word: 'hop', emoji: '🐰', vi: 'nhảy lò cò', topic: 'action', sentence: 'The rabbit can hop.', sentenceVi: 'Con thỏ biết nhảy.' },
  { id: 'fly', word: 'fly', emoji: '🦋', vi: 'bay', topic: 'action', sentence: 'Butterflies can fly.', sentenceVi: 'Bươm bướm biết bay.' },
  { id: 'push', word: 'push', emoji: '🛒', vi: 'đẩy', topic: 'action', sentence: 'I push the cart.', sentenceVi: 'Tôi đẩy xe đẩy.' },
  { id: 'pull', word: 'pull', emoji: '🪢', vi: 'kéo', topic: 'action', sentence: 'We pull the rope.', sentenceVi: 'Chúng tôi kéo sợi dây.' },
  { id: 'sit', word: 'sit', emoji: '🪑', vi: 'ngồi', topic: 'action', sentence: 'Please sit down.', sentenceVi: 'Xin hãy ngồi xuống.' },
  { id: 'stand', word: 'stand', emoji: '🧍', vi: 'đứng', topic: 'action', sentence: 'Please stand up.', sentenceVi: 'Xin hãy đứng lên.' },
  { id: 'fall', word: 'fall', emoji: '🍂', vi: 'ngã', topic: 'action', sentence: 'Be careful not to fall.', sentenceVi: 'Cẩn thận kẻo ngã.' },
  { id: 'ride', word: 'ride', emoji: '🚲', vi: 'đi xe', topic: 'action', sentence: 'I ride my bike.', sentenceVi: 'Tôi đi xe đạp.' },
  { id: 'dig', word: 'dig', emoji: '⛏️', vi: 'đào', topic: 'action', sentence: 'I dig in the sand.', sentenceVi: 'Tôi đào trong cát.' },
  { id: 'build', word: 'build', emoji: '🏗️', vi: 'xây dựng', topic: 'action', sentence: 'I build a sandcastle.', sentenceVi: 'Tôi xây lâu đài cát.' },
  { id: 'clap', word: 'clap', emoji: '👏', vi: 'vỗ tay', topic: 'action', sentence: 'We clap our hands.', sentenceVi: 'Chúng tôi vỗ tay.' },
  { id: 'lift', word: 'lift', emoji: '🏋️', vi: 'nâng', topic: 'action', sentence: 'He can lift the heavy box.', sentenceVi: 'Anh ấy có thể nâng chiếc hộp nặng.' },

  // ===== Đồ chơi (15) =====
  { id: 'teddybear', word: 'teddy bear', emoji: '🧸', vi: 'gấu bông', topic: 'toy', sentence: 'I sleep with my teddy bear.', sentenceVi: 'Tôi ngủ cùng gấu bông.' },
  { id: 'doll', word: 'doll', emoji: '🪆', vi: 'búp bê', topic: 'toy', sentence: 'She plays with a doll.', sentenceVi: 'Cô bé chơi với búp bê.' },
  { id: 'blocks', word: 'building blocks', emoji: '🧱', vi: 'khối gạch xếp hình', topic: 'toy', sentence: 'I build a tower with blocks.', sentenceVi: 'Tôi xây tháp bằng khối gạch xếp hình.' },
  { id: 'puzzle', word: 'puzzle', emoji: '🧩', vi: 'trò chơi ghép hình', topic: 'toy', sentence: 'I like puzzle games.', sentenceVi: 'Tôi thích trò chơi ghép hình.' },
  { id: 'kite', word: 'kite', emoji: '🪁', vi: 'con diều', topic: 'toy', sentence: 'I fly a kite.', sentenceVi: 'Tôi thả diều.' },
  { id: 'yoyo', word: 'yo-yo', emoji: '🪀', vi: 'yo-yo', topic: 'toy', sentence: 'I play with a yo-yo.', sentenceVi: 'Tôi chơi yo-yo.' },
  { id: 'robot', word: 'robot toy', emoji: '🤖', vi: 'người máy đồ chơi', topic: 'toy', sentence: 'I have a robot toy.', sentenceVi: 'Tôi có đồ chơi người máy.' },
  { id: 'drum', word: 'drum', emoji: '🥁', vi: 'cái trống', topic: 'toy', sentence: 'I play the drum.', sentenceVi: 'Tôi chơi trống.' },
  { id: 'rockinghorse', word: 'rocking horse', emoji: '🎠', vi: 'ngựa gỗ bập bênh', topic: 'toy', sentence: 'The rocking horse is fun.', sentenceVi: 'Ngựa gỗ bập bênh rất vui.' },
  { id: 'boardgame', word: 'board game', emoji: '🎲', vi: 'trò chơi cờ', topic: 'toy', sentence: 'We play a board game.', sentenceVi: 'Chúng tôi chơi trò chơi cờ.' },
  { id: 'toycar', word: 'toy car', emoji: '🚗', vi: 'xe hơi đồ chơi', topic: 'toy', sentence: 'He plays with a toy car.', sentenceVi: 'Cậu ấy chơi với xe hơi đồ chơi.' },
  { id: 'balloon', word: 'balloon', emoji: '🎈', vi: 'quả bóng bay', topic: 'toy', sentence: 'I hold a balloon.', sentenceVi: 'Tôi cầm quả bóng bay.' },
  { id: 'ball', word: 'ball', emoji: '🏀', vi: 'quả bóng', topic: 'toy', sentence: 'I play with a ball.', sentenceVi: 'Tôi chơi với quả bóng.' },
  { id: 'toytrain', word: 'toy train', emoji: '🚂', vi: 'xe lửa đồ chơi', topic: 'toy', sentence: 'The toy train goes fast.', sentenceVi: 'Xe lửa đồ chơi chạy rất nhanh.' },
  { id: 'dinosaurtoy', word: 'dinosaur toy', emoji: '🦖', vi: 'khủng long đồ chơi', topic: 'toy', sentence: 'My dinosaur toy is green.', sentenceVi: 'Khủng long đồ chơi của tôi màu xanh lá.' },

  // ===== Sở thích ngoài trời (11) =====
  { id: 'camping', word: 'camping', emoji: '⛺', vi: 'cắm trại', topic: 'hobby', sentence: 'We go camping in summer.', sentenceVi: 'Chúng tôi đi cắm trại vào mùa hè.' },
  { id: 'hiking', word: 'hiking', emoji: '🥾', vi: 'đi bộ đường dài', topic: 'hobby', sentence: 'I like hiking in the mountains.', sentenceVi: 'Tôi thích đi bộ đường dài trên núi.' },
  { id: 'gardening', word: 'gardening', emoji: '🌱', vi: 'làm vườn', topic: 'hobby', sentence: 'Grandma enjoys gardening.', sentenceVi: 'Bà thích làm vườn.' },
  { id: 'picnic', word: 'picnic', emoji: '🧺', vi: 'dã ngoại', topic: 'hobby', sentence: 'We have a picnic in the park.', sentenceVi: 'Chúng tôi dã ngoại trong công viên.' },
  { id: 'fishing', word: 'fishing', emoji: '🎣', vi: 'câu cá', topic: 'hobby', sentence: 'Grandpa likes fishing.', sentenceVi: 'Ông thích câu cá.' },
  { id: 'painting', word: 'painting', emoji: '🖼️', vi: 'vẽ tranh', topic: 'hobby', sentence: 'I enjoy painting.', sentenceVi: 'Tôi thích vẽ tranh.' },
  { id: 'birdwatching', word: 'bird watching', emoji: '🔭', vi: 'ngắm chim', topic: 'hobby', sentence: 'I like bird watching.', sentenceVi: 'Tôi thích ngắm chim.' },
  { id: 'stargazing', word: 'star gazing', emoji: '✨', vi: 'ngắm sao', topic: 'hobby', sentence: 'We go star gazing at night.', sentenceVi: 'Chúng tôi ngắm sao vào ban đêm.' },
  { id: 'skating', word: 'skating', emoji: '⛸️', vi: 'trượt băng', topic: 'hobby', sentence: 'I go skating in winter.', sentenceVi: 'Tôi trượt băng vào mùa đông.' },
  { id: 'skiing', word: 'skiing', emoji: '🎿', vi: 'trượt tuyết', topic: 'hobby', sentence: 'I go skiing in the mountains.', sentenceVi: 'Tôi trượt tuyết trên núi.' },
  { id: 'kayaking', word: 'kayaking', emoji: '🛶', vi: 'chèo thuyền kayak', topic: 'hobby', sentence: 'We go kayaking on the river.', sentenceVi: 'Chúng tôi chèo thuyền kayak trên sông.' },

  // ===== Địa điểm công cộng (12) =====
  { id: 'museum', word: 'museum', emoji: '🏛️', vi: 'bảo tàng', topic: 'place', sentence: 'We visit the museum.', sentenceVi: 'Chúng tôi đến thăm bảo tàng.' },
  { id: 'aquarium', word: 'aquarium', emoji: '🐠', vi: 'thủy cung', topic: 'place', sentence: 'I like the aquarium.', sentenceVi: 'Tôi thích thủy cung.' },
  { id: 'theater', word: 'theater', emoji: '🎭', vi: 'nhà hát', topic: 'place', sentence: 'We watch a play at the theater.', sentenceVi: 'Chúng tôi xem kịch ở nhà hát.' },
  { id: 'church', word: 'church', emoji: '⛪', vi: 'nhà thờ', topic: 'place', sentence: 'The church is old.', sentenceVi: 'Nhà thờ này rất cổ.' },
  { id: 'temple', word: 'temple', emoji: '🛕', vi: 'ngôi chùa', topic: 'place', sentence: 'We visit the temple.', sentenceVi: 'Chúng tôi đến thăm ngôi chùa.' },
  { id: 'trainstation', word: 'train station', emoji: '🚉', vi: 'ga tàu', topic: 'place', sentence: 'I wait at the train station.', sentenceVi: 'Tôi đợi ở ga tàu.' },
  { id: 'mall', word: 'mall', emoji: '🏬', vi: 'trung tâm thương mại', topic: 'place', sentence: 'We shop at the mall.', sentenceVi: 'Chúng tôi mua sắm ở trung tâm thương mại.' },
  { id: 'playground', word: 'playground', emoji: '🛝', vi: 'sân chơi', topic: 'place', sentence: 'Kids play at the playground.', sentenceVi: 'Trẻ em chơi ở sân chơi.' },
  { id: 'zoo', word: 'zoo', emoji: '🦁', vi: 'sở thú', topic: 'place', sentence: 'I see a lion at the zoo.', sentenceVi: 'Tôi thấy sư tử ở sở thú.' },
  { id: 'amusementpark', word: 'amusement park', emoji: '🎡', vi: 'công viên giải trí', topic: 'place', sentence: 'We go to the amusement park.', sentenceVi: 'Chúng tôi đi đến công viên giải trí.' },
  { id: 'hotel', word: 'hotel', emoji: '🏨', vi: 'khách sạn', topic: 'place', sentence: 'We stay at a hotel.', sentenceVi: 'Chúng tôi ở khách sạn.' },
  { id: 'bakery', word: 'bakery', emoji: '🥐', vi: 'tiệm bánh', topic: 'place', sentence: 'The bakery smells good.', sentenceVi: 'Tiệm bánh thơm quá.' },

  // ===== Nhạc cụ (12) =====
  { id: 'piano', word: 'piano', emoji: '🎹', vi: 'đàn piano', topic: 'music', sentence: 'She plays the piano.', sentenceVi: 'Cô ấy chơi đàn piano.' },
  { id: 'guitar', word: 'guitar', emoji: '🎸', vi: 'đàn ghi-ta', topic: 'music', sentence: 'He plays the guitar.', sentenceVi: 'Anh ấy chơi đàn ghi-ta.' },
  { id: 'violin', word: 'violin', emoji: '🎻', vi: 'đàn vĩ cầm', topic: 'music', sentence: 'The violin sounds beautiful.', sentenceVi: 'Đàn vĩ cầm nghe rất hay.' },
  { id: 'trumpet', word: 'trumpet', emoji: '🎺', vi: 'kèn trumpet', topic: 'music', sentence: 'The trumpet is loud.', sentenceVi: 'Kèn trumpet kêu rất to.' },
  { id: 'saxophone', word: 'saxophone', emoji: '🎷', vi: 'kèn saxophone', topic: 'music', sentence: 'Dad plays the saxophone.', sentenceVi: 'Bố chơi kèn saxophone.' },
  { id: 'accordion', word: 'accordion', emoji: '🪗', vi: 'đàn phong cầm', topic: 'music', sentence: 'The accordion is fun to play.', sentenceVi: 'Đàn phong cầm chơi rất vui.' },
  { id: 'banjo', word: 'banjo', emoji: '🪕', vi: 'đàn banjo', topic: 'music', sentence: 'He plays the banjo.', sentenceVi: 'Anh ấy chơi đàn banjo.' },
  { id: 'flute', word: 'flute', emoji: '🪈', vi: 'cây sáo', topic: 'music', sentence: 'I play the flute.', sentenceVi: 'Tôi thổi sáo.' },
  { id: 'maracas', word: 'maracas', emoji: '🪇', vi: 'lục lạc maracas', topic: 'music', sentence: 'We shake the maracas.', sentenceVi: 'Chúng tôi lắc lục lạc maracas.' },
  { id: 'bell', word: 'bell', emoji: '🔔', vi: 'cái chuông', topic: 'music', sentence: 'The bell rings.', sentenceVi: 'Chuông reo lên.' },
  { id: 'microphone', word: 'microphone', emoji: '🎤', vi: 'micrô', topic: 'music', sentence: 'Sing into the microphone.', sentenceVi: 'Hát vào micrô nhé.' },
  { id: 'headphones', word: 'headphones', emoji: '🎧', vi: 'tai nghe', topic: 'music', sentence: 'I listen with headphones.', sentenceVi: 'Tôi nghe bằng tai nghe.' },

  // ===== Vị trí (7) — giới từ chỉ vị trí, từng bị BỎ ở bản đầu vì "không vẽ
  // được bằng 1 emoji". Nay dùng SVG TỰ VẼ 2 vật thể (quả bóng đỏ + hộp nâu),
  // cùng kỹ thuật "mốc tham chiếu" đã kiểm chứng với cây gia đình ở giai đoạn 4:
  // cái hộp là mốc cố định trong cả 7 hình, chỉ vị trí quả bóng thay đổi. =====
  { id: 'in', word: 'in', emoji: '📥', img: 'images/pos-in.svg', vi: 'ở trong', topic: 'position', sentence: 'The ball is in the box.', sentenceVi: 'Quả bóng ở trong cái hộp.' },
  { id: 'on', word: 'on', emoji: '🔝', img: 'images/pos-on.svg', vi: 'ở trên', topic: 'position', sentence: 'The ball is on the box.', sentenceVi: 'Quả bóng ở trên cái hộp.' },
  { id: 'under', word: 'under', emoji: '🔽', img: 'images/pos-under.svg', vi: 'ở dưới', topic: 'position', sentence: 'The ball is under the box.', sentenceVi: 'Quả bóng ở dưới cái hộp.' },
  { id: 'behind', word: 'behind', emoji: '🔙', img: 'images/pos-behind.svg', vi: 'ở phía sau', topic: 'position', sentence: 'The ball is behind the box.', sentenceVi: 'Quả bóng ở phía sau cái hộp.' },
  { id: 'infrontof', word: 'in front of', emoji: '🔜', img: 'images/pos-infrontof.svg', vi: 'ở phía trước', topic: 'position', sentence: 'The ball is in front of the box.', sentenceVi: 'Quả bóng ở phía trước cái hộp.' },
  { id: 'nextto', word: 'next to', emoji: '↔️', img: 'images/pos-nextto.svg', vi: 'ở bên cạnh', topic: 'position', sentence: 'The ball is next to the box.', sentenceVi: 'Quả bóng ở bên cạnh cái hộp.' },
  { id: 'between', word: 'between', emoji: '⏺️', img: 'images/pos-between.svg', vi: 'ở giữa', topic: 'position', sentence: 'The ball is between the boxes.', sentenceVi: 'Quả bóng ở giữa hai cái hộp.' },
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
