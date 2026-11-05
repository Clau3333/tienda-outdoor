import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createSessionState } from '../src/services/sessionState.ts'
import { USERS_KEY, LOGIN_SESSION_KEY } from '../src/services/loginService.ts'

const account = { run: '111111111', nombre: 'Amalia', apellidos: 'Pérez', correo: 'amalia@duoc.cl', tipoUsuario: 'Cliente', contrasena: 'Cumbre2026#' }
const session = { run: account.run, nombre: account.nombre, apellidos: account.apellidos, correo: account.correo, tipoUsuario: account.tipoUsuario }
function setup() {
  const values = new Map()
  const removed = []
  const storage = { getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, value) }, removeItem: (key) => { removed.push(key); values.delete(key) } }
  return { values, storage, removed, state: createSessionState(storage) }
}
test('visitante y sesiones inválidas no se presentan como autenticados ni se borran datos', () => {
  const { state, values } = setup()
  assert.equal(state.getSnapshot().user, null)
  for (const raw of ['{corrupto', 'null', '[]', '{}', JSON.stringify({ ...session, nombre: '' }), JSON.stringify({ ...session, tipoUsuario: 'Superadmin' }), JSON.stringify({ ...session, tipoUsuario: ['Cliente'] })]) {
    values.set(LOGIN_SESSION_KEY, raw); state.storageChanged(LOGIN_SESSION_KEY)
    assert.equal(state.getSnapshot().user, null)
    assert.ok(state.getSnapshot().error)
    assert.equal(values.get(LOGIN_SESSION_KEY), raw)
  }
})
test('recupera una sesión persistida con su nombre y rol sin reconstruir usuarios ni privilegios', () => {
  for (const role of ['Cliente', 'Administrador', 'Vendedor']) {
    const { storage, values } = setup()
    values.set(LOGIN_SESSION_KEY, JSON.stringify({ ...session, tipoUsuario: role }))
    assert.deepEqual(createSessionState(storage).getSnapshot().user, { ...session, tipoUsuario: role })
    assert.equal(values.has(USERS_KEY), false)
  }
})
test('autenticar guarda la sesión y notifica inmediatamente usando el nombre real de cada cuenta', () => {
  const { state, values } = setup()
  const second = { ...account, correo: 'tomas@duoc.cl', nombre: 'Tomás' }
  values.set(USERS_KEY, JSON.stringify([account, second]))
  let notifications = 0
  const unsubscribe = state.subscribe(() => notifications++)
  for (const user of [account, second]) {
    const result = state.loginService.authenticate(user.correo, user.contrasena)
    assert.equal(result.status, 'success')
    assert.equal(JSON.parse(values.get(LOGIN_SESSION_KEY)).nombre, user.nombre)
    assert.equal(state.getSnapshot().user.nombre, user.nombre)
  }
  assert.equal(notifications, 2)
  unsubscribe()
})
test('credenciales incorrectas o fallo de guardado no publican una autenticación nueva', () => {
  const { state, values, storage } = setup()
  values.set(USERS_KEY, JSON.stringify([account])); state.getSnapshot()
  assert.equal(state.loginService.authenticate(account.correo, 'Otra2026##').status, 'incorrect')
  assert.equal(state.getSnapshot().user, null)
  state.loginService.authenticate(account.correo, account.contrasena)
  const original = values.get(LOGIN_SESSION_KEY)
  storage.setItem = () => { throw new Error('QuotaExceededError') }
  assert.throws(() => state.loginService.authenticate(account.correo, account.contrasena))
  assert.equal(values.get(LOGIN_SESSION_KEY), original)
  assert.equal(state.getSnapshot().user.nombre, account.nombre)
})
test('cerrar sesión elimina únicamente su clave y conserva usuarios, carrito, pedidos y preferencias', () => {
  const { state, values, removed } = setup()
  values.set(LOGIN_SESSION_KEY, JSON.stringify(session))
  for (const key of [USERS_KEY, 'carritoAlbedo', 'ordenesAlbedo', 'albedo:theme:guest', 'albedo:theme:user:111111111']) values.set(key, 'conservar')
  state.getSnapshot(); state.logout()
  assert.deepEqual(removed, [LOGIN_SESSION_KEY])
  assert.equal(state.getSnapshot().user, null)
  assert.equal(values.has(LOGIN_SESSION_KEY), false)
  for (const key of [USERS_KEY, 'carritoAlbedo', 'ordenesAlbedo', 'albedo:theme:guest', 'albedo:theme:user:111111111']) assert.equal(values.get(key), 'conservar')
})
test('un fallo al eliminar no afirma cierre ni cambia la sesión anterior', () => {
  const { state, values, storage } = setup()
  values.set(LOGIN_SESSION_KEY, JSON.stringify(session)); state.getSnapshot()
  storage.removeItem = () => { throw new Error('Bloqueado') }
  assert.throws(() => state.logout())
  assert.equal(state.getSnapshot().user.nombre, account.nombre)
  assert.equal(values.get(LOGIN_SESSION_KEY), JSON.stringify(session))
})
test('otra instancia recupera login, cambio de cuenta y logout al recibir notificación de almacenamiento', () => {
  const { state, values, storage } = setup()
  const other = createSessionState(storage)
  values.set(USERS_KEY, JSON.stringify([account]))
  assert.equal(other.getSnapshot().user, null)
  state.loginService.authenticate(account.correo, account.contrasena)
  other.storageChanged(LOGIN_SESSION_KEY)
  assert.equal(other.getSnapshot().user.nombre, account.nombre)
  state.logout(); other.storageChanged(LOGIN_SESSION_KEY)
  assert.equal(other.getSnapshot().user, null)
  values.set(LOGIN_SESSION_KEY, JSON.stringify({ ...session, nombre: 'Beatriz' })); other.storageChanged(LOGIN_SESSION_KEY)
  assert.equal(other.getSnapshot().user.nombre, 'Beatriz')
  values.clear(); other.storageChanged(null)
  assert.equal(other.getSnapshot().user, null)
})
test('snapshot estable, claves ajenas ignoradas, suscripción limpiada y lectura bloqueada segura', () => {
  const { state, values, storage } = setup()
  const before = state.getSnapshot()
  values.set(LOGIN_SESSION_KEY, JSON.stringify(session)); state.storageChanged('otra-clave')
  assert.equal(state.getSnapshot(), before)
  let notifications = 0
  const unsubscribe = state.subscribe(() => notifications++)
  state.storageChanged(LOGIN_SESSION_KEY)
  assert.equal(notifications, 1)
  const valid = state.getSnapshot(); state.refresh()
  assert.equal(state.getSnapshot(), valid)
  unsubscribe()
  storage.getItem = () => { throw new Error('Storage bloqueado') }; state.refresh()
  assert.equal(state.getSnapshot().user, null)
  assert.ok(state.getSnapshot().error)
  assert.equal(notifications, 1)
})
