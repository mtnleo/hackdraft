import type { Lang } from "@/lib/types";

interface Props {
  lang: Lang;
  tagline: string;
  onLangChange: (lang: Lang) => void;
}

export default function Navbar({ lang, tagline, onLangChange }: Props) {
  return (
    <nav className="w-full shrink-0 border-b-2 border-ink bg-card-white">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-4 md:px-8">
        <div className="flex flex-col">
          <div className="font-display text-3xl leading-none font-extrabold tracking-tight">
            <span className="text-ink">Hack</span>
            <span className="text-cobalt">starter</span>
          </div>
          <p className="mt-1 hidden font-body text-xs text-slate-muted sm:block">
            {tagline}
          </p>
        </div>

        <div
          className="flex shrink-0 items-center overflow-hidden rounded-full border-2 border-ink bg-canvas-paper font-mono text-xs"
          role="group"
          aria-label="Language"
        >
          <button
            type="button"
            onClick={() => onLangChange("en")}
            aria-pressed={lang === "en"}
            className={`px-4 py-2 transition-colors ${
              lang === "en"
                ? "bg-cobalt text-card-white"
                : "text-ink hover:bg-track"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => onLangChange("es")}
            aria-pressed={lang === "es"}
            className={`border-l-2 border-ink px-4 py-2 transition-colors ${
              lang === "es"
                ? "bg-cobalt text-card-white"
                : "text-ink hover:bg-track"
            }`}
          >
            ES
          </button>
        </div>
      </div>
    </nav>
  );
}
