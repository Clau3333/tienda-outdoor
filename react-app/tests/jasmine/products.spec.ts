import { createProductRepository, PRODUCTS_KEY } from '../../src/services/productRepository'
import { productCartItem, productImageUrl } from '../../src/services/productSelection'
import { productosBase } from '../../src/data/products'
import { createStorageMock } from './storageMock'

describe('Productos: datos, validaciones y CRUD', () => {
  let mock: ReturnType<typeof createStorageMock>
  let repository: ReturnType<typeof createProductRepository>
  beforeEach(() => { mock = createStorageMock(); repository = createProductRepository(mock.storage) })

  it('PRO-01 recupera los 15 productos originales sin escribir almacenamiento', () => {
    const products = repository.list()
    expect(products.length).toBe(15)
    expect(new Set(products.map((product) => product.id)).size).toBe(15)
    expect(products.filter((product) => product.categoria === 'Chaquetas').length).toBe(5)
    expect(mock.storage.setItem).not.toHaveBeenCalled()
  })
  it('PRO-02 la lectura no permite modificar el catálogo original por referencia', () => {
    const products = repository.list()
    products[0].nombre = 'Cambio aislado'
    products[0].colores[0].nombre = 'Color aislado'
    expect(repository.list()[0]).toEqual(productosBase[0])
  })
  it('PRO-03 crea y recupera un producto persistido mediante su identificador', () => {
    const product = { ...productosBase[0], id: 'prueba-academica' }
    repository.create(product)
    expect(createProductRepository(mock.storage).get(product.id)).toEqual(product)
    expect(mock.storage.setItem).toHaveBeenCalledWith(PRODUCTS_KEY, jasmine.any(String))
  })
  it('PRO-04 actualiza un precio sin cambiar el identificador ni otros productos', () => {
    const original = repository.list()
    repository.update(original[0].id, { precio: 45000 })
    expect(repository.get(original[0].id)?.precio).toBe(45000)
    expect(repository.list().slice(1)).toEqual(original.slice(1))
  })
  it('PRO-05 elimina únicamente el producto solicitado', () => {
    repository.remove(productosBase[0].id)
    expect(repository.get(productosBase[0].id)).toBeUndefined()
    expect(repository.list().length).toBe(14)
  })
  it('PRO-06 rechaza precio negativo e identificador duplicado sin guardar cambios', () => {
    expect(() => repository.update(productosBase[0].id, { precio: -1 })).toThrowError()
    expect(() => repository.create(productosBase[0])).toThrowError(/ya existe/)
    expect(mock.storage.setItem).not.toHaveBeenCalled()
  })
  it('PRO-07 los datos corruptos bloquean el CRUD sin sobrescribir el contenido', () => {
    mock.values.set(PRODUCTS_KEY, '{datos dañados')
    expect(() => repository.create({ ...productosBase[0], id: 'nuevo' })).toThrowError()
    expect(mock.values.get(PRODUCTS_KEY)).toBe('{datos dañados')
    expect(mock.storage.setItem).not.toHaveBeenCalled()
  })
  it('PRO-08 selecciona imagen y color correctos y evita duplicar prefijos de imagen', () => {
    const product = productosBase[0]
    const color = product.colores[1]
    const item = productCartItem(product, color.nombre)
    expect(item).toEqual(jasmine.objectContaining({ id: product.id, precio: product.precio, imagen: color.imagen, color: color.nombre, cantidad: 1 }))
    const url = productImageUrl(item.imagen)
    expect(url).toBe('/Sitio%20Old/' + color.imagen)
    expect(productImageUrl(url)).toBe(url)
  })
})
