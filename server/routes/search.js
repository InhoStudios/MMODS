var express = require('express');
const icd = require('../utilities/ICDInterface');
var router = express.Router();

router.get('/', async (req, res, next) => {
    let search = req.query.query;
    let searchResult = await icd.search(search);
    res.send(searchResult);
});

module.exports = router;