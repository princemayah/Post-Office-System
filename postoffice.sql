-- Creating table `address`
DROP TABLE IF EXISTS `address`;
CREATE TABLE `address` (
  `address_id` int NOT NULL,
  `street_address` varchar(255) NOT NULL,
  `state` varchar(2) NOT NULL,
  `city` varchar(255) NOT NULL,
  `zip` int NOT NULL,
  PRIMARY KEY (`address_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Creating table `customers`
DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
  `customers_id` int NOT NULL,
  `FName` varchar(255) NOT NULL,
  `LName` varchar(255) NOT NULL,
  `c_username` varchar(255) NOT NULL,
  `c_password` varchar(255) NOT NULL,
  `dob` date NOT NULL,
  `address_id` int DEFAULT NULL,
  `c_Email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`customers_id`),
  KEY `address_id` (`address_id`),
  CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`address_id`) REFERENCES `address` (`address_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Creating table `email_notifications_queue`
DROP TABLE IF EXISTS `email_notifications_queue`;
CREATE TABLE `email_notifications_queue` (
  `id` int NOT NULL AUTO_INCREMENT,
  `packages_id` int NOT NULL,
  `send_email` varchar(255) DEFAULT NULL,
  `receive_email` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('pending','sent','failed') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_package_id` (`packages_id`),
  CONSTRAINT `fk_package_id` FOREIGN KEY (`packages_id`) REFERENCES `packages` (`packages_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Creating table `employees`
DROP TABLE IF EXISTS `employees`;
CREATE TABLE `employees` (
  `employees_id` int NOT NULL,
  `employees_ssn` int NOT NULL,
  `e_username` varchar(255) NOT NULL,
  `e_password` varchar(255) NOT NULL,
  `location_id` int DEFAULT NULL,
  `e_role` varchar(3) NOT NULL,
  `EFname` varchar(255) DEFAULT NULL,
  `ELname` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`employees_id`),
  KEY `location_id` (`location_id`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Creating table `location`
DROP TABLE IF EXISTS `location`;
CREATE TABLE `location` (
  `location_id` int NOT NULL,
  `lname` varchar(255) DEFAULT NULL,
  `ltype` char(2) DEFAULT NULL,
  PRIMARY KEY (`location_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Creating table `packages`
DROP TABLE IF EXISTS `packages`;
CREATE TABLE `packages` (
  `weight` float NOT NULL,
  `price` float NOT NULL,
  `packages_id` int NOT NULL,
  `customers_send_id` int DEFAULT NULL,
  `address_from_id` int DEFAULT NULL,
  `address_to_id` int DEFAULT NULL,
  `location_id` int NOT NULL,
  `send_f_name` varchar(255) DEFAULT NULL,
  `send_l_name` varchar(255) DEFAULT NULL,
  `receive_f_name` varchar(255) DEFAULT NULL,
  `receive_l_name` varchar(255) DEFAULT NULL,
  `package_status` varchar(25) DEFAULT NULL,
  `employees_handle_id` int DEFAULT NULL,
  `send_email` varchar(255) DEFAULT NULL,
  `receive_email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`packages_id`),
  KEY `address_from_id` (`address_from_id`),
  KEY `address_to_id` (`address_to_id`),
  KEY `customers_send_id` (`customers_send_id`),
  KEY `employees_handle_id` (`employees_handle_id`),
  CONSTRAINT `packages_ibfk_1` FOREIGN KEY (`address_from_id`) REFERENCES `address` (`address_id`),
  CONSTRAINT `packages_ibfk_2` FOREIGN KEY (`address_to_id`) REFERENCES `address` (`address_id`) ON DELETE CASCADE,
  CONSTRAINT `packages_ibfk_3` FOREIGN KEY (`customers_send_id`) REFERENCES `customers` (`customers_id`),
  CONSTRAINT `packages_ibfk_4` FOREIGN KEY (`employees_handle_id`) REFERENCES `employees` (`employees_id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
