import type { StoragePort } from '../data/productTypes.ts'
import { createCartRepository, type CartItem } from './cartRepository.ts'
import { validateDelivery } from './commerceService.ts'
import type { Delivery } from './commerceService.ts'

export const ORDERS_KEY = 'ordenesAlbedo'
export const SESSION_KEY = 'usuarioSesionAlbedo'
export type PaymentResult = 'aprobado' | 'rechazado'
export type Order = {
  id: string; numeroOrden: string; fecha: string; fechaTexto: string; estado: string
  cliente: { nombre: string; apellidos: string; correo: string; run: string }
  productos: (CartItem & { subtotal: number })[]; total: number
  pagoSimulado: { resultado: 'aprobado'; intentoId: string; limpiezaPendiente: boolean }
  entrega?: Delivery
}
type SavedOrder = Partial<Order> & Record<string, unknown>

export function createCheckoutService(storage: StoragePort, cart: ReturnType<typeof createCartRepository>,
  now = () => new Date()) {
  function orders(): SavedOrder[] {
    const raw = storage.getItem(ORDERS_KEY)
    const rows: unknown = raw === null ? [] : JSON.parse(raw)
    if (!Array.isArray(rows) || !rows.every((row) => row && typeof row === 'object' && !Array.isArray(row))) {
      throw new Error('No se pudieron leer las órdenes anteriores. No se ha realizado la compra ni sobrescrito tus datos.')
    }
    return rows
  }
  function customer(): Order['cliente'] {
    const raw = storage.getItem(SESSION_KEY)
    const user = raw === null ? null : JSON.parse(raw)
    if (user !== null && (typeof user !== 'object' || Array.isArray(user))) throw new Error('La sesión guardada no es válida.')
    const field = (key: string) => typeof user?.[key] === 'string' ? user[key] : ''
    return { nombre: user ? field('nombre') : 'Cliente', apellidos: field('apellidos'),
      correo: user ? field('correo') : 'Sin sesión', run: field('run') }
  }
  function finish(order: Order) {
    const saved = orders()
    const index = saved.findIndex((row) => row.id === order.id && row.pagoSimulado?.intentoId === order.pagoSimulado.intentoId)
    if (index === -1) throw new Error('No se encontró la orden guardada. El carrito no se ha vaciado.')
    const persisted = saved[index] as Order
    if (!persisted.pagoSimulado.limpiezaPendiente) {
      return { status: 'aprobado' as const, order: persisted, cartCleared: true, warning: '' }
    }
    const current = cart.list()
    // Si cambió el carrito durante un error de almacenamiento, no borrar productos nuevos.
    const purchased = order.productos.map(({ id, nombre, precio, imagen, color, cantidad }) =>
      ({ id, nombre, precio, imagen, color, cantidad }))
    const sameCart = current.length === purchased.length && current.every((item, index) => {
      const other = purchased[index]
      return Object.keys(other).every((key) => item[key as keyof CartItem] === other[key as keyof CartItem])
    })
    if (current.length && !sameCart) return { status: 'aprobado' as const, order, cartCleared: false,
      warning: 'La orden ya está guardada. El carrito cambió y se conservó para evitar perder productos. No repitas este pago.' }
    try { if (current.length) cart.clear() }
    catch { return { status: 'aprobado' as const, order, cartCleared: false,
      warning: 'Compra guardada, pero no se pudo vaciar el carrito. Reintenta la limpieza; no se generará otra orden.' } }
    const completed = { ...persisted, pagoSimulado: { ...persisted.pagoSimulado, limpiezaPendiente: false } }
    saved[index] = completed
    try { storage.setItem(ORDERS_KEY, JSON.stringify(saved)) }
    catch { return { status: 'aprobado' as const, order, cartCleared: true,
      warning: 'La orden está guardada y el carrito se vació. Falta confirmar su limpieza en el almacenamiento; reintenta antes de otra compra.' } }
    return { status: 'aprobado' as const, order: completed, cartCleared: true, warning: '' }
  }
  return {
    finish,
    pay(result: PaymentResult, attemptId: string, delivery?: Delivery) {
      if (result !== 'aprobado' && result !== 'rechazado') throw new Error('Selecciona un resultado de demostración válido.')
      if (!attemptId) throw new Error('Falta el identificador del intento.')
      const previous = orders()
      const existing = previous.find((order) => order.pagoSimulado?.intentoId === attemptId)
      if (existing) return finish(existing as Order)
      if (delivery && validateDelivery(delivery)) throw new Error(validateDelivery(delivery))
      const items = cart.list()
      if (!items.length) throw new Error('Agrega productos antes de finalizar la compra.')
      if (result === 'rechazado') return { status: 'rechazado' as const }
      // Recupera una compra guardada cuya limpieza falló, incluso después de recargar.
      // No crea una segunda orden para ese mismo carrito pendiente.
      const pending = previous.find((row) => row.pagoSimulado?.limpiezaPendiente &&
        Array.isArray(row.productos) && row.productos.length === items.length &&
        row.productos.every((product, index) => {
          const item = items[index]
          return product.id === item.id && product.color === item.color &&
            product.cantidad === item.cantidad && product.precio === item.precio
        }))
      if (pending) return finish(pending as Order)
      const date = now()
      const largest = previous.reduce((max, order) => {
        const match = String(order.numeroOrden ?? '').match(/ORD-(\d+)/)
        return Math.max(max, match ? Number(match[1]) : 0)
      }, 0)
      if (!Number.isSafeInteger(largest + 1)) throw new Error('No se pudo generar un número de orden válido.')
      const productos = items.map((item) => ({ ...item, subtotal: item.precio * item.cantidad }))
      const total = productos.reduce((sum, item) => sum + item.subtotal, 0)
      if (!Number.isFinite(total)) throw new Error('El total no es válido.')
      const buyer = customer()
      const order: Order = {
        id: `orden-${date.getTime()}-${attemptId}`, numeroOrden: `ORD-${String(largest + 1).padStart(4, '0')}`,
        fecha: date.toISOString(), fechaTexto: date.toLocaleString('es-CL'), estado: 'Pendiente',
        cliente: buyer.correo && buyer.correo !== 'Sin sesión' ? buyer : { ...buyer, ...(delivery ? { nombre: delivery.nombre.trim(), apellidos: delivery.apellidos.trim(), correo: delivery.correo.trim().toLowerCase() } : {}) },
        ...(delivery ? { entrega: structuredClone(delivery) } : {}),
        productos, total, pagoSimulado: { resultado: 'aprobado', intentoId: attemptId, limpiezaPendiente: true },
      }
      storage.setItem(ORDERS_KEY, JSON.stringify([...previous, order]))
      return finish(order)
    },
  }
}
