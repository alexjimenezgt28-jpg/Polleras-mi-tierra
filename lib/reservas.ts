import { randomUUID } from "node:crypto";
import { db } from "@/src/prisma/db";
import {
  fechaHoraIso,
  fechaIso,
  hayConexionConfigurada,
  horaIso,
  obtenerPolleras,
} from "@/lib/catalogo-db";
import {
  reservasEnMemoria,
  type MetodoPago,
  type Modalidad,
  type Reserva,
} from "@/lib/memoria";

export type { EstadoReserva, MetodoPago, Modalidad, Reserva } from "@/lib/memoria";
export type Origen = "real" | "ejemplo";

export type DatosReserva = {
  polleraId: string;
  clienteNombre: string;
  clienteTelefono: string;
  fecha: string;
  modalidad: Modalidad;
};

export type Resultado = {
  ok: boolean;
  mensaje: string;
};

export type DatosAgenda = {
  id: string;
  fechaPrueba: string;
  horaPrueba: string;
  fechaEntrega: string;
  fechaDevolucion: string;
  notas: string;
};

export type DatosReservaManual = DatosReserva & {
  confirmada: boolean;
  metodo: MetodoPago;
  monto: number;
};

const mensajeConfirmada = "Depósito confirmado. La pollera quedó apartada para esa fecha.";

export function hoyPanama(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Panama",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export async function crearReserva(datos: DatosReserva): Promise<Reserva> {
  const { polleras, origen } = await obtenerPolleras();
  const pollera = polleras.find((item) => item.id === datos.polleraId);
  if (!pollera) {
    throw new Error("No encontramos esa pollera.");
  }

  const reserva: Reserva = {
    id: randomUUID(),
    polleraId: pollera.id,
    polleraNombre: pollera.nombre,
    clienteNombre: datos.clienteNombre,
    clienteTelefono: datos.clienteTelefono,
    fecha: datos.fecha,
    modalidad: datos.modalidad,
    estado: "PENDIENTE",
    metodoPago: null,
    monto: null,
    confirmadaEn: null,
    fechaPrueba: null,
    horaPrueba: null,
    fechaEntrega: null,
    fechaDevolucion: null,
    notas: null,
    avisoEnviadoEn: null,
  };

  if (origen === "ejemplo" || !hayConexionConfigurada()) {
    reservasEnMemoria.unshift(reserva);
    return reserva;
  }

  return await db.transaction(async (tx) => {
    let usuario = await tx.orm.public.Usuario.where({ rol: "DUENA", activo: true }).first();
    if (!usuario) {
      usuario = await tx.orm.public.Usuario.where({ activo: true }).first();
    }
    if (!usuario) {
      throw new Error("Todavía no hay una persona de equipo registrada.");
    }

    await tx.orm.public.Reserva.create({
      id: reserva.id,
      clienteNombre: reserva.clienteNombre,
      clienteTelefono: reserva.clienteTelefono,
      fechaReserva: reserva.fecha,
      estado: "PENDIENTE",
      modalidad: reserva.modalidad,
      polleraId: reserva.polleraId,
      usuarioId: usuario.id,
    });

    return reserva;
  });
}

export async function listarReservas(): Promise<{ reservas: Reserva[]; origen: Origen }> {
  if (!hayConexionConfigurada()) {
    return { reservas: reservasEnMemoria, origen: "ejemplo" };
  }

  try {
    const filas = await db.orm.public.Reserva
      .select(
        "id",
        "clienteNombre",
        "clienteTelefono",
        "fechaReserva",
        "estado",
        "modalidad",
        "metodoPago",
        "depositoMonto",
        "depositoConfirmado",
        "avisoEnviadoEn",
        "fechaPrueba",
        "horaPrueba",
        "fechaEntrega",
        "fechaDevolucion",
        "notas",
        "polleraId",
      )
      .include("pollera", (pollera) => pollera.select("nombre"))
      .orderBy((reserva) => reserva.creadoEn.desc())
      .all();

    return {
      reservas: filas.map((fila) => ({
        id: fila.id,
        polleraId: fila.polleraId,
        polleraNombre: fila.pollera?.nombre ?? "Pollera",
        clienteNombre: fila.clienteNombre,
        clienteTelefono: fila.clienteTelefono,
        fecha: fechaIso(fila.fechaReserva),
        modalidad: fila.modalidad,
        estado: fila.estado,
        metodoPago: fila.metodoPago,
        monto: fila.depositoMonto === null ? null : Number(fila.depositoMonto),
        confirmadaEn: fechaHoraIso(fila.depositoConfirmado),
        fechaPrueba: fila.fechaPrueba === null ? null : fechaIso(fila.fechaPrueba),
        horaPrueba: horaIso(fila.horaPrueba),
        fechaEntrega: fila.fechaEntrega === null ? null : fechaIso(fila.fechaEntrega),
        fechaDevolucion: fila.fechaDevolucion === null ? null : fechaIso(fila.fechaDevolucion),
        notas: fila.notas ?? null,
        avisoEnviadoEn: fechaHoraIso(fila.avisoEnviadoEn),
      })),
      origen: "real",
    };
  } catch {
    return { reservas: reservasEnMemoria, origen: "ejemplo" };
  }
}

export async function confirmarDeposito(
  id: string,
  metodo: MetodoPago,
  monto: number,
): Promise<Resultado> {
  if (!Number.isFinite(monto) || monto <= 0) {
    return { ok: false, mensaje: "Revisa el monto del depósito." };
  }

  if (!hayConexionConfigurada()) {
    const indice = reservasEnMemoria.findIndex((reserva) => reserva.id === id);
    if (indice === -1) {
      return { ok: false, mensaje: "No encontramos esa solicitud." };
    }

    const reserva = reservasEnMemoria[indice];
    if (reserva.estado !== "PENDIENTE") {
      return { ok: false, mensaje: "Esa solicitud ya fue revisada." };
    }

    const yaHayOtra = reservasEnMemoria.some(
      (item, posicion) =>
        posicion !== indice &&
        item.polleraId === reserva.polleraId &&
        item.fecha === reserva.fecha &&
        item.estado === "CONFIRMADA",
    );

    reservasEnMemoria[indice] = {
      ...reserva,
      estado: yaHayOtra ? "CANCELADA" : "CONFIRMADA",
      metodoPago: metodo,
      monto,
      confirmadaEn: yaHayOtra ? null : new Date().toISOString(),
    };

    return yaHayOtra
      ? {
          ok: false,
          mensaje: "Otra persona confirmó primero. Esta solicitud se cerró para avisar a la clienta.",
        }
      : { ok: true, mensaje: mensajeConfirmada };
  }

  try {
    return await db.transaction(async (tx) => {
      const reserva = await tx.orm.public.Reserva.where({ id }).forUpdate().first();
      if (!reserva) {
        return { ok: false, mensaje: "No encontramos esa solicitud." };
      }
      if (reserva.estado !== "PENDIENTE") {
        return { ok: false, mensaje: "Esa solicitud ya fue revisada." };
      }

      const fecha = fechaIso(reserva.fechaReserva);
      const bloqueo = await tx.orm.public.BloqueoPollera.where({
        polleraId: reserva.polleraId,
        fecha,
      })
        .forUpdate()
        .first();

      if (bloqueo) {
        await tx.orm.public.Reserva.where({ id }).update({ estado: "CANCELADA" });
        return {
          ok: false,
          mensaje: "Otra persona confirmó primero. Esta solicitud se cerró para avisar a la clienta.",
        };
      }

      await tx.orm.public.Reserva.where({ id }).update({
        estado: "CONFIRMADA",
        metodoPago: metodo,
        depositoMonto: monto.toFixed(2),
        depositoConfirmado: new Date(),
      });
      await tx.orm.public.BloqueoPollera.create({
        id: randomUUID(),
        polleraId: reserva.polleraId,
        reservaId: reserva.id,
        fecha,
      });

      return { ok: true, mensaje: mensajeConfirmada };
    });
  } catch {
    return { ok: false, mensaje: "No se pudo confirmar. Revisa el depósito e intenta de nuevo." };
  }
}

function textoAgenda(valor: string): string | null {
  return valor.trim() === "" ? null : valor.trim();
}

export async function actualizarAgenda(datos: DatosAgenda): Promise<Resultado> {
  const cambios = {
    fechaPrueba: textoAgenda(datos.fechaPrueba),
    horaPrueba: textoAgenda(datos.horaPrueba),
    fechaEntrega: textoAgenda(datos.fechaEntrega),
    fechaDevolucion: textoAgenda(datos.fechaDevolucion),
    notas: textoAgenda(datos.notas),
  };

  const dias = [cambios.fechaPrueba, cambios.fechaEntrega, cambios.fechaDevolucion];
  if (dias.some((fecha) => fecha !== null && !/^\d{4}-\d{2}-\d{2}$/.test(fecha))) {
    return { ok: false, mensaje: "Revisa las fechas de la agenda." };
  }

  if (!hayConexionConfigurada()) {
    const indice = reservasEnMemoria.findIndex((reserva) => reserva.id === datos.id);
    if (indice === -1) {
      return { ok: false, mensaje: "No encontramos esa solicitud." };
    }
    reservasEnMemoria[indice] = { ...reservasEnMemoria[indice], ...cambios };
    return { ok: true, mensaje: "Agenda guardada." };
  }

  try {
    await db.transaction(async (tx) => {
      await tx.orm.public.Reserva.where({ id: datos.id }).update(cambios);
    });
    return { ok: true, mensaje: "Agenda guardada." };
  } catch {
    return { ok: false, mensaje: "No se pudo guardar la agenda. Intenta de nuevo." };
  }
}

export async function marcarAvisoEnviado(id: string): Promise<Resultado> {
  if (!hayConexionConfigurada()) {
    const reserva = reservasEnMemoria.find((item) => item.id === id);
    if (!reserva) {
      return { ok: false, mensaje: "No encontramos esa solicitud." };
    }
    reserva.avisoEnviadoEn = new Date().toISOString();
    return { ok: true, mensaje: "Aviso registrado." };
  }

  try {
    await db.transaction(async (tx) => {
      await tx.orm.public.Reserva.where({ id }).update({ avisoEnviadoEn: new Date() });
    });
    return { ok: true, mensaje: "Aviso registrado." };
  } catch {
    return { ok: false, mensaje: "No se pudo registrar el aviso." };
  }
}

export async function cancelarReserva(id: string): Promise<Resultado> {
  if (!hayConexionConfigurada()) {
    const reserva = reservasEnMemoria.find((item) => item.id === id);
    if (!reserva) {
      return { ok: false, mensaje: "No encontramos esa solicitud." };
    }
    if (reserva.estado === "CANCELADA") {
      return { ok: false, mensaje: "Esa solicitud ya estaba cerrada." };
    }
    reserva.estado = "CANCELADA";
    return { ok: true, mensaje: "Solicitud cerrada. La fecha volvió a quedar libre." };
  }

  try {
    return await db.transaction(async (tx) => {
      const reserva = await tx.orm.public.Reserva.where({ id }).forUpdate().first();
      if (!reserva) {
        return { ok: false, mensaje: "No encontramos esa solicitud." };
      }
      if (reserva.estado === "CANCELADA") {
        return { ok: false, mensaje: "Esa solicitud ya estaba cerrada." };
      }
      await tx.orm.public.BloqueoPollera.where({ reservaId: id }).delete();
      await tx.orm.public.Reserva.where({ id }).update({ estado: "CANCELADA" });
      return { ok: true, mensaje: "Solicitud cerrada. La fecha volvió a quedar libre." };
    });
  } catch {
    return { ok: false, mensaje: "No se pudo cerrar la solicitud. Intenta de nuevo." };
  }
}

export async function marcarDevuelta(id: string): Promise<Resultado> {
  const hoy = hoyPanama();

  if (!hayConexionConfigurada()) {
    const reserva = reservasEnMemoria.find((item) => item.id === id);
    if (!reserva) {
      return { ok: false, mensaje: "No encontramos esa solicitud." };
    }
    if (reserva.estado === "DEVUELTA") {
      return { ok: false, mensaje: "Esa pollera ya estaba marcada como devuelta." };
    }
    reserva.estado = "DEVUELTA";
    reserva.fechaDevolucion = reserva.fechaDevolucion ?? hoy;
    return { ok: true, mensaje: "Devolución registrada." };
  }

  try {
    return await db.transaction(async (tx) => {
      const reserva = await tx.orm.public.Reserva.where({ id }).forUpdate().first();
      if (!reserva) {
        return { ok: false, mensaje: "No encontramos esa solicitud." };
      }
      if (reserva.estado === "DEVUELTA") {
        return { ok: false, mensaje: "Esa pollera ya estaba marcada como devuelta." };
      }
      await tx.orm.public.Reserva.where({ id }).update({
        estado: "DEVUELTA",
        ...(reserva.fechaDevolucion === null ? { fechaDevolucion: hoy } : {}),
      });
      return { ok: true, mensaje: "Devolución registrada." };
    });
  } catch {
    return { ok: false, mensaje: "No se pudo registrar la devolución. Intenta de nuevo." };
  }
}

export async function crearReservaManual(datos: DatosReservaManual): Promise<Resultado> {
  if (datos.confirmada && (!Number.isFinite(datos.monto) || datos.monto <= 0)) {
    return { ok: false, mensaje: "Revisa el monto del depósito." };
  }

  try {
    const reserva = await crearReserva(datos);
    if (!datos.confirmada) {
      return {
        ok: true,
        mensaje: "Reserva anotada. Queda pendiente hasta que confirmes el depósito.",
      };
    }

    const confirmacion = await confirmarDeposito(reserva.id, datos.metodo, datos.monto);
    return confirmacion.ok
      ? { ok: true, mensaje: "Reserva anotada y confirmada. La fecha quedó apartada." }
      : confirmacion;
  } catch {
    return { ok: false, mensaje: "No se pudo anotar la reserva. Intenta de nuevo." };
  }
}
