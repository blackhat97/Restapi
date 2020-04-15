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
            SELECT com.comicID, com.title, com.thumbnailURL, com.author, com.favorite, sch.updateDay as day, JSON_ARRAYAGG(gen.genre) as genre
            FROM main.Comic AS com
            INNER JOIN main.Schedule AS sch ON com.comicID = sch.comicID
            INNER JOIN main.Genre AS gen ON com.comicID = gen.comicID
            GROUP BY comicID;`);
        
        return result;

    } catch(err) {
        throw err;
    }
}

const getRankComics = async () => {
    try {
        const result = await db.query(`
            SELECT  @curRank := @curRank + 1 AS rank,
                    comicID, title, author, thumbnailURL, favorite, view
            FROM      main.Comic, (SELECT @curRank := 0) r
            ORDER BY  favorite DESC;`);

        return result;
    } catch(err) {
        throw err;
    }
}

/**
 * Gets a comic deatil information
 *
 * @param {*} comicURL
 *
 * @returns {*} Returns info about the result
 */
const getComicInfo = async comicID => {
    try {
        let result = {};

        result.info = await db.query(`
            SELECT title, coverURL, author, favorite, view, description
            FROM main.Comic
            WHERE comicID = ?`, [comicID]);

        result.chapters = await db.query(`
            SELECT *
            FROM main.Chapter
            WHERE comicID = ?`, [comicID]);
        
        return result;
    } catch (err) {
        throw err;
    }
};

const getComicContent = async chapter => {
    try {
        const chapterID = chapter.chapterID;
        const result = await db.query(`
            SELECT pageNumber, altText, imgURL
            FROM main.Page 
            WHERE chapterID = ?
            ORDER BY pageNumber`, [chapterID]);
        return result;
    } catch (err) {
        throw err;
    }
};

/**
 * Gets a single published comic
 *
 * @param {string} chapterID - id of the comic owner's account
 *
 * @returns {*} Returns comic page contents if it is published
 */
const getPublishedContent = async chapterID => {
    try {
        const chapterQuery = await db.query(`
            SELECT * FROM main.Chapter 
            WHERE chapterID = ? AND published = 1`, [chapterID]
        );
        if (chapterQuery.length === 0) {
            return -1;
        }
        return (await getComicContent(chapterQuery[0]));
    } catch (err) {
        throw err;
    }
};


module.exports = {
    getAllComics,
    getRankComics,
    getComicInfo,
    getPublishedContent,
};
