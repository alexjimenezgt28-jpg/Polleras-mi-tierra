import Link from "next/link";

export default function Encabezado() {
  return (
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
  );
}
