export type ProjectStatus = 'success' | 'okay' | 'failed' | 'nonprofit' | 'newproj';

export interface Project {
  id: string;
  year: number;
  date: string; // YYYY-MM
  status: ProjectStatus;
  statusLabel: {
    vi: string;
    en: string;
  };
  name: string;
  url?: string;
  githubUrl?: string;
  appStoreUrl?: string;
  tagline: {
    vi: string;
    en: string;
  };
  description: {
    vi: string;
    en: string;
  };
  notes: {
    vi: string;
    en: string;
  };
  techStack: string[];
  metrics?: {
    vi: string;
    en: string;
  };
}

export const STATUS_CONFIG: Record<
  ProjectStatus,
  {
    key: ProjectStatus;
    color: string;
    dotColor: string;
    bgPastel: string;
    borderPastel: string;
    badgeBg: string;
    badgeText: string;
    title: { vi: string; en: string };
    desc: { vi: string; en: string };
  }
> = {
  success: {
    key: 'success',
    color: '#16a34a',
    dotColor: 'text-emerald-600',
    bgPastel: 'bg-emerald-50/80',
    borderPastel: 'border-emerald-200/70',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    title: {
      vi: 'Thành công (Success)',
      en: 'Success',
    },
    desc: {
      vi: 'Có người dùng thực tế, doanh thu hoặc tăng trưởng bền vững',
      en: 'Real users, revenue or sustained long-term growth',
    },
  },
  okay: {
    key: 'okay',
    color: '#d97706',
    dotColor: 'text-amber-500',
    bgPastel: 'bg-amber-50/80',
    borderPastel: 'border-amber-200/70',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    title: {
      vi: 'Ổn định / Tạm dừng (Okay)',
      en: 'Okay / Moderate',
    },
    desc: {
      vi: 'Có lượng truy cập / doanh thu ban đầu nhưng không mở rộng tiếp',
      en: 'Took off or made some money, but paused or plateaued',
    },
  },
  failed: {
    key: 'failed',
    color: '#ef4444',
    dotColor: 'text-rose-500',
    bgPastel: 'bg-rose-50/80',
    borderPastel: 'border-rose-200/70',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-800',
    title: {
      vi: 'Thất bại / Đã đóng (Failed)',
      en: 'Failed / Shelved',
    },
    desc: {
      vi: 'Không có traction hoặc không phù hợp thị trường — để lại bài học lớn',
      en: 'Did not gain traction or no market fit — valuable lessons learned',
    },
  },
  nonprofit: {
    key: 'nonprofit',
    color: '#8b5cf6',
    dotColor: 'text-purple-500',
    bgPastel: 'bg-purple-50/80',
    borderPastel: 'border-purple-200/70',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-800',
    title: {
      vi: 'Công cụ miễn phí / Lab (Free & OSS)',
      en: 'Free Tools / Open Source',
    },
    desc: {
      vi: 'Tiện ích không vì lợi nhuận, phục vụ cộng đồng và thử nghiệm kỹ thuật',
      en: 'Non-profit utilities, free calculators, and community experiments',
    },
  },
  newproj: {
    key: 'newproj',
    color: '#2563eb',
    dotColor: 'text-blue-500',
    bgPastel: 'bg-blue-50/80',
    borderPastel: 'border-blue-200/70',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800',
    title: {
      vi: 'Đang phát triển (New / WIP)',
      en: 'New / In Progress',
    },
    desc: {
      vi: 'Dự án mới khởi chạy gần đây, đang trong giai đoạn hoàn thiện & lắng nghe',
      en: 'Recently launched or currently being built and refined',
    },
  },
};

export const ALL_PROJECTS: Project[] = [
  {
    id: 'evolvetech-finance',
    year: 2026,
    date: '2026-02',
    status: 'success',
    statusLabel: { vi: 'Đang hoạt động', en: 'Active' },
    name: 'EvolveTech Finance Suite',
    url: 'https://www.evolvetech.biz.vn/#tools',
    tagline: {
      vi: 'Nền tảng quản lý tài chính cá nhân toàn diện cho người làm việc tự do',
      en: 'All-in-one personal finance suite tailored for solo workers & freelancers',
    },
    description: {
      vi: 'Hệ thống web app đa năng tích hợp phân tích dòng tiền, tính toán thuế TNCN, quy hoạch bảo hiểm xã hội và mô phỏng kế hoạch độc lập tài chính FIRE.',
      en: 'Web application integrating cash flow analysis, personal income tax rules, social insurance planning, and FIRE retirement simulations.',
    },
    notes: {
      vi: 'Sản phẩm chủ lực hiện tại. Xây dựng độc lập (100% Bootstrapped) bằng Next.js App Router, Tailwind CSS và Recharts. Dữ liệu xử lý hoàn toàn phía Client để bảo mật tuyệt đối.',
      en: 'Current flagship SaaS product. 100% bootstrapped using Next.js App Router, Tailwind CSS, and Recharts with client-side computation for privacy.',
    },
    techStack: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'Recharts'],
    metrics: { vi: 'Flagship Core', en: 'Flagship Core' },
  },
  {
    id: 'thue-tncn-bhxh-2026',
    year: 2026,
    date: '2026-01',
    status: 'nonprofit',
    statusLabel: { vi: 'Công cụ miễn phí', en: 'Free Tool' },
    name: 'Công Cụ Thuế TNCN & BHXH 2026',
    url: 'https://www.evolvetech.biz.vn/#tools',
    tagline: {
      vi: 'Bảng tính tự động thuế thu nhập cá nhân & các mức trích đóng BHXH theo luật mới',
      en: 'Automated personal income tax & social insurance calculator under 2026 laws',
    },
    description: {
      vi: 'Cập nhật chính xác biểu thuế luỹ tiến từng phần, mức giảm trừ gia cảnh 11 triệu / 4.4 triệu và trần đóng BHXH/BHYT/BHTN theo vùng.',
      en: 'Real-time progressive tax brackets, personal/dependent deductions, and statutory regional contribution caps.',
    },
    notes: {
      vi: 'Tạo ra vì bản thân và bạn bè freelancer cần một công cụ tra cứu nhanh không bị chèn quảng cáo phiền toái. Hoạt động offline mượt mà.',
      en: 'Built to solve my own need for a fast, ad-free tax calculation tool for freelance and remote gigs in Vietnam.',
    },
    techStack: ['TypeScript', 'Client-side Math', 'Tailwind CSS'],
    metrics: { vi: '100% Miễn phí', en: '100% Free & Open' },
  },
  {
    id: 'lai-kep-fire-calculator',
    year: 2026,
    date: '2026-01',
    status: 'nonprofit',
    statusLabel: { vi: 'Công cụ miễn phí', en: 'Free Tool' },
    name: 'Bảng Tính Lãi Kép & Lộ Trình FIRE',
    url: 'https://www.evolvetech.biz.vn/#tools',
    tagline: {
      vi: 'Mô phỏng sức mạnh lãi kép và dự báo thời điểm đạt Tự Do Tài Chính',
      en: 'Interactive compound interest simulator & FIRE retirement timeline forecaster',
    },
    description: {
      vi: 'Biểu đồ tương tác trực quan hiển thị vốn gốc so với lợi nhuận sinh sôi qua 10 - 30 năm, kèm quy tắc 4% rút vốn an toàn.',
      en: 'Visual compound growth charts comparing principal vs compounding gains over decades, with the 4% safe withdrawal rule.',
    },
    notes: {
      vi: 'Sử dụng Recharts để vẽ biểu đồ diện tích (AreaChart) trực quan, cho phép người dùng kéo chỉnh số năm và mức lạm phát linh hoạt.',
      en: 'Uses Recharts for smooth reactive area charts allowing users to dynamically tweak return rates, savings rates, and inflation.',
    },
    techStack: ['Recharts', 'SVG', 'Math Engine'],
    metrics: { vi: 'Interactive Chart', en: 'Interactive Chart' },
  },
  {
    id: 'gross-net-salary',
    year: 2026,
    date: '2026-02',
    status: 'nonprofit',
    statusLabel: { vi: 'Công cụ miễn phí', en: 'Free Tool' },
    name: 'Chuyển Đổi Lương Gross ↔ Net 2026',
    url: 'https://www.evolvetech.biz.vn/#tools',
    tagline: {
      vi: 'Quy đổi 2 chiều chính xác giữa lương Gross và Net kèm giải trình chi tiết từng khoản',
      en: 'Bidirectional Gross ↔ Net salary conversion with granular statutory breakdowns',
    },
    description: {
      vi: 'Hỗ trợ tính toán theo mức lương cơ sở mới nhất, hiển thị rõ số tiền người lao động thực nhận và chi phí thực tế người sử dụng lao động chi trả.',
      en: 'Supports both employee take-home pay and employer total cost of employment under current statutory regulations.',
    },
    notes: {
      vi: 'Tích hợp thẳng vào EvolveTech Finance Suite, hoàn toàn chạy trên trình duyệt không gửi dữ liệu lương lên bất kỳ máy chủ nào.',
      en: 'Integrated into EvolveTech suite, zero server logs, completely client-side for maximum salary confidentiality.',
    },
    techStack: ['React 19', 'Form State Engine'],
    metrics: { vi: 'Bảo mật 100%', en: '100% Private' },
  },
  {
    id: 'debt-payoff-snowball',
    year: 2026,
    date: '2026-02',
    status: 'nonprofit',
    statusLabel: { vi: 'Công cụ miễn phí', en: 'Free Tool' },
    name: 'Kế Hoạch Trả Nợ Vay (Snowball / Avalanche)',
    url: 'https://www.evolvetech.biz.vn/#tools',
    tagline: {
      vi: 'So sánh chiến lược trả nợ Quả cầu tuyết và Thác đổ để tối ưu tiền lãi ngân hàng',
      en: 'Compare Debt Snowball vs Avalanche strategies to minimize total bank interest',
    },
    description: {
      vi: 'Giúp người vay hình dung lộ trình thoát nợ nhanh nhất, tính toán chính xác số tháng về đích và số tiền lãi tiết kiệm được.',
      en: 'Helps borrowers map the fastest debt-free path, showing exact months to freedom and thousands saved in interest.',
    },
    notes: {
      vi: 'Lấy cảm hứng từ phương pháp quản lý tài chính của Dave Ramsey nhưng điều chỉnh phù hợp với thực tế vay tiêu dùng và mua nhà tại Việt Nam.',
      en: 'Inspired by proven debt-reduction frameworks adapted specifically for Vietnamese consumer and mortgage lending structures.',
    },
    techStack: ['Amortization Algorithm', 'TypeScript'],
    metrics: { vi: 'Thuật toán tài chính', en: 'Financial Algo' },
  },
  {
    id: 'cho-con-app',
    year: 2025,
    date: '2025-11',
    status: 'success',
    statusLabel: { vi: 'App Store (iOS)', en: 'App Store (iOS)' },
    name: 'Cho Con - Chuẩn Bị Đón Bé',
    url: 'https://www.evolvetech.biz.vn/support',
    appStoreUrl: 'https://apps.apple.com/app/id6743729909',
    tagline: {
      vi: 'Ứng dụng iOS đồng hành cùng ba mẹ chuẩn bị hành trang đón con chào đời',
      en: 'Native iOS parenting app guiding new parents through pregnancy & nursery prep',
    },
    description: {
      vi: 'Sổ tay thông minh giúp theo dõi checklist đồ dùng đi sinh, dự toán chi phí mang thai - sinh nở, và nhật ký những cột mốc phát triển đầu đời của bé.',
      en: 'Smart pregnancy checklist, hospital bag planner, nursery expense budgeting, and baby milestone diary for expecting parents.',
    },
    notes: {
      vi: 'Dự án tôi viết từ tình yêu gia đình khi chuẩn bị đón em bé đầu lòng. Viết thuần Native bằng Swift & SwiftUI, mượt mà và bảo mật dữ liệu tuyệt đối (Local-first). Đã được duyệt lên Apple App Store.',
      en: 'Built with love for my own family when preparing for our first baby. Native iOS with Swift & SwiftUI. Local-first storage, completely ad-free. Officially published on Apple App Store.',
    },
    techStack: ['Swift', 'SwiftUI', 'CoreData / SwiftData', 'iOS 17+'],
    metrics: { vi: 'iOS App Store', en: 'iOS App Store' },
  },
  {
    id: 'evolvetech-studio-v1',
    year: 2025,
    date: '2025-06',
    status: 'okay',
    statusLabel: { vi: 'Đã hợp nhất', en: 'Merged / Pivoted' },
    name: 'EvolveTech Portfolio & Micro-Lab v1',
    url: 'https://www.evolvetech.biz.vn',
    tagline: {
      vi: 'Phiên bản đầu tiên của studio phát triển phần mềm độc lập',
      en: 'First iteration of my independent software studio portfolio',
    },
    description: {
      vi: 'Không gian thử nghiệm các sản phẩm mini, dịch vụ tư vấn giải pháp web và triển khai phần mềm cho khách hàng cá nhân.',
      en: 'Experimental space for micro-products, custom web development consulting, and small client automation systems.',
    },
    notes: {
      vi: 'Giúp tôi tích lũy kinh nghiệm về deployment, SEO và hạ tầng DNS. Sau đó tôi nhận ra cần tập trung vào thương hiệu cá nhân Frank & nền tảng EvolveTech nên đã hợp nhất vào trang hiện tại.',
      en: 'Great learning experience in DNS, CDN edge caching, and personal branding. Subsequently merged and rebranded into Frank @ EvolveTech.',
    },
    techStack: ['Next.js', 'Vercel', 'Tailwind CSS'],
    metrics: { vi: 'Chuyển đổi thành công', en: 'Successfully Pivoted' },
  },
  {
    id: 'telegram-ai-research-bot',
    year: 2025,
    date: '2025-03',
    status: 'okay',
    statusLabel: { vi: 'Nội bộ', en: 'Internal Tool' },
    name: 'Telegram AI News & Summary Bot',
    tagline: {
      vi: 'Bot Telegram tự động tổng hợp tin tức công nghệ và AI hàng ngày',
      en: 'Automated Telegram bot curating and summarizing tech & AI news every morning',
    },
    description: {
      vi: 'Thu thập bài viết từ Hacker News, Product Hunt và các nguồn RSS uy tín, tóm tắt 3 ý chính và gửi vào nhóm Telegram cá nhân lúc 7:00 sáng.',
      en: 'Aggregated feeds from Hacker News, Product Hunt, and niche tech RSS, generating 3-bullet summaries sent daily at 7 AM.',
    },
    notes: {
      vi: 'Chạy ổn định trên VPS nhỏ (Docker + Python + OpenAI API). Tuy nhiên chi phí API định kỳ không kinh tế cho mục đích sử dụng 1 người nên đã chuyển sang dùng script cục bộ.',
      en: 'Worked well on a light VPS. Later replaced by local desktop scripts to avoid recurring cloud server and API fees for personal-only use.',
    },
    techStack: ['Python', 'Telegram Bot API', 'Docker', 'OpenAI'],
    metrics: { vi: 'Tiết kiệm 2h mỗi ngày', en: 'Saved 2h/day' },
  },
  {
    id: 'crypto-alert-bot',
    year: 2024,
    date: '2024-09',
    status: 'failed',
    statusLabel: { vi: 'Đã dừng', en: 'Archived' },
    name: 'On-chain Whale Alert & Price Tracker',
    tagline: {
      vi: 'Hệ thống cảnh báo biến động ví cá mập và biến động thanh khoản',
      en: 'Real-time alert bot tracking whale wallet movements and liquidity pool shifts',
    },
    description: {
      vi: 'Theo dõi các giao dịch lớn trên chuỗi Ethereum/BSC và phát tín hiệu cảnh báo biến động khối lượng bất thường.',
      en: 'Monitored large transaction spikes on EVM chains, alerting when unusual liquidity movements occurred.',
    },
    notes: {
      vi: 'Thất bại vì tốn quá nhiều thời gian bảo trì node RPC, chi phí API webhook cao và thị trường biến động gây nhiều tín hiệu nhiễu. Dự án dừng lại sau 4 tháng nhưng giúp tôi hiểu sâu về WebSocket và Event-driven architecture.',
      en: 'Failed due to high RPC endpoint costs, rate limits, and market noise. Shut down after 4 months, but taught me deep lessons in WebSockets and async queues.',
    },
    techStack: ['Node.js', 'WebSockets', 'Ethers.js', 'Redis'],
    metrics: { vi: 'Bài học kỹ thuật', en: 'Valuable Lesson' },
  },
  {
    id: 'freelance-job-aggregator',
    year: 2024,
    date: '2024-04',
    status: 'failed',
    statusLabel: { vi: 'Đã dừng', en: 'Archived' },
    name: 'Remote VN Job Aggregator',
    tagline: {
      vi: 'Bộ thu thập việc làm Remote dành riêng cho lập trình viên và designer Việt Nam',
      en: 'Remote tech job aggregator specifically filtered for Vietnamese developers',
    },
    description: {
      vi: 'Tự động quét các bản tin tuyển dụng từ Twitter, LinkedIn và các trang remote quốc tế hỗ trợ múi giờ Châu Á (GMT+7).',
      en: 'Scraped remote job listings from Twitter, LinkedIn, and international boards filtered for GMT+7 friendly timezones.',
    },
    notes: {
      vi: 'Dừng hoạt động do chính sách chống crawl dữ liệu ngày càng gắt gao từ các nền tảng lớn, chi phí duy trì proxy xoay vòng vượt quá doanh thu tiềm năng. Quyết định dứt khoát dừng để tập trung vào sản phẩm công cụ tự tạo.',
      en: 'Killed because anti-scraping walls made maintenance unbearable and proxy costs outstripped potential monetization. Decided to focus on self-contained apps instead.',
    },
    techStack: ['Puppeteer', 'Cheerio', 'Express', 'MongoDB'],
    metrics: { vi: 'Dừng kịp thời', en: 'Fail Fast' },
  },
  {
    id: 'hugo-personal-wiki',
    year: 2023,
    date: '2023-08',
    status: 'nonprofit',
    statusLabel: { vi: 'Lưu trữ', en: 'Archived' },
    name: 'Personal Digital Garden & Wiki (Hugo)',
    githubUrl: 'https://github.com/howdoi810-bot',
    tagline: {
      vi: 'Khu vườn tri thức cá nhân lưu trữ ghi chú lập trình và mẹo công nghệ',
      en: 'Personal digital garden and engineering notes built with Hugo static site generator',
    },
    description: {
      vi: 'Trang tĩnh siêu nhẹ viết bằng Markdown, biên dịch bằng Golang Hugo, deploy miễn phí qua GitHub Pages.',
      en: 'Blazing fast static notes site compiled with Hugo and hosted free on GitHub Pages.',
    },
    notes: {
      vi: 'Nơi tôi bắt đầu thói quen viết tài liệu và ghi chú công khai (Learn in public). Nền tảng này sau đó đã thúc đẩy tôi làm trang EvolveTech hiện đại bằng Next.js.',
      en: 'Where I developed my "Learn in public" habit. Served as the ideological precursor to the current EvolveTech site.',
    },
    techStack: ['Hugo', 'Markdown', 'Go Templates', 'GitHub Pages'],
    metrics: { vi: '100% Static', en: '100% Static' },
  },
];

export function getProjectStats() {
  const total = ALL_PROJECTS.length;
  const counts: Record<ProjectStatus, number> = {
    success: 0,
    okay: 0,
    failed: 0,
    nonprofit: 0,
    newproj: 0,
  };

  ALL_PROJECTS.forEach((p) => {
    counts[p.status] = (counts[p.status] || 0) + 1;
  });

  const percentages: Record<ProjectStatus, number> = {
    success: total > 0 ? Math.round((counts.success / total) * 100) : 0,
    okay: total > 0 ? Math.round((counts.okay / total) * 100) : 0,
    failed: total > 0 ? Math.round((counts.failed / total) * 100) : 0,
    nonprofit: total > 0 ? Math.round((counts.nonprofit / total) * 100) : 0,
    newproj: total > 0 ? Math.round((counts.newproj / total) * 100) : 0,
  };

  return {
    total,
    counts,
    percentages,
  };
}

export function getProjectsByYear() {
  const groups = new Map<number, Project[]>();
  ALL_PROJECTS.forEach((p) => {
    if (!groups.has(p.year)) {
      groups.set(p.year, []);
    }
    groups.get(p.year)!.push(p);
  });

  // Sort years descending
  return Array.from(groups.entries()).sort(([a], [b]) => b - a);
}
