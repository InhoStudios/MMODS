var express = require('express');
var router = express.Router();
var multer = require('multer');
var uuidv4 = require('uuid/v4');
var sql = require('../utilities/SQLInterface')

const DIR = "./public/images/"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        // TODO: Generate unique filename
        const filename = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, `${uuidv4()}-${filename}`);
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("Only .png, .jpg, and .jpeg files allowed"));
        }
    }
});

router.post('/', upload.single('image'), async (req, res, next) => {
    let caseBody = JSON.parse(req.body.case);
    let uploadedCase = {
        case_id: caseBody.caseID,
        age: caseBody.age,
        sex: caseBody.sex,
        history: caseBody.history,
        user_selected_entity: caseBody.userEntity,
        anatomic_site: caseBody.anatomicSite,
        severity: caseBody.severity,
    };
    sql.insert("Cases", uploadedCase);
    console.log(caseBody);
    console.log(uploadedCase);
    if (!req.file) {
        console.log("No image received");
        return res.send({
            success: false
        });
    } else {
        console.log(`Image received: ${req.file.filename}\nImage hosted at ${req.protocol}://${req.hostname}:9000/${req.file.path}`);
        return res.send({
            success: true
        });
    }
});

module.exports = router;