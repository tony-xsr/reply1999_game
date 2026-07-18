// Ngữ Pháp Trực Quan — 5 trò minh hoạ ngữ pháp bằng animation (Đợt 2 của đề
// xuất "Luyện Thi Cambridge" ở games.md mục 28). Mỗi trò sinh câu bằng công
// thức chia động từ/xây câu, KHÔNG hard-code sẵn từng câu — giữ file thuần
// logic độc lập (không import exam-prep), dễ test, độ đa dạng cao.
//
// 1. 🕰️ Cỗ Máy Thời Gian Ngữ Pháp: 1 nhân vật làm 1 hành động, đánh dấu 1
//    điểm trên trục thời gian (quá khứ/bây giờ/tương lai) kèm 1 "tín hiệu"
//    (icon: 🔁 lặp lại, 🕐 đang diễn ra, ✅ đã xong, 🔗 vừa xong/sẽ xong, ⏳ đang
//    tiếp diễn có khoảng thời gian, ⏮️ xong trước 1 mốc khác, 🌀 tiếp diễn
//    trước 1 mốc khác, 📅 đã lên kế hoạch, 🔮 dự đoán/quyết định tức thời) —
//    ĐỦ CẢ 12 THÌ CƠ BẢN của tiếng Anh (3 mốc thời gian × 4 dạng: đơn/tiếp
//    diễn/hoàn thành/hoàn thành tiếp diễn) + "going to" — bé phải chọn đúng
//    câu tiếng Anh (= đúng thì) khớp với hình.
// 2. ⏳ Hai Hành Động Cùng Lúc: 1 hành động NỀN (dài, đang diễn ra) bị 1 sự
//    kiện NGẮN xen vào — bé chọn đúng câu ghép "While A was V-ing, B V-ed."
//    thay vì các biến thể sai (đảo vai trò, cả 2 đều quá khứ đơn, cả 2 đều
//    tiếp diễn).
// 3. 📈 So Sánh Hơn/Nhất Trực Quan: 2-3 nhân vật với thanh đo trực quan
//    (chiều cao/tốc độ/kích thước/chất lượng) — bé chọn đúng câu so sánh
//    hơn (2 nhân vật) hoặc so sánh nhất (3 nhân vật) khớp với thanh đo.
// 4. 🔮 Going To vs Will: tình huống có dấu hiệu (vali đã đóng gói = kế
//    hoạch có sẵn → going to; chuông điện thoại/dự đoán bất chợt → will) —
//    bé chọn đúng cấu trúc, kèm nhiễu về chia động từ to be (is/am/are/was).
// 5. 🚦 Modal Ai Đúng: 1 biển báo/tình huống — bé chọn đúng động từ khuyết
//    thiếu (must/mustn't/should/shouldn't) khớp với mức độ bắt buộc/khuyên.
// 6. 🌦️ Câu Điều Kiện Loại 1: 1 nguyên nhân (biểu tượng) dẫn tới 1 kết quả —
//    bé chọn đúng câu "If + hiện tại đơn, S + will + V" thay vì các lỗi phổ
//    biến (dùng "will" ngay trong mệnh đề "if", quên "will" ở mệnh đề kết
//    quả, hoặc chia mệnh đề "if" ở quá khứ).
// 7. 🧩 Ghép Câu: khác hẳn 6 trò trên (không chọn 1 trong 4 câu có sẵn) — bé
//    tự BẤM từng từ theo đúng thứ tự để dựng lại 1 câu đã học, ôn tập tổng
//    hợp mọi điểm ngữ pháp ở trên trong 1 trò tương tác thực sự.
// 8. 🔄 Chủ Động vs Bị Động: 1 người (tác nhân) đang tác động lên 1 đồ vật —
//    mũi tên nối tác nhân → đồ vật. Bé chọn đúng câu BỊ ĐỘNG (hiện tại đơn
//    hoặc quá khứ đơn) thay vì câu chủ động hoặc các lỗi thường gặp (chia
//    sai "to be", quên/chia sai quá khứ phân từ).
// 9. 🗣️ Lời Nói Trực Tiếp → Gián Tiếp: 1 nhân vật nói 1 câu trực tiếp (trong
//    bong bóng thoại) — bé chọn đúng câu TƯỜNG THUẬT (lùi thì đúng, đổi đại
//    từ đúng) thay vì các lỗi thường gặp (quên lùi thì, giữ nguyên đại từ
//    "I", chia sai động từ tường thuật "said/says").
// 10. 🔢 Lượng Từ Đúng: 1 lưới đồ vật, một số được TÔ SÁNG màu đỏ — bé chọn
//     đúng câu "All/Some/None of the ___ are red." khớp với số lượng được
//     tô sáng (tất cả/1 phần/không có), tránh nhầm với lỗi phổ biến nhất:
//     dùng "Every" (chỉ đi với danh từ SỐ ÍT) cho cả nhóm số nhiều.

function shuffle(arr, rng) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function pick(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ===== Khung chung: 1 ván = nhiều vòng, luật chọn-lại giống hệt các game
   khác trong dự án (ontap.js/examprep.js) — sai lần đầu → gợi ý, chọn lại;
   đúng sau gợi ý vẫn có điểm (ít hơn); sai lần 2 → lộ đáp án, qua vòng. ===== */

function baseGameState(rounds) {
  return {
    rounds, index: 0, score: 0, streak: 0, bestStreak: 0, correctCount: 0, over: false, won: false,
  };
}

function currentRoundOf(game) {
  return game.rounds[game.index];
}

function answerGeneric(game, chosenKey, getCorrectKey) {
  const ev = {
    correct: false, retry: false, gain: 0, streakBonus: 0, roundDone: false, gameDone: false, won: false,
  };
  if (game.over) return ev;
  const round = currentRoundOf(game);
  if (!round) return ev;
  const correctKey = getCorrectKey(round);

  if (chosenKey === correctKey) {
    ev.correct = true;
    game.correctCount++;
    if (round.retried) {
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
    round.retried = true;
    game.streak = 0;
    ev.retry = true;
    return ev;
  }

  ev.roundDone = true;
  game.index++;
  if (game.index >= game.rounds.length) {
    game.over = true;
    game.won = game.correctCount >= Math.ceil(game.rounds.length * 0.6);
    ev.gameDone = true;
    ev.won = game.won;
  }
  return ev;
}

/* ===== 1. Cỗ Máy Thời Gian Ngữ Pháp ===== */

export const CHARACTERS = [
  { id: 'boy', emoji: '🧒', subject: 'He' },
  { id: 'girl', emoji: '👧', subject: 'She' },
  { id: 'cat', emoji: '🐱', subject: 'The cat' },
  { id: 'dog', emoji: '🐶', subject: 'The dog' },
  { id: 'robot', emoji: '🤖', subject: 'It' },
  { id: 'grandma', emoji: '👵', subject: 'She' },
  { id: 'grandpa', emoji: '👴', subject: 'He' },
  { id: 'teacher', emoji: '👩‍🏫', subject: 'She' },
  { id: 'farmer', emoji: '👨‍🌾', subject: 'He' },
  { id: 'rabbit', emoji: '🐰', subject: 'It' },
  { id: 'monkey', emoji: '🐵', subject: 'It' },
  { id: 'bird', emoji: '🐦', subject: 'It' },
  { id: 'fish', emoji: '🐟', subject: 'It' },
  { id: 'turtle', emoji: '🐢', subject: 'It' },
  { id: 'penguin', emoji: '🐧', subject: 'It' },
  { id: 'koala', emoji: '🐨', subject: 'It' },
  { id: 'owl', emoji: '🦉', subject: 'It' },
  { id: 'fox', emoji: '🦊', subject: 'It' },
  { id: 'lion', emoji: '🦁', subject: 'It' },
  { id: 'panda', emoji: '🐼', subject: 'It' },
  { id: 'elephant', emoji: '🐘', subject: 'It' },
  { id: 'squirrel', emoji: '🐿️', subject: 'It' },
  { id: 'duck', emoji: '🦆', subject: 'It' },
];

// Mọi nhân vật đều là ngôi thứ 3 số ít (he/she/it) để chỉ cần 1 bộ chia động
// từ, tránh phải xử lý I/you/we/they riêng — animation chỉ cần đúng NGỮ
// PHÁP, không cần bao quát mọi ngôi.
export const VERBS = [
  { base: 'play', thirdPerson: 'plays', past: 'played', pp: 'played', ing: 'playing' },
  { base: 'watch', thirdPerson: 'watches', past: 'watched', pp: 'watched', ing: 'watching' },
  { base: 'run', thirdPerson: 'runs', past: 'ran', pp: 'run', ing: 'running' },
  { base: 'cook', thirdPerson: 'cooks', past: 'cooked', pp: 'cooked', ing: 'cooking' },
  { base: 'jump', thirdPerson: 'jumps', past: 'jumped', pp: 'jumped', ing: 'jumping' },
  { base: 'swim', thirdPerson: 'swims', past: 'swam', pp: 'swum', ing: 'swimming' },
  { base: 'read', thirdPerson: 'reads', past: 'read', pp: 'read', ing: 'reading' },
  { base: 'write', thirdPerson: 'writes', past: 'wrote', pp: 'written', ing: 'writing' },
  { base: 'sing', thirdPerson: 'sings', past: 'sang', pp: 'sung', ing: 'singing' },
  { base: 'dance', thirdPerson: 'dances', past: 'danced', pp: 'danced', ing: 'dancing' },
  { base: 'walk', thirdPerson: 'walks', past: 'walked', pp: 'walked', ing: 'walking' },
  { base: 'talk', thirdPerson: 'talks', past: 'talked', pp: 'talked', ing: 'talking' },
  { base: 'eat', thirdPerson: 'eats', past: 'ate', pp: 'eaten', ing: 'eating' },
  { base: 'drink', thirdPerson: 'drinks', past: 'drank', pp: 'drunk', ing: 'drinking' },
  { base: 'sleep', thirdPerson: 'sleeps', past: 'slept', pp: 'slept', ing: 'sleeping' },
  { base: 'fly', thirdPerson: 'flies', past: 'flew', pp: 'flown', ing: 'flying' },
  { base: 'draw', thirdPerson: 'draws', past: 'drew', pp: 'drawn', ing: 'drawing' },
  { base: 'ride', thirdPerson: 'rides', past: 'rode', pp: 'ridden', ing: 'riding' },
  { base: 'climb', thirdPerson: 'climbs', past: 'climbed', pp: 'climbed', ing: 'climbing' },
  { base: 'clean', thirdPerson: 'cleans', past: 'cleaned', pp: 'cleaned', ing: 'cleaning' },
  { base: 'laugh', thirdPerson: 'laughs', past: 'laughed', pp: 'laughed', ing: 'laughing' },
  { base: 'smile', thirdPerson: 'smiles', past: 'smiled', pp: 'smiled', ing: 'smiling' },
  { base: 'shout', thirdPerson: 'shouts', past: 'shouted', pp: 'shouted', ing: 'shouting' },
  { base: 'whisper', thirdPerson: 'whispers', past: 'whispered', pp: 'whispered', ing: 'whispering' },
  { base: 'skip', thirdPerson: 'skips', past: 'skipped', pp: 'skipped', ing: 'skipping' },
  { base: 'wave', thirdPerson: 'waves', past: 'waved', pp: 'waved', ing: 'waving' },
  { base: 'paint', thirdPerson: 'paints', past: 'painted', pp: 'painted', ing: 'painting' },
  { base: 'dream', thirdPerson: 'dreams', past: 'dreamed', pp: 'dreamed', ing: 'dreaming' },
  { base: 'build', thirdPerson: 'builds', past: 'built', pp: 'built', ing: 'building' },
  { base: 'catch', thirdPerson: 'catches', past: 'caught', pp: 'caught', ing: 'catching' },
  { base: 'teach', thirdPerson: 'teaches', past: 'taught', pp: 'taught', ing: 'teaching' },
  { base: 'grow', thirdPerson: 'grows', past: 'grew', pp: 'grown', ing: 'growing' },
  { base: 'kick', thirdPerson: 'kicks', past: 'kicked', pp: 'kicked', ing: 'kicking' },
  { base: 'push', thirdPerson: 'pushes', past: 'pushed', pp: 'pushed', ing: 'pushing' },
  { base: 'hide', thirdPerson: 'hides', past: 'hid', pp: 'hidden', ing: 'hiding' },
  { base: 'throw', thirdPerson: 'throws', past: 'threw', pp: 'thrown', ing: 'throwing' },
];

export const TENSES = [
  {
    id: 'present-simple', label: 'Hiện tại đơn', cue: '🔁', timelineMark: 'now',
    hint: 'vì đây là việc LẶP LẠI thường xuyên (mỗi ngày) — biểu tượng 🔁.',
    build: (char, verb) => `${char.subject} ${verb.thirdPerson} every day.`,
  },
  {
    id: 'present-continuous', label: 'Hiện tại tiếp diễn', cue: '🕐', timelineMark: 'now',
    hint: 'vì việc này đang xảy ra NGAY BÂY GIỜ — biểu tượng 🕐 ở mốc Bây Giờ.',
    build: (char, verb) => `${char.subject} is ${verb.ing} now.`,
  },
  {
    id: 'past-simple', label: 'Quá khứ đơn', cue: '✅', timelineMark: 'past',
    hint: 'vì việc này ĐÃ XẢY RA VÀ KẾT THÚC trong quá khứ — biểu tượng ✅ ở mốc Quá Khứ.',
    build: (char, verb) => `${char.subject} ${verb.past} yesterday.`,
  },
  {
    id: 'past-continuous', label: 'Quá khứ tiếp diễn', cue: '🕐', timelineMark: 'past',
    hint: 'vì việc này ĐANG DIỄN RA tại 1 thời điểm trong quá khứ — biểu tượng 🕐 ở mốc Quá Khứ.',
    build: (char, verb) => `${char.subject} was ${verb.ing} at 8pm yesterday.`,
  },
  {
    id: 'present-perfect', label: 'Hiện tại hoàn thành', cue: '🔗', timelineMark: 'past-to-now',
    hint: 'vì việc này VỪA MỚI xảy ra, nối từ quá khứ tới bây giờ — biểu tượng 🔗.',
    build: (char, verb) => `${char.subject} has just ${verb.pp}.`,
  },
  {
    id: 'going-to', label: 'Tương lai (going to)', cue: '📅', timelineMark: 'future',
    hint: 'vì đây là KẾ HOẠCH đã định cho tương lai — biểu tượng 📅 ở mốc Tương Lai.',
    build: (char, verb) => `${char.subject} is going to ${verb.base} tomorrow.`,
  },
  {
    id: 'present-perfect-continuous', label: 'Hiện tại hoàn thành tiếp diễn', cue: '⏳', timelineMark: 'past-to-now',
    hint: 'vì việc này ĐÃ BẮT ĐẦU trong quá khứ và VẪN ĐANG TIẾP TỤC tới bây giờ, nhấn mạnh KHOẢNG THỜI GIAN diễn ra — biểu tượng ⏳ (khác hiện tại hoàn thành 🔗 chỉ nhấn mạnh việc VỪA XONG).',
    build: (char, verb) => `${char.subject} has been ${verb.ing} for two hours.`,
  },
  {
    id: 'past-perfect', label: 'Quá khứ hoàn thành', cue: '⏮️', timelineMark: 'past',
    hint: 'vì việc này ĐÃ XONG TRƯỚC một mốc khác trong quá khứ (trước khi trời mưa) — biểu tượng ⏮️, còn XA HƠN cả quá khứ đơn (quá khứ của quá khứ).',
    build: (char, verb) => `${char.subject} had already ${verb.pp} before it rained.`,
  },
  {
    id: 'past-perfect-continuous', label: 'Quá khứ hoàn thành tiếp diễn', cue: '🌀', timelineMark: 'past',
    hint: 'vì việc này ĐANG DIỄN RA LIÊN TỤC cho tới một mốc khác trong quá khứ (trước khi cơn bão bắt đầu), nhấn mạnh khoảng thời gian — biểu tượng 🌀.',
    build: (char, verb) => `${char.subject} had been ${verb.ing} for an hour before the storm started.`,
  },
  {
    id: 'future-simple', label: 'Tương lai đơn (will)', cue: '🔮', timelineMark: 'future',
    hint: 'vì đây là DỰ ĐOÁN hoặc QUYẾT ĐỊNH tức thời cho tương lai, KHÔNG có kế hoạch từ trước — biểu tượng 🔮 (khác "going to" 📅 đã có kế hoạch sẵn).',
    build: (char, verb) => `${char.subject} will ${verb.base} tomorrow.`,
  },
  {
    id: 'future-continuous', label: 'Tương lai tiếp diễn', cue: '🕐', timelineMark: 'future',
    hint: 'vì việc này SẼ ĐANG DIỄN RA tại 1 thời điểm cụ thể trong tương lai — biểu tượng 🕐 ở mốc Tương Lai (giống ý nghĩa 🕐 ở quá khứ/hiện tại, chỉ khác mốc thời gian).',
    build: (char, verb) => `${char.subject} will be ${verb.ing} at 8pm tomorrow.`,
  },
  {
    id: 'future-perfect', label: 'Tương lai hoàn thành', cue: '🔗', timelineMark: 'now-to-future',
    hint: 'vì việc này SẼ HOÀN THÀNH trước 1 mốc trong tương lai, nối từ BÂY GIỜ tới TƯƠNG LAI đó — biểu tượng 🔗 (giống hiện tại hoàn thành, nhưng nối bây giờ→tương lai thay vì quá khứ→bây giờ).',
    build: (char, verb) => `${char.subject} will have already ${verb.pp} by 8pm tomorrow.`,
  },
  {
    id: 'future-perfect-continuous', label: 'Tương lai hoàn thành tiếp diễn', cue: '⏳', timelineMark: 'now-to-future',
    hint: 'vì việc này sẽ ĐÃ VÀ ĐANG diễn ra liên tục cho tới 1 mốc trong tương lai, nhấn mạnh khoảng thời gian — biểu tượng ⏳ (giống hiện tại hoàn thành tiếp diễn, nhưng nối bây giờ→tương lai).',
    build: (char, verb) => `${char.subject} will have been ${verb.ing} for two hours by 8pm tomorrow.`,
  },
];

/** 1 vòng: chọn nhân vật + động từ + thì đúng ngẫu nhiên, sinh 4 lựa chọn câu (đúng + 3 nhiễu cùng nhân vật/động từ). */
export function makeTimeMachineRound(rng = Math.random) {
  const character = pick(CHARACTERS, rng);
  const verb = pick(VERBS, rng);
  const correctTense = pick(TENSES, rng);
  const distractors = shuffle(TENSES.filter((t) => t.id !== correctTense.id), rng).slice(0, 3);
  const options = shuffle([correctTense, ...distractors], rng).map((t) => ({
    tenseId: t.id,
    sentence: t.build(character, verb),
  }));
  return {
    character,
    verb,
    correctTenseId: correctTense.id,
    cue: correctTense.cue,
    timelineMark: correctTense.timelineMark,
    options,
  };
}

export function makeTimeMachineGame(count = 8, rng = Math.random) {
  const rounds = [];
  for (let i = 0; i < count; i++) rounds.push(makeTimeMachineRound(rng));
  return baseGameState(rounds);
}

export function currentTimeMachineRound(game) {
  return currentRoundOf(game);
}

export function answerTimeMachine(game, tenseId) {
  return answerGeneric(game, tenseId, (round) => round.correctTenseId);
}

/* ===== 2. Hai Hành Động Cùng Lúc ===== */

export const BG_SUBJECTS = ['I', 'He', 'She'];

export const BG_ACTIONS = [
  { emoji: '🍳', ing: 'cooking dinner', past: 'cooked dinner' },
  { emoji: '📖', ing: 'reading a book', past: 'read a book' },
  { emoji: '🚿', ing: 'taking a shower', past: 'took a shower' },
  { emoji: '😴', ing: 'sleeping', past: 'slept' },
  { emoji: '🧹', ing: 'cleaning the house', past: 'cleaned the house' },
  { emoji: '🎨', ing: 'painting a picture', past: 'painted a picture' },
  { emoji: '🍽️', ing: 'washing the dishes', past: 'washed the dishes' },
  { emoji: '📝', ing: 'doing homework', past: 'did homework' },
  { emoji: '🎮', ing: 'playing video games', past: 'played video games' },
  { emoji: '🧺', ing: 'doing the laundry', past: 'did the laundry' },
  { emoji: '🚲', ing: 'riding a bike', past: 'rode a bike' },
  { emoji: '🎣', ing: 'fishing', past: 'fished' },
  { emoji: '📺', ing: 'watching TV', past: 'watched TV' },
  { emoji: '🧶', ing: 'knitting', past: 'knitted' },
  { emoji: '🛁', ing: 'taking a bath', past: 'took a bath' },
  { emoji: '🍰', ing: 'baking a cake', past: 'baked a cake' },
  { emoji: '🧩', ing: 'doing a puzzle', past: 'did a puzzle' },
  { emoji: '🎻', ing: 'playing the violin', past: 'played the violin' },
  { emoji: '📻', ing: 'listening to the radio', past: 'listened to the radio' },
  { emoji: '🧽', ing: 'washing the car', past: 'washed the car' },
  { emoji: '🧵', ing: 'sewing a shirt', past: 'sewed a shirt' },
  { emoji: '🎯', ing: 'playing darts', past: 'played darts' },
];

export const INTERRUPT_EVENTS = [
  { emoji: '📞', subject: 'the phone', ing: 'ringing', past: 'rang' },
  { emoji: '🔔', subject: 'the doorbell', ing: 'ringing', past: 'rang' },
  { emoji: '💡', subject: 'the lights', ing: 'going out', past: 'went out' },
  { emoji: '🐦', subject: 'a bird', ing: 'flying in', past: 'flew in' },
  { emoji: '🚗', subject: 'a car horn', ing: 'honking', past: 'honked' },
  { emoji: '⏰', subject: 'the alarm', ing: 'going off', past: 'went off' },
  { emoji: '📦', subject: 'a package', ing: 'arriving', past: 'arrived' },
  { emoji: '🐝', subject: 'a bee', ing: 'buzzing in', past: 'buzzed in' },
  { emoji: '🚨', subject: 'the fire alarm', ing: 'ringing', past: 'rang' },
  { emoji: '🎆', subject: 'fireworks', ing: 'exploding', past: 'exploded' },
  { emoji: '👶', subject: 'the baby', ing: 'crying', past: 'cried' },
  { emoji: '🍽️', subject: 'a plate', ing: 'breaking', past: 'broke' },
  { emoji: '📬', subject: 'the mailman', ing: 'knocking', past: 'knocked' },
  { emoji: '🌩️', subject: 'the thunder', ing: 'crashing', past: 'crashed' },
  { emoji: '🐛', subject: 'a worm', ing: 'crawling out', past: 'crawled out' },
  { emoji: '💥', subject: 'a balloon', ing: 'popping', past: 'popped' },
  { emoji: '🚪', subject: 'the door', ing: 'slamming', past: 'slammed' },
  { emoji: '🔌', subject: 'the power', ing: 'going out', past: 'went out' },
  { emoji: '🐭', subject: 'a mouse', ing: 'squeaking', past: 'squeaked' },
  { emoji: '📺', subject: 'the TV', ing: 'turning off', past: 'turned off' },
];

const TWO_ACTION_PATTERNS = ['correct', 'reversed', 'bothSimple', 'bothContinuous'];

function buildTwoActionSentence(subject, bg, interrupt, pattern) {
  switch (pattern) {
    case 'correct':
      return `While ${subject} was ${bg.ing}, ${interrupt.subject} ${interrupt.past}.`;
    case 'reversed':
      return `While ${interrupt.subject} was ${interrupt.ing}, ${subject} ${bg.past}.`;
    case 'bothSimple':
      return `${subject} ${bg.past} when ${interrupt.subject} ${interrupt.past}.`;
    case 'bothContinuous':
    default:
      return `${subject} was ${bg.ing} when ${interrupt.subject} was ${interrupt.ing}.`;
  }
}

/** 1 vòng: nền + sự kiện xen vào ngẫu nhiên, sinh 4 câu (đúng 'correct' + 3 biến thể sai). */
export function makeTwoActionsRound(rng = Math.random) {
  const subject = pick(BG_SUBJECTS, rng);
  const bg = pick(BG_ACTIONS, rng);
  const interrupt = pick(INTERRUPT_EVENTS, rng);
  const options = shuffle(TWO_ACTION_PATTERNS, rng).map((pattern) => ({
    pattern,
    sentence: buildTwoActionSentence(subject, bg, interrupt, pattern),
  }));
  return {
    subject, bg, interrupt, options, correctPattern: 'correct',
  };
}

export function makeTwoActionsGame(count = 8, rng = Math.random) {
  const rounds = [];
  for (let i = 0; i < count; i++) rounds.push(makeTwoActionsRound(rng));
  return baseGameState(rounds);
}

export function currentTwoActionsRound(game) {
  return currentRoundOf(game);
}

export function answerTwoActions(game, pattern) {
  return answerGeneric(game, pattern, (round) => round.correctPattern);
}

/* ===== 3. So Sánh Hơn/Nhất Trực Quan ===== */

// Thực thể dạng cụm danh từ (không dùng đại từ) để câu so sánh tự nhiên ở
// CẢ vai trò chủ ngữ lẫn tân ngữ sau "than": "The boy is taller than the cat."
export const COMPARE_ENTITIES = [
  { id: 'boy', emoji: '🧒', noun: 'the boy' },
  { id: 'girl', emoji: '👧', noun: 'the girl' },
  { id: 'cat', emoji: '🐱', noun: 'the cat' },
  { id: 'dog', emoji: '🐶', noun: 'the dog' },
  { id: 'tree', emoji: '🌳', noun: 'the tree' },
  { id: 'house', emoji: '🏠', noun: 'the house' },
  { id: 'elephant', emoji: '🐘', noun: 'the elephant' },
  { id: 'rabbit', emoji: '🐰', noun: 'the rabbit' },
  { id: 'lion', emoji: '🦁', noun: 'the lion' },
  { id: 'horse', emoji: '🐴', noun: 'the horse' },
  { id: 'car', emoji: '🚗', noun: 'the car' },
  { id: 'bicycle', emoji: '🚲', noun: 'the bicycle' },
  { id: 'mountain', emoji: '⛰️', noun: 'the mountain' },
  { id: 'whale', emoji: '🐳', noun: 'the whale' },
  { id: 'giraffe', emoji: '🦒', noun: 'the giraffe' },
  { id: 'train', emoji: '🚂', noun: 'the train' },
  { id: 'boat', emoji: '⛵', noun: 'the boat' },
  { id: 'bridge', emoji: '🌉', noun: 'the bridge' },
  { id: 'butterfly', emoji: '🦋', noun: 'the butterfly' },
  { id: 'castle', emoji: '🏰', noun: 'the castle' },
];

export const ATTRIBUTES = [
  { id: 'tall', comparative: 'taller', oppositeComparative: 'shorter', superlative: 'tallest', icon: '📏' },
  { id: 'fast', comparative: 'faster', oppositeComparative: 'slower', superlative: 'fastest', icon: '⚡' },
  { id: 'big', comparative: 'bigger', oppositeComparative: 'smaller', superlative: 'biggest', icon: '📦' },
  { id: 'good', comparative: 'better', oppositeComparative: 'worse', superlative: 'best', icon: '⭐' },
  { id: 'strong', comparative: 'stronger', oppositeComparative: 'weaker', superlative: 'strongest', icon: '💪' },
  { id: 'young', comparative: 'younger', oppositeComparative: 'older', superlative: 'youngest', icon: '👶' },
  { id: 'heavy', comparative: 'heavier', oppositeComparative: 'lighter', superlative: 'heaviest', icon: '🏋️' },
  { id: 'smart', comparative: 'smarter', oppositeComparative: 'less smart', superlative: 'smartest', icon: '🧠' },
  { id: 'quiet', comparative: 'quieter', oppositeComparative: 'louder', superlative: 'quietest', icon: '🤫' },
  { id: 'expensive', comparative: 'more expensive', oppositeComparative: 'cheaper', superlative: 'most expensive', icon: '💰' },
  { id: 'bright', comparative: 'brighter', oppositeComparative: 'dimmer', superlative: 'brightest', icon: '💡' },
  { id: 'long', comparative: 'longer', oppositeComparative: 'shorter', superlative: 'longest', icon: '📏' },
  { id: 'cold', comparative: 'colder', oppositeComparative: 'warmer', superlative: 'coldest', icon: '🥶' },
  { id: 'wide', comparative: 'wider', oppositeComparative: 'narrower', superlative: 'widest', icon: '↔️' },
];

function distinctRandomInts(count, max, rng) {
  const out = new Set();
  while (out.size < count) out.add(1 + Math.floor(rng() * max));
  return [...out];
}

/** Vòng so sánh HƠN: 2 thực thể, thanh đo ngẫu nhiên khác nhau. */
function makeComparativeRound(rng) {
  const attr = pick(ATTRIBUTES, rng);
  const [a, b] = shuffle(COMPARE_ENTITIES, rng).slice(0, 2);
  const [ha, hb] = distinctRandomInts(2, 5, rng);
  const bigger = ha > hb ? a : b;
  const smaller = ha > hb ? b : a;
  const options = shuffle([
    { key: 'correct', sentence: `${cap(bigger.noun)} is ${attr.comparative} than ${smaller.noun}.` },
    { key: 'reversed', sentence: `${cap(smaller.noun)} is ${attr.comparative} than ${bigger.noun}.` },
    { key: 'equal', sentence: `${cap(bigger.noun)} is as ${attr.id} as ${smaller.noun}.` },
    { key: 'opposite', sentence: `${cap(bigger.noun)} is ${attr.oppositeComparative} than ${smaller.noun}.` },
  ], rng);
  return {
    subtype: 'comparative', attr, entities: [a, b], heights: { [a.id]: ha, [b.id]: hb }, options, correctKey: 'correct',
  };
}

/** Vòng so sánh NHẤT: 3 thực thể, thanh đo ngẫu nhiên khác nhau, xác định hạng nhất. */
function makeSuperlativeRound(rng) {
  const attr = pick(ATTRIBUTES, rng);
  const [a, b, c] = shuffle(COMPARE_ENTITIES, rng).slice(0, 3);
  const [ha, hb, hc] = distinctRandomInts(3, 5, rng);
  const ranked = [{ e: a, h: ha }, { e: b, h: hb }, { e: c, h: hc }].sort((x, y) => y.h - x.h);
  const top = ranked[0].e;
  const middle = ranked[1].e;
  const bottom = ranked[2].e;
  const options = shuffle([
    { key: 'top', sentence: `${cap(top.noun)} is the ${attr.superlative}.` },
    { key: 'middle', sentence: `${cap(middle.noun)} is the ${attr.superlative}.` },
    { key: 'bottom', sentence: `${cap(bottom.noun)} is the ${attr.superlative}.` },
    { key: 'comparative-instead', sentence: `${cap(top.noun)} is ${attr.comparative}.` },
  ], rng);
  return {
    subtype: 'superlative', attr, entities: [a, b, c], heights: { [a.id]: ha, [b.id]: hb, [c.id]: hc }, options, correctKey: 'top',
  };
}

/** 1 vòng so sánh: ngẫu nhiên 50/50 giữa so sánh hơn (2 thực thể) và so sánh nhất (3 thực thể). */
export function makeComparativeGameRound(rng = Math.random) {
  return rng() < 0.5 ? makeComparativeRound(rng) : makeSuperlativeRound(rng);
}

export function makeComparativeGame(count = 8, rng = Math.random) {
  const rounds = [];
  for (let i = 0; i < count; i++) rounds.push(makeComparativeGameRound(rng));
  return baseGameState(rounds);
}

export function currentComparativeRound(game) {
  return currentRoundOf(game);
}

export function answerComparative(game, key) {
  return answerGeneric(game, key, (round) => round.correctKey);
}

/* ===== 4. Going To vs Will Trực Quan ===== */

function beForm(subject) {
  if (subject === 'I') return 'am';
  if (subject === 'We' || subject === 'They' || subject === 'You') return 'are';
  return 'is';
}
function wrongBeForm(subject) {
  const correct = beForm(subject);
  if (correct === 'am') return 'is';
  if (correct === 'is') return 'are';
  return 'is';
}
function pastBeForm(subject) {
  return subject === 'We' || subject === 'They' || subject === 'You' ? 'were' : 'was';
}

// Nhiều câu gốc viết sẵn "your" (giả định chủ ngữ là "You"). Khi nhân thêm
// chủ ngữ khác (He/She/We/They/I) để tăng số câu hỏi, thay "your" thành đại
// từ sở hữu ĐÚNG với chủ ngữ mới — giữ câu có nghĩa (vd "He brushes HIS
// teeth" thay vì vẫn "his teeth" cứng theo người nghe) thay vì chỉ đổi chủ
// ngữ mà để nguyên "your" sai nghĩa.
const POSSESSIVE_BY_SUBJECT = {
  I: 'my', You: 'your', He: 'his', She: 'her', We: 'our', They: 'their',
};
function applyPossessive(text, subject) {
  const poss = POSSESSIVE_BY_SUBJECT[subject] || 'their';
  return text.replace(/\byour\b/g, poss);
}

export const GOING_TO_WILL_SCENARIOS = [
  {
    cue: '🧳', cueLabel: 'Va li đã đóng gói sẵn — kế hoạch có từ trước', subject: 'She', verb: 'visit her grandma', correctForm: 'going-to',
  },
  {
    cue: '📞', cueLabel: 'Điện thoại đang reo — quyết định ngay lúc đó', subject: 'I', verb: 'answer the phone', correctForm: 'will',
  },
  {
    cue: '⛈️', cueLabel: 'Mây đen kéo tới — dấu hiệu rõ ràng ngay trước mắt', subject: 'It', verb: 'rain', correctForm: 'going-to', weatherOnly: true,
  },
  {
    cue: '🔮', cueLabel: 'Dự đoán không chắc chắn, chỉ là suy đoán', subject: 'It', verb: 'be sunny tomorrow', correctForm: 'will', weatherOnly: true,
  },
  {
    cue: '📝', cueLabel: 'Đã đặt vé, lên kế hoạch từ trước', subject: 'We', verb: 'travel to Da Nang', correctForm: 'going-to',
  },
  {
    cue: '🤝', cueLabel: 'Lời hứa ngay lúc nói', subject: 'I', verb: 'help you', correctForm: 'will',
  },
  {
    cue: '🎂', cueLabel: 'Đã đặt bánh sinh nhật từ tuần trước — kế hoạch có sẵn', subject: 'They', verb: 'have a birthday party', correctForm: 'going-to',
  },
  {
    cue: '💥', cueLabel: 'Vừa thấy tai nạn xảy ra ngay trước mắt — phản ứng tức thời', subject: 'I', verb: 'call an ambulance', correctForm: 'will',
  },
  {
    cue: '🎫', cueLabel: 'Đã mua vé xem phim từ hôm qua — kế hoạch có sẵn', subject: 'We', verb: 'watch a movie tonight', correctForm: 'going-to',
  },
  {
    cue: '🏗️', cueLabel: 'Công ty đã ký hợp đồng xây nhà từ tháng trước — kế hoạch có sẵn', subject: 'They', verb: 'build a new house', correctForm: 'going-to',
  },
  {
    cue: '🍿', cueLabel: 'Bất chợt thấy phim hay đang chiếu, quyết định ngay', subject: 'We', verb: 'watch it now', correctForm: 'will',
  },
  {
    cue: '🩹', cueLabel: 'Bạn vừa bị ngã trầy đầu gối — mình giúp ngay lập tức', subject: 'I', verb: 'get you a bandage', correctForm: 'will',
  },
  {
    cue: '🎓', cueLabel: 'Đã đăng ký học và đóng học phí từ đầu năm — kế hoạch có sẵn', subject: 'She', verb: 'study abroad next year', correctForm: 'going-to',
  },
  {
    cue: '🌅', cueLabel: 'Nhìn bầu trời đỏ rực lúc hoàng hôn, đoán thời tiết ngày mai', subject: 'It', verb: 'be windy tomorrow', correctForm: 'will', weatherOnly: true,
  },
  {
    cue: '📦', cueLabel: 'Đã đóng thùng đồ sẵn để chuyển nhà cuối tuần này — kế hoạch có sẵn', subject: 'We', verb: 'move to a new house', correctForm: 'going-to',
  },
  {
    cue: '🔋', cueLabel: 'Thấy điện thoại sắp hết pin — quyết định ngay lúc đó', subject: 'You', verb: 'charge your phone', correctForm: 'will',
  },
  {
    cue: '🎁', cueLabel: 'Đã mua quà và gói sẵn từ hôm qua — kế hoạch có sẵn', subject: 'He', verb: 'give her a present', correctForm: 'going-to',
  },
  {
    cue: '🚪', cueLabel: 'Nghe tiếng gõ cửa, phản ứng ngay lập tức', subject: 'I', verb: 'open the door', correctForm: 'will',
  },
  {
    cue: '📅', cueLabel: 'Lịch họp đã được đặt sẵn tuần sau — kế hoạch có sẵn', subject: 'They', verb: 'have a meeting next week', correctForm: 'going-to',
  },
  {
    cue: '🥤', cueLabel: 'Thấy bạn khát nước, đề nghị giúp ngay', subject: 'I', verb: 'get you some water', correctForm: 'will',
  },
  {
    cue: '🏕️', cueLabel: 'Đã chuẩn bị lều và ba lô từ tối qua — kế hoạch có sẵn', subject: 'We', verb: 'go camping this weekend', correctForm: 'going-to',
  },
  {
    cue: '🐾', cueLabel: 'Thấy con mèo lạc, quyết định giúp ngay lập tức', subject: 'She', verb: 'take care of the cat', correctForm: 'will',
  },
  {
    cue: '🍕', cueLabel: 'Đã đặt pizza giao tận nhà từ trước — kế hoạch có sẵn', subject: 'We', verb: 'have pizza for dinner', correctForm: 'going-to',
  },
  {
    cue: '🚑', cueLabel: 'Nghe tiếng còi báo động, phản ứng ngay lập tức', subject: 'I', verb: 'call the doctor', correctForm: 'will',
  },
  {
    cue: '🎡', cueLabel: 'Đã mua vé hội chợ từ tuần trước — kế hoạch có sẵn', subject: 'They', verb: 'go to the fair', correctForm: 'going-to',
  },
  {
    cue: '📖', cueLabel: 'Bất chợt quyết định đọc thêm 1 chương nữa', subject: 'I', verb: 'read one more chapter', correctForm: 'will',
  },
  {
    cue: '🏥', cueLabel: 'Đã đặt lịch khám bác sĩ từ hôm qua — kế hoạch có sẵn', subject: 'She', verb: 'see a doctor tomorrow', correctForm: 'going-to',
  },
  {
    cue: '🌂', cueLabel: 'Thấy trời sắp mưa, mang theo ô ngay', subject: 'I', verb: 'take an umbrella', correctForm: 'will',
  },
  {
    cue: '🎤', cueLabel: 'Đã tập luyện và đăng ký thi hát từ tháng trước — kế hoạch có sẵn', subject: 'He', verb: 'perform at the concert', correctForm: 'going-to',
  },
  {
    cue: '🍦', cueLabel: 'Thấy xe kem đi ngang qua, quyết định mua ngay', subject: 'We', verb: 'buy some ice cream', correctForm: 'will',
  },
  {
    cue: '🎨', cueLabel: 'Đã mua đủ màu vẽ và giấy từ tuần trước — kế hoạch có sẵn', subject: 'She', verb: 'paint a picture this weekend', correctForm: 'going-to',
  },
  {
    cue: '🔔', cueLabel: 'Nghe chuông cửa reo, ra mở ngay lập tức', subject: 'I', verb: 'answer the door', correctForm: 'will',
  },
  {
    cue: '🏊', cueLabel: 'Đã đăng ký lớp học bơi từ tháng trước — kế hoạch có sẵn', subject: 'They', verb: 'learn to swim', correctForm: 'going-to',
  },
  {
    cue: '🥶', cueLabel: 'Thấy trời lạnh đột ngột, quyết định mặc áo ấm ngay', subject: 'He', verb: 'wear a coat', correctForm: 'will',
  },
  {
    cue: '📚', cueLabel: 'Đã mượn sách và lên kế hoạch ôn thi từ đầu tuần — kế hoạch có sẵn', subject: 'We', verb: 'study for the test', correctForm: 'going-to',
  },
  {
    cue: '🚕', cueLabel: 'Thấy taxi trống đi ngang qua, vẫy tay gọi ngay', subject: 'I', verb: 'take a taxi', correctForm: 'will',
  },
  {
    cue: '🎸', cueLabel: 'Đã tập luyện và đăng ký biểu diễn ban nhạc từ tháng trước — kế hoạch có sẵn', subject: 'They', verb: 'play at the school concert', correctForm: 'going-to',
  },
  {
    cue: '🧯', cueLabel: 'Thấy khói bốc lên trong bếp, phản ứng ngay lập tức', subject: 'I', verb: 'get the fire extinguisher', correctForm: 'will',
  },
  {
    cue: '🏡', cueLabel: 'Đã ký hợp đồng thuê nhà mới từ tuần trước — kế hoạch có sẵn', subject: 'We', verb: 'move to a new apartment', correctForm: 'going-to',
  },
  {
    cue: '🍿', cueLabel: 'Bất chợt muốn ăn bỏng ngô, quyết định làm ngay', subject: 'She', verb: 'make some popcorn', correctForm: 'will',
  },
  {
    cue: '🎣', cueLabel: 'Đã chuẩn bị cần câu và mồi từ tối qua — kế hoạch có sẵn', subject: 'He', verb: 'go fishing this weekend', correctForm: 'going-to',
  },
  {
    cue: '⚡', cueLabel: 'Thấy đèn chớp tắt liên tục, quyết định gọi thợ điện ngay', subject: 'I', verb: 'call an electrician', correctForm: 'will',
  },
  {
    cue: '🎭', cueLabel: 'Đã tập kịch và đặt vé từ tháng trước — kế hoạch có sẵn', subject: 'We', verb: 'watch a play tonight', correctForm: 'going-to',
  },
  {
    cue: '🍕', cueLabel: 'Bất chợt đói bụng, quyết định đặt pizza ngay', subject: 'They', verb: 'order a pizza', correctForm: 'will',
  },
  {
    cue: '🏫', cueLabel: 'Đã đăng ký nhập học trường mới từ tháng trước — kế hoạch có sẵn', subject: 'She', verb: 'start a new school', correctForm: 'going-to',
  },
  {
    cue: '🎪', cueLabel: 'Đã mua vé xem xiếc từ tuần trước — kế hoạch có sẵn', subject: 'We', verb: 'watch the circus show', correctForm: 'going-to',
  },
  {
    cue: '🚗', cueLabel: 'Đã đặt lịch sửa xe từ hôm qua — kế hoạch có sẵn', subject: 'He', verb: 'fix the car', correctForm: 'going-to',
  },
  {
    cue: '🏖️', cueLabel: 'Đã đặt phòng khách sạn biển từ tháng trước — kế hoạch có sẵn', subject: 'They', verb: 'go to the beach', correctForm: 'going-to',
  },
  {
    cue: '🎬', cueLabel: 'Đã mua vé xem phim mới ra mắt — kế hoạch có sẵn', subject: 'She', verb: 'watch the new movie', correctForm: 'going-to',
  },
  {
    cue: '🧁', cueLabel: 'Đã mua đủ nguyên liệu làm bánh cupcake — kế hoạch có sẵn', subject: 'We', verb: 'bake cupcakes', correctForm: 'going-to',
  },
  {
    cue: '🎨', cueLabel: 'Đã chuẩn bị màu vẽ cho lớp học nghệ thuật — kế hoạch có sẵn', subject: 'He', verb: 'take an art class', correctForm: 'going-to',
  },
  {
    cue: '🚲', cueLabel: 'Đã sửa xong xe đạp, sẵn sàng đi — kế hoạch có sẵn', subject: 'She', verb: 'ride to school', correctForm: 'going-to',
  },
  {
    cue: '🎾', cueLabel: 'Đã đăng ký giải quần vợt từ tháng trước — kế hoạch có sẵn', subject: 'He', verb: 'play in the tennis tournament', correctForm: 'going-to',
  },
  {
    cue: '🏕️', cueLabel: 'Đã đóng gói lều trại từ tối qua — kế hoạch có sẵn', subject: 'We', verb: 'go camping', correctForm: 'going-to',
  },
  {
    cue: '📷', cueLabel: 'Đã sạc đầy pin máy ảnh để đi chụp — kế hoạch có sẵn', subject: 'She', verb: 'take photos at the park', correctForm: 'going-to',
  },
  {
    cue: '🎻', cueLabel: 'Đã tập luyện cho buổi biểu diễn violin — kế hoạch có sẵn', subject: 'He', verb: 'perform at the recital', correctForm: 'going-to',
  },
  {
    cue: '🧑‍🍳', cueLabel: 'Đã chuẩn bị nguyên liệu nấu ăn cho bữa tiệc — kế hoạch có sẵn', subject: 'They', verb: 'cook a big dinner', correctForm: 'going-to',
  },
  {
    cue: '🚀', cueLabel: 'Đã đăng ký tham quan bảo tàng vũ trụ — kế hoạch có sẵn', subject: 'We', verb: 'visit the space museum', correctForm: 'going-to',
  },
  {
    cue: '🎓', cueLabel: 'Đã hoàn thành hồ sơ nhập học đại học — kế hoạch có sẵn', subject: 'She', verb: 'go to university next year', correctForm: 'going-to',
  },
  {
    cue: '🏠', cueLabel: 'Đã ký hợp đồng mua nhà mới — kế hoạch có sẵn', subject: 'They', verb: 'move into a new house', correctForm: 'going-to',
  },
  {
    cue: '🎤', cueLabel: 'Đã tập bài hát cho cuộc thi hát — kế hoạch có sẵn', subject: 'He', verb: 'sing in the competition', correctForm: 'going-to',
  },
  {
    cue: '🚂', cueLabel: 'Đã mua vé tàu đi thăm ông bà — kế hoạch có sẵn', subject: 'She', verb: 'visit her grandparents by train', correctForm: 'going-to',
  },
  {
    cue: '🐕', cueLabel: 'Đã chuẩn bị chuồng cho chú chó mới — kế hoạch có sẵn', subject: 'We', verb: 'get a new puppy', correctForm: 'going-to',
  },
  {
    cue: '🎳', cueLabel: 'Đã đặt sân bowling cho cuối tuần — kế hoạch có sẵn', subject: 'He', verb: 'go bowling this weekend', correctForm: 'going-to',
  },
  {
    cue: '🥾', cueLabel: 'Đã chuẩn bị giày leo núi từ tối qua — kế hoạch có sẵn', subject: 'They', verb: 'go hiking', correctForm: 'going-to',
  },
  {
    cue: '🚪', cueLabel: 'Thấy cửa bị kẹt, quyết định sửa ngay', subject: 'He', verb: 'fix the door', correctForm: 'will',
  },
  {
    cue: '📱', cueLabel: 'Thấy điện thoại hết pin, quyết định sạc ngay', subject: 'She', verb: 'charge the phone', correctForm: 'will',
  },
  {
    cue: '🍜', cueLabel: 'Bất chợt đói bụng, quyết định gọi mì', subject: 'I', verb: 'order some noodles', correctForm: 'will',
  },
  {
    cue: '🧊', cueLabel: 'Thấy nước đá tan, quyết định lấy thêm ngay', subject: 'We', verb: 'get more ice', correctForm: 'will',
  },
  {
    cue: '🐛', cueLabel: 'Thấy con sâu trên lá, quyết định bắt nó ngay', subject: 'I', verb: 'catch the bug', correctForm: 'will',
  },
  {
    cue: '🎈', cueLabel: 'Thấy bóng bay xì hơi, quyết định bơm lại ngay', subject: 'He', verb: 'blow up the balloon', correctForm: 'will',
  },
  {
    cue: '🕯️', cueLabel: 'Thấy nến sắp tắt, quyết định thắp lại ngay', subject: 'She', verb: 'light the candle', correctForm: 'will',
  },
  {
    cue: '🧹', cueLabel: 'Thấy sàn nhà bẩn, quyết định quét ngay', subject: 'I', verb: 'sweep the floor', correctForm: 'will',
  },
  {
    cue: '🐦', cueLabel: 'Thấy chim non rơi khỏi tổ, quyết định giúp nó ngay', subject: 'They', verb: 'help the baby bird', correctForm: 'will',
  },
  {
    cue: '🥶', cueLabel: 'Thấy trời trở lạnh đột ngột, quyết định mặc thêm áo ngay', subject: 'He', verb: 'put on a jacket', correctForm: 'will',
  },
  {
    cue: '🚦', cueLabel: 'Thấy đèn giao thông hỏng, quyết định báo cảnh sát ngay', subject: 'We', verb: 'call the police', correctForm: 'will',
  },
  {
    cue: '🎁', cueLabel: 'Bất chợt nhớ ra sinh nhật bạn, quyết định mua quà ngay', subject: 'I', verb: 'buy a gift', correctForm: 'will',
  },
  {
    cue: '🧯', cueLabel: 'Thấy khói bốc lên, quyết định gọi cứu hỏa ngay', subject: 'She', verb: 'call the fire department', correctForm: 'will',
  },
  {
    cue: '🐝', cueLabel: 'Thấy ong bay vào nhà, quyết định mở cửa sổ ngay', subject: 'He', verb: 'open the window', correctForm: 'will',
  },
  {
    cue: '🚕', cueLabel: 'Thấy trời mưa to, quyết định gọi taxi ngay', subject: 'I', verb: 'call a taxi', correctForm: 'will',
  },
  {
    cue: '🎧', cueLabel: 'Thấy nhạc quá to, quyết định giảm âm lượng ngay', subject: 'They', verb: 'turn down the volume', correctForm: 'will',
  },
  {
    cue: '🧴', cueLabel: 'Thấy da bị cháy nắng, quyết định bôi kem ngay', subject: 'She', verb: 'apply sunscreen', correctForm: 'will',
  },
  {
    cue: '🐌', cueLabel: 'Thấy con ốc sên trên đường, quyết định nhặt nó qua bên kia ngay', subject: 'We', verb: 'move the snail', correctForm: 'will',
  },
  {
    cue: '📚', cueLabel: 'Bất chợt nhớ ra bài tập chưa làm, quyết định làm ngay', subject: 'I', verb: 'do the homework now', correctForm: 'will',
  },
  {
    cue: '🌂', cueLabel: 'Thấy mây đen kéo tới bất ngờ, quyết định đóng cửa sổ lại ngay', subject: 'He', verb: 'close the windows', correctForm: 'will',
  },
  {
    cue: '🧺', cueLabel: 'Thấy quần áo bẩn chất đống, quyết định giặt ngay', subject: 'She', verb: 'do the laundry', correctForm: 'will',
  },
  {
    cue: '🎨', cueLabel: 'Đã đăng ký lớp vẽ tranh từ tháng trước — kế hoạch có sẵn', subject: 'She', verb: 'join an art workshop', correctForm: 'going-to',
  },
  {
    cue: '🏊', cueLabel: 'Đã đăng ký khóa học bơi nâng cao — kế hoạch có sẵn', subject: 'He', verb: 'take an advanced swimming course', correctForm: 'going-to',
  },
  {
    cue: '🎻', cueLabel: 'Đã mua vé buổi hòa nhạc dàn nhạc giao hưởng — kế hoạch có sẵn', subject: 'We', verb: 'attend the orchestra concert', correctForm: 'going-to',
  },
  {
    cue: '🚴', cueLabel: 'Đã đăng ký giải đua xe đạp — kế hoạch có sẵn', subject: 'He', verb: 'race in the cycling competition', correctForm: 'going-to',
  },
  {
    cue: '🏕️', cueLabel: 'Đã đặt khu cắm trại từ tuần trước — kế hoạch có sẵn', subject: 'They', verb: 'stay at the campsite', correctForm: 'going-to',
  },
  {
    cue: '🎂', cueLabel: 'Đã đặt bánh kem sinh nhật từ hôm qua — kế hoạch có sẵn', subject: 'She', verb: 'celebrate her birthday', correctForm: 'going-to',
  },
  {
    cue: '📚', cueLabel: 'Đã mượn đủ sách cho báo cáo — kế hoạch có sẵn', subject: 'He', verb: 'write a book report', correctForm: 'going-to',
  },
  {
    cue: '🎤', cueLabel: 'Đã tập luyện cho buổi thi hát — kế hoạch có sẵn', subject: 'She', verb: 'audition for the choir', correctForm: 'going-to',
  },
  {
    cue: '🏀', cueLabel: 'Đã đăng ký đội bóng rổ trường — kế hoạch có sẵn', subject: 'He', verb: 'join the basketball team', correctForm: 'going-to',
  },
  {
    cue: '🧳', cueLabel: 'Đã đặt vé máy bay đi du lịch — kế hoạch có sẵn', subject: 'We', verb: 'fly to Singapore', correctForm: 'going-to',
  },
  {
    cue: '🎭', cueLabel: 'Đã tập kịch cho buổi biểu diễn cuối năm — kế hoạch có sẵn', subject: 'They', verb: 'act in the school play', correctForm: 'going-to',
  },
  {
    cue: '🍰', cueLabel: 'Đã đặt bàn tại nhà hàng cho tối nay — kế hoạch có sẵn', subject: 'She', verb: 'have dinner at the new restaurant', correctForm: 'going-to',
  },
  {
    cue: '🎣', cueLabel: 'Đã chuẩn bị đầy đủ cần câu và mồi — kế hoạch có sẵn', subject: 'He', verb: 'go fishing at the lake', correctForm: 'going-to',
  },
  {
    cue: '🚌', cueLabel: 'Đã mua vé xe buýt đi thăm bảo tàng — kế hoạch có sẵn', subject: 'We', verb: 'visit the history museum', correctForm: 'going-to',
  },
  {
    cue: '🧑‍🍳', cueLabel: 'Đã ghi danh lớp học nấu ăn — kế hoạch có sẵn', subject: 'She', verb: 'take a cooking class', correctForm: 'going-to',
  },
  {
    cue: '🎹', cueLabel: 'Đã đăng ký thi đàn piano — kế hoạch có sẵn', subject: 'He', verb: 'compete in the piano contest', correctForm: 'going-to',
  },
  {
    cue: '🛍️', cueLabel: 'Đã lên danh sách mua sắm cho năm học mới — kế hoạch có sẵn', subject: 'They', verb: 'buy new school supplies', correctForm: 'going-to',
  },
  {
    cue: '🔑', cueLabel: 'Thấy chìa khóa bị kẹt, quyết định thử lại ngay', subject: 'He', verb: 'try the key again', correctForm: 'will',
  },
  {
    cue: '🐭', cueLabel: 'Thấy con chuột chạy qua, quyết định đuổi nó ngay', subject: 'She', verb: 'chase the mouse away', correctForm: 'will',
  },
  {
    cue: '🧊', cueLabel: 'Thấy tủ lạnh hết đá, quyết định làm thêm ngay', subject: 'I', verb: 'make more ice', correctForm: 'will',
  },
  {
    cue: '🌧️', cueLabel: 'Thấy trời sắp mưa, quyết định gấp quần áo phơi ngay', subject: 'We', verb: 'bring in the laundry', correctForm: 'will',
  },
  {
    cue: '🖨️', cueLabel: 'Thấy máy in hết giấy, quyết định thay giấy ngay', subject: 'He', verb: 'refill the paper', correctForm: 'will',
  },
  {
    cue: '🎈', cueLabel: 'Thấy bóng bay bay mất, quyết định đuổi theo ngay', subject: 'She', verb: 'run after the balloon', correctForm: 'will',
  },
  {
    cue: '🚰', cueLabel: 'Thấy vòi nước bị rò, quyết định khóa lại ngay', subject: 'I', verb: 'turn off the tap', correctForm: 'will',
  },
  {
    cue: '📺', cueLabel: 'Thấy tivi bị nhiễu sóng, quyết định chỉnh lại ngay', subject: 'He', verb: 'adjust the antenna', correctForm: 'will',
  },
  {
    cue: '🐜', cueLabel: 'Thấy đàn kiến trong bếp, quyết định dọn dẹp ngay', subject: 'They', verb: 'clean up the kitchen', correctForm: 'will',
  },
  {
    cue: '🧦', cueLabel: 'Thấy tất bị rách, quyết định vá lại ngay', subject: 'She', verb: 'mend the sock', correctForm: 'will',
  },
  {
    cue: '🚲', cueLabel: 'Thấy lốp xe đạp xẹp, quyết định bơm ngay', subject: 'I', verb: 'pump up the tire', correctForm: 'will',
  },
  {
    cue: '🕰️', cueLabel: 'Thấy đồng hồ chạy sai giờ, quyết định chỉnh lại ngay', subject: 'He', verb: 'reset the clock', correctForm: 'will',
  },
  {
    cue: '🎒', cueLabel: 'Thấy quên mang cặp sách, quyết định quay lại lấy ngay', subject: 'I', verb: 'go back for the bag', correctForm: 'will',
  },
  {
    cue: '🌡️', cueLabel: 'Thấy nhiệt kế báo sốt, quyết định gọi bác sĩ ngay', subject: 'She', verb: 'phone the doctor', correctForm: 'will',
  },
  {
    cue: '🧴', cueLabel: 'Thấy hết xà phòng, quyết định mua thêm ngay', subject: 'We', verb: 'buy more soap', correctForm: 'will',
  },
  {
    cue: '🔋', cueLabel: 'Thấy pin điều khiển hết, quyết định thay pin ngay', subject: 'He', verb: 'replace the batteries', correctForm: 'will',
  },
  {
    cue: '🐦', cueLabel: 'Thấy chim mắc kẹt trong lồng, quyết định thả nó ra ngay', subject: 'She', verb: 'set the bird free', correctForm: 'will',
  },
  // ----- Bổ sung vòng mục tiêu 850 -----
  {
    cue: '🎨', cueLabel: 'Đã mua đầy đủ sơn và cọ từ tuần trước — kế hoạch có sẵn', subject: 'He', verb: 'paint the fence this weekend', correctForm: 'going-to',
  },
  {
    cue: '🎒', cueLabel: 'Balo đã chuẩn bị xong từ tối qua — kế hoạch có sẵn', subject: 'They', verb: 'go on a school trip', correctForm: 'going-to',
  },
  {
    cue: '📅', cueLabel: 'Đã ghi lịch hẹn nha sĩ từ tháng trước — kế hoạch có sẵn', subject: 'I', verb: 'see the dentist tomorrow', correctForm: 'going-to',
  },
  {
    cue: '🎻', cueLabel: 'Đã tập luyện nhiều tuần cho buổi biểu diễn — kế hoạch có sẵn', subject: 'She', verb: 'perform in the string quartet', correctForm: 'going-to',
  },
  {
    cue: '🏕️', cueLabel: 'Lều và túi ngủ đã xếp sẵn trong xe — kế hoạch có sẵn', subject: 'We', verb: 'camp by the lake this weekend', correctForm: 'going-to',
  },
  {
    cue: '🎓', cueLabel: 'Đã nộp hồ sơ và được nhận từ tháng trước — kế hoạch có sẵn', subject: 'He', verb: 'graduate next spring', correctForm: 'going-to',
  },
  {
    cue: '🛠️', cueLabel: 'Đã mua vật liệu để sửa từ hôm qua — kế hoạch có sẵn', subject: 'I', verb: 'repair the fence', correctForm: 'going-to',
  },
  {
    cue: '📖', cueLabel: 'Câu lạc bộ đã lên lịch buổi thảo luận — kế hoạch có sẵn', subject: 'They', verb: 'discuss the new novel', correctForm: 'going-to',
  },
  {
    cue: '🚗', cueLabel: 'Đã đặt lịch bảo dưỡng xe từ tuần trước — kế hoạch có sẵn', subject: 'We', verb: 'service the car tomorrow', correctForm: 'going-to',
  },
  {
    cue: '🎤', cueLabel: 'Đã tập bài hát suốt cả tháng — kế hoạch có sẵn', subject: 'She', verb: 'sing at the wedding', correctForm: 'going-to',
  },
  {
    cue: '🏠', cueLabel: 'Đã ký hợp đồng mua nhà — kế hoạch có sẵn', subject: 'They', verb: 'move into their brand-new house', correctForm: 'going-to',
  },
  {
    cue: '🧑‍🍳', cueLabel: 'Đã lên thực đơn và mua nguyên liệu — kế hoạch có sẵn', subject: 'He', verb: 'cook a special dinner tonight', correctForm: 'going-to',
  },
  {
    cue: '🎪', cueLabel: 'Vé đã mua sẵn từ tuần trước — kế hoạch có sẵn', subject: 'We', verb: 'watch the magic show', correctForm: 'going-to',
  },
  {
    cue: '🔦', cueLabel: 'Thấy đèn pin yếu ngay lúc cần dùng, quyết định làm ngay', subject: 'I', verb: 'recharge the flashlight', correctForm: 'will',
  },
  {
    cue: '🔔', cueLabel: 'Chuông cửa vừa reo, phản ứng ngay lập tức', subject: 'She', verb: 'let the visitor in', correctForm: 'will',
  },
  {
    cue: '🍪', cueLabel: 'Bụng đang réo ngay lúc này, quyết định ngay', subject: 'He', verb: 'grab a snack', correctForm: 'will',
  },
  {
    cue: '🆘', cueLabel: 'Vừa thấy tai nạn xảy ra, phản ứng ngay lập tức', subject: 'They', verb: 'shout for help', correctForm: 'will',
  },
  {
    cue: '🤝', cueLabel: 'Lời hứa ngay lúc nói', subject: 'We', verb: 'support you', correctForm: 'will',
  },
  {
    cue: '🔮', cueLabel: 'Dự đoán không chắc chắn về tương lai', subject: 'He', verb: 'become a great artist', correctForm: 'will',
  },
  {
    cue: '📦', cueLabel: 'Vừa thấy đồ bị rơi, phản ứng ngay lập tức', subject: 'I', verb: 'pick it up', correctForm: 'will',
  },
  {
    cue: '🕯️', cueLabel: 'Vừa xong tiệc sinh nhật, quyết định ngay lúc đó', subject: 'She', verb: 'blow out the candle', correctForm: 'will',
  },
  {
    cue: '💧', cueLabel: 'Vừa thấy ống nước bị rò rỉ, phản ứng ngay lập tức', subject: 'He', verb: 'fix the leaky pipe', correctForm: 'will',
  },
  {
    cue: '🐕', cueLabel: 'Con chó vừa sủa dữ dội, phản ứng ngay lập tức', subject: 'I', verb: 'check on the dog', correctForm: 'will',
  },
  {
    cue: '💡', cueLabel: 'Vừa nghĩ ra một ý hay, quyết định ngay lúc đó', subject: 'She', verb: 'write it down', correctForm: 'will',
  },
  {
    cue: '🚙', cueLabel: 'Xe vừa hết xăng giữa đường, phản ứng ngay lập tức', subject: 'We', verb: 'push the car', correctForm: 'will',
  },
  {
    cue: '☕', cueLabel: 'Vừa thấy khách đến bất ngờ, quyết định ngay lúc đó', subject: 'I', verb: 'make some tea', correctForm: 'will',
  },
  // ----- Bổ sung vòng mục tiêu 1000 -----
  {
    cue: '🎷', cueLabel: 'Đã tập thử giọng nhiều tuần — kế hoạch có sẵn', subject: 'She', verb: 'audition for the school band', correctForm: 'going-to',
  },
  {
    cue: '🌱', cueLabel: 'Đã mua hạt giống từ tuần trước — kế hoạch có sẵn', subject: 'They', verb: 'plant a vegetable garden this spring', correctForm: 'going-to',
  },
  {
    cue: '🏚️', cueLabel: 'Đã thuê thợ và đặt vật liệu — kế hoạch có sẵn', subject: 'He', verb: 'renovate the old barn', correctForm: 'going-to',
  },
  {
    cue: '🎲', cueLabel: 'Đã mời bạn bè và chuẩn bị trò chơi — kế hoạch có sẵn', subject: 'We', verb: 'host a game night this Friday', correctForm: 'going-to',
  },
  {
    cue: '🐱', cueLabel: 'Đã hoàn tất thủ tục nhận nuôi — kế hoạch có sẵn', subject: 'I', verb: 'adopt a rescue kitten', correctForm: 'going-to',
  },
  {
    cue: '🏺', cueLabel: 'Đã đăng ký và đóng học phí — kế hoạch có sẵn', subject: 'She', verb: 'enroll in a pottery class', correctForm: 'going-to',
  },
  {
    cue: '🌷', cueLabel: 'Đã đặt vé tham quan từ tuần trước — kế hoạch có sẵn', subject: 'We', verb: 'visit the botanical garden', correctForm: 'going-to',
  },
  {
    cue: '🔤', cueLabel: 'Đã luyện đánh vần suốt cả tháng — kế hoạch có sẵn', subject: 'He', verb: 'compete in the spelling bee', correctForm: 'going-to',
  },
  {
    cue: '💻', cueLabel: 'Đã lên lịch ra mắt từ tháng trước — kế hoạch có sẵn', subject: 'They', verb: 'launch the new website', correctForm: 'going-to',
  },
  {
    cue: '🧁', cueLabel: 'Đã lên kế hoạch và mời người tham gia — kế hoạch có sẵn', subject: 'We', verb: 'organize a charity bake sale', correctForm: 'going-to',
  },
  {
    cue: '🏰', cueLabel: 'Đã mua vé tham quan từ tuần trước — kế hoạch có sẵn', subject: 'They', verb: 'tour the old castle', correctForm: 'going-to',
  },
  {
    cue: '🎓', cueLabel: 'Đã ghi ngày vào lịch từ lâu — kế hoạch có sẵn', subject: 'She', verb: "attend her cousin's graduation", correctForm: 'going-to',
  },
  {
    cue: '🧊', cueLabel: 'Vừa thấy ai đó bị đau, phản ứng ngay lập tức', subject: 'I', verb: 'grab an ice pack', correctForm: 'will',
  },
  {
    cue: '☂️', cueLabel: 'Thấy bạn không mang ô, quyết định ngay lúc đó', subject: 'I', verb: 'lend you my umbrella', correctForm: 'will',
  },
  {
    cue: '🔢', cueLabel: 'Vừa nghi ngờ có sai sót, quyết định ngay lúc đó', subject: 'She', verb: 'double-check the numbers', correctForm: 'will',
  },
  {
    cue: '📖', cueLabel: 'Vừa gặp khó khi tìm sách, quyết định ngay lúc đó', subject: 'He', verb: 'ask the librarian for help', correctForm: 'will',
  },
  {
    cue: '🧽', cueLabel: 'Vừa thấy nước đổ ra sàn, phản ứng ngay lập tức', subject: 'I', verb: 'wipe up the spill', correctForm: 'will',
  },
  {
    cue: '🚪', cueLabel: 'Thấy bạn tay đang bận, quyết định ngay lúc đó', subject: 'She', verb: 'hold the door open', correctForm: 'will',
  },
  {
    cue: '💬', cueLabel: 'Vừa nhớ ra cần báo cho mọi người, quyết định ngay lúc đó', subject: 'I', verb: 'text the group chat', correctForm: 'will',
  },
  {
    cue: '🪑', cueLabel: 'Thấy thiếu chỗ ngồi, quyết định ngay lúc đó', subject: 'We', verb: 'bring extra chairs', correctForm: 'will',
  },
  {
    cue: '🔍', cueLabel: 'Vừa nghe báo có vấn đề, quyết định ngay lúc đó', subject: 'He', verb: 'look into it right away', correctForm: 'will',
  },
  {
    cue: '🤐', cueLabel: 'Lời hứa ngay lúc nói', subject: 'I', verb: 'keep your secret safe', correctForm: 'will',
  },
  {
    cue: '🔮', cueLabel: 'Dự đoán không chắc chắn về tương lai', subject: 'They', verb: 'probably win this round', correctForm: 'will',
  },
  {
    cue: '😊', cueLabel: 'Lời hứa ngay lúc nói', subject: 'We', verb: 'cheer you up', correctForm: 'will',
  },
];

function buildGoingToWillOption(subject, verb, key) {
  const v = applyPossessive(verb, subject);
  switch (key) {
    case 'going-to-correct':
      return `${subject} ${beForm(subject)} going to ${v}.`;
    case 'going-to-wrong-conj':
      return `${subject} ${wrongBeForm(subject)} going to ${v}.`;
    case 'will-correct':
      return `${subject} will ${v}.`;
    case 'going-to-past':
    default:
      return `${subject} ${pastBeForm(subject)} going to ${v}.`;
  }
}

// Nhân thêm chủ ngữ khác (I/You/He/She/We/They) cho mỗi tình huống KHÔNG PHẢI
// thời tiết (weatherOnly) — beForm/wrongBeForm/pastBeForm đã xử lý đúng mọi
// chủ ngữ này, nên đổi chủ ngữ vẫn ra câu đúng ngữ pháp, giúp số câu hỏi thật
// tăng lên nhiều lần mà không cần viết tay từng tình huống mới.
export const GOINGTOWILL_SUBJECTS = ['I', 'You', 'He', 'She', 'We', 'They'];

export const GOING_TO_WILL_QUESTION_COUNT = GOING_TO_WILL_SCENARIOS.reduce(
  (sum, s) => sum + (s.weatherOnly ? 1 : GOINGTOWILL_SUBJECTS.length),
  0,
);

/** 1 vòng: chọn 1 tình huống + 1 chủ ngữ (thời tiết thì giữ nguyên "It"), sinh 4 câu (đúng theo scenario.correctForm + 3 nhiễu). */
export function makeGoingToWillRound(rng = Math.random) {
  const scenario = pick(GOING_TO_WILL_SCENARIOS, rng);
  const subject = scenario.weatherOnly ? scenario.subject : pick(GOINGTOWILL_SUBJECTS, rng);
  const keys = ['going-to-correct', 'going-to-wrong-conj', 'will-correct', 'going-to-past'];
  const options = shuffle(keys, rng).map((key) => ({
    key,
    sentence: buildGoingToWillOption(subject, scenario.verb, key),
  }));
  const correctKey = scenario.correctForm === 'going-to' ? 'going-to-correct' : 'will-correct';
  return {
    scenario, subject, options, correctKey,
  };
}

export function makeGoingToWillGame(count = 8, rng = Math.random) {
  const rounds = [];
  for (let i = 0; i < count; i++) rounds.push(makeGoingToWillRound(rng));
  return baseGameState(rounds);
}

export function currentGoingToWillRound(game) {
  return currentRoundOf(game);
}

export function answerGoingToWill(game, key) {
  return answerGeneric(game, key, (round) => round.correctKey);
}

/* ===== 5. Modal Ai Đúng ===== */

export const MODALS = ['must', "mustn't", 'should', "shouldn't"];

export const MODAL_SITUATIONS = [
  { icon: '🚭', label: 'Biển cấm hút thuốc', verb: 'smoke here', modal: "mustn't" },
  { icon: '🦺', label: 'Biển bắt buộc đội mũ bảo hiểm', verb: 'wear a helmet on this street', modal: 'must' },
  { icon: '🥦', label: 'Lời khuyên nên ăn nhiều rau', verb: 'eat more vegetables', modal: 'should' },
  { icon: '🍬', label: 'Lời khuyên không nên ăn nhiều kẹo', verb: 'eat too much candy', modal: "shouldn't" },
  { icon: '📵', label: 'Biển cấm dùng điện thoại', verb: 'use your phone in the library', modal: "mustn't" },
  { icon: '🛏️', label: 'Lời khuyên nên ngủ sớm', verb: 'go to bed early', modal: 'should' },
  { icon: '🎟️', label: 'Biển bắt buộc mua vé', verb: 'buy a ticket to enter', modal: 'must' },
  { icon: '🍭', label: 'Lời khuyên không nên ăn nhiều đồ ngọt', verb: 'eat so much sugar', modal: "shouldn't" },
  { icon: '🚦', label: 'Biển báo bắt buộc dừng lại khi đèn đỏ', verb: 'stop at a red light', modal: 'must' },
  { icon: '🧴', label: 'Lời khuyên nên uống đủ nước mỗi ngày', verb: 'drink enough water every day', modal: 'should' },
  { icon: '🔊', label: 'Biển cấm gây ồn sau 10 giờ đêm', verb: 'make noise after 10 pm', modal: "mustn't" },
  { icon: '🎧', label: 'Lời khuyên không nên nghe nhạc quá to', verb: 'listen to loud music', modal: "shouldn't" },
  { icon: '🧯', label: 'Biển bắt buộc có bình chữa cháy trong bếp', verb: 'have a fire extinguisher in the kitchen', modal: 'must' },
  { icon: '🚴', label: 'Biển bắt buộc đội mũ khi đi xe đạp', verb: 'wear a helmet when cycling', modal: 'must' },
  { icon: '🏊', label: 'Biển cấm bơi khi không có người cứu hộ', verb: 'swim without a lifeguard', modal: "mustn't" },
  { icon: '📚', label: 'Lời khuyên nên đọc sách mỗi ngày', verb: 'read books every day', modal: 'should' },
  { icon: '🍟', label: 'Lời khuyên không nên ăn đồ chiên nhiều dầu mỡ', verb: 'eat too much fried food', modal: "shouldn't" },
  { icon: '🚫', label: 'Biển cấm xả rác nơi công cộng', verb: 'litter in public places', modal: "mustn't" },
  { icon: '🦷', label: 'Lời khuyên nên đánh răng hai lần một ngày', verb: 'brush your teeth twice a day', modal: 'should' },
  { icon: '⛔', label: 'Biển cấm vượt đèn đỏ', verb: 'run a red light', modal: "mustn't" },
  { icon: '🧘', label: 'Lời khuyên nên tập thể dục thường xuyên', verb: 'exercise regularly', modal: 'should' },
  { icon: '🔇', label: 'Biển bắt buộc tắt chuông điện thoại trong rạp', verb: 'turn off your phone in the cinema', modal: 'must' },
  { icon: '🍫', label: 'Lời khuyên không nên ăn quá nhiều sô-cô-la', verb: 'eat too much chocolate', modal: "shouldn't" },
  { icon: '🎫', label: 'Biển bắt buộc xuất trình vé trước khi vào', verb: 'show your ticket before entering', modal: 'must' },
  { icon: '🅿️', label: 'Biển cấm đậu xe nơi đây', verb: 'park here', modal: "mustn't" },
  { icon: '🧴', label: 'Lời khuyên nên bôi kem chống nắng', verb: 'wear sunscreen', modal: 'should' },
  { icon: '🚯', label: 'Biển cấm vứt rác bừa bãi', verb: 'throw rubbish on the ground', modal: "mustn't" },
  { icon: '💧', label: 'Lời khuyên nên uống nước trước khi tập thể dục', verb: 'drink water before exercising', modal: 'should' },
  { icon: '🔐', label: 'Biển bắt buộc khóa cửa khi ra ngoài', verb: 'lock the door when you leave', modal: 'must' },
  { icon: '🍚', label: 'Lời khuyên không nên bỏ bữa sáng', verb: 'skip breakfast', modal: "shouldn't" },
  { icon: '🛑', label: 'Biển bắt buộc dừng lại trước biển báo dừng', verb: 'stop at the stop sign', modal: 'must' },
  { icon: '📱', label: 'Lời khuyên không nên dùng điện thoại khi lái xe', verb: 'use your phone while driving', modal: "mustn't" },
  { icon: '🚸', label: 'Biển bắt buộc đi chậm gần trường học', verb: 'drive slowly near the school', modal: 'must' },
  { icon: '🕯️', label: 'Lời khuyên không nên chơi với nến/lửa', verb: 'play with candles', modal: "shouldn't" },
  { icon: '🧢', label: 'Lời khuyên nên đội mũ khi trời nắng', verb: 'wear a cap in the sun', modal: 'should' },
  { icon: '📴', label: 'Biển bắt buộc tắt thiết bị điện tử trên máy bay', verb: 'turn off electronic devices on the plane', modal: 'must' },
  { icon: '🚮', label: 'Biển cấm hút thuốc gần thùng rác dễ cháy', verb: 'smoke near flammable bins', modal: "mustn't" },
  { icon: '🥤', label: 'Lời khuyên không nên uống nước ngọt có ga quá nhiều', verb: 'drink too much soda', modal: "shouldn't" },
  { icon: '🦺', label: 'Biển bắt buộc mặc áo phao khi đi thuyền', verb: 'wear a life jacket on the boat', modal: 'must' },
  { icon: '🌵', label: 'Biển cấm hái hoa/cây trong công viên', verb: 'pick flowers in the park', modal: "mustn't" },
  { icon: '🧻', label: 'Lời khuyên nên rửa tay trước khi ăn', verb: 'wash your hands before eating', modal: 'should' },
  { icon: '🚭', label: 'Biển cấm hút thuốc trong bệnh viện', verb: 'smoke inside the hospital', modal: "mustn't" },
  { icon: '🥽', label: 'Biển bắt buộc đeo kính bảo hộ trong phòng thí nghiệm', verb: 'wear safety goggles in the lab', modal: 'must' },
  { icon: '🍭', label: 'Lời khuyên không nên ăn kẹo trước khi đi ngủ', verb: 'eat candy before bed', modal: "shouldn't" },
  { icon: '🚴', label: 'Biển cấm đạp xe trên vỉa hè', verb: 'ride a bike on the sidewalk', modal: "mustn't" },
  { icon: '💧', label: 'Lời khuyên nên tưới cây mỗi ngày', verb: 'water the plants every day', modal: 'should' },
  { icon: '🦺', label: 'Biển bắt buộc thắt dây an toàn trong xe', verb: 'wear a seatbelt in the car', modal: 'must' },
  { icon: '🎓', label: 'Quy định bắt buộc dự đủ các buổi học để tốt nghiệp', verb: 'attend all classes to graduate', modal: 'must' },
  { icon: '📋', label: 'Quy định bắt buộc điền đầy đủ biểu mẫu', verb: 'fill out the form completely', modal: 'must' },
  { icon: '🧑‍⚕️', label: 'Bác sĩ dặn phải uống thuốc đúng giờ', verb: 'take the medicine on time', modal: 'must' },
  { icon: '🔋', label: 'Quy định bắt buộc thay pin báo khói định kỳ', verb: 'charge the smoke detector battery', modal: 'must' },
  { icon: '🧑‍🏫', label: 'Quy định lớp học bắt buộc giơ tay trước khi nói', verb: 'raise your hand before speaking', modal: 'must' },
  { icon: '🚪', label: 'Quy định bắt buộc đóng cửa nhẹ nhàng ban đêm', verb: 'close the door quietly at night', modal: 'must' },
  { icon: '🧯', label: 'Quy định an toàn bắt buộc biết lối thoát hiểm', verb: 'know where the exits are', modal: 'must' },
  { icon: '🛂', label: 'Quy định sân bay bắt buộc xuất trình hộ chiếu', verb: 'show your passport at the airport', modal: 'must' },
  { icon: '🐕', label: 'Biển bắt buộc xích chó khi vào công viên', verb: 'keep dogs on a leash in the park', modal: 'must' },
  { icon: '🚭', label: 'Biển cấm hút thuốc trong thang máy', verb: 'smoke in the elevator', modal: "mustn't" },
  { icon: '📵', label: 'Biển cấm chụp ảnh có đèn flash trong bảo tàng', verb: 'use flash photography in the museum', modal: "mustn't" },
  { icon: '🍖', label: 'Biển cấm cho thú hoang ăn', verb: 'feed the wild animals', modal: "mustn't" },
  { icon: '🚗', label: 'Luật cấm lái xe khi chưa có bằng lái', verb: 'drive without a license', modal: "mustn't" },
  { icon: '🧨', label: 'Biển cấm tự ý chơi pháo hoa một mình', verb: 'play with fireworks alone', modal: "mustn't" },
  { icon: '🐟', label: 'Lời nhắc cấm cho cá trong bể ăn quá nhiều', verb: 'overfeed the fish in the tank', modal: "mustn't" },
  { icon: '🚪', label: 'Lời nhắc cấm để cửa tủ lạnh mở', verb: 'leave the fridge door open', modal: "mustn't" },
  { icon: '🔊', label: 'Biển cấm la hét trong thư viện', verb: 'shout in the library', modal: "mustn't" },
  { icon: '🧴', label: 'Lời nhắc cấm dùng chung thuốc với người khác', verb: 'share medicine with others', modal: "mustn't" },
  { icon: '🚯', label: 'Biển cấm đổ dầu ăn xuống bồn rửa', verb: 'pour oil down the sink', modal: "mustn't" },
  { icon: '🥗', label: 'Lời khuyên nên ăn uống cân bằng đủ chất', verb: 'eat a balanced diet', modal: 'should' },
  { icon: '🛌', label: 'Lời khuyên nên đi ngủ đúng giờ', verb: 'go to bed on time', modal: 'should' },
  { icon: '📖', label: 'Lời khuyên nên xem lại bài trước khi kiểm tra', verb: 'review your notes before the test', modal: 'should' },
  { icon: '🧴', label: 'Lời khuyên nên thoa kem dưỡng sau khi tắm', verb: 'apply lotion after a shower', modal: 'should' },
  { icon: '🚶', label: 'Lời khuyên nên đi bộ sau bữa ăn', verb: 'take a walk after meals', modal: 'should' },
  { icon: '🧑‍🤝‍🧑', label: 'Lời khuyên nên tử tế với bạn học mới', verb: 'be kind to new students', modal: 'should' },
  { icon: '🧹', label: 'Lời khuyên nên dọn bàn trước khi ra về', verb: 'tidy your desk before leaving', modal: 'should' },
  { icon: '🚰', label: 'Lời khuyên nên tắt vòi nước khi đánh răng', verb: 'turn off the tap while brushing', modal: 'should' },
  { icon: '🧢', label: 'Lời khuyên nên khởi động trước khi tập thể dục', verb: 'stretch before exercising', modal: 'should' },
  { icon: '📱', label: 'Lời khuyên không nên xem điện thoại lúc ăn tối', verb: 'check your phone during dinner', modal: "shouldn't" },
  { icon: '🍭', label: 'Lời khuyên không nên ăn kẹo ngọt ngay trước khi ngủ', verb: 'eat sweets right before bed', modal: "shouldn't" },
  { icon: '🚗', label: 'Lời khuyên không nên nhắn tin khi đang lái xe', verb: 'text while driving', modal: "shouldn't" },
  { icon: '🎮', label: 'Lời khuyên không nên chơi game thâu đêm', verb: 'play video games all night', modal: "shouldn't" },
  { icon: '🧢', label: 'Lời khuyên không nên để bài tập tới phút chót', verb: 'leave your homework until the last minute', modal: "shouldn't" },
  { icon: '🍔', label: 'Lời khuyên không nên ăn đồ ăn nhanh mỗi ngày', verb: 'eat fast food every day', modal: "shouldn't" },
  { icon: '🧴', label: 'Lời khuyên không nên chạm tay bẩn lên mặt', verb: 'touch your face with dirty hands', modal: "shouldn't" },
  { icon: '🚴', label: 'Lời khuyên không nên đi xe đạp mà chưa kiểm tra phanh', verb: 'ride without checking your brakes', modal: "shouldn't" },
  { icon: '🐾', label: 'Lời khuyên không nên trêu chọc thú cưng của người khác', verb: "tease other people's pets", modal: "shouldn't" },
  { icon: '🧤', label: 'Quy định bắt buộc đeo găng tay khi xử lý hóa chất', verb: 'wear gloves when handling chemicals', modal: 'must' },
  { icon: '🪪', label: 'Quy định bắt buộc mang giấy tờ tùy thân', verb: 'carry identification at all times', modal: 'must' },
  { icon: '📋', label: 'Quy định bắt buộc tuân thủ hướng dẫn an toàn', verb: 'follow the safety instructions', modal: 'must' },
  { icon: '📚', label: 'Quy định bắt buộc trả sách thư viện đúng hạn', verb: 'return library books on time', modal: 'must' },
  { icon: '🍎', label: 'Lời nhắc bắt buộc rửa trái cây trước khi ăn', verb: 'wash fruit before eating it', modal: 'must' },
  { icon: '🚗', label: 'Quy định bắt buộc nhìn gương trước khi rẽ', verb: 'check the mirror before turning', modal: 'must' },
  { icon: '💻', label: 'Quy định bắt buộc cập nhật phần mềm thường xuyên', verb: 'update the software regularly', modal: 'must' },
  { icon: '📝', label: 'Quy định bắt buộc ký sổ khách ra vào', verb: 'sign the visitor logbook', modal: 'must' },
  { icon: '🧾', label: 'Lời nhắc bắt buộc giữ hóa đơn để đổi trả', verb: 'keep the receipt for refunds', modal: 'must' },
  { icon: '🕯️', label: 'Biển cấm để nến cháy mà không trông coi', verb: 'leave candles unattended', modal: "mustn't" },
  { icon: '🔒', label: 'Lời nhắc cấm dùng mật khẩu của người khác', verb: "use someone else's password", modal: "mustn't" },
  { icon: '🧗', label: 'Biển cấm trèo qua hàng rào', verb: 'climb over the fence', modal: "mustn't" },
  { icon: '⛈️', label: 'Biển cấm bơi khi có giông bão', verb: 'swim during a thunderstorm', modal: "mustn't" },
  { icon: '🚪', label: 'Biển cấm chắn lối thoát hiểm', verb: 'block the emergency exit', modal: "mustn't" },
  { icon: '🔥', label: 'Lời nhắc cấm chạm vào bếp đang nóng', verb: 'touch the hot stove', modal: "mustn't" },
  { icon: '🚦', label: 'Luật cấm băng qua đường khi đèn đỏ', verb: 'cross the street on a red light', modal: "mustn't" },
  { icon: '😴', label: 'Lời nhắc cấm làm ồn khi em bé đang ngủ', verb: 'disturb the sleeping baby', modal: "mustn't" },
  { icon: '💰', label: 'Lời khuyên nên tiết kiệm một ít tiền mỗi tháng', verb: 'save some money each month', modal: 'should' },
  { icon: '🤸', label: 'Lời khuyên nên khởi động trước khi chơi thể thao', verb: 'warm up before playing sports', modal: 'should' },
  { icon: '📝', label: 'Lời khuyên nên đọc lại bài luận trước khi nộp', verb: 'proofread your essay', modal: 'should' },
  { icon: '♻️', label: 'Lời khuyên nên tái chế chai nhựa', verb: 'recycle plastic bottles', modal: 'should' },
  { icon: '🗄️', label: 'Lời khuyên nên giữ góc học tập gọn gàng', verb: 'keep your workspace tidy', modal: 'should' },
  { icon: '🙏', label: 'Lời khuyên nên cảm ơn khi được giúp đỡ', verb: "thank people for their help", modal: 'should' },
  { icon: '🥾', label: 'Lời khuyên nên mang giày thoải mái khi leo núi', verb: 'wear comfortable shoes for hiking', modal: 'should' },
  { icon: '🏷️', label: 'Lời khuyên nên dán nhãn đồ đạc rõ ràng', verb: 'label your belongings clearly', modal: 'should' },
  { icon: '🙅', label: 'Lời khuyên không nên so sánh bản thân với người khác', verb: 'compare yourself to others', modal: "shouldn't" },
  { icon: '🍽️', label: 'Lời khuyên không nên lãng phí đồ ăn', verb: 'waste food unnecessarily', modal: "shouldn't" },
  { icon: '💸', label: 'Lời khuyên không nên mượn tiền mà không hỏi trước', verb: 'borrow money without asking', modal: "shouldn't" },
  { icon: '👪', label: 'Lời khuyên không nên phớt lờ lời khuyên của cha mẹ', verb: "ignore your parents' advice", modal: "shouldn't" },
  { icon: '🔥', label: 'Lời khuyên không nên rời bếp đang nấu mà không trông', verb: 'leave the stove unattended', modal: "shouldn't" },
  { icon: '🔑', label: 'Lời khuyên không nên chia sẻ mật khẩu cá nhân trên mạng', verb: 'share personal passwords online', modal: "shouldn't" },
  { icon: '⏱️', label: 'Lời khuyên không nên làm bài tập vội vàng', verb: 'rush through your homework', modal: "shouldn't" },
  { icon: '🍽️', label: 'Lời khuyên không nên cãi nhau trong bữa ăn', verb: 'argue during a meal', modal: "shouldn't" },
  // ----- Bổ sung vòng mục tiêu 850 -----
  { icon: '⛑️', label: 'Biển bắt buộc đội mũ cứng ở công trường', verb: 'wear a hard hat on the construction site', modal: 'must' },
  { icon: '🪪', label: 'Yêu cầu bắt buộc xuất trình giấy tờ ở ngân hàng', verb: 'show identification at the bank', modal: 'must' },
  { icon: '🪖', label: 'Quy định bắt buộc cài chặt dây mũ bảo hiểm', verb: 'fasten your helmet strap securely', modal: 'must' },
  { icon: '🎫', label: 'Quy định bắt buộc giữ vé đến hết chuyến đi', verb: 'keep your ticket until the end of the trip', modal: 'must' },
  { icon: '📝', label: 'Quy định bắt buộc đăng ký trước khi tham gia chuyến đi', verb: 'register before joining the trip', modal: 'must' },
  { icon: '🚨', label: 'Quy định bắt buộc báo cáo tai nạn ngay lập tức', verb: 'report any accident immediately', modal: 'must' },
  { icon: '🧼', label: 'Quy định bắt buộc rửa tay sau khi cầm thịt sống', verb: 'wash your hands after handling raw meat', modal: 'must' },
  { icon: '🔪', label: 'Cảnh báo không nên để dụng cụ sắc nhọn trong tầm tay trẻ nhỏ', verb: "leave sharp tools within a child's reach", modal: "mustn't" },
  { icon: '🪥', label: 'Quy định cấm dùng chung bàn chải đánh răng', verb: "use someone else's toothbrush", modal: "mustn't" },
  { icon: '🏊', label: 'Cảnh báo không nên bơi ngay sau khi ăn no', verb: 'swim right after a big meal', modal: "mustn't" },
  { icon: '📚', label: 'Biển cấm la hét trong phòng đọc yên tĩnh', verb: 'shout across the quiet reading room', modal: "mustn't" },
  { icon: '💧', label: 'Cảnh báo không được để sàn ướt mà không có biển báo', verb: 'leave wet floors without a warning sign', modal: "mustn't" },
  { icon: '🧪', label: 'Cảnh báo không được trộn thuốc tẩy với hóa chất khác', verb: 'mix bleach with other cleaning chemicals', modal: "mustn't" },
  { icon: '🍵', label: 'Lời khuyên nên uống trà thảo mộc khi đau họng', verb: 'drink herbal tea when you have a sore throat', modal: 'should' },
  { icon: '💾', label: 'Lời khuyên nên sao lưu tệp tin thường xuyên', verb: 'back up your files regularly', modal: 'should' },
  { icon: '👋', label: 'Lời khuyên nên chào hỏi hàng xóm lịch sự', verb: 'greet your neighbors politely', modal: 'should' },
  { icon: '🎒', label: 'Lời khuyên nên kiểm tra lại túi trước chuyến đi', verb: 'double-check your bag before a trip', modal: 'should' },
  { icon: '🧘', label: 'Lời khuyên nên nghỉ ngơi sau khi tập luyện mạnh', verb: 'rest after an intense workout', modal: 'should' },
  { icon: '🍱', label: 'Lời khuyên nên lên kế hoạch bữa ăn cho cả tuần', verb: 'plan your meals for the week', modal: 'should' },
  { icon: '🏃', label: 'Lời khuyên không nên bỏ qua khởi động trước khi chạy', verb: 'skip warm-up exercises before a run', modal: "shouldn't" },
  { icon: '🚲', label: 'Lời khuyên không nên để xe đạp ngoài trời mà không khóa', verb: 'leave your bike unlocked outside', modal: "shouldn't" },
  { icon: '🗣️', label: 'Lời khuyên không nên ngắt lời người đang nói', verb: 'interrupt someone who is speaking', modal: "shouldn't" },
  { icon: '📱', label: 'Lời khuyên không nên chăm chú vào điện thoại khi đi bộ', verb: 'stare at your phone while walking', modal: "shouldn't" },
  { icon: '📊', label: 'Lời khuyên không nên so sánh điểm số với bạn bè', verb: "compare your grades to your friends'", modal: "shouldn't" },
  { icon: '⏳', label: 'Lời khuyên không nên trì hoãn việc quan trọng', verb: 'procrastinate on important tasks', modal: "shouldn't" },
  // ----- Bổ sung vòng mục tiêu 1000 -----
  { icon: '🦺', label: 'Quy định bắt buộc mặc áo phản quang ban đêm', verb: 'wear a reflective vest at night', modal: 'must' },
  { icon: '📋', label: 'Quy định bắt buộc hoàn thành khóa huấn luyện an toàn', verb: 'complete the safety training', modal: 'must' },
  { icon: '🧾', label: 'Quy định bắt buộc giữ hóa đơn chi phí công ty', verb: 'keep receipts for company expenses', modal: 'must' },
  { icon: '🤧', label: 'Quy định bắt buộc báo cô giáo về dị ứng của bé', verb: 'inform the teacher about allergies', modal: 'must' },
  { icon: '🪜', label: 'Quy định bắt buộc cố định thang trước khi leo', verb: 'secure the ladder before climbing', modal: 'must' },
  { icon: '💊', label: 'Quy định bắt buộc kiểm tra hạn sử dụng thuốc', verb: 'check the expiration date on medicine', modal: 'must' },
  { icon: '🛂', label: 'Quy định bắt buộc gia hạn hộ chiếu trước khi hết hạn', verb: 'renew the passport before it expires', modal: 'must' },
  { icon: '🏊', label: 'Cảnh báo không được để trẻ nhỏ một mình gần hồ bơi', verb: 'leave children unattended near a pool', modal: "mustn't" },
  { icon: '🚨', label: 'Cảnh báo không được nghịch chuông báo cháy', verb: 'tamper with the fire alarm', modal: "mustn't" },
  { icon: '📦', label: 'Cảnh báo không được chặn cầu thang bằng thùng đồ', verb: 'block the stairwell with boxes', modal: "mustn't" },
  { icon: '🪖', label: 'Cảnh báo không được dùng mũ bảo hiểm bị nứt', verb: 'use a cracked helmet', modal: "mustn't" },
  { icon: '🔥', label: 'Cảnh báo không được để lửa trại cháy mà không trông', verb: 'leave a campfire burning unattended', modal: "mustn't" },
  { icon: '🔌', label: 'Cảnh báo không được cắm quá nhiều thiết bị vào 1 ổ điện', verb: 'plug too many devices into one outlet', modal: "mustn't" },
  { icon: '🏷️', label: 'Lời khuyên nên ghi ngày tháng lên đồ ăn thừa', verb: 'label leftovers with the date', modal: 'should' },
  { icon: '🌬️', label: 'Lời khuyên nên mở cửa sổ thông gió mỗi sáng', verb: 'air out the room every morning', modal: 'should' },
  { icon: '🩹', label: 'Lời khuyên nên có hộp sơ cứu ở nhà', verb: 'keep a first-aid kit at home', modal: 'should' },
  { icon: '🌟', label: 'Lời khuyên nên làm gương tốt cho các em nhỏ hơn', verb: 'set a good example for younger kids', modal: 'should' },
  { icon: '📖', label: 'Lời khuyên nên đọc hướng dẫn trước khi lắp ráp', verb: 'read the instructions before assembling', modal: 'should' },
  { icon: '🎤', label: 'Lời khuyên nên khởi động giọng trước khi hát', verb: 'warm up your voice before singing', modal: 'should' },
  { icon: '🍽️', label: 'Lời khuyên không nên để bát đĩa trong bồn qua đêm', verb: 'leave dishes in the sink overnight', modal: "shouldn't" },
  { icon: '📵', label: 'Lời khuyên không nên nhắn tin lại ngay trong giờ học', verb: 'text back immediately during class', modal: "shouldn't" },
  { icon: '🙅', label: 'Lời khuyên không nên đánh giá người khác qua vẻ ngoài', verb: "judge people by their appearance", modal: "shouldn't" },
  { icon: '🔥', label: 'Lời khuyên không nên để bếp ga cháy mà không trông', verb: 'leave the gas stove on unattended', modal: "shouldn't" },
  { icon: '📝', label: 'Lời khuyên không nên chép bài của người khác', verb: "copy someone else's homework", modal: "shouldn't" },
  { icon: '🤫', label: 'Lời khuyên không nên giữ những bí mật có thể làm hại ai đó', verb: 'keep secrets that could hurt someone', modal: "shouldn't" },
];

// Nhân thêm chủ ngữ khác (không chỉ "You") — động từ khuyết thiếu (must/
// should...) KHÔNG chia theo ngôi nào cả, nên đổi chủ ngữ luôn ra câu đúng
// ngữ pháp 100%, giúp tăng số câu hỏi thật mà không cần thêm tình huống mới.
export const MODAL_SUBJECTS = ['You', 'I', 'He', 'She', 'We', 'They'];

function buildModalSentence(subject, situation, modal) {
  return `${subject} ${modal} ${applyPossessive(situation.verb, subject)}.`;
}

/** 1 vòng: chọn 1 tình huống + 1 chủ ngữ, 4 lựa chọn = đúng 4 modal cố định (must/mustn't/should/shouldn't). */
export function makeModalRound(rng = Math.random) {
  const situation = pick(MODAL_SITUATIONS, rng);
  const subject = pick(MODAL_SUBJECTS, rng);
  const options = shuffle(MODALS, rng).map((modal) => ({
    modal,
    sentence: buildModalSentence(subject, situation, modal),
  }));
  return {
    situation, subject, options, correctModal: situation.modal,
  };
}

export function makeModalGame(count = 8, rng = Math.random) {
  const rounds = [];
  for (let i = 0; i < count; i++) rounds.push(makeModalRound(rng));
  return baseGameState(rounds);
}

export function currentModalRound(game) {
  return currentRoundOf(game);
}

export function answerModal(game, modal) {
  return answerGeneric(game, modal, (round) => round.correctModal);
}

/* ===== 6. Câu Điều Kiện Loại 1 ===== */

export const CONDITIONAL_SITUATIONS = [
  {
    cue: '🌧️', label: 'Trời mưa → ở nhà', ifSubject: 'it', ifBase: 'rain', ifPresent: 'it rains', resultWill: 'I will stay home', resultBase: 'I stay home', ifPast: 'it rained',
  },
  {
    cue: '⏰', label: 'Dậy sớm → kịp xe buýt', ifSubject: 'you', ifBase: 'get up early', ifPresent: 'you get up early', resultWill: 'you will catch the bus', resultBase: 'you catch the bus', ifPast: 'you got up early',
  },
  {
    cue: '📚', label: 'Học chăm → đỗ kỳ thi', ifSubject: 'she', ifBase: 'study hard', ifPresent: 'she studies hard', resultWill: 'she will pass the exam', resultBase: 'she passes the exam', ifPast: 'she studied hard',
  },
  {
    cue: '🍔', label: 'Ăn quá nhiều đồ ăn nhanh → bị ốm', ifSubject: 'he', ifBase: 'eat too much fast food', ifPresent: 'he eats too much fast food', resultWill: 'he will get sick', resultBase: 'he gets sick', ifPast: 'he ate too much fast food',
  },
  {
    cue: '💧', label: 'Cây thiếu nước → cây chết', ifSubject: 'the plant', ifBase: 'not get water', ifPresent: "the plant doesn't get water", resultWill: 'it will die', resultBase: 'it dies', ifPast: "the plant didn't get water",
  },
  {
    cue: '🎉', label: 'Đội thắng → cả đội ăn mừng', ifSubject: 'the team', ifBase: 'win', ifPresent: 'the team wins', resultWill: 'they will celebrate', resultBase: 'they celebrate', ifPast: 'the team won',
  },
  {
    cue: '⚽', label: 'Luyện tập chăm chỉ → thắng trận đấu', ifSubject: 'we', ifBase: 'practice hard', ifPresent: 'we practice hard', resultWill: 'we will win the match', resultBase: 'we win the match', ifPast: 'we practiced hard',
  },
  {
    cue: '💤', label: 'Ngủ đủ giấc → tỉnh táo đi học', ifSubject: 'you', ifBase: 'sleep enough', ifPresent: 'you sleep enough', resultWill: 'you will feel fresh for school', resultBase: 'you feel fresh for school', ifPast: 'you slept enough',
  },
  {
    cue: '🔥', label: 'Chạm vào lửa → bị bỏng', ifSubject: 'he', ifBase: 'touch the fire', ifPresent: 'he touches the fire', resultWill: 'he will get burned', resultBase: 'he gets burned', ifPast: 'he touched the fire',
  },
  {
    cue: '💰', label: 'Tiết kiệm tiền → mua được xe đạp mới', ifSubject: 'you', ifBase: 'save money', ifPresent: 'you save money', resultWill: 'you will buy a new bike', resultBase: 'you buy a new bike', ifPast: 'you saved money',
  },
  {
    cue: '🌱', label: 'Trồng cây → cây lớn lên xanh tốt', ifSubject: 'we', ifBase: 'plant a tree', ifPresent: 'we plant a tree', resultWill: 'it will grow tall and green', resultBase: 'it grows tall and green', ifPast: 'we planted a tree',
  },
  {
    cue: '🚗', label: 'Lái xe quá nhanh → dễ gặp tai nạn', ifSubject: 'he', ifBase: 'drive too fast', ifPresent: 'he drives too fast', resultWill: 'he will have an accident', resultBase: 'he has an accident', ifPast: 'he drove too fast',
  },
  {
    cue: '📖', label: 'Làm theo hướng dẫn → hiểu rõ cách chơi', ifSubject: 'you', ifBase: 'follow the instructions', ifPresent: 'you follow the instructions', resultWill: 'you will understand the game', resultBase: 'you understand the game', ifPast: 'you followed the instructions',
  },
  {
    cue: '🧊', label: 'Để đá ngoài trời nắng → đá tan chảy', ifSubject: 'the ice', ifBase: 'stay in the sun', ifPresent: 'the ice stays in the sun', resultWill: 'it will melt', resultBase: 'it melts', ifPast: 'the ice stayed in the sun',
  },
  {
    cue: '🐝', label: 'Chọc tổ ong → bị ong đốt', ifSubject: 'you', ifBase: 'poke a beehive', ifPresent: 'you poke a beehive', resultWill: 'the bees will sting you', resultBase: 'the bees sting you', ifPast: 'you poked a beehive',
  },
  {
    cue: '🎹', label: 'Luyện đàn mỗi ngày → chơi rất giỏi', ifSubject: 'she', ifBase: 'practice the piano every day', ifPresent: 'she practices the piano every day', resultWill: 'she will play very well', resultBase: 'she plays very well', ifPast: 'she practiced the piano every day',
  },
  {
    cue: '🚭', label: 'Hút thuốc lá → hại sức khỏe', ifSubject: 'you', ifBase: 'smoke', ifPresent: 'you smoke', resultWill: 'you will damage your health', resultBase: 'you damage your health', ifPast: 'you smoked',
  },
  {
    cue: '🌡️', label: 'Đun nước sôi → nước bốc hơi', ifSubject: 'water', ifBase: 'boil', ifPresent: 'water boils', resultWill: 'it will turn into steam', resultBase: 'it turns into steam', ifPast: 'water boiled',
  },
  {
    cue: '🐟', label: 'Cho cá ăn quá nhiều → cá bị bệnh', ifSubject: 'you', ifBase: 'overfeed the fish', ifPresent: 'you overfeed the fish', resultWill: 'the fish will get sick', resultBase: 'the fish gets sick', ifPast: 'you overfed the fish',
  },
  {
    cue: '🎨', label: 'Trộn màu xanh và vàng → ra màu xanh lá', ifSubject: 'you', ifBase: 'mix blue and yellow', ifPresent: 'you mix blue and yellow', resultWill: 'you will get green', resultBase: 'you get green', ifPast: 'you mixed blue and yellow',
  },
  {
    cue: '🕰️', label: 'Đi làm muộn → bị sếp nhắc nhở', ifSubject: 'he', ifBase: 'arrive late for work', ifPresent: 'he arrives late for work', resultWill: 'his boss will remind him', resultBase: 'his boss reminds him', ifPast: 'he arrived late for work',
  },
  {
    cue: '🌻', label: 'Cây thiếu ánh sáng → cây không nở hoa', ifSubject: 'the flower', ifBase: 'not get sunlight', ifPresent: "the flower doesn't get sunlight", resultWill: 'it will not bloom', resultBase: 'it does not bloom', ifPast: "the flower didn't get sunlight",
  },
  {
    cue: '🎣', label: 'Câu cá kiên nhẫn → bắt được cá to', ifSubject: 'he', ifBase: 'fish patiently', ifPresent: 'he fishes patiently', resultWill: 'he will catch a big fish', resultBase: 'he catches a big fish', ifPast: 'he fished patiently',
  },
  {
    cue: '🧹', label: 'Dọn phòng gọn gàng → mẹ vui', ifSubject: 'you', ifBase: 'clean your room', ifPresent: 'you clean your room', resultWill: 'your mom will be happy', resultBase: 'your mom is happy', ifPast: 'you cleaned your room',
  },
  {
    cue: '🚴', label: 'Đội mũ bảo hiểm khi đạp xe → an toàn hơn', ifSubject: 'you', ifBase: 'wear a helmet', ifPresent: 'you wear a helmet', resultWill: 'you will be safer', resultBase: 'you are safer', ifPast: 'you wore a helmet',
  },
  {
    cue: '🍬', label: 'Ăn kẹo trước bữa ăn → không thấy đói', ifSubject: 'you', ifBase: 'eat candy before a meal', ifPresent: 'you eat candy before a meal', resultWill: "you will not feel hungry", resultBase: "you do not feel hungry", ifPast: 'you ate candy before a meal',
  },
  {
    cue: '📵', label: 'Không sạc điện thoại → hết pin', ifSubject: 'you', ifBase: 'not charge your phone', ifPresent: "you don't charge your phone", resultWill: 'it will run out of battery', resultBase: 'it runs out of battery', ifPast: "you didn't charge your phone",
  },
  {
    cue: '🍦', label: 'Để kem vào tủ đông → kem đông cứng', ifSubject: 'she', ifBase: 'put the ice cream in the freezer', ifPresent: 'she puts the ice cream in the freezer', resultWill: 'it will freeze solid', resultBase: 'it freezes solid', ifPast: 'she put the ice cream in the freezer',
  },
  {
    cue: '🚿', label: 'Tắm nước quá nóng → bị bỏng', ifSubject: 'you', ifBase: 'take a very hot shower', ifPresent: 'you take a very hot shower', resultWill: 'you will get burned', resultBase: 'you get burned', ifPast: 'you took a very hot shower',
  },
  {
    cue: '🎈', label: 'Bơm bóng bay quá căng → bóng nổ', ifSubject: 'you', ifBase: 'blow up the balloon too much', ifPresent: 'you blow up the balloon too much', resultWill: 'it will burst', resultBase: 'it bursts', ifPast: 'you blew up the balloon too much',
  },
  {
    cue: '🎨', label: 'Trộn màu đỏ và trắng → ra màu hồng', ifSubject: 'you', ifBase: 'mix red and white', ifPresent: 'you mix red and white', resultWill: 'you will get pink', resultBase: 'you get pink', ifPast: 'you mixed red and white',
  },
  {
    cue: '🏊', label: 'Bơi mà không khởi động → dễ bị chuột rút', ifSubject: 'you', ifBase: 'swim without warming up', ifPresent: 'you swim without warming up', resultWill: 'you will get a cramp', resultBase: 'you get a cramp', ifPast: 'you swam without warming up',
  },
  {
    cue: '📚', label: 'Học chăm chỉ mỗi ngày → điểm số cải thiện', ifSubject: 'he', ifBase: 'study every day', ifPresent: 'he studies every day', resultWill: 'his grades will improve', resultBase: 'his grades improve', ifPast: 'he studied every day',
  },
  {
    cue: '🌙', label: 'Thức khuya quá nhiều → mệt mỏi vào hôm sau', ifSubject: 'you', ifBase: 'stay up too late', ifPresent: 'you stay up too late', resultWill: 'you will feel tired the next day', resultBase: 'you feel tired the next day', ifPast: 'you stayed up too late',
  },
  {
    cue: '🚗', label: 'Không thắt dây an toàn → gặp nguy hiểm', ifSubject: 'you', ifBase: 'not wear a seatbelt', ifPresent: "you don't wear a seatbelt", resultWill: 'you will be in danger', resultBase: 'you are in danger', ifPast: "you didn't wear a seatbelt",
  },
  {
    cue: '🎈', label: 'Thả bóng bay lên trời → bóng bay đi xa', ifSubject: 'you', ifBase: 'release the balloon', ifPresent: 'you release the balloon', resultWill: 'it will fly far away', resultBase: 'it flies far away', ifPast: 'you released the balloon',
  },
  {
    cue: '🧻', label: 'Rửa tay trước khi ăn → tránh vi khuẩn', ifSubject: 'you', ifBase: 'wash your hands before eating', ifPresent: 'you wash your hands before eating', resultWill: 'you will avoid germs', resultBase: 'you avoid germs', ifPast: 'you washed your hands before eating',
  },
  {
    cue: '🦺', label: 'Mặc áo phao khi đi thuyền → an toàn hơn', ifSubject: 'you', ifBase: 'wear a life jacket', ifPresent: 'you wear a life jacket', resultWill: 'you will be safer on the boat', resultBase: 'you are safer on the boat', ifPast: 'you wore a life jacket',
  },
  {
    cue: '🍓', label: 'Rửa dâu tây trước khi ăn → sạch hơn', ifSubject: 'she', ifBase: 'wash the strawberries', ifPresent: 'she washes the strawberries', resultWill: 'they will be cleaner', resultBase: 'they are cleaner', ifPast: 'she washed the strawberries',
  },
  {
    cue: '🔑', label: 'Quên chìa khóa ở nhà → không vào được cửa', ifSubject: 'you', ifBase: 'forget your keys', ifPresent: 'you forget your keys', resultWill: "you will not be able to get in", resultBase: "you cannot get in", ifPast: 'you forgot your keys',
  },
  {
    cue: '🎣', label: 'Chuẩn bị mồi kỹ → câu được nhiều cá', ifSubject: 'he', ifBase: 'prepare good bait', ifPresent: 'he prepares good bait', resultWill: 'he will catch many fish', resultBase: 'he catches many fish', ifPast: 'he prepared good bait',
  },
  {
    cue: '🥽', label: 'Đeo kính bảo hộ trong phòng thí nghiệm → tránh bị thương', ifSubject: 'you', ifBase: 'wear safety goggles', ifPresent: 'you wear safety goggles', resultWill: 'you will avoid injury', resultBase: 'you avoid injury', ifPast: 'you wore safety goggles',
  },
  {
    cue: '💧', label: 'Không tưới cây → cây héo', ifSubject: 'you', ifBase: 'not water the plants', ifPresent: "you don't water the plants", resultWill: 'they will wilt', resultBase: 'they wilt', ifPast: "you didn't water the plants",
  },
  {
    cue: '🎭', label: 'Luyện tập kịch chăm chỉ → biểu diễn thành công', ifSubject: 'they', ifBase: 'practice the play hard', ifPresent: 'they practice the play hard', resultWill: 'the show will be a success', resultBase: 'the show is a success', ifPast: 'they practiced the play hard',
  },
];

const CONDITIONAL_SUBJECTS = ['I', 'you', 'he', 'she', 'we', 'they'];
const CONDITIONAL_3RD_PERSON = ['he', 'she'];
const CONDITIONAL_POSSESSIVE = {
  I: 'my', you: 'your', he: 'his', she: 'her', we: 'our', they: 'their',
};
const CONDITIONAL_REFLEXIVE = {
  I: 'myself', you: 'yourself', he: 'himself', she: 'herself', we: 'ourselves', they: 'themselves',
};

function conditionalThirdPerson(verb) {
  if (verb === 'have') return 'has';
  if (/(s|sh|ch|x|z|o)$/.test(verb)) return `${verb}es`;
  if (/[^aeiou]y$/.test(verb)) return `${verb.slice(0, -1)}ies`;
  return `${verb}s`;
}

function fillConditionalPlaceholders(text, subject) {
  return text.replace(/\{poss\}/g, CONDITIONAL_POSSESSIVE[subject]).replace(/\{refl\}/g, CONDITIONAL_REFLEXIVE[subject]);
}

// Mỗi template = 1 cặp nguyên nhân→kết quả do CÙNG 1 chủ ngữ thực hiện cả 2
// vế (vd "nếu X học chăm, X sẽ đỗ") — nhân với CONDITIONAL_SUBJECTS (6 chủ
// ngữ) để tăng số câu hỏi thật lên nhiều lần mà vẫn đảm bảo đúng ngữ pháp
// 100% (tự chia đúng "-s" ngôi thứ 3 số ít, đúng đại từ sở hữu {poss}/phản
// thân {refl} theo từng chủ ngữ) — không cần viết tay 200+ câu riêng lẻ.
const CONDITIONAL_TEMPLATES = [
  { cue: '🦷', label: 'Đánh răng mỗi ngày → có hàm răng khỏe mạnh', ifVerb: 'brush', ifVerbPast: 'brushed', ifRest: '{poss} teeth every day', resultVerb: 'have', resultRest: 'healthy teeth' },
  { cue: '💪', label: 'Tập thể dục mỗi ngày → khỏe hơn', ifVerb: 'exercise', ifVerbPast: 'exercised', ifRest: 'every day', resultVerb: 'become', resultRest: 'stronger' },
  { cue: '🎸', label: 'Luyện đàn ghi-ta mỗi ngày → chơi rất giỏi', ifVerb: 'practice', ifVerbPast: 'practiced', ifRest: 'the guitar every day', resultVerb: 'play', resultRest: 'very well' },
  { cue: '📝', label: 'Làm bài tập sớm → có thời gian chơi', ifVerb: 'finish', ifVerbPast: 'finished', ifRest: '{poss} homework early', resultVerb: 'have', resultRest: 'free time to play' },
  { cue: '⏰', label: 'Đi học muộn → gặp rắc rối', ifVerb: 'arrive', ifVerbPast: 'arrived', ifRest: 'late for school', resultVerb: 'get', resultRest: 'into trouble' },
  { cue: '☂️', label: 'Quên ô → bị ướt khi trời mưa', ifVerb: 'forget', ifVerbPast: 'forgot', ifRest: '{poss} umbrella', resultVerb: 'get', resultRest: 'wet in the rain' },
  { cue: '💰', label: 'Tiết kiệm đủ tiền → mua được xe đạp mới', ifVerb: 'save', ifVerbPast: 'saved', ifRest: 'enough money', resultVerb: 'buy', resultRest: 'a new bicycle' },
  { cue: '🏆', label: 'Luyện tập chăm chỉ mỗi ngày → thắng cuộc thi', ifVerb: 'train', ifVerbPast: 'trained', ifRest: 'hard every day', resultVerb: 'win', resultRest: 'the competition' },
  { cue: '😴', label: 'Ngủ đủ 8 tiếng → cảm thấy tràn đầy năng lượng', ifVerb: 'sleep', ifVerbPast: 'slept', ifRest: 'eight hours', resultVerb: 'feel', resultRest: 'energetic tomorrow' },
  { cue: '🍚', label: 'Bỏ bữa sáng → đói trước giờ ăn trưa', ifVerb: 'skip', ifVerbPast: 'skipped', ifRest: 'breakfast', resultVerb: 'feel', resultRest: 'hungry before lunch' },
  { cue: '🧹', label: 'Dọn phòng gọn gàng → bố mẹ vui', ifVerb: 'clean', ifVerbPast: 'cleaned', ifRest: '{poss} room', resultVerb: 'make', resultRest: '{poss} parents happy' },
  { cue: '🌻', label: 'Tưới vườn mỗi ngày → cây luôn khỏe mạnh', ifVerb: 'water', ifVerbPast: 'watered', ifRest: 'the garden every day', resultVerb: 'keep', resultRest: 'the plants healthy' },
  { cue: '♻️', label: 'Tái chế rác → giúp bảo vệ môi trường', ifVerb: 'recycle', ifVerbPast: 'recycled', ifRest: '{poss} rubbish', resultVerb: 'help', resultRest: 'protect the environment' },
  { cue: '🚴', label: 'Đội mũ bảo hiểm → an toàn hơn khi đạp xe', ifVerb: 'wear', ifVerbPast: 'wore', ifRest: 'a helmet', resultVerb: 'stay', resultRest: 'safe while cycling' },
  { cue: '🔋', label: 'Sạc điện thoại ban đêm → đủ pin buổi sáng', ifVerb: 'charge', ifVerbPast: 'charged', ifRest: '{poss} phone at night', resultVerb: 'have', resultRest: 'enough battery in the morning' },
  { cue: '🏃', label: 'Khởi động trước khi chạy → tránh chấn thương', ifVerb: 'warm', ifVerbPast: 'warmed', ifRest: 'up before running', resultVerb: 'avoid', resultRest: 'getting injured' },
  { cue: '🚿', label: 'Tiết kiệm nước khi tắm → giúp bảo vệ hành tinh', ifVerb: 'save', ifVerbPast: 'saved', ifRest: 'water when showering', resultVerb: 'help', resultRest: 'the planet' },
  { cue: '🌳', label: 'Trồng một cái cây → giúp ích cho môi trường', ifVerb: 'plant', ifVerbPast: 'planted', ifRest: 'a tree', resultVerb: 'help', resultRest: 'the environment' },
  { cue: '🧸', label: 'Chia sẻ đồ chơi → có thêm bạn mới', ifVerb: 'share', ifVerbPast: 'shared', ifRest: '{poss} toys', resultVerb: 'make', resultRest: 'new friends' },
  { cue: '🙏', label: 'Xin lỗi ngay → cảm thấy nhẹ nhõm hơn', ifVerb: 'apologize', ifVerbPast: 'apologized', ifRest: 'quickly', resultVerb: 'feel', resultRest: 'better' },
  { cue: '👂', label: 'Nghe giảng chăm chú → hiểu bài', ifVerb: 'listen', ifVerbPast: 'listened', ifRest: 'carefully in class', resultVerb: 'understand', resultRest: 'the lesson' },
  { cue: '📖', label: 'Ôn bài mỗi tối → nhớ lâu hơn', ifVerb: 'review', ifVerbPast: 'reviewed', ifRest: 'the lesson every night', resultVerb: 'remember', resultRest: 'it longer' },
  { cue: '🎒', label: 'Chuẩn bị cặp từ tối hôm trước → tiết kiệm thời gian buổi sáng', ifVerb: 'prepare', ifVerbPast: 'prepared', ifRest: '{poss} bag the night before', resultVerb: 'save', resultRest: 'time in the morning' },
  { cue: '🤝', label: 'Giúp đỡ bạn cùng lớp → làm họ vui', ifVerb: 'help', ifVerbPast: 'helped', ifRest: '{poss} classmates', resultVerb: 'make', resultRest: 'them happy' },
  { cue: '😊', label: 'Mỉm cười với mọi người → khiến họ thấy được chào đón', ifVerb: 'smile', ifVerbPast: 'smiled', ifRest: 'at people', resultVerb: 'make', resultRest: 'them feel welcome' },
  { cue: '🕶️', label: 'Bảo vệ mắt khỏi ánh nắng → tránh các vấn đề về mắt', ifVerb: 'protect', ifVerbPast: 'protected', ifRest: '{poss} eyes from the sun', resultVerb: 'avoid', resultRest: 'eye problems' },
  { cue: '😤', label: 'Kiểm soát cơn nóng giận → giải quyết vấn đề dễ hơn', ifVerb: 'control', ifVerbPast: 'controlled', ifRest: '{poss} temper', resultVerb: 'solve', resultRest: 'problems more easily' },
  { cue: '🙇', label: 'Tôn trọng người khác → nhận được sự tôn trọng', ifVerb: 'respect', ifVerbPast: 'respected', ifRest: 'other people', resultVerb: 'earn', resultRest: 'their respect' },
  { cue: '💯', label: 'Cố gắng hết sức → cảm thấy tự hào về bản thân', ifVerb: 'try', ifVerbPast: 'tried', ifRest: '{poss} best', resultVerb: 'feel', resultRest: 'proud of {refl}' },
  { cue: '✨', label: 'Tin vào bản thân → đạt được những điều tuyệt vời', ifVerb: 'believe', ifVerbPast: 'believed', ifRest: 'in {refl}', resultVerb: 'achieve', resultRest: 'great things' },
  { cue: '⏰', label: 'Thức dậy sớm → có nhiều thời gian hơn vào buổi sáng', ifVerb: 'wake', ifVerbPast: 'woke', ifRest: 'up early', resultVerb: 'have', resultRest: 'more time in the morning' },
  { cue: '🍳', label: 'Ăn sáng đầy đủ → có năng lượng đi học', ifVerb: 'eat', ifVerbPast: 'ate', ifRest: 'breakfast', resultVerb: 'have', resultRest: 'energy for school' },
  { cue: '🔐', label: 'Khóa cửa cẩn thận → giữ nhà an toàn', ifVerb: 'lock', ifVerbPast: 'locked', ifRest: 'the door', resultVerb: 'keep', resultRest: 'the house safe' },
  { cue: '📱', label: 'Sạc máy tính bảng đầy → dùng được cả ngày', ifVerb: 'charge', ifVerbPast: 'charged', ifRest: 'the tablet', resultVerb: 'use', resultRest: 'it all day' },
  { cue: '🎒', label: 'Sắp cặp sách sớm → tới trường đúng giờ', ifVerb: 'pack', ifVerbPast: 'packed', ifRest: '{poss} bag early', resultVerb: 'arrive', resultRest: 'at school on time' },
  { cue: '🌸', label: 'Tưới hoa mỗi sáng → giữ hoa luôn tươi', ifVerb: 'water', ifVerbPast: 'watered', ifRest: 'the flowers', resultVerb: 'keep', resultRest: 'them fresh' },
  { cue: '🧩', label: 'Hoàn thành trò chơi ghép hình → cảm thấy tự hào', ifVerb: 'finish', ifVerbPast: 'finished', ifRest: 'the puzzle', resultVerb: 'feel', resultRest: 'proud' },
  { cue: '🪟', label: 'Lau cửa sổ sạch sẽ → khiến ngôi nhà sáng bừng', ifVerb: 'clean', ifVerbPast: 'cleaned', ifRest: 'the windows', resultVerb: 'make', resultRest: 'the house shine' },
  { cue: '📚', label: 'Trả sách thư viện đúng hạn → tránh bị phạt', ifVerb: 'return', ifVerbPast: 'returned', ifRest: 'the library book', resultVerb: 'avoid', resultRest: 'a fine' },
  { cue: '🙋', label: 'Trả lời đúng câu hỏi → được cộng điểm', ifVerb: 'answer', ifVerbPast: 'answered', ifRest: 'the question', resultVerb: 'earn', resultRest: 'a point' },
  { cue: '🤸', label: 'Tham gia câu lạc bộ → có thêm bạn mới', ifVerb: 'join', ifVerbPast: 'joined', ifRest: 'the club', resultVerb: 'make', resultRest: 'new friends' },
  { cue: '👕', label: 'Quyên góp quần áo cũ → giúp đỡ người khác', ifVerb: 'donate', ifVerbPast: 'donated', ifRest: 'old clothes', resultVerb: 'help', resultRest: 'others' },
  { cue: '♻️', label: 'Tái chế chai lọ → bảo vệ đại dương', ifVerb: 'recycle', ifVerbPast: 'recycled', ifRest: 'the bottles', resultVerb: 'protect', resultRest: 'the ocean' },
  { cue: '🌳', label: 'Trồng thêm cây xanh → cải thiện không khí', ifVerb: 'plant', ifVerbPast: 'planted', ifRest: 'more trees', resultVerb: 'improve', resultRest: 'the air' },
  { cue: '💡', label: 'Tiết kiệm điện → giảm tiền hóa đơn', ifVerb: 'save', ifVerbPast: 'saved', ifRest: 'electricity', resultVerb: 'lower', resultRest: 'the bill' },
  { cue: '🚶', label: 'Đi bộ thay vì lái xe → giảm ô nhiễm', ifVerb: 'walk', ifVerbPast: 'walked', ifRest: 'instead of driving', resultVerb: 'reduce', resultRest: 'pollution' },
  { cue: '🥤', label: 'Uống đủ nước → giữ cơ thể khỏe mạnh', ifVerb: 'drink', ifVerbPast: 'drank', ifRest: 'enough water', resultVerb: 'stay', resultRest: 'healthy' },
  { cue: '🏃', label: 'Tập thể dục mỗi sáng → ngủ ngon hơn vào ban đêm', ifVerb: 'exercise', ifVerbPast: 'exercised', ifRest: 'every morning', resultVerb: 'sleep', resultRest: 'better at night' },
  { cue: '📔', label: 'Viết nhật ký mỗi tối → nhớ lại ngày hôm đó', ifVerb: 'write', ifVerbPast: 'wrote', ifRest: 'in a journal', resultVerb: 'remember', resultRest: 'the day' },
  { cue: '😌', label: 'Luyện tính kiên nhẫn → hòa hợp hơn với mọi người', ifVerb: 'practice', ifVerbPast: 'practiced', ifRest: 'patience', resultVerb: 'get', resultRest: 'along with others' },
  { cue: '🍱', label: 'Chia sẻ bữa trưa → làm bạn vui', ifVerb: 'share', ifVerbPast: 'shared', ifRest: '{poss} lunch', resultVerb: 'make', resultRest: 'a friend happy' },
  { cue: '💌', label: 'Xin lỗi chân thành → hàn gắn tình bạn', ifVerb: 'apologize', ifVerbPast: 'apologized', ifRest: 'sincerely', resultVerb: 'repair', resultRest: 'the friendship' },
  { cue: '👂', label: 'Lắng nghe thầy cô giảng bài → hiểu rõ bài học', ifVerb: 'listen', ifVerbPast: 'listened', ifRest: 'to the teacher', resultVerb: 'understand', resultRest: 'the topic' },
  { cue: '🎟️', label: 'Đến sớm → có được chỗ ngồi đẹp', ifVerb: 'arrive', ifVerbPast: 'arrived', ifRest: 'early', resultVerb: 'get', resultRest: 'a good seat' },
  { cue: '🏋️', label: 'Luyện tập chăm chỉ mỗi tuần → cải thiện kỹ năng', ifVerb: 'train', ifVerbPast: 'trained', ifRest: 'hard every week', resultVerb: 'improve', resultRest: '{poss} skills' },
  { cue: '🤕', label: 'Bỏ qua bước khởi động → dễ bị chấn thương', ifVerb: 'skip', ifVerbPast: 'skipped', ifRest: 'the warm-up', resultVerb: 'risk', resultRest: 'an injury' },
  { cue: '💰', label: 'Kiểm soát chi tiêu → tiết kiệm được nhiều tiền hơn', ifVerb: 'control', ifVerbPast: 'controlled', ifRest: '{poss} spending', resultVerb: 'save', resultRest: 'more money' },
  { cue: '📜', label: 'Tôn trọng nội quy → tránh bị phạt', ifVerb: 'respect', ifVerbPast: 'respected', ifRest: 'the rules', resultVerb: 'avoid', resultRest: 'punishment' },
  { cue: '🎨', label: 'Thử một sở thích mới → khám phá tài năng', ifVerb: 'try', ifVerbPast: 'tried', ifRest: 'a new hobby', resultVerb: 'discover', resultRest: 'a talent' },
  { cue: '🤗', label: 'Giúp đỡ hàng xóm → xây dựng mối quan hệ tốt', ifVerb: 'help', ifVerbPast: 'helped', ifRest: '{poss} neighbor', resultVerb: 'build', resultRest: 'a good relationship' },
  { cue: '😃', label: 'Mỉm cười thường xuyên hơn → cảm thấy hạnh phúc hơn', ifVerb: 'smile', ifVerbPast: 'smiled', ifRest: 'more often', resultVerb: 'feel', resultRest: 'happier' },
  { cue: '🌍', label: 'Bảo vệ môi trường → cứu lấy hành tinh', ifVerb: 'protect', ifVerbPast: 'protected', ifRest: 'the environment', resultVerb: 'save', resultRest: 'the planet' },
  { cue: '📝', label: 'Xem lại lỗi sai của mình → tránh lặp lại chúng', ifVerb: 'review', ifVerbPast: 'reviewed', ifRest: '{poss} mistakes', resultVerb: 'avoid', resultRest: 'repeating them' },
  { cue: '🥪', label: 'Chuẩn bị bữa trưa từ tối hôm trước → ăn uống lành mạnh hơn', ifVerb: 'prepare', ifVerbPast: 'prepared', ifRest: "{poss} lunch the night before", resultVerb: 'eat', resultRest: 'healthier' },
  { cue: '🧼', label: 'Rửa tay thường xuyên → tránh bị ốm', ifVerb: 'wash', ifVerbPast: 'washed', ifRest: "{poss} hands often", resultVerb: 'avoid', resultRest: 'getting sick' },
  { cue: '💡', label: 'Tắt đèn khi ra khỏi phòng → giảm tiền điện', ifVerb: 'turn', ifVerbPast: 'turned', ifRest: 'off the lights', resultVerb: 'reduce', resultRest: 'the electricity bill' },
  { cue: '🧠', label: 'Làm câu đố thường xuyên → giữ đầu óc minh mẫn', ifVerb: 'do', ifVerbPast: 'did', ifRest: 'puzzles regularly', resultVerb: 'stay', resultRest: 'sharp' },
  { cue: '🌤️', label: 'Tưới vườn từ sớm → tránh nắng gắt', ifVerb: 'water', ifVerbPast: 'watered', ifRest: 'the garden early', resultVerb: 'avoid', resultRest: 'the hot sun' },
  { cue: '💬', label: 'Khen ngợi bạn bè → tăng sự tự tin cho họ', ifVerb: 'compliment', ifVerbPast: 'complimented', ifRest: '{poss} friends', resultVerb: 'boost', resultRest: 'their confidence' },
  { cue: '🙌', label: 'Dành thời gian làm tình nguyện → có được trải nghiệm quý giá', ifVerb: 'volunteer', ifVerbPast: 'volunteered', ifRest: '{poss} time', resultVerb: 'gain', resultRest: 'valuable experience' },
  { cue: '🗄️', label: 'Sắp xếp bàn học gọn gàng → làm việc hiệu quả hơn', ifVerb: 'organize', ifVerbPast: 'organized', ifRest: '{poss} desk', resultVerb: 'work', resultRest: 'more efficiently' },
  { cue: '📵', label: 'Tránh xa điện thoại trước khi ngủ → ngủ sâu hơn', ifVerb: 'avoid', ifVerbPast: 'avoided', ifRest: '{poss} phone before bed', resultVerb: 'sleep', resultRest: 'more deeply' },
  { cue: '🍲', label: 'Tự nấu ăn → ăn uống lành mạnh hơn', ifVerb: 'cook', ifVerbPast: 'cooked', ifRest: "{poss} own meals", resultVerb: 'eat', resultRest: 'healthier' },
  { cue: '🙋‍♀️', label: 'Chào hỏi lịch sự → tạo ấn tượng tốt', ifVerb: 'greet', ifVerbPast: 'greeted', ifRest: 'people politely', resultVerb: 'make', resultRest: 'a good impression' },
  { cue: '🗣️', label: 'Học một ngôn ngữ mới → giao tiếp được với nhiều người hơn', ifVerb: 'study', ifVerbPast: 'studied', ifRest: 'a new language', resultVerb: 'communicate', resultRest: 'with more people' },
  { cue: '🧘‍♀️', label: 'Thiền mỗi ngày → giảm bớt căng thẳng', ifVerb: 'meditate', ifVerbPast: 'meditated', ifRest: 'every day', resultVerb: 'reduce', resultRest: 'stress' },
  { cue: '🚉', label: 'Dậy sớm → kịp chuyến tàu sớm', ifVerb: 'wake', ifVerbPast: 'woke', ifRest: 'up early', resultVerb: 'catch', resultRest: 'the early train' },
  { cue: '🏃‍♀️', label: 'Chạy bộ mỗi sáng → tăng sức bền', ifVerb: 'jog', ifVerbPast: 'jogged', ifRest: 'every morning', resultVerb: 'build', resultRest: 'stamina' },
  { cue: '🗂️', label: 'Dán nhãn tài liệu → dễ tìm lại', ifVerb: 'label', ifVerbPast: 'labeled', ifRest: '{poss} files', resultVerb: 'find', resultRest: 'them easily' },
  { cue: '🌱', label: 'Tưới sân cỏ → giữ cỏ luôn xanh', ifVerb: 'water', ifVerbPast: 'watered', ifRest: '{poss} lawn', resultVerb: 'keep', resultRest: 'the grass green' },
  { cue: '👔', label: 'Ủi áo sơ mi → trông gọn gàng', ifVerb: 'iron', ifVerbPast: 'ironed', ifRest: '{poss} shirt', resultVerb: 'look', resultRest: 'neat' },
  { cue: '👞', label: 'Đánh bóng giày → trông lịch sự', ifVerb: 'polish', ifVerbPast: 'polished', ifRest: '{poss} shoes', resultVerb: 'look', resultRest: 'smart' },
  { cue: '🎤', label: 'Tập trước bài phát biểu → cảm thấy tự tin hơn', ifVerb: 'rehearse', ifVerbPast: 'rehearsed', ifRest: 'the speech', resultVerb: 'feel', resultRest: 'more confident' },
  { cue: '📧', label: 'Kiểm tra kỹ email → tránh sai sót', ifVerb: 'check', ifVerbPast: 'checked', ifRest: '{poss} email carefully', resultVerb: 'avoid', resultRest: 'mistakes' },
  { cue: '🌻', label: 'Ủ phân từ rác thức ăn → giúp ích cho vườn', ifVerb: 'compost', ifVerbPast: 'composted', ifRest: 'the food waste', resultVerb: 'help', resultRest: 'the garden' },
  { cue: '📦', label: 'Đánh dấu các thùng đồ → chuyển nhà dễ dàng hơn', ifVerb: 'mark', ifVerbPast: 'marked', ifRest: 'the boxes', resultVerb: 'move', resultRest: 'house easily' },
  { cue: '🎭', label: 'Học thuộc lời thoại → diễn xuất tốt', ifVerb: 'memorize', ifVerbPast: 'memorized', ifRest: 'the lines', resultVerb: 'perform', resultRest: 'well' },
  { cue: '🦵', label: 'Kéo giãn chân → tránh bị chuột rút', ifVerb: 'stretch', ifVerbPast: 'stretched', ifRest: '{poss} legs', resultVerb: 'avoid', resultRest: 'cramps' },
  { cue: '💧', label: 'Uống đủ nước → chạy tốt hơn trong cuộc đua', ifVerb: 'hydrate', ifVerbPast: 'hydrated', ifRest: 'properly', resultVerb: 'perform', resultRest: 'better in the race' },
  { cue: '🧹', label: 'Dọn bớt đồ trong phòng → cảm thấy thoải mái hơn', ifVerb: 'declutter', ifVerbPast: 'decluttered', ifRest: '{poss} room', resultVerb: 'feel', resultRest: 'more relaxed' },
  { cue: '💵', label: 'Lập ngân sách chi tiêu → tránh nợ nần', ifVerb: 'budget', ifVerbPast: 'budgeted', ifRest: '{poss} money', resultVerb: 'avoid', resultRest: 'debt' },
  { cue: '🤝', label: 'Kết nối với người khác → tìm việc nhanh hơn', ifVerb: 'network', ifVerbPast: 'networked', ifRest: 'with others', resultVerb: 'find', resultRest: 'a job faster' },
  { cue: '🧴', label: 'Sát khuẩn tay → tránh vi trùng', ifVerb: 'sanitize', ifVerbPast: 'sanitized', ifRest: '{poss} hands', resultVerb: 'avoid', resultRest: 'germs' },
  { cue: '🔋', label: 'Sạc lại laptop → tiếp tục làm việc', ifVerb: 'recharge', ifVerbPast: 'recharged', ifRest: '{poss} laptop', resultVerb: 'keep', resultRest: 'working' },
  { cue: '🧳', label: 'Giảm bớt hành lý → đi lại dễ dàng hơn', ifVerb: 'downsize', ifVerbPast: 'downsized', ifRest: '{poss} luggage', resultVerb: 'travel', resultRest: 'easier' },
  { cue: '📖', label: 'Tóm tắt chương sách → nhớ bài tốt hơn', ifVerb: 'summarize', ifVerbPast: 'summarized', ifRest: 'the chapter', resultVerb: 'remember', resultRest: 'it better' },
  { cue: '💡', label: 'Cùng nhau nghĩ ý tưởng → giải quyết vấn đề', ifVerb: 'brainstorm', ifVerbPast: 'brainstormed', ifRest: 'ideas', resultVerb: 'solve', resultRest: 'the problem' },
  { cue: '📱', label: 'Làm nhiều việc cùng lúc quá nhiều → dễ mắc lỗi hơn', ifVerb: 'multitask', ifVerbPast: 'multitasked', ifRest: 'too much', resultVerb: 'make', resultRest: 'more mistakes' },
  { cue: '😩', label: 'Làm việc quá sức → cảm thấy kiệt sức', ifVerb: 'overwork', ifVerbPast: 'overworked', ifRest: '{refl}', resultVerb: 'feel', resultRest: 'exhausted' },
  { cue: '⏳', label: 'Xem nhẹ độ khó công việc → hết thời gian', ifVerb: 'underestimate', ifVerbPast: 'underestimated', ifRest: 'the task', resultVerb: 'run', resultRest: 'out of time' },
  { cue: '🔢', label: 'Kiểm tra lại con số 2 lần → tránh sai sót', ifVerb: 'double-check', ifVerbPast: 'double-checked', ifRest: 'the numbers', resultVerb: 'avoid', resultRest: 'errors' },
  { cue: '🏋️‍♀️', label: 'Luyện tập đa dạng môn thể thao → cải thiện thể lực toàn diện', ifVerb: 'cross-train', ifVerbPast: 'cross-trained', ifRest: 'regularly', resultVerb: 'improve', resultRest: 'overall fitness' },
  { cue: '⏩', label: 'Tua nhanh đoạn video → tiết kiệm thời gian', ifVerb: 'fast-forward', ifVerbPast: 'fast-forwarded', ifRest: 'the video', resultVerb: 'save', resultRest: 'time' },
  { cue: '⏪', label: 'Tua lại cuộn băng → xem lại được', ifVerb: 'rewind', ifVerbPast: 'rewound', ifRest: 'the tape', resultVerb: 'watch', resultRest: 'it again' },
  { cue: '🔌', label: 'Rút phích cắm thiết bị → tiết kiệm điện', ifVerb: 'unplug', ifVerbPast: 'unplugged', ifRest: 'the devices', resultVerb: 'save', resultRest: 'electricity' },
  { cue: '💻', label: 'Khởi động lại máy tính → sửa được lỗi', ifVerb: 'reboot', ifVerbPast: 'rebooted', ifRest: 'the computer', resultVerb: 'fix', resultRest: 'the problem' },
  { cue: '📰', label: 'Đọc lướt bài báo → tiết kiệm thời gian', ifVerb: 'skim', ifVerbPast: 'skimmed', ifRest: 'the article', resultVerb: 'save', resultRest: 'time' },
  { cue: '🔖', label: 'Đánh dấu trang → tìm lại dễ dàng sau này', ifVerb: 'bookmark', ifVerbPast: 'bookmarked', ifRest: 'the page', resultVerb: 'find', resultRest: 'it again later' },
  { cue: '🧺', label: 'Gấp quần áo ngay khi khô → tủ đồ luôn gọn gàng', ifVerb: 'fold', ifVerbPast: 'folded', ifRest: 'the laundry right away', resultVerb: 'keep', resultRest: 'the closet tidy' },
  { cue: '🚿', label: 'Tắm nước lạnh vào buổi sáng → tỉnh táo hơn cả ngày', ifVerb: 'shower', ifVerbPast: 'showered', ifRest: 'with cold water in the morning', resultVerb: 'feel', resultRest: 'alert all day' },
  // ----- Bổ sung vòng mục tiêu 850 -----
  { cue: '🧹', label: 'Quét sân mỗi sáng → sân luôn sạch sẽ', ifVerb: 'sweep', ifVerbPast: 'swept', ifRest: 'the yard every morning', resultVerb: 'keep', resultRest: 'it clean' },
  { cue: '🗄️', label: 'Dọn dẹp bàn học → dễ tìm đồ hơn', ifVerb: 'tidy', ifVerbPast: 'tidied', ifRest: '{poss} desk', resultVerb: 'find', resultRest: 'things more easily' },
  { cue: '🧽', label: 'Lau bàn sau khi ăn → bếp luôn gọn gàng', ifVerb: 'wipe', ifVerbPast: 'wiped', ifRest: 'the table after eating', resultVerb: 'keep', resultRest: 'the kitchen tidy' },
  { cue: '🧺', label: 'Hút bụi thảm mỗi tuần → nhà sạch bụi', ifVerb: 'vacuum', ifVerbPast: 'vacuumed', ifRest: 'the carpet every week', resultVerb: 'reduce', resultRest: 'the dust at home' },
  { cue: '📚', label: 'Lau bụi kệ sách → khỏi bị hắt hơi', ifVerb: 'dust', ifVerbPast: 'dusted', ifRest: 'the bookshelf', resultVerb: 'avoid', resultRest: 'sneezing so much' },
  { cue: '🧵', label: 'Khâu lại chiếc áo rách → mặc được lâu hơn', ifVerb: 'sew', ifVerbPast: 'sewed', ifRest: 'the torn shirt', resultVerb: 'wear', resultRest: 'it much longer' },
  { cue: '🧶', label: 'Đan một chiếc khăn → có quà tặng ý nghĩa', ifVerb: 'knit', ifVerbPast: 'knitted', ifRest: 'a scarf', resultVerb: 'have', resultRest: 'a meaningful gift' },
  { cue: '✏️', label: 'Phác thảo ý tưởng trước → vẽ nhanh hơn', ifVerb: 'sketch', ifVerbPast: 'sketched', ifRest: "{poss} idea first", resultVerb: 'draw', resultRest: 'much faster' },
  { cue: '🖍️', label: 'Vẽ nguệch ngoạc lúc rảnh → thư giãn đầu óc', ifVerb: 'doodle', ifVerbPast: 'doodled', ifRest: 'during break time', resultVerb: 'relax', resultRest: '{poss} mind' },
  { cue: '📔', label: 'Viết nhật ký mỗi tối → nhớ lại kỷ niệm dễ hơn', ifVerb: 'journal', ifVerbPast: 'journaled', ifRest: 'every night', resultVerb: 'remember', resultRest: 'memories more easily' },
  { cue: '🦷', label: 'Dùng chỉ nha khoa mỗi ngày → răng chắc khỏe hơn', ifVerb: 'floss', ifVerbPast: 'flossed', ifRest: '{poss} teeth every day', resultVerb: 'have', resultRest: 'stronger teeth' },
  { cue: '🧂', label: 'Súc miệng nước muối → giảm đau họng', ifVerb: 'gargle', ifVerbPast: 'gargled', ifRest: 'with salt water', resultVerb: 'ease', resultRest: 'a sore throat' },
  { cue: '🎶', label: 'Huýt sáo một giai điệu vui → khiến mọi người mỉm cười', ifVerb: 'whistle', ifVerbPast: 'whistled', ifRest: 'a happy tune', resultVerb: 'make', resultRest: 'people smile' },
  { cue: '🎵', label: 'Ngân nga giai điệu yêu thích → thấy vui hơn', ifVerb: 'hum', ifVerbPast: 'hummed', ifRest: '{poss} favorite song', resultVerb: 'feel', resultRest: 'happier' },
  { cue: '🤹', label: 'Tập tung hứng mỗi ngày → khéo tay hơn', ifVerb: 'juggle', ifVerbPast: 'juggled', ifRest: 'every day', resultVerb: 'become', resultRest: 'more skillful' },
  { cue: '🛹', label: 'Trượt ván ở công viên → học được kỹ năng mới', ifVerb: 'skateboard', ifVerbPast: 'skateboarded', ifRest: 'at the skate park', resultVerb: 'learn', resultRest: 'new tricks' },
  { cue: '🏄', label: 'Lướt sóng vào mùa hè → cảm thấy tràn đầy năng lượng', ifVerb: 'surf', ifVerbPast: 'surfed', ifRest: 'in the summer', resultVerb: 'feel', resultRest: 'full of energy' },
  { cue: '🛶', label: 'Chèo kayak trên sông → ngắm cảnh đẹp hơn', ifVerb: 'kayak', ifVerbPast: 'kayaked', ifRest: 'on the river', resultVerb: 'see', resultRest: 'beautiful scenery' },
  { cue: '🚣', label: 'Chèo xuồng qua hồ → khám phá được nhiều nơi mới', ifVerb: 'canoe', ifVerbPast: 'canoed', ifRest: 'across the lake', resultVerb: 'discover', resultRest: 'new places' },
  { cue: '🥾', label: 'Leo núi vào cuối tuần → cơ thể khỏe mạnh hơn', ifVerb: 'hike', ifVerbPast: 'hiked', ifRest: 'every weekend', resultVerb: 'stay', resultRest: 'healthier' },
  { cue: '🍓', label: 'Tìm hái quả dại trong rừng → học về thiên nhiên', ifVerb: 'forage', ifVerbPast: 'foraged', ifRest: 'for wild berries', resultVerb: 'learn', resultRest: 'about nature' },
  { cue: '🪵', label: 'Đẽo gọt một khúc gỗ nhỏ → tạo ra món đồ chơi', ifVerb: 'whittle', ifVerbPast: 'whittled', ifRest: 'a small piece of wood', resultVerb: 'create', resultRest: 'a little toy' },
  { cue: '💇', label: "Tết tóc cho em gái → em ấy rất vui", ifVerb: 'braid', ifVerbPast: 'braided', ifRest: "{poss} sister's hair", resultVerb: 'make', resultRest: 'her very happy' },
  { cue: '🧣', label: 'Móc len một chiếc mũ → giữ ấm vào mùa đông', ifVerb: 'crochet', ifVerbPast: 'crocheted', ifRest: 'a warm hat', resultVerb: 'stay', resultRest: 'warm in winter' },
  { cue: '🛏️', label: 'May một tấm chăn bông → có món quà handmade', ifVerb: 'quilt', ifVerbPast: 'quilted', ifRest: 'a cozy blanket', resultVerb: 'have', resultRest: 'a handmade gift' },
  // ----- Bổ sung vòng mục tiêu 1000 -----
  { cue: '🚿', label: 'Rửa sạch xà phòng khỏi tóc → tóc mềm mượt hơn', ifVerb: 'rinse', ifVerbPast: 'rinsed', ifRest: '{poss} hair well', resultVerb: 'keep', resultRest: 'it soft and shiny' },
  { cue: '🍳', label: 'Cọ sạch nồi sau khi nấu → bếp luôn sáng bóng', ifVerb: 'scrub', ifVerbPast: 'scrubbed', ifRest: 'the pot after cooking', resultVerb: 'keep', resultRest: 'the kitchen shining' },
  { cue: '☀️', label: 'Phơi khô quần áo ngoài nắng → quần áo thơm hơn', ifVerb: 'dry', ifVerbPast: 'dried', ifRest: '{poss} clothes in the sun', resultVerb: 'make', resultRest: 'them smell fresh' },
  { cue: '🖼️', label: 'Treo tranh lên tường → phòng đẹp hơn', ifVerb: 'hang', ifVerbPast: 'hung', ifRest: 'a picture on the wall', resultVerb: 'make', resultRest: 'the room look nicer' },
  { cue: '🧹', label: 'Lau sàn nhà mỗi tuần → nhà luôn sạch sẽ', ifVerb: 'mop', ifVerbPast: 'mopped', ifRest: 'the floor every week', resultVerb: 'keep', resultRest: 'the house clean' },
  { cue: '✨', label: 'Đánh bóng sàn gỗ → sàn sáng bóng hơn', ifVerb: 'wax', ifVerbPast: 'waxed', ifRest: 'the wooden floor', resultVerb: 'make', resultRest: 'it shine' },
  { cue: '🚪', label: 'Tra dầu bản lề cửa → cửa hết kêu cọt kẹt', ifVerb: 'oil', ifVerbPast: 'oiled', ifRest: 'the door hinge', resultVerb: 'stop', resultRest: 'it from squeaking' },
  { cue: '🎂', label: 'Bôi mỡ vào khuôn bánh → bánh không bị dính', ifVerb: 'grease', ifVerbPast: 'greased', ifRest: 'the baking pan', resultVerb: 'keep', resultRest: 'the cake from sticking' },
  { cue: '🎸', label: 'Lên dây đàn guitar → chơi nghe hay hơn', ifVerb: 'tune', ifVerbPast: 'tuned', ifRest: '{poss} guitar', resultVerb: 'play', resultRest: 'much better' },
  { cue: '⚖️', label: 'Hiệu chỉnh cân điện tử → đo chính xác hơn', ifVerb: 'calibrate', ifVerbPast: 'calibrated', ifRest: 'the digital scale', resultVerb: 'get', resultRest: 'accurate results' },
  { cue: '📐', label: 'Căn chỉnh các ô chữ → bài trình bày gọn hơn', ifVerb: 'align', ifVerbPast: 'aligned', ifRest: 'the text boxes', resultVerb: 'make', resultRest: 'the page look neater' },
  { cue: '💰', label: 'Cân đối sổ chi tiêu mỗi tháng → quản lý tiền tốt hơn', ifVerb: 'balance', ifVerbPast: 'balanced', ifRest: '{poss} budget every month', resultVerb: 'manage', resultRest: 'money better' },
  { cue: '🥣', label: 'Cân nguyên liệu trước khi nướng bánh → bánh ngon hơn', ifVerb: 'weigh', ifVerbPast: 'weighed', ifRest: 'the ingredients before baking', resultVerb: 'get', resultRest: 'better results' },
  { cue: '♻️', label: 'Phân loại rác tái chế → giúp môi trường sạch hơn', ifVerb: 'sort', ifVerbPast: 'sorted', ifRest: '{poss} recyclables', resultVerb: 'help', resultRest: 'keep the environment clean' },
  { cue: '📚', label: 'Lập danh mục sách trong thư viện → dễ tìm sách hơn', ifVerb: 'catalog', ifVerbPast: 'cataloged', ifRest: 'the library books', resultVerb: 'find', resultRest: 'them more easily' },
  { cue: '🗄️', label: 'Lưu trữ tài liệu cũ → tránh mất dữ liệu', ifVerb: 'archive', ifVerbPast: 'archived', ifRest: 'the old documents', resultVerb: 'avoid', resultRest: 'losing important data' },
  { cue: '📷', label: 'Số hóa ảnh cũ → giữ được kỷ niệm lâu dài', ifVerb: 'digitize', ifVerbPast: 'digitized', ifRest: 'the old photos', resultVerb: 'keep', resultRest: 'the memories forever' },
  { cue: '🖨️', label: 'Quét tài liệu vào máy tính → không cần giữ bản giấy', ifVerb: 'scan', ifVerbPast: 'scanned', ifRest: 'the paperwork', resultVerb: 'avoid', resultRest: 'keeping paper copies' },
  { cue: '📤', label: 'Tải bài tập lên trang web → nộp bài đúng hạn', ifVerb: 'upload', ifVerbPast: 'uploaded', ifRest: '{poss} assignment', resultVerb: 'submit', resultRest: 'it on time' },
  { cue: '📥', label: 'Tải ứng dụng học tiếng Anh → học từ vựng dễ hơn', ifVerb: 'download', ifVerbPast: 'downloaded', ifRest: 'the English app', resultVerb: 'learn', resultRest: 'new words more easily' },
  { cue: '🔄', label: 'Đồng bộ lịch trên điện thoại → nhớ đúng mọi cuộc hẹn', ifVerb: 'sync', ifVerbPast: 'synced', ifRest: '{poss} calendar', resultVerb: 'remember', resultRest: 'every appointment' },
  { cue: '🔐', label: 'Mã hóa tệp tin quan trọng → bảo mật thông tin tốt hơn', ifVerb: 'encrypt', ifVerbPast: 'encrypted', ifRest: 'important files', resultVerb: 'protect', resultRest: '{poss} information better' },
  { cue: '✏️', label: 'Sửa lại bài luận → điểm số cao hơn', ifVerb: 'revise', ifVerbPast: 'revised', ifRest: '{poss} essay', resultVerb: 'get', resultRest: 'a higher grade' },
  { cue: '🌐', label: 'Dịch tài liệu sang tiếng Anh → nhiều người đọc được hơn', ifVerb: 'translate', ifVerbPast: 'translated', ifRest: 'the document into English', resultVerb: 'reach', resultRest: 'more readers' },
  { cue: '🎨', label: 'Minh họa câu chuyện bằng tranh vẽ → sách hấp dẫn hơn', ifVerb: 'illustrate', ifVerbPast: 'illustrated', ifRest: '{poss} story with drawings', resultVerb: 'make', resultRest: 'the book more engaging' },
];

function expandConditionalTemplate(t, subject) {
  const isThird = CONDITIONAL_3RD_PERSON.includes(subject);
  const ifRest = fillConditionalPlaceholders(t.ifRest, subject);
  const resultRest = fillConditionalPlaceholders(t.resultRest, subject);
  const ifConj = isThird ? conditionalThirdPerson(t.ifVerb) : t.ifVerb;
  const resultConj = isThird ? conditionalThirdPerson(t.resultVerb) : t.resultVerb;
  return {
    cue: t.cue,
    label: t.label,
    ifSubject: subject,
    ifBase: [t.ifVerb, ifRest].filter(Boolean).join(' '),
    ifPresent: [subject, ifConj, ifRest].filter(Boolean).join(' '),
    resultWill: [subject, 'will', t.resultVerb, resultRest].filter(Boolean).join(' '),
    resultBase: [subject, resultConj, resultRest].filter(Boolean).join(' '),
    ifPast: [subject, t.ifVerbPast, ifRest].filter(Boolean).join(' '),
  };
}

for (const template of CONDITIONAL_TEMPLATES) {
  for (const subject of CONDITIONAL_SUBJECTS) {
    CONDITIONAL_SITUATIONS.push(expandConditionalTemplate(template, subject));
  }
}

function buildConditionalSentence(scenario, key) {
  switch (key) {
    case 'correct':
      return `If ${scenario.ifPresent}, ${scenario.resultWill}.`;
    case 'will-in-if':
      return `If ${scenario.ifSubject} will ${scenario.ifBase}, ${scenario.resultWill}.`;
    case 'no-will-result':
      return `If ${scenario.ifPresent}, ${scenario.resultBase}.`;
    case 'past-mix':
    default:
      return `If ${scenario.ifPast}, ${scenario.resultWill}.`;
  }
}

/** 1 vòng: chọn 1 tình huống, sinh 4 câu (đúng 'correct' + 3 lỗi thường gặp). */
export function makeConditionalRound(rng = Math.random) {
  const scenario = pick(CONDITIONAL_SITUATIONS, rng);
  const keys = ['correct', 'will-in-if', 'no-will-result', 'past-mix'];
  const options = shuffle(keys, rng).map((key) => ({
    key,
    sentence: buildConditionalSentence(scenario, key),
  }));
  return { scenario, options, correctKey: 'correct' };
}

export function makeConditionalGame(count = 8, rng = Math.random) {
  const rounds = [];
  for (let i = 0; i < count; i++) rounds.push(makeConditionalRound(rng));
  return baseGameState(rounds);
}

export function currentConditionalRound(game) {
  return currentRoundOf(game);
}

export function answerConditional(game, key) {
  return answerGeneric(game, key, (round) => round.correctKey);
}

/* ===== 7. Ghép Câu (Sắp Xếp Từ) — ôn tập tổng hợp bằng cách bấm từ theo
   đúng thứ tự để dựng lại câu đã học ở 6 trò trên. Đây là trò TƯƠNG TÁC
   khác hẳn 6 trò kia (không chọn 1 trong 4 câu có sẵn, mà tự dựng câu). ===== */

export const SENTENCE_BUILDER_POOL = [
  { icon: '🕐', vi: 'Cô ấy đang nấu ăn bây giờ.', en: 'She is cooking dinner now.' },
  { icon: '🔁', vi: 'Anh ấy chơi bóng đá mỗi ngày.', en: 'He plays football every day.' },
  { icon: '✅', vi: 'Họ đã xem phim hôm qua.', en: 'They watched a movie yesterday.' },
  { icon: '🔗', vi: 'Tôi vừa mới làm xong bài tập.', en: 'I have just finished my homework.' },
  { icon: '📅', vi: 'Chúng tôi sẽ đi Đà Nẵng vào ngày mai.', en: 'We are going to travel to Da Nang tomorrow.' },
  { icon: '🌧️', vi: 'Nếu trời mưa, tôi sẽ ở nhà.', en: 'If it rains, I will stay home.' },
  { icon: '🚭', vi: 'Bạn không được hút thuốc ở đây.', en: "You mustn't smoke here." },
  { icon: '📈', vi: 'Con chó chạy nhanh hơn con mèo.', en: 'The dog runs faster than the cat.' },
  { icon: '⏳', vi: 'Trong khi cô ấy đang nấu ăn, điện thoại đã reo.', en: 'While she was cooking dinner, the phone rang.' },
  { icon: '🥦', vi: 'Bạn nên ăn nhiều rau hơn.', en: 'You should eat more vegetables.' },
  { icon: '🎈', vi: 'Đội của họ là giỏi nhất.', en: 'Their team is the best.' },
  { icon: '🔮', vi: 'Tôi nghĩ trời sẽ nắng vào ngày mai.', en: 'I think it will be sunny tomorrow.' },
  { icon: '🎂', vi: 'Họ sẽ tổ chức tiệc sinh nhật.', en: 'They are going to have a birthday party.' },
  { icon: '💪', vi: 'Con voi khỏe hơn con thỏ.', en: 'The elephant is stronger than the rabbit.' },
  { icon: '🚦', vi: 'Bạn phải dừng lại khi đèn đỏ.', en: 'You must stop at a red light.' },
  { icon: '⚽', vi: 'Nếu chúng tôi luyện tập chăm chỉ, chúng tôi sẽ thắng trận đấu.', en: 'If we practice hard, we will win the match.' },
  { icon: '🎨', vi: 'Cô ấy đang vẽ tranh bây giờ.', en: 'She is painting a picture now.' },
  { icon: '📝', vi: 'Anh ấy đã làm bài tập về nhà hôm qua.', en: 'He did homework yesterday.' },
  { icon: '💪', vi: 'Con sư tử mạnh hơn con ngựa.', en: 'The lion is stronger than the horse.' },
  { icon: '🚨', vi: 'Trong khi bé đang ngủ, chuông báo cháy đã reo.', en: 'While the baby was sleeping, the fire alarm rang.' },
  { icon: '🎓', vi: 'Cô ấy sẽ đi du học vào năm sau.', en: 'She is going to study abroad next year.' },
  { icon: '👨‍🍳', vi: 'Món súp được nấu bởi đầu bếp.', en: 'The soup is cooked by the chef.' },
  { icon: '⛰️', vi: 'Ngọn núi cao hơn ngôi nhà.', en: 'The mountain is taller than the house.' },
  { icon: '💰', vi: 'Nếu bạn tiết kiệm tiền, bạn sẽ mua được xe đạp mới.', en: 'If you save money, you will buy a new bike.' },
  { icon: '🦷', vi: 'Bạn nên đánh răng hai lần một ngày.', en: 'You should brush your teeth twice a day.' },
  { icon: '🐘', vi: 'Con voi là con vật khỏe nhất.', en: 'The elephant is the strongest animal.' },
  { icon: '🔮', vi: 'Tôi nghĩ trời sẽ có gió vào ngày mai.', en: 'I think it will be windy tomorrow.' },
  { icon: '📦', vi: 'Trong khi anh ấy đang đọc sách, một gói hàng đã đến.', en: 'While he was reading a book, a package arrived.' },
  { icon: '🎁', vi: 'Anh ấy sẽ tặng cô ấy một món quà.', en: 'He is going to give her a present.' },
  { icon: '🎹', vi: 'Nếu cô ấy luyện đàn mỗi ngày, cô ấy sẽ chơi rất giỏi.', en: 'If she practices the piano every day, she will play very well.' },
  { icon: '🅿️', vi: 'Bạn không được đậu xe ở đây.', en: "You mustn't park here." },
  { icon: '🚴', vi: 'Nếu bạn đội mũ bảo hiểm, bạn sẽ an toàn hơn.', en: 'If you wear a helmet, you will be safer.' },
  { icon: '🦒', vi: 'Con hươu cao cổ cao hơn con ngựa.', en: 'The giraffe is taller than the horse.' },
  { icon: '🎣', vi: 'Anh ấy sẽ đi câu cá vào cuối tuần.', en: 'He is going to go fishing this weekend.' },
  { icon: '✍️', vi: 'Cuốn sách được viết bởi một nhà văn nổi tiếng.', en: 'The book was written by a famous writer.' },
  { icon: '🗣️', vi: 'Cô ấy nói cô ấy đang đọc sách.', en: 'She said she was reading a book.' },
  { icon: '🚑', vi: 'Tôi sẽ gọi bác sĩ ngay bây giờ.', en: 'I will call the doctor now.' },
  { icon: '🍦', vi: 'Nếu bạn để kem trong tủ đông, kem sẽ đông cứng.', en: 'If you put ice cream in the freezer, it will freeze solid.' },
  { icon: '🏫', vi: 'Phòng học được dọn dẹp bởi người lao công.', en: 'The classroom is cleaned by the cleaner.' },
  { icon: '🎨', vi: 'Anh ấy nói anh ấy thích vẽ tranh.', en: 'He said he liked painting.' },
  { icon: '🚕', vi: 'Tôi sẽ bắt taxi ngay bây giờ.', en: 'I will take a taxi now.' },
  { icon: '🏊', vi: 'Nếu bạn bơi mà không khởi động, bạn sẽ bị chuột rút.', en: 'If you swim without warming up, you will get a cramp.' },
  { icon: '🔥', vi: 'Đám cháy được dập tắt bởi lính cứu hỏa.', en: 'The fire was extinguished by the firefighter.' },
  { icon: '🐄', vi: 'Đàn bò được vắt sữa bởi người nông dân.', en: 'The cows are milked by the farmer.' },
  { icon: '👩‍💻', vi: 'Cô ấy nói cô ấy đã cập nhật phần mềm.', en: 'She said she had updated the software.' },
  { icon: '🚸', vi: 'Bạn phải lái xe chậm gần trường học.', en: 'You must drive slowly near the school.' },
  { icon: '🎈', vi: 'Nếu bạn thả bóng bay, bóng sẽ bay đi xa.', en: 'If you release the balloon, it will fly far away.' },
  { icon: '📚', vi: 'Chúng tôi sẽ ôn thi vào cuối tuần này.', en: 'We are going to study for the test this weekend.' },
  { icon: '🍎', vi: 'Tất cả những quả táo đều màu đỏ.', en: 'All of the apples are red.' },
  { icon: '⭐', vi: 'Không có ngôi sao nào màu đỏ cả.', en: 'None of the stars are red.' },
  { icon: '🦺', vi: 'Nếu bạn mặc áo phao, bạn sẽ an toàn hơn khi đi thuyền.', en: 'If you wear a life jacket, you will be safer on the boat.' },
  { icon: '🎸', vi: 'Họ sẽ biểu diễn ở buổi hòa nhạc của trường.', en: 'They are going to play at the school concert.' },
  { icon: '⚡', vi: 'Tôi sẽ gọi thợ điện ngay bây giờ.', en: 'I will call an electrician now.' },
  { icon: '🥽', vi: 'Bạn phải đeo kính bảo hộ trong phòng thí nghiệm.', en: 'You must wear safety goggles in the lab.' },
  { icon: '💧', vi: 'Nếu bạn không tưới cây, cây sẽ héo.', en: 'If you do not water the plants, they will wilt.' },
  { icon: '🕐', vi: 'Anh ấy sẽ đang nấu ăn lúc 8 giờ tối mai.', en: 'He will be cooking at 8pm tomorrow.' },
  { icon: '⏳', vi: 'Anh ấy đã đọc sách được hai tiếng rồi.', en: 'He has been reading for two hours.' },
  { icon: '⏮️', vi: 'Cô ấy đã viết xong trước khi trời mưa.', en: 'She had already written before it rained.' },
  { icon: '🔮', vi: 'Con mèo sẽ nhảy vào ngày mai.', en: 'The cat will jump tomorrow.' },
  { icon: '🔗', vi: 'Cô ấy sẽ nấu xong trước 8 giờ tối mai.', en: 'She will have already cooked by 8pm tomorrow.' },
  { icon: '🍝', vi: 'Món mì được nấu bởi đầu bếp.', en: 'The pasta is boiled by the cook.' },
  { icon: '📚', vi: 'Những cuốn sách được sắp xếp bởi thủ thư.', en: 'The books are organized by the librarian.' },
  { icon: '✈️', vi: 'Chiếc máy bay được lái bởi phi công.', en: 'The plane is flown by the pilot.' },
  { icon: '🎣', vi: 'Nếu anh ấy chuẩn bị mồi tốt, anh ấy sẽ câu được nhiều cá.', en: 'If he prepares good bait, he will catch many fish.' },
  { icon: '🚴', vi: 'Bạn không được đạp xe trên vỉa hè.', en: "You mustn't ride a bike on the sidewalk." },
  { icon: '🎭', vi: 'Nếu họ luyện tập chăm chỉ, buổi biểu diễn sẽ thành công.', en: 'If they practice the play hard, the show will be a success.' },
  { icon: '🍎', vi: 'Một phần những quả táo được tô đỏ.', en: 'Some of the apples are red.' },
  { icon: '⭐', vi: 'Tất cả những ngôi sao đều màu đỏ.', en: 'All of the stars are red.' },
  { icon: '🌀', vi: 'Con cáo đã chạy liên tục một tiếng trước khi cơn bão bắt đầu.', en: 'The fox had been running for an hour before the storm started.' },
  { icon: '🧪', vi: 'Các hóa chất được trộn bởi nhà khoa học.', en: 'The chemicals are mixed by the scientist.' },
  { icon: '⏳', vi: 'Đến 8 giờ tối mai, cô ấy sẽ đọc sách được hai tiếng rồi.', en: 'By 8pm tomorrow, she will have been reading for two hours.' },
  { icon: '🐘', vi: 'Đàn thú được cho ăn bởi người giữ vườn thú.', en: 'The animals are fed by the zookeeper.' },
  { icon: '🚲', vi: 'Chiếc xe đạp được sửa bởi thợ máy.', en: 'The bicycle is repaired by the mechanic.' },
  { icon: '🗣️', vi: 'Anh ấy nói anh ấy sẽ gọi điện cho tôi.', en: 'He said he would call me.' },
  { icon: '🦵', vi: 'Cậu bé đá quả bóng mỗi ngày.', en: 'The boy kicks the ball every day.' },
  { icon: '🙈', vi: 'Con mèo đang trốn bây giờ.', en: 'The cat is hiding now.' },
  { icon: '🏐', vi: 'Anh ấy đã ném quả bóng hôm qua.', en: 'He threw the ball yesterday.' },
  { icon: '🛒', vi: 'Cô ấy đang đẩy xe đẩy hàng bây giờ.', en: 'She is pushing the cart now.' },
  { icon: '🔢', vi: 'Không có con vật nào ở đây cả.', en: 'None of the animals are here.' },
  { icon: '🍯', vi: 'Mật ong được thu thập bởi người nuôi ong.', en: 'The honey is collected by the beekeeper.' },
];

// Nhân thêm câu bằng cách ghép CHARACTERS × VERBS × vài mẫu câu (giống cách
// Cỗ Máy Thời Gian sinh câu) — tiếng Việt KHÔNG chia động từ theo thì nên
// chỉ cần 1 từ gốc mỗi động từ + trạng từ thời gian ("đang"/"đã"/"sẽ"...),
// còn tiếng Anh tái dùng đúng các dạng thirdPerson/past/pp/ing/base đã có
// sẵn và đã được kiểm tra kỹ ở Cỗ Máy Thời Gian — không phát sinh rủi ro
// chia sai động từ mới.
const SB_CHARACTER_VI = {
  boy: 'Cậu bé', girl: 'Cô bé', cat: 'Con mèo', dog: 'Con chó', robot: 'Chú robot',
  grandma: 'Bà', grandpa: 'Ông', teacher: 'Cô giáo', farmer: 'Bác nông dân', rabbit: 'Con thỏ',
  monkey: 'Con khỉ', bird: 'Con chim', fish: 'Con cá', turtle: 'Con rùa', penguin: 'Con chim cánh cụt',
  koala: 'Con gấu koala', owl: 'Con cú', fox: 'Con cáo', lion: 'Con sư tử', panda: 'Con gấu trúc',
  elephant: 'Con voi', squirrel: 'Con sóc', duck: 'Con vịt',
};
const SB_VERB_VI = {
  play: 'chơi', watch: 'xem ti vi', run: 'chạy', cook: 'nấu ăn', jump: 'nhảy',
  swim: 'bơi', read: 'đọc sách', write: 'viết', sing: 'hát', dance: 'nhảy múa',
  walk: 'đi bộ', talk: 'nói chuyện', eat: 'ăn', drink: 'uống nước', sleep: 'ngủ',
  fly: 'bay', draw: 'vẽ tranh', ride: 'đạp xe', climb: 'leo trèo', clean: 'dọn dẹp',
  laugh: 'cười', smile: 'mỉm cười', shout: 'hét lên', whisper: 'thì thầm', skip: 'nhảy dây',
  wave: 'vẫy tay', paint: 'vẽ tranh', dream: 'mơ mộng', build: 'xây nhà', catch: 'bắt bóng',
  teach: 'dạy học', grow: 'trồng cây', kick: 'đá bóng', push: 'đẩy xe', hide: 'trốn',
  throw: 'ném bóng',
};

const SENTENCE_BUILDER_TEMPLATES = [
  { icon: '🕐', buildEn: (c, v) => `${c.subject} is ${v.ing} now.`, buildVi: (cv, vv) => `${cv} đang ${vv} bây giờ.` },
  { icon: '🔁', buildEn: (c, v) => `${c.subject} ${v.thirdPerson} every day.`, buildVi: (cv, vv) => `${cv} ${vv} mỗi ngày.` },
  { icon: '✅', buildEn: (c, v) => `${c.subject} ${v.past} yesterday afternoon.`, buildVi: (cv, vv) => `${cv} đã ${vv} chiều hôm qua.` },
  { icon: '📅', buildEn: (c, v) => `${c.subject} is going to ${v.base} tomorrow.`, buildVi: (cv, vv) => `${cv} sẽ ${vv} vào ngày mai.` },
  { icon: '🔗', buildEn: (c, v) => `${c.subject} has just ${v.pp}.`, buildVi: (cv, vv) => `${cv} vừa mới ${vv} xong.` },
  { icon: '🥦', buildEn: (c, v) => `${c.subject} should ${v.base} more often.`, buildVi: (cv, vv) => `${cv} nên ${vv} thường xuyên hơn.` },
  { icon: '🕐', buildEn: (c, v) => `${c.subject} was ${v.ing} at 8pm yesterday.`, buildVi: (cv, vv) => `${cv} đang ${vv} lúc 8 giờ tối hôm qua.` },
  { icon: '⏳', buildEn: (c, v) => `${c.subject} has been ${v.ing} for two hours.`, buildVi: (cv, vv) => `${cv} đã ${vv} được hai tiếng rồi.` },
  { icon: '⏮️', buildEn: (c, v) => `${c.subject} had already ${v.pp} before dinner.`, buildVi: (cv, vv) => `${cv} đã ${vv} xong trước bữa tối.` },
  { icon: '🔮', buildEn: (c, v) => `${c.subject} will ${v.base} tomorrow.`, buildVi: (cv, vv) => `${cv} sẽ ${vv} vào ngày mai.` },
  { icon: '🕐', buildEn: (c, v) => `${c.subject} will be ${v.ing} at noon tomorrow.`, buildVi: (cv, vv) => `${cv} sẽ đang ${vv} vào lúc trưa mai.` },
  { icon: '🔗', buildEn: (c, v) => `${c.subject} will have ${v.pp} by next week.`, buildVi: (cv, vv) => `${cv} sẽ ${vv} xong trước tuần sau.` },
  { icon: '🚦', buildEn: (c, v) => `${c.subject} must ${v.base} carefully.`, buildVi: (cv, vv) => `${cv} phải ${vv} cẩn thận.` },
  { icon: '🚫', buildEn: (c, v) => `${c.subject} does not ${v.base} on Sundays.`, buildVi: (cv, vv) => `${cv} không ${vv} vào Chủ Nhật.` },
  { icon: '🚫', buildEn: (c, v) => `${c.subject} did not ${v.base} yesterday.`, buildVi: (cv, vv) => `${cv} đã không ${vv} hôm qua.` },
  { icon: '🚫', buildEn: (c, v) => `${c.subject} is not ${v.ing} right now.`, buildVi: (cv, vv) => `${cv} không đang ${vv} bây giờ.` },
  { icon: '📜', buildEn: (c, v) => `${c.subject} used to ${v.base} a lot.`, buildVi: (cv, vv) => `${cv} từng ${vv} rất nhiều.` },
  { icon: '😊', buildEn: (c, v) => `${c.subject} enjoys ${v.ing} on weekends.`, buildVi: (cv, vv) => `${cv} thích ${vv} vào cuối tuần.` },
  { icon: '💪', buildEn: (c, v) => `${c.subject} can ${v.base} very well.`, buildVi: (cv, vv) => `${cv} có thể ${vv} rất giỏi.` },
  { icon: '🙋', buildEn: (c, v) => `${c.subject} would like to ${v.base} today.`, buildVi: (cv, vv) => `${cv} muốn ${vv} hôm nay.` },
  { icon: '📌', buildEn: (c, v) => `${c.subject} has to ${v.base} now.`, buildVi: (cv, vv) => `${cv} phải ${vv} ngay bây giờ.` },
  { icon: '🔮', buildEn: (c, v) => `${c.subject} might ${v.base} later.`, buildVi: (cv, vv) => `${cv} có thể sẽ ${vv} sau.` },
  { icon: '🚫', buildEn: (c, v) => `${c.subject} was not ${v.ing} yesterday.`, buildVi: (cv, vv) => `${cv} đã không ${vv} hôm qua.` },
  { icon: '📜', buildEn: (c, v) => `${c.subject} ought to ${v.base} soon.`, buildVi: (cv, vv) => `${cv} nên ${vv} sớm.` },
  { icon: '🔁', buildEn: (c, v) => `${c.subject} keeps ${v.ing} all day.`, buildVi: (cv, vv) => `${cv} cứ ${vv} cả ngày.` },
  { icon: '😊', buildEn: (c, v) => `${c.subject} loves to ${v.base} outside.`, buildVi: (cv, vv) => `${cv} rất thích ${vv} ngoài trời.` },
  { icon: '🌅', buildEn: (c, v) => `${c.subject} starts ${v.ing} at dawn.`, buildVi: (cv, vv) => `${cv} bắt đầu ${vv} lúc bình minh.` },
  // ----- Bổ sung vòng mục tiêu 850 -----
  { icon: '💪', buildEn: (c, v) => `${c.subject} is able to ${v.base} now.`, buildVi: (cv, vv) => `${cv} có thể ${vv} ngay bây giờ.` },
  { icon: '📌', buildEn: (c, v) => `${c.subject} is supposed to ${v.base} today.`, buildVi: (cv, vv) => `${cv} được cho là nên ${vv} hôm nay.` },
  { icon: '⏱️', buildEn: (c, v) => `${c.subject} is about to ${v.base}.`, buildVi: (cv, vv) => `${cv} sắp ${vv} rồi.` },
  { icon: '🔁', buildEn: (c, v) => `${c.subject} hardly ever ${v.thirdPerson}.`, buildVi: (cv, vv) => `${cv} hiếm khi ${vv}.` },
  { icon: '⏳', buildEn: (c, v) => `${c.subject} is still ${v.ing}.`, buildVi: (cv, vv) => `${cv} vẫn đang ${vv}.` },
  { icon: '📌', buildEn: (c, v) => `${c.subject} needs to ${v.base} right away.`, buildVi: (cv, vv) => `${cv} cần ${vv} ngay.` },
  { icon: '🔁', buildEn: (c, v) => `${c.subject} tends to ${v.base} after school.`, buildVi: (cv, vv) => `${cv} thường hay ${vv} sau giờ học.` },
  // ----- Bổ sung vòng mục tiêu 1000 -----
  { icon: '📌', buildEn: (c, v) => `${c.subject} had better ${v.base} soon.`, buildVi: (cv, vv) => `${cv} nên ${vv} sớm, kẻo muộn.` },
  { icon: '😴', buildEn: (c, v) => `${c.subject} would rather ${v.base} than sleep.`, buildVi: (cv, vv) => `${cv} thà ${vv} còn hơn là ngủ.` },
  { icon: '🔁', buildEn: (c, v) => `${c.subject} never ${v.thirdPerson} on Mondays.`, buildVi: (cv, vv) => `${cv} không bao giờ ${vv} vào thứ Hai.` },
  { icon: '⏱️', buildEn: (c, v) => `${c.subject} was about to ${v.base} when the phone rang.`, buildVi: (cv, vv) => `${cv} sắp ${vv} thì điện thoại reo.` },
  { icon: '🚫', buildEn: (c, v) => `${c.subject} has never ${v.pp}.`, buildVi: (cv, vv) => `${cv} chưa bao giờ ${vv}.` },
  { icon: '🔮', buildEn: (c, v) => `${c.subject} is going to have ${v.pp} by tomorrow.`, buildVi: (cv, vv) => `${cv} sẽ ${vv} xong trước ngày mai.` },
  { icon: '🚫', buildEn: (c, v) => `${c.subject} isn't going to ${v.base} today.`, buildVi: (cv, vv) => `${cv} sẽ không ${vv} hôm nay.` },
];

for (let i = 0; i < CHARACTERS.length; i++) {
  const char = CHARACTERS[i];
  const charVi = SB_CHARACTER_VI[char.id];
  SENTENCE_BUILDER_TEMPLATES.forEach((tpl, tIdx) => {
    const verb = VERBS[(i + tIdx * 7) % VERBS.length];
    const verbVi = SB_VERB_VI[verb.base];
    SENTENCE_BUILDER_POOL.push({
      icon: tpl.icon,
      vi: tpl.buildVi(charVi, verbVi),
      en: tpl.buildEn(char, verb),
    });
  });
}

function wordsOf(sentence) {
  return sentence.replace(/\.$/, '').split(' ');
}

/** 1 vòng: chọn 1 câu, tách thành từ, xáo trộn thứ tự hiển thị các "chip". */
export function makeSentenceBuilderRound(rng = Math.random) {
  const item = pick(SENTENCE_BUILDER_POOL, rng);
  const words = wordsOf(item.en);
  const chips = shuffle(words.map((word, wordIndex) => ({ word, wordIndex })), rng);
  return {
    item, words, chips, placedCount: 0, mistakes: 0,
  };
}

export function makeSentenceBuilderGame(count = 6, rng = Math.random) {
  const rounds = [];
  for (let i = 0; i < count; i++) rounds.push(makeSentenceBuilderRound(rng));
  return baseGameState(rounds);
}

export function currentSentenceBuilderRound(game) {
  return currentRoundOf(game);
}

/**
 * Bấm 1 chip từ (theo wordIndex — vị trí đúng của từ đó trong câu gốc).
 * Đúng thứ tự tiếp theo -> đặt vào chỗ, còn thiếu thì chưa qua vòng.
 * Sai lần đầu -> gợi ý (chip đúng được đánh dấu), vẫn được bấm lại.
 * Sai lần 2 -> lộ đáp án, tự hoàn thành câu, qua vòng (không tính đúng).
 */
export function tapSentenceBuilderChip(game, wordIndex) {
  const ev = {
    correct: false, wrong: false, retry: false, gain: 0, streakBonus: 0, roundDone: false, gameDone: false, won: false, complete: false,
  };
  if (game.over) return ev;
  const round = currentRoundOf(game);
  if (!round) return ev;

  if (wordIndex === round.placedCount) {
    round.placedCount++;
    round.chips = round.chips.filter((c) => c.wordIndex !== wordIndex);
    if (round.placedCount < round.words.length) {
      ev.correct = true;
      return ev;
    }
    ev.correct = true;
    ev.complete = true;
    game.correctCount++;
    if (round.mistakes === 0) {
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
      game.score += 5;
      ev.gain = 5;
    }
  } else {
    round.mistakes++;
    ev.wrong = true;
    if (round.mistakes === 1) {
      game.streak = 0;
      ev.retry = true;
      return ev;
    }
    round.placedCount = round.words.length;
    round.chips = [];
  }

  ev.roundDone = true;
  game.index++;
  if (game.index >= game.rounds.length) {
    game.over = true;
    game.won = game.correctCount >= Math.ceil(game.rounds.length * 0.6);
    ev.gameDone = true;
    ev.won = game.won;
  }
  return ev;
}

/* ===== 8. Chủ Động vs Bị Động (Passive Voice) ===== */

// objectPlural đánh dấu đồ vật/người số nhiều (chia "are/were" thay vì
// "is/was" cho đúng thì bị động). agentNoun/objectNoun đã có sẵn mạo từ
// "the" để ghép câu tự nhiên ở cả 2 vai trò chủ ngữ/tân ngữ.
export const PASSIVE_SCENARIOS = [
  {
    agentIcon: '👨‍🍳', agentNoun: 'the chef', objectIcon: '🍲', objectNoun: 'the soup', objectPlural: false, base: 'cook', past: 'cooked', pp: 'cooked', s3: 'cooks',
  },
  {
    agentIcon: '👩‍🏫', agentNoun: 'the teacher', objectIcon: '🧑‍🎓', objectNoun: 'the students', objectPlural: true, base: 'teach', past: 'taught', pp: 'taught', s3: 'teaches',
  },
  {
    agentIcon: '👨‍🎨', agentNoun: 'the painter', objectIcon: '🖼️', objectNoun: 'the picture', objectPlural: false, base: 'paint', past: 'painted', pp: 'painted', s3: 'paints',
  },
  {
    agentIcon: '👷', agentNoun: 'the builder', objectIcon: '🏠', objectNoun: 'the house', objectPlural: false, base: 'build', past: 'built', pp: 'built', s3: 'builds',
  },
  {
    agentIcon: '👨‍🌾', agentNoun: 'the farmer', objectIcon: '🌾', objectNoun: 'the rice', objectPlural: false, base: 'grow', past: 'grew', pp: 'grown', s3: 'grows',
  },
  {
    agentIcon: '👩‍🍳', agentNoun: 'the baker', objectIcon: '🍞', objectNoun: 'the bread', objectPlural: false, base: 'bake', past: 'baked', pp: 'baked', s3: 'bakes',
  },
  {
    agentIcon: '✍️', agentNoun: 'the writer', objectIcon: '📖', objectNoun: 'the book', objectPlural: false, base: 'write', past: 'wrote', pp: 'written', s3: 'writes',
  },
  {
    agentIcon: '🧹', agentNoun: 'the cleaner', objectIcon: '🏫', objectNoun: 'the classroom', objectPlural: false, base: 'clean', past: 'cleaned', pp: 'cleaned', s3: 'cleans',
  },
  {
    agentIcon: '👩', agentNoun: 'the woman', objectIcon: '🚗', objectNoun: 'the car', objectPlural: false, base: 'wash', past: 'washed', pp: 'washed', s3: 'washes',
  },
  {
    agentIcon: '📮', agentNoun: 'the postman', objectIcon: '✉️', objectNoun: 'the letters', objectPlural: true, base: 'deliver', past: 'delivered', pp: 'delivered', s3: 'delivers',
  },
  {
    agentIcon: '👧', agentNoun: 'the girl', objectIcon: '🌸', objectNoun: 'the flowers', objectPlural: true, base: 'plant', past: 'planted', pp: 'planted', s3: 'plants',
  },
  {
    agentIcon: '🎣', agentNoun: 'the fisherman', objectIcon: '🐟', objectNoun: 'the fish', objectPlural: false, base: 'catch', past: 'caught', pp: 'caught', s3: 'catches',
  },
  {
    agentIcon: '📷', agentNoun: 'the photographer', objectIcon: '📸', objectNoun: 'the photos', objectPlural: true, base: 'take', past: 'took', pp: 'taken', s3: 'takes',
  },
  {
    agentIcon: '🎤', agentNoun: 'the singer', objectIcon: '🎵', objectNoun: 'the song', objectPlural: false, base: 'sing', past: 'sang', pp: 'sung', s3: 'sings',
  },
  {
    agentIcon: '🧒', agentNoun: 'the boy', objectIcon: '🪟', objectNoun: 'the window', objectPlural: false, base: 'break', past: 'broke', pp: 'broken', s3: 'breaks',
  },
  {
    agentIcon: '🏭', agentNoun: 'the factory', objectIcon: '🚙', objectNoun: 'the cars', objectPlural: true, base: 'make', past: 'made', pp: 'made', s3: 'makes',
  },
  {
    agentIcon: '🧑‍🌾', agentNoun: 'the gardener', objectIcon: '🌿', objectNoun: 'the plants', objectPlural: true, base: 'water', past: 'watered', pp: 'watered', s3: 'waters',
  },
  {
    agentIcon: '🦺', agentNoun: 'the zookeeper', objectIcon: '🐘', objectNoun: 'the animals', objectPlural: true, base: 'feed', past: 'fed', pp: 'fed', s3: 'feeds',
  },
  {
    agentIcon: '🧑‍🔧', agentNoun: 'the mechanic', objectIcon: '🚲', objectNoun: 'the bicycle', objectPlural: false, base: 'repair', past: 'repaired', pp: 'repaired', s3: 'repairs',
  },
  {
    agentIcon: '🧑‍⚕️', agentNoun: 'the doctor', objectIcon: '🤒', objectNoun: 'the patient', objectPlural: false, base: 'examine', past: 'examined', pp: 'examined', s3: 'examines',
  },
  {
    agentIcon: '🧑‍🏭', agentNoun: 'the worker', objectIcon: '📦', objectNoun: 'the boxes', objectPlural: true, base: 'pack', past: 'packed', pp: 'packed', s3: 'packs',
  },
  {
    agentIcon: '🧑‍🎨', agentNoun: 'the artist', objectIcon: '🗿', objectNoun: 'the statue', objectPlural: false, base: 'carve', past: 'carved', pp: 'carved', s3: 'carves',
  },
  {
    agentIcon: '🧑‍🚒', agentNoun: 'the firefighter', objectIcon: '🔥', objectNoun: 'the fire', objectPlural: false, base: 'extinguish', past: 'extinguished', pp: 'extinguished', s3: 'extinguishes',
  },
  {
    agentIcon: '🧑‍🏫', agentNoun: 'the professor', objectIcon: '📄', objectNoun: 'the exam papers', objectPlural: true, base: 'grade', past: 'graded', pp: 'graded', s3: 'grades',
  },
  {
    agentIcon: '🧑‍🌾', agentNoun: 'the farmer', objectIcon: '🐄', objectNoun: 'the cows', objectPlural: true, base: 'milk', past: 'milked', pp: 'milked', s3: 'milks',
  },
  {
    agentIcon: '🧑‍💻', agentNoun: 'the programmer', objectIcon: '💻', objectNoun: 'the software', objectPlural: false, base: 'update', past: 'updated', pp: 'updated', s3: 'updates',
  },
  {
    agentIcon: '🧑‍🍳', agentNoun: 'the cook', objectIcon: '🍝', objectNoun: 'the pasta', objectPlural: false, base: 'boil', past: 'boiled', pp: 'boiled', s3: 'boils',
  },
  {
    agentIcon: '🧑‍🚀', agentNoun: 'the astronaut', objectIcon: '🛰️', objectNoun: 'the satellite', objectPlural: false, base: 'launch', past: 'launched', pp: 'launched', s3: 'launches',
  },
  {
    agentIcon: '🧑‍💼', agentNoun: 'the librarian', objectIcon: '📚', objectNoun: 'the books', objectPlural: true, base: 'organize', past: 'organized', pp: 'organized', s3: 'organizes',
  },
  {
    agentIcon: '🧑‍🔬', agentNoun: 'the scientist', objectIcon: '🧪', objectNoun: 'the chemicals', objectPlural: true, base: 'mix', past: 'mixed', pp: 'mixed', s3: 'mixes',
  },
  {
    agentIcon: '🧑‍🚚', agentNoun: 'the driver', objectIcon: '📦', objectNoun: 'the package', objectPlural: false, base: 'deliver', past: 'delivered', pp: 'delivered', s3: 'delivers',
  },
  {
    agentIcon: '🧑‍🏫', agentNoun: 'the coach', objectIcon: '⚽', objectNoun: 'the team', objectPlural: false, base: 'train', past: 'trained', pp: 'trained', s3: 'trains',
  },
  {
    agentIcon: '🧑‍🎨', agentNoun: 'the designer', objectIcon: '👗', objectNoun: 'the dress', objectPlural: false, base: 'design', past: 'designed', pp: 'designed', s3: 'designs',
  },
  {
    agentIcon: '🧑‍✈️', agentNoun: 'the pilot', objectIcon: '✈️', objectNoun: 'the plane', objectPlural: false, base: 'fly', past: 'flew', pp: 'flown', s3: 'flies',
  },
  {
    agentIcon: '🧑‍🎤', agentNoun: 'the DJ', objectIcon: '🎶', objectNoun: 'the music', objectPlural: false, base: 'play', past: 'played', pp: 'played', s3: 'plays',
  },
  {
    agentIcon: '🧑‍🔧', agentNoun: 'the electrician', objectIcon: '💡', objectNoun: 'the lights', objectPlural: true, base: 'fix', past: 'fixed', pp: 'fixed', s3: 'fixes',
  },
  {
    agentIcon: '🧑‍🌾', agentNoun: 'the beekeeper', objectIcon: '🍯', objectNoun: 'the honey', objectPlural: false, base: 'collect', past: 'collected', pp: 'collected', s3: 'collects',
  },
  {
    agentIcon: '🧑‍🎓', agentNoun: 'the student', objectIcon: '📝', objectNoun: 'the essay', objectPlural: false, base: 'write', past: 'wrote', pp: 'written', s3: 'writes',
  },
  {
    agentIcon: '🧑‍🚀', agentNoun: 'the engineer', objectIcon: '🚀', objectNoun: 'the rocket', objectPlural: false, base: 'design', past: 'designed', pp: 'designed', s3: 'designs',
  },
  {
    agentIcon: '🧑‍🍳', agentNoun: 'the chef', objectIcon: '🎂', objectNoun: 'the cake', objectPlural: false, base: 'decorate', past: 'decorated', pp: 'decorated', s3: 'decorates',
  },
  {
    agentIcon: '🧵', agentNoun: 'the tailor', objectIcon: '👔', objectNoun: 'the shirt', objectPlural: false, base: 'sew', past: 'sewed', pp: 'sewn', s3: 'sews',
  },
  {
    agentIcon: '🧑‍🔧', agentNoun: 'the plumber', objectIcon: '🚰', objectNoun: 'the pipe', objectPlural: false, base: 'fix', past: 'fixed', pp: 'fixed', s3: 'fixes',
  },
  {
    agentIcon: '🪚', agentNoun: 'the carpenter', objectIcon: '🪑', objectNoun: 'the table', objectPlural: false, base: 'build', past: 'built', pp: 'built', s3: 'builds',
  },
  {
    agentIcon: '🧳', agentNoun: 'the tourist', objectIcon: '🗺️', objectNoun: 'the map', objectPlural: false, base: 'fold', past: 'folded', pp: 'folded', s3: 'folds',
  },
  {
    agentIcon: '🧹', agentNoun: 'the janitor', objectIcon: '🧽', objectNoun: 'the floor', objectPlural: false, base: 'sweep', past: 'swept', pp: 'swept', s3: 'sweeps',
  },
  {
    agentIcon: '🐾', agentNoun: 'the vet', objectIcon: '🐶', objectNoun: 'the puppy', objectPlural: false, base: 'examine', past: 'examined', pp: 'examined', s3: 'examines',
  },
  {
    agentIcon: '💈', agentNoun: 'the barber', objectIcon: '✂️', objectNoun: 'the hair', objectPlural: false, base: 'cut', past: 'cut', pp: 'cut', s3: 'cuts',
  },
  {
    agentIcon: '🧵', agentNoun: 'the seamstress', objectIcon: '🎭', objectNoun: 'the costume', objectPlural: false, base: 'design', past: 'designed', pp: 'designed', s3: 'designs',
  },
  {
    agentIcon: '🧑‍🔧', agentNoun: 'the electrician', objectIcon: '🔌', objectNoun: 'the wiring', objectPlural: false, base: 'install', past: 'installed', pp: 'installed', s3: 'installs',
  },
  {
    agentIcon: '🧑‍🔧', agentNoun: 'the plumber', objectIcon: '🚿', objectNoun: 'the sink', objectPlural: false, base: 'repair', past: 'repaired', pp: 'repaired', s3: 'repairs',
  },
  {
    agentIcon: '🧵', agentNoun: 'the tailor', objectIcon: '👖', objectNoun: 'the trousers', objectPlural: true, base: 'hem', past: 'hemmed', pp: 'hemmed', s3: 'hems',
  },
  {
    agentIcon: '👨‍🍳', agentNoun: 'the chef', objectIcon: '🥦', objectNoun: 'the vegetables', objectPlural: true, base: 'chop', past: 'chopped', pp: 'chopped', s3: 'chops',
  },
  {
    agentIcon: '🧑‍🍽️', agentNoun: 'the waiter', objectIcon: '🍽️', objectNoun: 'the table', objectPlural: false, base: 'clean', past: 'cleaned', pp: 'cleaned', s3: 'cleans',
  },
  {
    agentIcon: '🧑‍🎨', agentNoun: 'the artist', objectIcon: '🖼️', objectNoun: 'the mural', objectPlural: false, base: 'paint', past: 'painted', pp: 'painted', s3: 'paints',
  },
  {
    agentIcon: '🧑‍🔧', agentNoun: 'the mechanic', objectIcon: '⚙️', objectNoun: 'the engine', objectPlural: false, base: 'repair', past: 'repaired', pp: 'repaired', s3: 'repairs',
  },
  {
    agentIcon: '👨‍🌾', agentNoun: 'the farmer', objectIcon: '🌾', objectNoun: 'the wheat', objectPlural: false, base: 'harvest', past: 'harvested', pp: 'harvested', s3: 'harvests',
  },
  {
    agentIcon: '🎣', agentNoun: 'the fisherman', objectIcon: '🥅', objectNoun: 'the net', objectPlural: false, base: 'repair', past: 'repaired', pp: 'repaired', s3: 'repairs',
  },
  {
    agentIcon: '🧑‍⚕️', agentNoun: 'the nurse', objectIcon: '🩹', objectNoun: 'the wound', objectPlural: false, base: 'bandage', past: 'bandaged', pp: 'bandaged', s3: 'bandages',
  },
  {
    agentIcon: '🧵', agentNoun: 'the tailor', objectIcon: '🔘', objectNoun: 'the buttons', objectPlural: true, base: 'sew', past: 'sewed', pp: 'sewn', s3: 'sews',
  },
  {
    agentIcon: '🖨️', agentNoun: 'the printer', objectIcon: '📰', objectNoun: 'the posters', objectPlural: true, base: 'print', past: 'printed', pp: 'printed', s3: 'prints',
  },
  {
    agentIcon: '🦷', agentNoun: 'the dentist', objectIcon: '🪥', objectNoun: 'the tooth', objectPlural: false, base: 'examine', past: 'examined', pp: 'examined', s3: 'examines',
  },
  {
    agentIcon: '📷', agentNoun: 'the photographer', objectIcon: '💍', objectNoun: 'the wedding', objectPlural: false, base: 'film', past: 'filmed', pp: 'filmed', s3: 'films',
  },
  {
    agentIcon: '💂', agentNoun: 'the guard', objectIcon: '🚪', objectNoun: 'the gate', objectPlural: false, base: 'lock', past: 'locked', pp: 'locked', s3: 'locks',
  },
  {
    agentIcon: '🧹', agentNoun: 'the cleaner', objectIcon: '🟫', objectNoun: 'the carpet', objectPlural: false, base: 'vacuum', past: 'vacuumed', pp: 'vacuumed', s3: 'vacuums',
  },
  {
    agentIcon: '👨‍🍳', agentNoun: 'the chef', objectIcon: '🥗', objectNoun: 'the salad', objectPlural: false, base: 'prepare', past: 'prepared', pp: 'prepared', s3: 'prepares',
  },
  {
    agentIcon: '👩‍🏫', agentNoun: 'the teacher', objectIcon: '📝', objectNoun: 'the test', objectPlural: false, base: 'grade', past: 'graded', pp: 'graded', s3: 'grades',
  },
  {
    agentIcon: '🧑‍💼', agentNoun: 'the assistant', objectIcon: '📧', objectNoun: 'the emails', objectPlural: true, base: 'answer', past: 'answered', pp: 'answered', s3: 'answers',
  },
  {
    agentIcon: '🏃', agentNoun: 'the athlete', objectIcon: '🏆', objectNoun: 'the record', objectPlural: false, base: 'break', past: 'broke', pp: 'broken', s3: 'breaks',
  },
  {
    agentIcon: '🗿', agentNoun: 'the sculptor', objectIcon: '✨', objectNoun: 'the statue', objectPlural: false, base: 'polish', past: 'polished', pp: 'polished', s3: 'polishes',
  },
  {
    agentIcon: '👩‍🍳', agentNoun: 'the baker', objectIcon: '🧁', objectNoun: 'the cupcakes', objectPlural: true, base: 'decorate', past: 'decorated', pp: 'decorated', s3: 'decorates',
  },
  {
    agentIcon: '🧑‍🍳', agentNoun: 'the sous chef', objectIcon: '🥘', objectNoun: 'the stew', objectPlural: false, base: 'cook', past: 'cooked', pp: 'cooked', s3: 'cooks',
  },
  {
    agentIcon: '🧑‍🏫', agentNoun: 'the tutor', objectIcon: '📖', objectNoun: 'the lesson', objectPlural: false, base: 'teach', past: 'taught', pp: 'taught', s3: 'teaches',
  },
  {
    agentIcon: '🧑‍🎨', agentNoun: 'the muralist', objectIcon: '🧱', objectNoun: 'the wall', objectPlural: false, base: 'paint', past: 'painted', pp: 'painted', s3: 'paints',
  },
  {
    agentIcon: '🧑‍🔧', agentNoun: 'the builder', objectIcon: '🏢', objectNoun: 'the office', objectPlural: false, base: 'build', past: 'built', pp: 'built', s3: 'builds',
  },
  {
    agentIcon: '👨‍🌾', agentNoun: 'the gardener', objectIcon: '🌽', objectNoun: 'the corn', objectPlural: false, base: 'grow', past: 'grew', pp: 'grown', s3: 'grows',
  },
  {
    agentIcon: '👩‍🍳', agentNoun: 'the pastry chef', objectIcon: '🥐', objectNoun: 'the croissants', objectPlural: true, base: 'bake', past: 'baked', pp: 'baked', s3: 'bakes',
  },
  {
    agentIcon: '✍️', agentNoun: 'the journalist', objectIcon: '📰', objectNoun: 'the report', objectPlural: false, base: 'write', past: 'wrote', pp: 'written', s3: 'writes',
  },
  {
    agentIcon: '🧹', agentNoun: 'the housekeeper', objectIcon: '🛋️', objectNoun: 'the sofa', objectPlural: false, base: 'clean', past: 'cleaned', pp: 'cleaned', s3: 'cleans',
  },
  {
    agentIcon: '🧑', agentNoun: 'the vendor', objectIcon: '🍇', objectNoun: 'the grapes', objectPlural: true, base: 'wash', past: 'washed', pp: 'washed', s3: 'washes',
  },
  {
    agentIcon: '🚚', agentNoun: 'the courier', objectIcon: '📦', objectNoun: 'the packages', objectPlural: true, base: 'deliver', past: 'delivered', pp: 'delivered', s3: 'delivers',
  },
  {
    agentIcon: '🧑‍🌾', agentNoun: 'the gardener', objectIcon: '🌻', objectNoun: 'the sunflowers', objectPlural: true, base: 'plant', past: 'planted', pp: 'planted', s3: 'plants',
  },
  {
    agentIcon: '🥅', agentNoun: 'the goalkeeper', objectIcon: '⚽', objectNoun: 'the ball', objectPlural: false, base: 'catch', past: 'caught', pp: 'caught', s3: 'catches',
  },
  {
    agentIcon: '📸', agentNoun: 'the photographer', objectIcon: '🖼️', objectNoun: 'the pictures', objectPlural: true, base: 'take', past: 'took', pp: 'taken', s3: 'takes',
  },
  {
    agentIcon: '🎤', agentNoun: 'the choir', objectIcon: '🎵', objectNoun: 'the anthem', objectPlural: false, base: 'sing', past: 'sang', pp: 'sung', s3: 'sings',
  },
  {
    agentIcon: '🧒', agentNoun: 'the boy', objectIcon: '🏺', objectNoun: 'the vase', objectPlural: false, base: 'break', past: 'broke', pp: 'broken', s3: 'breaks',
  },
  {
    agentIcon: '🏭', agentNoun: 'the workshop', objectIcon: '🪑', objectNoun: 'the chairs', objectPlural: true, base: 'make', past: 'made', pp: 'made', s3: 'makes',
  },
  {
    agentIcon: '🗿', agentNoun: 'the sculptor', objectIcon: '🦅', objectNoun: 'the eagle statue', objectPlural: false, base: 'carve', past: 'carved', pp: 'carved', s3: 'carves',
  },
  {
    agentIcon: '🧑‍🚒', agentNoun: 'the firefighter', objectIcon: '🔥', objectNoun: 'the campfire', objectPlural: false, base: 'extinguish', past: 'extinguished', pp: 'extinguished', s3: 'extinguishes',
  },
  {
    agentIcon: '👩‍🏫', agentNoun: 'the professor', objectIcon: '📄', objectNoun: 'the essays', objectPlural: true, base: 'grade', past: 'graded', pp: 'graded', s3: 'grades',
  },
  {
    agentIcon: '👨‍🌾', agentNoun: 'the herder', objectIcon: '🐐', objectNoun: 'the goats', objectPlural: true, base: 'milk', past: 'milked', pp: 'milked', s3: 'milks',
  },
  {
    agentIcon: '🧑‍💻', agentNoun: 'the developer', objectIcon: '📱', objectNoun: 'the app', objectPlural: false, base: 'update', past: 'updated', pp: 'updated', s3: 'updates',
  },
  {
    agentIcon: '🧑‍🍳', agentNoun: 'the cook', objectIcon: '🥚', objectNoun: 'the eggs', objectPlural: true, base: 'boil', past: 'boiled', pp: 'boiled', s3: 'boils',
  },
  {
    agentIcon: '🧑‍🚀', agentNoun: 'the crew', objectIcon: '🛰️', objectNoun: 'the probe', objectPlural: false, base: 'launch', past: 'launched', pp: 'launched', s3: 'launches',
  },
  {
    agentIcon: '🧑‍💼', agentNoun: 'the clerk', objectIcon: '🗂️', objectNoun: 'the files', objectPlural: true, base: 'organize', past: 'organized', pp: 'organized', s3: 'organizes',
  },
  {
    agentIcon: '🧑‍🔬', agentNoun: 'the technician', objectIcon: '🧴', objectNoun: 'the samples', objectPlural: true, base: 'mix', past: 'mixed', pp: 'mixed', s3: 'mixes',
  },
  {
    agentIcon: '🏋️', agentNoun: 'the coach', objectIcon: '🏃', objectNoun: 'the runners', objectPlural: true, base: 'train', past: 'trained', pp: 'trained', s3: 'trains',
  },
  {
    agentIcon: '🧑‍🎨', agentNoun: 'the artist', objectIcon: '🎭', objectNoun: 'the costume', objectPlural: false, base: 'design', past: 'designed', pp: 'designed', s3: 'designs',
  },
  {
    agentIcon: '🧑‍✈️', agentNoun: 'the co-pilot', objectIcon: '🛩️', objectNoun: 'the aircraft', objectPlural: false, base: 'fly', past: 'flew', pp: 'flown', s3: 'flies',
  },
  {
    agentIcon: '🧵', agentNoun: 'the seamstress', objectIcon: '👖', objectNoun: 'the hem', objectPlural: false, base: 'sew', past: 'sewed', pp: 'sewn', s3: 'sews',
  },
  {
    agentIcon: '🧑‍🔧', agentNoun: 'the technician', objectIcon: '💻', objectNoun: 'the laptop', objectPlural: false, base: 'fix', past: 'fixed', pp: 'fixed', s3: 'fixes',
  },
  {
    agentIcon: '🧑‍🔧', agentNoun: 'the electrician', objectIcon: '🔌', objectNoun: 'the socket', objectPlural: false, base: 'install', past: 'installed', pp: 'installed', s3: 'installs',
  },
  {
    agentIcon: '🧑‍🔧', agentNoun: 'the plumber', objectIcon: '🚽', objectNoun: 'the toilet', objectPlural: false, base: 'repair', past: 'repaired', pp: 'repaired', s3: 'repairs',
  },
  {
    agentIcon: '🧵', agentNoun: 'the tailor', objectIcon: '🧥', objectNoun: 'the sleeve', objectPlural: false, base: 'hem', past: 'hemmed', pp: 'hemmed', s3: 'hems',
  },
  {
    agentIcon: '👨‍🍳', agentNoun: 'the chef', objectIcon: '🧅', objectNoun: 'the onions', objectPlural: true, base: 'chop', past: 'chopped', pp: 'chopped', s3: 'chops',
  },
  {
    agentIcon: '👨‍🌾', agentNoun: 'the farmer', objectIcon: '🌾', objectNoun: 'the wheat field', objectPlural: false, base: 'harvest', past: 'harvested', pp: 'harvested', s3: 'harvests',
  },
  {
    agentIcon: '🧑‍⚕️', agentNoun: 'the nurse', objectIcon: '🩹', objectNoun: 'the cut', objectPlural: false, base: 'bandage', past: 'bandaged', pp: 'bandaged', s3: 'bandages',
  },
  {
    agentIcon: '🖨️', agentNoun: 'the shop', objectIcon: '🏷️', objectNoun: 'the labels', objectPlural: true, base: 'print', past: 'printed', pp: 'printed', s3: 'prints',
  },
  {
    agentIcon: '🧑‍⚕️', agentNoun: 'the doctor', objectIcon: '🦴', objectNoun: 'the x-ray', objectPlural: false, base: 'examine', past: 'examined', pp: 'examined', s3: 'examines',
  },
  {
    agentIcon: '🎥', agentNoun: 'the crew', objectIcon: '🎬', objectNoun: 'the scene', objectPlural: false, base: 'film', past: 'filmed', pp: 'filmed', s3: 'films',
  },
  {
    agentIcon: '💂', agentNoun: 'the guard', objectIcon: '🏰', objectNoun: 'the castle gate', objectPlural: false, base: 'lock', past: 'locked', pp: 'locked', s3: 'locks',
  },
  {
    agentIcon: '🧹', agentNoun: 'the cleaner', objectIcon: '🪜', objectNoun: 'the staircase', objectPlural: false, base: 'vacuum', past: 'vacuumed', pp: 'vacuumed', s3: 'vacuums',
  },
  {
    agentIcon: '🧑‍🍳', agentNoun: 'the chef', objectIcon: '🍱', objectNoun: 'the lunchbox', objectPlural: false, base: 'prepare', past: 'prepared', pp: 'prepared', s3: 'prepares',
  },
  {
    agentIcon: '👩‍🍳', agentNoun: 'the baker', objectIcon: '🎂', objectNoun: 'the wedding cake', objectPlural: false, base: 'decorate', past: 'decorated', pp: 'decorated', s3: 'decorates',
  },
  {
    agentIcon: '🧑‍🎨', agentNoun: 'the jeweler', objectIcon: '💍', objectNoun: 'the ring', objectPlural: false, base: 'polish', past: 'polished', pp: 'polished', s3: 'polishes',
  },
  {
    agentIcon: '🧑‍💼', agentNoun: 'the receptionist', objectIcon: '☎️', objectNoun: 'the calls', objectPlural: true, base: 'answer', past: 'answered', pp: 'answered', s3: 'answers',
  },
  {
    agentIcon: '✂️', agentNoun: 'the barber', objectIcon: '💇', objectNoun: 'the fringe', objectPlural: false, base: 'cut', past: 'cut', pp: 'cut', s3: 'cuts',
  },
  {
    agentIcon: '🧑‍🍳', agentNoun: 'the chef', objectIcon: '🍤', objectNoun: 'the shrimp', objectPlural: true, base: 'cook', past: 'cooked', pp: 'cooked', s3: 'cooks',
  },
  {
    agentIcon: '🧑‍🏫', agentNoun: 'the coach', objectIcon: '📋', objectNoun: 'the players', objectPlural: true, base: 'teach', past: 'taught', pp: 'taught', s3: 'teaches',
  },
  {
    agentIcon: '🧑‍🎨', agentNoun: 'the decorator', objectIcon: '🚪', objectNoun: 'the door', objectPlural: false, base: 'paint', past: 'painted', pp: 'painted', s3: 'paints',
  },
  {
    agentIcon: '🧑‍🔧', agentNoun: 'the contractor', objectIcon: '🏡', objectNoun: 'the porch', objectPlural: false, base: 'build', past: 'built', pp: 'built', s3: 'builds',
  },
  {
    agentIcon: '👨‍🌾', agentNoun: 'the farmer', objectIcon: '🍅', objectNoun: 'the tomatoes', objectPlural: true, base: 'grow', past: 'grew', pp: 'grown', s3: 'grows',
  },
  {
    agentIcon: '👩‍🍳', agentNoun: 'the baker', objectIcon: '🥖', objectNoun: 'the baguette', objectPlural: false, base: 'bake', past: 'baked', pp: 'baked', s3: 'bakes',
  },
  {
    agentIcon: '✍️', agentNoun: 'the author', objectIcon: '📕', objectNoun: 'the novel', objectPlural: false, base: 'write', past: 'wrote', pp: 'written', s3: 'writes',
  },
  {
    agentIcon: '🧹', agentNoun: 'the janitor', objectIcon: '🪟', objectNoun: 'the windows', objectPlural: true, base: 'clean', past: 'cleaned', pp: 'cleaned', s3: 'cleans',
  },
  {
    agentIcon: '🧑', agentNoun: 'the attendant', objectIcon: '🧺', objectNoun: 'the linens', objectPlural: true, base: 'wash', past: 'washed', pp: 'washed', s3: 'washes',
  },
  {
    agentIcon: '🚚', agentNoun: 'the driver', objectIcon: '🥛', objectNoun: 'the milk crates', objectPlural: true, base: 'deliver', past: 'delivered', pp: 'delivered', s3: 'delivers',
  },
  {
    agentIcon: '🧑‍🌾', agentNoun: 'the farmer', objectIcon: '🌷', objectNoun: 'the tulips', objectPlural: true, base: 'plant', past: 'planted', pp: 'planted', s3: 'plants',
  },
  {
    agentIcon: '🥅', agentNoun: 'the fielder', objectIcon: '⚾', objectNoun: 'the ball', objectPlural: false, base: 'catch', past: 'caught', pp: 'caught', s3: 'catches',
  },
  {
    agentIcon: '📸', agentNoun: 'the tourist', objectIcon: '📷', objectNoun: 'the photos', objectPlural: true, base: 'take', past: 'took', pp: 'taken', s3: 'takes',
  },
  {
    agentIcon: '🎤', agentNoun: 'the band', objectIcon: '🎶', objectNoun: 'the song', objectPlural: false, base: 'sing', past: 'sang', pp: 'sung', s3: 'sings',
  },
  {
    agentIcon: '🐈', agentNoun: 'the cat', objectIcon: '🍽️', objectNoun: 'the plate', objectPlural: false, base: 'break', past: 'broke', pp: 'broken', s3: 'breaks',
  },
  {
    agentIcon: '🏭', agentNoun: 'the factory', objectIcon: '🧸', objectNoun: 'the toys', objectPlural: true, base: 'make', past: 'made', pp: 'made', s3: 'makes',
  },
  {
    agentIcon: '🗿', agentNoun: 'the artist', objectIcon: '🐉', objectNoun: 'the dragon statue', objectPlural: false, base: 'carve', past: 'carved', pp: 'carved', s3: 'carves',
  },
  {
    agentIcon: '🧑‍🚒', agentNoun: 'the crew', objectIcon: '🚗', objectNoun: 'the car fire', objectPlural: false, base: 'extinguish', past: 'extinguished', pp: 'extinguished', s3: 'extinguishes',
  },
  {
    agentIcon: '👩‍🏫', agentNoun: 'the teacher', objectIcon: '📊', objectNoun: 'the quizzes', objectPlural: true, base: 'grade', past: 'graded', pp: 'graded', s3: 'grades',
  },
  {
    agentIcon: '👨‍🌾', agentNoun: 'the farmer', objectIcon: '🐑', objectNoun: 'the sheep', objectPlural: true, base: 'milk', past: 'milked', pp: 'milked', s3: 'milks',
  },
  {
    agentIcon: '🧑‍💻', agentNoun: 'the engineer', objectIcon: '🖥️', objectNoun: 'the system', objectPlural: false, base: 'update', past: 'updated', pp: 'updated', s3: 'updates',
  },
  {
    agentIcon: '🧑‍🍳', agentNoun: 'the chef', objectIcon: '🍲', objectNoun: 'the broth', objectPlural: false, base: 'boil', past: 'boiled', pp: 'boiled', s3: 'boils',
  },
  {
    agentIcon: '🧑‍🚀', agentNoun: 'the agency', objectIcon: '🚀', objectNoun: 'the rocket', objectPlural: false, base: 'launch', past: 'launched', pp: 'launched', s3: 'launches',
  },
  {
    agentIcon: '🧑‍💼', agentNoun: 'the assistant', objectIcon: '📚', objectNoun: 'the archive', objectPlural: false, base: 'organize', past: 'organized', pp: 'organized', s3: 'organizes',
  },
  {
    agentIcon: '🧑‍🔬', agentNoun: 'the scientist', objectIcon: '🧪', objectNoun: 'the solution', objectPlural: false, base: 'mix', past: 'mixed', pp: 'mixed', s3: 'mixes',
  },
  {
    agentIcon: '🏋️', agentNoun: 'the trainer', objectIcon: '🏊', objectNoun: 'the swimmers', objectPlural: true, base: 'train', past: 'trained', pp: 'trained', s3: 'trains',
  },
  {
    agentIcon: '🧑‍🎨', agentNoun: 'the designer', objectIcon: '👠', objectNoun: 'the shoes', objectPlural: true, base: 'design', past: 'designed', pp: 'designed', s3: 'designs',
  },
  {
    agentIcon: '🧑‍✈️', agentNoun: 'the pilot', objectIcon: '🚁', objectNoun: 'the helicopter', objectPlural: false, base: 'fly', past: 'flew', pp: 'flown', s3: 'flies',
  },
  {
    agentIcon: '🧵', agentNoun: 'the tailor', objectIcon: '🎽', objectNoun: 'the jersey', objectPlural: false, base: 'sew', past: 'sewed', pp: 'sewn', s3: 'sews',
  },
  {
    agentIcon: '🧑‍🔧', agentNoun: 'the mechanic', objectIcon: '🚜', objectNoun: 'the tractor', objectPlural: false, base: 'fix', past: 'fixed', pp: 'fixed', s3: 'fixes',
  },
  {
    agentIcon: '🧑‍🔧', agentNoun: 'the technician', objectIcon: '📡', objectNoun: 'the antenna', objectPlural: false, base: 'install', past: 'installed', pp: 'installed', s3: 'installs',
  },
  {
    agentIcon: '🧑‍🔧', agentNoun: 'the plumber', objectIcon: '🚿', objectNoun: 'the shower', objectPlural: false, base: 'repair', past: 'repaired', pp: 'repaired', s3: 'repairs',
  },
  {
    agentIcon: '🧵', agentNoun: 'the seamstress', objectIcon: '👗', objectNoun: 'the waist', objectPlural: false, base: 'hem', past: 'hemmed', pp: 'hemmed', s3: 'hems',
  },
  {
    agentIcon: '👨‍🍳', agentNoun: 'the cook', objectIcon: '🥕', objectNoun: 'the carrots', objectPlural: true, base: 'chop', past: 'chopped', pp: 'chopped', s3: 'chops',
  },
  {
    agentIcon: '👨‍🌾', agentNoun: 'the farmer', objectIcon: '🌽', objectNoun: 'the cornfield', objectPlural: false, base: 'harvest', past: 'harvested', pp: 'harvested', s3: 'harvests',
  },
  {
    agentIcon: '🧑‍⚕️', agentNoun: 'the medic', objectIcon: '🩹', objectNoun: 'the injury', objectPlural: false, base: 'bandage', past: 'bandaged', pp: 'bandaged', s3: 'bandages',
  },
  {
    agentIcon: '🖨️', agentNoun: 'the printer', objectIcon: '📇', objectNoun: 'the cards', objectPlural: true, base: 'print', past: 'printed', pp: 'printed', s3: 'prints',
  },
  {
    agentIcon: '🧑‍⚕️', agentNoun: 'the vet', objectIcon: '🐴', objectNoun: 'the horse', objectPlural: false, base: 'examine', past: 'examined', pp: 'examined', s3: 'examines',
  },
  {
    agentIcon: '🎥', agentNoun: 'the director', objectIcon: '🎞️', objectNoun: 'the trailer', objectPlural: false, base: 'film', past: 'filmed', pp: 'filmed', s3: 'films',
  },
  {
    agentIcon: '💂', agentNoun: 'the officer', objectIcon: '🚔', objectNoun: 'the vehicle', objectPlural: false, base: 'lock', past: 'locked', pp: 'locked', s3: 'locks',
  },
  {
    agentIcon: '🧹', agentNoun: 'the maid', objectIcon: '🧻', objectNoun: 'the hallway', objectPlural: false, base: 'vacuum', past: 'vacuumed', pp: 'vacuumed', s3: 'vacuums',
  },
  {
    agentIcon: '🧑‍🍳', agentNoun: 'the chef', objectIcon: '🥙', objectNoun: 'the wraps', objectPlural: true, base: 'prepare', past: 'prepared', pp: 'prepared', s3: 'prepares',
  },
  {
    agentIcon: '👩‍🍳', agentNoun: 'the baker', objectIcon: '🍩', objectNoun: 'the donuts', objectPlural: true, base: 'decorate', past: 'decorated', pp: 'decorated', s3: 'decorates',
  },
  {
    agentIcon: '🧑‍🎨', agentNoun: 'the jeweler', objectIcon: '📿', objectNoun: 'the necklace', objectPlural: false, base: 'polish', past: 'polished', pp: 'polished', s3: 'polishes',
  },
  {
    agentIcon: '🧑‍💼', agentNoun: 'the operator', objectIcon: '📞', objectNoun: 'the hotline', objectPlural: false, base: 'answer', past: 'answered', pp: 'answered', s3: 'answers',
  },
  {
    agentIcon: '✂️', agentNoun: 'the stylist', objectIcon: '💇‍♀️', objectNoun: 'the bangs', objectPlural: true, base: 'cut', past: 'cut', pp: 'cut', s3: 'cuts',
  },
  {
    agentIcon: '🧑‍🍳', agentNoun: 'the chef', objectIcon: '🍛', objectNoun: 'the curry', objectPlural: false, base: 'cook', past: 'cooked', pp: 'cooked', s3: 'cooks',
  },
  {
    agentIcon: '🧑‍🏫', agentNoun: 'the trainer', objectIcon: '🐕', objectNoun: 'the puppies', objectPlural: true, base: 'teach', past: 'taught', pp: 'taught', s3: 'teaches',
  },
  {
    agentIcon: '🧑‍🎨', agentNoun: 'the painter', objectIcon: '🚧', objectNoun: 'the sign', objectPlural: false, base: 'paint', past: 'painted', pp: 'painted', s3: 'paints',
  },
  {
    agentIcon: '🧑‍🔧', agentNoun: 'the crew', objectIcon: '🌉', objectNoun: 'the bridge', objectPlural: false, base: 'build', past: 'built', pp: 'built', s3: 'builds',
  },
  {
    agentIcon: '👨‍🌾', agentNoun: 'the farmer', objectIcon: '🥔', objectNoun: 'the potatoes', objectPlural: true, base: 'grow', past: 'grew', pp: 'grown', s3: 'grows',
  },
  {
    agentIcon: '👩‍🍳', agentNoun: 'the baker', objectIcon: '🥯', objectNoun: 'the bagels', objectPlural: true, base: 'bake', past: 'baked', pp: 'baked', s3: 'bakes',
  },
  {
    agentIcon: '✍️', agentNoun: 'the student', objectIcon: '📓', objectNoun: 'the diary entry', objectPlural: false, base: 'write', past: 'wrote', pp: 'written', s3: 'writes',
  },
  {
    agentIcon: '🧹', agentNoun: 'the staff', objectIcon: '🏟️', objectNoun: 'the stadium', objectPlural: false, base: 'clean', past: 'cleaned', pp: 'cleaned', s3: 'cleans',
  },
  {
    agentIcon: '🧑‍🌾', agentNoun: 'the beekeeper', objectIcon: '🍯', objectNoun: 'the honeycombs', objectPlural: true, base: 'harvest', past: 'harvested', pp: 'harvested', s3: 'harvests',
  },
  {
    agentIcon: '🧑‍🍳', agentNoun: 'the chef', objectIcon: '🥘', objectNoun: 'the paella', objectPlural: false, base: 'cook', past: 'cooked', pp: 'cooked', s3: 'cooks',
  },
  {
    agentIcon: '🧑‍🏫', agentNoun: 'the mentor', objectIcon: '🧑‍🎓', objectNoun: 'the interns', objectPlural: true, base: 'teach', past: 'taught', pp: 'taught', s3: 'teaches',
  },
  {
    agentIcon: '🧑‍🎨', agentNoun: 'the illustrator', objectIcon: '📕', objectNoun: 'the cover', objectPlural: false, base: 'paint', past: 'painted', pp: 'painted', s3: 'paints',
  },
  {
    agentIcon: '🧑‍🔧', agentNoun: 'the crew', objectIcon: '🏭', objectNoun: 'the warehouse', objectPlural: false, base: 'build', past: 'built', pp: 'built', s3: 'builds',
  },
  {
    agentIcon: '👨‍🌾', agentNoun: 'the farmer', objectIcon: '🌰', objectNoun: 'the chestnuts', objectPlural: true, base: 'grow', past: 'grew', pp: 'grown', s3: 'grows',
  },
  {
    agentIcon: '👩‍🍳', agentNoun: 'the baker', objectIcon: '🍰', objectNoun: 'the birthday cake', objectPlural: false, base: 'bake', past: 'baked', pp: 'baked', s3: 'bakes',
  },
  {
    agentIcon: '✍️', agentNoun: 'the poet', objectIcon: '📜', objectNoun: 'the poem', objectPlural: false, base: 'write', past: 'wrote', pp: 'written', s3: 'writes',
  },
  {
    agentIcon: '🧹', agentNoun: 'the crew', objectIcon: '🚉', objectNoun: 'the station', objectPlural: false, base: 'clean', past: 'cleaned', pp: 'cleaned', s3: 'cleans',
  },
  {
    agentIcon: '🧑', agentNoun: 'the volunteer', objectIcon: '🧦', objectNoun: 'the socks', objectPlural: true, base: 'wash', past: 'washed', pp: 'washed', s3: 'washes',
  },
  {
    agentIcon: '🚚', agentNoun: 'the shop', objectIcon: '🛋️', objectNoun: 'the furniture', objectPlural: true, base: 'deliver', past: 'delivered', pp: 'delivered', s3: 'delivers',
  },
  {
    agentIcon: '🧑‍🌾', agentNoun: 'the botanist', objectIcon: '🌿', objectNoun: 'the herbs', objectPlural: true, base: 'plant', past: 'planted', pp: 'planted', s3: 'plants',
  },
  {
    agentIcon: '🥅', agentNoun: 'the keeper', objectIcon: '🏒', objectNoun: 'the puck', objectPlural: false, base: 'catch', past: 'caught', pp: 'caught', s3: 'catches',
  },
  {
    agentIcon: '📸', agentNoun: 'the intern', objectIcon: '🖨️', objectNoun: 'the printouts', objectPlural: true, base: 'take', past: 'took', pp: 'taken', s3: 'takes',
  },
  {
    agentIcon: '🎤', agentNoun: 'the soloist', objectIcon: '🎼', objectNoun: 'the aria', objectPlural: false, base: 'sing', past: 'sang', pp: 'sung', s3: 'sings',
  },
  {
    agentIcon: '🐕', agentNoun: 'the puppy', objectIcon: '🧸', objectNoun: 'the toy', objectPlural: false, base: 'break', past: 'broke', pp: 'broken', s3: 'breaks',
  },
  {
    agentIcon: '🏭', agentNoun: 'the plant', objectIcon: '🚲', objectNoun: 'the bicycles', objectPlural: true, base: 'make', past: 'made', pp: 'made', s3: 'makes',
  },
  {
    agentIcon: '🗿', agentNoun: 'the mason', objectIcon: '🦁', objectNoun: 'the lion statue', objectPlural: false, base: 'carve', past: 'carved', pp: 'carved', s3: 'carves',
  },
  {
    agentIcon: '🧑‍🚒', agentNoun: 'the volunteer', objectIcon: '🔥', objectNoun: 'the brush fire', objectPlural: false, base: 'extinguish', past: 'extinguished', pp: 'extinguished', s3: 'extinguishes',
  },
  {
    agentIcon: '👩‍🏫', agentNoun: 'the examiner', objectIcon: '📝', objectNoun: 'the tests', objectPlural: true, base: 'grade', past: 'graded', pp: 'graded', s3: 'grades',
  },
  {
    agentIcon: '👨‍🌾', agentNoun: 'the rancher', objectIcon: '🐄', objectNoun: 'the cattle', objectPlural: true, base: 'milk', past: 'milked', pp: 'milked', s3: 'milks',
  },
  {
    agentIcon: '🧑‍💻', agentNoun: 'the intern', objectIcon: '🗃️', objectNoun: 'the database', objectPlural: false, base: 'update', past: 'updated', pp: 'updated', s3: 'updates',
  },
  {
    agentIcon: '🧑‍🍳', agentNoun: 'the chef', objectIcon: '🥔', objectNoun: 'the potatoes', objectPlural: true, base: 'boil', past: 'boiled', pp: 'boiled', s3: 'boils',
  },
  {
    agentIcon: '🧑‍🚀', agentNoun: 'the team', objectIcon: '🛸', objectNoun: 'the drone', objectPlural: false, base: 'launch', past: 'launched', pp: 'launched', s3: 'launches',
  },
  {
    agentIcon: '🧑‍💼', agentNoun: 'the intern', objectIcon: '📥', objectNoun: 'the inbox', objectPlural: false, base: 'organize', past: 'organized', pp: 'organized', s3: 'organizes',
  },
  {
    agentIcon: '🧑‍🔬', agentNoun: 'the chemist', objectIcon: '🧫', objectNoun: 'the culture', objectPlural: false, base: 'mix', past: 'mixed', pp: 'mixed', s3: 'mixes',
  },
  {
    agentIcon: '🏋️', agentNoun: 'the instructor', objectIcon: '🧑‍🤝‍🧑', objectNoun: 'the recruits', objectPlural: true, base: 'train', past: 'trained', pp: 'trained', s3: 'trains',
  },
  {
    agentIcon: '🧑‍🎨', agentNoun: 'the studio', objectIcon: '🎮', objectNoun: 'the game', objectPlural: false, base: 'design', past: 'designed', pp: 'designed', s3: 'designs',
  },
  {
    agentIcon: '🧑‍✈️', agentNoun: 'the captain', objectIcon: '✈️', objectNoun: 'the jet', objectPlural: false, base: 'fly', past: 'flew', pp: 'flown', s3: 'flies',
  },
  {
    agentIcon: '🧵', agentNoun: 'the tailor', objectIcon: '👝', objectNoun: 'the pouch', objectPlural: false, base: 'sew', past: 'sewed', pp: 'sewn', s3: 'sews',
  },
  {
    agentIcon: '🧑‍🔧', agentNoun: 'the repairman', objectIcon: '📺', objectNoun: 'the television', objectPlural: false, base: 'fix', past: 'fixed', pp: 'fixed', s3: 'fixes',
  },
  {
    agentIcon: '🧑‍🔧', agentNoun: 'the electrician', objectIcon: '💡', objectNoun: 'the streetlight', objectPlural: false, base: 'install', past: 'installed', pp: 'installed', s3: 'installs',
  },
  {
    agentIcon: '🧑‍🔧', agentNoun: 'the plumber', objectIcon: '🚰', objectNoun: 'the tap', objectPlural: false, base: 'repair', past: 'repaired', pp: 'repaired', s3: 'repairs',
  },
  {
    agentIcon: '🧵', agentNoun: 'the seamstress', objectIcon: '🎀', objectNoun: 'the ribbon trim', objectPlural: false, base: 'hem', past: 'hemmed', pp: 'hemmed', s3: 'hems',
  },
  {
    agentIcon: '👨‍🍳', agentNoun: 'the chef', objectIcon: '🫑', objectNoun: 'the peppers', objectPlural: true, base: 'chop', past: 'chopped', pp: 'chopped', s3: 'chops',
  },
  {
    agentIcon: '👨‍🌾', agentNoun: 'the farmer', objectIcon: '🍇', objectNoun: 'the vineyard', objectPlural: false, base: 'harvest', past: 'harvested', pp: 'harvested', s3: 'harvests',
  },
  {
    agentIcon: '🧑‍⚕️', agentNoun: 'the paramedic', objectIcon: '🩹', objectNoun: 'the wound', objectPlural: false, base: 'bandage', past: 'bandaged', pp: 'bandaged', s3: 'bandages',
  },
  {
    agentIcon: '🖨️', agentNoun: 'the office', objectIcon: '📋', objectNoun: 'the forms', objectPlural: true, base: 'print', past: 'printed', pp: 'printed', s3: 'prints',
  },
  {
    agentIcon: '🧑‍⚕️', agentNoun: 'the dentist', objectIcon: '🦷', objectNoun: 'the teeth', objectPlural: true, base: 'examine', past: 'examined', pp: 'examined', s3: 'examines',
  },
  {
    agentIcon: '🎥', agentNoun: 'the studio', objectIcon: '📺', objectNoun: 'the episode', objectPlural: false, base: 'film', past: 'filmed', pp: 'filmed', s3: 'films',
  },
  {
    agentIcon: '💂', agentNoun: 'the guard', objectIcon: '🏭', objectNoun: 'the warehouse door', objectPlural: false, base: 'lock', past: 'locked', pp: 'locked', s3: 'locks',
  },
  {
    agentIcon: '🧹', agentNoun: 'the cleaner', objectIcon: '🚗', objectNoun: 'the car mats', objectPlural: true, base: 'vacuum', past: 'vacuumed', pp: 'vacuumed', s3: 'vacuums',
  },
  {
    agentIcon: '🧑‍🍳', agentNoun: 'the chef', objectIcon: '🍱', objectNoun: 'the bento box', objectPlural: false, base: 'prepare', past: 'prepared', pp: 'prepared', s3: 'prepares',
  },
  {
    agentIcon: '👩‍🍳', agentNoun: 'the baker', objectIcon: '🍪', objectNoun: 'the cookies', objectPlural: true, base: 'decorate', past: 'decorated', pp: 'decorated', s3: 'decorates',
  },
  {
    agentIcon: '🧑‍🎨', agentNoun: 'the jeweler', objectIcon: '⌚', objectNoun: 'the watch', objectPlural: false, base: 'polish', past: 'polished', pp: 'polished', s3: 'polishes',
  },
  {
    agentIcon: '🧑‍💼', agentNoun: 'the agent', objectIcon: '📩', objectNoun: 'the inquiries', objectPlural: true, base: 'answer', past: 'answered', pp: 'answered', s3: 'answers',
  },
  {
    agentIcon: '✂️', agentNoun: 'the barber', objectIcon: '🧔', objectNoun: 'the beard', objectPlural: false, base: 'cut', past: 'cut', pp: 'cut', s3: 'cuts',
  },
  {
    agentIcon: '🧑‍💼', agentNoun: 'the clerk', objectIcon: '📬', objectNoun: 'the mail', objectPlural: true, base: 'sort', past: 'sorted', pp: 'sorted', s3: 'sorts',
  },
  {
    agentIcon: '🧑‍🏭', agentNoun: 'the worker', objectIcon: '🍫', objectNoun: 'the chocolates', objectPlural: true, base: 'pack', past: 'packed', pp: 'packed', s3: 'packs',
  },
  {
    agentIcon: '🧑‍🔬', agentNoun: 'the scientist', objectIcon: '🧂', objectNoun: 'the powder', objectPlural: false, base: 'weigh', past: 'weighed', pp: 'weighed', s3: 'weighs',
  },
  {
    agentIcon: '🧑‍🔧', agentNoun: 'the surveyor', objectIcon: '🏞️', objectNoun: 'the land', objectPlural: false, base: 'measure', past: 'measured', pp: 'measured', s3: 'measures',
  },
  {
    agentIcon: '🧑', agentNoun: 'the attendant', objectIcon: '🧣', objectNoun: 'the scarves', objectPlural: true, base: 'fold', past: 'folded', pp: 'folded', s3: 'folds',
  },
  {
    agentIcon: '🧑‍🏭', agentNoun: 'the worker', objectIcon: '🧱', objectNoun: 'the bricks', objectPlural: true, base: 'stack', past: 'stacked', pp: 'stacked', s3: 'stacks',
  },
  {
    agentIcon: '🧹', agentNoun: 'the waiter', objectIcon: '🪞', objectNoun: 'the mirror', objectPlural: false, base: 'wipe', past: 'wiped', pp: 'wiped', s3: 'wipes',
  },
  {
    agentIcon: '🧑‍🌾', agentNoun: 'the gardener', objectIcon: '🌳', objectNoun: 'the orchard', objectPlural: false, base: 'water', past: 'watered', pp: 'watered', s3: 'waters',
  },
  {
    agentIcon: '🧑‍🍽️', agentNoun: 'the waiter', objectIcon: '🍹', objectNoun: 'the drinks', objectPlural: true, base: 'serve', past: 'served', pp: 'served', s3: 'serves',
  },
  {
    agentIcon: '🚚', agentNoun: 'the porter', objectIcon: '🧳', objectNoun: 'the luggage', objectPlural: true, base: 'carry', past: 'carried', pp: 'carried', s3: 'carries',
  },
  {
    agentIcon: '🧑‍🍳', agentNoun: 'the chef', objectIcon: '🍮', objectNoun: 'the custard', objectPlural: false, base: 'cook', past: 'cooked', pp: 'cooked', s3: 'cooks',
  },
  {
    agentIcon: '🧑‍🏫', agentNoun: 'the instructor', objectIcon: '🚗', objectNoun: 'the new drivers', objectPlural: true, base: 'teach', past: 'taught', pp: 'taught', s3: 'teaches',
  },
  {
    agentIcon: '🧑‍🎨', agentNoun: 'the artist', objectIcon: '🚌', objectNoun: 'the bus', objectPlural: false, base: 'paint', past: 'painted', pp: 'painted', s3: 'paints',
  },
  {
    agentIcon: '🧑‍🔧', agentNoun: 'the crew', objectIcon: '🛤️', objectNoun: 'the railway', objectPlural: false, base: 'build', past: 'built', pp: 'built', s3: 'builds',
  },
  {
    agentIcon: '👨‍🌾', agentNoun: 'the farmer', objectIcon: '🫘', objectNoun: 'the beans', objectPlural: true, base: 'grow', past: 'grew', pp: 'grown', s3: 'grows',
  },
  {
    agentIcon: '👩‍🍳', agentNoun: 'the baker', objectIcon: '🥮', objectNoun: 'the mooncakes', objectPlural: true, base: 'bake', past: 'baked', pp: 'baked', s3: 'bakes',
  },
  {
    agentIcon: '✍️', agentNoun: 'the reporter', objectIcon: '📰', objectNoun: 'the headline', objectPlural: false, base: 'write', past: 'wrote', pp: 'written', s3: 'writes',
  },
  {
    agentIcon: '🧹', agentNoun: 'the housekeeper', objectIcon: '🚪', objectNoun: 'the entrance', objectPlural: false, base: 'clean', past: 'cleaned', pp: 'cleaned', s3: 'cleans',
  },
  // ----- Bổ sung vòng mục tiêu 850 -----
  {
    agentIcon: '🧵', agentNoun: 'the tailor', objectIcon: '🧥', objectNoun: 'the coat', objectPlural: false, base: 'mend', past: 'mended', pp: 'mended', s3: 'mends',
  },
  {
    agentIcon: '⚡', agentNoun: 'the electrician', objectIcon: '🔌', objectNoun: 'the wiring', objectPlural: false, base: 'repair', past: 'repaired', pp: 'repaired', s3: 'repairs',
  },
  {
    agentIcon: '☕', agentNoun: 'the barista', objectIcon: '🫖', objectNoun: 'the coffee', objectPlural: false, base: 'brew', past: 'brewed', pp: 'brewed', s3: 'brews',
  },
  {
    agentIcon: '💐', agentNoun: 'the florist', objectIcon: '💐', objectNoun: 'the bouquet', objectPlural: false, base: 'arrange', past: 'arranged', pp: 'arranged', s3: 'arranges',
  },
  {
    agentIcon: '🏺', agentNoun: 'the potter', objectIcon: '🏺', objectNoun: 'the vase', objectPlural: false, base: 'shape', past: 'shaped', pp: 'shaped', s3: 'shapes',
  },
  {
    agentIcon: '🧶', agentNoun: 'the weaver', objectIcon: '🧣', objectNoun: 'the blanket', objectPlural: false, base: 'weave', past: 'wove', pp: 'woven', s3: 'weaves',
  },
  {
    agentIcon: '🪵', agentNoun: 'the woodcarver', objectIcon: '🗿', objectNoun: 'the statue', objectPlural: false, base: 'carve', past: 'carved', pp: 'carved', s3: 'carves',
  },
  {
    agentIcon: '🖼️', agentNoun: 'the framer', objectIcon: '🖼️', objectNoun: 'the painting', objectPlural: false, base: 'frame', past: 'framed', pp: 'framed', s3: 'frames',
  },
  {
    agentIcon: '🖨️', agentNoun: 'the printer', objectIcon: '📰', objectNoun: 'the newspapers', objectPlural: true, base: 'print', past: 'printed', pp: 'printed', s3: 'prints',
  },
  {
    agentIcon: '🧺', agentNoun: 'the housekeeper', objectIcon: '👕', objectNoun: 'the towels', objectPlural: true, base: 'fold', past: 'folded', pp: 'folded', s3: 'folds',
  },
  {
    agentIcon: '🧺', agentNoun: 'the housekeeper', objectIcon: '👗', objectNoun: 'the dresses', objectPlural: true, base: 'iron', past: 'ironed', pp: 'ironed', s3: 'irons',
  },
  {
    agentIcon: '🧵', agentNoun: 'the seamstress', objectIcon: '👖', objectNoun: 'the trousers', objectPlural: true, base: 'stitch', past: 'stitched', pp: 'stitched', s3: 'stitches',
  },
  {
    agentIcon: '📦', agentNoun: 'the courier', objectIcon: '📦', objectNoun: 'the parcels', objectPlural: true, base: 'pack', past: 'packed', pp: 'packed', s3: 'packs',
  },
  {
    agentIcon: '🎁', agentNoun: 'the assistant', objectIcon: '🎁', objectNoun: 'the presents', objectPlural: true, base: 'wrap', past: 'wrapped', pp: 'wrapped', s3: 'wraps',
  },
  {
    agentIcon: '🏷️', agentNoun: 'the clerk', objectIcon: '🏷️', objectNoun: 'the boxes', objectPlural: true, base: 'label', past: 'labeled', pp: 'labeled', s3: 'labels',
  },
  {
    agentIcon: '📬', agentNoun: 'the clerk', objectIcon: '✉️', objectNoun: 'the letters', objectPlural: true, base: 'sort', past: 'sorted', pp: 'sorted', s3: 'sorts',
  },
  {
    agentIcon: '⚖️', agentNoun: 'the shopkeeper', objectIcon: '🍎', objectNoun: 'the apples', objectPlural: true, base: 'weigh', past: 'weighed', pp: 'weighed', s3: 'weighs',
  },
  {
    agentIcon: '🔪', agentNoun: 'the cook', objectIcon: '🥕', objectNoun: 'the carrots', objectPlural: true, base: 'slice', past: 'sliced', pp: 'sliced', s3: 'slices',
  },
  {
    agentIcon: '🔪', agentNoun: 'the cook', objectIcon: '🥔', objectNoun: 'the potatoes', objectPlural: true, base: 'peel', past: 'peeled', pp: 'peeled', s3: 'peels',
  },
  {
    agentIcon: '☕', agentNoun: 'the roaster', objectIcon: '☕', objectNoun: 'the coffee beans', objectPlural: true, base: 'grind', past: 'ground', pp: 'ground', s3: 'grinds',
  },
  {
    agentIcon: '🍗', agentNoun: 'the chef', objectIcon: '🍗', objectNoun: 'the chicken', objectPlural: false, base: 'roast', past: 'roasted', pp: 'roasted', s3: 'roasts',
  },
  {
    agentIcon: '🍔', agentNoun: 'the cook', objectIcon: '🍖', objectNoun: 'the steak', objectPlural: false, base: 'grill', past: 'grilled', pp: 'grilled', s3: 'grills',
  },
  {
    agentIcon: '🥟', agentNoun: 'the chef', objectIcon: '🥟', objectNoun: 'the dumplings', objectPlural: true, base: 'steam', past: 'steamed', pp: 'steamed', s3: 'steams',
  },
  {
    agentIcon: '🧊', agentNoun: 'the chef', objectIcon: '🍨', objectNoun: 'the dessert', objectPlural: false, base: 'freeze', past: 'froze', pp: 'frozen', s3: 'freezes',
  },
  {
    agentIcon: '🥤', agentNoun: 'the waiter', objectIcon: '🧃', objectNoun: 'the juice', objectPlural: false, base: 'pour', past: 'poured', pp: 'poured', s3: 'pours',
  },
  {
    agentIcon: '🍳', agentNoun: 'the cook', objectIcon: '🥣', objectNoun: 'the batter', objectPlural: false, base: 'stir', past: 'stirred', pp: 'stirred', s3: 'stirs',
  },
  {
    agentIcon: '🍞', agentNoun: 'the baker', objectIcon: '🍞', objectNoun: 'the dough', objectPlural: false, base: 'knead', past: 'kneaded', pp: 'kneaded', s3: 'kneads',
  },
  {
    agentIcon: '🍞', agentNoun: 'the baker', objectIcon: '🧈', objectNoun: 'the butter', objectPlural: false, base: 'spread', past: 'spread', pp: 'spread', s3: 'spreads',
  },
  {
    agentIcon: '🧽', agentNoun: 'the janitor', objectIcon: '🧱', objectNoun: 'the floor', objectPlural: false, base: 'scrub', past: 'scrubbed', pp: 'scrubbed', s3: 'scrubs',
  },
  {
    agentIcon: '✨', agentNoun: 'the cleaner', objectIcon: '🪟', objectNoun: 'the windows', objectPlural: true, base: 'shine', past: 'shined', pp: 'shined', s3: 'shines',
  },
  {
    agentIcon: '✂️', agentNoun: 'the gardener', objectIcon: '🌳', objectNoun: 'the hedge', objectPlural: false, base: 'trim', past: 'trimmed', pp: 'trimmed', s3: 'trims',
  },
  {
    agentIcon: '🌱', agentNoun: 'the gardener', objectIcon: '🌻', objectNoun: 'the seeds', objectPlural: true, base: 'plant', past: 'planted', pp: 'planted', s3: 'plants',
  },
  {
    agentIcon: '🌿', agentNoun: 'the gardener', objectIcon: '🌹', objectNoun: 'the roses', objectPlural: true, base: 'prune', past: 'pruned', pp: 'pruned', s3: 'prunes',
  },
  {
    agentIcon: '🍂', agentNoun: 'the gardener', objectIcon: '🍁', objectNoun: 'the leaves', objectPlural: true, base: 'rake', past: 'raked', pp: 'raked', s3: 'rakes',
  },
  {
    agentIcon: '🌾', agentNoun: 'the gardener', objectIcon: '🌱', objectNoun: 'the lawn', objectPlural: false, base: 'mow', past: 'mowed', pp: 'mowed', s3: 'mows',
  },
  {
    agentIcon: '🐑', agentNoun: 'the farmer', objectIcon: '🐑', objectNoun: 'the sheep', objectPlural: true, base: 'shear', past: 'sheared', pp: 'shorn', s3: 'shears',
  },
  {
    agentIcon: '🐔', agentNoun: 'the farmer', objectIcon: '🐔', objectNoun: 'the chickens', objectPlural: true, base: 'feed', past: 'fed', pp: 'fed', s3: 'feeds',
  },
  {
    agentIcon: '🐴', agentNoun: 'the groom', objectIcon: '🐴', objectNoun: 'the horses', objectPlural: true, base: 'brush', past: 'brushed', pp: 'brushed', s3: 'brushes',
  },
  {
    agentIcon: '🐶', agentNoun: 'the groomer', objectIcon: '🐶', objectNoun: 'the puppies', objectPlural: true, base: 'bathe', past: 'bathed', pp: 'bathed', s3: 'bathes',
  },
  {
    agentIcon: '🐕', agentNoun: 'the trainer', objectIcon: '🐕', objectNoun: 'the dogs', objectPlural: true, base: 'train', past: 'trained', pp: 'trained', s3: 'trains',
  },
  {
    agentIcon: '💂', agentNoun: 'the security guard', objectIcon: '🏛️', objectNoun: 'the museum', objectPlural: false, base: 'guard', past: 'guarded', pp: 'guarded', s3: 'guards',
  },
  {
    agentIcon: '🚓', agentNoun: 'the officer', objectIcon: '🏘️', objectNoun: 'the neighborhood', objectPlural: false, base: 'patrol', past: 'patrolled', pp: 'patrolled', s3: 'patrols',
  },
  {
    agentIcon: '🔍', agentNoun: 'the inspector', objectIcon: '🏭', objectNoun: 'the factory', objectPlural: false, base: 'inspect', past: 'inspected', pp: 'inspected', s3: 'inspects',
  },
  {
    agentIcon: '📠', agentNoun: 'the officer', objectIcon: '🎫', objectNoun: 'the tickets', objectPlural: true, base: 'scan', past: 'scanned', pp: 'scanned', s3: 'scans',
  },
  {
    agentIcon: '🗂️', agentNoun: 'the clerk', objectIcon: '📁', objectNoun: 'the documents', objectPlural: true, base: 'file', past: 'filed', pp: 'filed', s3: 'files',
  },
  {
    agentIcon: '📮', agentNoun: 'the clerk', objectIcon: '📦', objectNoun: 'the packages', objectPlural: true, base: 'stamp', past: 'stamped', pp: 'stamped', s3: 'stamps',
  },
  {
    agentIcon: '📦', agentNoun: 'the worker', objectIcon: '📦', objectNoun: 'the crate', objectPlural: false, base: 'seal', past: 'sealed', pp: 'sealed', s3: 'seals',
  },
  {
    agentIcon: '📮', agentNoun: 'the postman', objectIcon: '📨', objectNoun: 'the postcards', objectPlural: true, base: 'post', past: 'posted', pp: 'posted', s3: 'posts',
  },
  {
    agentIcon: '🚢', agentNoun: 'the crew', objectIcon: '📦', objectNoun: 'the cargo', objectPlural: false, base: 'ship', past: 'shipped', pp: 'shipped', s3: 'ships',
  },
  {
    agentIcon: '🚚', agentNoun: 'the driver', objectIcon: '🛋️', objectNoun: 'the furniture', objectPlural: true, base: 'load', past: 'loaded', pp: 'loaded', s3: 'loads',
  },
  {
    agentIcon: '🚛', agentNoun: 'the driver', objectIcon: '📦', objectNoun: 'the boxes', objectPlural: true, base: 'unload', past: 'unloaded', pp: 'unloaded', s3: 'unloads',
  },

  // ----- Bổ sung vòng mục tiêu 1000 -----
  {
    agentIcon: '🏗️', agentNoun: 'the architect', objectIcon: '🏠', objectNoun: 'the house', objectPlural: false, base: 'design', past: 'designed', pp: 'designed', s3: 'designs',
  },
  {
    agentIcon: '🔧', agentNoun: 'the technician', objectIcon: '📷', objectNoun: 'the camera', objectPlural: false, base: 'install', past: 'installed', pp: 'installed', s3: 'installs',
  },
  {
    agentIcon: '🧪', agentNoun: 'the scientist', objectIcon: '💊', objectNoun: 'the medicine', objectPlural: false, base: 'test', past: 'tested', pp: 'tested', s3: 'tests',
  },
  {
    agentIcon: '💻', agentNoun: 'the programmer', objectIcon: '📱', objectNoun: 'the app', objectPlural: false, base: 'update', past: 'updated', pp: 'updated', s3: 'updates',
  },
  {
    agentIcon: '📖', agentNoun: 'the translator', objectIcon: '📜', objectNoun: 'the ancient scroll', objectPlural: false, base: 'translate', past: 'translated', pp: 'translated', s3: 'translates',
  },
  {
    agentIcon: '📝', agentNoun: 'the editor', objectIcon: '📰', objectNoun: 'the article', objectPlural: false, base: 'proofread', past: 'proofread', pp: 'proofread', s3: 'proofreads',
  },
  {
    agentIcon: '📚', agentNoun: 'the publisher', objectIcon: '📗', objectNoun: 'the novel', objectPlural: false, base: 'publish', past: 'published', pp: 'published', s3: 'publishes',
  },
  {
    agentIcon: '✂️', agentNoun: 'the editor', objectIcon: '🎬', objectNoun: 'the film', objectPlural: false, base: 'edit', past: 'edited', pp: 'edited', s3: 'edits',
  },
  {
    agentIcon: '🎼', agentNoun: 'the composer', objectIcon: '🎵', objectNoun: 'the symphony', objectPlural: false, base: 'compose', past: 'composed', pp: 'composed', s3: 'composes',
  },
  {
    agentIcon: '🎻', agentNoun: 'the orchestra', objectIcon: '🎶', objectNoun: 'the concert', objectPlural: false, base: 'perform', past: 'performed', pp: 'performed', s3: 'performs',
  },
  {
    agentIcon: '🎭', agentNoun: 'the actors', objectIcon: '🎬', objectNoun: 'the scene', objectPlural: false, base: 'rehearse', past: 'rehearsed', pp: 'rehearsed', s3: 'rehearses',
  },
  {
    agentIcon: '🎤', agentNoun: 'the conductor', objectIcon: '🎻', objectNoun: 'the choir', objectPlural: false, base: 'conduct', past: 'conducted', pp: 'conducted', s3: 'conducts',
  },
  {
    agentIcon: '📺', agentNoun: 'the station', objectIcon: '📡', objectNoun: 'the news', objectPlural: false, base: 'broadcast', past: 'broadcast', pp: 'broadcast', s3: 'broadcasts',
  },
  {
    agentIcon: '🎥', agentNoun: 'the crew', objectIcon: '🎞️', objectNoun: 'the documentary', objectPlural: false, base: 'film', past: 'filmed', pp: 'filmed', s3: 'films',
  },
  {
    agentIcon: '📸', agentNoun: 'the photographer', objectIcon: '🖼️', objectNoun: 'the portrait', objectPlural: false, base: 'photograph', past: 'photographed', pp: 'photographed', s3: 'photographs',
  },
  {
    agentIcon: '✏️', agentNoun: 'the artist', objectIcon: '🎨', objectNoun: 'the mural', objectPlural: false, base: 'sketch', past: 'sketched', pp: 'sketched', s3: 'sketches',
  },
  {
    agentIcon: '🖼️', agentNoun: 'the framer', objectIcon: '🖌️', objectNoun: 'the artwork', objectPlural: false, base: 'frame', past: 'framed', pp: 'framed', s3: 'frames',
  },
  {
    agentIcon: '🏛️', agentNoun: 'the museum', objectIcon: '🗿', objectNoun: 'the exhibit', objectPlural: false, base: 'display', past: 'displayed', pp: 'displayed', s3: 'displays',
  },
  {
    agentIcon: '🔨', agentNoun: 'the auctioneer', objectIcon: '🏺', objectNoun: 'the antique vase', objectPlural: false, base: 'auction', past: 'auctioned', pp: 'auctioned', s3: 'auctions',
  },
  {
    agentIcon: '💎', agentNoun: 'the appraiser', objectIcon: '💍', objectNoun: 'the diamond ring', objectPlural: false, base: 'appraise', past: 'appraised', pp: 'appraised', s3: 'appraises',
  },
  {
    agentIcon: '🖼️', agentNoun: 'the restorer', objectIcon: '🖼️', objectNoun: 'the old painting', objectPlural: false, base: 'restore', past: 'restored', pp: 'restored', s3: 'restores',
  },
  {
    agentIcon: '🪑', agentNoun: 'the carpenter', objectIcon: '🪑', objectNoun: 'the antique chair', objectPlural: false, base: 'varnish', past: 'varnished', pp: 'varnished', s3: 'varnishes',
  },
  {
    agentIcon: '💍', agentNoun: 'the jeweler', objectIcon: '📿', objectNoun: 'the pendant', objectPlural: false, base: 'engrave', past: 'engraved', pp: 'engraved', s3: 'engraves',
  },
  {
    agentIcon: '🏺', agentNoun: 'the sculptor', objectIcon: '🗿', objectNoun: 'the clay figure', objectPlural: false, base: 'mold', past: 'molded', pp: 'molded', s3: 'molds',
  },
  {
    agentIcon: '🔩', agentNoun: 'the founder', objectIcon: '🔔', objectNoun: 'the bronze bell', objectPlural: false, base: 'cast', past: 'cast', pp: 'cast', s3: 'casts',
  },
  {
    agentIcon: '🔌', agentNoun: 'the electrician', objectIcon: '🖥️', objectNoun: 'the circuit board', objectPlural: false, base: 'solder', past: 'soldered', pp: 'soldered', s3: 'solders',
  },
  {
    agentIcon: '🔧', agentNoun: 'the welder', objectIcon: '🚂', objectNoun: 'the steel frame', objectPlural: false, base: 'weld', past: 'welded', pp: 'welded', s3: 'welds',
  },
  {
    agentIcon: '🪛', agentNoun: 'the mechanic', objectIcon: '🚲', objectNoun: 'the bike frame', objectPlural: false, base: 'bolt', past: 'bolted', pp: 'bolted', s3: 'bolts',
  },
  {
    agentIcon: '🛠️', agentNoun: 'the technician', objectIcon: '🖨️', objectNoun: 'the printer', objectPlural: false, base: 'assemble', past: 'assembled', pp: 'assembled', s3: 'assembles',
  },
  {
    agentIcon: '🛠️', agentNoun: 'the technician', objectIcon: '💻', objectNoun: 'the laptop', objectPlural: false, base: 'disassemble', past: 'disassembled', pp: 'disassembled', s3: 'disassembles',
  },
  {
    agentIcon: '⚖️', agentNoun: 'the engineer', objectIcon: '🎚️', objectNoun: 'the sensor', objectPlural: false, base: 'calibrate', past: 'calibrated', pp: 'calibrated', s3: 'calibrates',
  },
  {
    agentIcon: '💻', agentNoun: 'the developer', objectIcon: '🤖', objectNoun: 'the robot', objectPlural: false, base: 'program', past: 'programmed', pp: 'programmed', s3: 'programs',
  },
  {
    agentIcon: '👩‍💻', agentNoun: 'the coder', objectIcon: '🎮', objectNoun: 'the video game', objectPlural: false, base: 'code', past: 'coded', pp: 'coded', s3: 'codes',
  },
  {
    agentIcon: '🐛', agentNoun: 'the programmer', objectIcon: '🖥️', objectNoun: 'the software', objectPlural: false, base: 'debug', past: 'debugged', pp: 'debugged', s3: 'debugs',
  },
  {
    agentIcon: '🚀', agentNoun: 'the agency', objectIcon: '🛰️', objectNoun: 'the satellite', objectPlural: false, base: 'launch', past: 'launched', pp: 'launched', s3: 'launches',
  },
  {
    agentIcon: '✈️', agentNoun: 'the pilot', objectIcon: '🛩️', objectNoun: 'the aircraft', objectPlural: false, base: 'pilot', past: 'piloted', pp: 'piloted', s3: 'pilots',
  },
  {
    agentIcon: '🧭', agentNoun: 'the captain', objectIcon: '⛵', objectNoun: 'the ship', objectPlural: false, base: 'navigate', past: 'navigated', pp: 'navigated', s3: 'navigates',
  },
  {
    agentIcon: '🚢', agentNoun: 'the sailor', objectIcon: '⛴️', objectNoun: 'the ferry', objectPlural: false, base: 'steer', past: 'steered', pp: 'steered', s3: 'steers',
  },
  {
    agentIcon: '🚗', agentNoun: 'the driver', objectIcon: '🚌', objectNoun: 'the broken bus', objectPlural: false, base: 'tow', past: 'towed', pp: 'towed', s3: 'tows',
  },
  {
    agentIcon: '🚚', agentNoun: 'the company', objectIcon: '📦', objectNoun: 'the goods', objectPlural: true, base: 'transport', past: 'transported', pp: 'transported', s3: 'transports',
  },
  {
    agentIcon: '📦', agentNoun: 'the courier', objectIcon: '🎁', objectNoun: 'the gift', objectPlural: false, base: 'deliver', past: 'delivered', pp: 'delivered', s3: 'delivers',
  },
  {
    agentIcon: '🥫', agentNoun: 'the charity', objectIcon: '🍞', objectNoun: 'the food', objectPlural: true, base: 'distribute', past: 'distributed', pp: 'distributed', s3: 'distributes',
  },
  {
    agentIcon: '👕', agentNoun: 'the students', objectIcon: '👚', objectNoun: 'the clothes', objectPlural: true, base: 'donate', past: 'donated', pp: 'donated', s3: 'donates',
  },
  {
    agentIcon: '🎟️', agentNoun: 'the volunteers', objectIcon: '🎫', objectNoun: 'the tickets', objectPlural: true, base: 'collect', past: 'collected', pp: 'collected', s3: 'collects',
  },
  {
    agentIcon: '🧮', agentNoun: 'the clerk', objectIcon: '💰', objectNoun: 'the coins', objectPlural: true, base: 'count', past: 'counted', pp: 'counted', s3: 'counts',
  },
  {
    agentIcon: '📊', agentNoun: 'the accountant', objectIcon: '📒', objectNoun: 'the accounts', objectPlural: true, base: 'audit', past: 'audited', pp: 'audited', s3: 'audits',
  },
  {
    agentIcon: '✅', agentNoun: 'the manager', objectIcon: '📄', objectNoun: 'the request', objectPlural: false, base: 'approve', past: 'approved', pp: 'approved', s3: 'approves',
  },
  {
    agentIcon: '❌', agentNoun: 'the committee', objectIcon: '📋', objectNoun: 'the proposal', objectPlural: false, base: 'reject', past: 'rejected', pp: 'rejected', s3: 'rejects',
  },
  {
    agentIcon: '🖋️', agentNoun: 'the notary', objectIcon: '📜', objectNoun: 'the document', objectPlural: false, base: 'notarize', past: 'notarized', pp: 'notarized', s3: 'notarizes',
  },

];

// Thêm thì "future" (will be + P2) bên cạnh present/past — tăng số thì
// ngẫu nhiên từ 2 lên 3, giúp tăng số câu hỏi thật (scenario × thì) mà
// không cần thêm trường dữ liệu mới cho mỗi tình huống.
export const PASSIVE_TENSES = ['present', 'past', 'future'];

function passiveBeForm(scenario, tense) {
  if (tense === 'future') return 'will be';
  if (tense === 'present') return scenario.objectPlural ? 'are' : 'is';
  return scenario.objectPlural ? 'were' : 'was';
}
function wrongPassiveBeForm(scenario, tense) {
  if (tense === 'future') return scenario.objectPlural ? 'are' : 'is';
  if (tense === 'present') return scenario.objectPlural ? 'is' : 'are';
  return scenario.objectPlural ? 'was' : 'were';
}

function buildPassiveSentence(scenario, tense, key) {
  const obj = cap(scenario.objectNoun);
  switch (key) {
    case 'correct':
      return `${obj} ${passiveBeForm(scenario, tense)} ${scenario.pp} by ${scenario.agentNoun}.`;
    case 'active-instead':
      if (tense === 'future') return `${cap(scenario.agentNoun)} will ${scenario.base} ${scenario.objectNoun}.`;
      return tense === 'present'
        ? `${cap(scenario.agentNoun)} ${scenario.s3} ${scenario.objectNoun}.`
        : `${cap(scenario.agentNoun)} ${scenario.past} ${scenario.objectNoun}.`;
    case 'wrong-be':
      return `${obj} ${wrongPassiveBeForm(scenario, tense)} ${scenario.pp} by ${scenario.agentNoun}.`;
    case 'wrong-participle':
    default: {
      // Vài động từ bất quy tắc có base === pp (cut/cut/cut...) — nếu dùng
      // thẳng base thì câu "sai" trùng y hệt câu "đúng". Lúc đó giả lập đúng
      // lỗi học sinh hay mắc: thêm "-ed" như quy tắc thường (vd "cutted") —
      // vẫn là 1 lỗi thật, chỉ khác kiểu (chia quy tắc nhầm thay vì thiếu chia).
      const wrongForm = scenario.base === scenario.pp ? `${scenario.base}ed` : scenario.base;
      return `${obj} ${passiveBeForm(scenario, tense)} ${wrongForm} by ${scenario.agentNoun}.`;
    }
  }
}

/** 1 vòng: chọn 1 tình huống + 1 thì (hiện tại/quá khứ/tương lai đơn) ngẫu nhiên, sinh 4 câu (đúng bị động + chủ động + 2 lỗi thường gặp). */
export function makePassiveRound(rng = Math.random) {
  const scenario = pick(PASSIVE_SCENARIOS, rng);
  const tense = pick(PASSIVE_TENSES, rng);
  const keys = ['correct', 'active-instead', 'wrong-be', 'wrong-participle'];
  const options = shuffle(keys, rng).map((key) => ({
    key,
    sentence: buildPassiveSentence(scenario, tense, key),
  }));
  return {
    scenario, tense, options, correctKey: 'correct',
  };
}

export function makePassiveGame(count = 8, rng = Math.random) {
  const rounds = [];
  for (let i = 0; i < count; i++) rounds.push(makePassiveRound(rng));
  return baseGameState(rounds);
}

export function currentPassiveRound(game) {
  return currentRoundOf(game);
}

export function answerPassive(game, key) {
  return answerGeneric(game, key, (round) => round.correctKey);
}

/* ===== 9. Lời Nói Trực Tiếp → Gián Tiếp (Reported Speech) ===== */

// Mỗi tình huống lưu SẴN cả 4 câu (đúng + 3 lỗi thường gặp) thay vì sinh
// bằng công thức lùi thì tự động — lùi thì tiếng Anh có nhiều ngoại lệ
// (am/is→was, are→were, will→would, can→could, have→had...) nên viết tay
// từng cặp câu chuẩn để đảm bảo đúng ngữ pháp tuyệt đối.
export const REPORTED_SPEECH_SCENARIOS = [
  {
    icon: '👦', quote: '"I am hungry."', correct: 'He said he was hungry.', noBackshift: 'He said he is hungry.', wrongPronoun: 'He said I was hungry.', wrongReportingVerb: 'He says he was hungry.',
  },
  {
    icon: '👧', quote: '"I am tired."', correct: 'She said she was tired.', noBackshift: 'She said she is tired.', wrongPronoun: 'She said I was tired.', wrongReportingVerb: 'She says she was tired.',
  },
  {
    icon: '🧑‍🎓', quote: '"I like pizza."', correct: 'He said he liked pizza.', noBackshift: 'He said he likes pizza.', wrongPronoun: 'He said I liked pizza.', wrongReportingVerb: 'He says he liked pizza.',
  },
  {
    icon: '👨', quote: '"I will help you."', correct: 'He said he would help me.', noBackshift: 'He said he will help me.', wrongPronoun: 'He said he would help you.', wrongReportingVerb: 'He says he would help me.',
  },
  {
    icon: '👩', quote: '"I can swim."', correct: 'She said she could swim.', noBackshift: 'She said she can swim.', wrongPronoun: 'She said I could swim.', wrongReportingVerb: 'She says she could swim.',
  },
  {
    icon: '🧒', quote: '"I have finished my homework."', correct: 'He said he had finished his homework.', noBackshift: 'He said he has finished his homework.', wrongPronoun: 'He said he had finished my homework.', wrongReportingVerb: 'He says he had finished his homework.',
  },
  {
    icon: '👴', quote: '"I am reading a book."', correct: 'He said he was reading a book.', noBackshift: 'He said he is reading a book.', wrongPronoun: 'He said I was reading a book.', wrongReportingVerb: 'He says he was reading a book.',
  },
  {
    icon: '👵', quote: '"I cook dinner every day."', correct: 'She said she cooked dinner every day.', noBackshift: 'She said she cooks dinner every day.', wrongPronoun: 'She said I cooked dinner every day.', wrongReportingVerb: 'She says she cooked dinner every day.',
  },
  {
    icon: '👦', quote: '"I am playing football."', correct: 'He said he was playing football.', noBackshift: 'He said he is playing football.', wrongPronoun: 'He said I was playing football.', wrongReportingVerb: 'He says he was playing football.',
  },
  {
    icon: '👧', quote: '"I want to go home."', correct: 'She said she wanted to go home.', noBackshift: 'She said she wants to go home.', wrongPronoun: 'She said I wanted to go home.', wrongReportingVerb: 'She says she wanted to go home.',
  },
  {
    icon: '🧑', quote: '"I will call you tomorrow."', correct: 'He said he would call me tomorrow.', noBackshift: 'He said he will call me tomorrow.', wrongPronoun: 'He said he would call you tomorrow.', wrongReportingVerb: 'He says he would call me tomorrow.',
  },
  {
    icon: '👨‍🦱', quote: '"I have lost my keys."', correct: 'He said he had lost his keys.', noBackshift: 'He said he has lost his keys.', wrongPronoun: 'He said he had lost my keys.', wrongReportingVerb: 'He says he had lost his keys.',
  },
  {
    icon: '👩‍🦰', quote: '"I can speak French."', correct: 'She said she could speak French.', noBackshift: 'She said she can speak French.', wrongPronoun: 'She said I could speak French.', wrongReportingVerb: 'She says she could speak French.',
  },
  {
    icon: '🧓', quote: '"I am watching TV."', correct: 'He said he was watching TV.', noBackshift: 'He said he is watching TV.', wrongPronoun: 'He said I was watching TV.', wrongReportingVerb: 'He says he was watching TV.',
  },
  {
    icon: '👶', quote: '"I love my mom."', correct: 'She said she loved her mom.', noBackshift: 'She said she loves her mom.', wrongPronoun: 'She said I loved her mom.', wrongReportingVerb: 'She says she loved her mom.',
  },
  {
    icon: '🧔', quote: '"I need some help."', correct: 'He said he needed some help.', noBackshift: 'He said he needs some help.', wrongPronoun: 'He said I needed some help.', wrongReportingVerb: 'He says he needed some help.',
  },
  {
    icon: '👩‍🏫', quote: '"I teach English."', correct: 'She said she taught English.', noBackshift: 'She said she teaches English.', wrongPronoun: 'She said I taught English.', wrongReportingVerb: 'She says she taught English.',
  },
  {
    icon: '👨‍🎓', quote: '"I am studying for my exam."', correct: 'He said he was studying for his exam.', noBackshift: 'He said he is studying for his exam.', wrongPronoun: 'He said I was studying for his exam.', wrongReportingVerb: 'He says he was studying for his exam.',
  },
  {
    icon: '👧', quote: '"I will visit my grandma."', correct: 'She said she would visit her grandma.', noBackshift: 'She said she will visit her grandma.', wrongPronoun: 'She said she would visit my grandma.', wrongReportingVerb: 'She says she would visit her grandma.',
  },
  {
    icon: '👦', quote: '"I can ride a bike."', correct: 'He said he could ride a bike.', noBackshift: 'He said he can ride a bike.', wrongPronoun: 'He said I could ride a bike.', wrongReportingVerb: 'He says he could ride a bike.',
  },
  {
    icon: '👨‍🚒', quote: '"I am fighting the fire."', correct: 'He said he was fighting the fire.', noBackshift: 'He said he is fighting the fire.', wrongPronoun: 'He said I was fighting the fire.', wrongReportingVerb: 'He says he was fighting the fire.',
  },
  {
    icon: '👩‍💻', quote: '"I have updated the software."', correct: 'She said she had updated the software.', noBackshift: 'She said she has updated the software.', wrongPronoun: 'She said I had updated the software.', wrongReportingVerb: 'She says she had updated the software.',
  },
  {
    icon: '👦', quote: '"I want a new bike."', correct: 'He said he wanted a new bike.', noBackshift: 'He said he wants a new bike.', wrongPronoun: 'He said I wanted a new bike.', wrongReportingVerb: 'He says he wanted a new bike.',
  },
  {
    icon: '👧', quote: '"I am afraid of the dark."', correct: 'She said she was afraid of the dark.', noBackshift: 'She said she is afraid of the dark.', wrongPronoun: 'She said I was afraid of the dark.', wrongReportingVerb: 'She says she was afraid of the dark.',
  },
];

// Lùi thì tuy có nhiều dạng khác nhau (am/is→was, will→would, can→could,
// have→had...) nhưng MỖI DẠNG lại là quy tắc CỐ ĐỊNH — nên với câu trực
// tiếp không có đại từ/sở hữu cách chỉ người nghe ("you"/"your", dễ đổi
// nghĩa khi tường thuật), có thể dựng cả 4 câu (đúng + 3 lỗi) bằng công
// thức theo "kind", rồi nhân với 2 người tường thuật (he/she) để tăng số
// câu hỏi thật mà không cần viết tay từng câu.
const REPORTED_REPORTERS = ['he', 'she'];

function reportedClauseFor(t, subject, useBackshift) {
  switch (t.kind) {
    case 'am-adj':
    case 'am-ving':
      return `${subject} ${useBackshift ? 'was' : 'is'} ${t.rest}`.trim();
    case 'present-verb':
      return `${subject} ${useBackshift ? t.past : t.s3} ${t.rest}`.trim();
    case 'will':
      return `${subject} ${useBackshift ? 'would' : 'will'} ${t.rest}`.trim();
    case 'can':
      return `${subject} ${useBackshift ? 'could' : 'can'} ${t.rest}`.trim();
    case 'have-pp':
      return `${subject} ${useBackshift ? 'had' : 'has'} ${t.rest}`.trim();
    default:
      throw new Error(`reportedClauseFor: kind lạ "${t.kind}"`);
  }
}

function expandReportedTemplate(t, reporter) {
  const Reporter = reporter.charAt(0).toUpperCase() + reporter.slice(1);
  return {
    icon: t.icon,
    quote: t.quote,
    correct: `${Reporter} said ${reportedClauseFor(t, reporter, true)}.`,
    noBackshift: `${Reporter} said ${reportedClauseFor(t, reporter, false)}.`,
    wrongPronoun: `${Reporter} said ${reportedClauseFor(t, 'I', true)}.`,
    wrongReportingVerb: `${Reporter} says ${reportedClauseFor(t, reporter, true)}.`,
  };
}

const REPORTED_TEMPLATES = [
  // am + tính từ
  { kind: 'am-adj', icon: '🥤', rest: 'thirsty', quote: '"I am thirsty."' },
  { kind: 'am-adj', icon: '😴', rest: 'sleepy', quote: '"I am sleepy."' },
  { kind: 'am-adj', icon: '🎉', rest: 'excited', quote: '"I am excited."' },
  { kind: 'am-adj', icon: '😰', rest: 'nervous', quote: '"I am nervous."' },
  { kind: 'am-adj', icon: '😟', rest: 'worried', quote: '"I am worried."' },
  { kind: 'am-adj', icon: '🥱', rest: 'bored', quote: '"I am bored."' },
  { kind: 'am-adj', icon: '🥶', rest: 'cold', quote: '"I am cold."' },
  { kind: 'am-adj', icon: '🥵', rest: 'hot', quote: '"I am hot."' },
  { kind: 'am-adj', icon: '🤒', rest: 'sick', quote: '"I am sick."' },
  { kind: 'am-adj', icon: '😃', rest: 'happy', quote: '"I am happy."' },
  { kind: 'am-adj', icon: '😢', rest: 'sad', quote: '"I am sad."' },
  { kind: 'am-adj', icon: '😱', rest: 'scared', quote: '"I am scared."' },
  { kind: 'am-adj', icon: '😵', rest: 'confused', quote: '"I am confused."' },
  { kind: 'am-adj', icon: '😌', rest: 'proud', quote: '"I am proud."' },
  { kind: 'am-adj', icon: '🤔', rest: 'curious', quote: '"I am curious."' },
  // am + V-ing
  { kind: 'am-ving', icon: '📚', rest: 'organizing the shelf', quote: '"I am organizing the shelf."' },
  { kind: 'am-ving', icon: '🎬', rest: 'watching a movie', quote: '"I am watching a movie."' },
  { kind: 'am-ving', icon: '🍳', rest: 'cooking dinner', quote: '"I am cooking dinner."' },
  { kind: 'am-ving', icon: '🏀', rest: 'playing basketball', quote: '"I am playing basketball."' },
  { kind: 'am-ving', icon: '📝', rest: 'doing homework', quote: '"I am doing homework."' },
  { kind: 'am-ving', icon: '🧹', rest: 'cleaning the house', quote: '"I am cleaning the house."' },
  { kind: 'am-ving', icon: '🚌', rest: 'waiting for the bus', quote: '"I am waiting for the bus."' },
  { kind: 'am-ving', icon: '🎨', rest: 'drawing a picture', quote: '"I am drawing a picture."' },
  { kind: 'am-ving', icon: '🎧', rest: 'listening to music', quote: '"I am listening to music."' },
  { kind: 'am-ving', icon: '✉️', rest: 'writing a letter', quote: '"I am writing a letter."' },
  { kind: 'am-ving', icon: '🐱', rest: 'feeding the cat', quote: '"I am feeding the cat."' },
  { kind: 'am-ving', icon: '🚗', rest: 'washing the car', quote: '"I am washing the car."' },
  { kind: 'am-ving', icon: '🎂', rest: 'baking a cake', quote: '"I am baking a cake."' },
  { kind: 'am-ving', icon: '🚲', rest: 'fixing the bike', quote: '"I am fixing the bike."' },
  { kind: 'am-ving', icon: '🌿', rest: 'watering the plants', quote: '"I am watering the plants."' },
  // hiện tại đơn -> quá khứ đơn
  { kind: 'present-verb', icon: '🍫', past: 'liked', s3: 'likes', rest: 'chocolate', quote: '"I like chocolate."' },
  { kind: 'present-verb', icon: '🏖️', past: 'loved', s3: 'loves', rest: 'the beach', quote: '"I love the beach."' },
  { kind: 'present-verb', icon: '💻', past: 'wanted', s3: 'wants', rest: 'a new laptop', quote: '"I want a new laptop."' },
  { kind: 'present-verb', icon: '⏳', past: 'needed', s3: 'needs', rest: 'more time', quote: '"I need more time."' },
  { kind: 'present-verb', icon: '🎹', past: 'played', s3: 'plays', rest: 'the piano', quote: '"I play the piano."' },
  { kind: 'present-verb', icon: '📚', past: 'studied', s3: 'studies', rest: 'English every day', quote: '"I study English every day."' },
  { kind: 'present-verb', icon: '🏥', past: 'worked', s3: 'works', rest: 'at a hospital', quote: '"I work at a hospital."' },
  { kind: 'present-verb', icon: '🏙️', past: 'lived', s3: 'lives', rest: 'in Hanoi', quote: '"I live in Hanoi."' },
  { kind: 'present-verb', icon: '🏊', past: 'enjoyed', s3: 'enjoys', rest: 'swimming', quote: '"I enjoy swimming."' },
  { kind: 'present-verb', icon: '🕷️', past: 'hated', s3: 'hates', rest: 'spiders', quote: '"I hate spiders."' },
  { kind: 'present-verb', icon: '👻', past: 'believed', s3: 'believes', rest: 'in ghosts', quote: '"I believe in ghosts."' },
  { kind: 'present-verb', icon: '🇯🇵', past: 'spoke', s3: 'speaks', rest: 'Japanese', quote: '"I speak Japanese."' },
  { kind: 'present-verb', icon: '❓', past: 'knew', s3: 'knows', rest: 'the answer', quote: '"I know the answer."' },
  { kind: 'present-verb', icon: '📘', past: 'understood', s3: 'understands', rest: 'the lesson', quote: '"I understand the lesson."' },
  { kind: 'present-verb', icon: '📍', past: 'remembered', s3: 'remembers', rest: 'the address', quote: '"I remember the address."' },
  // will
  { kind: 'will', icon: '🩺', rest: 'call the doctor', quote: '"I will call the doctor."' },
  { kind: 'will', icon: '📁', rest: 'finish the project', quote: '"I will finish the project."' },
  { kind: 'will', icon: '🏛️', rest: 'visit the museum', quote: '"I will visit the museum."' },
  { kind: 'will', icon: '🍽️', rest: 'clean the kitchen', quote: '"I will clean the kitchen."' },
  { kind: 'will', icon: '🌻', rest: 'water the garden', quote: '"I will water the garden."' },
  { kind: 'will', icon: '🚌', rest: 'take the bus', quote: '"I will take the bus."' },
  { kind: 'will', icon: '🍲', rest: 'cook dinner tonight', quote: '"I will cook dinner tonight."' },
  { kind: 'will', icon: '💻', rest: 'fix the computer', quote: '"I will fix the computer."' },
  { kind: 'will', icon: '🤝', rest: 'join the team', quote: '"I will join the team."' },
  { kind: 'will', icon: '🏋️', rest: 'practice every day', quote: '"I will practice every day."' },
  { kind: 'will', icon: '📗', rest: 'return the book', quote: '"I will return the book."' },
  { kind: 'will', icon: '⏱️', rest: 'wait outside', quote: '"I will wait outside."' },
  { kind: 'will', icon: '☂️', rest: 'bring an umbrella', quote: '"I will bring an umbrella."' },
  { kind: 'will', icon: '📜', rest: 'explain the rules', quote: '"I will explain the rules."' },
  { kind: 'will', icon: '⏰', rest: 'arrive on time', quote: '"I will arrive on time."' },
  // can
  { kind: 'can', icon: '🏊', rest: 'swim very well', quote: '"I can swim very well."' },
  { kind: 'can', icon: '🗣️', rest: 'speak three languages', quote: '"I can speak three languages."' },
  { kind: 'can', icon: '🐴', rest: 'ride a horse', quote: '"I can ride a horse."' },
  { kind: 'can', icon: '🎸', rest: 'play the guitar', quote: '"I can play the guitar."' },
  { kind: 'can', icon: '🧩', rest: 'solve this puzzle', quote: '"I can solve this puzzle."' },
  { kind: 'can', icon: '🍝', rest: 'cook Italian food', quote: '"I can cook Italian food."' },
  { kind: 'can', icon: '🖨️', rest: 'fix the printer', quote: '"I can fix the printer."' },
  { kind: 'can', icon: '🏃', rest: 'run five kilometers', quote: '"I can run five kilometers."' },
  { kind: 'can', icon: '🎨', rest: 'draw very well', quote: '"I can draw very well."' },
  { kind: 'can', icon: '🎤', rest: 'sing this song', quote: '"I can sing this song."' },
  { kind: 'can', icon: '📦', rest: 'lift this box', quote: '"I can lift this box."' },
  { kind: 'can', icon: '🈷️', rest: 'read Chinese characters', quote: '"I can read Chinese characters."' },
  { kind: 'can', icon: '⛰️', rest: 'climb this mountain', quote: '"I can climb this mountain."' },
  { kind: 'can', icon: '✅', rest: 'finish it tomorrow', quote: '"I can finish it tomorrow."' },
  { kind: 'can', icon: '🤝', rest: 'help with the project', quote: '"I can help with the project."' },
  // have + P2
  { kind: 'have-pp', icon: '📄', rest: 'finished the assignment', quote: '"I have finished the assignment."' },
  { kind: 'have-pp', icon: '🎬', rest: 'seen that movie', quote: '"I have seen that movie."' },
  { kind: 'have-pp', icon: '📕', rest: 'read the book', quote: '"I have read the book."' },
  { kind: 'have-pp', icon: '🍳', rest: 'eaten breakfast', quote: '"I have eaten breakfast."' },
  { kind: 'have-pp', icon: '🔑', rest: 'lost the keys', quote: '"I have lost the keys."' },
  { kind: 'have-pp', icon: '👛', rest: 'found the wallet', quote: '"I have found the wallet."' },
  { kind: 'have-pp', icon: '🏛️', rest: 'visited that museum', quote: '"I have visited that museum."' },
  { kind: 'have-pp', icon: '🏺', rest: 'broken the vase', quote: '"I have broken the vase."' },
  { kind: 'have-pp', icon: '🧽', rest: 'cleaned the classroom', quote: '"I have cleaned the classroom."' },
  { kind: 'have-pp', icon: '📝', rest: 'written the report', quote: '"I have written the report."' },
  { kind: 'have-pp', icon: '🔧', rest: 'fixed the problem', quote: '"I have fixed the problem."' },
  { kind: 'have-pp', icon: '🎓', rest: 'passed the exam', quote: '"I have passed the exam."' },
  { kind: 'have-pp', icon: '📍', rest: 'forgotten the address', quote: '"I have forgotten the address."' },
  { kind: 'have-pp', icon: '🧳', rest: 'packed the suitcase', quote: '"I have packed the suitcase."' },
  { kind: 'have-pp', icon: '🪟', rest: 'closed the window', quote: '"I have closed the window."' },
  { kind: 'am-adj', icon: '😔', rest: 'lonely', quote: '"I am lonely."' },
  { kind: 'am-adj', icon: '😒', rest: 'jealous', quote: '"I am jealous."' },
  { kind: 'am-adj', icon: '😳', rest: 'embarrassed', quote: '"I am embarrassed."' },
  { kind: 'am-adj', icon: '😌', rest: 'relieved', quote: '"I am relieved."' },
  { kind: 'am-adj', icon: '😟', rest: 'anxious', quote: '"I am anxious."' },
  { kind: 'am-adj', icon: '😐', rest: 'calm', quote: '"I am calm."' },
  { kind: 'am-adj', icon: '🥵', rest: 'exhausted', quote: '"I am exhausted."' },
  { kind: 'am-adj', icon: '🤩', rest: 'thrilled', quote: '"I am thrilled."' },
  { kind: 'am-adj', icon: '😞', rest: 'disappointed', quote: '"I am disappointed."' },
  { kind: 'am-adj', icon: '🙏', rest: 'grateful', quote: '"I am grateful."' },
  { kind: 'am-adj', icon: '😲', rest: 'surprised', quote: '"I am surprised."' },
  { kind: 'am-adj', icon: '😳', rest: 'ashamed', quote: '"I am ashamed."' },
  { kind: 'am-adj', icon: '🏠', rest: 'homesick', quote: '"I am homesick."' },
  { kind: 'am-adj', icon: '😵', rest: 'dizzy', quote: '"I am dizzy."' },
  { kind: 'am-adj', icon: '😡', rest: 'furious', quote: '"I am furious."' },
  { kind: 'am-adj', icon: '😄', rest: 'delighted', quote: '"I am delighted."' },
  { kind: 'am-adj', icon: '🤞', rest: 'hopeful', quote: '"I am hopeful."' },
  { kind: 'am-adj', icon: '🙂', rest: 'cheerful', quote: '"I am cheerful."' },
  { kind: 'am-adj', icon: '😖', rest: 'miserable', quote: '"I am miserable."' },
  { kind: 'am-adj', icon: '😱', rest: 'terrified', quote: '"I am terrified."' },
  { kind: 'am-adj', icon: '😊', rest: 'content', quote: '"I am content."' },
  { kind: 'am-adj', icon: '😣', rest: 'restless', quote: '"I am restless."' },
  { kind: 'am-adj', icon: '🥱', rest: 'drowsy', quote: '"I am drowsy."' },
  { kind: 'am-adj', icon: '😬', rest: 'uneasy', quote: '"I am uneasy."' },
  { kind: 'am-adj', icon: '⚡', rest: 'energetic', quote: '"I am energetic."' },
  { kind: 'am-ving', icon: '📰', rest: 'reading a magazine', quote: '"I am reading a magazine."' },
  { kind: 'am-ving', icon: '🎨', rest: 'painting the fence', quote: '"I am painting the fence."' },
  { kind: 'am-ving', icon: '🌿', rest: 'mowing the lawn', quote: '"I am mowing the lawn."' },
  { kind: 'am-ving', icon: '🐕', rest: 'walking the dog', quote: '"I am walking the dog."' },
  { kind: 'am-ving', icon: '🚲', rest: 'riding a bicycle', quote: '"I am riding a bicycle."' },
  { kind: 'am-ving', icon: '🧺', rest: 'folding the laundry', quote: '"I am folding the laundry."' },
  { kind: 'am-ving', icon: '🧳', rest: 'packing a suitcase', quote: '"I am packing a suitcase."' },
  { kind: 'am-ving', icon: '🔌', rest: 'charging the phone', quote: '"I am charging the phone."' },
  { kind: 'am-ving', icon: '🪥', rest: 'brushing my teeth', quote: '"I am brushing my teeth."' },
  { kind: 'am-ving', icon: '💇', rest: 'combing my hair', quote: '"I am combing my hair."' },
  { kind: 'am-ving', icon: '👔', rest: 'ironing a shirt', quote: '"I am ironing a shirt."' },
  { kind: 'am-ving', icon: '🧹', rest: 'sweeping the porch', quote: '"I am sweeping the porch."' },
  { kind: 'am-ving', icon: '🌳', rest: 'planting a tree', quote: '"I am planting a tree."' },
  { kind: 'am-ving', icon: '🐦', rest: 'feeding the birds', quote: '"I am feeding the birds."' },
  { kind: 'am-ving', icon: '🚌', rest: 'catching a bus', quote: '"I am catching a bus."' },
  { kind: 'am-ving', icon: '🎤', rest: 'singing a song', quote: '"I am singing a song."' },
  { kind: 'am-ving', icon: '🌧️', rest: 'dancing in the rain', quote: '"I am dancing in the rain."' },
  { kind: 'am-ving', icon: '🌲', rest: 'climbing a tree', quote: '"I am climbing a tree."' },
  { kind: 'am-ving', icon: '🏃', rest: 'jogging in the park', quote: '"I am jogging in the park."' },
  { kind: 'am-ving', icon: '🏊', rest: 'swimming in the pool', quote: '"I am swimming in the pool."' },
  { kind: 'am-ving', icon: '🏖️', rest: 'building a sandcastle', quote: '"I am building a sandcastle."' },
  { kind: 'am-ving', icon: '🪁', rest: 'flying a kite', quote: '"I am flying a kite."' },
  { kind: 'am-ving', icon: '😴', rest: 'taking a nap', quote: '"I am taking a nap."' },
  { kind: 'am-ving', icon: '🍳', rest: 'making breakfast', quote: '"I am making breakfast."' },
  { kind: 'am-ving', icon: '📧', rest: 'checking my email', quote: '"I am checking my email."' },
  { kind: 'present-verb', icon: '🍵', past: 'preferred', s3: 'prefers', rest: 'tea', quote: '"I prefer tea."' },
  { kind: 'present-verb', icon: '📮', past: 'collected', s3: 'collects', rest: 'stamps', quote: '"I collect stamps."' },
  { kind: 'present-verb', icon: '🙇', past: 'respected', s3: 'respects', rest: 'my teacher', quote: '"I respect my teacher."' },
  { kind: 'present-verb', icon: '🦸', past: 'admired', s3: 'admires', rest: 'brave people', quote: '"I admire brave people."' },
  { kind: 'present-verb', icon: '🔇', past: 'disliked', s3: 'dislikes', rest: 'noise', quote: '"I dislike noise."' },
  { kind: 'present-verb', icon: '🤝', past: 'trusted', s3: 'trusts', rest: 'my best friend', quote: '"I trust my best friend."' },
  { kind: 'present-verb', icon: '❓', past: 'doubted', s3: 'doubts', rest: 'that story', quote: '"I doubt that story."' },
  { kind: 'present-verb', icon: '👍', past: 'supported', s3: 'supports', rest: 'this idea', quote: '"I support this idea."' },
  { kind: 'present-verb', icon: '📖', past: 'recommended', s3: 'recommends', rest: 'this book', quote: '"I recommend this book."' },
  { kind: 'present-verb', icon: '🚫', past: 'avoided', s3: 'avoids', rest: 'junk food', quote: '"I avoid junk food."' },
  { kind: 'present-verb', icon: '🕊️', past: 'wished', s3: 'wishes', rest: 'for peace', quote: '"I wish for peace."' },
  { kind: 'present-verb', icon: '☀️', past: 'hoped', s3: 'hopes', rest: 'for good weather', quote: '"I hope for good weather."' },
  { kind: 'present-verb', icon: '✉️', past: 'expected', s3: 'expects', rest: 'a letter', quote: '"I expect a letter."' },
  { kind: 'present-verb', icon: '🧠', past: 'forgot', s3: 'forgets', rest: 'things easily', quote: '"I forget things easily."' },
  { kind: 'present-verb', icon: '👀', past: 'noticed', s3: 'notices', rest: 'small details', quote: '"I notice small details."' },
  { kind: 'present-verb', icon: '🌍', past: 'imagined', s3: 'imagines', rest: 'a better world', quote: '"I imagine a better world."' },
  { kind: 'present-verb', icon: '🤔', past: 'considered', s3: 'considers', rest: 'this carefully', quote: '"I consider this carefully."' },
  { kind: 'present-verb', icon: '💭', past: 'supposed', s3: 'supposes', rest: 'the story is true', quote: '"I suppose the story is true."' },
  { kind: 'present-verb', icon: '🎲', past: 'guessed', s3: 'guesses', rest: 'the answer', quote: '"I guess the answer."' },
  { kind: 'present-verb', icon: '🙆', past: 'assumed', s3: 'assumes', rest: 'the best', quote: '"I assume the best."' },
  { kind: 'present-verb', icon: '🎖️', past: 'valued', s3: 'values', rest: 'honesty', quote: '"I value honesty."' },
  { kind: 'present-verb', icon: '✈️', past: 'dreamed', s3: 'dreams', rest: 'of traveling', quote: '"I dream of traveling."' },
  { kind: 'present-verb', icon: '👪', past: 'missed', s3: 'misses', rest: 'my family', quote: '"I miss my family."' },
  { kind: 'present-verb', icon: '😤', past: 'envied', s3: 'envies', rest: 'successful people', quote: '"I envy successful people."' },
  { kind: 'present-verb', icon: '🍕', past: 'appreciated', s3: 'appreciates', rest: 'good food', quote: '"I appreciate good food."' },
  { kind: 'will', icon: '💪', rest: 'try my best', quote: '"I will try my best."' },
  { kind: 'will', icon: '📁', rest: 'finish this task', quote: '"I will finish this task."' },
  { kind: 'will', icon: '🙏', rest: 'apologize tomorrow', quote: '"I will apologize tomorrow."' },
  { kind: 'will', icon: '🗂️', rest: 'organize the files', quote: '"I will organize the files."' },
  { kind: 'will', icon: '📞', rest: 'contact the manager', quote: '"I will contact the manager."' },
  { kind: 'will', icon: '📤', rest: 'submit the report', quote: '"I will submit the report."' },
  { kind: 'will', icon: '🗓️', rest: 'attend the meeting', quote: '"I will attend the meeting."' },
  { kind: 'will', icon: '📄', rest: 'review the document', quote: '"I will review the document."' },
  { kind: 'will', icon: '🎤', rest: 'prepare the presentation', quote: '"I will prepare the presentation."' },
  { kind: 'will', icon: '✅', rest: 'confirm the booking', quote: '"I will confirm the booking."' },
  { kind: 'will', icon: '❌', rest: 'cancel the appointment', quote: '"I will cancel the appointment."' },
  { kind: 'will', icon: '🗓️', rest: 'update the schedule', quote: '"I will update the schedule."' },
  { kind: 'will', icon: '🪵', rest: 'repair the fence', quote: '"I will repair the fence."' },
  { kind: 'will', icon: '🎨', rest: 'paint the room', quote: '"I will paint the room."' },
  { kind: 'will', icon: '🌷', rest: 'plant some flowers', quote: '"I will plant some flowers."' },
  { kind: 'will', icon: '📚', rest: 'donate the books', quote: '"I will donate the books."' },
  { kind: 'will', icon: '♻️', rest: 'recycle the cans', quote: '"I will recycle the cans."' },
  { kind: 'will', icon: '🐕', rest: 'walk the dog', quote: '"I will walk the dog."' },
  { kind: 'will', icon: '🐦', rest: 'feed the birds', quote: '"I will feed the birds."' },
  { kind: 'will', icon: '🪴', rest: 'water the office plants', quote: '"I will water the office plants."' },
  { kind: 'will', icon: '🔋', rest: 'charge the batteries', quote: '"I will charge the batteries."' },
  { kind: 'will', icon: '🔐', rest: 'lock the doors', quote: '"I will lock the doors."' },
  { kind: 'will', icon: '💡', rest: 'turn off the lights', quote: '"I will turn off the lights."' },
  { kind: 'will', icon: '🏪', rest: 'close the shop', quote: '"I will close the shop."' },
  { kind: 'will', icon: '🏬', rest: 'open a new store', quote: '"I will open a new store."' },
  { kind: 'can', icon: '➗', rest: 'solve the equation', quote: '"I can solve the equation."' },
  { kind: 'can', icon: '🈯', rest: 'translate this sentence', quote: '"I can translate this sentence."' },
  { kind: 'can', icon: '🔧', rest: 'repair the engine', quote: '"I can repair the engine."' },
  { kind: 'can', icon: '⚙️', rest: 'operate this machine', quote: '"I can operate this machine."' },
  { kind: 'can', icon: '📜', rest: 'memorize the poem', quote: '"I can memorize the poem."' },
  { kind: 'can', icon: '😗', rest: 'whistle a tune', quote: '"I can whistle a tune."' },
  { kind: 'can', icon: '🤹', rest: 'juggle three balls', quote: '"I can juggle three balls."' },
  { kind: 'can', icon: '🦩', rest: 'balance on one foot', quote: '"I can balance on one foot."' },
  { kind: 'can', icon: '🫁', rest: 'hold my breath', quote: '"I can hold my breath."' },
  { kind: 'can', icon: '🧘', rest: 'touch my toes', quote: '"I can touch my toes."' },
  { kind: 'can', icon: '🤸', rest: 'do a cartwheel', quote: '"I can do a cartwheel."' },
  { kind: 'can', icon: '🚲', rest: 'ride a unicycle', quote: '"I can ride a unicycle."' },
  { kind: 'can', icon: '🍞', rest: 'bake bread', quote: '"I can bake bread."' },
  { kind: 'can', icon: '🧵', rest: 'sew a button', quote: '"I can sew a button."' },
  { kind: 'can', icon: '🧶', rest: 'knit a scarf', quote: '"I can knit a scarf."' },
  { kind: 'can', icon: '🖼️', rest: 'paint a portrait', quote: '"I can paint a portrait."' },
  { kind: 'can', icon: '🖋️', rest: 'write calligraphy', quote: '"I can write calligraphy."' },
  { kind: 'can', icon: '♟️', rest: 'play chess well', quote: '"I can play chess well."' },
  { kind: 'can', icon: '🔤', rest: 'recite the alphabet', quote: '"I can recite the alphabet."' },
  { kind: 'can', icon: '💯', rest: 'count to a hundred', quote: '"I can count to a hundred."' },
  { kind: 'can', icon: '📝', rest: 'spell difficult words', quote: '"I can spell difficult words."' },
  { kind: 'can', icon: '🦅', rest: 'identify birds', quote: '"I can identify birds."' },
  { kind: 'can', icon: '🪐', rest: 'name the planets', quote: '"I can name the planets."' },
  { kind: 'can', icon: '🎼', rest: 'read music', quote: '"I can read music."' },
  { kind: 'can', icon: '🥁', rest: 'play the drums', quote: '"I can play the drums."' },
  { kind: 'have-pp', icon: '📁', rest: 'finished the project', quote: '"I have finished the project."' },
  { kind: 'have-pp', icon: '🎓', rest: 'completed the course', quote: '"I have completed the course."' },
  { kind: 'have-pp', icon: '🕵️', rest: 'solved the mystery', quote: '"I have solved the mystery."' },
  { kind: 'have-pp', icon: '🏠', rest: 'repaired the roof', quote: '"I have repaired the roof."' },
  { kind: 'have-pp', icon: '🪵', rest: 'painted the fence', quote: '"I have painted the fence."' },
  { kind: 'have-pp', icon: '🗂️', rest: 'organized the files', quote: '"I have organized the files."' },
  { kind: 'have-pp', icon: '📤', rest: 'submitted the application', quote: '"I have submitted the application."' },
  { kind: 'have-pp', icon: '📄', rest: 'reviewed the contract', quote: '"I have reviewed the contract."' },
  { kind: 'have-pp', icon: '📋', rest: 'prepared the report', quote: '"I have prepared the report."' },
  { kind: 'have-pp', icon: '🚗', rest: 'cleaned the garage', quote: '"I have cleaned the garage."' },
  { kind: 'have-pp', icon: '🍲', rest: 'cooked the meal', quote: '"I have cooked the meal."' },
  { kind: 'have-pp', icon: '🌱', rest: 'planted the garden', quote: '"I have planted the garden."' },
  { kind: 'have-pp', icon: '🌻', rest: 'watered the plants', quote: '"I have watered the plants."' },
  { kind: 'have-pp', icon: '🐾', rest: 'fed the animals', quote: '"I have fed the animals."' },
  { kind: 'have-pp', icon: '🚪', rest: 'locked the gate', quote: '"I have locked the gate."' },
  { kind: 'have-pp', icon: '🔋', rest: 'charged the battery', quote: '"I have charged the battery."' },
  { kind: 'have-pp', icon: '🧳', rest: 'packed the bags', quote: '"I have packed the bags."' },
  { kind: 'have-pp', icon: '🎫', rest: 'booked the tickets', quote: '"I have booked the tickets."' },
  { kind: 'have-pp', icon: '✅', rest: 'confirmed the reservation', quote: '"I have confirmed the reservation."' },
  { kind: 'have-pp', icon: '❌', rest: 'cancelled the order', quote: '"I have cancelled the order."' },
  { kind: 'have-pp', icon: '📦', rest: 'returned the item', quote: '"I have returned the item."' },
  { kind: 'have-pp', icon: '👕', rest: 'donated the clothes', quote: '"I have donated the clothes."' },
  { kind: 'have-pp', icon: '♻️', rest: 'recycled the bottles', quote: '"I have recycled the bottles."' },
  { kind: 'have-pp', icon: '💰', rest: 'saved enough money', quote: '"I have saved enough money."' },
  { kind: 'have-pp', icon: '🧹', rest: 'cleaned the yard', quote: '"I have cleaned the yard."' },
  { kind: 'am-adj', icon: '🥴', rest: 'queasy', quote: '"I am queasy."' },
  { kind: 'am-adj', icon: '😤', rest: 'frustrated', quote: '"I am frustrated."' },
  { kind: 'am-adj', icon: '😶', rest: 'speechless', quote: '"I am speechless."' },
  { kind: 'am-adj', icon: '🥳', rest: 'festive', quote: '"I am festive."' },
  { kind: 'am-adj', icon: '😪', rest: 'fatigued', quote: '"I am fatigued."' },
  { kind: 'am-adj', icon: '😕', rest: 'puzzled', quote: '"I am puzzled."' },
  { kind: 'am-adj', icon: '🙄', rest: 'irritated', quote: '"I am irritated."' },
  { kind: 'am-adj', icon: '😰', rest: 'panicked', quote: '"I am panicked."' },
  { kind: 'am-adj', icon: '😎', rest: 'confident', quote: '"I am confident."' },
  { kind: 'am-adj', icon: '🤒', rest: 'feverish', quote: '"I am feverish."' },
  { kind: 'am-adj', icon: '🥺', rest: 'heartbroken', quote: '"I am heartbroken."' },
  { kind: 'am-adj', icon: '😵‍💫', rest: 'overwhelmed', quote: '"I am overwhelmed."' },
  { kind: 'am-adj', icon: '🤗', rest: 'optimistic', quote: '"I am optimistic."' },
  { kind: 'am-adj', icon: '😬', rest: 'apprehensive', quote: '"I am apprehensive."' },
  { kind: 'am-adj', icon: '🫠', rest: 'melting from the heat', quote: '"I am melting from the heat."' },
  { kind: 'am-adj', icon: '😷', rest: 'unwell', quote: '"I am unwell."' },
  { kind: 'am-ving', icon: '🧺', rest: 'hanging the laundry', quote: '"I am hanging the laundry."' },
  { kind: 'am-ving', icon: '🪟', rest: 'wiping the windows', quote: '"I am wiping the windows."' },
  { kind: 'am-ving', icon: '🧴', rest: 'moisturizing my hands', quote: '"I am moisturizing my hands."' },
  { kind: 'am-ving', icon: '🚴', rest: 'pedaling uphill', quote: '"I am pedaling uphill."' },
  { kind: 'am-ving', icon: '🎣', rest: 'baiting the hook', quote: '"I am baiting the hook."' },
  { kind: 'am-ving', icon: '🧭', rest: 'navigating the trail', quote: '"I am navigating the trail."' },
  { kind: 'am-ving', icon: '🖋️', rest: 'signing the form', quote: '"I am signing the form."' },
  { kind: 'am-ving', icon: '🧯', rest: 'checking the fire alarm', quote: '"I am checking the fire alarm."' },
  { kind: 'am-ving', icon: '🪁', rest: 'untangling the kite string', quote: '"I am untangling the kite string."' },
  { kind: 'am-ving', icon: '🛠️', rest: 'assembling the shelf', quote: '"I am assembling the shelf."' },
  { kind: 'am-ving', icon: '🎯', rest: 'aiming at the target', quote: '"I am aiming at the target."' },
  { kind: 'am-ving', icon: '🧊', rest: 'crushing the ice', quote: '"I am crushing the ice."' },
  { kind: 'am-ving', icon: '🚿', rest: 'scrubbing the tiles', quote: '"I am scrubbing the tiles."' },
  { kind: 'am-ving', icon: '🍳', rest: 'flipping the pancake', quote: '"I am flipping the pancake."' },
  { kind: 'am-ving', icon: '🧵', rest: 'threading the needle', quote: '"I am threading the needle."' },
  { kind: 'am-ving', icon: '🪴', rest: 'repotting the plant', quote: '"I am repotting the plant."' },
  { kind: 'present-verb', icon: '🎢', past: 'enjoyed', s3: 'enjoys', rest: 'roller coasters', quote: '"I enjoy roller coasters."' },
  { kind: 'present-verb', icon: '🐝', past: 'feared', s3: 'fears', rest: 'bees', quote: '"I fear bees."' },
  { kind: 'present-verb', icon: '🎳', past: 'practiced', s3: 'practices', rest: 'bowling every week', quote: '"I practice bowling every week."' },
  { kind: 'present-verb', icon: '📻', past: 'tuned', s3: 'tunes', rest: 'in to that station', quote: '"I tune in to that station."' },
  { kind: 'present-verb', icon: '🧺', past: 'sorted', s3: 'sorts', rest: 'the laundry by color', quote: '"I sort the laundry by color."' },
  { kind: 'present-verb', icon: '🛏️', past: 'made', s3: 'makes', rest: 'the bed every morning', quote: '"I make the bed every morning."' },
  { kind: 'present-verb', icon: '🚿', past: 'skipped', s3: 'skips', rest: 'a shower sometimes', quote: '"I skip a shower sometimes."' },
  { kind: 'present-verb', icon: '🎨', past: 'sketched', s3: 'sketches', rest: 'in my free time', quote: '"I sketch in my free time."' },
  { kind: 'present-verb', icon: '🥗', past: 'chose', s3: 'chooses', rest: 'the salad option', quote: '"I choose the salad option."' },
  { kind: 'present-verb', icon: '📺', past: 'watched', s3: 'watches', rest: 'the news every night', quote: '"I watch the news every night."' },
  { kind: 'present-verb', icon: '🎧', past: 'streamed', s3: 'streams', rest: 'music while working', quote: '"I stream music while working."' },
  { kind: 'present-verb', icon: '🚲', past: 'rode', s3: 'rides', rest: 'a bike to work', quote: '"I ride a bike to work."' },
  { kind: 'present-verb', icon: '🧗', past: 'climbed', s3: 'climbs', rest: 'on weekends', quote: '"I climb on weekends."' },
  { kind: 'present-verb', icon: '🏹', past: 'aimed', s3: 'aims', rest: 'carefully before shooting', quote: '"I aim carefully before shooting."' },
  { kind: 'present-verb', icon: '🧑‍🍳', past: 'seasoned', s3: 'seasons', rest: 'the soup with pepper', quote: '"I season the soup with pepper."' },
  { kind: 'present-verb', icon: '🧊', past: 'froze', s3: 'freezes', rest: 'the leftovers', quote: '"I freeze the leftovers."' },
  { kind: 'will', icon: '🧾', rest: 'pay the bill', quote: '"I will pay the bill."' },
  { kind: 'will', icon: '🧴', rest: 'refill the bottle', quote: '"I will refill the bottle."' },
  { kind: 'will', icon: '🖨️', rest: 'print the tickets', quote: '"I will print the tickets."' },
  { kind: 'will', icon: '📆', rest: 'mark the calendar', quote: '"I will mark the calendar."' },
  { kind: 'will', icon: '🧹', rest: 'sweep the porch', quote: '"I will sweep the porch."' },
  { kind: 'will', icon: '🛠️', rest: 'assemble the desk', quote: '"I will assemble the desk."' },
  { kind: 'will', icon: '🚪', rest: 'oil the hinges', quote: '"I will oil the hinges."' },
  { kind: 'will', icon: '🧻', rest: 'restock the paper', quote: '"I will restock the paper."' },
  { kind: 'will', icon: '🪟', rest: 'open the curtains', quote: '"I will open the curtains."' },
  { kind: 'will', icon: '🎒', rest: 'pack the backpack', quote: '"I will pack the backpack."' },
  { kind: 'will', icon: '🐕', rest: 'brush the dog', quote: '"I will brush the dog."' },
  { kind: 'will', icon: '🚲', rest: 'oil the chain', quote: '"I will oil the chain."' },
  { kind: 'will', icon: '🧯', rest: 'test the smoke alarm', quote: '"I will test the smoke alarm."' },
  { kind: 'will', icon: '🖊️', rest: 'sign the letter', quote: '"I will sign the letter."' },
  { kind: 'will', icon: '🧊', rest: 'defrost the fridge', quote: '"I will defrost the fridge."' },
  { kind: 'will', icon: '🌡️', rest: 'check the temperature', quote: '"I will check the temperature."' },
  { kind: 'can', icon: '🎯', rest: 'hit the bullseye', quote: '"I can hit the bullseye."' },
  { kind: 'can', icon: '🏄', rest: 'surf small waves', quote: '"I can surf small waves."' },
  { kind: 'can', icon: '🎿', rest: 'ski down easy slopes', quote: '"I can ski down easy slopes."' },
  { kind: 'can', icon: '🧗‍♀️', rest: 'climb the wall', quote: '"I can climb the wall."' },
  { kind: 'can', icon: '🥋', rest: 'do a roundhouse kick', quote: '"I can do a roundhouse kick."' },
  { kind: 'can', icon: '🎪', rest: 'walk on a tightrope', quote: '"I can walk on a tightrope."' },
  { kind: 'can', icon: '🎨', rest: 'mix paint colors well', quote: '"I can mix paint colors well."' },
  { kind: 'can', icon: '🧩', rest: 'finish the puzzle fast', quote: '"I can finish the puzzle fast."' },
  { kind: 'can', icon: '📐', rest: 'draw a straight line', quote: '"I can draw a straight line."' },
  { kind: 'can', icon: '🎳', rest: 'knock down all the pins', quote: '"I can knock down all the pins."' },
  { kind: 'can', icon: '🎣', rest: 'tie a fishing knot', quote: '"I can tie a fishing knot."' },
  { kind: 'can', icon: '🚗', rest: 'parallel park', quote: '"I can parallel park."' },
  { kind: 'can', icon: '🏸', rest: 'smash the shuttlecock', quote: '"I can smash the shuttlecock."' },
  { kind: 'can', icon: '🎤', rest: 'beatbox a little', quote: '"I can beatbox a little."' },
  { kind: 'can', icon: '🧶', rest: 'crochet a hat', quote: '"I can crochet a hat."' },
  { kind: 'can', icon: '📷', rest: 'develop film photos', quote: '"I can develop film photos."' },
  { kind: 'have-pp', icon: '🧾', rest: 'paid the bill', quote: '"I have paid the bill."' },
  { kind: 'have-pp', icon: '📮', rest: 'mailed the letter', quote: '"I have mailed the letter."' },
  { kind: 'have-pp', icon: '🧳', rest: 'unpacked the bags', quote: '"I have unpacked the bags."' },
  { kind: 'have-pp', icon: '🚗', rest: 'washed the car', quote: '"I have washed the car."' },
  { kind: 'have-pp', icon: '🪟', rest: 'fixed the window', quote: '"I have fixed the window."' },
  { kind: 'have-pp', icon: '🌳', rest: 'trimmed the hedge', quote: '"I have trimmed the hedge."' },
  { kind: 'have-pp', icon: '🧺', rest: 'folded the towels', quote: '"I have folded the towels."' },
  { kind: 'have-pp', icon: '🎁', rest: 'wrapped the present', quote: '"I have wrapped the present."' },
  { kind: 'have-pp', icon: '📖', rest: 'finished the chapter', quote: '"I have finished the chapter."' },
  { kind: 'have-pp', icon: '🎨', rest: 'framed the painting', quote: '"I have framed the painting."' },
  { kind: 'have-pp', icon: '🚪', rest: 'oiled the door', quote: '"I have oiled the door."' },
  { kind: 'have-pp', icon: '🧯', rest: 'tested the alarm', quote: '"I have tested the alarm."' },
  { kind: 'have-pp', icon: '🧊', rest: 'defrosted the freezer', quote: '"I have defrosted the freezer."' },
  { kind: 'have-pp', icon: '🍽️', rest: 'set the table', quote: '"I have set the table."' },
  { kind: 'have-pp', icon: '🧹', rest: 'mopped the floor', quote: '"I have mopped the floor."' },
  { kind: 'have-pp', icon: '📦', rest: 'shipped the order', quote: '"I have shipped the order."' },
  { kind: 'have-pp', icon: '🧦', rest: 'darned the socks', quote: '"I have darned the socks."' },
  { kind: 'have-pp', icon: '🪑', rest: 'repainted the chair', quote: '"I have repainted the chair."' },
  // ----- Bổ sung vòng mục tiêu 850 -----
  { kind: 'am-adj', icon: '🤢', rest: 'seasick', quote: '"I am seasick."' },
  { kind: 'am-adj', icon: '🧳', rest: 'jetlagged', quote: '"I am jetlagged."' },
  { kind: 'am-adj', icon: '🌟', rest: 'starstruck', quote: '"I am starstruck."' },
  { kind: 'am-adj', icon: '🪄', rest: 'spellbound', quote: '"I am spellbound."' },
  { kind: 'am-adj', icon: '😮‍💨', rest: 'breathless', quote: '"I am breathless."' },
  { kind: 'am-adj', icon: '🤭', rest: 'giddy', quote: '"I am giddy."' },
  { kind: 'am-adj', icon: '🌇', rest: 'wistful', quote: '"I am wistful."' },
  { kind: 'am-adj', icon: '😲', rest: 'awestruck', quote: '"I am awestruck."' },
  { kind: 'am-adj', icon: '😠', rest: 'indignant', quote: '"I am indignant."' },
  { kind: 'am-adj', icon: '🥳', rest: 'elated', quote: '"I am elated."' },
  { kind: 'am-adj', icon: '🔋', rest: 'drained', quote: '"I am drained."' },
  { kind: 'am-adj', icon: '🏜️', rest: 'parched', quote: '"I am parched."' },
  { kind: 'am-adj', icon: '🥴', rest: 'groggy', quote: '"I am groggy."' },
  { kind: 'am-ving', icon: '🎂', rest: 'decorating the cake', quote: '"I am decorating the cake."' },
  { kind: 'am-ving', icon: '🎸', rest: 'tuning the guitar', quote: '"I am tuning the guitar."' },
  { kind: 'am-ving', icon: '📬', rest: 'sorting the mail', quote: '"I am sorting the mail."' },
  { kind: 'am-ving', icon: '🌿', rest: 'watering the herbs', quote: '"I am watering the herbs."' },
  { kind: 'am-ving', icon: '🪑', rest: 'stacking the chairs', quote: '"I am stacking the chairs."' },
  { kind: 'am-ving', icon: '🧽', rest: 'wiping the counter', quote: '"I am wiping the counter."' },
  { kind: 'am-ving', icon: '🍳', rest: 'greasing the pan', quote: '"I am greasing the pan."' },
  { kind: 'am-ving', icon: '📿', rest: 'threading the beads', quote: '"I am threading the beads."' },
  { kind: 'am-ving', icon: '🚿', rest: 'coiling the hose', quote: '"I am coiling the hose."' },
  { kind: 'am-ving', icon: '🗄️', rest: 'dusting the shelves', quote: '"I am dusting the shelves."' },
  { kind: 'am-ving', icon: '🪵', rest: 'sanding the table', quote: '"I am sanding the table."' },
  { kind: 'am-ving', icon: '🧵', rest: 'hemming the skirt', quote: '"I am hemming the skirt."' },
  { kind: 'am-ving', icon: '🪑', rest: 'varnishing the chair', quote: '"I am varnishing the chair."' },
  { kind: 'present-verb', icon: '📗', past: 'enjoyed', s3: 'enjoys', rest: 'reading comics', quote: '"I enjoy reading comics."' },
  { kind: 'present-verb', icon: '🏋️', past: 'needed', s3: 'needs', rest: 'more practice', quote: '"I need more practice."' },
  { kind: 'present-verb', icon: '🍵', past: 'preferred', s3: 'prefers', rest: 'tea to coffee', quote: '"I prefer tea to coffee."' },
  { kind: 'present-verb', icon: '💪', past: 'believed', s3: 'believes', rest: 'in hard work', quote: '"I believe in hard work."' },
  { kind: 'present-verb', icon: '😤', past: 'hated', s3: 'hates', rest: 'losing games', quote: '"I hate losing games."' },
  { kind: 'present-verb', icon: '🗓️', past: 'remembered', s3: 'remembers', rest: 'that day well', quote: '"I remember that day well."' },
  { kind: 'present-verb', icon: '🧭', past: 'trusted', s3: 'trusts', rest: 'my instincts', quote: '"I trust my instincts."' },
  { kind: 'present-verb', icon: '🚒', past: 'admired', s3: 'admires', rest: 'brave firefighters', quote: '"I admire brave firefighters."' },
  { kind: 'present-verb', icon: '🙏', past: 'respected', s3: 'respects', rest: 'my teachers', quote: '"I respect my teachers."' },
  { kind: 'present-verb', icon: '🏘️', past: 'missed', s3: 'misses', rest: 'my hometown', quote: '"I miss my hometown."' },
  { kind: 'present-verb', icon: '📋', past: 'understood', s3: 'understands', rest: 'the instructions', quote: '"I understand the instructions."' },
  { kind: 'present-verb', icon: '🎵', past: 'recognized', s3: 'recognizes', rest: 'that song', quote: '"I recognize that song."' },
  { kind: 'present-verb', icon: '🙌', past: 'appreciated', s3: 'appreciates', rest: 'your help', quote: '"I appreciate your help."' },
  { kind: 'will', icon: '🧹', rest: 'clean the garage', quote: '"I will clean the garage."' },
  { kind: 'will', icon: '🪟', rest: 'wash the windows', quote: '"I will wash the windows."' },
  { kind: 'will', icon: '👞', rest: 'polish the shoes', quote: '"I will polish the shoes."' },
  { kind: 'will', icon: '🍂', rest: 'sweep the yard', quote: '"I will sweep the yard."' },
  { kind: 'will', icon: '🌱', rest: 'water the lawn', quote: '"I will water the lawn."' },
  { kind: 'will', icon: '🚶', rest: 'walk to school', quote: '"I will walk to school."' },
  { kind: 'will', icon: '🔧', rest: 'call the plumber', quote: '"I will call the plumber."' },
  { kind: 'will', icon: '📱', rest: 'text you tomorrow', quote: '"I will text you tomorrow."' },
  { kind: 'will', icon: '⏰', rest: 'meet you at noon', quote: '"I will meet you at noon."' },
  { kind: 'will', icon: '🍿', rest: 'bring the snacks', quote: '"I will bring the snacks."' },
  { kind: 'will', icon: '⛺', rest: 'set up the tent', quote: '"I will set up the tent."' },
  { kind: 'will', icon: '📬', rest: 'check the mailbox', quote: '"I will check the mailbox."' },
  { kind: 'will', icon: '🖨️', rest: 'refill the printer', quote: '"I will refill the printer."' },
  { kind: 'can', icon: '🛹', rest: 'skateboard down the ramp', quote: '"I can skateboard down the ramp."' },
  { kind: 'can', icon: '⛸️', rest: 'ice skate backwards', quote: '"I can ice skate backwards."' },
  { kind: 'can', icon: '🎻', rest: 'play the violin', quote: '"I can play the violin."' },
  { kind: 'can', icon: '🧩', rest: 'solve riddles quickly', quote: '"I can solve riddles quickly."' },
  { kind: 'can', icon: '🌻', rest: 'plant a garden', quote: '"I can plant a garden."' },
  { kind: 'can', icon: '🕊️', rest: 'fold paper cranes', quote: '"I can fold paper cranes."' },
  { kind: 'can', icon: '🥄', rest: 'whittle a spoon', quote: '"I can whittle a spoon."' },
  { kind: 'can', icon: '🪀', rest: 'pogo-stick across the yard', quote: '"I can pogo-stick across the yard."' },
  { kind: 'can', icon: '🤸', rest: 'do a handstand', quote: '"I can do a handstand."' },
  { kind: 'can', icon: '🥞', rest: 'flip a pancake', quote: '"I can flip a pancake."' },
  { kind: 'can', icon: '⌨️', rest: 'type very fast', quote: '"I can type very fast."' },
  { kind: 'can', icon: '👆', rest: 'read braille', quote: '"I can read braille."' },
  { kind: 'can', icon: '🖼️', rest: 'sketch realistic portraits', quote: '"I can sketch realistic portraits."' },
  { kind: 'have-pp', icon: '🏡', rest: 'built the treehouse', quote: '"I have built the treehouse."' },
  { kind: 'have-pp', icon: '🥧', rest: 'baked the pie', quote: '"I have baked the pie."' },
  { kind: 'have-pp', icon: '🚲', rest: 'sold the old bike', quote: '"I have sold the old bike."' },
  { kind: 'have-pp', icon: '💡', rest: 'bought a new lamp', quote: '"I have bought a new lamp."' },
  { kind: 'have-pp', icon: '✍️', rest: 'signed the contract', quote: '"I have signed the contract."' },
  { kind: 'have-pp', icon: '📜', rest: 'translated the letter', quote: '"I have translated the letter."' },
  { kind: 'have-pp', icon: '📐', rest: 'measured the room', quote: '"I have measured the room."' },
  { kind: 'have-pp', icon: '📚', rest: 'assembled the bookshelf', quote: '"I have assembled the bookshelf."' },
  { kind: 'have-pp', icon: '🌿', rest: 'watered the herbs', quote: '"I have watered the herbs."' },
  { kind: 'have-pp', icon: '👔', rest: 'ironed the shirts', quote: '"I have ironed the shirts."' },
  { kind: 'have-pp', icon: '🧹', rest: 'vacuumed the carpet', quote: '"I have vacuumed the carpet."' },
  { kind: 'have-pp', icon: '👞', rest: 'polished the shoes', quote: '"I have polished the shoes."' },
  { kind: 'have-pp', icon: '🚧', rest: 'mended the fence', quote: '"I have mended the fence."' },
  // ----- Bổ sung vòng mục tiêu 1000 -----
  { kind: 'am-adj', icon: '🥲', rest: 'nostalgic', quote: '"I am nostalgic."' },
  { kind: 'am-adj', icon: '🤩', rest: 'ecstatic', quote: '"I am ecstatic."' },
  { kind: 'am-adj', icon: '😠', rest: 'livid', quote: '"I am livid."' },
  { kind: 'am-adj', icon: '😳', rest: 'mortified', quote: '"I am mortified."' },
  { kind: 'am-adj', icon: '😵‍💫', rest: 'bewildered', quote: '"I am bewildered."' },
  { kind: 'am-adj', icon: '🥳', rest: 'jubilant', quote: '"I am jubilant."' },
  { kind: 'am-adj', icon: '😔', rest: 'forlorn', quote: '"I am forlorn."' },
  { kind: 'am-adj', icon: '🤸', rest: 'exuberant', quote: '"I am exuberant."' },
  { kind: 'am-adj', icon: '😬', rest: 'tense', quote: '"I am tense."' },
  { kind: 'am-adj', icon: '😨', rest: 'shaken', quote: '"I am shaken."' },
  { kind: 'am-adj', icon: '😩', rest: 'weary', quote: '"I am weary."' },
  { kind: 'am-adj', icon: '💪', rest: 'invigorated', quote: '"I am invigorated."' },
  { kind: 'am-ving', icon: '🏷️', rest: 'labeling the jars', quote: '"I am labeling the jars."' },
  { kind: 'am-ving', icon: '🍴', rest: 'polishing the silverware', quote: '"I am polishing the silverware."' },
  { kind: 'am-ving', icon: '📦', rest: 'stacking the boxes', quote: '"I am stacking the boxes."' },
  { kind: 'am-ving', icon: '🎣', rest: 'mending the net', quote: '"I am mending the net."' },
  { kind: 'am-ving', icon: '✏️', rest: 'sharpening the pencils', quote: '"I am sharpening the pencils."' },
  { kind: 'am-ving', icon: '🎁', rest: 'wrapping the gifts', quote: '"I am wrapping the gifts."' },
  { kind: 'am-ving', icon: '🎹', rest: 'dusting the piano', quote: '"I am dusting the piano."' },
  { kind: 'am-ving', icon: '🌿', rest: 'trimming the bushes', quote: '"I am trimming the bushes."' },
  { kind: 'am-ving', icon: '🐔', rest: 'feeding the chickens', quote: '"I am feeding the chickens."' },
  { kind: 'am-ving', icon: '🐄', rest: 'milking the cow', quote: '"I am milking the cow."' },
  { kind: 'am-ving', icon: '🌽', rest: 'harvesting the corn', quote: '"I am harvesting the corn."' },
  { kind: 'am-ving', icon: '🐐', rest: 'herding the goats', quote: '"I am herding the goats."' },
  { kind: 'present-verb', icon: '🌶️', past: 'craved', s3: 'craves', rest: 'spicy food', quote: '"I crave spicy food."' },
  { kind: 'present-verb', icon: '🤨', past: 'doubted', s3: 'doubts', rest: 'his story', quote: '"I doubt his story."' },
  { kind: 'present-verb', icon: '💎', past: 'valued', s3: 'values', rest: 'honesty above all', quote: '"I value honesty above all."' },
  { kind: 'present-verb', icon: '💭', past: 'treasured', s3: 'treasures', rest: 'these memories', quote: '"I treasure these memories."' },
  { kind: 'present-verb', icon: '😩', past: 'dreaded', s3: 'dreads', rest: 'Monday mornings', quote: '"I dread Monday mornings."' },
  { kind: 'present-verb', icon: '🍲', past: 'adored', s3: 'adores', rest: 'homemade soup', quote: '"I adore homemade soup."' },
  { kind: 'present-verb', icon: '😤', past: 'resented', s3: 'resents', rest: 'being ignored', quote: '"I resent being ignored."' },
  { kind: 'present-verb', icon: '😒', past: 'envied', s3: 'envies', rest: 'her confidence', quote: '"I envy her confidence."' },
  { kind: 'present-verb', icon: '🤔', past: 'suspected', s3: 'suspects', rest: 'something is wrong', quote: '"I suspect something is wrong."' },
  { kind: 'present-verb', icon: '🤷', past: 'assumed', s3: 'assumes', rest: 'you already know', quote: '"I assume you already know."' },
  { kind: 'present-verb', icon: '😔', past: 'regretted', s3: 'regrets', rest: 'that decision', quote: '"I regret that decision."' },
  { kind: 'present-verb', icon: '🤝', past: 'cherished', s3: 'cherishes', rest: 'our friendship', quote: '"I cherish our friendship."' },
  { kind: 'will', icon: '🗄️', rest: 'organize the pantry', quote: '"I will organize the pantry."' },
  { kind: 'will', icon: '🏷️', rest: 'label the boxes', quote: '"I will label the boxes."' },
  { kind: 'will', icon: '🧹', rest: 'sweep the basement', quote: '"I will sweep the basement."' },
  { kind: 'will', icon: '🌱', rest: 'water the seedlings', quote: '"I will water the seedlings."' },
  { kind: 'will', icon: '🌿', rest: 'trim the bushes', quote: '"I will trim the bushes."' },
  { kind: 'will', icon: '🐔', rest: 'feed the chickens', quote: '"I will feed the chickens."' },
  { kind: 'will', icon: '🧺', rest: 'mop the porch', quote: '"I will mop the porch."' },
  { kind: 'will', icon: '🔋', rest: 'charge the tablet', quote: '"I will charge the tablet."' },
  { kind: 'will', icon: '📦', rest: 'restock the shelves', quote: '"I will restock the shelves."' },
  { kind: 'will', icon: '🔓', rest: 'unlock the gate', quote: '"I will unlock the gate."' },
  { kind: 'will', icon: '🔕', rest: 'silence the alarm', quote: '"I will silence the alarm."' },
  { kind: 'will', icon: '📅', rest: 'schedule the appointment', quote: '"I will schedule the appointment."' },
  { kind: 'can', icon: '🎶', rest: 'yodel a tune', quote: '"I can yodel a tune."' },
  { kind: 'can', icon: '🤸', rest: 'somersault off the diving board', quote: '"I can somersault off the diving board."' },
  { kind: 'can', icon: '🕺', rest: 'moonwalk across the stage', quote: '"I can moonwalk across the stage."' },
  { kind: 'can', icon: '🎤', rest: 'freestyle rap for a minute', quote: '"I can freestyle rap for a minute."' },
  { kind: 'can', icon: '🛹', rest: 'ride a skateboard backwards', quote: '"I can ride a skateboard backwards."' },
  { kind: 'can', icon: '📚', rest: 'balance a book on my head', quote: '"I can balance a book on my head."' },
  { kind: 'can', icon: '🍬', rest: 'blow a big bubble gum bubble', quote: '"I can blow a big bubble gum bubble."' },
  { kind: 'can', icon: '🤸', rest: 'do the splits', quote: '"I can do the splits."' },
  { kind: 'can', icon: '💃', rest: 'tap dance', quote: '"I can tap dance."' },
  { kind: 'can', icon: '🎵', rest: 'harmonize in three parts', quote: '"I can harmonize in three parts."' },
  { kind: 'can', icon: '🪶', rest: 'whittle a bird', quote: '"I can whittle a bird."' },
  { kind: 'can', icon: '🧶', rest: 'braid three strands at once', quote: '"I can braid three strands at once."' },
  { kind: 'have-pp', icon: '🗄️', rest: 'organized the pantry', quote: '"I have organized the pantry."' },
  { kind: 'have-pp', icon: '🏷️', rest: 'labeled the boxes', quote: '"I have labeled the boxes."' },
  { kind: 'have-pp', icon: '🧹', rest: 'swept the basement', quote: '"I have swept the basement."' },
  { kind: 'have-pp', icon: '📦', rest: 'restocked the shelves', quote: '"I have restocked the shelves."' },
  { kind: 'have-pp', icon: '🔓', rest: 'unlocked the gate', quote: '"I have unlocked the gate."' },
  { kind: 'have-pp', icon: '🔕', rest: 'silenced the alarm', quote: '"I have silenced the alarm."' },
  { kind: 'have-pp', icon: '📅', rest: 'scheduled the appointment', quote: '"I have scheduled the appointment."' },
  { kind: 'have-pp', icon: '🌱', rest: 'watered the seedlings', quote: '"I have watered the seedlings."' },
  { kind: 'have-pp', icon: '🌿', rest: 'trimmed the bushes', quote: '"I have trimmed the bushes."' },
  { kind: 'have-pp', icon: '🐔', rest: 'fed the chickens', quote: '"I have fed the chickens."' },
  { kind: 'have-pp', icon: '🧺', rest: 'mopped the porch', quote: '"I have mopped the porch."' },
  { kind: 'have-pp', icon: '🔋', rest: 'charged the tablet', quote: '"I have charged the tablet."' },
];

for (const template of REPORTED_TEMPLATES) {
  for (const reporter of REPORTED_REPORTERS) {
    REPORTED_SPEECH_SCENARIOS.push(expandReportedTemplate(template, reporter));
  }
}

function buildReportedSentence(scenario, key) {
  switch (key) {
    case 'correct':
      return scenario.correct;
    case 'no-backshift':
      return scenario.noBackshift;
    case 'wrong-pronoun':
      return scenario.wrongPronoun;
    case 'wrong-reporting-verb':
    default:
      return scenario.wrongReportingVerb;
  }
}

/** 1 vòng: chọn 1 tình huống, sinh 4 câu (đúng 'correct' + 3 lỗi thường gặp). */
export function makeReportedRound(rng = Math.random) {
  const scenario = pick(REPORTED_SPEECH_SCENARIOS, rng);
  const keys = ['correct', 'no-backshift', 'wrong-pronoun', 'wrong-reporting-verb'];
  const options = shuffle(keys, rng).map((key) => ({
    key,
    sentence: buildReportedSentence(scenario, key),
  }));
  return { scenario, options, correctKey: 'correct' };
}

export function makeReportedGame(count = 8, rng = Math.random) {
  const rounds = [];
  for (let i = 0; i < count; i++) rounds.push(makeReportedRound(rng));
  return baseGameState(rounds);
}

export function currentReportedRound(game) {
  return currentRoundOf(game);
}

export function answerReported(game, key) {
  return answerGeneric(game, key, (round) => round.correctKey);
}

/* ===== 10. Lượng Từ Đúng (All/Some/None/Every) ===== */

export const QUANTIFIER_NOUNS = [
  { emoji: '🍎', plural: 'apples' },
  { emoji: '⭐', plural: 'stars' },
  { emoji: '📖', plural: 'books' },
  { emoji: '🌸', plural: 'flowers' },
  { emoji: '⚽', plural: 'balls' },
  { emoji: '🚗', plural: 'cars' },
  { emoji: '🎈', plural: 'balloons' },
  { emoji: '🐟', plural: 'fish' },
  { emoji: '🍪', plural: 'cookies' },
  { emoji: '🎁', plural: 'presents' },
  { emoji: '🦋', plural: 'butterflies' },
  { emoji: '🍓', plural: 'strawberries' },
  { emoji: '🔑', plural: 'keys' },
  { emoji: '🎨', plural: 'paint brushes' },
  // animals
  { emoji: '🐶', plural: 'dogs' },
  { emoji: '🐱', plural: 'cats' },
  { emoji: '🦁', plural: 'lions' },
  { emoji: '🐯', plural: 'tigers' },
  { emoji: '🐻', plural: 'bears' },
  { emoji: '🐵', plural: 'monkeys' },
  { emoji: '🐼', plural: 'pandas' },
  { emoji: '🦊', plural: 'foxes' },
  { emoji: '🐺', plural: 'wolves' },
  { emoji: '🦌', plural: 'deer' },
  { emoji: '🐴', plural: 'horses' },
  { emoji: '🐮', plural: 'cows' },
  { emoji: '🐷', plural: 'pigs' },
  { emoji: '🦆', plural: 'ducks' },
  { emoji: '🐔', plural: 'chickens' },
  { emoji: '🐐', plural: 'goats' },
  { emoji: '🐭', plural: 'mice' },
  { emoji: '🦉', plural: 'owls' },
  { emoji: '🦅', plural: 'eagles' },
  { emoji: '🐧', plural: 'penguins' },
  { emoji: '🐨', plural: 'koalas' },
  { emoji: '🦘', plural: 'kangaroos' },
  { emoji: '🦓', plural: 'zebras' },
  { emoji: '🦒', plural: 'giraffes' },
  { emoji: '🦛', plural: 'hippos' },
  { emoji: '🦏', plural: 'rhinos' },
  { emoji: '🐊', plural: 'crocodiles' },
  { emoji: '🐢', plural: 'turtles' },
  { emoji: '🐸', plural: 'frogs' },
  { emoji: '🐍', plural: 'snakes' },
  { emoji: '🕷️', plural: 'spiders' },
  { emoji: '🐝', plural: 'bees' },
  { emoji: '🐜', plural: 'ants' },
  { emoji: '🐌', plural: 'snails' },
  { emoji: '🐞', plural: 'ladybugs' },
  { emoji: '🐬', plural: 'dolphins' },
  { emoji: '🐳', plural: 'whales' },
  { emoji: '🦈', plural: 'sharks' },
  { emoji: '🐙', plural: 'octopuses' },
  { emoji: '🦀', plural: 'crabs' },
  { emoji: '🐫', plural: 'camels' },
  // foods
  { emoji: '🍌', plural: 'bananas' },
  { emoji: '🍊', plural: 'oranges' },
  { emoji: '🍇', plural: 'grapes' },
  { emoji: '🍉', plural: 'watermelons' },
  { emoji: '🍑', plural: 'peaches' },
  { emoji: '🍍', plural: 'pineapples' },
  { emoji: '🥭', plural: 'mangoes' },
  { emoji: '🍒', plural: 'cherries' },
  { emoji: '🍋', plural: 'lemons' },
  { emoji: '🍐', plural: 'pears' },
  { emoji: '🥝', plural: 'kiwis' },
  { emoji: '🍅', plural: 'tomatoes' },
  { emoji: '🥕', plural: 'carrots' },
  { emoji: '🥔', plural: 'potatoes' },
  { emoji: '🧅', plural: 'onions' },
  { emoji: '🌶️', plural: 'peppers' },
  { emoji: '🥒', plural: 'cucumbers' },
  { emoji: '🍄', plural: 'mushrooms' },
  { emoji: '🥜', plural: 'peanuts' },
  { emoji: '🥐', plural: 'croissants' },
  { emoji: '🥚', plural: 'eggs' },
  { emoji: '🥞', plural: 'pancakes' },
  { emoji: '🧇', plural: 'waffles' },
  { emoji: '🍕', plural: 'pizzas' },
  { emoji: '🍔', plural: 'hamburgers' },
  { emoji: '🌭', plural: 'hotdogs' },
  { emoji: '🥪', plural: 'sandwiches' },
  { emoji: '🌮', plural: 'tacos' },
  { emoji: '🌯', plural: 'burritos' },
  { emoji: '🥟', plural: 'dumplings' },
  { emoji: '🍩', plural: 'donuts' },
  { emoji: '🧁', plural: 'cupcakes' },
  { emoji: '🍰', plural: 'cakes' },
  { emoji: '🥧', plural: 'pies' },
  { emoji: '🍬', plural: 'candies' },
  { emoji: '🍫', plural: 'chocolates' },
  { emoji: '🍭', plural: 'lollipops' },
  { emoji: '🥨', plural: 'pretzels' },
  { emoji: '🥤', plural: 'milkshakes' },
  { emoji: '🧀', plural: 'cheese slices' },
  // toys/school
  { emoji: '🧸', plural: 'teddy bears' },
  { emoji: '🪁', plural: 'kites' },
  { emoji: '🤖', plural: 'robots' },
  { emoji: '🧱', plural: 'blocks' },
  { emoji: '🧩', plural: 'puzzles' },
  { emoji: '🥁', plural: 'drums' },
  { emoji: '🪀', plural: 'yo-yos' },
  { emoji: '🎲', plural: 'dice' },
  { emoji: '🃏', plural: 'playing cards' },
  { emoji: '✏️', plural: 'pencils' },
  { emoji: '🖍️', plural: 'crayons' },
  { emoji: '📏', plural: 'rulers' },
  { emoji: '✂️', plural: 'scissors' },
  { emoji: '🎒', plural: 'backpacks' },
  { emoji: '📓', plural: 'notebooks' },
  { emoji: '🌐', plural: 'globes' },
  { emoji: '🔭', plural: 'telescopes' },
  { emoji: '🔬', plural: 'microscopes' },
  { emoji: '🖊️', plural: 'markers' },
  { emoji: '🧮', plural: 'calculators' },
  { emoji: '🎺', plural: 'trumpets' },
  { emoji: '🎸', plural: 'guitars' },
  { emoji: '🎻', plural: 'violins' },
  { emoji: '🎹', plural: 'pianos' },
  { emoji: '🏀', plural: 'basketballs' },
  // vehicles
  { emoji: '🚚', plural: 'trucks' },
  { emoji: '🚌', plural: 'buses' },
  { emoji: '🚲', plural: 'bicycles' },
  { emoji: '🏍️', plural: 'motorcycles' },
  { emoji: '🚂', plural: 'trains' },
  { emoji: '✈️', plural: 'airplanes' },
  { emoji: '🚁', plural: 'helicopters' },
  { emoji: '⛵', plural: 'boats' },
  { emoji: '🚢', plural: 'ships' },
  { emoji: '🚀', plural: 'rockets' },
  { emoji: '🚜', plural: 'tractors' },
  { emoji: '🚑', plural: 'ambulances' },
  { emoji: '🚒', plural: 'fire trucks' },
  { emoji: '🚕', plural: 'taxis' },
  { emoji: '🛴', plural: 'scooters' },
  // nature
  { emoji: '🌳', plural: 'trees' },
  { emoji: '🍁', plural: 'leaves' },
  { emoji: '🌰', plural: 'pinecones' },
  { emoji: '☁️', plural: 'clouds' },
  { emoji: '🌈', plural: 'rainbows' },
  { emoji: '❄️', plural: 'snowflakes' },
  { emoji: '💧', plural: 'raindrops' },
  { emoji: '⛰️', plural: 'mountains' },
  { emoji: '🌋', plural: 'volcanoes' },
  { emoji: '🏝️', plural: 'islands' },
  { emoji: '🌵', plural: 'cactuses' },
  { emoji: '🌻', plural: 'sunflowers' },
  { emoji: '🌷', plural: 'tulips' },
  { emoji: '🌹', plural: 'roses' },
  { emoji: '🪨', plural: 'rocks' },
  { emoji: '🐚', plural: 'shells' },
  { emoji: '🌱', plural: 'seedlings' },
  { emoji: '🪐', plural: 'planets' },
  { emoji: '🌙', plural: 'moons' },
  { emoji: '☄️', plural: 'comets' },
  // household
  { emoji: '☕', plural: 'cups' },
  { emoji: '🥄', plural: 'spoons' },
  { emoji: '🍴', plural: 'forks' },
  { emoji: '🥣', plural: 'bowls' },
  { emoji: '🍳', plural: 'frying pans' },
  { emoji: '🍼', plural: 'bottles' },
  { emoji: '🫙', plural: 'jars' },
  { emoji: '🕯️', plural: 'candles' },
  { emoji: '💡', plural: 'lamps' },
  { emoji: '🪞', plural: 'mirrors' },
  { emoji: '🧹', plural: 'brooms' },
  { emoji: '🪣', plural: 'buckets' },
  { emoji: '☂️', plural: 'umbrellas' },
  { emoji: '🧦', plural: 'socks' },
  { emoji: '👟', plural: 'shoes' },
  { emoji: '🎩', plural: 'hats' },
  { emoji: '🧤', plural: 'gloves' },
  { emoji: '🛏️', plural: 'pillows' },
  { emoji: '🧻', plural: 'napkins' },
  { emoji: '🧣', plural: 'scarves' },
  // clothes
  { emoji: '👕', plural: 't-shirts' },
  { emoji: '👗', plural: 'dresses' },
  { emoji: '🧥', plural: 'jackets' },
  { emoji: '👑', plural: 'crowns' },
  { emoji: '🕶️', plural: 'sunglasses' },
  { emoji: '💍', plural: 'rings' },
  { emoji: '📿', plural: 'necklaces' },
  { emoji: '⌚', plural: 'watches' },
  { emoji: '🎀', plural: 'ribbons' },
  { emoji: '👢', plural: 'boots' },
  { emoji: '👜', plural: 'handbags' },
  { emoji: '🧢', plural: 'caps' },
  { emoji: '👔', plural: 'ties' },
  { emoji: '😷', plural: 'masks' },
  { emoji: '🥋', plural: 'belts' },
  // sports
  { emoji: '🏈', plural: 'footballs' },
  { emoji: '🏓', plural: 'paddles' },
  { emoji: '🏸', plural: 'badminton rackets' },
  { emoji: '⛳', plural: 'golf clubs' },
  { emoji: '🏒', plural: 'hockey sticks' },
  { emoji: '🛹', plural: 'skateboards' },
  { emoji: '🏄', plural: 'surfboards' },
  { emoji: '🏅', plural: 'medals' },
  { emoji: '🏆', plural: 'trophies' },
  { emoji: '🚩', plural: 'flags' },
  { emoji: '🎯', plural: 'target boards' },
  { emoji: '🏋️', plural: 'dumbbells' },
  { emoji: '🥊', plural: 'boxing gloves' },
  { emoji: '🎳', plural: 'bowling pins' },
  { emoji: '🛼', plural: 'roller skates' },
  { emoji: '🦟', plural: 'mosquitoes' },
  { emoji: '🦗', plural: 'crickets' },
  { emoji: '🪱', plural: 'worms' },
  { emoji: '🦂', plural: 'scorpions' },
  { emoji: '🪳', plural: 'cockroaches' },
  { emoji: '🪰', plural: 'flies' },
  { emoji: '🦐', plural: 'shrimp' },
  { emoji: '🦑', plural: 'squids' },
  { emoji: '🦞', plural: 'lobsters' },
  { emoji: '🦪', plural: 'oysters' },
  { emoji: '🍡', plural: 'dango skewers' },
  { emoji: '🍣', plural: 'sushi rolls' },
  { emoji: '🍙', plural: 'rice balls' },
  { emoji: '🍛', plural: 'curry bowls' },
  { emoji: '🍜', plural: 'ramen bowls' },
  { emoji: '🍝', plural: 'spaghetti plates' },
  { emoji: '🍤', plural: 'fried shrimp' },
  { emoji: '🥠', plural: 'fortune cookies' },
  { emoji: '🥮', plural: 'moon cakes' },
  { emoji: '🫓', plural: 'flatbreads' },
  { emoji: '🍢', plural: 'skewers' },
  { emoji: '🍥', plural: 'fish cakes' },
  { emoji: '🍧', plural: 'shaved ice cups' },
  { emoji: '🍮', plural: 'puddings' },
  { emoji: '🍨', plural: 'ice cream cups' },
  { emoji: '🍦', plural: 'ice cream cones' },
  { emoji: '🎷', plural: 'saxophones' },
  { emoji: '🪗', plural: 'accordions' },
  { emoji: '🪕', plural: 'banjos' },
  { emoji: '🎤', plural: 'microphones' },
  { emoji: '🎧', plural: 'headphones' },
  { emoji: '🔨', plural: 'hammers' },
  { emoji: '🪛', plural: 'screwdrivers' },
  { emoji: '🔧', plural: 'wrenches' },
  { emoji: '⛏️', plural: 'pickaxes' },
  { emoji: '🪚', plural: 'saws' },
  { emoji: '🧰', plural: 'toolboxes' },
  { emoji: '🪜', plural: 'ladders' },
  { emoji: '🧲', plural: 'magnets' },
  { emoji: '🔦', plural: 'flashlights' },
  { emoji: '🪓', plural: 'axes' },
  { emoji: '🔪', plural: 'knives' },
  { emoji: '🍽️', plural: 'dinner plates' },
  { emoji: '🫖', plural: 'teapots' },
  { emoji: '🧊', plural: 'ice cubes' },
  { emoji: '🧂', plural: 'salt shakers' },
  { emoji: '🍯', plural: 'honey jars' },
  { emoji: '⚾', plural: 'baseballs' },
  { emoji: '🎾', plural: 'tennis balls' },
  { emoji: '🏐', plural: 'volleyballs' },
  { emoji: '🥍', plural: 'lacrosse sticks' },
  { emoji: '🏰', plural: 'castles' },
  { emoji: '🏯', plural: 'pagodas' },
  { emoji: '🕌', plural: 'mosques' },
  { emoji: '⛪', plural: 'churches' },
  { emoji: '🏟️', plural: 'stadiums' },
  { emoji: '🏛️', plural: 'courthouses' },
  { emoji: '🏭', plural: 'factories' },
  { emoji: '🏘️', plural: 'townhouses' },
  { emoji: '🗼', plural: 'towers' },
  { emoji: '⛺', plural: 'tents' },
  { emoji: '🔺', plural: 'triangles' },
  { emoji: '🔷', plural: 'blue diamonds' },
  { emoji: '🔶', plural: 'orange diamonds' },
  { emoji: '⚫', plural: 'black circles' },
  { emoji: '⬛', plural: 'black squares' },
  { emoji: '🔴', plural: 'red circles' },
  { emoji: '🟢', plural: 'green circles' },
  { emoji: '🟣', plural: 'purple circles' },
  { emoji: '🟡', plural: 'yellow circles' },
  { emoji: '💻', plural: 'laptops' },
  { emoji: '🖥️', plural: 'desktop computers' },
  { emoji: '🖨️', plural: 'printers' },
  { emoji: '📷', plural: 'cameras' },
  { emoji: '📹', plural: 'video cameras' },
  { emoji: '🎮', plural: 'game controllers' },
  { emoji: '🕹️', plural: 'joysticks' },
  { emoji: '📻', plural: 'radios' },
  { emoji: '⌨️', plural: 'keyboards' },
  { emoji: '🖱️', plural: 'computer mice' },
  { emoji: '🌴', plural: 'palm trees' },
  { emoji: '🎄', plural: 'pine trees' },
  { emoji: '🌾', plural: 'wheat stalks' },
  { emoji: '🌿', plural: 'herb sprigs' },
  { emoji: '☘️', plural: 'clovers' },
  { emoji: '🪴', plural: 'potted plants' },
  { emoji: '🌪️', plural: 'tornadoes' },
  { emoji: '⚡', plural: 'lightning bolts' },
  { emoji: '🌊', plural: 'ocean waves' },
  { emoji: '🔥', plural: 'flames' },
  { emoji: '👒', plural: 'sun hats' },
  { emoji: '🩳', plural: 'shorts' },
  { emoji: '👞', plural: 'dress shoes' },
  { emoji: '👡', plural: 'sandals' },
  { emoji: '🛶', plural: 'canoes' },
  { emoji: '🚡', plural: 'cable cars' },
  { emoji: '🚝', plural: 'monorails' },
  { emoji: '🛺', plural: 'rickshaws' },
  { emoji: '🚠', plural: 'gondola lifts' },
  { emoji: '📎', plural: 'paper clips' },
  { emoji: '📌', plural: 'push pins' },
  { emoji: '📐', plural: 'set squares' },
  { emoji: '🗃️', plural: 'file boxes' },
  { emoji: '🎃', plural: 'pumpkins' },
  { emoji: '🎆', plural: 'fireworks' },
  { emoji: '🧧', plural: 'red envelopes' },
  { emoji: '🎊', plural: 'confetti balls' },
  { emoji: '🎉', plural: 'party poppers' },
  { emoji: '🎗️', plural: 'ribbon badges' },
  { emoji: '🏵️', plural: 'rosettes' },
  { emoji: '🎏', plural: 'koi banners' },
  { emoji: '🦔', plural: 'hedgehogs' },
  { emoji: '🦥', plural: 'sloths' },
  { emoji: '🦦', plural: 'otters' },
  { emoji: '🦨', plural: 'skunks' },
  { emoji: '🦡', plural: 'badgers' },
  { emoji: '🦫', plural: 'beavers' },
  { emoji: '🦣', plural: 'mammoths' },
  { emoji: '🦭', plural: 'seals' },
  { emoji: '🦤', plural: 'dodos' },
  { emoji: '🦝', plural: 'raccoons' },
  { emoji: '🦚', plural: 'peacocks' },
  { emoji: '🦜', plural: 'parrots' },
  { emoji: '🦢', plural: 'swans' },
  { emoji: '🦩', plural: 'flamingos' },
  { emoji: '🦎', plural: 'lizards' },
  { emoji: '🐀', plural: 'rats' },
  { emoji: '🐹', plural: 'hamsters' },
  { emoji: '🐰', plural: 'rabbits' },
  { emoji: '🐇', plural: 'wild rabbits' },
  { emoji: '🐈', plural: 'house cats' },
  { emoji: '🐩', plural: 'poodles' },
  { emoji: '🐕‍🦺', plural: 'service dogs' },
  { emoji: '🦙', plural: 'llamas' },
  { emoji: '🐂', plural: 'oxen' },
  { emoji: '🐃', plural: 'buffalos' },
  { emoji: '🐄', plural: 'dairy cows' },
  { emoji: '🐖', plural: 'hogs' },
  { emoji: '🐏', plural: 'rams' },
  { emoji: '🐑', plural: 'ewes' },
  { emoji: '🐎', plural: 'racehorses' },
  { emoji: '🦄', plural: 'unicorns' },
  { emoji: '🐉', plural: 'dragons' },
  { emoji: '🐲', plural: 'baby dragons' },
  { emoji: '🦕', plural: 'long-neck dinosaurs' },
  { emoji: '🦖', plural: 't-rex dinosaurs' },
  { emoji: '🦇', plural: 'bats' },
  { emoji: '🐛', plural: 'caterpillars' },
  { emoji: '🇻🇳', plural: 'Vietnamese flags' },
  { emoji: '🇯🇵', plural: 'Japanese flags' },
  { emoji: '🇰🇷', plural: 'Korean flags' },
  { emoji: '🇨🇳', plural: 'Chinese flags' },
  { emoji: '🇺🇸', plural: 'American flags' },
  { emoji: '🇬🇧', plural: 'British flags' },
  { emoji: '🇫🇷', plural: 'French flags' },
  { emoji: '🇩🇪', plural: 'German flags' },
  { emoji: '🇮🇹', plural: 'Italian flags' },
  { emoji: '🇪🇸', plural: 'Spanish flags' },
  { emoji: '🇧🇷', plural: 'Brazilian flags' },
  { emoji: '🇨🇦', plural: 'Canadian flags' },
  { emoji: '🇦🇺', plural: 'Australian flags' },
  { emoji: '🇮🇳', plural: 'Indian flags' },
  { emoji: '🇹🇭', plural: 'Thai flags' },
  { emoji: '🇸🇬', plural: 'Singaporean flags' },
  { emoji: '🇲🇾', plural: 'Malaysian flags' },
  { emoji: '🇮🇩', plural: 'Indonesian flags' },
  { emoji: '🇵🇭', plural: 'Philippine flags' },
  { emoji: '🇱🇦', plural: 'Laotian flags' },
  { emoji: '🇰🇭', plural: 'Cambodian flags' },
  { emoji: '🇲🇽', plural: 'Mexican flags' },
  { emoji: '🇳🇱', plural: 'Dutch flags' },
  { emoji: '🇨🇭', plural: 'Swiss flags' },
  { emoji: '🇬🇷', plural: 'Greek flags' },
  { emoji: '🇹🇷', plural: 'Turkish flags' },
  { emoji: '🇦🇷', plural: 'Argentine flags' },
  { emoji: '🇳🇿', plural: 'New Zealand flags' },
  { emoji: '🇸🇪', plural: 'Swedish flags' },
  { emoji: '🇳🇴', plural: 'Norwegian flags' },
  { emoji: '🇫🇮', plural: 'Finnish flags' },
  { emoji: '🇩🇰', plural: 'Danish flags' },
  { emoji: '🇵🇱', plural: 'Polish flags' },
  { emoji: '🇮🇪', plural: 'Irish flags' },
  { emoji: '🇵🇹', plural: 'Portuguese flags' },
  { emoji: '🇦🇹', plural: 'Austrian flags' },
  { emoji: '🇧🇪', plural: 'Belgian flags' },
  { emoji: '🇿🇦', plural: 'South African flags' },
  { emoji: '🇪🇬', plural: 'Egyptian flags' },
  { emoji: '🇸🇦', plural: 'Saudi flags' },
  { emoji: '🫒', plural: 'olives' },
  { emoji: '🫑', plural: 'bell peppers' },
  { emoji: '🫘', plural: 'beans' },
  { emoji: '🫐', plural: 'blueberries' },
  { emoji: '🍈', plural: 'melons' },
  { emoji: '🍏', plural: 'green apples' },
  { emoji: '🥥', plural: 'coconuts' },
  { emoji: '🍗', plural: 'chicken drumsticks' },
  { emoji: '🥩', plural: 'steaks' },
  { emoji: '🥓', plural: 'bacon strips' },
  { emoji: '🍟', plural: 'french fries' },
  { emoji: '🥗', plural: 'side salads' },
  { emoji: '🛎️', plural: 'service bells' },
  { emoji: '🧴', plural: 'lotion bottles' },
  { emoji: '🧽', plural: 'sponges' },
  { emoji: '🪒', plural: 'razors' },
  { emoji: '🛁', plural: 'bathtubs' },
  { emoji: '🚪', plural: 'front doors' },
  { emoji: '🪟', plural: 'glass windows' },
  { emoji: '🛋️', plural: 'couches' },
  { emoji: '🪑', plural: 'stools' },
  { emoji: '🖼️', plural: 'wall frames' },
  { emoji: '🕰️', plural: 'mantel clocks' },
  { emoji: '🪆', plural: 'nesting dolls' },
  { emoji: '🌤️', plural: 'sunny clouds' },
  { emoji: '⛅', plural: 'partly cloudy skies' },
  { emoji: '🌦️', plural: 'rain clouds' },
  { emoji: '🌧️', plural: 'storm clouds' },
  { emoji: '⛈️', plural: 'thunderclouds' },
  { emoji: '🌫️', plural: 'foggy patches' },
  { emoji: '🌬️', plural: 'wind gusts' },
  { emoji: '☔', plural: 'rain umbrellas' },
  { emoji: '🥾', plural: 'hiking boots' },
  { emoji: '👘', plural: 'kimonos' },
  { emoji: '🥻', plural: 'sarees' },
  { emoji: '🧕', plural: 'headscarves' },
  { emoji: '🩱', plural: 'swimsuits' },
  { emoji: '🥼', plural: 'lab coats' },
  { emoji: '🚓', plural: 'police cars' },
  { emoji: '🚔', plural: 'patrol cars' },
  { emoji: '🚐', plural: 'vans' },
  { emoji: '🚟', plural: 'suspension trains' },
  { emoji: '🛳️', plural: 'ferries' },
  { emoji: '⛴️', plural: 'ferry boats' },
  { emoji: '🚤', plural: 'speedboats' },
  { emoji: '🛥️', plural: 'motor yachts' },
  { emoji: '🇷🇺', plural: 'Russian flags' },
  { emoji: '🇺🇦', plural: 'Ukrainian flags' },
  { emoji: '🇮🇱', plural: 'Israeli flags' },
  { emoji: '🇦🇪', plural: 'Emirati flags' },
  { emoji: '🇶🇦', plural: 'Qatari flags' },
  { emoji: '🇰🇼', plural: 'Kuwaiti flags' },
  { emoji: '🇯🇴', plural: 'Jordanian flags' },
  { emoji: '🇱🇧', plural: 'Lebanese flags' },
  { emoji: '🇲🇦', plural: 'Moroccan flags' },
  { emoji: '🇩🇿', plural: 'Algerian flags' },
  { emoji: '🇹🇳', plural: 'Tunisian flags' },
  { emoji: '🇰🇪', plural: 'Kenyan flags' },
  { emoji: '🇳🇬', plural: 'Nigerian flags' },
  { emoji: '🇬🇭', plural: 'Ghanaian flags' },
  { emoji: '🇪🇹', plural: 'Ethiopian flags' },
  { emoji: '🇨🇴', plural: 'Colombian flags' },
  { emoji: '🇵🇪', plural: 'Peruvian flags' },
  { emoji: '🇨🇱', plural: 'Chilean flags' },
  { emoji: '🇻🇪', plural: 'Venezuelan flags' },
  { emoji: '🇪🇨', plural: 'Ecuadorian flags' },
  { emoji: '🇺🇾', plural: 'Uruguayan flags' },
  { emoji: '🇵🇾', plural: 'Paraguayan flags' },
  { emoji: '🇧🇴', plural: 'Bolivian flags' },
  { emoji: '🇨🇺', plural: 'Cuban flags' },
  { emoji: '🇯🇲', plural: 'Jamaican flags' },
  { emoji: '🇭🇹', plural: 'Haitian flags' },
  { emoji: '🇩🇴', plural: 'Dominican flags' },
  { emoji: '🇵🇰', plural: 'Pakistani flags' },
  { emoji: '🇧🇩', plural: 'Bangladeshi flags' },
  { emoji: '🇱🇰', plural: 'Sri Lankan flags' },
  { emoji: '🇳🇵', plural: 'Nepali flags' },
  { emoji: '🇲🇲', plural: 'Burmese flags' },
  { emoji: '🇲🇳', plural: 'Mongolian flags' },
  { emoji: '🇰🇿', plural: 'Kazakh flags' },
  { emoji: '🇮🇸', plural: 'Icelandic flags' },
  { emoji: '🇭🇺', plural: 'Hungarian flags' },
  { emoji: '🇨🇿', plural: 'Czech flags' },
  { emoji: '🇸🇰', plural: 'Slovak flags' },
  { emoji: '🇷🇴', plural: 'Romanian flags' },
  { emoji: '🇧🇬', plural: 'Bulgarian flags' },
  { emoji: '🇭🇷', plural: 'Croatian flags' },
  { emoji: '🇷🇸', plural: 'Serbian flags' },
  { emoji: '🧵', plural: 'sewing threads' },
  { emoji: '🪡', plural: 'sewing needles' },
  { emoji: '🧶', plural: 'yarn balls' },
  { emoji: '🪢', plural: 'rope knots' },
  { emoji: '🧿', plural: 'evil eye charms' },
  { emoji: '🔮', plural: 'crystal balls' },
  { emoji: '🪬', plural: 'hamsa charms' },
  { emoji: '🀄', plural: 'mahjong tiles' },
  { emoji: '🪘', plural: 'djembe drums' },
  { emoji: '🪈', plural: 'flutes' },
  { emoji: '🪇', plural: 'maracas' },
  { emoji: '🎙️', plural: 'studio microphones' },
  { emoji: '📯', plural: 'postal horns' },
  { emoji: '🔔', plural: 'bells' },
  { emoji: '🔕', plural: 'muted bells' },
  { emoji: '🇻🇦', plural: 'Vatican flags' },
  { emoji: '🇱🇺', plural: 'Luxembourgish flags' },
  { emoji: '🇲🇹', plural: 'Maltese flags' },
  { emoji: '🇨🇾', plural: 'Cypriot flags' },
  { emoji: '🇲🇨', plural: 'Monegasque flags' },
  { emoji: '🇦🇩', plural: 'Andorran flags' },
  { emoji: '🇸🇲', plural: 'San Marino flags' },
  { emoji: '🇱🇮', plural: 'Liechtenstein flags' },
  { emoji: '🇧🇭', plural: 'Bahraini flags' },
  { emoji: '🇴🇲', plural: 'Omani flags' },
  { emoji: '🇾🇪', plural: 'Yemeni flags' },
  { emoji: '🇮🇶', plural: 'Iraqi flags' },
  { emoji: '🇸🇾', plural: 'Syrian flags' },
  { emoji: '🇦🇫', plural: 'Afghan flags' },
  { emoji: '🇺🇿', plural: 'Uzbek flags' },
  { emoji: '🇹🇲', plural: 'Turkmen flags' },
  { emoji: '🇰🇬', plural: 'Kyrgyz flags' },
  { emoji: '🇹🇯', plural: 'Tajik flags' },
  { emoji: '🇦🇲', plural: 'Armenian flags' },
  { emoji: '🇬🇪', plural: 'Georgian flags' },
  { emoji: '🇦🇿', plural: 'Azerbaijani flags' },
  { emoji: '🇧🇾', plural: 'Belarusian flags' },
  { emoji: '🇲🇩', plural: 'Moldovan flags' },
  { emoji: '🇱🇹', plural: 'Lithuanian flags' },
  { emoji: '🇱🇻', plural: 'Latvian flags' },
  { emoji: '🇪🇪', plural: 'Estonian flags' },
  { emoji: '🇸🇮', plural: 'Slovenian flags' },
  { emoji: '🇦🇱', plural: 'Albanian flags' },
  { emoji: '🇲🇰', plural: 'Macedonian flags' },
  { emoji: '🇧🇦', plural: 'Bosnian flags' },
  { emoji: '🇲🇪', plural: 'Montenegrin flags' },
  { emoji: '🇽🇰', plural: 'Kosovan flags' },
  { emoji: '🇨🇬', plural: 'Congolese flags' },
  { emoji: '🇨🇩', plural: 'Congo DR flags' },
  { emoji: '🇺🇬', plural: 'Ugandan flags' },
  { emoji: '🇹🇿', plural: 'Tanzanian flags' },
  { emoji: '🇿🇲', plural: 'Zambian flags' },
  { emoji: '🇿🇼', plural: 'Zimbabwean flags' },
  { emoji: '🇲🇿', plural: 'Mozambican flags' },
  { emoji: '🇸🇳', plural: 'Senegalese flags' },
  { emoji: '🇨🇮', plural: 'Ivorian flags' },
  { emoji: '🇨🇲', plural: 'Cameroonian flags' },
  { emoji: '🇦🇴', plural: 'Angolan flags' },
  { emoji: '🇱🇾', plural: 'Libyan flags' },
  { emoji: '🇸🇩', plural: 'Sudanese flags' },
  { emoji: '🇸🇴', plural: 'Somali flags' },
  { emoji: '🇷🇼', plural: 'Rwandan flags' },
  { emoji: '🇲🇼', plural: 'Malawian flags' },
  { emoji: '🇧🇼', plural: 'Botswanan flags' },
  { emoji: '🇳🇦', plural: 'Namibian flags' },
  { emoji: '🇬🇦', plural: 'Gabonese flags' },
  { emoji: '🇧🇯', plural: 'Beninese flags' },
  { emoji: '0️⃣', plural: 'zero keycaps' },
  { emoji: '1️⃣', plural: 'one keycaps' },
  { emoji: '2️⃣', plural: 'two keycaps' },
  { emoji: '3️⃣', plural: 'three keycaps' },
  { emoji: '4️⃣', plural: 'four keycaps' },
  { emoji: '5️⃣', plural: 'five keycaps' },
  { emoji: '6️⃣', plural: 'six keycaps' },
  { emoji: '7️⃣', plural: 'seven keycaps' },
  { emoji: '8️⃣', plural: 'eight keycaps' },
  { emoji: '9️⃣', plural: 'nine keycaps' },
  { emoji: '#️⃣', plural: 'hash keycaps' },
  { emoji: '*️⃣', plural: 'star keycaps' },
  { emoji: '🔟', plural: 'ten keycaps' },
  { emoji: '🕐', plural: 'one-oclock dials' },
  { emoji: '🕑', plural: 'two-oclock dials' },
  { emoji: '🕒', plural: 'three-oclock dials' },
  { emoji: '🕓', plural: 'four-oclock dials' },
  { emoji: '🕔', plural: 'five-oclock dials' },
  { emoji: '🕕', plural: 'six-oclock dials' },
  { emoji: '🕖', plural: 'seven-oclock dials' },
  { emoji: '🕗', plural: 'eight-oclock dials' },
  { emoji: '🕘', plural: 'nine-oclock dials' },
  { emoji: '🕙', plural: 'ten-oclock dials' },
  { emoji: '🕚', plural: 'eleven-oclock dials' },
  { emoji: '🕛', plural: 'twelve-oclock dials' },
  { emoji: '♈', plural: 'Aries symbols' },
  { emoji: '♉', plural: 'Taurus symbols' },
  { emoji: '♊', plural: 'Gemini symbols' },
  { emoji: '♋', plural: 'Cancer symbols' },
  { emoji: '♌', plural: 'Leo symbols' },
  { emoji: '♍', plural: 'Virgo symbols' },
  { emoji: '♎', plural: 'Libra symbols' },
  { emoji: '♏', plural: 'Scorpio symbols' },
  { emoji: '♐', plural: 'Sagittarius symbols' },
  { emoji: '♑', plural: 'Capricorn symbols' },
  { emoji: '♒', plural: 'Aquarius symbols' },
  { emoji: '♓', plural: 'Pisces symbols' },
  { emoji: '💛', plural: 'yellow hearts' },
  { emoji: '💚', plural: 'green hearts' },
  { emoji: '💙', plural: 'blue hearts' },
  { emoji: '💜', plural: 'purple hearts' },
  { emoji: '🖤', plural: 'black hearts' },
  { emoji: '🤍', plural: 'white hearts' },
  { emoji: '🤎', plural: 'brown hearts' },
  { emoji: '❤️', plural: 'red hearts' },
  { emoji: '💔', plural: 'broken hearts' },
  { emoji: '❣️', plural: 'heart exclamations' },
  { emoji: '💕', plural: 'two hearts' },
  { emoji: '💞', plural: 'revolving hearts' },
  { emoji: '💓', plural: 'beating hearts' },
  { emoji: '💗', plural: 'growing hearts' },
  { emoji: '💖', plural: 'sparkling hearts' },
  { emoji: '💘', plural: 'hearts with arrows' },
  { emoji: '👍', plural: 'thumbs-up stickers' },
  { emoji: '👎', plural: 'thumbs-down stickers' },
  { emoji: '✌️', plural: 'peace-sign stickers' },
  { emoji: '🤞', plural: 'crossed-finger stickers' },
  { emoji: '👊', plural: 'fist-bump stickers' },
  { emoji: '👏', plural: 'clapping-hand stickers' },
  { emoji: '🙌', plural: 'raised-hand stickers' },
  { emoji: '🤲', plural: 'open-palm stickers' },
  { emoji: '👌', plural: 'ok-sign stickers' },
  { emoji: '🤟', plural: 'love-sign stickers' },
  { emoji: '🐆', plural: 'leopards' },
  { emoji: '🐅', plural: 'wild tigers' },
  { emoji: '🦬', plural: 'bison' },
  { emoji: '🐗', plural: 'wild boars' },
  { emoji: '🐁', plural: 'field mice' },
  { emoji: '🐿️', plural: 'tree squirrels' },
  { emoji: '🐘', plural: 'baby elephants' },
  { emoji: '🍋‍🟩', plural: 'limes' },
  { emoji: '🍆', plural: 'eggplants' },
  { emoji: '🫚', plural: 'ginger roots' },
  { emoji: '🧄', plural: 'garlic bulbs' },
  { emoji: '🥬', plural: 'bok choy' },
  { emoji: '🥦', plural: 'broccoli florets' },
  { emoji: '🍠', plural: 'sweet potatoes' },
  { emoji: '🥿', plural: 'flat shoes' },
  { emoji: '👠', plural: 'high heels' },
  { emoji: '🩴', plural: 'flip-flops' },
  { emoji: '🎽', plural: 'running vests' },
  { emoji: '👙', plural: 'bikini sets' },
  { emoji: '🥌', plural: 'curling stones' },
  { emoji: '🛷', plural: 'sleds' },
  { emoji: '⛸️', plural: 'ice skates' },
  { emoji: '🏂', plural: 'snowboards' },
  { emoji: '🎣', plural: 'fishing rods' },
  { emoji: '🤿', plural: 'diving masks' },
  { emoji: '🏹', plural: 'archery bows' },
  { emoji: '🥏', plural: 'flying discs' },
  { emoji: '🏥', plural: 'hospitals' },
  { emoji: '🏦', plural: 'banks' },
  { emoji: '🏨', plural: 'hotels' },
  { emoji: '🏫', plural: 'schools' },
  { emoji: '🏢', plural: 'office towers' },
  { emoji: '🏬', plural: 'department stores' },
  { emoji: '🏪', plural: 'corner shops' },
  { emoji: '⛩️', plural: 'shrine gates' },
  { emoji: '🕋', plural: 'sacred cubes' },
  { emoji: '🗽', plural: 'statues of liberty' },
  { emoji: '🎼', plural: 'sheet music pages' },
  { emoji: '🌍', plural: 'globes of Earth' },
  { emoji: '🌑', plural: 'new moons' },
  { emoji: '🌕', plural: 'full moons' },
  { emoji: '🛰️', plural: 'satellites' },
  { emoji: '🌠', plural: 'shooting stars' },
  { emoji: '🌌', plural: 'starry skies' },
  { emoji: '🧯', plural: 'fire extinguishers' },
  { emoji: '🪠', plural: 'plungers' },
  { emoji: '🪤', plural: 'mouse traps' },
  { emoji: '🪥', plural: 'toothbrushes' },
  { emoji: '🧷', plural: 'safety pins' },
  { emoji: '🎂', plural: 'birthday cakes' },
  { emoji: '🇹🇱', plural: 'Timorese flags' },
  { emoji: '🇫🇯', plural: 'Fijian flags' },
  { emoji: '🇵🇬', plural: 'Papua New Guinean flags' },
  { emoji: '🇸🇧', plural: 'Solomon Island flags' },
  { emoji: '🇻🇺', plural: 'Vanuatu flags' },
  { emoji: '🇼🇸', plural: 'Samoan flags' },
  { emoji: '🇹🇴', plural: 'Tongan flags' },
  { emoji: '🇰🇮', plural: 'Kiribati flags' },
  { emoji: '🇫🇲', plural: 'Micronesian flags' },
  { emoji: '🇲🇭', plural: 'Marshallese flags' },
  { emoji: '🇵🇼', plural: 'Palauan flags' },
  { emoji: '🇳🇷', plural: 'Nauruan flags' },
  { emoji: '🇧🇳', plural: 'Bruneian flags' },
  { emoji: '🇧🇹', plural: 'Bhutanese flags' },
  { emoji: '🇲🇻', plural: 'Maldivian flags' },
  { emoji: '🇬🇾', plural: 'Guyanese flags' },
  { emoji: '🇸🇷', plural: 'Surinamese flags' },
  { emoji: '🇧🇿', plural: 'Belizean flags' },
  { emoji: '🇵🇦', plural: 'Panamanian flags' },
  { emoji: '🇨🇷', plural: 'Costa Rican flags' },
  { emoji: '🇳🇮', plural: 'Nicaraguan flags' },
  { emoji: '🇭🇳', plural: 'Honduran flags' },
  { emoji: '🇸🇻', plural: 'Salvadoran flags' },
  { emoji: '🇬🇹', plural: 'Guatemalan flags' },
  { emoji: '🇹🇩', plural: 'Chadian flags' },
  { emoji: '🇳🇪', plural: 'Nigerien flags' },
  { emoji: '🇲🇱', plural: 'Malian flags' },
  { emoji: '🇧🇫', plural: 'Burkinabe flags' },
  { emoji: '🇬🇳', plural: 'Guinean flags' },
  { emoji: '🇸🇱', plural: 'Sierra Leonean flags' },
  { emoji: '🇱🇷', plural: 'Liberian flags' },
  { emoji: '🇹🇬', plural: 'Togolese flags' },
  { emoji: '🇬🇶', plural: 'Equatorial Guinean flags' },
  { emoji: '🇬🇼', plural: 'Guinea-Bissauan flags' },
  { emoji: '🇸🇹', plural: 'Sao Tomean flags' },
  { emoji: '🇨🇻', plural: 'Cape Verdean flags' },
  { emoji: '🇰🇲', plural: 'Comorian flags' },
  { emoji: '🇲🇬', plural: 'Malagasy flags' },
  { emoji: '🇲🇺', plural: 'Mauritian flags' },
  { emoji: '🇸🇨', plural: 'Seychellois flags' },
  { emoji: '🇸🇿', plural: 'Eswatini flags' },
  { emoji: '🇱🇸', plural: 'Basotho flags' },
  // ----- Bổ sung vòng mục tiêu 850 -----
  { emoji: '⚀', plural: 'dice showing one' },
  { emoji: '⚁', plural: 'dice showing two' },
  { emoji: '⚂', plural: 'dice showing three' },
  { emoji: '⚃', plural: 'dice showing four' },
  { emoji: '⚄', plural: 'dice showing five' },
  { emoji: '⚅', plural: 'dice showing six' },
  { emoji: '♠️', plural: 'spade suits' },
  { emoji: '♥️', plural: 'heart suits' },
  { emoji: '♦️', plural: 'diamond suits' },
  { emoji: '♣️', plural: 'club suits' },
  { emoji: '🌒', plural: 'waxing-crescent moons' },
  { emoji: '🌓', plural: 'first-quarter moons' },
  { emoji: '🌔', plural: 'waxing-gibbous moons' },
  { emoji: '🌖', plural: 'waning-gibbous moons' },
  { emoji: '🌗', plural: 'last-quarter moons' },
  { emoji: '🌘', plural: 'waning-crescent moons' },
  { emoji: '🌚', plural: 'new-moon faces with eyes' },
  { emoji: '🌛', plural: 'first-quarter moon faces' },
  { emoji: '🌜', plural: 'last-quarter moon faces' },
  { emoji: '🌥️', plural: 'mostly-cloudy icons' },
  { emoji: '🌩️', plural: 'lightning-cloud icons' },
  { emoji: '🌨️', plural: 'snow-cloud icons' },
  { emoji: '☃️', plural: 'snowmen' },
  { emoji: '⛄', plural: 'snowmen without snow' },
  { emoji: '💨', plural: 'dash symbols' },
  { emoji: '🐠', plural: 'tropical fish' },
  { emoji: '🐡', plural: 'pufferfish' },
  { emoji: '🪼', plural: 'jellyfish' },
  { emoji: '🕸️', plural: 'spider webs' },
  { emoji: '🏔️', plural: 'snow-capped mountains' },
  { emoji: '🗻', plural: 'sacred mountains' },
  { emoji: '🏞️', plural: 'national parks' },
  { emoji: '🏜️', plural: 'deserts' },
  { emoji: '🛸', plural: 'flying saucers' },
  { emoji: '🎢', plural: 'roller coasters' },
  { emoji: '😀', plural: 'grinning faces' },
  { emoji: '😃', plural: 'grinning faces with big eyes' },
  { emoji: '😄', plural: 'grinning faces with smiling eyes' },
  { emoji: '😁', plural: 'beaming faces' },
  { emoji: '😆', plural: 'squinting faces' },
  { emoji: '😅', plural: 'sweat-smile faces' },
  { emoji: '🤣', plural: 'rolling-on-the-floor faces' },
  { emoji: '😊', plural: 'smiling faces with smiling eyes' },
  { emoji: '😇', plural: 'smiling faces with halos' },
  { emoji: '🙂', plural: 'slightly smiling faces' },
  { emoji: '🙃', plural: 'upside-down faces' },
  { emoji: '😉', plural: 'winking faces' },
  { emoji: '😍', plural: 'heart-eyes faces' },
  { emoji: '🥰', plural: 'smiling faces with hearts' },
  { emoji: '😘', plural: 'face-blowing-a-kiss icons' },
  { emoji: '😋', plural: 'face-savoring-food icons' },
  { emoji: '😛', plural: 'face-with-tongue icons' },
  { emoji: '😜', plural: 'winking-tongue faces' },
  { emoji: '🤪', plural: 'zany faces' },
  { emoji: '😝', plural: 'squinting-tongue faces' },
  { emoji: '🤑', plural: 'money-mouth faces' },
  { emoji: '🤗', plural: 'hugging faces' },
  { emoji: '🤭', plural: 'hand-over-mouth faces' },
  { emoji: '🤫', plural: 'shushing faces' },
  { emoji: '🤔', plural: 'thinking faces' },
  { emoji: '🤐', plural: 'zipper-mouth faces' },
  { emoji: '🥱', plural: 'yawning faces' },
  { emoji: '😴', plural: 'sleeping faces' },
  { emoji: '🤤', plural: 'drooling faces' },
  { emoji: '😪', plural: 'sleepy faces' },
  { emoji: '🤒', plural: 'face-with-thermometer icons' },
  { emoji: '🤕', plural: 'face-with-head-bandage icons' },
  { emoji: '🥴', plural: 'woozy faces' },
  { emoji: '🥵', plural: 'hot faces' },
  { emoji: '🥶', plural: 'cold faces' },
  { emoji: '🥳', plural: 'partying faces' },
  { emoji: '🥸', plural: 'disguised faces' },
  { emoji: '😎', plural: 'sunglasses faces' },
  { emoji: '🤓', plural: 'nerd faces' },
  { emoji: '🏁', plural: 'checkered flags' },
  { emoji: '🎌', plural: 'crossed flags' },
  { emoji: '🏳️', plural: 'white flags' },
  { emoji: '🏴', plural: 'black flags' },
  { emoji: '🏴‍☠️', plural: 'pirate flags' },
  { emoji: '🧐', plural: 'monocle faces' },
  { emoji: '🤨', plural: 'raised-eyebrow faces' },
  { emoji: '😐', plural: 'neutral faces' },
  { emoji: '😑', plural: 'expressionless faces' },
  { emoji: '😶', plural: 'face-without-mouth icons' },
  { emoji: '😏', plural: 'smirking faces' },
  { emoji: '😒', plural: 'unamused faces' },
  { emoji: '🙄', plural: 'eye-roll faces' },
  { emoji: '😬', plural: 'grimacing faces' },
  { emoji: '😔', plural: 'pensive faces' },
  { emoji: '😕', plural: 'confused faces' },
  { emoji: '🙁', plural: 'slightly frowning faces' },
  { emoji: '😟', plural: 'worried faces' },
  { emoji: '😤', plural: 'triumphant faces' },
  { emoji: '😢', plural: 'crying faces' },
  { emoji: '😭', plural: 'loudly crying faces' },
  { emoji: '😩', plural: 'weary faces' },
  { emoji: '😫', plural: 'tired faces' },
  { emoji: '🥺', plural: 'pleading faces' },
  { emoji: '😡', plural: 'pouting faces' },
  { emoji: '👻', plural: 'ghost faces' },
  { emoji: '👽', plural: 'alien faces' },
  { emoji: '⛑️', plural: 'rescue helmets' },
  { emoji: '👓', plural: 'eyeglasses' },
  { emoji: '👝', plural: 'clutch purses' },
  { emoji: '🏏', plural: 'cricket bats' },
  { emoji: '🪂', plural: 'parachutes' },
  { emoji: '🗑️', plural: 'trash cans' },
  { emoji: '🧺', plural: 'laundry baskets' },
  { emoji: '🚿', plural: 'showerheads' },
  { emoji: '🖇️', plural: 'paperclips' },
  { emoji: '🖋️', plural: 'fountain pens' },
  { emoji: '✒️', plural: 'nib pens' },
  { emoji: '🖌️', plural: 'paintbrushes' },
  { emoji: '🗳️', plural: 'ballot boxes' },
  { emoji: '📇', plural: 'index cards' },
  { emoji: '👨‍🚀', plural: 'astronauts' },
  { emoji: '🦃', plural: 'turkeys' },
  { emoji: '🐓', plural: 'roosters' },
  { emoji: '🥯', plural: 'bagels' },
  { emoji: '🫔', plural: 'tamales' },
  { emoji: '🥙', plural: 'stuffed flatbreads' },
  { emoji: '🧆', plural: 'falafel balls' },
  { emoji: '🍿', plural: 'popcorn bags' },
  { emoji: '🧈', plural: 'butter sticks' },
  { emoji: '🇰🇵', plural: 'North Korean flags' },
  { emoji: '🇹🇼', plural: 'Taiwanese flags' },
  { emoji: '🇭🇰', plural: 'Hong Kong flags' },
  { emoji: '🇲🇴', plural: 'Macau flags' },
  { emoji: '🇵🇸', plural: 'Palestinian flags' },
  { emoji: '🇵🇷', plural: 'Puerto Rican flags' },
  { emoji: '🇬🇱', plural: 'Greenlandic flags' },
  { emoji: '🇧🇲', plural: 'Bermudian flags' },
  { emoji: '🇬🇮', plural: 'Gibraltar flags' },
  { emoji: '🇫🇴', plural: 'Faroese flags' },
  { emoji: '🇮🇲', plural: 'Isle-of-Man flags' },
  { emoji: '🇬🇬', plural: 'Guernsey flags' },
  { emoji: '🇯🇪', plural: 'Jersey flags' },
  { emoji: '🇨🇰', plural: 'Cook Islands flags' },
  { emoji: '🇳🇺', plural: 'Niuean flags' },
  { emoji: '🇦🇶', plural: 'Antarctic flags' },
  { emoji: '🇪🇺', plural: 'European Union flags' },
  { emoji: '🇺🇳', plural: 'United Nations flags' },
  { emoji: '🌽', plural: 'corn cobs' },
  { emoji: '🐾', plural: 'paw prints' },
  { emoji: '🪸', plural: 'corals' },
  { emoji: '🪷', plural: 'lotus flowers' },
  { emoji: '🪹', plural: 'empty nests' },
  { emoji: '🪺', plural: 'nests with eggs' },
  { emoji: '🥛', plural: 'glasses of milk' },
  { emoji: '🧃', plural: 'juice boxes' },
  { emoji: '🥢', plural: 'chopsticks' },

  // ----- Bổ sung vòng mục tiêu 1000 -----
  { emoji: '🔸', plural: 'small orange diamonds' },
  { emoji: '🔹', plural: 'small blue diamonds' },
  { emoji: '🔻', plural: 'red down-triangles' },
  { emoji: '🔳', plural: 'white squares' },
  { emoji: '◼️', plural: 'black medium squares' },
  { emoji: '◻️', plural: 'white medium squares' },
  { emoji: '◾', plural: 'black small squares' },
  { emoji: '◽', plural: 'white small squares' },
  { emoji: '▪️', plural: 'black tiny squares' },
  { emoji: '▫️', plural: 'white tiny squares' },
  { emoji: '🔘', plural: 'radio buttons' },
  { emoji: '🌺', plural: 'hibiscus flowers' },
  { emoji: '🌼', plural: 'daisies' },
  { emoji: '💐', plural: 'flower bouquets' },
  { emoji: '🥀', plural: 'wilted roses' },
  { emoji: '💵', plural: 'dollar bills' },
  { emoji: '💴', plural: 'yen bills' },
  { emoji: '💶', plural: 'euro bills' },
  { emoji: '💷', plural: 'pound bills' },
  { emoji: '🪙', plural: 'coins' },
  { emoji: '💰', plural: 'money bags' },
  { emoji: '🧬', plural: 'DNA strands' },
  { emoji: '🧫', plural: 'petri dishes' },
  { emoji: '🦠', plural: 'microbes' },
  { emoji: '💉', plural: 'syringes' },
  { emoji: '🩺', plural: 'stethoscopes' },
  { emoji: '🩹', plural: 'adhesive bandages' },
  { emoji: '💊', plural: 'pills' },
  { emoji: '🚞', plural: 'mountain railways' },
  { emoji: '🚋', plural: 'tram cars' },
  { emoji: '🚍', plural: 'oncoming buses' },
  { emoji: '🚘', plural: 'oncoming automobiles' },
  { emoji: '🎅', plural: 'Santa figures' },
  { emoji: '🧨', plural: 'firecrackers' },
  { emoji: '🎇', plural: 'sparklers' },
  { emoji: '🎋', plural: 'tanabata trees' },
  { emoji: '🎐', plural: 'wind chimes' },
  { emoji: '🍺', plural: 'beer mugs' },
  { emoji: '🍷', plural: 'wine glasses' },
  { emoji: '🍸', plural: 'cocktail glasses' },
  { emoji: '🍾', plural: 'champagne bottles' },
  { emoji: '🥂', plural: 'clinking champagne glasses' },
  { emoji: '🍀', plural: 'four-leaf clovers' },
  { emoji: '🌲', plural: 'evergreen trees' },
  { emoji: '😸', plural: 'grinning cat faces' },
  { emoji: '😹', plural: 'tears-of-joy cat faces' },
  { emoji: '😺', plural: 'grinning cat faces with smiling eyes' },
  { emoji: '😻', plural: 'heart-eyes cat faces' },
  { emoji: '😼', plural: 'wry-smile cat faces' },
  { emoji: '😽', plural: 'kissing cat faces' },
  { emoji: '🙀', plural: 'weary cat faces' },
  { emoji: '😿', plural: 'crying cat faces' },
  { emoji: '😾', plural: 'pouting cat faces' },
  { emoji: '🤙', plural: 'call-me hand signs' },
  { emoji: '🖖', plural: 'vulcan salutes' },
  { emoji: '🤌', plural: 'pinched-finger gestures' },
  { emoji: '🫰', plural: 'finger-heart gestures' },
  { emoji: '🫵', plural: 'pointing-at-viewer gestures' },
  { emoji: '🫲', plural: 'left-facing hands' },
  { emoji: '🫱', plural: 'right-facing hands' },
  { emoji: '🤝', plural: 'handshake gestures' },
  { emoji: '😙', plural: 'kissing faces with smiling eyes' },
  { emoji: '😚', plural: 'kissing faces with closed eyes' },
  { emoji: '😗', plural: 'kissing faces' },
  { emoji: '🫠', plural: 'melting faces' },
  { emoji: '🫡', plural: 'saluting faces' },
  { emoji: '🫢', plural: 'face-with-open-eyes-and-hand-over-mouth icons' },
  { emoji: '🫣', plural: 'peeking-eye faces' },
  { emoji: '🫤', plural: 'face-with-diagonal-mouth icons' },
  { emoji: '🎱', plural: 'pool balls' },
  { emoji: '🥎', plural: 'softballs' },
  { emoji: '🗝️', plural: 'old keys' },
  { emoji: '🔒', plural: 'locked padlocks' },
  { emoji: '🔓', plural: 'unlocked padlocks' },
  { emoji: '⚗️', plural: 'alembics' },
  { emoji: '🧭', plural: 'compasses' },
  { emoji: '⏳', plural: 'hourglasses' },
  { emoji: '⌛', plural: 'hourglasses done' },
  { emoji: '⏱️', plural: 'stopwatches' },
  { emoji: '⚠️', plural: 'warning signs' },
  { emoji: '🚫', plural: 'no-entry signs' },
  { emoji: '⛔', plural: 'no-entry road signs' },
  { emoji: '🚸', plural: 'children-crossing signs' },
  { emoji: '♻️', plural: 'recycling symbols' },
  { emoji: '🔞', plural: 'age-restriction signs' },
  { emoji: '📵', plural: 'no-phone signs' },
  { emoji: '🚭', plural: 'no-smoking signs' },
  { emoji: '🈺', plural: 'open-for-business signs' },
  { emoji: '🈴', plural: 'pass-grade signs' },
  { emoji: '🉐', plural: 'bargain signs' },
  { emoji: '🈵', plural: 'no-vacancy signs' },
  { emoji: '📍', plural: 'round pushpins' },
  { emoji: '🗒️', plural: 'spiral notepads' },
  { emoji: '🗓️', plural: 'spiral calendars' },
  { emoji: '📔', plural: 'notebooks with decorative covers' },
  { emoji: '📒', plural: 'ledgers' },
  { emoji: '📕', plural: 'closed books' },
  { emoji: '📗', plural: 'green books' },
  { emoji: '📘', plural: 'blue books' },
  { emoji: '📙', plural: 'orange books' },
  { emoji: '🛟', plural: 'life preservers' },
  { emoji: '🚧', plural: 'construction barriers' },
  { emoji: '🎓', plural: 'graduation caps' },
  { emoji: '🥽', plural: 'safety goggles' },
  { emoji: '🎬', plural: 'clapperboards' },
  { emoji: '🎟️', plural: 'admission tickets' },
  { emoji: '🎫', plural: 'event tickets' },
  { emoji: '🥇', plural: 'gold medals' },
  { emoji: '🥈', plural: 'silver medals' },
  { emoji: '🥉', plural: 'bronze medals' },
  { emoji: '🐈‍⬛', plural: 'black cats' },
  { emoji: '🐋', plural: 'blue whales' },
  { emoji: '🛡️', plural: 'shields' },
  { emoji: '⚔️', plural: 'crossed swords' },
  { emoji: '🗡️', plural: 'daggers' },
  { emoji: '🔫', plural: 'water guns' },
  { emoji: '🪃', plural: 'boomerangs' },
  { emoji: '🛌', plural: 'people in beds' },
  { emoji: '🪔', plural: 'oil lamps' },
  { emoji: '🇦🇬', plural: 'Antiguan flags' },
  { emoji: '🇦🇮', plural: 'Anguillan flags' },
  { emoji: '🇦🇸', plural: 'American Samoan flags' },
  { emoji: '🇦🇼', plural: 'Aruban flags' },
  { emoji: '🇧🇧', plural: 'Barbadian flags' },
  { emoji: '🇧🇮', plural: 'Burundian flags' },
  { emoji: '🇧🇸', plural: 'Bahamian flags' },
  { emoji: '🇨🇫', plural: 'Central African flags' },
  { emoji: '🇩🇯', plural: 'Djiboutian flags' },
  { emoji: '🇪🇷', plural: 'Eritrean flags' },
  { emoji: '🇫🇰', plural: 'Falkland Island flags' },
  { emoji: '🇬🇩', plural: 'Grenadian flags' },
  { emoji: '🇬🇲', plural: 'Gambian flags' },
  { emoji: '🇬🇺', plural: 'Guamanian flags' },
  { emoji: '🇮🇷', plural: 'Iranian flags' },
  { emoji: '🇰🇳', plural: 'Kittitian flags' },
  { emoji: '🇰🇾', plural: 'Caymanian flags' },
  { emoji: '🇱🇨', plural: 'Saint Lucian flags' },
  { emoji: '🇲🇵', plural: 'Mariana Island flags' },
  { emoji: '🇲🇷', plural: 'Mauritanian flags' },
  { emoji: '🇲🇸', plural: 'Montserratian flags' },
  { emoji: '🇳🇨', plural: 'New Caledonian flags' },
  { emoji: '🇵🇫', plural: 'French Polynesian flags' },
  { emoji: '🇸🇸', plural: 'South Sudanese flags' },
  { emoji: '🇹🇨', plural: 'Turks and Caicos flags' },
  { emoji: '🇹🇻', plural: 'Tuvaluan flags' },
  { emoji: '🇻🇬', plural: 'British Virgin Island flags' },
  { emoji: '🇻🇮', plural: 'US Virgin Island flags' },
  { emoji: '🇻🇨', plural: 'Vincentian flags' },
  { emoji: '🇼🇫', plural: 'Wallis and Futuna flags' },
  { emoji: '🌡️', plural: 'thermometers' },

];

function buildQuantifierSentence(noun, key) {
  switch (key) {
    case 'all':
      return `All of the ${noun.plural} are red.`;
    case 'none':
      return `None of the ${noun.plural} are red.`;
    case 'every':
      return `Every ${noun.plural} is red.`;
    case 'some':
    default:
      return `Some of the ${noun.plural} are red.`;
  }
}

/**
 * 1 vòng: chọn 1 đồ vật + tổng số lượng (4-6) + số lượng được tô đỏ ngẫu
 * nhiên (tất cả/không cái nào/1 phần) — sinh 4 câu (đúng theo đúng số
 * lượng được tô + 3 lỗi: 2 lượng từ sai + "Every" dùng sai với danh từ số
 * nhiều — lỗi phổ biến nhất khi mới học).
 */
export function makeQuantifierRound(rng = Math.random) {
  const noun = pick(QUANTIFIER_NOUNS, rng);
  const total = 4 + Math.floor(rng() * 3);
  const roll = rng();
  let highlighted;
  let correctKey;
  if (roll < 1 / 3) {
    highlighted = total;
    correctKey = 'all';
  } else if (roll < 2 / 3) {
    highlighted = 0;
    correctKey = 'none';
  } else {
    highlighted = 1 + Math.floor(rng() * (total - 1));
    correctKey = 'some';
  }
  const keys = ['all', 'some', 'none', 'every'];
  const options = shuffle(keys, rng).map((key) => ({
    key,
    sentence: buildQuantifierSentence(noun, key),
  }));
  return {
    noun, total, highlighted, options, correctKey,
  };
}

export function makeQuantifierGame(count = 8, rng = Math.random) {
  const rounds = [];
  for (let i = 0; i < count; i++) rounds.push(makeQuantifierRound(rng));
  return baseGameState(rounds);
}

export function currentQuantifierRound(game) {
  return currentRoundOf(game);
}

export function answerQuantifier(game, key) {
  return answerGeneric(game, key, (round) => round.correctKey);
}

/* ===== 11. Nhận Biết Từ Loại (Parts of Speech) =====
   Tiếng Anh có 8 từ loại cơ bản (danh/đại/động/tính/trạng/giới/liên/thán từ).
   4 loại đầu (danh/động/tính/trạng) phần lớn NHẬN RA QUA ĐUÔI (suffix) —
   mỗi ví dụ đều có "hint" giải thích đúng đuôi đó. Tiền tố (un-/re-/dis-/
   mis-...) hầu như KHÔNG đổi từ loại, chỉ đổi NGHĨA — vài ví dụ cố tình
   dùng từ có tiền tố để làm rõ điều này. 4 loại còn lại (giới/đại/liên/
   thán từ) HẦU NHƯ KHÔNG có đuôi cố định — phải dựa vào VAI TRÒ/Ý NGHĨA
   trong câu (đứng trước danh từ chỉ vị trí → giới từ; thay cho danh từ đã
   nhắc → đại từ; nối 2 phần câu → liên từ; tách riêng thể hiện cảm xúc →
   thán từ), nên hint của nhóm này giải thích theo VAI TRÒ thay vì đuôi. */

export const POS_CATEGORIES = [
  { id: 'noun', label: 'Danh từ (Noun)' },
  { id: 'pronoun', label: 'Đại từ (Pronoun)' },
  { id: 'verb', label: 'Động từ (Verb)' },
  { id: 'adjective', label: 'Tính từ (Adjective)' },
  { id: 'adverb', label: 'Trạng từ (Adverb)' },
  { id: 'preposition', label: 'Giới từ (Preposition)' },
  { id: 'conjunction', label: 'Liên từ (Conjunction)' },
  { id: 'interjection', label: 'Thán từ (Interjection)' },
];

export const POS_WORDS = [
  // ----- Danh từ (noun) — đuôi -tion/-ment/-ness/-ity/-er/-or/-ance/-ence/-ship/-hood/-ism/-dom -----
  { sentence: 'The teacher gave a long explanation.', word: 'explanation', pos: 'noun', hint: 'đuôi "-tion" biến động từ "explain" thành danh từ chỉ khái niệm/hành động.' },
  { sentence: 'The government announced new rules.', word: 'government', pos: 'noun', hint: 'đuôi "-ment" biến động từ "govern" thành danh từ.' },
  { sentence: 'Money cannot buy true happiness.', word: 'happiness', pos: 'noun', hint: 'đuôi "-ness" biến tính từ "happy" thành danh từ chỉ trạng thái.' },
  { sentence: 'Swimming is her favorite activity.', word: 'activity', pos: 'noun', hint: 'đuôi "-ity" biến tính từ "active" thành danh từ.' },
  { sentence: 'My sister wants to be a teacher.', word: 'teacher', pos: 'noun', hint: 'đuôi "-er" thường chỉ NGƯỜI làm hành động ("teach" + "-er") → danh từ.' },
  { sentence: 'The actor forgot his lines.', word: 'actor', pos: 'noun', hint: 'đuôi "-or" cũng chỉ NGƯỜI làm hành động ("act" + "-or") → danh từ.' },
  { sentence: 'The singer gave an amazing performance.', word: 'performance', pos: 'noun', hint: 'đuôi "-ance" biến động từ "perform" thành danh từ.' },
  { sentence: 'She answered with great confidence.', word: 'confidence', pos: 'noun', hint: 'đuôi "-ence" biến tính từ "confident" thành danh từ.' },
  { sentence: 'Their friendship has lasted many years.', word: 'friendship', pos: 'noun', hint: 'đuôi "-ship" chỉ MỐI QUAN HỆ ("friend" + "-ship") → danh từ.' },
  { sentence: 'She often talks about her childhood.', word: 'childhood', pos: 'noun', hint: 'đuôi "-hood" chỉ GIAI ĐOẠN/TRẠNG THÁI ("child" + "-hood") → danh từ.' },
  { sentence: 'Tourism brings a lot of money to this city.', word: 'Tourism', pos: 'noun', hint: 'đuôi "-ism" chỉ một LĨNH VỰC/HỌC THUYẾT ("tour" + "-ism") → danh từ.' },
  { sentence: 'Every citizen deserves freedom.', word: 'freedom', pos: 'noun', hint: 'đuôi "-dom" chỉ TRẠNG THÁI/PHẠM VI ("free" + "-dom") → danh từ.' },
  { sentence: 'The movement started in the last century.', word: 'movement', pos: 'noun', hint: 'đuôi "-ment" biến động từ "move" thành danh từ.' },
  // ----- Động từ (verb) — đuôi -ize/-ise/-ify/-ate/-en; vài ví dụ có tiền tố (không đổi từ loại) -----
  { sentence: 'The company wants to modernize its factory.', word: 'modernize', pos: 'verb', hint: 'đuôi "-ize" biến tính từ "modern" thành động từ (nghĩa "làm cho...").' },
  { sentence: 'Can you clarify your question?', word: 'clarify', pos: 'verb', hint: 'đuôi "-ify" biến tính từ "clear" thành động từ.' },
  { sentence: 'We will celebrate her birthday tomorrow.', word: 'celebrate', pos: 'verb', hint: 'đuôi "-ate" thường tạo động từ chỉ hành động.' },
  { sentence: 'Exercise helps strengthen your muscles.', word: 'strengthen', pos: 'verb', hint: 'đuôi "-en" biến danh từ/tính từ "strength" thành động từ (nghĩa "làm cho...hơn").' },
  { sentence: 'Please organize your desk before class.', word: 'organize', pos: 'verb', hint: 'đuôi "-ize" tạo động từ ("organ" + "-ize").' },
  { sentence: 'Let me simplify this explanation for you.', word: 'simplify', pos: 'verb', hint: 'đuôi "-ify" biến tính từ "simple" thành động từ.' },
  { sentence: 'They communicate by video call every day.', word: 'communicate', pos: 'verb', hint: 'đuôi "-ate" tạo động từ chỉ hành động.' },
  { sentence: 'The city plans to widen this road.', word: 'widen', pos: 'verb', hint: 'đuôi "-en" biến tính từ "wide" thành động từ.' },
  { sentence: 'I did not realize the time was so late.', word: 'realize', pos: 'verb', hint: 'đuôi "-ize" biến tính từ "real" thành động từ.' },
  { sentence: 'The teacher will classify the answers into groups.', word: 'classify', pos: 'verb', hint: 'đuôi "-ify" tạo động từ ("class" + "-ify").' },
  { sentence: 'We really appreciate your help.', word: 'appreciate', pos: 'verb', hint: 'đuôi "-ate" tạo động từ chỉ hành động/cảm xúc.' },
  { sentence: 'Turning on the lamp will brighten the room.', word: 'brighten', pos: 'verb', hint: 'đuôi "-en" biến tính từ "bright" thành động từ.' },
  { sentence: 'I disagree with your opinion.', word: 'disagree', pos: 'verb', hint: 'tiền tố "dis-" chỉ đổi NGHĨA (phủ định của "agree"), KHÔNG đổi từ loại — vẫn là động từ.' },
  { sentence: 'She had to rewrite the whole report.', word: 'rewrite', pos: 'verb', hint: 'tiền tố "re-" chỉ đổi NGHĨA ("làm lại"), KHÔNG đổi từ loại — vẫn là động từ giống "write".' },
  { sentence: 'They play football every weekend.', word: 'play', pos: 'verb', hint: 'không có đuôi đặc biệt — nhận ra nhờ NGHĨA: đây là HÀNH ĐỘNG bé làm → động từ.' },
  // ----- Tính từ (adjective) — đuôi -able/-ible/-al/-ful/-less/-ous/-ive/-ic/-y/-ish/-ent/-ant -----
  { sentence: 'This is a very comfortable chair.', word: 'comfortable', pos: 'adjective', hint: 'đuôi "-able" biến động từ "comfort" thành tính từ (nghĩa "có thể...").' },
  { sentence: 'The new schedule is quite flexible.', word: 'flexible', pos: 'adjective', hint: 'đuôi "-ible" cũng biến động từ thành tính từ (nghĩa "có thể...").' },
  { sentence: 'Today is a national holiday.', word: 'national', pos: 'adjective', hint: 'đuôi "-al" biến danh từ "nation" thành tính từ.' },
  { sentence: 'She painted a beautiful picture.', word: 'beautiful', pos: 'adjective', hint: 'đuôi "-ful" biến danh từ "beauty" thành tính từ (nghĩa "đầy...").' },
  { sentence: 'He was punished for being careless.', word: 'careless', pos: 'adjective', hint: 'đuôi "-less" biến danh từ "care" thành tính từ (nghĩa "thiếu...").' },
  { sentence: 'Swimming alone in the sea can be dangerous.', word: 'dangerous', pos: 'adjective', hint: 'đuôi "-ous" biến danh từ "danger" thành tính từ.' },
  { sentence: 'She has a very creative mind.', word: 'creative', pos: 'adjective', hint: 'đuôi "-ive" biến động từ "create" thành tính từ.' },
  { sentence: 'He made an important scientific discovery.', word: 'scientific', pos: 'adjective', hint: 'đuôi "-ic" biến danh từ "science" thành tính từ.' },
  { sentence: 'It is a sunny day today.', word: 'sunny', pos: 'adjective', hint: 'đuôi "-y" biến danh từ "sun" thành tính từ.' },
  { sentence: 'Stop being so childish about this.', word: 'childish', pos: 'adjective', hint: 'đuôi "-ish" biến danh từ "child" thành tính từ (nghĩa "giống như...").' },
  { sentence: 'Our two opinions are quite different.', word: 'different', pos: 'adjective', hint: 'đuôi "-ent" tạo tính từ chỉ đặc điểm.' },
  { sentence: 'This project is very important to us.', word: 'important', pos: 'adjective', hint: 'đuôi "-ant" tạo tính từ chỉ đặc điểm.' },
  { sentence: 'The children look very happy today.', word: 'happy', pos: 'adjective', hint: 'đuôi "-y" tạo tính từ chỉ trạng thái/cảm xúc.' },
  { sentence: 'I am unable to attend the meeting.', word: 'unable', pos: 'adjective', hint: 'tiền tố "un-" chỉ đổi NGHĨA (phủ định của "able"), KHÔNG đổi từ loại — vẫn là tính từ.' },
  // ----- Trạng từ (adverb) — đa số đuôi -ly; vài từ tần suất/mức độ không theo quy tắc đuôi -----
  { sentence: 'He quickly finished his homework.', word: 'quickly', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "quick" thành trạng từ, bổ nghĩa cho động từ "finished".' },
  { sentence: 'She carefully carried the hot soup.', word: 'carefully', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "careful" thành trạng từ.' },
  { sentence: 'The children played happily in the park.', word: 'happily', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "happy" thành trạng từ (y → ily).' },
  { sentence: 'The old man walked slowly across the street.', word: 'slowly', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "slow" thành trạng từ.' },
  { sentence: 'The music was playing loudly next door.', word: 'loudly', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "loud" thành trạng từ.' },
  { sentence: 'She easily solved the difficult puzzle.', word: 'easily', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "easy" thành trạng từ (y → ily).' },
  { sentence: 'Please answer the question honestly.', word: 'honestly', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "honest" thành trạng từ.' },
  { sentence: 'Suddenly, the lights went out.', word: 'Suddenly', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "sudden" thành trạng từ.' },
  { sentence: 'I have never seen such a big elephant.', word: 'never', pos: 'adverb', hint: 'không có đuôi "-ly" — là trạng từ TẦN SUẤT, phải nhớ nghĩa (không bao giờ).' },
  { sentence: 'She always wakes up early.', word: 'always', pos: 'adverb', hint: 'trạng từ tần suất, không theo quy tắc đuôi — phải nhớ nghĩa (luôn luôn).' },
  { sentence: 'This soup is very hot.', word: 'very', pos: 'adverb', hint: 'trạng từ MỨC ĐỘ, bổ nghĩa cho tính từ "hot" — không có đuôi, phải nhớ nghĩa.' },
  { sentence: 'She sings very well.', word: 'well', pos: 'adverb', hint: 'dạng trạng từ bất quy tắc của "good" — không theo đuôi "-ly", phải nhớ nghĩa.' },
  // ----- Giới từ (preposition) — không có đuôi cố định, nhận ra qua VAI TRÒ: đứng trước danh từ/đại từ, chỉ vị trí/thời gian/phương hướng -----
  { sentence: 'The keys are in the drawer.', word: 'in', pos: 'preposition', hint: 'đứng trước danh từ "the drawer", chỉ VỊ TRÍ → giới từ.' },
  { sentence: 'The meeting is on Monday.', word: 'on', pos: 'preposition', hint: 'đứng trước danh từ chỉ NGÀY → giới từ thời gian.' },
  { sentence: 'We arrived at noon.', word: 'at', pos: 'preposition', hint: 'đứng trước danh từ chỉ GIỜ/THỜI ĐIỂM → giới từ thời gian.' },
  { sentence: 'The cat is sleeping under the table.', word: 'under', pos: 'preposition', hint: 'đứng trước danh từ, chỉ VỊ TRÍ (bên dưới) → giới từ.' },
  { sentence: 'She sat between her two friends.', word: 'between', pos: 'preposition', hint: 'đứng trước 2 danh từ, chỉ VỊ TRÍ (ở giữa) → giới từ.' },
  { sentence: 'He hid behind the door.', word: 'behind', pos: 'preposition', hint: 'đứng trước danh từ, chỉ VỊ TRÍ (phía sau) → giới từ.' },
  { sentence: 'They talked quietly during the movie.', word: 'during', pos: 'preposition', hint: 'đứng trước danh từ, chỉ KHOẢNG THỜI GIAN → giới từ.' },
  { sentence: 'Please wash your hands before dinner.', word: 'before', pos: 'preposition', hint: 'đứng trước DANH TỪ "dinner" (không phải mệnh đề) → giới từ thời gian.' },
  { sentence: 'She left the party after midnight.', word: 'after', pos: 'preposition', hint: 'đứng trước danh từ, chỉ THỜI GIAN (sau đó) → giới từ.' },
  { sentence: 'The train went through a long tunnel.', word: 'through', pos: 'preposition', hint: 'đứng trước danh từ, chỉ HƯỚNG DI CHUYỂN (xuyên qua) → giới từ.' },
  { sentence: 'He jumped into the swimming pool.', word: 'into', pos: 'preposition', hint: 'đứng trước danh từ, chỉ HƯỚNG (vào trong) → giới từ.' },
  { sentence: 'I cannot live without music.', word: 'without', pos: 'preposition', hint: 'đứng trước danh từ, chỉ sự THIẾU VẮNG → giới từ.' },
  // ----- Đại từ (pronoun) — không có đuôi cố định, nhận ra qua VAI TRÒ: thay thế cho danh từ đã nhắc/chỉ người nói-nghe -----
  { sentence: 'She is my best friend.', word: 'She', pos: 'pronoun', hint: 'thay cho TÊN một người con gái đã biết trước đó → đại từ nhân xưng.' },
  { sentence: 'I saw him at the park yesterday.', word: 'him', pos: 'pronoun', hint: 'thay cho TÊN một người con trai, đứng sau động từ "saw" → đại từ.' },
  { sentence: 'Is this pencil mine?', word: 'mine', pos: 'pronoun', hint: 'thay cho "my pencil" → đại từ SỞ HỮU.' },
  { sentence: 'They invited us to the party.', word: 'us', pos: 'pronoun', hint: 'thay cho "me and my friends", đứng sau động từ → đại từ.' },
  { sentence: 'Is this book yours?', word: 'yours', pos: 'pronoun', hint: 'thay cho "your book" → đại từ SỞ HỮU.' },
  { sentence: 'He hurt himself while playing football.', word: 'himself', pos: 'pronoun', hint: 'chỉ lại chính chủ ngữ "He" → đại từ PHẢN THÂN.' },
  { sentence: 'Everyone enjoyed the show last night.', word: 'Everyone', pos: 'pronoun', hint: 'thay cho "mọi người" nói chung, không chỉ 1 danh từ cụ thể → đại từ BẤT ĐỊNH.' },
  { sentence: 'Who is knocking at the door?', word: 'Who', pos: 'pronoun', hint: 'dùng để HỎI về một người → đại từ NGHI VẤN.' },
  { sentence: 'This is the book that I bought yesterday.', word: 'that', pos: 'pronoun', hint: 'thay cho "the book" để làm chủ ngữ vế sau → đại từ QUAN HỆ (khác với "that" dùng để nối câu).' },
  { sentence: 'Nobody knows the correct answer.', word: 'Nobody', pos: 'pronoun', hint: 'thay cho "không một ai", không chỉ 1 danh từ cụ thể → đại từ BẤT ĐỊNH.' },
  { sentence: 'We should always help each other.', word: 'each other', pos: 'pronoun', hint: 'thay cho 2 danh từ đã nhắc, chỉ QUA LẠI lẫn nhau → đại từ.' },
  { sentence: 'It is raining outside right now.', word: 'It', pos: 'pronoun', hint: 'chủ ngữ giả, không thay cho danh từ cụ thể nào (nói về thời tiết) → đại từ.' },
  // ----- Liên từ (conjunction) — không có đuôi cố định, nhận ra qua VAI TRÒ: nối 2 từ/mệnh đề -----
  { sentence: 'I like both tea and coffee.', word: 'and', pos: 'conjunction', hint: 'nối 2 danh từ "tea" và "coffee" → liên từ.' },
  { sentence: 'She was tired, but she kept working.', word: 'but', pos: 'conjunction', hint: 'nối 2 mệnh đề trái ngược nhau → liên từ.' },
  { sentence: 'You can have tea or coffee.', word: 'or', pos: 'conjunction', hint: 'nối 2 lựa chọn → liên từ.' },
  { sentence: 'He stayed home because he was sick.', word: 'because', pos: 'conjunction', hint: 'nối mệnh đề chính với LÝ DO → liên từ.' },
  { sentence: 'Although it was raining, we went out.', word: 'Although', pos: 'conjunction', hint: 'nối 2 mệnh đề tương phản → liên từ.' },
  { sentence: 'She sings while she cooks dinner.', word: 'while', pos: 'conjunction', hint: 'nối 2 hành động xảy ra CÙNG LÚC → liên từ.' },
  { sentence: 'I will call you when I arrive.', word: 'when', pos: 'conjunction', hint: 'nối 2 mệnh đề, chỉ THỜI ĐIỂM → liên từ.' },
  { sentence: 'He studied hard so he passed the exam.', word: 'so', pos: 'conjunction', hint: 'nối mệnh đề chính với KẾT QUẢ → liên từ.' },
  { sentence: 'Neither the cat nor the dog was hungry.', word: 'nor', pos: 'conjunction', hint: 'đi cùng "neither" để nối 2 lựa chọn ĐỀU KHÔNG đúng → liên từ.' },
  { sentence: 'Since you are here, let us start the lesson.', word: 'Since', pos: 'conjunction', hint: 'nối mệnh đề, chỉ LÝ DO (không phải thời gian ở đây) → liên từ.' },
  { sentence: 'Unless you hurry, you will be late.', word: 'Unless', pos: 'conjunction', hint: 'nối mệnh đề, chỉ ĐIỀU KIỆN phủ định → liên từ.' },
  { sentence: 'Both my sister and I love music.', word: 'and', pos: 'conjunction', hint: 'nối 2 chủ ngữ "my sister" và "I" → liên từ.' },
  // ----- Thán từ (interjection) — không có đuôi cố định, nhận ra qua VAI TRÒ: thể hiện cảm xúc, tách riêng bằng dấu "!", thường đứng đầu câu -----
  { sentence: 'Wow! That is amazing!', word: 'Wow', pos: 'interjection', hint: 'đứng riêng, tách bằng dấu "!", thể hiện SỰ NGẠC NHIÊN → thán từ.' },
  { sentence: 'Oops! I dropped my pen.', word: 'Oops', pos: 'interjection', hint: 'thể hiện cảm xúc lỡ làm sai điều gì đó → thán từ.' },
  { sentence: 'Ouch! That really hurt.', word: 'Ouch', pos: 'interjection', hint: 'thể hiện cảm giác ĐAU → thán từ.' },
  { sentence: 'Hey! Look over there.', word: 'Hey', pos: 'interjection', hint: 'dùng để GỌI/GÂY CHÚ Ý → thán từ.' },
  { sentence: 'Oh no, I forgot my homework!', word: 'Oh', pos: 'interjection', hint: 'thể hiện cảm xúc THẤT VỌNG → thán từ.' },
  { sentence: 'Hooray! We won the game!', word: 'Hooray', pos: 'interjection', hint: 'thể hiện SỰ VUI MỪNG → thán từ.' },
  { sentence: 'Alas, the poor bird could not fly.', word: 'Alas', pos: 'interjection', hint: 'thể hiện sự TIẾC NUỐI/BUỒN → thán từ.' },
  { sentence: 'Yay! It is finally the weekend!', word: 'Yay', pos: 'interjection', hint: 'thể hiện SỰ VUI MỪNG → thán từ.' },
  { sentence: 'Ugh, this traffic is terrible.', word: 'Ugh', pos: 'interjection', hint: 'thể hiện sự KHÓ CHỊU → thán từ.' },
  { sentence: 'Bravo! What a wonderful performance!', word: 'Bravo', pos: 'interjection', hint: 'dùng để KHEN NGỢI → thán từ.' },
  // ----- Danh từ (vòng 2) -----
  { sentence: 'She made a difficult decision.', word: 'decision', pos: 'noun', hint: 'đuôi "-tion" biến động từ "decide" thành danh từ.' },
  { sentence: 'They sent an invitation to the party.', word: 'invitation', pos: 'noun', hint: 'đuôi "-tion" biến động từ "invite" thành danh từ.' },
  { sentence: 'The town held a big celebration.', word: 'celebration', pos: 'noun', hint: 'đuôi "-tion" biến động từ "celebrate" thành danh từ.' },
  { sentence: 'The two teams joined the competition.', word: 'competition', pos: 'noun', hint: 'đuôi "-tion" biến động từ "compete" thành danh từ.' },
  { sentence: 'He gave clear direction to the team.', word: 'direction', pos: 'noun', hint: 'đuôi "-tion" biến động từ "direct" thành danh từ.' },
  { sentence: 'The class studied basic addition.', word: 'addition', pos: 'noun', hint: 'đuôi "-tion" biến động từ "add" thành danh từ.' },
  { sentence: 'The teacher made a small correction.', word: 'correction', pos: 'noun', hint: 'đuôi "-tion" biến động từ "correct" thành danh từ.' },
  { sentence: 'She started a coin collection.', word: 'collection', pos: 'noun', hint: 'đuôi "-tion" biến động từ "collect" thành danh từ.' },
  { sentence: 'His prediction turned out to be right.', word: 'prediction', pos: 'noun', hint: 'đuôi "-tion" biến động từ "predict" thành danh từ.' },
  { sentence: 'Her quick reaction saved the day.', word: 'reaction', pos: 'noun', hint: 'đuôi "-tion" biến động từ "react" thành danh từ.' },
  { sentence: 'The factory increased its production.', word: 'production', pos: 'noun', hint: 'đuôi "-tion" biến động từ "produce" thành danh từ.' },
  { sentence: 'Workers finished the construction.', word: 'construction', pos: 'noun', hint: 'đuôi "-tion" biến động từ "construct" thành danh từ.' },
  { sentence: 'Good education helps children grow.', word: 'education', pos: 'noun', hint: 'đuôi "-tion" biến động từ "educate" thành danh từ.' },
  { sentence: 'They signed a written agreement.', word: 'agreement', pos: 'noun', hint: 'đuôi "-ment" biến động từ "agree" thành danh từ.' },
  { sentence: 'Winning the prize was a great achievement.', word: 'achievement', pos: 'noun', hint: 'đuôi "-ment" biến động từ "achieve" thành danh từ.' },
  // ----- Động từ (vòng 2) -----
  { sentence: 'They will finalize the contract tomorrow.', word: 'finalize', pos: 'verb', hint: 'đuôi "-ize" biến tính từ "final" thành động từ.' },
  { sentence: 'The team will coordinate the event.', word: 'coordinate', pos: 'verb', hint: 'đuôi "-ate" tạo động từ chỉ hành động.' },
  { sentence: 'The company wants to globalize its brand.', word: 'globalize', pos: 'verb', hint: 'đuôi "-ize" biến tính từ "global" thành động từ.' },
  { sentence: 'Please verify your identity.', word: 'verify', pos: 'verb', hint: 'đuôi "-ify" tạo động từ (nghĩa "làm cho đúng").' },
  { sentence: 'The teacher will evaluate the essays.', word: 'evaluate', pos: 'verb', hint: 'đuôi "-ate" tạo động từ chỉ hành động.' },
  { sentence: 'They plan to privatize the company.', word: 'privatize', pos: 'verb', hint: 'đuôi "-ize" biến tính từ "private" thành động từ.' },
  { sentence: 'The witness will testify in court.', word: 'testify', pos: 'verb', hint: 'đuôi "-ify" tạo động từ chỉ hành động.' },
  { sentence: 'The artist will illustrate the book.', word: 'illustrate', pos: 'verb', hint: 'đuôi "-ate" tạo động từ chỉ hành động.' },
  { sentence: 'He will sharpen the pencil.', word: 'sharpen', pos: 'verb', hint: 'đuôi "-en" biến tính từ "sharp" thành động từ.' },
  { sentence: 'The library will digitize old books.', word: 'digitize', pos: 'verb', hint: 'đuôi "-ize" biến danh từ "digit" thành động từ.' },
  { sentence: 'She will qualify for the finals.', word: 'qualify', pos: 'verb', hint: 'đuôi "-ify" biến danh từ "quality" thành động từ.' },
  { sentence: 'The nurse will sanitize the room.', word: 'sanitize', pos: 'verb', hint: 'đuôi "-ize" tạo động từ (nghĩa "làm cho sạch").' },
  { sentence: 'The school will notify parents.', word: 'notify', pos: 'verb', hint: 'đuôi "-ify" tạo động từ chỉ hành động.' },
  { sentence: 'The scientist will investigate the cause.', word: 'investigate', pos: 'verb', hint: 'đuôi "-ate" tạo động từ chỉ hành động.' },
  { sentence: 'The city will beautify the park.', word: 'beautify', pos: 'verb', hint: 'đuôi "-ify" biến tính từ "beautiful" thành động từ.' },
  // ----- Tính từ (vòng 2) -----
  { sentence: 'Being on time makes you responsible.', word: 'responsible', pos: 'adjective', hint: 'đuôi "-ible" tạo tính từ chỉ đặc điểm.' },
  { sentence: 'That was a memorable trip.', word: 'memorable', pos: 'adjective', hint: 'đuôi "-able" biến động từ "memorize" thành tính từ.' },
  { sentence: 'This is a historical building.', word: 'historical', pos: 'adjective', hint: 'đuôi "-al" biến danh từ "history" thành tính từ.' },
  { sentence: 'Smoking is harmful to health.', word: 'harmful', pos: 'adjective', hint: 'đuôi "-ful" biến danh từ "harm" thành tính từ.' },
  { sentence: 'She stayed hopeful during the storm.', word: 'hopeful', pos: 'adjective', hint: 'đuôi "-ful" biến danh từ "hope" thành tính từ.' },
  { sentence: 'His thoughtless comment upset her.', word: 'thoughtless', pos: 'adjective', hint: 'đuôi "-less" biến danh từ "thought" thành tính từ.' },
  { sentence: 'That old phone is useless now.', word: 'useless', pos: 'adjective', hint: 'đuôi "-less" biến danh từ "use" thành tính từ.' },
  { sentence: 'The comedian was very humorous.', word: 'humorous', pos: 'adjective', hint: 'đuôi "-ous" biến danh từ "humor" thành tính từ.' },
  { sentence: 'He is a generous man.', word: 'generous', pos: 'adjective', hint: 'đuôi "-ous" tạo tính từ chỉ tính cách.' },
  { sentence: 'She wore an attractive dress.', word: 'attractive', pos: 'adjective', hint: 'đuôi "-ive" biến động từ "attract" thành tính từ.' },
  { sentence: 'He leads an active lifestyle.', word: 'active', pos: 'adjective', hint: 'đuôi "-ive" biến động từ "act" thành tính từ.' },
  { sentence: 'The puppy is very energetic.', word: 'energetic', pos: 'adjective', hint: 'đuôi "-ic" biến danh từ "energy" thành tính từ.' },
  { sentence: 'This is a classic car.', word: 'classic', pos: 'adjective', hint: 'đuôi "-ic" tạo tính từ chỉ đặc điểm.' },
  { sentence: 'The shelf was covered in dusty books.', word: 'dusty', pos: 'adjective', hint: 'đuôi "-y" biến danh từ "dust" thành tính từ.' },
  { sentence: 'That was a foolish mistake.', word: 'foolish', pos: 'adjective', hint: 'đuôi "-ish" biến danh từ "fool" thành tính từ.' },
  // ----- Trạng từ (vòng 2) -----
  { sentence: 'He played the game badly.', word: 'badly', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "bad" thành trạng từ.' },
  { sentence: 'She closed the door gently.', word: 'gently', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "gentle" thành trạng từ.' },
  { sentence: 'The wind blew softly.', word: 'softly', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "soft" thành trạng từ.' },
  { sentence: 'The car moved rapidly.', word: 'rapidly', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "rapid" thành trạng từ.' },
  { sentence: 'She spoke calmly during the crisis.', word: 'calmly', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "calm" thành trạng từ.' },
  { sentence: 'The firefighter acted bravely.', word: 'bravely', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "brave" thành trạng từ.' },
  { sentence: 'He answered the question politely.', word: 'politely', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "polite" thành trạng từ.' },
  { sentence: 'The boat sailed roughly across the waves.', word: 'roughly', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "rough" thành trạng từ.' },
  { sentence: 'Please drive safely.', word: 'safely', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "safe" thành trạng từ.' },
  { sentence: 'Hopefully, the weather will improve.', word: 'Hopefully', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "hopeful" thành trạng từ.' },
  { sentence: 'They occasionally visit the museum.', word: 'occasionally', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "occasional" thành trạng từ.' },
  { sentence: 'She runs fast.', word: 'fast', pos: 'adverb', hint: 'trạng từ bất quy tắc, giống hệt dạng tính từ — không có đuôi "-ly", phải nhớ nghĩa.' },
  { sentence: 'He arrived late again.', word: 'late', pos: 'adverb', hint: 'trạng từ bất quy tắc, giống hệt dạng tính từ — không có đuôi "-ly", phải nhớ nghĩa.' },
  { sentence: 'I hardly know him.', word: 'hardly', pos: 'adverb', hint: 'không mang nghĩa "cứng" như tính từ "hard" — nghĩa đặc biệt là "hầu như không", phải nhớ nghĩa.' },
  { sentence: 'He works hard every day.', word: 'hard', pos: 'adverb', hint: 'trạng từ bất quy tắc (nghĩa "chăm chỉ"), giống hệt dạng tính từ "hard" — phải nhớ nghĩa qua ngữ cảnh.' },
  // ----- Giới từ (vòng 2) -----
  { sentence: 'The teacher stood among the students.', word: 'among', pos: 'preposition', hint: 'đứng trước danh từ số nhiều, chỉ VỊ TRÍ (ở giữa nhiều người/vật) → giới từ.' },
  { sentence: 'She sat beside her friend.', word: 'beside', pos: 'preposition', hint: 'đứng trước danh từ, chỉ VỊ TRÍ (bên cạnh) → giới từ.' },
  { sentence: 'The plane flew above the clouds.', word: 'above', pos: 'preposition', hint: 'đứng trước danh từ, chỉ VỊ TRÍ (phía trên) → giới từ.' },
  { sentence: 'The fish swam below the boat.', word: 'below', pos: 'preposition', hint: 'đứng trước danh từ, chỉ VỊ TRÍ (phía dưới) → giới từ.' },
  { sentence: 'The store is near my house.', word: 'near', pos: 'preposition', hint: 'đứng trước danh từ, chỉ VỊ TRÍ (gần) → giới từ.' },
  { sentence: 'They walked across the bridge.', word: 'across', pos: 'preposition', hint: 'đứng trước danh từ, chỉ HƯỚNG (băng qua) → giới từ.' },
  { sentence: 'We walked along the river.', word: 'along', pos: 'preposition', hint: 'đứng trước danh từ, chỉ HƯỚNG (dọc theo) → giới từ.' },
  { sentence: 'He ran towards the finish line.', word: 'towards', pos: 'preposition', hint: 'đứng trước danh từ, chỉ HƯỚNG (về phía) → giới từ.' },
  { sentence: 'She leaned against the wall.', word: 'against', pos: 'preposition', hint: 'đứng trước danh từ, chỉ VỊ TRÍ (tựa vào) → giới từ.' },
  { sentence: 'The park is beyond the hill.', word: 'beyond', pos: 'preposition', hint: 'đứng trước danh từ, chỉ VỊ TRÍ (bên kia) → giới từ.' },
  { sentence: 'The cat hid inside the box.', word: 'inside', pos: 'preposition', hint: 'đứng trước danh từ, chỉ VỊ TRÍ (bên trong) → giới từ.' },
  { sentence: 'They played outside the house.', word: 'outside', pos: 'preposition', hint: 'đứng trước danh từ, chỉ VỊ TRÍ (bên ngoài) → giới từ.' },
  { sentence: 'The cat slept underneath the blanket.', word: 'underneath', pos: 'preposition', hint: 'đứng trước danh từ, chỉ VỊ TRÍ (ngay bên dưới) → giới từ.' },
  { sentence: 'The bakery is opposite the bank.', word: 'opposite', pos: 'preposition', hint: 'đứng trước danh từ, chỉ VỊ TRÍ (đối diện) → giới từ.' },
  { sentence: 'It rained throughout the night.', word: 'throughout', pos: 'preposition', hint: 'đứng trước danh từ, chỉ THỜI GIAN (suốt cả) → giới từ.' },
  // ----- Đại từ (vòng 2) -----
  { sentence: 'This is ours.', word: 'ours', pos: 'pronoun', hint: 'thay cho "our house/thing" → đại từ SỞ HỮU.' },
  { sentence: 'Is that theirs?', word: 'theirs', pos: 'pronoun', hint: 'thay cho "their thing" → đại từ SỞ HỮU.' },
  { sentence: 'They love themselves too much.', word: 'themselves', pos: 'pronoun', hint: 'chỉ lại chính chủ ngữ "They" → đại từ PHẢN THÂN.' },
  { sentence: 'We enjoyed ourselves at the party.', word: 'ourselves', pos: 'pronoun', hint: 'chỉ lại chính chủ ngữ "We" → đại từ PHẢN THÂN.' },
  { sentence: 'What is that on the table?', word: 'What', pos: 'pronoun', hint: 'dùng để HỎI về một vật → đại từ NGHI VẤN.' },
  { sentence: 'Which one do you want?', word: 'Which', pos: 'pronoun', hint: 'dùng để HỎI chọn lựa → đại từ NGHI VẤN.' },
  { sentence: 'Someone left their bag here.', word: 'Someone', pos: 'pronoun', hint: 'thay cho "một người nào đó", không chỉ 1 danh từ cụ thể → đại từ BẤT ĐỊNH.' },
  { sentence: 'Something smells delicious.', word: 'Something', pos: 'pronoun', hint: 'thay cho "một thứ gì đó", không chỉ 1 danh từ cụ thể → đại từ BẤT ĐỊNH.' },
  { sentence: 'Anyone can join the club.', word: 'Anyone', pos: 'pronoun', hint: 'thay cho "bất kỳ ai", không chỉ 1 danh từ cụ thể → đại từ BẤT ĐỊNH.' },
  { sentence: 'None of them came to the party.', word: 'None', pos: 'pronoun', hint: 'thay cho "không một ai trong số họ" → đại từ BẤT ĐỊNH.' },
  { sentence: 'Both of us like music.', word: 'Both', pos: 'pronoun', hint: 'thay cho "hai người chúng tôi" → đại từ.' },
  { sentence: 'She likes the one that is red.', word: 'that', pos: 'pronoun', hint: 'thay cho "the one" để làm chủ ngữ vế sau → đại từ QUAN HỆ.' },
  { sentence: 'The man who called is my uncle.', word: 'who', pos: 'pronoun', hint: 'thay cho "the man" để làm chủ ngữ vế sau → đại từ QUAN HỆ.' },
  { sentence: 'This is the house which I bought.', word: 'which', pos: 'pronoun', hint: 'thay cho "the house" trong mệnh đề sau → đại từ QUAN HỆ.' },
  { sentence: 'They helped one another.', word: 'one another', pos: 'pronoun', hint: 'thay cho nhiều người đã nhắc, chỉ QUA LẠI lẫn nhau → đại từ.' },
  // ----- Liên từ (vòng 2) -----
  { sentence: 'As soon as she arrived, the meeting began.', word: 'As soon as', pos: 'conjunction', hint: 'nối 2 mệnh đề, chỉ THỜI ĐIỂM ngay sau đó → liên từ.' },
  { sentence: 'He left as if he was upset.', word: 'as if', pos: 'conjunction', hint: 'nối mệnh đề, chỉ SỰ SO SÁNH giả định → liên từ.' },
  { sentence: 'Even though he was tired, he kept working.', word: 'Even though', pos: 'conjunction', hint: 'nối 2 mệnh đề tương phản mạnh hơn "although" → liên từ.' },
  { sentence: 'In case it rains, take an umbrella.', word: 'In case', pos: 'conjunction', hint: 'nối mệnh đề, chỉ sự ĐỀ PHÒNG → liên từ.' },
  { sentence: 'As long as you try, you will improve.', word: 'As long as', pos: 'conjunction', hint: 'nối mệnh đề, chỉ ĐIỀU KIỆN → liên từ.' },
  { sentence: 'Provided that you finish, you can leave.', word: 'Provided that', pos: 'conjunction', hint: 'nối mệnh đề, chỉ ĐIỀU KIỆN → liên từ.' },
  { sentence: 'He plays soccer, whereas she plays tennis.', word: 'whereas', pos: 'conjunction', hint: 'nối 2 mệnh đề TƯƠNG PHẢN → liên từ.' },
  { sentence: 'Whoever wins gets the prize.', word: 'Whoever', pos: 'conjunction', hint: 'nối mệnh đề, chỉ BẤT KỲ AI → liên từ.' },
  { sentence: 'Wherever you go, I will follow.', word: 'Wherever', pos: 'conjunction', hint: 'nối mệnh đề, chỉ BẤT KỲ NƠI NÀO → liên từ.' },
  { sentence: 'Whenever it rains, we stay inside.', word: 'Whenever', pos: 'conjunction', hint: 'nối mệnh đề, chỉ BẤT KỲ LÚC NÀO → liên từ.' },
  { sentence: 'I will go if it is not too late.', word: 'if', pos: 'conjunction', hint: 'nối mệnh đề, chỉ ĐIỀU KIỆN → liên từ.' },
  { sentence: 'He apologized, yet she was still angry.', word: 'yet', pos: 'conjunction', hint: 'nối 2 mệnh đề TƯƠNG PHẢN → liên từ.' },
  { sentence: 'She is small but strong.', word: 'but', pos: 'conjunction', hint: 'nối 2 tính từ trái ngược → liên từ.' },
  { sentence: 'You can have cake or fruit for dessert.', word: 'or', pos: 'conjunction', hint: 'nối 2 lựa chọn → liên từ.' },
  { sentence: 'He was late, for the bus broke down.', word: 'for', pos: 'conjunction', hint: 'nối mệnh đề, chỉ LÝ DO (giống "because") → liên từ.' },
  // ----- Thán từ (vòng 2) -----
  { sentence: 'Aha! I found the answer.', word: 'Aha', pos: 'interjection', hint: 'thể hiện sự ĐẮC Ý khi khám phá ra điều gì → thán từ.' },
  { sentence: 'Phew! That was close.', word: 'Phew', pos: 'interjection', hint: 'thể hiện sự NHẸ NHÕM → thán từ.' },
  { sentence: 'Yikes! Watch out for that hole.', word: 'Yikes', pos: 'interjection', hint: 'thể hiện sự GIẬT MÌNH lo lắng → thán từ.' },
  { sentence: 'Gosh, I did not expect that.', word: 'Gosh', pos: 'interjection', hint: 'thể hiện sự NGẠC NHIÊN nhẹ → thán từ.' },
  { sentence: 'Well, I am not sure about that.', word: 'Well', pos: 'interjection', hint: 'dùng để NGẬP NGỪNG trước khi nói → thán từ.' },
  { sentence: 'Shh! The baby is sleeping.', word: 'Shh', pos: 'interjection', hint: 'dùng để YÊU CẦU im lặng → thán từ.' },
  { sentence: 'Eww, that smells terrible.', word: 'Eww', pos: 'interjection', hint: 'thể hiện sự GHÊ TỞM → thán từ.' },
  { sentence: 'Yuck, I do not like broccoli.', word: 'Yuck', pos: 'interjection', hint: 'thể hiện sự CHÊ BAI → thán từ.' },
  { sentence: 'Huh? What did you say?', word: 'Huh', pos: 'interjection', hint: 'thể hiện sự BỐI RỐI, chưa nghe rõ → thán từ.' },
  { sentence: 'Aww, the kitten is so cute.', word: 'Aww', pos: 'interjection', hint: 'thể hiện cảm xúc TRÌU MẾN → thán từ.' },
  { sentence: 'Gee, that was a long trip.', word: 'Gee', pos: 'interjection', hint: 'thể hiện sự NGẠC NHIÊN/THÁN PHỤC nhẹ → thán từ.' },
  { sentence: 'Yippee! We won the game.', word: 'Yippee', pos: 'interjection', hint: 'thể hiện SỰ VUI MỪNG → thán từ.' },
  { sentence: 'Ah, now I understand.', word: 'Ah', pos: 'interjection', hint: 'thể hiện sự VỠ LẼ → thán từ.' },
  { sentence: 'Oi! Watch where you are going.', word: 'Oi', pos: 'interjection', hint: 'dùng để GỌI/GÂY CHÚ Ý mạnh → thán từ.' },
  { sentence: 'Wowee, that was an amazing trick!', word: 'Wowee', pos: 'interjection', hint: 'thể hiện SỰ NGẠC NHIÊN thích thú → thán từ.' },
  // ----- Danh từ (vòng 3) -----
  { sentence: 'The importance of sleep is often ignored.', word: 'importance', pos: 'noun', hint: 'đuôi "-ance" biến tính từ "important" thành danh từ.' },
  { sentence: 'Her appearance surprised everyone.', word: 'appearance', pos: 'noun', hint: 'đuôi "-ance" biến động từ "appear" thành danh từ.' },
  { sentence: 'There is a big difference between the two.', word: 'difference', pos: 'noun', hint: 'đuôi "-ence" biến tính từ "different" thành danh từ.' },
  { sentence: 'Scientists study the existence of black holes.', word: 'existence', pos: 'noun', hint: 'đuôi "-ence" biến động từ "exist" thành danh từ.' },
  { sentence: 'Her presence made everyone comfortable.', word: 'presence', pos: 'noun', hint: 'đuôi "-ence" biến tính từ "present" thành danh từ.' },
  { sentence: 'The painter finished the mural.', word: 'painter', pos: 'noun', hint: 'đuôi "-er" chỉ NGƯỜI làm hành động ("paint" + "-er") → danh từ.' },
  { sentence: 'The driver stopped at the light.', word: 'driver', pos: 'noun', hint: 'đuôi "-er" chỉ NGƯỜI làm hành động ("drive" + "-er") → danh từ.' },
  { sentence: 'The dancer moved gracefully.', word: 'dancer', pos: 'noun', hint: 'đuôi "-er" chỉ NGƯỜI làm hành động ("dance" + "-er") → danh từ.' },
  { sentence: 'The swimmer broke the record.', word: 'swimmer', pos: 'noun', hint: 'đuôi "-er" chỉ NGƯỜI làm hành động ("swim" + "-er") → danh từ.' },
  { sentence: 'Every visitor must sign in.', word: 'visitor', pos: 'noun', hint: 'đuôi "-or" chỉ NGƯỜI làm hành động ("visit" + "-or") → danh từ.' },
  { sentence: 'She paid her club membership.', word: 'membership', pos: 'noun', hint: 'đuôi "-ship" chỉ MỐI QUAN HỆ/TƯ CÁCH ("member" + "-ship") → danh từ.' },
  { sentence: 'Good leadership inspires a team.', word: 'leadership', pos: 'noun', hint: 'đuôi "-ship" chỉ VAI TRÒ ("leader" + "-ship") → danh từ.' },
  { sentence: 'Our neighborhood is very quiet.', word: 'neighborhood', pos: 'noun', hint: 'đuôi "-hood" chỉ KHU VỰC ("neighbor" + "-hood") → danh từ.' },
  { sentence: 'The old man is full of wisdom.', word: 'wisdom', pos: 'noun', hint: 'đuôi "-dom" biến tính từ "wise" thành danh từ.' },
  { sentence: 'The long wait caused great boredom.', word: 'boredom', pos: 'noun', hint: 'đuôi "-dom" biến tính từ "bored" thành danh từ.' },
  // ----- Động từ (vòng 3) -----
  { sentence: 'The company will automate the process.', word: 'automate', pos: 'verb', hint: 'đuôi "-ate" biến tính từ "automatic" thành động từ.' },
  { sentence: 'Please indicate your choice.', word: 'indicate', pos: 'verb', hint: 'đuôi "-ate" tạo động từ chỉ hành động.' },
  { sentence: 'The coach will motivate the players.', word: 'motivate', pos: 'verb', hint: 'đuôi "-ate" biến danh từ "motive" thành động từ.' },
  { sentence: 'They will negotiate a new deal.', word: 'negotiate', pos: 'verb', hint: 'đuôi "-ate" tạo động từ chỉ hành động.' },
  { sentence: 'The workers will operate the machine.', word: 'operate', pos: 'verb', hint: 'đuôi "-ate" tạo động từ chỉ hành động.' },
  { sentence: 'Students can participate in the contest.', word: 'participate', pos: 'verb', hint: 'đuôi "-ate" tạo động từ chỉ hành động.' },
  { sentence: 'The government will regulate the market.', word: 'regulate', pos: 'verb', hint: 'đuôi "-ate" tạo động từ chỉ hành động.' },
  { sentence: 'The doctor will vaccinate the children.', word: 'vaccinate', pos: 'verb', hint: 'đuôi "-ate" biến danh từ "vaccine" thành động từ.' },
  { sentence: 'The teacher will separate the groups.', word: 'separate', pos: 'verb', hint: 'đuôi "-ate" tạo động từ chỉ hành động.' },
  { sentence: 'The engine will generate power.', word: 'generate', pos: 'verb', hint: 'đuôi "-ate" tạo động từ chỉ hành động.' },
  { sentence: 'The clerk will validate the ticket.', word: 'validate', pos: 'verb', hint: 'đuôi "-ate" biến tính từ "valid" thành động từ.' },
  { sentence: 'The manager will authorize the payment.', word: 'authorize', pos: 'verb', hint: 'đuôi "-ize" biến danh từ "authority" thành động từ.' },
  { sentence: 'The team will optimize the plan.', word: 'optimize', pos: 'verb', hint: 'đuôi "-ize" biến tính từ "optimal" thành động từ.' },
  { sentence: 'The chef will caramelize the sugar.', word: 'caramelize', pos: 'verb', hint: 'đuôi "-ize" biến danh từ "caramel" thành động từ.' },
  { sentence: 'The staff will sterilize the tools.', word: 'sterilize', pos: 'verb', hint: 'đuôi "-ize" biến tính từ "sterile" thành động từ.' },
  // ----- Tính từ (vòng 3) -----
  { sentence: 'This is a natural lake.', word: 'natural', pos: 'adjective', hint: 'đuôi "-al" biến danh từ "nature" thành tính từ.' },
  { sentence: 'She studies cultural history.', word: 'cultural', pos: 'adjective', hint: 'đuôi "-al" biến danh từ "culture" thành tính từ.' },
  { sentence: 'He needs a physical checkup.', word: 'physical', pos: 'adjective', hint: 'đuôi "-al" tạo tính từ chỉ đặc điểm.' },
  { sentence: 'The show had a magical feeling.', word: 'magical', pos: 'adjective', hint: 'đuôi "-al" biến danh từ "magic" thành tính từ.' },
  { sentence: 'She has strong musical talent.', word: 'musical', pos: 'adjective', hint: 'đuôi "-al" biến danh từ "music" thành tính từ.' },
  { sentence: 'The tropical island was beautiful.', word: 'tropical', pos: 'adjective', hint: 'đuôi "-al" tạo tính từ chỉ đặc điểm.' },
  { sentence: 'This is personal information.', word: 'personal', pos: 'adjective', hint: 'đuôi "-al" biến danh từ "person" thành tính từ.' },
  { sentence: 'Wear formal clothes to the event.', word: 'formal', pos: 'adjective', hint: 'đuôi "-al" tạo tính từ chỉ đặc điểm.' },
  { sentence: 'Choose a casual outfit today.', word: 'casual', pos: 'adjective', hint: 'đuôi "-al" tạo tính từ chỉ đặc điểm.' },
  { sentence: 'They use a digital camera.', word: 'digital', pos: 'adjective', hint: 'đuôi "-al" biến danh từ "digit" thành tính từ.' },
  { sentence: 'She is a careful driver.', word: 'careful', pos: 'adjective', hint: 'đuôi "-ful" biến danh từ "care" thành tính từ.' },
  { sentence: 'The garden is colorful in spring.', word: 'colorful', pos: 'adjective', hint: 'đuôi "-ful" biến danh từ "color" thành tính từ.' },
  { sentence: 'The engine is very powerful.', word: 'powerful', pos: 'adjective', hint: 'đuôi "-ful" biến danh từ "power" thành tính từ.' },
  { sentence: 'That was a wonderful surprise.', word: 'wonderful', pos: 'adjective', hint: 'đuôi "-ful" biến danh từ "wonder" thành tính từ.' },
  { sentence: 'It was a peaceful morning.', word: 'peaceful', pos: 'adjective', hint: 'đuôi "-ful" biến danh từ "peace" thành tính từ.' },
  // ----- Trạng từ (vòng 3) -----
  { sentence: 'She whispered quietly.', word: 'quietly', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "quiet" thành trạng từ.' },
  { sentence: 'He explained it clearly.', word: 'clearly', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "clear" thành trạng từ.' },
  { sentence: 'Please answer simply.', word: 'simply', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "simple" thành trạng từ.' },
  { sentence: 'The road leads directly to town.', word: 'directly', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "direct" thành trạng từ.' },
  { sentence: 'They eventually found the way.', word: 'eventually', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "eventual" thành trạng từ.' },
  { sentence: 'She finally arrived home.', word: 'finally', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "final" thành trạng từ.' },
  { sentence: 'Call me immediately.', word: 'immediately', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "immediate" thành trạng từ.' },
  { sentence: 'I saw him recently.', word: 'recently', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "recent" thành trạng từ.' },
  { sentence: 'The engine runs constantly.', word: 'constantly', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "constant" thành trạng từ.' },
  { sentence: 'He visits us frequently.', word: 'frequently', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "frequent" thành trạng từ.' },
  { sentence: 'The sky grew dark gradually.', word: 'gradually', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "gradual" thành trạng từ.' },
  { sentence: 'She apologized sincerely.', word: 'sincerely', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "sincere" thành trạng từ.' },
  { sentence: 'He waited patiently.', word: 'patiently', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "patient" thành trạng từ.' },
  { sentence: 'The team worked closely together.', word: 'closely', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "close" thành trạng từ.' },
  { sentence: 'She answered honestly and openly.', word: 'openly', pos: 'adverb', hint: 'đuôi "-ly" biến tính từ "open" thành trạng từ.' },
  // ----- Giới từ (vòng 3) -----
  { sentence: 'They talked about the movie.', word: 'about', pos: 'preposition', hint: 'đứng trước danh từ, chỉ CHỦ ĐỀ đang nói tới → giới từ.' },
  { sentence: 'The bird flew over the lake.', word: 'over', pos: 'preposition', hint: 'đứng trước danh từ, chỉ VỊ TRÍ (ngay phía trên) → giới từ.' },
  { sentence: 'He sat by the window.', word: 'by', pos: 'preposition', hint: 'đứng trước danh từ, chỉ VỊ TRÍ (bên cạnh, sát) → giới từ.' },
  { sentence: 'She agreed with the plan.', word: 'with', pos: 'preposition', hint: 'đứng trước danh từ, chỉ SỰ ĐI KÈM/ĐỒNG Ý → giới từ.' },
  { sentence: 'The gift is from my aunt.', word: 'from', pos: 'preposition', hint: 'đứng trước danh từ, chỉ NGUỒN GỐC → giới từ.' },
  { sentence: 'I have lived here since 2020.', word: 'since', pos: 'preposition', hint: 'đứng trước mốc thời gian, chỉ ĐIỂM BẮT ĐẦU → giới từ.' },
  { sentence: 'Wait until the bell rings.', word: 'until', pos: 'preposition', hint: 'đứng trước danh từ/mệnh đề, chỉ MỐC KẾT THÚC → giới từ.' },
  { sentence: 'Despite the rain, they played outside.', word: 'Despite', pos: 'preposition', hint: 'đứng trước danh từ, chỉ SỰ TƯƠNG PHẢN (mặc dù) → giới từ.' },
  { sentence: 'This is concerning your request.', word: 'concerning', pos: 'preposition', hint: 'đứng trước danh từ, chỉ CHỦ ĐỀ liên quan → giới từ.' },
  { sentence: 'They talked regarding the schedule.', word: 'regarding', pos: 'preposition', hint: 'đứng trước danh từ, chỉ CHỦ ĐỀ liên quan → giới từ.' },
  { sentence: 'Besides math, she likes art.', word: 'Besides', pos: 'preposition', hint: 'đứng trước danh từ, chỉ Ý "ngoài ra còn" → giới từ.' },
  { sentence: 'Everyone came except him.', word: 'except', pos: 'preposition', hint: 'đứng trước đại từ, chỉ SỰ LOẠI TRỪ → giới từ.' },
  { sentence: 'Place the vase upon the shelf.', word: 'upon', pos: 'preposition', hint: 'đứng trước danh từ, chỉ VỊ TRÍ (trên) → giới từ.' },
  { sentence: 'The cat jumped off the table.', word: 'off', pos: 'preposition', hint: 'đứng trước danh từ, chỉ HƯỚNG (rời khỏi) → giới từ.' },
  { sentence: 'He walked past the bakery.', word: 'past', pos: 'preposition', hint: 'đứng trước danh từ, chỉ HƯỚNG (đi qua) → giới từ.' },
  // ----- Đại từ (vòng 3) -----
  { sentence: 'She hurt herself while cooking.', word: 'herself', pos: 'pronoun', hint: 'chỉ lại chính chủ ngữ "She" → đại từ PHẢN THÂN.' },
  { sentence: 'The machine turned itself off.', word: 'itself', pos: 'pronoun', hint: 'chỉ lại chính chủ ngữ "The machine" → đại từ PHẢN THÂN.' },
  { sentence: 'Take care of yourself.', word: 'yourself', pos: 'pronoun', hint: 'chỉ lại người đang được nói tới (you) → đại từ PHẢN THÂN.' },
  { sentence: 'Please help yourselves to some food.', word: 'yourselves', pos: 'pronoun', hint: 'chỉ lại nhiều người đang được nói tới → đại từ PHẢN THÂN.' },
  { sentence: 'Whom did you invite?', word: 'Whom', pos: 'pronoun', hint: 'dùng để HỎI về tân ngữ chỉ người → đại từ NGHI VẤN.' },
  { sentence: 'Whose bag is this?', word: 'Whose', pos: 'pronoun', hint: 'dùng để HỎI về CHỦ SỞ HỮU → đại từ NGHI VẤN.' },
  { sentence: 'Is anybody home?', word: 'anybody', pos: 'pronoun', hint: 'thay cho "bất kỳ ai", không chỉ 1 người cụ thể → đại từ BẤT ĐỊNH.' },
  { sentence: 'Everybody enjoyed the concert.', word: 'Everybody', pos: 'pronoun', hint: 'thay cho "tất cả mọi người" → đại từ BẤT ĐỊNH.' },
  { sentence: 'Everything looks perfect.', word: 'Everything', pos: 'pronoun', hint: 'thay cho "mọi thứ" → đại từ BẤT ĐỊNH.' },
  { sentence: 'Nothing surprises her anymore.', word: 'Nothing', pos: 'pronoun', hint: 'thay cho "không có gì" → đại từ BẤT ĐỊNH.' },
  { sentence: 'Some students left, but others stayed.', word: 'others', pos: 'pronoun', hint: 'thay cho "những người khác" đã nhắc → đại từ.' },
  { sentence: 'Few of them understood the lesson.', word: 'Few', pos: 'pronoun', hint: 'thay cho "một số ít trong nhóm đã nhắc" → đại từ.' },
  { sentence: 'Many of the toys are broken.', word: 'Many', pos: 'pronoun', hint: 'thay cho "nhiều thứ trong nhóm đã nhắc" → đại từ.' },
  { sentence: 'Several of the answers were correct.', word: 'Several', pos: 'pronoun', hint: 'thay cho "một vài trong nhóm đã nhắc" → đại từ.' },
  { sentence: 'Each of us has a task.', word: 'Each', pos: 'pronoun', hint: 'thay cho "từng người trong nhóm" → đại từ.' },
  // ----- Liên từ (vòng 3) -----
  { sentence: 'She saved money so that she could travel.', word: 'so that', pos: 'conjunction', hint: 'nối mệnh đề, chỉ MỤC ĐÍCH → liên từ.' },
  { sentence: 'Once you finish, you can leave.', word: 'Once', pos: 'conjunction', hint: 'nối mệnh đề, chỉ THỜI ĐIỂM ngay sau khi → liên từ.' },
  { sentence: "Now that it is sunny, let's go out.", word: 'Now that', pos: 'conjunction', hint: 'nối mệnh đề, chỉ LÝ DO gắn với hiện tại → liên từ.' },
  { sentence: 'Given that he studied hard, he will pass.', word: 'Given that', pos: 'conjunction', hint: 'nối mệnh đề, chỉ LÝ DO/ĐIỀU KIỆN đã biết → liên từ.' },
  { sentence: 'No matter what happens, stay calm.', word: 'No matter what', pos: 'conjunction', hint: 'nối mệnh đề, chỉ Ý "dù thế nào đi nữa" → liên từ.' },
  { sentence: 'Whether or not it rains, we will go.', word: 'Whether or not', pos: 'conjunction', hint: 'nối mệnh đề, chỉ 2 khả năng đối lập → liên từ.' },
  { sentence: 'Either you apologize or you leave.', word: 'Either', pos: 'conjunction', hint: 'đi cùng "or" để nối 2 lựa chọn → liên từ.' },
  { sentence: 'Neither the cat nor the dog barked.', word: 'Neither', pos: 'conjunction', hint: 'đi cùng "nor" để nối 2 lựa chọn đều không đúng → liên từ.' },
  { sentence: 'She acted as though nothing happened.', word: 'as though', pos: 'conjunction', hint: 'nối mệnh đề, chỉ SỰ SO SÁNH giả định → liên từ.' },
  { sentence: 'They danced till midnight.', word: 'till', pos: 'conjunction', hint: 'nối mệnh đề, chỉ MỐC THỜI GIAN kết thúc (giống "until") → liên từ.' },
  { sentence: 'Speak softly lest you wake the baby.', word: 'lest', pos: 'conjunction', hint: 'nối mệnh đề, chỉ Ý "để tránh việc gì xảy ra" → liên từ.' },
  { sentence: 'He read a book whilst waiting.', word: 'whilst', pos: 'conjunction', hint: 'nối mệnh đề, chỉ 2 việc xảy ra cùng lúc (giống "while") → liên từ.' },
  { sentence: 'Considering the weather, we should stay home.', word: 'Considering', pos: 'conjunction', hint: 'nối mệnh đề, chỉ YẾU TỐ cần cân nhắc → liên từ.' },
  { sentence: 'I agree insofar as it is fair.', word: 'insofar as', pos: 'conjunction', hint: 'nối mệnh đề, chỉ MỨC ĐỘ đồng ý có điều kiện → liên từ.' },
  { sentence: 'We left directly after the show ended.', word: 'after', pos: 'conjunction', hint: 'nối mệnh đề, chỉ THỜI ĐIỂM sau đó → liên từ.' },
  // ----- Thán từ (vòng 3) -----
  { sentence: 'Ta-da! Here is the surprise.', word: 'Ta-da', pos: 'interjection', hint: 'dùng khi TIẾT LỘ điều gì bất ngờ → thán từ.' },
  { sentence: 'Boo! Did I scare you?', word: 'Boo', pos: 'interjection', hint: 'dùng để DỌA/GÂY BẤT NGỜ → thán từ.' },
  { sentence: "Alrighty, let's get started.", word: 'Alrighty', pos: 'interjection', hint: 'dùng để ĐỒNG Ý một cách vui vẻ → thán từ.' },
  { sentence: 'Hurray, the holidays are here!', word: 'Hurray', pos: 'interjection', hint: 'thể hiện SỰ VUI MỪNG → thán từ.' },
  { sentence: 'Meh, it was just okay.', word: 'Meh', pos: 'interjection', hint: 'thể hiện sự THỜ Ơ, không ấn tượng → thán từ.' },
  { sentence: 'Oof, that fall looked painful.', word: 'Oof', pos: 'interjection', hint: 'thể hiện phản ứng trước điều gì ĐAU/KHÓ CHỊU → thán từ.' },
  { sentence: 'Yowza, that car is fast!', word: 'Yowza', pos: 'interjection', hint: 'thể hiện SỰ KINH NGẠC → thán từ.' },
  { sentence: 'Golly, I did not know that.', word: 'Golly', pos: 'interjection', hint: 'thể hiện SỰ NGẠC NHIÊN nhẹ → thán từ.' },
  { sentence: 'Blimey, look at the size of that fish!', word: 'Blimey', pos: 'interjection', hint: 'thể hiện SỰ KINH NGẠC (kiểu Anh-Anh) → thán từ.' },
  { sentence: 'Whoa, slow down a little.', word: 'Whoa', pos: 'interjection', hint: 'dùng để YÊU CẦU chậm lại/thể hiện bất ngờ → thán từ.' },
  { sentence: 'Nah, I do not think so.', word: 'Nah', pos: 'interjection', hint: 'cách nói KHÔNG một cách thân mật → thán từ.' },
  { sentence: 'Yeah, that sounds like a good idea.', word: 'Yeah', pos: 'interjection', hint: 'cách nói CÓ/ĐỒNG Ý thân mật → thán từ.' },
  { sentence: "Okay, let's move on then.", word: 'Okay', pos: 'interjection', hint: 'dùng để XÁC NHẬN/chuyển ý → thán từ.' },
  { sentence: 'Bingo! You got it right.', word: 'Bingo', pos: 'interjection', hint: 'dùng khi TÌM RA/ĐOÁN ĐÚNG điều gì → thán từ.' },
  { sentence: 'Hmph, that is not fair.', word: 'Hmph', pos: 'interjection', hint: 'thể hiện sự KHÔNG HÀI LÒNG → thán từ.' },
  // ----- noun (vòng bổ sung 700→ nhiều hơn) -----
  { sentence: "The librarian gave us useful information.", word: "information", pos: 'noun', hint: "đuôi \"-ation\" biến động từ \"inform\" thành danh từ." },
  { sentence: "Good management keeps the store running smoothly.", word: "management", pos: 'noun', hint: "đuôi \"-ment\" biến động từ \"manage\" thành danh từ." },
  { sentence: "Her kindness made everyone feel welcome.", word: "kindness", pos: 'noun', hint: "đuôi \"-ness\" biến tính từ \"kind\" thành danh từ chỉ tính chất." },
  { sentence: "I could see the sadness in his eyes.", word: "sadness", pos: 'noun', hint: "đuôi \"-ness\" biến tính từ \"sad\" thành danh từ." },
  { sentence: "The kitten's curiosity led it under the bed.", word: "curiosity", pos: 'noun', hint: "đuôi \"-ity\" biến tính từ \"curious\" thành danh từ." },
  { sentence: "We were amazed by his generosity.", word: "generosity", pos: 'noun', hint: "đuôi \"-ity\" biến tính từ \"generous\" thành danh từ." },
  { sentence: "The scientist announced an exciting discovery.", word: "discovery", pos: 'noun', hint: "đuôi \"-ery\" biến động từ \"discover\" thành danh từ." },
  { sentence: "The delivery arrived earlier than expected.", word: "delivery", pos: 'noun', hint: "đuôi \"-ery\" biến động từ \"deliver\" thành danh từ." },
  { sentence: "Thank you for your assistance today.", word: "assistance", pos: 'noun', hint: "đuôi \"-ance\" biến động từ \"assist\" thành danh từ." },
  { sentence: "Attendance at the meeting was very high.", word: "Attendance", pos: 'noun', hint: "đuôi \"-ance\" biến động từ \"attend\" thành danh từ." },
  { sentence: "The old lock still put up some resistance.", word: "resistance", pos: 'noun', hint: "đuôi \"-ance\" biến động từ \"resist\" thành danh từ." },
  { sentence: "The country celebrates its independence every July.", word: "independence", pos: 'noun', hint: "đuôi \"-ence\" biến tính từ \"independent\" thành danh từ." },
  { sentence: "They built a strong relationship over the years.", word: "relationship", pos: 'noun', hint: "đuôi \"-ship\" biến động từ \"relate\" thành danh từ chỉ mối quan hệ." },
  { sentence: "She applied for citizenship last year.", word: "citizenship", pos: 'noun', hint: "đuôi \"-ship\" biến danh từ \"citizen\" thành danh từ trừu tượng." },
  { sentence: "The papers proved his ownership of the land.", word: "ownership", pos: 'noun', hint: "đuôi \"-ship\" biến động từ \"own\" thành danh từ." },
  { sentence: "The club felt like a real sisterhood.", word: "sisterhood", pos: 'noun', hint: "đuôi \"-hood\" biến danh từ \"sister\" thành danh từ chỉ tình thân/hội nhóm." },
  { sentence: "The soldiers shared a deep sense of brotherhood.", word: "brotherhood", pos: 'noun', hint: "đuôi \"-hood\" biến danh từ \"brother\" thành danh từ trừu tượng." },
  { sentence: "The professor explained how capitalism works.", word: "capitalism", pos: 'noun', hint: "đuôi \"-ism\" biến danh từ \"capital\" thành danh từ chỉ học thuyết/hệ thống." },
  { sentence: "The firefighter's heroism saved the family.", word: "heroism", pos: 'noun', hint: "đuôi \"-ism\" biến danh từ \"hero\" thành danh từ trừu tượng." },
  { sentence: "The knight rode across the whole kingdom.", word: "kingdom", pos: 'noun', hint: "đuôi \"-dom\" biến danh từ \"king\" thành danh từ chỉ lãnh thổ/phạm vi." },
  { sentence: "The singer performed three new songs.", word: "singer", pos: 'noun', hint: "đuôi \"-er\" biến động từ \"sing\" thành danh từ chỉ người thực hiện hành động." },
  { sentence: "My aunt is a famous writer.", word: "writer", pos: 'noun', hint: "đuôi \"-er\" biến động từ \"write\" thành danh từ chỉ người." },
  { sentence: "Every worker gets a break at noon.", word: "worker", pos: 'noun', hint: "đuôi \"-er\" biến động từ \"work\" thành danh từ chỉ người." },
  { sentence: "The director shouted, 'Cut!'", word: "director", pos: 'noun', hint: "đuôi \"-or\" biến động từ \"direct\" thành danh từ chỉ người." },
  { sentence: "The inventor patented a new machine.", word: "inventor", pos: 'noun', hint: "đuôi \"-or\" biến động từ \"invent\" thành danh từ chỉ người." },
  { sentence: "Our swimming instructor is very patient.", word: "instructor", pos: 'noun', hint: "đuôi \"-or\" biến động từ \"instruct\" thành danh từ chỉ người." },
  { sentence: "The conductor raised his baton.", word: "conductor", pos: 'noun', hint: "đuôi \"-or\" biến động từ \"conduct\" thành danh từ chỉ người." },
  { sentence: "The translator repeated the speech in Vietnamese.", word: "translator", pos: 'noun', hint: "đuôi \"-or\" biến động từ \"translate\" thành danh từ chỉ người." },
  { sentence: "I left my calculator at school.", word: "calculator", pos: 'noun', hint: "đuôi \"-or\" biến động từ \"calculate\" thành danh từ chỉ vật dùng để làm việc gì." },
  { sentence: "The museum displayed an ancient sculpture.", word: "sculpture", pos: 'noun', hint: "đuôi \"-ure\" biến động từ \"sculpt\" thành danh từ." },
  { sentence: "The experiment ended in complete failure.", word: "failure", pos: 'noun', hint: "đuôi \"-ure\" biến động từ \"fail\" thành danh từ." },
  { sentence: "It was a pleasure to meet you.", word: "pleasure", pos: 'noun', hint: "đuôi \"-ure\" biến động từ \"please\" thành danh từ." },
  { sentence: "Our departure was delayed by the storm.", word: "departure", pos: 'noun', hint: "đuôi \"-ure\" biến động từ \"depart\" thành danh từ." },
  { sentence: "I felt the warmth of the fire.", word: "warmth", pos: 'noun', hint: "đuôi \"-th\" biến tính từ \"warm\" thành danh từ." },
  { sentence: "He lifted the box with great strength.", word: "strength", pos: 'noun', hint: "đuôi \"-th\" biến tính từ \"strong\" thành danh từ (đổi dạng gốc)." },
  { sentence: "Measure the length of the table.", word: "length", pos: 'noun', hint: "đuôi \"-th\" biến tính từ \"long\" thành danh từ." },
  { sentence: "The tree showed rapid growth this year.", word: "growth", pos: 'noun', hint: "đuôi \"-th\" biến động từ \"grow\" thành danh từ." },
  { sentence: "The divers explored the depth of the lake.", word: "depth", pos: 'noun', hint: "đuôi \"-th\" biến tính từ \"deep\" thành danh từ." },
  { sentence: "The width of the road was narrow.", word: "width", pos: 'noun', hint: "đuôi \"-th\" biến tính từ \"wide\" thành danh từ." },
  { sentence: "I admire her honesty.", word: "honesty", pos: 'noun', hint: "đuôi \"-y\" biến tính từ \"honest\" thành danh từ." },
  { sentence: "The test presented no difficulty for her.", word: "difficulty", pos: 'noun', hint: "đuôi \"-ty\" biến tính từ \"difficult\" thành danh từ." },
  { sentence: "The movie felt like reality.", word: "reality", pos: 'noun', hint: "đuôi \"-ity\" biến tính từ \"real\" thành danh từ." },
  { sentence: "The band gained popularity overnight.", word: "popularity", pos: 'noun', hint: "đuôi \"-ity\" biến tính từ \"popular\" thành danh từ." },
  { sentence: "Wear a helmet for your safety.", word: "safety", pos: 'noun', hint: "đuôi \"-ty\" biến tính từ \"safe\" thành danh từ." },
  { sentence: "The dog showed great loyalty to its owner.", word: "loyalty", pos: 'noun', hint: "đuôi \"-ty\" biến tính từ \"loyal\" thành danh từ." },
  // ----- verb (vòng bổ sung 700→ nhiều hơn) -----
  { sentence: "You should apologize for being late.", word: "apologize", pos: 'verb', hint: "đuôi \"-ize\" biến danh từ \"apology\" thành động từ." },
  { sentence: "Please don't criticize his work in public.", word: "criticize", pos: 'verb', hint: "đuôi \"-ize\" biến danh từ \"critic\" thành động từ." },
  { sentence: "I recognize that voice from somewhere.", word: "recognize", pos: 'verb', hint: "đuôi \"-ize\" là dấu hiệu động từ thường gặp." },
  { sentence: "The teacher likes to emphasize good manners.", word: "emphasize", pos: 'verb', hint: "đuôi \"-ize\" biến danh từ \"emphasis\" thành động từ." },
  { sentence: "Loud colors characterize her painting style.", word: "characterize", pos: 'verb', hint: "đuôi \"-ize\" biến danh từ \"character\" thành động từ." },
  { sentence: "New students familiarize themselves with the map.", word: "familiarize", pos: 'verb', hint: "đuôi \"-ize\" biến tính từ \"familiar\" thành động từ." },
  { sentence: "The show helped popularize board games again.", word: "popularize", pos: 'verb', hint: "đuôi \"-ize\" biến tính từ \"popular\" thành động từ." },
  { sentence: "The country began to industrialize quickly.", word: "industrialize", pos: 'verb', hint: "đuôi \"-ize\" biến tính từ \"industrial\" thành động từ." },
  { sentence: "The school wants to standardize the uniform.", word: "standardize", pos: 'verb', hint: "đuôi \"-ize\" biến danh từ \"standard\" thành động từ." },
  { sentence: "Doctors often specialize in one field.", word: "specialize", pos: 'verb', hint: "đuôi \"-ize\" biến tính từ \"special\" thành động từ." },
  { sentence: "Puppies need to socialize with other dogs.", word: "socialize", pos: 'verb', hint: "đuôi \"-ize\" biến tính từ \"social\" thành động từ." },
  { sentence: "The accident forced them to hospitalize him.", word: "hospitalize", pos: 'verb', hint: "đuôi \"-ize\" biến danh từ \"hospital\" thành động từ." },
  { sentence: "The office plans to computerize its records.", word: "computerize", pos: 'verb', hint: "đuôi \"-ize\" biến danh từ \"computer\" thành động từ." },
  { sentence: "Can you identify the bird in this photo?", word: "identify", pos: 'verb', hint: "đuôi \"-ify\" biến danh từ \"identity\" thành động từ." },
  { sentence: "He couldn't justify the extra cost.", word: "justify", pos: 'verb', hint: "đuôi \"-ify\" biến tính từ \"just\" thành động từ." },
  { sentence: "Loud thunder can terrify small children.", word: "terrify", pos: 'verb', hint: "đuôi \"-ify\" biến danh từ \"terror\" thành động từ." },
  { sentence: "This filter can purify dirty water.", word: "purify", pos: 'verb', hint: "đuôi \"-ify\" biến tính từ \"pure\" thành động từ." },
  { sentence: "The leader tried to unify the two towns.", word: "unify", pos: 'verb', hint: "đuôi \"-ify\" biến động từ chỉ hành động hợp nhất." },
  { sentence: "The snack didn't satisfy my hunger.", word: "satisfy", pos: 'verb', hint: "đuôi \"-ify\"/\"-fy\" là dấu hiệu động từ thường gặp." },
  { sentence: "The speaker will amplify your voice.", word: "amplify", pos: 'verb', hint: "đuôi \"-ify\" biến tính từ \"ample\" thành động từ." },
  { sentence: "Cold water helps the gelatin solidify.", word: "solidify", pos: 'verb', hint: "đuôi \"-ify\" biến tính từ \"solid\" thành động từ." },
  { sentence: "The rain began to intensify at noon.", word: "intensify", pos: 'verb', hint: "đuôi \"-ify\" biến tính từ \"intense\" thành động từ." },
  { sentence: "The fox seems to personify cleverness in the story.", word: "personify", pos: 'verb', hint: "đuôi \"-ify\" biến danh từ \"person\" thành động từ." },
  { sentence: "Good books can educate young readers.", word: "educate", pos: 'verb', hint: "đuôi \"-ate\" là dấu hiệu động từ thường gặp." },
  { sentence: "We will decorate the hall for the party.", word: "decorate", pos: 'verb', hint: "đuôi \"-ate\" biến danh từ \"decor\" thành động từ." },
  { sentence: "Don't hesitate to ask for help.", word: "hesitate", pos: 'verb', hint: "đuôi \"-ate\" là dấu hiệu động từ thường gặp." },
  { sentence: "The two teams agreed to cooperate.", word: "cooperate", pos: 'verb', hint: "tiền tố \"co-\" nghĩa \"cùng nhau\" + đuôi \"-ate\"." },
  { sentence: "The champion continued to dominate the match.", word: "dominate", pos: 'verb', hint: "đuôi \"-ate\" biến tính từ \"dominant\" thành động từ." },
  { sentence: "Press the button to activate the alarm.", word: "activate", pos: 'verb', hint: "đuôi \"-ate\" biến tính từ \"active\" thành động từ." },
  { sentence: "One more rule will only complicate things.", word: "complicate", pos: 'verb', hint: "đuôi \"-ate\" là dấu hiệu động từ thường gặp." },
  { sentence: "I need silence to concentrate on my homework.", word: "concentrate", pos: 'verb', hint: "đuôi \"-ate\" là dấu hiệu động từ thường gặp." },
  { sentence: "Storm clouds began to darken the sky.", word: "darken", pos: 'verb', hint: "đuôi \"-en\" biến tính từ \"dark\" thành động từ." },
  { sentence: "The river seems to deepen near the bridge.", word: "deepen", pos: 'verb', hint: "đuôi \"-en\" biến tính từ \"deep\" thành động từ." },
  { sentence: "Rust can weaken the old fence.", word: "weaken", pos: 'verb', hint: "đuôi \"-en\" biến tính từ \"weak\" thành động từ." },
  { sentence: "Please loosen your grip on the rope.", word: "loosen", pos: 'verb', hint: "đuôi \"-en\" biến tính từ \"loose\" thành động từ." },
  { sentence: "Remember to tighten the bicycle wheel.", word: "tighten", pos: 'verb', hint: "đuôi \"-en\" biến tính từ \"tight\" thành động từ." },
  { sentence: "A funny joke can lighten the mood.", word: "lighten", pos: 'verb', hint: "đuôi \"-en\" biến tính từ \"light\" thành động từ." },
  { sentence: "The clay will harden overnight.", word: "harden", pos: 'verb', hint: "đuôi \"-en\" biến tính từ \"hard\" thành động từ." },
  { sentence: "Warm water will soften the butter.", word: "soften", pos: 'verb', hint: "đuôi \"-en\" biến tính từ \"soft\" thành động từ." },
  { sentence: "The sad movie will sadden many viewers.", word: "sadden", pos: 'verb', hint: "đuôi \"-en\" biến tính từ \"sad\" thành động từ." },
  { sentence: "Her cheeks began to redden from the cold.", word: "redden", pos: 'verb', hint: "đuôi \"-en\" biến tính từ \"red\" thành động từ." },
  { sentence: "We need to shorten this long essay.", word: "shorten", pos: 'verb', hint: "đuôi \"-en\" biến tính từ \"short\" thành động từ." },
  { sentence: "Workers plan to rebuild the broken bridge.", word: "rebuild", pos: 'verb', hint: "tiền tố \"re-\" nghĩa \"làm lại\" gắn vào động từ \"build\"." },
  { sentence: "I dislike waiting in long lines.", word: "dislike", pos: 'verb', hint: "tiền tố \"dis-\" mang nghĩa phủ định gắn vào động từ \"like\"." },
  { sentence: "Let's unpack the suitcase before dinner.", word: "unpack", pos: 'verb', hint: "tiền tố \"un-\" mang nghĩa \"làm ngược lại\" gắn vào động từ \"pack\"." },
  // ----- adjective (vòng bổ sung 700→ nhiều hơn) -----
  { sentence: "The singer became famous overnight.", word: "famous", pos: 'adjective', hint: "đuôi \"-ous\" biến danh từ \"fame\" thành tính từ." },
  { sentence: "The curious cat looked into the box.", word: "curious", pos: 'adjective', hint: "đuôi \"-ous\" là dấu hiệu tính từ thường gặp, liên hệ danh từ \"curiosity\"." },
  { sentence: "She felt nervous before the test.", word: "nervous", pos: 'adjective', hint: "đuôi \"-ous\" biến danh từ \"nerve\" thành tính từ." },
  { sentence: "He was jealous of his brother's new bike.", word: "jealous", pos: 'adjective', hint: "đuôi \"-ous\" là dấu hiệu tính từ thường gặp." },
  { sentence: "The old house looked mysterious at night.", word: "mysterious", pos: 'adjective', hint: "đuôi \"-ous\" biến danh từ \"mystery\" thành tính từ." },
  { sentence: "The soup smelled delicious.", word: "delicious", pos: 'adjective', hint: "đuôi \"-ous\" là dấu hiệu tính từ thường gặp." },
  { sentence: "Their new apartment is very spacious.", word: "spacious", pos: 'adjective', hint: "đuôi \"-ous\" biến danh từ \"space\" thành tính từ." },
  { sentence: "The host was gracious to every guest.", word: "gracious", pos: 'adjective', hint: "đuôi \"-ous\" biến danh từ \"grace\" thành tính từ." },
  { sentence: "She has an ambitious plan for the project.", word: "ambitious", pos: 'adjective', hint: "đuôi \"-ous\" biến danh từ \"ambition\" thành tính từ." },
  { sentence: "Be cautious when crossing the street.", word: "cautious", pos: 'adjective', hint: "đuôi \"-ous\" biến danh từ \"caution\" thành tính từ." },
  { sentence: "The children had a joyful afternoon.", word: "joyful", pos: 'adjective', hint: "đuôi \"-ful\" biến danh từ \"joy\" thành tính từ." },
  { sentence: "The puppy is playful with everyone.", word: "playful", pos: 'adjective', hint: "đuôi \"-ful\" biến danh từ \"play\" thành tính từ." },
  { sentence: "My grandfather is a bit forgetful these days.", word: "forgetful", pos: 'adjective', hint: "đuôi \"-ful\" biến động từ \"forget\" thành tính từ." },
  { sentence: "I am grateful for your help.", word: "grateful", pos: 'adjective', hint: "đuôi \"-ful\" là dấu hiệu tính từ thường gặp." },
  { sentence: "The carpenter is very skillful.", word: "skillful", pos: 'adjective', hint: "đuôi \"-ful\" biến danh từ \"skill\" thành tính từ." },
  { sentence: "Her tearful eyes showed how sad she was.", word: "tearful", pos: 'adjective', hint: "đuôi \"-ful\" biến danh từ \"tear\" thành tính từ." },
  { sentence: "Please be respectful to your teachers.", word: "respectful", pos: 'adjective', hint: "đuôi \"-ful\" biến danh từ \"respect\" thành tính từ." },
  { sentence: "We had a delightful evening together.", word: "delightful", pos: 'adjective', hint: "đuôi \"-ful\" biến danh từ \"delight\" thành tính từ." },
  { sentence: "I'm doubtful that it will rain today.", word: "doubtful", pos: 'adjective', hint: "đuôi \"-ful\" biến danh từ \"doubt\" thành tính từ." },
  { sentence: "The fearless firefighter ran into the smoke.", word: "fearless", pos: 'adjective', hint: "đuôi \"-less\" biến danh từ \"fear\" thành tính từ mang nghĩa phủ định." },
  { sentence: "The situation seemed hopeless at first.", word: "hopeless", pos: 'adjective', hint: "đuôi \"-less\" biến danh từ \"hope\" thành tính từ phủ định." },
  { sentence: "The desert stretched on in endless sand.", word: "endless", pos: 'adjective', hint: "đuôi \"-less\" biến danh từ \"end\" thành tính từ phủ định." },
  { sentence: "The painting is truly priceless.", word: "priceless", pos: 'adjective', hint: "đuôi \"-less\" biến danh từ \"price\" thành tính từ phủ định." },
  { sentence: "The kids grew restless on the long trip.", word: "restless", pos: 'adjective', hint: "đuôi \"-less\" biến danh từ \"rest\" thành tính từ phủ định." },
  { sentence: "The story has a timeless message.", word: "timeless", pos: 'adjective', hint: "đuôi \"-less\" biến danh từ \"time\" thành tính từ phủ định." },
  { sentence: "The soup was bland and tasteless.", word: "tasteless", pos: 'adjective', hint: "đuôi \"-less\" biến danh từ \"taste\" thành tính từ phủ định." },
  { sentence: "The shelter helps homeless families.", word: "homeless", pos: 'adjective', hint: "đuôi \"-less\" biến danh từ \"home\" thành tính từ phủ định." },
  { sentence: "She was breathless after the race.", word: "breathless", pos: 'adjective', hint: "đuôi \"-less\" biến danh từ \"breath\" thành tính từ phủ định." },
  { sentence: "The dancer made the move look effortless.", word: "effortless", pos: 'adjective', hint: "đuôi \"-less\" biến danh từ \"effort\" thành tính từ phủ định." },
  { sentence: "My parents are always supportive of my dreams.", word: "supportive", pos: 'adjective', hint: "đuôi \"-ive\" biến động từ \"support\" thành tính từ." },
  { sentence: "The child told an imaginative story.", word: "imaginative", pos: 'adjective', hint: "đuôi \"-ive\" biến động từ \"imagine\" thành tính từ." },
  { sentence: "The market is very competitive now.", word: "competitive", pos: 'adjective', hint: "đuôi \"-ive\" biến động từ \"compete\" thành tính từ." },
  { sentence: "The player took a defensive position.", word: "defensive", pos: 'adjective', hint: "đuôi \"-ive\" biến động từ \"defend\" thành tính từ." },
  { sentence: "That watch looks very expensive.", word: "expensive", pos: 'adjective', hint: "đuôi \"-ive\" biến danh từ \"expense\" thành tính từ." },
  { sentence: "The fireworks show was impressive.", word: "impressive", pos: 'adjective', hint: "đuôi \"-ive\" biến động từ \"impress\" thành tính từ." },
  { sentence: "The coach made a decisive choice.", word: "decisive", pos: 'adjective', hint: "đuôi \"-ive\" biến động từ \"decide\" thành tính từ." },
  { sentence: "His skin is sensitive to the sun.", word: "sensitive", pos: 'adjective', hint: "đuôi \"-ive\" biến danh từ \"sense\" thành tính từ." },
  { sentence: "This old car is still reliable.", word: "reliable", pos: 'adjective', hint: "đuôi \"-able\" biến động từ \"rely\" thành tính từ." },
  { sentence: "Her advice was very valuable.", word: "valuable", pos: 'adjective', hint: "đuôi \"-able\" biến danh từ \"value\" thành tính từ." },
  { sentence: "The trip was enjoyable for everyone.", word: "enjoyable", pos: 'adjective', hint: "đuôi \"-able\" biến động từ \"enjoy\" thành tính từ." },
  { sentence: "Handle the glass vase; it's breakable.", word: "breakable", pos: 'adjective', hint: "đuôi \"-able\" biến động từ \"break\" thành tính từ." },
  { sentence: "This jacket is machine washable.", word: "washable", pos: 'adjective', hint: "đuôi \"-able\" biến động từ \"wash\" thành tính từ." },
  { sentence: "The mountain was visible from the window.", word: "visible", pos: 'adjective', hint: "đuôi \"-ible\" biến động từ \"see\" (gốc Latin \"vis-\") thành tính từ." },
  { sentence: "Not every mushroom in the forest is edible.", word: "edible", pos: 'adjective', hint: "đuôi \"-ible\" là dấu hiệu tính từ thường gặp, nghĩa \"ăn được\"." },
  { sentence: "We had a terrible storm last night.", word: "terrible", pos: 'adjective', hint: "đuôi \"-ible\" biến danh từ \"terror\" thành tính từ." },
  // ----- adverb (vòng bổ sung 700→ nhiều hơn) -----
  { sentence: "He shook my hand firmly.", word: "firmly", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"firm\" thành trạng từ." },
  { sentence: "She spoke boldly in front of the class.", word: "boldly", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"bold\" thành trạng từ." },
  { sentence: "The winner proudly held up the trophy.", word: "proudly", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"proud\" thành trạng từ." },
  { sentence: "The nurse kindly explained the medicine.", word: "kindly", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"kind\" thành trạng từ." },
  { sentence: "Grandma greeted us warmly at the door.", word: "warmly", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"warm\" thành trạng từ." },
  { sentence: "He answered the question coldly.", word: "coldly", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"cold\" thành trạng từ." },
  { sentence: "The dog looked at us sadly.", word: "sadly", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"sad\" thành trạng từ." },
  { sentence: "She angrily slammed the door.", word: "angrily", pos: 'adverb', hint: "tính từ \"angry\" đổi \"y\" thành \"i\" rồi thêm \"-ly\"." },
  { sentence: "He nervously waited for his test results.", word: "nervously", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"nervous\" thành trạng từ." },
  { sentence: "The baby curiously touched the new toy.", word: "curiously", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"curious\" thành trạng từ." },
  { sentence: "Please take this warning seriously.", word: "seriously", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"serious\" thành trạng từ." },
  { sentence: "The park is mainly used by families.", word: "mainly", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"main\" thành trạng từ." },
  { sentence: "I love fruit, especially mangoes.", word: "especially", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"especial\" thành trạng từ, nhấn mạnh một điều cụ thể." },
  { sentence: "The soup was particularly spicy today.", word: "particularly", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"particular\" thành trạng từ." },
  { sentence: "Obviously, the answer is correct.", word: "Obviously", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"obvious\" thành trạng từ, bổ nghĩa cho cả câu." },
  { sentence: "Apparently, the shop is closed today.", word: "Apparently", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"apparent\" thành trạng từ, bổ nghĩa cho cả câu." },
  { sentence: "Naturally, the kids wanted to play outside.", word: "Naturally", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"natural\" thành trạng từ." },
  { sentence: "Basically, the plan stayed the same.", word: "Basically", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"basic\" thành trạng từ." },
  { sentence: "Generally, the weather here is mild.", word: "Generally", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"general\" thành trạng từ." },
  { sentence: "Normally, the bus arrives at eight.", word: "Normally", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"normal\" thành trạng từ." },
  { sentence: "I usually walk to school.", word: "usually", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"usual\" thành trạng từ." },
  { sentence: "We rarely eat out on weekdays.", word: "rarely", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"rare\" thành trạng từ." },
  { sentence: "He is seldom late for class.", word: "seldom", pos: 'adverb', hint: "trạng từ chỉ tần suất, không theo quy tắc đuôi \"-ly\", nghĩa \"hiếm khi\"." },
  { sentence: "I barely finished my homework in time.", word: "barely", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"bare\" thành trạng từ." },
  { sentence: "We nearly missed the train.", word: "nearly", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"near\" thành trạng từ." },
  { sentence: "The cake is mostly flour and sugar.", word: "mostly", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"most\" thành trạng từ." },
  { sentence: "The delay was partly due to the weather.", word: "partly", pos: 'adverb', hint: "đuôi \"-ly\" biến danh từ \"part\" thành trạng từ." },
  { sentence: "I am truly sorry for the mistake.", word: "truly", pos: 'adverb', hint: "tính từ \"true\" bỏ \"e\" rồi thêm \"-ly\"." },
  { sentence: "That movie was really exciting.", word: "really", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"real\" thành trạng từ." },
  { sentence: "Actually, I already finished my chores.", word: "Actually", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"actual\" thành trạng từ." },
  { sentence: "Certainly, you may borrow my pencil.", word: "Certainly", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"certain\" thành trạng từ." },
  { sentence: "I will definitely come to your party.", word: "definitely", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"definite\" thành trạng từ." },
  { sentence: "It will probably rain this afternoon.", word: "probably", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"probable\" thành trạng từ." },
  { sentence: "Could you possibly help me with this box?", word: "possibly", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"possible\" thành trạng từ." },
  { sentence: "Perhaps we should wait for the rain to stop.", word: "Perhaps", pos: 'adverb', hint: "trạng từ chỉ khả năng, không có đuôi \"-ly\", nghĩa \"có thể\"." },
  { sentence: "The children waved cheerfully at the parade.", word: "cheerfully", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"cheerful\" thành trạng từ." },
  { sentence: "Thankfully, no one was hurt in the accident.", word: "Thankfully", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"thankful\" thành trạng từ." },
  { sentence: "The puppy ran joyfully around the yard.", word: "joyfully", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"joyful\" thành trạng từ." },
  { sentence: "I'm terribly sorry for the noise.", word: "terribly", pos: 'adverb', hint: "tính từ \"terrible\" bỏ \"le\" rồi thêm \"-ly\"." },
  { sentence: "The plan went horribly wrong.", word: "horribly", pos: 'adverb', hint: "tính từ \"horrible\" bỏ \"le\" rồi thêm \"-ly\"." },
  { sentence: "The stars shone brightly last night.", word: "brightly", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"bright\" thành trạng từ." },
  { sentence: "The meeting went smoothly today.", word: "smoothly", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"smooth\" thành trạng từ." },
  { sentence: "The crowd cheered wildly for the team.", word: "wildly", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"wild\" thành trạng từ." },
  { sentence: "The new student shyly waved hello.", word: "shyly", pos: 'adverb', hint: "tính từ \"shy\" thêm \"-ly\" thành trạng từ." },
  { sentence: "The cat crept silently across the room.", word: "silently", pos: 'adverb', hint: "đuôi \"-ly\" biến tính từ \"silent\" thành trạng từ." },
  // ----- preposition (vòng bổ sung 700→ nhiều hơn) -----
  { sentence: "Please finish the test within one hour.", word: "within", pos: 'preposition', hint: "giới từ chỉ phạm vi thời gian/không gian, nghĩa \"trong vòng\"." },
  { sentence: "The house stood amid tall pine trees.", word: "amid", pos: 'preposition', hint: "giới từ chỉ vị trí, nghĩa \"giữa/ở giữa\"." },
  { sentence: "The dog ran alongside the bicycle.", word: "alongside", pos: 'preposition', hint: "giới từ chỉ vị trí, nghĩa \"bên cạnh, song song với\"." },
  { sentence: "A tiny flag sat atop the sandcastle.", word: "atop", pos: 'preposition', hint: "giới từ chỉ vị trí, nghĩa \"trên đỉnh\"." },
  { sentence: "It's team red versus team blue today.", word: "versus", pos: 'preposition', hint: "giới từ chỉ sự đối đầu, nghĩa \"đấu với\"." },
  { sentence: "The ticket costs ten dollars per person.", word: "per", pos: 'preposition', hint: "giới từ chỉ tỉ lệ, nghĩa \"mỗi/theo\"." },
  { sentence: "Two plus two equals four.", word: "plus", pos: 'preposition', hint: "giới từ chỉ phép cộng/thêm vào, nghĩa \"cộng thêm\"." },
  { sentence: "Ten minus three equals seven.", word: "minus", pos: 'preposition', hint: "giới từ chỉ phép trừ, nghĩa \"trừ đi\"." },
  { sentence: "Do unto others as you would have them do unto you.", word: "unto", pos: 'preposition', hint: "giới từ cổ, nghĩa giống \"to\"." },
  { sentence: "This old coin is worth a lot of money.", word: "worth", pos: 'preposition', hint: "giới từ chỉ giá trị, nghĩa \"đáng giá\"." },
  { sentence: "She sings like an angel.", word: "like", pos: 'preposition', hint: "giới từ so sánh, nghĩa \"giống như\" (không phải động từ \"thích\" ở đây)." },
  { sentence: "He works as a doctor at the hospital.", word: "as", pos: 'preposition', hint: "giới từ chỉ vai trò, nghĩa \"với vai trò là\"." },
  { sentence: "Unlike her sister, she loves spicy food.", word: "Unlike", pos: 'preposition', hint: "giới từ so sánh, nghĩa \"khác với\"." },
  { sentence: "The runner finished well ahead of the others.", word: "ahead of", pos: 'preposition', hint: "cụm giới từ chỉ vị trí/thời gian, nghĩa \"trước, đi trước\"." },
  { sentence: "We had soup instead of salad.", word: "instead of", pos: 'preposition', hint: "cụm giới từ chỉ sự thay thế, nghĩa \"thay vì\"." },
  { sentence: "The trip was cancelled because of the storm.", word: "because of", pos: 'preposition', hint: "cụm giới từ chỉ nguyên nhân, nghĩa \"vì, bởi vì\"." },
  { sentence: "According to the map, the store is nearby.", word: "According to", pos: 'preposition', hint: "cụm giới từ chỉ nguồn thông tin, nghĩa \"theo như\"." },
  { sentence: "The delay was due to heavy traffic.", word: "due to", pos: 'preposition', hint: "cụm giới từ chỉ nguyên nhân, nghĩa \"do bởi\"." },
  { sentence: "The bakery is next to the bank.", word: "next to", pos: 'preposition', hint: "cụm giới từ chỉ vị trí, nghĩa \"ngay bên cạnh\"." },
  { sentence: "Our house is close to the river.", word: "close to", pos: 'preposition', hint: "cụm giới từ chỉ vị trí, nghĩa \"gần\"." },
  { sentence: "Apart from math, I enjoy every subject.", word: "Apart from", pos: 'preposition', hint: "cụm giới từ chỉ ngoại lệ, nghĩa \"ngoài, trừ\"." },
  { sentence: "Aside from the rain, the trip was perfect.", word: "Aside from", pos: 'preposition', hint: "cụm giới từ chỉ ngoại lệ, nghĩa \"ngoài ra\"." },
  { sentence: "Stay away from the hot stove.", word: "away from", pos: 'preposition', hint: "cụm giới từ chỉ khoảng cách, nghĩa \"tránh xa\"." },
  { sentence: "The cat jumped out of the box.", word: "out of", pos: 'preposition', hint: "cụm giới từ chỉ chuyển động, nghĩa \"ra khỏi\"." },
  { sentence: "Kids up to age five can enter for free.", word: "up to", pos: 'preposition', hint: "cụm giới từ chỉ giới hạn, nghĩa \"đến, tối đa\"." },
  { sentence: "Please arrive prior to the start of the show.", word: "prior to", pos: 'preposition', hint: "cụm giới từ chỉ thời gian, nghĩa \"trước khi\"." },
  { sentence: "Contrary to popular belief, the test was easy.", word: "Contrary to", pos: 'preposition', hint: "cụm giới từ chỉ sự trái ngược, nghĩa \"trái với\"." },
  { sentence: "We finished early thanks to your help.", word: "thanks to", pos: 'preposition', hint: "cụm giới từ chỉ nguyên nhân tích cực, nghĩa \"nhờ vào\"." },
  { sentence: "We will go hiking regardless of the weather.", word: "regardless of", pos: 'preposition', hint: "cụm giới từ chỉ sự bất chấp, nghĩa \"bất kể\"." },
  { sentence: "In spite of the rain, we enjoyed the picnic.", word: "In spite of", pos: 'preposition', hint: "cụm giới từ chỉ sự nhượng bộ, nghĩa \"mặc dù\"." },
  { sentence: "She accepted the award on behalf of the team.", word: "on behalf of", pos: 'preposition', hint: "cụm giới từ chỉ sự đại diện, nghĩa \"thay mặt cho\"." },
  { sentence: "In addition to soccer, he plays chess.", word: "In addition to", pos: 'preposition', hint: "cụm giới từ chỉ sự bổ sung, nghĩa \"ngoài ra còn có\"." },
  { sentence: "Notwithstanding the cost, they bought the house.", word: "Notwithstanding", pos: 'preposition', hint: "giới từ trang trọng, nghĩa \"mặc dù, bất kể\"." },
  { sentence: "The case remains open, pending further review.", word: "pending", pos: 'preposition', hint: "giới từ chỉ trạng thái chờ, nghĩa \"trong khi chờ\"." },
  { sentence: "Everyone attended the meeting, save one manager.", word: "save", pos: 'preposition', hint: "giới từ cổ, nghĩa giống \"except\"." },
  { sentence: "Barring bad weather, the match will continue.", word: "Barring", pos: 'preposition', hint: "giới từ chỉ ngoại lệ có điều kiện, nghĩa \"trừ khi có\"." },
  { sentence: "The car parked in front of the house.", word: "in front of", pos: 'preposition', hint: "cụm giới từ chỉ vị trí, nghĩa \"phía trước\"." },
  { sentence: "In case of fire, use the stairs.", word: "In case of", pos: 'preposition', hint: "cụm giới từ chỉ tình huống giả định, nghĩa \"trong trường hợp\"." },
  { sentence: "The book sat on top of the shelf.", word: "on top of", pos: 'preposition', hint: "cụm giới từ chỉ vị trí, nghĩa \"trên đỉnh của\"." },
  { sentence: "The fountain stands in the middle of the square.", word: "in the middle of", pos: 'preposition', hint: "cụm giới từ chỉ vị trí, nghĩa \"ở giữa\"." },
  { sentence: "They crossed the river by means of a small boat.", word: "by means of", pos: 'preposition', hint: "cụm giới từ chỉ phương tiện, nghĩa \"bằng cách/nhờ vào\"." },
  { sentence: "He stayed calm for the sake of his team.", word: "for the sake of", pos: 'preposition', hint: "cụm giới từ chỉ mục đích, nghĩa \"vì lợi ích của\"." },
  { sentence: "With respect to the schedule, nothing has changed.", word: "With respect to", pos: 'preposition', hint: "cụm giới từ chỉ đối tượng đang bàn tới, nghĩa \"về vấn đề\"." },
  { sentence: "The city has grown a lot in terms of population.", word: "in terms of", pos: 'preposition', hint: "cụm giới từ chỉ khía cạnh, nghĩa \"về mặt\"." },
  { sentence: "We chose the train as opposed to the bus.", word: "as opposed to", pos: 'preposition', hint: "cụm giới từ chỉ sự đối lập lựa chọn, nghĩa \"thay vì, trái với\"." },
  // ----- pronoun (vòng bổ sung 700→ nhiều hơn) -----
  { sentence: "I am going to the market.", word: "I", pos: 'pronoun', hint: "đại từ nhân xưng ngôi thứ nhất số ít, làm chủ ngữ." },
  { sentence: "You are my best friend.", word: "You", pos: 'pronoun', hint: "đại từ nhân xưng ngôi thứ hai, dùng cho cả số ít và số nhiều." },
  { sentence: "He plays soccer every weekend.", word: "He", pos: 'pronoun', hint: "đại từ nhân xưng ngôi thứ ba số ít (nam), làm chủ ngữ." },
  { sentence: "We are going to the zoo tomorrow.", word: "We", pos: 'pronoun', hint: "đại từ nhân xưng ngôi thứ nhất số nhiều, làm chủ ngữ." },
  { sentence: "They live next door to us.", word: "They", pos: 'pronoun', hint: "đại từ nhân xưng ngôi thứ ba số nhiều, làm chủ ngữ." },
  { sentence: "Please give the ball to me.", word: "me", pos: 'pronoun', hint: "đại từ nhân xưng ngôi thứ nhất, làm tân ngữ (khác chủ ngữ \"I\")." },
  { sentence: "I saw them at the park yesterday.", word: "them", pos: 'pronoun', hint: "đại từ nhân xưng ngôi thứ ba số nhiều, làm tân ngữ." },
  { sentence: "I made this cake myself.", word: "myself", pos: 'pronoun', hint: "đại từ phản thân ngôi thứ nhất số ít, nhấn mạnh chủ thể tự làm." },
  { sentence: "This is my favorite book.", word: "This", pos: 'pronoun', hint: "đại từ chỉ định, chỉ vật/việc ở gần." },
  { sentence: "These are the shoes I bought.", word: "These", pos: 'pronoun', hint: "đại từ chỉ định số nhiều, chỉ vật ở gần." },
  { sentence: "Those belong to my sister.", word: "Those", pos: 'pronoun', hint: "đại từ chỉ định số nhiều, chỉ vật ở xa." },
  { sentence: "This cookie is good; may I have another?", word: "another", pos: 'pronoun', hint: "đại từ bất định, nghĩa \"một cái khác\"." },
  { sentence: "All of the cookies are gone.", word: "All", pos: 'pronoun', hint: "đại từ bất định chỉ toàn bộ số lượng." },
  { sentence: "Some of the guests already left.", word: "Some", pos: 'pronoun', hint: "đại từ bất định chỉ một phần số lượng." },
  { sentence: "Somebody left their umbrella here.", word: "Somebody", pos: 'pronoun', hint: "đại từ bất định, nghĩa \"ai đó\"." },
  { sentence: "Is there anything I can do to help?", word: "anything", pos: 'pronoun', hint: "đại từ bất định, nghĩa \"bất cứ điều gì\"." },
  { sentence: "One should always tell the truth.", word: "One", pos: 'pronoun', hint: "đại từ bất định trang trọng, nghĩa \"người ta, ai đó\"." },
  { sentence: "Such is the life of a farmer.", word: "Such", pos: 'pronoun', hint: "đại từ chỉ định trang trọng, nghĩa \"điều đó, như vậy\"." },
  { sentence: "Take whichever seat you like.", word: "whichever", pos: 'pronoun', hint: "đại từ quan hệ/bất định, nghĩa \"bất cứ cái nào\"." },
  { sentence: "Whoever finishes first wins a prize.", word: "Whoever", pos: 'pronoun', hint: "đại từ quan hệ/bất định, nghĩa \"bất cứ ai\"." },
  { sentence: "Invite whomever you want to the party.", word: "whomever", pos: 'pronoun', hint: "đại từ quan hệ (dạng tân ngữ của \"whoever\")." },
  { sentence: "Whatever you decide, I will support you.", word: "Whatever", pos: 'pronoun', hint: "đại từ quan hệ/bất định, nghĩa \"bất cứ điều gì\"." },
  { sentence: "Neither of the answers is correct.", word: "Neither", pos: 'pronoun', hint: "đại từ phủ định, nghĩa \"không cái nào trong hai\"." },
  { sentence: "Either of the two roads leads to town.", word: "Either", pos: 'pronoun', hint: "đại từ, nghĩa \"một trong hai (cái nào cũng được)\"." },
  { sentence: "One shoe is here; where is the other?", word: "other", pos: 'pronoun', hint: "đại từ, nghĩa \"cái/người còn lại\"." },
  { sentence: "One twin is tall; the other is short.", word: "the other", pos: 'pronoun', hint: "cụm đại từ, nghĩa \"người/cái còn lại (trong hai)\"." },
  { sentence: "A few of the students stayed late.", word: "A few", pos: 'pronoun', hint: "cụm đại từ chỉ số lượng nhỏ, đếm được." },
  { sentence: "A little of the soup is left.", word: "A little", pos: 'pronoun', hint: "cụm đại từ chỉ số lượng nhỏ, không đếm được." },
  { sentence: "Little was said about the accident.", word: "Little", pos: 'pronoun', hint: "đại từ chỉ số lượng nhỏ, không đếm được." },
  { sentence: "Much of the work is already done.", word: "Much", pos: 'pronoun', hint: "đại từ chỉ số lượng, không đếm được." },
  { sentence: "More of the cake is in the fridge.", word: "More", pos: 'pronoun', hint: "đại từ so sánh hơn về số lượng." },
  { sentence: "There is plenty of time left.", word: "plenty", pos: 'pronoun', hint: "đại từ chỉ số lượng nhiều, thoải mái." },
  { sentence: "We have enough for everyone.", word: "enough", pos: 'pronoun', hint: "đại từ chỉ số lượng đủ dùng." },
  { sentence: "All of us enjoyed the movie.", word: "All of us", pos: 'pronoun', hint: "cụm đại từ chỉ toàn bộ nhóm người nói." },
  { sentence: "None of us knew the answer.", word: "None of us", pos: 'pronoun', hint: "cụm đại từ phủ định, nghĩa \"không ai trong nhóm chúng tôi\"." },
  { sentence: "One of them forgot their homework.", word: "One of them", pos: 'pronoun', hint: "cụm đại từ, chỉ 1 người/vật trong nhóm." },
  { sentence: "Some of us want to stay longer.", word: "Some of us", pos: 'pronoun', hint: "cụm đại từ chỉ một phần trong nhóm." },
  { sentence: "Most of us agree with the plan.", word: "Most of us", pos: 'pronoun', hint: "cụm đại từ chỉ phần lớn trong nhóm." },
  { sentence: "Each of us has a different opinion.", word: "Each of us", pos: 'pronoun', hint: "cụm đại từ, nhấn mạnh từng cá nhân trong nhóm." },
  { sentence: "Either of them can answer your question.", word: "Either of them", pos: 'pronoun', hint: "cụm đại từ, nghĩa \"một trong hai người đó\"." },
  { sentence: "Neither of them wanted to leave first.", word: "Neither of them", pos: 'pronoun', hint: "cụm đại từ phủ định, \"không ai trong hai người đó\"." },
  { sentence: "Both of them passed the test.", word: "Both of them", pos: 'pronoun', hint: "cụm đại từ, nghĩa \"cả hai người đó\"." },
  { sentence: "All of them cheered at the same time.", word: "All of them", pos: 'pronoun', hint: "cụm đại từ, nghĩa \"tất cả bọn họ\"." },
  { sentence: "None of them showed up on time.", word: "None of them", pos: 'pronoun', hint: "cụm đại từ phủ định, \"không ai trong số họ\"." },
  { sentence: "Several of them already finished the race.", word: "Several of them", pos: 'pronoun', hint: "cụm đại từ chỉ vài người/vật trong nhóm." },
  // ----- conjunction (vòng bổ sung 700→ nhiều hơn) -----
  { sentence: "The plan worked, albeit slowly.", word: "albeit", pos: 'conjunction', hint: "liên từ trang trọng, nghĩa \"mặc dù, tuy rằng\"." },
  { sentence: "My brother is older than me.", word: "than", pos: 'conjunction', hint: "liên từ dùng trong so sánh hơn." },
  { sentence: "Brush your teeth before you go to bed.", word: "before", pos: 'conjunction', hint: "liên từ chỉ thời gian, nghĩa \"trước khi\" (khác giới từ \"before\" đứng trước danh từ)." },
  { sentence: "I'm not sure whether the shop is open.", word: "whether", pos: 'conjunction', hint: "liên từ giới thiệu câu hỏi gián tiếp, nghĩa \"liệu có... hay không\"." },
  { sentence: "Wait here until I come back.", word: "until", pos: 'conjunction', hint: "liên từ chỉ thời gian, nghĩa \"cho đến khi\" (khác giới từ \"until\" đứng trước danh từ)." },
  { sentence: "As I was leaving, it started to rain.", word: "As", pos: 'conjunction', hint: "liên từ chỉ thời gian/nguyên nhân, nghĩa \"khi/vì\"." },
  { sentence: "Seeing that it was late, we went home.", word: "Seeing that", pos: 'conjunction', hint: "liên từ nguyên nhân, nghĩa \"vì, xét thấy\"." },
  { sentence: "Speak clearly in order that everyone can hear.", word: "in order that", pos: 'conjunction', hint: "liên từ chỉ mục đích, nghĩa \"để cho\"." },
  { sentence: "As far as I know, the store is closed.", word: "As far as", pos: 'conjunction', hint: "liên từ giới hạn phạm vi, nghĩa \"theo như... biết\"." },
  { sentence: "The plan is risky in that it needs a lot of money.", word: "in that", pos: 'conjunction', hint: "liên từ giải thích, nghĩa \"ở chỗ là\"." },
  { sentence: "Granted that he is busy, he should still call.", word: "Granted that", pos: 'conjunction', hint: "liên từ nhượng bộ, nghĩa \"cho dù, thừa nhận rằng\"." },
  { sentence: "Supposing it rains, will the game still happen?", word: "Supposing", pos: 'conjunction', hint: "liên từ giả định, nghĩa \"giả sử\"." },
  { sentence: "Assuming that the bus is on time, we won't be late.", word: "Assuming that", pos: 'conjunction', hint: "liên từ giả định, nghĩa \"giả sử rằng\"." },
  { sentence: "Even if it rains, we will still go camping.", word: "Even if", pos: 'conjunction', hint: "liên từ nhượng bộ, nghĩa \"ngay cả khi\"." },
  { sentence: "As much as I like cake, I chose the fruit.", word: "As much as", pos: 'conjunction', hint: "liên từ nhượng bộ, nghĩa \"mặc dù rất... nhưng\"." },
  { sentence: "Inasmuch as you helped us, we are grateful.", word: "Inasmuch as", pos: 'conjunction', hint: "liên từ trang trọng, nghĩa \"bởi vì, vì lẽ rằng\"." },
  { sentence: "She plays piano as well as violin.", word: "as well as", pos: 'conjunction', hint: "liên từ bổ sung, nghĩa \"cũng như, và cả\"." },
  { sentence: "You may go outside, provided you finish your homework.", word: "provided", pos: 'conjunction', hint: "liên từ điều kiện, nghĩa \"miễn là\" (dạng ngắn của \"provided that\")." },
  { sentence: "I will come only if you invite my friend too.", word: "only if", pos: 'conjunction', hint: "liên từ điều kiện chặt, nghĩa \"chỉ khi\"." },
  { sentence: "Just as the movie started, the lights went out.", word: "Just as", pos: 'conjunction', hint: "liên từ chỉ thời điểm trùng khớp, nghĩa \"đúng lúc/giống như\"." },
  { sentence: "We stayed inside because it was raining.", word: "because", pos: 'conjunction', hint: "liên từ chỉ nguyên nhân." },
  { sentence: "Call me when you arrive home.", word: "when", pos: 'conjunction', hint: "liên từ chỉ thời gian." },
  { sentence: "She read a book while waiting for the bus.", word: "while", pos: 'conjunction', hint: "liên từ chỉ hai việc diễn ra song song." },
  { sentence: "It was cold, so I wore a jacket.", word: "so", pos: 'conjunction', hint: "liên từ chỉ kết quả." },
  { sentence: "If you study hard, you will pass the exam.", word: "If", pos: 'conjunction', hint: "liên từ điều kiện." },
  { sentence: "You can't enter unless you have a ticket.", word: "unless", pos: 'conjunction', hint: "liên từ điều kiện phủ định, nghĩa \"trừ khi\"." },
  { sentence: "He finished the race, though his leg hurt.", word: "though", pos: 'conjunction', hint: "liên từ nhượng bộ, nghĩa \"mặc dù\" (dạng ngắn của \"although\")." },
  { sentence: "I haven't seen her since we graduated.", word: "since", pos: 'conjunction', hint: "liên từ chỉ thời gian, nghĩa \"kể từ khi\"." },
  { sentence: "Although it was late, the children kept playing.", word: "Although", pos: 'conjunction', hint: "liên từ nhượng bộ." },
  { sentence: "We went home after the movie ended.", word: "after", pos: 'conjunction', hint: "liên từ chỉ thời gian, nghĩa \"sau khi\"." },
  { sentence: "No matter how hard it rains, the show will go on.", word: "No matter how", pos: 'conjunction', hint: "liên từ nhượng bộ, nghĩa \"dù cho... thế nào\"." },
  { sentence: "No matter who calls, please take a message.", word: "No matter who", pos: 'conjunction', hint: "liên từ nhượng bộ, nghĩa \"dù là ai\"." },
  { sentence: "No matter where you go, call me first.", word: "No matter where", pos: 'conjunction', hint: "liên từ nhượng bộ, nghĩa \"dù ở đâu\"." },
  { sentence: "No matter when you arrive, the door is open.", word: "No matter when", pos: 'conjunction', hint: "liên từ nhượng bộ, nghĩa \"dù là lúc nào\"." },
  { sentence: "You can stay up as long as you finish your homework.", word: "as long as", pos: 'conjunction', hint: "liên từ điều kiện, nghĩa \"miễn là\"." },
  { sentence: "Take an umbrella in case it rains.", word: "in case", pos: 'conjunction', hint: "liên từ chỉ đề phòng, nghĩa \"phòng khi\"." },
  { sentence: "She smiled even though she was tired.", word: "even though", pos: 'conjunction', hint: "liên từ nhượng bộ mạnh, nghĩa \"mặc dù (thực tế là)\"." },
  { sentence: "Now that the rain has stopped, let's go outside.", word: "Now that", pos: 'conjunction', hint: "liên từ chỉ nguyên nhân mới xảy ra, nghĩa \"bây giờ khi mà\"." },
  { sentence: "Given that it's a holiday, the shops are closed.", word: "Given that", pos: 'conjunction', hint: "liên từ chỉ điều kiện đã biết, nghĩa \"cho rằng, vì\"." },
  { sentence: "He likes tea, whereas his sister prefers coffee.", word: "whereas", pos: 'conjunction', hint: "liên từ đối lập nhẹ, nghĩa \"trong khi đó\"." },
  { sentence: "She doesn't like coffee, nor does she like tea.", word: "nor", pos: 'conjunction', hint: "liên từ phủ định nối tiếp, dùng sau mệnh đề phủ định." },
  { sentence: "The movie was long, yet very interesting.", word: "yet", pos: 'conjunction', hint: "liên từ đối lập, nghĩa \"nhưng, vậy mà\"." },
  { sentence: "He must be tired, for he worked all night.", word: "for", pos: 'conjunction', hint: "liên từ chỉ nguyên nhân trang trọng, nghĩa \"vì\" (khác giới từ \"for\")." },
  { sentence: "We danced till midnight.", word: "till", pos: 'conjunction', hint: "liên từ chỉ thời gian, nghĩa giống \"until\"." },
  { sentence: "Take a coat lest the wind turns cold.", word: "lest", pos: 'conjunction', hint: "liên từ chỉ sự lo ngại/phòng ngừa, nghĩa \"kẻo, để khỏi\"." },
  // ----- interjection (vòng bổ sung 700→ nhiều hơn) -----
  { sentence: "Jeez, that was a close call!", word: "Jeez", pos: 'interjection', hint: "thán từ diễn tả ngạc nhiên/khó chịu nhẹ." },
  { sentence: "Geez, I didn't expect that.", word: "Geez", pos: 'interjection', hint: "thán từ diễn tả bất ngờ." },
  { sentence: "Darn, I forgot my keys again.", word: "Darn", pos: 'interjection', hint: "thán từ diễn tả bực bội nhẹ." },
  { sentence: "Dang, that pizza looks delicious.", word: "Dang", pos: 'interjection', hint: "thán từ diễn tả ngạc nhiên/thán phục." },
  { sentence: "Crikey, look at the size of that spider!", word: "Crikey", pos: 'interjection', hint: "thán từ tiếng Anh-Úc diễn tả ngạc nhiên." },
  { sentence: "Cripes, I almost missed the bus.", word: "Cripes", pos: 'interjection', hint: "thán từ diễn tả ngạc nhiên nhẹ." },
  { sentence: "Sheesh, calm down, it's just a game.", word: "Sheesh", pos: 'interjection', hint: "thán từ diễn tả khó chịu nhẹ." },
  { sentence: "Whew, we made it just in time.", word: "Whew", pos: 'interjection', hint: "thán từ diễn tả nhẹ nhõm." },
  { sentence: "Argh, I dropped my ice cream.", word: "Argh", pos: 'interjection', hint: "thán từ diễn tả bực bội/thất vọng." },
  { sentence: "Grr, this puzzle is so tricky.", word: "Grr", pos: 'interjection', hint: "thán từ diễn tả bực bội, mô phỏng tiếng gầm gừ." },
  { sentence: "Ow, I stubbed my toe!", word: "Ow", pos: 'interjection', hint: "thán từ diễn tả đau đớn (ngắn hơn \"Ouch\")." },
  { sentence: "Yow, that water is freezing!", word: "Yow", pos: 'interjection', hint: "thán từ diễn tả đau/bất ngờ khó chịu." },
  { sentence: "Woo, we won the game!", word: "Woo", pos: 'interjection', hint: "thán từ diễn tả phấn khích." },
  { sentence: "Woohoo, summer vacation starts today!", word: "Woohoo", pos: 'interjection', hint: "thán từ diễn tả phấn khích mạnh." },
  { sentence: "Hurrah, the team scored a goal!", word: "Hurrah", pos: 'interjection', hint: "thán từ diễn tả vui mừng chiến thắng." },
  { sentence: "Ta, that's very kind of you.", word: "Ta", pos: 'interjection', hint: "thán từ tiếng Anh-Anh thân mật, nghĩa \"cảm ơn\"." },
  { sentence: "Cheers, thanks for the ride home!", word: "Cheers", pos: 'interjection', hint: "thán từ tiếng Anh-Anh, nghĩa \"cảm ơn\" hoặc lời chúc khi nâng ly." },
  { sentence: "Bless, the puppy fell asleep in my lap.", word: "Bless", pos: 'interjection', hint: "thán từ diễn tả sự trìu mến." },
  { sentence: "Goodness, how tall you have grown!", word: "Goodness", pos: 'interjection', hint: "thán từ diễn tả ngạc nhiên." },
  { sentence: "Man, this homework is taking forever.", word: "Man", pos: 'interjection', hint: "thán từ thân mật diễn tả cảm thán." },
  { sentence: "Dude, you have to see this!", word: "Dude", pos: 'interjection', hint: "thán từ thân mật gọi bạn bè, diễn tả ngạc nhiên." },
  { sentence: "Yo, wait for me!", word: "Yo", pos: 'interjection', hint: "thán từ thân mật để gọi ai đó." },
  { sentence: "Psst, come over here for a second.", word: "Psst", pos: 'interjection', hint: "thán từ để gọi ai đó khe khẽ, bí mật." },
  { sentence: "Tsk, you forgot your homework again.", word: "Tsk", pos: 'interjection', hint: "thán từ diễn tả không hài lòng." },
  { sentence: "Ahem, may I have your attention, please?", word: "Ahem", pos: 'interjection', hint: "thán từ mô phỏng tiếng hắng giọng để thu hút chú ý." },
  { sentence: "Hmm, let me think about that.", word: "Hmm", pos: 'interjection', hint: "thán từ diễn tả đang suy nghĩ." },
  { sentence: "Uh-oh, I think we're lost.", word: "Uh-oh", pos: 'interjection', hint: "thán từ diễn tả lo lắng khi có điều không ổn." },
  { sentence: "Ta-ta, see you tomorrow!", word: "Ta-ta", pos: 'interjection', hint: "thán từ tạm biệt thân mật, kiểu Anh." },
  { sentence: "Cor, that car is amazing!", word: "Cor", pos: 'interjection', hint: "thán từ tiếng Anh-Anh diễn tả ngạc nhiên/thán phục." },
  { sentence: "Fiddlesticks, I lost my homework again.", word: "Fiddlesticks", pos: 'interjection', hint: "thán từ cổ điển diễn tả bực bội nhẹ, hài hước." },
  { sentence: "Drat, I missed the bus.", word: "Drat", pos: 'interjection', hint: "thán từ diễn tả bực bội nhẹ." },
  { sentence: "Bah, I don't believe that story.", word: "Bah", pos: 'interjection', hint: "thán từ diễn tả coi thường/khó chịu." },
  { sentence: "Humbug, this whole thing is nonsense.", word: "Humbug", pos: 'interjection', hint: "thán từ diễn tả sự khinh thường, nghĩa \"vớ vẩn\"." },
  { sentence: "Rats, I forgot my umbrella.", word: "Rats", pos: 'interjection', hint: "thán từ diễn tả thất vọng nhẹ." },
  { sentence: "Bummer, the game got cancelled.", word: "Bummer", pos: 'interjection', hint: "thán từ diễn tả thất vọng." },
  { sentence: "Great, everyone made it on time!", word: "Great", pos: 'interjection', hint: "thán từ diễn tả hài lòng." },
  { sentence: "Cool, I love your new bike!", word: "Cool", pos: 'interjection', hint: "thán từ diễn tả thán phục." },
  { sentence: "Nice, you finally finished the puzzle!", word: "Nice", pos: 'interjection', hint: "thán từ diễn tả khen ngợi." },
  { sentence: "Awesome, we get to go early today!", word: "Awesome", pos: 'interjection', hint: "thán từ diễn tả phấn khích, thán phục." },
  { sentence: "Terrific, the whole class passed the test!", word: "Terrific", pos: 'interjection', hint: "thán từ diễn tả vui mừng mạnh." },
  { sentence: "Fantastic, you solved it on the first try!", word: "Fantastic", pos: 'interjection', hint: "thán từ diễn tả thán phục mạnh." },
  { sentence: "Ooh, that cake looks amazing!", word: "Ooh", pos: 'interjection', hint: "thán từ diễn tả trầm trồ, thích thú." },
  { sentence: "Aah, this warm bath feels wonderful.", word: "Aah", pos: 'interjection', hint: "thán từ diễn tả dễ chịu, thư giãn." },
  { sentence: "Yowie, that firework was huge!", word: "Yowie", pos: 'interjection', hint: "thán từ diễn tả ngạc nhiên mạnh." },
  { sentence: "Zowie, look at all those balloons!", word: "Zowie", pos: 'interjection', hint: "thán từ diễn tả kinh ngạc, thích thú." },
  // ----- noun (vòng bổ sung mục tiêu 850) -----
  { sentence: "Their marriage lasted for fifty happy years.", word: "marriage", pos: 'noun', hint: "đuôi \"-age\" biến động từ \"marry\" thành danh từ." },
  { sentence: "It took real courage to speak up.", word: "courage", pos: 'noun', hint: "đuôi \"-age\" là dấu hiệu danh từ thường gặp, gốc Latin \"cor\" (trái tim)." },
  { sentence: "The storm caused serious damage to the roof.", word: "damage", pos: 'noun', hint: "đuôi \"-age\" là dấu hiệu danh từ thường gặp." },
  { sentence: "We keep old boxes in storage.", word: "storage", pos: 'noun', hint: "đuôi \"-age\" biến động từ \"store\" thành danh từ." },
  { sentence: "The package arrived this morning.", word: "package", pos: 'noun', hint: "đuôi \"-age\" biến danh từ \"pack\" thành danh từ." },
  { sentence: "She left a short message on the phone.", word: "message", pos: 'noun', hint: "đuôi \"-age\" là dấu hiệu danh từ thường gặp." },
  { sentence: "The village sits beside a quiet river.", word: "village", pos: 'noun', hint: "đuôi \"-age\" biến gốc \"vill\" (khu định cư) thành danh từ." },
  { sentence: "The news gave full coverage of the event.", word: "coverage", pos: 'noun', hint: "đuôi \"-age\" biến động từ \"cover\" thành danh từ." },
  { sentence: "Please put your luggage in the trunk.", word: "luggage", pos: 'noun', hint: "đuôi \"-age\" biến động từ \"lug\" (mang vác) thành danh từ." },
  { sentence: "The car has low mileage for its age.", word: "mileage", pos: 'noun', hint: "đuôi \"-age\" biến danh từ \"mile\" thành danh từ." },
  { sentence: "The bakery sells fresh bread every morning.", word: "bakery", pos: 'noun', hint: "đuôi \"-ery\" biến động từ \"bake\" thành danh từ chỉ nơi chốn." },
  { sentence: "She wore beautiful jewelry to the party.", word: "jewelry", pos: 'noun', hint: "đuôi \"-ry\" biến danh từ \"jewel\" thành danh từ tập hợp." },
  { sentence: "The factory bought new machinery this year.", word: "machinery", pos: 'noun', hint: "đuôi \"-ery\" biến danh từ \"machine\" thành danh từ tập hợp." },
  { sentence: "The engineer designed a new bridge.", word: "engineer", pos: 'noun', hint: "đuôi \"-eer\" biến danh từ \"engine\" thành danh từ chỉ người." },
  { sentence: "The volunteer helped clean the beach.", word: "volunteer", pos: 'noun', hint: "đuôi \"-eer\" là dấu hiệu danh từ chỉ người thường gặp." },
  { sentence: "The musician played a beautiful melody.", word: "musician", pos: 'noun', hint: "đuôi \"-ian\" biến danh từ \"music\" thành danh từ chỉ người." },
  { sentence: "The magician pulled a rabbit from his hat.", word: "magician", pos: 'noun', hint: "đuôi \"-ian\" biến danh từ \"magic\" thành danh từ chỉ người." },
  { sentence: "The historian wrote a book about ancient Rome.", word: "historian", pos: 'noun', hint: "đuôi \"-ian\" biến danh từ \"history\" thành danh từ chỉ người." },
  { sentence: "The electrician fixed the broken wire.", word: "electrician", pos: 'noun', hint: "đuôi \"-ian\" biến danh từ \"electric\" thành danh từ chỉ người." },
  // ----- verb (vòng bổ sung mục tiêu 850) -----
  { sentence: "Don't overcook the pasta.", word: "overcook", pos: 'verb', hint: "tiền tố \"over-\" nghĩa \"quá mức\" + động từ \"cook\"." },
  { sentence: "If you undercook the chicken, it can be unsafe.", word: "undercook", pos: 'verb', hint: "tiền tố \"under-\" nghĩa \"chưa đủ mức\" + động từ \"cook\"." },
  { sentence: "I think you misunderstand my point.", word: "misunderstand", pos: 'verb', hint: "tiền tố \"mis-\" nghĩa \"sai\" + động từ \"understand\"." },
  { sentence: "The advertisement tried to mislead customers.", word: "mislead", pos: 'verb', hint: "tiền tố \"mis-\" nghĩa \"sai\" + động từ \"lead\"." },
  { sentence: "We got to preview the movie before release.", word: "preview", pos: 'verb', hint: "tiền tố \"pre-\" nghĩa \"trước\" + động từ \"view\"." },
  { sentence: "Preheat the oven to 200 degrees.", word: "Preheat", pos: 'verb', hint: "tiền tố \"pre-\" nghĩa \"trước\" + động từ \"heat\"." },
  { sentence: "They decided to postpone the wedding.", word: "postpone", pos: 'verb', hint: "tiền tố \"post-\" nghĩa \"sau\" ghép với gốc Latin \"pone\" (đặt)." },
  { sentence: "Please don't overreact to the bad news.", word: "overreact", pos: 'verb', hint: "tiền tố \"over-\" nghĩa \"quá mức\" + động từ \"react\"." },
  { sentence: "I sometimes oversleep on weekends.", word: "oversleep", pos: 'verb', hint: "tiền tố \"over-\" nghĩa \"quá mức\" + động từ \"sleep\"." },
  { sentence: "The shop tried to overcharge the tourists.", word: "overcharge", pos: 'verb', hint: "tiền tố \"over-\" nghĩa \"quá mức\" + động từ \"charge\"." },
  { sentence: "I always misplace my keys.", word: "misplace", pos: 'verb', hint: "tiền tố \"mis-\" nghĩa \"sai\" + động từ \"place\"." },
  { sentence: "Some people mistrust strangers at first.", word: "mistrust", pos: 'verb', hint: "tiền tố \"mis-\" nghĩa \"sai/thiếu\" + động từ \"trust\"." },
  { sentence: "You can prepay for the tickets online.", word: "prepay", pos: 'verb', hint: "tiền tố \"pre-\" nghĩa \"trước\" + động từ \"pay\"." },
  { sentence: "You will have to redo this exercise.", word: "redo", pos: 'verb', hint: "tiền tố \"re-\" nghĩa \"làm lại\" + động từ \"do\"." },
  { sentence: "The store will reopen next Monday.", word: "reopen", pos: 'verb', hint: "tiền tố \"re-\" nghĩa \"lại\" + động từ \"open\"." },
  { sentence: "We should reuse these plastic bags.", word: "reuse", pos: 'verb', hint: "tiền tố \"re-\" nghĩa \"lại\" + động từ \"use\"." },
  { sentence: "The soldiers stopped to regroup.", word: "regroup", pos: 'verb', hint: "tiền tố \"re-\" nghĩa \"lại\" + động từ \"group\"." },
  { sentence: "The team had to rethink their plan.", word: "rethink", pos: 'verb', hint: "tiền tố \"re-\" nghĩa \"lại\" + động từ \"think\"." },
  { sentence: "Use this key to unlock the door.", word: "unlock", pos: 'verb', hint: "tiền tố \"un-\" nghĩa \"ngược lại\" + động từ \"lock\"." },
  // ----- adjective (vòng bổ sung mục tiêu 850) -----
  { sentence: "We stayed inside on a rainy day.", word: "rainy", pos: 'adjective', hint: "đuôi \"-y\" biến danh từ \"rain\" thành tính từ." },
  { sentence: "It was too windy to fly a kite.", word: "windy", pos: 'adjective', hint: "đuôi \"-y\" biến danh từ \"wind\" thành tính từ." },
  { sentence: "The sky looks cloudy this morning.", word: "cloudy", pos: 'adjective', hint: "đuôi \"-y\" biến danh từ \"cloud\" thành tính từ." },
  { sentence: "The beach has soft, sandy ground.", word: "sandy", pos: 'adjective', hint: "đuôi \"-y\" biến danh từ \"sand\" thành tính từ." },
  { sentence: "The path up the hill was rocky.", word: "rocky", pos: 'adjective', hint: "đuôi \"-y\" biến danh từ \"rock\" thành tính từ." },
  { sentence: "Be careful, the road is icy today.", word: "icy", pos: 'adjective', hint: "đuôi \"-y\" biến danh từ \"ice\" thành tính từ." },
  { sentence: "My boots got muddy in the field.", word: "muddy", pos: 'adjective', hint: "đuôi \"-y\" biến danh từ \"mud\" thành tính từ." },
  { sentence: "The mountains looked snowy in winter.", word: "snowy", pos: 'adjective', hint: "đuôi \"-y\" biến danh từ \"snow\" thành tính từ." },
  { sentence: "The baby looked sleepy after lunch.", word: "sleepy", pos: 'adjective', hint: "đuôi \"-y\" biến động từ \"sleep\" thành tính từ." },
  { sentence: "The children were hungry after school.", word: "hungry", pos: 'adjective', hint: "đuôi \"-y\" biến danh từ \"hunger\" thành tính từ." },
  { sentence: "The sunset turned the sky reddish.", word: "reddish", pos: 'adjective', hint: "đuôi \"-ish\" biến tính từ \"red\" thành tính từ mang nghĩa \"hơi/ngả màu\"." },
  { sentence: "The old coin had a greenish color.", word: "greenish", pos: 'adjective', hint: "đuôi \"-ish\" biến tính từ \"green\" thành tính từ \"hơi xanh\"." },
  { sentence: "It was selfish of him not to share.", word: "selfish", pos: 'adjective', hint: "đuôi \"-ish\" biến danh từ \"self\" thành tính từ." },
  { sentence: "She wore a stylish new coat.", word: "stylish", pos: 'adjective', hint: "đuôi \"-ish\" biến danh từ \"style\" thành tính từ." },
  { sentence: "My little brother is very ticklish.", word: "ticklish", pos: 'adjective', hint: "đuôi \"-ish\" biến động từ \"tickle\" thành tính từ." },
  { sentence: "The old wooden chair creaked loudly.", word: "wooden", pos: 'adjective', hint: "đuôi \"-en\" biến danh từ \"wood\" thành tính từ chỉ chất liệu." },
  { sentence: "The princess wore a golden crown.", word: "golden", pos: 'adjective', hint: "đuôi \"-en\" biến danh từ \"gold\" thành tính từ chỉ chất liệu." },
  { sentence: "She knitted a warm woolen sweater.", word: "woolen", pos: 'adjective', hint: "đuôi \"-en\" biến danh từ \"wool\" thành tính từ chỉ chất liệu." },
  { sentence: "The dress was made of silken fabric.", word: "silken", pos: 'adjective', hint: "đuôi \"-en\" biến danh từ \"silk\" thành tính từ chỉ chất liệu." },
  // ----- adverb (vòng bổ sung mục tiêu 850) -----
  { sentence: "There is a good bakery nearby.", word: "nearby", pos: 'adverb', hint: "trạng từ chỉ nơi chốn, nghĩa \"gần đây\", không theo quy tắc đuôi \"-ly\"." },
  { sentence: "She plans to study abroad next year.", word: "abroad", pos: 'adverb', hint: "trạng từ chỉ nơi chốn, nghĩa \"ở nước ngoài\"." },
  { sentence: "The bedrooms are upstairs.", word: "upstairs", pos: 'adverb', hint: "trạng từ chỉ nơi chốn, nghĩa \"trên tầng\"." },
  { sentence: "Breakfast is ready downstairs.", word: "downstairs", pos: 'adverb', hint: "trạng từ chỉ nơi chốn, nghĩa \"dưới tầng\"." },
  { sentence: "We stayed indoors because of the rain.", word: "indoors", pos: 'adverb', hint: "trạng từ chỉ nơi chốn, nghĩa \"trong nhà\"." },
  { sentence: "The kids love playing outdoors.", word: "outdoors", pos: 'adverb', hint: "trạng từ chỉ nơi chốn, nghĩa \"ngoài trời\"." },
  { sentence: "I looked everywhere for my glasses.", word: "everywhere", pos: 'adverb', hint: "trạng từ chỉ nơi chốn, nghĩa \"khắp mọi nơi\"." },
  { sentence: "I left my bag somewhere in the room.", word: "somewhere", pos: 'adverb', hint: "trạng từ chỉ nơi chốn, nghĩa \"ở đâu đó\"." },
  { sentence: "You can sit anywhere you like.", word: "anywhere", pos: 'adverb', hint: "trạng từ chỉ nơi chốn, nghĩa \"bất cứ đâu\"." },
  { sentence: "My keys are nowhere to be found.", word: "nowhere", pos: 'adverb', hint: "trạng từ chỉ nơi chốn, nghĩa \"không ở đâu cả\"." },
  { sentence: "Please step forward one at a time.", word: "forward", pos: 'adverb', hint: "trạng từ chỉ hướng, nghĩa \"về phía trước\"." },
  { sentence: "The car rolled backward down the hill.", word: "backward", pos: 'adverb', hint: "trạng từ chỉ hướng, nghĩa \"về phía sau\"." },
  { sentence: "The crab moved sideways across the sand.", word: "sideways", pos: 'adverb', hint: "trạng từ chỉ hướng, nghĩa \"theo chiều ngang\"." },
  { sentence: "Look ahead before crossing the street.", word: "ahead", pos: 'adverb', hint: "trạng từ chỉ hướng, nghĩa \"phía trước\"." },
  { sentence: "The family cooked dinner together.", word: "together", pos: 'adverb', hint: "trạng từ chỉ cách thức, nghĩa \"cùng nhau\"." },
  { sentence: "He prefers to work alone.", word: "alone", pos: 'adverb', hint: "trạng từ chỉ cách thức, nghĩa \"một mình\"." },
  { sentence: "She read the letter aloud.", word: "aloud", pos: 'adverb', hint: "trạng từ chỉ cách thức, nghĩa \"thành tiếng\"." },
  { sentence: "Could you say that again?", word: "again", pos: 'adverb', hint: "trạng từ chỉ tần suất, nghĩa \"lần nữa\"." },
  { sentence: "I have already finished my homework.", word: "already", pos: 'adverb', hint: "trạng từ chỉ thời gian, nghĩa \"đã... rồi\"." },
  // ----- preposition (vòng bổ sung mục tiêu 850) -----
  { sentence: "The cat jumped onto the table.", word: "onto", pos: 'preposition', hint: "giới từ chỉ chuyển động, nghĩa \"lên trên\"." },
  { sentence: "We traveled to Hanoi via Da Nang.", word: "via", pos: 'preposition', hint: "giới từ chỉ đường đi/phương thức, nghĩa \"qua ngả\"." },
  { sentence: "The cabin stood amidst the tall trees.", word: "amidst", pos: 'preposition', hint: "giới từ chỉ vị trí, nghĩa \"giữa\" (dạng cổ của \"amid\")." },
  { sentence: "The treasure was buried beneath the sand.", word: "beneath", pos: 'preposition', hint: "giới từ chỉ vị trí, nghĩa \"bên dưới\"." },
  { sentence: "The castle was built circa 1200.", word: "circa", pos: 'preposition', hint: "giới từ chỉ thời gian ước lượng, nghĩa \"khoảng\"." },
  { sentence: "All passengers are now aboard the plane.", word: "aboard", pos: 'preposition', hint: "giới từ chỉ vị trí, nghĩa \"trên (tàu/thuyền/máy bay)\"." },
  { sentence: "The runners moved abreast of each other.", word: "abreast", pos: 'preposition', hint: "giới từ chỉ vị trí, nghĩa \"ngang hàng với\"." },
  { sentence: "The cowboy sat astride his horse.", word: "astride", pos: 'preposition', hint: "giới từ chỉ vị trí, nghĩa \"cưỡi/dang chân trên\"." },
  { sentence: "The children ran round the tree.", word: "round", pos: 'preposition', hint: "giới từ chỉ chuyển động, nghĩa \"vòng quanh\" (kiểu Anh-Anh của \"around\")." },
  { sentence: "We reached the village by way of the old bridge.", word: "by way of", pos: 'preposition', hint: "cụm giới từ chỉ đường đi, nghĩa \"qua ngả\"." },
  { sentence: "Most people voted in favor of the plan.", word: "in favor of", pos: 'preposition', hint: "cụm giới từ chỉ sự ủng hộ, nghĩa \"ủng hộ\"." },
  { sentence: "The trip was cancelled on account of the storm.", word: "on account of", pos: 'preposition', hint: "cụm giới từ chỉ nguyên nhân, nghĩa \"vì lý do\"." },
  { sentence: "The village suffered at the hands of the flood.", word: "at the hands of", pos: 'preposition', hint: "cụm giới từ chỉ tác nhân gây ra, nghĩa \"bởi tay của\"." },
  { sentence: "She whispered for fear of waking the baby.", word: "for fear of", pos: 'preposition', hint: "cụm giới từ chỉ lý do lo sợ, nghĩa \"vì sợ\"." },
  { sentence: "In light of the new facts, we changed our plan.", word: "In light of", pos: 'preposition', hint: "cụm giới từ chỉ căn cứ, nghĩa \"xét theo\"." },
  { sentence: "He was hired on the basis of his experience.", word: "on the basis of", pos: 'preposition', hint: "cụm giới từ chỉ căn cứ, nghĩa \"dựa trên cơ sở\"." },
  { sentence: "With reference to your email, the meeting is confirmed.", word: "With reference to", pos: 'preposition', hint: "cụm giới từ chỉ đối tượng đang nhắc tới, nghĩa \"liên quan đến\"." },
  { sentence: "This price is fair in relation to the quality.", word: "in relation to", pos: 'preposition', hint: "cụm giới từ chỉ mối liên hệ, nghĩa \"so với, liên quan đến\"." },
  { sentence: "He succeeded at the expense of his health.", word: "at the expense of", pos: 'preposition', hint: "cụm giới từ chỉ cái giá phải trả, nghĩa \"phải đánh đổi bằng\"." },
  // ----- pronoun (vòng bổ sung mục tiêu 850) -----
  { sentence: "I like tea and coffee, but I prefer the former.", word: "the former", pos: 'pronoun', hint: "cụm đại từ, nghĩa \"cái/người được nhắc trước\"." },
  { sentence: "Between the bus and the train, I chose the latter.", word: "the latter", pos: 'pronoun', hint: "cụm đại từ, nghĩa \"cái/người được nhắc sau\"." },
  { sentence: "Ask somebody else for directions.", word: "somebody else", pos: 'pronoun', hint: "cụm đại từ bất định, nghĩa \"người khác\"." },
  { sentence: "This coat belongs to someone else.", word: "someone else", pos: 'pronoun', hint: "cụm đại từ bất định, nghĩa \"ai đó khác\"." },
  { sentence: "Nobody else knew the secret.", word: "Nobody else", pos: 'pronoun', hint: "cụm đại từ phủ định, nghĩa \"không ai khác\"." },
  { sentence: "Everyone else had already left.", word: "Everyone else", pos: 'pronoun', hint: "cụm đại từ, nghĩa \"tất cả những người khác\"." },
  { sentence: "Each one got a small prize.", word: "Each one", pos: 'pronoun', hint: "cụm đại từ, nhấn mạnh từng cá thể riêng lẻ." },
  { sentence: "You can pick any of them.", word: "any of them", pos: 'pronoun', hint: "cụm đại từ, nghĩa \"bất kỳ ai/cái nào trong số đó\"." },
  { sentence: "Any of us could win the race.", word: "Any of us", pos: 'pronoun', hint: "cụm đại từ, nghĩa \"bất kỳ ai trong chúng tôi\"." },
  { sentence: "Few of them finished the marathon.", word: "Few of them", pos: 'pronoun', hint: "cụm đại từ chỉ số lượng nhỏ." },
  { sentence: "Many of us grew up in this town.", word: "Many of us", pos: 'pronoun', hint: "cụm đại từ chỉ số lượng lớn." },
  { sentence: "Several of us volunteered to help.", word: "Several of us", pos: 'pronoun', hint: "cụm đại từ chỉ vài người trong nhóm." },
  { sentence: "Both of us love hiking.", word: "Both of us", pos: 'pronoun', hint: "cụm đại từ, nghĩa \"cả hai chúng tôi\"." },
  { sentence: "Neither one wanted to give up.", word: "Neither one", pos: 'pronoun', hint: "cụm đại từ phủ định, nghĩa \"không cái/người nào trong hai\"." },
  { sentence: "You can choose either one.", word: "either one", pos: 'pronoun', hint: "cụm đại từ, nghĩa \"cái/người nào trong hai cũng được\"." },
  { sentence: "My answer was the same as hers.", word: "the same", pos: 'pronoun', hint: "đại từ chỉ định, nghĩa \"điều/cái giống vậy\"." },
  { sentence: "I ate one cookie and saved the rest.", word: "the rest", pos: 'pronoun', hint: "đại từ, nghĩa \"phần còn lại\"." },
  { sentence: "Everyone should believe in one's own abilities.", word: "one's own", pos: 'pronoun', hint: "cụm đại từ sở hữu bất định, nghĩa \"của riêng mình\"." },
  { sentence: "Pack the tent first, then everything else.", word: "everything else", pos: 'pronoun', hint: "cụm đại từ, nghĩa \"mọi thứ khác\"." },
  // ----- conjunction (vòng bổ sung mục tiêu 850) -----
  { sentence: "She packed her bag and left early.", word: "and", pos: 'conjunction', hint: "liên từ nối 2 hành động liên tiếp." },
  { sentence: "The cake looked plain but tasted amazing.", word: "but", pos: 'conjunction', hint: "liên từ đối lập." },
  { sentence: "Would you like tea or coffee?", word: "or", pos: 'conjunction', hint: "liên từ lựa chọn." },
  { sentence: "The bus was late, so we walked.", word: "so", pos: 'conjunction', hint: "liên từ chỉ kết quả." },
  { sentence: "He stayed home because he felt sick.", word: "because", pos: 'conjunction', hint: "liên từ chỉ nguyên nhân." },
  { sentence: "Although the test was hard, she passed easily.", word: "Although", pos: 'conjunction', hint: "liên từ nhượng bộ." },
  { sentence: "We won't start unless everyone is ready.", word: "unless", pos: 'conjunction', hint: "liên từ điều kiện phủ định." },
  { sentence: "He hummed a tune while cooking dinner.", word: "while", pos: 'conjunction', hint: "liên từ chỉ hai việc song song." },
  { sentence: "Since it's your birthday, you can choose the movie.", word: "Since", pos: 'conjunction', hint: "liên từ chỉ lý do." },
  { sentence: "The shop stays open till nine.", word: "till", pos: 'conjunction', hint: "liên từ chỉ thời gian, nghĩa giống \"until\"." },
  { sentence: "She was nervous, yet she spoke confidently.", word: "yet", pos: 'conjunction', hint: "liên từ đối lập." },
  { sentence: "He never called, nor did he write.", word: "nor", pos: 'conjunction', hint: "liên từ phủ định nối tiếp." },
  { sentence: "The city is noisy, whereas the countryside is calm.", word: "whereas", pos: 'conjunction', hint: "liên từ đối lập nhẹ." },
  { sentence: "Lock the door before you leave the house.", word: "before", pos: 'conjunction', hint: "liên từ chỉ thời gian." },
  { sentence: "We cleaned up after the guests left.", word: "after", pos: 'conjunction', hint: "liên từ chỉ thời gian." },
  { sentence: "The baby cried until her mother picked her up.", word: "until", pos: 'conjunction', hint: "liên từ chỉ thời gian." },
  { sentence: "The lights flickered when the storm started.", word: "when", pos: 'conjunction', hint: "liên từ chỉ thời gian." },
  { sentence: "If the bell rings, everyone must leave quietly.", word: "If", pos: 'conjunction', hint: "liên từ điều kiện." },
  { sentence: "The bridge was old, though it was still safe to cross.", word: "though", pos: 'conjunction', hint: "liên từ nhượng bộ." },
  // ----- interjection (vòng bổ sung mục tiêu 850) -----
  { sentence: "Wowzers, that roller coaster was fast!", word: "Wowzers", pos: 'interjection', hint: "thán từ diễn tả kinh ngạc, vui vẻ." },
  { sentence: "Gadzooks, I can't believe we won!", word: "Gadzooks", pos: 'interjection', hint: "thán từ cổ, diễn tả kinh ngạc." },
  { sentence: "Egads, look at the size of that wave!", word: "Egads", pos: 'interjection', hint: "thán từ cổ, diễn tả kinh ngạc mạnh." },
  { sentence: "Hallelujah, the rain has finally stopped!", word: "Hallelujah", pos: 'interjection', hint: "thán từ diễn tả vui mừng, nhẹ nhõm lớn." },
  { sentence: "Encore! We want one more song!", word: "Encore", pos: 'interjection', hint: "thán từ yêu cầu biểu diễn thêm." },
  { sentence: "Ay, that hurts a lot!", word: "Ay", pos: 'interjection', hint: "thán từ diễn tả đau/ngạc nhiên nhẹ." },
  { sentence: "Oy, watch where you're going!", word: "Oy", pos: 'interjection', hint: "thán từ diễn tả khó chịu, gọi chú ý." },
  { sentence: "Ack, I spilled my juice again!", word: "Ack", pos: 'interjection', hint: "thán từ diễn tả bực bội bất ngờ." },
  { sentence: "Eek, there's a spider on the wall!", word: "Eek", pos: 'interjection', hint: "thán từ diễn tả sợ hãi bất ngờ." },
  { sentence: "Yeesh, that movie was really scary.", word: "Yeesh", pos: 'interjection', hint: "thán từ diễn tả ngạc nhiên/khó chịu nhẹ." },
  { sentence: "Gah, I forgot my homework at home!", word: "Gah", pos: 'interjection', hint: "thán từ diễn tả bực bội." },
  { sentence: "Pfft, that excuse doesn't fool me.", word: "Pfft", pos: 'interjection', hint: "thán từ diễn tả coi thường, không tin." },
  { sentence: "Tut-tut, you shouldn't have done that.", word: "Tut-tut", pos: 'interjection', hint: "thán từ diễn tả không hài lòng nhẹ nhàng." },
  { sentence: "Poof, the magician made the coin disappear.", word: "Poof", pos: 'interjection', hint: "thán từ mô phỏng sự biến mất đột ngột." },
  { sentence: "Presto, the rabbit appeared from the hat!", word: "Presto", pos: 'interjection', hint: "thán từ diễn tả điều xảy ra nhanh chóng, kỳ diệu." },
  { sentence: "Voila, dinner is ready!", word: "Voila", pos: 'interjection', hint: "thán từ diễn tả sự hoàn thành, khoe thành quả." },
  { sentence: "Kapow, the superhero smashed through the wall!", word: "Kapow", pos: 'interjection', hint: "thán từ mô phỏng âm thanh va chạm mạnh." },
  { sentence: "Boom, the fireworks lit up the sky!", word: "Boom", pos: 'interjection', hint: "thán từ mô phỏng âm thanh nổ lớn." },
  { sentence: "Whoop, we finally reached the top of the mountain!", word: "Whoop", pos: 'interjection', hint: "thán từ diễn tả reo hò vui mừng." },
  // ----- noun (vòng bổ sung mục tiêu 1000) -----
  { sentence: "The park offers entertainment for the whole family.", word: "entertainment", pos: 'noun', hint: "đuôi \"-ment\" biến động từ \"entertain\" thành danh từ." },
  { sentence: "The gym bought new exercise equipment.", word: "equipment", pos: 'noun', hint: "đuôi \"-ment\" biến động từ \"equip\" thành danh từ." },
  { sentence: "The factory offers employment to many workers.", word: "employment", pos: 'noun', hint: "đuôi \"-ment\" biến động từ \"employ\" thành danh từ." },
  { sentence: "We must protect the environment.", word: "environment", pos: 'noun', hint: "đuôi \"-ment\" là dấu hiệu danh từ thường gặp." },
  { sentence: "They had a small argument about the movie.", word: "argument", pos: 'noun', hint: "đuôi \"-ment\" biến động từ \"argue\" thành danh từ." },
  { sentence: "The manager read a short statement.", word: "statement", pos: 'noun', hint: "đuôi \"-ment\" biến động từ \"state\" thành danh từ." },
  { sentence: "English is a requirement for this job.", word: "requirement", pos: 'noun', hint: "đuôi \"-ment\" biến động từ \"require\" thành danh từ." },
  { sentence: "The town has seen a lot of development.", word: "development", pos: 'noun', hint: "đuôi \"-ment\" biến động từ \"develop\" thành danh từ." },
  { sentence: "Her grades showed real improvement.", word: "improvement", pos: 'noun', hint: "đuôi \"-ment\" biến động từ \"improve\" thành danh từ." },
  { sentence: "We bought insurance for the new car.", word: "insurance", pos: 'noun', hint: "đuôi \"-ance\" biến động từ \"insure\" thành danh từ." },
  { sentence: "Her acceptance letter arrived yesterday.", word: "acceptance", pos: 'noun', hint: "đuôi \"-ance\" biến động từ \"accept\" thành danh từ." },
  { sentence: "The distance to school is short.", word: "distance", pos: 'noun', hint: "đuôi \"-ance\" biến tính từ \"distant\" thành danh từ." },
  { sentence: "The scientists met at a big conference.", word: "conference", pos: 'noun', hint: "đuôi \"-ence\" biến động từ \"confer\" thành danh từ." },
  { sentence: "My preference is tea, not coffee.", word: "preference", pos: 'noun', hint: "đuôi \"-ence\" biến động từ \"prefer\" thành danh từ." },
  { sentence: "She has the ability to solve hard problems.", word: "ability", pos: 'noun', hint: "đuôi \"-ity\" biến tính từ \"able\" thành danh từ." },
  { sentence: "There is a small possibility of rain.", word: "possibility", pos: 'noun', hint: "đuôi \"-ity\" biến tính từ \"possible\" thành danh từ." },
  { sentence: "The whole community helped clean the park.", word: "community", pos: 'noun', hint: "đuôi \"-ity\" là dấu hiệu danh từ thường gặp." },
  { sentence: "The bank has strong security.", word: "security", pos: 'noun', hint: "đuôi \"-ity\" biến tính từ \"secure\" thành danh từ." },
  { sentence: "The darkness made it hard to see.", word: "darkness", pos: 'noun', hint: "đuôi \"-ness\" biến tính từ \"dark\" thành danh từ." },
  // ----- verb (vòng bổ sung mục tiêu 1000) -----
  { sentence: "This app will enable faster typing.", word: "enable", pos: 'verb', hint: "tiền tố \"en-\" + tính từ \"able\" tạo thành động từ." },
  { sentence: "Reading books can enrich your mind.", word: "enrich", pos: 'verb', hint: "tiền tố \"en-\" + tính từ \"rich\" tạo thành động từ." },
  { sentence: "We need to enlarge this photo.", word: "enlarge", pos: 'verb', hint: "tiền tố \"en-\" + tính từ \"large\" tạo thành động từ." },
  { sentence: "The coach tried to encourage the team.", word: "encourage", pos: 'verb', hint: "tiền tố \"en-\" + danh từ \"courage\" tạo thành động từ." },
  { sentence: "The program aims to empower young women.", word: "empower", pos: 'verb', hint: "tiền tố \"em-\" + danh từ \"power\" tạo thành động từ." },
  { sentence: "I decided to subscribe to the magazine.", word: "subscribe", pos: 'verb', hint: "tiền tố \"sub-\" nghĩa \"dưới/theo\" + gốc \"scribe\" (viết)." },
  { sentence: "Please submit your homework by Friday.", word: "submit", pos: 'verb', hint: "tiền tố \"sub-\" + gốc Latin \"mit\" (gửi)." },
  { sentence: "The students interact well with each other.", word: "interact", pos: 'verb', hint: "tiền tố \"inter-\" nghĩa \"giữa/qua lại\" + động từ \"act\"." },
  { sentence: "Please don't interrupt while I'm speaking.", word: "interrupt", pos: 'verb', hint: "tiền tố \"inter-\" + gốc Latin \"rupt\" (làm gián đoạn)." },
  { sentence: "Children quickly outgrow their shoes.", word: "outgrow", pos: 'verb', hint: "tiền tố \"out-\" nghĩa \"vượt qua\" + động từ \"grow\"." },
  { sentence: "This battery will outlast the older model.", word: "outlast", pos: 'verb', hint: "tiền tố \"out-\" nghĩa \"vượt qua\" + động từ \"last\"." },
  { sentence: "The new team managed to outperform last year's champions.", word: "outperform", pos: 'verb', hint: "tiền tố \"out-\" nghĩa \"vượt qua\" + động từ \"perform\"." },
  { sentence: "We plan to upgrade the computer system.", word: "upgrade", pos: 'verb', hint: "tiền tố \"up-\" nghĩa \"nâng cấp\" + gốc \"grade\"." },
  { sentence: "The airline decided to downgrade the seat.", word: "downgrade", pos: 'verb', hint: "tiền tố \"down-\" nghĩa \"hạ cấp\" + gốc \"grade\"." },
  { sentence: "She decided to befriend the new student.", word: "befriend", pos: 'verb', hint: "tiền tố \"be-\" + danh từ \"friend\" tạo thành động từ." },
  { sentence: "Don't belittle other people's efforts.", word: "belittle", pos: 'verb', hint: "tiền tố \"be-\" + tính từ \"little\" tạo thành động từ." },
  { sentence: "Please disconnect the cable before moving it.", word: "disconnect", pos: 'verb', hint: "tiền tố \"dis-\" nghĩa \"ngắt\" + động từ \"connect\"." },
  { sentence: "The store will discount old items next week.", word: "discount", pos: 'verb', hint: "tiền tố \"dis-\" + gốc \"count\" tạo thành động từ." },
  { sentence: "Cheating will disqualify you from the race.", word: "disqualify", pos: 'verb', hint: "tiền tố \"dis-\" + động từ \"qualify\" mang nghĩa phủ định." },
  // ----- adjective (vòng bổ sung mục tiêu 1000) -----
  { sentence: "He had a childlike sense of wonder.", word: "childlike", pos: 'adjective', hint: "đuôi \"-like\" biến danh từ \"child\" thành tính từ." },
  { sentence: "The wax figure looked completely lifelike.", word: "lifelike", pos: 'adjective', hint: "đuôi \"-like\" biến danh từ \"life\" thành tính từ." },
  { sentence: "These boots are completely waterproof.", word: "waterproof", pos: 'adjective', hint: "đuôi \"-proof\" biến danh từ \"water\" thành tính từ." },
  { sentence: "The instructions were simple and foolproof.", word: "foolproof", pos: 'adjective', hint: "đuôi \"-proof\" biến danh từ \"fool\" thành tính từ." },
  { sentence: "She is a kind and trustworthy friend.", word: "trustworthy", pos: 'adjective', hint: "đuôi \"-worthy\" biến động từ \"trust\" thành tính từ." },
  { sentence: "The discovery was truly noteworthy.", word: "noteworthy", pos: 'adjective', hint: "đuôi \"-worthy\" biến danh từ \"note\" thành tính từ." },
  { sentence: "The buzzing fly was quite bothersome.", word: "bothersome", pos: 'adjective', hint: "đuôi \"-some\" biến động từ \"bother\" thành tính từ." },
  { sentence: "The long lecture became tiresome.", word: "tiresome", pos: 'adjective', hint: "đuôi \"-some\" biến động từ \"tire\" thành tính từ." },
  { sentence: "The young man looked very handsome.", word: "handsome", pos: 'adjective', hint: "đuôi \"-some\" là dấu hiệu tính từ thường gặp." },
  { sentence: "They enjoyed a wholesome family meal.", word: "wholesome", pos: 'adjective', hint: "đuôi \"-some\" biến tính từ \"whole\" thành tính từ." },
  { sentence: "The old horror story was truly gruesome.", word: "gruesome", pos: 'adjective', hint: "đuôi \"-some\" là dấu hiệu tính từ thường gặp." },
  { sentence: "The strange noise was worrisome.", word: "worrisome", pos: 'adjective', hint: "đuôi \"-some\" biến động từ \"worry\" thành tính từ." },
  { sentence: "The puppy looked absolutely adorable.", word: "adorable", pos: 'adjective', hint: "đuôi \"-able\" biến động từ \"adore\" thành tính từ." },
  { sentence: "Their new kitten is very lovable.", word: "lovable", pos: 'adjective', hint: "đuôi \"-able\" biến động từ \"love\" thành tính từ." },
  { sentence: "The two phones are comparable in price.", word: "comparable", pos: 'adjective', hint: "đuôi \"-able\" biến động từ \"compare\" thành tính từ." },
  { sentence: "They made considerable progress this term.", word: "considerable", pos: 'adjective', hint: "đuôi \"-able\" biến động từ \"consider\" thành tính từ." },
  { sentence: "She made a remarkable recovery.", word: "remarkable", pos: 'adjective', hint: "đuôi \"-able\" biến động từ \"remark\" thành tính từ." },
  { sentence: "The weather looks favorable for the trip.", word: "favorable", pos: 'adjective', hint: "đuôi \"-able\" biến động từ \"favor\" thành tính từ." },
  { sentence: "He is known as an honorable man.", word: "honorable", pos: 'adjective', hint: "đuôi \"-able\" biến danh từ \"honor\" thành tính từ." },
  // ----- adverb (vòng bổ sung mục tiêu 1000) -----
  { sentence: "The bakery opens daily at seven.", word: "daily", pos: 'adverb', hint: "trạng từ chỉ tần suất, nghĩa \"hằng ngày\"." },
  { sentence: "The magazine is published weekly.", word: "weekly", pos: 'adverb', hint: "trạng từ chỉ tần suất, nghĩa \"hằng tuần\"." },
  { sentence: "We pay the rent monthly.", word: "monthly", pos: 'adverb', hint: "trạng từ chỉ tần suất, nghĩa \"hằng tháng\"." },
  { sentence: "The festival is held yearly.", word: "yearly", pos: 'adverb', hint: "trạng từ chỉ tần suất, nghĩa \"hằng năm\"." },
  { sentence: "The exam was extremely difficult.", word: "extremely", pos: 'adverb', hint: "trạng từ chỉ mức độ, nghĩa \"cực kỳ\"." },
  { sentence: "I entirely agree with your plan.", word: "entirely", pos: 'adverb', hint: "trạng từ chỉ mức độ, nghĩa \"hoàn toàn\"." },
  { sentence: "The room was completely empty.", word: "completely", pos: 'adverb', hint: "trạng từ chỉ mức độ, nghĩa \"hoàn toàn\"." },
  { sentence: "That is absolutely the right answer.", word: "absolutely", pos: 'adverb', hint: "trạng từ chỉ mức độ, nghĩa \"hoàn toàn, chắc chắn\"." },
  { sentence: "I totally forgot about the meeting.", word: "totally", pos: 'adverb', hint: "trạng từ chỉ mức độ, nghĩa \"hoàn toàn\"." },
  { sentence: "The plan was utterly ridiculous.", word: "utterly", pos: 'adverb', hint: "trạng từ chỉ mức độ, nghĩa \"hoàn toàn\"." },
  { sentence: "The soup was slightly too salty.", word: "slightly", pos: 'adverb', hint: "trạng từ chỉ mức độ, nghĩa \"hơi, một chút\"." },
  { sentence: "The results were somewhat surprising.", word: "somewhat", pos: 'adverb', hint: "trạng từ chỉ mức độ, nghĩa \"phần nào\"." },
  { sentence: "The test was fairly easy this time.", word: "fairly", pos: 'adverb', hint: "trạng từ chỉ mức độ, nghĩa \"khá\"." },
  { sentence: "It was rather cold this morning.", word: "rather", pos: 'adverb', hint: "trạng từ chỉ mức độ, nghĩa \"khá, hơi\"." },
  { sentence: "The two designs are virtually identical.", word: "virtually", pos: 'adverb', hint: "trạng từ chỉ mức độ, nghĩa \"gần như\"." },
  { sentence: "The store is practically empty today.", word: "practically", pos: 'adverb', hint: "trạng từ chỉ mức độ, nghĩa \"gần như, thực tế là\"." },
  { sentence: "The success was largely due to teamwork.", word: "largely", pos: 'adverb', hint: "trạng từ chỉ mức độ, nghĩa \"phần lớn\"." },
  { sentence: "It was purely an accident.", word: "purely", pos: 'adverb', hint: "trạng từ chỉ mức độ, nghĩa \"hoàn toàn, thuần túy\"." },
  { sentence: "The decision rests solely with the manager.", word: "solely", pos: 'adverb', hint: "trạng từ chỉ mức độ, nghĩa \"chỉ, duy nhất\"." },
  // ----- preposition (vòng bổ sung mục tiêu 1000) -----
  { sentence: "The work was completed in accordance with the plan.", word: "in accordance with", pos: 'preposition', hint: "cụm giới từ, nghĩa \"theo đúng, phù hợp với\"." },
  { sentence: "With regard to your question, the answer is yes.", word: "With regard to", pos: 'preposition', hint: "cụm giới từ, nghĩa \"về vấn đề, liên quan đến\"." },
  { sentence: "The form is used for the purpose of registration.", word: "for the purpose of", pos: 'preposition', hint: "cụm giới từ chỉ mục đích, nghĩa \"nhằm mục đích\"." },
  { sentence: "In the event of a fire, use the stairs.", word: "In the event of", pos: 'preposition', hint: "cụm giới từ chỉ tình huống giả định, nghĩa \"trong trường hợp\"." },
  { sentence: "Everyone came, with the exception of Tom.", word: "with the exception of", pos: 'preposition', hint: "cụm giới từ chỉ ngoại lệ, nghĩa \"ngoại trừ\"." },
  { sentence: "This year's harvest is small in comparison with last year's.", word: "in comparison with", pos: 'preposition', hint: "cụm giới từ chỉ so sánh, nghĩa \"so với\"." },
  { sentence: "In contrast to his brother, he is very quiet.", word: "In contrast to", pos: 'preposition', hint: "cụm giới từ chỉ sự đối lập, nghĩa \"trái ngược với\"." },
  { sentence: "She got the job by virtue of her experience.", word: "by virtue of", pos: 'preposition', hint: "cụm giới từ chỉ nguyên nhân, nghĩa \"nhờ vào\"." },
  { sentence: "In the absence of the teacher, the class was quiet.", word: "In the absence of", pos: 'preposition', hint: "cụm giới từ chỉ sự vắng mặt, nghĩa \"khi vắng mặt\"." },
  { sentence: "They saved money with a view to buying a house.", word: "with a view to", pos: 'preposition', hint: "cụm giới từ chỉ mục đích, nghĩa \"với mục đích, nhằm\"." },
  { sentence: "The school works in conjunction with local charities.", word: "in conjunction with", pos: 'preposition', hint: "cụm giới từ chỉ sự phối hợp, nghĩa \"cùng với, kết hợp với\"." },
  { sentence: "The small boat was at the mercy of the waves.", word: "at the mercy of", pos: 'preposition', hint: "cụm giới từ chỉ tình trạng phụ thuộc, nghĩa \"phó mặc cho\"." },
  { sentence: "The plant died for want of water.", word: "for want of", pos: 'preposition', hint: "cụm giới từ chỉ nguyên nhân do thiếu, nghĩa \"vì thiếu\"." },
  { sentence: "She gave him a gift in return for his help.", word: "in return for", pos: 'preposition', hint: "cụm giới từ chỉ sự đáp lại, nghĩa \"để đáp lại\"." },
  { sentence: "He traded his bike in exchange for a skateboard.", word: "in exchange for", pos: 'preposition', hint: "cụm giới từ chỉ sự trao đổi, nghĩa \"để đổi lấy\"." },
  { sentence: "The final decision is at the discretion of the judge.", word: "at the discretion of", pos: 'preposition', hint: "cụm giới từ chỉ quyền quyết định, nghĩa \"tùy theo quyết định của\"." },
  { sentence: "He entered under the guise of a repairman.", word: "under the guise of", pos: 'preposition', hint: "cụm giới từ chỉ sự giả trang, nghĩa \"dưới vỏ bọc của\"." },
  { sentence: "The decoration is in keeping with the theme.", word: "in keeping with", pos: 'preposition', hint: "cụm giới từ chỉ sự phù hợp, nghĩa \"phù hợp với\"." },
  { sentence: "Pursuant to the new rule, all bikes must be registered.", word: "Pursuant to", pos: 'preposition', hint: "cụm giới từ trang trọng, nghĩa \"theo như, tuân theo\"." },
  // ----- pronoun (vòng bổ sung mục tiêu 1000) -----
  { sentence: "No one answered the door.", word: "No one", pos: 'pronoun', hint: "cụm đại từ phủ định, nghĩa \"không ai\"." },
  { sentence: "No one else wanted to go first.", word: "No one else", pos: 'pronoun', hint: "cụm đại từ phủ định, nghĩa \"không ai khác\"." },
  { sentence: "I like this one better than that one.", word: "this one", pos: 'pronoun', hint: "đại từ chỉ định, thay cho danh từ đã nhắc." },
  { sentence: "Don't choose that one, it's broken.", word: "that one", pos: 'pronoun', hint: "đại từ chỉ định, thay cho danh từ ở xa." },
  { sentence: "These two are my favorite books.", word: "These two", pos: 'pronoun', hint: "cụm đại từ chỉ định số nhiều gần." },
  { sentence: "Those two have been friends for years.", word: "Those two", pos: 'pronoun', hint: "cụm đại từ chỉ định số nhiều xa." },
  { sentence: "The two of us will handle the project.", word: "The two of us", pos: 'pronoun', hint: "cụm đại từ, nghĩa \"hai chúng tôi\"." },
  { sentence: "The three of them shared a taxi home.", word: "The three of them", pos: 'pronoun', hint: "cụm đại từ, nghĩa \"ba người trong số họ\"." },
  { sentence: "All three passed the driving test.", word: "All three", pos: 'pronoun', hint: "cụm đại từ, nghĩa \"cả ba người/vật\"." },
  { sentence: "Either party can cancel the contract.", word: "Either party", pos: 'pronoun', hint: "cụm đại từ trang trọng, nghĩa \"bên nào cũng được\"." },
  { sentence: "Neither party agreed to the terms.", word: "Neither party", pos: 'pronoun', hint: "cụm đại từ phủ định trang trọng, nghĩa \"không bên nào\"." },
  { sentence: "Take whichever one fits you best.", word: "whichever one", pos: 'pronoun', hint: "cụm đại từ, nghĩa \"bất cứ cái nào\"." },
  { sentence: "Whoever else wants to join can sign up now.", word: "Whoever else", pos: 'pronoun', hint: "cụm đại từ, nghĩa \"bất cứ ai khác\"." },
  { sentence: "He ate the whole lot in one sitting.", word: "the whole lot", pos: 'pronoun', hint: "cụm đại từ, nghĩa \"tất cả, toàn bộ\"." },
  { sentence: "The rest of us stayed behind to clean up.", word: "The rest of us", pos: 'pronoun', hint: "cụm đại từ, nghĩa \"những người còn lại trong chúng tôi\"." },
  { sentence: "The rest of them arrived a bit later.", word: "The rest of them", pos: 'pronoun', hint: "cụm đại từ, nghĩa \"những người còn lại trong họ\"." },
  { sentence: "Let's talk about this some other time.", word: "some other", pos: 'pronoun', hint: "đại từ/định từ bất định, nghĩa \"một... khác nào đó\"." },
  { sentence: "This bus is full; wait for the next one.", word: "the next one", pos: 'pronoun', hint: "cụm đại từ, nghĩa \"cái/người tiếp theo\"." },
  { sentence: "She was the last one to leave the party.", word: "the last one", pos: 'pronoun', hint: "cụm đại từ, nghĩa \"người/cái cuối cùng\"." },
  // ----- conjunction (vòng bổ sung mục tiêu 1000) -----
  { sentence: "He opened the box and smiled.", word: "and", pos: 'conjunction', hint: "liên từ nối 2 sự việc liên tiếp." },
  { sentence: "The room was small but cozy.", word: "but", pos: 'conjunction', hint: "liên từ đối lập." },
  { sentence: "You can walk or take the bus.", word: "or", pos: 'conjunction', hint: "liên từ lựa chọn." },
  { sentence: "We canceled the picnic because it rained all day.", word: "because", pos: 'conjunction', hint: "liên từ chỉ nguyên nhân." },
  { sentence: "Although she was tired, she kept practicing.", word: "Although", pos: 'conjunction', hint: "liên từ nhượng bộ." },
  { sentence: "He whistled while painting the fence.", word: "while", pos: 'conjunction', hint: "liên từ chỉ hai việc song song." },
  { sentence: "Everyone cheered when the team scored.", word: "when", pos: 'conjunction', hint: "liên từ chỉ thời gian." },
  { sentence: "The movie was long, so we left early.", word: "so", pos: 'conjunction', hint: "liên từ chỉ kết quả." },
  { sentence: "If you water the plant, it will grow.", word: "If", pos: 'conjunction', hint: "liên từ điều kiện." },
  { sentence: "The game won't start unless both teams are ready.", word: "unless", pos: 'conjunction', hint: "liên từ điều kiện phủ định." },
  { sentence: "Since the rain stopped, we can go outside.", word: "Since", pos: 'conjunction', hint: "liên từ chỉ lý do/thời gian." },
  { sentence: "Stay quiet until the baby wakes up.", word: "until", pos: 'conjunction', hint: "liên từ chỉ thời gian, nghĩa cho đến khi." },
  { sentence: "Check your bag before you leave the house.", word: "before", pos: 'conjunction', hint: "liên từ chỉ thời gian." },
  { sentence: "The kids napped after their long walk.", word: "after", pos: 'conjunction', hint: "liên từ chỉ thời gian." },
  { sentence: "He loves cats, whereas his sister prefers dogs.", word: "whereas", pos: 'conjunction', hint: "liên từ đối lập nhẹ." },
  { sentence: "The road was bumpy, though the view was beautiful.", word: "though", pos: 'conjunction', hint: "liên từ nhượng bộ." },
  { sentence: "She didn't complain, nor did she cry.", word: "nor", pos: 'conjunction', hint: "liên từ phủ định nối tiếp." },
  { sentence: "The puzzle was tricky, yet he solved it quickly.", word: "yet", pos: 'conjunction', hint: "liên từ đối lập." },
  { sentence: "They celebrated, for the harvest had been good.", word: "for", pos: 'conjunction', hint: "liên từ chỉ nguyên nhân trang trọng." },
  // ----- interjection (vòng bổ sung mục tiêu 1000) -----
  { sentence: "Huzzah, the knights have returned victorious!", word: "Huzzah", pos: 'interjection', hint: "thán từ cổ diễn tả reo hò chiến thắng." },
  { sentence: "Booyah, we beat the high score!", word: "Booyah", pos: 'interjection', hint: "thán từ diễn tả chiến thắng, tự hào." },
  { sentence: "Shazam, the trick worked perfectly!", word: "Shazam", pos: 'interjection', hint: "thán từ diễn tả phép màu, điều kỳ diệu xảy ra." },
  { sentence: "Zap, the light suddenly went out!", word: "Zap", pos: 'interjection', hint: "thán từ mô phỏng âm thanh điện giật/tia sáng." },
  { sentence: "Zing, the arrow flew past his ear!", word: "Zing", pos: 'interjection', hint: "thán từ mô phỏng âm thanh vật bay nhanh." },
  { sentence: "Vroom, the race car sped down the track!", word: "Vroom", pos: 'interjection', hint: "thán từ mô phỏng âm thanh động cơ nổ máy." },
  { sentence: "Splat, the tomato hit the wall!", word: "Splat", pos: 'interjection', hint: "thán từ mô phỏng âm thanh va chạm mềm, ướt." },
  { sentence: "Bam, the door slammed shut!", word: "Bam", pos: 'interjection', hint: "thán từ mô phỏng âm thanh va đập mạnh." },
  { sentence: "Wham, the ball hit the goalpost!", word: "Wham", pos: 'interjection', hint: "thán từ mô phỏng âm thanh va chạm mạnh." },
  { sentence: "Crash, the plates fell off the shelf!", word: "Crash", pos: 'interjection', hint: "thán từ mô phỏng âm thanh đổ vỡ." },
  { sentence: "Thud, the book fell to the floor!", word: "Thud", pos: 'interjection', hint: "thán từ mô phỏng âm thanh vật nặng rơi." },
  { sentence: "Honk, the car warned the cyclist!", word: "Honk", pos: 'interjection', hint: "thán từ mô phỏng tiếng còi xe." },
  { sentence: "Beep, the microwave finished cooking!", word: "Beep", pos: 'interjection', hint: "thán từ mô phỏng âm thanh thiết bị điện tử." },
  { sentence: "Ribbit, the frog called from the pond!", word: "Ribbit", pos: 'interjection', hint: "thán từ mô phỏng tiếng kêu của ếch." },
  { sentence: "Meow, the kitten wanted more food!", word: "Meow", pos: 'interjection', hint: "thán từ mô phỏng tiếng kêu của mèo." },
  { sentence: "Woof, the puppy barked at the mailman!", word: "Woof", pos: 'interjection', hint: "thán từ mô phỏng tiếng sủa của chó." },
  { sentence: "Moo, the cow called from the barn!", word: "Moo", pos: 'interjection', hint: "thán từ mô phỏng tiếng kêu của bò." },
  { sentence: "Oink, the piglet rolled in the mud!", word: "Oink", pos: 'interjection', hint: "thán từ mô phỏng tiếng kêu của lợn." },
  { sentence: "Cock-a-doodle-doo, the rooster woke the whole farm!", word: "Cock-a-doodle-doo", pos: 'interjection', hint: "thán từ mô phỏng tiếng gáy của gà trống." },
];

/**
 * 1 vòng: chọn 1 từ trong câu + đúng 1 từ loại (đúng + 3 nhiễu random trong
 * 7 loại còn lại — giống cơ chế Cỗ Máy Thời Gian với TENSES).
 */
export function makePosRound(rng = Math.random) {
  const item = pick(POS_WORDS, rng);
  const correctCat = POS_CATEGORIES.find((c) => c.id === item.pos);
  const distractors = shuffle(POS_CATEGORIES.filter((c) => c.id !== item.pos), rng).slice(0, 3);
  const options = shuffle([correctCat, ...distractors], rng).map((c) => ({
    posId: c.id,
    label: c.label,
  }));
  return { item, correctPosId: item.pos, options };
}

export function makePosGame(count = 8, rng = Math.random) {
  const rounds = [];
  for (let i = 0; i < count; i++) rounds.push(makePosRound(rng));
  return baseGameState(rounds);
}

export function currentPosRound(game) {
  return currentRoundOf(game);
}

export function answerPos(game, posId) {
  return answerGeneric(game, posId, (round) => round.correctPosId);
}
