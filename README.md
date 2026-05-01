# ICC Topografia

Aplicacion web corporativa y comercial para ICC Topografia Group S.A.C.

## Desarrollo

```bash
npm install
npm run dev
```

## Validacion

```bash
npm run typecheck
npm run lint
npm run build
```

## Variables de entorno

Copiar `.env.example` y configurar:

```env
DATABASE_URL=
AUTH_SECRET=
AUTH_URL=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_WHATSAPP_NUMBER=
```

## Vercel

Importar el repositorio, usar el framework Next.js y configurar las variables anteriores. La rama recomendada para produccion es `main`.

## Netlify

Este proyecto usa Next.js App Router con Route Handlers en `/app/api/*`. En Netlify esas rutas se publican como funciones serverless mediante el plugin oficial de Next.js.

Configuracion:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "22"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

Antes del primer deploy productivo, configurar variables en Netlify y sincronizar la base:

```bash
npm run prisma:push
npm run db:seed
```

Para bases productivas con migraciones formales:

```bash
npm run prisma:deploy
```
