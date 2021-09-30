import { express } from ".."
// PRODUCT
const productRouter = express.Router()

productRouter.get('/', (_, res) => {
  res.send('All PRODUCTS request')
})

module.exports = productRouter
