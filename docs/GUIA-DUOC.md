# Ejecución en Duoc

1. Usar un perfil autorizado, Node 24, npm y Chrome. No copiar la configuración personal de Codex, tokens ni sesiones del PC de origen.
2. Abrir el proyecto completo en VS Code; `Sitio Old` debe ser hermana de `react-app`. No abrir solamente el subdirectorio React aislado de sus recursos.
3. En PowerShell, desde la raíz, ejecutar `npm.cmd --prefix .\react-app ci`. Si red o políticas institucionales bloquean la instalación, registrar el error y solicitar ayuda institucional; no desactivar seguridad.
4. Ejecutar `npm.cmd --prefix .\react-app run dev -- --host 127.0.0.1`. Abrir exactamente la URL impresa, no `file://` ni la dirección de otro computador.
5. Comprobar Inicio, Productos, una ficha por ID, Login, ambos temas y los archivos de `/Sitio%20Old/`. Si Vite cambia el puerto, localStorage será otro y los datos anteriores no aparecerán.
6. Registrar cuenta Cliente con datos ficticios; probar rechazo/aprobación de pago y pedidos. Entrar como administrador académico para crear un producto temporal y un vendedor; comprobar que el vendedor no edita.
7. Ejecutar build, lint, test:unit, test y test:navigation como indica el README. Guardar consola y JSON con fecha; no usar resultados de otro equipo como prueba de instalación local.
8. Ensayar presentación de 15 minutos y defensa de 5. Tener el ZIP y documentación disponibles; no depender de una sesión personal de GitHub abierta.

Diagnóstico: puerto ocupado → usar la URL real; imágenes 404 → verificar estructura completa; Node incompatible → comprobar `node --version`; Chrome no encontrado → señalar `CHROME_BIN` si ya está instalado; datos corruptos → conservarlos y reproducir en perfil de prueba, sin borrarlos sin permiso.

Esta guía no acredita ejecución en Duoc. Esa comprobación requiere realizar los pasos físicamente allí y registrar resultados.
