# Sistema visual compartido de ALBEDO

## Alcance y estado

Esta primera etapa establece una base global; no migra páginas comerciales.
Solo Inicio está en React, disponible en `/` e `/index.html`. Ambos accesos
utilizan el mismo Header, Navbar, Footer, estilos y proveedor de tema.
Los destinos de `navigation.ts` continúan abriendo el sitio original mediante
el puente existente. Esas páginas todavía no consumen los estilos ni el tema React.

La documentación encontrada corresponde a la Evaluación Parcial 1. Los requisitos
de Parcial 2 comunicados por Claudio están en AGENTS.md, sección 17. No se encontró
el archivo de su rúbrica oficial. Jasmine/Karma y las diez pruebas para máximo
desempeño siguen pendientes; las pruebas de Node actuales no sustituyen esa entrega.

## Dirección visual

Conservar blanco, carbón y naranja. Utilizar naranja para acciones y orientación;
superficies neutras, separadores finos y sombras suaves para ordenar la información.
Manrope define títulos; Inter, texto y controles. Ambas conservan fuentes de
respaldo para cuando Google Fonts no esté disponible.

Las variables `--albedo-*` de `index.css` son la fuente visual común:

- Colores semánticos para fondo, texto, texto secundario, superficie, menú,
  separadores, controles, foco, éxito y error, definidos en claro y nocturno.
- Espaciado de 4, 8, 12, 16, 24, 32, 48 y 64 px con tamaño raíz de 16 px.
- Radio de 6 px, ancho máximo de contenido de 1440 px y tipografía fluida.
- Controles con altura mínima de 44 px; campos de texto de al menos 48 px.
- Estados hover, foco visible, activo, deshabilitado y validación. Las transiciones
  respetan la preferencia de movimiento reducido.

Bootstrap recibe esas variables. Tarjetas, listas, tablas, campos, pestañas y
menús deben usar clases sensibles al tema; evitar `bg-white`, `text-dark` o colores
inline que impidan el cambio de tema. El color de los estados acompaña texto
explícito; nunca constituye la única explicación de un error o resultado.

## Componentes y convenciones

- `PageHeading`: título principal y descripción breve con una jerarquía común.
  Usar un solo h1 por página; ubicarlo dentro del main de esa vista.
- `Button`: variantes `primary`, `secondary` y `quiet`; admite eventos, disabled
  y atributos nativos. Su tipo predeterminado es button; para enviar un formulario
  indicar `type="submit"`. Los enlaces siguen usando Link o anclas existentes.
- `Surface`: contenedor Bootstrap card, sin efectos de navegación ni interacción
  implícita. No crear tarjetas que parezcan botones si no tienen una acción real.
- `TextField`: input con etiqueta, ayuda y error asociados mediante identificadores
  estables. Acepta value/onChange o defaultValue y propiedades nativas. No contiene
  reglas de negocio, no guarda datos ni reinicia valores al cambiar el tema.
- `albedo-stack` y `albedo-form`: distribución vertical y ancho de formularios.
- `albedo-status` con `--success`, `--error` o `--neutral`: presentación de estados
  acompañados por texto. El consumidor decide si corresponde role=status o alert.

No aplicar reglas genéricas de width, height, aspect-ratio u object-fit a imágenes.
Surface no impone dimensiones a sus hijos. Al migrar una tarjeta o detalle deben
conservarse explícitamente las dimensiones y ajustes aprobados en el sitio original.

## Integración gradual y conservación de datos

Mantener el único ThemeProvider por encima de BrowserRouter. No agregar providers
por ruta, cambiar keys según el tema ni reemplazar un formulario por otra versión
al alternarlo: el mismo componente debe conservar su estado. El detalle del tema,
storage y preferencias futuras por usuario está en `../../theme/README.md`.

No crear nuevas claves de sesión, carrito o usuarios como parte del diseño.
Una migración funcional posterior deberá respetar los contratos de almacenamiento
existentes y verificar la conservación de datos antes de sustituir cada enlace.
La permanencia de borradores al salir de una ruta debe implementarse y probarse
cuando exista ese formulario; este sistema de presentación no promete persistencia
de formularios que aún no están migrados.

Aplicación prevista, por etapas verificables:

1. Catálogo y detalle: tarjetas y títulos comunes; datos tipados, identificadores
   y recursos originales. Verificar dimensiones antes de renderizar las imágenes.
2. Login, registro y contacto: TextField y Button, conservando todas las reglas
   y campos. Aclarar la discrepancia de contraseña entre AGENTS.md y el código antiguo.
3. Carrito, checkout y pedidos: superficies, tablas responsive y estados; conservar
   datos y comportamiento antes de modificar la navegación.
4. Administración y vendedor: mismos tokens, controles y tablas; conservar permisos.

En cada etapa priorizar requisitos académicos, Jasmine/Karma, ERS V2 y cobertura
de pruebas, además de compilación, lint y comprobación de flujos. No añadir rutas
o botones de demostración como sustituto de funcionalidades pendientes.

## Verificación

Ejecutar `npm run build`, `npm run lint` y `npm run test:theme`. La suite de tema
usa storage y eventos simulados. Revisar en navegador ambos temas, recarga,
Atrás/Adelante, dos pestañas reales, foco, formularios, menús y anchos móviles/tablet.
Renderizar HTML en servidor y calcular contraste no demuestra distribución visual
ni interacción real. Registrar esas limitaciones cuando no haya navegador disponible.
