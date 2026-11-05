import { regiones } from '../data/regions.ts'
import { validatePassword } from './passwordPolicy.ts'

export const emptyRegistration = {
  rutNumero: '', digitoVerificador: '', nombre: '', apellidos: '', correo: '', fechaNacimiento: '',
  region: '', comuna: '', calle: '', numeroDomicilio: '', tipoDomicilio: '', numeroUnidad: '', codigoPostal: '',
  contrasena: '', confirmarContrasena: '',
}
export type RegistrationValues = typeof emptyRegistration
export type RegistrationField = keyof RegistrationValues
export type RegistrationErrors = Partial<Record<RegistrationField, string>>

export function calculateRutDigit(body: string) {
  let sum = 0
  let factor = 2
  for (let index = body.length - 1; index >= 0; index--) {
    sum += Number(body[index]) * factor
    factor = factor === 7 ? 2 : factor + 1
  }
  const digit = 11 - sum % 11
  return digit === 11 ? '0' : digit === 10 ? 'K' : String(digit)
}
export function validateRut(body: string, digit: string) {
  if (!body) return 'Debe ingresar el RUT'
  if (!/^[0-9]{6,8}$/.test(body)) return 'El RUT debe contener entre 6 y 8 números'
  if (!digit) return 'Debe ingresar el dígito verificador'
  if (!/^[0-9K]$/.test(digit.toUpperCase())) return 'El dígito verificador debe ser un número de 0 a 9 o K'
  return calculateRutDigit(body) === digit.toUpperCase() ? '' : 'El RUT ingresado no es válido'
}
export function localDateValue(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
export function validateRegistration(values: RegistrationValues, now = new Date()): RegistrationErrors {
  const errors: RegistrationErrors = {}
  const names = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/u
  const rutError = validateRut(values.rutNumero.trim(), values.digitoVerificador.trim())
  if (rutError) errors.rutNumero = rutError
  if (!values.nombre.trim() || values.nombre.trim().length > 50 || !names.test(values.nombre.trim())) errors.nombre = 'Ingrese un nombre válido'
  if (!values.apellidos.trim() || values.apellidos.trim().length > 100 || !names.test(values.apellidos.trim())) errors.apellidos = 'Ingrese apellidos válidos'
  const email = values.correo.trim().toLowerCase()
  if (!email || email.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.correo = 'El formato del correo no es válido'
  else if (!['gmail.com', 'duoc.cl', 'profesor.duoc.cl'].includes(email.split('@')[1])) errors.correo = 'Solo se acepta @gmail.com, @duoc.cl o @profesor.duoc.cl'
  if (values.fechaNacimiento) {
    const date = new Date(values.fechaNacimiento + 'T00:00:00')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(values.fechaNacimiento) || Number.isNaN(date.getTime()) || date.getFullYear() < 1900 || localDateValue(date) !== values.fechaNacimiento) errors.fechaNacimiento = 'La fecha de nacimiento no es válida'
    else if (values.fechaNacimiento > localDateValue(now)) errors.fechaNacimiento = 'La fecha de nacimiento no puede ser futura'
  }
  const communes = Object.hasOwn(regiones, values.region) ? regiones[values.region] : []
  if (!communes.length) errors.region = 'Debe seleccionar una región'
  if (!communes.includes(values.comuna)) errors.comuna = 'Debe seleccionar una comuna de la región indicada'
  if (values.calle.trim().length < 3 || values.calle.trim().length > 150) errors.calle = 'Ingrese una calle o avenida válida'
  if (!/^[0-9]{1,7}$/.test(values.numeroDomicilio.trim())) errors.numeroDomicilio = 'Ingrese solamente números'
  if (!['Casa', 'Departamento'].includes(values.tipoDomicilio)) errors.tipoDomicilio = 'Debe seleccionar Casa o Departamento'
  if (values.tipoDomicilio === 'Departamento' && !/^[0-9]{1,6}$/.test(values.numeroUnidad.trim())) errors.numeroUnidad = 'Ingrese el número del departamento'
  if (!/^[0-9]{7}$/.test(values.codigoPostal.trim())) errors.codigoPostal = 'El código postal debe contener exactamente 7 números'
  const passwordError = validatePassword(values.contrasena)
  if (passwordError) errors.contrasena = passwordError
  if (passwordError) errors.confirmarContrasena = 'Primero ingrese una contraseña válida'
  else if (values.confirmarContrasena !== values.contrasena) errors.confirmarContrasena = 'Las contraseñas no coinciden'
  return errors
}
