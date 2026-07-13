# 🎮 Game Pikachu (Onet Connect) — Tài liệu thiết kế & Kế hoạch công việc

> Dựa theo hình mẫu `image.png` — game Pikachu cổ điển: nối 2 ô hình giống nhau
> bằng đường đi **không quá 2 lần gấp khúc** để xóa chúng khỏi bàn chơi.
> Trả lời câu hỏi: **CÓ, hoàn toàn làm được** bằng HTML/CSS/JS thuần,
> cùng phong cách với các game khác trong collection (go_game, sudoku, mahjong...).

---

## 1. Mô tả game (theo hình mẫu)

- Bàn chơi dạng lưới ô (grid) khoảng **16 cột × 9 hàng** (~144 ô), mỗi ô chứa 1 icon con vật.
- Mỗi icon xuất hiện theo **cặp (số chẵn lần)**. Người chơi click 2 ô giống nhau.
- Nếu tồn tại đường nối giữa 2 ô đi qua **ô trống**, gồm tối đa **3 đoạn thẳng
  (2 lần rẽ)** → vẽ đường nối màu xanh (như trong hình), 2 ô biến mất, cộng điểm.
- Đường nối được phép **đi ra ngoài mép bàn chơi** (viền ngoài tính là ô trống).
- Thắng level khi xóa hết bàn. Có **7 level** (hình ghi "Level 1/7"), mỗi level
  có luật dồn ô khác nhau (xem mục 4).
- Có **thanh thời gian** (thanh gradient trên đầu) — hết giờ là thua.
- Góc trái: nút **NEW** (ván mới), **RATE/TOP** (bảng điểm), nút **Pause ⏸**,
  nút **tắt/bật âm thanh 🔇**. Góc phải hiển thị **điểm số** (220), góc trái
  hiển thị **số lượt gợi ý/shuffle** (10).

## 2. Công nghệ & vị trí trong collection

| Hạng mục | Lựa chọn |
|---|---|
| Ngôn ngữ | HTML + CSS + JavaScript thuần (ES modules), không framework |
| Render | DOM grid + CSS (ô, animation) + 1 lớp `<canvas>`/SVG overlay để vẽ đường nối |
| Icon con vật | **Emoji động vật** (🐰🐵🐔🐼🐷🦉🐬🦁...) — sẵn có, không lo bản quyền sprite. ~36 loại như bản gốc. (Tùy chọn nâng cấp sau: vẽ sprite riêng) |
| Âm thanh | Web Audio API tự sinh tiếng (giống `sfx.js` của go_game), không cần file mp3 |
| Lưu trữ | `localStorage`: điểm cao, level đã đạt, cài đặt âm thanh |
| Đa ngôn ngữ | Tích hợp `i18n.js` chung của collection (VI/EN) |
| PWA/Offline | Thêm route vào `sw.js` + card vào `index.html` trang chủ |
| Mobile | Responsive, chơi bằng chạm, grid tự co theo màn hình |

## 3. Thuật toán lõi — tìm đường nối ≤ 2 lần rẽ

Đây là phần quan trọng nhất. Cách làm chuẩn:

1. **Biểu diễn bàn**: ma trận `(rows+2) × (cols+2)` — thêm 1 vành đai ô trống
   bao quanh để đường nối được đi ra ngoài mép.
2. **BFS theo trạng thái `(vị trí, hướng đang đi, số lần rẽ)`**:
   - Từ ô A, lan ra 4 hướng; đi thẳng không tốn "rẽ", đổi hướng +1 rẽ.
   - Chỉ đi qua ô trống (hoặc đích là ô B).
   - Trạng thái hợp lệ khi số rẽ ≤ 2. Gặp B → tìm thấy, trả về đường đi để vẽ.
   - Độ phức tạp nhỏ (bàn ~18×11), chạy tức thì.
3. **Kiểm tra bế tắc**: sau mỗi lần xóa, quét mọi cặp còn lại xem có nước đi
   không. Nếu không còn → **tự động xáo trộn (shuffle)** các ô còn lại
   (xáo đến khi có nước đi) hoặc trừ lượt shuffle.
4. **Gợi ý (hint)**: dùng lại hàm quét cặp — tìm cặp đầu tiên nối được,
   nháy sáng 2 ô. Số lượt gợi ý giới hạn (con số "10" góc trái hình).

## 4. Hệ thống 7 level (điểm đặc trưng của Pikachu cổ điển)

Sau mỗi lần xóa 1 cặp, các ô còn lại **dồn** theo luật riêng của level:

| Level | Luật dồn ô sau khi xóa |
|---|---|
| 1 | Không dồn (tĩnh — như hình mẫu) |
| 2 | Dồn xuống dưới (trọng lực ↓) |
| 3 | Dồn lên trên (↑) |
| 4 | Dồn sang trái (←) |
| 5 | Dồn sang phải (→) |
| 6 | Dồn vào giữa theo chiều ngang (⇥⇤) |
| 7 | Tách ra 2 phía từ giữa (⇤⇥) |

- Qua level: giữ điểm, reset bàn mới, thời gian nhanh hơn / ít gợi ý hơn.
- Số loại icon tăng dần theo level (khó nhận diện hơn).

## 5. Tính điểm & thời gian

- Xóa 1 cặp: **+10 điểm**.
- **Combo**: xóa liên tiếp trong ~3 giây → nhân điểm (x2, x3...), có hiệu ứng.
- Thanh thời gian tụt dần; xóa được cặp thì **cộng thêm chút thời gian**.
- Hết giờ → thua, hiện điểm & bảng xếp hạng. Hết bàn → qua level, thưởng điểm
  theo thời gian còn lại.
- Bảng điểm TOP lưu `localStorage` (10 điểm cao nhất kèm ngày).

## 6. Giao diện (bám theo hình mẫu)

- **Khung tối** (nền đen), ô bài **màu hồng** viền đậm, icon ở giữa — giữ đúng
  chất cổ điển; có thể thêm theme sáng/tối theo hệ thống chung.
- **Thanh trên**: số gợi ý | Level x/7 | thanh thời gian gradient | điểm.
- **Cột trái**: NEW, TOP (bảng điểm), Pause, Âm thanh.
- **Hiệu ứng**:
  - Ô được chọn: viền sáng + phóng to nhẹ (như 2 ô hồng đậm trong hình).
  - Đường nối: kẻ màu xanh lá dày, hiện ~300ms rồi biến mất cùng 2 ô (fade/scale).
  - Sai cặp: rung nhẹ 2 ô.
  - Qua level: pháo hoa/confetti đơn giản.
- **Màn hình**: Menu chính → Chơi → Pause overlay → Thắng level → Game over.

## 7. Cấu trúc file dự kiến

```
pokemon/
├── index.html            # Trang game                                [✅ đã có]
├── style.css             # Giao diện (nền tối, ô hồng, animation)    [✅ đã có]
├── e2e.html              # Bot tự chơi hết 7 level — test end-to-end [✅ đã có]
├── e2e-modes.html        # Bot smoke-test Daily/Zen/Duel             [✅ đã có]
├── package.json          # type:module để chạy test bằng Node        [✅ đã có]
├── pokemon.md            # Tài liệu này
├── image.png             # Hình mẫu tham khảo
├── images/               # 1005 icon Pokémon HOME 256×256 PNG (~22MB)  [✅ đã có]
│   │                     # Nguồn: github.com/ChicoEevee/HOMENatDexIcons
│   │                     # Tên file: pm{ID 4 số}_{form}_{biến thể}_00_big.png
│   │                     # 734 loài — kho gốc, KHÔNG precache trong sw.js
│   └── trimmed/          # 36 con được chọn, đã cắt lề trong suốt + resize
│                         # 128×128 (~744KB) — bộ icon "⚡ Pokémon" trong game
└── src/
    ├── app.js            # Điều phối: chọn ô, nối cặp, thắng/bế tắc  [✅ đã có]
    ├── board.js          # Sinh bàn, xáo trộn, xóa cặp               [✅ đã có]
    ├── pathfinder.js     # BFS ≤2 rẽ, tìm nước đi/gợi ý              [✅ đã có]
    ├── pathfinder.test.js# Unit test (node src/pathfinder.test.js)   [✅ đã có]
    ├── renderer.js       # Grid DOM + canvas đường nối, animation    [✅ đã có]
    ├── levels.js         # Cấu hình 7 level (luật dồn, thời gian)    [✅ đã có]
    ├── daily.js          # Daily challenge: seed theo ngày, kỷ lục   [✅ đã có]
    ├── achievements.js   # 8 thành tích, lưu localStorage            [✅ đã có]
    ├── game.test.js      # Unit test gravity/score/seed/daily/ach    [✅ đã có]
    ├── score.js          # Điểm, combo, bảng TOP (localStorage)      [✅ đã có]
    ├── timer.js          # Thanh thời gian, pause/resume             [✅ đã có]
    └── sfx.js            # Âm thanh Web Audio                        [✅ đã có]
```

## 8. Danh sách công việc (checklist)

### Giai đoạn 1 — Lõi chơi được (MVP) ✅ HOÀN THÀNH (2026-07-08)
- [x] 1.1. Dựng `index.html` + layout khung game (thanh trên, cột nút trái, vùng bàn) + `style.css`
- [x] 1.2. `board.js`: sinh bàn 16×9 từ bộ icon theo cặp, xáo trộn; **đảm bảo bàn sinh ra luôn có nước đi**
- [x] 1.3. `pathfinder.js`: BFS ≤ 2 rẽ (kèm vành đai ngoài mép) + unit test — **12/12 pass** (`node src/pathfinder.test.js`): thẳng, 1 rẽ, 2 rẽ, vòng ra ngoài mép, bọc kín, bế tắc, mô phỏng chơi hết 5 ván
- [x] 1.4. Xử lý click/chạm: chọn ô 1 → ô 2 → kiểm tra → xóa hoặc báo sai (rung + chuyển lựa chọn)
- [x] 1.5. `renderer.js`: vẽ đường nối trên canvas overlay + animation biến mất (pop-out 300ms)
- [x] 1.6. Kiểm tra bế tắc + tự shuffle khi hết nước (kèm toast thông báo)

> **Đã kiểm chứng**: unit test 12/12 pass; e2e bot (`e2e.html`) tự chơi trong
> headless Chrome đến sạch bàn. Chạy thử: `npm run dev` → `http://localhost:8765/pokemon/`

### Giai đoạn 2 — Luật chơi đầy đủ ✅ HOÀN THÀNH (2026-07-08)
- [x] 2.1. `timer.js`: thanh thời gian, hết giờ thua, cộng +2s khi ăn cặp, pause/resume
- [x] 2.2. `score.js`: điểm +10/cặp, combo x2→x5 (trong 3s), lưu TOP 10 vào localStorage
- [x] 2.3. `levels.js`: 7 level với 7 luật dồn ô (tĩnh/xuống/lên/trái/phải/vào giữa/tách ra), thời gian giảm dần 240s→150s, số loại icon tăng 24→36
- [x] 2.4. Nút Gợi ý (10 lượt) + nút Xáo trộn (5 lượt)
- [x] 2.5. Màn hình menu / pause (Esc, tự pause khi ẩn tab) / thắng level (bonus thời gian) / game over / bảng TOP

### Giai đoạn 3 — Hoàn thiện & tích hợp collection ✅ HOÀN THÀNH (2026-07-08)
- [x] 3.1. `sfx.js`: âm thanh Web Audio tự sinh (chọn/nối/sai/xáo/thắng/thua) + nút tắt/bật lưu localStorage
- [x] 3.2. Responsive mobile (grid co giãn, thanh nút chuyển xuống dưới ở màn hẹp)
- [x] 3.3. Tích hợp `i18n.js` — đủ 5 ngôn ngữ VI/EN/JA/ZH/AR (bộ khóa `pika.*`)
- [x] 3.4. Thêm card game vào `index.html` trang chủ (sau Mạt Chược)
- [x] 3.5. Cập nhật `sw.js` precache (bump cache v101) để chơi offline
- [x] 3.6. Confetti khi qua level + combo popup + polish animation
- [x] 3.7. Accessibility: mũi tên di chuyển giữa các ô, Esc tạm dừng, focus ring, aria-label

> **Đã kiểm chứng (GĐ2+GĐ3)**: unit test **27/27 pass** (`npm test` = pathfinder 12 + gravity/score 15);
> e2e bot chơi **hết cả 7 level** trong headless Chrome → thắng 🏆, 6 lần overlay qua level,
> điểm 27.830. Screenshot xác nhận level 3 dồn ô lên trên đúng luật, combo x5 hiển thị.
>
> ⚠️ Lưu ý dev: khi test bằng `serve`, phải mở `/pokemon/` (có dấu `/` cuối) —
> mở `/pokemon/index.html` sẽ bị cleanUrls redirect về `/pokemon` làm gãy đường dẫn tương đối.

### Giai đoạn 4 — Mở rộng ✅ HOÀN THÀNH (2026-07-09)
- [x] 4.1. Chế độ **Zen** — không giới hạn thời gian, vẫn đủ 7 level dồn ô
- [x] 4.2. Chế độ **2 Người** chung màn hình — đấu theo lượt (20s/lượt): ăn cặp giữ lượt +10, đoán sai/hết giờ mất lượt; HUD 🔵🔴, màn hình thắng/hòa. *(chọn đấu lượt thay vì chia đôi bàn — công bằng hơn trên 1 chuột/màn hình cảm ứng)*
- [x] 4.3. **Daily challenge** — bàn cố định theo ngày (seed mulberry32 từ YYYYMMDD, chung toàn cầu theo UTC), luật dồn ô xoay theo thứ trong tuần (CN=tĩnh → T7=tách ra), lưu kỷ lục ngày, hiện ★điểm ở menu
- [x] 4.4. **Thành tích** — 8 thành tích (qua level đầu, combo x5, qua nhanh, không gợi ý, vô địch Cổ điển, Zen master, Daily, thắng Duel), toast khi mở khóa, xem danh sách từ menu
- [x] 4.5. **Bộ icon thay thế** — 5 bộ × 36 loại: 🐰 Động vật / 🍎 Trái cây / 😀 Mặt cười / **⚡ Pokémon** (ảnh PNG thật từ Pokémon HOME — 36 con quen thuộc: Pikachu, Eevee, Charizard, Snorlax, Gengar, Mewtwo...; đã cắt lề + resize 128px, renderer render `<img>` khi icon có đuôi `.png`; test `?icons=pokemon`) / **🐰⚡ Trộn** (18 emoji + 18 ảnh Pokémon trên cùng bàn; test `?icons=mix`). *Ảnh Pokémon chỉ dùng cá nhân, không thương mại.*
  - ⚠️ Bộ hình KHÔNG tự đổi — chọn ở dropdown **"Bộ hình"** trong menu chính.
  - sw.js đã **bỏ qua cache trên localhost** (v103) — khi dev sửa file chỉ cần reload 1 lần; bản deploy thật vẫn cache-first như cũ.
- [x] 4.6. **Cỡ bàn tùy chọn** — Nhỏ 10×6 / Vừa 14×8 / Lớn 16×9 (chọn ở menu, lưu localStorage)

> **Đã kiểm chứng (GĐ4)**: unit test **36/36 pass** (thêm 9 test: seed xác định,
> bàn daily giống nhau cùng seed, luật dồn theo thứ, bộ icon không trùng, achievements);
> e2e classic vẫn pass (thắng 7 level 🏆); e2e-modes pass cả 3: Daily chơi hết bàn 📅,
> Zen qua level không đồng hồ, Duel kết thúc ⚔️ 720—0 có HUD 2 người.

### Vòng rà soát & hoàn thiện (2026-07-09) ✅
- [x] Nút **MENU** ở màn hình pause + kết thúc — quay về menu chính để đổi chế độ/cài đặt
- [x] Mở **TOP giữa ván tự tạm dừng** đồng hồ; đóng quay về đúng màn hình trước đó
- [x] Màn hình kết thúc **Daily** hiện kỷ lục ngày thay vì bảng TOP của chế độ Cổ điển
- [x] **Mobile fix**: `renderer._layout()` tự tính cỡ ô — ô luôn vuông trên mọi màn hình
  (trước đó bị kéo méo dọc); hàng nút mobile wrap không tràn màn 390px (đo `overflow=false`)
- [x] Overlay menu co giãn (`max-width: min(92vw, 560px)`, cuộn dọc khi màn thấp)
- [x] Kiểm i18n EN render đúng toàn bộ menu; card trang chủ hiển thị chuẩn
- [x] Toàn bộ test xanh sau rà soát: unit 36/36 + e2e classic 🏆 + e2e-modes 3/3
- Lưu ý khi test headless Chrome: cửa sổ có **bề rộng tối thiểu 500px** — muốn thử
  viewport hẹp hơn phải bọc trang trong iframe có width cố định.

### Hệ theme & layout (2026-07-09) ✅
- [x] **4 theme**: 🌙 Tối (mặc định, như game gốc) / ☀️ Sáng / 🌲 Rừng (tông trang chủ
  collection) / 🌊 Đại dương — chọn ở menu, lưu `pika.theme`, đủ i18n 5 ngôn ngữ
- [x] Toàn bộ màu refactor vào **CSS variables** (`--bg/--text/--panel/--tile-*/--path-color...`),
  theme chỉ là bộ override `:root[data-theme=...]`
- [x] **Chống chớp màu**: script inline ở `<head>` áp theme từ localStorage trước khi vẽ;
  hỗ trợ `?theme=...` để test nhanh
- [x] `meta theme-color` đổi theo theme (màu thanh trạng thái mobile/PWA)
- [x] Nền **radial gradient** nhẹ thay nền phẳng; ô đang chọn dùng màu theme (viền
  `--text`, glow `--tile-selected`) nhìn rõ trên cả nền sáng
- [x] **Combo popup dời xuống giữa, dưới thanh trên** — hết đè lên thanh thời gian/điểm
- [x] Kiểm chứng: screenshot cả 4 theme giữa ván + menu theme Sáng; unit 36/36;
  e2e classic 🏆 + e2e-modes 3/3 vẫn xanh
- Lưu ý test: serve cleanUrls **làm rơi query string khi redirect** `e2e.html→e2e` —
  muốn truyền `?theme=` phải dùng URL không đuôi `.html`.

## 9. Rủi ro & lưu ý

- **Bản quyền**: KHÔNG dùng sprite Pokémon/con vật từ game gốc — dùng emoji
  hoặc tự vẽ. Tên game trong UI nên là "Pikachu Classic / Onet" kiểu chung chung,
  tránh nhãn hiệu Pokémon (thư mục `pokemon/` chỉ là tên nội bộ).
- **Emoji khác nhau giữa hệ máy** (macOS/Android/Windows) — chấp nhận được,
  hoặc sau này nhúng bộ SVG (Twemoji-style tự vẽ) để đồng nhất.
- **Sinh bàn phải giải được**: sinh ngẫu nhiên có thể bế tắc ngay từ đầu —
  xử lý bằng kiểm tra + shuffle lại trước khi bắt đầu.
- Level có dồn ô (2–7): sau khi dồn có thể **mở ra nước đi mới hoặc gây bế tắc**
  — phải kiểm tra bế tắc *sau khi dồn*, không phải trước.

## 10. Ước lượng

| Giai đoạn | Khối lượng |
|---|---|
| GĐ1 — MVP chơi được | ~1 buổi làm việc |
| GĐ2 — Luật đầy đủ 7 level | ~1 buổi |
| GĐ3 — Polish + tích hợp | ~nửa buổi |
| **Tổng bản hoàn chỉnh** | **~2.5 buổi** |

---

*Chờ duyệt: đọc xong tài liệu này, xác nhận thì bắt đầu code Giai đoạn 1.*
