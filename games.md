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

Cả 7 game trên đều mới ở mức **nghiên cứu/lên ý tưởng**, chưa bắt tay code. Khi quyết định làm game nào, nên làm theo đúng quy trình đã áp dụng cho các game trong nhóm "Game Mini" (Đào Vàng, Đập Vàng, Vị Vua Vàng...): viết logic thuần (pure function) kèm unit test trước, rồi mới tới giao diện, và luôn tự vẽ/dùng icon nguồn mở thay vì sao chép asset của game thương mại gốc.