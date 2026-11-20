"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeroLivePreview from "@/components/depositguard/common/HeroLivePreview";
import RedFlagsChecklist from "@/components/depositguard/common/RedFlagsChecklist";
import ServiceCard from "@/components/depositguard/common/ServiceCard";
import { EXAMPLES, evaluateExample } from "@/lib/depositguard/examples";
import { useSimulation } from "@/lib/depositguard/context";
import { formatVND } from "@/lib/depositguard/formatters";
export default function Home() {
  const { loadScenario, hasSimulated, hasUserChanges } = useSimulation();
  const router = useRouter();
  return (
    <div className="space-y-16 pb-16">
      <section className="bg-gradient-to-b from-white to-blue-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-5 py-12 grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <p className="text-primary-800 font-semibold">
              DepositGuard • Chuẩn bị tài chính trước khi mua nhà
            </p>
            <h1 className="text-4xl sm:text-5xl leading-tight font-bold text-navy-900">
              Trước khi đặt cọc, hãy biết khoản vay này có vừa sức gia đình bạn.
            </h1>
            <p className="text-lg leading-relaxed text-slate-600">
              Xem khoản trả sau ưu đãi, tiền còn lại sau sinh hoạt và sức chịu
              đựng khi lãi tăng hoặc thu nhập giảm. Kiểm tra với số liệu của bạn
              trước khi cam kết khoản tiền lớn.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/kiem-tra-mua-nha"
                className="bg-primary-700 hover:bg-primary-800 text-white rounded-xl px-6 py-3 font-semibold"
              >
                Kiểm tra trước khi đặt cọc
              </Link>
              <Link
                href="/bao-cao-mau"
                className="bg-white border border-slate-300 rounded-xl px-6 py-3"
              >
                Xem báo cáo mẫu
              </Link>
            </div>
            <p className="text-sm text-slate-600">
              Miễn phí • Không cần đăng nhập • Thông số được xử lý trên thiết bị
            </p>
            <p className="text-sm text-slate-500">
              Mô phỏng tài chính, không phải xác nhận tín dụng hoặc thẩm định
              pháp lý căn nhà.
            </p>
          </div>
          <HeroLivePreview />
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-5 space-y-16">
        <RedFlagsChecklist />
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-navy-900">
            Ba tình huống gia đình trước khi mua nhà
          </h2>
          <p className="text-slate-600">
            Tình huống giả định minh họa, không phải hồ sơ khách hàng thật. Lãi
            sau ưu đãi là giả định để kiểm tra dòng tiền.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {EXAMPLES.map((example) => {
              const { result } = evaluateExample(example);
              return (
                <article
                  key={example.id}
                  className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4"
                >
                  <h3 className="text-xl font-bold">{example.title}</h3>
                  <p>
                    Vay {formatVND(example.loan.loanAmount)} trong{" "}
                    {example.loan.loanTermMonths} tháng.
                  </p>
                  <dl className="space-y-2">
                    <dt>Khoản trả tháng đầu</dt>
                    <dd className="font-mono">
                      {formatVND(result.month1Payment)}
                    </dd>
                    <dt>
                      Tháng {result.postPromoMonth} — lãi{" "}
                      {example.loan.postPromoRate}%
                    </dt>
                    <dd className="font-mono">
                      {formatVND(result.postPromoPayment)}
                    </dd>
                  </dl>
                  <p
                    className={
                      result.firstNegativeCashFlowMonth
                        ? "text-rose-700"
                        : "text-primary-800"
                    }
                  >
                    {result.firstNegativeCashFlowMonth
                      ? `Dòng tiền thiếu hụt từ tháng ${result.firstNegativeCashFlowMonth}.`
                      : "Không có tháng âm dòng tiền trong giả định này."}
                  </p>
                  <button
                    className="text-primary-800 underline min-h-11"
                    onClick={() => {
                      if (
                        (hasSimulated || hasUserChanges) &&
                        !window.confirm("Thay hồ sơ hiện tại bằng ví dụ này?")
                      )
                        return;
                      loadScenario(example.loan, example.household);
                      router.push("/ket-qua");
                    }}
                  >
                    Mở kịch bản minh họa →
                  </button>
                </article>
              );
            })}
          </div>
        </section>
        <section className="rounded-3xl border bg-white p-8 space-y-4">
          <h2 className="text-3xl font-bold">
            Một báo cáo để hiểu và trao đổi
          </h2>
          <p>
            Nhìn rõ giả định, thời điểm thay đổi khoản trả, mức vay theo dòng
            tiền và phần vốn cần chuẩn bị. Bản in tự phục vụ luôn miễn phí.
          </p>
          <Link
            href="/bao-cao-mau"
            className="inline-block text-primary-800 underline py-3"
          >
            Xem cấu trúc và số liệu báo cáo mẫu →
          </Link>
        </section>
        <section className="grid md:grid-cols-3 gap-6">
          {[
            [
              "Phương pháp minh bạch",
              "Số liệu được tính từ mô hình xác định; mỗi kết luận gắn với giả định cụ thể.",
              "/cach-tinh",
            ],
            [
              "Biết ai vận hành",
              "EvolveTech / Archonic phát triển sản phẩm. Xem phạm vi, trách nhiệm và cách liên hệ.",
              "/ve-evolvetech",
            ],
            [
              "Chủ động với dữ liệu",
              "Mô phỏng ở thiết bị. Chỉ thông tin bạn gửi qua form mới được tiếp nhận để xử lý yêu cầu.",
              "/bao-mat",
            ],
          ].map(([title, text, url]) => (
            <article key={url} className="space-y-3">
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="text-slate-600">{text}</p>
              <Link
                href={url}
                className="inline-block py-3 text-primary-800 underline"
              >
                Tìm hiểu →
              </Link>
            </article>
          ))}
        </section>
        <ServiceCard />
        <section className="grid sm:grid-cols-2 gap-6">
          <Link href="/huong-dan" className="border rounded-2xl bg-white p-7">
            <h2 className="text-2xl font-bold">Cẩm nang trước đặt cọc</h2>
            <p className="mt-3">
              Lãi suất, ân hạn, chi phí và các câu hỏi cần xác nhận với ngân
              hàng.
            </p>
          </Link>
          <Link href="/cap-nhat" className="border rounded-2xl bg-white p-7">
            <h2 className="text-2xl font-bold">Cập nhật sản phẩm</h2>
            <p className="mt-3">
              Theo dõi phiên bản, cải tiến và phạm vi đang hỗ trợ.
            </p>
          </Link>
        </section>
        <section className="space-y-4">
          <h2 className="text-3xl font-bold">Trước khi bắt đầu</h2>
          {[
            [
              "Có cần cung cấp số điện thoại không?",
              "Không. Bạn có thể hoàn tất mô phỏng và in kết quả mà không đăng ký.",
            ],
            [
              "Kết quả có bảo đảm được vay không?",
              "Không. Kết quả phản ánh giả định bạn nhập; ngân hàng xét duyệt riêng. Công cụ không kiểm tra pháp lý căn nhà.",
            ],
            [
              "Khi nào cần dịch vụ có người hỗ trợ?",
              "Khi bạn muốn rà soát thông số và hiểu sự khác biệt giữa các phương án. Kết quả rủi ro vẫn được xem miễn phí.",
            ],
          ].map(([q, a]) => (
            <details key={q} className="border-b py-4">
              <summary className="cursor-pointer font-semibold">{q}</summary>
              <p className="pt-3 text-slate-600">{a}</p>
            </details>
          ))}
          <Link
            href="/kiem-tra-mua-nha"
            className="inline-block bg-primary-700 hover:bg-primary-800 text-white rounded-xl px-6 py-3"
          >
            Bắt đầu kiểm tra miễn phí
          </Link>
        </section>
      </div>
    </div>
  );
}
