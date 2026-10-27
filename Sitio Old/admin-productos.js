// =====================================================
// 1. MANTENEDOR DE PRODUCTOS - ALBEDO OUTDOOR
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // =================================================
        // 2. ELEMENTOS
        // =================================================

        const formulario =
            document.getElementById("formularioProducto");

        const modoEdicion =
            document.getElementById("modoEdicion");

        const codigo =
            document.getElementById("codigoProducto");

        const nombre =
            document.getElementById("nombreProducto");

        const descripcion =
            document.getElementById("descripcionProducto");

        const precio =
            document.getElementById("precioProducto");

        const stock =
            document.getElementById("stockProducto");

        const stockCritico =
            document.getElementById("stockCriticoProducto");

        const categoria =
            document.getElementById("categoriaProducto");

        const imagen =
            document.getElementById("imagenProducto");

        const mensaje =
            document.getElementById("mensajeProducto");

        const lista =
            document.getElementById("listaProductosAdmin");

        const botonGuardar =
            document.getElementById("botonGuardarProducto");

        const botonCancelar =
            document.getElementById("botonCancelarEdicion");

        const tituloFormulario =
            document.getElementById(
                "titulo-formulario-producto"
            );


        const CLAVE_PRODUCTOS =
            "productosAdminAlbedo";



        // =================================================
        // 3. PRODUCTOS INICIALES
        // =================================================

        function crearProductosIniciales() {

            let contadorChaquetas = 0;
            let contadorPolar = 0;
            let contadorPantalones = 0;


            return productos.map(
                function (producto) {

                    let codigoProducto = "";


                    if (
                        producto.categoria ===
                        "Chaquetas"
                    ) {

                        contadorChaquetas++;

                        codigoProducto =
                            "CHA" +
                            String(
                                contadorChaquetas
                            ).padStart(3, "0");

                    }


                    if (
                        producto.categoria ===
                        "Polerones y polar"
                    ) {

                        contadorPolar++;

                        codigoProducto =
                            "POL" +
                            String(
                                contadorPolar
                            ).padStart(3, "0");

                    }


                    if (
                        producto.categoria ===
                        "Pantalones"
                    ) {

                        contadorPantalones++;

                        codigoProducto =
                            "PAN" +
                            String(
                                contadorPantalones
                            ).padStart(3, "0");

                    }


                    return {

                        id:
                            producto.id,

                        codigo:
                            codigoProducto,

                        nombre:
                            producto.nombre,

                        descripcion:
                            producto.descripcion,

                        precio:
                            producto.precio,

                        stock:
                            10,

                        stockCritico:
                            3,

                        categoria:
                            producto.categoria,

                        imagen:
                            producto.imagen

                    };

                }
            );

        }



        // =================================================
        // 4. OBTENER PRODUCTOS
        // =================================================

        function obtenerProductosAdmin() {

            try {

                const guardados =
                    JSON.parse(
                        localStorage.getItem(
                            CLAVE_PRODUCTOS
                        )
                    );


                if (
                    Array.isArray(guardados)
                ) {

                    return guardados;

                }

            } catch (error) {

                // Se cargan los iniciales.

            }


            const iniciales =
                crearProductosIniciales();


            guardarProductosAdmin(
                iniciales
            );


            return iniciales;

        }



        // =================================================
        // 5. GUARDAR PRODUCTOS
        // =================================================

        function guardarProductosAdmin(
            listaProductos
        ) {

            localStorage.setItem(
                CLAVE_PRODUCTOS,
                JSON.stringify(
                    listaProductos
                )
            );

        }



        // =================================================
        // 6. FILTRAR PRECIO MIENTRAS SE ESCRIBE
        // =================================================

        precio.addEventListener(
            "input",
            function () {

                limpiarMensajeGeneral();


                let valor =
                    precio.value;


                // Quitar todo excepto números,
                // punto y coma decimal.
                valor =
                    valor.replace(
                        /[^0-9.,]/g,
                        ""
                    );


                // Convertir coma a punto para
                // trabajar con un solo separador.
                valor =
                    valor.replace(
                        /,/g,
                        "."
                    );


                // Permitir solamente un punto.
                const partes =
                    valor.split(".");


                if (
                    partes.length > 2
                ) {

                    valor =
                        partes[0] +
                        "." +
                        partes
                            .slice(1)
                            .join("");

                }


                precio.value =
                    valor;


                validarPrecio();

            }
        );



        // =================================================
        // 7. FILTRAR STOCK
        // =================================================

        stock.addEventListener(
            "input",
            function () {

                limpiarMensajeGeneral();


                stock.value =
                    stock.value.replace(
                        /\D/g,
                        ""
                    );


                validarStock();

            }
        );



        // =================================================
        // 8. FILTRAR STOCK CRÍTICO
        // =================================================

        stockCritico.addEventListener(
            "input",
            function () {

                limpiarMensajeGeneral();


                stockCritico.value =
                    stockCritico.value.replace(
                        /\D/g,
                        ""
                    );


                validarStockCritico();

            }
        );



        // =================================================
        // 9. RESTO DE VALIDACIONES EN TIEMPO REAL
        // =================================================

        codigo.addEventListener(
            "input",
            function () {

                limpiarMensajeGeneral();

                validarCodigo();

            }
        );


        nombre.addEventListener(
            "input",
            function () {

                limpiarMensajeGeneral();

                validarNombre();

            }
        );


        descripcion.addEventListener(
            "input",
            function () {

                limpiarMensajeGeneral();

                validarDescripcion();

            }
        );


        categoria.addEventListener(
            "change",
            function () {

                limpiarMensajeGeneral();

                validarCategoria();

            }
        );


        imagen.addEventListener(
            "input",
            function () {

                limpiarMensajeGeneral();

                validarImagen();

            }
        );



        // =================================================
        // 10. VALIDAR CÓDIGO
        // =================================================

        function validarCodigo() {

            const valor =
                codigo.value.trim();


            if (valor === "") {

                mostrarError(
                    codigo,
                    "feedbackCodigoProducto",
                    "Debe ingresar el código del producto"
                );

                return false;

            }


            if (
                valor.length < 3
            ) {

                mostrarError(
                    codigo,
                    "feedbackCodigoProducto",
                    "El código debe tener como mínimo 3 caracteres"
                );

                return false;

            }


            mostrarCorrecto(
                codigo,
                "feedbackCodigoProducto"
            );


            return true;

        }



        // =================================================
        // 11. VALIDAR NOMBRE
        // =================================================

        function validarNombre() {

            const valor =
                nombre.value.trim();


            if (valor === "") {

                mostrarError(
                    nombre,
                    "feedbackNombreProducto",
                    "Debe ingresar el nombre del producto"
                );

                return false;

            }


            if (
                valor.length > 100
            ) {

                mostrarError(
                    nombre,
                    "feedbackNombreProducto",
                    "El nombre no puede superar los 100 caracteres"
                );

                return false;

            }


            mostrarCorrecto(
                nombre,
                "feedbackNombreProducto"
            );


            return true;

        }



        // =================================================
        // 12. VALIDAR DESCRIPCIÓN
        // =================================================

        function validarDescripcion() {

            const valor =
                descripcion.value.trim();


            if (
                valor === ""
            ) {

                limpiarEstado(
                    descripcion,
                    "feedbackDescripcionProducto"
                );

                return true;

            }


            if (
                valor.length > 500
            ) {

                mostrarError(
                    descripcion,
                    "feedbackDescripcionProducto",
                    "La descripción no puede superar los 500 caracteres"
                );

                return false;

            }


            mostrarCorrecto(
                descripcion,
                "feedbackDescripcionProducto"
            );


            return true;

        }



        // =================================================
        // 13. VALIDAR PRECIO
        // =================================================

        function validarPrecio() {

            const valor =
                precio.value.trim();


            if (
                valor === ""
            ) {

                mostrarError(
                    precio,
                    "feedbackPrecioProducto",
                    "Debe ingresar el precio"
                );

                return false;

            }


            if (
                /^\d+(\.\d+)?$/.test(
                    valor
                ) === false
            ) {

                mostrarError(
                    precio,
                    "feedbackPrecioProducto",
                    "Ingrese un precio válido"
                );

                return false;

            }


            const numero =
                Number(valor);


            if (
                Number.isFinite(
                    numero
                ) === false ||
                numero < 0
            ) {

                mostrarError(
                    precio,
                    "feedbackPrecioProducto",
                    "El precio debe ser igual o superior a 0"
                );

                return false;

            }


            mostrarCorrecto(
                precio,
                "feedbackPrecioProducto"
            );


            return true;

        }



        // =================================================
        // 14. VALIDAR STOCK
        // =================================================

        function validarStock() {

            const valor =
                stock.value.trim();


            if (
                valor === ""
            ) {

                mostrarError(
                    stock,
                    "feedbackStockProducto",
                    "Debe ingresar el stock"
                );

                return false;

            }


            if (
                /^\d+$/.test(
                    valor
                ) === false
            ) {

                mostrarError(
                    stock,
                    "feedbackStockProducto",
                    "El stock debe contener solo números enteros"
                );

                return false;

            }


            mostrarCorrecto(
                stock,
                "feedbackStockProducto"
            );


            return true;

        }



        // =================================================
        // 15. VALIDAR STOCK CRÍTICO
        // =================================================

        function validarStockCritico() {

            const valor =
                stockCritico.value.trim();


            if (
                valor === ""
            ) {

                limpiarEstado(
                    stockCritico,
                    "feedbackStockCriticoProducto"
                );

                return true;

            }


            if (
                /^\d+$/.test(
                    valor
                ) === false
            ) {

                mostrarError(
                    stockCritico,
                    "feedbackStockCriticoProducto",
                    "El stock crítico debe contener solo números enteros"
                );

                return false;

            }


            mostrarCorrecto(
                stockCritico,
                "feedbackStockCriticoProducto"
            );


            return true;

        }



        // =================================================
        // 16. VALIDAR CATEGORÍA
        // =================================================

        function validarCategoria() {

            if (
                categoria.value === ""
            ) {

                mostrarError(
                    categoria,
                    "feedbackCategoriaProducto",
                    "Debe seleccionar una categoría"
                );

                return false;

            }


            mostrarCorrecto(
                categoria,
                "feedbackCategoriaProducto"
            );


            return true;

        }



        // =================================================
        // 17. VALIDAR IMAGEN
        // =================================================

        function validarImagen() {

            const valor =
                imagen.value.trim();


            if (
                valor === ""
            ) {

                limpiarEstado(
                    imagen,
                    "feedbackImagenProducto"
                );

                return true;

            }


            if (
                valor.length > 250
            ) {

                mostrarError(
                    imagen,
                    "feedbackImagenProducto",
                    "La ruta de imagen no puede superar los 250 caracteres"
                );

                return false;

            }


            mostrarCorrecto(
                imagen,
                "feedbackImagenProducto"
            );


            return true;

        }



        // =================================================
        // 18. MOSTRAR ERROR
        // =================================================

        function mostrarError(
            campo,
            idFeedback,
            texto
        ) {

            const feedback =
                document.getElementById(
                    idFeedback
                );


            campo.classList.remove(
                "is-valid"
            );


            campo.classList.add(
                "is-invalid"
            );


            feedback.className =
                "small text-danger mt-1";


            feedback.textContent =
                texto;

        }



        // =================================================
        // 19. MOSTRAR CORRECTO
        // =================================================

        function mostrarCorrecto(
            campo,
            idFeedback
        ) {

            const feedback =
                document.getElementById(
                    idFeedback
                );


            campo.classList.remove(
                "is-invalid"
            );


            campo.classList.add(
                "is-valid"
            );


            feedback.className =
                "";


            feedback.textContent =
                "";

        }



        // =================================================
        // 20. LIMPIAR ESTADO
        // =================================================

        function limpiarEstado(
            campo,
            idFeedback
        ) {

            campo.classList.remove(
                "is-valid",
                "is-invalid"
            );


            const feedback =
                document.getElementById(
                    idFeedback
                );


            feedback.className =
                "";


            feedback.textContent =
                "";

        }



        // =================================================
        // 21. LIMPIAR MENSAJE GENERAL
        // =================================================

        function limpiarMensajeGeneral() {

            mensaje.className =
                "";


            mensaje.textContent =
                "";

        }



        // =================================================
        // 22. FORMATEAR PRECIO
        // =================================================

        function formatearPrecio(
            valor
        ) {

            return (
                "$" +
                Number(valor)
                    .toLocaleString(
                        "es-CL",
                        {
                            maximumFractionDigits:
                                2
                        }
                    )
            );

        }



        // =================================================
        // 23. ESCAPAR HTML
        // =================================================

        function escaparHTML(
            valor
        ) {

            return String(valor)

                .replaceAll(
                    "&",
                    "&amp;"
                )

                .replaceAll(
                    "<",
                    "&lt;"
                )

                .replaceAll(
                    ">",
                    "&gt;"
                )

                .replaceAll(
                    "\"",
                    "&quot;"
                )

                .replaceAll(
                    "'",
                    "&#039;"
                );

        }



        // =================================================
        // 24. RENDERIZAR PRODUCTOS
        // =================================================

        function renderizarProductos() {

            const listaProductos =
                obtenerProductosAdmin();


            if (
                listaProductos.length === 0
            ) {

                lista.innerHTML = `

                    <tr>

                        <td
                            colspan="7"
                            class="text-center text-secondary py-4"
                        >
                            No hay productos registrados.
                        </td>

                    </tr>

                `;


                return;

            }



            lista.innerHTML =
                listaProductos
                    .map(
                        function (
                            producto
                        ) {

                            let alertaStock =
                                "";


                            if (
                                producto.stockCritico !== "" &&
                                producto.stockCritico !== null &&
                                Number(
                                    producto.stock
                                ) <=
                                Number(
                                    producto.stockCritico
                                )
                            ) {

                                alertaStock = `

                                    <div class="mt-1">

                                        <span class="badge text-bg-danger">
                                            Stock crítico
                                        </span>

                                    </div>

                                `;

                            }



                            return `

                                <tr>

                                    <td>
                                        ${escaparHTML(
                                            producto.codigo
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

                                        ${escaparHTML(
                                            producto.stock
                                        )}

                                        ${alertaStock}

                                    </td>


                                    <td>

                                        ${
                                            producto.stockCritico === ""
                                                ? "-"
                                                : escaparHTML(
                                                    producto.stockCritico
                                                )
                                        }

                                    </td>


                                    <td>

                                        <button
                                            type="button"
                                            class="btn btn-sm btn-outline-dark boton-editar-producto"
                                            data-codigo="${escaparHTML(
                                                producto.codigo
                                            )}"
                                        >
                                            Editar
                                        </button>

                                    </td>

                                </tr>

                            `;

                        }
                    )
                    .join("");


            activarBotonesEditar();

        }



        // =================================================
        // 25. BOTONES EDITAR
        // =================================================

        function activarBotonesEditar() {

            document
                .querySelectorAll(
                    ".boton-editar-producto"
                )
                .forEach(
                    function (boton) {

                        boton.addEventListener(
                            "click",
                            function () {

                                editarProducto(
                                    boton.dataset.codigo
                                );

                            }
                        );

                    }
                );

        }



        // =================================================
        // 26. EDITAR PRODUCTO
        // =================================================

        function editarProducto(
            codigoSeleccionado
        ) {

            const listaProductos =
                obtenerProductosAdmin();


            const producto =
                listaProductos.find(
                    function (item) {

                        return (
                            item.codigo ===
                            codigoSeleccionado
                        );

                    }
                );


            if (!producto) {

                return;

            }


            modoEdicion.value =
                producto.codigo;


            codigo.value =
                producto.codigo;


            nombre.value =
                producto.nombre;


            descripcion.value =
                producto.descripcion || "";


            precio.value =
                producto.precio;


            stock.value =
                producto.stock;


            stockCritico.value =
                producto.stockCritico;


            categoria.value =
                producto.categoria;


            imagen.value =
                producto.imagen || "";


            tituloFormulario.textContent =
                "Editar producto";


            botonGuardar.textContent =
                "Guardar cambios";


            botonCancelar.style.display =
                "inline-block";


            limpiarTodosLosEstados();

            limpiarMensajeGeneral();


            formulario.scrollIntoView(
                {
                    behavior:
                        "smooth",

                    block:
                        "start"
                }
            );

        }



        // =================================================
        // 27. LIMPIAR FORMULARIO
        // =================================================

        function limpiarFormulario() {

            formulario.reset();


            modoEdicion.value =
                "";


            tituloFormulario.textContent =
                "Nuevo producto";


            botonGuardar.textContent =
                "Guardar producto";


            botonCancelar.style.display =
                "none";


            limpiarTodosLosEstados();

        }



        // =================================================
        // 28. LIMPIAR TODOS LOS ESTADOS
        // =================================================

        function limpiarTodosLosEstados() {

            limpiarEstado(
                codigo,
                "feedbackCodigoProducto"
            );


            limpiarEstado(
                nombre,
                "feedbackNombreProducto"
            );


            limpiarEstado(
                descripcion,
                "feedbackDescripcionProducto"
            );


            limpiarEstado(
                precio,
                "feedbackPrecioProducto"
            );


            limpiarEstado(
                stock,
                "feedbackStockProducto"
            );


            limpiarEstado(
                stockCritico,
                "feedbackStockCriticoProducto"
            );


            limpiarEstado(
                categoria,
                "feedbackCategoriaProducto"
            );


            limpiarEstado(
                imagen,
                "feedbackImagenProducto"
            );

        }



        // =================================================
        // 29. CANCELAR EDICIÓN
        // =================================================

        botonCancelar.addEventListener(
            "click",
            function () {

                limpiarFormulario();

                limpiarMensajeGeneral();

            }
        );



        // =================================================
        // 30. GUARDAR PRODUCTO
        // =================================================

        formulario.addEventListener(
            "submit",
            function (evento) {

                evento.preventDefault();


                const todoValido = [

                    validarCodigo(),

                    validarNombre(),

                    validarDescripcion(),

                    validarPrecio(),

                    validarStock(),

                    validarStockCritico(),

                    validarCategoria(),

                    validarImagen()

                ].every(
                    function (
                        resultado
                    ) {

                        return (
                            resultado ===
                            true
                        );

                    }
                );


                if (
                    todoValido === false
                ) {

                    mensaje.className =
                        "alert alert-danger mt-4";


                    mensaje.textContent =
                        "Revisa los campos marcados en rojo antes de guardar el producto.";


                    return;

                }



                const listaProductos =
                    obtenerProductosAdmin();


                const codigoIngresado =
                    codigo.value.trim();


                const codigoOriginal =
                    modoEdicion.value;



                // =========================================
                // CÓDIGO DUPLICADO
                // =========================================

                const codigoExistente =
                    listaProductos.some(
                        function (
                            producto
                        ) {

                            if (
                                codigoOriginal !== "" &&
                                producto.codigo ===
                                codigoOriginal
                            ) {

                                return false;

                            }


                            return (
                                producto.codigo
                                    .toLowerCase() ===
                                codigoIngresado
                                    .toLowerCase()
                            );

                        }
                    );


                if (
                    codigoExistente
                ) {

                    mostrarError(
                        codigo,
                        "feedbackCodigoProducto",
                        "Ya existe un producto con este código"
                    );


                    mensaje.className =
                        "alert alert-danger mt-4";


                    mensaje.textContent =
                        "No se pudo guardar porque el código ya está registrado.";


                    return;

                }



                // =========================================
                // CONSTRUIR PRODUCTO
                // =========================================

                const datosProducto = {

                    codigo:
                        codigoIngresado,

                    nombre:
                        nombre.value.trim(),

                    descripcion:
                        descripcion.value.trim(),

                    precio:
                        Number(
                            precio.value
                        ),

                    stock:
                        Number(
                            stock.value
                        ),

                    stockCritico:
                        stockCritico.value === ""
                            ? ""
                            : Number(
                                stockCritico.value
                            ),

                    categoria:
                        categoria.value,

                    imagen:
                        imagen.value.trim()

                };



                // =========================================
                // EDITAR EXISTENTE
                // =========================================

                if (
                    codigoOriginal !== ""
                ) {

                    const indice =
                        listaProductos.findIndex(
                            function (
                                producto
                            ) {

                                return (
                                    producto.codigo ===
                                    codigoOriginal
                                );

                            }
                        );


                    if (
                        indice !== -1
                    ) {

                        datosProducto.id =
                            listaProductos[
                                indice
                            ].id;


                        listaProductos[
                            indice
                        ] =
                            datosProducto;

                    }


                    guardarProductosAdmin(
                        listaProductos
                    );


                    renderizarProductos();

                    limpiarFormulario();


                    mensaje.className =
                        "alert alert-success mt-4";


                    mensaje.textContent =
                        "Producto actualizado correctamente.";


                    return;

                }



                // =========================================
                // CREAR NUEVO
                // =========================================

                datosProducto.id =
                    "admin-" +
                    codigoIngresado
                        .toLowerCase()
                        .replace(
                            /[^a-z0-9]+/g,
                            "-"
                        );


                listaProductos.push(
                    datosProducto
                );


                guardarProductosAdmin(
                    listaProductos
                );


                renderizarProductos();

                limpiarFormulario();


                mensaje.className =
                    "alert alert-success mt-4";


                mensaje.textContent =
                    "Producto creado correctamente.";

            }
        );



        // =================================================
        // 31. CARGA INICIAL
        // =================================================

        renderizarProductos();


    }
);