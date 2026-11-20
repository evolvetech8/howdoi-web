import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/depositguard/common/PageShell";
import ServiceCard from "@/components/depositguard/common/ServiceCard";
import {
  EXAMPLES,
  BASE_STRESS,
  evaluateExample,
} from "@/lib/depositguard/examples";
import { formatVND } from "@/lib/depositguard/formatters";
export const metadata: Metadata = {
  title: "Báo cáo mẫu",
  alternates: { canonical: "/bao-cao-mau" },
};
export default function Sample() {
  const e = EXAMPLES[0],
    base = evaluateExample(e),
    shock = evaluateExample(e, { ...BASE_STRESS, rateShockPp: 2 });
  const scenarios = [
    ["Cơ sở: sau ưu đãi 12%", BASE_STRESS],
    ["Lãi tăng 2 điểm: 14%", { ...BASE_STRESS, rateShockPp: 2 }],
    ["Lãi tăng 4 điểm: 16%", { ...BASE_STRESS, rateShockPp: 4 }],
    [
      "Thu nhập giảm 20% trong 6 tháng",
      { ...BASE_STRESS, incomeShockPercent: -20 },
    ],
  ] as const;
  return (
    <PageShell
      title="Báo cáo mô phỏng trước đặt cọc"
      intro="Ví dụ giả định DG-MAU-01. Không phải hồ sơ khách hàng thật. Các kết quả được tính từ cùng engine với công cụ miễn phí."
    >
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">1. Đầu vào và giới hạn</h2>
        <p>
          Nhà {formatVND(e.loan.propertyPrice)}, vốn tự có{" "}
          {formatVND(e.loan.downPayment)} (
          {((e.loan.downPayment / e.loan.propertyPrice) * 100).toFixed(1)}%),
          vay {formatVND(e.loan.loanAmount)} trong 240 tháng. Trả gốc đều, lãi
          7% trong 12 tháng rồi giả định 12%.
        </p>
        <p>
          Thu nhập {formatVND(e.household.monthlyNetIncome)}/tháng; sinh hoạt{" "}
          {formatVND(e.household.essentialLivingExpenses)}; tiền mặt{" "}
          {formatVND(e.household.liquidSavings)}; giữ dự phòng{" "}
          {formatVND(e.household.plannedEmergencyReserveFloor || 0)}.
        </p>
        <p className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
          Chi phí giao dịch, nội thất và chi phí định kỳ đang để 0 trong ví dụ
          này. Hồ sơ thực tế cần điền các khoản này trước khi kết luận.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">2. Dòng tiền theo kịch bản</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-3">Kịch bản</th>
                <th className="p-3">Trả tháng 13</th>
                <th className="p-3">Dòng tiền tháng 13</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map(([label, stress]) => {
                const { result } = evaluateExample(e, stress);
                return (
                  <tr key={label} className="border-t">
                    <th className="p-3 font-medium">{label}</th>
                    <td className="p-3 font-mono whitespace-nowrap">
                      {formatVND(result.postPromoPayment)}
                    </td>
                    <td className="p-3 font-mono whitespace-nowrap">
                      {formatVND(result.schedule[12].operatingCashFlow)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p>
          Tháng 1 trả {formatVND(base.result.month1Payment)}. Mức tăng từ tháng
          12 sang tháng 13 là {formatVND(base.result.paymentJumpAmount)}.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">3. Điều chỉnh và vốn cần thêm</h2>
        <p>
          Trần vay theo dòng tiền ở lãi 12%:{" "}
          <strong>{formatVND(base.solver.maxSafeLoanAmount)}</strong>. Khi
          stress lên 14%:{" "}
          <strong>{formatVND(shock.solver.maxSafeLoanAmount)}</strong>.
        </p>
        <p>
          Ở kịch bản cơ sở, cần bổ sung vốn{" "}
          {formatVND(base.solver.additionalEquityNeeded)} nếu giữ nguyên giá
          nhà.{" "}
          {base.solver.canAffordWithCurrentLiquidSavings
            ? "Tiền mặt trong giả định đủ đáp ứng phần vốn và dự phòng."
            : "Tiền mặt trong giả định chưa đủ đáp ứng đồng thời phần vốn tăng thêm và quỹ dự phòng."}
        </p>
        <p>
          Trần vay chỉ kiểm tra dòng tiền mô phỏng, không phải phê duyệt ngân
          hàng hoặc xác nhận toàn bộ phương án an toàn.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">4. Những câu hỏi cần xác nhận</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Lãi sau ưu đãi theo chỉ số nào, cộng biên độ bao nhiêu?</li>
          <li>Giá trị định giá và số tiền dự kiến giải ngân là bao nhiêu?</li>
          <li>Nợ gốc được phân bổ thế nào sau ân hạn?</li>
          <li>Phí trả trước hạn và các sản phẩm đi kèm áp dụng ra sao?</li>
          <li>Thời điểm giải ngân có khớp lịch thanh toán không?</li>
        </ul>
        <p>
          Điều khoản đặt cọc và pháp lý căn nhà cần người có chuyên môn phù hợp
          kiểm tra riêng.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Tự kiểm tra và hỗ trợ theo hồ sơ</h2>
        <p>
          Các phép tính trên có sẵn miễn phí. Dịch vụ thêm phần rà soát đầu vào,
          so sánh hai đề nghị vay và giải thích theo câu hỏi của khách; không
          phải chỉ xuất lại một file PDF.
        </p>
        <Link className="text-primary-800 underline" href="/kiem-tra-mua-nha">
          Tạo kết quả với số liệu của bạn →
        </Link>
      </section>
      <ServiceCard />
    </PageShell>
  );
}
