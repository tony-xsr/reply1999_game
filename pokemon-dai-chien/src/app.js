// Điều phối Pokémon Đại Chiến: chọn Pokémon khởi đầu, đấu theo lượt qua chuỗi đối thủ,
// tiến hóa sau các trận thắng, trùm chờ ở trận cuối. Sprite thật lấy từ /pokemon/images/.

import {
  POKEMON, STARTERS, spritePath, typeMultiplier, makeCampaign, useMove, advanceCampaign,
} from './pokedaichien.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';
import { mountKidFeatures } from '../../shared/kid-bar.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const TYPE_INFO = {
  fire: { icon: '🔥', name: 'Lửa', color: '#e8590c', btn: ['#ff922b', '#d9480f'] },
  water: { icon: '💧', name: 'Nước', color: '#1c7ed6', btn: ['#4dabf7', '#1864ab'] },
  grass: { icon: '🌿', name: 'Cỏ', color: '#2f9e44', btn: ['#69db7c', '#2b8a3e'] },
  electric: { icon: '⚡', name: 'Điện', color: '#f08c00', btn: ['#ffd43b', '#e67700'] },
  rock: { icon: '🪨', name: 'Đá', color: '#8d6e63', btn: ['#bcaaa4', '#6d4c41'] },
  normal: { icon: '⭐', name: 'Thường', color: '#868e96', btn: ['#adb5bd', '#495057'] },
  psychic: { icon: '🔮', name: 'Siêu Linh', color: '#ae3ec9', btn: ['#da77f2', '#862e9c'] },
  dragon: { icon: '🐉', name: 'Rồng', color: '#3b5bdb', btn: ['#748ffc', '#364fc7'] },
};

// Đòn chạm đích nổ đúng "chất" của hệ
const TYPE_IMPACT = {
  fire: '🔥', water: '💦', grass: '🍃', electric: '⚡',
  rock: '🪨', normal: '💥', psychic: '🔮', dragon: '🌀',
};

// Biểu tượng "tuyệt chiêu" bay theo hệ của người ra đòn
const TYPE_FX = {
  fire: '🔥', water: '💧', grass: '🍃', electric: '⚡',
  rock: '🪨', normal: '⭐', psychic: '🔮', dragon: '🌀',
};

const $ = (id) => document.getElementById(id);
const els = {
  home: $('homeScreen'), battle: $('battleScreen'), pickRow: $('pickRow'), filterRow: $('filterRow'),
  arena: $('arena'), fxLayer: $('fxLayer'),
  btnBack: $('btnBack'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
  enemyName: $('enemyName'), enemyType: $('enemyType'), enemyHpFill: $('enemyHpFill'),
  enemyHpText: $('enemyHpText'), enemySprite: $('enemySprite'),
  playerName: $('playerName'), playerType: $('playerType'), playerHpFill: $('playerHpFill'),
  playerHpText: $('playerHpText'), playerSprite: $('playerSprite'),
  bossBanner: $('bossBanner'), evolveFlash: $('evolveFlash'),
  battleLog: $('battleLog'), moveRow: $('moveRow'), roundChip: $('roundChip'),
  cheer: $('cheer'), cheerEmoji: $('cheerEmoji'), cheerSprite: $('cheerSprite'),
  cheerText: $('cheerText'), btnCheerGo: $('btnCheerGo'),
};

const state = { level: 0, campaign: null, busy: false, startedAt: Date.now(), instruction: '' };
bindMute(() => sfx.muted);

/** Đọc hướng dẫn + lưu lại để bấm ❓ nghe lại được (bé chưa đọc chữ vẫn chơi được). */
function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

function typeBadge(el, type) {
  const info = TYPE_INFO[type];
  el.textContent = `${info.icon} ${info.name}`;
  el.style.setProperty('--tb', info.color);
}

function setHpBar(fill, textEl, hp, def) {
  const pct = Math.max(0, (hp / def.maxHp) * 100);
  fill.style.width = `${pct}%`;
  fill.classList.toggle('mid', pct <= 55 && pct > 25);
  fill.classList.toggle('low', pct <= 25);
  textEl.textContent = `${Math.max(0, hp)}/${def.maxHp} · ⚔️${def.atk} 🛡️${def.def}`;
}

/* ===== Màn chọn Pokémon ===== */

const state2 = { filter: 'all' }; // bộ lọc hệ ở màn chọn

function buildFilterRow() {
  els.filterRow.innerHTML = '';
  const options = [['all', `✨ ${t('pokedc.all', 'Tất cả')}`]]
    .concat([...new Set(STARTERS.map((id) => POKEMON[id].type))]
      .map((type) => [type, `${TYPE_INFO[type].icon} ${TYPE_INFO[type].name}`]));
  for (const [value, label] of options) {
    const btn = document.createElement('button');
    btn.className = `filter-btn${state2.filter === value ? ' active' : ''}`;
    btn.textContent = label;
    if (value !== 'all') btn.style.setProperty('--fb', TYPE_INFO[value].color);
    btn.addEventListener('click', () => {
      sfx.select();
      state2.filter = value;
      buildFilterRow();
      buildPickScreen();
    });
    els.filterRow.appendChild(btn);
  }
}

function buildPickScreen() {
  els.pickRow.innerHTML = '';
  const ids = STARTERS.filter((id) => state2.filter === 'all' || POKEMON[id].type === state2.filter);
  for (const id of ids) {
    const def = POKEMON[id];
    const info = TYPE_INFO[def.type];
    const card = document.createElement('button');
    card.className = 'pick-card';
    card.innerHTML = `
      <img class="p-sprite" src="${spritePath(id)}" alt="${def.name}" draggable="false">
      <span class="p-name">${def.name}</span>
      <span class="type-badge" style="--tb:${info.color}">${info.icon} ${info.name}</span>
      <span class="p-stats">❤️${def.maxHp} ⚔️${def.atk} 🛡️${def.def}</span>
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

/* ===== Đấu trường ===== */

function renderBattle() {
  const c = state.campaign;
  const b = c.battle;
  const playerDef = POKEMON[b.player.id];
  const enemyDef = POKEMON[b.enemy.id];

  els.playerSprite.src = spritePath(b.player.id);
  els.playerName.textContent = playerDef.name;
  typeBadge(els.playerType, playerDef.type);
  setHpBar(els.playerHpFill, els.playerHpText, b.player.hp, playerDef);

  els.enemySprite.src = spritePath(b.enemy.id);
  els.enemyName.textContent = enemyDef.name;
  typeBadge(els.enemyType, enemyDef.type);
  setHpBar(els.enemyHpFill, els.enemyHpText, b.enemy.hp, enemyDef);

  els.roundChip.textContent =
    `${t('pokedc.round', 'Trận')} ${c.roundIndex + 1}/${c.opponents.length} · ${t('daovang.level', 'Màn')} ${c.level + 1}`;

  const btnColors = TYPE_INFO[playerDef.type].btn;
  els.moveRow.innerHTML = '';
  playerDef.moves.forEach((move, idx) => {
    const btn = document.createElement('button');
    btn.className = 'move-btn';
    // tên chiêu + hệ + LỰC ĐÁNH + ước tính SÁT THƯƠNG thật vào đúng đối thủ đang gặp —
    // công thức khớp hệt computeDamage() bên logic (power × atk/def × hệ × 85–115%)
    const eff = typeMultiplier(playerDef.type, enemyDef.type);
    const base = move.power * (playerDef.atk / enemyDef.def) * eff;
    const lo = Math.max(1, Math.round(base * 0.85));
    const hi = Math.max(1, Math.round(base * 1.15));
    const effIcon = eff > 1 ? '⬆️' : eff < 1 ? '⬇️' : '';
    btn.innerHTML = `<span>${TYPE_INFO[playerDef.type].icon} ${move.name}</span>
      <span class="m-power">💥 ${move.power} · ${lo}-${hi}${effIcon}</span>`;
    btn.style.setProperty('--mb1', btnColors[0]);
    btn.style.setProperty('--mb2', btnColors[1]);
    btn.disabled = state.busy || b.over;
    btn.addEventListener('click', () => onMove(idx));
    els.moveRow.appendChild(btn);
  });
}

function flashBossBanner() {
  els.bossBanner.classList.remove('hidden');
  setTimeout(() => els.bossBanner.classList.add('hidden'), 1600);
}

function hitAnim(spriteEl) {
  spriteEl.classList.remove('hit');
  void spriteEl.offsetWidth;
  spriteEl.classList.add('hit');
}

/** Tâm 1 phần tử theo tọa độ px bên trong đấu trường. */
function centerOf(el) {
  const a = els.arena.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2 - a.left, y: r.top + r.height / 2 - a.top };
}

/**
 * Bắn 1 viên chiêu bay từ from → to theo QUỸ ĐẠO CONG (parabol lồng — vọt lên rồi hạ xuống
 * đích, như tung 1 quả cầu năng lượng chứ không phải đường thẳng cứng nhắc). Có lệch nhẹ
 * (jitter) cho loạt nhiều viên bắn liên tiếp trông không đơ.
 */
function shootProjectile(from, to, icon, jitter, onDone) {
  const proj = document.createElement('div');
  proj.className = 'fx-proj';
  proj.textContent = icon;
  els.fxLayer.appendChild(proj);
  const dur = 380;
  const arcHeight = 46 + Math.random() * 20; // độ vọt cong lên khác nhau mỗi viên
  const t0 = performance.now();
  function step(now) {
    const p = Math.min(1, (now - t0) / dur);
    const ease = 1 - (1 - p) * (1 - p); // ease-out cho mượt
    const x = from.x + (to.x - from.x) * ease + jitter;
    const arc = Math.sin(p * Math.PI) * arcHeight; // vọt cong lên giữa đường rồi hạ xuống
    const y = from.y + (to.y - from.y) * ease - arc + jitter * 0.5;
    proj.style.left = `${x}px`;
    proj.style.top = `${y}px`;
    proj.style.setProperty('--spin', `${p * 360}deg`);
    if (p < 1) requestAnimationFrame(step);
    else { proj.remove(); onDone?.(); }
  }
  requestAnimationFrame(step);
}

/**
 * Tuyệt chiêu "sát tên gọi" hơn: người ra đòn lao tới, chiêu bay theo hệ —
 * chiêu càng MẠNH bắn loạt càng nhiều viên; chạm đích nổ đúng chất hệ (💦🍃⚡🪨...),
 * chiêu Điện chớp sáng cả sân, đòn khắc hệ rung cả đấu trường + số sát thương bay lên.
 */
function playAttackFx(fromEl, toEl, type, dmg, effective, power, done) {
  fromEl.classList.remove('lunge-r', 'lunge-l');
  void fromEl.offsetWidth;
  fromEl.classList.add(fromEl === els.playerSprite ? 'lunge-r' : 'lunge-l');

  const from = centerOf(fromEl);
  const to = centerOf(toEl);
  const volley = power >= 25 ? 3 : power >= 17 ? 2 : 1; // chiêu mạnh → loạt nhiều viên
  for (let i = 0; i < volley; i++) {
    setTimeout(() => shootProjectile(from, to, TYPE_FX[type] || '✨', (i - 1) * 14), i * 110);
  }
  if (type === 'electric') {
    els.arena.classList.remove('zap');
    void els.arena.offsetWidth;
    els.arena.classList.add('zap');
  }

  const impactAt = 420 + (volley - 1) * 110;
  setTimeout(() => {
    // vòng sóng va chạm lan ra — hiệu quả cực mạnh thì vòng sóng vàng to hơn hẳn
    const ripple = document.createElement('div');
    ripple.className = 'fx-ripple';
    ripple.style.setProperty('--rc', effective > 1 ? '#ffd93d' : TYPE_INFO[type]?.color || '#fff');
    ripple.style.left = `${to.x}px`;
    ripple.style.top = `${to.y}px`;
    if (effective > 1) ripple.style.borderWidth = '6px';
    els.fxLayer.appendChild(ripple);
    setTimeout(() => ripple.remove(), 520);
    // nổ chính giữa theo hệ + các mảnh nhỏ văng quanh
    const burst = document.createElement('div');
    burst.className = 'fx-burst';
    burst.textContent = TYPE_IMPACT[type] || '💥';
    burst.style.left = `${to.x}px`;
    burst.style.top = `${to.y}px`;
    els.fxLayer.appendChild(burst);
    setTimeout(() => burst.remove(), 500);
    for (let i = 0; i < 3; i++) {
      const bit = document.createElement('div');
      bit.className = 'fx-burst';
      bit.style.fontSize = '18px';
      bit.textContent = TYPE_FX[type] || '✨';
      bit.style.left = `${to.x + (i - 1) * 26}px`;
      bit.style.top = `${to.y + (i % 2 ? -20 : 16)}px`;
      els.fxLayer.appendChild(bit);
      setTimeout(() => bit.remove(), 450);
    }
    if (effective > 1) {
      els.arena.classList.remove('rumble');
      void els.arena.offsetWidth;
      els.arena.classList.add('rumble');
    }
    const dmgEl = document.createElement('div');
    dmgEl.className = `dmg-float${effective > 1 ? ' super' : ''}`;
    dmgEl.textContent = `-${dmg}`;
    dmgEl.style.left = `${to.x}px`;
    dmgEl.style.top = `${to.y - 30}px`;
    els.fxLayer.appendChild(dmgEl);
    setTimeout(() => dmgEl.remove(), 900);
    done();
  }, impactAt);
}

function effectiveNote(effective) {
  if (effective > 1) return ` ${t('pokedc.super', 'Hiệu quả cực mạnh!')}`;
  if (effective < 1) return ` ${t('pokedc.weak', 'Không hiệu quả lắm...')}`;
  return '';
}

/** Hoạt cảnh tiến hóa: chớp sáng, sprite thu nhỏ → phóng to thành dạng mới. */
function playEvolveAnim(oldId, newId, done) {
  els.evolveFlash.classList.remove('hidden');
  els.playerSprite.classList.add('evolving');
  sfx.levelWin();
  setTimeout(() => { els.playerSprite.src = spritePath(newId); }, 500);
  setTimeout(() => {
    els.evolveFlash.classList.add('hidden');
    els.playerSprite.classList.remove('evolving');
    done();
  }, 1250);
  const line = t('pokedc.evolve', '{a} tiến hóa thành {b}!')
    .replace('{a}', POKEMON[oldId].name).replace('{b}', POKEMON[newId].name);
  els.battleLog.textContent = line;
  speak(line);
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
    mode: 'pokedaichien',
    result: c.won ? 'win' : 'quit',
    score: (c.won ? c.opponents.length : c.roundIndex) * 20,
    level: c.level + 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
  els.cheerSprite.classList.remove('hidden');
  els.cheerSprite.src = spritePath(c.playerId);
  if (c.won) {
    sfx.levelWin();
    confetti();
    els.cheerEmoji.textContent = '🏆';
    els.cheerText.textContent = t('pokedc.win', 'Đại thắng! Bé đã hạ cả trùm cuối!');
    els.btnCheerGo.textContent = t('pokedc.next', 'ĐẤU TIẾP MÀN MỚI ▶');
    els.btnCheerGo.onclick = () => { sfx.select(); state.level++; startCampaign(c.playerId); };
    speak(t('pokedc.win', 'Đại thắng! Bé đã hạ cả trùm cuối!'));
  } else {
    sfx.gameOver();
    els.cheerEmoji.textContent = '😵';
    els.cheerText.textContent = t('pokedc.lose', 'Thua rồi, chọn lại Pokémon và thử lần nữa nhé!');
    els.btnCheerGo.textContent = t('ran.retry', 'CHƠI LẠI ▶');
    els.btnCheerGo.onclick = () => { sfx.select(); state.level = 0; showHome(); };
    speak(t('pokedc.lose', 'Thua rồi, thử lại nhé!'));
  }
  els.cheer.classList.remove('hidden');
}

function nextRound() {
  const c = state.campaign;
  const oldId = c.playerId;
  const advanced = advanceCampaign(c, Math.random);
  state.busy = false;
  if (!advanced) { endCampaign(); return; }
  const showBattle = () => {
    els.playerSprite.classList.remove('faint');
    els.enemySprite.classList.remove('faint');
    els.battleLog.textContent = t('pokedc.nextfoe', 'Thắng rồi! Đối thủ tiếp theo xuất hiện!');
    renderBattle();
    if (advanced.battle.isBoss) {
      flashBossBanner();
      speak(t('pokedc.boss', 'Trùm xuất hiện!'));
    }
  };
  if (advanced.evolvedTo) playEvolveAnim(oldId, advanced.evolvedTo, showBattle);
  else { sfx.levelWin(); showBattle(); }
}

function onMove(idx) {
  const c = state.campaign;
  if (state.busy || c.battle.over) return;
  state.busy = true;
  renderBattle(); // khóa nút ngay khi vào lượt
  const result = useMove(c.battle, idx, Math.random);
  if (!result) { state.busy = false; renderBattle(); return; }

  const [playerTurn, enemyTurn] = result.log;
  const atkName = POKEMON[c.battle.player.id].name;
  const atkType = POKEMON[c.battle.player.id].type;

  const finishTurn = () => {
    if (c.battle.over) {
      setTimeout(nextRound, 900);
    } else {
      // QUAN TRỌNG: render lại sau khi mở khóa — không thì nút bị disabled mãi
      state.busy = false;
      renderBattle();
    }
  };

  // Lượt của bé: lao tới + chiêu bay + nổ + số sát thương
  els.battleLog.textContent = `${atkName} dùng ${playerTurn.move}!`;
  speak(playerTurn.move);
  playAttackFx(els.playerSprite, els.enemySprite, atkType, playerTurn.dmg, playerTurn.effective, playerTurn.power, () => {
    sfx.match(playerTurn.effective > 1 ? 3 : 2);
    els.battleLog.textContent =
      `${atkName} dùng ${playerTurn.move}! -${playerTurn.dmg} máu.${effectiveNote(playerTurn.effective)}`;
    hitAnim(els.enemySprite);
    renderBattle();
    if (!enemyTurn && c.battle.won) els.enemySprite.classList.add('faint');

    setTimeout(() => {
      if (!enemyTurn) { finishTurn(); return; }
      // Lượt phản đòn của đối thủ
      const defName = POKEMON[c.battle.enemy.id].name;
      const defType = POKEMON[c.battle.enemy.id].type;
      els.battleLog.textContent = `${defName} dùng ${enemyTurn.move}!`;
      playAttackFx(els.enemySprite, els.playerSprite, defType, enemyTurn.dmg, enemyTurn.effective, enemyTurn.power, () => {
        sfx.match(2);
        els.battleLog.textContent =
          `${defName} dùng ${enemyTurn.move}! -${enemyTurn.dmg} máu.${effectiveNote(enemyTurn.effective)}`;
        hitAnim(els.playerSprite);
        if (c.battle.player.hp <= 0) { sfx.fail(); els.playerSprite.classList.add('faint'); }
        renderBattle();
        setTimeout(finishTurn, 350);
      });
    }, 550);
  });
}

function startCampaign(starterId) {
  els.cheer.classList.add('hidden');
  els.cheerSprite.classList.add('hidden');
  els.home.classList.add('hidden');
  els.battle.classList.remove('hidden');
  els.btnBack.hidden = false;
  els.playerSprite.classList.remove('faint');
  els.enemySprite.classList.remove('faint');
  state.busy = false;
  state.startedAt = Date.now();
  state.campaign = makeCampaign(starterId, state.level, Math.random);
  els.battleLog.textContent = '';
  renderBattle();
  sayInstruction(t('pokedc.help.battle', 'Bấm vào 1 chiêu để tấn công — nhớ hệ khắc chế: Lửa khắc Cỏ, Cỏ khắc Nước, Nước khắc Lửa, Điện khắc Nước. Thắng trận để Pokémon tiến hóa nhé!'));
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
buildFilterRow();
buildPickScreen();
showHome();
sayInstruction(t('pokedc.help.home', 'Chọn 1 Pokémon khởi đầu để bắt đầu đại chiến!'));

// Hook cho e2e test
window.__pokedc = { state, startCampaign, onMove };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày (áp dụng cho mọi game, kể cả game giải trí thuần)
