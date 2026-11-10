import assert from 'node:assert/strict'
import { before, after, test } from 'node:test'
import { readFile, access } from 'node:fs/promises'
import vm from 'node:vm'
import { Children, isValidElement, createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { createServer } from 'vite'
import { categories, primaryLinks } from '../src/components/navigation.ts'
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
      onOpen: (category) => dispatch({ type: 'open', category, locationKey: state.locationKey }),
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

test('volver a activar por teclado o touch el mismo boton cierra el submenu', () => {
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
  assert.equal(link.props.href, '/productos.html#polar')
  assert.equal(link.props.children, 'Ver todos los polares')
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

test('las opciones principales migradas usan React y los archivos heredados se conservan', async () => {
  const { default: Header } = await server.ssrLoadModule('/src/components/Header.tsx')
  const { default: Provider } = await server.ssrLoadModule('/src/theme/ThemeProvider.tsx')
  const html = renderToStaticMarkup(createElement(Provider, null,
    createElement(MemoryRouter, null, createElement(Header))))
  const mainNav = html.match(/class="enlaces-principales"[^>]*>(.*?)<\/nav>/s)[1]
  assert.match(mainNav, /href="\/"/)
  for (const { href } of primaryLinks) {
    const migrated = href.endsWith('.html')
    assert.ok(mainNav.includes(`href="${migrated ? '/' : '/Sitio%20Old/'}${href}"`), href)
    await access(new URL(`../../Sitio Old/${href}`, import.meta.url))
  }
  const app = await readFile(new URL('../src/App.tsx', import.meta.url), 'utf8')
  assert.deepEqual([...app.matchAll(/<Route path="([^"]+)"/g)].map((match) => match[1]), ['/', '/index.html', '/productos.html', '/carrito.html', '/login.html', '/registro.html', '/producto-detalle.html', '/nosotros.html', '/blog.html', '/blog-detalle-1.html', '/blog-detalle-2.html', '/contacto.html', '/mis-pedidos.html', '/pedido-detalle.html', '/admin.html', '/admin-productos.html', '/admin-usuarios.html', '/admin-ordenes.html', '/admin-orden-detalle.html', '/vendedor.html', '/vendedor-productos.html', '/vendedor-producto-detalle.html', '/vendedor-ordenes.html', '/vendedor-orden-detalle.html', '*'])
})

test('hover de mouse abre exclusivamente su categoria y salir cierra; touch no simula hover', () => {
  const menu = harness()
  const items = () => elements(menu.view(), (node) => node.props.className === 'mega-item')
  for (let index = 0; index < 3; index++) {
    items()[index].props.onPointerEnter({ pointerType: 'touch' })
    assert.equal(opened(menu).length, 0)
    items()[index].props.onPointerEnter({ pointerType: 'mouse' })
    assert.equal(menu.state.category, categories[index].anchor)
    items()[index].props.onPointerEnter({ pointerType: 'mouse' })
    assert.equal(opened(menu).length, 1)
    toggles(menu)[index].props.onClick({ nativeEvent: { pointerType: 'mouse' } })
    assert.equal(opened(menu).length, 1, 'clic tras hover conserva apertura')
    items()[index].props.onPointerLeave({ pointerType: 'mouse' })
    assert.equal(opened(menu).length, 0)
  }
})

test('touch alterna y los tres finales usan etiquetas especificas y rutas React', () => {
  const menu = harness()
  for (const [index, category] of categories.entries()) {
    toggles(menu)[index].props.onClick({ nativeEvent: { pointerType: 'touch' } })
    assert.equal(opened(menu).length, 1)
    assert.equal(links(opened(menu)[0]).at(-1).props.children, category.allLabel)
    assert.equal(links(opened(menu)[0]).at(-1).props.href, `/productos.html#${category.anchor}`)
    toggles(menu)[index].props.onClick({ nativeEvent: { pointerType: 'touch' } })
    assert.equal(opened(menu).length, 0)
  }
  assert.equal(elements(menu.view(), (node) => node.props.className === 'categoria-toggle').length, 0)
})

test('hidden permanece protegido y se conservan reglas responsive sin flechas ni cajas', async () => {
  const css = await readFile(new URL('../src/App.css', import.meta.url), 'utf8')
  assert.match(css, /\.mega-panel\[hidden\]\s*\{\s*display:\s*none\s*!important/)
  assert.ok(!/\.mega-item:(?:hover|focus-within)[^{]*\{[^}]*(?:display|visibility|opacity)/s.test(css))
  assert.match(css, /@media \(max-width: 700px\)/)
  assert.match(css, /@media \(max-width: 480px\)/)
  assert.ok(!css.includes('.categoria-toggle'))
  assert.match(css, /\.categoria-acciones[^}]*background: transparent/)
})

test('ambos HTML heredados conservan 15 IDs y tres finales React con botones accesibles', async () => {
  for (const file of ['index.html', 'productos.html']) {
    const html = await readFile(new URL(`../../Sitio Old/${file}`, import.meta.url), 'utf8')
    const menu = html.match(/<nav\s+class="menu-categorias"[\s\S]*?<\/nav>/)[0]
    assert.equal([...menu.matchAll(/<button[^>]+aria-expanded="false"[^>]+aria-controls="menu-[^"]+"/g)].length, 3)
    assert.equal([...menu.matchAll(/class="mega-panel"[^>]+hidden/g)].length, 3)
    assert.equal([...menu.matchAll(/href="producto-detalle\.html\?id=/g)].length, 15)
    for (const category of categories) {
      for (const product of category.products) assert.ok(menu.includes(`href="producto-detalle.html?id=${product.id}"`))
      assert.ok(menu.includes(`href="/productos.html#${category.anchor}"`))
      assert.ok(menu.includes(category.allLabel))
    }
  }
})
