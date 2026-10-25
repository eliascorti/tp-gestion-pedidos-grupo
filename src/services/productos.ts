import type { Producto } from "../types/producto";
import { solicitar } from "./api";

export const listarProductos = () => solicitar<Producto[]>("/products");
export const listarCategorias = () =>
  solicitar<string[]>("/products/categories");
export const listarProductosCategoria = (categoria: string) =>
  solicitar<Producto[]>(`/products/category/${encodeURIComponent(categoria)}`);
