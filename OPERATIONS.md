# DepositGuard vận hành phiên bản 2

## Production đang tạm dừng nhận hồ sơ trả phí

Bản phát hành ngày 20/11/2026 khóa tiếp nhận khi `VERCEL_ENV=production`, ngay cả khi biến `REPORT_SERVICE_ENABLED` đã được bật từ trước. Trang dịch vụ vẫn công khai nhưng không hiện form nhận đơn; API nhận hồ sơ trả phí trả 503 trước khi lưu dữ liệu. Chỉ gỡ khóa trong `lib/server/config.ts` khi chủ dự án yêu cầu mở lại và các điều kiện vận hành bên dưới đã hoàn tất.

## Thiết lập

1. Tạo Supabase project và áp dụng `supabase/migrations/202611200001_intake.sql` bằng SQL Editor/migration tooling. Không mở RLS cho anon/authenticated. Migrations phải được chạy ở sandbox trước production.
2. Điền biến trong `.env.example` vào `.env.local` khi chạy local và cấu hình Vercel server env cho production. APP_ORIGIN phải khớp chính xác origin đang phục vụ, không có dấu `/` cuối. Không đưa service role key ra client.
3. Xác minh domain gửi trong Resend, cấu hình MAIL_FROM và SUPPORT_INBOX. Thông báo tự động chỉ chứa mã tiếp nhận, không chứa nội dung hồ sơ. Khách nhận xác nhận trên website; operator trả lời email sau khi xem yêu cầu trong Supabase.
4. OPERATOR_NAME/BIO phải là thông tin được xác minh. Chỉ đặt SERVICE_TERMS_CONFIRMED=true và REPORT_SERVICE_ENABLED=true sau khi người thực hiện xác nhận gói, khả năng giao hai ngày làm việc, hủy/hoàn và thông tin nhận tiền. Chưa có thông tin thì dịch vụ tiếp tục tắt.
5. ANALYTICS_ENABLED mặc định false; bật sau migration và khi đã bố trí dọn dữ liệu. API chỉ nhận event allowlist, không nhận nội dung simulator.

## Công việc mỗi ngày làm việc

Đọc bảng intake_requests bằng tài khoản Supabase của operator. Không công khai dashboard hoặc export chứa email. Phản hồi yêu cầu trong một ngày làm việc. Dùng `scripts/report-template.md` và in kết quả engine để soạn báo cáo; chưa có OCR hay tự động xử lý tài liệu.

CLI đọc secrets từ environment; ví dụ nạp env an toàn bằng Node:

```sh
node --env-file=.env.local --import tsx scripts/ops.ts list
node --env-file=.env.local --import tsx scripts/ops.ts notifications
node --env-file=.env.local --import tsx scripts/ops.ts cleanup
node --env-file=.env.local --import tsx scripts/ops.ts accept DG-CODE
node --env-file=.env.local --import tsx scripts/ops.ts mark-paid DG-CODE 299000 BANK_REFERENCE
node --env-file=.env.local --import tsx scripts/ops.ts start DG-CODE
node --env-file=.env.local --import tsx scripts/ops.ts deliver DG-CODE
node --env-file=.env.local --import tsx scripts/ops.ts refund DG-CODE 299000 REFUND_REFERENCE
```

Không đánh dấu paid từ ảnh chuyển khoản. CLI chỉ cho nhận đúng giá; thiếu/thừa tiền cần đối soát trực tiếp trước khi đánh dấu. Không nhận tiền khi chưa xác nhận người thực hiện và phạm vi. Chỉ deliver sau khi đã giao thật.

Outbox có lease và key chống trùng. Pending được retry; sau năm lần hoặc 23 giờ sẽ chuyển manual_review. Kiểm tra Resend trước khi xử lý manual_review; không reset rồi gửi lại mù vì khóa idempotency của provider có thời hạn. Database lưu xong vẫn trả mã tiếp nhận dù email lỗi.

Run cleanup hàng ngày; analytics thô được xóa sau 30 ngày, rate buckets sau 24 giờ. Với contact/support đã xử lý, đánh dấu status=cancelled và updated_at=now() trong dashboard để bắt đầu hạn 90 ngày. Chứng từ và hồ sơ dịch vụ không bị cleanup tự động; xác nhận lịch lưu riêng trước mở bán. Thực hiện yêu cầu xóa qua database, email và bản làm việc; không hứa xóa tức thì khỏi backup nhà cung cấp.

## Pilot và rollback

Theo dõi 20 khách phù hợp (nhà cụ thể, cần vay, đặt cọc 30–60 ngày), số khách chấp nhận giá, paid/delivered/refunded, công phục vụ và nguồn khách. Dữ liệu analytics là lượt event, không phải người duy nhất; chưa có quy kết campaign tự động. Mốc ba đơn thực nhận và giao xong chỉ là tín hiệu thử nghiệm.

Nếu API lưu lỗi, tắt REPORT_SERVICE_ENABLED, giữ dữ liệu đã nhận và liên hệ khách đang phục vụ. Rollback Vercel deployment không xóa database. Preview không được dùng credentials production hoặc gửi email khách thật.

## Bằng chứng phát hành

`npm run typecheck`, `npm test`, `npm run test:integration`, `npm run build`, `npm run test:browser`. Browser tests mock phản hồi contact, còn database tests chạy PostgreSQL nhúng; chúng không chứng minh email Resend đã đến inbox production. Trước bật bán cần chạy một hồ sơ sandbox với Supabase/Resend thật và kiểm tra inbox.

User test với năm người thuộc nhóm mục tiêu chưa được thực hiện bởi automated tests. Cần kiểm tra họ tìm được người vận hành/phương pháp, hiểu lý do kiểm tra trước đặt cọc, hoàn tất mô phỏng và nhận ra giá trị báo cáo/cẩm nang.

### Kiểm tra tốc độ trên máy kiểm soát

CI dùng runner chia sẻ nên luôn kiểm tra đủ 24 kịch bản và 100 lần đổi trạng thái, nhưng không áp ngưỡng thời gian phụ thuộc phần cứng. Để kiểm tra riêng ngân sách 2 ms cho engine và 35 ms cho một lần đổi trạng thái trên máy benchmark không chạy tác vụ khác:

```sh
RUN_PERFORMANCE_ASSERTIONS=true npx vitest run tests/ui/challenger-reactivity-stress.test.tsx --maxWorkers=1
```
