CREATE SCHEMA IF NOT EXISTS main DEFAULT CHARACTER SET utf8;
USE main;

CREATE TABLE main.Account (
    accountID           SERIAL PRIMARY KEY,
    username            VARCHAR(30) NOT NULL CHECK(username LIKE '[a-zA-Z0-9]+( [a-zA-Z0-9]+)*'),
    profileURL          VARCHAR(30) UNIQUE CHECK(profileURL LIKE '[-a-z0-9]+'),
    email               VARCHAR(254) NOT NULL,
    emailVerified       BOOLEAN DEFAULT false NOT NULL,
    banned              BOOLEAN DEFAULT false NOT NULL,
    biography           VARCHAR(5000),
    joined              TIMESTAMP DEFAULT now() NOT NULL,
    password            VARCHAR(256) NOT NULL CHECK (LENGTH(password) >= 8),
    salt                VARCHAR(32) NOT NULL,
    role                ENUM ('user', 'mod', 'admin') DEFAULT 'user' NOT NULL
);


CREATE TABLE main.Message (
    messageID           SERIAL PRIMARY KEY,
    senderID            INTEGER NOT NULL,
    receiverID          INTEGER NOT NULL,
    subject             VARCHAR(64) NOT NULL,
    content             VARCHAR(5000) NOT NULL,
    readd                BOOLEAN DEFAULT false NOT NULL,
    timeSentt            TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (senderID) REFERENCES main.Account(accountID) ON DELETE CASCADE,
    FOREIGN KEY (receiverID) REFERENCES main.Account(accountID) ON DELETE CASCADE
);

CREATE TABLE main.Comic (
    comicID             SERIAL PRIMARY KEY,
    accountID           INTEGER NOT NULL,
    title               VARCHAR(50) UNIQUE NOT NULL CHECK (title <> ''),
    comicURL            VARCHAR(30) UNIQUE NOT NULL CHECK(comicURL LIKE '[-a-z0-9]+' AND comicURL <> ''),
    thumbnailURL        VARCHAR(255) NOT NULL CHECK (thumbnailURL <> ''),
    published           BOOLEAN DEFAULT false NOT NULL,
    tagline             VARCHAR(30) NOT NULL CHECK (tagline <> ''),
    description         VARCHAR(1000) NOT NULL CHECK (description <> ''),
    organization        ENUM ('pages', 'chapters', 'volumes') NOT NULL,
    created             TIMESTAMP DEFAULT now() NOT NULL,
    updated             TIMESTAMP DEFAULT now() NOT NULL,
    FOREIGN KEY (accountID) REFERENCES main.Account(accountID) ON DELETE CASCADE
);

CREATE TABLE main.Volume (
    volumeID            SERIAL PRIMARY KEY,
    comicID             INTEGER NOT NULL,
    volumeNumber        INTEGER NOT NULL,
    name                VARCHAR(50) CHECK (name <> ''),
    published           BOOLEAN DEFAULT false NOT NULL,
    UNIQUE( volumeNumber, comicID ),
    FOREIGN KEY (comicID) REFERENCES main.Comic(comicID) ON DELETE CASCADE
);

CREATE TABLE main.Chapter (
    chapterID           SERIAL PRIMARY KEY,
    volumeID            INTEGER,
    chapterNumber       INTEGER NOT NULL,
    name                VARCHAR(50) CHECK (name <> ''),
    published           BOOLEAN DEFAULT false,
    comicID             INTEGER NOT NULL,
    UNIQUE( chapterNumber, volumeID, comicID ),
    FOREIGN KEY (volumeID) REFERENCES main.Volume(volumeID) ON DELETE CASCADE,
    FOREIGN KEY (comicID) REFERENCES main.Comic(comicID) ON DELETE CASCADE
);


CREATE TABLE main.Page (
    pageID              SERIAL PRIMARY KEY,
    pageNumber          INTEGER NOT NULL,
    chapterID           INTEGER,
    comicID             INTEGER NOT NULL,
    altText             VARCHAR(300),
    imgURL              VARCHAR(255) CHECK (imgURL <> ''),
    published           BOOLEAN DEFAULT false,
    UNIQUE ( pageNumber, comicID, chapterID ),
    FOREIGN KEY (chapterID) REFERENCES main.Chapter(chapterID) ON DELETE CASCADE,
    FOREIGN KEY (comicID) REFERENCES main.Comic(comicID) ON DELETE CASCADE
);

