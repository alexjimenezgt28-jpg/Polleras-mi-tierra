import Link from "next/link";
import Catalogo from "@/components/Catalogo";
import { obtenerPolleras } from "@/lib/catalogo-db";

export const instant = false;

const pasos = [
  {
    titulo: "Escoge tu fecha",
    texto: "Mira qué polleras están libres el día de tu evento y elige la que vaya contigo.",
  },
  {
    titulo: "Envía tu solicitud",
    texto: "Escribe tu nombre y teléfono. La fecha queda en espera hasta que se confirme el depósito.",
  },
  {
    titulo: "Confirma y luce",
    texto: "Con el depósito confirmado apartamos la pollera y coordinamos prueba, entrega y devolución.",
  },
];

const preguntas = [
  {
    pregunta: "¿La pollera queda apartada al enviar la solicitud?",
    respuesta: "No. La fecha sigue disponible hasta que el equipo confirme que recibió el depósito. Así todos tienen la misma oportunidad.",
  },
  {
    pregunta: "¿Puedo llevar la pollera con prendas y tembleques?",
    respuesta: "Sí. Al solicitar puedes escoger solo la pollera o el conjunto completo. El precio de cada opción aparece en la ficha.",
  },
  {
    pregunta: "¿Cómo se coordina la prueba y la entrega?",
    respuesta: "El equipo anota la fecha de prueba, la entrega y la devolución en el calendario interno y te envía el recordatorio por WhatsApp.",
  },
  {
    pregunta: "¿Qué pasa si ya no puedo usar la fecha?",
    respuesta: "Avisa al equipo para cerrar la solicitud. Al hacerlo, la fecha vuelve a quedar libre para otra persona.",
  },
];

export default async function Home() {
  const { polleras, origen } = await obtenerPolleras();
  const destacada = polleras[0];

  return (
    <div className="min-h-screen bg-crema text-tinta">
      <header className="sticky top-0 z-30 border-b border-vino/10 bg-crema/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-vino to-rosa font-display text-sm font-bold text-white shadow-lg">
              PM
            </span>
            <span className="flex flex-col leading-tight">
              <strong className="font-display text-base text-vino">Polleras Mi Tierra</strong>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-oro">
                Alquiler típico
              </span>
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-sm font-semibold text-vino/80 sm:gap-6">
            <Link href="#catalogo" className="transition hover:text-rosa">
              Catálogo
            </Link>
            <Link href="#como-funciona" className="hidden transition hover:text-rosa sm:inline">
              Cómo funciona
            </Link>
            <Link href="#preguntas" className="hidden transition hover:text-rosa sm:inline">
              Preguntas
            </Link>
            <Link href="/equipo" className="boton-contorno !px-4 !py-2 text-xs">
              Equipo
            </Link>
          </nav>
        </div>
      </header>

      <main>
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
                  <dd className="mt-1 font-display text-2xl text-vino">{polleras.length} polleras</dd>
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

        <section id="como-funciona" className="lienzo border-y border-vino/10 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-rosa">
              Cómo funciona
            </p>
            <h2 className="mt-2 font-display text-4xl text-vino">Tres pasos y listo</h2>
            <div className="linea-adorno mt-4" />
            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {pasos.map((paso, indice) => (
                <article key={paso.titulo} className="tarjeta tarjeta-interactiva p-6">
                  <div className="numero-paso">{indice + 1}</div>
                  <h3 className="mt-5 font-display text-xl text-vino">{paso.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-tinta/70">{paso.texto}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="preguntas" className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-rosa">
            Preguntas frecuentes
          </p>
          <h2 className="mt-2 font-display text-4xl text-vino">Lo que quizás te preguntas</h2>
          <div className="linea-adorno mt-4" />
          <div className="mt-8 space-y-3">
            {preguntas.map((pregunta) => (
              <details key={pregunta.pregunta} className="tarjeta px-5 py-4">
                <summary className="cursor-pointer list-none font-semibold text-vino">
                  {pregunta.pregunta}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-tinta/70">{pregunta.respuesta}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-vino via-rosa to-fresa px-8 py-10 text-white shadow-xl sm:px-12">
            <div className="absolute -right-10 -top-16 size-56 rounded-full border border-white/20" />
            <div className="absolute -bottom-24 right-24 size-64 rounded-full border border-oro/40" />
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-oro">
              Tu fecha, tu pollera
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl leading-tight sm:text-4xl">
              Apartar es fácil. Elige una pollera y da el primer paso.
            </h2>
            <Link
              href="#catalogo"
              className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-bold text-vino transition hover:-translate-y-0.5 hover:bg-crema"
            >
              Ir al catálogo
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-vino/10 bg-white/60">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <p className="font-display text-xl text-vino">Polleras Mi Tierra</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-tinta/65">
              Alquiler de polleras típicas con depósito, prueba y entrega coordinada.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-rosa">Enlaces</p>
            <div className="mt-3 flex flex-col gap-2 text-sm font-medium text-vino/85">
              <Link href="#catalogo" className="hover:text-rosa">
                Catálogo
              </Link>
              <Link href="#como-funciona" className="hover:text-rosa">
                Cómo funciona
              </Link>
              <Link href="#preguntas" className="hover:text-rosa">
                Preguntas frecuentes
              </Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-rosa">Estado del catálogo</p>
            <p className="mt-3 text-sm leading-relaxed text-tinta/65">
              {origen === "real"
                ? "Conectado a la base de datos. Las fotos se muestran cuando se cargan en el catálogo."
                : "Datos de ejemplo. Configura la conexión en .env para ver tus propias polleras."}
            </p>
            <Link href="/equipo" className="mt-3 inline-block text-sm font-semibold text-vino underline decoration-oro underline-offset-4">
              Área del equipo
            </Link>
          </div>
        </div>
        <div className="border-t border-vino/10 py-4 text-center text-xs text-tinta/55">
          Hecho con cariño para cada celebración.
        </div>
      </footer>
    </div>
  );
}
