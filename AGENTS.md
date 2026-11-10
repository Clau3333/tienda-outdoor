# ALBEDO Outdoor — Instrucciones del proyecto (v2)

## 1. Identidad, objetivo y fuentes

- Repositorio: `https://github.com/Clau3333/tienda-outdoor.git`.
- Proyecto académico Duoc UC, Fullstack II, Evaluación Parcial 2: migración progresiva de ALBEDO Outdoor desde HTML/CSS/JS hacia React, TypeScript y Vite.
- **Rama autorizada de trabajo:** `react`. **Nunca modificar `main`** sin autorización expresa. Tampoco hacer commits, push, merges, borrados o resets destructivos por iniciativa propia.
- Fuentes de requisitos, en orden de importancia aplicable: instrucciones actuales del usuario; rúbrica/anexo oficial e indicaciones del profesor verificadas; código y estado de Git actuales; documentación del proyecto. Una nota histórica no sustituye el estado real.
- Leer las skills v2 `claudio-workflow` (método), `fullstack-development` (ingeniería) y `web-change-verification` (puerta de calidad) cuando estén disponibles. Las skills personales de otro computador no se consideran automáticamente instaladas aquí.

## 2. Estado y arquitectura conocidos; volver a verificar

- `react-app/`: React, TypeScript, Vite, Bootstrap y React Router. Rutas principales React históricas: `/`, `/index.html`, `/productos.html`, `/carrito.html`, `/login.html`, `/registro.html`.
- Mantener **Header, Navbar y Footer compartidos entre las páginas React**, según las instrucciones previas del profesor; actualizar el contenido central mediante React Router y reutilizar componentes, props y estado sin duplicar lógica.
- `Sitio Old/`: páginas heredadas aún utilizadas (incluidas Nosotros, Blog, Contacto, Mis pedidos, paneles y detalle de producto). No afirmar que la migración está terminada.
- Enlace de detalle heredado: `/Sitio%20Old/producto-detalle.html?id=<ID-real>`; **no** confundir el enlace a detalle con `productos.html#categoria`. Comprobar que el JS resuelva realmente el ID.
- `react-app/src/data/products.ts`: productos iniciales tipados; `react-app/src/services/productRepository.ts`: CRUD y persistencia local. Se han documentado 15 productos base de 3 categorías, pero verificar el arreglo actual antes de editarlo.
- Conservar los datos de productos centralizados y los modelos TypeScript existentes; renderizar las tarjetas desde esos datos y mantener los contratos de ID, nombre, descripción, precio, categoría e imagen. No reconstruir funcionalidades ya implementadas.
- Servicios React de carrito, login, registro, checkout y tema. LocalStorage histórico: `productosAdminAlbedo`, `usuarioSesionAlbedo`, `carritoAlbedo`, `ordenesAlbedo`, `albedo:theme:guest`. No cambiar claves/contratos sin migración justificada.
- **Requisito previo registrado del profesor:** login local utilizando información de usuarios desde un archivo local. Mantener este requisito académico y comprobar el formato y alcance exactos en las instrucciones oficiales antes de modificar su implementación. La existencia de usuarios en localStorage no acredita por sí sola el cumplimiento del requisito de archivo local; no inventar un formato ni darlo por cumplido sin evidencia.
- Tema claro/oscuro **ya implementado** en React y compatible en parte con páginas antiguas según verificaciones históricas; comprobar flujos afectados, no volver a tratarlo como pendiente absoluto.
- Conservar la preferencia y la **sincronización del tema entre páginas React, páginas antiguas y pestañas del mismo origen**, respetando las claves vigentes (incluida `albedo:theme:guest`) y `data-bs-theme`. Mantener un control de tema accesible en cada página heredada pertinente y comprobar contraste y legibilidad. Distintos puertos son distintos orígenes/localStorage; no alterar sesión, carrito ni pedidos al corregir el tema.
- El logout antiguo fue corregido históricamente para conservar el carrito; revisar el código real antes de afirmar su estado actual.
- **No existe backend ni pasarela de pago reales confirmados**: el checkout es una simulación académica. No usar credenciales reales, no afirmar autenticación o seguridad de producción.
- El plugin Vite histórico `react-app/tools/legacySite.ts` expone páginas de `Sitio Old` durante desarrollo y las copia en build. Comprobar configuración real si cambia.

## 3. Diseño y contenido protegidos

- Identidad aprobada: ALBEDO Outdoor, blanco/carbón/naranja; logo ALBEDO con nieve en la D; lema **«Comienza hoy tu aventura»**.
- Referencias visuales previas: The North Face y Marmot; son antecedentes, no autorización para rediseñar lo aprobado.
- **No modificar productos ni precios originales sin autorización explícita.** Conservar también IDs y datos aprobados fuera del alcance autorizado.
- **No agrandar, disminuir, recortar, redimensionar, sustituir ni alterar las imágenes originales o sus proporciones** sin autorización explícita. No cambiar CSS que afecte indirectamente la escala o el recorte de imágenes sin permiso.
- Preservar portada, navegación, categorías, contenido, formularios y funcionalidades aprobados. No emprender rediseños cosméticos no solicitados.
- Formularios: contraseña de al menos 10 caracteres, con letras, número y carácter especial, según instrucciones previas; preservar dirección desglosada, registro y «Recuperar clave» según implementaciones reales.
- **No incorporar Google Maps sin autorización explícita.**

## 4. Reglas de cambio y coordinación entre React y legado

1. Antes de modificar, leer `AGENTS.md`, revisar rama y `git status -sb`; inspeccionar archivos reales y el diff. No sobrescribir cambios locales existentes.
2. React es el destino prioritario de nuevas funcionalidades. `Sitio Old` se modifica **solo cuando el cambio autorizado requiere corregir una página heredada aún utilizada**. No duplicar indefinidamente cambios en ambas implementaciones. Mientras sigan utilizándose, conservar en las páginas antiguas sus secciones, enlaces, formularios, sesión, accesibilidad y funcionalidad; verificar los consumidores afectados sin afirmar que toda la migración está terminada.
3. Toda corrección de encabezado, categorías, CSS compartido, tema o navegación exige inspeccionar **todas las rutas y páginas consumidoras**: React y HTML heredado si ambos se ven afectados.
4. Para menús: apertura automática por hover de mouse en escritorio; clic/touch funcional, Tab/Enter/Espacio/Escape y foco visible; cierre al salir del panel, al cambiar de categoría o al pulsar fuera. Mostrar solo los productos de la categoría seleccionada, también en móvil; conservar la apariencia coherente React/legado y la eliminación aprobada de flechas y recuadros innecesarios en React, sin eliminar el indicador de foco. Revisar geometría, `hidden`, `aria-expanded`, `aria-controls`, `z-index`, ancho/altura y contraste de ambos temas.
5. Los enlaces de cada producto deben abrir su detalle con el **ID real**. Los finales aprobados son «Ver todas las chaquetas», «Ver todos los polares» y «Ver todos los pantalones»; deben abrir la categoría correspondiente, preferentemente en `/productos.html#chaquetas`, `#polar` o `#pantalones` cuando funcionen sus rutas y anclas React. Cualquier enlace «Ver categoría» debe seguir llevando al listado. Probar las 3 categorías, no únicamente el primer producto.
6. No asumir que basta con corregir `index.html`: verificar `productos.html` y otras páginas con navegación equivalente mediante búsqueda real en el proyecto. No inventar rutas ni eliminar páginas existentes.
7. Priorizar cambios pequeños y verificables; si una solución necesita más archivos, inspeccionarlos y explicar el impacto antes de reemplazarlos.
8. Cuando se entregue código para copiar y pegar, **cada archivo completo**, con ruta precisa. No entregar fragmentos ambiguos. En edición automática autorizada, revisar diff y pruebas antes de darlo por terminado.

## 5. Seguridad, calidad y vida útil

- Aplicar la skill de ingeniería para seguridad proporcional al alcance: sin secretos ni contraseñas reales en frontend/almacenamiento público, entradas no confiables tratadas de forma segura, dependencia y permisos revisados.
- Una tienda académica basada en localStorage **no es una aplicación segura de producción**. Si se plantea producción, diseñar por separado backend, autenticación/autorización, sesiones, almacenamiento servidor, controles OWASP, despliegue HTTPS y mantenimiento.
- Mantener responsabilidad única, componentes reutilizables, modelos tipados, rutas claras, mensajes de error y accesibilidad por teclado.
- Verificar responsive escritorio/tablet/móvil; Bootstrap presente no equivale a validación terminada.
- No añadir dependencias, desplegar servicios, instalar herramientas o ejecutar scanners invasivos sin justificación y autorización.

## 6. Comprobación técnica

Desde la raíz del repositorio, usar los scripts reales solo después de verificar `react-app/package.json`:

```powershell
npm.cmd --prefix .\react-app run build
npm.cmd --prefix .\react-app run lint
npm.cmd --prefix .\react-app run test:unit
npm.cmd --prefix .\react-app test
npm.cmd --prefix .\react-app run test:navigation
```

- Como antecedente anterior a la corrección de menús se registraron **82 Jasmine/Karma y 71 Node aprobadas**. No confundir estos resultados históricos con la ejecución posterior resumida en la sección 8 ni presentar ninguna cifra anterior como una nueva ejecución.
- Jasmine define expectativas y Karma ejecuta en Chrome. No presentar pruebas Node como Jasmine/Karma, ni atribuir cobertura porcentual no medida.
- Build React **no sustituye** revisión visual/interactiva de páginas `Sitio Old`.
- Registrar URL exacta y puerto (por ejemplo `5173`; `5174` utiliza otro origen/localStorage), tema, resolución, navegador, acciones y resultados observados.
- Revisar `git diff --check`, diff, archivos nuevos no vacíos, cambios accidentales en imágenes, enlaces y cambios funcionales relacionados.
- Estado final por criterio: **aprobado**, **falló**, **no probado**, con evidencia. No anunciar solución completa por una sola captura.
- Las pruebas de navegación actuales requieren Chrome instalado y Node compatible; no instalar herramientas por iniciativa propia. No confundir emulación touch con dispositivos físicos, límites horizontales con contención vertical completa, ni ausencia de excepciones JavaScript con ausencia de errores HTTP o de consola. Revisar altura, zoom, recorrido de teclado y navegadores según el alcance de cada cambio.

## 7. Requisitos y entrega académica

- Priorizar la rúbrica oficial EP2: componentes React reutilizables, props/state, datos tipados, CRUD/persistencia, Bootstrap responsive, navegación, carrito/checkout, pruebas Jasmine/Karma (demostración de 10 casos), análisis y documentación de testing.
- No sacrificar requisitos obligatorios por mejoras opcionales. Cada decisión técnica debe poder explicarse en la defensa: React/TypeScript, componentes, props/state, rutas, datos, validaciones, persistencia y pruebas.
- Rúbrica documentada: 100 puntos; implementación 40 y exposición/demostración 60, sujetos a comprobación con documento oficial vigente.
- Entregables documentados: repositorio GitHub público, frontend ZIP, README raíz real, **ERS V2**, documento de cobertura, presentación de unos 15 minutos y preguntas. Comprobar fecha, formatos y documentos antes de afirmar cumplimiento.
- **Conservar los documentos y antecedentes de evaluaciones anteriores**, incluida ERS V1, rúbricas y evidencias; no eliminarlos ni sustituirlos sin autorización. Utilizarlos como antecedentes para ERS V2 y distinguirlos de los entregables y resultados actuales de EP2.
- Explicar que la migración puede ser parcial y que el checkout es simulado; no inventar backend ni pagos reales.
- Frente a fallas, clasificar impacto y severidad, reproducir, hallar causa, corregir y aportar evidencia y métricas genuinas. No inventar correcciones específicas no comunicadas por el profesor.

## 8. Continuidad y estado local al recibir nuevas instrucciones

- Estado Git comprobado al actualizar este documento el **9 de noviembre de 2026**: rama `react`, HEAD local **`e611fce`**, mensaje `fix: unificar menus de categorias React y Sitio Old`. El seguimiento local mostró `react...origin/react [ahead 1]`; no se consultó ni actualizó el remoto. `AGENTS.md` tenía cambios locales y `ALBEDO_CONTINUIDAD_COMPLETA_2026-11-09.md` seguía no versionado. Volver a comprobar el estado antes de trabajar; esta nota no autoriza commit ni push.
- Vite inició históricamente en `http://localhost:5173/`. No inferir que continúa ejecutándose.
- **Menús de categorías corregidos y registrados en el commit técnico local `e611fce`**: React e Inicio/Productos antiguos conservan las tres categorías, sus fichas por ID y los finales «Ver todos»; se corrigieron hover, clic/touch, teclado, presentación compacta y acceso móvil. No volver a presentar estas correcciones como pendientes absolutos.
- **Resultado de la ejecución anterior**, según el informe de esta conversación del 9 de noviembre de 2026, no reejecutado durante esta actualización documental: build y lint aprobados; **86/86 Jasmine/Karma**, **74/74 Node** y **721/721 comprobaciones de navegador**. Estas últimas comprenden 432 escenarios de presentación/entrada/teclado, 240 aperturas de fichas, 48 enlaces de categoría y un caso de recarga/Atrás/Adelante; no son porcentajes de cobertura de la aplicación.
- Evidencia anterior: `react-app/test-results/jasmine-karma.json` y `react-app/test-results/category-navigation.json`, leídos al actualizar este documento. Navegación en **Chrome 156**, origen de prueba `http://127.0.0.1:64278`, ambos temas, altura de 900 px y anchos de 360, 480, 700, 701, 768, 900, 901, 1024 y 1440 px. Se recorrieron las seis rutas React de la sección 2 y `/Sitio%20Old/index.html` y `/Sitio%20Old/productos.html`. Los archivos `test-results` son generados e ignorados por Git: no asumir que existen al clonar ni que acreditan cambios posteriores.
- **Pendientes de verificación:** dispositivos físicos, Firefox y Safari; ampliar comprobaciones de alturas bajas/contención vertical, zoom y recorrido completo de teclado. La ejecución anterior utilizó emulación touch y no acredita ausencia total de regresiones ni la validación integral de todas las páginas antiguas.
- Documentación README/ERS V2/cobertura y defensa aún deben verificarse o completarse; no asumir cambios de Codex no confirmados.
- Siguen pendientes la revisión de otros requisitos de EP2 contra la rúbrica vigente y las comprobaciones funcionales que no tengan evidencia, incluidos paneles Administrador/Vendedor y CRUD de interfaz. Un menú corregido o suites aprobadas no acreditan por sí solos el cumplimiento completo de la evaluación.
- Las anotaciones anteriores son contexto inicial; **el repositorio y las pruebas actuales prevalecen para saber qué existe y qué funciona**.

## 9. Cierre y permisos

Antes de proponer un commit: entregar lista de archivos, diff revisable, criterios/resultado de pruebas y pendientes. Solicitar aprobación explícita para confirmar/publicar. Preservar `main`, las imágenes y todos los cambios previos. Respetar el acompañamiento **un paso por turno** cuando el usuario lo elija.
