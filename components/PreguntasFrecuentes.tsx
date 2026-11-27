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

export default function PreguntasFrecuentes() {
  return (
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
  );
}
