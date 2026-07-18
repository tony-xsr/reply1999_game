// Điều phối Ngữ Pháp Trực Quan: 2 trò minh hoạ ngữ pháp bằng animation (Đợt 2
// của đề xuất "Luyện Thi Cambridge" — games.md mục 28) — Cỗ Máy Thời Gian Ngữ
// Pháp và Hai Hành Động Cùng Lúc. Cùng khung shell/cheer với ren-tri-nao/
// van-dong-vui (homeScreen chọn trò + playScreen dùng chung, mỗi trò tự dựng
// DOM). Luật chọn-lại/thưởng giống hệt các game khác trong dự án.

import {
  TENSES,
  makeTimeMachineGame, currentTimeMachineRound, answerTimeMachine,
  makeTwoActionsGame, currentTwoActionsRound, answerTwoActions,
  makeComparativeGame, currentComparativeRound, answerComparative,
  makeGoingToWillGame, currentGoingToWillRound, answerGoingToWill,
  makeModalGame, currentModalRound, answerModal,
  makeConditionalGame, currentConditionalRound, answerConditional,
  makeSentenceBuilderGame, currentSentenceBuilderRound, tapSentenceBuilderChip,
} from './nguphaptructuan.js';
import { speak, speakSequence, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { mountKidFeatures, answeredOne } from '../../shared/kid-bar.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  title: $('title'), subLine: $('subLine'),
  home: $('homeScreen'), play: $('playScreen'),
  btnBack: $('btnBack'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
  cheer: $('cheer'), cheerEmoji: $('cheerEmoji'), cheerText: $('cheerText'),
  btnAgain: $('btnAgain'), btnHome2: $('btnHome2'),
};

const state = {
  game: null, startedAt: Date.now(), ctx: {}, instruction: '', busy: false,
};
bindMute(() => sfx.muted);

function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/* ===== Khung chung ===== */

function confetti() {
  const colors = ['#4d7bf5', '#2547b8', '#22c55e', '#f5c542', '#e5484d'];
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

function finish(score, bestStreak, won, mode) {
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: `nguphap-${mode}`,
    result: won ? 'win' : 'loss',
    score,
    level: 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (won) {
    sfx.levelWin();
    confetti();
    els.cheerEmoji.textContent = '🏆';
    els.cheerText.textContent = `${t('nguphap.win', 'Giỏi quá, bé nhìn hình đoán đúng thì rồi!')}\n⭐ ${score} · 🔥 ${bestStreak}`;
    speak(t('nguphap.win', 'Giỏi quá, bé nhìn hình đoán đúng thì rồi!'));
  } else {
    sfx.gameOver();
    els.cheerEmoji.textContent = '💪';
    els.cheerText.textContent = `${t('nguphap.tryagain', 'Xem kỹ animation hơn rồi thử lại nhé!')}\n⭐ ${score} · 🔥 ${bestStreak}`;
    speak(t('nguphap.tryagain', 'Xem kỹ animation hơn rồi thử lại nhé!'));
  }
  els.cheer.classList.remove('hidden');
}

function showHome() {
  if (state.ctx.cleanup) { state.ctx.cleanup(); state.ctx.cleanup = null; }
  state.game = null;
  els.home.classList.remove('hidden');
  els.play.classList.add('hidden');
  els.cheer.classList.add('hidden');
  els.btnBack.hidden = true;
  els.btnHelp.hidden = true;
  els.subLine.textContent = '';
}

function startGame(game) {
  if (state.ctx.cleanup) { state.ctx.cleanup(); state.ctx.cleanup = null; }
  state.game = game;
  state.startedAt = Date.now();
  els.home.classList.add('hidden');
  els.play.classList.remove('hidden');
  els.cheer.classList.add('hidden');
  els.btnBack.hidden = false;
  els.btnHelp.hidden = false;
  els.play.innerHTML = '';
  els.subLine.textContent = '';
  GAMES[game]();
}

/* ===== Chung: dựng lưới lựa chọn câu + xử lý chọn ===== */

function renderOptions(container, options, labelFn, onPick) {
  container.innerHTML = '';
  for (const opt of options) {
    const btn = document.createElement('button');
    btn.className = 'gr-opt';
    btn.textContent = labelFn(opt);
    btn.addEventListener('click', () => onPick(opt, btn));
    container.appendChild(btn);
  }
}

function markOptions(container, options, correctKey, keyFn, wrongBtn) {
  const buttons = [...container.querySelectorAll('.gr-opt')];
  buttons.forEach((btn, i) => {
    if (keyFn(options[i]) === correctKey) btn.classList.add('correct');
    else btn.classList.add('dim');
  });
  if (wrongBtn) {
    wrongBtn.classList.remove('dim');
    wrongBtn.classList.add('wrong');
  }
}

/* ===== 1. Cỗ Máy Thời Gian Ngữ Pháp ===== */

function startTimeMachine() {
  const hud = document.createElement('div');
  hud.className = 'gr-hud';
  hud.innerHTML = `<span>⭐ <b class="tm-score">0</b></span><span class="tm-round">0/8</span><span>🔥 <b class="tm-streak">0</b></span>`;
  els.play.appendChild(hud);

  const timeline = document.createElement('div');
  timeline.className = 'tm-timeline';
  timeline.innerHTML = `
    <div class="tm-zone tm-zone--past"><span class="tm-zone-label">${t('nguphap.tm.past', 'Quá khứ')}</span><div class="tm-marker tm-marker--past"></div></div>
    <div class="tm-zone tm-zone--now"><span class="tm-zone-label">${t('nguphap.tm.now', 'Bây giờ')}</span><div class="tm-marker tm-marker--now"></div></div>
    <div class="tm-zone tm-zone--future"><span class="tm-zone-label">${t('nguphap.tm.future', 'Tương lai')}</span><div class="tm-marker tm-marker--future"></div></div>
  `;
  els.play.appendChild(timeline);

  const question = document.createElement('div');
  question.className = 'tm-question';
  question.textContent = t('nguphap.tm.question', 'Đây là thì gì? Chọn đúng câu nhé!');
  els.play.appendChild(question);

  const options = document.createElement('div');
  options.className = 'gr-options';
  els.play.appendChild(options);

  const explain = document.createElement('div');
  explain.className = 'gr-explain';
  els.play.appendChild(explain);

  const game = makeTimeMachineGame(8, Math.random);
  const zonePast = timeline.querySelector('.tm-marker--past');
  const zoneNow = timeline.querySelector('.tm-marker--now');
  const zoneFuture = timeline.querySelector('.tm-marker--future');

  function updateHud() {
    hud.querySelector('.tm-score').textContent = game.score;
    hud.querySelector('.tm-round').textContent = `${game.index}/${game.rounds.length}`;
    hud.querySelector('.tm-streak').textContent = game.streak;
  }

  function renderScene() {
    const round = currentTimeMachineRound(game);
    if (!round) return;
    [zonePast, zoneNow, zoneFuture].forEach((z) => { z.innerHTML = ''; });
    [zonePast, zoneNow, zoneFuture].forEach((z) => z.parentElement.classList.remove('tm-zone--active'));
    timeline.querySelector('.tm-link-arrow')?.remove();
    const cueClass = round.cue === '🕐' ? 'tm-cue tm-cue--spin' : (round.cue === '🔁' ? 'tm-cue tm-cue--pulse' : 'tm-cue');
    const markerHtml = `<span class="tm-char">${round.character.emoji}</span><span class="${cueClass}">${round.cue}</span>`;
    if (round.timelineMark === 'past') { zonePast.innerHTML = markerHtml; zonePast.parentElement.classList.add('tm-zone--active'); }
    else if (round.timelineMark === 'now') { zoneNow.innerHTML = markerHtml; zoneNow.parentElement.classList.add('tm-zone--active'); }
    else if (round.timelineMark === 'future') { zoneFuture.innerHTML = markerHtml; zoneFuture.parentElement.classList.add('tm-zone--active'); }
    else if (round.timelineMark === 'past-to-now') {
      zonePast.innerHTML = `<span class="tm-char">${round.character.emoji}</span>`;
      zoneNow.innerHTML = `<span class="tm-cue">${round.cue}</span>`;
      const arrow = document.createElement('span');
      arrow.className = 'tm-link-arrow';
      arrow.textContent = '➡️';
      timeline.appendChild(arrow);
      zonePast.parentElement.classList.add('tm-zone--active');
      zoneNow.parentElement.classList.add('tm-zone--active');
    }
    explain.textContent = '';
    renderOptions(options, round.options, (o) => o.sentence, onPick);
  }

  function onPick(opt, btn) {
    if (state.busy) return;
    if (!game || game.over) return;
    state.busy = true;
    sfx.select();
    const round = currentTimeMachineRound(game);
    const tense = TENSES.find((tt) => tt.id === round.correctTenseId);
    const ev = answerTimeMachine(game, opt.tenseId);

    if (ev.retry) {
      btn.classList.add('wrong');
      btn.disabled = true;
      explain.textContent = `${tense.label} — ${tense.hint}`;
      sfx.fail();
      updateHud();
      speakSequence([
        { text: 'Chưa đúng, thử lại nhé.', lang: 'vi-VN', rate: 0.92 },
        { text: tense.label, lang: 'vi-VN', rate: 0.88 },
      ], () => { state.busy = false; });
      return;
    }

    markOptions(options, round.options, round.correctTenseId, (o) => o.tenseId, ev.correct ? null : btn);
    explain.textContent = `${tense.label} — ${tense.hint}`;
    if (ev.correct) sfx.match(1); else sfx.fail();
    updateHud();
    answeredOne();

    const seq = ev.correct
      ? [{ text: 'Đúng rồi, bé giỏi quá!', lang: 'vi-VN', rate: 0.92 }, { text: tense.label, lang: 'vi-VN', rate: 0.88 }]
      : [{ text: 'Chưa đúng.', lang: 'vi-VN', rate: 0.92 }, { text: tense.label, lang: 'vi-VN', rate: 0.88 }];
    speakSequence(seq, () => {
      state.busy = false;
      if (ev.gameDone) finish(game.score, game.bestStreak, game.won, 'timemachine');
      else { renderScene(); updateHud(); }
    });
  }

  renderScene();
  updateHud();
  state.ctx.cleanup = null;
}

/* ===== 2. Hai Hành Động Cùng Lúc ===== */

function startTwoActions() {
  const hud = document.createElement('div');
  hud.className = 'gr-hud';
  hud.innerHTML = `<span>⭐ <b class="ta-score">0</b></span><span class="ta-round">0/8</span><span>🔥 <b class="ta-streak">0</b></span>`;
  els.play.appendChild(hud);

  const scene = document.createElement('div');
  scene.className = 'ta-scene';
  els.play.appendChild(scene);

  const caption = document.createElement('div');
  caption.className = 'ta-scene-caption';
  caption.textContent = t('nguphap.ta.question', 'Chọn câu đúng mô tả tình huống này:');
  els.play.appendChild(caption);

  const options = document.createElement('div');
  options.className = 'gr-options';
  els.play.appendChild(options);

  const explain = document.createElement('div');
  explain.className = 'gr-explain';
  els.play.appendChild(explain);

  const GENERIC_EXPLAIN = t('nguphap.ta.rule', "Hành động NỀN (đang diễn ra lâu) dùng quá khứ tiếp diễn (was V-ing); sự kiện NGẮN xen vào dùng quá khứ đơn (V-ed).");

  const game = makeTwoActionsGame(8, Math.random);
  let pauseLoopId = null;

  function updateHud() {
    hud.querySelector('.ta-score').textContent = game.score;
    hud.querySelector('.ta-round').textContent = `${game.index}/${game.rounds.length}`;
    hud.querySelector('.ta-streak').textContent = game.streak;
  }

  function renderScene() {
    const round = currentTwoActionsRound(game);
    if (!round) return;
    if (pauseLoopId) clearInterval(pauseLoopId);
    scene.innerHTML = `<span class="ta-bg">${round.bg.emoji}</span><span class="ta-spark">⚡</span><span class="ta-interrupt">${round.interrupt.emoji}</span>`;
    explain.textContent = '';
    renderOptions(options, round.options, (o) => o.sentence, onPick);
    // Mô phỏng hành động NỀN bị gián đoạn: tạm dừng vòng lặp mỗi khi tia
    // chớp "⚡" xuất hiện, để bé thấy rõ 2 hành động không "chạy song song"
    // đều đặn mà có 1 sự kiện NGẮN xen ngang vào giữa.
    const bgEl = scene.querySelector('.ta-bg');
    pauseLoopId = setInterval(() => {
      bgEl.classList.add('ta-bg--paused');
      setTimeout(() => bgEl.classList.remove('ta-bg--paused'), 450);
    }, 1800);
  }

  function onPick(opt, btn) {
    if (state.busy) return;
    if (!game || game.over) return;
    state.busy = true;
    sfx.select();
    const round = currentTwoActionsRound(game);
    const ev = answerTwoActions(game, opt.pattern);

    if (ev.retry) {
      btn.classList.add('wrong');
      btn.disabled = true;
      explain.textContent = GENERIC_EXPLAIN;
      sfx.fail();
      updateHud();
      speakSequence([
        { text: 'Chưa đúng, thử lại nhé.', lang: 'vi-VN', rate: 0.92 },
        { text: GENERIC_EXPLAIN, lang: 'vi-VN', rate: 0.88 },
      ], () => { state.busy = false; });
      return;
    }

    markOptions(options, round.options, round.correctPattern, (o) => o.pattern, ev.correct ? null : btn);
    explain.textContent = GENERIC_EXPLAIN;
    if (ev.correct) sfx.match(1); else sfx.fail();
    updateHud();
    answeredOne();

    const seq = ev.correct
      ? [{ text: 'Đúng rồi, bé giỏi quá!', lang: 'vi-VN', rate: 0.92 }, { text: GENERIC_EXPLAIN, lang: 'vi-VN', rate: 0.88 }]
      : [{ text: 'Chưa đúng.', lang: 'vi-VN', rate: 0.92 }, { text: GENERIC_EXPLAIN, lang: 'vi-VN', rate: 0.88 }];
    speakSequence(seq, () => {
      state.busy = false;
      if (ev.gameDone) finish(game.score, game.bestStreak, game.won, 'twoactions');
      else { renderScene(); updateHud(); }
    });
  }

  renderScene();
  updateHud();
  state.ctx.cleanup = () => { if (pauseLoopId) clearInterval(pauseLoopId); };
}

/* ===== 3. So Sánh Hơn/Nhất Trực Quan ===== */

function startComparative() {
  const hud = document.createElement('div');
  hud.className = 'gr-hud';
  hud.innerHTML = `<span>⭐ <b class="cmp-score">0</b></span><span class="cmp-round">0/8</span><span>🔥 <b class="cmp-streak">0</b></span>`;
  els.play.appendChild(hud);

  const bars = document.createElement('div');
  bars.className = 'cmp-bars';
  els.play.appendChild(bars);

  const question = document.createElement('div');
  question.className = 'tm-question';
  els.play.appendChild(question);

  const options = document.createElement('div');
  options.className = 'gr-options';
  els.play.appendChild(options);

  const explain = document.createElement('div');
  explain.className = 'gr-explain';
  els.play.appendChild(explain);

  const game = makeComparativeGame(8, Math.random);

  function updateHud() {
    hud.querySelector('.cmp-score').textContent = game.score;
    hud.querySelector('.cmp-round').textContent = `${game.index}/${game.rounds.length}`;
    hud.querySelector('.cmp-streak').textContent = game.streak;
  }

  function renderScene() {
    const round = currentComparativeRound(game);
    if (!round) return;
    bars.innerHTML = '';
    const maxHeight = 120;
    const barEls = [];
    for (const ent of round.entities) {
      const h = round.heights[ent.id];
      const col = document.createElement('div');
      col.className = 'cmp-entity';
      col.innerHTML = `<span class="cmp-emoji">${ent.emoji}</span><div class="cmp-bar" style="height:0px"><span class="cmp-bar-icon">${round.attr.icon}</span></div>`;
      bars.appendChild(col);
      barEls.push({ el: col.querySelector('.cmp-bar'), target: Math.round((h / 5) * maxHeight) });
    }
    // Cho thanh đo "mọc lên" từ 0 mỗi vòng thay vì hiện sẵn — giúp bé nhìn
    // thấy RÕ sự khác biệt chiều cao giữa các thực thể thay vì chỉ đọc số.
    requestAnimationFrame(() => {
      for (const { el, target } of barEls) el.style.height = `${target}px`;
    });
    question.textContent = round.subtype === 'comparative'
      ? t('nguphap.cmp.question', 'Chọn câu so sánh đúng nhé!')
      : t('nguphap.cmp.question.super', 'Ai là nhất? Chọn câu đúng nhé!');
    explain.textContent = '';
    renderOptions(options, round.options, (o) => o.sentence, onPick);
  }

  function onPick(opt, btn) {
    if (state.busy) return;
    if (!game || game.over) return;
    state.busy = true;
    sfx.select();
    const round = currentComparativeRound(game);
    const ev = answerComparative(game, opt.key);
    const explainText = t('nguphap.cmp.rule', 'So sánh hơn (2 vật) dùng -er/more; so sánh nhất (từ 3 vật trở lên) dùng the -est/most.');

    if (ev.retry) {
      btn.classList.add('wrong');
      btn.disabled = true;
      explain.textContent = explainText;
      sfx.fail();
      updateHud();
      speakSequence([
        { text: 'Chưa đúng, thử lại nhé.', lang: 'vi-VN', rate: 0.92 },
        { text: explainText, lang: 'vi-VN', rate: 0.88 },
      ], () => { state.busy = false; });
      return;
    }

    markOptions(options, round.options, round.correctKey, (o) => o.key, ev.correct ? null : btn);
    explain.textContent = explainText;
    if (ev.correct) sfx.match(1); else sfx.fail();
    updateHud();
    answeredOne();

    const seq = ev.correct
      ? [{ text: 'Đúng rồi, bé giỏi quá!', lang: 'vi-VN', rate: 0.92 }, { text: explainText, lang: 'vi-VN', rate: 0.88 }]
      : [{ text: 'Chưa đúng.', lang: 'vi-VN', rate: 0.92 }, { text: explainText, lang: 'vi-VN', rate: 0.88 }];
    speakSequence(seq, () => {
      state.busy = false;
      if (ev.gameDone) finish(game.score, game.bestStreak, game.won, 'comparative');
      else { renderScene(); updateHud(); }
    });
  }

  renderScene();
  updateHud();
  state.ctx.cleanup = null;
}

/* ===== 4. Going To vs Will Trực Quan ===== */

function startGoingToWill() {
  const hud = document.createElement('div');
  hud.className = 'gr-hud';
  hud.innerHTML = `<span>⭐ <b class="gtw-score">0</b></span><span class="gtw-round">0/8</span><span>🔥 <b class="gtw-streak">0</b></span>`;
  els.play.appendChild(hud);

  const scene = document.createElement('div');
  scene.className = 'gtw-scene';
  els.play.appendChild(scene);

  const options = document.createElement('div');
  options.className = 'gr-options';
  els.play.appendChild(options);

  const explain = document.createElement('div');
  explain.className = 'gr-explain';
  els.play.appendChild(explain);

  const game = makeGoingToWillGame(8, Math.random);

  function updateHud() {
    hud.querySelector('.gtw-score').textContent = game.score;
    hud.querySelector('.gtw-round').textContent = `${game.index}/${game.rounds.length}`;
    hud.querySelector('.gtw-streak').textContent = game.streak;
  }

  function renderScene() {
    const round = currentGoingToWillRound(game);
    if (!round) return;
    const cueClass = round.scenario.correctForm === 'going-to' ? 'gtw-cue gtw-cue--plan' : 'gtw-cue gtw-cue--spontaneous';
    scene.innerHTML = `<span class="${cueClass}">${round.scenario.cue}</span><span class="gtw-caption">${round.scenario.cueLabel}</span>`;
    explain.textContent = '';
    renderOptions(options, round.options, (o) => o.sentence, onPick);
  }

  function onPick(opt, btn) {
    if (state.busy) return;
    if (!game || game.over) return;
    state.busy = true;
    sfx.select();
    const round = currentGoingToWillRound(game);
    const ev = answerGoingToWill(game, opt.key);
    const isGoingTo = round.correctKey === 'going-to-correct';
    const explainText = isGoingTo
      ? "'going to' vì đây là kế hoạch có sẵn hoặc dấu hiệu rõ ràng ngay trước mắt."
      : "'will' vì đây là quyết định ngay lúc nói, dự đoán cá nhân, hoặc lời hứa.";

    if (ev.retry) {
      btn.classList.add('wrong');
      btn.disabled = true;
      explain.textContent = explainText;
      sfx.fail();
      updateHud();
      speakSequence([
        { text: 'Chưa đúng, thử lại nhé.', lang: 'vi-VN', rate: 0.92 },
        { text: explainText, lang: 'vi-VN', rate: 0.88 },
      ], () => { state.busy = false; });
      return;
    }

    markOptions(options, round.options, round.correctKey, (o) => o.key, ev.correct ? null : btn);
    explain.textContent = explainText;
    if (ev.correct) sfx.match(1); else sfx.fail();
    updateHud();
    answeredOne();

    const seq = ev.correct
      ? [{ text: 'Đúng rồi, bé giỏi quá!', lang: 'vi-VN', rate: 0.92 }, { text: explainText, lang: 'vi-VN', rate: 0.88 }]
      : [{ text: 'Chưa đúng.', lang: 'vi-VN', rate: 0.92 }, { text: explainText, lang: 'vi-VN', rate: 0.88 }];
    speakSequence(seq, () => {
      state.busy = false;
      if (ev.gameDone) finish(game.score, game.bestStreak, game.won, 'goingtowill');
      else { renderScene(); updateHud(); }
    });
  }

  renderScene();
  updateHud();
  state.ctx.cleanup = null;
}

/* ===== 5. Modal Ai Đúng ===== */

function startModal() {
  const hud = document.createElement('div');
  hud.className = 'gr-hud';
  hud.innerHTML = `<span>⭐ <b class="md-score">0</b></span><span class="md-round">0/8</span><span>🔥 <b class="md-streak">0</b></span>`;
  els.play.appendChild(hud);

  const scene = document.createElement('div');
  scene.className = 'md-scene';
  els.play.appendChild(scene);

  const options = document.createElement('div');
  options.className = 'gr-options';
  els.play.appendChild(options);

  const explain = document.createElement('div');
  explain.className = 'gr-explain';
  els.play.appendChild(explain);

  const game = makeModalGame(8, Math.random);

  function updateHud() {
    hud.querySelector('.md-score').textContent = game.score;
    hud.querySelector('.md-round').textContent = `${game.index}/${game.rounds.length}`;
    hud.querySelector('.md-streak').textContent = game.streak;
  }

  function renderScene() {
    const round = currentModalRound(game);
    if (!round) return;
    scene.innerHTML = `<span class="md-icon">${round.situation.icon}</span><span class="md-caption">${round.situation.label}</span>`;
    explain.textContent = '';
    renderOptions(options, round.options, (o) => o.sentence, onPick);
  }

  function onPick(opt, btn) {
    if (state.busy) return;
    if (!game || game.over) return;
    state.busy = true;
    sfx.select();
    const round = currentModalRound(game);
    const ev = answerModal(game, opt.modal);
    const explainText = `${round.correctModal} — ${round.situation.label}.`;

    if (ev.retry) {
      btn.classList.add('wrong');
      btn.disabled = true;
      explain.textContent = explainText;
      sfx.fail();
      updateHud();
      speakSequence([
        { text: 'Chưa đúng, thử lại nhé.', lang: 'vi-VN', rate: 0.92 },
        { text: explainText, lang: 'vi-VN', rate: 0.88 },
      ], () => { state.busy = false; });
      return;
    }

    markOptions(options, round.options, round.correctModal, (o) => o.modal, ev.correct ? null : btn);
    explain.textContent = explainText;
    if (ev.correct) sfx.match(1); else sfx.fail();
    updateHud();
    answeredOne();

    const seq = ev.correct
      ? [{ text: 'Đúng rồi, bé giỏi quá!', lang: 'vi-VN', rate: 0.92 }, { text: explainText, lang: 'vi-VN', rate: 0.88 }]
      : [{ text: 'Chưa đúng.', lang: 'vi-VN', rate: 0.92 }, { text: explainText, lang: 'vi-VN', rate: 0.88 }];
    speakSequence(seq, () => {
      state.busy = false;
      if (ev.gameDone) finish(game.score, game.bestStreak, game.won, 'modal');
      else { renderScene(); updateHud(); }
    });
  }

  renderScene();
  updateHud();
  state.ctx.cleanup = null;
}

/* ===== 6. Câu Điều Kiện Loại 1 ===== */

function startConditional() {
  const hud = document.createElement('div');
  hud.className = 'gr-hud';
  hud.innerHTML = `<span>⭐ <b class="cnd-score">0</b></span><span class="cnd-round">0/8</span><span>🔥 <b class="cnd-streak">0</b></span>`;
  els.play.appendChild(hud);

  const scene = document.createElement('div');
  scene.className = 'cnd-scene';
  els.play.appendChild(scene);

  const options = document.createElement('div');
  options.className = 'gr-options';
  els.play.appendChild(options);

  const explain = document.createElement('div');
  explain.className = 'gr-explain';
  els.play.appendChild(explain);

  const game = makeConditionalGame(8, Math.random);
  const RULE = "Mệnh đề 'if' chia HIỆN TẠI ĐƠN, mệnh đề kết quả dùng 'will' + V nguyên mẫu — không dùng 'will' trong mệnh đề 'if'.";

  function updateHud() {
    hud.querySelector('.cnd-score').textContent = game.score;
    hud.querySelector('.cnd-round').textContent = `${game.index}/${game.rounds.length}`;
    hud.querySelector('.cnd-streak').textContent = game.streak;
  }

  function renderScene() {
    const round = currentConditionalRound(game);
    if (!round) return;
    scene.innerHTML = `<span class="cnd-cue">${round.scenario.cue}</span><span class="cnd-caption">${round.scenario.label}</span>`;
    explain.textContent = '';
    renderOptions(options, round.options, (o) => o.sentence, onPick);
  }

  function onPick(opt, btn) {
    if (state.busy) return;
    if (!game || game.over) return;
    state.busy = true;
    sfx.select();
    const round = currentConditionalRound(game);
    const ev = answerConditional(game, opt.key);

    if (ev.retry) {
      btn.classList.add('wrong');
      btn.disabled = true;
      explain.textContent = RULE;
      sfx.fail();
      updateHud();
      speakSequence([
        { text: 'Chưa đúng, thử lại nhé.', lang: 'vi-VN', rate: 0.92 },
        { text: RULE, lang: 'vi-VN', rate: 0.88 },
      ], () => { state.busy = false; });
      return;
    }

    markOptions(options, round.options, round.correctKey, (o) => o.key, ev.correct ? null : btn);
    explain.textContent = RULE;
    if (ev.correct) sfx.match(1); else sfx.fail();
    updateHud();
    answeredOne();

    const seq = ev.correct
      ? [{ text: 'Đúng rồi, bé giỏi quá!', lang: 'vi-VN', rate: 0.92 }, { text: RULE, lang: 'vi-VN', rate: 0.88 }]
      : [{ text: 'Chưa đúng.', lang: 'vi-VN', rate: 0.92 }, { text: RULE, lang: 'vi-VN', rate: 0.88 }];
    speakSequence(seq, () => {
      state.busy = false;
      if (ev.gameDone) finish(game.score, game.bestStreak, game.won, 'conditional');
      else { renderScene(); updateHud(); }
    });
  }

  renderScene();
  updateHud();
  state.ctx.cleanup = null;
}

/* ===== 7. Ghép Câu ===== */

function startSentenceBuilder() {
  const hud = document.createElement('div');
  hud.className = 'gr-hud';
  hud.innerHTML = `<span>⭐ <b class="sb-score">0</b></span><span class="sb-round">0/6</span><span>🔥 <b class="sb-streak">0</b></span>`;
  els.play.appendChild(hud);

  const scene = document.createElement('div');
  scene.className = 'sb-scene';
  els.play.appendChild(scene);

  const slots = document.createElement('div');
  slots.className = 'sb-slots';
  els.play.appendChild(slots);

  const chips = document.createElement('div');
  chips.className = 'sb-chips';
  els.play.appendChild(chips);

  const explain = document.createElement('div');
  explain.className = 'gr-explain';
  els.play.appendChild(explain);

  const game = makeSentenceBuilderGame(6, Math.random);

  function updateHud() {
    hud.querySelector('.sb-score').textContent = game.score;
    hud.querySelector('.sb-round').textContent = `${game.index}/${game.rounds.length}`;
    hud.querySelector('.sb-streak').textContent = game.streak;
  }

  function renderSlotsAndChips(round) {
    slots.innerHTML = '';
    for (let i = 0; i < round.words.length; i++) {
      const slot = document.createElement('span');
      slot.className = i < round.placedCount ? 'sb-slot sb-slot--filled' : 'sb-slot';
      slot.textContent = i < round.placedCount ? round.words[i] : '?';
      slots.appendChild(slot);
    }
    chips.innerHTML = '';
    for (const chip of round.chips) {
      const btn = document.createElement('button');
      btn.className = 'sb-chip';
      btn.dataset.wordIndex = String(chip.wordIndex);
      btn.textContent = chip.word;
      btn.addEventListener('click', () => onTap(chip, btn));
      chips.appendChild(btn);
    }
  }

  function renderScene() {
    const round = currentSentenceBuilderRound(game);
    if (!round) return;
    scene.innerHTML = `<span class="sb-icon">${round.item.icon}</span><span class="sb-vi">${round.item.vi}</span>`;
    explain.textContent = '';
    renderSlotsAndChips(round);
  }

  function onTap(chip, btn) {
    if (state.busy) return;
    if (!game || game.over) return;
    const round = currentSentenceBuilderRound(game);
    if (!round) return;
    const expectedIndex = round.placedCount;
    sfx.select();
    const ev = tapSentenceBuilderChip(game, chip.wordIndex);

    if (ev.wrong && ev.retry) {
      btn.classList.add('sb-chip--wrong');
      sfx.fail();
      setTimeout(() => {
        btn.classList.remove('sb-chip--wrong');
        chips.querySelector(`[data-word-index="${expectedIndex}"]`)?.classList.add('sb-chip--hint');
      }, 300);
      speak('Chưa đúng, thử từ được gợi ý sáng lên nhé.');
      return;
    }

    if (ev.wrong && !ev.retry) {
      state.busy = true;
      sfx.fail();
      renderSlotsAndChips(round);
      explain.textContent = round.item.en;
      updateHud();
      speakSequence([
        { text: 'Chưa đúng, cô đã ghép lại câu cho bé xem nhé.', lang: 'vi-VN', rate: 0.92 },
        { text: round.item.en, lang: 'en-US', rate: 0.85 },
      ], () => {
        state.busy = false;
        if (ev.gameDone) finish(game.score, game.bestStreak, game.won, 'sentencebuilder');
        else { renderScene(); updateHud(); }
      });
      return;
    }

    sfx.match(1);
    if (!ev.complete) {
      renderSlotsAndChips(round);
      updateHud();
      return;
    }

    state.busy = true;
    renderSlotsAndChips(round);
    explain.textContent = round.item.en;
    updateHud();
    answeredOne();
    speakSequence([
      { text: 'Đúng rồi, bé ghép câu giỏi quá!', lang: 'vi-VN', rate: 0.92 },
      { text: round.item.en, lang: 'en-US', rate: 0.85 },
    ], () => {
      state.busy = false;
      if (ev.gameDone) finish(game.score, game.bestStreak, game.won, 'sentencebuilder');
      else { renderScene(); updateHud(); }
    });
  }

  renderScene();
  updateHud();
  state.ctx.cleanup = null;
}

/* ===== Đăng ký & điều hướng ===== */

const GAMES = {
  timemachine: startTimeMachine,
  twoactions: startTwoActions,
  comparative: startComparative,
  goingtowill: startGoingToWill,
  modal: startModal,
  conditional: startConditional,
  sentencebuilder: startSentenceBuilder,
};

const HELP_TEXT = {
  timemachine: t('nguphap.timemachine.help', 'Nhìn trục thời gian: nhân vật xuất hiện ở mốc quá khứ, bây giờ hoặc tương lai kèm 1 biểu tượng — đồng hồ quay là đang diễn ra, dấu tích là đã xong, lịch là kế hoạch. Bé chọn đúng câu tiếng Anh khớp với hình. Sai thì được gợi ý chọn lại.'),
  twoactions: t('nguphap.twoactions.help', 'Có 2 hành động: 1 hành động nền đang diễn ra lâu, và 1 sự kiện ngắn xen vào giữa lúc đó. Bé chọn đúng câu ghép 2 hành động này bằng "while". Sai thì được gợi ý chọn lại.'),
  comparative: t('nguphap.comparative.help', 'Nhìn thanh đo của mỗi nhân vật: thanh càng cao thì tính chất đó (cao/nhanh/to/giỏi) càng nhiều. Có lúc so sánh 2 nhân vật (so sánh hơn), có lúc 3 nhân vật (so sánh nhất). Bé chọn đúng câu khớp với thanh đo.'),
  goingtowill: t('nguphap.goingtowill.help', 'Nhìn biểu tượng: va li đã đóng gói hoặc mây đen là kế hoạch/dấu hiệu rõ ràng (dùng going to); chuông điện thoại hoặc lời hứa là quyết định ngay lúc đó (dùng will). Bé chọn đúng câu.'),
  modal: t('nguphap.modal.help', 'Nhìn biển báo hoặc tình huống: biển cấm dùng mustn\'t, biển bắt buộc dùng must, lời khuyên nên làm dùng should, lời khuyên không nên làm dùng shouldn\'t. Bé chọn đúng động từ khuyết thiếu.'),
  conditional: t('nguphap.conditional.help', 'Nhìn nguyên nhân (biểu tượng) dẫn tới kết quả gì. Mệnh đề "if" chia hiện tại đơn, mệnh đề kết quả dùng "will" + V nguyên mẫu. Bé chọn đúng câu, tránh nhầm dùng "will" ngay trong mệnh đề "if".'),
  sentencebuilder: t('nguphap.sentencebuilder.help', 'Đọc nghĩa tiếng Việt, rồi bấm từng từ tiếng Anh theo đúng thứ tự để dựng lại câu. Bấm sai 1 lần sẽ có từ đúng sáng lên gợi ý, bấm sai lần 2 thì câu sẽ được ghép sẵn cho bé xem.'),
};

document.querySelectorAll('.mode-card').forEach((btn) => {
  btn.addEventListener('click', () => {
    sfx.select();
    const game = btn.dataset.game;
    startGame(game);
    sayInstruction(HELP_TEXT[game]);
  });
});

els.btnBack.addEventListener('click', () => { sfx.select(); showHome(); });
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});
els.btnAgain.addEventListener('click', () => { sfx.select(); startGame(state.game); });
els.btnHome2.addEventListener('click', () => { sfx.select(); showHome(); });

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
showHome();
mountKidFeatures(); // thanh avatar bé + kiểm tra giới hạn phút/ngày
sayInstruction(t('nguphap.help', 'Đây là Ngữ Pháp Trực Quan! Chọn Cỗ Máy Thời Gian để đoán thì qua hình ảnh trục thời gian, hoặc Hai Hành Động Cùng Lúc để ghép đúng câu khi có 2 việc xảy ra cùng lúc trong quá khứ.'));

// Hook cho e2e test
window.__nguphap = { state, startGame };
