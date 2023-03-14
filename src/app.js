import express from 'express'
import {cartRouter} from './cartRouter/cartRouter.js'
import {productsRouter} from './productsRouter/productsRouter.js'


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const server = app.listen(8080, () => console.log('Server ready on port 8080'))
console.log(server)

app.use(productsRouter)
app.use(cartRouter)



