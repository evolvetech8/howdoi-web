import { database } from "../lib/server/database";
import { dispatchNotifications } from "../lib/server/notifications";
const [command, code, amount, reference] = process.argv.slice(2);
async function main() {
  if (command === "notifications") {
    await dispatchNotifications();
    console.log(
      "Pending notifications processed; inspect manual_review items separately.",
    );
    return;
  }
  if (command === "cleanup") {
    await database("rpc/cleanup_intake", {});
    console.log("Retention cleanup completed.");
    return;
  }
  if (command === "list") {
    const rows = await database(
      "intake_requests?kind=eq.report&select=code,status,created_at,paid_vnd,refunded_vnd&order=created_at.desc&limit=100",
      undefined,
      "GET",
    );
    console.table(rows);
    return;
  }
  if (
    !code ||
    ![
      "accept",
      "mark-paid",
      "start",
      "deliver",
      "decline",
      "cancel",
      "refund",
    ].includes(command)
  )
    throw new Error(
      "Usage: ops list|notifications|cleanup OR ops accept|mark-paid|start|deliver|decline|cancel|refund CODE [AMOUNT] [BANK_REFERENCE]",
    );
  const result = await database("rpc/transition_request", {
    p_code: code,
    p_action: command,
    p_amount: Number(amount || 0),
    p_reference: reference || "",
  });
  console.log(`${code}: ${result}`);
}
main().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
