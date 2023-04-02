import { Router } from 'express'
import { ProductManager } from '../Dao/ProductsManager.js'
import { Server as SocketIoServer } from 'socket.io'
import { Producto } from '../Producto.js'
import { randomUUID } from 'crypto'

const pm = new ProductManager('./src/database/products.json')
export const viewsRouter = Router()

viewsRouter.get('/realtimeproducts', async (req, res, next) => {
  const productos = await pm.getFile()
  res.render('realTimeProducts.handlebars', {encabezado: 'Lista de Productos', hayProductos: productos.length > 0, productos})
})

viewsRouter.post('/realtimeproducts', async (req, res, next) => {
  const {title,description,code,price,status,stock,category,thumbnail} = req.body
    
    const producto = new Producto ({
        id : randomUUID(),
        ...req.body
    })
  
  const productos = await pm.getFile()
  productos.push(producto)
  await pm.saveFile(productos)
  
  req['io'].sockets.emit('actualizar', productos) 
  res.render('realTimeProducts.handlebars', {encabezado: 'Lista de Productos', hayProductos: productos.length > 0, productos})
})

viewsRouter.delete('/realtimeproducts/:pid', async (req, res, next) => { 
  const productos = await pm.getFile()
  const deleted = await pm.deleteProduct(req.params.pid)
  req['io'].sockets.emit('actualizar', deleted) 
  //res.render('realTimeProducts.handlebars', {encabezado: 'Lista de Productos', hayProductos: productos.length > 0, productos})
  res.json(deleted)
})

