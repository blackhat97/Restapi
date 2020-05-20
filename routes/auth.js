'use strict';

const { db } = require('../models/db');
const passwords = require('../models/passwords');
const tokens = require('../tokens');
const email = require('../email');
const users = require('../models/users');

const express = require('express');
const router = express.Router();

/**
 * Produces the results of a sucesful authorzation such as logging in or registering
 *
 * @param {number} accountID Id of account that logged in
 * @param {string} role Role of the user
 * @param {string} username Name of the user
 * @returns {{token: string, role:string, username:string}}} a
 */
const authResponse = (accountID, role, displayName) => {
    return {
        token: tokens.createUserToken(accountID, role),
        displayName,
        role
    };
};

router.post('/register', async (req, res, next) => {
    try {
        if (req.body.password.length < 6) {
            res.status(400).json({
                message: 'password too short'
            });
            return;
        }
        const authData = await users.create(req.body, 'user');
        res.status(201)
            .json(authData);
    } catch (e) {
        next(e);
        return;
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const queryResult = await db.query(`
            SELECT password, salt, accountID, displayName, role
            FROM main.Account 
            WHERE LOWER(email) = LOWER(?)`, [req.body.email]);
        if (queryResult.length === 0) {
            res.status(400).send('No such account');
            return;
        }
        
        if (await passwords.checkPassword(req.body.password, queryResult.password, queryResult.salt)) {
            res.status(200)
                .json(authResponse(queryResult.accountid, queryResult.role, queryResult.displayName));
            return;
        }
        res.status(403).send('Password Incorrect');
    } catch (e) {
        next(e);
        return;
    }
});

router.post('/verifyEmail', tokens.authorize, async (req, res, next) => {
    try {
        if (req.user.email && req.user.accountID) {
            await db.query(`
                UPDATE main.Account
                SET emailVerified = true
                WHERE accountID = $1;
            `, [req.user.accountID]);
            res.status(200).json({
                message: 'done'
            });
        } else {
            res.sendStatus(403);
        }
    } catch (err) {
        next(err);
        return;
    }
});

router.get('/testAuth', tokens.authorize, async (req, res) => {
    res.json(req.user);
});

module.exports = router;
