// =====================================================
// CATÁLOGO DE PRODUCTOS - ALBEDO OUTDOOR
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // =================================================
        // 1. BUSCAR CONTENEDORES POR CATEGORÍA
        // =================================================

        const contenedores =
            document.querySelectorAll(
                ".catalogo-grid[data-categoria]"
            );


        contenedores.forEach(
            function (contenedor) {


                const categoria =
                    contenedor.dataset.categoria;


                const productosFiltrados =
                    productos.filter(
                        function (producto) {

                            return (
                                producto.categoria ===
                                categoria
                            );

                        }
                    );


                contenedor.innerHTML =
                    productosFiltrados
                        .map(
                            function (producto) {

                                return crearTarjeta(
                                    producto
                                );

                            }
                        )
                        .join("");

            }
        );


        activarColores();

        activarBotonesCarrito();


    }
);



// =====================================================
// 2. CREAR TARJETA
// =====================================================

function crearTarjeta(producto) {


    let coloresHTML = "";


    if (
        producto.colores &&
        producto.colores.length > 0
    ) {


        coloresHTML = `

            <div class="colores-producto">

                ${producto.colores
                    .map(
                        function (color) {


                            const activo =
                                color.imagen ===
                                producto.imagen
                                    ? "activo"
                                    : "";


                            return `

                                <button
                                    class="color-swatch ${activo}"
                                    type="button"
                                    data-imagen="${color.imagen}"
                                    data-nombre="${color.nombre}"
                                    aria-label="${producto.nombre} color ${color.nombre}"
                                    title="${color.nombre}"
                                    style="--color-producto: ${color.color};"
                                ></button>

                            `;

                        }
                    )
                    .join("")}

            </div>

        `;

    }



    // =================================================
    // 3. DETERMINAR SI HAY UNA IMAGEN REAL
    // =================================================

    const esProductoNuevoSinImagen =
        producto.id &&
        producto.id.startsWith(
            "admin-"
        ) &&
        (
            !producto.imagen ||
            producto.imagen ===
                "img/logo-albedo.png"
        );



    let imagenHTML = "";


    if (
        esProductoNuevoSinImagen
    ) {


        imagenHTML = `

            <a
                class="catalogo-imagen"
                href="producto-detalle.html?id=${producto.id}"
                aria-label="Ver detalle de ${producto.nombre}"
                style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 20px;
                "
            >

                <span
                    style="
                        color: #686b6d;
                        font-size: 12px;
                        font-weight: 600;
                        letter-spacing: 0.4px;
                    "
                >
                    Sin imagen disponible
                </span>

            </a>

        `;


    } else {


        imagenHTML = `

            <a
                class="catalogo-imagen"
                href="producto-detalle.html?id=${producto.id}"
            >

                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                >

            </a>

        `;

    }



    // =================================================
    // 4. TARJETA COMPLETA
    // =================================================

    return `

        <article
            class="producto-catalogo"
            data-producto-id="${producto.id}"
        >


            <!-- IMAGEN -->

            ${imagenHTML}



            <!-- NOMBRE -->

            <a
                class="catalogo-titulo-enlace"
                href="producto-detalle.html?id=${producto.id}"
            >

                <h3>
                    ${producto.nombre}
                </h3>

            </a>



            <!-- DESCRIPCIÓN -->

            <p class="catalogo-descripcion-producto">
                ${producto.descripcion || ""}
            </p>



            <!-- PRECIO -->

            <p class="catalogo-precio">
                ${formatearPrecio(
                    producto.precio
                )}
            </p>



            <!-- COLORES -->

            ${coloresHTML}



            <!-- AÑADIR AL CARRITO -->

            <button
                class="boton-albedo catalogo-agregar-carrito"
                type="button"
                data-producto-id="${producto.id}"
            >
                Añadir al carrito
            </button>



            <!-- DETALLE -->

            <a
                class="catalogo-ver-detalle"
                href="producto-detalle.html?id=${producto.id}"
            >
                Ver detalle →
            </a>


        </article>

    `;

}



// =====================================================
// 5. COLORES
// =====================================================

function activarColores() {


    const tarjetas =
        document.querySelectorAll(
            ".producto-catalogo"
        );


    tarjetas.forEach(
        function (tarjeta) {


            const imagen =
                tarjeta.querySelector(
                    ".catalogo-imagen img"
                );


            const colores =
                tarjeta.querySelectorAll(
                    ".color-swatch"
                );


            const contenedorColores =
                tarjeta.querySelector(
                    ".colores-producto"
                );


            if (
                !imagen ||
                colores.length === 0 ||
                !contenedorColores
            ) {

                return;

            }



            let colorSeleccionado =
                tarjeta.querySelector(
                    ".color-swatch.activo"
                );


            let imagenSeleccionada =
                colorSeleccionado
                    ? colorSeleccionado.dataset.imagen
                    : imagen.getAttribute(
                        "src"
                    );



            colores.forEach(
                function (color) {


                    // =====================================
                    // PASAR EL MOUSE
                    // =====================================

                    color.addEventListener(
                        "mouseenter",
                        function () {

                            imagen.src =
                                color.dataset.imagen;

                        }
                    );



                    // =====================================
                    // TECLADO
                    // =====================================

                    color.addEventListener(
                        "focus",
                        function () {

                            imagen.src =
                                color.dataset.imagen;

                        }
                    );



                    // =====================================
                    // SELECCIONAR COLOR
                    // =====================================

                    color.addEventListener(
                        "click",
                        function () {


                            colores.forEach(
                                function (boton) {

                                    boton.classList.remove(
                                        "activo"
                                    );

                                }
                            );


                            color.classList.add(
                                "activo"
                            );


                            colorSeleccionado =
                                color;


                            imagenSeleccionada =
                                color.dataset.imagen;


                            imagen.src =
                                imagenSeleccionada;

                        }
                    );


                }
            );



            // =========================================
            // VOLVER AL COLOR ELEGIDO
            // =========================================

            contenedorColores.addEventListener(
                "mouseleave",
                function () {

                    imagen.src =
                        imagenSeleccionada;

                }
            );


        }
    );

}



// =====================================================
// 6. BOTONES AÑADIR AL CARRITO
// =====================================================

function activarBotonesCarrito() {


    const botones =
        document.querySelectorAll(
            ".catalogo-agregar-carrito"
        );


    botones.forEach(
        function (boton) {


            boton.addEventListener(
                "click",
                function () {


                    const idProducto =
                        boton.dataset.productoId;


                    const producto =
                        productos.find(
                            function (item) {

                                return (
                                    item.id ===
                                    idProducto
                                );

                            }
                        );


                    if (!producto) {

                        return;

                    }



                    const tarjeta =
                        boton.closest(
                            ".producto-catalogo"
                        );


                    const colorActivo =
                        tarjeta.querySelector(
                            ".color-swatch.activo"
                        );



                    let colorSeleccionado =
                        "";


                    let imagenSeleccionada =
                        producto.imagen;



                    if (colorActivo) {


                        colorSeleccionado =
                            colorActivo.dataset.nombre ||
                            "";


                        imagenSeleccionada =
                            colorActivo.dataset.imagen ||
                            producto.imagen;

                    }



                    // Si el producto nuevo no tiene
                    // una imagen real, utilizamos el logo
                    // solamente como referencia interna
                    // para el carrito.

                    if (
                        !imagenSeleccionada
                    ) {

                        imagenSeleccionada =
                            "img/logo-albedo.png";

                    }



                    agregarAlCarrito({

                        id:
                            producto.id,

                        nombre:
                            producto.nombre,

                        precio:
                            producto.precio,

                        imagen:
                            imagenSeleccionada,

                        color:
                            colorSeleccionado,

                        cantidad:
                            1

                    });



                    // =====================================
                    // FEEDBACK
                    // =====================================

                    boton.textContent =
                        "Añadido ✓";


                    boton.disabled =
                        true;



                    setTimeout(
                        function () {

                            boton.textContent =
                                "Añadir al carrito";

                            boton.disabled =
                                false;

                        },
                        1200
                    );


                }
            );


        }
    );

}



// =====================================================
// 7. FORMATEAR PRECIO
// =====================================================

function formatearPrecio(
    precio
) {


    return (
        "$" +
        Number(
            precio
        ).toLocaleString(
            "es-CL",
            {
                maximumFractionDigits:
                    2
            }
        )
    );

}