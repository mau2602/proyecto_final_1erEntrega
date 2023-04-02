
import fs from 'fs/promises'

export class CartManager {
    constructor(path){
        this.path = path
        this.cartsArray = []
    }
    
    async loadCart(){

        const cartFile = await fs.readFile(this.path, 'utf-8')
        return JSON.parse(cartFile)
    }
    
    async getCart(){

        return await this.loadCart()
    }

    async saveFile(cartsArray){

        const json = JSON.stringify(cartsArray, null, 2)
        await fs.writeFile(this.path, json)
    }

    async saveCart(cart){

        await this.getCart()
        this.cartsArray.push(cart)
        await this.saveFile(this.cartsArray)
    }
}
const carrito = new CartManager('./src/database/carrito.json')
console.log(await carrito.getCart())
