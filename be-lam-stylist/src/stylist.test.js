// Unit test cho Bé Làm Stylist. Chạy: node src/stylist.test.js

import {
  SLOTS, COLORS, ITEMS, BODY_PARTS, CHARACTERS, PROFESSIONS,
  itemById, colorById, itemsForSlot, makeOutfit, equipItem, recolorSlot,
  phraseFor, serializeOutfit, deserializeOutfit, randomOutfit,
  characterById, applyCharacter, professionById, applyProfession,
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

console.log('— Chọn nhanh nhân vật (bé trai/gái, người lớn nam/nữ, ông/bà) —');

check('6 nhân vật: id duy nhất, đủ icon/tên EN+VI, hair/top/bottom trỏ đúng ITEMS + màu hợp lệ (kể cả glasses nếu có)', (() => {
  const ids = new Set(CHARACTERS.map((c) => c.id));
  return ids.size === CHARACTERS.length && CHARACTERS.length === 6
    && CHARACTERS.every((c) => c.icon && c.en && c.vi
      && itemById(c.hair)?.slot === 'hair' && itemById(c.top)?.slot === 'top' && itemById(c.bottom)?.slot === 'bottom'
      && COLORS.some((col) => col.id === c.hairColor)
      && COLORS.some((col) => col.id === c.topColor)
      && COLORS.some((col) => col.id === c.bottomColor)
      && (!c.glasses || (itemById(c.glasses)?.slot === 'glasses' && COLORS.some((col) => col.id === c.glassesColor))))
    && ['man', 'woman', 'grandpa', 'grandma'].every((id) => ids.has(id)); // đủ 4 nhân vật mới thêm
})());

check('applyCharacter: đổi đúng tóc/áo/quần theo preset, KHÔNG đụng giày/phụ kiện đang có', (() => {
  const o = makeOutfit();
  equipItem(o, 'shoes_boots');
  equipItem(o, 'head_crown');
  const before = { shoes: JSON.stringify(o.shoes), headwear: JSON.stringify(o.headwear) };
  const applied = applyCharacter(o, 'boy');
  const boy = characterById('boy');
  return applied.id === 'boy'
    && o.hair.item === boy.hair && o.hair.color === boy.hairColor
    && o.top.item === boy.top && o.top.color === boy.topColor
    && o.bottom.item === boy.bottom && o.bottom.color === boy.bottomColor
    && JSON.stringify(o.shoes) === before.shoes && JSON.stringify(o.headwear) === before.headwear;
})());

check('applyCharacter: nhân vật có kính (ông/bà) còn đổi CẢ kính theo preset', (() => {
  const o = makeOutfit();
  applyCharacter(o, 'grandpa');
  const grandpa = characterById('grandpa');
  return o.glasses.item === grandpa.glasses && o.glasses.color === grandpa.glassesColor;
})());

check('characterById: id lạ rơi về nhân vật đầu tiên (an toàn)', (() => characterById('khong_co').id === CHARACTERS[0].id));

console.log('— Khoác trang phục nghề nghiệp (chỉ đổi áo + mũ nếu có) —');

check('9 nghề nghiệp: id duy nhất, đủ icon/tên EN+VI, top trỏ đúng ITEMS + màu hợp lệ, headwear (nếu có) cũng vậy', (() => {
  const ids = new Set(PROFESSIONS.map((p) => p.id));
  return ids.size === PROFESSIONS.length && PROFESSIONS.length === 9
    && PROFESSIONS.every((p) => p.icon && p.en && p.vi
      && itemById(p.top)?.slot === 'top' && COLORS.some((c) => c.id === p.topColor)
      && (p.headwear === null || itemById(p.headwear)?.slot === 'headwear'))
    && ['pilot', 'farmer', 'singer'].every((id) => ids.has(id)); // đủ 3 nghề mới thêm
})());

check('applyProfession: đổi ĐÚNG áo (và mũ nếu nghề có mũ), KHÔNG đụng tóc/quần/giày/phụ kiện khác', (() => {
  const o = makeOutfit();
  equipItem(o, 'bottom_skirt');
  equipItem(o, 'shoes_boots');
  const before = { hair: JSON.stringify(o.hair), bottom: JSON.stringify(o.bottom), shoes: JSON.stringify(o.shoes) };
  const phrase = applyProfession(o, 'chef');
  const chef = professionById('chef');
  return phrase.en === chef.en && o.top.item === chef.top && o.top.color === chef.topColor
    && o.headwear.item === chef.headwear
    && JSON.stringify(o.hair) === before.hair && JSON.stringify(o.bottom) === before.bottom && JSON.stringify(o.shoes) === before.shoes;
})());

check('applyProfession: nghề KHÔNG có mũ riêng (bác sĩ) thì giữ nguyên mũ đang đội', (() => {
  const o = makeOutfit();
  equipItem(o, 'head_crown');
  applyProfession(o, 'doctor');
  return o.headwear.item === 'head_crown';
})());

check('applyProfession: id không tồn tại trả về null, bộ đồ không đổi', (() => {
  const o = makeOutfit();
  const before = serializeOutfit(o);
  return applyProfession(o, 'khong_co') === null && serializeOutfit(o) === before;
})());

check('professionById: id lạ trả về null (không rơi về mặc định như characterById)', (() => professionById('khong_co') === null));

check('3 nghề mới (phi công/nông dân/ca sĩ): phi công + nông dân có mũ riêng, ca sĩ không có mũ nên giữ nguyên mũ đang đội', (() => {
  const o = makeOutfit();
  equipItem(o, 'head_crown');
  const pilot = applyProfession(o, 'pilot');
  const okPilot = pilot.en === 'pilot' && o.top.item === 'top_pilot' && o.headwear.item === 'head_pilotcap';
  const farmer = applyProfession(o, 'farmer');
  const okFarmer = farmer.en === 'farmer' && o.top.item === 'top_farmer' && o.headwear.item === 'head_strawhat';
  equipItem(o, 'head_crown');
  const singer = applyProfession(o, 'singer');
  const okSinger = singer.en === 'singer' && o.top.item === 'top_singer' && o.headwear.item === 'head_crown';
  return okPilot && okFarmer && okSinger;
})());

console.log(`\nKết quả: ${passed} pass, ${failed} fail`);
if (failed > 0) process.exit(1);
