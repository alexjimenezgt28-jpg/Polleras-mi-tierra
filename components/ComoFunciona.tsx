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

export default function ComoFunciona() {
  return (
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
  );
}
