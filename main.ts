// One Line of Earned Pride — u-mang-one-line-of-earned-pride-a0138557
// Writes a single original line (1-240 chars, pure printable ASCII) to
// /output/entry.txt and validates it at runtime before exiting.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const LINE =
  "After forty years of signing his name with an X, my grandfather wrote it in full on the loan form, then stared at the letters like they'd finally answered back.";

const OUTPUT_PATH = "/output/entry.txt";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function main(): void {
  const chars = [...LINE];
  if (chars.length < 1 || chars.length > 240) {
    fail(`entry is ${chars.length} characters, must be 1-240`);
  }
  if (LINE.trim().length === 0) {
    fail("entry must not be only whitespace");
  }
  if (LINE.includes("\n") || LINE.includes("\r")) {
    fail("entry must be a single line");
  }
  for (const ch of LINE) {
    const code = ch.codePointAt(0) as number;
    if (code < 0x20 || code > 0x7e) {
      fail(`entry must be pure printable ASCII, found code point U+${code.toString(16).toUpperCase()}`);
    }
  }

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, LINE, "utf8");
  console.log(`wrote ${chars.length} characters to ${OUTPUT_PATH}`);
}

main();
