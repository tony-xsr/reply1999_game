// Điều phối Thú Cưng Đại Chiến: chọn thú, đấu theo lượt qua 1 chuỗi đối thủ, hồi máu giữa các trận.

import { CREATURES, makeCampaign, useMove, advanceCampaign } from './thucung.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const TYPE_EMOJI = { fire: '🔥', water: '💧', grass: '🌿' };
const TYPE_NAME = { fire: 'Lửa', water: 'Nước', grass: 'Cỏ' };

const $ = (id) => document.getElementById(id);
const els = {
  home: $('homeScreen'), battle: $('battleScreen'), pickRow: $('pickRow'),
  btnBack: $('btnBack'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
  enemyName: $('enemyName'), enemyHpFill: $('enemyHpFill'), enemyEmoji: $('enemyEmoji'),
  playerName: $('playerName'), playerHpFill: $('playerHpFill'), playerEmoji: $('playerEmoji'),
  battleLog: $('battleLog'), moveRow: $('moveRow'), roundChip: $('roundChip'),
  cheer: $('cheer'), cheerEmoji: $('cheerEmoji'), cheerText: $('cheerText'), btnCheerGo: $('btnCheerGo'),
};

const state = { level: 0, campaign: null, busy: false, startedAt: Date.now(), instruction: '' };
bindMute(() => sfx.muted);

/** Đọc hướng dẫn + lưu lại để bấm ❓ nghe lại được (bé chưa đọc chữ vẫn chơi được). */
function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

function buildPickScreen() {
  els.pickRow.innerHTML = '';
  for (const id of Object.keys(CREATURES)) {
    const def = CREATURES[id];
    const card = document.createElement('button');
    card.className = 'pick-card';
    card.innerHTML = `
      <span class="p-emoji">${def.emoji}</span>
      <span class="p-name">${def.name}</span>
      <span class="p-type">${TYPE_EMOJI[def.type]} Hệ ${TYPE_NAME[def.type]}</span>
    `;
    card.addEventListener('click', () => startCampaign(id));
    els.pickRow.appendChild(card);
  }
}

function showHome() {
  els.home.classList.remove('hidden');
  els.battle.classList.add('hidden');
  els.cheer.classList.add('hidden');
  els.btnBack.hidden = true;
  state.campaign = null;
}

function renderBattle() {
  const c = state.campaign;
  const b = c.battle;
  const playerDef = CREATURES[b.player.id];
  const enemyDef = CREATURES[b.enemy.id];

  els.playerEmoji.textContent = playerDef.emoji;
  els.playerName.textContent = `${playerDef.name} ${TYPE_EMOJI[playerDef.type]}`;
  els.playerHpFill.style.width = `${Math.max(0, (b.player.hp / playerDef.maxHp) * 100)}%`;

  els.enemyEmoji.textContent = enemyDef.emoji;
  els.enemyName.textContent = `${enemyDef.name} ${TYPE_EMOJI[enemyDef.type]}`;
  els.enemyHpFill.style.width = `${Math.max(0, (b.enemy.hp / enemyDef.maxHp) * 100)}%`;

  els.roundChip.textContent = `${t('thucung.round', 'Trận')} ${c.roundIndex + 1}/${c.opponents.length}`;

  els.moveRow.innerHTML = '';
  playerDef.moves.forEach((move, idx) => {
    const btn = document.createElement('button');
    btn.className = 'move-btn';
    btn.textContent = `${move.name}`;
    btn.disabled = state.busy || b.over;
    btn.addEventListener('click', () => onMove(idx));
    els.moveRow.appendChild(btn);
  });
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

function endCampaign() {
  const c = state.campaign;
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'thucung',
    result: c.won ? 'win' : 'quit',
    score: (c.won ? c.opponents.length : c.roundIndex) * 20,
    level: c.level + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (c.won) {
    sfx.levelWin();
    confetti();
    els.cheerEmoji.textContent = '🏆';
    els.cheerText.textContent = t('thucung.win', 'Đại thắng! Bé đã hạ hết đối thủ!');
    els.btnCheerGo.textContent = t('thucung.next', 'ĐẤU TIẾP MÀN MỚI ▶');
    els.btnCheerGo.onclick = () => { sfx.select(); state.level++; startCampaign(c.playerCreatureId); };
    speak(t('thucung.win', 'Đại thắng! Bé đã hạ hết đối thủ!'));
  } else {
    sfx.gameOver();
    els.cheerEmoji.textContent = '😵';
    els.cheerText.textContent = t('thucung.lose', 'Thua rồi, thử lại nhé!');
    els.btnCheerGo.textContent = t('ran.retry', 'CHƠI LẠI ▶');
    els.btnCheerGo.onclick = () => { sfx.select(); state.level = 0; showHome(); };
    speak(t('thucung.lose', 'Thua rồi, thử lại nhé!'));
  }
  els.cheer.classList.remove('hidden');
}

function onMove(idx) {
  const c = state.campaign;
  if (state.busy || c.battle.over) return;
  state.busy = true;
  const result = useMove(c.battle, idx, Math.random);
  if (!result) { state.busy = false; return; }

  const [playerTurn, enemyTurn] = result.log;
  sfx.match(2);
  els.battleLog.textContent = `${CREATURES[c.battle.player.id].name} dùng ${playerTurn.move}! -${playerTurn.dmg} máu`;
  els.enemyEmoji.classList.remove('hit'); void els.enemyEmoji.offsetWidth; els.enemyEmoji.classList.add('hit');
  renderBattle();
  speak(`${playerTurn.move}!`);

  setTimeout(() => {
    if (enemyTurn) {
      els.battleLog.textContent = `${CREATURES[c.battle.enemy.id].name} dùng ${enemyTurn.move}! -${enemyTurn.dmg} máu`;
      els.playerEmoji.classList.remove('hit'); void els.playerEmoji.offsetWidth; els.playerEmoji.classList.add('hit');
      if (c.battle.player.hp <= 0) sfx.fail();
      renderBattle();
    }
    if (c.battle.over) {
      setTimeout(() => {
        if (c.battle.won && !enemyTurn) speak('Hạ gục!');
        const nextBattle = advanceCampaign(c, Math.random);
        state.busy = false;
        if (nextBattle) {
          sfx.levelWin();
          els.battleLog.textContent = t('thucung.nextfoe', 'Thắng rồi! Đối thủ tiếp theo xuất hiện!');
          renderBattle();
        } else {
          endCampaign();
        }
      }, 700);
    } else {
      state.busy = false;
    }
  }, 700);
}

function startCampaign(creatureId) {
  els.cheer.classList.add('hidden');
  els.home.classList.add('hidden');
  els.battle.classList.remove('hidden');
  els.btnBack.hidden = false;
  state.busy = false;
  state.startedAt = Date.now();
  state.campaign = makeCampaign(creatureId, state.level, Math.random);
  els.battleLog.textContent = '';
  renderBattle();
  sayInstruction(t('thucung.help.battle', 'Bấm vào 1 chiêu để tấn công — nhớ hệ khắc chế: Lửa khắc Cỏ, Cỏ khắc Nước, Nước khắc Lửa!'));
}

/* ===== Nút ===== */

els.btnBack.addEventListener('click', () => { sfx.select(); showHome(); });
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
buildPickScreen();
showHome();
sayInstruction(t('thucung.help.home', 'Chọn 1 thú cưng của bé để bắt đầu đại chiến!'));

// Hook cho e2e test
window.__thucung = { state, startCampaign, onMove };
