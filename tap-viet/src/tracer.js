// Engine tập viết: vẽ nét mẫu lên "bảng con", bé rê ngón tay/chuột theo nét.
// Tiến độ đo bằng chiều dài cung trên polyline, chỉ được tiến về phía trước;
// lệch khỏi nét quá xa → làm lại nét đó (không phạt nặng, chỉ rung nhẹ).

const TOL = 11;          // độ lệch cho phép (đơn vị 0..100)
const START_TOL = 14;    // vùng đặt bút ở đầu nét
const AHEAD = 16;        // cửa sổ nhìn trước trên nét (chống nhảy cóc)
const FINISH_RATIO = 0.93;

export class Tracer {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} cb - { onStrokeDone(i), onFail(), onComplete(stars) }
   */
  constructor(canvas, cb = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.cb = cb;
    this.strokes = [];       // [{pts:[[x,y]], cum:[len...], total}] tọa độ canvas
    this.strokeIdx = 0;      // nét đang viết
    this.progress = 0;       // chiều dài đã viết của nét hiện tại
    this.tracking = false;
    this.done = false;
    this.fails = 0;
    this.devSum = 0;         // tổng độ lệch (chấm sao)
    this.devN = 0;
    this.scale = 1;

    canvas.addEventListener('pointerdown', (e) => this._down(e));
    canvas.addEventListener('pointermove', (e) => this._move(e));
    canvas.addEventListener('pointerup', () => this._up());
    canvas.addEventListener('pointercancel', () => this._up());
  }

  /** Nạp 1 ký tự: strokes trong hệ 0..100 → scale vào canvas (chừa lề). */
  setGlyph(strokes) {
    const S = this.canvas.width;
    const margin = S * 0.08;
    this.scale = (S - margin * 2) / 100;
    this.strokes = strokes.map((pts) => {
      const p = pts.map(([x, y]) => [margin + x * this.scale, margin + y * this.scale]);
      const cum = [0];
      for (let i = 1; i < p.length; i++) {
        cum.push(cum[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]));
      }
      return { pts: p, cum, total: cum[cum.length - 1] };
    });
    this.strokeIdx = 0;
    this.progress = 0;
    this.tracking = false;
    this.done = false;
    this.fails = 0;
    this.devSum = 0;
    this.devN = 0;
    this.draw();
  }

  get tolPx() { return TOL * this.scale; }

  /** Điểm trên nét tại chiều dài cung d. */
  _pointAt(stroke, d) {
    const { pts, cum } = stroke;
    if (d <= 0) return pts[0];
    if (d >= stroke.total) return pts[pts.length - 1];
    let i = 1;
    while (cum[i] < d) i++;
    const t = (d - cum[i - 1]) / (cum[i] - cum[i - 1]);
    return [
      pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t,
      pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t,
    ];
  }

  /** Điểm gần nhất (theo cung) từ vị trí con trỏ, trong cửa sổ [from..to]. */
  _nearest(stroke, x, y, from, to) {
    let best = { d: from, dist: Infinity };
    const step = Math.max(2, this.scale);
    for (let d = from; d <= Math.min(to, stroke.total); d += step) {
      const [px, py] = this._pointAt(stroke, d);
      const dist = Math.hypot(px - x, py - y);
      if (dist < best.dist) best = { d, dist };
    }
    return best;
  }

  _pos(e) {
    const r = this.canvas.getBoundingClientRect();
    return [
      ((e.clientX - r.left) * this.canvas.width) / r.width,
      ((e.clientY - r.top) * this.canvas.height) / r.height,
    ];
  }

  _down(e) {
    if (this.done) return;
    this.canvas.setPointerCapture?.(e.pointerId);
    const [x, y] = this._pos(e);
    const stroke = this.strokes[this.strokeIdx];
    // Đặt bút gần vị trí đang viết dở (hoặc đầu nét)
    const [sx, sy] = this._pointAt(stroke, this.progress);
    if (Math.hypot(sx - x, sy - y) <= START_TOL * this.scale) {
      this.tracking = true;
    } else {
      this.draw(true); // nhấp nháy điểm bắt đầu để gợi ý
    }
  }

  _move(e) {
    if (!this.tracking || this.done) return;
    const [x, y] = this._pos(e);
    const stroke = this.strokes[this.strokeIdx];
    const near = this._nearest(stroke, x, y, Math.max(0, this.progress - 6 * this.scale), this.progress + AHEAD * this.scale);
    if (near.dist > this.tolPx) {
      // Lệch khỏi nét → làm lại nét này
      this.tracking = false;
      this.fails++;
      this.progress = 0;
      this.draw();
      this.cb.onFail?.();
      return;
    }
    this.devSum += near.dist / this.tolPx;
    this.devN++;
    this.progress = Math.max(this.progress, near.d);
    this.draw();
    if (this.progress >= stroke.total * FINISH_RATIO) this._finishStroke();
  }

  _up() {
    if (!this.tracking || this.done) return;
    this.tracking = false;
    const stroke = this.strokes[this.strokeIdx];
    if (this.progress >= stroke.total * FINISH_RATIO) {
      this._finishStroke();
    } else if (this.progress > 0) {
      // Nhấc bút giữa chừng: giữ tiến độ, cho đặt bút viết tiếp
      this.draw();
    }
  }

  _finishStroke() {
    const i = this.strokeIdx;
    this.progress = this.strokes[i].total;
    this.tracking = false;
    if (i + 1 < this.strokes.length) {
      this.strokeIdx = i + 1;
      this.progress = 0;
      this.draw();
      this.cb.onStrokeDone?.(i);
    } else {
      this.done = true;
      this.draw();
      this.cb.onComplete?.(this.stars());
    }
  }

  /** Chấm sao 1–3 theo độ lệch trung bình + số lần phải làm lại. */
  stars() {
    const avg = this.devN ? this.devSum / this.devN : 1;
    if (avg < 0.42 && this.fails === 0) return 3;
    if (avg < 0.62 && this.fails <= 2) return 2;
    return 1;
  }

  /* ===== Vẽ ===== */

  draw(pulseStart = false) {
    const { ctx, canvas } = this;
    const S = canvas.width;
    ctx.clearRect(0, 0, S, S);
    const lw = 7 * this.scale * 0.55;

    // 1) Nét mẫu (phấn mờ)
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const s of this.strokes) this._path(s.pts, 'rgba(255,255,255,0.28)', lw);

    // 2) Nét đã viết xong (phấn vàng)
    for (let i = 0; i < this.strokeIdx; i++) {
      this._path(this.strokes[i].pts, '#ffe36e', lw);
    }

    const cur = this.strokes[this.strokeIdx];
    if (!cur) return;

    // 3) Phần đã viết của nét hiện tại
    if (this.progress > 0 || this.done) {
      const upto = this.done ? cur.total : this.progress;
      const pts = [];
      const step = Math.max(2, this.scale);
      for (let d = 0; d <= upto; d += step) pts.push(this._pointAt(cur, d));
      pts.push(this._pointAt(cur, upto));
      this._path(pts, '#ffe36e', lw);
    }
    if (this.done) return;

    // 4) Chấm bắt đầu (đánh số nét) + mũi tên hướng đi
    const [sx, sy] = this._pointAt(cur, this.progress);
    const [ax, ay] = this._pointAt(cur, Math.min(cur.total, this.progress + 12 * this.scale));
    const r = (pulseStart ? 9 : 7) * this.scale * 0.55;
    // mũi tên
    const ang = Math.atan2(ay - sy, ax - sx);
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const tip = [sx + Math.cos(ang) * r * 2.6, sy + Math.sin(ang) * r * 2.6];
    ctx.moveTo(sx + Math.cos(ang) * r * 1.3, sy + Math.sin(ang) * r * 1.3);
    ctx.lineTo(tip[0], tip[1]);
    ctx.lineTo(tip[0] + Math.cos(ang + 2.5) * r, tip[1] + Math.sin(ang + 2.5) * r);
    ctx.moveTo(tip[0], tip[1]);
    ctx.lineTo(tip[0] + Math.cos(ang - 2.5) * r, tip[1] + Math.sin(ang - 2.5) * r);
    ctx.stroke();
    // chấm số
    ctx.fillStyle = '#4ade80';
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0b3d20';
    ctx.font = `900 ${r * 1.2}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.strokeIdx + 1, sx, sy + 0.5);
  }

  _path(pts, color, width) {
    const { ctx } = this;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.stroke();
  }
}
