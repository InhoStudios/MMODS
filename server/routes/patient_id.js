var express = require('express');
const patient = require('../utilities/patientManager');
var router = express.Router();

router.get('/', (req, res, next) => {
    res.send(patient.id());
});

router.get('/ticket', (req, res, next) => {
    res.send(patient.tick())
});

module.exports = router;