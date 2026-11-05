import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import Button from '../../src/components/ui/Button'
import TextField from '../../src/components/ui/TextField'

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
})
