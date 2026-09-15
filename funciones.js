// =============================================
// FORMULARIO DE CONTACTO ALBEDO
// =============================================

document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("formularioContacto");

    const nombre = document.getElementById("nombre");
    const correo = document.getElementById("correo");
    const telefono = document.getElementById("telefono");
    const motivo = document.getElementById("motivo");
    const mensaje = document.getElementById("mensaje");
    const terminos = document.getElementById("terminos");


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

    nombre.addEventListener("input", validarNombre);

    correo.addEventListener("input", validarCorreo);

    telefono.addEventListener("input", validarTelefono);

    motivo.addEventListener("change", validarMotivo);

    mensaje.addEventListener("input", validarMensaje);

    terminos.addEventListener("change", validarTerminos);


    // =========================================
    // NOMBRE
    // Requerido - máximo 100 caracteres
    // =========================================

    function validarNombre() {

        let valor = nombre.value.trim();

        if (valor == "") {

            mostrarError(
                nombre,
                "feedbackNombre",
                "Debe ingresar su nombre"
            );

            return false;
        }


        if (valor.length > 100) {

            mostrarError(
                nombre,
                "feedbackNombre",
                "El nombre no puede superar los 100 caracteres"
            );

            return false;
        }


        mostrarCorrecto(
            nombre,
            "feedbackNombre",
            "Nombre válido"
        );

        return true;
    }


    // =========================================
    // CORREO
    // Requerido
    // Máximo 100 caracteres
    // Formato válido
    // Dominios permitidos
    // =========================================

    function validarCorreo() {

        let valor = correo.value.trim();


        if (valor == "") {

            mostrarError(
                correo,
                "feedbackCorreo",
                "Debe ingresar su correo electrónico"
            );

            return false;
        }


        if (valor.length > 100) {

            mostrarError(
                correo,
                "feedbackCorreo",
                "El correo no puede superar los 100 caracteres"
            );

            return false;
        }


        if (regExCorreo.test(valor) == false) {

            mostrarError(
                correo,
                "feedbackCorreo",
                "El formato del correo no es válido"
            );

            return false;
        }


        let partesCorreo = valor.split("@");

        let dominio = partesCorreo[1].toLowerCase();


        if (dominiosPermitidos.includes(dominio) == false) {

            mostrarError(
                correo,
                "feedbackCorreo",
                "Correo no permitido. Solo se acepta @gmail.com, @duoc.cl o @profesor.duoc.cl"
            );

            return false;
        }


        mostrarCorrecto(
            correo,
            "feedbackCorreo",
            "Correo válido: @" + dominio
        );

        return true;
    }


    // =========================================
    // TELÉFONO
    // Requerido
    // =========================================

    function validarTelefono() {

        let valor = telefono.value.trim();


        if (valor == "") {

            mostrarError(
                telefono,
                "feedbackTelefono",
                "Debe ingresar su teléfono"
            );

            return false;
        }


        mostrarCorrecto(
            telefono,
            "feedbackTelefono",
            "Teléfono ingresado correctamente"
        );

        return true;
    }


    // =========================================
    // MOTIVO
    // Requerido
    // =========================================

    function validarMotivo() {

        if (motivo.value == "") {

            mostrarError(
                motivo,
                "feedbackMotivo",
                "Debe seleccionar un motivo de contacto"
            );

            return false;
        }


        mostrarCorrecto(
            motivo,
            "feedbackMotivo",
            "Motivo seleccionado correctamente"
        );

        return true;
    }


    // =========================================
    // MENSAJE
    // Requerido - máximo 500 caracteres
    // =========================================

    function validarMensaje() {

        let valor = mensaje.value.trim();


        if (valor == "") {

            mostrarError(
                mensaje,
                "feedbackMensaje",
                "Debe ingresar un mensaje"
            );

            return false;
        }


        if (valor.length > 500) {

            mostrarError(
                mensaje,
                "feedbackMensaje",
                "El mensaje no puede superar los 500 caracteres. Lleva "
                + valor.length
                + " caracteres"
            );

            return false;
        }


        mostrarCorrecto(
            mensaje,
            "feedbackMensaje",
            "Mensaje válido: "
            + valor.length
            + " de 500 caracteres"
        );

        return true;
    }


    // =========================================
    // CHECKBOX
    // =========================================

    function validarTerminos() {

        if (terminos.checked == false) {

            mostrarError(
                terminos,
                "feedbackTerminos",
                "Debe confirmar que los datos ingresados son correctos"
            );

            return false;
        }


        mostrarCorrecto(
            terminos,
            "feedbackTerminos",
            "Datos confirmados"
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


        let nombreValido = validarNombre();

        let correoValido = validarCorreo();

        let telefonoValido = validarTelefono();

        let motivoValido = validarMotivo();

        let mensajeValido = validarMensaje();

        let terminosValidos = validarTerminos();


        const resultado =
            document.getElementById("mensajeResultado");


        if (
            nombreValido == true &&
            correoValido == true &&
            telefonoValido == true &&
            motivoValido == true &&
            mensajeValido == true &&
            terminosValidos == true
        ) {

            resultado.className =
                "alert alert-success mt-4";

            resultado.textContent =
                "Consulta enviada correctamente. Gracias por contactar a ALBEDO Outdoor.";

        } else {

            resultado.className =
                "alert alert-danger mt-4";

            resultado.textContent =
                "No se pudo enviar la consulta. Revise los campos marcados en rojo.";
        }

    });

});