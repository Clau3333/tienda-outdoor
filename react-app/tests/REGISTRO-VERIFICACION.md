# Registro React y correcciones de Login

Etapa del 5 de noviembre de 2026. Esta evidencia distingue pruebas automatizadas, revisión de código y verificaciones visuales pendientes; no acredita toda la Evaluación Parcial 2.

## Alcance implementado

- `/registro.html` cambia el contenido central mediante React Router y reutiliza Header, Navbar, Footer y el tema global. Los enlaces de Header y Login llevan a Registro React; Registro vuelve a Login React.
- Se conserva la distribución Bootstrap original: columna central `col-12 col-lg-8 col-xl-7`, campos en dos columnas desde `md` y una en móvil. No contiene imágenes ni modifica las existentes.
- Se conservan los 15 campos: cuerpo de RUT, DV, nombre, apellidos, correo, nacimiento, región, comuna, calle, número de domicilio, tipo de domicilio, departamento, código postal, contraseña y confirmación.
- La fecha de nacimiento sigue siendo opcional. Se conserva el mínimo de año 1900 y la prohibición de fechas futuras. No se agrega edad mínima.
- RUT: limpieza de entrada, DV mayúsculo, cuerpo de 6–8 dígitos y módulo 11, incluidos DV `K` y `0`.
- Las 16 regiones y sus comunas se copiaron exactamente del catálogo original, sin afirmar que sea un catálogo oficial completo. Cambiar región limpia la comuna anterior y la validación exige una combinación coherente.
- Domicilio: calle de 3–150 caracteres; número de 1–7 dígitos; departamento de 1–6 dígitos cuando corresponde; código postal de exactamente 7 dígitos. Elegir Casa limpia y deshabilita departamento. No se agrega Google Maps ni validación postal externa.
- Contraseña única compartida por Registro y Login: **mínimo 10 caracteres**, letras, número y un símbolo de `% & $ # / ( ) = " !`, sin espacios ni otros caracteres. Se retira el máximo de 10 de ambos formularios. No se modifica ninguna contraseña guardada.
- Login elimina las marcas verdes de formato y aclara en sus ayudas que un formato válido no confirma la existencia de cuenta ni la contraseña. El éxito solo se muestra después de autenticar y guardar correctamente la sesión.
- Registro guarda únicamente Cliente, independientemente de propiedades adicionales enviadas al servicio. Conserva los campos originales y no guarda la confirmación de contraseña. Tras el éxito espera los 1500 ms originales y navega a Login; no inicia sesión automáticamente.

## Persistencia y conservación

Se reutiliza `usuariosAlbedo`, compartiendo su lectura entre Login y Registro. Los registros se añaden al arreglo existente, conservando datos y roles anteriores. Se rechazan duplicados por correo sin distinguir mayúsculas/espacios exteriores, y por RUN directo o heredado en `rutNumero` + `digitoVerificador`; se normalizan puntos, guion y espacios para evitar duplicados equivalentes. El formulario original ya impedía repetir RUT/correo; esta normalización cubre también formatos heredados que el Login admite.

JSON corrupto, lectura bloqueada o escritura rechazada producen errores sin reemplazar usuarios por un arreglo vacío. Registro no escribe `usuarioSesionAlbedo`, `carritoAlbedo`, `ordenesAlbedo` ni preferencias del tema. Login mantiene su sesión, administrador académico y destinos por rol.

Sigue siendo un sistema local educativo. Los usuarios y contraseñas están accesibles desde el frontend y localStorage; no se presenta como autenticación de producción. No se incorporaron dependencias ni se alteraron las credenciales de demostración.

Sitio Old permanece intacto y conserva su código anterior, incluida su política de exactamente 10 caracteres. La política nueva corresponde a Login y Registro **React**. Los paneles Administrador/Vendedor siguen en Sitio Old y sus interfaces no se consideran migradas.

## Archivos de esta etapa

Creados:

- `src/pages/Registro.tsx` y `Registro.css`.
- `src/components/ui/SelectField.tsx`.
- `src/data/regions.ts`.
- `src/services/passwordPolicy.ts`, `registrationValidation.ts` y `registrationService.ts`.
- `tests/registration.test.mjs`.
- `tests/jasmine/registrationFixture.ts`, `registration.spec.ts` y `registrationPage.spec.tsx`.
- Este registro.

Modificados:

- `src/App.tsx` y `src/components/Header.tsx`: ruta y enlaces.
- `src/pages/Login.tsx`: mínimo 10, enlace a Registro React y significado de la validación de formato.
- `src/services/loginValidation.ts`: reutilización de la política compartida.
- `src/services/loginService.ts`: lectura de usuarios compartida, sin cambiar autenticación ni esquema.
- Pruebas de navegación, entrada HTTP, Login y el índice Jasmine: nuevas expectativas autorizadas y casos nuevos, conservando las demás comprobaciones.
- Documentación de Login y Jasmine/Karma: referencias al estado actual sin borrar los resultados históricos.

No se modificaron Inicio, Productos, Carrito, pagos, órdenes, datos de productos, sistema de temas, estilos globales, imágenes, dependencias o Sitio Old.

## Resultados automatizados

```powershell
npm.cmd --prefix .\react-app run build
npm.cmd --prefix .\react-app run lint
npm.cmd --prefix .\react-app test
npm.cmd --prefix .\react-app run test:unit
```

- Build/TypeScript y lint aprobados.
- **63/63 Node**: se agregan ocho casos. La comparación con el JavaScript original comprueba el catálogo de regiones, módulo 11 y el objeto completo de usuario para Casa/Departamento, con nacimiento opcional. Se comprueba el cambio autorizado de longitud sin renunciar a las demás reglas anteriores.
- **66/66 Jasmine/Karma en Chrome Headless**: 20 casos nuevos; se conservan las suites anteriores y se actualizan las expectativas de longitud y rutas. Resultado individual generado en `test-results/jasmine-karma.json`.
- Entrada HTTP directa de `/registro.html` y enlaces React del Header verificados en la suite Node.

| Casos Jasmine | Cobertura funcional comprobada |
| --- | --- |
| REG-01 | Módulo 11: DV numérico, K, cero y rechazo |
| REG-02 | Fecha opcional, válida, imposible, anterior a 1900 o futura |
| REG-03 | Correspondencia región/comuna y región desconocida |
| REG-04 | Domicilio, código postal y departamento |
| REG-05 | Nombre, apellidos, correo y confirmación |
| REG-06 | Política compartida: diez o más caracteres y símbolos |
| REG-07 | Solo Cliente, sin confirmación persistida ni privilegios inyectados |
| REG-08–09 | Duplicados de correo y RUT heredado |
| REG-10 | Registro y Login con contraseña larga y cuenta antigua |
| REG-11 | Datos corruptos y cuota agotada |
| REG-12 | Sesión, carrito, órdenes y tema conservados al registrar |
| RUI-01 | Quince campos, etiquetas, fecha opcional y enlaces React |
| RUI-02–03 | Cambios de región/comuna y Casa/Departamento en DOM real |
| RUI-04 | Sanitización y errores de RUT al editar otros campos |
| RUI-05 | Crear una sola cuenta → Login → Inicio, conservando Header y tema |
| RUI-06–07 | Error de guardado y cambio de tema sin borrar campos |
| LUI-08 | Formato válido sin marcas verdes ni falsa autenticación; cuenta inexistente rechazada |

Las pruebas montan componentes React reales con DOM de Chrome y almacenamiento simulado. No modifican datos personales del navegador. La navegación se prueba con MemoryRouter; no equivale a una prueba completa de recarga/historial sobre un despliegue. No se midieron porcentajes de líneas, ramas o sentencias.

## Revisión visual y manual pendiente

No se declara una inspección visual de la página completa. Karma comprueba interacción y estado; el bundle de pruebas no carga todos los estilos globales de la tienda. La adaptación Bootstrap y los tokens de color se revisaron en código.

En Chrome, comprobar a 360, 375, 400, 768 y 1440 px y en ambos temas:

1. Todos los campos, alineación RUT/DV, mensajes largos, distribución, foco de teclado, contraste y ausencia de superposiciones/desbordamientos.
2. Cambiar región después de elegir comuna; alternar Casa/Departamento y comprobar limpieza del número.
3. Registrar con RUT real válido de demostración y correo no repetido; usar más de 10 caracteres. Verificar redirección y acceso posterior, además del rechazo de duplicados y contraseña incorrecta.
4. Probar una cuenta previa de 10 caracteres y sus destinos Cliente/Administrador/Vendedor. Los paneles antiguos conservan sus propias vistas y reglas.
5. Navegar Login ↔ Registro, recargar, usar Atrás/Adelante y cambiar el tema desde otra pestaña. Confirmar que no se reinician carrito ni sesión.
6. Verificar errores de almacenamiento en un perfil de prueba sin manipular datos personales existentes.

Pendientes académicos: contrastar con la rúbrica oficial EP2 no localizada, incorporar esta evidencia al documento formal de cobertura y ERS V2 y preparar defensa. Recuperación de contraseña y las demás vistas pendientes no se añaden en esta etapa.
