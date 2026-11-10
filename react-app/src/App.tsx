
import { Route, Routes } from 'react-router-dom'
import Inicio from './pages/Inicio'
import Productos from './pages/Productos'
import Carrito from './pages/Carrito'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Header from './components/Header'
import Footer from './components/Footer'
import { useCartCount } from './services/cartStore'
import './App.css'
import './Commerce.css'
import ProductoDetalle from './pages/ProductoDetalle'
import Pedidos from './pages/Pedidos'
import Panel from './pages/Panel'
import GestionProductos from './pages/GestionProductos'
import GestionUsuarios from './pages/GestionUsuarios'
import Contenido from './pages/Contenido'
import Contacto from './pages/Contacto'
import RequireRole from './components/RequireRole'

function App() {
  const cartCount = useCartCount()

  return (
    <>
      <Header cartCount={cartCount} />

      <div
        id="contenido"
        tabIndex={-1}
        className="contenido-tienda container-fluid"
      >
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/index.html" element={<Inicio />} />
          <Route path="/productos.html" element={<Productos />} />
          <Route path="/carrito.html" element={<Carrito />} />
          <Route path="/login.html" element={<Login />} />
          <Route path="/registro.html" element={<Registro />} />
          <Route path="/producto-detalle.html" element={<ProductoDetalle />} />
          <Route path="/nosotros.html" element={<Contenido />} />
          <Route path="/blog.html" element={<Contenido />} />
          <Route path="/blog-detalle-1.html" element={<Contenido />} />
          <Route path="/blog-detalle-2.html" element={<Contenido />} />
          <Route path="/contacto.html" element={<Contacto />} />
          <Route path="/mis-pedidos.html" element={<RequireRole roles={['Cliente', 'Administrador', 'Vendedor']}><Pedidos /></RequireRole>} />
          <Route path="/pedido-detalle.html" element={<RequireRole roles={['Cliente', 'Administrador', 'Vendedor']}><Pedidos /></RequireRole>} />
          <Route path="/admin.html" element={<RequireRole roles={['Administrador']}><Panel /></RequireRole>} />
          <Route path="/admin-productos.html" element={<RequireRole roles={['Administrador']}><GestionProductos /></RequireRole>} />
          <Route path="/admin-usuarios.html" element={<RequireRole roles={['Administrador']}><GestionUsuarios /></RequireRole>} />
          <Route path="/admin-ordenes.html" element={<RequireRole roles={['Administrador']}><Pedidos /></RequireRole>} />
          <Route path="/admin-orden-detalle.html" element={<RequireRole roles={['Administrador']}><Pedidos /></RequireRole>} />
          <Route path="/vendedor.html" element={<RequireRole roles={['Vendedor', 'Administrador']}><Panel /></RequireRole>} />
          <Route path="/vendedor-productos.html" element={<RequireRole roles={['Vendedor', 'Administrador']}><GestionProductos /></RequireRole>} />
          <Route path="/vendedor-producto-detalle.html" element={<RequireRole roles={['Vendedor', 'Administrador']}><ProductoDetalle /></RequireRole>} />
          <Route path="/vendedor-ordenes.html" element={<RequireRole roles={['Vendedor', 'Administrador']}><Pedidos /></RequireRole>} />
          <Route path="/vendedor-orden-detalle.html" element={<RequireRole roles={['Vendedor', 'Administrador']}><Pedidos /></RequireRole>} />
          <Route path="*" element={<Contenido />} />
        </Routes>
      </div>

      <Footer />
    </>
  )
}

export default App
