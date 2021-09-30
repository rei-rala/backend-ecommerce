import { express } from ".."
// CART
const cartsRouter = express.Router()

cartsRouter.get('/', (_, res) => {
  res.send('All CARTS request')
})

module.exports = cartsRouter
