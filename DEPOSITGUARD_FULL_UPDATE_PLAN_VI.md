# DepositGuard — Kế hoạch cập nhật toàn bộ website

Ngày: 20/11/2026. Trạng thái: đã bắt đầu triển khai local; xem README và OPERATIONS.md để biết cấu hình và giới hạn phát hành. Chưa xác nhận triển khai production.

Mục tiêu: hoàn thiện website đủ tin cậy để thử bán dịch vụ rà soát phương án vay có người hỗ trợ. Giữ công cụ mô phỏng miễn phí; kiểm chứng 3 đơn trả tiền trong 20 khách phù hợp trước khi đầu tư mở rộng. Mục tiêu dài hạn 10–30 triệu đồng/tháng là doanh thu kỳ vọng của chủ dự án, không phải dự báo.

## Bốn tiêu chí của bản cập nhật cuối

- Tin tưởng: người vận hành, phương pháp, giả định, dữ liệu và liên hệ thật.
- Cần thiết/cấp bách: giải thích lý do kiểm tra trước đặt cọc bằng số liệu, không tạo khan hiếm giả.
- Chuyên nghiệp: Navy/Blue nhất quán, mobile dùng được, giá/phạm vi và quy trình rõ.
- Đầu tư dự án: báo cáo, cẩm nang có ngữ cảnh nguồn, cập nhật sản phẩm và xử lý phản hồi.

Trang `/cap-nhat` nằm trong phạm vi. Hero, checklist và gallery đã tồn tại; chỉnh hành vi/nội dung thay vì xây lại toàn bộ.

## 1. Quyết định sản phẩm

- Giữ thương hiệu EvolveTech / DepositGuard và domain www.evolvetech.biz.vn; không chuyển sang HowDoI hoặc xây lại nền tảng. Kế hoạch này thay thế các đề xuất chuyển domain trong tài liệu PLAN cũ.
- Giữ Next.js 15, React 19, TypeScript, Tailwind, Recharts và engine hiện hữu. Chỉ sửa thuật toán khi có lỗi được tái hiện và test chứng minh.
- Khách mục tiêu: hộ gia đình có căn nhà cụ thể, cần vay, dự kiến đặt cọc trong 30–60 ngày.
- Gói pilot: 299.000đ, một hộ gia đình, một căn nhà, tối đa hai đề nghị vay, bản giải thích và buổi trao đổi 30 phút; một lần sửa dữ kiện trong bảy ngày.
- Thời gian giao đề xuất: hai ngày làm việc kể từ khi xác nhận thanh toán và đủ đầu vào. Đây là mặc định để chủ dự án xác nhận khả năng phục vụ trước mở bán.
- Khách gửi yêu cầu trước; người vận hành xác nhận phạm vi rồi mới hướng dẫn chuyển khoản. Chưa xây cổng thanh toán, tài khoản khách, dashboard quản trị riêng, upload hợp đồng, OCR hoặc AI tư vấn.
- Kết quả, cảnh báo, stress test, lịch trả nợ và bản in tự phục vụ tiếp tục miễn phí. Không nhận hoa hồng giới thiệu ngân hàng trong pilot.

## 2. Hiện trạng đã xác minh

Baseline mã nguồn: commit `83664ac1ec6cafc1898af3aafa4cdbb37624e074`. Kết quả kiểm tra: 153 test trong 18 file chạy qua; TypeScript và production build chạy qua. Đây không phải bằng chứng mọi nội dung tài chính trên website đã đúng.

| Ưu tiên | Phát hiện | Việc phải làm |
|---|---|---|
| P0 | Form liên hệ chỉ ghi telemetry rồi báo thành công | API lưu bền vững, trạng thái gửi/lỗi/thử lại đúng thực tế |
| P0 | CTA ví dụ mở kết quả nhưng chưa đặt hasSimulated | Một hàm nạp kịch bản hoàn chỉnh và đánh dấu sẵn sàng |
| P0 | Hero và báo cáo có số viết tay, khác giả định engine | Dùng fixture và hàm tính dùng chung |
| P0 | Trần vay 1,64 tỷ được mô tả ở lãi 12%, trong khi thuộc stress 14% | Hiện đúng kịch bản và kiểm tra riêng khả năng đủ vốn ban đầu |
| P0 | API support/subscribe ghi JSON trong thư mục dự án | Chuyển sang database bền vững; giữ tương thích client cũ |
| P0 | Suite mang tên E2E có import sai và fallback sang reference engine | Import production engine trực tiếp, lỗi phải fail |
| P1 | Chưa có offer, nhận đơn, xác nhận tiền và bàn giao | Bổ sung luồng dịch vụ và sổ vận hành |
| P1 | Telemetry chưa thấy endpoint cấu hình trong repo | Đo funnel tối thiểu, server kiểm tra allowlist |
| P1 | Hồ sơ kiểm thử được gọi là thực tế; claim kỹ thuật quá mạnh | Ghi rõ giả định, công bố người vận hành và phạm vi |

## 3. Cấu trúc trang và trải nghiệm

Navigation chính: Kiểm tra miễn phí, Báo cáo mẫu, Rà soát hồ sơ vay, Cách tính. FAQ, giới thiệu, cẩm nang và chính sách ở footer. Giữ nguyên các URL hỗ trợ ứng dụng đang tồn tại.

| Trang | Nội dung và hành vi sau cập nhật |
|---|---|
| `/` | Hero ngắn, demo, ba lợi ích, cách dùng, mẫu báo cáo, so sánh miễn phí/dịch vụ, người vận hành, FAQ ngắn |
| `/kiem-tra-mua-nha` | Giữ ba bước; giải thích vốn tự có khác tiền cọc; phân biệt tiền mặt, chi phí nhận nhà và quỹ giữ lại |
| `/ket-qua` | Tóm tắt dòng tiền trước/sau ưu đãi, tháng thiếu hụt, dự phòng, giả định; giữ mọi kết quả mở; CTA dịch vụ sau phần điều chỉnh |
| `/bao-cao-mau` | Một hồ sơ giả định nhất quán; phân biệt đầu ra tự động và nhận xét của người hỗ trợ |
| `/ra-soat-ho-so-vay` mới | Một gói 299.000đ; phạm vi, người thực hiện, đầu ra, thời hạn, quy trình, hủy/hoàn và CTA đăng ký |
| `/dang-ky-ra-soat` mới | Form ngắn, đồng ý xử lý yêu cầu, không tự gửi dữ liệu simulator |
| `/dang-ky-ra-soat/hoan-tat` mới | Xác nhận đã nhận yêu cầu và mã tham chiếu; chưa phải đã nhận tiền; noindex |
| `/lien-he` | Form thật, email dự phòng, thông báo lỗi rõ; phân biệt hỗ trợ và dịch vụ |
| `/ve-evolvetech` | Danh tính và kinh nghiệm có thể xác minh; không tự nhận chứng nhận hoặc pháp nhân chưa xác minh |
| `/cach-tinh`, FAQ | Mô hình, giả định, cơ chế lãi thay đổi, giới hạn kết luận, khác biệt với lịch ngân hàng |
| `/bao-mat`, `/dieu-khoan` | Phân biệt dữ liệu tự tính tại thiết bị với thông tin chủ động gửi; thêm điều kiện dịch vụ |

Giữ `/projects`, `/support`, `/privacy`, `/support/cho-con`, `/privacy/cho-con` và các slug cẩm nang. Không redirect hàng loạt về trang chủ.

### Thiết kế và nội dung

- Giữ Be Vietnam Pro và thiết kế Deep Navy #0B1D30 / Royal Blue #1D4ED8–#1E40AF. Emerald, amber và rose chỉ biểu thị kết quả tài chính. Nội dung chính tối thiểu 16px, nút chạm tối thiểu 44px, có focus bàn phím.
- Hero đề xuất: “Khoản vay mua nhà này có vừa sức gia đình bạn?” CTA chính “Kiểm tra miễn phí”, phụ “Xem báo cáo mẫu”.
- Rút trang chủ còn khoảng bảy khối; chuyển infographic dài sang cẩm nang. Không cần thay toàn bộ bộ nhận diện.
- Bỏ thuật ngữ BigInt Oracle, số test cố định và lời hứa sai số tuyệt đối khỏi khu vực bán hàng. Phương pháp kỹ thuật đặt trong trang cách tính.
- Checklist ban đầu không tích sẵn rủi ro. Không gọi ví dụ tổng hợp là khách thật; không tạo testimonial, số khách, đồng hồ đếm ngược hoặc khan hiếm giả.
- Bỏ các khẳng định chung rằng ngân hàng chỉ xét tài sản thế chấp, mọi khoản phí đều bắt buộc, hoặc một tỷ lệ vốn bảo đảm an toàn.
- Trang dịch vụ nói rõ đây là hỗ trợ nhập và diễn giải mô phỏng; không thẩm định pháp lý, định giá, bảo đảm giải ngân hoặc bảo vệ tiền cọc.

## 4. Chuẩn hóa simulator và báo cáo

Tạo `lib/depositguard/examples.ts` làm nguồn fixture dùng chung cho hero, persona và mẫu báo cáo. Hero gọi engine thay vì có công thức tính riêng. Tạo action nạp đầy đủ loan, household, stress, preset và hasSimulated trong một lần; không giữ sót chi phí từ hồ sơ trước.

Khi người dùng đang có hồ sơ cá nhân, mở ví dụ phải hỏi trước khi thay thế. Chỉ lưu phiên làm việc trong sessionStorage; xác thực dữ liệu khi hydrate, không ghi mặc định đè dữ liệu trước khi hydrate xong. Storage bị chặn hoặc JSON hỏng phải quay về trạng thái dùng được. Không đặt thông số tài chính trong URL.

Fixture hồi quy hiện có: nhà 2,5 tỷ, vốn 500 triệu, vay 2 tỷ/240 tháng, gốc đều, lãi 7% trong 12 tháng rồi 12%, thu nhập 55 triệu, chi tiêu 30 triệu, tiền mặt 700 triệu, ngưỡng dự phòng 90 triệu; chi phí khác bằng 0.

| Chỉ tiêu | Giá trị đối chiếu hiện tại |
|---|---:|
| Trả tháng 1 | 20.000.000đ |
| Trả tháng 12 | 19.465.277đ |
| Trả tháng 13 tại 12% | 27.333.333đ |
| Tăng tháng 12 sang 13 | 7.868.056đ |
| Chênh tháng 1 với tháng 13 | 7.333.333đ |
| Trần vay theo dòng tiền tại 12% | 1.829.268.359đ |
| Trần vay khi stress lên 14% | 1.639.344.311đ |

Các con số trên là regression fixture, không hardcode vào giao diện. Trần vay theo dòng tiền không tự chứng minh đủ vốn ban đầu: phải hiện riêng khoản vốn cần thêm và khả năng giữ quỹ dự phòng. Với fixture này, engine trả khả năng đáp ứng vốn hiện có là false.

Sửa tỷ lệ 800 triệu/2,8 tỷ thành giá trị tính thực tế; số lượng khoản chi xuất từ dữ liệu bảng. Phân biệt chi phí, tiền trả bên bán và dự phòng, tránh cộng hai lần. Mẫu không cung cấp điều khoản pháp lý như bảo đảm hoàn cọc.

Với căn hộ giải ngân theo tiến độ, ghi rõ mô hình hiện chỉ mô phỏng khoản vay giải ngân một lần. Không ngầm tuyên bố hỗ trợ lịch giải ngân từng đợt; tính năng đó thuộc giai đoạn sau.

## 5. Luồng dịch vụ và vận hành

1. Khách xem gói và gửi yêu cầu, không thanh toán ngay.
2. Người vận hành kiểm tra phạm vi, phản hồi trong một ngày làm việc; từ chối rõ nếu không phù hợp.
3. Gửi xác nhận giá, đầu việc, người thực hiện, lịch trao đổi, điều kiện hủy/hoàn và thông tin chuyển khoản đã xác minh.
4. Chỉ đánh dấu đã thanh toán sau khi đối chiếu giao dịch thực tế. Ảnh chuyển khoản hoặc thao tác phía client không xác nhận tiền.
5. Khách chủ động cung cấp các giả định cần thiết qua buổi trao đổi hoặc tài liệu đã che danh tính. Không yêu cầu CCCD, đăng nhập ngân hàng, sao kê hay hợp đồng nguyên bản.
6. So sánh tối đa hai đề nghị vay bằng engine; giao bản tóm tắt 2–4 trang và buổi giải thích 30 phút.
7. Ghi nhận ngày giao, thời gian phục vụ, một lần sửa dữ kiện trong bảy ngày và phản hồi hữu ích. Không tự đăng phản hồi của khách.

Báo cáo gồm đầu vào đã xác nhận/chưa rõ, hai phương án, kịch bản biến động, vốn và dự phòng, lựa chọn điều chỉnh, câu hỏi cần hỏi ngân hàng. Bàn giao qua email khách đã xác nhận; không tạo link công khai. Chuẩn bị template báo cáo và checklist đối chiếu số với engine trước khi nhận đơn đầu tiên.

Mặc định chính sách để chủ dự án duyệt trước mở bán: hoàn đủ khi hủy trước khi bắt đầu hoặc bên cung cấp không thể giao theo cam kết; lỗi số liệu được sửa miễn phí. Trường hợp ngoài chính sách được xử lý trực tiếp, không tự động từ chối qua phần mềm. Thời hạn hai ngày làm việc chỉ bắt đầu khi cả thanh toán và đầu vào đã đủ.

## 6. Backend và hợp đồng API

Dùng Supabase Postgres cho lưu trữ và Resend cho email giao dịch. Chưa có hai tích hợp này trong mã hiện tại. Client chỉ gọi Next Route Handlers; service key chỉ ở server. Bật RLS, không cấp quyền đọc/ghi công khai cho bảng khách hàng. [Tài liệu Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security)

Tạo cấu hình offer dùng chung: id, version, tên, giá 299000 VND, phạm vi, SLA, revision window và trạng thái nhận hồ sơ. Server quyết định giá và trạng thái, không tin trường tiền do browser gửi.

| API | Đầu vào và kết quả |
|---|---|
| `POST /api/contact` | submissionId UUID, email, tên tùy chọn, category enum, message, consentVersion; trả mã tiếp nhận sau khi lưu |
| `POST /api/report-requests` | submissionId, offerVersion, email, tên tùy chọn, purchaseWindow enum, hasProperty, hasLoanOffer, need enum, serviceConsent, consentVersion; trả requestCode |
| `POST /api/events` | Event và payload theo allowlist; không nhận free text hoặc đầu vào tài chính |
| `POST /api/support` hiện có | Giữ contract cho app support, thay filesystem bằng adapter database |
| `POST /api/subscribe` hiện có | Giữ contract và deduplicate email; lưu database, không tự thêm người đăng ký dịch vụ vào marketing |

Không có API public liệt kê đơn, đọc dữ liệu khách hay cập nhật thanh toán. Trang hoàn tất đọc mã tiếp nhận từ sessionStorage của tab; truy cập trực tiếp không có mã chỉ hiện hướng dẫn trung lập. Không đưa email hoặc hồ sơ vào query string.

### Xử lý lỗi và chống gửi trùng

- Zod strict schema ở server; body tối đa 16KB; email tối đa 254 ký tự, tên 80, nội dung contact 10–3000. Không có upload trong pilot.
- submissionId tạo một lần cho mỗi lần gửi hợp lệ và giữ khi retry. Unique constraint chống đơn trùng; cùng key khác nội dung trả 409. Giá/offer version đã đổi trả 409 và yêu cầu xem lại gói.
- DB lưu thành công mới trả 201; retry cùng nội dung trả cùng mã. DB lỗi trả 503, không báo thành công. UI giữ nội dung để thử lại.
- Lưu request và notification outbox cùng transaction. Email lỗi không làm mất yêu cầu đã nhận; lời xác nhận chỉ nói đã tiếp nhận, không khẳng định email đã đến hộp thư.
- Honeypot, kiểm tra origin được cấu hình, rate limit bền vững: mặc định 5 lần/form/giờ theo khóa HMAC IP; trả 429 và Retry-After. Không lưu IP nguyên văn trong bảng ứng dụng.
- Không log body, email, nội dung contact hoặc dữ liệu tài chính. Mã lỗi và request ID đủ để chẩn đoán.

### Dữ liệu tối thiểu

| Bảng | Nội dung |
|---|---|
| `report_requests` | UUID, mã tham chiếu ngẫu nhiên, submissionId unique, email/tên, trường phân loại, snapshot offer/giá, consent version/time, status, mốc thời gian, qualification, tiền thực nhận/hoàn và tham chiếu đối soát riêng |
| `contact_messages` | Nội dung người dùng chủ động gửi, nguồn contact/app support, thời điểm và trạng thái xử lý |
| `subscribers` | Email unique, mục đích đăng ký, thời điểm đồng ý; không chia sẻ với báo cáo dịch vụ |
| `notification_outbox` | Request liên quan, template, trạng thái, số lần thử, thời điểm thử tiếp, provider ID |
| `analytics_events` | Event đã lọc, source/campaign allowlist, session ngẫu nhiên ngắn hạn, timestamp server |
| `rate_limit_buckets` | HMAC key, khoảng thời gian và bộ đếm nguyên tử; dọn sau 24 giờ |

Status dịch vụ: requested → awaiting_payment → paid → in_review → delivered; có declined/cancelled/refunded. Chuyển trạng thái do operator thực hiện qua script server có kiểm tra điều kiện, lưu lịch sử thay đổi; không dùng public endpoint. Không nhận đủ tiền thì chưa chuyển paid; tiền thừa hoặc hoàn tiền được đối soát riêng, doanh thu tính theo tiền nhận trừ hoàn.

Email: gửi xác nhận tiếp nhận và báo người vận hành. Resend cần domain gửi đã xác minh. Outbox dùng key cố định cho từng loại thông báo/request; provider hỗ trợ idempotency trong 24 giờ, vì vậy retry sau cửa sổ này phải kiểm tra trạng thái gửi trước, không gửi lại mù. [Gửi email](https://resend.com/docs/dashboard/emails/introduction), [idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys)

Pilot dùng script `ops:notifications` để retry hàng chờ, người vận hành kiểm tra dashboard database mỗi ngày làm việc. Gửi email lần đầu được thử ngay sau persist với timeout giới hạn. Đây là quy trình vận hành có người phụ trách; chưa phụ thuộc cron trả phí hoặc queue mới. Cung cấp script `ops:requests` cho list, accept, mark-paid, start, deliver, cancel và refund, secrets qua environment.

## 7. Quyền riêng tư và đo lường

Thông điệp đúng: “Thông số mô phỏng miễn phí được xử lý trên thiết bị. Khi đăng ký dịch vụ hoặc gửi liên hệ, chúng tôi nhận các thông tin bạn chủ động gửi.” Không hứa toàn website không thu thập dữ liệu sau khi thêm form.

- Không tự gắn hồ sơ mô phỏng với email. Không gửi salary, loan, property price, cashflow, risk status, deficit flag hoặc nội dung form vào analytics.
- Event từ browser: landing_viewed, wizard_started, wizard_completed, sample_viewed, service_viewed, service_cta_clicked. Request nhận thành công ghi phía server; paid/delivered/refunded lấy từ dữ liệu nghiệp vụ.
- Campaign dùng mã cấu hình sẵn; giá trị lạ thành unknown. Không lưu full URL, referrer, search query hoặc trường UTM tự do. Session ID chỉ trong tab, không dùng fingerprint hoặc nối sang danh tính khách.
- Event raw giữ 30 ngày, tổng hợp không định danh 180 ngày. HMAC rate limit giữ tối đa 24 giờ. Contact chưa thành giao dịch dọn sau 90 ngày đóng ticket.
- Không lưu hợp đồng và số liệu hồ sơ trong analytics/database intake. Bản tài chính bàn giao nằm ở kênh riêng đã thống nhất; đề xuất xóa bản làm việc sau 30 ngày kết thúc hỗ trợ. Chứng từ thanh toán phải có lịch lưu riêng do chủ dự án xác nhận, không xóa theo lịch analytics.
- Người dùng có cách yêu cầu xóa qua email; runbook phải bao gồm database, bản làm việc và nhà cung cấp email. Không tuyên bố xóa khỏi backup tức thì nếu chưa hỗ trợ.

Không lấy số click làm bằng chứng doanh thu. Báo cáo pilot ghi khách phù hợp, yêu cầu, chấp nhận giá, tiền nhận, tiền hoàn, hồ sơ giao xong, công phục vụ và nguồn khách. Funnel theo session chỉ là gần đúng, không gọi là số người duy nhất.

## 8. SEO, hiệu năng và tương thích

- Metadata/canonical riêng từng trang; tránh title lặp thương hiệu. Bổ sung trang dịch vụ vào sitemap. Kết quả, intake và trang hoàn tất noindex, không đưa vào sitemap.
- Robots.txt không thay thế kiểm soát truy cập; không dựa vào noindex để bảo vệ dữ liệu khách.
- Chia homepage thành Server Components và các đảo tương tác nhỏ. Lazy-load chart/infographic ngoài màn hình; ảnh có kích thước, alt và không làm dịch bố cục.
- Giữ tương thích sessionStorage v1 bằng hydrate/validate; dữ liệu không hợp lệ được reset có giải thích. Không thay public engine types không cần thiết.
- Kiểm tra 375px, 390px, 768px, desktop; keyboard, focus, error announcements, biểu đồ có bảng thay thế, bản in đọc được.
- Mục tiêu đo trên bản preview: LCP ≤2,5s, CLS ≤0,1; báo điều kiện đo và số liệu thực tế, không coi Lighthouse là bằng chứng trải nghiệm của mọi người dùng.

## 9. Backlog và thứ tự triển khai

Ước lượng 12–18 ngày công kỹ thuật, chưa tính chờ tài khoản, nội dung định danh và phản hồi khách. Triển khai từng PR có thể kiểm tra và rollback.

| Đợt | Công việc | Phụ thuộc | Nghiệm thu |
|---|---|---|---|
| 1 — Nền tảng, 2–3 ngày | Sửa loader/hydration, engine adapter, fixture chung, số liệu và nhãn sai | Không | Session mới mở ví dụ đúng; mẫu khớp engine |
| 2 — UX, 3–4 ngày | Homepage, wizard, results, mẫu, navigation, copy/trust | Đợt 1 | Hoàn tất luồng miễn phí trên mobile; không ép mua |
| 3 — Backend, 3–4 ngày | Migrations, contact/support/subscribe, intake, outbox, ops scripts | Schema và sandbox credentials | DB/email failure và retry được kiểm thử |
| 4 — Dịch vụ, 2–3 ngày | Offer, form, hoàn tất, template báo cáo, điều khoản và runbook | Đợt 2–3, thông tin operator | Chạy thử toàn bộ một hồ sơ giả định |
| 5 — Phát hành, 2–4 ngày | Analytics, browser E2E, SEO, performance, preview, rollout | Đợt 1–4 | Các gate bên dưới qua; nhận đơn thật được bật có chủ đích |

Nhóm file chính: `app/` và `components/depositguard/` cho UI; `lib/depositguard/` cho fixture/state/offer; `lib/server/` cho database/email/validation; `supabase/migrations/` cho schema; `scripts/` cho thao tác dịch vụ; `tests/api`, `tests/integration`, `tests/browser` cho kiểm thử mới. Đây là cấu trúc dự kiến, không phải file đã được tạo.

## 10. Kiểm thử và điều kiện phát hành

Hiện `npm test` chỉ chạy engine/UI. `tests/e2e` là node engine tests, không phải browser tests; adapter sai đường dẫn và có fallback che lỗi. Chuyển chúng thành integration tests trong Vitest, import production engine trực tiếp; reference chỉ làm oracle đối chiếu. Thêm Playwright cho hành trình trình duyệt, không dùng số test marketing làm mục tiêu.

CI clean checkout: npm ci → typecheck → unit/UI/API/integration → production build → browser smoke. Pin runtime và khai báo dependency trực tiếp; không dựa vào jiti tình cờ có trong node_modules. Sửa script lint hiện chưa có toolchain tương ứng trước khi gọi là gate; không để lệnh giả hoạt động trong README.

Các ca nghiệm thu bắt buộc:

- [ ] Hero, persona và báo cáo mẫu mở được khi tab chưa có state; hồ sơ đang nhập không bị ghi đè âm thầm.
- [ ] Refresh, back, reset, session hỏng và storage bị chặn đều có hành vi rõ.
- [ ] Baseline/stress cho đúng số và đúng nhãn; trần vay không bị diễn giải thành bảo đảm đủ tiền mua nhà.
- [ ] Luồng miễn phí không gửi số tiền, giả định hay phân loại rủi ro qua network/URL.
- [ ] Contact/request hợp lệ lưu bền vững; UI chỉ báo tiếp nhận sau response thành công.
- [ ] Double click, timeout và retry không tạo đơn hoặc thông báo trùng; offer đổi được thông báo.
- [ ] DB lỗi không giả success; email lỗi vẫn giữ request và có thể retry từ outbox.
- [ ] Giá/paid giả từ client bị từ chối; không có public read/list/update cho dữ liệu khách.
- [ ] Payload lạ, quá lớn, origin sai và vượt rate limit có response đúng.
- [ ] Analytics reject extra fields và free text ở server; nghiệp vụ thanh toán không dựa browser event.
- [ ] Support/subscribe cũ tiếp tục hoạt động với response tương thích; không còn ghi JSON runtime.
- [ ] Bản in, CTA, lỗi form và bàn phím hoạt động trên mobile/desktop.
- [ ] Một hồ sơ giả định đi hết requested → paid → delivered và một ca hoàn tiền trong sandbox, không gửi khách thật.

## 11. Cấu hình, bàn giao và rollout

Environment server dự kiến: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, MAIL_FROM, SUPPORT_INBOX, RATE_LIMIT_SECRET, APP_ORIGIN, REPORT_SERVICE_ENABLED. Không đưa secret vào NEXT_PUBLIC, repo hay log. Preview và production dùng dữ liệu/tài khoản tách biệt; email preview chỉ gửi tới inbox thử nghiệm được cho phép.

Chủ dự án cần cung cấp trước mở bán: danh tính và mô tả kinh nghiệm đúng thực tế; người thực hiện báo cáo; inbox nhận khách; thông tin nhận tiền đã xác minh; xác nhận thời gian phục vụ và chính sách hủy/hoàn; project database và domain email gửi. Kế hoạch chọn nhà cung cấp, chưa tạo tài khoản hay phát sinh phí. Kiểm tra gói hosting và chi phí thực tế trước dùng cho dịch vụ thu tiền.

Rollout:

1. Lưu deployment ổn định; migrations chỉ thêm bảng/cột, không phá dữ liệu cũ. Nếu có dữ liệu JSON cũ thực sự tồn tại, xuất và nhập một lần có đối soát; không giả định dữ liệu đó đầy đủ.
2. Deploy preview với dịch vụ tắt; chạy các gate và một hồ sơ giả định.
3. Phát hành sửa lỗi và UX miễn phí trước nếu cần. Dịch vụ chưa sẵn sàng phải ghi rõ chưa nhận hồ sơ, không hiện form thành công giả.
4. Khi đủ vận hành, bật REPORT_SERVICE_ENABLED; người vận hành kiểm tra đơn và outbox mỗi ngày làm việc.
5. Có lỗi nhận đơn hoặc sai số liệu thì tắt tiếp nhận mới, giữ dữ liệu đã nhận và xử lý khách đang phục vụ; rollback ứng dụng nếu cần, không xóa database để rollback.

Bàn giao gồm source, migration, .env.example không secrets, báo cáo test, ảnh/video các luồng chính, template báo cáo, hướng dẫn ops, runbook sự cố/hoàn tiền và README đúng cấu hình thực tế. Cập nhật tài liệu cũ đang mô tả Supabase như tích hợp đã tồn tại.

## 12. Kiểm chứng sau phát hành

Trong 30 ngày vận hành, chủ dự án tiếp cận 20 người ngoài người quen có nhà cụ thể và nhu cầu vay trong 30–60 ngày. Thử cùng một gói 299.000đ; ghi lý do từ chối thay vì chỉ hỏi họ có thích website không.

Mốc tiếp tục: ít nhất ba đơn thanh toán thật, đã giao và không hoàn; ghi đầy đủ công phục vụ và nguồn khách. Đây là tín hiệu ban đầu, không phải product–market fit. Nếu chỉ 0–1 đơn sau 20 khách phù hợp, xem lại offer, niềm tin và kênh trước khi mở rộng code.

Ở giá 299.000đ, cần khoảng 34–101 đơn/tháng để đạt 10–30 triệu doanh thu trước chi phí. Giá này dùng để học thị trường; chỉ quyết định giá lâu dài sau khi đo công giao hàng, chi phí tìm khách, hoàn tiền và giá trị khách nhận được. Giai đoạn sau mới cân nhắc thanh toán tự động, quản trị riêng, B2B hoặc ứng dụng di động.
