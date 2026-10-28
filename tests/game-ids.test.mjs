import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../src/data/site-data.ts", import.meta.url), "utf8");
const rows = [...source.matchAll(/^\s*\["(sc-(?:bbb|gbb)-2025-\d{3})",\s*"([^"]+)",\s*"[^"]+",\s*"(?:Home|Away|Neutral)",\s*"([^"]+)"/gm)]
  .map(([, id, date, opponent]) => ({ id, date, opponent }));

test("every imported game has a unique explicit ID", () => {
  assert.equal(rows.length, 58);
  assert.equal(new Set(rows.map(({ id }) => id)).size, rows.length);
});

test("game identity survives record reordering", () => {
  const identity = (records) => new Map(records.map(({ id, date, opponent }) => [id, `${date}|${opponent}`]));
  assert.deepEqual(identity([...rows].reverse()), identity(rows));
});

test("game IDs are not generated from array positions", () => {
  assert.doesNotMatch(source, /id:\s*`\$\{teamId\}-\$\{index/);
});
