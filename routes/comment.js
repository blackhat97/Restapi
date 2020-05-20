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


router.get('/:chapterID', async (req, res, next) => {
    try {
        const result = await db.query(`
            SELECT JSON_OBJECT('username', acc.displayName, 'image', acc.image, 'bio', acc.biography) as sender, msg.body, msg.favorited, msg.commentID, msg.createdAt
            FROM main.Comment msg
            INNER JOIN main.Account AS acc ON msg.senderID = acc.accountID
            INNER JOIN main.Chapter AS cha ON msg.chapterID = cha.chapterID
            WHERE msg.chapterID = ?
            ORDER BY timeSent DESC;`, [req.params.chapterID]);
        res.json({"comments": result});
    } catch (err) {
        next(err);
        return;
    }
});

module.exports = router;
