# ALBEDO Outdoor — pruebas unitarias EP2

Actualización de Registro: **66/66 Jasmine/Karma y 63/63 Node**, build/TypeScript y lint aprobados. Matriz de casos nuevos y limitaciones: [Registro y correcciones de Login](REGISTRO-VERIFICACION.md). Los resultados siguientes son históricos por etapa.

Actualización de la etapa Login: **46/46 Jasmine/Karma y 55/55 Node**, con build y lint aprobados. La evidencia y matriz de los casos nuevos están en [Login: verificación](LOGIN-VERIFICACION.md). La tabla siguiente conserva el resultado histórico de la configuración inicial (30 casos).

## Resultado comprobado

Ejecución del 4 de noviembre de 2026, zona America/Santiago:

| Comprobación | Resultado |
| --- | --- |
| Jasmine Core 4.6.1 mediante Karma 6.4.4 | 30 aprobadas, 0 fallidas, 0 omitidas |
| Navegador real de pruebas | Chrome Headless 156, Windows |
| Pruebas Node anteriores | 47 aprobadas; conservadas sin reemplazarlas por Jasmine |
| TypeScript de las pruebas | Aprobado con `tsc -p tsconfig.spec.json`, modo estricto |
| Build de aplicación | Aprobado con TypeScript y Vite |
| Lint | Aprobado, incluidas las pruebas TypeScript y la infraestructura nueva |

El resultado de Karma se escribe automáticamente en `test-results/jasmine-karma.json`: fecha UTC, versiones, navegador, cantidades y resultado individual de cada caso. Esa carpeta está ignorada por Git y el archivo se reemplaza al terminar una ejecución de Karma. Si el comando falla antes de llegar al reporter, puede quedar un JSON anterior: comprobar siempre su fecha y el código de salida del comando. Para una entrega, ejecutar nuevamente y conservar una copia del JSON junto con la salida de consola. Este registro describe la ejecución comprobada; no sustituye el archivo generado.

Claudio informó que comprobó manualmente el carrito, cantidades, contador, tema, pagos y órdenes antes de esta etapa. Es una confirmación aportada por el usuario, diferenciada de las ejecuciones automatizadas descritas aquí.

## Cómo demostrarlo al profesor

Desde la raíz del repositorio, en PowerShell:

```powershell
# Pruebas académicas: comprueba tipos, compila TS/TSX y ejecuta Jasmine en Chrome con Karma.
npm.cmd --prefix .\react-app run test:unit

# Consultar la evidencia recién generada.
Get-Content .\react-app\test-results\jasmine-karma.json

# Pruebas Node anteriores, conservadas como regresión adicional.
npm.cmd --prefix .\react-app test

# Compilación de la tienda y revisión estática.
npm.cmd --prefix .\react-app run build
npm.cmd --prefix .\react-app run lint
```

La salida académica enumera los casos con `PASS` y termina con el total de la suite vigente: inicialmente 30, tras Login 46 y tras Registro **`TOTAL: 66 SUCCESS`**. Un fallo de prueba o de lanzamiento devuelve un código distinto de cero. No ejecutar Karma contra un bundle antiguo: `test:unit` recompila las pruebas antes de cada ejecución.

En otro equipo, instalar primero las dependencias fijadas en el lockfile:

```powershell
npm.cmd --prefix .\react-app ci
```

Se necesita Node compatible con Vite 8 (en esta ejecución, Node 24.22.1 y npm 11.19.1) y Chrome instalado. El ejecutor busca Chrome en las ubicaciones habituales de Windows. Si se encuentra en otro lugar:

```powershell
$env:CHROME_BIN = 'C:\ruta\a\chrome.exe'
npm.cmd --prefix .\react-app run test:unit
```

Karma usa un perfil temporal, no el perfil personal de Chrome. Los servicios de las pruebas reciben almacenamiento simulado, sin leer ni modificar carritos, sesiones u órdenes reales.

## Arquitectura y compatibilidad verificadas

1. `tsconfig.spec.json` comprueba las pruebas y los módulos importados con tipos Jasmine aislados del TypeScript de la aplicación.
2. `tools/run-karma.mjs` usa Vite 8.3.5 y el plugin React existente para generar `.karma-tmp/specs.js`. Incluye los módulos reales de producción; no copia sus algoritmos en las pruebas.
3. La configuración de pruebas es independiente de `vite.config.ts`: no ejecuta el plugin que copia Sitio Old, no escribe en `dist` ni altera el bundle de la tienda. El bundle de pruebas usa React de desarrollo para permitir `act`.
4. `karma.conf.cjs` configura Jasmine y Chrome Headless, escucha solo en `127.0.0.1:9876` y termina después de la ejecución. Jasmine aleatoriza los casos con semilla fija `20261104`, para mantener la demostración reproducible. Los casos sin expectativas se consideran fallidos.
5. El reporter genera evidencia JSON y conserva la salida individual de cada caso. No calcula porcentajes de cobertura.

| Dependencia de desarrollo | Versión fijada | Justificación |
| --- | --- | --- |
| `karma` | 6.4.4 | Runner requerido por la evaluación; ejecutado con Node 24 |
| `karma-jasmine` | 5.1.0 | Adaptador que declara Karma `^6.0.0` y Jasmine Core `^4.1.0` |
| `jasmine-core` | 4.6.1 | Cumple el rango del adaptador sin overrides ni dependencias duplicadas |
| `karma-chrome-launcher` | 3.2.0 | Lanza el Chrome real instalado |
| `@types/jasmine` | 4.6.5 | Tipos correspondientes a Jasmine 4 |

Se consultaron versiones, engines y dependencias de npm antes de instalar. `npm ls` confirmó Jasmine Core 4.6.1 y Karma 6.4.4 deduplicados. No se instalaron otros compiladores, simuladores de DOM ni frameworks de pruebas.

Karma está descontinuado y no recibe nuevas funciones ni correcciones generales. Se utiliza por el requisito académico explícito; esta configuración no pretende representar la alternativa más reciente. Jasmine Core 7 no satisface el rango del adaptador: no se forzó su instalación.

Fuentes primarias consultadas: [Karma: configuración](https://karma-runner.github.io/6.4/config/configuration-file.html), [estado de mantenimiento de Karma](https://github.com/karma-runner/karma#karma-is-deprecated-and-is-not-accepting-new-features-or-general-bug-fixes), [compatibilidad Jasmine/Karma](https://jasmine.github.io/pages/faq.html#why-dont-newer-jasmine-features-work-in-karma), [Vite: compilación](https://vite.dev/guide/build).

## Mocks y aislamiento

`storageMock.ts` crea un `Map` nuevo por prueba y un `jasmine.createSpyObj<StoragePort>` para `getItem` y `setItem`. Permite comprobar qué claves se escriben, el orden de escritura y simular cuota agotada o datos corruptos. No se sustituye la lógica de productos, carrito o pagos: se importan los servicios reales.

El checkout recibe un reloj simulado para comprobar fechas exactas. Las pruebas React crean y desmontan su propio contenedor con `createRoot` y `act`, y comprueban eventos y asociaciones accesibles en el DOM real de Chrome. No son pruebas visuales ni de un flujo completo de páginas.

## Matriz de cobertura funcional

Todos los casos siguientes pasaron en Jasmine/Karma. La matriz relaciona requisitos y escenarios; **no equivale a un porcentaje de sentencias, líneas, funciones o ramas**. No se incluyó instrumentación de cobertura de código y no se declara cobertura total de la aplicación.

| Caso | Escenario comprobado | Archivo |
| --- | --- | --- |
| PRO-01 | 15 productos, identificadores únicos, categoría y lectura sin escritura | `jasmine/products.spec.ts` |
| PRO-02 | Copias aisladas: modificar una lectura no altera los originales | `jasmine/products.spec.ts` |
| PRO-03 | Crear y recuperar producto persistido por ID | `jasmine/products.spec.ts` |
| PRO-04 | Actualizar precio preservando ID y otros productos | `jasmine/products.spec.ts` |
| PRO-05 | Eliminar solo el producto solicitado | `jasmine/products.spec.ts` |
| PRO-06 | Rechazar precio negativo y duplicado sin guardar | `jasmine/products.spec.ts` |
| PRO-07 | Catálogo corrupto no se sobrescribe al intentar CRUD | `jasmine/products.spec.ts` |
| PRO-08 | Variante correcta y prefijo de imagen sin duplicación | `jasmine/products.spec.ts` |
| CAR-01 | Estado inicial vacío y totales cero | `jasmine/cart.spec.ts` |
| CAR-02 | Agregar misma variante suma cantidades sin duplicar fila | `jasmine/cart.spec.ts` |
| CAR-03 | Colores diferentes generan variantes independientes | `jasmine/cart.spec.ts` |
| CAR-04 | Aumentar/disminuir actualiza cantidades, subtotal, contador y total | `jasmine/cart.spec.ts` |
| CAR-05 | Cero, negativos, decimales, NaN, infinito y entero inseguro se rechazan | `jasmine/cart.spec.ts` |
| CAR-06 | Eliminar una variante y vaciar conservan coherencia | `jasmine/cart.spec.ts` |
| CAR-07 | Otra instancia recupera cantidades desde `carritoAlbedo` | `jasmine/cart.spec.ts` |
| CAR-08 | Notificación de almacenamiento cambia contenido con igual contador | `jasmine/cart.spec.ts` |
| CAR-09 | Fallo de escritura conserva carrito y snapshot | `jasmine/cart.spec.ts` |
| CAR-10 | Lectura corrupta publica error sin destruir datos | `jasmine/cart.spec.ts` |
| PAG-01 | Carrito vacío bloquea la compra | `jasmine/checkout.spec.ts` |
| PAG-02 | Rechazo no modifica carrito ni registra orden | `jasmine/checkout.spec.ts` |
| PAG-03 | Aprobación guarda variantes, fecha, estado, subtotales y total antes de vaciar | `jasmine/checkout.spec.ts` |
| PAG-04 | Órdenes anteriores conservadas y numeración correlativa | `jasmine/checkout.spec.ts` |
| PAG-05 | Datos del cliente desde la clave de sesión original, sin modificarla | `jasmine/checkout.spec.ts` |
| PAG-06 | Mismo intento repetido no duplica la orden | `jasmine/checkout.spec.ts` |
| PAG-07 | Fallo al guardar orden no vacía ni sobrescribe datos anteriores | `jasmine/checkout.spec.ts` |
| PAG-08 | Recuperación de limpieza fallida con nueva instancia, sin duplicar orden | `jasmine/checkout.spec.ts` |
| PAG-09 | Órdenes corruptas bloquean compra sin pérdida de datos | `jasmine/checkout.spec.ts` |
| PAG-10 | Reintento aprobado después de rechazo conserva cantidades | `jasmine/checkout.spec.ts` |
| REA-01 | Botón React recibe y ejecuta callback; tipo predeterminado seguro | `jasmine/components.spec.tsx` |
| REA-02 | Campo React enlaza etiqueta, ayuda y error mediante ARIA | `jasmine/components.spec.tsx` |

## Incidencias y límites

- El primer lanzamiento dentro del entorno restringido falló por permisos/cifrado de Windows y procesos GPU de Chrome. Se repitió el mismo comando con permisos de ejecución externos al aislamiento y pasó. No se desactivó el sandbox de Chrome ni se agregaron flags para ocultar el fallo. En un terminal normal de Windows se utiliza el comando documentado.
- La instalación informó paquetes transitivos antiguos (`inflight`, `rimraf`, `glob`). `npm audit --json` informó 10 advertencias moderadas en la cadena de ESLint/TypeScript-ESLint/minimatch, 0 altas y 0 críticas. No se aplicó `audit fix`, overrides ni cambios de versiones de esas herramientas fuera de alcance. Las advertencias auditadas no pertenecen a los cinco paquetes directos de pruebas.
- No se acreditan por estas pruebas login/registro completos, administración React, cobertura del backend, responsive, contraste visual, navegación completa o concurrencia real entre pestañas. CAR-08 prueba la reacción del estado a una notificación, no abre dos pestañas.
- Las pruebas no alteraron código de `src`, Sitio Old, imágenes o estilos de la tienda. La compilación de producción mantiene los mismos archivos CSS/JS resultantes que antes de esta etapa.

## Relación con la entrega académica

Hay más de diez casos reales ejecutados con Jasmine y Karma, con mocks, éxitos y fallos. Esto aporta evidencia al requisito de pruebas comunicado por Claudio y registrado en AGENTS.md; no acredita automáticamente la nota máxima ni todos los criterios de la evaluación.

La rúbrica oficial EP2 sigue sin localizarse en el repositorio. Pendientes: validar esta matriz contra esa rúbrica, incorporarla al formato de cobertura exigido por el profesor, completar ERS V2, revisar requisitos restantes de migración/autenticación/administración y preparar la defensa técnica. Los documentos de EP1 no sustituyen estas entregas.
