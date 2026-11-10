
/* =====================================================
   ALBEDO OUTDOOR
   SESIÓN Y TEMA COMPARTIDO CON REACT
   ===================================================== */

(function iniciarTemaAlbedo() {
    const CLAVE_TEMA = "albedo:theme:guest";

    const scriptActual = document.currentScript;

    if (scriptActual && scriptActual.src) {
        const estilos = document.createElement("link");

        estilos.rel = "stylesheet";
        estilos.href = new URL(
            "./tema-albedo.css",
            scriptActual.src
        ).href;

        document.head.appendChild(estilos);
    }

    function obtenerTemaGuardado() {
        try {
            return localStorage.getItem(CLAVE_TEMA) === "dark"
                ? "dark"
                : "light";
        } catch {
            return "light";
        }
    }

    function aplicarTema(tema) {
        document.documentElement.setAttribute(
            "data-bs-theme",
            tema
        );

        document.documentElement.style.colorScheme = tema;
    }

    let botonTema = null;

    function actualizarBoton() {
        if (!botonTema) {
            return;
        }

        const oscuro =
            document.documentElement.getAttribute(
                "data-bs-theme"
            ) === "dark";

        botonTema.textContent = oscuro ? "☀" : "☾";

        botonTema.setAttribute(
            "aria-label",
            oscuro
                ? "Cambiar a modo claro"
                : "Cambiar a modo oscuro"
        );

        botonTema.setAttribute(
            "aria-pressed",
            String(oscuro)
        );

        botonTema.title = oscuro
            ? "Cambiar a modo claro"
            : "Cambiar a modo oscuro";
    }

    aplicarTema(obtenerTemaGuardado());

    window.addEventListener("storage", function (evento) {
        if (
            evento.key !== CLAVE_TEMA &&
            evento.key !== null
        ) {
            return;
        }

        aplicarTema(obtenerTemaGuardado());
        actualizarBoton();
    });

    document.addEventListener("DOMContentLoaded", function () {
        const menu = document.querySelector(
            ".enlaces-principales"
        );

        if (!menu) {
            return;
        }

        /* =============================================
           SESIÓN DE USUARIO
           ============================================= */

        let usuarioSesion = null;

        try {
            usuarioSesion = JSON.parse(
                localStorage.getItem(
                    "usuarioSesionAlbedo"
                )
            );
        } catch {
            usuarioSesion = null;
        }

        const enlaceLogin = menu.querySelector(
            'a[href="login.html"]'
        );

        const enlaceRegistro = menu.querySelector(
            'a[href="registro.html"]'
        );

        if (usuarioSesion) {
            if (enlaceLogin) {
                enlaceLogin.remove();
            }

            if (enlaceRegistro) {
                enlaceRegistro.remove();
            }

            function formatearNombre(nombre) {
                return String(nombre || "")
                    .trim()
                    .toLowerCase()
                    .split(/\s+/)
                    .filter(function (palabra) {
                        return palabra !== "";
                    })
                    .map(function (palabra) {
                        return (
                            palabra.charAt(0).toUpperCase() +
                            palabra.slice(1)
                        );
                    })
                    .join(" ");
            }

            const saludo = document.createElement("span");

            saludo.className = "usuario-sesion";

            saludo.textContent =
                "Hola, " +
                formatearNombre(usuarioSesion.nombre);

            menu.appendChild(saludo);

            let enlaceRol = null;

            if (
                usuarioSesion.tipoUsuario ===
                "Administrador"
            ) {
                enlaceRol = document.createElement("a");
                enlaceRol.href = "admin.html";
                enlaceRol.textContent = "Panel administrador";
            }

            if (
                usuarioSesion.tipoUsuario ===
                "Vendedor"
            ) {
                enlaceRol = document.createElement("a");
                enlaceRol.href = "vendedor.html";
                enlaceRol.textContent = "Panel vendedor";
            }

            if (
                usuarioSesion.tipoUsuario ===
                "Cliente"
            ) {
                enlaceRol = document.createElement("a");
                enlaceRol.href = "mis-pedidos.html";
                enlaceRol.textContent = "Mis pedidos";
            }

            if (enlaceRol) {
                menu.appendChild(enlaceRol);
            }

            const cerrarSesion = document.createElement("a");

            cerrarSesion.href = "#";
            cerrarSesion.id = "cerrarSesion";
            cerrarSesion.textContent = "Cerrar sesión";

            menu.appendChild(cerrarSesion);

            /* =========================================
               CIERRE DE SESIÓN COMPATIBLE CON REACT
               ========================================= */

            cerrarSesion.addEventListener(
                "click",
                function (evento) {
                    evento.preventDefault();

                    try {
                        // Solo eliminar la sesión actual.
                        // No borrar carrito, pedidos,
                        // usuarios ni preferencias de tema.
                        localStorage.removeItem(
                            "usuarioSesionAlbedo"
                        );

                        // Regresar al Inicio React.
                        window.location.href = "/index.html";

                    } catch {
                        alert(
                            "No se pudo cerrar la sesión. " +
                            "Revisa el almacenamiento e inténtalo nuevamente."
                        );
                    }
                }
            );
        }

        /* =============================================
           BOTÓN CLARO / OSCURO
           ============================================= */

        if (menu.querySelector(".tema-albedo-boton")) {
            return;
        }

        botonTema = document.createElement("button");

        botonTema.type = "button";
        botonTema.className = "tema-albedo-boton";

        botonTema.addEventListener("click", function () {
            const temaActual =
                document.documentElement.getAttribute(
                    "data-bs-theme"
                );

            const nuevoTema =
                temaActual === "dark"
                    ? "light"
                    : "dark";

            aplicarTema(nuevoTema);

            try {
                localStorage.setItem(
                    CLAVE_TEMA,
                    nuevoTema
                );
            } catch {
                // El botón sigue funcionando durante esta visita.
            }

            actualizarBoton();
        });

        menu.appendChild(botonTema);

        actualizarBoton();
    });
})();

// Control único para los menús de las páginas heredadas todavía utilizadas.
// Los botones nativos conservan Enter/Espacio; hidden y ARIA reflejan el mismo estado.
document.addEventListener("DOMContentLoaded", function iniciarCategoriasAlbedo() {
    document.querySelectorAll(".menu-categorias").forEach(function (nav) {
        const items = Array.from(nav.querySelectorAll(".mega-item"));
        const entries = items.map(function (item) {
            return { item, button: item.querySelector("button[aria-controls]"), panel: item.querySelector(".mega-panel") };
        }).filter(function (entry) { return entry.button && entry.panel; });
        if (!entries.length) return;

        function mostrar(selected) {
            entries.forEach(function (entry) {
                const open = entry === selected;
                entry.panel.hidden = !open;
                entry.button.setAttribute("aria-expanded", String(open));
            });
        }
        mostrar(null);
        entries.forEach(function (entry) {
            entry.item.addEventListener("pointerenter", function (event) {
                if (event.pointerType === "mouse") mostrar(entry);
            });
            entry.item.addEventListener("pointerleave", function (event) {
                if (event.pointerType === "mouse") mostrar(null);
            });
            entry.button.addEventListener("click", function (event) {
                mostrar(event.pointerType === "mouse" || entry.panel.hidden ? entry : null);
            });
            entry.item.addEventListener("focusout", function (event) {
                if (!entry.item.contains(event.relatedTarget)) mostrar(null);
            });
        });
        nav.addEventListener("keydown", function (event) {
            const open = entries.find(function (entry) { return !entry.panel.hidden; });
            if (event.key === "Escape" && open) {
                event.preventDefault();
                open.button.focus();
                mostrar(null);
            }
        });
        nav.addEventListener("click", function (event) {
            if (event.target.closest("a[href]")) mostrar(null);
        });
        document.addEventListener("pointerdown", function (event) {
            if (!nav.contains(event.target)) mostrar(null);
        });
        window.addEventListener("pageshow", function (event) {
            if (event.persisted) mostrar(null);
        });
    });
});
