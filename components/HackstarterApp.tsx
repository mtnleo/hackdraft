"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import TopicDropdown from "./TopicDropdown";
import TimePill from "./TimePill";
import ShuffleButton from "./ShuffleButton";
import IdeaCard from "./IdeaCard";
import FallbackBanner from "./FallbackBanner";
import Footer from "./Footer";
import type { IdeaQueryResult, Lang } from "@/lib/types";
import { ALL_TOPICS, DEFAULT_BUCKET } from "@/lib/topics";
import { STRINGS, fallbackMessage } from "@/lib/i18n";

// Resting tilt per card position (degrees) — alternating, really slight, so the
// row looks hand-placed on a table. Cards straighten to 0 on hover.
const CARD_TILTS = [-1.5, 1, -0.8];

export default function HackstarterApp({
  initial,
}: {
  initial: IdeaQueryResult;
}) {
  const [lang, setLang] = useState<Lang>("en");
  const [topic, setTopic] = useState(ALL_TOPICS);
  const [time, setTime] = useState(DEFAULT_BUCKET);
  const [result, setResult] = useState<IdeaQueryResult>(initial);
  const [dealKey, setDealKey] = useState(0);
  const didMount = useRef(false);

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
    setDealKey((k) => k + 1);
  }, []);

  // Live-refetch when filters change (skip the first render — we have `initial`).
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    fetchIdeas(topic, time);
  }, [topic, time, fetchIdeas]);

  const s = STRINGS[lang];
  const banner = result.fallbackBucket
    ? fallbackMessage(lang, result.requestedBucket, result.fallbackBucket, topic)
    : null;

  return (
    <>
      <Navbar lang={lang} tagline={s.tagline} onLangChange={setLang} />

      <section className="mx-auto w-full max-w-[1200px] shrink-0 px-6 pt-8 pb-6 md:px-8">
        <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center">
          <TopicDropdown
            value={topic}
            lang={lang}
            ariaLabel={s.topicAria}
            onChange={setTopic}
          />
          <div className="flex flex-1 justify-center">
            <TimePill value={time} ariaLabel={s.timeAria} onChange={setTime} />
          </div>
          <ShuffleButton label={s.shuffle} onClick={() => fetchIdeas(topic, time)} />
        </div>
      </section>

      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-6 pb-10 md:px-8">
        {banner && <FallbackBanner message={banner} />}
        <div
          key={dealKey}
          className="grid grid-cols-1 items-start gap-6 md:grid-cols-3"
        >
          {result.ideas.map((idea, i) => (
            <IdeaCard
              key={`${dealKey}-${idea.id}`}
              idea={idea}
              lang={lang}
              delay={i * 70}
              tilt={CARD_TILTS[i % CARD_TILTS.length]}
            />
          ))}
        </div>
      </main>

      <Footer lang={lang} />
    </>
  );
}
