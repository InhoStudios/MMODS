var express = require('express');
var router = express.Router();
var sql = require('../utilities/SQLInterface')

router.post('/', async (req, res, next) => {
    console.log(req.body);
    res.send("success");
});

module.exports = router;