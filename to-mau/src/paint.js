// Engine tô màu: vẽ chữ/số to lên canvas, tự chia thành các vùng tô
// bằng các đường kẻ chéo (không cần vẽ tay SVG cho từng ký tự).
//
// Cách hoạt động:
//  1. Vẽ glyph (fillText) lên canvas ẩn → mặt nạ pixel "trong chữ".
//  2. Vẽ viền chữ + các đường kẻ chéo (clip trong chữ) → pixel "đường biên".
//  3. BFS đánh số vùng: pixel trong chữ, không phải biên, dính nhau = 1 vùng.
//  4. Chạm vào đâu → tra vùng ở đó → tô cả vùng (ghi thẳng vào ImageData).

const INK = [58, 48, 64];        // màu viền/đường kẻ (#3a3040)
const BLANK = [255, 255, 255];   // vùng chưa tô
const MIN_REGION_PX = 700;       // vùng nhỏ hơn ngưỡng → nhập vào biên (tránh vụn khó chạm)

export class Painter {
  /** @param {HTMLCanvasElement} canvas - canvas hiển thị (kích thước cố định, CSS scale) */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { willReadFrequently: true });
    this.W = canvas.width;
    this.H = canvas.height;
    this.regionMap = null;   // Int32Array: -1 = ngoài, -2 = biên, >=0 = id vùng
    this.regions = [];       // [{pixels:Uint32Array, color:null|hex, target:number, anchor:{x,y}}]
    this.img = null;         // ImageData đang hiển thị
  }

  /**
   * Dựng bàn tô mới cho 1 ký tự.
   * @param {string} glyph - 'A', 'Ă', '7'...
   * @param {number} stripeGap - khoảng cách đường kẻ chia vùng (px)
   */
  build(glyph, stripeGap = 96) {
    const { W, H } = this;
    const off = document.createElement('canvas');
    off.width = W;
    off.height = H;
    const c = off.getContext('2d', { willReadFrequently: true });

    // Font đậm tròn, co chữ vừa khung
    const font = (size) => `900 ${size}px "Arial Rounded MT Bold", "Helvetica Neue", Arial, sans-serif`;
    let size = H * 0.82;
    c.font = font(size);
    const w = c.measureText(glyph).width;
    if (w > W * 0.86) size *= (W * 0.86) / w;

    c.textAlign = 'center';
    c.textBaseline = 'middle';

    // 1) Mặt nạ glyph
    c.clearRect(0, 0, W, H);
    c.font = font(size);
    c.fillStyle = '#000';
    c.fillText(glyph, W / 2, H / 2 + size * 0.04);
    const mask = c.getImageData(0, 0, W, H).data;

    // 2) Biên: viền chữ + lưới kẻ chéo 2 hướng (chỉ giữ phần trong chữ)
    c.clearRect(0, 0, W, H);
    c.strokeStyle = '#000';
    c.lineWidth = 7;
    c.strokeText(glyph, W / 2, H / 2 + size * 0.04);
    c.lineWidth = 6;
    c.beginPath();
    for (let d = -H; d < W + H; d += stripeGap) {
      c.moveTo(d, 0); c.lineTo(d + H, H);         // chéo xuôi
      c.moveTo(d + H, 0); c.lineTo(d, H);         // chéo ngược
    }
    c.stroke();
    const lines = c.getImageData(0, 0, W, H).data;

    // 3) Phân loại pixel + đánh số vùng bằng BFS
    const N = W * H;
    const map = new Int32Array(N).fill(-1);
    for (let i = 0; i < N; i++) {
      if (mask[i * 4 + 3] > 127) map[i] = lines[i * 4 + 3] > 127 ? -2 : -3; // -3 = chưa gán vùng
    }

    const regions = [];
    const queue = new Int32Array(N);
    for (let start = 0; start < N; start++) {
      if (map[start] !== -3) continue;
      const id = regions.length;
      const pixels = [];
      let head = 0;
      let tail = 0;
      queue[tail++] = start;
      map[start] = id;
      while (head < tail) {
        const p = queue[head++];
        pixels.push(p);
        const x = p % W;
        if (x > 0 && map[p - 1] === -3) { map[p - 1] = id; queue[tail++] = p - 1; }
        if (x < W - 1 && map[p + 1] === -3) { map[p + 1] = id; queue[tail++] = p + 1; }
        if (p >= W && map[p - W] === -3) { map[p - W] = id; queue[tail++] = p - W; }
        if (p < N - W && map[p + W] === -3) { map[p + W] = id; queue[tail++] = p + W; }
      }
      regions.push({ pixels, color: null, target: 0, anchor: null });
    }

    // Vùng quá nhỏ → nhập vào biên cho đỡ vụn; đánh số lại các vùng còn giữ
    const kept = [];
    for (const r of regions) {
      if (r.pixels.length < MIN_REGION_PX) {
        for (const p of r.pixels) map[p] = -2;
      } else {
        kept.push(r);
      }
    }
    kept.forEach((r, id) => {
      for (const p of r.pixels) map[p] = id;
      r.pixels = Uint32Array.from(r.pixels);
      r.anchor = this._anchorOf(r.pixels, map, id);
    });

    this.regionMap = map;
    this.regions = kept;

    // 4) Vẽ nền ban đầu: biên mực đậm, vùng trắng, ngoài trong suốt
    const img = this.ctx.createImageData(W, H);
    const d = img.data;
    for (let i = 0; i < N; i++) {
      const v = map[i];
      if (v === -1) continue; // ngoài chữ: trong suốt
      const [r, g, b] = v === -2 ? INK : BLANK;
      d[i * 4] = r; d[i * 4 + 1] = g; d[i * 4 + 2] = b; d[i * 4 + 3] = 255;
    }
    this.img = img;
    this.ctx.clearRect(0, 0, W, H);
    this.ctx.putImageData(img, 0, 0);
  }

  /** Điểm đặt nhãn số: pixel của vùng xa biên nhất theo trục dọc (đủ tốt cho nhãn nhỏ). */
  _anchorOf(pixels, map, id) {
    const { W } = this;
    let best = pixels[0];
    let bestDepth = -1;
    // Lấy mẫu thưa cho nhanh
    for (let i = 0; i < pixels.length; i += 7) {
      const p = pixels[i];
      let depth = 0;
      while (depth < 40
        && map[p - (depth + 1) * W] === id
        && map[p + (depth + 1) * W] === id
        && map[p - (depth + 1)] === id
        && map[p + (depth + 1)] === id) depth++;
      if (depth > bestDepth) { bestDepth = depth; best = p; }
    }
    return { x: best % W, y: Math.floor(best / W) };
  }

  /** Gán màu mục tiêu 1..n cho từng vùng (chế độ tô theo số). */
  assignTargets(colorCount) {
    this.regions.forEach((r, i) => { r.target = (i % colorCount) + 1; });
  }

  /** Vùng tại tọa độ canvas (x,y) — trả id vùng hoặc -1. */
  regionAt(x, y) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    if (xi < 0 || yi < 0 || xi >= this.W || yi >= this.H) return -1;
    const v = this.regionMap[yi * this.W + xi];
    return v >= 0 ? v : -1;
  }

  /** Tô cả vùng bằng 1 màu hex. */
  paintRegion(id, hex) {
    const r = this.regions[id];
    if (!r) return;
    r.color = hex;
    const [cr, cg, cb] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    const d = this.img.data;
    for (const p of r.pixels) {
      d[p * 4] = cr; d[p * 4 + 1] = cg; d[p * 4 + 2] = cb;
    }
    this.ctx.putImageData(this.img, 0, 0);
  }

  /** Tô tự do xong hết chưa (mọi vùng có màu khác trắng)? */
  isComplete() {
    return this.regions.every((r) => r.color && r.color !== '#ffffff');
  }

  /** Tô theo số: vùng nào đã tô đúng màu mục tiêu? */
  isCompleteByNumber(paletteHexes) {
    return this.regions.every((r) => r.color === paletteHexes[r.target - 1]);
  }
}
