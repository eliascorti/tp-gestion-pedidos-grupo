import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { PedidosProvider } from "../context/pedidos-context";
import { colores } from "../constants/colores";
import { estilos as s } from "../constants/estilos";

export const unstable_settings = { initialRouteName: "(tabs)" };

export default function Layout() {
  return (
    <SafeAreaView edges={["top", "bottom"]} style={s.pantalla}>
      <PedidosProvider>
        <Stack
          screenOptions={{
            headerStyle: s.encabezado,
            headerTintColor: colores.primario,
            contentStyle: s.pantalla,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="pedido/nuevo"
            options={{ title: "Nuevo pedido" }}
          />
          <Stack.Screen
            name="pedido/[id]"
            options={{ title: "Detalle del pedido" }}
          />
          <Stack.Screen
            name="pedido/editar/[id]"
            options={{ title: "Editar pedido" }}
          />
          <Stack.Screen name="cliente/[id]" options={{ title: "Cliente" }} />
        </Stack>
        <StatusBar style="dark" />
      </PedidosProvider>
    </SafeAreaView>
  );
}
