import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Calculator, AlertTriangle, CheckCircle2, ArrowRight, Scale } from 'lucide-react';
import { formatVND } from '@/lib/depositguard/formatters';
import DisclaimerBanner from '@/components/depositguard/common/DisclaimerBanner';

export const metadata: Metadata = {
  title: 'Phương Pháp Tính & Công Thức Toán Học (v1.1) | EvolveTech DepositGuard',
  description:
    'Tài liệu minh bạch về công thức tính lịch trả nợ dư nợ giảm dần, trả góp đều (niên kim), dòng tiền hộ gia đình, quỹ dự phòng và bộ giải ngược mức vay an toàn.',
  alternates: {
    canonical: 'https://www.evolvetech.biz.vn/cach-tinh',
  },
};

export default function CachTinhPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Header */}
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          <span>Phiên bản mô hình: v1.1 (Deterministic Integer-VND Engine)</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Phương pháp tính &amp; Giả định mô hình tài chính
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          DepositGuard sử dụng mô hình toán học tất định (deterministic), hoàn toàn tách biệt khỏi trí tuệ nhân tạo tạo sinh (Generative AI) để đảm bảo mọi con số về nghĩa vụ trả nợ, dòng tiền ròng và quỹ dự phòng đều có thể kiểm chứng độc lập bằng bảng tính.
        </p>
        <DisclaimerBanner />
      </header>

      {/* 1. Interest Rate & Rounding Convention */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
          1. Quy ước lãi suất tháng &amp; Làm tròn số học VND
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Trong phiên bản v1.1, lãi suất tháng <code>i[m]</code> tại tháng thứ <code>m</code> được xác định từ lãi suất danh nghĩa năm <code>r[m]</code> theo quy ước chuẩn 12 tháng đều nhau:
        </p>
        <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-300 text-xs sm:text-sm overflow-x-auto font-mono">
{`i[m] = r[m] / 12
I[m] = round(B[m - 1] * i[m])`}
        </pre>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-600 list-disc pl-5">
          <li>
            <strong>Số học nguyên VND (Zero-drift Integer Arithmetic):</strong> Mọi khoản tiền gốc, lãi, dòng tiền và số dư quỹ dự phòng được làm tròn về đồng Việt Nam (<code>Math.round</code>) ở từng kỳ để tránh sai số dấu phẩy động (floating-point drift). Kỳ cuối cùng (<code>m = N</code>) tự động tất toán phần dư nợ gốc còn lại để tổng nợ gốc hoàn trả khớp 100% với khoản vay ban đầu.
          </li>
          <li>
            <strong>Lưu ý khi đối chiếu với bảng tính ngân hàng:</strong> Nhiều ngân hàng thương mại tại Việt Nam tính lãi theo số ngày thực tế trong tháng chia cho 365 hoặc 360 ngày (<code>actual/365</code> hoặc <code>actual/360</code>). Do tháng có 28, 30 hoặc 31 ngày, số tiền lãi thực tế trên sao kê ngân hàng có thể chênh lệch vài chục đến vài trăm nghìn đồng mỗi tháng so với quy ước <code>r / 12</code>.
          </li>
        </ul>
      </section>

      {/* 2. Repayment Methods */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 space-y-5">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
          2. Hai phương thức hoàn trả nợ vay &amp; Ân hạn nợ gốc
        </h2>

        <div className="space-y-3">
          <h3 className="text-sm sm:text-base font-bold text-emerald-800">
            2.1. Dư nợ giảm dần (Trả gốc đều — Equal Principal)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Nếu khoản vay có tổng thời hạn <code>N</code> tháng và thời gian ân hạn nợ gốc <code>G</code> tháng (<code>0 &le; G &lt; N</code>):
          </p>
          <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-300 text-xs sm:text-sm overflow-x-auto font-mono">
{`Trong thời gian ân hạn gốc (1 <= m <= G):
  P[m] = 0
  I[m] = round(B[m-1] * (r[m] / 12))
  DS[m] = I[m]

Sau khi hết ân hạn gốc (G < m <= N):
  P[m] = round(B_0 / (N - G))   (riêng tháng N: P[N] = B[N-1])
  I[m] = round(B[m-1] * (r[m] / 12))
  DS[m] = P[m] + I[m]`}
          </pre>
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="text-sm sm:text-base font-bold text-emerald-800">
            2.2. Trả góp đều hàng tháng (Niên kim — Level Payment / Annuity)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Tại mỗi thời điểm bắt đầu trả gốc hoặc khi lãi suất thay đổi (hết thời gian ưu đãi hoặc chịu cú sốc lãi suất), khoản thanh toán cố định hàng tháng <code>A</code> được tính lại trên <strong>dư nợ còn lại</strong> <code>B[m-1]</code> và <strong>số tháng còn lại</strong> <code>n = N - m + 1</code>:
          </p>
          <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-300 text-xs sm:text-sm overflow-x-auto font-mono">
{`Nếu i[m] > 0:
  A = B[m-1] * i[m] / (1 - (1 + i[m])^(-n))
Nếu i[m] == 0 (vay 0% lãi suất):
  A = B[m-1] / n

P[m] = round(A) - I[m]
DS[m] = P[m] + I[m]`}
          </pre>
        </div>
      </section>

      {/* 3. Household Cash Flow & Stress Model */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
          3. Mô hình dòng tiền hộ gia đình, Tỷ lệ DTI &amp; Quỹ dự phòng
        </h2>
        <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-300 text-xs sm:text-sm overflow-x-auto font-mono">
{`UpfrontCashRequired = DownPayment + ClosingCosts
InitialReserve[0]   = LiquidSavings - UpfrontCashRequired

Tại mỗi tháng m (1..N):
  TotalOutflow[m]  = EssentialExpenses[m] + ExistingDebtPayments[m] + RecurringHomeCosts[m] + DS[m]
  FreeCashFlow[m]  = NetIncome[m] - TotalOutflow[m]
  Reserve[m]       = Reserve[m-1] + FreeCashFlow[m]
  DTI[m]           = ((ExistingDebtPayments[m] + DS[m]) / NetIncome[m]) * 100%`}
        </pre>
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-900 space-y-1.5">
          <div className="font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Tỷ lệ DTI trên DepositGuard là chỉ số dòng tiền gia đình, không phải tiêu chuẩn duyệt vay của ngân hàng</span>
          </div>
          <p className="leading-relaxed">
            Mỗi ngân hàng có quy định thẩm định nguồn thu nhập, khấu trừ chi phí sinh hoạt và trần DTI/DSR nội bộ khác nhau. DepositGuard tính <code>DTI</code> trên <strong>thu nhập thực nhận (Net)</strong> của gia đình để giúp bạn tự đánh giá gánh nặng trả nợ thực tế.
          </p>
        </div>
      </section>

      {/* 4. Golden Fixture Verification Table */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
          4. Bảng kiểm chứng chuẩn (Golden Fixture — Mục 4.6 PRD)
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Thông số kiểm thử tiêu chuẩn: Khoản vay <strong>{formatVND(2_000_000_000)}</strong>, kỳ hạn <strong>240 tháng</strong>, phương thức <strong>Dư nợ giảm dần</strong>, lãi ưu đãi <strong>7,0%/năm</strong> trong 12 tháng đầu, lãi sau ưu đãi <strong>12,0%/năm</strong> từ tháng 13; thu nhập ròng <strong>{formatVND(55_000_000)}/tháng</strong>, chi phí thiết yếu <strong>{formatVND(30_000_000)}/tháng</strong>.
        </p>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100 text-slate-700 font-bold">
              <tr>
                <th className="p-3">Kỳ (Tháng)</th>
                <th className="p-3">Lãi suất năm</th>
                <th className="p-3">Trả gốc</th>
                <th className="p-3">Trả lãi</th>
                <th className="p-3">Tổng trả NH</th>
                <th className="p-3">Dòng tiền ròng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-semibold">Tháng 1</td>
                <td className="p-3">7,0%</td>
                <td className="p-3">{formatVND(8_333_333)}</td>
                <td className="p-3">{formatVND(11_666_667)}</td>
                <td className="p-3 font-bold text-slate-900">{formatVND(20_000_000)}</td>
                <td className="p-3 font-bold text-emerald-700">+{formatVND(5_000_000)}</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">Tháng 12</td>
                <td className="p-3">7,0%</td>
                <td className="p-3">{formatVND(8_333_333)}</td>
                <td className="p-3">{formatVND(11_129_167)}</td>
                <td className="p-3 font-bold text-slate-900">{formatVND(19_462_500)}</td>
                <td className="p-3 font-bold text-emerald-700">+{formatVND(5_537_500)}</td>
              </tr>
              <tr className="bg-rose-50/70">
                <td className="p-3 font-bold text-rose-900">Tháng 13 (Hết ưu đãi)</td>
                <td className="p-3 font-semibold text-rose-900">12,0%</td>
                <td className="p-3">{formatVND(8_333_333)}</td>
                <td className="p-3">{formatVND(19_000_000)}</td>
                <td className="p-3 font-extrabold text-rose-900">{formatVND(27_333_333)}</td>
                <td className="p-3 font-extrabold text-rose-700">-{formatVND(2_333_333)} (Thiếu hụt đầu tiên)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Reverse Solver & Limitations */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
          <Scale className="w-5 h-5 text-emerald-600" />
          <span>5. Bộ giải ngược (Reverse Affordability Solver) &amp; Giới hạn phạm vi</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Khi kịch bản hiện tại xuất hiện tháng thiếu hụt dòng tiền hoặc làm thủng đáy quỹ dự phòng khẩn cấp, bộ giải ngược sử dụng thuật toán tìm kiếm nhị phân đơn điệu (monotonic binary search) trên miền giá trị nguyên <code>[0, LoanAmount]</code> để xác định mức dư nợ vay tối đa giúp hộ gia đình duy trì dòng tiền không âm và giữ vững quỹ dự phòng.
        </p>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Nếu thu nhập hiện tại thấp hơn cả chi phí sinh hoạt thiết yếu cộng nợ hiện hữu (ngay cả khi vay 0 ₫ vẫn âm dòng tiền), công cụ sẽ thông báo trung thực rằng việc giảm quy mô khoản vay không giải quyết được thâm hụt ngân sách cơ bản.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Không thẩm định pháp lý hay định giá:</strong> DepositGuard không kiểm tra sổ hồng/sổ đỏ, quy hoạch, tiến độ chủ đầu tư, tính hợp pháp của hợp đồng đặt cọc hay giá trị thị trường của căn nhà.
            </span>
          </li>
        </ul>

        <div className="pt-4 flex flex-wrap gap-3">
          <Link
            href="/kiem-tra-mua-nha"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-colors"
          >
            <Calculator className="w-4 h-4" />
            <span>Bắt đầu mô phỏng khoản vay của bạn</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/lien-he"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold transition-colors"
          >
            <span>Báo lỗi hoặc góp ý công thức</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
