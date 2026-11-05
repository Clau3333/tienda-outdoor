import { useTheme } from '../theme/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="theme-control">
      <button
        className="theme-toggle"
        type="button"
        aria-pressed={theme === 'dark'}
        aria-label="Modo nocturno"
        title={theme === 'dark' ? 'Activar modo claro' : 'Activar modo nocturno'}
        onClick={toggleTheme}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true">
          {theme === 'dark' ? (
            <path d="M20.5 13a8.5 8.5 0 0 1-9.5-9.5A8.5 8.5 0 1 0 20.5 13Z" />
          ) : (
            <>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </>
          )}
        </svg>
      </button>
      <span className="visually-hidden" role="status">
        Tema actual: {theme === 'dark' ? 'nocturno' : 'claro'}
      </span>
    </div>
  )
}
