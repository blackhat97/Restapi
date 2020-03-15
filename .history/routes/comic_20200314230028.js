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

module.exports = router;
