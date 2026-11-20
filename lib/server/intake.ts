import { createHash, createHmac } from "node:crypto";
import { z } from "zod";
import { NextResponse } from "next/server";
import { OFFER } from "@/lib/depositguard/offer";
import { serviceEnabled } from "./config";
import { database } from "./database";
import { dispatchNotifications } from "./notifications";

const common = {
  submissionId: z.string().uuid(),
  email: z
    .string()
    .trim()
    .email()
    .max(254)
    .transform((v) => v.toLowerCase()),
  name: z.string().trim().max(80).optional(),
  honeypot: z.string().max(200).optional(),
  consentVersion: z.literal(OFFER.consentVersion),
};
export const contactSchema = z
  .object({
    ...common,
    category: z.enum(["calculation", "bug", "ux", "feature", "other"]),
    message: z.string().trim().min(10).max(3000),
  })
  .strict();
export const requestSchema = z
  .object({
    ...common,
    offerVersion: z.literal(OFFER.version),
    serviceConsent: z.literal(true),
    purchaseWindow: z.enum([
      "within_30_days",
      "31_60_days",
      "later",
      "exploring",
    ]),
    hasProperty: z.boolean(),
    hasLoanOffer: z.boolean(),
    need: z.enum(["affordability", "compare", "rate_reset"]),
  })
  .strict();
export async function readBody(request: Request) {
  const origin = request.headers.get("origin");
  const expected = process.env.APP_ORIGIN || "http://localhost:3000";
  if (!origin || origin !== expected) throw new Error("FORBIDDEN");
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new Error("INVALID");
  // Stream with a hard cap; Content-Length alone is not trustworthy.
  const reader = request.body?.getReader();
  if (!reader) throw new Error("INVALID");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 16_384) {
      await reader.cancel();
      throw new Error("TOO_LARGE");
    }
    chunks.push(value);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new Error("INVALID");
  }
}
export function failure(error: unknown) {
  const code = error instanceof Error ? error.message : "SERVICE_UNAVAILABLE";
  const status =
    (
      {
        FORBIDDEN: 403,
        INVALID: 400,
        TOO_LARGE: 413,
        RATE_LIMITED: 429,
        IDEMPOTENCY_CONFLICT: 409,
      } as Record<string, number>
    )[code] || 503;
  return NextResponse.json(
    {
      success: false,
      message:
        status === 503
          ? "Chưa thể tiếp nhận. Vui lòng thử lại hoặc liên hệ trực tiếp qua email."
          : status === 429
            ? "Bạn đã gửi nhiều yêu cầu. Vui lòng thử lại sau một giờ."
            : "Yêu cầu chưa hợp lệ. Vui lòng kiểm tra và thử lại.",
    },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        ...(status === 429 ? { "Retry-After": "3600" } : {}),
      },
    },
  );
}
export async function persist(
  kind: string,
  payload: Record<string, unknown>,
  request: Request,
) {
  const secret = process.env.RATE_LIMIT_SECRET;
  if (!secret) throw new Error("SERVICE_UNAVAILABLE");
  // Trust Vercel's overwritten header, never the user-controlled X-Forwarded-For.
  const ip = process.env.VERCEL
    ? request.headers.get("x-vercel-forwarded-for") || "unknown"
    : "local";
  const rateKey = createHmac("sha256", secret)
    .update(`${kind}:${ip}`)
    .digest("hex");
  const { submissionId, honeypot, ...data } = payload;
  const hash = createHash("sha256")
    .update(JSON.stringify(data, Object.keys(data).sort()))
    .digest("hex");
  const result = await database("rpc/receive_intake", {
    p_kind: kind,
    p_submission: submissionId,
    p_hash: hash,
    p_payload: data,
    p_rate_key: rateKey,
  });
  // Durable outbox survives timeout/failure. Only owner-addressed alerts leave automatically.
  await dispatchNotifications(result.id).catch(() => undefined);
  return NextResponse.json(
    {
      success: true,
      requestCode: result.code,
      message: "Đã tiếp nhận yêu cầu. Đây chưa phải xác nhận thanh toán.",
    },
    {
      status: result.duplicate ? 200 : 201,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
export async function intake(request: Request, kind: "contact" | "report") {
  try {
    if (kind === "report" && !serviceEnabled())
      throw new Error("SERVICE_UNAVAILABLE");
    const body = await readBody(request);
    if (kind === "report" && body.offerVersion !== OFFER.version)
      return NextResponse.json(
        {
          success: false,
          message:
            "Gói dịch vụ đã thay đổi. Vui lòng tải lại và xem phạm vi trước khi gửi.",
        },
        { status: 409 },
      );
    const parsed = (
      kind === "report" ? requestSchema : contactSchema
    ).safeParse(body);
    if (!parsed.success || parsed.data.honeypot) throw new Error("INVALID");
    return await persist(
      kind,
      {
        ...parsed.data,
        ...(kind === "report"
          ? { offerId: OFFER.id, priceVnd: OFFER.price }
          : {}),
      },
      request,
    );
  } catch (error) {
    return failure(error);
  }
}
