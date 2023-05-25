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
        const ext = file.originalname.split(".").slice(-1)[0];
        cb(null, `${uuidv4()}.${ext}`);
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
    let caseID = uuidv4();
    let uploadedCase = {
        case_id: `'${caseID}'`,
        age: caseBody.age,
        sex: `'${caseBody.sex}'`,
        history: caseBody.history == "t" ? 1 : 0,
        user_selected_entity: caseBody.userEntity,
        severity: `'${caseBody.severity}'`
    };
    let imageBody = JSON.parse(req.body.imageMetadata);
    let imageID = uuidv4();
    let url = `${req.protocol}://${req.hostname}:9000/${req.file.path}`
    let uploadedImage = {
        img_id: `'${imageID}'`,
        filename: `'${req.file.filename}'`,
        url: `'${url}'`,
        modality: `'${imageBody.modality}'`,
        anatomic_site: imageBody.anatomic_site
    }
    sql.insert("Cases", uploadedCase);
    sql.insert("Image", uploadedImage);
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