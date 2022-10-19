const fs = require("fs")

module.exports = class ContainerMsg {
    constructor(myFile) {
        this.myFile = myFile
        try {
            this.messages = fs.readFileSync(this.myFile, 'utf-8')
            this.messages = JSON.parse(this.messages)
        }
        catch (error) {
            this.messages = []
        }
    }

    getAll() {
        const fileContent = this.messages
        return fileContent
    }

    saveMsg(addMessage) {
        const fileContent = this.messages
        // console.log('Dentro del saveProduct: '+ JSON.stringify(addMessage))
        if (addMessage !== undefined) {
            const messageToSave = JSON.stringify([...fileContent, { ...addMessage, id_message: fileContent[fileContent.length - 1].id_message + 1 }], null, 2)
            
            try {
                this.messages = fs.writeFileSync(this.myFile, messageToSave)
                return messageToSave

            } catch (error) {
                console.log(error)
                return { Error: 'Upps! Hubo un error y no pudimos guardar el Mensaje.' }
            }
        }
        else {
            return { Error: 'Upps! We had some problems saving the mensaje, try later.' }
        }
    }
}