// Vẽ bàn chơi bằng DOM grid + canvas overlay cho đường nối.

import { ICONS, isImageIcon } from './board.js';

export class Renderer {
  /**
   * @param {HTMLElement} boardEl - phần tử .board (CSS grid)
   * @param {HTMLCanvasElement} canvas - lớp phủ vẽ đường nối
   * @param {HTMLElement} wrapEl - phần tử .board-wrap (gốc tọa độ canvas)
   */
  constructor(boardEl, canvas, wrapEl) {
    this.boardEl = boardEl;
    this.canvas = canvas;
    this.wrapEl = wrapEl;
    this.cells = []; // cells[r][c] -> button element
    this.rows = 0;
    this.cols = 0;
    this.icons = ICONS; // bộ icon hiện hành (đổi qua setIcons)

    this._resizeObserver = new ResizeObserver(() => this._syncCanvas());
    this._resizeObserver.observe(wrapEl);
  }

  setIcons(icons) {
    this.icons = icons;
  }

  /** Dựng lại toàn bộ grid từ ma trận bàn. */
  build(board, onCellClick) {
    this.rows = board.length;
    this.cols = board[0].length;
    this.boardEl.style.setProperty('--cols', this.cols);
    this.boardEl.innerHTML = '';
    this.cells = [];

    for (let r = 0; r < this.rows; r++) {
      const rowEls = [];
      for (let c = 0; c < this.cols; c++) {
        const btn = document.createElement('button');
        btn.className = 'cell';
        btn.dataset.r = r;
        btn.dataset.c = c;
        btn.addEventListener('click', () => onCellClick(r, c));
        this.boardEl.appendChild(btn);
        rowEls.push(btn);
      }
      this.cells.push(rowEls);
    }
    this.refresh(board);
    this._syncCanvas();
  }

  /** Cập nhật nội dung mọi ô theo ma trận (dùng sau shuffle). */
  refresh(board) {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const v = board[r][c];
        const el = this.cells[r][c];
        if (v == null) {
          el.textContent = '';
        } else if (isImageIcon(this.icons[v])) {
          el.innerHTML = `<img src="${this.icons[v]}" alt="" draggable="false">`;
        } else {
          el.textContent = this.icons[v];
        }
        el.classList.toggle('filled', v != null);
        el.classList.remove('selected', 'removing', 'hinting', 'shake');
        el.disabled = v == null;
        el.setAttribute('aria-label',
          v == null ? 'Ô trống' : (isImageIcon(this.icons[v]) ? `Ô hình ${v + 1}` : `Ô ${this.icons[v]}`));
      }
    }
  }

  cellEl(r, c) {
    return this.cells[r][c];
  }

  setSelected(pos, on) {
    if (pos) this.cells[pos.r][pos.c].classList.toggle('selected', on);
  }

  shake(...positions) {
    for (const p of positions) {
      const el = this.cells[p.r][p.c];
      el.classList.remove('shake');
      void el.offsetWidth; // restart animation
      el.classList.add('shake');
    }
  }

  hint(a, b) {
    for (const p of [a, b]) {
      const el = this.cells[p.r][p.c];
      el.classList.remove('hinting');
      void el.offsetWidth;
      el.classList.add('hinting');
    }
  }

  /** Animation biến mất của 1 cặp; trả Promise khi xong. */
  removePair(a, b) {
    return new Promise((resolve) => {
      for (const p of [a, b]) {
        const el = this.cells[p.r][p.c];
        el.classList.remove('selected');
        el.classList.add('removing');
      }
      setTimeout(() => {
        for (const p of [a, b]) {
          const el = this.cells[p.r][p.c];
          el.classList.remove('removing', 'filled');
          el.textContent = '';
          el.disabled = true;
        }
        resolve();
      }, 300);
    });
  }

  /** Vẽ đường nối (danh sách điểm gấp khúc, tọa độ có thể ra ngoài bàn: -1..rows). */
  drawPath(path) {
    const ctx = this.canvas.getContext('2d');
    const pts = path.map((p) => this._cellCenter(p.r, p.c));
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.lineWidth = Math.max(4, this._cellSize().w * 0.14);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = getComputedStyle(document.documentElement)
      .getPropertyValue('--path-color').trim() || '#22cc44';
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
  }

  clearPath() {
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // ===== nội bộ =====

  _syncCanvas() {
    const rect = this.wrapEl.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    this._layout();
  }

  /** Tính kích thước bàn: ô luôn vuông, chừa lề quanh bàn cho đường nối vòng ngoài. */
  _layout() {
    if (!this.rows) return;
    const W = this.wrapEl.clientWidth;
    const H = this.wrapEl.clientHeight;
    if (!W || !H) return;
    const gap = 2;
    // Ước lượng cạnh ô để suy ra lề (belt ≥ nửa ô thì đường vòng ngoài không bị cắt)
    const est = Math.min(W / (this.cols + 1.4), H / (this.rows + 1.4));
    const belt = Math.max(14, est * 0.65);
    const cell = Math.max(8, Math.floor(Math.min(
      (W - belt * 2 - gap * (this.cols - 1)) / this.cols,
      (H - belt * 2 - gap * (this.rows - 1)) / this.rows,
    )));
    this.boardEl.style.width = `${cell * this.cols + gap * (this.cols - 1)}px`;
    this.boardEl.style.height = `${cell * this.rows + gap * (this.rows - 1)}px`;
    this.boardEl.style.setProperty('--icon-size', `${Math.floor(cell * 0.68)}px`);
  }

  _cellSize() {
    if (!this.cells.length) return { w: 24, h: 24 };
    const rect = this.cells[0][0].getBoundingClientRect();
    return { w: rect.width, h: rect.height };
  }

  /** Tâm ô (r,c) theo tọa độ canvas — ngoại suy được cho ô vành đai ngoài bàn. */
  _cellCenter(r, c) {
    const wrapRect = this.wrapEl.getBoundingClientRect();
    const cr = Math.min(Math.max(r, 0), this.rows - 1);
    const cc = Math.min(Math.max(c, 0), this.cols - 1);
    const rect = this.cells[cr][cc].getBoundingClientRect();
    const { w, h } = this._cellSize();
    return {
      x: rect.left - wrapRect.left + w / 2 + (c - cc) * (w + 2),
      y: rect.top - wrapRect.top + h / 2 + (r - cr) * (h + 2),
    };
  }
}
