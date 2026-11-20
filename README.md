# EvolveTech / DepositGuard

Website mô phỏng dòng tiền trước khi đặt cọc mua nhà, với thiết kế Deep Navy / Royal Blue. Công cụ miễn phí chạy tại thiết bị; dịch vụ rà soát có người hỗ trợ được tắt mặc định đến khi cấu hình vận hành đầy đủ.

## Chạy dự án

```sh
npm ci
npm run dev
```

Mở http://localhost:3000. Sao chép `.env.example` thành `.env.local` khi cần kiểm tra backend. Không có database/email thì form báo chưa thể tiếp nhận; không báo thành công giả.

## Kiểm tra

```sh
npm run typecheck
npm test
npm run test:integration
npm run build
npx playwright install chromium
npm run test:browser
```

- Vitest: engine, UI, API và migration PostgreSQL nhúng.
- Integration: 158 ca gọi trực tiếp engine production, không fallback sang reference engine.
- Playwright: desktop/mobile, ví dụ → kết quả, reload, contact retry, privacy và bản in. Contact success dùng mock có chủ đích; kiểm tra email thật là bước riêng trước mở bán.

## Kiến trúc

Next.js 15 / React 19 / TypeScript / Tailwind / Recharts. Các phép tính dùng engine trong `lib/depositguard/engine`. Fixture chung phục vụ trang chủ, demo và báo cáo mẫu. Các API Next gọi Supabase REST bằng key chỉ ở server; Resend gửi thông báo cho operator qua durable outbox.

Các trang dịch vụ: `/ra-soat-ho-so-vay`, `/dang-ky-ra-soat`, `/dang-ky-ra-soat/hoan-tat`. `/cap-nhat` công bố thay đổi của phiên bản đang xem. Các URL support/privacy ứng dụng cũ được giữ lại.

## Vận hành và phát hành

Đọc [OPERATIONS.md](OPERATIONS.md) để áp dụng migration, thiết lập email, xử lý đơn, đối soát thanh toán, retry outbox, dọn dữ liệu và rollback. Template bàn giao ở [scripts/report-template.md](scripts/report-template.md).

Không bật `REPORT_SERVICE_ENABLED` trước khi có người thực hiện được xác minh, phạm vi/chính sách đã xác nhận và hệ thống nhận yêu cầu hoạt động. Không có cổng thanh toán tự động hoặc tài khoản khách trong phiên bản pilot.

Domain dự kiến giữ nguyên https://www.evolvetech.biz.vn/. Những thay đổi local không tự xác nhận đã deploy production.
