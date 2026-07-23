// Hàm THUẦN dùng để "dồn trước" nhiều ngày bài Luyện Dịch/Trắc Nghiệm Ngữ
// Pháp (xem api/generate-daily-content.js và shared/kid-bar.js) — tách riêng
// khỏi phần gọi mạng/DB để test được dễ dàng.

/** Sinh mảng N ngày (chuỗi "YYYY-MM-DD") tính từ `startKey` (bao gồm chính
 * `startKey`), tăng dần từng ngày 1. Parse `startKey` theo giờ UTC 00:00 để
 * tránh lệch ngày do múi giờ máy chủ khi cộng mili-giây. */
export function dateRange(startKey, days) {
  const start = new Date(`${startKey}T00:00:00Z`);
  const out = [];
  const p = (n) => String(n).padStart(2, '0');
  for (let i = 0; i < days; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    out.push(`${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}`);
  }
  return out;
}

/**
 * Trong danh sách ngày CẦN CÓ (`wantDays`, đã sắp cũ→mới), lọc ra những ngày
 * CÒN THIẾU (không có trong `existingDays`) — giữ ĐÚNG THỨ TỰ gần nhất trước
 * (ngày gần hôm nay hơn được ưu tiên sinh trước), giới hạn tối đa `cap` ngày
 * mỗi lần gọi để không sinh dồn quá nhiều cùng lúc (tránh vượt giới hạn tốc
 * độ API AI / thời gian chạy hàm serverless — xem MAX_NEW_DAYS_PER_RUN ở
 * api/generate-daily-content.js).
 */
export function missingDays(wantDays, existingDays, cap = Infinity) {
  const existing = new Set(existingDays);
  const missing = wantDays.filter((d) => !existing.has(d));
  return cap === Infinity ? missing : missing.slice(0, cap);
}
