'use strict';

const {db} = require('./db');

const getAllComics = async () => {
    try {
        const result = await db.query();
        return result.rows;
    } catch(err) {
        throw err;
    }
}
