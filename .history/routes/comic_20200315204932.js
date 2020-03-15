'use strict';

var express = require('express');
var router = express.Router();
const comicModel = require('../models/comic.model');

/* GET home page. */
router.get('/comics', async (req, res, next) => {
  try {
    const result = await comicModel.getAllComics();
    res.json(result);
  } catch (err) {
    next(err);
    return;
  }
});

/* Get a single comic from url */
router.get('/get/:comicURL', async (req, res, next) => {
  try {
    const comicURL = req.params.comicURL;

    const comic = await comicModel.getPublishedComic(comicURL);
    if (comic === -1) {
      res.status(400).send(`No comic with url ${comicURL}`);
      return;
    }
    res.json(comic);
  } catch (err) {
    next(err);
    return;
  }
});


module.exports = router;
