import Link from "next/link";
import { OFFER } from "@/lib/depositguard/offer";
export default function ServiceCard() {
  return (
    <section className="rounded-3xl bg-navy-900 text-white p-6 sm:p-9 space-y-4 print:hidden">
      <p className="text-blue-200 font-semibold">Hỗ trợ theo từng hồ sơ</p>
      <h2 className="text-2xl font-bold">
        Muốn có người cùng rà soát phương án vay?
      </h2>
      <p className="leading-relaxed text-slate-200">
        {OFFER.scope}. Bản tóm tắt 2–4 trang, trao đổi 30 phút và một lần sửa dữ
        kiện trong bảy ngày.
      </p>
      <p className="font-mono text-2xl">
        299.000đ <span className="font-sans text-base">/ hồ sơ pilot</span>
      </p>
      <p className="text-sm text-slate-300">
        Công cụ và bản in tự phục vụ vẫn miễn phí. Dịch vụ nhận yêu cầu trước,
        xác nhận phạm vi rồi mới thanh toán.
      </p>
      <Link
        className="inline-flex min-h-11 items-center rounded-xl bg-primary-700 hover:bg-primary-800 px-5 py-3 font-semibold"
        href="/ra-soat-ho-so-vay"
      >
        Xem phạm vi và tình trạng tiếp nhận →
      </Link>
    </section>
  );
}
