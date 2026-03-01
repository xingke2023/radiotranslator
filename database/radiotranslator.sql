mysqldump: [Warning] Using a password on the command line interface can be insecure.
-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: radiotranslator
-- ------------------------------------------------------
-- Server version	8.0.41-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `radios`
--

DROP TABLE IF EXISTS `radios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `radios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `streamUrl` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `language` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en',
  `category` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `requiresSubscription` tinyint(1) DEFAULT '0',
  `subscriptionTier` enum('free','basic','premium') COLLATE utf8mb4_unicode_ci DEFAULT 'free',
  `listenerCount` int DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `radios`
--

LOCK TABLES `radios` WRITE;
/*!40000 ALTER TABLE `radios` DISABLE KEYS */;
/*!40000 ALTER TABLE `radios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriptions`
--

DROP TABLE IF EXISTS `subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriptions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `tier` enum('basic','premium') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('active','cancelled','expired') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `stripeSubscriptionId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stripeCustomerId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'USD',
  `autoRenew` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `subscriptions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriptions`
--

LOCK TABLES `subscriptions` WRITE;
/*!40000 ALTER TABLE `subscriptions` DISABLE KEYS */;
INSERT INTO `subscriptions` VALUES (1,1,'basic','active','2025-11-12 01:40:21','2025-12-12 01:40:21',NULL,NULL,9.99,'USD',1,'2025-11-12 01:40:21','2025-11-12 01:40:21'),(2,2,'basic','active','2025-11-12 02:10:44','2025-12-12 02:10:44','sub_1SSTW0Ew3cJeoZkRU7bzSTKX','cus_TPI6R3bA8Kyr0w',9.99,'USD',1,'2025-11-12 02:10:44','2025-11-12 02:10:44'),(3,3,'basic','active','2025-11-17 12:41:40','2025-12-17 12:41:40','sub_1SURkMEw3cJeoZkR0skycwJp','cus_TRKPXbLFccwj6b',9.99,'USD',1,'2025-11-17 12:41:40','2025-11-17 12:41:40'),(4,4,'basic','active','2025-12-02 14:41:34','2026-01-02 14:41:34','sub_1SZtqCEw3cJeoZkRnhAC3bO3','cus_TWxlueQRKjnJHw',9.99,'USD',1,'2025-12-02 14:41:34','2025-12-02 14:41:34');
/*!40000 ALTER TABLE `subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `translations`
--

DROP TABLE IF EXISTS `translations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `translations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `radioId` int NOT NULL,
  `originalText` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `translatedText` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sourceLanguage` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `targetLanguage` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `translations_radio_id_timestamp` (`radioId`,`timestamp`),
  CONSTRAINT `translations_ibfk_1` FOREIGN KEY (`radioId`) REFERENCES `radios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `translations`
--

LOCK TABLES `translations` WRITE;
/*!40000 ALTER TABLE `translations` DISABLE KEYS */;
/*!40000 ALTER TABLE `translations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subscriptionTier` enum('free','basic','premium') COLLATE utf8mb4_unicode_ci DEFAULT 'free',
  `subscriptionStatus` enum('active','inactive','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'inactive',
  `subscriptionExpiresAt` datetime DEFAULT NULL,
  `stripeCustomerId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stripeSubscriptionId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preferredLanguage` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'zh',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'dev2@xingke888.com','$2a$10$QRBw79/e96S/XFQrxTTlv.w22XTKcp7AMnJ4vU/GcO//EtZDtbVd.','dev2','basic','active','2025-12-12 01:40:21',NULL,NULL,'zh','2025-11-12 01:40:13','2025-11-12 01:40:21'),(2,'dev3@xingke888.com','$2a$10$HVHEcgpF/4noUQNm6yeS7usMzG7NADsoC26sm3P/3e0ImiU241SPa','dev3','basic','active','2025-12-12 02:10:44','cus_TPI6R3bA8Kyr0w',NULL,'zh','2025-11-12 01:53:58','2025-11-12 02:10:44'),(3,'dev4@xingke888.com','$2a$10$rEkJwqKw2wDpLEbJd6kArem4UHJLiZ9sHQlNwgipFqn/lmO/hSQeS','dev4','basic','active','2025-12-17 12:41:40','cus_TRKPXbLFccwj6b',NULL,'zh','2025-11-17 12:40:16','2025-11-17 12:41:40'),(4,'dev5@xingke888.com','$2a$10$19Eh3NMGZIxaKRx79n8D..ey3d122FPx6DhnZTZG11muAegx00v8e','abc123','basic','active','2026-01-02 14:41:34','cus_TWxlueQRKjnJHw',NULL,'zh','2025-12-02 13:40:01','2025-12-02 14:41:34'),(5,'dev6@xingke888.com','$2a$10$4N8wZaUcjL8Ayu0jBa7/COKCVqYV2Ph00s6gcH86KiL4Bk4FtJ4t6','dev6','free','inactive',NULL,NULL,NULL,'zh','2025-12-04 11:00:48','2025-12-04 11:00:48'),(6,'dev7@xingke888.com','$2a$10$4CpnBNneYQvtQQkU515meusUWy1Uf81bvDkRd3VdZzupYUE.BaZNK','dev7','free','inactive',NULL,NULL,NULL,'zh','2025-12-04 13:30:49','2025-12-04 13:30:49'),(7,'glatmoa@gmail.com','$2a$10$9szElC0j7UX1UIcJlKJXJ.JA6jNM4QSJxZjQYz.MQ1YT3lwvmPZsO','Muhammad','free','inactive',NULL,NULL,NULL,'zh','2026-02-17 23:02:18','2026-02-17 23:02:18');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-02  3:59:25
