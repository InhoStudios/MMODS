var express = require('express');
const icd = require('../utilities/ICDInterface');
var router = express.Router();

/* GET users listing. */
router.get('/', async (req, res, next) => {
  token = await icd.useToken();
  res.send(token);
});

module.exports = router;
