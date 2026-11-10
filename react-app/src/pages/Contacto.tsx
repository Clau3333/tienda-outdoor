import { useState } from 'react'
import type { FormEvent } from 'react'
import TextField from '../components/ui/TextField'
import { useSession } from '../services/sessionStore'

export default function Contacto() {
  const { user } = useSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [reason, setReason] = useState('')
  const [body, setBody] = useState('')
  const [terms, setTerms] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  function submit(event: FormEvent) {
    event.preventDefault(); setSuccess(false)
    if (!(user?.nombre || name).trim() || !(user?.correo || email).match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) || !/^\+?[0-9 ]{8,15}$/.test(phone) || !reason || body.trim().length < 10 || body.length > 500 || !terms) { setError('Revisa nombre, correo, teléfono, motivo, mensaje de 10 a 500 caracteres y aceptación de términos.'); return }
    setError(''); setSuccess(true)
  }
  return <main className="container py-5"><h1>Contacto</h1><p>Comienza hoy tu aventura. Cuéntanos cómo podemos ayudarte.</p><p>Formulario de demostración: no envía correos ni solicitudes a un servidor.</p>
    <form className="commerce-form" onSubmit={submit} noValidate><div className="row g-3">
      <div className="col-12 col-md-6"><TextField label="Nombre" required maxLength={100} value={user?.nombre || name} readOnly={!!user} onChange={(e) => setName(e.target.value)} /></div>
      <div className="col-12 col-md-6"><TextField label="Correo" type="email" required maxLength={100} value={user?.correo || email} readOnly={!!user} onChange={(e) => setEmail(e.target.value)} /></div>
      <div className="col-12 col-md-6"><TextField label="Teléfono" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
      <div className="col-12 col-md-6"><label htmlFor="contacto-motivo" className="form-label">Motivo</label><select id="contacto-motivo" className="form-select" value={reason} onChange={(e) => setReason(e.target.value)}><option value="">Selecciona</option>{['Consulta de producto', 'Consulta por talla', 'Estado de pedido', 'Cambios y devoluciones', 'Otro'].map((r) => <option key={r}>{r}</option>)}</select></div>
      <div className="col-12"><label htmlFor="contacto-mensaje" className="form-label">Mensaje</label><textarea id="contacto-mensaje" className="form-control" maxLength={500} value={body} onChange={(e) => setBody(e.target.value)} /></div>
    </div><label className="my-3 d-block"><input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} /> Acepto el uso de estos datos únicamente para esta demostración local.</label>
    <button className="btn btn-primary">Enviar consulta simulada</button>{error && <p role="alert" className="alert alert-danger mt-3">{error}</p>}{success && <p role="status" className="alert alert-success mt-3">Consulta validada correctamente. Simulación completada; no se realizó un envío real.</p>}
    </form>
  </main>
}
