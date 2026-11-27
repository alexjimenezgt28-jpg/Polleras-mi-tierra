export type EstadoReserva = "PENDIENTE" | "CONFIRMADA" | "CANCELADA" | "DEVUELTA";
export type Modalidad = "POLLERA_SOLA" | "POLLERA_CON_PRENDAS";
export type MetodoPago = "YAPPY" | "TRANSFERENCIA";

export type Reserva = {
  id: string;
  polleraId: string;
  polleraNombre: string;
  clienteNombre: string;
  clienteTelefono: string;
  fecha: string;
  modalidad: Modalidad;
  estado: EstadoReserva;
  metodoPago: MetodoPago | null;
  monto: number | null;
  confirmadaEn: string | null;
  fechaPrueba: string | null;
  horaPrueba: string | null;
  fechaEntrega: string | null;
  fechaDevolucion: string | null;
  notas: string | null;
  avisoEnviadoEn: string | null;
};

const globalMemoria = globalThis as typeof globalThis & {
  __reservasEnMemoria?: Reserva[];
};

export const reservasEnMemoria: Reserva[] =
  globalMemoria.__reservasEnMemoria ?? (globalMemoria.__reservasEnMemoria = []);
