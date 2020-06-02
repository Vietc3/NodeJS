/* Replace with your SQL commands */

CREATE TABLE if not exists `branch` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `status` double DEFAULT NULL,
  `deletedAt` double DEFAULT NULL,
  `createdBy` int(11) DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

SELECT JSON_UNQUOTE(JSON_EXTRACT(value,'$.address')), JSON_UNQUOTE(JSON_EXTRACT(value,'$.email')), JSON_UNQUOTE(JSON_EXTRACT(value,'$.tel')) into @address, @email, @tel FROM `storeconfig` WHERE type = 'store_info';

INSERT INTO `branch` (`createdAt`,`updatedAt`, `name`, `address`, `email`, `phoneNumber`, `status`, `deletedAt`,`createdBy`,`updatedBy`) 
  VALUES (
    (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
    (SELECT CAST( 1000*UNIX_TIMESTAMP(current_timestamp(3)) AS UNSIGNED INTEGER)),
    'Chi nhánh mặc định',
    @address,
    @email,
    @tel,
    '1',
    '0',
    '1',
    '1'
  );

ALTER TABLE `importcard` ADD `branchId` int(11) DEFAULT NULL;
UPDATE `importcard` SET `branchId` = 1 WHERE `branchId` IS NULL;

ALTER TABLE `exportcard` ADD `branchId` int(11) DEFAULT NULL;
UPDATE `exportcard` SET `branchId` = 1 WHERE `branchId` IS NULL;

ALTER TABLE `customer` ADD `branchId` int(11) DEFAULT NULL;
UPDATE `customer` SET `branchId` = 1 WHERE `branchId` IS NULL;

ALTER TABLE `movestockcard` ADD `branchId` int(11) DEFAULT NULL;
UPDATE `movestockcard` SET `branchId` = 1 WHERE `branchId` IS NULL;

ALTER TABLE `incomeexpensecard` ADD `branchId` int(11) DEFAULT NULL;
UPDATE `incomeexpensecard` SET `branchId` = 1 WHERE `branchId` IS NULL;

ALTER TABLE `depositcard` ADD `branchId` int(11) DEFAULT NULL;
UPDATE `depositcard` SET `branchId` = 1 WHERE `branchId` IS NULL;

ALTER TABLE `manufacturingcard` ADD `branchId` int(11) DEFAULT NULL;
UPDATE `manufacturingcard` SET `branchId` = 1 WHERE `branchId` IS NULL;

ALTER TABLE `invoice` ADD `branchId` int(11) DEFAULT NULL;
UPDATE `invoice` SET `branchId` = 1 WHERE `branchId` IS NULL;