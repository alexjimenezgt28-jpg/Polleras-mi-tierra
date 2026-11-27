"use client";

import { useActionState } from "react";
import { solicitarReserva } from "@/app/actions";
import type { Pollera } from "@/lib/catalogo";
import type { Resultado } from "@/lib/reservas";

const estadoInicial: Resultado = { ok: false, mensaje: "" };

export default function FormularioReserva({
  pollera,
  fecha,
  onCerrar,
}: {
  pollera: Pollera;
  fecha: string;
  onCerrar: () => void;
}) {
  const [estado, action, pendiente] = useActionState(solicitarReserva, estadoInicial);

  return (
    <form
      action={action}
      className="mt-5 space-y-3 rounded-2xl border border-oro/30 bg-crema/70 p-4"
    >
      <p className="font-display text-lg text-vino">Solicitar {pollera.nombre}</p>

      <div>
        <label
          htmlFor={`nombre-${pollera.id}`}
          className="block text-xs font-bold text-vino"
        >
          Tu nombre
        </label>
        <input
          id={`nombre-${pollera.id}`}
          name="clienteNombre"
          required
          className="mt-1 w-full rounded-xl border border-vino/20 bg-white px-3 py-2 text-sm outline-none transition focus:border-rosa focus:ring-2 focus:ring-rosa/20"
        />
      </div>

      <div>
        <label
          htmlFor={`telefono-${pollera.id}`}
          className="block text-xs font-bold text-vino"
        >
          Tu teléfono
        </label>
        <input
          id={`telefono-${pollera.id}`}
          name="clienteTelefono"
          type="tel"
          required
          className="mt-1 w-full rounded-xl border border-vino/20 bg-white px-3 py-2 text-sm outline-none transition focus:border-rosa focus:ring-2 focus:ring-rosa/20"
        />
      </div>

      <div>
        <label
          htmlFor={`fecha-${pollera.id}`}
          className="block text-xs font-bold text-vino"
        >
          Fecha del alquiler
        </label>
        <input
          id={`fecha-${pollera.id}`}
          name="fecha"
          type="date"
          defaultValue={fecha}
          required
          className="mt-1 w-full rounded-xl border border-vino/20 bg-white px-3 py-2 text-sm outline-none transition focus:border-rosa focus:ring-2 focus:ring-rosa/20"
        />
      </div>

      <div>
        <label
          htmlFor={`modalidad-${pollera.id}`}
          className="block text-xs font-bold text-vino"
        >
          ¿Qué necesitas?
        </label>
        <select
          id={`modalidad-${pollera.id}`}
          name="modalidad"
          defaultValue="POLLERA_SOLA"
          className="mt-1 w-full rounded-xl border border-vino/20 bg-white px-3 py-2 text-sm outline-none transition focus:border-rosa focus:ring-2 focus:ring-rosa/20"
        >
          <option value="POLLERA_SOLA">Solo la pollera</option>
          <option value="POLLERA_CON_PRENDAS">Con prendas y tembleques</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={pendiente}
          className="boton-lleno !px-4 !py-2 !text-xs disabled:opacity-60"
        >
          {pendiente ? "Enviando..." : "Enviar solicitud"}
        </button>
        <button
          type="button"
          onClick={onCerrar}
          className="boton-contorno !px-4 !py-2 !text-xs"
        >
          Cancelar
        </button>
      </div>

      {estado.mensaje !== "" && (
        <p
          role="status"
          className={`text-xs font-medium ${estado.ok ? "text-emerald-800" : "text-rosa"}`}
        >
          {estado.mensaje}
        </p>
      )}
    </form>
  );
}
