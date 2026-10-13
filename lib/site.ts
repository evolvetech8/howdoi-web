// Thông tin chung của trang. Đổi email liên hệ hay khẩu hiệu ở đây là đủ.
export const SITE = {
  name: "HowDoI",
  // Vercel chuyển howdoi.id.vn sang www, nên mọi URL chuẩn (canonical, sitemap) dùng www.
  url: "https://www.howdoi.id.vn",
  tagline: "Làm sao để hết nợ? Từng tháng một.",
  description:
    "HowDoI giúp người đang gánh nợ lập kế hoạch trả nợ miễn phí: biết ngày hết nợ, nên trả khoản nào trước, và ghi sổ mỗi tháng để theo dõi. Không cần tài khoản, số liệu chỉ lưu trên máy bạn.",
  // Cam kết công khai, hiện ở chân trang và trang Giới thiệu.
  pledge: "HowDoI không cho vay và không quảng cáo khoản vay, thẻ tín dụng hay ví trả sau.",
  author: "Frank",
  contactEmail: "archonic88@gmail.com",
} as const;

export function formatDateVN(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}
