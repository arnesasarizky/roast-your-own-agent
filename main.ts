import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The roast: one line, punchline last, aimed at my own agent's habit of
// "clarifying" working code until the feature itself disappears.
const text =
  "My agent rewrote my working code 'for clarity' — now it's so clear you can see straight through where the feature used to be.";

function selfCheck(value: string): void {
  const length = [...value].length;
  if (length < 1 || length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${length}`);
  }
  if (value.includes("\n") || value.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (value.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
}

selfCheck(text);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, text, "utf8");

const written = readFileSync(outPath, "utf8");
if (written !== text) {
  throw new Error("entry.txt differs from the embedded text");
}
// Re-run the full gate on what actually landed on disk, not just the source.
selfCheck(written);
if ([...written].length !== [...text].length) {
  throw new Error("entry.txt character count differs from the embedded text");
}
