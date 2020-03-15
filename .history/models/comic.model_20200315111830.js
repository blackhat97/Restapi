'use strict';

const {db} = require('./db');

const getAllComics = async () => {
    try {
        const result = await db.query(`
            SELECT comicID, accountID, title, comicURL, tagline, description, thumbnailURL 
            FROM main.Comic ORDER BY title`);
        console.log(result);
        return result.rows;
    } catch(err) {
        throw err;
    }
}


module.exports = {
    getAllComics,
};