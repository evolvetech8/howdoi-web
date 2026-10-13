import type { Metadata } from 'next';
import Link from 'next/link';
import BudgetCalc from '@/components/calculators/BudgetCalc';
import ToolPageShell, { type Faq } from '@/components/ToolPageShell';
import { H2, P, UL, Table } from '@/components/Prose';
import { getTool, toolPath } from '@/content/tools';
import { calculate503020, formatVND } from '@/lib/finance-math';

const tool = getTool('ngan-sach-50-30-20');

export const metadata: Metadata = {
  title: tool.title,
  description: tool.description,
  alternates: { canonical: toolPath(tool.slug) },
  openGraph: { title: tool.title, description: tool.description, url: toolPath(tool.slug), type: 'website' },
};

const incomes = [8, 10, 15, 20, 30].map((m) => m * 1_000_000);
const ten = calculate503020(10_000_000);

const faqs: Faq[] = [
  {
    q: 'Lương 10 triệu chi tiêu thế nào cho đủ?',
    a: (
      <>
        Theo 50/30/20: khoảng {formatVND(ten.needs)} cho chi phí thiết yếu, {formatVND(ten.wants)} cho mong muốn cá nhân
        và {formatVND(ten.savings)} để dành. Nếu tiền nhà và ăn uống đã vượt 5 triệu, hãy tạm dùng tỷ lệ 60/20/20 hoặc
        70/10/20, nhưng cố giữ phần để dành, dù chỉ 10%.
      </>
    ),
  },
  {
    q: 'Nên nhập lương Gross hay lương Net?',
    a: (
      <>
        Lương Net, tức số tiền thực về tài khoản sau bảo hiểm và thuế. Nếu chỉ biết lương Gross, hãy tính lương Net trước
        bằng <Link href={toolPath('luong-gross-net')} className="underline hover:text-emerald-700">công cụ Gross ↔ Net</Link>.
      </>
    ),
  },
  {
    q: '50/30/20 hay 6 chiếc lọ thì tốt hơn?',
    a: (
      <>
        50/30/20 đơn giản, hợp với người mới bắt đầu. 6 chiếc lọ chia chi tiết hơn (giáo dục, hưởng thụ, cho đi...), hợp
        với người đã quen theo dõi chi tiêu. Cách nào bạn duy trì được lâu thì cách đó tốt hơn.
      </>
    ),
  },
];

export default function BudgetPage() {
  return (
    <ToolPageShell
      tool={tool}
      intro={
        <p>
          Nhập thu nhập thực nhận mỗi tháng để biết nên dành bao nhiêu cho chi phí thiết yếu, mong muốn cá nhân và tiết
          kiệm. Có hai cách chia: quy tắc 50/30/20 và phương pháp 6 chiếc lọ.
        </p>
      }
      calculator={<BudgetCalc />}
      faqs={faqs}
    >
      <H2 id="50-30-20">Quy tắc 50/30/20 là gì?</H2>
      <UL>
        <li>
          <strong>50% thiết yếu:</strong> tiền nhà, điện nước, ăn uống, đi lại, trả nợ tối thiểu, những khoản không thể
          bỏ.
        </li>
        <li>
          <strong>30% mong muốn:</strong> cà phê, ăn ngoài, mua sắm, du lịch, giải trí.
        </li>
        <li>
          <strong>20% tương lai:</strong> quỹ khẩn cấp, tiết kiệm, đầu tư, trả nợ sớm.
        </li>
      </UL>
      <P>
        Mẹo quan trọng nhất: chuyển 20% để dành ngay ngày nhận lương, trước khi tiêu. Phần còn lại mới chia cho chi tiêu.
      </P>

      <H2 id="bang-chia">Bảng chia lương theo 50/30/20</H2>
      <Table
        head={['Lương thực nhận', 'Thiết yếu (50%)', 'Mong muốn (30%)', 'Để dành (20%)']}
        rows={incomes.map((income) => {
          const b = calculate503020(income);
          return [formatVND(income), formatVND(b.needs), formatVND(b.wants), formatVND(b.savings)];
        })}
      />
      <P>
        Ở thành phố lớn, chi phí thiết yếu với mức lương dưới 15 triệu thường vượt 50%. Đó không phải thất bại. Hãy coi
        50/30/20 là đích đến và giảm dần tỷ lệ thiết yếu qua từng tháng.
      </P>
    </ToolPageShell>
  );
}
