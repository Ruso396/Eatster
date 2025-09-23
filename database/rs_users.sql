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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `customer_id` varchar(50) DEFAULT NULL,
  `role` enum('user','admin','superadmin') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `restaurant_id` int DEFAULT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `customer_id` (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Mathavi','hello@spiceledger.com','$2b$10$66lnmmrBrAyLKvFqK.KqOeTrUtMpniIsl0qNMfKa/bHEd75zWFUoW',NULL,'admin','2025-07-08 11:30:45',1,'active','2025-07-11 11:30:41'),(2,'Maha','contact@emberessence.in','$2b$10$Y/jqjstEnVs4Gwg.64ZEpuk1CICzyEDbQwby.M2QQCuJDj0KZSONq',NULL,'admin','2025-07-08 11:33:10',2,'active','2025-07-11 11:30:41'),(3,'Ruso','info@salttheory.co.in','$2b$10$3c3k8hysvH37lSrZyvC0IuK.AujvRcT5K1LiFEBvHbpl47nVYx2dG',NULL,'admin','2025-07-08 11:36:45',3,'active','2025-07-11 11:30:41'),(4,'Jesi','dine@grainandgrace.in','$2b$10$BgKLTl510GuJg1nPcT.P.OvhAnHLB7Xp1MrA.JFALtn87w/IofEb2',NULL,'admin','2025-07-08 11:38:41',4,'active','2025-07-11 11:30:41'),(5,'Ruso','ruso22@gmail.com','$2b$10$jSLo.S4Qgvzn.MhXscskn.17ZahlUXQbCqEJmD4hN7D3LM5bPfq96','CUST-783359','user','2025-07-09 11:50:02',NULL,'active','2025-07-11 11:30:41'),(7,'pcs','pcs@gmail.com','$2b$10$T5xh76gqlwWO5e1fHO8OQePRnc9NGEmdAKd6RvQUDcAj.uzwDSouK','CUST-186021','user','2025-07-18 11:11:21',NULL,'active','2025-07-18 11:11:21');
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

-- Dump completed on 2025-07-21 11:05:48
