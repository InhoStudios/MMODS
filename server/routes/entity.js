var express = require('express');
const icd = require('../utilities/ICDInterface');
var router = express.Router();

router.get('/', async (req, res, next) => {
    let entityCode = req.query.entity_code;
    let include = req.query.include ? req.query.include : "";
    let entity = await icd.getEntity(entityCode, include);
    res.send(entity);
});

module.exports = router;