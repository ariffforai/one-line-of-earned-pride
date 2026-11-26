// One Line of Earned Pride — u-mang-one-line-of-earned-pride-a0138557
// Writes a single original line (1-240 chars, pure printable ASCII) to
// /output/entry.txt and validates it at runtime before exiting.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
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

  // Byte-length gate: the 1-240 limit is on bytes as well as characters, and
  // a multi-byte character could pass the char count while exceeding the
  // byte budget. Fail loudly before writing anything.
  const byteLength = Buffer.byteLength(LINE, "utf8");
  if (byteLength < 1 || byteLength > 240) {
    fail(`entry is ${byteLength} bytes, must be 1-240 bytes`);
  }

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, LINE, "utf8");

  // Verify the file on disk round-trips byte-identically: its byte length
  // must match the validated in-memory byte length, or something altered
  // the content on the way out.
  const written = readFileSync(OUTPUT_PATH, "utf8");
  const writtenByteLength = Buffer.byteLength(written, "utf8");
  if (writtenByteLength !== byteLength || written !== LINE) {
    fail(`written file byte length ${writtenByteLength} mismatches expected ${byteLength}`);
  }

  console.log(`wrote ${chars.length} characters (${byteLength} bytes) to ${OUTPUT_PATH}`);
}

main();
