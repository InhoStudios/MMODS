var express = require("express");
const sql = require("../utilities/SQLInterface");
var router = express.Router();

router.get('/', async (req, res, next) => {
    let results = await getImagesFromRequest(req);
    res.send(results);
});

router.get('/download', async(req, res, next) => {
    let results = await getImagesFromRequest(req);
    res.send("image zip");
});

async function getImagesFromRequest(req) {
    // TODO: entity code from query
    let entityCode = req.query.entity_code ? `c.user_selected_entity='${req.query.entity_code}'` : "true";
    // TODO: view from query
    let view = req.query.view ? `i.view=${req.query.view}` : 'true';
    // TODO: severity from query
    let severity = req.query.severity ? `c.severity='${req.query.severity}'` : "true";
    // TODO: modality from image
    let modality = req.query.modality ? `i.modality='${req.query.modality}'` : "true";
    // TODO: sex from image
    let sex = req.query.sex ? `c.sex='${req.query.sex}'` : "true";
    // TODO: min-age from image
    let min_age = req.query.min_age ? `c.age>=${req.query.min_age}` : "true";
    // TODO: max-age from image
    let max_age = req.query.max_age ? `c.age<=${req.query.max_age}` : "true";
    // TODO: body site from image
    let site = req.query.site ? `i.anatomic_site=${req.query.site}` : "true";
    let query = `select c.case_id, i.img_id, c.user_selected_entity, i.anatomic_site, i.filename, i.url, 
        c.age, c.sex, c.history, c.size, c.severity, c.fitzpatrick_type, c.tags, i.modality,
        i.view
        from Cases c, Image i
        where i.case_id=c.case_id and ${entityCode} and ${view} and ${severity} and ${modality} 
        and ${sex} and ${min_age} and ${max_age} and ${site};
        `;
    let results = await sql.postQuery(query);
    return results;
}

module.exports = router;