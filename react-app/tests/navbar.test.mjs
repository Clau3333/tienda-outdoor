import assert from 'node:assert/strict'
import { before, after, test } from 'node:test'
import { readFile, access } from 'node:fs/promises'
import vm from 'node:vm'
import { Children, isValidElement, createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { createServer } from 'vite'
import { categories, legacyBase, primaryLinks } from '../src/components/navigation.ts'
import { categoryMenuReducer, initialMenuState } from '../src/components/categoryMenuState.ts'

// Pruebas de callbacks, estado y HTML. No son pruebas de un navegador ni de layout.
let server
let CategoryMenu
before(async () => {
  server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
  CategoryMenu = (await server.ssrLoadModule('/src/components/CategoryMenu.tsx')).default
})
after(async () => { await server?.close() })

function elements(tree, predicate) {
  const result = []
  function visit(node) {
    if (!isValidElement(node)) return
    if (predicate(node)) result.push(node)
    Children.forEach(node.props.children, visit)
  }
  visit(tree)
  return result
}

function harness() {
  let state = initialMenuState('inicio')
  const dispatch = (action) => { state = categoryMenuReducer(state, action) }
  const close = () => dispatch({ type: 'close' })
  return {
    view: () => CategoryMenu({
      menuId: 'categorias-test', openCategory: state.category,
      onToggle: (category) => dispatch({ type: 'toggle', category, locationKey: state.locationKey }),
      onClose: close, onEscape: close, onButtonRef: () => {},
    }),
    navigate: (locationKey) => dispatch({ type: 'navigate', locationKey }),
    get state() { return state },
  }
}

const toggles = (menu) => elements(menu.view(), (node) => node.type === 'button')
const panels = (menu) => elements(menu.view(), (node) => node.props.className === 'mega-panel')
const opened = (menu) => panels(menu).filter((node) => !node.props.hidden)
const links = (panel) => elements(panel, (node) => node.type === 'a')

test('inicia cerrado y cada boton controla su panel mediante aria-controls', () => {
  const menu = harness()
  assert.equal(opened(menu).length, 0)
  assert.equal(toggles(menu).length, 3)
  toggles(menu).forEach((button, index) => {
    assert.equal(button.props.type, 'button')
    assert.equal(button.props['aria-expanded'], false)
    assert.equal(button.props['aria-controls'], panels(menu)[index].props.id)
  })
})

test('cada seleccion muestra solo sus cinco productos, sin otros grupos', () => {
  for (const [index, category] of categories.entries()) {
    const menu = harness()
    toggles(menu)[index].props.onClick()
    assert.equal(opened(menu).length, 1)
    const productLinks = links(opened(menu)[0]).filter((link) => link.props.href.includes('producto-detalle'))
    assert.deepEqual(productLinks.map((link) => link.props.children), category.products.map((p) => p.name))
    assert.equal(productLinks.length, 5)
    assert.equal(elements(opened(menu)[0], (node) => node.type === 'h2').length, 1)
    const html = renderToStaticMarkup(opened(menu)[0])
    for (const other of categories.filter((c) => c.anchor !== category.anchor)) {
      for (const product of other.products) assert.ok(!html.includes(product.name))
    }
  }
})

test('cambiar de categoria cierra la anterior y deja solo una expandida', () => {
  const menu = harness()
  for (let index = 0; index < 3; index++) {
    toggles(menu)[index].props.onClick()
    assert.equal(opened(menu).length, 1)
    assert.equal(menu.state.category, categories[index].anchor)
    assert.equal(toggles(menu).filter((button) => button.props['aria-expanded']).length, 1)
  }
})

test('volver a pulsar el texto o flecha del mismo boton cierra el submenu', () => {
  const menu = harness()
  toggles(menu)[0].props.onClick()
  toggles(menu)[0].props.onClick()
  assert.equal(opened(menu).length, 0)
  assert.equal(menu.state.category, null)
})

test('seleccionar cualquier producto cierra el submenu', () => {
  const menu = harness()
  for (let category = 0; category < 3; category++) {
    for (let product = 0; product < 5; product++) {
      toggles(menu)[category].props.onClick()
      links(opened(menu)[0])[product].props.onClick()
      assert.equal(opened(menu).length, 0)
    }
  }
})

test('el enlace al catalogo de la categoria se conserva y tambien cierra', () => {
  const menu = harness()
  toggles(menu)[1].props.onClick()
  const link = links(opened(menu)[0]).at(-1)
  assert.equal(link.props.href, `${legacyBase}productos.html#polar`)
  link.props.onClick()
  assert.equal(opened(menu).length, 0)
})

test('mover el foco dentro conserva apertura; salir del nav la cierra', () => {
  const menu = harness()
  toggles(menu)[0].props.onClick()
  menu.view().props.onBlur({ currentTarget: { contains: () => true }, relatedTarget: {} })
  assert.equal(opened(menu).length, 1)
  menu.view().props.onBlur({ currentTarget: { contains: () => false }, relatedTarget: null })
  assert.equal(opened(menu).length, 0)
})

test('Escape cierra; otras teclas no cierran ni se interceptan', () => {
  const menu = harness()
  let prevented = false
  toggles(menu)[2].props.onClick()
  menu.view().props.onKeyDown({ key: 'Tab', preventDefault: () => { prevented = true } })
  assert.equal(opened(menu).length, 1)
  assert.equal(prevented, false)
  menu.view().props.onKeyDown({ key: 'Escape', preventDefault: () => { prevented = true } })
  assert.equal(opened(menu).length, 0)
  assert.equal(prevented, true)
})

test('las transiciones de navegacion, Atras y Adelante no recuperan un menu abierto', () => {
  const menu = harness()
  toggles(menu)[0].props.onClick()
  menu.navigate('otra-entrada')
  assert.equal(opened(menu).length, 0)
  menu.navigate('inicio')
  assert.equal(opened(menu).length, 0)
  toggles(menu)[1].props.onClick()
  menu.navigate('otra-entrada')
  assert.equal(opened(menu).length, 0)
})

test('los quince enlaces de producto resuelven identificadores y nombres reales del sitio antiguo', async () => {
  const source = await readFile(new URL('../../Sitio Old/productos.js', import.meta.url), 'utf8')
  const original = vm.runInNewContext(source + '\nproductosBase', { localStorage: { getItem: () => null } })
  await access(new URL('../../Sitio Old/producto-detalle.html', import.meta.url))
  const menu = harness()
  const ids = new Set()
  const originalCategories = { chaquetas: 'Chaquetas', polar: 'Polerones y polar', pantalones: 'Pantalones' }
  for (const panel of panels(menu)) {
    const anchor = panel.props.id.replace('categorias-test-', '')
    for (const link of links(panel).filter((node) => node.props.href.includes('producto-detalle'))) {
      const url = new URL(link.props.href, 'http://albedo.test')
      const id = url.searchParams.get('id')
      const product = original.find((item) => item.id === id)
      assert.ok(product, id)
      assert.equal(product.nombre, link.props.children)
      assert.equal(product.categoria, originalCategories[anchor])
      ids.add(id)
    }
  }
  assert.equal(ids.size, 15)
})

test('Inicio, Productos, Carrito, Login y Registro usan React; las otras opciones conservan destinos antiguos', async () => {
  const { default: Header } = await server.ssrLoadModule('/src/components/Header.tsx')
  const { default: Provider } = await server.ssrLoadModule('/src/theme/ThemeProvider.tsx')
  const html = renderToStaticMarkup(createElement(Provider, null,
    createElement(MemoryRouter, null, createElement(Header))))
  const mainNav = html.match(/class="enlaces-principales"[^>]*>(.*?)<\/nav>/s)[1]
  assert.match(mainNav, /href="\/"/)
  for (const { href } of primaryLinks) {
    const migrated = href === 'productos.html' || href === 'carrito.html' || href === 'login.html' || href === 'registro.html'
    assert.ok(mainNav.includes(`href="${migrated ? '/' : legacyBase}${href}"`), href)
    await access(new URL(`../../Sitio Old/${href}`, import.meta.url))
  }
  const app = await readFile(new URL('../src/App.tsx', import.meta.url), 'utf8')
  assert.deepEqual([...app.matchAll(/<Route path="([^"]+)"/g)].map((match) => match[1]), ['/', '/index.html', '/productos.html', '/carrito.html', '/login.html', '/registro.html'])
})

test('hover no abre paneles; hidden permanece protegido y se conservan reglas responsive', async () => {
  const menu = harness()
  assert.equal(menu.view().props.onPointerEnter, undefined)
  for (const item of elements(menu.view(), (node) => node.props.className === 'mega-item')) {
    assert.equal(item.props.onPointerEnter, undefined)
  }
  const css = await readFile(new URL('../src/App.css', import.meta.url), 'utf8')
  assert.match(css, /\.mega-panel\[hidden\]\s*\{\s*display:\s*none\s*!important/)
  assert.ok(!/\.mega-item:(?:hover|focus-within)[^{]*\{[^}]*(?:display|visibility|opacity)/s.test(css))
  assert.match(css, /@media \(max-width: 700px\)/)
  assert.match(css, /@media \(max-width: 480px\)/)
  assert.match(css, /grid-template-columns: minmax\(0, 1fr\) 44px/)
})
