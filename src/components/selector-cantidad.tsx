import { Pressable, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { estilos as s } from "../constants/estilos";

type Props = {
  cantidad: number;
  onChange: (cantidad: number) => void;
  disabled: boolean;
  nombre: string;
};
export function SelectorCantidad({
  cantidad,
  onChange,
  disabled,
  nombre,
}: Props) {
  const [texto, setTexto] = useState(String(cantidad));
  useEffect(() => {
    if (Number.isFinite(cantidad)) setTexto(String(cantidad));
  }, [cantidad]);
  function cambiar(valor: string) {
    setTexto(valor);
    // Vacío, letras, fracciones o negativos permanecen visibles para poder corregirlos.
    onChange(/^\d+$/.test(valor) ? Number(valor) : NaN);
  }
  const base = Number.isSafeInteger(cantidad) && cantidad >= 1 ? cantidad : 1;
  return (
    <View style={s.bloque}>
      <View style={s.controles}>
        <Pressable
          style={s.cantidadBoton}
          accessibilityRole="button"
          accessibilityLabel={`Restar una unidad de ${nombre}`}
          disabled={disabled || base <= 1}
          onPress={() => cambiar(String(base - 1))}
        >
          <Text style={s.texto}>−</Text>
        </Pressable>
        <TextInput
          accessibilityLabel={`Cantidad de ${nombre}`}
          style={s.entrada}
          value={texto}
          onChangeText={cambiar}
          keyboardType="number-pad"
          editable={!disabled}
        />
        <Pressable
          style={s.cantidadBoton}
          accessibilityRole="button"
          accessibilityLabel={`Sumar una unidad de ${nombre}`}
          disabled={disabled}
          onPress={() => cambiar(String(base + 1))}
        >
          <Text style={s.texto}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}
