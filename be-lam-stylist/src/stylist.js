// Bé Làm Stylist: thay đồ cho búp bê — chạm món đồ là mặc ngay + ĐỌC TO TÊN TIẾNG ANH
// ("red dress!"), chạm bộ phận cơ thể búp bê thì đọc tên bộ phận ("hair", "hand"...).
// Game "chơi để chơi" không chấm điểm (như Vẽ Tự Do) — vừa chơi vừa học từ vựng quần áo,
// PHỤ KIỆN (mỗi loại 1 ô riêng, đeo được CÙNG LÚC nhiều thứ), bộ phận cơ thể và màu sắc.
// Búp bê + đồ đều tự vẽ SVG. File thuần logic, test độc lập.

// Mỗi slot là 1 vùng trang phục/phụ kiện ĐỘC LẬP — bé có thể đội mũ + đeo kính +
// đeo vòng cổ + hoa tai + găng tay + tất + túi xách CÙNG LÚC (khác với thiết kế cũ
// gộp chung 1 slot "accessory" chỉ chọn được 1 thứ).
export const SLOTS = [
  'hair', 'top', 'bottom', 'shoes',
  'headwear', 'glasses', 'necklace', 'earrings', 'gloves', 'socks', 'bag',
];

/** Bảng màu dùng chung — tên màu tiếng Anh để ghép thành "red dress", "blue shoes"... */
export const COLORS = [
  { id: 'red', en: 'red', vi: 'đỏ', hex: '#e53935' },
  { id: 'blue', en: 'blue', vi: 'xanh dương', hex: '#1e88e5' },
  { id: 'green', en: 'green', vi: 'xanh lá', hex: '#43a047' },
  { id: 'yellow', en: 'yellow', vi: 'vàng', hex: '#fdd835' },
  { id: 'pink', en: 'pink', vi: 'hồng', hex: '#ec407a' },
  { id: 'purple', en: 'purple', vi: 'tím', hex: '#8e24aa' },
  { id: 'orange', en: 'orange', vi: 'cam', hex: '#fb8c00' },
  { id: 'black', en: 'black', vi: 'đen', hex: '#3d3d3d' },
  { id: 'white', en: 'white', vi: 'trắng', hex: '#f5f5f5' },
  { id: 'brown', en: 'brown', vi: 'nâu', hex: '#8d6e4a' },
  { id: 'grey', en: 'grey', vi: 'xám', hex: '#9e9e9e' },
];

/** Tủ đồ: mỗi món có kiểu dáng + tên EN/VI; màu chọn riêng nên tổ hợp rất nhiều. */
export const ITEMS = [
  // ----- Tóc -----
  { id: 'hair_short', slot: 'hair', en: 'short hair', vi: 'tóc ngắn' },
  { id: 'hair_long', slot: 'hair', en: 'long hair', vi: 'tóc dài' },
  { id: 'hair_buns', slot: 'hair', en: 'hair buns', vi: 'tóc búi hai bên' },
  { id: 'hair_pigtails', slot: 'hair', en: 'pigtails', vi: 'tóc đuôi sam hai bên' },
  { id: 'hair_ponytail', slot: 'hair', en: 'ponytail', vi: 'tóc đuôi ngựa' },
  { id: 'hair_curly', slot: 'hair', en: 'curly hair', vi: 'tóc xoăn' },
  { id: 'hair_bangs', slot: 'hair', en: 'hair with bangs', vi: 'tóc mái bằng' },
  // ----- Áo -----
  { id: 'top_tshirt', slot: 'top', en: 'T-shirt', vi: 'áo thun' },
  { id: 'top_dress', slot: 'top', en: 'dress', vi: 'váy đầm' },
  { id: 'top_jacket', slot: 'top', en: 'jacket', vi: 'áo khoác' },
  { id: 'top_hoodie', slot: 'top', en: 'hoodie', vi: 'áo hoodie' },
  { id: 'top_sweater', slot: 'top', en: 'sweater', vi: 'áo len' },
  { id: 'top_tank', slot: 'top', en: 'tank top', vi: 'áo ba lỗ' },
  { id: 'top_blouse', slot: 'top', en: 'blouse', vi: 'áo sơ mi nữ' },
  // ----- Trang phục nghề nghiệp -----
  { id: 'top_doctor', slot: 'top', en: 'doctor coat', vi: 'áo blouse bác sĩ' },
  { id: 'top_chef', slot: 'top', en: 'chef uniform', vi: 'đồ đầu bếp' },
  { id: 'top_police', slot: 'top', en: 'police uniform', vi: 'đồng phục cảnh sát' },
  { id: 'top_firefighter', slot: 'top', en: 'firefighter jacket', vi: 'áo lính cứu hỏa' },
  { id: 'top_astronaut', slot: 'top', en: 'astronaut suit', vi: 'bộ đồ phi hành gia' },
  // ----- Quần/váy -----
  { id: 'bottom_shorts', slot: 'bottom', en: 'shorts', vi: 'quần short' },
  { id: 'bottom_pants', slot: 'bottom', en: 'pants', vi: 'quần dài' },
  { id: 'bottom_skirt', slot: 'bottom', en: 'skirt', vi: 'chân váy' },
  { id: 'bottom_leggings', slot: 'bottom', en: 'leggings', vi: 'quần legging' },
  { id: 'bottom_overalls', slot: 'bottom', en: 'overalls', vi: 'quần yếm' },
  // ----- Giày -----
  { id: 'shoes_sneakers', slot: 'shoes', en: 'sneakers', vi: 'giày thể thao' },
  { id: 'shoes_boots', slot: 'shoes', en: 'boots', vi: 'giày bốt' },
  { id: 'shoes_sandals', slot: 'shoes', en: 'sandals', vi: 'dép xăng đan' },
  { id: 'shoes_flats', slot: 'shoes', en: 'flats', vi: 'giày búp bê' },
  // ----- Đồ đội đầu -----
  { id: 'head_bow', slot: 'headwear', en: 'bow', vi: 'chiếc nơ' },
  { id: 'head_hat', slot: 'headwear', en: 'hat', vi: 'chiếc mũ' },
  { id: 'head_crown', slot: 'headwear', en: 'crown', vi: 'vương miện' },
  { id: 'head_beanie', slot: 'headwear', en: 'beanie', vi: 'mũ len' },
  { id: 'head_chefhat', slot: 'headwear', en: 'chef hat', vi: 'mũ đầu bếp' },
  { id: 'head_policecap', slot: 'headwear', en: 'police cap', vi: 'mũ cảnh sát' },
  { id: 'head_firehelmet', slot: 'headwear', en: 'firefighter helmet', vi: 'mũ lính cứu hỏa' },
  { id: 'head_astrohelmet', slot: 'headwear', en: 'astronaut helmet', vi: 'mũ phi hành gia' },
  { id: 'head_none', slot: 'headwear', en: 'nothing', vi: 'không đội gì' },
  // ----- Kính -----
  { id: 'glasses_round', slot: 'glasses', en: 'glasses', vi: 'cặp kính' },
  { id: 'glasses_sun', slot: 'glasses', en: 'sunglasses', vi: 'kính râm' },
  { id: 'glasses_none', slot: 'glasses', en: 'nothing', vi: 'không đeo kính' },
  // ----- Vòng cổ -----
  { id: 'neck_heart', slot: 'necklace', en: 'heart necklace', vi: 'vòng cổ trái tim' },
  { id: 'neck_pearl', slot: 'necklace', en: 'pearl necklace', vi: 'vòng cổ ngọc trai' },
  { id: 'neck_none', slot: 'necklace', en: 'nothing', vi: 'không đeo vòng cổ' },
  // ----- Bông tai -----
  { id: 'ear_stud', slot: 'earrings', en: 'stud earrings', vi: 'bông tai đính đá' },
  { id: 'ear_hoop', slot: 'earrings', en: 'hoop earrings', vi: 'bông tai tròn' },
  { id: 'ear_none', slot: 'earrings', en: 'nothing', vi: 'không đeo bông tai' },
  // ----- Găng tay -----
  { id: 'glove_mitten', slot: 'gloves', en: 'mittens', vi: 'găng tay len' },
  { id: 'glove_fingerless', slot: 'gloves', en: 'fingerless gloves', vi: 'găng tay hở ngón' },
  { id: 'glove_none', slot: 'gloves', en: 'nothing', vi: 'không đeo găng tay' },
  // ----- Tất -----
  { id: 'sock_striped', slot: 'socks', en: 'striped socks', vi: 'tất sọc' },
  { id: 'sock_knee', slot: 'socks', en: 'knee socks', vi: 'tất dài đến gối' },
  { id: 'sock_none', slot: 'socks', en: 'nothing', vi: 'không mang tất' },
  // ----- Túi/ba lô -----
  { id: 'bag_backpack', slot: 'bag', en: 'backpack', vi: 'ba lô' },
  { id: 'bag_handbag', slot: 'bag', en: 'handbag', vi: 'túi xách' },
  { id: 'bag_none', slot: 'bag', en: 'nothing', vi: 'không mang túi' },
];

/** Món "trống" mặc định của các slot phụ kiện tuỳ chọn (không mặc gì cũng hợp lệ). */
const NONE_ITEM = {
  headwear: 'head_none', glasses: 'glasses_none', necklace: 'neck_none',
  earrings: 'ear_none', gloves: 'glove_none', socks: 'sock_none', bag: 'bag_none',
};

/** 2 nhân vật cơ bản để bé chọn nhanh — chỉ đổi tóc/áo/quần MẶC ĐỊNH ban đầu
 * (giữ nguyên giày + mọi phụ kiện đang đeo), bé vẫn tự do đổi lại BẤT KỲ món
 * nào sau đó như bình thường (đây là preset gợi ý, không khoá món đồ nào cả). */
export const CHARACTERS = [
  { id: 'girl', icon: '👧', vi: 'Bé gái', en: 'girl', hair: 'hair_long', hairColor: 'yellow', top: 'top_dress', topColor: 'pink', bottom: 'bottom_skirt', bottomColor: 'pink' },
  { id: 'boy', icon: '👦', vi: 'Bé trai', en: 'boy', hair: 'hair_short', hairColor: 'brown', top: 'top_tshirt', topColor: 'blue', bottom: 'bottom_pants', bottomColor: 'black' },
  { id: 'man', icon: '🧑', vi: 'Người lớn nam', en: 'man', hair: 'hair_short', hairColor: 'black', top: 'top_jacket', topColor: 'blue', bottom: 'bottom_pants', bottomColor: 'black' },
  { id: 'woman', icon: '👩', vi: 'Người lớn nữ', en: 'woman', hair: 'hair_long', hairColor: 'brown', top: 'top_blouse', topColor: 'purple', bottom: 'bottom_skirt', bottomColor: 'black' },
  { id: 'grandpa', icon: '👴', vi: 'Ông', en: 'grandpa', hair: 'hair_short', hairColor: 'grey', top: 'top_sweater', topColor: 'brown', bottom: 'bottom_pants', bottomColor: 'grey', glasses: 'glasses_round', glassesColor: 'black' },
  { id: 'grandma', icon: '👵', vi: 'Bà', en: 'grandma', hair: 'hair_buns', hairColor: 'grey', top: 'top_sweater', topColor: 'purple', bottom: 'bottom_skirt', bottomColor: 'grey', glasses: 'glasses_round', glassesColor: 'black' },
];

export function characterById(id) {
  return CHARACTERS.find((c) => c.id === id) || CHARACTERS[0];
}

/** Áp preset tóc/áo/quần (và kính, nếu nhân vật có) vào bộ đồ hiện tại. Trả
 * về nhân vật đã áp dụng. Chỉ đổi ĐÚNG những phần được nêu trong preset — các
 * phần khác (giày, phụ kiện còn lại) giữ nguyên như trước khi bấm. */
export function applyCharacter(outfit, characterId) {
  const c = characterById(characterId);
  outfit.hair = { item: c.hair, color: c.hairColor };
  outfit.top = { item: c.top, color: c.topColor };
  outfit.bottom = { item: c.bottom, color: c.bottomColor };
  if (c.glasses) outfit.glasses = { item: c.glasses, color: c.glassesColor };
  return c;
}

/** 6 "nghề nghiệp" dựng sẵn — CHỈ đổi áo (+ mũ nếu có) sang trang phục nghề
 * nghiệp, giữ NGUYÊN tóc/quần/mọi phụ kiện khác đang có, khác với CHARACTERS
 * (đổi cả tóc+quần) vì đây là "khoác thêm đồng phục" chứ không phải đổi hẳn
 * sang nhân vật khác. */
export const PROFESSIONS = [
  { id: 'doctor', icon: '🩺', vi: 'Bác sĩ', en: 'doctor', top: 'top_doctor', topColor: 'white', headwear: null },
  { id: 'chef', icon: '👨‍🍳', vi: 'Đầu bếp', en: 'chef', top: 'top_chef', topColor: 'white', headwear: 'head_chefhat' },
  { id: 'police', icon: '👮', vi: 'Cảnh sát', en: 'police officer', top: 'top_police', topColor: 'blue', headwear: 'head_policecap' },
  { id: 'firefighter', icon: '🧑‍🚒', vi: 'Lính cứu hỏa', en: 'firefighter', top: 'top_firefighter', topColor: 'orange', headwear: 'head_firehelmet' },
  { id: 'astronaut', icon: '🧑‍🚀', vi: 'Phi hành gia', en: 'astronaut', top: 'top_astronaut', topColor: 'white', headwear: 'head_astrohelmet' },
  { id: 'teacher', icon: '👩‍🏫', vi: 'Giáo viên', en: 'teacher', top: 'top_blouse', topColor: 'purple', headwear: null },
];

export function professionById(id) {
  return PROFESSIONS.find((p) => p.id === id) || null;
}

/** Khoác trang phục nghề nghiệp lên bộ đồ hiện tại (chỉ đổi áo + mũ nếu nghề
 * đó có mũ riêng — không đụng tóc/quần/giày/phụ kiện khác). Trả về cụm từ đọc
 * to, hoặc null nếu id không hợp lệ. */
export function applyProfession(outfit, professionId) {
  const p = professionById(professionId);
  if (!p) return null;
  outfit.top = { item: p.top, color: p.topColor };
  if (p.headwear) outfit.headwear = { item: p.headwear, color: outfit.headwear.color };
  return { en: p.en, vi: p.vi };
}

/** Bộ phận cơ thể — chạm vào búp bê để nghe tên tiếng Anh. */
export const BODY_PARTS = [
  { id: 'head', en: 'head', vi: 'cái đầu' },
  { id: 'eyes', en: 'eyes', vi: 'đôi mắt' },
  { id: 'nose', en: 'nose', vi: 'cái mũi' },
  { id: 'mouth', en: 'mouth', vi: 'cái miệng' },
  { id: 'ears', en: 'ears', vi: 'đôi tai' },
  { id: 'neck', en: 'neck', vi: 'cái cổ' },
  { id: 'arms', en: 'arms', vi: 'cánh tay' },
  { id: 'hands', en: 'hands', vi: 'bàn tay' },
  { id: 'tummy', en: 'tummy', vi: 'cái bụng' },
  { id: 'legs', en: 'legs', vi: 'đôi chân' },
  { id: 'feet', en: 'feet', vi: 'bàn chân' },
];

export function itemById(id) {
  return ITEMS.find((it) => it.id === id) || null;
}

export function colorById(id) {
  return COLORS.find((c) => c.id === id) || COLORS[0];
}

export function itemsForSlot(slot) {
  return ITEMS.filter((it) => it.slot === slot);
}

/** Bộ đồ khởi đầu dễ thương — slot phụ kiện tuỳ chọn mặc định để trống. */
export function makeOutfit() {
  const outfit = {
    hair: { item: 'hair_short', color: 'yellow' },
    top: { item: 'top_tshirt', color: 'red' },
    bottom: { item: 'bottom_shorts', color: 'blue' },
    shoes: { item: 'shoes_sneakers', color: 'green' },
  };
  for (const [slot, itemId] of Object.entries(NONE_ITEM)) {
    outfit[slot] = { item: itemId, color: 'pink' };
  }
  return outfit;
}

/** Mặc 1 món (đổi kiểu, giữ màu đang chọn của slot đó). Trả về cụm từ EN/VI để đọc to. */
export function equipItem(outfit, itemId) {
  const item = itemById(itemId);
  if (!item) return null;
  outfit[item.slot] = { item: item.id, color: outfit[item.slot].color };
  const color = colorById(outfit[item.slot].color);
  return phraseFor(item, color);
}

/** Đổi màu món đang mặc ở slot. Trả về cụm từ EN/VI. */
export function recolorSlot(outfit, slot, colorId) {
  if (!SLOTS.includes(slot) || !COLORS.some((c) => c.id === colorId)) return null;
  outfit[slot] = { item: outfit[slot].item, color: colorId };
  return phraseFor(itemById(outfit[slot].item), colorById(colorId));
}

/** Ghép cụm từ đọc to: "red dress" / "váy đầm màu đỏ". */
export function phraseFor(item, color) {
  if (item.id.endsWith('_none')) return { en: 'nothing', vi: item.vi };
  return { en: `${color.en} ${item.en}`, vi: `${item.vi} màu ${color.vi}` };
}

/** Lưu/khôi phục bộ đồ (localStorage do giao diện lo). */
export function serializeOutfit(outfit) {
  return JSON.stringify(outfit);
}

export function deserializeOutfit(text) {
  try {
    const raw = JSON.parse(text);
    const out = makeOutfit();
    for (const slot of SLOTS) {
      if (raw && raw[slot] && itemById(raw[slot].item)?.slot === slot
        && COLORS.some((c) => c.id === raw[slot].color)) {
        out[slot] = { item: raw[slot].item, color: raw[slot].color };
      }
    }
    return out;
  } catch {
    return makeOutfit();
  }
}

/** Trộn bộ đồ ngẫu nhiên — nút 🎲 cho bé lười chọn. */
export function randomOutfit(rng = Math.random) {
  const out = {};
  for (const slot of SLOTS) {
    const options = itemsForSlot(slot);
    out[slot] = {
      item: options[Math.floor(rng() * options.length)].id,
      color: COLORS[Math.floor(rng() * COLORS.length)].id,
    };
  }
  return out;
}
