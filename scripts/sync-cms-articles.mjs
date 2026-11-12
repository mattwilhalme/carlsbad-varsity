import { mkdir, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const CONTRACT_VERSION = "north-county-varsity.articles.v1";
export const HOMEPAGE_CONTRACT_VERSION = "north-county-varsity.homepage.v1";

export function validateSnapshot(value) {
  if (!value || value.version !== CONTRACT_VERSION || !Array.isArray(value.articles)) throw new Error("Unsupported CMS article contract");
  const ids = new Set();
  const slugs = new Set();
  for (const article of value.articles) {
    if (!article || typeof article.id !== "string" || typeof article.slug !== "string" || !article.slug || !Array.isArray(article.body)) {
      throw new Error("Invalid public article record");
    }
    if (ids.has(article.id) || slugs.has(article.slug)) throw new Error(`Duplicate public article: ${article.slug}`);
    ids.add(article.id);
    slugs.add(article.slug);
  }
  return value;
}

export function validateHomepageSnapshot(value, articleSnapshot) {
  if (!value || value.version !== HOMEPAGE_CONTRACT_VERSION || !(value.homepage === null || typeof value.homepage === "object")) {
    throw new Error("Unsupported CMS homepage contract");
  }
  if (value.homepage === null) return value;

  const publishedIds = new Set(articleSnapshot.articles.map((article) => article.id));
  const homepageIds = new Set();
  for (const story of value.homepage.stories || []) {
    if (!story || !publishedIds.has(story.articleId) || typeof story.slug !== "string") throw new Error("Invalid public homepage story");
    if (homepageIds.has(story.articleId)) throw new Error(`Duplicate homepage article: ${story.slug}`);
    homepageIds.add(story.articleId);
    const readDownIds = new Set();
    for (const readDown of story.readDowns || []) {
      if (!publishedIds.has(readDown.id) || readDown.id === story.articleId || readDownIds.has(readDown.id)) {
        throw new Error(`Invalid homepage read-down: ${readDown.slug}`);
      }
      readDownIds.add(readDown.id);
    }
  }
  return value;
}

export async function syncArticles({ cmsOrigin = process.env.CMS_PUBLIC_URL || "http://localhost:3000" } = {}) {
  const articleEndpoint = new URL("/api/public-content/v1/articles", cmsOrigin);
  const homepageEndpoint = new URL("/api/public-content/v1/homepage", cmsOrigin);
  const [articleResponse, homepageResponse] = await Promise.all([articleEndpoint, homepageEndpoint].map((endpoint) =>
    fetch(endpoint, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(15_000) })));
  if (!articleResponse.ok || !homepageResponse.ok) throw new Error(`CMS returned articles=${articleResponse.status}, homepage=${homepageResponse.status}`);
  const articles = validateSnapshot(await articleResponse.json());
  const homepage = validateHomepageSnapshot(await homepageResponse.json(), articles);
  const snapshot = { articles, homepage };
  const output = resolve("src/data/generated/public-content.v1.json");
  const temporary = `${output}.tmp`;
  await mkdir(dirname(output), { recursive: true });
  await writeFile(temporary, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  await rename(temporary, output);
  console.log(`Synced ${articles.articles.length} published article(s) and ${homepage.homepage ? 1 : 0} homepage from ${cmsOrigin}`);
  return snapshot;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await syncArticles();
}
