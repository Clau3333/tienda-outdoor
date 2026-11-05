import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { cartRepository, cartState, useCart } from '../services/cartStore'
import { createCheckoutService, type Order, type PaymentResult } from '../services/checkoutService'
import { formatPrice, productImageUrl } from '../services/productSelection'
import type { CartItem } from '../services/cartRepository'
import './Carrito.css'

const checkout = createCheckoutService({
  getItem: (key) => window.localStorage.getItem(key),
  setItem: (key, value) => window.localStorage.setItem(key, value),
}, cartRepository)

export default function Carrito() {
  const { items, total, error: storageError } = useCart()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState<PaymentResult>('aprobado')
  const [receipt, setReceipt] = useState<Order | null>(null)
  const [warning, setWarning] = useState('')
  const [busy, setBusy] = useState(false)
  const submitting = useRef(false)
  const attempt = useRef<string | null>(null)

  function change(action: () => void, success = '') {
    try {
      action()
      setError('')
      setMessage(success)
    } catch {
      setError('No se pudo guardar el cambio. Se conserva el carrito anterior. Revisa el almacenamiento e inténtalo de nuevo.')
    }
  }
  function quantity(item: CartItem, input: HTMLInputElement) {
    const value = input.value
    const number = Number(value)
    if (!/^\d+$/.test(value) || !Number.isSafeInteger(number) || number < 1) {
      input.value = String(item.cantidad)
      setError('La cantidad debe ser un número entero mayor que cero. Se conservó la cantidad anterior.')
      return
    }
    change(() => cartRepository.updateQuantity(item.id, item.color, number))
    // También restaura el valor visible si localStorage rechaza la escritura.
    input.value = String(cartState.getSnapshot().items.find((row) => row.id === item.id && row.color === item.color)?.cantidad ?? item.cantidad)
  }
  async function pay() {
    if (submitting.current || receipt) return
    submitting.current = true
    setBusy(true)
    setError('')
    setMessage('')
    attempt.current ??= crypto.randomUUID()
    try {
      const run = () => checkout.pay(result, attempt.current!)
      // Chrome coordina las compras React entre pestañas del mismo origen.
      const response = navigator.locks ? await navigator.locks.request('albedo-checkout', run) : run()
      if (response.status === 'rechazado') {
        setError('Pago simulado rechazado. No se registró ninguna orden y tu carrito se conserva. Puedes volver a intentar.')
      } else {
        setReceipt(response.order)
        setWarning(response.warning)
      }
    } catch (cause) {
      setError(`No se pudo completar la compra. El carrito se conserva. ${cause instanceof Error ? cause.message : 'Revisa el almacenamiento e inténtalo de nuevo.'}`)
    } finally {
      submitting.current = false
      setBusy(false)
    }
  }
  function retryCleanup() {
    if (!receipt) return
    try { setWarning(checkout.finish(receipt).warning); setError('') }
    catch { setError('No se pudo leer el carrito para completar su limpieza. La orden ya está guardada; no repitas el pago.') }
  }

  return (
    <main className="container py-5 carrito-page">
      <p className="etiqueta">ALBEDO OUTDOOR</p>
      <h1 className="fs-1 mb-4">Carrito de compras</h1>
      {(storageError || error) && <div className="alert alert-danger" role="alert">{storageError || error}
        {storageError && <button type="button" className="btn btn-outline-secondary ms-2" onClick={cartState.refresh}>Reintentar lectura</button>}
      </div>}
      {message && <p role="status" className="alert alert-secondary">{message}</p>}
      {receipt && <section className="alert alert-success" role="status" aria-label="Confirmación de compra">
        <h2 className="h4">Compra simulada aprobada</h2>
        <p>Orden <strong>{receipt.numeroOrden}</strong> guardada. Total: {formatPrice(receipt.total)}. No se realizó ningún cobro real.</p>
        {warning && <p className="alert alert-warning">{warning}</p>}
        {warning ? <button type="button" className="btn btn-outline-secondary" onClick={retryCleanup}>Reintentar limpieza del carrito</button>
          : <Link className="btn btn-primary" to="/productos.html">Seguir comprando</Link>}
      </section>}
      {!items.length && !storageError && !receipt && <div className="alert alert-secondary" role="status">
        Tu carrito está vacío. <Link to="/productos.html">Ver productos</Link>
      </div>}
      {items.length > 0 && <>
        <div className="table-responsive">
          <table className="table align-middle carrito-tabla">
            <caption className="visually-hidden">Productos y variantes del carrito de compras</caption>
            <thead><tr>{['Producto', 'Color', 'Precio', 'Cantidad', 'Subtotal', 'Acciones'].map((label) => <th key={label} scope="col">{label}</th>)}</tr></thead>
            <tbody>{items.map((item) => <tr key={JSON.stringify([item.id, item.color])}>
              <td data-label="Producto"><div className="carrito-producto">
                <img src={productImageUrl(item.imagen)} alt={item.nombre} width={60} height={70} />
                <span>{item.nombre}</span>
              </div></td>
              <td data-label="Color">{item.color || 'Sin especificar'}</td>
              <td data-label="Precio">{formatPrice(item.precio)}</td>
              <td data-label="Cantidad"><input className="form-control carrito-input-cantidad" type="number" min={1} step={1}
                value={item.cantidad} aria-label={`Cantidad de ${item.nombre}, ${item.color || 'sin color'}`}
                disabled={busy || !!storageError || !!receipt} onChange={(event) => quantity(item, event.currentTarget)} /></td>
              <td data-label="Subtotal">{formatPrice(item.precio * item.cantidad)}</td>
              <td data-label="Acciones"><button type="button" className="btn btn-outline-danger btn-sm"
                aria-label={`Eliminar ${item.nombre}, ${item.color || 'sin color'}`}
                disabled={busy || !!storageError || !!receipt}
                onClick={() => change(() => cartRepository.remove(item.id, item.color), 'Producto eliminado del carrito.')}>Eliminar</button></td>
            </tr>)}</tbody>
          </table>
        </div>
        <div className="carrito-resumen">
          <button type="button" className="btn btn-outline-secondary" disabled={busy || !!storageError || !!receipt}
            onClick={() => change(cartRepository.clear, 'Carrito vaciado.')}>Vaciar carrito</button>
          <p className="carrito-total fw-bold mb-0" aria-live="polite">Total: {formatPrice(total)}</p>
        </div>
        {!receipt && <section className="carrito-pago mt-4" aria-labelledby="pago-titulo">
          <h2 id="pago-titulo" className="h4">Pago simulado · demostración académica</h2>
          <p>No se solicitan datos bancarios ni se realizan cobros reales. Elige el resultado para probar ambos escenarios.</p>
          <label htmlFor="resultado-pago" className="form-label">Resultado de la demostración</label>
          <select id="resultado-pago" className="form-select" value={result} disabled={busy} onChange={(event) => setResult(event.target.value as PaymentResult)}>
            <option value="aprobado">Pago aprobado</option><option value="rechazado">Pago rechazado</option>
          </select>
          <button type="button" className="btn btn-primary mt-3" disabled={busy || !!storageError} onClick={pay}>
            {busy ? 'Procesando demostración…' : 'Finalizar compra'}
          </button>
        </section>}
      </>}
    </main>
  )
}
