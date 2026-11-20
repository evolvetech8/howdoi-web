import { funnelSchema } from "@/lib/depositguard/funnel";
import { readBody, failure } from "@/lib/server/intake";
import { database } from "@/lib/server/database";
import { createHmac } from "node:crypto";
export async function POST(request: Request) {
  try {
    const parsed = funnelSchema.safeParse(await readBody(request));
    if (!parsed.success) throw new Error("INVALID");
    if (process.env.ANALYTICS_ENABLED !== "true")
      return new Response(null, { status: 204 });
    const secret = process.env.RATE_LIMIT_SECRET;
    if (!secret) throw new Error("SERVICE_UNAVAILABLE");
    const ip = process.env.VERCEL
      ? request.headers.get("x-vercel-forwarded-for") || "unknown"
      : "local";
    const key = createHmac("sha256", secret)
      .update("events:" + ip)
      .digest("hex");
    await database("rpc/record_event", {
      p_event: parsed.data.event,
      p_source: parsed.data.source,
      p_key: key,
    });
    return new Response(null, { status: 204 });
  } catch (e) {
    return failure(e);
  }
}
