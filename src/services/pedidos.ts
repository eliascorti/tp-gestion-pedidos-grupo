import type { DatosPedido, Pedido } from "../types/pedido";
import { solicitar, cuerpoJson } from "./api";

export const listarPedidos = () => solicitar<Pedido[]>("/carts");
export const obtenerPedido = (id: number) => solicitar<Pedido>(`/carts/${id}`);
export const listarPedidosCliente = (id: number) =>
  solicitar<Pedido[]>(`/carts/user/${id}`);
export const crearPedido = (datos: DatosPedido) =>
  solicitar<Pedido>("/carts", { method: "POST", ...cuerpoJson(datos) });
export const actualizarPedido = (id: number, datos: DatosPedido) =>
  solicitar<Pedido>(`/carts/${id}`, { method: "PUT", ...cuerpoJson(datos) });
// Un pedido creado en sesión no existe en el servidor: DELETE puede devolver null con HTTP 200.
export const eliminarPedido = (id: number) =>
  solicitar<Pedido | null>(`/carts/${id}`, { method: "DELETE" }, true);
