/* Replace with your SQL commands */
CREATE TABLE `actionlog` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `function` int(11) DEFAULT NULL,
  `action` int(11) DEFAULT NULL,
  `objectId` int(11) DEFAULT NULL,
  `objectContentOld` longtext DEFAULT NULL,
  `objectContentNew` longtext DEFAULT NULL,
  `deviceInfo` text DEFAULT NULL,
  `branchId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;