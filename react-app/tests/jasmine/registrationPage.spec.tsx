import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Registro from '../../src/pages/Registro'
import Login from '../../src/pages/Login'
import Header from '../../src/components/Header'
import ThemeProvider from '../../src/theme/ThemeProvider'
import { createRegistrationService } from '../../src/services/registrationService'
import { createLoginService, USERS_KEY, LOGIN_SESSION_KEY } from '../../src/services/loginService'
import { registrationFixture as valid } from './registrationFixture'
import { createStorageMock } from './storageMock'

describe('Registro React: formulario y flujo hacia Login', () => {
  let container: HTMLDivElement
  let root: Root
  let mock: ReturnType<typeof createStorageMock>
  let previousTheme: string | undefined
  let previousScheme: string
  beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
    mock = createStorageMock(); mock.values.set('albedo:theme:guest', 'dark')
    spyOnProperty(window, 'localStorage', 'get').and.returnValue(mock.storage as unknown as Storage)
    previousTheme = document.documentElement.dataset.bsTheme
    previousScheme = document.documentElement.style.colorScheme
    container = document.createElement('div'); document.body.append(container); root = createRoot(container)
  })
  afterEach(() => {
    act(() => root.unmount()); container.remove(); jasmine.clock().uninstall()
    if (previousTheme === undefined) delete document.documentElement.dataset.bsTheme
    else document.documentElement.dataset.bsTheme = previousTheme
    document.documentElement.style.colorScheme = previousScheme
    Reflect.deleteProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT')
  })
  async function mount() {
    const registration = createRegistrationService(mock.storage)
    const login = createLoginService(mock.storage)
    await act(async () => root.render(<ThemeProvider><MemoryRouter initialEntries={['/registro.html']}>
      <Header cartCount={2} /><Routes>
        <Route path="/registro.html" element={<Registro service={registration} />} />
        <Route path="/login.html" element={<Login service={login} />} />
        <Route path="/index.html" element={<h1>Inicio React</h1>} />
      </Routes>
    </MemoryRouter></ThemeProvider>))
  }
  function change(id: string, value: string) {
    const field = container.querySelector<HTMLInputElement | HTMLSelectElement>('#' + id)!
    act(() => {
      const prototype = field instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype
      Object.getOwnPropertyDescriptor(prototype, 'value')!.set!.call(field, value)
      field.dispatchEvent(new Event(field instanceof HTMLSelectElement ? 'change' : 'input', { bubbles: true }))
    })
  }
  function complete() {
    for (const [field, value] of Object.entries(valid)) {
      const id = field === 'rutNumero' ? 'runRegistro' : field === 'digitoVerificador' ? 'dvRegistro' : field + 'Registro'
      if (value) change(id, value)
    }
  }
  function submit() { act(() => container.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))) }
  it('RUI-01 conserva todos los campos y etiquetas, fecha opcional y enlaces React', async () => {
    await mount()
    const fields = container.querySelectorAll('main input, main select')
    expect(fields.length).toBe(15)
    for (const field of fields) expect(container.querySelector(`label[for="${field.id}"]`)).not.toBeNull()
    expect(container.querySelector<HTMLInputElement>('#fechaNacimientoRegistro')!.required).toBeFalse()
    expect(container.querySelector('a[href="/registro.html"]')!.getAttribute('aria-current')).toBe('page')
    expect(container.querySelector('main a')!.getAttribute('href')).toBe('/login.html')
  })
  it('RUI-02 cambiar región reinicia comuna y solo ofrece comunas correspondientes', async () => {
    await mount()
    expect(container.querySelector<HTMLSelectElement>('#comunaRegistro')!.disabled).toBeTrue()
    change('regionRegistro', 'Biobío'); change('comunaRegistro', 'Concepción'); change('regionRegistro', 'Maule')
    const commune = container.querySelector<HTMLSelectElement>('#comunaRegistro')!
    expect(commune.value).toBe('')
    expect([...commune.options].map((option) => option.value)).toContain('Talca')
    expect([...commune.options].map((option) => option.value)).not.toContain('Concepción')
  })
  it('RUI-03 Casa limpia y deshabilita departamento; Departamento exige número', async () => {
    await mount()
    change('tipoDomicilioRegistro', 'Departamento'); change('numeroUnidadRegistro', '504'); change('tipoDomicilioRegistro', 'Casa')
    const unit = container.querySelector<HTMLInputElement>('#numeroUnidadRegistro')!
    expect(unit.disabled).toBeTrue(); expect(unit.value).toBe('')
    change('tipoDomicilioRegistro', 'Departamento'); submit()
    expect(unit.disabled).toBeFalse()
    expect(container.textContent).toContain('Ingrese el número del departamento')
  })
  it('RUI-04 sanitiza RUT/DV y conserva errores específicos al corregir otros campos', async () => {
    await mount()
    change('runRegistro', 'abc11111111'); change('dvRegistro', 'xk')
    expect(container.querySelector<HTMLInputElement>('#runRegistro')!.value).toBe('11111111')
    expect(container.querySelector<HTMLInputElement>('#dvRegistro')!.value).toBe('K')
    submit(); change('nombreRegistro', 'María')
    expect(container.textContent).toContain('El RUT ingresado no es válido')
    expect(container.querySelector('#runRegistro')!.getAttribute('aria-invalid')).toBe('true')
  })
  it('RUI-05 registra una sola cuenta, navega a Login y autentica conservando tema y Header', async () => {
    await mount(); jasmine.clock().install(); complete()
    const longPassword = 'Cumbre2026#Larga'
    change('contrasenaRegistro', longPassword); change('confirmarContrasenaRegistro', longPassword)
    submit(); submit()
    expect(container.textContent).toContain('Cuenta creada correctamente.')
    expect(JSON.parse(mock.values.get(USERS_KEY)!).length).toBe(1)
    expect(mock.values.has(LOGIN_SESSION_KEY)).toBeFalse()
    await act(async () => { jasmine.clock().tick(1500) })
    expect(container.querySelector('#formularioLogin')).not.toBeNull()
    change('correoLogin', valid.correo); change('contrasenaLogin', longPassword); submit()
    expect(container.textContent).toContain('Inicio de sesión exitoso.')
    act(() => jasmine.clock().tick(700))
    expect(container.textContent).toContain('Inicio React')
    expect(container.querySelector('header')).not.toBeNull()
    expect(document.documentElement.dataset.bsTheme).toBe('dark')
    expect(JSON.parse(mock.values.get(LOGIN_SESSION_KEY)!).tipoUsuario).toBe('Cliente')
  })
  it('RUI-06 informa un fallo de persistencia sin confirmar registro ni navegar', async () => {
    await mount(); complete(); mock.storage.setItem.and.throwError('Cuota agotada'); submit()
    expect(container.textContent).toContain('No se pudo guardar la cuenta.')
    expect(mock.values.has(USERS_KEY)).toBeFalse()
    expect(container.querySelector('#formularioRegistro')).not.toBeNull()
  })
  it('RUI-07 alternar el tema conserva los campos de dirección y usa el tema compartido', async () => {
    await mount(); change('nombreRegistro', 'María'); change('regionRegistro', 'Biobío'); change('comunaRegistro', 'Concepción')
    act(() => container.querySelector<HTMLButtonElement>('button[aria-label="Modo nocturno"]')!.click())
    expect(document.documentElement.dataset.bsTheme).toBe('light')
    expect(container.querySelector<HTMLInputElement>('#nombreRegistro')!.value).toBe('María')
    expect(container.querySelector<HTMLSelectElement>('#comunaRegistro')!.value).toBe('Concepción')
  })
})
