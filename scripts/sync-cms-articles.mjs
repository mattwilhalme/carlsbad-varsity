import { mkdir, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const CONTRACT_VERSION = "north-county-varsity.articles.v1";

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

export async function syncArticles({ cmsOrigin = process.env.CMS_PUBLIC_URL || "http://localhost:3000" } = {}) {
  const endpoint = new URL("/api/public-content/v1/articles", cmsOrigin);
  const response = await fetch(endpoint, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`CMS returned ${response.status}`);
  const snapshot = validateSnapshot(await response.json());
  const output = resolve("src/data/generated/articles.v1.json");
  const temporary = `${output}.tmp`;
  await mkdir(dirname(output), { recursive: true });
  await writeFile(temporary, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  await rename(temporary, output);
  console.log(`Synced ${snapshot.articles.length} published article(s) from ${endpoint}`);
  return snapshot;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await syncArticles();
}
