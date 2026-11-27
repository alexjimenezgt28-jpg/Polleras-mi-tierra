"use client";

import { useState } from "react";
import BotonWhatsApp from "@/components/BotonWhatsApp";
import FiltrosCatalogo, { filtrosVacios, type Filtros } from "@/components/FiltrosCatalogo";
import { coloresDe } from "@/lib/catalogo";
import type { PrendaVenta } from "@/lib/ventas";

const formatoPrecio = new Intl.NumberFormat("es-PA", {
  style: "currency",
  currency: "PAB",
});

export default function CatalogoVentas({
  prendas,
  telefono,
}: {
  prendas: PrendaVenta[];
  telefono: string;
}) {
  const [filtros, setFiltros] = useState<Filtros>(filtrosVacios);
  const [fichaAbierta, setFichaAbierta] = useState<string | null>(null);

  const visibles = prendas.filter((prenda) => {
    const porColor = filtros.color === "" || coloresDe(prenda.color).includes(filtros.color);
    const porTalla = filtros.talla === "" || prenda.talla === filtros.talla;
    const porEstilo = filtros.estilo === "" || prenda.estilo === filtros.estilo;
    const porCategoria = filtros.categoria === "" || prenda.categoria === filtros.categoria;
    return porColor && porTalla && porEstilo && porCategoria;
  });

  return (
    <section aria-labelledby="titulo-ventas">
      <FiltrosCatalogo articulos={prendas} onBuscar={setFiltros} modo="venta" />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-vino">
          Número de registros encontrados: <strong>{visibles.length}</strong>
        </p>
        <p className="text-xs text-tinta/55">
          {Object.values(filtros).every((valor) => valor === "")
            ? "Mostrando todas las prendas"
            : "Filtros aplicados"}
        </p>
      </div>

      {visibles.length === 0 ? (
        <p className="tarjeta p-6 text-sm text-tinta/70">
          No hay prendas con esos filtros. Prueba con otro color, talla, estilo o categoría.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((prenda) => (
            <article key={prenda.id} className="group tarjeta tarjeta-interactiva overflow-hidden">
              <div className="foto-cubierta relative h-56 overflow-hidden bg-gradient-to-br from-rosa via-fresa to-oro">
                {prenda.imagenUrl === null ? (
                  <div className="grid h-full place-items-center text-center">
                    <span className="font-display text-xl text-white">Foto de la prenda</span>
                  </div>
                ) : (
                  <div
                    role="img"
                    aria-label={`Foto de ${prenda.nombre}`}
                    className="foto-pollera h-full w-full"
                    style={{
                      backgroundImage: `url("${prenda.imagenUrl.replace(/["\\]/g, "")}")`,
                    }}
                  />
                )}
                <span className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-vino">
                  En venta
                </span>
                <span className="absolute bottom-3 left-4 z-10 text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
                  {prenda.categoria}
                </span>
              </div>

              <div className="p-5">
                <h2 className="font-display text-xl text-vino">{prenda.nombre}</h2>
                <p className="mt-2 text-sm leading-relaxed text-tinta/70">{prenda.descripcion}</p>

                <button
                  type="button"
                  onClick={() =>
                    setFichaAbierta(fichaAbierta === prenda.id ? null : prenda.id)
                  }
                  className="mt-3 rounded-full border border-vino/20 px-3 py-1 text-xs font-bold text-vino transition hover:bg-crema"
                >
                  {fichaAbierta === prenda.id ? "Ocultar ficha" : "Ver ficha"}
                </button>
                {fichaAbierta === prenda.id ? (
                  <div className="mt-3 space-y-2 rounded-xl border border-oro/30 bg-crema/70 p-4 text-sm text-tinta/80">
                    <p>
                      <strong className="text-vino">Categoría:</strong> {prenda.categoria}
                    </p>
                    <p>
                      <strong className="text-vino">Talla y color:</strong> {prenda.talla},{" "}
                      {prenda.color}
                    </p>
                    <p>
                      <strong className="text-vino">Estilo regional:</strong> {prenda.estilo}
                    </p>
                  </div>
                ) : null}

                <dl className="mt-4 grid grid-cols-2 gap-3 border-y border-vino/10 py-3 text-sm">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-tinta/50">Talla</dt>
                    <dd className="font-semibold text-vino">{prenda.talla}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-tinta/50">Precio</dt>
                    <dd className="font-semibold text-vino">{formatoPrecio.format(prenda.precio)}</dd>
                  </div>
                </dl>

                <span className="mt-4 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                  Precio de venta
                </span>

                {telefono !== "" ? (
                  <div className="mt-5">
                    <BotonWhatsApp
                      telefono={telefono}
                      mensaje={`Hola, me interesa comprar: ${prenda.nombre} (talla ${prenda.talla}, ${prenda.color}). ¿Está disponible?`}
                    />
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
