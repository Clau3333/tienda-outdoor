// =====================================================
// ALBEDO OUTDOOR
// SEGURIDAD DEL PANEL VENDEDOR
// =====================================================

(function () {

    // =================================================
    // CONFIGURACIÓN
    // =================================================

    const CLAVE_SESION =
        "usuarioSesionAlbedo";

    const CLAVE_CARRITO =
        "carritoAlbedo";


    // =================================================
    // OBTENER SESIÓN
    // =================================================

    function obtenerSesion() {

        try {

            const sesion =
                JSON.parse(
                    localStorage.getItem(
                        CLAVE_SESION
                    )
                );

            return sesion || null;

        } catch (error) {

            return null;

        }

    }


    // =================================================
    // COMPROBAR ACCESO
    // =================================================

    const usuarioSesion =
        obtenerSesion();


    // Si no existe sesión o el usuario
    // no tiene perfil Vendedor,
    // no puede entrar al panel.

    if (
        !usuarioSesion ||
        usuarioSesion.tipoUsuario !== "Vendedor"
    ) {

        window.location.replace(
            "login.html"
        );

        return;

    }


    // =================================================
    // FORMATEAR NOMBRE
    // =================================================

    function formatearNombre(nombre) {

        if (!nombre) {

            return "Vendedor";

        }


        return String(nombre)
            .trim()
            .toLowerCase()
            .replace(
                /(^|\s)\S/g,
                function (letra) {

                    return letra.toUpperCase();

                }
            );

    }


    // =================================================
    // CARGAR INFORMACIÓN DEL VENDEDOR
    // =================================================

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            const vendedorNombre =
                document.getElementById(
                    "vendedorNombre"
                );

            const vendedorPerfil =
                document.getElementById(
                    "vendedorPerfil"
                );

            const vendedorInicial =
                document.getElementById(
                    "vendedorInicial"
                );

            const cerrarSesion =
                document.getElementById(
                    "cerrarSesionVendedor"
                );


            // =========================================
            // NOMBRE
            // =========================================

            const nombreFormateado =
                formatearNombre(
                    usuarioSesion.nombre
                );


            if (vendedorNombre) {

                vendedorNombre.textContent =
                    nombreFormateado;

            }


            // =========================================
            // PERFIL
            // =========================================

            if (vendedorPerfil) {

                vendedorPerfil.textContent =
                    "Vendedor";

            }


            // =========================================
            // INICIAL
            // =========================================

            if (vendedorInicial) {

                vendedorInicial.textContent =
                    nombreFormateado
                        .charAt(0)
                        .toUpperCase();

            }


            // =========================================
            // CERRAR SESIÓN
            // =========================================

            if (cerrarSesion) {

                cerrarSesion.addEventListener(
                    "click",
                    function (evento) {

                        evento.preventDefault();


                        // Eliminar sesión actual.

                        localStorage.removeItem(
                            CLAVE_SESION
                        );


                        // Vaciar carrito para evitar que
                        // quede visible para otro usuario.

                        localStorage.removeItem(
                            CLAVE_CARRITO
                        );


                        // Volver al login.

                        window.location.href =
                            "login.html";

                    }
                );

            }

        }
    );

})();