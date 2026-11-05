// Destinos existentes en Sitio Old. Se mantienen hasta migrar cada página.
export const legacyBase = '/Sitio%20Old/'

export const primaryLinks = [
  { label: 'Productos', href: 'productos.html' },
  { label: 'Nosotros', href: 'nosotros.html' },
  { label: 'Blog', href: 'blog.html' },
  { label: 'Contacto', href: 'contacto.html' },
  { label: 'Carrito', href: 'carrito.html' },
  { label: 'Iniciar sesión', href: 'login.html' },
  { label: 'Registrarse', href: 'registro.html' },
]

export const categories = [
  {
    label: 'CHAQUETAS', anchor: 'chaquetas',
    products: [
      { id: 'chaqueta-cordillera', name: 'Chaqueta Cordillera' },
      { id: 'chaqueta-andes', name: 'Chaqueta Andes' },
      { id: 'chaqueta-patagonia', name: 'Chaqueta Patagonia' },
      { id: 'chaqueta-aconcagua', name: 'Chaqueta Aconcagua' },
      { id: 'chaqueta-atacama', name: 'Chaqueta Atacama' },
    ],
  },
  {
    label: 'POLERONES Y POLAR', anchor: 'polar',
    products: [
      { id: 'polar-sendero', name: 'Polar Sendero' },
      { id: 'polar-andes', name: 'Polar Andes' },
      { id: 'polar-patagonia', name: 'Polar Patagonia' },
      { id: 'polar-atacama', name: 'Polar Atacama' },
      { id: 'polar-volcan', name: 'Polar Volcán' },
    ],
  },
  {
    label: 'PANTALONES', anchor: 'pantalones',
    products: [
      { id: 'pantalon-cumbre', name: 'Pantalón Cumbre' },
      { id: 'pantalon-andes', name: 'Pantalón Andes' },
      { id: 'pantalon-patagonia', name: 'Pantalón Patagonia' },
      { id: 'pantalon-fiordo', name: 'Pantalón Fiordo' },
      { id: 'pantalon-atacama', name: 'Pantalón Atacama' },
    ],
  },
] as const

export type CategoryKey = typeof categories[number]['anchor']
