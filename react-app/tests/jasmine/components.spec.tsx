import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import Button from '../../src/components/ui/Button'
import TextField from '../../src/components/ui/TextField'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '../../src/components/Navbar'
import { categories } from '../../src/components/navigation'

describe('Componentes React: interacción y accesibilidad en Chrome', () => {
  let container: HTMLDivElement
  let root: Root
  beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })
  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    Reflect.deleteProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT')
  })

  it('REA-01 el botón reutilizable ejecuta su callback sin enviar un formulario', () => {
    const onClick = jasmine.createSpy('onClick')
    act(() => root.render(<Button onClick={onClick}>Acción académica</Button>))
    const button = container.querySelector('button')!
    expect(button.type).toBe('button')
    act(() => button.click())
    expect(onClick).toHaveBeenCalledTimes(1)
  })
  it('REA-02 el campo conecta etiqueta, ayuda y mensaje de error de validación', () => {
    act(() => root.render(<TextField id="cantidad-prueba" label="Cantidad" hint="Solo enteros" error="Cantidad inválida" type="number" />))
    const input = container.querySelector('input')!
    expect(container.querySelector('label')!.htmlFor).toBe(input.id)
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.getAttribute('aria-describedby')).toBe('cantidad-prueba-hint cantidad-prueba-error')
    expect(container.querySelector('#cantidad-prueba-error')!.textContent).toBe('Cantidad inválida')
  })

  const categoryButtons = () => Array.from(container.querySelectorAll<HTMLButtonElement>('.categoria-acciones'))
  const panels = () => Array.from(container.querySelectorAll<HTMLDivElement>('.mega-panel'))
  function mountMenu() {
    act(() => root.render(<MemoryRouter><Navbar /></MemoryRouter>))
  }
  it('MEN-01 hover abre solo cinco productos de su categoría y conserva el clic de mouse', () => {
    mountMenu()
    for (const [index, category] of categories.entries()) {
      const button = categoryButtons()[index]
      act(() => button.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' })))
      expect(panels().filter((panel) => !panel.hidden).length).toBe(1)
      expect(button.getAttribute('aria-expanded')).toBe('true')
      const links = panels()[index].querySelectorAll<HTMLAnchorElement>('a')
      expect(links.length).toBe(6)
      category.products.forEach((product, n) => {
        expect(links[n].textContent).toBe(product.name)
        expect(links[n].search).toBe('?id=' + product.id)
      })
      expect(links[5].textContent).toBe(category.allLabel)
      expect(links[5].getAttribute('href')).toBe('/productos.html#' + category.anchor)
      act(() => button.dispatchEvent(new PointerEvent('click', { bubbles: true, pointerType: 'mouse' })))
      expect(panels()[index].hidden).toBeFalse()
      act(() => button.dispatchEvent(new PointerEvent('pointerout', { bubbles: true, pointerType: 'mouse', relatedTarget: document.body })))
      expect(panels().every((panel) => panel.hidden)).toBeTrue()
    }
    expect(container.querySelector('.categoria-toggle')).toBeNull()
  })
  it('MEN-02 touch alterna sin depender del hover y al cambiar deja un único panel', () => {
    mountMenu()
    for (const button of categoryButtons()) {
      act(() => button.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'touch' })))
      expect(panels().every((panel) => panel.hidden)).toBeTrue()
      act(() => button.dispatchEvent(new PointerEvent('click', { bubbles: true, pointerType: 'touch' })))
      expect(panels().filter((panel) => !panel.hidden).length).toBe(1)
      act(() => button.dispatchEvent(new PointerEvent('click', { bubbles: true, pointerType: 'touch' })))
      expect(panels().every((panel) => panel.hidden)).toBeTrue()
    }
  })
  it('MEN-03 Escape devuelve el foco al disparador y cierra incluso con el puntero sobre él', () => {
    mountMenu()
    act(() => categoryButtons()[1].click())
    act(() => panels()[1].querySelector<HTMLAnchorElement>('a')!.focus())
    act(() => document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })))
    expect(document.activeElement).toBe(categoryButtons()[1])
    expect(panels().every((panel) => panel.hidden)).toBeTrue()
    expect(categoryButtons()[1].getAttribute('aria-expanded')).toBe('false')
  })
  it('MEN-04 foco interno conserva apertura; salir con foco o pointerdown exterior cierra', () => {
    mountMenu()
    act(() => categoryButtons()[0].click())
    act(() => panels()[0].querySelector<HTMLAnchorElement>('a')!.focus())
    expect(panels()[0].hidden).toBeFalse()
    act(() => categoryButtons()[1].focus())
    expect(panels().every((panel) => panel.hidden)).toBeTrue()
    act(() => categoryButtons()[2].click())
    act(() => document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })))
    expect(panels().every((panel) => panel.hidden)).toBeTrue()
  })
})
