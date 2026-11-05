import type { StoragePort } from '../data/productTypes.ts'
import { createLoginService, LOGIN_SESSION_KEY, type LoginRole } from './loginService.ts'

export type SessionUser = { run: string; nombre: string; apellidos: string; correo: string; tipoUsuario: LoginRole }
export type SessionSnapshot = { user: SessionUser | null; error: string }
export type SessionStoragePort = StoragePort & Pick<Storage, 'removeItem'>
const visitor: SessionSnapshot = { user: null, error: '' }

function sessionUser(value: unknown): SessionUser {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Sesión inválida')
  const row = value as Record<string, unknown>
  if (typeof row.nombre !== 'string' || !row.nombre.trim() || typeof row.correo !== 'string'
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.correo.trim())
    || typeof row.tipoUsuario !== 'string'
    || !['Cliente', 'Administrador', 'Vendedor'].includes(row.tipoUsuario)) throw new Error('Sesión inválida')
  return { run: typeof row.run === 'string' ? row.run : '', nombre: row.nombre.trim(),
    apellidos: typeof row.apellidos === 'string' ? row.apellidos : '', correo: row.correo,
    tipoUsuario: row.tipoUsuario as LoginRole }
}

// Solo observa la sesión existente. La creación sigue correspondiendo al Login real.
export function createSessionState(storage: SessionStoragePort) {
  let snapshot = visitor
  let initialized = false
  const listeners = new Set<() => void>()
  function refresh() {
    let next: SessionSnapshot
    try {
      const raw = storage.getItem(LOGIN_SESSION_KEY)
      next = raw === null ? visitor : { user: sessionUser(JSON.parse(raw)), error: '' }
    } catch {
      next = { user: null, error: 'No se pudo leer una sesión válida. Revisa el almacenamiento o vuelve a iniciar sesión.' }
    }
    initialized = true
    if (JSON.stringify(next) !== JSON.stringify(snapshot)) {
      snapshot = next
      listeners.forEach((listener) => listener())
    }
  }
  return {
    loginService: createLoginService(storage, refresh),
    refresh,
    getSnapshot() { if (!initialized) refresh(); return snapshot },
    getServerSnapshot: () => visitor,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener) } },
    storageChanged(key: string | null) { if (key === LOGIN_SESSION_KEY || key === null) refresh() },
    logout() {
      // No usar clear(): usuarios, carrito, órdenes y preferencias permanecen intactos.
      storage.removeItem(LOGIN_SESSION_KEY)
      refresh()
    },
  }
}
