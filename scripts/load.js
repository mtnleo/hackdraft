#!/usr/bin/env node
/**
 * load.js — validate harvested ideas and emit a D1 seed.sql.
 *
 * Accepts a single .json (array of idea objects, e.g. a subagent's raw output)
 * or a .csv (e.g. exported from the curation Google Sheet). Validates every row
 * against data/topics.json and the schema constraints, then writes seed.sql.
 *
 * Usage:
 *   node scripts/load.js <input.json|input.csv> [--out data/seed.sql]
 *
 * Then load into D1:
 *   wrangler d1 execute hackathon-db --file=data/seed.sql --remote
 *
 * Validation is strict: any error aborts (no SQL written) so bad data never
 * reaches the database. Warnings are printed but do not block.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TOPICS = JSON.parse(fs.readFileSync(path.join(ROOT, "data/topics.json"), "utf8"));

// ---- build lookups from the source of truth -------------------------------
const TOPIC_IDS = new Set(TOPICS.topics.map((t) => t.id));
const TAGS_BY_TOPIC = Object.fromEntries(
  TOPICS.topics.map((t) => [t.id, new Set(t.tags.map((g) => g.id))])
);
const BUCKETS = Object.fromEntries(
  TOPICS.time_buckets.map((b) => [b.id, { min: b.min_hours, max: b.max_hours }])
);
const DIFFICULTIES = new Set(TOPICS.difficulties.map((d) => d.id));

const DESC_HARD_CAP = 550;

// ---- args -----------------------------------------------------------------
const args = process.argv.slice(2);
const inputPath = args.find((a) => !a.startsWith("--"));
const outIdx = args.indexOf("--out");
const outPath = outIdx !== -1 ? args[outIdx + 1] : path.join(ROOT, "data/seed.sql");

if (!inputPath) {
  console.error("Usage: node scripts/load.js <input.json|input.csv> [--out data/seed.sql]");
  process.exit(1);
}

// ---- minimal RFC-4180-ish CSV parser --------------------------------------
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\r") { /* ignore */ }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

function loadRows(p) {
  const raw = fs.readFileSync(p, "utf8");
  if (p.toLowerCase().endsWith(".json")) {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) throw new Error("JSON input must be an array of idea objects");
    return data;
  }
  const table = parseCSV(raw);
  const header = table[0].map((h) => h.trim());
  return table.slice(1).map((cells) => {
    const o = {};
    header.forEach((h, i) => (o[h] = (cells[i] ?? "").trim()));
    return o;
  });
}

function parseTags(value) {
  if (Array.isArray(value)) return value;
  const s = String(value).trim();
  if (s.startsWith("[")) return JSON.parse(s);
  if (s.includes("|")) return s.split("|").map((t) => t.trim()).filter(Boolean);
  return s.split(",").map((t) => t.trim()).filter(Boolean);
}

const esc = (s) => String(s).replace(/'/g, "''");

// ---- validate -------------------------------------------------------------
const rows = loadRows(inputPath);
const errors = [];
const warnings = [];
const clean = [];
const dist = { bucket: {}, difficulty: {}, topic: {} };

rows.forEach((r, idx) => {
  const where = `row ${idx + 1}${r.name ? ` ("${String(r.name).slice(0, 40)}")` : ""}`;
  const req = ["name", "name_es", "long_description", "long_description_es", "topic", "time_bucket", "difficulty"];
  for (const f of req) {
    if (!r[f] || String(r[f]).trim() === "") errors.push(`${where}: missing "${f}"`);
  }
  if (errors.length && errors[errors.length - 1].includes(where)) return;

  if (!TOPIC_IDS.has(r.topic)) errors.push(`${where}: unknown topic "${r.topic}"`);
  if (!BUCKETS[r.time_bucket]) errors.push(`${where}: unknown time_bucket "${r.time_bucket}"`);
  if (!DIFFICULTIES.has(r.difficulty)) errors.push(`${where}: unknown difficulty "${r.difficulty}"`);

  let tags = [];
  try { tags = parseTags(r.tags); } catch { errors.push(`${where}: tags not parseable`); }
  if (tags.length < 1 || tags.length > 4) errors.push(`${where}: tags must be 1-4 (got ${tags.length})`);
  const allowed = TAGS_BY_TOPIC[r.topic];
  if (allowed) for (const t of tags) if (!allowed.has(t)) errors.push(`${where}: tag "${t}" not valid for topic "${r.topic}"`);

  // hours must match bucket
  const b = BUCKETS[r.time_bucket];
  let minH = Number(r.min_hours), maxH = Number(r.max_hours);
  if (b) {
    if (!Number.isFinite(minH) || minH !== b.min) { warnings.push(`${where}: min_hours ${r.min_hours} != bucket min ${b.min}; corrected`); minH = b.min; }
    if (!Number.isFinite(maxH) || maxH !== b.max) { warnings.push(`${where}: max_hours ${r.max_hours} != bucket max ${b.max}; corrected`); maxH = b.max; }
  }

  // length checks
  const nameLen = String(r.name).length;
  if (nameLen < 30 || nameLen > 80) warnings.push(`${where}: name length ${nameLen} outside 40-70 target`);
  const descLen = String(r.long_description).length;
  if (descLen > DESC_HARD_CAP) errors.push(`${where}: long_description ${descLen} chars exceeds hard cap ${DESC_HARD_CAP}`);
  else if (descLen < 200 || descLen > 480) warnings.push(`${where}: long_description ${descLen} chars outside ~300-450 target`);

  if (!errors.some((e) => e.includes(where))) {
    clean.push({ ...r, min_hours: minH, max_hours: maxH, tags });
    dist.bucket[r.time_bucket] = (dist.bucket[r.time_bucket] || 0) + 1;
    dist.difficulty[r.difficulty] = (dist.difficulty[r.difficulty] || 0) + 1;
    dist.topic[r.topic] = (dist.topic[r.topic] || 0) + 1;
  }
});

// ---- report ---------------------------------------------------------------
console.log(`\nParsed ${rows.length} rows from ${path.relative(ROOT, inputPath)}`);
console.log(`Valid: ${clean.length}   Errors: ${errors.length}   Warnings: ${warnings.length}`);
if (warnings.length) console.log("\nWARNINGS:\n  " + warnings.join("\n  "));
if (errors.length) {
  console.error("\nERRORS (no SQL written):\n  " + errors.join("\n  "));
  process.exit(1);
}

console.log("\nDistribution:");
console.log("  by bucket:    ", JSON.stringify(dist.bucket));
console.log("  by difficulty:", JSON.stringify(dist.difficulty));
console.log("  by topic:     ", JSON.stringify(dist.topic));

// ---- emit seed.sql --------------------------------------------------------
const lines = [
  "-- Auto-generated by scripts/load.js — do not edit by hand.",
  `-- Source: ${path.relative(ROOT, inputPath)}  Rows: ${clean.length}`,
];
for (const r of clean) {
  lines.push(
    "INSERT INTO ideas (name, name_es, long_description, long_description_es, topic, time_bucket, min_hours, max_hours, difficulty, tags) VALUES (" +
      `'${esc(r.name)}', '${esc(r.name_es)}', '${esc(r.long_description)}', '${esc(r.long_description_es)}', ` +
      `'${esc(r.topic)}', '${esc(r.time_bucket)}', ${r.min_hours}, ${r.max_hours}, '${esc(r.difficulty)}', ` +
      `'${esc(JSON.stringify(r.tags))}');`
  );
}
lines.push("");
fs.writeFileSync(outPath, lines.join("\n"));
console.log(`\nWrote ${clean.length} inserts to ${path.relative(ROOT, outPath)}`);
console.log(`Load with: wrangler d1 execute hackathon-db --file=${path.relative(ROOT, outPath)} --remote\n`);
