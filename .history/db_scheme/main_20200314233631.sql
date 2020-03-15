CREATE SCHEMA IF NOT EXISTS main DEFAULT CHARACTER SET utf8;
USE main;

CREATE TABLE main.Account (
    accountID           SERIAL PRIMARY KEY,
    username            VARCHAR(30) NOT NULL,
    profileURL          VARCHAR(30) UNIQUE CHECK(profileURL LIKE '[-a-z0-9]+'),
    email               VARCHAR(254) NOT NULL,
    emailVerified       BOOLEAN DEFAULT false NOT NULL,
    banned              BOOLEAN DEFAULT false NOT NULL,
    biography           VARCHAR(5000),
    joined              timestamp DEFAULT current_timestamp NOT NULL,
    password            VARCHAR(256) NOT NULL CHECK (LENGTH(password) >= 8),
    salt                VARCHAR(32) NOT NULL,
    role                ENUM ('user', 'mod', 'admin') DEFAULT 'user' NOT NULL
);

-- Case insensative unique constraints
CREATE UNIQUE INDEX unique_username ON main.Account (LOWER(username));
CREATE UNIQUE INDEX unique_email    ON main.Account (LOWER(email));

CREATE TABLE main.Message (
    messageID           SERIAL PRIMARY KEY,
    senderID            INTEGER NOT NULL,
    receiverID          INTEGER NOT NULL,
    subject             VARCHAR(64) NOT NULL,
    content             VARCHAR(5000) NOT NULL,
    read                BOOLEAN DEFAULT false NOT NULL,
    timeSent            TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
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
    created             timestamp DEFAULT current_timestamp NOT NULL,
    updated             timestamp DEFAULT current_timestamp NOT NULL,
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

CREATE UNIQUE INDEX chapter_max_null ON main.Chapter(chapterNumber, comicID) WHERE volumeID IS NULL;

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

CREATE UNIQUE INDEX page_max_null ON main.Page(pageNumber, comicID) WHERE chapterID IS NULL;

CREATE TABLE main.Schedule (
    comicID             INTEGER,
    updateDay           INTEGER, -- Range is 1 to 7, where Sunday is 1 and Saturday is 7
    updateType          ENUM ('weekly', 'monthly') NOT NULL,
    updateWeek          INTEGER, -- Range is 1 to 4, where the first week of month is 1; uses postgresql's week def
    PRIMARY KEY (comicID, updateDay),
    CONSTRAINT day_range CHECK (updateDay >= 1 AND updateDay <= 7), 
    CONSTRAINT week_range CHECK (updateWeek >= 1 AND updateWeek <= 4),
    CONSTRAINT monthly_release CHECK (updateType = 'weekly' OR (updateType = 'monthly' AND updateWeek IS NOT NULL)),
    FOREIGN KEY (comicID) REFERENCES main.Comic(comicID) ON DELETE CASCADE
);