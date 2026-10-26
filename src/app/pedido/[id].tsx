import { useCallback, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { usePedidos } from "../../context/pedidos-context";
import { useCarga } from "../../hooks/use-carga";
import {
  fecha,
  leerId,
  mensajeError,
  nombreCliente,
  precio,
} from "../../utils/formato";
import { subtotal, totalPedido } from "../../utils/pedidos";
import { EstadoPantalla } from "../../components/estado-pantalla";
import { Boton } from "../../components/boton";
import { estilos as s } from "../../constants/estilos";

export default function DetallePedido() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    pedidos,
    productosPorId,
    clientesPorId,
    resolverPedido,
    anular,
    avisar,
  } = usePedidos();
  const cargar = useCallback(
    async () => resolverPedido(leerId(id)),
    [id, resolverPedido],
  );
  const carga = useCarga(cargar);
  const [anulando, setAnulando] = useState(false);
  const [error, setError] = useState("");
  if (carga.cargando || carga.error || !carga.datos)
    return (
      <EstadoPantalla
        cargando={carga.cargando}
        error={carga.error}
        reintentar={carga.reintentar}
      />
    );
  // El estado compartido manda después de editar, incluso si esta pantalla sigue en el stack.
  const pedido = pedidos.find((p) => p.id === carga.datos?.id);
  if (!pedido)
    return (
      <View style={s.centrado}>
        <Text style={s.texto}>Este pedido ya no está disponible.</Text>
        <Boton titulo="Volver a pedidos" onPress={() => router.replace("/")} />
      </View>
    );
  const total = totalPedido(pedido.products, productosPorId);

  async function confirmarAnulacion() {
    if (!pedido || anulando) return;
    setAnulando(true);
    setError("");
    try {
      await anular(pedido.id);
      avisar("Pedido anulado. Se quitó de los listados durante esta sesión.");
      if (router.canGoBack()) router.back();
      else router.replace("/");
    } catch (fallo) {
      setError(mensajeError(fallo));
    } finally {
      setAnulando(false);
    }
  }
  function pedirConfirmacion() {
    // Alert.alert es la confirmación nativa requerida. En web se usa el diálogo del navegador.
    if (Platform.OS === "web") {
      if (
        window.confirm("¿Anular este pedido? Se quitará durante esta sesión.")
      )
        void confirmarAnulacion();
    } else
      Alert.alert(
        "Anular pedido",
        "¿Querés anular este pedido durante esta sesión?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Anular",
            style: "destructive",
            onPress: () => void confirmarAnulacion(),
          },
        ],
      );
  }
  return (
    <ScrollView style={s.pantalla} contentContainerStyle={s.contenido}>
      <Text style={s.etiqueta}>DETALLE</Text>
      <Text style={s.titulo}>Pedido #{pedido.id}</Text>
      <View style={s.tarjeta}>
        <Text style={s.secundario}>CLIENTE</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push(`/cliente/${pedido.userId}`)}
        >
          <Text style={s.textoEnlace}>
            {nombreCliente(clientesPorId[pedido.userId])}
          </Text>
        </Pressable>
        <Text style={s.texto}>{fecha(pedido.date)}</Text>
      </View>
      <Text style={s.subtitulo}>Productos del pedido</Text>
      {pedido.products.map((item) => {
        const producto = productosPorId[item.productId];
        const importe = subtotal(item, productosPorId);
        return (
          <View key={item.productId} style={s.tarjeta}>
            <Text style={s.texto}>{producto.title}</Text>
            <View style={s.fila}>
              <Text style={s.secundario}>
                {item.quantity} unidades · {precio(producto.price)} c/u
              </Text>
              <Text style={s.precio}>{precio(importe)}</Text>
            </View>
          </View>
        );
      })}
      <View style={s.tarjeta}>
        <Text style={s.secundario}>TOTAL</Text>
        <Text style={s.total}>{precio(total)}</Text>
      </View>
      {error ? (
        <Text style={s.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
      <Boton
        titulo="Editar pedido"
        disabled={anulando}
        onPress={() => router.push(`/pedido/editar/${pedido.id}`)}
      />
      <Boton
        titulo={
          anulando ? "Anulando…" : error ? "Reintentar anular" : "Anular pedido"
        }
        disabled={anulando}
        peligro
        onPress={pedirConfirmacion}
      />
    </ScrollView>
  );
}
