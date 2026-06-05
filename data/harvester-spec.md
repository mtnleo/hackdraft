# Hackathon Idea Harvester — Recipe

This is the recipe each harvester subagent follows to produce ~30 high-quality,
bilingual hackathon ideas for ONE topic. The goal is a curated dataset of GOOD
ideas — not filler. Quality bar over quantity: 25 great ideas beat 30 with 5 duds.

---

## 1. What counts as a hackathon idea (the altitude)

An idea is at the right altitude when BOTH are true:
- **(a)** You can picture 5 teams building it 5 different ways.
- **(b)** You can state the "hook" (why it's interesting) in one sentence.

Formula: **[form factor] that [does a concrete thing] for [who / when], using [the hook]** — leaving the tech stack open.

- ❌ Too vague (a topic, not an idea): "An app for mental health."
- ❌ Too specific (kills creativity, everyone builds the same): "A React + Node
  password manager with AES-256 and a PostgreSQL backend."
- ✅ Just right: "A tool that scans a screenshot of any login form and flags
  phishing tells — mismatched favicon domain, off-brand fonts, suspicious form
  actions — and returns a risk score."

## 2. What counts as a GOOD idea (must pass ALL 6)

1. **One-sentence hook** — there's a clear reason it's interesting / non-obvious.
2. **Concrete user + moment** — who uses it and when is obvious.
3. **Demoable core** — there's a visible thing to show in a demo.
4. **Scope fits the time bucket** — a 1-3h idea has ONE sharp feature; a 48h+
   idea can have a fuller flow. "Good" is RELATIVE to the bucket.
5. **Open implementation** — describes the *what*, not the exact stack.
6. **Not on the generic blacklist** (below).

### NDA / excluded domains — never generate
Do NOT generate any idea about ingesting a company's manuals / documents / policies
into a knowledge base and answering natural-language questions over them with source
citations or provenance ("ask your docs / manuals / knowledge base and get cited
answers", grounded document Q&A, RAG-over-internal-docs support assistants). This
space is off-limits for legal reasons. Adjacent self-building support knowledge
bases are also excluded.

### Generic blacklist — auto-reject
- todo / notes / weather / recipe / expense-tracker clones with no twist
- "X but with AI / blockchain / AR" with no specific reason it needs that
- "a social network / platform / marketplace / dashboard for X" with no mechanic
- a chatbot that just wraps an LLM with no domain hook
- portfolio / landing-page generators with no real twist

## 3. Output format

Output a single JSON array. Each element:

```json
{
  "name": "EN headline, 40-70 chars, no trailing period",
  "name_es": "Spanish translation of name",
  "long_description": "EN, 3-4 sentences, 300-450 chars (hard cap 550). Cover: what it is + the core feature + why it fits the time. Open implementation.",
  "long_description_es": "Faithful Spanish translation (Claude quality, not literal).",
  "topic": "<the assigned topic slug — same for every row in this run>",
  "time_bucket": "one of: 1-3h | 3-6h | 6-12h | 12-24h | 24-48h | 48h+",
  "min_hours": 0,
  "max_hours": 0,
  "difficulty": "beginner | intermediate | advanced",
  "tags": ["1 to 4 tag slugs from this topic's allowed list"]
}
```

Rules:
- `min_hours` / `max_hours` MUST match the chosen `time_bucket` exactly (see §5).
- `tags`: 1-4 slugs, only from the allowed list for this topic (§5). Lowercase slugs.
- `name` has NO trailing period; `long_description` is full sentences.
- Spanish: translate `name` and `long_description` with real fluency. Do NOT
  translate topic/tags/bucket — those stay as English slugs.
- Output ONLY the JSON array, nothing else.

## 4. Distribution & realism (IMPORTANT)

- **Let each idea fall into its REALISTIC time bucket.** Do NOT force an even
  spread across buckets. Some buckets won't apply to some topics (e.g. IoT /
  robotics rarely fits 1-3h) — that's fine, leave them sparse or empty. The app
  handles empty cells with a UI fallback. Forcing a stretched idea into a bad
  bucket is a quality failure.
- Aim for a natural spread weighted toward where the topic actually lives.
- Spread difficulty realistically (more intermediate than beginner/advanced).
- No two ideas should be interchangeable — if two descriptions could swap names,
  one of them is too generic. Cut it.

## 5. Sourcing (hybrid grounded)

Before generating, run **2-3 WebSearches** to anchor in real hackathon projects,
e.g. for topic "cybersecurity":
- "devpost winning cybersecurity hackathon projects"
- "beginner cybersecurity hackathon project ideas"
- "MLH security hackathon winners"

Use the results as INSPIRATION and reality-check (what's been built, what wins),
then expand into clean, original, well-scoped ideas in the schema. Do not copy
descriptions verbatim — abstract and improve. Aim for variety across the topic's
subtopics.

## 6. Calibration examples (BAD vs GOOD)

**Cybersecurity, 3-6h**
- ❌ "A password manager." (done to death, no hook)
- ✅ name: "Phishing Login Scanner from a Screenshot"
  desc: "Paste a screenshot of any login page and the tool flags phishing tells —
  a favicon domain that doesn't match, off-brand fonts, form actions pointing
  off-site — then returns a 0-100 risk score with the reasons highlighted. A
  sharp, demoable single-screen build for a half-day sprint." tags: ["web-security","privacy"]

**IoT / Hardware, 24-48h**
- ❌ "A smart home system." (category, not an idea)
- ✅ name: "Calendar-Aware Focus Lamp"
  desc: "An ambient lamp that reads your calendar and shifts color to protect
  focus — it breathes green during free blocks and turns red five minutes before
  a meeting so the room knows. Works with any cheap LED strip and a calendar
  feed, leaving the controller hardware open." tags: ["lights","home-automation"]

**Productivity / DevTools, 1-3h**
- ❌ "A note-taking app." (blacklisted clone)
- ✅ name: "Regex Explainer that Narrates Each Match"
  desc: "Paste a regex and a test string; the tool animates the engine stepping
  through the text, narrating in plain language why each character matches or
  fails. A tight, visual single-feature build that's perfect for a short sprint
  and genuinely useful for learning." tags: ["cli-tools","testing"]

**AI / ML, 6-12h**
- ❌ "An AI chatbot." / "A recommendation system." (category, no hook)
- ✅ name: "Finger-Spelling Tutor with Live Webcam Feedback"
  desc: "A webcam tutor for sign-language finger-spelling: it detects your hand
  shape in real time, scores it against the target letter, and runs gamified
  drills that speed up as you improve. The demo has you spell a word on camera
  and watch the accuracy meter react instantly." tags: ["computer-vision","accessibility"]

**Environment, 12-24h**
- ❌ "An app to track your carbon footprint." (done, no mechanic)
- ✅ name: "Neighborhood Heat-Island Mapper from Open Satellite Tiles"
  desc: "Pull free thermal satellite tiles for any city, overlay them on a map,
  and surface the hottest blocks that also lack tree cover — then rank where
  planting would cool the most people per tree. The demo lets a judge type their
  own city and see the hot spots light up." tags: ["climate-data","biodiversity"]

**Games / Fun, 3-6h**
- ❌ "A multiplayer game." (category)
- ✅ name: "One-Button Co-op Platformer over a Shared Link"
  desc: "A two-player platformer where each player controls only ONE action —
  one jumps, one moves — so the level is impossible without talking to each
  other. Join instantly by sharing a link, no install. A tight, hilarious build
  whose whole charm is the forced coordination." tags: ["multiplayer","physics"]

**Social Impact, 6-12h**
- ❌ "An education platform." (buzzword, no mechanic)
- ✅ name: "Plain-Language Rewriter for Government Forms"
  desc: "Paste dense bureaucratic text and get back a plain-language version plus
  a checklist of exactly what documents you need to provide — in the reader's
  own language. The demo takes a real intimidating form and makes it suddenly
  understandable in one screen." tags: ["civic-tech","accessibility","language"]

Match this calibre. When unsure whether an idea is good enough, apply the 6-point
test in §2 — if it fails any point, fix it or drop it.
