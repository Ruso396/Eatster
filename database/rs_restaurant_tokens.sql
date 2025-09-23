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
-- Table structure for table `restaurant_tokens`
--

DROP TABLE IF EXISTS `restaurant_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurant_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `restaurant_id` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `type` enum('accept','cancel','verify') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NULL DEFAULT NULL,
  `used` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `restaurant_id` (`restaurant_id`),
  CONSTRAINT `restaurant_tokens_ibfk_1` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurant_tokens`
--

LOCK TABLES `restaurant_tokens` WRITE;
/*!40000 ALTER TABLE `restaurant_tokens` DISABLE KEYS */;
INSERT INTO `restaurant_tokens` VALUES (1,1,'7bcd5c753942dcdbc2942471866c368d348f050fdaf51ebca2f69264ee3442f4','accept','2025-07-08 11:30:45','2025-07-09 11:30:46',1),(2,1,'2964f0e635d1964f71fb99caf9b02f8b31f570ec06fabf4a3875185c9890b0a0','cancel','2025-07-08 11:30:45','2025-07-09 11:30:46',0),(3,2,'97c4bd0d8e480241ac974b9d4f0d702013decbb0db26174692fbe055b2995db6','accept','2025-07-08 11:33:10','2025-07-09 11:33:10',1),(4,2,'1c2bd6b4f2a6a9982664550133adef5e8beebfe602f79442932026517c209fa7','cancel','2025-07-08 11:33:10','2025-07-09 11:33:10',0),(5,3,'0d7fb9b752ebbb5f5321007391ba6cf6979ce7beb024eed746f11775a85a8673','accept','2025-07-08 11:36:45','2025-07-09 11:36:46',1),(6,3,'51725aae5def999ac8139f73bdbb29608faa3bce0cc852cf7e772b5f0a12d58b','cancel','2025-07-08 11:36:45','2025-07-09 11:36:46',0),(7,4,'9f11e1e4f84ee2e1d3ef67d19fa82d53f2b49ae61161906a8ca73a74cea9151f','accept','2025-07-08 11:38:41','2025-07-09 11:38:42',1),(8,4,'6a6b646924490a26f4388dd68fda6224746d60d1b90c2aaba24e2c3645c540a8','cancel','2025-07-08 11:38:41','2025-07-09 11:38:42',0);
/*!40000 ALTER TABLE `restaurant_tokens` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-21 11:05:49
