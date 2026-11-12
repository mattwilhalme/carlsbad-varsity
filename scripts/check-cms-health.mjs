const cmsOrigin = (process.env.CMS_PUBLIC_URL || "http://localhost:3000").replace(/\/$/, "");
const endpoint = new URL("/api/health", cmsOrigin);

try {
  const response = await fetch(endpoint, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(5_000),
  });
  const body = await response.json().catch(() => null);

  if (!response.ok || body?.ok !== true || body?.service !== "north-county-press") {
    throw new Error(`unexpected response (${response.status})`);
  }

  console.log(`CMS health check passed: ${endpoint}`);
} catch (error) {
  console.error(`CMS health check failed: ${endpoint}`);
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
