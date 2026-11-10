import { useEffect, useId, useReducer, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import CategoryMenu from './CategoryMenu'
import { categoryMenuReducer, initialMenuState } from './categoryMenuState'
import type { CategoryKey } from './navigation'

export default function Navbar() {
  const location = useLocation()
  const [state, dispatch] = useReducer(categoryMenuReducer, location.key, initialMenuState)
  const menuId = useId()
  const nav = useRef<HTMLElement>(null)
  const buttons = useRef<Partial<Record<CategoryKey, HTMLButtonElement | null>>>({})

  // Ajuste condicionado a una entrada de historial distinta, sin remontar el tema.
  if (state.locationKey !== location.key) {
    dispatch({ type: 'navigate', locationKey: location.key })
  }

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !nav.current?.contains(event.target)) {
        dispatch({ type: 'close' })
      }
    }
    const closeOnLink = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('a[href]')) {
        dispatch({ type: 'close' })
      }
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('click', closeOnLink)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('click', closeOnLink)
    }
  }, [])

  return (
    <CategoryMenu menuId={menuId} navRef={nav}
      openCategory={state.locationKey === location.key ? state.category : null}
      onToggle={(category) => dispatch({ type: 'toggle', category, locationKey: location.key })}
      onOpen={(category) => dispatch({ type: 'open', category, locationKey: location.key })}
      onClose={() => dispatch({ type: 'close' })}
      onEscape={() => {
        if (state.category) buttons.current[state.category]?.focus()
        dispatch({ type: 'close' })
      }}
      onButtonRef={(category, element) => { buttons.current[category] = element }} />
  )
}
