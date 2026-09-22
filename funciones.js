// =====================================================
// FORMULARIO DE CONTACTO - ALBEDO OUTDOOR
// =====================================================

document.addEventListener("DOMContentLoaded", function () {


    // =================================================
    // 1. CAMPOS DEL FORMULARIO
    // =================================================

    const formulario =
        document.getElementById("formularioContacto");

    const nombre =
        document.getElementById("nombre");

    const correo =
        document.getElementById("correo");

    const telefono =
        document.getElementById("telefono");

    const motivo =
        document.getElementById("motivo");

    const mensaje =
        document.getElementById("mensaje");

    const terminos =
        document.getElementById("terminos");

    const resultado =
        document.getElementById("mensajeResultado");



    // =================================================
    // 2. CONFIGURACIÓN DEL CORREO
    // =================================================

    const regExCorreo =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    const dominiosPermitidos = [
        "gmail.com",
        "duoc.cl",
        "profesor.duoc.cl"
    ];



    // =================================================
    // 3. VALIDACIÓN EN TIEMPO REAL
    // =================================================

    nombre.addEventListener(
        "input",
        function () {

            limpiarResultadoGeneral();

            validarNombre();

        }
    );


    correo.addEventListener(
        "input",
        function () {

            limpiarResultadoGeneral();

            validarCorreo();

        }
    );


    telefono.addEventListener(
        "input",
        function () {

            limpiarResultadoGeneral();


            // Solo números.
            telefono.value =
                telefono.value.replace(
                    /\D/g,
                    ""
                );


            // Máximo 8 números.
            telefono.value =
                telefono.value.slice(
                    0,
                    8
                );


            validarTelefono();

        }
    );


    motivo.addEventListener(
        "change",
        function () {

            limpiarResultadoGeneral();

            validarMotivo();

        }
    );


    mensaje.addEventListener(
        "input",
        function () {

            limpiarResultadoGeneral();

            validarMensaje();

        }
    );


    terminos.addEventListener(
        "change",
        function () {

            limpiarResultadoGeneral();

            validarTerminos();

        }
    );



    // =================================================
    // 4. VALIDAR NOMBRE
    // =================================================

    function validarNombre() {


        const valor =
            nombre.value.trim();


        if (valor === "") {


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
            "feedbackNombre"
        );


        return true;

    }



    // =================================================
    // 5. VALIDAR CORREO
    // =================================================

    function validarCorreo() {


        const valorOriginal =
            correo.value;


        const valor =
            valorOriginal.toLowerCase();


        if (valor === "") {


            mostrarError(
                correo,
                "feedbackCorreo",
                "Debe ingresar su correo electrónico"
            );


            return false;

        }


        if (/\s/.test(valorOriginal)) {


            mostrarError(
                correo,
                "feedbackCorreo",
                "El correo no puede contener espacios"
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


        if (
            regExCorreo.test(valor) === false
        ) {


            mostrarError(
                correo,
                "feedbackCorreo",
                "El formato del correo no es válido"
            );


            return false;

        }


        const dominio =
            valor.split("@")[1];


        if (
            dominiosPermitidos.includes(
                dominio
            ) === false
        ) {


            mostrarError(
                correo,
                "feedbackCorreo",
                "Solo se acepta @gmail.com, @duoc.cl o @profesor.duoc.cl"
            );


            return false;

        }


        mostrarCorrecto(
            correo,
            "feedbackCorreo"
        );


        return true;

    }



    // =================================================
    // 6. VALIDAR TELÉFONO
    // Prefijo fijo +569
    // Exactamente 8 números
    // =================================================

    function validarTelefono() {


        const valor =
            telefono.value;


        if (valor === "") {


            mostrarError(
                telefono,
                "feedbackTelefono",
                "Debe ingresar su teléfono"
            );


            return false;

        }


        if (
            /^[0-9]+$/.test(valor) === false
        ) {


            mostrarError(
                telefono,
                "feedbackTelefono",
                "El teléfono solo puede contener números"
            );


            return false;

        }


        if (valor.length !== 8) {


            mostrarError(
                telefono,
                "feedbackTelefono",
                "Debe ingresar exactamente 8 números"
            );


            return false;

        }


        mostrarCorrecto(
            telefono,
            "feedbackTelefono"
        );


        return true;

    }



    // =================================================
    // 7. VALIDAR MOTIVO
    // =================================================

    function validarMotivo() {


        if (motivo.value === "") {


            mostrarError(
                motivo,
                "feedbackMotivo",
                "Debe seleccionar un motivo de contacto"
            );


            return false;

        }


        mostrarCorrecto(
            motivo,
            "feedbackMotivo"
        );


        return true;

    }



    // =================================================
    // 8. VALIDAR MENSAJE
    // =================================================

    function validarMensaje() {


        const valor =
            mensaje.value.trim();


        if (valor === "") {


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
                "El mensaje no puede superar los 500 caracteres"
            );


            return false;

        }


        mostrarCorrecto(
            mensaje,
            "feedbackMensaje"
        );


        return true;

    }



    // =================================================
    // 9. VALIDAR CONFIRMACIÓN
    // =================================================

    function validarTerminos() {


        if (terminos.checked === false) {


            mostrarError(
                terminos,
                "feedbackTerminos",
                "Debe confirmar que los datos ingresados son correctos"
            );


            return false;

        }


        mostrarCorrecto(
            terminos,
            "feedbackTerminos"
        );


        return true;

    }



    // =================================================
    // 10. MOSTRAR ERROR
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
    // 11. MOSTRAR CAMPO CORRECTO
    // Solo borde/check verde.
    // Sin texto redundante.
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
    // 12. LIMPIAR MENSAJE GENERAL
    // =================================================

    function limpiarResultadoGeneral() {


        resultado.className =
            "";


        resultado.innerHTML =
            "";

    }



    // =================================================
    // 13. ENVIAR FORMULARIO
    // =================================================

    formulario.addEventListener(
        "submit",
        function (evento) {


            evento.preventDefault();


            const nombreValido =
                validarNombre();


            const correoValido =
                validarCorreo();


            const telefonoValido =
                validarTelefono();


            const motivoValido =
                validarMotivo();


            const mensajeValido =
                validarMensaje();


            const terminosValidos =
                validarTerminos();



            // =========================================
            // FORMULARIO CORRECTO
            // =========================================

            if (
                nombreValido === true &&
                correoValido === true &&
                telefonoValido === true &&
                motivoValido === true &&
                mensajeValido === true &&
                terminosValidos === true
            ) {


                resultado.className =
                    "alert alert-success mt-4";


                resultado.innerHTML = `

                    <strong>
                        Consulta enviada correctamente
                    </strong>

                    <div class="mt-1">
                        Gracias por contactar a ALBEDO Outdoor.
                    </div>

                `;


                return;

            }



            // =========================================
            // FORMULARIO CON ERRORES
            // =========================================

            resultado.className =
                "alert alert-danger mt-4";


            resultado.innerHTML = `

                <strong>
                    Revisa los datos ingresados
                </strong>

                <div class="mt-1">
                    Corrige los campos marcados en rojo
                    antes de enviar tu consulta.
                </div>

            `;


        }
    );


});