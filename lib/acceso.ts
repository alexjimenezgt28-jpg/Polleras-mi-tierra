import { createHash } from "node:crypto";

export function codigoEquipo(): string {
  return (process.env["CODIGO_EQUIPO"] ?? "").trim();
}

export function marcaAcceso(): string {
  const codigo = codigoEquipo();
  return codigo === "" ? "" : createHash("sha256").update(codigo).digest("hex");
}

export function accesoValido(valor: string | undefined): boolean {
  return codigoEquipo() !== "" && valor === marcaAcceso();
}
