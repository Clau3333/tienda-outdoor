import { useSyncExternalStore } from 'react'
import { createSessionState } from './sessionState'

export const sessionState = createSessionState({
  getItem: (key) => window.localStorage.getItem(key),
  setItem: (key, value) => window.localStorage.setItem(key, value),
  removeItem: (key) => window.localStorage.removeItem(key),
})
export const sessionLoginService = sessionState.loginService

function subscribe(listener: () => void) {
  const unsubscribe = sessionState.subscribe(listener)
  function onStorage(event: StorageEvent) {
    try { if (event.storageArea === window.localStorage) sessionState.storageChanged(event.key) }
    catch { sessionState.refresh() }
  }
  window.addEventListener('storage', onStorage)
  sessionState.refresh()
  return () => { unsubscribe(); window.removeEventListener('storage', onStorage) }
}
export function useSession() {
  return useSyncExternalStore(subscribe, sessionState.getSnapshot, sessionState.getServerSnapshot)
}
