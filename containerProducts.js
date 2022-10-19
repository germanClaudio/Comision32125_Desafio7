const fs = require("fs")

module.exports = class ContainerProducts {
    constructor(myFile) {
        this.myFile = myFile
        try {
            this.products = fs.readFileSync(this.myFile, 'utf-8')
            this.products = JSON.parse(this.products)
        }
        catch (error) {
            this.products = []
        }
    }
    
    getAllProd() {
        const fileContent = this.products
        return fileContent
    }

    saveProduct(addProduct) {
        const fileContent = this.products
        // console.log('FileContent: '+ fileContent)
            if (addProduct !== undefined && fileContent !== undefined) {
                const productToSave = JSON.stringify([...fileContent, { ...addProduct, id: fileContent[fileContent.length - 1].id + 1 }], null, 2)
                    try {
                        this.products = fs.writeFileSync(this.myFile, productToSave)
                        // console.log('try de saveproducts: '+ productToSave)
                        return productToSave
                    } catch (error) {
                        console.log(error)
                        return { Error: 'Upps! Hubo un error y no pudimos guardar el Producto.' }
                    }
            } else {
                return { Error: 'Upps! We had some problems saving the Product, try later.' }
            }
    }
}