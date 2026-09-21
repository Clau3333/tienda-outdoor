document.addEventListener("DOMContentLoaded", () => {

    const contenedores = document.querySelectorAll(
        ".catalogo-grid[data-categoria]"
    );

    contenedores.forEach((contenedor) => {

        const categoria = contenedor.dataset.categoria;

        const productosFiltrados = productos.filter(
            (producto) => producto.categoria === categoria
        );

        contenedor.innerHTML = productosFiltrados
            .map((producto) => crearTarjeta(producto))
            .join("");
    });

    activarColores();
});


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

            <a class="catalogo-imagen" href="producto-detalle.html?id=${producto.id}">

                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                >

            </a>

            <a class="catalogo-titulo-enlace" href="producto-detalle.html?id=${producto.id}">
                <h3>${producto.nombre}</h3>
            </a>

            <p class="catalogo-descripcion-producto">
                ${producto.descripcion}
            </p>

            <p class="catalogo-precio">
                ${formatearPrecio(producto.precio)}
            </p>

            ${coloresHTML}

            <a class="catalogo-ver-detalle" href="producto-detalle.html?id=${producto.id}">
                Ver detalle →
            </a>

        </article>
    `;
}


function activarColores() {

    const tarjetas = document.querySelectorAll(".producto-catalogo");

    tarjetas.forEach((tarjeta) => {

        const imagen = tarjeta.querySelector(".catalogo-imagen img");
        const colores = tarjeta.querySelectorAll(".color-swatch");
        const contenedorColores = tarjeta.querySelector(".colores-producto");

        if (!imagen || colores.length === 0) {
            return;
        }


        let colorSeleccionado =
            tarjeta.querySelector(".color-swatch.activo");

        let imagenSeleccionada =
            colorSeleccionado
                ? colorSeleccionado.dataset.imagen
                : imagen.getAttribute("src");


        colores.forEach((color) => {

            /* PASAR EL MOUSE */

            color.addEventListener("mouseenter", () => {
                imagen.src = color.dataset.imagen;
            });


            /* ACCESIBILIDAD CON TECLADO */

            color.addEventListener("focus", () => {
                imagen.src = color.dataset.imagen;
            });


            /* CLICK = DEJAR COLOR SELECCIONADO */

            color.addEventListener("click", () => {

                colores.forEach((boton) => {
                    boton.classList.remove("activo");
                });

                color.classList.add("activo");

                imagenSeleccionada = color.dataset.imagen;

                imagen.src = imagenSeleccionada;
            });

        });


        /* AL SACAR EL MOUSE VUELVE AL COLOR SELECCIONADO */

        contenedorColores.addEventListener("mouseleave", () => {
            imagen.src = imagenSeleccionada;
        });

    });
}


function formatearPrecio(precio) {

    return "$" + precio.toLocaleString("es-CL");

}