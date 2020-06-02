/* Replace with your SQL commands */
ALTER TABLE `product` ADD `type` int(11) DEFAULT NULL;

UPDATE `product` SET `type` = 1;