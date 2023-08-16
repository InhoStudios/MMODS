var express = require('express');
var router = express.Router();
var sql = require('../utilities/SQLInterface')

router.get('/', async (req, res, next) => {
    let data = await sql.postQuery("SELECT 1 + 1 AS solution WHERE true");
    console.log(data);
    res.send(data);
});

module.exports = router;