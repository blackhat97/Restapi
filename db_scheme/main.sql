-- MySQL dump 10.13  Distrib 5.7.28, for Linux (x86_64)
--
-- Host: localhost    Database: main
-- ------------------------------------------------------
-- Server version	5.7.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Account`
--

CREATE SCHEMA IF NOT EXISTS main DEFAULT CHARACTER SET utf8;
USE main;

DROP TABLE IF EXISTS `Account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Account` (
  `accountID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `displayName` varchar(30) NOT NULL,
  `email` varchar(254) NOT NULL,
  `emailVerified` tinyint(1) NOT NULL DEFAULT '0',
  `banned` tinyint(1) NOT NULL DEFAULT '0',
  `biography` varchar(5000) DEFAULT NULL,
  `joined` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `password` varchar(256) NOT NULL,
  `salt` varchar(32) NOT NULL,
  `role` varchar(32) NOT NULL DEFAULT 'user',
  PRIMARY KEY (`accountID`),
  UNIQUE KEY `accountID` (`accountID`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `Chapter`
--

DROP TABLE IF EXISTS `Chapter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Chapter` (
  `chapterID` bigint(20) NOT NULL AUTO_INCREMENT,
  `thumbURL` varchar(45) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `index` int(11) NOT NULL,
  `date` datetime DEFAULT NULL,
  `published` tinyint(1) DEFAULT '1',
  `comicID` int(11) NOT NULL,
  PRIMARY KEY (`chapterID`),
  UNIQUE KEY `chapterID` (`chapterID`),
  UNIQUE KEY `chapterNumber` (`index`,`comicID`),
  KEY `id_idx` (`comicID`),
  CONSTRAINT `comic_id_chapter` FOREIGN KEY (`comicID`) REFERENCES `Comic` (`comicID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=10053 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `Comic`
--

DROP TABLE IF EXISTS `Comic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Comic` (
  `comicID` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `comicURL` varchar(255) NOT NULL,
  `thumbnailURL` varchar(255) NOT NULL,
  `coverURL` varchar(255) NOT NULL,
  `author` varchar(45) NOT NULL,
  `favorite` int(11) NOT NULL DEFAULT '0',
  `view` int(11) NOT NULL DEFAULT '0',
  `description` varchar(1000) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comicID`),
  UNIQUE KEY `comicID` (`comicID`),
  UNIQUE KEY `title` (`title`),
  UNIQUE KEY `comicURL` (`comicURL`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `Comment`
--

DROP TABLE IF EXISTS `Comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Comment` (
  `commentID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `senderID` bigint(20) NOT NULL,
  `chapterID` bigint(20) NOT NULL,
  `content` varchar(5000) NOT NULL,
  `like` int(11) DEFAULT '0',
  `timeSent` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`commentID`),
  UNIQUE KEY `messageID` (`commentID`),
  KEY `chapter_id_comment_idx` (`chapterID`),
  CONSTRAINT `chapter_id_comment` FOREIGN KEY (`chapterID`) REFERENCES `Chapter` (`chapterID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=100001 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `Genre`
--

DROP TABLE IF EXISTS `Genre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Genre` (
  `genreID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `comicID` int(11) NOT NULL,
  `genre` enum('romance','drama','fantasy','action') NOT NULL,
  PRIMARY KEY (`genreID`),
  KEY `comic_id_genre_idx` (`comicID`),
  CONSTRAINT `comic_id_genre` FOREIGN KEY (`comicID`) REFERENCES `Comic` (`comicID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `Page`
--

DROP TABLE IF EXISTS `Page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Page` (
  `pageID` bigint(20) NOT NULL AUTO_INCREMENT,
  `pageNumber` int(11) NOT NULL,
  `chapterID` bigint(20) NOT NULL,
  `comicID` int(11) DEFAULT NULL,
  `altText` varchar(300) DEFAULT NULL,
  `imgURL` varchar(255) DEFAULT NULL,
  `published` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`pageID`),
  UNIQUE KEY `pageID` (`pageID`),
  UNIQUE KEY `pageNumber` (`pageNumber`,`comicID`,`chapterID`),
  KEY `chapter_id_page_idx` (`chapterID`),
  CONSTRAINT `chapter_id_page` FOREIGN KEY (`chapterID`) REFERENCES `Chapter` (`chapterID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `Schedule`
--

DROP TABLE IF EXISTS `Schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Schedule` (
  `comicID` int(11) NOT NULL,
  `updatedTime` datetime DEFAULT CURRENT_TIMESTAMP,
  `updateDay` enum('mon','tue','wen','thu','fri','sat','sun','end') NOT NULL,
  PRIMARY KEY (`comicID`),
  KEY `comic_id_schedule_idx` (`comicID`),
  CONSTRAINT `comic_id_schedule` FOREIGN KEY (`comicID`) REFERENCES `Comic` (`comicID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-04-15  2:25:48
