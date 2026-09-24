// =====================================================
// DETALLE DE PEDIDO - CLIENTE
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
                    precio || 0
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
        // 8. OBTENER ID DESDE LA URL
        // =================================================

        const parametros =
            new URLSearchParams(
                window.location.search
            );


        const idPedido =
            parametros.get(
                "id"
            );



        // =================================================
        // 9. BUSCAR PEDIDO
        // =================================================

        const correoCliente =
            String(
                usuario.correo || ""
            )
                .trim()
                .toLowerCase();


        const orden =
            obtenerOrdenes()
                .find(
                    function (pedido) {

                        const correoPedido =
                            String(
                                pedido.cliente &&
                                pedido.cliente.correo
                                    ? pedido.cliente.correo
                                    : ""
                            )
                                .trim()
                                .toLowerCase();


                        return (
                            pedido.id === idPedido &&
                            correoPedido === correoCliente
                        );

                    }
                );



        // =================================================
        // 10. ELEMENTOS
        // =================================================

        const contenedor =
            document.getElementById(
                "detallePedidoCliente"
            );


        const error =
            document.getElementById(
                "pedidoNoDisponible"
            );



        // =================================================
        // 11. PEDIDO INVÁLIDO
        // =================================================

        if (!orden) {

            contenedor.style.display =
                "none";


            error.style.display =
                "block";


            return;

        }



        // =================================================
        // 12. PRODUCTOS
        // =================================================

        const productos =
            Array.isArray(
                orden.productos
            )
                ? orden.productos
                : [];


        const productosHTML =
            productos
                .map(
                    function (producto) {

                        return `

                            <article
                                class="
                                    border
                                    p-3
                                    p-md-4
                                    mb-3
                                "
                            >

                                <div
                                    class="
                                        row
                                        g-3
                                        align-items-center
                                    "
                                >

                                    <div
                                        class="
                                            col-12
                                            col-sm-3
                                            col-md-2
                                        "
                                    >

                                        ${
                                            producto.imagen
                                                ? `
                                                    <img
                                                        src="${producto.imagen}"
                                                        alt="${producto.nombre}"
                                                        class="img-fluid"
                                                        style="
                                                            max-height: 120px;
                                                            object-fit: contain;
                                                        "
                                                    >
                                                `
                                                : `
                                                    <div
                                                        class="
                                                            bg-light
                                                            d-flex
                                                            align-items-center
                                                            justify-content-center
                                                            p-3
                                                            text-secondary
                                                            small
                                                        "
                                                        style="
                                                            min-height: 100px;
                                                        "
                                                    >
                                                        Sin imagen
                                                    </div>
                                                `
                                        }

                                    </div>


                                    <div
                                        class="
                                            col-12
                                            col-sm-9
                                            col-md-10
                                        "
                                    >

                                        <div
                                            class="
                                                row
                                                g-3
                                            "
                                        >

                                            <div
                                                class="
                                                    col-12
                                                    col-md-5
                                                "
                                            >

                                                <small
                                                    class="
                                                        text-secondary
                                                        d-block
                                                    "
                                                >
                                                    Producto
                                                </small>

                                                <strong>
                                                    ${producto.nombre || "Producto"}
                                                </strong>

                                            </div>


                                            <div
                                                class="
                                                    col-6
                                                    col-md-2
                                                "
                                            >

                                                <small
                                                    class="
                                                        text-secondary
                                                        d-block
                                                    "
                                                >
                                                    Color
                                                </small>

                                                <span>
                                                    ${producto.color || "No especificado"}
                                                </span>

                                            </div>


                                            <div
                                                class="
                                                    col-6
                                                    col-md-2
                                                "
                                            >

                                                <small
                                                    class="
                                                        text-secondary
                                                        d-block
                                                    "
                                                >
                                                    Cantidad
                                                </small>

                                                <span>
                                                    ${producto.cantidad || 0}
                                                </span>

                                            </div>


                                            <div
                                                class="
                                                    col-6
                                                    col-md-3
                                                    text-md-end
                                                "
                                            >

                                                <small
                                                    class="
                                                        text-secondary
                                                        d-block
                                                    "
                                                >
                                                    Subtotal
                                                </small>

                                                <strong>
                                                    ${formatearPrecio(
                                                        producto.subtotal
                                                    )}
                                                </strong>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </article>

                        `;

                    }
                )
                .join("");



        // =================================================
        // 13. NOMBRE DEL CLIENTE
        // =================================================

        const nombreCliente =
            formatearNombre(
                [
                    orden.cliente
                        ? orden.cliente.nombre
                        : "",
                    orden.cliente
                        ? orden.cliente.apellidos
                        : ""
                ]
                    .filter(Boolean)
                    .join(" ")
            );



        // =================================================
        // 14. RENDERIZAR DETALLE
        // =================================================

        const estado =
            orden.estado ||
            "Pendiente";


        contenedor.innerHTML = `


            <div
                class="
                    border
                    bg-white
                    p-4
                    p-md-5
                    mb-4
                "
            >

                <p
                    class="
                        etiqueta
                        mb-2
                    "
                >
                    DETALLE DEL PEDIDO
                </p>


                <div
                    class="
                        d-flex
                        flex-column
                        flex-md-row
                        justify-content-between
                        gap-4
                    "
                >

                    <div>

                        <h1
                            class="
                                display-6
                                fw-bold
                                mb-2
                            "
                        >
                            ${orden.numeroOrden}
                        </h1>

                        <p
                            class="
                                text-secondary
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
                                fs-6
                            "
                        >
                            ${String(estado).toUpperCase()}
                        </span>

                    </div>

                </div>

            </div>



            <div
                class="
                    border
                    bg-white
                    p-4
                    mb-4
                "
            >

                <p
                    class="
                        etiqueta
                        mb-3
                    "
                >
                    INFORMACIÓN DEL CLIENTE
                </p>


                <div
                    class="
                        row
                        g-4
                    "
                >

                    <div
                        class="
                            col-12
                            col-md-6
                        "
                    >

                        <small
                            class="
                                text-secondary
                                d-block
                            "
                        >
                            Cliente
                        </small>

                        <strong>
                            ${nombreCliente}
                        </strong>

                    </div>


                    <div
                        class="
                            col-12
                            col-md-6
                        "
                    >

                        <small
                            class="
                                text-secondary
                                d-block
                            "
                        >
                            Correo
                        </small>

                        <strong>
                            ${
                                orden.cliente &&
                                orden.cliente.correo
                                    ? orden.cliente.correo
                                    : ""
                            }
                        </strong>

                    </div>

                </div>

            </div>



            <div
                class="
                    border
                    bg-white
                    p-4
                    mb-4
                "
            >

                <p
                    class="
                        etiqueta
                        mb-3
                    "
                >
                    PRODUCTOS
                </p>


                ${productosHTML}


                <div
                    class="
                        d-flex
                        justify-content-between
                        align-items-center
                        border-top
                        pt-4
                        mt-4
                        gap-3
                    "
                >

                    <strong>
                        Total de la orden
                    </strong>

                    <span
                        class="
                            fs-4
                            fw-bold
                        "
                    >
                        ${formatearPrecio(
                            orden.total
                        )}
                    </span>

                </div>

            </div>



            <div
                class="
                    alert
                    alert-light
                    border
                    mb-0
                "
            >

                <strong>
                    Seguimiento del pedido
                </strong>

                <p class="mb-0 mt-2">

                    Puedes consultar el estado de tu pedido
                    desde esta página.

                    El estado es administrado por ALBEDO
                    Outdoor y no puede ser modificado
                    por el Cliente.

                </p>

            </div>

        `;


    }
);