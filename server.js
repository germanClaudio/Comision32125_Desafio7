const express = require('express')

const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const app = express()

const { options } = require('./options/config.js')
const { optionsqlite } = require('./options/SQLite3.js')
//const sqlite3 = require('sqlite3')

const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const PORT = 8082

const ContainerMessages = require('./containerMessages.js')
const containerMsg = new ContainerMessages( 'messages', optionsqlite.sqlite )
//const getAllMsg = containerMsg.getAll()

const ContainerProductsMysql = require('./containerProductsMysql.js')
const containerProduct = new ContainerProductsMysql( 'productos', options.mysql)
//const getAllProducts = containerProduct.getAllProds()


app.use(express.static('public'))
app.use(express.static('src/images'))
app.use(express.json())
app.use(express.urlencoded( { extended: true } ))

app.set('view engine', 'ejs')
app.set('views', __dirname + '/public/views/pages') 


app.get('/', async (req, res) => {
    try {
        const productos = await containerProduct.getAllProds()
        const getAllMsgDB = await containerMsg.getAllMsg()
        console.log('getAllMsg: '+ getAllMsgDB)
        if (getAllMsgDB !== {}){
            res.status(200).json( { data: productos,  msg: getAllMsgDB } )
            //res.render('index' , { productos, getAllMsg } )
        } else {
            res.status(200).json({msg: 'No products founded' })
        }
    } catch (error) {
        res.status(400).json({msg: 'No products availables' })
        
    }
    }) 

app.get('/:id', async (req, res) => {
    try {
        const productos = await containerProduct.getById(parseInt(req.params.id))
        console.log('Productos: '+productos)
        if (productos !== []){
            res.status(200).json( { data: productos })
        } else {
            res.status(200).json({msg: 'No products founded' })
        }
    } catch (error) {
        res.status(400).json({msg: 'No products availables' })
    }
})

app.get('/historial', async (req, res) => {
    try {
        res.status(200).json({data: await containerProduct.getAllProds() })
    } catch (error) {
        res.status(400).json({msg: 'No products availables' })
    }
})

app.delete('/:id', async (req, res) => {
    try {
        res.status(200).json({data: await containerProduct.deleteById(parseInt(req.params.id)) })
    } catch (error) {
        res.status(400).json({msg: 'The product was not deleted!!' })
    }
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
    socket.emit('mensajesAll', getAllMsgDB ) //JSON.stringify(getAllMsg))

    socket.on('newMensaje', async (message) => {
       containerMsg.saveMsg(message)   //const arrayMens = await containerMsg.saveMsg(message)
       io.sockets.emit('mensajesAll', await containerMsg.getAllMsg())
    })

    // Productos --------------------------
    socket.emit('productsAll', containerProduct.getAllProds() )   

    socket.on('newProducto', async (producto) => {
        console.log('Data servidor: ' + JSON.stringify(producto))
        const arrayProducts = await containerProduct.saveProduct(producto)
        io.sockets.emit('productsAll', arrayProducts)
    })

    socket.on('disconnect', () => {
        console.log(`User desconectado`)
    })
})