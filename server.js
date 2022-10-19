const express = require('express')

const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const app = express()

const { options } = require('./options/connection.js')
const knex = require('knex')(options)

const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const PORT = 8082

const ContainerMsg = require('./containerMessages')
const containerMsg = new ContainerMsg('./messages.json')
const getAllMsg = containerMsg.getAll()

// const ContainerProducts = require('./containerProducts')
// const containerProduct = new ContainerProducts("./productos.json")
// const getAllProducts = containerProduct.getAllProd()
const ContainerProductsMysql = require('./containerProductsMysql.js')
const containerProduct = new ContainerProductsMysql('productos', knex)
//const getAllProducts = containerProduct.getAllProds()

//console.log('GetAllProducts: ' + getAllProducts )

app.use(express.static('public'))
app.use(express.static('src/images'))
app.use(express.json())
app.use(express.urlencoded( { extended: true } ))

app.set('view engine', 'ejs')
app.set('views', __dirname + '/public/views/pages') 

app.get('/', (req, res) => {
    containerProduct.getAllProds().then( rows => {
        console.log (rows)
        if (rows !== 0) {
            res.render( 'index' , { rows, getAllMsg })  //getAllProducts
        } else {
            res.render( 'index' , { message: 'no products'}, getAllMsg )
        }
    })
})

app.get('/historial', (req, res) => {
    res.render( 'historial', { rows } )  //getAllProducts
})

app.all('*', (req, res) => {
    return res.status(404).send({
        Error: 'Path Not Found'
    })
})

// Servidor funcionando en el puerto 8080
httpServer.listen(PORT, () => {
    console.log(`SERVER listen on port ${PORT}`)
})

io.on('connection', (socket) => {
    // "connection" se ejecuta la primera vez que se abre una nueva conexión
    // Se imprimirá solo la primera vez que se ha abierto la conexión   
    console.log('Usuario conectado - ID User: ' + socket.id)
    
    // Messages --------------------------
    socket.emit('mensajesAll', JSON.stringify(getAllMsg))

    socket.on('newMensaje', (message) => {
       // arrayMens.push(message)
       const arrayMens = containerMsg.saveMsg(message)
       io.sockets.emit('mensajesAll', arrayMens)
    })

    // Productos --------------------------
    //socket.emit('productsAll', JSON.stringify(getAllProducts) )   

    socket.on('newProducto', (producto) => {
        console.log('Data servidor: ' + JSON.stringify(producto))
        const arrayProducts = containerProduct.saveProduct(producto)
        io.sockets.emit('productsAll', arrayProducts)
    })

    socket.on('disconnect', () => {
        console.log(`User desconectado`)
    })
})