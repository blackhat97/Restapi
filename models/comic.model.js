'use strict';

const { db } = require('./db');

/**
 * Gets a list of all comics
 *
 * @returns {*} Returns info about every comic
 */
const getAllComics = async () => {
    try {
        const result = await db.query(`
            SELECT com.comicID, com.title, com.thumbnailURL, com.author, com.favorite, sch.updateDay as day, JSON_ARRAYAGG(gen.name) as genre
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

const getSimilarComics = async comicID => {
    try {
        const result = await db.query(`
            SELECT com.comicID, com.title, com.thumbnailURL, com.author, com.favorite, sch.updateDay as day, JSON_ARRAYAGG(gen.name) as genre
            FROM main.Comic AS com
            INNER JOIN main.Schedule AS sch ON com.comicID = sch.comicID
            INNER JOIN main.Genre AS gen ON com.comicID = gen.comicID
            GROUP BY comicID;`);

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
        const comicQuery = await db.query(`
            SELECT com.comicID, com.title, com.coverURL, JSON_ARRAYAGG(gen.name) as genres, com.author, com.favorite, com.view, com.description
            FROM main.Comic AS com
            INNER JOIN main.Genre AS gen ON com.comicID = gen.comicID
            WHERE com.comicID = ?`, [comicID]
        );

        if (comicQuery.length === 0) {
            return -1;
        }
        return (await getComicEpisodes(comicQuery[0]));
    } catch (err) {
        throw err;
    }
};

const getComicEpisodes = async comic => {
    try {
        const comicID = comic.comicID;

        comic.chapters = await db.query(`
            SELECT *
            FROM main.Chapter
            WHERE comicID = ?`, [comicID]);
        
        return comic;
    } catch (err) {
        throw err;
    }
};

const getComicContent = async chapter => {
    try {
        const chapterID = chapter.chapterID;

        chapter.pages = await db.query(`
            SELECT pageID, pageNumber, chapterID, imgURL, altText
            FROM main.Page 
            WHERE chapterID = ?
            ORDER BY pageNumber`, [chapterID]);

        return chapter;
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
            SELECT chapterID, name, date, published, prev_id, next_id FROM main.Chapter 
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
    getSimilarComics,
    getComicInfo,
    getPublishedContent,
};
