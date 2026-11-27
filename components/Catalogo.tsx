"use client";

import { useState } from "react";
import FiltrosCatalogo, { filtrosVacios, type Filtros } from "@/components/FiltrosCatalogo";
import FormularioReserva from "@/components/FormularioReserva";
import { coloresDe, type Pollera } from "@/lib/catalogo";

const formatoPrecio = new Intl.NumberFormat("es-PA", {
  style: "currency",
  currency: "PAB",
});

export default function Catalogo({
  polleras,
  origen,
}: {
  polleras: Pollera[];
  origen: "real" | "ejemplo";
}) {
  const [fecha, setFecha] = useState("");
  const [filtros, setFiltros] = useState<Filtros>(filtrosVacios);
  const [seleccionada, setSeleccionada] = useState<Pollera | null>(null);
  const [fichaAbierta, setFichaAbierta] = useState<string | null>(null);

  const visibles = polleras.filter((pollera) => {
    const porColor = filtros.color === "" || coloresDe(pollera.color).includes(filtros.color);
    const porTecnica = filtros.tecnica === "" || pollera.tecnica === filtros.tecnica;
    const porTalla = filtros.talla === "" || pollera.talla === filtros.talla;
    const porEstilo = filtros.estilo === "" || pollera.estilo === filtros.estilo;
    return porColor && porTecnica && porTalla && porEstilo;
  });

  return (
    <section aria-labelledby="titulo-catalogo">
      <div className="tarjeta mb-8 flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center">
        <div className="flex flex-1 items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-full border border-oro/50 bg-gradient-to-br from-crema to-amber-100 font-display text-lg text-vino">
            F
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <label htmlFor="fecha-consulta" className="font-display text-xl text-vino">
                ¿Para qué fecha la necesitas?
              </label>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  origen === "real"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-900"
                }`}
              >
                {origen === "real" ? "Datos conectados" : "Datos de ejemplo"}
              </span>
            </div>
            <p className="mt-1 text-sm text-tinta/65">
              Escoge la fecha y te decimos cuáles polleras siguen libres.
            </p>
          </div>
        </div>
        <input
          id="fecha-consulta"
          type="date"
          value={fecha}
          onChange={(evento) => setFecha(evento.target.value)}
          className="w-full rounded-xl border border-vino/20 bg-white px-4 py-3 text-stone-900 shadow-sm outline-none transition focus:border-rosa focus:ring-2 focus:ring-rosa/20 lg:w-64"
        />
      </div>

      <FiltrosCatalogo articulos={polleras} onBuscar={setFiltros} modo="alquiler" />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-vino">
          Número de registros encontrados: <strong>{visibles.length}</strong>
        </p>
        <p className="text-xs text-tinta/55">
          {Object.values(filtros).every((valor) => valor === "")
            ? "Mostrando toda la colección"
            : "Filtros aplicados"}
        </p>
      </div>

      {visibles.length === 0 ? (
        <p className="tarjeta p-6 text-sm text-tinta/70">
          No hay polleras con esos filtros. Prueba con otro color, talla, estilo o técnica.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((pollera) => {
            const ocupada = fecha !== "" && pollera.fechasOcupadas.includes(fecha);
            const estado = fecha === "" ? "Elige una fecha" : ocupada ? "Ocupada" : "Libre";
            const puedeSolicitar = fecha !== "" && !ocupada;

            return (
              <article
                key={pollera.id}
                className="group tarjeta tarjeta-interactiva overflow-hidden"
              >
                <div className="foto-cubierta relative h-56 overflow-hidden bg-gradient-to-br from-rosa via-fresa to-oro">
                  {pollera.imagenUrl === null ? (
                    <div className="grid h-full place-items-center text-center">
                      <span className="font-display text-xl text-white">Foto de la pollera</span>
                    </div>
                  ) : (
                    <div
                      role="img"
                      aria-label={`Foto de ${pollera.nombre}`}
                      className="foto-pollera h-full w-full"
                      style={{
                        backgroundImage: `url("${pollera.imagenUrl.replace(/["\\]/g, "")}")`,
                      }}
                    />
                  )}
                  <span
                    className={`absolute right-3 top-3 z-10 rounded-full px-3 py-1 text-xs font-bold shadow-sm ${
                      fecha === ""
                        ? "bg-white/90 text-vino"
                        : ocupada
                          ? "bg-vino text-white"
                          : "bg-emerald-600 text-white"
                    }`}
                  >
                    {estado}
                  </span>
                  <span className="absolute bottom-3 left-4 z-10 text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
                    Pollera típica
                  </span>
                </div>

                <div className="p-5">
                  <h2 className="font-display text-xl text-vino">{pollera.nombre}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-tinta/70">{pollera.descripcion}</p>

                  <button
                    type="button"
                    onClick={() =>
                      setFichaAbierta(fichaAbierta === pollera.id ? null : pollera.id)
                    }
                    className="mt-3 rounded-full border border-vino/20 px-3 py-1 text-xs font-bold text-vino transition hover:bg-crema"
                  >
                    {fichaAbierta === pollera.id ? "Ocultar ficha" : "Ver ficha"}
                  </button>
                  {fichaAbierta === pollera.id ? (
                    <div className="mt-3 space-y-2 rounded-xl border border-oro/30 bg-crema/70 p-4 text-sm text-tinta/80">
                      <p>
                        <strong className="text-vino">Incluye:</strong> {pollera.descripcion}
                      </p>
                      <p>
                        <strong className="text-vino">Talla y color:</strong> {pollera.talla},{" "}
                        {pollera.color}
                      </p>
                      <p>
                        <strong className="text-vino">Técnica:</strong> {pollera.tecnica}
                      </p>
                      <p>
                        <strong className="text-vino">Estilo regional:</strong> {pollera.estilo}
                      </p>
                      <p>
                        <strong className="text-vino">Precios:</strong> sola{" "}
                        {formatoPrecio.format(pollera.precioSola)}; con prendas y tembleques{" "}
                        {formatoPrecio.format(pollera.precioCombo)}.
                      </p>
                      <p className="text-xs text-tinta/55">
                        Las fotos se muestran aquí cuando se cargan en el catálogo.
                      </p>
                    </div>
                  ) : null}

                  <dl className="mt-4 grid grid-cols-2 gap-3 border-y border-vino/10 py-3 text-sm">
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-tinta/50">Talla</dt>
                      <dd className="font-semibold text-vino">{pollera.talla}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-tinta/50">Color</dt>
                      <dd className="font-semibold text-vino">{pollera.color}</dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-vino">
                      Sola: {formatoPrecio.format(pollera.precioSola)}
                    </span>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                      Con prendas y tembleques: {formatoPrecio.format(pollera.precioCombo)}
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={!puedeSolicitar}
                    onClick={() => setSeleccionada(pollera)}
                    className="boton-lleno mt-5 w-full disabled:cursor-not-allowed disabled:bg-none disabled:bg-stone-200 disabled:text-stone-500 disabled:shadow-none"
                  >
                    {ocupada
                      ? "Ya apartada esta fecha"
                      : fecha === ""
                        ? "Escoge una fecha"
                        : "Solicitar esta fecha"}
                  </button>
                  <p className="mt-3 border-t border-vino/10 pt-3 text-center text-xs text-tinta/55">
                    Se aparta solo con depósito.
                  </p>

                  {seleccionada?.id === pollera.id && (
                    <FormularioReserva
                      pollera={pollera}
                      fecha={fecha}
                      onCerrar={() => setSeleccionada(null)}
                    />
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
