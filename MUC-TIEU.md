# Mục tiêu của HowDoI

> Đọc lại file này mỗi khi thấy mất phương hướng, hoặc khi có ý tưởng mới muốn làm ngay.
> Lập lại ngày 13/10/2026 theo định hướng mới. Xem lại mỗi quý.

## Một câu

**HowDoI là sổ trả nợ trên web cho người Việt đang gánh nợ: biết ngày hết nợ, mỗi tháng ghi sổ một lần, từng tháng một tiến tới ngày đó.**

Khẩu hiệu: *Làm sao để hết nợ? Từng tháng một.*

Ba điều không bao giờ đổi:

1. **Số nợ của người dùng chỉ nằm trên máy họ.** Không tài khoản, không máy chủ lưu số liệu, không hỏi số điện thoại.
2. **HowDoI không cho vay và không quảng cáo khoản vay**, thẻ tín dụng hay ví trả sau.
3. **Không trách móc.** Tháng nào trả ít hơn, sổ tự điều chỉnh. Ghi sổ thật quan trọng hơn trả đẹp.

## Vì sao là hướng này

Đây là những gì bạn đã chọn (13/10/2026):

- Bạn thích tài chính, không muốn trang giống portfolio cá nhân.
- Bạn muốn trang trở thành **ứng dụng tài chính trên web**, nơi người dùng quay lại, không chỉ là vài công cụ tính dùng một lần.
- Thu nhập từ **affiliate và quảng cáo**.
- Người dùng chính: **người đang gánh nợ**.

Người đang trả nợ trả theo tháng. Vì vậy vòng lặp tự nhiên của họ cũng là một tháng: sau ngày lương, mở sổ, ghi số đã trả, thấy ngày hết nợ đến gần hơn. Đó là lý do để quay lại, và là thứ một người làm một mình duy trì được.

## Phục vụ ai

| Ưu tiên | Ai | Họ cần gì |
| --- | --- | --- |
| 1 | Người đi làm, lương khoảng 8–25 triệu, có 2–5 khoản nợ cùng lúc (thẻ tín dụng, vay công ty tài chính, trả góp, ví trả sau), vẫn trả đúng hạn nhưng thấy bế tắc | Một kế hoạch rõ ràng và ngày hết nợ |
| 2 | Người không đủ tiền trả mức tối thiểu, đang “vay chỗ này đắp chỗ kia” | Biết còn thiếu bao nhiêu, việc cần làm trước, không bị gợi ý vay thêm |
| 3 | Người sợ nợ xấu (CIC) hoặc bị đòi nợ | Thông tin chính xác, có nguồn, rồi một kế hoạch |
| 4 | Người nợ người thân (không lãi nhưng nặng lòng) | Đưa khoản đó vào cùng một sổ |

**Không nhắm tới:** người đang tìm chỗ vay thêm (“nợ xấu vay ở đâu”, “app vay tiền nhanh”). Họ đã là mục tiêu của bên cho vay.

## Sản phẩm đang có

| Phần | Đường dẫn | Vai trò |
| --- | --- | --- |
| **Sổ trả nợ** | `/so-tra-no` | Sản phẩm chính: lập sổ, “tháng này trả gì”, ghi sổ hằng tháng, nhắc lịch (.ics), sao lưu và khôi phục |
| So sánh cách trả nợ | `/cong-cu/ke-hoach-tra-no` | Cửa vào từ Google, có nút “Lưu thành sổ trả nợ” |
| Các công cụ khác (Gross ↔ Net, lãi kép, vay mua nhà, ngân sách) | `/cong-cu` | Phụ trợ: kéo traffic, chỗ đặt quảng cáo sau này |
| Bài hướng dẫn | `/huong-dan` | Từ giờ ưu tiên chủ đề nợ |
| Hỗ trợ và quyền riêng tư app Cho Con | `/support`, `/privacy`, `/support/cho-con`, `/privacy/cho-con` | **Không đổi, không xóa đường dẫn.** Apple cần chúng |

## Tuần này (13–18/10): đưa lên trước khi làm thêm

1. Merge PR [evolvetech8/howdoi-web#1](https://github.com/evolvetech8/howdoi-web/pull/1) vào `main`, chờ Vercel build xong.
2. Mở thử `https://www.howdoi.id.vn/so-tra-no` trên **iPhone thật**: lập sổ, bấm “Thêm vào lịch”, tải tệp sao lưu, sao chép link khôi phục rồi mở lại. Thử cả “Thêm vào MH chính”: biểu tượng đó có bộ nhớ riêng nên mở ra là sổ trống, đó là bình thường; mở tệp sao lưu trong đó để chuyển sổ sang.
3. Kiểm tra `/support`, `/privacy`, `/support/cho-con`, `/privacy/cho-con` vẫn mở được, và gửi thử một email hỗ trợ từ nút “Soạn email hỗ trợ”.
4. Xác minh tên miền trong Google Search Console (Domain property, qua DNS) và gửi `https://www.howdoi.id.vn/sitemap.xml`.

## Đo cái gì

- **Chỉ số quan trọng nhất:** số khoản nợ người dùng đã xóa sổ.
- **Chỉ số chứng minh đây là ứng dụng:** trong số người lưu sổ tháng này, bao nhiêu phần trăm quay lại ghi sổ tháng sau.
- **Doanh thu không phải chỉ số trong 9–12 tháng đầu.** Kỳ vọng gần bằng 0 trong thời gian này là bình thường.

Hiện trang chưa đo gì. Khi thêm đo lường, chỉ đếm sự kiện, không bao giờ gửi số tiền hay tên khoản nợ:

- `plan_created` (chỉ lần lưu sổ đầu tiên), `reminder_added`, `backup_made`, `debt_cleared`;
- `checkin` kèm **tháng thứ mấy của sổ** (1, 2, 3+), tính ngay trên máy từ tháng bắt đầu của sổ. GoatCounter không có thuộc tính thì ghi vào tên sự kiện, ví dụ `checkin-thang-2`.

Tỉ lệ quay lại tháng thứ hai ≈ số `checkin` tháng thứ 2 trong tháng M+1 chia cho số `plan_created` trong tháng M.

Cách gắn đo lường mà vẫn giữ lời hứa riêng tư:

- Dùng Umami hoặc GoatCounter (sự kiện tùy chỉnh của Vercel Web Analytics cần gói Pro).
- Cả script **và** điểm nhận sự kiện phải nằm trên cùng tên miền (ví dụ rewrite `/api/send` sang máy chủ đo lường), vì chính sách bảo mật của trang chặn script và kết nối ra bên ngoài (xem mục Tiền).
- Nếu dùng Umami: bắt buộc gắn `data-exclude-hash="true"` và `data-exclude-search="true"` vào thẻ script. Mặc định Umami gửi cả phần sau dấu `#`, tức là toàn bộ link khôi phục chứa số nợ.

## Các mốc

| Mốc | Việc phải xong | Dấu hiệu đi đúng |
| --- | --- | --- |
| **30/11/2026** | Đo lường đếm sự kiện. Máy tính “Trả tối thiểu thẻ tín dụng” (cửa vào từ Google, có nút đưa khoản nợ vào sổ). 2 bài về nợ. | Có người lưu sổ thật. |
| **31/01/2027** | Tổng 6 bài về nợ, gồm bài thưởng Tết đăng đầu tháng 1. | Người lưu sổ tháng 12 quay lại ghi sổ sau ngày lương tháng 1. |
| **31/03/2027 (cổng kiểm tra)** | Đánh giá vòng lặp. | Ước tính ban đầu: khoảng 20–25% sổ được ghi lại ở tháng thứ hai. Nếu thấp hơn nhiều, **sửa vòng lặp trước khi viết thêm**. |
| **30/09/2027** | Khoảng 25 bài về nợ. Bật thu nhập đầu tiên theo đúng quy tắc ở mục Tiền. | Có lượt nhấp từ Google mỗi ngày và các khoản nợ được xóa sổ đều đặn. |

Các con số % là ước đoán để bắt đầu, không phải chuẩn ngành. Có số liệu thật thì đặt lại.

## 12 tuần tới

Mỗi tuần làm **một** việc: hoặc một bài, hoặc một phần tính năng. Tuần chỉ có 3 giờ thì sửa một bài cũ hoặc một lỗi nhỏ.

| Tuần bắt đầu | Việc |
| --- | --- |
| 19/10 | Thêm đo lường đếm sự kiện (Umami hoặc GoatCounter tự host). |
| 26/10 | Máy tính “Trả tối thiểu thẻ tín dụng”: mỗi ngân hàng tính lãi khác nhau khi chỉ trả tối thiểu (có nơi tính trên phần còn nợ, có nơi tính trên toàn bộ dư nợ), nên cần lựa chọn cách tính. |
| 02/11 | Bài: Trả tối thiểu thẻ tín dụng có bị tính lãi, có bị nợ xấu không? |
| 09/11 | Bài: Có nhiều khoản nợ, nên trả khoản nào trước? |
| 16/11 | Bài: Không đủ tiền trả tối thiểu: làm gì trong 30 ngày đầu? |
| 23/11 | Sửa sổ trả nợ theo những gì người dùng thật gặp phải. |
| 30/11 | Bài: Nợ xấu, nợ nhóm 2 bao lâu thì hết trên CIC? |
| 07/12 | Bài: Trả nợ ví trả sau (SPayLater, MoMo…) thế nào cho nhanh? |
| 14/12 | Bài: Giãn nợ công ty tài chính: hỏi thế nào, cần chuẩn bị gì? |
| 21/12 | Rà lại toàn bộ trang, cập nhật số liệu trước năm mới. |
| 28/12 | Bài: Thưởng Tết nên trả nợ hay để dành? (đăng trước 04/01; Tết Đinh Mùi là 06/02/2027) |
| 04/01 | Kiểm tra số liệu luật ngày 01/01 (thuế, bảo hiểm, lương tối thiểu). |

Mỗi bài: trả lời đúng câu người ta gõ, có ví dụ bằng con số, ghi nguồn và ngày cập nhật, kết thúc bằng **một** lời mời lập sổ trả nợ.

**Trước khi đăng bài có nội dung pháp lý** (đòi nợ, nợ xấu, “có đi tù không”), phải đọc văn bản gốc, không chỉ bài báo. Những điểm đang thay đổi hoặc chưa kiểm chứng:

- Thông tư 46/2026/TT-NHNN sửa quy định thông tin tín dụng có hiệu lực từ 01/11/2026.
- Thông tư 39/2016 về cho vay đã được sửa bởi Thông tư 29/2026 (hiệu lực 15/08/2026).
- Quy tắc nhắc nợ của công ty tài chính (Thông tư 18/2019) chỉ áp dụng cho công ty tài chính, không cho ngân hàng hay app vay trái phép.
- Bộ quy tắc ứng xử thu hồi nợ của Hiệp hội Ngân hàng (03/2026) là quy tắc tự nguyện, không phải luật.
- Bộ luật Hình sự (Điều 175, 201) và Nghị định 144/2021: đọc văn bản gốc trước khi viết.

## Tiền: quy tắc bắt buộc

**Không bao giờ giới thiệu hay quảng cáo** (danh sách này cũng công khai ở `/gioi-thieu#kiem-tien`):

- khoản vay, app vay, cho vay ngang hàng, cầm đồ online;
- mở thẻ tín dụng, ví trả sau, mua trước trả sau, “trả góp 0%”;
- đáo hạn thẻ, rút tiền mặt từ thẻ;
- dịch vụ “xóa nợ xấu”, “sửa CIC”, đàm phán nợ thu phí trước;
- khoản vay gộp nợ (chỉ viết bài, không gắn link);
- tiền ảo, ngoại hối, tài khoản giao dịch, cờ bạc, đa cấp, “việc nhẹ lương cao”.

**Được phép, khi đến lúc:**

- Quảng cáo chỉ trên trang kiến thức không khủng hoảng (Gross ↔ Net, thuế, ngân sách). **Không bao giờ** trên sổ trả nợ, trang ghi sổ, hay bài về đòi nợ, nợ xấu. Bộ lọc “Consumer loans” của AdSense chỉ chặn được quảng cáo tiếng Nhật và tiếng Hàn, nên quảng cáo cho vay tiếng Việt vẫn lọt; phải chặn thủ công và rà Trung tâm xem xét quảng cáo mỗi tháng.
- Affiliate: sách tài chính cá nhân; tài khoản tiết kiệm không phí **chỉ** ở bước “Bạn đã hết nợ, xây quỹ phòng thân”.
- Mỗi link affiliate ghi rõ “Liên kết tiếp thị” ngay cạnh link và gắn `rel="sponsored nofollow"`.

**Hai việc kỹ thuật bắt buộc trước khi bật quảng cáo hay affiliate:**

1. **Hosting:** gói Hobby của Vercel chỉ cho phép dùng cá nhân, phi thương mại, và Vercel coi quảng cáo, affiliate là thương mại. Phải nâng lên gói Pro hoặc chuyển sang nơi cho phép ([Vercel fair use](https://vercel.com/docs/limits/fair-use-guidelines)).
2. **Tách sổ trả nợ khỏi script quảng cáo:** sổ lưu trong `localStorage`, mà `localStorage` dùng chung cho cả tên miền. Script quảng cáo ở bất kỳ trang nào trên `www.howdoi.id.vn` đều có thể đọc được số nợ. Vì vậy trang đang chặn mọi script bên ngoài (`next.config.ts`). Trước khi gắn quảng cáo, chuyển sổ trả nợ sang tên miền phụ riêng (ví dụ `so.howdoi.id.vn`), rồi mới nới chính sách cho tên miền chính.

   Cách chuyển để người dùng cũ không mất sổ:
   - Giữ `www.howdoi.id.vn/so-tra-no` chạy. Nếu máy có sổ trong `localStorage`, chuyển hướng sang `https://so.howdoi.id.vn/so-tra-no#khoi-phuc=…` (chỉ qua dấu `#`), rồi xóa bản ở `www` sau khi bên kia mở được. Không có sổ thì chuyển hướng thẳng.
   - Nút “Lưu thành sổ trả nợ” ở công cụ so sánh chuyển khoản nợ qua dấu `#` thay vì `localStorage`. Đổi URL trong tệp nhắc lịch `.ics`.
   - Chỉ nới chính sách của `www` sau vài tháng, khi lượt mở sổ ở `www` gần như bằng 0. Người dùng iPhone đã thêm vào Màn hình chính phải mở lại từ Safari hoặc dùng tệp sao lưu.

## Không làm (ít nhất đến 30/09/2027)

- ❌ Tài khoản, đồng bộ, lưu số liệu trên máy chủ.
- ❌ Thông báo đẩy, email, bản tin, form thu số điện thoại hay chi tiết nợ, “tư vấn nợ miễn phí”.
- ❌ App iOS HowDoI riêng, chatbot AI tư vấn nợ, diễn đàn, bình luận.
- ❌ Bảng so sánh bên cho vay, “ước tính điểm CIC”.
- ❌ Trang nhắm người tìm vay thêm (“nợ xấu vay ở đâu”, “app vay dễ duyệt”).
- ❌ Chuỗi ngày (streak), huy hiệu, cột mốc trang trí, cho tới khi vòng lặp ghi sổ được chứng minh.
- ❌ Bản tiếng Anh. Làm lại công nghệ hay giao diện từ đầu.
- ❌ Xóa hay đổi đường dẫn `/support`, `/privacy`, `/support/cho-con`, `/privacy/cho-con`.

## Bộ lọc khi có ý tưởng mới

1. Nó có giúp một người đang gánh nợ **trả được nợ hoặc giữ được nhịp ghi sổ** không?
2. Nó có giữ đúng ba điều không bao giờ đổi ở đầu file không?
3. Có làm xong trong một tuần (dưới 10 giờ) không?

Chỉ cần một câu “không”, ghi vào mục **Để sau** và quay lại kế hoạch tuần.

## Mỗi tháng ghi lại (15 phút)

| Tháng | Sổ được lưu | Lượt ghi sổ | Khoản nợ xóa sổ | Bài mới | Lượt hiển thị Google | Lượt nhấp |
| --- | --- | --- | --- | --- | --- | --- |
| 11/2026 | | | | | | |
| 12/2026 | | | | | | |
| 01/2027 | | | | | | |

## Để sau

Mỗi quý xem lại một lần, chỉ lấy ra khi vòng lặp ghi sổ đã chạy tốt.

- Thư đề nghị giãn nợ và kịch bản gọi điện, tạo từ chính sổ của người dùng.
- Công cụ “Lãi thật của khoản vay” (từ tiền mỗi kỳ và số kỳ ra lãi suất năm thực tế).
- Công cụ “Trả nợ trước hạn có lợi không”.
- Các bài về quyền của người vay (bị đòi nợ, “có đi tù không”), sau khi đã đọc văn bản gốc.
- Bước “Bạn đã hết nợ”: xây quỹ phòng thân với cùng nhịp ghi sổ hằng tháng.
- Tách sổ trả nợ sang tên miền phụ (bắt buộc trước khi bật quảng cáo).
