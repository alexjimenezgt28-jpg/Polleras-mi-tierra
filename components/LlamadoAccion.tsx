import Link from "next/link";

export default function LlamadoAccion() {
  return (
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
  );
}
