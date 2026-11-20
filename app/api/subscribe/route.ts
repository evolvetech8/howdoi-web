import { z } from "zod";
import { createHash } from "node:crypto";
import { readBody, persist, failure } from "@/lib/server/intake";
import { database } from "@/lib/server/database";
const schema = z
  .object({
    email: z
      .string()
      .trim()
      .email()
      .max(254)
      .transform((v) => v.toLowerCase()),
    target: z.enum(["both", "ios", "newsletter", "web"]).default("both"),
  })
  .strict();
export async function POST(request: Request) {
  try {
    const result = schema.safeParse(await readBody(request));
    if (!result.success) throw new Error("INVALID");
    const h = createHash("sha256")
      .update("subscriber:" + result.data.email)
      .digest("hex");
    const id = `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`;
    return await persist(
      "subscribe",
      {
        email: result.data.email,
        target: result.data.target,
        submissionId: id,
      },
      request,
    );
  } catch (e) {
    return failure(e);
  }
}
export async function GET() {
  try {
    const count = await database("rpc/subscriber_count", {});
    return Response.json({ count });
  } catch {
    return Response.json({ count: null }, { status: 503 });
  }
}
