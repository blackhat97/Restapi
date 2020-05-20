'use strict';

const {
    db
} = require('./db');
const passwords = require('./passwords');
const tokens = require('../tokens');
const email = require('../email');
const config = require('../config');

/**
 * Produces the results of a sucesful authorzation such as logging in or registering
 *
 * @param {number} accountID Id of account that logged in
 * @param {string} role Role of the user
 * @param {string} displayName Name of th user
 * @returns {{token: string, role:string, displayName:string}} a
 */
const authResponse = (accountID, role, displayName) => {
    return {
        token: tokens.createUserToken(accountID, role),
        displayName,
        role
    };
};

/**
 * Registers a new user
 *
 * @param {{email: string, password:string}} userdata The user's info
 * @param {string} role Role of the user
 * @param {boolean} shouldVerifyEmail True if the users email should be verified
 * @returns {Promise<{token: string, role:string, displayName:string}>} Auth data
 */
const create = async (userdata, role, shouldVerifyEmail) => {
    const givenRole = role || 'user';
    const userEmail = userdata.email.toLowerCase();
    const passwordData = await passwords.getHashedPassword(userdata.password);
    const result = await db.query(`
        INSERT INTO Comics.Account (
            displayName,
            email,
            password,
            salt,
            role,
            emailVerified
        ) VALUES (?, ?, ?, ?, ?, ?)
        RETURNING accountID, role, email;`, [
        userdata.displayName,
        userEmail,
        passwordData.hash,
        passwordData.salt,
        givenRole, !shouldVerifyEmail
    ]);

    if (shouldVerifyEmail) {
        email.sendVerificationEmail(userEmail, result.accountid);
    }
    return authResponse(result.accountid, result.role, userdata.displayName);
}


module.exports = {
    create
};
