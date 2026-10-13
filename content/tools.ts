// Cấu trúc nội dung của HowDoI: mỗi cụm chủ đề xoay quanh một công cụ tính.
export type TopicId = "luong-thue" | "tiet-kiem-dau-tu" | "vay-tra-no" | "ngan-sach" | "bao-ve-tai-chinh";

export interface Topic {
  id: TopicId;
  name: string;
  description: string;
}

export const TOPICS: Topic[] = [
  {
    id: "luong-thue",
    name: "Lương & Thuế TNCN",
    description: "Lương Gross, Net, bảo hiểm, thuế thu nhập cá nhân và quyết toán thuế.",
  },
  {
    id: "tiet-kiem-dau-tu",
    name: "Tiết kiệm & Đầu tư",
    description: "Quỹ khẩn cấp, lãi kép, gửi tiết kiệm, chứng chỉ quỹ.",
  },
  {
    id: "vay-tra-no",
    name: "Vay & Trả nợ",
    description: "Vay mua nhà, mua xe, thẻ tín dụng và cách trả nợ nhanh hơn.",
  },
  {
    id: "ngan-sach",
    name: "Ngân sách",
    description: "Chia lương mỗi tháng sao cho đủ tiêu mà vẫn để dành được.",
  },
  {
    id: "bao-ve-tai-chinh",
    name: "Bảo vệ tài chính",
    description: "Bảo hiểm, lừa đảo tài chính và những cái bẫy cần tránh.",
  },
];

export type ToolSlug = "luong-gross-net" | "lai-kep" | "tinh-lai-vay" | "ngan-sach-50-30-20";

export interface Tool {
  slug: ToolSlug;
  topic: TopicId;
  name: string;              // Tên ngắn trên thẻ, menu
  title: string;             // H1 của trang công cụ
  question: string;          // Câu hỏi "Làm sao để..." mà công cụ trả lời
  description: string;       // Meta description
  updatedAt: string;         // ISO date
}

export const TOOLS: Tool[] = [
  {
    slug: "luong-gross-net",
    topic: "luong-thue",
    name: "Lương Gross ↔ Net",
    title: "Tính lương Gross sang Net 2026 theo luật thuế TNCN mới",
    question: "Lương Gross của tôi thực nhận được bao nhiêu?",
    description:
      "Tính lương Net từ Gross (và ngược lại) năm 2026: giảm trừ gia cảnh 15,5 triệu, người phụ thuộc 6,2 triệu, biểu thuế 5 bậc, trần BHXH theo lương cơ sở 2,53 triệu.",
    updatedAt: "2026-10-13",
  },
  {
    slug: "lai-kep",
    topic: "tiet-kiem-dau-tu",
    name: "Lãi kép & Tích lũy",
    title: "Tính lãi kép: mỗi tháng để dành bao nhiêu, sau bao lâu có bao nhiêu?",
    question: "Mỗi tháng để dành một khoản thì sau 10, 20 năm có được bao nhiêu?",
    description:
      "Công cụ tính lãi kép theo tháng: nhập vốn ban đầu, số tiền góp mỗi tháng, lãi suất và số năm để xem tài sản tăng thế nào. Kèm bảng số tiền cần góp để có 1 tỷ.",
    updatedAt: "2026-10-13",
  },
  {
    slug: "tinh-lai-vay",
    topic: "vay-tra-no",
    name: "Vay mua nhà / xe",
    title: "Tính lãi vay mua nhà, mua xe: mỗi tháng phải trả bao nhiêu?",
    question: "Vay mua nhà mỗi tháng phải trả bao nhiêu?",
    description:
      "Tính số tiền trả hàng tháng và tổng tiền lãi khi vay mua nhà, mua xe. So sánh cách tính lãi trên dư nợ giảm dần và lãi cố định trên dư nợ ban đầu.",
    updatedAt: "2026-10-13",
  },
  {
    slug: "ngan-sach-50-30-20",
    topic: "ngan-sach",
    name: "Ngân sách 50/30/20",
    title: "Chia lương theo quy tắc 50/30/20 và 6 chiếc lọ",
    question: "Lương về nên chia tiền thế nào cho đủ?",
    description:
      "Nhập lương thực nhận để xem nên dành bao nhiêu cho chi tiêu thiết yếu, mong muốn và tiết kiệm theo quy tắc 50/30/20 hoặc phương pháp 6 chiếc lọ.",
    updatedAt: "2026-10-13",
  },
];

export function getTool(slug: ToolSlug): Tool {
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) throw new Error(`Unknown tool: ${slug}`);
  return tool;
}

export function getTopic(id: TopicId): Topic {
  const topic = TOPICS.find((t) => t.id === id);
  if (!topic) throw new Error(`Unknown topic: ${id}`);
  return topic;
}

export const toolPath = (slug: ToolSlug) => `/cong-cu/${slug}`;
