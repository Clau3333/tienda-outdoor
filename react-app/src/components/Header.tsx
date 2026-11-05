
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useId, useRef, useState } from 'react'
import Navbar from './Navbar'
import ThemeToggle from './ThemeToggle'
import { legacyBase, primaryLinks } from './navigation'
import { sessionState, useSession } from '../services/sessionStore'
import './Header.css'

type HeaderProps = {
  cartCount?: number
}

export default function Header({ cartCount }: HeaderProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, error: sessionError } = useSession()
  const [logoutError, setLogoutError] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()
  const menuButton = useRef<HTMLButtonElement>(null)
  const roleLink = user?.tipoUsuario === 'Administrador' ? { href: 'admin.html', label: 'Panel administrador' }
    : user?.tipoUsuario === 'Vendedor' ? { href: 'vendedor.html', label: 'Panel vendedor' }
      : { href: 'mis-pedidos.html', label: 'Mis pedidos' }
  function logout() {
    try {
      sessionState.logout()
      setLogoutError('')
      setMenuOpen(false)
      navigate('/index.html')
    } catch {
      setLogoutError('No se pudo cerrar la sesión. Revisa el almacenamiento e inténtalo nuevamente.')
    }
  }

  return (
    <header className="cabecera-tienda">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>

      <div
        className="cabecera-superior"
        onKeyDown={(event) => {
          if (event.key === 'Escape' && menuOpen) {
            setMenuOpen(false)
            menuButton.current?.focus()
          }
        }}
      >
        <Link
          className="marca"
          to="/"
          aria-label="ALBEDO Outdoor, inicio"
        >
          <img
            src={`${legacyBase}img/logo-albedo.png`}
            alt="ALBEDO Outdoor"
            width="165"
            height="56"
          />
        </Link>

        <nav
          id={menuId}
          className={`enlaces-principales${menuOpen ? ' is-open' : ''}`}
          aria-label="Navegación principal"
          onClick={() => setMenuOpen(false)}
        >
          <Link
            to="/"
            aria-current={
              pathname === '/' || pathname === '/index.html'
                ? 'page'
                : undefined
            }
          >
            Inicio
          </Link>

          {primaryLinks.filter(({ href }) => !user || (href !== 'login.html' && href !== 'registro.html')).map(({ label, href }) =>
            href === 'productos.html' || href === 'carrito.html' || href === 'login.html' || href === 'registro.html' ? (
              <Link
                key={href}
                to={`/${href}`}
                aria-current={
                  pathname === `/${href}` ? 'page' : undefined
                }
              >
                {label}

                {href === 'carrito.html' &&
                  cartCount !== undefined && (
                    <span
                      className="carrito-contador"
                      aria-label={`${cartCount} unidades en el carrito`}
                      aria-live="polite"
                    >
                      {cartCount}
                    </span>
                  )}
              </Link>
            ) : (
              <a
                key={href}
                href={`${legacyBase}${href}`}
              >
                {label}

                {href === 'carrito.html' &&
                  cartCount !== undefined && (
                    <span
                      className="carrito-contador"
                      aria-label={`${cartCount} productos`}
                    >
                      {cartCount}
                    </span>
                  )}
              </a>
            )
          )}
          {user && <>
            <span className="header-session-greeting" role="status">Hola, {user.nombre}</span>
            <a href={`${legacyBase}${roleLink.href}`}>{roleLink.label}</a>
            <button type="button" className="header-session-logout" onClick={logout}>Cerrar sesión</button>
          </>}
        </nav>

        <div className="header-actions">
          <ThemeToggle />

          <button
            className="header-menu-toggle"
            type="button"
            ref={menuButton}
            aria-label="Menú principal"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {(sessionError || (user && logoutError)) && <p className="header-session-error" role="alert">{sessionError || logoutError}</p>}
      <Navbar />
    </header>
  )
}
