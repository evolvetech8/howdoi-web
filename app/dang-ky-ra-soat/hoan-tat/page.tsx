import PageShell from "@/components/depositguard/common/PageShell";
import Receipt from "@/components/depositguard/common/Receipt";
export const metadata = {
  title: "Tiếp nhận yêu cầu",
  robots: { index: false, follow: false },
};
export default function Complete() {
  return (
    <PageShell title="Thông tin tiếp nhận">
      <Receipt />
    </PageShell>
  );
}
