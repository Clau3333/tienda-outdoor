// =====================================================
// SESIÓN DE USUARIO - ALBEDO OUTDOOR
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // =================================================
        // 1. BUSCAR MENÚ PRINCIPAL
        // =================================================

        const menu =
            document.querySelector(
                ".enlaces-principales"
            );


        if (!menu) {

            return;

        }



        // =================================================
        // 2. OBTENER SESIÓN
        // =================================================

        let usuarioSesion =
            null;


        try {

            usuarioSesion =
                JSON.parse(
                    localStorage.getItem(
                        "usuarioSesionAlbedo"
                    )
                );

        } catch (error) {

            usuarioSesion =
                null;

        }



        // =================================================
        // 3. ENLACES DE VISITANTE
        // =================================================

        const enlaceLogin =
            menu.querySelector(
                'a[href="login.html"]'
            );


        const enlaceRegistro =
            menu.querySelector(
                'a[href="registro.html"]'
            );



        // =================================================
        // 4. SI NO HAY SESIÓN
        // =================================================

        if (!usuarioSesion) {

            return;

        }



        // =================================================
        // 5. OCULTAR LOGIN Y REGISTRO
        // =================================================

        if (enlaceLogin) {

            enlaceLogin.remove();

        }


        if (enlaceRegistro) {

            enlaceRegistro.remove();

        }



        // =================================================
        // 6. FORMATEAR NOMBRE
        // =================================================

        function formatearNombre(
            nombre
        ) {

            return String(
                nombre || ""
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
        // 7. MOSTRAR USUARIO
        // =================================================

        const saludo =
            document.createElement(
                "span"
            );


        saludo.className =
            "usuario-sesion";


        saludo.textContent =
            "Hola, " +
            formatearNombre(
                usuarioSesion.nombre
            );



        // =================================================
        // 8. CERRAR SESIÓN
        // =================================================

        const cerrarSesion =
            document.createElement(
                "a"
            );


        cerrarSesion.href =
            "#";


        cerrarSesion.id =
            "cerrarSesion";


        cerrarSesion.textContent =
            "Cerrar sesión";



        // =================================================
        // 9. AGREGAR AL MENÚ
        // =================================================

        menu.appendChild(
            saludo
        );


        menu.appendChild(
            cerrarSesion
        );



        // =================================================
        // 10. EVENTO CERRAR SESIÓN
        // =================================================

        cerrarSesion.addEventListener(
            "click",
            function (evento) {

                evento.preventDefault();


                // -----------------------------------------
                // ELIMINAR SESIÓN
                // -----------------------------------------

                localStorage.removeItem(
                    "usuarioSesionAlbedo"
                );


                // -----------------------------------------
                // VACIAR CARRITO
                // Evita que el carrito del usuario anterior
                // quede visible después de cerrar sesión.
                // -----------------------------------------

                localStorage.removeItem(
                    "carritoAlbedo"
                );


                // -----------------------------------------
                // VOLVER AL INICIO
                // -----------------------------------------

                window.location.href =
                    "index.html";

            }
        );


    }
);