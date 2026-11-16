import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const homepage = await readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8");
const rail = await readFile(new URL("../src/components/HomeGameRail.tsx", import.meta.url), "utf8");

test("homepage schedule rails use curated placements without placeholder games", () => {
  assert.match(homepage, /getCuratedHomepageGames\(\)/);
  assert.match(homepage, /hasPublishedScheduleDisplay \? curatedGames\.upcoming/);
  assert.match(homepage, /hasPublishedScheduleDisplay \? curatedGames\.results/);
  assert.match(homepage, /game\.dataStatus === "verified"/);
});

test("homepage game cards support CMS teams and honest empty states", () => {
  assert.match(rail, /allScheduleTeams\.find/);
  assert.doesNotMatch(rail, /\(1-0\)/);
  assert.match(rail, /return "Final"/);
  assert.match(rail, /className="rail-empty"/);
});
