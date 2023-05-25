var express = require('express');
var router = express.Router();
var multer = require('multer');

const DIR = "./public/images/"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        // TODO: Generate unique filename
        const fileName = "";
        cb(null, file.fieldname)
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
    if (!req.image) {
        console.log("No image received");
        return res.send({
            success: false
        });
    } else {
        console.log("Image received");
        return res.send({
            success: true
        });
    }
});

module.exports = router;