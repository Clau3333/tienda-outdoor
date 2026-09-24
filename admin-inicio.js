// =====================================================
// INICIO DEL PANEL ADMINISTRADOR - ALBEDO OUTDOOR
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // =================================================
        // 1. PRODUCTOS
        // =================================================

        function obtenerCantidadProductos() {

            try {

                const productos =
                    JSON.parse(
                        localStorage.getItem(
                            "productosAdminAlbedo"
                        )
                    );


                if (
                    Array.isArray(
                        productos
                    )
                ) {

                    return productos.length;

                }

            } catch (error) {

                // Se utiliza la cantidad base.
            }


            return 15;

        }



        // =================================================
        // 2. USUARIOS
        // =================================================

        function obtenerCantidadUsuarios() {

            try {

                const usuarios =
                    JSON.parse(
                        localStorage.getItem(
                            "usuariosAlbedo"
                        )
                    );


                if (
                    Array.isArray(
                        usuarios
                    )
                ) {

                    return usuarios.length;

                }

            } catch (error) {

                return 0;

            }


            return 0;

        }



        // =================================================
        // 3. ÓRDENES
        // =================================================

        function obtenerCantidadOrdenes() {

            try {

                const ordenes =
                    JSON.parse(
                        localStorage.getItem(
                            "ordenesAlbedo"
                        )
                    );


                if (
                    Array.isArray(
                        ordenes
                    )
                ) {

                    return ordenes.length;

                }

            } catch (error) {

                return 0;

            }


            return 0;

        }



        // =================================================
        // 4. ELEMENTOS
        // =================================================

        const cantidadProductos =
            document.getElementById(
                "cantidadProductosAdmin"
            );


        const cantidadUsuarios =
            document.getElementById(
                "cantidadUsuariosAdmin"
            );


        const cantidadOrdenes =
            document.getElementById(
                "cantidadOrdenesAdminInicio"
            );



        // =================================================
        // 5. MOSTRAR DATOS
        // =================================================

        if (
            cantidadProductos
        ) {

            cantidadProductos.textContent =
                obtenerCantidadProductos();

        }


        if (
            cantidadUsuarios
        ) {

            cantidadUsuarios.textContent =
                obtenerCantidadUsuarios();

        }


        if (
            cantidadOrdenes
        ) {

            cantidadOrdenes.textContent =
                obtenerCantidadOrdenes();

        }


    }
);