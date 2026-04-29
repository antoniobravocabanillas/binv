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
