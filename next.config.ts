import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Danh sách dự án đã chuyển vào trang Giới thiệu.
      { source: "/projects", destination: "/gioi-thieu#du-an", permanent: true },
    ];
  },
};

export default nextConfig;
