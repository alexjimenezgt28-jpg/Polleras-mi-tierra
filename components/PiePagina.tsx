import Link from "next/link";

export default function PiePagina({ origen }: { origen: "real" | "ejemplo" }) {
  return (
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
  );
}
