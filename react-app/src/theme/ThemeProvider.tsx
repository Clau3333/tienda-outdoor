import { useLayoutEffect, useMemo, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'
import { ThemeContext } from './ThemeContext'
import { createThemeStore, getThemeStorageKey } from './themeStore'
import type { Theme } from './themeStore'

type ThemeProviderProps = {
  children: ReactNode
  userId?: string
}

export default function ThemeProvider({ children, userId }: ThemeProviderProps) {
  const store = useMemo(() => createThemeStore(getThemeStorageKey(userId)), [userId])
  const theme = useSyncExternalStore<Theme>(store.subscribe, store.getSnapshot, () => 'light')

  useLayoutEffect(() => {
    document.documentElement.dataset.bsTheme = theme
    document.documentElement.style.colorScheme = theme
  }, [theme])

  const value = useMemo(() => ({
    theme,
    setTheme: store.setTheme,
    toggleTheme: () => store.setTheme(store.getSnapshot() === 'light' ? 'dark' : 'light'),
  }), [store, theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
