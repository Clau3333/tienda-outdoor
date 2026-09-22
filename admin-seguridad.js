// =====================================================
// ALBEDO OUTDOOR
// SEGURIDAD COMÚN DEL ÁREA DE ADMINISTRACIÓN
// =====================================================

(function () {


    // =================================================
    // 1. OBTENER SESIÓN
    // =================================================

    function obtenerSesion() {

        try {

            const sesion =
                JSON.parse(
                    localStorage.getItem(
                        "usuarioSesionAlbedo"
                    )
                );


            if (
                sesion &&
                typeof sesion === "object"
            ) {

                return sesion;

            }

        } catch (error) {

            // Sesión inválida.

        }


        return null;

    }



    // =================================================
    // 2. VALIDAR ADMINISTRADOR
    // =================================================

    const usuarioSesion =
        obtenerSesion();


    if (
        !usuarioSesion ||
        usuarioSesion.tipoUsuario !==
            "Administrador"
    ) {

        window.location.replace(
            "login.html"
        );

        return;

    }



    // =================================================
    // 3. FORMATEAR NOMBRE
    // =================================================

    function formatearNombre(
        texto
    ) {

        return String(
            texto || ""
        )
            .trim()
            .toLowerCase()
            .split(/\s+/)
            .filter(
                function (palabra) {

                    return (
                        palabra !== ""
                    );

                }
            )
            .map(
                function (palabra) {

                    return (
                        palabra
                            .charAt(0)
                            .toUpperCase() +
                        palabra.slice(1)
                    );

                }
            )
            .join(" ");

    }



    // =================================================
    // 4. MOSTRAR USUARIO EN CABECERA
    // =================================================

    document.addEventListener(
        "DOMContentLoaded",
        function () {


            const adminNombre =
                document.getElementById(
                    "adminNombre"
                );


            const adminPerfil =
                document.getElementById(
                    "adminPerfil"
                );


            const adminInicial =
                document.getElementById(
                    "adminInicial"
                );


            const nombreFormateado =
                formatearNombre(
                    usuarioSesion.nombre
                );


            if (
                adminNombre
            ) {

                adminNombre.textContent =
                    nombreFormateado ||
                    "Administrador";

            }


            if (
                adminPerfil
            ) {

                adminPerfil.textContent =
                    "Administrador";

            }


            if (
                adminInicial
            ) {

                adminInicial.textContent =
                    nombreFormateado
                        ? nombreFormateado
                            .charAt(0)
                            .toUpperCase()
                        : "A";

            }


        }
    );



})();