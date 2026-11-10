# Informe de aceptación EP2 · 10 de noviembre de 2026

Preparación local en rama `react`. No se realizaron commit, push, merge, reset, rebase ni cambio de rama. La fuente de requisitos de esta implementación es el encargo del usuario; el documento oficial completo no está disponible en el repositorio. No se calcula nota ni porcentaje de rúbrica.

## Matriz de cumplimiento

COMPLETO significa implementación y evidencia local del alcance indicado, no seguridad de producción ni aprobación del profesor.

| Requisito | Estado | Evidencia concreta / límite |
|---|---|---|
| Componentes React reutilizables, props/state | COMPLETO | App, Header/Navbar/Footer, ProductCard, TextField, DeliveryForm; Jasmine de renderizado, eventos y condiciones |
| Fuente de productos, CRUD y persistencia | COMPLETO | productRepository/productStore, GestionProductos; Jasmine PRO y recorrido Chrome de alta/edición/eliminación de producto temporal |
| Quince productos y recursos protegidos | COMPLETO | Datos base sin cambios; comparación de recursos contra Git y catálogo React/legado |
| Categorías, búsqueda, filtros y ofertas | COMPLETO | Productos: categoría, texto, orden, estado vacío, limpiar y marca de oferta al precio publicado; Chrome |
| Ficha React por ID | COMPLETO | ProductoDetalle, variantes/cantidad, ID inexistente, ProductCard reutilizada; Jasmine EP2-12/13/15 y destinos de Chrome |
| Registro, login y logout | COMPLETO | Validación y usuarios locales; registro solo Cliente; sesión, rutas por rol y conservación de carrito; Jasmine/Node/Chrome |
| Navegación por roles | COMPLETO | RequireRole y servicios de gestión; Cliente denegado, Vendedor consulta, Administrador gestiona; protección exclusivamente frontend |
| Carrito y checkout | COMPLETO | Variantes/cantidad, totales, dirección/contacto/entrega, autocompletado, rechazo/aprobación y reintento; Jasmine PAG/EP2 y Chrome |
| Pedidos y gestión | COMPLETO | Pedidos: propiedad por cuenta, detalle, consulta por Vendedor y estado por Administrador; EP2-07/08/09/16 y Chrome |
| Contenido público React y legado conservado | COMPLETO | Nosotros/Blog y artículos renderizados desde contenido original; Contacto simulado y versiones HTML conservadas |
| Responsive y temas | PARCIAL | Chrome en anchos representativos, ambos temas, teclado de menús e inspección de capturas. No sustituye dispositivos físicos, lector de pantalla ni todos los niveles de zoom/alturas |
| Compatibilidad integral con todo el legado | PARCIAL | Páginas originales conservadas, recursos copiados y menús comprobados. No se certifica cada función de los 23 HTML en todos los navegadores |
| Testing Jasmine/Karma, Node y navegador | COMPLETO | Suites ejecutables y reportes actuales; sin porcentaje instrumentado de cobertura |
| README, ERS V2 y documentación de pruebas | COMPLETO | README raíz/React, ERS-V2, TESTING-EP2, GUIA-DUOC y este informe; contraste de formato oficial pendiente |
| Presentación y defensa | PARCIAL | Guion Markdown de 15 minutos, notas y banco de preguntas de 5 minutos. Sin PPTX generado ni ensayo presencial acreditado |
| ZIP del frontend | PENDIENTE DE REGISTRO FINAL | Se generará únicamente tras la revisión del inventario y verificación SHA256 |
| Ejecución en Duoc / instalación desde cero | NO VERIFICABLE | Copia aislada local con dependencias existentes; no se probó físicamente en Duoc ni se repitió npm ci |
| Repositorio público frontend y entrega académica | PARCIAL | Repositorio remoto existente; cambios actuales aún locales y sin publicar por restricción del usuario |
| Merge a main | PENDIENTE | Requiere revisión, autorización y confirmación de requisitos pendientes; no se ejecutó |

## Evidencia de pruebas

Los resultados actuales se incorporan al cierre desde los JSON realmente generados; no se toman de los antecedentes de noviembre 9. Build incluye TypeScript. Lint y Node se ejecutaron también en una copia fuente aislada sin salidas previas. Las dependencias instaladas se reutilizaron mediante junction, sin descargas; no equivale a una instalación nueva desde el registro npm.

La suite existente de menús mantiene todos sus criterios y añade destinos React sin retirar las comprobaciones del legado. Nuevos casos: entrega y propiedad del pedido, permisos de consulta/edición, gestión de usuarios, eventos/estado/renderizado y ruta desconocida especial. Se actualizaron expectativas antiguas de navegación porque las pantallas ahora están migradas, no para omitir comprobaciones.

Incidencias reales resueltas durante la ejecución: import de TypeScript incompatible con Node directo; regla ESLint por setState en efecto; selectores incorrectos de prueba; espera de historial/confirmación; carga de imágenes todavía pendiente; 404 de icono del sitio. El primer arranque de Karma falló dentro del entorno restringido de Windows; con autorización se repitió fuera del aislamiento y pasó. No se bajaron criterios para ocultar fallos. La primera navegación completa no se aprobó: los registros finales sustituyen los resultados fallidos, que se documentan aquí.

## Conservación y privacidad

- Diecinueve recursos binarios originales sin cambios frente a sus blobs Git; textos protegidos comparados normalizando los finales de línea usados por Git.
- `products.ts`, `Sitio Old/productos.js` y AGENTS sin cambios de contenido. Imágenes y video no se modificaron.
- Los 23 HTML antiguos solo reciben un enlace de icono al logo existente, sin modificar contenido, formularios ni estilos.
- Documento personal de continuidad intacto y ahora excluido expresamente mediante `.gitignore`; no se incluye en ZIP.
- No se copian skills privadas, configuración de cuentas, autenticación, sesiones, caches ni dependencias instaladas.
- Una ruta personal en un registro histórico se reemplazó por “raíz del repositorio”, sin alterar sus resultados anteriores.
- ZIP construido mediante lista de carpetas permitidas, filtro de extensiones/nombres y búsqueda de patrones de secretos/rutas. No es garantía de detección de todos los secretos; las credenciales existentes incluidas son académicas y están documentadas como públicas de demostración.

## Riesgos y límites

Sin backend no existen autenticación/autorización real, contraseñas protegidas, reserva transaccional de stock, sincronización entre equipos ni pagos/envíos reales. localStorage es editable por el usuario. La protección de rutas es demostrativa; los datos personales deben ser ficticios. La concurrencia entre compras React utiliza Web Locks cuando está disponible, no transacciones de servidor. El HTML antiguo conserva patrones de renderizado que deben revisarse por separado antes de cualquier uso de producción.

Pendientes externos: rúbrica oficial completa y formato de entrega, Firefox, Safari, dispositivos físicos, Duoc, zoom y alturas bajas, lector de pantalla/contraste exhaustivo, ensayo de presentación y revisión por el equipo. No se afirma equivalencia visual pixel a pixel ni ausencia absoluta de regresiones por suites aprobadas.

## Preparación de integración

Consulta remota realizada en modo lectura: `main` sigue en `c601b8d`, `react` en `4fa2703`. main es antecesora de react con nueve commits exclusivos de react; las dos ramas feature listadas no tienen commits exclusivos pendientes frente a react. Esto no revela cambios no publicados por otros integrantes.

Procedimiento propuesto: revisar matriz/documentos/ZIP y aportes del equipo → completar verificaciones externas prioritarias → aprobar exactamente los archivos del inventario → autorizar commit técnico en react → consultar de nuevo remoto y ejecutar pruebas sobre esa revisión → autorizar integración con main. Si la relación de ancestros sigue igual, un avance directo es técnicamente posible. Si cambian ramas/remoto, reevaluar antes de integrar. No hacer merge por iniciativa del agente.

Recomendación: preparado para revisión técnica y académica; no declarar cierre total ni autorizar merge automáticamente mientras sigan pendientes los criterios externos y la revisión del equipo.
