// Màn "Bé nào đang chơi?" — cách bé "đăng nhập": chạm avatar của mình. Con
// trỏ bé-đang-chơi lưu cục bộ trên thiết bị; dữ liệu thật (điểm/sao/quà) nằm
// trên server theo hồ sơ đã chọn. Nếu bố mẹ có gửi quà (manual_rewards chưa
// mở), hiện hộp quà + máy đọc lời nhắn ngay khi bé chọn xong.

import * as api from '../../shared/api.js';

const $ = (id) => document.getElementById(id);

async function boot() {
  const kidsBox = $('kids');
  if (!(await api.configured())) {
    kidsBox.innerHTML = '';
    $('note').innerHTML = 'Chưa kết nối server — nhờ bố mẹ vào <a href="/phu-huynh/">Trang Phụ Huynh</a> làm theo hướng dẫn cài đặt nhé.';
    return;
  }
  if (!api.signedIn()) {
    kidsBox.innerHTML = '';
    $('note').innerHTML = 'Máy này chưa được liên kết — nhờ bố mẹ đăng nhập 1 lần trong <a href="/phu-huynh/">Trang Phụ Huynh</a> là xong.';
    return;
  }
  let kids = [];
  try {
    kids = await api.listKids();
  } catch (e) {
    kidsBox.innerHTML = '';
    $('note').textContent = `Không tải được danh sách bé (${e.message}). Kiểm tra mạng rồi thử lại nhé.`;
    return;
  }
  if (!kids.length) {
    kidsBox.innerHTML = '';
    $('note').innerHTML = 'Chưa có hồ sơ bé nào — nhờ bố mẹ tạo trong <a href="/phu-huynh/">Trang Phụ Huynh</a> nhé.';
    return;
  }
  const currentId = api.getCurrentKidId();
  kidsBox.innerHTML = '';
  for (const k of kids) {
    const card = document.createElement('div');
    card.className = `kid${k.id === currentId ? ' current' : ''}`;
    card.innerHTML = `<div class="face">${k.avatar}</div><div class="name">${k.name}</div>
      <div class="tag">${k.id === currentId ? 'Đang chơi ✓' : ''}</div>`;
    card.addEventListener('click', () => pickKid(k));
    kidsBox.appendChild(card);
  }
}

/** Đoán tên thiết bị + trình duyệt từ userAgent (chỉ để hiển thị cho bố mẹ). */
function deviceInfo() {
  const ua = navigator.userAgent;
  let device = 'Máy tính';
  if (/iPad/i.test(ua)) device = 'iPad';
  else if (/iPhone/i.test(ua)) device = 'iPhone';
  else if (/Android/i.test(ua)) device = /Mobile/i.test(ua) ? 'Điện thoại Android' : 'Tablet Android';
  else if (/Macintosh/i.test(ua)) device = 'Máy Mac';
  else if (/Windows/i.test(ua)) device = 'Máy Windows';
  let browser = 'Trình duyệt';
  if (/Edg\//.test(ua)) browser = 'Edge';
  else if (/OPR\/|Opera/.test(ua)) browser = 'Opera';
  else if (/Chrome\//.test(ua)) browser = 'Chrome';
  else if (/Firefox\//.test(ua)) browser = 'Firefox';
  else if (/Safari\//.test(ua)) browser = 'Safari';
  if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) browser += ' (WebApp)';
  return { device, browser };
}

function speakVi(text) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'vi-VN';
    u.rate = 0.95;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  } catch { /* ignore */ }
}

async function pickKid(k) {
  // Bé có MÃ ĐĂNG NHẬP 6 số (bố mẹ đặt trong Trang Phụ Huynh) và đang đổi từ
  // hồ sơ khác sang → phải nhập đúng mã. Bé đang là hồ sơ hiện tại thì thôi.
  const code = k.settings?.code;
  if (code && api.getCurrentKidId() !== k.id) {
    const okCode = await askCode(k, code);
    if (!okCode) return;
  }
  api.setCurrentKid(k.id, { name: k.name, avatar: k.avatar, settings: k.settings || {} });
  speakVi(`Chào ${k.name}! Chúc bé chơi vui nhé!`);
  // Báo cho trang Phụ Huynh: bé vừa đăng nhập (thời gian + thiết bị + trình duyệt).
  api.recordKidLogin(k.id, deviceInfo()).catch(() => {});
  boot();
  // Có quà bố mẹ gửi đang chờ không?
  try {
    const gifts = await api.unopenedRewards(k.id);
    if (gifts.length) showGift(k, gifts[0]);
  } catch { /* mất mạng thì thôi, lần sau hiện */ }
}

/* ===== Bàn phím mã số 6 chữ số (thân thiện trẻ em) ===== */

function askCode(kid, correctCode) {
  return new Promise((resolve) => {
    const ov = $('codeOverlay');
    const dots = $('codeDots');
    const pad = $('codePad');
    let typed = '';
    let wrongCount = 0;
    $('codeAvatar').textContent = kid.avatar;
    $('codeTitle').textContent = `Nhập mã số của ${kid.name}`;
    speakVi(`Bé ${kid.name} ơi, nhập mã số bí mật của bé nhé!`);

    const renderDots = () => {
      dots.textContent = '●'.repeat(typed.length) + '○'.repeat(6 - typed.length);
    };
    const finish = (result) => {
      ov.classList.add('hidden');
      pad.innerHTML = '';
      resolve(result);
    };
    const press = (d) => {
      if (typed.length >= 6) return;
      typed += d;
      renderDots();
      if (typed.length < 6) return;
      if (typed === correctCode) {
        speakVi('Đúng rồi!');
        finish(true);
        return;
      }
      wrongCount++;
      typed = '';
      dots.textContent = '✖ ✖ ✖';
      if (wrongCount >= 3) {
        speakVi('Sai mã 3 lần rồi. Bé nhờ bố mẹ giúp nhé!');
        setTimeout(() => finish(false), 1500);
        return;
      }
      speakVi('Chưa đúng, bé thử lại nhé!');
      setTimeout(renderDots, 800);
    };

    pad.innerHTML = '';
    for (const key of ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫']) {
      const b = document.createElement('button');
      b.textContent = key;
      b.style.cssText = 'font:900 22px inherit;padding:12px 0;border-radius:12px;border:2px solid #a8834a;'
        + `background:#fff3df;cursor:pointer;color:#241e2e;${key === '' ? 'visibility:hidden' : ''}`;
      b.addEventListener('click', () => {
        if (key === '⌫') { typed = typed.slice(0, -1); renderDots(); }
        else press(key);
      });
      pad.appendChild(b);
    }
    renderDots();
    $('codeCancel').onclick = () => finish(false);
    ov.classList.remove('hidden');
  });
}

function showGift(kid, gift) {
  $('giftOverlay').classList.remove('hidden');
  $('giftIcon').textContent = '🎁';
  $('giftText').textContent = 'Có quà từ bố mẹ gửi cho bé nè!';
  $('btnOpenGift').onclick = async () => {
    try {
      await api.openReward(gift);
    } catch { /* vẫn cho bé xem lời nhắn */ }
    const starsMsg = gift.stars > 0 ? ` Bé được tặng ${gift.stars} ngôi sao!` : '';
    $('giftIcon').textContent = '⭐';
    $('giftText').textContent = `${gift.message || 'Bé giỏi lắm!'}${starsMsg}`;
    speakVi(`${gift.message || 'Bé giỏi lắm!'}.${starsMsg}`);
    $('btnOpenGift').textContent = 'TUYỆT VỜI ▶';
    $('btnOpenGift').onclick = () => $('giftOverlay').classList.add('hidden');
  };
}

boot();
