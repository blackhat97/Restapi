'use strict';

const { db } = require('./db');


const postSeries = async () => {
    try {
        const result = await db.query(`
	    INSERT INTO main.COmic (title, author, description, thumbnailUrl, coverUrl) VALUES (?, ?, ?, ?, ?);`);
        
        return result;

    } catch(err) {
        throw err;
    }
}

const postEpisode = async comicID => {
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

const postEpisodes = async comic => {
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

module.exports = {
    postSeries,
    postEpisode
};
