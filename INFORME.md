# Informe de actualización del repositorio

**Fecha:** 27 de noviembre de 2026  
**Rama:** `main`

## Resumen

Esta actualización separa claramente dos líneas de negocio, amplía los filtros del catálogo y deja registrada la decisión de no convertir la aplicación en un marketplace de varios anfitriones.

## Cambios implementados

### 1. Filtros de talla y estilo regional

- `components/FiltrosCatalogo.tsx` pasó a ser un componente reutilizable para alquiler y ventas.
- El módulo de alquiler ahora filtra por **color, talla, estilo regional y técnica de confección**.
- El módulo de ventas filtra por **color, talla, estilo regional y categoría**.
- Estilos disponibles: Montuna, Guararé, Chiriquí, Chorrerana, Blanca, Organza, Coquito y Lujo.
- El campo `estilo` se agregó a las 18 polleras de ejemplo, al contrato de Prisma y a la lectura desde base de datos.
- El contador de registros y el estado “Filtros aplicados” reflejan todos los filtros activos.

### 2. Módulo de alquiler

- Nueva ruta `/alquiler`.
- Uso exclusivo de polleras: no muestra prendas sueltas ni accesorios.
- Reutiliza `Catalogo`, con consulta por fecha, ficha, precios de pollera sola y combo, y formulario de solicitud.
- Se mantiene la regla de negocio: **la fecha no se aparta hasta confirmar el depósito**.

### 3. Módulo de ventas

- Nueva ruta `/ventas`.
- Incluye solo prendas para vestir: camisas, faldas, enaguas, rebozos, vestidos y polleras.
- Excluye accesorios: tembleques, joyero y zapatos no aparecen en este módulo.
- Diez prendas de ejemplo en `lib/ventas.ts` con precio, talla, color, estilo y categoría.
- Consulta opcional por WhatsApp mediante `CONTACTO_WHATSAPP`. Si no se configura, el catálogo sigue visible sin botones de contacto.

### 4. Navegación y documentación

- `Encabezado` y `PiePagina` enlazan ambos módulos.
- `README.md` documenta las rutas, la nueva variable de entorno y la columna adicional del contrato.
- `.env.example` incluye `CONTACTO_WHATSAPP=507XXXXXXXX`.

## Decisiones de negocio

| Observación del mercado | Decisión en este repositorio |
| --- | --- |
| Faena Panamá publica filtros por color y técnica, además de un rango de precios. | Ya existían color, técnica y precios; se añadieron talla y estilo regional para cerrar la brecha. |
| Tu Pollera Panameña organiza su oferta por estilos regionales y secciones de niñas/lujo. | Se adoptaron los estilos regionales. La segmentación por niñas/lujo queda como siguiente paso. |
| Las fichas de Faena detallan medidas y exclusiones. | Se deja fuera del alcance de esta actualización para no saturar el módulo. |
| Faena funciona como directorio con varios anfitriones. | No se adopta: el modelo sigue siendo un taller propio con agenda y depósitos internos. |
| Los accesorios existen en el contrato de datos. | Se mantienen fuera de ventas porque el módulo fue pedido solo para prendas vestibles. |

## Verificación

- `npm run contract:emit`: correcto.
- `npm run lint`: correcto.
- `npm run typecheck`: correcto.
- `npm run build`: correcto. Rutas generadas: `/`, `/alquiler`, `/ventas`, `/equipo`, `/hoy` y `/calendario`.

## Pendientes sugeridos

- Segmentación **Damas / Niñas / Lujo** dentro de ambos módulos.
- Medidas, “incluye” y “no incluye” en las fichas.
- Configurable pack de accesorios usando el modelo `Accesorio` ya presente en el contrato.
- Calendario público de fechas ocupadas sin apartar la pollera antes del depósito.
