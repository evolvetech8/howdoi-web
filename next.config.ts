import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Danh sách dự án đã chuyển vào trang Giới thiệu.
      { source: "/projects", destination: "/gioi-thieu", permanent: true },
    ];
  },
  async headers() {
    // Sổ trả nợ lưu số nợ trong localStorage, mà localStorage dùng chung cho cả tên miền:
    // script bên thứ ba ở BẤT KỲ trang nào cũng đọc được. Vì vậy chặn script, kết nối và khung
    // từ bên ngoài trên toàn trang. Muốn gắn quảng cáo thì phải tách Sổ trả nợ sang tên miền phụ
    // riêng trước (xem MUC-TIEU.md), không nới lỏng chính sách này.
    // Chỉ bật khi build production (chế độ dev của Next cần eval).
    if (process.env.NODE_ENV !== "production") return [];
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self'",
              "connect-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
            ].join("; "),
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

export default nextConfig;
