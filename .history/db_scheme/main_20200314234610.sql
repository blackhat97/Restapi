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
