export type Theme = 'light' | 'dark'

// La autenticación futura podrá proporcionar un identificador estable al provider.
export function getThemeStorageKey(userId?: string) {
  return userId === undefined
    ? 'albedo:theme:guest'
    : `albedo:theme:user:${encodeURIComponent(userId)}`
}

export function createThemeStore(storageKey: string) {
  function readPreference(): Theme {
    try {
      return window.localStorage.getItem(storageKey) === 'dark' ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  }

  let theme = readPreference()
  const listeners = new Set<() => void>()

  function notify() {
    listeners.forEach((listener) => listener())
  }

  function onStorage(event: StorageEvent) {
    if (event.key !== storageKey && event.key !== null) return
    try {
      if (event.storageArea !== window.localStorage) return
    } catch {
      return
    }
    theme = readPreference()
    notify()
  }

  return {
    getSnapshot: () => theme,
    subscribe(listener: () => void) {
      if (listeners.size === 0) {
        window.addEventListener('storage', onStorage)
        // Recupera cambios ocurridos entre la creación y la suscripción.
        theme = readPreference()
      }
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
        if (listeners.size === 0) window.removeEventListener('storage', onStorage)
      }
    },
    setTheme(nextTheme: Theme) {
      theme = nextTheme
      try {
        window.localStorage.setItem(storageKey, nextTheme)
      } catch {
        // El cambio sigue funcionando en memoria si el navegador bloquea storage.
      }
      notify()
    },
  }
}
