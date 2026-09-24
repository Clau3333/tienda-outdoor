// =====================================================
// ADMINISTRACIÓN DE ÓRDENES - ALBEDO OUTDOOR
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // =================================================
        // 1. ELEMENTOS
        // =================================================

        const lista =
            document.getElementById(
                "listaOrdenesAdmin"
            );


        const cantidadOrdenes =
            document.getElementById(
                "cantidadOrdenesAdmin"
            );


        const cantidadPendientes =
            document.getElementById(
                "cantidadPendientesAdmin"
            );


        const cantidadEntregadas =
            document.getElementById(
                "cantidadEntregadasAdmin"
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
        // 4. FORMATEAR NOMBRE
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
                .filter(Boolean)
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
        // 5. FORMATEAR PRECIO
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
        // 6. FORMATEAR FECHA
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
        // 7. COLOR DEL ESTADO
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
        // 8. CARGAR ÓRDENES
        // =================================================

        const ordenes =
            obtenerOrdenes();



        // =================================================
        // 9. CONTADORES
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
            cantidadOrdenes
        ) {

            cantidadOrdenes.textContent =
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
        // 10. SIN ÓRDENES
        // =================================================

        if (
            ordenes.length === 0
        ) {

            lista.innerHTML = `

                <tr>

                    <td
                        colspan="7"
                        class="text-center text-secondary py-4"
                    >
                        No existen órdenes registradas.
                    </td>

                </tr>

            `;


            return;

        }



        // =================================================
        // 11. MOSTRAR ÓRDENES
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
                            formatearNombre(
                                [
                                    cliente.nombre,
                                    cliente.apellidos
                                ]
                                    .filter(Boolean)
                                    .join(" ")
                            );


                        const estado =
                            orden.estado ||
                            "Pendiente";


                        const claseEstado =
                            obtenerClaseEstado(
                                estado
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
                                            estado
                                        )}
                                    </span>

                                </td>


                                <td>

                                    <a
                                        class="btn btn-sm btn-dark"
                                        href="admin-orden-detalle.html?id=${encodeURIComponent(
                                            orden.id
                                        )}"
                                    >
                                        Gestionar
                                    </a>

                                </td>


                            </tr>

                        `;

                    }
                )
                .join("");


    }
);