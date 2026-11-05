import type { StoragePort } from '../data/productTypes.ts'
import { CART_KEY, createCartRepository, type CartItem } from './cartRepository.ts'

export type CartSnapshot = { items: CartItem[]; count: number; total: number; error: string }
const empty: CartSnapshot = { items: [], count: 0, total: 0, error: '' }

export function createCartState(storage: StoragePort) {
  let snapshot = empty
  let initialized = false
  const listeners = new Set<() => void>()
  const repository = createCartRepository(storage, refresh)
  function refresh() {
    let next: CartSnapshot
    try {
      const items = repository.list()
      const count = items.reduce((sum, item) => sum + item.cantidad, 0)
      const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
      if (!Number.isSafeInteger(count) || !Number.isFinite(total)) throw new Error('Totales inválidos')
      next = { items, count, total, error: '' }
    } catch {
      next = { ...snapshot, error: 'No se pudo leer el carrito guardado. Tus datos no se han sobrescrito. Revisa el almacenamiento y vuelve a intentar.' }
    }
    initialized = true
    if (JSON.stringify(next) !== JSON.stringify(snapshot)) {
      snapshot = next
      listeners.forEach((listener) => listener())
    }
  }
  return {
    repository, refresh,
    getSnapshot() { if (!initialized) refresh(); return snapshot },
    getServerSnapshot: () => empty,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener) } },
    storageChanged(key: string | null) { if (key === CART_KEY || key === null) refresh() },
  }
}
