const fs = require("fs");

export class Producto {
  title: string
  price: number
  thumbnail: string
  vistas: number
  id: number

  static prodId = 0

  constructor(title: string, price: number, thumbnail: string, visitas = 0) {
    this.id = ++Producto.prodId
    this.title = title
    this.price = price
    this.thumbnail = thumbnail
    this.vistas = visitas
  }
}

class Archivo {
  fileName: string

  constructor(fileName: string) {
    this.fileName = fileName;
  }

  read: () => Promise<Producto[]> = () => {
    try {
      return fs.promises.readFile(`./${this.fileName}`, "utf-8")
        .then((data: string) => data ? JSON.parse(data) : [])
        .catch(err => {
          throw new Error(err)
        })
    }
    catch (err) {
      console.log(`Error en lectura:\n\t=> ${err}`)
      return []
    }
  }

  save = async (producto: Producto) => {
    try {
      const data = await this.read()
      data.push(producto)

      return fs.promises.writeFile(`./${this.fileName}`, JSON.stringify(data, null, '\t'), null, "\t")
        .then(() => ({ ok: true, msg: 'Guardado con exito', nuevoProd: producto }))
        .catch((err) => { throw new Error(err) })
    }
    catch (err) {
      console.log(`Error en escritura:\n\t=> ${err}`)
      return ({ ok: false, msg: `Error en escritura ${err}`, nuevoProd: {} })
    }
  }

  overWrite = async (productos: Producto[]) => {
    try {
      return fs.promises.writeFile(`./${this.fileName}`, JSON.stringify(productos, null, '\t'), null, "\t")
        .then(() => ({ ok: true, msg: 'Sobreescrito archivo completo con exito', productos }))
        .catch((err) => { throw new Error(err) })
    }
    catch (err) {
      console.log(`Error en escritura:\n\t=> ${err}`)
      return ({ ok: false, msg: `Error en escritura ${err}` })
    }
  }

  deleteFile: () => void = () => {
    try {
      fs.promises.unlink(`./${this.fileName}`)
        .then(() => (
          { ok: true, msg: `Borrado ${this.fileName}` }
        ))
        .catch(() => {
          throw new Error(`Error al borrar ${this.fileName}`)
        })
    }
    catch (err) {
      return ({ ok: false, msg: err })
    }
  }
}




export const archivoProductos = new Archivo("productos.txt");

// esta funcion solamente es para que el array de productos comience con items para probar las request
export const agregaProductosPrueba = async () => {
  const producto_a = new Producto("Casa", 9999, "https://image.freepik.com/vector-gratis/casa-dos-pisos_1308-16176.jpg",);
  const producto_b = new Producto("Avion", 1234567, "https://image.freepik.com/psd-gratis/imagen-tridimensional-avion_53876-8970.jpg",);
  const producto_c = new Producto("Mundo", 0, "https://image.freepik.com/vector-gratis/pegatina-vintage-globo-dibujos-animados-png_53876-127373.jpg",);

  archivoProductos.save(producto_a)
    .then(() => archivoProductos.save(producto_b))
    .then(() => archivoProductos.save(producto_c))
}