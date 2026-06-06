import Link from "next/link";
import type { Lang } from "@/lib/types";
import { STRINGS } from "@/lib/i18n";

const LINKS = {
  github: "https://github.com/mtnleo",
  linkedin: "https://www.linkedin.com/in/martin-leonardi-/",
  martin: "https://martinleonardi.dev",
};

function Dot() {
  return <span className="hidden text-slate-muted md:inline">·</span>;
}

export default function Footer({ lang }: { lang: Lang }) {
  const s = STRINGS[lang];
  return (
    <footer className="w-full shrink-0 border-t-2 border-ink bg-footer">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-center gap-2 px-6 py-5 text-center font-body text-xs text-slate-muted md:flex-row md:gap-4 md:px-8 md:text-sm">
        <span>
          {s.footerMadeWith}{" "}
          <a
            href={LINKS.martin}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-1 underline-offset-4 transition-colors hover:text-ink"
          >
            Martin
          </a>
        </span>
        <Dot />
        <a
          href={LINKS.github}
          target="_blank"
          rel="noreferrer"
          className="underline decoration-1 underline-offset-4 transition-colors hover:text-ink"
        >
          GitHub
        </a>
        <Dot />
        <a
          href={LINKS.linkedin}
          target="_blank"
          rel="noreferrer"
          className="underline decoration-1 underline-offset-4 transition-colors hover:text-ink"
        >
          LinkedIn
        </a>
        <Dot />
        <a
          href={`mailto:${s.contactEmail}`}
          className="underline decoration-1 underline-offset-4 transition-colors hover:text-ink"
        >
          {s.contactEmail}
        </a>
        <Dot />
        <Link
          href="/privacy"
          className="underline decoration-1 underline-offset-4 transition-colors hover:text-ink"
        >
          {s.privacy}
        </Link>
        <Dot />
        <Link
          href="/terms"
          className="underline decoration-1 underline-offset-4 transition-colors hover:text-ink"
        >
          {s.terms}
        </Link>
        <Dot />
        <span>{s.footerDisclaimer}</span>
      </div>
    </footer>
  );
}
