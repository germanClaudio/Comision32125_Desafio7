const { optionsqlite } = require('../options/SQLite3')
const knex = require('knex')(optionsqlite.sqlite)

    knex.schema.createTable('messages', table => {
        table.string('user')
        table.date('date');
        table.string('message');
        table.increments('id_message');
    })
    .then(() => console.log('Created messages table!'))
    .catch((err) => { console.log(err); throw err })
    .finally(() => {
        knex.destroy()
    })