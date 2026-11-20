import PageShell from "@/components/depositguard/common/PageShell";
export const metadata = {
  title: "Cập nhật sản phẩm",
  alternates: { canonical: "/cap-nhat" },
};
export default function Updates() {
  return (
    <PageShell
      title="Cập nhật sản phẩm"
      intro="Thay đổi trong phiên bản website bạn đang xem; lịch sử này không phải chứng nhận độc lập."
    >
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Phiên bản 2.0 — 20/11/2026</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Thống nhất ví dụ và báo cáo mẫu với engine tính toán.</li>
          <li>Làm rõ mô phỏng, giả định và phạm vi hỗ trợ.</li>
          <li>
            Bổ sung tiếp nhận liên hệ qua database; báo lỗi thật khi hệ thống
            chưa được cấu hình.
          </li>
          <li>
            Giới thiệu gói rà soát có người hỗ trợ; chỉ nhận hồ sơ khi người vận
            hành bật dịch vụ.
          </li>
        </ul>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Phạm vi đang hỗ trợ</h2>
        <p>
          Khoản vay giải ngân một lần, gốc đều hoặc niên kim, ưu đãi lãi suất,
          ân hạn gốc và biến động thu nhập/chi phí. Chưa hỗ trợ giải ngân nhiều
          đợt, kiểm tra pháp lý hoặc phê duyệt tín dụng.
        </p>
      </section>
    </PageShell>
  );
}
