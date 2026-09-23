// =====================================================
// ALBEDO OUTDOOR
// LOGIN + ADMINISTRADOR INICIAL + CONTROL DE ROLES
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    // =================================================
    // CONFIGURACIÓN
    // =================================================

    const CLAVE_USUARIOS = "usuariosAlbedo";
    const CLAVE_SESION = "usuarioSesionAlbedo";

    const perfilesPermitidos = [
        "Administrador",
        "Vendedor",
        "Cliente"
    ];

    const dominiosPermitidos = [
        "gmail.com",
        "duoc.cl",
        "profesor.duoc.cl"
    ];

    const regExCorreo =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    // =================================================
    // ADMINISTRADOR INICIAL
    // Se crea automáticamente si todavía no existe.
    // =================================================

    const administradorInicial = {

        run: "123456785",

        rutNumero: "12345678",

        digitoVerificador: "5",

        nombre: "Claudio",

        apellidos: "Cordova",

        correo: "admin@duoc.cl",

        fechaNacimiento: "2000-03-23",

        region: "Biobío",

        comuna: "Concepción",

        calle: "Avenida Los Carrera",

        numeroDomicilio: "1234",

        tipoDomicilio: "Casa",

        numeroUnidad: "",

        codigoPostal: "4030000",

        direccion:
            "Avenida Los Carrera 1234, Concepción, Biobío, Código postal 4030000",

        contrasena: "Admin2026#",

        tipoUsuario: "Administrador"

    };


    // =================================================
    // OBTENER USUARIOS
    // =================================================

    function obtenerUsuarios() {

        try {

            const usuarios =
                JSON.parse(
                    localStorage.getItem(CLAVE_USUARIOS)
                );

            return Array.isArray(usuarios)
                ? usuarios
                : [];

        } catch (error) {

            return [];

        }

    }


    // =================================================
    // GUARDAR USUARIOS
    // =================================================

    function guardarUsuarios(usuarios) {

        localStorage.setItem(
            CLAVE_USUARIOS,
            JSON.stringify(usuarios)
        );

    }


    // =================================================
    // CREAR ADMINISTRADOR INICIAL
    // =================================================

    function inicializarAdministrador() {

        const usuarios =
            obtenerUsuarios();

        const administradorExiste =
            usuarios.some(function (usuario) {

                return (
                    String(usuario.correo || "")
                        .trim()
                        .toLowerCase() ===
                    administradorInicial.correo
                        .toLowerCase()
                );

            });


        if (administradorExiste) {

            return;

        }


        usuarios.push(administradorInicial);

        guardarUsuarios(usuarios);

    }


    // Crear el administrador al cargar el login.
    inicializarAdministrador();


    // =================================================
    // ELEMENTOS DEL LOGIN
    // =================================================

    const formulario =
        document.getElementById("formularioLogin");

    const correo =
        document.getElementById("correoLogin");

    const contrasena =
        document.getElementById("contrasenaLogin");

    const resultado =
        document.getElementById("mensajeResultadoLogin");


    if (
        !formulario ||
        !correo ||
        !contrasena ||
        !resultado
    ) {

        return;

    }


    // =================================================
    // VALIDACIÓN EN TIEMPO REAL
    // =================================================

    correo.addEventListener("input", function () {

        limpiarResultadoGeneral();

        validarCorreo();

    });


    contrasena.addEventListener("input", function () {

        limpiarResultadoGeneral();

        validarContrasena();

    });


    // =================================================
    // VALIDAR CORREO
    // =================================================

    function validarCorreo() {

        const valorOriginal =
            correo.value;

        const valor =
            valorOriginal
                .trim()
                .toLowerCase();


        if (valor === "") {

            mostrarError(
                correo,
                "feedbackCorreoLogin",
                "Debe ingresar su correo electrónico"
            );

            return false;

        }


        if (/\s/.test(valorOriginal)) {

            mostrarError(
                correo,
                "feedbackCorreoLogin",
                "El correo no puede contener espacios"
            );

            return false;

        }


        if (valor.length > 100) {

            mostrarError(
                correo,
                "feedbackCorreoLogin",
                "El correo no puede superar los 100 caracteres"
            );

            return false;

        }


        if (!regExCorreo.test(valor)) {

            mostrarError(
                correo,
                "feedbackCorreoLogin",
                "El formato del correo no es válido"
            );

            return false;

        }


        const dominio =
            valor.split("@")[1];


        if (
            !dominiosPermitidos.includes(dominio)
        ) {

            mostrarError(
                correo,
                "feedbackCorreoLogin",
                "Solo se acepta @gmail.com, @duoc.cl o @profesor.duoc.cl"
            );

            return false;

        }


        mostrarCorrecto(
            correo,
            "feedbackCorreoLogin"
        );

        return true;

    }


    // =================================================
    // VALIDAR CONTRASEÑA
    // =================================================

    function validarContrasena() {

        const valor =
            contrasena.value;


        if (valor === "") {

            mostrarError(
                contrasena,
                "feedbackContrasenaLogin",
                "Debe ingresar su contraseña"
            );

            return false;

        }


        if (valor.length !== 10) {

            mostrarError(
                contrasena,
                "feedbackContrasenaLogin",
                "La contraseña debe tener exactamente 10 caracteres"
            );

            return false;

        }


        if (/\s/.test(valor)) {

            mostrarError(
                contrasena,
                "feedbackContrasenaLogin",
                "La contraseña no puede contener espacios"
            );

            return false;

        }


        if (
            !/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/u.test(valor)
        ) {

            mostrarError(
                contrasena,
                "feedbackContrasenaLogin",
                "La contraseña debe contener al menos una letra"
            );

            return false;

        }


        if (!/[0-9]/.test(valor)) {

            mostrarError(
                contrasena,
                "feedbackContrasenaLogin",
                "La contraseña debe contener al menos un número"
            );

            return false;

        }


        if (
            !/[%&$#\/()="!]/.test(valor)
        ) {

            mostrarError(
                contrasena,
                "feedbackContrasenaLogin",
                'Debe contener un símbolo: % & $ # / ( ) = " !'
            );

            return false;

        }


        const caracteresPermitidos =
            /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9%&$#\/()="!]+$/u;


        if (
            !caracteresPermitidos.test(valor)
        ) {

            mostrarError(
                contrasena,
                "feedbackContrasenaLogin",
                "La contraseña contiene caracteres no permitidos"
            );

            return false;

        }


        mostrarCorrecto(
            contrasena,
            "feedbackContrasenaLogin"
        );

        return true;

    }


    // =================================================
    // PERFIL
    // =================================================

    function obtenerPerfil(usuario) {

        if (
            perfilesPermitidos.includes(
                usuario.tipoUsuario
            )
        ) {

            return usuario.tipoUsuario;

        }


        // Usuarios antiguos sin perfil
        // se consideran Clientes.
        return "Cliente";

    }


    // =================================================
    // RUN
    // =================================================

    function obtenerRun(usuario) {

        if (usuario.run) {

            return String(usuario.run)
                .toUpperCase();

        }


        if (
            usuario.rutNumero &&
            usuario.digitoVerificador
        ) {

            return (
                String(usuario.rutNumero) +
                String(
                    usuario.digitoVerificador
                ).toUpperCase()
            );

        }


        return "";

    }


    // =================================================
    // MOSTRAR ERROR
    // =================================================

    function mostrarError(
        campo,
        idFeedback,
        texto
    ) {

        const feedback =
            document.getElementById(idFeedback);

        campo.classList.remove("is-valid");

        campo.classList.add("is-invalid");


        if (feedback) {

            feedback.className =
                "small text-danger mt-1";

            feedback.textContent =
                texto;

        }

    }


    // =================================================
    // MOSTRAR CORRECTO
    // =================================================

    function mostrarCorrecto(
        campo,
        idFeedback
    ) {

        const feedback =
            document.getElementById(idFeedback);

        campo.classList.remove("is-invalid");

        campo.classList.add("is-valid");


        if (feedback) {

            feedback.className = "";

            feedback.textContent = "";

        }

    }


    // =================================================
    // CREDENCIALES INCORRECTAS
    // =================================================

    function mostrarCredencialesIncorrectas() {

        correo.classList.remove(
            "is-valid",
            "is-invalid"
        );

        contrasena.classList.remove(
            "is-valid",
            "is-invalid"
        );


        const feedbackCorreo =
            document.getElementById(
                "feedbackCorreoLogin"
            );

        const feedbackContrasena =
            document.getElementById(
                "feedbackContrasenaLogin"
            );


        if (feedbackCorreo) {

            feedbackCorreo.className = "";

            feedbackCorreo.textContent = "";

        }


        if (feedbackContrasena) {

            feedbackContrasena.className = "";

            feedbackContrasena.textContent = "";

        }


        resultado.className =
            "alert alert-danger mt-4";

        resultado.textContent =
            "Correo o contraseña incorrectos.";

    }


    // =================================================
    // LIMPIAR MENSAJE
    // =================================================

    function limpiarResultadoGeneral() {

        resultado.className = "";

        resultado.textContent = "";

    }


    // =================================================
    // DESTINO SEGÚN ROL
    // =================================================

    function obtenerDestino(perfil) {

        if (perfil === "Administrador") {

            return "admin.html";

        }


        if (perfil === "Vendedor") {

            return "vendedor.html";

        }


        return "index.html";

    }


    // =================================================
    // INICIAR SESIÓN
    // =================================================

    formulario.addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();


            const correoValido =
                validarCorreo();

            const contrasenaValida =
                validarContrasena();


            if (
                !correoValido ||
                !contrasenaValida
            ) {

                resultado.className =
                    "alert alert-danger mt-4";

                resultado.textContent =
                    "Revisa los datos ingresados.";

                return;

            }


            const usuarios =
                obtenerUsuarios();


            const correoIngresado =
                correo.value
                    .trim()
                    .toLowerCase();

            const contrasenaIngresada =
                contrasena.value;


            const usuarioEncontrado =
                usuarios.find(function (usuario) {

                    return (
                        String(
                            usuario.correo || ""
                        )
                            .trim()
                            .toLowerCase() ===
                            correoIngresado &&

                        String(
                            usuario.contrasena || ""
                        ) ===
                            contrasenaIngresada
                    );

                });


            if (!usuarioEncontrado) {

                mostrarCredencialesIncorrectas();

                return;

            }


            const perfil =
                obtenerPerfil(
                    usuarioEncontrado
                );


            const usuarioSesion = {

                run:
                    obtenerRun(
                        usuarioEncontrado
                    ),

                nombre:
                    usuarioEncontrado.nombre,

                apellidos:
                    usuarioEncontrado.apellidos,

                correo:
                    usuarioEncontrado.correo,

                tipoUsuario:
                    perfil

            };


            localStorage.setItem(
                CLAVE_SESION,
                JSON.stringify(usuarioSesion)
            );


            resultado.className =
                "alert alert-success mt-4";

            resultado.innerHTML = `

                <strong>
                    Inicio de sesión exitoso.
                </strong>

                <div class="mt-1">
                    Bienvenido ${usuarioEncontrado.nombre}.
                </div>

            `;


            const destino =
                obtenerDestino(perfil);


            setTimeout(
                function () {

                    window.location.href =
                        destino;

                },
                700
            );

        }
    );

});