// =====================================================
// 1. REGISTRO DE USUARIO - ALBEDO OUTDOOR
// =====================================================

document.addEventListener("DOMContentLoaded", function () {


    // =================================================
    // 2. CAMPOS DEL FORMULARIO
    // =================================================

    const formulario =
        document.getElementById("formularioRegistro");

    const run =
        document.getElementById("runRegistro");

    const dv =
        document.getElementById("dvRegistro");

    const nombre =
        document.getElementById("nombreRegistro");

    const apellidos =
        document.getElementById("apellidosRegistro");

    const correo =
        document.getElementById("correoRegistro");

    const fechaNacimiento =
        document.getElementById("fechaNacimientoRegistro");

    const region =
        document.getElementById("regionRegistro");

    const comuna =
        document.getElementById("comunaRegistro");

    const calle =
        document.getElementById("calleRegistro");

    const numeroDomicilio =
        document.getElementById("numeroDomicilioRegistro");

    const tipoDomicilio =
        document.getElementById("tipoDomicilioRegistro");

    const numeroUnidad =
        document.getElementById("numeroUnidadRegistro");

    const codigoPostal =
        document.getElementById("codigoPostalRegistro");

    const contrasena =
        document.getElementById("contrasenaRegistro");

    const confirmarContrasena =
        document.getElementById("confirmarContrasenaRegistro");



    // =================================================
    // 3. FECHA MÁXIMA = HOY
    // =================================================

    const hoy = new Date();

    const fechaMaxima =
        hoy.getFullYear() +
        "-" +
        String(hoy.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(hoy.getDate()).padStart(2, "0");

    fechaNacimiento.max =
        fechaMaxima;



    // =================================================
    // 4. REGIONES Y COMUNAS
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
    // 5. CARGAR REGIONES
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
    // 6. REGIÓN → COMUNA
    // =================================================

    region.addEventListener(
        "change",
        function () {

            comuna.innerHTML =
                '<option value="">Selecciona una comuna</option>';

            comuna.disabled =
                region.value === "";

            limpiarEstado(
                comuna,
                "feedbackComunaRegistro"
            );

            if (
                region.value !== ""
            ) {

                regiones[
                    region.value
                ].forEach(
                    function (nombreComuna) {

                        const opcion =
                            document.createElement("option");

                        opcion.value =
                            nombreComuna;

                        opcion.textContent =
                            nombreComuna;

                        comuna.appendChild(opcion);

                    }
                );

            }

            validarRegion();

        }
    );



    // =================================================
    // 7. CASA / DEPARTAMENTO
    // =================================================

    tipoDomicilio.addEventListener(
        "change",
        function () {

            validarTipoDomicilio();

            if (
                tipoDomicilio.value === "Departamento"
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
                    "No corresponde";

                limpiarEstado(
                    numeroUnidad,
                    "feedbackNumeroUnidadRegistro"
                );

            }

        }
    );



    // =================================================
    // 8. REGLAS GENERALES
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



    // =================================================
    // 9. VALIDACIÓN EN TIEMPO REAL
    // =================================================

    run.addEventListener(
        "input",
        function () {

            run.value =
                run.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 8);

            validarRun();

        }
    );


    dv.addEventListener(
        "input",
        function () {

            dv.value =
                dv.value
                    .toUpperCase()
                    .replace(/[^0-9K]/g, "")
                    .slice(0, 1);

            validarRun();

        }
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
        "input",
        validarFechaNacimiento
    );


    comuna.addEventListener(
        "change",
        validarComuna
    );


    calle.addEventListener(
        "input",
        validarCalle
    );


    numeroDomicilio.addEventListener(
        "input",
        validarNumeroDomicilio
    );


    numeroUnidad.addEventListener(
        "input",
        validarNumeroUnidad
    );


    codigoPostal.addEventListener(
        "input",
        validarCodigoPostal
    );


    contrasena.addEventListener(
        "input",
        function () {

            validarContrasena();

            if (
                confirmarContrasena.value !== ""
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
    // 10. VALIDAR RUT
    // =================================================

    function validarRun() {

        const cuerpo =
            run.value.trim();

        const digitoIngresado =
            dv.value.trim().toUpperCase();

        dv.value =
            digitoIngresado;


        if (
            cuerpo === ""
        ) {

            mostrarErrorRun(
                "Debe ingresar el RUT"
            );

            return false;

        }


        if (
            /^[0-9]{6,8}$/.test(cuerpo) === false
        ) {

            mostrarErrorRun(
                "El RUT debe contener entre 6 y 8 números"
            );

            return false;

        }


        if (
            digitoIngresado === ""
        ) {

            mostrarErrorRun(
                "Debe ingresar el dígito verificador"
            );

            return false;

        }


        if (
            /^[0-9K]$/.test(digitoIngresado) === false
        ) {

            mostrarErrorRun(
                "El dígito verificador debe ser un número de 0 a 9 o K"
            );

            return false;

        }


        if (
            comprobarRun(
                cuerpo,
                digitoIngresado
            ) === false
        ) {

            mostrarErrorRun(
                "El RUT ingresado no es válido"
            );

            return false;

        }


        mostrarCorrectoRun(
            "RUT válido"
        );


        return true;

    }



    // =================================================
    // 11. COMPROBAR DÍGITO VERIFICADOR
    // =================================================

    function comprobarRun(
        cuerpo,
        digitoIngresado
    ) {

        let suma = 0;

        let multiplicador = 2;


        for (
            let i = cuerpo.length - 1;
            i >= 0;
            i--
        ) {

            suma +=
                Number(
                    cuerpo[i]
                ) * multiplicador;

            multiplicador++;

            if (
                multiplicador > 7
            ) {

                multiplicador = 2;

            }

        }


        const resultado =
            11 - (suma % 11);


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
                resultado.toString();

        }


        return (
            digitoCalculado ===
            digitoIngresado
        );

    }



    // =================================================
    // 12. NOMBRE
    // =================================================

    function validarNombre() {

        const valor =
            nombre.value.trim();


        if (
            valor === "" ||
            valor.length > 50 ||
            regExNombre.test(valor) === false
        ) {

            mostrarError(
                nombre,
                "feedbackNombreRegistro",
                "Ingrese un nombre válido"
            );

            return false;

        }


        mostrarCorrecto(
            nombre,
            "feedbackNombreRegistro",
            "Nombre válido"
        );


        return true;

    }



    // =================================================
    // 13. APELLIDOS
    // =================================================

    function validarApellidos() {

        const valor =
            apellidos.value.trim();


        if (
            valor === "" ||
            valor.length > 100 ||
            regExNombre.test(valor) === false
        ) {

            mostrarError(
                apellidos,
                "feedbackApellidosRegistro",
                "Ingrese apellidos válidos"
            );

            return false;

        }


        mostrarCorrecto(
            apellidos,
            "feedbackApellidosRegistro",
            "Apellidos válidos"
        );


        return true;

    }



    // =================================================
    // 14. CORREO
    // =================================================

    function validarCorreo() {

        const valor =
            correo.value.trim().toLowerCase();


        if (
            valor === "" ||
            valor.length > 100 ||
            regExCorreo.test(valor) === false
        ) {

            mostrarError(
                correo,
                "feedbackCorreoRegistro",
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
                "feedbackCorreoRegistro",
                "Solo se acepta @gmail.com, @duoc.cl o @profesor.duoc.cl"
            );

            return false;

        }


        mostrarCorrecto(
            correo,
            "feedbackCorreoRegistro",
            "Correo válido"
        );


        return true;

    }



    // =================================================
    // 15. FECHA DE NACIMIENTO
    // =================================================

    function validarFechaNacimiento() {

        const valor =
            fechaNacimiento.value;


        if (
            valor === ""
        ) {

            limpiarEstado(
                fechaNacimiento,
                "feedbackFechaNacimientoRegistro"
            );

            return true;

        }


        const fecha =
            new Date(
                valor + "T00:00:00"
            );


        if (
            Number.isNaN(
                fecha.getTime()
            ) ||
            fecha.getFullYear() < 1900
        ) {

            mostrarError(
                fechaNacimiento,
                "feedbackFechaNacimientoRegistro",
                "La fecha de nacimiento no es válida"
            );

            return false;

        }


        if (
            fecha > hoy
        ) {

            mostrarError(
                fechaNacimiento,
                "feedbackFechaNacimientoRegistro",
                "La fecha de nacimiento no puede ser futura"
            );

            return false;

        }


        mostrarCorrecto(
            fechaNacimiento,
            "feedbackFechaNacimientoRegistro",
            "Fecha válida"
        );


        return true;

    }



    // =================================================
    // 16. REGIÓN
    // =================================================

    function validarRegion() {

        if (
            region.value === ""
        ) {

            mostrarError(
                region,
                "feedbackRegionRegistro",
                "Debe seleccionar una región"
            );

            return false;

        }


        mostrarCorrecto(
            region,
            "feedbackRegionRegistro",
            "Región seleccionada"
        );


        return true;

    }



    // =================================================
    // 17. COMUNA
    // =================================================

    function validarComuna() {

        if (
            comuna.disabled ||
            comuna.value === ""
        ) {

            mostrarError(
                comuna,
                "feedbackComunaRegistro",
                "Debe seleccionar una comuna"
            );

            return false;

        }


        mostrarCorrecto(
            comuna,
            "feedbackComunaRegistro",
            "Comuna seleccionada"
        );


        return true;

    }



    // =================================================
    // 18. CALLE
    // =================================================

    function validarCalle() {

        const valor =
            calle.value.trim();


        if (
            valor.length < 3 ||
            valor.length > 150
        ) {

            mostrarError(
                calle,
                "feedbackCalleRegistro",
                "Ingrese una calle o avenida válida"
            );

            return false;

        }


        mostrarCorrecto(
            calle,
            "feedbackCalleRegistro",
            "Calle ingresada"
        );


        return true;

    }



    // =================================================
    // 19. NÚMERO DOMICILIO
    // =================================================

    function validarNumeroDomicilio() {

        const valor =
            numeroDomicilio.value.trim();


        if (
            /^[0-9]{1,7}$/.test(valor) === false
        ) {

            mostrarError(
                numeroDomicilio,
                "feedbackNumeroDomicilioRegistro",
                "Ingrese solamente números"
            );

            return false;

        }


        mostrarCorrecto(
            numeroDomicilio,
            "feedbackNumeroDomicilioRegistro",
            "Número de domicilio válido"
        );


        return true;

    }



    // =================================================
    // 20. TIPO DOMICILIO
    // =================================================

    function validarTipoDomicilio() {

        if (
            tipoDomicilio.value === ""
        ) {

            mostrarError(
                tipoDomicilio,
                "feedbackTipoDomicilioRegistro",
                "Debe seleccionar Casa o Departamento"
            );

            return false;

        }


        mostrarCorrecto(
            tipoDomicilio,
            "feedbackTipoDomicilioRegistro",
            "Tipo de domicilio seleccionado"
        );


        return true;

    }



    // =================================================
    // 21. NÚMERO DE DEPARTAMENTO
    // =================================================

    function validarNumeroUnidad() {

        if (
            tipoDomicilio.value === "Casa"
        ) {

            limpiarEstado(
                numeroUnidad,
                "feedbackNumeroUnidadRegistro"
            );

            return true;

        }


        if (
            tipoDomicilio.value !== "Departamento"
        ) {

            return false;

        }


        const valor =
            numeroUnidad.value.trim();


        if (
            /^[0-9]{1,6}$/.test(valor) === false
        ) {

            mostrarError(
                numeroUnidad,
                "feedbackNumeroUnidadRegistro",
                "Ingrese el número del departamento"
            );

            return false;

        }


        mostrarCorrecto(
            numeroUnidad,
            "feedbackNumeroUnidadRegistro",
            "Número de departamento válido"
        );


        return true;

    }



    // =================================================
    // 22. CÓDIGO POSTAL
    // =================================================

    function validarCodigoPostal() {

        const valor =
            codigoPostal.value.trim();


        if (
            /^[0-9]{7}$/.test(valor) === false
        ) {

            mostrarError(
                codigoPostal,
                "feedbackCodigoPostalRegistro",
                "El código postal debe contener exactamente 7 números"
            );

            return false;

        }


        mostrarCorrecto(
            codigoPostal,
            "feedbackCodigoPostalRegistro",
            "Formato de código postal válido"
        );


        return true;

    }



    // =================================================
    // 23. CONTRASEÑA
    // =================================================

    function validarContrasena() {

        const valor =
            contrasena.value;


        if (
            valor.length !== 10
        ) {

            mostrarError(
                contrasena,
                "feedbackContrasenaRegistro",
                "Debe tener exactamente 10 caracteres"
            );

            return false;

        }


        if (
            /\s/.test(valor)
        ) {

            mostrarError(
                contrasena,
                "feedbackContrasenaRegistro",
                "No puede contener espacios"
            );

            return false;

        }


        if (
            /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/u.test(valor) === false
        ) {

            mostrarError(
                contrasena,
                "feedbackContrasenaRegistro",
                "Debe contener al menos una letra"
            );

            return false;

        }


        if (
            /[0-9]/.test(valor) === false
        ) {

            mostrarError(
                contrasena,
                "feedbackContrasenaRegistro",
                "Debe contener al menos un número"
            );

            return false;

        }


        if (
            /[%&$#\/()="!]/.test(valor) === false
        ) {

            mostrarError(
                contrasena,
                "feedbackContrasenaRegistro",
                'Debe contener un símbolo: % & $ # / ( ) = " !'
            );

            return false;

        }


        if (
            /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9%&$#\/()="!]+$/u
                .test(valor) === false
        ) {

            mostrarError(
                contrasena,
                "feedbackContrasenaRegistro",
                "Contiene caracteres no permitidos"
            );

            return false;

        }


        mostrarCorrecto(
            contrasena,
            "feedbackContrasenaRegistro",
            "Contraseña válida"
        );


        return true;

    }



    // =================================================
    // 24. CONFIRMAR CONTRASEÑA
    // =================================================

    function validarConfirmarContrasena() {

        if (
            validarContrasena() === false
        ) {

            mostrarError(
                confirmarContrasena,
                "feedbackConfirmarContrasenaRegistro",
                "Primero ingrese una contraseña válida"
            );

            return false;

        }


        if (
            confirmarContrasena.value !==
            contrasena.value
        ) {

            mostrarError(
                confirmarContrasena,
                "feedbackConfirmarContrasenaRegistro",
                "Las contraseñas no coinciden"
            );

            return false;

        }


        mostrarCorrecto(
            confirmarContrasena,
            "feedbackConfirmarContrasenaRegistro",
            "Las contraseñas coinciden"
        );


        return true;

    }



    // =================================================
    // 25. MENSAJES RUT
    // =================================================

    function mostrarErrorRun(
        texto
    ) {

        const feedback =
            document.getElementById(
                "feedbackRunRegistro"
            );


        run.classList.remove(
            "is-valid"
        );

        run.classList.add(
            "is-invalid"
        );


        dv.classList.remove(
            "is-valid"
        );

        dv.classList.add(
            "is-invalid"
        );


        feedback.className =
            "small text-danger mt-1";


        feedback.textContent =
            texto;

    }



    function mostrarCorrectoRun(
        texto
    ) {

        const feedback =
            document.getElementById(
                "feedbackRunRegistro"
            );


        run.classList.remove(
            "is-invalid"
        );

        run.classList.add(
            "is-valid"
        );


        dv.classList.remove(
            "is-invalid"
        );

        dv.classList.add(
            "is-valid"
        );


        feedback.className =
            "small text-success mt-1";


        feedback.textContent =
            texto;

    }



    // =================================================
    // 26. MENSAJES GENERALES
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



    function mostrarCorrecto(
        campo,
        idFeedback,
        texto
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
            "small text-success mt-1";


        feedback.textContent =
            texto;

    }



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
    // 27. OBTENER USUARIOS
    // =================================================

    function obtenerUsuarios() {

        try {

            const usuarios =
                JSON.parse(
                    localStorage.getItem(
                        "usuariosAlbedo"
                    )
                );


            return Array.isArray(
                usuarios
            )
                ? usuarios
                : [];

        } catch (error) {

            return [];

        }

    }



    // =================================================
    // 28. GUARDAR USUARIOS
    // =================================================

    function guardarUsuarios(
        usuarios
    ) {

        localStorage.setItem(
            "usuariosAlbedo",
            JSON.stringify(
                usuarios
            )
        );

    }



    // =================================================
    // 29. CREAR CUENTA
    // =================================================

    formulario.addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();


            const todoValido = [

                validarRun(),

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
                        resultado === true
                    );

                }
            );



            const resultado =
                document.getElementById(
                    "mensajeResultadoRegistro"
                );



            if (
                todoValido === false
            ) {

                resultado.className =
                    "alert alert-danger mt-4";


                resultado.textContent =
                    "No se pudo crear la cuenta. Revisa los campos marcados en rojo.";


                return;

            }



            // =================================================
            // 30. REVISAR DUPLICADOS
            // =================================================

            const usuarios =
                obtenerUsuarios();


            const runIngresado =
                run.value.trim() +
                dv.value.trim().toUpperCase();


            const correoIngresado =
                correo.value
                    .trim()
                    .toLowerCase();



            const runExistente =
                usuarios.some(
                    function (usuario) {

                        return (
                            usuario.run ===
                            runIngresado
                        );

                    }
                );


            if (
                runExistente
            ) {

                mostrarErrorRun(
                    "Este RUT ya se encuentra registrado"
                );


                resultado.className =
                    "alert alert-danger mt-4";


                resultado.textContent =
                    "No se pudo crear la cuenta porque el RUT ya está registrado.";


                return;

            }



            const correoExistente =
                usuarios.some(
                    function (usuario) {

                        return (
                            usuario.correo ===
                            correoIngresado
                        );

                    }
                );


            if (
                correoExistente
            ) {

                mostrarError(
                    correo,
                    "feedbackCorreoRegistro",
                    "Este correo ya se encuentra registrado"
                );


                resultado.className =
                    "alert alert-danger mt-4";


                resultado.textContent =
                    "No se pudo crear la cuenta porque el correo ya está registrado.";


                return;

            }



            // =================================================
            // 31. NUEVO USUARIO
            // =================================================

            const nuevoUsuario = {

                run:
                    runIngresado,

                rutNumero:
                    run.value.trim(),

                digitoVerificador:
                    dv.value
                        .trim()
                        .toUpperCase(),

                nombre:
                    nombre.value.trim(),

                apellidos:
                    apellidos.value.trim(),

                correo:
                    correoIngresado,

                fechaNacimiento:
                    fechaNacimiento.value,

                region:
                    region.value,

                comuna:
                    comuna.value,

                calle:
                    calle.value.trim(),

                numeroDomicilio:
                    numeroDomicilio.value.trim(),

                tipoDomicilio:
                    tipoDomicilio.value,

                numeroUnidad:
                    numeroUnidad.value.trim(),

                codigoPostal:
                    codigoPostal.value.trim(),

                contrasena:
                    contrasena.value,

                tipoUsuario:
                    "Cliente"

            };



            // =================================================
            // 32. GUARDAR USUARIO
            // =================================================

            usuarios.push(
                nuevoUsuario
            );


            guardarUsuarios(
                usuarios
            );



            // =================================================
            // 33. REGISTRO EXITOSO
            // =================================================

            resultado.className =
                "alert alert-success mt-4";


            resultado.textContent =
                "Cuenta creada correctamente. Serás redirigido al inicio de sesión.";



            const feedbackDireccion =
                document.getElementById(
                    "feedbackDireccionGoogle"
                );


            if (
                feedbackDireccion
            ) {

                feedbackDireccion.textContent =
                    "";

            }



            // =================================================
            // 34. REDIRECCIÓN A LOGIN
            // =================================================

            setTimeout(
                function () {

                    window.location.href =
                        "login.html";

                },
                1500
            );

        }
    );


});