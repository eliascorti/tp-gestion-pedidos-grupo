import type { ItemPedido } from "../types/pedido.ts";
import type { ProductosPorId } from "../types/producto.ts";

export function subtotal(item: ItemPedido, productos: ProductosPorId): number {
  const producto = productos[item.productId];
  if (!producto || !Number.isFinite(producto.price) || producto.price < 0) {
    throw new Error(
      `No se encontró un precio válido para el producto ${item.productId}.`,
    );
  }
  // Trabajar en centavos evita que 0.1 * 3 se muestre como 0.30000000000000004.
  return (Math.round(producto.price * 100) * item.quantity) / 100;
}

export function totalPedido(
  items: ItemPedido[],
  productos: ProductosPorId,
): number {
  return (
    items.reduce(
      (centavos, item) =>
        centavos + Math.round(subtotal(item, productos) * 100),
      0,
    ) / 100
  );
}

export function cantidadUnidades(items: ItemPedido[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function agregarProducto(
  items: ItemPedido[],
  productId: number,
): ItemPedido[] {
  return items.some((item) => item.productId === productId)
    ? items.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      )
    : [...items, { productId, quantity: 1 }];
}

export function validarPedido(userId: number | null, items: ItemPedido[]) {
  const errores: { cliente?: string; productos?: string } = {};
  if (!userId || !Number.isSafeInteger(userId) || userId < 1)
    errores.cliente = "Elegí un cliente.";
  if (!items.length) errores.productos = "Agregá al menos un producto.";
  else if (
    items.some(
      (item) => !Number.isSafeInteger(item.quantity) || item.quantity < 1,
    )
  ) {
    errores.productos =
      "Las cantidades deben ser números enteros mayores o iguales a 1.";
  } else if (
    new Set(items.map((item) => item.productId)).size !== items.length
  ) {
    errores.productos = "No puede haber productos repetidos.";
  }
  return errores;
}
