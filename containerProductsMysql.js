// const { options } = require('./options/connection.js')
// const knex = require('knex')(options)


module.exports = class ContainerProducts {
    constructor(table, knex) {
        this.table = table
        this.knex = knex
        //console.log('thisKnex: '+ this.knex)
    }
   
    async getAllProds() {
        try {
            return await this.knex.from(this.table).select("*").orderBy('id', 'ASC')
        } catch (error) {
            return new Error(`Error ${error}`)
        }
    }  
    
    async saveProduct(addProduct) {
        try {
            return await this.knex(this.table).insert(addProduct)
        } catch (error) {
            return new Error(`Error ${error}`)
        }                
    }
}