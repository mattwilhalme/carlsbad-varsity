# North County Press CMS plan

Status: planning only. No CMS, database, storage, or publishing integration is created by this document.

## 1. Current repository architecture

### Verified repository findings

- The public site is a Next.js 16.4 App Router application using React 19 and TypeScript (`package.json`). It is configured as a static export with trailing-slash URLs, an optional base path, and unoptimized images (`next.config.ts`).
- GitHub Actions builds every push to `main`, checks types and lint, verifies exported game routes, and deploys `out/` to GitHub Pages under `/carlsbad-varsity` (`.github/workflows/deploy-pages.yml`, `README.md`). There is no runtime application server.
- Domain records are typed in `src/domain/models.ts`; all current content is committed TypeScript data. Schools, teams, schedules, scores, game relationships, and a placeholder story live in `src/data/site-data.ts`. Demo articles and image metadata live in `src/data/editorial-data.ts`.
- The model already preserves permanent editorial game IDs and supports game status, home/away/neutral sites, scores by period, related coverage, source/verification status, and soft deletion. `docs/game-data-model.md` proposes normalized tables and audit rules for a future private editor.
- Routes include the homepage, `/articles/[slug]/`, permanent `/games/[gameId]/` pages, and canonical city/school/sport paths such as `/carlsbad/carlsbad/boys-basketball/`. Legacy `/schools/...` equivalents also exist. Dynamic routes are enumerated at build time with `generateStaticParams`; most reject unknown parameters.
- Site-wide and route-level Next.js metadata provide titles, descriptions, and canonical URLs for city, school, team, and game pages. Article metadata currently contains only title and description. No sitemap, robots configuration, Open Graph model, structured article/game data, or redirect policy was found.
- Editorial images are repository files under `public/images/`; the demo stories reuse one local photo whose credit is documented in `docs/image-credits.md`. There is no upload, transformation, rights, gallery, or download workflow.
- No Supabase package, client, environment configuration, migration, or runtime call is present. Supabase appears only as a future option in `docs/game-data-model.md`.
- No administrative or content-editing UI exists. Editorial changes currently require editing source files and redeploying the site.
- The unfinished work is chiefly data and workflow work: demo/placeholder articles, some placeholder games, a future normalized game store/private editor, and richer publishing/SEO/media operations.

### What should remain unchanged initially

- Keep the public Next.js frontend, its route shapes, permanent game IDs, city registry, school/team presentation, and GitHub Pages deployment during the prototype.
- Preserve canonical city/school/sport URLs and `/games/{immutable-id}/`. Keep article slugs stable after publication and add redirects if they ever change.
- Preserve the rule that schedules, scores, and reporting are published only when verified.

### What can be reused or connected

- Reuse the semantics in `src/domain/models.ts` and the identity/audit rules in `docs/game-data-model.md`, but do not copy their current narrow TypeScript unions into a long-lived CMS schema.
- Seed Payload reference records from the existing schools, sports, and teams while retaining the current slug and legacy ID values.
- Replace `src/data/editorial-data.ts` as the article source after the prototype publishing path works. Connect sports data separately so editorial rollout does not force an early sports-data migration.

## 2. Recommended CMS architecture

### Recommendation

Create a separate private repository for **North County Press**, built with a supported Payload CMS release and its PostgreSQL adapter. Customize Payload through configuration, collections, fields, hooks, access controls, components, CSS, logos, and email templates; do not fork Payload.

Use the following boundaries:

1. **North County Press** owns editorial workflow, users, articles, media metadata, revisions, and eventually contributors, galleries, sponsors, distribution, and sports editing.
2. **PostgreSQL** is the CMS system of record. Development and production use separate databases, credentials, storage buckets, and callback URLs. Schema changes are committed as reviewed Payload migrations and applied before each compatible application release.
3. **Object storage** holds originals and generated derivatives. PostgreSQL stores metadata and object keys, not image binaries. Use an S3-compatible private bucket for originals, a public/CDN path for approved web derivatives, signed URLs for protected downloads, and lifecycle/versioning rules.
4. **The public frontend** remains a separate deployable. It reads a stable publishing contract rather than sharing database tables or importing CMS internals.
5. **A publishing adapter** converts published Payload documents into the frontend's public content shape. The first adapter should export a versioned JSON snapshot (plus media URLs) into the frontend repository and open a pull request or commit through a tightly scoped GitHub App/token. The existing Pages workflow then builds and deploys it.

This snapshot-and-rebuild approach fits the current static architecture, keeps unpublished CMS data private, makes changes reviewable and reversible, and avoids exposing Payload availability to readers. Prefer a GitHub App or fine-grained token restricted to the frontend repository; never place a broad personal token in CMS content or client code. Serialize publish jobs, record the Payload revision and frontend commit SHA, retry idempotently, and expose failure status to editors.

### Environments, security, and operations

- Local development: local Payload process, local PostgreSQL, and local S3-compatible storage or a clearly isolated development bucket. Use synthetic/sample content where practical.
- Production: managed application hosting, managed PostgreSQL with encryption and point-in-time recovery, and versioned object storage behind a CDN. Start with one production instance if traffic permits, but keep stateless application deployment and external persistence.
- Roles: `admin` (configuration/users), `editor` (approve/schedule/publish), `author` (create/edit own drafts), and `photo` (upload/manage permitted media). Enforce access server-side; hide controls only as a usability aid. Require MFA/SSO if the selected identity path supports it, strong session settings, audit logging, and least-privilege service credentials.
- Backups: automated database backups with point-in-time recovery, object versioning, and periodic export of configuration/secrets inventory. Define retention and perform restore drills; a backup is not proven until restoration is tested.
- Migrations: generate and commit migrations, test them against a restored non-production copy, back up before production changes, and deploy application/schema versions in a compatible order. Avoid ad hoc production schema edits.
- Repository: keep the CMS private. Retain required Payload and dependency notices; confirm the current Payload license and any paid feature/white-label terms before launch. Branding the admin as North County Press should use supported customization, not removal of legally required notices.

## 3. Proposed initial data models

These are recommended prototype shapes, not final schemas.

### `Users` (auth collection)

- name, email, status, role (`admin`, `editor`, `author`, `photo`)
- optional publication scope for future multi-publication use
- created/updated timestamps and last login; Payload auth handles password/session fields
- access rules: only admins manage roles/users; authors cannot publish; editors/admins can publish

### `Media`

- file/object reference, MIME type, dimensions, byte size, checksum
- alt text (required for publishable images), caption, credit, photographer
- rights owner, license/usage terms, rights expiration, source, internal notes
- web derivatives and focal point; download permission (`none`, `editorial`, `licensed`)
- publication status and optional school/team/game relationships

Do not expose original files by default. The public article contract should select a web-sized derivative and include width, height, alt text, caption, and credit.

### `Articles`

- immutable ID; unique slug; type (`article`, `brief`, `game-recap`, `feature`)
- `displayHeadline` for cards/homepage and `articleHeadline` for the article page
- dek/summary, rich-text body, reusable block content, and a tightly permissioned raw-HTML block
- hero media, bylines/contributors, correction/update notes, published/updated timestamps
- relationships to schools, sports, teams, season, and optional game
- SEO title/description, canonical override, social headline/description/image
- workflow fields: draft/version history, review state (`draft`, `in_review`, `approved`), scheduled publish time, publish state
- publication identifier reserved now so additional publications can be added without rewriting ownership rules

Use Payload drafts/versions for revisions and scheduling, plus access hooks that permit only approved documents to publish. Raw HTML must be limited to trusted roles and sanitized or rendered through an allowlist; prefer structured blocks for normal authoring.

### Sports references for phase 1

Create lightweight `Schools` and `Sports` collections, and preferably `Teams`, seeded with current slugs/IDs and names. During the prototype they are relationship targets, not the authoritative schedule editor. Recommended keys:

- `Schools`: immutable ID, name, short name, slug, city/region, branding, active flag, legacy slug
- `Sports`: immutable ID, name, slug, gender/category where relevant, active flag
- `Teams`: immutable ID, school, sport, level, season label, current public team ID

Keep current games/schedules in the frontend for phase 1. Later add normalized `Seasons`, `Venues`, `Opponents`, `Games`, and period scores based on `docs/game-data-model.md`; migrate only after ownership, importing, and conflict rules are approved.

### Future collections (not phase 1)

- Contributors and photographer profiles
- Galleries and gallery images, including sponsor acknowledgments and download policy
- Sponsors, placements, campaigns/fulfillment, and date-bounded publication targeting
- Social post packages with platform status/approval, newsletter issues, and distribution logs
- Reusable editorial blocks/templates, redirects, correction log, and publication/site settings

## 4. Publishing and media workflows

### Initial article workflow

1. Author creates a draft, selects school/sport/team references, supplies both headlines, body, SEO/social fields, and rights-cleared media.
2. Editor previews the draft against a protected preview deployment or a CMS-hosted preview route. Preview must use a short-lived signed token and must not make drafts publicly cacheable.
3. Editor moves the article to approved and publishes immediately or schedules it. A server-side rule rejects publish if required headline, slug, body, byline, alt text/credit, or rights fields are missing.
4. A publish hook enqueues an idempotent export job. The job writes the versioned public snapshot, excluding drafts, private notes, originals, user data, and licensing details that should not be public.
5. The job creates a frontend pull request by default. After confidence grows, routine publishes may commit to a dedicated content branch and dispatch a controlled merge/deploy workflow. GitHub Actions builds the static routes and Pages deploys them.
6. The CMS records queued/building/succeeded/failed, the exported revision, Git commit, and public URL. Unpublishing or correcting an article creates another immutable publish event and rebuild.

The first working path only needs one article: Payload publish -> exported article snapshot -> frontend static route/homepage -> existing GitHub Pages deployment. Keep a manual retry and rollback to a prior snapshot/commit.

### Media workflow

- Upload once to private object storage; record checksum and full rights metadata.
- Generate named derivatives (for example card, article, social) asynchronously and serve them through a CDN. Do not store high-resolution originals in Git or serve them from GitHub Pages.
- Publish only derivative URLs and public metadata. Use signed, expiring URLs for authorized original downloads, with download auditing and optional per-role limits.
- Budget and alert on storage, transformation, egress, and original downloads. Sponsored status is metadata/relationship data and must not silently alter editorial ranking.

## 5. Phased implementation roadmap

### Phase 0 — decisions and contract

- Approve hosting, PostgreSQL, object storage, preview, and GitHub credential choices.
- Define the versioned public article JSON contract, slug/canonical policy, role matrix, required rights fields, and recovery objectives.
- Decide whether publication requires a pull request or can later dispatch an automated content deployment.

### Phase 1 — smallest useful prototype

- Create the private CMS repository and local development setup.
- Configure Payload/PostgreSQL, migrations, environment validation, North County Press branding, `Users`, and the four roles.
- Add `Articles`, `Media`, and seeded school/sport/team references.
- Enable drafts, versions, authenticated preview, editorial approval, and scheduled publishing.
- Implement one article export and one frontend consumer path while preserving current routes and Pages deployment.
- Document seed/reset, migration, backup/restore, publish retry, rollback, and secrets handling.

### Phase 2 — production hardening

- Provision isolated production services, CDN/object storage, observability, email, MFA/SSO where supported, backups, restore drills, and alerts.
- Add job queue reliability, audit events, webhooks/build status, redirects, richer SEO/Open Graph/structured data, corrections, contributor profiles, and reusable content blocks.
- Migrate existing demo articles only after the contract and preview are verified.

### Phase 3 — sports and photography

- Model seasons, venues, opponents, games, period scores, verification, coverage relationships, imports, and audit logs.
- Add galleries, photographer/licensing workflows, protected downloads, and sponsor acknowledgment.
- Migrate sports authority into Payload only if it demonstrably improves editing and import operations; otherwise keep the sports source separate and reference stable IDs.

### Phase 4 — business and distribution

- Add sponsor/placement/campaign fulfillment with start/end controls and editorial-independence safeguards.
- Add approved social packages, newsletters/email integration, feeds, and Google News readiness. Integrations should consume published events/contracts rather than query CMS tables directly.

## 6. Architectural choices and recommended defaults

| Decision | Recommended default | Tradeoff / trigger to revisit |
| --- | --- | --- |
| GitHub Pages vs. server-hosted Next.js | Keep Pages through phases 1–2. | Lowest cost and smallest change. Move the same frontend to server hosting when authenticated preview, near-instant publishing, ISR, runtime APIs, redirects at scale, or personalization are operational needs. The frontend is already Next.js; this is a hosting/rendering decision, not a framework rewrite. |
| Static rebuild vs. API-driven public content | Export snapshots and rebuild statically. | Strong isolation, caching, rollback, and uptime; publish latency increases with build time. Revisit when cadence/build duration misses an agreed publishing SLA. Do not make browsers depend directly on the private CMS API. |
| Sports data location | Leave current sports data in the frontend initially; add CMS reference records. | Avoids coupling the editorial prototype to a larger migration. Later choose one authoritative writer and stable cross-system IDs; never dual-write without reconciliation. |
| CMS/frontend integration | Versioned API/export contract, separate databases and deployments. | Some mapping code, but prevents schema and release coupling. Never share PostgreSQL tables or credentials. |
| High-resolution photography | Private originals, public CDN derivatives, signed audited downloads. | Adds storage/transformation services but controls rights and egress. |
| Local vs. production | Local isolated services first; managed production persistence later. | Local is inexpensive for learning, but is not a production backup/availability strategy. Keep environment parity through migrations and compatible service versions. |
| Private repository, licensing, white-labeling | Private CMS repo; supported admin branding; retain notices and verify license terms. | Privacy protects operations, not secrets—credentials still belong in secret stores. Avoid a Payload fork because it raises upgrade and security costs. |

## 7. Dependencies and risks

### Key dependencies

- A supported Payload/Node/PostgreSQL combination selected from current official documentation at implementation time
- PostgreSQL provider, object storage/CDN, production application host, email provider, and optional queue
- GitHub App or fine-grained credential plus Actions environments/secrets
- Preview host/path capable of securely rendering a draft; GitHub Pages alone cannot provide a private server-side preview
- Monitoring for CMS health, database/storage capacity, publish jobs, build/deploy outcome, and backup success

### Principal risks and mitigations

- **Static publish latency or failed rebuilds:** queue and deduplicate jobs, expose status, retain the last good site, and support retry/rollback.
- **Draft/private data leakage:** export with an explicit allowlist, test the public artifact, use signed preview tokens, and never expose CMS/database credentials to the frontend.
- **Schema drift or destructive migrations:** commit migrations, test restored copies, back up first, and maintain compatible roll-forward/rollback procedures.
- **Media cost and rights exposure:** derivative limits, CDN caching, private originals, signed downloads, rights-expiration checks, and cost alerts.
- **Split sports authority:** document the system of record per entity, preserve immutable IDs, and build reconciliation before any migration.
- **HTML security:** prefer structured rich text; restrict raw HTML and sanitize with a reviewed allowlist.
- **Vendor/hosting assumptions:** keep the contract and object keys portable; do not use provider-specific behavior without documenting an exit path.
- **Multi-publication growth:** include publication ownership/scope early, but do not build multi-tenant complexity until a second publication is real.

## 8. Decisions requiring owner approval

### Unresolved questions

1. **Publishing SLA and review:** Is a pull-request-based publish acceptable (safer and auditable), and how many minutes may elapse between approval and public availability? This determines whether GitHub Pages/static rebuilds remain suitable.
2. **Production service choices and budget:** Which managed host, PostgreSQL provider, object storage/CDN, region, monthly budget, retention period, and recovery objectives are acceptable? Data residency and expected photo volume/download traffic matter.
3. **Sports system of record:** Should Payload eventually own schedules/scores, should a separate sports service own them, or should the current verified static process remain? Who can correct a game, and how are imports reconciled?
4. Who may publish, schedule, correct, unpublish, download originals, and manage sponsors? Is editor approval mandatory for every author?
5. What are the exact canonical-domain plan and legacy redirect requirements, including whether `/schools/...` routes remain public?
6. Are contributors employees, contractors, volunteers, or mixed, and what licensing/consent language must media records enforce?
7. Which preview experience is acceptable before a server-hosted frontend exists: CMS-rendered approximation, a protected preview host, or deploy previews?

## 9. First implementation-session checklist

- [ ] Confirm the three decisions above: publish SLA/review, production service budget, and sports authority.
- [ ] Check current official Payload compatibility/licensing/branding documentation; pin the chosen versions.
- [ ] Create (but do not yet deploy) the private North County Press repository with an environment-variable contract and secret policy.
- [ ] Start local PostgreSQL and object storage using approved tooling; define separate development names/credentials.
- [ ] Configure Payload migrations, North County Press branding, and `Users` roles/access tests.
- [ ] Create `Schools`, `Sports`, `Teams`, `Media`, and `Articles`; seed current stable slugs/IDs.
- [ ] Configure drafts, versions, approval gates, scheduling, required media rights, and signed preview.
- [ ] Define and fixture-test `public-content/v1` for one article, including both headlines and public media metadata.
- [ ] Export that fixture into the frontend through a reviewable branch/PR and verify the existing article URL/homepage mapping.
- [ ] Record publish status and document retry, rollback, migration, backup, and restore steps before production work.

