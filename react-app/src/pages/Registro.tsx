import { useEffect, useRef, useState } from 'react'
import type { ComponentPropsWithoutRef, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TextField from '../components/ui/TextField'
import SelectField from '../components/ui/SelectField'
import Button from '../components/ui/Button'
import { regiones } from '../data/regions'
import { createRegistrationService } from '../services/registrationService'
import { emptyRegistration, localDateValue, validateRegistration } from '../services/registrationValidation'
import type { RegistrationErrors, RegistrationField } from '../services/registrationValidation'
import './Registro.css'

const defaultService = createRegistrationService({
  getItem: (key) => window.localStorage.getItem(key), setItem: (key, value) => window.localStorage.setItem(key, value),
})
export default function Registro({ service = defaultService }: { service?: ReturnType<typeof createRegistrationService> }) {
  const navigate = useNavigate()
  const [values, setValues] = useState({ ...emptyRegistration })
  const [touched, setTouched] = useState<Partial<Record<RegistrationField, boolean>>>({})
  const [serverErrors, setServerErrors] = useState<RegistrationErrors>({})
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const submitted = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const errors = { ...validateRegistration(values), ...serverErrors }
  const error = (field: RegistrationField) => touched[field] ? errors[field] : undefined
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'ALBEDO Outdoor | Crear cuenta'
    return () => { document.title = previousTitle; if (timer.current) clearTimeout(timer.current) }
  }, [])
  function edit(field: RegistrationField, input: string) {
    const value = field === 'rutNumero' ? input.replace(/[^0-9]/g, '').slice(0, 8)
      : field === 'digitoVerificador' ? input.toUpperCase().replace(/[^0-9K]/g, '').slice(0, 1) : input
    setValues((previous) => ({ ...previous, [field]: value,
      ...(field === 'region' ? { comuna: '' } : {}),
      ...(field === 'tipoDomicilio' && value !== 'Departamento' ? { numeroUnidad: '' } : {}),
    }))
    setTouched((previous) => ({ ...previous, [field]: true,
      ...(field === 'digitoVerificador' ? { rutNumero: true } : {}),
      ...(field === 'region' ? { comuna: false } : {}),
      ...(field === 'tipoDomicilio' ? { numeroUnidad: false } : {}),
    }))
    setServerErrors({})
    setMessage('')
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitted.current) return
    setTouched(Object.fromEntries(Object.keys(emptyRegistration).map((field) => [field, true])))
    setServerErrors({})
    try {
      const result = service.register(values)
      setMessage(result.message)
      if (result.status === 'invalid') { setServerErrors(result.errors); return }
      submitted.current = true
      setSuccess(true)
      timer.current = setTimeout(() => navigate('/login.html'), 1500)
    } catch {
      setMessage('No se pudo guardar la cuenta. Tus usuarios y sesión anteriores se conservan. Revisa el almacenamiento e inténtalo nuevamente.')
    }
  }
  function input(field: RegistrationField, label: string, props: ComponentPropsWithoutRef<'input'> = {}) {
    return <TextField id={`${field}Registro`} name={field} label={label} required={field !== 'fechaNacimiento' && field !== 'numeroUnidad'}
      {...props} value={values[field]} disabled={success || props.disabled} error={error(field)}
      onChange={(event) => edit(field, event.target.value)} />
  }
  const communes = Object.hasOwn(regiones, values.region) ? regiones[values.region] : []
  return <main className="container py-5 registro-page">
    <div className="row justify-content-center"><div className="col-12 col-lg-8 col-xl-7">
      <div className="mb-5"><p className="etiqueta mb-2">ALBEDO OUTDOOR</p><h1 className="fs-1">Crear cuenta</h1>
        <p className="registro-description mt-3">Completa tus datos para registrarte como cliente de ALBEDO Outdoor.</p></div>
      <form id="formularioRegistro" noValidate onSubmit={submit}>
        <div className="row">
          <div className="col-12 col-md-6 mb-4">
            <div className="row g-2 align-items-start">
              <div className="col"><TextField id="runRegistro" name="rutNumero" label="RUT" inputMode="numeric" minLength={6} maxLength={8}
                pattern="[0-9]{6,8}" placeholder="19011022" autoComplete="off" required value={values.rutNumero} disabled={success}
                onChange={(event) => edit('rutNumero', event.target.value)} error={error('rutNumero')}
                hint="RUT de 6 a 8 números y dígito verificador de 0 a 9 o K." /></div>
              <div className="col-auto registro-rut-divider" aria-hidden="true">-</div>
              <div className="col-3"><TextField id="dvRegistro" name="digitoVerificador" label="DV" minLength={1} maxLength={1}
                pattern="[0-9Kk]" placeholder="K" autoComplete="off" required value={values.digitoVerificador} disabled={success}
                className={error('rutNumero') ? 'is-invalid' : ''}
                aria-invalid={!!error('rutNumero')} aria-describedby={error('rutNumero') ? 'runRegistro-error' : 'runRegistro-hint'}
                onChange={(event) => edit('digitoVerificador', event.target.value)} /></div>
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">{input('nombre', 'Nombre', { maxLength: 50, placeholder: 'Ingresa tu nombre', autoComplete: 'given-name' })}</div>
          <div className="col-12 col-md-6 mb-4">{input('apellidos', 'Apellidos', { maxLength: 100, placeholder: 'Ingresa tus apellidos', autoComplete: 'family-name' })}</div>
          <div className="col-12 col-md-6 mb-4">{input('correo', 'Correo electrónico', { type: 'email', maxLength: 100, placeholder: 'nombre@gmail.com', autoComplete: 'email' })}
            <p className="form-text">Correos permitidos: @gmail.com, @duoc.cl y @profesor.duoc.cl</p></div>
          <div className="col-12 col-md-6 mb-4">{input('fechaNacimiento', 'Fecha de nacimiento', { type: 'date', min: '1900-01-01', max: localDateValue() })}<p className="form-text">Campo opcional.</p></div>
          <div className="col-12 col-md-6 mb-4"><SelectField id="regionRegistro" label="Región" required value={values.region} disabled={success} error={error('region')} onChange={(event) => edit('region', event.target.value)}>
            <option value="">Selecciona una región</option>{Object.keys(regiones).map((region) => <option key={region}>{region}</option>)}
          </SelectField></div>
          <div className="col-12 col-md-6 mb-4"><SelectField id="comunaRegistro" label="Comuna" required value={values.comuna} disabled={success || !communes.length} error={error('comuna')} onChange={(event) => edit('comuna', event.target.value)}>
            <option value="">{values.region ? 'Selecciona una comuna' : 'Selecciona primero una región'}</option>{communes.map((commune) => <option key={commune}>{commune}</option>)}
          </SelectField></div>
          <div className="col-12 col-md-6 mb-4">{input('calle', 'Calle o avenida', { maxLength: 150, placeholder: 'Ej: Avenida Los Carrera', autoComplete: 'address-line1' })}</div>
          <div className="col-12 col-md-6 mb-4">{input('numeroDomicilio', 'Número de domicilio', { inputMode: 'numeric', maxLength: 7, placeholder: 'Ej: 1234' })}</div>
          <div className="col-12 col-md-6 mb-4"><SelectField id="tipoDomicilioRegistro" label="Tipo de domicilio" required value={values.tipoDomicilio} disabled={success} error={error('tipoDomicilio')} onChange={(event) => edit('tipoDomicilio', event.target.value)}>
            <option value="">Selecciona una opción</option><option>Casa</option><option>Departamento</option>
          </SelectField></div>
          <div className="col-12 col-md-6 mb-4">{input('numeroUnidad', 'Número de departamento', { inputMode: 'numeric', maxLength: 6, required: values.tipoDomicilio === 'Departamento',
            disabled: values.tipoDomicilio !== 'Departamento', placeholder: values.tipoDomicilio === 'Departamento' ? 'Ej: 504' : values.tipoDomicilio === 'Casa' ? 'No corresponde' : 'Selecciona Departamento' })}
            <p className="form-text">Solo se utiliza si el domicilio es un departamento.</p></div>
          <div className="col-12 col-md-6 mb-4">{input('codigoPostal', 'Código postal', { inputMode: 'numeric', maxLength: 7, placeholder: 'Ej: 4030000', autoComplete: 'postal-code' })}</div>
          <div className="col-12 col-md-6 mb-4">{input('contrasena', 'Contraseña', { type: 'password', minLength: 10, autoComplete: 'new-password', placeholder: 'Ingresa tu contraseña' })}
            <p className="form-text">Mínimo 10 caracteres, al menos una letra, un número y un símbolo: % &amp; $ # / ( ) = &quot; !</p></div>
          <div className="col-12 col-md-6 mb-4">{input('confirmarContrasena', 'Confirmar contraseña', { type: 'password', minLength: 10, autoComplete: 'new-password', placeholder: 'Repite tu contraseña' })}</div>
        </div>
        <Button type="submit" className="registro-submit px-4 py-2" disabled={success}>Crear cuenta</Button>
        <p className="mt-4 mb-0 small">¿Ya tienes una cuenta? <Link to="/login.html">Iniciar sesión</Link></p>
        <div id="mensajeResultadoRegistro" role="alert" className={message ? `alert ${success ? 'alert-success' : 'alert-danger'} mt-4` : ''}>{message}</div>
      </form>
    </div></div>
  </main>
}
