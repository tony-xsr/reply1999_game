// Đồng hồ đếm ngược của mỗi level — điều khiển thanh thời gian.

export class Timer {
  /**
   * @param {number} seconds - tổng thời gian level
   * @param {{onTimeout?:Function, onTick?:(t:Timer)=>void}} handlers
   */
  constructor(seconds, { onTimeout, onTick } = {}) {
    this.total = seconds;
    this.remaining = seconds;
    this.onTimeout = onTimeout;
    this.onTick = onTick;
    this._id = null;
    this._last = 0;
  }

  start() {
    this.pause();
    this._last = Date.now();
    this._id = setInterval(() => this._step(), 200);
    this.onTick?.(this);
  }

  _step() {
    const now = Date.now();
    this.remaining -= (now - this._last) / 1000;
    this._last = now;
    if (this.remaining <= 0) {
      this.remaining = 0;
      this.pause();
      this.onTick?.(this);
      this.onTimeout?.();
      return;
    }
    this.onTick?.(this);
  }

  /** Cộng thêm thời gian (thưởng khi ăn cặp), không vượt quá tổng. */
  add(seconds) {
    this.remaining = Math.min(this.total, this.remaining + seconds);
    this.onTick?.(this);
  }

  pause() {
    if (this._id) {
      clearInterval(this._id);
      this._id = null;
    }
  }

  resume() {
    if (!this._id && this.remaining > 0) {
      this._last = Date.now();
      this._id = setInterval(() => this._step(), 200);
    }
  }

  get ratio() {
    return this.total ? Math.max(0, this.remaining / this.total) : 0;
  }

  get running() {
    return this._id != null;
  }
}
