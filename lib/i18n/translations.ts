export type Language = 'vi' | 'en';

export interface Translations {
  nav: {
    products: string;
    tools: string;
    allProjects: string;
    writing: string;
    support: string;
    contact: string;
    role: string;
  };
  projects: {
    badge: string;
    title: string;
    views: string;
    updatedDate: string;
    intro: string;
    statsHeading: string;
    filterAll: string;
    searchPlaceholder: string;
    totalProjects: string;
    activeProjects: string;
    successRate: string;
    backToHome: string;
    whatILearned: string;
    openLink: string;
    appStoreBadge: string;
    sourceCode: string;
    noResults: string;
  };
  hero: {
    badge: string;
    titleStart: string;
    titleGradient: string;
    titleEnd: string;
    subtitle: string;
    exploreBtn: string;
    toolsBtn: string;
    stat1Label: string;
    stat2Label: string;
    stat3Label: string;
  };
  products: {
    badge: string;
    title: string;
    subtitle: string;
    product1: {
      type: string;
      title: string;
      description: string;
      status: string;
      cta: string;
      guideLink: string;
    };
    product2: {
      type: string;
      title: string;
      description: string;
      status: string;
      cta: string;
      privacyLink: string;
    };
    lab: {
      title: string;
      desc: string;
      cta: string;
    };
  };
  tools: {
    badge: string;
    title: string;
    subtitle: string;
    tab1: string;
    tab2: string;
    tab3: string;
    tab4: string;
  };
  philosophy: {
    badge: string;
    title: string;
    text: string;
    stackTitle: string;
  };
  support: {
    badge: string;
    title: string;
    subtitle: string;
    emailLabel: string;
    responseLabel: string;
    sectionTitle: string;
    formTitle: string;
    formSubtitle: string;
    selectApp: string;
    nameLabel: string;
    emailInputLabel: string;
    subjectLabel: string;
    detailLabel: string;
    submitBtn: string;
    submitting: string;
    faqTitle: string;
    faqBadge: string;
    privacyLink: string;
  };
  footer: {
    desc: string;
    tagline: string;
    ecosystem: string;
    appstore: string;
    privacyPolicy: string;
    supportCenter: string;
    copyright: string;
  };
}

export const translations: Record<Language, Translations> = {
  vi: {
    nav: {
      products: 'Sản phẩm',
      tools: 'Công cụ tính',
      allProjects: 'Tất cả dự án',
      writing: 'Bài viết',
      support: 'Hỗ trợ App',
      contact: 'Gửi thư cho Archonic',
      role: 'Indie Maker',
    },
    projects: {
      badge: 'Bản Thống Kê Dự Án • Indie Resume',
      title: 'Tất cả các dự án tôi từng làm',
      views: '12,480 lượt xem',
      updatedDate: 'Cập nhật tháng 3, 2026',
      intro:
        'Dưới đây là danh sách toàn bộ các website, ứng dụng iOS, công cụ micro-SaaS và thử nghiệm cá nhân mà tôi từng xây dựng. Là một solo maker, tôi thích lưu trữ lại hành trình này như một cuốn portfolio chân thực nhất. Nó phản ánh đúng bản chất của Indie Hacking: tỷ lệ thất bại rất cao, nhưng mỗi lần bấm nút Ship là một lần trưởng thành vượt bậc.',
      statsHeading: 'Tỷ lệ phân bổ & Trạng thái dự án',
      filterAll: 'Tất cả',
      searchPlaceholder: 'Tìm kiếm dự án theo tên, công nghệ, hoặc từ khóa...',
      totalProjects: 'Tổng dự án',
      activeProjects: 'Đang hoạt động',
      successRate: 'Tỷ lệ thành công',
      backToHome: '← Về trang chủ',
      whatILearned: 'Ghi chú & Bài học:',
      openLink: 'Truy cập sản phẩm',
      appStoreBadge: 'Apple App Store',
      sourceCode: 'Mã nguồn',
      noResults: 'Không tìm thấy dự án phù hợp với bộ lọc.',
    },
    hero: {
      badge: 'Archonic • Lập trình viên độc lập',
      titleStart: 'Tự thiết kế, lập trình & phát hành',
      titleGradient: 'phần mềm hữu ích',
      titleEnd: 'cho cuộc sống hàng ngày.',
      subtitle:
        'Chào bạn, tôi là Archonic. Tôi tự tay lập trình và vận hành các ứng dụng di động & công cụ web độc lập. Không nhà đầu tư, không bộ máy cồng kềnh — chỉ tập trung giải quyết đúng vấn đề và mang lại giá trị thực tế cho người dùng.',
      exploreBtn: 'Xem các sản phẩm đã phát hành',
      toolsBtn: 'Dùng thử bộ công cụ miễn phí',
      stat1Label: 'Tự thân phát triển',
      stat2Label: 'Đa nền tảng',
      stat3Label: 'Bảo mật & Ưu tiên Offline',
    },
    products: {
      badge: 'Danh Mục Sản Phẩm',
      title: 'Các Ứng Dụng Đã & Đang Xây Dựng',
      subtitle: 'Mỗi sản phẩm đều xuất phát từ một nhu cầu thực tế và được trau chuốt tỉ mỉ.',
      product1: {
        type: 'Web App • evolvetech.biz.vn',
        title: 'EvolveTech Finance Suite',
        description:
          'Bộ công cụ tính toán tài chính cá nhân dành cho người Việt: mô phỏng lãi kép với biểu đồ tăng trưởng, chuyển đổi lương Gross sang Net chuẩn luật 2026, lập ngân sách 50/30/20 và tính toán vay ngân hàng.',
        status: '🟢 Đang hoạt động • Web miễn phí',
        cta: 'Dùng ngay bên dưới',
        guideLink: 'Đọc cẩm nang tài chính',
      },
      product2: {
        type: 'Ứng dụng Di động & Tiện ích',
        title: 'Ứng Dụng Cá Nhân & Micro-Tools',
        description:
          'Các ứng dụng di động iOS bản địa (Native iOS) và công cụ tiện ích hỗ trợ năng suất cá nhân, quản lý công việc và cuộc sống theo triết lý tinh gọn, ưu tiên lưu trữ offline và bảo vệ quyền riêng tư 100%.',
        status: '⚡ Đang phát triển • iOS & Web',
        cta: 'Hỗ Trợ Ứng Dụng (Support Portal)',
        privacyLink: 'Chính sách bảo mật',
      },
      lab: {
        title: 'Đang ấp ủ sản phẩm tiếp theo...',
        desc: 'Thử nghiệm các tiện ích AI và micro-tools hỗ trợ năng suất cá nhân.',
        cta: 'Đề xuất ý tưởng cho Archonic →',
      },
    },
    tools: {
      badge: 'Công Cụ Tương Tác',
      title: 'Bộ Công Cụ Tính Toán Miễn Phí',
      subtitle: 'Một phần trong hệ sinh thái sản phẩm EvolveTech. Chọn công cụ để tính toán ngay:',
      tab1: 'Lãi Kép & Tích Lũy',
      tab2: 'Lương Gross - Net',
      tab3: 'Ngân Sách 50/30/20',
      tab4: 'Vay Mua Nhà / Xe',
    },
    philosophy: {
      badge: 'Triết Lý Solo Maker',
      title: 'Tại sao tôi chọn con đường Solo Indie Developer?',
      text:
        'Tôi tin vào sức mạnh của sự tinh gọn. Khi một kỹ sư làm chủ toàn bộ quy trình từ ý tưởng, thiết kế UI/UX, viết code front-end/back-end đến hỗ trợ người dùng, sản phẩm sẽ được tạo ra với sự thấu hiểu sâu sắc nhất mà không bị phân mảnh qua các tầng họp hành báo cáo.',
      stackTitle: 'Vũ Khí Công Nghệ (Tech Stack Của Archonic)',
    },
    support: {
      badge: 'Cổng Hỗ Trợ Chính Thức Apple App Store',
      title: 'Trung Tâm Hỗ Trợ Ứng Dụng Di Động',
      subtitle:
        'Trang hỗ trợ chính thức cho tất cả các ứng dụng trên hệ sinh thái iOS của Archonic & EvolveTech. Chúng tôi luôn ở đây để giúp bạn có trải nghiệm tốt nhất.',
      emailLabel: 'Email',
      responseLabel: 'Thời gian phản hồi: Trong 24 giờ',
      sectionTitle: 'Các Ứng Dụng Được Hỗ Trợ',
      formTitle: 'Tiếp Nhận Yêu Cầu Hỗ Trợ Kỹ Thuật',
      formSubtitle:
        'Bạn gặp sự cố, lỗi hiển thị hoặc muốn đề xuất cải tiến cho ứng dụng? Hãy điền thông tin bên dưới:',
      selectApp: 'Ứng dụng bạn cần hỗ trợ',
      nameLabel: 'Tên của bạn (Tùy chọn)',
      emailInputLabel: 'Địa chỉ Email nhận phản hồi',
      subjectLabel: 'Vấn đề cần hỗ trợ',
      detailLabel: 'Nội dung chi tiết',
      submitBtn: 'Gửi yêu cầu hỗ trợ',
      submitting: 'Đang gửi yêu cầu...',
      faqTitle: 'Câu Hỏi Thường Gặp Chung Cho Các Ứng Dụng',
      faqBadge: 'Giải Đáp Nhanh',
      privacyLink: 'Chính Sách Quyền Riêng Tư Chung (Privacy Policy)',
    },
    footer: {
      desc: 'Xây dựng các ứng dụng di động và công cụ web tinh gọn, giải quyết các nhu cầu thiết thực trong cuộc sống với tinh thần tự do và độc lập.',
      tagline: 'Based in Vietnam • Crafting for the world',
      ecosystem: 'Hệ Sinh Thái',
      appstore: 'Apple App Store',
      privacyPolicy: 'Quyền riêng tư (Privacy Policy)',
      supportCenter: 'Trung tâm Hỗ trợ (Support URL)',
      copyright: 'All rights reserved.',
    },
  },
  en: {
    nav: {
      products: 'Products',
      tools: 'Free Tools',
      allProjects: 'All Projects',
      writing: 'Writing',
      support: 'App Support',
      contact: 'Email Archonic',
      role: 'Indie Maker',
    },
    projects: {
      badge: 'Project Scoreboard • Indie Resume',
      title: 'List of all my projects ever',
      views: '12,480 views',
      updatedDate: 'Updated March, 2026',
      intro:
        "Here is a comprehensive list of all web apps, iOS applications, micro-tools, and side experiments I have ever built. As a solo maker, I track this journey as an honest, unfiltered resume. It showcases the reality of indie hacking: high failure rate, but every project shipped is a massive leap forward in learning and craftsmanship.",
      statsHeading: 'Status Distribution & Breakdown',
      filterAll: 'All',
      searchPlaceholder: 'Search projects by name, technology, or keywords...',
      totalProjects: 'Total Projects',
      activeProjects: 'Active Projects',
      successRate: 'Success Rate',
      backToHome: '← Back to Home',
      whatILearned: 'Notes & Post-Mortem:',
      openLink: 'Visit Project',
      appStoreBadge: 'Apple App Store',
      sourceCode: 'Source Code',
      noResults: 'No projects match your current filter.',
    },
    hero: {
      badge: 'Archonic • Solo Indie Developer',
      titleStart: 'I design, code & ship',
      titleGradient: 'useful software',
      titleEnd: 'for everyday life.',
      subtitle:
        "Hi, I'm Archonic. I build and operate independent mobile apps and web tools. No venture capital, no corporate bloat — just laser-focused on solving real problems and delivering genuine value to users.",
      exploreBtn: 'Explore Shipped Products',
      toolsBtn: 'Try Free Financial Tools',
      stat1Label: 'Solo Bootstrapped',
      stat2Label: 'Cross-Platform',
      stat3Label: 'Privacy & Offline',
    },
    products: {
      badge: 'Product Portfolio',
      title: 'Built & In-Progress Software',
      subtitle: 'Every product is born from a real-life need and carefully crafted.',
      product1: {
        type: 'Web App • evolvetech.biz.vn',
        title: 'EvolveTech Finance Suite',
        description:
          'Personal finance calculations made simple: interactive compound interest projections, Vietnamese 2026 Gross-to-Net salary converter, 50/30/20 budget planner, and bank loan amortization.',
        status: '🟢 Live • Free Web Platform',
        cta: 'Launch Tools Below',
        guideLink: 'Read Finance Guides',
      },
      product2: {
        type: 'Mobile & Productivity Lab',
        title: 'Personal Apps & Micro-Tools',
        description:
          'Native iOS mobile apps and productivity micro-tools designed around minimalism, local offline-first storage, and 100% privacy with zero ad trackers.',
        status: '⚡ In Development • iOS & Web',
        cta: 'App Support Portal',
        privacyLink: 'Privacy Policy',
      },
      lab: {
        title: "What's next? Cooking up the next tool...",
        desc: 'Experimenting with AI utilities and solo developer productivity tools.',
        cta: 'Suggest an idea to Archonic →',
      },
    },
    tools: {
      badge: 'Interactive Tools',
      title: 'Free Interactive Calculators',
      subtitle: 'Part of the EvolveTech software ecosystem. Choose a tool to calculate instantly:',
      tab1: 'Compound Interest',
      tab2: 'Gross to Net Salary',
      tab3: '50/30/20 Budget',
      tab4: 'Mortgage & Loan',
    },
    philosophy: {
      badge: 'Indie Dev Philosophy',
      title: 'Why I Chose The Solo Indie Path',
      text:
        'I believe in the power of extreme minimalism. When one software engineer owns the entire product lifecycle — from ideation, UX design, full-stack code to customer support — products are built with deep empathy and ship without bureaucracy.',
      stackTitle: "Archonic's Weapon of Choice (Tech Stack)",
    },
    support: {
      badge: 'Apple App Store Official Support Portal',
      title: 'Mobile App Support Center',
      subtitle:
        'Official support portal for all iOS applications developed by Archonic & EvolveTech. We are always here to ensure you have a seamless experience.',
      emailLabel: 'Direct Email',
      responseLabel: 'Response Time: Within 24 Hours',
      sectionTitle: 'Supported Applications',
      formTitle: 'Submit a Support Ticket',
      formSubtitle:
        'Encountered a bug, crash, or want to suggest a new feature? Send your message below:',
      selectApp: 'Select Application',
      nameLabel: 'Your Name (Optional)',
      emailInputLabel: 'Email Address for Reply',
      subjectLabel: 'Support Category',
      detailLabel: 'Detailed Message',
      submitBtn: 'Send Support Request',
      submitting: 'Submitting request...',
      faqTitle: 'Frequently Asked Questions Across All Apps',
      faqBadge: 'Quick Answers',
      privacyLink: 'Universal Privacy Policy',
    },
    footer: {
      desc: 'Crafting focused mobile apps and web utilities that solve practical life problems with independence and care.',
      tagline: 'Based in Vietnam • Crafting for the world',
      ecosystem: 'Ecosystem',
      appstore: 'Apple App Store',
      privacyPolicy: 'Privacy Policy',
      supportCenter: 'Support Center',
      copyright: 'All rights reserved.',
    },
  },
};
