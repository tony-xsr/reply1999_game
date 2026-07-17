// Nghe & Đoán: Muôn Loài & Vũ Trụ — giai đoạn 3 của dự án "5x1000 từ vựng":
// động vật hoang dã, sinh vật biển & côn trùng, hàng không & vũ trụ, toán học
// & hình khối, loài chim (~103 mục). Lặp lại đúng khuôn mẫu đã kiểm chứng ở
// giai đoạn 1–2 (nghe-doan-tieng-anh, nghe-doan-giao-thong): mỗi mục có TỪ
// ĐƠN + CÂU NGẮN đi kèm, mỗi VÒNG chỉ chọn ngẫu nhiên 1 trong 2 kiểu — TRỘN
// LẪN, ưu tiên từ đơn nhiều hơn để bé không bị ngợp vì câu dài xuất hiện quá
// dày. Câu dài đọc chậm hơn hẳn so với từ đơn. File thuần logic, không đụng
// DOM, test độc lập.

export const TOPICS = [
  { id: 'wildlife', label: 'Động vật hoang dã', icon: '🦁' },
  { id: 'marine', label: 'Sinh vật biển & Côn trùng', icon: '🐠' },
  { id: 'sky', label: 'Hàng không & Vũ trụ', icon: '🚀' },
  { id: 'math', label: 'Toán học & Hình khối', icon: '🔢' },
  { id: 'bird', label: 'Loài chim', icon: '🦅' },
];

export const WORD_BANK = [
  // ===== Động vật hoang dã (20) =====
  { id: 'lion', word: 'lion', emoji: '🦁', vi: 'sư tử', topic: 'wildlife', sentence: 'The lion is the king of the jungle.', sentenceVi: 'Sư tử là chúa tể rừng xanh.' },
  { id: 'tiger', word: 'tiger', emoji: '🐯', vi: 'con hổ', topic: 'wildlife', sentence: 'The tiger has stripes.', sentenceVi: 'Con hổ có sọc vằn.' },
  { id: 'elephant', word: 'elephant', emoji: '🐘', vi: 'con voi', topic: 'wildlife', sentence: 'The elephant is very big.', sentenceVi: 'Con voi rất to lớn.' },
  { id: 'giraffe', word: 'giraffe', emoji: '🦒', vi: 'hươu cao cổ', topic: 'wildlife', sentence: 'The giraffe has a long neck.', sentenceVi: 'Hươu cao cổ có cổ rất dài.' },
  { id: 'zebra', word: 'zebra', emoji: '🦓', vi: 'ngựa vằn', topic: 'wildlife', sentence: 'The zebra has black and white stripes.', sentenceVi: 'Ngựa vằn có sọc đen trắng.' },
  { id: 'monkey', word: 'monkey', emoji: '🐒', vi: 'con khỉ', topic: 'wildlife', sentence: 'The monkey climbs the tree.', sentenceVi: 'Con khỉ trèo cây.' },
  { id: 'panda', word: 'panda', emoji: '🐼', vi: 'gấu trúc', topic: 'wildlife', sentence: 'The panda eats bamboo.', sentenceVi: 'Gấu trúc ăn tre.' },
  { id: 'bear', word: 'bear', emoji: '🐻', vi: 'con gấu', topic: 'wildlife', sentence: 'The bear is strong.', sentenceVi: 'Con gấu rất khỏe.' },
  { id: 'wolf', word: 'wolf', emoji: '🐺', vi: 'con sói', topic: 'wildlife', sentence: 'The wolf howls at night.', sentenceVi: 'Con sói tru vào ban đêm.' },
  { id: 'fox', word: 'fox', emoji: '🦊', vi: 'con cáo', topic: 'wildlife', sentence: 'The fox is clever.', sentenceVi: 'Con cáo rất tinh ranh.' },
  { id: 'deer', word: 'deer', emoji: '🦌', vi: 'con hươu', topic: 'wildlife', sentence: 'The deer runs fast.', sentenceVi: 'Con hươu chạy rất nhanh.' },
  { id: 'kangaroo', word: 'kangaroo', emoji: '🦘', vi: 'chuột túi', topic: 'wildlife', sentence: 'The kangaroo jumps high.', sentenceVi: 'Chuột túi nhảy rất cao.' },
  { id: 'koala', word: 'koala', emoji: '🐨', vi: 'gấu túi koala', topic: 'wildlife', sentence: 'The koala sleeps in the tree.', sentenceVi: 'Gấu koala ngủ trên cây.' },
  { id: 'hippo', word: 'hippo', emoji: '🦛', vi: 'hà mã', topic: 'wildlife', sentence: 'The hippo lives in the river.', sentenceVi: 'Hà mã sống ở sông.' },
  { id: 'rhino', word: 'rhino', emoji: '🦏', vi: 'tê giác', topic: 'wildlife', sentence: 'The rhino has a big horn.', sentenceVi: 'Tê giác có sừng to.' },
  { id: 'crocodile', word: 'crocodile', emoji: '🐊', vi: 'cá sấu', topic: 'wildlife', sentence: 'The crocodile swims in the river.', sentenceVi: 'Cá sấu bơi ở sông.' },
  { id: 'snake', word: 'snake', emoji: '🐍', vi: 'con rắn', topic: 'wildlife', sentence: 'The snake has no legs.', sentenceVi: 'Con rắn không có chân.' },
  { id: 'gorilla', word: 'gorilla', emoji: '🦍', vi: 'khỉ đột', topic: 'wildlife', sentence: 'The gorilla is very strong.', sentenceVi: 'Khỉ đột rất khỏe.' },
  { id: 'penguin', word: 'penguin', emoji: '🐧', vi: 'chim cánh cụt', topic: 'wildlife', sentence: 'The penguin lives in the cold.', sentenceVi: 'Chim cánh cụt sống ở nơi lạnh.' },
  { id: 'camel', word: 'camel', emoji: '🐫', vi: 'lạc đà', topic: 'wildlife', sentence: 'The camel walks in the desert.', sentenceVi: 'Lạc đà đi trong sa mạc.' },
  { id: 'hedgehog', word: 'hedgehog', emoji: '🦔', vi: 'con nhím', topic: 'wildlife', sentence: 'The hedgehog has spines.', sentenceVi: 'Con nhím có gai nhọn.' },
  { id: 'sloth', word: 'sloth', emoji: '🦥', vi: 'con lười', topic: 'wildlife', sentence: 'The sloth moves slowly.', sentenceVi: 'Con lười di chuyển rất chậm.' },
  { id: 'otter', word: 'otter', emoji: '🦦', vi: 'con rái cá', topic: 'wildlife', sentence: 'The otter swims fast.', sentenceVi: 'Con rái cá bơi rất nhanh.' },
  { id: 'skunk', word: 'skunk', emoji: '🦨', vi: 'con chồn hôi', topic: 'wildlife', sentence: 'The skunk smells bad.', sentenceVi: 'Con chồn hôi có mùi rất khó chịu.' },
  { id: 'beaver', word: 'beaver', emoji: '🦫', vi: 'con hải ly', topic: 'wildlife', sentence: 'The beaver builds a dam.', sentenceVi: 'Con hải ly xây đập nước.' },

  // ===== Sinh vật biển & Côn trùng (20) =====
  { id: 'whale', word: 'whale', emoji: '🐋', vi: 'cá voi', topic: 'marine', sentence: 'The whale is the biggest animal.', sentenceVi: 'Cá voi là loài vật to nhất.' },
  { id: 'dolphin', word: 'dolphin', emoji: '🐬', vi: 'cá heo', topic: 'marine', sentence: 'The dolphin is very smart.', sentenceVi: 'Cá heo rất thông minh.' },
  { id: 'shark', word: 'shark', emoji: '🦈', vi: 'cá mập', topic: 'marine', sentence: 'The shark has sharp teeth.', sentenceVi: 'Cá mập có răng rất sắc.' },
  { id: 'octopus', word: 'octopus', emoji: '🐙', vi: 'bạch tuộc', topic: 'marine', sentence: 'The octopus has eight arms.', sentenceVi: 'Bạch tuộc có tám cánh tay.' },
  { id: 'squid', word: 'squid', emoji: '🦑', vi: 'mực ống', topic: 'marine', sentence: 'The squid swims in the ocean.', sentenceVi: 'Mực ống bơi trong đại dương.' },
  { id: 'crab', word: 'crab', emoji: '🦀', vi: 'con cua', topic: 'marine', sentence: 'The crab walks sideways.', sentenceVi: 'Con cua đi ngang.' },
  { id: 'lobster', word: 'lobster', emoji: '🦞', vi: 'tôm hùm', topic: 'marine', sentence: 'The lobster lives in the sea.', sentenceVi: 'Tôm hùm sống ở biển.' },
  { id: 'shrimp', word: 'shrimp', emoji: '🦐', vi: 'con tôm', topic: 'marine', sentence: 'The shrimp is small.', sentenceVi: 'Con tôm rất nhỏ.' },
  { id: 'turtle', word: 'turtle', emoji: '🐢', vi: 'con rùa', topic: 'marine', sentence: 'The turtle is slow.', sentenceVi: 'Con rùa đi rất chậm.' },
  { id: 'pufferfish', word: 'pufferfish', emoji: '🐡', vi: 'cá nóc', topic: 'marine', sentence: 'The pufferfish blows up big.', sentenceVi: 'Cá nóc phồng to lên.' },
  { id: 'seal', word: 'seal', emoji: '🦭', vi: 'hải cẩu', topic: 'marine', sentence: 'The seal claps its flippers.', sentenceVi: 'Hải cẩu vỗ vây.' },
  { id: 'jellyfish', word: 'jellyfish', emoji: '🪼', vi: 'sứa biển', topic: 'marine', sentence: 'The jellyfish floats in the water.', sentenceVi: 'Sứa biển trôi nổi trong nước.' },
  { id: 'snail', word: 'snail', emoji: '🐌', vi: 'con ốc sên', topic: 'marine', sentence: 'The snail moves very slowly.', sentenceVi: 'Con ốc sên di chuyển rất chậm.' },
  { id: 'spider', word: 'spider', emoji: '🕷️', vi: 'con nhện', topic: 'marine', sentence: 'The spider spins a web.', sentenceVi: 'Con nhện giăng tơ.' },
  { id: 'ant', word: 'ant', emoji: '🐜', vi: 'con kiến', topic: 'marine', sentence: 'The ant is very small.', sentenceVi: 'Con kiến rất nhỏ.' },
  { id: 'ladybug', word: 'ladybug', emoji: '🐞', vi: 'bọ rùa', topic: 'marine', sentence: 'The ladybug has red spots.', sentenceVi: 'Bọ rùa có đốm đỏ.' },
  { id: 'scorpion', word: 'scorpion', emoji: '🦂', vi: 'bọ cạp', topic: 'marine', sentence: 'The scorpion has a sting.', sentenceVi: 'Bọ cạp có nọc độc.' },
  { id: 'worm', word: 'worm', emoji: '🪱', vi: 'con giun', topic: 'marine', sentence: 'The worm lives in the soil.', sentenceVi: 'Con giun sống trong đất.' },
  { id: 'mosquito', word: 'mosquito', emoji: '🦟', vi: 'con muỗi', topic: 'marine', sentence: 'The mosquito bites at night.', sentenceVi: 'Con muỗi cắn vào ban đêm.' },
  { id: 'caterpillar', word: 'caterpillar', emoji: '🐛', vi: 'con sâu bướm', topic: 'marine', sentence: 'The caterpillar becomes a butterfly.', sentenceVi: 'Con sâu bướm biến thành bướm.' },

  // ===== Hàng không & Vũ trụ (20) =====
  { id: 'pilot', word: 'pilot', emoji: '🧑‍✈️', vi: 'phi công', topic: 'sky', sentence: 'The pilot flies the airplane.', sentenceVi: 'Phi công lái máy bay.' },
  { id: 'jet', word: 'jet', emoji: '🛩️', vi: 'máy bay phản lực', topic: 'sky', sentence: 'The jet flies very fast.', sentenceVi: 'Máy bay phản lực bay rất nhanh.' },
  { id: 'departure', word: 'departure', emoji: '🛫', vi: 'cất cánh', topic: 'sky', sentence: 'The airplane takes off now.', sentenceVi: 'Máy bay cất cánh bây giờ.' },
  { id: 'arrival', word: 'arrival', emoji: '🛬', vi: 'hạ cánh', topic: 'sky', sentence: 'The airplane lands safely.', sentenceVi: 'Máy bay hạ cánh an toàn.' },
  { id: 'parachute', word: 'parachute', emoji: '🪂', vi: 'cái dù', topic: 'sky', sentence: 'He jumps with a parachute.', sentenceVi: 'Anh ấy nhảy dù.' },
  { id: 'radar', word: 'radar', emoji: '📡', vi: 'ra-đa', topic: 'sky', sentence: 'Radar finds the airplane.', sentenceVi: 'Ra-đa tìm ra máy bay.' },
  { id: 'passport', word: 'passport', emoji: '🛂', vi: 'hộ chiếu', topic: 'sky', sentence: 'Show your passport, please.', sentenceVi: 'Hãy xuất trình hộ chiếu.' },
  { id: 'rocket', word: 'rocket', emoji: '🚀', vi: 'tên lửa', topic: 'sky', sentence: 'The rocket flies to the moon.', sentenceVi: 'Tên lửa bay lên mặt trăng.' },
  { id: 'astronaut', word: 'astronaut', emoji: '🧑‍🚀', vi: 'phi hành gia', topic: 'sky', sentence: 'The astronaut walks in space.', sentenceVi: 'Phi hành gia đi bộ trong vũ trụ.' },
  { id: 'alien', word: 'alien', emoji: '👽', vi: 'người ngoài hành tinh', topic: 'sky', sentence: 'The alien comes from space.', sentenceVi: 'Người ngoài hành tinh đến từ vũ trụ.' },
  { id: 'ufo', word: 'UFO', emoji: '🛸', vi: 'đĩa bay', topic: 'sky', sentence: 'The UFO flies in the sky.', sentenceVi: 'Đĩa bay bay trên trời.' },
  { id: 'satellite', word: 'satellite', emoji: '🛰️', vi: 'vệ tinh', topic: 'sky', sentence: 'The satellite orbits the Earth.', sentenceVi: 'Vệ tinh bay quanh Trái Đất.' },
  { id: 'planet', word: 'planet', emoji: '🪐', vi: 'hành tinh', topic: 'sky', sentence: 'Saturn is a planet with rings.', sentenceVi: 'Sao Thổ là hành tinh có vành đai.' },
  { id: 'moon', word: 'moon', emoji: '🌙', vi: 'mặt trăng', topic: 'sky', sentence: 'The moon shines at night.', sentenceVi: 'Mặt trăng chiếu sáng vào ban đêm.' },
  { id: 'star', word: 'star', emoji: '⭐', vi: 'ngôi sao', topic: 'sky', sentence: 'The star twinkles at night.', sentenceVi: 'Ngôi sao lấp lánh vào ban đêm.' },
  { id: 'shootingstar', word: 'shooting star', emoji: '🌠', vi: 'sao băng', topic: 'sky', sentence: 'Make a wish on a shooting star.', sentenceVi: 'Hãy ước khi thấy sao băng.' },
  { id: 'comet', word: 'comet', emoji: '☄️', vi: 'sao chổi', topic: 'sky', sentence: 'The comet has a long tail.', sentenceVi: 'Sao chổi có cái đuôi dài.' },
  { id: 'galaxy', word: 'galaxy', emoji: '🌌', vi: 'thiên hà', topic: 'sky', sentence: 'Our galaxy has many stars.', sentenceVi: 'Thiên hà của chúng ta có nhiều ngôi sao.' },
  { id: 'telescope', word: 'telescope', emoji: '🔭', vi: 'kính viễn vọng', topic: 'sky', sentence: 'Look at the stars with a telescope.', sentenceVi: 'Nhìn các ngôi sao qua kính viễn vọng.' },
  { id: 'blackhole', word: 'black hole', emoji: '🕳️', img: 'images/blackhole.jpg', vi: 'hố đen', topic: 'sky', sentence: 'A black hole pulls in light.', sentenceVi: 'Hố đen hút cả ánh sáng.' },

  // ===== Toán học & Hình khối (20) =====
  { id: 'number', word: 'number', emoji: '🔢', vi: 'con số', topic: 'math', sentence: 'I can count numbers.', sentenceVi: 'Tôi có thể đếm số.' },
  { id: 'zero', word: 'zero', emoji: '0️⃣', vi: 'số không', topic: 'math', sentence: 'Zero means nothing.', sentenceVi: 'Số không có nghĩa là không có gì.' },
  { id: 'ten', word: 'ten', emoji: '🔟', vi: 'số mười', topic: 'math', sentence: 'I have ten fingers.', sentenceVi: 'Tôi có mười ngón tay.' },
  { id: 'plus', word: 'plus', emoji: '➕', vi: 'dấu cộng', topic: 'math', sentence: 'Two plus two is four.', sentenceVi: 'Hai cộng hai bằng bốn.' },
  { id: 'minus', word: 'minus', emoji: '➖', vi: 'dấu trừ', topic: 'math', sentence: 'Five minus two is three.', sentenceVi: 'Năm trừ hai bằng ba.' },
  { id: 'multiply', word: 'multiply', emoji: '✖️', vi: 'dấu nhân', topic: 'math', sentence: 'Three times two is six.', sentenceVi: 'Ba nhân hai bằng sáu.' },
  { id: 'divide', word: 'divide', emoji: '➗', vi: 'dấu chia', topic: 'math', sentence: 'Six divided by two is three.', sentenceVi: 'Sáu chia hai bằng ba.' },
  { id: 'equal', word: 'equal', emoji: '🟰', vi: 'dấu bằng', topic: 'math', sentence: 'One plus one is equal to two.', sentenceVi: 'Một cộng một bằng hai.' },
  { id: 'circle', word: 'circle', emoji: '🔵', vi: 'hình tròn', topic: 'math', sentence: 'The ball is a circle.', sentenceVi: 'Quả bóng có hình tròn.' },
  { id: 'square', word: 'square', emoji: '🟦', vi: 'hình vuông', topic: 'math', sentence: 'The box is a square.', sentenceVi: 'Cái hộp có hình vuông.' },
  { id: 'triangle', word: 'triangle', emoji: '🔺', vi: 'hình tam giác', topic: 'math', sentence: 'The roof looks like a triangle.', sentenceVi: 'Mái nhà trông giống hình tam giác.' },
  { id: 'diamond', word: 'diamond shape', emoji: '🔷', vi: 'hình thoi', topic: 'math', sentence: 'The kite is shaped like a diamond.', sentenceVi: 'Cái diều có hình thoi.' },
  { id: 'heart', word: 'heart shape', emoji: '❤️', vi: 'hình trái tim', topic: 'math', sentence: 'I draw a heart shape.', sentenceVi: 'Tôi vẽ một hình trái tim.' },
  { id: 'clock', word: 'clock', emoji: '🕐', vi: 'đồng hồ', topic: 'math', sentence: 'The clock shows the time.', sentenceVi: 'Đồng hồ chỉ giờ.' },
  { id: 'ruler', word: 'ruler', emoji: '📏', vi: 'cây thước', topic: 'math', sentence: 'I measure with a ruler.', sentenceVi: 'Tôi đo bằng cây thước.' },
  { id: 'abacus', word: 'abacus', emoji: '🧮', vi: 'bàn tính', topic: 'math', sentence: 'I count with an abacus.', sentenceVi: 'Tôi tính bằng bàn tính.' },
  { id: 'scale', word: 'scale', emoji: '⚖️', vi: 'cái cân', topic: 'math', sentence: 'I weigh fruit on a scale.', sentenceVi: 'Tôi cân trái cây bằng cái cân.' },
  { id: 'coin', word: 'coin', emoji: '🪙', vi: 'đồng xu', topic: 'math', sentence: 'I have one coin.', sentenceVi: 'Tôi có một đồng xu.' },
  { id: 'calendar', word: 'calendar', emoji: '📅', vi: 'lịch', topic: 'math', sentence: 'I count days on the calendar.', sentenceVi: 'Tôi đếm ngày trên lịch.' },
  { id: 'graph', word: 'graph', emoji: '📊', vi: 'biểu đồ', topic: 'math', sentence: 'The graph shows the numbers.', sentenceVi: 'Biểu đồ cho thấy các con số.' },

  // ===== Loài chim (11) =====
  { id: 'eagle', word: 'eagle', emoji: '🦅', vi: 'chim đại bàng', topic: 'bird', sentence: 'The eagle flies very high.', sentenceVi: 'Chim đại bàng bay rất cao.' },
  { id: 'owl', word: 'owl', emoji: '🦉', vi: 'con cú', topic: 'bird', sentence: 'The owl is awake at night.', sentenceVi: 'Con cú thức vào ban đêm.' },
  { id: 'parrot', word: 'parrot', emoji: '🦜', vi: 'con vẹt', topic: 'bird', sentence: 'The parrot can talk.', sentenceVi: 'Con vẹt biết nói.' },
  { id: 'peacock', word: 'peacock', emoji: '🦚', vi: 'con công', topic: 'bird', sentence: 'The peacock has a beautiful tail.', sentenceVi: 'Con công có cái đuôi rất đẹp.' },
  { id: 'flamingo', word: 'flamingo', emoji: '🦩', vi: 'hồng hạc', topic: 'bird', sentence: 'The flamingo stands on one leg.', sentenceVi: 'Hồng hạc đứng bằng một chân.' },
  { id: 'dove', word: 'dove', emoji: '🕊️', vi: 'chim bồ câu', topic: 'bird', sentence: 'The dove is a symbol of peace.', sentenceVi: 'Chim bồ câu là biểu tượng hòa bình.' },
  { id: 'swan', word: 'swan', emoji: '🦢', vi: 'thiên nga', topic: 'bird', sentence: 'The swan swims on the lake.', sentenceVi: 'Thiên nga bơi trên hồ.' },
  { id: 'rooster', word: 'rooster', emoji: '🐓', vi: 'gà trống', topic: 'bird', sentence: 'The rooster crows in the morning.', sentenceVi: 'Gà trống gáy vào buổi sáng.' },
  { id: 'chick', word: 'chick', emoji: '🐤', vi: 'gà con', topic: 'bird', sentence: 'The chick is small and yellow.', sentenceVi: 'Gà con nhỏ và màu vàng.' },
  { id: 'turkey', word: 'turkey', emoji: '🦃', vi: 'gà tây', topic: 'bird', sentence: 'The turkey has feathers.', sentenceVi: 'Gà tây có lông vũ.' },
  { id: 'bird', word: 'bird', emoji: '🐦', vi: 'con chim', topic: 'bird', sentence: 'The bird sings a song.', sentenceVi: 'Con chim hót một bài hát.' },
  { id: 'goose', word: 'goose', emoji: '🪿', vi: 'con ngỗng', topic: 'bird', sentence: 'The goose is loud.', sentenceVi: 'Con ngỗng kêu rất to.' },
  { id: 'pelican', word: 'pelican', emoji: '🐦‍⬛', img: 'images/pelican.jpg', vi: 'chim bồ nông', topic: 'bird', sentence: 'The pelican has a big beak.', sentenceVi: 'Chim bồ nông có cái mỏ rất to.' },
  { id: 'woodpecker', word: 'woodpecker', emoji: '🪵', img: 'images/woodpecker.jpg', vi: 'chim gõ kiến', topic: 'bird', sentence: 'The woodpecker pecks the tree.', sentenceVi: 'Chim gõ kiến gõ vào thân cây.' },
  { id: 'hummingbird', word: 'hummingbird', emoji: '🌺', img: 'images/hummingbird.jpg', vi: 'chim ruồi', topic: 'bird', sentence: 'The hummingbird is tiny.', sentenceVi: 'Chim ruồi bé xíu.' },
  { id: 'kingfisher', word: 'kingfisher', emoji: '🐟', img: 'images/kingfisher.jpg', vi: 'chim bói cá', topic: 'bird', sentence: 'The kingfisher catches fish.', sentenceVi: 'Chim bói cá bắt cá.' },
  { id: 'seagull', word: 'seagull', emoji: '🌊', img: 'images/seagull.jpg', vi: 'chim mòng biển', topic: 'bird', sentence: 'The seagull flies over the sea.', sentenceVi: 'Chim mòng biển bay trên biển.' },
  { id: 'crow', word: 'crow', emoji: '⬛', img: 'images/crow.jpg', vi: 'con quạ', topic: 'bird', sentence: 'The crow is black.', sentenceVi: 'Con quạ màu đen.' },
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
