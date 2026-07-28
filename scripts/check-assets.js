// Verify that _data/alts.json describes exactly the files in assets/.
//
// The gallery keys alt text by each file's path relative to assets/, so the two
// must stay in lockstep. They drift silently: a file added without a key renders
// with a "no alt text" flag, and a file renamed leaves its old key stranded while
// the new name has none. This check turns that drift into a failed build.
//
// Run: npm run check
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetsDir = path.join(root, "assets");
const altsFile = path.join(root, "_data", "alts.json");

// Mirrors the walk in _data/assets.js — if that changes, change this too.
function listAssets() {
  return fs
    .readdirSync(assetsDir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && !entry.name.startsWith("."))
    .map((entry) =>
      path.relative(assetsDir, path.join(entry.parentPath, entry.name)).split(path.sep).join("/"),
    )
    .filter((name) => !name.split("/").some((part) => part.startsWith(".")))
    .sort();
}

function report(label, items, hint) {
  if (items.length === 0) return false;
  console.error(`\n${label} (${items.length}):`);
  for (const item of items) console.error(`  ${item}`);
  console.error(`  → ${hint}`);
  return true;
}

const files = listAssets();
const alts = JSON.parse(fs.readFileSync(altsFile, "utf8"));
const keys = Object.keys(alts);

const orphans = keys.filter((key) => !files.includes(key));
const missing = files.filter((file) => !keys.includes(file));
const empty = keys.filter((key) => !String(alts[key]).trim());
const unsorted = JSON.stringify(keys) !== JSON.stringify([...keys].sort());

let failed = false;
failed =
  report(
    "Keys in alts.json with no matching file",
    orphans,
    "the file was renamed or deleted; run `npm run fix-renames` to carry renamed keys over",
  ) || failed;
failed =
  report(
    "Files in assets/ with no alt-text key",
    missing,
    "add a key to _data/alts.json (the key is the path relative to assets/)",
  ) || failed;
failed =
  report("Keys with empty alt text", empty, "write a description of what the image shows") ||
  failed;

if (unsorted) {
  console.error("\nKeys in alts.json are not sorted.");
  console.error("  → sort them so diffs stay readable");
  failed = true;
}

if (failed) {
  console.error(`\nFAIL — ${files.length} files, ${keys.length} keys.\n`);
  process.exit(1);
}

console.log(`OK — ${files.length} files, ${keys.length} keys, all described.`);
