import type { Metadata } from 'next';
import Link from 'next/link';
import DebtPayoffCalc from '@/components/calculators/DebtPayoffCalc';
import ToolPageShell, { type Faq } from '@/components/ToolPageShell';
import { H2, P, UL, Table } from '@/components/Prose';
import { getTool, toolPath } from '@/content/tools';
import { EXAMPLE_DEBTS, EXAMPLE_EXTRA_PAYMENT } from '@/content/debt-example';
import { formatMonths, formatVND, simulateDebtPayoff } from '@/lib/finance-math';

const tool = getTool('ke-hoach-tra-no');

export const metadata: Metadata = {
  title: tool.title,
  description: tool.description,
  alternates: { canonical: toolPath(tool.slug) },
  openGraph: { title: tool.title, description: tool.description, url: toolPath(tool.slug), type: 'website' },
};

const snowball = simulateDebtPayoff(EXAMPLE_DEBTS, EXAMPLE_EXTRA_PAYMENT, 'snowball');
const avalanche = simulateDebtPayoff(EXAMPLE_DEBTS, EXAMPLE_EXTRA_PAYMENT, 'avalanche');
const minimum = simulateDebtPayoff(EXAMPLE_DEBTS, 0, 'minimum');
const firstWin = (items: typeof snowball.items) => items[0];

const faqs: Faq[] = [
  {
    q: 'Trả nợ thẻ tín dụng hay khoản vay trước?',
    a: (
      <>
        Theo cách tuyết lở, trả trước khoản có lãi suất cao hơn, thường là thẻ tín dụng nếu bạn đang để dư nợ qua kỳ sao
        kê. Theo cách quả cầu tuyết, trả trước khoản có dư nợ nhỏ hơn. Dù chọn cách nào, mọi khoản khác vẫn phải trả đủ
        mức tối thiểu đúng hạn để tránh phí phạt và bị ghi nhận nợ quá hạn vào lịch sử tín dụng (CIC).
      </>
    ),
  },
  {
    q: 'Có nên vay một khoản mới để trả hết các khoản cũ?',
    a: (
      <>
        Chỉ hợp lý khi lãi suất khoản mới thấp hơn thật sự sau khi đã tính mọi loại phí, và bạn không tiếp tục tiêu bằng
        thẻ cũ. Nếu không, bạn chỉ dời nợ từ chỗ này sang chỗ khác. Hãy nhập khoản vay mới vào công cụ để so sánh trước khi
        quyết định.
      </>
    ),
  },
  {
    q: 'Nhập lãi suất thẻ tín dụng thế nào?',
    a: (
      <>
        Lấy lãi suất năm trong biểu phí của ngân hàng hoặc trên sao kê. Nếu mỗi kỳ bạn trả hết dư nợ sao kê đúng hạn, thẻ
        thường không bị tính lãi, khi đó không cần đưa thẻ vào danh sách nợ.
      </>
    ),
  },
  {
    q: 'Vay người thân không lấy lãi có cần đưa vào không?',
    a: (
      <>
        Nên đưa vào để thấy đủ bức tranh. Theo cách tuyết lở, khoản không lãi sẽ được trả sau cùng. Bạn có thể ưu tiên
        trả sớm vì lý do tình cảm, công cụ chỉ so sánh về tiền.
      </>
    ),
  },
  {
    q: 'Công cụ có lưu số liệu nợ của tôi không?',
    a: 'Không. Mọi phép tính chạy ngay trên trình duyệt của bạn. HowDoI không gửi, không lưu số liệu bạn nhập.',
  },
];

export default function DebtPayoffPage() {
  return (
    <ToolPageShell
      tool={tool}
      intro={
        <p>
          Có nhiều khoản nợ cùng lúc thì nên trả khoản nào trước? Nhập các khoản nợ và số tiền bạn trả thêm được mỗi
          tháng, công cụ sẽ so sánh hai phương pháp phổ biến: quả cầu tuyết (Debt Snowball) và tuyết lở (Debt Avalanche).
          Bạn sẽ biết bao giờ hết nợ, tốn bao nhiêu tiền lãi và thứ tự trả cụ thể.
        </p>
      }
      calculator={<DebtPayoffCalc />}
      faqs={faqs}
    >
      <H2 id="hai-phuong-phap">Quả cầu tuyết và tuyết lở khác nhau thế nào?</H2>
      <P>
        Hai cách có chung một nguyên tắc: mỗi tháng trả đủ mức tối thiểu cho mọi khoản, rồi dồn toàn bộ tiền trả thêm vào
        một khoản duy nhất. Trả xong khoản đó, tiền của nó được dồn sang khoản tiếp theo, nên số tiền dồn vào khoản sau
        lớn dần như quả cầu tuyết lăn. Hai cách chỉ khác nhau ở thứ tự.
      </P>
      <Table
        head={['Phương pháp', 'Trả trước khoản', 'Điểm mạnh', 'Điểm yếu']}
        rows={[
          ['Quả cầu tuyết', 'Dư nợ nhỏ nhất', 'Sớm trả xong khoản đầu, dễ giữ động lực', 'Thường tốn lãi hơn'],
          ['Tuyết lở', 'Lãi suất cao nhất', 'Ít tiền lãi nhất', 'Khoản đầu có thể lâu mới xong'],
        ]}
      />

      <H2 id="vi-du">Ví dụ: 3 khoản nợ, trả {formatVND(snowball.monthlyPayment)} mỗi tháng</H2>
      <UL>
        {EXAMPLE_DEBTS.map((d) => (
          <li key={d.id}>
            {d.name}: dư nợ {formatVND(d.balance)}, lãi {d.annualRate}%/năm, trả tối thiểu {formatVND(d.minPayment)}/tháng
          </li>
        ))}
      </UL>
      <P>
        Tổng mức tối thiểu là {formatVND(minimum.monthlyPayment)}/tháng, cộng thêm {formatVND(EXAMPLE_EXTRA_PAYMENT)} trả
        thêm. Kết quả:
      </P>
      <Table
        head={['Cách trả', 'Khoản trả xong đầu tiên', 'Hết nợ sau', 'Tổng tiền lãi']}
        rows={[snowball, avalanche, minimum].map((r) => [
          r.strategy === 'snowball' ? 'Quả cầu tuyết' : r.strategy === 'avalanche' ? 'Tuyết lở' : 'Chỉ trả tối thiểu',
          r.strategy === 'minimum'
            ? '—'
            : `${firstWin(r.items).name} (sau ${formatMonths(firstWin(r.items).paidOffMonth ?? r.months)})`,
          r.feasible ? formatMonths(r.months) : 'Không trả hết',
          formatVND(r.totalInterest),
        ])}
      />
      <P>
        Tuyết lở tiết kiệm {formatVND(snowball.totalInterest - avalanche.totalInterest)} tiền lãi so với quả cầu tuyết.
        Quả cầu tuyết thì cho bạn trả xong khoản đầu tiên sớm hơn. Còn chênh lệch lớn nhất nằm ở việc có trả thêm hay
        không: chỉ trả tối thiểu thì tốn {formatVND(minimum.totalInterest)} tiền lãi và mất {formatMonths(minimum.months)}.
      </P>

      <H2 id="nen-chon">Nên chọn cách nào?</H2>
      <UL>
        <li>
          <strong>Chọn tuyết lở</strong> nếu bạn kỷ luật và khoản lãi cao (như thẻ tín dụng, vay tiêu dùng) chiếm phần
          lớn. Đây là cách tốn ít tiền nhất.
        </li>
        <li>
          <strong>Chọn quả cầu tuyết</strong> nếu bạn có nhiều khoản nhỏ, từng bắt đầu trả nợ rồi bỏ dở, hoặc cần thấy kết
          quả sớm để có động lực. Nhiều người trả hết nợ nhờ giữ được nhịp, chứ không phải nhờ chọn thứ tự tối ưu.
        </li>
        <li>
          <strong>Quan trọng hơn cả thứ tự:</strong> trả thêm được bao nhiêu mỗi tháng và không vay thêm trong lúc trả.
        </li>
      </UL>

      <H2 id="truoc-khi-bat-dau">Trước khi bắt đầu</H2>
      <UL>
        <li>Ngừng tạo nợ mới: cất thẻ tín dụng, tạm dừng mua trả góp.</li>
        <li>
          Giữ một khoản dự phòng nhỏ để khi có việc gấp không phải quẹt thẻ lại. Xem thêm{' '}
          <Link href="/huong-dan/quy-khan-cap-3-6-thang" className="underline hover:text-emerald-700">
            cách xây quỹ khẩn cấp
          </Link>
          .
        </li>
        <li>Kiểm tra lãi suất thật và phí trả trước hạn trong hợp đồng của từng khoản vay.</li>
        <li>
          Chưa biết mỗi tháng dư ra bao nhiêu để trả thêm? Bắt đầu với{' '}
          <Link href={toolPath('ngan-sach-50-30-20')} className="underline hover:text-emerald-700">
            công cụ chia ngân sách
          </Link>
          .
        </li>
      </UL>
    </ToolPageShell>
  );
}
