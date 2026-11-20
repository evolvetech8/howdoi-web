import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { beforeAll, afterAll, it, expect } from "vitest";
const db = new PGlite();
beforeAll(async () => {
  await db.exec(
    "create role anon; create role authenticated; create role service_role;",
  );
  await db.exec(
    readFileSync("supabase/migrations/202611200001_intake.sql", "utf8"),
  );
}, 30000);
afterAll(() => db.close());
const submit = (id: string, hash = "a", key = "client") =>
  db.query<any>("select receive_intake($1,$2,$3,$4,$5) as result", [
    "report",
    id,
    hash,
    JSON.stringify({ email: "test@example.com", priceVnd: 299000 }),
    key,
  ]);
it("migration creates durable intake and one outbox job despite retries", async () => {
  const id = "11111111-1111-4111-8111-111111111111";
  const first = (await submit(id)).rows[0].result;
  const second = (await submit(id)).rows[0].result;
  expect(first.code).toBe(second.code);
  expect(second.duplicate).toBe(true);
  expect(
    (
      await db.query<any>(
        "select count(*)::integer as n from notification_outbox",
      )
    ).rows[0].n,
  ).toBe(1);
  await expect(submit(id, "different")).rejects.toThrow("IDEMPOTENCY_CONFLICT");
});
it("database rate limiting persists across independent requests", async () => {
  for (let i = 0; i < 5; i++)
    await submit(`22222222-2222-4222-8222-22222222222${i}`, "a", "limited");
  await expect(
    submit("22222222-2222-4222-8222-222222222229", "a", "limited"),
  ).rejects.toThrow("RATE_LIMITED");
});
it("payment and fulfillment transitions require actual operator amount and reference", async () => {
  const code = (
    await submit("33333333-3333-4333-8333-333333333333", "a", "ops")
  ).rows[0].result.code;
  const change = (action: string, amount = 0, ref = "") =>
    db.query("select transition_request($1,$2,$3,$4)", [
      code,
      action,
      amount,
      ref,
    ]);
  await expect(change("mark-paid", 299000, "bank-1")).rejects.toThrow();
  await change("accept");
  await expect(change("mark-paid", 1, "bank-1")).rejects.toThrow();
  await change("mark-paid", 299000, "bank-1");
  await change("start");
  await change("deliver");
  await change("refund", 299000, "refund-1");
  const row = (
    await db.query<any>(
      "select status,paid_vnd,refunded_vnd,history from intake_requests where code=$1",
      [code],
    )
  ).rows[0];
  expect(row.status).toBe("refunded");
  expect(row.history).toHaveLength(5);
});
it("anonymous roles cannot see customer records or invoke privileged functions", async () => {
  await db.exec("set role anon");
  try {
    await expect(db.query("select * from intake_requests")).rejects.toThrow();
    await expect(db.query("select subscriber_count()")).rejects.toThrow();
  } finally {
    await db.exec("reset role");
  }
});
it("outbox leases avoid immediate duplicate claims and stop uncertain late retries", async () => {
  const row = (
    await submit("44444444-4444-4444-8444-444444444444", "a", "outbox")
  ).rows[0].result;
  expect(
    (await db.query("select * from claim_notifications($1)", [row.id])).rows,
  ).toHaveLength(1);
  expect(
    (await db.query("select * from claim_notifications($1)", [row.id])).rows,
  ).toHaveLength(0);
  await db.query(
    "update notification_outbox set created_at=now()-interval '25 hours',status='pending' where request_id=$1",
    [row.id],
  );
  expect(
    (await db.query("select * from claim_notifications($1)", [row.id])).rows,
  ).toHaveLength(0);
  expect(
    (
      await db.query<any>(
        "select status from notification_outbox where request_id=$1",
        [row.id],
      )
    ).rows[0].status,
  ).toBe("manual_review");
});
