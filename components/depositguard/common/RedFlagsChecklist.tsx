"use client";
import { useState } from "react";
import Link from "next/link";
const ITEMS = [
  [
    "floating",
    "Chưa rõ lãi suất sau ưu đãi",
    "Cần biết chỉ số tham chiếu, biên độ và chu kỳ điều chỉnh trong đề nghị vay.",
  ],
  [
    "cash",
    "Chưa tính đủ tiền mặt và dự phòng",
    "Tách vốn trả vào giá nhà, chi phí nhận nhà và khoản tiền muốn giữ lại.",
  ],
  [
    "valuation",
    "Chưa rõ số tiền ngân hàng có thể giải ngân",
    "Giá định giá và hạn mức có thể khác với giả định dựa trên giá mua.",
  ],
  [
    "income",
    "Chưa thử tình huống thu nhập giảm",
    "Mô phỏng tác động lên chi tiêu, khoản trả nợ và số dư dự phòng.",
  ],
  [
    "deposit",
    "Chưa làm rõ điều kiện và lịch thanh toán cọc",
    "Trao đổi với người có chuyên môn về trường hợp khoản vay không được duyệt và thời hạn thanh toán.",
  ],
] as const;
export default function RedFlagsChecklist() {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <section className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
      <header className="bg-navy-900 text-white p-6 sm:p-8 space-y-3">
        <p className="text-blue-200">
          Những điều cần xác nhận trước khi đặt cọc
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold">
          Tự kiểm tra 5 điểm cần làm rõ
        </h2>
        <p className="text-slate-200">
          Đánh dấu thông tin bạn còn thiếu. Checklist không phải kết luận căn
          nhà hoặc giao dịch an toàn.
        </p>
      </header>
      <div className="p-6 sm:p-8 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {ITEMS.map(([id, title, detail]) => (
            <label
              key={id}
              className="flex gap-3 rounded-2xl border border-slate-200 p-4 cursor-pointer hover:border-primary-700"
            >
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 shrink-0 accent-primary-700"
                checked={selected.includes(id)}
                onChange={() =>
                  setSelected((s) =>
                    s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
                  )
                }
              />
              <span>
                <strong className="block">{title}</strong>
                <span className="block text-slate-600 mt-2 leading-relaxed">
                  {detail}
                </span>
              </span>
            </label>
          ))}
        </div>
        <p role="status" className="rounded-xl bg-blue-50 p-4 text-primary-800">
          {selected.length
            ? `Bạn đã chọn ${selected.length}/5 điểm cần làm rõ. Hãy xác nhận thông tin và thử các kịch bản trước khi quyết định.`
            : "Chưa chọn điểm cần làm rõ. Bạn vẫn có thể kiểm tra dòng tiền với số liệu của mình."}
        </p>
        <Link
          href="/kiem-tra-mua-nha"
          className="inline-block rounded-xl bg-primary-700 hover:bg-primary-800 text-white px-6 py-3 font-semibold"
        >
          Kiểm tra miễn phí →
        </Link>
      </div>
    </section>
  );
}
