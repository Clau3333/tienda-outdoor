
import { Link } from 'react-router-dom'
import { legacyBase } from '../components/navigation'
import './Inicio.css'

const destacados = [
  {
    nombre: 'Chaqueta Cordillera',
    categoria: 'CHAQUETAS',
    descripcion: 'Protección impermeable para condiciones cambiantes.',
    precio: '$59.990',
    imagen: 'chaqueta-cordillera.png',
    enlace: '/productos.html#chaquetas',
  },
  {
    nombre: 'Polar Sendero',
    categoria: 'POLERONES Y POLAR',
    descripcion: 'Abrigo ligero y cómodo para cada salida.',
    precio: '$29.990',
    imagen: 'polar-sendero.png',
    enlace: '/productos.html#polar',
  },
  {
    nombre: 'Pantalón Cumbre',
    categoria: 'PANTALONES',
    descripcion: 'Comodidad y libertad de movimiento en cualquier terreno.',
    precio: '$39.990',
    imagen: 'pantalon-cumbre.png',
    enlace: '/productos.html#pantalones',
  },
]

function Inicio() {
  return (
    <main className="inicio-react">
      <section className="portada" aria-labelledby="bienvenida">
        <img
          className="portada-imagen"
          src={`${legacyBase}img/portada-albedo.png`}
          alt="Excursionista frente a una cordillera nevada"
        />

        <div className="portada-contenido">
          <p className="etiqueta portada-etiqueta">
            ALBEDO OUTDOOR
          </p>

          <h1 id="bienvenida">
            Comienza hoy
            <br />
            tu aventura
          </h1>

          <p className="descripcion">
            Tenidas para acompañarte desde el primer sendero
            hasta tu próxima incursión.
          </p>

          <Link className="boton-albedo" to="/productos.html">
            Explorar productos
          </Link>
        </div>
      </section>

      <section
        className="productos-inicio"
        aria-labelledby="productos-destacados"
      >
        <div className="productos-introduccion">
          <p className="etiqueta">PREPARA TU PRÓXIMA SALIDA</p>

          <h2 id="productos-destacados">
            Productos destacados
          </h2>

          <p>
            Encuentra la equipación para tu próxima aventura.
          </p>
        </div>

        <div className="productos-grid">
          {destacados.map((producto) => (
            <Link
              key={producto.nombre}
              className="producto-destacado"
              to={producto.enlace}
            >
              <div className="producto-destacado-imagen">
                <img
                  src={`${legacyBase}img/${producto.imagen}`}
                  alt={producto.nombre}
                />
              </div>

              <div className="producto-destacado-info">
                <p className="producto-tipo">
                  {producto.categoria}
                </p>

                <h3>{producto.nombre}</h3>

                <p>{producto.descripcion}</p>

                <p className="catalogo-precio">
                  {producto.precio}
                </p>

                <span>Ver colección →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section
        className="container py-5"
        aria-labelledby="experiencia-albedo"
      >
        <div className="row align-items-center g-5">
          <div className="col-12 col-lg-5">
            <p className="etiqueta">VIVE EL OUTDOOR</p>

            <h2 id="experiencia-albedo" className="mb-3">
              La aventura comienza afuera
            </h2>

            <p className="inicio-texto-secundario mb-4">
              Explora nuevos senderos, descubre paisajes
              y prepárate para disfrutar cada recorrido
              con ALBEDO Outdoor.
            </p>

            <Link
              className="boton-albedo"
              to="/productos.html"
            >
              Preparar mi aventura
            </Link>
          </div>

          <div className="col-12 col-lg-7">
            <video
              className="w-100"
              controls
              preload="metadata"
              aria-label="Video de aventura y trekking de ALBEDO Outdoor"
            >
              <source
                src={`${legacyBase}video/aventura-albedo.mp4`}
                type="video/mp4"
              />
              Tu navegador no soporta la reproducción de video.
            </video>
          </div>
        </div>
      </section>

      <section className="inicio-contacto">
        <div className="inicio-contacto-contenido">
          <p className="etiqueta">¿NECESITAS AYUDA?</p>

          <h2>Estamos para ayudarte</h2>

          <p>
            Consulta por productos, tallas o pedidos desde
            nuestro formulario de contacto.
          </p>

          <a
            className="boton-albedo"
            href={`${legacyBase}contacto.html`}
          >
            Contáctanos
          </a>
        </div>
      </section>
    </main>
  )
}

export default Inicio
