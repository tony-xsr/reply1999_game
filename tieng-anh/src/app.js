// Điều phối Tiếng Anh Nâng Cao: ghép câu S+V+O / phát âm theo mẫu.
// Trò Phát Âm KHÔNG chấm đúng/sai — chỉ luyện nghe & nói; vẫn chơi được
// trọn vẹn nếu bé/phụ huynh từ chối quyền micro hoặc trình duyệt không hỗ trợ.

import { makeSentenceSet, makePronounceSet } from './tienganh.js';
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
  tabs: { cau: $('tabCau'), 'phat-am': $('tabPhatAm') },
  dots: $('dots'), question: $('question'), field: $('field'), tray: $('tray'),
  btnSay: $('btnSay'), btnSound: $('btnSound'),
  cheer: $('cheer'), cheerText: $('cheerText'), btnAgain: $('btnAgain'),
};

const QTOTAL = 8;

const state = {
  mode: 'cau',
  q: null,
  set: [],
  qIndex: 0,
  firstTry: 0,
  wrongThisQ: false,
  saySentence: '',
  startedAt: Date.now(),
  mic: { stream: null, recorder: null, chunks: [], recording: false },
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

function finishSet(text, sayText) {
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'tienganh',
    result: 'win',
    score: state.firstTry * 10,
    level: QTOTAL,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  sfx.levelWin();
  confetti();
  els.cheerText.textContent = text;
  els.cheer.classList.remove('hidden');
  speak(sayText, { lang: 'vi-VN' });
}

function questionDone(delay = 1500) {
  if (!state.wrongThisQ) state.firstTry++;
  state.wrongThisQ = false;
  state.qIndex++;
  renderDots();
  if (state.qIndex >= QTOTAL) {
    setTimeout(() => finishSet(
      `${t('hocvui.right', 'Đúng ngay lần đầu')}: ${state.firstTry}/${QTOTAL} ⭐`,
      'Giỏi quá! Bé ghép câu tiếng Anh giỏi lắm!',
    ), delay);
  } else {
    setTimeout(nextQuestion, delay);
  }
}

function startSet(mode) {
  stopRecording();
  state.mode = mode;
  state.qIndex = 0;
  state.firstTry = 0;
  state.wrongThisQ = false;
  state.startedAt = Date.now();
  els.cheer.classList.add('hidden');
  for (const [k, el] of Object.entries(els.tabs)) el.classList.toggle('active', k === mode);
  els.btnSay.style.visibility = mode === 'cau' ? 'visible' : 'hidden';
  if (mode === 'cau') state.set = makeSentenceSet(QTOTAL);
  else state.set = makePronounceSet(QTOTAL);
  renderDots();
  nextQuestion();
}

function nextQuestion() {
  RENDER[state.mode]();
}

const RENDER = {};

/* ===== 1. Ghép Câu Đơn Giản ===== */

RENDER.cau = () => {
  const round = state.set[state.qIndex];
  state.q = round;
  round.next = 0;
  els.question.innerHTML = `${round.sentence.emoji} ${t('tienganh.q.build', 'Ghép câu cho đúng nhé!')}`;

  els.field.innerHTML = '';
  const line = document.createElement('div');
  line.className = 'word-line';
  const slots = [];
  for (let i = 0; i < round.sentence.words.length; i++) {
    const slot = document.createElement('div');
    slot.className = 'chunk slot';
    slot.textContent = '?';
    line.appendChild(slot);
    slots.push(slot);
  }
  els.field.appendChild(line);

  els.tray.innerHTML = '';
  for (const tile of round.shuffled) {
    const btn = document.createElement('button');
    btn.className = 'step-btn';
    btn.innerHTML = `<span>${tile.word}</span>`;
    btn.addEventListener('click', () => {
      if (tile.correctIndex !== round.next) return wrong(btn);
      const slot = slots[round.next];
      slot.textContent = tile.word;
      slot.classList.remove('slot');
      slot.classList.add('filled');
      btn.classList.add('used');
      sfx.match(2);
      round.next++;
      if (round.next >= round.sentence.words.length) {
        speak(round.sentence.words.join(' '), { lang: 'en-US', rate: 0.66 });
        questionDone(1700);
      }
      return null;
    });
    els.tray.appendChild(btn);
  }
  state.saySentence = round.sentence.words.join(' ');
  speak(state.saySentence, { lang: 'en-US', rate: 0.66 });
};

/* ===== 2. Phát Âm Theo Tôi ===== */

const micSupported = () => !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);

function stopRecording() {
  const { mic } = state;
  try { mic.recorder?.state === 'recording' && mic.recorder.stop(); } catch { /* ignore */ }
  mic.stream?.getTracks().forEach((tr) => tr.stop());
  mic.stream = null;
  mic.recorder = null;
  mic.recording = false;
}

RENDER['phat-am'] = () => {
  const item = state.set[state.qIndex];
  state.q = item;
  els.question.textContent = t('tienganh.q.listen', 'Nghe và bắt chước nói theo nhé!');

  els.field.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'word-card';
  card.innerHTML = `<div class="w-emoji">${item.emoji}</div><div class="w-letter">${item.letter}</div><div class="w-word">${item.word}</div>`;
  els.field.appendChild(card);

  els.tray.innerHTML = '';
  const micRow = document.createElement('div');
  micRow.className = 'mic-row';

  const hearBtn = document.createElement('button');
  hearBtn.className = 'hear-round-btn';
  hearBtn.textContent = '🔊';
  hearBtn.title = t('tomau.say', 'Đọc lại');
  hearBtn.addEventListener('click', () => speak(item.word, { lang: 'en-US', rate: 0.75 }));

  const micBtn = document.createElement('button');
  micBtn.className = 'mic-btn';
  micBtn.innerHTML = '🎙️<span class="m-label">Bấm nói</span>';

  const playback = document.createElement('audio');
  playback.className = 'playback-audio';
  playback.controls = true;
  playback.hidden = true;

  const note = document.createElement('div');
  note.className = 'mic-note';

  if (!micSupported()) {
    micBtn.disabled = true;
    note.textContent = t('tienganh.mic.unsupported', '🎙️ Máy không hỗ trợ ghi âm — bấm 🔊 nghe mẫu và tập nói theo nhé!');
  }

  micBtn.addEventListener('click', async () => {
    const { mic } = state;
    if (mic.recording) {
      stopRecording();
      micBtn.classList.remove('recording');
      micBtn.innerHTML = '🎙️<span class="m-label">Bấm nói</span>';
      return;
    }
    try {
      mic.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      note.textContent = t('tienganh.mic.denied', '🎙️ Không dùng được micro — bấm 🔊 nghe mẫu và tập nói theo nhé!');
      micBtn.disabled = true;
      return;
    }
    mic.chunks = [];
    mic.recorder = new MediaRecorder(mic.stream);
    mic.recorder.ondataavailable = (e) => { if (e.data.size) mic.chunks.push(e.data); };
    mic.recorder.onstop = (e) => {
      // stopRecording() đã xóa mic.recorder trước khi sự kiện này kịp chạy —
      // lấy mimeType từ chính recorder gốc qua e.target, không đọc lại mic.recorder.
      if (mic.chunks.length) {
        playback.src = URL.createObjectURL(new Blob(mic.chunks, { type: e.target.mimeType || 'audio/webm' }));
        playback.hidden = false;
      }
    };
    mic.recorder.start();
    mic.recording = true;
    micBtn.classList.add('recording');
    micBtn.innerHTML = '⏹️<span class="m-label">Bấm dừng</span>';
    sfx.select();
  });

  micRow.append(hearBtn, micBtn);
  els.tray.append(micRow, playback, note);

  const nextBtn = document.createElement('button');
  nextBtn.className = 'next-round-btn';
  nextBtn.textContent = state.qIndex === QTOTAL - 1
    ? t('tienganh.done', 'XONG ✅')
    : t('tomau.next', 'TIẾP ▶');
  nextBtn.addEventListener('click', () => {
    stopRecording();
    state.qIndex++;
    renderDots();
    if (state.qIndex >= QTOTAL) {
      finishSet(
        `${t('tienganh.practiced', 'Bé đã luyện nói')} ${QTOTAL} ${t('tienganh.words', 'từ tiếng Anh')}! 🗣️`,
        'Giỏi quá! Bé luyện phát âm tiếng Anh giỏi lắm!',
      );
    } else {
      nextQuestion();
    }
  });
  els.tray.appendChild(nextBtn);

  state.saySentence = item.word;
  speak(item.word, { lang: 'en-US', rate: 0.75 });
};

/* ===== Nút ===== */

els.tabs.cau.addEventListener('click', () => { sfx.select(); startSet('cau'); });
els.tabs['phat-am'].addEventListener('click', () => { sfx.select(); startSet('phat-am'); });
els.btnSay.addEventListener('click', () => speak(state.saySentence, { lang: state.mode === 'phat-am' ? 'en-US' : 'en-US' }));
els.btnAgain.addEventListener('click', () => { sfx.select(); startSet(state.mode); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopRecording();
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
startSet('cau');

// Hook cho e2e test
window.__tienganh = { state, startSet, micSupported };
