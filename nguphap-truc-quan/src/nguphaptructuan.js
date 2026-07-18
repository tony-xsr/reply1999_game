// Ngữ Pháp Trực Quan — 5 trò minh hoạ ngữ pháp bằng animation (Đợt 2 của đề
// xuất "Luyện Thi Cambridge" ở games.md mục 28). Mỗi trò sinh câu bằng công
// thức chia động từ/xây câu, KHÔNG hard-code sẵn từng câu — giữ file thuần
// logic độc lập (không import exam-prep), dễ test, độ đa dạng cao.
//
// 1. 🕰️ Cỗ Máy Thời Gian Ngữ Pháp: 1 nhân vật làm 1 hành động, đánh dấu 1
//    điểm trên trục thời gian (quá khứ/bây giờ/tương lai) kèm 1 "tín hiệu"
//    (icon: 🔁 lặp lại, 🕐 đang diễn ra, ✅ đã xong, 🔗 vừa xong, 📅 đã lên kế
//    hoạch) — bé phải chọn đúng câu tiếng Anh (= đúng thì) khớp với hình.
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
];

export const INTERRUPT_EVENTS = [
  { emoji: '📞', subject: 'the phone', ing: 'ringing', past: 'rang' },
  { emoji: '🔔', subject: 'the doorbell', ing: 'ringing', past: 'rang' },
  { emoji: '💡', subject: 'the lights', ing: 'going out', past: 'went out' },
  { emoji: '🐦', subject: 'a bird', ing: 'flying in', past: 'flew in' },
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
];

export const ATTRIBUTES = [
  { id: 'tall', comparative: 'taller', oppositeComparative: 'shorter', superlative: 'tallest', icon: '📏' },
  { id: 'fast', comparative: 'faster', oppositeComparative: 'slower', superlative: 'fastest', icon: '⚡' },
  { id: 'big', comparative: 'bigger', oppositeComparative: 'smaller', superlative: 'biggest', icon: '📦' },
  { id: 'good', comparative: 'better', oppositeComparative: 'worse', superlative: 'best', icon: '⭐' },
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
  if (subject === 'We' || subject === 'They') return 'are';
  return 'is';
}
function wrongBeForm(subject) {
  const correct = beForm(subject);
  if (correct === 'am') return 'is';
  if (correct === 'is') return 'are';
  return 'is';
}
function pastBeForm(subject) {
  return subject === 'We' || subject === 'They' ? 'were' : 'was';
}

export const GOING_TO_WILL_SCENARIOS = [
  {
    cue: '🧳', cueLabel: 'Va li đã đóng gói sẵn — kế hoạch có từ trước', subject: 'She', verb: 'visit her grandma', correctForm: 'going-to',
  },
  {
    cue: '📞', cueLabel: 'Điện thoại đang reo — quyết định ngay lúc đó', subject: 'I', verb: 'answer the phone', correctForm: 'will',
  },
  {
    cue: '⛈️', cueLabel: 'Mây đen kéo tới — dấu hiệu rõ ràng ngay trước mắt', subject: 'It', verb: 'rain', correctForm: 'going-to',
  },
  {
    cue: '🔮', cueLabel: 'Dự đoán không chắc chắn, chỉ là suy đoán', subject: 'It', verb: 'be sunny tomorrow', correctForm: 'will',
  },
  {
    cue: '📝', cueLabel: 'Đã đặt vé, lên kế hoạch từ trước', subject: 'We', verb: 'travel to Da Nang', correctForm: 'going-to',
  },
  {
    cue: '🤝', cueLabel: 'Lời hứa ngay lúc nói', subject: 'I', verb: 'help you', correctForm: 'will',
  },
];

function buildGoingToWillOption(subject, verb, key) {
  switch (key) {
    case 'going-to-correct':
      return `${subject} ${beForm(subject)} going to ${verb}.`;
    case 'going-to-wrong-conj':
      return `${subject} ${wrongBeForm(subject)} going to ${verb}.`;
    case 'will-correct':
      return `${subject} will ${verb}.`;
    case 'going-to-past':
    default:
      return `${subject} ${pastBeForm(subject)} going to ${verb}.`;
  }
}

/** 1 vòng: chọn 1 tình huống, sinh 4 câu (đúng theo scenario.correctForm + 3 nhiễu). */
export function makeGoingToWillRound(rng = Math.random) {
  const scenario = pick(GOING_TO_WILL_SCENARIOS, rng);
  const keys = ['going-to-correct', 'going-to-wrong-conj', 'will-correct', 'going-to-past'];
  const options = shuffle(keys, rng).map((key) => ({
    key,
    sentence: buildGoingToWillOption(scenario.subject, scenario.verb, key),
  }));
  const correctKey = scenario.correctForm === 'going-to' ? 'going-to-correct' : 'will-correct';
  return { scenario, options, correctKey };
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
];

function buildModalSentence(situation, modal) {
  return `You ${modal} ${situation.verb}.`;
}

/** 1 vòng: chọn 1 tình huống, 4 lựa chọn = đúng 4 modal cố định (must/mustn't/should/shouldn't). */
export function makeModalRound(rng = Math.random) {
  const situation = pick(MODAL_SITUATIONS, rng);
  const options = shuffle(MODALS, rng).map((modal) => ({
    modal,
    sentence: buildModalSentence(situation, modal),
  }));
  return { situation, options, correctModal: situation.modal };
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
];

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
];

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
