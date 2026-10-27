// =====================================================
// GESTIÓN DE ORDEN - ADMINISTRADOR
// ALBEDO OUTDOOR
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // =================================================
        // 1. ELEMENTOS
        // =================================================

        const contenedor =
            document.getElementById(
                "detalleOrdenAdmin"
            );


        const titulo =
            document.getElementById(
                "tituloOrdenAdmin"
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
        // 3. GUARDAR ÓRDENES
        // =================================================

        function guardarOrdenes(
            ordenes
        ) {

            localStorage.setItem(
                "ordenesAlbedo",
                JSON.stringify(
                    ordenes
                )
            );

        }



        // =================================================
        // 4. ESCAPAR HTML
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
        // 7. FORMATEAR NOMBRE
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
        // 8. COLOR DEL ESTADO
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
        // 9. ID DESDE LA URL
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
        // 10. BUSCAR ORDEN
        // =================================================

        let ordenes =
            obtenerOrdenes();


        const indiceOrden =
            ordenes.findIndex(
                function (orden) {

                    return (
                        String(
                            orden.id
                        ) ===
                        String(
                            idOrden
                        )
                    );

                }
            );



        // =================================================
        // 11. ORDEN NO ENCONTRADA
        // =================================================

        if (
            indiceOrden === -1
        ) {

            titulo.textContent =
                "Orden no encontrada";


            contenedor.innerHTML = `

                <div
                    class="alert alert-warning mb-0"
                >
                    No se encontró la orden solicitada.
                </div>

            `;


            return;

        }



        // =================================================
        // 12. RENDERIZAR ORDEN
        // =================================================

        function renderizarOrden() {

            ordenes =
                obtenerOrdenes();


            const orden =
                ordenes[
                    indiceOrden
                ];


            if (!orden) {

                return;

            }


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


            titulo.textContent =
                orden.numeroOrden;



            // =========================================
            // PRODUCTOS
            // =========================================

            const productos =
                Array.isArray(
                    orden.productos
                )
                    ? orden.productos
                    : [];


            const productosHTML =
                productos.length > 0
                    ? productos
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
                        .join("")
                    : `

                        <tr>

                            <td
                                colspan="5"
                                class="text-center text-secondary"
                            >
                                Sin productos registrados.
                            </td>

                        </tr>

                    `;



            // =========================================
            // CONTENIDO
            // =========================================

            contenedor.innerHTML = `

                <div class="row g-4">


                    <div class="col-12">

                        <p class="admin-etiqueta mb-2">
                            INFORMACIÓN DE LA ORDEN
                        </p>

                        <h2>
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
                            Estado actual
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

                                <h2>
                                    ${formatearPrecio(
                                        orden.total
                                    )}
                                </h2>

                            </div>

                        </div>

                    </div>



                    <div class="col-12">

                        <hr>

                        <p class="admin-etiqueta mb-3">
                            GESTIÓN DEL ESTADO
                        </p>

                    </div>



                    <div class="col-12 col-md-6">

                        <label
                            for="estadoOrdenAdmin"
                            class="form-label fw-semibold"
                        >
                            Estado del pedido
                        </label>

                        <select
                            class="form-select"
                            id="estadoOrdenAdmin"
                        >

                            <option
                                value="Pendiente"
                                ${estado === "Pendiente"
                                    ? "selected"
                                    : ""}
                            >
                                Pendiente
                            </option>

                            <option
                                value="Procesando"
                                ${estado === "Procesando"
                                    ? "selected"
                                    : ""}
                            >
                                Procesando
                            </option>

                            <option
                                value="Enviado"
                                ${estado === "Enviado"
                                    ? "selected"
                                    : ""}
                            >
                                Enviado
                            </option>

                            <option
                                value="Entregado"
                                ${estado === "Entregado"
                                    ? "selected"
                                    : ""}
                            >
                                Entregado
                            </option>

                        </select>

                    </div>



                    <div class="col-12 col-md-6 d-flex align-items-end">

                        <button
                            type="button"
                            class="btn btn-dark"
                            id="guardarEstadoOrden"
                        >
                            Guardar estado
                        </button>

                    </div>



                    <div class="col-12">

                        <div
                            id="mensajeEstadoOrden"
                            role="alert"
                        ></div>

                    </div>


                </div>

            `;



            // =========================================
            // BOTÓN GUARDAR ESTADO
            // =========================================

            const selector =
                document.getElementById(
                    "estadoOrdenAdmin"
                );


            const boton =
                document.getElementById(
                    "guardarEstadoOrden"
                );


            const mensaje =
                document.getElementById(
                    "mensajeEstadoOrden"
                );



            boton.addEventListener(
                "click",
                function () {

                    const nuevoEstado =
                        selector.value;


                    ordenes[
                        indiceOrden
                    ].estado =
                        nuevoEstado;


                    guardarOrdenes(
                        ordenes
                    );


                    mensaje.className =
                        "alert alert-success mt-3";


                    mensaje.textContent =
                        "Estado de la orden actualizado correctamente.";


                    setTimeout(
                        function () {

                            renderizarOrden();

                        },
                        700
                    );

                }
            );

        }



        // =================================================
        // 13. CARGAR DETALLE
        // =================================================

        renderizarOrden();


    }
);