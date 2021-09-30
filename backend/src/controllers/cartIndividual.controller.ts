import { archivoCarts, archivoProductos } from "../models/Archivo"
import { Cart } from "../models/Cart"
import { carts } from "../models/CartIndividual"

const invalidateNumberIDs = (idCarrito: number, idProducto?: number) => {
  if (idProducto && idProducto === -1 && idCarrito && idCarrito === -1) { return ({ error: true, msg: 'ID Producto e ID Carrito invalido' }) }
  else if (idProducto && idProducto === -1) { return ({ error: true, msg: 'ID Producto invalido' }) }
  else if (idCarrito && idCarrito === -1) { return ({ error: true, msg: 'ID Carrito invalido' }) }

  return ({ error: false, msg: 'continue' })
}

export const getCartProds = (req, res) => {
  const cartId = req.body.cartId && !isNaN(req.body.cartId) ? parseInt(req.body.cartId) : -1

  const test = invalidateNumberIDs(cartId)
  if (test.error) return res.send(test)

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
    res.send({ ok: false, msg: err })
  }
}

export const getCartProdById = (req, res) => {
  const idProd = req.params.idProd && !isNaN(req.params.idProd) ? parseInt(req.params.idProd) : -1
  const cartId = req.body.cartId && !isNaN(req.body.cartId) ? parseInt(req.body.cartId) : -1

  const test = invalidateNumberIDs(cartId, idProd)
  if (test.error) return res.send({ ok: false, msg: test.msg })

  try {
    const cartFound = carts.find(c => c.id === cartId)

    if (cartFound) {
      archivoCarts.getById(cartId)
        .then((c: Cart) => {
          const prodInCart = c.arrayProducts.find(p => p.id === idProd)
          prodInCart
            ? res.status(200).send({ ok: true, idCarrito: c.id, timestamp: c.timestamp, producto: prodInCart })
            : res.status(404).send({ ok: false, idCarrito: c.id, producto: {}, msg: `No encontrado producto id ${idProd}` })
        })
        .catch(err => { throw new Error(err) })
    } else {
      throw new Error(`Carrito con ID ${cartId} no encontrado`)
    }
  }
  catch (err) {
    res.send({ ok: false, msg: err })
  }
}

export const addToCartByProdId = (req, res) => {
  const idProd = req.params.idProd && !isNaN(req.params.idProd) ? parseInt(req.params.idProd) : -1
  const cartId = req.body.cartId && !isNaN(req.body.cartId) ? parseInt(req.body.cartId) : -1

  const test = invalidateNumberIDs(cartId, idProd)
  if (test.error) return res.send(test)


  try {
    const modifiedChart = carts.find(c => c.id === cartId)

    if (modifiedChart) {
      const newProductInChart = archivoProductos.getById(idProd)
      newProductInChart
        .then(found => {
          if (found) {
            return modifiedChart.addProduct(found)
          } else {
            throw new Error('Producto no encontrado.')
          }
        })
        .then(r => res.send({ idCarrito: cartId, ...r }))
    } else {
      throw new Error('Cart no encontrado.')
    }
  } catch (err) {
    res.send({ ok: false, msg: err })
  }
}

export const deleteFromCartByProdId = (req, res) => {
  const cartId = req.body.cartId && !isNaN(req.body.cartId) ? parseInt(req.body.cartId) : -1
  const idProd = req.params.idProd && !isNaN(req.params.idProd) ? parseInt(req.params.idProd) : -1

  const test = invalidateNumberIDs(cartId, idProd)
  if (test.error) return res.send(test)


  try {
    const modifiedCart = carts.find(c => c.id === cartId)
    if (modifiedCart) {
      modifiedCart.removeProduct(idProd)
        .then(r => res.send({ idCarrito: cartId, ...r }))
    } else {
      res.send({ ok: false, msg: `Carrito no encontrado con ID ${cartId}` })
    }
  } catch (err) {
    res.send({ ok: false, msg: err })
  }
}


export const wipeCart = (req, res) => {
  const cartId = req.body.cartId && !isNaN(req.body.cartId) ? parseInt(req.body.cartId) : -1

  const test = invalidateNumberIDs(cartId)
  if (test.error) return res.send(test)


  try {
    const modifiedCart = carts.find(c => c.id === cartId)
    if (modifiedCart) {
      modifiedCart.clear()
        .then(r => res.send({ idCarrito: cartId, ...r }))
    } else {
      res.send({ ok: false, msg: `Carrito no encontrado con ID ${cartId}` })
    }
  } catch (err) {
    res.send({ ok: false, msg: err })
  }
}