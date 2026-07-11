// Dữ liệu học: 29 chữ cái tiếng Việt (mỗi chữ 1 từ quen thuộc + emoji)
// và 10 chữ số (mỗi số 1 con vật để đếm sau khi tô xong).

export const LETTERS = [
  { ch: 'A', word: 'gà', emoji: '🐔' },
  { ch: 'Ă', word: 'trăng', emoji: '🌙' },
  { ch: 'Â', word: 'mây', emoji: '☁️' },
  { ch: 'B', word: 'bò', emoji: '🐄' },
  { ch: 'C', word: 'cá', emoji: '🐟' },
  { ch: 'D', word: 'dê', emoji: '🐐' },
  { ch: 'Đ', word: 'đèn', emoji: '💡' },
  { ch: 'E', word: 'em bé', emoji: '👶' },
  { ch: 'Ê', word: 'ghế', emoji: '🪑' },
  { ch: 'G', word: 'gấu', emoji: '🐻' },
  { ch: 'H', word: 'hoa', emoji: '🌸' },
  { ch: 'I', word: 'viên bi', emoji: '🔵' },
  { ch: 'K', word: 'kẹo', emoji: '🍬' },
  { ch: 'L', word: 'lá', emoji: '🍃' },
  { ch: 'M', word: 'mèo', emoji: '🐱' },
  { ch: 'N', word: 'nấm', emoji: '🍄' },
  { ch: 'O', word: 'ong', emoji: '🐝' },
  { ch: 'Ô', word: 'ô tô', emoji: '🚗' },
  { ch: 'Ơ', word: 'quả mơ', emoji: '🍑' },
  { ch: 'P', word: 'pin', emoji: '🔋' },
  { ch: 'Q', word: 'quả quýt', emoji: '🍊' },
  { ch: 'R', word: 'rùa', emoji: '🐢' },
  { ch: 'S', word: 'sao', emoji: '⭐' },
  { ch: 'T', word: 'táo', emoji: '🍎' },
  { ch: 'U', word: 'cái dù', emoji: '☂️' },
  { ch: 'Ư', word: 'sư tử', emoji: '🦁' },
  { ch: 'V', word: 'voi', emoji: '🐘' },
  { ch: 'X', word: 'xe đạp', emoji: '🚲' },
  { ch: 'Y', word: 'y tá', emoji: '👩‍⚕️' },
];

export const DIGITS = [
  { ch: '0', word: 'không có con vật nào', emoji: '🧺', animal: null },
  { ch: '1', word: 'con chó', emoji: '🐶', animal: '🐶' },
  { ch: '2', word: 'con mèo', emoji: '🐱', animal: '🐱' },
  { ch: '3', word: 'con gà', emoji: '🐔', animal: '🐔' },
  { ch: '4', word: 'con cá', emoji: '🐟', animal: '🐟' },
  { ch: '5', word: 'con vịt', emoji: '🦆', animal: '🦆' },
  { ch: '6', word: 'con thỏ', emoji: '🐰', animal: '🐰' },
  { ch: '7', word: 'con ong', emoji: '🐝', animal: '🐝' },
  { ch: '8', word: 'con ếch', emoji: '🐸', animal: '🐸' },
  { ch: '9', word: 'con voi', emoji: '🐘', animal: '🐘' },
];

// Số đếm tiếng Việt cho màn đếm con vật
export const COUNT_WORDS = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

// Bảng màu cho bé: 10 màu tươi + tẩy (trắng)
export const PALETTE = [
  { id: 'red', hex: '#e53935', name: 'đỏ' },
  { id: 'orange', hex: '#fb8c00', name: 'cam' },
  { id: 'yellow', hex: '#fdd835', name: 'vàng' },
  { id: 'green', hex: '#43a047', name: 'xanh lá' },
  { id: 'blue', hex: '#1e88e5', name: 'xanh dương' },
  { id: 'purple', hex: '#8e24aa', name: 'tím' },
  { id: 'pink', hex: '#ec407a', name: 'hồng' },
  { id: 'teal', hex: '#00acc1', name: 'xanh ngọc' },
  { id: 'brown', hex: '#6d4c41', name: 'nâu' },
  { id: 'white', hex: '#ffffff', name: 'tẩy' },
];

// Chế độ "tô theo số" dùng 4 màu đầu của bảng (đánh số 1–4 trên khay màu)
export const BY_NUMBER_COLORS = 4;
