// =====================================================
// INICIO DEL VENDEDOR - ALBEDO OUTDOOR
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // =================================================
        // 1. CONTADOR DE PRODUCTOS
        // =================================================

        const cantidadProductos =
            document.getElementById(
                "cantidadProductosVendedor"
            );


        if (
            cantidadProductos
        ) {

            const totalProductos =
                Array.isArray(
                    productos
                )
                    ? productos.length
                    : 0;


            cantidadProductos.textContent =
                totalProductos;

        }



        // =================================================
        // 2. CONTADOR DE ÓRDENES
        // =================================================

        const cantidadOrdenes =
            document.getElementById(
                "cantidadOrdenesVendedor"
            );


        let ordenes =
            [];


        try {

            const ordenesGuardadas =
                JSON.parse(
                    localStorage.getItem(
                        "ordenesAlbedo"
                    )
                );


            if (
                Array.isArray(
                    ordenesGuardadas
                )
            ) {

                ordenes =
                    ordenesGuardadas;

            }

        } catch (error) {

            ordenes =
                [];

        }



        if (
            cantidadOrdenes
        ) {

            cantidadOrdenes.textContent =
                ordenes.length;

        }


    }
);