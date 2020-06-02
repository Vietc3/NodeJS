/* Replace with your SQL commands */
CREATE TABLE `invoicereturn` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) DEFAULT NULL,
  `returnAmount` double DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `status` double DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `deletedAt` double DEFAULT NULL,
  `invoiceId` int(11) DEFAULT NULL,
  `createdBy` int(11) DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `invoicereturnproduct` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `productCode` varchar(255) DEFAULT NULL,
  `productName` varchar(255) DEFAULT NULL,
  `quantity` double DEFAULT NULL,
  `unitPrice` double DEFAULT NULL,
  `discount` double DEFAULT NULL,
  `taxAmount` double DEFAULT NULL,
  `finalAmount` double DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `deletedAt` double DEFAULT NULL,
  `invoiceReturnId` int(11) DEFAULT NULL,
  `productId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;