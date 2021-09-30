import { express } from ".."
// CART
const cartIndividualRouter = express.Router()

cartIndividualRouter.get('/', (_, res) => {
  res.send('CART request')
})

module.exports = cartIndividualRouter
