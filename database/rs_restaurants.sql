-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: rs
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `restaurants`
--

DROP TABLE IF EXISTS `restaurants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `owner` varchar(100) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `address` text,
  `type` varchar(50) DEFAULT NULL,
  `fssai` varchar(50) DEFAULT NULL,
  `gstin` varchar(50) DEFAULT NULL,
  `pan` varchar(20) DEFAULT NULL,
  `account_name` varchar(100) DEFAULT NULL,
  `account_number` varchar(30) DEFAULT NULL,
  `ifsc` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `preparation_time` int DEFAULT '20',
  `password` varchar(255) NOT NULL,
  `status` enum('pending','accepted','cancelled','verified') DEFAULT 'pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurants`
--

LOCK TABLES `restaurants` WRITE;
/*!40000 ALTER TABLE `restaurants` DISABLE KEYS */;
INSERT INTO `restaurants` VALUES (1,'The Spice Ledger','Mathavi','9340011234','hello@spiceledger.com','Surandai','627859','12, Main Bazaar Road, Surandai, Tirunelveli – 627859',NULL,'22551144889900','33ABCTL9876F1ZX','ABCTL9876F','The Spice Ledger','123456781234','HDFC0004589','2025-07-08 11:30:45',8.9833348,77.4241106,20,'$2b$10$66lnmmrBrAyLKvFqK.KqOeTrUtMpniIsl0qNMfKa/bHEd75zWFUoW','accepted'),(2,'Ember & Essence','Maha','9388865522','contact@emberessence.in','Surandai','627859','Main Road 02, Sivan Kovil Street, Surandai, Tirunelveli – 627859',NULL,'11223344557799','33ZXCVB1234E1ZQ','ZXCVB1234E','Ember Essence Foods','987654321045','IOBA0003456','2025-07-08 11:33:10',8.9833348,77.4241106,20,'$2b$10$Y/jqjstEnVs4Gwg.64ZEpuk1CICzyEDbQwby.M2QQCuJDj0KZSONq','accepted'),(3,'Salt Theory','Ruso','9360036789','info@salttheory.co.in','Surandai','627859','No 7  Vivekanandhar Theru , Surandai Main Road , Surandai Kuruku Sandhuu ',NULL,'33445566778812','33MNBVC4321L1ZB','MNBVC4321L','Salt Theory Kitchen','765432198765','UTIB0001267','2025-07-08 11:36:45',8.9833348,77.4241106,20,'$2b$10$3c3k8hysvH37lSrZyvC0IuK.AujvRcT5K1LiFEBvHbpl47nVYx2dG','accepted'),(4,'Grain & Grace','Jesi','9300011001','dine@grainandgrace.in','Surandai','627859','8A, Bharathi Street, Surandai, Tirunelveli – 627859',NULL,'55668899112233','33IIJJL6543V1ZM','IIJJL6543V','Grain and Grace Kitchens','334455667788','PUNB0001234','2025-07-08 11:38:41',8.9833348,77.4241106,20,'$2b$10$BgKLTl510GuJg1nPcT.P.OvhAnHLB7Xp1MrA.JFALtn87w/IofEb2','accepted');
/*!40000 ALTER TABLE `restaurants` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-21 11:05:46
