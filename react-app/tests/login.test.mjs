import assert from 'node:assert/strict'
import { test } from 'node:test'
import vm from 'node:vm'
import { readFile, access } from 'node:fs/promises'
import { createLoginService, USERS_KEY, LOGIN_SESSION_KEY } from '../src/services/loginService.ts'
import { validateLoginEmail, validateLoginPassword } from '../src/services/loginValidation.ts'

const original = await readFile(new URL('../../Sitio Old/login.js', import.meta.url), 'utf8')
function setup(entries = []) {
  const values = new Map(entries)
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value) } }
  return { values, storage, service: createLoginService(storage) }
}
function legacy(storage, email = '', password = '') {
  const handlers = {}
  const elements = {}
  for (const id of ['formularioLogin', 'correoLogin', 'contrasenaLogin', 'mensajeResultadoLogin', 'feedbackCorreoLogin', 'feedbackContrasenaLogin']) {
    elements[id] = { value: id === 'correoLogin' ? email : id === 'contrasenaLogin' ? password : '',
      textContent: '', className: '', classList: { add() {}, remove() {} },
      addEventListener: (event, handler) => { handlers[id + ':' + event] = handler } }
  }
  const context = vm.createContext({ localStorage: storage, document: {
    addEventListener: (event, handler) => handler(), getElementById: (id) => elements[id],
  }, setTimeout() {} })
  vm.runInContext(original, context)
  return { handlers, elements }
}
test('validación de correo conserva todos los mensajes y precedencia del JavaScript original', () => {
  for (const email of ['', ' ', ' cliente@gmail.com', 'a b@gmail.com', 'a'.repeat(95) + '@gmail.com', 'sin-arroba', 'a@hotmail.com', 'Cliente@GMAIL.COM', 'a@duoc.cl', 'a@profesor.duoc.cl']) {
    const { elements, handlers } = legacy(setup().storage, email)
    handlers['correoLogin:input']()
    assert.equal(validateLoginEmail(email), elements.feedbackCorreoLogin.textContent, email)
  }
})
test('validación conserva reglas originales de contraseña y amplía la longitud a mínimo diez', () => {
  for (const password of ['', 'Abcde123 #', '123456789#', 'Abcdefghi#', 'Abcdef1234', 'Abcd12_34#', 'Admin2026#', 'Ábcdef123#']) {
    const { elements, handlers } = legacy(setup().storage, '', password)
    handlers['contrasenaLogin:input']()
    assert.equal(validateLoginPassword(password), elements.feedbackContrasenaLogin.textContent, password)
  }
  assert.equal(validateLoginPassword('Admin2026##'), '')
  assert.equal(validateLoginPassword('123'), 'La contraseña debe tener al menos 10 caracteres')
})
test('administrador inicial es idéntico al original y su inicialización es idempotente', () => {
  const old = setup(), current = setup()
  legacy(old.storage)
  current.service.initializeAdministrator(); current.service.initializeAdministrator()
  assert.deepEqual(JSON.parse(current.values.get(USERS_KEY)), JSON.parse(old.values.get(USERS_KEY)))
})
test('no reemplaza usuarios ni credenciales de administrador previamente modificadas', () => {
  const users = [{ correo: 'ADMIN@DUOC.CL', contrasena: 'Otra2026##', tipoUsuario: 'Administrador', dato: 'conservar' }]
  const { service, values } = setup([[USERS_KEY, JSON.stringify(users)]])
  service.initializeAdministrator()
  assert.deepEqual(JSON.parse(values.get(USERS_KEY)), users)
  assert.equal(service.authenticate('admin@duoc.cl', 'Admin2026#').status, 'incorrect')
})
test('la sesión React es idéntica a la original para los tres roles y usuarios antiguos', () => {
  for (const role of ['Administrador', 'Vendedor', 'Cliente', undefined, 'Desconocido']) {
    const user = { correo: 'prueba@duoc.cl', contrasena: 'Admin2026#', nombre: 'Prueba', apellidos: 'Académica', rutNumero: '1234567', digitoVerificador: 'k', tipoUsuario: role }
    const entries = [[USERS_KEY, JSON.stringify([user])]]
    const old = setup(entries), current = setup(entries)
    const { handlers } = legacy(old.storage, user.correo, user.contrasena)
    handlers['formularioLogin:submit']({ preventDefault() {} })
    const result = current.service.authenticate('PRUEBA@DUOC.CL', user.contrasena)
    assert.equal(result.status, 'success')
    assert.deepEqual(JSON.parse(current.values.get(LOGIN_SESSION_KEY)), JSON.parse(old.values.get(LOGIN_SESSION_KEY)))
    assert.equal(result.destination, role === 'Administrador' ? 'admin.html' : role === 'Vendedor' ? 'vendedor.html' : 'index.html')
  }
})
test('datos inválidos y credenciales incorrectas no reemplazan una sesión anterior', () => {
  const { service, values } = setup([[LOGIN_SESSION_KEY, '{"nombre":"anterior"}']])
  assert.equal(service.authenticate('incorrecto', 'Admin2026#').status, 'invalid')
  assert.equal(service.authenticate('admin@duoc.cl', 'Admin2025#').status, 'incorrect')
  assert.equal(values.get(LOGIN_SESSION_KEY), '{"nombre":"anterior"}')
})
test('usuarios corruptos o escrituras bloqueadas no destruyen datos ni permiten acceso', () => {
  const { service, storage, values } = setup([[USERS_KEY, '{corrupto'], [LOGIN_SESSION_KEY, 'sesion-anterior']])
  assert.throws(() => service.initializeAdministrator())
  assert.throws(() => service.authenticate('admin@duoc.cl', 'Admin2026#'))
  assert.equal(values.get(USERS_KEY), '{corrupto')
  values.delete(USERS_KEY); service.initializeAdministrator()
  storage.setItem = () => { throw new Error('Almacenamiento bloqueado') }
  assert.throws(() => service.authenticate('admin@duoc.cl', 'Admin2026#'))
  assert.equal(values.get(LOGIN_SESSION_KEY), 'sesion-anterior')
})
test('los archivos originales de Registro y los paneles siguen disponibles', async () => {
  for (const path of ['registro.html', 'admin.html', 'vendedor.html']) await access(new URL(`../../Sitio Old/${path}`, import.meta.url))
})
