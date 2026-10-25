export type ItemPedido = { productId: number; quantity: number };
export type Pedido = {
  id: number;
  userId: number;
  date: string;
  products: ItemPedido[];
  __v?: number;
};
export type DatosPedido = Omit<Pedido, "id" | "__v">;
