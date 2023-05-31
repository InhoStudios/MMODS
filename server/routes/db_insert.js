var express = require('express');
var router = express.Router();
var sql = require('../utilities/SQLInterface')

router.post('/', async (req, res, next) => {
    let into = req.body.into;
    let values = req.body.values;
    await sql.insertArray(into, values).catch((e) => {
        res.send(e);
    });
    res.send({
        success: true
    });
});

module.exports = router;