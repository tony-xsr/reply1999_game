// Theme sáng/tối + 2 bảng màu (🟠 Ấm mặc định / 🔵 Dịu kiểu Thi Chứng Chỉ
// Anh) — dùng cho các trang "hub" (trang chủ, chọn bé, tủ quà, phụ huynh,
// admin, giới thiệu). Mỗi trang dùng theme cần: 1) nạp shared/theme.css,
// 2) 1 đoạn <script> nhỏ ĐỒNG BỘ ở ĐẦU <head> (trước mọi <style>/<link
// stylesheet>) set sẵn data-theme để không bị nhoáng sai màu 1 khắc trước
// khi module này (ES module, tải bất đồng bộ) kịp chạy — đoạn script đó
// PHẢI giữ đúng y hệt logic applyTheme()/getThemePref() bên dưới (xem
// index.html để copy nguyên văn đoạn bootstrap này).

const KEY = 'r99-theme';
const PALETTES = [
  { id: 'warm', label: '🟠 Ấm' },
  { id: 'soft', label: '🔵 Dịu' },
];
const MODES = [
  { id: 'light', label: '☀️ Sáng' },
  { id: 'dark', label: '🌙 Tối' },
  { id: 'auto', label: '⚙️ Theo máy' },
];

// An toàn khi import trong Node (test): mọi truy cập window/document/
// localStorage đều nằm trong hàm hoặc sau kiểm tra `isBrowser`, không chạy
// ngay ở top-level module — theme.test.js test được effectiveMode()/
// getThemePref() mà không cần giả lập DOM.
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

function systemIsDark() {
  return isBrowser && !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
}

/** Lựa chọn theme đã lưu — mặc định 🟠 Ấm + ⚙️ Theo máy nếu chưa chọn lần nào. */
export function getThemePref() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && PALETTES.some((p) => p.id === saved.palette) && MODES.some((m) => m.id === saved.mode)) return saved;
  } catch { /* ignore */ }
  return { palette: 'warm', mode: 'auto' };
}

/** Chế độ SÁNG/TỐI thật sự áp dụng — "Theo máy" tra theo prefers-color-scheme của hệ thống. Hàm THUẦN, nhận sẵn `isDark` để test được. */
export function effectiveMode(pref, isDark = systemIsDark()) {
  return pref.mode === 'auto' ? (isDark ? 'dark' : 'light') : pref.mode;
}

/** Áp theme lên thẻ <html> — gọi lại được nhiều lần an toàn. */
export function applyTheme(pref = getThemePref()) {
  if (!isBrowser) return;
  document.documentElement.dataset.theme = `${pref.palette}-${effectiveMode(pref)}`;
}

/** Đổi + lưu theme mới, áp dụng ngay. */
export function setTheme(palette, mode) {
  const pref = { palette, mode };
  try { localStorage.setItem(KEY, JSON.stringify(pref)); } catch { /* ignore */ }
  applyTheme(pref);
}

if (isBrowser) {
  applyTheme();
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      const pref = getThemePref();
      if (pref.mode === 'auto') applyTheme(pref);
    });
  }
}

/** Gắn bộ nút chọn theme (2 hàng: bảng màu + chế độ) vào `container`. */
export function mountThemePicker(container) {
  if (!container) return;
  function render() {
    const pref = getThemePref();
    container.innerHTML = `
      <div class="r99-theme-picker">${PALETTES.map((p) => `<button type="button" class="r99-theme-btn${p.id === pref.palette ? ' sel' : ''}" data-palette="${p.id}">${p.label}</button>`).join('')}</div>
      <div class="r99-theme-picker">${MODES.map((m) => `<button type="button" class="r99-theme-btn${m.id === pref.mode ? ' sel' : ''}" data-mode="${m.id}">${m.label}</button>`).join('')}</div>
    `;
    container.querySelectorAll('[data-palette]').forEach((btn) => {
      btn.addEventListener('click', () => { setTheme(btn.dataset.palette, getThemePref().mode); render(); });
    });
    container.querySelectorAll('[data-mode]').forEach((btn) => {
      btn.addEventListener('click', () => { setTheme(getThemePref().palette, btn.dataset.mode); render(); });
    });
  }
  render();
}
