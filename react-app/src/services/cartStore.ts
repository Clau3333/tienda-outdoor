import { useSyncExternalStore } from 'react'
import { createCartState } from './cartState'

export const cartState = createCartState({
  getItem: (key) => window.localStorage.getItem(key),
  setItem: (key, value) => window.localStorage.setItem(key, value),
})
export const cartRepository = cartState.repository

function subscribe(listener: () => void) {
  const unsubscribe = cartState.subscribe(listener)
  function onStorage(event: StorageEvent) {
    try {
      if (event.storageArea === window.localStorage) cartState.storageChanged(event.key)
    } catch { cartState.refresh() }
  }
  window.addEventListener('storage', onStorage)
  cartState.refresh()
  return () => {
    unsubscribe()
    window.removeEventListener('storage', onStorage)
  }
}
export function useCart() {
  return useSyncExternalStore(subscribe, cartState.getSnapshot, cartState.getServerSnapshot)
}
export function useCartCount() {
  return useCart().count
}
