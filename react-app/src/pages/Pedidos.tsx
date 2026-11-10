import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useSession } from '../services/sessionStore'
import { ordersFor, changeOrderStatus, orderStatuses } from '../services/commerceService'
import type { ShopOrder } from '../services/commerceService'
import { formatPrice } from '../services/productSelection'

export default function Pedidos() {
  const { user } = useSession()
  const [params] = useSearchParams()
  const [orders, setOrders] = useState<ShopOrder[]>([])
  const [error, setError] = useState('')
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    const refresh = () => { try { setOrders(ordersFor(localStorage, user)); setError('') } catch (cause) { setError(String(cause)); setOrders([]) } }
    refresh()
    window.addEventListener('storage', refresh)
    return () => window.removeEventListener('storage', refresh)
  }, [user, revision])
  const id = params.get('id')
  const order = orders.find((row) => row.id === id)
  return <main className="container py-5"><h1>{id ? 'Detalle del pedido' : user?.tipoUsuario === 'Cliente' ? 'Mis pedidos' : 'Órdenes de compra'}</h1>
    {error && <p className="alert alert-danger" role="alert">{error}</p>}
    {id ? !order ? <p role="alert">Pedido no encontrado o sin permiso para consultarlo.</p> : <>
      <h2>{order.numeroOrden}</h2><p>{order.fechaTexto} · Estado: <strong>{order.estado}</strong></p>
      <p>{order.cliente.nombre} {order.cliente.apellidos} · {order.cliente.correo}</p>
      {order.entrega && <section><h3>Entrega</h3><p>{order.entrega.metodo === 'retiro' ? 'Retiro coordinado (simulado)' : `${order.entrega.calle} ${order.entrega.numero}, ${order.entrega.unidad}, ${order.entrega.comuna}, ${order.entrega.region}`}</p></section>}
      <ul>{order.productos.map((item, index) => <li key={`${item.id}-${index}`}>{item.nombre} · {item.color} · {item.cantidad} × {formatPrice(item.precio)} = {formatPrice(item.subtotal)}</li>)}</ul>
      <p>Total: <strong>{formatPrice(order.total)}</strong></p>
      {user?.tipoUsuario === 'Administrador' && <><label htmlFor="estado-pedido">Estado del pedido</label><select id="estado-pedido" className="form-select" value={order.estado} onChange={(event) => {
        try { changeOrderStatus(localStorage, user, order.id, event.target.value); setRevision((v) => v + 1) } catch (cause) { setError(String(cause)) }
      }}>{orderStatuses.map((status) => <option key={status}>{status}</option>)}</select></>}
      <Link to="/mis-pedidos.html">Volver a pedidos</Link>
    </> : <>{!orders.length && !error && <p>No hay pedidos registrados.</p>}<ul className="list-group">{orders.map((row) => <li className="list-group-item" key={row.id}><Link to={`/pedido-detalle.html?id=${encodeURIComponent(row.id)}`}>{row.numeroOrden}</Link> · {row.estado} · {formatPrice(row.total)}</li>)}</ul></>}
  </main>
}
