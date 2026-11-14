import type { Metadata } from 'next';
import WizardContainer from '@/components/depositguard/wizard/WizardContainer';

export const metadata: Metadata = {
  title: 'Kiểm Tra Khả Năng Mua Nhà 100% Ẩn Danh | EvolveTech DepositGuard',
  description:
    'Mô phỏng áp lực trả nợ ngân hàng, rủi ro lãi suất thả nổi và dự báo điểm đáy quỹ dự phòng tài chính trước khi xuống tiền đặt cọc nhà.',
  alternates: {
    canonical: 'https://www.evolvetech.biz.vn/kiem-tra-mua-nha',
  },
};

export default function KiemTraMuaNhaPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-4 sm:py-8">
      <WizardContainer />
    </div>
  );
}
