# Presentación EP2 · guion editable de 15 minutos

Formato alternativo en Markdown, listo para trasladar a diapositivas. Incluye notas y acciones; no se presenta como un PPTX renderizado ni como ensayo ejecutado. Identidad sugerida: blanco/carbón/naranja ALBEDO, sin alterar imágenes originales. Fuente de los hechos: código y reportes del proyecto; no usar cifras de cobertura porcentual.

## 1. ALBEDO Outdoor · 0:00–1:00

En pantalla: tienda outdoor; migración de HTML a React; prototipo frontend académico.

Notas: explicar que la evaluación mide implementación y defensa. El pago es simulado y los datos son locales. Abrir Inicio y mostrar identidad conservada.

## 2. Arquitectura · 1:00–2:15

En pantalla: App/rutas → páginas/componentes → servicios → datos/localStorage. Sitio Old se conserva mediante plugin Vite.

Notas: señalar App.tsx, Header/Navbar/Footer compartidos. Explicar responsabilidad única y por qué preservar el legado evita perder funciones mientras se verifica la migración.

## 3. Componentes, props y eventos · 2:15–3:30

En pantalla: ProductCard recibe `product` y `onAdd`. TextField conecta etiqueta/error.

Notas: mostrar tipo Product, callback y evento de compra. Props transmiten datos; state conserva selección, feedback y estados de formulario. No manipular manualmente el DOM controlado por React.

## 4. Catálogo y CRUD · 3:30–5:00

En pantalla: productos base → productRepository → productStore → catálogo/menú/ficha.

Notas: demostrar un producto nuevo temporal, editar y eliminar. No modificar productos originales. Mostrar persistencia tras recargar y conservación ante JSON inválido. Explicar ID estable y validaciones.

## 5. Búsqueda y navegación · 5:00–6:00

En pantalla: búsqueda, categorías, orden y ofertas; ficha por ID; error de ID desconocido.

Notas: diferenciar categoría de detalle. Las ofertas son marcas al precio publicado, sin rebajas inventadas. Mostrar filtro vacío y limpieza.

## 6. Formularios y roles · 6:00–7:30

En pantalla: registro Cliente; login desde usuarios locales; Administrador y Vendedor.

Notas: explicar RUT/DV, dominios, dirección dependiente y contraseña. Mostrar acceso denegado a una ruta administrativa para Cliente. Aclarar que localStorage se puede manipular: falta backend para autorización real.

## 7. Compra completa · 7:30–9:30

En pantalla: variante/cantidad → carrito → autocompletado → domicilio/retiro → rechazo → reintento → aprobación → pedido.

Notas: demostrar que el rechazo conserva carrito. La orden se guarda antes de limpiar; un reintento no duplica el intento. Mostrar resumen/entrega y consulta por actor. No hay cobro ni envío real.

## 8. Bootstrap, responsive y accesibilidad · 9:30–10:30

En pantalla: grid y formularios responsive; tema; foco y teclado.

Notas: mostrar viewport móvil, abrir categoría, Tab/Enter/Escape y foco visible. Bootstrap no prueba responsive por sí solo; mencionar pruebas reales y límites físicos/navegadores pendientes.

## 9. Jasmine y Karma · 10:30–12:30

En pantalla: Jasmine expresa expectativas; Karma ejecuta en Chrome. Selección de diez casos EP2-01 a EP2-15.

Notas: ejecutar suite antes de la exposición y conservar JSON. Mostrar validación, storage mock, rechazo/aprobación, permiso, renderizado, props, callback y estado. Explicar al menos diez casos usando docs/TESTING-EP2.md. Usar el total de la ejecución actual, no una cifra memorizada de otra etapa.

## 10. Evidencia y límites · 12:30–13:30

En pantalla: build/TypeScript, lint, Jasmine/Karma, Node y Chrome son verificaciones diferentes.

Notas: no confundir casos aprobados con cobertura de líneas. Describir un fallo encontrado, causa, corrección y repetición. Firefox, Safari, equipos físicos y Duoc requieren evidencia propia.

## 11. Git y entrega · 13:30–14:15

En pantalla: rama react; main protegida; README/ERS V2/testing/ZIP.

Notas: explicar diff, status, commit, push y merge sin ejecutarlos durante la demostración. Revisar aportes del equipo antes de integrar. Skills privadas y continuidad no se publican.

## 12. Resultado y próximo paso · 14:15–15:00

En pantalla: frontend demostrable, datos locales, límites documentados, aceptación antes de merge.

Notas: presentar solo lo verificado en el informe final. No afirmar seguridad de producción ni cumplimiento total de rúbrica sin contraste oficial. Pasar a preguntas.

## Defensa · banco para cinco minutos

1. **¿Por qué React?** Componentes reutilizables, UI declarativa y estado ligado a datos; no elimina la necesidad de validar ni probar.
2. **¿Props y state?** Props son entradas; state representa valores que cambian en una instancia. ProductCard recibe producto y administra su selección/feedback.
3. **¿Responsabilidad única?** La tarjeta presenta/interactúa; el repositorio valida y persiste; la página compone el flujo.
4. **¿TypeScript valida localStorage?** No. Los tipos se eliminan al ejecutar; los servicios validan los datos leídos.
5. **¿Por qué mock?** Para reproducir corrupción, cuota agotada y errores sin tocar datos reales.
6. **¿Jasmine es Karma?** No: Jasmine define suites/expectativas; Karma las ejecuta en navegador.
7. **¿100 % de cobertura?** No se midió cobertura de líneas/ramas. Hay una matriz funcional y resultados de casos concretos.
8. **¿Pago real?** No; aprobación/rechazo y recuperación son simulados y no solicitan datos bancarios.
9. **¿Roles seguros?** Solo demostrativos en frontend. Un servidor debe autorizar cada operación en producción.
10. **¿Persistencia entre computadores?** No: localStorage depende del perfil y origen. Compartir backend sería otro alcance.
11. **¿Por qué conservar HTML?** Para mantener funciones y referencias mientras se verifica equivalencia; no equivale a duplicar indefinidamente mejoras.
12. **¿Merge inmediato?** No: exige revisión de requisitos, pruebas actuales, aportes del equipo y autorización.
