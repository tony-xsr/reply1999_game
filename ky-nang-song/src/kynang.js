// Logic Kỹ Năng Sống & Cảm Xúc — thuần, nhận rng để test tất định.
// 3 trò: nhận diện cảm xúc / sắp thứ tự thói quen sinh hoạt / đúng-sai an toàn.

function shuffle(arr, rng = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const pick = (arr, n, rng) => shuffle(arr, rng).slice(0, n);

/* ===== 1. Bé Vui Bé Buồn: nhận diện cảm xúc ===== */

export const EMOTIONS = [
  { id: 'happy', name: 'vui', face: '😊' },
  { id: 'sad', name: 'buồn', face: '😢' },
  { id: 'angry', name: 'giận', face: '😠' },
  { id: 'scared', name: 'sợ', face: '😨' },
  { id: 'surprised', name: 'ngạc nhiên', face: '😲' },
  { id: 'calm', name: 'bình thường', face: '🙂' },
];

export const SITUATIONS = [
  { text: 'Bé được tặng quà sinh nhật', emoji: '🎁', emotion: 'happy' },
  { text: 'Bé đi công viên chơi cùng gia đình', emoji: '🎡', emotion: 'happy' },
  { text: 'Bé được cô khen giỏi', emoji: '💯', emotion: 'happy' },
  { text: 'Bé làm rơi vỡ đồ chơi yêu thích', emoji: '🧸', emotion: 'sad' },
  { text: 'Bạn thân chuyển đi nơi khác', emoji: '🚚', emotion: 'sad' },
  { text: 'Bóng bay của bé bay mất', emoji: '🎈', emotion: 'sad' },
  { text: 'Bạn giành đồ chơi của bé', emoji: '🧩', emotion: 'angry' },
  { text: 'Em làm hỏng bức tranh bé vẽ', emoji: '🎨', emotion: 'angry' },
  { text: 'Bé xếp hình mãi không xong', emoji: '🧱', emotion: 'angry' },
  { text: 'Trời nổi sấm sét ầm ầm', emoji: '⛈️', emotion: 'scared' },
  { text: 'Bé thấy con nhện to trên tường', emoji: '🕷️', emotion: 'scared' },
  { text: 'Đèn phòng bỗng nhiên tắt', emoji: '💡', emotion: 'scared' },
  { text: 'Bạn bè hô to "Bất ngờ chưa!"', emoji: '🎉', emotion: 'surprised' },
  { text: 'Bé thấy cầu vồng sau cơn mưa', emoji: '🌈', emotion: 'surprised' },
  { text: 'Bé tìm thấy món đồ chơi tưởng đã mất', emoji: '🔍', emotion: 'surprised' },
  { text: 'Bé đang đọc truyện tranh', emoji: '📖', emotion: 'calm' },
  { text: 'Bé đang ăn cơm cùng gia đình', emoji: '🍚', emotion: 'calm' },
  { text: 'Bé đang đi bộ về nhà', emoji: '🚶', emotion: 'calm' },
];

/** Cho tình huống, đoán cảm xúc (4 lựa chọn gương mặt). */
export function makeEmotionFromSituation(rng = Math.random) {
  const situation = pick(SITUATIONS, 1, rng)[0];
  const correct = EMOTIONS.find((e) => e.id === situation.emotion);
  const wrongPool = EMOTIONS.filter((e) => e.id !== situation.emotion);
  const options = shuffle([correct, ...pick(wrongPool, 3, rng)], rng);
  return { type: 's2e', situation, answer: correct.id, options };
}

/** Cho cảm xúc, đoán tình huống phù hợp (4 lựa chọn tình huống). */
export function makeSituationFromEmotion(rng = Math.random) {
  const emotion = pick(EMOTIONS, 1, rng)[0];
  const correctSituation = pick(SITUATIONS.filter((s) => s.emotion === emotion.id), 1, rng)[0];
  const wrongPool = SITUATIONS.filter((s) => s.emotion !== emotion.id);
  const options = shuffle([correctSituation, ...pick(wrongPool, 3, rng)], rng);
  return { type: 'e2s', emotion, answer: correctSituation, options };
}

/** Bộ câu hỏi 1 lượt: nửa đầu đoán cảm xúc, nửa sau đoán tình huống. */
export function makeEmotionSet(total = 8, rng = Math.random) {
  const set = [];
  for (let i = 0; i < total; i++) {
    set.push(i < total / 2 ? makeEmotionFromSituation(rng) : makeSituationFromEmotion(rng));
  }
  return set;
}

/* ===== 2. Bé Tự Làm Được: sắp thứ tự thói quen sinh hoạt ===== */

export const ROUTINES = [
  {
    id: 'brush', name: 'Đánh răng', icon: '🪥',
    steps: [
      { text: 'Lấy bàn chải', icon: '🪥' },
      { text: 'Lấy kem đánh răng', icon: '🧴' },
      { text: 'Chải răng thật sạch', icon: '😁' },
      { text: 'Súc miệng bằng nước', icon: '🚰' },
      { text: 'Cất bàn chải gọn gàng', icon: '🗄️' },
    ],
  },
  {
    id: 'dress', name: 'Mặc quần áo', icon: '👕',
    steps: [
      { text: 'Mặc áo', icon: '👕' },
      { text: 'Mặc quần', icon: '👖' },
      { text: 'Đi tất', icon: '🧦' },
      { text: 'Đi giày', icon: '👟' },
    ],
  },
  {
    id: 'tidy', name: 'Dọn đồ chơi', icon: '🧸',
    steps: [
      { text: 'Nhặt đồ chơi trên sàn', icon: '🧸' },
      { text: 'Xếp đồ chơi vào giỏ', icon: '🧺' },
      { text: 'Đặt giỏ lên kệ', icon: '🗄️' },
    ],
  },
  {
    id: 'wash', name: 'Rửa tay', icon: '🧼',
    steps: [
      { text: 'Mở vòi nước', icon: '🚰' },
      { text: 'Xoa xà phòng', icon: '🧼' },
      { text: 'Rửa sạch tay', icon: '🤲' },
      { text: 'Lau khô tay', icon: '🧻' },
    ],
  },
  {
    id: 'sleep', name: 'Chuẩn bị đi ngủ', icon: '🛏️',
    steps: [
      { text: 'Đánh răng', icon: '🪥' },
      { text: 'Thay đồ ngủ', icon: '🩳' },
      { text: 'Lên giường', icon: '🛏️' },
      { text: 'Chúc ngủ ngon', icon: '🌙' },
    ],
  },
];

/** 1 vòng chơi: chọn thói quen + xáo các bước, giữ correctIndex để chấm. */
export function makeRoutineRound(rng = Math.random) {
  const routine = pick(ROUTINES, 1, rng)[0];
  const shuffled = shuffle(routine.steps.map((s, i) => ({ ...s, correctIndex: i })), rng);
  return { routine, shuffled };
}

/* ===== 3. An Toàn Cho Bé: đúng/sai an toàn ===== */

export const SAFETY_ITEMS = [
  { text: 'Đội mũ bảo hiểm khi ngồi xe máy', emoji: '🪖', safe: true, explain: 'Mũ bảo hiểm bảo vệ đầu bé khi có va chạm!' },
  { text: 'Chơi nghịch ổ điện', emoji: '🔌', safe: false, explain: 'Ổ điện có thể giật rất nguy hiểm, không sờ vào nhé!' },
  { text: 'Qua đường khi đèn xanh cho người đi bộ', emoji: '🚶', safe: true, explain: 'Đèn xanh cho người đi bộ là lúc an toàn để qua đường!' },
  { text: 'Chạy qua đường khi đèn đỏ', emoji: '🚦', safe: false, explain: 'Đèn đỏ là phải dừng lại, qua đường lúc này rất nguy hiểm!' },
  { text: 'Thắt dây an toàn khi ngồi ô tô', emoji: '🚗', safe: true, explain: 'Dây an toàn giữ bé không bị văng ra khi xe phanh gấp!' },
  { text: 'Nghịch dao kéo trong bếp', emoji: '🔪', safe: false, explain: 'Dao kéo rất sắc, có thể làm bé bị đứt tay!' },
  { text: 'Gọi 115 khi có người bị thương nặng', emoji: '🚑', safe: true, explain: '115 là số cấp cứu, gọi khi có ai bị đau nặng cần bác sĩ!' },
  { text: 'Trèo ra ngoài ban công một mình', emoji: '🏢', safe: false, explain: 'Trèo cao rất dễ ngã, bé cần người lớn ở bên!' },
  { text: 'Rửa tay trước khi ăn cơm', emoji: '🍚', safe: true, explain: 'Rửa tay giúp bé không bị vi trùng gây đau bụng!' },
  { text: 'Uống thuốc khi không có người lớn cho phép', emoji: '💊', safe: false, explain: 'Thuốc chỉ dùng khi người lớn cho phép, uống sai rất nguy hiểm!' },
  { text: 'Đi bộ trên vỉa hè, không đi dưới lòng đường', emoji: '🚸', safe: true, explain: 'Vỉa hè an toàn hơn, lòng đường có nhiều xe chạy nhanh!' },
  { text: 'Bơi một mình không có người lớn', emoji: '🏊', safe: false, explain: 'Bơi cần có người lớn trông chừng để tránh đuối nước!' },
  { text: 'Gọi 114 khi thấy cháy nhà', emoji: '🧯', safe: true, explain: '114 là số gọi lính cứu hỏa khi có cháy!' },
  { text: 'Nghịch lửa, diêm, bật lửa', emoji: '🔥', safe: false, explain: 'Lửa rất nguy hiểm, chỉ người lớn được dùng thôi!' },
  { text: 'Đội mũ, thoa kem chống nắng khi ra trời nắng', emoji: '☀️', safe: true, explain: 'Mũ và kem chống nắng bảo vệ da bé khỏi nắng gắt!' },
  { text: 'Đi theo người lạ khi được rủ', emoji: '🚶‍♂️', safe: false, explain: 'Bé không nên đi theo người lạ, hãy ở gần người thân nhé!' },
];

/** Bộ câu hỏi an toàn: lấy ngẫu nhiên không trùng, trộn đúng/sai. */
export function makeSafetySet(total = 8, rng = Math.random) {
  return pick(SAFETY_ITEMS, total, rng);
}
