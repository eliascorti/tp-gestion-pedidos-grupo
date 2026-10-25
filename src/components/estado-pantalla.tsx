import { ActivityIndicator, Text, View } from "react-native";
import { estilos as s } from "../constants/estilos";
import { colores } from "../constants/colores";
import { Boton } from "./boton";

type Props = { cargando?: boolean; error?: string; reintentar?: () => void };
export function EstadoPantalla({ cargando, error, reintentar }: Props) {
  return (
    <View style={s.centrado}>
      {cargando ? (
        <>
          <ActivityIndicator size="large" color={colores.primario} />
          <Text style={s.secundario}>Cargando datos…</Text>
        </>
      ) : (
        <>
          <Text style={s.subtitulo}>No pudimos cargar los datos</Text>
          <Text accessibilityRole="alert" style={s.error}>
            {error}
          </Text>
          {reintentar && <Boton titulo="Reintentar" onPress={reintentar} />}
        </>
      )}
    </View>
  );
}
