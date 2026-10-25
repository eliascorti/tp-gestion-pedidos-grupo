export const API_URL = "https://fakestoreapi.com";

export async function solicitar<T>(
  ruta: string,
  opciones: RequestInit = {},
  permitirNulo = false,
): Promise<T> {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), 15000);
  try {
    const respuesta = await fetch(`${API_URL}${ruta}`, {
      ...opciones,
      signal: controlador.signal,
    });
    if (!respuesta.ok)
      throw new Error(
        `La API respondió con error ${respuesta.status}. Probá nuevamente.`,
      );
    const datos: T = await respuesta.json();
    if (!permitirNulo && (datos === null || datos === undefined))
      throw new Error("No se encontró el registro solicitado.");
    return datos;
  } catch (error) {
    if (controlador.signal.aborted)
      throw new Error(
        "La API tardó demasiado. Revisá tu conexión y reintentá.",
      );
    if (error instanceof TypeError)
      throw new Error(
        "No se pudo conectar con Fake Store API. Revisá tu conexión y reintentá.",
      );
    throw error;
  } finally {
    clearTimeout(temporizador);
  }
}

export const cuerpoJson = (datos: unknown): RequestInit => ({
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(datos),
});
