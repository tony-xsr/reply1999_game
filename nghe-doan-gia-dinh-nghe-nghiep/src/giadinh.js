// Nghe & Đoán: Gia Đình, Trường Học & Nghề Nghiệp — giai đoạn 4 của dự án
// "5x1000 từ vựng": gia đình & bạn bè, trường học, nghề nghiệp, thể thao, thi
// đấu & hoạt động (~99 mục). Lặp lại đúng khuôn mẫu đã kiểm chứng ở giai đoạn
// 1–3: mỗi mục có TỪ ĐƠN + CÂU NGẮN đi kèm, mỗi VÒNG chỉ chọn ngẫu nhiên 1
// trong 2 kiểu — TRỘN LẪN, ưu tiên từ đơn nhiều hơn để bé không bị ngợp vì
// câu dài xuất hiện quá dày. Câu dài đọc chậm hơn hẳn so với từ đơn.
//
// Lưu ý thiết kế riêng cho mảng này: từ vựng quan hệ gia đình (mẹ/bố/dì/cậu...)
// PHẦN LỚN không có emoji riêng biệt (đều dùng chung icon người lớn/trẻ em),
// nếu thêm đủ hết sẽ khiến nhiều mục dùng CHUNG 1 hình — gây nhầm lẫn nghiêm
// trọng trong màn chơi 4 lựa chọn (2 nút giống hệt nhau nhưng khác đáp án).
// Vì vậy chủ đề "Gia đình & Bạn bè" CHỦ ĐỘNG chỉ giữ lại các từ có icon THẬT
// SỰ riêng biệt, chấp nhận danh sách ngắn hơn (14) thay vì cố nhồi cho đủ 20.
// File thuần logic, không đụng DOM, test độc lập.

export const TOPICS = [
  { id: 'family', label: 'Gia đình & Bạn bè', icon: '👪' },
  { id: 'school', label: 'Trường học', icon: '🏫' },
  { id: 'job', label: 'Nghề nghiệp', icon: '💼' },
  { id: 'sport', label: 'Thể thao', icon: '⚽' },
  { id: 'compete', label: 'Thi đấu & Hoạt động', icon: '🏆' },
];

export const WORD_BANK = [
  // ===== Gia đình & Bạn bè (14) =====
  { id: 'family', word: 'family', emoji: '👪', vi: 'gia đình', topic: 'family', sentence: 'I love my family.', sentenceVi: 'Tôi yêu gia đình của tôi.' },
  { id: 'baby', word: 'baby', emoji: '👶', vi: 'em bé', topic: 'family', sentence: 'The baby is sleeping.', sentenceVi: 'Em bé đang ngủ.' },
  { id: 'grandmother', word: 'grandmother', emoji: '👵', vi: 'bà', topic: 'family', sentence: 'My grandmother tells stories.', sentenceVi: 'Bà tôi kể chuyện.' },
  { id: 'grandfather', word: 'grandfather', emoji: '👴', vi: 'ông', topic: 'family', sentence: 'My grandfather reads the newspaper.', sentenceVi: 'Ông tôi đọc báo.' },
  { id: 'pregnant', word: 'pregnant', emoji: '🤰', vi: 'mang thai', topic: 'family', sentence: 'Mom is pregnant.', sentenceVi: 'Mẹ đang mang thai.' },
  { id: 'wedding', word: 'wedding', emoji: '💒', vi: 'đám cưới', topic: 'family', sentence: 'We go to a wedding.', sentenceVi: 'Chúng tôi đi dự đám cưới.' },
  { id: 'ring', word: 'ring', emoji: '💍', vi: 'chiếc nhẫn', topic: 'family', sentence: 'He gives her a ring.', sentenceVi: 'Anh ấy tặng cô ấy một chiếc nhẫn.' },
  { id: 'couple', word: 'couple', emoji: '👫', vi: 'cặp đôi', topic: 'family', sentence: 'The couple walks together.', sentenceVi: 'Cặp đôi đi cùng nhau.' },
  { id: 'inlove', word: 'in love', emoji: '💑', vi: 'yêu nhau', topic: 'family', sentence: 'They are in love.', sentenceVi: 'Họ đang yêu nhau.' },
  { id: 'hug', word: 'hug', emoji: '🫂', vi: 'cái ôm', topic: 'family', sentence: 'I give my mom a hug.', sentenceVi: 'Tôi ôm mẹ.' },
  { id: 'twins', word: 'twins', emoji: '👯', vi: 'cặp song sinh', topic: 'family', sentence: 'The twins look the same.', sentenceVi: 'Cặp song sinh trông giống nhau.' },
  { id: 'friend', word: 'friend', emoji: '🤝', vi: 'bạn bè', topic: 'family', sentence: 'She is my best friend.', sentenceVi: 'Cô ấy là bạn thân nhất của tôi.' },
  { id: 'love', word: 'love', emoji: '💕', vi: 'tình yêu thương', topic: 'family', sentence: 'I love my family very much.', sentenceVi: 'Tôi rất yêu thương gia đình mình.' },
  { id: 'kiss', word: 'kiss', emoji: '💋', vi: 'nụ hôn', topic: 'family', sentence: 'Mom gives me a kiss.', sentenceVi: 'Mẹ hôn tôi.' },
  { id: 'mother', word: 'mother', emoji: '👩', vi: 'mẹ', topic: 'family', sentence: 'My mother loves me.', sentenceVi: 'Mẹ tôi yêu tôi.' },
  { id: 'father', word: 'father', emoji: '👨', vi: 'bố', topic: 'family', sentence: 'My father is tall.', sentenceVi: 'Bố tôi rất cao.' },
  { id: 'brother', word: 'brother', emoji: '👦', vi: 'anh trai, em trai', topic: 'family', sentence: 'My brother plays with me.', sentenceVi: 'Anh trai tôi chơi cùng tôi.' },
  { id: 'sister', word: 'sister', emoji: '👧', vi: 'chị gái, em gái', topic: 'family', sentence: 'My sister is kind.', sentenceVi: 'Chị gái tôi rất hiền.' },
  // 5 mục dưới dùng SVG CÂY GIA ĐÌNH tự vẽ: node "Bé" (viền xanh nét đứt) làm
  // mốc tham chiếu cố định, người thân cần đoán được tô sáng viền cam — vì từ
  // QUAN HỆ họ hàng không thể minh họa bằng 1 gương mặt đơn lẻ.
  { id: 'parents', word: 'parents', emoji: '👨‍👩‍👦', img: 'images/tree-parents.svg', vi: 'bố mẹ', topic: 'family', sentence: 'I love my parents.', sentenceVi: 'Tôi yêu bố mẹ tôi.' },
  { id: 'grandparents', word: 'grandparents', emoji: '🧓', img: 'images/tree-grandparents.svg', vi: 'ông bà', topic: 'family', sentence: 'My grandparents live nearby.', sentenceVi: 'Ông bà tôi sống gần nhà.' },
  { id: 'aunt', word: 'aunt', emoji: '👱‍♀️', img: 'images/tree-aunt.svg', vi: 'cô, dì', topic: 'family', sentence: 'My aunt visits us.', sentenceVi: 'Cô tôi đến thăm nhà tôi.' },
  { id: 'uncle', word: 'uncle', emoji: '🧔', img: 'images/tree-uncle.svg', vi: 'chú, bác', topic: 'family', sentence: 'My uncle is funny.', sentenceVi: 'Chú tôi rất vui tính.' },
  { id: 'cousin', word: 'cousin', emoji: '🧑', img: 'images/tree-cousin.svg', vi: 'anh chị em họ', topic: 'family', sentence: 'I play with my cousin.', sentenceVi: 'Tôi chơi với anh em họ của tôi.' },

  // ===== Trường học (20) =====
  { id: 'school', word: 'school', emoji: '🏫', vi: 'trường học', topic: 'school', sentence: 'I go to school every day.', sentenceVi: 'Tôi đi học mỗi ngày.' },
  { id: 'teacher', word: 'teacher', emoji: '👩‍🏫', vi: 'cô giáo', topic: 'school', sentence: 'The teacher teaches math.', sentenceVi: 'Cô giáo dạy toán.' },
  { id: 'student', word: 'student', emoji: '🧑‍🎓', vi: 'học sinh', topic: 'school', sentence: 'The student studies hard.', sentenceVi: 'Học sinh học chăm chỉ.' },
  { id: 'backpack', word: 'backpack', emoji: '🎒', vi: 'cặp sách', topic: 'school', sentence: 'I carry my backpack to school.', sentenceVi: 'Tôi mang cặp sách đến trường.' },
  { id: 'book', word: 'book', emoji: '📖', vi: 'quyển sách', topic: 'school', sentence: 'I read a book.', sentenceVi: 'Tôi đọc một quyển sách.' },
  { id: 'pencil', word: 'pencil', emoji: '✏️', vi: 'cây bút chì', topic: 'school', sentence: 'I write with a pencil.', sentenceVi: 'Tôi viết bằng bút chì.' },
  { id: 'pen', word: 'pen', emoji: '🖊️', vi: 'cây bút mực', topic: 'school', sentence: 'I sign my name with a pen.', sentenceVi: 'Tôi ký tên bằng bút mực.' },
  { id: 'notebook', word: 'notebook', emoji: '📓', vi: 'quyển vở', topic: 'school', sentence: 'I write in my notebook.', sentenceVi: 'Tôi viết vào quyển vở.' },
  { id: 'notepad', word: 'notepad', emoji: '🗒️', vi: 'sổ tay', topic: 'school', sentence: 'I take notes in my notepad.', sentenceVi: 'Tôi ghi chú vào sổ tay.' },
  { id: 'crayon', word: 'crayon', emoji: '🖍️', vi: 'bút sáp màu', topic: 'school', sentence: 'I color with a crayon.', sentenceVi: 'Tôi tô màu bằng bút sáp.' },
  { id: 'paintbrush', word: 'paintbrush', emoji: '🖌️', vi: 'cây cọ vẽ', topic: 'school', sentence: 'I paint with a paintbrush.', sentenceVi: 'Tôi vẽ bằng cây cọ.' },
  { id: 'scissors', word: 'scissors', emoji: '✂️', vi: 'cây kéo', topic: 'school', sentence: 'I cut paper with scissors.', sentenceVi: 'Tôi cắt giấy bằng kéo.' },
  { id: 'globe', word: 'globe', emoji: '🌐', vi: 'quả địa cầu', topic: 'school', sentence: 'The globe shows the world.', sentenceVi: 'Quả địa cầu cho thấy thế giới.' },
  { id: 'microscope', word: 'microscope', emoji: '🔬', vi: 'kính hiển vi', topic: 'school', sentence: 'I look through a microscope.', sentenceVi: 'Tôi nhìn qua kính hiển vi.' },
  { id: 'testtube', word: 'test tube', emoji: '🧪', vi: 'ống nghiệm', topic: 'school', sentence: 'The scientist uses a test tube.', sentenceVi: 'Nhà khoa học dùng ống nghiệm.' },
  { id: 'graduationcap', word: 'graduation cap', emoji: '🎓', vi: 'mũ tốt nghiệp', topic: 'school', sentence: 'I wear a graduation cap.', sentenceVi: 'Tôi đội mũ tốt nghiệp.' },
  { id: 'diploma', word: 'diploma', emoji: '📜', vi: 'tấm bằng', topic: 'school', sentence: 'I get a diploma.', sentenceVi: 'Tôi nhận được tấm bằng.' },
  { id: 'alarmclock', word: 'alarm clock', emoji: '⏰', vi: 'đồng hồ báo thức', topic: 'school', sentence: 'The alarm clock wakes me up.', sentenceVi: 'Đồng hồ báo thức đánh thức tôi.' },
  { id: 'abc', word: 'ABC', emoji: '🔤', vi: 'bảng chữ cái', topic: 'school', sentence: 'I learn the ABC.', sentenceVi: 'Tôi học bảng chữ cái.' },
  { id: 'calculator', word: 'calculator', emoji: '🧮', img: 'images/calculator.jpg', vi: 'máy tính', topic: 'school', sentence: 'I count with a calculator.', sentenceVi: 'Tôi tính bằng máy tính.' },

  // ===== Nghề nghiệp (16) =====
  { id: 'doctor', word: 'doctor', emoji: '🧑‍⚕️', vi: 'bác sĩ', topic: 'job', sentence: 'The doctor helps sick people.', sentenceVi: 'Bác sĩ giúp người bệnh.' },
  { id: 'farmer', word: 'farmer', emoji: '🧑‍🌾', vi: 'nông dân', topic: 'job', sentence: 'The farmer grows rice.', sentenceVi: 'Nông dân trồng lúa.' },
  { id: 'chef', word: 'chef', emoji: '🧑‍🍳', vi: 'đầu bếp', topic: 'job', sentence: 'The chef cooks delicious food.', sentenceVi: 'Đầu bếp nấu món ăn ngon.' },
  { id: 'police', word: 'police officer', emoji: '👮', vi: 'cảnh sát', topic: 'job', sentence: 'The police keep us safe.', sentenceVi: 'Cảnh sát giữ an toàn cho chúng ta.' },
  { id: 'firefighter', word: 'firefighter', emoji: '🧑‍🚒', vi: 'lính cứu hỏa', topic: 'job', sentence: 'The firefighter puts out fires.', sentenceVi: 'Lính cứu hỏa dập lửa.' },
  { id: 'scientist', word: 'scientist', emoji: '🧑‍🔬', vi: 'nhà khoa học', topic: 'job', sentence: 'The scientist studies things.', sentenceVi: 'Nhà khoa học nghiên cứu mọi thứ.' },
  { id: 'artist', word: 'artist', emoji: '🧑‍🎨', vi: 'họa sĩ', topic: 'job', sentence: 'The artist paints pictures.', sentenceVi: 'Họa sĩ vẽ tranh.' },
  { id: 'singer', word: 'singer', emoji: '🧑‍🎤', vi: 'ca sĩ', topic: 'job', sentence: 'The singer sings a song.', sentenceVi: 'Ca sĩ hát một bài hát.' },
  { id: 'mechanic', word: 'mechanic', emoji: '🧑‍🔧', vi: 'thợ máy', topic: 'job', sentence: 'The mechanic fixes cars.', sentenceVi: 'Thợ máy sửa xe hơi.' },
  { id: 'judge', word: 'judge', emoji: '🧑‍⚖️', vi: 'quan tòa', topic: 'job', sentence: 'The judge works at court.', sentenceVi: 'Quan tòa làm việc tại tòa án.' },
  { id: 'factoryworker', word: 'factory worker', emoji: '🧑‍🏭', vi: 'công nhân', topic: 'job', sentence: 'The factory worker makes things.', sentenceVi: 'Công nhân làm ra sản phẩm.' },
  { id: 'officeworker', word: 'office worker', emoji: '🧑‍💼', vi: 'nhân viên văn phòng', topic: 'job', sentence: 'The office worker works at a desk.', sentenceVi: 'Nhân viên văn phòng làm việc tại bàn.' },
  { id: 'guard', word: 'guard', emoji: '💂', vi: 'lính gác', topic: 'job', sentence: 'The guard stands very still.', sentenceVi: 'Lính gác đứng rất yên.' },
  { id: 'superhero', word: 'superhero', emoji: '🦸', vi: 'siêu anh hùng', topic: 'job', sentence: 'The superhero saves the day.', sentenceVi: 'Siêu anh hùng cứu giúp mọi người.' },
  { id: 'fisherman', word: 'fisherman', emoji: '🎣', img: 'images/fisherman.jpg', vi: 'ngư dân', topic: 'job', sentence: 'The fisherman catches fish.', sentenceVi: 'Ngư dân bắt cá.' },
  { id: 'barber', word: 'barber', emoji: '💇', img: 'images/barber.jpg', vi: 'thợ cắt tóc', topic: 'job', sentence: 'The barber cuts my hair.', sentenceVi: 'Thợ cắt tóc cắt tóc cho tôi.' },

  // ===== Thể thao (20) =====
  { id: 'soccer', word: 'soccer', emoji: '⚽', vi: 'bóng đá', topic: 'sport', sentence: 'I play soccer with friends.', sentenceVi: 'Tôi chơi bóng đá với bạn bè.' },
  { id: 'basketball', word: 'basketball', emoji: '🏀', vi: 'bóng rổ', topic: 'sport', sentence: 'I shoot the basketball.', sentenceVi: 'Tôi ném bóng rổ.' },
  { id: 'baseball', word: 'baseball', emoji: '⚾', vi: 'bóng chày', topic: 'sport', sentence: 'I hit the baseball.', sentenceVi: 'Tôi đánh bóng chày.' },
  { id: 'tennis', word: 'tennis', emoji: '🎾', vi: 'quần vợt', topic: 'sport', sentence: 'I play tennis on the court.', sentenceVi: 'Tôi chơi quần vợt trên sân.' },
  { id: 'volleyball', word: 'volleyball', emoji: '🏐', vi: 'bóng chuyền', topic: 'sport', sentence: 'We play volleyball together.', sentenceVi: 'Chúng tôi chơi bóng chuyền cùng nhau.' },
  { id: 'football', word: 'football', emoji: '🏈', vi: 'bóng bầu dục Mỹ', topic: 'sport', sentence: 'He throws the football.', sentenceVi: 'Anh ấy ném quả bóng bầu dục.' },
  { id: 'rugby', word: 'rugby', emoji: '🏉', vi: 'bóng bầu dục', topic: 'sport', sentence: 'They play rugby on the field.', sentenceVi: 'Họ chơi bóng bầu dục trên sân.' },
  { id: 'badminton', word: 'badminton', emoji: '🏸', vi: 'cầu lông', topic: 'sport', sentence: 'I play badminton with my sister.', sentenceVi: 'Tôi chơi cầu lông với em gái.' },
  { id: 'tabletennis', word: 'table tennis', emoji: '🏓', vi: 'bóng bàn', topic: 'sport', sentence: 'I play table tennis indoors.', sentenceVi: 'Tôi chơi bóng bàn trong nhà.' },
  { id: 'bowling', word: 'bowling', emoji: '🎳', vi: 'bowling', topic: 'sport', sentence: 'I knock down the pins in bowling.', sentenceVi: 'Tôi đánh đổ những cây gậy khi chơi bowling.' },
  { id: 'golf', word: 'golf', emoji: '⛳', vi: 'golf', topic: 'sport', sentence: 'He hits the ball far in golf.', sentenceVi: 'Anh ấy đánh bóng xa khi chơi golf.' },
  { id: 'swimming', word: 'swimming', emoji: '🏊', vi: 'bơi lội', topic: 'sport', sentence: 'I go swimming in summer.', sentenceVi: 'Tôi đi bơi vào mùa hè.' },
  { id: 'running', word: 'running', emoji: '🏃', vi: 'chạy bộ', topic: 'sport', sentence: 'I go running every morning.', sentenceVi: 'Tôi chạy bộ mỗi sáng.' },
  { id: 'cycling', word: 'cycling', emoji: '🚴', vi: 'đạp xe', topic: 'sport', sentence: 'I go cycling in the park.', sentenceVi: 'Tôi đạp xe trong công viên.' },
  { id: 'skateboarding', word: 'skateboarding', emoji: '🛹', vi: 'trượt ván', topic: 'sport', sentence: 'He is good at skateboarding.', sentenceVi: 'Cậu ấy trượt ván rất giỏi.' },
  { id: 'surfing', word: 'surfing', emoji: '🏄', vi: 'lướt sóng', topic: 'sport', sentence: 'She goes surfing at the beach.', sentenceVi: 'Cô ấy lướt sóng ở bãi biển.' },
  { id: 'skiing', word: 'skiing', emoji: '⛷️', vi: 'trượt tuyết', topic: 'sport', sentence: 'We go skiing in winter.', sentenceVi: 'Chúng tôi trượt tuyết vào mùa đông.' },
  { id: 'boxing', word: 'boxing', emoji: '🥊', vi: 'quyền anh', topic: 'sport', sentence: 'He trains in boxing.', sentenceVi: 'Anh ấy tập quyền anh.' },
  { id: 'gymnastics', word: 'gymnastics', emoji: '🤸', vi: 'thể dục dụng cụ', topic: 'sport', sentence: 'She is great at gymnastics.', sentenceVi: 'Cô ấy rất giỏi thể dục dụng cụ.' },
  { id: 'medal', word: 'gold medal', emoji: '🥇', vi: 'huy chương vàng', topic: 'sport', sentence: 'I win a gold medal.', sentenceVi: 'Tôi giành huy chương vàng.' },

  // ===== Thi đấu & Hoạt động (15) =====
  { id: 'trophy', word: 'trophy', emoji: '🏆', vi: 'cúp vô địch', topic: 'compete', sentence: 'Our team wins the trophy.', sentenceVi: 'Đội của chúng tôi giành cúp vô địch.' },
  { id: 'silvermedal', word: 'silver medal', emoji: '🥈', vi: 'huy chương bạc', topic: 'compete', sentence: 'She gets the silver medal.', sentenceVi: 'Cô ấy nhận huy chương bạc.' },
  { id: 'bronzemedal', word: 'bronze medal', emoji: '🥉', vi: 'huy chương đồng', topic: 'compete', sentence: 'He gets the bronze medal.', sentenceVi: 'Cậu ấy nhận huy chương đồng.' },
  { id: 'ribbon', word: 'ribbon', emoji: '🎗️', vi: 'dải ruy băng', topic: 'compete', sentence: 'I wear a ribbon at the contest.', sentenceVi: 'Tôi đeo dải ruy băng ở cuộc thi.' },
  { id: 'target', word: 'target', emoji: '🎯', vi: 'mục tiêu', topic: 'compete', sentence: 'I hit the target.', sentenceVi: 'Tôi bắn trúng mục tiêu.' },
  { id: 'stopwatch', word: 'stopwatch', emoji: '⏱️', vi: 'đồng hồ bấm giờ', topic: 'compete', sentence: 'The coach uses a stopwatch.', sentenceVi: 'Huấn luyện viên dùng đồng hồ bấm giờ.' },
  { id: 'scoreboard', word: 'scoreboard', emoji: '📋', img: 'images/scoreboard.jpg', vi: 'bảng điểm', topic: 'compete', sentence: 'Look at the scoreboard.', sentenceVi: 'Hãy nhìn vào bảng điểm.' },
  { id: 'megaphone', word: 'megaphone', emoji: '📣', vi: 'loa cầm tay', topic: 'compete', sentence: 'The coach shouts with a megaphone.', sentenceVi: 'Huấn luyện viên hô qua loa cầm tay.' },
  { id: 'checkeredflag', word: 'checkered flag', emoji: '🏁', vi: 'cờ đích', topic: 'compete', sentence: 'The race ends at the checkered flag.', sentenceVi: 'Cuộc đua kết thúc ở vạch cờ đích.' },
  { id: 'draw', word: 'draw', emoji: '🎨', vi: 'vẽ tranh', topic: 'compete', sentence: 'I like to draw pictures.', sentenceVi: 'Tôi thích vẽ tranh.' },
  { id: 'sing', word: 'sing', emoji: '🎤', vi: 'hát', topic: 'compete', sentence: 'I like to sing songs.', sentenceVi: 'Tôi thích hát.' },
  { id: 'dance', word: 'dance', emoji: '💃', vi: 'nhảy múa', topic: 'compete', sentence: 'I like to dance.', sentenceVi: 'Tôi thích nhảy múa.' },
  { id: 'read', word: 'read', emoji: '📚', vi: 'đọc sách', topic: 'compete', sentence: 'I like to read books.', sentenceVi: 'Tôi thích đọc sách.' },
  { id: 'write', word: 'write', emoji: '✍️', vi: 'viết', topic: 'compete', sentence: 'I like to write stories.', sentenceVi: 'Tôi thích viết truyện.' },
  { id: 'play', word: 'play', emoji: '🎮', vi: 'chơi trò chơi', topic: 'compete', sentence: 'I like to play games.', sentenceVi: 'Tôi thích chơi trò chơi.' },
  { id: 'champion', word: 'champion', emoji: '👑', vi: 'nhà vô địch', topic: 'compete', sentence: 'He is the champion.', sentenceVi: 'Cậu ấy là nhà vô địch.' },
  { id: 'goal', word: 'goal', emoji: '🥅', vi: 'bàn thắng', topic: 'compete', sentence: 'He scores a goal.', sentenceVi: 'Cậu ấy ghi một bàn thắng.' },
  { id: 'team', word: 'team', emoji: '👥', vi: 'đội', topic: 'compete', sentence: 'We are one team.', sentenceVi: 'Chúng ta là một đội.' },
  { id: 'race', word: 'race', emoji: '🏎️', vi: 'cuộc đua', topic: 'compete', sentence: 'The race is exciting.', sentenceVi: 'Cuộc đua thật hào hứng.' },
  { id: 'highfive', word: 'high five', emoji: '✋', vi: 'đập tay', topic: 'compete', sentence: 'Give me a high five!', sentenceVi: 'Đập tay với tớ nào!' },
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
