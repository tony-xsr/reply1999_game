// Nghe & Đoán: Quốc Gia, Số Đếm & Nghề Nghiệp — giai đoạn 7 (MẢNG MỚI, ngoài
// kế hoạch 5×1000 ban đầu): quốc gia & quốc kỳ, số đếm & thứ tự, môn học,
// nghề nghiệp mở rộng, dụng cụ & văn phòng (~93 mục). Lấp các khoảng trống
// "chức vụ/thiết bị nghề nghiệp" mà bản kế hoạch gốc có nhắc tới nhưng 5 giai
// đoạn đầu chưa khai thác hết. Lặp lại đúng khuôn mẫu đã kiểm chứng ở giai
// đoạn 1–6: mỗi mục có TỪ ĐƠN + CÂU NGẮN đi kèm, mỗi VÒNG chỉ chọn ngẫu nhiên
// 1 trong 2 kiểu — TRỘN LẪN, ưu tiên từ đơn nhiều hơn để bé không bị ngợp vì
// câu dài xuất hiện quá dày. Câu dài đọc chậm hơn hẳn so với từ đơn.
//
// Lưu ý thiết kế: chủ đề "Quốc gia & Quốc kỳ" dùng cờ quốc gia — đây là nhóm
// từ vựng có độ khớp hình ảnh CHÍNH XÁC TUYỆT ĐỐI (mỗi lá cờ ứng với đúng 1
// quốc gia, không có chỗ cho suy diễn/nhầm lẫn), cùng hạng với chủ đề Màu sắc
// ở giai đoạn 6. File thuần logic, không đụng DOM, test độc lập.

export const TOPICS = [
  { id: 'country', label: 'Quốc gia & Quốc kỳ', icon: '🌍' },
  { id: 'number', label: 'Số đếm & Thứ tự', icon: '🔢' },
  { id: 'subject', label: 'Môn học', icon: '📚' },
  { id: 'job', label: 'Nghề nghiệp mở rộng', icon: '💼' },
  { id: 'tool', label: 'Dụng cụ & Văn phòng', icon: '🧰' },
];

export const WORD_BANK = [
  // ===== Quốc gia & Quốc kỳ (50) =====
  { id: 'vietnam', word: 'Vietnam', emoji: '🇻🇳', vi: 'Việt Nam', topic: 'country', sentence: 'I live in Vietnam.', sentenceVi: 'Tôi sống ở Việt Nam.' },
  { id: 'usa', word: 'the USA', emoji: '🇺🇸', vi: 'nước Mỹ', topic: 'country', sentence: 'She lives in the USA.', sentenceVi: 'Cô ấy sống ở Mỹ.' },
  { id: 'uk', word: 'the UK', emoji: '🇬🇧', vi: 'nước Anh', topic: 'country', sentence: 'He is from the UK.', sentenceVi: 'Anh ấy đến từ nước Anh.' },
  { id: 'japan', word: 'Japan', emoji: '🇯🇵', vi: 'Nhật Bản', topic: 'country', sentence: 'I want to visit Japan.', sentenceVi: 'Tôi muốn đến thăm Nhật Bản.' },
  { id: 'korea', word: 'Korea', emoji: '🇰🇷', vi: 'Hàn Quốc', topic: 'country', sentence: 'She is from Korea.', sentenceVi: 'Cô ấy đến từ Hàn Quốc.' },
  { id: 'china', word: 'China', emoji: '🇨🇳', vi: 'Trung Quốc', topic: 'country', sentence: 'China is a big country.', sentenceVi: 'Trung Quốc là một nước lớn.' },
  { id: 'france', word: 'France', emoji: '🇫🇷', vi: 'Pháp', topic: 'country', sentence: 'Paris is in France.', sentenceVi: 'Paris nằm ở Pháp.' },
  { id: 'germany', word: 'Germany', emoji: '🇩🇪', vi: 'Đức', topic: 'country', sentence: 'He lives in Germany.', sentenceVi: 'Anh ấy sống ở Đức.' },
  { id: 'italy', word: 'Italy', emoji: '🇮🇹', vi: 'Ý', topic: 'country', sentence: 'I love pizza from Italy.', sentenceVi: 'Tôi thích pizza từ Ý.' },
  { id: 'spain', word: 'Spain', emoji: '🇪🇸', vi: 'Tây Ban Nha', topic: 'country', sentence: 'She travels to Spain.', sentenceVi: 'Cô ấy đi du lịch Tây Ban Nha.' },
  { id: 'brazil', word: 'Brazil', emoji: '🇧🇷', vi: 'Bra-xin', topic: 'country', sentence: 'Brazil is in South America.', sentenceVi: 'Bra-xin nằm ở Nam Mỹ.' },
  { id: 'australia', word: 'Australia', emoji: '🇦🇺', vi: 'Úc', topic: 'country', sentence: 'Kangaroos live in Australia.', sentenceVi: 'Chuột túi sống ở Úc.' },
  { id: 'india', word: 'India', emoji: '🇮🇳', vi: 'Ấn Độ', topic: 'country', sentence: 'India has many people.', sentenceVi: 'Ấn Độ có rất nhiều người.' },
  { id: 'russia', word: 'Russia', emoji: '🇷🇺', vi: 'Nga', topic: 'country', sentence: 'Russia is very big.', sentenceVi: 'Nước Nga rất rộng lớn.' },
  { id: 'canada', word: 'Canada', emoji: '🇨🇦', vi: 'Ca-na-đa', topic: 'country', sentence: 'It is cold in Canada.', sentenceVi: 'Trời lạnh ở Ca-na-đa.' },
  { id: 'thailand', word: 'Thailand', emoji: '🇹🇭', vi: 'Thái Lan', topic: 'country', sentence: 'We travel to Thailand.', sentenceVi: 'Chúng tôi du lịch Thái Lan.' },
  { id: 'singapore', word: 'Singapore', emoji: '🇸🇬', vi: 'Singapore', topic: 'country', sentence: 'Singapore is a small country.', sentenceVi: 'Singapore là một nước nhỏ.' },
  { id: 'egypt', word: 'Egypt', emoji: '🇪🇬', vi: 'Ai Cập', topic: 'country', sentence: 'The pyramids are in Egypt.', sentenceVi: 'Kim tự tháp nằm ở Ai Cập.' },
  { id: 'laos', word: 'Laos', emoji: '🇱🇦', vi: 'Lào', topic: 'country', sentence: 'Laos is next to Vietnam.', sentenceVi: 'Lào nằm cạnh Việt Nam.' },
  { id: 'cambodia', word: 'Cambodia', emoji: '🇰🇭', vi: 'Cam-pu-chia', topic: 'country', sentence: 'Cambodia has old temples.', sentenceVi: 'Cam-pu-chia có nhiều đền cổ.' },
  { id: 'malaysia', word: 'Malaysia', emoji: '🇲🇾', vi: 'Ma-lai-xi-a', topic: 'country', sentence: 'Malaysia has tall towers.', sentenceVi: 'Ma-lai-xi-a có những tòa tháp cao.' },
  { id: 'indonesia', word: 'Indonesia', emoji: '🇮🇩', vi: 'In-đô-nê-xi-a', topic: 'country', sentence: 'Indonesia has many islands.', sentenceVi: 'In-đô-nê-xi-a có rất nhiều đảo.' },
  { id: 'philippines', word: 'the Philippines', emoji: '🇵🇭', vi: 'Phi-líp-pin', topic: 'country', sentence: 'The Philippines is near the sea.', sentenceVi: 'Phi-líp-pin nằm gần biển.' },
  { id: 'mexico', word: 'Mexico', emoji: '🇲🇽', vi: 'Mê-hi-cô', topic: 'country', sentence: 'Tacos come from Mexico.', sentenceVi: 'Bánh taco đến từ Mê-hi-cô.' },
  { id: 'netherlands', word: 'the Netherlands', emoji: '🇳🇱', vi: 'Hà Lan', topic: 'country', sentence: 'The Netherlands has many tulips.', sentenceVi: 'Hà Lan có rất nhiều hoa tulip.' },
  { id: 'switzerland', word: 'Switzerland', emoji: '🇨🇭', vi: 'Thụy Sĩ', topic: 'country', sentence: 'Switzerland has high mountains.', sentenceVi: 'Thụy Sĩ có núi rất cao.' },
  { id: 'greece', word: 'Greece', emoji: '🇬🇷', vi: 'Hy Lạp', topic: 'country', sentence: 'Greece is very old.', sentenceVi: 'Hy Lạp là đất nước rất cổ kính.' },
  { id: 'turkey', word: 'Turkey', emoji: '🇹🇷', vi: 'Thổ Nhĩ Kỳ', topic: 'country', sentence: 'Turkey connects Asia and Europe.', sentenceVi: 'Thổ Nhĩ Kỳ nối châu Á và châu Âu.' },
  { id: 'argentina', word: 'Argentina', emoji: '🇦🇷', vi: 'Ác-hen-ti-na', topic: 'country', sentence: 'Argentina loves football.', sentenceVi: 'Ác-hen-ti-na rất mê bóng đá.' },
  { id: 'newzealand', word: 'New Zealand', emoji: '🇳🇿', vi: 'Niu Di-lân', topic: 'country', sentence: 'New Zealand has many sheep.', sentenceVi: 'Niu Di-lân có rất nhiều cừu.' },
  { id: 'sweden', word: 'Sweden', emoji: '🇸🇪', vi: 'Thụy Điển', topic: 'country', sentence: 'Sweden has cold winters.', sentenceVi: 'Thụy Điển có mùa đông lạnh giá.' },
  { id: 'norway', word: 'Norway', emoji: '🇳🇴', vi: 'Na Uy', topic: 'country', sentence: 'Norway has many fjords.', sentenceVi: 'Na Uy có nhiều vịnh hẹp.' },
  { id: 'finland', word: 'Finland', emoji: '🇫🇮', vi: 'Phần Lan', topic: 'country', sentence: 'Finland has many lakes.', sentenceVi: 'Phần Lan có rất nhiều hồ.' },
  { id: 'denmark', word: 'Denmark', emoji: '🇩🇰', vi: 'Đan Mạch', topic: 'country', sentence: 'Lego comes from Denmark.', sentenceVi: 'Đồ chơi Lego đến từ Đan Mạch.' },
  { id: 'poland', word: 'Poland', emoji: '🇵🇱', vi: 'Ba Lan', topic: 'country', sentence: 'Poland is in Europe.', sentenceVi: 'Ba Lan nằm ở châu Âu.' },
  { id: 'ireland', word: 'Ireland', emoji: '🇮🇪', vi: 'Ai-len', topic: 'country', sentence: 'Ireland is very green.', sentenceVi: 'Ai-len có màu xanh mướt.' },
  { id: 'iceland', word: 'Iceland', emoji: '🇮🇸', vi: 'Ai-xơ-len', topic: 'country', sentence: 'Iceland has volcanoes.', sentenceVi: 'Ai-xơ-len có nhiều núi lửa.' },
  { id: 'ukraine', word: 'Ukraine', emoji: '🇺🇦', vi: 'U-crai-na', topic: 'country', sentence: 'Ukraine grows a lot of wheat.', sentenceVi: 'U-crai-na trồng rất nhiều lúa mì.' },
  { id: 'portugal', word: 'Portugal', emoji: '🇵🇹', vi: 'Bồ Đào Nha', topic: 'country', sentence: 'Portugal is next to Spain.', sentenceVi: 'Bồ Đào Nha nằm cạnh Tây Ban Nha.' },
  { id: 'austria', word: 'Austria', emoji: '🇦🇹', vi: 'Áo', topic: 'country', sentence: 'Austria has beautiful music.', sentenceVi: 'Nước Áo có nền âm nhạc tuyệt vời.' },
  { id: 'belgium', word: 'Belgium', emoji: '🇧🇪', vi: 'Bỉ', topic: 'country', sentence: 'Belgium makes great chocolate.', sentenceVi: 'Nước Bỉ làm sô-cô-la rất ngon.' },
  { id: 'saudiarabia', word: 'Saudi Arabia', emoji: '🇸🇦', vi: 'Ả Rập Xê Út', topic: 'country', sentence: 'Saudi Arabia has big deserts.', sentenceVi: 'Ả Rập Xê Út có sa mạc rộng lớn.' },
  { id: 'uae', word: 'the UAE', emoji: '🇦🇪', vi: 'UAE', topic: 'country', sentence: 'The UAE has very tall buildings.', sentenceVi: 'UAE có những tòa nhà rất cao.' },
  { id: 'southafrica', word: 'South Africa', emoji: '🇿🇦', vi: 'Nam Phi', topic: 'country', sentence: 'Lions live in South Africa.', sentenceVi: 'Sư tử sống ở Nam Phi.' },
  { id: 'chile', word: 'Chile', emoji: '🇨🇱', vi: 'Chi-lê', topic: 'country', sentence: 'Chile is long and thin.', sentenceVi: 'Chi-lê có hình dáng dài và hẹp.' },
  { id: 'cuba', word: 'Cuba', emoji: '🇨🇺', vi: 'Cu-ba', topic: 'country', sentence: 'Cuba is an island country.', sentenceVi: 'Cu-ba là một đảo quốc.' },
  { id: 'mongolia', word: 'Mongolia', emoji: '🇲🇳', vi: 'Mông Cổ', topic: 'country', sentence: 'Mongolia has wide grasslands.', sentenceVi: 'Mông Cổ có thảo nguyên rộng lớn.' },
  { id: 'nepal', word: 'Nepal', emoji: '🇳🇵', vi: 'Nê-pan', topic: 'country', sentence: 'Mount Everest is in Nepal.', sentenceVi: 'Đỉnh Everest nằm ở Nê-pan.' },
  { id: 'myanmar', word: 'Myanmar', emoji: '🇲🇲', vi: 'Mi-an-ma', topic: 'country', sentence: 'Myanmar has golden temples.', sentenceVi: 'Mi-an-ma có những ngôi chùa dát vàng.' },
  { id: 'srilanka', word: 'Sri Lanka', emoji: '🇱🇰', vi: 'Xri Lan-ca', topic: 'country', sentence: 'Sri Lanka grows good tea.', sentenceVi: 'Xri Lan-ca trồng trà rất ngon.' },

  // ===== Số đếm & Thứ tự (14) =====
  { id: 'zero', word: 'zero', emoji: '0️⃣', vi: 'số không', topic: 'number', sentence: 'Zero comes before one.', sentenceVi: 'Số không đứng trước số một.' },
  { id: 'one', word: 'one', emoji: '1️⃣', vi: 'số một', topic: 'number', sentence: 'I have one apple.', sentenceVi: 'Tôi có một quả táo.' },
  { id: 'two', word: 'two', emoji: '2️⃣', vi: 'số hai', topic: 'number', sentence: 'I have two hands.', sentenceVi: 'Tôi có hai bàn tay.' },
  { id: 'three', word: 'three', emoji: '3️⃣', vi: 'số ba', topic: 'number', sentence: 'The cat has three kittens.', sentenceVi: 'Con mèo có ba con mèo con.' },
  { id: 'four', word: 'four', emoji: '4️⃣', vi: 'số bốn', topic: 'number', sentence: 'A table has four legs.', sentenceVi: 'Cái bàn có bốn chân.' },
  { id: 'five', word: 'five', emoji: '5️⃣', vi: 'số năm', topic: 'number', sentence: 'I have five fingers.', sentenceVi: 'Tôi có năm ngón tay.' },
  { id: 'six', word: 'six', emoji: '6️⃣', vi: 'số sáu', topic: 'number', sentence: 'An insect has six legs.', sentenceVi: 'Côn trùng có sáu chân.' },
  { id: 'seven', word: 'seven', emoji: '7️⃣', vi: 'số bảy', topic: 'number', sentence: 'There are seven days in a week.', sentenceVi: 'Một tuần có bảy ngày.' },
  { id: 'eight', word: 'eight', emoji: '8️⃣', vi: 'số tám', topic: 'number', sentence: 'A spider has eight legs.', sentenceVi: 'Con nhện có tám chân.' },
  { id: 'nine', word: 'nine', emoji: '9️⃣', vi: 'số chín', topic: 'number', sentence: 'The cat has nine lives.', sentenceVi: 'Con mèo có chín mạng.' },
  { id: 'ten', word: 'ten', emoji: '🔟', vi: 'số mười', topic: 'number', sentence: 'I count to ten.', sentenceVi: 'Tôi đếm đến mười.' },
  { id: 'first', word: 'first', emoji: '🥇', vi: 'thứ nhất', topic: 'number', sentence: 'I am first in line.', sentenceVi: 'Tôi đứng thứ nhất trong hàng.' },
  { id: 'second', word: 'second', emoji: '🥈', vi: 'thứ hai', topic: 'number', sentence: 'She is second in the race.', sentenceVi: 'Cô ấy về thứ hai trong cuộc đua.' },
  { id: 'third', word: 'third', emoji: '🥉', vi: 'thứ ba', topic: 'number', sentence: 'He is third in line.', sentenceVi: 'Cậu ấy đứng thứ ba trong hàng.' },

  // ===== Môn học (10) =====
  { id: 'math', word: 'math', emoji: '🔢', vi: 'toán học', topic: 'subject', sentence: 'I like math class.', sentenceVi: 'Tôi thích tiết toán.' },
  { id: 'art', word: 'art', emoji: '🎨', vi: 'mỹ thuật', topic: 'subject', sentence: 'Art class is fun.', sentenceVi: 'Tiết mỹ thuật rất vui.' },
  { id: 'music', word: 'music class', emoji: '🎵', vi: 'âm nhạc', topic: 'subject', sentence: 'I enjoy music class.', sentenceVi: 'Tôi thích tiết âm nhạc.' },
  { id: 'science', word: 'science', emoji: '🔬', vi: 'khoa học', topic: 'subject', sentence: 'Science class is interesting.', sentenceVi: 'Tiết khoa học rất thú vị.' },
  { id: 'pe', word: 'PE', emoji: '🤸', vi: 'thể dục', topic: 'subject', sentence: 'I like PE class.', sentenceVi: 'Tôi thích tiết thể dục.' },
  { id: 'reading', word: 'reading', emoji: '📖', vi: 'tập đọc', topic: 'subject', sentence: 'I enjoy reading class.', sentenceVi: 'Tôi thích tiết tập đọc.' },
  { id: 'writing', word: 'writing class', emoji: '✍️', vi: 'tập viết', topic: 'subject', sentence: 'Writing class is important.', sentenceVi: 'Tiết tập viết rất quan trọng.' },
  { id: 'history', word: 'history', emoji: '📜', vi: 'lịch sử', topic: 'subject', sentence: 'History class teaches the past.', sentenceVi: 'Tiết lịch sử dạy về quá khứ.' },
  { id: 'geography', word: 'geography', emoji: '🗺️', vi: 'địa lý', topic: 'subject', sentence: 'Geography class shows maps.', sentenceVi: 'Tiết địa lý cho xem bản đồ.' },
  { id: 'computerscience', word: 'computer science', emoji: '💻', vi: 'tin học', topic: 'subject', sentence: 'I learn computer science.', sentenceVi: 'Tôi học tin học.' },

  // ===== Nghề nghiệp mở rộng (11) =====
  { id: 'dentist', word: 'dentist', emoji: '🦷', vi: 'nha sĩ', topic: 'job', sentence: 'The dentist checks my teeth.', sentenceVi: 'Nha sĩ khám răng cho tôi.' },
  { id: 'vet', word: 'vet', emoji: '🐾', vi: 'bác sĩ thú y', topic: 'job', sentence: 'The vet helps sick animals.', sentenceVi: 'Bác sĩ thú y giúp đỡ động vật ốm.' },
  { id: 'engineer', word: 'engineer', emoji: '⚙️', vi: 'kỹ sư', topic: 'job', sentence: 'The engineer builds machines.', sentenceVi: 'Kỹ sư chế tạo máy móc.' },
  { id: 'electrician', word: 'electrician', emoji: '🔌', vi: 'thợ điện', topic: 'job', sentence: 'The electrician fixes wires.', sentenceVi: 'Thợ điện sửa dây điện.' },
  { id: 'waiter', word: 'waiter', emoji: '🍽️', vi: 'người phục vụ', topic: 'job', sentence: 'The waiter brings the food.', sentenceVi: 'Người phục vụ mang thức ăn ra.' },
  { id: 'cashier', word: 'cashier', emoji: '🧾', vi: 'thu ngân', topic: 'job', sentence: 'The cashier takes my money.', sentenceVi: 'Thu ngân nhận tiền của tôi.' },
  { id: 'photographer', word: 'photographer', emoji: '📸', vi: 'thợ chụp ảnh', topic: 'job', sentence: 'The photographer takes pictures.', sentenceVi: 'Thợ chụp ảnh chụp hình.' },
  { id: 'architect', word: 'architect', emoji: '📐', vi: 'kiến trúc sư', topic: 'job', sentence: 'The architect designs buildings.', sentenceVi: 'Kiến trúc sư thiết kế tòa nhà.' },
  { id: 'manager', word: 'manager', emoji: '📊', vi: 'quản lý', topic: 'job', sentence: 'The manager leads the team.', sentenceVi: 'Người quản lý dẫn dắt đội nhóm.' },
  { id: 'soldier', word: 'soldier', emoji: '🫡', vi: 'chú bộ đội', topic: 'job', sentence: 'The soldier protects the country.', sentenceVi: 'Chú bộ đội bảo vệ đất nước.' },
  { id: 'librarian', word: 'librarian', emoji: '📚', vi: 'thủ thư', topic: 'job', sentence: 'The librarian helps me find books.', sentenceVi: 'Thủ thư giúp tôi tìm sách.' },

  // ===== Dụng cụ & Văn phòng (8) =====
  { id: 'stethoscope', word: 'stethoscope', emoji: '🩺', vi: 'ống nghe', topic: 'tool', sentence: 'The doctor uses a stethoscope.', sentenceVi: 'Bác sĩ dùng ống nghe.' },
  { id: 'toolbox', word: 'toolbox', emoji: '🧰', vi: 'hộp dụng cụ', topic: 'tool', sentence: 'Dad has a toolbox.', sentenceVi: 'Bố có một hộp dụng cụ.' },
  { id: 'briefcase', word: 'briefcase', emoji: '💼', vi: 'cặp công sở', topic: 'tool', sentence: 'He carries a briefcase to work.', sentenceVi: 'Anh ấy mang cặp công sở đi làm.' },
  { id: 'magnifyingglass', word: 'magnifying glass', emoji: '🔍', vi: 'kính lúp', topic: 'tool', sentence: 'I look through a magnifying glass.', sentenceVi: 'Tôi nhìn qua kính lúp.' },
  { id: 'clipboard', word: 'clipboard', emoji: '📋', vi: 'bảng kẹp giấy', topic: 'tool', sentence: 'The teacher holds a clipboard.', sentenceVi: 'Cô giáo cầm bảng kẹp giấy.' },
  { id: 'folder', word: 'folder', emoji: '📁', vi: 'cặp hồ sơ', topic: 'tool', sentence: 'I keep papers in a folder.', sentenceVi: 'Tôi để giấy tờ trong cặp hồ sơ.' },
  { id: 'envelope', word: 'envelope', emoji: '✉️', vi: 'phong bì', topic: 'tool', sentence: 'I send a letter in an envelope.', sentenceVi: 'Tôi gửi thư trong phong bì.' },
  { id: 'paperclip', word: 'paperclip', emoji: '📎', vi: 'kẹp giấy', topic: 'tool', sentence: 'I use a paperclip for papers.', sentenceVi: 'Tôi dùng kẹp giấy để kẹp giấy tờ.' },
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
