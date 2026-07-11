// Điều phối Toán Lớp 1: 5 trò trong 1 (cộng trừ / so sánh / xem giờ / hình & quy luật / đi chợ),
// 8 câu mỗi lượt, khó dần trong lượt. Dùng chung sfx + giọng đọc + hồ sơ/stats.

import {
  makeAddSub, makeCompare, makeClock, makeShape, makePattern,
  makeShopping, payState, BILLS, SHAPES,
} from './toan.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
import { viNumber } from '../../nhay-lo-co/src/loco.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  tabs: {
    add: $('tabAdd'), compare: $('tabCompare'), clock: $('tabClock'),
    shape: $('tabShape'), shop: $('tabShop'),
  },
  dots: $('dots'), question: $('question'), field: $('field'), tray: $('tray'),
  btnSay: $('btnSay'), btnSound: $('btnSound'),
  cheer: $('cheer'), cheerText: $('cheerText'), btnAgain: $('btnAgain'),
};

const QUESTIONS = 8;

const state = {
  mode: 'add',
  q: null,
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
  for (let i = 0; i < QUESTIONS; i++) {
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

function right(delayNext = 1100) {
  sfx.match(2);
  if (!state.wrongThisQ) state.firstTry++;
  state.wrongThisQ = false;
  state.qIndex++;
  renderDots();
  if (state.qIndex >= QUESTIONS) setTimeout(finishSet, delayNext);
  else setTimeout(nextQuestion, delayNext);
}

function finishSet() {
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'toan',
    result: 'win',
    score: state.firstTry * 10,
    level: QUESTIONS,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  sfx.levelWin();
  confetti();
  els.cheerText.textContent = `${t('hocvui.right', 'Đúng ngay lần đầu')}: ${state.firstTry}/${QUESTIONS} ⭐`;
  els.cheer.classList.remove('hidden');
  speak('Giỏi quá! Bé làm toán giỏi lắm!');
}

function startSet(mode) {
  state.mode = mode;
  state.qIndex = 0;
  state.firstTry = 0;
  state.wrongThisQ = false;
  state.startedAt = Date.now();
  els.cheer.classList.add('hidden');
  for (const [k, el] of Object.entries(els.tabs)) el.classList.toggle('active', k === mode);
  renderDots();
  nextQuestion();
}

const RENDER = {};

function nextQuestion() {
  els.question.textContent = '';
  els.field.innerHTML = '';
  els.field.className = 'field';
  els.tray.innerHTML = '';
  RENDER[state.mode]();
}

function say(text) {
  state.saySentence = text;
  speak(text);
}

function answerButtons(options, answer, onRight, format = (o) => o) {
  for (const opt of options) {
    const btn = document.createElement('button');
    btn.className = 'tile-btn';
    btn.textContent = format(opt);
    btn.addEventListener('click', () => {
      if (opt !== answer) return wrong(btn);
      return onRight(btn, opt);
    });
    els.tray.appendChild(btn);
  }
}

/* ===== 1. Cộng trừ (4 câu cơ bản → 4 câu điền khuyết) ===== */

RENDER.add = () => {
  const q = makeAddSub(Math.random, state.qIndex < QUESTIONS / 2 ? 'basic' : 'missing');
  state.q = q;
  els.question.textContent = q.blank === 'result'
    ? t('toan.q.add', 'Bằng mấy nhỉ?')
    : t('toan.q.missing', 'Điền số còn thiếu!');

  const eq = document.createElement('div');
  eq.className = 'eq';
  const parts = [['a', q.a], ['op', q.op], ['b', q.b], ['eq', '='], ['result', q.result]];
  let blankEl = null;
  for (const [key, val] of parts) {
    const span = document.createElement('div');
    if (key === q.blank) {
      span.className = 'blank';
      span.textContent = '?';
      blankEl = span;
    } else {
      span.textContent = val;
    }
    eq.appendChild(span);
  }
  els.field.appendChild(eq);

  answerButtons(q.options, q.answer, (btn) => {
    blankEl.textContent = q.answer;
    blankEl.classList.add('filled');
    btn.disabled = true;
    const read = `${q.a} ${q.op === '+' ? 'cộng' : 'trừ'} ${q.b} bằng ${q.result}`;
    say(read);
    right(1400);
  });
  say(`${q.a} ${q.op === '+' ? 'cộng' : 'trừ'} ${q.b}`);
};

/* ===== 2. So sánh > < = với cái cân nghiêng ===== */

RENDER.compare = () => {
  const q = makeCompare(Math.random, state.qIndex >= QUESTIONS / 2);
  state.q = q;
  els.question.textContent = t('toan.q.compare', 'Chọn dấu đúng!');

  const wrap = document.createElement('div');
  wrap.className = 'scale-wrap';
  const beam = document.createElement('div');
  beam.className = 'scale-beam';
  const mid = document.createElement('div');
  mid.className = 'scale-mid';
  mid.textContent = '?';
  const panL = document.createElement('div');
  panL.className = 'pan';
  panL.textContent = q.left.text;
  const panR = document.createElement('div');
  panR.className = 'pan';
  panR.textContent = q.right.text;
  beam.append(panL, mid, panR);
  const base = document.createElement('div');
  base.className = 'scale-base';
  base.textContent = '🔻';
  wrap.append(beam, base);
  els.field.appendChild(wrap);

  answerButtons(['>', '<', '='], q.answer, () => {
    mid.textContent = q.answer;
    mid.classList.add('filled');
    // Cân nghiêng về bên nặng hơn
    beam.style.transform = q.answer === '>' ? 'rotate(4deg)' : q.answer === '<' ? 'rotate(-4deg)' : 'none';
    const readSign = q.answer === '>' ? 'lớn hơn' : q.answer === '<' ? 'bé hơn' : 'bằng';
    say(`${q.left.text} ${readSign} ${q.right.text}`);
    right(1400);
  });
  say('Bên nào lớn hơn?');
};

/* ===== 3. Xem giờ: đồng hồ SVG ===== */

function clockSVG(hour, half) {
  const minuteAngle = half ? 180 : 0;
  const hourAngle = ((hour % 12) + (half ? 0.5 : 0)) * 30;
  const tick = (i) => {
    const a = (i * 30 * Math.PI) / 180;
    const x = 100 + Math.sin(a) * 78;
    const y = 100 - Math.cos(a) * 78;
    return `<text x="${x}" y="${y + 6}" text-anchor="middle" font-size="17" font-weight="900" fill="#241e2e">${i === 0 ? 12 : i}</text>`;
  };
  const hand = (angle, len, w, color) => {
    const a = (angle * Math.PI) / 180;
    return `<line x1="100" y1="100" x2="${100 + Math.sin(a) * len}" y2="${100 - Math.cos(a) * len}"
      stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
  };
  return `<svg class="clock-svg" viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="94" fill="#fff" stroke="#c2410c" stroke-width="7"/>
    ${Array.from({ length: 12 }, (_, i) => tick(i)).join('')}
    ${hand(hourAngle, 46, 9, '#241e2e')}
    ${hand(minuteAngle, 66, 6, '#c2410c')}
    <circle cx="100" cy="100" r="6" fill="#241e2e"/>
  </svg>`;
}

RENDER.clock = () => {
  const q = makeClock(Math.random, state.qIndex >= 3); // 3 câu đầu chỉ giờ đúng
  state.q = q;
  els.question.textContent = t('toan.q.clock', 'Đồng hồ chỉ mấy giờ?');
  els.field.innerHTML = clockSVG(q.hour, q.half);

  answerButtons(q.options, q.label, () => {
    say(q.label);
    right(1300);
  });
  say('Đồng hồ chỉ mấy giờ?');
};

/* ===== 4. Hình khối (4 câu) + quy luật dãy (4 câu) ===== */

RENDER.shape = () => {
  if (state.qIndex < QUESTIONS / 2) {
    const q = makeShape(Math.random);
    state.q = q;
    els.question.textContent = `${t('toan.q.shape', 'Đồ vật này giống hình gì?')}`;
    els.field.innerHTML = `<div style="font-size:5rem">${q.obj.emoji}</div>`;
    answerButtons(q.options, q.options.find((o) => o.id === q.answer), (btn, opt) => {
      say(`${q.obj.name} giống ${opt.name}!`);
      right(1300);
    }, (o) => `${o.icon}`);
    say(`${q.obj.name} giống hình gì?`);
    return;
  }
  const q = makePattern(Math.random);
  state.q = q;
  els.question.textContent = t('toan.q.pattern', 'Hình nào tiếp theo?');
  const row = document.createElement('div');
  row.className = 'pattern';
  for (const tk of q.seq) {
    const s = document.createElement('span');
    s.textContent = tk;
    row.appendChild(s);
  }
  const next = document.createElement('span');
  next.className = 'next';
  next.textContent = '?';
  row.appendChild(next);
  els.field.appendChild(row);
  answerButtons(q.options, q.answer, () => {
    next.textContent = q.answer;
    next.classList.add('filled');
    say('Đúng rồi! Giỏi quá!');
    right(1300);
  });
  say('Hình nào tiếp theo?');
};

/* ===== 5. Đi chợ: chạm tờ tiền trả đúng giá ===== */

RENDER.shop = () => {
  const q = makeShopping(Math.random);
  state.q = q;
  state.tapped = [];
  els.question.textContent = t('toan.q.shop', 'Trả tiền cho đủ nhé!');

  const shop = document.createElement('div');
  shop.className = 'shop';
  const goods = document.createElement('div');
  goods.className = 'goods';
  for (const item of q.items) {
    const g = document.createElement('div');
    g.className = 'good';
    g.innerHTML = `<div class="g-emoji">${item.emoji}</div><div class="g-price">${item.price} nghìn</div>`;
    goods.appendChild(g);
  }
  const paidLine = document.createElement('div');
  paidLine.className = 'paid-line';
  const renderPaid = () => {
    const sum = state.tapped.reduce((a, b) => a + b, 0);
    paidLine.innerHTML = `${t('toan.paid', 'Đã trả')}: <b>${sum}</b> / ${q.total} ${t('toan.thousand', 'nghìn')}`;
  };
  renderPaid();
  shop.append(goods, paidLine);
  els.field.appendChild(shop);

  for (const bill of BILLS) {
    const btn = document.createElement('button');
    btn.className = 'bill';
    btn.style.background = bill.color;
    btn.textContent = bill.label;
    btn.addEventListener('click', () => {
      state.tapped.push(bill.value);
      sfx.select();
      renderPaid();
      const st = payState(q.total, state.tapped);
      if (st === 'paid') {
        say(`Đủ ${viNumber(q.total)} nghìn rồi! Cảm ơn bé!`);
        right(1500);
      } else if (st === 'over') {
        state.tapped = [];
        renderPaid();
        wrong(els.field);
        speak('Ôi, trả quá rồi! Thử lại nhé!');
      }
    });
    els.tray.appendChild(btn);
  }
  const names = q.items.map((it) => `${it.name} ${viNumber(it.price)} nghìn`).join(', ');
  say(`Mua ${names}. Trả ${viNumber(q.total)} nghìn nào!`);
};

/* ===== Nút ===== */

for (const [mode, el] of Object.entries(els.tabs)) {
  el.addEventListener('click', () => { sfx.select(); startSet(mode); });
}
els.btnSay.addEventListener('click', () => speak(state.saySentence));
els.btnAgain.addEventListener('click', () => { sfx.select(); startSet(state.mode); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
startSet('add');

// Hook cho e2e test
window.__toan = { state, startSet };
