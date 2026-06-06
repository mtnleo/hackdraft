"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
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
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const label = (o: (typeof TOPIC_OPTIONS)[number]) =>
    lang === "es" ? o.label_es : o.label_en;
  const current =
    TOPIC_OPTIONS.find((o) => o.id === value) ?? TOPIC_OPTIONS[0];

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  // Highlight the current option when opening.
  useEffect(() => {
    if (open)
      setActive(Math.max(0, TOPIC_OPTIONS.findIndex((o) => o.id === value)));
  }, [open, value]);

  const choose = (id: string) => {
    onChange(id);
    setOpen(false);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) return setOpen(true);
      setActive((a) => Math.min(TOPIC_OPTIONS.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!open) setOpen(true);
      else choose(TOPIC_OPTIONS[active].id);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative w-full shrink-0 md:w-52">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKey}
        className="hover-lift flex w-full cursor-pointer items-center justify-between gap-2 rounded-[14px] border-2 border-ink bg-card-white px-4 py-3 font-body text-sm font-medium text-ink shadow-hard-sm focus:border-cobalt focus:outline-none"
      >
        <span className="truncate">{label(current)}</span>
        <ChevronDownIcon
          className={`shrink-0 text-slate-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={ariaLabel}
          className="absolute left-0 z-30 mt-2 max-h-72 w-full overflow-auto rounded-[14px] border-2 border-ink bg-card-white p-1 shadow-hard-md"
        >
          {TOPIC_OPTIONS.map((o, i) => {
            const selected = o.id === value;
            const highlighted = i === active;
            return (
              <li key={o.id} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(o.id)}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left font-body text-sm transition-colors ${
                    highlighted ? "bg-track" : ""
                  } ${selected ? "font-semibold text-cobalt" : "text-ink"}`}
                >
                  <span className="truncate">{label(o)}</span>
                  {selected && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-cobalt" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
