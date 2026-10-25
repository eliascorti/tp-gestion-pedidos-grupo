import { Pressable, Text, View } from "react-native";
import type { Pedido } from "../types/pedido";
import { usePedidos } from "../context/pedidos-context";
import { cantidadUnidades, totalPedido } from "../utils/pedidos";
import { fecha, nombreCliente, precio } from "../utils/formato";
import { estilos as s } from "../constants/estilos";

export function TarjetaPedido({
  pedido,
  onPress,
}: {
  pedido: Pedido;
  onPress: () => void;
}) {
  const { productosPorId, clientesPorId } = usePedidos();
  const total = totalPedido(pedido.products, productosPorId);
  const unidades = cantidadUnidades(pedido.products);
  return (
    <Pressable
      style={s.tarjeta}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Ver pedido ${pedido.id}`}
    >
      <View style={s.fila}>
        <Text style={s.etiqueta}>PEDIDO #{pedido.id}</Text>
        <Text style={s.secundario}>{fecha(pedido.date)}</Text>
      </View>
      <Text style={s.subtitulo}>
        {nombreCliente(clientesPorId[pedido.userId])}
      </Text>
      <View style={s.fila}>
        <Text style={s.secundario}>{unidades} unidades</Text>
        <Text style={s.precio}>{precio(total)}</Text>
      </View>
    </Pressable>
  );
}
