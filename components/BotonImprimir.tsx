"use client";

export default function BotonImprimir() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="boton-contorno !px-4 !py-2 !text-sm"
    >
      Imprimir hoja del día
    </button>
  );
}
