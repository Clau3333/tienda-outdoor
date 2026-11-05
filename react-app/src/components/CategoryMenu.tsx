import type { Ref } from 'react'
import { categories, legacyBase } from './navigation'
import type { CategoryKey } from './navigation'

type CategoryMenuProps = {
  menuId: string
  openCategory: CategoryKey | null
  onToggle: (category: CategoryKey) => void
  onClose: () => void
  onEscape: () => void
  onButtonRef: (category: CategoryKey, element: HTMLButtonElement | null) => void
  navRef?: Ref<HTMLElement>
}

export default function CategoryMenu({ menuId, openCategory, onToggle, onClose,
  onEscape, onButtonRef, navRef }: CategoryMenuProps) {
  return (
    <nav className="menu-categorias" aria-label="Categorías de productos" ref={navRef}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && openCategory) {
          event.preventDefault()
          onEscape()
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onClose()
      }}>
      {categories.map((category) => (
        <div className="mega-item" key={category.anchor}>
          <button className="categoria-acciones" type="button"
            ref={(element) => onButtonRef(category.anchor, element)}
            aria-expanded={openCategory === category.anchor}
            aria-controls={`${menuId}-${category.anchor}`}
            onClick={() => onToggle(category.anchor)}>
            <span className="mega-enlace">{category.label}</span>
            <span className="categoria-toggle" aria-hidden="true">⌄</span>
          </button>
          <div className="mega-panel" id={`${menuId}-${category.anchor}`}
            hidden={openCategory !== category.anchor}>
            <div className="mega-menu-grid row g-4">
              <div className="mega-menu-columna col-12">
                <h2>{category.label}</h2>
                {category.products.map((product) => (
                  <a key={product.id}
                    href={`${legacyBase}producto-detalle.html?id=${encodeURIComponent(product.id)}`}
                    onClick={onClose}>{product.name}</a>
                ))}
                <a href={`${legacyBase}productos.html#${category.anchor}`} onClick={onClose}>
                  Ver categoría
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </nav>
  )
}
