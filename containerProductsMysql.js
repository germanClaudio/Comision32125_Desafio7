const { options } = require('./options/config')
const knex = require('knex')(options.mysql)

module.exports = class ContainerProductsMysql {
    constructor(table, configConnection) {
        this.table = table
        this.knex = knex(configConnection)
    }
   
    async getAllProds() {
        try {
            return await this.knex.from(this.table).select("*").orderBy('id', 'ASC')
        } catch (error) {
            return new Error(`Error getting all products ${error}`)
        }
    }  
    
    async saveProduct(addProduct) {
        try {
            return await this.knex(this.table).insert(addProduct)
        } catch (error) {
            return new Error(`Error saving product ${error}`)
        }                
    }

    async getById(id) {
        try {
            return await this.knex.from(this.table).select('*').where('id', "=", parseInt(id))
        } catch (error) {
            return new Error(`Error getting one product ${error}`)
        }
    }

    async deleteById(id) {
        try {
            return await this.knex.from(this.table).where('id', "=", parseInt(id)).del()
        } catch (error) {
            return new Error(`Error getting one product ${error}`)
        }
    }

    async updateById(id, producto) {
        try {
            return await this.knex.from(this.table).where('id', "=", parseInt(id)).update(producto)
        } catch (error) {
            return new Error(`Error getting one product ${error}`)
        }
    }
}
