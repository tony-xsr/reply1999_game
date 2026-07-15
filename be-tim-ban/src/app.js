// Điều phối Bé Tìm Bạn: dựng sân đồ vật lộn xộn bằng DOM, chạm tìm đúng số bạn cần tìm
// trước khi hết giờ. Dùng DOM (không dùng canvas) để vẽ vật phẩm — đảm bảo hiện đúng trên
// mọi trình duyệt/thiết bị, kể cả nơi canvas không có sẵn font màu cho emoji.

import { FIELD_W, FIELD_H, makeLevel, tapAt, stepTime } from './betimban.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  board: $('board'), targetRow: $('targetRow'),
  btnNew: $('btnNew'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
  hudTime: $('hudTime'), hudLevel: $('hudLevel'),
  cheer: $('cheer'), cheerEmoji: $('cheerEmoji'), cheerText: $('cheerText'), btnCheerGo: $('btnCheerGo'),
};

const state = { level: 0, game: null, raf: 0, last: 0, itemEls: null, startedAt: Date.now(), instruction: '' };
bindMute(() => sfx.muted);

/** Đọc hướng dẫn + lưu lại để bấm ❓ nghe lại được (bé chưa đọc chữ vẫn chơi được). */
function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

function renderTargets() {
  const g = state.game;
  els.targetRow.innerHTML = '';
  for (const emoji of Object.keys(g.targetsNeeded)) {
    const chip = document.createElement('div');
    const remaining = g.targetsNeeded[emoji];
    chip.className = `target-chip${remaining <= 0 ? ' done' : ''}`;
    chip.innerHTML = `<span>${emoji}</span><span class="tc-count">×${remaining}</span>`;
    els.targetRow.appendChild(chip);
  }
}

function spawnSparkle(x, y) {
  const s = document.createElement('div');
  s.className = 'sparkle';
  s.textContent = '✨';
  s.style.left = `${(x / FIELD_W) * 100}%`;
  s.style.top = `${(y / FIELD_H) * 100}%`;
  els.board.appendChild(s);
  setTimeout(() => s.remove(), 500);
}

function onItemTap(item, div) {
  const g = state.game;
  if (g.over) return;
  const result = tapAt(g, item.x, item.y);
  if (result.hit) {
    sfx.match(2);
    div.remove();
    state.itemEls.delete(item.id);
    spawnSparkle(item.x, item.y);
    speak(result.emoji);
    renderTargets();
    if (g.over) setTimeout(endLevel, 400);
  } else if (result.wrong) {
    sfx.fail();
    div.classList.remove('wrong-flash');
    void div.offsetWidth;
    div.classList.add('wrong-flash');
  }
}

function buildItems() {
  els.board.innerHTML = '';
  state.itemEls = new Map();
  for (const it of state.game.items) {
    const div = document.createElement('button');
    div.className = 'item';
    div.style.left = `${(it.x / FIELD_W) * 100}%`;
    div.style.top = `${(it.y / FIELD_H) * 100}%`;
    div.textContent = it.emoji;
    div.addEventListener('click', () => onItemTap(it, div));
    els.board.appendChild(div);
    state.itemEls.set(it.id, div);
  }
}

function updateHud() {
  const g = state.game;
  els.hudTime.textContent = Math.ceil(g.timeLeft);
  els.hudLevel.textContent = `${t('daovang.level', 'Màn')} ${g.level + 1}`;
}

function loop(now) {
  const dt = Math.min(50, now - state.last);
  state.last = now;
  stepTime(state.game, dt);
  updateHud();
  if (state.game.over) return endLevel();
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
    mode: 'betimban',
    result: g.won ? 'win' : 'quit',
    score: g.score,
    level: g.level + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (g.won) {
    sfx.levelWin();
    confetti();
    els.cheerEmoji.textContent = '🏆';
    els.cheerText.textContent = `${t('betimban.win', 'Tìm hết bạn rồi!')}\n⭐ ${g.score}`;
    els.btnCheerGo.textContent = t('betimban.next', 'MÀN TIẾP ▶');
    els.btnCheerGo.onclick = () => { sfx.select(); state.level++; startLevel(); };
    speak(t('betimban.win', 'Tìm hết bạn rồi!'));
  } else {
    sfx.gameOver();
    els.cheerEmoji.textContent = '⏰';
    els.cheerText.textContent = `${t('betimban.lose', 'Hết giờ rồi, còn bạn chưa tìm ra!')}\n⭐ ${g.score}`;
    els.btnCheerGo.textContent = t('ran.retry', 'CHƠI LẠI ▶');
    els.btnCheerGo.onclick = () => { sfx.select(); state.level = 0; startLevel(); };
    speak(t('betimban.lose', 'Hết giờ rồi, chơi lại nhé!'));
  }
  els.cheer.classList.remove('hidden');
}

function startLevel() {
  els.cheer.classList.add('hidden');
  state.game = makeLevel(state.level, Math.random);
  state.startedAt = Date.now();
  state.last = performance.now();
  buildItems();
  renderTargets();
  updateHud();
  sayInstruction(t('betimban.findhint', 'Tìm cho đủ các bạn ở hàng trên nhé!'));
  state.raf = requestAnimationFrame(loop);
}

/* ===== Nút ===== */

els.btnNew.addEventListener('click', () => { sfx.shuffle(); state.level = 0; startLevel(); });
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
sayInstruction(t('betimban.help', 'Nhìn hàng trên cùng xem cần tìm những bạn nào — rồi chạm đúng bạn đó lẫn trong đám đồ vật để tìm ra hết trước khi hết giờ nhé!'));
startLevel();

// Hook cho e2e test
window.__betimban = { state, startLevel };
