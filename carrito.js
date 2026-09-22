// =====================================================
// 1. CARRITO DE COMPRAS - ALBEDO OUTDOOR
// Persistencia mediante localStorage
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        actualizarContadorCarrito();

        inicializarPaginaCarrito();

    }
);



// =====================================================
// 2. OBTENER CARRITO
// =====================================================

function obtenerCarrito() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "carritoAlbedo"
            )
        ) || [];

    } catch (error) {

        return [];

    }

}



// =====================================================
// 3. GUARDAR CARRITO
// =====================================================

function guardarCarrito(carrito) {

    localStorage.setItem(
        "carritoAlbedo",
        JSON.stringify(carrito)
    );

}



// =====================================================
// 4. AGREGAR PRODUCTO
// =====================================================

function agregarAlCarrito(item) {

    const carrito =
        obtenerCarrito();


    const existente =
        carrito.find(
            function (producto) {

                return (
                    producto.id === item.id &&
                    producto.color === item.color
                );

            }
        );


    if (existente) {

        existente.cantidad +=
            item.cantidad;

    } else {

        carrito.push(item);

    }


    guardarCarrito(carrito);

    actualizarContadorCarrito();

}



// =====================================================
// 5. FORMATEAR PRECIO
// =====================================================

function formatearPrecio(precio) {

    return (
        "$" +
        precio.toLocaleString("es-CL")
    );

}



// =====================================================
// 6. CONTADOR DEL CARRITO
// =====================================================

function actualizarContadorCarrito() {

    const contador =
        document.getElementById(
            "contadorCarrito"
        );


    if (!contador) {

        return;

    }


    const carrito =
        obtenerCarrito();


    const totalItems =
        carrito.reduce(
            function (total, item) {

                return (
                    total +
                    item.cantidad
                );

            },
            0
        );


    contador.textContent =
        totalItems;

}



// =====================================================
// 7. PÁGINA DEL CARRITO
// =====================================================

function inicializarPaginaCarrito() {

    const lista =
        document.getElementById(
            "carritoLista"
        );


    if (!lista) {

        return;

    }



    const vacio =
        document.getElementById(
            "carritoVacio"
        );


    const contenido =
        document.getElementById(
            "carritoContenido"
        );


    const total =
        document.getElementById(
            "carritoTotal"
        );


    const mensaje =
        document.getElementById(
            "mensajeCompra"
        );


    const botonVaciar =
        document.getElementById(
            "botonVaciarCarrito"
        );


    const botonFinalizar =
        document.getElementById(
            "botonFinalizarCompra"
        );



    // =================================================
    // 8. VACIAR CARRITO
    // =================================================

    botonVaciar.addEventListener(
        "click",
        function () {

            guardarCarrito([]);


            limpiarMensajeCompra();


            renderizarCarrito();

        }
    );



    // =================================================
    // 9. FINALIZAR COMPRA
    // =================================================

    botonFinalizar.addEventListener(
        "click",
        function () {

            const carrito =
                obtenerCarrito();


            if (carrito.length === 0) {

                mensaje.className =
                    "alert alert-danger mt-3";


                mensaje.textContent =
                    "Tu carrito está vacío.";


                return;

            }



            // Guardamos el carrito vacío
            guardarCarrito([]);



            // Actualizamos la pantalla
            renderizarCarrito();



            // Después de una compra exitosa,
            // ocultamos el mensaje gris de carrito vacío.
            vacio.style.display =
                "none";



            // Mostramos solamente el estado exitoso.
            mensaje.className =
                "alert alert-success mt-3 p-4";


            mensaje.innerHTML = `

                <h2 class="h5 mb-2">
                    Compra realizada con éxito
                </h2>

                <p class="mb-3">
                    ¡Gracias por tu compra en ALBEDO Outdoor!
                </p>

                <a
                    href="productos.html"
                    class="btn btn-dark"
                >
                    Seguir comprando
                </a>

            `;

        }
    );



    // =================================================
    // 10. LIMPIAR MENSAJE DE COMPRA
    // =================================================

    function limpiarMensajeCompra() {

        mensaje.className =
            "";

        mensaje.innerHTML =
            "";

    }



    // =================================================
    // 11. RENDERIZAR CARRITO
    // =================================================

    function renderizarCarrito() {

        const carrito =
            obtenerCarrito();


        actualizarContadorCarrito();



        // =============================================
        // CARRITO VACÍO
        // =============================================

        if (carrito.length === 0) {

            vacio.style.display =
                "block";

            contenido.style.display =
                "none";


            return;

        }



        // =============================================
        // CARRITO CON PRODUCTOS
        // =============================================

        vacio.style.display =
            "none";

        contenido.style.display =
            "block";



        // =============================================
        // CREAR FILAS
        // =============================================

        lista.innerHTML =
            carrito
                .map(
                    function (
                        item,
                        indice
                    ) {

                        const subtotal =
                            item.precio *
                            item.cantidad;


                        return `

                            <tr>


                                <td class="carrito-producto">

                                    <img
                                        src="${item.imagen}"
                                        alt="${item.nombre}"
                                    >

                                    <span>
                                        ${item.nombre}
                                    </span>

                                </td>


                                <td>
                                    ${item.color || "-"}
                                </td>


                                <td>
                                    ${formatearPrecio(
                                        item.precio
                                    )}
                                </td>


                                <td>

                                    <input
                                        type="number"
                                        class="form-control carrito-input-cantidad"
                                        min="1"
                                        value="${item.cantidad}"
                                        data-indice="${indice}"
                                        aria-label="Cantidad de ${item.nombre}"
                                    >

                                </td>


                                <td>

                                    ${formatearPrecio(
                                        subtotal
                                    )}

                                </td>


                                <td>

                                    <button
                                        class="carrito-eliminar"
                                        type="button"
                                        data-indice="${indice}"
                                        aria-label="Eliminar ${item.nombre} del carrito"
                                    >
                                        ✕
                                    </button>

                                </td>


                            </tr>

                        `;

                    }
                )
                .join("");



        // =============================================
        // TOTAL GENERAL
        // =============================================

        const totalGeneral =
            carrito.reduce(
                function (
                    suma,
                    item
                ) {

                    return (
                        suma +
                        (
                            item.precio *
                            item.cantidad
                        )
                    );

                },
                0
            );


        total.textContent =
            formatearPrecio(
                totalGeneral
            );



        // =============================================
        // CAMBIAR CANTIDADES
        // =============================================

        lista
            .querySelectorAll(
                ".carrito-input-cantidad"
            )
            .forEach(
                function (input) {

                    input.addEventListener(
                        "change",
                        function () {

                            const carritoActual =
                                obtenerCarrito();


                            const indice =
                                parseInt(
                                    input.dataset.indice,
                                    10
                                );


                            let nuevaCantidad =
                                parseInt(
                                    input.value,
                                    10
                                );


                            if (
                                !nuevaCantidad ||
                                nuevaCantidad < 1
                            ) {

                                nuevaCantidad =
                                    1;

                            }


                            carritoActual[
                                indice
                            ].cantidad =
                                nuevaCantidad;


                            guardarCarrito(
                                carritoActual
                            );


                            limpiarMensajeCompra();


                            renderizarCarrito();

                        }
                    );

                }
            );



        // =============================================
        // ELIMINAR PRODUCTOS
        // =============================================

        lista
            .querySelectorAll(
                ".carrito-eliminar"
            )
            .forEach(
                function (boton) {

                    boton.addEventListener(
                        "click",
                        function () {

                            const carritoActual =
                                obtenerCarrito();


                            const indice =
                                parseInt(
                                    boton.dataset.indice,
                                    10
                                );


                            carritoActual.splice(
                                indice,
                                1
                            );


                            guardarCarrito(
                                carritoActual
                            );


                            limpiarMensajeCompra();


                            renderizarCarrito();

                        }
                    );

                }
            );

    }



    // =================================================
    // 12. CARGAR CARRITO AL ABRIR LA PÁGINA
    // =================================================

    renderizarCarrito();

}