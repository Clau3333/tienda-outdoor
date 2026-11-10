# Cobertura funcional y análisis de testing EP2

Este documento distingue cobertura de requisitos/casos y cobertura instrumentada de código. No se ha medido porcentaje de líneas, ramas o funciones. Los resultados finales de esta etapa se registran en `ACEPTACION-EP2.md`; los reportes anteriores conservados en `react-app/tests` son históricos por etapa.

## Capas y ejecución

| Capa | Comando desde raíz | Qué comprueba | Qué no demuestra |
|---|---|---|---|
| TypeScript/build | `npm.cmd --prefix .\react-app run build` | Tipos y empaquetado React + legado | Comportamiento de usuario |
| ESLint | `npm.cmd --prefix .\react-app run lint` | Reglas estáticas configuradas | Corrección funcional completa |
| Jasmine/Karma | `npm.cmd --prefix .\react-app run test:unit` | Lógica y componentes en ChromeHeadless | Dispositivos físicos ni todos los estilos |
| Node | `npm.cmd --prefix .\react-app test` | Servicios, contratos y algunas rutas HTTP/SSR | Layout visual o interacción real de navegador |
| Chrome/CDP | `npm.cmd --prefix .\react-app run test:navigation` | Menús, enlaces, registro/login, compra/pedidos, CRUD, roles y páginas representativas | Firefox, Safari ni backend |

No instalar navegadores ni paquetes adicionales para ocultar un fallo. Si Chrome no inicia por restricciones del entorno, registrar el error y repetir solamente con autorización; no contar el intento bloqueado como aprobado. La suite de navegador usa un perfil temporal y un puerto propio, sin tocar el perfil habitual.

## Diecisiete casos demostrables nuevos en Jasmine/Karma

Fuente ejecutable: `react-app/tests/jasmine/commerce.spec.tsx`. Se conservan también las suites anteriores de productos, carrito, checkout, registro, login, sesión y componentes.

| Caso | Preparación / acción | Resultado esperado | Criterio |
|---|---|---|---|
| EP2-01 | Datos vacíos y datos de retiro válidos | Rechazo inicial; aceptación válida | Validación / condiciones |
| EP2-02 | Domicilio sin región o comuna incompatible | Rechazo; domicilio coherente aceptado | Reglas de entrega |
| EP2-03 | Storage mock con usuario y dirección | Autocompleta identidad y domicilio | Persistencia / datos |
| EP2-04 | Visitante sin cuenta | Campos inicialmente vacíos | Condición de sesión |
| EP2-05 | Carrito con producto y entrega inválida | No guarda orden ni vacía carrito | Regresión / error |
| EP2-06 | Rechazo, aprobación y reintento del mismo ID | Una orden con entrega; carrito vacío | Estados / idempotencia |
| EP2-07 | Pedido propio, cuenta ajena y visitante | Solo el propietario obtiene el pedido | Permisos de consulta |
| EP2-08 | Vendedor consulta y pretende cambiar estado | Consulta permitida; cambio rechazado | Condiciones por rol |
| EP2-09 | Administrador cambia a Enviado e inventa otro estado | Cambio válido; rechazo del arbitrario | Regla de negocio |
| EP2-10 | Cliente intenta alta y JSON de usuarios corrupto | Rechazo sin sobrescritura | Errores / seguridad proporcional |
| EP2-11 | Administrador crea Vendedor y repite identidad | Alta válida; duplicado rechazado | CRUD de usuarios |
| EP2-12 | Renderizar ficha con ID real | Nombre e imagen del producto | Renderizado / props |
| EP2-13 | Renderizar ficha con ID inexistente | Mensaje y acceso al catálogo | Renderizado condicional |
| EP2-14 | Entrega de retiro y evento cambio a domicilio | Dirección oculta; callback con valor nuevo | Props / eventos |
| EP2-15 | Tarjeta recibe producto y callback; clic en compra | Callback con ID/precio y estado Añadido | Props / evento / state |
| EP2-16 | Cuenta autenticada usa otro correo como destinatario | La entrega cambia, la propiedad del pedido sigue en la cuenta | Identidad / regresión |
| EP2-17 | Ruta `constructor.html` | Página no encontrada, sin acceso a propiedades heredadas | Ruta inválida / regresión |

Mocks: `StoragePort` con Map y espías Jasmine, reloj inyectable del checkout y callbacks espiados. Los componentes se montan/desmontan con `act` y `createRoot`. Nunca se modifican productos base para demostrar CRUD: los repositorios clonan datos y las pruebas usan storage efímero.

## Regresión de navegador

La matriz de menús mantiene ocho rutas iniciales, tres categorías, temas claro/oscuro y nueve anchos de 360 a 1440 px. Verifica hover/clic/touch emulado, Enter/Espacio/Tab/Escape, foco, geometría horizontal, IDs, destinos React/legado y navegación de historial. Los nuevos casos recorren registro, login, filtros, compra rechazada/aprobada, consulta de pedido, accesos denegados, CRUD de un producto temporal y un Vendedor. La matriz adicional recorre contenido, ficha, carrito y consulta del vendedor en móvil/tablet/escritorio y ambos temas.

Las pruebas actualizadas de rutas ahora esperan páginas React; se conservan las verificaciones de existencia de los HTML originales. Las expectativas de roles/login apuntan al nuevo panel React. No se eliminaron casos para aprobar: los destinos cambiaron por la migración autorizada. El detalle mantiene comprobaciones de ID, nombre, categoría e imagen para las dos implementaciones.

## Análisis de fallos y límites

Incidencias detectadas durante esta implementación: resolución de imports TypeScript desde Node, una expectativa antigua de rutas, una regla ESLint por actualizar estado en un efecto y el arranque restringido de Chrome. Se corrigieron imports y expectativas, se inicializó el formulario al montar por cuenta y se repitió Chrome con autorización. El resultado final debe confirmarse con el informe fechado, sin sustituirlo por este relato.

Persisten límites: no hay cobertura instrumentada; la emulación touch no es prueba física; el control de roles no es seguridad de servidor; el legado conserva implementaciones paralelas; las comprobaciones de geometría de menús son principalmente horizontales y no acreditan todos los niveles de zoom/alturas. La concurrencia de compras depende de Web Locks cuando está disponible y no equivale a transacciones centralizadas.

Pendientes manuales externos: Duoc, Firefox, Safari, dispositivos físicos, zoom 200 %, alturas bajas, recorrido completo por teclado/lector de pantalla y contraste visual detallado. Confirmar además el formato del documento de cobertura exigido por la rúbrica oficial completa.
