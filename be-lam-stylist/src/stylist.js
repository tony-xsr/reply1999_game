// Bé Làm Stylist: thay đồ cho búp bê — chạm món đồ là mặc ngay + ĐỌC TO TÊN TIẾNG ANH
// ("red dress!"), chạm bộ phận cơ thể búp bê thì đọc tên bộ phận ("hair", "hand"...).
// Game "chơi để chơi" không chấm điểm (như Vẽ Tự Do) — vừa chơi vừa học từ vựng quần áo,
// bộ phận cơ thể và màu sắc. Búp bê + đồ đều tự vẽ SVG. File thuần logic, test độc lập.

export const SLOTS = ['hair', 'top', 'bottom', 'shoes', 'accessory'];

/** Bảng màu dùng chung — tên màu tiếng Anh để ghép thành "red dress", "blue shoes"... */
export const COLORS = [
  { id: 'red', en: 'red', vi: 'đỏ', hex: '#e53935' },
  { id: 'blue', en: 'blue', vi: 'xanh dương', hex: '#1e88e5' },
  { id: 'green', en: 'green', vi: 'xanh lá', hex: '#43a047' },
  { id: 'yellow', en: 'yellow', vi: 'vàng', hex: '#fdd835' },
  { id: 'pink', en: 'pink', vi: 'hồng', hex: '#ec407a' },
  { id: 'purple', en: 'purple', vi: 'tím', hex: '#8e24aa' },
];

/** Tủ đồ: mỗi món có kiểu dáng + tên EN/VI; màu chọn riêng nên tổ hợp rất nhiều. */
export const ITEMS = [
  { id: 'hair_short', slot: 'hair', en: 'short hair', vi: 'tóc ngắn' },
  { id: 'hair_long', slot: 'hair', en: 'long hair', vi: 'tóc dài' },
  { id: 'hair_buns', slot: 'hair', en: 'hair buns', vi: 'tóc búi hai bên' },
  { id: 'top_tshirt', slot: 'top', en: 'T-shirt', vi: 'áo thun' },
  { id: 'top_dress', slot: 'top', en: 'dress', vi: 'váy đầm' },
  { id: 'top_jacket', slot: 'top', en: 'jacket', vi: 'áo khoác' },
  { id: 'bottom_shorts', slot: 'bottom', en: 'shorts', vi: 'quần short' },
  { id: 'bottom_pants', slot: 'bottom', en: 'pants', vi: 'quần dài' },
  { id: 'bottom_skirt', slot: 'bottom', en: 'skirt', vi: 'chân váy' },
  { id: 'shoes_sneakers', slot: 'shoes', en: 'sneakers', vi: 'giày thể thao' },
  { id: 'shoes_boots', slot: 'shoes', en: 'boots', vi: 'giày bốt' },
  { id: 'acc_bow', slot: 'accessory', en: 'bow', vi: 'chiếc nơ' },
  { id: 'acc_hat', slot: 'accessory', en: 'hat', vi: 'chiếc mũ' },
  { id: 'acc_glasses', slot: 'accessory', en: 'glasses', vi: 'cặp kính' },
  { id: 'acc_none', slot: 'accessory', en: 'nothing', vi: 'không đeo gì' },
];

/** Bộ phận cơ thể — chạm vào búp bê để nghe tên tiếng Anh. */
export const BODY_PARTS = [
  { id: 'head', en: 'head', vi: 'cái đầu' },
  { id: 'eyes', en: 'eyes', vi: 'đôi mắt' },
  { id: 'mouth', en: 'mouth', vi: 'cái miệng' },
  { id: 'hands', en: 'hands', vi: 'bàn tay' },
  { id: 'tummy', en: 'tummy', vi: 'cái bụng' },
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

/** Bộ đồ khởi đầu dễ thương. */
export function makeOutfit() {
  return {
    hair: { item: 'hair_short', color: 'yellow' },
    top: { item: 'top_tshirt', color: 'red' },
    bottom: { item: 'bottom_shorts', color: 'blue' },
    shoes: { item: 'shoes_sneakers', color: 'green' },
    accessory: { item: 'acc_none', color: 'pink' },
  };
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
  if (item.id === 'acc_none') return { en: 'nothing', vi: 'không đeo gì' };
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
