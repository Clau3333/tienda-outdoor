import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Header from '../../src/components/Header'
import Login from '../../src/pages/Login'
import ThemeProvider from '../../src/theme/ThemeProvider'
import { LOGIN_SESSION_KEY, USERS_KEY } from '../../src/services/loginService'
import { sessionState } from '../../src/services/sessionStore'
import { createStorageMock } from './storageMock'

describe('Header: sesión real, navegación y eventos de almacenamiento', () => {
  const account = { run: '111111111', nombre: 'Amalia', apellidos: 'Pérez', correo: 'amalia@duoc.cl', tipoUsuario: 'Cliente', contrasena: 'Cumbre2026#' }
  let mock: ReturnType<typeof createStorageMock>
  let storage: ReturnType<typeof createStorageMock>['storage'] & { removeItem: jasmine.Spy }
  let container: HTMLDivElement
  let root: Root
  let previousTheme: string | undefined
  let previousScheme: string
  let redirect: jasmine.Spy
  beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
    mock = createStorageMock()
    storage = { ...mock.storage, removeItem: jasmine.createSpy('removeItem').and.callFake((key: string) => { mock.values.delete(key) }) }
    spyOnProperty(window, 'localStorage', 'get').and.returnValue(storage as unknown as Storage)
    mock.values.set('albedo:theme:guest', 'dark')
    mock.values.set(USERS_KEY, JSON.stringify([account]))
    previousTheme = document.documentElement.dataset.bsTheme
    previousScheme = document.documentElement.style.colorScheme
    redirect = jasmine.createSpy('redirectLegacy')
    container = document.createElement('div'); document.body.append(container); root = createRoot(container)
  })
  afterEach(() => {
    act(() => root.unmount()); container.remove(); jasmine.clock().uninstall()
    if (previousTheme === undefined) delete document.documentElement.dataset.bsTheme
    else document.documentElement.dataset.bsTheme = previousTheme
    document.documentElement.style.colorScheme = previousScheme
    Reflect.deleteProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT')
  })
  async function mount(path = '/index.html') {
    await act(async () => root.render(<ThemeProvider><MemoryRouter initialEntries={[path]}>
      <Header cartCount={2} /><Routes>
        <Route path="/index.html" element={<h1>Inicio React</h1>} />
        <Route path="/login.html" element={<Login redirectLegacy={redirect} />} />
      </Routes>
    </MemoryRouter></ThemeProvider>))
  }
  const header = () => container.querySelector('header')!
  const logoutButton = () => container.querySelector<HTMLButtonElement>('.header-session-logout')!
  function input(id: string, value: string) {
    const field = container.querySelector<HTMLInputElement>('#' + id)!
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(field, value)
      field.dispatchEvent(new Event('input', { bubbles: true }))
    })
  }
  function storageEvent(key: string | null, area: unknown = storage) {
    const event = new Event('storage')
    Object.defineProperties(event, { key: { value: key }, storageArea: { value: area } })
    act(() => window.dispatchEvent(event))
  }
  it('SUI-01 recupera sesión al montar y muestra el nombre dinámico; oculta accesos de visitante', async () => {
    mock.values.set(LOGIN_SESSION_KEY, JSON.stringify(account))
    await mount()
    expect(header().textContent).toContain('Hola, ' + account.nombre)
    expect(header().querySelector('a[href="/login.html"]')).toBeNull()
    expect(header().querySelector('a[href="/registro.html"]')).toBeNull()
    expect(logoutButton()).not.toBeNull()
    expect(header().querySelector('a[href="/mis-pedidos.html"]')).not.toBeNull()
  })
  it('SUI-02 Login por defecto guarda y actualiza Header inmediatamente antes de redirigir', async () => {
    await mount('/login.html'); jasmine.clock().install()
    input('correoLogin', account.correo); input('contrasenaLogin', account.contrasena)
    act(() => container.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })))
    expect(JSON.parse(mock.values.get(LOGIN_SESSION_KEY)!).nombre).toBe(account.nombre)
    expect(header().textContent).toContain('Hola, ' + account.nombre)
    expect(header().querySelector('a[href="/login.html"]')).toBeNull()
    expect(container.querySelector('form')).not.toBeNull()
    act(() => jasmine.clock().tick(700))
    expect(container.textContent).toContain('Inicio React')
    expect(header().textContent).toContain('Hola, ' + account.nombre)
  })
  it('SUI-03 logout vuelve a visitante sin borrar datos y mantiene tema y contador', async () => {
    mock.values.set(LOGIN_SESSION_KEY, JSON.stringify(account))
    for (const key of ['carritoAlbedo', 'ordenesAlbedo']) mock.values.set(key, 'conservar')
    const savedUsers = mock.values.get(USERS_KEY)
    await mount(); act(() => logoutButton().click())
    expect(header().textContent).not.toContain('Hola, ')
    expect(header().querySelector('a[href="/login.html"]')).not.toBeNull()
    expect(header().querySelector('a[href="/registro.html"]')).not.toBeNull()
    expect(storage.removeItem).toHaveBeenCalledOnceWith(LOGIN_SESSION_KEY)
    expect(mock.values.get(USERS_KEY)).toBe(savedUsers)
    for (const key of ['carritoAlbedo', 'ordenesAlbedo']) expect(mock.values.get(key)).toBe('conservar')
    expect(mock.values.get('albedo:theme:guest')).toBe('dark')
    expect(document.documentElement.dataset.bsTheme).toBe('dark')
    expect(header().querySelector('.carrito-contador')!.textContent).toBe('2')
  })
  it('SUI-04 eventos storage actualizan login, nombre y logout e ignoran otras claves y áreas', async () => {
    await mount()
    mock.values.set(LOGIN_SESSION_KEY, JSON.stringify(account))
    storageEvent('otra-clave'); storageEvent(LOGIN_SESSION_KEY, {})
    expect(header().textContent).not.toContain('Hola, ')
    storageEvent(LOGIN_SESSION_KEY)
    expect(header().textContent).toContain('Hola, ' + account.nombre)
    mock.values.set(LOGIN_SESSION_KEY, JSON.stringify({ ...account, nombre: 'Tomás' })); storageEvent(LOGIN_SESSION_KEY)
    expect(header().textContent).toContain('Hola, Tomás')
    expect(header().textContent).not.toContain('Hola, ' + account.nombre)
    mock.values.delete(LOGIN_SESSION_KEY); storageEvent(LOGIN_SESSION_KEY)
    expect(header().querySelector('a[href="/login.html"]')).not.toBeNull()
  })
  it('SUI-05 cada rol conserva su enlace antiguo sin inventar paneles React', async () => {
    await mount()
    for (const [role, destination] of [['Cliente', 'mis-pedidos.html'], ['Administrador', 'admin.html'], ['Vendedor', 'vendedor.html']]) {
      mock.values.set(LOGIN_SESSION_KEY, JSON.stringify({ ...account, tipoUsuario: role })); storageEvent(LOGIN_SESSION_KEY)
      expect(header().querySelector(`a[href="/${destination}"]`)).not.toBeNull()
      expect(header().querySelector('a[href="/login.html"]')).toBeNull()
    }
  })
  it('SUI-06 fallo de logout muestra error y conserva la sesión en el Header', async () => {
    mock.values.set(LOGIN_SESSION_KEY, JSON.stringify(account)); await mount()
    storage.removeItem.and.throwError('Bloqueado')
    act(() => logoutButton().click())
    expect(header().textContent).toContain('No se pudo cerrar la sesión.')
    expect(header().textContent).toContain('Hola, ' + account.nombre)
    expect(mock.values.has(LOGIN_SESSION_KEY)).toBeTrue()
  })
  it('SUI-07 menú móvil conserva apertura/cierre y opciones actualizadas al cerrar sesión', async () => {
    mock.values.set(LOGIN_SESSION_KEY, JSON.stringify(account)); await mount()
    const menu = container.querySelector<HTMLButtonElement>('button[aria-label="Menú principal"]')!
    act(() => menu.click())
    expect(menu.getAttribute('aria-expanded')).toBe('true')
    act(() => logoutButton().click())
    expect(menu.getAttribute('aria-expanded')).toBe('false')
    act(() => menu.click())
    expect(header().querySelector('a[href="/login.html"]')).not.toBeNull()
    expect(header().querySelector('.header-session-logout')).toBeNull()
  })
  it('SUI-08 logout de otra pestaña cancela una redirección de Login pendiente', async () => {
    await mount('/login.html'); jasmine.clock().install()
    input('correoLogin', 'admin@duoc.cl'); input('contrasenaLogin', 'Admin2026#')
    act(() => container.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })))
    mock.values.delete(LOGIN_SESSION_KEY); storageEvent(LOGIN_SESSION_KEY)
    act(() => jasmine.clock().tick(700))
    expect(redirect).not.toHaveBeenCalled()
    expect(header().querySelector('a[href="/login.html"]')).not.toBeNull()
    expect(container.textContent).toContain('La sesión cambió.')
    expect(container.querySelector<HTMLInputElement>('#correoLogin')!.disabled).toBeFalse()
  })
  it('SUI-09 un rol inválido o JSON corrupto se muestra como visitante sin otorgar accesos', async () => {
    mock.values.set(LOGIN_SESSION_KEY, JSON.stringify({ ...account, tipoUsuario: 'Superadmin' })); await mount()
    expect(header().querySelector('a[href="/login.html"]')).not.toBeNull()
    expect(header().querySelector('.header-session-greeting')).toBeNull()
    expect(header().querySelector('a[href="/admin.html"]')).toBeNull()
    mock.values.set(LOGIN_SESSION_KEY, '{corrupto'); storageEvent(LOGIN_SESSION_KEY)
    expect(header().textContent).toContain('No se pudo leer una sesión válida.')
    expect(mock.values.get(LOGIN_SESSION_KEY)).toBe('{corrupto')
    expect(sessionState.getSnapshot().user).toBeNull()
  })
})
