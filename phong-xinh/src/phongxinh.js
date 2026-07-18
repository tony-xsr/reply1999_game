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
  // ----- Bổ sung vòng mở rộng: thêm nhiều món đồ + vài "món chứa" lớn -----
  { id: 'wardrobe', en: 'wardrobe', vi: 'tủ quần áo', zone: 'floor', size: 80 },
  { id: 'nightstand', en: 'nightstand', vi: 'tủ đầu giường', zone: 'floor', size: 44 },
  { id: 'desk', en: 'desk', vi: 'bàn học', zone: 'floor', size: 70 },
  { id: 'tvstand', en: 'TV stand', vi: 'kệ ti vi', zone: 'floor', size: 68 },
  { id: 'toybox', en: 'toy box', vi: 'thùng đồ chơi', zone: 'floor', size: 54 },
  { id: 'bunkbed', en: 'bunk bed', vi: 'giường tầng', zone: 'floor', size: 96 },
  { id: 'rug', en: 'rug', vi: 'tấm thảm', zone: 'floor', size: 78 },
  { id: 'beanbag', en: 'bean bag chair', vi: 'ghế lười', zone: 'floor', size: 58 },
  { id: 'xylophone', en: 'xylophone', vi: 'đàn xylophone', zone: 'floor', size: 48 },
  { id: 'dinosaurtoy', en: 'dinosaur toy', vi: 'khủng long đồ chơi', zone: 'floor', size: 50 },
  { id: 'scooter', en: 'scooter', vi: 'xe scooter', zone: 'floor', size: 50 },
  { id: 'tricycle', en: 'tricycle', vi: 'xe ba bánh', zone: 'floor', size: 56 },
  { id: 'backpack', en: 'backpack', vi: 'ba lô', zone: 'floor', size: 40 },
  { id: 'birdcage', en: 'birdcage', vi: 'lồng chim', zone: 'floor', size: 46 },
  { id: 'hamstercage', en: 'hamster cage', vi: 'lồng chuột hamster', zone: 'floor', size: 46 },
  { id: 'trophy', en: 'trophy', vi: 'cúp', zone: 'floor', size: 34 },
  { id: 'teepee', en: 'teepee', vi: 'lều tipi', zone: 'floor', size: 74 },
  { id: 'swing', en: 'swing', vi: 'xích đu', zone: 'floor', size: 60 },
  { id: 'hammock', en: 'hammock', vi: 'cái võng', zone: 'floor', size: 70 },
  { id: 'trampoline', en: 'trampoline', vi: 'bạt nhún', zone: 'floor', size: 68 },
  { id: 'jumprope', en: 'jump rope', vi: 'dây nhảy', zone: 'floor', size: 40 },
  { id: 'hulahoop', en: 'hula hoop', vi: 'vòng hula', zone: 'floor', size: 46 },
  { id: 'rollerskates', en: 'roller skates', vi: 'giày trượt patin', zone: 'floor', size: 42 },
  { id: 'treasurechest', en: 'treasure chest', vi: 'rương kho báu', zone: 'floor', size: 52 },
  { id: 'easel', en: 'easel', vi: 'giá vẽ tranh', zone: 'floor', size: 54 },
  { id: 'wagon', en: 'wagon', vi: 'xe kéo đồ chơi', zone: 'floor', size: 50 },
  { id: 'shelf', en: 'shelf', vi: 'kệ trang trí', zone: 'wall', size: 52 },
  { id: 'calendar', en: 'calendar', vi: 'lịch treo tường', zone: 'wall', size: 44 },
  { id: 'worldmap', en: 'world map', vi: 'bản đồ thế giới', zone: 'wall', size: 62 },
  { id: 'bulletinboard', en: 'bulletin board', vi: 'bảng ghim', zone: 'wall', size: 56 },
  { id: 'chandelier', en: 'chandelier', vi: 'đèn chùm', zone: 'wall', size: 50 },
  { id: 'flag', en: 'flag', vi: 'lá cờ trang trí', zone: 'wall', size: 46 },
  { id: 'banner', en: 'banner', vi: 'dây cờ trang trí', zone: 'wall', size: 70 },
  { id: 'dreamcatcher', en: 'dreamcatcher', vi: 'vòng bắt mộng', zone: 'wall', size: 46 },
  // ----- Bổ sung vòng mở rộng thứ 2: thêm đồ trường học/vườn/âm nhạc -----
  { id: 'recorder', en: 'recorder', vi: 'sáo recorder', zone: 'floor', size: 34 },
  { id: 'tambourine', en: 'tambourine', vi: 'trống lục lạc', zone: 'floor', size: 40 },
  { id: 'basketballhoop', en: 'basketball hoop', vi: 'rổ bóng rổ mini', zone: 'floor', size: 60 },
  { id: 'paintpalette', en: 'paint palette', vi: 'bảng pha màu', zone: 'floor', size: 40 },
  { id: 'pencilcase', en: 'pencil case', vi: 'hộp bút', zone: 'floor', size: 38 },
  { id: 'wateringcan', en: 'watering can', vi: 'bình tưới cây', zone: 'floor', size: 42 },
  { id: 'wheelbarrow', en: 'wheelbarrow', vi: 'xe cút kít', zone: 'floor', size: 56 },
  { id: 'gardengnome', en: 'garden gnome', vi: 'chú lùn vườn', zone: 'floor', size: 44 },
  { id: 'birdbath', en: 'birdbath', vi: 'bể tắm chim', zone: 'floor', size: 50 },
  { id: 'teaset', en: 'tea set', vi: 'bộ ấm trà đồ chơi', zone: 'floor', size: 44 },
  { id: 'cupcakestand', en: 'cupcake stand', vi: 'kệ bánh cupcake', zone: 'floor', size: 52 },
  { id: 'lantern', en: 'lantern', vi: 'đèn lồng', zone: 'floor', size: 38 },
  { id: 'abacus', en: 'abacus', vi: 'bàn tính', zone: 'floor', size: 46 },
  { id: 'schoolbell', en: 'school bell', vi: 'chuông trường học', zone: 'floor', size: 34 },
  { id: 'coatrack', en: 'coat rack', vi: 'giá treo áo khoác', zone: 'floor', size: 58 },
  { id: 'blackboard', en: 'blackboard', vi: 'bảng đen', zone: 'wall', size: 62 },
  { id: 'graduationcap', en: 'graduation cap', vi: 'mũ tốt nghiệp', zone: 'wall', size: 40 },
  { id: 'diplomaframe', en: 'diploma', vi: 'bằng khen đóng khung', zone: 'wall', size: 48 },
  { id: 'windsock', en: 'windsock', vi: 'cờ gió hình ống', zone: 'wall', size: 44 },
  { id: 'lanternstring', en: 'string of lanterns', vi: 'dây đèn lồng trang trí', zone: 'wall', size: 66 },
];

// Món đồ LỚN có thể "chứa"/"đặt lên" những món đồ NHỎ khác — vd tủ sách chứa
// sách + có gấu bông ngồi trên, kệ ti vi đặt cái ti vi lên trên. Mỗi slot là 1
// vị trí neo TƯƠNG ĐỐI so với tâm món đồ chứa (đơn vị px trong không gian
// phòng), cùng danh sách id được PHÉP đặt vào slot đó.
export const CONTAINERS = {
  bookshelf: {
    slots: [
      { dx: -14, dy: -26, accepts: ['books'] },
      { dx: 14, dy: -26, accepts: ['teddy', 'trophy', 'globe'] },
    ],
  },
  tvstand: {
    slots: [
      { dx: 0, dy: -30, accepts: ['tivi'] },
    ],
  },
  desk: {
    slots: [
      { dx: -16, dy: -24, accepts: ['books', 'globe'] },
      { dx: 16, dy: -24, accepts: ['lamp', 'gift'] },
    ],
  },
  nightstand: {
    slots: [
      { dx: 0, dy: -24, accepts: ['lamp', 'candle'] },
    ],
  },
  toybox: {
    slots: [
      { dx: -12, dy: -22, accepts: ['teddy', 'robot'] },
      { dx: 12, dy: -22, accepts: ['ball', 'puppy'] },
    ],
  },
  coatrack: {
    slots: [
      { dx: 0, dy: -30, accepts: ['backpack'] },
    ],
  },
};

// Khoảng cách (px) coi là "đủ gần món chứa" khi thả 1 món nhỏ xuống — vượt
// quá khoảng này thì món nhỏ vẫn là món ĐỘC LẬP, đặt tự do như thường lệ.
const SNAP_RADIUS = 40;

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

/** Đặt thẳng 1 món vào phòng (tự kẹp vùng), KHÔNG kiểm tra món chứa gần đó —
 * dùng cho randomRoom/deserializeRoom, nơi vị trí cần giữ đúng như đã tính/lưu
 * thay vì bị "hút" dính vào món chứa nếu tình cờ đứng gần. */
function rawPlace(room, id, x, y) {
  const def = furnitureById(id);
  if (!def || room.items.length >= MAX_ITEMS) return null;
  const pos = clampPos(def, x, y);
  const item = {
    uid: room.nextUid++, id, x: pos.x, y: pos.y, flip: false, parentUid: null, slotIndex: null,
  };
  room.items.push(item);
  return item;
}

/** Slot còn trống đầu tiên của 1 món chứa mà chấp nhận itemId (null nếu không có). */
function openSlotFor(room, container, itemId) {
  const cdef = CONTAINERS[container.id];
  if (!cdef) return null;
  const occupied = new Set(
    room.items.filter((it) => it.parentUid === container.uid).map((it) => it.slotIndex),
  );
  for (let i = 0; i < cdef.slots.length; i++) {
    if (occupied.has(i)) continue;
    if (cdef.slots[i].accepts.includes(itemId)) return { index: i, slot: cdef.slots[i] };
  }
  return null;
}

/** Tìm món chứa gần (x,y) nhất còn slot trống phù hợp với itemId (null nếu không có). */
function findNearbyContainer(room, itemId, x, y, excludeUid = null) {
  let best = null;
  let bestDist = SNAP_RADIUS;
  for (const it of room.items) {
    if (it.uid === excludeUid || !CONTAINERS[it.id]) continue;
    const dist = Math.hypot(it.x - x, it.y - y);
    if (dist > bestDist) continue;
    const found = openSlotFor(room, it, itemId);
    if (found) { best = { container: it, ...found }; bestDist = dist; }
  }
  return best;
}

/** Thêm 1 món vào phòng — tự "hút" vào món chứa gần đó nếu hợp lệ (vd đặt
 * sách cạnh tủ sách sẽ tự xếp lên kệ), ngược lại đặt tự do như trước giờ.
 * Trả về item hoặc null nếu phòng đã chật/món không tồn tại. */
export function addItem(room, id, x, y) {
  if (!furnitureById(id) || room.items.length >= MAX_ITEMS) return null;
  // Bản thân các món CHỨA không tự lồng vào món chứa khác (tránh lồng nhau rối phòng).
  const nearby = CONTAINERS[id] ? null : findNearbyContainer(room, id, x, y);
  if (nearby) {
    const { container, index, slot } = nearby;
    const item = {
      uid: room.nextUid++, id, x: container.x + slot.dx, y: container.y + slot.dy,
      flip: false, parentUid: container.uid, slotIndex: index,
    };
    room.items.push(item);
    return item;
  }
  return rawPlace(room, id, x, y);
}

/** Nếu item là 1 món chứa, kéo mọi món đang xếp trong nó theo vị trí mới. */
function followContainerChildren(room, container) {
  const cdef = CONTAINERS[container.id];
  if (!cdef) return;
  for (const child of room.items) {
    if (child.parentUid !== container.uid) continue;
    const slot = cdef.slots[child.slotIndex];
    if (!slot) continue;
    child.x = container.x + slot.dx;
    child.y = container.y + slot.dy;
  }
}

export function moveItem(room, uid, x, y) {
  const item = room.items.find((it) => it.uid === uid);
  if (!item) return false;
  const def = furnitureById(item.id);
  const nearby = CONTAINERS[item.id] ? null : findNearbyContainer(room, item.id, x, y, uid);
  if (nearby) {
    const { container, index, slot } = nearby;
    item.parentUid = container.uid;
    item.slotIndex = index;
    item.x = container.x + slot.dx;
    item.y = container.y + slot.dy;
  } else {
    const pos = clampPos(def, x, y);
    item.x = pos.x;
    item.y = pos.y;
    item.parentUid = null;
    item.slotIndex = null;
  }
  followContainerChildren(room, item);
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
  const removed = room.items.length < before;
  if (removed) {
    // Món chứa bị dọn đi thì đồ bên trong KHÔNG mất theo — chỉ tách ra thành
    // món độc lập, giữ nguyên vị trí hiện tại (đã là tọa độ tuyệt đối).
    for (const it of room.items) {
      if (it.parentUid === uid) { it.parentUid = null; it.slotIndex = null; }
    }
  }
  return removed;
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

/** Thứ tự vẽ: đồ tường trước, đồ sàn theo y tăng dần (đồ thấp hơn che đồ cao
 * hơn) — riêng món đang xếp TRONG/TRÊN 1 món chứa luôn vẽ NGAY SAU món chứa
 * đó (bất kể y tuyệt đối), để luôn hiện "nằm trên/trong" đúng như mắt thấy. */
export function drawOrder(room) {
  const topLevel = room.items.filter((it) => !it.parentUid);
  const sorted = [...topLevel].sort((a, b) => {
    const za = furnitureById(a.id).zone === 'wall' ? 0 : 1;
    const zb = furnitureById(b.id).zone === 'wall' ? 0 : 1;
    if (za !== zb) return za - zb;
    return a.y - b.y;
  });
  const out = [];
  for (const it of sorted) {
    out.push(it);
    const children = room.items
      .filter((c) => c.parentUid === it.uid)
      .sort((a, b) => a.slotIndex - b.slotIndex);
    out.push(...children);
  }
  return out;
}

export function serializeRoom(room) {
  return JSON.stringify({
    wall: room.wall,
    floor: room.floor,
    items: room.items.map((it) => ({
      uid: it.uid, id: it.id, x: it.x, y: it.y, flip: it.flip,
      parentUid: it.parentUid, slotIndex: it.slotIndex,
    })),
  });
}

export function deserializeRoom(text) {
  const room = makeRoom();
  try {
    const raw = JSON.parse(text);
    if (WALL_COLORS.some((w) => w.id === raw.wall)) room.wall = raw.wall;
    if (FLOOR_COLORS.some((f) => f.id === raw.floor)) room.floor = raw.floor;
    if (Array.isArray(raw.items)) {
      // Khôi phục vị trí THẬT (đã lưu) trước — không dùng addItem() vì hàm đó
      // sẽ tự "hút" món vào món chứa gần đó theo toạ độ, có thể sai khác với
      // quan hệ cha-con đã lưu. Ghép trực tiếp record đã lưu ↔ item mới tạo
      // (không dựa vào chỉ số mảng) để không bị lệch khi có id lạ bị bỏ qua.
      const uidMap = new Map(); // uid đã lưu → uid mới
      const restored = []; // { item, savedParentUid, savedSlotIndex }
      for (const it of raw.items.slice(0, MAX_ITEMS)) {
        const item = rawPlace(room, it.id, Number(it.x) || 0, Number(it.y) || 0);
        if (!item) continue;
        if (it.flip) item.flip = true;
        if (typeof it.uid === 'number') uidMap.set(it.uid, item.uid);
        restored.push({ item, savedParentUid: it.parentUid, savedSlotIndex: it.slotIndex });
      }
      for (const { item, savedParentUid, savedSlotIndex } of restored) {
        if (savedParentUid != null && uidMap.has(savedParentUid)) {
          item.parentUid = uidMap.get(savedParentUid);
          item.slotIndex = savedSlotIndex ?? null;
        }
      }
    }
  } catch { /* dữ liệu hỏng → phòng trống */ }
  return room;
}

/** Trang trí ngẫu nhiên — nút 🎲: phòng gọn gàng 6–9 món không trùng kiểu.
 * Dùng rawPlace() (không tự hút vào món chứa) để vị trí luôn đúng NGẪU NHIÊN
 * như đã tính, không bị lệch nếu 2 món liên quan tình cờ đứng gần nhau. */
export function randomRoom(rng = Math.random) {
  const room = makeRoom();
  room.wall = WALL_COLORS[Math.floor(rng() * WALL_COLORS.length)].id;
  room.floor = FLOOR_COLORS[Math.floor(rng() * FLOOR_COLORS.length)].id;
  const pool = [...FURNITURE].sort(() => rng() - 0.5);
  const count = 6 + Math.floor(rng() * 4);
  for (const def of pool.slice(0, count)) {
    const x = 40 + rng() * (ROOM_W - 80);
    const y = def.zone === 'wall' ? 40 + rng() * (WALL_H - 80) : WALL_H + rng() * (ROOM_H - WALL_H - 30);
    rawPlace(room, def.id, x, y);
  }
  return room;
}
