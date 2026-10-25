import { useCallback, useEffect, useState } from "react";
import { mensajeError } from "../utils/formato";

// La función recibida debe ser estable (useCallback) para no repetir pedidos HTTP.
export function useCarga<T>(cargar: () => Promise<T>) {
  const [datos, setDatos] = useState<T>();
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [intento, setIntento] = useState(0);
  const reintentar = useCallback(() => setIntento((valor) => valor + 1), []);
  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError("");
    cargar()
      .then((resultado) => {
        if (activo) setDatos(resultado);
      })
      .catch((fallo) => {
        if (activo) setError(mensajeError(fallo));
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [cargar, intento]);
  return { datos, cargando, error, reintentar };
}
