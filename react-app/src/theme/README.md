# Tema global de ALBEDO

`ThemeProvider` se monta por encima de `BrowserRouter` en `main.tsx`. Las páginas
deben reutilizar el Header, Navbar y Footer de `App`, sin montar otro provider
al cambiar de ruta.

Los componentes que necesitan conocer o cambiar el tema utilizan `useTheme()`
desde `ThemeContext.ts`. Los estilos utilizan las variables `--albedo-*` de
`index.css`. El atributo `data-bs-theme` en el elemento `html` mantiene alineados
Bootstrap y los componentes propios. Las tarjetas, formularios y menús futuros
deben usar clases de Bootstrap sensibles al tema y estas variables; evitar
colores fijos como `bg-white` o `text-dark` para superficies que cambian de tema.

La preferencia actual corresponde a un visitante: `albedo:theme:guest`.
El script inicial de `index.html` lee esa misma clave antes del primer render.
Sin una preferencia válida se utiliza modo claro. Si localStorage está bloqueado,
el cambio funciona en memoria, sin garantizar persistencia ni sincronización.

El evento `storage` recupera cambios de otras pestañas, incluida la eliminación
de la preferencia. No se modifican claves de sesión, usuarios ni carrito.

Cuando exista autenticación real, se podrá proporcionar su identificador estable
mediante `ThemeProvider userId={id}`. `getThemeStorageKey(id)` separa esa preferencia
de las del visitante y otros usuarios. No existe conexión actual con autenticación,
ni migración automática de preferencias. Al incorporar autenticación deberá
revisarse también la inicialización previa al render para seleccionar ese ámbito.

Solo Inicio está migrado. Sus direcciones `/` e `/index.html` usan React Router.
Los enlaces restantes abren los archivos existentes bajo `/Sitio%20Old/` mediante
el plugin `tools/legacySite.ts`. En desarrollo los sirve en lectura; al compilar
copia únicamente recursos web al directorio de salida. Los originales permanecen
intactos. Las páginas antiguas conservan sus propios estilos y todavía no consumen
el tema React. Al migrar cada página se debe reemplazar su enlace por un `Link`
y registrar únicamente su ruta aprobada.

`Header` acepta `cartCount` como prop opcional para la integración futura del
carrito; no genera un contador ficticio ni lee sesiones antiguas.

`npm run test:theme` ejecuta pruebas de lógica con el runner incorporado en Node
(Node 24 en esta revisión). Los eventos y storage se simulan; estas pruebas no
sustituyen la comprobación en dos pestañas reales ni la suite académica requerida
con Jasmine y Karma. Ejecutar también `npm run build` y `npm run lint`.
