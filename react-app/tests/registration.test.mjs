import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'
import { regiones } from '../src/data/regions.ts'
import { createRegistrationService } from '../src/services/registrationService.ts'
import { createLoginService, USERS_KEY } from '../src/services/loginService.ts'
import { emptyRegistration, validateRegistration, validateRut } from '../src/services/registrationValidation.ts'

const valid = { ...emptyRegistration, rutNumero: '11111111', digitoVerificador: '1', nombre: 'María', apellidos: 'Pérez Soto',
  correo: 'maria@duoc.cl', region: 'Biobío', comuna: 'Concepción', calle: 'Avenida Los Carrera', numeroDomicilio: '1234',
  tipoDomicilio: 'Casa', codigoPostal: '4030000', contrasena: 'Cumbre026#', confirmarContrasena: 'Cumbre026#' }
function setup() {
  const values = new Map()
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value) } }
  return { values, storage, service: createRegistrationService(storage) }
}
const source = await readFile(new URL('../../Sitio Old/registro.js', import.meta.url), 'utf8')
function legacy(storage, values = valid) {
  const ids = { runRegistro: 'rutNumero', dvRegistro: 'digitoVerificador' }
  for (const field of Object.keys(valid)) if (!['rutNumero', 'digitoVerificador'].includes(field)) ids[field + 'Registro'] = field
  const elements = {}, handlers = {}
  function element(id) {
    return elements[id] ??= { value: values[ids[id]] ?? '', disabled: id === 'comunaRegistro', textContent: '', className: '',
      classList: { add() {}, remove() {} }, appendChild() {},
      addEventListener: (event, fn) => { handlers[id + ':' + event] = fn } }
  }
  const context = vm.createContext({ localStorage: storage,
    document: { addEventListener: (event, fn) => fn(), getElementById: element, createElement: () => ({}) }, setTimeout() {} })
  vm.runInContext(source.replace('const regiones =', 'const regiones = globalThis.regionesOriginales ='), context)
  handlers['regionRegistro:change'](); handlers['tipoDomicilioRegistro:change']()
  return { elements, handlers, regions: JSON.parse(JSON.stringify(context.regionesOriginales)) }
}
test('regiones y comunas React son idénticas al catálogo local original', () => {
  const old = legacy(setup().storage)
  assert.deepEqual(regiones, old.regions)
  assert.equal(Object.keys(regiones).length, 16)
})
test('registro guarda exactamente los mismos campos que el original, con fecha opcional y casa/departamento', () => {
  for (const home of ['Casa', 'Departamento']) {
    const form = { ...valid, tipoDomicilio: home, numeroUnidad: home === 'Departamento' ? '504' : '' }
    const old = setup(), current = setup()
    const page = legacy(old.storage, form)
    page.handlers['formularioRegistro:submit']({ preventDefault() {} })
    assert.equal(current.service.register(form).status, 'success')
    assert.deepEqual(JSON.parse(current.values.get(USERS_KEY)), JSON.parse(old.values.get(USERS_KEY)))
  }
})
test('RUT módulo 11 coincide con el original, incluidos DV K, cero y errores', () => {
  for (const [body, digit] of [['12345678', '5'], ['11111111', '1'], ['1000005', 'K'], ['1000013', '0'], ['11111111', '2'], ['', ''], ['123', '1']]) {
    const page = legacy(setup().storage, { ...valid, rutNumero: body, digitoVerificador: digit })
    page.handlers['formularioRegistro:submit']({ preventDefault() {} })
    const oldError = page.elements.feedbackRunRegistro.textContent
    assert.equal(validateRut(body, digit), oldError === 'RUT válido' ? '' : oldError)
  }
})
test('una cuenta registrada con contraseña larga inicia sesión sin perder la cuenta de diez caracteres', () => {
  const { service, storage } = setup()
  const long = 'Cumbre2026#Larga'
  assert.equal(service.register({ ...valid, contrasena: long, confirmarContrasena: long }).status, 'success')
  const login = createLoginService(storage)
  assert.equal(login.authenticate(valid.correo, long).status, 'success')
  assert.equal(login.authenticate('admin@duoc.cl', 'Admin2026#').status, 'success')
  assert.equal(login.authenticate(valid.correo, long + 'x').status, 'incorrect')
})
test('región/comuna inconsistentes, departamento vacío y confirmación distinta se rechazan', () => {
  const errors = validateRegistration({ ...valid, region: 'Maule', tipoDomicilio: 'Departamento', confirmarContrasena: 'Otra2026##' })
  assert.ok(errors.comuna); assert.ok(errors.numeroUnidad); assert.ok(errors.confirmarContrasena)
  assert.ok(validateRegistration({ ...valid, region: 'toString' }).region)
})
test('duplicados normalizados por correo y RUT heredado se rechazan sin eliminar usuarios', () => {
  for (const old of [{ correo: ' MARIA@DUOC.CL ', dato: 'conservar' }, { rutNumero: '11111111', digitoVerificador: '1', dato: 'conservar' }]) {
    const { service, values } = setup()
    values.set(USERS_KEY, JSON.stringify([old]))
    assert.equal(service.register(valid).status, 'invalid')
    assert.deepEqual(JSON.parse(values.get(USERS_KEY)), [old])
  }
})
test('solo crea Cliente, no almacena confirmación ni modifica sesión/carrito/órdenes/tema', () => {
  const { service, values } = setup()
  for (const key of ['usuarioSesionAlbedo', 'carritoAlbedo', 'ordenesAlbedo', 'albedo:theme:guest']) values.set(key, 'conservar')
  assert.equal(service.register({ ...valid, tipoUsuario: 'Administrador' }).status, 'success')
  const user = JSON.parse(values.get(USERS_KEY))[0]
  assert.equal(user.tipoUsuario, 'Cliente'); assert.equal('confirmarContrasena' in user, false)
  for (const key of ['usuarioSesionAlbedo', 'carritoAlbedo', 'ordenesAlbedo', 'albedo:theme:guest']) assert.equal(values.get(key), 'conservar')
})
test('JSON corrupto o cuota agotada impiden guardar sin perder datos', () => {
  const { service, values, storage } = setup()
  values.set(USERS_KEY, '{corrupto')
  assert.throws(() => service.register(valid)); assert.equal(values.get(USERS_KEY), '{corrupto')
  values.set(USERS_KEY, '[]')
  storage.setItem = () => { throw new Error('QuotaExceededError') }
  assert.throws(() => service.register(valid)); assert.equal(values.get(USERS_KEY), '[]')
})
