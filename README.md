# North County Varsity

An independent varsity sports news and schedules platform for North County San Diego, beginning with Carlsbad. The site is statically generated from typed local data and uses a city registry so new communities can be added without restructuring routes.

## Development

```bash
npm install
npm run dev
```

The development server runs at <http://localhost:3001>. The committed `.env.development` points the existing public CMS reads and browser submissions at the local North County Press instance on <http://localhost:3000>; it contains origins only, never database or CMS credentials.

With North County Press running, verify the connection without accessing application data:

```bash
npm run check:cms
```

Pull the complete versioned snapshot of published articles before local or static builds:

```bash
npm run sync:articles
npm run dev
```

The sync validates both public contracts and atomically replaces `src/data/generated/public-content.v1.json`; it never sends credentials. A published Homepage configuration controls CMS story order, roles, display overrides, thumbnails, and read-downs. Publication and Homepage placement are independent: an unplaced published article remains available at its permanent URL without appearing on the Homepage. Re-running the command applies updates without creating duplicates. Drafts and private CMS fields are excluded by the server contracts.

Stop the frontend with Ctrl-C. In the North County Press repository, stop Payload and PostgreSQL with `docker compose down`; ordinary shutdown preserves its named database volume and local media.

## Environment separation

| Variable | Development | Production |
| --- | --- | --- |
| `CMS_PUBLIC_URL` | `http://localhost:3000` for server-side public CMS requests | Deployed HTTPS CMS origin |
| `NEXT_PUBLIC_CMS_URL` | `http://localhost:3000` for browser requests | Deployed HTTPS CMS origin |
| `NEXT_PUBLIC_FRONTEND_URL` | `http://localhost:3001` | Public site origin |
| `NEXT_PUBLIC_BASE_PATH` | Empty | Hosting-specific path when required |

Only public origins belong in this frontend. Payload secrets, database URLs, storage credentials, and CMS user credentials remain server-side and differ between development and production.

## Draft previews

With both development servers running, use **Preview** from a Payload article. Payload opens the static-compatible `/preview/` frontend route, which sends a short-lived, slug-bound bearer token to the CMS preview endpoint and renders the draft through the same article presentation component as published stories. Preview content is never written to the generated public bundle. Treat preview URLs as private while they remain valid.

## GitHub Pages

Every push to `main` builds and deploys the static export to GitHub Pages. The workflow sets the `/carlsbad-varsity` base path used by the project site URL.

Published CMS content is synchronized by the dedicated **Sync published CMS content** workflow at 7 and 37 minutes past each hour. Run it immediately from the CMS Homepage editor's **Build website** control or from GitHub **Actions → Sync published CMS content → Run workflow**. It validates the public article and Homepage contracts, retries bounded timeout failures while the free Render service wakes, preserves the last good snapshot on any fetch or validation failure, and creates a commit only when published content changes. After a changed snapshot is pushed, the sync workflow explicitly dispatches the Pages deployment (GitHub does not emit a second workflow trigger for an ordinary push made with its built-in workflow token).

If a sync fails, open its Actions run and inspect **Verify published-content contracts** or **Synchronize published content**, then use **Re-run failed jobs** after the CMS is healthy. An unavailable or malformed CMS response never replaces the committed snapshot. To restore earlier content, use `git log -- src/data/generated/public-content.v1.json`, restore that file from the chosen commit with `git restore --source=<commit> -- src/data/generated/public-content.v1.json`, review it, commit, and push; the push deploys the restored snapshot.

The static Request Coverage page submits to the private North County Press CMS. Set `NEXT_PUBLIC_CMS_URL` at build time to override the default `https://north-county-press.onrender.com` CMS origin.

## Data policy

No schedules, scores, standings, or reporting are invented. Empty states remain until verified data is supplied, and public CMS content is rendered only from validated published snapshots.
