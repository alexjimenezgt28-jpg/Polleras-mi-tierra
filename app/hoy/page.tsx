import Link from "next/link";
import { cookies } from "next/headers";
import BotonCopiarAviso from "@/components/BotonCopiarAviso";
import BotonImprimir from "@/components/BotonImprimir";
import BotonWhatsApp from "@/components/BotonWhatsApp";
import { registrarAvisoForm } from "@/app/actions";
import { accesoValido } from "@/lib/acceso";
import { hoyPanama, listarReservas, type Reserva } from "@/lib/reservas";

export const instant = false;

function fechaBonita(fecha: string): string {
  const valor = new Date(`${fecha}T12:00:00`);
  if (Number.isNaN(valor.getTime())) {
    return fecha;
  }
  return new Intl.DateTimeFormat("es-PA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(valor);
}

function horaCorta(valor: string | null): string {
  if (valor === null || valor === "") {
    return "sin hora";
  }
  return valor.includes("T") ? valor.slice(11, 16) : valor.slice(0, 5);
}

function TarjetaReserva({
  reserva,
  etiqueta,
}: {
  reserva: Reserva;
  etiqueta: string;
}) {
  const fecha = reserva.fechaEntrega ?? reserva.fecha;
  const hora = reserva.horaPrueba === null ? "" : ` a las ${reserva.horaPrueba}`;
  const aviso = `Hola ${reserva.clienteNombre}, te recordamos tu ${etiqueta.toLowerCase()} de la pollera ${reserva.polleraNombre} para el ${fecha}${hora}. Si algo cambia, escríbenos.`;

  return (
    <li className="rounded-xl border border-vino/10 bg-crema/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-stone-900">
            {reserva.clienteNombre} · {reserva.polleraNombre}
          </p>
          <p className="mt-1 text-sm text-stone-600">
            {etiqueta}: {horaCorta(reserva.horaPrueba)} · {reserva.estado}
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
          className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-vino hover:bg-rose-50"
        >
          Ver agenda
        </Link>
      </div>
      {reserva.notas ? <p className="mt-3 text-sm text-stone-600">Nota: {reserva.notas}</p> : null}
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
}

function Seccion({
  titulo,
  descripcion,
  reservas,
}: {
  titulo: string;
  descripcion: string;
  reservas: Reserva[];
}) {
  return (
    <section className="tarjeta p-6">
      <h2 className="text-xl font-semibold text-stone-900">{titulo}</h2>
      <p className="mt-1 text-sm text-stone-600">{descripcion}</p>
      {reservas.length === 0 ? (
        <p className="mt-4 text-sm text-stone-500">Nada por aquí hoy.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {reservas.map((reserva) => (
            <TarjetaReserva key={reserva.id} reserva={reserva} etiqueta={titulo} />
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function HoyPage() {
  const almacen = await cookies();
  const autorizado = accesoValido(almacen.get("equipo_acceso")?.value);

  if (!autorizado) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-display text-4xl text-vino">Panel de hoy</h1>
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

  const hoy = hoyPanama();
  const { reservas, origen } = await listarReservas();
  const activas = reservas.filter((reserva) => reserva.estado !== "CANCELADA");
  const pruebas = activas.filter((reserva) => reserva.fechaPrueba === hoy);
  const entregas = activas.filter((reserva) => reserva.fechaEntrega === hoy);
  const devoluciones = activas.filter((reserva) => reserva.fechaDevolucion === hoy);
  const pendientes = reservas.filter((reserva) => reserva.estado === "PENDIENTE");
  const sinAgenda = activas.filter(
    (reserva) =>
      reserva.estado === "CONFIRMADA" &&
      reserva.fechaPrueba === null &&
      reserva.fechaEntrega === null,
  );

  return (
    <main className="lienzo mx-auto max-w-6xl px-6 py-12">
      <nav className="flex flex-wrap gap-3 text-sm font-semibold text-vino">
        <Link href="/equipo" className="hover:underline">
          Panel
        </Link>
        <span className="text-stone-400">Hoy</span>
        <Link href="/calendario" className="hover:underline">
          Calendario
        </Link>
        <Link href="/" className="hover:underline">
          Catálogo
        </Link>
      </nav>

      <header className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-vino">Panel de hoy</h1>
          <p className="mt-2 capitalize text-stone-600">{fechaBonita(hoy)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
            {origen === "real" ? "Datos conectados" : "Datos de ejemplo"}
          </span>
          <BotonImprimir />
        </div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Seccion
          titulo="Pruebas de hoy"
          descripcion="Clientes que vienen a probarse la pollera."
          reservas={pruebas}
        />
        <Seccion
          titulo="Entregas de hoy"
          descripcion="Polleras que salen entregadas."
          reservas={entregas}
        />
        <Seccion
          titulo="Devoluciones de hoy"
          descripcion="Polleras que vuelven al taller."
          reservas={devoluciones}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Seccion
          titulo="Solicitudes pendientes"
          descripcion="Depósitos todavía no confirmados. No apartes la fecha hasta confirmar."
          reservas={pendientes}
        />
        <Seccion
          titulo="Sin agenda"
          descripcion="Reservas confirmadas que necesitan fecha u hora."
          reservas={sinAgenda}
        />
      </div>
    </main>
  );
}
