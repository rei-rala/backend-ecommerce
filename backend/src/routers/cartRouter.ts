import express from 'express'
// CART
const cartRouter = express.Router()

cartRouter.get('/', (_, res) => {
  res.send('CART request')
})

module.exports = cartRouter
