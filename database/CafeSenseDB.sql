-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: cafesensedb
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `customer_types`
--

DROP TABLE IF EXISTS `customer_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_types` (
  `customer_type_id` int NOT NULL AUTO_INCREMENT,
  `customer_type_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_rate` decimal(5,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`customer_type_id`),
  UNIQUE KEY `customer_type_name` (`customer_type_name`),
  CONSTRAINT `chk_customer_discount` CHECK (((`discount_rate` >= 0) and (`discount_rate` <= 100)))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_types`
--

LOCK TABLES `customer_types` WRITE;
/*!40000 ALTER TABLE `customer_types` DISABLE KEYS */;
INSERT INTO `customer_types` VALUES (1,'General Customer',0.00),(2,'Student',10.00),(3,'Senior/PWD',20.00);
/*!40000 ALTER TABLE `customer_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_movements`
--

DROP TABLE IF EXISTS `inventory_movements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_movements` (
  `movement_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `transaction_id` int DEFAULT NULL,
  `movement_type` enum('Restock','Sale','Adjustment In','Adjustment Out','Return') COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity_change` int NOT NULL,
  `stock_before` int NOT NULL,
  `stock_after` int NOT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `movement_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`movement_id`),
  KEY `fk_movements_user` (`user_id`),
  KEY `idx_inventory_product_date` (`product_id`,`movement_date`),
  KEY `idx_inventory_transaction` (`transaction_id`),
  CONSTRAINT `fk_movements_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `fk_movements_transaction` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`transaction_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_movements_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `chk_movements_stock` CHECK (((`stock_before` >= 0) and (`stock_after` >= 0)))
) ENGINE=InnoDB AUTO_INCREMENT=399 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_movements`
--

LOCK TABLES `inventory_movements` WRITE;
/*!40000 ALTER TABLE `inventory_movements` DISABLE KEYS */;
INSERT INTO `inventory_movements` VALUES (1,1,1,NULL,'Restock',100,0,100,'Initial stock','2026-11-21 10:45:34'),(2,2,1,NULL,'Restock',100,0,100,'Initial stock','2026-11-21 10:45:34'),(3,3,1,NULL,'Restock',80,0,80,'Initial stock','2026-11-21 10:45:34'),(4,4,1,NULL,'Restock',90,0,90,'Initial stock','2026-11-21 10:45:34'),(5,5,1,NULL,'Restock',75,0,75,'Initial stock','2026-11-21 10:45:34'),(6,6,1,NULL,'Restock',70,0,70,'Initial stock','2026-11-21 10:45:34'),(7,7,1,NULL,'Restock',80,0,80,'Initial stock','2026-11-21 10:45:34'),(8,8,1,NULL,'Restock',65,0,65,'Initial stock','2026-11-21 10:45:34'),(9,9,1,NULL,'Restock',100,0,100,'Initial stock','2026-11-21 10:45:34'),(10,10,1,NULL,'Restock',60,0,60,'Initial stock','2026-11-21 10:45:34'),(11,11,1,NULL,'Restock',40,0,40,'Initial stock','2026-11-21 10:45:34'),(12,12,1,NULL,'Restock',30,0,30,'Initial stock','2026-11-21 10:45:34'),(13,13,1,NULL,'Restock',35,0,35,'Initial stock','2026-11-21 10:45:34'),(14,14,1,NULL,'Restock',50,0,50,'Initial stock','2026-11-21 10:45:34'),(15,15,1,NULL,'Restock',30,0,30,'Initial stock','2026-11-21 10:45:34'),(16,3,3,31,'Sale',-2,80,78,'Synthetic sales transaction','2026-10-01 00:47:00'),(17,10,3,31,'Sale',-1,60,59,'Synthetic sales transaction','2026-10-01 00:47:00'),(18,11,3,31,'Sale',-1,40,39,'Synthetic sales transaction','2026-10-01 00:47:00'),(19,7,2,40,'Sale',-2,80,78,'Synthetic sales transaction','2026-10-02 00:20:00'),(20,8,2,40,'Sale',-2,65,63,'Synthetic sales transaction','2026-10-02 00:20:00'),(21,15,2,40,'Sale',-1,30,29,'Synthetic sales transaction','2026-10-02 00:20:00'),(22,4,3,9,'Sale',-1,90,89,'Synthetic sales transaction','2026-10-02 00:33:00'),(23,5,3,9,'Sale',-1,75,74,'Synthetic sales transaction','2026-10-02 00:33:00'),(24,12,3,9,'Sale',-2,30,28,'Synthetic sales transaction','2026-10-02 00:33:00'),(25,1,2,18,'Sale',-2,100,98,'Synthetic sales transaction','2026-10-03 00:06:00'),(26,2,2,18,'Sale',-2,100,98,'Synthetic sales transaction','2026-10-03 00:06:00'),(27,9,2,18,'Sale',-1,100,99,'Synthetic sales transaction','2026-10-03 00:06:00'),(28,4,3,49,'Sale',-1,89,88,'Synthetic sales transaction','2026-10-03 00:53:00'),(29,5,3,49,'Sale',-1,74,73,'Synthetic sales transaction','2026-10-03 00:53:00'),(30,12,3,49,'Sale',-2,28,26,'Synthetic sales transaction','2026-10-03 00:53:00'),(31,1,2,58,'Sale',-2,98,96,'Synthetic sales transaction','2026-10-04 00:26:00'),(32,2,2,58,'Sale',-2,98,96,'Synthetic sales transaction','2026-10-04 00:26:00'),(33,9,2,58,'Sale',-1,99,98,'Synthetic sales transaction','2026-10-04 00:26:00'),(34,6,3,27,'Sale',-2,70,68,'Synthetic sales transaction','2026-10-04 00:39:00'),(35,13,3,27,'Sale',-1,35,34,'Synthetic sales transaction','2026-10-04 00:39:00'),(36,14,3,27,'Sale',-1,50,49,'Synthetic sales transaction','2026-10-04 00:39:00'),(37,3,2,36,'Sale',-1,78,77,'Synthetic sales transaction','2026-10-05 00:12:00'),(38,10,2,36,'Sale',-2,59,57,'Synthetic sales transaction','2026-10-05 00:12:00'),(39,11,2,36,'Sale',-2,39,37,'Synthetic sales transaction','2026-10-05 00:12:00'),(40,7,3,5,'Sale',-1,78,77,'Synthetic sales transaction','2026-10-05 00:25:00'),(41,8,3,5,'Sale',-1,63,62,'Synthetic sales transaction','2026-10-05 00:25:00'),(42,15,3,5,'Sale',-2,29,27,'Synthetic sales transaction','2026-10-05 00:25:00'),(43,7,3,45,'Sale',-1,77,76,'Synthetic sales transaction','2026-10-06 00:45:00'),(44,8,3,45,'Sale',-1,62,61,'Synthetic sales transaction','2026-10-06 00:45:00'),(45,15,3,45,'Sale',-2,27,25,'Synthetic sales transaction','2026-10-06 00:45:00'),(46,4,2,14,'Sale',-2,88,86,'Synthetic sales transaction','2026-10-06 00:58:00'),(47,5,2,14,'Sale',-2,73,71,'Synthetic sales transaction','2026-10-06 00:58:00'),(48,12,2,14,'Sale',-1,26,25,'Synthetic sales transaction','2026-10-06 00:58:00'),(49,4,2,54,'Sale',-2,86,84,'Synthetic sales transaction','2026-10-07 00:18:00'),(50,5,2,54,'Sale',-2,71,69,'Synthetic sales transaction','2026-10-07 00:18:00'),(51,12,2,54,'Sale',-1,25,24,'Synthetic sales transaction','2026-10-07 00:18:00'),(52,1,3,23,'Sale',-1,96,95,'Synthetic sales transaction','2026-10-07 00:31:00'),(53,2,3,23,'Sale',-1,96,95,'Synthetic sales transaction','2026-10-07 00:31:00'),(54,9,3,23,'Sale',-2,98,96,'Synthetic sales transaction','2026-10-07 00:31:00'),(55,6,2,32,'Sale',-1,68,67,'Synthetic sales transaction','2026-10-08 00:04:00'),(56,13,2,32,'Sale',-2,34,32,'Synthetic sales transaction','2026-10-08 00:04:00'),(57,14,2,32,'Sale',-2,49,47,'Synthetic sales transaction','2026-10-08 00:04:00'),(58,3,3,1,'Sale',-2,77,75,'Synthetic sales transaction','2026-10-08 00:17:00'),(59,10,3,1,'Sale',-1,57,56,'Synthetic sales transaction','2026-10-08 00:17:00'),(60,11,3,1,'Sale',-1,37,36,'Synthetic sales transaction','2026-10-08 00:17:00'),(61,3,3,41,'Sale',-2,75,73,'Synthetic sales transaction','2026-10-09 00:37:00'),(62,10,3,41,'Sale',-1,56,55,'Synthetic sales transaction','2026-10-09 00:37:00'),(63,11,3,41,'Sale',-1,36,35,'Synthetic sales transaction','2026-10-09 00:37:00'),(64,7,2,10,'Sale',-2,76,74,'Synthetic sales transaction','2026-10-09 00:50:00'),(65,8,2,10,'Sale',-2,61,59,'Synthetic sales transaction','2026-10-09 00:50:00'),(66,15,2,10,'Sale',-1,25,24,'Synthetic sales transaction','2026-10-09 00:50:00'),(67,7,2,50,'Sale',-2,74,72,'Synthetic sales transaction','2026-10-10 00:10:00'),(68,8,2,50,'Sale',-2,59,57,'Synthetic sales transaction','2026-10-10 00:10:00'),(69,15,2,50,'Sale',-1,24,23,'Synthetic sales transaction','2026-10-10 00:10:00'),(70,4,3,19,'Sale',-1,84,83,'Synthetic sales transaction','2026-10-10 00:23:00'),(71,5,3,19,'Sale',-1,69,68,'Synthetic sales transaction','2026-10-10 00:23:00'),(72,12,3,19,'Sale',-2,24,22,'Synthetic sales transaction','2026-10-10 00:23:00'),(73,4,3,59,'Sale',-1,83,82,'Synthetic sales transaction','2026-10-11 00:43:00'),(74,5,3,59,'Sale',-1,68,67,'Synthetic sales transaction','2026-10-11 00:43:00'),(75,12,3,59,'Sale',-2,22,20,'Synthetic sales transaction','2026-10-11 00:43:00'),(76,1,2,28,'Sale',-2,95,93,'Synthetic sales transaction','2026-10-11 00:56:00'),(77,2,2,28,'Sale',-2,95,93,'Synthetic sales transaction','2026-10-11 00:56:00'),(78,9,2,28,'Sale',-1,96,95,'Synthetic sales transaction','2026-10-11 00:56:00'),(79,6,3,37,'Sale',-2,67,65,'Synthetic sales transaction','2026-10-12 00:29:00'),(80,13,3,37,'Sale',-1,32,31,'Synthetic sales transaction','2026-10-12 00:29:00'),(81,14,3,37,'Sale',-1,47,46,'Synthetic sales transaction','2026-10-12 00:29:00'),(82,3,2,6,'Sale',-1,73,72,'Synthetic sales transaction','2026-10-12 00:42:00'),(83,10,2,6,'Sale',-2,55,53,'Synthetic sales transaction','2026-10-12 00:42:00'),(84,11,2,6,'Sale',-2,35,33,'Synthetic sales transaction','2026-10-12 00:42:00'),(85,3,2,46,'Sale',-1,72,71,'Synthetic sales transaction','2026-10-13 00:02:00'),(86,10,2,46,'Sale',-2,53,51,'Synthetic sales transaction','2026-10-13 00:02:00'),(87,11,2,46,'Sale',-2,33,31,'Synthetic sales transaction','2026-10-13 00:02:00'),(88,7,3,15,'Sale',-1,72,71,'Synthetic sales transaction','2026-10-13 00:15:00'),(89,8,3,15,'Sale',-1,57,56,'Synthetic sales transaction','2026-10-13 00:15:00'),(90,15,3,15,'Sale',-2,23,21,'Synthetic sales transaction','2026-10-13 00:15:00'),(91,7,3,55,'Sale',-1,71,70,'Synthetic sales transaction','2026-10-14 00:35:00'),(92,8,3,55,'Sale',-1,56,55,'Synthetic sales transaction','2026-10-14 00:35:00'),(93,15,3,55,'Sale',-2,21,19,'Synthetic sales transaction','2026-10-14 00:35:00'),(94,4,2,24,'Sale',-2,82,80,'Synthetic sales transaction','2026-10-14 00:48:00'),(95,5,2,24,'Sale',-2,67,65,'Synthetic sales transaction','2026-10-14 00:48:00'),(96,12,2,24,'Sale',-1,20,19,'Synthetic sales transaction','2026-10-14 00:48:00'),(97,1,3,33,'Sale',-1,93,92,'Synthetic sales transaction','2026-10-15 00:21:00'),(98,2,3,33,'Sale',-1,93,92,'Synthetic sales transaction','2026-10-15 00:21:00'),(99,9,3,33,'Sale',-2,95,93,'Synthetic sales transaction','2026-10-15 00:21:00'),(100,6,2,2,'Sale',-1,65,64,'Synthetic sales transaction','2026-10-15 00:34:00'),(101,13,2,2,'Sale',-2,31,29,'Synthetic sales transaction','2026-10-15 00:34:00'),(102,14,2,2,'Sale',-2,46,44,'Synthetic sales transaction','2026-10-15 00:34:00'),(103,3,3,11,'Sale',-2,71,69,'Synthetic sales transaction','2026-10-16 00:07:00'),(104,10,3,11,'Sale',-1,51,50,'Synthetic sales transaction','2026-10-16 00:07:00'),(105,11,3,11,'Sale',-1,31,30,'Synthetic sales transaction','2026-10-16 00:07:00'),(106,6,2,42,'Sale',-1,64,63,'Synthetic sales transaction','2026-10-16 00:54:00'),(107,13,2,42,'Sale',-2,29,27,'Synthetic sales transaction','2026-10-16 00:54:00'),(108,14,2,42,'Sale',-2,44,42,'Synthetic sales transaction','2026-10-16 00:54:00'),(109,3,3,51,'Sale',-2,69,67,'Synthetic sales transaction','2026-10-17 00:27:00'),(110,10,3,51,'Sale',-1,50,49,'Synthetic sales transaction','2026-10-17 00:27:00'),(111,11,3,51,'Sale',-1,30,29,'Synthetic sales transaction','2026-10-17 00:27:00'),(112,7,2,20,'Sale',-2,70,68,'Synthetic sales transaction','2026-10-17 00:40:00'),(113,8,2,20,'Sale',-2,55,53,'Synthetic sales transaction','2026-10-17 00:40:00'),(114,15,2,20,'Sale',-1,19,18,'Synthetic sales transaction','2026-10-17 00:40:00'),(115,7,2,60,'Sale',-2,68,66,'Synthetic sales transaction','2026-10-18 00:00:00'),(116,8,2,60,'Sale',-2,53,51,'Synthetic sales transaction','2026-10-18 00:00:00'),(117,15,2,60,'Sale',-1,18,17,'Synthetic sales transaction','2026-10-18 00:00:00'),(118,4,3,29,'Sale',-1,80,79,'Synthetic sales transaction','2026-10-18 00:13:00'),(119,5,3,29,'Sale',-1,65,64,'Synthetic sales transaction','2026-10-18 00:13:00'),(120,12,3,29,'Sale',-2,19,17,'Synthetic sales transaction','2026-10-18 00:13:00'),(121,1,2,38,'Sale',-2,92,90,'Synthetic sales transaction','2026-10-19 00:46:00'),(122,2,2,38,'Sale',-2,92,90,'Synthetic sales transaction','2026-10-19 00:46:00'),(123,9,2,38,'Sale',-1,93,92,'Synthetic sales transaction','2026-10-19 00:46:00'),(124,6,3,7,'Sale',-2,63,61,'Synthetic sales transaction','2026-10-19 00:59:00'),(125,13,3,7,'Sale',-1,27,26,'Synthetic sales transaction','2026-10-19 00:59:00'),(126,14,3,7,'Sale',-1,42,41,'Synthetic sales transaction','2026-10-19 00:59:00'),(127,6,3,47,'Sale',-2,61,59,'Synthetic sales transaction','2026-10-20 00:19:00'),(128,13,3,47,'Sale',-1,26,25,'Synthetic sales transaction','2026-10-20 00:19:00'),(129,14,3,47,'Sale',-1,41,40,'Synthetic sales transaction','2026-10-20 00:19:00'),(130,3,2,16,'Sale',-1,67,66,'Synthetic sales transaction','2026-10-20 00:32:00'),(131,10,2,16,'Sale',-2,49,47,'Synthetic sales transaction','2026-10-20 00:32:00'),(132,11,2,16,'Sale',-2,29,27,'Synthetic sales transaction','2026-10-20 00:32:00'),(133,7,3,25,'Sale',-1,66,65,'Synthetic sales transaction','2026-10-21 00:05:00'),(134,8,3,25,'Sale',-1,51,50,'Synthetic sales transaction','2026-10-21 00:05:00'),(135,15,3,25,'Sale',-2,17,15,'Synthetic sales transaction','2026-10-21 00:05:00'),(136,3,2,56,'Sale',-1,66,65,'Synthetic sales transaction','2026-10-21 00:52:00'),(137,10,2,56,'Sale',-2,47,45,'Synthetic sales transaction','2026-10-21 00:52:00'),(138,11,2,56,'Sale',-2,27,25,'Synthetic sales transaction','2026-10-21 00:52:00'),(139,4,2,34,'Sale',-2,79,77,'Synthetic sales transaction','2026-10-22 00:38:00'),(140,5,2,34,'Sale',-2,64,62,'Synthetic sales transaction','2026-10-22 00:38:00'),(141,12,2,34,'Sale',-1,17,16,'Synthetic sales transaction','2026-10-22 00:38:00'),(142,1,3,3,'Sale',-1,90,89,'Synthetic sales transaction','2026-10-22 00:51:00'),(143,2,3,3,'Sale',-1,90,89,'Synthetic sales transaction','2026-10-22 00:51:00'),(144,9,3,3,'Sale',-2,92,90,'Synthetic sales transaction','2026-10-22 00:51:00'),(145,1,3,43,'Sale',-1,89,88,'Synthetic sales transaction','2026-10-23 00:11:00'),(146,2,3,43,'Sale',-1,89,88,'Synthetic sales transaction','2026-10-23 00:11:00'),(147,9,3,43,'Sale',-2,90,88,'Synthetic sales transaction','2026-10-23 00:11:00'),(148,6,2,12,'Sale',-1,59,58,'Synthetic sales transaction','2026-10-23 00:24:00'),(149,13,2,12,'Sale',-2,25,23,'Synthetic sales transaction','2026-10-23 00:24:00'),(150,14,2,12,'Sale',-2,40,38,'Synthetic sales transaction','2026-10-23 00:24:00'),(151,6,2,52,'Sale',-1,58,57,'Synthetic sales transaction','2026-10-24 00:44:00'),(152,13,2,52,'Sale',-2,23,21,'Synthetic sales transaction','2026-10-24 00:44:00'),(153,14,2,52,'Sale',-2,38,36,'Synthetic sales transaction','2026-10-24 00:44:00'),(154,3,3,21,'Sale',-2,65,63,'Synthetic sales transaction','2026-10-24 00:57:00'),(155,10,3,21,'Sale',-1,45,44,'Synthetic sales transaction','2026-10-24 00:57:00'),(156,11,3,21,'Sale',-1,25,24,'Synthetic sales transaction','2026-10-24 00:57:00'),(157,7,2,30,'Sale',-2,65,63,'Synthetic sales transaction','2026-10-25 00:30:00'),(158,8,2,30,'Sale',-2,50,48,'Synthetic sales transaction','2026-10-25 00:30:00'),(159,15,2,30,'Sale',-1,15,14,'Synthetic sales transaction','2026-10-25 00:30:00'),(160,4,3,39,'Sale',-1,77,76,'Synthetic sales transaction','2026-10-26 00:03:00'),(161,5,3,39,'Sale',-1,62,61,'Synthetic sales transaction','2026-10-26 00:03:00'),(162,12,3,39,'Sale',-2,16,14,'Synthetic sales transaction','2026-10-26 00:03:00'),(163,1,2,8,'Sale',-2,88,86,'Synthetic sales transaction','2026-10-26 00:16:00'),(164,2,2,8,'Sale',-2,88,86,'Synthetic sales transaction','2026-10-26 00:16:00'),(165,9,2,8,'Sale',-1,88,87,'Synthetic sales transaction','2026-10-26 00:16:00'),(166,1,2,48,'Sale',-2,86,84,'Synthetic sales transaction','2026-10-27 00:36:00'),(167,2,2,48,'Sale',-2,86,84,'Synthetic sales transaction','2026-10-27 00:36:00'),(168,9,2,48,'Sale',-1,87,86,'Synthetic sales transaction','2026-10-27 00:36:00'),(169,6,3,17,'Sale',-2,57,55,'Synthetic sales transaction','2026-10-27 00:49:00'),(170,13,3,17,'Sale',-1,21,20,'Synthetic sales transaction','2026-10-27 00:49:00'),(171,14,3,17,'Sale',-1,36,35,'Synthetic sales transaction','2026-10-27 00:49:00'),(172,6,3,57,'Sale',-2,55,53,'Synthetic sales transaction','2026-10-28 00:09:00'),(173,13,3,57,'Sale',-1,20,19,'Synthetic sales transaction','2026-10-28 00:09:00'),(174,14,3,57,'Sale',-1,35,34,'Synthetic sales transaction','2026-10-28 00:09:00'),(175,3,2,26,'Sale',-1,63,62,'Synthetic sales transaction','2026-10-28 00:22:00'),(176,10,2,26,'Sale',-2,44,42,'Synthetic sales transaction','2026-10-28 00:22:00'),(177,11,2,26,'Sale',-2,24,22,'Synthetic sales transaction','2026-10-28 00:22:00'),(178,4,2,4,'Sale',-2,76,74,'Synthetic sales transaction','2026-10-29 00:08:00'),(179,5,2,4,'Sale',-2,61,59,'Synthetic sales transaction','2026-10-29 00:08:00'),(180,12,2,4,'Sale',-1,14,13,'Synthetic sales transaction','2026-10-29 00:08:00'),(181,7,3,35,'Sale',-1,63,62,'Synthetic sales transaction','2026-10-29 00:55:00'),(182,8,3,35,'Sale',-1,48,47,'Synthetic sales transaction','2026-10-29 00:55:00'),(183,15,3,35,'Sale',-2,14,12,'Synthetic sales transaction','2026-10-29 00:55:00'),(184,4,2,44,'Sale',-2,74,72,'Synthetic sales transaction','2026-10-30 00:28:00'),(185,5,2,44,'Sale',-2,59,57,'Synthetic sales transaction','2026-10-30 00:28:00'),(186,12,2,44,'Sale',-1,13,12,'Synthetic sales transaction','2026-10-30 00:28:00'),(187,1,3,13,'Sale',-1,84,83,'Synthetic sales transaction','2026-10-30 00:41:00'),(188,2,3,13,'Sale',-1,84,83,'Synthetic sales transaction','2026-10-30 00:41:00'),(189,9,3,13,'Sale',-2,86,84,'Synthetic sales transaction','2026-10-30 00:41:00'),(190,1,3,53,'Sale',-1,83,82,'Synthetic sales transaction','2026-10-31 00:01:00'),(191,2,3,53,'Sale',-1,83,82,'Synthetic sales transaction','2026-10-31 00:01:00'),(192,9,3,53,'Sale',-2,84,82,'Synthetic sales transaction','2026-10-31 00:01:00'),(193,6,2,22,'Sale',-1,53,52,'Synthetic sales transaction','2026-10-31 00:14:00'),(194,13,2,22,'Sale',-2,19,17,'Synthetic sales transaction','2026-10-31 00:14:00'),(195,14,2,22,'Sale',-2,34,32,'Synthetic sales transaction','2026-10-31 00:14:00'),(372,1,1,NULL,'Adjustment In',2,82,84,'Inventory Correction','2026-11-22 12:36:03'),(373,1,1,NULL,'Adjustment In',1,84,85,'Inventory Correction','2026-11-22 12:48:31'),(374,1,1,NULL,'Adjustment Out',-1,85,84,'Inventory Correction','2026-11-22 12:55:22'),(375,1,1,NULL,'Adjustment In',5,84,89,'Inventory Correction','2026-11-22 13:46:46'),(376,1,1,NULL,'Adjustment In',1,89,90,'Restock','2026-11-22 13:47:11'),(377,1,1,61,'Sale',-1,90,89,'POS Transaction','2026-11-22 15:03:42'),(378,1,1,62,'Sale',-1,89,88,'POS Transaction','2026-11-22 17:20:28'),(379,2,1,63,'Sale',-1,82,81,'POS Transaction','2026-11-22 17:25:15'),(380,6,1,64,'Sale',-1,52,51,'POS Transaction','2026-11-22 17:26:46'),(381,2,3,65,'Sale',-1,81,80,'POS Transaction','2026-11-23 14:36:10'),(382,6,1,NULL,'Adjustment In',1,51,52,'Inventory Correction','2026-11-23 14:46:46'),(383,13,1,NULL,'Adjustment In',1,17,18,'Inventory Correction','2026-11-23 14:50:14'),(384,5,2,NULL,'Adjustment In',1,57,58,'Inventory Correction','2026-11-23 14:57:27'),(385,17,1,NULL,'Adjustment In',5,35,40,'Restock','2026-11-23 17:25:08'),(386,10,1,NULL,'Adjustment In',3,42,45,'Restock','2026-11-23 17:38:46'),(387,10,1,NULL,'Adjustment Out',-5,45,40,'Expired Products','2026-11-23 17:39:06'),(388,1,1,66,'Sale',-1,88,87,'POS Transaction','2026-11-24 08:56:00'),(389,3,1,66,'Sale',-1,62,61,'POS Transaction','2026-11-24 08:56:00'),(390,4,1,66,'Sale',-1,72,71,'POS Transaction','2026-11-24 08:56:00'),(391,6,1,67,'Sale',-2,52,50,'POS Transaction','2026-11-24 08:56:30'),(392,6,1,67,'Sale',-1,50,49,'POS Transaction','2026-11-24 08:56:30'),(393,3,1,68,'Sale',-1,61,60,'POS Transaction','2026-11-24 09:07:06'),(394,6,1,69,'Sale',-1,49,48,'POS Transaction','2026-11-24 09:07:53'),(395,4,1,70,'Sale',-1,71,70,'POS Transaction','2026-11-24 12:04:34'),(396,1,1,71,'Sale',-1,87,86,'POS Transaction','2026-11-24 16:47:15'),(397,1,1,71,'Sale',-1,86,85,'POS Transaction','2026-11-24 16:47:15'),(398,6,1,71,'Sale',-1,48,47,'POS Transaction','2026-11-24 16:47:15');
/*!40000 ALTER TABLE `inventory_movements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_methods`
--

DROP TABLE IF EXISTS `payment_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_methods` (
  `payment_method_id` int NOT NULL AUTO_INCREMENT,
  `payment_method_name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('Active','Inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Active',
  PRIMARY KEY (`payment_method_id`),
  UNIQUE KEY `payment_method_name` (`payment_method_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_methods`
--

LOCK TABLES `payment_methods` WRITE;
/*!40000 ALTER TABLE `payment_methods` DISABLE KEYS */;
INSERT INTO `payment_methods` VALUES (1,'Cash','Active'),(2,'GCash','Active'),(3,'Maya','Active'),(4,'Card','Active');
/*!40000 ALTER TABLE `payment_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_categories`
--

DROP TABLE IF EXISTS `product_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `category_name` (`category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_categories`
--

LOCK TABLES `product_categories` WRITE;
/*!40000 ALTER TABLE `product_categories` DISABLE KEYS */;
INSERT INTO `product_categories` VALUES (1,'Coffee','Coffee-based beverages','2026-11-21 10:13:13'),(2,'Non-Coffee','Non-coffee beverages','2026-11-21 10:13:13'),(3,'Pastry / Baked Good','Pastries and baked products','2026-11-21 10:13:13');
/*!40000 ALTER TABLE `product_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `product_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` int NOT NULL,
  `product_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL,
  `stock_quantity` int NOT NULL DEFAULT '0',
  `low_stock_limit` int NOT NULL DEFAULT '10',
  `availability` enum('Available','Unavailable') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Available',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `product_code` (`product_code`),
  KEY `fk_products_category` (`category_id`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`category_id`) ON UPDATE CASCADE,
  CONSTRAINT `chk_products_low_stock` CHECK ((`low_stock_limit` >= 0)),
  CONSTRAINT `chk_products_price` CHECK ((`price` >= 0)),
  CONSTRAINT `chk_products_stock` CHECK ((`stock_quantity` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'P001',1,'Americano','Espresso with hot water',90.00,85,10,'Available','2026-11-21 10:23:25','2026-11-24 16:47:15'),(2,'P002',1,'Cafe Latte','Espresso with steamed milk',120.00,80,10,'Available','2026-11-21 10:23:25','2026-11-23 14:36:10'),(3,'P003',1,'Cappuccino','Espresso with steamed milk and foam',120.00,60,10,'Available','2026-11-21 10:23:25','2026-11-24 09:07:06'),(4,'P004',1,'Spanish Latte','Espresso with milk and condensed milk',140.00,70,10,'Available','2026-11-21 10:23:25','2026-11-24 12:04:34'),(5,'P005',1,'Caramel Macchiato','Espresso with milk and caramel',150.00,58,10,'Available','2026-11-21 10:23:25','2026-11-23 14:57:27'),(6,'P006',2,'Matcha Latte','Matcha green tea with milk',140.00,47,10,'Available','2026-11-21 10:23:25','2026-11-24 16:47:15'),(7,'P007',2,'Chocolate Milk','Chocolate drink with milk',120.00,62,10,'Available','2026-11-21 10:23:25','2026-11-21 10:54:17'),(8,'P008',2,'Fresh Milk','Strawberry flavored milk',100.00,47,10,'Available','2026-11-21 10:23:25','2026-11-23 17:40:35'),(9,'P009',2,'Iced Tea','Refreshing iced tea',80.00,82,10,'Available','2026-11-21 10:23:25','2026-11-21 10:54:17'),(10,'P010',2,'Cookies and Cream','Cookies and cream blended drink',150.00,40,10,'Available','2026-11-21 10:23:25','2026-11-23 17:39:06'),(11,'P011',3,'Chocolate Muffin','Chocolate flavored muffin',75.00,22,5,'Available','2026-11-21 10:23:25','2026-11-21 10:54:17'),(12,'P012',3,'Blueberry Cheesecake','Cheesecake with blueberry topping',130.00,12,5,'Available','2026-11-21 10:23:25','2026-11-21 10:54:17'),(13,'P013',3,'Butter Croissant','Classic butter croissant',85.00,18,5,'Available','2026-11-21 10:23:25','2026-11-23 14:50:14'),(14,'P014',3,'Chocolate Cookie','Freshly baked chocolate cookie',60.00,32,5,'Available','2026-11-21 10:23:25','2026-11-21 10:54:17'),(15,'P015',3,'Cinnamon Roll','Soft cinnamon roll with icing',95.00,12,5,'Available','2026-11-21 10:23:25','2026-11-21 10:54:17'),(17,'P016',2,'Java Chip',NULL,120.00,40,10,'Available','2026-11-23 17:24:41','2026-11-23 18:18:26'),(18,'P017',1,'Strawberry Latte',NULL,120.00,35,10,'Available','2026-11-24 12:49:55','2026-11-24 12:49:55');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Owner','Full access to all CaféSense system modules'),(2,'Manager','Manage sales, products, analytics, and reports'),(3,'Staff','Process and record POS transactions');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction_items`
--

DROP TABLE IF EXISTS `transaction_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_items` (
  `transaction_item_id` int NOT NULL AUTO_INCREMENT,
  `transaction_id` int NOT NULL,
  `product_id` int DEFAULT NULL,
  `customer_type_id` int NOT NULL,
  `product_code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_category` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `discount_rate` decimal(5,2) NOT NULL DEFAULT '0.00',
  `line_subtotal` decimal(12,2) NOT NULL,
  `line_discount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `line_total` decimal(12,2) NOT NULL,
  PRIMARY KEY (`transaction_item_id`),
  KEY `idx_items_product` (`product_id`),
  KEY `idx_items_customer_type` (`customer_type_id`),
  KEY `idx_items_transaction` (`transaction_id`),
  CONSTRAINT `fk_items_customer_type` FOREIGN KEY (`customer_type_id`) REFERENCES `customer_types` (`customer_type_id`),
  CONSTRAINT `fk_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_items_transaction` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`transaction_id`) ON DELETE CASCADE,
  CONSTRAINT `chk_items_amounts` CHECK (((`line_subtotal` >= 0) and (`line_discount` >= 0) and (`line_total` >= 0))),
  CONSTRAINT `chk_items_discount_rate` CHECK (((`discount_rate` >= 0) and (`discount_rate` <= 100))),
  CONSTRAINT `chk_items_price` CHECK ((`unit_price` >= 0)),
  CONSTRAINT `chk_items_quantity` CHECK ((`quantity` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=197 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_items`
--

LOCK TABLES `transaction_items` WRITE;
/*!40000 ALTER TABLE `transaction_items` DISABLE KEYS */;
INSERT INTO `transaction_items` VALUES (1,1,10,2,'P010','Cookies and Cream','Non-Coffee',1,150.00,10.00,150.00,15.00,135.00),(2,1,3,1,'P003','Cappuccino','Coffee',2,120.00,0.00,240.00,0.00,240.00),(3,1,11,3,'P011','Chocolate Muffin','Pastry / Baked Good',1,75.00,20.00,75.00,15.00,60.00),(4,2,13,3,'P013','Butter Croissant','Pastry / Baked Good',2,85.00,20.00,170.00,34.00,136.00),(5,2,6,2,'P006','Matcha Latte','Non-Coffee',1,140.00,10.00,140.00,14.00,126.00),(6,2,14,1,'P014','Chocolate Cookie','Pastry / Baked Good',2,60.00,0.00,120.00,0.00,120.00),(7,3,1,1,'P001','Americano','Coffee',1,90.00,0.00,90.00,0.00,90.00),(8,3,9,3,'P009','Iced Tea','Non-Coffee',2,80.00,20.00,160.00,32.00,128.00),(9,3,2,2,'P002','Cafe Latte','Coffee',1,120.00,10.00,120.00,12.00,108.00),(10,4,4,2,'P004','Spanish Latte','Coffee',2,140.00,10.00,280.00,28.00,252.00),(11,4,12,1,'P012','Blueberry Cheesecake','Pastry / Baked Good',1,130.00,0.00,130.00,0.00,130.00),(12,4,5,3,'P005','Caramel Macchiato','Coffee',2,150.00,20.00,300.00,60.00,240.00),(13,5,7,3,'P007','Chocolate Milk','Non-Coffee',1,120.00,20.00,120.00,24.00,96.00),(14,5,15,2,'P015','Cinnamon Roll','Pastry / Baked Good',2,95.00,10.00,190.00,19.00,171.00),(15,5,8,1,'P008','Strawberry Milk','Non-Coffee',1,120.00,0.00,120.00,0.00,120.00),(16,6,10,1,'P010','Cookies and Cream','Non-Coffee',2,150.00,0.00,300.00,0.00,300.00),(17,6,3,3,'P003','Cappuccino','Coffee',1,120.00,20.00,120.00,24.00,96.00),(18,6,11,2,'P011','Chocolate Muffin','Pastry / Baked Good',2,75.00,10.00,150.00,15.00,135.00),(19,7,13,2,'P013','Butter Croissant','Pastry / Baked Good',1,85.00,10.00,85.00,8.50,76.50),(20,7,6,1,'P006','Matcha Latte','Non-Coffee',2,140.00,0.00,280.00,0.00,280.00),(21,7,14,3,'P014','Chocolate Cookie','Pastry / Baked Good',1,60.00,20.00,60.00,12.00,48.00),(22,8,1,3,'P001','Americano','Coffee',2,90.00,20.00,180.00,36.00,144.00),(23,8,9,2,'P009','Iced Tea','Non-Coffee',1,80.00,10.00,80.00,8.00,72.00),(24,8,2,1,'P002','Cafe Latte','Coffee',2,120.00,0.00,240.00,0.00,240.00),(25,9,4,1,'P004','Spanish Latte','Coffee',1,140.00,0.00,140.00,0.00,140.00),(26,9,12,3,'P012','Blueberry Cheesecake','Pastry / Baked Good',2,130.00,20.00,260.00,52.00,208.00),(27,9,5,2,'P005','Caramel Macchiato','Coffee',1,150.00,10.00,150.00,15.00,135.00),(28,10,7,2,'P007','Chocolate Milk','Non-Coffee',2,120.00,10.00,240.00,24.00,216.00),(29,10,15,1,'P015','Cinnamon Roll','Pastry / Baked Good',1,95.00,0.00,95.00,0.00,95.00),(30,10,8,3,'P008','Strawberry Milk','Non-Coffee',2,120.00,20.00,240.00,48.00,192.00),(31,11,10,3,'P010','Cookies and Cream','Non-Coffee',1,150.00,20.00,150.00,30.00,120.00),(32,11,3,2,'P003','Cappuccino','Coffee',2,120.00,10.00,240.00,24.00,216.00),(33,11,11,1,'P011','Chocolate Muffin','Pastry / Baked Good',1,75.00,0.00,75.00,0.00,75.00),(34,12,13,1,'P013','Butter Croissant','Pastry / Baked Good',2,85.00,0.00,170.00,0.00,170.00),(35,12,6,3,'P006','Matcha Latte','Non-Coffee',1,140.00,20.00,140.00,28.00,112.00),(36,12,14,2,'P014','Chocolate Cookie','Pastry / Baked Good',2,60.00,10.00,120.00,12.00,108.00),(37,13,1,2,'P001','Americano','Coffee',1,90.00,10.00,90.00,9.00,81.00),(38,13,9,1,'P009','Iced Tea','Non-Coffee',2,80.00,0.00,160.00,0.00,160.00),(39,13,2,3,'P002','Cafe Latte','Coffee',1,120.00,20.00,120.00,24.00,96.00),(40,14,4,3,'P004','Spanish Latte','Coffee',2,140.00,20.00,280.00,56.00,224.00),(41,14,12,2,'P012','Blueberry Cheesecake','Pastry / Baked Good',1,130.00,10.00,130.00,13.00,117.00),(42,14,5,1,'P005','Caramel Macchiato','Coffee',2,150.00,0.00,300.00,0.00,300.00),(43,15,7,1,'P007','Chocolate Milk','Non-Coffee',1,120.00,0.00,120.00,0.00,120.00),(44,15,15,3,'P015','Cinnamon Roll','Pastry / Baked Good',2,95.00,20.00,190.00,38.00,152.00),(45,15,8,2,'P008','Strawberry Milk','Non-Coffee',1,120.00,10.00,120.00,12.00,108.00),(46,16,10,2,'P010','Cookies and Cream','Non-Coffee',2,150.00,10.00,300.00,30.00,270.00),(47,16,3,1,'P003','Cappuccino','Coffee',1,120.00,0.00,120.00,0.00,120.00),(48,16,11,3,'P011','Chocolate Muffin','Pastry / Baked Good',2,75.00,20.00,150.00,30.00,120.00),(49,17,13,3,'P013','Butter Croissant','Pastry / Baked Good',1,85.00,20.00,85.00,17.00,68.00),(50,17,6,2,'P006','Matcha Latte','Non-Coffee',2,140.00,10.00,280.00,28.00,252.00),(51,17,14,1,'P014','Chocolate Cookie','Pastry / Baked Good',1,60.00,0.00,60.00,0.00,60.00),(52,18,1,1,'P001','Americano','Coffee',2,90.00,0.00,180.00,0.00,180.00),(53,18,9,3,'P009','Iced Tea','Non-Coffee',1,80.00,20.00,80.00,16.00,64.00),(54,18,2,2,'P002','Cafe Latte','Coffee',2,120.00,10.00,240.00,24.00,216.00),(55,19,4,2,'P004','Spanish Latte','Coffee',1,140.00,10.00,140.00,14.00,126.00),(56,19,12,1,'P012','Blueberry Cheesecake','Pastry / Baked Good',2,130.00,0.00,260.00,0.00,260.00),(57,19,5,3,'P005','Caramel Macchiato','Coffee',1,150.00,20.00,150.00,30.00,120.00),(58,20,7,3,'P007','Chocolate Milk','Non-Coffee',2,120.00,20.00,240.00,48.00,192.00),(59,20,15,2,'P015','Cinnamon Roll','Pastry / Baked Good',1,95.00,10.00,95.00,9.50,85.50),(60,20,8,1,'P008','Strawberry Milk','Non-Coffee',2,120.00,0.00,240.00,0.00,240.00),(61,21,10,1,'P010','Cookies and Cream','Non-Coffee',1,150.00,0.00,150.00,0.00,150.00),(62,21,3,3,'P003','Cappuccino','Coffee',2,120.00,20.00,240.00,48.00,192.00),(63,21,11,2,'P011','Chocolate Muffin','Pastry / Baked Good',1,75.00,10.00,75.00,7.50,67.50),(64,22,13,2,'P013','Butter Croissant','Pastry / Baked Good',2,85.00,10.00,170.00,17.00,153.00),(65,22,6,1,'P006','Matcha Latte','Non-Coffee',1,140.00,0.00,140.00,0.00,140.00),(66,22,14,3,'P014','Chocolate Cookie','Pastry / Baked Good',2,60.00,20.00,120.00,24.00,96.00),(67,23,1,3,'P001','Americano','Coffee',1,90.00,20.00,90.00,18.00,72.00),(68,23,9,2,'P009','Iced Tea','Non-Coffee',2,80.00,10.00,160.00,16.00,144.00),(69,23,2,1,'P002','Cafe Latte','Coffee',1,120.00,0.00,120.00,0.00,120.00),(70,24,4,1,'P004','Spanish Latte','Coffee',2,140.00,0.00,280.00,0.00,280.00),(71,24,12,3,'P012','Blueberry Cheesecake','Pastry / Baked Good',1,130.00,20.00,130.00,26.00,104.00),(72,24,5,2,'P005','Caramel Macchiato','Coffee',2,150.00,10.00,300.00,30.00,270.00),(73,25,7,2,'P007','Chocolate Milk','Non-Coffee',1,120.00,10.00,120.00,12.00,108.00),(74,25,15,1,'P015','Cinnamon Roll','Pastry / Baked Good',2,95.00,0.00,190.00,0.00,190.00),(75,25,8,3,'P008','Strawberry Milk','Non-Coffee',1,120.00,20.00,120.00,24.00,96.00),(76,26,10,3,'P010','Cookies and Cream','Non-Coffee',2,150.00,20.00,300.00,60.00,240.00),(77,26,3,2,'P003','Cappuccino','Coffee',1,120.00,10.00,120.00,12.00,108.00),(78,26,11,1,'P011','Chocolate Muffin','Pastry / Baked Good',2,75.00,0.00,150.00,0.00,150.00),(79,27,13,1,'P013','Butter Croissant','Pastry / Baked Good',1,85.00,0.00,85.00,0.00,85.00),(80,27,6,3,'P006','Matcha Latte','Non-Coffee',2,140.00,20.00,280.00,56.00,224.00),(81,27,14,2,'P014','Chocolate Cookie','Pastry / Baked Good',1,60.00,10.00,60.00,6.00,54.00),(82,28,1,2,'P001','Americano','Coffee',2,90.00,10.00,180.00,18.00,162.00),(83,28,9,1,'P009','Iced Tea','Non-Coffee',1,80.00,0.00,80.00,0.00,80.00),(84,28,2,3,'P002','Cafe Latte','Coffee',2,120.00,20.00,240.00,48.00,192.00),(85,29,4,3,'P004','Spanish Latte','Coffee',1,140.00,20.00,140.00,28.00,112.00),(86,29,12,2,'P012','Blueberry Cheesecake','Pastry / Baked Good',2,130.00,10.00,260.00,26.00,234.00),(87,29,5,1,'P005','Caramel Macchiato','Coffee',1,150.00,0.00,150.00,0.00,150.00),(88,30,7,1,'P007','Chocolate Milk','Non-Coffee',2,120.00,0.00,240.00,0.00,240.00),(89,30,15,3,'P015','Cinnamon Roll','Pastry / Baked Good',1,95.00,20.00,95.00,19.00,76.00),(90,30,8,2,'P008','Strawberry Milk','Non-Coffee',2,120.00,10.00,240.00,24.00,216.00),(91,31,10,2,'P010','Cookies and Cream','Non-Coffee',1,150.00,10.00,150.00,15.00,135.00),(92,31,3,1,'P003','Cappuccino','Coffee',2,120.00,0.00,240.00,0.00,240.00),(93,31,11,3,'P011','Chocolate Muffin','Pastry / Baked Good',1,75.00,20.00,75.00,15.00,60.00),(94,32,13,3,'P013','Butter Croissant','Pastry / Baked Good',2,85.00,20.00,170.00,34.00,136.00),(95,32,6,2,'P006','Matcha Latte','Non-Coffee',1,140.00,10.00,140.00,14.00,126.00),(96,32,14,1,'P014','Chocolate Cookie','Pastry / Baked Good',2,60.00,0.00,120.00,0.00,120.00),(97,33,1,1,'P001','Americano','Coffee',1,90.00,0.00,90.00,0.00,90.00),(98,33,9,3,'P009','Iced Tea','Non-Coffee',2,80.00,20.00,160.00,32.00,128.00),(99,33,2,2,'P002','Cafe Latte','Coffee',1,120.00,10.00,120.00,12.00,108.00),(100,34,4,2,'P004','Spanish Latte','Coffee',2,140.00,10.00,280.00,28.00,252.00),(101,34,12,1,'P012','Blueberry Cheesecake','Pastry / Baked Good',1,130.00,0.00,130.00,0.00,130.00),(102,34,5,3,'P005','Caramel Macchiato','Coffee',2,150.00,20.00,300.00,60.00,240.00),(103,35,7,3,'P007','Chocolate Milk','Non-Coffee',1,120.00,20.00,120.00,24.00,96.00),(104,35,15,2,'P015','Cinnamon Roll','Pastry / Baked Good',2,95.00,10.00,190.00,19.00,171.00),(105,35,8,1,'P008','Strawberry Milk','Non-Coffee',1,120.00,0.00,120.00,0.00,120.00),(106,36,10,1,'P010','Cookies and Cream','Non-Coffee',2,150.00,0.00,300.00,0.00,300.00),(107,36,3,3,'P003','Cappuccino','Coffee',1,120.00,20.00,120.00,24.00,96.00),(108,36,11,2,'P011','Chocolate Muffin','Pastry / Baked Good',2,75.00,10.00,150.00,15.00,135.00),(109,37,13,2,'P013','Butter Croissant','Pastry / Baked Good',1,85.00,10.00,85.00,8.50,76.50),(110,37,6,1,'P006','Matcha Latte','Non-Coffee',2,140.00,0.00,280.00,0.00,280.00),(111,37,14,3,'P014','Chocolate Cookie','Pastry / Baked Good',1,60.00,20.00,60.00,12.00,48.00),(112,38,1,3,'P001','Americano','Coffee',2,90.00,20.00,180.00,36.00,144.00),(113,38,9,2,'P009','Iced Tea','Non-Coffee',1,80.00,10.00,80.00,8.00,72.00),(114,38,2,1,'P002','Cafe Latte','Coffee',2,120.00,0.00,240.00,0.00,240.00),(115,39,4,1,'P004','Spanish Latte','Coffee',1,140.00,0.00,140.00,0.00,140.00),(116,39,12,3,'P012','Blueberry Cheesecake','Pastry / Baked Good',2,130.00,20.00,260.00,52.00,208.00),(117,39,5,2,'P005','Caramel Macchiato','Coffee',1,150.00,10.00,150.00,15.00,135.00),(118,40,7,2,'P007','Chocolate Milk','Non-Coffee',2,120.00,10.00,240.00,24.00,216.00),(119,40,15,1,'P015','Cinnamon Roll','Pastry / Baked Good',1,95.00,0.00,95.00,0.00,95.00),(120,40,8,3,'P008','Strawberry Milk','Non-Coffee',2,120.00,20.00,240.00,48.00,192.00),(121,41,10,3,'P010','Cookies and Cream','Non-Coffee',1,150.00,20.00,150.00,30.00,120.00),(122,41,3,2,'P003','Cappuccino','Coffee',2,120.00,10.00,240.00,24.00,216.00),(123,41,11,1,'P011','Chocolate Muffin','Pastry / Baked Good',1,75.00,0.00,75.00,0.00,75.00),(124,42,13,1,'P013','Butter Croissant','Pastry / Baked Good',2,85.00,0.00,170.00,0.00,170.00),(125,42,6,3,'P006','Matcha Latte','Non-Coffee',1,140.00,20.00,140.00,28.00,112.00),(126,42,14,2,'P014','Chocolate Cookie','Pastry / Baked Good',2,60.00,10.00,120.00,12.00,108.00),(127,43,1,2,'P001','Americano','Coffee',1,90.00,10.00,90.00,9.00,81.00),(128,43,9,1,'P009','Iced Tea','Non-Coffee',2,80.00,0.00,160.00,0.00,160.00),(129,43,2,3,'P002','Cafe Latte','Coffee',1,120.00,20.00,120.00,24.00,96.00),(130,44,4,3,'P004','Spanish Latte','Coffee',2,140.00,20.00,280.00,56.00,224.00),(131,44,12,2,'P012','Blueberry Cheesecake','Pastry / Baked Good',1,130.00,10.00,130.00,13.00,117.00),(132,44,5,1,'P005','Caramel Macchiato','Coffee',2,150.00,0.00,300.00,0.00,300.00),(133,45,7,1,'P007','Chocolate Milk','Non-Coffee',1,120.00,0.00,120.00,0.00,120.00),(134,45,15,3,'P015','Cinnamon Roll','Pastry / Baked Good',2,95.00,20.00,190.00,38.00,152.00),(135,45,8,2,'P008','Strawberry Milk','Non-Coffee',1,120.00,10.00,120.00,12.00,108.00),(136,46,10,2,'P010','Cookies and Cream','Non-Coffee',2,150.00,10.00,300.00,30.00,270.00),(137,46,3,1,'P003','Cappuccino','Coffee',1,120.00,0.00,120.00,0.00,120.00),(138,46,11,3,'P011','Chocolate Muffin','Pastry / Baked Good',2,75.00,20.00,150.00,30.00,120.00),(139,47,13,3,'P013','Butter Croissant','Pastry / Baked Good',1,85.00,20.00,85.00,17.00,68.00),(140,47,6,2,'P006','Matcha Latte','Non-Coffee',2,140.00,10.00,280.00,28.00,252.00),(141,47,14,1,'P014','Chocolate Cookie','Pastry / Baked Good',1,60.00,0.00,60.00,0.00,60.00),(142,48,1,1,'P001','Americano','Coffee',2,90.00,0.00,180.00,0.00,180.00),(143,48,9,3,'P009','Iced Tea','Non-Coffee',1,80.00,20.00,80.00,16.00,64.00),(144,48,2,2,'P002','Cafe Latte','Coffee',2,120.00,10.00,240.00,24.00,216.00),(145,49,4,2,'P004','Spanish Latte','Coffee',1,140.00,10.00,140.00,14.00,126.00),(146,49,12,1,'P012','Blueberry Cheesecake','Pastry / Baked Good',2,130.00,0.00,260.00,0.00,260.00),(147,49,5,3,'P005','Caramel Macchiato','Coffee',1,150.00,20.00,150.00,30.00,120.00),(148,50,7,3,'P007','Chocolate Milk','Non-Coffee',2,120.00,20.00,240.00,48.00,192.00),(149,50,15,2,'P015','Cinnamon Roll','Pastry / Baked Good',1,95.00,10.00,95.00,9.50,85.50),(150,50,8,1,'P008','Strawberry Milk','Non-Coffee',2,120.00,0.00,240.00,0.00,240.00),(151,51,10,1,'P010','Cookies and Cream','Non-Coffee',1,150.00,0.00,150.00,0.00,150.00),(152,51,3,3,'P003','Cappuccino','Coffee',2,120.00,20.00,240.00,48.00,192.00),(153,51,11,2,'P011','Chocolate Muffin','Pastry / Baked Good',1,75.00,10.00,75.00,7.50,67.50),(154,52,13,2,'P013','Butter Croissant','Pastry / Baked Good',2,85.00,10.00,170.00,17.00,153.00),(155,52,6,1,'P006','Matcha Latte','Non-Coffee',1,140.00,0.00,140.00,0.00,140.00),(156,52,14,3,'P014','Chocolate Cookie','Pastry / Baked Good',2,60.00,20.00,120.00,24.00,96.00),(157,53,1,3,'P001','Americano','Coffee',1,90.00,20.00,90.00,18.00,72.00),(158,53,9,2,'P009','Iced Tea','Non-Coffee',2,80.00,10.00,160.00,16.00,144.00),(159,53,2,1,'P002','Cafe Latte','Coffee',1,120.00,0.00,120.00,0.00,120.00),(160,54,4,1,'P004','Spanish Latte','Coffee',2,140.00,0.00,280.00,0.00,280.00),(161,54,12,3,'P012','Blueberry Cheesecake','Pastry / Baked Good',1,130.00,20.00,130.00,26.00,104.00),(162,54,5,2,'P005','Caramel Macchiato','Coffee',2,150.00,10.00,300.00,30.00,270.00),(163,55,7,2,'P007','Chocolate Milk','Non-Coffee',1,120.00,10.00,120.00,12.00,108.00),(164,55,15,1,'P015','Cinnamon Roll','Pastry / Baked Good',2,95.00,0.00,190.00,0.00,190.00),(165,55,8,3,'P008','Strawberry Milk','Non-Coffee',1,120.00,20.00,120.00,24.00,96.00),(166,56,10,3,'P010','Cookies and Cream','Non-Coffee',2,150.00,20.00,300.00,60.00,240.00),(167,56,3,2,'P003','Cappuccino','Coffee',1,120.00,10.00,120.00,12.00,108.00),(168,56,11,1,'P011','Chocolate Muffin','Pastry / Baked Good',2,75.00,0.00,150.00,0.00,150.00),(169,57,13,1,'P013','Butter Croissant','Pastry / Baked Good',1,85.00,0.00,85.00,0.00,85.00),(170,57,6,3,'P006','Matcha Latte','Non-Coffee',2,140.00,20.00,280.00,56.00,224.00),(171,57,14,2,'P014','Chocolate Cookie','Pastry / Baked Good',1,60.00,10.00,60.00,6.00,54.00),(172,58,1,2,'P001','Americano','Coffee',2,90.00,10.00,180.00,18.00,162.00),(173,58,9,1,'P009','Iced Tea','Non-Coffee',1,80.00,0.00,80.00,0.00,80.00),(174,58,2,3,'P002','Cafe Latte','Coffee',2,120.00,20.00,240.00,48.00,192.00),(175,59,4,3,'P004','Spanish Latte','Coffee',1,140.00,20.00,140.00,28.00,112.00),(176,59,12,2,'P012','Blueberry Cheesecake','Pastry / Baked Good',2,130.00,10.00,260.00,26.00,234.00),(177,59,5,1,'P005','Caramel Macchiato','Coffee',1,150.00,0.00,150.00,0.00,150.00),(178,60,7,1,'P007','Chocolate Milk','Non-Coffee',2,120.00,0.00,240.00,0.00,240.00),(179,60,15,3,'P015','Cinnamon Roll','Pastry / Baked Good',1,95.00,20.00,95.00,19.00,76.00),(180,60,8,2,'P008','Strawberry Milk','Non-Coffee',2,120.00,10.00,240.00,24.00,216.00),(181,61,1,1,'P001','Americano','Coffee',1,90.00,0.00,90.00,0.00,90.00),(182,62,1,1,'P001','Americano','Coffee',1,90.00,0.00,90.00,0.00,90.00),(183,63,2,2,'P002','Cafe Latte','Coffee',1,120.00,10.00,120.00,12.00,108.00),(184,64,6,3,'P006','Matcha Latte','Non-Coffee',1,140.00,20.00,140.00,28.00,112.00),(185,65,2,1,'P002','Cafe Latte','Coffee',1,120.00,0.00,120.00,0.00,120.00),(186,66,1,1,'P001','Americano','Coffee',1,90.00,0.00,90.00,0.00,90.00),(187,66,3,2,'P003','Cappuccino','Coffee',1,120.00,10.00,120.00,12.00,108.00),(188,66,4,3,'P004','Spanish Latte','Coffee',1,140.00,20.00,140.00,28.00,112.00),(189,67,6,1,'P006','Matcha Latte','Non-Coffee',2,140.00,0.00,280.00,0.00,280.00),(190,67,6,2,'P006','Matcha Latte','Non-Coffee',1,140.00,10.00,140.00,14.00,126.00),(191,68,3,1,'P003','Cappuccino','Coffee',1,120.00,0.00,120.00,0.00,120.00),(192,69,6,2,'P006','Matcha Latte','Non-Coffee',1,140.00,10.00,140.00,14.00,126.00),(193,70,4,3,'P004','Spanish Latte','Coffee',1,140.00,20.00,140.00,28.00,112.00),(194,71,1,1,'P001','Americano','Coffee',1,90.00,0.00,90.00,0.00,90.00),(195,71,1,3,'P001','Americano','Coffee',1,90.00,20.00,90.00,18.00,72.00),(196,71,6,2,'P006','Matcha Latte','Non-Coffee',1,140.00,10.00,140.00,14.00,126.00);
/*!40000 ALTER TABLE `transaction_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `transaction_id` int NOT NULL AUTO_INCREMENT,
  `transaction_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int NOT NULL,
  `payment_method_id` int NOT NULL,
  `transaction_date` datetime NOT NULL,
  `customer_count` int NOT NULL DEFAULT '1',
  `subtotal` decimal(12,2) NOT NULL DEFAULT '0.00',
  `discount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total` decimal(12,2) NOT NULL DEFAULT '0.00',
  `amount_received` decimal(12,2) NOT NULL DEFAULT '0.00',
  `change_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `transaction_status` enum('Completed','Voided','Refunded') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Completed',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`transaction_id`),
  UNIQUE KEY `transaction_code` (`transaction_code`),
  KEY `idx_transactions_date` (`transaction_date`),
  KEY `idx_transactions_user` (`user_id`),
  KEY `idx_transactions_payment` (`payment_method_id`),
  KEY `idx_transactions_status` (`transaction_status`),
  CONSTRAINT `fk_transactions_payment` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`payment_method_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_transactions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE,
  CONSTRAINT `chk_transactions_amounts` CHECK (((`subtotal` >= 0) and (`discount` >= 0) and (`total` >= 0) and (`amount_received` >= 0) and (`change_amount` >= 0))),
  CONSTRAINT `chk_transactions_customer_count` CHECK ((`customer_count` >= 1))
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,'CS-202610-001',3,4,'2026-10-08 08:17:00',2,465.00,30.00,435.00,435.00,0.00,'Completed','2026-11-21 10:51:36'),(2,'CS-202610-002',2,3,'2026-10-15 08:34:00',3,430.00,48.00,382.00,382.00,0.00,'Completed','2026-11-21 10:51:36'),(3,'CS-202610-003',3,2,'2026-10-22 08:51:00',4,370.00,44.00,326.00,326.00,0.00,'Completed','2026-11-21 10:51:36'),(4,'CS-202610-004',2,1,'2026-10-29 08:08:00',1,710.00,88.00,622.00,630.00,8.00,'Completed','2026-11-21 10:51:36'),(5,'CS-202610-005',3,4,'2026-10-05 08:25:00',2,430.00,43.00,387.00,387.00,0.00,'Completed','2026-11-21 10:51:36'),(6,'CS-202610-006',2,3,'2026-10-12 08:42:00',3,570.00,39.00,531.00,531.00,0.00,'Completed','2026-11-21 10:51:36'),(7,'CS-202610-007',3,2,'2026-10-19 08:59:00',4,425.00,20.50,404.50,404.50,0.00,'Completed','2026-11-21 10:51:36'),(8,'CS-202610-008',2,1,'2026-10-26 08:16:00',1,500.00,44.00,456.00,460.00,4.00,'Completed','2026-11-21 10:51:36'),(9,'CS-202610-009',3,4,'2026-10-02 08:33:00',2,550.00,67.00,483.00,483.00,0.00,'Completed','2026-11-21 10:51:36'),(10,'CS-202610-010',2,3,'2026-10-09 08:50:00',3,575.00,72.00,503.00,503.00,0.00,'Completed','2026-11-21 10:51:36'),(11,'CS-202610-011',3,2,'2026-10-16 08:07:00',4,465.00,54.00,411.00,411.00,0.00,'Completed','2026-11-21 10:51:36'),(12,'CS-202610-012',2,1,'2026-10-23 08:24:00',1,430.00,40.00,390.00,390.00,0.00,'Completed','2026-11-21 10:51:36'),(13,'CS-202610-013',3,4,'2026-10-30 08:41:00',2,370.00,33.00,337.00,337.00,0.00,'Completed','2026-11-21 10:51:36'),(14,'CS-202610-014',2,3,'2026-10-06 08:58:00',3,710.00,69.00,641.00,641.00,0.00,'Completed','2026-11-21 10:51:36'),(15,'CS-202610-015',3,2,'2026-10-13 08:15:00',4,430.00,50.00,380.00,380.00,0.00,'Completed','2026-11-21 10:51:36'),(16,'CS-202610-016',2,1,'2026-10-20 08:32:00',1,570.00,60.00,510.00,510.00,0.00,'Completed','2026-11-21 10:51:36'),(17,'CS-202610-017',3,4,'2026-10-27 08:49:00',2,425.00,45.00,380.00,380.00,0.00,'Completed','2026-11-21 10:51:36'),(18,'CS-202610-018',2,3,'2026-10-03 08:06:00',3,500.00,40.00,460.00,460.00,0.00,'Completed','2026-11-21 10:51:36'),(19,'CS-202610-019',3,2,'2026-10-10 08:23:00',4,550.00,44.00,506.00,506.00,0.00,'Completed','2026-11-21 10:51:36'),(20,'CS-202610-020',2,1,'2026-10-17 08:40:00',1,575.00,57.50,517.50,520.00,2.50,'Completed','2026-11-21 10:51:36'),(21,'CS-202610-021',3,4,'2026-10-24 08:57:00',2,465.00,55.50,409.50,409.50,0.00,'Completed','2026-11-21 10:51:36'),(22,'CS-202610-022',2,3,'2026-10-31 08:14:00',3,430.00,41.00,389.00,389.00,0.00,'Completed','2026-11-21 10:51:36'),(23,'CS-202610-023',3,2,'2026-10-07 08:31:00',4,370.00,34.00,336.00,336.00,0.00,'Completed','2026-11-21 10:51:36'),(24,'CS-202610-024',2,1,'2026-10-14 08:48:00',1,710.00,56.00,654.00,660.00,6.00,'Completed','2026-11-21 10:51:36'),(25,'CS-202610-025',3,4,'2026-10-21 08:05:00',2,430.00,36.00,394.00,394.00,0.00,'Completed','2026-11-21 10:51:36'),(26,'CS-202610-026',2,3,'2026-10-28 08:22:00',3,570.00,72.00,498.00,498.00,0.00,'Completed','2026-11-21 10:51:36'),(27,'CS-202610-027',3,2,'2026-10-04 08:39:00',4,425.00,62.00,363.00,363.00,0.00,'Completed','2026-11-21 10:51:36'),(28,'CS-202610-028',2,1,'2026-10-11 08:56:00',1,500.00,66.00,434.00,440.00,6.00,'Completed','2026-11-21 10:51:36'),(29,'CS-202610-029',3,4,'2026-10-18 08:13:00',2,550.00,54.00,496.00,496.00,0.00,'Completed','2026-11-21 10:51:36'),(30,'CS-202610-030',2,3,'2026-10-25 08:30:00',3,575.00,43.00,532.00,532.00,0.00,'Completed','2026-11-21 10:51:36'),(31,'CS-202610-031',3,2,'2026-10-01 08:47:00',4,465.00,30.00,435.00,435.00,0.00,'Completed','2026-11-21 10:51:36'),(32,'CS-202610-032',2,1,'2026-10-08 08:04:00',1,430.00,48.00,382.00,390.00,8.00,'Completed','2026-11-21 10:51:36'),(33,'CS-202610-033',3,4,'2026-10-15 08:21:00',2,370.00,44.00,326.00,326.00,0.00,'Completed','2026-11-21 10:51:36'),(34,'CS-202610-034',2,3,'2026-10-22 08:38:00',3,710.00,88.00,622.00,622.00,0.00,'Completed','2026-11-21 10:51:36'),(35,'CS-202610-035',3,2,'2026-10-29 08:55:00',4,430.00,43.00,387.00,387.00,0.00,'Completed','2026-11-21 10:51:36'),(36,'CS-202610-036',2,1,'2026-10-05 08:12:00',1,570.00,39.00,531.00,540.00,9.00,'Completed','2026-11-21 10:51:36'),(37,'CS-202610-037',3,4,'2026-10-12 08:29:00',2,425.00,20.50,404.50,404.50,0.00,'Completed','2026-11-21 10:51:36'),(38,'CS-202610-038',2,3,'2026-10-19 08:46:00',3,500.00,44.00,456.00,456.00,0.00,'Completed','2026-11-21 10:51:36'),(39,'CS-202610-039',3,2,'2026-10-26 08:03:00',4,550.00,67.00,483.00,483.00,0.00,'Completed','2026-11-21 10:51:36'),(40,'CS-202610-040',2,1,'2026-10-02 08:20:00',1,575.00,72.00,503.00,510.00,7.00,'Completed','2026-11-21 10:51:36'),(41,'CS-202610-041',3,4,'2026-10-09 08:37:00',2,465.00,54.00,411.00,411.00,0.00,'Completed','2026-11-21 10:51:36'),(42,'CS-202610-042',2,3,'2026-10-16 08:54:00',3,430.00,40.00,390.00,390.00,0.00,'Completed','2026-11-21 10:51:36'),(43,'CS-202610-043',3,2,'2026-10-23 08:11:00',4,370.00,33.00,337.00,337.00,0.00,'Completed','2026-11-21 10:51:36'),(44,'CS-202610-044',2,1,'2026-10-30 08:28:00',1,710.00,69.00,641.00,650.00,9.00,'Completed','2026-11-21 10:51:36'),(45,'CS-202610-045',3,4,'2026-10-06 08:45:00',2,430.00,50.00,380.00,380.00,0.00,'Completed','2026-11-21 10:51:36'),(46,'CS-202610-046',2,3,'2026-10-13 08:02:00',3,570.00,60.00,510.00,510.00,0.00,'Completed','2026-11-21 10:51:36'),(47,'CS-202610-047',3,2,'2026-10-20 08:19:00',4,425.00,45.00,380.00,380.00,0.00,'Completed','2026-11-21 10:51:36'),(48,'CS-202610-048',2,1,'2026-10-27 08:36:00',1,500.00,40.00,460.00,460.00,0.00,'Completed','2026-11-21 10:51:36'),(49,'CS-202610-049',3,4,'2026-10-03 08:53:00',2,550.00,44.00,506.00,506.00,0.00,'Completed','2026-11-21 10:51:36'),(50,'CS-202610-050',2,3,'2026-10-10 08:10:00',3,575.00,57.50,517.50,517.50,0.00,'Completed','2026-11-21 10:51:36'),(51,'CS-202610-051',3,2,'2026-10-17 08:27:00',4,465.00,55.50,409.50,409.50,0.00,'Completed','2026-11-21 10:51:36'),(52,'CS-202610-052',2,1,'2026-10-24 08:44:00',1,430.00,41.00,389.00,390.00,1.00,'Completed','2026-11-21 10:51:36'),(53,'CS-202610-053',3,4,'2026-10-31 08:01:00',2,370.00,34.00,336.00,336.00,0.00,'Completed','2026-11-21 10:51:36'),(54,'CS-202610-054',2,3,'2026-10-07 08:18:00',3,710.00,56.00,654.00,654.00,0.00,'Completed','2026-11-21 10:51:36'),(55,'CS-202610-055',3,2,'2026-10-14 08:35:00',4,430.00,36.00,394.00,394.00,0.00,'Completed','2026-11-21 10:51:36'),(56,'CS-202610-056',2,1,'2026-10-21 08:52:00',1,570.00,72.00,498.00,500.00,2.00,'Completed','2026-11-21 10:51:36'),(57,'CS-202610-057',3,4,'2026-10-28 08:09:00',2,425.00,62.00,363.00,363.00,0.00,'Completed','2026-11-21 10:51:36'),(58,'CS-202610-058',2,3,'2026-10-04 08:26:00',3,500.00,66.00,434.00,434.00,0.00,'Completed','2026-11-21 10:51:36'),(59,'CS-202610-059',3,2,'2026-10-11 08:43:00',4,550.00,54.00,496.00,496.00,0.00,'Completed','2026-11-21 10:51:36'),(60,'CS-202610-060',2,1,'2026-10-18 08:00:00',1,575.00,43.00,532.00,540.00,8.00,'Completed','2026-11-21 10:51:36'),(61,'CS-00ca5713-778f-46f6-889f-8ac79404dc32',1,1,'2026-11-22 23:03:42',1,90.00,0.00,90.00,90.00,0.00,'Completed','2026-11-22 15:03:42'),(62,'CS-202611-062',1,1,'2026-11-23 01:20:28',1,90.00,0.00,90.00,100.00,10.00,'Completed','2026-11-22 17:20:28'),(63,'CS-202611-063',1,2,'2026-11-23 01:25:15',1,120.00,12.00,108.00,108.00,0.00,'Completed','2026-11-22 17:25:15'),(64,'CS-202611-064',1,3,'2026-11-23 01:26:46',1,140.00,28.00,112.00,112.00,0.00,'Completed','2026-11-22 17:26:46'),(65,'CS-202611-065',3,1,'2026-11-23 22:36:10',1,120.00,0.00,120.00,120.00,0.00,'Completed','2026-11-23 14:36:10'),(66,'CS-202611-066',1,1,'2026-11-24 16:56:00',1,350.00,40.00,310.00,310.00,0.00,'Completed','2026-11-24 08:56:00'),(67,'CS-202611-067',1,4,'2026-11-24 16:56:30',1,420.00,14.00,406.00,406.00,0.00,'Completed','2026-11-24 08:56:30'),(68,'CS-202611-068',1,1,'2026-11-24 17:07:06',1,120.00,0.00,120.00,120.00,0.00,'Completed','2026-11-24 09:07:06'),(69,'CS-202611-069',1,2,'2026-11-24 17:07:53',1,140.00,14.00,126.00,126.00,0.00,'Completed','2026-11-24 09:07:53'),(70,'CS-202611-070',1,3,'2026-11-24 20:04:34',1,140.00,28.00,112.00,112.00,0.00,'Completed','2026-11-24 12:04:34'),(71,'CS-202611-071',1,1,'2026-11-25 00:47:15',3,320.00,32.00,288.00,300.00,12.00,'Completed','2026-11-24 16:47:15');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_status` enum('Active','Inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_users_role` (`role_id`),
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,1,'Kyla Hernandez','kyla.owner','kyla.owner@cafesense.test','$2b$12$kk8uh49MmCaHZxlVMVItTuFrf8NWswPv3Qx3zHXtD0h7PKRkqiERG','Active','2026-11-21 10:23:24','2026-11-24 08:13:29'),(2,2,'Khen Gamier','khen.manager','khen.manager@cafesense.test','$2b$12$fMEMYX9AVlHtI5KpdK/9J.sP5SwbzqwUr/SkhLvUlvVxS/3LRx.TO','Active','2026-11-21 10:23:24','2026-11-24 11:49:04'),(3,3,'Krizea Abanilla','krizea.staff','krizea.staff@cafesense.test','$2b$12$iIPDCSaqv/7Lkimsr1aZJuaixN5FsMRKfUKRhwxO9uasM9oFf3NlK','Active','2026-11-21 10:23:24','2026-11-24 08:15:56'),(4,3,'Kim Winter','min','min@cafesense.test','$2b$12$l9cAEeZSniM5k/OsNVVrJe8ASaKy1x4IKg1ogMpBvHzIhSv/TppMe','Inactive','2026-11-23 16:43:50','2026-11-24 16:52:28'),(5,2,'Yu Karina','jimin','jimin@cafesense.test','$2b$12$apr2jF.Pz4h7D0CGe3cKYOkDm.ZuEQ1XUubVLYHFd2ryiBHvTPzua','Inactive','2026-11-24 11:19:30','2026-11-24 11:24:18');
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

-- Dump completed on 2026-11-25 21:29:51
