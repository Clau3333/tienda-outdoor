import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TextField from '../components/ui/TextField'
import Button from '../components/ui/Button'
import { legacyBase } from '../components/navigation'
import { createLoginService } from '../services/loginService'
import { sessionLoginService, sessionState } from '../services/sessionStore'
import { validateLoginEmail, validateLoginPassword } from '../services/loginValidation'
import './Login.css'

const defaultService = sessionLoginService
type LoginProps = {
  service?: ReturnType<typeof createLoginService>
  redirectLegacy?: (url: string) => void
}
const redirectToLegacy = (url: string) => window.location.assign(url)

export default function Login({ service = defaultService, redirectLegacy = redirectToLegacy }: LoginProps) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState({ email: false, password: false })
  const [neutral, setNeutral] = useState(false)
  const [message, setMessage] = useState('')
  const [successName, setSuccessName] = useState<string | null>(null)
  const [storageError, setStorageError] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const submitted = useRef(false)
  const errors = { email: validateLoginEmail(email), password: validateLoginPassword(password) }

  useEffect(() => {
    let active = true
    const previousTitle = document.title
    document.title = 'ALBEDO Outdoor | Iniciar sesión'
    // Inicializa después del montaje y cancela la publicación de errores al salir.
    Promise.resolve().then(() => { if (active) service.initializeAdministrator() }).catch(() => {
      if (active) setStorageError('No se pudieron leer o guardar los usuarios. Tus datos se conservan; revisa el almacenamiento y vuelve a intentar.')
    })
    return () => { active = false; document.title = previousTitle; if (timer.current) clearTimeout(timer.current) }
  }, [service])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitted.current) return
    setTouched({ email: true, password: true })
    setNeutral(false)
    setStorageError('')
    try {
      const result = service.authenticate(email, password)
      if (result.status !== 'success') {
        setMessage(result.message)
        setNeutral(result.status === 'incorrect')
        if (result.status === 'incorrect') setTouched({ email: false, password: false })
        return
      }
      submitted.current = true
      sessionState.refresh()
      setMessage('Inicio de sesión exitoso.')
      setSuccessName(String(result.session.nombre ?? ''))
      timer.current = setTimeout(() => {
        // Una salida o cambio de cuenta en otra pestaña cancela el destino pendiente.
        sessionState.refresh()
        const current = sessionState.getSnapshot().user
        if (!current || current.correo.trim().toLowerCase() !== String(result.session.correo).trim().toLowerCase()
          || current.tipoUsuario !== result.session.tipoUsuario) {
          submitted.current = false
          setSuccessName(null)
          setMessage('La sesión cambió. Vuelve a iniciar sesión.')
          return
        }
        if (result.destination === 'index.html') navigate('/index.html')
        else redirectLegacy(legacyBase + result.destination)
      }, 700)
    } catch {
      setMessage('')
      setStorageError('No se pudo iniciar sesión porque el almacenamiento no está disponible o contiene datos inválidos. No se ha reemplazado tu sesión anterior. Inténtalo nuevamente.')
    }
  }
  function edited(field: 'email' | 'password', value: string) {
    if (field === 'email') setEmail(value)
    else setPassword(value)
    setTouched((previous) => ({ ...previous, [field]: true }))
    setNeutral(false)
    setMessage('')
  }

  return (
    <main className="container py-5 login-page">
      <div className="row justify-content-center"><div className="col-12 col-lg-6 col-xl-5">
        <div className="mb-5">
          <p className="etiqueta mb-2">ALBEDO OUTDOOR</p>
          <h1 className="fs-1">Iniciar sesión</h1>
          <p className="login-description mt-3">Ingresa tu correo y contraseña para acceder a tu cuenta.</p>
        </div>
        <form id="formularioLogin" noValidate onSubmit={submit}>
          <div className="mb-4"><TextField id="correoLogin" name="correoLogin" label="Correo electrónico" type="text"
            maxLength={100} autoComplete="email" placeholder="nombre@gmail.com" required value={email}
            disabled={successName !== null} onChange={(event) => edited('email', event.target.value)}
            hint={`Correos permitidos: @gmail.com, @duoc.cl y @profesor.duoc.cl.${!neutral && touched.email && !errors.email ? ' Formato válido; no confirma que exista una cuenta.' : ''}`}
            error={!neutral && touched.email ? errors.email : undefined} /></div>
          <div className="mb-4"><TextField id="contrasenaLogin" name="contrasenaLogin" label="Contraseña" type="password"
            minLength={10} autoComplete="current-password" placeholder="Ingresa tu contraseña" required value={password}
            disabled={successName !== null} onChange={(event) => edited('password', event.target.value)}
            hint={'Mínimo 10 caracteres, al menos una letra, un número y un símbolo: % & $ # / ( ) = " !.' + (!neutral && touched.password && !errors.password ? ' Formato válido; no confirma la contraseña de una cuenta.' : '')}
            error={!neutral && touched.password ? errors.password : undefined} /></div>
          <Button type="submit" className="login-submit px-4 py-2" disabled={successName !== null}>Iniciar sesión</Button>
          <p className="mt-4 mb-0 small">¿No tienes una cuenta? <Link to="/registro.html">Registrarse</Link></p>
          <div id="mensajeResultadoLogin" role="alert" className={message || storageError ? `alert ${successName !== null ? 'alert-success' : 'alert-danger'} mt-4` : ''}>
            {storageError || message}
            {successName !== null && <div className="mt-1">Bienvenido {successName}.</div>}
          </div>
        </form>
      </div></div>
    </main>
  )
}
