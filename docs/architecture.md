# ICC Topografia Web Suite

## 1. Resumen ejecutivo

ICC Topografia Web Suite es una plataforma corporativa y transaccional para ICC Topografia Group S.A.C., empresa de ingenieria, construccion y consultoria especializada en topografia, geodesia, instrumentacion, servicios tecnicos y venta especializada. Su objetivo es combinar autoridad tecnica, captacion de leads, catalogo profesional, tienda online y panel administrativo en una arquitectura escalable preparada para Vercel y PostgreSQL.

La informacion historica de A&B Topografia Peru se incorpora como base de experiencia: 12 años de conocimiento acumulado, seguridad, cuidado ambiental, planos, interiores/exteriores, construccion, consultoria BIM, geodesia, fotogrametria, topografia, capacitacion, venta, alquiler, reparacion y calibracion de equipos.

Benchmark consultado: Grupo TS, con foco en precision milimetrica, archivo de proyectos, soluciones por tecnologia, certificaciones, homologaciones y CTA comerciales de presupuesto.

## 2. Arquitectura tecnica

- Frontend: Next.js App Router, TypeScript, Tailwind CSS y componentes estilo shadcn/ui.
- Backend: Route Handlers de Next.js para formularios, cotizacion, checkout y autenticacion.
- Datos: PostgreSQL con Prisma ORM.
- Auth: NextAuth v5 con Prisma Adapter y provider credentials inicial.
- CMS/Admin: panel propio en `/admin` para productos, pedidos, contenidos, leads y CMS.
- SEO: metadata por pagina, sitemap, robots, URLs limpias y contenido semantico.
- Seguridad: headers basicos, validacion Zod, variables de entorno, separacion de admin.
- Deploy: Vercel + PostgreSQL gestionado.

## 3. Arbol de carpetas

```txt
app/
  (site)/                 Rutas corporativas y comerciales
  (commerce)/             Checkout y cuenta
  admin/                  Panel administrativo
  api/                    Auth, contacto, cotizacion, checkout
  globals.css             Tokens visuales y Tailwind
components/
  ui/                     Componentes base estilo shadcn
  forms/                  Formularios reutilizables
lib/
  content/                Semilla editorial y comercial
  prisma.ts               Cliente Prisma
  seo.ts                  Helper de metadata
  utils.ts                Utilidades compartidas
prisma/
  schema.prisma           Modelo de datos completo
  seed.ts                 Datos realistas del sector
docs/
  architecture.md         Producto, sitemap, flujos y fases
```

## 4. Modelo de datos

El schema cubre usuarios, roles, cuentas NextAuth, productos, categorias, variantes, pedidos, items, direcciones, favoritos, servicios, paginas CMS, banners, testimonios, FAQ, blog posts, leads y mensajes de contacto.

Entidades principales:

- `User`, `Account`, `Session`, `VerificationToken`
- `Category`, `Product`, `ProductVariant`, `Favorite`
- `Order`, `OrderItem`, `Address`
- `Service`, `CmsPage`, `Banner`, `Testimonial`, `Faq`, `BlogPost`
- `Lead`, `ContactMessage`

## 5. Sistema de componentes

- Tokens: azul ICC principal, celeste corporativo, azul profundo institucional, blanco tecnico y fondos claros de alta legibilidad.
- Componentes base: `Button`, `Card`, `Badge`, `Input`, `Textarea`.
- Componentes de negocio: `SiteHeader`, `SiteFooter`, `SectionHeading`, `ProductCard`, `ConversionBand`, `ContactForm`.
- Principios UI: layouts sobrios, cards solo para unidades repetidas, CTA claros, tipografia fuerte, espaciado consistente y jerarquia B2B.

## 6. Sitemap

- `/`
- `/nosotros`
- `/servicios`
- `/servicios/[slug]`
- `/proyectos`
- `/sectores`
- `/tienda`
- `/tienda/[slug]`
- `/blog`
- `/blog/[slug]`
- `/contacto`
- `/cotizacion`
- `/faq`
- `/privacidad`
- `/terminos`
- `/checkout`
- `/cuenta`
- `/admin`
- `/admin/productos`
- `/admin/pedidos`
- `/admin/contenidos`
- `/admin/leads`

## 7. Flujos de usuario

- Lead de servicio: Home -> Servicios -> Servicio individual -> formulario contextual -> `Lead`.
- Compra consultiva: Tienda -> ficha de producto -> cotizar o asesor -> `Lead`.
- Compra directa: Tienda -> ficha con precio -> carrito -> checkout -> `Order`.
- Autoridad SEO: Blog -> post tecnico -> CTA final -> cotizacion.
- Operacion interna: Admin -> leads/productos/pedidos/contenidos -> gestion comercial.

## 8. Plan por fases

1. Base tecnica: Next.js, Tailwind, Prisma, Auth, SEO, contenido semilla.
2. Comercial: home premium, servicios, tienda, fichas, formularios y rutas SEO.
3. E-commerce: carrito persistente, checkout real, pedidos, favoritos y cuenta.
4. Admin: CRUD completo con permisos, upload de fichas, banners, CMS y blog.
5. Integraciones: WhatsApp, GA4, Meta Pixel, email marketing, pasarela de pago.
6. Produccion: hardening, tests, performance, accesibilidad, legal y analitica.

## 9. Instalacion y despliegue

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run dev
```

Para Vercel: configurar `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, `NEXT_PUBLIC_SITE_URL`, conectar PostgreSQL, ejecutar migraciones y desplegar.
