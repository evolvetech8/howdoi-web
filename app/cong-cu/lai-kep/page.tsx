import type { Metadata } from 'next';
import CompoundInterestCalc from '@/components/calculators/CompoundInterestCalc';
import ToolPageShell, { type Faq } from '@/components/ToolPageShell';
import { H2, P, UL, Table } from '@/components/Prose';
import { getTool, toolPath } from '@/content/tools';
import {
  calculateCompoundInterest,
  calculateMonthlyContributionForTarget,
  formatCompactVND,
  formatVND,
} from '@/lib/finance-math';

const tool = getTool('lai-kep');

export const metadata: Metadata = {
  title: tool.title,
  description: tool.description,
  alternates: { canonical: toolPath(tool.slug) },
  openGraph: { title: tool.title, description: tool.description, url: toolPath(tool.slug), type: 'website' },
};

const TARGET = 1_000_000_000;
const rates = [5, 8, 10];
const horizons = [5, 10, 15, 20];

const example = calculateCompoundInterest({
  initialInvestment: 0,
  monthlyContribution: 3_000_000,
  annualRate: 8,
  years: 15,
}).summary;

const faqs: Faq[] = [
  {
    q: 'Mỗi tháng để dành bao nhiêu để có 1 tỷ?',
    a: (
      <>
        Phụ thuộc vào thời gian và lợi nhuận. Bắt đầu từ 0 đồng, với lợi nhuận 8%/năm, bạn cần góp khoảng{' '}
        <strong>
          {formatVND(calculateMonthlyContributionForTarget({ target: TARGET, initialInvestment: 0, annualRate: 8, years: 15 }))}
        </strong>{' '}
        mỗi tháng trong 15 năm, hoặc khoảng{' '}
        <strong>
          {formatVND(calculateMonthlyContributionForTarget({ target: TARGET, initialInvestment: 0, annualRate: 8, years: 10 }))}
        </strong>{' '}
        mỗi tháng nếu muốn đạt trong 10 năm. Xem bảng đầy đủ ở trên.
      </>
    ),
  },
  {
    q: 'Nên nhập lãi suất bao nhiêu?',
    a: (
      <>
        Hãy nhập con số thận trọng. Gửi tiết kiệm cho lãi suất thấp nhưng chắc chắn. Chứng chỉ quỹ, cổ phiếu có thể cho
        lợi nhuận trung bình cao hơn trong dài hạn nhưng không được đảm bảo và có năm lỗ. Nếu không chắc, hãy thử cả hai
        mức thấp và cao để thấy khoảng kết quả có thể xảy ra.
      </>
    ),
  },
  {
    q: 'Kết quả đã trừ lạm phát chưa?',
    a: (
      <>
        Chưa. Con số là giá trị danh nghĩa trong tương lai. 1 tỷ sau 15 năm sẽ mua được ít hơn 1 tỷ hôm nay. Muốn ước
        lượng sức mua thật, bạn có thể nhập lãi suất đã trừ đi lạm phát (ví dụ lợi nhuận 8%, lạm phát 3,5% thì nhập
        khoảng 4,5%).
      </>
    ),
  },
];

export default function CompoundInterestPage() {
  return (
    <ToolPageShell
      tool={tool}
      intro={
        <p>
          Nhập số vốn ban đầu, số tiền góp thêm mỗi tháng, lợi nhuận kỳ vọng và số năm. Công cụ cho thấy tài sản tăng
          thế nào qua từng năm, bao nhiêu là tiền bạn bỏ ra và bao nhiêu là tiền lãi sinh ra.
        </p>
      }
      calculator={<CompoundInterestCalc />}
      faqs={faqs}
    >
      <H2 id="cach-tinh">Công cụ tính lãi kép như thế nào?</H2>
      <P>
        Mỗi tháng, khoản góp được cộng vào số dư ở đầu tháng, rồi toàn bộ số dư sinh lãi theo lãi suất năm chia 12. Tiền
        lãi không rút ra mà nhập vào gốc, nên tháng sau lãi được tính trên số tiền lớn hơn. Đó là “lãi mẹ đẻ lãi con”.
      </P>
      <P>
        Ví dụ: góp 3 triệu mỗi tháng với lợi nhuận 8%/năm trong 15 năm, bạn bỏ ra{' '}
        {formatCompactVND(example.totalContributions)} và có khoảng {formatCompactVND(example.futureValue)}. Phần{' '}
        {formatCompactVND(example.totalInterest)} chênh lệch là tiền lãi.
      </P>

      <H2 id="1-ty">Để có 1 tỷ, mỗi tháng cần góp bao nhiêu?</H2>
      <P>Bắt đầu từ 0 đồng, góp đều đầu mỗi tháng:</P>
      <Table
        head={['Thời gian', ...rates.map((rate) => `Lợi nhuận ${rate}%/năm`)]}
        rows={horizons.map((years) => [
          `${years} năm`,
          ...rates.map((annualRate) =>
            formatVND(calculateMonthlyContributionForTarget({ target: TARGET, initialInvestment: 0, annualRate, years })),
          ),
        ])}
      />
      <P>Hai điều rút ra từ bảng: bắt đầu sớm giảm mạnh số tiền cần góp, và lợi nhuận cao hơn chỉ phát huy khi có đủ thời gian.</P>

      <H2 id="gia-dinh">Những gì công cụ chưa tính đến</H2>
      <UL>
        <li>Lạm phát làm giảm sức mua của số tiền trong tương lai.</li>
        <li>Thuế, phí quản lý quỹ, phí giao dịch.</li>
        <li>Lợi nhuận thực tế lên xuống mỗi năm, không đều đặn như giả định.</li>
      </UL>
    </ToolPageShell>
  );
}
