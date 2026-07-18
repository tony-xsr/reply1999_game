// Điều phối Ném Phi Tiêu Từ Vựng — "mượn khung" y hệt các game Ôn Tập Vui
// trước: toàn bộ luật chơi dùng lại NGUYÊN VẸN module đã kiểm thử kỹ của Ôn
// Tập Tổng Hợp (`nghe-doan-on-tap/src/ontap.js`) — file này CHỈ thêm 1 lớp da
// mới: bảng bia phi tiêu cổ điển + người ném ở góc trái, phi tiêu bay theo
// đường VÒNG CUNG (2 chặng: lên đỉnh rồi xuống đích) khác đường thẳng của
// Bắn Cung, tạo cảm giác vật lý khác nhau dù dùng chung 1 kỹ thuật.

import {
  TOPICS, makeGame, currentRound, chooseOption, promptFor, rateFor,
} from '../../nghe-doan-on-tap/src/ontap.js';
import { speak, speakSequence, bindMute } from '../../to-mau/src/speech.js';
import { recordMiss, recordHit, missCount } from '../../nghe-doan-on-tap/src/misses.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { mountKidFeatures, answeredOne } from '../../shared/kid-bar.js';
import { initFilterToggle } from '../../shared/filter-toggle.js';
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
  field: $('field'), thrower: $('thrower'),
};

const state = { topic: 'all', level: 0, game: null, startedAt: Date.now(), instruction: '', busy: false };
bindMute(() => sfx.muted);

function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/** Đọc câu/từ TIẾNG ANH bằng giọng en-US thật — CÂU DÀI đọc chậm hơn hẳn TỪ ĐƠN. */
function speakEn(text, rate) {
  speak(text, { lang: 'en-US', rate });
}

/** Đọc đúng nội dung của 1 vòng (từ đơn hoặc câu) với tốc độ phù hợp theo mode. */
function speakRound(round) {
  if (!round) return;
  speakEn(promptFor(round), rateFor(round.mode));
}

function buildCorrectSequence(round) {
  const { word, vi, sentence, sentenceVi } = round.target;
  return [
    { text: 'Ném trúng rồi, bé giỏi quá!', lang: 'vi-VN', rate: 0.92 },
    { text: word, lang: 'en-US', rate: rateFor('word') },
    { text: `có nghĩa là ${vi}.`, lang: 'vi-VN', rate: 0.88 },
    { text: sentence, lang: 'en-US', rate: rateFor('sentence') },
    { text: `nghĩa là ${sentenceVi}. Bé nhớ nhé!`, lang: 'vi-VN', rate: 0.88 },
  ];
}

function buildHintSequence(round) {
  const { word, vi } = round.target;
  return [
    { text: 'Trật rồi.', lang: 'vi-VN', rate: 0.92 },
    { text: word, lang: 'en-US', rate: rateFor('word') },
    { text: `là ${vi}. Bé hãy ném lại nhé!`, lang: 'vi-VN', rate: 0.88 },
  ];
}

function buildRevealSequence(round) {
  const { word, vi, sentence, sentenceVi } = round.target;
  return [
    { text: 'Vẫn chưa trúng. Đáp án là', lang: 'vi-VN', rate: 0.92 },
    { text: word, lang: 'en-US', rate: rateFor('word') },
    { text: `nghĩa là ${vi}.`, lang: 'vi-VN', rate: 0.88 },
    { text: sentence, lang: 'en-US', rate: rateFor('sentence') },
    { text: `nghĩa là ${sentenceVi}. Lần sau bé sẽ ném trúng!`, lang: 'vi-VN', rate: 0.88 },
  ];
}

/** Chú thích hiện sau khi trả lời: chỉ hiện đúng những gì bé vừa NGHE. */
function captionFor(round) {
  if (round.mode === 'sentence') return `${round.target.sentence}  —  ${round.target.sentenceVi}`;
  return `${round.target.word}  —  ${round.target.vi}`;
}

/* ===== Bộ lọc theo game gốc (dùng lại nguyên TOPICS của Ôn Tập Tổng Hợp) ===== */

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
    const label = topic.id === 'weak'
      ? `${topic.icon} ${topic.label} (${missCount()})`
      : `${topic.icon} ${topic.label}`;
    els.filterRow.appendChild(makeBtn(topic.id, label));
  }
}

/* ===== Vẽ vòng chơi: hàng bảng bia phi tiêu thay cho lưới nút phẳng ===== */

function renderRound() {
  const round = currentRound(state.game);
  if (!round) return;
  els.sentenceCap.textContent = '';
  els.options.innerHTML = '';
  for (const opt of round.options) {
    const btn = document.createElement('button');
    btn.className = 'opt-btn';
    if (opt.img) {
      const img = document.createElement('img');
      img.src = opt.img;
      img.alt = opt.word;
      btn.appendChild(img);
    } else {
      btn.textContent = opt.emoji;
    }
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

/* ===== Hiệu ứng ném phi tiêu: bay VÒNG CUNG (2 chặng) từ người ném tới bia ===== */

function throwDartTo(targetBtn, done) {
  const fieldRect = els.field.getBoundingClientRect();
  const throwerRect = els.thrower.getBoundingClientRect();
  const tgtRect = targetBtn.getBoundingClientRect();
  const startX = throwerRect.left + throwerRect.width / 2 - fieldRect.left;
  const startY = throwerRect.top + throwerRect.height / 2 - fieldRect.top;
  const endX = tgtRect.left + tgtRect.width / 2 - fieldRect.left;
  const endY = tgtRect.top + tgtRect.height / 2 - fieldRect.top;
  const midX = (startX + endX) / 2;
  const midY = Math.min(startY, endY) - 40; // đỉnh vòng cung cao hơn cả 2 đầu

  els.thrower.classList.add('throw');
  const dart = document.createElement('div');
  dart.className = 'dart';
  dart.textContent = '📌';
  dart.style.left = `${startX}px`;
  dart.style.top = `${startY}px`;
  dart.style.transform = 'translate(-50%, -50%) rotate(-20deg)';
  els.field.appendChild(dart);

  requestAnimationFrame(() => {
    dart.style.transition = 'left .13s ease-out, top .13s ease-out, transform .13s ease-out';
    dart.style.left = `${midX}px`;
    dart.style.top = `${midY}px`;
    dart.style.transform = 'translate(-50%, -50%) rotate(25deg)';
  });
  setTimeout(() => {
    dart.style.transition = 'left .15s ease-in, top .15s ease-in, transform .15s ease-in';
    dart.style.left = `${endX}px`;
    dart.style.top = `${endY}px`;
    dart.style.transform = 'translate(-50%, -50%) rotate(70deg)';
  }, 130);
  setTimeout(() => {
    dart.remove();
    spawnImpact(endX, endY);
    els.thrower.classList.remove('throw');
    done();
  }, 290);
}

/* ===== Tương tác ===== */

function onPick(opt, btn) {
  if (state.busy) return;
  const g = state.game;
  if (!g || g.over) return;
  state.busy = true;
  sfx.select();

  throwDartTo(btn, () => {
    const round = currentRound(g);
    const ev = chooseOption(g, opt.id);

    if (ev.retry) {
      // Ném trật lần ĐẦU: chưa lộ đáp án — bia rung nhẹ, đọc gợi ý (từ +
      // nghĩa tiếng Việt) rồi mở khóa cho bé ném lại đúng 1 lần.
      recordMiss(round.target.word);
      btn.classList.add('wrong');
      btn.disabled = true;
      els.sentenceCap.textContent = `${round.target.word}  —  ${round.target.vi}`;
      sfx.fail();
      updateHud();
      speakSequence(buildHintSequence(round), () => { state.busy = false; });
      return;
    }

    const buttons = [...els.options.querySelectorAll('.opt-btn')];
    for (const b of buttons) {
      if (b.dataset.id === round.target.id) b.classList.add('correct');
      else b.classList.add('dim');
    }
    if (!ev.correct) {
      btn.classList.remove('dim');
      btn.classList.add('wrong');
    }

    // Ghi sổ "từ hay sai" dùng chung: đúng ngay lần đầu -> bớt cần ôn;
    // sai lần 2 -> thêm 1 điểm cần ôn (lần sai đầu đã ghi ở nhánh retry).
    if (ev.correct && ev.gain >= 10) recordHit(round.target.word);
    else if (!ev.correct) recordMiss(round.target.word);

    els.sentenceCap.textContent = captionFor(round);
    if (ev.correct) sfx.match(1);
    else sfx.fail();
    updateHud();

    answeredOne(); // 1 câu đã xong — đủ 15 câu/ngày bé được hộp quà nhỏ
    const seq = ev.correct ? buildCorrectSequence(round) : buildRevealSequence(round);
    speakSequence(seq, () => {
      state.busy = false;
      if (ev.gameDone) endRound();
      else {
        renderRound();
        updateHud();
        setTimeout(() => speakRound(currentRound(g)), 200);
      }
    });
  });
}

els.btnListen.addEventListener('click', () => {
  sfx.select();
  speakRound(currentRound(state.game));
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

/** Vòng sáng bung ra ngay điểm chạm đích — phản hồi thị giác "trúng" rõ hơn. */
function spawnImpact(x, y) {
  const ring = document.createElement('div');
  ring.className = 'impact-ring';
  ring.style.left = `${x}px`;
  ring.style.top = `${y}px`;
  els.field.appendChild(ring);
  setTimeout(() => ring.remove(), 360);
}

function endRound() {
  const g = state.game;
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'nemphitutivung',
    result: g.won ? 'win' : 'loss',
    score: g.score,
    level: g.level + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (g.won) {
    sfx.levelWin();
    confetti();
    els.ovEmoji.textContent = '🏆';
    els.ovText.textContent = `${t('nemphi.win', 'Cao thủ phi tiêu, ném trúng rất nhiều bia!')}\n⭐ ${g.score} · 🔥 ${g.bestStreak}`;
    els.btnPlay.textContent = t('xepchu.next', 'MÀN TIẾP ▶');
    speak(t('nemphi.win', 'Cao thủ phi tiêu, ném trúng rất nhiều bia!'));
  } else {
    sfx.gameOver();
    els.ovEmoji.textContent = '💪';
    els.ovText.textContent = `${t('nghedoan.tryagain', 'Nghe kỹ hơn rồi thử lại nhé!')}\n⭐ ${g.score} · 🔥 ${g.bestStreak}`;
    els.btnPlay.textContent = t('nghedoan.retry', 'CHƠI LẠI ▶');
    speak(t('nghedoan.tryagain', 'Nghe kỹ hơn rồi thử lại nhé!'));
    state.level = -1; // startRound sẽ ++ về lại 0, giữ nguyên độ khó
  }
  buildFilterRow(); // cập nhật số từ trên chip "🎯 Ôn chỗ yếu" sau mỗi ván
  els.overlay.classList.remove('hidden');
}

function startRound() {
  els.overlay.classList.add('hidden');
  state.busy = false;
  state.game = makeGame(state.topic, state.level, Math.random);
  state.startedAt = Date.now();
  renderRound();
  updateHud();
  setTimeout(() => speakRound(currentRound(state.game)), 300);
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
initFilterToggle(els.filterRow, document.getElementById('filterToggle'));
mountKidFeatures(); // thanh avatar bé + kiểm tra giới hạn phút/ngày
sayInstruction(t('nemphi.help', 'Đây là trò Ném Phi Tiêu Từ Vựng! Máy đọc một từ hoặc câu tiếng Anh — bé nghe thật kỹ rồi chạm vào đúng bảng bia có hình phù hợp để ném nhé. Nếu ném trật, máy sẽ gợi ý để bé ném lại một lần nữa. Ném trúng liên tiếp 3 lần sẽ được điểm thưởng. Hàng nút trên cùng cho bé chọn ôn theo từng game hoặc trộn tất cả.'));
startRound();

// Hook cho e2e test
window.__nemphi = { state, startRound };
