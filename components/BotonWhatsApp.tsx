function numeroWhatsApp(telefono: string): string {
  const digitos = telefono.replace(/\D/g, "");
  if (digitos.length === 8) {
    return `507${digitos}`;
  }
  return digitos;
}

export default function BotonWhatsApp({
  telefono,
  mensaje,
}: {
  telefono: string;
  mensaje: string;
}) {
  const numero = numeroWhatsApp(telefono);
  if (numero === "") {
    return null;
  }

  return (
    <a
      href={`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white transition hover:bg-emerald-800"
    >
      Escribir por WhatsApp
    </a>
  );
}
