import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFile, access } from 'node:fs/promises'
import vm from 'node:vm'
import { createCartRepository, CART_KEY } from '../src/services/cartRepository.ts'
import { createCartState } from '../src/services/cartState.ts'
import { createCheckoutService, ORDERS_KEY, SESSION_KEY } from '../src/services/checkoutService.ts'
import { productImageUrl } from '../src/services/productSelection.ts'

const item = { id: 'chaqueta-cordillera', nombre: 'Chaqueta Cordillera', precio: 59990,
  imagen: 'img/chaqueta-cordillera.png', color: 'Negro', cantidad: 1 }
function setup() {
  const data = new Map()
  const storage = { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => { data.set(key, value) } }
  const state = createCartState(storage)
  const cart = state.repository
  const checkout = createCheckoutService(storage, cart, () => new Date('2026-11-04T12:00:00Z'))
  return { data, storage, state, cart, checkout }
}
test('agregar suma unidades de la misma variante; colores distintos permanecen separados', () => {
  const { cart } = setup()
  cart.add(item); cart.add(item); cart.add({ ...item, color: 'Naranja' })
  assert.deepEqual(cart.list().map((row) => [row.color, row.cantidad]), [['Negro', 2], ['Naranja', 1]])
})
test('aumentar y disminuir actualiza inmediatamente cantidades, contador y total', () => {
  const { cart, state } = setup()
  cart.add(item)
  cart.updateQuantity(item.id, item.color, 3)
  assert.equal(state.getSnapshot().total, 179970)
  assert.equal(state.getSnapshot().count, 3)
  cart.updateQuantity(item.id, item.color, 1)
  assert.equal(state.getSnapshot().items[0].cantidad, 1)
  assert.equal(state.getSnapshot().total, 59990)
})
test('rechaza cantidades inválidas sin modificar almacenamiento', () => {
  const { cart, data } = setup(); cart.add(item)
  const original = data.get(CART_KEY)
  for (const value of [0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1, '2']) {
    assert.throws(() => cart.updateQuantity(item.id, item.color, value))
    assert.throws(() => cart.add({ ...item, cantidad: value }))
    assert.equal(data.get(CART_KEY), original)
  }
})
test('eliminar respeta color; vaciar deja contador y total en cero', () => {
  const { cart, state } = setup(); cart.add(item); cart.add({ ...item, color: 'Naranja' })
  cart.remove(item.id, item.color)
  assert.equal(cart.list()[0].color, 'Naranja')
  cart.clear()
  assert.deepEqual(state.getSnapshot(), { items: [], count: 0, total: 0, error: '' })
})
test('otra instancia recupera productos y cantidades persistidos sin migrar claves', () => {
  const { cart, storage } = setup(); cart.add({ ...item, cantidad: 4 })
  assert.deepEqual(createCartRepository(storage).list(), [{ ...item, cantidad: 4 }])
})
test('cambios de otra pestaña con igual contador actualizan contenido; clear también', () => {
  const { state, storage, data } = setup(); state.repository.add(item)
  let updates = 0
  const unsubscribe = state.subscribe(() => updates++)
  const other = createCartRepository(storage)
  other.remove(item.id, item.color); other.add({ ...item, color: 'Naranja', precio: 100 })
  state.storageChanged(CART_KEY)
  assert.equal(state.getSnapshot().count, 1)
  assert.equal(state.getSnapshot().items[0].color, 'Naranja')
  assert.equal(state.getSnapshot().total, 100)
  assert.equal(updates, 1)
  data.clear(); state.storageChanged(null)
  assert.equal(state.getSnapshot().count, 0)
  unsubscribe()
})
test('snapshot estable, claves ajenas ignoradas y recuperación tras error de lectura', () => {
  const { state, data } = setup(); state.repository.add(item)
  const snapshot = state.getSnapshot()
  assert.equal(state.getSnapshot(), snapshot)
  data.set(CART_KEY, '{dañado'); state.storageChanged('otra-clave')
  assert.equal(state.getSnapshot(), snapshot)
  state.storageChanged(CART_KEY)
  assert.ok(state.getSnapshot().error)
  assert.equal(state.getSnapshot().count, 1)
  assert.equal(data.get(CART_KEY), '{dañado')
  data.set(CART_KEY, JSON.stringify([item])); state.refresh()
  assert.equal(state.getSnapshot().error, '')
})
test('JSON corrupto no se sobrescribe al agregar o comprar', () => {
  const { data, cart, checkout } = setup(); data.set(CART_KEY, '{corrupto')
  assert.throws(() => cart.add(item)); assert.throws(() => checkout.pay('aprobado', 'uno'))
  assert.equal(data.get(CART_KEY), '{corrupto'); assert.equal(data.has(ORDERS_KEY), false)
})
test('fallo de escritura conserva carrito y snapshot anteriores', () => {
  const { storage, state } = setup(); state.repository.add(item)
  storage.setItem = () => { throw new Error('QuotaExceededError') }
  assert.throws(() => state.repository.updateQuantity(item.id, item.color, 2))
  assert.equal(state.getSnapshot().count, 1)
  assert.equal(state.repository.list()[0].cantidad, 1)
})
test('pago rechazado conserva exactamente el carrito y no registra orden', () => {
  const { cart, checkout, data } = setup(); cart.add(item)
  const original = data.get(CART_KEY)
  assert.equal(checkout.pay('rechazado', 'rechazo').status, 'rechazado')
  assert.equal(data.get(CART_KEY), original); assert.equal(data.has(ORDERS_KEY), false)
  assert.equal(checkout.pay('aprobado', 'rechazo').status, 'aprobado')
})
test('carrito vacío y resultados inválidos no generan órdenes', () => {
  const { checkout, data } = setup()
  assert.throws(() => checkout.pay('aprobado', 'vacio'))
  assert.throws(() => checkout.pay('azar', 'invalido'))
  assert.equal(data.has(ORDERS_KEY), false)
})
test('pago aprobado conserva órdenes previas, sesión, variantes, subtotales y número correlativo', () => {
  const { cart, checkout, data, state } = setup()
  const old = { id: 'orden-antigua', numeroOrden: 'ORD-0042', campoAnterior: 'conservar' }
  data.set(ORDERS_KEY, JSON.stringify([old]))
  data.set(SESSION_KEY, JSON.stringify({ nombre: 'Claudio', apellidos: 'Prueba', correo: 'test@example.test', run: 'demo' }))
  cart.add({ ...item, cantidad: 2 }); cart.add({ ...item, color: 'Naranja' })
  const result = checkout.pay('aprobado', 'compra')
  assert.equal(result.order.numeroOrden, 'ORD-0043')
  assert.equal(result.order.estado, 'Pendiente')
  assert.equal(result.order.total, 179970)
  assert.deepEqual(result.order.productos.map((row) => row.subtotal), [119980, 59990])
  assert.equal(result.order.cliente.correo, 'test@example.test')
  assert.deepEqual(JSON.parse(data.get(ORDERS_KEY))[0], old)
  assert.equal(state.getSnapshot().count, 0)
  assert.equal(result.cartCleared, true)
  assert.equal(data.get(SESSION_KEY).includes('Claudio'), true)
})
test('invitado conserva formato de cliente original; doble ejecución no duplica orden', () => {
  const { cart, checkout, data } = setup(); cart.add(item)
  const first = checkout.pay('aprobado', 'mismo-intento')
  const second = checkout.pay('aprobado', 'mismo-intento')
  assert.equal(first.order.id, second.order.id)
  assert.deepEqual(first.order.cliente, { nombre: 'Cliente', apellidos: '', correo: 'Sin sesión', run: '' })
  assert.equal(JSON.parse(data.get(ORDERS_KEY)).length, 1)
})
test('fallo al guardar orden no vacía carrito ni borra órdenes anteriores', () => {
  const { cart, checkout, data, storage } = setup(); cart.add(item)
  data.set(ORDERS_KEY, '[]')
  const write = storage.setItem
  storage.setItem = (key, value) => { if (key === ORDERS_KEY) throw new Error('quota'); write(key, value) }
  assert.throws(() => checkout.pay('aprobado', 'fallo'))
  assert.equal(cart.list().length, 1); assert.equal(data.get(ORDERS_KEY), '[]')
})
test('orden guardada y fallo al vaciar permiten reintentar sin duplicar orden', () => {
  const { cart, checkout, storage, data } = setup(); cart.add(item)
  const write = storage.setItem
  storage.setItem = (key, value) => { if (key === CART_KEY) throw new Error('quota'); write(key, value) }
  const result = checkout.pay('aprobado', 'limpieza')
  assert.equal(result.cartCleared, false); assert.ok(result.warning)
  assert.equal(cart.list().length, 1)
  storage.setItem = write
  assert.equal(checkout.pay('aprobado', 'limpieza').cartCleared, true)
  assert.equal(JSON.parse(data.get(ORDERS_KEY)).length, 1)
})
test('reintento de limpieza conserva productos nuevos', () => {
  const { cart, checkout } = setup(); cart.add(item)
  const { order } = checkout.pay('aprobado', 'primero')
  cart.add({ ...item, color: 'Naranja' })
  assert.equal(checkout.finish(order).cartCleared, true)
  assert.equal(cart.list()[0].color, 'Naranja')
})
test('un intento completado no vacía un carrito nuevo idéntico', () => {
  const { cart, checkout } = setup(); cart.add(item)
  checkout.pay('aprobado', 'completado')
  cart.add(item)
  checkout.pay('aprobado', 'completado')
  assert.deepEqual(cart.list(), [item])
})
test('limpieza pendiente no elimina productos añadidos después del fallo', () => {
  const { cart, checkout, storage } = setup(); cart.add(item)
  const write = storage.setItem
  storage.setItem = (key, value) => { if (key === CART_KEY) throw new Error('quota'); write(key, value) }
  const result = checkout.pay('aprobado', 'pendiente-con-cambios')
  storage.setItem = write
  cart.add({ ...item, color: 'Naranja' })
  const retry = checkout.finish(result.order)
  assert.equal(retry.cartCleared, false)
  assert.ok(retry.warning.includes('cambió'))
  assert.equal(cart.list().length, 2)
})
test('fallo al confirmar limpieza conserva orden y permite terminar sin vaciar un carrito nuevo', () => {
  const { cart, checkout, storage, data } = setup(); cart.add(item)
  const write = storage.setItem
  let orderWrites = 0
  storage.setItem = (key, value) => {
    if (key === ORDERS_KEY && ++orderWrites === 2) throw new Error('quota')
    write(key, value)
  }
  const result = checkout.pay('aprobado', 'confirmar-limpieza')
  assert.equal(result.cartCleared, true)
  assert.ok(result.warning)
  assert.equal(cart.list().length, 0)
  storage.setItem = write
  assert.equal(checkout.finish(result.order).warning, '')
  cart.add(item)
  checkout.finish(result.order)
  assert.equal(cart.list().length, 1)
  assert.equal(JSON.parse(data.get(ORDERS_KEY)).length, 1)
})
test('recargar tras fallo de limpieza recupera la orden pendiente sin duplicarla', () => {
  const { cart, checkout, storage, data } = setup(); cart.add(item)
  const write = storage.setItem
  storage.setItem = (key, value) => { if (key === CART_KEY) throw new Error('quota'); write(key, value) }
  assert.equal(checkout.pay('aprobado', 'antes-de-recargar').cartCleared, false)
  storage.setItem = write
  const restored = createCheckoutService(storage, createCartRepository(storage))
  assert.equal(restored.pay('aprobado', 'despues-de-recargar').cartCleared, true)
  assert.equal(JSON.parse(data.get(ORDERS_KEY)).length, 1)
  assert.equal(cart.list().length, 0)
})
test('órdenes corruptas y sesión corrupta bloquean compra sin perder datos', () => {
  for (const key of [ORDERS_KEY, SESSION_KEY]) {
    const { cart, checkout, data } = setup(); cart.add(item); data.set(key, '{corrupto')
    assert.throws(() => checkout.pay('aprobado', 'error'))
    assert.equal(data.get(key), '{corrupto'); assert.equal(cart.list().length, 1)
  }
})
test('orden React es legible por las funciones originales sin alterar el sitio antiguo', async () => {
  const { cart, checkout, storage } = setup(); cart.add(item)
  const result = checkout.pay('aprobado', 'legacy')
  const source = await readFile(new URL('../../Sitio Old/carrito.js', import.meta.url), 'utf8')
  const context = vm.createContext({ localStorage: storage, document: { addEventListener() {} } })
  vm.runInContext(source, context)
  assert.equal(vm.runInContext('obtenerOrdenes()[0].total', context), result.order.total)
  assert.equal(vm.runInContext('generarNumeroOrden(obtenerOrdenes())', context), 'ORD-0002')
})
test('rutas de imágenes relativas y prefijadas no duplican el directorio; todos los originales existen', async () => {
  assert.equal(productImageUrl('img/a.png'), '/Sitio%20Old/img/a.png')
  assert.equal(productImageUrl('/Sitio%20Old/img/a.png'), '/Sitio%20Old/img/a.png')
  assert.equal(productImageUrl('https://example.test/a.png'), 'https://example.test/a.png')
  const source = await readFile(new URL('../../Sitio Old/productos.js', import.meta.url), 'utf8')
  const products = vm.runInNewContext(source + '\nproductosBase', { localStorage: { getItem: () => null } })
  for (const product of products) {
    for (const path of [product.imagen, ...(product.colores ?? []).map((color) => color.imagen)]) {
      await access(new URL(`../../Sitio Old/${path}`, import.meta.url))
    }
  }
})
