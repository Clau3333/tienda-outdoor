import { Link } from 'react-router-dom'
import { useSession } from '../services/sessionStore'
export default function Panel() {
  const { user } = useSession()
  return <main className="container py-5"><h1>Panel {user?.tipoUsuario === 'Administrador' ? 'administrador' : 'vendedor'}</h1><p>Hola, {user?.nombre}. Gestión local de demostración.</p>
    <nav className="commerce-actions" aria-label="Gestión de la tienda"><Link className="btn btn-outline-secondary" to={user?.tipoUsuario === 'Administrador' ? '/admin-productos.html' : '/vendedor-productos.html'}>Productos</Link><Link className="btn btn-outline-secondary" to={user?.tipoUsuario === 'Administrador' ? '/admin-ordenes.html' : '/vendedor-ordenes.html'}>Órdenes</Link>{user?.tipoUsuario === 'Administrador' && <Link className="btn btn-outline-secondary" to="/admin-usuarios.html">Usuarios</Link>}</nav>
    <p className="commerce-notice">Los permisos del frontend sirven para demostrar roles; no sustituyen autorización en un servidor.</p>
  </main>
}
