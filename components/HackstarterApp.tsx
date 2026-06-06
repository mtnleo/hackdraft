"use client";

import { useCallback, useEffect, useState } from "react";
import Navbar from "./Navbar";
import TopicDropdown from "./TopicDropdown";
import TimePill from "./TimePill";
import ShuffleButton from "./ShuffleButton";
import IdeaCard from "./IdeaCard";
import FallbackBanner from "./FallbackBanner";
import EmptyState from "./EmptyState";
import Footer from "./Footer";
import type { IdeaQueryResult, Lang } from "@/lib/types";
import { ALL_TOPICS, DEFAULT_BUCKET } from "@/lib/topics";
import { STRINGS, fallbackMessage } from "@/lib/i18n";

// Resting tilt per card position (degrees) — alternating, really slight, so the
// row looks hand-placed on a table. Cards straighten to 0 on hover.
const CARD_TILTS = [-1.5, 1, -0.8];

export default function HackstarterApp() {
  const [lang, setLang] = useState<Lang>("en");
  const [topic, setTopic] = useState(ALL_TOPICS);
  const [time, setTime] = useState(DEFAULT_BUCKET);
  const [result, setResult] = useState<IdeaQueryResult | null>(null);
  const [dealt, setDealt] = useState(false);
  const [dealKey, setDealKey] = useState(0);

  // Detect browser language after hydration (avoids SSR/client mismatch).
  useEffect(() => {
    if (navigator.language?.toLowerCase().startsWith("es")) setLang("es");
  }, []);

  const fetchIdeas = useCallback(async (t: string, tm: string) => {
    const res = await fetch(
      `/api/ideas?topic=${encodeURIComponent(t)}&time=${encodeURIComponent(tm)}`,
    );
    if (!res.ok) return;
    const data: IdeaQueryResult = await res.json();
    setResult(data);
    setDealt(true);
    setDealKey((k) => k + 1);
  }, []);

  // Once cards are showing, changing a filter live-refetches and re-deals.
  // Before the first deal, filters just set parameters (stay on the empty state).
  useEffect(() => {
    if (!dealt) return;
    fetchIdeas(topic, time);
  }, [topic, time, dealt, fetchIdeas]);

  const s = STRINGS[lang];
  const banner = result?.fallbackBucket
    ? fallbackMessage(lang, result.requestedBucket, result.fallbackBucket, topic)
    : null;

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />

      <main className="flex w-full flex-1 flex-col">
        {/* The whole block (hero + controls + results) is centered vertically
            as one group, so the controls and cards stay together. */}
        <div className="mx-auto my-auto w-full max-w-[1200px] px-6 py-8 md:px-8">
          {/* Hero */}
          <header className="mb-6 text-center">
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
              Hackstarter
            </h1>
            <p className="mx-auto mt-2 max-w-xl font-body text-sm text-slate-muted md:text-base">
              {s.tagline}
            </p>
          </header>

          {/* Controls */}
          <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-center">
            <TopicDropdown
              value={topic}
              lang={lang}
              ariaLabel={s.topicAria}
              onChange={setTopic}
            />
            <div className="flex justify-center">
              <TimePill value={time} ariaLabel={s.timeAria} onChange={setTime} />
            </div>
            <ShuffleButton
              label={dealt ? s.shuffle : s.showMe}
              onClick={() => fetchIdeas(topic, time)}
            />
          </div>

          {/* Results — sits under the controls */}
          <div className="mt-12 md:mt-14">
            {dealt && banner && <FallbackBanner message={banner} />}
            {dealt && result ? (
              <div
                key={dealKey}
                className="grid grid-cols-1 items-start gap-6 md:grid-cols-3"
              >
                {result.ideas.map((idea, i) => (
                  <IdeaCard
                    key={`${dealKey}-${idea.id}`}
                    idea={idea}
                    lang={lang}
                    delay={i * 90}
                    tilt={CARD_TILTS[i % CARD_TILTS.length]}
                  />
                ))}
              </div>
            ) : (
              <EmptyState prompt={s.emptyPrompt} />
            )}
          </div>
        </div>
      </main>

      <Footer lang={lang} />
    </>
  );
}
