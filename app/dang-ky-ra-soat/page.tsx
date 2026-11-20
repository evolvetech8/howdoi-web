import PageShell from "@/components/depositguard/common/PageShell";
import IntakeForm from "@/components/depositguard/common/IntakeForm";
import { serviceEnabled } from "@/lib/server/config";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Đăng ký rà soát",
  robots: { index: false, follow: false },
};
export default function Register() {
  return (
    <PageShell
      title="Gửi yêu cầu rà soát"
      intro="Gói pilot 299.000đ. Chúng tôi xác nhận phạm vi trước khi hướng dẫn thanh toán."
    >
      {serviceEnabled() ? (
        <IntakeForm kind="report" />
      ) : (
        <p>
          Dịch vụ chưa nhận hồ sơ. Bạn vẫn có thể sử dụng công cụ miễn phí hoặc
          gửi câu hỏi qua trang liên hệ.
        </p>
      )}
    </PageShell>
  );
}
