// Điều phối Bé Làm Stylist: búp bê SVG nhiều lớp tự vẽ, tủ đồ theo tab, chạm món đồ
// mặc ngay + đọc to tên tiếng Anh, chạm bộ phận cơ thể đọc tên bộ phận. Không chấm điểm —
// chỉ ghi thời gian chơi (tinh thần "chơi để chơi" như Vẽ Tự Do).

import {
  SLOTS, COLORS, BODY_PARTS,
  colorById, itemsForSlot, makeOutfit, equipItem, recolorSlot,
  serializeOutfit, deserializeOutfit, randomOutfit,
} from './stylist.js';
import { speak, bindMute } from '../../to-mau/src/speech.js';
import { sfx } from '../../pokemon/src/sfx.js';
import { currentProfile, recordSession } from '../../pokemon/src/stats.js';

const t = (key, fallback) => {
  const v = window.I18N?.t(key);
  return v && v !== key ? v : fallback;
};

const $ = (id) => document.getElementById(id);
const els = {
  dollBox: $('dollBox'), sayBubble: $('sayBubble'),
  slotTabs: $('slotTabs'), itemGrid: $('itemGrid'), colorRow: $('colorRow'),
  btnRandom: $('btnRandom'), btnSave: $('btnSave'), btnHelp: $('btnHelp'), btnSound: $('btnSound'),
};

const OUTFIT_KEY = 'stylist.outfit';
const GALLERY_KEY = 'stylist.gallery';
const SLOT_ICON = { hair: '💇', top: '👕', bottom: '👖', shoes: '👟', accessory: '🎀' };

const state = {
  outfit: deserializeOutfit(localStorage.getItem(OUTFIT_KEY) || ''),
  slot: 'top',
  startedAt: Date.now(),
  instruction: '',
};
bindMute(() => sfx.muted);

/** Đọc hướng dẫn + lưu lại để bấm ❓ nghe lại được. */
function sayInstruction(text) {
  state.instruction = text;
  speak(text);
}

/** Đọc to cụm từ tiếng Anh bằng GIỌNG TIẾNG ANH thật, hiện lên bong bóng lời thoại. */
function announce(phrase) {
  els.sayBubble.textContent = `🗣️ ${phrase.en}`;
  els.sayBubble.classList.remove('pop');
  void els.sayBubble.offsetWidth;
  els.sayBubble.classList.add('pop');
  speak(phrase.en, { lang: 'en-US', rate: 0.68 });
}

/* ===== Búp bê SVG tự vẽ — từng slot là 1 nhóm thay nội dung được ===== */

const SKIN = '#ffd9b0';
const SKIN_DARK = '#eebd8e';

function hairSvg(style, hex) {
  if (style === 'hair_long') {
    return `<path d="M74 62 Q74 18 120 18 Q166 18 166 62 L166 150 Q150 140 146 108 L94 108 Q90 140 74 150 Z" fill="${hex}"/>`;
  }
  if (style === 'hair_buns') {
    return `<circle cx="72" cy="52" r="17" fill="${hex}"/><circle cx="168" cy="52" r="17" fill="${hex}"/>
      <path d="M76 66 Q76 22 120 22 Q164 22 164 66 L160 78 Q120 58 80 78 Z" fill="${hex}"/>`;
  }
  return `<path d="M76 66 Q76 20 120 20 Q164 20 164 66 L160 80 Q120 56 80 80 Z" fill="${hex}"/>`; // hair_short
}

function topSvg(style, hex) {
  if (style === 'top_dress') {
    return `<path d="M96 148 L144 148 L166 240 L74 240 Z" fill="${hex}"/>
      <rect x="96" y="140" width="48" height="30" rx="8" fill="${hex}"/>`;
  }
  if (style === 'top_jacket') {
    return `<rect x="92" y="140" width="56" height="66" rx="12" fill="${hex}"/>
      <rect x="114" y="144" width="12" height="58" fill="rgba(255,255,255,0.55)"/>
      <rect x="84" y="144" width="12" height="46" rx="6" fill="${hex}"/>
      <rect x="144" y="144" width="12" height="46" rx="6" fill="${hex}"/>`;
  }
  return `<rect x="94" y="140" width="52" height="60" rx="10" fill="${hex}"/>
    <rect x="86" y="142" width="12" height="34" rx="6" fill="${hex}"/>
    <rect x="142" y="142" width="12" height="34" rx="6" fill="${hex}"/>`; // top_tshirt
}

function bottomSvg(style, hex) {
  if (style === 'bottom_pants') {
    return `<path d="M98 198 L142 198 L140 268 L124 268 L120 226 L116 268 L100 268 Z" fill="${hex}"/>`;
  }
  if (style === 'bottom_skirt') {
    return `<path d="M96 198 L144 198 L156 240 L84 240 Z" fill="${hex}"/>`;
  }
  return `<path d="M98 198 L142 198 L141 232 L123 232 L120 214 L117 232 L99 232 Z" fill="${hex}"/>`; // shorts
}

function shoesSvg(style, hex) {
  if (style === 'shoes_boots') {
    return `<rect x="102" y="252" width="16" height="30" rx="5" fill="${hex}"/>
      <rect x="122" y="252" width="16" height="30" rx="5" fill="${hex}"/>
      <rect x="100" y="274" width="20" height="10" rx="4" fill="${hex}"/>
      <rect x="120" y="274" width="20" height="10" rx="4" fill="${hex}"/>`;
  }
  return `<ellipse cx="110" cy="278" rx="12" ry="7" fill="${hex}"/>
    <ellipse cx="130" cy="278" rx="12" ry="7" fill="${hex}"/>
    <rect x="99" y="274" width="23" height="5" rx="2" fill="#fff"/>
    <rect x="119" y="274" width="23" height="5" rx="2" fill="#fff"/>`; // sneakers
}

function accessorySvg(style, hex) {
  if (style === 'acc_bow') {
    return `<path d="M104 26 L120 36 L136 26 L130 44 L136 58 L120 48 L104 58 L110 44 Z" fill="${hex}"/>`;
  }
  if (style === 'acc_hat') {
    return `<ellipse cx="120" cy="34" rx="44" ry="10" fill="${hex}"/>
      <path d="M92 32 Q92 6 120 6 Q148 6 148 32 Z" fill="${hex}"/>`;
  }
  if (style === 'acc_glasses') {
    return `<circle cx="104" cy="86" r="12" fill="none" stroke="${hex}" stroke-width="4"/>
      <circle cx="136" cy="86" r="12" fill="none" stroke="${hex}" stroke-width="4"/>
      <line x1="116" y1="86" x2="124" y2="86" stroke="${hex}" stroke-width="4"/>`;
  }
  return ''; // acc_none
}

function renderDoll() {
  const o = state.outfit;
  const hex = (slot) => colorById(o[slot].color).hex;
  els.dollBox.innerHTML = `
  <svg viewBox="0 0 240 320" role="img" aria-label="Búp bê">
    <!-- thân nền (da) -->
    <rect x="112" y="120" width="16" height="26" fill="${SKIN}"/>
    <rect x="82" y="146" width="10" height="46" rx="5" fill="${SKIN}"/>
    <rect x="148" y="146" width="10" height="46" rx="5" fill="${SKIN}"/>
    <circle cx="87" cy="196" r="7" fill="${SKIN_DARK}"/>
    <circle cx="153" cy="196" r="7" fill="${SKIN_DARK}"/>
    <rect x="100" y="150" width="40" height="56" fill="${SKIN}"/>
    <rect x="104" y="200" width="12" height="62" fill="${SKIN}"/>
    <rect x="124" y="200" width="12" height="62" fill="${SKIN}"/>
    <g id="g-bottom">${bottomSvg(o.bottom.item, hex('bottom'))}</g>
    <g id="g-top">${topSvg(o.top.item, hex('top'))}</g>
    <g id="g-shoes">${shoesSvg(o.shoes.item, hex('shoes'))}</g>
    <!-- đầu + mặt -->
    <circle cx="120" cy="86" r="42" fill="${SKIN}"/>
    <circle cx="104" cy="86" r="4" fill="#241e2e"/>
    <circle cx="136" cy="86" r="4" fill="#241e2e"/>
    <circle cx="98" cy="100" r="6" fill="rgba(240,120,140,0.45)"/>
    <circle cx="142" cy="100" r="6" fill="rgba(240,120,140,0.45)"/>
    <path d="M108 106 Q120 118 132 106" fill="none" stroke="#241e2e" stroke-width="3.5" stroke-linecap="round"/>
    <g id="g-hair">${hairSvg(o.hair.item, hex('hair'))}</g>
    <g id="g-acc">${accessorySvg(o.accessory.item, hex('accessory'))}</g>
    <!-- vùng chạm bộ phận cơ thể (trong suốt) -->
    <circle class="hit" data-part="head" cx="120" cy="60" r="30" fill="transparent"/>
    <rect class="hit" data-part="eyes" x="94" y="76" width="52" height="20" fill="transparent"/>
    <rect class="hit" data-part="mouth" x="102" y="100" width="36" height="16" fill="transparent"/>
    <circle class="hit" data-part="hands" cx="87" cy="196" r="14" fill="transparent"/>
    <circle class="hit" data-part="hands" cx="153" cy="196" r="14" fill="transparent"/>
    <rect class="hit" data-part="tummy" x="98" y="160" width="44" height="40" fill="transparent"/>
    <rect class="hit" data-part="feet" x="94" y="262" width="52" height="24" fill="transparent"/>
  </svg>`;
  for (const hit of els.dollBox.querySelectorAll('.hit')) {
    hit.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      const part = BODY_PARTS.find((p) => p.id === hit.dataset.part);
      if (part) {
        sfx.select();
        announce(part);
      }
    });
  }
}

/* ===== Tủ đồ ===== */

function renderTabs() {
  els.slotTabs.innerHTML = '';
  for (const slot of SLOTS) {
    const btn = document.createElement('button');
    btn.className = `slot-tab${slot === state.slot ? ' active' : ''}`;
    btn.textContent = SLOT_ICON[slot];
    btn.addEventListener('click', () => {
      sfx.select();
      state.slot = slot;
      renderWardrobe();
    });
    els.slotTabs.appendChild(btn);
  }
}

function renderItems() {
  els.itemGrid.innerHTML = '';
  for (const item of itemsForSlot(state.slot)) {
    const btn = document.createElement('button');
    btn.className = `item-btn${state.outfit[state.slot].item === item.id ? ' active' : ''}`;
    btn.innerHTML = `<span>${item.vi}<span class="en">${item.en}</span></span>`;
    btn.addEventListener('click', () => {
      const phrase = equipItem(state.outfit, item.id);
      if (!phrase) return;
      sfx.match(1);
      announce(phrase);
      persist();
      renderDoll();
      renderWardrobe();
    });
    els.itemGrid.appendChild(btn);
  }
}

function renderColors() {
  els.colorRow.innerHTML = '';
  for (const c of COLORS) {
    const dot = document.createElement('button');
    dot.className = `color-dot${state.outfit[state.slot].color === c.id ? ' active' : ''}`;
    dot.style.background = c.hex;
    dot.title = c.vi;
    dot.addEventListener('click', () => {
      const phrase = recolorSlot(state.outfit, state.slot, c.id);
      if (!phrase) return;
      sfx.match(1);
      announce(phrase);
      persist();
      renderDoll();
      renderColors();
    });
    els.colorRow.appendChild(dot);
  }
}

function renderWardrobe() {
  renderTabs();
  renderItems();
  renderColors();
}

function persist() {
  localStorage.setItem(OUTFIT_KEY, serializeOutfit(state.outfit));
}

/* ===== Nút ===== */

els.btnRandom.addEventListener('click', () => {
  sfx.shuffle();
  state.outfit = randomOutfit(Math.random);
  persist();
  renderDoll();
  renderWardrobe();
  announce({ en: 'Surprise!', vi: 'Bất ngờ chưa!' });
});
els.btnSave.addEventListener('click', () => {
  const gallery = JSON.parse(localStorage.getItem(GALLERY_KEY) || '[]');
  gallery.push(serializeOutfit(state.outfit));
  localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery.slice(-30)));
  sfx.levelWin();
  els.sayBubble.textContent = `📷 ${t('stylist.saved', 'Đã lưu bộ đồ!')} (${gallery.length})`;
  speak(t('stylist.saved', 'Đã lưu bộ đồ!'));
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
    mode: 'stylist',
    result: 'quit',
    score: 0,
    level: 1,
    seconds: (Date.now() - state.startedAt) / 1000,
  });
});

els.btnSound.textContent = sfx.muted ? '🔇' : '🔊';
renderDoll();
renderWardrobe();
sayInstruction(t('stylist.help', 'Chọn ô quần áo bên phải rồi chạm món đồ để mặc cho bạn búp bê — máy sẽ đọc tên món đồ bằng tiếng Anh! Chạm chấm màu để đổi màu, chạm vào người búp bê để nghe tên bộ phận cơ thể. Bấm xúc xắc để trộn đồ, bấm máy ảnh để lưu bộ đồ đẹp!'));

// Hook cho e2e test
window.__stylist = { state, renderDoll, announce };
