import { DiceIcon } from "./icons";

export default function EmptyState({ prompt }: { prompt: string }) {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex w-full max-w-2xl flex-col items-center gap-5 rounded-2xl border-2 border-dashed border-ink/25 px-8 py-16 text-center">
        <div className="flex h-20 w-20 -rotate-3 items-center justify-center rounded-2xl border-2 border-ink/30 bg-card-white text-ink/40">
          <DiceIcon />
        </div>
        <p className="max-w-sm font-body text-sm text-slate-muted">{prompt}</p>
      </div>
    </div>
  );
}
