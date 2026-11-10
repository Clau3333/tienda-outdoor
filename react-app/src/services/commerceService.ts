import type { StoragePort } from '../data/productTypes'
import type { Order } from './checkoutService.ts'
import { ORDERS_KEY } from './checkoutService.ts'
import { readStoredUsers, USERS_KEY } from './loginService.ts'
import type { SessionUser } from './sessionState'
import { validateRegistration } from './registrationValidation.ts'
import type { RegistrationValues } from './registrationValidation.ts'
import { regiones } from '../data/regions.ts'

export type Delivery = {
  nombre: string; apellidos: string; correo: string; telefono: string
  region: string; comuna: string; calle: string; numero: string; unidad: string
  metodo: 'domicilio' | 'retiro'
}
export const emptyDelivery: Delivery = { nombre: '', apellidos: '', correo: '', telefono: '', region: '', comuna: '', calle: '', numero: '', unidad: '', metodo: 'domicilio' }
export function validateDelivery(value: Delivery): string {
  if (!value.nombre.trim() || value.nombre.length > 50 || !value.apellidos.trim() || value.apellidos.length > 100) return 'Ingresa nombre y apellidos válidos.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.correo) || value.correo.length > 100) return 'Ingresa un correo válido.'
  if (!/^\+?[0-9 ]{8,15}$/.test(value.telefono)) return 'Ingresa un teléfono válido.'
  if (value.metodo !== 'domicilio' && value.metodo !== 'retiro') return 'Selecciona una entrega válida.'
  if (value.metodo === 'domicilio' && (!Object.hasOwn(regiones, value.region) || !regiones[value.region]?.includes(value.comuna) || value.calle.trim().length < 3 || value.calle.length > 150 || !/^\d{1,7}$/.test(value.numero) || value.unidad.length > 20)) return 'Completa región, comuna, calle y número válidos.'
  return ''
}
export function deliveryFor(storage: StoragePort, user: SessionUser | null): Delivery {
  if (!user) return { ...emptyDelivery }
  const record = readStoredUsers(storage).find((row) => String(row.correo).toLowerCase() === user.correo.toLowerCase())
  const field = (key: string) => typeof record?.[key] === 'string' ? record[key] as string : ''
  return { ...emptyDelivery, nombre: user.nombre, apellidos: user.apellidos, correo: user.correo,
    telefono: field('telefono'), region: field('region'), comuna: field('comuna'), calle: field('calle'), numero: field('numeroDomicilio'), unidad: field('numeroUnidad') }
}
export type ShopOrder = Order & { entrega?: Delivery }
export const orderStatuses = ['Pendiente', 'En preparación', 'Enviado', 'Entregado', 'Cancelado'] as const
export function readOrders(storage: StoragePort): ShopOrder[] {
  const rows: unknown = JSON.parse(storage.getItem(ORDERS_KEY) ?? '[]')
  if (!Array.isArray(rows) || !rows.every((row) => row && typeof row === 'object' && typeof row.id === 'string'
    && row.cliente && typeof row.cliente.correo === 'string' && Number.isFinite(row.total) && row.total >= 0
    && Array.isArray(row.productos) && row.productos.every((item: Record<string, unknown>) => item && typeof item.nombre === 'string' && Number.isFinite(item.precio) && Number.isFinite(item.subtotal) && Number.isSafeInteger(item.cantidad)))) throw new Error('Órdenes inválidas; no se sobrescribieron datos.')
  return rows
}
export function ordersFor(storage: StoragePort, user: SessionUser | null) {
  if (!user) return []
  return readOrders(storage).filter((order) => user.tipoUsuario !== 'Cliente' || order.cliente?.correo?.toLowerCase() === user.correo.toLowerCase())
}
export function changeOrderStatus(storage: StoragePort, user: SessionUser | null, id: string, status: string) {
  if (user?.tipoUsuario !== 'Administrador') throw new Error('Solo el administrador puede cambiar estados.')
  if (!orderStatuses.some((item) => item === status)) throw new Error('Estado inválido.')
  const rows = readOrders(storage)
  const order = rows.find((row) => row.id === id)
  if (!order) throw new Error('Orden inexistente.')
  order.estado = status
  storage.setItem(ORDERS_KEY, JSON.stringify(rows))
}
export function saveManagedUser(storage: StoragePort, actor: SessionUser | null, values: RegistrationValues, role: string, originalEmail?: string) {
  if (actor?.tipoUsuario !== 'Administrador') throw new Error('Acceso no permitido.')
  if (!['Cliente', 'Vendedor', 'Administrador'].includes(role)) throw new Error('Rol inválido.')
  const errors = validateRegistration(values)
  if (Object.keys(errors).length) throw new Error(Object.values(errors).join(' '))
  const rows = readStoredUsers(storage)
  const index = originalEmail ? rows.findIndex((row) => row.correo === originalEmail) : -1
  if (originalEmail && index < 0) throw new Error('Usuario inexistente.')
  const correo = values.correo.trim().toLowerCase()
  const run = values.rutNumero.trim() + values.digitoVerificador.trim().toUpperCase()
  if (rows.some((row, i) => i !== index && (String(row.correo).toLowerCase() === correo || String(row.run) === run))) throw new Error('Correo o RUT duplicado.')
  if (originalEmail === actor.correo && (role !== 'Administrador' || correo !== actor.correo)) throw new Error('No puedes cambiar tu propio rol ni correo durante la sesión.')
  const { confirmarContrasena: confirmation, ...fields } = values
  void confirmation
  const record = { ...(index >= 0 ? rows[index] : {}), ...fields, correo, run, tipoUsuario: role }
  if (index >= 0) rows[index] = record
  else rows.push(record)
  storage.setItem(USERS_KEY, JSON.stringify(rows))
}
