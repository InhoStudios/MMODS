var express = require('express');
var router = express.Router();
var sql = require('../utilities/SQLInterface')

router.post('/', async (req, res, next) => {
    let body = req.body;
    let uploadedCase = {
        case_id: body.caseID,
        age: body.age,
        sex: body.sex,
        history: body.history,
        user_selected_entity: body.userEntity,
        anatomic_site: body.anatomicSite,
        severity: body.severity,
    };
    let response = await sql.insert("Cases", uploadedCase);
    res.send(response);
});

module.exports = router;