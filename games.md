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