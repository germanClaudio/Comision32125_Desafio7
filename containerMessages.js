const { optionsqlite } = require('./options/SQLite3')
const knex = require('knex')(optionsqlite.sqlite)

module.exports = class ContainerMsg {
    constructor(myFile, configConnection) {
        this.myFile = myFile
        this.knex = knex(configConnection)
        console.log('my file: '+ this.myFile)
        console.log('my connection: '+ JSON.stringify(configConnection, null, 2))
        // try {
        //     this.messages = this.knex.from(this.myFile).select("*")  //fs.readFileSync(this.myFile, 'utf-8')
        //     this.messages = JSON.parse(this.messages)
        // }
        // catch (error) {
        //     this.messages = []
        // }
    }

    async getAllMsg() {
        //const fileContent = this.messages
        //return fileContent
        try {
            const messages = await this.knex.from(this.myFile).select("*")//.orderBy('id_message', 'ASC')
            return messages
        } catch (error) {
            return new Error(`Error getting all messages ${error}`)
        }
    }

    async saveMsg(addMessage) {
        console.log('Dentro del saveProduct: '+ JSON.stringify(addMessage))
        try {
                console.log('mensaje guardado' )
                return await this.knex(this.myFile).insert(addMessage)
                //return ({ mensaje: 'mensaje guardado' })
            } catch (error) {
                return new Error(`Error saving product ${error}`)
            }    

        // const fileContent = this.myFile
        // console.log('filecontetn: '+ fileContent)
        
            // const messageToSave = JSON.stringify([...fileContent, { ...addMessage, id_message: fileContent[fileContent.length - 1].id_message + 1 }], null, 2)
            
            // try {
            //     this.messages = fs.writeFileSync(this.myFile, messageToSave)
            //     return messageToSave

            // } catch (error) {
            //     console.log(error)
            //     return { Error: 'Upps! Hubo un error y no pudimos guardar el Mensaje.' }
            // }
        }
}