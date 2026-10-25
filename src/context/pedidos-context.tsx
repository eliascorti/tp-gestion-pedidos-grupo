import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Text, View } from "react-native";
import type { Cliente } from "../types/cliente";
import type { DatosPedido, Pedido } from "../types/pedido";
import type { Producto, ProductosPorId } from "../types/producto";
import * as servicio from "../services/pedidos";
import { listarClientes } from "../services/clientes";
import { listarProductos } from "../services/productos";
import {
  combinarPedidos,
  idDisponible,
  type CambiosPedidos,
} from "../utils/sesion";
import { validarPedido } from "../utils/pedidos";
import { useCarga } from "../hooks/use-carga";
import { EstadoPantalla } from "../components/estado-pantalla";
import { estilos as s } from "../constants/estilos";

type DatosIniciales = {
  pedidos: Pedido[];
  productos: Producto[];
  clientes: Cliente[];
};
type Contexto = {
  pedidos: Pedido[];
  productos: Producto[];
  clientes: Cliente[];
  productosPorId: ProductosPorId;
  clientesPorId: Record<number, Cliente>;
  resolverPedido: (id: number) => Promise<Pedido>;
  resolverPedidosCliente: (id: number) => Promise<Pedido[]>;
  guardar: (datos: DatosPedido, id?: number) => Promise<void>;
  anular: (id: number) => Promise<void>;
  avisar: (mensaje: string) => void;
};
const ContextoPedidos = createContext<Contexto | null>(null);

// Catálogo y clientes se consultan una sola vez, fuera de las tarjetas y los ítems.
async function cargarIniciales(): Promise<DatosIniciales> {
  const [pedidos, productos, clientes] = await Promise.all([
    servicio.listarPedidos(),
    listarProductos(),
    listarClientes(),
  ]);
  return { pedidos, productos, clientes };
}

export function PedidosProvider({ children }: { children: ReactNode }) {
  const carga = useCarga(cargarIniciales);
  const [cambios, setCambios] = useState<CambiosPedidos>({});
  const cambiosActuales = useRef(cambios);
  const [aviso, setAviso] = useState("");
  const idsAsignados = useRef<number[]>([]);
  const iniciales = carga.datos;
  const productosPorId = useMemo(
    () =>
      Object.fromEntries((iniciales?.productos ?? []).map((p) => [p.id, p])),
    [iniciales],
  );
  const clientesPorId = useMemo(
    () => Object.fromEntries((iniciales?.clientes ?? []).map((c) => [c.id, c])),
    [iniciales],
  );
  const pedidos = useMemo(
    () => combinarPedidos(iniciales?.pedidos ?? [], cambios),
    [iniciales, cambios],
  );

  function registrarCambio(id: number, pedido: Pedido | null) {
    const nuevos = { ...cambiosActuales.current, [id]: pedido };
    cambiosActuales.current = nuevos;
    setCambios(nuevos);
  }

  const resolverPedido = useCallback(async (id: number) => {
    // También resuelve pedidos creados en sesión, que no existen en el servidor.
    if (Object.hasOwn(cambiosActuales.current, id)) {
      const pedido = cambiosActuales.current[id];
      if (!pedido)
        throw new Error("Este pedido fue anulado durante la sesión.");
      return pedido;
    }
    const remoto = await servicio.obtenerPedido(id);
    // Una escritura pudo terminar mientras el GET estaba en curso.
    if (Object.hasOwn(cambiosActuales.current, id)) {
      const actual = cambiosActuales.current[id];
      if (!actual)
        throw new Error("Este pedido fue anulado durante la sesión.");
      return actual;
    }
    return remoto;
  }, []);

  const resolverPedidosCliente = useCallback(async (id: number) => {
    const remotos = await servicio.listarPedidosCliente(id);
    return combinarPedidos(remotos, cambiosActuales.current).filter(
      (p) => p.userId === id,
    );
  }, []);

  async function guardar(datos: DatosPedido, id?: number) {
    const errores = validarPedido(datos.userId, datos.products);
    if (
      Object.keys(errores).length ||
      !clientesPorId[datos.userId] ||
      datos.products.some((p) => !productosPorId[p.productId])
    ) {
      throw new Error("Revisá el cliente, los productos y las cantidades.");
    }
    const respuesta =
      id === undefined
        ? await servicio.crearPedido(datos)
        : await servicio.actualizarPedido(id, datos);
    // Fake Store puede repetir el mismo id en varios POST: reservar uno único en sesión.
    const idFinal =
      id ??
      idDisponible(respuesta.id, [
        ...(iniciales?.pedidos ?? []).map((p) => p.id),
        ...idsAsignados.current,
      ]);
    if (id === undefined) idsAsignados.current.push(idFinal);
    registrarCambio(idFinal, { ...respuesta, ...datos, id: idFinal });
  }

  async function anular(id: number) {
    await servicio.eliminarPedido(id);
    registrarCambio(id, null);
  }

  if (carga.cargando || carga.error || !iniciales)
    return (
      <EstadoPantalla
        cargando={carga.cargando}
        error={carga.error}
        reintentar={carga.reintentar}
      />
    );
  return (
    <ContextoPedidos.Provider
      value={{
        pedidos,
        productos: iniciales.productos,
        clientes: iniciales.clientes,
        productosPorId,
        clientesPorId,
        resolverPedido,
        resolverPedidosCliente,
        guardar,
        anular,
        avisar: setAviso,
      }}
    >
      <View style={s.pantalla}>
        {aviso ? (
          <View accessibilityRole="alert" style={s.aviso}>
            <Text style={s.texto}>{aviso}</Text>
            <Text
              accessibilityRole="button"
              onPress={() => setAviso("")}
              style={s.textoEnlace}
            >
              Cerrar mensaje
            </Text>
          </View>
        ) : null}
        {children}
      </View>
    </ContextoPedidos.Provider>
  );
}

export function usePedidos() {
  const contexto = useContext(ContextoPedidos);
  if (!contexto)
    throw new Error("usePedidos debe usarse dentro de PedidosProvider.");
  return contexto;
}
