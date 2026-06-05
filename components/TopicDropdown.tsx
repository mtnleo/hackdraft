import { TOPIC_OPTIONS } from "@/lib/topics";
import type { Lang } from "@/lib/types";
import { ChevronDownIcon } from "./icons";

interface Props {
  value: string;
  lang: Lang;
  ariaLabel: string;
  onChange: (id: string) => void;
}

export default function TopicDropdown({
  value,
  lang,
  ariaLabel,
  onChange,
}: Props) {
  return (
    <div className="relative w-full shrink-0 md:w-52">
      <select
        value={value}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value)}
        className="hover-lift w-full cursor-pointer appearance-none rounded-[14px] border-2 border-ink bg-card-white px-4 py-3 pr-10 font-body text-sm font-medium text-ink shadow-hard-sm focus:border-cobalt focus:outline-none"
      >
        {TOPIC_OPTIONS.map((o) => (
          <option key={o.id} value={o.id}>
            {lang === "es" ? o.label_es : o.label_en}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-muted" />
    </div>
  );
}
