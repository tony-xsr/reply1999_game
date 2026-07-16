// Nghe & Đoán Tiếng Anh — giai đoạn 1 của dự án "5x1000 từ vựng": chủ đề
// trái cây, món ăn, quán ăn & mua sắm, ngày lễ, giải trí & phim ảnh (~100 mục).
// Mỗi mục có 1 CÂU NGẮN tiếng Anh đi kèm (không chỉ từ đơn) để bé quen phản xạ
// nghe cả câu — đúng tinh thần "học từ vựng qua ngữ cảnh giao tiếp". Máy đọc
// câu bằng giọng en-US thật, bé chạm đúng hình trong 4 lựa chọn. File thuần
// logic, không đụng DOM, test độc lập.

export const TOPICS = [
  { id: 'fruit', label: 'Trái cây', icon: '🍎' },
  { id: 'food', label: 'Món ăn', icon: '🍜' },
  { id: 'dining', label: 'Quán ăn & Mua sắm', icon: '🛍️' },
  { id: 'holiday', label: 'Ngày lễ', icon: '🎉' },
  { id: 'fun', label: 'Giải trí', icon: '🎬' },
];

export const WORD_BANK = [
  // ===== Trái cây (18) =====
  { id: 'apple', emoji: '🍎', vi: 'quả táo', topic: 'fruit', sentence: 'I eat an apple.', sentenceVi: 'Tôi ăn một quả táo.' },
  { id: 'banana', emoji: '🍌', vi: 'quả chuối', topic: 'fruit', sentence: 'I like bananas.', sentenceVi: 'Tôi thích chuối.' },
  { id: 'orange', emoji: '🍊', vi: 'quả cam', topic: 'fruit', sentence: 'The orange is sweet.', sentenceVi: 'Quả cam ngọt.' },
  { id: 'grape', emoji: '🍇', vi: 'quả nho', topic: 'fruit', sentence: 'She eats grapes.', sentenceVi: 'Cô ấy ăn nho.' },
  { id: 'watermelon', emoji: '🍉', vi: 'dưa hấu', topic: 'fruit', sentence: 'Watermelon is cold.', sentenceVi: 'Dưa hấu mát lạnh.' },
  { id: 'strawberry', emoji: '🍓', vi: 'dâu tây', topic: 'fruit', sentence: 'I love strawberries.', sentenceVi: 'Tôi thích dâu tây.' },
  { id: 'mango', emoji: '🥭', vi: 'quả xoài', topic: 'fruit', sentence: 'The mango is yellow.', sentenceVi: 'Quả xoài màu vàng.' },
  { id: 'pineapple', emoji: '🍍', vi: 'quả dứa', topic: 'fruit', sentence: 'Pineapple is sour.', sentenceVi: 'Dứa có vị chua.' },
  { id: 'peach', emoji: '🍑', vi: 'quả đào', topic: 'fruit', sentence: 'This peach is soft.', sentenceVi: 'Quả đào này mềm.' },
  { id: 'pear', emoji: '🍐', vi: 'quả lê', topic: 'fruit', sentence: 'I want a pear.', sentenceVi: 'Tôi muốn một quả lê.' },
  { id: 'lemon', emoji: '🍋', vi: 'quả chanh', topic: 'fruit', sentence: 'Lemon is sour.', sentenceVi: 'Chanh có vị chua.' },
  { id: 'cherry', emoji: '🍒', vi: 'quả anh đào', topic: 'fruit', sentence: 'Cherries are red.', sentenceVi: 'Quả anh đào màu đỏ.' },
  { id: 'coconut', emoji: '🥥', vi: 'quả dừa', topic: 'fruit', sentence: 'I drink coconut water.', sentenceVi: 'Tôi uống nước dừa.' },
  { id: 'kiwi', emoji: '🥝', vi: 'quả kiwi', topic: 'fruit', sentence: 'Kiwi is green inside.', sentenceVi: 'Bên trong quả kiwi màu xanh.' },
  { id: 'avocado', emoji: '🥑', vi: 'quả bơ', topic: 'fruit', sentence: 'Avocado is healthy.', sentenceVi: 'Bơ rất tốt cho sức khỏe.' },
  { id: 'melon', emoji: '🍈', vi: 'dưa lê', topic: 'fruit', sentence: 'The melon is big.', sentenceVi: 'Quả dưa lê to.' },
  { id: 'blueberry', emoji: '🫐', vi: 'việt quất', topic: 'fruit', sentence: 'Blueberries are tiny.', sentenceVi: 'Việt quất rất nhỏ.' },
  { id: 'tomato', emoji: '🍅', vi: 'cà chua', topic: 'fruit', sentence: 'The tomato is red.', sentenceVi: 'Quả cà chua màu đỏ.' },

  // ===== Món ăn (22) =====
  { id: 'rice', emoji: '🍚', vi: 'cơm', topic: 'food', sentence: 'I eat rice every day.', sentenceVi: 'Tôi ăn cơm mỗi ngày.' },
  { id: 'bread', emoji: '🍞', vi: 'bánh mì', topic: 'food', sentence: 'I want some bread.', sentenceVi: 'Tôi muốn một ít bánh mì.' },
  { id: 'noodles', emoji: '🍜', vi: 'mì', topic: 'food', sentence: 'Noodles are hot.', sentenceVi: 'Mì đang nóng.' },
  { id: 'soup', emoji: '🍲', vi: 'súp', topic: 'food', sentence: 'The soup smells good.', sentenceVi: 'Súp có mùi thơm.' },
  { id: 'chicken', emoji: '🍗', vi: 'thịt gà', topic: 'food', sentence: 'I like chicken.', sentenceVi: 'Tôi thích thịt gà.' },
  { id: 'beef', emoji: '🥩', vi: 'thịt bò', topic: 'food', sentence: 'Beef is tasty.', sentenceVi: 'Thịt bò rất ngon.' },
  { id: 'fish', emoji: '🐟', vi: 'cá', topic: 'food', sentence: 'We eat fish for lunch.', sentenceVi: 'Chúng tôi ăn cá vào bữa trưa.' },
  { id: 'egg', emoji: '🥚', vi: 'trứng', topic: 'food', sentence: 'I eat an egg.', sentenceVi: 'Tôi ăn một quả trứng.' },
  { id: 'milk', emoji: '🥛', vi: 'sữa', topic: 'food', sentence: 'I drink milk in the morning.', sentenceVi: 'Tôi uống sữa vào buổi sáng.' },
  { id: 'cheese', emoji: '🧀', vi: 'phô mai', topic: 'food', sentence: 'This cheese is yellow.', sentenceVi: 'Miếng phô mai này màu vàng.' },
  { id: 'butter', emoji: '🧈', vi: 'bơ (sữa)', topic: 'food', sentence: 'Spread the butter on bread.', sentenceVi: 'Phết bơ lên bánh mì.' },
  { id: 'salt', emoji: '🧂', vi: 'muối', topic: 'food', sentence: 'Add a little salt.', sentenceVi: 'Thêm một ít muối.' },
  { id: 'honey', emoji: '🍯', vi: 'mật ong', topic: 'food', sentence: 'Honey is very sweet.', sentenceVi: 'Mật ong rất ngọt.' },
  { id: 'sandwich', emoji: '🥪', vi: 'bánh mì kẹp', topic: 'food', sentence: 'I want a sandwich.', sentenceVi: 'Tôi muốn một cái bánh mì kẹp.' },
  { id: 'hamburger', emoji: '🍔', vi: 'bánh hamburger', topic: 'food', sentence: 'She likes hamburgers.', sentenceVi: 'Cô ấy thích hamburger.' },
  { id: 'pizza', emoji: '🍕', vi: 'bánh pizza', topic: 'food', sentence: 'Let’s order pizza.', sentenceVi: 'Chúng ta gọi pizza nhé.' },
  { id: 'hotdog', emoji: '🌭', vi: 'xúc xích kẹp', topic: 'food', sentence: 'I want a hot dog.', sentenceVi: 'Tôi muốn một cái hot dog.' },
  { id: 'fries', emoji: '🍟', vi: 'khoai tây chiên', topic: 'food', sentence: 'French fries are crispy.', sentenceVi: 'Khoai tây chiên giòn tan.' },
  { id: 'icecream', emoji: '🍦', vi: 'kem', topic: 'food', sentence: 'I love ice cream.', sentenceVi: 'Tôi thích kem.' },
  { id: 'cake', emoji: '🍰', vi: 'bánh ngọt', topic: 'food', sentence: 'This cake is delicious.', sentenceVi: 'Chiếc bánh này rất ngon.' },
  { id: 'cookie', emoji: '🍪', vi: 'bánh quy', topic: 'food', sentence: 'Can I have a cookie?', sentenceVi: 'Con xin một cái bánh quy được không?' },
  { id: 'candy', emoji: '🍬', vi: 'kẹo', topic: 'food', sentence: 'I got some candy.', sentenceVi: 'Tôi có một ít kẹo.' },

  // ===== Quán ăn & Mua sắm (20) =====
  { id: 'restaurant', emoji: '🍽️', vi: 'nhà hàng', topic: 'dining', sentence: 'We eat at a restaurant.', sentenceVi: 'Chúng tôi ăn ở nhà hàng.' },
  { id: 'menu', emoji: '📋', vi: 'thực đơn', topic: 'dining', sentence: 'Please give me the menu.', sentenceVi: 'Cho tôi xin thực đơn.' },
  { id: 'cook', emoji: '👨‍🍳', vi: 'đầu bếp', topic: 'dining', sentence: 'The cook makes good food.', sentenceVi: 'Đầu bếp nấu ăn ngon.' },
  { id: 'chair', emoji: '🪑', vi: 'cái ghế', topic: 'dining', sentence: 'Sit on the chair, please.', sentenceVi: 'Mời ngồi vào ghế.' },
  { id: 'spoon', emoji: '🥄', vi: 'cái muỗng', topic: 'dining', sentence: 'I eat soup with a spoon.', sentenceVi: 'Tôi ăn súp bằng muỗng.' },
  { id: 'fork', emoji: '🍴', vi: 'cái nĩa', topic: 'dining', sentence: 'Use a fork, please.', sentenceVi: 'Hãy dùng nĩa nhé.' },
  { id: 'knife', emoji: '🔪', vi: 'con dao', topic: 'dining', sentence: 'Be careful with the knife.', sentenceVi: 'Cẩn thận với con dao.' },
  { id: 'bowl', emoji: '🥣', vi: 'cái tô', topic: 'dining', sentence: 'Put rice in the bowl.', sentenceVi: 'Cho cơm vào tô.' },
  { id: 'cup', emoji: '☕', vi: 'cái tách', topic: 'dining', sentence: 'This is my cup.', sentenceVi: 'Đây là tách của tôi.' },
  { id: 'bill', emoji: '🧾', vi: 'hóa đơn', topic: 'dining', sentence: 'Can I have the bill, please?', sentenceVi: 'Cho tôi xin hóa đơn nhé.' },
  { id: 'order', emoji: '📝', vi: 'gọi món', topic: 'dining', sentence: 'I would like to order.', sentenceVi: 'Tôi muốn gọi món.' },
  { id: 'delicious', emoji: '😋', vi: 'ngon', topic: 'dining', sentence: 'This is delicious!', sentenceVi: 'Món này ngon quá!' },
  { id: 'hungry', emoji: '🤤', vi: 'đói bụng', topic: 'dining', sentence: 'I am hungry.', sentenceVi: 'Tôi đói bụng.' },
  { id: 'thirsty', emoji: '🥤', vi: 'khát nước', topic: 'dining', sentence: 'I am thirsty.', sentenceVi: 'Tôi khát nước.' },
  { id: 'shop', emoji: '🏪', vi: 'cửa hàng', topic: 'dining', sentence: 'Let’s go to the shop.', sentenceVi: 'Chúng ta đi đến cửa hàng nhé.' },
  { id: 'market', emoji: '🛒', vi: 'chợ / siêu thị', topic: 'dining', sentence: 'Mom goes to the market.', sentenceVi: 'Mẹ đi chợ.' },
  { id: 'price', emoji: '🏷️', vi: 'giá tiền', topic: 'dining', sentence: 'What is the price?', sentenceVi: 'Giá bao nhiêu vậy?' },
  { id: 'money', emoji: '💵', vi: 'tiền', topic: 'dining', sentence: 'I need some money.', sentenceVi: 'Tôi cần một ít tiền.' },
  { id: 'buy', emoji: '🛍️', vi: 'mua sắm', topic: 'dining', sentence: 'I want to buy this.', sentenceVi: 'Tôi muốn mua cái này.' },
  { id: 'pay', emoji: '💳', vi: 'thanh toán', topic: 'dining', sentence: 'How much do I pay?', sentenceVi: 'Tôi phải trả bao nhiêu?' },

  // ===== Ngày lễ (20) =====
  { id: 'newyear', emoji: '🎊', vi: 'năm mới', topic: 'holiday', sentence: 'Happy New Year!', sentenceVi: 'Chúc mừng năm mới!' },
  { id: 'christmas', emoji: '🎄', vi: 'Giáng Sinh', topic: 'holiday', sentence: 'Merry Christmas!', sentenceVi: 'Chúc mừng Giáng Sinh!' },
  { id: 'birthday', emoji: '🎂', vi: 'sinh nhật', topic: 'holiday', sentence: 'Happy birthday to you!', sentenceVi: 'Chúc mừng sinh nhật bạn!' },
  { id: 'tet', emoji: '🧧', vi: 'Tết', topic: 'holiday', sentence: 'We celebrate Tet in Vietnam.', sentenceVi: 'Chúng tôi đón Tết ở Việt Nam.' },
  { id: 'midautumn', emoji: '🌕', vi: 'Trung Thu', topic: 'holiday', sentence: 'The moon is bright at Mid-Autumn.', sentenceVi: 'Trăng sáng vào Tết Trung Thu.' },
  { id: 'lantern', emoji: '🏮', vi: 'lồng đèn', topic: 'holiday', sentence: 'I carry a lantern.', sentenceVi: 'Tôi cầm một cái lồng đèn.' },
  { id: 'fireworks', emoji: '🎆', vi: 'pháo hoa', topic: 'holiday', sentence: 'The fireworks are beautiful.', sentenceVi: 'Pháo hoa rất đẹp.' },
  { id: 'candle', emoji: '🕯️', vi: 'nến', topic: 'holiday', sentence: 'Blow out the candle.', sentenceVi: 'Thổi tắt nến đi.' },
  { id: 'gift', emoji: '🎁', vi: 'món quà', topic: 'holiday', sentence: 'This gift is for you.', sentenceVi: 'Món quà này dành cho bạn.' },
  { id: 'party', emoji: '🎉', vi: 'bữa tiệc', topic: 'holiday', sentence: 'Let’s have a party!', sentenceVi: 'Chúng ta tổ chức tiệc nhé!' },
  { id: 'balloon', emoji: '🎈', vi: 'bong bóng', topic: 'holiday', sentence: 'I have a red balloon.', sentenceVi: 'Tôi có một quả bong bóng đỏ.' },
  { id: 'costume', emoji: '🎭', vi: 'trang phục hóa trang', topic: 'holiday', sentence: 'I wear a fun costume.', sentenceVi: 'Tôi mặc một bộ trang phục vui nhộn.' },
  { id: 'vacation', emoji: '🏖️', vi: 'kỳ nghỉ', topic: 'holiday', sentence: 'We are on vacation.', sentenceVi: 'Chúng tôi đang đi nghỉ.' },
  { id: 'celebrate', emoji: '🥳', vi: 'ăn mừng', topic: 'holiday', sentence: 'Let’s celebrate together!', sentenceVi: 'Chúng ta cùng ăn mừng nhé!' },
  { id: 'wish', emoji: '⭐', vi: 'điều ước', topic: 'holiday', sentence: 'Make a wish!', sentenceVi: 'Hãy ước một điều đi!' },
  { id: 'luckymoney', emoji: '💰', vi: 'lì xì', topic: 'holiday', sentence: 'I get lucky money.', sentenceVi: 'Tôi được lì xì.' },
  { id: 'decoration', emoji: '✨', vi: 'trang trí', topic: 'holiday', sentence: 'The house has nice decorations.', sentenceVi: 'Ngôi nhà được trang trí đẹp.' },
  { id: 'calendar', emoji: '📅', vi: 'lịch', topic: 'holiday', sentence: 'Look at the calendar.', sentenceVi: 'Hãy nhìn vào tờ lịch.' },
  { id: 'holiday', emoji: '🌴', vi: 'ngày lễ', topic: 'holiday', sentence: 'Today is a holiday.', sentenceVi: 'Hôm nay là ngày lễ.' },
  { id: 'card', emoji: '💌', vi: 'thiệp', topic: 'holiday', sentence: 'I send a card to you.', sentenceVi: 'Tôi gửi thiệp cho bạn.' },

  // ===== Giải trí & phim ảnh (20) =====
  { id: 'movie', emoji: '🎬', vi: 'bộ phim', topic: 'fun', sentence: 'Let’s watch a movie.', sentenceVi: 'Chúng ta xem phim nhé.' },
  { id: 'cinema', emoji: '🎦', vi: 'rạp chiếu phim', topic: 'fun', sentence: 'We go to the cinema.', sentenceVi: 'Chúng tôi đi đến rạp chiếu phim.' },
  { id: 'ticket', emoji: '🎫', vi: 'vé', topic: 'fun', sentence: 'I have two tickets.', sentenceVi: 'Tôi có hai cái vé.' },
  { id: 'popcorn', emoji: '🍿', vi: 'bắp rang', topic: 'fun', sentence: 'I want some popcorn.', sentenceVi: 'Tôi muốn một ít bắp rang.' },
  { id: 'tv', emoji: '📺', vi: 'ti vi', topic: 'fun', sentence: 'I watch TV at home.', sentenceVi: 'Tôi xem ti vi ở nhà.' },
  { id: 'song', emoji: '🎵', vi: 'bài hát', topic: 'fun', sentence: 'I like this song.', sentenceVi: 'Tôi thích bài hát này.' },
  { id: 'music', emoji: '🎶', vi: 'âm nhạc', topic: 'fun', sentence: 'She listens to music.', sentenceVi: 'Cô ấy nghe nhạc.' },
  { id: 'dance', emoji: '💃', vi: 'khiêu vũ', topic: 'fun', sentence: 'Let’s dance together.', sentenceVi: 'Chúng ta cùng nhảy múa nhé.' },
  { id: 'game', emoji: '🎮', vi: 'trò chơi', topic: 'fun', sentence: 'I play a game.', sentenceVi: 'Tôi chơi một trò chơi.' },
  { id: 'toy', emoji: '🧸', vi: 'đồ chơi', topic: 'fun', sentence: 'This is my favorite toy.', sentenceVi: 'Đây là món đồ chơi yêu thích của tôi.' },
  { id: 'park', emoji: '🎡', vi: 'công viên giải trí', topic: 'fun', sentence: 'We go to the park.', sentenceVi: 'Chúng tôi đi đến công viên giải trí.' },
  { id: 'zoo', emoji: '🦁', vi: 'sở thú', topic: 'fun', sentence: 'I see a lion at the zoo.', sentenceVi: 'Tôi thấy sư tử ở sở thú.' },
  { id: 'circus', emoji: '🎪', vi: 'rạp xiếc', topic: 'fun', sentence: 'The circus is exciting.', sentenceVi: 'Rạp xiếc rất thú vị.' },
  { id: 'magic', emoji: '🪄', vi: 'phép thuật', topic: 'fun', sentence: 'The magician does magic.', sentenceVi: 'Ảo thuật gia làm phép thuật.' },
  { id: 'clown', emoji: '🤡', vi: 'chú hề', topic: 'fun', sentence: 'The clown makes us laugh.', sentenceVi: 'Chú hề làm chúng tôi cười.' },
  { id: 'rollercoaster', emoji: '🎢', vi: 'tàu lượn siêu tốc', topic: 'fun', sentence: 'The roller coaster is fast.', sentenceVi: 'Tàu lượn siêu tốc chạy rất nhanh.' },
  { id: 'camera', emoji: '📷', vi: 'máy ảnh', topic: 'fun', sentence: 'I take a photo with my camera.', sentenceVi: 'Tôi chụp ảnh bằng máy ảnh.' },
  { id: 'photo', emoji: '🖼️', vi: 'tấm ảnh', topic: 'fun', sentence: 'Look at this photo.', sentenceVi: 'Hãy nhìn tấm ảnh này.' },
  { id: 'show', emoji: '🎤', vi: 'buổi biểu diễn', topic: 'fun', sentence: 'The show starts now.', sentenceVi: 'Buổi biểu diễn bắt đầu rồi.' },
  { id: 'concert', emoji: '🎸', vi: 'buổi hòa nhạc', topic: 'fun', sentence: 'We go to a concert.', sentenceVi: 'Chúng tôi đi xem hòa nhạc.' },
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

/** Màn cao hơn: nhiều câu hỏi hơn mỗi vòng. */
export function tuningFor(levelIndex) {
  return { rounds: Math.min(10, 6 + Math.floor(levelIndex / 2)), choices: 4 };
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
 */
export function chooseOption(game, wordId) {
  const ev = { correct: false, gain: 0, streakBonus: 0, roundDone: false, gameDone: false, won: false };
  if (game.over) return ev;
  const round = currentRound(game);
  if (!round) return ev;

  if (wordId === round.target.id) {
    ev.correct = true;
    game.correctCount++;
    game.streak++;
    game.bestStreak = Math.max(game.bestStreak, game.streak);
    let gain = 10;
    if (game.streak > 0 && game.streak % 3 === 0) {
      gain += 10;
      ev.streakBonus = 10;
    }
    game.score += gain;
    ev.gain = gain;
  } else {
    game.streak = 0;
  }

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
