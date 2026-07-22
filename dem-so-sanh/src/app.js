// Đếm & So Sánh — tách riêng từ hoc-vui/ (trước đây "Học Vui" gộp 3 trò
// trong 1 game, nay tách thành 3 game riêng, mỗi game 1 thẻ trong Góc Tiếng
// Anh). Dùng lại NGUYÊN dữ liệu COUNTABLE_ITEMS/makeCountSet từ hoc-vui/src/
// words.js (không sao chép dữ liệu) — học được cả tiếng Việt lẫn tiếng Anh.

import { COUNTABLE_ITEMS, makeCountSet } from '../../hoc-vui/src/words.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';
import { mountKidFeatures } from '../../shared/kid-bar.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  btnLang: $('btnLang'), btnSay: $('btnSay'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
  dots: $('dots'),
  countPrompt: $('countPrompt'), countField: $('countField'), answerRow: $('answerRow'),
  cheer: $('cheer'), cheerText: $('cheerText'), btnAgain: $('btnAgain'),
};

const LANG_KEY = 'hocvui.lang';
const QUESTIONS = 8;
const HELP_TEXT = 'Nhìn số lượng đồ vật rồi chạm vào đáp án đúng trong các nút bên dưới.';

const state = {
  lang: 'vi',
  qIndex: 0,
  qTotal: 0,
  firstTry: 0,
  wrongThisQ: false,
  startedAt: Date.now(),
  round: null,
  instruction: '',
};

try { state.lang = localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'vi'; } catch { /* ignore */ }
bindMute(() => sfx.muted);

const speakLang = () => (state.lang === 'vi' ? 'vi-VN' : 'en-US');
const say = (text) => speak(text, { lang: speakLang() });

function renderDots() {
  els.dots.innerHTML = '';
  for (let i = 0; i < state.qTotal; i++) {
    const d = document.createElement('span');
    d.className = `dot${i < state.qIndex ? ' ok' : ''}${i === state.qIndex ? ' now' : ''}`;
    els.dots.appendChild(d);
  }
}

function beginSet(total) {
  state.qIndex = 0;
  state.qTotal = total;
  state.firstTry = 0;
  state.wrongThisQ = false;
  state.startedAt = Date.now();
  renderDots();
}

function questionDone() {
  if (!state.wrongThisQ) state.firstTry++;
  state.wrongThisQ = false;
  state.qIndex++;
  renderDots();
}

function wrong(el) {
  state.wrongThisQ = true;
  sfx.fail();
  el.classList.remove('shake');
  void el.offsetWidth;
  el.classList.add('shake');
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

function finishSet() {
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'demsosanh',
    result: 'win',
    score: state.firstTry * 10,
    level: state.qTotal,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  sfx.levelWin();
  confetti();
  els.cheerText.textContent = `${t('hocvui.right', 'Đúng ngay lần đầu')}: ${state.firstTry}/${state.qTotal} ⭐`;
  els.cheer.classList.remove('hidden');
  say(state.lang === 'vi' ? 'Giỏi quá! Bé làm xong rồi!' : 'Great job! You did it!');
}

function startCount() {
  els.cheer.classList.add('hidden');
  state.instruction = t('demsosanh.help', HELP_TEXT);
  speak(state.instruction);
  beginSet(QUESTIONS);
  state.round = makeCountSet(COUNTABLE_ITEMS, QUESTIONS);
  renderCountQuestion();
}

function emojiGroup(emoji, n) {
  const grp = document.createElement('div');
  grp.className = 'grp';
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.textContent = emoji;
    grp.appendChild(s);
  }
  return grp;
}

function countPromptText(q) {
  if (state.lang === 'en') {
    if (q.type === 'count') return 'How many?';
    if (q.type === 'compare') return 'Which side has more?';
    return `${q.a} ${q.plus ? 'plus' : 'minus'} ${q.b} equals?`;
  }
  if (q.type === 'count') return `Có mấy ${q.item.vi}?`;
  if (q.type === 'compare') return 'Bên nào nhiều hơn?';
  return `${q.a} ${q.plus ? 'cộng' : 'trừ'} ${q.b} bằng mấy?`;
}

function renderCountQuestion() {
  const q = state.round[state.qIndex];
  els.countPrompt.textContent = countPromptText(q);
  els.countField.innerHTML = '';
  els.answerRow.innerHTML = '';
  say(countPromptText(q));

  const answerBtn = (value) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = value;
    btn.addEventListener('click', () => {
      if (value === q.answer) rightAnswer(btn);
      else wrong(btn);
    });
    return btn;
  };

  if (q.type === 'compare') {
    for (const [i, side] of q.sides.entries()) {
      const basket = document.createElement('div');
      basket.className = 'basket';
      basket.appendChild(emojiGroup(side.item.emoji, side.n));
      basket.addEventListener('click', () => {
        if (i === q.answer) rightAnswer(basket);
        else wrong(basket);
      });
      els.countField.appendChild(basket);
    }
    return;
  }

  if (q.type === 'count') {
    els.countField.appendChild(emojiGroup(q.item.emoji, q.n));
  } else {
    els.countField.appendChild(emojiGroup(q.item.emoji, q.a));
    const op = document.createElement('span');
    op.className = 'op';
    op.textContent = q.plus ? '+' : '−';
    els.countField.appendChild(op);
    els.countField.appendChild(emojiGroup(q.item.emoji, q.b));
  }
  for (const opt of q.options) els.answerRow.appendChild(answerBtn(opt));
}

function rightAnswer(el) {
  sfx.match(2);
  el.classList.add('pop');
  say(state.lang === 'vi' ? 'Đúng rồi!' : 'Correct!');
  questionDone();
  if (state.qIndex >= state.qTotal) setTimeout(finishSet, 600);
  else setTimeout(renderCountQuestion, 700);
}

function replayPrompt() {
  if (state.round?.[state.qIndex]) say(countPromptText(state.round[state.qIndex]));
}

function refreshLangBtn() {
  els.btnLang.textContent = state.lang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English';
}

els.btnLang.addEventListener('click', () => {
  state.lang = state.lang === 'vi' ? 'en' : 'vi';
  try { localStorage.setItem(LANG_KEY, state.lang); } catch { /* ignore */ }
  refreshLangBtn();
  sfx.select();
  startCount(); // chơi lại lượt bằng ngôn ngữ mới
});
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnAgain.addEventListener('click', startCount);
els.btnSay.addEventListener('click', replayPrompt);
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
refreshLangBtn();
startCount();

// Hook cho e2e test
window.__demsosanh = { state, startCount };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày
