import { CART_KEY, createCartRepository } from '../../src/services/cartRepository'
import { createCartState } from '../../src/services/cartState'
import { cartItem, createStorageMock } from './storageMock'

describe('Carrito: variantes, cantidades, totales y persistencia', () => {
  let mock: ReturnType<typeof createStorageMock>
  let state: ReturnType<typeof createCartState>
  let cart: ReturnType<typeof createCartRepository>
  beforeEach(() => { mock = createStorageMock(); state = createCartState(mock.storage); cart = state.repository })

  it('CAR-01 inicia vacío con cero unidades y total cero', () => {
    expect(state.getSnapshot()).toEqual({ items: [], count: 0, total: 0, error: '' })
  })
  it('CAR-02 agregar la misma variante acumula unidades sin duplicar filas', () => {
    cart.add(cartItem); cart.add(cartItem)
    expect(cart.list()).toEqual([{ ...cartItem, cantidad: 2 }])
    expect(state.getSnapshot().count).toBe(2)
  })
  it('CAR-03 los colores diferentes se conservan como variantes independientes', () => {
    cart.add(cartItem); cart.add({ ...cartItem, color: 'Naranja' })
    expect(cart.list().map((item) => item.color)).toEqual(['Negro', 'Naranja'])
    expect(state.getSnapshot().count).toBe(2)
  })
  it('CAR-04 aumentar y disminuir sincroniza cantidades, subtotales y total', () => {
    cart.add(cartItem)
    cart.updateQuantity(cartItem.id, cartItem.color, 3)
    const snapshot = state.getSnapshot()
    expect(snapshot.items[0].cantidad * snapshot.items[0].precio).toBe(179970)
    expect(snapshot.total).toBe(179970)
    expect(snapshot.count).toBe(3)
    cart.updateQuantity(cartItem.id, cartItem.color, 1)
    expect(state.getSnapshot().total).toBe(59990)
    expect(state.getSnapshot().count).toBe(1)
  })
  it('CAR-05 rechaza cero, negativos, decimales y no numéricos sin modificar persistencia', () => {
    cart.add(cartItem)
    const saved = mock.values.get(CART_KEY)
    for (const quantity of [0, -2, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
      expect(() => cart.updateQuantity(cartItem.id, cartItem.color, quantity)).toThrowError()
      expect(mock.values.get(CART_KEY)).toBe(saved)
    }
  })
  it('CAR-06 eliminar una variante conserva las demás y vaciar reinicia los totales', () => {
    cart.add(cartItem); cart.add({ ...cartItem, color: 'Naranja' })
    cart.remove(cartItem.id, cartItem.color)
    expect(cart.list()).toEqual([{ ...cartItem, color: 'Naranja' }])
    cart.clear()
    expect(state.getSnapshot().items).toEqual([])
    expect(state.getSnapshot().count).toBe(0)
    expect(state.getSnapshot().total).toBe(0)
  })
  it('CAR-07 una nueva instancia recupera cantidades desde la clave original', () => {
    cart.add({ ...cartItem, cantidad: 4 })
    expect(createCartRepository(mock.storage).list()).toEqual([{ ...cartItem, cantidad: 4 }])
    expect(mock.storage.setItem).toHaveBeenCalledWith('carritoAlbedo', jasmine.any(String))
  })
  it('CAR-08 una notificación de almacenamiento actualiza variantes aunque no cambie el contador', () => {
    cart.add(cartItem)
    const listener = jasmine.createSpy('listener')
    const unsubscribe = state.subscribe(listener)
    mock.values.set(CART_KEY, JSON.stringify([{ ...cartItem, color: 'Naranja', precio: 40000 }]))
    state.storageChanged(CART_KEY)
    expect(state.getSnapshot().count).toBe(1)
    expect(state.getSnapshot().items[0].color).toBe('Naranja')
    expect(state.getSnapshot().total).toBe(40000)
    expect(listener).toHaveBeenCalledTimes(1)
    unsubscribe()
  })
  it('CAR-09 una cuota agotada conserva los datos y el snapshot anteriores', () => {
    cart.add(cartItem)
    mock.storage.setItem.and.throwError('QuotaExceededError')
    expect(() => cart.updateQuantity(cartItem.id, cartItem.color, 5)).toThrowError()
    expect(cart.list()).toEqual([cartItem])
    expect(state.getSnapshot().count).toBe(1)
  })
  it('CAR-10 un JSON corrupto muestra error sin destruir el carrito conocido ni sobrescribir datos', () => {
    cart.add(cartItem)
    mock.values.set(CART_KEY, '{corrupto')
    state.storageChanged(CART_KEY)
    expect(state.getSnapshot().error).not.toBe('')
    expect(state.getSnapshot().items).toEqual([cartItem])
    expect(mock.values.get(CART_KEY)).toBe('{corrupto')
  })
})
