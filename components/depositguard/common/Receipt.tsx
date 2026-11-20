"use client";
import { useEffect, useState } from "react";
export default function Receipt() {
  const [code, setCode] = useState("");
  useEffect(() => {
    try {
      const value = sessionStorage.getItem("dg_receipt") || "";
      if (/^DG-[A-F0-9]{12}$/.test(value)) setCode(value);
    } catch {}
  }, []);
  return (
    <div role="status" className="space-y-4">
      {code ? (
        <>
          <p>
            Đã tiếp nhận yêu cầu: <strong>{code}</strong>.
          </p>
          <p>
            Người vận hành sẽ phản hồi trong một ngày làm việc. Đây chưa phải
            xác nhận thanh toán.
          </p>
        </>
      ) : (
        <p>
          Không có mã yêu cầu trong tab này. Nếu đã gửi, hãy dùng mã đã nhận khi
          liên hệ hỗ trợ.
        </p>
      )}
      <a className="underline" href="mailto:archonic88@gmail.com">
        Liên hệ archonic88@gmail.com
      </a>
    </div>
  );
}
