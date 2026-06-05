#!/usr/bin/env node
/**
 * combine.js — merge all per-topic JSON files in data/csv/ into:
 *   - data/all-ideas.json  (master array, source for the loader)
 *   - data/all-ideas.csv   (single sheet for Google Sheets review)
 *
 * Run after harvesting/curation:  node scripts/combine.js
 * The CSV is RFC-4180 quoted; tags are written as a JSON-array string in one
 * cell so scripts/load.js can parse them straight back after the Sheet round-trip.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const CSV_DIR = path.join(ROOT, "data/csv");

const COLUMNS = [
  "name", "name_es", "long_description", "long_description_es",
  "topic", "time_bucket", "min_hours", "max_hours", "difficulty", "tags",
];

const files = fs.readdirSync(CSV_DIR).filter((f) => f.endsWith(".json")).sort();
const all = [];
const perTopic = {};

for (const f of files) {
  const arr = JSON.parse(fs.readFileSync(path.join(CSV_DIR, f), "utf8"));
  perTopic[f.replace(".json", "")] = arr.length;
  for (const o of arr) all.push(o);
}

// master JSON
fs.writeFileSync(path.join(ROOT, "data/all-ideas.json"), JSON.stringify(all, null, 2) + "\n");

// CSV
const q = (v) => {
  const s = Array.isArray(v) ? JSON.stringify(v) : String(v ?? "");
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};
const lines = [COLUMNS.join(",")];
for (const o of all) lines.push(COLUMNS.map((c) => q(o[c])).join(","));
fs.writeFileSync(path.join(ROOT, "data/all-ideas.csv"), lines.join("\n") + "\n");

console.log(`Combined ${files.length} files -> ${all.length} ideas`);
console.log("Per topic:", JSON.stringify(perTopic, null, 2));
console.log("\nWrote: data/all-ideas.json  and  data/all-ideas.csv");
