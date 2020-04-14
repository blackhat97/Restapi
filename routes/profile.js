'use strict';

const express = require('express');
const router = express.Router();
const { db } = require('../models/db');


// allows a user to view any person's enabled profile
router.get('/profiles/:profileURL', async (req, res, next) => {
    try {
        const userInfoQuery = await db.query(`
            SELECT username, biography, email, joined
            FROM main.Account 
            WHERE profileURL = ?
        `, [req.params.profileURL]);

        if (userInfoQuery.length === 0) {
            res.status(400).send(`No profile with url${ req.params.profileURL}`);
            return;
        }
        console.log(userInfoQuery);

        res.json({user: userInfoQuery});

    } catch (err) {
        next(err);
        return;
    }

});

module.exports = router;
