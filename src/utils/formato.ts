import type { Cliente } from "../types/cliente.ts";

export const precio = (valor: number) => `$ ${valor.toFixed(2)}`;
export function fecha(iso: string) {
  // La API usa medianoche UTC. No convertir a hora local: en Argentina cambiaría el día.
  const [anio, mes, dia] = iso.slice(0, 10).split("-");
  return `${dia}/${mes}/${anio}`;
}
export const nombreCliente = (cliente?: Cliente) =>
  cliente
    ? `${cliente.name.firstname} ${cliente.name.lastname}`
    : "Cliente no disponible";
export const mensajeError = (error: unknown) =>
  error instanceof Error ? error.message : "Ocurrió un error. Reintentá.";
export function leerId(valor: string | string[] | undefined) {
  const id = Number(Array.isArray(valor) ? valor[0] : valor);
  if (!Number.isSafeInteger(id) || id < 1)
    throw new Error("El identificador no es válido.");
  return id;
}
