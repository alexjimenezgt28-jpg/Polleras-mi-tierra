"use client";

import { useState } from "react";

export default function BotonCopiarAviso({ mensaje }: { mensaje: string }) {
  const [estado, setEstado] = useState("Copiar aviso");

  async function copiar() {
    try {
      await navigator.clipboard.writeText(mensaje);
      setEstado("Aviso copiado");
      return;
    } catch {
      const area = document.createElement("textarea");
      area.value = mensaje;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const copiado = document.execCommand("copy");
      document.body.removeChild(area);
      setEstado(copiado ? "Aviso copiado" : "No se pudo copiar");
    }
  }

  return (
    <button
      type="button"
      onClick={copiar}
      className="rounded-full border border-vino/20 bg-white px-3 py-1 text-xs font-bold text-vino transition hover:bg-crema"
    >
      {estado}
    </button>
  );
}
