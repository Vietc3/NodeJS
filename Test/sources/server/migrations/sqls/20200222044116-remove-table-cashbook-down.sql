/* Replace with your SQL commands */

CREATE TABLE `cashbook` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `changeValue` double DEFAULT NULL,
  `remainingValue` double DEFAULT NULL,
  `originalVoucherId` varchar(255) DEFAULT NULL,
  `originalVoucherCode` varchar(255) DEFAULT NULL,
  `type` double DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `deletedAt` double DEFAULT NULL,
  `customerId` int(11) DEFAULT NULL,
  `createdBy` int(11) DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;