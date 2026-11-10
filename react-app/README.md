# ALBEDO Outdoor · aplicación React

Consultar el [README raíz](../README.md) para instalación, ejecución, credenciales académicas, scripts y límites.

## Organización

- `src/components`: Header, Navbar, Footer, tarjetas, controles accesibles, entrega y protección de navegación.
- `src/pages`: tienda, contenido editorial, ficha individual, registro/login, carrito, pedidos y paneles por rol.
- `src/services`: datos, persistencia, validaciones, sesión, compra simulada y gestión.
- `src/data`: quince productos originales tipados y contenido editorial migrado.
- `tests/jasmine`: renderizado, props, eventos, condiciones, lógica y mocks con Jasmine/Karma.
- `tests/*.test.mjs`: pruebas Node independientes.
- `tools/verify-category-navigation.mjs`: navegación real con Chrome temporal.
- `tools/legacySite.ts`: sirve y empaqueta Sitio Old sin eliminar sus páginas.

`npm run build` comprueba TypeScript y genera `dist`; `npm run lint` revisa el código. `npm run test:unit`, `npm test` y `npm run test:navigation` comprueban capas distintas. No atribuir cobertura porcentual a estos comandos.

La carpeta hermana Sitio Old es necesaria. No desplegar `src` directamente: usar `dist` y resolver las rutas React a `index.html`. No utilizar datos ni contraseñas reales; este frontend no tiene backend ni autorización de servidor.

Documentación de entrega: [ERS V2](../docs/ERS-V2.md), [testing](../docs/TESTING-EP2.md), [Duoc](../docs/GUIA-DUOC.md) y [presentación/defensa](../docs/PRESENTACION-EP2.md).