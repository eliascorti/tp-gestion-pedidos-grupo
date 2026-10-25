import { Pressable, Text } from "react-native";
import { estilos as s } from "../constants/estilos";

type Props = {
  titulo: string;
  onPress: () => void;
  disabled?: boolean;
  peligro?: boolean;
};
export function Boton({
  titulo,
  onPress,
  disabled = false,
  peligro = false,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        s.boton,
        peligro && s.botonPeligro,
        disabled && s.botonDeshabilitado,
      ]}
    >
      <Text style={s.textoBoton}>{titulo}</Text>
    </Pressable>
  );
}
