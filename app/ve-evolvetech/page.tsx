import PageShell from "@/components/depositguard/common/PageShell";
import Link from "next/link";
export const metadata = {
  title: "Về EvolveTech",
  alternates: { canonical: "/ve-evolvetech" },
};
export default function About() {
  return (
    <PageShell
      title="Người vận hành và phạm vi sản phẩm"
      intro="DepositGuard được phát triển trong hệ sinh thái sản phẩm EvolveTech / Archonic."
    >
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Trách nhiệm với sản phẩm</h2>
        <p>
          Chúng tôi xây dựng công cụ để người mua nhà tự kiểm tra lịch trả nợ và
          dòng tiền theo giả định của mình. Đây là sản phẩm phần mềm; không đại
          diện ngân hàng, đơn vị thẩm định pháp lý hay chứng nhận an toàn giao
          dịch.
        </p>
        <p>
          Danh tính và kinh nghiệm của người thực hiện dịch vụ được công bố tại
          trang dịch vụ trước khi tiếp nhận hồ sơ trả phí.
        </p>
        <a
          className="text-primary-800 underline"
          href="mailto:archonic88@gmail.com"
        >
          Liên hệ người vận hành: archonic88@gmail.com
        </a>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Độc lập và minh bạch</h2>
        <p>
          Không nhận hoa hồng ngân hàng/môi giới và không bán thông tin khách
          hàng trong mô hình pilot. Cảnh báo, lịch trả nợ và bản in tự phục vụ
          không bị khóa sau tường phí.
        </p>
        <p>
          Mô phỏng chạy trên thiết bị. Khi gửi liên hệ hoặc yêu cầu dịch vụ, bạn
          chủ động cung cấp thông tin để chúng tôi xử lý yêu cầu đó.
        </p>
      </section>
      <div className="flex flex-wrap gap-5">
        <Link href="/cach-tinh" className="underline text-primary-800">
          Phương pháp tính
        </Link>
        <Link href="/cap-nhat" className="underline text-primary-800">
          Cập nhật sản phẩm
        </Link>
        <Link href="/lien-he" className="underline text-primary-800">
          Báo lỗi phép tính
        </Link>
      </div>
    </PageShell>
  );
}
