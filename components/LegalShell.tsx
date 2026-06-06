import Link from "next/link";

export default function LegalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="w-full shrink-0 border-b-2 border-ink bg-card-white">
        <div className="mx-auto flex max-w-[800px] items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="font-display text-2xl font-extrabold tracking-tight"
          >
            <span className="text-ink">Hack</span>
            <span className="text-cobalt">starter</span>
          </Link>
          <Link
            href="/"
            className="font-body text-sm text-slate-muted underline underline-offset-4 hover:text-ink"
          >
            ← Home
          </Link>
        </div>
      </nav>
      <main className="mx-auto w-full max-w-[800px] flex-1 px-6 py-10 md:py-14">
        {children}
      </main>
    </>
  );
}
