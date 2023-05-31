var express = require('express');
var router = express.Router();
var sql = require('../utilities/SQLInterface')

router.post('/', async (req, res, next) => {
    let into = req.body.into;
    let values = req.body.values;
    if (into == undefined || into == null || values == undefined || values == null || values.length <= 0) {
        res.send("Empty array");
    }
    await sql.insertArray(into, values).catch((e) => {
        res.send(e);
    });
    res.send({
        success: true
    });
});

module.exports = router;