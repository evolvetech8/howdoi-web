"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { OFFER } from "@/lib/depositguard/offer";
export default function IntakeForm({ kind }: { kind: "contact" | "report" }) {
  const [pending, setPending] = useState(false),
    [error, setError] = useState(""),
    [receipt, setReceipt] = useState("");
  const submission = useRef({ signature: "", id: "" });
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    const form = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = {
      email: form.get("email"),
      name: form.get("name"),
      honeypot: form.get("website"),
      consentVersion: OFFER.consentVersion,
    };
    if (kind === "contact")
      Object.assign(payload, {
        category: form.get("category"),
        message: form.get("message"),
      });
    else
      Object.assign(payload, {
        offerVersion: OFFER.version,
        serviceConsent: true,
        purchaseWindow: form.get("purchaseWindow"),
        hasProperty: form.get("hasProperty") === "on",
        hasLoanOffer: form.get("hasLoanOffer") === "on",
        need: form.get("need"),
      });
    const signature = JSON.stringify(payload);
    if (submission.current.signature !== signature)
      submission.current = { signature, id: crypto.randomUUID() };
    setPending(true);
    setError("");
    try {
      const r = await fetch(
        kind === "contact" ? "/api/contact" : "/api/report-requests",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            submissionId: submission.current.id,
          }),
        },
      );
      const data = await r.json();
      if (!r.ok || !data.success || !data.requestCode)
        throw new Error(data.message || "Chưa thể gửi. Vui lòng thử lại.");
      setReceipt(data.requestCode);
      if (kind === "report") {
        try {
          sessionStorage.setItem("dg_receipt", data.requestCode);
        } catch {}
        window.location.assign("/dang-ky-ra-soat/hoan-tat");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Mất kết nối. Nội dung được giữ lại để thử gửi.",
      );
    } finally {
      setPending(false);
    }
  }
  if (receipt)
    return (
      <div
        role="status"
        className="rounded-2xl border border-blue-200 bg-blue-50 p-6"
      >
        <h2 className="font-bold text-xl">Đã tiếp nhận yêu cầu</h2>
        <p>Mã tham chiếu: {receipt}</p>
        <p>
          Đây chưa phải xác nhận nhận tiền hay email đã được giao. Bạn có thể
          liên hệ archonic88@gmail.com kèm mã này.
        </p>
      </div>
    );
  const input =
    "block w-full rounded-xl border border-slate-300 bg-white p-3 mt-2";
  return (
    <form
      onSubmit={submit}
      className="space-y-5 bg-white border border-slate-200 rounded-3xl p-6"
    >
      <label className="hidden" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="block">
        Tên hoặc biệt danh (không bắt buộc)
        <input
          className={input}
          name="name"
          maxLength={80}
          autoComplete="name"
        />
      </label>
      <label className="block">
        Email nhận phản hồi
        <input
          className={input}
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
        />
      </label>
      {kind === "contact" ? (
        <>
          <label className="block">
            Nội dung liên hệ
            <select className={input} name="category">
              <option value="calculation">Phép tính</option>
              <option value="bug">Báo lỗi</option>
              <option value="ux">Trải nghiệm</option>
              <option value="feature">Đề xuất</option>
              <option value="other">Khác</option>
            </select>
          </label>
          <label className="block">
            Chi tiết
            <textarea
              className={input}
              name="message"
              required
              minLength={10}
              maxLength={3000}
              rows={5}
            />
          </label>
        </>
      ) : (
        <>
          <label className="block">
            Dự kiến đặt cọc
            <select name="purchaseWindow" className={input}>
              <option value="within_30_days">Trong 30 ngày</option>
              <option value="31_60_days">31–60 ngày</option>
              <option value="later">Sau 60 ngày</option>
              <option value="exploring">Đang tìm hiểu</option>
            </select>
          </label>
          <label className="block">
            <input type="checkbox" name="hasProperty" /> Tôi đã có căn nhà cụ
            thể
          </label>
          <label className="block">
            <input type="checkbox" name="hasLoanOffer" /> Tôi đã có báo giá vay
          </label>
          <label className="block">
            Điều cần làm rõ
            <select className={input} name="need">
              <option value="affordability">Khoản vay có vừa sức không?</option>
              <option value="compare">So sánh hai đề nghị vay</option>
              <option value="rate_reset">Áp lực sau ưu đãi</option>
            </select>
          </label>
        </>
      )}
      <p className="text-sm text-slate-600">
        Không gửi CCCD, tài khoản ngân hàng, hợp đồng nguyên bản hoặc địa chỉ
        nhà. Form này không tự đính kèm số liệu mô phỏng.
      </p>
      <label className="flex items-start gap-3">
        <input type="checkbox" required className="mt-1" />{" "}
        <span>
          Tôi đồng ý gửi những thông tin trên để xử lý yêu cầu theo{" "}
          <Link href="/bao-mat" className="underline text-primary-800">
            chính sách dữ liệu
          </Link>
          {kind === "report"
            ? " và đã đọc phạm vi dịch vụ, giá 299.000đ cùng điều kiện hủy/hoàn."
            : "."}
        </span>
      </label>
      {error && (
        <p role="alert" className="text-rose-700">
          {error}
        </p>
      )}
      <button
        disabled={pending}
        className="rounded-xl bg-primary-700 hover:bg-primary-800 disabled:opacity-60 text-white px-6 py-3 min-h-11 font-semibold"
      >
        {pending
          ? "Đang gửi…"
          : kind === "contact"
            ? "Gửi phản hồi"
            : "Gửi yêu cầu rà soát"}
      </button>
      <p className="text-sm">
        Nếu chưa gửi được:{" "}
        <a className="underline" href="mailto:archonic88@gmail.com">
          archonic88@gmail.com
        </a>
        .
      </p>
    </form>
  );
}
