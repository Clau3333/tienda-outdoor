import { productosBase } from '../data/products.ts'
import type { Product, ProductColor, StoragePort } from '../data/productTypes.ts'

export const PRODUCTS_KEY = 'productosAdminAlbedo'
const clone = <T,>(value: T): T => structuredClone(value)

function normalizeProduct(value: unknown): Product {
  if (!value || typeof value !== 'object') throw new Error('Producto inválido')
  const row = value as Record<string, unknown>
  const base = productosBase.find((product) => product.id === row.id)
  const price = Number(row.precio)
  if (typeof row.id !== 'string' || !row.id.trim() || typeof row.nombre !== 'string'
    || !row.nombre.trim() || typeof row.categoria !== 'string' || !row.categoria.trim()
    || !Number.isFinite(price) || price < 0) throw new Error('Datos de producto inválidos')
  const colors = row.colores ?? base?.colores ?? []
  if (!Array.isArray(colors) || !colors.every((color: unknown) => {
    if (!color || typeof color !== 'object') return false
    const item = color as Record<string, unknown>
    return ['nombre', 'color', 'imagen'].every((key) => typeof item[key] === 'string')
  })) throw new Error('Colores inválidos')
  return {
    id: row.id, nombre: row.nombre, categoria: row.categoria, precio: price,
    descripcion: typeof row.descripcion === 'string' ? row.descripcion : '',
    imagen: typeof row.imagen === 'string' && row.imagen ? row.imagen : base?.imagen ?? 'img/logo-albedo.png',
    colores: clone(colors as ProductColor[]),
    ...(row.oferta === true ? { oferta: true } : {}),
    ...(typeof row.codigo === 'string' ? { codigo: row.codigo } : {}),
    ...(row.stock !== undefined ? { stock: Number(row.stock) } : {}),
    ...(row.stockCritico !== undefined ? { stockCritico: row.stockCritico === '' ? '' : Number(row.stockCritico) } : {}),
  }
}

// Puerto inyectable para reutilizar la lógica en Jasmine/Karma sin depender del DOM.
export function createProductRepository(storage: StoragePort, onChange = () => {}) {
  function list(): Product[] {
    const raw = storage.getItem(PRODUCTS_KEY)
    if (raw === null) return clone(productosBase)
    const rows: unknown = JSON.parse(raw)
    if (!Array.isArray(rows)) throw new Error('Catálogo guardado inválido')
    const products = rows.map(normalizeProduct)
    if (new Set(products.map((p) => p.id)).size !== products.length) throw new Error('Identificadores duplicados')
    return products
  }
  function save(products: Product[]) {
    storage.setItem(PRODUCTS_KEY, JSON.stringify(products))
    onChange()
  }
  return {
    list,
    get: (id: string) => list().find((product) => product.id === id),
    create(product: Product) {
      const products = list()
      if (products.some((p) => p.id === product.id)) throw new Error('El producto ya existe')
      const created = normalizeProduct(product)
      save([...products, created])
      return created
    },
    update(id: string, changes: Partial<Omit<Product, 'id'>>) {
      const products = list()
      const index = products.findIndex((p) => p.id === id)
      if (index === -1) throw new Error('Producto no encontrado')
      const updated = normalizeProduct({ ...products[index], ...changes, id })
      products[index] = updated
      save(products)
      return updated
    },
    remove(id: string) {
      const products = list()
      if (!products.some((p) => p.id === id)) throw new Error('Producto no encontrado')
      save(products.filter((p) => p.id !== id))
    },
  }
}
