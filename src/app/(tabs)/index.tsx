import { FlatList, Text, View } from "react-native";
import { router } from "expo-router";
import { usePedidos } from "../../context/pedidos-context";
import { TarjetaPedido } from "../../components/tarjeta-pedido";
import { Boton } from "../../components/boton";
import { estilos as s } from "../../constants/estilos";

export default function Pedidos() {
  const { pedidos } = usePedidos();
  return (
    <FlatList
      style={s.pantalla}
      contentContainerStyle={s.contenido}
      data={pedidos}
      keyExtractor={(pedido) => String(pedido.id)}
      ListHeaderComponent={
        <View style={s.bloque}>
          <Text style={s.etiqueta}>GESTIÓN DE PEDIDOS</Text>
          <Text style={s.titulo}>Pedidos de clientes</Text>
          <Text style={s.secundario}>
            {pedidos.length} pedidos · Fake Store API
          </Text>
          <Boton
            titulo="+ Nuevo pedido"
            onPress={() => router.push("/pedido/nuevo")}
          />
          <Text style={s.secundario}>
            Las altas, ediciones y anulaciones se conservan hasta que cierres o
            recargues la app.
          </Text>
        </View>
      }
      ListEmptyComponent={
        <Text style={s.texto}>No hay pedidos. Creá el primero.</Text>
      }
      ItemSeparatorComponent={() => <View style={s.separador} />}
      renderItem={({ item }) => (
        <TarjetaPedido
          pedido={item}
          onPress={() => router.push(`/pedido/${item.id}`)}
        />
      )}
    />
  );
}
