import { archivoCarts } from "./Archivo"
import { Cart } from "./Cart"
import { Product } from "./Product"

export const carts: CartIndividual[] = []

class CartIndividual {
  id: number
  cart: Cart
  arrayOfProducts?: Product[]

  static cartId = 0

  constructor(arrayOfProducts?: Product[]) {
    this.id = ++CartIndividual.cartId
    this.cart = arrayOfProducts?.length
      ? new Cart(this.id, arrayOfProducts)
      : new Cart(this.id)
  }

  addProduct = (product: Product) => this.cart.addToCart(product)
  removeProduct = (id: number) => this.cart.removeFromCart(id)
  clear = () => this.cart.clearCart()
}


export const createNewCart = (arrayOfProducts?: Product[]) => {
  const newCart = arrayOfProducts?.length
    ? new CartIndividual(arrayOfProducts)
    : new CartIndividual()
  carts.push(newCart)

  return archivoCarts.saveNewObject(newCart.cart)
}

// esta funcion solamente es para que el array de productos comience con items para probar las request
export const agregaCarritosPrueba = async () => {
  const producto_a = new Product("Casa", 9999, 'productito number TEST1', "testCarrito",);
  const producto_b = new Product("Avion", 1234567, 'productito number TEST2', "testCarrito",);
  const producto_c = new Product("Mundo", 0, 'productito number TEST3', "testCarrito",);
  const producto_d = new Product("Evol", 150, 'productito number TEST4', "testCarrito",);

  createNewCart([producto_a, producto_b, producto_c])
    .then(() => createNewCart([producto_c, producto_a]))
    .then(() => createNewCart([producto_d, producto_a]))
    .then(() => createNewCart([producto_a, producto_b, producto_c, producto_d]))
}

