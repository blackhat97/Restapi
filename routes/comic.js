'use strict';

var express = require('express');
var router = express.Router();
const comicModel = require('../models/comic.model');

/* GET all series */
router.get('/weekly', async (req, res, next) => {
  try {
    const result = await comicModel.getAllComics();
    res.json({"results": result});
  } catch (err) {
    next(err);
    return;
  }
});

router.get('/rank', async (req, res, next) => {
  try {
    const result = await comicModel.getRankComics();   
    res.json({"results": result});
  } catch (err) {
    next(err);
    return;
  }
});

router.get('/:comicID', async (req, res, next) => {
  try {
    const comicID = req.params.comicID;
    const result = await comicModel.getComicInfo(comicID);
    res.json(result);
  } catch (err) {
    next(err);
    return;
  }
});

router.get('/:comicID/similar', async (req, res, next) => {
  try {
    const comicID = req.params.comicID;
    const result = await comicModel.getSimilarComics(comicID);
    res.json({"results": result});
  } catch (err) {
    next(err);
    return;
  }
});

/* Get a single comic from url */
router.get('/contents/:chapterID', async (req, res, next) => {
  try {
    const chapterID = req.params.chapterID;
    
    const content = await comicModel.getPublishedContent(chapterID);
    if (content === -1) {
      res.status(400).send(`episode ${chapterID} is private`);
      return;
    }
    res.json(content);
  } catch (err) {
    next(err);
    return;
  }
});


module.exports = router;
