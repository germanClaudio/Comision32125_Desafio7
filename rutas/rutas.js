const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    queries.getAll('products').then(rows => {
        res.json(rows);
    })
});

module.exports = router;