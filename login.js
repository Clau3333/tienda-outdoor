// =====================================================
// 1. INICIO DE SESIÓN - ALBEDO OUTDOOR
// =====================================================

document.addEventListener("DOMContentLoaded", function () {


    // =================================================
    // 2. OBTENER CAMPOS DEL LOGIN
    // =================================================

    const formulario =
        document.getElementById("formularioLogin");


    const correo =
        document.getElementById("correoLogin");


    const contrasena =
        document.getElementById("contrasenaLogin");



    // =================================================
    // 3. REGLAS DEL CORREO
    // =================================================

    const regExCorreo =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    const dominiosPermitidos = [
        "gmail.com",
        "duoc.cl",
        "profesor.duoc.cl"
    ];



    // =================================================
    // 4. VALIDACIÓN EN TIEMPO REAL
    // =================================================

    correo.addEventListener(
        "input",
        validarCorreo
    );


    contrasena.addEventListener(
        "input",
        validarContrasena
    );



    // =================================================
    // 5. VALIDAR CORREO
    // =================================================

    function validarCorreo() {


        const valor =
            correo.value.trim().toLowerCase();


        if (valor === "") {


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
            "Correo válido"
        );


        return true;


    }



    // =================================================
    // 6. VALIDAR CONTRASEÑA
    //
    // Reglas ALBEDO:
    // - Exactamente 10 caracteres.
    // - Al menos una letra.
    // - Al menos un número.
    // - Al menos un símbolo permitido.
    // - Sin espacios.
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
            "Contraseña válida"
        );


        return true;


    }



    // =================================================
    // 7. OBTENER USUARIOS REGISTRADOS
    //
    // Lee usuariosAlbedo desde localStorage.
    // =================================================

    function obtenerUsuarios() {


        try {


            return JSON.parse(
                localStorage.getItem("usuariosAlbedo")
            ) || [];


        } catch (error) {


            return [];


        }


    }



    // =================================================
    // 8. MOSTRAR ERROR
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



    // =================================================
    // 9. MOSTRAR CORRECTO
    // =================================================

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
    // 10. INICIAR SESIÓN
    // =================================================

    formulario.addEventListener(
        "submit",
        function (evento) {


            evento.preventDefault();


            const correoValido =
                validarCorreo();


            const contrasenaValida =
                validarContrasena();


            const resultado =
                document.getElementById(
                    "mensajeResultadoLogin"
                );



            // Si el formato no es correcto,
            // no buscamos al usuario.
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
            // 11. BUSCAR USUARIO REGISTRADO
            // =================================================

            const usuarios =
                obtenerUsuarios();


            const correoIngresado =
                correo.value.trim().toLowerCase();


            const contrasenaIngresada =
                contrasena.value;



            const usuarioEncontrado =
                usuarios.find(function (usuario) {


                    return (
                        usuario.correo === correoIngresado &&
                        usuario.contrasena === contrasenaIngresada
                    );


                });



            // =================================================
            // 12. CREDENCIALES INCORRECTAS
            // =================================================

            if (!usuarioEncontrado) {


                resultado.className =
                    "alert alert-danger mt-4";


                resultado.textContent =
                    "Correo o contraseña incorrectos.";


                return;


            }



            // =================================================
            // 13. CREAR SESIÓN
            //
            // Guardamos solamente los datos necesarios.
            // No copiamos la contraseña a la sesión.
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
            // 14. LOGIN EXITOSO
            // =================================================

            resultado.className =
                "alert alert-success mt-4";


            resultado.textContent =
                "Inicio de sesión exitoso. Bienvenido " +
                usuarioEncontrado.nombre +
                " a ALBEDO Outdoor.";


        }
    );


});