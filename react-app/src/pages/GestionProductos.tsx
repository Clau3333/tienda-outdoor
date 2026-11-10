import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useProducts, productRepository } from '../services/productStore'
import { useSession } from '../services/sessionStore'
import { categoryDefinitions } from '../data/products'
import type { Product } from '../data/productTypes'
import { formatPrice } from '../services/productSelection'
import TextField from '../components/ui/TextField'

const blank = (): Product => ({ id: '', codigo: '', nombre: '', descripcion: '', categoria: 'Chaquetas', precio: 0, stock: 0, stockCritico: '', imagen: '', colores: [] })
export default function GestionProductos() {
  const { products, error: readError } = useProducts()
  const { user } = useSession()
  const admin = user?.tipoUsuario === 'Administrador'
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(blank)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  function save(event: FormEvent) {
    event.preventDefault()
    if (!admin) { setError('Acceso no permitido.'); return }
    try {
      if (!/^[a-z0-9-]+$/.test(form.id) || !form.nombre.trim() || form.nombre.length > 100 || form.descripcion.length > 500 || (form.codigo?.length ?? 0) < 3
        || !categoryDefinitions.some((c) => c.nombre === form.categoria) || !Number.isFinite(form.precio) || form.precio < 0 || !Number.isSafeInteger(form.stock) || form.stock! < 0
        || (form.stockCritico !== '' && (!Number.isSafeInteger(form.stockCritico) || form.stockCritico! < 0))) throw new Error('Revisa ID, código (mínimo 3 caracteres), nombre, categoría, precio y stock entero no negativo.')
      if (editing) productRepository.update(editing, form)
      else productRepository.create({ ...form, id: form.id.startsWith('admin-') ? form.id : `admin-${form.id}` })
      setEditing(null); setForm(blank()); setMessage('Producto guardado.'); setError('')
    } catch (cause) { setError(String(cause)); setMessage('') }
  }
  return <main className="container py-5"><h1>{admin ? 'Administrar productos' : 'Productos · vendedor'}</h1>
    <p>El catálogo comparte persistencia con la tienda y Sitio Old. Para demostrar CRUD utiliza productos nuevos; conserva los originales.</p>
    {(error || readError) && <p role="alert" className="alert alert-danger">{error || readError}</p>}{message && <p role="status">{message}</p>}
    <TextField label="Buscar en gestión" value={query} onChange={(e) => setQuery(e.target.value)} />
    <div className="table-responsive mt-3"><table className="table commerce-table"><caption>Productos y stock</caption><thead><tr><th>Producto</th><th>Código</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead><tbody>{products.filter((p) => `${p.nombre} ${p.codigo ?? ''}`.toLowerCase().includes(query.toLowerCase())).map((p) => <tr key={p.id}><td><Link to={`/producto-detalle.html?id=${encodeURIComponent(p.id)}`}>{p.nombre}</Link>{p.oferta && ' · Oferta'}</td><td>{p.codigo ?? '—'}</td><td>{formatPrice(p.precio)}</td><td>{p.stock ?? 'Sin dato'}{typeof p.stockCritico === 'number' && (p.stock ?? Infinity) <= p.stockCritico && ' · Stock crítico'}</td><td>{admin && <div className="commerce-actions"><button type="button" className="btn btn-outline-secondary" onClick={() => { setEditing(p.id); setForm(structuredClone(p)); setError('') }}>Editar {p.nombre}</button><button type="button" className="btn btn-outline-danger" onClick={() => {
      if (!window.confirm(`¿Eliminar ${p.nombre}? Esta acción cambia el catálogo local.`)) return
      try { productRepository.remove(p.id); setMessage('Producto eliminado.'); setError('') } catch (cause) { setError(String(cause)) }
    }}>Eliminar {p.nombre}</button></div>}</td></tr>)}</tbody></table></div>
    {admin && <form onSubmit={save} className="commerce-form"><h2>{editing ? 'Editar producto' : 'Crear producto'}</h2>
      <div className="row g-3">{([['id', 'ID'], ['codigo', 'Código'], ['nombre', 'Nombre'], ['descripcion', 'Descripción']] as const).map(([key, label]) => <div className="col-12 col-md-6" key={key}><TextField label={label} id={`gestion-${key}`} required value={form[key] ?? ''} disabled={key === 'id' && editing !== null} maxLength={key === 'descripcion' ? 500 : 100} onChange={(e) => setForm({ ...form, [key]: e.target.value })} /></div>)}</div>
      <label className="form-label mt-3" htmlFor="gestion-categoria">Categoría</label><select id="gestion-categoria" className="form-select" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>{categoryDefinitions.map((c) => <option key={c.anchor}>{c.nombre}</option>)}</select>
      <div className="row g-3 mt-1">{([['precio', 'Precio'], ['stock', 'Stock'], ['stockCritico', 'Stock crítico (opcional)']] as const).map(([key, label]) => <div key={key} className="col-12 col-md-4"><TextField label={label} id={`gestion-${key}`} type="number" min={0} step={key === 'precio' ? 'any' : 1} value={form[key] ?? ''} onChange={(e) => setForm({ ...form, [key]: key === 'stockCritico' && !e.target.value ? '' : Number(e.target.value) })} /></div>)}</div>
      <p>Las imágenes y variantes originales se conservan; los productos nuevos usan un marcador sin imagen.</p>
      <label><input type="checkbox" checked={form.oferta ?? false} onChange={(e) => setForm({ ...form, oferta: e.target.checked })} /> Marcar como oferta (sin cambiar el precio)</label>
      <div className="commerce-actions"><button className="btn btn-primary" disabled={!!readError}>Guardar producto</button><button type="button" className="btn btn-outline-secondary" onClick={() => { setForm(blank()); setEditing(null) }}>Cancelar edición</button></div>
    </form>}
  </main>
}
