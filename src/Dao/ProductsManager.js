
import fs from 'fs/promises'


export class ProductManager {
    constructor(path){
        this.path = path
        this.productsList = []
    }

    async loadFile(){
        const json = await fs.readFile(this.path, 'utf-8')
        return JSON.parse(json)
    }

    async getFile(){
        return await this.loadFile()
    }

    async saveProduct(product) {
        await this.getFile()
        this.productsList.push(product)
        
        await this.saveFile(this.productsList)
    }

    async saveFile(productsList) {
        const json = JSON.stringify(productsList, null, 2)
        await fs.writeFile(this.path, json)
    }

    async replaceProduct(id, newProduct) {
        
        const listOfProducts = await this.getFile()
        const indiceBuscado = listOfProducts.findIndex(c => c.id === id)
        
        if (indiceBuscado === -1) {
            throw new Error('id no encontrado')
        } 
        listOfProducts[indiceBuscado] = newProduct
        await this.saveFile(listOfProducts)
        return newProduct 
    }
    async deleteProduct(id) {
        const arreglo = await this.loadFile()
        const indiceBuscado = arreglo.findIndex(c => c.id === id)
        if (indiceBuscado === -1) {
            throw new Error('id no encontrado')
        }
        const [borrado] = arreglo.splice(indiceBuscado, 1)
        await this.saveFile(arreglo)
        return arreglo
    }
}

const mg = new ProductManager('./src/database/products.json')

