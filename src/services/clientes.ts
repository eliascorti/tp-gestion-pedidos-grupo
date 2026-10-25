import type { Cliente } from "../types/cliente";
import { solicitar } from "./api";

export const listarClientes = () => solicitar<Cliente[]>("/users");
export const obtenerCliente = (id: number) =>
  solicitar<Cliente>(`/users/${id}`);
