// =====================================================
// DETALLE DE ORDEN DEL VENDEDOR
// ALBEDO OUTDOOR
// SOLO VISUALIZACIÓN
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // =================================================
        // 1. ELEMENTOS
        // =================================================

        const contenedor =
            document.getElementById(
                "detalleOrdenVendedor"
            );


        const titulo =
            document.getElementById(
                "tituloOrden"
            );



        if (!contenedor) {

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
        // 6. FORMATEAR NOMBRE
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
        // 7. CLASE DEL ESTADO
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
        // 8. LEER ID DE LA URL
        // =================================================

        const parametros =
            new URLSearchParams(
                window.location.search
            );


        const idOrden =
            parametros.get(
                "id"
            );



        // =================================================
        // 9. BUSCAR ORDEN
        // =================================================

        const ordenes =
            obtenerOrdenes();


        const orden =
            ordenes.find(
                function (item) {

                    return (
                        String(
                            item.id
                        ) ===
                        String(
                            idOrden
                        )
                    );

                }
            );



        // =================================================
        // 10. ORDEN NO ENCONTRADA
        // =================================================

        if (!orden) {

            if (titulo) {

                titulo.textContent =
                    "Orden no encontrada";

            }


            contenedor.innerHTML = `

                <div
                    class="alert alert-warning mb-0"
                    role="alert"
                >
                    No se encontró la orden solicitada.
                </div>

            `;


            return;

        }



        // =================================================
        // 11. DATOS DE LA ORDEN
        // =================================================

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



        if (titulo) {

            titulo.textContent =
                orden.numeroOrden ||
                "Orden";

        }



        // =================================================
        // 12. PRODUCTOS DE LA ORDEN
        // =================================================

        const productosOrden =
            Array.isArray(
                orden.productos
            )
                ? orden.productos
                : [];


        let productosHTML = "";


        if (
            productosOrden.length === 0
        ) {

            productosHTML = `

                <tr>

                    <td
                        colspan="5"
                        class="text-center text-secondary py-4"
                    >
                        Esta orden no contiene productos.
                    </td>

                </tr>

            `;

        } else {

            productosHTML =
                productosOrden
                    .map(
                        function (producto) {

                            return `

                                <tr>

                                    <td>

                                        <strong>
                                            ${escaparHTML(
                                                producto.nombre
                                            )}
                                        </strong>

                                    </td>

                                    <td>
                                        ${escaparHTML(
                                            producto.color ||
                                            "-"
                                        )}
                                    </td>

                                    <td>
                                        ${formatearPrecio(
                                            producto.precio
                                        )}
                                    </td>

                                    <td>
                                        ${Number(
                                            producto.cantidad ||
                                            0
                                        )}
                                    </td>

                                    <td>

                                        <strong>
                                            ${formatearPrecio(
                                                producto.subtotal
                                            )}
                                        </strong>

                                    </td>

                                </tr>

                            `;

                        }
                    )
                    .join("");

        }



        // =================================================
        // 13. MOSTRAR DETALLE
        // =================================================

        contenedor.innerHTML = `

            <div class="row g-4">


                <div class="col-12">

                    <p class="admin-etiqueta mb-2">
                        INFORMACIÓN DE LA ORDEN
                    </p>

                    <h2 class="mb-4">
                        ${escaparHTML(
                            orden.numeroOrden
                        )}
                    </h2>

                </div>



                <div class="col-12 col-md-6">

                    <strong>
                        Fecha
                    </strong>

                    <p>
                        ${formatearFecha(
                            orden.fecha
                        )}
                    </p>

                </div>



                <div class="col-12 col-md-6">

                    <strong>
                        Estado
                    </strong>

                    <p class="mt-1">

                        <span
                            class="badge ${claseEstado}"
                        >
                            ${escaparHTML(
                                estado
                            )}
                        </span>

                    </p>

                </div>



                <div class="col-12 col-md-6">

                    <strong>
                        Cliente
                    </strong>

                    <p>
                        ${escaparHTML(
                            nombreCliente ||
                            "Cliente"
                        )}
                    </p>

                </div>



                <div class="col-12 col-md-6">

                    <strong>
                        Correo
                    </strong>

                    <p>
                        ${escaparHTML(
                            cliente.correo ||
                            "-"
                        )}
                    </p>

                </div>



                <div class="col-12">

                    <hr>

                    <p class="admin-etiqueta mb-3">
                        PRODUCTOS
                    </p>


                    <div class="table-responsive">

                        <table class="table align-middle">

                            <thead>

                                <tr>

                                    <th>
                                        Producto
                                    </th>

                                    <th>
                                        Color
                                    </th>

                                    <th>
                                        Precio
                                    </th>

                                    <th>
                                        Cantidad
                                    </th>

                                    <th>
                                        Subtotal
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                ${productosHTML}

                            </tbody>

                        </table>

                    </div>

                </div>



                <div class="col-12">

                    <div
                        class="d-flex justify-content-end"
                    >

                        <div class="text-end">

                            <span class="text-secondary">
                                Total de la orden
                            </span>

                            <h2 class="mb-0">
                                ${formatearPrecio(
                                    orden.total
                                )}
                            </h2>

                        </div>

                    </div>

                </div>



                <div class="col-12">

                    <div
                        class="alert alert-secondary mb-0"
                        role="status"
                    >
                        Perfil Vendedor:
                        esta orden es únicamente
                        de consulta. El estado no puede
                        ser modificado desde esta vista.
                    </div>

                </div>


            </div>

        `;


    }
);