// Vườn Hoa — hoa mua bằng sao trong Tủ Quà giờ còn sinh thêm sao mỗi ngày (như
// "tiết kiệm"), và có thể bán lại lấy sao. Toàn bộ công thức là hàm THUẦN,
// không đụng DOM/mạng, để test độc lập. Phần gọi Supabase thật nằm ở api.js.
//
// Luật đã chốt với phụ huynh (07/2026):
// - Trần lãi suất "trồng hoa": 36.5%/năm — chia đều 365 ngày = đúng 0.1%/ngày.
//   Ví dụ dễ hiểu cho bé: trồng 1.000 sao tiền hoa thì mỗi ngày tự có thêm 1 sao.
// - Lãi cộng dồn qua NHIỀU NGÀY TRỌN VẸN mỗi lần bé mở Tủ Quà (không cộng lẻ
//   giờ/phút) — phần lẻ trong ngày hiện tại vẫn được giữ lại cho lần sau, hiện
//   qua progress bar để bé thấy "hôm nay tích được bao nhiêu rồi".
// - Bán hoa lại: mất đúng 1 sao so với giá đã mua (hoa 10 sao bán lại được 9).

export const GARDEN_ANNUAL_RATE = 0.365; // 36.5%/năm — trần lạm phát sao đã chốt với phụ huynh
export const GARDEN_DAILY_RATE = GARDEN_ANNUAL_RATE / 365; // đúng 0.001 = 0.1%/ngày
export const SELL_BACK_FEE = 1; // bán lại hoa mất đúng 1 sao so với giá đã mua
export const DAY_MS = 24 * 60 * 60 * 1000;

/** Hoa mua ở Tủ Quà, CHƯA bán lại (dùng `catalogItem` để biết purchase nào là hoa). */
export function gardenFlowers(purchases, catalogItem) {
  return purchases.filter((p) => !p.sold_at && catalogItem(p.item_id)?.type === 'flower');
}

/** Tổng giá trị vườn hoa hiện tại = tổng giá (lúc mua) của mọi hoa chưa bán. */
export function gardenValue(purchases, catalogItem) {
  return gardenFlowers(purchases, catalogItem).reduce((sum, p) => sum + (p.cost | 0), 0);
}

/** Số ngày TRỌN VẸN đã trôi qua giữa 2 mốc thời gian (mili-giây), không âm. */
export function daysElapsed(fromMs, toMs) {
  return Math.floor(Math.max(0, toMs - fromMs) / DAY_MS);
}

/** Số sao lợi tức ứng với `days` ngày trọn vẹn, tính trên `value` sao đã trồng. */
export function pendingYield(value, days) {
  if (value <= 0 || days <= 0) return 0;
  return Math.round(value * GARDEN_DAILY_RATE * days);
}

/** Tỉ lệ đã trôi qua trong "ngày hiện tại" (0→1, để vẽ progress bar) kể từ lần cộng lãi gần nhất. */
export function todayProgress(lastYieldAtMs, nowMs) {
  const elapsed = Math.max(0, nowMs - lastYieldAtMs);
  return Math.min(1, (elapsed % DAY_MS) / DAY_MS);
}

/**
 * Tính 1 lần "thu lãi vườn hoa": bao nhiêu sao được cộng thêm (có thể là 0),
 * và mốc thời gian lần cộng lãi MỚI — chỉ nhảy tới theo TỪNG NGÀY TRỌN VẸN,
 * giữ lại phần lẻ trong ngày hiện tại để không mất tiến độ progress bar.
 */
export function claimGardenYield(value, lastYieldAtMs, nowMs) {
  const days = daysElapsed(lastYieldAtMs, nowMs);
  const stars = pendingYield(value, days);
  return { stars, days, newLastYieldAtMs: lastYieldAtMs + days * DAY_MS };
}

/** Bán lại 1 bông hoa: mất đúng SELL_BACK_FEE sao so với giá đã mua, không âm. */
export function sellBackValue(cost) {
  return Math.max(0, (cost | 0) - SELL_BACK_FEE);
}
