'use strict';

const Storage = require('@google-cloud/storage');
const Multer = require('multer');
const sharp = require('sharp');
const config = require('./config');

const storage = Storage({
    projectId: config.cloudProject
});

const bucket = storage.bucket(config.cloudBucket);

const multer = multer({
    storage: Multer.MemoryStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // no larger than 5mb
    }
});


/**
 * Transcodes an image intp wepb format
 *
 * @param {Buffer} buffer Image data to transcode
 * @return {Buffer} Webp image data
 */
const transcode = buffer =>
    sharp(buffer)
    .toFormat(sharp.format.webp)
    .toBuffer();

const mimtypes = {
    png: 'image/png',
    jpeg: 'image/jpeg',
    webp: 'image/webp'
};


/**
 * Uploads a file to GCS
 *
 * @param {string} name The name of the file
 * @param {string} ext The file's extension
 * @param {Buffer} buffer  The file's data
 *
 * @returns {void}
 */
const uploadFile = (name, ext, buffer) => {
    const file = bucket.file(name);
    const stream = file.createWriteStream({
        metadata: {
            mimetype: mimtypes[ext]
        }
    });

    return new Promise((resolve, reject) => {
        stream.on('error', err => {
            reject(err);
        });

        stream.on('finish', () => {
            file.makePublic().then(() => {
                resolve();
            });
        });

        stream.end(buffer);
    });
};


const getNameInfo = name => {
    return {
        key: name.replace(/\.[^/.]+$/, ''),
        ext: name.split('.').pop()
    };
};


/**
 * Geneartes a middleware that will upload a submited image to Google Cloud Storage
 *
 * @param {boolean} multires True if the middleware should upload multiple resolutions of the image
 * @returns {function(Request, Response, NextFunction): void} Upload middleware
 */
const sendUploadToGCS = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    try {
        const name = getNameInfo(Date.now() + req.file.originalname);
        req.file.fileKey = `${name.key}.${name.ext}`;

        await uploadFile(`${name.key}.${name.ext}`, name.ext, req.file.buffer);
        await uploadFile(`${name.key}.webp`, 'webp', await transcode(req.file.buffer));

        return next();
    } catch (err) {
        return next(err);
    }
};


const getURLs = (key) => {
    const name = getNameInfo(key);

    return [
        `${name.key}.${name.ext}`,
        `${name.key}.webp`
    ];

};

const deleteFromGCS = (filename) => {
    for (const url of getURLs(filename)) {
        bucket
            .file(url)
            .delete()
            .then(() => {
                console.log(`${url} deleted.`);
            })
            .catch(err => {
                console.error(`Failed to delete ${url} due to`, err);
            });
    }
};

module.exports = {
    sendUploadToGCS,
    deleteFromGCS,
    multer
};
