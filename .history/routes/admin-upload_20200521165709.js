const express = require("express");
var router = express.Router();
const upload = require('../upload');
const tokens = require('../tokens');
const uploadModel = require('../models/upload.model');

//const multer = require("multer");
//const DIR = 'public/tmp';

/*
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
*/


router.post(
  '/addSeries',
  tokens.authorize,
  upload.multer.array('file'),
  upload.sendUploadToGCS(),
  async (req, res, next) => {
    if (!req.files) {
      res.status(400).send('No image uploaded');
      return;
    }
    try {
      await uploadModel.addSeries(
        req.body.title,
        req.body.author,
        req.body.description || null,
        req.files[0].fileKey,
        req.files[1].fileKey
      );
      res.status(201).json();
    } catch (err) {
      next(err);
      return;
    }
  }
);

router.post(
  '/addEpisode', 
  tokens.authorize,
  upload.multer.single('thumb'),
  upload.sendUploadToGCS(), 
  async (req, res, next) => {
    if (!req.file || !req.file.fileKey) {
      res.status(400).send('No image uploaded');
      return;
    }
    try {
      await uploadModel.addSeries(
        req.body.title,
        req.body.author,
        req.body.description || null,
        req.file.fileKey
      );
      res.status(201).json();
    } catch (err) {
      next(err);
      return;
    }
});

router.post(
  '/uploadContents',
  tokens.authorize,
  upload.multer.array('file'), 
  upload.sendUploadToGCS(), 
  async (req, res, next) => {
    if (!req.files) {
      res.status(400).send('No image uploaded');
      return;
    }
    try {
      await uploadModel.addContents(
        req.file.fileKey
      );
      res.status(201).json();
    } catch (err) {
      next(err);
      return;
    }
});


module.exports = router;  
