import PageShell from "@/components/depositguard/common/PageShell";
export const metadata = {
  title: "Điều khoản sử dụng",
  alternates: { canonical: "/dieu-khoan" },
};
export default function Terms() {
  return (
    <PageShell
      title="Điều khoản sử dụng"
      intro="Áp dụng cho DepositGuard, cập nhật 20/11/2026."
    >
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Mô phỏng tài chính</h2>
        <p>
          Kết quả phụ thuộc dữ liệu và giả định bạn nhập. Lãi tương lai không
          được dự báo hoặc bảo đảm. Ngân hàng có quy ước tính ngày, điều kiện
          xét duyệt và phí riêng. Công cụ không thẩm định pháp lý, định giá hoặc
          bảo đảm tiền cọc.
        </p>
        <p>
          Trần vay theo dòng tiền không đồng nghĩa đủ vốn tự có và quỹ dự phòng.
          Kiểm tra cả các khoản này trước khi ra quyết định.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Dịch vụ pilot</h2>
        <p>
          Giá 299.000đ cho một hộ gia đình, một căn nhà và tối đa hai đề nghị
          vay. Gồm bản tóm tắt 2–4 trang, trao đổi 30 phút và một lần sửa dữ
          kiện trong bảy ngày.
        </p>
        <p>
          Chỉ thanh toán sau khi người thực hiện xác nhận phạm vi, lịch giao và
          thông tin nhận tiền. Dự kiến giao trong hai ngày làm việc sau khi đủ
          đầu vào và xác nhận tiền. Việc gửi form chưa tạo xác nhận thanh toán
          hoặc cam kết nhận hồ sơ.
        </p>
        <p>
          Hoàn đủ nếu hủy trước khi bắt đầu hoặc bên cung cấp không thể giao
          theo cam kết. Lỗi số liệu được sửa miễn phí. Vấn đề khác được trao đổi
          trực tiếp theo trường hợp, không tự động từ chối qua phần mềm.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Hỗ trợ và sửa sai</h2>
        <p>
          Thông báo sai lệch hoặc yêu cầu hủy/hoàn tới archonic88@gmail.com kèm
          mã hồ sơ. Không đăng dữ liệu tài chính của bạn hoặc người khác trong
          nội dung công khai.
        </p>
      </section>
    </PageShell>
  );
}
