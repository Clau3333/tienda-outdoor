// =====================================================
// DETALLE DE PRODUCTO DEL VENDEDOR
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
                "detalleProductoVendedor"
            );


        const titulo =
            document.getElementById(
                "detalleNombrePrincipal"
            );



        if (!contenedor) {

            return;

        }



        // =================================================
        // 2. ESCAPAR HTML
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
        // 3. FORMATEAR PRECIO
        // =================================================

        function formatearPrecio(
            precio
        ) {

            return (
                "$" +
                Number(
                    precio || 0
                ).toLocaleString(
                    "es-CL",
                    {
                        maximumFractionDigits:
                            2
                    }
                )
            );

        }



        // =================================================
        // 4. OBTENER STOCK
        // =================================================

        function obtenerStock(
            producto
        ) {

            const valor =
                Number(
                    producto.stock
                );


            if (
                Number.isFinite(
                    valor
                )
            ) {

                return valor;

            }


            return 10;

        }



        // =================================================
        // 5. OBTENER STOCK CRÍTICO
        // =================================================

        function obtenerStockCritico(
            producto
        ) {

            if (
                producto.stockCritico === "" ||
                producto.stockCritico === null ||
                producto.stockCritico === undefined
            ) {

                return 3;

            }


            const valor =
                Number(
                    producto.stockCritico
                );


            if (
                Number.isFinite(
                    valor
                )
            ) {

                return valor;

            }


            return 3;

        }



        // =================================================
        // 6. DETERMINAR ESTADO
        // =================================================

        function obtenerEstado(
            producto
        ) {

            const stock =
                obtenerStock(
                    producto
                );


            const critico =
                obtenerStockCritico(
                    producto
                );


            if (
                stock === 0
            ) {

                return {

                    texto:
                        "Sin stock",

                    clase:
                        "text-bg-danger"

                };

            }


            if (
                stock <= critico
            ) {

                return {

                    texto:
                        "Stock crítico",

                    clase:
                        "text-bg-warning"

                };

            }


            return {

                texto:
                    "Disponible",

                clase:
                    "text-bg-success"

            };

        }



        // =================================================
        // 7. LEER ID DESDE LA URL
        // =================================================

        const parametros =
            new URLSearchParams(
                window.location.search
            );


        const idProducto =
            parametros.get(
                "id"
            );



        // =================================================
        // 8. BUSCAR PRODUCTO
        // =================================================

        const producto =
            Array.isArray(
                productos
            )
                ? productos.find(
                    function (item) {

                        return (
                            String(
                                item.id
                            ) ===
                            String(
                                idProducto
                            )
                        );

                    }
                )
                : null;



        // =================================================
        // 9. PRODUCTO NO ENCONTRADO
        // =================================================

        if (!producto) {

            if (titulo) {

                titulo.textContent =
                    "Producto no encontrado";

            }


            contenedor.innerHTML = `

                <div
                    class="alert alert-warning mb-0"
                    role="alert"
                >
                    No se encontró el producto solicitado.
                </div>

            `;


            return;

        }



        // =================================================
        // 10. PREPARAR INFORMACIÓN
        // =================================================

        const stock =
            obtenerStock(
                producto
            );


        const stockCritico =
            obtenerStockCritico(
                producto
            );


        const estado =
            obtenerEstado(
                producto
            );


        const codigo =
            producto.codigo &&
            String(
                producto.codigo
            ).trim() !== ""
                ? producto.codigo
                : producto.id;


        const descripcion =
            producto.descripcion &&
            String(
                producto.descripcion
            ).trim() !== ""
                ? producto.descripcion
                : "Sin descripción disponible.";



        if (titulo) {

            titulo.textContent =
                producto.nombre;

        }



        // =================================================
        // 11. IMAGEN
        // =================================================

        let imagenHTML = "";


        if (
            producto.imagen &&
            producto.imagen !==
                "img/logo-albedo.png"
        ) {

            imagenHTML = `

                <div class="col-12 col-lg-4">

                    <div
                        class="border p-3 bg-white text-center"
                    >

                        <img
                            src="${escaparHTML(
                                producto.imagen
                            )}"
                            alt="${escaparHTML(
                                producto.nombre
                            )}"
                            class="img-fluid"
                            style="
                                max-height: 340px;
                                object-fit: contain;
                            "
                        >

                    </div>

                </div>

            `;

        } else {

            imagenHTML = `

                <div class="col-12 col-lg-4">

                    <div
                        class="border p-5 bg-light text-center text-secondary"
                    >
                        Sin imagen disponible
                    </div>

                </div>

            `;

        }



        // =================================================
        // 12. MOSTRAR DETALLE
        // =================================================

        contenedor.innerHTML = `

            <div class="row g-4 align-items-start">


                ${imagenHTML}


                <div class="col-12 col-lg-8">


                    <p class="admin-etiqueta mb-2">
                        INFORMACIÓN DEL PRODUCTO
                    </p>


                    <h2 class="mb-4">
                        ${escaparHTML(
                            producto.nombre
                        )}
                    </h2>


                    <div class="row g-3">


                        <div class="col-12 col-md-6">

                            <strong>
                                Código
                            </strong>

                            <p>
                                ${escaparHTML(
                                    codigo
                                )}
                            </p>

                        </div>


                        <div class="col-12 col-md-6">

                            <strong>
                                Categoría
                            </strong>

                            <p>
                                ${escaparHTML(
                                    producto.categoria
                                )}
                            </p>

                        </div>


                        <div class="col-12 col-md-6">

                            <strong>
                                Precio
                            </strong>

                            <p>
                                ${formatearPrecio(
                                    producto.precio
                                )}
                            </p>

                        </div>


                        <div class="col-12 col-md-6">

                            <strong>
                                Estado
                            </strong>

                            <p class="mt-1">

                                <span
                                    class="badge ${estado.clase}"
                                >
                                    ${estado.texto}
                                </span>

                            </p>

                        </div>


                        <div class="col-12 col-md-6">

                            <strong>
                                Stock actual
                            </strong>

                            <p>
                                ${stock}
                            </p>

                        </div>


                        <div class="col-12 col-md-6">

                            <strong>
                                Stock crítico
                            </strong>

                            <p>
                                ${stockCritico}
                            </p>

                        </div>


                        <div class="col-12">

                            <strong>
                                Descripción
                            </strong>

                            <p class="mt-2 mb-0">
                                ${escaparHTML(
                                    descripcion
                                )}
                            </p>

                        </div>


                    </div>


                    <div
                        class="alert alert-secondary mt-4 mb-0"
                        role="status"
                    >
                        Perfil Vendedor:
                        esta información es únicamente
                        de consulta y no puede ser modificada
                        desde esta vista.
                    </div>


                </div>


            </div>

        `;


    }
);