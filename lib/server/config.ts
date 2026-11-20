export function serviceEnabled() {
  // Production intake is deliberately paused for this release, even if an
  // existing Vercel environment has REPORT_SERVICE_ENABLED=true.
  if (process.env.VERCEL_ENV === "production") return false;
  return (
    process.env.REPORT_SERVICE_ENABLED === "true" &&
    Boolean(
      process.env.APP_ORIGIN &&
      process.env.RATE_LIMIT_SECRET &&
      process.env.SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env.RESEND_API_KEY &&
      process.env.MAIL_FROM &&
      process.env.SUPPORT_INBOX &&
      process.env.OPERATOR_NAME &&
      process.env.OPERATOR_BIO &&
      process.env.SERVICE_TERMS_CONFIRMED === "true",
    )
  );
}
