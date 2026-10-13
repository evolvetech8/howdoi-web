// Thông tin chung của trang. Đổi email liên hệ hay khẩu hiệu ở đây là đủ.
export const SITE = {
  name: "HowDoI",
  // Vercel chuyển howdoi.id.vn sang www, nên mọi URL chuẩn (canonical, sitemap) dùng www.
  url: "https://www.howdoi.id.vn",
  tagline: "Giải đáp các câu hỏi tiền bạc của người đi làm Việt Nam, kèm công cụ tính miễn phí.",
  description:
    "Làm sao để tính lương Net, để dành đủ 1 tỷ, vay mua nhà hay chia lương mỗi tháng? HowDoI trả lời từng câu hỏi tiền bạc bằng hướng dẫn dễ hiểu và công cụ tính miễn phí, cập nhật theo luật 2026.",
  author: "Frank",
  contactEmail: "archonic88@gmail.com",
} as const;

export function formatDateVN(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}
