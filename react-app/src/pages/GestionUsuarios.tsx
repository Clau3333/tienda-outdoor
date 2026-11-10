import { useState } from 'react'
import type { FormEvent } from 'react'
import { readStoredUsers } from '../services/loginService'
import { useSession } from '../services/sessionStore'
import { saveManagedUser } from '../services/commerceService'
import { emptyRegistration } from '../services/registrationValidation'
import type { RegistrationValues } from '../services/registrationValidation'
import { regiones } from '../data/regions'
import TextField from '../components/ui/TextField'

const labels: Record<keyof RegistrationValues, string> = { rutNumero: 'RUT sin puntos', digitoVerificador: 'Dígito verificador', nombre: 'Nombre', apellidos: 'Apellidos', correo: 'Correo', fechaNacimiento: 'Fecha de nacimiento (opcional)', region: 'Región', comuna: 'Comuna', calle: 'Calle', numeroDomicilio: 'Número domicilio', tipoDomicilio: 'Tipo domicilio', numeroUnidad: 'Número departamento', codigoPostal: 'Código postal', contrasena: 'Contraseña', confirmarContrasena: 'Confirmar contraseña' }
export default function GestionUsuarios() {
  const { user } = useSession()
  const [values, setValues] = useState({ ...emptyRegistration })
  const [role, setRole] = useState('Cliente')
  const [original, setOriginal] = useState<string | undefined>()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [revision, setRevision] = useState(0)
  void revision
  let users: Record<string, unknown>[] = []
  try { users = readStoredUsers(localStorage) } catch { /* La lectura se muestra como error sin sobrescribir usuarios. */ }
  const [query, setQuery] = useState('')
  function edit(key: keyof RegistrationValues, value: string) {
    setValues((previous) => ({ ...previous, [key]: value, ...(key === 'region' ? { comuna: '' } : {}) }))
  }
  function save(event: FormEvent) {
    event.preventDefault()
    try { saveManagedUser(localStorage, user, values, role, original); setValues({ ...emptyRegistration }); setOriginal(undefined); setRole('Cliente'); setError(''); setMessage('Usuario guardado.'); setRevision((n) => n + 1) }
    catch (cause) { setError(String(cause)); setMessage('') }
  }
  return <main className="container py-5"><h1>Administrar usuarios</h1><p>Gestión académica local. No utilices contraseñas ni datos personales reales.</p>
    {error && <p role="alert" className="alert alert-danger">{error}</p>}{message && <p role="status">{message}</p>}
    {!users.length && <p>Sin usuarios disponibles. Si los datos están corruptos, el guardado se rechazará sin reemplazarlos.</p>}
    <TextField label="Buscar usuario" value={query} onChange={(e) => setQuery(e.target.value)} />
    <ul className="list-group my-3">{users.filter((row) => `${row.nombre} ${row.apellidos} ${row.correo}`.toLowerCase().includes(query.toLowerCase())).map((row) => <li className="list-group-item" key={String(row.correo)}>{String(row.nombre)} {String(row.apellidos)} · {String(row.correo)} · {String(row.tipoUsuario)} <button type="button" className="btn btn-outline-secondary" onClick={() => {
      const next = { ...emptyRegistration }
      for (const key of Object.keys(next) as (keyof RegistrationValues)[]) next[key] = typeof row[key] === 'string' ? row[key] as string : ''
      next.confirmarContrasena = next.contrasena
      setValues(next); setOriginal(String(row.correo)); setRole(String(row.tipoUsuario)); setError('')
    }}>Editar {String(row.nombre)}</button></li>)}</ul>
    <form className="commerce-form" onSubmit={save}><h2>{original ? 'Editar usuario' : 'Crear usuario'}</h2><div className="row g-3">
      {(Object.keys(values) as (keyof RegistrationValues)[]).map((key) => {
        const choices = key === 'region' ? Object.keys(regiones) : key === 'comuna' ? regiones[values.region] ?? [] : key === 'tipoDomicilio' ? ['Casa', 'Departamento'] : null
        return <div className="col-12 col-md-6" key={key}>{choices ? <><label className="form-label" htmlFor={`usuario-${key}`}>{labels[key]}</label><select className="form-select" id={`usuario-${key}`} value={values[key]} onChange={(e) => edit(key, e.target.value)}><option value="">Selecciona</option>{choices.map((choice) => <option key={choice}>{choice}</option>)}</select></> : <TextField id={`usuario-${key}`} label={labels[key]} value={values[key]} maxLength={key === 'contrasena' || key === 'confirmarContrasena' ? 200 : 150} type={key.includes('ontrasena') ? 'password' : key === 'fechaNacimiento' ? 'date' : key === 'correo' ? 'email' : 'text'} onChange={(e) => edit(key, e.target.value)} />}</div>
      })}
      <div className="col-12"><label htmlFor="usuario-rol">Rol</label><select id="usuario-rol" className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>{['Cliente', 'Vendedor', 'Administrador'].map((r) => <option key={r}>{r}</option>)}</select></div>
    </div><div className="commerce-actions"><button className="btn btn-primary">Guardar usuario</button><button type="button" className="btn btn-outline-secondary" onClick={() => { setValues({ ...emptyRegistration }); setOriginal(undefined); setRole('Cliente') }}>Cancelar edición</button></div></form>
  </main>
}
