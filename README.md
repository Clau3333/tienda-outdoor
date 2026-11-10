# ALBEDO Outdoor · Evaluación Parcial 2

Prototipo académico frontend: React, TypeScript, Vite, React Router y Bootstrap. Identidad original ALBEDO conservada. No existe backend, autenticación segura de producción ni cobro real.

## Ejecutar en Windows

Requisitos: Node.js 24, npm y Chrome para navegación/Jasmine. Se verificó con las versiones instaladas registradas en el informe de pruebas. Desde la raíz:

```powershell
npm.cmd --prefix .\react-app ci
npm.cmd --prefix .\react-app run dev -- --host 127.0.0.1
```

Abrir la URL exacta que informa Vite. Si cambia el puerto, cambia el origen y los datos de localStorage. No abrir `index.html` mediante doble clic. El ZIP excluye `node_modules`: instalar desde el lockfile en el computador destino, con acceso de red autorizado.

## Verificar

```powershell
npm.cmd --prefix .\react-app run build
npm.cmd --prefix .\react-app run lint
npm.cmd --prefix .\react-app run test:unit
npm.cmd --prefix .\react-app test
npm.cmd --prefix .\react-app run test:navigation
```

Build incluye `tsc -b`. Jasmine define las pruebas, Karma las ejecuta en ChromeHeadless. Node es una suite distinta. Navegación utiliza Chrome instalado con un perfil temporal; no descarga navegadores. Los reportes generados quedan en `react-app/test-results/` y están ignorados. Si Chrome está instalado fuera de las rutas habituales, configurar `CHROME_BIN` a su ejecutable. No desactivar sus medidas de seguridad.

## Arquitectura y funciones

- `react-app/src/App.tsx`: rutas de tienda, contenido editorial, pedidos y gestión por rol; Header/Navbar/Footer compartidos.
- `src/data/products.ts`: quince productos base, IDs, precios y variantes originales. `productRepository.ts` integra CRUD y persistencia con la interfaz.
- `src/services/`: registro, login, carrito, checkout simulado, entrega y consulta/gestión de pedidos y usuarios.
- `src/theme/`: tema compartido y sincronización entre pestañas del mismo origen.
- `Sitio Old/`: páginas originales conservadas y accesibles bajo `/Sitio%20Old/`; el plugin `tools/legacySite.ts` las sirve en desarrollo y copia al build. No borrar mientras se verifica la equivalencia completa.
- `docs/`: ERS V2, testing, ejecución en Duoc y defensa.

El catálogo permite búsqueda, categoría, orden y ofertas. Las ofertas son marcas de administración al precio publicado: no se inventan rebajas ni precios anteriores. El catálogo inicial no incluye ofertas marcadas. Para demostrar CRUD crear un producto temporal nuevo; no editar ni eliminar los quince originales.

## Demostración y persistencia

Cuenta académica inicial: `admin@duoc.cl`, clave `Admin2026#`. Es una credencial pública de demostración ya existente, nunca utilizarla en servicios reales. El login no reemplaza una cuenta inicial previamente modificada. El registro público crea únicamente Cliente; el administrador puede crear/editar usuarios y asignar Vendedor. Usar datos ficticios.

Claves compatibles con el legado: `usuariosAlbedo`, `usuarioSesionAlbedo`, `productosAdminAlbedo`, `carritoAlbedo`, `ordenesAlbedo`, `albedo:theme:guest`. No borrar datos locales para solucionar un error sin respaldo y autorización. Datos JSON corruptos se notifican y no se sustituyen silenciosamente.

El checkout solicita cliente, teléfono y entrega a domicilio o retiro; autocompleta los datos disponibles de una cuenta registrada. El rechazo conserva el carrito; la aprobación guarda la orden y después limpia el carrito. El reintento evita duplicar un intento ya guardado. No hay costo de envío ni impuestos adicionales simulados: el total corresponde a los productos mostrados. El formulario de contacto valida localmente, sin envío real.

## Límites y entrega

Roles, usuarios y órdenes viven en el navegador y pueden manipularse: la protección de navegación solo demuestra comportamiento académico. Producción requeriría servidor, autorización, contraseñas protegidas, sesiones, almacenamiento y pagos reales. No guardar datos personales o contraseñas reales.

El despliegue debe servir el contenido de `react-app/dist` y resolver las rutas React a `index.html`, preservando las rutas de archivos de `Sitio Old`. Abrir la raíz del repositorio como el sitio HTML anterior ya no inicia React. Se debe verificar el alojamiento elegido antes de publicar.

La fuente de requisitos EP2 de esta etapa es el encargo proporcionado por el usuario; el PDF oficial no está incluido. No se afirma una nota ni un porcentaje de rúbrica. El informe de aceptación distingue evidencia actual, limitaciones y verificaciones pendientes. No se realizaron commits ni integración con `main` durante la preparación.

Para regenerar el paquete en un equipo con Python 3 disponible, ejecutar desde la raíz `python react-app/tools/prepare-delivery.py --zip entregas/ALBEDO-frontend-EP2.zip`, usando un nombre nuevo si ya existe. El script valida una lista de carpetas permitidas, rechaza archivos vacíos o nombres privados, comprueba patrones de privacidad y verifica el ZIP por SHA256. No reemplaza una revisión humana. `--snapshot` permite crear una copia fuente aislada en una carpeta nueva fuera del proyecto. Python se usa únicamente para preparar la entrega; no es dependencia del frontend.
