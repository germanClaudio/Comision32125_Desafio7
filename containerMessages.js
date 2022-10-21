const { optionsqlite } = require('./options/SQLite3')
const knex = require('knex')(optionsqlite.sqlite)

module.exports = class ContainerMsg {
    constructor(myFile, configConnection) {
        //console.log('file and config:  ' + myFile, configConnection)
        this.myFile = myFile
        this.knex = knex(configConnection)
    }

    async getAllMsg() {
        try {
            const messages = await this.knex.from(this.myFile).select("*")  //.orderBy('id_message', 'ASC')
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
        }
}