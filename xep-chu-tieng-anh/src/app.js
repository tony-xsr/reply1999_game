// Điều phối Xếp Chữ Tiếng Anh: hiện hình + đọc từ bằng giọng en-US, bé chạm các ô chữ cái
// (xen lẫn chữ nhiễu) theo đúng thứ tự để ghép vào các ô trống — ghép xong đọc lại cả từ.

import {
  makeRound, currentWord, tapTile,
} from './xepchu.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';
import { fixSmartHomeBack } from '../../shared/kid-bar.js';

fixSmartHomeBack();

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  picEmoji: $('picEmoji'), btnListen: $('btnListen'), slots: $('slots'), tiles: $('tiles'),
  btnNew: $('btnNew'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
  hudScore: $('hudScore'), hudWord: $('hudWord'), hudLevel: $('hudLevel'),
  overlay: $('overlay'), ovEmoji: $('ovEmoji'), ovText: $('ovText'), btnPlay: $('btnPlay'),
};

const state = { level: 0, round: null, startedAt: Date.now(), instruction: '' };
bindMute(() => sfx.muted);

/** Đọc hướng dẫn + lưu lại để bấm ❓ nghe lại được. */
function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/** Đọc TỪ TIẾNG ANH bằng giọng en-US thật (không đọc kiểu giọng Việt). */
function speakWord(word) {
  speak(word, { lang: 'en-US', rate: 0.68 });
}

/* ===== Vẽ ===== */

function renderWord() {
  const w = currentWord(state.round);
  if (!w) return;
  els.picEmoji.textContent = w.emoji;
  els.slots.innerHTML = '';
  for (let i = 0; i < w.word.length; i++) {
    const slot = document.createElement('div');
    slot.className = `slot${i < w.filled.length ? ' filled' : ''}`;
    slot.textContent = w.filled[i] || '';
    els.slots.appendChild(slot);
  }
  els.tiles.innerHTML = '';
  for (const tile of w.tiles) {
    const btn = document.createElement('button');
    btn.className = `tile-btn${w.usedKeys.includes(tile.key) ? ' used' : ''}`;
    btn.textContent = tile.char;
    btn.dataset.key = tile.key;
    btn.addEventListener('click', () => onTapTile(tile.key, btn));
    els.tiles.appendChild(btn);
  }
}

function updateHud() {
  const r = state.round;
  els.hudScore.textContent = r.score;
  els.hudWord.textContent = `${r.wordsDone}/${r.words.length}`;
  els.hudLevel.textContent = `${t('daovang.level', 'Màn')} ${r.level + 1}`;
}

/* ===== Tương tác ===== */

function onTapTile(key, btn) {
  const r = state.round;
  if (!r || r.over) return;
  const ev = tapTile(r, key);
  if (!ev.correct) {
    sfx.fail();
    btn.classList.remove('shake');
    void btn.offsetWidth;
    btn.classList.add('shake');
    return;
  }
  sfx.match(1);
  renderWord();
  updateHud();
  if (ev.wordDone) {
    const doneWord = r.words[r.wordIndex - 1];
    setTimeout(() => {
      sfx.levelWin();
      speakWord(doneWord.word);
    }, 150);
    if (ev.roundDone) {
      setTimeout(endRound, 900);
    } else {
      setTimeout(() => {
        renderWord();
        speakWord(currentWord(r).word);
      }, 750);
    }
  }
}

els.btnListen.addEventListener('click', () => {
  sfx.select();
  const w = currentWord(state.round);
  if (w) speakWord(w.word);
});

/* ===== Vòng đời màn chơi ===== */

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

function endRound() {
  const r = state.round;
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'xepchu',
    result: 'win',
    score: r.score,
    level: r.level + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  sfx.levelWin();
  confetti();
  els.ovEmoji.textContent = '🏆';
  els.ovText.textContent = `${t('xepchu.win', 'Xếp giỏi quá, hết từ rồi!')}\n⭐ ${r.score}`;
  els.btnPlay.textContent = t('xepchu.next', 'MÀN TIẾP ▶');
  speak(t('xepchu.win', 'Xếp giỏi quá, hết từ rồi!'));
  els.overlay.classList.remove('hidden');
}

function startRound() {
  els.overlay.classList.add('hidden');
  state.round = makeRound(state.level, Math.random);
  state.startedAt = Date.now();
  renderWord();
  updateHud();
  setTimeout(() => speakWord(currentWord(state.round).word), 300);
}

/* ===== Nút ===== */

els.btnPlay.addEventListener('click', () => {
  sfx.select();
  state.level++;
  startRound();
});
els.btnNew.addEventListener('click', () => { sfx.shuffle(); state.level = 0; startRound(); });
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
sayInstruction(t('xepchu.help', 'Nhìn hình rồi nghe từ tiếng Anh — sau đó chạm vào các ô chữ cái đúng theo thứ tự để ghép vào ô trống bên trên! Coi chừng có vài chữ cái GÂY NHIỄU không thuộc từ đó đâu nhé. Bấm nút loa để nghe lại từ bất cứ lúc nào!'));
startRound();

// Hook cho e2e test
window.__xepchu = { state, startRound };
