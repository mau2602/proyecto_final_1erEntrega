import { randomUUID } from 'crypto'
import { Router } from 'express'
import { ProductManager } from '../Dao/ProductsManager.js'
import { Producto } from '../Producto.js'
import Handlebars from 'handlebars';

export const productsRouter = Router()

const pm = new ProductManager('./src/database/products.json')


productsRouter.get('/', async (req, res) => {
    const productos = await pm.getFile()
    res.render('home.handlebars', {encabezado: 'Productos', hayProductos: productos.length > 0, productos})
})  

productsRouter.get('/api/products', async (req, res) => {
       
    const productsList =  await pm.loadFile();
    const queryParamsText = req.query;  
     
    try{
    if(!queryParamsText.limit){
        res.json(productsList)
    } else {
        const limit = queryParamsText.limit
        if(!isNaN(limit)){ 
        res.json(productsList.slice(0, limit))
    }
    }
    } catch (error) {
        res.status(404).json(({message : error.message}))
    }
 })

productsRouter.get('/api/products/:pid', async (req, res) => {
        
    const productsList = await pm.loadFile()
    const reqParamsText = req.params;
    const pid = Object.values(reqParamsText);
    
    const found = productsList.find(i => i.id == pid)
    if (found){
        res.send(found)
    } else {
        throw new Error ("Error, Product not found")
    }
})

productsRouter.post('/api/products/', async (req, res) => {

    console.log(req.body)
    const productslist = await pm.loadFile()
    const {title,description,code,price,status,stock,category,thumbnail} = req.body
    
    const producto = new Producto ({
        id : randomUUID,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail
    })
    
    productslist.push(producto)
    await pm.saveFile(productslist) 
    
    res.send({status: "success", message: "Product created"})
})

productsRouter.put('/api/products/:pid', async (req, res) => {
    
    const newProduct = new Producto({
            id: req.params.pid,
            ...req.body
        })
        
        const replacedProduct = await pm.replaceProduct(req.params.pid, newProduct)
        console.log(replacedProduct)
        res.json(replacedProduct)     
})

productsRouter.delete('/api/products/:pid', async (req, res)=>{

    const deleted = await pm.deleteProduct(req.params.pid)
    res.json(deleted)

})