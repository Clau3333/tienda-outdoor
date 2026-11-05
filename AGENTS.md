
# ALBEDO Outdoor — Instrucciones del proyecto

## 1. Identidad del proyecto

Proyecto académico de Duoc UC para la asignatura Fullstack II.

Nombre: ALBEDO Outdoor.

Tipo: tienda web de productos outdoor y montaña.

Repositorio:
https://github.com/Clau3333/tienda-outdoor

Rama de desarrollo React: react.

Tecnologías previstas:
- React.
- TypeScript.
- Vite.
- HTML y CSS.
- Bootstrap según los requisitos y configuración del proyecto.
- React Router DOM para navegación.

No incorporar tecnologías adicionales sin justificación y autorización.

## 2. Objetivo académico

Migrar la tienda original desarrollada con HTML, CSS y JavaScript hacia una aplicación React con TypeScript.

La migración debe conservar el diseño, la identidad visual y las funcionalidades originales, incorporando los requisitos de la Evaluación Parcial 2.

Antes de desarrollar, revisar los documentos oficiales de la evaluación, rúbrica, anexos e instrucciones del profesor que estén disponibles.

No inventar requisitos ni afirmar que un criterio está cumplido sin verificarlo.

Si falta la rúbrica oficial, señalarlo y no reemplazarla por suposiciones.

## 3. Diseño aprobado

Identidad visual:
- Blanco.
- Carbón.
- Naranja.

Nombre de la tienda: ALBEDO.

Logo aprobado: nombre ALBEDO, con detalle de nieve en la letra D.

Texto de portada:
"Comienza hoy tu aventura".

Inspiración visual:
- The North Face.
- Marmot.

Organizar los productos por categorías, manteniendo una presentación ordenada.

REGLA OBLIGATORIA:

No aumentar, reducir, recortar, reemplazar ni modificar tamaños o proporciones de imágenes existentes sin autorización explícita del usuario.

No rediseñar elementos previamente aprobados sin autorización.

## 4. Estructura del proyecto

La carpeta "Sitio Old" contiene la versión anterior de la tienda.

La carpeta "react-app" corresponde a la migración React.

Antes de modificar archivos:
- Inspeccionar la estructura real.
- Revisar el código existente.
- Identificar componentes y páginas implementados.
- Evitar duplicar archivos y funcionalidades.
- No reconstruir desde cero lo que ya funciona.
- Utilizar el sitio original como referencia para preservar funcionalidades y diseño.

No modificar "Sitio Old" salvo autorización expresa.

## 5. Instrucciones del profesor: React

El profesor indicó:

- Migrar el sitio original a React.
- Utilizar componentes reutilizables.
- Crear páginas mediante componentes React.
- Centralizar la información de productos.
- Implementar navegación mediante React Router DOM.
- Mantener Header, Navbar y Footer compartidos.
- Actualizar el contenido central según la ruta.
- Utilizar props y estados cuando corresponda.
- Mantener estilos coherentes.
- Comprender las decisiones técnicas implementadas.

Aplicar estas instrucciones de acuerdo con el estado real del proyecto.

## 6. Componentes reutilizables

Priorizar componentes para elementos repetidos, por ejemplo:

- Header.
- Navbar.
- Footer.
- Botones.
- Campos de texto.
- Tarjetas de productos.

Los componentes deben:
- Evitar duplicación innecesaria.
- Tener responsabilidades claras.
- Recibir props cuando corresponda.
- Mantener estilos consistentes.
- Ser fáciles de comprender y reutilizar.

No crear componentes excesivamente complejos cuando una solución sencilla sea suficiente.

## 7. Páginas y navegación

Migrar las páginas existentes a componentes React.

Utilizar React Router DOM para gestionar las rutas de navegación cuando corresponda.

El encabezado, la navegación principal y el pie de página deben poder compartirse entre páginas.

El contenido principal debe cambiar según la ruta seleccionada.

Verificar:
- Navegación entre páginas.
- Enlaces.
- Botones.
- Navegación Atrás y Adelante.
- Rutas directas.
- Recarga de páginas.
- Funcionamiento responsive.

No inventar rutas ni eliminar páginas existentes.

## 8. Catálogo de productos

Centralizar los datos de productos en un archivo TypeScript dentro de una carpeta data, respetando la estructura existente.

Cada producto debe contener los atributos que requiera la evaluación, incluyendo cuando corresponda:

- Identificador único.
- Nombre.
- Descripción.
- Precio.
- Categoría.
- Ruta de imagen.

Utilizar interfaces o tipos TypeScript para representar los productos.

Renderizar tarjetas mediante los datos centralizados.

Permitir acceder al detalle de un producto utilizando su identificador cuando corresponda.

No modificar productos, imágenes o precios existentes sin autorización.

Organizar las categorías de forma coherente.

## 9. Login y registro

El profesor solicitó implementar un login local utilizando información de usuarios desde un archivo local.

Antes de implementar, verificar el formato exacto exigido por la evaluación.

Distinguir entre autenticación académica simulada y autenticación real de producción.

No utilizar credenciales reales ni presentar archivos accesibles desde el frontend como almacenamiento seguro.

Mantener las validaciones aprobadas para ALBEDO.

Reglas de contraseña previamente solicitadas:
- Mínimo 10 caracteres.
- Incluir letras.
- Incluir al menos un número.
- Incluir al menos un carácter especial.

Mantener la opción "Recuperar clave" si forma parte del diseño o funcionalidad previamente aprobados.

Respetar los campos de registro y dirección existentes.

No incorporar Google Maps sin autorización.

## 10. Modo nocturno

El usuario solicitó considerar un modo nocturno para ALBEDO.

Estado: mejora opcional aprobada conceptualmente, pendiente de implementación.

Requisitos propuestos:
- Alternar entre modo claro y nocturno.
- Mantener identidad visual.
- Conservar tamaños de imágenes.
- Mantener contraste y legibilidad.
- Permitir recordar la preferencia mediante localStorage si se aprueba su implementación.

No priorizar esta característica por encima de los requisitos obligatorios de evaluación.

No modificar el tema actual sin autorización para implementarlo.

## 11. Forma de trabajo

Aplicar las reglas de la skill claudio-workflow cuando esté disponible.

Prioridades:
- Trabajar paso a paso cuando el usuario solicite acompañamiento.
- Explicar de manera sencilla.
- Esperar confirmación entre pasos.
- No repetir preguntas previamente respondidas.
- Entregar archivos completos cuando se solicite código para copiar y pegar.
- No eliminar funcionalidades existentes.
- No modificar elementos ajenos al cambio.
- Respetar decisiones aprobadas.
- No afirmar verificaciones que no se hayan ejecutado.

## 12. Verificación

Aplicar las reglas de web-change-verification cuando esté disponible.

Después de modificar código:
- Revisar el cambio realizado.
- Ejecutar los scripts disponibles de compilación y lint cuando corresponda.
- Comprobar TypeScript.
- Verificar importaciones.
- Revisar navegación.
- Comprobar formularios.
- Detectar posibles regresiones.
- Verificar responsive.
- Revisar que no se modificaron imágenes accidentalmente.
- Comprobar los criterios aplicables de la rúbrica.

Informar las pruebas que no pudieron ejecutarse.

## 13. Git y GitHub

Antes de trabajar:
- Identificar la rama activa.
- Revisar el estado de Git.
- Respetar los cambios existentes.
- Evitar conflictos con trabajo de otros integrantes.

No ejecutar commit, push, merge, reset destructivo ni eliminar ramas sin autorización expresa.

Priorizar el desarrollo en la rama correspondiente.

No modificar main sin autorización.

## 14. Defensa académica

El profesor puede preguntar por qué se tomó una determinada decisión técnica.

Por ello, cada implementación debe poder justificarse.

Comprender:
- Por qué utilizamos React.
- Por qué utilizamos TypeScript.
- Para qué sirven los componentes.
- Qué función cumplen las props.
- Cómo funciona useState.
- Para qué sirve React Router DOM.
- Por qué centralizamos los productos.
- Por qué reutilizamos Header y Footer.
- Cómo funcionan las validaciones.
- Qué pruebas se realizaron.

Preferir código comprensible y soluciones que puedan explicarse durante la evaluación.

## 15. Pruebas unitarias

El profesor mencionó las pruebas unitarias durante la explicación de la Evaluación Parcial 2.

También señaló que su tratamiento práctico sería limitado en esta instancia.

No concluir que están descartadas solamente por esa explicación.

Consultar la rúbrica oficial vigente antes de decidir su alcance.

## 16. Prioridades de desarrollo

Orden recomendado:

1. Revisar el proyecto actual y la rúbrica.
2. Comparar la versión antigua y React.
3. Identificar funcionalidades implementadas y pendientes.
4. Completar componentes y páginas.
5. Implementar navegación.
6. Centralizar los datos.
7. Implementar formularios y login local.
8. Verificar requisitos restantes.
9. Ejecutar comprobaciones técnicas.
10. Preparar defensa académica.
11. Considerar mejoras opcionales.

Adaptar este orden si los requisitos o el estado real del proyecto lo justifican.

## 17. Requisitos oficiales de la Evaluación Parcial 2

Requisitos oficiales comunicados por Claudio para incorporar a la documentación académica del proyecto. Esta sección complementa las instrucciones anteriores y no acredita que los requisitos ya estén implementados o verificados.

### 17.1. Migración y componentes React

- Migrar el sitio a componentes React reutilizables.
- Utilizar props para comunicar y configurar componentes, y estados para gestionar los datos y la interacción cuando corresponda.
- Conservar las páginas, funcionalidades e identidad visual anteriores durante la migración.

### 17.2. Fuente de datos simulada, CRUD y persistencia

- Implementar una fuente de datos simulada con operaciones CRUD: crear, consultar, actualizar y eliminar.
- Incorporar persistencia e integrar los datos y sus operaciones con los componentes React.
- Verificar que los cambios realizados mediante los componentes se reflejen en los datos y se conserven conforme al mecanismo de persistencia utilizado.
- Confirmar en la documentación oficial el alcance de las entidades y el mecanismo exigido antes de implementarlos; no asumir que se requiere un backend o una base de datos real.

### 17.3. Interfaz responsive y flujo de compra

- Utilizar Bootstrap para el diseño responsive, conservando el diseño aprobado y las restricciones sobre imágenes.
- Implementar y verificar la navegación, las categorías de productos, el carrito y el checkout o finalización de compra.
- Conservar las funcionalidades existentes relacionadas con estos flujos.

### 17.4. Pruebas unitarias con Jasmine y Karma

- Implementar pruebas unitarias utilizando Jasmine y Karma.
- Considerar diez pruebas unitarias para alcanzar el máximo desempeño indicado para la evaluación.
- Verificar su ejecución y registrar los resultados reales; la cantidad de pruebas por sí sola no acredita su aprobación ni el cumplimiento completo.
- Esta precisión complementa la sección 15: el tratamiento práctico limitado mencionado anteriormente no elimina el requisito de pruebas unitarias con estas herramientas.

### 17.5. Documentación académica de entrega

- Elaborar el documento ERS V2 para reflejar los requisitos y el estado real de la aplicación React.
- Elaborar el documento de cobertura de pruebas, relacionando las funcionalidades o requisitos evaluados con los casos de prueba y sus resultados comprobados.
- Distinguir requisitos implementados, pendientes y no verificados; no declarar cobertura total sin evidencia.
- Conservar los documentos de la evaluación anterior como antecedentes, sin confundirlos con las entregas de la Evaluación Parcial 2.

### 17.6. Presentación y defensa técnica

- Preparar la presentación del proyecto y la defensa técnica de la Evaluación Parcial 2.
- Explicar la migración, los componentes, las props, los estados, la fuente simulada, las operaciones CRUD, la persistencia, Bootstrap, la navegación y el flujo de compra.
- Explicar las pruebas realizadas con Jasmine y Karma y su relación con el documento de cobertura y el ERS V2.
- No asumir duraciones, formatos ni criterios de puntuación adicionales que no se hayan confirmado en las instrucciones oficiales.

Mantener la revisión de la rúbrica y los anexos oficiales para precisar los detalles no incluidos en esta comunicación. Esta actualización documental no autoriza por sí sola cambios de código, instalación de dependencias ni operaciones de Git.

## Regla final

ALBEDO debe conservar su identidad visual y las funcionalidades previamente desarrolladas.

Toda modificación debe estar justificada, respetar las instrucciones del usuario y considerar la rúbrica vigente.

No sacrificar requisitos obligatorios por mejoras opcionales.

Priorizar una aplicación funcional, mantenible, comprensible y defendible.
