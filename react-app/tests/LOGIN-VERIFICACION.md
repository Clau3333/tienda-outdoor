# Login React — alcance y evidencia

Actualización posterior: Registro ya está migrado a React, la contraseña ahora exige mínimo 10 y se eliminaron los indicadores verdes de formato del Login. Resultado vigente: 63/63 Node y 66/66 Jasmine/Karma. Consultar [Registro y correcciones de Login](REGISTRO-VERIFICACION.md). El contenido siguiente conserva el estado histórico de la migración inicial de Login.

## Implementación

Se migró únicamente Iniciar sesión a `/login.html`. App mantiene Header, Navbar, Footer y ThemeProvider compartidos. El enlace del Header usa React Router y marca la ruta activa.

Archivos creados: `src/pages/Login.tsx`, `src/pages/Login.css`, `src/services/loginValidation.ts`, `src/services/loginService.ts`, `src/data/demoAdministrator.ts`, `tests/login.test.mjs`, `tests/jasmine/login.spec.ts`, `tests/jasmine/loginPage.spec.tsx` y este registro.

Archivos modificados: `src/App.tsx`, `src/components/Header.tsx`, `tests/navbar.test.mjs`, `tests/cartIntegration.test.mjs`, `tests/jasmine/index.ts`, `karma.conf.cjs` y la documentación de pruebas académicas. Las pruebas de navegación se actualizaron para reconocer Login como ruta migrada, sin cambiar sus demás destinos. Karma sirve el logo original en modo de solo lectura para montar el Header sin errores 404 en las pruebas; no modifica la imagen.

No se añadieron dependencias. No se modificaron Inicio, Productos, Carrito, repositorios de productos/carrito/órdenes, pagos, estilos globales, sistema de temas ni Sitio Old.

## Compatibilidad conservada

- Correo de texto, máximo 100 caracteres, sin espacios y solo dominios `gmail.com`, `duoc.cl`, `profesor.duoc.cl`. Se conserva la comparación sin distinguir mayúsculas.
- Contraseña exactamente de 10 caracteres, sin espacios, al menos una letra (incluidas letras acentuadas admitidas), número y uno de los símbolos originales `% & $ # / ( ) = " !`. Se conserva el orden y texto de cada mensaje.
- Se conserva esta longitud exacta del sitio original, aunque AGENTS.md expresa una regla general de mínimo 10. No se cambió esa instrucción general ni se amplió la restricción del formulario durante la migración.
- Validación al escribir y al enviar, mensaje de credenciales incorrectas y confirmación de éxito. Las etiquetas, ayudas y errores se enlazan con ARIA mediante TextField. Button y los estilos Bootstrap reutilizan la infraestructura existente.
- Claves originales: `usuariosAlbedo` y `usuarioSesionAlbedo`. Se conserva la estructura del administrador de demostración y su contraseña original; solo se agrega si su correo no existe. No se reemplazan credenciales modificadas ni los demás usuarios.
- Solo las credenciales coincidentes generan sesión. El objeto conserva `run`, `nombre`, `apellidos`, `correo`, `tipoUsuario`; no incorpora la contraseña. RUN directo o reconstruido desde `rutNumero` y `digitoVerificador`, y perfiles antiguos/desconocidos tratados como Cliente, igual que antes.
- Se mantienen los 700 ms de confirmación. Cliente vuelve a `/index.html` mediante Router sin desmontar el tema. Administrador y Vendedor mantienen `/Sitio%20Old/admin.html` y `/Sitio%20Old/vendedor.html` mediante navegación completa, porque esos paneles todavía no están migrados.
- Registro conserva `/Sitio%20Old/registro.html`. No existe archivo, enlace ni implementación de recuperación de contraseña en el sitio revisado: no se inventó una ruta o un botón que aparente funcionar.
- Ante usuarios corruptos o almacenamiento bloqueado se informa el error y no se sobrescriben los datos ni la sesión anterior. Esto evita el reemplazo silencioso por el administrador inicial que podía provocar el manejo antiguo de JSON inválido.
- Los nombres se muestran como texto React, sin insertar HTML. La autenticación sigue siendo la simulación académica local existente; no es seguridad de producción.

## Pruebas ejecutadas

```powershell
npm.cmd --prefix .\react-app run build
npm.cmd --prefix .\react-app run lint
npm.cmd --prefix .\react-app test
npm.cmd --prefix .\react-app run test:unit
```

Resultados de esta etapa: build con TypeScript aprobado, lint aprobado, **55/55 Node** y **46/46 Jasmine/Karma en Chrome Headless**. Se conservan las suites anteriores; se agregan ocho casos Node y dieciséis casos Jasmine/Karma. Los resultados individuales de Karma están en `test-results/jasmine-karma.json` (generado, ignorado por Git). No se calcularon porcentajes de cobertura de código.

| Evidencia | Alcance real |
| --- | --- |
| Node: validaciones | Ejecuta el `login.js` original en VM con DOM/almacenamiento simulados y compara mensajes y precedencia contra las funciones React |
| Node: administrador y sesiones | Compara el administrador completo y la sesión serializada con los originales para Administrador, Vendedor, Cliente y perfiles heredados |
| Node: errores y rutas | Protege datos ante JSON corrupto o escrituras bloqueadas; comprueba existencia de Registro y paneles; verifica la entrada HTTP `/login.html` y enlace React del Header |
| LOG-01 a LOG-09 | Dominios, restricciones de contraseña, inicialización idempotente, credenciales modificadas, rechazo sin perder sesión previa, éxito sin contraseña en sesión, roles/RUN y errores de almacenamiento |
| LUI-01 a LUI-07 | Formulario React montado en DOM real, mensajes/ARIA, rechazo, temporizador de éxito, retorno del cliente a Inicio, Header compartido, destinos de paneles, cambio de tema sin borrar campos y error de almacenamiento |

Las pruebas usan mocks de almacenamiento: no alteran usuarios, sesiones, tema, carrito ni órdenes personales. Las redirecciones a los paneles antiguos se verifican mediante callback simulado, no navegando realmente a esos paneles. El retorno del Cliente sí se ejecuta con MemoryRouter y se comprueba el tema en el documento.

El primer montaje del Header en Karma reveló un recurso de logo no servido por el ejecutor de pruebas. Se corrigió exclusivamente su configuración de archivos/proxy; la ejecución final ya no muestra esos 404. Karma emite una advertencia de API obsoleta `util._extend` en su infraestructura de proxy; no impide las pruebas y no se ocultó ni se cambiaron dependencias fuera de alcance.

## Verificación manual pendiente

1. Abrir `/login.html` directamente y desde el menú en escritorio y móvil (360–400 px), en ambos temas. Revisar distribución, foco visible, contraste, mensajes y ausencia de desbordamiento.
2. Probar credenciales incorrectas y una cuenta Cliente realmente guardada por el Registro antiguo. Confirmar éxito, regreso a Inicio React, sesión persistida y uso de sus datos por los flujos existentes.
3. Entrar con Administrador y Vendedor y comprobar los paneles antiguos reales. Estos destinos y Registro siguen fuera de React: no se acredita continuidad visual del tema dentro de esas páginas antiguas.
4. Recargar, usar Atrás/Adelante y alternar tema entre pestañas. Se conserva el sistema global anterior, sin convertir la preferencia a una clave por usuario durante esta etapa.
5. Revisar el almacenamiento bloqueado o corrupto en un perfil de prueba y confirmar que no se eliminan datos.

El Header React sigue con sus opciones actuales; no se migró en esta etapa el script antiguo `sesion.js` que añade saludo, enlaces de rol y cierre de sesión. Tampoco se implementaron Registro, Recuperar contraseña ni paneles React. Estos alcances no se presentan como terminados.

## Evaluación

Se aporta migración de una página React, componentes reutilizables, props, estados, Router, validación, persistencia compatible y nuevas pruebas Jasmine/Karma. Queda contrastar con la rúbrica oficial EP2 no localizada en el repositorio, integrar esta evidencia al ERS V2 y documento formal de cobertura, y completar las vistas pendientes según la planificación del proyecto.
