
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
        </Routes>
      </div>

      <Footer />
    </>
  )
}

export default App
