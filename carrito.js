// =============================================
// CARRITO DE COMPRAS ALBEDO
// Persistencia mediante localStorage
// =============================================

document.addEventListener("DOMContentLoaded", function () {

    actualizarContadorCarrito();

    inicializarPaginaCarrito();

});


// =============================================
// DATOS DEL CARRITO
// =============================================

function obtenerCarrito() {

    return JSON.parse(localStorage.getItem("carritoAlbedo")) || [];
}


function guardarCarrito(carrito) {

    localStorage.setItem("carritoAlbedo", JSON.stringify(carrito));
}


function agregarAlCarrito(item) {

    const carrito = obtenerCarrito();

    const existente = carrito.find(function (producto) {
        return producto.id === item.id && producto.color === item.color;
    });

    if (existente) {

        existente.cantidad += item.cantidad;

    } else {

        carrito.push(item);
    }

    guardarCarrito(carrito);

    actualizarContadorCarrito();
}


function formatearPrecio(precio) {

    return "$" + precio.toLocaleString("es-CL");
}


// =============================================
// CONTADOR EN EL MENÚ
// =============================================

function actualizarContadorCarrito() {

    const contador = document.getElementById("contadorCarrito");

    if (!contador) {
        return;
    }

    const carrito = obtenerCarrito();

    const totalItems = carrito.reduce(function (total, item) {
        return total + item.cantidad;
    }, 0);

    contador.textContent = totalItems;
}


// =============================================
// PÁGINA DEL CARRITO (carrito.html)
// =============================================

function inicializarPaginaCarrito() {

    const lista = document.getElementById("carritoLista");

    if (!lista) {
        return;
    }

    const vacio = document.getElementById("carritoVacio");
    const contenido = document.getElementById("carritoContenido");
    const total = document.getElementById("carritoTotal");
    const mensaje = document.getElementById("mensajeCompra");


    document.getElementById("botonVaciarCarrito").addEventListener("click", function () {

        guardarCarrito([]);

        mensaje.className = "";
        mensaje.textContent = "";

        renderizarCarrito();
    });


    document.getElementById("botonFinalizarCompra").addEventListener("click", function () {

        const carrito = obtenerCarrito();

        if (carrito.length === 0) {

            mensaje.className = "alert alert-danger mt-3";
            mensaje.textContent = "Tu carrito está vacío.";

            return;
        }

        guardarCarrito([]);

        mensaje.className = "alert alert-success mt-3";
        mensaje.textContent = "Compra simulada realizada con éxito. ¡Gracias por tu compra en ALBEDO Outdoor!";

        renderizarCarrito();
    });


    function renderizarCarrito() {

        const carrito = obtenerCarrito();

        actualizarContadorCarrito();

        if (carrito.length === 0) {

            vacio.style.display = "block";
            contenido.style.display = "none";

            return;
        }

        vacio.style.display = "none";
        contenido.style.display = "block";

        lista.innerHTML = carrito.map(function (item, indice) {

            const subtotal = item.precio * item.cantidad;

            return `
                <tr>

                    <td class="carrito-producto">
                        <img src="${item.imagen}" alt="${item.nombre}">
                        <span>${item.nombre}</span>
                    </td>

                    <td>${item.color || "-"}</td>

                    <td>${formatearPrecio(item.precio)}</td>

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

                    <td>${formatearPrecio(subtotal)}</td>

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

        }).join("");

        const totalGeneral = carrito.reduce(function (suma, item) {
            return suma + (item.precio * item.cantidad);
        }, 0);

        total.textContent = formatearPrecio(totalGeneral);


        lista.querySelectorAll(".carrito-input-cantidad").forEach(function (input) {

            input.addEventListener("change", function () {

                const carritoActual = obtenerCarrito();
                const indice = parseInt(input.dataset.indice, 10);

                let nuevaCantidad = parseInt(input.value, 10);

                if (!nuevaCantidad || nuevaCantidad < 1) {
                    nuevaCantidad = 1;
                }

                carritoActual[indice].cantidad = nuevaCantidad;

                guardarCarrito(carritoActual);

                renderizarCarrito();
            });
        });


        lista.querySelectorAll(".carrito-eliminar").forEach(function (boton) {

            boton.addEventListener("click", function () {

                const carritoActual = obtenerCarrito();
                const indice = parseInt(boton.dataset.indice, 10);

                carritoActual.splice(indice, 1);

                guardarCarrito(carritoActual);

                renderizarCarrito();
            });
        });
    }

    renderizarCarrito();
}
