import topicsJson from "@/data/topics.json";
import type { Lang } from "./types";

/**
 * UI time buckets (5). The DB has 6 buckets but `48h+` only holds 2 ideas, so it
 * is merged into a relabeled `24h+` bucket. Each UI bucket maps to the DB
 * `time_bucket` value(s) it covers.
 */
export interface TimeBucket {
  id: string; // UI id, also the visible label
  dataBuckets: string[]; // DB time_bucket values this UI bucket matches
}

export const TIME_BUCKETS: TimeBucket[] = [
  { id: "1-3h", dataBuckets: ["1-3h"] },
  { id: "3-6h", dataBuckets: ["3-6h"] },
  { id: "6-12h", dataBuckets: ["6-12h"] },
  { id: "12-24h", dataBuckets: ["12-24h"] },
  { id: "24h+", dataBuckets: ["24-48h", "48h+"] },
];

export const DEFAULT_BUCKET = "6-12h";
export const ALL_TOPICS = "all";

export interface TopicOption {
  id: string;
  label_en: string;
  label_es: string;
}

interface RawTopic {
  id: string;
  label_en: string;
  label_es: string;
  tags: { id: string; label_es: string }[];
}

const rawTopics = (topicsJson as unknown as { topics: RawTopic[] }).topics;

/** Topic dropdown options: "All Topics" first, then the 10 canonical topics. */
export const TOPIC_OPTIONS: TopicOption[] = [
  { id: ALL_TOPICS, label_en: "All Topics", label_es: "Todos los temas" },
  ...rawTopics.map((t) => ({
    id: t.id,
    label_en: t.label_en,
    label_es: t.label_es,
  })),
];

/** slug -> Spanish label, aggregated across every topic's tag list. */
const TAG_LABEL_ES: Record<string, string> = {};
for (const t of rawTopics) {
  for (const tag of t.tags) {
    TAG_LABEL_ES[tag.id] = tag.label_es;
  }
}

/** Map a DB time_bucket (e.g. "48h+") to its UI bucket id (e.g. "24h+"). */
export function uiBucketForDataBucket(dataBucket: string): string {
  return TIME_BUCKETS.find((b) => b.dataBuckets.includes(dataBucket))?.id ?? dataBucket;
}

/**
 * Resolve a `time` query param to a canonical TIME_BUCKETS id.
 *
 * The "24h+" bucket id contains a "+", which some runtimes (notably the
 * Cloudflare Workers / OpenNext URL normalization on the deployed edge)
 * form-decode to a space — so the param can arrive as "24h " or "24h" instead
 * of "24h+" even though the client percent-encodes it. Restore it here so the
 * bucket resolves on the edge, not only in local Node dev.
 */
export function normalizeBucketParam(raw: string): string {
  const v = raw.trim();
  if (TIME_BUCKETS.some((b) => b.id === v)) return v;
  const restored = `${v}+`;
  if (TIME_BUCKETS.some((b) => b.id === restored)) return restored;
  return v;
}

export function topicLabel(id: string, lang: Lang): string {
  const opt = TOPIC_OPTIONS.find((t) => t.id === id);
  if (!opt) return id;
  return lang === "es" ? opt.label_es : opt.label_en;
}

/** Display label for a tag chip. EN uses the slug; ES uses the dictionary. */
export function tagLabel(slug: string, lang: Lang): string {
  if (lang === "es") return TAG_LABEL_ES[slug] ?? slug.replace(/-/g, " ");
  return slug.replace(/-/g, " ");
}
