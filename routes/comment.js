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

router.get('/list', async (req, res, next) => {
    try {
        const result = await db.query(`
            SELECT acc.username as sender, msg.content, msg.like, msg.timeSent, msg.messageID
            FROM Comics.Message msg
            INNER JOIN Comics.Account AS acc ON msg.senderID = acc.accountID
            INNER JOIN Comics.Chapter AS cha ON msg.chapterID = cha.chapterID
            WHERE chapterID = ?
            ORDER BY timeSent DESC;`, [req.body.chapterID]);
        res.json(result.rows);
    } catch (err) {
        next(err);
        return;
    }
});

module.exports = router;
