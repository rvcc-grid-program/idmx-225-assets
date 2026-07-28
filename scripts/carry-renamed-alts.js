// Carry alt-text keys across file renames, using git's rename detection.
//
// Renaming a file in assets/ strands its alt text under the old name. Git already
// knows the old-to-new mapping, so recovering it is mechanical — no guessing at
// which old name became which new one. This is how the 27 keys stranded by the
// 2026-07-27 rename commits were repaired.
//
// Run: npm run fix-renames [-- --write] [--since <ref>]
//   Without --write it prints what it would change and touches nothing.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const altsFile = path.join(root, "_data", "alts.json");

const args = process.argv.slice(2);
const write = args.includes("--write");
const sinceIndex = args.indexOf("--since");
const since = sinceIndex === -1 ? null : args[sinceIndex + 1];

if (sinceIndex !== -1 && !since) {
  console.error("--since needs a git ref, e.g. --since HEAD~10");
  process.exit(1);
}

// Oldest-to-newest, so a file renamed twice ends up mapped to its final name.
function renameMap() {
  const range = since ? [`${since}..HEAD`] : [];
  const log = execFileSync(
    "git",
    [
      "log",
      "--reverse",
      "--diff-filter=R",
      "-M",
      "--name-status",
      "--format=",
      ...range,
      "--",
      "assets",
    ],
    { cwd: root, encoding: "utf8" },
  );

  const map = new Map();
  for (const line of log.split("\n")) {
    const match = line.match(/^R\d+\t(\S+)\t(\S+)$/);
    if (!match) continue;
    const from = match[1].replace(/^assets\//, "");
    const to = match[2].replace(/^assets\//, "");
    // If `from` was itself the target of an earlier rename, retarget that entry
    // rather than adding a second hop.
    for (const [origin, current] of map) {
      if (current === from) map.set(origin, to);
    }
    map.set(from, to);
  }
  return map;
}

const alts = JSON.parse(fs.readFileSync(altsFile, "utf8"));
const map = renameMap();
const moved = [];
const conflicts = [];

const updated = {};
for (const [key, value] of Object.entries(alts)) {
  const target = map.get(key);
  if (!target || target === key) {
    updated[key] = value;
    continue;
  }
  // A key already present under the new name wins — it is the current text.
  if (Object.prototype.hasOwnProperty.call(alts, target)) {
    conflicts.push(`${key} → ${target} (target key already exists; dropping the stale one)`);
    continue;
  }
  updated[target] = value;
  moved.push(`${key} → ${target}`);
}

if (moved.length === 0 && conflicts.length === 0) {
  console.log("No stranded keys — nothing to carry over.");
  process.exit(0);
}

for (const line of moved) console.log(`  ${line}`);
for (const line of conflicts) console.log(`  ${line}`);

if (!write) {
  console.log(`\n${moved.length} key(s) would move. Re-run with --write to apply.`);
  process.exit(0);
}

const sorted = {};
for (const key of Object.keys(updated).sort()) sorted[key] = updated[key];
fs.writeFileSync(altsFile, `${JSON.stringify(sorted, null, 2)}\n`);
console.log(`\nWrote ${moved.length} moved key(s) to _data/alts.json. Run \`npm run check\` next.`);
