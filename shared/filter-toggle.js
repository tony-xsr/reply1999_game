// Thu gọn hàng nút lọc chủ đề (filter-row) thành 1 nút bấm mở ra — dùng chung
// cho cả 13 game "Nghe & Đoán"/"Ôn Tập Vui" vì hàng nút lọc trước đây LUÔN
// HIỆN SẴN chiếm quá nhiều chỗ màn hình (đặc biệt màn hình nhỏ, 5-9 chủ đề
// xếp thành nhiều hàng). Không cần sửa `buildFilterRow()` của từng game —
// dùng MutationObserver để tự đồng bộ nhãn "đang lọc" mỗi khi hàng nút được
// vẽ lại (rebuild toàn bộ innerHTML), nên gắn 1 lần là xong.

/**
 * @param {HTMLElement} filterRowEl - phần tử #filterRow (chứa các .filter-btn)
 * @param {HTMLElement} toggleBtnEl - nút bấm để mở/đóng (đã có sẵn trong HTML)
 */
export function initFilterToggle(filterRowEl, toggleBtnEl) {
  if (!filterRowEl || !toggleBtnEl) return;
  const labelEl = toggleBtnEl.querySelector('.ft-label');

  function syncLabel() {
    const active = filterRowEl.querySelector('.filter-btn.active');
    if (labelEl) labelEl.textContent = active ? active.textContent : '';
  }

  function close() {
    filterRowEl.classList.remove('open');
    toggleBtnEl.classList.remove('open');
  }

  toggleBtnEl.addEventListener('click', () => {
    const opening = !filterRowEl.classList.contains('open');
    filterRowEl.classList.toggle('open', opening);
    toggleBtnEl.classList.toggle('open', opening);
  });

  // Bấm chọn 1 chủ đề xong thì tự đóng lại — gọn, đỡ phải bấm thêm 1 lần nữa.
  filterRowEl.addEventListener('click', (e) => {
    if (e.target.classList && e.target.classList.contains('filter-btn')) {
      setTimeout(close, 150);
    }
  });

  new MutationObserver(syncLabel).observe(filterRowEl, { childList: true, subtree: true, attributes: true });
  syncLabel();
}
