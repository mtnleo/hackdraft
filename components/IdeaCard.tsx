import type { Difficulty, Idea, Lang } from "@/lib/types";
import { ideaTitle, ideaDescription, STRINGS } from "@/lib/i18n";
import { tagLabel, uiBucketForDataBucket } from "@/lib/topics";
import { ClockIcon } from "./icons";

const DIFF_CLASS: Record<Difficulty, string> = {
  beginner: "bg-diff-beginner text-ink",
  intermediate: "bg-diff-intermediate text-ink",
  advanced: "bg-diff-advanced text-card-white",
};

interface Props {
  idea: Idea;
  lang: Lang;
  /** Stagger delay (ms) for the deal-in animation. */
  delay: number;
}

export default function IdeaCard({ idea, lang, delay }: Props) {
  const s = STRINGS[lang];
  return (
    <article
      className="card-deal hover-lift flex flex-col gap-5 rounded-xl border-2 border-ink bg-card-white p-6 shadow-hard-md md:p-7"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={`rounded border-2 border-ink px-2 py-1 font-mono text-[11px] uppercase ${DIFF_CLASS[idea.difficulty]}`}
        >
          {s.difficulty[idea.difficulty]}
        </span>
        <span className="flex shrink-0 items-center gap-1 font-mono text-[11px] text-slate-muted">
          <ClockIcon />
          {uiBucketForDataBucket(idea.time_bucket)}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-display text-[22px] leading-tight font-bold text-ink">
          {ideaTitle(idea, lang)}
        </h2>
        <p className="font-body text-[15px] leading-relaxed text-slate-muted">
          {ideaDescription(idea, lang)}
        </p>
      </div>

      <div className="mt-auto flex flex-wrap gap-2 pt-1">
        {idea.tags.map((t) => (
          <span
            key={t}
            className="rounded-full border-2 border-ink bg-canvas-paper px-3 py-1 font-mono text-[10px] uppercase text-ink"
          >
            {tagLabel(t, lang)}
          </span>
        ))}
      </div>
    </article>
  );
}
