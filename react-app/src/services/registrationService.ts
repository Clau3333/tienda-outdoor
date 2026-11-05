import type { StoragePort } from '../data/productTypes.ts'
import { readStoredUsers, USERS_KEY } from './loginService.ts'
import { validateRegistration, type RegistrationValues, type RegistrationErrors } from './registrationValidation.ts'

export type RegistrationResult = { status: 'invalid'; errors: RegistrationErrors; message: string } | { status: 'success'; message: string }
export function createRegistrationService(storage: StoragePort, now = () => new Date()) {
  return {
    register(values: RegistrationValues): RegistrationResult {
      const errors = validateRegistration(values, now())
      if (Object.keys(errors).length) return { status: 'invalid', errors, message: 'No se pudo crear la cuenta. Revisa los campos marcados en rojo.' }
      const users = readStoredUsers(storage)
      const run = values.rutNumero.trim() + values.digitoVerificador.trim().toUpperCase()
      const correo = values.correo.trim().toLowerCase()
      const duplicateRun = users.some((user) => {
        const existing = user.run || (user.rutNumero && user.digitoVerificador ? String(user.rutNumero) + String(user.digitoVerificador) : '')
        return String(existing).replace(/[.\s-]/g, '').toUpperCase() === run
      })
      if (duplicateRun) return { status: 'invalid', errors: { rutNumero: 'Este RUT ya se encuentra registrado' }, message: 'No se pudo crear la cuenta porque el RUT ya está registrado.' }
      if (users.some((user) => String(user.correo || '').trim().toLowerCase() === correo)) return {
        status: 'invalid', errors: { correo: 'Este correo ya se encuentra registrado' }, message: 'No se pudo crear la cuenta porque el correo ya está registrado.',
      }
      // Lista explícita: el formulario no puede asignar roles privilegiados ni guardar su confirmación.
      const user = {
        run, rutNumero: values.rutNumero.trim(), digitoVerificador: values.digitoVerificador.trim().toUpperCase(),
        nombre: values.nombre.trim(), apellidos: values.apellidos.trim(), correo, fechaNacimiento: values.fechaNacimiento,
        region: values.region, comuna: values.comuna, calle: values.calle.trim(), numeroDomicilio: values.numeroDomicilio.trim(),
        tipoDomicilio: values.tipoDomicilio, numeroUnidad: values.tipoDomicilio === 'Departamento' ? values.numeroUnidad.trim() : '',
        codigoPostal: values.codigoPostal.trim(), contrasena: values.contrasena, tipoUsuario: 'Cliente',
      }
      storage.setItem(USERS_KEY, JSON.stringify([...users, user]))
      return { status: 'success', message: 'Cuenta creada correctamente. Serás redirigido al inicio de sesión.' }
    },
  }
}
