import { useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import { usePedidos } from "../../../context/pedidos-context";
import { useCarga } from "../../../hooks/use-carga";
import { leerId } from "../../../utils/formato";
import { EstadoPantalla } from "../../../components/estado-pantalla";
import { FormularioPedido } from "../../../components/formulario-pedido";

export default function EditarPedido() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { resolverPedido } = usePedidos();
  const cargar = useCallback(
    async () => resolverPedido(leerId(id)),
    [id, resolverPedido],
  );
  const carga = useCarga(cargar);
  if (carga.cargando || carga.error || !carga.datos)
    return (
      <EstadoPantalla
        cargando={carga.cargando}
        error={carga.error}
        reintentar={carga.reintentar}
      />
    );
  return <FormularioPedido pedido={carga.datos} />;
}
