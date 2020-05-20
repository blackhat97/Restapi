'use strict';

const express = require('express');
const router = express.Router();
const { db } = require('../models/db');


// allows a user to view any person's enabled profile
router.get('/profiles/:profileID', async (req, res, next) => {
    try {
        const userInfoQuery = await db.query(`
            SELECT displayName, biography, email, joined
            FROM main.Account
            WHERE profileID = ?
        `, [req.params.profileID]);

        if (userInfoQuery.length === 0) {
            res.status(400).send(`No profile with id ${ req.params.profileID}`);
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
