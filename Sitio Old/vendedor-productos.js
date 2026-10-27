// =====================================================
// PRODUCTOS DEL VENDEDOR - ALBEDO OUTDOOR
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
                "listaProductosVendedor"
            );


        const cantidadProductos =
            document.getElementById(
                "cantidadProductosVendedor"
            );


        const cantidadStockCritico =
            document.getElementById(
                "cantidadStockCritico"
            );


        const cantidadSinStock =
            document.getElementById(
                "cantidadSinStock"
            );



        if (!lista) {

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
        // 4. GENERAR CÓDIGO DE RESPALDO
        // =================================================

        function generarCodigoRespaldo(
            producto,
            indice
        ) {

            if (
                producto.codigo &&
                String(
                    producto.codigo
                ).trim() !== ""
            ) {

                return producto.codigo;

            }



            let prefijo =
                "PRO";


            if (
                producto.categoria ===
                "Chaquetas"
            ) {

                prefijo =
                    "CHA";

            }


            if (
                producto.categoria ===
                "Polerones y polar"
            ) {

                prefijo =
                    "POL";

            }


            if (
                producto.categoria ===
                "Pantalones"
            ) {

                prefijo =
                    "PAN";

            }



            return (
                prefijo +
                String(
                    indice + 1
                ).padStart(
                    3,
                    "0"
                )
            );

        }



        // =================================================
        // 5. STOCK
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
        // 6. STOCK CRÍTICO
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
        // 7. ESTADO DEL PRODUCTO
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
        // 8. PRODUCTOS
        // =================================================

        const listaProductos =
            Array.isArray(
                productos
            )
                ? productos
                : [];



        // =================================================
        // 9. CONTADORES
        // =================================================

        const productosCriticos =
            listaProductos.filter(
                function (producto) {

                    const stock =
                        obtenerStock(
                            producto
                        );


                    const critico =
                        obtenerStockCritico(
                            producto
                        );


                    return (
                        stock > 0 &&
                        stock <= critico
                    );

                }
            );


        const productosSinStock =
            listaProductos.filter(
                function (producto) {

                    return (
                        obtenerStock(
                            producto
                        ) === 0
                    );

                }
            );



        if (
            cantidadProductos
        ) {

            cantidadProductos.textContent =
                listaProductos.length;

        }


        if (
            cantidadStockCritico
        ) {

            cantidadStockCritico.textContent =
                productosCriticos.length;

        }


        if (
            cantidadSinStock
        ) {

            cantidadSinStock.textContent =
                productosSinStock.length;

        }



        // =================================================
        // 10. SIN PRODUCTOS
        // =================================================

        if (
            listaProductos.length === 0
        ) {

            lista.innerHTML = `

                <tr>

                    <td
                        colspan="8"
                        class="text-secondary text-center py-4"
                    >
                        No hay productos registrados.
                    </td>

                </tr>

            `;


            return;

        }



        // =================================================
        // 11. MOSTRAR PRODUCTOS
        // =================================================

        lista.innerHTML =
            listaProductos
                .map(
                    function (
                        producto,
                        indice
                    ) {


                        const codigo =
                            generarCodigoRespaldo(
                                producto,
                                indice
                            );


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



                        return `

                            <tr>

                                <td>
                                    ${escaparHTML(
                                        codigo
                                    )}
                                </td>

                                <td>

                                    <strong>
                                        ${escaparHTML(
                                            producto.nombre
                                        )}
                                    </strong>

                                </td>

                                <td>
                                    ${escaparHTML(
                                        producto.categoria
                                    )}
                                </td>

                                <td>
                                    ${formatearPrecio(
                                        producto.precio
                                    )}
                                </td>

                                <td>
                                    ${stock}
                                </td>

                                <td>
                                    ${stockCritico}
                                </td>

                                <td>

                                    <span
                                        class="badge ${estado.clase}"
                                    >
                                        ${estado.texto}
                                    </span>

                                </td>

                                <td>

                                    <a
                                        class="btn btn-sm btn-outline-dark"
                                        href="vendedor-producto-detalle.html?id=${encodeURIComponent(
                                            producto.id
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