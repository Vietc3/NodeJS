/* Replace with your SQL commands */

CREATE TABLE `movestockcard` (
 `createdAt` bigint(20) DEFAULT NULL,
 `updatedAt` bigint(20) DEFAULT NULL,
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `code` varchar(255) DEFAULT NULL,
 `movedAt` double DEFAULT NULL,
 `movedBy` double DEFAULT NULL,
 `notes` varchar(255) DEFAULT NULL,
 `reason` double DEFAULT NULL,
 `status` double DEFAULT NULL,
 `reference` varchar(255) DEFAULT NULL,
 `deletedAt` double DEFAULT NULL,
 `createdBy` int(11) DEFAULT NULL,
 `updatedBy` int(11) DEFAULT NULL,
 PRIMARY KEY (`id`),
 UNIQUE KEY `id` (`id`),
 UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `movestockcardproduct` (
 `createdAt` bigint(20) DEFAULT NULL,
 `updatedAt` bigint(20) DEFAULT NULL,
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `productCode` varchar(255) DEFAULT NULL,
 `productName` varchar(255) DEFAULT NULL,
 `productUnit` varchar(255) DEFAULT NULL,
 `quantity` double DEFAULT NULL,
 `notes` varchar(255) DEFAULT NULL,
 `deletedAt` double DEFAULT NULL,
 `moveStockCardId` int(11) DEFAULT NULL,
 `productId` int(11) DEFAULT NULL,
 PRIMARY KEY (`id`),
 UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;