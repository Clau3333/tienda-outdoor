import { act } from 'react'
import { createRoot } from 'react-dom/client'
import type { Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { createStorageMock, cartItem } from './storageMock'
import { registrationFixture } from './registrationFixture'
import { createCartRepository } from '../../src/services/cartRepository'
import { createCheckoutService, ORDERS_KEY } from '../../src/services/checkoutService'
import { deliveryFor, emptyDelivery, validateDelivery, ordersFor, changeOrderStatus, saveManagedUser } from '../../src/services/commerceService'
import type { Delivery } from '../../src/services/commerceService'
import type { SessionUser } from '../../src/services/sessionState'
import DeliveryForm from '../../src/components/DeliveryForm'
import ProductoDetalle from '../../src/pages/ProductoDetalle'
import ProductCard from '../../src/components/ProductCard'
import { productosBase } from '../../src/data/products'
import Contenido from '../../src/pages/Contenido'

describe('EP2: entrega, permisos y pedidos', () => {
  const client: SessionUser = { run: '111111111', nombre: 'María', apellidos: 'Pérez Soto', correo: 'maria@duoc.cl', tipoUsuario: 'Cliente' }
  const admin: SessionUser = { ...client, correo: 'admin@duoc.cl', tipoUsuario: 'Administrador' }
  const delivery: Delivery = { ...emptyDelivery, nombre: 'María', apellidos: 'Pérez', correo: 'maria@duoc.cl', telefono: '912345678', metodo: 'retiro' }
  let mock: ReturnType<typeof createStorageMock>
  beforeEach(() => { mock = createStorageMock() })
  it('EP2-01 requiere datos personales incluso con retiro', () => { expect(validateDelivery(emptyDelivery)).not.toBe(''); expect(validateDelivery(delivery)).toBe('') })
  it('EP2-02 domicilio requiere región y comuna coherentes', () => {
    expect(validateDelivery({ ...delivery, metodo: 'domicilio' })).not.toBe('')
    expect(validateDelivery({ ...delivery, metodo: 'domicilio', region: 'Biobío', comuna: 'Concepción', calle: 'Calle de prueba', numero: '123' })).toBe('')
    expect(validateDelivery({ ...delivery, metodo: 'domicilio', region: 'Biobío', comuna: 'inexistente', calle: 'Calle', numero: '123' })).not.toBe('')
  })
  it('EP2-03 autocompleta desde el usuario y conserva dirección registrada', () => {
    mock.values.set('usuariosAlbedo', JSON.stringify([registrationFixture]))
    const filled = deliveryFor(mock.storage, client)
    expect(filled.correo).toBe(client.correo); expect(filled.calle).toBe(registrationFixture.calle); expect(filled.numero).toBe('1234')
  })
  it('EP2-04 invitado inicia sin datos personales', () => { expect(deliveryFor(mock.storage, null)).toEqual(emptyDelivery) })
  it('EP2-05 compra inválida conserva carrito y no crea orden', () => {
    const cart = createCartRepository(mock.storage); cart.add(cartItem)
    expect(() => createCheckoutService(mock.storage, cart).pay('aprobado', 'invalido', emptyDelivery)).toThrow()
    expect(cart.list().length).toBe(1); expect(mock.values.has(ORDERS_KEY)).toBeFalse()
  })
  it('EP2-06 rechazo seguido de aprobación conserva entrega y no duplica en reintento', () => {
    const cart = createCartRepository(mock.storage); cart.add(cartItem)
    const checkout = createCheckoutService(mock.storage, cart)
    expect(checkout.pay('rechazado', 'intento', delivery).status).toBe('rechazado')
    expect(cart.list().length).toBe(1)
    checkout.pay('aprobado', 'intento', delivery); checkout.pay('aprobado', 'intento', delivery)
    const saved = JSON.parse(mock.values.get(ORDERS_KEY)!)
    expect(saved.length).toBe(1); expect(saved[0].entrega).toEqual(delivery); expect(cart.list()).toEqual([])
  })
  function buy() { const cart = createCartRepository(mock.storage); cart.add(cartItem); return createCheckoutService(mock.storage, cart).pay('aprobado', 'pedido', delivery) }
  it('EP2-07 cliente solo obtiene sus pedidos, visitante ninguno', () => { buy(); expect(ordersFor(mock.storage, client).length).toBe(1); expect(ordersFor(mock.storage, { ...client, correo: 'otro@duoc.cl' })).toEqual([]); expect(ordersFor(mock.storage, null)).toEqual([]) })
  it('EP2-08 vendedor consulta pero no cambia estados', () => { const result = buy(); const seller = { ...admin, tipoUsuario: 'Vendedor' as const }; expect(ordersFor(mock.storage, seller).length).toBe(1); if (result.status === 'aprobado') expect(() => changeOrderStatus(mock.storage, seller, result.order.id, 'Enviado')).toThrow() })
  it('EP2-09 administrador actualiza estado y rechaza valores arbitrarios', () => { const result = buy(); if (result.status !== 'aprobado') throw new Error('Sin orden'); changeOrderStatus(mock.storage, admin, result.order.id, 'Enviado'); expect(ordersFor(mock.storage, client)[0].estado).toBe('Enviado'); expect(() => changeOrderStatus(mock.storage, admin, result.order.id, 'Inventado')).toThrow() })
  it('EP2-10 usuarios corruptos y rol cliente no permiten altas administrativas', () => { expect(() => saveManagedUser(mock.storage, client, registrationFixture, 'Administrador')).toThrow(); mock.values.set('usuariosAlbedo', '{corrupto'); expect(() => saveManagedUser(mock.storage, admin, registrationFixture, 'Cliente')).toThrow(); expect(mock.values.get('usuariosAlbedo')).toBe('{corrupto') })
  it('EP2-11 administrador crea vendedor, evita duplicados y conserva datos', () => { saveManagedUser(mock.storage, admin, registrationFixture, 'Vendedor'); expect(JSON.parse(mock.values.get('usuariosAlbedo')!)[0].tipoUsuario).toBe('Vendedor'); expect(() => saveManagedUser(mock.storage, admin, registrationFixture, 'Cliente')).toThrow(); expect(JSON.parse(mock.values.get('usuariosAlbedo')!).length).toBe(1) })
  it('EP2-16 correo de entrega distinto no cambia la propiedad del pedido autenticado', () => {
    mock.values.set('usuarioSesionAlbedo', JSON.stringify(client))
    const cart = createCartRepository(mock.storage); cart.add(cartItem)
    createCheckoutService(mock.storage, cart).pay('aprobado', 'destinatario', { ...delivery, correo: 'destinatario@duoc.cl' })
    const saved = ordersFor(mock.storage, client)
    expect(saved.length).toBe(1); expect(saved[0].entrega!.correo).toBe('destinatario@duoc.cl'); expect(saved[0].cliente.correo).toBe(client.correo)
  })
})

describe('EP2: renderizado, props, eventos y condiciones React', () => {
  let container: HTMLDivElement, root: Root
  beforeEach(() => { container = document.createElement('div'); document.body.append(container); root = createRoot(container) })
  afterEach(() => { act(() => root.unmount()); container.remove() })
  it('EP2-12 ficha por ID renderiza nombre real y enlace React', () => { act(() => root.render(<MemoryRouter initialEntries={['/producto-detalle.html?id=chaqueta-cordillera']}><ProductoDetalle /></MemoryRouter>)); expect(container.querySelector('h1')!.textContent).toBe('Chaqueta Cordillera'); expect(container.querySelector('#detalleImagen')).not.toBeNull() })
  it('EP2-13 ID inexistente muestra error y acceso al catálogo', () => { act(() => root.render(<MemoryRouter initialEntries={['/producto-detalle.html?id=inexistente']}><ProductoDetalle /></MemoryRouter>)); expect(container.textContent).toContain('Producto no encontrado'); expect(container.querySelector('a')!.href).toContain('/productos.html') })
  it('EP2-14 props de entrega condicionan la dirección y ejecutan callback', () => { const onChange = jasmine.createSpy('onChange'); act(() => root.render(<DeliveryForm value={{ ...emptyDelivery, metodo: 'retiro' }} onChange={onChange} disabled={false} />)); expect(container.querySelector('#compra-calle')).toBeNull(); act(() => { const select = container.querySelector<HTMLSelectElement>('#compra-metodo')!; select.value = 'domicilio'; select.dispatchEvent(new Event('change', { bubbles: true })) }); expect(onChange).toHaveBeenCalledWith(jasmine.objectContaining({ metodo: 'domicilio' })) })
  it('EP2-15 evento de compra usa producto y actualiza estado visible', () => { const onAdd = jasmine.createSpy('onAdd'); act(() => root.render(<ProductCard product={productosBase[0]} onAdd={onAdd} />)); act(() => container.querySelector<HTMLButtonElement>('.catalogo-agregar-carrito')!.click()); expect(onAdd).toHaveBeenCalledWith(jasmine.objectContaining({ id: productosBase[0].id, precio: productosBase[0].precio })); expect(container.textContent).toContain('Añadido') })
  it('EP2-17 una ruta con nombre heredado de Object no provoca una excepción', () => { act(() => root.render(<MemoryRouter initialEntries={['/constructor.html']}><Contenido /></MemoryRouter>)); expect(container.textContent).toContain('Página no encontrada') })
})
