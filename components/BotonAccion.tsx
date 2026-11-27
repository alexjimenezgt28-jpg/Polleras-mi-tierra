"use client";

import type { FormEventHandler } from "react";

export default function BotonAccion({
  action,
  id,
  etiqueta,
  pregunta,
  estilo = "fuerte",
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  etiqueta: string;
  pregunta: string;
  estilo?: "fuerte" | "suave";
}) {
  const confirmar: FormEventHandler<HTMLFormElement> = (evento) => {
    if (!window.confirm(pregunta)) {
      evento.preventDefault();
    }
  };

  return (
    <form action={action} onSubmit={confirmar}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className={`rounded-full border px-3 py-1 text-xs font-semibold ${
          estilo === "fuerte"
            ? "border-vino/20 text-vino hover:bg-crema"
            : "border-stone-200 text-stone-700 hover:bg-stone-100"
        }`}
      >
        {etiqueta}
      </button>
    </form>
  );
}
