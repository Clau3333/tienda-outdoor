document.addEventListener("DOMContentLoaded", () => {

    const contenedores = document.querySelectorAll(
        ".catalogo-grid[data-categoria]"
    );


    contenedores.forEach((contenedor) => {

        const categoria =
            contenedor.dataset.categoria;


        const productosFiltrados =
            productos.filter(
                (producto) =>
                    producto.categoria === categoria
            );


        contenedor.innerHTML =
            productosFiltrados
                .map(
                    (producto) =>
                        crearTarjeta(producto)
                )
                .join("");

    });


    activarColores();

    activarBotonesCarrito();

});





// =====================================================
// CREAR TARJETA DE PRODUCTO
// =====================================================

function crearTarjeta(producto) {

    let coloresHTML = "";


    if (producto.colores) {

        coloresHTML = `
            <div class="colores-producto">

                ${producto.colores.map((color) => {

                    const activo =
                        color.imagen === producto.imagen
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

                }).join("")}

            </div>
        `;

    }



    return `

        <article class="producto-catalogo">


            <!-- IMAGEN -->

            <a
                class="catalogo-imagen"
                href="producto-detalle.html?id=${producto.id}"
            >

                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                >

            </a>



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
                ${producto.descripcion}
            </p>



            <!-- PRECIO -->

            <p class="catalogo-precio">
                ${formatearPrecio(producto.precio)}
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



            <!-- VER DETALLE -->

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
// SELECTORES DE COLOR
// =====================================================

function activarColores() {

    const tarjetas =
        document.querySelectorAll(
            ".producto-catalogo"
        );


    tarjetas.forEach((tarjeta) => {

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
            colores.length === 0
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
                : imagen.getAttribute("src");



        colores.forEach((color) => {


            // =========================================
            // PASAR EL MOUSE
            // =========================================

            color.addEventListener(
                "mouseenter",
                () => {

                    imagen.src =
                        color.dataset.imagen;

                }
            );



            // =========================================
            // ACCESIBILIDAD CON TECLADO
            // =========================================

            color.addEventListener(
                "focus",
                () => {

                    imagen.src =
                        color.dataset.imagen;

                }
            );



            // =========================================
            // CLICK = DEJAR COLOR SELECCIONADO
            // =========================================

            color.addEventListener(
                "click",
                () => {


                    colores.forEach(
                        (boton) => {

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

        });



        // =============================================
        // AL SACAR EL MOUSE VUELVE AL COLOR ELEGIDO
        // =============================================

        contenedorColores.addEventListener(
            "mouseleave",
            () => {

                imagen.src =
                    imagenSeleccionada;

            }
        );

    });

}





// =====================================================
// BOTONES AÑADIR AL CARRITO
// =====================================================

function activarBotonesCarrito() {

    const botones =
        document.querySelectorAll(
            ".catalogo-agregar-carrito"
        );


    botones.forEach((boton) => {

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
                        colorActivo.dataset.nombre || "";


                    imagenSeleccionada =
                        colorActivo.dataset.imagen ||
                        producto.imagen;

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
                // FEEDBACK BREVE EN EL MISMO BOTÓN
                // =====================================

                const textoOriginal =
                    "Añadir al carrito";


                boton.textContent =
                    "Añadido ✓";


                boton.disabled =
                    true;



                setTimeout(
                    function () {

                        boton.textContent =
                            textoOriginal;

                        boton.disabled =
                            false;

                    },
                    1200
                );

            }
        );

    });

}





// =====================================================
// FORMATEAR PRECIO
// =====================================================

function formatearPrecio(precio) {

    return (
        "$" +
        precio.toLocaleString(
            "es-CL"
        )
    );

}