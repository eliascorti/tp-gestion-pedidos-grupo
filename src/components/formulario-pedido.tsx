import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import type { ItemPedido, Pedido } from "../types/pedido";
import { usePedidos } from "../context/pedidos-context";
import {
  agregarProducto,
  subtotal,
  totalPedido,
  validarPedido,
} from "../utils/pedidos";
import { mensajeError, nombreCliente, precio } from "../utils/formato";
import { estilos as s } from "../constants/estilos";
import { Boton } from "./boton";
import { SelectorCantidad } from "./selector-cantidad";
import { TarjetaProducto } from "./tarjeta-producto";

export function FormularioPedido({ pedido }: { pedido?: Pedido }) {
  const { clientes, productos, productosPorId, guardar, avisar } = usePedidos();
  const [clienteId, setClienteId] = useState<number | null>(
    pedido?.userId ?? null,
  );
  const [items, setItems] = useState<ItemPedido[]>(
    pedido?.products.map((item) => ({ ...item })) ?? [],
  );
  const [enviando, setEnviando] = useState(false);
  const [mostrarErrores, setMostrarErrores] = useState(false);
  const [error, setError] = useState("");
  const errores = validarPedido(clienteId, items);
  const cantidadesValidas = items.every(
    (item) => Number.isSafeInteger(item.quantity) && item.quantity >= 1,
  );
  const total = cantidadesValidas
    ? totalPedido(items, productosPorId)
    : undefined;

  function cambiarCantidad(productId: number, quantity: number) {
    setItems((actuales) =>
      actuales.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      ),
    );
  }

  async function enviar() {
    setMostrarErrores(true);
    if (enviando || Object.keys(errores).length || clienteId === null) return;
    setEnviando(true);
    setError("");
    try {
      await guardar(
        {
          userId: clienteId,
          date: pedido?.date ?? new Date().toISOString(),
          products: items,
        },
        pedido?.id,
      );
      avisar(
        pedido
          ? "Pedido actualizado. Los cambios se conservan durante esta sesión."
          : "Pedido creado. Ya está disponible en el listado durante esta sesión.",
      );
      if (router.canGoBack()) router.back();
      else router.replace("/");
    } catch (fallo) {
      setError(mensajeError(fallo));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={s.pantalla}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={s.contenido}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={s.etiqueta}>
          {pedido ? `PEDIDO #${pedido.id}` : "NUEVO PEDIDO"}
        </Text>
        <Text style={s.titulo}>
          {pedido ? "Editar pedido" : "Armá un pedido"}
        </Text>
        <Text style={s.secundario}>
          Elegí el cliente y agregá productos. Repetir un producto suma su
          cantidad.
        </Text>
        <View style={s.bloque}>
          <Text style={s.subtitulo}>1. Cliente</Text>
          <View style={s.chips}>
            {clientes.map((cliente) => (
              <Pressable
                key={cliente.id}
                disabled={enviando}
                accessibilityRole="button"
                accessibilityState={{ selected: cliente.id === clienteId }}
                onPress={() => setClienteId(cliente.id)}
                style={[s.chip, cliente.id === clienteId && s.chipActivo]}
              >
                <Text style={s.texto}>{nombreCliente(cliente)}</Text>
              </Pressable>
            ))}
          </View>
          {mostrarErrores && errores.cliente && (
            <Text accessibilityRole="alert" style={s.error}>
              {errores.cliente}
            </Text>
          )}
        </View>
        <View style={s.bloque}>
          <Text style={s.subtitulo}>2. Productos elegidos</Text>
          {!items.length && (
            <Text style={s.secundario}>
              Todavía no agregaste productos. Elegilos del catálogo de abajo.
            </Text>
          )}
          {items.map((item) => {
            const producto = productosPorId[item.productId];
            const subtotalItem =
              Number.isSafeInteger(item.quantity) && item.quantity >= 1
                ? precio(subtotal(item, productosPorId))
                : "Cantidad inválida";
            return (
              <View key={item.productId} style={s.tarjeta}>
                <Text style={s.texto}>{producto.title}</Text>
                <Text style={s.secundario}>
                  Precio unitario: {precio(producto.price)}
                </Text>
                <SelectorCantidad
                  cantidad={item.quantity}
                  onChange={(cantidad) =>
                    cambiarCantidad(item.productId, cantidad)
                  }
                  disabled={enviando}
                  nombre={producto.title}
                />
                {(!Number.isSafeInteger(item.quantity) ||
                  item.quantity < 1) && (
                  <Text style={s.error}>
                    Ingresá un número entero mayor o igual a 1.
                  </Text>
                )}
                <View style={s.fila}>
                  <Text style={s.precio}>{subtotalItem}</Text>
                  <Pressable
                    disabled={enviando}
                    accessibilityRole="button"
                    accessibilityLabel={`Quitar ${producto.title}`}
                    onPress={() =>
                      setItems((actuales) =>
                        actuales.filter((i) => i.productId !== item.productId),
                      )
                    }
                  >
                    <Text style={s.textoEnlace}>Quitar</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
          {mostrarErrores && errores.productos && (
            <Text accessibilityRole="alert" style={s.error}>
              {errores.productos}
            </Text>
          )}
        </View>
        <View style={s.tarjeta}>
          <Text style={s.secundario}>TOTAL DEL PEDIDO</Text>
          <Text style={s.total}>
            {total === undefined ? "Revisá las cantidades" : precio(total)}
          </Text>
          {error ? (
            <Text accessibilityRole="alert" style={s.error}>
              {error}
            </Text>
          ) : null}
          <Boton
            titulo={
              enviando
                ? "Guardando…"
                : error
                  ? "Reintentar guardar"
                  : "Guardar pedido"
            }
            onPress={enviar}
            disabled={enviando}
          />
        </View>
        <Text style={s.subtitulo}>3. Agregar del catálogo</Text>
        {productos.map((producto) => (
          <TarjetaProducto
            key={producto.id}
            producto={producto}
            disabled={enviando}
            onAgregar={() =>
              setItems((actuales) => agregarProducto(actuales, producto.id))
            }
          />
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
