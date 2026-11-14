'use client';

import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { trackEvent } from '@/lib/depositguard/telemetry';

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-rate-reset-cliff',
    category: 'Lãi suất & Trả nợ',
    question: 'Vì sao số tiền trả ngân hàng thường tăng mạnh ở tháng 13 hoặc tháng 25?',
    answer:
      'Các gói vay mua nhà tại Việt Nam thường áp dụng lãi suất ưu đãi thấp (ví dụ 6,0% – 8,0%/năm) trong 12 hoặc 24 tháng đầu. Khi hết thời gian ưu đãi, lãi suất chuyển sang cơ chế thả nổi (thường tính bằng Lãi suất tiết kiệm 12/24 tháng hoặc Lãi suất cơ sở cộng biên độ 3,5% – 4,5%/năm). Sự chênh lệch 4–6 điểm phần trăm này tạo ra "vách đá lãi suất" khiến tiền lãi hàng tháng tăng vọt ngay tháng kế tiếp.',
  },
  {
    id: 'faq-equal-principal-vs-annuity',
    category: 'Lãi suất & Trả nợ',
    question: 'Nên chọn trả gốc đều (dư nợ giảm dần) hay trả góp đều hàng tháng (niên kim)?',
    answer:
      'Với phương thức Dư nợ giảm dần (Equal Principal), tiền gốc trả hàng tháng cố định và tiền lãi giảm dần theo thời gian; tổng tiền lãi cả đời khoản vay thấp hơn nhưng áp lực trả nợ những năm đầu cao hơn. Với phương thức Niên kim (Annuity), tổng tiền trả mỗi tháng bằng nhau trong cùng một mức lãi suất (tháng đầu nhẹ hơn), nhưng dư nợ gốc giảm chậm hơn ở những năm đầu nên tổng lãi phải trả cao hơn và khi lãi suất thả nổi tăng, khoản trả hàng tháng cũng được tính lại tăng mạnh.',
  },
  {
    id: 'faq-grace-period-risk',
    category: 'Lãi suất & Trả nợ',
    question: 'Ân hạn nợ gốc có thực sự giúp việc mua nhà nhẹ nhàng hơn không?',
    answer:
      'Trong thời gian ân hạn nợ gốc (ví dụ 12 hoặc 24 tháng), bạn chỉ phải trả tiền lãi mà chưa phải trả tiền gốc. Tuy nhiên, nợ gốc không hề mất đi mà sẽ được chia đều hoặc phân bổ lại vào số tháng còn lại sau khi hết ân hạn. Nếu thời điểm hết ân hạn gốc trùng với thời điểm hết lãi suất ưu đãi, số tiền phải trả hàng tháng sẽ chịu tác động kép (vừa bắt đầu trả gốc, vừa chịu lãi thả nổi cao hơn).',
  },
  {
    id: 'faq-dti-vs-bank-approval',
    category: 'Dòng tiền & Quỹ dự phòng',
    question: 'Tỷ lệ trả nợ trên thu nhập (DTI) trên DepositGuard có giống cách ngân hàng duyệt vay không?',
    answer:
      'Không. Tỷ lệ DTI hiển thị trên DepositGuard là tỷ lệ dòng tiền thực tế của hộ gia đình (Tổng nghĩa vụ nợ hàng tháng chia cho Thu nhập thực nhận Net). Mỗi ngân hàng có quy tắc thẩm định nguồn thu, khấu trừ chi phí sinh hoạt tối thiểu và trần DSR/DTI nội bộ riêng biệt. Một kịch bản hiển thị "Dư địa dự phòng an toàn" trên công cụ không đồng nghĩa với việc ngân hàng sẽ phê duyệt khoản vay đó.',
  },
  {
    id: 'faq-emergency-reserve-floor',
    category: 'Dòng tiền & Quỹ dự phòng',
    question: 'Quỹ dự phòng khẩn cấp nên giữ ở mức bao nhiêu khi mua nhà?',
    answer:
      'Thông thường, hộ gia đình mua nhà để ở nên giữ lại tối thiểu từ 3 đến 6 tháng chi phí sinh hoạt thiết yếu cộng nghĩa vụ trả nợ dưới dạng tiền gửi thanh khoản cao sau khi đã thanh toán tiền đặt cọc, vốn tự có, thuế phí sang tên và nội thất cơ bản. Việc dốc sạch 100% tiền tiết kiệm vào tiền mua nhà khiến gia đình dễ rơi vào khủng hoảng nếu thu nhập giảm tạm thời hoặc lãi suất tăng.',
  },
  {
    id: 'faq-bank-day-count-difference',
    category: 'Phương pháp & Phạm vi',
    question: 'Vì sao số tiền lãi trên bảng tính của ngân hàng lệch vài chục nghìn đồng so với DepositGuard?',
    answer:
      'DepositGuard sử dụng quy ước chuẩn theo tháng (lãi suất năm chia đều cho 12 tháng: i = r / 12) để đảm bảo tính nhất quán khi mô phỏng dài hạn 20–30 năm. Nhiều ngân hàng thương mại tính lãi theo số ngày thực tế trong từng tháng dương lịch (28, 30 hoặc 31 ngày) chia cho 365 hoặc 360 ngày (actual/365 hoặc actual/360) và phụ thuộc vào ngày giải ngân cụ thể.',
  },
  {
    id: 'faq-privacy-on-device',
    category: 'Quyền riêng tư & Bảo mật',
    question: 'EvolveTech DepositGuard có lưu trữ mức lương, giá nhà hay số tiền vay của tôi không?',
    answer:
      'Không. Toàn bộ quá trình mô phỏng chạy trực tiếp trên trình duyệt của thiết bị (client-side). Chúng tôi không yêu cầu họ tên, số điện thoại, căn cước hay email để sử dụng bộ mô phỏng miễn phí, và tuyệt đối không đính kèm số liệu tài chính của bạn vào đường dẫn URL hay hệ thống phân tích.',
  },
  {
    id: 'faq-legal-and-valuation-scope',
    category: 'Phương pháp & Phạm vi',
    question: 'Công cụ này có kiểm tra pháp lý sổ đỏ hay tính hợp lệ của hợp đồng đặt cọc không?',
    answer:
      'Không. DepositGuard chỉ mô phỏng dòng tiền và nghĩa vụ trả nợ dựa trên các giả định tài chính bạn nhập vào. Trước khi đặt cọc, bạn cần tự kiểm tra hoặc thuê luật sư/đơn vị độc lập để xác minh giấy chứng nhận quyền sử dụng đất (sổ đỏ/sổ hồng), quy hoạch, giấy phép xây dựng, uy tín chủ đầu tư và điều khoản phạt cọc.',
  },
];

export default function FaqAccordion() {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-rate-reset-cliff': true,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const nextOpen = !prev[id];
      if (nextOpen) {
        trackEvent('faq_accordion_opened', { question_id: id });
      }
      return { ...prev, [id]: nextOpen };
    });
  };

  const filteredItems = FAQ_ITEMS.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm câu hỏi (ví dụ: lãi thả nổi, ân hạn gốc, DTI, bảo mật...)"
          aria-label="Tìm kiếm câu hỏi thường gặp"
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        />
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isOpen = !!openIds[item.id];
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs"
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                aria-expanded={isOpen}
                aria-controls={`panel-${item.id}`}
                id={`button-${item.id}`}
                className="w-full text-left p-5 flex items-start justify-between gap-4 hover:bg-slate-50/70 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500/20 min-h-[56px]"
              >
                <div className="space-y-1">
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                    {item.category}
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">
                    {item.question}
                  </h2>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 mt-1 transition-transform ${
                    isOpen ? 'rotate-180 text-emerald-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div
                  id={`panel-${item.id}`}
                  role="region"
                  aria-labelledby={`button-${item.id}`}
                  className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100"
                >
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-sm text-slate-500">
            Không tìm thấy câu hỏi phù hợp với từ khóa &ldquo;{searchQuery}&rdquo;.
          </div>
        )}
      </div>
    </div>
  );
}
