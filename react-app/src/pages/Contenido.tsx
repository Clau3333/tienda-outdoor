import { createElement } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import content from '../data/legacyContent.json'

type ContentNode = string | { tag: string; attrs: Record<string, string | null>; children: ContentNode[] }
// Contenido editorial existente convertido a nodos React; no HTML remoto ni ejecución de scripts.
function render(node: ContentNode, key: number): ReactNode {
  if (typeof node === 'string') return node
  const props: Record<string, unknown> = { key }
  for (const [name, value] of Object.entries(node.attrs)) {
    if (value === null || /^on/i.test(name)) continue
    if (name === 'style') {
      props.style = Object.fromEntries(value.split(';').filter((part) => part.includes(':')).map((part) => {
        const index = part.indexOf(':')
        return [part.slice(0, index).trim().replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()), part.slice(index + 1).trim()]
      })) as CSSProperties
    } else if (name === 'class') props.className = value
    else if (name === 'src' && !/^(https?:|\/)/.test(value)) props.src = '/Sitio%20Old/' + value
    else if (name === 'href' && /^[a-z-]+\.html/.test(value)) props.href = '/' + value
    else props[name] = value
  }
  if (node.tag === 'main') props.className = `${props.className ?? ''} contenido-editorial`
  const children = node.children.map(render)
  return children.length ? createElement(node.tag, props, children) : createElement(node.tag, props)
}
export default function Contenido() {
  const { pathname } = useLocation()
  const name = pathname.slice(1).replace('.html', '') as keyof typeof content
  const nodes = Object.hasOwn(content, name) ? content[name] : undefined
  return nodes ? <>{(nodes as ContentNode[]).map(render)}</> : <main className="container py-5"><h1>Página no encontrada</h1><Link to="/">Volver al inicio</Link></main>
}
