import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { CONTRACT_VERSION, HOMEPAGE_CONTRACT_VERSION, SCHEDULE_DISPLAY_CONTRACT_VERSION, syncArticles, validateHomepageSnapshot, validateScheduleDisplaySnapshot, validateSnapshot } from "../scripts/sync-cms-articles.mjs";

const article = {
  id: "1", slug: "published-story", headline: "Published story", subheadline: "", summary: "Summary",
  authors: [], body: [], leadImage: null, publishedAt: "2026-11-14T00:00:00.000Z",
  updatedAt: "2026-11-14T00:00:00.000Z", relationships: { publication: null, schools: [], sports: [], teams: [] },
};
const articlesResponse = (articles = [article], generatedAt = "2026-11-14T00:00:00.000Z") =>
  ({ version: CONTRACT_VERSION, generatedAt, articles });
const homepageResponse = (homepage = { id: "1", title: "Homepage", publication: null, updatedAt: "2026-11-14T00:00:00.000Z", stories: [] }, generatedAt = "2026-11-14T00:00:00.000Z") =>
  ({ version: HOMEPAGE_CONTRACT_VERSION, generatedAt, homepage });
const scheduleDisplayResponse = (display = null, generatedAt = "2026-11-14T00:00:00.000Z") =>
  ({ version: SCHEDULE_DISPLAY_CONTRACT_VERSION, generatedAt, display });
const response = (value, status = 200) => new Response(JSON.stringify(value), { status, headers: { "Content-Type": "application/json" } });

function fetchPair(articles, homepage) {
  return async (url) => String(url).endsWith("/articles") ? response(articles) : String(url).endsWith("/homepage") ? response(homepage) : response(scheduleDisplayResponse());
}

test("accepts the versioned article snapshot", () => {
  assert.equal(validateSnapshot({ version: CONTRACT_VERSION, generatedAt: new Date().toISOString(), articles: [article] }).articles[0].slug, "published-story");
});

test("rejects duplicate stable IDs or slugs", () => {
  assert.throws(() => validateSnapshot({ version: CONTRACT_VERSION, articles: [article, { ...article }] }), /Duplicate public article/);
});

test("rejects private or unversioned article fields", () => {
  assert.throws(() => validateSnapshot(articlesResponse([{ ...article, editorialNotes: "private" }])), /Unexpected public article field/);
  assert.throws(() => validateSnapshot({ ...articlesResponse(), version: "future" }), /Unsupported CMS article contract/);
});

test("validates homepage stories against the published article snapshot", () => {
  const articles = validateSnapshot({ version: CONTRACT_VERSION, articles: [article] });
  const homepage = validateHomepageSnapshot({
    version: HOMEPAGE_CONTRACT_VERSION,
    homepage: { stories: [{ articleId: "1", slug: article.slug, readDowns: [] }] },
  }, articles);
  assert.equal(homepage.homepage.stories[0].slug, article.slug);
});

test("rejects homepage references missing from published articles", () => {
  const articles = validateSnapshot({ version: CONTRACT_VERSION, articles: [article] });
  assert.throws(() => validateHomepageSnapshot({
    version: HOMEPAGE_CONTRACT_VERSION,
    homepage: { stories: [{ articleId: "2", slug: "draft", readDowns: [] }] },
  }, articles), /Invalid public homepage story/);
});

test("accepts an intentionally empty published homepage", () => {
  assert.equal(validateHomepageSnapshot(homepageResponse(), articlesResponse()).homepage.stories.length, 0);
});

test("validates an intentionally empty Schedule Display and rejects private fields", () => {
  assert.equal(validateScheduleDisplaySnapshot(scheduleDisplayResponse()).display, null);
  assert.throws(() => validateScheduleDisplaySnapshot(scheduleDisplayResponse({
    id: "1", title: "Display", publication: { id: "1", name: "NCV", slug: "ncv" }, updatedAt: "now", sources: [], internalNotes: "private",
  })), /Unexpected public Schedule Display field/);
});

test("published articles do not appear on the Homepage without placement", async () => {
  const editorialData = await readFile(new URL("../src/data/editorial-data.ts", import.meta.url), "utf8");
  assert.match(editorialData, /export const homepageStories = configuredStories/);
  assert.doesNotMatch(editorialData, /\? publishedStories\s*:\s*configuredStories/);
});

test("unchanged published content does not rewrite the snapshot", async () => {
  const directory = await mkdtemp(join(tmpdir(), "ncv-sync-"));
  const outputPath = join(directory, "snapshot.json");
  const existing = { articles: articlesResponse(), homepage: homepageResponse(), scheduleDisplay: scheduleDisplayResponse() };
  await writeFile(outputPath, `${JSON.stringify(existing, null, 2)}\n`);
  const result = await syncArticles({
    cmsOrigin: "https://cms.example",
    fetchImpl: fetchPair(articlesResponse([article], "later"), homepageResponse(existing.homepage.homepage, "later")),
    outputPath,
  });
  assert.equal(result.changed, false);
  assert.deepEqual(JSON.parse(await readFile(outputPath, "utf8")), existing);
});

test("published updates and removals atomically replace the snapshot", async () => {
  const directory = await mkdtemp(join(tmpdir(), "ncv-sync-"));
  const outputPath = join(directory, "snapshot.json");
  await writeFile(outputPath, `${JSON.stringify({ articles: articlesResponse(), homepage: homepageResponse(), scheduleDisplay: scheduleDisplayResponse() })}\n`);
  const updated = { ...article, headline: "Updated headline" };
  const changed = await syncArticles({ cmsOrigin: "https://cms.example", fetchImpl: fetchPair(articlesResponse([updated]), homepageResponse()), outputPath });
  assert.equal(changed.changed, true);
  assert.equal(JSON.parse(await readFile(outputPath, "utf8")).articles.articles[0].headline, "Updated headline");
  const removed = await syncArticles({ cmsOrigin: "https://cms.example", fetchImpl: fetchPair(articlesResponse([]), homepageResponse(null)), outputPath });
  assert.equal(removed.changed, true);
  assert.equal(JSON.parse(await readFile(outputPath, "utf8")).articles.articles.length, 0);
});

test("malformed or unavailable CMS responses preserve the last good snapshot", async () => {
  const directory = await mkdtemp(join(tmpdir(), "ncv-sync-"));
  const outputPath = join(directory, "snapshot.json");
  const original = "last-known-good\n";
  await writeFile(outputPath, original);
  await assert.rejects(syncArticles({ cmsOrigin: "https://cms.example", fetchImpl: fetchPair({ version: "bad", articles: [] }, homepageResponse()), outputPath }), /Unsupported CMS article contract/);
  assert.equal(await readFile(outputPath, "utf8"), original);
  await assert.rejects(syncArticles({ cmsOrigin: "https://cms.example", fetchImpl: async () => { throw new Error("offline"); }, outputPath }), /Could not fetch published CMS content/);
  assert.equal(await readFile(outputPath, "utf8"), original);
});

test("article rendering never injects CMS HTML", async () => {
  const renderer = await readFile(new URL("../src/components/ArticleBody.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(renderer, /dangerouslySetInnerHTML/);
});

test("article presentation uses the optional subheadline instead of the listing summary", async () => {
  const presentation = await readFile(new URL("../src/components/ArticlePresentation.tsx", import.meta.url), "utf8");
  assert.match(presentation, /story\.subheadline/);
  assert.doesNotMatch(presentation, /className="article-dek">\{story\.dek\}/);
});

test("article presentation uses the CMS publication name without a hard-coded city", async () => {
  const presentation = await readFile(new URL("../src/components/ArticlePresentation.tsx", import.meta.url), "utf8");
  const mapper = await readFile(new URL("../src/data/public-article-mapper.ts", import.meta.url), "utf8");
  assert.match(presentation, /story\.publicationName/);
  assert.doesNotMatch(presentation, /· Carlsbad/);
  assert.match(mapper, /relationships\.publication\?\.name/);
});

test("articles without CMS media do not receive a placeholder image", async () => {
  const mapper = await readFile(new URL("../src/data/public-article-mapper.ts", import.meta.url), "utf8");
  const presentation = await readFile(new URL("../src/components/ArticlePresentation.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(mapper, /north-county-field/);
  assert.match(mapper, /: undefined/);
  assert.match(presentation, /story\.image \? <figure/);
});

test("article timestamps preserve published and updated values", async () => {
  const mapper = await readFile(new URL("../src/data/public-article-mapper.ts", import.meta.url), "utf8");
  const timestamps = await readFile(new URL("../src/components/ArticleTimestamps.tsx", import.meta.url), "utf8");
  assert.match(mapper, /updatedAt: article\.updatedAt/);
  assert.match(timestamps, /SIX_HOURS/);
  assert.match(timestamps, /now\.getHours\(\) < 23/);
  assert.match(timestamps, /Published \{published\}/);
  assert.match(timestamps, /Updated \{updated\}/);
});

test("article copy uses the wider, larger reading measure", async () => {
  const styles = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");
  assert.match(styles, /grid-template-columns: minmax\(0, 820px\)/);
  assert.match(styles, /article-copy > p[^}]+1\.3rem\/1\.75/s);
});

test("published and preview routes share one article presentation", async () => {
  const published = await readFile(new URL("../src/app/articles/[slug]/page.tsx", import.meta.url), "utf8");
  const preview = await readFile(new URL("../src/app/preview/PreviewClient.tsx", import.meta.url), "utf8");
  assert.match(published, /ArticlePresentation/);
  assert.match(preview, /ArticlePresentation/);
});

test("Schedule Display mapping preserves verified stable IDs and curated destinations", async () => {
  const mapper = await readFile(new URL("../src/data/schedule-display-data.ts", import.meta.url), "utf8");
  assert.match(mapper, /id: game\.id/);
  assert.match(mapper, /dataStatus: "verified"/);
  assert.match(mapper, /destinations\.includes\("team-page"\)/);
  assert.match(mapper, /destinations\.includes\("homepage-upcoming"\)/);
  assert.match(mapper, /destinations\.includes\("homepage-results"\)/);
  assert.doesNotMatch(mapper, /dataStatus: "placeholder"/);
});

test("curated CMS games receive permanent static routes", async () => {
  const route = await readFile(new URL("../src/app/games/[gameId]/page.tsx", import.meta.url), "utf8");
  const list = await readFile(new URL("../src/components/ScheduleList.tsx", import.meta.url), "utf8");
  assert.match(route, /allScheduleGames\.map/);
  assert.match(route, /allScheduleGames\.find/);
  assert.doesNotMatch(list, /game\.cmsManaged\s*\?/);
  assert.match(list, /href=\{`\/games\/\$\{game\.id\}\//);
});
