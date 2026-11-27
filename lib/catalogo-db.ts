import { db } from "@/src/prisma/db";
import { polleras as pollerasEjemplo, type Pollera } from "@/lib/catalogo";
import { reservasEnMemoria } from "@/lib/memoria";

type Origen = "real" | "ejemplo";

export type ResultadoCatalogo = {
  polleras: Pollera[];
  origen: Origen;
};

export function hayConexionConfigurada() {
  const url = process.env["DATABASE_URL"] ?? "";
  return url !== "" && !url.includes("user:password@localhost") && !url.includes("mydb");
}

export function fechaIso(valor: unknown): string {
  if (valor instanceof Date) {
    return valor.toISOString().slice(0, 10);
  }
  return String(valor).slice(0, 10);
}

export function horaIso(valor: unknown): string | null {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }
  return String(valor).slice(0, 5);
}

export function fechaHoraIso(valor: unknown): string | null {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }
  const fecha = valor instanceof Date ? valor : new Date(String(valor));
  return Number.isNaN(fecha.getTime()) ? null : fecha.toISOString();
}

function conBloqueosEnMemoria(polleras: Pollera[]): Pollera[] {
  return polleras.map((pollera) => ({
    ...pollera,
    fechasOcupadas: [
      ...new Set([
        ...pollera.fechasOcupadas,
        ...reservasEnMemoria
          .filter(
            (reserva) =>
              reserva.polleraId === pollera.id && reserva.estado === "CONFIRMADA",
          )
          .map((reserva) => reserva.fecha),
      ]),
    ],
  }));
}

export async function obtenerPolleras(): Promise<ResultadoCatalogo> {
  if (!hayConexionConfigurada()) {
    return { polleras: conBloqueosEnMemoria(pollerasEjemplo), origen: "ejemplo" };
  }

  try {
    const filas = await db.orm.public.Pollera
      .select(
        "id",
        "nombre",
        "talla",
        "color",
        "descripcion",
        "tecnica",
        "estilo",
        "precio",
        "precioCombo",
        "imagenUrl",
      )
      .include("bloqueos", (bloqueo) => bloqueo.select("fecha"))
      .where({ activa: true })
      .orderBy((pollera) => pollera.nombre.asc())
      .all();

    return {
      polleras: filas.map((fila) => ({
        id: fila.id,
        nombre: fila.nombre,
        talla: fila.talla,
        color: fila.color,
        descripcion: fila.descripcion,
        tecnica: fila.tecnica,
        estilo: fila.estilo,
        precioSola: Number(fila.precio),
        precioCombo: Number(fila.precioCombo),
        imagenUrl: fila.imagenUrl ?? null,
        fechasOcupadas: fila.bloqueos.map((bloqueo) => fechaIso(bloqueo.fecha)),
      })),
      origen: "real",
    };
  } catch {
    return { polleras: conBloqueosEnMemoria(pollerasEjemplo), origen: "ejemplo" };
  }
}
