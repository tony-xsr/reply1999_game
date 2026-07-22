// Ghép Chữ Với Hình — tách riêng từ hoc-vui/ (trước đây "Học Vui" gộp 3 trò
// trong 1 game, nay tách thành 3 game riêng, mỗi game 1 thẻ trong Góc Tiếng
// Anh). Dùng lại NGUYÊN dữ liệu ALL_ITEMS/makeMatchRound từ hoc-vui/src/
// words.js (không sao chép dữ liệu) — học được cả tiếng Việt lẫn tiếng Anh.

import { ALL_ITEMS, makeMatchRound } from '../../hoc-vui/src/words.js';
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
  picGrid: $('picGrid'), wordRow: $('wordRow'),
  cheer: $('cheer'), cheerText: $('cheerText'), btnAgain: $('btnAgain'),
};

const LANG_KEY = 'hocvui.lang';
const MATCH_ROUNDS = 3;
const HELP_TEXT = 'Kéo hoặc chạm thẻ chữ rồi thả đúng vào hình phù hợp — ghép đúng cặp chữ và hình là được điểm!';

const state = {
  lang: 'vi',       // ngôn ngữ HỌC (độc lập với ngôn ngữ giao diện)
  qIndex: 0,
  qTotal: 0,
  firstTry: 0,      // số câu đúng ngay lần đầu
  wrongThisQ: false,
  startedAt: Date.now(),
  round: null,
  selectedWord: null,
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
    mode: 'ghepchuhinh',
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

function startMatch() {
  els.cheer.classList.add('hidden');
  state.instruction = t('ghepchuhinh.help', HELP_TEXT);
  speak(state.instruction);
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
    ghost = null;
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

function refreshLangBtn() {
  els.btnLang.textContent = state.lang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English';
}

els.btnLang.addEventListener('click', () => {
  state.lang = state.lang === 'vi' ? 'en' : 'vi';
  try { localStorage.setItem(LANG_KEY, state.lang); } catch { /* ignore */ }
  refreshLangBtn();
  sfx.select();
  startMatch(); // chơi lại lượt bằng ngôn ngữ mới
});
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnAgain.addEventListener('click', startMatch);
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
refreshLangBtn();
startMatch();

// Hook cho e2e test
window.__ghepchuhinh = { state, startMatch };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày
