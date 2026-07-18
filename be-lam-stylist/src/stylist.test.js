// Unit test cho Bé Làm Stylist. Chạy: node src/stylist.test.js

import {
  SLOTS, COLORS, ITEMS, BODY_PARTS,
  itemById, colorById, itemsForSlot, makeOutfit, equipItem, recolorSlot,
  phraseFor, serializeOutfit, deserializeOutfit, randomOutfit,
} from './stylist.js';

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

console.log('— Tủ đồ & dữ liệu —');

check('mọi món đồ: id duy nhất, slot hợp lệ, đủ tên EN + VI', (() => {
  const ids = new Set(ITEMS.map((it) => it.id));
  return ids.size === ITEMS.length
    && ITEMS.every((it) => SLOTS.includes(it.slot) && it.en && it.vi);
})());

check('slot nào cũng có ít nhất 2 lựa chọn', SLOTS.every((s) => itemsForSlot(s).length >= 2));

check('11 slot ĐỘC LẬP (áo/quần/giày/tóc + 7 phụ kiện riêng: mũ/kính/vòng cổ/bông tai/găng tay/tất/túi)', (() => {
  const expected = ['hair', 'top', 'bottom', 'shoes', 'headwear', 'glasses', 'necklace', 'earrings', 'gloves', 'socks', 'bag'];
  return SLOTS.length === expected.length && expected.every((s) => SLOTS.includes(s));
})());

check('bảng màu: đủ mã hex + tên EN/VI; bộ phận cơ thể đủ tên 2 thứ tiếng', (() => {
  return COLORS.every((c) => /^#[0-9a-f]{6}$/i.test(c.hex) && c.en && c.vi)
    && BODY_PARTS.length >= 5 && BODY_PARTS.every((p) => p.en && p.vi);
})());

console.log('— Mặc đồ & đổi màu —');

check('bộ đồ khởi đầu: đủ mọi slot, món đúng slot, màu hợp lệ', (() => {
  const o = makeOutfit();
  return SLOTS.every((s) => itemById(o[s].item)?.slot === s
    && COLORS.some((c) => c.id === o[s].color));
})());

check('mặc món mới: thay đúng slot, GIỮ màu đang chọn, trả về cụm từ để đọc', (() => {
  const o = makeOutfit();
  recolorSlot(o, 'top', 'purple');
  const phrase = equipItem(o, 'top_dress');
  return o.top.item === 'top_dress' && o.top.color === 'purple'
    && phrase.en === 'purple dress' && phrase.vi.includes('tím');
})());

check('mặc món slot khác không đụng slot còn lại', (() => {
  const o = makeOutfit();
  const before = JSON.stringify(o.top);
  equipItem(o, 'shoes_boots');
  return o.shoes.item === 'shoes_boots' && JSON.stringify(o.top) === before;
})());

check('đổi màu slot: món giữ nguyên, cụm từ ghép "màu + món"', (() => {
  const o = makeOutfit();
  const phrase = recolorSlot(o, 'top', 'green');
  return o.top.item === 'top_tshirt' && o.top.color === 'green'
    && phrase.en === 'green T-shirt';
})());

check('id món/màu không tồn tại → trả null, bộ đồ không đổi', (() => {
  const o = makeOutfit();
  const before = serializeOutfit(o);
  return equipItem(o, 'khong_co') === null
    && recolorSlot(o, 'top', 'khong_co') === null
    && serializeOutfit(o) === before;
})());

check('"nothing" (bỏ phụ kiện) đọc là nothing, không ghép màu — thử cả 7 slot phụ kiện tuỳ chọn', (() => {
  const o = makeOutfit();
  return ['head_none', 'glasses_none', 'neck_none', 'ear_none', 'glove_none', 'sock_none', 'bag_none']
    .every((id) => equipItem(o, id).en === 'nothing');
})());

console.log('— Lưu / khôi phục / ngẫu nhiên —');

check('serialize → deserialize giữ nguyên bộ đồ', (() => {
  const o = makeOutfit();
  equipItem(o, 'top_dress');
  recolorSlot(o, 'hair', 'pink');
  const o2 = deserializeOutfit(serializeOutfit(o));
  return serializeOutfit(o2) === serializeOutfit(o);
})());

check('dữ liệu hỏng/lệch slot → rơi về bộ đồ khởi đầu an toàn', (() => {
  const bad = deserializeOutfit('{"hair":{"item":"top_dress","color":"red"}} hỏng');
  const bad2 = deserializeOutfit('{"hair":{"item":"top_dress","color":"red"}}');
  return serializeOutfit(bad) === serializeOutfit(makeOutfit())
    && bad2.hair.item === makeOutfit().hair.item; // top_dress không được nhét vào slot hair
})());

check('trộn ngẫu nhiên: đủ mọi slot hợp lệ, các seed khác nhau ra bộ khác nhau', (() => {
  const a = randomOutfit(seeded(1));
  const b = randomOutfit(seeded(9));
  const valid = (o) => SLOTS.every((s) => itemById(o[s].item)?.slot === s);
  return valid(a) && valid(b) && serializeOutfit(a) !== serializeOutfit(b);
})());

check('phraseFor ghép đúng mọi tổ hợp món × màu', (() => {
  for (const it of ITEMS) {
    if (it.id.endsWith('_none')) continue;
    for (const c of COLORS) {
      const p = phraseFor(it, c);
      if (p.en !== `${c.en} ${it.en}` || !p.vi.includes(c.vi)) return false;
    }
  }
  return true;
})());

console.log('— Phụ kiện đeo ĐỘC LẬP cùng lúc —');

check('đội mũ + đeo kính + vòng cổ + bông tai + găng tay + tất + túi CÙNG LÚC không đụng nhau', (() => {
  const o = makeOutfit();
  equipItem(o, 'head_crown');
  equipItem(o, 'glasses_sun');
  equipItem(o, 'neck_pearl');
  equipItem(o, 'ear_hoop');
  equipItem(o, 'glove_mitten');
  equipItem(o, 'sock_knee');
  equipItem(o, 'bag_backpack');
  return o.headwear.item === 'head_crown' && o.glasses.item === 'glasses_sun'
    && o.necklace.item === 'neck_pearl' && o.earrings.item === 'ear_hoop'
    && o.gloves.item === 'glove_mitten' && o.socks.item === 'sock_knee'
    && o.bag.item === 'bag_backpack'
    // vẫn giữ nguyên áo/quần/giày/tóc mặc định, không bị phụ kiện đè lên
    && o.top.item === 'top_tshirt' && o.hair.item === 'hair_short';
})());

check('BODY_PARTS đủ 11 bộ phận (thêm mũi/tai/cổ/tay/chân so với bản trước), id không trùng', (() => {
  const ids = new Set(BODY_PARTS.map((p) => p.id));
  return ids.size === BODY_PARTS.length && BODY_PARTS.length >= 11
    && ['nose', 'ears', 'neck', 'arms', 'legs'].every((id) => ids.has(id));
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
