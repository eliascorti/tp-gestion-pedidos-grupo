import type { Pedido } from "../types/pedido.ts";

// null es una anulación local; nunca hay que resucitarla con un GET posterior.
export type CambiosPedidos = Record<number, Pedido | null>;
export function combinarPedidos(
  remotos: Pedido[],
  cambios: CambiosPedidos,
): Pedido[] {
  const mapa = new Map(remotos.map((pedido) => [pedido.id, pedido]));
  for (const [id, pedido] of Object.entries(cambios)) {
    if (pedido === null) mapa.delete(Number(id));
    else mapa.set(Number(id), pedido);
  }
  return [...mapa.values()];
}
export function idDisponible(idRespuesta: number, idsUsados: number[]): number {
  if (
    Number.isSafeInteger(idRespuesta) &&
    idRespuesta > 0 &&
    !idsUsados.includes(idRespuesta)
  )
    return idRespuesta;
  return Math.max(0, ...idsUsados) + 1;
}
