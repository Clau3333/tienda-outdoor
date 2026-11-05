import { useSyncExternalStore } from 'react'
import { productosBase } from '../data/products'
import { createProductRepository, PRODUCTS_KEY } from './productRepository'

const initialSnapshot = { products: productosBase, error: '' }
let snapshot = initialSnapshot
let initialized = false
const listeners = new Set<() => void>()

export const productRepository = createProductRepository({
  getItem: (key) => window.localStorage.getItem(key),
  setItem: (key, value) => window.localStorage.setItem(key, value),
}, refresh)

function refresh() {
  try {
    snapshot = { products: productRepository.list(), error: '' }
  } catch {
    snapshot = { products: productosBase, error: 'No se pudieron leer los productos guardados. Se muestra el catálogo original sin sobrescribir tus datos.' }
  }
  initialized = true
  listeners.forEach((listener) => listener())
}
function getSnapshot() {
  if (!initialized) refresh()
  return snapshot
}
function onStorage(event: StorageEvent) {
  if ((event.key === PRODUCTS_KEY || event.key === null) && event.storageArea === window.localStorage) refresh()
}
function subscribe(listener: () => void) {
  if (!listeners.size) {
    window.addEventListener('storage', onStorage)
    refresh()
  }
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
    if (!listeners.size) window.removeEventListener('storage', onStorage)
  }
}
export function useProducts() {
  return useSyncExternalStore(subscribe, getSnapshot, () => initialSnapshot)
}
