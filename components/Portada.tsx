import Link from "next/link";
import type { Pollera } from "@/lib/catalogo";

export default function Portada({
  destacada,
  total,
}: {
  destacada: Pollera | undefined;
  total: number;
}) {
  return (
    <section className="lienzo relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-oro/40 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-vino">
            <span className="size-2 rounded-full bg-oro" />
            Tradición y elegancia
          </p>
          <h1 className="titulo-grande mt-6 text-vino">
            La pollera que hace tu día <span className="texto-degradado">inolvidable</span>
          </h1>
          <div className="linea-adorno my-6" />
          <p className="max-w-xl text-lg leading-relaxed text-tinta/75">
            Bordados, vuelo y color en cada prenda. Escoge tu fecha, consulta la disponibilidad y
            separa tu pollera con depósito.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#catalogo" className="boton-lleno">
              Ver catálogo
            </Link>
            <Link href="#como-funciona" className="boton-contorno">
              Cómo funciona
            </Link>
          </div>
          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-vino/10 pt-6 text-center sm:text-left">
            <div>
              <dt className="text-xs uppercase tracking-wide text-tinta/50">Colección</dt>
              <dd className="mt-1 font-display text-2xl text-vino">{total} polleras</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-tinta/50">Reserva</dt>
              <dd className="mt-1 font-display text-2xl text-vino">Con depósito</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-tinta/50">Coordinación</dt>
              <dd className="mt-1 font-display text-2xl text-vino">Prueba y entrega</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="tarjeta overflow-hidden rounded-[2rem] p-3">
            <div className="foto-cubierta relative h-[26rem] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-rosa via-fresa to-oro">
              {destacada?.imagenUrl ? (
                <div
                  role="img"
                  aria-label={`Foto de ${destacada.nombre}`}
                  className="foto-pollera h-full w-full"
                  style={{
                    backgroundImage: `url("${destacada.imagenUrl.replace(/["\\]/g, "")}")`,
                  }}
                />
              ) : (
                <div className="grid h-full place-items-center text-center">
                  <span className="font-display text-2xl text-white">Polleras Mi Tierra</span>
                </div>
              )}
            </div>
          </div>
          <div className="flotar tarjeta absolute -bottom-6 -left-4 max-w-[15rem] px-5 py-4">
            <p className="font-display text-lg text-vino">Detalles a mano</p>
            <p className="mt-1 text-xs text-tinta/65">
              Cada bordado pensado para tu celebración.
            </p>
          </div>
          <span className="absolute -right-3 top-8 rounded-full border border-oro/50 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-wider text-vino shadow-sm">
            Gala · Encaje · Fiesta
          </span>
        </div>
      </div>
    </section>
  );
}
