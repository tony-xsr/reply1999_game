// Điều phối Tập Viết: 4 tab (Nét cơ bản / ABC tiếng Việt / ABC tiếng Anh / Tên bé).
// Dùng chung: sfx + hồ sơ/thống kê (pokemon), giọng đọc + dữ liệu chữ VN (to-mau).

import { GLYPHS, BASIC_STROKES, EN_WORDS, nameToGlyphs } from './strokes.js';
import { Tracer } from './tracer.js';
import { LETTERS } from '../../to-mau/src/letters.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  tabs: {
    basic: $('tabBasic'), vi: $('tabVi'), en: $('tabEn'), name: $('tabName'),
  },
  picker: $('picker'), nameRow: $('nameRow'),
  wrap: $('boardWrap'), canvas: $('traceCanvas'), hintLine: $('hintLine'),
  cheer: $('cheer'), cheerStars: $('cheerStars'), cheerEmoji: $('cheerEmoji'),
  cheerText: $('cheerText'), btnNext: $('btnNext'),
  btnSay: $('btnSay'), btnRedo: $('btnRedo'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
};

const state = {
  tab: 'basic',      // basic | vi | en | name
  index: 0,
  nameSeq: [],       // dãy chữ của tên bé
  startedAt: Date.now(),
  instruction: '',
};

bindMute(() => sfx.muted);

function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/* ===== Danh sách bài theo tab ===== */

function tabItems() {
  switch (state.tab) {
    case 'basic':
      return BASIC_STROKES.map((b, i) => ({ key: `basic:${i}`, ch: b.ch, label: b.name, emoji: '✏️', strokes: b.strokes }));
    case 'vi':
      return LETTERS.map((l) => ({ key: `vi:${l.ch}`, ch: l.ch, label: `${l.ch} — ${l.word}`, emoji: l.emoji, strokes: GLYPHS[l.ch] }));
    case 'en':
      return Object.keys(EN_WORDS).map((ch) => ({ key: `en:${ch}`, ch, label: `${ch} — ${EN_WORDS[ch].word}`, emoji: EN_WORDS[ch].emoji, strokes: GLYPHS[ch] }));
    case 'name':
      return state.nameSeq.map((ch, i) => ({ key: `name:${i}`, ch, label: ch, emoji: '⭐', strokes: GLYPHS[ch] }));
    default:
      return [];
  }
}

const current = () => tabItems()[state.index];

/* ===== Tiến độ sao theo hồ sơ ===== */

const progressKey = () => `tapviet.progress.${currentProfile(t('pika.user.guest', 'Khách')).id}`;

function getProgress() {
  try { return JSON.parse(localStorage.getItem(progressKey())) || {}; } catch { return {}; }
}

function saveStars(key, stars) {
  const p = getProgress();
  if ((p[key] || 0) >= stars) return;
  p[key] = stars;
  try { localStorage.setItem(progressKey(), JSON.stringify(p)); } catch { /* private mode */ }
}

/* ===== Câu đọc ===== */

function introSpeech(item) {
  switch (state.tab) {
    case 'basic': return speak(`${item.label}. Rê tay theo mũi tên nhé!`);
    case 'vi': return speak(`Chữ ${item.ch}`);
    case 'en': return speak(`${item.ch}`, { lang: 'en-US', rate: 0.68 });
    case 'name': return speak(`Chữ ${item.ch}`);
    default: return null;
  }
}

function cheerSpeech(item, stars) {
  const praise = stars === 3 ? 'Tuyệt vời!' : 'Giỏi quá!';
  switch (state.tab) {
    case 'basic': return speak(`${praise} ${item.label}!`);
    case 'vi': return speak(`${praise} Chữ ${item.ch} — ${item.label.split('— ')[1]}!`);
    case 'en': return speak(`Great job! ${item.ch}! ${item.ch} for ${EN_WORDS[item.ch].word}!`, { lang: 'en-US', rate: 0.66 });
    default: return null;
  }
}

/* ===== UI ===== */

function renderPicker() {
  if (state.tab === 'name') {
    els.picker.classList.add('hidden');
    els.nameRow.classList.remove('hidden');
    renderNameRow();
    return;
  }
  els.picker.classList.remove('hidden');
  els.nameRow.classList.add('hidden');
  const progress = getProgress();
  els.picker.innerHTML = '';
  tabItems().forEach((item, i) => {
    const btn = document.createElement('button');
    btn.className = `pick${i === state.index ? ' active' : ''}`;
    btn.textContent = item.ch;
    const stars = progress[item.key] || 0;
    if (stars) {
      const s = document.createElement('span');
      s.className = 'star';
      s.textContent = '⭐'.repeat(stars);
      btn.appendChild(s);
    }
    btn.addEventListener('click', () => selectItem(i));
    els.picker.appendChild(btn);
  });
  els.picker.querySelector('.pick.active')?.scrollIntoView({ block: 'nearest', inline: 'center' });
}

function renderNameRow() {
  els.nameRow.innerHTML = '';
  state.nameSeq.forEach((ch, i) => {
    const el = document.createElement('div');
    el.className = `name-ch${i === state.index ? ' current' : ''}${i < state.index ? ' done' : ''}`;
    el.textContent = ch;
    els.nameRow.appendChild(el);
  });
}

function updateHint() {
  const total = tracer.strokes.length;
  els.hintLine.textContent = tracer.done
    ? ''
    : `${t('tapviet.stroke', 'Nét')} ${tracer.strokeIdx + 1}/${total}`;
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

/* ===== Luồng chơi ===== */

const tracer = new Tracer(els.canvas, {
  onStrokeDone() {
    sfx.match(1);
    updateHint();
  },
  onFail() {
    sfx.fail();
    els.wrap.classList.remove('shake');
    void els.wrap.offsetWidth;
    els.wrap.classList.add('shake');
    updateHint();
  },
  onComplete(stars) {
    onGlyphDone(stars);
  },
});

function buildCurrent() {
  const item = current();
  if (!item) return;
  els.cheer.classList.add('hidden');
  state.startedAt = Date.now();
  tracer.setGlyph(item.strokes);
  updateHint();
}

function selectItem(i, quiet = false) {
  state.index = i;
  buildCurrent();
  renderPicker();
  if (!quiet) {
    sfx.select();
    introSpeech(current());
  }
}

function selectTab(tab) {
  state.tab = tab;
  for (const [k, el] of Object.entries(els.tabs)) el.classList.toggle('active', k === tab);
  if (tab === 'name') {
    const profile = currentProfile(t('pika.user.guest', 'Khách'));
    state.nameSeq = nameToGlyphs(profile.name);
    if (!state.nameSeq.length) state.nameSeq = nameToGlyphs('BÉ');
    state.index = 0;
    buildCurrent();
    renderPicker();
    speak(`Viết tên ${profile.name} nhé! Bắt đầu với chữ ${state.nameSeq[0]}`);
    return;
  }
  selectItem(0);
}

function onGlyphDone(stars) {
  const item = current();
  sfx.levelWin();
  saveStars(item.key, stars);
  recordSession({
    mode: 'tapviet',
    result: 'win',
    score: stars * 10,
    level: state.index + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });

  // Chế độ Tên bé: xong 1 chữ thì sang chữ tiếp, hết tên mới ăn mừng to
  if (state.tab === 'name') {
    if (state.index + 1 < state.nameSeq.length) {
      state.index++;
      renderNameRow();
      buildCurrent();
      speak(`Chữ ${state.nameSeq[state.index]}`);
      return;
    }
    const profile = currentProfile(t('pika.user.guest', 'Khách'));
    confetti();
    renderNameRow();
    els.cheerStars.textContent = '🎉';
    els.cheerEmoji.textContent = '🏆';
    els.cheerText.textContent = profile.name.toUpperCase();
    els.cheer.classList.remove('hidden');
    speak(`Hoan hô! ${profile.name} viết được tên mình rồi!`);
    return;
  }

  confetti();
  renderPicker();
  els.cheerStars.textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
  els.cheerEmoji.textContent = item.emoji;
  els.cheerText.textContent = item.label;
  setTimeout(() => {
    els.cheer.classList.remove('hidden');
    cheerSpeech(item, stars);
  }, 500);
}

/* ===== Gắn nút ===== */

function refreshSoundIcon() {
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
}

els.tabs.basic.addEventListener('click', () => selectTab('basic'));
els.tabs.vi.addEventListener('click', () => selectTab('vi'));
els.tabs.en.addEventListener('click', () => selectTab('en'));
els.tabs.name.addEventListener('click', () => selectTab('name'));
els.btnSay.addEventListener('click', () => introSpeech(current()));
els.btnRedo.addEventListener('click', () => { buildCurrent(); sfx.select(); });
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  refreshSoundIcon();
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});
els.btnNext.addEventListener('click', () => {
  if (state.tab === 'name') { selectTab('name'); return; } // viết lại cả tên
  selectItem((state.index + 1) % tabItems().length);
});

refreshSoundIcon();
sayInstruction(t('tapviet.help', 'Nhìn chữ mờ trên bảng, rê ngón tay hoặc chuột theo đúng nét chỉ dẫn. Đi đúng đường thì nét hiện màu, lệch quá thì làm lại nét đó. Có 4 chế độ: Nét cơ bản, chữ cái tiếng Việt, chữ cái tiếng Anh, và viết tên của bé.'));
selectItem(0, true);

// Hook cho e2e test
window.__tapviet = { state, tracer, selectItem, selectTab };
