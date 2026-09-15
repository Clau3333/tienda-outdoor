// FORMULARIO DE CONTACTO ALBEDO

function validarFormulario() {

    // Obtener los datos ingresados por el usuario

    let nombre = document.getElementById("nombre").value;
    let correo = document.getElementById("correo").value;
    let telefono = document.getElementById("telefono").value;
    let motivo = document.getElementById("motivo").value;
    let mensaje = document.getElementById("mensaje").value;
    let terminos = document.getElementById("terminos").checked;


    // Expresión regular para validar correo

    const regExCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    // Validar nombre

    if (nombre == "") {

        alert("Debe ingresar su nombre");

        return false;
    }


    // Validar correo vacío

    if (correo == "") {

        alert("Debe ingresar su correo electrónico");

        return false;
    }


    // Validar formato del correo

    if (regExCorreo.test(correo) == false) {

        alert("Debe ingresar un correo electrónico válido");

        return false;
    }


    // Validar teléfono

    if (telefono == "") {

        alert("Debe ingresar su teléfono");

        return false;
    }


    // Validar motivo

    if (motivo == "") {

        alert("Debe seleccionar un motivo de contacto");

        return false;
    }


    // Validar mensaje

    if (mensaje == "") {

        alert("Debe ingresar un mensaje");

        return false;
    }


    // Validar checkbox

    if (terminos == false) {

        alert("Debe confirmar que los datos son correctos");

        return false;
    }


    // Si todo está correcto

    alert("Consulta enviada correctamente");

    return true;
}