'use strict';

const {db} = require('./db');

/**
 * Gets a list of all comics
 *
 * @returns {*} Returns info about every comic
 */
const getAllComics = async () => {
    try {
        const result = await db.query(`
            SELECT comicID, accountID, title, comicURL, tagline, description, thumbnailURL 
            FROM main.Comic ORDER BY title`);
        return result;
    } catch(err) {
        throw err;
    }
}

/**
 * Gets a single comic
 *
 * @param {*} comic - vessel to store comic info in
 *
 * @returns {*} Returns info about the comic
 */
const getComicInfo = async comic => {
    try {
        const comicID = comic.comicid;

        
        return comic;
    } catch (err) {
        throw err;
    }
};

/**
 * Gets a single published comic
 *
 * @param {string} comicURL - id of the comic owner's account
 *
 * @returns {*} Returns info about the comic owned by an author if it is published
 */
const getPublishedComic = async comicURL => {
    try {
        const comicQuery = await db.query(`
            SELECT * FROM main.Comic 
            WHERE comicURL = $1 AND published = 1`, [comicURL]
        );

        if (comicQuery.rowCount === 0) {
            return -1;
        }
        return (await getComicInfo(comicQuery[0]));
    } catch (err) {
        throw err;
    }
};


module.exports = {
    getAllComics,
    getPublishedComic,
};