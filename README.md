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

