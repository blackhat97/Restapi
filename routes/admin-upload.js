const express = require("express");
var router = express.Router();
const multer = require("multer");
const DIR = 'public/tmp';
const { db } = require('../models/db');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        //cb(null, new Date().valueOf() + "_" + file.originalname);
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
    //limits: 1024 * 1024 * 5
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
  const title = req.body.title || '',
	author = req.body.author || '',
	description = req.body.description || '',
	thumbUrl = req.body.thumbUrl || '',
	backdropUrl = req.body.backdropUrl || '';

  let insert_query = `INSERT INTO main.Comic (title, author, description, thumbnailUrl, coverUrl) VALUES (?, ?, ?, ?, ?, ?);`;

  try {
    await db.query(insert_query, [title, author, description, thumbUrl, backdropUrl]);
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
