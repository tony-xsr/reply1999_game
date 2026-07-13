/* Reply1999 Games — root service worker.
   Scope = '/'. Cache hub + các game khi truy cập lần đầu. */
const CACHE = 'reply1999-v17';
const PRECACHE = [
  './', './index.html', './manifest.json', './i18n.js',
  './pokemon/index.html',
  './pokemon/style.css',
  './pokemon/src/pathfinder.js',
  './pokemon/src/board.js',
  './pokemon/src/levels.js',
  './pokemon/src/timer.js',
  './pokemon/src/score.js',
  './pokemon/src/sfx.js',
  './pokemon/src/renderer.js',
  './pokemon/src/daily.js',
  './pokemon/src/achievements.js',
  './pokemon/src/stats.js',
  './pokemon/src/app.js',
  './to-mau/index.html',
  './to-mau/style.css',
  './to-mau/src/letters.js',
  './to-mau/src/paint.js',
  './to-mau/src/speech.js',
  './to-mau/src/app.js',
  './tap-viet/index.html',
  './tap-viet/style.css',
  './tap-viet/src/strokes.js',
  './tap-viet/src/tracer.js',
  './tap-viet/src/app.js',
  './hoc-vui/index.html',
  './hoc-vui/style.css',
  './hoc-vui/src/words.js',
  './hoc-vui/src/app.js',
  './lat-hinh/index.html',
  './lat-hinh/style.css',
  './lat-hinh/src/deck.js',
  './lat-hinh/src/app.js',
  './ran-san-moi/index.html',
  './ran-san-moi/style.css',
  './ran-san-moi/src/snake.js',
  './ran-san-moi/src/app.js',
  './ghep-hinh/index.html',
  './ghep-hinh/style.css',
  './ghep-hinh/src/puzzle.js',
  './ghep-hinh/src/app.js',
  './co-caro/index.html',
  './co-caro/style.css',
  './co-caro/src/caro.js',
  './co-caro/src/app.js',
  './xep-gach/index.html',
  './xep-gach/style.css',
  './xep-gach/src/tetris.js',
  './xep-gach/src/app.js',
  './bat-vit/index.html',
  './bat-vit/style.css',
  './bat-vit/src/ducks.js',
  './bat-vit/src/app.js',
  './o-an-quan/index.html',
  './o-an-quan/style.css',
  './o-an-quan/src/oanquan.js',
  './o-an-quan/src/app.js',
  './nhay-lo-co/index.html',
  './nhay-lo-co/style.css',
  './nhay-lo-co/src/loco.js',
  './nhay-lo-co/src/app.js',
  './hoc-van/index.html',
  './hoc-van/style.css',
  './hoc-van/src/van.js',
  './hoc-van/src/app.js',
  './toan-lop-1/index.html',
  './toan-lop-1/style.css',
  './toan-lop-1/src/toan.js',
  './toan-lop-1/src/app.js',
  './tu-duy/index.html',
  './tu-duy/style.css',
  './tu-duy/src/tuduy.js',
  './tu-duy/src/app.js',
  './tro-xua/index.html',
  './tro-xua/style.css',
  './tro-xua/src/troxua.js',
  './tro-xua/src/app.js',
  './co-ganh/index.html',
  './co-ganh/style.css',
  './co-ganh/src/coganh.js',
  './co-ganh/src/app.js',
  './co-ca-ngua/index.html',
  './co-ca-ngua/style.css',
  './co-ca-ngua/src/ludo.js',
  './co-ca-ngua/src/app.js',
  './dien-tu/index.html',
  './dien-tu/style.css',
  './dien-tu/src/dientu.js',
  './dien-tu/src/app.js',
  './ky-nang-song/index.html',
  './ky-nang-song/style.css',
  './ky-nang-song/src/kynang.js',
  './ky-nang-song/src/app.js',
  './khoa-hoc/index.html',
  './khoa-hoc/style.css',
  './khoa-hoc/src/khoahoc.js',
  './khoa-hoc/src/app.js',
  './tieng-anh/index.html',
  './tieng-anh/style.css',
  './tieng-anh/src/tienganh.js',
  './tieng-anh/src/app.js',
  './van-hoa-vn/index.html',
  './van-hoa-vn/style.css',
  './van-hoa-vn/src/vanhoa.js',
  './van-hoa-vn/src/app.js',
  './pokemon/images/trimmed/pm0025_00_00_00_big.png',
  './pokemon/images/trimmed/pm0001_00_00_00_big.png',
  './pokemon/images/trimmed/pm0004_00_00_00_big.png',
  './pokemon/images/trimmed/pm0007_00_00_00_big.png',
  './pokemon/images/trimmed/pm0006_00_00_00_big.png',
  './pokemon/images/trimmed/pm0009_00_00_00_big.png',
  './pokemon/images/trimmed/pm0003_00_00_00_big.png',
  './pokemon/images/trimmed/pm0133_00_00_00_big.png',
  './pokemon/images/trimmed/pm0039_00_00_00_big.png',
  './pokemon/images/trimmed/pm0052_00_00_00_big.png',
  './pokemon/images/trimmed/pm0054_00_00_00_big.png',
  './pokemon/images/trimmed/pm0094_00_00_00_big.png',
  './pokemon/images/trimmed/pm0143_00_00_00_big.png',
  './pokemon/images/trimmed/pm0131_00_00_00_big.png',
  './pokemon/images/trimmed/pm0130_00_00_00_big.png',
  './pokemon/images/trimmed/pm0129_00_00_00_big.png',
  './pokemon/images/trimmed/pm0150_00_00_00_big.png',
  './pokemon/images/trimmed/pm0151_00_00_00_big.png',
  './pokemon/images/trimmed/pm0149_00_00_00_big.png',
  './pokemon/images/trimmed/pm0148_00_00_00_big.png',
  './pokemon/images/trimmed/pm0058_00_00_00_big.png',
  './pokemon/images/trimmed/pm0059_00_00_00_big.png',
  './pokemon/images/trimmed/pm0113_00_00_00_big.png',
  './pokemon/images/trimmed/pm0123_00_00_00_big.png',
  './pokemon/images/trimmed/pm0134_00_00_00_big.png',
  './pokemon/images/trimmed/pm0135_00_00_00_big.png',
  './pokemon/images/trimmed/pm0136_00_00_00_big.png',
  './pokemon/images/trimmed/pm0196_00_00_00_big.png',
  './pokemon/images/trimmed/pm0197_00_00_00_big.png',
  './pokemon/images/trimmed/pm0035_00_00_00_big.png',
  './pokemon/images/trimmed/pm0037_00_00_00_big.png',
  './pokemon/images/trimmed/pm0038_00_00_00_big.png',
  './pokemon/images/trimmed/pm0026_00_00_00_big.png',
  './pokemon/images/trimmed/pm0448_00_00_00_big.png',
  './pokemon/images/trimmed/pm0445_00_00_00_big.png',
  './pokemon/images/trimmed/pm0147_00_00_00_big.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  // Dev localhost: luôn lấy từ mạng để sửa file thấy ngay
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request)
        .then((resp) => {
          if (resp && resp.status === 200 && resp.type === 'basic') {
            const clone = resp.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return resp;
        })
        .catch(() => cached);
    })
  );
});
