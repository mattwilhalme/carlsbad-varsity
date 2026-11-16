import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";

const source = await readFile(new URL("../src/data/site-data.ts", import.meta.url), "utf8");
const ids = [...source.matchAll(/^\s*\["(sc-(?:bbb|gbb)-2025-\d{3})"/gm)].map(([, id]) => id);
assert.equal(ids.length, 58, "expected all 58 verified games");
const snapshot = JSON.parse(await readFile(new URL("../src/data/generated/public-content.v1.json", import.meta.url), "utf8"));
const cmsIds = (snapshot.scheduleDisplay?.display?.sources || []).flatMap((source) => source.games.map((game) => game.id));

for (const id of [...ids, ...cmsIds]) {
  const page = new URL(`../out/games/${id}/index.html`, import.meta.url);
  await access(page, constants.R_OK);
  const html = await readFile(page, "utf8");
  assert.match(html, /Report a Correction/);
}

console.log(`Verified ${ids.length + cmsIds.length} directly refreshable static game routes.`);
