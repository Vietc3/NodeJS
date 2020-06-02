/* Replace with your SQL commands */
CREATE TABLE `counter` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) DEFAULT NULL,
  `value` longtext DEFAULT NULL,
  `deletedAt` double DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `createdBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

INSERT INTO `storeconfig` (`createdAt`, `updatedAt`, `type`, `value`, `createdBy`, `updatedBy`) VALUES ('1582179133516', '1582179133516', "card_code", '{}', NULL, NULL);