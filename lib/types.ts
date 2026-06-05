export type Lang = "en" | "es";

export type Difficulty = "beginner" | "intermediate" | "advanced";

/** A hackathon idea row (mirrors the D1 `ideas` table + a client-side id). */
export interface Idea {
  id: number;
  name: string;
  name_es: string;
  long_description: string;
  long_description_es: string;
  topic: string;
  time_bucket: string;
  min_hours: number;
  max_hours: number;
  difficulty: Difficulty;
  tags: string[];
}

/** Result of a query: the chosen ideas + which bucket we fell back to (if any). */
export interface IdeaQueryResult {
  ideas: Idea[];
  /** The UI time-bucket id actually shown, when it differs from the requested one. */
  fallbackBucket: string | null;
  /** The originally requested UI time-bucket id (for the banner message). */
  requestedBucket: string;
}
