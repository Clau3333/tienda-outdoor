import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Login from '../../src/pages/Login'
import Header from '../../src/components/Header'
import ThemeProvider from '../../src/theme/ThemeProvider'
import { createLoginService, USERS_KEY, LOGIN_SESSION_KEY } from '../../src/services/loginService'
import { createStorageMock } from './storageMock'

describe('Login React: formulario, navegación y tema en Chrome', () => {
  let container: HTMLDivElement
  let root: Root
  let mock: ReturnType<typeof createStorageMock>
  let redirect: jasmine.Spy
  let previousTheme: string | undefined
  let previousColorScheme: string
  beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
    mock = createStorageMock()
    mock.values.set('albedo:theme:guest', 'dark')
    spyOnProperty(window, 'localStorage', 'get').and.returnValue(mock.storage as unknown as Storage)
    redirect = jasmine.createSpy('redirectLegacy')
    previousTheme = document.documentElement.dataset.bsTheme
    previousColorScheme = document.documentElement.style.colorScheme
    container = document.createElement('div'); document.body.append(container)
    root = createRoot(container)
  })
  afterEach(() => {
    act(() => root.unmount()); container.remove()
    if (previousTheme === undefined) delete document.documentElement.dataset.bsTheme
    else document.documentElement.dataset.bsTheme = previousTheme
    document.documentElement.style.colorScheme = previousColorScheme
    jasmine.clock().uninstall()
    Reflect.deleteProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT')
  })
  async function mount() {
    await act(async () => root.render(<ThemeProvider><MemoryRouter initialEntries={['/login.html']}>
      <Header cartCount={2} /><Routes>
        <Route path="/login.html" element={<Login service={createLoginService(mock.storage)} redirectLegacy={redirect} />} />
        <Route path="/index.html" element={<h1>Inicio React</h1>} />
      </Routes>
    </MemoryRouter></ThemeProvider>))
  }
  function enter(id: string, value: string) {
    const input = container.querySelector<HTMLInputElement>('#' + id)!
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value)
      input.dispatchEvent(new Event('input', { bubbles: true }))
    })
  }
  function submit() {
    act(() => container.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })))
  }
  it('LUI-01 valida al escribir, presenta errores y enlaza Registro React', async () => {
    await mount()
    enter('correoLogin', 'sin formato')
    expect(container.textContent).toContain('El correo no puede contener espacios')
    expect(container.querySelector('#correoLogin')!.getAttribute('aria-invalid')).toBe('true')
    submit()
    expect(container.textContent).toContain('Revisa los datos ingresados.')
    expect(container.querySelector('main a')!.getAttribute('href')).toBe('/registro.html')
    expect(container.querySelector('a[href="/login.html"]')!.getAttribute('aria-current')).toBe('page')
  })
  it('LUI-02 credenciales incorrectas muestran el mensaje original sin crear sesión', async () => {
    await mount()
    enter('correoLogin', 'admin@duoc.cl'); enter('contrasenaLogin', 'Admin2025#')
    submit()
    expect(container.textContent).toContain('Correo o contraseña incorrectos.')
    expect(mock.values.has(LOGIN_SESSION_KEY)).toBeFalse()
    expect(redirect).not.toHaveBeenCalled()
    enter('contrasenaLogin', 'Admin2026#')
    expect(container.textContent).not.toContain('Correo o contraseña incorrectos.')
  })
  it('LUI-03 un cliente vuelve a Inicio React tras 700 ms conservando el tema y el Header', async () => {
    mock.values.set(USERS_KEY, JSON.stringify([{ correo: 'cliente@duoc.cl', contrasena: 'Admin2026#', nombre: '<Cliente>', tipoUsuario: 'Cliente' }]))
    await mount()
    jasmine.clock().install()
    enter('correoLogin', 'cliente@duoc.cl'); enter('contrasenaLogin', 'Admin2026#')
    submit(); submit()
    expect(container.textContent).toContain('Inicio de sesión exitoso.')
    expect(container.textContent).toContain('Bienvenido <Cliente>.')
    expect(container.querySelector('cliente')).toBeNull()
    act(() => jasmine.clock().tick(699))
    expect(container.querySelector('form')).not.toBeNull()
    act(() => jasmine.clock().tick(1))
    expect(container.textContent).toContain('Inicio React')
    expect(container.querySelector('header')).not.toBeNull()
    expect(document.documentElement.dataset.bsTheme).toBe('dark')
    expect(mock.values.get('albedo:theme:guest')).toBe('dark')
    expect(redirect).not.toHaveBeenCalled()
  })
  for (const [role, destination] of [['Administrador', 'admin.html'], ['Vendedor', 'vendedor.html']]) {
    it(`LUI-${role === 'Administrador' ? '04' : '05'} ${role} conserva su panel antiguo y no inventa una ruta React`, async () => {
      mock.values.set(USERS_KEY, JSON.stringify([{ correo: 'rol@duoc.cl', contrasena: 'Admin2026#', nombre: 'Demo', tipoUsuario: role }]))
      await mount(); jasmine.clock().install()
      enter('correoLogin', 'rol@duoc.cl'); enter('contrasenaLogin', 'Admin2026#'); submit()
      act(() => jasmine.clock().tick(700))
      expect(redirect).toHaveBeenCalledOnceWith('/' + destination)
      expect(JSON.parse(mock.values.get(LOGIN_SESSION_KEY)!).tipoUsuario).toBe(role)
    })
  }
  it('LUI-06 cambiar el tema conserva los campos escritos y persiste la preferencia', async () => {
    await mount()
    enter('correoLogin', 'cliente@duoc.cl'); enter('contrasenaLogin', 'Admin2026#')
    act(() => container.querySelector<HTMLButtonElement>('button[aria-label="Modo nocturno"]')!.click())
    expect(document.documentElement.dataset.bsTheme).toBe('light')
    expect(mock.values.get('albedo:theme:guest')).toBe('light')
    expect(container.querySelector<HTMLInputElement>('#correoLogin')!.value).toBe('cliente@duoc.cl')
    expect(container.querySelector<HTMLInputElement>('#contrasenaLogin')!.value).toBe('Admin2026#')
  })
  it('LUI-07 un error de almacenamiento se informa sin éxito ni redirección', async () => {
    mock.values.set(LOGIN_SESSION_KEY, 'sesión previa')
    mock.storage.getItem.and.throwError('Almacenamiento bloqueado')
    await mount()
    expect(container.textContent).toContain('No se pudieron leer o guardar los usuarios.')
    enter('correoLogin', 'admin@duoc.cl'); enter('contrasenaLogin', 'Admin2026#'); submit()
    expect(container.textContent).toContain('No se pudo iniciar sesión')
    expect(container.textContent).not.toContain('Inicio de sesión exitoso.')
    expect(mock.values.get(LOGIN_SESSION_KEY)).toBe('sesión previa')
    expect(redirect).not.toHaveBeenCalled()
  })
  it('LUI-08 formato válido no muestra marcas verdes ni acceso para una cuenta inexistente', async () => {
    await mount()
    enter('correoLogin', 'inexistente@duoc.cl'); enter('contrasenaLogin', 'Cumbre2026#Larga')
    expect(container.querySelectorAll('main .is-valid').length).toBe(0)
    expect(container.textContent).toContain('Formato válido; no confirma que exista una cuenta.')
    expect(container.textContent).toContain('Formato válido; no confirma la contraseña de una cuenta.')
    expect(container.textContent).not.toContain('Inicio de sesión exitoso.')
    expect(container.querySelector<HTMLInputElement>('#contrasenaLogin')!.hasAttribute('maxlength')).toBeFalse()
    submit()
    expect(container.textContent).toContain('Correo o contraseña incorrectos.')
    expect(mock.values.has(LOGIN_SESSION_KEY)).toBeFalse()
  })
})
