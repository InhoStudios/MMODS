var express = require('express');
const patient = require('../utilities/patientManager');
var router = express.Router();

router.get('/', async (req, res, next) => {
    res.send(patient.id());
});

module.exports = router;