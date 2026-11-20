export async function database(path: string, body?: unknown, method = "POST") {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SERVICE_UNAVAILABLE");
  const response = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    const failure = await response.json().catch(() => ({}));
    if (failure.message === "RATE_LIMITED") throw new Error("RATE_LIMITED");
    if (failure.message === "IDEMPOTENCY_CONFLICT")
      throw new Error("IDEMPOTENCY_CONFLICT");
    throw new Error("SERVICE_UNAVAILABLE");
  }
  const raw = await response.text();
  return raw ? JSON.parse(raw) : null;
}
