
const express = require('express')
const cartRoute = require('./routers/cartRouter')
const productsRoute = require('./routers/productRouter')

const { archivoProductos/* ,agregaProductosPrueba() */ } = require("./productManager/productManager")
import { Producto } from "./productManager/productManager"
//agregaProductosPrueba()

const app = express()
const PORT = process.env.PORT || 8080

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/carrito', cartRoute)
app.use('/productos', productsRoute)


app.listen(PORT, () => { console.log(`Escuchando en puerto ${PORT}`) })
app.on('error', (err: any) => console.info(`Se produjo el siguiente error:\n\t=>${err}`))


// ! RUTAS

app.get('/productos/listar', (_, res) => {
  try {
    archivoProductos.read()
      .then(r => res.send({ ok: true, productos: r }))
      .catch(err => { throw new Error(err) })
  }
  catch (err) {
    console.log('Error en lectura de archivo:', err)
  }
})

app.get('/productos/listar/:idProd', (req, res) => {
  const id = parseInt(req.params.idProd)
  try {
    archivoProductos.read()
      .then((list: Producto[]) => list.find((p: Producto) => p.id === id))
      .then((p: Producto) => {
        p
          ? res.status(200).send({ ok: true, producto: p })
          : res.status(404).send({ ok: false, producto: {}, msg: `Not found id ${id}` })
      })

  }
  catch (err) {
    console.log('Error en lectura de archivo:', err)
  }
})