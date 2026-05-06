# Backend BINV Capital - MVP tecnico

## Decision de arquitectura

La plataforma ya tiene suficiente frontend para validar la experiencia. El siguiente paso correcto es construir backend por capas:

1. API routes de Next.js para producto.
2. Validaciones con Zod.
3. Reglas de negocio desacopladas.
4. Market data provider intercambiable.
5. Prisma/PostgreSQL como persistencia cuando se cierre el modelo final.

## Endpoints creados

- `GET /api/binv/opportunities`
  - Filtros: `country`, `assetType`.
  - Devuelve oportunidades disponibles por pais y activo.

- `GET /api/binv/market-data/quote?symbol=AL30.BA&market=BYMA`
  - Devuelve cotizacion demo/diferida.
  - Esta preparado para reemplazar el proveedor manual por uno autorizado.

- `POST /api/binv/portfolio/valuation`
  - Recibe posiciones cargadas manualmente.
  - Calcula valor de mercado, costo, PnL y rendimiento.

- `POST /api/binv/data-room/access`
  - Evalua acceso a data room segun rol, KYC y perfil.

- `POST /api/binv/financing-requests`
  - Valida una solicitud de financiamiento.
  - Recomienda instrumento inicial por pais y monto.
  - Devuelve pipeline operativo.

## Portafolios manuales + market data

El armado de portafolios debe ser manual al inicio:

- simbolo,
- mercado,
- nombre del activo,
- moneda,
- cantidad,
- costo promedio,
- precio manual opcional,
- fuente de precio.

Luego el seguimiento puede valorizarse con market data externo. La capa `lib/binv/market-data.ts` ya esta preparada para cambiar el proveedor sin modificar los modulos de portfolio.

## Google Finance

Google Finance es util en Google Sheets mediante la funcion `GOOGLEFINANCE`, pero no debe asumirse como API oficial productiva para backend. Google documenta limitaciones de acceso y descarga de datos historicos mediante Sheets API o Apps Script. Para produccion conviene usar un proveedor autorizado o una integracion formal con fuente de mercado/custodio/aliado.

## Proximo paso recomendado

1. Conectar el frontend a estos endpoints.
2. Definir modelos Prisma BINV definitivos.
3. Crear migracion de PostgreSQL.
4. Agregar seed de oportunidades, aliados, usuarios demo y portafolios.
5. Reemplazar provider demo por proveedor de market data elegido.

