// Điều phối Khoa Học Khám Phá Vui: 3 trò (vòng đời & mùa / pha màu / chìm-nổi),
// 8 câu mỗi lượt. Dùng chung sfx + giọng đọc + hồ sơ/stats.

import { COLORS, pairKey, makeNatureSet, makeMixSet, makeFloatSet } from './khoahoc.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  tabs: { 'vong-doi': $('tabVongDoi'), 'pha-mau': $('tabPhaMau'), 'chim-noi': $('tabChimNoi') },
  dots: $('dots'), question: $('question'), field: $('field'), tray: $('tray'),
  btnSay: $('btnSay'), btnSound: $('btnSound'),
  cheer: $('cheer'), cheerText: $('cheerText'), btnAgain: $('btnAgain'),
};

const QTOTAL = 8;

const state = {
  mode: 'vong-doi',
  q: null,
  set: [],
  qIndex: 0,
  firstTry: 0,
  wrongThisQ: false,
  saySentence: '',
  startedAt: Date.now(),
};

bindMute(() => sfx.muted);

/* ===== Khung chung ===== */

function renderDots() {
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

function finishSet() {
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'khoahoc',
    result: 'win',
    score: state.firstTry * 10,
    level: QTOTAL,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  sfx.levelWin();
  confetti();
  els.cheerText.textContent = `${t('hocvui.right', 'Đúng ngay lần đầu')}: ${state.firstTry}/${QTOTAL} ⭐`;
  els.cheer.classList.remove('hidden');
  speak('Giỏi quá! Bé là nhà khoa học nhí!');
}

function questionDone(delay = 1500) {
  if (!state.wrongThisQ) state.firstTry++;
  state.wrongThisQ = false;
  state.qIndex++;
  renderDots();
  if (state.qIndex >= QTOTAL) setTimeout(finishSet, delay);
  else setTimeout(nextQuestion, delay);
}

function startSet(mode) {
  state.mode = mode;
  state.qIndex = 0;
  state.firstTry = 0;
  state.wrongThisQ = false;
  state.startedAt = Date.now();
  els.cheer.classList.add('hidden');
  for (const [k, el] of Object.entries(els.tabs)) el.classList.toggle('active', k === mode);
  if (mode === 'vong-doi') state.set = makeNatureSet(QTOTAL);
  else if (mode === 'pha-mau') state.set = makeMixSet(QTOTAL);
  else state.set = makeFloatSet(QTOTAL);
  renderDots();
  nextQuestion();
}

function nextQuestion() {
  RENDER[state.mode]();
}

const RENDER = {};

/* ===== 1. Vòng Đời & Mùa ===== */

RENDER['vong-doi'] = () => {
  const q = state.set[state.qIndex];
  state.q = q;
  els.field.innerHTML = '';
  els.tray.innerHTML = '';

  if (q.kind === 'cycle') {
    els.question.innerHTML = `${q.cycle.icon} <b>${q.cycle.name}</b> — ${t('kynang.q.order', 'Sắp đúng thứ tự nhé!')}`;
    q.next = 0;
    const line = document.createElement('div');
    line.className = 'word-line';
    const slots = [];
    for (let i = 0; i < q.cycle.stages.length; i++) {
      const slot = document.createElement('div');
      slot.className = 'chunk slot';
      slot.textContent = i + 1;
      line.appendChild(slot);
      slots.push(slot);
    }
    els.field.appendChild(line);

    for (const stage of q.shuffled) {
      const btn = document.createElement('button');
      btn.className = 'step-btn';
      btn.innerHTML = `<span class="st-emoji">${stage.icon}</span><span>${stage.text}</span>`;
      btn.addEventListener('click', () => {
        if (stage.correctIndex !== q.next) return wrong(btn);
        const slot = slots[q.next];
        slot.textContent = stage.icon;
        slot.classList.remove('slot');
        slot.classList.add('filled');
        btn.classList.add('used');
        sfx.match(2);
        speak(stage.text);
        q.next++;
        if (q.next >= q.cycle.stages.length) questionDone(1600);
        return null;
      });
      els.tray.appendChild(btn);
    }
    state.saySentence = `${q.cycle.name}. ${t('kynang.q.order', 'Sắp đúng thứ tự nhé!')}`;
  } else if (q.type === 'i2s') {
    els.question.textContent = t('khoahoc.q.i2s', 'Hoạt động này hợp với mùa nào?');
    const card = document.createElement('div');
    card.className = 'situ-card';
    card.innerHTML = `<div class="s-emoji">${q.item.emoji}</div><div class="s-text">${q.item.text}</div>`;
    els.field.appendChild(card);
    for (const opt of q.options) {
      const btn = document.createElement('button');
      btn.className = 'face-btn';
      btn.innerHTML = `<span class="f-emoji">${opt.icon}</span><span class="f-name">${opt.name}</span>`;
      btn.addEventListener('click', () => {
        if (opt.id !== q.answer) return wrong(btn);
        sfx.match(2);
        speak(`${q.item.text} — đúng là ${opt.name}!`);
        questionDone();
        return null;
      });
      els.tray.appendChild(btn);
    }
    state.saySentence = q.item.text;
  } else {
    els.question.textContent = t('khoahoc.q.s2i', 'Mùa này thường có hoạt động gì?');
    const card = document.createElement('div');
    card.className = 'situ-card';
    card.innerHTML = `<div class="s-emoji">${q.season.icon}</div><div class="s-text">${q.season.name.toUpperCase()}</div>`;
    els.field.appendChild(card);
    for (const opt of q.options) {
      const btn = document.createElement('button');
      btn.className = 'situ-btn';
      btn.innerHTML = `<span class="b-emoji">${opt.emoji}</span><span class="b-text">${opt.text}</span>`;
      btn.addEventListener('click', () => {
        if (opt !== q.answer) return wrong(btn);
        sfx.match(2);
        speak(`${opt.text} — đúng là ${q.season.name}!`);
        questionDone();
        return null;
      });
      els.tray.appendChild(btn);
    }
    state.saySentence = `${q.season.name.charAt(0).toUpperCase()}${q.season.name.slice(1)}`;
  }
  speak(state.saySentence);
};

/* ===== 2. Pha Màu Diệu Kỳ ===== */

RENDER['pha-mau'] = () => {
  const q = state.set[state.qIndex];
  state.q = q;
  els.field.innerHTML = '';
  els.tray.innerHTML = '';

  if (q.type === 'predict') {
    els.question.textContent = t('khoahoc.q.predict', 'Trộn 2 màu này ra màu gì?');
    const wrap = document.createElement('div');
    wrap.className = 'mix-drops';
    const dropA = document.createElement('div');
    dropA.className = 'drop';
    dropA.style.background = COLORS[q.mix.a].hex;
    const plus = document.createElement('div');
    plus.className = 'mix-plus';
    plus.textContent = '+';
    const dropB = document.createElement('div');
    dropB.className = 'drop';
    dropB.style.background = COLORS[q.mix.b].hex;
    const eq = document.createElement('div');
    eq.className = 'mix-plus';
    eq.textContent = '=';
    const bowl = document.createElement('div');
    bowl.className = 'mix-bowl';
    bowl.innerHTML = '<div class="liquid" style="background:#fdf8ee"></div>';
    wrap.append(dropA, plus, dropB, eq, bowl);
    els.field.appendChild(wrap);

    for (const id of q.options) {
      const btn = document.createElement('button');
      btn.className = 'color-swatch';
      btn.innerHTML = `<span class="c-circle" style="background:${COLORS[id].hex}"></span><span class="c-name">${COLORS[id].name}</span>`;
      btn.addEventListener('click', () => {
        if (id !== q.answer) return wrong(btn);
        bowl.querySelector('.liquid').style.background = COLORS[id].hex;
        sfx.match(2);
        speak(`${COLORS[q.mix.a].name} pha với ${COLORS[q.mix.b].name} ra màu ${COLORS[id].name}!`);
        questionDone(1700);
        return null;
      });
      els.tray.appendChild(btn);
    }
    state.saySentence = `Màu ${COLORS[q.mix.a].name} cộng màu ${COLORS[q.mix.b].name}?`;
  } else {
    els.question.textContent = t('khoahoc.q.reverse', 'Màu này được pha từ 2 màu nào?');
    const wrap = document.createElement('div');
    wrap.className = 'mix-drops';
    const result = document.createElement('div');
    result.className = 'result-swatch';
    result.style.background = COLORS[q.mix.result].hex;
    wrap.appendChild(result);
    els.field.appendChild(wrap);

    for (const pair of q.options) {
      const btn = document.createElement('button');
      btn.className = 'pair-swatch';
      btn.innerHTML = `<span class="p-circles">
        <span class="c-circle" style="background:${COLORS[pair[0]].hex}"></span>
        <span class="c-circle" style="background:${COLORS[pair[1]].hex}"></span>
      </span><span class="c-name">${COLORS[pair[0]].name} + ${COLORS[pair[1]].name}</span>`;
      btn.addEventListener('click', () => {
        if (pairKey(pair) !== pairKey(q.answer)) return wrong(btn);
        sfx.match(2);
        speak(`Đúng rồi! ${COLORS[pair[0]].name} pha ${COLORS[pair[1]].name} ra màu ${COLORS[q.mix.result].name}!`);
        questionDone(1700);
        return null;
      });
      els.tray.appendChild(btn);
    }
    state.saySentence = `Màu ${COLORS[q.mix.result].name} được pha từ 2 màu nào?`;
  }
  speak(state.saySentence);
};

/* ===== 3. Chìm Hay Nổi? ===== */

RENDER['chim-noi'] = () => {
  const item = state.set[state.qIndex];
  state.q = item;
  els.question.textContent = t('khoahoc.q.float', 'Vật này sẽ CHÌM hay NỔI?');

  els.field.innerHTML = '';
  const tank = document.createElement('div');
  tank.className = 'tank';
  const obj = document.createElement('div');
  obj.className = 'obj';
  obj.textContent = item.emoji;
  tank.appendChild(obj);
  els.field.appendChild(tank);
  const textCol = document.createElement('div');
  textCol.style.cssText = 'display:flex;flex-direction:column;gap:4px;align-items:center;';
  const nameLine = document.createElement('div');
  nameLine.className = 'explain-line';
  nameLine.style.fontWeight = '900';
  nameLine.textContent = item.name;
  const explainLine = document.createElement('div');
  explainLine.className = 'explain-line';
  textCol.append(nameLine, explainLine);
  els.field.appendChild(textCol);

  els.tray.innerHTML = '';
  const row = document.createElement('div');
  row.className = 'guess-row';
  const answer = (guessFloats, btn) => {
    obj.classList.add(item.floats ? 'floats' : 'sinks');
    if (guessFloats === item.floats) {
      btn.classList.add('correct-flash');
      sfx.match(2);
      explainLine.textContent = item.explain;
      speak(item.explain);
      questionDone(2100);
    } else {
      wrong(btn);
      explainLine.textContent = item.explain;
      speak(item.explain);
    }
  };
  const floatBtn = document.createElement('button');
  floatBtn.className = 'guess-btn floats-btn';
  floatBtn.innerHTML = `🎈<span class="g-label">${t('khoahoc.floats', 'Nổi')}</span>`;
  floatBtn.addEventListener('click', () => answer(true, floatBtn));
  const sinkBtn = document.createElement('button');
  sinkBtn.className = 'guess-btn sinks-btn';
  sinkBtn.innerHTML = `🪨<span class="g-label">${t('khoahoc.sinks', 'Chìm')}</span>`;
  sinkBtn.addEventListener('click', () => answer(false, sinkBtn));
  row.append(floatBtn, sinkBtn);
  els.tray.appendChild(row);

  state.saySentence = item.name;
  speak(item.name);
};

/* ===== Nút ===== */

els.tabs['vong-doi'].addEventListener('click', () => { sfx.select(); startSet('vong-doi'); });
els.tabs['pha-mau'].addEventListener('click', () => { sfx.select(); startSet('pha-mau'); });
els.tabs['chim-noi'].addEventListener('click', () => { sfx.select(); startSet('chim-noi'); });
els.btnSay.addEventListener('click', () => speak(state.saySentence));
els.btnAgain.addEventListener('click', () => { sfx.select(); startSet(state.mode); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
startSet('vong-doi');

// Hook cho e2e test
window.__khoahoc = { state, startSet };
