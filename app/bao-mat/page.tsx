import PageShell from "@/components/depositguard/common/PageShell";
export const metadata = {
  title: "Chính sách dữ liệu",
  alternates: { canonical: "/bao-mat" },
};
export default function Privacy() {
  return (
    <PageShell
      title="Chính sách dữ liệu DepositGuard"
      intro="Phiên bản 20/11/2026. Mô phỏng miễn phí và gửi yêu cầu dịch vụ có cách xử lý dữ liệu khác nhau."
    >
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Mô phỏng tại thiết bị</h2>
        <p>
          Thu nhập, số tiền vay, chi phí và kết quả được tính trong trình duyệt,
          lưu tạm theo tab bằng sessionStorage. Không tự gửi chúng qua URL,
          analytics hoặc form dịch vụ. Bạn có thể đặt lại mô phỏng để xóa phiên
          làm việc.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Thông tin bạn chủ động gửi</h2>
        <p>
          Form liên hệ nhận email, tên tùy chọn, loại yêu cầu và nội dung. Form
          dịch vụ nhận thêm thời điểm mua dự kiến và nhu cầu hỗ trợ; không tự
          đính kèm hồ sơ mô phỏng. Dữ liệu được lưu trong Supabase khi hệ thống
          đã cấu hình. Resend gửi thông báo vận hành; người vận hành trả lời qua
          email.
        </p>
        <p>
          Không bán dữ liệu, không tự đăng ký bạn vào danh sách marketing. Không
          gửi CCCD, hợp đồng nguyên bản, sao kê hoặc địa chỉ nhà vào form.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Đo lường và lưu giữ</h2>
        <p>
          Analytics chỉ nhận các sự kiện hành trình cho phép; không gửi số tiền
          hoặc phân loại rủi ro. Sự kiện thô được dọn sau 30 ngày bằng tác vụ
          vận hành. Khóa HMAC dùng giới hạn gửi được dọn sau 24 giờ; ứng dụng
          không lưu IP nguyên văn trong bảng giới hạn. Nhà cung cấp hosting có
          thể có log hạ tầng riêng.
        </p>
        <p>
          Liên hệ đã đóng được dọn sau 90 ngày. Hồ sơ giao dịch và chứng từ
          không áp dụng lịch xóa analytics; lịch lưu và kênh bàn giao được xác
          nhận trước khi nhận dịch vụ. Không công bố hồ sơ tài chính qua link
          công khai.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Yêu cầu truy cập hoặc xóa</h2>
        <p>
          Gửi yêu cầu tới{" "}
          <a className="underline" href="mailto:archonic88@gmail.com">
            archonic88@gmail.com
          </a>{" "}
          kèm mã tiếp nhận nếu có. Người vận hành xác minh yêu cầu và xử lý
          database, bản làm việc, email theo phạm vi cần thiết; không cam kết
          xóa tức thì khỏi mọi bản backup của nhà cung cấp.
        </p>
      </section>
    </PageShell>
  );
}
