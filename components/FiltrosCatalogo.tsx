"use client";

import { useMemo, useState, type FormEvent } from "react";
import { ESTILOS, TECNICAS, coloresDe, type ArticuloCatalogo } from "@/lib/catalogo";

export type ModoCatalogo = "alquiler" | "venta";

export type Filtros = {
  color: string;
  tecnica: string;
  talla: string;
  estilo: string;
  categoria: string;
};

export const filtrosVacios: Filtros = {
  color: "",
  tecnica: "",
  talla: "",
  estilo: "",
  categoria: "",
};

export default function FiltrosCatalogo({
  articulos,
  onBuscar,
  modo,
}: {
  articulos: ArticuloCatalogo[];
  onBuscar: (filtros: Filtros) => void;
  modo: ModoCatalogo;
}) {
  const [filtros, setFiltros] = useState<Filtros>(filtrosVacios);

  const colores = useMemo(
    () =>
      Array.from(new Set(articulos.flatMap((articulo) => coloresDe(articulo.color)))).sort((a, b) =>
        a.localeCompare(b, "es"),
      ),
    [articulos],
  );

  const tallas = useMemo(
    () =>
      Array.from(new Set(articulos.map((articulo) => articulo.talla))).sort((a, b) =>
        a.localeCompare(b, "es", { numeric: true }),
      ),
    [articulos],
  );

  const estilos = useMemo(
    () => ESTILOS.filter((opcion) => articulos.some((articulo) => articulo.estilo === opcion)),
    [articulos],
  );

  const tecnicas = useMemo(
    () =>
      modo === "alquiler"
        ? TECNICAS.filter((opcion) => articulos.some((articulo) => articulo.tecnica === opcion))
        : [],
    [articulos, modo],
  );

  const categorias = useMemo(
    () =>
      modo === "venta"
        ? Array.from(
            new Set(
              articulos
                .map((articulo) => articulo.categoria)
                .filter((categoria): categoria is string => Boolean(categoria)),
            ),
          ).sort((a, b) => a.localeCompare(b, "es"))
        : [],
    [articulos, modo],
  );

  function actualizar(clave: keyof Filtros, valor: string) {
    setFiltros((anteriores) => ({ ...anteriores, [clave]: valor }));
  }

  function buscar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    onBuscar(filtros);
  }

  function limpiar() {
    setFiltros(filtrosVacios);
    onBuscar(filtrosVacios);
  }

  return (
    <form onSubmit={buscar} className="tarjeta mb-8 p-5 sm:p-6">
      <p className="text-sm font-semibold leading-relaxed text-vino">
        {modo === "alquiler"
          ? "Busca por color, talla, estilo regional y técnica de confección; si necesitas una pollera de lujo en específico"
          : "Busca prendas en venta por color, talla, estilo regional y categoría. Los accesorios no están incluidos."}
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
        <label className="text-xs font-bold uppercase tracking-wide text-tinta/60">
          Filtrar por Color
          <select
            value={filtros.color}
            onChange={(evento) => actualizar("color", evento.target.value)}
            className="mt-2 w-full rounded-xl border border-vino/20 bg-white px-3 py-3 text-sm font-normal text-tinta outline-none transition focus:border-rosa focus:ring-2 focus:ring-rosa/20"
          >
            <option value="">Seleccionar color</option>
            {colores.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-bold uppercase tracking-wide text-tinta/60">
          Filtrar por talla
          <select
            value={filtros.talla}
            onChange={(evento) => actualizar("talla", evento.target.value)}
            className="mt-2 w-full rounded-xl border border-vino/20 bg-white px-3 py-3 text-sm font-normal text-tinta outline-none transition focus:border-rosa focus:ring-2 focus:ring-rosa/20"
          >
            <option value="">Seleccionar talla</option>
            {tallas.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-bold uppercase tracking-wide text-tinta/60">
          Filtrar por estilo regional
          <select
            value={filtros.estilo}
            onChange={(evento) => actualizar("estilo", evento.target.value)}
            className="mt-2 w-full rounded-xl border border-vino/20 bg-white px-3 py-3 text-sm font-normal text-tinta outline-none transition focus:border-rosa focus:ring-2 focus:ring-rosa/20"
          >
            <option value="">Seleccionar estilo regional</option>
            {estilos.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </label>
        {modo === "alquiler" ? (
          <label className="text-xs font-bold uppercase tracking-wide text-tinta/60">
            Filtrar por técnica de confección
            <select
              value={filtros.tecnica}
              onChange={(evento) => actualizar("tecnica", evento.target.value)}
              className="mt-2 w-full rounded-xl border border-vino/20 bg-white px-3 py-3 text-sm font-normal text-tinta outline-none transition focus:border-rosa focus:ring-2 focus:ring-rosa/20"
            >
              <option value="">Seleccionar técnica de confección</option>
              {tecnicas.map((opcion) => (
                <option key={opcion} value={opcion}>
                  {opcion}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label className="text-xs font-bold uppercase tracking-wide text-tinta/60">
            Filtrar por categoría
            <select
              value={filtros.categoria}
              onChange={(evento) => actualizar("categoria", evento.target.value)}
              className="mt-2 w-full rounded-xl border border-vino/20 bg-white px-3 py-3 text-sm font-normal text-tinta outline-none transition focus:border-rosa focus:ring-2 focus:ring-rosa/20"
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map((opcion) => (
                <option key={opcion} value={opcion}>
                  {opcion}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="submit" className="boton-lleno !px-5 !py-3 !text-xs">
          {modo === "alquiler" ? "Buscar polleras" : "Buscar prendas"}
        </button>
        <button type="button" onClick={limpiar} className="boton-contorno !px-4 !py-3 !text-xs">
          Limpiar
        </button>
      </div>
    </form>
  );
}
