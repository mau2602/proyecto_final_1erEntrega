import  express, {Router}  from "express"
import { ProductManager } from "../ProductsManager.js"
 import {randomUUID} from 'crypto'
import { Cart } from "../Cart.js"
import { CartManager } from "../CartManager.js"

export const cartRouter = Router()

cartRouter.use(express.json())
cartRouter.use(express.urlencoded({ extended: true }))

const pm = new ProductManager('./src/database/products.json')
const cm = new CartManager('./src/database/carrito.json')

cartRouter.post('/api/carts/', async (req, res) =>{
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

cartRouter.get('/api/carts/:cid', async (req, res) =>{

    const cartsList = await cm.loadCart()
    const reqParamsText = req.params
    const cid = Object.values(reqParamsText)

    const found = cartsList.find(i => i.id == cid)
    if (found){
        res.send(found.products)
    } else {
        throw new Error ("Error, Product not found")
    }
})

cartRouter.post('/api/carts/:cid/product/:pid', async (req, res) =>{

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
   }
})


