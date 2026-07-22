// Oẳn Tù Tì — tách riêng từ tro-xua/ (trước đây "Sân Chơi Ngày Bé" gộp 4 trò
// trong 1 game, nay tách thành 4 game riêng, mỗi game 1 thẻ trong Trò Chơi
// Xưa). Dùng lại NGUYÊN logic RPS/rpsResult/rpsExplain/rpsAi từ tro-xua/src/
// troxua.js (không sao chép logic).

import { RPS, rpsResult, rpsExplain, rpsAi } from '../../tro-xua/src/troxua.js';
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
  subLine: $('subLine'), play: $('playScreen'),
  btnNew: $('btnNew'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
  cheer: $('cheer'), cheerEmoji: $('cheerEmoji'), cheerText: $('cheerText'), btnAgain: $('btnAgain'),
};

const state = { startedAt: Date.now(), instruction: '' };
bindMute(() => sfx.muted);

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

function finish(emoji, text, score, sayText) {
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'oantuti',
    result: 'win',
    score,
    level: 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  sfx.levelWin();
  confetti();
  els.cheerEmoji.textContent = emoji;
  els.cheerText.textContent = text;
  els.cheer.classList.remove('hidden');
  speak(sayText);
}

function startRps() {
  els.cheer.classList.add('hidden');
  state.startedAt = Date.now();
  els.play.innerHTML = '';
  const ctx = { me: 0, ai: 0, busy: false };

  els.play.innerHTML = `
    <div class="rps-score"><span class="me">😊 <b id="rpsMe">0</b></span><span class="ai">🤖 <b id="rpsAi">0</b></span></div>
    <div class="rps-arena">
      <div class="rps-hand" id="handMe">✊</div>
      <div class="rps-vs">VS</div>
      <div class="rps-hand" id="handAi">✊</div>
    </div>
    <div class="rps-note" id="rpsNote"></div>
    <div class="rps-pick" id="rpsPick"></div>`;
  const note = $('rpsNote');
  const handMe = $('handMe');
  const handAi = $('handAi');
  const pickRow = $('rpsPick');

  const buttons = RPS.map((option) => {
    const btn = document.createElement('button');
    btn.className = 'rps-btn';
    btn.textContent = option.icon;
    btn.addEventListener('click', () => play(option));
    pickRow.appendChild(btn);
    return btn;
  });

  async function play(mine) {
    if (ctx.busy) return;
    ctx.busy = true;
    buttons.forEach((b) => { b.disabled = true; });
    handMe.textContent = '✊';
    handAi.textContent = '✊';
    handMe.classList.add('bounce');
    handAi.classList.add('bounce');
    const chant = ['Oẳn...', 'tù...', 'tì!'];
    for (let i = 0; i < 3; i++) {
      note.textContent = chant.slice(0, i + 1).join(' ');
      speak(chant[i].replace('...', ''));
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 520));
    }
    handMe.classList.remove('bounce');
    handAi.classList.remove('bounce');
    const theirs = rpsAi();
    handMe.textContent = mine.icon;
    handAi.textContent = RPS.find((o) => o.id === theirs).icon;
    const result = rpsResult(mine.id, theirs);
    if (result === 0) {
      note.textContent = t('caro.draw', 'Hòa rồi!');
      sfx.shuffle();
      speak('Hòa! Chơi lại nào!');
    } else {
      const [winner, loser] = result > 0 ? [mine.id, theirs] : [theirs, mine.id];
      const explain = rpsExplain(winner, loser);
      note.innerHTML = `<b>${explain.toUpperCase()}</b> — ${result > 0 ? t('troxua.rps.win', 'bé thắng ván này!') : t('troxua.rps.lose', 'máy thắng ván này!')}`;
      if (result > 0) { ctx.me++; sfx.match(3); } else { ctx.ai++; sfx.fail(); }
      speak(`${explain}! ${result > 0 ? 'Bé thắng!' : 'Máy thắng!'}`);
      $('rpsMe').textContent = ctx.me;
      $('rpsAi').textContent = ctx.ai;
    }
    if (ctx.me >= 3 || ctx.ai >= 3) {
      setTimeout(() => finish(
        ctx.me > ctx.ai ? '🏆' : '🤖',
        `${ctx.me > ctx.ai ? t('troxua.rps.champion', 'Bé vô địch oẳn tù tì!') : t('caro.ai.win', 'Máy thắng — thử lại nhé!')}\n😊 ${ctx.me} — ${ctx.ai} 🤖`,
        ctx.me * 10,
        ctx.me > ctx.ai ? 'Hoan hô! Bé vô địch oẳn tù tì!' : 'Máy thắng rồi, chơi lại nhé!',
      ), 1200);
      return;
    }
    ctx.busy = false;
    buttons.forEach((b) => { b.disabled = false; });
  }

  els.subLine.textContent = t('troxua.rps.hint', 'Thắng 3 ván trước là vô địch! Bao bọc búa, búa đập kéo, kéo cắt bao');
  state.instruction = 'Oẳn tù tì! Chọn búa, bao hoặc kéo nhé!';
  speak(state.instruction);
}

els.btnNew.addEventListener('click', () => { sfx.shuffle(); startRps(); });
els.btnAgain.addEventListener('click', () => { sfx.select(); startRps(); });
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
startRps();

// Hook cho e2e test
window.__oantuti = { state, startRps };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày
