const express = require('express');
const router = express.Router();
const queries = require('./dbqueries');

router.get('/', (req, res) => {
    queries.getAll('products').then(rows => {
        res.json(rows);
    })
});

module.exports = router;