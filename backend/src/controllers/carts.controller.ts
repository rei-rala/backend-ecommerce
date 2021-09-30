import { archivoCarts } from "../models/Archivo"
import { Cart } from "../models/Cart"
import { apiResp } from "../types"

export const getCarts = (req, res) => {
  const { isUserAdmin } = req.body

  if (/*isAdmin */isUserAdmin && isUserAdmin === 'true') {
    try {
      archivoCarts.read()
        .then((c: Cart[]) => res.send({ ok: true, cantidad: c.length, carritos: c }))
        .catch(err => { throw new Error(err) })
    }
    catch (err) {
      console.log('Error en lectura de archivo:', err)
    }
  } else {
    res.status(403).send({ ok: false, msg: 'Permisos insuficientes' })
  }
}

export const getCartId = (req, res) => {
  const id = parseInt(req.params.idCarr)
  const { isUserAdmin } = req.body

  if (/*isAdmin */isUserAdmin && isUserAdmin === 'true') {
    try {
      archivoCarts.read()
        .then((cart: Cart[]) => cart.find((c: Cart) => c.id === id))
        .then((c: Cart) => {
          c
            ? res.status(200).send({ ok: true, carrito: c })
            : res.status(404).send({ ok: false, carrito: {}, msg: `Not found id ${id}` })
        })
    }
    catch (err) {
      console.log('Error en lectura de archivo:', err)
    }
  }
  else {
    res.status(403).send({ ok: false, msg: 'Permisos insuficientes' })
  }
}

export const addCart = (req, res) => {
  const { isUserAdmin, arrayProducts } = req.body

  if (/*isAdmin */isUserAdmin && isUserAdmin === 'true') {
    if (arrayProducts && arrayProducts.length) {
      const created = new Cart(arrayProducts)
      archivoCarts.saveNewObject(created)
        .then((r: apiResp) => res.status(201).send(r))
    } else {
      res.status(401).send({ ok: false, msg: 'Complete todos los datos' })
    }
  }
  else {
    res.status(403).send({ ok: false, msg: 'Permisos insuficientes' })
  }
}

export const updateCartById = (req, res) => {
  const id = parseInt(req.params.idCarr)
  const { isUserAdmin, arrayProducts } = req.body

  if (/*isAdmin */isUserAdmin && isUserAdmin === 'true') {
    if (arrayProducts && arrayProducts.length) {
      const updatedData = new Cart(arrayProducts)

      archivoCarts.updateObject(id, updatedData)
        .then((r) => res.status(200).send(r))

    } else {
      res.status(401).send({ ok: false, msg: 'Complete todos los datos' })
    }
  }
  else {
    res.status(403).send({ ok: false, msg: 'Permisos insuficientes' })
  }
}

export const deleteCartById = (req, res) => {
  const id = parseInt(req.params.idCarr)
  const { isUserAdmin } = req.body

  if (/*isAdmin */isUserAdmin && isUserAdmin === 'true') {
    archivoCarts.deleteObject(id)
      .then((r) => res.status(200).send(r))
  }
  else {
    res.status(403).send({ ok: false, msg: 'Permisos insuficientes' })
  }
}