// =====================================================
// ÓRDENES DEL VENDEDOR - ALBEDO OUTDOOR
// SOLO VISUALIZACIÓN
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // =================================================
        // 1. ELEMENTOS
        // =================================================

        const lista =
            document.getElementById(
                "listaOrdenesVendedor"
            );


        const cantidadTotal =
            document.getElementById(
                "cantidadOrdenesTotal"
            );


        const cantidadPendientes =
            document.getElementById(
                "cantidadOrdenesPendientes"
            );


        const cantidadEntregadas =
            document.getElementById(
                "cantidadOrdenesEntregadas"
            );



        if (!lista) {

            return;

        }



        // =================================================
        // 2. OBTENER ÓRDENES
        // =================================================

        function obtenerOrdenes() {

            try {

                const ordenes =
                    JSON.parse(
                        localStorage.getItem(
                            "ordenesAlbedo"
                        )
                    );


                return Array.isArray(
                    ordenes
                )
                    ? ordenes
                    : [];

            } catch (error) {

                return [];

            }

        }



        // =================================================
        // 3. ESCAPAR HTML
        // =================================================

        function escaparHTML(
            valor
        ) {

            return String(
                valor ?? ""
            )
                .replace(
                    /&/g,
                    "&amp;"
                )
                .replace(
                    /</g,
                    "&lt;"
                )
                .replace(
                    />/g,
                    "&gt;"
                )
                .replace(
                    /"/g,
                    "&quot;"
                )
                .replace(
                    /'/g,
                    "&#039;"
                );

        }



        // =================================================
        // 4. FORMATEAR PRECIO
        // =================================================

        function formatearPrecio(
            valor
        ) {

            return (
                "$" +
                Number(
                    valor || 0
                ).toLocaleString(
                    "es-CL"
                )
            );

        }



        // =================================================
        // 5. FORMATEAR FECHA
        // =================================================

        function formatearFecha(
            fecha
        ) {

            const objetoFecha =
                new Date(
                    fecha
                );


            if (
                Number.isNaN(
                    objetoFecha.getTime()
                )
            ) {

                return "-";

            }


            return objetoFecha.toLocaleString(
                "es-CL",
                {
                    day:
                        "2-digit",

                    month:
                        "2-digit",

                    year:
                        "numeric",

                    hour:
                        "2-digit",

                    minute:
                        "2-digit"
                }
            );

        }



        // =================================================
        // 6. ESTADO
        // =================================================

        function obtenerClaseEstado(
            estado
        ) {

            switch (
                estado
            ) {

                case "Pendiente":

                    return "text-bg-warning";


                case "Procesando":

                    return "text-bg-info";


                case "Enviado":

                    return "text-bg-primary";


                case "Entregado":

                    return "text-bg-success";


                default:

                    return "text-bg-secondary";

            }

        }



        // =================================================
        // 7. OBTENER DATOS
        // =================================================

        const ordenes =
            obtenerOrdenes();



        // =================================================
        // 8. RESUMEN
        // =================================================

        const pendientes =
            ordenes.filter(
                function (orden) {

                    return (
                        orden.estado ===
                        "Pendiente"
                    );

                }
            );


        const entregadas =
            ordenes.filter(
                function (orden) {

                    return (
                        orden.estado ===
                        "Entregado"
                    );

                }
            );



        if (
            cantidadTotal
        ) {

            cantidadTotal.textContent =
                ordenes.length;

        }


        if (
            cantidadPendientes
        ) {

            cantidadPendientes.textContent =
                pendientes.length;

        }


        if (
            cantidadEntregadas
        ) {

            cantidadEntregadas.textContent =
                entregadas.length;

        }



        // =================================================
        // 9. SIN ÓRDENES
        // =================================================

        if (
            ordenes.length === 0
        ) {

            lista.innerHTML = `

                <tr>

                    <td
                        colspan="7"
                        class="text-secondary text-center py-4"
                    >
                        No existen órdenes registradas.
                    </td>

                </tr>

            `;


            return;

        }



        // =================================================
        // 10. MOSTRAR ÓRDENES
        // =================================================

        lista.innerHTML =
            ordenes
                .slice()
                .reverse()
                .map(
                    function (orden) {


                        const cliente =
                            orden.cliente ||
                            {};


                        const nombreCliente =
                            [
                                cliente.nombre,
                                cliente.apellidos
                            ]
                                .filter(Boolean)
                                .join(" ");


                        const claseEstado =
                            obtenerClaseEstado(
                                orden.estado
                            );



                        return `

                            <tr>

                                <td>

                                    <strong>
                                        ${escaparHTML(
                                            orden.numeroOrden
                                        )}
                                    </strong>

                                </td>


                                <td>
                                    ${formatearFecha(
                                        orden.fecha
                                    )}
                                </td>


                                <td>
                                    ${escaparHTML(
                                        nombreCliente ||
                                        "Cliente"
                                    )}
                                </td>


                                <td>
                                    ${escaparHTML(
                                        cliente.correo ||
                                        "-"
                                    )}
                                </td>


                                <td>

                                    <strong>
                                        ${formatearPrecio(
                                            orden.total
                                        )}
                                    </strong>

                                </td>


                                <td>

                                    <span
                                        class="badge ${claseEstado}"
                                    >
                                        ${escaparHTML(
                                            orden.estado ||
                                            "Pendiente"
                                        )}
                                    </span>

                                </td>


                                <td>

                                    <a
                                        class="btn btn-sm btn-outline-dark"
                                        href="vendedor-orden-detalle.html?id=${encodeURIComponent(
                                            orden.id
                                        )}"
                                    >
                                        Ver detalle
                                    </a>

                                </td>

                            </tr>

                        `;

                    }
                )
                .join("");


    }
);