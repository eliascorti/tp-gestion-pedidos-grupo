import { useCallback, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { usePedidos } from "../../context/pedidos-context";
import {
  listarCategorias,
  listarProductosCategoria,
} from "../../services/productos";
import { useCarga } from "../../hooks/use-carga";
import { EstadoPantalla } from "../../components/estado-pantalla";
import { TarjetaProducto } from "../../components/tarjeta-producto";
import { estilos as s } from "../../constants/estilos";

export default function Catalogo() {
  const { productos } = usePedidos();
  const [categoria, setCategoria] = useState("");
  const categorias = useCarga(listarCategorias);
  const cargarProductos = useCallback(
    () =>
      categoria
        ? listarProductosCategoria(categoria)
        : Promise.resolve(productos),
    [categoria, productos],
  );
  const lista = useCarga(cargarProductos);
  return (
    <View style={s.pantalla}>
      <View style={s.contenido}>
        <Text style={s.etiqueta}>PRODUCTOS</Text>
        <Text style={s.titulo}>Catálogo</Text>
        <Text style={s.secundario}>
          Consultá productos y precios. Los nombres y categorías provienen de la
          API en inglés.
        </Text>
        {categorias.cargando || categorias.error ? (
          <EstadoPantalla
            cargando={categorias.cargando}
            error={categorias.error}
            reintentar={categorias.reintentar}
          />
        ) : (
          <View style={s.chips}>
            {["", ...(categorias.datos ?? [])].map((cat) => (
              <Pressable
                key={cat}
                style={[s.chip, cat === categoria && s.chipActivo]}
                accessibilityRole="button"
                accessibilityState={{ selected: cat === categoria }}
                onPress={() => setCategoria(cat)}
              >
                <Text style={s.texto}>{cat || "Todas"}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
      {lista.cargando || lista.error ? (
        <EstadoPantalla
          cargando={lista.cargando}
          error={lista.error}
          reintentar={lista.reintentar}
        />
      ) : (
        <FlatList
          contentContainerStyle={s.contenido}
          data={lista.datos}
          keyExtractor={(p) => String(p.id)}
          ItemSeparatorComponent={() => <View style={s.separador} />}
          ListEmptyComponent={
            <Text style={s.texto}>No hay productos en esta categoría.</Text>
          }
          renderItem={({ item }) => <TarjetaProducto producto={item} />}
        />
      )}
    </View>
  );
}
