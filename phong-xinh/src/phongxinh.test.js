// Unit test cho Phòng Xinh Của Bé. Chạy: node src/phongxinh.test.js

import {
  ROOM_W, ROOM_H, WALL_H, MAX_ITEMS, FURNITURE, WALL_COLORS, FLOOR_COLORS, CONTAINERS,
  furnitureById, clampPos, makeRoom, addItem, moveItem, flipItem, removeItem,
  setWall, setFloor, drawOrder, serializeRoom, deserializeRoom, randomRoom,
} from './phongxinh.js';

let passed = 0;
let failed = 0;

function check(name, cond) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.error(`  ❌ ${name}`); }
}

function seeded(seed = 1) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
}

console.log('— Danh mục nội thất —');

check('mọi món: id duy nhất, đủ tên EN/VI, vùng hợp lệ, có cỡ', (() => {
  const ids = new Set(FURNITURE.map((f) => f.id));
  return ids.size === FURNITURE.length
    && FURNITURE.every((f) => f.en && f.vi && ['wall', 'floor'].includes(f.zone) && f.size > 0);
})());

check('có cả đồ tường lẫn đồ sàn; bảng màu tường/sàn đủ hex + tên 2 thứ tiếng', (() => {
  return FURNITURE.some((f) => f.zone === 'wall') && FURNITURE.some((f) => f.zone === 'floor')
    && WALL_COLORS.every((c) => /^#[0-9a-f]{6}$/i.test(c.hex) && c.en && c.vi)
    && FLOOR_COLORS.every((c) => /^#[0-9a-f]{6}$/i.test(c.hex) && c.en && c.vi);
})());

console.log('— Đặt & kẹp vùng —');

check('đồ tường bị kẹp trong vùng tường, đồ sàn kẹp trong vùng sàn', (() => {
  const wall = furnitureById('picture');
  const floor = furnitureById('bed');
  const w = clampPos(wall, 240, ROOM_H); // cố dí tranh xuống sàn
  const f = clampPos(floor, 240, 0); // cố treo giường lên trần
  return w.y <= WALL_H - 20 && f.y >= WALL_H - 6;
})());

check('kẹp ngang: không món nào lòi ra khỏi 2 mép phòng', (() => {
  const def = furnitureById('sofa');
  const left = clampPos(def, -100, 300);
  const right = clampPos(def, ROOM_W + 100, 300);
  return left.x === def.size / 2 && right.x === ROOM_W - def.size / 2;
})());

check('thêm món: có uid tăng dần, tọa độ đã kẹp; món lạ → null', (() => {
  const room = makeRoom();
  const a = addItem(room, 'bed', 100, 300);
  const b = addItem(room, 'clock', 100, 100);
  return a.uid === 1 && b.uid === 2 && room.items.length === 2
    && addItem(room, 'khong_co', 0, 0) === null;
})());

check('phòng chật (MAX_ITEMS) thì không thêm được nữa', (() => {
  const room = makeRoom();
  for (let i = 0; i < MAX_ITEMS; i++) addItem(room, 'teddy', 100 + i, 300);
  return addItem(room, 'cat', 100, 300) === null && room.items.length === MAX_ITEMS;
})());

console.log('— Kéo / lật / xóa —');

check('moveItem dời đúng món theo uid (vẫn kẹp vùng); uid lạ → false', (() => {
  const room = makeRoom();
  const a = addItem(room, 'cat', 100, 300);
  const ok = moveItem(room, a.uid, 400, ROOM_H + 500);
  return ok && a.x === 400 && a.y <= ROOM_H - a.y / 999 + ROOM_H // y đã kẹp
    && a.y <= ROOM_H && moveItem(room, 999, 0, 0) === false;
})());

check('flipItem lật qua lật lại; removeItem xóa đúng món', (() => {
  const room = makeRoom();
  const a = addItem(room, 'sofa', 200, 300);
  const b = addItem(room, 'cat', 300, 320);
  flipItem(room, a.uid);
  const flipped = a.flip === true;
  flipItem(room, a.uid);
  removeItem(room, b.uid);
  return flipped && a.flip === false && room.items.length === 1 && room.items[0].uid === a.uid;
})());

console.log('— Màu tường/sàn & thứ tự vẽ —');

check('đổi màu tường/sàn trả về cụm từ để đọc; màu lạ → null', (() => {
  const room = makeRoom();
  const w = setWall(room, 'pink');
  const f = setFloor(room, 'mint');
  return w.en === 'pink wall' && f.en === 'mint floor'
    && room.wall === 'pink' && setWall(room, 'khong_co') === null;
})());

check('thứ tự vẽ: đồ tường trước, đồ sàn theo y tăng dần (gần che xa)', (() => {
  const room = makeRoom();
  const low = addItem(room, 'teddy', 100, 400);
  const high = addItem(room, 'bed', 200, 260);
  const wall = addItem(room, 'clock', 300, 80);
  const order = drawOrder(room).map((it) => it.uid);
  return order[0] === wall.uid && order[1] === high.uid && order[2] === low.uid;
})());

console.log('— Lưu / khôi phục / ngẫu nhiên —');

check('serialize → deserialize giữ nguyên phòng (kể cả flip)', (() => {
  const room = makeRoom();
  setWall(room, 'blue');
  const a = addItem(room, 'sofa', 200, 300);
  flipItem(room, a.uid);
  addItem(room, 'window', 150, 90);
  const room2 = deserializeRoom(serializeRoom(room));
  return room2.wall === 'blue' && room2.items.length === 2
    && room2.items[0].id === 'sofa' && room2.items[0].flip === true;
})());

check('dữ liệu hỏng / món lạ / quá MAX_ITEMS → phòng vẫn an toàn', (() => {
  const bad = deserializeRoom('{hỏng');
  const weird = deserializeRoom(JSON.stringify({
    wall: 'khong_co',
    floor: 'wood',
    items: [{ id: 'khong_co', x: 1, y: 1 }, { id: 'cat', x: 9999, y: -50 }],
  }));
  return bad.items.length === 0 && weird.wall === 'cream'
    && weird.items.length === 1 && weird.items[0].x <= ROOM_W && weird.items[0].y >= WALL_H - 6;
})());

check('phòng ngẫu nhiên: 6–9 món hợp lệ không trùng kiểu, đồ nằm đúng vùng', (() => {
  for (const seed of [1, 7, 42]) {
    const room = randomRoom(seeded(seed));
    if (room.items.length < 6 || room.items.length > 9) return false;
    const ids = new Set(room.items.map((it) => it.id));
    if (ids.size !== room.items.length) return false;
    for (const it of room.items) {
      const def = furnitureById(it.id);
      if (def.zone === 'wall' && it.y > WALL_H) return false;
      if (def.zone === 'floor' && it.y < WALL_H - 6) return false;
    }
  }
  return true;
})());

console.log('— Món chứa: kệ sách/kệ ti vi/bàn học... "chứa" hoặc "đặt lên" món khác —');

check('CONTAINERS: mọi id món chứa tồn tại trong FURNITURE, mọi id được accepts cũng vậy', (() => {
  return Object.keys(CONTAINERS).every((id) => furnitureById(id))
    && Object.values(CONTAINERS).every((c) => c.slots.every((s) => s.accepts.every((aid) => furnitureById(aid))));
})());

check('đặt sách cạnh tủ sách sẽ tự "hút" lên kệ (thành con của tủ sách, đúng vị trí slot)', (() => {
  const room = makeRoom();
  const shelf = addItem(room, 'bookshelf', 200, 300);
  const books = addItem(room, 'books', 200, 300); // thả ngay tại tâm tủ sách → đủ gần để hút
  const slot = CONTAINERS.bookshelf.slots[0];
  return books.parentUid === shelf.uid && books.slotIndex === 0
    && books.x === shelf.x + slot.dx && books.y === shelf.y + slot.dy;
})());

check('đặt gấu bông cạnh tủ sách (đã có sách) sẽ vào slot còn trống thứ 2, không đè lên sách', (() => {
  const room = makeRoom();
  const shelf = addItem(room, 'bookshelf', 200, 300);
  addItem(room, 'books', 200, 300);
  const teddy = addItem(room, 'teddy', 200, 300);
  return teddy.parentUid === shelf.uid && teddy.slotIndex === 1;
})());

check('đặt ti vi cạnh kệ ti vi sẽ tự lên kệ; đặt xa kệ thì vẫn là món độc lập', (() => {
  const room = makeRoom();
  const stand = addItem(room, 'tvstand', 100, 320);
  const tiviNear = addItem(room, 'tivi', 105, 322);
  const tiviFar = addItem(room, 'tivi', 400, 380);
  return tiviNear.parentUid === stand.uid && tiviFar.parentUid === null;
})());

check('đặt ba lô cạnh giá treo áo (coatrack, thêm ở vòng mở rộng 2) sẽ tự treo lên', (() => {
  const room = makeRoom();
  const rack = addItem(room, 'coatrack', 150, 300);
  const bag = addItem(room, 'backpack', 152, 302);
  const slot = CONTAINERS.coatrack.slots[0];
  return bag.parentUid === rack.uid && bag.x === rack.x + slot.dx && bag.y === rack.y + slot.dy;
})());

check('slot đã đầy hết (2/2) thì món thứ 3 không hút được nữa, đặt tự do như bình thường', (() => {
  const room = makeRoom();
  addItem(room, 'bookshelf', 200, 300);
  addItem(room, 'books', 200, 300);
  addItem(room, 'teddy', 200, 300);
  const extra = addItem(room, 'globe', 200, 300); // globe cũng được slot 2 chấp nhận nhưng đã đầy
  return extra.parentUid === null;
})());

check('món KHÔNG hợp lệ với slot (vd cái ghế) đặt cạnh tủ sách vẫn là món độc lập, không bị hút', (() => {
  const room = makeRoom();
  addItem(room, 'bookshelf', 200, 300);
  const chair = addItem(room, 'chair', 200, 300);
  return chair.parentUid === null;
})());

check('kéo tủ sách sang chỗ khác thì sách/gấu bông trên kệ đi theo đúng khoảng cách tương đối', (() => {
  const room = makeRoom();
  const shelf = addItem(room, 'bookshelf', 200, 300);
  const books = addItem(room, 'books', 200, 300);
  moveItem(room, shelf.uid, 350, 350);
  const slot = CONTAINERS.bookshelf.slots[0];
  return books.x === shelf.x + slot.dx && books.y === shelf.y + slot.dy;
})());

check('kéo sách ra xa khỏi tủ sách thì tách thành món độc lập (parentUid về null)', (() => {
  const room = makeRoom();
  addItem(room, 'bookshelf', 200, 300);
  const books = addItem(room, 'books', 200, 300);
  moveItem(room, books.uid, 400, 380);
  return books.parentUid === null && books.x === 400;
})());

check('dọn tủ sách đi thì sách/gấu bông KHÔNG bị xoá theo, chỉ tách thành món độc lập', (() => {
  const room = makeRoom();
  const shelf = addItem(room, 'bookshelf', 200, 300);
  const books = addItem(room, 'books', 200, 300);
  removeItem(room, shelf.uid);
  return room.items.length === 1 && room.items[0].uid === books.uid && room.items[0].parentUid === null;
})());

check('món đang xếp trong món chứa luôn vẽ NGAY SAU món chứa, bất kể y tuyệt đối', (() => {
  const room = makeRoom();
  const shelf = addItem(room, 'bookshelf', 200, 260); // shelf ở y nhỏ (xa hơn trong phòng)
  const books = addItem(room, 'books', 200, 260); // con của shelf, y thực tế < shelf.y (đặt "lên" kệ)
  const farItem = addItem(room, 'cat', 200, 400); // món độc lập ở y lớn hơn nhiều
  const order = drawOrder(room).map((it) => it.uid);
  const shelfIdx = order.indexOf(shelf.uid);
  const booksIdx = order.indexOf(books.uid);
  return booksIdx === shelfIdx + 1 && order.indexOf(farItem.uid) > booksIdx;
})());

check('serialize → deserialize giữ nguyên quan hệ cha-con (kể cả khi có id lạ chen giữa)', (() => {
  const room = makeRoom();
  const shelf = addItem(room, 'bookshelf', 200, 300);
  const books = addItem(room, 'books', 200, 300);
  const raw = JSON.parse(serializeRoom(room));
  raw.items.splice(1, 0, { id: 'khong_co_that', x: 0, y: 0, uid: 999 }); // chèn id lạ vào giữa
  const room2 = deserializeRoom(JSON.stringify(raw));
  const shelf2 = room2.items.find((it) => it.id === 'bookshelf');
  const books2 = room2.items.find((it) => it.id === 'books');
  return room2.items.length === 2 && books2.parentUid === shelf2.uid && books2.slotIndex === books.slotIndex;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
