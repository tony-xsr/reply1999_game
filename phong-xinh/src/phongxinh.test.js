// Unit test cho Phòng Xinh Của Bé. Chạy: node src/phongxinh.test.js

import {
  ROOM_W, ROOM_H, WALL_H, MAX_ITEMS, FURNITURE, WALL_COLORS, FLOOR_COLORS,
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

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
