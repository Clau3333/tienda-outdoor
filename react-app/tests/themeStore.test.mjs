import assert from 'node:assert/strict'
import { afterEach, beforeEach, test } from 'node:test'
import { createThemeStore, getThemeStorageKey } from '../src/theme/themeStore.ts'

const originalWindow = globalThis.window
let values
let handlers
let storage
const guestKey = getThemeStorageKey()

beforeEach(() => {
  values = new Map()
  handlers = new Set()
  storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  }
  globalThis.window = {
    localStorage: storage,
    addEventListener: (type, handler) => { if (type === 'storage') handlers.add(handler) },
    removeEventListener: (type, handler) => { if (type === 'storage') handlers.delete(handler) },
  }
})

afterEach(() => {
  if (originalWindow === undefined) delete globalThis.window
  else globalThis.window = originalWindow
})

function storageEvent(key, storageArea = storage) {
  handlers.forEach((handler) => handler({ key, storageArea }))
}

test('sin preferencia se inicia en claro; una preferencia inválida también', () => {
  assert.equal(createThemeStore(guestKey).getSnapshot(), 'light')
  values.set(guestKey, 'desconocido')
  assert.equal(createThemeStore(guestKey).getSnapshot(), 'light')
})

test('recupera la preferencia nocturna guardada', () => {
  values.set(guestKey, 'dark')
  assert.equal(createThemeStore(guestKey).getSnapshot(), 'dark')
})

test('cambiar tema persiste y notifica a los componentes de la misma pestaña', () => {
  const store = createThemeStore(guestKey)
  let notifications = 0
  store.subscribe(() => notifications++)
  store.setTheme('dark')
  assert.equal(store.getSnapshot(), 'dark')
  assert.equal(values.get(guestKey), 'dark')
  assert.equal(notifications, 1)
  assert.equal(createThemeStore(guestKey).getSnapshot(), 'dark')
})

test('un evento storage del mismo origen actualiza el tema sin reescribirlo', () => {
  const store = createThemeStore(guestKey)
  store.subscribe(() => {})
  values.set(guestKey, 'dark')
  storageEvent(guestKey)
  assert.equal(store.getSnapshot(), 'dark')
})

test('ignora claves ajenas y eventos de sessionStorage', () => {
  const store = createThemeStore(guestKey)
  store.subscribe(() => {})
  values.set(guestKey, 'dark')
  storageEvent('otra-clave')
  assert.equal(store.getSnapshot(), 'light')
  storageEvent(guestKey, {})
  assert.equal(store.getSnapshot(), 'light')
})

test('borrar la preferencia o limpiar storage restablece claro', () => {
  const store = createThemeStore(guestKey)
  store.subscribe(() => {})
  store.setTheme('dark')
  values.delete(guestKey)
  storageEvent(guestKey)
  assert.equal(store.getSnapshot(), 'light')
  store.setTheme('dark')
  values.clear()
  storageEvent(null)
  assert.equal(store.getSnapshot(), 'light')
})

test('limpia la suscripción al desmontar y recupera cambios al volver', () => {
  const store = createThemeStore(guestKey)
  const unsubscribe = store.subscribe(() => {})
  assert.equal(handlers.size, 1)
  unsubscribe()
  assert.equal(handlers.size, 0)
  values.set(guestKey, 'dark')
  store.subscribe(() => {})
  assert.equal(store.getSnapshot(), 'dark')
})

test('el almacenamiento bloqueado permite alternar en memoria', () => {
  storage.getItem = () => { throw new Error('Storage bloqueado') }
  storage.setItem = () => { throw new Error('Storage bloqueado') }
  const store = createThemeStore(guestKey)
  store.subscribe(() => {})
  assert.equal(store.getSnapshot(), 'light')
  assert.doesNotThrow(() => store.setTheme('dark'))
  assert.equal(store.getSnapshot(), 'dark')
  store.setTheme('light')
  assert.equal(store.getSnapshot(), 'light')
})

test('las claves de visitante y usuarios permanecen independientes', () => {
  const userKey = getThemeStorageKey('cliente/a')
  assert.notEqual(userKey, guestKey)
  assert.notEqual(userKey, getThemeStorageKey('cliente/b'))
  const guest = createThemeStore(guestKey)
  const user = createThemeStore(userKey)
  guest.subscribe(() => {})
  user.subscribe(() => {})
  user.setTheme('dark')
  storageEvent(userKey)
  assert.equal(guest.getSnapshot(), 'light')
  assert.equal(user.getSnapshot(), 'dark')
  assert.equal(createThemeStore(userKey).getSnapshot(), 'dark')
})
