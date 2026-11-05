# Carrito React: implementación y verificación

Esta evidencia técnica corresponde a esta etapa. No sustituye el documento académico de cobertura ni acredita pruebas Jasmine/Karma.

## Archivos de esta etapa

Modificados: `src/pages/Carrito.tsx`, `src/components/Header.tsx`, `src/components/ProductCard.tsx`, `src/services/cartRepository.ts`, `src/services/cartStore.ts`, `tests/navbar.test.mjs` y `package.json` (scripts de pruebas).

Creados: `src/pages/Carrito.css`, `src/services/cartState.ts`, `src/services/checkoutService.ts`, `tests/cart.test.mjs`, `tests/cartIntegration.test.mjs` y este registro.

Los demás cambios que aparecen en Git ya existían al comenzar esta etapa. Se compararon hashes de los archivos fuente, pruebas y Sitio Old con una captura previa a la edición: no se eliminaron archivos, no se modificó Sitio Old ni se cambiaron imágenes o estilos del catálogo. No se instalaron dependencias.

## Decisiones y correcciones

- La cantidad ahora es un campo controlado con actualización mediante `onChange`, sin esperar a `blur`. Cada entero positivo válido se guarda inmediatamente; cantidades inválidas o escrituras fallidas restauran el valor anterior. Subtotales, total y contador comparten el mismo snapshot.
- `cartState` publica productos, unidades, total y error, con snapshots estables. Esto corrige el caso de dos variantes distintas con el mismo número de unidades. `cartStore` conecta ese estado a React y a eventos `storage` del mismo origen, incluidas eliminaciones de la clave y `localStorage.clear()`.
- El contador mantiene la presentación original, incluido cero. El botón de cada tarjeta conserva la confirmación accesible y añade entre paréntesis las unidades del color seleccionado, sin agregar filas a la tarjeta ni modificar imágenes.
- Las miniaturas conservan exactamente 60 × 70 px y `object-fit: contain`. Se reutiliza `productImageUrl` para evitar prefijos duplicados.
- CSS exclusivo de `.carrito-page`: tabla en escritorio y filas adaptadas a tarjetas hasta 700 px. Reutiliza tokens del tema, Bootstrap y el naranja global. El botón de eliminar también utiliza colores de contraste del tema.
- Checkout académico determinista, con selector aprobado/rechazado. No pide información bancaria ni realiza cobros. Rechazar no escribe órdenes ni elimina productos.
- La aprobación guarda primero la orden, después limpia el carrito y finalmente confirma la limpieza. El identificador de intento evita duplicados; un marcador de limpieza pendiente permite recuperar una orden guardada tras un fallo de vaciado y una recarga. Un carrito que cambió se conserva y muestra advertencia; no se borra automáticamente.
- La interfaz bloquea clics repetidos. En navegadores con Web Locks se coordinan también las finalizaciones React entre pestañas. `localStorage` no proporciona transacciones entre claves; las páginas antiguas no participan en este bloqueo. No se acredita atomicidad frente a escrituras simultáneas del sitio antiguo ni frente a cierres del navegador entre escrituras.

## Compatibilidad

Se conservan `carritoAlbedo`, `ordenesAlbedo` y `usuarioSesionAlbedo`. Las órdenes mantienen `id`, `numeroOrden` correlativo `ORD-0001`, fechas, estado `Pendiente`, cliente, productos, subtotales y total. Se añade únicamente `pagoSimulado`, con resultado, identificador de intento y marcador de limpieza. Las órdenes previas se conservan completas.

La sesión existente se lee sin modificarla. Sin sesión se conservan los valores originales de invitado. Los JSON corruptos bloquean la operación sin reemplazarlos por un arreglo vacío. Es una simulación académica local, sin nueva autenticación.

## Verificaciones automatizadas

Comandos desde la raíz:

```powershell
npm.cmd --prefix .\react-app run build
npm.cmd --prefix .\react-app run lint
npm.cmd --prefix .\react-app test
```

- Build incluye TypeScript (`tsc -b`) y Vite.
- Resultado final: build y lint aprobados; **47/47 pruebas aprobadas**, de las cuales 26 son nuevas de carrito/integración. `git diff --check` sin errores; Git solo advierte normalización LF/CRLF en dos estilos globales previamente modificados y no editados en esta etapa.
- Cálculo estático de contraste de los tokens revisados: blanco/naranja 4,84:1; texto principal claro 17,63:1 y oscuro 16,01:1; eliminar claro 6,95:1 y oscuro 10,44:1. Estos valores no sustituyen inspección visual ni acreditan todos los estados renderizados.
- Pruebas: runner de **Node**, con lógica TypeScript, Vite, HTML renderizado en servidor y HTTP local. No utilizan navegador ni ejecutan Jasmine/Karma.
- Carrito/pago: variantes, agregar, aumentar, disminuir, invalidación, eliminar, vaciar, cálculos, recarga mediante otra instancia, notificaciones equivalentes a cambios de almacenamiento, JSON corrupto, errores de escritura, aprobación, rechazo, cliente invitado/con sesión, correlativo, conservación de órdenes, idempotencia y recuperación de limpieza pendiente.
- Se ejecutan funciones originales de `Sitio Old/carrito.js` en un contexto aislado para comprobar lectura de órdenes React y correlativo.
- HTTP: `/`, `/index.html`, `/productos.html`, `/carrito.html` responden como entradas React. Diez destinos HTML antiguos responden, sin considerarlos migrados. Una imagen servida se compara byte a byte con su original; se comprueba además que existen todas las imágenes y variantes del catálogo original.
- HTML estático: estado vacío, enlaces React y contador accesible del encabezado. Las pruebas existentes cubren categorías, navegación y lógica del tema.

## Pruebas manuales pendientes en Chrome

No hubo navegador conectado durante esta etapa. HTTP y SSR no comprueban renderizado, interacción real, historial, hidratación o layout del navegador.

1. En Productos, añadir dos veces el mismo producto/color y otra variante. Comprobar confirmación, indicador de tarjeta y suma de unidades del encabezado.
2. Abrir Carrito: verificar imágenes, nombre, color y precios. Cambiar cantidades sin salir del campo y comprobar inmediatamente subtotal, total y contador. Probar 0, negativos, decimales y campo vacío: debe conservarse el entero anterior.
3. Eliminar una variante, vaciar, recargar y volver mediante Inicio/Productos/Carrito y Atrás/Adelante. Confirmar persistencia y ausencia de reinicios de tema.
4. Abrir dos pestañas del mismo origen. Cambiar cantidades y variantes manteniendo el mismo total de unidades; eliminar y vaciar. Confirmar actualización real en ambas. Cambiar también el tema entre pestañas.
5. Elegir pago rechazado: conservar carrito y órdenes. Elegir aprobado: una sola orden, confirmación y contador cero. Repetir clic rápidamente. Revisar pedidos antiguos con una sesión local Cliente y órdenes con administración existente.
6. Probar ambos temas a 360, 375, 400, 768 y 1440 px: tabla/tarjetas, menús, foco de teclado, mensajes, campos, contraste, ausencia de recortes o desbordamientos. Confirmar miniaturas 60 × 70 px y catálogo sin cambios de imagen.
7. En un perfil de prueba, simular almacenamiento bloqueado/cuota agotada y comprobar mensajes, conservación de datos y reintento de limpieza. No manipular datos personales existentes para estas pruebas.

## Pendientes académicos

Actualización posterior: se implementó y ejecutó la infraestructura académica en la siguiente etapa; consultar [Pruebas Jasmine/Karma](PRUEBAS-JASMINE-KARMA.md). El párrafo siguiente conserva el estado histórico al terminar el carrito.

No se encontraron configuración ni dependencias Jasmine/Karma. Quedan su configuración autorizada, ejecución de las pruebas académicas exigidas (considerar diez para máximo desempeño), documento formal de cobertura, ERS V2 y defensa. La rúbrica oficial EP2 no está localizada en el repositorio; AGENTS.md registra los requisitos comunicados por Claudio, y los documentos antiguos no acreditan EP2.
