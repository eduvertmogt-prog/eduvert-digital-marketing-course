# EduVert website

The site runs on Cloudflare Workers using vinext. The Worker name and bindings are defined in `cloudflare.config.ts`.

## Scripts

- `pnpm run dev` starts the vinext dev server.
- `pnpm run build` builds the Cloudflare Worker output.
- `pnpm run start` previews the built Worker locally.
- `pnpm run deploy` deploys the Cloudflare Worker.

## Deploy to Cloudflare Workers

Use Node.js 24.22 or later in the Node 24 series and pnpm 10.33.1. Run these commands from the project root.

```sh
pnpm install --frozen-lockfile
pnpm exec cf auth login
pnpm exec cf auth whoami
pnpm run build
pnpm exec cf deploy --dry-run --prebuilt
```

For the demo enquiry form, create a local `.env.deploy` file with one entry. Replace the example with the pooled connection string for the Neon database you intend to use in production. The file is gitignored.

```dotenv
DATABASE_URL='postgresql://USER:PASSWORD@HOST-pooler.neon.tech/DATABASE?sslmode=require'
```

Apply pending migrations to that database, then upload the build and add `DATABASE_URL` as an encrypted Worker secret in the same deploy.

```sh
(unset DATABASE_URL && node --env-file=.env.deploy --run db:migrate) &&
  (unset DATABASE_URL && pnpm exec cf deploy --prebuilt --secrets-file .env.deploy)
```

If the migration fails, see [the database guide](docs/DATABASE.md) before deploying. The latest migration adds the `preferred_time` column used by the demo form.

Open the Worker URL reported by the CLI and verify the homepage, a course page, and a test demo enquiry. For later code-only deployments, run `pnpm run deploy`; the existing Worker secret remains in place.

## Admissions dashboard

Open `/admin` and sign in with a staff username and password. All Admissions APIs require an active session. You can keep an existing Cloudflare Access policy as an additional gate.

Before deploying the login update, apply the migration and, if you have no owner yet, provision the first one. Confirm that `.env` points to the database used by the Worker.

```sh
(unset DATABASE_URL && node --env-file=.env --run db:migrate) &&
  (unset DATABASE_URL && node --env-file=.env scripts/create-admin-owner.mjs)
```

The bootstrap command prints the temporary password once. The owner must replace it on first sign-in, then can create or remove staff logins from **Staff accounts**.

Apply the pending database migrations before deploying the Batches workspace. In **Batches**, create a batch for a course, set its dates and capacity, and open its roster. In the **Enquiries CRM**, open an enquiry to assign an enrolled learner a seat or add a learner to a waitlist. Promote the first learner from the roster after their enquiry is marked enrolled and a seat is free. The enquiry history records each placement change. Batch schedules here are internal to Admissions.

Apply the fee tracking migration before deploying **Fees and payments**. Open an enrolled enquiry, select the course, and save the student's agreed fee including GST. Record each deposit or instalment once received. The ledger is shared by the student's enquiries for that course. Void an incorrect entry with a reason to restore the balance while keeping the original entry in the history.

