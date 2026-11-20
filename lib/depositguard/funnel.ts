import { z } from "zod";
export const funnelSchema = z
  .object({
    event: z.enum([
      "landing_viewed",
      "wizard_started",
      "wizard_completed",
      "sample_viewed",
      "service_viewed",
      "service_cta_clicked",
    ]),
    source: z
      .enum(["direct", "community", "search", "referral"])
      .default("direct"),
  })
  .strict();
export type FunnelEvent = z.infer<typeof funnelSchema>["event"];
export function trackFunnel(event: FunnelEvent) {
  if (typeof window === "undefined") return;
  let source = "direct";
  try {
    const allowed = ["direct", "community", "search", "referral"];
    const saved = sessionStorage.getItem("dg_source");
    const incoming = new URLSearchParams(window.location.search).get(
      "utm_source",
    );
    source =
      saved && allowed.includes(saved)
        ? saved
        : incoming && allowed.includes(incoming)
          ? incoming
          : "direct";
    sessionStorage.setItem("dg_source", source);
  } catch {
    /* attribution is optional */
  }
  const record = { event, source };
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record),
    keepalive: true,
  }).catch(() => undefined);
}
