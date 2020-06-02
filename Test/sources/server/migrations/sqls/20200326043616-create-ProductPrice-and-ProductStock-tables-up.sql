/* Replace with your SQL commands */


CREATE TABLE if not exists `productprice` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `branchId` int(11) DEFAULT NULL,
  `productId` int(11) DEFAULT NULL,
  `costUnitPrice` double DEFAULT NULL,
  `lastImportPrice` double DEFAULT NULL,
  `saleUnitPrice` double DEFAULT NULL,
  `deletedAt` double DEFAULT NULL,
  `createdBy` int(11) DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE if not exists `productstock` (
  `createdAt` bigint(20) DEFAULT NULL,
  `updatedAt` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `branchId` int(11) DEFAULT NULL,
  `productId` int(11) DEFAULT NULL,
  `stockQuantity` double DEFAULT NULL,
  `manufacturingQuantity` double DEFAULT NULL,
  `deletedAt` double DEFAULT NULL,
  `createdBy` int(11) DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO productprice (createdAt, updatedAt, branchId, productId, costUnitPrice, lastImportPrice, saleUnitPrice, deletedAt, createdBy, updatedBy)
SELECT createdAt, updatedAt, '1', id, costUnitPrice, lastImportPrice, saleUnitPrice, '0', createdBy, updatedBy FROM product;

INSERT INTO productstock (createdAt, updatedAt, branchId, productId, stockQuantity, manufacturingQuantity, deletedAt, createdBy, updatedBy)
SELECT createdAt, updatedAt, '1', id, stockQuantity, manufacturingQuantity, '0', createdBy, updatedBy FROM product;

ALTER TABLE `product` DROP COLUMN `costUnitPrice`;
ALTER TABLE `product` DROP COLUMN `lastImportPrice`;
ALTER TABLE `product` DROP COLUMN `saleUnitPrice`;
ALTER TABLE `product` DROP COLUMN `stockQuantity`;
ALTER TABLE `product` DROP COLUMN `manufacturingQuantity`;