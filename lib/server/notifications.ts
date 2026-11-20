import { database } from "./database";
export async function dispatchNotifications(requestId?: string) {
  const key = process.env.RESEND_API_KEY,
    from = process.env.MAIL_FROM,
    inbox = process.env.SUPPORT_INBOX;
  if (!key || !from || !inbox) return;
  const jobs = await database("rpc/claim_notifications", {
    p_request: requestId || null,
  });
  for (const job of jobs || []) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `intake/${job.id}`,
        },
        body: JSON.stringify({
          from,
          to: [inbox],
          subject: `DepositGuard — yêu cầu ${job.code}`,
          text: `Có yêu cầu mới ${job.code}. Mở bảng intake_requests trong Supabase để xử lý. Không trả lời khách bằng dữ liệu từ analytics.`,
        }),
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) throw new Error("MAIL_FAILED");
      const result = await response.json();
      await database(
        `notification_outbox?id=eq.${job.id}`,
        { status: "sent", provider_id: result.id },
        "PATCH",
      );
    } catch {
      await database(
        `notification_outbox?id=eq.${job.id}`,
        { status: "pending" },
        "PATCH",
      );
    }
  }
}
