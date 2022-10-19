const { options } = require('./options/connection.js')
const knex = require('knex')(options)


module.exports = class ContainerProducts {
    constructor(table, knex) {
        this.table = table
        this.knex = knex
        console.log('thisKnex: '+ this.knex)
    }
   
    async getAllProds() {
            await knex.from(this.table).select("*").orderBy('id', 'ASC')
            .then( (rows) => {
                ///console.table(rows)
                for (let row of rows) {
                    console.table(`${row['title']} ${row['price']}`)
                }
                return knex(this.table)
            })    
            .catch((err) => { console.log(err); throw err })
            .finally(() => {
            knex.destroy()
            })
    }  

    
    async saveProduct(addProduct) {
                await knex(this.table).insert(addProduct)
                .then(() => console.log('Product inserted successfully'))
                .catch((err) => { console.log('Este es el error: '+err); throw err })
                .finally(() => {
                    knex.destroy()
                })
            }
}
