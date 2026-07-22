// Nghe & Tìm — tách riêng từ hoc-vui/ (trước đây "Học Vui" gộp 3 trò trong 1
// game, nay tách thành 3 game riêng, mỗi game 1 thẻ trong Góc Tiếng Anh. Dùng
// lại NGUYÊN dữ liệu ALL_ITEMS/makeListenQuestion từ hoc-vui/src/words.js
// (không sao chép dữ liệu) — học được cả tiếng Việt lẫn tiếng Anh.

import { ALL_ITEMS, makeListenQuestion } from '../../hoc-vui/src/words.js';
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
  btnLang: $('btnLang'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
  dots: $('dots'),
  btnHear: $('btnHear'), listenGrid: $('listenGrid'),
  cheer: $('cheer'), cheerText: $('cheerText'), btnAgain: $('btnAgain'),
};

const LANG_KEY = 'hocvui.lang';
const QUESTIONS = 8;
const HELP_TEXT = 'Bấm nút loa để nghe tên đồ vật, rồi chạm đúng hình được gọi tên trong lưới hình.';

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

const word = (item) => (state.lang === 'vi' ? item.vi : item.en);
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
    mode: 'nghevatim',
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

function startListen() {
  els.cheer.classList.add('hidden');
  state.instruction = t('nghevatim.help', HELP_TEXT);
  speak(state.instruction);
  beginSet(QUESTIONS);
  nextListenQuestion();
}

function listenPrompt() {
  const { target } = state.round;
  say(state.lang === 'vi' ? `Tìm ${target.vi}!` : `Find the ${target.en}!`);
}

function nextListenQuestion() {
  state.round = makeListenQuestion(ALL_ITEMS, 6);
  els.listenGrid.innerHTML = '';
  for (const item of state.round.grid) {
    const cardEl = document.createElement('button');
    cardEl.className = 'listen-card';
    cardEl.textContent = item.emoji;
    cardEl.addEventListener('click', () => {
      if (item === state.round.target) {
        cardEl.classList.add('right', 'pop');
        sfx.match(2);
        say(word(item));
        questionDone();
        if (state.qIndex >= state.qTotal) setTimeout(finishSet, 700);
        else setTimeout(nextListenQuestion, 900);
      } else {
        wrong(cardEl);
        setTimeout(listenPrompt, 400); // nhắc lại đề
      }
    });
    els.listenGrid.appendChild(cardEl);
  }
  setTimeout(listenPrompt, 350);
}

function refreshLangBtn() {
  els.btnLang.textContent = state.lang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English';
}

els.btnLang.addEventListener('click', () => {
  state.lang = state.lang === 'vi' ? 'en' : 'vi';
  try { localStorage.setItem(LANG_KEY, state.lang); } catch { /* ignore */ }
  refreshLangBtn();
  sfx.select();
  startListen(); // chơi lại lượt bằng ngôn ngữ mới
});
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnAgain.addEventListener('click', startListen);
els.btnHear.addEventListener('click', listenPrompt);
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
refreshLangBtn();
startListen();

// Hook cho e2e test
window.__nghevatim = { state, startListen };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày
