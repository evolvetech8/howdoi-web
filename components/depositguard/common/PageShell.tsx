import Link from "next/link";
export default function PageShell({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="max-w-4xl mx-auto px-5 py-12 sm:py-16 space-y-8">
      <Link href="/" className="text-primary-800 underline print:hidden">
        EvolveTech / DepositGuard
      </Link>
      <header className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight">
          {title}
        </h1>
        {intro && (
          <p className="text-lg text-slate-600 leading-relaxed">{intro}</p>
        )}
      </header>
      {children}
    </article>
  );
}
