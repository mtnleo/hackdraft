# Project Handoff: Hackathon Idea Generator

## 1. Project Overview
A fast, lightweight web application designed to help developers find curated hackathon project ideas based on their available time and areas of interest. The application relies on a pre-populated database of scraped/curated ideas rather than real-time AI generation, ensuring high-quality, realistic project suggestions.

## 2. Current State (as of 2026-06-05)

### Done
- **Data**: 311 bilingual ideas (EN + ES) generated and validated — `data/all-ideas.json`
- **Schema**: Cloudflare D1 SQLite schema finalized — `data/schema.sql`
- **DB**: `hackaton-db` created on Cloudflare D1 (database_id: `ae1a8a1a-02f0-49a8-af4a-7282080c1bdd`) and fully loaded with all 311 rows
- **wrangler.toml**: configured with D1 binding `hackaton_db`
- **Scripts**: `scripts/load.js` (validates + generates seed.sql), `scripts/combine.js`

### Done (frontend, this session)
- **Next.js app**: initialized in-place — Next 16 (App Router) + React 19 + Tailwind v4 (CSS-first `@theme` in `app/globals.css`, NO tailwind.config.js) + TS. Fonts via `next/font`: Bricolage Grotesque (display), Inter (body), JetBrains Mono (mono).
- **UI built & working** (`npm run dev`): empty state on load → press "Show me 3"/"Mostrame 3" → 3 cards deal up from the bottom (then button = "Shuffle 3"); live-filtering after first deal. Components in `components/`: HackdraftApp (client orchestrator), Navbar, TopicDropdown (custom listbox, not native select), TimePill (segmented sliding-thumb, fixed `lg`/`md` width), ShuffleButton, IdeaCard (resting tilt → straighten + lift on hover), FallbackBanner, EmptyState, Footer, CookieConsent, icons.
- **Data layer (JSON-first)**: `lib/data.ts` imports `data/all-ideas.json` (server-only); `lib/ideas.ts` (topic×bucket filter, `48h+` merged into `24h+`, nearest-bucket fallback, random 3); `lib/topics.ts`, `lib/i18n.ts`, `lib/types.ts`. Query via `app/api/ideas/route.ts` (`GET ?topic=&time=`). **D1 swap touches only `lib/data.ts` + that route.**
- **Design**: warm peach bg `#FBF1E8`; nav+footer white; pill track `#FAF9F6`; blue `#2C4BE0` + orange `#FF6A2B`; neo-brutalist-lite (hard offset shadows). OG-style hero: "3 hackathon ideas." (orange 3) + "Pick your time · pick your vibe · ship.". Full design spec in `DESIGN.md`.
- **Analytics + legal**: Google Analytics, **consent-gated** (loads only after Accept; banner sits above the footer). `/privacy` + `/terms` pages (EN+ES), linked in footer. GA needs `NEXT_PUBLIC_GA_ID` in `.env.local` to activate (see `.env.example`).
- **Responsive**: controls wrap below ~918px; mobile stacks. Footer pinned.
- Git: repo initialized, all work committed on `main`.

### Not Done (next session)
- **Cloudflare deploy**: add `@opennextjs/cloudflare` adapter + wrangler config. ⚠️ Verify OpenNext supports Next 16 first — may need to pin Next 15.
- **Wire D1**: swap `lib/data.ts` + `app/api/ideas/route.ts` to query the `hackaton_db` D1 binding.
- **Set `NEXT_PUBLIC_GA_ID`** (real GA4 id) in `.env.local`.
- **OG meta tags**: `public/og.html` exists (user-made social card, untracked) but not wired as `og:image` meta yet.

### Notes / gotchas
- `head` is aliased on this machine — don't pipe to `head` in bash.
- Preview: `.claude/launch.json` at the **workspace root** (`Projects/`) runs `cd Hack-a-ton && npm run dev` on :3000.
- The `preview_screenshot` captures a taller window than the emulated viewport — trust `preview_eval` (e.g. `footerBottom === innerHeight`) over screenshots for footer-pin/overflow checks.

## 3. Core Features & UX/UI

- **Layout:** Single-page application, non-scrollable (everything above the fold). Minimalist, centered UI.
- **Input Controls:**
  - **Time Frame Dropdown:** 6 buckets — `1-3h`, `3-6h`, `6-12h`, `12-24h`, `24-48h`, `48h+`
  - **Broad Topic Dropdown:** 10 categories — AI/ML, Crypto/Web3, Cybersecurity, Environment, Games & Fun, Health/MedTech, IoT & Hardware, Productivity/DevTools, Social Impact, Web/Frontend
  - **Subtopic/Tags:** 1 to 4 specific tags per idea for deeper filtering (defined per topic in `data/topics.json`)
- **Output Behavior:** Shows 3 randomized ideas matching the criteria. Results refresh on re-query. Non-scrollable — cards must fit above the fold.
- **Bilingual:** UI supports EN and ES. Topic/tag labels are translated via a static dictionary in `data/topics.json`; the idea content (name, long_description) has both columns in the DB (`name_es`, `long_description_es`).
- **Fallback for empty cells:** If the selected topic × time combination has no ideas, show ideas from the nearest time bucket within the same topic.
- **Footer:** "Made with love by Martin" · GitHub + LinkedIn links · contact email · legal disclaimer

## 4. Real DB Schema (Cloudflare D1 / SQLite)

```sql
CREATE TABLE ideas (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  name                TEXT NOT NULL,   -- EN headline, 40-70 chars
  name_es             TEXT NOT NULL,   -- ES translation
  long_description    TEXT NOT NULL,   -- EN, 3-4 sentences, ~300-450 chars (hard cap 550)
  long_description_es TEXT NOT NULL,   -- ES translation
  topic               TEXT NOT NULL,   -- canonical slug, e.g. 'cybersecurity'
  time_bucket         TEXT NOT NULL,   -- '1-3h'|'3-6h'|'6-12h'|'12-24h'|'24-48h'|'48h+'
  min_hours           INTEGER NOT NULL,
  max_hours           INTEGER NOT NULL,
  difficulty          TEXT NOT NULL,   -- 'beginner'|'intermediate'|'advanced'
  tags                TEXT NOT NULL    -- JSON array of slugs, e.g. '["lights","sensors"]'
);
```

**Data distribution:**
- by topic: ai-ml:30, crypto-web3:32, cybersecurity:30, environment:31, games-fun:30, health-medtech:30, iot-hardware:35, productivity-devtools:31, social-impact:31, web-frontend:31
- by time bucket: 1-3h:25, 3-6h:76, 6-12h:103, 12-24h:76, 24-48h:29, 48h+:2
- by difficulty: beginner:53, intermediate:181, advanced:77

Note: `48h+` bucket has only 2 ideas — consider hiding or merging in the UI.

## 5. Tech Stack & Infrastructure

- **Frontend & Backend:** Next.js (App Router)
- **Database:** Cloudflare D1 (Serverless SQLite)
  - Chosen over Supabase: no free-tier limits, global edge, built-in DDoS protection
- **Deployment:** Cloudflare Pages + Workers

## 6. Key Technical & Business Decisions

- **No Real-Time AI / RAG:** Data retrieved via standard DB queries — no AI at runtime.
- **No User Data Collection:** No accounts, no login, no favorites. Zero GDPR surface.
- **Agnostic Stack for Ideas:** Ideas are not filtered by programming language or framework.
- **Legal:** Disclaimer in footer — ideas compiled from public internet data. Contact email for takedown requests only.
- **Tags are EN slugs in DB:** Topic/tag labels in Spanish live as a static dictionary in `data/topics.json`, not in the DB.
