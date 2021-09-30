import { archivoCarts, archivoProductos } from "../models/Archivo"
import { Cart } from "../models/Cart"
import { Product } from "../models/Product"
import { carts } from "../models/CartIndividual"

export const getCartProds = (req, res) => {
  const cartId = req.body.cartId ? parseInt(req.body.cartId) : -1

  try {
    const modifiedChart = carts.find(c => c.id === cartId)

    if (!modifiedChart) { throw new Error('Carrito no encontrado') }

    archivoCarts.read()
      .then((c: Cart[]) => c.find(cart => cart.id === cartId))
      .then((cart: Cart) => {
        cart
          ? res.send({ ok: true, idCarrito: cart.id, timestamp: cart.timestamp, cantidad: cart.arrayProducts.length, carrito: cart.arrayProducts })
          : res.send({ ok: false })
      })
      .catch(msg => res.send({ ok: false, msg }))
  }
  catch (err) {
    console.log('Error en lectura de archivo:', err)
    res.send({ ok: false, msg: err })
  }
}

export const getCartProdById = (req, res) => {
  const idProd = req.params.idProd ? parseInt(req.params.idProd) : -1
  const cartId = req.body.cartId ? parseInt(req.body.cartId) : -1

  try {
    archivoCarts.read()
      .then((cart: Cart[]) => cart.find((c: Cart) => c.id === cartId))
      .then((c: Cart) => {
        const prodInCart = c.arrayProducts.find(p => p.id === idProd)
        prodInCart
          ? res.status(200).send({ ok: true, idCarrito: c.id, timestamp: c.timestamp, producto: prodInCart })
          : res.status(404).send({ ok: false, producto: {}, msg: `Not found id ${idProd}` })
      })
      .catch(err => { throw new Error(err) })
  }
  catch (err) {
    res.send({ ok: false, msg: err })
  }
}

export const addToCartByProdId = (req, res) => {
  const idProd = req.params.idProd ? parseInt(req.params.idProd) : -1
  const cartId = req.body.cartId ? parseInt(req.body.cartId) : -1

  try {
    const modifiedChart = carts.find(c => c.id === cartId)
    const newProductInChart = archivoProductos.getById(idProd)


    if (modifiedChart) {
      newProductInChart
        .then(found => {
          if (found) {
            return modifiedChart.addProduct(found)
          } else {
            throw new Error('Cart o Producto no encontrado.')
          }
        })
        .then(r => res.send({ idCarrito: cartId, ...r }))
    } else {
      throw new Error('Cart o Producto no encontrado.')
    }
  } catch (err) {
    console.log('Error en  de archivo:', err)
    res.send({ ok: false, msg: err })
  }
}

export const deleteFromCartByProdId = (req, res) => {
  const cartId = req.body.cartId ? parseInt(req.body.cartId) : -1
  const idProd = req.params.idProd ? parseInt(req.params.idProd) : -1

  try {
    const modifiedCart = carts.find(c => c.id === cartId)
    if (modifiedCart) {
      modifiedCart.removeProduct(idProd)
        .then(r => res.send({ idCarrito: cartId, ...r }))
    } else {
      res.send({ ok: false, msg: `Carrito no encontrado con ID ${cartId}` })
    }
  } catch (err) {
    console.log('Error en  de archivo:', err)
    res.send({ ok: false, msg: err })
  }
}


export const cleanCartById = (req, res) => {
  const cartId = req.body.cartId ? parseInt(req.body.cartId) : -1
  try {
    const modifiedCart = carts.find(c => c.id === cartId)
    if (modifiedCart) {
      modifiedCart.clear()
        .then(r => res.send({ idCarrito: cartId, ...r }))
    } else {
      res.send({ ok: false, msg: `Carrito no encontrado con ID ${cartId}` })
    }
  } catch (err) {
    console.log('Error en  de archivo:', err)
    res.send({ ok: false, msg: err })
  }
}