// Điều phối Học Vui: 3 trò (ghép chữ–hình, đếm & so sánh, nghe & tìm),
// học được cả tiếng Việt lẫn tiếng Anh (nút đổi ngôn ngữ học).
// Dùng chung: sfx + hồ sơ/thống kê (pokemon), giọng đọc (to-mau).

import { ALL_ITEMS, COUNTABLE_ITEMS, makeMatchRound, makeCountSet, makeListenQuestion } from './words.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  btnBack: $('btnBack'), btnLang: $('btnLang'), btnSay: $('btnSay'), btnSound: $('btnSound'),
  dots: $('dots'),
  screens: {
    home: $('homeScreen'), match: $('matchScreen'), count: $('countScreen'), listen: $('listenScreen'),
  },
  picGrid: $('picGrid'), wordRow: $('wordRow'),
  countPrompt: $('countPrompt'), countField: $('countField'), answerRow: $('answerRow'),
  btnHear: $('btnHear'), listenGrid: $('listenGrid'),
  cheer: $('cheer'), cheerText: $('cheerText'), btnAgain: $('btnAgain'), btnHome: $('btnHome'),
};

const LANG_KEY = 'hocvui.lang';
const QUESTIONS = 8;
const MATCH_ROUNDS = 3;

const state = {
  screen: 'home',   // home | match | count | listen
  lang: 'vi',       // ngôn ngữ HỌC (độc lập với ngôn ngữ giao diện)
  qIndex: 0,
  qTotal: 0,
  firstTry: 0,      // số câu đúng ngay lần đầu
  wrongThisQ: false,
  startedAt: Date.now(),
  round: null,      // dữ liệu vòng hiện tại (tùy trò)
  selectedWord: null,
};

try { state.lang = localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'vi'; } catch { /* ignore */ }
bindMute(() => sfx.muted);

const word = (item) => (state.lang === 'vi' ? item.vi : item.en);
const speakLang = () => (state.lang === 'vi' ? 'vi-VN' : 'en-US');
const say = (text) => speak(text, { lang: speakLang() });

/* ===== Khung chung: màn hình, chấm tiến độ, đúng/sai ===== */

function showScreen(name) {
  state.screen = name;
  for (const [k, el] of Object.entries(els.screens)) el.classList.toggle('hidden', k !== name);
  els.cheer.classList.add('hidden');
  els.btnBack.hidden = name === 'home';
  els.btnSay.hidden = name === 'home' || name === 'match';
  els.dots.classList.toggle('hidden', name === 'home');
}

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
    mode: 'hocvui',
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

/* ===== Trò 1: Ghép chữ với hình (chạm-chạm hoặc kéo-thả) ===== */

function startMatch() {
  showScreen('match');
  beginSet(MATCH_ROUNDS);
  nextMatchRound();
}

function nextMatchRound() {
  state.round = makeMatchRound(ALL_ITEMS);
  state.selectedWord = null;
  els.picGrid.innerHTML = '';
  els.wordRow.innerHTML = '';

  for (const item of state.round.pictures) {
    const pic = document.createElement('div');
    pic.className = 'pic-card';
    pic.dataset.word = item.emoji;
    pic.textContent = item.emoji;
    pic.addEventListener('click', () => {
      if (state.selectedWord) tryMatch(state.selectedWord, pic);
    });
    els.picGrid.appendChild(pic);
  }

  for (const item of state.round.words) {
    const card = document.createElement('button');
    card.className = 'word-card';
    card.dataset.word = item.emoji;
    card.textContent = word(item).toUpperCase();
    // Chạm để chọn (dễ cho bé), hoặc kéo thả như games.md mô tả
    card.addEventListener('click', () => {
      document.querySelectorAll('.word-card.selected').forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
      state.selectedWord = card;
      sfx.select();
      say(word(item));
    });
    enableDrag(card);
    els.wordRow.appendChild(card);
  }
}

function tryMatch(wordCard, picCard) {
  if (picCard.classList.contains('matched') || wordCard.classList.contains('used')) return;
  const item = state.round.pictures.find((p) => p.emoji === picCard.dataset.word);
  if (wordCard.dataset.word === picCard.dataset.word) {
    picCard.classList.add('matched', 'pop');
    const tag = document.createElement('div');
    tag.className = 'word-tag';
    tag.textContent = word(item).toUpperCase();
    picCard.appendChild(tag);
    wordCard.classList.add('used');
    wordCard.classList.remove('selected');
    state.selectedWord = null;
    sfx.match(2);
    say(word(item));
    if (els.picGrid.querySelectorAll('.matched').length === state.round.pictures.length) {
      questionDone();
      if (state.qIndex >= state.qTotal) setTimeout(finishSet, 700);
      else setTimeout(nextMatchRound, 900);
    }
  } else {
    wrong(picCard);
  }
}

/** Kéo-thả bằng pointer events: nhấn giữ thẻ chữ → ghost bám theo tay → thả lên hình. */
function enableDrag(card) {
  let ghost = null;
  let hovered = null;

  card.addEventListener('pointerdown', (e) => {
    if (card.classList.contains('used')) return;
    card.setPointerCapture(e.pointerId);
    ghost = null; // chỉ tạo ghost khi bắt đầu di chuyển (phân biệt với chạm)
  });

  card.addEventListener('pointermove', (e) => {
    if (!card.hasPointerCapture?.(e.pointerId) || card.classList.contains('used')) return;
    if (!ghost) {
      ghost = card.cloneNode(true);
      ghost.classList.add('drag-ghost');
      document.body.appendChild(ghost);
      card.classList.add('dragging');
    }
    ghost.style.left = `${e.clientX}px`;
    ghost.style.top = `${e.clientY}px`;
    const under = document.elementFromPoint(e.clientX, e.clientY)?.closest('.pic-card');
    if (hovered && hovered !== under) hovered.classList.remove('hover');
    hovered = under;
    hovered?.classList.add('hover');
  });

  const drop = (e) => {
    if (!ghost) return;
    ghost.remove();
    ghost = null;
    card.classList.remove('dragging');
    hovered?.classList.remove('hover');
    const under = document.elementFromPoint(e.clientX, e.clientY)?.closest('.pic-card');
    hovered = null;
    if (under) tryMatch(card, under);
  };
  card.addEventListener('pointerup', drop);
  card.addEventListener('pointercancel', drop);
}

/* ===== Trò 2: Đếm & so sánh ===== */

function startCount() {
  showScreen('count');
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

/* ===== Trò 3: Nghe & tìm ===== */

function startListen() {
  showScreen('listen');
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

/* ===== Ngôn ngữ học + nút chung ===== */

function refreshLangBtn() {
  els.btnLang.textContent = state.lang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English';
}

function replayPrompt() {
  if (state.screen === 'count' && state.round?.[state.qIndex]) say(countPromptText(state.round[state.qIndex]));
  if (state.screen === 'listen') listenPrompt();
}

const starters = { match: startMatch, count: startCount, listen: startListen };

els.btnLang.addEventListener('click', () => {
  state.lang = state.lang === 'vi' ? 'en' : 'vi';
  try { localStorage.setItem(LANG_KEY, state.lang); } catch { /* ignore */ }
  refreshLangBtn();
  sfx.select();
  if (state.screen !== 'home') starters[state.screen](); // chơi lại lượt bằng ngôn ngữ mới
});
$('modeMatch').addEventListener('click', startMatch);
$('modeCount').addEventListener('click', startCount);
$('modeListen').addEventListener('click', startListen);
els.btnBack.addEventListener('click', () => showScreen('home'));
els.btnHome.addEventListener('click', () => showScreen('home'));
els.btnAgain.addEventListener('click', () => starters[state.screen]());
els.btnSay.addEventListener('click', replayPrompt);
els.btnHear.addEventListener('click', listenPrompt);
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
refreshLangBtn();
showScreen('home');

// Hook cho e2e test
window.__hocvui = { state, startMatch, startCount, startListen, showScreen };
