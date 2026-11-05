export { validatePassword as validateLoginPassword } from './passwordPolicy.ts'
// Reglas de correo conservadas de Sitio Old/login.js.
export function validateLoginEmail(original: string): string {
  const value = original.trim().toLowerCase()
  if (!value) return 'Debe ingresar su correo electrónico'
  if (/\s/.test(original)) return 'El correo no puede contener espacios'
  if (value.length > 100) return 'El correo no puede superar los 100 caracteres'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'El formato del correo no es válido'
  if (!['gmail.com', 'duoc.cl', 'profesor.duoc.cl'].includes(value.split('@')[1])) {
    return 'Solo se acepta @gmail.com, @duoc.cl o @profesor.duoc.cl'
  }
  return ''
}

