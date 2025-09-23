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
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `foodname` varchar(255) DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL,
  `preparation_time` int DEFAULT '10',
  `type` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES (1,'Biryani','biriyani.jpeg',10,'nonveg'),(2,'Chicken','chicken.jpeg',10,'nonveg'),(3,'Fried Rice','friedrice.jpeg',10,'nonveg'),(4,'Noodles','noodles.jpeg',10,'nonveg'),(5,'North Indian','northindian.jpeg',10,'nonveg'),(6,'Paneer','paneer.jpeg',10,'nonveg'),(7,'Paratha','paratha.jpeg',10,'nonveg'),(8,'Parotta','parotta.jpeg',10,'nonveg'),(9,'Pizza','pizza.jpeg',10,'nonveg'),(10,'Sandwich','sandwich.jpeg',10,'nonveg'),(11,'Veg Meal','vegmeal.jpeg',10,'veg'),(13,'Chapati','chapati.jpeg',10,'veg'),(14,'Curd Rice','curd rice.jpeg',5,'veg'),(15,'Dosa','Dosa.jpeg',8,'veg'),(16,'Idli','Idli.jpeg',6,'veg'),(17,'Lemon Rice','lemon rice.jpeg',7,'veg'),(18,'Pongal','Pongal.jpeg',8,'veg'),(19,'Puttu with Kadala Curry','Puttu with Kadala.jpeg',12,'veg'),(20,'Rava Kitchadi','Rava kitchedi.jpeg',9,'veg'),(21,'Sambar Rice','Sambar rice.jpeg',7,'veg'),(22,'Veg Biryani','Veg Biriyani.jpeg',15,'veg');
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
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
