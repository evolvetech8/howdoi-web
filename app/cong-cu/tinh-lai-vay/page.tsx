import type { Metadata } from 'next';
import LoanCalc from '@/components/calculators/LoanCalc';
import ToolPageShell, { type Faq } from '@/components/ToolPageShell';
import { H2, P, UL, Table } from '@/components/Prose';
import { getTool, toolPath } from '@/content/tools';
import { calculateLoan, formatCompactVND, formatVND } from '@/lib/finance-math';

const tool = getTool('tinh-lai-vay');

export const metadata: Metadata = {
  title: tool.title,
  description: tool.description,
  alternates: { canonical: toolPath(tool.slug) },
  openGraph: { title: tool.title, description: tool.description, url: toolPath(tool.slug), type: 'website' },
};

const LOAN = 1_000_000_000;
const RATE = 9;
const terms = [10, 15, 20, 25];
const loanFor = (years: number) =>
  calculateLoan({ loanAmount: LOAN, loanTermMonths: years * 12, annualInterestRate: RATE, method: 'reducing' });

const faqs: Faq[] = [
  {
    q: 'Vay 1 tỷ mua nhà mỗi tháng trả bao nhiêu?',
    a: (
      <>
        Với lãi suất {RATE}%/năm tính trên dư nợ giảm dần, vay 1 tỷ trong 20 năm thì tháng đầu trả khoảng{' '}
        <strong>{formatVND(loanFor(20).firstMonthPayment)}</strong>, sau đó giảm dần mỗi tháng. Vay 15 năm thì tháng đầu
        khoảng <strong>{formatVND(loanFor(15).firstMonthPayment)}</strong>. Xem bảng chi tiết ở trên.
      </>
    ),
  },
  {
    q: 'Thu nhập bao nhiêu thì nên vay mua nhà?',
    a: (
      <>
        Một nguyên tắc an toàn phổ biến là tổng tiền trả nợ mỗi tháng không vượt quá khoảng 30–40% thu nhập thực nhận
        của cả gia đình, và vẫn còn quỹ khẩn cấp sau khi trả trước. Hãy tính với lãi suất sau ưu đãi, không phải lãi
        suất ưu đãi năm đầu.
      </>
    ),
  },
  {
    q: 'Lãi suất ưu đãi hết thì sao?',
    a: (
      <>
        Phần lớn khoản vay mua nhà chỉ cố định lãi suất trong một thời gian đầu, sau đó thả nổi theo lãi suất tham chiếu
        của ngân hàng cộng biên độ. Hãy hỏi rõ biên độ và cách tính lãi thả nổi trước khi ký, rồi thử nhập lãi suất cao
        hơn 2–3% vào công cụ để xem bạn còn trả nổi không.
      </>
    ),
  },
];

export default function LoanPage() {
  return (
    <ToolPageShell
      tool={tool}
      intro={
        <p>
          Nhập số tiền vay, thời hạn và lãi suất để biết mỗi tháng phải trả bao nhiêu, tổng tiền lãi là bao nhiêu, và
          khác biệt giữa cách tính lãi trên dư nợ giảm dần với lãi cố định trên dư nợ ban đầu.
        </p>
      }
      calculator={<LoanCalc />}
      faqs={faqs}
    >
      <H2 id="hai-cach-tinh">Hai cách tính lãi vay cần phân biệt</H2>
      <UL>
        <li>
          <strong>Dư nợ giảm dần</strong> (phổ biến khi vay mua nhà): tiền gốc chia đều mỗi tháng, tiền lãi tính trên số
          tiền còn nợ. Tháng đầu trả nhiều nhất, các tháng sau giảm dần.
        </li>
        <li>
          <strong>Lãi cố định trên dư nợ ban đầu</strong> (hay gặp ở vay tiêu dùng, trả góp): lãi luôn tính trên toàn bộ
          số tiền vay ban đầu dù bạn đã trả bớt gốc. Cùng một con số lãi suất, cách này khiến bạn trả lãi nhiều hơn đáng
          kể.
        </li>
      </UL>
      <P>Khi được chào lãi suất thấp bất thường, hãy hỏi lãi được tính theo cách nào.</P>

      <H2 id="vay-1-ty">Vay 1 tỷ, lãi suất {RATE}%/năm, mỗi tháng trả bao nhiêu?</H2>
      <P>Tính theo dư nợ giảm dần, lãi suất giữ nguyên suốt thời hạn vay:</P>
      <Table
        head={['Thời hạn', 'Trả tháng đầu', 'Trả tháng cuối', 'Tổng tiền lãi']}
        rows={terms.map((years) => {
          const loan = loanFor(years);
          return [
            `${years} năm`,
            formatVND(loan.firstMonthPayment),
            formatVND(loan.schedule[loan.schedule.length - 1].totalPayment),
            formatCompactVND(loan.totalInterest),
          ];
        })}
      />
      <P>
        Vay dài hạn hơn giúp tiền trả mỗi tháng nhẹ hơn, nhưng tổng tiền lãi tăng mạnh. Nếu đủ sức, trả trước một phần
        gốc khi hết thời gian phạt trả trước là cách tiết kiệm lãi hiệu quả.
      </P>
    </ToolPageShell>
  );
}
