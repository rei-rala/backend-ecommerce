import { Product } from "./Product";
import { Cart } from "./Cart";

const fs = require("fs")

export default class Archivo {
  fileName: string

  constructor(fileName: string) {
    this.fileName = fileName;
  }

  read = () => {
    try {
      return fs.promises.readFile(`./${this.fileName}.txt`, "utf-8")
        .then((data: string) => data ? JSON.parse(data) : [])
        .catch(err => { throw new Error(err) })
    }
    catch (err) {
      console.log(`Error en lectura:\n\t=> ${err}`)
      this.cleanFile()
      return []
    }
  }

  getById = async (objId: number) => {
    return await this.read()
      .then(((arr: []) => (
        arr.length
          ? arr.find((obj: Product | Cart) => obj.id === objId) || null
          : null
      )))
  }

  saveNewObject = async (newObject: Product | Cart) => {
    try {
      const data = await this.read()
      data.push(newObject)

      return fs.promises.writeFile(`./${this.fileName}.txt`, JSON.stringify(data, null, '\t'), null, "\t")
        .then(() => ({ ok: true, msg: 'Guardado con exito' }))
        .catch((err) => { throw new Error(err) })
    }
    catch (err) {
      console.log(`Error en escritura:\n\t=> ${err}`)
      return ({ ok: false, msg: err })
    }
  }

  updateObject = async (objId: number, newData: Product | Cart) => {
    try {
      let status = {}
      const data = await this.read()
      const updated = data.find((obj: Product | Cart) => obj.id === objId)

      if (updated) {
        for (let prop in newData) { updated[prop] = newData[prop] }
        // Correccion de ID (wtf?)
        updated.id = objId

        await this.overWriteFile(data)
        status = ({ ok: true, msg: `${typeof newData} con id ${objId} actualizado` })
      } else {
        status = ({ ok: false, msg: `${typeof newData} no encontrado con id ${objId}` })
      }
      return status
    }
    catch (err) {
      console.log(`Error en escritura:\n\t=> ${err}`)
      return ({ ok: false, msg: err })
    }
  }

  deleteObject = async (objId: number) => {
    try {
      let status = {}
      const data = await this.read()
      const updated = data.filter((obj: Product | Cart) => obj.id !== objId)

      if (updated) {
        await this.overWriteFile(updated)
        status = ({ ok: true, msg: `${typeof updated} con id ${objId} eliminado` })
      } else {
        status = ({ ok: false, msg: `${typeof updated} no encontrado con id ${objId}` })
      }
      return status
    }
    catch (err) {
      console.log(`Error en escritura:\n\t=> ${err}`)
      return ({ ok: false, msg: err })
    }
  }

  overWriteFile = async (arrayObjs: Product[] | Cart[]) => {
    try {
      return fs.promises.writeFile(`./${this.fileName}.txt`, JSON.stringify(arrayObjs, null, '\t'), null, "\t")
        .then(() => ({ ok: true, msg: 'Sobreescrito archivo completo con exito', arrayObjs }))
        .catch((err) => { throw new Error(err) })
    }
    catch (err) {
      console.log(`Error en escritura:\n\t=> ${err}`)
      return ({ ok: false, msg: err })
    }
  }

  cleanFile = () => {
    try {
      return fs.promises.writeFile(`./${this.fileName}.txt`, JSON.stringify([], null, '\t'), null, "\t")
        .then(() => ({ ok: true, msg: `Archivo ${this.fileName} vaciado con exito` }))
        .catch((err) => { throw new Error(err) })
    }
    catch (err) {
      console.log(`Error en escritura:\n\t=> ${err}`)
      return ({ ok: false, msg: err })
    }
  }
}


export const archivoCarts = new Archivo("_carritos");
export const archivoProductos = new Archivo("_productos");