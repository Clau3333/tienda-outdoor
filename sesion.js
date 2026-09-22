// =====================================================
// 1. SESIÓN DE USUARIO - ALBEDO OUTDOOR
// =====================================================

document.addEventListener("DOMContentLoaded", function () {


    // =================================================
    // 2. BUSCAR MENÚ PRINCIPAL
    // =================================================

    const menu =
        document.querySelector(".enlaces-principales");


    if (!menu) {

        return;

    }



    // =================================================
    // 3. OBTENER SESIÓN GUARDADA
    // =================================================

    let usuarioSesion = null;


    try {

        usuarioSesion =
            JSON.parse(
                localStorage.getItem(
                    "usuarioSesionAlbedo"
                )
            );

    } catch (error) {

        usuarioSesion = null;

    }



    // =================================================
    // 4. ENLACES DE VISITANTE
    // =================================================

    const enlaceLogin =
        menu.querySelector(
            'a[href="login.html"]'
        );


    const enlaceRegistro =
        menu.querySelector(
            'a[href="registro.html"]'
        );



    // =================================================
    // 5. SI NO HAY SESIÓN
    // =================================================

    if (!usuarioSesion) {

        return;

    }



    // =================================================
    // 6. OCULTAR LOGIN Y REGISTRO
    // =================================================

    if (enlaceLogin) {

        enlaceLogin.remove();

    }


    if (enlaceRegistro) {

        enlaceRegistro.remove();

    }



    // =================================================
    // 7. FORMATEAR NOMBRE
    // =================================================

    function formatearNombre(nombre) {

        return nombre
            .trim()
            .toLowerCase()
            .split(" ")
            .filter(function (palabra) {

                return palabra !== "";

            })
            .map(function (palabra) {

                return (
                    palabra.charAt(0).toUpperCase() +
                    palabra.slice(1)
                );

            })
            .join(" ");

    }



    // =================================================
    // 8. MOSTRAR NOMBRE DEL USUARIO
    // =================================================

    const saludo =
        document.createElement("span");


    saludo.className =
        "usuario-sesion";


    saludo.textContent =
        "Hola, " +
        formatearNombre(
            usuarioSesion.nombre
        );



    // =================================================
    // 9. CREAR CERRAR SESIÓN
    // =================================================

    const cerrarSesion =
        document.createElement("a");


    cerrarSesion.href =
        "#";


    cerrarSesion.id =
        "cerrarSesion";


    cerrarSesion.textContent =
        "Cerrar sesión";



    // =================================================
    // 10. AGREGAR AL MENÚ
    // =================================================

    menu.appendChild(
        saludo
    );


    menu.appendChild(
        cerrarSesion
    );



    // =================================================
    // 11. CERRAR SESIÓN
    // =================================================

    cerrarSesion.addEventListener(
        "click",
        function (evento) {

            evento.preventDefault();


            localStorage.removeItem(
                "usuarioSesionAlbedo"
            );


            window.location.href =
                "index.html";

        }
    );


});