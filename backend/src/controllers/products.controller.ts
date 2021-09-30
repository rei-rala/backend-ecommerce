import { archivoProductos } from "../models/Archivo"
import { Product } from "../models/Product"
import { apiResp } from "../types"

export const getProds = (_, res) => {
  try {
    archivoProductos.read()
      .then((r: Product[]) => res.send({ ok: true, cantidad: r.length, productos: r }))
      .catch(err => { throw new Error(err) })
  }
  catch (err) {
    console.log('Error en lectura de archivo:', err)
  }
}


export const getProdById = (req, res) => {
  const id = parseInt(req.params.idProd)
  try {
    archivoProductos.read()
      .then((list: Product[]) => list.find((p: Product) => p.id === id))
      .then((p: Product) => {
        p
          ? res.status(200).send({ ok: true, producto: p })
          : res.status(404).send({ ok: false, producto: {}, msg: `Not found id ${id}` })
      })
  }
  catch (err) {
    console.log('Error en lectura de archivo:', err)
  }
}

export const addProd = (req, res) => {
  const { isUserAdmin, title, description, thumbnail } = req.body
  const price = parseInt(req.body.price)
  const stock = req.body.stock ? parseInt(req.body.stock) : 0

  if (/*isAdmin */isUserAdmin && isUserAdmin === 'true') {
    if (title && price && description && thumbnail) {
      const created = new Product(title, price, description, thumbnail, stock)
      archivoProductos.saveNewObject(created)
        .then((r) => res.status(201).send(r))
    } else {
      res.status(401).send({ ok: false, msg: 'Complete todos los datos' })
    }
  }
  else {
    res.status(403).send({ ok: false, msg: 'Permisos insuficientes' })
  }
}

export const updateProductById = (req, res) => {
  const id = parseInt(req.params.idProd)
  const { isUserAdmin, title, description, thumbnail } = req.body
  const price = parseInt(req.body.price)
  const stock = req.body.stock ? parseInt(req.body.stock) : 0

  if (/*isAdmin */isUserAdmin && isUserAdmin === 'true') {
    if (title && price && description && thumbnail && stock) {
      const updatedData = new Product(title, price, description, thumbnail, stock)

      archivoProductos.updateObject(id, updatedData)
        .then((r) => res.status(200).send(r))

    } else {
      res.status(401).send({ ok: false, msg: 'Complete todos los datos' })
    }
  }
  else {
    res.status(403).send({ ok: false, msg: 'Permisos insuficientes' })
  }
}

export const deleteProductById = (req, res) => {
  const id = parseInt(req.params.idProd)
  const { isUserAdmin } = req.body

  if (/*isAdmin */isUserAdmin && isUserAdmin === 'true') {
    archivoProductos.deleteObject(id)
      .then((r) => res.status(200).send(r))
  }
  else {
    res.status(403).send({ ok: false, msg: 'Permisos insuficientes' })
  }
}