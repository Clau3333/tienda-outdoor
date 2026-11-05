import { createSessionState } from '../../src/services/sessionState'
import { USERS_KEY, LOGIN_SESSION_KEY } from '../../src/services/loginService'
import { createStorageMock } from './storageMock'

describe('Sesión: estado reactivo y conservación de datos', () => {
  const account = { run: '111111111', nombre: 'Amalia', apellidos: 'Pérez', correo: 'amalia@duoc.cl', tipoUsuario: 'Cliente', contrasena: 'Cumbre2026#' }
  let mock: ReturnType<typeof createStorageMock>
  let storage: ReturnType<typeof createStorageMock>['storage'] & { removeItem: jasmine.Spy }
  let state: ReturnType<typeof createSessionState>
  beforeEach(() => {
    mock = createStorageMock()
    storage = { ...mock.storage, removeItem: jasmine.createSpy('removeItem').and.callFake((key: string) => { mock.values.delete(key) }) }
    state = createSessionState(storage)
  })
  it('SES-01 recupera una sesión persistida y su nombre sin fabricar una autenticación', () => {
    mock.values.set(LOGIN_SESSION_KEY, JSON.stringify(account))
    expect(state.getSnapshot().user?.nombre).toBe(account.nombre)
    expect(state.getSnapshot().user?.tipoUsuario).toBe('Cliente')
    expect(storage.setItem).not.toHaveBeenCalled()
  })
  it('SES-02 credenciales válidas persisten la sesión antes de notificar al observador', () => {
    mock.values.set(USERS_KEY, JSON.stringify([account]))
    const observer = jasmine.createSpy('observer').and.callFake(() => {
      expect(JSON.parse(mock.values.get(LOGIN_SESSION_KEY)!).correo).toBe(account.correo)
    })
    const unsubscribe = state.subscribe(observer)
    expect(state.loginService.authenticate(account.correo, account.contrasena).status).toBe('success')
    expect(state.getSnapshot().user?.nombre).toBe(account.nombre)
    expect(observer).toHaveBeenCalledTimes(1)
    unsubscribe()
  })
  it('SES-03 credenciales incorrectas no crean ni anuncian una sesión', () => {
    mock.values.set(USERS_KEY, JSON.stringify([account]))
    const observer = jasmine.createSpy('observer')
    const unsubscribe = state.subscribe(observer)
    expect(state.loginService.authenticate(account.correo, 'Incorrecta2026#').status).toBe('incorrect')
    expect(state.getSnapshot().user).toBeNull()
    expect(mock.values.has(LOGIN_SESSION_KEY)).toBeFalse()
    expect(observer).not.toHaveBeenCalled()
    unsubscribe()
  })
  it('SES-04 cerrar sesión solo elimina su clave y conserva los demás datos', () => {
    mock.values.set(LOGIN_SESSION_KEY, JSON.stringify(account))
    for (const key of [USERS_KEY, 'carritoAlbedo', 'ordenesAlbedo', 'albedo:theme:guest']) mock.values.set(key, 'conservar')
    state.logout()
    expect(storage.removeItem).toHaveBeenCalledOnceWith(LOGIN_SESSION_KEY)
    expect(state.getSnapshot().user).toBeNull()
    for (const key of [USERS_KEY, 'carritoAlbedo', 'ordenesAlbedo', 'albedo:theme:guest']) expect(mock.values.get(key)).toBe('conservar')
  })
  it('SES-05 fallo al eliminar conserva la sesión y no publica un cierre falso', () => {
    mock.values.set(LOGIN_SESSION_KEY, JSON.stringify(account)); state.refresh()
    storage.removeItem.and.throwError('Almacenamiento bloqueado')
    expect(() => state.logout()).toThrowError()
    expect(state.getSnapshot().user?.nombre).toBe(account.nombre)
    expect(mock.values.has(LOGIN_SESSION_KEY)).toBeTrue()
  })
  it('SES-06 otra instancia recibe cambios, eliminación y limpieza de almacenamiento', () => {
    const other = createSessionState(storage)
    mock.values.set(USERS_KEY, JSON.stringify([account]))
    state.loginService.authenticate(account.correo, account.contrasena)
    other.storageChanged(LOGIN_SESSION_KEY)
    expect(other.getSnapshot().user?.nombre).toBe(account.nombre)
    state.logout(); other.storageChanged(LOGIN_SESSION_KEY)
    expect(other.getSnapshot().user).toBeNull()
    mock.values.set(LOGIN_SESSION_KEY, JSON.stringify(account)); other.storageChanged(LOGIN_SESSION_KEY)
    mock.values.clear(); other.storageChanged(null)
    expect(other.getSnapshot().user).toBeNull()
  })
  it('SES-07 sesiones inválidas y lectura bloqueada no conceden rol ni destruyen datos', () => {
    const raw = JSON.stringify({ ...account, tipoUsuario: 'Superadmin' })
    mock.values.set(LOGIN_SESSION_KEY, raw)
    expect(state.getSnapshot().user).toBeNull()
    expect(state.getSnapshot().error).not.toBe('')
    expect(mock.values.get(LOGIN_SESSION_KEY)).toBe(raw)
    storage.getItem.and.throwError('Almacenamiento bloqueado'); state.refresh()
    expect(state.getSnapshot().user).toBeNull()
  })
})
