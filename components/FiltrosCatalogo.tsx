"use client";

import { useMemo, useState, type FormEvent } from "react";
import { TECNICAS, coloresDe, type Pollera } from "@/lib/catalogo";

export type Filtros = {
  color: string;
  tecnica: string;
};

export default function FiltrosCatalogo({
  polleras,
  onBuscar,
}: {
  polleras: Pollera[];
  onBuscar: (filtros: Filtros) => void;
}) {
  const [color, setColor] = useState("");
  const [tecnica, setTecnica] = useState("");

  const colores = useMemo(
    () =>
      Array.from(new Set(polleras.flatMap((pollera) => coloresDe(pollera.color)))).sort((a, b) =>
        a.localeCompare(b, "es"),
      ),
    [polleras],
  );

  const tecnicas = useMemo(
    () => TECNICAS.filter((opcion) => polleras.some((pollera) => pollera.tecnica === opcion)),
    [polleras],
  );

  function buscar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    onBuscar({ color, tecnica });
  }

  function limpiar() {
    setColor("");
    setTecnica("");
    onBuscar({ color: "", tecnica: "" });
  }

  return (
    <form onSubmit={buscar} className="tarjeta mb-8 p-5 sm:p-6">
      <p className="text-sm font-semibold leading-relaxed text-vino">
        Busca por filtros de color y técnica de confección, si necesitas una pollera de lujo en
        específico
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-3 sm:items-end">
        <label className="text-xs font-bold uppercase tracking-wide text-tinta/60">
          Filtrar por Color
          <select
            value={color}
            onChange={(evento) => setColor(evento.target.value)}
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
          Filtrar por técnica de confección
          <select
            value={tecnica}
            onChange={(evento) => setTecnica(evento.target.value)}
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
        <div className="flex flex-wrap gap-2">
          <button type="submit" className="boton-lleno !px-5 !py-3 !text-xs">
            Buscar polleras
          </button>
          <button type="button" onClick={limpiar} className="boton-contorno !px-4 !py-3 !text-xs">
            Limpiar
          </button>
        </div>
      </div>
    </form>
  );
}
