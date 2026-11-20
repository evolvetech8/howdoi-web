import { z } from "zod";
import { randomUUID } from "node:crypto";
import { readBody, persist, failure } from "@/lib/server/intake";
const schema = z
  .object({
    email: z.string().trim().email().max(254),
    name: z.string().max(80).optional(),
    subject: z.string().max(200).optional(),
    message: z.string().trim().min(1).max(3000),
    appName: z.string().max(100).optional(),
  })
  .strict();
export async function POST(request: Request) {
  try {
    const result = schema.safeParse(await readBody(request));
    if (!result.success) throw new Error("INVALID");
    return await persist(
      "support",
      { ...result.data, submissionId: randomUUID() },
      request,
    );
  } catch (e) {
    return failure(e);
  }
}
