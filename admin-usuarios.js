// =====================================================
// ALBEDO OUTDOOR
// MANTENEDOR DE USUARIOS
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    // =================================================
    // ELEMENTOS
    // =================================================

    const formulario =
        document.getElementById("formularioUsuarioAdmin");

    const runOriginal =
        document.getElementById("runOriginalUsuario");

    const run =
        document.getElementById("runUsuario");

    const tipoUsuario =
        document.getElementById("tipoUsuario");

    const nombre =
        document.getElementById("nombreUsuario");

    const apellidos =
        document.getElementById("apellidosUsuario");

    const correo =
        document.getElementById("correoUsuario");

    const fechaNacimiento =
        document.getElementById("fechaNacimientoUsuario");

    const region =
        document.getElementById("regionUsuario");

    const comuna =
        document.getElementById("comunaUsuario");

    const calle =
        document.getElementById("calleUsuario");

    const numeroDomicilio =
        document.getElementById("numeroDomicilioUsuario");

    const tipoDomicilio =
        document.getElementById("tipoDomicilioUsuario");

    const numeroUnidad =
        document.getElementById("numeroUnidadUsuario");

    const codigoPostal =
        document.getElementById("codigoPostalUsuario");

    const contrasena =
        document.getElementById("contrasenaUsuario");

    const confirmarContrasena =
        document.getElementById("confirmarContrasenaUsuario");

    const mensaje =
        document.getElementById("mensajeUsuarioAdmin");

    const lista =
        document.getElementById("listaUsuariosAdmin");

    const botonGuardar =
        document.getElementById("botonGuardarUsuario");

    const botonCancelar =
        document.getElementById("botonCancelarUsuario");

    const tituloFormulario =
        document.getElementById("titulo-formulario-usuario");


    const CLAVE_USUARIOS =
        "usuariosAlbedo";


    // =================================================
    // EXPRESIONES Y REGLAS
    // =================================================

    const regExCorreo =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    const regExNombre =
        /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/u;


    const dominiosPermitidos = [

        "gmail.com",

        "duoc.cl",

        "profesor.duoc.cl"

    ];


    const perfilesPermitidos = [

        "Administrador",

        "Cliente",

        "Vendedor"

    ];


    // =================================================
    // REGIONES Y COMUNAS
    // MISMO CRITERIO QUE REGISTRO
    // =================================================

    const regiones = {

        "Arica y Parinacota": [
            "Arica",
            "Camarones",
            "General Lagos",
            "Putre"
        ],

        "Tarapacá": [
            "Iquique",
            "Alto Hospicio",
            "Camiña",
            "Colchane",
            "Huara",
            "Pica",
            "Pozo Almonte"
        ],

        "Antofagasta": [
            "Antofagasta",
            "Calama",
            "Mejillones",
            "San Pedro de Atacama",
            "Taltal",
            "Tocopilla"
        ],

        "Atacama": [
            "Copiapó",
            "Caldera",
            "Chañaral",
            "Diego de Almagro",
            "Freirina",
            "Huasco",
            "Vallenar"
        ],

        "Coquimbo": [
            "La Serena",
            "Coquimbo",
            "Ovalle",
            "Illapel",
            "Los Vilos",
            "Salamanca",
            "Vicuña"
        ],

        "Valparaíso": [
            "Valparaíso",
            "Viña del Mar",
            "Concón",
            "Quilpué",
            "Villa Alemana",
            "Quillota",
            "San Antonio"
        ],

        "Metropolitana de Santiago": [
            "Santiago",
            "Providencia",
            "Las Condes",
            "Ñuñoa",
            "Maipú",
            "Puente Alto",
            "La Florida",
            "San Bernardo"
        ],

        "Libertador General Bernardo O'Higgins": [
            "Rancagua",
            "Machalí",
            "Rengo",
            "San Fernando",
            "Santa Cruz"
        ],

        "Maule": [
            "Talca",
            "Curicó",
            "Linares",
            "Cauquenes",
            "Constitución"
        ],

        "Ñuble": [
            "Chillán",
            "Chillán Viejo",
            "Bulnes",
            "Coihueco",
            "Quillón",
            "San Carlos"
        ],

        "Biobío": [
            "Concepción",
            "Talcahuano",
            "Chiguayante",
            "Hualpén",
            "San Pedro de la Paz",
            "Coronel",
            "Lota",
            "Tomé",
            "Penco",
            "Los Ángeles"
        ],

        "La Araucanía": [
            "Temuco",
            "Padre Las Casas",
            "Villarrica",
            "Pucón",
            "Angol"
        ],

        "Los Ríos": [
            "Valdivia",
            "La Unión",
            "Río Bueno",
            "Panguipulli"
        ],

        "Los Lagos": [
            "Puerto Montt",
            "Puerto Varas",
            "Osorno",
            "Castro",
            "Ancud",
            "Quemchi",
            "Quellón"
        ],

        "Aysén del General Carlos Ibáñez del Campo": [
            "Coyhaique",
            "Aysén",
            "Chile Chico",
            "Cochrane"
        ],

        "Magallanes y de la Antártica Chilena": [
            "Punta Arenas",
            "Puerto Natales",
            "Porvenir",
            "Cabo de Hornos"
        ]

    };


    // =================================================
    // CARGAR REGIONES
    // =================================================

    Object.keys(regiones).forEach(
        function (nombreRegion) {

            const opcion =
                document.createElement("option");


            opcion.value =
                nombreRegion;


            opcion.textContent =
                nombreRegion;


            region.appendChild(opcion);

        }
    );


    // =================================================
    // FECHA MÁXIMA
    // =================================================

    const hoy =
        new Date();


    fechaNacimiento.max =
        hoy.getFullYear() +
        "-" +
        String(
            hoy.getMonth() + 1
        ).padStart(2, "0") +
        "-" +
        String(
            hoy.getDate()
        ).padStart(2, "0");


    // =================================================
    // RUN COMPATIBLE CON USUARIOS ANTIGUOS
    // =================================================

    function obtenerRunUsuario(usuario) {

        if (
            usuario.run
        ) {

            return String(
                usuario.run
            ).toUpperCase();

        }


        if (
            usuario.rutNumero &&
            usuario.digitoVerificador
        ) {

            return (
                String(
                    usuario.rutNumero
                ) +
                String(
                    usuario.digitoVerificador
                ).toUpperCase()
            );

        }


        return "";

    }


    // =================================================
    // LOCALSTORAGE
    // =================================================

    function obtenerUsuarios() {

        try {

            const guardados =
                JSON.parse(
                    localStorage.getItem(
                        CLAVE_USUARIOS
                    )
                );


            if (
                Array.isArray(
                    guardados
                )
            ) {

                return guardados;

            }

        } catch (error) {

            // Devuelve arreglo vacío.

        }


        return [];

    }


    function guardarUsuarios(
        usuarios
    ) {

        localStorage.setItem(
            CLAVE_USUARIOS,
            JSON.stringify(
                usuarios
            )
        );

    }


    // =================================================
    // COMUNAS
    // =================================================

    function cargarComunas(
        nombreRegion,
        comunaSeleccionada = ""
    ) {

        comuna.innerHTML =
            '<option value="">Selecciona una comuna</option>';


        if (
            !nombreRegion ||
            !regiones[nombreRegion]
        ) {

            comuna.disabled =
                true;

            return;

        }


        comuna.disabled =
            false;


        regiones[nombreRegion]
            .forEach(
                function (nombreComuna) {

                    const opcion =
                        document.createElement(
                            "option"
                        );


                    opcion.value =
                        nombreComuna;


                    opcion.textContent =
                        nombreComuna;


                    if (
                        nombreComuna ===
                        comunaSeleccionada
                    ) {

                        opcion.selected =
                            true;

                    }


                    comuna.appendChild(
                        opcion
                    );

                }
            );

    }


    region.addEventListener(
        "change",
        function () {

            cargarComunas(
                region.value
            );

            limpiarEstado(
                comuna,
                "feedbackComunaUsuario"
            );

            validarRegion();

        }
    );


    comuna.addEventListener(
        "change",
        validarComuna
    );


    // =================================================
    // CASA / DEPARTAMENTO
    // =================================================

    tipoDomicilio.addEventListener(
        "change",
        function () {

            validarTipoDomicilio();


            if (
                tipoDomicilio.value ===
                "Departamento"
            ) {

                numeroUnidad.disabled =
                    false;

                numeroUnidad.placeholder =
                    "Ej: 504";

            } else {

                numeroUnidad.value =
                    "";

                numeroUnidad.disabled =
                    true;

                numeroUnidad.placeholder =
                    "Selecciona Departamento";


                limpiarEstado(
                    numeroUnidad,
                    "feedbackNumeroUnidadUsuario"
                );

            }

        }
    );


    // =================================================
    // FILTRO RUN
    // =================================================

    run.addEventListener(
        "input",
        function () {

            run.value =
                run.value
                    .toUpperCase()
                    .replace(
                        /[^0-9K]/g,
                        ""
                    )
                    .slice(
                        0,
                        9
                    );


            limpiarMensajeGeneral();

            validarRun();

        }
    );


    // =================================================
    // FILTROS NUMÉRICOS
    // =================================================

    numeroDomicilio.addEventListener(
        "input",
        function () {

            numeroDomicilio.value =
                numeroDomicilio.value
                    .replace(
                        /\D/g,
                        ""
                    )
                    .slice(
                        0,
                        7
                    );


            validarNumeroDomicilio();

        }
    );


    numeroUnidad.addEventListener(
        "input",
        function () {

            numeroUnidad.value =
                numeroUnidad.value
                    .replace(
                        /\D/g,
                        ""
                    )
                    .slice(
                        0,
                        6
                    );


            validarNumeroUnidad();

        }
    );


    codigoPostal.addEventListener(
        "input",
        function () {

            codigoPostal.value =
                codigoPostal.value
                    .replace(
                        /\D/g,
                        ""
                    )
                    .slice(
                        0,
                        7
                    );


            validarCodigoPostal();

        }
    );


    // =================================================
    // VALIDACIONES EN TIEMPO REAL
    // =================================================

    tipoUsuario.addEventListener(
        "change",
        validarTipoUsuario
    );


    nombre.addEventListener(
        "input",
        validarNombre
    );


    apellidos.addEventListener(
        "input",
        validarApellidos
    );


    correo.addEventListener(
        "input",
        validarCorreo
    );


    fechaNacimiento.addEventListener(
        "change",
        validarFechaNacimiento
    );


    calle.addEventListener(
        "input",
        validarCalle
    );


    contrasena.addEventListener(
        "input",
        function () {

            validarContrasena();


            if (
                confirmarContrasena.value !==
                ""
            ) {

                validarConfirmarContrasena();

            }

        }
    );


    confirmarContrasena.addEventListener(
        "input",
        validarConfirmarContrasena
    );


    // =================================================
    // RUN
    // =================================================

    function validarRun() {

        const valor =
            run.value
                .trim()
                .toUpperCase();


        if (
            !/^[0-9]{6,8}[0-9K]$/
                .test(valor)
        ) {

            return mostrarError(
                run,
                "feedbackRunUsuario",
                "RUN inválido. Ingrésalo sin puntos ni guion"
            );

        }


        const cuerpo =
            valor.slice(
                0,
                -1
            );


        const dv =
            valor.slice(
                -1
            );


        if (
            !comprobarRun(
                cuerpo,
                dv
            )
        ) {

            return mostrarError(
                run,
                "feedbackRunUsuario",
                "El RUN ingresado no es válido"
            );

        }


        mostrarCorrecto(
            run,
            "feedbackRunUsuario"
        );


        return true;

    }


    function comprobarRun(
        cuerpo,
        digitoIngresado
    ) {

        let suma =
            0;


        let multiplicador =
            2;


        for (
            let i =
                cuerpo.length - 1;
            i >= 0;
            i--
        ) {

            suma +=
                Number(
                    cuerpo[i]
                ) *
                multiplicador;


            multiplicador++;


            if (
                multiplicador > 7
            ) {

                multiplicador =
                    2;

            }

        }


        const resultado =
            11 -
            (
                suma %
                11
            );


        let digitoCalculado;


        if (
            resultado === 11
        ) {

            digitoCalculado =
                "0";

        } else if (
            resultado === 10
        ) {

            digitoCalculado =
                "K";

        } else {

            digitoCalculado =
                String(
                    resultado
                );

        }


        return (
            digitoCalculado ===
            digitoIngresado
        );

    }


    // =================================================
    // PERFIL
    // =================================================

    function validarTipoUsuario() {

        if (
            !perfilesPermitidos.includes(
                tipoUsuario.value
            )
        ) {

            return mostrarError(
                tipoUsuario,
                "feedbackTipoUsuario",
                "Debe seleccionar un perfil"
            );

        }


        mostrarCorrecto(
            tipoUsuario,
            "feedbackTipoUsuario"
        );


        return true;

    }


    // =================================================
    // NOMBRE
    // =================================================

    function validarNombre() {

        const valor =
            nombre.value.trim();


        if (
            valor === "" ||
            valor.length > 50 ||
            !regExNombre.test(
                valor
            )
        ) {

            return mostrarError(
                nombre,
                "feedbackNombreUsuario",
                "Ingrese un nombre válido"
            );

        }


        mostrarCorrecto(
            nombre,
            "feedbackNombreUsuario"
        );


        return true;

    }


    // =================================================
    // APELLIDOS
    // =================================================

    function validarApellidos() {

        const valor =
            apellidos.value.trim();


        if (
            valor === "" ||
            valor.length > 100 ||
            !regExNombre.test(
                valor
            )
        ) {

            return mostrarError(
                apellidos,
                "feedbackApellidosUsuario",
                "Ingrese apellidos válidos"
            );

        }


        mostrarCorrecto(
            apellidos,
            "feedbackApellidosUsuario"
        );


        return true;

    }


    // =================================================
    // CORREO
    // =================================================

    function validarCorreo() {

        const original =
            correo.value;


        const valor =
            original
                .trim()
                .toLowerCase();


        if (
            /\s/.test(
                original
            )
        ) {

            return mostrarError(
                correo,
                "feedbackCorreoUsuario",
                "El correo no puede contener espacios"
            );

        }


        if (
            valor === "" ||
            valor.length > 100 ||
            !regExCorreo.test(
                valor
            )
        ) {

            return mostrarError(
                correo,
                "feedbackCorreoUsuario",
                "El formato del correo no es válido"
            );

        }


        const dominio =
            valor.split(
                "@"
            )[1];


        if (
            !dominiosPermitidos.includes(
                dominio
            )
        ) {

            return mostrarError(
                correo,
                "feedbackCorreoUsuario",
                "Solo se acepta @gmail.com, @duoc.cl o @profesor.duoc.cl"
            );

        }


        mostrarCorrecto(
            correo,
            "feedbackCorreoUsuario"
        );


        return true;

    }


    // =================================================
    // FECHA
    // =================================================

    function validarFechaNacimiento() {

        if (
            fechaNacimiento.value ===
            ""
        ) {

            limpiarEstado(
                fechaNacimiento,
                "feedbackFechaNacimientoUsuario"
            );


            return true;

        }


        const fecha =
            new Date(
                fechaNacimiento.value +
                "T00:00:00"
            );


        if (
            Number.isNaN(
                fecha.getTime()
            ) ||
            fecha.getFullYear() <
                1900 ||
            fecha > hoy
        ) {

            return mostrarError(
                fechaNacimiento,
                "feedbackFechaNacimientoUsuario",
                "La fecha de nacimiento no es válida"
            );

        }


        mostrarCorrecto(
            fechaNacimiento,
            "feedbackFechaNacimientoUsuario"
        );


        return true;

    }


    // =================================================
    // DIRECCIÓN
    // =================================================

    function validarRegion() {

        if (
            !regiones[
                region.value
            ]
        ) {

            return mostrarError(
                region,
                "feedbackRegionUsuario",
                "Debe seleccionar una región"
            );

        }


        mostrarCorrecto(
            region,
            "feedbackRegionUsuario"
        );


        return true;

    }


    function validarComuna() {

        if (
            comuna.disabled ||
            comuna.value ===
            ""
        ) {

            return mostrarError(
                comuna,
                "feedbackComunaUsuario",
                "Debe seleccionar una comuna"
            );

        }


        mostrarCorrecto(
            comuna,
            "feedbackComunaUsuario"
        );


        return true;

    }


    function validarCalle() {

        const valor =
            calle.value.trim();


        if (
            valor.length < 3 ||
            valor.length > 150
        ) {

            return mostrarError(
                calle,
                "feedbackCalleUsuario",
                "Ingrese una calle o avenida válida"
            );

        }


        mostrarCorrecto(
            calle,
            "feedbackCalleUsuario"
        );


        return true;

    }


    function validarNumeroDomicilio() {

        if (
            !/^[0-9]{1,7}$/
                .test(
                    numeroDomicilio.value
                )
        ) {

            return mostrarError(
                numeroDomicilio,
                "feedbackNumeroDomicilioUsuario",
                "Ingrese solamente números"
            );

        }


        mostrarCorrecto(
            numeroDomicilio,
            "feedbackNumeroDomicilioUsuario"
        );


        return true;

    }


    function validarTipoDomicilio() {

        if (
            ![
                "Casa",
                "Departamento"
            ].includes(
                tipoDomicilio.value
            )
        ) {

            return mostrarError(
                tipoDomicilio,
                "feedbackTipoDomicilioUsuario",
                "Seleccione Casa o Departamento"
            );

        }


        mostrarCorrecto(
            tipoDomicilio,
            "feedbackTipoDomicilioUsuario"
        );


        return true;

    }


    function validarNumeroUnidad() {

        if (
            tipoDomicilio.value ===
            "Casa"
        ) {

            limpiarEstado(
                numeroUnidad,
                "feedbackNumeroUnidadUsuario"
            );


            return true;

        }


        if (
            tipoDomicilio.value !==
            "Departamento" ||
            !/^[0-9]{1,6}$/
                .test(
                    numeroUnidad.value
                )
        ) {

            return mostrarError(
                numeroUnidad,
                "feedbackNumeroUnidadUsuario",
                "Ingrese el número del departamento"
            );

        }


        mostrarCorrecto(
            numeroUnidad,
            "feedbackNumeroUnidadUsuario"
        );


        return true;

    }


    function validarCodigoPostal() {

        if (
            !/^[0-9]{7}$/
                .test(
                    codigoPostal.value
                )
        ) {

            return mostrarError(
                codigoPostal,
                "feedbackCodigoPostalUsuario",
                "El código postal debe contener exactamente 7 números"
            );

        }


        mostrarCorrecto(
            codigoPostal,
            "feedbackCodigoPostalUsuario"
        );


        return true;

    }


    // =================================================
    // CONTRASEÑA
    // =================================================

    function validarContrasena() {

        const valor =
            contrasena.value;


        if (
            valor.length !==
            10
        ) {

            return mostrarError(
                contrasena,
                "feedbackContrasenaUsuario",
                "Debe tener exactamente 10 caracteres"
            );

        }


        if (
            /\s/.test(
                valor
            )
        ) {

            return mostrarError(
                contrasena,
                "feedbackContrasenaUsuario",
                "No puede contener espacios"
            );

        }


        if (
            !/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/u
                .test(valor)
        ) {

            return mostrarError(
                contrasena,
                "feedbackContrasenaUsuario",
                "Debe contener al menos una letra"
            );

        }


        if (
            !/[0-9]/
                .test(valor)
        ) {

            return mostrarError(
                contrasena,
                "feedbackContrasenaUsuario",
                "Debe contener al menos un número"
            );

        }


        if (
            !/[%&$#\/()="!]/
                .test(valor)
        ) {

            return mostrarError(
                contrasena,
                "feedbackContrasenaUsuario",
                "Debe contener un símbolo permitido"
            );

        }


        if (
            !/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9%&$#\/()="!]+$/u
                .test(valor)
        ) {

            return mostrarError(
                contrasena,
                "feedbackContrasenaUsuario",
                "Contiene caracteres no permitidos"
            );

        }


        mostrarCorrecto(
            contrasena,
            "feedbackContrasenaUsuario"
        );


        return true;

    }


    function validarConfirmarContrasena() {

        if (
            !validarContrasena()
        ) {

            return mostrarError(
                confirmarContrasena,
                "feedbackConfirmarContrasenaUsuario",
                "Primero ingrese una contraseña válida"
            );

        }


        if (
            confirmarContrasena.value !==
            contrasena.value
        ) {

            return mostrarError(
                confirmarContrasena,
                "feedbackConfirmarContrasenaUsuario",
                "Las contraseñas no coinciden"
            );

        }


        mostrarCorrecto(
            confirmarContrasena,
            "feedbackConfirmarContrasenaUsuario"
        );


        return true;

    }


    // =================================================
    // FEEDBACK
    // =================================================

    function mostrarError(
        campo,
        id,
        texto
    ) {

        const feedback =
            document.getElementById(
                id
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


        return false;

    }


    function mostrarCorrecto(
        campo,
        id
    ) {

        const feedback =
            document.getElementById(
                id
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


    function limpiarEstado(
        campo,
        id
    ) {

        campo.classList.remove(
            "is-valid",
            "is-invalid"
        );


        const feedback =
            document.getElementById(
                id
            );


        feedback.className =
            "";


        feedback.textContent =
            "";

    }


    function limpiarMensajeGeneral() {

        mensaje.className =
            "";


        mensaje.textContent =
            "";

    }


    // =================================================
    // NOMBRE VISUAL
    // =================================================

    function formatearNombre(
        texto
    ) {

        return String(
            texto ||
            ""
        )
            .trim()
            .toLowerCase()
            .split(
                /\s+/
            )
            .map(
                function (palabra) {

                    return (
                        palabra.charAt(0)
                            .toUpperCase() +
                        palabra.slice(1)
                    );

                }
            )
            .join(" ");

    }


    // =================================================
    // ESCAPAR HTML
    // =================================================

    function escaparHTML(
        valor
    ) {

        return String(
            valor ??
            ""
        )
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
    // TABLA
    // =================================================

    function renderizarUsuarios() {

        const usuarios =
            obtenerUsuarios();


        if (
            usuarios.length ===
            0
        ) {

            lista.innerHTML = `

                <tr>

                    <td
                        colspan="7"
                        class="text-center text-secondary py-4"
                    >
                        No hay usuarios registrados.
                    </td>

                </tr>

            `;


            return;

        }


        lista.innerHTML =
            usuarios
                .map(
                    function (usuario) {

                        const runUsuario =
                            obtenerRunUsuario(
                                usuario
                            );


                        const perfil =
                            perfilesPermitidos.includes(
                                usuario.tipoUsuario
                            )
                                ? usuario.tipoUsuario
                                : "Cliente";


                        const nombreCompleto =
                            formatearNombre(
                                (
                                    usuario.nombre ||
                                    ""
                                ) +
                                " " +
                                (
                                    usuario.apellidos ||
                                    ""
                                )
                            );


                        return `

                            <tr>

                                <td>
                                    ${escaparHTML(
                                        runUsuario
                                    )}
                                </td>

                                <td>

                                    <strong>
                                        ${escaparHTML(
                                            nombreCompleto
                                        )}
                                    </strong>

                                </td>

                                <td>
                                    ${escaparHTML(
                                        usuario.correo
                                    )}
                                </td>

                                <td>

                                    <strong>
                                        ${escaparHTML(
                                            perfil
                                        )}
                                    </strong>

                                </td>

                                <td>
                                    ${escaparHTML(
                                        usuario.region ||
                                        "-"
                                    )}
                                </td>

                                <td>
                                    ${escaparHTML(
                                        usuario.comuna ||
                                        "-"
                                    )}
                                </td>

                                <td>

                                    <button
                                        type="button"
                                        class="btn btn-sm btn-outline-dark boton-editar-usuario"
                                        data-run="${escaparHTML(
                                            runUsuario
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
    // EDITAR
    // =================================================

    function activarBotonesEditar() {

        document
            .querySelectorAll(
                ".boton-editar-usuario"
            )
            .forEach(
                function (boton) {

                    boton.addEventListener(
                        "click",
                        function () {

                            editarUsuario(
                                boton.dataset.run
                            );

                        }
                    );

                }
            );

    }


    function editarUsuario(
        runSeleccionado
    ) {

        const usuarios =
            obtenerUsuarios();


        const usuario =
            usuarios.find(
                function (item) {

                    return (
                        obtenerRunUsuario(
                            item
                        ) ===
                        runSeleccionado
                    );

                }
            );


        if (!usuario) {

            return;

        }


        const runUsuario =
            obtenerRunUsuario(
                usuario
            );


        runOriginal.value =
            runUsuario;


        run.value =
            runUsuario;


        tipoUsuario.value =
            perfilesPermitidos.includes(
                usuario.tipoUsuario
            )
                ? usuario.tipoUsuario
                : "Cliente";


        nombre.value =
            usuario.nombre ||
            "";


        apellidos.value =
            usuario.apellidos ||
            "";


        correo.value =
            usuario.correo ||
            "";


        fechaNacimiento.value =
            usuario.fechaNacimiento ||
            "";


        region.value =
            usuario.region ||
            "";


        cargarComunas(
            region.value,
            usuario.comuna ||
            ""
        );


        calle.value =
            usuario.calle ||
            "";


        numeroDomicilio.value =
            usuario.numeroDomicilio ||
            "";


        tipoDomicilio.value =
            usuario.tipoDomicilio ||
            "";


        if (
            tipoDomicilio.value ===
            "Departamento"
        ) {

            numeroUnidad.disabled =
                false;


            numeroUnidad.value =
                usuario.numeroUnidad ||
                "";


            numeroUnidad.placeholder =
                "Ej: 504";

        } else {

            numeroUnidad.disabled =
                true;


            numeroUnidad.value =
                "";

        }


        codigoPostal.value =
            usuario.codigoPostal ||
            "";


        contrasena.value =
            usuario.contrasena ||
            "";


        confirmarContrasena.value =
            usuario.contrasena ||
            "";


        tituloFormulario.textContent =
            "Editar usuario";


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
    // LIMPIAR
    // =================================================

    function limpiarFormulario() {

        formulario.reset();


        runOriginal.value =
            "";


        comuna.innerHTML =
            '<option value="">Selecciona primero una región</option>';


        comuna.disabled =
            true;


        numeroUnidad.disabled =
            true;


        numeroUnidad.value =
            "";


        numeroUnidad.placeholder =
            "Selecciona Departamento";


        tituloFormulario.textContent =
            "Nuevo usuario";


        botonGuardar.textContent =
            "Guardar usuario";


        botonCancelar.style.display =
            "none";


        limpiarTodosLosEstados();

    }


    function limpiarTodosLosEstados() {

        const campos = [

            [run, "feedbackRunUsuario"],

            [tipoUsuario, "feedbackTipoUsuario"],

            [nombre, "feedbackNombreUsuario"],

            [apellidos, "feedbackApellidosUsuario"],

            [correo, "feedbackCorreoUsuario"],

            [
                fechaNacimiento,
                "feedbackFechaNacimientoUsuario"
            ],

            [region, "feedbackRegionUsuario"],

            [comuna, "feedbackComunaUsuario"],

            [calle, "feedbackCalleUsuario"],

            [
                numeroDomicilio,
                "feedbackNumeroDomicilioUsuario"
            ],

            [
                tipoDomicilio,
                "feedbackTipoDomicilioUsuario"
            ],

            [
                numeroUnidad,
                "feedbackNumeroUnidadUsuario"
            ],

            [
                codigoPostal,
                "feedbackCodigoPostalUsuario"
            ],

            [
                contrasena,
                "feedbackContrasenaUsuario"
            ],

            [
                confirmarContrasena,
                "feedbackConfirmarContrasenaUsuario"
            ]

        ];


        campos.forEach(
            function (campo) {

                limpiarEstado(
                    campo[0],
                    campo[1]
                );

            }
        );

    }


    botonCancelar.addEventListener(
        "click",
        function () {

            limpiarFormulario();

            limpiarMensajeGeneral();

        }
    );


    // =================================================
    // GUARDAR / EDITAR
    // =================================================

    formulario.addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();


            // Guardamos el perfil AHORA,
            // antes de limpiar cualquier campo.

            const perfilSeleccionado =
                tipoUsuario.value;


            const valido = [

                validarRun(),

                validarTipoUsuario(),

                validarNombre(),

                validarApellidos(),

                validarCorreo(),

                validarFechaNacimiento(),

                validarRegion(),

                validarComuna(),

                validarCalle(),

                validarNumeroDomicilio(),

                validarTipoDomicilio(),

                validarNumeroUnidad(),

                validarCodigoPostal(),

                validarContrasena(),

                validarConfirmarContrasena()

            ].every(
                function (resultado) {

                    return (
                        resultado ===
                        true
                    );

                }
            );


            if (!valido) {

                mensaje.className =
                    "alert alert-danger mt-4";


                mensaje.textContent =
                    "Revisa los campos marcados en rojo antes de guardar el usuario.";


                return;

            }


            const usuarios =
                obtenerUsuarios();


            const runNuevo =
                run.value
                    .trim()
                    .toUpperCase();


            const runAnterior =
                runOriginal.value
                    .trim()
                    .toUpperCase();


            const correoNuevo =
                correo.value
                    .trim()
                    .toLowerCase();


            // =========================================
            // DUPLICADOS
            // =========================================

            const runDuplicado =
                usuarios.some(
                    function (usuario) {

                        const runUsuario =
                            obtenerRunUsuario(
                                usuario
                            );


                        if (
                            runAnterior !==
                                "" &&
                            runUsuario ===
                                runAnterior
                        ) {

                            return false;

                        }


                        return (
                            runUsuario ===
                            runNuevo
                        );

                    }
                );


            if (
                runDuplicado
            ) {

                mostrarError(
                    run,
                    "feedbackRunUsuario",
                    "Este RUN ya está registrado"
                );


                return;

            }


            const correoDuplicado =
                usuarios.some(
                    function (usuario) {

                        const runUsuario =
                            obtenerRunUsuario(
                                usuario
                            );


                        if (
                            runAnterior !==
                                "" &&
                            runUsuario ===
                                runAnterior
                        ) {

                            return false;

                        }


                        return (
                            String(
                                usuario.correo ||
                                ""
                            ).toLowerCase() ===
                            correoNuevo
                        );

                    }
                );


            if (
                correoDuplicado
            ) {

                mostrarError(
                    correo,
                    "feedbackCorreoUsuario",
                    "Este correo ya está registrado"
                );


                return;

            }


            // =========================================
            // DIRECCIÓN
            // =========================================

            let direccionCompleta =
                calle.value.trim() +
                " " +
                numeroDomicilio.value;


            if (
                tipoDomicilio.value ===
                "Departamento"
            ) {

                direccionCompleta +=
                    ", Departamento " +
                    numeroUnidad.value;

            }


            direccionCompleta +=
                ", " +
                comuna.value +
                ", " +
                region.value +
                ", Código postal " +
                codigoPostal.value;


            if (
                direccionCompleta.length >
                300
            ) {

                mostrarError(
                    calle,
                    "feedbackCalleUsuario",
                    "La dirección completa no puede superar 300 caracteres"
                );


                return;

            }


            // =========================================
            // DATOS NUEVOS
            // =========================================

            const datosActualizados = {

                run:
                    runNuevo,

                rutNumero:
                    runNuevo.slice(
                        0,
                        -1
                    ),

                digitoVerificador:
                    runNuevo.slice(
                        -1
                    ),

                nombre:
                    nombre.value.trim(),

                apellidos:
                    apellidos.value.trim(),

                correo:
                    correoNuevo,

                fechaNacimiento:
                    fechaNacimiento.value,

                region:
                    region.value,

                comuna:
                    comuna.value,

                calle:
                    calle.value.trim(),

                numeroDomicilio:
                    numeroDomicilio.value,

                tipoDomicilio:
                    tipoDomicilio.value,

                numeroUnidad:
                    tipoDomicilio.value ===
                        "Departamento"
                        ? numeroUnidad.value
                        : "",

                codigoPostal:
                    codigoPostal.value,

                direccion:
                    direccionCompleta,

                contrasena:
                    contrasena.value,

                tipoUsuario:
                    perfilSeleccionado

            };


            // =========================================
            // EDITAR EXISTENTE
            // =========================================

            if (
                runAnterior !==
                ""
            ) {

                const usuariosActualizados =
                    usuarios.map(
                        function (usuario) {

                            const runUsuario =
                                obtenerRunUsuario(
                                    usuario
                                );


                            if (
                                runUsuario !==
                                runAnterior
                            ) {

                                return usuario;

                            }


                            return {

                                ...usuario,

                                ...datosActualizados,

                                // Se fuerza explícitamente
                                // el perfil seleccionado.

                                tipoUsuario:
                                    perfilSeleccionado

                            };

                        }
                    );


                guardarUsuarios(
                    usuariosActualizados
                );


                actualizarSesionSiCorresponde(
                    runAnterior,
                    datosActualizados
                );


                // Render vuelve a leer localStorage.
                renderizarUsuarios();


                limpiarFormulario();


                mensaje.className =
                    "alert alert-success mt-4";


                mensaje.innerHTML = `

                    <strong>
                        Usuario actualizado correctamente.
                    </strong>

                    <div class="mt-1">
                        Perfil asignado:
                        ${escaparHTML(
                            perfilSeleccionado
                        )}
                    </div>

                `;


                return;

            }


            // =========================================
            // CREAR
            // =========================================

            usuarios.push(
                datosActualizados
            );


            guardarUsuarios(
                usuarios
            );


            renderizarUsuarios();


            limpiarFormulario();


            mensaje.className =
                "alert alert-success mt-4";


            mensaje.innerHTML = `

                <strong>
                    Usuario creado correctamente.
                </strong>

                <div class="mt-1">
                    Perfil asignado:
                    ${escaparHTML(
                        perfilSeleccionado
                    )}
                </div>

            `;

        }
    );


    // =================================================
    // ACTUALIZAR SESIÓN ACTUAL
    // =================================================

    function actualizarSesionSiCorresponde(
        runAnterior,
        usuarioNuevo
    ) {

        try {

            const sesion =
                JSON.parse(
                    localStorage.getItem(
                        "usuarioSesionAlbedo"
                    )
                );


            if (!sesion) {

                return;

            }


            const runSesion =
                obtenerRunUsuario(
                    sesion
                );


            const mismoRun =
                runSesion ===
                runAnterior;


            const mismoCorreo =
                String(
                    sesion.correo ||
                    ""
                ).toLowerCase() ===
                String(
                    usuarioNuevo.correo ||
                    ""
                ).toLowerCase();


            if (
                !mismoRun &&
                !mismoCorreo
            ) {

                return;

            }


            localStorage.setItem(
                "usuarioSesionAlbedo",
                JSON.stringify(
                    {
                        ...sesion,

                        run:
                            usuarioNuevo.run,

                        rutNumero:
                            usuarioNuevo.rutNumero,

                        digitoVerificador:
                            usuarioNuevo.digitoVerificador,

                        nombre:
                            usuarioNuevo.nombre,

                        apellidos:
                            usuarioNuevo.apellidos,

                        correo:
                            usuarioNuevo.correo,

                        tipoUsuario:
                            usuarioNuevo.tipoUsuario
                    }
                )
            );

        } catch (error) {

            // La edición del usuario continúa.

        }

    }


    // =================================================
    // INICIO
    // =================================================

    renderizarUsuarios();

});