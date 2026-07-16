// Điều phối Nghe & Đoán Tiếng Anh: máy đọc 1 câu tiếng Anh ngắn (giọng en-US thật),
// bé chạm đúng hình phù hợp trong 4 lựa chọn — lọc được theo chủ đề (trái cây / món ăn /
// quán ăn & mua sắm / ngày lễ / giải trí) hoặc chơi lẫn cả 5 chủ đề ("Tất cả").

import {
  TOPICS, tuningFor, makeGame, currentRound, chooseOption,
} from './nghedoan.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  filterRow: $('filterRow'), options: $('options'), sentenceCap: $('sentenceCap'), btnListen: $('btnListen'),
  btnNew: $('btnNew'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
  hudScore: $('hudScore'), hudRound: $('hudRound'), hudStreak: $('hudStreak'), hudLevel: $('hudLevel'),
  overlay: $('overlay'), ovEmoji: $('ovEmoji'), ovText: $('ovText'), btnPlay: $('btnPlay'),
};

const state = { topic: 'all', level: 0, game: null, startedAt: Date.now(), instruction: '', busy: false };
bindMute(() => sfx.muted);

function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/** Đọc câu/từ TIẾNG ANH bằng giọng en-US thật (không đọc kiểu giọng Việt). */
function speakEn(text, rate = 0.85) {
  speak(text, { lang: 'en-US', rate });
}

/* ===== Bộ lọc chủ đề ===== */

function buildFilterRow() {
  els.filterRow.innerHTML = '';
  const makeBtn = (id, label) => {
    const btn = document.createElement('button');
    btn.className = `filter-btn${state.topic === id ? ' active' : ''}`;
    btn.textContent = label;
    btn.addEventListener('click', () => {
      if (state.topic === id) return;
      sfx.select();
      state.topic = id;
      state.level = 0;
      buildFilterRow();
      startRound();
    });
    return btn;
  };
  els.filterRow.appendChild(makeBtn('all', `🌐 ${t('nghedoan.topic.all', 'Tất cả')}`));
  for (const topic of TOPICS) {
    els.filterRow.appendChild(makeBtn(topic.id, `${topic.icon} ${topic.label}`));
  }
}

/* ===== Vẽ vòng chơi ===== */

function renderRound() {
  const round = currentRound(state.game);
  if (!round) return;
  els.sentenceCap.textContent = '';
  els.options.innerHTML = '';
  for (const opt of round.options) {
    const btn = document.createElement('button');
    btn.className = 'opt-btn';
    btn.textContent = opt.emoji;
    btn.dataset.id = opt.id;
    btn.addEventListener('click', () => onPick(opt, btn));
    els.options.appendChild(btn);
  }
}

function updateHud() {
  const g = state.game;
  els.hudScore.textContent = g.score;
  els.hudRound.textContent = `${g.roundIndex}/${g.rounds.length}`;
  els.hudStreak.textContent = g.streak;
  els.hudLevel.textContent = `${t('daovang.level', 'Màn')} ${g.level + 1}`;
}

/* ===== Tương tác ===== */

function onPick(opt, btn) {
  if (state.busy) return;
  const g = state.game;
  if (!g || g.over) return;
  const round = currentRound(g);
  state.busy = true;

  const ev = chooseOption(g, opt.id);
  const buttons = [...els.options.querySelectorAll('.opt-btn')];
  for (const b of buttons) {
    if (b.dataset.id === round.target.id) b.classList.add('correct');
    else b.classList.add('dim');
  }
  if (!ev.correct) {
    btn.classList.remove('dim');
    btn.classList.add('wrong');
  }

  if (ev.correct) {
    sfx.match(1);
    els.sentenceCap.textContent = `${round.target.sentence}  —  ${round.target.sentenceVi}`;
    speakEn(round.target.sentence);
  } else {
    sfx.fail();
    els.sentenceCap.textContent = `${round.target.sentence}  —  ${round.target.sentenceVi}`;
    setTimeout(() => speakEn(round.target.sentence), 250);
  }
  updateHud();

  setTimeout(() => {
    state.busy = false;
    if (ev.gameDone) endRound();
    else {
      renderRound();
      updateHud();
      setTimeout(() => speakEn(currentRound(g).target.sentence), 200);
    }
  }, 1300);
}

els.btnListen.addEventListener('click', () => {
  sfx.select();
  const round = currentRound(state.game);
  if (round) speakEn(round.target.sentence);
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
  const g = state.game;
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'nghedoan',
    result: g.won ? 'win' : 'loss',
    score: g.score,
    level: g.level + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (g.won) {
    sfx.levelWin();
    confetti();
    els.ovEmoji.textContent = '🏆';
    els.ovText.textContent = `${t('nghedoan.win', 'Giỏi quá, bé đoán đúng rất nhiều câu!')}\n⭐ ${g.score} · 🔥 ${g.bestStreak}`;
    els.btnPlay.textContent = t('xepchu.next', 'MÀN TIẾP ▶');
    speak(t('nghedoan.win', 'Giỏi quá, bé đoán đúng rất nhiều câu!'));
  } else {
    sfx.gameOver();
    els.ovEmoji.textContent = '💪';
    els.ovText.textContent = `${t('nghedoan.tryagain', 'Nghe kỹ hơn rồi thử lại nhé!')}\n⭐ ${g.score} · 🔥 ${g.bestStreak}`;
    els.btnPlay.textContent = t('nghedoan.retry', 'CHƠI LẠI ▶');
    speak(t('nghedoan.tryagain', 'Nghe kỹ hơn rồi thử lại nhé!'));
    state.level = -1; // startRound sẽ ++ về lại 0, giữ nguyên độ khó
  }
  els.overlay.classList.remove('hidden');
}

function startRound() {
  els.overlay.classList.add('hidden');
  state.busy = false;
  state.game = makeGame(state.topic, state.level, Math.random);
  state.startedAt = Date.now();
  renderRound();
  updateHud();
  setTimeout(() => speakEn(currentRound(state.game).target.sentence), 300);
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
buildFilterRow();
sayInstruction(t('nghedoan.help', 'Máy sẽ đọc một câu tiếng Anh ngắn — bé nghe thật kỹ rồi chạm vào hình đúng trong 4 hình bên dưới nhé! Chọn đúng liên tiếp 3 lần sẽ được điểm thưởng đó. Có thể lọc theo chủ đề trái cây, món ăn, quán ăn, ngày lễ hoặc giải trí ở hàng nút trên cùng.'));
startRound();

// Hook cho e2e test
window.__nghedoan = { state, startRound };
