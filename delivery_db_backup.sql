-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: delivery_db
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Table structure for table `dispatches`
--

DROP TABLE IF EXISTS `dispatches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dispatches` (
  `id` varchar(20) NOT NULL,
  `route` varchar(100) DEFAULT NULL,
  `driver` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dispatches`
--

LOCK TABLES `dispatches` WRITE;
/*!40000 ALTER TABLE `dispatches` DISABLE KEYS */;
INSERT INTO `dispatches` VALUES ('LD-2024-001847','Chicago to Atlanta','Mike Rodriguez','in-transit','2026-02-26 19:30:27'),('LD-2024-001848','Dallas to Phoenix','Jennifer Chen','assigned','2026-02-26 19:30:27'),('LD-2024-001849','Los Angeles to Seattle','David Thompson','loading','2026-02-26 19:30:27'),('LD-2024-001850','Miami to Jacksonville','Maria Santos','delivered','2026-02-26 19:30:27'),('LD-2024-001851','Houston to New Orleans','—','unassigned','2026-02-26 19:30:27'),('LD-2024-001852','Denver to Kansas City','Lisa Park','in-transit','2026-02-26 19:30:27'),('LD-2024-001853','Nashville to Memphis','Carlos Mendez','loading','2026-02-26 19:30:27'),('LD-2024-001854','Portland to Sacramento','Amy Zhang','assigned','2026-02-26 19:30:27'),('LD-2024-001855','Detroit to Columbus','James Brown','in-transit','2026-02-26 19:30:27');
/*!40000 ALTER TABLE `dispatches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drivers`
--

DROP TABLE IF EXISTS `drivers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drivers` (
  `id` varchar(20) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `initials` varchar(5) DEFAULT NULL,
  `route` varchar(80) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `rating` varchar(5) DEFAULT NULL,
  `loads` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drivers`
--

LOCK TABLES `drivers` WRITE;
/*!40000 ALTER TABLE `drivers` DISABLE KEYS */;
INSERT INTO `drivers` VALUES ('DRV-001','Mike Rodriguez','MR','Chicago to Atlanta','on-route','4.9',342),('DRV-002','Jennifer Chen','JC','Dallas to Phoenix','on-route','4.8',287),('DRV-003','David Thompson','DT','Los Angeles to Seattle','on-route','4.7',194),('DRV-004','Maria Santos','MS','Completed · Off duty','off-duty','4.9',418),('DRV-005','Robert Wilson','RW','IL-5629 · Critical','on-route','4.2',156),('DRV-006','Lisa Park','LP','Denver to Kansas City','on-route','4.6',231),('DRV-007','Carlos Mendez','CM','Nashville — HOS Warning','on-route','4.5',198),('DRV-008','Amy Zhang','AZ','Portland — Assigned','off-duty','4.8',163),('DRV-009','James Brown','JB','Detroit to Columbus','on-route','4.4',274);
/*!40000 ALTER TABLE `drivers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fleet`
--

DROP TABLE IF EXISTS `fleet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fleet` (
  `id` varchar(20) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `driver` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `location` varchar(60) DEFAULT NULL,
  `mileage` varchar(15) DEFAULT NULL,
  `fuel` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fleet`
--

LOCK TABLES `fleet` WRITE;
/*!40000 ALTER TABLE `fleet` DISABLE KEYS */;
INSERT INTO `fleet` VALUES ('CA-3952','Kenworth T680','David Thompson','active','Portland, OR','221,890',91),('FL-4892','Freightliner Cascadia','Mike Rodriguez','active','Chattanooga, TN','487,230',78),('IL-5629','International LT','Robert Wilson','critical','Baton Rouge, LA','562,110',23),('NY-1847','Volvo VNL 860','Lisa Park','active','Dodge City, KS','398,560',44),('T-0029','Freightliner Cascadia','James Brown','active','Toledo, OH','180,200',55),('T-0047','Peterbilt 389','—','maintenance','Chicago Hub','634,000',0),('T-0053','Kenworth W900','Carlos Mendez','active','Nashville, TN','277,300',69),('T-0061','Volvo VNL 760','Amy Zhang','active','Portland, OR','143,000',88),('T-0072','Freightliner 114SD','—','inactive','Dallas Hub','89,400',0),('TX-7841','Peterbilt 579','Jennifer Chen','active','Amarillo, TX','312,440',62);
/*!40000 ALTER TABLE `fleet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` varchar(20) NOT NULL,
  `route` varchar(100) DEFAULT NULL,
  `driver` varchar(50) DEFAULT NULL,
  `vehicle` varchar(20) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `eta` varchar(30) DEFAULT NULL,
  `value` varchar(15) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES ('LD-2024-001848','Dallas to Phoenix','Jennifer Chen','TX-7841','assigned','Feb 24, 14:00','$11,200','2026-02-26 19:29:56'),('LD-2024-001849','Los Angeles to Seattle','David Thompson','CA-3952','loading','Feb 25, 08:00','$15,600','2026-02-26 19:29:56'),('LD-2024-001850','Miami to Jacksonville','Maria Santos','IL-5629','delivered','Delivered','$4,100','2026-02-26 19:29:56'),('LD-2024-001851','Houston to New Orleans','—','—','unassigned','TBD','$3,800','2026-02-26 19:29:56'),('LD-2024-001852','Denver to Kansas City','Lisa Park','NY-1847','in-transit','Feb 22, 22:00','$6,200','2026-02-26 19:29:56'),('LD-2024-001854','Portland to Sacramento','Amy Zhang','T-0061','assigned','Feb 26, 09:00','$13,400','2026-02-26 19:29:56'),('LD-2024-001855','Detroit to Columbus','James Brown','T-0029','in-transit','Feb 22, 18:30','$3,200','2026-02-26 19:29:56'),('LD-2024-001902','Boston to New York','John Smith','T-0080','assigned','Mar 01, 10:00','$5,500','2026-02-26 20:59:06');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-06 17:01:56
