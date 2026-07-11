// Âm thanh tự sinh bằng Web Audio API — không cần file mp3.

const MUTE_KEY = 'pika.muted';

let ctx = null;
let muted = false;
try { muted = localStorage.getItem(MUTE_KEY) === '1'; } catch { /* ignore */ }

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

/** Phát 1 nốt: tần số, độ dài (s), dạng sóng, âm lượng, trễ (s). */
function tone(freq, dur, type = 'sine', gain = 0.12, delay = 0) {
  if (muted) return;
  const a = ac();
  if (!a) return;
  const t0 = a.currentTime + delay;
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.connect(g).connect(a.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export const sfx = {
  get muted() { return muted; },

  toggleMute() {
    muted = !muted;
    try { localStorage.setItem(MUTE_KEY, muted ? '1' : '0'); } catch { /* ignore */ }
    return muted;
  },

  select() { tone(660, 0.06, 'square', 0.06); },

  match(combo = 1) {
    const lift = Math.min(combo, 5) * 60;
    tone(520 + lift, 0.09, 'sine', 0.1);
    tone(780 + lift, 0.12, 'sine', 0.1, 0.07);
  },

  fail() { tone(170, 0.16, 'sawtooth', 0.06); },

  shuffle() {
    [300, 420, 540].forEach((f, i) => tone(f, 0.05, 'sine', 0.08, i * 0.06));
  },

  levelWin() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.16, 'triangle', 0.11, i * 0.12));
  },

  gameOver() {
    [420, 340, 260, 180].forEach((f, i) => tone(f, 0.22, 'sawtooth', 0.05, i * 0.16));
  },
};
