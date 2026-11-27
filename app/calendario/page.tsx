import Link from "next/link";
import { cookies } from "next/headers";
import BotonCopiarAviso from "@/components/BotonCopiarAviso";
import BotonWhatsApp from "@/components/BotonWhatsApp";
import { guardarAgendaForm, registrarAvisoForm } from "@/app/actions";
import { accesoValido } from "@/lib/acceso";
import { listarReservas, type Reserva } from "@/lib/reservas";

export const instant = false;

type Evento = {
  reserva: Reserva;
  fecha: string;
  hora: string | null;
  tipo: string;
};

function fechaBonita(fecha: string): string {
  const valor = new Date(`${fecha}T12:00:00`);
  if (Number.isNaN(valor.getTime())) {
    return fecha;
  }
  return new Intl.DateTimeFormat("es-PA", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(valor);
}

function horaCorta(valor: string | null): string {
  if (valor === null || valor === "") {
    return "hora por definir";
  }
  return valor.includes("T") ? valor.slice(11, 16) : valor.slice(0, 5);
}

function mensajePara(reserva: Reserva, tipo: string): string {
  const fecha = reserva.fechaEntrega ?? reserva.fecha;
  const hora = reserva.horaPrueba === null ? "" : ` a las ${reserva.horaPrueba}`;
  return `Hola ${reserva.clienteNombre}, te recordamos tu ${tipo.toLowerCase()} de la pollera ${reserva.polleraNombre} para el ${fecha}${hora}. Si algo cambia, escríbenos.`;
}

function eventosDe(reserva: Reserva): Evento[] {
  const eventos: Evento[] = [];
  if (reserva.fechaPrueba !== null) {
    eventos.push({
      reserva,
      fecha: reserva.fechaPrueba,
      hora: reserva.horaPrueba,
      tipo: "Prueba",
    });
  }
  if (reserva.fechaEntrega !== null) {
    eventos.push({
      reserva,
      fecha: reserva.fechaEntrega,
      hora: null,
      tipo: "Entrega",
    });
  }
  if (reserva.fechaDevolucion !== null) {
    eventos.push({
      reserva,
      fecha: reserva.fechaDevolucion,
      hora: null,
      tipo: "Devolución",
    });
  }
  if (eventos.length === 0) {
    eventos.push({
      reserva,
      fecha: reserva.fecha,
      hora: null,
      tipo: "Reserva",
    });
  }
  return eventos;
}

export default async function CalendarioPage({
  searchParams,
}: {
  searchParams: Promise<{ mensaje?: string; id?: string }>;
}) {
  const almacen = await cookies();
  const autorizado = accesoValido(almacen.get("equipo_acceso")?.value);
  const { mensaje, id } = await searchParams;

  if (!autorizado) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-display text-4xl text-vino">Calendario privado</h1>
        <p className="mt-4 text-stone-600">
          Esta sección es solo para la propietaria y el equipo. Entra desde la página de acceso.
        </p>
        <Link
          href="/equipo"
          className="mt-6 inline-flex rounded-full bg-rose-700 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-800"
        >
          Ir a acceso
        </Link>
      </main>
    );
  }

  const { reservas, origen } = await listarReservas();
  const activas = reservas.filter((reserva) => reserva.estado !== "CANCELADA");
  const seleccionada = activas.find((reserva) => reserva.id === id) ?? activas[0];
  const eventos = activas.flatMap(eventosDe).sort((a, b) => {
    const porFecha = a.fecha.localeCompare(b.fecha);
    return porFecha !== 0 ? porFecha : (a.hora ?? "99:99").localeCompare(b.hora ?? "99:99");
  });

  const agrupados = new Map<string, Evento[]>();
  for (const evento of eventos) {
    const grupo = agrupados.get(evento.fecha) ?? [];
    grupo.push(evento);
    agrupados.set(evento.fecha, grupo);
  }
  const fechas = Array.from(agrupados.keys()).sort();

  return (
    <main className="lienzo mx-auto max-w-6xl px-6 py-12">
      <nav className="flex flex-wrap gap-3 text-sm font-semibold text-vino">
        <Link href="/equipo" className="hover:underline">
          Panel
        </Link>
        <Link href="/hoy" className="hover:underline">
          Hoy
        </Link>
        <span className="text-stone-400">Calendario</span>
        <Link href="/" className="hover:underline">
          Catálogo
        </Link>
      </nav>

      <header className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-vino">Calendario de la propietaria</h1>
          <p className="mt-2 text-stone-600">
            Aquí se ven las pruebas, entregas y devoluciones en un solo lugar.
          </p>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
          {origen === "real" ? "Datos conectados" : "Datos de ejemplo"}
        </span>
      </header>

      {mensaje ? (
        <p role="status" className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {mensaje}
        </p>
      ) : null}

      <section aria-labelledby="agenda-titulo" className="mt-8 tarjeta p-6">
        <h2 id="agenda-titulo" className="text-xl font-semibold text-stone-900">
          Anotar una cita
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          Escoge la reserva y escribe la fecha y hora. Puedes dejar libre lo que todavía no está definido.
        </p>
        {seleccionada ? (
          <form action={guardarAgendaForm} className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-stone-700">
              Reserva
              <select
                name="id"
                defaultValue={seleccionada.id}
                className="mt-1 w-full rounded-xl border border-vino/20 bg-crema/70 px-3 py-2 font-normal text-tinta outline-none focus:border-rosa"
              >
                {activas.map((reserva) => (
                  <option key={reserva.id} value={reserva.id}>
                    {reserva.clienteNombre} · {reserva.polleraNombre} · {reserva.fecha}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold text-stone-700">
              Fecha de prueba
              <input
                type="date"
                name="fechaPrueba"
                defaultValue={seleccionada.fechaPrueba ?? ""}
                className="mt-1 w-full rounded-xl border border-vino/20 bg-crema/70 px-3 py-2 font-normal text-tinta outline-none focus:border-rosa"
              />
            </label>
            <label className="text-sm font-semibold text-stone-700">
              Hora de prueba
              <input
                type="time"
                name="horaPrueba"
                defaultValue={seleccionada.horaPrueba ?? ""}
                className="mt-1 w-full rounded-xl border border-vino/20 bg-crema/70 px-3 py-2 font-normal text-tinta outline-none focus:border-rosa"
              />
            </label>
            <label className="text-sm font-semibold text-stone-700">
              Fecha de entrega
              <input
                type="date"
                name="fechaEntrega"
                defaultValue={seleccionada.fechaEntrega ?? ""}
                className="mt-1 w-full rounded-xl border border-vino/20 bg-crema/70 px-3 py-2 font-normal text-tinta outline-none focus:border-rosa"
              />
            </label>
            <label className="text-sm font-semibold text-stone-700">
              Fecha de devolución
              <input
                type="date"
                name="fechaDevolucion"
                defaultValue={seleccionada.fechaDevolucion ?? ""}
                className="mt-1 w-full rounded-xl border border-vino/20 bg-crema/70 px-3 py-2 font-normal text-tinta outline-none focus:border-rosa"
              />
            </label>
            <label className="text-sm font-semibold text-stone-700 sm:col-span-2">
              Notas
              <textarea
                name="notas"
                rows={2}
                defaultValue={seleccionada.notas ?? ""}
                placeholder="Ejemplo: llevar tembleques, prueba con zapatos"
                className="mt-1 w-full rounded-xl border border-vino/20 bg-crema/70 px-3 py-2 font-normal text-tinta outline-none focus:border-rosa"
              />
            </label>
            <button
              type="submit"
              className="rounded-full bg-rose-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-800 sm:col-span-2 sm:justify-self-start"
            >
              Guardar agenda
            </button>
          </form>
        ) : (
          <p className="mt-4 text-sm text-stone-600">Todavía no hay reservas para agendar.</p>
        )}
      </section>

      <section aria-labelledby="proximas-titulo" className="mt-8">
        <h2 id="proximas-titulo" className="text-xl font-semibold text-stone-900">
          Próximas fechas
        </h2>
        {fechas.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-stone-200 bg-white p-6 text-stone-600">
            No hay fechas anotadas todavía.
          </p>
        ) : (
          <div className="mt-4 space-y-6">
            {fechas.map((fecha) => (
              <div key={fecha} className="tarjeta p-6">
                <h3 className="text-lg font-semibold capitalize text-rose-900">{fechaBonita(fecha)}</h3>
                <ul className="mt-4 space-y-3">
                  {agrupados.get(fecha)?.map((evento, indice) => {
                    const reserva = evento.reserva;
                    const aviso = mensajePara(reserva, evento.tipo);
                    return (
                      <li
                        key={`${reserva.id}-${evento.tipo}-${indice}`}
                        className="rounded-xl border border-vino/10 bg-crema/70 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-stone-900">
                              {evento.tipo} · {horaCorta(evento.hora)}
                            </p>
                            <p className="mt-1 text-sm text-stone-600">
                              {reserva.clienteNombre} · {reserva.polleraNombre} · {reserva.estado}
                            </p>
                            <a
                              href={`tel:${reserva.clienteTelefono}`}
                              className="text-sm font-medium text-vino hover:underline"
                            >
                              {reserva.clienteTelefono}
                            </a>
                          </div>
                          <Link
                            href={`/calendario?id=${reserva.id}`}
                            className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-vino hover:bg-crema"
                          >
                            Editar agenda
                          </Link>
                        </div>
                        {reserva.notas ? (
                          <p className="mt-3 text-sm text-stone-600">Nota: {reserva.notas}</p>
                        ) : null}
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <BotonCopiarAviso mensaje={aviso} />
                          <BotonWhatsApp telefono={reserva.clienteTelefono} mensaje={aviso} />
                          {reserva.avisoEnviadoEn === null ? (
                            <form action={registrarAvisoForm}>
                              <input type="hidden" name="id" value={reserva.id} />
                              <button
                                type="submit"
                                className="rounded-full border border-stone-200 px-3 py-1 text-xs font-semibold text-stone-700 hover:bg-stone-100"
                              >
                                Ya avisé
                              </button>
                            </form>
                          ) : (
                            <span className="text-xs font-medium text-emerald-800">
                              Aviso registrado: {horaCorta(reserva.avisoEnviadoEn)}
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
