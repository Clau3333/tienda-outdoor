import type { Product } from '../data/productTypes.ts'
import type { CartItem } from './cartRepository.ts'

export function selectedColor(product: Product, name: string | null) {
  return product.colores.find((color) => color.nombre === name)
    ?? product.colores.find((color) => color.imagen === product.imagen)
}

export function productCartItem(product: Product, colorName: string | null): CartItem {
  const color = selectedColor(product, colorName)
  return { id: product.id, nombre: product.nombre, precio: product.precio,
    imagen: color?.imagen ?? product.imagen, color: color?.nombre ?? '', cantidad: 1 }
}

export function formatPrice(price: number) {
  return '$' + price.toLocaleString('es-CL', { maximumFractionDigits: 2 })
}

export function productImageUrl(path: string) {
  return path.startsWith('img/') ? '/Sitio%20Old/' + path : path
}
