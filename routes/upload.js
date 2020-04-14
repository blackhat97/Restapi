const express = require("express");
var router = express.Router();
const multer = require("multer");
const uuid = require("uuid");
const path = "./public/upload";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path);
    },
    filename: (req, file, cb) => {
        // cb(null, new Date().valueOf() + path.extname(file.originalname));
        cb(null, uuid.v4().toString() + "_" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb("Type file is not access", false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: 1024 * 1024 * 5
});


router.get('/upload', function(req, res, next) {
    res.render('upload');
});

router.post('/upload', upload.array('image', 10), function(req, res){
    res.status(204);
    res.render('upload');
});
  
module.exports = router;  