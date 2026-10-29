# Gestión de pedidos

Trabajo práctico final de la Unidad 5 de Ingeniería de Software II. Elegimos la propuesta 3: una app para consultar y gestionar pedidos de clientes usando Fake Store API.

La aplicación permite ver los pedidos, consultar el catálogo, crear un pedido, editarlo y anularlo. También se puede entrar a la ficha de un cliente y consultar sus pedidos.

## Integrantes
- Elias Corti
- Tadeo Reinante: 
- Marco Turchi:
- Joaquin Cavanna

La base del proyecto y los servicios se incorporaron desde el repositorio principal de Elias Corti. Las partes se trabajaron en las ramas `feature/pedidos`, `feature/catalogo` y `feature/formulario`, y se integraron a `main` mediante Pull Requests.


## Cómo funciona

En la pestaña **Pedidos** se muestra el número de cada pedido, el cliente, la fecha, las unidades y el total. Al tocar una tarjeta se abre su detalle. Desde ahí se puede editar, anular o entrar a la ficha del cliente.

La pestaña **Catálogo** muestra los productos con imagen y precio. Los botones de categorías permiten filtrar la lista y volver a ver todos los productos con la opción “Todas”. Los nombres de productos y categorías se muestran como llegan de la API, en inglés; los textos de la app están en castellano.

Para crear un pedido se elige un cliente y se agregan productos. Las cantidades se pueden cambiar con los botones o escribiéndolas. Si se agrega otra vez un producto que ya estaba elegido, se suma una unidad en la misma fila. También se pueden quitar productos y el total se actualiza con cada cambio.


### Cálculo de los totales

Los pedidos traen IDs de productos y cantidades, pero no sus nombres ni precios. Al inicio se cargan productos y clientes y se organizan en mapas por ID. Así se pueden cruzar los datos sin hacer una consulta por cada producto de cada pedido.

Las funciones de `src/utils/pedidos.ts` calculan el subtotal, el total y la cantidad de unidades. Son funciones puras: reciben datos y devuelven resultados, sin usar estado ni hacer solicitudes. Los importes se calculan en centavos y se muestran con dos decimales. Las fechas se muestran en formato `dd/mm/aaaa`.

## Pantallas y navegación

| Pantalla | Ruta | Uso |
| --- | --- | --- |
| Pedidos | `/` | Listado y acceso al alta. |
| Catálogo | `/catalogo` | Consulta y filtro de productos. |
| Detalle | `/pedido/[id]` | Datos del pedido, edición y anulación. |
| Alta y edición | `/pedido/nuevo` y `/pedido/editar/[id]` | Formulario compartido. |
| Cliente | `/cliente/[id]` | Datos del cliente y sus pedidos. |

Las secciones principales usan tabs. Los detalles y formularios se abren en un stack. En las rutas se envía el ID y se lee con `useLocalSearchParams`; no se pasa el objeto completo.

## Estructura del proyecto

Las pantallas y rutas están en `src/app/`, y los componentes reutilizables en `src/components/`. Las consultas HTTP se concentran en `src/services/`, los tipos en `src/types/` y el estado compartido en `src/context/`.

Los cálculos y el formato están en `src/utils/`, el manejo de carga y errores en `src/hooks/`, y los estilos y colores en `src/constants/`.

## Capturas

Estas capturas corresponden a la versión web que se probó durante la revisión.

### Pedidos

![Listado de pedidos](docs/capturas/pedidos.png)

### Catálogo

![Catálogo de productos](docs/capturas/catalogo.png)

### Detalle del pedido

![Detalle de un pedido creado durante la sesión](docs/capturas/detalle-pedido.png)

### Alta y edición

![Formulario para crear un pedido](docs/capturas/nuevo-pedido.png)

El formulario de edición usa este mismo componente, con los datos precargados.

### Cliente

## Uso de IA

Se usó ChatGPT como apoyo para conectar la aplicación con Fake Store API y organizar las consultas en la carpeta services. También se consultó cómo manejar los errores, validar los pedidos y mantener los cambios durante la sesión, ya que la API no los guarda de forma permanente. Además, se utilizó para entender el código y repasar cómo se relacionan las pantallas, los componentes y los servicios.
