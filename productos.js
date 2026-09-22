// =====================================================
// ALBEDO OUTDOOR
// PRODUCTOS DE LA TIENDA
// =====================================================


// =====================================================
// 1. COLORES DISPONIBLES PARA CHAQUETAS
// =====================================================

const coloresChaquetas = [

    {
        nombre: "Amarillo",
        color: "#e3a91c",
        imagen: "img/chaqueta-cordillera.png"
    },

    {
        nombre: "Negro",
        color: "#17191b",
        imagen: "img/chaqueta-andes.png"
    },

    {
        nombre: "Verde oliva",
        color: "#596247",
        imagen: "img/chaqueta-patagonia.png"
    },

    {
        nombre: "Azul petróleo",
        color: "#234d72",
        imagen: "img/chaqueta-aconcagua.png"
    },

    {
        nombre: "Beige",
        color: "#d7cfbd",
        imagen: "img/chaqueta-atacama.png"
    }

];



// =====================================================
// 2. COLORES DISPONIBLES PARA POLAR
// =====================================================

const coloresPolar = [

    {
        nombre: "Azul",
        color: "#1556a8",
        imagen: "img/polar-sendero.png"
    },

    {
        nombre: "Negro",
        color: "#17191b",
        imagen: "img/polar-andes.png"
    },

    {
        nombre: "Verde oliva",
        color: "#556047",
        imagen: "img/polar-patagonia.png"
    },

    {
        nombre: "Beige",
        color: "#d8d0c1",
        imagen: "img/polar-atacama.png"
    },

    {
        nombre: "Mostaza",
        color: "#d89a13",
        imagen: "img/polar-volcan.png"
    }

];



// =====================================================
// 3. COLORES DISPONIBLES PARA PANTALONES
// =====================================================

const coloresPantalones = [

    {
        nombre: "Gris",
        color: "#55595d",
        imagen: "img/pantalon-cumbre.png"
    },

    {
        nombre: "Negro",
        color: "#17191b",
        imagen: "img/pantalon-andes.png"
    },

    {
        nombre: "Verde oliva",
        color: "#596247",
        imagen: "img/pantalon-patagonia.png"
    },

    {
        nombre: "Azul marino",
        color: "#1f3858",
        imagen: "img/pantalon-fiordo.png"
    },

    {
        nombre: "Beige",
        color: "#d2c4aa",
        imagen: "img/pantalon-atacama.png"
    }

];



// =====================================================
// 4. PRODUCTOS BASE
// =====================================================

const productosBase = [

    // =================================================
    // CHAQUETAS
    // =================================================

    {
        id: "chaqueta-cordillera",
        categoria: "Chaquetas",
        nombre: "Chaqueta Cordillera",
        descripcion:
            "Impermeable y respirable. Lista para cualquier aventura.",
        precio: 59990,
        imagen: "img/chaqueta-cordillera.png",
        colores: coloresChaquetas
    },

    {
        id: "chaqueta-andes",
        categoria: "Chaquetas",
        nombre: "Chaqueta Andes",
        descripcion:
            "Protección y estilo en tus salidas de montaña.",
        precio: 64990,
        imagen: "img/chaqueta-andes.png",
        colores: coloresChaquetas
    },

    {
        id: "chaqueta-patagonia",
        categoria: "Chaquetas",
        nombre: "Chaqueta Patagonia",
        descripcion:
            "Ligera, impermeable y versátil para todo el año.",
        precio: 62990,
        imagen: "img/chaqueta-patagonia.png",
        colores: coloresChaquetas
    },

    {
        id: "chaqueta-aconcagua",
        categoria: "Chaquetas",
        nombre: "Chaqueta Aconcagua",
        descripcion:
            "Diseñada para condiciones más exigentes.",
        precio: 69990,
        imagen: "img/chaqueta-aconcagua.png",
        colores: coloresChaquetas
    },

    {
        id: "chaqueta-atacama",
        categoria: "Chaquetas",
        nombre: "Chaqueta Atacama",
        descripcion:
            "Minimalista y resistente. Ideal para trekking.",
        precio: 61990,
        imagen: "img/chaqueta-atacama.png",
        colores: coloresChaquetas
    },


    // =================================================
    // POLERONES Y POLAR
    // =================================================

    {
        id: "polar-sendero",
        categoria: "Polerones y polar",
        nombre: "Polar Sendero",
        descripcion:
            "Abrigo ligero y cómodo para acompañarte en cada salida.",
        precio: 29990,
        imagen: "img/polar-sendero.png",
        colores: coloresPolar
    },

    {
        id: "polar-andes",
        categoria: "Polerones y polar",
        nombre: "Polar Andes",
        descripcion:
            "Diseño sobrio y térmico para jornadas de montaña.",
        precio: 34990,
        imagen: "img/polar-andes.png",
        colores: coloresPolar
    },

    {
        id: "polar-patagonia",
        categoria: "Polerones y polar",
        nombre: "Polar Patagonia",
        descripcion:
            "Calidez y comodidad para rutas y climas fríos.",
        precio: 32990,
        imagen: "img/polar-patagonia.png",
        colores: coloresPolar
    },

    {
        id: "polar-atacama",
        categoria: "Polerones y polar",
        nombre: "Polar Atacama",
        descripcion:
            "Estilo limpio y versátil para aventura y uso diario.",
        precio: 31990,
        imagen: "img/polar-atacama.png",
        colores: coloresPolar
    },

    {
        id: "polar-volcan",
        categoria: "Polerones y polar",
        nombre: "Polar Volcán",
        descripcion:
            "Un diseño cálido y distintivo inspirado en la cordillera.",
        precio: 33990,
        imagen: "img/polar-volcan.png",
        colores: coloresPolar
    },


    // =================================================
    // PANTALONES
    // =================================================

    {
        id: "pantalon-cumbre",
        categoria: "Pantalones",
        nombre: "Pantalón Cumbre",
        descripcion:
            "Comodidad y movilidad para rutas, senderos y uso outdoor.",
        precio: 39990,
        imagen: "img/pantalon-cumbre.png",
        colores: coloresPantalones
    },

    {
        id: "pantalon-andes",
        categoria: "Pantalones",
        nombre: "Pantalón Andes",
        descripcion:
            "Resistencia y versatilidad para terrenos exigentes.",
        precio: 44990,
        imagen: "img/pantalon-andes.png",
        colores: coloresPantalones
    },

    {
        id: "pantalon-patagonia",
        categoria: "Pantalones",
        nombre: "Pantalón Patagonia",
        descripcion:
            "Diseño técnico y cómodo para largas jornadas outdoor.",
        precio: 42990,
        imagen: "img/pantalon-patagonia.png",
        colores: coloresPantalones
    },

    {
        id: "pantalon-fiordo",
        categoria: "Pantalones",
        nombre: "Pantalón Fiordo",
        descripcion:
            "Protección y libertad de movimiento para cada aventura.",
        precio: 46990,
        imagen: "img/pantalon-fiordo.png",
        colores: coloresPantalones
    },

    {
        id: "pantalon-atacama",
        categoria: "Pantalones",
        nombre: "Pantalón Atacama",
        descripcion:
            "Ligero y versátil para trekking y climas templados.",
        precio: 41990,
        imagen: "img/pantalon-atacama.png",
        colores: coloresPantalones
    }

];



// =====================================================
// 5. OBTENER PRODUCTOS ADMINISTRADOS
// =====================================================

function obtenerProductosAdministrados() {

    try {

        const productosGuardados =
            JSON.parse(
                localStorage.getItem(
                    "productosAdminAlbedo"
                )
            );


        if (
            Array.isArray(productosGuardados) &&
            productosGuardados.length > 0
        ) {

            return productosGuardados;

        }

    } catch (error) {

        return null;

    }


    return null;

}



// =====================================================
// 6. PREPARAR PRODUCTOS PARA LA TIENDA
// =====================================================

function prepararProductosTienda() {

    const productosAdministrados =
        obtenerProductosAdministrados();


    // Si todavía no se ha utilizado el administrador,
    // se muestran los productos originales.

    if (!productosAdministrados) {

        return productosBase;

    }



    return productosAdministrados.map(
        function (productoAdmin) {


            // Buscar el producto original para conservar
            // sus colores y su imagen si corresponde.

            const productoOriginal =
                productosBase.find(
                    function (producto) {

                        return (
                            producto.id ===
                            productoAdmin.id
                        );

                    }
                );



            let imagenProducto =
                productoAdmin.imagen;


            // La imagen es opcional en administración.
            // Si está vacía y existe un producto original,
            // conservamos su imagen.

            if (
                !imagenProducto &&
                productoOriginal
            ) {

                imagenProducto =
                    productoOriginal.imagen;

            }



            // Si es un producto completamente nuevo y
            // no tiene imagen, utilizamos el logo de ALBEDO
            // como imagen provisional.

            if (!imagenProducto) {

                imagenProducto =
                    "img/logo-albedo.png";

            }



            return {

                id:
                    productoAdmin.id,

                codigo:
                    productoAdmin.codigo,

                categoria:
                    productoAdmin.categoria,

                nombre:
                    productoAdmin.nombre,

                descripcion:
                    productoAdmin.descripcion || "",

                precio:
                    Number(
                        productoAdmin.precio
                    ),

                stock:
                    Number(
                        productoAdmin.stock
                    ),

                stockCritico:
                    productoAdmin.stockCritico,

                imagen:
                    imagenProducto,

                colores:
                    productoOriginal
                        ? productoOriginal.colores
                        : []

            };

        }
    );

}



// =====================================================
// 7. PRODUCTOS QUE UTILIZA LA TIENDA
// =====================================================

const productos =
    prepararProductosTienda();