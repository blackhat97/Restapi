const express = require("express");
var router = express.Router();
const multer = require("multer");
const DIR = 'public/tmp';
const uploadModel = require('../models/upload.model');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
	cb(null, file.originalname);
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


router.post('/upload-contents', upload.array('file'), async (req, res) => {
    console.log(req.files);
    console.log(req.body.someField);
    if(!req.files){
      res.status(500).json({'success':false});
      return;
    }
    res.status(200).json({success:true,message:"File was uploaded successfully !"});

});


router.post('/upload-series', upload.array('file'), async (req, res, next) => {
  try {
    const body = req.body;
    const result = await uploadModel.postSeries(body);
    res.json(result);
    res.sendStatus(200);
  } catch (err) {
    next(err);
    return;
  }

});


router.post('/upload-episode', upload.single('thumb'), async (req, res) => {
  if (!req.file) {
    console.log("No file is available!");
    return res.send({
      success: false
    });

  } else {
    console.log('File is available!');
    return res.send({
      success: true
    })
  }
});


module.exports = router;  
