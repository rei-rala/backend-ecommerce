require('dotenv').config()
console.log(process.env.test)

export const express = require('express')
const cartsRoute = require('./routes/carts.routes')
const productsRoute = require('./routes/product.routes')
const cartIndividualRoute = require('./routes/cartIndividual.routes')

import { archivoProductos } from "./models/persistence/Archivo"
import { archivoCarts } from "./models/persistence/Archivo"

import { addCart, deleteCartById, getCartId, getCarts, updateCartById } from "./controllers/carts.controller"
import { addProd, deleteProductById, getProdById, getProds, updateProductById } from "./controllers/products.controller"
import { addToCartByProdId, wipeCart, deleteFromCartByProdId, getCartProdById, getCartProds } from "./controllers/cartIndividual.controller"

const { agregaProductosPrueba } = require("./models/Product")
archivoProductos.cleanFile()
  .finally(() => agregaProductosPrueba())

const { agregaCarritosPrueba } = require("./models/CartIndividual")
archivoCarts.cleanFile()
  .finally(() => agregaCarritosPrueba())


const app = express()
const PORT = process.env.PORT || 8080

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/carritos', cartsRoute)
app.use('/productos', productsRoute)
app.use('/carrito', cartIndividualRoute)


app.listen(PORT, () => { console.log(`Escuchando en puerto ${PORT}`) })
app.on('error', (err: any) => console.info(`Se produjo el siguiente error:\n\t=>${err}`))


// ! RUTAS

// TEST ADMINISTRADOR, para el test se estan enviando en body la key isUserAdmin con STRING 'true'
const isAdmin = true

// ! PRODUCTOS - Modificaciones requieren admin
app.get('/productos/listar', getProds)
app.get('/productos/listar/:idProd', getProdById)
app.post('/productos/agregar', addProd)
app.patch('/productos/actualizar/:idProd', updateProductById)
app.delete('/productos/borrar/:idProd', deleteProductById)


// ! CARRITOS GLOBAL - Toda ruta requiere admin
app.get('/carritos/listar', getCarts)
app.get('/carritos/listar/:idCarr', getCartId)
app.post('/carritos/agregar', addCart)
app.patch('/carritos/actualizar/:idCarr', updateCartById)
app.delete('/carritos/borrar/:idCarr', deleteCartById)

// ! CARRITO INDIVIDUAL
app.get('/carrito/listar', getCartProds)
app.get('/carrito/listar/:idProd', getCartProdById)
app.post('/carrito/agregar/:idProd', addToCartByProdId)
app.delete('/carrito/borrar/:idProd', deleteFromCartByProdId)
app.delete('/carrito/limpiar', wipeCart)
