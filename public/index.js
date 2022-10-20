const socket = io.connect()
//console.log('socketIO')

// ----------  Messages ----------------
socket.on('mensajesAll', (data) => {
    //console.log('Data mensaje: ' + data)
    // socket.emit('respuesta', { socketID: data.id, mensaje: data } )
    render(data)
})

const addMessage = () => {
    const user = document.getElementById('author').value
    const message = document.getElementById('texto').value
    const today = new Date()
    const date = today.toLocaleString('en-GB')
    // console.log(text, author, date)
    socket.emit('newMensaje', { user, message, date })

    return false
}

const render = (data) => {
    console.log('render..... ' + JSON.parse(data))
    const array = JSON.parse(data)

    const html = array.map((element) => {
        console.log('Dentro del html '+data)
        return (`<div class="d-block mx-auto my-1 p-1">
                    <strong class="text-secondary">Msg#${element.id_message} -> </strong>
                    <strong class="fw-bold text-primary">${element.user}</strong>:
                    <e id="colorBrown" style="color:brown;">${element.date} </e>: 
                    <em id="colorGreen" style="color:MediumSeaGreen;">${element.message}</em>
               </div>`)
    }).join(" ")

    document.getElementById('mostrarMensajes').innerHTML = html

    // document.getElementById('author').value = ""
    document.getElementById('texto').value = ""
}


// --------------  Products ----------------
socket.on('productsAll', async (arrProd) => {
    console.log(arrProd)
    // socket.emit('respuesta', { socketID: data.id, mensaje: data } )
    renderProduct( await arrProd)
})

const addProduct = () => {
    const title = document.getElementById('title').value
    const price = Number(document.getElementById('price').value)
    const thumbnail = document.getElementById('thumbnail').value
    console.log(title, price, thumbnail)
    socket.emit('newProducto', { title, price, thumbnail })

    return false
}

const renderProduct = (arrProd) => {
    // console.log('render..... ' + JSON.parse(producto))
    const arrayProd = JSON.parse(arrProd)

    const html = arrayProd.map((element) => {
        console.log('Dentro del html '+data)
        return (`<tr>
                    <th scope="row" class="text-center"><strong>${element.id}</strong></th>
                    <td class="text-center">${element.title}</td>
                    <td class="text-center">$${element.price}</td>
                    <td class="text-center"><img class="img-fluid rounded" alt="Product Image" src='${element.thumbnail}' width="100" height="80"></td>
                    <td class="text-center">${element.thumbnail}</td>
                </tr>`)
    }).join(" ");

    document.getElementById('mostrarProductos').innerHTML = html

    const htmlProdList = 
        ( `<caption id="capProdList">Total Product List ${arrayProd.length}</caption>`)

    document.getElementById('capProdList').innerHTML = htmlProdList    

    document.getElementById('title').value = ""
    document.getElementById('price').value = ""
    document.getElementById('thumbnail').value = ""
}