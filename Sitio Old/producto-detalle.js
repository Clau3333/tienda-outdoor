// =============================================
// DETALLE DE PRODUCTO ALBEDO
// =============================================

document.addEventListener("DOMContentLoaded", function () {

    const parametros = new URLSearchParams(window.location.search);
    const idProducto = parametros.get("id");

    const producto = productos.find(function (p) {
        return p.id === idProducto;
    });

    const contenedor = document.getElementById("detalleProducto");
    const noEncontrado = document.getElementById("detalleNoEncontrado");

    if (!producto) {

        contenedor.style.display = "none";
        noEncontrado.style.display = "block";

        return;
    }

    document.title = "ALBEDO Outdoor | " + producto.nombre;

    const imagen = document.getElementById("detalleImagen");
    const categoria = document.getElementById("detalleCategoria");
    const nombre = document.getElementById("detalleNombre");
    const precio = document.getElementById("detallePrecio");
    const descripcion = document.getElementById("detalleDescripcion");
    const colores = document.getElementById("detalleColores");
    const cantidad = document.getElementById("cantidad");
    const botonAgregar = document.getElementById("botonAgregarCarrito");
    const mensajeCarrito = document.getElementById("mensajeCarrito");

    let imagenSeleccionada = producto.imagen;
    let colorSeleccionado = "";

    imagen.src = producto.imagen;
    imagen.alt = producto.nombre;
    categoria.textContent = producto.categoria;
    nombre.textContent = producto.nombre;
    precio.textContent = formatearPrecio(producto.precio);
    descripcion.textContent = producto.descripcion;

    const categoriaAcordeon = document.getElementById("detalleCategoriaAcordeon");

    if (categoriaAcordeon) {
        categoriaAcordeon.textContent = producto.categoria;
    }


    if (producto.colores) {

        const colorActual = producto.colores.find(function (color) {
            return color.imagen === producto.imagen;
        });

        colorSeleccionado = colorActual ? colorActual.nombre : "";

        colores.innerHTML = producto.colores.map(function (color) {

            const activo = color.imagen === producto.imagen ? "activo" : "";

            return `
                <button
                    class="color-swatch ${activo}"
                    type="button"
                    data-imagen="${color.imagen}"
                    data-nombre="${color.nombre}"
                    aria-label="Color ${color.nombre}"
                    title="${color.nombre}"
                    style="--color-producto: ${color.color};"
                ></button>
            `;

        }).join("");

        colores.querySelectorAll(".color-swatch").forEach(function (boton) {

            boton.addEventListener("click", function () {

                colores.querySelectorAll(".color-swatch").forEach(function (otro) {
                    otro.classList.remove("activo");
                });

                boton.classList.add("activo");

                imagenSeleccionada = boton.dataset.imagen;
                colorSeleccionado = boton.dataset.nombre;

                imagen.src = imagenSeleccionada;
            });
        });
    }


    botonAgregar.addEventListener("click", function () {

        let valorCantidad = parseInt(cantidad.value, 10);

        if (!valorCantidad || valorCantidad < 1) {
            valorCantidad = 1;
        }

        cantidad.value = valorCantidad;

        agregarAlCarrito({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: imagenSeleccionada,
            color: colorSeleccionado,
            cantidad: valorCantidad
        });

        mensajeCarrito.className = "alert alert-success mt-3";
        mensajeCarrito.textContent = "Producto añadido al carrito.";
    });
});
