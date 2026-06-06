// Small typography primitives shared by the legal pages.
export function H1({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
      {children}
    </h1>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-8 mb-2 font-display text-lg font-bold text-ink">
      {children}
    </h2>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body text-sm leading-relaxed text-slate-muted">
      {children}
    </p>
  );
}

export function LangTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block w-fit rounded border-2 border-ink bg-card-white px-2 py-0.5 font-mono text-xs uppercase text-ink">
      {children}
    </span>
  );
}
