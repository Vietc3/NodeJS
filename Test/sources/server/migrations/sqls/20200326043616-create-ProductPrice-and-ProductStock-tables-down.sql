/* Replace with your SQL commands */

ALTER TABLE `product` ADD `costUnitPrice` double DEFAULT null;
ALTER TABLE `product` ADD `lastImportPrice` double DEFAULT null;
ALTER TABLE `product` ADD `saleUnitPrice` double DEFAULT null;
ALTER TABLE `product` ADD `stockQuantity` double DEFAULT null;
ALTER TABLE `product` ADD `manufacturingQuantity` double DEFAULT null;


UPDATE product p
INNER JOIN productprice pp ON pp.productId = p.id
INNER JOIN productstock ps ON ps.productId = p.id
SET p.costUnitPrice = pp.costUnitPrice, 
p.lastImportPrice = pp.lastImportPrice, 
p.saleUnitPrice = pp.saleUnitPrice, 
p.stockQuantity = ps.stockQuantity, 
p.manufacturingQuantity = ps.manufacturingQuantity;

DROP TABLE productprice;

DROP TABLE productstock;