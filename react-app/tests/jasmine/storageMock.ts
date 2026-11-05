import type { StoragePort } from '../../src/data/productTypes'
import type { CartItem } from '../../src/services/cartRepository'

// Nunca toca el localStorage real del navegador ni los datos de la tienda.
export function createStorageMock() {
  const values = new Map<string, string>()
  const storage = jasmine.createSpyObj<StoragePort>('StoragePort', ['getItem', 'setItem'])
  storage.getItem.and.callFake((key) => values.get(key) ?? null)
  storage.setItem.and.callFake((key, value) => { values.set(key, value) })
  return { values, storage }
}

export const cartItem: CartItem = {
  id: 'chaqueta-cordillera', nombre: 'Chaqueta Cordillera', precio: 59990,
  imagen: 'img/chaqueta-cordillera.png', color: 'Negro', cantidad: 1,
}
