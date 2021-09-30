import { Product } from "./Product";
import { archivoCarts } from "./Archivo";

export class Cart {
  id: number
  timestamp: number
  arrayProducts: Product[]


  constructor(id: number, arrayProducts: Product[] = []) {
    this.id = id
    this.timestamp = Date.now()
    this.arrayProducts = []

    arrayProducts.length && arrayProducts.forEach(p => this.addToCart(p))
  }

  addToCart = async (product: Product) => {
    product.product_id = product.id

    let idTemp = this.arrayProducts.length
    let idsInArray = this.arrayProducts.map(p => p.id)

    while (idTemp in idsInArray) { idTemp++ }
    product.id = idTemp

    this.arrayProducts.push(product)
    return await archivoCarts.updateObject(this.id, this)
      .then(r => r)
  }

  removeFromCart = async (idProduct: number) => {
    if (this.arrayProducts.length === 0) { return ({ ok: false, msg: 'No se aplicaron cambios, carrito vacio' }) }

    this.arrayProducts = this.arrayProducts.filter(p => p.id !== idProduct)
    this.arrayProducts.forEach((p, index) => p.id = index)

    return await archivoCarts.updateObject(this.id, this)
  }

  clearCart = async () => {
    this.arrayProducts.length = 0
    return await archivoCarts.updateObject(this.id, this)
  }
}