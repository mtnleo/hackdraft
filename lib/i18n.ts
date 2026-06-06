import type { Difficulty, Lang } from "./types";
import { topicLabel } from "./topics";

interface Strings {
  tagline: string;
  hero: { num: string; headline: string; beats: string[] };
  shuffle: string;
  showMe: string;
  emptyPrompt: string;
  topicAria: string;
  timeAria: string;
  difficulty: Record<Difficulty, string>;
  footerMadeWith: string;
  footerDisclaimer: string;
  contactEmail: string;
  privacy: string;
  terms: string;
}

export const STRINGS: Record<Lang, Strings> = {
  en: {
    tagline: "3 hackathon ideas. Pick your time, pick your vibe, ship.",
    hero: {
      num: "3",
      headline: "hackathon ideas.",
      beats: ["Pick your time", "pick your vibe", "ship."],
    },
    shuffle: "Shuffle 3",
    showMe: "Show me 3",
    emptyPrompt:
      "Set your time and topic above, then hit Show me 3 to deal your first hand of ideas.",
    topicAria: "Filter by topic",
    timeAria: "Filter by available time",
    difficulty: {
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
    },
    footerMadeWith: "Made with love by",
    footerDisclaimer: "Ideas compiled from public sources. Contact for takedowns.",
    contactEmail: "mtnleonardi@gmail.com",
    privacy: "Privacy",
    terms: "Terms",
  },
  es: {
    tagline: "3 ideas para tu hackathon. Elegí tu tiempo, elegí tu onda, a programar.",
    hero: {
      num: "3",
      headline: "ideas para tu hackathon.",
      beats: ["Elegí tu tiempo", "elegí tu onda", "a programar."],
    },
    shuffle: "Mezclar 3",
    showMe: "Mostrame 3",
    emptyPrompt:
      "Elegí tu tiempo y tema arriba, y tocá Mostrame 3 para repartir tu primera mano de ideas.",
    topicAria: "Filtrar por tema",
    timeAria: "Filtrar por tiempo disponible",
    difficulty: {
      beginner: "Principiante",
      intermediate: "Intermedio",
      advanced: "Avanzado",
    },
    footerMadeWith: "Hecho con amor por",
    footerDisclaimer:
      "Ideas recopiladas de fuentes públicas. Contacto para retiros.",
    contactEmail: "mtnleonardi@gmail.com",
    privacy: "Privacidad",
    terms: "Términos",
  },
};

/** Localised idea fields based on the active language. */
export function ideaTitle(
  idea: { name: string; name_es: string },
  lang: Lang,
): string {
  return lang === "es" ? idea.name_es : idea.name;
}

export function ideaDescription(
  idea: { long_description: string; long_description_es: string },
  lang: Lang,
): string {
  return lang === "es" ? idea.long_description_es : idea.long_description;
}

/** Fallback banner sentence. */
export function fallbackMessage(
  lang: Lang,
  requestedBucket: string,
  shownBucket: string,
  topicId: string,
): string {
  const topic = topicLabel(topicId, lang);
  if (lang === "es") {
    return `No hay ideas de ${requestedBucket} en ${topic} — mostrando la más cercana: ${shownBucket}.`;
  }
  return `No ideas for ${requestedBucket} in ${topic} — showing the closest match: ${shownBucket}.`;
}
