import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { CONTRACT_VERSION, HOMEPAGE_CONTRACT_VERSION, validateHomepageSnapshot, validateSnapshot } from "../scripts/sync-cms-articles.mjs";

const article = { id: "1", slug: "published-story", body: [] };

test("accepts the versioned article snapshot", () => {
  assert.equal(validateSnapshot({ version: CONTRACT_VERSION, generatedAt: new Date().toISOString(), articles: [article] }).articles[0].slug, "published-story");
});

test("rejects duplicate stable IDs or slugs", () => {
  assert.throws(() => validateSnapshot({ version: CONTRACT_VERSION, articles: [article, { ...article }] }), /Duplicate public article/);
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

test("article rendering never injects CMS HTML", async () => {
  const renderer = await readFile(new URL("../src/components/ArticleBody.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(renderer, /dangerouslySetInnerHTML/);
});
