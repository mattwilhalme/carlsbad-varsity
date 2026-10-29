import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../src/app/games/[gameId]/page.tsx", import.meta.url), "utf8");
const schedule = await readFile(new URL("../src/components/ScheduleList.tsx", import.meta.url), "utf8");

test("game routes statically generate every permanent ID", () => {
  assert.match(page, /games\.map\(\(game\) => \(\{ gameId: game\.id \}\)\)/);
  assert.match(page, /dynamicParams = false/);
});

test("schedule rows link by permanent game ID", () => {
  assert.match(schedule, /href=\{`\/games\/\$\{game\.id\}\/`\}/);
  assert.match(schedule, /aria-label=\{gameAriaLabel/);
});
