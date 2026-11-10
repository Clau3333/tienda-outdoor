# ERS V2 · ALBEDO Outdoor

Versión de trabajo: 10 de noviembre de 2026. Frontend académico con persistencia local. Esta versión complementa, sin sustituir ni borrar, los antecedentes ERS V1 y el anexo EP1 conservados en Sitio Old.

## Propósito, alcance y fuentes

Migrar la tienda HTML a componentes React reutilizables y demostrar interfaces, navegación, CRUD, persistencia y testing. Fuente de esta etapa: requisitos EP2 comunicados por el usuario el 10 de noviembre. La rúbrica oficial completa y la aprobación del profesor deben contrastarse antes de atribuir cumplimiento ponderado. La referencia comunicada es 100 puntos, implementación 40 y demostración/explicación 60; no se calcula puntuación sin criterios oficiales verificables.

Actores: visitante, Cliente, Vendedor y Administrador. Sistema externo real: ninguno para pagos, envío o autenticación. Navegador/localStorage actúa como fuente simulada; todos los roles son demostrativos.

## Requisitos funcionales y trazabilidad

| ID | Requisito y criterio de aceptación | Implementación / pruebas |
|---|---|---|
| RF-01 | Header, Navbar, Footer y tarjetas reutilizables; navegación mantiene contenido y foco accesibles | App, Header, Navbar, CategoryMenu, ProductCard; components.spec y navbar.test |
| RF-02 | Quince productos originales con ID, nombre, categoría, descripción, precio, imagen y variantes sin alteraciones | products.ts, productRepository.ts; products.spec |
| RF-03 | Búsqueda, categoría, orden y ofertas con estado vacío y limpieza de filtros | Productos.tsx; recorrido Chrome EP2 |
| RF-04 | Ficha individual React por ID, selección de variante/cantidad; ID desconocido informa y permite volver | ProductoDetalle.tsx; EP2-12/13/15 y navegación |
| RF-05 | CRUD de catálogo persiste y actualiza tienda, menú y detalle; preserva datos ante errores | GestionProductos, productRepository/productStore; PRO-01 a PRO-08 y Chrome |
| RF-06 | Registro valida RUT, nombres, correo permitido, dirección, región/comuna y contraseña; rechaza duplicados | Registro, registrationValidation/Service; REG y EP2-10/11 |
| RF-07 | Login local valida credenciales; logout conserva carrito y tema; rol define navegación | Login, sessionStore/State, RequireRole; LOG/SES y Chrome |
| RF-08 | Carrito agrega variantes, cambia cantidades, elimina/vacía, recalcula totales y persiste | Carrito, cartRepository/State; CAR y Node |
| RF-09 | Checkout solicita cliente, correo, teléfono y entrega; autocompleta datos registrados y valida domicilio/retiro | DeliveryForm, commerceService; EP2-01 a EP2-05 |
| RF-10 | Pago simulado rechazado conserva carrito; aprobado guarda resumen/entrega y permite recuperación sin duplicar | checkoutService; PAG y EP2-06 |
| RF-11 | Cliente consulta sus pedidos; otros IDs no revelan pedidos ajenos | Pedidos, ordersFor; EP2-07 y navegador |
| RF-12 | Administrador gestiona productos/usuarios/estados; Vendedor consulta productos y órdenes sin editar | Panel, GestionProductos/Usuarios, Pedidos, RequireRole; EP2-08 a EP2-11 y Chrome |
| RF-13 | Nosotros y Blog conservan contenido editorial existente mediante renderizado React; contacto valida sin afirmar envío real | legacyContent.json, Contenido, Contacto; recorrido de páginas |
| RF-14 | Claro/oscuro persiste en mismo origen y reacciona a otras pestañas; legado necesario sigue accesible | ThemeProvider/themeStore, sesion.js; tema Node y Chrome |

## Reglas de negocio

- El registro público crea Cliente, nunca Administrador o Vendedor.
- Contraseña vigente: mínimo diez caracteres, letras, número y uno de los símbolos permitidos por `passwordPolicy.ts`; sin espacios. La regla de 4–10 del antecedente EP1 no se aplica automáticamente sobre la instrucción posterior aprobada.
- Un producto se identifica por ID; una variante de carrito por ID y color. Cantidad entera positiva; precio finito no negativo.
- No cambiar recursos originales, precios base, proporciones ni claves de almacenamiento sin autorización/migración.
- Una oferta es una marca comercial editable; se mantiene el precio publicado y no se simulan porcentajes de descuento inexistentes.
- La orden mantiene la identidad de la cuenta autenticada; los datos de destinatario/entrega se almacenan separadamente. El total es la suma de subtotales, sin cargos ocultos.
- El pedido se guarda antes de vaciar el carrito. Un mismo intento aprobado no produce otra orden al reintentarlo.
- El Cliente solo consulta órdenes asociadas a su correo; el Vendedor consulta todas; solo Administrador cambia estado.
- La dirección se solicita para domicilio; retiro requiere datos de contacto, sin inventar una sede física real.

## Requisitos no funcionales

| ID | Criterio | Evidencia esperada |
|---|---|---|
| RNF-01 | TypeScript estricto, servicios separados e interfaces reutilizables | Build, lint y revisión de componentes |
| RNF-02 | Responsive escritorio/tablet/móvil, sin overflow de página | Chrome con anchos registrados y revisión visual |
| RNF-03 | Formularios etiquetados, navegación por teclado, foco visible y mensajes accesibles | Jasmine de UI y recorridos de teclado |
| RNF-04 | Tema claro/oscuro legible, identidad ALBEDO protegida | Comparación visual y pruebas de tema |
| RNF-05 | Errores de lectura/escritura no destruyen datos existentes | Pruebas de storage corrupto/cuota |
| RNF-06 | Integridad de productos, imágenes y antecedentes | Comparación de datos y hashes Git |
| RNF-07 | Evidencia reproducible sin atribuir cobertura no medida | Scripts, JSON generados e informe fechado |
| RNF-08 | Entrega sin dependencias instaladas, secretos ni continuidad personal | Auditoría del ZIP e inventario |

## Modelo de datos y límites

Producto: ID, categoría, nombre, descripción, precio, imagen, colores; código/stock/stock crítico/oferta opcionales. Usuario: datos validados del registro, rol y contraseña académica local. Sesión: identidad y rol, sin copiar contraseña. Carrito: producto/variante/precio/cantidad. Orden: número, cliente, productos/subtotales, fecha, total, estado, intento simulado y entrega opcional para compatibilidad con órdenes antiguas.

No hay recuperación real de contraseña, mensajes por correo, verificación de identidad, stock reservado, sincronización central entre computadores ni transacciones de servidor. Un usuario puede manipular localStorage y su rol: no es seguridad de producción. El pago y la entrega son demostraciones. Producción exige un alcance separado de backend y seguridad.

## Aceptación y cambios

No aceptar solo por existir archivos o compilar. Revisar matriz de pruebas actual, recorrer los actores y confirmar documentos/ZIP. Pendientes externos: Firefox, Safari, dispositivos físicos, equipo Duoc y contraste final con rúbrica oficial. Conservar Sitio Old hasta acreditar equivalencia completa; no ejecutar merge sin autorización y nueva revisión remota.
