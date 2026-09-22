// =====================================================
// 1. INICIO DE SESIÓN - ALBEDO OUTDOOR
// =====================================================

document.addEventListener("DOMContentLoaded", function () {


    // =================================================
    // 2. LIMPIAR PARÁMETROS ANTIGUOS DE LA URL
    // =================================================

    if (window.location.search !== "") {

        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );

    }



    // =================================================
    // 3. CAMPOS DEL LOGIN
    // =================================================

    const formulario =
        document.getElementById("formularioLogin");

    const correo =
        document.getElementById("correoLogin");

    const contrasena =
        document.getElementById("contrasenaLogin");

    const resultado =
        document.getElementById(
            "mensajeResultadoLogin"
        );



    // =================================================
    // 4. REGLAS DEL CORREO
    // =================================================

    const regExCorreo =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const dominiosPermitidos = [
        "gmail.com",
        "duoc.cl",
        "profesor.duoc.cl"
    ];



    // =================================================
    // 5. VALIDACIÓN EN TIEMPO REAL
    // =================================================

    correo.addEventListener(
        "input",
        function () {

            limpiarResultadoGeneral();

            validarCorreo();

        }
    );


    contrasena.addEventListener(
        "input",
        function () {

            limpiarResultadoGeneral();

            validarContrasena();

        }
    );



    // =================================================
    // 6. VALIDAR CORREO
    // =================================================

    function validarCorreo() {

        const valorOriginal =
            correo.value;

        const valor =
            valorOriginal.toLowerCase();


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


        if (
            regExCorreo.test(valor) === false
        ) {

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
            dominiosPermitidos.includes(dominio) === false
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
            "feedbackCorreoLogin",
            "Formato de correo válido"
        );


        return true;

    }



    // =================================================
    // 7. VALIDAR CONTRASEÑA
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
            /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/u.test(valor) === false
        ) {

            mostrarError(
                contrasena,
                "feedbackContrasenaLogin",
                "La contraseña debe contener al menos una letra"
            );

            return false;
        }


        if (
            /[0-9]/.test(valor) === false
        ) {

            mostrarError(
                contrasena,
                "feedbackContrasenaLogin",
                "La contraseña debe contener al menos un número"
            );

            return false;
        }


        if (
            /[%&$#\/()="!]/.test(valor) === false
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
            caracteresPermitidos.test(valor) === false
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
            "feedbackContrasenaLogin",
            "Formato de contraseña válido"
        );


        return true;

    }



    // =================================================
    // 8. OBTENER USUARIOS REGISTRADOS
    // =================================================

    function obtenerUsuarios() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "usuariosAlbedo"
                )
            ) || [];

        } catch (error) {

            return [];

        }

    }



    // =================================================
    // 9. MENSAJES DE CAMPOS
    // =================================================

    function mostrarError(
        campo,
        idFeedback,
        texto
    ) {

        const feedback =
            document.getElementById(idFeedback);


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



    function mostrarCorrecto(
        campo,
        idFeedback,
        texto
    ) {

        const feedback =
            document.getElementById(idFeedback);


        campo.classList.remove(
            "is-invalid"
        );

        campo.classList.add(
            "is-valid"
        );


        feedback.className =
            "small text-success mt-1";

        feedback.textContent =
            texto;

    }



    // =================================================
    // 10. CREDENCIALES INCORRECTAS
    // =================================================

    function mostrarCredencialesIncorrectas() {

        // Quitamos estados verdes o rojos previos
        correo.classList.remove(
            "is-valid",
            "is-invalid"
        );

        contrasena.classList.remove(
            "is-valid",
            "is-invalid"
        );


        // Limpiamos mensajes individuales
        const feedbackCorreo =
            document.getElementById(
                "feedbackCorreoLogin"
            );

        const feedbackContrasena =
            document.getElementById(
                "feedbackContrasenaLogin"
            );


        feedbackCorreo.className = "";
        feedbackCorreo.textContent = "";

        feedbackContrasena.className = "";
        feedbackContrasena.textContent = "";


        // Un solo mensaje general
        resultado.className =
            "alert alert-danger mt-4";

        resultado.textContent =
            "Correo o contraseña incorrectos.";

    }



    // =================================================
    // 11. LIMPIAR MENSAJE GENERAL
    // =================================================

    function limpiarResultadoGeneral() {

        resultado.className = "";

        resultado.textContent = "";

    }



    // =================================================
    // 12. INICIAR SESIÓN
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
                correoValido === false ||
                contrasenaValida === false
            ) {

                resultado.className =
                    "alert alert-danger mt-4";

                resultado.textContent =
                    "Revisa los datos ingresados.";

                return;

            }



            // =================================================
            // 13. BUSCAR USUARIO
            // =================================================

            const usuarios =
                obtenerUsuarios();


            const correoIngresado =
                correo.value.toLowerCase();

            const contrasenaIngresada =
                contrasena.value;


            const usuarioEncontrado =
                usuarios.find(
                    function (usuario) {

                        return (
                            usuario.correo ===
                                correoIngresado &&

                            usuario.contrasena ===
                                contrasenaIngresada
                        );

                    }
                );



            // =================================================
            // 14. CREDENCIALES INCORRECTAS
            // =================================================

            if (!usuarioEncontrado) {

                mostrarCredencialesIncorrectas();

                return;

            }



            // =================================================
            // 15. CREAR SESIÓN
            // =================================================

            const usuarioSesion = {

                run:
                    usuarioEncontrado.run,

                nombre:
                    usuarioEncontrado.nombre,

                apellidos:
                    usuarioEncontrado.apellidos,

                correo:
                    usuarioEncontrado.correo,

                tipoUsuario:
                    usuarioEncontrado.tipoUsuario

            };


            localStorage.setItem(
                "usuarioSesionAlbedo",
                JSON.stringify(usuarioSesion)
            );



            // =================================================
            // 16. LOGIN EXITOSO
            // =================================================

            resultado.className =
                "alert alert-success mt-4";

            resultado.textContent =
                "Inicio de sesión exitoso. Bienvenido " +
                usuarioEncontrado.nombre +
                " a ALBEDO Outdoor.";



            // =================================================
            // 17. REDIRECCIONAR AL INICIO
            // =================================================

            setTimeout(
                function () {

                    window.location.href =
                        "index.html";

                },
                700
            );

        }
    );


});