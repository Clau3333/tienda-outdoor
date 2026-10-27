// =====================================================
// FORMULARIO DE CONTACTO - ALBEDO OUTDOOR
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // =================================================
        // 1. CAMPOS
        // =================================================

        const formulario =
            document.getElementById(
                "formularioContacto"
            );


        if (!formulario) {

            return;

        }


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
            document.getElementById(
                "mensajeResultado"
            );



        // =================================================
        // 2. CORREOS
        // =================================================

        const regExCorreo =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        const dominiosPermitidos = [

            "gmail.com",
            "duoc.cl",
            "profesor.duoc.cl"

        ];



        // =================================================
        // 3. OBTENER SESIÓN
        // =================================================

        function obtenerUsuarioSesion() {

            try {

                const usuario =
                    JSON.parse(
                        localStorage.getItem(
                            "usuarioSesionAlbedo"
                        )
                    );


                if (
                    usuario &&
                    typeof usuario === "object"
                ) {

                    return usuario;

                }

            } catch (error) {

                return null;

            }


            return null;

        }



        // =================================================
        // 4. FORMATEAR NOMBRE
        // =================================================

        function formatearNombre(
            texto
        ) {

            return String(
                texto || ""
            )
                .trim()
                .toLowerCase()
                .split(/\s+/)
                .filter(Boolean)
                .map(
                    function (palabra) {

                        return (
                            palabra.charAt(0).toUpperCase() +
                            palabra.slice(1)
                        );

                    }
                )
                .join(" ");

        }



        // =================================================
        // 5. PRECARGAR DATOS
        // =================================================

        function precargarDatosUsuario() {

            const usuario =
                obtenerUsuarioSesion();


            if (!usuario) {

                return;

            }


            const nombreCompleto =
                formatearNombre(
                    [
                        usuario.nombre,
                        usuario.apellidos
                    ]
                        .filter(Boolean)
                        .join(" ")
                );


            if (
                nombreCompleto !== ""
            ) {

                nombre.value =
                    nombreCompleto;

                nombre.readOnly =
                    true;

                nombre.setAttribute(
                    "aria-readonly",
                    "true"
                );

                nombre.title =
                    "Dato cargado desde tu cuenta ALBEDO";

            }


            if (
                usuario.correo
            ) {

                correo.value =
                    String(
                        usuario.correo
                    )
                        .trim()
                        .toLowerCase();

                correo.readOnly =
                    true;

                correo.setAttribute(
                    "aria-readonly",
                    "true"
                );

                correo.title =
                    "Dato cargado desde tu cuenta ALBEDO";

            }


            validarNombre();

            validarCorreo();

        }



        // =================================================
        // 6. EVENTOS
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


                telefono.value =
                    telefono.value
                        .replace(
                            /\D/g,
                            ""
                        )
                        .slice(
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
        // 7. NOMBRE
        // =================================================

        function validarNombre() {

            const valor =
                nombre.value.trim();


            if (
                valor === ""
            ) {

                mostrarError(
                    nombre,
                    "feedbackNombre",
                    "Debe ingresar su nombre"
                );

                return false;

            }


            if (
                valor.length > 100
            ) {

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
        // 8. CORREO
        // =================================================

        function validarCorreo() {

            const valorOriginal =
                correo.value;


            const valor =
                valorOriginal
                    .trim()
                    .toLowerCase();


            if (
                valor === ""
            ) {

                mostrarError(
                    correo,
                    "feedbackCorreo",
                    "Debe ingresar su correo electrónico"
                );

                return false;

            }


            if (
                /\s/.test(
                    valorOriginal
                )
            ) {

                mostrarError(
                    correo,
                    "feedbackCorreo",
                    "El correo no puede contener espacios"
                );

                return false;

            }


            if (
                valor.length > 100
            ) {

                mostrarError(
                    correo,
                    "feedbackCorreo",
                    "El correo no puede superar los 100 caracteres"
                );

                return false;

            }


            if (
                regExCorreo.test(
                    valor
                ) === false
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
        // 9. TELÉFONO OPCIONAL
        // =================================================

        function validarTelefono() {

            const valor =
                telefono.value.trim();


            // ---------------------------------------------
            // VACÍO = VÁLIDO PORQUE ES OPCIONAL
            // ---------------------------------------------

            if (
                valor === ""
            ) {

                telefono.classList.remove(
                    "is-valid",
                    "is-invalid"
                );


                const feedback =
                    document.getElementById(
                        "feedbackTelefono"
                    );


                feedback.className =
                    "";


                feedback.textContent =
                    "";


                return true;

            }



            // ---------------------------------------------
            // SI SE INGRESA, DEBEN SER 8 DÍGITOS
            // ---------------------------------------------

            if (
                /^[0-9]{8}$/.test(
                    valor
                ) === false
            ) {

                mostrarError(
                    telefono,
                    "feedbackTelefono",
                    "Si ingresas un teléfono, debe contener exactamente 8 números"
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
        // 10. MOTIVO
        // =================================================

        function validarMotivo() {

            if (
                motivo.value === ""
            ) {

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
        // 11. MENSAJE
        // =================================================

        function validarMensaje() {

            const valor =
                mensaje.value.trim();


            if (
                valor === ""
            ) {

                mostrarError(
                    mensaje,
                    "feedbackMensaje",
                    "Debe ingresar un mensaje"
                );


                return false;

            }


            if (
                valor.length > 500
            ) {

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
        // 12. CONFIRMACIÓN
        // =================================================

        function validarTerminos() {

            if (
                terminos.checked ===
                false
            ) {

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
        // 13. ERROR
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
        // 14. CORRECTO
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
        // 15. LIMPIAR RESULTADO
        // =================================================

        function limpiarResultadoGeneral() {

            resultado.className =
                "";


            resultado.innerHTML =
                "";

        }



        // =================================================
        // 16. ENVIAR FORMULARIO
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

                        <div class="mt-1 mb-3">
                            Gracias por contactar a ALBEDO Outdoor.
                        </div>

                        <a
                            href="index.html"
                            class="btn btn-dark"
                        >
                            Volver al inicio
                        </a>

                    `;


                    return;

                }



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



        // =================================================
        // 17. PRECARGAR USUARIO
        // =================================================

        precargarDatosUsuario();


    }
);