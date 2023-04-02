
import express, { Router } from 'express'
import {randomUUID} from 'crypto'
import { Cart } from './cart.js'
import { CartManager } from './CartManager.js'
import { ProductManager } from './ProductsManager.js'

apiCarts.use(express.json())
apiCarts.use(express.urlencoded({ extended: true }))

export const apiCarts = Router()

const cm = new CartManager('src/database/carrito.json')
const pm = new ProductManager('src/database/products.json')

apiCarts.post('/api/carts/', async (req, res) =>{
    
    const cartsList = await cm.getCart()

    try {
        const cart = new Cart ({
            id : randomUUID(),
            ...req.body
        })
        cartsList.push(cart)
        await cm.saveFile(cartsList)
        res.send({status: "success", message: "Cart created"})
    } catch (error) {
        res.status(404).json(({message : error.message}))
    }  
})

apiCarts.get('/api/carts/:cid', async (req, res) =>{

    try {
    const cartsList = await cm.loadCart()
    const reqParamsText = req.params
    const cid = Object.values(reqParamsText)
    
    const found = cartsList.find(i => i.id == cid)
    if (found){
        res.send(found)
    }
} catch (error) {
    res.status(404).json(({message : error.message}))
}
})

apiCarts.post('/api/carts/:cid/products/:pid', async (req, res) =>{

    try {
    const cartsList = await cm.loadCart()
    const productsList = await pm.getFile()
    const reqParamsText = req.params

    const cid = Object.values(reqParamsText)
    const cartID = cid[0]
    const prodID = cid[1]

    const prodFound = productsList.find(i => i.id === prodID)
    const cartFound = cartsList.find(i => i.id == cartID)       

    if (cartFound && prodFound){
           
        if (cartFound.products.length==0){
            let product = ({ "id": prodID, "quantity": 1})
            cartFound.products.push(product)
            cm.saveFile(cartsList)
            } else {
                const found = cartFound.products.find(i => i.id === prodID)
                const qty = found.quantity+1
                const newProd = ({"id": prodID, "quantity": qty})
                cartFound.products = [newProd]
                cm.saveFile(cartsList)
            }                             
    res.send({status: "success", message: "Product created"})
   }} catch (error) {
    res.status(404).json(({message : error.message}))
}
})


