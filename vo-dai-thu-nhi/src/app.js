// Điều phối Võ Đài Thú Nhí: chọn thú bông, đọc tín hiệu đòn của đối thủ rồi bấm đúng nút
// ĐẤM/ĐỠ/NÉ kịp lúc. Thú bông Twemoji (CC-BY), võ đài + hiệu ứng tự vẽ. Đầy nộ khí thì
// BIẾN HÌNH to đùng có hào quang. Không máu me — trúng đòn chỉ rung lắc như đồ chơi.

import {
  RAGE_MAX, FIGHTERS, FIGHTER_IDS, START_HP,
  makeCampaign, advanceCampaign, tick, act,
} from './vodai.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const CUE_ICON = { high: 'glove', low: 'dash', open: 'star' };
const CUE_LABEL = {
  high: ['Đòn cao tới — ĐỠ!', 'do'],
  low: ['Vồ thấp tới — NÉ!', 'ne'],
  open: ['Sơ hở kìa — ĐẤM!', 'dam'],
};

const $ = (id) => document.getElementById(id);
const els = {
  home: $('homeScreen'), battle: $('battleScreen'), pickRow: $('pickRow'),
  ring: $('ring'), fxLayer: $('fxLayer'),
  foeName: $('foeName'), foeHpFill: $('foeHpFill'), foeImg: $('foeImg'),
  meName: $('meName'), meHpFill: $('meHpFill'), meImg: $('meImg'),
  cueBox: $('cueBox'), cueIcon: $('cueIcon'), cueFill: $('cueFill'),
  rageRow: $('rageRow'), battleLog: $('battleLog'), roundChip: $('roundChip'),
  btnDam: $('btnDam'), btnDo: $('btnDo'), btnNe: $('btnNe'),
  btnBack: $('btnBack'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
  cheer: $('cheer'), cheerEmoji: $('cheerEmoji'), cheerText: $('cheerText'), btnCheerGo: $('btnCheerGo'),
};

const state = { level: 0, campaign: null, raf: 0, last: 0, startedAt: Date.now(), instruction: '' };
bindMute(() => sfx.muted);

/** Đọc hướng dẫn + lưu lại để bấm ❓ nghe lại được (bé chưa đọc chữ vẫn chơi được). */
function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/* ===== Màn chọn thú ===== */

function buildPickScreen() {
  els.pickRow.innerHTML = '';
  for (const id of FIGHTER_IDS) {
    const def = FIGHTERS[id];
    const card = document.createElement('button');
    card.className = 'pick-card';
    card.innerHTML = `
      <img src="images/${id}.svg" alt="" style="width:64px;height:64px">
      <span class="p-name">${def.name}</span>
      <span class="p-type">⭐ ${def.bigName}</span>
    `;
    card.addEventListener('click', () => startCampaign(id));
    els.pickRow.appendChild(card);
  }
}

function showHome() {
  cancelAnimationFrame(state.raf);
  els.home.classList.remove('hidden');
  els.battle.classList.add('hidden');
  els.cheer.classList.add('hidden');
  els.btnBack.hidden = true;
  state.campaign = null;
}

/* ===== Hiển thị trận ===== */

function renderMatch() {
  const c = state.campaign;
  const m = c.match;
  els.meName.textContent = m.transformed ? FIGHTERS[m.playerId].bigName : FIGHTERS[m.playerId].name;
  els.foeName.textContent = FIGHTERS[m.foeId].name;
  els.meImg.src = `images/${m.playerId}.svg`;
  els.foeImg.src = `images/${m.foeId}.svg`;
  els.meImg.classList.toggle('big', m.transformed);
  els.meHpFill.style.width = `${Math.max(0, (m.playerHp / START_HP) * 100)}%`;
  els.foeHpFill.style.width = `${Math.max(0, (m.foeHp / START_HP) * 100)}%`;
  els.roundChip.textContent = `${t('vodai.round', 'Hiệp')} ${c.roundIndex + 1}/${c.foes.length} · ${t('daovang.level', 'Màn')} ${c.level + 1}`;
  els.rageRow.innerHTML = '';
  for (let i = 0; i < RAGE_MAX; i++) {
    const img = document.createElement('img');
    img.src = 'images/star.svg';
    img.alt = '';
    if (i < m.rage || m.transformed) img.classList.add('on');
    els.rageRow.appendChild(img);
  }
}

function shake(el) {
  el.classList.remove('hit2');
  void el.offsetWidth;
  el.classList.add('hit2');
}

function burstAt(el, icon) {
  const a = els.ring.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  const fx = document.createElement('div');
  fx.className = 'fx-burst';
  fx.textContent = icon;
  fx.style.left = `${r.left + r.width / 2 - a.left}px`;
  fx.style.top = `${r.top + r.height / 2 - a.top}px`;
  els.fxLayer.appendChild(fx);
  setTimeout(() => fx.remove(), 500);
}

/* ===== Vòng lặp thời gian thực ===== */

function loop(now) {
  const dtMs = Math.min(60, now - state.last);
  state.last = now;
  const c = state.campaign;
  const m = c.match;
  const ev = tick(m, dtMs, Math.random);

  if (ev.cueStart) {
    sfx.select();
    els.cueBox.classList.remove('hidden');
    els.cueIcon.src = `images/${CUE_ICON[m.cue.type]}.svg`;
    els.battleLog.textContent = CUE_LABEL[m.cue.type][0];
  }
  if (m.cue) {
    els.cueFill.style.width = `${Math.max(0, 100 - (m.cue.t / m.cue.windowMs) * 100)}%`;
  } else {
    els.cueBox.classList.add('hidden');
  }
  if (ev.late && ev.foeHit) {
    sfx.fail();
    shake(els.meImg);
    burstAt(els.meImg, '💥');
    els.battleLog.textContent = t('vodai.late', 'Chậm mất rồi, dính đòn!');
    renderMatch();
  } else if (ev.late) {
    els.battleLog.textContent = t('vodai.missopen', 'Tuột mất cơ hội đấm!');
  }

  if (m.over) return endMatch();
  state.raf = requestAnimationFrame(loop);
}

function onAct(action) {
  const c = state.campaign;
  if (!c || c.match.over) return;
  const m = c.match;
  const ev = act(m, action, Math.random);
  if (ev.result === null) return;
  if (ev.result === 'hit') {
    sfx.match(m.transformed ? 3 : 2);
    shake(els.foeImg);
    burstAt(els.foeImg, '💥');
    els.battleLog.textContent = `${t('vodai.hit', 'Đấm trúng!')} -${ev.dmg}`;
  } else if (ev.result === 'block') {
    sfx.match(1);
    burstAt(els.meImg, '🛡️');
    els.battleLog.textContent = t('vodai.block', 'Đỡ được rồi!');
  } else if (ev.result === 'dodge') {
    sfx.match(1);
    burstAt(els.meImg, '💨');
    els.battleLog.textContent = t('vodai.dodge', 'Né đẹp quá!');
  } else {
    sfx.fail();
    shake(els.meImg);
    burstAt(els.meImg, '💥');
    els.battleLog.textContent = `${t('vodai.wrong', 'Sai nút rồi, dính đòn!')} -${ev.dmg}`;
  }
  if (ev.transformed) {
    sfx.levelWin();
    els.battleLog.textContent = `⭐ ${FIGHTERS[m.playerId].bigName}!`;
    speak(`${t('vodai.transform', 'Biến hình!')} ${FIGHTERS[m.playerId].bigName}!`);
  }
  renderMatch();
}

function endMatch() {
  cancelAnimationFrame(state.raf);
  const c = state.campaign;
  els.cueBox.classList.add('hidden');
  setTimeout(() => {
    const next = advanceCampaign(c);
    if (next) {
      sfx.levelWin();
      els.battleLog.textContent = t('vodai.nextfoe', 'Thắng hiệp này rồi! Bạn thú kế lên đài!');
      speak(t('vodai.nextfoe', 'Thắng hiệp này rồi! Bạn thú kế lên đài!'));
      renderMatch();
      state.last = performance.now();
      state.raf = requestAnimationFrame(loop);
    } else {
      endCampaign();
    }
  }, 800);
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
    mode: 'vodai',
    result: c.won ? 'win' : 'quit',
    score: (c.won ? c.foes.length : c.roundIndex) * 25,
    level: c.level + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  if (c.won) {
    sfx.levelWin();
    confetti();
    els.cheerEmoji.textContent = '🏆';
    els.cheerText.textContent = t('vodai.win', 'Vô địch võ đài thú bông!');
    els.btnCheerGo.textContent = t('vodai.next', 'ĐẤU MÀN MỚI ▶');
    els.btnCheerGo.onclick = () => { sfx.select(); state.level++; startCampaign(c.playerId); };
    speak(t('vodai.win', 'Vô địch võ đài thú bông!'));
  } else {
    sfx.gameOver();
    els.cheerEmoji.textContent = '🧸';
    els.cheerText.textContent = t('vodai.lose', 'Thú bông mệt rồi, đấu lại nhé!');
    els.btnCheerGo.textContent = t('ran.retry', 'CHƠI LẠI ▶');
    els.btnCheerGo.onclick = () => { sfx.select(); state.level = 0; showHome(); };
    speak(t('vodai.lose', 'Thú bông mệt rồi, đấu lại nhé!'));
  }
  els.cheer.classList.remove('hidden');
}

function startCampaign(fighterId) {
  els.cheer.classList.add('hidden');
  els.home.classList.add('hidden');
  els.battle.classList.remove('hidden');
  els.btnBack.hidden = false;
  state.startedAt = Date.now();
  state.campaign = makeCampaign(fighterId, state.level, Math.random);
  els.battleLog.textContent = '';
  els.cueBox.classList.add('hidden');
  renderMatch();
  sayInstruction(t('vodai.help.battle', 'Nhìn tín hiệu giữa đài: thấy găng tay là đòn cao phải bấm ĐỠ, thấy gió là vồ thấp phải bấm NÉ, thấy ngôi sao là địch sơ hở — ĐẤM ngay! Phản ứng đúng năm lần sẽ được biến hình to đùng!'));
  state.last = performance.now();
  state.raf = requestAnimationFrame(loop);
}

/* ===== Nút ===== */

els.btnDam.addEventListener('pointerdown', (e) => { e.preventDefault(); onAct('dam'); });
els.btnDo.addEventListener('pointerdown', (e) => { e.preventDefault(); onAct('do'); });
els.btnNe.addEventListener('pointerdown', (e) => { e.preventDefault(); onAct('ne'); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a') onAct('dam');
  else if (e.key === 'ArrowDown' || e.key === 's') onAct('do');
  else if (e.key === 'ArrowRight' || e.key === 'd') onAct('ne');
});

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
sayInstruction(t('vodai.help.home', 'Chọn một bạn thú bông để lên võ đài!'));

// Hook cho e2e test
window.__vodai = { state, startCampaign, onAct };
