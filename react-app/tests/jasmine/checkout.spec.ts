import { CART_KEY, createCartRepository } from '../../src/services/cartRepository'
import { createCheckoutService, ORDERS_KEY, SESSION_KEY } from '../../src/services/checkoutService'
import { cartItem, createStorageMock } from './storageMock'

describe('Checkout: pago simulado y órdenes compatibles', () => {
  let mock: ReturnType<typeof createStorageMock>
  let cart: ReturnType<typeof createCartRepository>
  let checkout: ReturnType<typeof createCheckoutService>
  beforeEach(() => {
    mock = createStorageMock()
    cart = createCartRepository(mock.storage)
    const now = jasmine.createSpy('now').and.returnValue(new Date('2026-11-04T12:00:00Z'))
    checkout = createCheckoutService(mock.storage, cart, now)
  })

  it('PAG-01 un carrito vacío impide registrar una compra', () => {
    expect(() => checkout.pay('aprobado', 'vacio')).toThrowError(/Agrega productos/)
    expect(mock.storage.setItem).not.toHaveBeenCalled()
  })
  it('PAG-02 rechazar conserva exactamente productos y cantidades sin registrar orden', () => {
    cart.add({ ...cartItem, cantidad: 2 })
    const saved = mock.values.get(CART_KEY)
    mock.storage.setItem.calls.reset()
    expect(checkout.pay('rechazado', 'rechazo').status).toBe('rechazado')
    expect(mock.values.get(CART_KEY)).toBe(saved)
    expect(mock.values.has(ORDERS_KEY)).toBeFalse()
    expect(mock.storage.setItem).not.toHaveBeenCalled()
  })
  it('PAG-03 aprobar guarda variantes, subtotales, total y fecha antes de vaciar', () => {
    cart.add({ ...cartItem, cantidad: 2 }); cart.add({ ...cartItem, color: 'Naranja' })
    mock.storage.setItem.calls.reset()
    const response = checkout.pay('aprobado', 'compra')
    if (response.status !== 'aprobado') { fail('Se esperaba aprobación'); return }
    expect(response.order.numeroOrden).toBe('ORD-0001')
    expect(response.order.fecha).toBe('2026-11-04T12:00:00.000Z')
    expect(response.order.estado).toBe('Pendiente')
    expect(response.order.productos.map((item) => item.subtotal)).toEqual([119980, 59990])
    expect(response.order.productos.map((item) => item.color)).toEqual(['Negro', 'Naranja'])
    expect(response.order.total).toBe(179970)
    expect(response.cartCleared).toBeTrue()
    expect(cart.list()).toEqual([])
    expect(mock.storage.setItem.calls.argsFor(0)[0]).toBe(ORDERS_KEY)
    expect(mock.storage.setItem.calls.argsFor(1)).toEqual([CART_KEY, '[]'])
  })
  it('PAG-04 conserva órdenes anteriores y genera el siguiente número', () => {
    const oldOrder = { id: 'anterior', numeroOrden: 'ORD-0042', datoAnterior: 'conservar' }
    mock.values.set(ORDERS_KEY, JSON.stringify([oldOrder]))
    cart.add(cartItem)
    const response = checkout.pay('aprobado', 'correlativo')
    if (response.status !== 'aprobado') { fail('Se esperaba aprobación'); return }
    expect(response.order.numeroOrden).toBe('ORD-0043')
    expect(JSON.parse(mock.values.get(ORDERS_KEY)!)[0]).toEqual(oldOrder)
  })
  it('PAG-05 utiliza la sesión original sin cambiar sus datos', () => {
    const session = JSON.stringify({ nombre: 'Cliente', apellidos: 'Académico', correo: 'prueba@example.test', run: 'demo' })
    mock.values.set(SESSION_KEY, session)
    cart.add(cartItem)
    const response = checkout.pay('aprobado', 'sesion')
    if (response.status !== 'aprobado') { fail('Se esperaba aprobación'); return }
    expect(response.order.cliente.correo).toBe('prueba@example.test')
    expect(mock.values.get(SESSION_KEY)).toBe(session)
  })
  it('PAG-06 ejecutar dos veces el mismo intento no duplica la orden', () => {
    cart.add(cartItem)
    checkout.pay('aprobado', 'mismo-intento')
    checkout.pay('aprobado', 'mismo-intento')
    expect(JSON.parse(mock.values.get(ORDERS_KEY)!).length).toBe(1)
  })
  it('PAG-07 fallar al guardar una orden conserva el carrito y las órdenes anteriores', () => {
    cart.add(cartItem)
    mock.values.set(ORDERS_KEY, '[]')
    mock.storage.setItem.and.callFake((key, value) => {
      if (key === ORDERS_KEY) throw new Error('Cuota agotada')
      mock.values.set(key, value)
    })
    expect(() => checkout.pay('aprobado', 'fallo-orden')).toThrowError()
    expect(cart.list()).toEqual([cartItem])
    expect(mock.values.get(ORDERS_KEY)).toBe('[]')
  })
  it('PAG-08 recuperar una limpieza fallida tras recargar no crea otra orden', () => {
    cart.add(cartItem)
    mock.storage.setItem.and.callFake((key, value) => {
      if (key === CART_KEY) throw new Error('No se pudo vaciar')
      mock.values.set(key, value)
    })
    const first = checkout.pay('aprobado', 'antes-recarga')
    if (first.status !== 'aprobado') { fail('Se esperaba aprobación guardada'); return }
    expect(first.cartCleared).toBeFalse()
    expect(first.warning).not.toBe('')
    mock.storage.setItem.and.callFake((key, value) => { mock.values.set(key, value) })
    const reloaded = createCheckoutService(mock.storage, createCartRepository(mock.storage))
    const second = reloaded.pay('aprobado', 'despues-recarga')
    if (second.status !== 'aprobado') { fail('Se esperaba recuperación'); return }
    expect(second.order.id).toBe(first.order.id)
    expect(second.cartCleared).toBeTrue()
    expect(JSON.parse(mock.values.get(ORDERS_KEY)!).length).toBe(1)
  })
  it('PAG-09 órdenes corruptas bloquean la compra sin sobrescribirlas', () => {
    cart.add(cartItem)
    mock.values.set(ORDERS_KEY, '{corrupto')
    expect(() => checkout.pay('aprobado', 'datos-invalidos')).toThrowError()
    expect(mock.values.get(ORDERS_KEY)).toBe('{corrupto')
    expect(cart.list()).toEqual([cartItem])
  })
  it('PAG-10 después de un rechazo se puede aprobar sin perder las cantidades', () => {
    cart.add({ ...cartItem, cantidad: 3 })
    checkout.pay('rechazado', 'reintento')
    const response = checkout.pay('aprobado', 'reintento')
    if (response.status !== 'aprobado') { fail('Se esperaba aprobación'); return }
    expect(response.order.total).toBe(179970)
    expect(response.order.productos[0].cantidad).toBe(3)
    expect(JSON.parse(mock.values.get(ORDERS_KEY)!).length).toBe(1)
  })
})
