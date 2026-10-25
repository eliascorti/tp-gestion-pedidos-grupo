# Reconstrucción del TP en grupo

Integrantes: Elías Corti, Joaquin Cavanna, Tadeo Reinante y Marco Turchi.

Repositorio de la base: https://github.com/eliascorti/tp-gestion-pedidos-grupo
Referencia terminada: https://github.com/eliascorti/tp-gestion-pedidos

Esta es una base para incorporar por módulos el proyecto ya preparado con ayuda de IA. Las pantallas muestran "pendiente" hasta que se reemplazan con los archivos asignados. Las ramas registrarán la revisión e incorporación del código existente; no representan una autoría previa distinta ni llevan fechas inventadas.

## Antes de empezar

El módulo de datos de Elías ya está incorporado directamente en main. Los compañeros pueden clonar el repositorio y pasar a las ramas de catálogo, pedidos y formulario, creadas desde esta base compartida.

Las tres ramas parten del main con los datos compartidos. Cada compañero ejecuta git fetch origin y git checkout con el nombre de su rama antes de copiar su ZIP. Si ya tenía una rama anterior con su nombre, debe usar la nueva rama por funcionalidad.

## Reparto

| Persona | Rama | Qué incorpora |
| --- | --- | --- |
| Elías | main | Tipos, servicios, cálculos, hook, Context y layout con Provider |
| Joaquin | feature/catalogo | Tarjeta de producto y catálogo |
| Tadeo | feature/pedidos | Tarjeta, listado y detalle de pedido, ficha del cliente |
| Marco | feature/formulario | Selector de cantidad, formulario, rutas de alta y edición |

## Cómo usar un ZIP de una parte

1. Descargar el ZIP que tiene tu nombre y extraerlo fuera de la carpeta clonada.
2. Entrar a tu rama siguiendo LEEME-<nombre>.md dentro de ese ZIP.
3. Copiar SOLAMENTE la carpeta src del ZIP sobre la carpeta src del proyecto clonado.
4. Aceptar reemplazar los archivos con el mismo nombre. No borrar la carpeta src antes: se perderían los archivos compartidos.
5. Revisar y entender tu parte, guardar commits y subir tu rama.
6. Crear un Pull Request hacia main para que Elías lo integre.

No copiar una carpeta dentro de sí misma: el resultado debe ser src/components/archivo.tsx, nunca src/src/components/archivo.tsx.
No reemplazar la carpeta completa del proyecto clonado. No borrar ni copiar .git. No mover node_modules entre computadoras.
Los archivos LEEME de los ZIP son instrucciones, no hace falta copiarlos al proyecto ni incluirlos en los commits.

## Dependencias entre módulos

Los datos de Elías ya están integrados. Después se integran Joaquin y Tadeo; al final Marco. El formulario de Marco utiliza TarjetaProducto del módulo de Joaquin. Los botones de alta y edición se completan al integrar Marco. Antes de integrar todas las partes, las pantallas o componentes que dependen de otros módulos pueden seguir pendientes.

Se pueden subir ramas por separado aunque el resultado completo todavía no esté integrado. No confundir un commit intermedio con una app lista para entregar.

## Ejecutar

```powershell
nvm use 24.19.0
npm ci
npm start
```

Expo SDK 54, React Native 0.81.5, TypeScript y Expo Router. Expo Go debe ser compatible con SDK 54.
No se agregaron tests ni se ejecutaron chequeos de código al preparar estos paquetes.

## Integración a cargo de Elías

En GitHub, agregar a los compañeros como colaboradores desde Settings > Collaborators. Cada uno debe aceptar la invitación y usar su propia cuenta Git/GitHub.
Integrar los Pull Requests en orden: catálogo, pedidos y formulario. Los datos ya están en main. Si GitHub muestra conflictos, revisar los archivos antes de confirmar el merge.
main empieza con la base y se completa con los merges. No subir el ZIP de referencia completo a main porque dejaría sin cambios que incorporar a las otras ramas.

## Archivos de los paquetes

- 00-base-comun.zip: instantánea de la base, sin historial Git. Elías puede usarla como respaldo; los compañeros deben clonar el repositorio.
- 01: respaldo del módulo de datos de Elías, ya incorporado en main; no hay que volver a subirlo.
- 02 a 04: archivos de los compañeros e instrucciones individuales.
- 05-proyecto-completo-referencia.zip: proyecto original terminado, sin dependencias ni historial Git. Sirve para consultar cómo deben quedar las partes integradas.

Después de integrar todo, completar el README final con instrucciones, sección de IA y capturas, tomando como referencia el proyecto original. Cada integrante debe poder explicar también el recorrido general de la app.
