// Điều phối Phòng Xinh Của Bé: kéo-thả nội thất trong phòng DOM, chạm món đồ đọc to tên
// tiếng Anh, đổi màu tường/sàn, lưu phòng vào localStorage. Không chấm điểm — chỉ ghi
// thời gian chơi (nhóm "chơi để chơi", cùng engine tinh thần với Bé Làm Stylist).

import {
  ROOM_W, ROOM_H, WALL_H, FURNITURE, WALL_COLORS, FLOOR_COLORS, ROOM_STYLES,
  furnitureById, makeRoom, addItem, moveItem, flipItem, removeItem,
  setWall, setFloor, drawOrder, serializeRoom, deserializeRoom, randomRoom, applyRoomStyle,
} from './phongxinh.js';
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
  room: $('room'), roomWall: $('roomWall'), roomFloor: $('roomFloor'),
  selTools: $('selTools'), btnFlip: $('btnFlip'), btnRemove: $('btnRemove'),
  palette: $('palette'), styleRow: $('styleRow'), wallRow: $('wallRow'), floorRow: $('floorRow'),
  sayBubble: $('sayBubble'),
  btnRandom: $('btnRandom'), btnSave: $('btnSave'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
};

const GALLERY_KEY = 'phongxinh.gallery';
// 3 phòng riêng — mỗi phòng 1 khóa lưu; phòng 1 kế thừa khóa cũ 'phongxinh.room'
const roomKey = (slot) => (slot === 1 ? 'phongxinh.room' : `phongxinh.room${slot}`);

const state = {
  slot: 1,
  room: deserializeRoom(localStorage.getItem(roomKey(1)) || ''),
  selected: null, // uid đang chọn
  startedAt: Date.now(),
  instruction: '',
};
bindMute(() => sfx.muted);

/** Đọc hướng dẫn + lưu lại để bấm ❓ nghe lại được. */
function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/** Đọc to từ tiếng Anh bằng GIỌNG TIẾNG ANH thật + hiện bong bóng lời thoại. */
function announce(phrase) {
  els.sayBubble.textContent = `🗣️ ${phrase.en}`;
  els.sayBubble.classList.remove('pop');
  void els.sayBubble.offsetWidth;
  els.sayBubble.classList.add('pop');
  speak(phrase.en, { lang: 'en-US', rate: 0.68 });
}

function persist() {
  localStorage.setItem(roomKey(state.slot), serializeRoom(state.room));
}

/* ===== 3 phòng riêng — chuyển tab là đổi phòng, phòng nào lưu phòng nấy ===== */
for (const tab of document.querySelectorAll('.room-tab')) {
  tab.addEventListener('click', () => {
    const slot = Number(tab.dataset.room);
    if (slot === state.slot) return;
    sfx.select();
    state.slot = slot;
    state.room = deserializeRoom(localStorage.getItem(roomKey(slot)) || '');
    state.selected = null;
    for (const t2 of document.querySelectorAll('.room-tab')) {
      t2.classList.toggle('active', Number(t2.dataset.room) === slot);
    }
    render();
    buildStyles();
    buildSwatches();
    speak(`${t('phongxinh.room', 'Phòng số')} ${slot}!`);
  });
}

/* ===== Vẽ phòng ===== */

function pctX(x) { return `${(x / ROOM_W) * 100}%`; }
function pctY(y) { return `${(y / ROOM_H) * 100}%`; }

function renderColors() {
  const wall = WALL_COLORS.find((w) => w.id === state.room.wall);
  const floor = FLOOR_COLORS.find((f) => f.id === state.room.floor);
  els.roomWall.style.background =
    `linear-gradient(180deg, ${wall.hex}, ${wall.hex} 82%, rgba(0,0,0,0.08))`;
  els.roomFloor.style.background = floor.hex;
}

function renderItems() {
  // xóa item cũ (giữ 2 lớp tường/sàn)
  for (const el of [...els.room.querySelectorAll('.item')]) el.remove();
  const ordered = drawOrder(state.room);
  ordered.forEach((item, idx) => {
    const def = furnitureById(item.id);
    const el = document.createElement('div');
    el.className = `item${item.flip ? ' flip' : ''}${state.selected === item.uid ? ' selected' : ''}`;
    el.style.left = pctX(item.x);
    el.style.top = pctY(item.y);
    el.style.width = pctX(def.size);
    el.style.height = `${(def.size / ROOM_H) * 100}%`;
    el.style.zIndex = 5 + idx;
    el.dataset.uid = item.uid;
    el.innerHTML = `<img src="images/${item.id}.svg" alt="${def.vi}" draggable="false">`;
    bindItemDrag(el, item.uid);
    els.room.appendChild(el);
  });
  els.selTools.classList.toggle('hidden', state.selected === null);
}

function render() {
  renderColors();
  renderItems();
}

/* ===== Kéo-thả + chọn ===== */

// LƯU Ý HIỆU NĂNG (07/2026): bản trước gọi getBoundingClientRect() (ép trình
// duyệt reflow đồng bộ) + ghi style.left/top (%, ép layout lại) trên MỖI SỰ
// KIỆN pointermove thô — đây là nguyên nhân chính gây "lag" khi kéo đồ mà bạn
// báo. Sửa bằng 3 việc: (1) đo khung phòng đúng 1 LẦN lúc bắt đầu kéo thay vì
// đo lại mỗi lần di chuyển, (2) gom các lần di chuyển thô lại, chỉ áp dụng 1
// lần/khung hình qua requestAnimationFrame, (3) trong lúc kéo chỉ dịch chuyển
// bằng CSS transform (chỉ tốn compositor, không ép layout) — left/top % thật
// chỉ tính lại DUY NHẤT lúc thả tay, qua render().
function bindItemDrag(el, uid) {
  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    el.setPointerCapture(e.pointerId);
    const rect = els.room.getBoundingClientRect();
    const scaleX = rect.width / ROOM_W;
    const scaleY = rect.height / ROOM_H;
    const toRoom = (ev) => ({
      x: (ev.clientX - rect.left) / scaleX,
      y: (ev.clientY - rect.top) / scaleY,
    });
    const start = toRoom(e);
    let dragged = false;
    let pending = null;
    let rafId = null;

    const applyPending = () => {
      rafId = null;
      if (!pending) return;
      const p = pending;
      pending = null;
      moveItem(state.room, uid, p.x, p.y);
      const item = state.room.items.find((it) => it.uid === uid);
      const dx = (item.x - start.x) * scaleX;
      const dy = (item.y - start.y) * scaleY;
      el.style.transform = `translate(-50%, -50%) translate(${dx}px, ${dy}px)`;
    };

    const onMove = (e2) => {
      const p = toRoom(e2);
      if (!dragged && Math.hypot(p.x - start.x, p.y - start.y) < 6) return;
      dragged = true;
      pending = p;
      if (rafId === null) rafId = requestAnimationFrame(applyPending);
    };
    const onUp = () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      if (rafId !== null) cancelAnimationFrame(rafId);
      el.style.transform = ''; // trả lại transform căn giữa mặc định của .room .item
      state.selected = uid;
      if (dragged) {
        sfx.select();
        persist();
        render(); // sắp lại thứ tự che khuất theo y mới + gán đúng left/top %
      } else {
        // chạm nhẹ (không kéo): chọn + đọc to tên tiếng Anh
        const def = furnitureById(state.room.items.find((it) => it.uid === uid).id);
        sfx.match(1);
        announce(def);
        render();
      }
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
  });
}

// chạm nền phòng (không trúng món nào) → bỏ chọn
els.room.addEventListener('pointerdown', () => {
  if (state.selected !== null) {
    state.selected = null;
    render();
  }
});

els.btnFlip.addEventListener('click', () => {
  if (state.selected === null) return;
  flipItem(state.room, state.selected);
  sfx.select();
  persist();
  render();
});
els.btnRemove.addEventListener('click', () => {
  if (state.selected === null) return;
  removeItem(state.room, state.selected);
  state.selected = null;
  sfx.shuffle();
  persist();
  render();
});

/* ===== Kệ đồ + bảng màu ===== */

function buildPalette() {
  els.palette.innerHTML = '';
  for (const def of FURNITURE) {
    const btn = document.createElement('button');
    btn.className = 'pal-btn';
    btn.innerHTML = `<img src="images/${def.id}.svg" alt=""><span>${def.vi}</span><span class="en">${def.en}</span>`;
    btn.addEventListener('click', () => {
      const y = def.zone === 'wall' ? WALL_H / 2 : WALL_H + (ROOM_H - WALL_H) / 2;
      const item = addItem(state.room, def.id, ROOM_W / 2, y);
      if (!item) {
        speak(t('phongxinh.full', 'Phòng chật quá rồi, cất bớt đồ nhé!'));
        return;
      }
      state.selected = item.uid;
      sfx.match(1);
      announce(def);
      persist();
      render();
    });
    els.palette.appendChild(btn);
  }
}

/** "Kiểu phòng" dựng sẵn — đổi CẢ tường lẫn sàn cùng lúc theo 1 preset gợi ý,
 * vẫn tự chỉnh lại từng màu riêng ở 2 hàng bên dưới như bình thường sau đó. */
function buildStyles() {
  els.styleRow.innerHTML = '';
  for (const s of ROOM_STYLES) {
    const btn = document.createElement('button');
    const active = state.room.wall === s.wall && state.room.floor === s.floor;
    btn.className = `style-btn${active ? ' active' : ''}`;
    btn.innerHTML = `<span class="icon">${s.icon}</span><span>${s.vi}</span>`;
    btn.addEventListener('click', () => {
      const phrase = applyRoomStyle(state.room, s.id);
      if (!phrase) return;
      sfx.match(1);
      announce(phrase);
      persist();
      renderColors();
      buildStyles();
      buildSwatches();
    });
    els.styleRow.appendChild(btn);
  }
}

function buildSwatches() {
  els.wallRow.innerHTML = '<span class="tag">🧱</span>';
  for (const c of WALL_COLORS) {
    const dot = document.createElement('button');
    dot.className = `swatch${state.room.wall === c.id ? ' active' : ''}`;
    dot.style.background = c.hex;
    dot.title = c.vi;
    dot.addEventListener('click', () => {
      const phrase = setWall(state.room, c.id);
      sfx.match(1);
      announce(phrase);
      persist();
      renderColors();
      buildStyles();
      buildSwatches();
    });
    els.wallRow.appendChild(dot);
  }
  els.floorRow.innerHTML = '<span class="tag">🟫</span>';
  for (const c of FLOOR_COLORS) {
    const dot = document.createElement('button');
    dot.className = `swatch${state.room.floor === c.id ? ' active' : ''}`;
    dot.style.background = c.hex;
    dot.title = c.vi;
    dot.addEventListener('click', () => {
      const phrase = setFloor(state.room, c.id);
      sfx.match(1);
      announce(phrase);
      persist();
      renderColors();
      buildStyles();
      buildSwatches();
    });
    els.floorRow.appendChild(dot);
  }
}

/* ===== Nút ===== */

els.btnRandom.addEventListener('click', () => {
  sfx.shuffle();
  state.room = randomRoom(Math.random);
  state.selected = null;
  persist();
  render();
  buildStyles();
  buildSwatches();
  announce({ en: 'Surprise!', vi: 'Bất ngờ chưa!' });
});
els.btnSave.addEventListener('click', () => {
  const gallery = JSON.parse(localStorage.getItem(GALLERY_KEY) || '[]');
  gallery.push(serializeRoom(state.room));
  localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery.slice(-30)));
  sfx.levelWin();
  els.sayBubble.textContent = `📷 ${t('phongxinh.saved', 'Đã lưu căn phòng!')} (${gallery.length})`;
  speak(t('phongxinh.saved', 'Đã lưu căn phòng!'));
});
els.btnHelp.addEventListener('click', () => { sfx.select(); speak(state.instruction); });
els.btnSound.addEventListener('click', () => {
  sfx.toggleMute();
  els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
  if (sfx.muted) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
});

// Ghi thời gian chơi khi rời trang — game không chấm điểm
window.addEventListener('pagehide', () => {
  currentProfile(t('pika.user.guest', 'Khách'));
  recordSession({
    mode: 'phongxinh',
    result: 'quit',
    score: 0,
    level: 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
buildPalette();
buildStyles();
buildSwatches();
render();
sayInstruction(t('phongxinh.help', 'Chạm món đồ trên kệ để đặt vào phòng — máy đọc tên bằng tiếng Anh! Kéo món đồ tới chỗ bé thích, tranh với đồng hồ thì treo trên tường. Chọn món rồi bấm mũi tên để lật, thùng rác để cất đi. Đổi màu tường màu sàn, bấm máy ảnh lưu căn phòng xinh nhé!'));

// Hook cho e2e test
window.__phongxinh = { state, render, announce };

mountKidFeatures(); // thanh avatar bé + huy hiệu sao header + kiểm tra giới hạn phút/ngày (áp dụng cho mọi game, kể cả game giải trí thuần)
