// Điều phối Văn Hóa & Địa Lý Việt Nam: bản đồ 3 miền / món ăn ba miền /
// trang trí Tết (tự do, không chấm điểm) / lật thẻ đèn lồng Trung Thu.

import {
  REGIONS, makeMapSet,
  makeFoodSet,
  TET_STICKERS, currentFestivalSeason, makeLanternDeck,
} from './vanhoa.js';
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
  tabs: { 'ban-do': $('tabBanDo'), 'mon-an': $('tabMonAn'), tet: $('tabTet'), 'den-long': $('tabDenLong') },
  dots: $('dots'), question: $('question'), field: $('field'), tray: $('tray'),
  btnSay: $('btnSay'), btnSound: $('btnSound'),
  cheer: $('cheer'), cheerText: $('cheerText'), btnAgain: $('btnAgain'),
};

const QTOTAL = 8;

const state = {
  mode: 'ban-do',
  q: null,
  set: [],
  qIndex: 0,
  firstTry: 0,
  wrongThisQ: false,
  saySentence: '',
  startedAt: Date.now(),
  lantern: null,
};

bindMute(() => sfx.muted);

/* ===== Khung chung (dùng cho bản-đồ & món-ăn — 2 trò có chấm điểm) ===== */

function renderDots() {
  els.dots.classList.remove('hidden');
  els.dots.innerHTML = '';
  for (let i = 0; i < QTOTAL; i++) {
    const d = document.createElement('span');
    d.className = `dot${i < state.qIndex ? ' ok' : ''}${i === state.qIndex ? ' now' : ''}`;
    els.dots.appendChild(d);
  }
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

function wrong(el) {
  state.wrongThisQ = true;
  sfx.fail();
  el.classList.remove('shake');
  void el.offsetWidth;
  el.classList.add('shake');
}

function win(emoji, text, score, sayText) {
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'vanhoa',
    result: 'win',
    score,
    level: 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  sfx.levelWin();
  confetti();
  els.cheerText.textContent = text;
  els.cheer.classList.remove('hidden');
  speak(sayText);
}

function finishQuizSet() {
  win('🏆', `${t('hocvui.right', 'Đúng ngay lần đầu')}: ${state.firstTry}/${QTOTAL} ⭐`, state.firstTry * 10,
    'Giỏi quá! Bé hiểu biết về Việt Nam nhiều lắm!');
}

function questionDone(delay = 1500) {
  if (!state.wrongThisQ) state.firstTry++;
  state.wrongThisQ = false;
  state.qIndex++;
  renderDots();
  if (state.qIndex >= QTOTAL) setTimeout(finishQuizSet, delay);
  else setTimeout(nextQuestion, delay);
}

function nextQuestion() {
  RENDER[state.mode]();
}

const RENDER = {};

/* ===== 1. Bản Đồ Việt Nam Bé ===== */

const MAP_PATHS = {
  bac: 'M70,10 L190,10 L210,50 L195,95 L165,120 L175,150 L85,150 L95,120 L65,95 L50,50 Z',
  trung: 'M85,150 L175,150 L168,200 L160,260 L168,320 L82,320 L90,260 L82,200 Z',
  nam: 'M82,320 L168,320 L195,355 L215,400 L200,455 L160,485 L100,485 L60,455 L45,400 L65,355 Z',
};
const MAP_LANDMARK_POS = { bac: [130, 80], trung: [128, 235], nam: [130, 400] };
const MAP_REGION_FILL = { bac: '#f6c453', trung: '#7cc576', nam: '#5aa9e6' };
const MAP_ISLANDS = [
  { name: 'Hoàng Sa', x: 232, y: 210 },
  { name: 'Trường Sa', x: 236, y: 370 },
];

RENDER['ban-do'] = () => {
  const q = state.set[state.qIndex];
  state.q = q;
  els.question.textContent = q.type === 'landmark'
    ? `${q.region.landmark.icon} ${q.region.landmark.name} (${q.region.landmark.desc}) — ${t('vanhoa.q.whichregion', 'ở miền nào?')}`
    : `${t('vanhoa.q.findregion', 'Chạm vào')} ${q.region.name} nhé!`;

  els.field.innerHTML = '';
  els.tray.innerHTML = '';

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 260 520');
  svg.setAttribute('class', 'vn-map');

  const sea = document.createElementNS(svgNS, 'rect');
  sea.setAttribute('width', '260');
  sea.setAttribute('height', '520');
  sea.setAttribute('rx', '16');
  sea.setAttribute('fill', '#cdeef7');
  svg.appendChild(sea);

  for (const region of REGIONS) {
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', MAP_PATHS[region.id]);
    path.setAttribute('fill', MAP_REGION_FILL[region.id]);
    path.setAttribute('stroke', '#5d5370');
    path.setAttribute('stroke-width', '3');
    path.setAttribute('class', 'vn-region');
    path.dataset.region = region.id;
    path.addEventListener('click', () => onMapPick(region.id, path));
    svg.appendChild(path);

    const [lx, ly] = MAP_LANDMARK_POS[region.id];
    const label = document.createElementNS(svgNS, 'text');
    label.setAttribute('x', lx);
    label.setAttribute('y', ly);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('font-size', '30');
    label.setAttribute('style', 'pointer-events:none');
    label.textContent = region.landmark.icon;
    svg.appendChild(label);
  }

  for (const isl of MAP_ISLANDS) {
    const dot = document.createElementNS(svgNS, 'circle');
    dot.setAttribute('cx', isl.x);
    dot.setAttribute('cy', isl.y);
    dot.setAttribute('r', '7');
    dot.setAttribute('fill', '#fff');
    dot.setAttribute('stroke', '#c2410c');
    dot.setAttribute('stroke-width', '2');
    dot.setAttribute('class', 'vn-island');
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      sfx.select();
      speak(`${isl.name} là quần đảo của Việt Nam!`);
    });
    svg.appendChild(dot);
  }

  els.field.appendChild(svg);
  state.saySentence = els.question.textContent;
  speak(state.saySentence);
};

function onMapPick(id, pathEl) {
  const q = state.q;
  if (id !== q.region.id) return wrong(pathEl);
  sfx.match(2);
  pathEl.classList.add('correct-flash');
  speak(`Đúng rồi! ${q.region.name}!`);
  questionDone(1400);
  return null;
}

/* ===== 2. Món Ăn Ba Miền ===== */

RENDER['mon-an'] = () => {
  const q = state.set[state.qIndex];
  state.q = q;
  els.field.innerHTML = '';
  els.tray.innerHTML = '';

  if (q.kind === 'match') {
    els.question.textContent = t('vanhoa.q.match', 'Ghép đúng tên món ăn nhé!');
    q.matchedCount = 0;
    let selected = null;

    const grid = document.createElement('div');
    grid.className = 'pic-grid';
    for (const item of q.pictures) {
      const pic = document.createElement('button');
      pic.className = 'pic-card';
      pic.dataset.word = item.emoji;
      pic.textContent = item.emoji;
      pic.addEventListener('click', () => {
        if (pic.classList.contains('matched') || !selected) return;
        if (selected.dataset.word === pic.dataset.word) {
          pic.classList.add('matched');
          selected.classList.add('used');
          selected.classList.remove('selected');
          const usedWord = selected.dataset.vi;
          selected = null;
          sfx.match(2);
          speak(usedWord);
          q.matchedCount++;
          if (q.matchedCount === q.pictures.length) questionDone(1000);
        } else {
          wrong(pic);
        }
      });
      grid.appendChild(pic);
    }
    els.field.appendChild(grid);

    const wordRow = document.createElement('div');
    wordRow.className = 'word-row';
    for (const item of q.words) {
      const card = document.createElement('button');
      card.className = 'word-card';
      card.dataset.word = item.emoji;
      card.dataset.vi = item.vi;
      card.textContent = item.vi.toUpperCase();
      card.addEventListener('click', () => {
        document.querySelectorAll('.word-card.selected').forEach((c) => c.classList.remove('selected'));
        card.classList.add('selected');
        selected = card;
        sfx.select();
        speak(item.vi);
      });
      wordRow.appendChild(card);
    }
    els.tray.appendChild(wordRow);
    state.saySentence = t('vanhoa.q.match', 'Ghép đúng tên món ăn nhé!');
  } else {
    els.question.textContent = t('vanhoa.q.foodregion', 'Món này thuộc miền nào?');
    const card = document.createElement('div');
    card.className = 'situ-card';
    card.innerHTML = `<div class="s-emoji">${q.item.emoji}</div><div class="s-text">${q.item.vi.toUpperCase()}</div>`;
    els.field.appendChild(card);
    for (const opt of q.options) {
      const btn = document.createElement('button');
      btn.className = 'face-btn';
      btn.innerHTML = `<span class="f-emoji">🗺️</span><span class="f-name">${opt.name}</span>`;
      btn.addEventListener('click', () => {
        if (opt.id !== q.answer) return wrong(btn);
        sfx.match(2);
        speak(`${q.item.vi} là món ăn ${opt.name}!`);
        questionDone();
        return null;
      });
      els.tray.appendChild(btn);
    }
    state.saySentence = q.item.vi;
  }
  speak(state.saySentence);
};

/* ===== 3. Trang Trí Tết (tự do — không chấm điểm) ===== */

function startTetFree() {
  els.dots.classList.add('hidden');
  els.cheer.classList.add('hidden');
  state.startedAt = Date.now();
  els.question.textContent = t('vanhoa.tet.title', '🎨 Trang trí cây mai/đào — chơi tự do nhé!');

  els.field.innerHTML = '';
  const tree = document.createElement('div');
  tree.className = 'tet-tree';
  tree.innerHTML = '<div class="tet-trunk">🌳</div>';
  els.field.appendChild(tree);
  const note = document.createElement('div');
  note.className = 'tet-free-note';
  note.textContent = t('vanhoa.tet.note', 'Chạm hình để trang trí — chạm lại vào hình đã dán để bỏ đi nhé!');
  els.field.appendChild(note);

  els.tray.innerHTML = '';
  const palette = document.createElement('div');
  palette.className = 'sticker-palette';
  for (const icon of TET_STICKERS) {
    const btn = document.createElement('button');
    btn.className = 'sticker-btn';
    btn.textContent = icon;
    btn.addEventListener('click', () => {
      const deco = document.createElement('span');
      deco.className = 'tet-deco';
      deco.textContent = icon;
      deco.style.left = `${8 + Math.random() * 78}%`;
      deco.style.top = `${8 + Math.random() * 74}%`;
      deco.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;
      deco.addEventListener('click', () => { deco.remove(); sfx.select(); });
      tree.appendChild(deco);
      sfx.select();
    });
    palette.appendChild(btn);
  }
  els.tray.appendChild(palette);

  const clearBtn = document.createElement('button');
  clearBtn.className = 'big-btn big-btn--ghost';
  clearBtn.textContent = t('vanhoa.tet.clear', '🧹 Xóa hết');
  clearBtn.addEventListener('click', () => {
    tree.querySelectorAll('.tet-deco').forEach((d) => d.remove());
    sfx.shuffle();
  });
  els.tray.appendChild(clearBtn);

  speak('Trang trí cây mai đào cho thật đẹp nhé! Chơi tự do, không cần đúng sai đâu!');
}

/** Rời tab Tết: ghi thời gian chơi, KHÔNG tính vào tỷ lệ thắng (kiểu 'quit'). */
function endTetFreeSession() {
  const seconds = (Date.now() - state.startedAt) / 1000;
  if (seconds < 1) return;
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({ mode: 'vanhoa', result: 'quit', score: 0, level: 1, seconds });
}

/* ===== 4. Đèn Lồng Trung Thu (lật thẻ tìm cặp) ===== */

function startLantern() {
  els.dots.classList.add('hidden');
  els.cheer.classList.add('hidden');
  state.startedAt = Date.now();
  state.lantern = { deck: makeLanternDeck(), open: [], matched: 0, moves: 0, busy: false };
  els.question.textContent = t('vanhoa.lantern.title', '🏮 Lật tìm cặp lồng đèn Trung Thu!');

  els.field.innerHTML = '';
  const grid = document.createElement('div');
  grid.className = 'lantern-grid';
  for (const card of state.lantern.deck) {
    const btn = document.createElement('button');
    btn.className = 'card';
    btn.innerHTML = `<div class="card-inner"><div class="card-face card-back">❓</div><div class="card-face card-front">${card.face}</div></div>`;
    btn.addEventListener('click', () => flipLantern(card, btn));
    grid.appendChild(btn);
  }
  els.field.appendChild(grid);
  els.tray.innerHTML = '';

  state.saySentence = t('vanhoa.lantern.title', '🏮 Lật tìm cặp lồng đèn Trung Thu!');
  speak('Lật 2 thẻ tìm đúng cặp lồng đèn Trung Thu nhé!');
}

function flipLantern(card, btn) {
  const g = state.lantern;
  if (g.busy || btn.classList.contains('open') || btn.classList.contains('matched')) return;
  btn.classList.add('open');
  sfx.select();
  g.open.push({ card, btn });
  if (g.open.length < 2) return;

  const [a, b] = g.open;
  g.open = [];
  g.moves++;
  if (a.card.pairKey === b.card.pairKey) {
    a.btn.classList.add('matched');
    b.btn.classList.add('matched');
    g.matched++;
    sfx.match(2);
    if (g.matched === g.deck.length / 2) setTimeout(finishLantern, 500);
  } else {
    g.busy = true;
    sfx.fail();
    setTimeout(() => {
      a.btn.classList.remove('open');
      b.btn.classList.remove('open');
      g.busy = false;
    }, 800);
  }
}

function finishLantern() {
  win('🏮', `${t('lathinh.moves', 'Số lượt')}: ${state.lantern.moves} 🏮`,
    Math.max(10, 80 - state.lantern.moves * 3),
    'Giỏi quá! Tìm được hết các cặp đèn lồng rồi!');
}

/* ===== Điều phối tab ===== */

function selectTab(mode) {
  if (state.mode === 'tet' && mode !== 'tet') endTetFreeSession();
  sfx.select();
  state.mode = mode;
  for (const [k, el] of Object.entries(els.tabs)) el.classList.toggle('active', k === mode);
  els.btnSay.style.visibility = (mode === 'tet' || mode === 'den-long') ? 'hidden' : 'visible';

  if (mode === 'tet') { startTetFree(); return; }
  if (mode === 'den-long') { startLantern(); return; }

  state.qIndex = 0;
  state.firstTry = 0;
  state.wrongThisQ = false;
  state.startedAt = Date.now();
  els.cheer.classList.add('hidden');
  state.set = mode === 'ban-do' ? makeMapSet(QTOTAL) : makeFoodSet(QTOTAL);
  renderDots();
  nextQuestion();
}

/* ===== Huy hiệu "đúng mùa" ===== */

const season = currentFestivalSeason();
if (season === 'tet') els.tabs.tet.classList.add('in-season');
if (season === 'trungthu') els.tabs['den-long'].classList.add('in-season');

/* ===== Nút ===== */

for (const [mode, el] of Object.entries(els.tabs)) {
  el.addEventListener('click', () => selectTab(mode));
}
els.btnSay.addEventListener('click', () => speak(state.saySentence));
els.btnAgain.addEventListener('click', () => { sfx.select(); selectTab(state.mode); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});
window.addEventListener('beforeunload', () => { if (state.mode === 'tet') endTetFreeSession(); });

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
selectTab('ban-do');

// Hook cho e2e test
window.__vanhoa = { state, selectTab, endTetFreeSession };
