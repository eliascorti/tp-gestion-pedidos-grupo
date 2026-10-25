import { useCallback } from "react";
import { FlatList, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { usePedidos } from "../../context/pedidos-context";
import { obtenerCliente } from "../../services/clientes";
import { useCarga } from "../../hooks/use-carga";
import { leerId, nombreCliente } from "../../utils/formato";
import { TarjetaPedido } from "../../components/tarjeta-pedido";
import { EstadoPantalla } from "../../components/estado-pantalla";
import { estilos as s } from "../../constants/estilos";

export default function PantallaCliente() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pedidos, resolverPedidosCliente } = usePedidos();
  const cargar = useCallback(async () => {
    const clienteId = leerId(id);
    const [cliente] = await Promise.all([
      obtenerCliente(clienteId),
      resolverPedidosCliente(clienteId),
    ]);
    return cliente;
  }, [id, resolverPedidosCliente]);
  const carga = useCarga(cargar);
  if (carga.cargando || carga.error || !carga.datos)
    return (
      <EstadoPantalla
        cargando={carga.cargando}
        error={carga.error}
        reintentar={carga.reintentar}
      />
    );
  const cliente = carga.datos;
  // La lista compartida ya incluye altas, cambios de cliente y anulaciones locales.
  const pedidosCliente = pedidos.filter(
    (pedido) => pedido.userId === cliente.id,
  );
  return (
    <FlatList
      style={s.pantalla}
      contentContainerStyle={s.contenido}
      data={pedidosCliente}
      keyExtractor={(p) => String(p.id)}
      ListHeaderComponent={
        <View style={s.bloque}>
          <Text style={s.etiqueta}>FICHA DEL CLIENTE</Text>
          <Text style={s.titulo}>{nombreCliente(cliente)}</Text>
          <View style={s.tarjeta}>
            <Text style={s.texto}>Email: {cliente.email}</Text>
            <Text style={s.texto}>Teléfono: {cliente.phone}</Text>
            <Text style={s.texto}>
              Dirección: {cliente.address.street} {cliente.address.number},{" "}
              {cliente.address.city}
            </Text>
          </View>
          <Text style={s.subtitulo}>Sus pedidos</Text>
        </View>
      }
      ItemSeparatorComponent={() => <View style={s.separador} />}
      ListEmptyComponent={
        <Text style={s.texto}>Este cliente no tiene pedidos.</Text>
      }
      renderItem={({ item }) => (
        <TarjetaPedido
          pedido={item}
          onPress={() => router.push(`/pedido/${item.id}`)}
        />
      )}
    />
  );
}
