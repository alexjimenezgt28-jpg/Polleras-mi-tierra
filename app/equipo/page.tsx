import Link from "next/link";
import { cookies } from "next/headers";
import BotonAccion from "@/components/BotonAccion";
import {
  cancelarReservaForm,
  confirmarDepositoForm,
  entrarEquipo,
  marcarDevueltaForm,
  nuevaReservaForm,
  salirEquipo,
} from "@/app/actions";
import { accesoValido, codigoEquipo } from "@/lib/acceso";
import { obtenerPolleras } from "@/lib/catalogo-db";
import { listarReservas, type EstadoReserva, type Reserva } from "@/lib/reservas";

export const instant = false;

const formatoPrecio = new Intl.NumberFormat("es-PA", {
  style: "currency",
  currency: "PAB",
});

function aviso(mensaje: string | string[] | undefined): string {
  const valor = Array.isArray(mensaje) ? mensaje[0] : mensaje;
  if (valor === undefined) {
    return "";
  }
  if (valor === "configura") {
    return "Agrega CODIGO_EQUIPO=tu-clave en el archivo .env para poder entrar.";
  }
  if (valor === "incorrecto") {
    return "Ese código no es correcto.";
  }
  if (valor === "datos") {
    return "Revisa la fecha, el teléfono y el monto del depósito.";
  }
  return valor;
}

function fechaBonita(fecha: string): string {
  return new Date(`${fecha}T00:00:00Z`).toLocaleDateString("es-PA", {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function horaBonita(valor: string | null): string {
  if (valor === null) {
    return "";
  }
  return new Date(valor).toLocaleString("es-PA", {
    timeZone: "America/Panama",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function etiquetaEstado(estado: Reserva["estado"]): string {
  if (estado === "CONFIRMADA") return "Confirmada";
  if (estado === "CANCELADA") return "Cerrada";
  if (estado === "DEVUELTA") return "Devuelta";
  return "Pendiente de depósito";
}

export default async function Equipo({
  searchParams,
}: {
  searchParams: Promise<{
    mensaje?: string | string[];
    q?: string;
    estado?: string;
  }>;
}) {
  const { mensaje, q, estado } = await searchParams;
  const noticia = aviso(mensaje);
  const hayCodigo = codigoEquipo() !== "";
  const almacen = await cookies();
  const autorizado = accesoValido(almacen.get("equipo_acceso")?.value);

  return (
    <div className="lienzo min-h-screen text-tinta">
      <header className="border-b border-vino/10 bg-white/85 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-vino">
            Uso interno
          </p>
          <h1 className="mt-2 font-display text-4xl text-vino">Área del equipo</h1>
          <p className="mt-2 text-stone-600">
            Aquí se ven las solicitudes y se confirma cuando llega el depósito.
          </p>
          <p className="mt-1 text-xs text-stone-500">
            {hayCodigo
              ? "Acceso con clave activo. La sesión caduca a las 8 horas."
              : "Sin clave configurada. El catálogo sigue funcionando en modo ejemplo."}
          </p>
          <nav className="mt-3 flex flex-wrap gap-4 text-sm font-semibold text-vino">
            <Link href="/hoy" className="hover:underline">
              Panel de hoy
            </Link>
            <Link href="/calendario" className="hover:underline">
              Calendario
            </Link>
            <Link href="/" className="hover:underline">
              Volver al catálogo
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {noticia !== "" && (
          <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {noticia}
          </p>
        )}

        {!hayCodigo && (
          <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Falta configurar el acceso</h2>
            <p className="mt-2 text-sm text-stone-600">
              Escribe una línea como <code>CODIGO_EQUIPO=tu-clave</code> en el archivo .env y vuelve a abrir esta página.
            </p>
          </div>
        )}

        {hayCodigo && !autorizado && (
          <form action={entrarEquipo} className="max-w-sm rounded-2xl border border-vino/20 bg-white p-6 shadow-sm">
            <label htmlFor="codigo" className="block text-sm font-semibold text-rose-900">
              Código del equipo
            </label>
            <input
              id="codigo"
              name="codigo"
              type="password"
              required
              className="mt-2 w-full rounded-xl border border-vino/20 bg-crema px-4 py-3 outline-none focus:border-rose-500"
            />
            <button
              type="submit"
              className="mt-4 rounded-full bg-rose-700 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-800"
            >
              Entrar
            </button>
          </form>
        )}

        {hayCodigo && autorizado && (
          <PanelReservas filtro={q ?? ""} estado={estado ?? "TODOS"} />
        )}
      </main>
    </div>
  );
}

async function PanelReservas({ filtro, estado }: { filtro: string; estado: string }) {
  const [{ reservas, origen }, { polleras }] = await Promise.all([
    listarReservas(),
    obtenerPolleras(),
  ]);

  const consulta = filtro.trim().toLocaleLowerCase("es");
  const visibles = reservas.filter((reserva) => {
    const coincideEstado = estado === "TODOS" || reserva.estado === estado;
    const texto =
      `${reserva.clienteNombre} ${reserva.clienteTelefono} ${reserva.polleraNombre} ${reserva.fecha}`.toLocaleLowerCase(
        "es",
      );
    return coincideEstado && (consulta === "" || texto.includes(consulta));
  });

  const opciones: { valor: "TODOS" | EstadoReserva; etiqueta: string }[] = [
    { valor: "TODOS", etiqueta: "Todos" },
    { valor: "PENDIENTE", etiqueta: "Pendientes" },
    { valor: "CONFIRMADA", etiqueta: "Apartadas" },
    { valor: "DEVUELTA", etiqueta: "Devueltas" },
    { valor: "CANCELADA", etiqueta: "Cerradas" },
  ];

  const cobrado = reservas
    .filter((reserva) => reserva.estado === "CONFIRMADA" || reserva.estado === "DEVUELTA")
    .reduce((suma, reserva) => suma + (reserva.monto ?? 0), 0);

  const resumen = [
    { etiqueta: "Pendientes de depósito", valor: `${reservas.filter((reserva) => reserva.estado === "PENDIENTE").length}` },
    { etiqueta: "Polleras apartadas", valor: `${reservas.filter((reserva) => reserva.estado === "CONFIRMADA").length}` },
    { etiqueta: "Devoluciones", valor: `${reservas.filter((reserva) => reserva.estado === "DEVUELTA").length}` },
    { etiqueta: "Depósitos recibidos", valor: formatoPrecio.format(cobrado) },
  ];

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-stone-600">
          {reservas.length === 0
            ? "Todavía no hay solicitudes."
            : `${reservas.length} solicitud${reservas.length === 1 ? "" : "es"} registrada${reservas.length === 1 ? "" : "s"}.`}
        </p>
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              origen === "real" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"
            }`}
          >
            {origen === "real" ? "Datos conectados" : "Datos de ejemplo"}
          </span>
          <form action={salirEquipo}>
            <button type="submit" className="text-sm font-semibold text-vino hover:underline">
              Salir
            </button>
          </form>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {resumen.map((dato) => (
          <div key={dato.etiqueta} className="tarjeta p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">{dato.etiqueta}</p>
            <p className="mt-2 text-xl font-semibold text-rose-900">{dato.valor}</p>
          </div>
        ))}
      </div>

      <details className="mt-6 tarjeta p-5">
        <summary className="cursor-pointer font-semibold text-rose-900">
          Anotar una reserva por teléfono
        </summary>
        <p className="mt-2 text-sm text-stone-600">
          Para cuando la clienta llama o escribe. Si el depósito ya entró, márcalo como confirmado.
        </p>
        <form action={nuevaReservaForm} className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold text-stone-700">
            Nombre de la clienta
            <input name="clienteNombre" required className="mt-1 w-full rounded-xl border border-vino/20 px-3 py-2 font-normal" />
          </label>
          <label className="text-xs font-semibold text-stone-700">
            Teléfono
            <input name="clienteTelefono" type="tel" required className="mt-1 w-full rounded-xl border border-vino/20 px-3 py-2 font-normal" />
          </label>
          <label className="text-xs font-semibold text-stone-700">
            Pollera
            <select name="polleraId" required className="mt-1 w-full rounded-xl border border-vino/20 bg-white px-3 py-2 font-normal">
              {polleras.map((pollera) => (
                <option key={pollera.id} value={pollera.id}>
                  {pollera.nombre}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold text-stone-700">
            Fecha del alquiler
            <input name="fecha" type="date" required className="mt-1 w-full rounded-xl border border-vino/20 px-3 py-2 font-normal" />
          </label>
          <label className="text-xs font-semibold text-stone-700">
            Modalidad
            <select name="modalidad" className="mt-1 w-full rounded-xl border border-vino/20 bg-white px-3 py-2 font-normal">
              <option value="POLLERA_SOLA">Solo pollera</option>
              <option value="POLLERA_CON_PRENDAS">Con prendas y tembleques</option>
            </select>
          </label>
          <label className="text-xs font-semibold text-stone-700">
            Forma de pago
            <select name="metodo" className="mt-1 w-full rounded-xl border border-vino/20 bg-white px-3 py-2 font-normal">
              <option value="YAPPY">Yappy</option>
              <option value="TRANSFERENCIA">Transferencia</option>
            </select>
          </label>
          <label className="text-xs font-semibold text-stone-700">
            Monto del depósito
            <input name="monto" type="number" min="0.01" step="0.01" defaultValue="0" className="mt-1 w-full rounded-xl border border-vino/20 px-3 py-2 font-normal" />
          </label>
          <label className="flex items-center gap-2 self-end text-xs font-semibold text-stone-700">
            <input name="confirmada" type="checkbox" className="size-4 accent-rose-700" />
            Ya recibí el depósito
          </label>
          <button
            type="submit"
            className="rounded-full bg-rose-700 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-800 sm:col-span-2 sm:justify-self-start"
          >
            Guardar reserva
          </button>
        </form>
      </details>

      <form method="get" className="mt-6 flex flex-wrap items-end gap-3 tarjeta p-5">
        <label className="flex-1 text-xs font-semibold text-stone-700">
          Buscar por clienta, teléfono o pollera
          <input
            name="q"
            defaultValue={filtro}
            placeholder="Ejemplo: María, 6..., gala"
            className="mt-1 w-full rounded-xl border border-vino/20 px-3 py-2 font-normal"
          />
        </label>
        <label className="text-xs font-semibold text-stone-700">
          Estado
          <select name="estado" defaultValue={estado} className="mt-1 rounded-xl border border-vino/20 bg-white px-3 py-2 font-normal">
            {opciones.map((opcion) => (
              <option key={opcion.valor} value={opcion.valor}>
                {opcion.etiqueta}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="rounded-full border border-vino/20 px-4 py-2 text-sm font-semibold text-vino hover:bg-crema">
          Filtrar
        </button>
      </form>

      <p className="mt-6 text-sm text-stone-600">
        {visibles.length === 0
          ? "No hay solicitudes con ese filtro."
          : `${visibles.length} de ${reservas.length} solicitudes.`}
      </p>

      <div className="mt-3 space-y-4">
        {visibles.map((reserva) => {
          const pollera = polleras.find((item) => item.id === reserva.polleraId);
          const esperado = pollera
            ? reserva.modalidad === "POLLERA_SOLA"
              ? pollera.precioSola
              : pollera.precioCombo
            : 0;

          return (
            <article key={reserva.id} className="tarjeta p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{reserva.clienteNombre}</h2>
                  <p className="text-sm text-stone-600">{reserva.clienteTelefono}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    reserva.estado === "CONFIRMADA"
                      ? "bg-emerald-100 text-emerald-800"
                      : reserva.estado === "PENDIENTE"
                        ? "bg-amber-100 text-amber-900"
                        : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {etiquetaEstado(reserva.estado)}
                </span>
              </div>

              <p className="mt-3 text-sm text-stone-700">
                {reserva.polleraNombre} · {fechaBonita(reserva.fecha)} ·{" "}
                {reserva.modalidad === "POLLERA_SOLA" ? "Solo pollera" : "Con prendas y tembleques"}
              </p>

              {reserva.estado === "PENDIENTE" ? (
                <form action={confirmarDepositoForm} className="mt-4 flex flex-wrap items-end gap-3 border-t border-stone-100 pt-4">
                  <input type="hidden" name="id" value={reserva.id} />
                  <div>
                    <label htmlFor={`metodo-${reserva.id}`} className="block text-xs font-semibold text-stone-700">
                      Forma de pago
                    </label>
                    <select
                      id={`metodo-${reserva.id}`}
                      name="metodo"
                      defaultValue="YAPPY"
                      className="mt-1 rounded-lg border border-vino/20 bg-white px-3 py-2 text-sm"
                    >
                      <option value="YAPPY">Yappy</option>
                      <option value="TRANSFERENCIA">Transferencia</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`monto-${reserva.id}`} className="block text-xs font-semibold text-stone-700">
                      Monto recibido
                    </label>
                    <input
                      id={`monto-${reserva.id}`}
                      name="monto"
                      type="number"
                      min="0.01"
                      step="0.01"
                      defaultValue={esperado.toFixed(2)}
                      required
                      className="mt-1 w-32 rounded-lg border border-vino/20 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                  >
                    Confirmar depósito
                  </button>
                  <span className="text-xs text-stone-500">Esperado: {formatoPrecio.format(esperado)}</span>
                </form>
              ) : (
                <p className="mt-3 border-t border-stone-100 pt-3 text-sm text-stone-600">
                  {reserva.estado === "CONFIRMADA" ? (
                    <>
                      Apartada con{" "}
                      {reserva.metodoPago === "TRANSFERENCIA" ? "transferencia" : "Yappy"}
                      {reserva.monto === null ? "" : ` · ${formatoPrecio.format(reserva.monto)}`}.
                      {horaBonita(reserva.confirmadaEn) !== "" &&
                        ` Confirmada el ${horaBonita(reserva.confirmadaEn)}.`}
                    </>
                  ) : (
                    "Esta solicitud ya no ocupa la pollera."
                  )}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-stone-100 pt-3">
                <a
                  href={`tel:${reserva.clienteTelefono}`}
                  className="rounded-full border border-stone-200 px-3 py-1 text-xs font-semibold text-stone-700 hover:bg-stone-100"
                >
                  Llamar
                </a>
                {reserva.estado === "CONFIRMADA" ? (
                  <BotonAccion
                    action={marcarDevueltaForm}
                    id={reserva.id}
                    etiqueta="Marcar devuelta"
                    pregunta="¿La pollera ya volvió al taller?"
                    estilo="suave"
                  />
                ) : null}
                {reserva.estado === "PENDIENTE" || reserva.estado === "CONFIRMADA" ? (
                  <BotonAccion
                    action={cancelarReservaForm}
                    id={reserva.id}
                    etiqueta="Cerrar solicitud"
                    pregunta="¿Cerrar esta reserva? La fecha volverá a quedar libre."
                  />
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
