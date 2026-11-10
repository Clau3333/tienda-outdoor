import TextField from './ui/TextField'
import { regiones } from '../data/regions'
import type { Delivery } from '../services/commerceService'

export default function DeliveryForm({ value, onChange, disabled }: { value: Delivery; onChange: (value: Delivery) => void; disabled: boolean }) {
  const update = (key: keyof Delivery, input: string) => onChange({ ...value, [key]: input, ...(key === 'region' ? { comuna: '' } : {}) })
  const fields = [['nombre', 'Nombre'], ['apellidos', 'Apellidos'], ['correo', 'Correo'], ['telefono', 'Teléfono']] as const
  return <fieldset disabled={disabled} className="commerce-form mb-4"><legend>Datos del cliente y entrega</legend>
    <p>Datos de demostración. No ingreses información personal real.</p>
    <div className="row g-3">{fields.map(([key, label]) => <div className="col-12 col-md-6" key={key}><TextField id={`compra-${key}`} label={label} required maxLength={key === 'nombre' ? 50 : key === 'telefono' ? 16 : 100} type={key === 'correo' ? 'email' : key === 'telefono' ? 'tel' : 'text'} value={value[key]} onChange={(e) => update(key, e.target.value)} /></div>)}</div>
    <label htmlFor="compra-metodo" className="form-label mt-3">Opciones de entrega</label>
    <select id="compra-metodo" className="form-select" value={value.metodo} onChange={(e) => update('metodo', e.target.value)}><option value="domicilio">Domicilio simulado · sin costo</option><option value="retiro">Retiro coordinado (simulado)</option></select>
    {value.metodo === 'domicilio' && <div className="row g-3 mt-1">
      <div className="col-12 col-md-6"><label htmlFor="compra-region" className="form-label">Región</label><select id="compra-region" className="form-select" value={value.region} onChange={(e) => update('region', e.target.value)}><option value="">Selecciona región</option>{Object.keys(regiones).map((r) => <option key={r}>{r}</option>)}</select></div>
      <div className="col-12 col-md-6"><label htmlFor="compra-comuna" className="form-label">Comuna</label><select id="compra-comuna" className="form-select" value={value.comuna} onChange={(e) => update('comuna', e.target.value)}><option value="">Selecciona comuna</option>{(regiones[value.region] ?? []).map((c) => <option key={c}>{c}</option>)}</select></div>
      {([['calle', 'Calle'], ['numero', 'Número'], ['unidad', 'Departamento / unidad (opcional)']] as const).map(([key, label]) => <div className="col-12 col-md-4" key={key}><TextField label={label} id={`compra-${key}`} maxLength={key === 'calle' ? 150 : 20} value={value[key]} onChange={(e) => update(key, e.target.value)} /></div>)}
    </div>}
  </fieldset>
}
