
import type { StoragePort } from '../data/productTypes.ts'

export const CART_KEY = 'carritoAlbedo'

export type CartItem = {
  id: string
  nombre: string
  precio: number
  imagen: string
  color: string
  cantidad: number
}

export function createCartRepository(
  storage: StoragePort,
  onChange = () => {}
) {
  function list(): CartItem[] {
    const raw = storage.getItem(CART_KEY)

    if (raw === null) return []

    const rows: unknown = JSON.parse(raw)

    if (
      !Array.isArray(rows) ||
      !rows.every(
        (item) =>
          item &&
          typeof item === 'object' &&
          typeof item.id === 'string' &&
          typeof item.nombre === 'string' &&
          typeof item.imagen === 'string' &&
          typeof item.color === 'string' &&
          Number.isFinite(item.precio) &&
          item.precio >= 0 &&
          Number.isSafeInteger(item.cantidad) &&
          item.cantidad >= 1 &&
          Number.isFinite(item.precio * item.cantidad)
      )
    ) {
      throw new Error('Carrito guardado inválido')
    }

    return rows
  }

  function save(cart: CartItem[]) {
    if (!Number.isSafeInteger(cart.reduce((sum, item) => sum + item.cantidad, 0)) ||
      !Number.isFinite(cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0))) {
      throw new Error('El carrito supera el límite numérico permitido')
    }
    storage.setItem(CART_KEY, JSON.stringify(cart))
    onChange()
  }

  return {
    list,

    add(item: CartItem) {
      if (!Number.isSafeInteger(item.cantidad) || item.cantidad < 1 ||
        typeof item.id !== 'string' || !item.id || typeof item.nombre !== 'string' || typeof item.imagen !== 'string' ||
        typeof item.color !== 'string' || !Number.isFinite(item.precio) || item.precio < 0) {
        throw new Error('Cantidad inválida')
      }

      const cart = list()

      const existing = cart.find(
        (product) =>
          product.id === item.id &&
          product.color === item.color
      )

      if (existing) {
        existing.cantidad += item.cantidad
      } else {
        cart.push({ ...item })
      }

      save(cart)
    },

    updateQuantity(id: string, color: string, cantidad: number) {
      if (!Number.isSafeInteger(cantidad) || cantidad < 1) {
        throw new Error('Cantidad inválida')
      }

      const cart = list()

      const product = cart.find(
        (item) => item.id === id && item.color === color
      )

      if (!product) {
        throw new Error('Producto no encontrado en el carrito')
      }

      product.cantidad = cantidad
      save(cart)
    },

    remove(id: string, color: string) {
      const cart = list()

      const updated = cart.filter(
        (item) => !(item.id === id && item.color === color)
      )

      if (updated.length !== cart.length) {
        save(updated)
      }
    },

    clear() {
      save([])
    },
  }
}
