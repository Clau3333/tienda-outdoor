import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useSession } from '../services/sessionStore'
import type { LoginRole } from '../services/loginService'

export default function RequireRole({ roles, children }: { roles: LoginRole[]; children: ReactNode }) {
  const { user, error } = useSession()
  if (error) return <main className="container py-5"><h1>Sesión no disponible</h1><p role="alert">{error}</p><Link to="/login.html">Iniciar sesión</Link></main>
  if (!user) return <main className="container py-5"><h1>Inicia sesión</h1><p>Necesitas una cuenta para acceder a esta página.</p><Link to="/login.html">Iniciar sesión</Link></main>
  if (!roles.includes(user.tipoUsuario)) return <main className="container py-5"><h1>Acceso no permitido</h1><p role="alert">Tu rol no permite acceder a esta sección.</p><Link to="/">Volver al inicio</Link></main>
  return children
}
