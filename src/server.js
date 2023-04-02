import express from 'express'
import { cartRouter} from './cartRouter/cartRouter.js'
import { productsRouter} from './productsRouter/productsRouter.js'
import { viewsRouter } from './viewsRouter/viewsRouter.js'
import { engine } from 'express-handlebars'
import { Server as SocketIOServer } from 'socket.io'
import * as fs from 'fs'
import { ProductManager } from './Dao/ProductsManager.js'

const pm = new ProductManager('./src/database/products.json')

const __dirname = ('/Users/mauromachado/Desktop/curso/Backend/proyecto_final/src')
const app = express()
const server = app.listen(8080, () => console.log('Server ready on port 8080'))
console.log(server)
app.use(express.json())
const io = new SocketIOServer(server)

app.use((req, res, next) => {
    req['io'] = io
    next()
})
app.use(productsRouter)
app.use(cartRouter)
app.use(viewsRouter)

app.use('/viewsRouter', viewsRouter)

app.engine('handlebars', engine())
app.set('views', './src/views')

app.get('/socketproducts', (req, res, next)=>{
    res.sendFile(__dirname + '/views/rend.html');
})

io.on('connection', async socket => {
    console.log(`nuevo cliente conectado!${socket.id}`)     
    const getFile = await pm.getFile()
    socket.emit('actualizar', getFile)
})


