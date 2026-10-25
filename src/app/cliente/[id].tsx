import { Text, View } from "react-native";
import { estilos as s } from "../../constants/estilos";

export default function PantallaPendiente() {
  return (
    <View style={[s.pantalla, s.contenido]}>
      <Text style={s.titulo}>Cliente</Text>
      <Text style={s.texto}>Módulo pendiente de incorporar.</Text>
      <Text style={s.secundario}>Responsable: Tadeo Reinante.</Text>
    </View>
  );
}
