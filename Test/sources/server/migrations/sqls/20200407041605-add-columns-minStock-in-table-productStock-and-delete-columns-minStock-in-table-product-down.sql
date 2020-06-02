/* Replace with your SQL commands */
ALTER TABLE `product` ADD `stockMin` double DEFAULT NULL;

UPDATE product p
INNER JOIN productstock ps ON ps.productId = p.id AND ps.branchId = "1"
SET p.stockMin = ps.stockMin;

ALTER TABLE `productstock` DROP COLUMN `stockMin`;