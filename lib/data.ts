// Server-only data source. JSON-first: today this reads the bundled dataset;
// swapping to Cloudflare D1 later means changing only this module (and the API
// route) to query `env.hackaton_db` instead of the static array.
import rawIdeas from "@/data/all-ideas.json";
import type { Idea } from "./types";

type RawIdea = Omit<Idea, "id">;

export const ALL_IDEAS: Idea[] = (rawIdeas as unknown as RawIdea[]).map(
  (d, i) => ({
    id: i,
    ...d,
  }),
);

export function getAllIdeas(): Idea[] {
  return ALL_IDEAS;
}
