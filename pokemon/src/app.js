// Điều phối game: menu → 4 chế độ (Cổ điển / Zen / Daily / 2 Người),
// chọn ô, combo, bế tắc, pause, thành tích.

import { generateBoard, removePair, remainingCount, shuffleRemaining, ensurePlayable, ICON_SETS } from './board.js';
import { findPath, findAnyMove } from './pathfinder.js';
import { Renderer } from './renderer.js';
import { LEVELS, applyGravity } from './levels.js';
import { Timer } from './timer.js';
import { Score, getTop, saveTop } from './score.js';
import { sfx } from './sfx.js';
import { dailyRng, dailyGravity, getDailyBest, saveDailyBest } from './daily.js';
import { ACHIEVEMENTS, getUnlocked, unlock } from './achievements.js';
import {
  getProfiles, addProfile, setCurrentProfile, currentProfile,
  recordSession, getSessions, summarize, last7Days, dateKey,
} from './stats.js';

const HINTS_PER_GAME = 10;
const SHUFFLES_PER_GAME = 5;
const TIME_PER_PAIR = 2;       // giây cộng thêm mỗi lần ăn cặp
const BONUS_PER_SECOND = 2;    // điểm thưởng mỗi giây còn lại khi qua level
const DAILY_TIME = 240;
const DAILY_TYPES = 30;
const DUEL_TURN_TIME = 20;     // giây mỗi lượt ở chế độ 2 người
const PAIR_SCORE_DUEL = 10;

const PREFS_KEY = 'pika.prefs';
const SIZES = {
  '10x6': { rows: 6, cols: 10 },
  '14x8': { rows: 8, cols: 14 },
  '16x9': { rows: 9, cols: 16 },
};

// i18n helper — dùng bản dịch chung nếu có, không thì fallback tiếng Việt
const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  board: $('board'), canvas: $('pathCanvas'), wrap: $('boardWrap'),
  score: $('score'), hintNum: $('hintNum'), shuffleNum: $('shuffleNum'),
  levelLabel: $('levelLabel'), timeFill: $('timeFill'), comboPop: $('comboPop'),
  duelHud: $('duelHud'), duelP1: $('duelP1'), duelP2: $('duelP2'),
  duelS1: $('duelS1'), duelS2: $('duelS2'),
  toast: $('toast'),
  menuOverlay: $('menuOverlay'), pauseOverlay: $('pauseOverlay'),
  levelOverlay: $('levelOverlay'), levelBonus: $('levelBonus'),
  endOverlay: $('endOverlay'), endEmoji: $('endEmoji'), endTitle: $('endTitle'),
  endScore: $('endScore'), endTopList: $('endTopList'),
  topOverlay: $('topOverlay'), topList: $('topList'),
  achOverlay: $('achOverlay'), achList: $('achList'),
  dailyBest: $('dailyBest'), selIcons: $('selIcons'), selSize: $('selSize'),
  selTheme: $('selTheme'),
  btnNew: $('btnNew'), btnHint: $('btnHint'), btnShuffle: $('btnShuffle'),
  btnTop: $('btnTop'), btnPause: $('btnPause'), btnSound: $('btnSound'),
  btnIcons: $('btnIcons'), btnMenu: $('btnMenu'),
  btnPlay: $('btnPlay'), btnZen: $('btnZen'), btnDaily: $('btnDaily'), btnDuel: $('btnDuel'),
  btnMenuTop: $('btnMenuTop'), btnAch: $('btnAch'), btnAchClose: $('btnAchClose'),
  btnResume: $('btnResume'), btnNextLevel: $('btnNextLevel'),
  btnEndNew: $('btnEndNew'), btnTopClose: $('btnTopClose'),
  btnPauseMenu: $('btnPauseMenu'), btnEndMenu: $('btnEndMenu'),
  btnUser: $('btnUser'), userName: $('userName'), userOverlay: $('userOverlay'),
  userList: $('userList'), userInput: $('userInput'),
  btnUserAdd: $('btnUserAdd'), btnUserClose: $('btnUserClose'),
  btnStats: $('btnStats'), statsOverlay: $('statsOverlay'), statsName: $('statsName'),
  kpiGames: $('kpiGames'), kpiWinRate: $('kpiWinRate'), kpiHours: $('kpiHours'),
  wlMeter: $('wlMeter'), wlWins: $('wlWins'), wlLosses: $('wlLosses'),
  dayChart: $('dayChart'), statsEmpty: $('statsEmpty'), btnStatsClose: $('btnStatsClose'),
};

const state = {
  phase: 'menu',   // menu | playing | paused | levelClear | over
  mode: 'classic', // classic | zen | daily | duel
  board: null,
  rows: 9,
  cols: 16,
  level: 1,        // 1..7 (classic/zen)
  selected: null,
  busy: false,
  score: new Score(),
  hints: HINTS_PER_GAME,
  shuffles: SHUFFLES_PER_GAME,
  hintUsedThisLevel: false,
  timer: null,
  duel: null,      // { turn: 0|1, scores: [n, n] }
  playSeconds: 0,  // giây chơi thực (không tính pause/overlay) của ván hiện tại
  statDone: false, // ván này đã ghi vào thống kê chưa
};

const renderer = new Renderer(els.board, els.canvas, els.wrap);

/* ===== Cài đặt (bộ icon, cỡ bàn) ===== */

function loadPrefs() {
  try {
    const p = JSON.parse(localStorage.getItem(PREFS_KEY));
    return { icons: 'pokemon', size: '16x9', ...(p || {}) };
  } catch {
    return { icons: 'pokemon', size: '16x9' };
  }
}

function savePrefs() {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify({
      icons: els.selIcons.value,
      size: els.selSize.value,
    }));
  } catch { /* private mode */ }
}

function applyPrefs() {
  const prefs = loadPrefs();
  els.selIcons.value = prefs.icons;
  els.selSize.value = prefs.size;
  // ?icons=... để test nhanh từng bộ hình
  const urlIcons = new URLSearchParams(location.search).get('icons');
  if (ICON_SETS[urlIcons]) els.selIcons.value = urlIcons;
  // Theme lưu key riêng (script inline ở <head> đọc trước khi vẽ)
  els.selTheme.value = document.documentElement.dataset.theme || 'dark';
}

const THEME_BG = { dark: '#0a0a0f', light: '#f3ecdb', forest: '#0b3d2e', ocean: '#0a1a2f' };

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', THEME_BG[theme] || THEME_BG.dark);
  try { localStorage.setItem('pika.theme', theme); } catch { /* private mode */ }
}

function currentIcons() {
  return ICON_SETS[els.selIcons.value] || ICON_SETS.animals;
}

// Mặt nút đổi bộ hình trên side-bar — theo bộ đang chọn
const ICON_BTN_FACE = { animals: '🐰', fruits: '🍎', faces: '😀', pokemon: '⚡', mix: '🐰⚡' };

function refreshIconsBtn() {
  els.btnIcons.textContent = ICON_BTN_FACE[els.selIcons.value] || '🐰';
}

/** Đổi sang bộ hình kế tiếp — áp dụng ngay lên bàn đang chơi (chỉ đổi vỏ, giữ nguyên thế bàn). */
function cycleIcons() {
  const keys = Object.keys(ICON_SETS);
  const next = keys[(keys.indexOf(els.selIcons.value) + 1) % keys.length];
  els.selIcons.value = next;
  savePrefs();
  refreshIconsBtn();
  renderer.setIcons(currentIcons());
  if (state.board) {
    renderer.refresh(state.board);
    if (state.selected) renderer.setSelected(state.selected, true);
  }
  sfx.select();
  const label = els.selIcons.selectedOptions[0]?.textContent || next;
  showToast(`${t('pika.toast.icons', 'Bộ hình')}: ${label}`, 1400);
}

function currentSize() {
  return SIZES[els.selSize.value] || SIZES['16x9'];
}

/* ===== HUD & tiện ích ===== */

let toastTimer = null;
function showToast(msg, ms = 1800) {
  els.toast.textContent = msg;
  els.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove('show'), ms);
}

function updateHud() {
  els.hintNum.textContent = state.hints;
  els.shuffleNum.textContent = state.shuffles;
  const isDuel = state.mode === 'duel';
  els.duelHud.classList.toggle('hidden', !isDuel);
  els.score.style.display = isDuel ? 'none' : '';
  if (isDuel && state.duel) {
    els.duelS1.textContent = state.duel.scores[0];
    els.duelS2.textContent = state.duel.scores[1];
    els.duelP1.classList.toggle('active', state.duel.turn === 0);
    els.duelP2.classList.toggle('active', state.duel.turn === 1);
    els.levelLabel.textContent = t('pika.menu.duel', '2 Người');
  } else {
    els.score.textContent = state.score.value;
    els.levelLabel.textContent = state.mode === 'daily'
      ? 'Daily'
      : `${state.mode === 'zen' ? 'Zen ' : ''}Level ${state.level}/${LEVELS.length}`;
  }
}

function showOverlay(el) {
  for (const o of [els.menuOverlay, els.pauseOverlay, els.levelOverlay,
    els.endOverlay, els.topOverlay, els.achOverlay, els.userOverlay, els.statsOverlay]) {
    o.classList.toggle('hidden', o !== el);
  }
}

function hideOverlays() { showOverlay(null); }

let comboTimer = null;
function popCombo(combo, gained) {
  if (combo < 2) return;
  els.comboPop.textContent = `COMBO x${combo} +${gained}`;
  els.comboPop.classList.add('show');
  clearTimeout(comboTimer);
  comboTimer = setTimeout(() => els.comboPop.classList.remove('show'), 900);
}

function renderTopList(ol) {
  const top = getTop();
  ol.innerHTML = '';
  if (!top.length) {
    const li = document.createElement('li');
    li.className = 'top-empty';
    li.textContent = t('pika.top.empty', 'Chưa có điểm nào — hãy chơi ván đầu tiên!');
    ol.appendChild(li);
    return;
  }
  for (const e of top) {
    const li = document.createElement('li');
    li.textContent = `${e.score} — Level ${e.level} — ${e.date}`;
    ol.appendChild(li);
  }
}

function renderAchList() {
  const unlocked = new Set(getUnlocked());
  els.achList.innerHTML = '';
  for (const a of ACHIEVEMENTS) {
    const li = document.createElement('li');
    li.className = unlocked.has(a.id) ? 'unlocked' : 'locked';
    li.textContent = `${a.icon} ${t(a.key, a.vi)}`;
    els.achList.appendChild(li);
  }
}

function award(id) {
  const def = unlock(id);
  if (def) {
    sfx.levelWin();
    showToast(`🏅 ${t('pika.ach.unlocked', 'Thành tích')}: ${def.icon} ${t(def.key, def.vi)}`, 2600);
  }
}

function refreshDailyBest() {
  const best = getDailyBest();
  els.dailyBest.textContent = best == null ? '' : `★${best}`;
}

function confetti() {
  const n = 40;
  const colors = ['#ff5aa8', '#f5c542', '#35d435', '#42c5f5', '#b06af5'];
  for (let i = 0; i < n; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.setProperty('--x', `${Math.random() * 100}vw`);
    p.style.setProperty('--delay', `${Math.random() * 0.6}s`);
    p.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`);
    p.style.background = colors[i % colors.length];
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 2600);
  }
}

/* ===== Thống kê: đồng hồ giờ chơi + ghi kết quả ván ===== */

let playStartedAt = null;

/** Bật/tắt đồng hồ đếm giờ chơi thực (tắt khi pause, overlay, kết thúc). */
function playClock(on) {
  if (on) {
    if (playStartedAt == null) playStartedAt = Date.now();
    return;
  }
  if (playStartedAt != null) {
    state.playSeconds += (Date.now() - playStartedAt) / 1000;
    playStartedAt = null;
  }
}

/**
 * Ghi ván hiện tại vào thống kê của người chơi — mỗi ván chỉ ghi 1 lần.
 * @param {'win'|'loss'|'quit'|'duel'} result — quit/duel không tính vào tỷ lệ thắng
 */
function recordResult(result) {
  if (state.statDone || !state.board) return;
  state.statDone = true;
  playClock(false);
  recordSession({
    mode: state.mode,
    result,
    score: state.score.value,
    level: state.level,
    seconds: state.playSeconds,
  });
}

/* ===== Luồng game ===== */

function startGame(mode) {
  recordResult('quit'); // ván dở dang (bấm MỚI giữa chừng) vẫn tính giờ chơi
  state.mode = mode;
  state.level = 1;
  state.score = new Score();
  state.hints = HINTS_PER_GAME;
  state.shuffles = SHUFFLES_PER_GAME;
  state.duel = mode === 'duel' ? { turn: 0, scores: [0, 0] } : null;
  state.playSeconds = 0;
  state.statDone = false;
  savePrefs();
  const { rows, cols } = currentSize();
  state.rows = rows;
  state.cols = cols;
  renderer.setIcons(currentIcons());
  startLevel();
}

/** Cấu hình bàn + thời gian theo chế độ hiện tại. */
function levelSetup() {
  switch (state.mode) {
    case 'daily':
      return {
        gravity: dailyGravity(),
        time: DAILY_TIME,
        types: DAILY_TYPES,
        rng: dailyRng(),
      };
    case 'duel':
      return { gravity: 'none', time: DUEL_TURN_TIME, types: 30, rng: Math.random };
    default: { // classic | zen
      const cfg = LEVELS[state.level - 1];
      return { ...cfg, rng: Math.random };
    }
  }
}

function startLevel() {
  const cfg = levelSetup();
  state.gravity = cfg.gravity;
  state.board = generateBoard(state.rows, state.cols, cfg.types, cfg.rng);
  state.selected = null;
  state.busy = false;
  state.hintUsedThisLevel = false;
  state.phase = 'playing';

  state.timer?.pause();
  if (state.mode === 'zen') {
    state.timer = null;
    els.timeFill.style.width = '100%';
  } else {
    state.timer = new Timer(cfg.time, {
      onTick: (tm) => { els.timeFill.style.width = `${tm.ratio * 100}%`; },
      onTimeout: state.mode === 'duel' ? duelTurnTimeout : gameOver,
    });
  }

  hideOverlays();
  renderer.build(state.board, onCellClick);
  renderer.clearPath();
  updateHud();
  state.timer?.start();
  playClock(true);
}

function gameOver() {
  state.phase = 'over';
  state.timer?.pause();
  recordResult('loss');
  sfx.gameOver();
  els.endEmoji.textContent = '⏰';
  els.endTitle.textContent = t('pika.end.timeout', 'Hết giờ!');
  if (state.mode === 'daily') {
    const best = saveDailyBest(state.score.value);
    refreshDailyBest();
    els.endScore.textContent =
      `${t('pika.end.score', 'Điểm của bạn')}: ${state.score.value} · ${t('pika.daily.best', 'Kỷ lục hôm nay')}: ${best}`;
    els.endTopList.innerHTML = '';
  } else {
    saveTop(state.score.value, state.level);
    els.endScore.textContent = `${t('pika.end.score', 'Điểm của bạn')}: ${state.score.value}`;
    renderTopList(els.endTopList);
  }
  showOverlay(els.endOverlay);
}

/** Bàn sạch — xử lý theo chế độ. */
function boardCleared() {
  state.timer?.pause();
  playClock(false); // thời gian đứng ở overlay không tính giờ chơi
  sfx.levelWin();
  confetti();

  if (state.mode === 'duel') return duelEnd();

  // Thưởng thời gian còn lại (classic/daily; zen không có giờ)
  const bonus = state.timer ? Math.round(state.timer.remaining) * BONUS_PER_SECOND : 0;
  state.score.addBonus(bonus);
  updateHud();

  award('first_clear');
  if (!state.hintUsedThisLevel) award('no_hint_level');
  if (state.timer && state.timer.remaining > state.timer.total / 2) award('fast_clear');

  if (state.mode === 'daily') {
    award('daily_done');
    recordResult('win');
    const best = saveDailyBest(state.score.value);
    refreshDailyBest();
    state.phase = 'over';
    els.endEmoji.textContent = '📅';
    els.endTitle.textContent = t('pika.end.daily', 'Hoàn thành Daily!');
    els.endScore.textContent =
      `${t('pika.end.score', 'Điểm của bạn')}: ${state.score.value} · ${t('pika.daily.best', 'Kỷ lục hôm nay')}: ${best}`;
    els.endTopList.innerHTML = ''; // Daily có kỷ lục riêng, không dùng bảng TOP chung
    showOverlay(els.endOverlay);
    return;
  }

  if (state.level >= LEVELS.length) {
    // Thắng cả game (classic/zen)
    state.phase = 'over';
    recordResult('win');
    award(state.mode === 'zen' ? 'zen_master' : 'champion');
    saveTop(state.score.value, state.level);
    els.endEmoji.textContent = '🏆';
    els.endTitle.textContent = t('pika.end.victory', 'Hoàn thành cả 7 level!');
    els.endScore.textContent = `${t('pika.end.score', 'Điểm của bạn')}: ${state.score.value}`;
    renderTopList(els.endTopList);
    showOverlay(els.endOverlay);
    return;
  }

  state.phase = 'levelClear';
  els.levelBonus.textContent = bonus > 0 ? `${t('pika.level.bonus', 'Thưởng thời gian')}: +${bonus}` : '';
  showOverlay(els.levelOverlay);
}

/* ===== Chế độ 2 người ===== */

function duelSwitchTurn() {
  state.duel.turn = 1 - state.duel.turn;
  updateHud();
  duelRestartTurnTimer();
}

function duelRestartTurnTimer() {
  state.timer?.pause();
  state.timer = new Timer(DUEL_TURN_TIME, {
    onTick: (tm) => { els.timeFill.style.width = `${tm.ratio * 100}%`; },
    onTimeout: duelTurnTimeout,
  });
  state.timer.start();
}

function duelTurnTimeout() {
  if (state.phase !== 'playing') return;
  sfx.fail();
  showToast(t('pika.duel.timeout', 'Hết lượt — đổi người! ⏱'));
  if (state.selected) {
    renderer.setSelected(state.selected, false);
    state.selected = null;
  }
  duelSwitchTurn();
}

function duelEnd() {
  state.phase = 'over';
  recordResult('duel'); // 2 người chung máy — tính giờ chơi, không tính tỷ lệ thắng
  const [s1, s2] = state.duel.scores;
  const draw = s1 === s2;
  if (!draw) award('duel_win');
  els.endEmoji.textContent = draw ? '🤝' : '⚔️';
  els.endTitle.textContent = draw
    ? t('pika.duel.draw', 'Hòa!')
    : `${s1 > s2 ? '🔵' : '🔴'} ${t('pika.duel.winner', 'thắng!')}`;
  els.endScore.textContent = `🔵 ${s1} — ${s2} 🔴`;
  els.endTopList.innerHTML = '';
  showOverlay(els.endOverlay);
}

/* ===== Pause ===== */

function togglePause() {
  if (state.phase === 'playing') {
    state.phase = 'paused';
    state.timer?.pause();
    playClock(false);
    showOverlay(els.pauseOverlay);
  } else if (state.phase === 'paused') {
    state.phase = 'playing';
    hideOverlays();
    state.timer?.resume();
    playClock(true);
  }
}

/* ===== Chơi: chọn ô, nối cặp ===== */

async function onCellClick(r, c) {
  if (state.phase !== 'playing' || state.busy || state.board[r][c] == null) return;
  const clicked = { r, c };

  if (!state.selected) {
    state.selected = clicked;
    renderer.setSelected(clicked, true);
    sfx.select();
    return;
  }

  if (state.selected.r === r && state.selected.c === c) {
    renderer.setSelected(clicked, false);
    state.selected = null;
    return;
  }

  const first = state.selected;
  const sameIcon = state.board[first.r][first.c] === state.board[r][c];
  const path = sameIcon ? findPath(state.board, first, clicked) : null;

  if (!path) {
    sfx.fail();
    renderer.shake(first, clicked);
    renderer.setSelected(first, false);
    state.selected = clicked;
    renderer.setSelected(clicked, true);
    if (state.mode === 'duel') {
      // Đoán sai là mất lượt
      renderer.setSelected(clicked, false);
      state.selected = null;
      duelSwitchTurn();
    }
    return;
  }

  // Nối thành công
  state.busy = true;
  state.selected = null;
  renderer.setSelected(clicked, true);
  renderer.drawPath(path);
  removePair(state.board, first, clicked);

  if (state.mode === 'duel') {
    state.duel.scores[state.duel.turn] += PAIR_SCORE_DUEL;
    sfx.match(1);
    duelRestartTurnTimer(); // ăn cặp: giữ lượt, reset đồng hồ lượt
  } else {
    const { gained, combo } = state.score.addPair();
    if (combo >= 5) award('combo5');
    state.timer?.add(TIME_PER_PAIR);
    sfx.match(combo);
    popCombo(combo, gained);
  }
  updateHud();

  await renderer.removePair(first, clicked);
  renderer.clearPath();

  // Luật dồn ô của chế độ/level hiện tại
  if (applyGravity(state.board, state.gravity)) {
    renderer.refresh(state.board);
  }

  state.busy = false;
  afterRemoval();
}

/** Sau mỗi lần xóa cặp (và đã dồn ô): kiểm tra thắng / bế tắc. */
function afterRemoval() {
  if (remainingCount(state.board) === 0) {
    boardCleared();
    return;
  }
  if (!findAnyMove(state.board)) {
    showToast(t('pika.toast.shuffled', 'Hết nước đi — xáo trộn lại! 🔀'));
    sfx.shuffle();
    shuffleRemaining(state.board);
    ensurePlayable(state.board);
    renderer.refresh(state.board);
  }
}

function useHint() {
  if (state.phase !== 'playing' || state.busy) return;
  if (state.hints <= 0) {
    showToast(t('pika.toast.nohint', 'Đã hết lượt gợi ý!'));
    return;
  }
  const move = findAnyMove(state.board);
  if (!move) return;
  state.hints--;
  state.hintUsedThisLevel = true;
  updateHud();
  sfx.select();
  renderer.hint(move.a, move.b);
}

function useShuffle() {
  if (state.phase !== 'playing' || state.busy) return;
  if (state.shuffles <= 0) {
    showToast(t('pika.toast.noshuffle', 'Đã hết lượt xáo trộn!'));
    return;
  }
  state.shuffles--;
  updateHud();
  sfx.shuffle();
  if (state.selected) {
    renderer.setSelected(state.selected, false);
    state.selected = null;
  }
  shuffleRemaining(state.board);
  ensurePlayable(state.board);
  renderer.refresh(state.board);
}

/* ===== Hồ sơ người chơi & Report ===== */

function refreshUserChip() {
  els.userName.textContent = currentProfile(t('pika.user.guest', 'Khách')).name;
}

function renderUserList() {
  const profiles = getProfiles();
  els.userList.innerHTML = '';
  for (const u of profiles.list) {
    const btn = document.createElement('button');
    const isCurrent = u.id === profiles.current;
    btn.className = `user-item${isCurrent ? ' current' : ''}`;
    btn.textContent = `${isCurrent ? '✓ ' : ''}👤 ${u.name}`;
    btn.addEventListener('click', () => {
      setCurrentProfile(u.id);
      refreshUserChip();
      renderUserList();
    });
    els.userList.appendChild(btn);
  }
}

function openUser() {
  els.userInput.value = '';
  renderUserList();
  showOverlay(els.userOverlay);
}

function addUser() {
  const profile = addProfile(els.userInput.value);
  if (!profile) return;
  els.userInput.value = '';
  refreshUserChip();
  renderUserList();
}

/** Định dạng thời lượng: <60 phút → "45p", còn lại "2g 15p". */
function fmtDuration(seconds) {
  const mins = Math.round(seconds / 60);
  const g = t('pika.stats.hourUnit', 'g');
  const p = t('pika.stats.minUnit', 'p');
  if (mins < 60) return `${mins}${p}`;
  return `${Math.floor(mins / 60)}${g} ${mins % 60}${p}`;
}

function renderStats() {
  const profile = currentProfile(t('pika.user.guest', 'Khách'));
  const sessions = getSessions(profile.id);
  const sum = summarize(sessions);

  els.statsName.textContent = profile.name;
  els.kpiGames.textContent = sum.games;
  els.kpiWinRate.textContent = sum.winRate == null ? '—' : `${Math.round(sum.winRate * 100)}%`;
  els.kpiHours.textContent = fmtDuration(sum.seconds);
  els.statsEmpty.classList.toggle('hidden', sum.games > 0);

  // Meter thắng/thua: 2 đoạn tỷ lệ theo số ván, khe 2px, nhãn số bên dưới
  els.wlWins.textContent = sum.wins;
  els.wlLosses.textContent = sum.losses;
  els.wlMeter.innerHTML = '';
  for (const [cls, n] of [['win', sum.wins], ['loss', sum.losses]]) {
    if (!n) continue;
    const seg = document.createElement('div');
    seg.className = cls;
    seg.style.flex = n;
    els.wlMeter.appendChild(seg);
  }

  // Cột phút chơi 7 ngày (cũ → mới), nhãn giá trị trên đầu mỗi cột
  const days = last7Days(sessions);
  const max = Math.max(...days.map((d) => d.seconds), 60); // sàn 1 phút để cột không kịch trần
  const lang = window.I18N?.getLang?.() || 'vi';
  const today = dateKey();
  els.dayChart.innerHTML = '';
  for (const d of days) {
    const col = document.createElement('div');
    col.className = 'day-col';
    const mins = Math.round(d.seconds / 60);
    col.title = `${d.date} — ${d.games} ${t('pika.stats.gamesUnit', 'ván')}, ${mins}${t('pika.stats.minUnit', 'p')}`;

    const val = document.createElement('span');
    val.className = 'val';
    val.textContent = mins;

    const bar = document.createElement('div');
    bar.className = `bar${d.seconds === 0 ? ' zero' : ''}`;
    bar.style.height = `${Math.max(2, Math.round((d.seconds / max) * 88))}px`;

    const lbl = document.createElement('span');
    lbl.className = `lbl${d.date === today ? ' today' : ''}`;
    lbl.textContent = new Date(`${d.date}T12:00:00`).toLocaleDateString(lang, { weekday: 'short' });

    col.append(val, bar, lbl);
    els.dayChart.appendChild(col);
  }
}

/* ===== Bàn phím: mũi tên di chuyển, Esc tạm dừng ===== */

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    togglePause();
    return;
  }
  const dirs = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
  if (!dirs[e.key] || state.phase !== 'playing') return;
  const focused = document.activeElement;
  if (!focused?.classList?.contains('cell')) return;
  e.preventDefault();
  const [dr, dc] = dirs[e.key];
  let r = Number(focused.dataset.r) + dr;
  let c = Number(focused.dataset.c) + dc;
  // Tìm ô còn icon gần nhất theo hướng bấm
  while (r >= 0 && r < state.rows && c >= 0 && c < state.cols) {
    if (state.board[r][c] != null) {
      renderer.cellEl(r, c).focus();
      return;
    }
    r += dr;
    c += dc;
  }
});

/* ===== Gắn nút ===== */

function refreshSoundIcon() {
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
}

function goToMenu() {
  recordResult('quit'); // bỏ ván giữa chừng — vẫn tính giờ chơi
  state.phase = 'menu';
  state.timer?.pause();
  refreshDailyBest();
  showOverlay(els.menuOverlay);
}

els.btnPlay.addEventListener('click', () => startGame('classic'));
els.btnPauseMenu.addEventListener('click', goToMenu);
els.btnEndMenu.addEventListener('click', goToMenu);
els.btnZen.addEventListener('click', () => startGame('zen'));
els.btnDaily.addEventListener('click', () => startGame('daily'));
els.btnDuel.addEventListener('click', () => startGame('duel'));
els.btnNew.addEventListener('click', () => startGame(state.mode));
els.btnEndNew.addEventListener('click', () => startGame(state.mode));
els.btnNextLevel.addEventListener('click', () => { state.level++; startLevel(); });
els.btnResume.addEventListener('click', togglePause);
els.btnPause.addEventListener('click', togglePause);
els.btnHint.addEventListener('click', useHint);
els.btnShuffle.addEventListener('click', useShuffle);
els.btnSound.addEventListener('click', () => { sfx.toggleMute(); refreshSoundIcon(); });
els.btnIcons.addEventListener('click', cycleIcons);
els.btnMenu.addEventListener('click', goToMenu);
// Mở TOP: tự tạm dừng nếu đang chơi; đóng thì quay về đúng màn hình trước đó
let topReturn = null;
function openTop() {
  if (state.phase === 'playing') togglePause();
  topReturn = [els.menuOverlay, els.pauseOverlay, els.endOverlay, els.levelOverlay]
    .find((o) => !o.classList.contains('hidden')) || null;
  renderTopList(els.topList);
  showOverlay(els.topOverlay);
}
els.btnTop.addEventListener('click', openTop);
els.btnMenuTop.addEventListener('click', openTop);
els.btnAch.addEventListener('click', () => { renderAchList(); showOverlay(els.achOverlay); });
els.btnAchClose.addEventListener('click', () => showOverlay(els.menuOverlay));
els.btnUser.addEventListener('click', openUser);
els.btnUserAdd.addEventListener('click', addUser);
els.userInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addUser(); });
els.btnUserClose.addEventListener('click', () => showOverlay(els.menuOverlay));
els.btnStats.addEventListener('click', () => { renderStats(); showOverlay(els.statsOverlay); });
els.btnStatsClose.addEventListener('click', () => showOverlay(els.menuOverlay));
els.btnTopClose.addEventListener('click', () => showOverlay(topReturn));
els.selIcons.addEventListener('change', () => { savePrefs(); refreshIconsBtn(); });
els.selSize.addEventListener('change', savePrefs);
els.selTheme.addEventListener('change', () => applyTheme(els.selTheme.value));

// Tab ẩn đi thì tự tạm dừng cho công bằng thời gian
document.addEventListener('visibilitychange', () => {
  if (document.hidden && state.phase === 'playing') togglePause();
});

applyPrefs();
applyTheme(els.selTheme.value);
refreshSoundIcon();
refreshIconsBtn();
refreshUserChip();
refreshDailyBest();
updateHud();
showOverlay(els.menuOverlay);

// Hook cho e2e test
window.__pika = { state, startGame };
