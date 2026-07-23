// Ngày theo GIỜ VIỆT NAM (UTC+7) — dùng ở server (api/generate-daily-content.js),
// nơi KHÔNG có "giờ địa phương của thiết bị" như phía client, để mọi gia đình
// (dù server Vercel chạy ở múi giờ nào) đều thấy "hôm nay" trùng ngày thật ở
// Việt Nam thay vì lệch theo UTC.

export function vnDateKey(date = new Date()) {
  const vn = new Date(date.getTime() + 7 * 3600000);
  const p = (n) => String(n).padStart(2, '0');
  return `${vn.getUTCFullYear()}-${p(vn.getUTCMonth() + 1)}-${p(vn.getUTCDate())}`;
}
