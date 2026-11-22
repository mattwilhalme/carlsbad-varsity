import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const schoolPage = await readFile(new URL("../src/components/SchoolPageView.tsx", import.meta.url), "utf8");
const schoolNews = await readFile(new URL("../src/components/SchoolNewsWell.tsx", import.meta.url), "utf8");
const schoolSchedule = await readFile(new URL("../src/components/SchoolSchedule.tsx", import.meta.url), "utf8");
const mapper = await readFile(new URL("../src/data/public-article-mapper.ts", import.meta.url), "utf8");
const editorialData = await readFile(new URL("../src/data/editorial-data.ts", import.meta.url), "utf8");

test("school pages default to active Schedule Display calendars and retain legacy seasons as archives", () => {
  assert.match(schoolPage, /curatedScheduleSources/);
  assert.match(schoolPage, /destinations\.includes\("team-page"\)/);
  assert.match(schoolPage, /archived: false/);
  assert.match(schoolPage, /archived: true/);
  assert.match(schoolSchedule, /Active calendar/);
  assert.match(schoolSchedule, /Archived calendar/);
  assert.doesNotMatch(schoolPage, /All varsity schedules and results/);
});

test("school news includes publication-wide and school-tagged articles", () => {
  assert.match(mapper, /schoolSlugs: article\.relationships\.schools/);
  assert.match(editorialData, /!story\.schoolSlugs\?\.length \|\| story\.schoolSlugs\.includes\(schoolSlug\)/);
  assert.match(schoolNews, /school-news-lead/);
  assert.match(schoolNews, /school-news-stack/);
});
