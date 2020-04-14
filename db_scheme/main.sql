CREATE SCHEMA IF NOT EXISTS main DEFAULT CHARACTER SET utf8;
USE main;

--
-- Table structure for table `Account`
--

DROP TABLE IF EXISTS `Account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE main.Account (
    accountID           SERIAL PRIMARY KEY,
    username            VARCHAR(30) NOT NULL CHECK(username LIKE '[a-zA-Z0-9]+( [a-zA-Z0-9]+)*'),
    profileURL          VARCHAR(30) UNIQUE CHECK(profileURL LIKE '[-a-z0-9]+'),
    email               VARCHAR(254) NOT NULL,
    emailVerified       BOOLEAN DEFAULT false NOT NULL,
    banned              BOOLEAN DEFAULT false NOT NULL,
    biography           VARCHAR(5000),
    joined              DATETIME DEFAULT now() NOT NULL,
    password            VARCHAR(256) NOT NULL CHECK (LENGTH(password) >= 8),
    salt                VARCHAR(32) NOT NULL,
    role                ENUM ('user', 'mod', 'admin') DEFAULT 'user' NOT NULL
);


--
-- Table structure for table `Message`
--

DROP TABLE IF EXISTS `Message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE main.Message (
    messageID           SERIAL PRIMARY KEY,
    senderID            INTEGER NOT NULL,
    receiverID          INTEGER NOT NULL,
    subject             VARCHAR(64) NOT NULL,
    content             VARCHAR(5000) NOT NULL,
    reade                BOOLEAN DEFAULT false NOT NULL,
    timeSent            TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Table structure for table `Comic`
--

DROP TABLE IF EXISTS `Comic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
    created             DATETIME DEFAULT now() NOT NULL,
    updated             DATETIME DEFAULT now() NOT NULL
);

--
-- Table structure for table `Volume`
--

DROP TABLE IF EXISTS `Volume`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE main.Volume (
    volumeID            SERIAL PRIMARY KEY,
    comicID             INTEGER NOT NULL,
    volumeNumber        INTEGER NOT NULL,
    name                VARCHAR(50) CHECK (name <> ''),
    published           BOOLEAN DEFAULT false NOT NULL,
    UNIQUE( volumeNumber, comicID )
);

--
-- Table structure for table `Chapter`
--

DROP TABLE IF EXISTS `Chapter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE main.Chapter (
    chapterID           SERIAL PRIMARY KEY,
    volumeID            INTEGER,
    chapterNumber       INTEGER NOT NULL,
    name                VARCHAR(50) CHECK (name <> ''),
    published           BOOLEAN DEFAULT false,
    comicID             INTEGER NOT NULL,
    UNIQUE( chapterNumber, volumeID, comicID )
);


--
-- Table structure for table `Page`
--

DROP TABLE IF EXISTS `Page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE main.Page (
    pageID              SERIAL PRIMARY KEY,
    pageNumber          INTEGER NOT NULL,
    chapterID           INTEGER,
    comicID             INTEGER NOT NULL,
    altText             VARCHAR(300),
    imgURL              VARCHAR(255) CHECK (imgURL <> ''),
    published           BOOLEAN DEFAULT false,
    UNIQUE ( pageNumber, comicID, chapterID )
);


--
-- Table structure for table `Schedule`
--

DROP TABLE IF EXISTS `Schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE main.Schedule (
    comicID             INTEGER,
    updateDay           INTEGER, -- Range is 1 to 7, where Sunday is 1 and Saturday is 7
    updateType          ENUM ('weekly', 'monthly') NOT NULL,
    updateWeek          INTEGER, -- Range is 1 to 4, where the first week of month is 1; uses postgresql's week def
    PRIMARY KEY (comicID, updateDay)
);