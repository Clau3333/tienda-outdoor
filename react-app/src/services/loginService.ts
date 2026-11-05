import type { StoragePort } from '../data/productTypes.ts'
import { demoAdministrator } from '../data/demoAdministrator.ts'
import { validateLoginEmail, validateLoginPassword } from './loginValidation.ts'

export const USERS_KEY = 'usuariosAlbedo'
export const LOGIN_SESSION_KEY = 'usuarioSesionAlbedo'
export type LoginRole = 'Administrador' | 'Vendedor' | 'Cliente'
export type LoginSession = {
  run: string; nombre: unknown; apellidos: unknown; correo: unknown; tipoUsuario: LoginRole
}
export type LoginDestination = 'admin.html' | 'vendedor.html' | 'index.html'
type StoredUser = Record<string, unknown>
export function readStoredUsers(storage: StoragePort): StoredUser[] {
  const raw = storage.getItem(USERS_KEY)
  const records: unknown = raw === null ? [] : JSON.parse(raw)
  if (!Array.isArray(records) || !records.every((row) => row && typeof row === 'object' && !Array.isArray(row))) {
    throw new Error('Los usuarios guardados no son válidos. No se han sobrescrito tus datos.')
  }
  return records
}
export type LoginResult =
  | { status: 'invalid'; errors: { email: string; password: string }; message: string }
  | { status: 'incorrect'; message: string }
  | { status: 'success'; session: LoginSession; destination: LoginDestination }

export function createLoginService(storage: StoragePort, onSessionChange = () => {}) {
  function users(): StoredUser[] {
    return readStoredUsers(storage)
  }
  function initializeAdministrator() {
    const records = users()
    if (!records.some((user) => String(user.correo || '').trim().toLowerCase() === demoAdministrator.correo)) {
      storage.setItem(USERS_KEY, JSON.stringify([...records, demoAdministrator]))
    }
  }
  return {
    initializeAdministrator,
    authenticate(email: string, password: string): LoginResult {
      const errors = { email: validateLoginEmail(email), password: validateLoginPassword(password) }
      if (errors.email || errors.password) return { status: 'invalid', errors, message: 'Revisa los datos ingresados.' }
      initializeAdministrator()
      const user = users().find((row) => String(row.correo || '').trim().toLowerCase() === email.trim().toLowerCase()
        && String(row.contrasena || '') === password)
      if (!user) return { status: 'incorrect', message: 'Correo o contraseña incorrectos.' }
      const role: LoginRole = user.tipoUsuario === 'Administrador' || user.tipoUsuario === 'Vendedor' ? user.tipoUsuario : 'Cliente'
      const run = user.run ? String(user.run).toUpperCase()
        : user.rutNumero && user.digitoVerificador ? String(user.rutNumero) + String(user.digitoVerificador).toUpperCase() : ''
      const session: LoginSession = { run, nombre: user.nombre, apellidos: user.apellidos, correo: user.correo, tipoUsuario: role }
      storage.setItem(LOGIN_SESSION_KEY, JSON.stringify(session))
      onSessionChange()
      return { status: 'success', session,
        destination: role === 'Administrador' ? 'admin.html' : role === 'Vendedor' ? 'vendedor.html' : 'index.html' }
    },
  }
}
