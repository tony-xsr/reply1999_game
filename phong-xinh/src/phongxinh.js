// Phòng Xinh Của Bé: kéo-thả nội thất trang trí căn phòng — chạm món đồ là nghe ĐỌC TO
// TÊN TIẾNG ANH ("bed", "lamp"...), đổi màu tường/sàn cũng đọc màu. Game "chơi để chơi"
// không chấm điểm (cùng tinh thần Bé Làm Stylist) — học từ vựng đồ vật trong nhà.
// Đồ vật hiển thị bằng icon Twemoji (CC-BY); phòng vẽ SVG. File thuần logic, test độc lập.

export const ROOM_W = 480;
export const ROOM_H = 420;
export const WALL_H = 230; // từ mép trên tới đường chân tường
export const MAX_ITEMS = 20;

/** Đồ treo tường thì ở vùng tường, còn lại đặt trên sàn. */
export const FURNITURE = [
  { id: 'bed', en: 'bed', vi: 'cái giường', zone: 'floor', size: 92 },
  { id: 'sofa', en: 'sofa', vi: 'ghế sô pha', zone: 'floor', size: 84 },
  { id: 'chair', en: 'chair', vi: 'cái ghế', zone: 'floor', size: 56 },
  { id: 'drum', en: 'drum', vi: 'cái trống', zone: 'floor', size: 54 },
  { id: 'lamp', en: 'lamp', vi: 'cây đèn', zone: 'floor', size: 52 },
  { id: 'plant', en: 'plant', vi: 'chậu cây', zone: 'floor', size: 54 },
  { id: 'teddy', en: 'teddy bear', vi: 'gấu bông', zone: 'floor', size: 46 },
  { id: 'books', en: 'books', vi: 'chồng sách', zone: 'floor', size: 44 },
  { id: 'basket', en: 'basket', vi: 'giỏ đồ', zone: 'floor', size: 46 },
  { id: 'cat', en: 'cat', vi: 'chú mèo', zone: 'floor', size: 44 },
  { id: 'vase', en: 'vase', vi: 'bình hoa', zone: 'floor', size: 42 },
  { id: 'tivi', en: 'TV', vi: 'cái ti vi', zone: 'floor', size: 62 },
  { id: 'piano', en: 'piano', vi: 'đàn piano', zone: 'floor', size: 56 },
  { id: 'guitar', en: 'guitar', vi: 'đàn ghi ta', zone: 'floor', size: 50 },
  { id: 'train', en: 'train', vi: 'tàu hỏa đồ chơi', zone: 'floor', size: 52 },
  { id: 'ball', en: 'ball', vi: 'quả bóng', zone: 'floor', size: 36 },
  { id: 'rocket', en: 'rocket', vi: 'tên lửa đồ chơi', zone: 'floor', size: 48 },
  { id: 'puppy', en: 'puppy', vi: 'chú cún', zone: 'floor', size: 44 },
  { id: 'robot', en: 'robot', vi: 'bạn robot', zone: 'floor', size: 46 },
  { id: 'bathtub', en: 'bathtub', vi: 'bồn tắm', zone: 'floor', size: 64 },
  { id: 'balloon', en: 'balloon', vi: 'bóng bay', zone: 'floor', size: 40 },
  { id: 'bookshelf', en: 'bookshelf', vi: 'kệ sách', zone: 'floor', size: 58 },
  { id: 'aquarium', en: 'aquarium', vi: 'bể cá', zone: 'floor', size: 56 },
  { id: 'camera', en: 'camera', vi: 'máy ảnh', zone: 'floor', size: 40 },
  { id: 'gift', en: 'gift', vi: 'hộp quà', zone: 'floor', size: 42 },
  { id: 'globe', en: 'globe', vi: 'quả địa cầu', zone: 'floor', size: 48 },
  { id: 'sandbox', en: 'sandbox', vi: 'hố cát', zone: 'floor', size: 66 },
  { id: 'candle', en: 'candle', vi: 'cây nến', zone: 'floor', size: 36 },
  { id: 'umbrella', en: 'umbrella', vi: 'cây dù', zone: 'floor', size: 50 },
  { id: 'skateboard', en: 'skateboard', vi: 'ván trượt', zone: 'floor', size: 50 },
  { id: 'dollhouse', en: 'dollhouse', vi: 'nhà búp bê', zone: 'floor', size: 60 },
  { id: 'telescope', en: 'telescope', vi: 'kính thiên văn', zone: 'floor', size: 54 },
  { id: 'picture', en: 'picture', vi: 'bức tranh', zone: 'wall', size: 56 },
  { id: 'window', en: 'window', vi: 'cửa sổ', zone: 'wall', size: 72 },
  { id: 'clock', en: 'clock', vi: 'đồng hồ', zone: 'wall', size: 46 },
  { id: 'mirror', en: 'mirror', vi: 'cái gương', zone: 'wall', size: 52 },
  { id: 'rainbow', en: 'rainbow', vi: 'cầu vồng', zone: 'wall', size: 60 },
  { id: 'moon', en: 'moon', vi: 'đèn trăng non', zone: 'wall', size: 44 },
  { id: 'kite', en: 'kite', vi: 'cánh diều', zone: 'wall', size: 52 },
];

export const WALL_COLORS = [
  { id: 'cream', en: 'cream wall', vi: 'tường màu kem', hex: '#fdf3df' },
  { id: 'blue', en: 'blue wall', vi: 'tường xanh dương', hex: '#cfe6f7' },
  { id: 'pink', en: 'pink wall', vi: 'tường hồng', hex: '#fbdfec' },
  { id: 'green', en: 'green wall', vi: 'tường xanh lá', hex: '#ddf0d5' },
  { id: 'purple', en: 'purple wall', vi: 'tường tím', hex: '#e8dcf5' },
  { id: 'yellow', en: 'yellow wall', vi: 'tường vàng', hex: '#fdf0c0' },
  { id: 'sky', en: 'sky wall', vi: 'tường mây trời', hex: '#e3f2fd' },
];

export const FLOOR_COLORS = [
  { id: 'wood', en: 'wooden floor', vi: 'sàn gỗ', hex: '#d9a05e' },
  { id: 'grey', en: 'grey floor', vi: 'sàn xám', hex: '#c9ccd4' },
  { id: 'mint', en: 'mint floor', vi: 'sàn xanh bạc hà', hex: '#bfe3cf' },
  { id: 'peach', en: 'peach floor', vi: 'sàn màu đào', hex: '#f5cba8' },
  { id: 'lavender', en: 'lavender floor', vi: 'sàn tím oải hương', hex: '#dccfec' },
  { id: 'blue', en: 'blue floor', vi: 'sàn xanh biển', hex: '#b8d8ec' },
];

export function furnitureById(id) {
  return FURNITURE.find((f) => f.id === id) || null;
}

/** Kẹp tọa độ tâm món đồ vào đúng vùng của nó (tường/sàn) và trong lòng phòng. */
export function clampPos(def, x, y) {
  const half = def.size / 2;
  const cx = Math.max(half, Math.min(ROOM_W - half, x));
  let cy;
  if (def.zone === 'wall') {
    cy = Math.max(half + 8, Math.min(WALL_H - 20, y));
  } else {
    cy = Math.max(WALL_H - 6, Math.min(ROOM_H - half + 10, y));
  }
  return { x: cx, y: cy };
}

export function makeRoom() {
  return { wall: 'cream', floor: 'wood', items: [], nextUid: 1 };
}

/** Thêm 1 món vào phòng (tự kẹp vùng). Trả về item hoặc null nếu phòng đã chật. */
export function addItem(room, id, x, y) {
  const def = furnitureById(id);
  if (!def || room.items.length >= MAX_ITEMS) return null;
  const pos = clampPos(def, x, y);
  const item = { uid: room.nextUid++, id, x: pos.x, y: pos.y, flip: false };
  room.items.push(item);
  return item;
}

export function moveItem(room, uid, x, y) {
  const item = room.items.find((it) => it.uid === uid);
  if (!item) return false;
  const pos = clampPos(furnitureById(item.id), x, y);
  item.x = pos.x;
  item.y = pos.y;
  return true;
}

export function flipItem(room, uid) {
  const item = room.items.find((it) => it.uid === uid);
  if (!item) return false;
  item.flip = !item.flip;
  return true;
}

export function removeItem(room, uid) {
  const before = room.items.length;
  room.items = room.items.filter((it) => it.uid !== uid);
  return room.items.length < before;
}

export function setWall(room, colorId) {
  const c = WALL_COLORS.find((w) => w.id === colorId);
  if (!c) return null;
  room.wall = colorId;
  return { en: c.en, vi: c.vi };
}

export function setFloor(room, colorId) {
  const c = FLOOR_COLORS.find((f) => f.id === colorId);
  if (!c) return null;
  room.floor = colorId;
  return { en: c.en, vi: c.vi };
}

/** Thứ tự vẽ: đồ tường trước, đồ sàn theo y tăng dần (đồ thấp hơn che đồ cao hơn). */
export function drawOrder(room) {
  return [...room.items].sort((a, b) => {
    const za = furnitureById(a.id).zone === 'wall' ? 0 : 1;
    const zb = furnitureById(b.id).zone === 'wall' ? 0 : 1;
    if (za !== zb) return za - zb;
    return a.y - b.y;
  });
}

export function serializeRoom(room) {
  return JSON.stringify({ wall: room.wall, floor: room.floor, items: room.items });
}

export function deserializeRoom(text) {
  const room = makeRoom();
  try {
    const raw = JSON.parse(text);
    if (WALL_COLORS.some((w) => w.id === raw.wall)) room.wall = raw.wall;
    if (FLOOR_COLORS.some((f) => f.id === raw.floor)) room.floor = raw.floor;
    if (Array.isArray(raw.items)) {
      for (const it of raw.items.slice(0, MAX_ITEMS)) {
        const def = furnitureById(it.id);
        if (!def) continue;
        const item = addItem(room, it.id, it.x, it.y);
        if (item && it.flip) item.flip = true;
      }
    }
  } catch { /* dữ liệu hỏng → phòng trống */ }
  return room;
}

/** Trang trí ngẫu nhiên — nút 🎲: phòng gọn gàng 6–9 món không trùng kiểu. */
export function randomRoom(rng = Math.random) {
  const room = makeRoom();
  room.wall = WALL_COLORS[Math.floor(rng() * WALL_COLORS.length)].id;
  room.floor = FLOOR_COLORS[Math.floor(rng() * FLOOR_COLORS.length)].id;
  const pool = [...FURNITURE].sort(() => rng() - 0.5);
  const count = 6 + Math.floor(rng() * 4);
  for (const def of pool.slice(0, count)) {
    const x = 40 + rng() * (ROOM_W - 80);
    const y = def.zone === 'wall' ? 40 + rng() * (WALL_H - 80) : WALL_H + rng() * (ROOM_H - WALL_H - 30);
    addItem(room, def.id, x, y);
  }
  return room;
}
