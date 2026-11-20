import { beforeEach, afterEach, it, expect, vi } from "vitest";
vi.mock("@/lib/server/database", () => ({ database: vi.fn() }));
vi.mock("@/lib/server/notifications", () => ({
  dispatchNotifications: vi.fn(),
}));
import { database } from "@/lib/server/database";
import { dispatchNotifications } from "@/lib/server/notifications";
import { intake } from "@/lib/server/intake";
import { funnelSchema } from "@/lib/depositguard/funnel";
import { OFFER } from "@/lib/depositguard/offer";
const body = {
  submissionId: "d9a853fa-220e-4b0f-9127-b8b89b904105",
  email: "buyer@example.com",
  category: "calculation",
  message: "Question about the calculation",
  consentVersion: OFFER.consentVersion,
};
function request(data: unknown = body, origin = "http://localhost:3000") {
  return new Request("http://localhost:3000/api/contact", {
    method: "POST",
    headers: { origin, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("RATE_LIMIT_SECRET", "test-secret");
  vi.stubEnv("APP_ORIGIN", "http://localhost:3000");
  vi.stubEnv("REPORT_SERVICE_ENABLED", "false");
});
afterEach(() => vi.unstubAllEnvs());
it("persists before success and does not lose intake if notification fails", async () => {
  vi.mocked(database).mockResolvedValue({
    id: "id",
    code: "DG-123456789ABC",
    duplicate: false,
  });
  vi.mocked(dispatchNotifications).mockRejectedValue(new Error("email down"));
  const response = await intake(request(), "contact");
  expect(response.status).toBe(201);
  expect((await response.json()).requestCode).toBe("DG-123456789ABC");
  const args = vi.mocked(database).mock.calls[0][1] as any;
  expect(args.p_payload.email).toBe(body.email);
  expect(args.p_rate_key).not.toContain("local");
});
it("rejects extra fields including client paid or price", async () => {
  const r = await intake(request({ ...body, paid: true, price: 1 }), "contact");
  expect(r.status).toBe(400);
  expect(database).not.toHaveBeenCalled();
});
it("never shows success on database outage", async () => {
  vi.mocked(database).mockRejectedValue(new Error("SERVICE_UNAVAILABLE"));
  expect((await intake(request(), "contact")).status).toBe(503);
});
it("returns duplicate receipt and maps conflicts and rate limits", async () => {
  vi.mocked(database).mockResolvedValueOnce({
    id: "id",
    code: "DG-123456789ABC",
    duplicate: true,
  });
  expect((await intake(request(), "contact")).status).toBe(200);
  for (const [message, status] of [
    ["IDEMPOTENCY_CONFLICT", 409],
    ["RATE_LIMITED", 429],
  ] as const) {
    vi.mocked(database).mockRejectedValueOnce(new Error(message));
    expect((await intake(request(), "contact")).status).toBe(status);
  }
});
it("blocks foreign origins, oversized bodies and unavailable paid service", async () => {
  expect(
    (await intake(request(body, "https://evil.example"), "contact")).status,
  ).toBe(403);
  expect(
    (await intake(request({ ...body, message: "x".repeat(17000) }), "contact"))
      .status,
  ).toBe(413);
  expect((await intake(request(), "report")).status).toBe(503);
});
it("public analytics cannot encode financial outcomes or free text", () => {
  expect(
    funnelSchema.safeParse({ event: "wizard_completed", source: "direct" })
      .success,
  ).toBe(true);
  for (const extra of [
    { income: 1 },
    { status: "SAFE" },
    { text: "private" },
    { url: "https://site/?loan=123" },
  ])
    expect(
      funnelSchema.safeParse({ event: "wizard_completed", ...extra }).success,
    ).toBe(false);
});
it("configured report intake snapshots the server price and consent", async () => {
  for (const name of [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "RESEND_API_KEY",
    "MAIL_FROM",
    "SUPPORT_INBOX",
    "OPERATOR_NAME",
    "OPERATOR_BIO",
  ])
    vi.stubEnv(name, "configured");
  vi.stubEnv("REPORT_SERVICE_ENABLED", "true");
  vi.stubEnv("SERVICE_TERMS_CONFIRMED", "true");
  vi.mocked(database).mockResolvedValue({ id: "id", code: "DG-123456789ABC" });
  const payload = {
    submissionId: body.submissionId,
    email: body.email,
    consentVersion: OFFER.consentVersion,
    offerVersion: OFFER.version,
    serviceConsent: true,
    purchaseWindow: "31_60_days",
    hasProperty: true,
    hasLoanOffer: true,
    need: "compare",
  };
  expect((await intake(request(payload), "report")).status).toBe(201);
  expect((vi.mocked(database).mock.calls[0][1] as any).p_payload.priceVnd).toBe(
    299000,
  );
  expect(
    (await intake(request({ ...payload, paid: true }), "report")).status,
  ).toBe(400);
});

it("keeps production paid intake paused even when all service settings are enabled", async () => {
  for (const name of [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "RESEND_API_KEY",
    "MAIL_FROM",
    "SUPPORT_INBOX",
    "OPERATOR_NAME",
    "OPERATOR_BIO",
  ])
    vi.stubEnv(name, "configured");
  vi.stubEnv("REPORT_SERVICE_ENABLED", "true");
  vi.stubEnv("SERVICE_TERMS_CONFIRMED", "true");
  vi.stubEnv("VERCEL_ENV", "production");
  expect((await intake(request(), "report")).status).toBe(503);
  expect(database).not.toHaveBeenCalled();
});
