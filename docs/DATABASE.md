# Database — Neon + Drizzle foundation

> Read this first if you are an AI agent or a human touching anything
> database-shaped in this repo. It records WHY the schema looks the way
> it does, not just what it is. Code is in `db/`, migrations in
> `db/migrations/`.

## Status (2026-11-10)

- [x] Dependencies installed: `drizzle-orm 0.45.4`,
      `@neondatabase/serverless 1.2.0`, `drizzle-kit 0.31.11`.
- [x] Schema v1 written (`db/schema/`, 4 tables + 3 enums).
- [x] Initial migration generated and reviewed
      (`db/migrations/0000_graceful_bug.sql`).
- [x] `tsc --noEmit` clean, `vite build` (Worker build) green.
- [x] Probe passes offline (module load, missing-env error path).
- [x] **Live Neon migration applied 2026-11-10.** Tables
      `persons`, `enquiries`, `enquiry_course_interests`, `follow_ups`
      plus `drizzle.__drizzle_migrations` (1 row) exist in `neondb`.
- [x] **Live round-trip passes 8/8** (insert person → enquiry →
      interest + follow-up → relational read-back → cascade cleanup;
      probe data deleted itself).

No form or CTA writes to the database yet. The site is still fully
static: the contact form opens a `mailto:` link and every "Book a Free
Demo" / "Enquire" button jumps to an anchor. Wiring forms to this
schema is the explicit next phase.

## Decisions

### 1. Drizzle ORM + Neon HTTP driver (`drizzle-orm/neon-http`)

- The Worker runs on Cloudflare Workers (see `cloudflare.config.ts`:
  `compatibilityDate 2026-11-03`, `nodejs_compat`). Workers cannot hold
  TCP sockets, so the classic `pg` TCP driver is out. The Neon
  serverless driver speaks HTTPS (one query per request, no persistent
  connections), which is the documented path for Workers/Vercel Edge.
  Source: Drizzle docs, "Neon serverless driver … good option for
  serverless environments like Vercel Functions, Cloudflare Workers"
  (https://orm.drizzle.team/docs/connect-planetscale-postgres).
- Rejected: direct `pg` Pool (no TCP on Workers), Cloudflare D1
  (would strand data outside the Neon account the team already chose),
  Prisma (heavier runtime, no advantage for this schema size).

### 2. Normalized schema, not one flat "leads" table

During planning three simplified shapes were offered (single enquiry
list / demo+messages split / per-course tables). All were declined in
favour of a normalized core: **persons → enquiries →
enquiry_course_interests + follow_ups**. Reasons:

- One human makes many requests over time; storing the person once
  keeps history and stops duplicate follow-ups.
- One enquiry can span several courses; a link table models that
  without nullable `course_2`, `course_3` columns.
- Follow-ups are an append-only log, so the future admin dashboard can
  show a trustworthy timeline and "due" queue.
- Cost: 4 tables instead of 1. Accepted deliberately — this is the
  "don't run towards fast work" choice. Every table has `created_at`,
  and mutable tables have `updated_at`, so the admin UI never needs a
  migration for basic sorting/auditing.

### 3. No module-level database client

`db/client.ts` exports `createDb(connectionString)` + `type Db`.
Callers build the client per request/server-start and pass the Worker
`env` record (or `process.env` locally) through
`resolveConnectionString()`. This follows the Workers best practice of
no module-level mutable request state and no secrets in bundled source.
The neon-http driver is stateless, so per-request creation is cheap.

### 4. Secrets: local `.env`, production Worker secret — never in code

- Local: copy `.env.example` to `.env` (gitignored) with the Neon
  **pooled** (`-pooler`) connection string.
- Production: set `DATABASE_URL` as a Worker secret via the deploy
  tooling (`cf` CLI / dashboard). It must NOT be added to
  `cloudflare.config.ts` or any committed file.
- `drizzle.config.ts` reads `process.env.DATABASE_URL`. Only commands
  that talk to the DB need it (`migrate`, `push`, `pull`, `studio`);
  `generate` and `check` work offline.

### 5. PII and consent are first-class columns

Phone/email are PII used for sales follow-ups. `persons` carries
`marketing_consent`, `consent_at`, `consent_source` so the admin
dashboard can prove when/where consent was captured. The contact page
already states "EduVert uses these details to respond to your
enquiry" (`components/contact/contact-page.tsx`) — consent wording on
future forms must match what is stored here.

## Schema reference

```
persons 1───* enquiries 1───* enquiry_course_interests
                  │
                  └───* follow_ups (append-only)
```

### `persons` — one row per human

| column | notes |
|---|---|
| `id` | uuid PK, `gen_random_uuid()` |
| `full_name` | required |
| `phone`, `email` | nullable, but CHECK requires at least one |
| `marketing_consent` | boolean, default false |
| `consent_at`, `consent_source` | when/where consent was recorded |
| `notes` | admin-editable, person-level |
| `created_at`, `updated_at` | timestamptz, default `now()` |

Unique index `persons_email_unique` on `lower(email)` (NULLs unaffected).
Dedupe policy (application layer, not yet implemented): match on
normalized email first, then digit-normalized phone; never silently
merge two persons with conflicting names — flag for admin review.

### `enquiries` — one row per request

| column | notes |
|---|---|
| `id` | uuid PK |
| `person_id` | FK → persons, `ON DELETE CASCADE` |
| `type` | `enquiry_type` — see mapping below |
| `status` | `enquiry_status`, default `'new'` |
| `subject`, `message` | free text (contact form) |
| `preferred_time` | `"morning" \| "afternoon" \| "evening"`, null = anytime — from the demo dialog's fixed chips (migration `0001`) |
| `origin_page`, `origin_form` | e.g. `"/contact"`, `"contact-form v1"` — answers "which CTA converts" without extra tooling |
| `assigned_to` | TEXT owner label for now → FK to `admin_users` when login exists |
| `closed_at` | set when status becomes enrolled/closed/spam |
| `created_at`, `updated_at` | timestamptz |

Indexes on `person_id`, `status`, `type`, `created_at` (the admin
dashboard's default list/sort/filter paths).

`enquiry_type` values map to today's CTAs: `free_demo` (Book a Free
Demo), `counsellor_callback` (Talk to Our Counsellor/Team),
`course_enquiry` (Enquire About …), `contact_message` (contact form),
`career_support` (placements page). `enquiry_status`:
new → contacted → qualified → enrolled, plus closed and spam.
Enum values are never renamed/deleted in place — add new ones by
migration so history stays readable.

### `enquiry_course_interests` — which courses an enquiry is about

Composite PK `(enquiry_id, course_slug)`, FK cascade to enquiries.
`course_slug` mirrors `components/courses/course-data.ts` slugs
(`seo-course-in-navi-mumbai`, `sem-course`, `smm-course`,
`data-analytics-python`) and is TEXT for now because the catalog lives
in code. `course_label` snapshots the title at enquiry time. When the
catalog moves into the DB, add a `courses` table and migrate
`course_slug` to a real FK — the key shape already fits.

### `follow_ups` — append-only touch log

`(id, enquiry_id FK cascade, channel, note, author, next_action_at,
created_at)`. No `updated_at` on purpose: corrections are new rows.
`author` is TEXT until admin login exists. `next_action_at` powers the
future "due follow-ups" queue. `follow_up_channel`: phone, whatsapp,
email, in_person, other.

### 6. `pg` is a CLI-only devDependency, not a runtime dep

`drizzle-kit migrate` prefers the `pg` (TCP) driver when it is
installed and falls back to `@neondatabase/serverless` otherwise
(verified by reading the drizzle-kit 0.31.11 bundle). `pg 8.23.1` is a
devDependency so local migrates can run over direct TCP, which prints
real errors. The Worker runtime path is unchanged: `db/client.ts`
uses only `neon-http`, which is all Cloudflare Workers allows. Never
import `pg` from application code.

### 7. Known quirk: `drizzle-kit migrate` can die silently — fallback

On 2026-11-10 `pnpm run db:migrate` exited 1 with no error message
under both the neon-serverless and `pg` drivers (spinner, then
`ELIFECYCLE`, nothing else — reproduced by invoking the CLI binary
directly). Diagnosis: in restricted networks the `pg`/TCP path fails
with `ENOTFOUND` on the `-pooler` host (raw TCP DNS blocked; HTTPS
and WebSocket to the same host work fine), and the CLI wrapper
swallows the underlying error instead of printing it. The migration
itself was verified byte-for-byte fine by applying it through
drizzle-orm's own `neon-http/migrator` — the exact function the CLI
calls for this driver, so journal parsing, statement splitting, hash
and `drizzle.__drizzle_migrations` bookkeeping are identical
(confirmed: 1 row, 64-char hash). If `db:migrate` ever exits silently
again, use this equivalent fallback (recreate if `/tmp` was wiped):

```sh
# scripts fallback: node + drizzle-orm's own neon-http migrator
set -a; . ./.env; set +a
NODE_PATH=./node_modules node -e '
const { neon } = require("@neondatabase/serverless");
const { drizzle } = require("drizzle-orm/neon-http");
const { migrate } = require("drizzle-orm/neon-http/migrator");
migrate(drizzle(neon(process.env.DATABASE_URL)), { migrationsFolder: "./db/migrations" })
  .then(() => console.log("MIGRATE_OK"))
  .catch((e) => { console.error("MIGRATE_FAIL:", e.message); process.exit(1); });'
```

Note: `.env` values may be single-quoted (valid shell, valid dotenv);
always `source` the file rather than relying on tooling to parse it.

## Demo dialog write path (added 2026-11-11)

- UI: `components/demo-dialog.tsx` — `DemoDialogProvider` (mounted in
  `app/layout.tsx`) catches clicks on any `/#book-a-free-demo` link site-wide
  and opens a native `<dialog>` (art left, form right; bottom sheet on
  mobile). No-JS still jumps to the hero anchor. Course context travels on
  `data-demo-course-slug` / `data-demo-course-label` /
  `data-demo-intent`, tagged on course-page heroes/asides, the flagship
  hero, the accordion's demo buttons, and `CounsellorActions`
  (optional `courseSlug`/`courseLabel`/`intent` props).
- API: `POST /app/api/demo/route.ts` validates (name ≥ 2, email shape,
  10-digit phone) and calls `createDemoEnquiry()` in
  `db/demo-enquiries.ts`, which finds-or-creates the person (email, then
  phone match) and inserts the enquiry + optional course interest.
  Verified live 6/6 against Neon with self-cleaning probe rows.
- Intent mapping: Book a Free Demo → `free_demo`, Talk buttons →
  `counsellor_callback`, course "Enquire About …" CTAs →
  `course_enquiry`. Preferred-time chips are fixed values so the admin
  dashboard can filter without normalizing free text.
- Deploy note: the route reads `DATABASE_URL` from the server
  environment — fine locally via `.env`, must be exposed as a Worker
  secret/var at deploy time. No rate limiting or spam protection yet.

## Deliberate non-goals (v1)

- No `courses`/`batches` tables yet — catalog still in
  `course-catalog.ts` / `course-data.ts` / `program-content.ts` (which
  currently disagree on flagship fees; reconcile before migrating).
- No `admin_users` / auth — `assigned_to` and `author` are TEXT
  placeholders with documented upgrade paths above.
- No Row-Level Security — single-tenant internal tool; revisit if the
  dashboard ever exposes per-counsellor data scoping.

## Commands

```sh
cp .env.example .env        # then fill in DATABASE_URL (gitignored)
pnpm run db:generate        # schema -> SQL, offline, always review diff
pnpm run db:check           # drift check, offline
pnpm run db:migrate         # apply db/migrations to Neon (needs DATABASE_URL)
pnpm run db:push             # dev-only direct sync (never for prod)
pnpm run db:studio          # visual table browser (needs DATABASE_URL)
```

## Going live (done 2026-11-10 — rerun for future migrations)

1. ~~Create the Neon project + branch~~ — done; pooled string is in
   local `.env` (gitignored, single-quoted value is fine).
2. `set -a; . ./.env; set +a` (or export `DATABASE_URL`) so CLI
   commands see it.
3. `pnpm run db:migrate` — applies pending files in `db/migrations`.
   If it exits 1 silently, use the fallback in decision 7, then
   continue here.
4. Re-run the throwaway probe (in `/tmp/eduvert-db-probe/`; recreate
   from the repo if wiped — entry source is described in the
   verification section): rebundle with esbuild to resolve `@/`, run
   with node:
   ```sh
   NODE_PATH=./node_modules pnpm exec esbuild /tmp/eduvert-db-probe/entry.ts \
     --bundle --platform=node --format=esm \
     --alias:@=$PWD/ --outfile=/tmp/eduvert-db-probe/probe.mjs --log-level=error
   node /tmp/eduvert-db-probe/probe.mjs
   ```
   It inserts a `probe-<timestamp>@example.invalid` person + enquiry +
   interest + follow-up, reads them back through relations, asserts the
   defaults, then deletes the person and asserts cascade cleanup.
5. Set `DATABASE_URL` as a production Worker secret (never commit it) —
   still TODO at deploy time.

## Verification evidence (this session)

- `pnpm exec tsc --noEmit` → exit 0, no output (covers `db/` via
  `**/*.ts` include).
- `drizzle-kit generate` → `4 tables … [✓] Your SQL migration file ➜
  db/migrations/0000_graceful_bug.sql`; SQL reviewed statement by
  statement: 3 enums, 4 tables, 3 cascade FKs, 1 CHECK, 7 indexes.
  Fixed one real bug found by generation: `sql` must import from
  `drizzle-orm`, not `drizzle-orm/pg-core`, in drizzle-orm 0.45.
- Probe offline (no DATABASE_URL):
  `PASS schema + client modules load`,
  `PASS resolveConnectionString throws without env`.
  (Probe bug fixed same session: the missing-env check used to
  `delete process.env.DATABASE_URL` without restoring it, so the live
  section always skipped — now saves/restores around the check.)
- Probe live (2026-11-10, against `neondb`), 8/8 PASS:
  module load, missing-env error, insert person, insert enquiry
  (`status` defaulted to `new`), insert course interest, insert
  follow-up, relational read-back (person + interest + follow-up),
  cascade cleanup. Probe rows deleted themselves.
- `information_schema` confirms
  `enquiries, enquiry_course_interests, follow_ups, persons`;
  `drizzle.__drizzle_migrations` holds 1 row (64-char hash).
- `pnpm run db:check` → "Everything's fine".
- `pnpm run build` → exit 0, all 15 routes emitted, "Build complete."
  (verified before the `pg` devDep was added; `pg` is CLI-only and
  unimported by app code, so the bundle path is unchanged. The
  `? Unknown` route-classification notes are pre-existing vinext
  static-analysis limits, unrelated to this change.)
- Collateral this session: `pnpm install` was re-run once because the
  checked-in `node_modules` had been linked by a different pnpm major
  (store mismatch); lockfile was respected, versions unchanged. The
  relink put the content-addressable store at `.pnpm-store/` (now the
  active store per `pnpm store path`, gitignored); to move it back to
  the global store, run
  `pnpm config set store-dir ~/Library/pnpm/store --global` then
  `CI=true pnpm install`.
