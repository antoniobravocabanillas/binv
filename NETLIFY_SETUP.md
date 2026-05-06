# Netlify setup - BINV Capital

## Build settings

Netlify should be connected to the GitHub repository and use:

- Build command: `npm run build`
- Publish directory: `.next`
- Node version: `22.13.0`

These settings are also captured in `netlify.toml`.

## Environment variables

Configure these in Netlify > Site configuration > Environment variables:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
AUTH_SECRET=use-a-long-random-secret
AUTH_URL=https://your-netlify-site.netlify.app
NEXT_PUBLIC_SITE_URL=https://your-netlify-site.netlify.app
NEXT_PUBLIC_WHATSAPP_NUMBER=
```

## Database

The Prisma datasource is PostgreSQL. Use Netlify DB/Neon, Supabase, Railway, Render Postgres or another managed PostgreSQL provider.

Recommended deployment flow:

1. Create the PostgreSQL database.
2. Set `DATABASE_URL` in Netlify.
3. Run `npx prisma db push` once against the production database, or create migrations before production hardening.
4. Keep `npm run build` as the Netlify build command so Prisma Client is generated during build.

## Important

Do not commit `.env`. The repository includes `.env.example` only.

