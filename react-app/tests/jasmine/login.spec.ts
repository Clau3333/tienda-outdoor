import { createLoginService, LOGIN_SESSION_KEY, USERS_KEY } from '../../src/services/loginService'
import { validateLoginEmail, validateLoginPassword } from '../../src/services/loginValidation'
import { createStorageMock } from './storageMock'

describe('Login: validación y autenticación local compatible', () => {
  let mock: ReturnType<typeof createStorageMock>
  let service: ReturnType<typeof createLoginService>
  beforeEach(() => { mock = createStorageMock(); service = createLoginService(mock.storage) })
  it('LOG-01 limita el correo a los dominios originales, sin espacios ni formatos inválidos', () => {
    for (const email of ['a@gmail.com', 'A@DUOC.CL', 'a@profesor.duoc.cl']) expect(validateLoginEmail(email)).toBe('')
    expect(validateLoginEmail('')).toBe('Debe ingresar su correo electrónico')
    expect(validateLoginEmail(' a@gmail.com')).toBe('El correo no puede contener espacios')
    expect(validateLoginEmail('sin-arroba')).toBe('El formato del correo no es válido')
    expect(validateLoginEmail('a@hotmail.com')).toBe('Solo se acepta @gmail.com, @duoc.cl o @profesor.duoc.cl')
    expect(validateLoginEmail('a'.repeat(100) + '@gmail.com')).toBe('El correo no puede superar los 100 caracteres')
  })
  it('LOG-02 aplica mínimo diez caracteres y conserva letras, números y símbolos permitidos', () => {
    expect(validateLoginPassword('Admin2026#')).toBe('')
    expect(validateLoginPassword('')).toBe('Debe ingresar su contraseña')
    expect(validateLoginPassword('Admin2026##')).toBe('')
    expect(validateLoginPassword('Corta12#')).toBe('La contraseña debe tener al menos 10 caracteres')
    expect(validateLoginPassword('Abcde123 #')).toBe('La contraseña no puede contener espacios')
    expect(validateLoginPassword('123456789#')).toBe('La contraseña debe contener al menos una letra')
    expect(validateLoginPassword('Abcdefghi#')).toBe('La contraseña debe contener al menos un número')
    expect(validateLoginPassword('Abcdef1234')).toBe('Debe contener un símbolo: % & $ # / ( ) = " !')
    expect(validateLoginPassword('Abcd12_34#')).toBe('La contraseña contiene caracteres no permitidos')
  })
  it('LOG-03 crea una sola vez el administrador académico original', () => {
    service.initializeAdministrator(); service.initializeAdministrator()
    expect(JSON.parse(mock.values.get(USERS_KEY)!).length).toBe(1)
    expect(mock.storage.setItem).toHaveBeenCalledTimes(1)
  })
  it('LOG-04 no cambia credenciales ni datos de un administrador existente', () => {
    const user = { correo: 'ADMIN@DUOC.CL', contrasena: 'Otra2026##', tipoUsuario: 'Administrador', dato: 'conservar' }
    mock.values.set(USERS_KEY, JSON.stringify([user]))
    service.initializeAdministrator()
    expect(JSON.parse(mock.values.get(USERS_KEY)!)).toEqual([user])
    expect(service.authenticate('admin@duoc.cl', 'Admin2026#').status).toBe('incorrect')
    expect(mock.storage.setItem).not.toHaveBeenCalled()
  })
  it('LOG-05 una validación fallida o contraseña incorrecta no reemplaza la sesión previa', () => {
    mock.values.set(LOGIN_SESSION_KEY, 'sesión previa')
    expect(service.authenticate('sin formato', 'Admin2026#').status).toBe('invalid')
    expect(service.authenticate('admin@duoc.cl', 'Admin2025#').status).toBe('incorrect')
    expect(mock.values.get(LOGIN_SESSION_KEY)).toBe('sesión previa')
  })
  it('LOG-06 autentica al administrador y guarda el formato de sesión sin contraseña', () => {
    const result = service.authenticate('ADMIN@DUOC.CL', 'Admin2026#')
    if (result.status !== 'success') { fail('Se esperaba autenticación'); return }
    expect(result.destination).toBe('admin.html')
    expect(JSON.parse(mock.values.get(LOGIN_SESSION_KEY)!)).toEqual({ run: '123456785', nombre: 'Claudio', apellidos: 'Cordova', correo: 'admin@duoc.cl', tipoUsuario: 'Administrador' })
    expect(mock.values.get(LOGIN_SESSION_KEY)).not.toContain('contrasena')
  })
  it('LOG-07 respeta vendedor, cliente y perfil antiguo; reconstruye RUN heredado', () => {
    for (const role of ['Vendedor', 'Cliente', undefined]) {
      mock.values.set(USERS_KEY, JSON.stringify([{ correo: 'demo@duoc.cl', contrasena: 'Admin2026#', nombre: 'Demo', rutNumero: '1234567', digitoVerificador: 'k', tipoUsuario: role }]))
      const result = service.authenticate('demo@duoc.cl', 'Admin2026#')
      if (result.status !== 'success') { fail('Se esperaba autenticación'); return }
      expect(result.session.run).toBe('1234567K')
      expect(result.session.tipoUsuario).toBe(role ?? 'Cliente')
      expect(result.destination).toBe(role === 'Vendedor' ? 'vendedor.html' : 'index.html')
    }
  })
  it('LOG-08 un almacenamiento corrupto no se sustituye ni permite acceso', () => {
    mock.values.set(USERS_KEY, '{corrupto')
    expect(() => service.authenticate('admin@duoc.cl', 'Admin2026#')).toThrowError()
    expect(mock.values.get(USERS_KEY)).toBe('{corrupto')
    expect(mock.values.has(LOGIN_SESSION_KEY)).toBeFalse()
  })
  it('LOG-09 el fallo al guardar sesión impide informar acceso exitoso', () => {
    service.initializeAdministrator()
    mock.values.set(LOGIN_SESSION_KEY, 'anterior')
    mock.storage.setItem.and.throwError('Cuota agotada')
    expect(() => service.authenticate('admin@duoc.cl', 'Admin2026#')).toThrowError()
    expect(mock.values.get(LOGIN_SESSION_KEY)).toBe('anterior')
  })
})
