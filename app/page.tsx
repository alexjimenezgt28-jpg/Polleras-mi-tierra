import Catalogo from "@/components/Catalogo";
import ComoFunciona from "@/components/ComoFunciona";
import Encabezado from "@/components/Encabezado";
import LlamadoAccion from "@/components/LlamadoAccion";
import PiePagina from "@/components/PiePagina";
import Portada from "@/components/Portada";
import PreguntasFrecuentes from "@/components/PreguntasFrecuentes";
import { obtenerPolleras } from "@/lib/catalogo-db";

export const instant = false;

export default async function Home() {
  const { polleras, origen } = await obtenerPolleras();

  return (
    <div className="min-h-screen bg-crema text-tinta">
      <Encabezado />
      <main>
        <Portada destacada={polleras[0]} total={polleras.length} />

        <section id="catalogo" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-rosa">
                Nuestra colección
              </p>
              <h2 id="titulo-catalogo" className="mt-2 font-display text-4xl text-vino">
                Escoge tu pollera
              </h2>
              <div className="linea-adorno mt-4" />
            </div>
            <p className="max-w-md text-sm leading-relaxed text-tinta/70">
              Consulta la disponibilidad para tu fecha. Si aún no hay depósito, la pollera sigue
              libre para todos.
            </p>
          </div>
          <Catalogo polleras={polleras} origen={origen} />
        </section>

        <ComoFunciona />
        <PreguntasFrecuentes />
        <LlamadoAccion />
      </main>
      <PiePagina origen={origen} />
    </div>
  );
}
