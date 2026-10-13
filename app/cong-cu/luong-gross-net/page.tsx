import type { Metadata } from 'next';
import GrossNetCalc from '@/components/calculators/GrossNetCalc';
import ToolPageShell, { type Faq } from '@/components/ToolPageShell';
import { H2, P, UL, Table } from '@/components/Prose';
import { getTool, toolPath } from '@/content/tools';
import { calculateGrossToNet, formatVND, SALARY_RULES } from '@/lib/finance-math';

const tool = getTool('luong-gross-net');

export const metadata: Metadata = {
  title: tool.title,
  description: tool.description,
  alternates: { canonical: toolPath(tool.slug) },
  openGraph: { title: tool.title, description: tool.description, url: toolPath(tool.slug), type: 'website' },
};

const r = SALARY_RULES;
const insuranceRate =
  r.employeeRates.socialInsurance + r.employeeRates.healthInsurance + r.employeeRates.unemploymentInsurance;
const pct = (rate: number) => `${(rate * 100).toLocaleString('vi-VN')}%`;
const million = (amount: number) => `${(amount / 1_000_000).toLocaleString('vi-VN')} triệu`;

// Mức Gross bắt đầu phải nộp thuế (giả định đóng bảo hiểm trên toàn bộ lương, dưới mức trần).
const taxThreshold = (dependents: number) =>
  (r.personalDeduction + dependents * r.dependentDeduction) / (1 - insuranceRate);

// Hằng số "trừ nhanh" của từng bậc: thuế = thu nhập tính thuế × thuế suất − hằng số.
const quickFormulas = (() => {
  let lower = 0;
  let taxAtLower = 0;
  return r.taxBrackets.map(({ upTo, rate }) => {
    const row = { from: lower, to: upTo, rate, subtract: lower * rate - taxAtLower };
    if (upTo !== Infinity) taxAtLower += (upTo - lower) * rate;
    lower = upTo;
    return row;
  });
})();

const example = calculateGrossToNet({ grossSalary: 20_000_000, dependents: 0, region: 1 });
const commonSalaries = [10, 15, 20, 25, 30, 40, 50, 70].map((m) => m * 1_000_000);

const faqs: Faq[] = [
  {
    q: 'Lương bao nhiêu thì bắt đầu phải nộp thuế TNCN năm 2026?',
    a: (
      <>
        Nếu không có người phụ thuộc và đóng bảo hiểm trên toàn bộ lương, bạn bắt đầu nộp thuế khi lương Gross vượt
        khoảng <strong>{formatVND(Math.ceil(taxThreshold(0) / 1000) * 1000)}</strong>/tháng. Có 1 người phụ thuộc thì
        ngưỡng này là khoảng <strong>{formatVND(Math.ceil(taxThreshold(1) / 1000) * 1000)}</strong>, có 2 người là
        khoảng <strong>{formatVND(Math.ceil(taxThreshold(2) / 1000) * 1000)}</strong>.
      </>
    ),
  },
  {
    q: 'Biểu thuế 5 bậc áp dụng từ khi nào?',
    a: (
      <>
        Luật Thuế thu nhập cá nhân số 109/2025/QH15 có hiệu lực từ 01/07/2026, nhưng các quy định với thu nhập từ tiền
        lương, tiền công của cá nhân cư trú được áp dụng từ kỳ tính thuế năm 2026. Mức giảm trừ gia cảnh{' '}
        {million(r.personalDeduction)} / {million(r.dependentDeduction)} áp dụng từ 01/01/2026 theo Nghị quyết
        110/2025/UBTVQH15. Quyết toán thuế năm 2025 vẫn dùng mức cũ 11 triệu / 4,4 triệu và biểu 7 bậc.
      </>
    ),
  },
  {
    q: 'Lương cơ sở tăng lên 2,53 triệu ảnh hưởng gì đến lương Net?',
    a: (
      <>
        Chỉ ảnh hưởng người có lương đóng bảo hiểm trên 46,8 triệu. Từ 01/07/2026, mức lương tối đa đóng BHXH và BHYT
        tăng từ 46,8 triệu lên {million(r.baseSalary * r.insuranceCapMultiplier)} (20 lần lương cơ sở), nên người lương
        cao đóng thêm tối đa khoảng{' '}
        {formatVND((r.baseSalary * r.insuranceCapMultiplier - 46_800_000) * (r.employeeRates.socialInsurance + r.employeeRates.healthInsurance))}
        /tháng. Người có lương thấp hơn mức này không bị ảnh hưởng.
      </>
    ),
  },
  {
    q: 'Chọn vùng nào? Vùng ảnh hưởng gì đến kết quả?',
    a: (
      <>
        Vùng là vùng lương tối thiểu nơi bạn làm việc (Vùng I gồm phần lớn nội thành Hà Nội, TP.HCM...). Vùng chỉ quyết
        định mức trần đóng BHTN (20 lần lương tối thiểu vùng, ví dụ Vùng I là{' '}
        {million(r.regionalMinimumWage[1] * r.insuranceCapMultiplier)}). Với lương dưới{' '}
        {million(r.regionalMinimumWage[4] * r.insuranceCapMultiplier)}, chọn vùng nào kết quả cũng như nhau.
      </>
    ),
  },
  {
    q: 'Vì sao lương Net thực tế của tôi khác với kết quả ở đây?',
    a: (
      <UL>
        <li>Công ty đóng bảo hiểm trên mức lương thấp hơn lương Gross (ví dụ chỉ trên lương cơ bản).</li>
        <li>Bạn có phụ cấp được miễn thuế như tiền ăn giữa ca, đồng phục, công tác phí.</li>
        <li>Bạn chưa đăng ký người phụ thuộc với công ty, nên chưa được giảm trừ.</li>
        <li>Bạn ký hợp đồng dưới 3 tháng hoặc không phải cá nhân cư trú: thuế được khấu trừ theo cách khác, không theo biểu lũy tiến.</li>
      </UL>
    ),
  },
  {
    q: 'Công cụ có lưu mức lương tôi nhập không?',
    a: 'Không. Mọi phép tính chạy ngay trên trình duyệt của bạn. HowDoI không gửi, không lưu số liệu bạn nhập.',
  },
];

export default function GrossNetPage() {
  return (
    <ToolPageShell
      tool={tool}
      intro={
        <p>
          Nhập lương Gross để biết số tiền thực nhận sau bảo hiểm và thuế thu nhập cá nhân, hoặc nhập mức Net mong muốn
          để biết cần thỏa thuận lương Gross bao nhiêu. Công cụ tính theo quy định đang áp dụng năm 2026: giảm trừ gia
          cảnh {million(r.personalDeduction)}, người phụ thuộc {million(r.dependentDeduction)}, biểu thuế lũy tiến 5 bậc.
        </p>
      }
      calculator={<GrossNetCalc />}
      faqs={faqs}
      sources={r.sources}
    >
      <H2 id="cach-tinh">Cách tính lương Net từ lương Gross năm 2026</H2>
      <P>
        <strong>Lương Net = Lương Gross − Bảo hiểm bắt buộc − Thuế TNCN.</strong> Cụ thể có 4 bước:
      </P>
      <ol className="list-decimal pl-5 space-y-2 text-sm sm:text-base text-slate-600 leading-relaxed">
        <li>
          <strong>Trừ bảo hiểm {pct(insuranceRate)}:</strong> BHXH {pct(r.employeeRates.socialInsurance)}, BHYT{' '}
          {pct(r.employeeRates.healthInsurance)}, BHTN {pct(r.employeeRates.unemploymentInsurance)}. Lương đóng BHXH, BHYT
          tối đa là {formatVND(r.baseSalary * r.insuranceCapMultiplier)} (20 lần lương cơ sở {formatVND(r.baseSalary)}).
          Lương đóng BHTN tối đa là 20 lần lương tối thiểu vùng.
        </li>
        <li>
          <strong>Trừ giảm trừ gia cảnh:</strong> {formatVND(r.personalDeduction)} cho bản thân và{' '}
          {formatVND(r.dependentDeduction)} cho mỗi người phụ thuộc đã đăng ký.
        </li>
        <li>
          <strong>Tính thuế</strong> trên phần còn lại (thu nhập tính thuế) theo biểu lũy tiến 5 bậc bên dưới.
        </li>
        <li>
          <strong>Lương Net</strong> = thu nhập sau bảo hiểm − thuế TNCN.
        </li>
      </ol>

      <H2 id="bieu-thue">Biểu thuế TNCN 5 bậc áp dụng cho tiền lương</H2>
      <P>
        Mỗi bậc chỉ đánh thuế trên phần thu nhập nằm trong bậc đó. Để tính nhanh, lấy thu nhập tính thuế nhân thuế suất
        của bậc cao nhất bạn chạm tới rồi trừ đi số ở cột cuối.
      </P>
      <Table
        head={['Bậc', 'Thu nhập tính thuế/tháng', 'Thuế suất', 'Tính nhanh']}
        rows={quickFormulas.map((b, i) => [
          i + 1,
          b.to === Infinity ? `Trên ${million(b.from)}` : b.from === 0 ? `Đến ${million(b.to)}` : `Trên ${million(b.from)} đến ${million(b.to)}`,
          pct(b.rate),
          b.subtract === 0 ? `TNTT × ${pct(b.rate)}` : `TNTT × ${pct(b.rate)} − ${million(b.subtract)}`,
        ])}
      />

      <H2 id="vi-du">Ví dụ: lương Gross 20 triệu thực nhận bao nhiêu?</H2>
      <P>Người lao động ở Vùng I, không có người phụ thuộc, đóng bảo hiểm trên toàn bộ lương:</P>
      <UL>
        <li>Bảo hiểm: 20.000.000 × {pct(insuranceRate)} = {formatVND(example.totalInsurance)}</li>
        <li>Thu nhập sau bảo hiểm: {formatVND(example.incomeBeforeTax)}</li>
        <li>
          Thu nhập tính thuế: {formatVND(example.incomeBeforeTax)} − {formatVND(example.personalDeduction)} ={' '}
          {formatVND(example.taxableIncome)}
        </li>
        <li>Thuế TNCN: {formatVND(example.taxableIncome)} × 5% = {formatVND(example.personalIncomeTax)}</li>
        <li>
          <strong>Lương Net: {formatVND(example.netSalary)}</strong>
        </li>
      </UL>
      <P>
        Theo quy định cũ năm 2025 (giảm trừ 11 triệu, biểu 7 bậc), cùng mức lương này chỉ thực nhận 17.460.000 ₫. Nghĩa
        là năm 2026 bạn nhận thêm khoảng {formatVND(example.netSalary - 17_460_000)} mỗi tháng.
      </P>

      <H2 id="bang-luong">Bảng lương Gross sang Net phổ biến năm 2026</H2>
      <P>Vùng I, đóng bảo hiểm trên toàn bộ lương:</P>
      <Table
        head={['Lương Gross', 'Net (không phụ thuộc)', 'Net (1 người phụ thuộc)', 'Net (2 người phụ thuộc)']}
        rows={commonSalaries.map((gross) => [
          formatVND(gross),
          ...[0, 1, 2].map((d) => formatVND(calculateGrossToNet({ grossSalary: gross, dependents: d, region: 1 }).netSalary)),
        ])}
      />
    </ToolPageShell>
  );
}
