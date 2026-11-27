import CatalogoVentas from "@/components/CatalogoVentas";
import Encabezado from "@/components/Encabezado";
import PiePagina from "@/components/PiePagina";
import { NOTA_VENTAS, prendasVenta } from "@/lib/ventas";

export const metadata = {
  title: "Venta de prendas | Polleras Mi Tierra",
  description: "Prendas típicas en venta por color, talla, estilo regional y categoría.",
};

export const instant = false;

export default function VentasPage() {
  const configurado = process.env["CONTACTO_WHATSAPP"] ?? "";
  const telefono = configurado.includes("XXXX") ? "" : configurado;

  return (
    <div className="min-h-screen bg-crema text-tinta">
      <Encabezado />
      <main>
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-rosa">
              Módulo de ventas
            </p>
            <h1 className="mt-2 font-display text-4xl text-vino">Prendas en venta</h1>
            <div className="linea-adorno mt-4" />
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-tinta/70">
              Camisas, faldas, enaguas, rebozos, vestidos y polleras listas para comprar. {NOTA_VENTAS}
            </p>
          </div>
          <CatalogoVentas prendas={prendasVenta} telefono={telefono} />
        </section>
      </main>
      <PiePagina origen="ejemplo" />
    </div>
  );
}
