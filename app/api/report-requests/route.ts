import { intake } from "@/lib/server/intake";
export const runtime = "nodejs";
export const POST = (request: Request) => intake(request, "report");
