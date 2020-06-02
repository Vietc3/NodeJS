/* Replace with your SQL commands */
ALTER TABLE `productstock` ADD `stockMin` double DEFAULT NULL;

UPDATE productstock ps
INNER JOIN product p ON p.id = ps.productId
SET ps.stockMin = p.stockMin;

ALTER TABLE `product` DROP COLUMN `stockMin`;

