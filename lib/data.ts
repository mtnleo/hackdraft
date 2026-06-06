// Server-only data source.
//
// Production reads from the Cloudflare D1 binding `hackaton_db` (the canonical
// store, 311 rows). The bundled JSON is kept only as a local-dev / no-binding
// fallback so `next dev` and the build still return data when D1 is not wired
// (e.g. running plain Node without `getCloudflareContext`, or a local D1 that
// hasn't been seeded). The query contract is unchanged: callers still get a
// flat `Idea[]` and run the same filter/merge/fallback/random logic.
import { getCloudflareContext } from "@opennextjs/cloudflare";
import rawIdeas from "@/data/all-ideas.json";
import type { Idea, Difficulty } from "./types";

type RawIdea = Omit<Idea, "id">;

/** JSON fallback dataset (no D1 binding available). */
const JSON_IDEAS: Idea[] = (rawIdeas as unknown as RawIdea[]).map((d, i) => ({
  id: i,
  ...d,
}));

/** A row as stored in D1: matches the `ideas` table 1:1 (tags is a JSON string). */
interface IdeaRow {
  id: number;
  name: string;
  name_es: string;
  long_description: string;
  long_description_es: string;
  topic: string;
  time_bucket: string;
  min_hours: number;
  max_hours: number;
  difficulty: string;
  tags: string;
}

/** Map a raw D1 row to the app `Idea` shape (parse the JSON `tags` column). */
function rowToIdea(r: IdeaRow): Idea {
  let tags: string[] = [];
  try {
    const parsed = JSON.parse(r.tags);
    if (Array.isArray(parsed)) tags = parsed.map(String);
  } catch {
    // malformed tags cell — leave empty rather than crash the request
  }
  return {
    id: r.id,
    name: r.name,
    name_es: r.name_es,
    long_description: r.long_description,
    long_description_es: r.long_description_es,
    topic: r.topic,
    time_bucket: r.time_bucket,
    min_hours: r.min_hours,
    max_hours: r.max_hours,
    difficulty: r.difficulty as Difficulty,
    tags,
  };
}

/**
 * Return every idea. Prefers the D1 `hackaton_db` binding; falls back to the
 * bundled JSON if the Cloudflare context or binding is unavailable, or if the
 * table is empty (e.g. an unseeded local D1).
 */
export async function getAllIdeas(): Promise<Idea[]> {
  try {
    const { env } = getCloudflareContext();
    const db = env.hackaton_db;
    if (db) {
      const { results } = await db
        .prepare("SELECT * FROM ideas")
        .all<IdeaRow>();
      if (results && results.length > 0) return results.map(rowToIdea);
    }
  } catch {
    // No Cloudflare context (plain Node dev / build-time) — use JSON fallback.
  }
  return JSON_IDEAS;
}
