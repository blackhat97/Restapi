'use strict';

const {db} = require('./db');

const getAllComics = async () => {
    try {
        const result = await db.query(`
            SELECT comicID, accountID, title, comicURL, tagline, description, thumbnailURL 
            FROM Comics.Comic ORDER BY title`);
        return result.rows;
    } catch(err) {
        throw err;
    }
}
