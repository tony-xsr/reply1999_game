// "🎮 GÓC GIẢI TRÍ" — danh sách các trò chơi nhỏ nằm trong 4 hub game-mini/,
// tro-choi-xua/, dien-tu-xua/, pokemon/ — dùng để chọn ngẫu nhiên 5 trò hiển
// thị NGAY trên trang chủ mỗi lần bé vào (thay vì bé phải tự bấm vào từng
// hub con mới thấy hết được các trò bên trong). Đây là ảnh chụp thủ công các
// thẻ game đã có sẵn ở 4 trang hub trên — thêm/bớt game ở các trang đó thì
// nhớ cập nhật lại danh sách này cho khớp.
export const FUN_GAMES = [
  { href: '/dao-vang/', icon: '⛏️💰💎', title: 'Đào Vàng' },
  { href: '/dap-vang/', icon: '🪓🪨', title: 'Đập Vàng' },
  { href: '/con-sot-tim-vang/', icon: '⛰️⏱️🔥', title: 'Cơn Sốt Tìm Vàng' },
  { href: '/xay-thi-tran-vang/', icon: '🏘️🚂💰', title: 'Xây Thị Trấn Vàng' },
  { href: '/duong-ham-san-vang/', icon: '⛏️🕳️', title: 'Đường Hầm Săn Vàng' },
  { href: '/dao-ham-vang/', icon: '⚽💰🚩', title: 'Đào Hầm Vàng' },
  { href: '/vi-vua-vang/', icon: '👑🏺', title: 'Vị Vua Vàng' },
  { href: '/phi-doi-nhi/', icon: '✈️🌩️⭐', title: 'Phi Đội Nhí' },
  { href: '/thu-cung-dai-chien/', icon: '🐓🐟🐃', title: 'Thú Cưng Đại Chiến' },
  { href: '/pokemon-dai-chien/', icon: '⚡🔴⚔️', title: 'Pokémon Đại Chiến' },
  { href: '/gop-so-vui/', icon: '🔢2️⃣4️⃣', title: 'Gộp Số Vui' },
  { href: '/vuon-rau-than-ky/', icon: '🌻🌱🐛', title: 'Vườn Rau Thần Kỳ' },
  { href: '/be-tim-ban/', icon: '🙈🐰🔍', title: 'Bé Tìm Bạn' },
  { href: '/ca-lon-bien-xanh/', icon: '🐟🐠🌊', title: 'Cá Lớn Biển Xanh' },
  { href: '/rong-con-ban-trung/', icon: '🐲🥚🎯', title: 'Rồng Con Bắn Trứng' },
  { href: '/chim-non-vuot-ong/', icon: '🐤🟢⬆️', title: 'Chim Non Vượt Ống' },
  { href: '/bong-do-phieu-luu/', icon: '🔴⭕🏁', title: 'Bóng Đỏ Phiêu Lưu' },
  { href: '/nem-banh-do-thap/', icon: '🏰🏀💥', title: 'Ném Banh Đổ Tháp' },
  { href: '/nha-tham-hiem-ti-hon/', icon: '🧗🪙🏁', title: 'Nhà Thám Hiểm Tí Hon' },
  { href: '/hang-kim-cuong/', icon: '⛏️💎🪨', title: 'Hang Kim Cương Bí Ẩn' },
  { href: '/ga-vu-tru/', icon: '🐔🛸⭐', title: 'Gà Vũ Trụ Xâm Lăng' },
  { href: '/tay-dua-nhi/', icon: '🏎️⚡🏁', title: 'Tay Đua Nhí' },
  { href: '/vu-dieu-nhip/', icon: '💃🎵🔥', title: 'Vũ Điệu Theo Nhịp' },
  { href: '/be-lam-stylist/', icon: '👗🎀🗣️', title: 'Bé Làm Stylist' },
  { href: '/phong-xinh/', icon: '🛏️🪴🖼️', title: 'Phòng Xinh Của Bé' },
  { href: '/phao-nuoc-giu-dao/', icon: '💦🏝️🤖', title: 'Pháo Nước Giữ Đảo' },
  { href: '/vo-dai-thu-nhi/', icon: '🥊🧸🛡️', title: 'Võ Đài Thú Nhí' },
  { href: '/giai-cuu-khung-long/', icon: '🦕🏃💨', title: 'Giải Cứu Khủng Long Con' },
  { href: '/kim-cuong-lap-lanh/', icon: '💎✨🔗', title: 'Kim Cương Lấp Lánh' },
  { href: '/be-hai-trai-cay/', icon: '🍉🍎✋', title: 'Bé Hái Trái Cây' },
  { href: '/xep-chu-tieng-anh/', icon: '🔤🐱🔊', title: 'Xếp Chữ Tiếng Anh' },
  { href: '/nghe-doan-tieng-anh/', icon: '👂🍎🍽️', title: 'Nghe & Đoán Tiếng Anh' },
  { href: '/nghe-doan-giao-thong/', icon: '🚗🗺️👂', title: 'Nghe & Đoán: Giao Thông & Địa Lý' },
  { href: '/nghe-doan-dong-vat-vu-tru/', icon: '🦁🚀🔢', title: 'Nghe & Đoán: Muôn Loài & Vũ Trụ' },
  { href: '/nghe-doan-gia-dinh-nghe-nghiep/', icon: '👪💼⚽', title: 'Nghe & Đoán: Gia Đình & Nghề Nghiệp' },
  { href: '/nghe-doan-do-dung-hang-ngay/', icon: '👕💻✋', title: 'Nghe & Đoán: Đồ Dùng & Cơ Thể' },
  { href: '/nghe-doan-thoi-tiet-cam-xuc/', icon: '🌦️🎨😊', title: 'Nghe & Đoán: Thời Tiết, Màu Sắc & Cảm Xúc' },
  { href: '/nghe-doan-on-tap/', icon: '🎓📚🏆', title: 'Nghe & Đoán: Ôn Tập Tổng Hợp' },
  { href: '/nghe-doan-nha-bep-cong-nghe/', icon: '🍳🥕💻', title: 'Nghe & Đoán: Nhà Bếp & Công Nghệ' },
  { href: '/nghe-doan-hoat-dong-do-choi/', icon: '🏃🧸🏛️', title: 'Nghe & Đoán: Hoạt Động, Đồ Chơi & Nơi Vui Chơi' },
  { href: '/nghe-doan-quoc-gia-nghe-nghiep/', icon: '🌍🔢💼', title: 'Nghe & Đoán: Quốc Gia, Số Đếm & Nghề Nghiệp' },
  { href: '/leo-thac-vuot-bay/', icon: '🧗🪤❤️', title: 'Leo Thác Vượt Bẫy' },
  { href: '/to-mau-tu-vung/', icon: '🎨🍎🖍️', title: 'Tô Màu Từ Vựng' },
  { href: '/chem-tu-vung/', icon: '🗡️🍎💥', title: 'Chém Từ Vựng' },
  { href: '/oc-sen-phieu-luu/', icon: '🐌🍇😋', title: 'Ốc Sên Phiêu Lưu Ăn Từ Vựng' },
  { href: '/ghep-tu-vung-hinh-anh/', icon: '🖼️🔤🎴', title: 'Ghép Từ Vựng Và Hình Ảnh' },
  { href: '/ban-chim-tu-vung/', icon: '🎯🐦🍎', title: 'Bắn Chim Từ Vựng' },
  { href: '/toan-tieng-anh/', icon: '➕🔢🇬🇧', title: 'Toán Tiếng Anh' },
  { href: '/dao-vang-tu-vung/', icon: '⛏️🍎🟫', title: 'Đào Vàng Từ Vựng' },
  { href: '/ho-ca-tu-vung/', icon: '🎣🐟🌊', title: 'Hồ Cá Từ Vựng' },
  { href: '/truong-ban-tu-vung/', icon: '🎯🥫🔫', title: 'Trường Bắn Từ Vựng' },
  { href: '/ban-trung-khung-long/', icon: '🥚🦕🎯', title: 'Bắn Trứng Khủng Long' },
  { href: '/oan-tu-ti/', icon: '✊✋✌️', title: 'Oẳn Tù Tì' },
  { href: '/ban-bi/', icon: '🎱🟡🔵', title: 'Bắn Bi' },
  { href: '/nem-lon-hoi-cho/', icon: '🥫🧒🎯', title: 'Ném Lon' },
  { href: '/nhay-day/', icon: '🪢🧒🧍', title: 'Nhảy Dây' },
  { href: '/bat-vit/', icon: '🐤🔨🅱️', title: 'Bắt Vịt' },
  { href: '/co-ca-ngua/', icon: '🐴🎲🏁', title: 'Cờ Cá Ngựa' },
  { href: '/co-ganh/', icon: '⚫🔴🔵', title: 'Cờ Gánh' },
  { href: '/o-an-quan/', icon: '🎲👑🇻🇳', title: 'Ô Ăn Quan' },
  { href: '/nhay-lo-co/', icon: '🐸🔢⬆️', title: 'Nhảy Lò Cò Số' },
  { href: '/dien-tu/', icon: '🕹️🦆🧱', title: 'Máy Điện Tử 3 Trò' },
  { href: '/ran-san-moi/', icon: '🐍🍎🅰️', title: 'Rắn Săn Mồi' },
  { href: '/xep-gach/', icon: '🏗️🟦🟨', title: 'Xếp Gạch' },
  { href: '/lat-hinh/', icon: '🃏🐱❓', title: 'Lật Hình Trí Nhớ' },
  { href: '/ghep-hinh/', icon: '🧩🖼️⚡', title: 'Ghép Hình Trượt' },
  { href: '/co-caro/', icon: '⭕❌🤖', title: 'Cờ Ca-rô' },
];

/**
 * Chọn ngẫu nhiên `n` game KHÔNG TRÙNG từ `list` — hàm THUẦN, nhận `rng`
 * (hàm trả về số 0..1, mặc định Math.random) để test được không cần giả
 * lập ngẫu nhiên thật. Nếu `list` ít hơn `n` phần tử thì trả về hết (đã xáo trộn).
 */
export function pickRandomFunGames(list, n, rng = Math.random) {
  const pool = [...list];
  const picked = [];
  const count = Math.min(n, pool.length);
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(rng() * pool.length);
    picked.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return picked;
}
