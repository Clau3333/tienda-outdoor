
import type { Ref } from 'react'
import { categories, legacyBase } from './navigation'
import type { CategoryKey } from './navigation'

type CategoryMenuProps = {
  menuId: string
  openCategory: CategoryKey | null
  onToggle: (category: CategoryKey) => void
  onOpen: (category: CategoryKey) => void
  onClose: () => void
  onEscape: () => void
  onButtonRef: (category: CategoryKey, element: HTMLButtonElement | null) => void
  navRef?: Ref<HTMLElement>
}

export default function CategoryMenu({
  menuId,
  openCategory,
  onToggle,
  onOpen,
  onClose,
  onEscape,
  onButtonRef,
  navRef,
}: CategoryMenuProps) {
  return (
    <nav
      className="menu-categorias"
      aria-label="Categorías de productos"
      ref={navRef}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && openCategory) {
          event.preventDefault()
          onEscape()
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          onClose()
        }
      }}
    >
      {categories.map((category) => (
        <div
          className="mega-item"
          key={category.anchor}
          onPointerEnter={(event) => {
            if (event.pointerType === 'mouse') onOpen(category.anchor)
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === 'mouse') {
              onClose()
            }
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) onClose()
          }}
        >
          <button
            className="categoria-acciones"
            type="button"
            ref={(element) => onButtonRef(category.anchor, element)}
            aria-expanded={openCategory === category.anchor}
            aria-controls={`${menuId}-${category.anchor}`}
            onClick={(event) => {
              // Un clic de mouse después del hover conserva la apertura.
              // Teclado y touch alternan el estado mediante el botón nativo.
              if (event?.nativeEvent && 'pointerType' in event.nativeEvent && event.nativeEvent.pointerType === 'mouse') {
                onOpen(category.anchor)
              } else {
                onToggle(category.anchor)
              }
            }}
          >
            <span className="mega-enlace">
              {category.label}
            </span>
          </button>

          <div
            className="mega-panel"
            id={`${menuId}-${category.anchor}`}
            hidden={openCategory !== category.anchor}
          >
            <div className="mega-menu-grid row g-4">
              <div className="mega-menu-columna col-12">
                <h2>{category.label}</h2>

                {category.products.map((product) => (
                  <a
                    key={product.id}
                    href={`${legacyBase}producto-detalle.html?id=${encodeURIComponent(product.id)}`}
                    onClick={onClose}
                  >
                    {product.name}
                  </a>
                ))}

                <a
                  className="mega-ver-todo"
                  href={`/productos.html#${category.anchor}`}
                  onClick={onClose}
                >
                  {category.allLabel}
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </nav>
  )
}
