// =============================================
// FORMULARIO DE INICIO DE SESIÓN ALBEDO
// =============================================

document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("formularioLogin");

    const correo = document.getElementById("correoLogin");
    const contrasena = document.getElementById("contrasenaLogin");


    // =========================================
    // VALIDACIÓN DE CORREO
    // =========================================

    const regExCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const dominiosPermitidos = [
        "gmail.com",
        "duoc.cl",
        "profesor.duoc.cl"
    ];


    // =========================================
    // VALIDACIÓN EN TIEMPO REAL
    // =========================================

    correo.addEventListener("input", validarCorreo);

    contrasena.addEventListener("input", validarContrasena);


    // =========================================
    // CORREO
    // Requerido - máximo 100 caracteres - dominios permitidos
    // =========================================

    function validarCorreo() {

        let valor = correo.value.trim();

        if (valor == "") {

            mostrarError(
                correo,
                "feedbackCorreoLogin",
                "Debe ingresar su correo electrónico"
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


        if (regExCorreo.test(valor) == false) {

            mostrarError(
                correo,
                "feedbackCorreoLogin",
                "El formato del correo no es válido"
            );

            return false;
        }


        let dominio = valor.split("@")[1].toLowerCase();


        if (dominiosPermitidos.includes(dominio) == false) {

            mostrarError(
                correo,
                "feedbackCorreoLogin",
                "Correo no permitido. Solo se acepta @gmail.com, @duoc.cl o @profesor.duoc.cl"
            );

            return false;
        }


        mostrarCorrecto(
            correo,
            "feedbackCorreoLogin",
            "Correo válido: @" + dominio
        );

        return true;
    }


    // =========================================
    // CONTRASEÑA
    // Requerida - entre 4 y 10 caracteres
    // =========================================

    function validarContrasena() {

        let valor = contrasena.value;

        if (valor == "") {

            mostrarError(
                contrasena,
                "feedbackContrasenaLogin",
                "Debe ingresar su contraseña"
            );

            return false;
        }


        if (valor.length < 4 || valor.length > 10) {

            mostrarError(
                contrasena,
                "feedbackContrasenaLogin",
                "La contraseña debe tener entre 4 y 10 caracteres"
            );

            return false;
        }


        mostrarCorrecto(
            contrasena,
            "feedbackContrasenaLogin",
            "Contraseña válida"
        );

        return true;
    }


    // =========================================
    // MOSTRAR ERROR
    // =========================================

    function mostrarError(campo, idFeedback, texto) {

        const feedback = document.getElementById(idFeedback);

        campo.classList.remove("is-valid");
        campo.classList.add("is-invalid");

        feedback.className = "small text-danger mt-1";
        feedback.textContent = texto;
    }


    // =========================================
    // MOSTRAR CORRECTO
    // =========================================

    function mostrarCorrecto(campo, idFeedback, texto) {

        const feedback = document.getElementById(idFeedback);

        campo.classList.remove("is-invalid");
        campo.classList.add("is-valid");

        feedback.className = "small text-success mt-1";
        feedback.textContent = texto;
    }


    // =========================================
    // ENVIAR FORMULARIO
    // =========================================

    formulario.addEventListener("submit", function (evento) {

        evento.preventDefault();


        let correoValido = validarCorreo();

        let contrasenaValida = validarContrasena();


        const resultado = document.getElementById("mensajeResultadoLogin");


        if (correoValido == true && contrasenaValida == true) {

            resultado.className = "alert alert-success mt-4";

            resultado.textContent =
                "Inicio de sesión exitoso. Bienvenido a ALBEDO Outdoor.";

        } else {

            resultado.className = "alert alert-danger mt-4";

            resultado.textContent =
                "No se pudo iniciar sesión. Revise los campos marcados en rojo.";
        }

    });

});
