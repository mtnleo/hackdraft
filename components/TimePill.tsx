import { TIME_BUCKETS } from "@/lib/topics";

interface Props {
  value: string;
  ariaLabel: string;
  onChange: (id: string) => void;
}

export default function TimePill({ value, ariaLabel, onChange }: Props) {
  const count = TIME_BUCKETS.length;
  const idx = Math.max(
    0,
    TIME_BUCKETS.findIndex((b) => b.id === value),
  );

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="relative flex h-13 w-full items-stretch rounded-full border-2 border-ink bg-track p-1 shadow-hard-sm md:w-auto"
    >
      {/* Sliding orange thumb */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1 bottom-1 left-1 rounded-full border-2 border-ink bg-orange shadow-hard-sm"
        style={{
          width: `calc((100% - 0.5rem) / ${count})`,
          transform: `translateX(calc(${idx} * 100%))`,
          transition: "transform 0.35s var(--ease-spring)",
        }}
      />
      {TIME_BUCKETS.map((b) => {
        const active = b.id === value;
        return (
          <button
            key={b.id}
            type="button"
            onClick={() => onChange(b.id)}
            aria-pressed={active}
            className={`relative z-10 flex flex-1 items-center justify-center px-3 py-2 font-mono text-xs whitespace-nowrap transition-colors md:px-5 ${
              active ? "font-bold text-ink" : "text-slate-muted hover:text-ink"
            }`}
          >
            {b.id}
          </button>
        );
      })}
    </div>
  );
}
