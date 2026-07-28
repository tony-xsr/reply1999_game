// Overlay + bộ khung CSS dùng CHUNG cho các mục "nội dung AI tự sinh mỗi
// ngày" trong khu Thi Chứng Chỉ Anh (📝 Luyện Dịch, 🧩 Trắc Nghiệm Ngữ Pháp...)
// — tự tạo overlay bằng JS (giống kid-bar.js), KHÔNG phụ thuộc CSS riêng của
// từng trang (mỗi trang luyện thi có theme màu khác nhau) nên dùng được y hệt
// ở cả 5 trang (exam-prep + 4 bản khoá cấp độ ket/pet/toefl-junior/toeic).

const PANEL = '#fffaf2';
const LINE = '#a8834a';
const INK = '#241e2e';
const INK_DIM = '#5d5370';
const GOLD2 = '#c2410c';

let styleInjected = false;

/** Chèn 1 lần duy nhất bộ CSS dùng chung (an toàn khi gọi nhiều lần/nhiều module). */
export function injectAiOverlayStyle() {
  if (styleInjected || document.getElementById('r99-ai-style')) return;
  styleInjected = true;
  const s = document.createElement('style');
  s.id = 'r99-ai-style';
  s.textContent = `
    .r99-ai-ov{position:fixed;inset:0;z-index:97;background:rgba(36,30,46,.88);display:flex;align-items:center;justify-content:center;padding:16px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif}
    .r99-ai-box{background:${PANEL};border:3px solid ${LINE};border-radius:18px;padding:20px;max-width:480px;width:100%;max-height:88vh;overflow:auto;color:${INK}}
    .r99-ai-box h3{margin:0 0 10px;font-size:17px;color:${GOLD2}}
    .r99-ai-close{float:right;background:none;border:none;font-size:20px;cursor:pointer;color:${INK_DIM};line-height:1}
    .r99-ai-card{background:#fff;border:2px solid ${LINE};border-radius:12px;padding:10px 12px;margin:8px 0;cursor:pointer;font-weight:700}
    .r99-ai-card:active{transform:translateY(1px)}
    .r99-ai-card .done{color:#15803d;font-weight:800;font-size:12.5px}
    .r99-ai-passage{font-style:italic;background:#fff;border:1px solid ${LINE};border-radius:10px;padding:10px 12px;margin:8px 0;line-height:1.6}
    .r99-ai-box textarea{width:100%;border:2px solid ${LINE};border-radius:10px;padding:10px;font-size:14px;font-family:inherit;resize:vertical;box-sizing:border-box}
    .r99-ai-btn{display:block;width:100%;margin-top:12px;background:linear-gradient(180deg,#ff9d5c,${GOLD2});color:#fff;border:none;border-radius:12px;padding:12px;font-weight:900;font-size:14.5px;cursor:pointer}
    .r99-ai-btn.ghost{background:#fff3df;color:${INK};border:2px solid ${LINE}}
    .r99-ai-btn:disabled{opacity:.55;cursor:default}
    .r99-ai-msg{font-size:13px;color:${INK_DIM};text-align:center;min-height:1.4em;margin-top:6px}
    .r99-ai-score{font-size:32px;font-weight:900;text-align:center;color:${GOLD2}}
    .r99-ai-feedback{background:#fff;border:1px solid ${LINE};border-radius:10px;padding:10px 12px;margin:10px 0;line-height:1.6}
    .r99-ai-cols{display:flex;gap:10px;margin:10px 0}
    .r99-ai-col{flex:1;display:flex;flex-direction:column;gap:6px}
    .r99-ai-chip{background:#fff;border:2px solid ${LINE};border-radius:10px;padding:9px 8px;font-size:13.5px;font-weight:700;text-align:center;cursor:pointer}
    .r99-ai-chip.sel{border-color:${GOLD2};background:#ffe1b0}
    .r99-ai-chip.matched{background:#dcf5e3;border-color:#15803d;color:#15803d;cursor:default}
    .r99-ai-chip.wrong{background:#fbdada;border-color:#c02a2a}
    .r99-ai-entry{display:block;width:100%;margin:0 0 12px;background:#fff3df;color:${INK};border:2px solid ${LINE};border-radius:14px;padding:13px 16px;font-weight:900;font-size:14.5px;cursor:pointer;text-align:center}
    .r99-ai-q{background:#fff;border:2px solid ${LINE};border-radius:12px;padding:12px;margin:10px 0}
    .r99-ai-opt{display:block;width:100%;text-align:left;background:#fff;border:2px solid ${LINE};border-radius:10px;padding:9px 12px;margin:6px 0;font-size:13.5px;font-weight:700;cursor:pointer}
    .r99-ai-opt.correct{background:#dcf5e3;border-color:#15803d;color:#15803d}
    .r99-ai-opt.wrong{background:#fbdada;border-color:#c02a2a;color:#c02a2a}
    .r99-ai-opt.picked{outline:3px solid ${GOLD2}}
    .r99-ai-explain{font-size:12.5px;color:${INK_DIM};margin:4px 0 10px;line-height:1.5;padding-left:4px}
    .r99-ai-progress{height:12px;border-radius:999px;background:#f1e2c8;overflow:hidden;border:1px solid ${LINE};margin:4px 0 8px}
    .r99-ai-progress-fill{height:100%;background:linear-gradient(90deg,#ffb066,${GOLD2});border-radius:999px;transition:width .3s}
    .r99-ai-progress-text{font-size:12px;color:${GOLD2};font-weight:800;text-align:center;margin:0 0 10px}
    .r99-ai-bonus{text-align:center;font-weight:900;color:${GOLD2};background:#fff3df;border:2px solid ${LINE};border-radius:12px;padding:8px 10px;margin:8px 0}
  `;
  document.head.appendChild(s);
}

/** Mở 1 overlay rỗng (nền tối phủ toàn màn + hộp trắng) — bấm ra ngoài hộp để đóng. */
export function openAiOverlay() {
  injectAiOverlayStyle();
  const ov = document.createElement('div');
  ov.className = 'r99-ai-ov';
  ov.innerHTML = '<div class="r99-ai-box"></div>';
  ov.addEventListener('click', (e) => { if (e.target === ov) closeAiOverlay(ov); });
  document.body.appendChild(ov);
  return ov;
}

export function closeAiOverlay(ov) {
  ov.remove();
}

/** Thay nội dung hộp trắng bên trong overlay, luôn kèm nút ✕ đóng ở góc trên-phải. */
export function renderAiBox(ov, html) {
  ov.querySelector('.r99-ai-box').innerHTML = `<button type="button" class="r99-ai-close" aria-label="Đóng">✕</button>${html}`;
  ov.querySelector('.r99-ai-close').addEventListener('click', () => closeAiOverlay(ov));
}

/** Tạo 1 nút "vào mục AI" (kiểu thẻ lớn màu vàng nhạt) — bên gọi tự chèn vào đâu tuỳ ý. */
export function buildEntryButton(label, onClick) {
  injectAiOverlayStyle();
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'r99-ai-entry';
  btn.textContent = label;
  btn.addEventListener('click', onClick);
  return btn;
}
