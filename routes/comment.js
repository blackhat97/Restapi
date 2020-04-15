'use strict';
const express = require('express');
const router = express.Router();
const { db } = require('../models/db');


router.post('/send', async (req, res, next) => {
    try {
        await db.query(`
            INSERT INTO Comics.Comment 
            (senderID, chapterID, content)
            VALUES (?, ?, ?);
        `, [req.user.accountID, req.body.chapterID, req.body.content]);
        res.sendStatus(200);
    } catch (err) {
        next(err);
        return;
    }
});

router.get('/list/:chapterID', async (req, res, next) => {
    try {
        console.log(req.body);
        const result = await db.query(`
            SELECT acc.username as sender, msg.content, msg.like, msg.timeSent, msg.commentID
            FROM main.Comment msg
            INNER JOIN main.Account AS acc ON msg.senderID = acc.accountID
            INNER JOIN main.Chapter AS cha ON msg.chapterID = cha.chapterID
            WHERE msg.chapterID = ?
            ORDER BY timeSent DESC;`, [req.params.chapterID]);
        res.json(result);
    } catch (err) {
        next(err);
        return;
    }
});

module.exports = router;
