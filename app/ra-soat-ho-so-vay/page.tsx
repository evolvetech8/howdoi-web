import Link from "next/link";
import PageShell from "@/components/depositguard/common/PageShell";
import { OFFER } from "@/lib/depositguard/offer";
import { serviceEnabled } from "@/lib/server/config";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Rà soát hồ sơ vay",
  alternates: { canonical: "/ra-soat-ho-so-vay" },
};
export default function Service() {
  const enabled = serviceEnabled();
  return (
    <PageShell
      title={OFFER.title}
      intro="Dành cho gia đình đã có căn nhà cụ thể và muốn hiểu rõ đề nghị vay trước khi đặt cọc."
    >
      <section className="bg-navy-900 text-white rounded-3xl p-7 space-y-4">
        <p className="text-3xl font-mono">299.000đ / hồ sơ pilot</p>
        <p>{OFFER.scope}.</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Bản tóm tắt 2–4 trang: giả định, dòng tiền, dự phòng và câu hỏi cần
            xác nhận.
          </li>
          <li>Buổi giải thích 30 phút.</li>
          <li>Một lần sửa dữ kiện trong bảy ngày.</li>
          <li>{OFFER.delivery}.</li>
        </ul>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Quy trình rõ ràng</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Gửi yêu cầu; chưa cần thanh toán hoặc gửi hồ sơ tài chính.</li>
          <li>
            Người thực hiện phản hồi trong một ngày làm việc và xác nhận phạm
            vi.
          </li>
          <li>Nhận giá, lịch giao và hướng dẫn chuyển khoản đã xác minh.</li>
          <li>
            Cung cấp giả định cần thiết qua kênh riêng đã thống nhất; nhận báo
            cáo và trao đổi.
          </li>
        </ol>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Phạm vi và hủy/hoàn</h2>
        <p>
          Hỗ trợ mô phỏng và diễn giải; không thẩm định pháp lý, định giá nhà,
          xác minh thu nhập, bảo đảm giải ngân hoặc quyết định vay thay khách.
        </p>
        <p>
          Hoàn đủ nếu hủy trước khi bắt đầu hoặc bên cung cấp không thể giao
          theo cam kết. Lỗi số liệu được sửa miễn phí. Điều kiện và thời hạn cụ
          thể được xác nhận trước khi nhận tiền.
        </p>
      </section>
      <section className="border rounded-2xl p-6 space-y-3">
        <h2 className="text-2xl font-bold">Người thực hiện và tiếp nhận</h2>
        {enabled ? (
          <>
            <p className="font-semibold">{process.env.OPERATOR_NAME}</p>
            <p>{process.env.OPERATOR_BIO}</p>
            <Link
              href="/dang-ky-ra-soat"
              className="inline-block bg-primary-700 hover:bg-primary-800 text-white px-6 py-3 rounded-xl"
            >
              Gửi yêu cầu rà soát
            </Link>
          </>
        ) : (
          <p role="status">
            Dịch vụ chưa nhận hồ sơ trả phí. Thông tin người thực hiện và hệ
            thống tiếp nhận đang được hoàn thiện. Công cụ miễn phí vẫn sử dụng
            đầy đủ.
          </p>
        )}
        <Link
          className="block text-primary-800 underline py-2"
          href="/kiem-tra-mua-nha"
        >
          Kiểm tra miễn phí →
        </Link>
      </section>
    </PageShell>
  );
}
