// Điều phối Pháo Nước Giữ Đảo: vẽ đảo cát giữa biển, chạm đâu pháo phun bóng nước tới đó,
// nút NẠP NƯỚC to. Toàn bộ hình (đảo, lâu đài cát, thuyền giấy, robot đồ chơi) tự vẽ canvas.

import {
  FIELD_W, FIELD_H, CX, CY, R_ISLAND, CASTLE_HP, MAX_AMMO, RELOAD_MS, SPLASH_R,
  makeLevel, fire, reload, stepGame,
} from './phaonuoc.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  wrap: $('boardWrap'), canvas: $('gameCanvas'), btnReload: $('btnReload'),
  btnNew: $('btnNew'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
  hudScore: $('hudScore'), hudWave: $('hudWave'), hudCastle: $('hudCastle'), hudLevel: $('hudLevel'),
  overlay: $('overlay'), ovEmoji: $('ovEmoji'), ovText: $('ovText'), btnPlay: $('btnPlay'),
};
const ctx = els.canvas.getContext('2d');

const state = {
  level: 0, game: null, raf: 0, last: 0, startedAt: Date.now(), instruction: '',
  splashes: [], // vòng nước loang: {x, y, r, life}
  candies: [], // kẹo văng khi robot bung: {x, y, vx, vy, color, life}
  shake: 0, // rung nhẹ khi lâu đài bị quậy
};
bindMute(() => sfx.muted);

/** Đọc hướng dẫn + lưu lại để bấm ❓ nghe lại được (bé chưa đọc chữ vẫn chơi được). */
function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/* ===== Vẽ (toàn bộ tự vẽ) ===== */

function drawSea(now) {
  const sea = ctx.createRadialGradient(CX, CY, R_ISLAND, CX, CY, 460);
  sea.addColorStop(0, '#5fb8e0');
  sea.addColorStop(1, '#1e6fa8');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  // gợn sóng tròn lan ra
  ctx.strokeStyle = 'rgba(255,255,255,0.14)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    const r = R_ISLAND + 40 + ((now / 30 + i * 80) % 320);
    ctx.beginPath();
    ctx.arc(CX, CY, r, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawIsland(g) {
  // bãi cát
  const sand = ctx.createRadialGradient(CX, CY, 20, CX, CY, R_ISLAND);
  sand.addColorStop(0, '#f5dfa8');
  sand.addColorStop(1, '#e0bd72');
  ctx.fillStyle = sand;
  ctx.beginPath();
  ctx.arc(CX, CY, R_ISLAND, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 4;
  ctx.stroke();
  // lâu đài cát (mờ dần theo máu)
  const hurt = 1 - g.castleHp / CASTLE_HP;
  ctx.save();
  ctx.translate(CX - 52, CY - 6);
  ctx.globalAlpha = 1 - hurt * 0.25;
  ctx.fillStyle = '#d9a05e';
  ctx.fillRect(0, 0, 34, 26 - hurt * 8);
  ctx.fillRect(4, -12, 8, 14);
  ctx.fillRect(22, -12, 8, 14);
  if (g.castleHp >= 2) {
    ctx.fillStyle = '#e53935';
    ctx.beginPath();
    ctx.moveTo(8, -12); ctx.lineTo(20, -8); ctx.lineTo(8, -4);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
  // cây dừa nhỏ
  ctx.save();
  ctx.translate(CX + 48, CY - 18);
  ctx.strokeStyle = '#8a5a34';
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(0, 24); ctx.quadraticCurveTo(6, 4, 2, -8); ctx.stroke();
  ctx.fillStyle = '#2f9e44';
  for (let i = 0; i < 5; i++) {
    ctx.save();
    ctx.translate(2, -8);
    ctx.rotate((i / 5) * Math.PI * 2);
    ctx.beginPath();
    ctx.ellipse(12, 0, 13, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawTurret(g) {
  // bệ pháo + bình nước + nòng quay theo hướng ngắm
  ctx.save();
  ctx.translate(CX, CY + 14);
  ctx.fillStyle = '#4e6a8a';
  ctx.beginPath();
  ctx.arc(0, 0, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.rotate(g.aimAngle);
  ctx.fillStyle = '#3f8fc4';
  ctx.fillRect(0, -7, 34, 14);
  ctx.fillStyle = '#7fd4ff';
  ctx.fillRect(28, -5, 8, 10);
  ctx.restore();
  // bình nước hiển thị số đạn
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(CX - 44, CY + 40, 88, 12);
  const pct = g.reloadingMs > 0 ? 1 - g.reloadingMs / RELOAD_MS : g.ammo / MAX_AMMO;
  ctx.fillStyle = g.reloadingMs > 0 ? '#ffd93d' : '#4dabf7';
  ctx.fillRect(CX - 42, CY + 42, 84 * Math.max(0, Math.min(1, pct)), 8);
}

function drawEnemy(e, now) {
  ctx.save();
  ctx.translate(e.x, e.y);
  const rock = Math.sin(now / 200 + e.wobble) * 0.12;
  ctx.rotate(Math.atan2(CY - e.y, CX - e.x) + rock);
  if (e.type === 'boat') {
    // thuyền giấy trắng
    ctx.fillStyle = '#fdfdfd';
    ctx.beginPath();
    ctx.moveTo(-16, 6); ctx.lineTo(16, 6); ctx.lineTo(8, -4); ctx.lineTo(-8, -4);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#e8e8e8';
    ctx.beginPath();
    ctx.moveTo(0, -4); ctx.lineTo(0, -16); ctx.lineTo(9, -4);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-16, -1, 32, 7);
  } else {
    // robot đồ chơi vuông vức, bigbot to hơn
    const s = e.type === 'bigbot' ? 1.5 : 1;
    ctx.scale(s, s);
    ctx.fillStyle = e.type === 'bigbot' ? '#b0509e' : '#ff8a3d';
    ctx.fillRect(-12, -12, 24, 24);
    ctx.fillStyle = '#fff';
    ctx.fillRect(-8, -7, 6, 6);
    ctx.fillRect(2, -7, 6, 6);
    ctx.fillStyle = '#241e2e';
    ctx.fillRect(-6, -5, 2.5, 2.5);
    ctx.fillRect(4, -5, 2.5, 2.5);
    ctx.fillRect(-5, 4, 10, 3);
    ctx.strokeStyle = '#241e2e';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(0, -18); ctx.stroke();
    ctx.fillStyle = '#ffd93d';
    ctx.beginPath(); ctx.arc(0, -19, 3, 0, Math.PI * 2); ctx.fill();
    // vết ướt khi mất máu
    if (e.hp < (e.type === 'bigbot' ? 4 : 2)) {
      ctx.fillStyle = 'rgba(79, 171, 247, 0.4)';
      ctx.fillRect(-12, -12, 24, 24);
    }
  }
  ctx.restore();
}

function drawEffects() {
  for (const s of state.splashes) {
    s.r += 3;
    s.life -= 1;
    ctx.globalAlpha = Math.max(0, s.life / 22);
    ctx.strokeStyle = '#bfe9ff';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  state.splashes = state.splashes.filter((s) => s.life > 0);
  for (const c of state.candies) {
    c.x += c.vx; c.y += c.vy; c.vy += 0.25; c.life -= 1;
    ctx.globalAlpha = Math.max(0, c.life / 30);
    ctx.fillStyle = c.color;
    ctx.beginPath();
    ctx.arc(c.x, c.y, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  state.candies = state.candies.filter((c) => c.life > 0);
}

function draw(now) {
  ctx.save();
  if (state.shake > 0) {
    ctx.translate((Math.random() - 0.5) * state.shake, (Math.random() - 0.5) * state.shake);
    state.shake = Math.max(0, state.shake - 0.6);
  }
  drawSea(now);
  const g = state.game;
  if (g) {
    drawIsland(g);
    for (const e of g.enemies) drawEnemy(e, now);
    // bóng nước đang bay
    for (const s2 of g.shots) {
      ctx.fillStyle = '#4dabf7';
      ctx.beginPath();
      ctx.arc(s2.x, s2.y, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.beginPath();
      ctx.arc(s2.x - 3, s2.y - 3, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    drawTurret(g);
  }
  drawEffects();
  ctx.restore();
}

/* ===== HUD & vòng lặp ===== */

function updateHud() {
  const g = state.game;
  els.hudScore.textContent = g.score;
  els.hudWave.textContent = `${Math.min(g.waveIndex + 1, g.waves.length)}/${g.waves.length}`;
  els.hudCastle.textContent = `🏰${'❤️'.repeat(Math.max(0, g.castleHp))}${'🖤'.repeat(CASTLE_HP - Math.max(0, g.castleHp))}`;
  els.hudLevel.textContent = `${t('daovang.level', 'Màn')} ${g.level + 1}`;
  els.btnReload.classList.toggle('reloading', g.reloadingMs > 0);
  els.btnReload.textContent = g.reloadingMs > 0
    ? `💧 ${t('phaonuoc.reloading', 'ĐANG NẠP...')}`
    : `💧 ${t('phaonuoc.reload', 'NẠP NƯỚC')} (${g.ammo})`;
}

function loop(now) {
  const dtMs = Math.min(50, now - state.last);
  state.last = now;
  const g = state.game;
  const before = g.enemies.map((e) => ({ x: e.x, y: e.y }));
  const ev = stepGame(g, dtMs, Math.random);
  for (const sp of ev.splash) {
    sfx.match(1);
    state.splashes.push({ x: sp.x, y: sp.y, r: 12, life: 22 });
  }
  if (ev.killed) {
    sfx.match(3);
    const nowSet = new Set(g.enemies.map((e) => `${Math.round(e.x)},${Math.round(e.y)}`));
    const colors = ['#ff5aa8', '#f5c542', '#35d435', '#42c5f5', '#b06af5'];
    for (const p of before) {
      if (!nowSet.has(`${Math.round(p.x)},${Math.round(p.y)}`)) {
        for (let i = 0; i < 8; i++) {
          state.candies.push({
            x: p.x, y: p.y,
            vx: (Math.random() - 0.5) * 6, vy: -Math.random() * 4,
            color: colors[i % colors.length], life: 30,
          });
        }
      }
    }
  }
  if (ev.castleHit) { sfx.fail(); state.shake = 9; }
  if (ev.waveStart && g.waveIndex > 0) {
    sfx.shuffle();
    speak(`${t('phaonuoc.wave', 'Đợt sóng mới!')}`);
  }
  if (ev.reloaded) sfx.levelWin();
  updateHud();
  draw(now);
  if (g.over) return endLevel();
  state.raf = requestAnimationFrame(loop);
}

function confetti() {
  const colors = ['#ff5aa8', '#f5c542', '#35d435', '#42c5f5', '#b06af5'];
  for (let i = 0; i < 36; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.setProperty('--x', `${Math.random() * 100}vw`);
    p.style.setProperty('--delay', `${Math.random() * 0.5}s`);
    p.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`);
    p.style.background = colors[i % colors.length];
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 2400);
  }
}

function endLevel() {
  cancelAnimationFrame(state.raf);
  const g = state.game;
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'phaonuoc',
    result: g.won ? 'win' : 'quit',
    score: g.score,
    level: g.level + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (g.won) {
    sfx.levelWin();
    confetti();
    els.ovEmoji.textContent = '🏖️';
    els.ovText.textContent = `${t('phaonuoc.win', 'Giữ được đảo rồi, lâu đài cát an toàn!')}\n⭐ ${g.score}`;
    els.btnPlay.textContent = t('phaonuoc.next', 'MÀN TIẾP ▶');
    speak(t('phaonuoc.win', 'Giữ được đảo rồi, lâu đài cát an toàn!'));
  } else {
    sfx.gameOver();
    els.ovEmoji.textContent = '🏰';
    els.ovText.textContent = `${t('phaonuoc.lose', 'Lâu đài cát bị quậy sập mất rồi!')}\n⭐ ${g.score}`;
    els.btnPlay.textContent = t('ran.retry', 'CHƠI LẠI ▶');
    speak(t('phaonuoc.lose', 'Lâu đài cát bị quậy sập mất rồi, chơi lại nhé!'));
  }
  els.overlay.classList.remove('hidden');
}

function startLevel() {
  els.overlay.classList.add('hidden');
  state.game = makeLevel(state.level, Math.random);
  state.splashes = [];
  state.candies = [];
  state.startedAt = Date.now();
  state.last = performance.now();
  updateHud();
  state.raf = requestAnimationFrame(loop);
}

/* ===== Điều khiển: chạm đâu bắn đó ===== */

els.wrap.addEventListener('pointerdown', (e) => {
  if (e.target.closest('.reload-btn') || e.target.closest('.overlay')) return;
  const g = state.game;
  if (!g || g.over) return;
  const rect = els.canvas.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * FIELD_W;
  const y = ((e.clientY - rect.top) / rect.height) * FIELD_H;
  if (fire(g, x, y)) {
    sfx.select();
    updateHud();
  } else if (g.ammo <= 0 && g.reloadingMs <= 0) {
    speak(t('phaonuoc.empty', 'Hết nước rồi, bấm nạp nước nhé!'));
  }
});
els.btnReload.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  if (state.game && reload(state.game)) {
    sfx.shuffle();
    updateHud();
  }
});

/* ===== Nút ===== */

els.btnPlay.addEventListener('click', () => {
  sfx.select();
  if (state.game && state.game.won) state.level++;
  else if (state.game && state.game.over) state.level = 0;
  startLevel();
});
els.btnNew.addEventListener('click', () => { sfx.shuffle(); state.level = 0; startLevel(); });
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
sayInstruction(t('phaonuoc.help', 'Thuyền giấy và robot đồ chơi đang ập vào từ mọi phía đòi quậy lâu đài cát! Chạm vào đâu là pháo phun bóng nước tới đó — nước văng tung tóe ướt cả cụm luôn. Bắn tám phát là hết bình, nhớ bấm nút nạp nước. Giữ đảo qua hết các đợt sóng nhé!'));
state.game = makeLevel(0, Math.random);
updateHud();
draw(performance.now());

// Hook cho e2e test
window.__phaonuoc = { state, startLevel };
