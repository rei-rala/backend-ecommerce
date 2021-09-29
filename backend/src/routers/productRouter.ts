import express from "express"
// PRODUCT
const productRouter = express.Router()

productRouter.get('/', (_, res) => {
  res.send('PRODUCT request')
})

module.exports = productRouter
