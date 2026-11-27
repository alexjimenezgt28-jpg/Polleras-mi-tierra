import Catalogo from "@/components/Catalogo";
import Encabezado from "@/components/Encabezado";
import PiePagina from "@/components/PiePagina";
import { obtenerPolleras } from "@/lib/catalogo-db";

export const metadata = {
  title: "Alquiler de polleras | Polleras Mi Tierra",
  description: "Polleras típicas en alquiler con disponibilidad por fecha y depósito de confirmación.",
};

export const instant = false;

export default async function AlquilerPage() {
  const { polleras, origen } = await obtenerPolleras();

  return (
    <div className="min-h-screen bg-crema text-tinta">
      <Encabezado />
      <main>
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-rosa">
              Módulo de alquiler
            </p>
            <h1 className="mt-2 font-display text-4xl text-vino">Alquiler de polleras</h1>
            <div className="linea-adorno mt-4" />
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-tinta/70">
              En este módulo solo ofrecemos polleras. Escoge la fecha, revisa cuáles siguen libres y
              envía tu solicitud. La pollera se aparta únicamente cuando se confirma el depósito.
            </p>
          </div>
          <Catalogo polleras={polleras} origen={origen} />
        </section>
      </main>
      <PiePagina origen={origen} />
    </div>
  );
}
