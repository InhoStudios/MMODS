var express = require('express');
var router = express.Router();
var sql = require('../utilities/SQLInterface')

router.get('/', async (req, res, next) => {
    let values = req.query.values;
    let from = req.query.from;
    let where = req.query.where;
    let results = await sql.select(values,from, where);
    console.log(results);
    res.send(results);
});

module.exports = router;