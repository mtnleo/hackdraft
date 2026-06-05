# Design System: Hackstarter

> Source of truth for generating the Hackstarter UI in Google Stitch.
> Hackstarter is a single-screen web tool that gives developers **3 curated
> hackathon project ideas** filtered by available time and topic. It is a
> focused utility, **not** a marketing landing page — every rule below serves
> fast scanning and instant gratification, not scroll-storytelling.

---

## 0. Product in one paragraph

The user lands on a single screen and immediately sees **3 idea cards**
(randomized). A **segmented time slider** (5 stops) and a **topic dropdown**
filter the pool live as they change. A bold **"Shuffle 3"** button re-deals 3
new ideas within the current filter. Everything fits **above the fold on
desktop** (no scroll); on mobile the cards stack vertically and the page may
scroll. The whole UI is **bilingual EN/ES**, toggled top-right.

---

## 1. Visual Theme & Atmosphere

**Playful neo-brutalist-lite, in full daylight.** Warm off-white paper canvas,
crisp white cards that sit on the page like physical stickers — each outlined in
a confident ink border and lifted by a **hard, blur-free offset shadow**. The
mood is energetic, tactile, and handmade: bold flat color blocks, chunky type,
and snappy spring motion. It should feel like a well-designed indie dev tool or
a risograph poster — **never** a frosted-glass SaaS dashboard.

- **Density:** 4/10 — "Daily App Balanced". Generous breathing room; 3 cards and
  a control bar are the only things on screen.
- **Variance:** 5/10 — "Offset Asymmetric". Structured grid, but with playful
  off-grid touches (slight card lift, asymmetric header).
- **Motion:** 6/10 — "Fluid CSS / spring physics". Lively but never gratuitous;
  motion concentrates on the slider and the shuffle re-deal.

**Hard bans for this aesthetic:** NO glassmorphism, NO frosted blur, NO
gradients (flat fills only), NO soft diffused drop shadows (offset hard shadows
only), NO neon/outer glow.

---

## 2. Color Palette & Roles

Two brand accents (**blue + orange**) on a warm neutral base, plus a flat
three-color traffic-light scale reserved exclusively for difficulty.

**Neutrals**
- **Bone Paper** `#FBF7EF` — Primary background canvas (warm off-white, never pure white)
- **Card White** `#FFFFFF` — Card / surface fill, pops against Bone Paper
- **Ink** `#1A1A1A` — Primary text, all borders, all offset shadows (never `#000000`)
- **Slate Muted** `#5C5A54` — Secondary text, metadata, helper copy

**Brand accents**
- **Cobalt Blue** `#2C4BE0` — Structure & primary: topic dropdown active state,
  links, the second word of the wordmark, primary focus rings, slider active track
- **Sunset Orange** `#FF6A2B` — Energy & action: the "Shuffle 3" button fill, the
  slider thumb, hover highlights, the active time-stop label

**Difficulty scale (flat blocks only, used ONLY on the difficulty badge)**
- **Beginner Green** `#2EAD6B`
- **Intermediate Amber** `#F5B700`
- **Advanced Red** `#E5484D`

Rules: every colored block (button, badge, active control) carries a **2px Ink
border**. Accents are bold and saturated by design (neo-brutalist) — this
intentionally overrides any "low-saturation / single-accent" default.

---

## 3. Typography

- **Display — `Bricolage Grotesque`** (700/800): wordmark, the headline tagline,
  card titles. Quirky, slightly irregular, characterful. Tracking tight, sized
  with `clamp()`. Hierarchy comes from weight + color, not screaming size.
- **Body / UI — `Inter`** (400/500/600): tagline sub-line, descriptions, dropdown
  text, buttons, fallback note. Relaxed leading, descriptions capped ~60ch.
  *(Inter is a deliberate, approved choice here for maximum readability of dense
  bilingual idea copy — keep it.)*
- **Mono — `JetBrains Mono`** (500): tag chips, time-bucket labels, difficulty
  label text. Gives the dev-tool flavor and visually separates metadata from prose.

No serif anywhere. No emojis in type — use line/solid icons instead (clock for
time, shuffle/dice glyph for the button).

---

## 4. Component Stylings

**Wordmark (header, top-left)**
- "Hack" in Ink + "starter" in Cobalt Blue, Bricolage 800. Tagline directly
  below in Inter, Slate Muted.

**Language toggle (header, top-right)**
- Pill `EN | ES`, JetBrains Mono, 2px Ink border, 12px radius. Active language =
  Cobalt fill + white text; inactive = transparent + Ink text. Crossfade on switch.

**Segmented pill time slider (primary control)**
- A single LARGE rounded-pill container (~52px tall, fully rounded ends, 2px Ink
  border, Bone interior, 4px hard offset shadow) holding **5 equally-spaced
  labels**: `1-3h` `3-6h` `6-12h` `12-24h` `24h+`, JetBrains Mono. Generous
  internal padding and comfortable spacing between labels — roomy, not cramped.
  No vertical divider lines between segments.
- The **active segment is a fat rounded-rectangle block** (~10px radius) filled
  Sunset Orange, with its OWN 2px Ink border and a small hard offset shadow,
  sitting inside the pill like a movable token — with bold Ink label. Inactive
  labels are Slate Muted on the bare Bone track. Exactly one active at a time.
- This is a discrete 5-position control — NOT a free-number input, NOT a round
  draggable thumb on a thin line, NOT thin separated cells. It is the chunky
  "bar toggle": a roomy pill with one fat orange block that **slides fluidly
  between the 5 positions with spring physics**. Clickable + keyboard operable.

**Topic dropdown (secondary control)**
- Native-feeling select, 2px Ink border, 14px radius, Card White fill, 3px hard
  offset shadow. 10 options. Open state outlines in Cobalt. Chevron is a simple
  Ink icon (no animation gimmicks).

**Shuffle button (the hero action)**
- Largest, boldest control. Sunset Orange fill, Ink text, Bricolage 700, 2px Ink
  border, 16px radius, **6px hard offset shadow**. Leading shuffle icon (not an
  emoji). Label: "Shuffle 3" / "Mezclar 3".
- **Tactile press:** on `:active`, translate +3px,+3px and collapse shadow to
  2px (the block physically presses into the page). Hover lifts shadow to 8px.

**Idea card (×3)**
- Card White fill, 2px Ink border, 16px radius, **5px hard offset Ink shadow**.
  On hover: translate -2px,-2px and grow shadow to 7px (sticker lift).
- Vertical content order:
  1. **Difficulty badge** (top-left): flat difficulty-color block, 2px Ink
     border, JetBrains Mono uppercase label.
  2. **Time label** (top-right): clock icon + bucket (`6-12h`), JetBrains Mono,
     Slate Muted.
  3. **Title** — Bricolage 700, Ink, 2 lines max.
  4. **Description** — Inter, full `long_description` shown (no clamp / no
     "read more"), Slate-darkened Ink.
  5. **Tag chips** (bottom): 1-4 chips, JetBrains Mono, Bone fill, 1.5px Ink
     border, 999px radius. **Display-only — not clickable filters.**

**Fallback note banner**
- When the chosen Topic × Time combo is empty, a slim banner sits **directly
  above the 3 cards**: Cobalt-tinted Bone fill, 2px Ink left-border accent,
  small info icon, Inter text — e.g. *"No ideas for 24h+ in Cybersecurity —
  showing the closest match: 12-24h."* / ES equivalent. Never silent.

**Footer (pinned bottom)**
- One line, Inter small, Slate Muted: "Made with love by Martin" · GitHub ·
  LinkedIn · contact email · short legal disclaimer (ideas compiled from public
  data; contact for takedown). Icon links, no emojis.

---

## 5. Layout Principles

**THE LAYOUT IS A SINGLE FIXED STRUCTURE. It never changes between states or
variations.** Page is a flex column at `min-h-[100dvh]` (never `h-screen`) with
exactly four stacked zones, top to bottom:

1. **Navbar** — full width. Wordmark top-LEFT ("Hack" Ink + "starter" Cobalt).
   **EN | ES toggle top-RIGHT — the language toggle lives HERE and ONLY here.**
   No other nav items (no Explore / Saved / Profile / menu links — do not invent
   any). A 2px Ink bottom divider under the navbar.
2. **Control bar** — one horizontal row directly below the navbar, inside the
   centered container: **topic dropdown (left) → segmented pill time slider
   (center) → "Shuffle 3" button (right)**. The language toggle is NOT in this
   row. The Shuffle button is the largest, boldest element in the row.
3. **Results** — the 3 idea cards in a CSS Grid row (3 equal columns, ~24px gap).
   This zone is `flex: 1` so it absorbs leftover vertical space and keeps the
   footer at the bottom.
4. **Footer** — pinned to the BOTTOM of the viewport (it is the last child of the
   min-h-[100dvh] column, so it sits at the bottom even when content is short).
   **The footer must never float in the middle of the screen.**

Container: centered, max-width ~1200px, generous horizontal padding.

**Card sizing — avoid the empty-whitespace problem:** cards hug their content.
Use `align-items: start` on the grid so cards are NOT stretched to a tall uniform
height when descriptions are short. A card's height = its content + padding. The
card row should feel full and balanced, not three tall boxes with dead space at
the bottom. Full descriptions are always shown (no truncation).

- The "3 equal cards" row is intentional and core to the product (scan 3 ideas at
  a glance) — this overrides the generic "no 3-column row" guideline.
- Optional playful touch: a ≤1° tilt or tiny vertical offset per card so the row
  reads hand-placed. Keep text upright/legible.
- **Tablet (768-1023px):** control bar may wrap; cards go 2-up then 1; scroll
  allowed. **Mobile (< 768px):** one column, stacked; control bar stacks
  (dropdown → slider → full-width Shuffle); footer still last. EN|ES stays in the
  navbar. No horizontal scroll ever; touch targets ≥ 44px.
- CSS Grid for the card row (no flexbox percentage / `calc()` hacks).
- No overlapping elements — every element owns its spatial zone.

---

## 6. Motion & Interaction

- **Spring physics baseline:** `stiffness 100, damping 20`. No linear easing.
- **Slider:** thumb drags fluidly and **springs into** the nearest of 5 stops;
  filled Cobalt track animates with it; active label weight transitions.
- **Shuffle re-deal (signature moment):** on Shuffle (or filter change) the 3
  current cards exit (drop + fade, slight rotate) and 3 new cards enter with a
  **staggered cascade** (~70ms between cards), springing up into place. This is
  the app's most-repeated action — make it feel satisfying.
- **Card hover:** spring lift (translate + shadow growth).
- **Button press:** tactile translate + shadow collapse (see §4).
- **Language switch:** quick crossfade of swapped text.
- Animate **only** `transform` and `opacity` (hardware-accelerated). Never
  animate `top/left/width/height`. No infinite/perpetual loops needed — motion is
  event-driven (this is a tool, not a hero showreel).

---

## 7. Anti-Patterns (Banned)

- **No glassmorphism, no frosted blur, no translucent layers.**
- **No gradients** of any kind — flat fills only.
- **No soft/diffused drop shadows** — hard blur-free offset shadows only.
- No pure black `#000000` (use Ink `#1A1A1A`).
- No neon or outer-glow shadows; no oversaturated *random* colors outside the
  defined palette.
- No emojis anywhere — use line/solid icons.
- No gradient text, no custom mouse cursors.
- No overlapping elements; clean spatial separation always.
- No serif fonts.
- No AI copywriting clichés ("Elevate", "Seamless", "Unleash", "Next-Gen").
- No filler UI text ("Scroll to explore", bouncing chevrons, scroll arrows).
- No generic placeholder names; use the real mock ideas in §9.
- No broken image links (this UI uses no photos — icons + type only).
- No loading spinners / no error states (data is local and instant — skip them).

---

## 8. Screen Brief & States (what Stitch should generate)

**CRITICAL: this is ONE screen with ONE fixed layout (§5). The "states" below are
the SAME screen with a single element changed — they are NOT alternative designs.
Across all states, the navbar, control-bar order, card grid, and footer position
stay byte-for-byte identical. Do not move the language toggle, do not re-order the
control bar, do not change the footer position, do not add or remove nav items
between states.**

**One screen, three states to mock:**

1. **Default (on load):** 3 random idea cards already populated. Time slider at a
   sensible default stop (e.g. `6-12h`), topic dropdown showing "All topics" or a
   default topic. Shuffle button prominent.
2. **Fallback:** identical, but with the fallback note banner visible above the
   cards (see §4).
3. **Shuffle re-deal:** mid-animation frame showing the 3 cards cascading in.

**Filters:**
- Time slider stops: `1-3h`, `3-6h`, `6-12h`, `12-24h`, `24h+` (note: there is no
  `48h+` — it's merged into `24h+`).
- Topic dropdown options (10): AI / ML, Crypto / Web3, Cybersecurity, Environment,
  Games / Fun, Health / Medtech, IoT / Hardware, Productivity / DevTools, Social
  Impact, Web / Frontend.

**Bilingual:** the EN|ES toggle swaps ALL chrome labels, the tagline, button
text, and the card body content (titles, descriptions, tag-chip labels) between
English and Spanish.

---

## 9. Mock Data (use these exact cards, not placeholders)

**Card A — AI / ML · 1-3h · Beginner**
- EN title: "Regex from Plain English with Live Match Preview"
- EN desc: "Describe what you want to match in plain English and the tool drafts a
  regex, then highlights every hit on a sample string you paste below. Each
  suggestion shows a confidence note and a one-line explanation of what the
  pattern does. A tight single-screen build perfect for a short sprint."
- ES title: "Regex desde lenguaje natural con vista previa de coincidencias"
- ES desc: "Describí en lenguaje natural lo que querés capturar y la herramienta
  arma un regex, luego resalta cada coincidencia sobre un texto de ejemplo que
  pegás debajo. Cada sugerencia muestra una nota de confianza y una explicación de
  una línea de lo que hace el patrón."
- tags: `llm-apps` `nlp`

**Card B — IoT / Hardware · 6-12h · Intermediate**
- EN title: "Desk Presence Light that Mirrors Your Calendar"
- EN desc: "A small RGB light on your desk turns red during meetings, amber 5
  minutes before, and green when you're free, reading straight from your calendar
  feed. A tiny local service polls events and pushes color states to the device
  over USB or Wi-Fi. Great weekend-sized build with a satisfying physical payoff."
- ES title: "Luz de presencia de escritorio que refleja tu calendario"
- ES desc: "Una pequeña luz RGB en tu escritorio se pone roja durante reuniones,
  ámbar 5 minutos antes y verde cuando estás libre, leyendo directamente tu
  calendario. Un servicio local consulta los eventos y envía los estados de color
  al dispositivo por USB o Wi-Fi."
- tags: `lights` `home-automation` `arduino-rpi`

**Card C — Cybersecurity · 12-24h · Advanced**
- EN title: "Phishing URL Triage Dashboard with Heuristic Scoring"
- EN desc: "Paste or feed a batch of suspicious URLs and get a ranked triage view
  scoring each on domain age, look-alike characters, redirect chains, and
  certificate red flags. Each row expands to show the signals behind its score so
  an analyst can decide fast. A meatier build that rewards a full hack day."
- ES title: "Panel de triage de URLs de phishing con puntaje heurístico"
- ES desc: "Pegá o cargá un lote de URLs sospechosas y obtené una vista de triage
  ordenada que puntúa cada una por antigüedad del dominio, caracteres similares,
  cadenas de redirección y señales del certificado. Cada fila se expande para
  mostrar las señales detrás del puntaje."
- tags: `web-security` `forensics`
