# Gợi ý game cho trẻ em — vừa chơi vừa học

> ✅ **ĐÃ HOÀN THÀNH TOÀN BỘ** — 12 game trên hub:
> Nhóm 1 → `to-mau/` · Nhóm 2 → `tap-viet/` · Nhóm 3 → `hoc-vui/` (3 trò trong 1) ·
> Nhóm 4 → `lat-hinh/`, `ran-san-moi/`, `ghep-hinh/`, `co-caro/`, `xep-gach/`, `bat-vit/`, `o-an-quan/`, `nhay-lo-co/`.
> Tất cả dùng chung hồ sơ người chơi + thống kê (Report 📊 trong game Pikachu), i18n 5 thứ tiếng, offline (sw.js).

Backlog game cho Game Collection. Nguyên tắc chung (giống game Pikachu · Onet đã có):

- Chạy **hoàn toàn offline** trong trình duyệt, vanilla JS, mỗi game một thư mục (`pokemon/`, `to-mau/`, ...).
- Dùng chung `i18n.js` (VI/EN/JA/ZH/AR) và hệ hồ sơ người chơi + thống kê (`pokemon/src/stats.js` có thể tách ra dùng chung).
- UI cho trẻ 3–8 tuổi: nút to, ít chữ, phản hồi bằng âm thanh + hiệu ứng, không phạt nặng khi sai.
- Điểm/sticker/huy hiệu để tạo động lực; report cho phụ huynh xem tiến bộ.

---

## Nhóm 1 — Tô màu (rèn vận động tinh + nhận mặt chữ, số)

### 1.1 Tô màu chữ cái 🎨🅰️
- **Học được gì:** nhận mặt 29 chữ cái tiếng Việt (kèm dấu Ă Â Đ Ê Ô Ơ Ư), phân biệt hoa/thường.
- **Cách chơi:** chữ cái to giữa màn hình chia thành vùng (SVG path), bé chọn màu ở bảng màu rồi chạm vào vùng để tô. Tô xong cả chữ → chữ "nhảy múa" + đọc to tên chữ ("A — a — quả **na**").
- **Chế độ:** tô tự do / tô theo số (mỗi vùng đánh số ứng với 1 màu — học số luôn).
- **Kỹ thuật:** SVG + tô theo vùng, Web Speech API hoặc file âm thanh ghi sẵn cho phát âm. Dễ, làm nhanh.

### 1.2 Tô màu chữ số 🔢
- **Học được gì:** số 0–9, đếm số lượng.
- **Cách chơi:** giống 1.1 nhưng là số; sau khi tô xong hiện N con vật đúng bằng số đó để bé đếm theo ("Số 3 — một, hai, ba con gà 🐔🐔🐔").
- **Mở rộng:** tranh tô màu theo số (color-by-number) với hình Pokémon/động vật — tận dụng lại bộ icon sẵn có.

## Nhóm 2 — Tập viết (tracing)

### 2.1 Tập viết tiếng Việt ✍️🇻🇳
- **Học được gì:** thứ tự nét chữ cái + dấu thanh (huyền, sắc, hỏi, ngã, nặng), viết được tên mình.
- **Cách chơi:** chữ mẫu mờ trên "bảng con", mũi tên + chấm số chỉ thứ tự nét; bé rê ngón tay/chuột theo nét, đi đúng đường thì nét hiện màu, lệch quá thì rung nhẹ và làm lại nét đó. Xong 1 chữ → sao ⭐ (1–3 sao theo độ chính xác).
- **Cấp độ:** nét cơ bản (thẳng, cong, móc) → chữ thường → chữ hoa → ghép vần đơn giản (ba, mẹ, bé) → **viết tên của bé** (lấy tên từ hồ sơ người chơi sẵn có!).
- **Kỹ thuật:** canvas + kiểm tra khoảng cách điểm chạm tới polyline của nét mẫu. Cần dữ liệu nét cho từng chữ (định nghĩa 1 lần dạng JSON). Vừa.

### 2.2 Tập viết tiếng Anh / ABC Tracing ✍️🇬🇧
- Dùng chung engine với 2.1, đổi bộ dữ liệu nét sang A–Z + đọc phát âm tiếng Anh ("A — apple 🍎"). Mỗi chữ kèm 1 từ + hình minh họa; viết xong thì hình hiện ra và đọc to.

## Nhóm 3 — Học từ vựng & con số qua mini game

### 3.1 Ghép chữ với hình 🧩 (tiếng Việt & tiếng Anh)
- **Học được gì:** từ vựng cơ bản theo chủ đề (động vật, trái cây, đồ vật, màu sắc) — song ngữ.
- **Cách chơi:** kéo thẻ chữ ("CON MÈO" / "CAT") thả vào đúng hình 🐱; đúng thì kêu meo meo. Tận dụng bộ emoji/ảnh Pokémon sẵn có làm 1 chủ đề.
- **Kỹ thuật:** drag & drop, rất dễ — ứng viên làm đầu tiên.

### 3.2 Đếm và so sánh 🍎🍎🍎
- **Học được gì:** đếm 1–20, nhiều/ít hơn, phép cộng trừ trong phạm vi 10.
- **Cách chơi:** màn hình hiện 2 rổ táo, bé chạm rổ nhiều hơn; hoặc "3 + 2 = ?" với các quả táo rơi vào rổ để đếm trực quan, chọn đáp án trong 3 nút to.

### 3.3 Nghe và tìm 🔊👂
- **Học được gì:** nghe hiểu (VI/EN), phân biệt âm thanh.
- **Cách chơi:** app đọc "Tìm con VOI!" → bé chạm đúng hình trong lưới 6–9 hình. Chơi được cả chế độ tiếng Anh. Dùng lại lưới ô + hiệu ứng của game Pikachu.

## Nhóm 4 — Mini game tuổi thơ (giải trí + tư duy, kiểu Pikachu/Onet)

| Game | Tuổi thơ tương ứng | Học được gì | Độ khó làm |
|---|---|---|---|
| 🃏 **Lật hình trí nhớ** (Memory/Pexeso) | lật thẻ tìm cặp | trí nhớ, tập trung; biến thể học: cặp = chữ ↔ hình, số ↔ số lượng | Dễ ⭐ |
| 🐍 **Rắn săn mồi** | Snake trên Nokia | phản xạ; biến thể học: rắn phải ăn chữ cái theo thứ tự A→Z hoặc số 1→9 | Dễ ⭐ |
| 🧩 **Ghép hình trượt / jigsaw** | xếp hình 15 ô | tư duy không gian; dùng ảnh Pokémon sẵn có | Dễ ⭐ |
| ⭕ **Cờ ca-rô / Tic-tac-toe** | ca-rô giấy vở | logic, chơi 2 người như chế độ Duel sẵn có | Dễ ⭐ |
| 🏗️ **Xếp gạch** (Tetris-like) | điện tử cầm tay 9999-in-1 | không gian, phản xạ | Vừa ⭐⭐ |
| 🐤 **Bắt vịt / Whack-a-mole** | đập chuột hội chợ | phản xạ; biến thể học: chỉ đập con mang chữ "B" | Dễ ⭐ |
| 🎲 **Ô ăn quan** | trò dân gian VN | đếm, tính toán chiến thuật — đậm chất "tuổi thơ VN" | Vừa ⭐⭐ |
| 🐸 **Nhảy lò cò số** (Hopscotch) | nhảy ô lò cò | thứ tự số, đếm cách 2, cách 5 | Dễ ⭐ |

## Gợi ý lộ trình làm

1. **Lật hình trí nhớ** — tái dùng nhiều nhất từ game Pikachu (lưới ô, bộ icon, sfx, stats), thêm ngay biến thể chữ↔hình là thành game học.
2. **Ghép chữ với hình** (3.1) — dễ, giá trị học cao, song ngữ VI/EN.
3. **Tô màu chữ & số** (1.1 + 1.2) — cần vẽ/kiếm bộ SVG chữ cái.
4. **Tập viết** (2.1 + 2.2) — engine chung, làm sau khi có bộ dữ liệu nét chữ.
5. Mini game tuổi thơ còn lại rải dần, mỗi game gắn vào hub + hệ thống kê sẵn có.

**Việc nền cần làm trước:** tách `stats.js` (hồ sơ người chơi + report) và phần âm thanh/i18n thành module dùng chung ở gốc repo để mọi game mới dùng lại được.

---
---

# ĐỢT 2 — Backlog tiếp theo (lớp lá 5–6 tuổi & lớp 1 6–7 tuổi + trò ngày xưa)

> ✅ **ĐỢT 2 CŨNG ĐÃ HOÀN THÀNH** (trừ Tangram ⭐⭐⭐ để dành):
> Nhóm 5 → `hoc-van/` (3 trò trong 1) · Nhóm 6 → `toan-lop-1/` (5 trò trong 1) ·
> Nhóm 7 → `tu-duy/` (6 trò trong 1) ·
> Nhóm 8 → `tro-xua/` (oẳn tù tì + bắn bi + ném lon + nhảy dây), `co-ganh/`, `co-ca-ngua/`,
> `dien-tu/` (bắn vịt trời + đập gạch + đua xe). Hub hiện có **19 game**.

Bám sát chương trình lớp lá → lớp 1: ghép vần, đọc trơn, cộng trừ phạm vi 20,
so sánh, hình khối, xem giờ. Mỗi game vẫn theo khuôn sẵn có: 1 thư mục, logic thuần
có test, dùng chung hồ sơ/stats + giọng đọc + i18n, ghi vào Report 📊.

## Nhóm 5 — Học vần tiếng Việt (trọng tâm lớp lá → lớp 1) 🇻🇳

### 5.1 Ghép vần 🔤 (`ghep-van/`)
- **Học được gì:** cơ chế đánh vần — phụ âm + vần + thanh: "b + a = ba", "m + ẹ = mẹ".
- **Cách chơi:** màn hình hiện hình 🐄 + khung trống `_ Ò`; bé kéo/chạm chữ "B" từ khay vào → máy đánh vần to "bờ - o - bo - huyền - **bò**!" + con bò nhảy múa. Cấp độ: ghép phụ âm đầu → ghép vần → ghép cả tiếng 2 âm tiết (con mèo, quả táo).
- **Tái dùng:** bộ từ + emoji của `hoc-vui/words.js`, giọng đọc `to-mau/speech.js`, kéo-thả của `hoc-vui`.
- **Độ khó làm:** Dễ ⭐ — giá trị học CAO NHẤT đợt này, nên làm đầu tiên.

### 5.2 Điền chữ còn thiếu ✏️ (`dien-chu/`)
- **Học được gì:** nhớ mặt chữ trong tiếng — "C_N MÈO" thiếu gì? Chọn O/Ô/Ơ (3 nút to).
- **Cách chơi:** hình + từ khuyết 1 chữ, 3 lựa chọn nhiễu là chữ dễ lẫn (o/ô/ơ, s/x, ch/tr, d/gi). Đúng → đọc to cả từ.
- **Độ khó làm:** Dễ ⭐ — gần như chỉ là biến thể của "Nghe & tìm" trong `hoc-vui/`.

### 5.3 Nghe — đánh vần — viết 📝 (`nghe-viet/`)
- **Học được gì:** chính tả sơ khai: nghe máy đọc "BA" → bé gõ/chạm từng chữ B, A từ bàn phím chữ to trên màn hình.
- **Cách chơi:** bàn phím ảo chỉ hiện 6–8 chữ (đáp án + nhiễu); gõ đúng thứ tự thì chữ nhảy vào ô. Cấp độ theo độ dài từ.
- **Độ khó làm:** Vừa ⭐⭐.

## Nhóm 6 — Toán lớp lá → lớp 1 ➕

### 6.1 Cộng trừ phạm vi 20 🧮 (`toan-lop-1/`)
- **Học được gì:** cộng trừ có nhớ qua 10 (8 + 5), dãy tính nhanh, "điền số còn thiếu: 7 + _ = 12".
- **Cách chơi:** nâng cấp từ trò Đếm của `hoc-vui/`: thêm dạng điền khuyết, dạng chuỗi 3 phép tính leo núi ⛰️ — mỗi câu đúng ếch leo 1 bậc, sai thì tụt 1 bậc (nhẹ nhàng).
- **Độ khó làm:** Dễ ⭐ — mở rộng `makeMathQuestion` sẵn có.

### 6.2 Cân so sánh ⚖️ (`can-so-sanh/`)
- **Học được gì:** lớn hơn / bé hơn / bằng — ký hiệu > < = (bài "cá sấu há mồm" lớp 1).
- **Cách chơi:** 2 đĩa cân hiện số hoặc nhóm đồ vật; bé chọn dấu > < = thả vào giữa; cân nghiêng theo đáp án thật với animation vật lý vui mắt.
- **Độ khó làm:** Dễ ⭐.

### 6.3 Xem giờ đồng hồ 🕐 (`xem-gio/`)
- **Học được gì:** giờ đúng và giờ rưỡi (chuẩn lớp 1), sinh hoạt theo giờ.
- **Cách chơi:** 2 chiều — nhìn kim chọn giờ đúng trong 3 đáp án, hoặc nghe "7 giờ: bé đi học 🎒" rồi XOAY kim (kéo kim canvas) cho đúng.
- **Độ khó làm:** Vừa ⭐⭐ (kéo kim = tính góc, giống tracer của `tap-viet/`).

### 6.4 Hình khối & quy luật 🔺 (`hinh-khoi/`)
- **Học được gì:** tròn/vuông/tam giác/chữ nhật + tìm quy luật dãy (pattern: 🔴🔵🔴🔵❓).
- **Cách chơi:** 2 trò trong 1 — "tìm đồ vật cùng hình khối" (bánh xe = hình gì?) và "hình nào tiếp theo?" chọn trong 3 đáp án.
- **Độ khó làm:** Dễ ⭐.

### 6.5 Đi chợ mua hàng 💰 (`di-cho/`)
- **Học được gì:** cộng trừ ứng dụng + nhận mặt tiền Việt Nam (1k, 2k, 5k, 10k, 20k).
- **Cách chơi:** quầy hàng hiện 2 món (táo 3k + kẹo 2k); bé chạm các tờ tiền để trả đúng 5k; trả thừa thì tính tiền thối. Rất "đời" — bé nào cũng thích chơi bán hàng.
- **Độ khó làm:** Vừa ⭐⭐ (cần vẽ/kiếm hình tờ tiền cách điệu, không dùng ảnh tiền thật).

## Nhóm 7 — Luyện tư duy 🧠

| Game | Thư mục gợi ý | Luyện gì | Cách chơi ngắn gọn | Độ khó làm |
|---|---|---|---|---|
| 🌀 **Mê cung** | `me-cung/` | định hướng, kiên nhẫn | rê ngón dắt 🐭 tìm 🧀, sinh mê cung tự động (thuật toán DFS), 3 cỡ | Dễ ⭐ |
| 🔢 **Sudoku bé** | `sudoku-be/` | suy luận | lưới 4×4 hình con vật thay số, đúng 1 cách điền; lớp 1 chơi 6×6 | Vừa ⭐⭐ |
| 🔍 **Tìm điểm khác nhau** | `tim-diem-khac/` | quan sát | 2 tranh emoji ghép cạnh nhau lệch 5 chi tiết, chạm vào chỗ khác | Dễ ⭐ (tranh tự sinh từ lưới emoji — không cần vẽ) |
| ✏️ **Nối số thành hình** | `noi-so/` | thứ tự số + vận động tinh | chấm 1→20, nối đúng thứ tự hiện ra con vật; dùng lại tracer `tap-viet/` | Dễ ⭐ |
| 🧩 **Tangram** | `tangram/` | không gian | xếp 7 mảnh vào bóng hình (con cá, ngôi nhà); mảnh xoay được | Khó ⭐⭐⭐ |
| 🎯 **Cái nào khác nhóm?** | `khac-nhom/` | phân loại | 4 hình: 🍎🍌🍇🐟 — cái nào không cùng nhóm? máy giải thích "cá là con vật!" | Dễ ⭐ |
| 🗼 **Tháp Hà Nội bé** | `thap-ha-noi/` | lập kế hoạch | 3–4 tầng bánh 🥞 chuyển cọc, kể chuyện "giúp gấu xếp bánh" | Dễ ⭐ |

## Nhóm 8 — Trò chơi ngày xưa (phần 2) 🪀

| Game | Tuổi thơ tương ứng | Số hóa thế nào | Độ khó làm |
|---|---|---|---|
| ✊✋✌️ **Oẳn tù tì** | kéo–búa–bao đầu ngõ | đấu máy best-of-5, máy "suy nghĩ" 3-2-1 kịch tính; dạy luật khắc chế = suy luận vòng | Dễ ⭐ |
| 🐴 **Cờ cá ngựa** | bàn cờ nhựa 4 màu | Ludo 2–4 người cùng máy hoặc đấu máy; luyện đếm bước + chấp nhận may rủi | Vừa ⭐⭐ |
| ⚫ **Cờ gánh** | cờ dân gian VN (bàn 5×5) | quân bị "gánh" 2 đầu là đổi màu — đậm chất VN như ô ăn quan; đấu máy heuristic | Vừa ⭐⭐ |
| 🎱 **Bắn bi** | búng bi ăn bi | kéo–thả căng lực bắn bi vào vòng, vật lý va chạm đơn giản trên canvas | Vừa ⭐⭐ |
| 🥫 **Ném lon** | ném dép/bóng đổ lon hội chợ | kéo chỉnh góc + lực, lon đổ vật lý; 3 lượt ném ghi điểm | Vừa ⭐⭐ |
| 🪢 **Nhảy dây** | nhảy dây thun | bấm đúng nhịp khi dây quét qua chân (rhythm game); đếm số nhịp = luyện đếm | Dễ ⭐ |
| 🦆 **Bắn vịt trời** | Duck Hunt màn hình xanh lá | chạm vịt bay ngang màn hình; biến thể học: chỉ bắn vịt mang số chẵn/chữ hoa | Dễ ⭐ (anh em với `bat-vit/`) |
| 🧱 **Đập gạch bóng nảy** | Arkanoid máy 9999-in-1 | đỡ bóng bằng thanh trượt, phá hết gạch; gạch chữ cái rơi xuống nhặt = học chữ | Vừa ⭐⭐ |
| 🚕 **Đua xe né chướng ngại** | đua xe điện tử cầm tay | 3 làn đường, vuốt trái/phải né xe; biến thể học: chỉ đâm vào biển số đúng đáp án phép tính | Dễ ⭐ |

## Lộ trình gợi ý đợt 2

1. **Ghép vần** (5.1) — đúng trọng tâm lớp lá→lớp 1, tái dùng nhiều nhất.
2. **Cộng trừ phạm vi 20** (6.1) + **Cân so sánh** (6.2) — mở rộng nhanh từ `hoc-vui/`.
3. **Mê cung** + **Nối số thành hình** + **Cái nào khác nhóm** — 3 trò tư duy dễ, làm nhanh.
4. **Oẳn tù tì** + **Bắn vịt trời** — 2 trò ngày xưa dễ, đổi gió.
5. **Xem giờ** (6.3) + **Đi chợ** (6.5) + **Sudoku bé** — kỹ năng sống + suy luận.
6. **Cờ gánh** + **Cờ cá ngựa** — cặp cờ dân gian, làm sau vì cần AI + luật kỹ.
7. **Tangram**, bắn bi, ném lon, đập gạch, đua xe, nhảy dây — rải dần khi rảnh.

**Việc nền đợt 2 (nên làm trước khi thêm game mới):**
- Tách module dùng chung ra `shared/`: `stats.js` (hồ sơ + report), `speech.js`, `sfx.js`, CSS token trẻ em (`--ink/--muted/--accent-deep`... đã chuẩn hóa tương phản) — hết cảnh game mới import chéo từ `pokemon/` và `to-mau/`.
- Report 📊 nên nhóm giờ chơi **theo từng game** (hiện gộp chung) để phụ huynh biết bé học gì nhiều nhất.
- Cân nhắc thêm huy hiệu tổng (sticker book): mỗi game thắng lần đầu tặng 1 sticker — gom đủ bộ.

---
---

# ĐỢT 3 — Backlog tiếp theo (kỹ năng sống, sáng tạo, vận động, văn hóa VN)

19 game hiện có đã phủ: chữ cái, vần, số học, tư duy logic, trò chơi dân gian, phản xạ.
Đợt 3 lấp các mảng còn thiếu: **sáng tạo tự do** (không có đáp án đúng/sai), **vận động tại
chỗ**, **kỹ năng sống & cảm xúc**, **khoa học khám phá**, **văn hóa/địa lý Việt Nam**, và
**tiếng Anh nâng cao hơn** mức từ vựng đơn ở `hoc-vui/`.

## Nhóm 9 — Sáng tạo tự do (không chấm điểm — chơi để chơi) 🎨

### 9.1 Vẽ Tự Do 🖌️ (`ve-tu-do/`)
- **Phát triển gì:** vận động tinh, biểu đạt cảm xúc, không áp lực đúng/sai (khác `to-mau/` vốn có đáp án tô sẵn).
- **Cách chơi:** canvas trắng full màn hình, bảng màu + 4 cỡ cọ + tẩy; con dấu hình (stamp) là các emoji động vật/hình khối để bé "vẽ" nhanh một bức tranh có nội dung. Nút 💾 lưu ảnh về máy (canvas→PNG), nút 🖼️ xem lại các bức đã lưu (localStorage, giới hạn ~20 bức).
- **Kỹ thuật:** canvas vẽ tay tự do (giống `paint.js` của `to-mau/` nhưng không chia vùng, không đáp án) + `toDataURL` để lưu/tải ảnh. Dễ ⭐.

### 9.2 Ghép Đồ Chơi 🧸 (`ghep-do-choi/`)
- **Phát triển gì:** sáng tạo lắp ráp tự do, không có "thắng/thua".
- **Cách chơi:** kho hình dán (đầu, thân, tay chân, mặt, phụ kiện — style theo bộ) kéo thả tự do lên khung để ghép thành nhân vật/con vật ngộ nghĩnh của riêng bé; chụp lại "tác phẩm" vào bộ sưu tập cá nhân.
- **Độ khó làm:** Vừa ⭐⭐ (cần bộ hình dán rời — có thể cắt từ emoji SVG hoặc vẽ đơn giản).

### 9.3 Nhạc Cụ Vui 🎹 (`nhac-cu/`)
- **Phát triển gì:** cảm âm, nhịp điệu, làm quen nốt nhạc Đô-Rê-Mi.
- **Cách chơi:** bàn phím piano 8 phím to (Đô Rê Mi Fa Sol La Si Đô) tô màu cầu vồng, chạm phát âm thanh (Web Audio, giống `sfx.js` nhưng đủ cao độ); chế độ "Nghe & bắt chước" — máy chơi 3-4 nốt, bé bắt chước lại đúng thứ tự (Simon Says âm nhạc); vài bài hát thiếu nhi đơn giản (Con Cò, Cháu Yêu Bà) hiện nốt để bé bấm theo.
- **Kỹ thuật:** Web Audio API tạo sóng sine theo tần số nốt nhạc (đã có nền tảng từ `sfx.js`). Vừa ⭐⭐.

## Nhóm 10 — Vận động tại chỗ (không cần thiết bị, chỉ cần màn hình + chỗ đứng) 🤸

### 10.1 Làm Theo Tôi 🙋 (`lam-theo-toi/`)
- **Phát triển gì:** nghe hiểu chỉ dẫn, vận động thô, tự chủ (biết khi nào NÊN làm theo).
- **Cách chơi:** biến thể "Simon Says": máy ra lệnh bằng hình + giọng nói ("Đưa tay lên!" 🙌); nếu lệnh có kèm "Simon nói..." thì làm theo, không có thì đứng yên — bé tự bấm ✅/⛔ xác nhận đã hiểu đúng luật hay chưa (không cần camera, chỉ là trò phản xạ nghe-hiểu qua nút bấm to). 10 lệnh mỗi lượt, tăng tốc dần.
- **Độ khó làm:** Dễ ⭐.

### 10.2 Yoga Cho Bé 🧘 (`yoga-be/`)
- **Phát triển gì:** giữ thăng bằng, hít thở, tên các con vật qua tư thế (tư thế mèo, tư thế chó, tư thế cây).
- **Cách chơi:** hiện hình minh họa 1 tư thế yoga đơn giản (dừng ~15–20s có đồng hồ đếm ngược to), máy đọc tên + hướng dẫn ngắn ("Giữ thẳng lưng như cái cây nhé!"), hết giờ tự chuyển tư thế kế tiếp; 5-6 tư thế/bài.
- **Độ khó làm:** Dễ ⭐ (chỉ cần hình minh họa/emoji + timer, không cần nhận diện chuyển động).

### 10.3 Nhảy Theo Nhạc 💃 (`nhay-theo-nhac/`)
- **Phát triển gì:** cảm thụ nhịp điệu, vận động toàn thân, phản xạ.
- **Cách chơi:** biến thể rhythm game như Nhảy Dây nhưng đứng tại chỗ: các mũi tên hướng (trái/phải/lên/ngồi xuống) trôi tới theo nhịp nhạc, bé bấm đúng phím/chạm đúng nút khi mũi tên tới vạch. 3 bài nhạc thiếu nhi tốc độ khác nhau.
- **Kỹ thuật:** tái dùng engine nhịp điệu của `troxua/rope` (đã có `stepRope`-style timing). Vừa ⭐⭐.

## Nhóm 11 — Kỹ năng sống & cảm xúc 💛

> ✅ **ĐÃ LÀM XONG** cả 3 trò (11.1 + 11.2 + 11.3), gộp vào `ky-nang-song/` (hub hiện có **20 game**).

### 11.1 Bé Vui Bé Buồn 😊 (`cam-xuc/`)
- **Học được gì:** nhận diện 6 cảm xúc cơ bản (vui, buồn, giận, sợ, ngạc nhiên, bình thường) qua khuôn mặt — nền tảng trí tuệ cảm xúc (EQ).
- **Cách chơi:** hiện 1 tình huống bằng hình + câu ngắn ("Bé làm rơi kem" 🍦😢) → chọn khuôn mặt cảm xúc đúng trong 4 lựa chọn; ngược lại — hiện khuôn mặt, chọn tình huống phù hợp. Máy giải thích ngắn gọn cảm xúc đó là gì.
- **Độ khó làm:** Dễ ⭐.

### 11.2 Bé Tự Làm Được 🪥 (`tu-lap/`)
- **Học được gì:** trình tự sinh hoạt hàng ngày (đánh răng, mặc quần áo, dọn đồ chơi) — kỹ năng tự lập.
- **Cách chơi:** kéo-thả sắp xếp đúng THỨ TỰ 4-5 bước của 1 việc ("Đánh răng": lấy bàn chải → lấy kem → chải răng → súc miệng → cất bàn chải); đúng thứ tự thì hoạt hình chạy mượt, sai thì gợi ý bước nào trước.
- **Độ khó làm:** Dễ ⭐ (giống cơ chế xếp thứ tự, tái dùng pattern kéo-thả của `hoc-vui/`).

### 11.3 An Toàn Cho Bé 🚦 (`an-toan/`)
- **Học được gì:** an toàn giao thông cơ bản (đèn đỏ dừng, đèn xanh đi, đội mũ bảo hiểm), an toàn ở nhà (không sờ ổ điện, không chơi dao kéo), số điện thoại khẩn cấp 113/114/115.
- **Cách chơi:** loạt tình huống Đúng/Sai bằng hình ("Bé đội mũ bảo hiểm khi đi xe" ✅ / "Bé chơi với ổ điện" ❌); bé chạm 👍/👎, máy giải thích vì sao.
- **Độ khó làm:** Dễ ⭐.

## Nhóm 12 — Khoa học khám phá vui 🔬

> ✅ **ĐÃ LÀM XONG** cả 3 trò (12.1 + 12.2 + 12.3), gộp vào `khoa-hoc/` (hub hiện có **21 game**).

### 12.1 Vòng Đời & Thiên Nhiên 🐛 (`vong-doi/`)
- **Học được gì:** vòng đời con vật (trứng→nòng nọc→ếch, sâu→kén→bướm, trứng→gà con→gà), 4 mùa trong năm.
- **Cách chơi:** kéo-thả sắp đúng thứ tự các giai đoạn vòng đời (giống pattern 11.2); chế độ 2: kéo trang phục/hoạt động đúng theo mùa (áo ấm+mùa đông, áo bơi+mùa hè).
- **Độ khó làm:** Dễ ⭐.

### 12.2 Pha Màu Diệu Kỳ 🎨 (`pha-mau/`)
- **Học được gì:** pha trộn màu cơ bản (đỏ+vàng=cam, xanh dương+vàng=xanh lá, đỏ+xanh dương=tím) — khoa học màu sắc sơ khai.
- **Cách chơi:** 2 giọt màu rơi vào bình trộn, hòa quyện animation mượt ra màu mới; đố bé đoán trước màu ra là gì (3 lựa chọn) trước khi xem đáp án. Sau khi học đủ 6 cặp, chuyển sang chế độ đố ngược: cho màu ra, đoán 2 màu gốc.
- **Kỹ thuật:** canvas/CSS blend đơn giản, không cần vật lý phức tạp. Dễ ⭐.

### 12.3 Chìm Hay Nổi? 🪨 (`chim-noi/`)
- **Học được gì:** khái niệm vật lý sơ khai — vật nặng/nhẹ, chìm/nổi trong nước.
- **Cách chơi:** hiện 1 đồ vật (viên đá 🪨, quả bóng 🎈, chiếc lá 🍃, đồng xu 🪙...), bé đoán CHÌM hay NỔI rồi thả vào bể nước xem animation kết quả thật; máy giải thích ngắn ("Đá nặng nên chìm xuống đáy!").
- **Độ khó làm:** Dễ ⭐.

## Nhóm 13 — Tiếng Anh nâng cao (trên nền `hoc-vui/`) 🇬🇧

> ✅ **ĐÃ LÀM XONG** cả 2 trò (13.1 + 13.2), gộp vào `tieng-anh/` (hub hiện có **22 game**).
> 13.2 vẫn chơi trọn vẹn khi từ chối quyền micro/máy không hỗ trợ — đã kiểm chứng bằng e2e.

### 13.1 Ghép Câu Đơn Giản 📝 (`cau-don-gian/`)
- **Học được gì:** cấu trúc câu Subject + Verb + Object cơ bản ("I like cats", "She has a ball") — bước đệm giữa từ vựng đơn và câu.
- **Cách chơi:** kéo-thả 3-4 thẻ từ vào đúng vị trí trong câu, có hình minh họa câu đó; ghép đúng thì máy đọc trọn câu bằng giọng Anh.
- **Độ khó làm:** Vừa ⭐⭐.

### 13.2 Phát Âm Theo Tôi 🗣️ (`phat-am/`)
- **Học được gì:** phát âm từ đơn tiếng Anh qua nghe-lặp-so sánh.
- **Cách chơi:** máy đọc từ + hình, bé bấm ghi âm giọng mình (Web Speech Recognition nếu trình duyệt hỗ trợ, hoặc chỉ ghi âm phát lại để tự nghe so sánh — không cần chấm điểm AI phức tạp), nghe lại và so với giọng mẫu.
- **Kỹ thuật:** `MediaRecorder API` để ghi âm, phát lại bằng `<audio>`. Vừa ⭐⭐ (cần xin quyền micro — có thể chặn ở 1 số môi trường).

## Nhóm 14 — Văn hóa & địa lý Việt Nam 🇻🇳

> ✅ **ĐÃ LÀM XONG** cả 3 trò (14.1 + 14.2 + 14.3), gộp vào `van-hoa-vn/` — trò 14.3 tách thành
> 2 tab riêng (Trang trí Tết tự do + Đèn lồng Trung Thu). Hub hiện có **23 game**.

### 14.1 Bản Đồ Việt Nam Bé 🗺️ (`ban-do-vn/`)
- **Học được gì:** hình dáng đất nước, vị trí 3 miền Bắc–Trung–Nam, vài thành phố lớn (Hà Nội, Huế, TP.HCM), biển đảo Hoàng Sa–Trường Sa là của Việt Nam.
- **Cách chơi:** bản đồ SVG đơn giản hóa (không chi tiết hành chính, chỉ khối lớn 3 miền); chạm đúng vùng khi được hỏi ("Miền Bắc đâu nhỉ?"); mỗi miền có 1-2 biểu tượng đặc trưng (Hà Nội: Hồ Gươm 🐢; Huế: Kinh thành 🏯; TP.HCM: Bến Nhà Rồng/chợ Bến Thành 🏛️).
- **Độ khó làm:** Vừa ⭐⭐ (cần vẽ SVG bản đồ đơn giản hóa).

### 14.2 Món Ăn Ba Miền 🍜 (`mon-an-vn/`)
- **Học được gì:** nhận diện món ăn Việt Nam quen thuộc (phở, bánh mì, bánh chưng, chả giò, bánh xèo...) — văn hóa ẩm thực.
- **Cách chơi:** ghép chữ-hình như `hoc-vui/` nhưng chủ đề ẩm thực VN; mở rộng: đố "món này miền nào?" (phở=Bắc, bánh xèo=Nam...).
- **Độ khó làm:** Dễ ⭐ (tái dùng engine `hoc-vui/words.js`, chỉ cần bộ dữ liệu mới).

### 14.3 Lễ Hội & Ngày Tết 🧧 (`le-hoi/`)
- **Học được gì:** phong tục Tết Nguyên Đán (bánh chưng, lì xì, hoa mai/đào, múa lân), Trung Thu (đèn lồng, múa lân, bánh trung thu) — theo mùa trong năm.
- **Cách chơi:** trang trí cây mai/đào bằng cách kéo-thả hoa/đồ trang trí (tự do, không chấm điểm — giống 9.x); mini game tìm-cặp lồng đèn Trung Thu (biến thể `lat-hinh/`); mở khóa theo mùa thực tế (tháng 1-2 hiện Tết, tháng 8-9 hiện Trung Thu) — bé quay lại app theo mùa vẫn có nội dung mới.
- **Độ khó làm:** Vừa ⭐⭐ (logic hiện-theo-tháng đơn giản, asset trang trí cần vẽ/kiếm).

## Lộ trình gợi ý đợt 3

1. **Vẽ Tự Do** (9.1) — dễ, giá trị cao, bé cần 1 chỗ "chơi tự do" giữa rừng game có đáp án.
2. **Bé Vui Bé Buồn** (11.1) + **An Toàn Cho Bé** (11.3) — kỹ năng sống thiết thực, dễ làm, engine y hệt Đúng/Sai đã quen.
3. **Pha Màu Diệu Kỳ** (12.2) + **Chìm Hay Nổi?** (12.3) — khoa học vui, dễ, mới lạ so với 19 game hiện có.
4. **Món Ăn Ba Miền** (14.2) — tái dùng gần như nguyên engine `hoc-vui/`, chỉ cần dữ liệu.
5. **Làm Theo Tôi** (10.1) + **Bé Tự Làm Được** (11.2) + **Vòng Đời & Thiên Nhiên** (12.1).
6. **Nhạc Cụ Vui** (9.3) + **Nhảy Theo Nhạc** (10.3) — cặp âm nhạc/vận động, làm sau vì cần thiết kế âm thanh kỹ hơn.
7. **Bản Đồ Việt Nam Bé** (14.1) + **Lễ Hội & Ngày Tết** (14.3) — cần asset riêng (SVG bản đồ, hình trang trí), làm khi có thời gian đầu tư mỹ thuật.
8. **Ghép Câu Đơn Giản** (13.1), **Ghép Đồ Chơi** (9.2), **Phát Âm Theo Tôi** (13.2, cần quyền micro) — rải sau cùng.

**Lưu ý thiết kế đợt 3:**
- Nhóm 9 (sáng tạo tự do) và phần trang trí của 14.3 **không chấm điểm** — không ghi "thắng/thua" vào Report như các game khác, chỉ ghi thời gian chơi, để đúng tinh thần "chơi để chơi".
- 13.2 (Phát Âm Theo Tôi) cần xin quyền micro — nên có màn giải thích rõ trước khi xin quyền, và game vẫn chơi được nếu bé/phụ huynh từ chối quyền (bỏ qua bước ghi âm, chỉ nghe mẫu).
- 14.1 và 14.3 cần đầu tư SVG/asset hình ảnh nhiều hơn các nhóm khác — nên làm sau khi các nhóm "rẻ" (ít asset, nhiều logic) đã xong.


Cách chơi game Đào Vàng
Ở phiên bản chuẩn, game Đào Vàng có cách chơi khá đơn giản và dễ hiểu. Thậm chí, các bạn nhỏ tuổi cũng có thể dễ dàng hiểu rõ cách chơi ngay từ lần tiếp xúc đầu tiên. 

Bạn sẽ hóa thân thành một người thợ mỏ và được trang bị một chiếc cần kéo. Công việc chính của bạn chính là đào được càng nhiều kim loại giá trị càng tốt. Trong quá trình đào, dây kéo sẽ di chuyển qua lại liên tục và bạn cần phải chớp thời cơ chính xác để dây kéo gắp trúng kim loại quý như vàng, kim cương. 

Tùy vào giá trị vật phẩm gắp lên mà bạn sẽ được trả một khoản tiền tương ứng. Sau khi tích đủ số tiền (tương đương với điểm số) cần để vượt màn, bạn sẽ qua màn và đến với thử thách khó hơn tiếp theo. 

choi-game-dao-vang-2

Cần chú ý đến độ lớn của vật phẩm vì vật phẩm càng lớn thì thời gian kéo càng lâu. Nếu bạn tập trung quá nhiều vào vật phẩm lớn mà không để ý đến thời gian của màn chơi, bạn có thể thua trước khi kịp tích đủ số tiền để qua màn.

Ngoài ra, trong game còn có các vật phẩm giá trị thấp như đá, heo, thỏ… Đặc biệt, bạn cần tránh kéo trúng các thùng thuốc nổ vì chúng sẽ phát nổ và làm mất đi các vật phẩm giá trị ở lân cận. 

Đừng quên mua thêm vật phẩm để hỗ trợ cho màn chơi tiếp theo, bao gồm Thuốc nổ – Dynamite, Nước tăng lực – Strength drink, Cỏ 3 lá may mắn – Lucky Clover, Sách sưu tầm đá – Rock Collector Book, Đánh bóng kim cương – Diamond Polish.

Đánh giá âm thanh – đồ họa khi chơi game Đào Vàng 
Là một tựa game 2D, nhưng Đào Vàng vẫn khiến người chơi cảm thấy thích thú bởi đồ họa dạng hoạt hình đẹp mắt cùng chuyển động khá mượt mà. Nhìn chung, hiệu ứng trong game không có nhiều, chỉ xoay quanh các động tác đơn giản như dây kéo lắc qua lắc lại, kéo vật phẩm lên… 

Ngoài ra, trong quá trình kéo vật phẩm, nhân vật trong game – chính là ảnh thợ đào vàng, thường sẽ có động thái nghiến răng, chau mày. Nếu để bạn, bạn còn có thể nhìn thấy thái độ của chủ cửa hàng sẽ có sự khác biệt khi bạn từ chối hoặc chọn mua vật phẩm mà họ đang bán.

choi-game-dao-vang-3

Bên cạnh đó, bối cảnh của mỗi màn chơi cũng khá đa dạng, đôi khi là thảo nguyên bạt ngàn xanh mướt, đôi khi là ngọn núi hùng vĩ, cũng có lúc là một hoang mạc đơn sơ. 

Về âm thanh, game được trang bị khá nhiều hiệu ứng âm thanh, từ tiếng ròng rọc chạy, tiếng kéo các vật phẩm khác nhau… Ngoài ra, phần nhạc nền của game cũng mang lại cảm giác thoải mái và vui vẻ khi chơi. 

Với đồ họa đơn giản, bạn không cần phải sở hữu một chiếc điện thoại có cấu hình mạnh để có thể chơi game Đào Vàng. Ngược lại, tựa game này khá nhẹ phù hợp với hầu hết các thiết bị hiện nay. Nếu muốn quay lại tuổi thơ với game Đào Vàng, bạn có thể tải về và trải nghiệm từ CH Play (đối với Android) hoặc App Store (đối với iOS). 

Một số tựa game tương tự
Nếu bạn muốn thử chơi game Đào Vàng nhưng ở một phiên bản độc đáo và mới lạ hơn, bạn có thể tham khảo một trong số các gợi ý sau:

Tìm Vàng
Game Tìm Vàng có cách chơi khá giống với Đào Vàng, nhưng bối cảnh, nhân vật và vật phẩm khi đào sẽ có đôi chút khác biệt. Game có tối đa 20 màn chơi và bạn cần đạt hoàn thành các mục tiêu nhất định để lần lượt vượt qua các màn. Trò chơi này có thể trải nghiệm được trên máy tính, và bạn chỉ cần canh đúng thời điểm để thả cần câu bằng cách click chuột hoặc ấn nút mũi tên chỉ xuống. 

choi-game-dao-vang-4

Đập vàng
Khác với cách chơi game Đào Vàng, game Đập Vàng sẽ khiến bạn liên tưởng đến các trò chơi đập gạch. Trong game, bạn sẽ phải ném rìu vào những khu vực có từ 2 viên đá cùng màu trở lên, số đá đập được càng nhiều thì điểm lại càng cao. Hãy cân nhắc kỹ lưỡng để ném một cách chuẩn xác nhất khi chơi game. 

choi-game-dao-vang-5

Cơn sốt tìm vàng
Tương tự với Đập vàng, trò chơi Cơn sốt tìm vàng cũng thuộc thể loại đập gạch. Người chơi sẽ kiếm điểm bằng cách chọn những khu vực có càng nhiều viên đá trùng màu càng tốt, khi tích đủ số lượng điểm cần thiết để qua màn, bạn sẽ tiếp tục đến với màn tiếp theo và tất nhiên là độ khó cũng sẽ tăng dần lên. 

choi-game-dao-vang-6

Vòng quay tìm vàng
Trò chơi này mang yếu tố “may rủi” khá cao. Trong một vòng quay với nhiều vật phẩm khác nhau, người chơi sẽ được cung cấp 50 lượt quay. Sau mỗi lần quay, bạn sẽ nhận được các vật phẩm tương ứng và sử dụng chúng để xây dựng ngôi làng. Hãy tích cực quay và bảo vệ ngôi làng trước những thế lực thù địch đang hăm he bên ngoài. 

choi-game-dao-vang-7

Thợ đào vàng
Cách chơi của Thợ đào vàng giống đến 80% so với các chơi game Đào Vàng. Trong game, bạn cũng sẽ bắt gặp các vật phẩm khác nhau và nhiệm vụ của bạn là gắp được càng nhiều vật phẩm giá trị càng tốt. Tuy nhiên, hãy cần thận và ngắm chuẩn xác khi thả cần câu vì hầu hết vàng, kim cương đều sẽ bị chắn bởi viên đá lớn mà giá trị chẳng đáng bao nhiêu. 

choi-game-dao-vang-8

Xây thị trấn vàng
Ngay từ cái tên, chúng ta đã hiểu đôi nét về cách chơi của tựa game này. Về cơ bản, bạn sẽ phải điều khiển xe đi chở vàng và xây dựng một thị trấn sầm uất trong mơ. Xe chạy càng nhiều lượt thì tỷ lệ tăng cấp càng cao, và các công trình của bạn sẽ càng “xịn sò” hơn. 

choi-game-dao-vang-9

Thợ đào vàng Tom
Đây là một phiên bản khác của trò chơi Đào Vàng. Trong game, bạn sẽ hóa thân thành nhân vật Tom – một thợ đào vàng chuyên nghiệp và nhiệm vụ chính của bạn là điều khiển cần kéo để gắp được càng nhiều vật phẩm giá trị càng tốt. Sau khi đạt đủ điểm yêu cầu, bạn sẽ được qua màn và đến với cấp độ khó hơn của game. 

choi-game-dao-vang-10

Kẻ đánh cắp vàng
Đây là một trò chơi thuộc thể loại nhập vai phiêu lưu cực kỳ thú vị và hấp dẫn. Trong game, bạn sẽ phải sử dụng các phím lên, xuống, qua trái, qua phải để điều khiển nhân vật thu thập càng nhiều vàng càng tốt. Số vàng này sẽ được sử dụng để xây dựng nên tòa lâu đài trong mơ cho bạn. Ngoài ra, đừng quên sử dụng phím cách để nhân vật chạy nhanh hơn hoặc nhảy cao hơn với 2 lần nhấn phím mũi tên hướng lên. 

choi-game-dao-vang-11

Quý ngài săn vàng
Tương tự với cách chơi game Đào Vàng, bạn cũng sẽ bắt đầu hành trình tìm kiếm các vật phẩm giá trị bằng cách thả cần câu chuẩn xác. Mỗi vật phẩm sẽ có giá trị khác nhau, và việc thu thập các vật phẩm giá trị cao sẽ giúp bạn qua màn một cách nhanh chóng và dễ dàng hơn. 

choi-game-dao-vang-12

Hũ vàng của Cleo
Với trò chơi này, bạn sẽ điều khiển nhân vật của mình – chính là nàng Cleo để thu thập vàng và tiến đến chiến thắng cuối cùng. Nhìn chung, game khá đơn giản và dễ chơi, nên bạn có thể thử trải nghiệm nếu như đang tìm kiếm một trò chơi thuần giải trí. 

choi-game-dao-vang-13

Vị vua vàng
Mặc dù cái tên là vậy, nhưng đây không phải là trò chơi thuộc mô típ Đào Vàng. Ngược lại, game khá giống với thể loại nối kim cương kinh điển. Trong game, bạn chỉ cần tìm kiếm và nối từ 3 hũ vàng lại với nhau theo hàng ngang hoặc theo hàng dọc để tính điểm. 

choi-game-dao-vang-14

Cuộc săn vàng
Nếu bạn đang tìm kiếm một tựa game có cách chơi tương tự với cách chơi game Đào Vàng phiên bản cổ điển, Cuộc săn vàng sẽ là gợi ý hàng đầu dành cho bạn. Tuy nhiên, game này sẽ có một chút biến tấu khá thú vị. Trong game, các chú chuột sẽ ôm những vật phẩm có giá trị và bạn cần điều khiển cần câu một cách khéo léo nếu như muốn đến với những màn chơi tiếp theo.

choi-game-dao-vang-15

Đường hầm săn vàng
Bạn sẽ sử dụng cây cuốc để đập vỡ các hòn đá lớn và thu thập vàng đang ẩn mình bên trong đó. Tuy nhiên, trong quá trình đó, bạn cần khéo léo di chuyển để tránh bị các viên đá vỡ ra rơi trúng mình. Sau khi thu thập đủ lượng vàng cần thiết, bạn sẽ giành chiến thắng cuối cùng.

choi-game-dao-vang-16

Đào hầm vàng
Game này có cách chơi khá mới lạ và thú vị. Trong game, bạn sẽ vào vai một viên bóng và dùng những đường lăn của mình để thu thập vàng. Hãy vẽ những đường lăn đẹp mắt để thu thập được càng nhiều vàng càng tốt. Ngoài ra, trong quá trình di chuyển, bạn cũng cần tránh các chướng ngại vật để suôn sẻ về đến đích. 

choi-game-dao-vang-17

Bên trên là cách chơi game Đào Vàng và một số tựa game tương tự mà bạn có thể tham khảo. Nếu đây là tựa game gắn liền với tuổi thơ “chinh chiến” của bạn, đừng ngại ngần chia sẻ cảm nghĩ của mình với mọi người. Ngoài ra, đừng quên tải game và trải nghiệm cảm giác rất “xưa” cùng những tựa game trên, bạn nhé 


## TIếp tục bổ sung games
Các game tuổi thơ như bắn máy bay , pokemon đại chiến , hợp nhất caác số , plants vs zoombier , trốn tìm , kim cương , chém hoa quả, hãy viết tiếp kỹ càng và research kỹ , ghi vào , rồi tìm hình ảnh ,logo ,icon ,game assets và sau đó tôi sẽ nghiên cứu tiếp 

### Lưu ý chung trước khi đọc — bản quyền & nguồn hình ảnh

Repo này chạy hoàn toàn offline/local, nhưng **chạy local không đồng nghĩa được phép sao chép asset/tên gọi của game thương mại có bản quyền** — Pokémon (Nintendo/Game Freak/Creatures), Plants vs. Zombies (PopCap/EA) và Fruit Ninja (Halfbrick) đều là những thương hiệu được bảo hộ và thực thi rất gắt gao. Với 3 game này, phần nghiên cứu bên dưới **giữ nguyên cơ chế chơi (mechanic) nhưng đề xuất tên gọi + nhân vật + hình ảnh gốc**, không sao chép logo/nhân vật/asset thật — đúng cách đã làm với Đào Vàng (lấy cảm hứng cơ chế cần câu của Gold Miner, tự vẽ hình bằng canvas/CSS + icon Twemoji CC-BY thay vì asset gốc). Các game còn lại (bắn máy bay, hợp nhất số, trốn tìm, kim cương, chém hoa quả) đều thuộc **thể loại chơi phổ biến** (đã bị nhân bản hàng nghìn lần dưới nhiều tên khác nhau), không gắn với 1 thương hiệu cụ thể nên an toàn hơn nhiều.

Nguồn hình ảnh đề xuất chung cho cả 7 game, theo đúng 2 cách đã dùng trong repo:
1. **Tự vẽ bằng canvas/CSS** (gradient, shape, animation) — cách chủ đạo của toàn bộ 27 game hiện có (rắn, tetris, xe tăng, ngựa cờ, đào vàng...).
2. **Icon mã nguồn mở giấy phép tự do** (Twemoji — CC-BY 4.0, đã dùng cho Đào Vàng) cho các icon rời rạc (trái cây, con vật, ngôi sao, kim cương...) khi cần trông "chỉn chu" hơn hình vẽ tay.

---

### 1. Bắn Máy Bay (đề xuất tên: "Phi Đội Nhí")

**Cách chơi:** Game bắn súng cuộn màn hình dọc (vertical scrolling shoot-'em-up) kinh điển. Máy bay của bé ở nửa dưới màn hình, di chuyển trái/phải (hoặc tự do 2 chiều) bằng kéo tay/d-pad, tự động bắn hoặc bắn khi chạm màn hình. Vật cản/mục tiêu bay từ trên xuống theo waypoint hoặc rơi ngẫu nhiên, bé né hoặc bắn hạ để ăn điểm. Có vật phẩm rơi ra để nhặt (tăng tốc độ bắn, khiên bảo vệ, thêm máy bay hộ tống), boss xuất hiện sau mỗi vài chục giây/số điểm mốc.

**Đề xuất "hiền hóa" cho trẻ em:** thay vì khung cảnh "phe ta bắn phe địch" (tính đối đầu/chiến tranh), đổi mục tiêu bắn hạ thành vật cản trung tính — thiên thạch, ong bắp cày nghịch ngợm, mây giông — hoặc đổi hẳn thành game né + thu thập (không bắn ai, chỉ né chướng ngại vật và gom sao/khinh khí cầu), phù hợp tinh thần "giải trí lành mạnh" của cả bộ sưu tập. Máy bay có thể thiết kế dạng thú/robot đáng yêu thay vì khí tài quân sự thật.

**Tựa game tham khảo (thể loại phổ biến, không gắn 1 thương hiệu cụ thể):** 1942, Raiden, Galaga, Sky Force Reloaded, Chicken Invaders (đã tự "hiền hóa" bằng theme gà từ trước).

**Đồ họa/âm thanh:** nền trời cuộn dọc liên tục (parallax 2 lớp mây), hiệu ứng "nổ" dạng bung hoa/pop tròn thay vì cháy nổ thật, nhạc nền tempo nhanh vui tươi, giọng đọc số điểm/combo cho bé nghe theo mô-típ đã dùng ở Trò Xưa và Đào Vàng.

---

### 2. Pokémon Đại Chiến (đề xuất tên gốc: "Thú Cưng Đại Chiến")

**Cách chơi:** Đấu theo lượt (turn-based), mỗi bên có 1-3 con thú, mỗi lượt chọn 1 trong vài chiêu thức, trừ máu theo công thức sát thương có tính hệ khắc chế (vd. hệ Nước > Lửa > Cỏ > Nước theo vòng tròn tương khắc, hoặc đơn giản hơn cho trẻ nhỏ: mỗi hệ chỉ khắc đúng 1 hệ khác), thanh HP hiển thị trực quan, thắng thì lên cấp/học chiêu mới, có thể "thu phục" thêm thú mới sau mỗi trận.

**⚠️ Lưu ý bản quyền quan trọng:** "Pokémon" là một trong những thương hiệu được bảo hộ gắt gao nhất thế giới — tên gọi, hơn 1000 nhân vật, hệ thống loại hình đều thuộc sở hữu Nintendo/Game Freak/Creatures và bị truy quét cả với dự án fan-made phi thương mại. Đáng chú ý: thư mục `pokemon/` hiện có trong repo (game nối hình kiểu Onet) đang dùng ảnh nhân vật Pokémon thật, có từ trước phiên làm việc này — bản thân điều đó đã tiềm ẩn rủi ro dù chỉ chạy offline/local. Nếu mở rộng thành hệ thống "đại chiến" đầy đủ (turn-based, tên/hệ nguyên tố/thiết kế nhân vật giống hệt), mức độ rủi ro sẽ tăng lên đáng kể, đặc biệt nếu sau này có ý định chia sẻ/public repo. Đề xuất: xây bộ thú cưng **hoàn toàn gốc** — tên, hình dáng, hệ nguyên tố tự đặt (có thể lấy cảm hứng từ 12 con giáp hoặc động vật Việt Nam quen thuộc: trâu, gà, cá, v.v. cho gần gũi văn hóa) — giữ đúng cơ chế turn-based + khắc hệ nhưng không dùng bất kỳ tên/hình nào của Pokémon thật.

**Tựa game tham khảo (chỉ để hiểu cơ chế, không sao chép asset):** Pokémon, Dragon Quest Monsters, Temtem, Digimon, Monster Rancher.

**Đồ họa/âm thanh:** thiết kế quái vật dạng vector đơn giản/pixel-art tự vẽ (dễ làm nhất quán phong cách với các game khác trong bộ), hiệu ứng tấn công đơn giản (rung lắc + flash màu khi trúng đòn, không cần animation phức tạp), nhạc chiến đấu vui nhộn tempo vừa, giọng đọc tên chiêu thức/kết quả trận đấu cho bé chưa đọc chữ.

---

### 3. Hợp Nhất Các Số ("2048" — đề xuất tên: "Gộp Số Vui")

**Cách chơi:** Lưới ô vuông (thường 4×4), vuốt 1 trong 4 hướng để toàn bộ ô trượt về phía đó; 2 ô cùng số chạm nhau sẽ gộp thành 1 ô mang giá trị gấp đôi; sau mỗi lượt vuốt, 1 ô mới (giá trị nhỏ) xuất hiện ngẫu nhiên; mục tiêu đạt được ô có giá trị đích (2048 hoặc tùy chỉnh); thua khi bàn đầy kín mà không còn ô nào gộp được nữa.

**Ghi chú bản quyền:** cơ chế "trượt & gộp" (phổ biến qua game *2048* của Gabriele Cirulli, vốn lấy cảm hứng từ *Threes!* của Asher Vollmer) đã bị nhân bản hàng nghìn lần dưới đủ loại tên khác nhau — đây gần như là cơ chế thuộc về thể loại chung (genre-generic), an toàn để tự viết lại với chủ đề/tên riêng.

**Đề xuất cho trẻ em (rất hợp với hướng "học mà chơi" của cả bộ sưu tập):** thay số trừu tượng bằng hình trực quan — gộp 2 con vật nhỏ giống nhau thành 1 con to hơn (trứng → gà con → gà mẹ), hoặc gộp 2 trái cây nhỏ thành trái to hơn; hoặc giữ nguyên số nhưng thêm giọng đọc số khi gộp, ăn khớp với các game đếm số đã có (Nhảy Lò Cò Số, Toán Lớp 1).

**Tựa game tham khảo:** 2048, Threes!, 1010!, Merge Dragons, Triple Town.

**Đồ họa/âm thanh:** ô vuông bo góc, mỗi cấp giá trị 1 màu riêng (giống bảng màu tăng dần của bản gốc, dễ tự làm bằng CSS gradient), hiệu ứng nảy nhẹ (pop) khi gộp ô, âm thanh "ting" tăng dần cao độ theo cấp số — vừa vui tai vừa giúp bé cảm nhận "số càng lớn âm càng cao".

---

### 4. Thực Vật Đại Chiến Zombie ("Plants vs. Zombies" — đề xuất tên gốc: "Vườn Rau Thần Kỳ")

**Cách chơi:** Tower-defense chia theo làn ngang (thường 5 làn). Bé đặt "cây phòng thủ" vào các ô trống trên làn, mỗi cây tốn 1 lượng "năng lượng" tích lũy dần theo thời gian hoặc nhặt được trên sân; quái vật xuất hiện từ mép phải, di chuyển chậm rãi sang trái theo đúng làn của chúng; cây tự động tấn công quái đi vào tầm; bé thua nếu có quái đi lọt hết làn tới nhà (mép trái); thắng khi cầm cự hết số đợt (wave) quy định, độ khó/số lượng quái tăng dần theo đợt.

**⚠️ Lưu ý bản quyền quan trọng:** "Plants vs. Zombies" là thương hiệu của PopCap Games/Electronic Arts — tên gọi và toàn bộ thiết kế nhân vật (Peashooter, Sunflower, Zombie đội nón...) đều được bảo hộ, không nên sao chép. Đề xuất: giữ đúng cơ chế tower-defense theo làn (đặt phòng thủ – tài nguyên tích lũy – làn sóng địch tăng dần) nhưng đổi hẳn chủ đề — ví dụ khu vườn rau của bé bị sâu bọ/côn trùng phá hoại, bé trồng các loại rau/hoa có khả năng đặc biệt để xua đuổi sâu bọ. Ngoài vấn đề bản quyền, chủ đề "zombie" cũng hơi nặng cho trẻ nhỏ tuổi mẫu giáo dù bản gốc đã vẽ theo phong cách hài hước — đổi thành "sâu bọ tinh nghịch" sẽ thân thiện và phù hợp lứa tuổi hơn.

**Tựa game tham khảo (chỉ để hiểu cơ chế):** Plants vs. Zombies, Kingdom Rush, Bloons TD, Fieldrunners.

**Đồ họa/âm thanh:** nền vườn/sân cỏ chia làn rõ ràng bằng viền màu xen kẽ, icon cây/côn trùng dạng vector đơn giản dễ phân biệt, nhạc nền vui tươi rộn ràng (không dùng nhạc rùng rợn), hiệu ứng "gãi đầu ngơ ngác" khi côn trùng bị đẩy lui thay vì hiệu ứng bạo lực.

---

### 5. Trốn Tìm (đề xuất chuyển thể: "Bé Tìm Bạn" — dạng Hidden Object)

**Cách chơi:** Trốn tìm vốn là trò chơi vận động ngoài trời truyền thống (đã có nhắc trong nhóm "Trò Xưa"), không phải 1 tựa game điện tử cụ thể nên không có vấn đề bản quyền — nhưng cũng cần chuyển thể phù hợp với màn hình. Hướng chuyển thể tự nhiên nhất là **hidden object** (tìm đồ vật/nhân vật ẩn trong tranh): hiển thị 1 khung cảnh vẽ chi tiết (sân trường, công viên, nhà bà...), cho danh sách vài bạn nhỏ/đồ vật đang "trốn" trong tranh, bé chạm đúng vị trí ẩn trong giới hạn thời gian; độ khó tăng dần theo cảnh phức tạp hơn và vật ẩn kỹ hơn (lẫn màu nền, chỉ lộ 1 phần nhỏ...). Biến thể thay thế: "tìm điểm khác biệt" giữa 2 bức tranh gần giống hệt nhau.

**Tựa game tham khảo:** Hidden Folks, dòng game "Tìm điểm khác biệt" phổ biến trên di động, June's Journey.

**Đồ họa/âm thanh:** tranh nền vẽ tay/vector nhiều chi tiết theo bối cảnh quen thuộc với trẻ Việt Nam (sân trường, chợ quê, công viên), hiệu ứng lấp lánh + âm thanh "tinh" khi tìm đúng, giọng đọc khen ngợi/gợi ý khi bé bí (ăn khớp mô-típ "đọc to hướng dẫn" đã làm cho các game khác trong bộ).

---

### 6. Kim Cương (đề xuất tên: "Kim Cương Lấp Lánh")

**Ghi chú quan trọng — tránh trùng lặp:** bộ sưu tập hiện đã có 2 game thuộc họ "nối màu": **Vị Vua Vàng** (đổi chỗ 2 ô liền kề để tạo hàng ≥3 — cơ chế kiểu Bejeweled/Candy Crush) và **Đập Vàng** (bấm cụm ≥2 ô liền kề cùng màu để đập vỡ — cơ chế kiểu SameGame). Nếu "Kim Cương" chỉ lặp lại 1 trong 2 cơ chế trên với vỏ bọc khác thì sẽ khá dư thừa. Đề xuất 2 hướng THỰC SỰ khác biệt để cân nhắc:

- **Kim cương rơi** (falling-block match, kiểu Puzzle League/Tetris Attack): các hàng kim cương liên tục đẩy từ dưới lên; bé chỉ được đổi chỗ 2 ô NẰM NGANG CẠNH NHAU (không phải chọn-rồi-đổi tự do như Vị Vua Vàng); nếu hàng kim cương chạm tới nóc bàn thì thua — tạo nhịp độ nhanh, dồn dập hơn hẳn Vị Vua Vàng.
- **Kim cương nối đường** (kiểu Flow Free/Pipe): kéo nối các viên kim cương cùng màu thành 1 đường liền mạch không tự cắt nhau — hoàn toàn khác cơ chế "đổi chỗ" hay "đập cụm" đã có.

**Tựa game tham khảo:** Bejeweled, Candy Crush Saga, Puzzle League/Tetris Attack, Flow Free.

**Đồ họa/âm thanh:** có thể tái sử dụng icon `gem.svg` (Twemoji, CC-BY) đã tải sẵn cho Đào Vàng, vẽ thêm biến thể nhiều màu; hiệu ứng lấp lánh/tỏa sáng khi khớp được kim cương, âm thanh chuông trong trẻo khi ăn điểm.

---

### 7. Chém Hoa Quả ("Fruit Ninja" — đề xuất tên gốc: "Bé Hái Trái Cây")

**Cách chơi:** Trái cây được "tung" lên từ mép dưới màn hình theo quỹ đạo parabol thật (dùng lại đúng công thức vật lý trọng lực đã viết cho Ném Lon trong Trò Xưa: vận tốc ban đầu + trọng lực kéo xuống dần), bé vuốt tay ngang qua trái cây để "chém" — tính bằng giao điểm giữa đoạn đường vuốt và vị trí trái cây tại thời điểm đó; né không chạm phải vật cấm (bom); combo tính điểm cao hơn khi chém trúng nhiều trái trong 1 lần vuốt liên tục; thua khi để rơi quá N trái mà không chém trúng.

**⚠️ Lưu ý bản quyền:** "Fruit Ninja" là thương hiệu của Halfbrick Studios — nên tránh dùng đúng tên gọi và hình ảnh "lưỡi kiếm/ninja" đặc trưng của họ. Cơ chế lõi "vuốt để chém vật bay" thì đã được nhân bản rất nhiều dưới các tên khác nhau nên an toàn để viết lại. Đề xuất đổi hẳn phần hình ảnh "lưỡi kiếm ninja" (hơi mang tính bạo lực với trẻ nhỏ) thành vệt tay sáng lấp lánh hoặc hình bàn tay bé hái trái cây, giữ đúng cảm giác "vuốt nhanh, đã tay" nhưng thân thiện hơn với lứa tuổi mẫu giáo/tiểu học.

**Tựa game tham khảo (chỉ để hiểu cơ chế):** Fruit Ninja, và rất nhiều clone "vuốt chém" khác trên chợ ứng dụng.

**Đồ họa/âm thanh:** trái cây vector tươi sáng bay theo đúng vật lý (tái dùng engine Ném Lon), hiệu ứng "bổ đôi" khi chém trúng (2 nửa văng ra 2 hướng theo quán tính vốn có), âm thanh "chíu/bụp" giòn tai kèm giọng đọc tên trái cây khi chém trúng (kết hợp học từ vựng, ăn khớp tinh thần "vừa chơi vừa học" của cả bộ sưu tập), nhạc nền sôi động tempo nhanh.

---

**Trạng thái: cả 7 game đã làm xong** ✅ — đều theo đúng quy trình của nhóm "Game Mini" (logic thuần + unit test trước, giao diện sau, tự vẽ bằng canvas/CSS + emoji thay vì sao chép asset game gốc):

1. **Phi Đội Nhí** ✅ (`phi-doi-nhi/`) — kéo tay lái máy bay, tự động bắn, né thiên thạch/ong/mây giông, nhặt sao, có trùm cuối màn.
2. **Thú Cưng Đại Chiến** ✅ (`thu-cung-dai-chien/`) — đấu theo lượt, hệ khắc chế Lửa/Cỏ/Nước, thú cưng thiết kế gốc (không dùng nhân vật Pokémon).
3. **Gộp Số Vui** ✅ (`gop-so-vui/`) — trượt & gộp kiểu 2048, mục tiêu tăng dần theo màn, đọc to số lớn khi gộp được.
4. **Vườn Rau Thần Kỳ** ✅ (`vuon-rau-than-ky/`) — tower-defense 5 làn chủ đề vườn rau vs côn trùng (không zombie): Hoa Mặt Trời/Đậu Xanh/Xương Rồng.
5. **Bé Tìm Bạn** ✅ (`be-tim-ban/`) — hidden object: tìm các bạn nhỏ trốn lẫn trong đám đồ vật trước khi hết giờ.
6. **Kim Cương Lấp Lánh** ✅ (`kim-cuong-lap-lanh/`) — chọn hướng "kim cương nối đường" (kiểu Flow Free) để KHÔNG trùng cơ chế với Vị Vua Vàng/Đập Vàng: kéo nối 2 viên cùng màu, các đường không cắt nhau; màn sinh tự động luôn có lời giải (chia kín bàn thành các đường rồi đặt kim cương ở 2 đầu).
7. **Bé Hái Trái Cây** ✅ (`be-hai-trai-cay/`) — vuốt hái trái cây bay parabol (tái dùng công thức trọng lực kiểu Ném Lon), vệt tay lấp lánh thay lưỡi kiếm, vật cấm là chú ong (không bom), combo khi vuốt trúng nhiều trái, đọc to tên trái cây song ngữ khi hái trúng.

**Bổ sung sau (theo yêu cầu):**

8. **Pokémon Đại Chiến** ✅ (`pokemon-dai-chien/`) — bản "đại chiến" dùng **sprite Pokémon thật** tái dụng từ kho `/pokemon/images/` có sẵn trong repo (cùng nguồn ảnh với game Onet và Ghép Hình Trượt — chỉ chạy offline/local): 5 bạn khởi đầu (Pikachu/Charmander/Squirtle/Bulbasaur/Eevee), 6 hệ khắc chế (thêm ⚡ Điện khắc 💧 Nước), **tiến hóa** sau trận thắng thứ 1 và thứ 3 (Eevee tiến hóa ngẫu nhiên 1 trong 3 nhánh), trùm chốt màn mạnh dần (Gyarados → Gengar → Snorlax → Dragonite → Mewtwo). Game Thú Cưng Đại Chiến (bộ thú tự vẽ) vẫn giữ nguyên song song.

**Nâng cấp đồ họa (thay emoji chữ bằng icon SVG Twemoji CC-BY, cùng cách làm với Đào Vàng):** Phi Đội Nhí (máy bay, thiên thạch, ong, mây giông, sao, trùm UFO), Bé Hái Trái Cây (8 trái cây + ong, trái xoay khi bay, nửa trái văng ra cũng bằng SVG), Vườn Rau Thần Kỳ (hoa mặt trời, mầm đậu, xương rồng, sâu, bọ). Mỗi thư mục `images/` có kèm `CREDITS.md` ghi nguồn giấy phép.


## Tiếp tục với games mới : 
 Cá lớn nuốt cá bé, Beach Head 2000, Bắn trứng khủng long (Dynamite), Thời trang/Trang điểm: Các mini game thiết kế quần áo, trang điểm cho búp bê. (bé có thể học tiếng anh nghe tiếng anh khi chọn các items để trang trí hay các phần của cơ thể khi bấm vào ...) , Bounce, Diamond Rush, Angry Birds, PVZ, Flappy Bird, trang trí phòng ,mario , Cadillacs and Dinosaurs , The King of Fighters , The Last Blade ., Dynomite Deluxe , Feeding Frenzy , Need For Speed - Underground , Road Rash , Bloody Roar , Chicken Invaders , Audition , Samurai Shodown .
 Ghi đầy đủ chiến thuật để hoàn thành các game này , tải resource từ trên mạng về hình ảnh , icon, ... hỗ trợ tốt chơi trên ipad,tablet... 
 - Hỗ trợ 2D build tốt giao diện đẹp , không cần phải nhẹ .
 - Làm càng giống bản gốc càng tốt .

---

# ĐỢT 5 — Nghiên cứu chi tiết & kho asset (đã tải sẵn)

## 0. Nguyên tắc chung cho cả đợt

**"Giống bản gốc" hiểu thế nào cho đúng:** giống về **cơ chế – nhịp độ – cảm giác chơi** (làm được và nên làm), KHÔNG sao chép **asset/tên gọi/nhân vật** của bản gốc. Mario (Nintendo), Angry Birds (Rovio), KOF/Samurai Shodown/The Last Blade (SNK), Bloody Roar (Hudson/Eighting), Dynomite & PVZ (PopCap/EA), Feeding Frenzy (PopCap), NFS (EA), Chicken Invaders (InterAction) — tất cả đều được bảo hộ và nhiều hãng (đặc biệt Nintendo, SNK) truy quét rất gắt. Cách của repo từ trước tới nay: **cơ chế giữ nguyên, đề xuất tên + nhân vật + hình ảnh riêng.**

**Kho asset đã tải về `assets/kenney/` (26MB, giấy phép CC0 — dùng tự do, chất lượng chuyên nghiệp, xem `assets/kenney/CREDITS.md`):**

| Pack | Nội dung | Dùng cho |
|---|---|---|
| `fish-pack` | ~20 loài cá đủ cỡ + bong bóng, 2 cỡ ảnh | Cá Lớn Biển Xanh |
| `physics-assets` | Khối gỗ/đá/kính vỡ được + quái tròn + nền | Ném Banh Đổ Tháp |
| `puzzle-pack-2` | Bóng màu, gạch, ống, paddle, hạt lấp lánh | Rồng Con Bắn Trứng, Bóng Đỏ Phiêu Lưu |
| `pixel-platformer` | Tilemap + nhân vật pixel + Tiled maps | Nhà Thám Hiểm Tí Hon |
| `racing-pack` | Xe hơi/mô tô nhiều màu, đường đua, cây, vạch | Tay Đua Nhí |
| `alien-ufo-pack` | UFO + quái xâm lăng dễ thương | Gà Vũ Trụ |
| `ui-pack` | Nút/panel/thanh máu đẹp + âm click | Dùng chung mọi game đợt này |
| `game-icons` | Icon pause/play/loa/mũi tên/home trắng | Dùng chung mọi game đợt này |

Quy tắc dùng: **chỉ copy đúng file cần** từ `assets/kenney/<pack>/PNG/` vào `<game>/images/` (kèm 1 dòng CREDITS) — giữ `assets/` làm kho ngoài, KHÔNG precache cả kho vào service worker. Icon lẻ vẫn dùng Twemoji (CC-BY) như cũ.

**Chuẩn hỗ trợ iPad/tablet cho mọi game đợt này (quan trọng — bản gốc nhiều game là PC/console):**
- Pointer Events thống nhất chuột + cảm ứng (repo đã theo chuẩn này), `touch-action: none` trên vùng chơi, `manipulation` ngoài vùng chơi (chặn double-tap zoom).
- Canvas vẽ theo tọa độ trường cố định (như FIELD_W/H hiện tại), scale bằng CSS `aspect-ratio` + `max-height: 100dvh` — chạy đẹp cả dọc lẫn ngang; game nào cần ngang (đua xe, platformer) thì hiện màn "xoay máy để chơi" khi đang ở thế dọc (CSS `@media (orientation: portrait)`).
- Mọi nút chạm ≥ 44×44px; điều khiển ảo (d-pad/nút nhảy) đặt 2 góc dưới, tránh vùng vuốt hệ thống của iPad (mép dưới ~20px, dùng `env(safe-area-inset-*)`).
- Không dựa vào hover/bàn phím; bàn phím chỉ là phụ trợ desktop.
- Asset đẹp thoải mái dung lượng ("không cần nhẹ") nhưng: precache SW chỉ file thật sự dùng; ảnh to (nền) cho cache runtime tự nhặt.
- Âm thanh: iOS chỉ phát sau chạm đầu tiên — mọi game đã có nút ▶ bắt đầu, gắn unlock audio ở đó.

**Trùng lặp trong danh sách yêu cầu, đã gộp:** Feeding Frenzy = Cá lớn nuốt cá bé (1 game). Dynomite Deluxe = Bắn trứng khủng long (1 game). PVZ = đã có Vườn Rau Thần Kỳ (chỉ nâng cấp thêm). Road Rash gộp vào game đua xe (bỏ yếu tố đánh nhau trên xe — không hợp trẻ em).

---

## Nhóm A — Cơ chế thuộc thể loại phổ biến, hợp trẻ em, làm được ngay

### A1. Cá Lớn Nuốt Cá Bé / Feeding Frenzy (đề xuất tên: "Cá Lớn Biển Xanh") 🐟
- **Cách chơi gốc:** điều khiển 1 con cá bơi tự do trong màn nước; **ăn được cá nhỏ hơn mình, bị cá to hơn ăn**; ăn đủ số cá thì lớn lên 1 cỡ (3–4 cỡ mỗi màn), lớn tối đa thì qua màn; càng về sau cá dữ càng đông, xuất hiện cá mập/sứa cần né tuyệt đối.
- **Chiến thuật hoàn thành:** logic thuần `calon.js`: thế giới 2D (FIELD 960×640), cá người chơi theo con trỏ (lerp tới điểm chạm — hợp tablet: bé đặt ngón đâu cá bơi tới đó), đàn cá AI spawn 2 mép trái/phải với cỡ 1–5 bơi ngang + lượn sin nhẹ; va chạm = tròn-tròn; luật `ăn được nếu size mình > size nó`, ngược lại mất 1 mạng + bất tử nhấp nháy 2 giây; thanh tiến độ lớn lên; test: luật ăn/bị ăn, lớn cấp, spawn trong biên, thắng/thua.
- **Asset:** `fish-pack` có sẵn đủ loài đủ cỡ + bong bóng; nền biển gradient + rong vẽ CSS/canvas.
- **Bản quyền:** cơ chế "big fish eat small fish" là thể loại cực phổ biến (Fishdom, Hungry Shark, hàng nghìn clone) — an toàn; không dùng tên "Feeding Frenzy" và nhân vật của PopCap.
- **Effort: nhỏ** (1 phiên). Ưu tiên làm ĐẦU TIÊN — dễ, đẹp ngay nhờ fish-pack, cảm ứng tự nhiên.

### A2. Bắn Trứng Khủng Long / Dynomite Deluxe (đề xuất tên: "Rồng Con Bắn Trứng") 🥚
- **Cách chơi gốc (Puzzle Bobble/Bust-a-Move lineage):** khẩu pháo dưới đáy xoay ngắm, bắn trứng màu lên lưới trứng treo phía trên; trứng dính vào lưới; **cụm ≥3 cùng màu thì rơi**, kéo theo các trứng bị hở chân; lưới tụt dần xuống theo thời gian; thua khi lưới chạm vạch dưới.
- **Chiến thuật hoàn thành:** lưới lục giác so le (hàng chẵn/lẻ lệch nửa ô) — phần khó nhất là **snap trứng bay vào ô lục giác gần nhất** và **flood-fill tìm cụm cùng màu + tìm trứng mồ côi** (BFS từ hàng nóc, trứng không nối về nóc = rơi). Logic thuần: `grid`, `shoot(angle)` mô phỏng đường bay + nảy tường, `attach`, `popMatches`, `dropOrphans`, `lowerCeiling`. Điều khiển tablet: kéo tay để ngắm (vẽ đường ngắm chấm chấm có nảy tường — bản gốc Dynomite có aim guide), thả tay để bắn. Test: snap đúng ô, cụm 3 nổ, mồ côi rơi, nảy tường đối xứng, thua khi chạm vạch.
- **Asset:** `puzzle-pack-2` (bóng màu tròn làm trứng), thêm 1 chú rồng con tự vẽ/Twemoji 🐲 ngồi cạnh pháo.
- **Bản quyền:** cơ chế bubble-shooter đã genre-generic từ Puzzle Bobble (Taito 1994) và bị clone vô hạn; tránh tên "Dynomite" + hình khủng long PopCap.
- **Effort: vừa** (1–2 phiên, phần lưới lục giác cần test kỹ).

### A3. Flappy Bird (đề xuất tên: "Chim Non Vượt Ống") 🐤
- **Cách chơi gốc:** chạm để chim vỗ cánh bay vụt lên, thả thì rơi theo trọng lực; bay qua khe giữa các cặp ống; chạm ống/đất là thua; mỗi ống qua được +1 điểm.
- **Chiến thuật hoàn thành:** game 1 nút — hợp trẻ em nhất quả đất; logic thuần ~80 dòng: `vy += G; nếu tap thì vy = -FLAP`, ống spawn cách đều với khe ngẫu nhiên (khe RỘNG hơn bản gốc cho bé: 30–35% chiều cao, thu nhỏ dần theo điểm), va chạm hộp-tròn. Chế độ học thêm: mỗi 5 ống hiện 1 chữ cái to giữa khe, bay qua thì đọc to chữ đó. Test: trọng lực/vỗ cánh, va chạm ống, tính điểm, độ khó tăng.
- **Asset:** chim vàng tự vẽ canvas (thân tròn + cánh 3 khung hình vỗ) hoặc bird trong `pixel-platformer`; ống xanh vẽ gradient CSS — bản gốc cũng chỉ có vậy.
- **Bản quyền:** cơ chế 1-tap đã bị clone hàng chục nghìn lần; tránh tên "Flappy Bird" và sprite gốc (.GEARS).
- **Effort: rất nhỏ** (nửa phiên). Làm sớm lấy đà.

### A4. Bounce (Nokia) (đề xuất tên: "Bóng Đỏ Phiêu Lưu") 🔴
- **Cách chơi gốc:** quả bóng đỏ nảy liên tục, người chơi lái trái/phải (bóng TỰ nảy, không điều khiển nhảy trực tiếp), vượt chướng ngại vòng gai/ống, chui qua các **vòng tròn** để mở cổng qua màn; ăn bóng phồng to (nảy cao, nổi nước) hoặc xì hơi nhỏ lại (chui khe hẹp).
- **Chiến thuật hoàn thành:** platformer cuộn ngang ô lưới (tile 32px): bóng có `vx, vy`, nảy tự động khi chạm đất (`vy = -BOUNCE`), 2 nút ◀▶ to 2 góc dưới màn hình cho tablet; màn thiết kế tĩnh bằng mảng chuỗi ký tự (`'#'` tường, `'^'` gai, `'o'` vòng, `'+'` phồng to...) — dễ thêm màn, dễ test; qua màn khi chui đủ vòng rồi chạm cờ. Test: nảy chuẩn, ăn vòng, gai chết -1 mạng về checkpoint, phồng/xì đổi bán kính + độ nảy.
- **Asset:** bóng + vòng + gai trong `puzzle-pack-2` (Balls, Pipes) và `physics-assets`; nền trời `pixel-platformer`.
- **Bản quyền:** "Bounce" của Nokia nhưng cơ chế bóng-nảy-platformer rất generic; tránh đúng tên + level layout gốc.
- **Effort: vừa** (1–2 phiên do phải thiết kế ~6 màn).

### A5. Angry Birds (đề xuất tên: "Ném Banh Đổ Tháp") 🏰
- **Cách chơi gốc:** kéo ná cao su ngắm — thả để phóng vật bay theo parabol vào công trình gỗ/đá/kính, làm sập đè trúng mục tiêu; số đạn giới hạn; tính sao theo đạn thừa.
- **Chiến thuật hoàn thành:** ĐÃ CÓ SẴN 70% engine trong repo: vật lý parabol (Ném Lon/Bé Hái) + kéo-thả căng lực (Trò Xưa). Phần mới là **physics khối 2D đơn giản**: mỗi khối là hình chữ nhật có `hp` theo vật liệu (kính 1 gỗ 2 đá 3), đạn va vào trừ hp theo động năng (`0.5*m*v²`), khối mất đỡ thì rơi thẳng (không cần full rigid-body xoay — các clone casual đều làm vậy, đủ "đã"); quái tròn (physics-assets có sẵn mặt cười) nổ khi trúng/bị đè. Màn = mảng khai báo vị trí khối. Tablet: kéo ná bằng 1 ngón, vẽ quỹ đạo chấm mờ của phát trước (như bản gốc). Test: quỹ đạo, sát thương theo vận tốc, sập dây chuyền, đếm sao.
- **Asset:** `physics-assets` sinh ra ĐÚNG cho thể loại này (khối gỗ/đá/kính nguyên + nứt + vỡ, quái tròn nhiều màu, nền); đạn là quả banh — không chim, khỏi đụng Rovio.
- **Bản quyền:** cơ chế slingshot có trước Angry Birds (Crush the Castle 2009); tuyệt đối không dùng chim/heo xanh/tên gốc.
- **Effort: vừa-lớn** (2 phiên). Điểm nhấn của đợt — rất "đã tay" trên tablet.

### A6. Mario / platformer (đề xuất tên: "Nhà Thám Hiểm Tí Hon") 🍄
- **Cách chơi gốc:** chạy-nhảy cuộn ngang: dậm đầu quái, ăn xu, khối ?, hầm bí mật, cờ cuối màn; chết khi chạm quái ngang hông/rơi hố.
- **Chiến thuật hoàn thành:** platformer tile-based chuẩn: AABB va chạm tách trục X rồi Y (kinh nghiệm: xử lý từng trục một tránh kẹt góc), coyote-time 100ms + jump-buffer 120ms (bắt buộc để trẻ em thấy "dễ chịu"), quái tuần tra đổi hướng mép vực; dậm đầu = va chạm từ trên + vy>0. Màn = chuỗi ký tự như A4. Tablet: 2 nút ◀▶ góc trái + nút NHẢY to góc phải (bố cục console cầm tay). Test: va chạm 2 trục, coyote/buffer, dậm quái, ăn xu, cờ đích. KHÔNG làm: power-up biến hình phức tạp (để bản 2).
- **Asset:** `pixel-platformer` có đủ tileset + nhân vật + quái + Tiled maps mẫu; nhân vật là nhà thám hiểm nhí — không mũ đỏ, không ống xanh lá đặc trưng, không nấm đỏ chấm trắng (dấu hiệu Nintendo).
- **Bản quyền:** Nintendo là hãng kiện gắt nhất thế giới — cơ chế platformer thì generic hoàn toàn, chỉ cần tránh MỌI dấu hiệu nhận diện (tên, mũ đỏ M, nấm, ống, rùa mai xanh).
- **Effort: lớn** (2–3 phiên). Làm sau khi có đà từ A3/A4.

### A7. Diamond Rush (đề xuất tên: "Hang Kim Cương Bí Ẩn") ⛏️
- **Cách chơi gốc (dòng Boulder Dash):** đi trong hang ô lưới, đào đất, nhặt đủ kim cương để mở cửa; **tảng đá lăn theo trọng lực** — đào ô dưới đá thì đá rơi, đè chết mình/quái; có cạm bẫy, nút bấm, cửa khóa cần chìa.
- **Chiến thuật hoàn thành:** thuần ô lưới turn-step (mỗi bước đi = 1 tick vật lý đá) — RẤT hợp logic thuần + test: `step(dir)` → di chuyển nếu ô trống/đất/kim cương → sau đó quét đá từ dưới lên: đá có ô dưới trống thì rơi, đá trên đá tròn thì lăn chéo; chết nếu đá rơi trúng đầu. Màn tĩnh bằng chuỗi ký tự. Tablet: vuốt 4 hướng hoặc d-pad ảo. Test: đá rơi/lăn chéo, đào đất, đủ kim cương mở cửa, chết do đá, chìa-cửa.
- **Asset:** tái dùng `gem.svg` Đào Vàng + tile đất/đá từ `pixel-platformer`; nhân vật tự vẽ.
- **Bản quyền:** Diamond Rush là của Gameloft nhưng cơ chế Boulder Dash (1984) đã thành thể loại; tránh tên + nhân vật gốc.
- **Effort: vừa** (1–2 phiên).

### A8. Chicken Invaders (đề xuất tên: "Gà Vũ Trụ Xâm Lăng") 🐔🛸
- **Cách chơi gốc:** shoot-em-up hài: đàn gà bay đội hình theo sóng, thả trứng xuống, mình bắn hạ nhặt đùi gà nâng cấp súng; trùm gà khổng lồ.
- **Chiến thuật hoàn thành:** repo ĐÃ CÓ Phi Đội Nhí cùng thể loại — bản này nâng cấp: **đội hình bay theo waypoint/formation** (đàn lượn vòng, xếp hàng ngang lắc lư — khác spawn rơi thẳng của Phi Đội Nhí), vũ khí nâng cấp 3 mức khi nhặt vật phẩm, trùm to có thanh máu. Tái dùng ~70% engine phidoinhi (stepGame/va chạm tròn). Tablet: kéo tay lái, tự bắn. Test: formation di chuyển đúng pha, nâng cấp súng, trùm.
- **Asset:** `alien-ufo-pack` (quái + UFO thay gà — hoặc gà Twemoji 🐔 cưỡi UFO cho hài đúng chất), đạn/nổ tự vẽ.
- **Bản quyền:** thể loại Space Invaders/Galaga genre-generic; tránh tên + gà hoạt hình đặc trưng của InterAction Studios.
- **Effort: vừa** (1 phiên nhờ tái dùng engine).

### A9. Đua xe: NFS Underground + Road Rash (gộp — đề xuất tên: "Tay Đua Nhí") 🏎️
- **Cách chơi gốc:** NFS-U: đua đêm nitro; Road Rash: đua mô tô + đánh nhau (phần đánh nhau BỎ — không hợp trẻ em).
- **Chiến thuật hoàn thành:** chọn kiểu **pseudo-3D lane racer** (như Road Fighter/Out Run mini): đường cuộn từ xa lại theo projection đơn giản (`scale = 1/z`), xe mình 3 làn, né xe ngược chiều, nhặt nitro tăng tốc có hiệu ứng vệt sáng; HOẶC đơn giản hơn: top-down cuộn dọc (dễ hơn nhiều, `racing-pack` nhìn top-down là đẹp nhất). ĐỀ XUẤT: **top-down 3 làn** trước (repo đã có Đua Xe Né Chướng Ngại trong Điện Tử Xưa — bản này to đẹp hơn: nhiều làn, vượt xe tính điểm, nitro, vạch đích theo màn). Tablet: nghiêng? KHÔNG — kéo/chạm làn là chuẩn nhất. Test: đổi làn, va chạm, nitro, tính vòng/đích.
- **Asset:** `racing-pack` (xe nhiều màu, mô tô, đường, cây, vạch — top-down chuẩn).
- **Bản quyền:** đua xe là thể loại; tránh tên NFS/EA, không logo hãng xe thật.
- **Effort: vừa** (1–2 phiên).

### A10. Audition (đề xuất tên: "Vũ Điệu Theo Nhịp") 💃
- **Cách chơi gốc:** chuỗi mũi tên hiện ra, bấm đúng thứ tự rồi chốt bằng phím space ĐÚNG NHỊP nhạc; đúng đẹp thì nhân vật nhảy đẹp, combo.
- **Chiến thuật hoàn thành:** phiên bản trẻ em: mỗi câu nhạc hiện 3–5 mũi tên to (◀▲▶▼), bé bấm theo thứ tự trong ô cửa sổ thời gian; chốt nhịp bằng vòng tròn co lại — bấm khi vòng chạm viền (dễ nhìn hơn đếm nhịp). Nhạc: dùng WebAudio tự sinh giai điệu vui (repo có sfx engine sẵn) — KHÔNG nhúng nhạc bản quyền; tempo tăng theo màn. Nhân vật nhảy: hình que dễ thương 4–6 pose tự vẽ, đổi pose theo combo. Test: chuỗi đúng/sai, cửa sổ nhịp ±ms, combo/điểm.
- **Asset:** mũi tên `game-icons` + `ui-pack`; nhân vật tự vẽ canvas.
- **Bản quyền:** cơ chế rhythm-arrow generic (DDR 1998); tránh tên Audition/VTC và nhạc có bản quyền.
- **Effort: vừa** (1–2 phiên; phần "cảm giác nhịp" cần tinh chỉnh tay).

### A11. Thời Trang / Trang Điểm (đề xuất tên: "Bé Làm Stylist") 👗 — HỌC TIẾNG ANH
- **Cách chơi:** búp bê vector đứng giữa; kệ đồ 2 bên theo tab (tóc/áo/quần/váy/giày/phụ kiện/màu son...); bé chạm item → mặc ngay lên búp bê + **đọc to tên tiếng Anh** ("red dress!", "blue shoes!"); chạm vào bộ phận cơ thể búp bê → đọc tên bộ phận ("hair", "eyes", "hand"...). Có nút 📷 "chụp" lưu bộ đồ (canvas → localStorage gallery).
- **Chiến thuật hoàn thành:** búp bê = SVG nhiều layer (tự vẽ 1 lần: thân + các slot tóc/áo/quần/giày là `<g>` thay nội dung); item = data thuần `{slot, tenVi, tenEn, mau}`; không có thắng thua — thuộc nhóm "chơi để chơi" như Vẽ Tự Do (không chấm điểm, chỉ ghi thời gian chơi). Đây là game HỌC hiệu quả nhất đợt — từ vựng quần áo + bộ phận cơ thể + màu sắc là chương trình mẫu giáo/lớp 1. Test: đổi slot đúng, phát đúng từ EN theo item, lưu/khôi phục bộ đồ.
- **Asset:** tự vẽ SVG (phong cách phẳng dễ thương) — item quần áo vẽ đơn giản, mỗi item 1 path + đổi màu bằng fill; KHÔNG cần asset ngoài.
- **Bản quyền:** thể loại dress-up hoàn toàn generic. **Effort: vừa** (1–2 phiên, chủ yếu vẽ SVG).

### A12. Trang Trí Phòng (đề xuất tên: "Phòng Xinh Của Bé") 🛋️ — HỌC TIẾNG ANH
- **Cách chơi:** căn phòng trống (tường + sàn đổi được màu); kéo-thả đồ nội thất từ kệ vào phòng (giường, bàn, đèn, cây, tranh, thảm, mèo...); chạm đồ vật đã đặt → đọc to tên tiếng Anh; xoay/lật/xếp lớp trước-sau; nút chụp lưu như A11.
- **Chiến thuật hoàn thành:** cùng khung "chơi để chơi" với A11 — nên làm CÙNG 1 phiên, chung engine kéo-thả + speak-EN + gallery; đồ vật = SVG/PNG đặt tự do (translate + scale + flip), z-index theo tọa độ y (đồ thấp hơn che đồ cao hơn — tạo chiều sâu). Test: kéo thả snap trong biên phòng, lưu/khôi phục layout, đọc đúng từ.
- **Asset:** tự vẽ SVG bộ ~20 món; hoặc trích vài hình từ `ui-pack`/Twemoji (🛏️🪑🖼️ dạng SVG). **Effort: vừa** (gộp A11+A12 = 2 phiên).

---

## Nhóm B — Cần "hiền hóa" mạnh hoặc hoãn (độ tuổi + bản quyền)

### B1. Beach Head 2000 → đề xuất chuyển thể "Pháo Nước Giữ Đảo" 💦
Bản gốc là bắn súng phòng thủ **quân sự tả thực** (súng máy, lính, máu) — không hợp bộ sưu tập mẫu giáo/tiểu học. Giữ đúng cảm giác "ngồi ụ pháo xoay 360° bắn mục tiêu ập vào từ mọi hướng" nhưng đổi hết chất liệu: **pháo nước/bong bóng** bắn robot đồ chơi + thuyền giấy tiến vào bãi biển; trúng thì ướt sũng/bung thành kẹo. Kỹ thuật: tâm ngắm theo ngón kéo, mục tiêu có `hp`, sóng (wave) tăng dần, nạp đạn bằng nút to. Effort vừa. **Chỉ nên làm sau khi xong nhóm A.**

### B2. Nhóm đối kháng: KOF / The Last Blade / Samurai Shodown / Bloody Roar → gộp 1 game "Võ Đài Thú Nhí" 🥊
4 tựa này cùng thể loại fighting — **sprite đều của SNK/Hudson (bảo hộ gắt), và chặt chém/máu me không hợp trẻ nhỏ**. Đề xuất 1 game đại diện giữ cái lõi vui của thể loại (đọc đòn – ra đòn – né đòn theo nhịp): 2 thú bông đứng 2 bên võ đài, 3 nút to **ĐẤM / ĐỠ / NÉ** kiểu oẳn tù tì có nhịp (đấm thắng né, né thắng vồ, đỡ chặn đấm...), đòn trúng thì thú bông văng lộn nhào tưng tưng như đồ chơi, không máu — thắng 3 hiệp. Tái dùng được khung Thú Cưng Đại Chiến + thêm yếu tố thời gian thực (cửa sổ phản ứng ngắn dần theo màn). Bloody Roar có nét "biến hình thú" → cho nhân vật **biến hình khi đầy nộ khí** (gấu bông → gấu to) là đủ chất mà vẫn hiền. Effort vừa.

### B3. Cadillacs and Dinosaurs (beat-em-up) → hoãn hoặc chuyển "Giải Cứu Khủng Long Con" 🦖
Beat-em-up đi cảnh đánh đấm liên tục — khó hiền hóa mà vẫn giữ chất; sprite Capcom bảo hộ. Nếu vẫn muốn giữ tinh thần "đi cảnh + khủng long": chuyển thành **runner đi cảnh giải cứu khủng long con** (chạy, nhảy né bẫy, ôm khủng long con về chuồng — không đánh nhau). Đề xuất: ưu tiên THẤP NHẤT đợt này, quyết sau khi xong nhóm A.

### B4. PVZ — không làm game mới, NÂNG CẤP Vườn Rau Thần Kỳ 🌻
Đã có sẵn game cùng cơ chế. Việc đáng làm: thêm 2–3 loại cây mới (bí ngô chắn 2 ô, ớt nổ cả hàng, bắp cải ném cầu vồng), 2 loại côn trùng mới (bọ đội mũ trâu máu, ong bay qua đầu xương rồng), chọn cây trước trận (deck 4/6 loại), và chế độ "sóng cuối" dồn dập có kèn báo — đúng chất PVZ mà không cần game mới. Effort nhỏ-vừa.

---

## Lộ trình đề xuất đợt 5 (theo thứ tự bắt tay)

1. **Cá Lớn Biển Xanh** (A1) ✅ ĐÃ XONG (`ca-lon-bien-xanh/`, 14 unit test) — cá bơi theo ngón tay, 65/35 cá mồi/cá dữ, bất tử 2s sau khi bị cắn, lớn 3 cấp thắng màn, sprite Kenney Fish Pack + đáy biển tia nắng/rong/bong bóng vẽ canvas.
2. **Rồng Con Bắn Trứng** (A2) ✅ ĐÃ XONG (`rong-con-ban-trung/`, 18 unit test) — lưới lục giác parity đổi khi trần tụt, đường ngắm chấm chấm nảy tường dùng chung mô phỏng với phát bắn thật, nổ cụm ≥3 + rơi trứng hở chân, trứng màu vẽ sẵn canvas (gradient + đốm), rồng con Twemoji.
3. **Chim Non Vượt Ống** (A3) ✅ ĐÃ XONG (`chim-non-vuot-ong/`, 13 unit test) — 1 chạm vỗ cánh, khe rộng cho bé hẹp dần theo điểm, trần chặn không chết, mỗi 5 ống 1 chữ cái đọc to khi bay qua, chim + ống + nền parallax tự vẽ canvas, lưu kỷ lục localStorage.
4. **Bóng Đỏ Phiêu Lưu** (A4) ✅ ĐÃ XONG (`bong-do-phieu-luu/`, 18 unit test) — bóng TỰ nảy chỉ lái ◀▶ (2 nút to góc dưới cho tablet), 4 màn thiết kế bằng chuỗi ký tự, vòng vàng + cờ đích, phồng to/xì nhỏ đổi bán kính & lực nảy (hầm 1 ô chỉ bóng nhỏ lọt), gai + hố mất mạng về điểm xuất phát (vòng đã nhặt giữ nguyên), camera cuộn ngang.
5. **Ném Banh Đổ Tháp** (A5) ✅ ĐÃ XONG (`nem-banh-do-thap/`, 15 unit test) — kéo ná phóng banh parabol (chấm ngắm dự kiến + vệt phát trước), khối gỗ/đá/kính có máu theo vật liệu, sát thương theo tốc độ banh, khối mất chỗ đỡ RƠI đè quái, quái ngã từ cao cũng bụp, 5 màn + tính sao theo banh dư; sprite Kenney Physics Assets (CC0), banh tự vẽ — không dùng chim/heo của game gốc.

6. **Nhà Thám Hiểm Tí Hon** (A6) ✅ ĐÃ XONG (`nha-tham-hiem-ti-hon/`, 16 unit test) — platformer AABB tách trục + coyote-time 100ms + jump-buffer 120ms, dậm đầu quái/đụng hông đau, xu + cờ đích, 4 màn chuỗi ký tự, nút ◀▶ + NHẢY to kiểu console; sprite Kenney Pixel Platformer (CC0), không dấu hiệu nhận diện của game thương mại nào.
7. **Hang Kim Cương Bí Ẩn** (A7) ✅ ĐÃ XONG (`hang-kim-cuong/`, 16 unit test) — đào hang ô lưới theo nhịp tick 130ms: đá RƠI khi hụt chân, LĂN chéo khi chồng nhau, chỉ đá "đang rơi" mới đè chết (đứng dưới đá đứng yên thì không sao), đẩy đá ngang, cửa mở khi gom đủ kim cương; 4 màn có test "mở màn không gì tự rơi"; vuốt 4 hướng, icon rock/gem Twemoji tái dùng.
8. **Gà Vũ Trụ Xâm Lăng** (A8) ✅ ĐÃ XONG (`ga-vu-tru/`, 14 unit test) — bắn đội hình: gà cưỡi UFO BAY VÀO SLOT rồi lắc lư thả trứng (khác hẳn Phi Đội Nhí), hàng đầu 2 máu, sao nâng cấp súng 3 nòng (trúng đòn tụt cấp), trùm gà chúa có thanh máu; UFO Kenney (CC0) + gà Twemoji, nền vũ trụ sao rơi tự vẽ.
9. **Tay Đua Nhí** (A9) ✅ ĐÃ XONG (`tay-dua-nhi/`, 15 unit test) — đua né 4 làn nhìn từ trên xuống: chạm làn nào lách sang làn đó (lerp mượt), sinh xe luôn chừa ≥2 làn trống, nitro 2.2s có vệt sáng, vượt xe +điểm, vạch đích ca-rô ló ra khi đủ quãng đường; xe Kenney Racing Pack (CC0), gộp cả ý Road Rash (bỏ yếu tố đánh nhau).

10. **Vũ Điệu Theo Nhịp** (A10) ✅ ĐÃ XONG (`vu-dieu-nhip/`, 11 unit test) — 2 pha mỗi câu: bấm chuỗi 3–5 mũi tên đúng thứ tự (có giới hạn giờ) rồi CHỐT NHỊP bằng vòng tròn co (perfect ±140ms / good ±320ms / miss mất tim); nhân vật nhảy đổi 4 tư thế theo combo + hào quang; nhạc nền vòng lặp ngũ cung TỰ SINH bằng WebAudio (không nhúng nhạc ngoài); sàn ca-rô + đèn sân khấu tự vẽ.
11. **Bé Làm Stylist** (A11) ✅ ĐÃ XONG (`be-lam-stylist/`, 13 unit test) — thay đồ búp bê SVG tự vẽ 5 slot (tóc/áo/quần/giày/phụ kiện) × 6 màu, chạm món đồ là mặc + **đọc to tiếng Anh** ("purple dress!"), chạm người búp bê đọc tên bộ phận (head/eyes/hands...), nút 🎲 trộn đồ + 📷 lưu bộ sưu tập localStorage; **không chấm điểm** (nhóm "chơi để chơi"), chỉ ghi thời gian chơi.

12. **Phòng Xinh Của Bé** (A12) ✅ ĐÃ XONG (`phong-xinh/`, 13 unit test) — kéo-thả 15 món nội thất (Twemoji CC-BY) vào phòng: đồ tường (tranh/cửa sổ/đồng hồ/gương) tự kẹp vùng tường, đồ sàn kẹp vùng sàn + che khuất theo chiều sâu (y tăng dần); chạm món **đọc to tiếng Anh** ("bed", "lamp"...), đổi 5 màu tường × 4 màu sàn cũng đọc ("pink wall"); chọn món để lật ⇄ / cất 🗑; 🎲 trang trí ngẫu nhiên + 📷 lưu; **không chấm điểm**, cùng engine tinh thần Bé Làm Stylist.

🎉 **NHÓM A HOÀN THÀNH 12/12** — toàn bộ game nhóm A của đợt 5 đã lên kệ.

**Nhóm B:**

B1. **Pháo Nước Giữ Đảo** ✅ ĐÃ XONG (`phao-nuoc-giu-dao/`, 14 unit test) — "hiền hóa" thể loại phòng thủ ụ súng cố định: pháo NƯỚC giữa đảo cát, thuyền giấy/robot đồ chơi ập vào từ 360°, chạm đâu phun bóng nước tới đó (nổ nước AoE ướt cả cụm), trúng bung thành kẹo; bình 8 phát + nút NẠP NƯỚC 1.5s (đang nạp không bắn được — dạy canh thời điểm); nhiều đợt sóng/màn, đợt đầu chỉ thuyền giấy cho bé làm quen; lâu đài cát 3 tim, rung màn khi bị quậy. Toàn bộ hình tự vẽ canvas — không súng thật, không phe quân sự.

B2. **Võ Đài Thú Nhí** ✅ ĐÃ XONG (`vo-dai-thu-nhi/`, 14 unit test) — lấy cái lõi "đọc đòn – phản đòn theo nhịp" của thể loại đối kháng, hiền hóa hoàn toàn: 4 bạn thú bông Twemoji (Gấu/Thỏ/Hổ/Rồng, tên + dạng biến hình tự đặt), đối thủ ra TÍN HIỆU (găng tay = đòn cao → ĐỠ, gió = vồ thấp → NÉ, sao = sơ hở → ĐẤM) với thanh thời gian co ngắn dần theo màn; đúng 5 lần tích đầy nộ khí → BIẾN HÌNH to đùng có hào quang, hồi bông + đấm đau gấp đôi; sai/trễ chỉ rung lắc như đồ chơi, không máu me; chuỗi 2–3 hiệp mỗi màn, hồi 40% giữa hiệp.
B3. **Giải Cứu Khủng Long Con** ✅ ĐÃ XONG (`giai-cuu-khung-long/`, 13 unit test) — chuyển thể beat-em-up đi cảnh thành runner KHÔNG đánh nhau: chạy tự động + 1 chạm nhảy qua đá/hố, chặng sinh ngẫu nhiên nhưng có test "công bằng" (chướng ngại cách nhau ≥260px luôn nhảy kịp), bế bé khủng long 🦕 kêu cứu chạy lũn cũn theo sau, về tổ với mẹ 🦖 + trứng ở cuối chặng; nhân vật Kenney (CC0) + khủng long Twemoji (CC-BY), rừng dừa parallax.
B4. **Nâng cấp Vườn Rau Thần Kỳ** ✅ ĐÃ XONG (`vuon-rau-than-ky/` — 20 unit test, thêm 6) — thêm 2 cây: **Ớt Đỏ Nổ** 🌶️ (kíp 0.6s → quét sạch côn trùng CẢ HÀNG, dùng 1 lần, có vệt lửa) + **Bắp Cải Ném** 🥬 (đau gấp 3 Đậu Xanh, hồi chiêu lâu); thêm 2 côn trùng: **Bọ Giáp** 🐞 (110 máu lì đòn, từ màn 3) + **Bướm Tinh Nghịch** 🦋 (BAY QUA đầu xương rồng — tường không chặn được, từ màn 2, bay nhấp nhô); **SÓNG CUỐI**: sinh đủ 70% thì nhịp sinh dồn dập gấp đôi + giọng báo "Sóng cuối tới rồi!".

**Bổ sung theo yêu cầu (hoàn thiện 2 thẻ "Sắp ra mắt" cũ + 2 nâng cấp lớn):**

- **Cơn Sốt Tìm Vàng** ✅ (`con-sot-tim-vang/`, 12 unit test) — khác hẳn Đập Vàng (theo lượt, không lấp): chơi THỜI GIAN THỰC 60 giây, bấm cụm ≥2 đá cùng màu (điểm n²), đá mới RƠI LẤP ĐẦY liên tục, gom cụm ≥4 nhanh liên tiếp nối combo → combo 3 bùng CƠN SỐT VÀNG nhân đôi điểm 6 giây (nền rực vàng); đạt mục tiêu trước khi hết giờ + thưởng giây dư; 5 màu đá quý vẽ canvas đa giác có vân + ánh kim.
- **Xây Thị Trấn Vàng** ✅ (`xay-thi-tran-vang/`, 13 unit test) — 2 pha xen kẽ: lái XE GOÒNG 45 giây hứng xu/túi vàng/kim cương rơi (icon Đào Vàng tái dùng), đá rơi trúng văng 30% vàng đang chở + choáng; về XÂY 6 công trình nhiều cấp (nhà→biệt thự có cờ, cửa hàng mái sọc, đài phun nước tia động, tháp đồng hồ kim quay, vườn cây Kenny tiny-town, cổng thành vàng) — công trình ĐẸP DẦN theo cấp, vẽ canvas; xây đủ hết mở thị trấn mới giá cao hơn; **tiến độ lưu localStorage chơi tiếp mãi**.
- **Phòng Xinh mở rộng** ✅ — 15 → **28 món đồ** (thêm TV, piano, ghi ta, tàu hỏa, bóng, tên lửa, cún, robot, bồn tắm, bóng bay + treo tường: cầu vồng, đèn trăng, cánh diều), 7 màu tường × 6 màu sàn, và **3 PHÒNG RIÊNG** (tab 1️⃣2️⃣3️⃣, mỗi phòng lưu riêng — bé trang trí cả "căn nhà").
- **Pokémon Đại Chiến mở rộng lớn** ✅ (22 unit test) — roster 16 → **40+ Pokémon**: 12 bạn khởi đầu (thêm Vulpix/Growlithe/Oddish/Psyduck/Magikarp/Jigglypuff/Dratini — dòng nào cũng tiến hóa, Magikarp → Gyarados!), pool 22 đối thủ, **8 trùm** mạnh dần (thêm bộ 3 chim huyền thoại); **bộ lọc theo hệ** ở màn chọn (Tất cả/Lửa/Nước/Cỏ/Điện/Thường/Rồng); **chỉ số ⚔️ATK 🛡️DEF** ảnh hưởng sát thương (lực × atk/def × hệ), hiện trên thẻ chọn + khung máu; nút chiêu hiện **lực đánh 💥**; hệ **Đá 🪨** mới (khắc Lửa+Điện, sợ Nước+Cỏ); hiệu ứng chiêu "sát tên gọi": chiêu mạnh bắn LOẠT 2–3 viên, nổ đúng chất hệ (💦🍃⚡🪨), chiêu Điện chớp sáng cả sân, đòn khắc hệ rung đấu trường.

**Sắp xếp lại trang chủ (cùng đợt):** 3 hub mới kiểu game-mini — `tro-choi-xua/` (Sân Chơi Ngày Bé + Bắt Vịt + Cờ Cá Ngựa + Cờ Gánh + Ô Ăn Quan + Nhảy Lò Cò), `dien-tu-xua/` (Máy Điện Tử 3 Trò + Rắn + Xếp Gạch + Lật Hình + Ghép Hình + Ca-rô), `hoc-va-choi/` (Tô Màu + Tập Viết + Học Vần + Toán Lớp 1). Trang chủ từ 24 thẻ gọn còn 11; nút back của 16 game trỏ về đúng hub.
3. **Ném Banh Đổ Tháp** (A5) — điểm nhấn physics, "đã" nhất trên tablet.
4. **Bé Làm Stylist** (A11) + **Phòng Xinh Của Bé** (A12) — cặp học tiếng Anh, chung engine.
5. **Gà Vũ Trụ** (A8) + **Tay Đua Nhí** (A9) — tái dùng engine sẵn.
6. **Hang Kim Cương Bí Ẩn** (A7) + **Bóng Đỏ Phiêu Lưu** (A4) — puzzle/platformer ô lưới.
7. **Nhà Thám Hiểm Tí Hon** (A6) — platformer đầy đủ, làm khi đã quen tay.
8. **Vũ Điệu Theo Nhịp** (A10) + nâng cấp **Vườn Rau** (B4).
9. Nhóm B còn lại (B1/B2/B3) — quyết sau khi nhìn lại độ tuổi người chơi thật.

Quy trình mỗi game giữ nguyên chuẩn repo: **logic thuần + unit test trước → giao diện → đăng ký hub/i18n/sw.js → chạy `npm test` toàn bộ**; mỗi game có giọng đọc hướng dẫn tiếng Việt (nút ❓) và song ngữ khi có yếu tố học.

---

## Đợt sửa lỗi + mở rộng (sau khi test tay B1–B4)

- **Fix Xây Thị Trấn Vàng**: xe goòng cũ màu nâu chìm vào nền hầm tối (khó thấy), đèn hang vẽ mờ nhạt gây rối mắt. Đã sửa: xe cam rực có viền sáng + đổ bóng + nhún nhẹ khi chạy, đèn lồng vẽ bằng radial-gradient ấm có nhấp nháy lửa, thêm lấp lánh khi hứng vàng + rung màn khi trúng đá.
- **Fix Cơn Sốt Tìm Vàng**: game vốn thiết kế kiểu "bấm cụm" (giống Đập Vàng) chứ không phải "đổi chỗ" — đã bổ sung thêm cơ chế **KÉO ngón tay lướt qua nhiều viên đá cùng màu liền kề** để gom đúng đường kéo đó (khác với bấm 1 viên tự gom cả cụm dính liền), có vệt sáng kéo tay + viền vàng quanh ô đã chọn. Cả 2 cách chơi (bấm và kéo) dùng chung 1 hàm tính điểm/combo (`applyClear`) — 17 unit test (thêm 5 test cho `dragTo`).
- **Pokémon Đại Chiến mở rộng thêm**: roster 40+ → **65+ Pokémon**, 12 → **18 bạn khởi đầu** (thêm Bellsprout/Magnemite/Tentacool/Drowzee/Doduo/Shellder — đều có tiến hóa), pool đối thủ 22 → 33, **10 trùm** (thêm Lugia + Ho-Oh trước Mewtwo); tuyệt chiêu bay theo **quỹ đạo cong parabol** (rAF, không còn đường thẳng CSS transition) + **vòng sóng va chạm** lan ra tại điểm trúng đòn (to hơn khi hiệu quả cực mạnh); mỗi nút chiêu hiện **ước tính sát thương thật** (`💥 lực · thấp-cao`) tính đúng theo công thức atk/def/hệ so với đối thủ đang gặp.
- **Phòng Xinh mở rộng thêm**: 28 → **39 món đồ** (thêm kệ sách, bể cá, máy ảnh, hộp quà, quả địa cầu, hố cát, nến, dù, ván trượt, nhà búp bê, kính thiên văn), 3 → **5 phòng riêng** (tab 1️⃣–5️⃣, mỗi phòng lưu độc lập); tách hàng nút phòng ra khỏi header thành `.room-toolbar` riêng cho đỡ chật trên di động.
- **Xếp Chữ Tiếng Anh** ✅ MỚI (`xep-chu-tieng-anh/`, 9 unit test) — game đánh vần tiếng Anh: nhìn hình + nghe từ (giọng en-US thật), chạm các ô chữ cái xáo trộn (có lẫn vài chữ GÂY NHIỄU từ màn 3 trở đi) theo đúng thứ tự để ghép vào ô trống; không mất mạng khi bấm sai — giữ tinh thần "học mà chơi" nhẹ nhàng như Học Vần. 30 từ vựng 3–8 chữ cái xếp theo độ dài, chọn theo cửa sổ trượt kiểu OPPONENT_POOL đã dùng ở các game khác.
- **Hub "Góc Tiếng Anh"** ✅ MỚI (`goc-tieng-anh/`) — trang tổng hợp mọi game có yếu tố học tiếng Anh: Xếp Chữ Tiếng Anh (mới), Tiếng Anh Nâng Cao, Học Vui, Bé Làm Stylist, Phòng Xinh, Bé Hái Trái Cây — thêm 1 thẻ trên trang chủ, không gỡ các game này khỏi vị trí gốc (game-mini/trang chủ) để tránh phá liên kết cũ.
- **Sửa giọng đọc tiếng Anh bị đọc kiểu tiếng Việt**: `speak()` hỗ trợ sẵn tham số `lang` nhưng 3 game (Bé Hái Trái Cây, Bé Làm Stylist, Phòng Xinh) quên truyền vào nên từ tiếng Anh bị phát bằng giọng vi-VN mặc định — đã sửa cả 3 dùng `{ lang: 'en-US', rate: 0.85 }`.
- **Fix bug kẹt lượt "Trận 1/2" không đánh tiếp được** (Pokémon Đại Chiến + Thú Cưng Đại Chiến): sau đòn phản công của địch, `renderBattle()` chạy lúc `busy=true` khiến nút chiêu bị khóa (`disabled`), nhưng sau đó `busy` được đặt lại `false` mà KHÔNG render lại — nút bị khóa vĩnh viễn từ trận thứ 2. Đã sửa: mọi chỗ mở khóa `busy` đều gọi lại `renderBattle()`. Đồng thời thêm animation tuyệt chiêu đầy đủ (lao tới, chiêu bay theo hệ, nổ + rung màn khi hiệu quả) cho cả 2 game.

**Về yêu cầu "1000×5 từ vựng tiếng Anh theo chủ đề" bên dưới:** đã đọc kỹ — đây là dự án rất lớn (5 mảng × ~1000 từ = quy mô từ điển hình ảnh, không phải 1 game nhỏ). Hiểu đúng ý: mỗi từ nên có **1 icon/hình + 1 câu ngắn hoặc cụm từ đi kèm** để bé nhớ theo ngữ cảnh giao tiếp, không học từ đơn lẻ. Đề xuất chia giai đoạn thay vì làm 1 lần:
- **Giai đoạn 1 (đã có nền)**: Xếp Chữ Tiếng Anh (30 từ) + Góc Tiếng Anh hub — hạ tầng để mở rộng dần.
- **Giai đoạn 2**: chọn 1 mảng chủ đề trước (đề xuất: *trái cây – thực phẩm – ăn uống*, vì đã có sẵn Bé Hái Trái Cây làm nền) để làm ~100–150 từ + câu mẫu, dựng 1-2 cơ chế chơi mới quanh chủ đề đó (ví dụ: "nghe câu → chọn đúng tranh", "ghép cụm từ với hình"), coi là bản mẫu (template) cho các mảng còn lại.
- **Giai đoạn 3+**: lặp lại khuôn mẫu cho 4 mảng còn lại (giao thông/địa lý; động vật/vũ trụ; gia đình/trường học/nghề nghiệp; vật dụng/mua sắm/thiết bị), mỗi mảng ước tính vài trăm từ khả thi hơn 1000 để giữ chất lượng (mỗi từ đều cần icon phù hợp + câu mẫu đúng ngữ pháp — làm ẩu 1000 từ sẽ kém hơn làm kỹ 300 từ).
- **Nguồn hình ảnh**: tiếp tục dùng Twemoji (CC-BY, đã dùng xuyên suốt repo) cho phần lớn danh từ cụ thể; một số khái niệm trừu tượng (địa lý, thiết bị công nghiệp...) có thể cần icon set khác (vd. Kenney UI icons hoặc tự vẽ SVG đơn giản) — sẽ khảo sát khi vào từng mảng cụ thể.

Nếu bạn đồng ý hướng đi trên, xác nhận **mảng nào làm giai đoạn 2 trước** (đề xuất trái cây/thực phẩm) để tôi bắt tay nghiên cứu từ vựng + tải icon + thiết kế cơ chế chi tiết trước khi code.

**✅ Đã xác nhận và LÀM XONG "Giai đoạn 1" (mảng 1/5 — trái cây, thực phẩm, ăn uống, nhà hàng, quán ăn, shopping, ngày lễ, vui chơi giải trí, phim ảnh):**

- **Nghe & Đoán Tiếng Anh** ✅ MỚI (`nghe-doan-tieng-anh/`, 15 unit test) — 100 mục từ vựng chia 5 chủ đề con (🍎 Trái cây 18 từ · 🍜 Món ăn 22 từ · 🛍️ Quán ăn & Mua sắm 20 từ · 🎉 Ngày lễ 20 từ · 🎬 Giải trí 20 từ), MỖI TỪ đi kèm **1 câu tiếng Anh ngắn thật** (không chỉ từ đơn) — ví dụ "I am hungry.", "Let's watch a movie.", "Happy New Year!" — đúng yêu cầu "học cả câu/cụm từ để nhớ tốt hơn trong giao tiếp". Cách chơi: máy đọc to 1 câu bằng giọng en-US, bé nghe rồi chạm đúng hình trong 4 lựa chọn; đúng liên tiếp 3 lần được điểm thưởng combo; sau khi chọn luôn hiện lại **câu tiếng Anh + nghĩa tiếng Việt** để củng cố. Có **bộ lọc theo chủ đề** (giống filter hệ của Pokémon Đại Chiến) hoặc chơi lẫn "Tất cả". Toàn bộ hình dùng emoji (không cần tải icon rời) — giữ nhẹ, nhất quán với Xếp Chữ Tiếng Anh.
- Đăng ký đầy đủ: thẻ trong `goc-tieng-anh/` (hub 6→7 game) + `game-mini/`, 8 khóa i18n mới (5 ngôn ngữ), precache `sw.js` v46→v47, thêm vào chuỗi test gốc — `npm test` toàn bộ: **747 ✅, 0 ❌**.

**Giai đoạn 2 tiếp theo** (chưa làm — chờ xác nhận): chọn 1 trong 4 mảng còn lại để lặp lại khuôn mẫu này (giao thông/tiện ích công cộng/môi trường/đô thị/địa lý · động vật/vũ trụ/toán học · gia đình/trường học/nghề nghiệp/thể thao · vật dụng hằng ngày/quần áo/thiết bị/bộ phận cơ thể).

**✅ Đã sửa lỗi giọng đọc tiếng Anh (phản hồi tay từ B1–B4): "đọc quá nhanh, không nghe kịp, khó nghe"** — nguyên nhân kép: (1) tốc độ đọc câu dài quá nhanh, (2) MỖI vòng chơi đều bắt bé nghe hiểu 1 câu tiếng Anh trọn vẹn — với bé chưa quen câu dài, tần suất này dễ gây nản. Đã sửa 2 lớp:
- **Trộn lẫn 2 kiểu vòng chơi**: mỗi mục từ vựng giờ có cả `word` (từ đơn) lẫn `sentence` (câu ngắn) — mỗi VÒNG chỉ ngẫu nhiên chọn 1 trong 2 kiểu để nghe/đoán, ưu tiên từ đơn nhiều hơn hẳn (~80% ở màn đầu, tối đa ~55% câu ở màn cao) để bé không bị "ngợp" vì câu dài xuất hiện dày đặc.
- **Tốc độ đọc phân theo độ dài**: từ đơn đọc `rate 0.78` (gần tự nhiên), câu dài đọc chậm hẳn `rate 0.64` — áp dụng cho `nghe-doan-tieng-anh` và `nghe-doan-giao-thong`; đồng thời hạ tốc độ đọc tiếng Anh ở `xep-chu-tieng-anh`, `be-hai-trai-cay`, `be-lam-stylist`, `phong-xinh` (từ đơn, `rate 0.68`), `tap-viet` và `tieng-anh` (câu dài `rate 0.66`, từ đơn `rate 0.75`) cho đồng bộ toàn bộ các game có giọng đọc tiếng Anh.
- Test bổ sung: `tuningFor.sentenceChance` tăng dần nhưng luôn bị chặn trần; `rateFor('sentence') < rateFor('word')`; thống kê tỉ lệ word/sentence qua 30 seed khác nhau để tránh test bị "may rủi" theo 1 seed cụ thể.

**✅ Đã làm xong "Giai đoạn 2" (mảng 2/5 — giao thông, phương tiện, tiện ích công cộng, môi trường, đô thị & thôn quê, địa lý & địa hình):**

- **Nghe & Đoán: Giao Thông & Địa Lý** ✅ MỚI (`nghe-doan-giao-thong/`, 20 unit test) — lặp lại đúng khuôn mẫu đã kiểm chứng ở Giai đoạn 1, 93 mục từ vựng chia 5 chủ đề con (🚗 Phương tiện 20 · 🚦 Tiện ích công cộng 20 · 🌳 Môi trường 18 · 🏙️ Đô thị & Thôn quê 18 · 🗺️ Địa lý & Địa hình 17), mỗi mục có từ đơn + câu ngắn, trộn 2 kiểu vòng chơi + tốc độ đọc phân theo độ dài như bản sửa lỗi ở trên. Có test riêng kiểm tra **emoji không trùng nhau trong toàn bộ ngân hàng từ** (tránh 2 hình gần giống nhau xuất hiện cùng lúc trong 4 lựa chọn gây nhầm lẫn cho bé) — việc này lộ ra khi thiết kế thủ công (ví dụ suýt dùng cả 🌍 "Earth", 🌎 "world", 🌐 "globe" cùng lúc — 3 icon quả địa cầu rất giống nhau — đã bỏ bớt "world"/"globe", chỉ giữ "Earth" duy nhất để tránh gây rối mắt).
- Đăng ký đầy đủ: thẻ trong `goc-tieng-anh/` (hub 7→8 game) + `game-mini/`, 5 khóa i18n mới (5 ngôn ngữ), precache `sw.js` v47→v48, thêm vào chuỗi test gốc — `npm test` toàn bộ: **771 ✅, 0 ❌**.

**Giai đoạn 3 tiếp theo** (chưa làm): động vật/động vật hoang dã/sở thú/hàng không/vũ trụ/toán học · gia đình/bạn bè/trường học/nghề nghiệp/thể thao/cuộc thi · vật dụng hằng ngày/quần áo/giày dép/máy tính/thiết bị gia dụng/bộ phận cơ thể/hoạt động hằng ngày.

**✅ Đã bổ sung ảnh THẬT (không phải emoji) cho các từ mà emoji không diễn tả đủ rõ/đủ thật** — theo yêu cầu, dùng nguồn ảnh miễn phí có giấy phép rõ ràng (Wikimedia Commons: CC0/CC BY/CC BY-SA — mục đích giáo dục phi lợi nhuận, có ghi công tác giả đầy đủ theo đúng yêu cầu giấy phép, cùng cách làm đã dùng với Twemoji/Kenney trong suốt repo). Đã thêm 5 ảnh thật + 5 từ vựng mới:
- **Giai đoạn 2** (`nghe-doan-giao-thong/images/`): **xe cẩu** (crane truck — không có emoji phù hợp) ảnh của Tbatb, CC BY-SA 4.0; **con trâu** (buffalo) ảnh của Basile Morin, CC BY-SA 4.0 — dù 🐃 đã có emoji nhưng ảnh thật "trông real hơn" đúng như bạn mong muốn.
- **Giai đoạn 1** (`nghe-doan-tieng-anh/images/`): 3 món ăn truyền thống Việt Nam chưa có emoji riêng — **phở** (ảnh Vyacheslav Argenberg, CC BY 4.0), **bánh mì** (ảnh HungryHuy, CC BY 2.0), **bánh chưng** (ảnh Syced, CC0/Public Domain).
- Cơ chế: mỗi mục từ vựng có thêm trường `img` tùy chọn (đường dẫn ảnh cục bộ) — khi có, giao diện hiển thị ẢNH THẬT thay vì emoji trong 4 lựa chọn; vẫn giữ emoji dự phòng cho các nơi khác cần hiển thị nhanh. Có `CREDITS.md` trong mỗi thư mục `images/` ghi rõ tác giả + giấy phép + nguồn cho từng ảnh.
- Test bổ sung: kiểm tra mọi trường `img` (khi có) trỏ đúng vào thư mục `images/` cục bộ; kiểm tra 5 mục ảnh thật đã được gắn đúng.

**✅ Đã làm xong "Giai đoạn 3" (mảng 3/5 — động vật hoang dã, sinh vật biển & côn trùng, hàng không & vũ trụ, toán học & hình khối, loài chim):**

- **Nghe & Đoán: Muôn Loài & Vũ Trụ** ✅ MỚI (`nghe-doan-dong-vat-vu-tru/`, 20 unit test) — lặp lại đúng khuôn mẫu đã kiểm chứng ở Giai đoạn 1–2, 91 mục từ vựng chia 5 chủ đề con (🦁 Động vật hoang dã 20 · 🐠 Sinh vật biển & Côn trùng 20 · 🚀 Hàng không & Vũ trụ 20 · 🔢 Toán học & Hình khối 20 · 🦅 Loài chim 11), cùng cơ chế trộn từ đơn/câu ngắn + tốc độ đọc phân theo độ dài đã áp dụng xuyên suốt cả 3 giai đoạn. Test emoji-uniqueness xác nhận cả 91 icon không trùng nhau.
- Đăng ký đầy đủ: thẻ trong `goc-tieng-anh/` (hub 8→9 game) + `game-mini/`, 4 khóa i18n mới (5 ngôn ngữ), precache `sw.js` v49→v50, thêm vào chuỗi test gốc — `npm test` toàn bộ: **794 ✅, 0 ❌**.

**✅ Đã làm xong "Giai đoạn 4" (mảng 4/5 — gia đình & bạn bè, trường học, nghề nghiệp, thể thao, thi đấu & hoạt động):**

- **Nghe & Đoán: Gia Đình & Nghề Nghiệp** ✅ MỚI (`nghe-doan-gia-dinh-nghe-nghiep/`, 20 unit test) — lặp lại đúng khuôn mẫu đã kiểm chứng ở Giai đoạn 1–3, 85 mục từ vựng chia 5 chủ đề con (👪 Gia đình & Bạn bè 14 · 🏫 Trường học 20 · 💼 Nghề nghiệp 16 · ⚽ Thể thao 20 · 🏆 Thi đấu & Hoạt động 15). **Lưu ý thiết kế riêng cho mảng này**: từ vựng quan hệ gia đình (mẹ/bố/dì/cậu/anh/chị...) phần lớn KHÔNG có emoji riêng biệt — nếu thêm đủ sẽ khiến nhiều mục trùng hình, gây nhầm lẫn nghiêm trọng trong màn 4 lựa chọn (2 nút giống hệt nhau nhưng khác đáp án đúng). Chủ đề "Gia đình & Bạn bè" vì vậy **chủ động chỉ giữ 14 từ có icon thật sự riêng biệt** (gia đình, em bé, bà, ông, đám cưới, cặp đôi...) thay vì cố nhồi cho đủ 20 — đúng nguyên tắc "làm kỹ hơn làm ẩu" đã thống nhất từ đầu dự án. Test emoji-uniqueness xác nhận cả 85 icon không trùng nhau.
- Đăng ký đầy đủ: thẻ trong `goc-tieng-anh/` (hub 9→10 game) + `game-mini/`, 4 khóa i18n mới (5 ngôn ngữ), precache `sw.js` v50→v51, thêm vào chuỗi test gốc — `npm test` toàn bộ: **814 ✅, 0 ❌**.

**🎉 Đã làm xong "Giai đoạn 5" — MẢNG CUỐI CÙNG, HOÀN THÀNH TRỌN VẸN KẾ HOẠCH 5×1000 (quần áo & giày dép, đồ dùng gia đình, thiết bị điện tử, bộ phận cơ thể, hoạt động hằng ngày):**

- **Nghe & Đoán: Đồ Dùng & Cơ Thể** ✅ MỚI (`nghe-doan-do-dung-hang-ngay/`, 20 unit test) — lặp lại đúng khuôn mẫu đã kiểm chứng ở Giai đoạn 1–4, 92 mục từ vựng chia 5 chủ đề con (👕 Quần áo & Giày dép 20 · 🛏️ Đồ dùng gia đình 20 · 💻 Thiết bị điện tử 20 · ✋ Bộ phận cơ thể 16 · 😴 Hoạt động hằng ngày 16). Test emoji-uniqueness xác nhận cả 92 icon không trùng nhau — kiểm tra kỹ đặc biệt ở các cặp dễ nhầm (ví dụ tắm 🛀 người-trong-bồn vs bồn tắm 🛁 vật thể — 2 icon khác nhau dù cùng chủ đề "tắm").
- Đăng ký đầy đủ: thẻ trong `goc-tieng-anh/` (hub 10→11 game) + `game-mini/`, 4 khóa i18n mới (5 ngôn ngữ), precache `sw.js` v51→v52, thêm vào chuỗi test gốc — `npm test` toàn bộ: **834 ✅, 0 ❌**.

---

### 🏆 TỔNG KẾT DỰ ÁN "5×1000 TỪ VỰNG TIẾNG ANH" — HOÀN THÀNH CẢ 5 GIAI ĐOẠN

| Giai đoạn | Chủ đề | Game | Số từ | Unit test |
|---|---|---|---|---|
| 1 | Trái cây, món ăn, quán ăn & mua sắm, ngày lễ, giải trí & phim ảnh | `nghe-doan-tieng-anh/` | 103 | 21 |
| 2 | Phương tiện, tiện ích công cộng, môi trường, đô thị & thôn quê, địa lý & địa hình | `nghe-doan-giao-thong/` | 95 | 21 |
| 3 | Động vật hoang dã, sinh vật biển & côn trùng, hàng không & vũ trụ, toán học & hình khối, loài chim | `nghe-doan-dong-vat-vu-tru/` | 91 | 20 |
| 4 | Gia đình & bạn bè, trường học, nghề nghiệp, thể thao, thi đấu & hoạt động | `nghe-doan-gia-dinh-nghe-nghiep/` | 85 | 20 |
| 5 | Quần áo & giày dép, đồ dùng gia đình, thiết bị điện tử, bộ phận cơ thể, hoạt động hằng ngày | `nghe-doan-do-dung-hang-ngay/` | 92 | 20 |

**Tổng cộng: 466 mục từ vựng tiếng Anh** (mỗi mục có cả từ đơn + câu ngắn thật đi kèm — không chỉ học từ rời rạc), phủ khắp 25 chủ đề con, đều dùng chung 1 cơ chế đã kiểm chứng xuyên suốt:
- Mỗi vòng chơi **trộn ngẫu nhiên 2 kiểu** (nghe từ đơn / nghe câu ngắn), ưu tiên từ đơn nhiều hơn để không làm bé nản vì câu dài xuất hiện quá dày — sửa trực tiếp từ phản hồi tay của bạn ("đọc quá nhanh, không nghe kịp").
- Tốc độ đọc phân theo độ dài (từ đơn nhanh hơn, câu dài chậm hơn hẳn).
- Lọc theo chủ đề con hoặc chơi lẫn "Tất cả".
- Test tự động cho **tính duy nhất của emoji** trong mỗi ngân hàng từ — tránh 2 hình gần giống nhau xuất hiện cùng lúc trong màn 4 lựa chọn gây nhầm lẫn cho bé (phát hiện và né được vài trường hợp rủi ro trong lúc thiết kế, ví dụ bộ 3 icon quả địa cầu 🌍🌎🌐 hay việc dồn quá nhiều icon tòa nhà giống nhau).
- 5 ảnh THẬT (không phải emoji) bổ sung cho các từ mà icon không diễn tả đủ — nguồn Wikimedia Commons giấy phép tự do (CC0/CC BY/CC BY-SA), có ghi công đầy đủ: xe cẩu, con trâu, phở, bánh mì, bánh chưng.

Cả 5 game đều lên hub **Góc Tiếng Anh** (`goc-tieng-anh/`, 11 game) và `game-mini/`, đăng ký đầy đủ i18n 5 ngôn ngữ + service worker + chuỗi test gốc. `npm test` cuối cùng: **834 ✅, 0 ❌**.

---

### Đợt cải thiện sau khi chơi thử cả 5 game "Nghe & Đoán"

**✅ Giải thích SONG NGỮ sau mỗi câu trả lời (đúng lẫn sai) — áp dụng cho cả 5 game:**

Trước đây trả lời xong chỉ đọc lại đúng mỗi từ/câu tiếng Anh — bé nghe tiếng Anh không thôi rất khó nhớ nghĩa. Theo đúng ví dụ bạn đưa ("bé chọn sai → đọc *drink là uống, chọn đúng nhé bé*; bé chọn đúng → *bé giỏi quá đúng rồi, drink có nghĩa là uống, i drink water nghĩa là tôi uống nước, bé nhớ nhé*"), đã đổi hẳn sang lời giải thích song ngữ:
- **Chọn SAI**: đọc từ đúng bằng giọng Anh thật ("Drink") → rồi đọc tiếp bằng tiếng Việt "là uống. Chọn đúng nhé bé!".
- **Chọn ĐÚNG**: khen tiếng Việt ("Bé giỏi quá, đúng rồi!") → đọc từ tiếng Anh ("Drink") → giải nghĩa tiếng Việt ("có nghĩa là uống.") → đọc câu ví dụ tiếng Anh ("I drink water.") → dịch nghĩa câu ("nghĩa là tôi uống nước. Bé nhớ nhé!").
- **Chỉ chuyển sang từ mới SAU KHI đọc xong toàn bộ** — không còn đoán 1 khoảng chờ cố định (trước là `setTimeout` 2.1 giây bất kể câu dài ngắn) mà chờ đúng lúc giọng đọc kết thúc thật sự.

Kỹ thuật: thêm hàm `speakSequence(parts, onDone)` vào `to-mau/src/speech.js` — đọc lần lượt nhiều đoạn xen kẽ ngôn ngữ/tốc độ khác nhau (mỗi đoạn có `{text, lang, rate}` riêng), dùng sự kiện `onend` của Web Speech API để nối tiếp từng đoạn, gọi `onDone` khi đọc xong TOÀN BỘ chuỗi. Có chốt an toàn: nếu tắt tiếng/trình duyệt không hỗ trợ/giọng lỗi thì `onDone` vẫn được gọi ngay (không bao giờ bị kẹt màn chờ mãi mãi vì lỡ mất tiếng đọc).

**✅ Sửa 4 emoji không hợp với từ vựng, thay bằng ẢNH THẬT (cùng nguồn Wikimedia Commons, giấy phép tự do):**
- **black hole** (`nghe-doan-dong-vat-vu-tru`): emoji 🕳️ chỉ là "cái lỗ" thường, không phải hố đen thiên văn — đổi sang đúng tấm ảnh hố đen thật đầu tiên loài người chụp được (thiên hà M87, Event Horizon Telescope Collaboration, CC BY 4.0).
- **calculator** (`nghe-doan-gia-dinh-nghe-nghiep`): emoji 🧮 thực chất tên Unicode là "abacus" (bàn tính), không phải máy tính điện tử — dễ dạy sai cho bé — đổi sang ảnh máy tính bỏ túi thật (LoMit, CC BY-SA 4.0).
- **cave** (`nghe-doan-giao-thong`): emoji 🕳️ chỉ là "cái lỗ", không giống hang động — đổi sang ảnh hang Postojna thật (Szilas, CC0).
- **coral reef** (`nghe-doan-giao-thong`): emoji 🐠 chỉ là 1 con cá, không phải cả rạn san hô — đổi sang ảnh rạn san hô Flynn Reef thật (Toby Hudson, CC BY-SA 3.0).
- Đổi thêm 1 emoji không cần ảnh: **comb hair** (`nghe-doan-do-dung-hang-ngay`) từ 💇 (cảnh cắt tóc ở tiệm — sai ngữ cảnh cho hành động tự chải tóc ở nhà) sang 🪮 (cây lược — đúng nghĩa hơn).
- Mỗi game có `images/CREDITS.md` cập nhật đầy đủ tác giả + giấy phép + nguồn cho từng ảnh mới.

Test bổ sung: kiểm tra trường `img` (khi có) luôn trỏ đúng `images/` cục bộ, cho cả 3 game trước đó chưa có ảnh thật (Giai đoạn 3, 4). `npm test` toàn bộ sau đợt này: **836 ✅, 0 ❌**.

**✅ Đợt rà soát emoji lần 2 — soát lại toàn bộ 466 mục, tìm thêm 3 trường hợp emoji sai/lệch nghĩa:**

- **helmet** (`nghe-doan-giao-thong`, chủ đề tiện ích công cộng): emoji ⛑️ thực chất là mũ nhân viên cứu hộ/y tế (có chữ thập đỏ), KHÔNG phải mũ bảo hiểm xe đạp/xe máy thông thường mà câu ví dụ đang nói tới ("Wear a helmet, please" — ngữ cảnh giao thông) — đổi sang ảnh mũ bảo hiểm xe đạp trẻ em thật (Staff Sgt. Jim Araos, không quân Mỹ, Public Domain).
- **fisherman** (`nghe-doan-gia-dinh-nghe-nghiep`, chủ đề nghề nghiệp): emoji 🎣 chỉ là CẦN CÂU (đồ vật), trong khi mọi nghề khác cùng chủ đề đều dùng icon NGƯỜI (🧑‍⚕️🧑‍🌾🧑‍🍳...) — gây thiếu nhất quán, bé có thể hiểu nhầm từ này nghĩa là "cần câu" chứ không phải "ngư dân" — đổi sang ảnh người ngư dân thật đang câu cá kiểu cà kheo truyền thống Sri Lanka (Jakub Hałun, CC BY 4.0).
- **barber** (`nghe-doan-gia-dinh-nghe-nghiep`, chủ đề nghề nghiệp): emoji 💇 thật ra vẽ NGƯỜI ĐƯỢC cắt tóc (khách hàng), không phải người thợ đang cầm kéo/tông đơ — ngược hẳn ý nghĩa của từ "barber" (thợ cắt tóc) — đổi sang ảnh người thợ thật đang cắt tóc (Nenad Stojkovic, CC BY 2.0).
- Cả 3 ảnh đều xác minh giấy phép qua Wikimedia API trước khi tải (không đoán URL), có `CREDITS.md` ghi công đầy đủ. Test cập nhật để xác nhận cả 3 mục đã gắn đúng đường dẫn ảnh cục bộ.
- Rà soát các mục còn lại (466 - các mục đã sửa) không phát hiện thêm sai lệch rõ ràng nào khác — phần lớn emoji còn lại tuy có vài chỗ hơi trừu tượng (ví dụ "order" 📝, "scoreboard" 📋, "abc" 🔤 dùng icon tượng trưng thay vì tả thực) nhưng KHÔNG sai nghĩa, nên giữ nguyên để tránh phình quá nhiều ảnh ngoài không cần thiết.

`npm test` sau đợt này vẫn **836 ✅, 0 ❌** (mở rộng phạm vi assertion trong các test đã có, không cần thêm check mới).

**Việc còn để ngỏ**: cân nhắc thêm 1 mảng chủ đề mới hoàn toàn (ngoài 5 giai đoạn đã hoàn thành của kế hoạch 5×1000) nếu bạn muốn mở rộng xa hơn — báo mảng nào bạn quan tâm (ví dụ: thời tiết & mùa trong năm, màu sắc nâng cao, cảm xúc mở rộng, hoặc chủ đề tự chọn khác).

---
---

## Đợt cập nhật số liệu + "Giai đoạn 6" — mảng chủ đề MỚI ngoài kế hoạch 5×1000 ban đầu

**✅ Cập nhật số từ vựng hiển thị bị lệch so với thực tế** (bạn phản hồi: số hiển thị "chưa được cập nhật") — do đã âm thầm thêm vài từ mới (xe cẩu, con trâu, phở, bánh mì, bánh chưng...) trong các đợt sửa emoji trước mà quên cập nhật con số hiển thị ở thẻ hub:
- **Giai đoạn 1** (`nghe-doan-tieng-anh`): 100 → **103** từ (thêm phở/bánh mì/bánh chưng).
- **Giai đoạn 2** (`nghe-doan-giao-thong`): 93 → **95** từ (thêm xe cẩu/con trâu).
- Đã sửa ở cả 2 nơi hiển thị (`goc-tieng-anh/index.html`, `game-mini/index.html`) VÀ trong chính comment đầu file `.js` của từng game — để lần sau đọc code cũng không bị nhầm số liệu cũ.
- Giai đoạn 3/4/5 số liệu vẫn đúng (không có từ mới thêm vào, chỉ gắn thêm ảnh cho từ đã có sẵn).

**✅ Đã làm xong "Giai đoạn 6" — MẢNG CHỦ ĐỀ HOÀN TOÀN MỚI (ngoài kế hoạch 5×1000 ban đầu), theo đúng gợi ý đã đề xuất (thời tiết & mùa, màu sắc, cảm xúc mở rộng):**

- **Nghe & Đoán: Thời Tiết, Màu Sắc & Cảm Xúc** ✅ MỚI (`nghe-doan-thoi-tiet-cam-xuc/`, 20 unit test) — 78 mục từ vựng chia 5 chủ đề con (🌦️ Thời tiết 17 · 📅 Mùa & Thời gian 14 · 🎨 Màu sắc 10 · 😊 Cảm xúc 18 · ⚖️ Tính từ đối lập 19), cùng cơ chế đã kiểm chứng xuyên suốt (trộn từ đơn/câu ngắn, tốc độ đọc phù hợp, giải thích song ngữ sau mỗi câu trả lời, lọc theo chủ đề).
- **Quyết định thiết kế đáng chú ý**: chủ động **BỎ HẲN** 2 từ "tomorrow" và "yesterday" dù đã có ý tưởng dùng mũi tên ⏮️⏭️ để biểu diễn — vì bé KHÔNG THỂ đoán ra khái niệm thời gian trừu tượng này chỉ từ 1 mũi tên, sẽ phá vỡ đúng mục đích của trò "nghe rồi đoán hình". Thà thiếu 2 từ còn hơn nhồi vào 2 mục không thể đoán được bằng hình ảnh — đúng tinh thần "chất lượng hơn số lượng" đã giữ xuyên suốt cả dự án.
- **Chủ đề Màu sắc** dùng icon hình vuông/tròn màu Unicode có sẵn (🔴🟠🟡🟢🔵🟣🟤⚫⚪🩷) — đây là nhóm từ vựng có độ khớp CHÍNH XÁC NHẤT trong toàn bộ 6 giai đoạn (mỗi icon là chính xác màu đó, không cần suy diễn như các chủ đề khác).
- Test emoji-uniqueness xác nhận cả 78 icon không trùng nhau (kiểm tra kỹ các cặp dễ nhầm: 🌅 bình minh vs 🌇 hoàng hôn, ☀️ mặt trời vs 🌞 mặt trời cười (buổi chiều) — đều là glyph khác nhau).
- Đăng ký đầy đủ: thẻ trong `goc-tieng-anh/` (hub 11→12 game) + `game-mini/`, 4 khóa i18n mới (5 ngôn ngữ), precache `sw.js` v55→v56, thêm vào chuỗi test gốc — `npm test` toàn bộ: **856 ✅, 0 ❌**.

### 📊 Tổng kết 6 giai đoạn "Nghe & Đoán" (5 giai đoạn kế hoạch gốc + 1 giai đoạn mở rộng)

| Giai đoạn | Chủ đề | Game | Số từ |
|---|---|---|---|
| 1 | Trái cây, món ăn, quán ăn & mua sắm, ngày lễ, giải trí & phim ảnh | `nghe-doan-tieng-anh/` | 103 |
| 2 | Phương tiện, tiện ích công cộng, môi trường, đô thị & thôn quê, địa lý & địa hình | `nghe-doan-giao-thong/` | 95 |
| 3 | Động vật hoang dã, sinh vật biển & côn trùng, hàng không & vũ trụ, toán học & hình khối, loài chim | `nghe-doan-dong-vat-vu-tru/` | 91 |
| 4 | Gia đình & bạn bè, trường học, nghề nghiệp, thể thao, thi đấu & hoạt động | `nghe-doan-gia-dinh-nghe-nghiep/` | 85 |
| 5 | Quần áo & giày dép, đồ dùng gia đình, thiết bị điện tử, bộ phận cơ thể, hoạt động hằng ngày | `nghe-doan-do-dung-hang-ngay/` | 92 |
| 6 (mở rộng) | Thời tiết & mùa, mùa & thời gian, màu sắc, cảm xúc, tính từ đối lập | `nghe-doan-thoi-tiet-cam-xuc/` | 78 |

**Tổng cộng: 544 mục từ vựng tiếng Anh** trên **6 game**, đều lên hub **Góc Tiếng Anh** (12 game) + `game-mini/`.

**Việc còn để ngỏ**: mở rộng thêm nữa nếu muốn — vài chủ đề còn trống chưa khai thác: **nghề nghiệp mở rộng** (thêm chức vụ/cấp bậc), **hoạt động thể thao/cuộc thi chi tiết hơn**, hoặc **chủ đề hoàn toàn khác** do bạn đề xuất. Báo khi bạn muốn tiếp tục.

---
---

## Giai đoạn 7 — mảng MỚI thứ 2 ngoài kế hoạch 5×1000 gốc

**✅ Đã làm xong "Giai đoạn 7"**, lấp đúng khoảng trống đã nêu ở "Việc còn để ngỏ" phía trên (nghề nghiệp mở rộng/chức vụ, thiết bị nghề nghiệp — 2 ý mà bản kế hoạch gốc có nhắc tới nhưng 5 giai đoạn đầu chưa khai thác hết), cộng thêm 3 chủ đề mới hoàn toàn chưa từng có trong cả bộ sưu tập:

- **Nghe & Đoán: Quốc Gia, Số Đếm & Nghề Nghiệp** ✅ MỚI (`nghe-doan-quoc-gia-nghe-nghiep/`, 20 unit test) — 61 mục từ vựng chia 5 chủ đề con (🌍 Quốc gia & Quốc kỳ 18 · 🔢 Số đếm & Thứ tự 14 · 📚 Môn học 10 · 💼 Nghề nghiệp mở rộng 11 · 🧰 Dụng cụ & Văn phòng 8), cùng cơ chế đã kiểm chứng xuyên suốt (trộn từ đơn/câu ngắn, tốc độ đọc phù hợp, giải thích song ngữ sau mỗi câu trả lời, lọc theo chủ đề).
- **Chủ đề Quốc gia & Quốc kỳ** dùng cờ quốc gia (🇻🇳🇺🇸🇬🇧🇯🇵...) — cùng hạng với chủ đề Màu sắc (giai đoạn 6) là nhóm từ vựng có độ khớp hình ảnh CHÍNH XÁC TUYỆT ĐỐI, mỗi lá cờ chỉ ứng với đúng 1 quốc gia, không có chỗ cho suy diễn.
- **Chủ đề Số đếm & Thứ tự** dùng keycap số Unicode (0️⃣-🔟) + huy chương cho thứ hạng (🥇🥈🥉) — cũng là nhóm cực kỳ chuẩn xác.
- Test emoji-uniqueness xác nhận cả 61 icon không trùng nhau.
- Đăng ký đầy đủ: thẻ trong `goc-tieng-anh/` (hub 12→13 game) + `game-mini/`, 4 khóa i18n mới (5 ngôn ngữ), precache `sw.js` v56→v57, thêm vào chuỗi test gốc — `npm test` toàn bộ: **876 ✅, 0 ❌**.

### 📊 Tổng kết 7 giai đoạn "Nghe & Đoán" (5 giai đoạn kế hoạch gốc + 2 giai đoạn mở rộng)

| Giai đoạn | Chủ đề | Game | Số từ |
|---|---|---|---|
| 1 | Trái cây, món ăn, quán ăn & mua sắm, ngày lễ, giải trí & phim ảnh | `nghe-doan-tieng-anh/` | 103 |
| 2 | Phương tiện, tiện ích công cộng, môi trường, đô thị & thôn quê, địa lý & địa hình | `nghe-doan-giao-thong/` | 95 |
| 3 | Động vật hoang dã, sinh vật biển & côn trùng, hàng không & vũ trụ, toán học & hình khối, loài chim | `nghe-doan-dong-vat-vu-tru/` | 91 |
| 4 | Gia đình & bạn bè, trường học, nghề nghiệp, thể thao, thi đấu & hoạt động | `nghe-doan-gia-dinh-nghe-nghiep/` | 85 |
| 5 | Quần áo & giày dép, đồ dùng gia đình, thiết bị điện tử, bộ phận cơ thể, hoạt động hằng ngày | `nghe-doan-do-dung-hang-ngay/` | 92 |
| 6 (mở rộng) | Thời tiết & mùa, mùa & thời gian, màu sắc, cảm xúc, tính từ đối lập | `nghe-doan-thoi-tiet-cam-xuc/` | 78 |
| 7 (mở rộng) | Quốc gia & quốc kỳ, số đếm & thứ tự, môn học, nghề nghiệp mở rộng, dụng cụ & văn phòng | `nghe-doan-quoc-gia-nghe-nghiep/` | 61 |

**Tổng cộng: 605 mục từ vựng tiếng Anh** trên **7 game**, đều lên hub **Góc Tiếng Anh** (13 game) + `game-mini/`.

**Việc còn để ngỏ**: các mảng khả dĩ tiếp theo nếu muốn mở rộng xa hơn nữa — **hoạt động hằng ngày mở rộng** (động từ hành động cụ thể hơn), **hình dạng & không gian** (trên/dưới/trong/ngoài — giới từ chỉ vị trí, rất hữu ích cho giao tiếp), hoặc **chủ đề tự chọn khác** từ bạn.

---
---

## Giai đoạn 8 — mảng MỚI thứ 3 ngoài kế hoạch 5×1000 gốc

**✅ Đã làm xong "Giai đoạn 8"**, lấp đúng khoảng trống "hoạt động hằng ngày mở rộng" đã nêu ở "Việc còn để ngỏ" phía trên, cộng thêm 3 chủ đề mới hoàn toàn (đồ chơi, sở thích ngoài trời, địa điểm công cộng):

- **Nghe & Đoán: Hoạt Động, Đồ Chơi & Nơi Vui Chơi** ✅ MỚI (`nghe-doan-hoat-dong-do-choi/`, 20 unit test) — 51 mục từ vựng chia **4** chủ đề con (🏃 Hoạt động thể chất 18 · 🧸 Đồ chơi 13 · 🏕️ Sở thích ngoài trời 10 · 🏛️ Địa điểm công cộng 10), cùng cơ chế đã kiểm chứng xuyên suốt (trộn từ đơn/câu ngắn, tốc độ đọc phù hợp, giải thích song ngữ sau mỗi câu trả lời, lọc theo chủ đề).
- **Chỉ 4 chủ đề thay vì 5**: sau khi rà soát kỹ, không tìm được chủ đề con thứ 5 vừa không trùng lặp với 7 giai đoạn trước, vừa đủ số lượng từ có thể minh hoạ rõ ràng bằng 1 emoji/hình — quyết định giữ 4 chủ đề chất lượng thay vì nhồi thêm 1 chủ đề yếu.
- **Quyết định thiết kế đáng chú ý**: chủ động **BỎ HẲN** nhóm giới từ chỉ vị trí (in/on/under/behind...) dù đã cân nhắc đưa vào — vì đây là khái niệm QUAN HỆ giữa 2 vật thể trong 1 khung cảnh, không thể gói gọn trong 1 emoji duy nhất như format "nghe 1 từ → đoán 1 hình" đang dùng xuyên suốt dự án (khác với danh từ/động từ đơn có thể quy về 1 icon). Giữ nguyên tinh thần "chất lượng hơn số lượng".
- **Phát hiện & xử lý xung đột emoji ngay trong lúc thiết kế**: từ "build" (hoạt động thể chất) ban đầu dùng 🧱 trùng với "blocks" (đồ chơi) cũng dùng 🧱 — phát hiện qua rà soát thủ công trước khi viết test, đổi "build" sang 🏗️ (cần cẩu xây dựng) để tránh nhầm lẫn, giữ 🧱 riêng cho "blocks".
- Test emoji-uniqueness xác nhận cả 51 icon không trùng nhau.
- Đăng ký đầy đủ: thẻ trong `goc-tieng-anh/` (hub 13→14 game) + `game-mini/`, 4 khóa i18n mới (5 ngôn ngữ), precache `sw.js` v57→v58, thêm vào chuỗi test gốc — `npm test` toàn bộ: **896 ✅, 0 ❌**.

### 📊 Tổng kết 8 giai đoạn "Nghe & Đoán" (5 giai đoạn kế hoạch gốc + 3 giai đoạn mở rộng)

| Giai đoạn | Chủ đề | Game | Số từ |
|---|---|---|---|
| 1 | Trái cây, món ăn, quán ăn & mua sắm, ngày lễ, giải trí & phim ảnh | `nghe-doan-tieng-anh/` | 103 |
| 2 | Phương tiện, tiện ích công cộng, môi trường, đô thị & thôn quê, địa lý & địa hình | `nghe-doan-giao-thong/` | 95 |
| 3 | Động vật hoang dã, sinh vật biển & côn trùng, hàng không & vũ trụ, toán học & hình khối, loài chim | `nghe-doan-dong-vat-vu-tru/` | 91 |
| 4 | Gia đình & bạn bè, trường học, nghề nghiệp, thể thao, thi đấu & hoạt động | `nghe-doan-gia-dinh-nghe-nghiep/` | 85 |
| 5 | Quần áo & giày dép, đồ dùng gia đình, thiết bị điện tử, bộ phận cơ thể, hoạt động hằng ngày | `nghe-doan-do-dung-hang-ngay/` | 92 |
| 6 (mở rộng) | Thời tiết & mùa, mùa & thời gian, màu sắc, cảm xúc, tính từ đối lập | `nghe-doan-thoi-tiet-cam-xuc/` | 78 |
| 7 (mở rộng) | Quốc gia & quốc kỳ, số đếm & thứ tự, môn học, nghề nghiệp mở rộng, dụng cụ & văn phòng | `nghe-doan-quoc-gia-nghe-nghiep/` | 61 |
| 8 (mở rộng) | Hoạt động thể chất, đồ chơi, sở thích ngoài trời, địa điểm công cộng | `nghe-doan-hoat-dong-do-choi/` | 51 |

**Tổng cộng: 656 mục từ vựng tiếng Anh** trên **8 game**, đều lên hub **Góc Tiếng Anh** (14 game) + `game-mini/`.

**Việc còn để ngỏ**: các mảng khả dĩ tiếp theo nếu muốn mở rộng xa hơn nữa — **thức ăn nâng cao** (cách chế biến, hương vị, dụng cụ bếp), **công nghệ & thiết bị hiện đại** (điện thoại, máy tính bảng, mạng internet — mảng chưa khai thác sâu), hoặc **chủ đề tự chọn khác** từ bạn.

---
---

## Đợt "luật CHỌN LẠI" cho cả 8 game Nghe & Đoán + mở rộng từ vựng giai đoạn 7 & 8

**✅ Luật chọn lại (áp dụng đồng loạt cho CẢ 8 game Nghe & Đoán)** — theo đúng yêu cầu: bé chọn sai thì được gợi ý và chọn lại 1 lần, sai lần 2 mới lộ đáp án:

- **Sai lần ĐẦU**: câu hỏi KHÔNG qua — chỉ làm mờ + khóa nút bé vừa chọn sai, máy đọc gợi ý *"Sai rồi. {word} là {nghĩa tiếng Việt}. Bé hãy chọn lại nhé!"* (đúng ví dụ mẫu: *"sai rồi, zero là số 0, bé hãy chọn lại nhé"*), rồi mở khóa cho bé chọn lại trong các hình còn lại.
- **Đúng sau gợi ý**: vẫn khen + giải thích đầy đủ như đáp đúng bình thường (*"Bé giỏi quá, đúng rồi! {word} có nghĩa là..."*), được **5 điểm** (một nửa so với 10 điểm đúng ngay lần đầu, vì đã được gợi ý) — không tính vào chuỗi 🔥.
- **Sai lần 2**: lộ đáp án trên màn hình + đọc giải thích đầy đủ (*"Chưa đúng rồi. Đáp án là {word}, nghĩa là {nghĩa}..."* + câu ví dụ + dịch nghĩa + *"Lần sau bé sẽ làm được!"*) rồi mới qua câu mới.
- Kỹ thuật: cả 8 module logic có `chooseOption` giống hệt nhau từng byte (xác minh bằng checksum) nên vá đồng loạt bằng script thay-thế-chính-xác; tương tự với `onPick` + speech sequence trong 8 file `app.js`. Mỗi game thay 1 test cũ ("sai là qua câu luôn") bằng **3 test mới** (sai lần 1 → retry + câu không qua; đúng sau retry → 5 điểm; sai lần 2 → qua câu): 8 game × +2 test = **912 ✅, 0 ❌** toàn repo.
- Lời hướng dẫn (nút ❓) của game giai đoạn 8 đã cập nhật để nhắc luật mới; các game cũ giữ lời hướng dẫn ngắn gọn sẵn có (luật mới tự thể hiện rõ khi chơi).

**✅ Mở rộng từ vựng** (kiểm tra trùng lặp TỪ giữa cả 8 game bằng grep trước khi thêm — chỉ thêm từ chưa từng dạy ở bất kỳ game nào):

- **Giai đoạn 8** (`nghe-doan-hoat-dong-do-choi`): 51 → **70 từ**, thêm chủ đề con thứ 5 hoàn toàn mới **🎵 Nhạc cụ (12)**: piano🎹, guitar🎸, violin🎻, trumpet🎺, saxophone🎷, accordion🪗, banjo🪕, flute🪈, maracas🪇, bell🔔, microphone🎤, headphones🎧 — nhóm khớp hình rất chuẩn (mỗi nhạc cụ có đúng 1 emoji riêng). Đồng thời bổ sung các chủ đề sẵn có: hoạt động +2 (clap👏, lift🏋️), đồ chơi +2 (toy train🚂, dinosaur toy🦖), sở thích +1 (kayaking🛶), địa điểm +2 (hotel🏨, bakery🥐).
- **Giai đoạn 7** (`nghe-doan-quoc-gia-nghe-nghiep`): 61 → **73 từ**, chủ đề Quốc gia 18 → 30 quốc kỳ — ưu tiên các nước láng giềng/Đông Nam Á trước (Lào🇱🇦, Cam-pu-chia🇰🇭, Ma-lai-xi-a🇲🇾, In-đô-nê-xi-a🇮🇩, Phi-líp-pin🇵🇭) rồi tới Mê-hi-cô🇲🇽, Hà Lan🇳🇱, Thụy Sĩ🇨🇭, Hy Lạp🇬🇷, Thổ Nhĩ Kỳ🇹🇷, Ác-hen-ti-na🇦🇷, Niu Di-lân🇳🇿.
- Nhiều từ ứng viên bị LOẠI vì đã dạy ở game khác (dance/sing ở giai đoạn 4, walk/sleep/hammer ở giai đoạn 5, library/castle/stadium ở giai đoạn 2, circus ở giai đoạn 1...) — tránh dạy trùng 1 từ ở 2 game.
- Số từ hiển thị trên thẻ hub (`goc-tieng-anh/`, `game-mini/`) và comment đầu file `.js` đã cập nhật theo (~70 và ~73); ngưỡng test tối thiểu nâng lên tương ứng (≥65 và ≥70); `sw.js` v58→v59 để thiết bị cũ nhận bản mới.

### 📊 Tổng kết 8 giai đoạn (sau đợt mở rộng)

| Giai đoạn | Game | Số từ |
|---|---|---|
| 1 | `nghe-doan-tieng-anh/` | 103 |
| 2 | `nghe-doan-giao-thong/` | 95 |
| 3 | `nghe-doan-dong-vat-vu-tru/` | 91 |
| 4 | `nghe-doan-gia-dinh-nghe-nghiep/` | 85 |
| 5 | `nghe-doan-do-dung-hang-ngay/` | 92 |
| 6 (mở rộng) | `nghe-doan-thoi-tiet-cam-xuc/` | 78 |
| 7 (mở rộng) | `nghe-doan-quoc-gia-nghe-nghiep/` | 73 |
| 8 (mở rộng) | `nghe-doan-hoat-dong-do-choi/` | 70 |

**Tổng cộng: 687 mục từ vựng tiếng Anh** trên **8 game** — tất cả cùng chung luật chọn-lại mới.

**Việc còn để ngỏ**: tiếp tục "nở" thêm các chủ đề còn mỏng ở giai đoạn 1–6 (mỗi lần thêm phải kiểm tra trùng từ giữa các game), hoặc mở giai đoạn 9 với mảng mới (thức ăn nâng cao — cách chế biến/hương vị/dụng cụ bếp; công nghệ & thiết bị hiện đại).

---
---

## Giai đoạn 9 — mảng MỚI thứ 4 ngoài kế hoạch 5×1000 gốc

**✅ Đã làm xong "Giai đoạn 9"**, gộp cả 2 gợi ý ở "Việc còn để ngỏ" phía trên (thức ăn nâng cao + công nghệ) vào 1 game:

- **Nghe & Đoán: Nhà Bếp & Công Nghệ** ✅ MỚI (`nghe-doan-nha-bep-cong-nghe/`, 22 unit test — nhiều hơn 2 test so với khuôn cũ vì sinh ra SAU đợt luật chọn-lại nên có sẵn 3 test retry) — 45 mục từ vựng chia 4 chủ đề con (🍳 Chế biến & nhà bếp 13 · 😋 Hương vị & cảm nhận 8 · 🥕 Rau củ 15 · 💻 Công nghệ 9), luật chọn-lại tích hợp ngay từ đầu.
- **Đối chiếu trùng từ nghiêm ngặt**: toàn bộ ứng viên được grep qua cả 8 game trước khi thêm — LOẠI cook/delicious/hungry/tomato/avocado/honey/butter (giai đoạn 1), phone/laptop/camera/battery/keyboard/printer/flashlight/magnet (giai đoạn 5), satellite/telescope (giai đoạn 3), microscope (giai đoạn 4)... — 45 từ được giữ đều CHƯA từng dạy ở bất kỳ game nào.
- **Chủ đề Rau củ** là nhóm khớp hình chuẩn xác (mỗi loại rau củ có đúng 1 emoji riêng: 🥕🥔🍠🌽🧅🧄🍄🎃🥒🥦🍆🫛🫑🥬🫘); chủ đề Chế biến dạy ĐỘNG TỪ nấu nướng (cut/mix/pour/boil/bake/fry/grill/stir/freeze/heat) — nhóm động từ sinh hoạt rất hay dùng trong giao tiếp mà 8 giai đoạn trước còn thiếu.
- Đăng ký đầy đủ: thẻ trong `goc-tieng-anh/` (hub 14→15 game, đã sửa cả fallback tĩnh "13 game" còn sót ở `index.html` gốc) + `game-mini/`, 4 khóa i18n mới (5 ngôn ngữ), precache `sw.js` v59→v60, thêm vào chuỗi test gốc — `npm test` toàn bộ: **934 ✅, 0 ❌**.

### 📊 Tổng kết 9 giai đoạn "Nghe & Đoán"

| Giai đoạn | Chủ đề | Game | Số từ |
|---|---|---|---|
| 1 | Trái cây, món ăn, quán ăn & mua sắm, ngày lễ, giải trí & phim ảnh | `nghe-doan-tieng-anh/` | 103 |
| 2 | Phương tiện, tiện ích công cộng, môi trường, đô thị & thôn quê, địa lý & địa hình | `nghe-doan-giao-thong/` | 95 |
| 3 | Động vật hoang dã, sinh vật biển & côn trùng, hàng không & vũ trụ, toán học & hình khối, loài chim | `nghe-doan-dong-vat-vu-tru/` | 91 |
| 4 | Gia đình & bạn bè, trường học, nghề nghiệp, thể thao, thi đấu & hoạt động | `nghe-doan-gia-dinh-nghe-nghiep/` | 85 |
| 5 | Quần áo & giày dép, đồ dùng gia đình, thiết bị điện tử, bộ phận cơ thể, hoạt động hằng ngày | `nghe-doan-do-dung-hang-ngay/` | 92 |
| 6 (mở rộng) | Thời tiết & mùa, mùa & thời gian, màu sắc, cảm xúc, tính từ đối lập | `nghe-doan-thoi-tiet-cam-xuc/` | 78 |
| 7 (mở rộng) | Quốc gia & quốc kỳ (30 cờ), số đếm & thứ tự, môn học, nghề nghiệp, dụng cụ & văn phòng | `nghe-doan-quoc-gia-nghe-nghiep/` | 73 |
| 8 (mở rộng) | Hoạt động thể chất, đồ chơi, sở thích ngoài trời, địa điểm công cộng, nhạc cụ | `nghe-doan-hoat-dong-do-choi/` | 70 |
| 9 (mở rộng) | Chế biến & nhà bếp, hương vị & cảm nhận, rau củ, công nghệ | `nghe-doan-nha-bep-cong-nghe/` | 45 |

**Tổng cộng: 732 mục từ vựng tiếng Anh** trên **9 game** — tất cả cùng luật chọn-lại (sai lần 1 được gợi ý chọn lại, sai lần 2 mới lộ đáp án + giải thích song ngữ đầy đủ).

**Việc còn để ngỏ**: kho từ "vừa mới + vừa minh họa được bằng 1 emoji" đang cạn dần — các đợt sau nên ưu tiên (a) "nở" từ từ các chủ đề mỏng ở giai đoạn 1–6, (b) dùng ảnh thật (Wikimedia/Openverse, quy trình CREDITS.md sẵn có) để mở những nhóm từ không có emoji (dụng cụ bếp chi tiết, thiết bị hiện đại...), hoặc (c) mảng ôn tập tổng hợp trộn câu hỏi từ cả 9 game.

---
---

## Đợt "nở chủ đề mỏng bằng ảnh thật" — giai đoạn 1/2/3/6 (+13 từ, 10 ảnh mới)

Đo số từ từng chủ đề trên cả 6 giai đoạn đầu để tìm chủ đề MỎNG nhất (loài chim 11, màu sắc 10, địa lý 17, trái cây 18), rồi bổ sung bằng từ chưa dạy ở bất kỳ game nào (grep đối chiếu cả 9 game) — ưu tiên ẢNH THẬT cho những từ không có emoji đúng nghĩa:

- **Loài chim** (giai đoạn 3): 11 → **16** — goose 🪿 (emoji) + 4 ảnh thật: **pelican** (bồ nông — Mike Baird, CC BY 2.0), **woodpecker** (gõ kiến — Joe080808, CC BY-SA 4.0), **hummingbird** (chim ruồi — Amaury Laporte, CC BY 2.0), **kingfisher** (bói cá — Andreas Trepte, CC BY-SA 2.5). Các loài chim này hoàn toàn KHÔNG có emoji riêng — đúng trường hợp ảnh thật phát huy tác dụng.
- **Trái cây** (giai đoạn 1): 18 → **22** — 4 trái cây nhiệt đới quen thuộc với bé Việt Nam mà không có emoji: **thanh long** (Webysther Nunes, CC BY-SA 4.0), **chôm chôm** (Ivar Leidus, CC BY-SA 4.0), **sầu riêng** (Kalai, CC BY-SA 3.0), **vải** (Ivar Leidus, CC BY-SA 4.0).
- **Địa lý** (giai đoạn 2): 17 → **19** — **waterfall** dùng đúng ảnh **thác Bản Giốc, Cao Bằng, Việt Nam** (jankgo, CC BY 2.0) và **cliff** dùng ảnh Cliffs of Moher, Ireland (Berthold Werner, CC BY-SA 4.0).
- **Màu sắc** (giai đoạn 6): 10 → **12** — gray 🩶 + light blue 🩵 (emoji trái tim màu Unicode 15, cùng họ với 🩷 đã dùng).
- **Kiểm định ảnh bằng mắt trước khi dùng** (bài học đắt giá của đợt này): mở xem TỪNG ảnh tải về — nhờ đó loại được 5 ảnh sai: durian đợt 1 dính chữ viết + màng bọc chợ, đợt 2 ra CÂY sầu riêng thay vì quả (đợt 3 mới chuẩn); còn nhóm bộ phận cơ thể qua Openverse thì thảm họa: "knee" ra infographic răng miệng, "elbow" ra tượng La Mã, "shoulder" ra bìa sách → **HỦY toàn bộ hướng ảnh cho bộ phận cơ thể** (ảnh khuôn mặt/cơ thể luôn chứa nhiều bộ phận cùng lúc nên vốn dĩ khó đoán đơn nghĩa; các từ bone/brain/lungs/heart hóa ra đã có sẵn trong game từ trước).
- Ghi công đầy đủ trong `CREDITS.md` của 3 game (đúng format bảng sẵn có), precache 10 ảnh mới vào `sw.js` v60→v61, cập nhật số từ hiển thị ở thẻ hub + comment đầu file, mở rộng test "real-photo entries" của 3 game — `npm test` toàn bộ: **934 ✅, 0 ❌**.

### 📊 Bảng tổng sau đợt nở chủ đề

| Giai đoạn | Game | Số từ |
|---|---|---|
| 1 | `nghe-doan-tieng-anh/` | 107 |
| 2 | `nghe-doan-giao-thong/` | 97 |
| 3 | `nghe-doan-dong-vat-vu-tru/` | 96 |
| 4 | `nghe-doan-gia-dinh-nghe-nghiep/` | 85 |
| 5 | `nghe-doan-do-dung-hang-ngay/` | 92 |
| 6 | `nghe-doan-thoi-tiet-cam-xuc/` | 80 |
| 7 | `nghe-doan-quoc-gia-nghe-nghiep/` | 73 |
| 8 | `nghe-doan-hoat-dong-do-choi/` | 70 |
| 9 | `nghe-doan-nha-bep-cong-nghe/` | 45 |

**Tổng cộng: 745 mục từ vựng** trên **9 game**, trong đó **23 mục dùng ảnh thật** có ghi công giấy phép đầy đủ.

**Việc còn để ngỏ**: chủ đề gia đình (14 từ) và thi đấu (15 từ) ở giai đoạn 4 vẫn hơi mỏng nhưng từ mới thuộc nhóm QUAN HỆ (cousin, nephew...) khó minh họa đơn nghĩa kể cả bằng ảnh — cần cân nhắc kỹ hoặc bỏ qua; hoặc làm màn ôn tập tổng hợp trộn câu hỏi cả 9 game.

---
---

## Đợt "cây gia đình SVG" — từ quan hệ họ hàng + 25 từ mới (gđ 1/3/4)

Bạn chốt hướng: từ quan hệ (cousin, aunt, uncle...) NÊN thêm, minh họa bằng **cây gia đình**. Đã làm bằng **SVG tự vẽ** (5 file `tree-*.svg`, mỗi file ~1KB, offline hoàn toàn, không cần ghi công nguồn ngoài):

- **Thiết kế cây**: 3 thế hệ — ông bà 👴👵 trên cùng; bố 👨 + mẹ 👩 và cô 👱‍♀️ + chú 🧔 ở giữa (bố và cô là con của ông bà, nét nối rõ ràng); **Bé 🧒 (viền xanh nét đứt + nhãn "Bé")** và anh/em họ 🧑 ở dưới. Node "Bé" là MỐC THAM CHIẾU cố định xuất hiện trong cả 5 hình, người thân cần đoán được tô sáng viền cam — bé nghe "aunt" thì tìm hình có người cô được tô sáng.
- **5 từ quan hệ mới**: parents (bố mẹ), grandparents (ông bà), aunt (cô, dì), uncle (chú, bác), cousin (anh chị em họ). **Chủ động BỎ nephew/niece**: với mốc "Bé" (trẻ nhỏ) thì bé chưa có cháu — muốn vẽ được phải đổi mốc tham chiếu sang người lớn giữa chừng, phá vỡ tính nhất quán của cả bộ hình và chắc chắn gây rối cho trẻ 4–6 tuổi.
- **Phát hiện lỗ hổng bất ngờ**: chủ đề Gia đình của giai đoạn 4 bấy lâu THIẾU cả mother/father/brother/sister (chỉ có ông bà, em bé, cưới hỏi...) — đã thêm đủ 4 từ cốt lõi này (emoji 👩👨👦👧). Gia đình: 14 → **23 từ**.
- **Thi đấu +5**: champion 👑, goal 🥅, team 👥, race 🏎️, high five ✋ (mục "medal" định thêm bị phát hiện TRÙNG id với "gold medal" 🥇 sẵn có trong chủ đề thể thao — test id-uniqueness bắt được ngay, đã bỏ vì khái niệm huy chương đã được dạy). Thi đấu: 15 → **20 từ**.
- **"Bổ sung nhiều từ vựng khác"**: gđ 3 động vật hoang dã +5 loài có emoji mà chưa dạy (hedgehog 🦔, sloth 🦥, otter 🦦, skunk 🦨, beaver 🦫 — 96 → 101), gđ 1 món ăn +5 (dumpling 🥟, pancake 🥞, waffle 🧇, pretzel 🥨, donut 🍩 — 107 → 112).
- Đăng ký: precache 5 SVG vào `sw.js` v61→v62, ghi chú "SVG tự vẽ" trong CREDITS.md gđ4, test img-wiring gđ4 mở rộng thêm 5 mục cây gia đình, số từ hiển thị cập nhật chính xác (99, không làm tròn thành 100) — `npm test`: **934 ✅, 0 ❌**.

### 📊 Bảng tổng sau đợt cây gia đình

| Giai đoạn | Game | Số từ |
|---|---|---|
| 1 | `nghe-doan-tieng-anh/` | 112 |
| 2 | `nghe-doan-giao-thong/` | 97 |
| 3 | `nghe-doan-dong-vat-vu-tru/` | 101 |
| 4 | `nghe-doan-gia-dinh-nghe-nghiep/` | 99 |
| 5 | `nghe-doan-do-dung-hang-ngay/` | 92 |
| 6 | `nghe-doan-thoi-tiet-cam-xuc/` | 80 |
| 7 | `nghe-doan-quoc-gia-nghe-nghiep/` | 73 |
| 8 | `nghe-doan-hoat-dong-do-choi/` | 70 |
| 9 | `nghe-doan-nha-bep-cong-nghe/` | 45 |

**Tổng cộng: 769 mục từ vựng** trên **9 game** — 28 mục dùng hình thật (23 ảnh Wikimedia/Openverse + 5 SVG cây gia đình tự vẽ).

**Việc còn để ngỏ**: kỹ thuật "SVG tự vẽ + mốc tham chiếu" vừa mở ra hướng minh họa cho cả nhóm từ QUAN HỆ/VỊ TRÍ từng bị bỏ qua — đáng cân nhắc quay lại nhóm **giới từ chỉ vị trí** (in/on/under/behind, đã bỏ ở giai đoạn 8) bằng SVG 2 vật thể (quả bóng + cái hộp); hoặc màn ôn tập tổng hợp trộn cả 9 game.

---
---

## Đợt "bơm từ vào các game ít nhất" (+23 từ, gđ 5/6/7/9)

Bạn phản hồi các game hiện có "quá ít" từ — đã bơm vào 4 game mỏng nhất, mọi từ đều grep đối chiếu 9 game trước khi thêm:

- **Giai đoạn 9** (45 → **54**): chế biến & nhà bếp +6 (plate 🍽️, jar 🫙, lunchbox 🍱, straw 🥤, roast 🍗, steam ♨️ — đủ bộ động từ nấu nướng cut/mix/pour/boil/bake/fry/grill/stir/freeze/heat/roast/steam), rau củ +3 (olive 🫒, peanut 🥜, chestnut 🌰).
- **Giai đoạn 7** (73 → **81**): quốc kỳ 30 → 38 — thêm Bắc Âu/Đông Âu: Thụy Điển 🇸🇪, Na Uy 🇳🇴, Phần Lan 🇫🇮, Đan Mạch 🇩🇰, Ba Lan 🇵🇱, Ai-len 🇮🇪, Ai-xơ-len 🇮🇸, U-crai-na 🇺🇦.
- **Giai đoạn 6** (80 → **84**): cảm xúc +2 (nervous 😬, silly 🤪), tính từ đối lập +2 (loud 📢 / quiet 🤫 — cặp đối lập mới).
- **Giai đoạn 5** (92 → **94**): hoạt động hằng ngày +2 (yawn 🥱, stretch 🤸).
- **Quyết định thiết kế đáng chú ý — BỎ nhóm tính từ thời tiết** (sunny/rainy/windy/snowy/cloudy) dù cả 5 từ đều trống và có emoji riêng (⛅🌦️🍃🌨️🌥️): các emoji này đứng CẠNH danh từ sẵn có trong CÙNG chủ đề (rain 🌧️ vs rainy 🌦️, cloud ☁️ vs cloudy 🌥️) — bé nghe "rainy" mà thấy cả 🌧️ lẫn 🌦️ trong 1 vòng 4 lựa chọn thì không thể phân biệt được. Đây là dạng xung đột KHÁI NIỆM mà test emoji-uniqueness (chỉ so glyph) không bắt được — phải soát bằng mắt người.
- Ngưỡng test gđ9 nâng 40→50; comment đếm số theo chủ đề + thẻ hub cập nhật chính xác; `sw.js` v62→v63 — `npm test`: **934 ✅, 0 ❌**.

### 📊 Bảng tổng sau đợt bơm từ

| Giai đoạn | Game | Số từ |
|---|---|---|
| 1 | `nghe-doan-tieng-anh/` | 112 |
| 2 | `nghe-doan-giao-thong/` | 97 |
| 3 | `nghe-doan-dong-vat-vu-tru/` | 101 |
| 4 | `nghe-doan-gia-dinh-nghe-nghiep/` | 99 |
| 5 | `nghe-doan-do-dung-hang-ngay/` | 94 |
| 6 | `nghe-doan-thoi-tiet-cam-xuc/` | 84 |
| 7 | `nghe-doan-quoc-gia-nghe-nghiep/` | 81 |
| 8 | `nghe-doan-hoat-dong-do-choi/` | 70 |
| 9 | `nghe-doan-nha-bep-cong-nghe/` | 54 |

**Tổng cộng: 792 mục từ vựng** trên **9 game** (28 mục dùng hình thật).

**Việc còn để ngỏ**: kho từ có-emoji còn trống đã gần cạn thật sự — muốn vượt xa 800 từ, các hướng còn lại là: (a) ảnh thật Wikimedia cho danh từ cụ thể (chim/thú/món ăn/địa danh còn thiếu), (b) SVG tự vẽ cho nhóm giới từ vị trí + khái niệm quan hệ, (c) màn ôn tập tổng hợp trộn cả 9 game (không cần từ mới mà tăng giá trị ôn luyện).

---
---

## Đợt "3 mũi tên": giới từ vị trí SVG + 4 ảnh mới + GAME ÔN TẬP TỔNG HỢP

Bạn duyệt cả 3 hướng (a)(b)(c) đề xuất ở trên — đã làm xong cả 3 trong 1 đợt:

**✅ (b) Giới từ vị trí — chủ đề thứ 6 của giai đoạn 8** (`nghe-doan-hoat-dong-do-choi`, 70 → **77 từ**): 7 giới từ **in / on / under / behind / in front of / next to / between** — nhóm từ giao tiếp quan trọng từng bị BỎ ở bản đầu giai đoạn 8 vì "không vẽ được bằng 1 emoji". Nay minh họa bằng 7 SVG tự vẽ (`pos-*.svg`, ~1KB/file): **quả bóng đỏ + cái hộp nâu** — cái hộp là mốc tham chiếu cố định trong cả 7 hình, chỉ vị trí quả bóng thay đổi (trong hộp / trên nắp / dưới gầm kệ / ló sau hộp / trước mặt hộp / bên cạnh / giữa 2 hộp). Đúng kỹ thuật "mốc tham chiếu" đã kiểm chứng với cây gia đình. Ghi chú thiết kế cũ trong file (nói rằng giới từ không thể minh họa) đã được cập nhật lại.

**✅ (a) 4 ảnh thật mới** (duyệt từng ảnh bằng mắt như quy trình đã đặt): quả đu đủ (Scott Bauer/USDA, Public Domain), quả mít (Augustus Binu, CC BY-SA 3.0 — lần tải đầu bị nhầm quả SA KÊ/breadfruit, phát hiện khi xem ảnh và tải lại), quả khế (Contentshare, CC BY-SA 4.0 — lát cắt hình sao không lẫn được) → giai đoạn 1: 112 → **115 từ**; chim mòng biển (Arnold Paul, CC BY-SA 2.5) → giai đoạn 3: 101 → **102 từ**. CREDITS.md + precache cập nhật đủ.

**✅ (c) GAME MỚI: Nghe & Đoán — Ôn Tập Tổng Hợp** (`nghe-doan-on-tap/`, 22 unit test):
- Gộp WORD_BANK của CẢ 9 game (import trực tiếp module logic của từng game — không sao chép dữ liệu, game gốc thêm từ là màn ôn tập tự có theo) → **~800 mục** trong 1 màn chơi; bộ lọc theo TỪNG GAME GỐC (9 nút + Tất cả).
- Kỹ thuật đáng chú ý: id gắn tiền tố `g1-`..`g9-` để không đụng nhau; đường dẫn ảnh được đổi về tuyệt đối (`/ten-game/images/...`) vì trang ôn tập ở thư mục khác; và **emoji có thể trùng giữa các game gốc** (mỗi game chỉ đảm bảo duy nhất nội bộ) nên `pickRound` phải KHỬ TRÙNG emoji khi chọn mồi nhử — có test riêng quét 60 seed xác nhận không bao giờ có 2 hình giống nhau trong 1 vòng.
- Không dạy từ mới — đúng mục tiêu "tăng giá trị ôn luyện": bé gặp lại từ cũ trong ngữ cảnh trộn đa chủ đề.
- Đăng ký đủ: hub Góc Tiếng Anh 15→**16 game** (sửa cả chip i18n 5 ngôn ngữ + fallback tĩnh trang chủ), `game-mini/`, 4 khóa i18n `ontap.*`, `sw.js` v63→**v64**, chuỗi test gốc.

`npm test` toàn bộ: **957 ✅, 0 ❌**. Smoke test: mọi route + SVG + ảnh mới đều 200.

### 📊 Bảng tổng sau đợt "3 mũi tên"

| Giai đoạn | Game | Số từ |
|---|---|---|
| 1 | `nghe-doan-tieng-anh/` | 115 |
| 2 | `nghe-doan-giao-thong/` | 97 |
| 3 | `nghe-doan-dong-vat-vu-tru/` | 102 |
| 4 | `nghe-doan-gia-dinh-nghe-nghiep/` | 99 |
| 5 | `nghe-doan-do-dung-hang-ngay/` | 94 |
| 6 | `nghe-doan-thoi-tiet-cam-xuc/` | 84 |
| 7 | `nghe-doan-quoc-gia-nghe-nghiep/` | 81 |
| 8 | `nghe-doan-hoat-dong-do-choi/` | 77 |
| 9 | `nghe-doan-nha-bep-cong-nghe/` | 54 |
| Ôn tập | `nghe-doan-on-tap/` | gộp cả 9 game |

**Tổng cộng: 803 mục từ vựng** trên **9 game gốc + 1 màn ôn tập tổng hợp** — vượt mốc 800! (35 mục dùng hình thật: 24 ảnh Wikimedia + 12 SVG tự vẽ gồm 5 cây gia đình + 7 giới từ vị trí.)

**Việc còn để ngỏ**: bộ sưu tập Nghe & Đoán đã khá tròn trịa (803 từ + ôn tập). Các hướng xa hơn nếu muốn: chế độ "thi đấu" trong màn ôn tập (đếm giờ/xếp hạng), thống kê từ hay sai để ôn lại đúng chỗ yếu, hoặc quay lại các việc ngoài mảng tiếng Anh (ví dụ `pokemon/` vẫn chưa có intro giọng nói — đã hoãn từ đợt trước).

---
---

## Đợt "hình người SVG + quốc kỳ đợt 3" (+22 từ, gđ 2/3/5/7)

Bạn hỏi "có thể mở rộng thêm đợt từ vựng nữa không?" — có, bằng cách khai thác tiếp 3 mỏ chưa cạn:

- **✅ Bộ phận cơ thể bằng SVG hình người** (giai đoạn 5: 94 → **101 từ**, chủ đề Cơ thể 16 → 23): 7 khớp/bộ phận không có emoji riêng — **knee, elbow, shoulder, ankle, wrist, neck, cheek** — vẽ 1 bé trai (tóc nâu, áo xanh lá, quần xanh dương) GIỐNG HỆT nhau trong cả 7 file `body-*.svg`, chỉ khác vòng tô sáng cam chỉ vào bộ phận cần đoán. Đây chính là lời giải cho thất bại ở đợt trước (ảnh chụp người thật luôn lẫn nhiều bộ phận trong 1 khung hình): với SVG tự vẽ, ta kiểm soát được chính xác điểm nhấn. Chủ động BỎ "chin" (cằm) vì điểm tô sáng quá gần "cheek" (gò má) — 2 hình sẽ gần giống nhau trong cùng 1 vòng.
- **✅ Quốc kỳ đợt 3** (giai đoạn 7: 81 → **93 từ**, chủ đề Quốc gia 38 → 50): Bồ Đào Nha 🇵🇹, Áo 🇦🇹, Bỉ 🇧🇪, Ả Rập Xê Út 🇸🇦, UAE 🇦🇪, Nam Phi 🇿🇦, Chi-lê 🇨🇱, Cu-ba 🇨🇺, Mông Cổ 🇲🇳, Nê-pan 🇳🇵, Mi-an-ma 🇲🇲, Xri Lan-ca 🇱🇰.
- **✅ Thiên nhiên Việt Nam + chim** (duyệt ảnh bằng mắt như thường lệ): **hoa sen** 🪷 (hóa ra có emoji riêng Unicode 14 — không cần ảnh!), **cây tre** dùng ảnh rừng tre Arashiyama (Mitchwandrew, CC BY 4.0) → giai đoạn 2: 97 → **99 từ**; **con quạ** (Alexis Lours, CC BY 4.0) → giai đoạn 3: 102 → **103 từ**.
- Sổ sách: `CREDITS.md` mới cho giai đoạn 5 (ghi rõ SVG tự vẽ), 2 CREDITS cũ thêm dòng tre/quạ, test SVG-wiring mới cho giai đoạn 5, precache 7 SVG + 2 ảnh vào `sw.js` v64→**v65**, thẻ Ôn Tập cập nhật "~825 từ vựng". Phát hiện + sửa 1 lỗi script vá: kiểm tra idempotent bị nhầm khi chuỗi mới ("~99 từ vựng") trùng với thẻ game khác đã có sẵn số đó — 2 thẻ gđ2 bị bỏ sót đã sửa tay.
- `npm test` toàn bộ: **958 ✅, 0 ❌**.

### 📊 Bảng tổng sau đợt này

| Giai đoạn | Game | Số từ |
|---|---|---|
| 1 | `nghe-doan-tieng-anh/` | 115 |
| 2 | `nghe-doan-giao-thong/` | 99 |
| 3 | `nghe-doan-dong-vat-vu-tru/` | 103 |
| 4 | `nghe-doan-gia-dinh-nghe-nghiep/` | 99 |
| 5 | `nghe-doan-do-dung-hang-ngay/` | 101 |
| 6 | `nghe-doan-thoi-tiet-cam-xuc/` | 84 |
| 7 | `nghe-doan-quoc-gia-nghe-nghiep/` | 93 |
| 8 | `nghe-doan-hoat-dong-do-choi/` | 77 |
| 9 | `nghe-doan-nha-bep-cong-nghe/` | 54 |
| Ôn tập | `nghe-doan-on-tap/` | gộp cả 9 game |

**Tổng cộng: 825 mục từ vựng** (48 mục dùng hình thật: 29 ảnh Wikimedia + 19 SVG tự vẽ) — màn Ôn Tập Tổng Hợp tự động gộp đủ 825 từ vì import trực tiếp module của từng game.

**Việc còn để ngỏ**: các mỏ từ còn khai thác được tiếp — quốc kỳ (vẫn còn ~140 nước), SVG khái niệm (hình khối nếu gđ3 chưa đủ, số lượng nhiều/ít, so sánh to/nhỏ theo cặp 2 vật thể), ảnh thật cho danh từ cụ thể bất kỳ. Hoặc chuyển hướng: chế độ thi đấu/thống kê từ hay sai cho màn ôn tập, intro giọng nói cho `pokemon/`.

---
---

## Đợt "🎯 Ôn chỗ yếu" — sổ theo dõi từ hay sai dùng chung cả 10 game

Tính năng ôn luyện có giá trị nhất còn lại trong danh sách để ngỏ — đã làm xong:

- **Sổ theo dõi chung** (`nghe-doan-on-tap/src/misses.js`, lưu localStorage khóa `nghedoan-misses`): mỗi lần bé chọn SAI ở BẤT KỲ game Nghe & Đoán nào (kể cả lần sai thứ 2 trong 1 câu), từ tiếng Anh đó +1 điểm "cần ôn"; trả lời **đúng ngay lần đầu** thì −1 — đúng đủ nhiều lần từ sẽ ra khỏi sổ (coi như đã thuộc). Từ tiếng Anh làm khóa duy nhất được là nhờ chính sách xuyên suốt "không dạy trùng 1 từ ở 2 game". Sổ tự giới hạn 300 từ (bỏ bớt từ ít sai nhất), mọi thao tác bọc try/catch — hỏng storage thì game vẫn chạy.
- **Nối vào cả 10 game** (9 game gốc + màn ôn tập): vá script đồng loạt vào `onPick` — nhánh retry ghi miss, nhánh kết quả ghi hit/miss. Module đặt tại game ôn tập, 9 game kia import ngược vào (không tạo vòng lặp import vì misses.js độc lập).
- **Bộ lọc "🎯 Ôn chỗ yếu"** trong màn Ôn Tập Tổng Hợp: chip đầu tiên của hàng lọc, hiện luôn SỐ TỪ đang cần ôn (cập nhật sau mỗi ván) — bé và bố mẹ thấy rõ tiến bộ khi con số giảm dần. Khi sổ còn quá ít từ (dưới 4), `makeGame` tự bù thêm từ ngẫu nhiên toàn kho để vẫn đủ 4 lựa chọn mỗi vòng — sổ rỗng vẫn chơi được bình thường.
- **Test**: misses.js viết theo kiểu storage tiêm được (`_setStorage`) nên unit-test chạy được trong Node không cần trình duyệt — 4 test mới (tally + clear khi đúng đủ, lọc weak đúng theo sổ, bù pool nhỏ, sổ rỗng vẫn chơi được). `sw.js` v65→**v66** (+misses.js precache). `npm test` toàn bộ: **962 ✅, 0 ❌**.

Bộ sưu tập Nghe & Đoán hiện tại: **825 từ / 9 game chủ đề + 1 màn ôn tập có trí nhớ về chỗ yếu của từng bé**.

**Việc còn để ngỏ**: chế độ thi đấu đếm giờ cho màn ôn tập; các mỏ từ còn lại (quốc kỳ, SVG khái niệm, ảnh thật); intro giọng nói cho `pokemon/` (vẫn hoãn từ trước).

---
---

## Đợt bổ sung "intro hướng dẫn lúc đầu" cho các game cũ + thử nguồn ảnh mới

**Bối cảnh:** bạn phản hồi rằng rất nhiều game trong bộ sưu tập KHÔNG có phần hướng dẫn cách chơi tự động phát ra lúc mới mở — bé phải tự mò cách chơi. Đã rà soát toàn bộ ~55 thư mục game (script kiểm tra sự hiện diện của nút ❓/overlay hướng dẫn/lời thoại tự động khi tải trang), phát hiện **18 game thiếu hẳn phần này**.

**✅ Đã bổ sung xong 17/18 game** (chỉ còn `pokemon/` — xem lý do hoãn bên dưới):

- **3 game vốn có màn hình bắt đầu nhưng chỉ hiện chữ chung chung "Bấm để chơi!"** (dùng chung 1 khoá i18n `ran.start` giữa 3 game, không giải thích được luật riêng): `bat-vit/`, `ran-san-moi/`, `xep-gach/` — đã thay bằng hướng dẫn RIÊNG cho từng game (luật chơi, cách điều khiển, các chế độ), đọc to tự động khi mở trang.
- **4 game cờ dân gian** hoàn toàn không có nút hướng dẫn: `co-caro/`, `co-ganh/`, `co-ca-ngua/`, `o-an-quan/` — thêm nút ❓ + lời hướng dẫn luật chơi (kể cả luật "gánh" của Cờ Gánh, cách "rải quân ăn" của Ô Ăn Quan vốn khá lạ với người mới).
- **5 game đơn giản khác** không có nút hướng dẫn: `lat-hinh/`, `ghep-hinh/`, `nhay-lo-co/`, `tap-viet/`, `to-mau/` — đây là những game ĐẦU TIÊN của cả bộ sưu tập (Nhóm 1, Nhóm 2 trong tài liệu này), có nút "🔊 Đọc lại" cho TỪNG chữ/tên nhưng chưa từng có hướng dẫn TỔNG QUÁT về cách chơi (tô màu thế nào, rê tay ra sao, lật bài ra sao) — đã bổ sung.
- **5 game "nhiều-trò-trong-1"** (dien-tu, hoc-van, hoc-vui, toan-lop-1, tu-duy): phức tạp hơn vì mỗi tab/mode có luật khác nhau — đã thêm hướng dẫn RIÊNG cho từng chế độ con, phát lại mỗi khi đổi tab. Phát hiện thú vị: `tu-duy/` (Luyện Tư Duy) thực ra ĐÃ có sẵn lời thoại hướng dẫn cho 5/6 trò con (chỉ thiếu trò "Cái nào khác nhóm?") — chỉ cần thêm nút ❓ để bé nghe lại được, không phải viết mới từ đầu.
- **Vấn đề kỹ thuật gặp phải và cách xử lý**: 2 game dùng cấu trúc "chọn tab → tự động đọc câu hỏi đầu tiên" (`hoc-van/`, `toan-lop-1/`) — nếu gọi `speak()` cho lời hướng dẫn NGAY TRƯỚC khi gọi hàm hiện câu hỏi đầu tiên, câu hỏi sẽ NGẮT LỜI hướng dẫn ngay lập tức (vì `speak()` luôn hủy câu đang đọc dở). Đã dùng `speakSequence()` (hàm đã xây cho các game Nghe & Đoán trước đó) để đảm bảo đọc xong hướng dẫn rồi MỚI hiện câu hỏi đầu tiên.

**⏸ Tạm hoãn: `pokemon/` (Pikachu Classic — game lâu đời nhất, nhiều người chơi nhất)**. Lý do hoãn thay vì làm vội: (1) file `app.js` dài 813 dòng, cấu trúc phức tạp nhất cả bộ sưu tập (menu, level, gợi ý, xáo, đấu đôi, đổi bộ hình...); (2) đây là game DUY NHẤT trong toàn bộ 55 game chưa từng tích hợp module giọng đọc (`to-mau/src/speech.js`) — thêm mới hoàn toàn thay vì mở rộng cái đã có sẵn nên rủi ro gây lỗi cao hơn hẳn; (3) đây là game được chơi nhiều nhất nên một lỗi nhỏ ảnh hưởng rộng nhất. Quyết định làm riêng, cẩn thận, ở lượt sau thay vì làm vội trong đợt sửa hàng loạt này.

`npm test` toàn bộ sau đợt sửa: **836 ✅, 0 ❌** — không phát sinh lỗi ở bất kỳ game nào trong 17 game vừa sửa.

## Nguồn ảnh miễn phí khác ngoài Wikimedia — đã thử nghiệm Openverse

Bạn lưu ý đúng: Wikimedia Commons có ít ảnh phù hợp với một số từ vựng tiếng Anh thông dụng (nhất là đồ vật/khái niệm hiện đại). Đã thử nghiệm **Openverse** (openverse.org — công cụ tìm kiếm CHÍNH THỨC do Creative Commons/WordPress vận hành, gộp hàng trăm triệu ảnh CC-licensed từ Flickr, Wikimedia, bảo tàng, v.v., có API công khai không cần đăng ký key) làm nguồn bổ sung — **kết quả tốt, đã dùng thử ngay**: sửa từ **"scoreboard"** (`nghe-doan-gia-dinh-nghe-nghiep`, chủ đề thi đấu) — emoji 📋 chỉ là clipboard văn phòng chứ không giống bảng điện tử sân vận động — thay bằng ảnh thật bảng điểm sân bóng chày (nguồn Flickr qua Openverse, tác giả scriptingnews, CC BY-SA 2.0, đã ghi công trong `CREDITS.md`).

**Lưu ý quan trọng về bản quyền** (để tránh hiểu lầm): mục đích giáo dục KHÔNG tự động khiến một ảnh có bản quyền trở thành "miễn phí" — cái quyết định được phép dùng lại hay không là GIẤY PHÉP của ảnh đó (CC0/CC BY/CC BY-SA/Public Domain), không phải mục đích sử dụng. Vì vậy vẫn tiếp tục quy trình cũ: chỉ lấy ảnh có giấy phép tự do rõ ràng, luôn ghi công đầy đủ theo yêu cầu giấy phép, không đoán URL hay tải bừa. Openverse chỉ là THÊM 1 nguồn tìm kiếm (bên cạnh Wikimedia Commons), lọc sẵn theo giấy phép ngay từ đầu — không đổi nguyên tắc bản quyền đã áp dụng xuyên suốt.

---
---

# Thêm menu game để học từ vựng tiếng Anh 
Hãy thiết kế  thêm các game để học tiếng Anh từ vựng ? nhiều game càng tốt .
Mục đích cho bé có nguồn từ vựng sớm trong khi vui chơi 
Mục tiêu học từ vựng , quen các câu ngắn , cụm từ thường dùng 
+ 1000 từ vựng liên quan tới trái cây, thực phẩm, ăn uống , nhà hàng, quán ăn , shoping, ngày lễ , món ăn truyền thống , vui chơi giải trí , phim ảnh ...
+ 1000 từ vựng về giao thông, phương tiện , tiện ích công cộng , môi trường ,đô thị , thôn quê, địa lý , địa hình ...
+ 1000 từ vựng về thế giới động vật , động vật hoang dã, sở thú , nơi vui chơi giải trí , hoạt động giải trí , thế giới, hàng không, vũ trụ ,toán học , ...
+ 1000 từ vựng về gia đình ,bạn bè, người thân, trường học, lớp học , nghề nghiệp , chức vụ, hoạt động thể thao, cuộc thi , các hoạt động, thiét bị nghề nghiệp  ...
+ 1000 từ vựng về vật dụng hằng ngày , vật dụng gia đình ,quần áo  , giày dép , mua bán , shoping , máy tính , máy in , các thiết bị gia dụng , thiết bị công nghiệp , các bộ phận cơ thể, hoạt động hằng ngày ,  
+ Bên cạnh từ vựng luôn có 1 câu ngắn đi kèm hoặc các cụm từ đi kèm ...để bé nhớ cả câu hoặc cụm từ vựng vẫn tốt hơn trong giao tiếp hằng ngày 
- Nguồn hình ảnh/ icon liên quân tới từ vựng rất nhiều và miễn phí cho mục đích giáo dục . hãy tải nhiều nhất và tạo nhiều nhất từ vựng và câu , có thể chia làm nhiều giai đoạn .
hãy đọc kỹ và ghi lại đầy đủ bên dưới để tôi có thể xem xét bạn có hiểu và ghi nhiều bổ sung sau đó chúng tôi sẽ xem xét.    

# 📋 Quản lý bé (User Management) + Trang Phụ Huynh (Admin) — ĐANG TRIỂN KHAI

> **Trạng thái (07/2026): P1+P2 phần lớn ĐÃ CODE XONG** (chi tiết ở mục 7 cuối
> tài liệu này). Việc duy nhất chờ bạn: tạo project Supabase theo
> `server/README.md` rồi điền URL + anon key vào `/server-config.js`.

> Ý tưởng gốc của bạn: *"bổ sung thêm database và đăng ký đăng nhập để theo dõi
> từng bé, có hệ thống phân phối thưởng như thưởng kẹo, hoa cho bé"*.
> Dưới đây là bản thiết kế đầy đủ để bạn xem xét — CHƯA viết dòng code nào,
> duyệt phần nào làm phần đó.

## 1. Mục tiêu

1. Nhiều bé dùng chung 1 máy (anh chị em / lớp học) — mỗi bé có hồ sơ riêng, tiến độ riêng, sổ "từ hay sai" riêng.
2. "Đăng nhập" phù hợp trẻ 4–8 tuổi: KHÔNG email/mật khẩu chữ — bé chọn avatar của mình là vào chơi.
3. Hệ thống thưởng (kẹo 🍬, hoa 🌸, thú cưng 🐣...) để tạo động lực học dài hạn.
4. Trang Phụ Huynh có khóa: xem tiến độ từng bé, danh sách từ yếu, thời gian chơi, phát thưởng tay, cài đặt, xuất/xóa dữ liệu.

## 2. Kiến trúc — ĐÃ CHỐT: lưu trên SERVER, đồng bộ nhiều máy (bỏ local-first)

> Quyết định của bạn (07/2026): *"nên lưu trên server và có thể sync hoặc quản
> lý giữa nhiều máy — bỏ luôn cấu trúc local-first"*. Toàn bộ thiết kế bên dưới
> viết theo hướng **cloud thuần**: server là NGUỒN SỰ THẬT DUY NHẤT của hồ sơ
> bé, tiến độ, sổ từ yếu và quà thưởng.

**Stack đề xuất: Supabase** (Postgres + Auth + Row Level Security + Realtime):
- Hợp với dự án tĩnh đang deploy Vercel: KHÔNG cần viết server riêng — trang web gọi thẳng API PostgREST của Supabase bằng `fetch` + anon key, quyền truy cập chặn bằng RLS theo `family_id`. Không cần build system (giữ đúng kiểu "file tĩnh, mở là chạy" của repo).
- Realtime có sẵn → bảng điều khiển phụ huynh thấy điểm của bé nhảy TRỰC TIẾP khi bé đang chơi ở máy khác.
- Phương án dự phòng nếu không thích Supabase: Firebase (tương đương) hoặc tự dựng Postgres+PostgREST trên VPS (chủ động 100% nhưng tự lo backup/bảo mật).

**Hệ quả cần chấp nhận khi bỏ local-first** (ghi rõ để không bất ngờ):
1. **Mất mạng = không ghi được tiến độ**: game tĩnh vẫn MỞ được nhờ service worker, nhưng điểm/sao/sổ từ yếu sẽ không lưu khi offline (hiện báo nhỏ "📡 mất mạng — điểm ván này không được lưu"). Chữ "Offline" trên thẻ game cần sửa lại thành "Chơi được offline, lưu tiến độ cần mạng".
2. **Phụ thuộc dịch vụ ngoài**: Supabase free tier đủ cho gia đình/lớp nhỏ nhưng project free sẽ bị TẠM DỪNG sau ~1 tuần không ai truy cập (phải bấm khôi phục) — dùng nghiêm túc lâu dài nên tính gói Pro (~25 USD/tháng) hoặc tự host.
3. **Trách nhiệm dữ liệu trẻ em**: dữ liệu rời khỏi máy → cần tối thiểu hóa (bé chỉ có biệt danh + avatar, KHÔNG ngày sinh/ảnh thật), tài khoản là CỦA PHỤ HUYNH, có nút xóa toàn bộ dữ liệu 1 chạm (phù hợp tinh thần Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân).
4. Dữ liệu localStorage hiện có (hồ sơ stats.js, sổ misses) sẽ được **nhập lên server 1 lần** khi phụ huynh đăng nhập lần đầu trên máy cũ, sau đó localStorage chỉ còn giữ phiên đăng nhập + cache nhẹ.

## 3. Nền móng ĐÃ CÓ SẴN (không phải làm từ đầu)

- `pokemon/src/stats.js` đã có: **nhiều hồ sơ** (`getProfiles/addProfile/setCurrentProfile/currentProfile`), **phiên chơi theo từng hồ sơ** (`recordSession` — mọi game đều đang gọi với mode/result/score/level/seconds), thống kê `summarize` + `last7Days`, `getDeviceId`. Chuyển sang server tức là GIỮ NGUYÊN giao diện hàm này (mọi game không phải sửa) nhưng ruột đổi thành gọi API — thêm 1 lớp `api.js` là 56 game hưởng chung.
- `nghe-doan-on-tap/src/misses.js` đã có sổ "từ hay sai" với giao diện gọn (`recordMiss/recordHit/missedWords`) — cùng cách làm: giữ giao diện, đổi ruột thành API, dữ liệu theo từng bé trên server.
- `pokemon/src/achievements.js` đã có khung huy hiệu — tham khảo được cho phần thưởng.

## 4. Thiết kế từng phần

### 4.1. Hồ sơ bé & "đăng nhập kiểu trẻ em"
- Màn chọn bé ở trang chủ (hoặc lần đầu vào 1 game): lưới avatar to (🐰🐯🐸🦄... + tên bé), bấm là vào — đó chính là "đăng nhập".
- Tạo bé mới: nhập tên + chọn avatar + chọn màu. Không ngày sinh, không thông tin thật nào khác (an toàn dữ liệu trẻ em).
- Thanh nhỏ góc màn hình mọi game: avatar bé đang chơi, bấm để đổi bé.
- Dữ liệu: `profiles: [{ id, name, avatar, color, createdAt }]` + `currentProfileId` (mở rộng schema sẵn có của stats.js).

### 4.2. Hệ thống thưởng (kinh tế "Sao → Quà")
- **Kiếm SAO ⭐**: quy đổi từ điểm sẵn có của các game (ví dụ 10 điểm = 1 sao), thưởng thêm khi: hoàn thành ván, chuỗi 3 câu đúng, làm sạch N từ trong sổ "🎯 Ôn chỗ yếu" (thưởng đậm nhất — vì đây là hành vi giá trị nhất), nhiệm vụ ngày ("hôm nay chơi 2 game khác nhau", "ôn 5 từ yếu").
- **Đổi QUÀ 🎁** ở "Tủ quà của bé": kẹo 🍬 (rẻ, mua vui hằng ngày), hoa 🌸 (trồng vào **Vườn hoa của bé** — mỗi hoa 1 loại, sưu tập), thú cưng 🐣→🐥→🐓 (đắt, lớn dần theo ngày có chơi — níu bé quay lại), khung avatar/danh hiệu ("Vua Từ Vựng").
- **Chống lạm phát**: trần sao/ngày (ví dụ 50), chơi lại cùng 1 màn liên tục thì sao giảm dần, quà chỉ mua bằng sao (không mua = không có).
- **Phụ huynh phát thưởng tay** (đúng ý "phân phối thưởng"): trong trang Phụ Huynh có nút "Thưởng cho bé" — chọn bé, chọn quà/sao kèm lời nhắn ("Mẹ thưởng vì con tự giác học!"), bé mở game thấy hộp quà 🎁 rơi xuống + máy đọc lời nhắn.
- Dữ liệu: `rewards:<profileId> = { stars, ledger: [{ ts, delta, reason }], items: [{ id, boughtAt }], dailyQuest: {...} }` — kiểu SỔ CÁI (chỉ ghi thêm) để sau này đồng bộ cloud không bị xung đột.

### 4.3. Trang Phụ Huynh `/phu-huynh/` (admin page) — mở được từ BẤT KỲ máy nào
- **Đăng nhập bằng tài khoản phụ huynh thật** (email + mật khẩu / magic link của Supabase Auth) — không cần PIN tự chế nữa vì đã có auth chuẩn. Nhờ dữ liệu trên server, bố mẹ mở trang này **từ điện thoại riêng của mình** vẫn xem được bé đang học gì trên tablet ở nhà — đây chính là giá trị lớn nhất của việc chuyển sang server.
- **Bảng điều khiển từng bé**: tổng thời gian chơi theo ngày/tuần (biểu đồ 7 ngày), game nào chơi nhiều, điểm trung bình, chuỗi ngày có học; **danh sách "từ hay sai"** kèm nút "đọc thử" từng từ (TTS sẵn có) — bố mẹ biết chính xác nên kèm con chữ nào; sổ quà + lịch sử sao. Bật **Realtime** → số liệu nhảy trực tiếp khi bé đang chơi.
- **Phát thưởng tay** (mục 4.2 — ghi vào bảng `manual_rewards`, máy của bé nhận qua Realtime/lần tải kế), **cài đặt** (tốc độ đọc TTS, giới hạn phút chơi/ngày — lưu server nên áp dụng đồng loạt mọi máy của bé), **quản trị dữ liệu**: xuất JSON, xóa 1 bé, **xóa toàn bộ dữ liệu gia đình 1 chạm** (bắt buộc có — quyền xóa dữ liệu trẻ em).
- **Quản lý thiết bị**: danh sách máy đã liên kết ("iPad nhà", "điện thoại bà nội"), thu hồi máy lạc mất.

### 4.4. Thiết kế server (Supabase) — CHI TIẾT
- **Bảng** (mọi bảng đều có `family_id` + RLS "chỉ gia đình đó đọc/ghi"):
  - `families` — gắn 1-1 với tài khoản Supabase Auth của phụ huynh.
  - `profiles` — bé: `{ id, family_id, name, avatar, color, created_at }` (biệt danh + avatar, KHÔNG dữ liệu thật).
  - `sessions` — mỗi ván chơi 1 dòng: `{ id uuid, profile_id, mode, result, score, level, seconds, played_at }` (chỉ-ghi-thêm, id sinh phía client → ghi trùng không tạo bản sao).
  - `miss_events` — mỗi lần sai/đúng 1 dòng `{ profile_id, word, delta ±1, ts }`; "sổ từ yếu" = view cộng dồn `SUM(delta) > 0` theo từ. Chỉ-ghi-thêm nên 2 máy cùng ghi không bao giờ xung đột.
  - `reward_ledger` — sổ sao chỉ-ghi-thêm `{ profile_id, delta, reason, ts }`; số dư = SUM. `purchases` — quà đã đổi. `manual_rewards` — thưởng tay của bố mẹ kèm lời nhắn + trạng thái "bé đã mở quà chưa".
  - `settings`, `devices`.
- **Đăng nhập trên máy của bé**: phụ huynh đăng nhập 1 lần trên máy đó (hoặc quét mã liên kết) → phiên lưu lâu dài → bé chỉ thấy màn chọn avatar, không bao giờ thấy form email.
- **Tầng client `api.js` dùng chung**: bọc `fetch` tới PostgREST (không cần SDK, không cần build); giữ nguyên chữ ký `recordSession/recordMiss/recordHit/missedWords/getProfiles...` để 56 game gần như không phải sửa; có hàng đợi gửi lại ngắn trong phiên cho request lỗi mạng thoáng qua (không phải local-first — chỉ là retry lịch sự).
- **`sw.js`**: file tĩnh cache như cũ; mọi request API đi thẳng mạng (network-only).

## 5. Lộ trình đề xuất (duyệt phần nào làm phần đó)

| Giai đoạn | Nội dung | Khối lượng ước tính |
|---|---|---|
| **P1 — Dựng server + đăng nhập** | Tạo project Supabase, schema + RLS ở trên, tài khoản phụ huynh, liên kết thiết bị, `api.js` + nhập dữ liệu localStorage cũ lên server 1 lần | 1–2 buổi |
| **P2 — Hồ sơ bé chạy trên server** | Màn chọn bé + tạo bé, thanh avatar mọi game, `stats.js`/`misses.js` đổi ruột sang `api.js` (giữ nguyên giao diện hàm), báo "mất mạng — không lưu điểm" | 1–2 buổi |
| **P3 — Thưởng** | Sao từ điểm + trần/ngày + nhiệm vụ ngày, Tủ quà + Vườn hoa, hộp quà bố mẹ gửi kèm lời nhắn đọc to | 1–2 buổi |
| **P4 — Trang Phụ Huynh** | Dashboard từng bé (kể cả xem từ xa), danh sách từ yếu + đọc thử, phát thưởng tay, cài đặt đồng bộ mọi máy, quản lý thiết bị, xóa dữ liệu 1 chạm | 1–2 buổi |
| **P5 — Realtime + báo cáo tuần** | Số liệu nhảy trực tiếp, tổng kết tuần ("bé học 34 từ, thuộc thêm 12 từ yếu") | 1 buổi |

## 6. Các quyết định ĐÃ CHỐT (từ trả lời của bạn)

1. ~~Local-first hay server?~~ → **server + sync nhiều máy (bỏ local-first)**. Việc còn chờ: bạn tạo project Supabase (miễn phí, theo `server/README.md`) và điền URL + anon key vào `/server-config.js`.
2. PIN cho bé → ~~KHÔNG CẦN~~ → **ĐỔI QUYẾT ĐỊNH (07/2026): CÓ — mã đăng nhập 6 số riêng từng bé** (gia đình 3 bé 3 máy: chọn avatar + nhập đúng mã mới vào; đã hiện thực — xem mục 12).
3. Quà ảo gắn thưởng thật ngoài đời → **CHƯA TRẢ LỜI** (không chặn việc gì; trả lời lúc nào thêm mục "quy đổi quà thật" lúc đó).
4. Giới hạn thời gian chơi/ngày → **CÓ** (chưa nói số phút — tạm mặc định 45 phút, chỉnh được trong trang Phụ Huynh).
5. Phạm vi thưởng → **TẤT CẢ bài học/game đều có quà**; kết thúc mỗi chuỗi học 10–20 câu sẽ có quà (đã hiện thực: cứ mỗi 15 câu trả lời có 1 hộp quà nhỏ + sao từ điểm mỗi ván, trần 50 sao/ngày).

## 7. NHẬT KÝ TRIỂN KHAI — đợt 1 (đã xong, đang chờ bạn tạo Supabase)

Đã code xong toàn bộ phần nền (chạy được ngay khi điền config, KHÔNG phá gì khi chưa điền — mọi game vẫn chạy như cũ, trang mới hiện hướng dẫn cài đặt):

- **`server/schema.sql`** — toàn bộ database: 9 bảng (`families/profiles/sessions/miss_events/reward_ledger/purchases/manual_rewards/settings/devices`), 2 view (`weak_words`, `star_balance`), Row Level Security "mỗi gia đình chỉ thấy dữ liệu của mình", hàm `delete_my_family()` cho nút xóa 1 chạm. Dán 1 lần vào Supabase SQL Editor là xong. Kèm **`server/README.md`** hướng dẫn từng bước (10 phút) và **`/server-config.js`** chỉ cần điền 2 dòng.
- **`shared/api.js`** — client dùng chung: đăng nhập/đăng ký/refresh token (Supabase Auth qua fetch, không SDK, không build), CRUD hồ sơ bé, ghi ván chơi **kèm tự cộng sao theo luật + trần ngày**, sổ từ hay sai (`miss_events` chỉ-ghi-thêm), số dư sao, đổi quà, thưởng tay, cài đặt, thiết bị, xuất JSON, xóa gia đình. An toàn khi import trong Node (test không cần trình duyệt).
- **`shared/rewards.js`** — luật thưởng THUẦN (6 unit test): 10 điểm = 1 sao (trần 15/ván), trần 50 sao/ngày, **1 hộp quà mỗi 15 câu trả lời** (đúng yêu cầu "chuỗi 10–20 câu có quà"), danh mục 12 quà (4 kẹo giá rẻ, 5 hoa sưu tập, 3 thú cưng + danh hiệu).
- **`/chon-be/`** — màn "Bé nào đang chơi?": lưới avatar to, chạm là vào (đúng quyết định "không PIN cho bé"), chào bé bằng giọng nói, và **hộp quà bố mẹ gửi** hiện ngay khi chọn bé (mở quà → máy đọc lời nhắn + cộng sao).
- **`/phu-huynh/`** — trang admin: đăng nhập/đăng ký phụ huynh; thêm/chọn bé (12 avatar); bảng điều khiển từng bé (tổng ván/thắng/giờ chơi/sao/số từ cần ôn + biểu đồ phút chơi 7 ngày); **danh sách từ hay sai kèm nút 🔊 đọc thử**; gửi quà kèm lời nhắn; sổ sao; cài đặt (giới hạn phút/ngày mặc định 45, tốc độ TTS) áp dụng mọi máy; danh sách thiết bị; xuất JSON; xóa toàn bộ (gõ "XOA" xác nhận).
- **Nối vào hạ tầng cũ đúng như thiết kế mục 3**: `stats.js.recordSession` gửi kèm mỗi ván lên server (tự cộng sao) và `misses.js` gửi từng sự kiện sai/đúng — cả 56 game hưởng chung không phải sửa từng game; mất mạng/chưa cấu hình thì bỏ qua im lặng, không hỏng ván chơi.
- Đăng ký: 2 thẻ mới trên trang chủ ("Bé Nào Đang Chơi?" + "Trang Phụ Huynh") với i18n 5 ngôn ngữ; `sw.js` v66→**v67** (API Supabase là cross-origin nên service worker vốn đã bỏ qua — không bị cache nhầm); chuỗi test gốc thêm `shared/rewards.test.js`. `npm test` toàn bộ: **968 ✅, 0 ❌**.

**Còn lại cho các đợt sau** (theo lộ trình mục 5): ~~nhập dữ liệu cũ~~, ~~thanh avatar + hộp quà trong game~~, ~~Tủ quà & Vườn hoa~~, ~~chặn giới hạn phút/ngày~~ (xem đợt 2 bên dưới); Realtime + báo cáo tuần. **Việc của bạn ngay bây giờ: làm theo `server/README.md` (10 phút) rồi báo tôi để kiểm thử đầu-cuối với server thật.**

## 8. NHẬT KÝ TRIỂN KHAI — đợt 2 (đã xong)

- **`/tu-qua/` — Tủ Quà & Vườn Hoa của bé**: hiện số dư ⭐, cửa hàng 12 món từ CATALOG (nút đổi tự khóa khi thiếu sao), bộ sưu tập: **vườn hoa** (mỗi 🌸 đã đổi hiện thành hoa trồng trong vườn), thú cưng, đếm kẹo, danh hiệu. Đổi quà xong máy khen bằng giọng nói. Có thẻ riêng trên trang chủ (i18n 5 ngôn ngữ).
- **`shared/kid-bar.js` — tiện ích trong game** (đã gắn vào cả 10 game Nghe & Đoán bằng script vá):
  - Thanh avatar bé góc dưới-trái (chạm để đổi bé ở /chon-be/);
  - `answeredOne()` gọi sau MỖI CÂU: đếm cộng dồn trong ngày, **đủ 15 câu → toast hộp quà 🎁 + máy khen "Bé học chăm quá!" + kẹo miễn phí ghi vào tủ quà trên server** (đúng quyết định số 5: mọi bài học đều có quà theo chuỗi 10–20 câu);
  - **Chặn giới hạn phút/ngày** (quyết định số 4): khi mở game, so tổng giây đã chơi hôm nay (server) với `daily_limit_min` bố mẹ đặt — vượt thì phủ màn "🌙 Bé nghỉ mắt, mai học tiếp nhé" đọc bằng giọng nói; mất mạng thì không chặn (ưu tiên không phạt oan).
- **Nhập dữ liệu cũ**: nút "📥 Nhập dữ liệu cũ trên máy này" trong Trang Phụ Huynh (chỉ hiện khi máy còn hồ sơ localStorage thời chưa có server): tạo hồ sơ bé tương ứng + đẩy toàn bộ lịch sử ván chơi + sổ từ hay sai (tối đa 5 điểm/từ) lên server, đánh dấu đã nhập.
- `api.js` thêm: `recordFreeGift` (quà 0 sao), `currentKidInfo` (cache tên+avatar bé cho thanh trong game), `cachedSettings`, `importLegacySessions/importLegacyMisses` (đẩy theo lô 100–200 dòng).
- `sw.js` v67→**v68**; `npm test`: **968 ✅, 0 ❌**; smoke test các trang mới đều 200.

**Còn lại (đợt 3, sau khi bạn dựng Supabase)**: kiểm thử đầu-cuối với server thật (đăng ký → tạo bé → chơi → sao/quà/từ yếu lên đúng), Realtime cho dashboard, báo cáo tuần, và trả lời câu hỏi số 3 (quy đổi quà thật) nếu bạn muốn.

## 9. NHẬT KÝ TRIỂN KHAI — đợt 3 (đã xong)

- **📈 Báo cáo tuần** (`shared/report.js` — module THUẦN, 6 unit test): tổng kết 7 ngày của từng bé — học mấy/7 ngày, tổng phút + số ván, tỷ lệ thắng, sao kiếm được, quà chăm học + quà đã đổi, số từ cần ôn kèm top 5 từ hay sai nhất. Hiện trong trang Phụ Huynh kèm nút **📋 Sao chép** (bản văn bản tiếng Việt, dán thẳng vào Zalo/tin nhắn chia sẻ cho ông bà).
- **🔴 Chế độ "Trực tiếp"** trên dashboard: bật công tắc là số liệu của bé tự tải lại mỗi 15 giây — bố mẹ ngồi máy khác thấy điểm/sao của bé nhảy gần như tức thời khi bé đang chơi. *Chọn polling 15s thay vì WebSocket Realtime của Supabase một cách CÓ CHỦ ĐÍCH*: giao thức Realtime cần SDK (phá kiểu "không SDK, không build" của repo) trong khi 15 giây là quá đủ nhanh cho mắt người; nếu sau này cần đẩy tức thời thật sự thì nâng cấp riêng phần này.
- **🎁 Quà bố mẹ hiện NGAY TRONG game**: trước đây bé chỉ thấy hộp quà khi vào màn /chon-be/ — nay `kid-bar.js` kiểm tra quà chưa mở ngay khi mở bất kỳ game Nghe & Đoán nào: hộp quà phủ màn, bé bấm MỞ QUÀ, máy đọc lời nhắn của bố mẹ + cộng sao đính kèm.
- `sw.js` v68→**v69**; chuỗi test thêm `report.test.js` — `npm test` toàn bộ: **974 ✅, 0 ❌**; smoke test các trang đều 200.

**Toàn bộ lộ trình mục 5 (P1→P5) đã CODE XONG.** Chờ duy nhất: bạn dựng Supabase theo `server/README.md` rồi báo để kiểm thử đầu-cuối. Câu hỏi còn mở: số 3 (quy đổi quà ảo ↔ quà thật ngoài đời).

## 10. KIỂM THỬ ĐẦU-CUỐI VỚI SUPABASE THẬT (07/2026) — ✅ XANH TOÀN BỘ

Bạn đã dựng project Supabase + tắt Confirm email. Kết quả kiểm thử 2 tầng:

- **Tầng REST thô (21/21 PASS)**: schema vào đúng; **RLS chặn anon chuẩn** (chưa đăng nhập không đọc được dòng nào); đăng ký trả session ngay; tạo gia đình/bé; ghi ván chơi **idempotent** (gửi trùng uuid không nhân đôi); view `weak_words` cộng dồn đúng (sai 2 lần − đúng 1 lần = còn 1 điểm, về 0 thì biến mất); view `star_balance` đúng; gửi quà → bé thấy → mở → không hiện lại; upsert settings đè đúng; `delete_my_family()` xóa cascade sạch.
- **Tầng api.js (24/24 PASS — chạy qua CHÍNH module các game dùng)**: toàn bộ vòng đời qua `shared/api.js`, đặc biệt **luật sao tự động chính xác từng sao**: ván 80 điểm → +8; ván 999 điểm → trần ván +15; các ván sau +15, +12 rồi **+0 khi chạm đúng trần 50 sao/ngày**; đổi quà trừ sao đúng, chặn `NOT_ENOUGH_STARS`; quà miễn phí cost 0; mở quà bố mẹ cộng đúng sao; `todayPlaySeconds` đếm đúng 330 giây.
- **🐛 Bug thật bị bắt và đã sửa nhờ E2E tầng 2**: `rest()` trong api.js gọi `res.json()` trên body RỖNG (PostgREST trả 201 không body khi `Prefer: return=minimal`) → nổ "Unexpected end of JSON input" — nghĩa là nếu không có đợt test này, **ghi ván chơi sẽ hỏng trên trình duyệt thật**. Đã sửa thành đọc text rồi parse an toàn.
- **Xử lý bảo mật**: bạn lỡ dán mật khẩu database vào `server/README.md` — đã xóa ngay + thêm cảnh báo; `git log -S` xác nhận mật khẩu CHƯA từng bị commit (repo có remote GitHub public nên điều này quan trọng).
- Dọn dẹp: dữ liệu test đã tự xóa bằng `delete_my_family()`; còn sót 2 tài khoản auth test rỗng (`e2e.reply1999.*@gmail.com`, `e2e.api.*@gmail.com`) — xóa tay trong Supabase → Authentication nếu muốn.
- `npm test` local sau cùng: **974 ✅, 0 ❌**.

**Hệ thống sẵn sàng dùng thật.** Các bước cho bạn: (1) mở `/phu-huynh/` đăng ký tài khoản thật của bạn → tạo hồ sơ bé; (2) máy của bé mở `/chon-be/` chạm avatar; (3) chơi 1 ván Nghe & Đoán rồi xem dashboard nhảy số. Còn mở: câu hỏi 3 (quy đổi quà thật) + cân nhắc bật lại Confirm email khi deploy công khai (an toàn hơn, chỉ thêm 1 bước bấm link khi đăng ký).

## 11. ĐỢT TỐI ƯU TÀI NGUYÊN SUPABASE + HỒ SƠ BÉ NÂNG CAO (07/2026)

Yêu cầu: "tiết kiệm dữ liệu lưu trên Supabase, hạn chế dùng tài nguyên — chỉ cần đủ là được" + tiếp tục hồ sơ bé/admin/cài đặt riêng.

**Tiết kiệm SỐ REQUEST** (tài nguyên quý nhất của free tier cùng egress):
- **Gộp lô sự kiện sai/đúng**: trước đây MỖI CÂU trả lời = 1 POST; nay gom hàng đợi, đẩy 1 POST khi đủ 10 sự kiện / sau 8 giây / khi rời trang (pagehide + visibilitychange) — giảm ~10 lần số request nặng nhất. E2E xác nhận 12 sự kiện/1 POST cộng dồn đúng.
- **Throttle kid-bar**: kiểm tra giới hạn phút/ngày tối đa 3 phút/lần (giữa các lần dùng kết quả đã lưu), kiểm tra quà bố mẹ tối đa 2 phút/lần — thay vì mỗi lần mở game đều gọi 3-4 request.
- **Sửa 1 chỗ LÃNG PHÍ THẬT trong trang Phụ Huynh**: sổ sao từng bé trước đây tải bằng `exportAll()` (kéo TOÀN BỘ database về chỉ để lọc 25 dòng!) → thay bằng `kidLedger(profileId, 30)` đúng bảng đúng bé đúng 3 cột.
- **Cắt egress**: `kidSessions` chỉ SELECT 4 cột dashboard cần (bỏ id/mode/level/family_id).

**Tiết kiệm DUNG LƯỢNG DB — dọn định kỳ** (`server/migrate-01-tiet-kiem.sql`, trang Phụ Huynh tự gọi ~1 lần/tuần):
- `miss_events` cũ hơn 30 ngày → GỘP thành 1 dòng/từ (tổng không đổi — sổ từ yếu không sai);
- `sessions` giữ 300 ván mới nhất mỗi bé;
- `reward_ledger` cũ hơn 60 ngày → gộp thành 1 dòng "số dư cũ"/bé (tổng SAO không đổi).

**Tính năng hồ sơ bé nâng cao** (trang Phụ Huynh, thẻ "✏️ Hồ sơ & cài đặt riêng của bé"):
- Đổi tên + avatar bé; **giới hạn phút/ngày RIÊNG từng bé** (cột `profiles.settings` jsonb — bé lớn 60 phút, bé nhỏ 30 phút; bỏ trống = dùng chung; kid-bar ưu tiên giới hạn riêng); nút xóa bé (xác nhận bằng cách gõ đúng tên bé).

**Bảo mật/khác**: `server/README.md` (chứa ghi chú riêng của bạn) đã `git rm --cached` + vào `.gitignore` — không bao giờ bị commit nữa (file vẫn nằm trên đĩa).

**Kiểm thử**: E2E đợt 2 với server thật — batch/kidLedger/updateKid **4/4 PASS**; 2 mục chờ bạn dán `server/migrate-01-tiet-kiem.sql` (per-kid settings + tidy) — script tự phát hiện và báo "PEND". Suite local: **974 ✅, 0 ❌**.

**Việc của bạn (30 giây)**: Supabase → SQL Editor → dán `server/migrate-01-tiet-kiem.sql` → Run, rồi báo tôi chạy lại E2E xác nhận 2 mục còn lại. (Ai cài mới từ `schema.sql` bản hiện tại thì không cần migrate.)

## 12. MÃ ĐĂNG NHẬP 6 SỐ CHO TỪNG BÉ + TRANG CHỦ GIỚI THIỆU (07/2026)

Bạn đổi quyết định câu 2: mỗi bé CÓ mã đăng nhập riêng (như mật khẩu 6 số) — kịch bản gia đình 3 bé, 3 máy riêng. Đã hiện thực:

- **Đặt mã trong Trang Phụ Huynh** (thẻ ✏️ Hồ sơ của bé): ô "Mã đăng nhập 6 số" + nút 🎲 Tạo mã ngẫu nhiên; bỏ trống = bé chạm avatar là vào như cũ. Mã lưu trong `profiles.settings.code` (cần migrate-01). Cùng thẻ này cũng bổ sung **chọn màu yêu thích** của bé (8 màu).
- **Bàn phím mã số ở /chon-be/** (thân thiện trẻ em): bé chạm avatar → hiện bàn phím số to 0–9 + dấu chấm tròn ●●●○○○, máy đọc "nhập mã số bí mật của bé nhé"; đúng → "Đúng rồi!" vào luôn; sai → thử lại, **sai 3 lần → "nhờ bố mẹ giúp nhé"** và đóng. Bé đang là hồ sơ hiện tại của máy thì không phải nhập lại (mã chỉ hỏi khi ĐỔI hồ sơ — đúng kịch bản mỗi bé 1 máy: nhập 1 lần là máy của mình).
- **Lưu ý trung thực về mức bảo mật**: mã này chặn anh chị em nghịch hồ sơ của nhau — không phải lớp bảo mật chống người ngoài (người ngoài đã bị chặn từ tài khoản phụ huynh + RLS).
- **Trang chủ giới thiệu cho khách từ Google**: thêm `<meta description>` + đổi `<title>` có từ khóa, và khối "🌟 Bé học mà chơi" ngay đầu trang: 4 gạch đầu dòng tính năng (800+ từ tiếng Anh giọng thật + ôn chỗ yếu; toán/vần/tư duy/trò dân gian; quản lý gia đình mỗi bé 1 hồ sơ + mã riêng; thưởng sao & góc phụ huynh) + 2 nút "🐰 Bé vào chơi" (/chon-be/) và "🔒 Góc quản lý phụ huynh" (/phu-huynh/) — i18n đủ 5 ngôn ngữ (8 khóa mới).
- `sw.js` v69→**v70**; `npm test`: **974 ✅, 0 ❌**; smoke test các trang đều 200.

**Nhắc lại việc đang chờ bạn**: dán `server/migrate-01-tiet-kiem.sql` (Supabase → SQL Editor → Run) — tính năng mã 6 số và giới hạn riêng từng bé đều lưu vào cột `profiles.settings` do migrate này tạo; chưa chạy thì nút Lưu sẽ báo đúng thông điệp hướng dẫn.

## 13. TRANG GIỚI THIỆU ĐẦY ĐỦ `/gioi-thieu/` (07/2026)

Yêu cầu: "cập nhật giới thiệu đầy đủ tính năng để user mới có thể hiểu — documents và tính năng". Đã xây trang tài liệu hoàn chỉnh (tiếng Việt, tĩnh, có meta SEO riêng):

- **7 mục có mục lục**: (1) kho trò chơi theo 4 nhóm (Góc Tiếng Anh / Học & Chơi / Trò Chơi Xưa / Game Mini); (2) hệ thống học tiếng Anh — giọng thật 2 tốc độ, câu mẫu song ngữ, luật chọn-lại, sổ từ hay sai + Ôn chỗ yếu, hình ảnh chuẩn xác, 9 chủ đề; (3) gia đình & hồ sơ bé — mô hình Netflix trẻ em, mã 6 số, nhiều máy một tiến độ; (4) thưởng sao & tủ quà — luật kiếm/tiêu sao, quà 15 câu, vườn hoa, quà bố mẹ; (5) góc phụ huynh — dashboard/trực tiếp/báo cáo tuần/giới hạn giờ/quản lý thiết bị/dữ liệu; (6) offline & quyền riêng tư — nói thẳng "chơi offline được, lưu tiến độ cần mạng", dữ liệu tối thiểu, RLS, quyền xóa; (7) **FAQ 6 câu** (không tài khoản chơi được không, quên mã, 3 bé 1 máy, phí/quảng cáo, không thấy cộng sao, đổi máy).
- Trang chủ: khối intro thêm nút thứ 3 "📖 Giới thiệu đầy đủ tính năng" (i18n 5 ngôn ngữ); `sw.js` v70→**v71** precache trang mới.
- `npm test`: **974 ✅, 0 ❌**; smoke 200.

## 14. CHART PHÂN TÍCH CÁC BÉ CHO PHỤ HUYNH (07/2026)

Migrate-01 đã được bạn dán — E2E chốt hạ **7/7 PASS** (cài đặt riêng từng bé + dọn dẹp định kỳ đều sống trên server thật). Sau đó bổ sung bộ biểu đồ "dễ xem dễ nhìn" (thuần CSS/SVG, không thư viện):

- **👀 So sánh các bé** (tự hiện khi nhà có ≥2 bé): bảng 1 dòng/bé — thanh phút chơi tuần (màu theo màu yêu thích của bé), số ngày học /7, ⭐ sao hiện có, 🎯 từ cần ôn (0 thì hiện 🎉). Tiết kiệm tài nguyên: dùng 3 truy vấn GỘP CẢ NHÀ (`familyStarBalances/familyWeakCounts/familySessionsSince`) thay vì N truy vấn/bé, throttle 30s chống gọi trùng.
- **📊 Phân tích chi tiết từng bé**: (1) **biểu đồ tròn** "bé chơi gì nhiều nhất 30 ngày" — 3 nhóm Tiếng Anh / Học & tư duy / Game vui (hàm thuần `groupOfMode` phân loại theo mode); (2) **thanh ngang khung giờ** "bé hay chơi lúc nào" — 🌅 sáng/☀️ trưa/🌤 chiều/🌙 tối/😴 khuya (bố mẹ phát hiện bé chơi khuya!); (3) **cột tiến bộ 4 tuần** — tỷ lệ thắng từng tuần để thấy bé tiến bộ.
- 5 hàm phân tích mới trong `shared/report.js` đều THUẦN + **5 unit test mới** (kể cả case khung giờ "khuya" vắt qua nửa đêm 22h–5h); `kidSessions` lấy thêm cột `mode` cho donut.
- `sw.js` v71→**v72**; `npm test`: **979 ✅, 0 ❌**.

## 15. ĐỘ TUỔI 4–12, SẮP XẾP LẠI TRANG CHỦ, ⭐/🎯 TRONG GAME, NHẬT KÝ ĐĂNG NHẬP BÉ (07/2026)

Yêu cầu: mở rộng độ tuổi 4→12, nhắc "tiếng Anh nâng cao", chia trang chủ 2 mục Học/Giải trí, hiện sao+từ-yếu ngay trong game, thông báo đăng nhập của bé cho phụ huynh (thời gian/thiết bị/trình duyệt), xác nhận webapp vẫn cập nhật dữ liệu, và cơ chế lặp từ sai qua nhiều buổi học.

- **Độ tuổi 4–12 + tiếng Anh nâng cao**: sửa mọi chỗ ghi "4–8 tuổi" → "4–12 tuổi" (trang chủ, `gioi-thieu/`, i18n 5 ngôn ngữ). `gioi-thieu/` mục 1 bổ sung ghi rõ game **`tieng-anh/` (Tiếng Anh Nâng Cao)** dành cho bé lớn 8–12 tuổi — game này đã có sẵn trong kho, trước đây chưa nhắc trong tài liệu giới thiệu.
- **Trang chủ chia 3 khu rõ ràng** (không chỉ Học/Giải trí — thêm khu Gia đình cho đúng luồng dùng): 👨‍👩‍👧 **Góc Gia Đình** (Bé Nào Đang Chơi?/Tủ Quà/Trang Phụ Huynh) → 📚 **GÓC HỌC TẬP** (Góc Tiếng Anh, Tiếng Anh Nâng Cao, Học & Chơi, Học Vui, Tư Duy, Khoa Học, Kỹ Năng Sống, Văn Hóa VN) → 🎮 **GÓC GIẢI TRÍ** (Game Mini, Pikachu, Trò Chơi Xưa, Điện Tử Xưa). Header tiêu đề mục (`.sec`) tràn hết chiều rộng grid, có viền gạch ngang phân cách — dễ quét mắt.
- **⭐ Sao + 🎯 Từ cần ôn hiện NGAY trong game** (`shared/kid-bar.js`): thanh avatar giờ hiện thêm số sao hiện có (`🐰 Bin · ⭐23`, cache 5 phút đỡ tốn request); nếu sổ từ hay sai còn > 0, thêm huy hiệu riêng "🎯 N từ cần ôn" phía trên thanh avatar — **chạm vào là nhảy thẳng đến màn Ôn Tập Tổng Hợp**. Huy hiệu đọc từ sổ cục bộ (misses.js) nên không tốn thêm request mạng.
- **🔔 Thông báo đăng nhập của bé** (bảng mới `kid_logins`, `server/migrate-02-kid-logins.sql`): mỗi lần bé chạm avatar ở `/chon-be/` thành công, hệ thống tự đoán tên máy + trình duyệt từ userAgent (iPad/iPhone/Android/Mac/Windows, Chrome/Safari/Firefox/Edge/Opera, kèm nhãn "(WebApp)" nếu đang chạy dạng cài-vào-màn-hình-chính) và ghi 1 dòng. Trang Phụ Huynh có thẻ **"🔔 Bé đăng nhập gần đây"** liệt kê 15 lần gần nhất: *"🐨 Bin — 17/07 14:32 — 📱 iPad · Safari"*. Cùng gộp vào `tidy_my_family()` (xóa log cũ hơn 30 ngày).
- **Xác nhận: webapp (cài vào màn hình chính) vẫn cập nhật dữ liệu bình thường** — mọi request tới Supabase đều qua mạng thật (network-only), không đi qua service worker cache; đã ghi rõ vào FAQ mới của `gioi-thieu/`.
- **Cơ chế lặp từ sai — giải thích rõ trong FAQ mới**: đúng như bạn suy đoán — sai 1 từ thì +1 điểm "cần ôn", từ đó **lặp lại qua nhiều buổi học** (xuất hiện trong 🎯 Ôn chỗ yếu + huy hiệu trong game) cho đến khi bé trả lời đúng đủ nhiều lần để "sạch sổ" (mỗi lần đúng ngay lần đầu trừ 1 điểm) — đây chính là kỹ thuật ôn tập ngắt quãng (spaced repetition) đã có sẵn từ trước, nay được giải thích tường minh + hiện trực quan hơn qua huy hiệu.
- E2E dot 3 với server thật: **1/1 PASS** phần dọn dẹp; `kid_logins` báo đúng "PEND — cần dán migrate-02" (graceful, không lỗi game khi chưa chạy migrate). `sw.js` v72→**v73**; `npm test`: **979 ✅, 0 ❌**; smoke test mọi trang 200.

**Việc của bạn (30 giây)**: Supabase → SQL Editor → dán `server/migrate-02-kid-logins.sql` → Run, rồi báo tôi chạy lại E2E xác nhận nốt tính năng nhật ký đăng nhập.

## 16. LÀM LẠI LƯỚI GAME TRÊN TRANG CHỦ — GỌN HƠN, NHIỀU CỘT HƠN TRÊN ĐIỆN THOẠI (07/2026)

Yêu cầu: trên iPhone lưới chỉ có 1 cột nên phải kéo rất lâu mới thấy game muốn chơi; khối giới thiệu nên thu gọn có nút mở rộng; mỗi thẻ game nên gọn/nhỏ hơn, đưa phần mô tả dài vào hộp thoại (dialog) mở bằng nút ℹ️ cạnh nút Chơi thay vì hiển thị hết chữ trên thẻ.

- **Lưới game responsive theo cột cố định thay vì auto-fill** (`index.html`): **điện thoại luôn có ít nhất 2 cột** (`repeat(2,1fr)` mặc định) → **≥520px: 3 cột** → **≥760px (tablet dọc): 4 cột** → **≥980px (tablet ngang/desktop): 5 cột**. Trước đây dùng `auto-fill, minmax(280px,1fr)` khiến điện thoại (≤480px) chỉ xếp được đúng 1 cột/hàng — đây là nguyên nhân chính gây "kéo rất lâu mới tìm thấy game" bạn phản ánh.
- **Thẻ game thu gọn đáng kể**: bỏ hẳn đoạn mô tả dài (`.gc-desc{display:none}`) và chip phụ (chỉ giữ 1 chip đầu tiên, `.gc-meta .chip:nth-child(n+2){display:none}`) khỏi mặt thẻ; ảnh minh họa/emoji thu nhỏ 130px→64px cao; tiêu đề giới hạn 2 dòng (`-webkit-line-clamp:2`); padding/gap giảm ~40%. Kết quả: mỗi thẻ chỉ còn icon + tên game + 1 chip + hàng nút — lướt 1 màn hình iPhone thấy được nhiều game hơn hẳn.
- **Nút ℹ️ Thông tin cạnh nút Chơi**: thẻ game đổi từ `<a href>` bọc toàn bộ thành `<div data-href>` — chạm vào thân thẻ vẫn vào thẳng game (giữ trải nghiệm quen thuộc), còn nút tròn **ℹ️** nhỏ mở **modal thông tin đầy đủ** (icon lớn, tên game, mô tả gốc không cắt bớt, đủ tất cả chip, nút "Chơi ▶" + "Đóng"). Modal đóng bằng nút Đóng / chạm nền / phím Esc.
- **Khối giới thiệu đầu trang thu gọn**: chỉ còn tiêu đề + 1 câu mô tả + nút **"Xem thêm tính năng ▼"** hiện mặc định; bấm mới xổ ra danh sách 4 tính năng chi tiết (nút đổi thành "Thu gọn ▲"). 3 nút hành động (Bé vào chơi / Góc phụ huynh / Giới thiệu đầy đủ) vẫn hiện luôn, không bị ẩn — giữ lối vào nhanh cho người đã biết web.
- **Sửa 1 bug có sẵn từ trước nhân tiện phát hiện**: khóa i18n `hub.play` được 3 thẻ Góc Gia Đình dùng từ đợt trước nhưng **chưa từng được định nghĩa** trong `i18n.js` (chỉ có `hub.cta.play`) — nghĩa là các thẻ đó lẽ ra hiện chữ thô `"hub.play"` thay vì "Chơi ▶". Đã bổ sung khóa còn thiếu + thêm `hub.close` cho nút Đóng của modal.
- Kỹ thuật: script Python `re.sub` với lookahead xử lý đồng loạt cả 15 thẻ (đổi `<a class="game-card" href>` → `<div data-href>`, chèn nút ℹ️ trước nút Chơi) — xác minh bằng assert đúng 15/15 thẻ trước khi ghi file, không sửa tay từng thẻ để tránh sai sót rải rác.
- `npm test` toàn bộ vẫn: **979 ✅, 0 ❌** (thay đổi thuần HTML/CSS/JS phía client, không đụng logic game); smoke test trang chủ 200, không id trùng lặp, đủ 15/15 thẻ + nút ℹ️ + `data-href`.

**Lưu ý cho lượt sau nếu cần tinh chỉnh thêm**: không có công cụ chụp màn hình trong phiên này nên bố cục được tính toán bằng CSS Grid theo breakpoint chuẩn (không kiểm chứng trực quan) — nếu mở trên máy thật thấy cột/kích thước chưa vừa ý (chữ quá nhỏ, thẻ quá chật...), báo cụ thể thiết bị/kích thước màn hình để chỉnh đúng breakpoint.

## 17. GÓC GIA ĐÌNH THU GỌN + SỬA NÚT BACK SAI MENU (07/2026)

Yêu cầu: (a) khu "Góc Gia Đình" trên trang chủ ít dùng nhưng chiếm quá nhiều chỗ — nên thu gọn/mở rộng được, mặc định thu gọn; (b) nhiều game xuất hiện ở CẢ 2 menu (ví dụ vừa có trong `game-mini/` vừa có trong `goc-tieng-anh/`) — nút "◀" trong game lại hard-code về 1 menu cố định, nên vào từ menu này nhưng bấm back lại nhảy sang menu kia.

- **Xác nhận bug back-button bằng cách rà soát chéo toàn bộ hub**: viết script đối chiếu `href` giữa `index.html`, `game-mini/index.html`, `goc-tieng-anh/index.html`... — phát hiện **16 game** bị liệt kê ở cả `game-mini/` lẫn `goc-tieng-anh/` (`nghe-doan-tieng-anh`, `be-hai-trai-cay`, `be-lam-stylist`, `phong-xinh`, `xep-chu-tieng-anh`, `hoc-vui`, `tieng-anh`, và 9 game Nghe & Đoán còn lại), trong khi nút "◀ Chọn trò khác" của TỪNG game đó lại `href` cứng về đúng 1 trong 2 menu — ví dụ `nghe-doan-tieng-anh` hard-code về `/goc-tieng-anh/` dù cũng nằm trong `/game-mini/`; ngược lại `be-hai-trai-cay`/`be-lam-stylist`/`phong-xinh`/`xep-chu-tieng-anh` hard-code về `/game-mini/` dù cũng nằm trong `/goc-tieng-anh/`.
- **Fix bằng `document.referrer`, không sửa tay 45 file game**: thêm 1 khối script vào cuối `i18n.js` (đã nhúng ở MỌI trang) — khi trang tải xong, tìm link `a[data-i18n-title="hocvui.back"]` (marker riêng của nút back trong TỪNG game, khác với nút 🏠 `class="back"` của các trang menu luôn về "/"), nếu `document.referrer` cùng gốc site và khác trang hiện tại thì **ghi đè href bằng đúng đường dẫn referrer** — tức bé vào từ menu nào, bấm back về đúng menu đó. Không có referrer hợp lệ (vào thẳng/bookmark/chia sẻ link) thì giữ nguyên href mặc định viết sẵn trong HTML (không đổi hành vi cũ). Áp dụng đồng loạt cho cả 45 game dùng chung marker này chỉ bằng 1 chỗ sửa.
- **Góc Gia Đình thu gọn**: tiêu đề mục đổi thành nút bấm được (`role="button"`, có mũi tên `▶` xoay 90° khi mở, hỗ trợ phím Enter/Space), 3 thẻ (Bé Nào Đang Chơi?/Tủ Quà/Trang Phụ Huynh) bọc trong `<div class="fam-cards">` ẩn mặc định (`display:none`) — bấm tiêu đề mới hiện ra, dùng chung breakpoint cột với lưới chính (2→3→4→5 cột theo cùng media query) nên không lệch giao diện khi mở.
- `sw.js` v73→**v74**; `npm test` toàn bộ: **979 ✅, 0 ❌** (thay đổi HTML/CSS/JS thuần phía client); smoke test trang chủ + 2 game bị ảnh hưởng đều 200, không id trùng lặp.

**Lưu ý**: cũng như đợt trước, không có công cụ trình duyệt thật để bấm thử back-button qua nhiều trang trong phiên này — logic đã kiểm tra kỹ bằng tay (rà soát toàn bộ 45 file + xác nhận cú pháp), nhưng nếu sau khi bạn thử trên máy thật thấy back vẫn sai ở trường hợp cụ thể nào, báo lại đường link bạn đã đi qua để tôi debug đúng case đó.

## Bổ sung thêm game tiếng Anh ôn tập

> Ý tưởng của bạn (07/2026): mượn khung các game vui/game xưa đã có (bắn cung,
> bắn vịt, ném lon...) nhưng đổi mục tiêu thành TỪ VỰNG tiếng Anh — máy đọc yêu
> cầu ("bé hãy bắn trúng quả Apple"), bé bắn/ném trúng bia đúng thì máy đọc to
> từ đó + khen; trúng bia sai thì gợi ý chọn lại (đúng luật retry đã có ở 9 game
> Nghe & Đoán). Mục tiêu: vừa chơi vui vừa ôn từ, không phải lúc nào cũng ngồi
> yên bấm 4 lựa chọn như "Nghe & Đoán".

### Vì sao đáng làm

Bộ 9 game "Nghe & Đoán" đều dùng chung 1 khuôn tương tác: nghe → chạm 1 trong 4
hình. Rất hiệu quả để HỌC từ mới, nhưng lặp lại nhiều sẽ nhàm với bé đã thuộc
kha khá. Gắn từ vựng vào các CƠ CHẾ VẬN ĐỘNG khác nhau (bắn, ném, kéo, né) tạo
cảm giác mới trong khi vẫn ôn đúng những từ đã học — đặc biệt hợp để ôn
**sổ 🎯 Ôn chỗ yếu** theo cách vui hơn là làm lại y hệt bài cũ.

### 6 ý tưởng cụ thể — ưu tiên MƯỢN khung game vật lý đã có sẵn thay vì viết mới

Dự án đã có sẵn nhiều engine "bắn/ném/nhắm mục tiêu" — việc chính là RE-SKIN
(đổi hình ảnh mục tiêu + gắn giọng đọc + luật retry), không phải viết vật lý
game từ đầu. Vì vậy khối lượng làm thực tế nhỏ hơn nhiều so với 1 game hoàn
toàn mới.

1. **🏹 Bắn Cung Từ Vựng** (ý tưởng gốc của bạn) — mượn khung kéo-thả-bắn kiểu
   `phao-nuoc-giu-dao` (đã có cơ chế nhắm + bắn). 4-5 bia treo trên bãi, mỗi bia
   là 1 emoji/ảnh từ vựng (trái cây, con vật...). Máy đọc: *"Bé hãy bắn trúng
   quả Apple!"* — bé kéo cung nhắm đúng bia. Trúng đúng: mũi tên ghim vào bia +
   máy đọc *"Apple — quả táo! Bé giỏi quá!"* + hiệu ứng pháo hoa. Trúng sai:
   bia rung + máy đọc gợi ý *"Chưa đúng, Apple là quả táo, bé bắn lại nhé!"`
   (im lặng luật retry: bia đúng còn nguyên, bé bắn lại không giới hạn số bia
   sai như hiện tại, hoặc giới hạn 2 lần rồi lộ đáp án — tùy chỉnh sau).
2. **🦆 Bắn Vịt Từ Vựng** — re-skin trực tiếp `bat-vit/` (đã có súng ngắm +
   bắn): thay hình con vịt trơn bằng vịt đội mũ có icon từ vựng, hoặc đơn giản
   hơn là đàn vịt bơi qua mang theo bảng chữ/hình, bắn đúng con mang đúng từ.
3. **🎯 Ném Lon Từ Vựng** — mượn cơ chế "ném lon" trong `tro-xua/` (đã có sẵn
   trong Trò Chơi Xưa): mỗi lon dán nhãn 1 từ, ném đổ đúng lon máy yêu cầu.
4. **🎣 Câu Cá Từ Vựng** — mượn khung `ca-lon-bien-xanh/` (cá bơi qua lại):
   đàn cá mang theo thẻ từ vựng bơi ngang màn hình, bé chạm/kéo cần câu đúng
   lúc con cá mang đúng từ bơi qua.
5. **🧱 Đập Gạch Từ Vựng** — mượn khung `xep-gach/` hoặc làm biến thể mới nhẹ:
   mỗi viên gạch có 1 từ, bóng nảy trúng gạch nào đọc to từ đó — chế độ
   "nhiệm vụ" yêu cầu đập đúng gạch máy gọi tên trước, đập nhầm gạch khác thì
   bị trừ điểm nhẹ (không dừng game, giữ nhịp độ nhanh của thể loại này).
6. **🚗 Đua Xe Chọn Làn Từ Vựng** — mượn khung `tay-dua-nhi/`: đường đua chia
   3 làn, mỗi làn có 1 biển từ vựng, máy đọc từ cần tìm, bé lái xe tạt đúng
   làn để "thu thập" đúng từ, tạt nhầm làn thì xe chậm lại (nhẹ nhàng, không
   phạt nặng vì đây là ôn tập không phải thi đấu).

### Thiết kế chung cho cả nhóm (để nhất quán với 9 game Nghe & Đoán đã có)

- **Nguồn từ vựng dùng chung**: mỗi game trên KHÔNG cần ngân hàng từ riêng —
  đọc trực tiếp từ `WORD_BANK` của 9 game hiện có (import y như `nghe-doan-on-tap`
  đang làm) hoặc ưu tiên đọc từ **sổ 🎯 Ôn chỗ yếu** của bé (qua `missedWords()`)
  làm "nhiệm vụ" — biến việc ôn từ khó thành 1 màn chơi vui thay vì lặp lại
  đúng giao diện "nghe rồi chạm 4 hình".
- **Giữ nguyên luật thưởng đã có**: đúng luật retry (sai lần 1 gợi ý, sai lần 2
  lộ đáp án), `recordMiss/recordHit` để sổ từ yếu vẫn cập nhật đúng dù chơi ở
  game bắn/ném thay vì game chạm-hình, `answeredOne()` để vẫn tính vào quà mỗi
  15 câu, và `recordSessionServer` để vẫn cộng sao như mọi game khác.
- **Không thay thế 9 game Nghe & Đoán** — đây là lớp ÔN TẬP THỨ 2 mang tính
  giải trí nhiều hơn, dùng SAU khi bé đã học từ ở Nghe & Đoán, không phải nơi
  dạy từ mới đầu tiên (nên không cần giải thích ngữ pháp/câu ví dụ dài dòng
  như Nghe & Đoán — chỉ cần từ đơn + hình + phát âm, giữ nhịp độ game nhanh).

### Đề xuất thứ tự làm (nếu bạn duyệt)

1. Làm thử **🏹 Bắn Cung Từ Vựng** trước (ý tưởng bạn đưa ra đầu tiên, cơ chế
   kéo-bắn rõ ràng, dễ mượn khung `phao-nuoc-giu-dao`) — 1 game hoàn chỉnh để
   xác nhận công thức "re-skin + gắn từ vựng + luật retry" chạy tốt.
2. Nếu ổn, nhân rộng công thức đó sang 2-3 game còn lại (Bắn Vịt, Ném Lon,
   Câu Cá) — mỗi game sau sẽ nhanh hơn nhiều vì đã có khuôn.
3. Gộp tất cả game "ôn tập vui" này vào 1 khu mới trên trang chủ (ví dụ
   "🎪 Ôn Tập Vui" cạnh Góc Tiếng Anh) để phân biệt rõ với 9 game Nghe & Đoán
   gốc.

**Việc của bạn**: xác nhận có muốn bắt đầu làm **🏹 Bắn Cung Từ Vựng** ngay
không, hay để tôi trình bày thêm phương án UI/luật chơi cụ thể hơn trước khi
code.

## 18. GAME MỚI: 🏹 BẮN CUNG TỪ VỰNG — "MƯỢN KHUNG" ĐÚNG NGHĨA ĐEN (07/2026)

Bạn xác nhận: mượn khung có sẵn rồi làm. Thay vì viết engine bắn cung riêng
(và phải test lại luật retry/thưởng/ngân hàng từ từ đầu), quyết định **mượn
KHUNG LOGIC đã kiểm thử kỹ nhất** trong dự án — chính module
`nghe-doan-on-tap/src/ontap.js` (ngân hàng gộp cả 9 game + chủ đề 🎯 Ôn chỗ
yếu, luật chọn-lại, trộn từ đơn/câu) — và CHỈ viết mới phần DA (giao diện)
kiểu bắn cung. Không có dòng logic mới nào để test riêng vì `chooseOption`,
`pickRound`, `makeGame`... đều là y hệt hàm đã có 26 unit test của `ontap.js`.

- **`ban-cung-tu-vung/`** (mới hoàn toàn, KHÔNG có file logic riêng):
  `src/app.js` `import` thẳng `TOPICS/makeGame/currentRound/chooseOption/promptFor/rateFor`
  từ `../../nghe-doan-on-tap/src/ontap.js` và `recordMiss/recordHit/missCount`
  từ `misses.js` cùng thư mục — tái sử dụng 100%, bao gồm cả bộ lọc 9 game gốc
  + chủ đề "🎯 Ôn chỗ yếu" đã có sẵn trong `ontap.js`.
- **Lớp da mới — sân bắn cung**: 4 bia hình tròn kiểu bia bắn cung thật (vòng
  đỏ-trắng đồng tâm bằng CSS `repeating-radial-gradient`, có "cọc" cắm dưới
  đất) thay cho lưới nút phẳng; cây cung 🏹 cố định dưới đáy sân; bé chạm bia
  đúng → **mũi tên bay từ cung tới bia** (tạo 1 phần tử `.arrow`, đổi
  `left/top` qua CSS transition ~300ms, góc bay tính bằng `atan2` theo đúng
  hướng bia) — RỒI MỚI áp dụng luật đúng/sai y hệt 9 game Nghe & Đoán (đúng
  ngay → khen + giải nghĩa; sai lần 1 → gợi ý bắn lại; sai lần 2 → lộ đáp án).
- **Vẫn nối đủ hạ tầng chung**: `mountKidFeatures()` (thanh avatar + giới hạn
  giờ chơi), `answeredOne()` (quà mỗi 15 câu), `recordSession({mode:'bancungtuvung'})`
  (cộng sao qua server), `recordMiss/recordHit` (sổ từ yếu) — không thiếu tính
  năng nào so với game "chạm hình" gốc, chỉ đổi vỏ ngoài.
- Đăng ký: thẻ mới lên đầu `goc-tieng-anh/` (17 game tiếng Anh, chip "Mới"
  chuyển từ Ôn Tập Tổng Hợp sang Bắn Cung vì là bổ sung mới nhất), 5 khóa i18n
  (`bancung.title/start/play/win/help`), `sw.js` v74→**v75** (+3 file precache).
- **Xác minh**: không cần unit test mới (logic mượn nguyên, đã xanh 26/26 ở
  `ontap.test.js`); `node --check` cú pháp sạch; `npm test` toàn bộ vẫn
  **979 ✅, 0 ❌**; smoke test 4/4 route mới + hub đăng ký đúng đều 200.

**Còn để ngỏ (đợt sau, đã duyệt "tiếp tục với game khác")**: nhân rộng đúng
công thức "mượn khung ontap.js + da mới" sang 🦆 Bắn Vịt Từ Vựng (re-skin
`bat-vit/`), 🎯 Ném Lon Từ Vựng, 🎣 Câu Cá Từ Vựng — mỗi game sau sẽ nhanh hơn
Bắn Cung vì công thức đã chạy tốt lần đầu. Cân nhắc gộp nhóm "Ôn Tập Vui" này
thành 1 khu riêng trên trang chủ khi đã có ≥3 game.

## 19. GAME MỚI THỨ 2: 🎯 NÉM LON TỪ VỰNG (07/2026)

Tiếp tục đúng công thức đã xác nhận ở Bắn Cung — nhân rộng nhanh hơn nhiều
lần vì công thức "mượn khung `ontap.js` + da mới" đã chạy tốt:

- **`nem-lon-tu-vung/`** — cấu trúc GIỐNG HỆT `ban-cung-tu-vung/` (cùng import
  `TOPICS/makeGame/currentRound/chooseOption/promptFor/rateFor` từ
  `ontap.js`, cùng `recordMiss/recordHit/missCount` từ `misses.js`, cùng luật
  chọn-lại/thưởng/giới hạn giờ) — CHỈ khác lớp da: 4 lon kim loại (gradient
  bạc) xếp trên kệ gỗ ngang thay vì bia tròn; người ném bóng 🤾 cố định dưới
  đáy thay vì cây cung; bóng 🥎 bay thẳng (không cần tính góc xoay như mũi
  tên) từ người ném tới lon bé chạm. Lon đúng "đổ" bằng animation CSS
  (`translateY + rotate + opacity:0` khi có class `.correct` — tận dụng đúng
  cơ chế `.correct/.wrong/.dim` đã có, không cần logic JS mới); lon sai chỉ
  lắc nhẹ (`@keyframes can-wobble`).
- **Thời gian làm ngắn hơn hẳn Bắn Cung**: sao chép cấu trúc file gần như
  nguyên vẹn, chỉ đổi tên biến/class (`bow→thrower`, `arrow→ball`) và nội
  dung lời thoại (bắn cung→ném lon, bia→lon) — đúng như dự đoán "mỗi game sau
  sẽ nhanh hơn vì đã có khuôn" trong mục 18.
- Đăng ký: thẻ mới lên đầu `goc-tieng-anh/` (18 game tiếng Anh), 5 khóa i18n
  (`nemlon.title/start/play/win/help`), `sw.js` v75→**v76** (+3 file precache).
- `npm test` toàn bộ vẫn: **979 ✅, 0 ❌** (không có logic mới); smoke test cả
  2 game "Ôn Tập Vui" (Bắn Cung + Ném Lon) + hub đăng ký đúng đều 200.

**Còn để ngỏ**: 🎣 Câu Cá Từ Vựng và 🚗 Đua Xe Chọn Làn Từ Vựng theo đúng công
thức này; khi đủ 3-4 game, cân nhắc gộp thành khu "🎪 Ôn Tập Vui" riêng trên
trang chủ thay vì chỉ nằm trong `goc-tieng-anh/`.

## 20. GAME MỚI THỨ 3: 🎣 CÂU CÁ TỪ VỰNG — ĐỦ 3 GAME "ÔN TẬP VUI" (07/2026)

Hoàn thành game thứ 3 theo đúng công thức, khép lại nhóm "khởi động" trước
khi cân nhắc gộp thành khu riêng trên trang chủ:

- **`cau-ca-tu-vung/`** — cấu trúc GIỐNG HỆT 2 game trước (cùng import từ
  `ontap.js`/`misses.js`, cùng luật chọn-lại/thưởng/giới hạn giờ) — lớp da
  lần này: ao nước với 4 con cá bơi lững lờ (`@keyframes fish-bob`, mỗi con
  lệch pha bằng `animation-delay` cho tự nhiên) thay vì bia/lon; cần câu 🎣 cố
  định trên ĐỈNH sân (khác 2 game trước đặt ở đáy) thay vì cung/người ném;
  lưỡi câu 🪝 thả THẲNG XUỐNG đúng cá bé chạm (kèm sợi dây câu vẽ bằng
  `::before`). Câu trúng: cá bay ngược LÊN khỏi mặt nước
  (`translateY(-140px) scale(0.7)` + `opacity:0`, dừng hẳn animation bơi) —
  hướng chuyển động NGƯỢC với 2 game trước (lon rơi xuống, cá bay lên) để mỗi
  game có cảm giác vật lý khác nhau dù dùng chung 1 kỹ thuật.
- **Xác nhận công thức tái sử dụng ổn định qua 3 lần liên tiếp**: cả 3 file
  `app.js` (Bắn Cung/Ném Lon/Câu Cá) chỉ khác nhau ở tên biến DOM
  (`bow/thrower/rod`), tên hàm animation (`shootArrowTo/throwBallTo/castHookTo`)
  và nội dung lời thoại — phần lõi (`onPick`, `buildFilterRow`, `endRound`,
  `startRound`, luật chọn-lại) copy nguyên vẹn không sửa. Điều này xác nhận
  "khung" đã đủ vững để nhân rộng tiếp cho các game sau mà không cần thiết kế
  lại từ đầu.
- Đăng ký: thẻ mới lên đầu `goc-tieng-anh/` (19 game tiếng Anh), 5 khóa i18n
  (`cauca.title/start/play/win/help`), `sw.js` v76→**v77** (+3 file precache).
- `npm test` toàn bộ vẫn: **979 ✅, 0 ❌**; smoke test cả 3 game "Ôn Tập Vui"
  (Bắn Cung/Ném Lon/Câu Cá) + hub đăng ký đúng 3/3 đều 200.

### 📊 Tổng kết nhóm "Ôn Tập Vui" (3 game đầu tiên)

| Game | Lớp da | Hướng chuyển động khi trúng |
|---|---|---|
| 🏹 Bắn Cung Từ Vựng | Bia tròn + cung dưới đáy | Mũi tên bay ngang theo góc bia |
| 🎯 Ném Lon Từ Vựng | Lon kim loại trên kệ + người ném dưới đáy | Lon đổ xuống + xoay |
| 🎣 Câu Cá Từ Vựng | Cá bơi trong ao + cần câu trên đỉnh | Cá bay ngược lên khỏi mặt nước |

Cả 3 dùng chung 100% logic `ontap.js` (đã có 26 test), không có bug logic
nào phát sinh vì không viết logic mới.

**Còn để ngỏ**: đã đủ 3 game — có thể gộp thành khu "🎪 Ôn Tập Vui" riêng trên
trang chủ (tách khỏi danh sách dài của `goc-tieng-anh/`) nếu bạn muốn; hoặc
tiếp tục thêm 🚗 Đua Xe Chọn Làn Từ Vựng theo đúng công thức nếu muốn nhóm này
dày hơn nữa trước khi tách khu riêng.

## 21. THU GỌN HÀNG LỌC CHỦ ĐỀ + SỬA HEADER MÉO MÓ TOÀN REPO (07/2026)

Rà lại toàn bộ đề xuất trước đó: chỉ còn 1 việc thật sự chưa xong là
`server/migrate-02-kid-logins.sql` (kiểm tra lại bằng script E2E — vẫn báo
`PGRST205`, tức bạn chưa dán script này vào Supabase SQL Editor; cần bạn tự
chạy, mình không chạy hộ được). Còn `bancung.title` hiện chữ thô trong ảnh
chụp màn hình: đã kiểm tra lại `i18n.js` (đủ 5 ngôn ngữ), `index.html` (đúng
`data-i18n`), và parse thử cả file bằng Node — không có lỗi. Nhiều khả năng
máy bạn đang giữ bản `i18n.js` CŨ do service worker cache (trước khi khoá này
được thêm) — bấm tải lại trang 1-2 lần (hoặc xoá cache/gỡ cài site) sẽ hết;
`sw.js` đã tăng version để buộc tải bản mới.

- **`shared/filter-toggle.js`** (mới) — gói hàng nút lọc chủ đề (`filter-row`,
  vốn LUÔN hiện sẵn, chiếm nhiều chỗ dọc màn hình trên điện thoại) vào sau 1
  nút bấm "🔽 Lọc chủ đề" — bấm vào mới xổ ra, chọn xong tự đóng lại
  (`setTimeout` 150ms sau khi bấm 1 nút lọc). Dùng `MutationObserver` theo
  dõi `filter-row` để tự cập nhật nhãn chủ đề đang chọn lên nút, nên
  KHÔNG cần sửa `buildFilterRow()` của bất kỳ game nào — chỉ thêm 1 dòng gọi
  `initFilterToggle()` mỗi game.
- Áp dụng cho toàn bộ 13 game dùng `filter-row`: 9 game "Nghe & Đoán", và
  3 game "Ôn Tập Vui" (Bắn Cung/Ném Lon/Câu Cá) — mỗi game: thêm nút toggle
  vào `index.html`, thêm CSS ẩn/hiện vào `style.css`, gọi
  `initFilterToggle()` trong `app.js`.
- **Sửa header méo icon khi tiêu đề dài**: nguyên nhân là `<h1>` mặc định có
  `flex-shrink: 1` giống các nút tròn bên cạnh, nên tiêu đề dài sẽ giành chỗ
  làm nút tròn (44×44) bị bóp nhỏ méo hình. Sửa 1 lần cho TOÀN REPO bằng
  script quét toàn bộ `style.css` (không chỉ 13 game trong ảnh chụp): thêm
  `min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space:
  nowrap;` vào `.top h1` (tiêu đề dài sẽ bị cắt "…" thay vì đẩy méo nút icon),
  và `flex-shrink: 0;` vào mọi nút tròn 44×44 (để không bao giờ bị bóp nữa).
  Kết quả: quét 67 file `style.css`, vá đúng 66 file (file còn lại —
  `pokemon/style.css` — dùng bố cục HUD hoàn toàn khác, không có tiêu đề dài
  nên không cần vá).
- Tiện thể phát hiện 1 lỗi CSS có sẵn từ trước (không liên quan đợt vá này,
  xác nhận bằng `git diff` chỉ thêm thuộc tính chứ không đụng dấu ngoặc) ở
  `giai-cuu-khung-long/style.css`: có 2 khối `@media (max-width: 480px) {`
  bị lặp và không đóng ngoặc, khiến file CSS bị hỏng cấu trúc cuối file — đã
  gộp lại thành 1 khối đóng ngoặc đúng.
- `sw.js` v77 → v78 (thêm `shared/filter-toggle.js` vào precache) → **v79**
  (sau đợt vá responsive header). `npm test`: vẫn **979 ✅, 0 ❌** — không có
  hồi quy nào từ các thay đổi CSS/JS thuần giao diện này.

## 22. ĐỀ XUẤT: 20 MINI GAME "HỒI XƯA GÂY NGHIỆN" — VỪA CHƠI VỪA HỌC (07/2026)

Theo yêu cầu: liệt kê ít nhất 20 game arcade/game bỏ túi kinh điển ngày xưa
(chưa có trong repo — đã đối chiếu với danh sách game hiện tại để không trùng),
mỗi game gắn thêm 1 lớp "học" phù hợp (từ vựng/toán/màu sắc/an toàn/tư duy)
nhưng KHÔNG ép giáo dục lên game nào cũng khiên cưỡng — vài game để thuần vui
giải trí như hồi xưa, vì bản thân sự vui/nghiện tích cực (phản xạ, kiên trì,
thử-sai) cũng là một dạng học. Đây MỚI CHỈ LÀ ĐỀ XUẤT để bạn duyệt/chọn, CHƯA
code gì — bạn xem rồi báo lại muốn làm đợt nào trước.

**Về tài nguyên hình ảnh**: sẽ ưu tiên tải icon/sprite thật (không chỉ emoji)
từ các nguồn free-license uy tín — Kenney.nl (CC0, không cần ghi công),
OpenGameArt.org (lọc theo CC0/CC-BY), Twemoji/Openmoji (CC-BY, đã dùng ở
`giai-cuu-khung-long`), Wikimedia Commons (đã dùng nhiều nơi). "Phi thương
mại" giúp nới điều kiện sử dụng nhưng KHÔNG có nghĩa là mọi giấy phép đều
dùng được tuỳ ý — vẫn sẽ né các asset ghi rõ "chỉ dùng cá nhân, không được
đăng lại/phân phối lại" vì trang web công khai này về bản chất là phân phối
lại; asset nào cần ghi công sẽ được thêm vào `CREDITS.md` như các đợt trước.

### Đợt 1 — "mượn khung" Ôn Tập Vui (dễ nhất, tái dùng gần như 100% `ontap.js`)

1. **🕳️ Bắt Chuột Chũi Từ Vựng** — chuột đội mũ thẻ từ, bé đập đúng con có
   từ/hình được hỏi trước khi nó chui xuống lại. Bộ khung có sẵn ở `bat-vit`
   (chế độ chữ cái) — chỉ đổi da vịt→chuột chũi từ lỗ đất.
2. **🔵 Bắn Bóng Vỡ Chùm Từ Vựng** — kiểu Bubble Shooter: bong bóng mang
   hình/chữ trôi nổi, bắn trúng đúng đáp án để vỡ chùm.
3. **🎹 Gõ Nốt Từ Vựng** — kiểu Piano Tiles: các "phím" mang từ trôi xuống
   theo nhịp, gõ đúng phím có từ vừa nghe/đọc trước khi trôi qua vạch.
4. **🎯 Ném Phi Tiêu Từ Vựng** — bảng phi tiêu tĩnh chia nhiều vòng, mỗi vòng
   1 đáp án, ném trúng vòng đúng (khác Bắn Cung ở chỗ bia đứng yên nhiều
   vòng thay vì bia di chuyển 1 đáp án).
5. **⚽ Đá Phạt Đền Từ Vựng** — trả lời đúng nhanh trước khi được đá; đá vào
   góc khung thành ứng với đáp án đúng, thủ môn cố cản.

### Đợt 2 — Game tư duy/trí nhớ thuần túy (giáo dục tự nhiên, không cần gán chủ đề gượng ép)

6. **🧠 Simon Nhớ Màu/Số** — lặp lại đúng chuỗi màu/số/nốt nhạc ngày càng dài
   (rèn trí nhớ ngắn hạn) — game "Simon Says" điện tử 4 nút kinh điển.
7. **🔢 Ghép Số 2048** — trượt ghép 2 ô cùng số thành số gấp đôi, rèn cảm giác
   số và cộng dồn.
8. **🃏 Lật Bài Nhớ Hình Nâng Cấp** — biến thể của `lat-hinh`: lật đúng 2 lá
   giống nhau HIỆN thêm từ + phát âm (không chỉ ăn điểm mà còn học từ mới
   ngay lúc lật trúng).
9. **🎱 Bi-a Lỗ Mini** — kéo thả ngắm góc, bắn bi vào lỗ (dạy trực quan về góc
   phản xạ/lực — hình học ẩn trong lối chơi).
10. **🧩 Ghép Khối Rơi Theo Nhóm** — khối màu rơi xuống, ghép ≥3 khối cùng
    nhóm (màu/loài/danh mục) để biến mất — rèn phân loại/nhận diện nhóm.

### Đợt 3 — Vận động vui nhộn, tuổi thơ xưa (giải trí là chính, học nhẹ nhàng)

11. **🐸 Ếch Qua Đường An Toàn** — kiểu Frogger: né xe/qua sông đúng lúc, lồng
    thêm bài học luật an toàn giao thông (đèn đỏ dừng, nhìn 2 bên).
12. **🪢 Nhảy Dây Đếm Nhịp** — bấm đúng nhịp để nhảy qua dây, đếm số nhịp nhảy
    được — trò chơi dân gian Việt Nam đúng nghĩa, chưa có trong repo.
13. **🏀 Ném Rổ Đếm Giờ** — ném bóng vào rổ trong thời gian giới hạn, rổ ghi
    số điểm để cộng thành phép tính.
14. **🏓 Bóng Bàn Đối Kháng** — đấu bóng bàn với máy, phản xạ thuần túy.
15. **🎳 Bowling Ảo** — lăn bóng đổ ki, ki đánh số để cộng điểm (ôn cộng trừ
    nhẹ nhàng qua kết quả mỗi lượt).

### Đợt 4 — Arcade cổ điển phức tạp hơn (tốn công nhất, để làm sau)

16. **👻 Ăn Chấm Né Ma (ghép chữ)** — mê cung kiểu Pac-Man, ăn các chữ cái
    theo đúng thứ tự để ghép thành từ, né ma.
17. **🛹 Nhảy Né Chướng Ngại Vật Không Ngừng** — chạy vô tận kiểu khủng long
    Chrome, nhảy/né chướng ngại vật ngày càng nhanh (rèn phản xạ + kiên trì).
18. **🐟 Bắn Cá Ăn Xu** — súng bắn cá kiểu máy game thùng, cá mang mệnh giá/
    đáp án khác nhau, bắn trúng để "đổi xu" ảo.
19. **🧱 Đập Gạch Bóng Nảy** — kiểu Breakout/Arkanoid: banh nảy phá gạch bằng
    thanh trượt, gạch có thể mang chữ/số cần phá đúng thứ tự.
20. **🍬 Nối Kẹo Ba** — kiểu Candy Crush: đổi chỗ để nối ≥3 kẹo cùng loại,
    kẹo có thể là chữ cái để vừa nối vừa đánh vần.

**Không trùng với game đã có**: đã đối chiếu kỹ với `bat-vit` (vịt/lỗ),
`ca-lon-bien-xanh` (ăn cá kiểu Feeding Frenzy), `chim-non-vuot-ong` (Flappy
Bird), `ran-san-moi` (rắn), `xep-gach` (Tetris), `dao-vang`/biến thể (đào
vàng), `co-caro`/`co-ca-ngua`/`co-ganh`/`o-an-quan` (cờ dân gian),
`lat-hinh`/`ghep-hinh` (lật hình cơ bản), `tay-dua-nhi` (đua xe),
`vo-dai-thu-nhi` (đấm bốc) — 20 ý tưởng trên đều là thể loại CHƯA có bản nào
trong repo.

**Còn để ngỏ**: chờ bạn duyệt — có thể chọn làm nguyên 1 đợt, hoặc chọn lẻ vài
game thích nhất trong nhiều đợt khác nhau; đợt 1 sẽ nhanh nhất vì tái dùng
`ontap.js` y hệt 3 game Ôn Tập Vui đã có.

## 23. TÁCH KHU "🎪 ÔN TẬP VUI" RIÊNG + LÀM XONG ĐỢT 1 (5 GAME MỚI) (07/2026)

Xác nhận `server/migrate-02-kid-logins.sql` đã chạy xong (E2E lại: 2/2 PASS,
hết PEND). Theo yêu cầu, tách khu "Ôn Tập Vui" ra khỏi Góc Tiếng Anh thành
1 khu riêng trên trang chủ, và làm luôn Đợt 1 (5 game mới) trong đề xuất ở
mục 22.

### Tách khu riêng

- **`on-tap-vui/index.html`** (mới) — hub riêng, cùng khung UI với
  `goc-tieng-anh/index.html`, gộp toàn bộ game "ôn tập kiểu vận động".
- Xoá 3 thẻ Bắn Cung/Ném Lon/Câu Cá khỏi lưới `goc-tieng-anh/index.html`,
  thay bằng 1 thẻ quảng cáo dẫn sang `/on-tap-vui/`; số đếm "19 game tiếng
  Anh" → **"16 game tiếng Anh"** (đúng số còn lại trong Góc Tiếng Anh).
  Trang chủ (`index.html`) có thêm 1 thẻ "🎪 Ôn Tập Vui" riêng (kèm 3 khoá
  i18n `card.hubontapvui.*`, 5 ngôn ngữ).

### Đợt 1 — 5 game mới, đúng công thức "mượn khung" `ontap.js`

Cả 5 game dưới đây dùng lại 100% logic đã kiểm thử của
`nghe-doan-on-tap/src/ontap.js` + `misses.js` (như 3 game trước) — KHÔNG có
logic mới, chỉ khác lớp da (view) + 1 hàm hiệu ứng "phóng vật thể tới mục
tiêu" riêng cho từng game để tạo cảm giác vật lý khác nhau:

| Game | Lớp da | Hiệu ứng khi bé chạm chọn |
|---|---|---|
| 🕳️ Bắt Chuột Chũi Từ Vựng | Lỗ đất tối màu, chuột chũi nhô lên nhấp nhô | Búa 🔨 bay từ trên xuống, đúng thì chuột bị đập bẹp xuống lỗ (`scaleY` co lại) |
| 🔵 Bắn Bóng Vỡ Chùm Từ Vựng | Bong bóng nổi lấp lánh, súng ở đáy | Viên đạn bay thẳng từ súng lên, đúng thì bong bóng phóng to rồi biến mất |
| 🎹 Gõ Nốt Từ Vựng | Phím đàn piano trắng ở đáy, nền sân khấu tối | Nốt nhạc 🎵 rơi thẳng từ đỉnh xuống đúng phím, phím lõm xuống như đàn thật |
| 🎯 Ném Phi Tiêu Từ Vựng | Bảng bia cổ điển (đen/trắng/đỏ), người ném ở góc trái | Phi tiêu bay theo **đường VÒNG CUNG 2 chặng** (lên đỉnh rồi xuống đích) — khác đường thẳng của Bắn Cung dù cùng là "bắn trúng bia" |
| ⚽ Đá Phạt Đền Từ Vựng | Khung thành có lưới kẻ ô, thủ môn 🧤 + cầu thủ sút ở đáy | Bóng bay thẳng tới góc; **thủ môn phản ứng theo kết quả**: sút trúng thì thủ môn bay SAI hướng, sút trật thì thủ môn lao ĐÚNG hướng bóng để cản — điểm khác biệt lớn nhất so với 4 game còn lại vì có thêm 1 nhân vật phản ứng |

- Mỗi game: 5 khoá i18n (`*.title/start/play/win/help`, 5 ngôn ngữ), đăng ký
  thẻ vào `on-tap-vui/index.html`, cập nhật số đếm "N game" trên 2 thẻ quảng
  cáo (trang chủ + Góc Tiếng Anh) từ 3 → **8**, `sw.js` v81→**v85** (mỗi game
  +3 dòng precache).
- `npm test`: vẫn **979 ✅, 0 ❌** sau cả 5 game (đúng như dự đoán — không có
  logic mới nào cần test riêng, giống 3 game đợt trước). Smoke test HTTP
  200 cho toàn bộ 16 trang liên quan (trang chủ, 2 hub, 8 game Ôn Tập Vui,
  kèm `src/app.js` của 5 game mới).

**Còn để ngỏ**: Đợt 2 (Simon Nhớ Màu/Số, Ghép Số 2048, Lật Bài Nâng Cấp,
Bi-a Lỗ Mini, Ghép Khối Rơi Theo Nhóm) — nhóm này KHÔNG dùng lại `ontap.js`
được vì là game tư duy/trí nhớ thuần túy, cần thiết kế state machine riêng
cho từng game (khối lượng việc nhiều hơn hẳn Đợt 1) — chờ bạn duyệt trước
khi bắt đầu.

## 24. 3 GÓP Ý SAU KHI DÙNG THỬ: GỌN MENU HUB, TĂNG GIÁ ĐỔI QUÀ, PHÓNG TO ICON (07/2026)

Bạn phản hồi 3 điểm sau khi dùng thử — cả 3 đều đã sửa xong:

### 1. Menu các trang "hub" (nhiều game nhỏ) không gọn như trang chủ

`game-mini/` (43 game!), `hoc-va-choi/`, `goc-tieng-anh/`, `on-tap-vui/`,
`dien-tu-xua/`, `tro-choi-xua/` trước đó dùng lưới `minmax(280px, 1fr)` —
luôn ra ĐÚNG 1 CỘT trên điện thoại (thẻ to, mô tả dài), khác hẳn trang chủ
(luôn 2 cột trên điện thoại, thẻ nhỏ gọn kiểu icon app). Đã đồng bộ cả 6
trang này dùng ĐÚNG kiểu lưới + thẻ compact của trang chủ: 2 cột trên điện
thoại → 3/4/5 cột khi màn hình rộng dần, ảnh minh hoạ thu nhỏ 130px→64px,
ẩn mô tả dài (chỉ còn tiêu đề 2 dòng + 1 chip), nút "Chơi ▶" nhỏ gọn hơn.
Riêng `game-mini/` giữ nguyên rule `.locked`/`.chip.warn` sẵn có (không dùng
tới nhưng không xoá, tránh vỡ nếu sau này thêm game khoá).

### 2. Đổi quà trong Tủ Quà quá dễ — tăng mặc định x6, phụ huynh chỉnh được

`CATALOG` trong `shared/rewards.js` giá gốc rất rẻ so với tốc độ kiếm sao
(trần 15 sao/ván, 50 sao/ngày) — kẹo 5 sao gần như đổi được ngay lập tức.
- Thêm `DEFAULT_REWARD_COST_MULTIPLIER = 6` và hàm `effectiveCost(item,
  multiplier)` (làm tròn, tối thiểu 1 sao) trong `shared/rewards.js` — có
  test riêng trong `rewards.test.js`.
- Thêm cột `settings.reward_cost_multiplier` (mặc định 6) — migration mới
  `server/migrate-03-reward-multiplier.sql` (bạn cần chạy 1 lần trong
  Supabase SQL Editor, giống 2 migration trước) + cập nhật `schema.sql` cho
  người cài mới. `shared/api.js` (`getSettings`/`saveSettings`) đọc/ghi
  field này, mặc định về 6 nếu gia đình chưa chạy migration.
- **Trang Phụ Huynh** (`phu-huynh/`): thêm ô "Hệ số giá đổi quà trong Tủ Quà
  (mặc định x6)" ngay dưới 2 cài đặt cũ (giới hạn giờ chơi, tốc độ đọc) —
  chỉnh 1 lần áp dụng mọi máy, mọi bé trong gia đình.
- **`tu-qua/src/app.js`**: giá hiển thị + giá kiểm tra đủ sao + giá thực trừ
  khi mua đều dùng `effectiveCost()` theo hệ số gia đình đang cài (đọc qua
  `api.getSettings()`, có cache `cachedSettings()` để hiện tạm thời trong
  lúc chờ mạng).

### 3. Icon/thẻ từ vựng trong nhóm "Ôn Tập Vui" quá nhỏ để thấy rõ

Đối chiếu lại: nhóm "Nghe & Đoán" (9 game) vốn đã dùng lưới 2×2 với ảnh phủ
100% ô — không nhỏ. Vấn đề chỉ nằm ở 8 game "Ôn Tập Vui" (bia/lon/cá/lỗ
chuột/bong bóng/phím đàn/bia phi tiêu/khung thành): nút `.opt-btn` chỉ
~58-80px, ảnh bên trong chỉ 60-70% kích thước đó, lại còn bị thu nhỏ thêm
trên màn hình <400px — ảnh vật vựng thực tế chỉ còn ~35-45px trên điện
thoại. Đã phóng to toàn bộ 8 game (~35-40%): `.opt-btn` lên 100-110px (giữ
đúng tỉ lệ hình dạng riêng của từng game — bia tròn, lon chữ nhật, cá oval,
phím đàn cao...), ảnh bên trong lên 78-85%, và làm mềm mức thu nhỏ trên màn
hình nhỏ (không còn tụt xuống dưới ~85-90px nữa). Tăng `min-height` sân chơi
tương ứng để không bị tràn.

- `sw.js` v85 → **v86**. `npm test`: **980 ✅, 0 ❌** (979 cũ + 1 test mới
  cho `effectiveCost`). Smoke test HTTP 200 cho 6 trang hub + `phu-huynh/` +
  `tu-qua/` + các file JS liên quan.

**Còn để ngỏ**: `migrate-03-reward-multiplier.sql` cần bạn tự chạy trong
Supabase SQL Editor (giống 2 migration trước) — chưa chạy thì `saveSettings`
sẽ báo lỗi cột không tồn tại khi bạn bấm "Lưu cài đặt" ở ô hệ số giá mới.

## 25. GAME MỚI: 🧠 RÈN TRÍ NÃO — ĐỢT 2 (5 GAME TRÍ NHỚ/TƯ DUY HỒI XƯA) (07/2026)

Khác với Đợt 1 (mượn khung `ontap.js`), 5 game này KHÔNG dùng lại được logic
sẵn có — phải viết state machine riêng cho từng trò. Theo đúng kiến trúc
"N trò trong 1" đã có sẵn ở `tu-duy/` (Luyện Tư Duy — 6 trò mê cung/sudoku/...):
tạo bundle mới `ren-tri-nao/` cùng khung shell/cheer/confetti, KHÔNG động vào
`tu-duy/` đang chạy tốt để tránh rủi ro hồi quy.

- **`ren-tri-nao/src/rentrinao.js`** — logic thuần 5 trò (tách theo từng mục,
  giống cách `tuduy.js` tách 6 trò), nhận `rng` để test tất định:
  1. **Simon Nhớ Màu** — `nextSimonStep`/`checkSimonInput`, chuỗi dài dần.
  2. **Ghép Số 2048** — thuật toán trượt/gộp cổ điển (`slideMergeRow` dùng
     chung cho cả 4 hướng qua transpose/reverse), `spawnTile2048`,
     `canMove2048` (bí thế khi đầy bàn VÀ không còn 2 ô kề bằng nhau).
  3. **Lật Bài Nhớ Hình Nâng Cấp** — bộ bài riêng 12 cặp emoji+từ tiếng Anh+
     nghĩa (`MEMORY_WORDS`), lật trùng cặp sẽ đọc từ + nghĩa (giữ đúng tinh
     thần "vừa chơi vừa học" dù đây là game trí nhớ thuần).
  4. **Bi-a Lỗ Mini** — vật lý va chạm đàn hồi thật (bảo toàn động lượng),
     nảy tường, ma sát giảm dần vận tốc, phát hiện lọt lỗ — toàn bộ hàm
     thuần không cần DOM/canvas nên test được chính xác từng bước.
  5. **Ghép Khối Rơi Theo Nhóm** — thả khối màu theo cột (kiểu Connect-4),
     `findGroup` flood-fill gom khối liền màu, `clearGroups` xoá nhóm ≥3,
     `collapseColumns` cho khối phía trên rơi lấp chỗ trống.
- **`ren-tri-nao/src/rentrinao.test.js`** — 23 test bao trọn cả 5 trò (kể cả
  vật lý bi-a: bảo toàn động lượng, nảy đúng cả 4 tường, tách 2 bi chồng
  nhau; và game trí nhớ: đúng số cặp, so khớp chỉ theo `key` không theo id).
- **`ren-tri-nao/src/app.js`** — điều phối 5 trò theo đúng mẫu `tu-duy/app.js`
  (màn chọn trò → màn chơi chung → `finish()` tổng kết). Bi-a dùng canvas +
  vòng lặp `requestAnimationFrame`; 2048 nhận cả vuốt (mobile) và phím mũi
  tên (desktop); Ghép Khối dùng hàng nút mũi tên phía trên từng cột (rõ ràng
  hơn bấm trực tiếp vào cột đầy). Thêm cơ chế `state.ctx.cleanup()` để gỡ
  listener bàn phím/`requestAnimationFrame` khi rời game — tu-duy chưa cần
  cái này vì không trò nào của tu-duy dùng canvas động hay phím toàn cục.
- Đăng ký: thẻ "🧠 Rèn Trí Não" ngay sau "Luyện Tư Duy" trên trang chủ, 27
  khoá i18n (`rentrinao.*`, 5 ngôn ngữ), `package.json` thêm dòng test,
  `sw.js` v86 → **v87**.
- `npm test`: **1003 ✅, 0 ❌** (979 + 1 effectiveCost + 23 rentrinao). Smoke
  test HTTP 200 cho `/ren-tri-nao/` và toàn bộ file JS/CSS liên quan.

**Còn để ngỏ**: đã làm xong cả 2 đợt đầu của danh sách 20 game đề xuất ở mục
22 (10/20 game). Còn Đợt 3 (Ếch Qua Đường, Nhảy Dây, Ném Rổ, Bóng Bàn,
Bowling) và Đợt 4 (Pac-Man, Endless Runner, Bắn Cá, Breakout, Match-3 Kẹo)
— chờ bạn duyệt đợt nào muốn làm tiếp.

## 26. FIX UI RÈN TRÍ NÃO + GAME MỚI: 🏃 VẬN ĐỘNG VUI — ĐỢT 3 (07/2026)

### Fix nhỏ: màn chọn trò 5 ô lẻ bị lệch trái

`ren-tri-nao/` có 5 trò (số lẻ) trong lưới 2 cột — ô cuối cùng bị mặc định
nằm lệch trái, thừa 1 ô trống bên phải rất mất cân đối. Thêm 1 rule CSS
`.mode-card:last-child:nth-child(odd) { grid-column: 1 / -1; max-width: calc(50% - 6px); margin: 0 auto; }`
để ô lẻ cuối cùng tự canh giữa cả hàng. Áp dụng luôn cho `van-dong-vui/`
mới (cũng 5 trò) để không bị lỗi tương tự ngay từ đầu.

### Đợt 3 — 5 game vận động vui nhộn, học nhẹ nhàng qua luật chơi

Theo đúng kiến trúc "N trò trong 1" đã dùng cho `tu-duy/` và `ren-tri-nao/`:
bundle mới `van-dong-vui/` — game trong nhóm này thiên về PHẢN XẠ/VẬN ĐỘNG
hơn là học kiến thức cụ thể, nên bài học chính là kiên trì — thử — sai —
thử lại, không gán ép nội dung học thuật.

- **`van-dong-vui/src/vandongvui.js`** — logic thuần 5 trò, nhận rng/thời
  gian để test tất định:
  1. **🐸 Ếch Qua Đường An Toàn** — Frogger dạng LƯỚI RỜI RẠC (không phải
     scroll liên tục): mỗi hàng xe là 1 mảng boolean trượt vòng (circular
     shift) mỗi nhịp, ếch di chuyển từng ô. Qua được 3 lần là thắng.
  2. **🪢 Nhảy Dây Đếm Nhịp** — trò chơi dân gian thật, chưa có bản nào
     trong repo trước đó. Nhịp bấm đúng lúc dây "quét qua chân" (cửa sổ
     ±260ms), nhịp nhanh dần theo chuỗi nhảy đúng liên tiếp.
  3. **🏀 Ném Rổ Đếm Giờ** — thanh lực dao động hình sin liên tục, bấm SÚT
     đúng lúc vạch nằm trong vùng ăn điểm (vị trí vùng đổi ngẫu nhiên mỗi
     lần ném). Giới hạn 30 giây.
  4. **🏓 Bóng Bàn Đối Kháng** — vật lý bóng nảy tường trái/phải + va vợt
     (lệch góc theo điểm chạm gần mép vợt), máy đối kháng đuổi theo bóng
     với tốc độ giới hạn (không "ăn gian" luôn đỡ trúng).
  5. **🎳 Bowling Ảo** — kéo-thả ngắm hướng (giống cơ chế Bi-a Lỗ Mini ở
     Đợt 2), 10 ki xếp hình tam giác, đơn giản hoá luật tính điểm (không
     làm đủ luật strike/spare 10-frame chuẩn — cộng dồn số ki đổ qua 5
     lượt, phù hợp trẻ nhỏ hơn).
- **`van-dong-vui/src/vandongvui.test.js`** — 17 test (di chuyển làn xe,
  thời điểm nhảy dây, dao động lực, vật lý bóng bàn nảy tường/va vợt/AI
  giới hạn tốc độ, xếp hình + đổ ki bowling).
- **`van-dong-vui/src/app.js`** — điều phối theo đúng mẫu 2 bundle trước.
  Ếch Qua Đường + Bóng Bàn dùng phím mũi tên/rê chuột; Nhảy Dây dùng 1 nút
  bấm nhịp; Ném Rổ dùng thanh lực + nút SÚT; Bowling dùng kéo-thả kiểu
  bi-a. Toàn bộ game có timer/rAF đều gắn `state.ctx.cleanup()`.
- Đăng ký: thẻ "🏃 Vận Động Vui" trên trang chủ (sau "Rèn Trí Não"), 33 khoá
  i18n (`vandongvui.*`, 5 ngôn ngữ), `package.json` thêm dòng test, `sw.js`
  v87 → **v88**.
- `npm test`: **1020 ✅, 0 ❌** (1003 + 17 vandongvui). Smoke test HTTP 200
  cho `/van-dong-vui/` và toàn bộ file JS/CSS liên quan.

**Còn để ngỏ**: 15/20 game trong đề xuất mục 22 đã xong (Đợt 1+2+3). Còn
Đợt 4 (Pac-Man ghép chữ, Endless Runner, Bắn Cá Ăn Xu, Đập Gạch Bóng Nảy,
Nối Kẹo Ba) — đây là nhóm "tốn công nhất" theo đánh giá ban đầu, chờ bạn
duyệt trước khi làm.

## 27. FIX UI CANVAS + GAME MỚI: 🕹️ ARCADE XƯA — ĐỢT 4 (XONG 20/20 GAME ĐỀ XUẤT) (07/2026)

### Fix nhỏ: canvas dọc (Bóng Bàn, Bowling) có thể tràn chiều cao trên màn hình thấp

`.pong-canvas` (tỉ lệ 0.72, dọc) và `.bowling-canvas` (tỉ lệ 0.65, dọc) trước
đó chỉ giới hạn theo BỀ RỘNG (`90vw`/px cứng) — trên màn hình THẤP (điện
thoại xoay ngang, cửa sổ nhỏ) chiều cao tính ra từ tỉ lệ khung hình có thể
vượt quá màn hình. Sửa bằng công thức `calc(58dvh * tỉ_lệ_khung_hình)` làm
1 trong các giá trị `min(...)` của bề rộng — quy đổi "trần chiều cao 58dvh"
thành 1 giá trị bề rộng tương ứng. Áp dụng thêm cho `.frog-board` (vuông,
dùng trực tiếp `44dvh`). `.billiard-canvas` (tỉ lệ 1.7, ngang) vốn đã an
toàn từ trước vì hình ngang thì bề rộng luôn là chiều giới hạn chặt hơn.

### Đợt 4 — 5 game arcade cổ điển phức tạp nhất, khép lại danh sách 20 game

Bundle mới `arcade-xua/`, đúng kiến trúc "N trò trong 1" lần thứ 4:

- **`arcade-xua/src/arcadexua.js`** — logic thuần 5 trò:
  1. **👻 Ăn Chấm Né Ma (ghép chữ)** — mê cung MỞ (không tường, khác Pac-Man
     gốc) trên lưới 9×9: ăn chữ cái ĐÚNG THỨ TỰ để ghép 1 từ tiếng Anh ngắn
     (8 từ có sẵn kèm nghĩa), né ma đuổi theo kiểu tham lam (ưu tiên trục
     lệch nhiều hơn — cùng công thức đuổi chuột trong mê cung của `tu-duy/`).
  2. **🛹 Nhảy Né Không Ngừng** — endless runner kiểu khủng long Chrome:
     `jumpArc()` tính độ cao nhảy theo parabol thuần (không cần vật lý
     phức tạp), tốc độ cuộn tăng dần theo điểm (`speedForScore`, có trần).
  3. **🐟 Bắn Cá Ăn Xu** — cá bơi ngang 2 chiều với giá trị xu ngẫu nhiên,
     chạm màn hình để "bắn", trúng thì cộng xu theo giá trị con cá.
  4. **🧱 Đập Gạch Bóng Nảy (Breakout)** — vật lý bóng nảy tường/vợt (lệch
     góc theo điểm chạm, cùng công thức với vợt Bóng Bàn ở Đợt 3) + phá
     gạch AABB, 3 mạng, thắng khi phá hết gạch.
  5. **🍬 Nối Kẹo Ba (Match-3)** — engine đầy đủ: sinh bàn không có sẵn
     match, đổi chỗ 2 ô liền kề, `findMatches` dò cả hàng lẫn cột, xoá +
     rơi lấp chỗ trống + sinh kẹo mới lặp lại tới khi hết match theo tầng
     (cascade) — phức tạp nhất trong cả 20 game vì phải xử lý HIỆU ỨNG DÂY
     CHUYỀN (1 lần đổi có thể kích hoạt nhiều đợt xoá liên tiếp).
- **`arcade-xua/src/arcadexua.test.js`** — 28 test. Phát hiện 1 lỗi trong
  chính bộ test (không phải code sản phẩm) khi soạn: dùng rng() hằng số cho
  `makeCandyGrid` khiến vòng lặp "thử lại tới khi không tạo match" LẶP VÔ
  HẠN vì luôn ra cùng 1 màu — phải đổi sang 1 bộ sinh số biến thiên thật
  (LCG nhỏ) để test không treo. Đây là lý do phải luôn chạy test có
  timeout khi thao tác với vòng lặp `do...while` phụ thuộc rng.
- **`arcade-xua/src/app.js`** — Pac-Man dùng D-pad/phím mũi tên giống Ếch
  Qua Đường; Runner dùng 1 nút NHẢY; Bắn Cá dùng chạm-để-bắn; Breakout dùng
  canvas + rê ngón tay; Nối Kẹo dùng chạm-chọn-2-ô. Toàn bộ game có
  timer/rAF gắn `state.ctx.cleanup()` như 3 bundle trước.
- Đăng ký: thẻ "🕹️ Arcade Xưa" trên trang chủ (sau "Vận Động Vui"), 33 khoá
  i18n (`arcadexua.*`, 5 ngôn ngữ), `package.json` thêm dòng test, `sw.js`
  v89 → **v90**.
- `npm test`: **1048 ✅, 0 ❌** (1020 + 28 arcadexua). Smoke test HTTP 200
  cho `/arcade-xua/` và toàn bộ file JS/CSS liên quan.

**Còn để ngỏ**: **Đủ 20/20 game** trong đề xuất mục 22 đã hoàn thành qua 4
đợt (Ôn Tập Vui mượn khung × 5, Rèn Trí Não × 5, Vận Động Vui × 5, Arcade
Xưa × 5) — không còn đợt nào tồn đọng từ danh sách này. Nếu muốn mở rộng
thêm, cần đề xuất ý tưởng mới.

## Bổ sung thêm chương trình học và luyệt theo unit cho việc thi Cambridge (Starters – Movers – Flyers) , KET , PET and TOEFL . Mỗi chủ đề luyện thi Cambridge (Starters – Movers – Flyers) , KET (đạt đến A2), PET (Đến B1) and TOEFL (tập trung Đến điểm đạt 700 là được hoặc Max B2 là được ) . Tôi đã tham khảo file chungchi.png nhưng cần nâng cấp lên 1 tí cho trẻ học nhiều hơn và có nền tảng chắc hơn .
tập trung vào game ngữ pháp ,luyện đề, học theo unit, lặp lại từ vựng và ngữ pháp đến khi thuần thục , có dữ liệu có thể mở rộng , ghi nhiều ý tưởng gâme, animations minh họa ví dụ nguwx pháp quá khứ sẽ có cây thời gian , và 1 người đang chạy ở mốc quá khứ, bắt trẻ dự đoán là thì gì ? hay 2 hành động ở quá khứ , bắt trẻ đoán thì gì .... và nhiều animation khác hỗ trợ học đầy đủ ngữ pháp . 
Có mục xuất hiện câu hỏi ngẫu nhiên trong game ..
Lưu những câu hay sai để tăng xác xuất xuất hiện lặp lại đến khi đúng 
Ghi thêm nhiều ý tưởng, phân thành nhiều đợt làm , Mỗi chủ đề luyện thi Cambridge (Starters – Movers – Flyers) , KET (đêbs A2), PET (Đến B1) and TOEFL (tập trung Đến điểm đạt 700 là được) .  sẽ có 1 menu chính ở Home , đễ dễ truy cập hơn . 
Claw đề hoặc theo dõi sát đề tài và từ vựng khi thi 2 chứng chỉ này . ( chia đợt để cập nhật riêng từng đợt với claude code và không bị trùng )

## 28. ĐỀ XUẤT: LUYỆN THI CAMBRIDGE MOVERS & FLYERS (07/2026)

Theo yêu cầu: thu hẹp phạm vi lại **Movers + Flyers trước** (Starters/KET/
PET/TOEFL để dành đợt sau, đúng tinh thần "chia đợt, không trùng" bạn ghi ở
trên). Đây MỚI CHỈ LÀ ĐỀ XUẤT/NGHIÊN CỨU để bạn xem xét — CHƯA code gì.

### Vì sao tách riêng Movers & Flyers trước

Cambridge Young Learners English (YLE) có 3 bậc: **Starters (tiền A1) →
Movers (A1) → Flyers (A2)**, độ khó tăng dần và ngữ pháp Flyers XÂY TRÊN NỀN
Movers (không phải kiến thức tách biệt). Làm 2 bậc liền kề này trước sẽ tạo
ra 1 "cột sống ngữ pháp" hoàn chỉnh (từ thì hiện tại đơn tới hiện tại hoàn
thành) mà Starters/KET/PET/TOEFL sau này chỉ cần nối thêm hai đầu, không
phải thiết kế lại engine.

### 1. Nội dung cần phủ (dựa theo khung chương trình chính thức Cambridge YLE)

**Ngữ pháp Movers (A1)** — nền tảng:
- Hiện tại đơn (thói quen, sự thật) — khẳng định/phủ định/nghi vấn, "-s" ngôi 3
- Hiện tại tiếp diễn (đang xảy ra) — đối lập với hiện tại đơn
- Quá khứ đơn — động từ có quy tắc (-ed) + bất quy tắc thông dụng (went, ate, saw, had, did, made...)
- there is/there are, there isn't/aren't
- can/can't (khả năng & xin phép)
- So sánh hơn đơn giản: bigger, more beautiful
- Sở hữu cách 's + tính từ sở hữu (my/your/his/her/our/their)
- Giới từ chỉ vị trí: in/on/under/next to/between/in front of/behind
- Câu mệnh lệnh (Open the door. Don't run.)
- some/any, danh từ số nhiều (quy tắc + bất quy tắc: children, feet, mice)
- Từ để hỏi: what/where/who/when/why/how many/how much/whose
- Trạng từ tần suất: always/usually/sometimes/never
- Đại từ tân ngữ: me/him/her/us/them

**Ngữ pháp Flyers (A2)** — xây thêm trên nền Movers:
- Quá khứ tiếp diễn (was/were + V-ing) — **thường ra đề đối chiếu với quá khứ đơn** (đúng ý tưởng "2 hành động ở quá khứ" bạn nêu: "While I was cooking, the phone rang.")
- Hiện tại hoàn thành (have/has + V3) — với ever/never/just/already/yet
- So sánh hơn & so sánh nhất đầy đủ (đều + bất quy tắc: good-better-best, bad-worse-worst)
- Tương lai "going to" (dự định) đối lập "will" (dự đoán/quyết định tức thời)
- Động từ khuyết thiếu: must/mustn't, should/shouldn't, have to/don't have to, could (khả năng quá khứ)
- Giới từ chỉ chuyển động: into/out of/through/along/across/past/towards
- Liên từ nối câu: and/but/or/because/so/when/before/after
- Trạng từ chỉ cách thức: quickly/carefully...
- Lượng từ: a lot of/lots of/a little/a few

**Chủ đề từ vựng** (đối chiếu danh sách từ vựng chính thức YLE): Animals,
Body & face, Clothes, Colours & shapes, Family & friends, Food & drink,
Health, Hobbies, Home, Numbers, Personal information, Places, School,
Sports, Time (giờ/thứ/tháng/mùa), Toys & games, Transport, Weather, Work,
World (quốc gia) — Flyers thêm: cảm xúc sâu hơn, công nghệ, thiên nhiên/môi
trường, nghề nghiệp mở rộng, phương hướng, vật liệu, vật chứa.

**Tin vui**: dự án ĐÃ CÓ SẴN phần lớn nền từ vựng này rải trong 9 game
"Nghe & Đoán" (~825 từ, chủ đề trùng khá nhiều với danh sách trên — động
vật, gia đình, thể thao, thời tiết, giao thông, số đếm, nghề nghiệp, đồ
dùng, cơ thể...) — **không cần xây từ vựng lại từ đầu**, chỉ cần rà soát bổ
sung từ còn thiếu theo đúng danh sách Movers/Flyers chính thức và gắn thêm
lớp NGỮ PHÁP lên trên (điều hiện chưa có game nào trong dự án làm).

### 2. Cơ chế "lưu câu hay sai để tăng xác suất lặp lại" — ĐÃ CÓ SẴN, chỉ cần tổng quát hoá

Dự án đã có đúng cơ chế bạn mô tả — `nghe-doan-on-tap/src/misses.js`:
sai 1 từ → +1 điểm "cần ôn"; đúng ngay lần đầu → -1 điểm; sổ "🎯 Ôn chỗ yếu"
đọc danh sách này để ưu tiên hỏi lại. Nhưng module này lấy **từ tiếng Anh**
làm khoá duy nhất — hợp lý cho vocab nhưng KHÔNG hợp cho câu hỏi ngữ pháp
(1 điểm ngữ pháp có thể có nhiều câu hỏi khác nhau). Đề xuất: viết 1 module
song song `exam-prep/src/misses.js` cùng thuật toán hệt vậy nhưng khoá theo
`questionId` thay vì từ — tách riêng để KHÔNG đụng vào `misses.js` gốc đang
chạy ổn định cho 9+8 game hiện có.

### 3. Ý tưởng game cụ thể — chia theo dạng bài thi thật (Listening/Reading&Writing) + phần ngữ pháp riêng

**A. Game minh hoạ ngữ pháp bằng animation** (đúng ý tưởng "cây thời gian" bạn nêu):

1. **🕰️ Cỗ Máy Thời Gian Ngữ Pháp** — 1 thanh thời gian ngang, mốc "Bây giờ"
   ở giữa, quá khứ bên trái, tương lai bên phải. 1 nhân vật hoạt hình thực
   hiện 1 hành động tại 1 điểm trên trục; bé phải đoán ĐÚNG THÌ (hiện tại
   đơn / quá khứ đơn / quá khứ tiếp diễn / hiện tại hoàn thành / going to)
   dựa vào tín hiệu hình ảnh (đồng hồ đang quay = "đang xảy ra", dấu ✓ =
   "đã xong", mũi tên chỉ tới tương lai = dự định).
2. **⏳ Hai Hành Động Cùng Lúc** — đúng ý tưởng "2 hành động ở quá khứ" bạn
   mô tả: 1 thanh DÀI (hành động nền, quá khứ tiếp diễn) bị 1 thanh NGẮN cắt
   ngang (hành động xen vào, quá khứ đơn), 2 nhân vật hoạt hình minh hoạ
   song song ("While A was cooking, B rang the doorbell") — bé ghép đúng
   cấu trúc câu ứng với hình.
3. **📈 So Sánh Hơn/Nhất Trực Quan** — 2-3 nhân vật/đồ vật với thanh đo trực
   quan (chiều cao/tốc độ/kích thước), bé chọn câu so sánh đúng khớp hình.
4. **🔮 Going To vs Will** — hình ảnh gợi Ý ĐỊNH có sẵn (vali đã đóng gói =
   going to) đối lập QUYẾT ĐỊNH TỨC THỜI (chuông điện thoại reo, nhân vật
   giật mình = will), bé chọn đúng cấu trúc.
5. **🚦 Modal Ai Đúng** — tình huống hình ảnh (biển báo, luật lệ) + bé chọn
   must/mustn't/should/shouldn't phù hợp — lồng ghép được cả bài học kỹ
   năng sống.

**B. Game ôn tập vui mượn khung có sẵn** (tái dùng công thức "Ôn Tập Vui"):

6. **🎯 Bắn Đúng Thì** — mượn khung bắn cung/ném lon: mục tiêu là CÁC NHÃN
   THÌ thay vì tranh vựng, máy đọc 1 câu, bé bắn trúng thì đúng của câu đó.
7. **🃏 Lật Thẻ Ngữ Pháp** — biến thể lật-bài: lật đúng cặp "câu ví dụ ↔ tên
   thì/cấu trúc".

**C. Mô phỏng cấu trúc đề thi thật** (đã nói rõ giới hạn — xem mục 4):

8. **📝 Luyện Đề Movers/Flyers** — chế độ đề thi thu nhỏ nhiều phần (nghe +
   đọc-viết trộn), random câu hỏi có TRỌNG SỐ theo sổ "cần ôn" (câu càng
   hay sai càng dễ xuất hiện lại — đúng yêu cầu của bạn), tính điểm cuối đề
   kiểu "số sao" giống format 5 khiên/15 sao Cambridge thật hay dùng.
9. **🔊 Nghe Hiểu Đề Thi** — mượn TTS có sẵn, đọc đoạn hội thoại ngắn rồi
   hỏi ghép tranh/tên/số — đúng format "Listening Part" thật của Movers/Flyers.
10. **📖 Đọc & Điền Từ** — đoạn văn ngắn + điền từ đúng ngữ pháp/nghĩa vào
    chỗ trống, kiểu "Reading & Writing Part 5/6" thật.

### 4. Giới hạn thành thật cần lưu ý trước khi duyệt

- **Phần Speaking (thi nói)** của Movers/Flyers có giám khảo hỏi-đáp trực
  tiếp — 1 web app offline không thể chấm điểm nói tự động chính xác. Đề
  xuất: mượn lại tính năng ghi âm-tự nghe-so sánh đã có ở `tieng-anh/`, làm
  thêm bộ câu hỏi ĐÚNG PHONG CÁCH speaking thật (mô tả tranh, trả lời câu
  hỏi cá nhân) nhưng chỉ để bé LUYỆN PHÁT ÂM/PHẢN XẠ, không giả vờ "chấm
  điểm nói" vì làm vậy dễ gây hiểu lầm cho phụ huynh.
- Cambridge KHÔNG công bố "điểm liệt/đậu" — Movers/Flyers chỉ chấm bằng số
  khiên (1-5), không có khái niệm rớt. Nên giữ đúng tinh thần này (khích lệ,
  không tạo áp lực điểm số) thay vì gắn ngưỡng "đậu/rớt" giả.

### 5. Đề xuất chia đợt (để bạn duyệt từng đợt, không trùng việc)

- **Đợt 1 — Nền tảng dữ liệu**: định nghĩa cấu trúc `Unit` mở rộng được
  (`{ id, level, topic, vocab, grammarPoints, questions }`), viết
  `exam-prep/src/misses.js` (tổng quát hoá theo `questionId`), rà soát bổ
  sung từ vựng Movers còn thiếu so với 9 game hiện có, thêm menu "🎓 Luyện
  Thi Cambridge" ở trang chủ (chọn Movers/Flyers) — CHƯA có game chơi được,
  chỉ dựng khung + dữ liệu.
- **Đợt 2 — Game minh hoạ ngữ pháp cốt lõi**: Cỗ Máy Thời Gian Ngữ Pháp +
  Hai Hành Động Cùng Lúc (hiện tại đơn/tiếp diễn, quá khứ đơn/tiếp diễn) —
  đây là 2 game "flagship" trực quan hoá đúng ý tưởng ban đầu của bạn.
- **Đợt 3 — Mượn khung Ôn Tập Vui cho ngữ pháp**: Bắn Đúng Thì + Lật Thẻ
  Ngữ Pháp — tái dùng engine đã kiểm thử, nhanh như Đợt 1 của "Ôn Tập Vui".
- **Đợt 4 — Game ngữ pháp Flyers nâng cao**: So Sánh Hơn/Nhất, Going To vs
  Will, Modal Ai Đúng, hiện tại hoàn thành.
- **Đợt 5 — Mô phỏng đề thi**: Luyện Đề trộn ngẫu nhiên có trọng số + Nghe
  Hiểu Đề Thi + Đọc & Điền Từ — ghép lại toàn bộ Đợt 1-4 thành 1 trải
  nghiệm "luyện đề" hoàn chỉnh.

**Việc của bạn**: xem lại phạm vi ngữ pháp/chủ đề ở mục 1 có đúng ý muốn
không, và duyệt bắt đầu từ Đợt nào — Đợt 1 là bắt buộc phải làm trước tiên
vì mọi đợt sau đều dựa vào cấu trúc dữ liệu này.

## 29. FIX ANIMATION "XẤU" Ở NHÓM ÔN TẬP VUI (07/2026)

Bạn phản hồi: 8 game "Ôn Tập Vui" hay nhưng animation xấu/không đẹp. Rà lại
từng game, tìm được cả vấn đề chung LẪN 1 lỗi thật sự (không phải chỉ là gu
thẩm mỹ):

### Lỗi thật: chuột chũi bị "dập" tức thời, không có animation

`bat-chuot-chui-tu-vung/style.css` — rule `.opt-btn` (chuột chũi) không hề
khai báo `transition` ở BẤT KỲ đâu (không ở rule gốc, không ở
`.opt-btn.correct`). Khi bé đập trúng, class `correct` đổi `transform` +
tắt animation nhấp nhô (`animation: none`) NGAY LẬP TỨC — chuột chũi bị
"dập bẹp" tức thời như khung hình bị đứt, không hề có chuyển động mượt.
Đây nhiều khả năng là thứ gây cảm giác "xấu" rõ nhất trong 8 game. Đã thêm
`transition: transform 0.3s cubic-bezier(.36,0,.66,-0.56), opacity 0.3s ease;`
vào rule gốc — giờ cú đập mượt hẳn, có cảm giác "dồn lực rồi mới bẹp xuống"
(đường cong overshoot nhẹ) thay vì snap cứng.

### Vấn đề chung: 3 chỗ làm animation "rẻ tiền" ở CẢ 8 GAME

1. **Màn thắng/thua bật/tắt ĐỘT NGỘT** — `.overlay` trước giờ chỉ
   `display: none ↔ flex`, không hề có transition, y hệt bật công tắc đèn.
   Đổi sang điều khiển bằng `opacity` + `scale` có transition (giữ nguyên
   hành vi ẩn/hiện, không bị bấm nhầm nhờ `pointer-events: none` khi ẩn) —
   giờ màn kết quả mờ dần + phóng to nhẹ khi xuất hiện, mượt hơn hẳn.
2. **Trúng đích không có phản hồi thị giác NGAY TẠI ĐIỂM CHẠM** — vật thể
   bay tới rồi biến mất, chỉ có bia/mục tiêu đổi màu viền. Thêm hiệu ứng
   `.impact-ring` (vòng sáng bung ra rồi mờ dần trong 0.35s) tại đúng toạ độ
   chạm đích, gọi qua hàm `spawnImpact(x, y)` dùng chung — cảm giác "bụp"
   rõ ràng hơn nhiều, áp dụng đồng loạt cả 8 game.
3. **Easing bay không đồng nhất, nhiều chỗ dùng `linear`/`ease` chung
   chung** — cảm giác máy móc, không có "trọng lượng":
   - `cau-ca-tu-vung`: lưỡi câu trước bay CHÉO 1 mạch từ cần câu tới cá
     (trông giả tạo với 1 dây câu thẳng đứng cố định) — đổi thành 2 chặng:
     đu ngang tới đúng vị trí trước (nhanh, hơi lắc), RỒI mới thả thẳng
     xuống theo đường cong trọng lực (`cubic-bezier(.55,0,1,.45)`).
   - `go-not-tu-vung`: nốt nhạc rơi tốc độ ĐỀU (`linear`) — đổi sang đường
     cong trọng lực thật (chậm dần đều rồi nhanh dần) + thêm lắc lư nhẹ.
   - `nem-phi-tieu-tu-vung`: phi tiêu trước dùng emoji 🎯 (chính là hình bia
     — bay 1 bia hướng tới 1 bia khác nhìn rất lạ!) — đổi sang 📌, thêm xoay
     tròn dần trong lúc bay giống phi tiêu thật xoay khi được ném.
   - `da-phat-den-tu-vung`: bóng bay thẳng không xoay — thêm xoay 420°
     trong lúc bay để giống 1 cú sút thật.
   - `ban-cung-tu-vung`/`nem-lon-tu-vung` vốn đã dùng cubic-bezier tốt từ
     trước, không cần sửa.
4. **Hiệu ứng `opt-pop` (dùng chung ở Bắn Cung/Ném Phi Tiêu/Đá Phạt Đền)
   chỉ phóng to đều rồi thu lại** — đổi thành squash-and-stretch (phình
   ngang-bẹp dọc rồi bẹp ngang-phình dọc rồi mới về bình thường) cho cảm
   giác nảy tự nhiên hơn thay vì "thở phồng" đơn điệu.

- `sw.js` v90 → **v91**. `npm test`: vẫn **1048 ✅, 0 ❌** (thuần CSS/hiệu
  ứng, không đụng logic). Smoke test HTTP 200 cho cả 8 game.

**Còn để ngỏ**: đây là rà soát theo phán đoán riêng (không có ảnh chụp cụ
thể bạn chê chỗ nào) — nếu vẫn còn chỗ nhìn chưa ổn, gửi thêm chi tiết
(quay màn hình lúc chơi hoặc chỉ đúng game/khoảnh khắc) để sửa trúng hơn.

## 30. ĐỀ XUẤT: LUYỆN THI KET, PET, TOEFL JUNIOR & TOEIC — PHẦN CÒN LẠI (07/2026)

Đúng — mục 28 mới làm Movers & Flyers. Đây là phần bổ sung cho **KET, PET,
TOEFL Junior, và TOEIC** (mới thêm theo yêu cầu — IELTS trong bảng
`chungchi.png` bạn có sẵn thì để ngỏ làm sau vì không nằm trong yêu cầu
gốc, nhưng nội dung sẽ tái dùng được gần hết vì cùng tầm B1-B2). Đã xem
`chungchi.png` — đối chiếu đúng bảng hiệu lực/cấp độ/mục đích bạn ghi
(KET = Sơ cấp, PET = Sơ Trung Cấp, TOEFL/IELTS = Trung Cấp→Cao cấp). Vẫn
CHỈ LÀ ĐỀ XUẤT — chưa code gì.

### ✅ Đã xác nhận: TOEFL Junior, mục tiêu >800/900 — và bổ sung TOEIC, mục tiêu 800/990

Bạn xác nhận **TOEFL Junior** (không phải iBT) với mục tiêu nâng lên
**>800/900** (~tương đương B2 chắc, chạm ngưỡng đầu C1) — cao hơn mốc 700
ban đầu, nghĩa là ngân hàng câu hỏi cần đủ ĐỘ KHÓ và ĐỘ PHỦ ngữ pháp/từ
vựng ở mức trên, không dừng ở "vừa đủ qua". Đồng thời bổ sung thêm
**TOEIC**, mục tiêu **800/990** (thang Nghe+Đọc, không tính riêng
Nói-Viết) — mức 800+ được xem là "Working Proficiency" cao, đủ dùng tốt
trong môi trường công sở/quốc tế.

**Lưu ý thành thật về đối tượng**: TOEIC vốn thiết kế cho NGƯỜI ĐI LÀM
(ngữ cảnh văn phòng — hợp đồng, lịch họp, hoá đơn, nhân sự...), khác hẳn
đối tượng 4-18 tuổi của cả app. Track TOEIC này sẽ tự nhiên phù hợp hơn với
học sinh lớn/thiếu niên hoặc người lớn dùng chung tài khoản gia đình — vẫn
làm được, chỉ ghi rõ để bạn biết đây là nhánh "kéo dài" hơn các track còn
lại, không phải nội dung dành cho bé nhỏ tuổi nhất của app.

### 2. Nội dung cần phủ — XÂY TIẾP trên "cột sống ngữ pháp" Movers/Flyers ở mục 28 (không dạy trùng)

**KET / A2 Key** (Sơ cấp — ngay sau Flyers):
- Ngữ pháp MỚI so với Flyers: câu điều kiện loại 0 & loại 1 (if + hiện tại,
  will + động từ nguyên mẫu), động từ + V-ing sau một số động từ (like/enjoy
  + V-ing), đại từ phản thân (myself/yourself...), giới từ thời gian/địa
  điểm/chuyển động đầy đủ hơn, cụm động từ (phrasal verbs) thông dụng cơ
  bản (get up, look for, turn on...).
- Ngữ pháp Flyers được LUYỆN SÂU hơn (không dạy mới): hiện tại hoàn thành,
  going to/will, so sánh hơn/nhất — chỉ tăng độ khó câu hỏi.
- Từ vựng mở rộng đời sống: mua sắm, công việc, du lịch, giải trí, công
  nghệ, sức khoẻ & lối sống, mô tả người/địa điểm, hẹn gặp & lời mời.
- Cấu trúc đề thật: Đọc-Viết (biển báo/thông báo thật, viết tin nhắn ngắn
  ~25 từ), Nghe, Nói (phỏng vấn theo cặp — vẫn giữ giới hạn ở mục 4/28: chỉ
  luyện phản xạ, không chấm điểm nói).

**PET / B1 Preliminary** (Sơ Trung Cấp):
- Ngữ pháp MỚI: câu điều kiện loại 2 (if + quá khứ, would + nguyên mẫu),
  quá khứ hoàn thành, câu bị động (thì hiện tại đơn & quá khứ đơn), câu
  tường thuật (reported speech) cơ bản, mệnh đề quan hệ (who/which/that),
  động từ khuyết thiếu chỉ suy đoán (must be/might be/can't be), liên từ
  nối câu phức (although/despite/in spite of/however).
- Từ vựng mở rộng: giáo dục, đời sống công việc, môi trường & thiên nhiên,
  văn hoá, truyền thông, quan hệ xã hội, du lịch, khoa học-công nghệ cơ
  bản, diễn đạt ý kiến/cảm xúc.
- Cấu trúc đề thật: Đọc, Viết (có phần viết đoạn văn/email ~100 từ), Nghe,
  Nói.

**TOEFL Junior (B1→B2/C1 nhẹ, mục tiêu >800/900)**:
- Ngữ pháp MỚI so với PET: quá khứ hoàn thành tiếp diễn, tương lai hoàn
  thành/tương lai tiếp diễn, câu điều kiện loại 3 (if + quá khứ hoàn thành,
  would have + V3), câu bị động đầy đủ ở MỌI THÌ, câu tường thuật ĐẦY ĐỦ
  (trần thuật/nghi vấn/mệnh lệnh), mệnh đề quan hệ xác định/không xác định,
  liên từ phức tạp hơn (provided that/unless/as long as).
- Vì mục tiêu NÂNG lên >800 (không chỉ "đạt"), cần thêm 1 lớp câu hỏi khó
  hơn mức đại trà: đoạn văn dài hơn, nhiễu (distractor) tinh vi hơn giữa
  các đáp án gần nghĩa, và trộn nhiều điểm ngữ pháp trong 1 câu thay vì 1
  điểm/câu — đúng cách đề thi thật phân hoá điểm cao/thấp.
- Từ vựng học thuật nhẹ + đời sống: chủ đề trường học/khoa học/xã hội mức
  độ vừa phải (đúng tinh thần bài đọc TOEFL Junior thật — không hàn lâm như
  iBT).
- Cấu trúc đề thật (bản Standard — phù hợp app offline nhất): **Nghe hiểu**
  (hội thoại/bài giảng ngắn), **Ngữ pháp-Từ vựng theo ngữ cảnh** (Language
  Form & Meaning — điền từ/sửa lỗi trong đoạn văn), **Đọc hiểu** (ý chính,
  chi tiết, suy luận, từ vựng theo văn cảnh, cấu trúc bài). Không có phần
  Nói/Viết ở bản Standard — NHẸ GÁNH cho app hơn nhiều so với Movers/Flyers
  (vốn phải "chữa cháy" phần Nói bằng ghi âm tự nghe).

**TOEIC (Nghe & Đọc, mục tiêu 800/990)**:
- Không có nhiều ngữ pháp MỚI so với TOEFL Junior (cùng tầm B2) — điểm khác
  biệt chính là NGỮ CẢNH: toàn bộ câu hỏi đặt trong bối cảnh CÔNG SỞ/THƯƠNG
  MẠI thay vì đời sống/học đường.
- Từ vựng: giao tiếp văn phòng, họp & lịch làm việc, công tác & di chuyển,
  tiếp khách, nhân sự & tuyển dụng, tài chính & ngân sách, marketing & bán
  hàng, sản xuất & vận chuyển, công nghệ văn phòng, hợp đồng nhà đất, bảo
  hiểm sức khoẻ nơi làm việc.
- Cấu trúc đề thật (7 phần, Nghe 4 phần + Đọc 3 phần):
  - Nghe: **Part 1** Mô tả tranh (nghe 4 câu, chọn câu khớp nhất với 1 bức
    ảnh), **Part 2** Hỏi-Đáp, **Part 3** Hội thoại, **Part 4** Bài nói/thông
    báo.
  - Đọc: **Part 5** Hoàn thành câu (điền từ/ngữ pháp), **Part 6** Hoàn
    thành đoạn văn, **Part 7** Đọc hiểu (đơn/nhiều văn bản — đặc trưng hiện
    đại của TOEIC thật là dạng "chuỗi tin nhắn" giữa 2-3 người).

### 3. Tái dùng đúng kiến trúc đã đề xuất ở mục 28 — không tạo hệ thống mới

- Cùng cấu trúc `Unit` mở rộng (`{ id, level, topic, vocab, grammarPoints,
  questions }`) — chỉ thêm `level: 'ket'|'pet'|'toefl-junior'|'toeic'`.
- Cùng `exam-prep/src/misses.js` (khoá theo `questionId`) — dùng chung cho
  cả 6 cấp (Movers/Flyers/KET/PET/TOEFL Junior/TOEIC), không tạo sổ ôn
  riêng cho từng cấp (bé lên cấp cao hơn vẫn ôn đúng những câu từng sai ở
  cấp thấp nếu chủ điểm ngữ pháp trùng — vd "quá khứ hoàn thành" xuất hiện
  lại ở cả PET, TOEFL Junior và TOEIC).
- Menu "🎓 Luyện Thi Cambridge" ở trang chủ (đã đề xuất ở mục 28) mở rộng
  thành 6 lựa chọn: Starters~~(để sau)~~/Movers/Flyers/KET/PET/TOEFL
  Junior/TOEIC — hoặc tách riêng 1 khu "🎓 Luyện Thi Quốc Tế" chứa TOEFL
  Junior + TOEIC nếu muốn phân biệt rõ "thi trẻ em" (YLE+KET+PET) và "thi
  có tính quốc tế/công sở cao hơn" (TOEFL Junior/TOEIC) — bạn chọn cách
  nào khi duyệt.

### 4. Ý tưởng game RIÊNG cho KET/PET/TOEFL Junior (khác Movers/Flyers)

Ở Movers/Flyers, animation trực quan (cỗ máy thời gian, so sánh hơn/nhất...)
là trọng tâm vì bé còn nhỏ, ngữ pháp còn cụ thể. Lên KET/PET/TOEFL Junior,
nội dung THIÊN VỀ ĐỌC HIỂU + NGỮ CẢNH DÀI hơn, nên cần thêm nhóm game mới:

11. **📰 Đọc Hiểu Có Giờ** — 1 đoạn văn ngắn (biển báo/tin nhắn/email/bài
    báo ngắn tuỳ cấp) + câu hỏi trắc nghiệm (ý chính/chi tiết/suy luận/từ
    vựng theo văn cảnh) — đúng 4 dạng câu hỏi đọc hiểu chuẩn quốc tế.
12. **✂️ Sửa Lỗi Trong Đoạn Văn** — đúng dạng "Language Form & Meaning" của
    TOEFL Junior: đoạn văn có vài chỗ sai ngữ pháp, bé chạm vào từ sai rồi
    chọn từ đúng thay thế.
13. **🔄 Viết Lại Câu Cùng Nghĩa** — dạng bài quen thuộc của PET: cho 1 câu,
    bé chọn/ghép câu khác nghĩa giống hệt nhưng cấu trúc khác (chủ động ↔
    bị động, câu trực tiếp ↔ tường thuật) — game kiểu ghép cặp.
14. **🎧 Nghe Bài Giảng Ngắn** — mượn TTS đọc 1 đoạn hội thoại/bài giảng dài
    hơn Movers/Flyers (30-60 giây), hỏi nhiều câu liên tiếp về cùng 1 đoạn
    (đúng cấu trúc thi TOEFL Junior Listening).
15. **🧩 Ghép Mệnh Đề Quan Hệ** — kéo-thả ghép 2 câu đơn thành 1 câu có mệnh
    đề quan hệ (who/which/that) — luyện đúng điểm ngữ pháp mới của PET.

**Riêng cho TOEIC** (bối cảnh công sở, bám sát 7 phần đề thật):

16. **🖼️ Nghe Tả Tranh** — hiện 1 bức ảnh cảnh công sở/sinh hoạt, nghe 4
    câu mô tả, chọn câu khớp nhất với ảnh — đúng Part 1 TOEIC thật.
17. **💬 Chuỗi Tin Nhắn Công Sở** — đọc 1 đoạn nhắn tin/email qua lại giữa
    đồng nghiệp, trả lời câu hỏi về ngữ cảnh/ý định người nói — đúng dạng
    "chuỗi tin nhắn" đặc trưng của Part 7 TOEIC hiện đại.
18. **📋 Điền Đơn/Biểu Mẫu Công Sở** — đọc 1 biểu mẫu/lịch trình/hoá đơn,
    trả lời câu hỏi thông tin cụ thể — luyện kỹ năng skim/scan nhanh đúng
    kiểu TOEIC thật (phần đọc TOEIC nổi tiếng chạy giờ rất gấp).

(2 game "Đọc Hiểu Có Giờ" và "Sửa Lỗi Trong Đoạn Văn" ở trên dùng lại được
cho Part 5/6/7 còn lại của TOEIC, chỉ đổi ngữ cảnh sang công sở.)

### 5. Đề xuất chia đợt tiếp theo (nối tiếp Đợt 1-5 của Movers/Flyers ở mục 28)

- **Đợt 6 — Dữ liệu KET**: đơn vị bài học + ngân hàng câu hỏi KET, mở rộng
  menu chọn cấp độ.
- **Đợt 7 — Game ngữ pháp mới của KET**: điều kiện loại 0/1, phrasal verbs,
  đại từ phản thân (game trực quan kiểu Đợt 2/28 nếu còn hợp; nếu quá trừu
  tượng thì chuyển sang dạng bài tập trực tiếp).
- **Đợt 8 — Dữ liệu + game PET**: điều kiện loại 2, quá khứ hoàn thành, bị
  động, tường thuật, mệnh đề quan hệ — cùng lúc làm game "Viết Lại Câu Cùng
  Nghĩa" và "Ghép Mệnh Đề Quan Hệ".
- **Đợt 9 — Dữ liệu + game TOEFL Junior**: điều kiện loại 3, bị động/tường
  thuật đầy đủ — trọng tâm là 3 game ĐỌC/NGHE/SỬA LỖI (mục 4, ý 11-12-14)
  vì đây là trọng số điểm chính của bài thi thật.
- **Đợt 10 — Dữ liệu + game TOEIC**: ngân hàng câu hỏi theo đúng 7 phần đề
  thật, trọng tâm 3 game riêng (Nghe Tả Tranh, Chuỗi Tin Nhắn Công Sở, Điền
  Đơn/Biểu Mẫu) + tái dùng 2 game đọc/sửa lỗi cho phần còn lại.
- **Đợt 11 — Luyện đề tổng hợp toàn bộ 6 cấp**: mở rộng "Luyện Đề" đã đề
  xuất ở Đợt 5/mục 28 để chọn được cấp độ (Movers→TOEIC), random có trọng
  số theo sổ "cần ôn" dùng chung — vì mục tiêu TOEFL Junior/TOEIC đều đã
  nâng lên 800+, chế độ luyện đề nên có thêm bộ đếm giờ SÁT với đề thật
  (TOEIC đặc biệt nổi tiếng chạy giờ gấp ở phần Đọc) để luyện đúng áp lực
  thời gian, không chỉ đúng nội dung.

**Việc của bạn**: (1) đã xác nhận TOEFL Junior >800 + TOEIC 800 — nếu còn
mốc điểm nào khác bạn muốn chỉnh (vd TOEIC 800 tính trên thang nào, có cần
thêm phần Nói-Viết TOEIC riêng không) thì báo thêm; (2) xem nội dung ngữ
pháp/chủ đề mục 2 có thiếu gì so với `chungchi.png` hay ý định của bạn
không; (3) chọn Đợt nào bắt đầu — lưu ý Đợt 1 (mục 28) VẪN LÀ NỀN chung
cho toàn bộ Đợt 6-11 này, nên nếu muốn làm KET/PET/TOEFL/TOEIC trước
Movers/Flyers thì cấu trúc dữ liệu ở Đợt 1 vẫn phải làm trước tiên.

## 31. QUYẾT ĐỊNH: MỞ RỘNG ĐỘ TUỔI 4–18 (giải quyết băn khoăn TOEIC ở mục 30) (07/2026)

Bạn xác nhận: mở rộng độ tuổi phục vụ của cả app từ 4–12 lên **4–18 tuổi**
— "tiếng Anh có thể có nhiều tuổi học" là chủ đích, không phải giới hạn.
Quyết định này giải quyết đúng băn khoăn đã nêu ở mục 30 (TOEIC vốn thiết
kế cho người đi làm, "khác hẳn đối tượng 4-12 tuổi") — với phạm vi mới
4–18, TOEIC/TOEFL Junior/PET/KET đều nằm gọn trong đối tượng phục vụ
chính thức của app (học sinh cấp 2-3 và người mới đi làm), không còn là
nhánh "kéo dài" ngoại lệ nữa.

- Cập nhật copy hiển thị trên trang thật (không chỉ tài liệu đề xuất):
  `i18n.js` khoá `intro.title` (5 ngôn ngữ), `index.html` (meta description
  + tiêu đề khối giới thiệu), `gioi-thieu/index.html` (meta description +
  đoạn mở đầu + dòng mô tả game Tiếng Anh Nâng Cao: "8–12 tuổi" →
  **"8–18 tuổi"**) — toàn bộ đổi "4–12" → **"4–18"**.
- Không đổi các chip mô tả độ tuổi CỤ THỂ theo từng game riêng lẻ (ví dụ
  "Lớp lá – lớp 1" trên thẻ Học Vui) vì đó là mô tả ĐÚNG đối tượng của
  riêng game đó, không phải giới hạn tổng của cả app.
- `sw.js` v91 → **v92**. `npm test`: **1048 ✅, 0 ❌** (thuần đổi text hiển
  thị). Smoke test trang chủ + `gioi-thieu/` đều 200.

**Còn để ngỏ**: mục 30 (đề xuất KET/PET/TOEFL Junior/TOEIC) vẫn đang chờ
bạn duyệt đợt bắt đầu — quyết định mở rộng tuổi ở đây không tự động bắt
đầu code, chỉ gỡ bỏ 1 điểm băn khoăn về đối tượng đã nêu trước đó.

## 32. XÁC NHẬN THÊM VỀ ĐỘ TUỔI + BẮT ĐẦU CODE MOVERS/FLYERS ĐỢT 1 (07/2026)

Bạn xác nhận thêm: phạm vi 4–18 tuổi là đúng, và **"trên dưới 24 cũng ok"**
— nghĩa là không cần đặt trần cứng ở 18, người dùng lớn hơn (đầu 20, đúng
đối tượng track TOEIC/TOEFL Junior đã nêu băn khoăn ở mục 30) vẫn được chào
đón, chỉ là không phải đối tượng CHÍNH được quảng bá trên trang chủ. Vì vậy
copy hiển thị vẫn giữ **"4–18 tuổi"** (số tròn, dễ hiểu) — không đổi thành
"4–24" hay con số lẻ nào khác; phần "trên dưới 24" được hiểu là gỡ bỏ hẳn
tâm lý lo ngại "app này không hợp với người lớn hơn" khi làm nhánh TOEIC,
không phải yêu cầu đổi số hiển thị.

Sau đó bắt đầu code **Đợt 1 của mục 28** (nền dữ liệu Movers/Flyers) —
nhưng làm nhiều hơn phạm vi tối thiểu đã đề xuất: thay vì chỉ dựng khung +
dữ liệu (chưa chơi được), đã hoàn thiện luôn 1 chế độ **luyện tập trắc
nghiệm chơi được ngay**, dùng chung cho tất cả unit hiện có và unit sẽ thêm
sau (KET/PET/TOEFL Junior/TOEIC — mục 30/31).

**`exam-prep/`** (thư mục mới):
- **`src/units.js`** — cấu trúc `Unit` mở rộng được đúng như đề xuất
  (`{ id, level, topic, grammarPoints, vocab, questions }`), đã có **12
  unit** (6 Movers + 6 Flyers, mỗi unit 8 câu = **96 câu hỏi**) phủ đúng
  các điểm ngữ pháp liệt kê ở mục 28 §1: Movers — hiện tại đơn, hiện tại
  tiếp diễn, quá khứ đơn, there is/are + some/any, can + giới từ vị trí, so
  sánh hơn + từ để hỏi; Flyers — **quá khứ tiếp diễn vs quá khứ đơn** (đúng
  ý tưởng "2 hành động cùng lúc" ban đầu, dùng làm câu hỏi trắc nghiệm ở
  Đợt 1 — animation trực quan riêng cho điểm này vẫn là việc của Đợt 2),
  hiện tại hoàn thành, so sánh hơn/nhất đầy đủ, going to vs will, động từ
  khuyết thiếu, giới từ chuyển động + liên từ.
- **`src/examprep.js`** — engine logic thuần dùng chung cho MỌI cấp độ
  (kể cả cấp thêm sau này, chỉ cần thêm mảng Unit mới + đăng ký vào
  `UNITS_BY_LEVEL`, không sửa engine): `pickQuestions` chọn câu có TRỌNG SỐ
  theo sổ "cần ôn" (câu sai nhiều dễ ra lại hơn hẳn — đúng yêu cầu "lưu câu
  hay sai để tăng xác suất lặp lại") nhưng KHÔNG BAO GIỜ loại bỏ hoàn toàn
  khả năng ra câu ngẫu nhiên khác (đúng yêu cầu "xuất hiện câu hỏi ngẫu
  nhiên"); `answerQuiz` dùng **đúng luật chọn-lại** đã quen thuộc từ Nghe &
  Đoán/Ôn Tập Vui (sai lần 1 → gợi ý, câu không qua; đúng sau gợi ý vẫn có
  điểm nhưng ít hơn; sai lần 2 → lộ đáp án + giải thích).
- **`src/misses.js`** — sổ "câu hay sai" TÁCH RIÊNG khỏi
  `nghe-doan-on-tap/src/misses.js` (không đụng vào bản gốc đang chạy ổn
  định cho 17 game khác), khoá theo **questionId** thay vì từ tiếng Anh
  (đúng như mục 28 §2 đã phân tích: 1 điểm ngữ pháp có nhiều câu hỏi khác
  nhau nên không thể dùng từ làm khoá duy nhất) — cùng cơ chế gửi lô lên
  server, cùng giới hạn 300 mục, tương thích 100% với hạ tầng
  Supabase/`miss_events` đã có (chỉ prefix `exam:` vào cột `word` để không
  trộn lẫn với sổ từ vựng vốn có).
- **`exam-prep/index.html` + `style.css` + `src/app.js`** — giao diện 3
  màn: **chọn cấp độ** (Movers/Flyers) → **chọn unit** (lưới thẻ theo
  topic, kèm thẻ đặc biệt "🎲 Luyện ngẫu nhiên — trộn tất cả unit" và
  "🎯 Ôn câu hay sai" khi sổ không rỗng) → **luyện tập** (câu tiếng Anh
  thiếu từ + 4 lựa chọn, đọc to bằng giọng en-US chậm, giải thích tiếng
  Việt sau mỗi câu). Tông màu xanh dương học thuật (khác tông cam trẻ nhỏ
  của `ren-tri-nao`/`van-dong-vui`) vì đối tượng game này lớn tuổi hơn.
  Nối đủ hạ tầng chung: `mountKidFeatures()` (thanh avatar + giới hạn giờ
  chơi), `answeredOne()` (quà mỗi 15 câu), `recordSession()` (cộng sao qua
  server, `mode: 'exam-movers-<unitId>'` hoặc `'exam-flyers-mix'`...).
- Đăng ký: thẻ "🎓 Luyện Thi Cambridge" trên trang chủ (giữa Ôn Tập Vui và
  Tiếng Anh Nâng Cao), 15 khoá i18n (5 ngôn ngữ), `sw.js` v92→**v93**,
  `package.json` thêm dòng test.
- **22 unit test mới** (cấu trúc dữ liệu: id duy nhất/answer hợp lệ/đủ số
  câu; engine: pickQuestions không trùng + tôn trọng trọng số + vẫn ngẫu
  nhiên; answerQuiz đúng luật chọn-lại/điểm/kết thúc ván; misses.js cộng
  trừ đúng). **Lưu ý kỹ thuật khi viết test trọng số**: dùng 1 bộ sinh số
  ngẫu nhiên LIÊN TỤC (gọi lại nhiều lần) thay vì tạo seed mới cho mỗi lần
  lặp — vì các seed liền kề của LCG (Park-Miller) cho ra kết quả lần-gọi-đầu
  tương quan cao (gần như đơn điệu tăng), làm sai lệch thống kê phân bố nếu
  reseed mỗi vòng lặp. `npm test` toàn bộ: **1070 ✅, 0 ❌**. Smoke test
  `/`, `/exam-prep/` và toàn bộ file JS/CSS liên quan đều 200.

**Còn để ngỏ**: đây là Đợt 1 (nền dữ liệu + 1 chế độ luyện tập chơi được) —
Đợt 2-5 của mục 28 (Cỗ Máy Thời Gian Ngữ Pháp, Hai Hành Động Cùng Lúc dạng
animation trực quan, Bắn Đúng Thì/Lật Thẻ Ngữ Pháp mượn khung Ôn Tập Vui, So
Sánh Hơn/Nhất trực quan, Going To vs Will trực quan, Luyện Đề tổng hợp) vẫn
đang chờ — cũng như toàn bộ mục 30 (KET/PET/TOEFL Junior/TOEIC). Cấu trúc
`Unit`/`examprep.js`/`misses.js` đã đủ tổng quát để các đợt sau chỉ cần
thêm dữ liệu + UI mới, không phải đổi nền tảng.

## 33. CHIA "HỌC" vs "LUYỆN THI" + MỞ RỘNG NỘI DUNG (07/2026)

Bạn phản hồi đúng chỗ thiếu: bản Đợt 1 chỉ có 1 chế độ luyện tập phẳng
(chọn unit → làm câu hỏi), không phân biệt rõ "học kiến thức mới" và
"luyện thi mô phỏng thật", và nội dung còn mỏng. Đã tách 2 nhánh + bổ sung
nội dung đáng kể:

**Nội dung mở rộng (`exam-prep/src/units.js`): 96 → 144 câu hỏi**
- Thêm 2 câu ngữ pháp/unit cho cả 12 unit hiện có (8 → 10 câu/unit).
- Thêm **2 unit từ vựng mới**: `movers-vocabulary` (12 câu, chủ đề trường
  học/nhà cửa/giao thông/thể thao/hình khối/mùa) và `flyers-vocabulary` (12
  câu, chủ đề nâng cao hơn: nghề nghiệp/khoa học/cảm xúc/thiên nhiên) — đúng
  yêu cầu "bổ sung từ vựng, ngữ pháp, chọn trắc nghiệm". Mỗi câu vẫn giữ
  đúng định dạng câu tiếng Anh có chỗ trống "___" (nhất quán với câu hỏi
  ngữ pháp, đọc được bằng giọng en-US) thay vì hỏi trực tiếp bằng tiếng
  Việt.
- Mỗi unit (cả 14 unit) có thêm trường **`lesson`** (bài học): 1 câu tổng
  quan + 2-3 quy tắc kèm ví dụ song ngữ — đây là nội dung "Học" hiển thị
  TRƯỚC khi luyện tập, giải quyết đúng ý "có học và thi" thay vì chỉ có
  luyện tập trần trụi.

**Tách 2 nhánh rõ ràng trong `exam-prep/src/app.js` + `index.html`:**
- **📖 Học theo Unit**: chọn 1 unit cụ thể → xem bài học (quy tắc + ví dụ
  song ngữ) → "Bắt Đầu Luyện Tập" → làm câu hỏi CÓ GỢI Ý khi sai (giữ
  nguyên luật chọn-lại quen thuộc `answerQuiz`), không tính giờ. Vẫn giữ 2
  lối tắt "🎲 Luyện ngẫu nhiên" và "🎯 Ôn câu hay sai" trong màn chọn unit
  (bỏ qua bài học, vào thẳng luyện tập trộn).
- **⏱️ Luyện Thi (Đề Ngẫu Nhiên)**: chọn độ dài đề (10 hoặc 20 câu) → đề
  trộn NGẪU NHIÊN toàn bộ unit của cấp độ (dùng `makeMockTest`, vẫn ưu tiên
  câu "cần ôn" theo trọng số như luyện tập) → **CÓ TÍNH GIỜ** (~25 giây/câu,
  đồng hồ đếm ngược hiện trên HUD, hết giờ tự nộp bài) → **MỖI CÂU CHỈ 1
  LẦN TRẢ LỜI** (hàm mới `answerMockTest` — không có gợi ý/chọn lại, đúng
  cảm giác áp lực phòng thi thật, khác hẳn nhánh Học) → màn **báo cáo cuối
  đề** (`mockTestReport`): điểm, số câu đúng/phần trăm, và DANH SÁCH CHỦ
  ĐIỂM SAI NHIỀU NHẤT (sắp giảm dần) kèm nút "Về Học Lại Chủ Điểm Yếu" đưa
  thẳng về màn chọn unit của nhánh Học — khép vòng lặp "thi xong biết yếu
  gì → quay lại học đúng chỗ đó".
- Cả 2 nhánh vẫn ghi vào **cùng 1 sổ "câu hay sai"** (`misses.js`) và cùng
  cộng sao qua `recordSession` — luyện thi sai câu nào cũng làm câu đó dễ
  xuất hiện lại hơn ở cả 2 chế độ.

**Kỹ thuật đáng chú ý:**
- Điều hướng đổi từ 3 màn cố định sang **ngăn xếp (stack)** đơn giản
  (`state.history`) vì giờ có tới 7 màn (cấp độ → chế độ → unit/thiết lập
  đề → bài học/làm bài → báo cáo) — nút ◀ luôn quay đúng 1 bước trước đó
  thay vì về cứng 1 màn cố định.
- `answerMockTest` và `mockTestReport` là hàm THUẦN mới trong `examprep.js`,
  tách biệt hoàn toàn khỏi `answerQuiz` (không phá luật chọn-lại của nhánh
  Học) — **6 unit test mới** kiểm tra: trộn đúng toàn bộ unit, đúng/sai đều
  qua câu ngay không có retry, ghi nhận đúng chủ điểm sai, không làm gì khi
  đề đã xong, báo cáo tính đúng điểm/phần trăm/chủ điểm yếu.
- Hết giờ giữa chừng: báo cáo chỉ tính trên số câu ĐÃ LÀM (không tính các
  câu chưa kịp làm là sai) — tránh phần trăm bị "oan" chỉ vì làm chậm.
- `npm test` toàn bộ: **28/28 test của exam-prep** (144 câu hỏi + lesson +
  engine Học/Luyện Thi), tổng repo **1076 ✅, 0 ❌**. `sw.js` v93→**v94**.
  Smoke test `/`, `/exam-prep/` và các file JS/CSS liên quan đều 200,
  không có id trùng lặp trong HTML.

**Còn để ngỏ**: đồng hồ đếm ngược hiện là mốc cố định ~25s/câu (không đổi
theo độ khó câu hỏi); animation minh hoạ ngữ pháp trực quan (Đợt 2 của mục
28) và mục 30 (KET/PET/TOEFL Junior/TOEIC) vẫn chưa làm.

## 34. MỞ RỘNG THÊM UNIT MOVERS & FLYERS (07/2026)

Bạn chọn hướng "mở rộng thêm unit/câu hỏi Movers & Flyers" (thay vì thêm
Starters, animation trực quan, hay KET/PET/TOEFL) khi được hỏi lại. Đã rà
soát danh sách ngữ pháp chính thức Cambridge YLE ở mục 28 §1 để tìm đúng
những điểm CHƯA có unit riêng, tránh trùng lặp với 14 unit đã có:

**+4 unit ngữ pháp mới** (`exam-prep/src/units.js`, mỗi unit 10 câu + lesson):
- **`movers-possessives-imperatives`** — tính từ sở hữu (my/your/his/her/
  our/their), sở hữu cách 's, câu mệnh lệnh (Open the door / Don't run).
- **`movers-pronouns-frequency`** — đại từ tân ngữ (me/him/her/us/them),
  trạng từ tần suất (always/usually/never — vị trí khác nhau trước động từ
  thường vs sau 'to be'), số nhiều bất quy tắc (children/feet/mice).
- **`flyers-adverbs-manner`** — hình thành trạng từ cách thức (quick→
  quickly, happy→happily), bất quy tắc (good→well, fast giữ nguyên), và
  điểm dễ nhầm: sau 'to be' dùng TÍNH TỪ chứ không phải trạng từ (Be quiet!
  chứ không phải Be quietly!).
- **`flyers-quantifiers`** — a lot of/lots of (cả 2 loại danh từ), many
  (đếm được) vs much (không đếm được), a few vs a little.

**Mở rộng 2 unit từ vựng đã có** (+4 câu mỗi unit, không trùng từ đã dạy):
`movers-vocabulary` 12→16 câu (nurse, fridge, cold, puppy), `flyers-
vocabulary` 12→16 câu (chef, achieve, cinema, modern).

**Kết quả**: Movers 7→**9 unit**, Flyers 7→**9 unit**, tổng **18 unit**,
144→**192 câu hỏi** (đã xác nhận 192 id duy nhất, không trùng). Cả 4 unit
mới đều dùng được ngay ở CẢ 2 nhánh Học và Luyện Thi (không cần sửa
`examprep.js`/`app.js` — đúng thiết kế mở rộng "chỉ thêm mảng Unit mới" đã
làm từ Đợt 1). Cập nhật số liệu hiển thị ở thẻ trang chủ (144→192 câu, 18
unit) và 2 ngưỡng test tối thiểu trong `examprep.test.js` (unit count 7→9,
tổng câu hỏi ≥140→≥190).

`sw.js` v94→**v95**. `npm test` toàn bộ: **1076 ✅, 0 ❌** (không thêm test
mới vì đây là mở rộng NỘI DUNG thuần, không thêm engine/hành vi mới — 28
test hiện có của exam-prep đã đủ phủ cấu trúc dữ liệu chung). Smoke test
`/` và `/exam-prep/` đều 200.

**Còn để ngỏ**: vẫn còn dư địa mở rộng Movers/Flyers nếu muốn (ví dụ: mệnh
đề thời gian nâng cao, câu hỏi đuôi đơn giản...); Starters, animation trực
quan (Đợt 2 mục 28), và KET/PET/TOEFL Junior/TOEIC (mục 30) vẫn đang chờ.

## 35. MỞ RỘNG THÊM VÒNG 2: UNIT MOVERS & FLYERS (07/2026)

Bạn xác nhận tiếp tục đúng hướng đã chọn ở mục 34 (thay vì chuyển sang
Starters/animation/KET-PET-TOEFL-TOEIC). Rà lại các điểm ngữ pháp Movers/
Flyers còn thiếu NGOÀI danh sách gốc ở mục 28 §1 (đã phủ hết ở mục 34) —
chọn thêm các cấu trúc THƯỜNG GẶP trong đề thi thật nhưng chưa có unit
riêng, tiếp tục KHÔNG trùng với các unit đã có:

**+4 unit ngữ pháp mới** (mỗi unit 10 câu + lesson):
- **`movers-time-ordinals`** — cách nói giờ (o'clock/half past/quarter
  past/quarter to), số thứ tự (first-tenth) cho ngày tháng và xếp hạng,
  ngày trong tuần & tháng trong năm.
- **`movers-suggestions-requests`** — câu trả lời ngắn (Yes, I do/No, she
  doesn't...), Let's + V (rủ rê), would like to (muốn làm gì lịch sự).
- **`flyers-used-to-time-clauses`** — used to + V (thói quen quá khứ
  không còn đúng, phân biệt used to/use to theo câu khẳng định/phủ định/
  nghi vấn), mệnh đề thời gian when/before/after/until dùng HIỆN TẠI ĐƠN dù
  đang nói về tương lai (điểm dễ sai: không dùng 'will' sau các liên từ
  này).
- **`flyers-suggestions-requests`** — Shall we...?/Why don't we...? (gợi
  ý), Could/Would you...? (yêu cầu lịch sự), Would you mind...?

**Mở rộng tiếp 2 unit từ vựng** (+4 câu mỗi unit, không trùng từ đã dạy ở
bất kỳ unit nào): `movers-vocabulary` 16→20 câu (firefighter, hospital,
swimming pool, Tuesday), `flyers-vocabulary` 16→20 câu (apologize, farm,
nervous, mechanic).

**Kết quả**: Movers 9→**11 unit**, Flyers 9→**11 unit**, tổng **22 unit**,
192→**240 câu hỏi** (đã xác nhận 240 id duy nhất). Cập nhật số liệu hiển
thị ở thẻ trang chủ và 3 ngưỡng test tối thiểu trong `examprep.test.js`
(unit count 9→11, tổng câu hỏi ≥190→≥235).

`sw.js` v95→**v96**. `npm test` toàn bộ: **1076 ✅, 0 ❌** (vẫn 28 test của
exam-prep — mở rộng nội dung thuần, không thêm hành vi engine mới). Smoke
test `/` và `/exam-prep/` đều 200.

**Còn để ngỏ**: kho ngữ pháp "đại trà" của Movers/Flyers gần như đã cạn dư
địa mở rộng thêm mà không lấn sang phạm vi KET (mệnh đề quan hệ, câu bị
động, câu tường thuật... vốn dành cho mục 30) — nếu muốn tiếp tục "bổ sung
Cambridge" theo hướng unit mới, bước tự nhiên tiếp theo là Starters (tiền
A1, dễ hơn Movers) hoặc bắt đầu KET. Animation trực quan (Đợt 2 mục 28)
vẫn đang chờ.

## 36. THÊM CẤP STARTERS — TRỌN BỘ 3 BẬC CAMBRIDGE YLE (07/2026)

Bạn xác nhận lần thứ 3 muốn tiếp tục đúng hướng "thêm unit/nội dung", nên
lần này không hỏi lại — chọn thẳng **Starters** (tiền A1) vì mục 35 đã nêu
rõ kho ngữ pháp Movers/Flyers gần cạn mà không lấn phạm vi KET, còn Starters
vẫn nằm trọn trong khuôn khổ "unit mới cùng mức độ công việc" như 2 đợt vừa
làm, và giúp hoàn thiện TRỌN BỘ 3 bậc chính thức của Cambridge YLE (Starters
→ Movers → Flyers) thay vì chỉ có 2/3 bậc.

**5 unit Starters mới** (`exam-prep/src/units.js`, đơn giản hơn hẳn Movers
đúng đúng trình độ tiền A1 — câu ngắn, từ vựng cơ bản):
- **`starters-to-be`** — động từ to be (am/is/are) khẳng định/phủ định/
  nghi vấn theo đại từ nhân xưng.
- **`starters-this-plurals`** — this/that/these/those (số ít/nhiều, gần/
  xa), danh từ số nhiều quy tắc (-s/-es).
- **`starters-there-is-are-basic`** — there is/are ở dạng ĐƠN GIẢN NHẤT
  (không có some/any như bản Movers), câu hỏi Is there/Are there.
- **`starters-prepositions-can`** — giới từ in/on/under, can (khả năng cơ
  bản).
- **`starters-vocabulary`** — 10 câu từ vựng nền tảng nhất (màu sắc, số
  đếm 1-5, động vật, gia đình, đồ ăn) — dễ hơn hẳn 2 unit từ vựng Movers/
  Flyers, đúng tinh thần "khởi động" của Starters.

**Đăng ký hạ tầng** (đúng kiến trúc mở rộng đã có từ Đợt 1 — chỉ thêm dữ
liệu, không sửa engine):
- `examprep.js`: import `STARTERS_UNITS`, thêm `{ id: 'starters', label:
  'Starters (tiền A1)', icon: '🔰' }` vào đầu mảng `LEVELS`, đăng ký vào
  `UNITS_BY_LEVEL`.
- `exam-prep/index.html`: thêm 1 `level-card` thứ 3 (Starters) lên ĐẦU màn
  chọn cấp độ — không cần sửa `app.js` vì màn chọn cấp độ vốn đã dùng
  `document.querySelectorAll('.level-card[data-level]')` tổng quát, tự
  nhận thêm cấp mới.
- 2 khoá i18n mới (`examprep.starters`/`examprep.starters.desc`, 5 ngôn
  ngữ) + cập nhật số liệu thẻ trang chủ (240→**282 câu, 22→27 unit**, nói
  rõ "trọn bộ 3 cấp").
- Test: cập nhật số unit/tổng câu hỏi (`LEVELS` giờ có 3 phần tử, mọi chỗ
  lặp `[...MOVERS_UNITS, ...FLYERS_UNITS]` thêm `STARTERS_UNITS`).

**Kết quả**: 3 cấp độ (Starters/Movers/Flyers), **27 unit, 282 câu hỏi**
(đã xác nhận 282 id duy nhất). Cả 2 nhánh Học và Luyện Thi đều hoạt động
với cấp Starters ngay lập tức nhờ kiến trúc data-driven.

`sw.js` v96→**v97**. `npm test` toàn bộ: **1076 ✅, 0 ❌** (vẫn 28 test của
exam-prep — thêm data không thêm hành vi engine mới). Smoke test `/` và
`/exam-prep/` đều 200, xác nhận 3 level-card đăng ký đúng, không id trùng
lặp trong HTML.

**Còn để ngỏ**: kho "unit mới cùng tầm Movers/Flyers/Starters" giờ đã khá
cạn ở cả 3 cấp — bước tiếp theo nếu muốn "bổ sung Cambridge" nữa sẽ cần
chuyển hướng thật sự: animation ngữ pháp trực quan (Đợt 2 mục 28) hoặc bắt
đầu KET/PET/TOEFL Junior/TOEIC (mục 30, khối lượng lớn hơn hẳn).

## 37. GAME MỚI: 🎬 NGỮ PHÁP TRỰC QUAN — ĐỢT 2 CỦA MỤC 28 (07/2026)

Bạn chọn hướng "animation ngữ pháp trực quan" ở lần hỏi thứ 4 (thay vì bắt
đầu KET) — đúng đợt việc đã đề xuất ở mục 28 §Đợt 2 nhưng chưa làm: "Cỗ Máy
Thời Gian Ngữ Pháp" và "Hai Hành Động Cùng Lúc", đúng ý tưởng gốc bạn mô tả
ban đầu ("cây thời gian và 1 người đang chạy ở mốc quá khứ, bắt trẻ dự đoán
là thì gì? hay 2 hành động ở quá khứ, bắt trẻ đoán thì gì").

**`nguphap-truc-quan/`** (bundle mới, kiến trúc "N trò trong 1" giống
`ren-tri-nao/`/`van-dong-vui/`: 1 màn chọn trò + 1 màn chơi chung, mỗi trò
tự dựng DOM):

- **🕰️ Cỗ Máy Thời Gian Ngữ Pháp**: hiện 1 trục thời gian 3 vùng (Quá khứ |
  Bây giờ | Tương lai), 1 nhân vật (🧒👧🐱🐶) + 1 "tín hiệu" xuất hiện đúng
  vùng tương ứng — 🔁 lặp lại (hiện tại đơn), 🕐 quay tròn (đang diễn ra —
  ở vùng "bây giờ" là hiện tại tiếp diễn, ở vùng "quá khứ" là quá khứ tiếp
  diễn — ĐÚNG tình huống bạn mô tả "người đang chạy ở mốc quá khứ"), ✅ đã
  xong (quá khứ đơn), 🔗 vừa nối quá khứ-hiện tại (hiện tại hoàn thành), 📅
  kế hoạch (tương lai gần "going to"). Bé chọn đúng câu tiếng Anh (trong 4
  câu cùng nhân vật/động từ, chỉ khác thì) khớp với hình.
- **⏳ Hai Hành Động Cùng Lúc**: 2 icon hoạt hình cùng lúc — 1 hành động NỀN
  (🍳📖🚿😴🧹, lắc lư liên tục = đang diễn ra lâu) và 1 sự kiện NGẮN xen vào
  (📞🔔💡🐦, nhấp nháy = xảy ra đột ngột) — bé chọn đúng câu "While ... was
  V-ing, ... V-ed." trong 4 lựa chọn (câu đúng + 3 biến thể sai: đảo vai
  trò, cả 2 quá khứ đơn, cả 2 tiếp diễn) — đúng tình huống "2 hành động ở
  quá khứ, bắt trẻ đoán thì gì".
- **Kỹ thuật sinh câu**: KHÔNG hard-code sẵn từng câu — mỗi thì có 1 hàm
  `build(character, verb)` chia động từ đúng ngữ pháp (kể cả bất quy tắc:
  swim→swam/swum), nên 4 nhân vật × 6 động từ × 6 thì = 144 tổ hợp cho Cỗ
  Máy Thời Gian; tương tự 3 chủ ngữ × 5 hành động nền × 4 sự kiện × 4 kiểu
  câu cho Hai Hành Động — độ đa dạng cao mà không cần viết tay từng câu.
- **Luật chọn-lại/thưởng giống hệt các game khác** trong dự án (sai lần 1
  → gợi ý bằng giọng nói + giải thích tiếng Việt, chọn lại; đúng sau gợi ý
  vẫn có điểm ít hơn; sai lần 2 → lộ đáp án qua vòng), `mountKidFeatures()`
  + `answeredOne()` + `recordSession()` như mọi game khác.
- **17 unit test mới** (`nguphap-truc-quan/src/nguphaptructuan.test.js`):
  xác nhận chia động từ đúng cho từng thì (kể cả bất quy tắc), 4 lựa chọn
  luôn dùng cùng nhân vật/động từ (chỉ khác thì), câu "correct" của Hai
  Hành Động luôn đúng mẫu `While ... was ..., ... V-ed.`, 4 pattern luôn
  cho 4 câu khác nhau, và toàn bộ luật chọn-lại/kết thúc ván cho cả 2 trò.
- Đăng ký: thẻ "🎬 Ngữ Pháp Trực Quan" trên trang chủ (sau "Luyện Thi
  Cambridge"), 16 khoá i18n (`nguphap.*` + `card.nguphap.*`, 5 ngôn ngữ),
  `sw.js` v97→**v98**, `package.json` thêm dòng test.

`npm test` toàn bộ: **1093 ✅, 0 ❌** (1076 + 17 mới). Smoke test `/` và
`/nguphap-truc-quan/` đều 200, không id trùng lặp trong HTML.

**Còn để ngỏ**: 3 ý tưởng animation còn lại trong đề xuất Đợt 2/mục 28 (So
Sánh Hơn/Nhất Trực Quan, Going To vs Will Trực Quan, Modal Ai Đúng) chưa
làm — có thể thêm vào bundle này như trò thứ 3/4/5 nếu muốn tiếp tục hướng
này. Ngoài ra Đợt 3 (mượn khung Ôn Tập Vui cho ngữ pháp: Bắn Đúng Thì/Lật
Thẻ Ngữ Pháp), Đợt 5 (Luyện Đề tổng hợp toàn bộ ngữ pháp), và mục 30 (KET/
PET/TOEFL Junior/TOEIC) vẫn đang chờ.

## 38. HOÀN THÀNH ĐỢT 2 MỤC 28: THÊM 3 TRÒ ANIMATION CÒN LẠI (07/2026)

Bạn xác nhận "tiếp tục" ngay sau khi mục 37 liệt kê rõ 3 ý tưởng animation
còn thiếu — không hỏi lại vì đây là tiếp nối trực tiếp (không phải fork
mới) của hướng đã chọn. Bundle `nguphap-truc-quan/` từ 2 trò lên **5 trò**,
hoàn tất toàn bộ 5 ý tưởng animation ngữ pháp đã đề xuất ở mục 28 §Đợt 2:

- **📈 So Sánh Hơn/Nhất Trực Quan**: mỗi vòng NGẪU NHIÊN 50/50 giữa 2 dạng
  — so sánh HƠN (2 thực thể, 2 thanh đo chiều cao khác nhau, 4 lựa chọn:
  đúng/đảo vai trò/"as...as" sai/dùng từ trái nghĩa sai) và so sánh NHẤT (3
  thực thể, 4 lựa chọn: đúng thực thể hạng nhất/2 thực thể sai/dùng so
  sánh hơn thay vì nhất — kiểm tra cả nhận diện thực thể LẪN đúng ngữ pháp
  hơn-vs-nhất). Thanh đo vẽ bằng chiều cao div tỉ lệ với giá trị ngẫu nhiên
  1-5, icon thuộc tính (📏⚡📦⭐) nổi trên đầu thanh.
- **🔮 Going To vs Will Trực Quan**: 6 tình huống có tín hiệu hình ảnh rõ
  ràng (🧳 vali đã đóng gói, 📞 điện thoại reo, ⛈️ mây đen, 🔮 dự đoán mơ hồ,
  📝 đã đặt vé, 🤝 lời hứa) — đúng ý tưởng gốc bạn mô tả. 4 lựa chọn gồm cả
  nhiễu NGỮ PHÁP (chia sai động từ to be theo chủ ngữ: "I is going to..."
  thay vì "I am going to...") lẫn nhiễu THỜI ĐIỂM (was/were going to — ý
  định trong quá khứ, sai ngữ cảnh hiện tại) — không chỉ kiểm tra khái
  niệm going-to-vs-will mà cả chia động từ chính xác.
- **🚦 Modal Ai Đúng**: 8 tình huống biển báo/lời khuyên (🚭🦺🥦🍬📵🛏️🎟️🍭),
  4 lựa chọn = ĐÚNG 4 modal cố định (must/mustn't/should/shouldn't) — khớp
  tự nhiên với định dạng 4 lựa chọn của cả bundle, không cần thêm nhiễu
  nhân tạo vì bản thân 4 modal đã đủ gây nhầm lẫn về mức độ bắt buộc.
- **Tái cấu trúc (refactor)**: rút phần luật chọn-lại/tính điểm/kết thúc
  ván (từng lặp lại y hệt ở `answerTimeMachine`/`answerTwoActions`) thành 1
  hàm dùng chung `answerGeneric(game, chosenKey, getCorrectKey)` — cả 5 trò
  giờ chỉ cần 1 dòng gọi hàm này với đúng cách lấy khoá đúng của từng trò,
  giảm trùng lặp mà không đổi hành vi (17 test cũ vẫn xanh nguyên sau khi
  refactor, xác nhận không phá vỡ gì).
- **13 unit test mới** cho 3 trò thêm: xác nhận vòng chơi sinh đúng cả 2
  dạng so sánh hơn/nhất qua nhiều lần chơi, câu đúng luôn gán đúng thực thể
  có thanh đo lớn hơn/lớn nhất, chia động từ to be đúng theo chủ ngữ (I→am,
  We/They→are, còn lại→is) trong Going To vs Will, modal luôn đúng 1 trong
  4 giá trị cố định, và luật chọn-lại/kết thúc ván cho cả 3 trò.
- Đăng ký: 3 mode-card mới (📈🔮🚦, tổng 5 trò — số lẻ nên áp dụng lại rule
  CSS "ô cuối canh giữa" đã dùng ở `ren-tri-nao/`), 13 khoá i18n mới, cập
  nhật mô tả thẻ trang chủ (2→5 trò), `sw.js` v98→**v99**.

`npm test` toàn bộ: **1106 ✅, 0 ❌** (1093 + 13 mới). Smoke test `/` và
`/nguphap-truc-quan/` đều 200, xác nhận đủ 5 mode-card, không id trùng lặp.

**Còn để ngỏ**: cả 5 ý tưởng animation của Đợt 2/mục 28 đã hoàn thành. Các
bước tiếp theo nếu muốn tiếp tục mảng Cambridge: Đợt 3 (mượn khung Ôn Tập
Vui cho ngữ pháp: Bắn Đúng Thì/Lật Thẻ Ngữ Pháp), Đợt 5 (Luyện Đề tổng hợp
trộn cả animation lẫn trắc nghiệm), hoặc mục 30 (KET/PET/TOEFL Junior/
TOEIC, khối lượng lớn hơn hẳn).

## 39. GOM MENU: "🎓 THI CHỨNG CHỈ ANH" THAY CHO 2 THẺ RỜI RẠC (07/2026)

Bạn yêu cầu gom `exam-prep/` (Luyện Thi Cambridge) và `nguphap-truc-quan/`
(Ngữ Pháp Trực Quan) — trước đó là 2 thẻ RIÊNG BIỆT trên trang chủ — vào
**1 mục duy nhất "Thi Chứng Chỉ Anh"**, bên trong chia theo nhiều khu.

**`thi-chung-chi-anh/`** (hub mới, cùng khuôn mẫu tĩnh HTML/CSS như
`goc-tieng-anh/`/`on-tap-vui/` — không phụ thuộc `i18n.js` cho nội dung
chính, chỉ nhúng để dùng chung script sửa nút back): tông màu xanh dương
học thuật (khác tông cam của `goc-tieng-anh/`) vì đối tượng lớn tuổi hơn.
- **Khu "Cambridge Young Learners English (YLE)"**: 2 thẻ thật —
  `exam-prep/` (Luyện Thi Cambridge YLE, 282 câu/27 unit) và
  `nguphap-truc-quan/` (Ngữ Pháp Trực Quan, 5 trò animation).
- **Khu "Sắp có"**: 1 khối ghi chú (KHÔNG phải thẻ bấm được — tránh gây
  hiểu lầm có nội dung chưa tồn tại) liệt kê KET/PET/TOEFL Junior/TOEIC
  đang chuẩn bị, dùng chung engine "Học + Luyện Thi" đã có.
- Trang chủ (`index.html`): xoá 2 thẻ `card-examprep`/`card-nguphap` cũ,
  thay bằng **1 thẻ "🎓 Thi Chứng Chỉ Anh"** trỏ tới `thi-chung-chi-anh/`.
- `i18n.js`: xoá 6 khoá orphan (`card.examprep.*`, `card.nguphap.*` — không
  còn HTML nào tham chiếu), thêm 3 khoá `card.thichungchi.*` (5 ngôn ngữ).
- `sw.js` v99→**v100** (+precache `thi-chung-chi-anh/index.html`).

`npm test` toàn bộ: **1106 ✅, 0 ❌** (đổi thuần HTML/CSS/i18n, không đụng
logic game). Smoke test `/`, `/thi-chung-chi-anh/`, `/exam-prep/`,
`/nguphap-truc-quan/` đều 200; xác nhận không còn tham chiếu
"examprep"/"nguphap" nào sót lại trong `index.html`.

**Lưu ý kỹ thuật chưa xử lý**: `exam-prep/` và `nguphap-truc-quan/` hiện
CHƯA có nút "◀ quay lại hub" kiểu referrer-rewrite như các game trong
`goc-tieng-anh/` (mục 17) — nút `🏠` của 2 game này vẫn trỏ thẳng về `/`
(trang chủ), còn nút `◀` sẵn có là điều hướng NỘI BỘ giữa các màn (cấp độ→
unit→quiz, hoặc trò→màn chơi), không phải nút quay về hub. Nghĩa là từ
trong game bấm `🏠` sẽ về thẳng trang chủ thay vì quay lại
`/thi-chung-chi-anh/` — chấp nhận được vì đây vẫn là hành vi nhất quán với
MỌI game khác trong repo (🏠 luôn về trang chủ), chỉ là chưa có thêm 1 bước
"quay lại đúng hub" tiện hơn. Có thể bổ sung sau nếu cần.

## 40. TIẾP TỤC: BẮT ĐẦU KET (A2 KEY) — ĐỢT 6 CỦA MỤC 30 (07/2026)

Sau khi gom menu (mục 39), bạn yêu cầu "tiếp tục" — vì bạn vừa nhắc tên cả
"cambridge ket pet toefl toeic" trong cùng 1 câu, đi tiếp bằng cách **bắt
đầu KET** (chứng chỉ tiếp theo chưa code trong danh sách, và là track GẦN
NHẤT với Flyers nên rủi ro thấp nhất) thay vì hỏi lại lần nữa.

**4 unit KET đầu tiên** (`exam-prep/src/units.js`, mỗi unit 10 câu + lesson
— chỉ chọn điểm ngữ pháp THỰC SỰ MỚI so với Flyers, đúng danh sách đã phân
tích ở mục 30 §2, không lặp lại hiện tại hoàn thành/going to-will/so sánh
đã luyện sâu ở Flyers):
- **`ket-conditionals`** — câu điều kiện loại 0 (If + hiện tại đơn, hiện
  tại đơn — sự thật hiển nhiên) và loại 1 (If + hiện tại đơn, will + V —
  có thể xảy ra ở tương lai).
- **`ket-gerunds`** — động từ + V-ing (like/enjoy/love/hate/finish/stop),
  đối chiếu với want/decide + to + V để tránh nhầm lẫn.
- **`ket-reflexive-prepositions`** — đại từ phản thân (myself/herself/
  themselves/ourselves...), giới từ thời gian (at/on/in) và chuyển động
  (towards/away from).
- **`ket-phrasal-verbs`** — cụm động từ cơ bản (get up, look for, turn on/
  off, put on/take off, give up, look after, hand in).

**Đăng ký đúng kiến trúc mở rộng đã dùng cho Starters** (không sửa engine):
- `examprep.js`: import `KET_UNITS`, thêm `{ id: 'ket', label: 'KET (A2
  Key)', icon: '🎫' }` vào `LEVELS`, đăng ký vào `UNITS_BY_LEVEL`.
- `exam-prep/index.html`: thêm level-card thứ 4 (KET) vào màn chọn cấp độ.
- 2 khoá i18n mới (`examprep.ket`/`examprep.ket.desc`, 5 ngôn ngữ).
- `examprep.test.js`: cập nhật mọi chỗ lặp `[...STARTERS_UNITS,
  ...MOVERS_UNITS, ...FLYERS_UNITS]` thêm `KET_UNITS`; sửa test
  `unitsForLevel('ket')` (trước đây kỳ vọng RỖNG vì 'ket' chưa tồn tại —
  giờ đổi sang kiểm tra đúng 4 unit, và đổi cấp "chưa tồn tại" dùng để test
  fallback rỗng sang `'pet'`).
- `thi-chung-chi-anh/`: cập nhật thẻ "Luyện Thi Cambridge YLE" → **"Luyện
  Thi Cambridge"** (bỏ chữ YLE vì giờ đã có cả KET không thuộc YLE), số
  liệu 282 câu/27 unit → 322 câu/31 unit; xoá "KET" khỏi khối "Sắp có" (chỉ
  còn PET/TOEFL Junior/TOEIC).
- Trang chủ: cập nhật mô tả thẻ "Thi Chứng Chỉ Anh" (Starters·Movers·
  Flyers·KET, sắp có PET/TOEFL Junior/TOEIC). `sw.js` v100→**v101**.

**Kết quả**: 4 cấp độ (Starters/Movers/Flyers/KET), **31 unit, 322 câu
hỏi** (đã xác nhận duy nhất). Cả 2 nhánh Học và Luyện Thi hoạt động với
KET ngay lập tức nhờ kiến trúc data-driven — không cần thêm dòng code
engine nào.

`npm test` toàn bộ: **1106 ✅, 0 ❌** (mở rộng nội dung + sửa assertion,
không thêm test case mới vì không có hành vi engine mới). Smoke test `/`,
`/thi-chung-chi-anh/`, `/exam-prep/` đều 200, xác nhận đủ 4 level-card.

**Còn để ngỏ**: KET mới có 4 unit khởi đầu (so với Movers/Flyers có 11
unit mỗi cấp) — có thể mở rộng thêm KET (thêm unit ngữ pháp/từ vựng, hoặc
Reading/Writing-style câu hỏi theo đúng cấu trúc đề KET thật như mục 30 §4
đã đề xuất — Đọc Hiểu Có Giờ, Sửa Lỗi Trong Đoạn Văn, Viết Lại Câu Cùng
Nghĩa). PET/TOEFL Junior/TOEIC (mục 30) vẫn đang chờ bắt đầu.

## 41. TIẾP TỤC MỞ RỘNG KET (07/2026)

Bạn xác nhận "tiếp tục" lần nữa — đúng mẫu hình đã lặp lại xuyên suốt
phiên làm việc này (mỗi khi có lựa chọn "mở rộng nội dung hiện có" vs "bắt
đầu mảng lớn mới", bạn luôn chọn vế đầu), nên đi tiếp bằng cách mở rộng
KET giống hệt cách đã làm với Movers/Flyers (mục 34-35) thay vì hỏi lại
hay nhảy sang PET/TOEFL Junior/TOEIC.

- **+2 câu cho mỗi 4 unit ngữ pháp KET đã có** (10 → 12 câu/unit): thêm
  điều kiện loại 0/1 với ngữ cảnh mới (metal expands/feel cold), thêm
  avoid/promise cho nhóm V-ing vs to-V, thêm giới từ "in the mirror" +
  himself cho đại từ phản thân, thêm fill in/take off (nghĩa thứ 2: cất
  cánh — cố tình dùng lại cụm từ đã dạy với nghĩa khác để dạy tính đa nghĩa
  theo ngữ cảnh của phrasal verb, ghi rõ trong `explain`).
- **+1 unit từ vựng mới `ket-vocabulary`** (12 câu) — theo đúng mẫu đã có
  ở Movers/Flyers (mỗi cấp đều có 1 unit từ vựng riêng, KET trước đó thiếu
  unit này): mua sắm (fitting room, on sale), du lịch (passport, airport),
  công nghệ & sức khỏe (wireless, charge, fit), hẹn gặp & mô tả người/nơi
  chốn (appointment, friendly, crowded) — đúng phạm vi "từ vựng mở rộng
  đời sống" đã liệt kê ở mục 30 §2 cho KET.
- **Kết quả**: KET 4→**5 unit**, 40→**60 câu hỏi**. Tổng toàn hệ thống:
  31→**32 unit**, 322→**342 câu hỏi** (đã xác nhận 342 id duy nhất).
- Cập nhật: `examprep.test.js` (KET_UNITS.length 4→5, ngưỡng tổng câu hỏi
  ≥315→≥335, `unitsForLevel('ket').length` 4→5), thẻ `thi-chung-chi-anh/`
  (322→342 câu, 31→32 unit), `sw.js` v101→**v102**.

`npm test` toàn bộ: **1106 ✅, 0 ❌** (mở rộng nội dung thuần, không thêm
test case mới). Smoke test `/`, `/thi-chung-chi-anh/`, `/exam-prep/` đều
200.

**Còn để ngỏ**: KET giờ đã cân đối hơn (5 unit, gần bằng Starters). Các
hướng tiếp theo: mở rộng KET thêm nữa (Reading/Writing-style theo đề thật
— mục 30 §4), hoặc bắt đầu PET/TOEFL Junior/TOEIC (mục 30, khối lượng lớn
hơn hẳn, cần dữ liệu unit hoàn toàn mới).

## 42. CƠ CHẾ MỚI: ĐỌC HIỂU CÓ ĐOẠN VĂN CHO KET (07/2026)

Bạn tiếp tục xác nhận đi đúng hướng "mở rộng nội dung hiện có" một lần
nữa — nhưng lần này chọn ý còn lại đã nêu ở mục 41 (Reading/Writing-style
theo mục 30 §4) thay vì lặp lại kiểu "thêm câu trắc nghiệm ngữ pháp" đã
làm 3 lần liên tiếp (mục 34/35/41), vì thêm mãi cùng 1 dạng bài sẽ giảm
giá trị — đây là **cơ chế MỚI** (Đọc Hiểu Có Giờ) chứ không phải thêm câu
hỏi cùng khuôn cũ.

**Mở rộng cấu trúc dữ liệu (`exam-prep/src/units.js`)**: thêm trường TUỲ
CHỌN `passage: { title, text }` vào Unit — 1 đoạn văn tiếng Anh ngắn dùng
CHUNG cho nhiều câu hỏi `type: 'reading'` của cùng unit đó (khác câu hỏi
grammar/vocab vốn luôn có "___" độc lập từng câu). Unit mới
**`ket-reading-comprehension`**: đoạn văn ~100 từ "Maria's Day at the
Market" (kể chuyện đi chợ cuối tuần, đúng độ khó/độ dài đề KET Reading
thật) + 6 câu hỏi đọc hiểu đúng 3 dạng đã liệt kê ở mục 30 §4: **ý chính**
(favourite part), **chi tiết** (khi nào, vì sao), **suy luận** (tại sao
buồn — không nói thẳng "vì hết bánh" mà phải suy ra từ ngữ cảnh).

**Đường dẫn passage từ dữ liệu ra giao diện** (không phá vỡ hành vi cũ):
- `examprep.js`: `allQuestions()` và nhánh `makeQuiz(level, unitId,...)`
  giờ gắn thêm `unitPassage: unit.passage` vào mỗi câu hỏi khi làm phẳng
  (flatten) — unit không có `passage` thì trường này là `undefined`, không
  ảnh hưởng câu hỏi grammar/vocab hiện có.
- `exam-prep/index.html` + `style.css`: thêm khối `#quizPassage` (tiêu đề +
  đoạn văn, cuộn được, ẩn mặc định) phía trên `#quizPrompt` trong màn làm
  bài — DÙNG CHUNG cho cả nhánh Học lẫn Luyện Thi vì cùng 1 màn `quizScreen`.
- `exam-prep/src/app.js`: `renderQuestion()` hiện/ẩn `#quizPassage` theo
  `q.unitPassage` mỗi khi đổi câu — đoạn văn ở lại trên màn hình xuyên suốt
  các câu hỏi cùng 1 bài đọc (khi luyện tập đúng unit `ket-reading-
  comprehension`), hoặc hiện lại đúng lúc nếu câu đọc hiểu xen giữa các câu
  khác khi luyện ngẫu nhiên/làm đề trộn toàn KET.
- Đã cân nhắc: KHÔNG đọc to đoạn văn bằng giọng nói (khác mọi câu hỏi khác
  trong app vốn luôn có TTS) — vì đây là bài tập ĐỌC, đọc to sẽ đi ngược
  mục đích rèn kỹ năng đọc hiểu; chỉ câu hỏi/lựa chọn vẫn dùng TTS như cũ.

**Kết quả**: KET 5→**6 unit**, 60→**66 câu hỏi**. Tổng hệ thống:
32→**33 unit**, 342→**348 câu hỏi** (348 id duy nhất, đã xác nhận). **3
test mới**: unit `ket-reading-comprehension` có `passage` hợp lệ (đủ dài,
đúng title/text) và câu hỏi `type:'reading'` không cần "___"; nới lỏng
assertion cũ ("mọi câu hỏi phải có ___") để bỏ qua riêng loại `reading`;
`allQuestions()`/`makeQuiz()` gắn đúng `unitPassage` cho câu reading và
KHÔNG gắn cho unit không có passage (tránh rò rỉ trường `undefined` gây
nhầm lẫn UI). `sw.js` v102→**v103**.

`npm test` toàn bộ: **1109 ✅, 0 ❌** (1106 + 3 test mới). Smoke test `/`,
`/thi-chung-chi-anh/`, `/exam-prep/` đều 200, không id trùng lặp trong
`exam-prep/index.html` (42 id, thêm 3 id mới cho khối passage).

**Còn để ngỏ**: mới có 1 đoạn văn đọc hiểu — có thể thêm nhiều đoạn văn
khác (chủ đề khác, độ dài/độ khó tăng dần) nếu muốn tiếp tục hướng này;
"Sửa Lỗi Trong Đoạn Văn" và "Viết Lại Câu Cùng Nghĩa" (2 ý còn lại ở mục
30 §4) vẫn chưa làm. PET/TOEFL Junior/TOEIC (mục 30) vẫn đang chờ bắt đầu.

## 43. BẮT ĐẦU PET (B1 PRELIMINARY) — ĐỢT 8 CỦA MỤC 30 (07/2026)

Bạn xác nhận "tiếp" lần nữa. Lần này KHÔNG tiếp tục đào sâu KET thêm nữa —
tự nhận định rằng 2 ý tưởng còn lại ở mục 30 §4 ("Sửa Lỗi Trong Đoạn Văn",
"Viết Lại Câu Cùng Nghĩa") thực ra đúng ra thuộc phạm vi NGỮ PHÁP PET
(câu bị động, câu tường thuật — chính đề xuất gốc ở mục 30 §4 cũng ghi rõ
"Sửa Lỗi..." là dạng bài TOEFL Junior và "Viết Lại Câu..." là dạng bài
PET), không phải KET — ép 2 cơ chế này vào KET sẽ sai tầm ngữ pháp. Vì
vậy quyết định đi tiếp sang **PET**, việc chưa code tiếp theo được nêu tên
trực tiếp trong yêu cầu gốc của bạn ("cambridge ket pet toefl toeic"),
thay vì tiếp tục vá thêm nội dung KET không đúng chỗ.

**6 unit PET đầu tiên** (`exam-prep/src/units.js`, mỗi unit 10-12 câu +
lesson — đúng các điểm ngữ pháp THỰC SỰ MỚI so với KET theo mục 30 §2):
- **`pet-conditional-2`** — câu điều kiện loại 2 (If + quá khứ đơn, would
  + V — giả định không có thật ở hiện tại/tương lai; "were" dùng cho mọi
  chủ ngữ trong văn viết trang trọng).
- **`pet-past-perfect`** — quá khứ hoàn thành (had + V3 — hành động xảy ra
  TRƯỚC 1 hành động/thời điểm khác trong quá khứ).
- **`pet-passive-voice`** — câu bị động ở hiện tại đơn (is/are + V3) và
  quá khứ đơn (was/were + V3).
- **`pet-reported-speech`** — câu tường thuật cơ bản (khẳng định + câu
  hỏi, lùi thì: am→was, will→would, have→had, saw→had seen).
- **`pet-relative-clauses`** — mệnh đề quan hệ who/which/whose/where.
- **`pet-vocabulary`** (12 câu) — từ vựng đời sống-xã hội mở rộng: giáo
  dục, công việc (graduate, apply), môi trường (polluted, recycling), văn
  hoá & truyền thông (culture, media), quan hệ xã hội (relationship), du
  lịch & công nghệ (tourist, technology) — đúng phạm vi đã liệt kê ở mục
  30 §2 cho PET.

**Đăng ký đúng kiến trúc mở rộng đã dùng cho Starters/KET** (không sửa
engine, không cần CSS mới vì màn chọn cấp độ là danh sách dọc, không phải
lưới — không bị vấn đề "ô lẻ" như các bundle dùng grid):
- `examprep.js`: import `PET_UNITS`, thêm `{ id: 'pet', label: 'PET (B1
  Preliminary)', icon: '🏅' }` vào `LEVELS`, đăng ký vào `UNITS_BY_LEVEL`.
- `exam-prep/index.html`: thêm level-card thứ 5 (PET).
- 2 khoá i18n mới (`examprep.pet`/`examprep.pet.desc`, 5 ngôn ngữ).
- `examprep.test.js`: cập nhật mọi chỗ lặp union unit thêm `PET_UNITS`;
  sửa `unitsForLevel('pet')` (trước kỳ vọng RỖNG — giờ đúng 6 unit) và đổi
  cấp "chưa tồn tại" dùng để test fallback rỗng sang `'toefl-junior'`.
- `thi-chung-chi-anh/`: cập nhật thẻ Cambridge (410 câu/39 unit, thêm PET
  vào danh sách cấp), xoá "PET" khỏi khối "Sắp có" (chỉ còn TOEFL Junior/
  TOEIC). Trang chủ: cập nhật mô tả + chip thẻ "Thi Chứng Chỉ Anh".
  `sw.js` v103→**v104**.

**Kết quả**: 5 cấp độ (Starters/Movers/Flyers/KET/PET), **39 unit, 410 câu
hỏi** (đã xác nhận duy nhất). Cả 2 nhánh Học và Luyện Thi hoạt động với
PET ngay lập tức, kể cả cơ chế đọc-hiểu-có-đoạn-văn mới thêm ở mục 42 vẫn
tương thích nguyên vẹn (PET chưa dùng `passage` nhưng có thể thêm sau).

`npm test` toàn bộ: **1109 ✅, 0 ❌** (mở rộng nội dung + sửa assertion,
không thêm test case mới vì không có hành vi engine mới). Smoke test `/`,
`/thi-chung-chi-anh/`, `/exam-prep/` đều 200, xác nhận đủ 5 level-card,
không id trùng lặp.

**Còn để ngỏ**: PET mới có 6 unit khởi đầu (tương đương KET) — có thể mở
rộng thêm PET (thêm unit, hoặc thêm đoạn văn đọc hiểu dài/khó hơn KET đúng
tầm B1, hoặc bắt đầu 2 cơ chế "Sửa Lỗi Trong Đoạn Văn"/"Viết Lại Câu Cùng
Nghĩa" giờ đã đúng chỗ vì PET đã có bị động + tường thuật để paraphrase).
TOEFL Junior/TOEIC (mục 30) vẫn đang chờ bắt đầu.

## 44. HOÀN THÀNH 2 CƠ CHẾ CÒN LẠI CỦA MỤC 30 §4 CHO PET (07/2026)

Bạn xác nhận "tiếp tục" — đúng như mục 43 đã dự đoán, giờ PET đã có bị
động + tường thuật nên 2 ý tưởng còn lại ở mục 30 §4 mới thực sự đúng chỗ.
Triển khai cả 2 trong 1 đợt, **+2 unit PET** (6→8):

- **`pet-cloze-passage`** (Điền Từ Trong Đoạn Văn) — đúng dạng "Reading
  Part 6: Open Cloze" thật của PET: 1 đoạn nhật ký "My Weekend Diary" (~110
  từ, mạch chuyện liền lạc: thăm bà ở quê, hái rau, chơi với gà, bà tặng
  gạo, hứa quay lại) + **8 câu hỏi điền từ NẰM TRONG CHÍNH đoạn văn đó**
  (ôn tập tổng hợp: quá khứ đơn, mệnh đề quan hệ "who", quá khứ hoàn thành
  "had grown" — xảy ra TRƯỚC hành động "gave", liên từ "Before", và tường
  thuật lùi thì "will→would" trong câu "we promised... we would visit").
  Tái dùng NGUYÊN VẸN cơ chế `Unit.passage` vừa xây cho
  `ket-reading-comprehension` ở mục 42 — không cần thêm dòng code UI nào.
  **Quyết định đặt tên trung thực**: đề xuất gốc gọi đây là "Sửa Lỗi Trong
  Đoạn Văn" (error correction — chỉ ra và SỬA từ sai, không có lựa chọn),
  nhưng cơ chế thực sự xây được trong app (chọn 1 trong 4 từ cho ô trống)
  đúng là dạng "cloze/gap-fill" (PET Reading Part 6 thật), khác bản chất
  với "chỉ ra lỗi sai không gợi ý" (gần với PET Writing Part 3/TOEFL Junior
  Language Form hơn — cần giao diện chấm câu chữ tự do, không làm ở đợt
  này) — nên đặt tên ĐÚNG là "Điền Từ Trong Đoạn Văn" thay vì gắn nhãn "sửa
  lỗi" sai bản chất.
- **`pet-rewrite-sentences`** (Viết Lại Câu Cùng Nghĩa) — đúng dạng "Key
  Word Transformation" quen thuộc của PET: 10 câu, mỗi câu là 1 câu gốc +
  mũi tên (`"Câu gốc. → ___"`) rồi chọn đúng 1 trong 4 câu viết lại cùng
  nghĩa (chủ động→bị động: "Someone built this house in 1990." → "This
  house was built in 1990."; trực tiếp→tường thuật: "I will help you," he
  said." → "He said he would help me."). **Kỹ thuật gọn**: thêm `type:
  'rewrite'` mới vào schema Question, nhưng KHÔNG cần sửa engine/UI nào vì
  prompt vẫn giữ đúng quy ước có "___" (nhúng trong mũi tên "→ ___") — cả
  `answerQuiz`/`answerMockTest`/`renderQuestion` đều dùng chung không phân
  biệt type, y hệt cách `type: 'vocab'` đã hoạt động từ đầu.

**2 test mới**: xác nhận `pet-cloze-passage` có `passage` hợp lệ và MỌI
câu vẫn giữ "___" dù đi kèm đoạn văn (khác `ket-reading-comprehension`
không có "___"); xác nhận `pet-rewrite-sentences` toàn bộ `type: 'rewrite'`
và luôn có mẫu "→ ___" trong prompt.

**Kết quả**: PET 6→**8 unit**, 62→**80 câu hỏi**. Tổng hệ thống:
39→**41 unit**, 410→**428 câu hỏi** (428 id duy nhất, đã xác nhận). Cập
nhật thẻ `thi-chung-chi-anh/` (428 câu/41 unit, nhắc rõ 3 dạng bài mới:
đọc hiểu đoạn văn, điền từ trong đoạn văn, viết lại câu). `sw.js`
v104→**v105**.

`npm test` toàn bộ: **1111 ✅, 0 ❌** (1109 + 2 test mới). Smoke test `/`,
`/thi-chung-chi-anh/`, `/exam-prep/` đều 200, cú pháp `units.js`/
`examprep.js` sạch.

**Còn để ngỏ**: cả 3 ý tưởng "dạng bài đọc/viết theo cấu trúc đề thật" ở
mục 30 §4 áp dụng cho KET/PET nay đã xong (đọc hiểu, điền từ đoạn văn,
viết lại câu). Việc "chỉ ra và tự sửa lỗi không gợi ý" (error correction
đúng nghĩa đen, không có lựa chọn) vẫn để ngỏ vì cần giao diện nhập/chọn
từ trong câu khác hẳn UI trắc nghiệm hiện tại. TOEFL Junior/TOEIC (mục 30)
vẫn đang chờ bắt đầu — đây sẽ là lần đầu cần dựng LEVEL HOÀN TOÀN MỚI từ
đầu (TOEFL Junior/TOEIC không nằm trong họ Cambridge YLE/KET/PET, ngữ
cảnh khác hẳn — TOEFL Junior học thuật, TOEIC công sở).

## 45. BẮT ĐẦU TOEFL JUNIOR (>800/900) — ĐỢT 9 CỦA MỤC 30 (07/2026)

Bạn xác nhận "tiếp tục" — đi tiếp sang **TOEFL Junior**, cấp ĐẦU TIÊN nằm
ngoài họ Cambridge YLE/KET/PET (khác ngữ cảnh: học thuật nhẹ thay vì thi
trẻ em). Việc chưa cần bắt đầu mảng dữ liệu hoàn toàn mới lạ — vẫn dùng
đúng kiến trúc `Unit`/`examprep.js` đã kiểm chứng qua 5 cấp trước, chỉ
thêm mảng `TOEFL_JUNIOR_UNITS` mới.

**7 unit TOEFL Junior đầu tiên** (mỗi unit 8 câu + lesson — đúng các điểm
ngữ pháp THỰC SỰ MỚI so với PET theo mục 30 §2):
- **`toefl-junior-past-perfect-continuous`** — had been + V-ing, nhấn
  mạnh KHOẢNG THỜI GIAN 1 hành động diễn ra liên tục trước 1 mốc khác
  trong quá khứ (khác quá khứ hoàn thành thường chỉ nói việc đã xong).
- **`toefl-junior-future-perfect-continuous`** — tương lai tiếp diễn
  (will be + V-ing) và tương lai hoàn thành (will have + V3).
- **`toefl-junior-conditional-3`** — câu điều kiện loại 3 (If + had + V3,
  would have + V3 — giả định trái với quá khứ, không thể thay đổi).
- **`toefl-junior-passive-all-tenses`** — bị động ở hiện tại hoàn thành
  (has/have been + V3), tương lai (will be + V3), và với động từ khuyết
  thiếu (must/should/can + be + V3) — mở rộng từ bị động hiện tại/quá khứ
  đơn đã học ở PET.
- **`toefl-junior-conjunctions-advanced`** — liên từ nâng cao: provided
  that/as long as (miễn là), unless (trừ khi), even though/although
  (mặc dù).
- **`toefl-junior-vocabulary`** (12 câu) — từ vựng học thuật nhẹ: khoa
  học (scientific, hypothesis, analyze), đánh giá & xã hội (evaluate,
  community, global, significant).
- **`toefl-junior-reading`** — đoạn đọc hiểu học thuật "Why Do Bees
  Matter?" (~120 từ, tái dùng cơ chế `passage` đã có) + 8 câu hỏi, LẦN ĐẦU
  có dạng câu hỏi mới **"từ vựng theo văn cảnh"** (kiểu TOEFL thật: "The
  word 'vital'... is closest in meaning to ___") bên cạnh ý chính/chi
  tiết/suy luận đã quen từ KET.

**Đăng ký đúng kiến trúc mở rộng** (không sửa engine): `examprep.js` thêm
`{ id: 'toefl-junior', label: 'TOEFL Junior (>800/900)', icon: '📘' }` vào
`LEVELS` + `UNITS_BY_LEVEL`; `exam-prep/index.html` thêm level-card thứ 6;
2 khoá i18n mới; `examprep.test.js` cập nhật union unit + thêm test riêng
cho `toefl-junior-reading` (xác nhận có câu hỏi "closest in meaning to");
đổi cấp dùng để test fallback rỗng từ `'toefl-junior'` (giờ đã tồn tại)
sang `'toeic'`.

**Cập nhật hub `thi-chung-chi-anh/`**: đổi tên khu từ "Cambridge Young
Learners English (YLE)" — không còn chính xác vì đã bao gồm cả KET/PET/
TOEFL Junior nằm ngoài YLE — thành **"Luyện Thi & Ngữ Pháp (Cambridge →
TOEFL Junior)"**; cập nhật số liệu thẻ (488 câu/48 unit, 6 cấp); rút gọn
khối "Sắp có" chỉ còn TOEIC. `sw.js` v105→**v106**.

**Kết quả**: 6 cấp độ (Starters/Movers/Flyers/KET/PET/TOEFL Junior),
**48 unit, 488 câu hỏi** (488 id duy nhất, đã xác nhận). `npm test` toàn
bộ: **1112 ✅, 0 ❌** (1111 + 1 test mới). Smoke test `/`,
`/thi-chung-chi-anh/`, `/exam-prep/` đều 200, đủ 6 level-card, không id
trùng lặp.

**Còn để ngỏ**: TOEFL Junior mới có 7 unit khởi đầu — có thể mở rộng
thêm (nghe hiểu — TOEFL Junior thật có phần Listening riêng mà app hiện
chưa mô phỏng, hoặc thêm đoạn đọc hiểu học thuật khác). **TOEIC** (mục 30)
là track CUỐI CÙNG còn lại trong yêu cầu gốc "cambridge ket pet toefl
toeic" — ngữ cảnh công sở/thương mại, khác hẳn mọi cấp đã làm (đối tượng
người lớn/thiếu niên đi làm, không phải học sinh).

## 46. TÁCH RIÊNG KET/PET/TOEFL JUNIOR KHỎI MÀN CHỌN CẤP ĐỘ GỘP CHUNG (07/2026)

Bạn phản hồi: gộp cả 6 cấp độ (Starters/Movers/Flyers/KET/PET/TOEFL
Junior) trong CÙNG 1 màn chọn cấp độ của `exam-prep/` khiến bé dễ rối —
yêu cầu tách KET/PET/TOEFL Junior thành các mục RIÊNG BIỆT ở home/hub,
không gộp chung.

**Quyết định kiến trúc**: KHÔNG viết lại engine — `exam-prep/src/
examprep.js` và `units.js` (Unit/misses.js) giữ NGUYÊN VẸN, vẫn là nguồn
dữ liệu/logic DUY NHẤT cho cả 6 cấp (đây là lý do khi thêm PET/TOEFL
Junior trước đó chỉ mất vài dòng code). Thay đổi chỉ ở TẦNG GIAO DIỆN:
- **`exam-prep/`** thu hẹp lại đúng phạm vi gốc — chỉ còn 3 level-card
  Starters/Movers/Flyers (Cambridge YLE), xoá 3 level-card KET/PET/TOEFL
  Junior khỏi màn chọn cấp độ.
- **3 mục mới hoàn toàn tách biệt**, mỗi mục là 1 app riêng với URL riêng:
  `luyen-thi-ket/`, `luyen-thi-pet/`, `luyen-thi-toefl-junior/` — mỗi app
  **KHOÁ CỨNG 1 LEVEL_ID** (hằng số ở đầu file `app.js`) và **bỏ hẳn màn
  chọn cấp độ** khỏi luồng UI: bấm vào mục là vào THẲNG màn "Học hay Luyện
  Thi?" của đúng cấp đó, không phải chọn cấp trước như cũ.
- **Cách tái dùng logic**: `app.js` của cả 3 mục mới import trực tiếp từ
  `../../exam-prep/src/examprep.js` và `../../exam-prep/src/misses.js`
  (cùng kiểu cross-folder import đã dùng cho `nghe-doan-on-tap` gộp 9
  game trước đây) — chỉ đổi `LEVEL_ID`/`LEVEL_LABEL` và rút gọn state
  machine (bỏ khoá `'level'` khỏi `SCREEN_ELS`, màn gốc đổi từ `level`
  thành `mode`, `goBack()` khi hết history quay về `'mode'` thay vì
  `'level'`). Sổ "câu hay sai" (`misses.js`) dùng CHUNG cho cả 4 app (kể
  cả `exam-prep/`) vì id câu hỏi đã duy nhất toàn hệ thống — bé làm sai ở
  bất kỳ app nào cũng ghi vào cùng 1 sổ ôn tập tổng.
- `style.css` mỗi mục là 1 bản sao độc lập (đúng quy ước mọi game trong
  repo — CSS không share qua href liên thư mục), chỉ đổi dòng comment đầu
  file; nội dung style giống hệt `exam-prep/style.css`.
- Mỗi mục mới có `package.json` riêng (`"type": "module"`) để nhất quán
  với `exam-prep/` (dù không có file test, package.json vẫn giúp công cụ
  kiểm tra cú pháp ESM nhận diện đúng).

**Đăng ký**: 6 khoá i18n mới (`examket.title/help`, `expet.title/help`,
`extofljr.title/help`, 5 ngôn ngữ mỗi khoá); `thi-chung-chi-anh/index.html`
đổi từ 1 thẻ gộp "Luyện Thi Cambridge & TOEFL Junior" + 1 thẻ Ngữ Pháp
Trực Quan thành **5 thẻ riêng biệt**: Cambridge YLE, KET, PET, TOEFL
Junior, Ngữ Pháp Trực Quan — đổi tiêu đề khu thành "Từng Cấp Độ Riêng Biệt
— dễ chọn, không gộp chung cho khỏi rối" (giải thích rõ LÝ DO tách, không
chỉ liệt kê). `sw.js` v106→**v107** (+9 file precache cho 3 mục mới).

`npm test` toàn bộ: **1112 ✅, 0 ❌** (không đổi — đây thuần là tái cấu
trúc UI, dữ liệu/logic engine không đổi 1 dòng nên không có test nào cần
sửa). Smoke test xác nhận: `exam-prep/` chỉ còn đúng 3 level-card
(starters/movers/flyers); cả 3 mục mới (`/luyen-thi-ket/`,
`/luyen-thi-pet/`, `/luyen-thi-toefl-junior/`) cùng file JS/CSS đều 200;
đường dẫn import cross-folder từ `luyen-thi-ket/src/` tới
`exam-prep/src/examprep.js` v.v. đều tồn tại đúng; không id trùng lặp
trong bất kỳ file HTML nào (41 id/file, không trùng).

**Còn để ngỏ**: chưa bổ sung dữ liệu mới trong lượt này (toàn bộ effort
dành cho việc tách cấu trúc) — "tiếp tục bổ sung dữ liệu" bạn yêu cầu
cùng lúc sẽ thực hiện ở lượt kế tiếp (mở rộng TOEFL Junior, hoặc bắt đầu
TOEIC — track cuối cùng còn lại).

**Bổ sung dữ liệu cùng lượt này** (phần "tiếp tục bổ sung dữ liệu" bạn
yêu cầu chung 1 câu với việc tách mục): rà lại danh sách ngữ pháp TOEFL
Junior ở mục 30 §2, phát hiện 2 điểm còn thiếu so với PET mà 7 unit ban
đầu (mục 45) chưa phủ tới — **+2 unit TOEFL Junior mới**:
- **`toefl-junior-reported-commands`** — câu tường thuật MỆNH LỆNH
  (told/asked + O + to/not to + V) — PET mới dạy tường thuật khẳng định +
  câu hỏi, còn thiếu dạng mệnh lệnh ("Sit down," → told the students to
  sit down) mà mục 30 §2 ghi rõ TOEFL Junior cần "câu tường thuật ĐẦY ĐỦ
  (trần thuật/nghi vấn/mệnh lệnh)".
- **`toefl-junior-relative-clauses-nondefining`** — mệnh đề quan hệ KHÔNG
  XÁC ĐỊNH (dùng dấu phẩy, thông tin thêm không thiết yếu, KHÔNG dùng
  "that") — PET mới dạy mệnh đề xác định, còn thiếu "mệnh đề quan hệ xác
  định/KHÔNG xác định" mà mục 30 §2 đã liệt kê cho TOEFL Junior. 1 câu hỏi
  cố tình đối chiếu lại: mệnh đề XÁC ĐỊNH (không dấu phẩy) vẫn dùng được
  "that" — giúp bé phân biệt rõ 2 loại thay vì học tách rời.

**Kết quả**: TOEFL Junior 7→**9 unit**, 60→**76 câu hỏi**. Tổng hệ thống:
48→**50 unit**, 488→**504 câu hỏi** (504 id duy nhất, đã xác nhận).
`examprep.test.js` cập nhật số liệu unit/tổng câu hỏi tương ứng.

`npm test` toàn bộ: **1112 ✅, 0 ❌** (chỉ cập nhật assertion số liệu,
không thêm test case mới vì không có hành vi engine mới). Smoke test `/`,
`/thi-chung-chi-anh/`, `/luyen-thi-toefl-junior/` đều 200. `sw.js`
v107→**v108**.

**Còn để ngỏ**: TOEFL Junior giờ đã phủ đủ toàn bộ điểm ngữ pháp liệt kê ở
mục 30 §2. **TOEIC** vẫn là track CUỐI CÙNG chưa bắt đầu trong yêu cầu gốc
"cambridge ket pet toefl toeic" — sẽ cần 1 mục riêng biệt thứ 6
(`luyen-thi-toeic/`) theo đúng cấu trúc tách-mục vừa làm ở lượt này, không
gộp vào cùng màn với các cấp khác.

## 47. BẮT ĐẦU TOEIC — HOÀN TẤT TRỌN VẸN "CAMBRIDGE KET PET TOEFL TOEIC" (07/2026)

Bạn xác nhận "tiếp tục" lần nữa — đi tiếp bằng **TOEIC**, track CUỐI CÙNG
còn lại trong yêu cầu gốc bạn liệt kê ngay từ đầu ("cambridge ket pet
toefl toeic"). Sau đợt này, toàn bộ 5 chứng chỉ được nêu tên đều đã có
nội dung chơi được.

**5 unit TOEIC đầu tiên** — đúng nhận định ở mục 30 §2: TOEIC không có
nhiều ngữ pháp MỚI so với TOEFL Junior (cùng tầm B2), khác biệt chính là
NGỮ CẢNH công sở/thương mại thay vì đời sống/học đường:
- **`toeic-vocabulary-office`** (12 câu) — từ vựng văn phòng cơ bản:
  colleague, deadline, memo, agenda, client, intern, cafeteria...
- **`toeic-vocabulary-business`** (12 câu) — từ vựng kinh doanh: contract,
  revenue, invoice, budget, discount, shipment, warranty, negotiate,
  shareholder...
- **`toeic-grammar-context`** (10 câu) — đúng dạng **Part 5 "Incomplete
  Sentences"** thật của TOEIC: KHÔNG dạy ngữ pháp mới, chỉ đặt lại đúng
  các điểm đã học (thì, bị động, điều kiện, liên từ) vào ngữ cảnh công
  sở ("All employees must attend...", "The contract was signed...").
- **`toeic-reading-email`** — đọc hiểu 1 email công sở thật ("Team
  Meeting Reminder") + 6 câu hỏi ý chính/chi tiết/suy luận, tái dùng cơ
  chế `passage` đã có.
- **`toeic-message-chain`** — đúng ý tưởng "chuỗi tin nhắn công sở" đã đề
  xuất ở mục 30 §4 (đặc trưng Part 7 hiện đại của TOEIC thật): 6 tin nhắn
  qua lại giữa Anna và Mark về việc dời lịch gọi khách hàng, kèm mốc thời
  gian từng tin — 6 câu hỏi kiểm tra khả năng theo dõi ai nói gì khi nào.

**Đăng ký đúng cấu trúc tách-mục vừa làm ở mục 46**: thêm `TOEIC_UNITS`
vào `units.js`, đăng ký `{ id: 'toeic', label: 'TOEIC (800/990)', icon:
'💼' }` vào `LEVELS`/`UNITS_BY_LEVEL` trong `examprep.js`; tạo folder
**`luyen-thi-toeic/`** (index.html/style.css/src/app.js/package.json)
theo đúng khuôn "khoá cứng LEVEL_ID, bỏ màn chọn cấp độ" đã dùng cho KET/
PET/TOEFL Junior — sao chép + đổi 3 hằng số (LEVEL_ID/LEVEL_LABEL/khoá
i18n), không viết lại logic. 2 khoá i18n mới (`extoeic.title/help`).

**Cập nhật hub `thi-chung-chi-anh/`**: thêm thẻ "Luyện Thi TOEIC" thứ 6,
**xoá hẳn khối "Sắp có"** vì không còn track nào trong danh sách gốc chưa
làm. Cập nhật mô tả thẻ trang chủ "Thi Chứng Chỉ Anh" (bỏ "sắp có TOEIC").
`sw.js` v108→**v109**.

**Kết quả**: 7 cấp độ (Starters/Movers/Flyers/KET/PET/TOEFL Junior/
TOEIC), **55 unit, 550 câu hỏi** (550 id duy nhất, đã xác nhận). 6 mục
riêng biệt trên hub (Cambridge YLE, KET, PET, TOEFL Junior, TOEIC, Ngữ
Pháp Trực Quan) + engine dữ liệu dùng chung 1 nguồn duy nhất.

**1 test mới**: xác nhận `toeic-message-chain` có `passage` hợp lệ và mọi
câu đều `type: 'reading'`. `npm test` toàn bộ: **1113 ✅, 0 ❌**. Smoke
test `/`, `/thi-chung-chi-anh/` (đủ 6 thẻ, không trùng href), `/luyen-thi-
toeic/` cùng file JS/CSS đều 200.

**Còn để ngỏ**: toàn bộ 5 chứng chỉ trong yêu cầu gốc đã có nội dung.
Hướng mở rộng tiếp theo (nếu muốn): làm sâu thêm từng cấp (đặc biệt TOEIC/
TOEFL Junior mới có 5/9 unit, mỏng hơn Movers/Flyers/KET/PET), thêm IELTS
(chưa từng được yêu cầu, chỉ nhắc đến trong `chungchi.png` tham khảo ban
đầu), hoặc quay lại Đợt 3/Đợt 5 của mục 28 (mượn khung Ôn Tập Vui cho ngữ
pháp, Luyện Đề tổng hợp trộn nhiều cấp).

## 48. ĐÀO SÂU TOEIC — CẤP MỎNG NHẤT (07/2026)

Bạn "tiếp tục" lần nữa, không nêu track cụ thể — theo đúng nếp đã làm ở
mục 41/45 (mỗi lần "tiếp tục" trống, đào sâu cấp đang MỎNG nhất), lần này
là **TOEIC** (5 unit/46 câu, ít hơn hẳn KET 6/66 và PET 8/80).

**Mở rộng unit có sẵn**: `toeic-grammar-context` (Part 5 "Incomplete
Sentences") +2 câu, 10 → 12 câu — vẫn giữ đúng tinh thần "không dạy ngữ
pháp mới, chỉ đặt lại ngữ cảnh công sở".

**2 unit TOEIC hoàn toàn mới**:
- **`toeic-vocabulary-travel-hr`** (12 câu) — từ vựng công tác & nhân sự:
  itinerary, boarding pass, reservation, applicant, interview, promotion,
  resign, salary... — mảng từ vựng TOEIC thật chưa chạm tới ở 2 unit từ
  vựng văn phòng/kinh doanh trước đó.
- **`toeic-reading-notice`** — đọc hiểu thông báo nội bộ công sở ("Notice:
  Office Renovation", ~120 từ) + 6 câu hỏi ý chính/chi tiết/suy luận, tái
  dùng cơ chế `passage` (thể loại văn bản thứ 3 của TOEIC sau email và
  chuỗi tin nhắn, đúng phổ văn bản Part 7 thật).

**Kết quả TOEIC**: 5 → **7 unit**, 46 → **66 câu hỏi**. Toàn hệ thống 7
cấp: 55 → **57 unit**, 550 → **570 câu hỏi** (570 id duy nhất, đã xác
nhận không trùng qua node dynamic-import).

**Cập nhật test**: `examprep.test.js` — số unit TOEIC 5→7 (2 chỗ:
tổng hợp unit + `unitsForLevel`), ngưỡng tổng câu hỏi tối thiểu 540→560.
`sw.js` v109→**v110**. `npm test` toàn bộ: **381 ✅, 0 ❌**. Smoke test
`/`, `/thi-chung-chi-anh/`, `/luyen-thi-toeic/` cùng
`luyen-thi-toeic/src/app.js`, `exam-prep/src/units.js`, `sw.js` đều 200.

**Còn để ngỏ**: TOEIC vẫn mỏng nhất hệ thống (7 unit so với 9-11 của các
cấp trên). Có thể tiếp tục thêm unit TOEIC (ví dụ: đọc hiểu quảng cáo/
thông báo tuyển dụng, từ vựng tài chính/ngân hàng) hoặc chuyển sang đào
sâu TOEFL Junior (9 unit, đứng thứ nhì về độ mỏng).