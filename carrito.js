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

        const carrito =
            JSON.parse(
                localStorage.getItem(
                    "carritoAlbedo"
                )
            );


        return Array.isArray(
            carrito
        )
            ? carrito
            : [];

    } catch (error) {

        return [];

    }

}



// =====================================================
// 3. GUARDAR CARRITO
// =====================================================

function guardarCarrito(
    carrito
) {

    localStorage.setItem(
        "carritoAlbedo",
        JSON.stringify(
            carrito
        )
    );

}



// =====================================================
// 4. OBTENER ÓRDENES
// =====================================================

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



// =====================================================
// 5. GUARDAR ÓRDENES
// =====================================================

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



// =====================================================
// 6. OBTENER SESIÓN
// =====================================================

function obtenerUsuarioSesion() {

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



// =====================================================
// 7. GENERAR NÚMERO DE ORDEN
// =====================================================

function generarNumeroOrden(
    ordenes
) {

    let numeroMayor =
        0;


    ordenes.forEach(
        function (orden) {

            const coincidencia =
                String(
                    orden.numeroOrden || ""
                ).match(
                    /ORD-(\d+)/
                );


            if (
                coincidencia
            ) {

                const numero =
                    parseInt(
                        coincidencia[1],
                        10
                    );


                if (
                    numero > numeroMayor
                ) {

                    numeroMayor =
                        numero;

                }

            }

        }
    );


    return (
        "ORD-" +
        String(
            numeroMayor + 1
        ).padStart(
            4,
            "0"
        )
    );

}



// =====================================================
// 8. CREAR ORDEN
// =====================================================

function crearOrdenDesdeCarrito(
    carrito
) {

    const ordenes =
        obtenerOrdenes();


    const usuario =
        obtenerUsuarioSesion();


    const total =
        carrito.reduce(
            function (
                suma,
                item
            ) {

                return (
                    suma +
                    (
                        Number(
                            item.precio
                        ) *
                        Number(
                            item.cantidad
                        )
                    )
                );

            },
            0
        );


    const ahora =
        new Date();


    const orden = {

        id:
            "orden-" +
            Date.now(),

        numeroOrden:
            generarNumeroOrden(
                ordenes
            ),

        fecha:
            ahora.toISOString(),

        fechaTexto:
            ahora.toLocaleString(
                "es-CL"
            ),

        estado:
            "Pendiente",

        cliente: {

            nombre:
                usuario
                    ? usuario.nombre || ""
                    : "Cliente",

            apellidos:
                usuario
                    ? usuario.apellidos || ""
                    : "",

            correo:
                usuario
                    ? usuario.correo || ""
                    : "Sin sesión",

            run:
                usuario
                    ? usuario.run || ""
                    : ""

        },

        productos:
            carrito.map(
                function (item) {

                    return {

                        id:
                            item.id,

                        nombre:
                            item.nombre,

                        precio:
                            Number(
                                item.precio
                            ),

                        cantidad:
                            Number(
                                item.cantidad
                            ),

                        color:
                            item.color || "",

                        imagen:
                            item.imagen || "",

                        subtotal:
                            Number(
                                item.precio
                            ) *
                            Number(
                                item.cantidad
                            )

                    };

                }
            ),

        total:
            total

    };


    ordenes.push(
        orden
    );


    guardarOrdenes(
        ordenes
    );


    return orden;

}



// =====================================================
// 9. AGREGAR PRODUCTO
// =====================================================

function agregarAlCarrito(
    item
) {

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


    if (
        existente
    ) {

        existente.cantidad +=
            item.cantidad;

    } else {

        carrito.push(
            item
        );

    }


    guardarCarrito(
        carrito
    );


    actualizarContadorCarrito();

}



// =====================================================
// 10. FORMATEAR PRECIO
// =====================================================

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



// =====================================================
// 11. CONTADOR DEL CARRITO
// =====================================================

function actualizarContadorCarrito() {

    const contador =
        document.getElementById(
            "contadorCarrito"
        );


    if (
        !contador
    ) {

        return;

    }


    const carrito =
        obtenerCarrito();


    const totalItems =
        carrito.reduce(
            function (
                total,
                item
            ) {

                return (
                    total +
                    Number(
                        item.cantidad
                    )
                );

            },
            0
        );


    contador.textContent =
        totalItems;

}



// =====================================================
// 12. PÁGINA DEL CARRITO
// =====================================================

function inicializarPaginaCarrito() {

    const lista =
        document.getElementById(
            "carritoLista"
        );


    if (
        !lista
    ) {

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
    // 13. VACIAR CARRITO
    // =================================================

    botonVaciar.addEventListener(
        "click",
        function () {

            guardarCarrito(
                []
            );


            limpiarMensajeCompra();


            renderizarCarrito();

        }
    );



    // =================================================
    // 14. FINALIZAR COMPRA
    // =================================================

    botonFinalizar.addEventListener(
        "click",
        function () {

            const carrito =
                obtenerCarrito();


            if (
                carrito.length === 0
            ) {

                mensaje.className =
                    "alert alert-danger mt-3";


                mensaje.textContent =
                    "Tu carrito está vacío.";


                return;

            }



            // =========================================
            // CREAR ORDEN ANTES DE VACIAR CARRITO
            // =========================================

            const orden =
                crearOrdenDesdeCarrito(
                    carrito
                );



            // =========================================
            // VACIAR CARRITO
            // =========================================

            guardarCarrito(
                []
            );



            // =========================================
            // ACTUALIZAR PANTALLA
            // =========================================

            renderizarCarrito();



            vacio.style.display =
                "none";



            // =========================================
            // MENSAJE DE COMPRA EXITOSA
            // =========================================

            mensaje.className =
                "alert alert-success mt-3 p-4";


            mensaje.innerHTML = `

                <h2 class="h5 mb-2">
                    Compra realizada con éxito
                </h2>

                <p class="mb-1">
                    Tu orden fue registrada correctamente.
                </p>

                <p class="mb-3">
                    Número de orden:
                    <strong>
                        ${orden.numeroOrden}
                    </strong>
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
    // 15. LIMPIAR MENSAJE
    // =================================================

    function limpiarMensajeCompra() {

        mensaje.className =
            "";


        mensaje.innerHTML =
            "";

    }



    // =================================================
    // 16. RENDERIZAR CARRITO
    // =================================================

    function renderizarCarrito() {

        const carrito =
            obtenerCarrito();


        actualizarContadorCarrito();



        // =============================================
        // CARRITO VACÍO
        // =============================================

        if (
            carrito.length === 0
        ) {

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
                            Number(
                                item.precio
                            ) *
                            Number(
                                item.cantidad
                            );


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
                            Number(
                                item.precio
                            ) *
                            Number(
                                item.cantidad
                            )
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
                function (
                    input
                ) {

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
                function (
                    boton
                ) {

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
    // 17. CARGAR CARRITO
    // =================================================

    renderizarCarrito();

}