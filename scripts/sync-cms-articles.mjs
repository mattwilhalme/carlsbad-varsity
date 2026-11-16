import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const CONTRACT_VERSION = "north-county-varsity.articles.v1";
export const HOMEPAGE_CONTRACT_VERSION = "north-county-varsity.homepage.v1";
export const SCHEDULE_DISPLAY_CONTRACT_VERSION = "north-county-varsity.schedule-display.v2";
export const DEFAULT_OUTPUT = "src/data/generated/public-content.v1.json";

const ARTICLE_KEYS = new Set([
  "id", "slug", "headline", "subheadline", "summary", "authors", "body",
  "leadImage", "publishedAt", "updatedAt", "relationships",
]);
const HOMEPAGE_KEYS = new Set(["id", "title", "publication", "updatedAt", "stories"]);
const SCHEDULE_DISPLAY_KEYS = new Set(["id", "title", "publication", "updatedAt", "sources"]);
const SCHEDULE_SOURCE_KEYS = new Set(["scheduleImportId", "destinations", "team", "startsOn", "endsOn", "games"]);
const SCHEDULE_TEAM_KEYS = new Set(["id", "season", "school", "sport"]);
const SCHEDULE_RELATION_KEYS = new Set(["id", "name", "slug"]);
const SCHEDULE_GAME_KEYS = new Set(["id", "date", "startsAt", "timeTBD", "eventTitle", "opponent", "site", "venue", "status", "teamScore", "opponentScore", "scoreSource", "scoreSourceUrl", "scoreUpdatedAt", "updatedAt"]);

function rejectPrivateFields(value, allowed, label) {
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) throw new Error(`Unexpected ${label} field: ${key}`);
  }
}

export function validateSnapshot(value) {
  if (!value || value.version !== CONTRACT_VERSION || !Array.isArray(value.articles)) throw new Error("Unsupported CMS article contract");
  const ids = new Set();
  const slugs = new Set();
  for (const article of value.articles) {
    if (!article || typeof article.id !== "string" || typeof article.slug !== "string" || !article.slug || !Array.isArray(article.body)) {
      throw new Error("Invalid public article record");
    }
    rejectPrivateFields(article, ARTICLE_KEYS, "public article");
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
  rejectPrivateFields(value.homepage, HOMEPAGE_KEYS, "public homepage");

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

export function validateScheduleDisplaySnapshot(value) {
  if (!value || value.version !== SCHEDULE_DISPLAY_CONTRACT_VERSION || !(value.display === null || typeof value.display === "object")) {
    throw new Error("Unsupported CMS Schedule Display contract");
  }
  if (value.display === null) return value;
  rejectPrivateFields(value.display, SCHEDULE_DISPLAY_KEYS, "public Schedule Display");
  if (!Array.isArray(value.display.sources)) throw new Error("Invalid public Schedule Display sources");
  const importIds = new Set();
  const gameIds = new Set();
  const destinations = new Set(["team-page", "homepage-upcoming", "homepage-results"]);
  for (const source of value.display.sources) {
    rejectPrivateFields(source, SCHEDULE_SOURCE_KEYS, "public schedule source");
    if (typeof source.scheduleImportId !== "string" || importIds.has(source.scheduleImportId) || !Array.isArray(source.destinations) || !Array.isArray(source.games)) {
      throw new Error("Invalid public schedule source");
    }
    importIds.add(source.scheduleImportId);
    if (!source.destinations.length || source.destinations.some((item) => !destinations.has(item))) throw new Error("Invalid public schedule destination");
    rejectPrivateFields(source.team, SCHEDULE_TEAM_KEYS, "public schedule team");
    for (const relation of [source.team.school, source.team.sport]) {
      if (relation !== null) rejectPrivateFields(relation, SCHEDULE_RELATION_KEYS, "public schedule relation");
    }
    for (const game of source.games) {
      rejectPrivateFields(game, SCHEDULE_GAME_KEYS, "public schedule game");
      if (typeof game.id !== "string" || gameIds.has(game.id) || typeof game.date !== "string") throw new Error("Invalid or duplicate public schedule game");
      const hasTeamScore = game.teamScore !== null;
      const hasOpponentScore = game.opponentScore !== null;
      if (hasTeamScore !== hasOpponentScore || (hasTeamScore && (!Number.isInteger(game.teamScore) || !Number.isInteger(game.opponentScore) || typeof game.scoreSource !== "string"))) {
        throw new Error("Invalid public schedule score");
      }
      gameIds.add(game.id);
    }
  }
  return value;
}

function comparableSnapshot(snapshot) {
  return JSON.stringify({
    articles: { ...snapshot.articles, generatedAt: undefined },
    homepage: { ...snapshot.homepage, generatedAt: undefined },
    scheduleDisplay: { ...snapshot.scheduleDisplay, generatedAt: undefined },
  });
}

export async function syncArticles({
  cmsOrigin = process.env.CMS_PUBLIC_URL || "http://localhost:3000",
  fetchImpl = fetch,
  outputPath = DEFAULT_OUTPUT,
  timeoutMs = 75_000,
  attempts = 3,
} = {}) {
  const articleEndpoint = new URL("/api/public-content/v1/articles", cmsOrigin);
  const homepageEndpoint = new URL("/api/public-content/v1/homepage", cmsOrigin);
  const scheduleDisplayEndpoint = new URL("/api/public-content/v1/schedule-display", cmsOrigin);
  let articleResponse;
  let homepageResponse;
  let scheduleDisplayResponse;
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      [articleResponse, homepageResponse, scheduleDisplayResponse] = await Promise.all([articleEndpoint, homepageEndpoint, scheduleDisplayEndpoint].map((endpoint) =>
        fetchImpl(endpoint, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(timeoutMs) })));
      break;
    } catch (error) {
      lastError = error;
      const retryable = error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError")
      if (attempt < attempts && retryable) {
        console.warn(`CMS request attempt ${attempt} failed; retrying after the service wakes.`);
        await new Promise((resolveDelay) => setTimeout(resolveDelay, attempt * 2_000));
      } else {
        break;
      }
    }
  }
  if (!articleResponse || !homepageResponse || !scheduleDisplayResponse) {
    throw new Error(`Could not fetch published CMS content from ${cmsOrigin}: ${lastError instanceof Error ? lastError.message : lastError}`);
  }
  if (!articleResponse.ok || !homepageResponse.ok || !scheduleDisplayResponse.ok) {
    throw new Error(`CMS published-content request failed: articles=${articleResponse.status}, homepage=${homepageResponse.status}, scheduleDisplay=${scheduleDisplayResponse.status}`);
  }
  const articles = validateSnapshot(await articleResponse.json());
  const homepage = validateHomepageSnapshot(await homepageResponse.json(), articles);
  const scheduleDisplay = validateScheduleDisplaySnapshot(await scheduleDisplayResponse.json());
  const snapshot = { articles, homepage, scheduleDisplay };
  const output = resolve(outputPath);
  try {
    const existing = JSON.parse(await readFile(output, "utf8"));
    if (comparableSnapshot(existing) === comparableSnapshot(snapshot)) {
      console.log(`Published content is unchanged; kept ${outputPath}`);
      return { changed: false, snapshot: existing };
    }
  } catch (error) {
    if (error?.code !== "ENOENT" && !(error instanceof SyntaxError)) throw error;
  }
  const temporary = `${output}.tmp`;
  await mkdir(dirname(output), { recursive: true });
  await writeFile(temporary, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  await rename(temporary, output);
  console.log(`Synced ${articles.articles.length} published article(s), ${homepage.homepage ? 1 : 0} homepage, and ${scheduleDisplay.display ? 1 : 0} Schedule Display from ${cmsOrigin}`);
  return { changed: true, snapshot };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await syncArticles();
}
