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

The sync replaces only `src/data/generated/articles.v1.json`, validates unique stable IDs and slugs, and never sends credentials. Existing hand-authored stories remain in place; CMS records with a colliding legacy slug are ignored rather than overwriting them. Re-running the command applies updates without creating duplicates. Drafts and private CMS fields are excluded by the server contract.

Stop the frontend with Ctrl-C. In the North County Press repository, stop Payload and PostgreSQL with `docker compose down`; ordinary shutdown preserves its named database volume and local media.

## Environment separation

| Variable | Development | Production |
| --- | --- | --- |
| `CMS_PUBLIC_URL` | `http://localhost:3000` for server-side public CMS requests | Deployed HTTPS CMS origin |
| `NEXT_PUBLIC_CMS_URL` | `http://localhost:3000` for browser requests | Deployed HTTPS CMS origin |
| `NEXT_PUBLIC_FRONTEND_URL` | `http://localhost:3001` | Public site origin |
| `NEXT_PUBLIC_BASE_PATH` | Empty | Hosting-specific path when required |

Only public origins belong in this frontend. Payload secrets, database URLs, storage credentials, and CMS user credentials remain server-side and differ between development and production.

## GitHub Pages

Every push to `main` builds and deploys the static export to GitHub Pages. The workflow sets the `/carlsbad-varsity` base path used by the project site URL.

The static Request Coverage page submits to the private North County Press CMS. Set `NEXT_PUBLIC_CMS_URL` at build time to override the default `https://north-county-press.onrender.com` CMS origin.

## Data policy

No schedules, scores, standings, or reporting are invented. Empty states remain until verified data is supplied. Sample story cards are explicitly labeled as placeholders.
