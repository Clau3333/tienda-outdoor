// =====================================================
// MIS PEDIDOS - CLIENTE
// ALBEDO OUTDOOR
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // =================================================
        // 1. OBTENER SESIÓN
        // =================================================

        function obtenerSesion() {

            try {

                const usuario =
                    JSON.parse(
                        localStorage.getItem(
                            "usuarioSesionAlbedo"
                        )
                    );


                return usuario || null;

            } catch (error) {

                return null;

            }

        }



        // =================================================
        // 2. PROTEGER VISTA
        // =================================================

        const usuario =
            obtenerSesion();


        if (!usuario) {

            window.location.href =
                "login.html";

            return;

        }


        if (
            usuario.tipoUsuario !==
            "Cliente"
        ) {

            if (
                usuario.tipoUsuario ===
                "Administrador"
            ) {

                window.location.href =
                    "admin.html";

                return;

            }


            if (
                usuario.tipoUsuario ===
                "Vendedor"
            ) {

                window.location.href =
                    "vendedor.html";

                return;

            }


            window.location.href =
                "index.html";

            return;

        }



        // =================================================
        // 3. OBTENER ÓRDENES
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
        // 4. FORMATEAR PRECIO
        // =================================================

        function formatearPrecio(
            precio
        ) {

            return (
                "$" +
                Number(
                    precio
                ).toLocaleString(
                    "es-CL"
                )
            );

        }



        // =================================================
        // 5. FORMATEAR FECHA
        // =================================================

        function formatearFecha(
            orden
        ) {

            if (
                orden.fechaTexto
            ) {

                return orden.fechaTexto;

            }


            if (
                orden.fecha
            ) {

                const fecha =
                    new Date(
                        orden.fecha
                    );


                if (
                    !isNaN(
                        fecha.getTime()
                    )
                ) {

                    return fecha.toLocaleString(
                        "es-CL"
                    );

                }

            }


            return "Sin fecha";

        }



        // =================================================
        // 6. CLASE DEL ESTADO
        // =================================================

        function obtenerClaseEstado(
            estado
        ) {

            switch (
                String(
                    estado || ""
                ).toLowerCase()
            ) {

                case "pendiente":

                    return "text-bg-warning";


                case "procesando":

                    return "text-bg-info";


                case "enviado":

                    return "text-bg-primary";


                case "entregado":

                    return "text-bg-success";


                default:

                    return "text-bg-secondary";

            }

        }



        // =================================================
        // 7. FILTRAR PEDIDOS DEL CLIENTE
        // =================================================

        const correoCliente =
            String(
                usuario.correo || ""
            )
                .trim()
                .toLowerCase();


        const pedidosCliente =
            obtenerOrdenes()
                .filter(
                    function (orden) {

                        const correoOrden =
                            String(
                                orden.cliente &&
                                orden.cliente.correo
                                    ? orden.cliente.correo
                                    : ""
                            )
                                .trim()
                                .toLowerCase();


                        return (
                            correoOrden ===
                            correoCliente
                        );

                    }
                )
                .reverse();



        // =================================================
        // 8. ELEMENTOS
        // =================================================

        const lista =
            document.getElementById(
                "listaMisPedidos"
            );


        const sinPedidos =
            document.getElementById(
                "sinPedidos"
            );


        const cantidadPedidos =
            document.getElementById(
                "cantidadPedidos"
            );


        const cantidadEnProceso =
            document.getElementById(
                "cantidadEnProceso"
            );


        const cantidadEntregados =
            document.getElementById(
                "cantidadEntregados"
            );



        // =================================================
        // 9. CONTADORES
        // =================================================

        cantidadPedidos.textContent =
            pedidosCliente.length;


        cantidadEnProceso.textContent =
            pedidosCliente.filter(
                function (orden) {

                    return (
                        orden.estado !==
                        "Entregado"
                    );

                }
            ).length;


        cantidadEntregados.textContent =
            pedidosCliente.filter(
                function (orden) {

                    return (
                        orden.estado ===
                        "Entregado"
                    );

                }
            ).length;



        // =================================================
        // 10. SIN PEDIDOS
        // =================================================

        if (
            pedidosCliente.length === 0
        ) {

            lista.style.display =
                "none";


            sinPedidos.style.display =
                "block";


            return;

        }



        // =================================================
        // 11. MOSTRAR PEDIDOS
        // =================================================

        lista.innerHTML =
            pedidosCliente
                .map(
                    function (orden) {

                        const estado =
                            orden.estado ||
                            "Pendiente";


                        return `

                            <article
                                class="border bg-white p-4"
                            >


                                <div
                                    class="
                                        d-flex
                                        flex-column
                                        flex-md-row
                                        justify-content-between
                                        gap-3
                                        mb-4
                                    "
                                >


                                    <div>

                                        <p
                                            class="
                                                etiqueta
                                                mb-2
                                            "
                                        >
                                            PEDIDO
                                        </p>


                                        <h2
                                            class="
                                                h4
                                                mb-1
                                            "
                                        >
                                            ${orden.numeroOrden}
                                        </h2>


                                        <p
                                            class="
                                                text-secondary
                                                small
                                                mb-0
                                            "
                                        >
                                            ${formatearFecha(orden)}
                                        </p>

                                    </div>



                                    <div
                                        class="
                                            text-md-end
                                        "
                                    >

                                        <p
                                            class="
                                                small
                                                fw-semibold
                                                mb-2
                                            "
                                        >
                                            Estado actual
                                        </p>


                                        <span
                                            class="
                                                badge
                                                ${obtenerClaseEstado(estado)}
                                            "
                                        >
                                            ${String(estado).toUpperCase()}
                                        </span>

                                    </div>


                                </div>



                                <div
                                    class="
                                        row
                                        g-3
                                        align-items-end
                                    "
                                >


                                    <div
                                        class="
                                            col-12
                                            col-md-4
                                        "
                                    >

                                        <small
                                            class="
                                                text-secondary
                                                d-block
                                            "
                                        >
                                            Productos
                                        </small>


                                        <strong>
                                            ${
                                                Array.isArray(
                                                    orden.productos
                                                )
                                                    ? orden.productos.reduce(
                                                        function (
                                                            total,
                                                            producto
                                                        ) {

                                                            return (
                                                                total +
                                                                Number(
                                                                    producto.cantidad ||
                                                                    0
                                                                )
                                                            );

                                                        },
                                                        0
                                                    )
                                                    : 0
                                            }
                                        </strong>

                                    </div>



                                    <div
                                        class="
                                            col-12
                                            col-md-4
                                        "
                                    >

                                        <small
                                            class="
                                                text-secondary
                                                d-block
                                            "
                                        >
                                            Total
                                        </small>


                                        <strong>
                                            ${formatearPrecio(
                                                orden.total
                                            )}
                                        </strong>

                                    </div>



                                    <div
                                        class="
                                            col-12
                                            col-md-4
                                            text-md-end
                                        "
                                    >

                                        <a
                                            href="pedido-detalle.html?id=${encodeURIComponent(
                                                orden.id
                                            )}"
                                            class="
                                                btn
                                                btn-outline-dark
                                            "
                                        >
                                            Ver detalle
                                        </a>

                                    </div>


                                </div>


                            </article>

                        `;

                    }
                )
                .join("");


    }
);