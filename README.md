# Polleras Mi Tierra

Solución digital integral para la gestión de inventario y alquiler de indumentaria típica panameña. Centraliza la disponibilidad de polleras, las solicitudes de clientes y la agenda de pruebas, entregas y devoluciones.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4
- PostgreSQL 15+ con Prisma 8 (`@prisma/orm-postgres`)

## Puesta en marcha

```bash
npm install
cp .env.example .env
```

En `.env` define:

- `DATABASE_URL`: cadena de conexión a PostgreSQL 15 o superior.
- `CODIGO_EQUIPO`: clave para entrar a `/equipo`. Sin ella, el área del equipo permanece cerrada.
- `CONTACTO_WHATSAPP`: número opcional para las consultas del módulo de ventas. Déjalo con el valor `507XXXXXXXX` para ocultar los botones de contacto.

Crear las tablas y arrancar:

```bash
npx prisma db init
npm run dev
```

Abre `http://localhost:3000`. Si `DATABASE_URL` está vacía o es el valor de ejemplo, la app funciona en **modo ejemplo**: catálogo y reservas en memoria, que se reinician al detener el servidor.

## Módulos

- **Alquiler** (`/alquiler`): módulo exclusivo de polleras. Fichas, precios (sola / con prendas y tembleques), disponibilidad por fecha y filtros por color, talla, estilo regional y técnica de confección, con contador de registros.
- **Ventas** (`/ventas`): módulo exclusivo de prendas para vestir (camisas, faldas, enaguas, rebozos, vestidos y polleras). No incluye accesorios como tembleques, joyero ni zapatos. Filtros por color, talla, estilo regional y categoría, con consulta opcional por WhatsApp.
- **Solicitudes**: el cliente envía nombre, teléfono y modalidad; la fecha queda pendiente hasta que se confirme el depósito.
- **Área del equipo** (`/equipo`): acceso con clave, búsqueda y filtros, reservas por teléfono, confirmación de depósito, devoluciones y cierre de solicitudes.
- **Panel de hoy** (`/hoy`): pruebas, entregas y devoluciones del día en hora de Panamá, con opción de imprimir.
- **Calendario** (`/calendario`): fechas y horas de prueba, entrega y devolución, notas y mensajes listos para WhatsApp.

## Scripts

| Script | Uso |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run lint` | ESLint |
| `npm run typecheck` | Comprobación de tipos |
| `npm run build` | Build de producción (antes emite el contrato de Prisma) |
| `npm start` | Servidor de producción |
| `npm run contract:emit` | Regenera `contract.json` y `contract.d.ts` tras editar `src/prisma/contract.prisma` |

El contrato de datos vive en `src/prisma/contract.prisma`; los archivos generados deben commitearse junto con él. Si ya tenías una base de datos creada, agrega las columnas `tecnica` y `estilo` a `polleras` antes de usar los filtros correspondientes.

## Datos de ejemplo

Las 18 polleras de ejemplo usan colores y técnicas documentadas por fuentes panameñas. El módulo de ventas parte de 10 prendas de ejemplo ubicadas en `lib/ventas.ts`:

- [Sicultura – Técnicas artesanales de la pollera de labor](https://sicultura.gob.pa/manifestaciones-culturales/tecnicas-artesanales-de-la-pollera-de)
- [Panamá Artesanal – Pollera de lujo o de gala santeña](https://panamaartesanal.com/pollera-de-lujo-o-de-gala-santena/)
- [Panamá América – La pollera panameña, joya de cultura, tradición y lujo](https://www.panamaamerica.com.pa/variedades/la-pollera-panamena-una-joya-de-cultura-tradicion-y-lujo-1146997)
