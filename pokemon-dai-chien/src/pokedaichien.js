// Pokémon Đại Chiến: đấu theo lượt với sprite Pokémon thật, tái dùng kho ảnh có sẵn
// trong /pokemon/images/ (đã dùng cho game nối hình Onet — chỉ chạy offline/local).
// Bản mở rộng: 12 bạn khởi đầu (đủ dòng tiến hóa), ~40 Pokémon, CHỈ SỐ tấn công/phòng thủ
// ảnh hưởng sát thương, 7 hệ (thêm Đá), 8 trùm mạnh dần. Thuần logic, test độc lập.

// Vòng khắc chế đơn giản cho bé: Lửa > Cỏ, Cỏ > Nước+Đá, Nước > Lửa+Đá, Điện > Nước, Đá > Lửa+Điện.
// Hệ Thường/Siêu Linh/Rồng trung lập.
const BEATS = {
  fire: ['grass'],
  grass: ['water', 'rock'],
  water: ['fire', 'rock'],
  electric: ['water'],
  rock: ['fire', 'electric'],
};

// Mỗi Pokémon: num (số sprite), hệ, máu, ⚔️atk, 🛡️def, 2 chiêu — chiêu mạnh hồi lâu hơn về nhịp chơi.
export const POKEMON = {
  // ===== 12 bạn khởi đầu + các dạng tiến hóa =====
  pikachu: {
    num: 25, name: 'Pikachu', type: 'electric', maxHp: 44, atk: 11, def: 9, evolvesTo: 'raichu',
    moves: [{ name: 'Đánh Nhanh', power: 11 }, { name: 'Tia Điện', power: 19 }],
  },
  raichu: {
    num: 26, name: 'Raichu', type: 'electric', maxHp: 62, atk: 14, def: 11,
    moves: [{ name: 'Đấm Điện', power: 15 }, { name: 'Sấm Sét', power: 27 }],
  },
  charmander: {
    num: 4, name: 'Charmander', type: 'fire', maxHp: 42, atk: 11, def: 9, evolvesTo: 'charmeleon',
    moves: [{ name: 'Cào Cấu', power: 11 }, { name: 'Tàn Lửa', power: 19 }],
  },
  charmeleon: {
    num: 5, name: 'Charmeleon', type: 'fire', maxHp: 56, atk: 13, def: 10, evolvesTo: 'charizard',
    moves: [{ name: 'Vuốt Lửa', power: 14 }, { name: 'Hỏa Cầu', power: 24 }],
  },
  charizard: {
    num: 6, name: 'Charizard', type: 'fire', maxHp: 74, atk: 16, def: 12,
    moves: [{ name: 'Cánh Vụt', power: 17 }, { name: 'Phun Lửa', power: 31 }],
  },
  squirtle: {
    num: 7, name: 'Squirtle', type: 'water', maxHp: 44, atk: 10, def: 11, evolvesTo: 'wartortle',
    moves: [{ name: 'Húc Đầu', power: 11 }, { name: 'Vòi Nước', power: 19 }],
  },
  wartortle: {
    num: 8, name: 'Wartortle', type: 'water', maxHp: 58, atk: 12, def: 12, evolvesTo: 'blastoise',
    moves: [{ name: 'Cắn Mạnh', power: 14 }, { name: 'Bọt Sóng', power: 24 }],
  },
  blastoise: {
    num: 9, name: 'Blastoise', type: 'water', maxHp: 78, atk: 15, def: 14,
    moves: [{ name: 'Húc Mai', power: 17 }, { name: 'Đại Thủy Pháo', power: 31 }],
  },
  bulbasaur: {
    num: 1, name: 'Bulbasaur', type: 'grass', maxHp: 45, atk: 10, def: 10, evolvesTo: 'ivysaur',
    moves: [{ name: 'Quất Dây', power: 11 }, { name: 'Lá Sắc', power: 19 }],
  },
  ivysaur: {
    num: 2, name: 'Ivysaur', type: 'grass', maxHp: 59, atk: 12, def: 11, evolvesTo: 'venusaur',
    moves: [{ name: 'Dây Leo', power: 14 }, { name: 'Mưa Lá', power: 24 }],
  },
  venusaur: {
    num: 3, name: 'Venusaur', type: 'grass', maxHp: 78, atk: 15, def: 13,
    moves: [{ name: 'Roi Hoa', power: 17 }, { name: 'Bão Cánh Hoa', power: 31 }],
  },
  eevee: {
    num: 133, name: 'Eevee', type: 'normal', maxHp: 46, atk: 10, def: 10,
    evolvesTo: ['vaporeon', 'jolteon', 'flareon'], // tiến hóa ngẫu nhiên 1 trong 3 — bất ngờ vui
    moves: [{ name: 'Lao Tới', power: 12 }, { name: 'Vụt Đuôi', power: 18 }],
  },
  vaporeon: {
    num: 134, name: 'Vaporeon', type: 'water', maxHp: 70, atk: 14, def: 12,
    moves: [{ name: 'Sóng Nước', power: 16 }, { name: 'Thủy Triều', power: 28 }],
  },
  jolteon: {
    num: 135, name: 'Jolteon', type: 'electric', maxHp: 66, atk: 15, def: 11,
    moves: [{ name: 'Gai Điện', power: 16 }, { name: 'Phóng Điện', power: 28 }],
  },
  flareon: {
    num: 136, name: 'Flareon', type: 'fire', maxHp: 68, atk: 15, def: 11,
    moves: [{ name: 'Răng Lửa', power: 16 }, { name: 'Lửa Bùng', power: 28 }],
  },
  vulpix: {
    num: 37, name: 'Vulpix', type: 'fire', maxHp: 43, atk: 10, def: 9, evolvesTo: 'ninetales',
    moves: [{ name: 'Cắn Nhẹ', power: 11 }, { name: 'Lửa Xoáy', power: 18 }],
  },
  ninetales: {
    num: 38, name: 'Ninetales', type: 'fire', maxHp: 66, atk: 14, def: 12,
    moves: [{ name: 'Đuôi Quật', power: 15 }, { name: 'Hỏa Diễm Cửu Vĩ', power: 27 }],
  },
  growlithe: {
    num: 58, name: 'Growlithe', type: 'fire', maxHp: 45, atk: 11, def: 9, evolvesTo: 'arcanine',
    moves: [{ name: 'Cắn Xé', power: 12 }, { name: 'Phun Tàn Lửa', power: 19 }],
  },
  arcanine: {
    num: 59, name: 'Arcanine', type: 'fire', maxHp: 70, atk: 16, def: 11,
    moves: [{ name: 'Vồ Thần Tốc', power: 16 }, { name: 'Lửa Thần Khuyển', power: 29 }],
  },
  oddish: {
    num: 43, name: 'Oddish', type: 'grass', maxHp: 44, atk: 10, def: 10, evolvesTo: 'gloom',
    moves: [{ name: 'Rắc Phấn', power: 11 }, { name: 'Lá Bay', power: 18 }],
  },
  gloom: {
    num: 44, name: 'Gloom', type: 'grass', maxHp: 58, atk: 12, def: 11, evolvesTo: 'vileplume',
    moves: [{ name: 'Phấn Mê', power: 14 }, { name: 'Hương Say', power: 23 }],
  },
  vileplume: {
    num: 45, name: 'Vileplume', type: 'grass', maxHp: 74, atk: 15, def: 13,
    moves: [{ name: 'Cánh Hoa Xoáy', power: 17 }, { name: 'Bão Phấn Hoa', power: 30 }],
  },
  psyduck: {
    num: 54, name: 'Psyduck', type: 'water', maxHp: 44, atk: 10, def: 10, evolvesTo: 'golduck',
    moves: [{ name: 'Đập Cánh', power: 11 }, { name: 'Phun Nước', power: 18 }],
  },
  golduck: {
    num: 55, name: 'Golduck', type: 'water', maxHp: 68, atk: 14, def: 12,
    moves: [{ name: 'Chém Nước', power: 16 }, { name: 'Sóng Tâm Vịt', power: 28 }],
  },
  magikarp: {
    num: 129, name: 'Magikarp', type: 'water', maxHp: 48, atk: 8, def: 11, evolvesTo: 'gyarados',
    moves: [{ name: 'Quẫy Đuôi', power: 10 }, { name: 'Nhảy Vọt', power: 14 }],
  },
  jigglypuff: {
    num: 39, name: 'Jigglypuff', type: 'normal', maxHp: 50, atk: 9, def: 10, evolvesTo: 'wigglytuff',
    moves: [{ name: 'Vỗ Tay', power: 10 }, { name: 'Hát Ru', power: 16 }],
  },
  wigglytuff: {
    num: 40, name: 'Wigglytuff', type: 'normal', maxHp: 76, atk: 13, def: 12,
    moves: [{ name: 'Tát Đôi', power: 15 }, { name: 'Sóng Âm Ru Ngủ', power: 26 }],
  },
  dratini: {
    num: 147, name: 'Dratini', type: 'dragon', maxHp: 46, atk: 10, def: 10, evolvesTo: 'dragonair',
    moves: [{ name: 'Quấn Chặt', power: 11 }, { name: 'Sóng Rồng', power: 18 }],
  },
  dragonair: {
    num: 148, name: 'Dragonair', type: 'dragon', maxHp: 62, atk: 13, def: 12, evolvesTo: 'dragonite',
    moves: [{ name: 'Vụt Đuôi Rồng', power: 15 }, { name: 'Cuồng Phong', power: 25 }],
  },
  bellsprout: {
    num: 69, name: 'Bellsprout', type: 'grass', maxHp: 42, atk: 11, def: 8, evolvesTo: 'weepinbell',
    moves: [{ name: 'Quất Roi', power: 11 }, { name: 'Nọc Lá', power: 19 }],
  },
  weepinbell: {
    num: 70, name: 'Weepinbell', type: 'grass', maxHp: 56, atk: 13, def: 10, evolvesTo: 'victreebel',
    moves: [{ name: 'Táp Mạnh', power: 14 }, { name: 'Bào Tử Ngủ', power: 23 }],
  },
  victreebel: {
    num: 71, name: 'Victreebel', type: 'grass', maxHp: 72, atk: 16, def: 11,
    moves: [{ name: 'Nuốt Chửng', power: 17 }, { name: 'Mưa Bào Tử Độc', power: 30 }],
  },
  magnemite: {
    num: 81, name: 'Magnemite', type: 'electric', maxHp: 40, atk: 11, def: 12, evolvesTo: 'magneton',
    moves: [{ name: 'Húc Nam Châm', power: 11 }, { name: 'Sóng Từ Trường', power: 19 }],
  },
  magneton: {
    num: 82, name: 'Magneton', type: 'electric', maxHp: 60, atk: 15, def: 15,
    moves: [{ name: 'Đấm Kim Loại', power: 16 }, { name: 'Siêu Âm Điện Từ', power: 28 }],
  },
  tentacool: {
    num: 72, name: 'Tentacool', type: 'water', maxHp: 42, atk: 10, def: 11, evolvesTo: 'tentacruel',
    moves: [{ name: 'Vòi Quất', power: 11 }, { name: 'Bọt Độc', power: 18 }],
  },
  tentacruel: {
    num: 73, name: 'Tentacruel', type: 'water', maxHp: 64, atk: 13, def: 13,
    moves: [{ name: 'Xúc Tu Siết', power: 15 }, { name: 'Cơn Sóng Độc', power: 26 }],
  },
  drowzee: {
    num: 96, name: 'Drowzee', type: 'psychic', maxHp: 46, atk: 10, def: 10, evolvesTo: 'hypno',
    moves: [{ name: 'Thôi Miên', power: 11 }, { name: 'Sóng Tâm Trí', power: 19 }],
  },
  hypno: {
    num: 97, name: 'Hypno', type: 'psychic', maxHp: 66, atk: 14, def: 12,
    moves: [{ name: 'Lắc Lư Con Lắc', power: 16 }, { name: 'Ác Mộng', power: 27 }],
  },
  doduo: {
    num: 84, name: 'Doduo', type: 'normal', maxHp: 40, atk: 12, def: 8, evolvesTo: 'dodrio',
    moves: [{ name: 'Mổ Nhanh', power: 12 }, { name: 'Song Kích', power: 19 }],
  },
  dodrio: {
    num: 85, name: 'Dodrio', type: 'normal', maxHp: 60, atk: 16, def: 10,
    moves: [{ name: 'Tam Kích', power: 16 }, { name: 'Lốc Xoáy Lông', power: 27 }],
  },
  shellder: {
    num: 90, name: 'Shellder', type: 'water', maxHp: 40, atk: 11, def: 13, evolvesTo: 'cloyster',
    moves: [{ name: 'Cắn Vỏ Sò', power: 12 }, { name: 'Vòi Băng', power: 19 }],
  },
  cloyster: {
    num: 91, name: 'Cloyster', type: 'water', maxHp: 62, atk: 15, def: 17,
    moves: [{ name: 'Gai Băng', power: 16 }, { name: 'Đại Bác Vỏ Sò', power: 28 }],
  },
  // ===== Đối thủ (xếp từ dễ tới khó) =====
  meowth: {
    num: 52, name: 'Meowth', type: 'normal', maxHp: 40, atk: 10, def: 9,
    moves: [{ name: 'Cào Nhanh', power: 10 }, { name: 'Vồ Chuột', power: 16 }],
  },
  ekans: {
    num: 23, name: 'Ekans', type: 'grass', maxHp: 42, atk: 10, def: 9,
    moves: [{ name: 'Quấn Siết', power: 10 }, { name: 'Phun Nọc', power: 17 }],
  },
  sandshrew: {
    num: 27, name: 'Sandshrew', type: 'rock', maxHp: 44, atk: 10, def: 12,
    moves: [{ name: 'Cào Cát', power: 10 }, { name: 'Cuộn Tròn Lăn', power: 17 }],
  },
  poliwag: {
    num: 60, name: 'Poliwag', type: 'water', maxHp: 42, atk: 10, def: 9,
    moves: [{ name: 'Vẫy Đuôi', power: 10 }, { name: 'Bọt Khí', power: 17 }],
  },
  voltorb: {
    num: 100, name: 'Voltorb', type: 'electric', maxHp: 44, atk: 11, def: 10,
    moves: [{ name: 'Lăn Xẹt', power: 12 }, { name: 'Tia Chớp', power: 19 }],
  },
  persian: {
    num: 53, name: 'Persian', type: 'normal', maxHp: 56, atk: 13, def: 10,
    moves: [{ name: 'Vuốt Sắc', power: 14 }, { name: 'Cắn Trộm', power: 22 }],
  },
  arbok: {
    num: 24, name: 'Arbok', type: 'grass', maxHp: 60, atk: 13, def: 11,
    moves: [{ name: 'Siết Chặt', power: 14 }, { name: 'Nanh Độc', power: 24 }],
  },
  sandslash: {
    num: 28, name: 'Sandslash', type: 'rock', maxHp: 62, atk: 13, def: 14,
    moves: [{ name: 'Vuốt Đất', power: 14 }, { name: 'Bão Cát', power: 24 }],
  },
  poliwhirl: {
    num: 61, name: 'Poliwhirl', type: 'water', maxHp: 60, atk: 12, def: 11,
    moves: [{ name: 'Đấm Xoáy', power: 14 }, { name: 'Vòng Nước Xoay', power: 23 }],
  },
  horsea: {
    num: 116, name: 'Horsea', type: 'water', maxHp: 46, atk: 11, def: 10,
    moves: [{ name: 'Phun Khói Nước', power: 12 }, { name: 'Mực Xoáy', power: 19 }],
  },
  chansey: {
    num: 113, name: 'Chansey', type: 'normal', maxHp: 84, atk: 8, def: 12,
    moves: [{ name: 'Tát Nhẹ', power: 10 }, { name: 'Ném Trứng', power: 18 }],
  },
  scyther: {
    num: 123, name: 'Scyther', type: 'grass', maxHp: 60, atk: 15, def: 10,
    moves: [{ name: 'Lưỡi Cắt', power: 15 }, { name: 'Chém Gió', power: 24 }],
  },
  geodude: {
    num: 74, name: 'Geodude', type: 'rock', maxHp: 50, atk: 12, def: 14,
    moves: [{ name: 'Ném Đá', power: 13 }, { name: 'Lăn Đè', power: 21 }],
  },
  rhyhorn: {
    num: 111, name: 'Rhyhorn', type: 'rock', maxHp: 70, atk: 14, def: 15,
    moves: [{ name: 'Húc Sừng', power: 15 }, { name: 'Khoan Đá', power: 25 }],
  },
  seadra: {
    num: 117, name: 'Seadra', type: 'water', maxHp: 62, atk: 14, def: 12,
    moves: [{ name: 'Gai Nước', power: 15 }, { name: 'Bão Bong Bóng', power: 25 }],
  },
  electabuzz: {
    num: 125, name: 'Electabuzz', type: 'electric', maxHp: 66, atk: 15, def: 11,
    moves: [{ name: 'Đấm Sét', power: 16 }, { name: 'Phóng Điện Cao Thế', power: 27 }],
  },
  magmar: {
    num: 126, name: 'Magmar', type: 'fire', maxHp: 66, atk: 15, def: 11,
    moves: [{ name: 'Đấm Lửa', power: 16 }, { name: 'Nham Thạch', power: 27 }],
  },
  graveler: {
    num: 75, name: 'Graveler', type: 'rock', maxHp: 68, atk: 14, def: 16,
    moves: [{ name: 'Đá Tảng', power: 15 }, { name: 'Lăn Nghiền', power: 26 }],
  },
  poliwrath: {
    num: 62, name: 'Poliwrath', type: 'water', maxHp: 74, atk: 15, def: 13,
    moves: [{ name: 'Đấm Ngầm', power: 16 }, { name: 'Đại Vũ Xoáy', power: 28 }],
  },
  lapras: {
    num: 131, name: 'Lapras', type: 'water', maxHp: 82, atk: 13, def: 14,
    moves: [{ name: 'Sóng Băng', power: 16 }, { name: 'Khúc Ca Biển Sâu', power: 28 }],
  },
  golem: {
    num: 76, name: 'Golem', type: 'rock', maxHp: 80, atk: 16, def: 17,
    moves: [{ name: 'Đập Đá', power: 17 }, { name: 'Địa Chấn', power: 29 }],
  },
  venonat: {
    num: 48, name: 'Venonat', type: 'grass', maxHp: 44, atk: 10, def: 10,
    moves: [{ name: 'Cào Lông Tơ', power: 10 }, { name: 'Phấn Ngủ', power: 17 }],
  },
  venomoth: {
    num: 49, name: 'Venomoth', type: 'grass', maxHp: 58, atk: 13, def: 10,
    moves: [{ name: 'Cánh Phấn Độc', power: 14 }, { name: 'Bão Vảy Cánh', power: 24 }],
  },
  diglett: {
    num: 50, name: 'Diglett', type: 'rock', maxHp: 40, atk: 10, def: 9,
    moves: [{ name: 'Cào Đất', power: 10 }, { name: 'Chui Trốn', power: 16 }],
  },
  dugtrio: {
    num: 51, name: 'Dugtrio', type: 'rock', maxHp: 56, atk: 13, def: 10,
    moves: [{ name: 'Tam Trảo', power: 14 }, { name: 'Địa Chấn Ba Đầu', power: 23 }],
  },
  mankey: {
    num: 56, name: 'Mankey', type: 'normal', maxHp: 44, atk: 12, def: 8,
    moves: [{ name: 'Đấm Nhanh', power: 12 }, { name: 'Cào Điên Tiết', power: 18 }],
  },
  primeape: {
    num: 57, name: 'Primeape', type: 'normal', maxHp: 60, atk: 15, def: 10,
    moves: [{ name: 'Đấm Móc', power: 15 }, { name: 'Cơn Thịnh Nộ', power: 25 }],
  },
  slowpoke: {
    num: 79, name: 'Slowpoke', type: 'water', maxHp: 50, atk: 9, def: 10,
    moves: [{ name: 'Tát Chậm Rãi', power: 10 }, { name: 'Sóng Nước Ngái Ngủ', power: 17 }],
  },
  slowbro: {
    num: 80, name: 'Slowbro', type: 'water', maxHp: 72, atk: 13, def: 15,
    moves: [{ name: 'Càng Kẹp', power: 14 }, { name: 'Thủy Triều Tâm Trí', power: 25 }],
  },
  seel: {
    num: 86, name: 'Seel', type: 'water', maxHp: 48, atk: 10, def: 11,
    moves: [{ name: 'Húc Đầu Băng', power: 11 }, { name: 'Tia Nước Lạnh', power: 18 }],
  },
  dewgong: {
    num: 87, name: 'Dewgong', type: 'water', maxHp: 66, atk: 13, def: 13,
    moves: [{ name: 'Vây Băng', power: 14 }, { name: 'Bão Tuyết Biển', power: 25 }],
  },
  exeggcute: {
    num: 102, name: 'Exeggcute', type: 'grass', maxHp: 46, atk: 10, def: 11,
    moves: [{ name: 'Ném Trứng Lá', power: 11 }, { name: 'Bào Tử Ru Ngủ', power: 18 }],
  },
  exeggutor: {
    num: 103, name: 'Exeggutor', type: 'grass', maxHp: 74, atk: 16, def: 13,
    moves: [{ name: 'Búa Đầu Dừa', power: 17 }, { name: 'Quang Hợp Bùng Nổ', power: 29 }],
  },
  rhydon: {
    num: 112, name: 'Rhydon', type: 'rock', maxHp: 84, atk: 17, def: 18,
    moves: [{ name: 'Húc Sừng Khoan', power: 18 }, { name: 'Đại Địa Chấn', power: 30 }],
  },
  mew: {
    num: 151, name: 'Mew', type: 'psychic', maxHp: 72, atk: 15, def: 13,
    moves: [{ name: 'Tâm Kích', power: 16 }, { name: 'Quả Cầu Hồng', power: 28 }],
  },
  // ===== Trùm chốt màn, mạnh dần =====
  gyarados: {
    num: 130, name: 'Gyarados', type: 'water', maxHp: 76, atk: 16, def: 12,
    moves: [{ name: 'Cắn Sóng', power: 17 }, { name: 'Cuồng Lưu', power: 29 }],
  },
  gengar: {
    num: 94, name: 'Gengar', type: 'psychic', maxHp: 78, atk: 16, def: 12,
    moves: [{ name: 'Liếm Bóng', power: 17 }, { name: 'Bóng Đêm', power: 30 }],
  },
  snorlax: {
    num: 143, name: 'Snorlax', type: 'normal', maxHp: 92, atk: 15, def: 14,
    moves: [{ name: 'Đè Nặng', power: 16 }, { name: 'Ngáy Sấm', power: 28 }],
  },
  dragonite: {
    num: 149, name: 'Dragonite', type: 'dragon', maxHp: 86, atk: 17, def: 14,
    moves: [{ name: 'Vuốt Rồng', power: 18 }, { name: 'Thịnh Nộ Rồng', power: 31 }],
  },
  articuno: {
    num: 144, name: 'Articuno', type: 'water', maxHp: 88, atk: 16, def: 15,
    moves: [{ name: 'Gió Băng Giá', power: 18 }, { name: 'Bão Tuyết Vĩnh Cửu', power: 31 }],
  },
  zapdos: {
    num: 145, name: 'Zapdos', type: 'electric', maxHp: 88, atk: 17, def: 14,
    moves: [{ name: 'Cánh Sấm', power: 18 }, { name: 'Thiên Lôi Giáng', power: 32 }],
  },
  moltres: {
    num: 146, name: 'Moltres', type: 'fire', maxHp: 88, atk: 17, def: 14,
    moves: [{ name: 'Cánh Lửa', power: 18 }, { name: 'Hỏa Diệm Thiên', power: 32 }],
  },
  mewtwo: {
    num: 150, name: 'Mewtwo', type: 'psychic', maxHp: 96, atk: 18, def: 15,
    moves: [{ name: 'Sóng Tâm Linh', power: 19 }, { name: 'Cầu Bóng Tối', power: 34 }],
  },
  lugia: {
    num: 249, name: 'Lugia', type: 'psychic', maxHp: 100, atk: 18, def: 17,
    moves: [{ name: 'Cánh Bão Tố', power: 19 }, { name: 'Vực Thẳm Đại Dương', power: 34 }],
  },
  hooh: {
    num: 250, name: 'Ho-Oh', type: 'fire', maxHp: 100, atk: 19, def: 16,
    moves: [{ name: 'Cầu Vồng Rực Lửa', power: 20 }, { name: 'Phượng Hoàng Hỏa Thiêu', power: 35 }],
  },
};

export const STARTERS = [
  'pikachu', 'charmander', 'squirtle', 'bulbasaur', 'eevee', 'vulpix',
  'growlithe', 'oddish', 'psyduck', 'magikarp', 'jigglypuff', 'dratini',
  'bellsprout', 'magnemite', 'tentacool', 'drowzee', 'doduo', 'shellder',
];

/** Đối thủ thường, xếp sẵn từ dễ tới khó — màn càng cao lấy đoạn càng sâu. */
export const OPPONENT_POOL = [
  'meowth', 'ekans', 'sandshrew', 'venonat', 'diglett', 'poliwag', 'voltorb', 'mankey',
  'persian', 'arbok', 'sandslash', 'venomoth', 'dugtrio', 'poliwhirl', 'horsea', 'slowpoke',
  'seel', 'chansey', 'scyther', 'geodude', 'rhyhorn', 'exeggcute', 'slowbro', 'dewgong',
  'seadra', 'electabuzz', 'magmar', 'graveler', 'poliwrath', 'exeggutor', 'lapras', 'golem',
  'rhydon', 'mew',
];

/** Trùm trận cuối mỗi màn, mạnh dần (màn 9+ luôn là Mewtwo). */
export const BOSSES = [
  'gyarados', 'gengar', 'snorlax', 'dragonite', 'articuno', 'zapdos', 'moltres',
  'lugia', 'hooh', 'mewtwo',
];

/** Đường dẫn sprite thật trong kho /pokemon/images/ có sẵn của repo. */
export function spritePath(id) {
  return `/pokemon/images/pm${String(POKEMON[id].num).padStart(4, '0')}_00_00_00_big.png`;
}

/** Hệ tấn công khắc hệ phòng thủ → sát thương x1.5; bị khắc lại → x0.67; còn lại → x1. */
export function typeMultiplier(atkType, defType) {
  if ((BEATS[atkType] || []).includes(defType)) return 1.5;
  if ((BEATS[defType] || []).includes(atkType)) return 0.67;
  return 1;
}

/** Sát thương = lực chiêu × (⚔️atk / 🛡️def) × hệ khắc chế × dao động 85–115%. */
export function computeDamage(power, attacker, defender, rng) {
  const mult = typeMultiplier(attacker.type, defender.type);
  const statRatio = attacker.atk / defender.def;
  const variance = 0.85 + rng() * 0.3;
  return Math.max(1, Math.round(power * statRatio * mult * variance));
}

/** Đối thủ AI: nếu hệ mình khắc được người chơi thì dùng chiêu mạnh nhất, không thì ngẫu nhiên. */
function pickEnemyMoveIndex(defDef, atkDef, rng) {
  if (typeMultiplier(defDef.type, atkDef.type) > 1) return defDef.moves.length - 1;
  return Math.floor(rng() * defDef.moves.length);
}

export function makeBattle(playerId, enemyId, startHp, isBoss = false) {
  const playerMax = POKEMON[playerId].maxHp;
  return {
    player: { id: playerId, hp: startHp == null ? playerMax : Math.min(playerMax, startHp) },
    enemy: { id: enemyId, hp: POKEMON[enemyId].maxHp },
    isBoss,
    turn: 0,
    log: [],
    over: false,
    won: false,
  };
}

/** Người chơi ra chiêu `moveIndex`; nếu địch chưa gục thì địch phản đòn ngay trong cùng lượt. */
export function useMove(battle, moveIndex, rng = Math.random) {
  if (battle.over) return null;
  const atkDef = POKEMON[battle.player.id];
  const defDef = POKEMON[battle.enemy.id];
  const move = atkDef.moves[moveIndex];
  if (!move) return null;

  const dmgToEnemy = computeDamage(move.power, atkDef, defDef, rng);
  battle.enemy.hp = Math.max(0, battle.enemy.hp - dmgToEnemy);
  const turnLog = [{
    side: 'player', move: move.name, power: move.power, dmg: dmgToEnemy,
    effective: typeMultiplier(atkDef.type, defDef.type),
  }];

  if (battle.enemy.hp <= 0) {
    battle.over = true;
    battle.won = true;
    battle.turn++;
    battle.log.push(...turnLog);
    return { log: turnLog };
  }

  const enemyMoveIdx = pickEnemyMoveIndex(defDef, atkDef, rng);
  const enemyMove = defDef.moves[enemyMoveIdx];
  const dmgToPlayer = computeDamage(enemyMove.power, defDef, atkDef, rng);
  battle.player.hp = Math.max(0, battle.player.hp - dmgToPlayer);
  turnLog.push({
    side: 'enemy', move: enemyMove.name, power: enemyMove.power, dmg: dmgToPlayer,
    effective: typeMultiplier(defDef.type, atkDef.type),
  });

  if (battle.player.hp <= 0) {
    battle.over = true;
    battle.won = false;
  }

  battle.turn++;
  battle.log.push(...turnLog);
  return { log: turnLog };
}

function shuffle(arr, rng) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Chuỗi trận của 1 màn: (2 + số màn) đối thủ thường lấy từ đoạn pool khó dần + 1 trùm chốt màn.
 * Thắng trận được hồi 40% máu; thắng trận thứ 1 và thứ 3 thì TIẾN HÓA (nếu còn dạng sau):
 * đổi sang Pokémon mạnh hơn và hồi đầy máu.
 */
export function makeCampaign(starterId, levelIndex, rng = Math.random) {
  const normalRounds = Math.min(OPPONENT_POOL.length, 2 + levelIndex);
  const start = Math.min(levelIndex * 2, OPPONENT_POOL.length - normalRounds);
  const window = OPPONENT_POOL.slice(start, start + normalRounds + 3);
  const picked = shuffle(window, rng).slice(0, normalRounds)
    .sort((a, b) => OPPONENT_POOL.indexOf(a) - OPPONENT_POOL.indexOf(b));
  const boss = BOSSES[Math.min(levelIndex, BOSSES.length - 1)];
  const opponents = [...picked, boss];
  return {
    level: levelIndex,
    playerId: starterId,
    opponents,
    roundIndex: 0,
    wins: 0,
    battle: makeBattle(starterId, opponents[0]),
    over: false,
    won: false,
  };
}

/** Tiến hóa nếu còn dạng sau. Eevee tiến hóa ngẫu nhiên 1 trong 3 nhánh. Trả về id mới hoặc null. */
function tryEvolve(campaign, rng) {
  const next = POKEMON[campaign.playerId].evolvesTo;
  if (!next) return null;
  campaign.playerId = Array.isArray(next) ? next[Math.floor(rng() * next.length)] : next;
  return campaign.playerId;
}

/**
 * Gọi sau khi 1 trận kết thúc. Thua → cả chuỗi thua. Thắng trận cuối → cả chuỗi thắng.
 * Còn đối thủ → trả về { battle, evolvedTo } (evolvedTo = id mới nếu vừa tiến hóa, ngược lại null).
 */
export function advanceCampaign(campaign, rng = Math.random) {
  if (!campaign.battle.over || campaign.over) return null;
  if (!campaign.battle.won) {
    campaign.over = true;
    campaign.won = false;
    return null;
  }
  campaign.wins++;
  campaign.roundIndex++;
  if (campaign.roundIndex >= campaign.opponents.length) {
    campaign.over = true;
    campaign.won = true;
    return null;
  }
  let evolvedTo = null;
  let hp;
  if (campaign.wins === 1 || campaign.wins === 3) evolvedTo = tryEvolve(campaign, rng);
  if (evolvedTo) {
    hp = POKEMON[campaign.playerId].maxHp; // tiến hóa → hồi đầy máu
  } else {
    const maxHp = POKEMON[campaign.playerId].maxHp;
    hp = Math.min(maxHp, campaign.battle.player.hp + Math.round(maxHp * 0.4));
  }
  const nextId = campaign.opponents[campaign.roundIndex];
  const isBoss = campaign.roundIndex === campaign.opponents.length - 1;
  campaign.battle = makeBattle(campaign.playerId, nextId, hp, isBoss);
  return { battle: campaign.battle, evolvedTo };
}
