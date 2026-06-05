import type { Idea, IdeaQueryResult } from "./types";
import { TIME_BUCKETS, ALL_TOPICS } from "./topics";

/** Fisher-Yates shuffle (non-mutating) + take first n. */
export function pickRandom<T>(arr: readonly T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

function bucketIndex(uiBucket: string): number {
  return TIME_BUCKETS.findIndex((b) => b.id === uiBucket);
}

function dataBucketsFor(uiBucket: string): string[] {
  return TIME_BUCKETS.find((b) => b.id === uiBucket)?.dataBuckets ?? [uiBucket];
}

/** Ideas in a topic (or all topics) that fall in the given UI time bucket. */
function ideasInBucket(
  all: readonly Idea[],
  topic: string,
  uiBucket: string,
): Idea[] {
  const dataBuckets = dataBucketsFor(uiBucket);
  return all.filter(
    (i) =>
      (topic === ALL_TOPICS || i.topic === topic) &&
      dataBuckets.includes(i.time_bucket),
  );
}

/**
 * Resolve a query to a concrete pool of ideas.
 *
 * If the requested topic x time bucket has matches, use them. Otherwise fall
 * back to the nearest UI time bucket (by index distance, ties prefer the
 * shorter bucket) within the same topic, and report which bucket was used so the
 * UI can show the fallback banner.
 */
export function resolveIdeas(
  all: readonly Idea[],
  topic: string,
  uiBucket: string,
): { pool: Idea[]; fallbackBucket: string | null } {
  const exact = ideasInBucket(all, topic, uiBucket);
  if (exact.length > 0) return { pool: exact, fallbackBucket: null };

  const idx = bucketIndex(uiBucket);
  if (idx === -1) return { pool: [], fallbackBucket: null };

  // Walk outward from the requested bucket, preferring closer (then shorter).
  for (let dist = 1; dist < TIME_BUCKETS.length; dist++) {
    for (const cand of [idx - dist, idx + dist]) {
      if (cand < 0 || cand >= TIME_BUCKETS.length) continue;
      const candBucket = TIME_BUCKETS[cand].id;
      const hits = ideasInBucket(all, topic, candBucket);
      if (hits.length > 0) {
        return { pool: hits, fallbackBucket: candBucket };
      }
    }
  }
  return { pool: [], fallbackBucket: null };
}

/** Full query: resolve the pool, then pick `count` random ideas from it. */
export function queryIdeas(
  all: readonly Idea[],
  topic: string,
  uiBucket: string,
  count = 3,
): IdeaQueryResult {
  const { pool, fallbackBucket } = resolveIdeas(all, topic, uiBucket);
  return {
    ideas: pickRandom(pool, count),
    fallbackBucket,
    requestedBucket: uiBucket,
  };
}
