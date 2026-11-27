"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { accesoValido, codigoEquipo, marcaAcceso } from "@/lib/acceso";
import {
  actualizarAgenda,
  cancelarReserva,
  crearReserva,
  crearReservaManual,
  confirmarDeposito,
  marcarAvisoEnviado,
  marcarDevuelta,
  type MetodoPago,
  type Modalidad,
  type Resultado,
} from "@/lib/reservas";

function texto(formData: FormData, nombre: string): string {
  const valor = formData.get(nombre);
  return typeof valor === "string" ? valor.trim() : "";
}

export async function solicitarReserva(
  _estadoAnterior: Resultado,
  formData: FormData,
): Promise<Resultado> {
  const polleraId = texto(formData, "polleraId");
  const clienteNombre = texto(formData, "clienteNombre");
  const clienteTelefono = texto(formData, "clienteTelefono");
  const fecha = texto(formData, "fecha");
  const modalidad: Modalidad =
    texto(formData, "modalidad") === "POLLERA_CON_PRENDAS"
      ? "POLLERA_CON_PRENDAS"
      : "POLLERA_SOLA";

  if (polleraId === "" || clienteNombre === "" || clienteTelefono === "") {
    return { ok: false, mensaje: "Faltan datos. Escribe tu nombre y tu teléfono." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return { ok: false, mensaje: "Escoge una fecha válida." };
  }

  try {
    await crearReserva({ polleraId, clienteNombre, clienteTelefono, fecha, modalidad });
    revalidatePath("/equipo");
    return {
      ok: true,
      mensaje: "Solicitud registrada. La pollera sigue libre hasta que se confirme el depósito.",
    };
  } catch {
    return { ok: false, mensaje: "No se pudo registrar la solicitud. Intenta de nuevo." };
  }
}

export async function entrarEquipo(formData: FormData) {
  const codigo = codigoEquipo();
  if (codigo === "") {
    redirect("/equipo?mensaje=configura");
  }
  if (texto(formData, "codigo") !== codigo) {
    redirect("/equipo?mensaje=incorrecto");
  }

  const almacen = await cookies();
  almacen.set("equipo_acceso", marcaAcceso(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env["NODE_ENV"] === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  redirect("/equipo");
}

export async function salirEquipo() {
  const almacen = await cookies();
  almacen.delete("equipo_acceso");
  redirect("/equipo");
}

export async function confirmarDepositoForm(formData: FormData) {
  const almacen = await cookies();
  if (!accesoValido(almacen.get("equipo_acceso")?.value)) {
    throw new Error("Acceso no permitido.");
  }

  const id = texto(formData, "id");
  const metodo: MetodoPago =
    texto(formData, "metodo") === "TRANSFERENCIA" ? "TRANSFERENCIA" : "YAPPY";
  const monto = Number(texto(formData, "monto"));

  if (id === "" || !Number.isFinite(monto) || monto <= 0) {
    redirect("/equipo?mensaje=datos");
  }

  const resultado = await confirmarDeposito(id, metodo, monto);
  revalidatePath("/equipo");
  revalidatePath("/");
  redirect(`/equipo?mensaje=${encodeURIComponent(resultado.mensaje)}`);
}

export async function guardarAgendaForm(formData: FormData) {
  const almacen = await cookies();
  if (!accesoValido(almacen.get("equipo_acceso")?.value)) {
    throw new Error("Acceso no permitido.");
  }

  const datos = {
    id: texto(formData, "id"),
    fechaPrueba: texto(formData, "fechaPrueba"),
    horaPrueba: texto(formData, "horaPrueba"),
    fechaEntrega: texto(formData, "fechaEntrega"),
    fechaDevolucion: texto(formData, "fechaDevolucion"),
    notas: texto(formData, "notas"),
  };

  if (datos.id === "") {
    redirect("/calendario?mensaje=datos");
  }

  const resultado = await actualizarAgenda(datos);
  revalidatePath("/calendario");
  revalidatePath("/hoy");
  revalidatePath("/equipo");
  redirect(`/calendario?mensaje=${encodeURIComponent(resultado.mensaje)}`);
}

export async function registrarAvisoForm(formData: FormData) {
  const almacen = await cookies();
  if (!accesoValido(almacen.get("equipo_acceso")?.value)) {
    throw new Error("Acceso no permitido.");
  }

  const id = texto(formData, "id");
  if (id === "") {
    redirect("/equipo?mensaje=datos");
  }

  const resultado = await marcarAvisoEnviado(id);
  revalidatePath("/equipo");
  revalidatePath("/hoy");
  revalidatePath("/calendario");
  redirect(`/equipo?mensaje=${encodeURIComponent(resultado.mensaje)}`);
}

function revalidarTodo() {
  revalidatePath("/");
  revalidatePath("/equipo");
  revalidatePath("/hoy");
  revalidatePath("/calendario");
}

async function idsAutorizados(formData: FormData): Promise<string> {
  const almacen = await cookies();
  if (!accesoValido(almacen.get("equipo_acceso")?.value)) {
    throw new Error("Acceso no permitido.");
  }
  const id = texto(formData, "id");
  if (id === "") {
    redirect("/equipo?mensaje=datos");
  }
  return id;
}

export async function cancelarReservaForm(formData: FormData) {
  const id = await idsAutorizados(formData);
  const resultado = await cancelarReserva(id);
  revalidarTodo();
  redirect(`/equipo?mensaje=${encodeURIComponent(resultado.mensaje)}`);
}

export async function marcarDevueltaForm(formData: FormData) {
  const id = await idsAutorizados(formData);
  const resultado = await marcarDevuelta(id);
  revalidarTodo();
  redirect(`/equipo?mensaje=${encodeURIComponent(resultado.mensaje)}`);
}

export async function nuevaReservaForm(formData: FormData) {
  const almacen = await cookies();
  if (!accesoValido(almacen.get("equipo_acceso")?.value)) {
    throw new Error("Acceso no permitido.");
  }

  const modalidad: Modalidad =
    texto(formData, "modalidad") === "POLLERA_CON_PRENDAS"
      ? "POLLERA_CON_PRENDAS"
      : "POLLERA_SOLA";
  const metodo: MetodoPago =
    texto(formData, "metodo") === "TRANSFERENCIA" ? "TRANSFERENCIA" : "YAPPY";

  const datos = {
    polleraId: texto(formData, "polleraId"),
    clienteNombre: texto(formData, "clienteNombre"),
    clienteTelefono: texto(formData, "clienteTelefono"),
    fecha: texto(formData, "fecha"),
    modalidad,
    confirmada: formData.get("confirmada") === "on",
    metodo,
    monto: Number(texto(formData, "monto")),
  };

  if (
    datos.polleraId === "" ||
    datos.clienteNombre === "" ||
    datos.clienteTelefono === "" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(datos.fecha)
  ) {
    redirect("/equipo?mensaje=datos");
  }

  const resultado = await crearReservaManual(datos);
  revalidarTodo();
  redirect(`/equipo?mensaje=${encodeURIComponent(resultado.mensaje)}`);
}
