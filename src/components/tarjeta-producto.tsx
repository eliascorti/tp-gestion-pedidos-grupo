import { Image, Text, View } from "react-native";
import type { Producto } from "../types/producto";
import { precio } from "../utils/formato";
import { estilos as s } from "../constants/estilos";
import { Boton } from "./boton";

type Props = { producto: Producto; onAgregar?: () => void; disabled?: boolean };
export function TarjetaProducto({ producto, onAgregar, disabled }: Props) {
  return (
    <View style={s.tarjeta}>
      <View style={s.filaProducto}>
        <Image
          source={{ uri: producto.image }}
          style={s.imagen}
          resizeMode="contain"
          accessibilityLabel={producto.title}
        />
        <View style={s.expandir}>
          <Text style={s.texto}>{producto.title}</Text>
          <Text style={s.secundario}>{producto.category}</Text>
          <Text style={s.precio}>{precio(producto.price)}</Text>
        </View>
      </View>
      {onAgregar && (
        <Boton
          titulo="Agregar producto"
          onPress={onAgregar}
          disabled={disabled}
        />
      )}
    </View>
  );
}
