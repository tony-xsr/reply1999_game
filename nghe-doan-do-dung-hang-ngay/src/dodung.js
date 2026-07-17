// Nghe & Đoán: Đồ Dùng & Cơ Thể — giai đoạn 5 (mảng cuối) của dự án "5x1000
// từ vựng": quần áo & giày dép, đồ dùng gia đình, thiết bị điện tử, bộ phận
// cơ thể, hoạt động hằng ngày (~101 mục). Lặp lại đúng khuôn mẫu đã kiểm chứng
// ở giai đoạn 1–4: mỗi mục có TỪ ĐƠN + CÂU NGẮN đi kèm, mỗi VÒNG chỉ chọn
// ngẫu nhiên 1 trong 2 kiểu — TRỘN LẪN, ưu tiên từ đơn nhiều hơn để bé không
// bị ngợp vì câu dài xuất hiện quá dày. Câu dài đọc chậm hơn hẳn so với từ
// đơn. File thuần logic, không đụng DOM, test độc lập.

export const TOPICS = [
  { id: 'clothes', label: 'Quần áo & Giày dép', icon: '👕' },
  { id: 'household', label: 'Đồ dùng gia đình', icon: '🛏️' },
  { id: 'tech', label: 'Thiết bị điện tử', icon: '💻' },
  { id: 'body', label: 'Bộ phận cơ thể', icon: '✋' },
  { id: 'activity', label: 'Hoạt động hằng ngày', icon: '😴' },
];

export const WORD_BANK = [
  // ===== Quần áo & Giày dép (20) =====
  { id: 'tshirt', word: 'T-shirt', emoji: '👕', vi: 'áo thun', topic: 'clothes', sentence: 'I wear a T-shirt.', sentenceVi: 'Tôi mặc áo thun.' },
  { id: 'pants', word: 'pants', emoji: '👖', vi: 'quần dài', topic: 'clothes', sentence: 'I wear pants.', sentenceVi: 'Tôi mặc quần dài.' },
  { id: 'dress', word: 'dress', emoji: '👗', vi: 'váy đầm', topic: 'clothes', sentence: 'She wears a pretty dress.', sentenceVi: 'Cô ấy mặc chiếc váy đẹp.' },
  { id: 'shorts', word: 'shorts', emoji: '🩳', vi: 'quần short', topic: 'clothes', sentence: 'I wear shorts in summer.', sentenceVi: 'Tôi mặc quần short vào mùa hè.' },
  { id: 'necktie', word: 'necktie', emoji: '👔', vi: 'cà vạt', topic: 'clothes', sentence: 'Dad wears a necktie to work.', sentenceVi: 'Bố đeo cà vạt đi làm.' },
  { id: 'coat', word: 'coat', emoji: '🧥', vi: 'áo khoác', topic: 'clothes', sentence: 'I wear a coat in winter.', sentenceVi: 'Tôi mặc áo khoác vào mùa đông.' },
  { id: 'blouse', word: 'blouse', emoji: '👚', vi: 'áo kiểu', topic: 'clothes', sentence: 'She wears a nice blouse.', sentenceVi: 'Cô ấy mặc áo kiểu đẹp.' },
  { id: 'purse', word: 'purse', emoji: '👛', vi: 'ví tiền', topic: 'clothes', sentence: 'Mom keeps money in her purse.', sentenceVi: 'Mẹ để tiền trong ví.' },
  { id: 'handbag', word: 'handbag', emoji: '👜', vi: 'túi xách', topic: 'clothes', sentence: 'She carries a handbag.', sentenceVi: 'Cô ấy xách túi xách.' },
  { id: 'shoe', word: 'shoe', emoji: '👞', vi: 'giày', topic: 'clothes', sentence: 'I wear a shoe on each foot.', sentenceVi: 'Tôi mang giày ở mỗi chân.' },
  { id: 'sneaker', word: 'sneaker', emoji: '👟', vi: 'giày thể thao', topic: 'clothes', sentence: 'I run in my sneakers.', sentenceVi: 'Tôi chạy bằng giày thể thao.' },
  { id: 'boot', word: 'boot', emoji: '👢', vi: 'ủng', topic: 'clothes', sentence: 'I wear boots in the rain.', sentenceVi: 'Tôi mang ủng khi trời mưa.' },
  { id: 'sandal', word: 'sandal', emoji: '👡', vi: 'dép quai', topic: 'clothes', sentence: 'I wear sandals at the beach.', sentenceVi: 'Tôi mang dép quai ở bãi biển.' },
  { id: 'flatshoe', word: 'flat shoe', emoji: '🥿', vi: 'giày bệt', topic: 'clothes', sentence: 'She wears flat shoes.', sentenceVi: 'Cô ấy mang giày bệt.' },
  { id: 'sock', word: 'sock', emoji: '🧦', vi: 'vớ', topic: 'clothes', sentence: 'I wear socks with my shoes.', sentenceVi: 'Tôi mang vớ cùng với giày.' },
  { id: 'glove', word: 'glove', emoji: '🧤', vi: 'găng tay', topic: 'clothes', sentence: 'I wear gloves when it’s cold.', sentenceVi: 'Tôi đeo găng tay khi trời lạnh.' },
  { id: 'scarf', word: 'scarf', emoji: '🧣', vi: 'khăn quàng cổ', topic: 'clothes', sentence: 'I wear a scarf in winter.', sentenceVi: 'Tôi quàng khăn vào mùa đông.' },
  { id: 'cap', word: 'cap', emoji: '🧢', vi: 'mũ lưỡi trai', topic: 'clothes', sentence: 'I wear a cap in the sun.', sentenceVi: 'Tôi đội mũ lưỡi trai dưới nắng.' },
  { id: 'hat', word: 'hat', emoji: '👒', vi: 'mũ', topic: 'clothes', sentence: 'She wears a nice hat.', sentenceVi: 'Cô ấy đội chiếc mũ đẹp.' },
  { id: 'crown', word: 'crown', emoji: '👑', vi: 'vương miện', topic: 'clothes', sentence: 'The princess wears a crown.', sentenceVi: 'Công chúa đội vương miện.' },

  // ===== Đồ dùng gia đình (20) =====
  { id: 'bed', word: 'bed', emoji: '🛏️', vi: 'cái giường', topic: 'household', sentence: 'I sleep in my bed.', sentenceVi: 'Tôi ngủ trên giường.' },
  { id: 'sofa', word: 'sofa', emoji: '🛋️', vi: 'ghế sô-pha', topic: 'household', sentence: 'We sit on the sofa.', sentenceVi: 'Chúng tôi ngồi trên ghế sô-pha.' },
  { id: 'window', word: 'window', emoji: '🪟', vi: 'cửa sổ', topic: 'household', sentence: 'Open the window, please.', sentenceVi: 'Hãy mở cửa sổ.' },
  { id: 'mirror', word: 'mirror', emoji: '🪞', vi: 'cái gương', topic: 'household', sentence: 'I look in the mirror.', sentenceVi: 'Tôi soi gương.' },
  { id: 'wallclock', word: 'clock', emoji: '🕰️', vi: 'đồng hồ treo tường', topic: 'household', sentence: 'The clock is on the wall.', sentenceVi: 'Đồng hồ treo trên tường.' },
  { id: 'broom', word: 'broom', emoji: '🧹', vi: 'cây chổi', topic: 'household', sentence: 'I sweep with a broom.', sentenceVi: 'Tôi quét nhà bằng chổi.' },
  { id: 'basket', word: 'basket', emoji: '🧺', vi: 'cái giỏ', topic: 'household', sentence: 'I put clothes in the basket.', sentenceVi: 'Tôi để quần áo vào giỏ.' },
  { id: 'soap', word: 'soap', emoji: '🧼', vi: 'xà phòng', topic: 'household', sentence: 'I wash my hands with soap.', sentenceVi: 'Tôi rửa tay bằng xà phòng.' },
  { id: 'razor', word: 'razor', emoji: '🪒', vi: 'dao cạo', topic: 'household', sentence: 'Dad shaves with a razor.', sentenceVi: 'Bố cạo râu bằng dao cạo.' },
  { id: 'shower', word: 'shower', emoji: '🚿', vi: 'vòi hoa sen', topic: 'household', sentence: 'I take a shower every day.', sentenceVi: 'Tôi tắm vòi hoa sen mỗi ngày.' },
  { id: 'bathtub', word: 'bathtub', emoji: '🛁', vi: 'bồn tắm', topic: 'household', sentence: 'I sit in the bathtub.', sentenceVi: 'Tôi ngồi trong bồn tắm.' },
  { id: 'key', word: 'key', emoji: '🔑', vi: 'chìa khóa', topic: 'household', sentence: 'I open the door with a key.', sentenceVi: 'Tôi mở cửa bằng chìa khóa.' },
  { id: 'lock', word: 'lock', emoji: '🔒', vi: 'ổ khóa', topic: 'household', sentence: 'Lock the door, please.', sentenceVi: 'Hãy khóa cửa lại.' },
  { id: 'lotion', word: 'lotion', emoji: '🧴', vi: 'kem dưỡng da', topic: 'household', sentence: 'I put lotion on my skin.', sentenceVi: 'Tôi thoa kem dưỡng da.' },
  { id: 'sponge', word: 'sponge', emoji: '🧽', vi: 'miếng bọt biển', topic: 'household', sentence: 'I clean dishes with a sponge.', sentenceVi: 'Tôi rửa chén bằng miếng bọt biển.' },
  { id: 'bucket', word: 'bucket', emoji: '🪣', vi: 'cái xô', topic: 'household', sentence: 'I fill the bucket with water.', sentenceVi: 'Tôi đổ đầy nước vào xô.' },
  { id: 'hammer', word: 'hammer', emoji: '🔨', vi: 'cái búa', topic: 'household', sentence: 'I hit the nail with a hammer.', sentenceVi: 'Tôi đóng đinh bằng búa.' },
  { id: 'wrench', word: 'wrench', emoji: '🔧', vi: 'cờ lê', topic: 'household', sentence: 'Dad fixes it with a wrench.', sentenceVi: 'Bố sửa nó bằng cờ lê.' },
  { id: 'screwdriver', word: 'screwdriver', emoji: '🪛', vi: 'tua vít', topic: 'household', sentence: 'I use a screwdriver to fix the toy.', sentenceVi: 'Tôi dùng tua vít để sửa đồ chơi.' },
  { id: 'magnet', word: 'magnet', emoji: '🧲', vi: 'nam châm', topic: 'household', sentence: 'The magnet picks up metal.', sentenceVi: 'Nam châm hút kim loại.' },

  // ===== Thiết bị điện tử (20) =====
  { id: 'desktopcomputer', word: 'desktop computer', emoji: '🖥️', vi: 'máy vi tính', topic: 'tech', sentence: 'I work on the desktop computer.', sentenceVi: 'Tôi làm việc trên máy vi tính.' },
  { id: 'laptop', word: 'laptop', emoji: '💻', vi: 'máy tính xách tay', topic: 'tech', sentence: 'I bring my laptop to school.', sentenceVi: 'Tôi mang máy tính xách tay đến trường.' },
  { id: 'keyboard', word: 'keyboard', emoji: '⌨️', vi: 'bàn phím', topic: 'tech', sentence: 'I type on the keyboard.', sentenceVi: 'Tôi gõ trên bàn phím.' },
  { id: 'mouse', word: 'computer mouse', emoji: '🖱️', vi: 'con chuột máy tính', topic: 'tech', sentence: 'I click with the mouse.', sentenceVi: 'Tôi nhấp chuột máy tính.' },
  { id: 'printer', word: 'printer', emoji: '🖨️', vi: 'máy in', topic: 'tech', sentence: 'I print paper with the printer.', sentenceVi: 'Tôi in giấy bằng máy in.' },
  { id: 'phone', word: 'phone', emoji: '📱', vi: 'điện thoại', topic: 'tech', sentence: 'I call mom on the phone.', sentenceVi: 'Tôi gọi mẹ bằng điện thoại.' },
  { id: 'telephone', word: 'telephone', emoji: '☎️', vi: 'điện thoại bàn', topic: 'tech', sentence: 'The telephone is ringing.', sentenceVi: 'Điện thoại bàn đang reo.' },
  { id: 'camera', word: 'camera', emoji: '📷', vi: 'máy ảnh', topic: 'tech', sentence: 'I take a picture with a camera.', sentenceVi: 'Tôi chụp ảnh bằng máy ảnh.' },
  { id: 'videocamera', word: 'video camera', emoji: '📹', vi: 'máy quay phim', topic: 'tech', sentence: 'We record with a video camera.', sentenceVi: 'Chúng tôi quay phim bằng máy quay.' },
  { id: 'tv', word: 'television', emoji: '📺', vi: 'ti vi', topic: 'tech', sentence: 'I watch cartoons on TV.', sentenceVi: 'Tôi xem phim hoạt hình trên ti vi.' },
  { id: 'radio', word: 'radio', emoji: '📻', vi: 'radio', topic: 'tech', sentence: 'I listen to music on the radio.', sentenceVi: 'Tôi nghe nhạc qua radio.' },
  { id: 'headphone', word: 'headphone', emoji: '🎧', vi: 'tai nghe', topic: 'tech', sentence: 'I listen with headphones.', sentenceVi: 'Tôi nghe bằng tai nghe.' },
  { id: 'plug', word: 'plug', emoji: '🔌', vi: 'phích cắm điện', topic: 'tech', sentence: 'Put the plug in the socket.', sentenceVi: 'Cắm phích điện vào ổ cắm.' },
  { id: 'battery', word: 'battery', emoji: '🔋', vi: 'cục pin', topic: 'tech', sentence: 'The toy needs a battery.', sentenceVi: 'Đồ chơi cần một cục pin.' },
  { id: 'cd', word: 'CD', emoji: '💿', vi: 'đĩa CD', topic: 'tech', sentence: 'I play music from a CD.', sentenceVi: 'Tôi phát nhạc từ đĩa CD.' },
  { id: 'dvd', word: 'DVD', emoji: '📀', vi: 'đĩa DVD', topic: 'tech', sentence: 'We watch a movie on DVD.', sentenceVi: 'Chúng tôi xem phim qua đĩa DVD.' },
  { id: 'joystick', word: 'joystick', emoji: '🕹️', vi: 'cần điều khiển', topic: 'tech', sentence: 'I play games with a joystick.', sentenceVi: 'Tôi chơi game bằng cần điều khiển.' },
  { id: 'fax', word: 'fax machine', emoji: '📠', vi: 'máy fax', topic: 'tech', sentence: 'The office has a fax machine.', sentenceVi: 'Văn phòng có máy fax.' },
  { id: 'flashlight', word: 'flashlight', emoji: '🔦', vi: 'đèn pin', topic: 'tech', sentence: 'I use a flashlight at night.', sentenceVi: 'Tôi dùng đèn pin vào ban đêm.' },
  { id: 'lightbulb', word: 'light bulb', emoji: '💡', vi: 'bóng đèn', topic: 'tech', sentence: 'The light bulb shines bright.', sentenceVi: 'Bóng đèn chiếu sáng.' },

  // ===== Bộ phận cơ thể (23) =====
  { id: 'eye', word: 'eye', emoji: '👁️', vi: 'con mắt', topic: 'body', sentence: 'I see with my eyes.', sentenceVi: 'Tôi nhìn bằng mắt.' },
  { id: 'ear', word: 'ear', emoji: '👂', vi: 'cái tai', topic: 'body', sentence: 'I hear with my ears.', sentenceVi: 'Tôi nghe bằng tai.' },
  { id: 'nose', word: 'nose', emoji: '👃', vi: 'cái mũi', topic: 'body', sentence: 'I smell with my nose.', sentenceVi: 'Tôi ngửi bằng mũi.' },
  { id: 'mouth', word: 'mouth', emoji: '👄', vi: 'cái miệng', topic: 'body', sentence: 'I eat with my mouth.', sentenceVi: 'Tôi ăn bằng miệng.' },
  { id: 'tongue', word: 'tongue', emoji: '👅', vi: 'cái lưỡi', topic: 'body', sentence: 'I taste with my tongue.', sentenceVi: 'Tôi nếm bằng lưỡi.' },
  { id: 'tooth', word: 'tooth', emoji: '🦷', vi: 'cái răng', topic: 'body', sentence: 'I brush my tooth.', sentenceVi: 'Tôi chải răng.' },
  { id: 'brain', word: 'brain', emoji: '🧠', vi: 'bộ não', topic: 'body', sentence: 'I think with my brain.', sentenceVi: 'Tôi suy nghĩ bằng não.' },
  { id: 'hand', word: 'hand', emoji: '✋', vi: 'bàn tay', topic: 'body', sentence: 'I wave my hand.', sentenceVi: 'Tôi vẫy tay.' },
  { id: 'arm', word: 'arm', emoji: '💪', vi: 'cánh tay', topic: 'body', sentence: 'I lift with my arm.', sentenceVi: 'Tôi nhấc bằng cánh tay.' },
  { id: 'leg', word: 'leg', emoji: '🦵', vi: 'cái chân', topic: 'body', sentence: 'I walk with my legs.', sentenceVi: 'Tôi đi bằng chân.' },
  { id: 'foot', word: 'foot', emoji: '🦶', vi: 'bàn chân', topic: 'body', sentence: 'I stand on my foot.', sentenceVi: 'Tôi đứng bằng bàn chân.' },
  { id: 'finger', word: 'finger', emoji: '☝️', vi: 'ngón tay', topic: 'body', sentence: 'I point with my finger.', sentenceVi: 'Tôi chỉ bằng ngón tay.' },
  { id: 'bone', word: 'bone', emoji: '🦴', vi: 'xương', topic: 'body', sentence: 'The bone is inside my body.', sentenceVi: 'Xương nằm bên trong cơ thể tôi.' },
  { id: 'heart', word: 'heart', emoji: '❤️', vi: 'trái tim', topic: 'body', sentence: 'My heart beats fast.', sentenceVi: 'Trái tim tôi đập nhanh.' },
  { id: 'lungs', word: 'lungs', emoji: '🫁', vi: 'phổi', topic: 'body', sentence: 'I breathe with my lungs.', sentenceVi: 'Tôi thở bằng phổi.' },
  { id: 'skull', word: 'skull', emoji: '💀', vi: 'hộp sọ', topic: 'body', sentence: 'The skull protects the brain.', sentenceVi: 'Hộp sọ bảo vệ bộ não.' },
  // 7 mục dưới dùng SVG HÌNH NGƯỜI tự vẽ (cùng 1 bé trai trong cả 7 hình,
  // chỉ khác vòng tô sáng cam chỉ vào bộ phận cần đoán) — các khớp/bộ phận
  // này không có emoji riêng, và ảnh chụp người thật thì luôn lẫn nhiều bộ
  // phận trong 1 khung hình nên bé không thể đoán đơn nghĩa.
  { id: 'knee', word: 'knee', emoji: '🟧', img: 'images/body-knee.svg', vi: 'đầu gối', topic: 'body', sentence: 'I bend my knees to jump.', sentenceVi: 'Tôi khuỵu gối để bật nhảy.' },
  { id: 'elbow', word: 'elbow', emoji: '🟦', img: 'images/body-elbow.svg', vi: 'khuỷu tay', topic: 'body', sentence: 'I bend my elbow.', sentenceVi: 'Tôi gập khuỷu tay.' },
  { id: 'shoulder', word: 'shoulder', emoji: '🟥', img: 'images/body-shoulder.svg', vi: 'bờ vai', topic: 'body', sentence: 'I carry a bag on my shoulder.', sentenceVi: 'Tôi đeo túi trên vai.' },
  { id: 'ankle', word: 'ankle', emoji: '🟫', img: 'images/body-ankle.svg', vi: 'mắt cá chân', topic: 'body', sentence: 'The sock covers my ankle.', sentenceVi: 'Chiếc tất che mắt cá chân.' },
  { id: 'wrist', word: 'wrist', emoji: '🟨', img: 'images/body-wrist.svg', vi: 'cổ tay', topic: 'body', sentence: 'I wear a watch on my wrist.', sentenceVi: 'Tôi đeo đồng hồ ở cổ tay.' },
  { id: 'neck', word: 'neck', emoji: '🟩', img: 'images/body-neck.svg', vi: 'cái cổ', topic: 'body', sentence: 'The scarf keeps my neck warm.', sentenceVi: 'Chiếc khăn giữ ấm cổ tôi.' },
  { id: 'cheek', word: 'cheek', emoji: '🟪', img: 'images/body-cheek.svg', vi: 'gò má', topic: 'body', sentence: 'The baby has soft cheeks.', sentenceVi: 'Em bé có gò má mềm mại.' },

  // ===== Hoạt động hằng ngày (18) =====
  { id: 'sleep', word: 'sleep', emoji: '😴', vi: 'ngủ', topic: 'activity', sentence: 'I sleep at night.', sentenceVi: 'Tôi ngủ vào ban đêm.' },
  { id: 'wakeup', word: 'wake up', emoji: '⏰', vi: 'thức dậy', topic: 'activity', sentence: 'I wake up early.', sentenceVi: 'Tôi thức dậy sớm.' },
  { id: 'eat', word: 'eat', emoji: '🍴', vi: 'ăn', topic: 'activity', sentence: 'I eat breakfast.', sentenceVi: 'Tôi ăn sáng.' },
  { id: 'drink', word: 'drink', emoji: '🥤', vi: 'uống', topic: 'activity', sentence: 'I drink water.', sentenceVi: 'Tôi uống nước.' },
  { id: 'brushteeth', word: 'brush teeth', emoji: '🪥', vi: 'đánh răng', topic: 'activity', sentence: 'I brush my teeth every morning.', sentenceVi: 'Tôi đánh răng mỗi sáng.' },
  { id: 'bath', word: 'take a bath', emoji: '🛀', vi: 'tắm', topic: 'activity', sentence: 'I take a bath every day.', sentenceVi: 'Tôi tắm mỗi ngày.' },
  { id: 'combhair', word: 'comb hair', emoji: '🪮', vi: 'chải tóc', topic: 'activity', sentence: 'I comb my hair.', sentenceVi: 'Tôi chải tóc.' },
  { id: 'study', word: 'study', emoji: '📚', vi: 'học bài', topic: 'activity', sentence: 'I study every evening.', sentenceVi: 'Tôi học bài mỗi tối.' },
  { id: 'clean', word: 'clean', emoji: '🫧', vi: 'dọn dẹp', topic: 'activity', sentence: 'I clean my room.', sentenceVi: 'Tôi dọn dẹp phòng của mình.' },
  { id: 'cook', word: 'cook', emoji: '🍳', vi: 'nấu ăn', topic: 'activity', sentence: 'Mom cooks dinner.', sentenceVi: 'Mẹ nấu bữa tối.' },
  { id: 'walk', word: 'walk', emoji: '🚶', vi: 'đi bộ', topic: 'activity', sentence: 'I walk to school.', sentenceVi: 'Tôi đi bộ đến trường.' },
  { id: 'laugh', word: 'laugh', emoji: '😂', vi: 'cười', topic: 'activity', sentence: 'I laugh at the joke.', sentenceVi: 'Tôi cười vì câu chuyện vui.' },
  { id: 'cry', word: 'cry', emoji: '😢', vi: 'khóc', topic: 'activity', sentence: 'The baby starts to cry.', sentenceVi: 'Em bé bắt đầu khóc.' },
  { id: 'smile', word: 'smile', emoji: '😊', vi: 'mỉm cười', topic: 'activity', sentence: 'I smile at my friend.', sentenceVi: 'Tôi mỉm cười với bạn.' },
  { id: 'wave', word: 'wave', emoji: '👋', vi: 'vẫy tay chào', topic: 'activity', sentence: 'I wave hello to my teacher.', sentenceVi: 'Tôi vẫy tay chào cô giáo.' },
  { id: 'homework', word: 'homework', emoji: '📝', vi: 'bài tập về nhà', topic: 'activity', sentence: 'I do my homework.', sentenceVi: 'Tôi làm bài tập về nhà.' },
  { id: 'yawn', word: 'yawn', emoji: '🥱', vi: 'ngáp', topic: 'activity', sentence: 'I yawn when I am sleepy.', sentenceVi: 'Tôi ngáp khi buồn ngủ.' },
  { id: 'stretch', word: 'stretch', emoji: '🤸', vi: 'vươn vai, giãn cơ', topic: 'activity', sentence: 'I stretch in the morning.', sentenceVi: 'Tôi vươn vai vào buổi sáng.' },
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
