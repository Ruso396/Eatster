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
-- Table structure for table `restaurant_offers`
--

DROP TABLE IF EXISTS `restaurant_offers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurant_offers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `restaurant_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `discount_percent` decimal(5,2) DEFAULT NULL,
  `valid_from` datetime DEFAULT NULL,
  `valid_to` datetime DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `image_url` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `foodname` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `restaurant_id` (`restaurant_id`),
  CONSTRAINT `restaurant_offers_ibfk_1` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurant_offers`
--

LOCK TABLES `restaurant_offers` WRITE;
/*!40000 ALTER TABLE `restaurant_offers` DISABLE KEYS */;
INSERT INTO `restaurant_offers` VALUES (1,3,'Weekend Feast','Get 20% off on all Pizza orders above ₹300 this weekend only!\r\n',50.00,'2025-07-29 00:00:00','2025-09-25 00:00:00',1,'2025-07-17 15:57:36','/uploads/offers/offer_1752748056348.jpg',125.00,'Combo Pizza'),(2,3,'Weekend Pizza Blast!','Get a second pizza absolutely free on all orders above ₹235. Valid Friday–Sunday only!',20.00,'2025-09-27 00:00:00','2025-09-24 00:00:00',1,'2025-07-17 15:59:24','/uploads/offers/offer_1752748561385.jpg',235.00,'Double Cheese Burst'),(3,2,'Flat 25% Off on Grills Full Chicken','Enjoy 25% off on all grilled chicken orders above ₹249. Valid only on weekends.\r\n',30.00,'2025-07-25 00:00:00','2025-08-25 00:00:00',1,'2025-07-17 16:12:59','/uploads/offers/offer_1752748979967.jpg',249.00,'Grilled Chicken Full'),(4,2,'Sunday Offer Deal Free Leg Piece on Full Chicken','Family Combo: Multi Tandoori Chicken  + Leg Piece  just ₹229.',229.00,'2025-07-25 00:00:00','2025-07-28 00:00:00',1,'2025-07-17 16:18:02','/uploads/offers/offer_1752749282921.jpg',229.00,'Multi Tandoori Chicken '),(5,1,'Spicy Saver Roll Deal','Get the fiery taste of our Peri Peri Ferche Roll at a hot discount! Perfect for spice lovers – full of juicy grilled chicken crisp .',30.00,'2025-07-18 00:00:00','2025-07-30 00:00:00',1,'2025-07-17 17:00:11','/uploads/offers/offer_1752751811226.png',160.00,'Peri Peri Ferche Roll'),(6,1,'Buy One Get One','Sunday Offer 20% Weekend Only	Buy One Get One & Demand',20.00,'2025-07-16 00:00:00','2025-07-30 00:00:00',1,'2025-07-17 17:03:22','/uploads/offers/offer_1752752002226.jpg',299.00,'Pizza Cheese');
/*!40000 ALTER TABLE `restaurant_offers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-21 11:05:47
