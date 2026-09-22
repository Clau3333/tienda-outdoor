// =====================================================
// ALBEDO OUTDOOR
// INICIO DEL PANEL DE ADMINISTRACIÓN
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // =================================================
        // 1. OBTENER CANTIDAD DE PRODUCTOS
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


                // Si ocurre un error,
                // se utiliza la cantidad base.


            }


            return 15;


        }



        // =================================================
        // 2. OBTENER CANTIDAD DE USUARIOS
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


                // Si ocurre un error,
                // se muestra cero.


            }


            return 0;


        }



        // =================================================
        // 3. ELEMENTOS DEL RESUMEN
        // =================================================

        const cantidadProductos =
            document.getElementById(
                "cantidadProductosAdmin"
            );


        const cantidadUsuarios =
            document.getElementById(
                "cantidadUsuariosAdmin"
            );



        // =================================================
        // 4. MOSTRAR CANTIDADES REALES
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


    }
);