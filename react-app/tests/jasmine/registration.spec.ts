import { createRegistrationService } from '../../src/services/registrationService'
import { validateRegistration, validateRut } from '../../src/services/registrationValidation'
import { createLoginService, USERS_KEY, LOGIN_SESSION_KEY } from '../../src/services/loginService'
import { validatePassword } from '../../src/services/passwordPolicy'
import { registrationFixture as valid } from './registrationFixture'
import { createStorageMock } from './storageMock'

describe('Registro: validaciones y persistencia compatible', () => {
  let mock: ReturnType<typeof createStorageMock>
  let service: ReturnType<typeof createRegistrationService>
  beforeEach(() => { mock = createStorageMock(); service = createRegistrationService(mock.storage) })
  it('REG-01 RUT módulo 11 admite DV numérico, K y cero y rechaza dígitos erróneos', () => {
    expect(validateRut('12345678', '5')).toBe('')
    expect(validateRut('1000005', 'k')).toBe('')
    expect(validateRut('1000013', '0')).toBe('')
    expect(validateRut('11111111', '2')).toBe('El RUT ingresado no es válido')
    expect(validateRut('123', '1')).not.toBe('')
  })
  it('REG-02 fecha de nacimiento es opcional y rechaza fechas inválidas o futuras', () => {
    const now = new Date(2026, 10, 5)
    expect(validateRegistration(valid, now).fechaNacimiento).toBeUndefined()
    for (const date of ['1899-01-01', '2026-02-31', '2027-01-01']) expect(validateRegistration({ ...valid, fechaNacimiento: date }, now).fechaNacimiento).toBeDefined()
    expect(validateRegistration({ ...valid, fechaNacimiento: '2000-03-23' }, now).fechaNacimiento).toBeUndefined()
  })
  it('REG-03 la comuna debe pertenecer a una región conocida', () => {
    expect(validateRegistration(valid).comuna).toBeUndefined()
    expect(validateRegistration({ ...valid, region: 'Maule' }).comuna).toBeDefined()
    expect(validateRegistration({ ...valid, region: 'toString' }).region).toBeDefined()
  })
  it('REG-04 domicilio numérico, código postal y departamento tienen restricciones originales', () => {
    const errors = validateRegistration({ ...valid, numeroDomicilio: '12A', codigoPostal: '123', tipoDomicilio: 'Departamento' })
    expect(errors.numeroDomicilio).toBe('Ingrese solamente números')
    expect(errors.codigoPostal).toBe('El código postal debe contener exactamente 7 números')
    expect(errors.numeroUnidad).toBe('Ingrese el número del departamento')
    expect(validateRegistration({ ...valid, tipoDomicilio: 'Departamento', numeroUnidad: '504' }).numeroUnidad).toBeUndefined()
    expect(validateRegistration(valid).numeroUnidad).toBeUndefined()
  })
  it('REG-05 nombres, correo y confirmación inválidos muestran errores específicos', () => {
    const errors = validateRegistration({ ...valid, nombre: '123', apellidos: '', correo: 'maria@hotmail.com', confirmarContrasena: 'Otra2026##' })
    expect(errors.nombre).toBe('Ingrese un nombre válido')
    expect(errors.apellidos).toBe('Ingrese apellidos válidos')
    expect(errors.correo).toContain('Solo se acepta')
    expect(errors.confirmarContrasena).toBe('Las contraseñas no coinciden')
  })
  it('REG-06 la política compartida acepta diez o más caracteres y mantiene los símbolos', () => {
    expect(validatePassword(valid.contrasena)).toBe('')
    expect(validatePassword('Cumbre2026#Larga')).toBe('')
    expect(validatePassword('Corta12#')).not.toBe('')
    expect(validatePassword('Cumbre2026@')).toContain('Debe contener un símbolo')
  })
  it('REG-07 registra solamente Cliente y omite confirmación y privilegios solicitados', () => {
    const hostile = { ...valid, tipoUsuario: 'Administrador' }
    expect(service.register(hostile).status).toBe('success')
    const user = JSON.parse(mock.values.get(USERS_KEY)!)[0]
    expect(user.tipoUsuario).toBe('Cliente')
    expect(user.confirmarContrasena).toBeUndefined()
    expect(user.run).toBe('111111111')
    expect(user.fechaNacimiento).toBe('')
  })
  it('REG-08 impide duplicar correo sin distinguir mayúsculas ni sobrescribir usuarios anteriores', () => {
    const old = { correo: ' MARIA@DUOC.CL ', rolAnterior: 'conservar' }
    mock.values.set(USERS_KEY, JSON.stringify([old]))
    expect(service.register(valid).status).toBe('invalid')
    expect(JSON.parse(mock.values.get(USERS_KEY)!)).toEqual([old])
  })
  it('REG-09 impide duplicar un RUT guardado en formato heredado', () => {
    mock.values.set(USERS_KEY, JSON.stringify([{ rutNumero: '11111111', digitoVerificador: '1' }]))
    const result = service.register(valid)
    if (result.status !== 'invalid') { fail('Se esperaba duplicado'); return }
    expect(result.errors.rutNumero).toBe('Este RUT ya se encuentra registrado')
  })
  it('REG-10 la cuenta nueva inicia sesión con contraseña larga y las anteriores siguen funcionando', () => {
    const password = 'Cumbre2026#Larga'
    service.register({ ...valid, contrasena: password, confirmarContrasena: password })
    const login = createLoginService(mock.storage)
    expect(login.authenticate(valid.correo, password).status).toBe('success')
    expect(login.authenticate('admin@duoc.cl', 'Admin2026#').status).toBe('success')
    expect(login.authenticate(valid.correo, password + 'x').status).toBe('incorrect')
  })
  it('REG-11 JSON corrupto o almacenamiento bloqueado no producen éxito ni destruyen datos', () => {
    mock.values.set(USERS_KEY, '{corrupto')
    expect(() => service.register(valid)).toThrowError()
    expect(mock.values.get(USERS_KEY)).toBe('{corrupto')
    mock.values.set(USERS_KEY, '[]')
    mock.storage.setItem.and.throwError('QuotaExceededError')
    expect(() => service.register(valid)).toThrowError()
    expect(mock.values.get(USERS_KEY)).toBe('[]')
  })
  it('REG-12 registrar no inicia sesión ni modifica carrito, órdenes o tema', () => {
    for (const key of [LOGIN_SESSION_KEY, 'carritoAlbedo', 'ordenesAlbedo', 'albedo:theme:guest']) mock.values.set(key, 'conservar')
    expect(service.register(valid).status).toBe('success')
    for (const key of [LOGIN_SESSION_KEY, 'carritoAlbedo', 'ordenesAlbedo', 'albedo:theme:guest']) expect(mock.values.get(key)).toBe('conservar')
  })
})
