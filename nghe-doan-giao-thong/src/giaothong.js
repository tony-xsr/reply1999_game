// Nghe & Đoán: Giao Thông & Địa Lý — giai đoạn 2 của dự án "5x1000 từ vựng":
// phương tiện giao thông, tiện ích công cộng, môi trường, đô thị & thôn quê,
// địa lý & địa hình (~99 mục). Lặp lại đúng khuôn mẫu đã kiểm chứng ở giai
// đoạn 1 (nghe-doan-tieng-anh): mỗi mục có TỪ ĐƠN + CÂU NGẮN đi kèm, mỗi VÒNG
// chỉ chọn ngẫu nhiên 1 trong 2 kiểu (word/sentence) — TRỘN LẪN, ưu tiên từ
// đơn nhiều hơn để bé không bị ngợp vì câu dài xuất hiện quá dày. Câu dài đọc
// chậm hơn hẳn so với từ đơn. File thuần logic, không đụng DOM, test độc lập.

export const TOPICS = [
  { id: 'vehicle', label: 'Phương tiện', icon: '🚗' },
  { id: 'utility', label: 'Tiện ích công cộng', icon: '🚦' },
  { id: 'environment', label: 'Môi trường', icon: '🌳' },
  { id: 'urban', label: 'Đô thị & Thôn quê', icon: '🏙️' },
  { id: 'geo', label: 'Địa lý & Địa hình', icon: '🗺️' },
];

export const WORD_BANK = [
  // ===== Phương tiện (20) =====
  { id: 'car', word: 'car', emoji: '🚗', vi: 'xe hơi', topic: 'vehicle', sentence: 'I ride in a car.', sentenceVi: 'Tôi ngồi trên xe hơi.' },
  { id: 'bus', word: 'bus', emoji: '🚌', vi: 'xe buýt', topic: 'vehicle', sentence: 'I take the bus to school.', sentenceVi: 'Tôi đi xe buýt đến trường.' },
  { id: 'bike', word: 'bike', emoji: '🚲', vi: 'xe đạp', topic: 'vehicle', sentence: 'I ride my bike.', sentenceVi: 'Tôi đi xe đạp.' },
  { id: 'motorbike', word: 'motorbike', emoji: '🏍️', vi: 'xe máy', topic: 'vehicle', sentence: 'Dad rides a motorbike.', sentenceVi: 'Bố chạy xe máy.' },
  { id: 'train', word: 'train', emoji: '🚆', vi: 'tàu hỏa', topic: 'vehicle', sentence: 'The train is fast.', sentenceVi: 'Tàu hỏa chạy nhanh.' },
  { id: 'airplane', word: 'airplane', emoji: '✈️', vi: 'máy bay', topic: 'vehicle', sentence: 'I fly in an airplane.', sentenceVi: 'Tôi bay bằng máy bay.' },
  { id: 'helicopter', word: 'helicopter', emoji: '🚁', vi: 'trực thăng', topic: 'vehicle', sentence: 'The helicopter flies high.', sentenceVi: 'Trực thăng bay cao.' },
  { id: 'boat', word: 'boat', emoji: '⛵', vi: 'thuyền buồm', topic: 'vehicle', sentence: 'We sail on a boat.', sentenceVi: 'Chúng tôi đi thuyền buồm.' },
  { id: 'ship', word: 'ship', emoji: '🚢', vi: 'tàu thủy', topic: 'vehicle', sentence: 'The ship is big.', sentenceVi: 'Con tàu rất lớn.' },
  { id: 'taxi', word: 'taxi', emoji: '🚕', vi: 'xe taxi', topic: 'vehicle', sentence: 'Let’s take a taxi.', sentenceVi: 'Chúng ta đi taxi nhé.' },
  { id: 'truck', word: 'truck', emoji: '🚚', vi: 'xe tải', topic: 'vehicle', sentence: 'The truck carries boxes.', sentenceVi: 'Xe tải chở thùng hàng.' },
  { id: 'ambulance', word: 'ambulance', emoji: '🚑', vi: 'xe cứu thương', topic: 'vehicle', sentence: 'The ambulance is fast.', sentenceVi: 'Xe cứu thương chạy nhanh.' },
  { id: 'firetruck', word: 'fire truck', emoji: '🚒', vi: 'xe cứu hỏa', topic: 'vehicle', sentence: 'The fire truck is red.', sentenceVi: 'Xe cứu hỏa màu đỏ.' },
  { id: 'policecar', word: 'police car', emoji: '🚓', vi: 'xe cảnh sát', topic: 'vehicle', sentence: 'The police car has lights.', sentenceVi: 'Xe cảnh sát có đèn.' },
  { id: 'subway', word: 'subway', emoji: '🚇', vi: 'tàu điện ngầm', topic: 'vehicle', sentence: 'We ride the subway.', sentenceVi: 'Chúng tôi đi tàu điện ngầm.' },
  { id: 'cablecar', word: 'cable car', emoji: '🚡', vi: 'cáp treo', topic: 'vehicle', sentence: 'The cable car goes up the mountain.', sentenceVi: 'Cáp treo lên núi.' },
  { id: 'scooter', word: 'scooter', emoji: '🛵', vi: 'xe scooter', topic: 'vehicle', sentence: 'She rides a scooter.', sentenceVi: 'Cô ấy chạy xe scooter.' },
  { id: 'rocket', word: 'rocket', emoji: '🚀', vi: 'tên lửa', topic: 'vehicle', sentence: 'The rocket flies to space.', sentenceVi: 'Tên lửa bay vào vũ trụ.' },
  { id: 'road', word: 'road', emoji: '🛣️', vi: 'con đường', topic: 'vehicle', sentence: 'The road is long.', sentenceVi: 'Con đường rất dài.' },
  { id: 'bridge', word: 'bridge', emoji: '🌉', vi: 'cây cầu', topic: 'vehicle', sentence: 'We cross the bridge.', sentenceVi: 'Chúng tôi qua cây cầu.' },
  { id: 'cranetruck', word: 'crane truck', emoji: '🚧', img: 'images/xe-cau.jpg', vi: 'xe cẩu', topic: 'vehicle', sentence: 'The crane truck lifts heavy things.', sentenceVi: 'Xe cẩu nâng những vật rất nặng.' },

  // ===== Tiện ích công cộng (20) =====
  { id: 'trafficlight', word: 'traffic light', emoji: '🚦', vi: 'đèn giao thông', topic: 'utility', sentence: 'Stop at the traffic light.', sentenceVi: 'Dừng lại ở đèn giao thông.' },
  { id: 'gasstation', word: 'gas station', emoji: '⛽', vi: 'trạm xăng', topic: 'utility', sentence: 'The car needs gas.', sentenceVi: 'Xe cần đổ xăng.' },
  { id: 'helmet', word: 'helmet', emoji: '⛑️', img: 'images/helmet.jpg', vi: 'mũ bảo hiểm', topic: 'utility', sentence: 'Wear a helmet, please.', sentenceVi: 'Hãy đội mũ bảo hiểm.' },
  { id: 'hospital', word: 'hospital', emoji: '🏥', vi: 'bệnh viện', topic: 'utility', sentence: 'Go to the hospital when sick.', sentenceVi: 'Đi bệnh viện khi bị ốm.' },
  { id: 'school', word: 'school', emoji: '🏫', vi: 'trường học', topic: 'utility', sentence: 'I go to school.', sentenceVi: 'Tôi đi học.' },
  { id: 'postoffice', word: 'post office', emoji: '🏤', vi: 'bưu điện', topic: 'utility', sentence: 'Send a letter at the post office.', sentenceVi: 'Gửi thư ở bưu điện.' },
  { id: 'bank', word: 'bank', emoji: '🏦', vi: 'ngân hàng', topic: 'utility', sentence: 'Mom goes to the bank.', sentenceVi: 'Mẹ đi ngân hàng.' },
  { id: 'library', word: 'library', emoji: '📚', vi: 'thư viện', topic: 'utility', sentence: 'I read books at the library.', sentenceVi: 'Tôi đọc sách ở thư viện.' },
  { id: 'playground', word: 'playground', emoji: '🛝', vi: 'sân chơi', topic: 'utility', sentence: 'Kids play at the playground.', sentenceVi: 'Trẻ em chơi ở sân chơi.' },
  { id: 'crosswalk', word: 'crosswalk', emoji: '🚸', vi: 'vạch qua đường', topic: 'utility', sentence: 'Cross at the crosswalk.', sentenceVi: 'Qua đường ở vạch dành cho người đi bộ.' },
  { id: 'streetlight', word: 'streetlight', emoji: '💡', vi: 'đèn đường', topic: 'utility', sentence: 'The streetlight turns on at night.', sentenceVi: 'Đèn đường bật sáng vào ban đêm.' },
  { id: 'mailbox', word: 'mailbox', emoji: '📮', vi: 'hộp thư', topic: 'utility', sentence: 'Put the letter in the mailbox.', sentenceVi: 'Bỏ thư vào hộp thư.' },
  { id: 'fireextinguisher', word: 'fire extinguisher', emoji: '🧯', vi: 'bình cứu hỏa', topic: 'utility', sentence: 'The fire extinguisher puts out fire.', sentenceVi: 'Bình cứu hỏa dập lửa.' },
  { id: 'trashcan', word: 'trash can', emoji: '🗑️', vi: 'thùng rác', topic: 'utility', sentence: 'Put trash in the trash can.', sentenceVi: 'Bỏ rác vào thùng rác.' },
  { id: 'recycle', word: 'recycle', emoji: '♻️', vi: 'tái chế', topic: 'utility', sentence: 'We recycle bottles.', sentenceVi: 'Chúng tôi tái chế chai lọ.' },
  { id: 'watertap', word: 'water tap', emoji: '🚰', vi: 'vòi nước', topic: 'utility', sentence: 'Drink water from the tap.', sentenceVi: 'Uống nước từ vòi nước.' },
  { id: 'atm', word: 'ATM', emoji: '🏧', vi: 'máy rút tiền', topic: 'utility', sentence: 'Get money from the ATM.', sentenceVi: 'Rút tiền từ máy ATM.' },
  { id: 'busstop', word: 'bus stop', emoji: '🚏', vi: 'trạm xe buýt', topic: 'utility', sentence: 'Wait at the bus stop.', sentenceVi: 'Đợi ở trạm xe buýt.' },
  { id: 'elevator', word: 'elevator', emoji: '🛗', vi: 'thang máy', topic: 'utility', sentence: 'Take the elevator up.', sentenceVi: 'Đi thang máy lên.' },
  { id: 'door', word: 'door', emoji: '🚪', vi: 'cái cửa', topic: 'utility', sentence: 'Open the door, please.', sentenceVi: 'Hãy mở cửa.' },

  // ===== Môi trường (18) =====
  { id: 'tree', word: 'tree', emoji: '🌳', vi: 'cái cây', topic: 'environment', sentence: 'The tree is tall.', sentenceVi: 'Cái cây rất cao.' },
  { id: 'flower', word: 'flower', emoji: '🌸', vi: 'bông hoa', topic: 'environment', sentence: 'The flower is pretty.', sentenceVi: 'Bông hoa rất đẹp.' },
  { id: 'grass', word: 'grass', emoji: '🌱', vi: 'cỏ', topic: 'environment', sentence: 'The grass is green.', sentenceVi: 'Cỏ có màu xanh.' },
  { id: 'sun', word: 'sun', emoji: '☀️', vi: 'mặt trời', topic: 'environment', sentence: 'The sun is bright.', sentenceVi: 'Mặt trời rất sáng.' },
  { id: 'rain', word: 'rain', emoji: '🌧️', vi: 'mưa', topic: 'environment', sentence: 'It is raining today.', sentenceVi: 'Hôm nay trời mưa.' },
  { id: 'cloud', word: 'cloud', emoji: '☁️', vi: 'đám mây', topic: 'environment', sentence: 'The cloud is white.', sentenceVi: 'Đám mây màu trắng.' },
  { id: 'wind', word: 'wind', emoji: '💨', vi: 'gió', topic: 'environment', sentence: 'The wind is strong.', sentenceVi: 'Gió thổi mạnh.' },
  { id: 'snow', word: 'snow', emoji: '❄️', vi: 'tuyết', topic: 'environment', sentence: 'The snow is cold.', sentenceVi: 'Tuyết rất lạnh.' },
  { id: 'rainbow', word: 'rainbow', emoji: '🌈', vi: 'cầu vồng', topic: 'environment', sentence: 'Look at the rainbow!', sentenceVi: 'Nhìn cầu vồng kìa!' },
  { id: 'earth', word: 'Earth', emoji: '🌍', vi: 'Trái Đất', topic: 'environment', sentence: 'We live on Earth.', sentenceVi: 'Chúng ta sống trên Trái Đất.' },
  { id: 'factory', word: 'factory', emoji: '🏭', vi: 'nhà máy', topic: 'environment', sentence: 'The factory makes smoke.', sentenceVi: 'Nhà máy thải ra khói.' },
  { id: 'plant', word: 'plant', emoji: '🪴', vi: 'cây cảnh', topic: 'environment', sentence: 'I water the plant.', sentenceVi: 'Tôi tưới cây.' },
  { id: 'leaf', word: 'leaf', emoji: '🍃', vi: 'chiếc lá', topic: 'environment', sentence: 'The leaf falls down.', sentenceVi: 'Chiếc lá rơi xuống.' },
  { id: 'butterfly', word: 'butterfly', emoji: '🦋', vi: 'con bướm', topic: 'environment', sentence: 'The butterfly is colorful.', sentenceVi: 'Con bướm nhiều màu sắc.' },
  { id: 'bee', word: 'bee', emoji: '🐝', vi: 'con ong', topic: 'environment', sentence: 'The bee makes honey.', sentenceVi: 'Con ong làm mật ong.' },
  { id: 'moon', word: 'moon', emoji: '🌙', vi: 'mặt trăng', topic: 'environment', sentence: 'The moon is bright at night.', sentenceVi: 'Trăng sáng vào ban đêm.' },
  { id: 'star', word: 'star', emoji: '⭐', vi: 'ngôi sao', topic: 'environment', sentence: 'I see many stars.', sentenceVi: 'Tôi thấy nhiều ngôi sao.' },
  { id: 'rock', word: 'rock', emoji: '🪨', vi: 'tảng đá', topic: 'environment', sentence: 'The rock is very hard.', sentenceVi: 'Tảng đá rất cứng.' },
  { id: 'lotus', word: 'lotus', emoji: '🪷', vi: 'hoa sen', topic: 'environment', sentence: 'The lotus grows in the pond.', sentenceVi: 'Hoa sen mọc trong đầm.' },
  { id: 'bamboo', word: 'bamboo', emoji: '🎋', img: 'images/bamboo.jpg', vi: 'cây tre', topic: 'environment', sentence: 'Bamboo grows very fast.', sentenceVi: 'Cây tre lớn rất nhanh.' },

  // ===== Đô thị & Thôn quê (18) =====
  { id: 'city', word: 'city', emoji: '🏙️', vi: 'thành phố', topic: 'urban', sentence: 'I live in a big city.', sentenceVi: 'Tôi sống ở thành phố lớn.' },
  { id: 'village', word: 'village', emoji: '🏘️', vi: 'làng quê', topic: 'urban', sentence: 'My grandma lives in a village.', sentenceVi: 'Bà tôi sống ở làng quê.' },
  { id: 'farm', word: 'farm', emoji: '🏡', vi: 'nông trại', topic: 'urban', sentence: 'The farm is quiet.', sentenceVi: 'Nông trại rất yên tĩnh.' },
  { id: 'tractor', word: 'tractor', emoji: '🚜', vi: 'máy kéo', topic: 'urban', sentence: 'The tractor works in the field.', sentenceVi: 'Máy kéo làm việc trên đồng.' },
  { id: 'building', word: 'building', emoji: '🏢', vi: 'tòa nhà', topic: 'urban', sentence: 'The building is tall.', sentenceVi: 'Tòa nhà rất cao.' },
  { id: 'house', word: 'house', emoji: '🏠', vi: 'ngôi nhà', topic: 'urban', sentence: 'I live in a house.', sentenceVi: 'Tôi sống trong một ngôi nhà.' },
  { id: 'construction', word: 'construction', emoji: '🏗️', vi: 'công trường', topic: 'urban', sentence: 'Workers build with a crane.', sentenceVi: 'Công nhân xây bằng cần cẩu.' },
  { id: 'cow', word: 'cow', emoji: '🐄', vi: 'con bò', topic: 'urban', sentence: 'The cow lives on the farm.', sentenceVi: 'Con bò sống ở nông trại.' },
  { id: 'chicken', word: 'chicken', emoji: '🐔', vi: 'con gà', topic: 'urban', sentence: 'The chicken lives in the countryside.', sentenceVi: 'Con gà sống ở nông thôn.' },
  { id: 'ricefield', word: 'rice field', emoji: '🌾', vi: 'cánh đồng lúa', topic: 'urban', sentence: 'The rice field is green.', sentenceVi: 'Cánh đồng lúa xanh mướt.' },
  { id: 'countryside', word: 'countryside', emoji: '🌄', vi: 'miền quê', topic: 'urban', sentence: 'The countryside is peaceful.', sentenceVi: 'Miền quê rất yên bình.' },
  { id: 'mall', word: 'mall', emoji: '🏬', vi: 'trung tâm thương mại', topic: 'urban', sentence: 'We shop at the mall.', sentenceVi: 'Chúng tôi mua sắm ở trung tâm thương mại.' },
  { id: 'stadium', word: 'stadium', emoji: '🏟️', vi: 'sân vận động', topic: 'urban', sentence: 'The stadium is huge.', sentenceVi: 'Sân vận động rất to lớn.' },
  { id: 'duck', word: 'duck', emoji: '🦆', vi: 'con vịt', topic: 'urban', sentence: 'The duck swims in the pond.', sentenceVi: 'Con vịt bơi trong ao.' },
  { id: 'castle', word: 'castle', emoji: '🏰', vi: 'lâu đài', topic: 'urban', sentence: 'The castle is old.', sentenceVi: 'Lâu đài rất cổ.' },
  { id: 'hut', word: 'hut', emoji: '🛖', vi: 'túp lều', topic: 'urban', sentence: 'The hut is small.', sentenceVi: 'Túp lều rất nhỏ.' },
  { id: 'horse', word: 'horse', emoji: '🐎', vi: 'con ngựa', topic: 'urban', sentence: 'The horse lives on the farm.', sentenceVi: 'Con ngựa sống ở nông trại.' },
  { id: 'sheep', word: 'sheep', emoji: '🐑', vi: 'con cừu', topic: 'urban', sentence: 'The sheep eats grass.', sentenceVi: 'Con cừu ăn cỏ.' },
  { id: 'buffalo', word: 'buffalo', emoji: '🐃', img: 'images/con-trau.jpg', vi: 'con trâu', topic: 'urban', sentence: 'The buffalo works in the rice field.', sentenceVi: 'Con trâu làm việc ở cánh đồng lúa.' },

  // ===== Địa lý & Địa hình (17) =====
  { id: 'mountain', word: 'mountain', emoji: '⛰️', vi: 'ngọn núi', topic: 'geo', sentence: 'The mountain is high.', sentenceVi: 'Ngọn núi rất cao.' },
  { id: 'ocean', word: 'ocean', emoji: '🌊', vi: 'đại dương', topic: 'geo', sentence: 'The ocean is deep.', sentenceVi: 'Đại dương rất sâu.' },
  { id: 'desert', word: 'desert', emoji: '🏜️', vi: 'sa mạc', topic: 'geo', sentence: 'The desert is hot.', sentenceVi: 'Sa mạc rất nóng.' },
  { id: 'island', word: 'island', emoji: '🏝️', vi: 'hòn đảo', topic: 'geo', sentence: 'We visit an island.', sentenceVi: 'Chúng tôi đến thăm một hòn đảo.' },
  { id: 'volcano', word: 'volcano', emoji: '🌋', vi: 'núi lửa', topic: 'geo', sentence: 'The volcano is dangerous.', sentenceVi: 'Núi lửa rất nguy hiểm.' },
  { id: 'nationalpark', word: 'national park', emoji: '🏞️', vi: 'công viên quốc gia', topic: 'geo', sentence: 'We hike in the national park.', sentenceVi: 'Chúng tôi đi bộ đường dài trong công viên quốc gia.' },
  { id: 'beach', word: 'beach', emoji: '🏖️', vi: 'bãi biển', topic: 'geo', sentence: 'We play at the beach.', sentenceVi: 'Chúng tôi chơi ở bãi biển.' },
  { id: 'forest', word: 'forest', emoji: '🌲', vi: 'khu rừng', topic: 'geo', sentence: 'The forest has many trees.', sentenceVi: 'Khu rừng có nhiều cây.' },
  { id: 'cave', word: 'cave', emoji: '🕳️', img: 'images/cave.jpg', vi: 'hang động', topic: 'geo', sentence: 'Bats live in the cave.', sentenceVi: 'Dơi sống trong hang động.' },
  { id: 'map', word: 'map', emoji: '🗺️', vi: 'bản đồ', topic: 'geo', sentence: 'Look at the map.', sentenceVi: 'Hãy nhìn vào bản đồ.' },
  { id: 'compass', word: 'compass', emoji: '🧭', vi: 'la bàn', topic: 'geo', sentence: 'Use a compass to find north.', sentenceVi: 'Dùng la bàn để tìm hướng bắc.' },
  { id: 'jungle', word: 'jungle', emoji: '🌴', vi: 'rừng rậm', topic: 'geo', sentence: 'Monkeys live in the jungle.', sentenceVi: 'Khỉ sống trong rừng rậm.' },
  { id: 'iceberg', word: 'iceberg', emoji: '🧊', vi: 'tảng băng trôi', topic: 'geo', sentence: 'The iceberg is very cold.', sentenceVi: 'Tảng băng trôi rất lạnh.' },
  { id: 'anchor', word: 'anchor', emoji: '⚓', vi: 'cái neo', topic: 'geo', sentence: 'The ship has an anchor.', sentenceVi: 'Con tàu có một cái neo.' },
  { id: 'hotspring', word: 'hot spring', emoji: '♨️', vi: 'suối nước nóng', topic: 'geo', sentence: 'The hot spring is warm.', sentenceVi: 'Suối nước nóng rất ấm.' },
  { id: 'peak', word: 'peak', emoji: '🗻', vi: 'đỉnh núi', topic: 'geo', sentence: 'The peak is covered in snow.', sentenceVi: 'Đỉnh núi phủ đầy tuyết.' },
  { id: 'coralreef', word: 'coral reef', emoji: '🐠', img: 'images/coralreef.jpg', vi: 'rạn san hô', topic: 'geo', sentence: 'Colorful fish swim in the coral reef.', sentenceVi: 'Cá nhiều màu bơi ở rạn san hô.' },
  { id: 'waterfall', word: 'waterfall', emoji: '💦', img: 'images/waterfall.jpg', vi: 'thác nước', topic: 'geo', sentence: 'The waterfall is beautiful.', sentenceVi: 'Thác nước rất đẹp.' },
  { id: 'cliff', word: 'cliff', emoji: '🗿', img: 'images/cliff.jpg', vi: 'vách đá', topic: 'geo', sentence: 'The cliff is very high.', sentenceVi: 'Vách đá rất cao.' },
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
