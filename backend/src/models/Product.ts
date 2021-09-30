import { archivoProductos } from "./Archivo"

export class Product {
  id: number
  product_id?: number
  title: string
  price: number
  description: string
  thumbnail: string
  timestamp: number
  stock: number
  vistas: number

  static prodId = 0

  constructor(title: string, price: number, description: string, thumbnail: string, stock = 0) {
    this.id = ++Product.prodId
    this.title = title
    this.price = price
    this.description = description
    this.thumbnail = thumbnail
    this.stock = stock
    this.timestamp = Date.now()
    this.vistas = 0
  }
}


// esta funcion solamente es para que el array de productos comience con items para probar las request
export const agregaProductosPrueba = async () => {
  const producto_a = new Product("Casa", 9999, 'productito number a', "https://image.freepik.com/vector-gratis/casa-dos-pisos_1308-16176.jpg",);
  const producto_b = new Product("Avion", 1234567, 'productito number b', "https://image.freepik.com/psd-gratis/imagen-tridimensional-avion_53876-8970.jpg",);
  const producto_c = new Product("Mundo", 0, 'productito number c', "https://image.freepik.com/vector-gratis/pegatina-vintage-globo-dibujos-animados-png_53876-127373.jpg",);
  const producto_x = new Product("Casa", 9999, 'productito number x', "https://image.freepik.com/vector-gratis/casa-dos-pisos_1308-16176.jpg",);
  const producto_y = new Product("Avion", 1234567, 'productito number y', "https://image.freepik.com/psd-gratis/imagen-tridimensional-avion_53876-8970.jpg",);
  const producto_z = new Product("Mundo", 0, 'productito number z', "https://image.freepik.com/vector-gratis/pegatina-vintage-globo-dibujos-animados-png_53876-127373.jpg",);

  archivoProductos.saveNewObject(producto_a)
    .then(() => archivoProductos.saveNewObject(producto_b))
    .then(() => archivoProductos.saveNewObject(producto_c))
    .then(() => archivoProductos.saveNewObject(producto_x))
    .then(() => archivoProductos.saveNewObject(producto_y))
    .then(() => archivoProductos.saveNewObject(producto_z))
}
