# HowDoI (howdoi.id.vn)

> Làm sao để hết nợ? Từng tháng một.

HowDoI là sổ trả nợ trên web cho người Việt đang gánh nợ: lập sổ, biết ngày hết nợ, mỗi tháng ghi sổ một lần. Số liệu chỉ lưu trên máy người dùng. Mục tiêu, lộ trình và những việc **không** làm: xem [`MUC-TIEU.md`](MUC-TIEU.md).

| Phần | Đường dẫn |
| --- | --- |
| **Sổ trả nợ** (sản phẩm chính) | `/so-tra-no` |
| So sánh cách trả nợ (quả cầu tuyết / tuyết lở) | `/cong-cu/ke-hoach-tra-no` |
| Lương Gross ↔ Net | `/cong-cu/luong-gross-net` |
| Lãi kép & tích lũy | `/cong-cu/lai-kep` |
| Vay mua nhà / xe | `/cong-cu/tinh-lai-vay` |
| Ngân sách 50/30/20 & 6 chiếc lọ | `/cong-cu/ngan-sach-50-30-20` |

`/support` và `/privacy` (cùng `/support/cho-con`, `/privacy/cho-con`) là Support URL và Privacy Policy URL của ứng dụng iOS trên App Store. **Không đổi hay xóa các đường dẫn này.**

## Cấu trúc

- `app/` — các trang (Next.js 15 App Router). `app/sitemap.ts` và `app/robots.ts` tự sinh `/sitemap.xml`, `/robots.txt`.
- `lib/debt-plan.ts` — logic Sổ trả nợ: lưu trên máy (localStorage), ghi sổ hằng tháng, hoàn tác, sao lưu/khôi phục, tệp nhắc lịch `.ics`. Giao diện ở `components/plan/`.
- `next.config.ts` — chính sách bảo mật (CSP) chặn mọi script bên ngoài trên toàn trang, vì `localStorage` của Sổ trả nợ dùng chung cho cả tên miền. Đọc mục Tiền trong `MUC-TIEU.md` trước khi thêm bất kỳ script nào.
- `lib/finance-math.ts` — toàn bộ công thức tính. Số liệu pháp lý (giảm trừ gia cảnh, biểu thuế, lương cơ sở, lương tối thiểu vùng) nằm trong `SALARY_RULES`.
- `lib/site.ts` — tên trang, khẩu hiệu, email liên hệ.
- `content/tools.ts` — danh sách cụm chủ đề và công cụ (dùng cho trang chủ, menu, sitemap).
- `content/guides-data.ts` — bài hướng dẫn.

## Khi luật thay đổi

1. Sửa con số trong `SALARY_RULES` (`lib/finance-math.ts`), cập nhật `sources` và `updatedAt`.
2. Đổi `updatedAt` của công cụ trong `content/tools.ts`.
3. Rà các bài hướng dẫn có nhắc đến con số cũ và đổi `updatedAt` của bài.

## Thêm bài hướng dẫn mới

Thêm một mục vào `GUIDES` trong `content/guides-data.ts`: chọn `topic` (cụm chủ đề), `relatedTool` (công cụ đi kèm), ghi `sources` nếu bài có số liệu pháp lý. Bài sẽ tự xuất hiện ở trang chủ, trang Hướng dẫn, trang công cụ liên quan và sitemap.

## Chạy trên máy

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # kiểm tra trước khi triển khai
```

## Google Search Console

Xác minh tên miền `howdoi.id.vn` bằng bản ghi DNS (khuyên dùng), hoặc đặt biến môi trường `GOOGLE_SITE_VERIFICATION` bằng mã xác minh để trang tự thêm thẻ meta. Sau đó gửi sitemap: `https://www.howdoi.id.vn/sitemap.xml` (trang chạy trên Vercel, tên miền chính là `www`; `howdoi.id.vn` tự chuyển sang `www`).
