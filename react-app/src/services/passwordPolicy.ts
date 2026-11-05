// Política compartida: mínimo autorizado por Claudio; símbolos originales de ALBEDO.
export function validatePassword(value: string): string {
  if (!value) return 'Debe ingresar su contraseña'
  if (value.length < 10) return 'La contraseña debe tener al menos 10 caracteres'
  if (/\s/.test(value)) return 'La contraseña no puede contener espacios'
  if (!/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/u.test(value)) return 'La contraseña debe contener al menos una letra'
  if (!/[0-9]/.test(value)) return 'La contraseña debe contener al menos un número'
  if (!/[%&$#/()="!]/.test(value)) return 'Debe contener un símbolo: % & $ # / ( ) = " !'
  if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9%&$#/()="!]+$/u.test(value)) return 'La contraseña contiene caracteres no permitidos'
  return ''
}
